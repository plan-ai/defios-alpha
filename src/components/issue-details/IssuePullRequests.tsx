import React, { useState, useEffect, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import cn from 'classnames';
import axios from '@/lib/axiosClient';
import mixpanel from 'mixpanel-browser';

//redux
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

//ui components
import Spinner from '@/components/custom/spinner';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';
import AnchorLink from '../ui/links/anchor-link';
import Button from '@/components/ui/button/ButtonNew';

//icons
import { ChevronDown } from '@/components/icons/chevron-down';
import { CheckIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import EmptyList from '@/components/icons/EmptyList';

//contract functions
import {
  addPullRequest,
  claimReward,
  votePr,
} from '@/lib/helpers/contractInteract';

//contract utils
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

//components
import PRBox from '@/components/issue-details/PRBox';

interface SortListProps {
  sort: any;
  selectedSubmitPR: any;
  setSelectedSubmitPR: React.Dispatch<React.SetStateAction<any>>;
}
// shows prs by user on the issue
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
            {selectedSubmitPR.title.length > 60
              ? selectedSubmitPR.title.slice(0, 60) + '...'
              : selectedSubmitPR.title}
          </div>
          <div className="font-semibold">
            {selectedSubmitPR.id !== -1 ? '#' + selectedSubmitPR.id : null}
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
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-zinc-900' : 'hover:bg-zinc-700'
                    }`}
                  >
                    <div>
                      {item.title.length > 60
                        ? item.title.slice(0, 60) + '...'
                        : item.title}
                    </div>
                    <div className="font-semibold">
                      {item.id !== -1 ? '#' + item.id : null}
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

interface IssuePullRequestsProps {
  issueData: any;
  tokenDetails: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const IssuePullRequests: React.FC<IssuePullRequestsProps> = ({
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

  const [PRSort, setPRSort] = useState<any>([
    {
      id: -1,
      title: 'select the pull request that you wish to submit',
      PR_link: '',
    },
  ]);

  const [selectedSubmitPR, setSelectedSubmitPR] = useState<any>({
    id: -1,
    title: 'select the pull request that you wish to submit',
    PR_link: '',
  });

  const [PRSubmitted, setPRSubmitted] = useState(false);
  const [PRSubmittedLink, setPRSubmittedLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const handlePRSubmit = () => {
    if (
      selectedSubmitPR?.PR_link === '' ||
      !selectedSubmitPR?.PR_link.startsWith('https://github.com/')
    )
      return;
    setIsSubmitting(true);
    dispatch(onLoading('Submitting your pull request on the issue...'));
    //getting commit tree hash,commit hash
    const pullApiUrl = selectedSubmitPR?.PR_link.replace(
      'https://github.com/',
      ''
    ).replace('pull', 'pulls');

    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.github.com/repos/${pullApiUrl}`,
      headers: {
        Authorization: `Bearer ${(session as any)?.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    };

    axios(config)
      .then((res) => {
        const commits = res.data.commits_url;

        var commitsConfig = {
          method: 'get',
          maxBodyLength: Infinity,
          url: commits,
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        };

        axios(commitsConfig).then(async (commitRes) => {
          const latestCommit = commitRes.data[commitRes.data.length - 1];

          addPullRequest(
            wallet.publicKey as PublicKey,
            new PublicKey(issueData?.issue_account),
            new PublicKey(
              userMappingState.userMapping?.verifiedUserAccount as string
            ),
            latestCommit.commit.tree.sha,
            latestCommit.sha,
            res.data.html_url
          )
            .then((resp: any) => {
              setIsSubmitting(false);
              dispatch(
                onSuccess({
                  label: 'Issue Submit Pull Request Successful',
                  description: 'Check out your commit submit at',
                  redirect: null,
                  link: resp
                    ? `https://solscan.io/account/${resp.toString()}?cluster=devnet`
                    : '',
                })
              );
              mixpanel.track('PR Submit Success', {
                github_id: userMappingState.userMapping?.userName,
                user_pubkey: userMappingState.userMapping?.userPubkey,
                tx_link: resp
                  ? `https://solscan.io/account/${resp.toString()}?cluster=devnet`
                  : '',
                issue_account: issueData?.issue_account,
                issue_github_link: issueData?.issue_gh_url,
                PR_github_link: res.data.html_url,
                tree_hash_unsliced: latestCommit.commit.tree.sha,
                commit_hash_unsliced: latestCommit.sha,
              });
              setRefetch((state) => state + 1);
            })
            .catch((err) => {
              setIsSubmitting(false);
              dispatch(
                onFailure({
                  label: 'Issue Submit Pull Request Failed',
                  description: err.message,
                  redirect: null,
                  link: '',
                })
              );
              mixpanel.track('PR Submit Failed', {
                github_id: userMappingState.userMapping?.userName,
                user_pubkey: userMappingState.userMapping?.userPubkey,
                error: err.message,
              });
            });
        });
      })
      .catch((err) => {
        setIsSubmitting(false);
        dispatch(
          onFailure({
            label: 'Issue Submit Pull Request Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('PR Submit GH Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  const handleClaim = async () => {
    if (issueData?.rewardee !== wallet.publicKey?.toString()) return;

    const winner = issueData?.issue_prs?.filter((item: any) => {
      return item?.issue_pr_author === issueData?.rewardee;
    })?.[0];

    if (
      winner === null ||
      winner === undefined ||
      Object.keys(winner).length === 0
    )
      return;

    dispatch(onLoading('Claiming tokens for solving the issue...'));
    setIsClaiming(true);
    claimReward(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(winner.issue_pr_account),
      new PublicKey(issueData?.issue_token?.token_spl_addr)
    )
      .then((res) => {
        dispatch(
          onSuccess({
            label: 'Issue Reward Claiming Successful',
            description: 'check out the tx at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Issue Reward Claim Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: issueData?.issue_account,
          issue_github_link: issueData?.issue_gh_url,
          token_address: issueData?.issue_token?.token_spl_addr,
          PR_account: winner?.issue_pr_account,
          PR_github_link: winner?.issue_pr_github,
          reward_amount: issueData?.issue_stake_amount,
          rewardee: issueData?.rewardee,
        });
        setIsClaiming(false);
        setRefetch((state) => state + 1);
      })
      .catch((err) => {
        setIsClaiming(false);
        dispatch(
          onFailure({
            label: 'Issue Reward Claiming Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Issue Reward Claim Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  const handleVoting = async (prData: any) => {
    if (
      prData === null ||
      prData === undefined ||
      prData.issue_pr_account === null ||
      prData.issue_pr_account === undefined
    )
      return;

    dispatch(onLoading('Voting on the pull request...'));
    votePr(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(prData.issue_pr_account)
    )
      .then((res) => {
        dispatch(
          onSuccess({
            label: 'Voting Pull Request Successful',
            description: 'check out the tx at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Voting Pull Request Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: issueData?.issue_account,
          issue_github_link: issueData?.issue_gh_url,
          PR_account: prData?.issue_pr_account,
          PR_github_link: prData?.issue_pr_github,
        });
        setRefetch((state) => state + 1);
      })
      .catch((err) => {
        dispatch(
          onFailure({
            label: 'Voting Pull Request Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Voting Pull Request Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  //fetches prs on issue by user
  const getPRsToSelect = async () => {
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: issueData?.issue_gh_url
        .replace('github.com', 'api.github.com/repos')
        .concat('/timeline'),
      headers: {
        Authorization: `Bearer ${(session as any)?.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    };
    //fetch timeline
    const timeline = await axios(config)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    //prs have event as cross-referenced
    const allPRs = timeline.filter(
      (item: any) => item.event === 'cross-referenced'
    );

    //my prs out of all users
    const MyPRs = allPRs.filter(
      (item: any) =>
        !issueData?.issue_prs?.some(
          (e: any) => e.issue_pr_link === item.source.issue.html_url
        ) &&
        item.actor.id === userInfo.id &&
        item.source.issue.state === 'open'
    );

    //filter required params
    const _sortlistPRs = MyPRs.map((item: any) => {
      return {
        id: item?.source?.issue?.number,
        title: item?.source?.issue?.title,
        PR_link: item?.source?.issue?.html_url,
      };
    });

    const _listPRs = [
      {
        id: -1,
        title: 'Select Pull Request',
        PR_link: '',
      },
      ..._sortlistPRs,
    ];
    setPRSort(_listPRs);
  };

  useEffect(() => {
    if (
      issueData !== null &&
      issueData !== undefined &&
      issueData.issue_gh_url !== null &&
      issueData.issue_gh_url !== undefined
    ) {
      const filteredPrs = issueData?.issue_prs?.filter((item: any) => {
        return (
          item.issue_pr_author === userMappingState.userMapping?.userPubkey
        );
      });
      if (filteredPrs.length > 0) {
        setPRSubmitted(true);
        setPRSubmittedLink(filteredPrs[0].issue_pr_link);
      } else {
        setPRSubmitted(false);
        setPRSubmittedLink('');
        getPRsToSelect();
      }
    }
  }, [issueData, section]);

  return (
    <div className="mt-16 flex w-full items-center justify-end text-sm xl:text-base 3xl:text-lg">
      {section === 1 && (
        <div className="mx-auto flex w-[46rem] w-full flex-col items-center gap-8">
          <div className="flex w-full items-center justify-between text-3xl xl:text-4xl 3xl:text-5xl">
            <div className="textShadowWhite">total rewards: </div>
            <div className="textShadowGreen text-new-green">
              {Math.round(
                (issueData?.issue_stake_amount * 100) /
                  10 ** tokenDetails?.decimals
              ) / 100}
            </div>
          </div>
          <div className="my-8 flex flex-col items-center gap-2 text-center text-base xl:text-lg 3xl:text-xl">
            {/* no winner and not submitted */}
            {!PRSubmitted &&
              (issueData.rewardee === undefined ||
                issueData.rewardee === '' ||
                issueData.rewardee === null) && (
                <>
                  <div>
                    submit a pull request that solves this issue for a chance to
                    win the reward.
                  </div>
                  <div>
                    if your pull request gets merged, you&apos;ll receive the
                    rewards automatically
                  </div>
                </>
              )}

            {/* no winner but user submitted PR */}
            {PRSubmitted &&
              (issueData.rewardee === undefined ||
                issueData.rewardee === '' ||
                issueData.rewardee === null) && (
                <>
                  <div>
                    your PR has been added. if your PR solves this issue and
                    gets merged by the
                  </div>
                  <div>
                    repository owner, you&apos;ll receive the rewards
                    immediately in your wallet
                  </div>
                </>
              )}

            {/* issue solved / closed , you are not winner */}
            {issueData.rewardee !== undefined &&
              issueData.rewardee !== '' &&
              issueData.rewardee !== null &&
              issueData.rewardee !== wallet.publicKey?.toString() && (
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

            {/* issue solved / closed and you winner */}
            {issueData.rewardee !== undefined &&
              issueData.rewardee !== '' &&
              issueData.rewardee !== null &&
              issueData.rewardee === wallet.publicKey?.toString() && (
                <>
                  <div>
                    Congratulations! your pull request has been reviewed and
                    merged
                  </div>
                  <div>
                    claim your rewards for solving the issue and happy open
                    source!
                  </div>
                </>
              )}
          </div>

          {/* Submit PR */}
          {/* no pr submitted by you */}
          {!PRSubmitted &&
            (issueData.rewardee === undefined ||
              issueData.rewardee === '' ||
              issueData.rewardee === null) && (
              <div className="flex w-full items-center justify-center gap-4">
                <SortList
                  sort={PRSort}
                  selectedSubmitPR={selectedSubmitPR}
                  setSelectedSubmitPR={setSelectedSubmitPR}
                />
                <Button
                  color="PrimarySolid"
                  onClick={() => {
                    if (!isSubmitting) handlePRSubmit();
                  }}
                  isLoading={isSubmitting}
                >
                  submit
                </Button>
              </div>
            )}

          {/* pr submitted by you */}
          {PRSubmitted &&
            (issueData.rewardee === undefined ||
              issueData.rewardee === '' ||
              issueData.rewardee === null) && (
              <div className="flex flex-col items-center justify-center gap-10">
                <Button color="GreenOutline" size="small">
                  <CheckIcon className="h-7 w-7" />
                  <div>Submitted</div>
                </Button>
                <AnchorLink
                  href={PRSubmittedLink}
                  target="_blank"
                  className="text-base text-white underline xl:text-lg 3xl:text-xl"
                >
                  view your pull request
                </AnchorLink>
              </div>
            )}

          {/* issue solved , you are not winner  */}
          {issueData.rewardee !== undefined &&
            issueData.rewardee !== '' &&
            issueData.rewardee !== null &&
            issueData.rewardee !== wallet.publicKey?.toString() && (
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

          {/* issue solved you are winner */}
          {issueData.rewardee !== undefined &&
            issueData.rewardee !== '' &&
            issueData.rewardee !== null &&
            issueData.rewardee === wallet.publicKey?.toString() && (
              <div className="flex flex-col items-center justify-center gap-10">
                <Button
                  color="GreenOutline"
                  size="medium"
                  onClick={() => {
                    if (issueData?.reward_claimed !== true) {
                      handleClaim();
                    }
                  }}
                  isLoading={isClaiming}
                >
                  <BanknotesIcon className="h-7 w-7" />
                  <div>
                    {issueData?.reward_claimed === true
                      ? 'Reward Claimed'
                      : 'Claim Reward'}
                  </div>
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
                  view your winning pull request
                </AnchorLink>
              </div>
            )}
        </div>
      )}
      {section === 2 && (
        <div className="mx-32 flex w-full flex-col items-center gap-8">
          {/* issue not solved */}
          {(issueData.rewardee === undefined ||
            issueData.rewardee === '' ||
            issueData.rewardee === null) && (
            <>
              <div className="textShadowWhite mb-8 text-xl font-semibold xl:text-2xl 3xl:text-3xl">
                Vote for a PR
              </div>
              {issueData.issue_prs.length > 0 &&
                issueData?.issue_prs.map((item: any, idx: number) => {
                  return (
                    <PRBox
                      prData={item}
                      totalPower={tokenDetails?.totalPower || 0}
                      key={idx}
                      voted={tokenDetails?.voted || false}
                      votingPower={tokenDetails?.votingPower || 0}
                      isOwner={false}
                      votingFunc={handleVoting}
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
          {/* issue solved  */}
          {issueData.rewardee !== undefined &&
            issueData.rewardee !== '' &&
            issueData.rewardee !== null && (
              <>
                <div className="textShadowWhite mb-8 text-xl font-semibold xl:text-2xl 3xl:text-3xl">
                  Issue Solved, PR Merged!
                </div>
                {/* winner pr  */}
                {issueData?.issue_prs
                  .filter((_item: any) => {
                    return _item?.issue_pr_author === issueData.rewardee;
                  })
                  .map((item: any, idx: number) => {
                    return (
                      <PRBox
                        prData={item}
                        totalPower={tokenDetails?.totalPower || 0}
                        key={idx}
                        voted={false}
                        votingPower={0}
                        isOwner={false}
                        isClosed={true}
                        isWinner={true}
                        claimable={
                          item?.issue_pr_author === wallet.publicKey?.toString()
                        }
                        claimed={issueData?.reward_claimed}
                        claimFunc={handleClaim}
                      />
                    );
                  })}
                {/* rest prs  */}
                {issueData?.issue_prs
                  .filter((_item: any) => {
                    return _item?.issue_pr_author !== issueData.rewardee;
                  })
                  .map((item: any, idx: number) => {
                    return (
                      <PRBox
                        prData={item}
                        totalPower={tokenDetails?.totalPower || 0}
                        key={idx}
                        voted={false}
                        votingPower={0}
                        isOwner={false}
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

export default IssuePullRequests;
