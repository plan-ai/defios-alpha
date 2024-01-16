import React, { useState, useEffect, Fragment } from 'react';
import cn from 'classnames';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import mixpanel from 'mixpanel-browser';

//redux
import { useAppDispatch, useAppSelector } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { selectUserMapping } from '@/store/userMappingSlice';

//ui components
import Spinner from '@/components/custom/spinner';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';
import Button from '@/components/ui/button/ButtonNew';

//icons
import { ChevronDown } from '@/components/icons/chevron-down';
import { CheckIcon } from '@heroicons/react/24/solid';
import EmptyList from '@/components/icons/EmptyList';

//contract functions , utils
import { acceptPr } from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

//components
import PRBox from '@/components/issue-details/PRBox';
import AnchorLink from '../ui/links/anchor-link';

interface SortListProps {
  sort: any;
  selectedSubmitPR: any;
  setSelectedSubmitPR: React.Dispatch<React.SetStateAction<any>>;
}
//all submitted prs on defi-os.com
const SortList: React.FC<SortListProps> = ({
  sort,
  selectedSubmitPR,
  setSelectedSubmitPR,
}) => {
  return (
    <div className="relative w-full">
      <Listbox value={selectedSubmitPR} onChange={setSelectedSubmitPR}>
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl bg-light-gray px-4 text-2xs text-white xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
          <div>
            {selectedSubmitPR?.issue_pr_title?.length > 60
              ? selectedSubmitPR?.issue_pr_title.slice(0, 60) + '...'
              : selectedSubmitPR?.issue_pr_title}
          </div>
          <div className="font-semibold">
            {selectedSubmitPR.issue_pr_link !== null &&
            selectedSubmitPR.issue_pr_link !== undefined &&
            selectedSubmitPR.issue_pr_link !== ''
              ? '#' +
                selectedSubmitPR?.issue_pr_link?.split('/')?.[
                  selectedSubmitPR?.issue_pr_link?.split('/')?.length - 1
                ]
              : null}
          </div>
          <ChevronDown className="w-6 text-gray-400" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-light-gray p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item: any) => (
              <Listbox.Option
                key={
                  item?.issue_pr_link?.split('/')?.[
                    item?.issue_pr_link?.split('/')?.length - 1
                  ]
                }
                value={item}
              >
                {({ selected }) => (
                  <div
                    className={`block flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-zinc-900' : 'hover:bg-zinc-700'
                    }`}
                  >
                    <div>
                      {item?.issue_pr_title?.length > 60
                        ? item?.issue_pr_title.slice(0, 60) + '...'
                        : item?.issue_pr_title}
                    </div>
                    <div className="font-semibold">
                      {item.issue_pr_link !== null &&
                      item.issue_pr_link !== undefined &&
                      item.issue_pr_link !== ''
                        ? '#' +
                          item?.issue_pr_link?.split('/')?.[
                            item?.issue_pr_link?.split('/')?.length - 1
                          ]
                        : null}
                    </div>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

interface IssuePullRequestsOwnerProps {
  issueData: any;
  tokenDetails: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const IssuePullRequestsOwner: React.FC<IssuePullRequestsOwnerProps> = ({
  issueData,
  tokenDetails,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const userInfo = useAppSelector((state) => state.userInfo.githubInfo);
  const wallet = useWallet();
  const { data: session } = useSession();
  const userMappingState = useAppSelector(selectUserMapping);

  const [section, setSection] = useState(1);

  const [isMerging, setIsMerging] = useState(false);

  const [PRSort, setPRSort] = useState<any>([
    {
      issue_pr_title: 'select the pull request that you wish to merge',
      issue_pr_link: null,
    },
  ]);

  const [selectedSubmitPR, setSelectedSubmitPR] = useState<any>({
    issue_pr_title: 'select the pull request that you wish to merge',
    issue_pr_link: null,
  });

  useEffect(() => {
    if (
      issueData !== null &&
      issueData !== undefined &&
      issueData.issue_prs !== null &&
      issueData.issue_prs !== undefined &&
      issueData.issue_prs.length > 0
    ) {
      setPRSort([
        {
          issue_pr_title: 'select the pull request that you wish to merge',
          issue_pr_link: null,
        },
        ,
        ...issueData.issue_prs,
      ]);
    }
  }, [issueData, section]);

  const handleAcceptPR = (prData: any) => {
    dispatch(onLoading('Merging pull request...'));
    setIsMerging(true);
    acceptPr(
      new PublicKey(prData.issue_pr_account),
      new PublicKey(issueData?.issue_account)
    )
      .then((res) => {
        const pullApiUrl = prData.issue_pr_link
          .replace('https://github.com/', '')
          .replace('pull', 'pulls');

        var config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: `https://api.github.com/repos/${pullApiUrl}/merge`,
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        };

        axios(config)
          .then((resp) => {
            setIsMerging(false);
            dispatch(
              onSuccess({
                label: 'Pull Request merging Successful',
                description: 'Check out your merging at',
                redirect: null,
                link: res
                  ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
                  : '',
              })
            );
            mixpanel.track('PR Merge Success', {
              github_id: userMappingState.userMapping?.userName,
              user_pubkey: userMappingState.userMapping?.userPubkey,
              tx_link: res
                ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
                : '',
              issue_account: issueData?.issue_account,
              issue_github_link: issueData?.issue_gh_link,
              token_address: issueData?.issue_token?.token_spl_addr,
              PR_account: prData.issue_pr_account,
              PR_github_link: prData.issue_pr_github,
            });
            setRefetch((state) => state + 1);
          })
          .catch((err) => {
            setIsMerging(false);
            dispatch(
              onFailure({
                label: 'Pull Request Merging Failed',
                description: err.message,
                redirect: null,
                link: '',
              })
            );
            mixpanel.track('PR Merge Failed', {
              github_id: userMappingState.userMapping?.userName,
              user_pubkey: userMappingState.userMapping?.userPubkey,
              error: err.message,
            });
          });
      })
      .catch((err) => {
        setIsMerging(false);
        dispatch(
          onFailure({
            label: 'Pull Request Merging Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('PR Merge GH Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  const handleSelectedMerge = async () => {
    if (
      selectedSubmitPR.issue_pr_link === null ||
      selectedSubmitPR.issue_pr_link === undefined ||
      selectedSubmitPR.issue_pr_link === ''
    )
      return;
    handleAcceptPR(selectedSubmitPR);
  };

  return (
    <div className="mt-16 flex w-full items-center justify-end text-sm xl:text-base 3xl:text-lg">
      {section === 1 && (
        <div className="mx-auto flex w-[46rem] w-full flex-col items-center gap-8">
          <div className="flex w-full items-center justify-between text-3xl xl:text-4xl 3xl:text-5xl">
            <div className="textShadowWhite">total rewards: </div>
            <div className="textShadowGreen text-new-green">
              {issueData?.issue_stake_amount}
            </div>
          </div>
          <div className="my-8 flex flex-col items-center gap-2 text-center text-base xl:text-lg 3xl:text-xl">
            {/* no winner */}
            {(issueData.rewardee === undefined ||
              issueData.rewardee === '' ||
              issueData.rewardee === null) && (
              <>
                <div>
                  as the repository owner, you can directly merge your PR that
                  solves this issue to claim all the
                </div>
                <div>
                  rewards you can also scroll down & review the current PRs to
                  reward someone else
                </div>
              </>
            )}

            {/* winner decided  */}
            {issueData.rewardee !== undefined &&
              issueData.rewardee !== '' &&
              issueData.rewardee !== null && (
                <>
                  <div>
                    issue has been solved, pull request has been reviewed and
                    merged
                  </div>
                  <div>
                    by the repository owner, the solver has been rewarded the
                    staked tokens.
                  </div>
                </>
              )}
          </div>

          {/* Submit PR */}

          {/* no winner  */}
          {(issueData.rewardee === undefined ||
            issueData.rewardee === '' ||
            issueData.rewardee === null) && (
            <div className="flex w-full items-center justify-center gap-4">
              <SortList
                sort={PRSort}
                selectedSubmitPR={selectedSubmitPR}
                setSelectedSubmitPR={setSelectedSubmitPR}
              />
              <Button
                color={PRSort.length <= 1 ? 'GraySolid' : 'PrimarySolid'}
                onClick={() => {
                  if (!isMerging) {
                    handleSelectedMerge();
                  }
                }}
                disabled={PRSort.length <= 1}
                isLoading={isMerging}
              >
                merge
              </Button>
            </div>
          )}

          {/* winner decided */}
          {issueData.rewardee !== undefined &&
            issueData.rewardee !== '' &&
            issueData.rewardee !== null && (
              <div className="flex flex-col items-center justify-center gap-10">
                <Button color="GreenOutline" size="small">
                  <CheckIcon className="h-7 w-7" />
                  <div>Solved</div>
                </Button>
                <AnchorLink
                  href={
                    issueData?.issue_prs.filter((_item: any) => {
                      return _item?.issue_pr_author === issueData.rewardee;
                    })?.[0]?.issue_pr_link || ''
                  }
                  target="_blank"
                  className="text-base text-white underline xl:text-lg 3xl:text-xl"
                >
                  view winner pull request
                </AnchorLink>
              </div>
            )}
        </div>
      )}
      {section === 2 && (
        <div className="mx-32 flex w-full flex-col items-center gap-8">
          {/* no winner */}
          {(issueData.rewardee === undefined ||
            issueData.rewardee === '' ||
            issueData.rewardee === null) && (
            <>
              <div className="textShadowWhite mb-8 text-xl font-semibold xl:text-2xl 3xl:text-3xl">
                Merge a PR
              </div>
              {issueData.issue_prs.length > 0 &&
                issueData?.issue_prs.map((item: any, idx: number) => {
                  return (
                    <PRBox
                      prData={item}
                      totalPower={issueData?.issue_stake_amount}
                      key={idx}
                      voted={false}
                      votingPower={0}
                      isOwner={true}
                      mergeFunc={handleAcceptPR}
                      isMerging={isMerging}
                    />
                  );
                })}
              {issueData.issue_prs.length == 0 && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                  <EmptyList />
                  <div className="text-lg text-gray-500">
                    No Pull Requests Available
                  </div>
                </div>
              )}
            </>
          )}

          {/* winner decided */}
          {issueData.rewardee !== undefined &&
            issueData.rewardee !== '' &&
            issueData.rewardee !== null && (
              <>
                <div className="textShadowWhite mb-8 text-xl font-semibold xl:text-2xl 3xl:text-3xl">
                  Issue Solved, PR Merged!
                </div>

                {/* winner pr */}
                {issueData !== null &&
                  issueData !== undefined &&
                  issueData.issue_prs !== null &&
                  issueData.issue_prs !== undefined &&
                  issueData.issue_prs
                    .filter((_item: any) => {
                      return _item?.issue_pr_author === issueData.rewardee;
                    })
                    .map((item: any, idx: number) => {
                      return (
                        <PRBox
                          prData={item}
                          totalPower={issueData?.issue_stake_amount}
                          key={idx}
                          voted={false}
                          votingPower={0}
                          isOwner={true}
                          isClosed={true}
                          isWinner={true}
                        />
                      );
                    })}

                {/* rest prs */}
                {issueData !== null &&
                  issueData !== undefined &&
                  issueData.issue_prs !== null &&
                  issueData.issue_prs !== undefined &&
                  issueData.issue_prs
                    .filter((_item: any) => {
                      return _item?.issue_pr_author !== issueData.rewardee;
                    })
                    .map((item: any, idx: number) => {
                      return (
                        <PRBox
                          prData={item}
                          totalPower={issueData?.issue_stake_amount}
                          key={idx}
                          voted={false}
                          votingPower={0}
                          isOwner={true}
                          isClosed={true}
                        />
                      );
                    })}
              </>
            )}
        </div>
      )}
      {/* switcher */}
      <div className="flex flex-col items-center gap-8">
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 1,
            'h-4 w-4': section !== 1,
          })}
          onClick={() => setSection(1)}
        ></div>
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 2,
            'h-4 w-4': section !== 2,
          })}
          onClick={() => setSection(2)}
        ></div>
      </div>
    </div>
  );
};

export default IssuePullRequestsOwner;
