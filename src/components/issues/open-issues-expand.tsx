import React, { useState, useEffect,Fragment } from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import AnchorLink from '../ui/links/anchor-link';
import { addCommit, stakeIssue } from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setRefetch } from '@/store/refetchSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

import EmptyList from '@/components/icons/EmptyList';
import PRSlider from '@/components/issues/pr-slider';

import { uploadMetadataToIPFS } from '@/lib/helpers/metadata';

import { ChevronDown } from '@/components/icons/chevron-down';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';

const sort = [
  { id: 1, name: 'Repository creator' },
  { id: 2, name: 'By amount of code contributed (minified)' },
  { id: 3, name: 'By duration of project involvement (compute intensive)' },
];

interface SortListProps{
  sort:any;
  selectedSubmitPR:any;
  setSelectedSubmitPR:React.Dispatch<React.SetStateAction<any>>;
}

const SortList:React.FC<SortListProps> = ({sort,selectedSubmitPR,setSelectedSubmitPR})=>{
  return (
    <div className="relative w-full">
      <Listbox value={selectedSubmitPR} onChange={setSelectedSubmitPR}>
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl border border-gray-700 bg-light-dark px-4 text-2xs text-white xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
          <div>
            {selectedSubmitPR.title.length > 21
              ? selectedSubmitPR.title.slice(0, 20) + '...'
              : selectedSubmitPR.title}
          </div>
          <div className="font-semibold">
            {selectedSubmitPR.id !== -1 ? '#' + selectedSubmitPR.id : null}
          </div>
          <ChevronDown />
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
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-dark p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item: any) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer flex items-center justify-between rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-gray-800' : 'hover:bg-gray-700'
                    }`}
                  >
                    <div>
                      {item.title.length > 21
                        ? item.title.slice(0, 20) + '...'
                        : item.title}
                    </div>
                    <div className="font-semibold">
                      {item.id !== -1
                        ? '#' + item.id
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
}

interface OpenIssueExpandProps {
  issueDesc: string;
  link: string;
  account: string;
  PRData: any;
}

const OpenIssueExpand: React.FC<OpenIssueExpandProps> = ({
  issueDesc,
  link,
  account,
  PRData,
}) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const wallet = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState<number>(0);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const userMappingState = useAppSelector(selectUserMapping);
  const [prLoading, setPrLoading] = React.useState<boolean>(false);

  const [expandState, setExpandState] = useState('issue');


  const [PRStakeAmount, setPRStakeAmount] = React.useState<number>(0);
  const [selectedPR, setSelectedPR] = useState<any>();

  const userInfo = useAppSelector((state) => state.userInfo.githubInfo);

  const [PRSort,setPRSort] = useState<any>([{
      id:-1,
      title:'Select Pull Request',
      PR_link:''
    }]);

  const [selectedSubmitPR, setSelectedSubmitPR] = useState<any>({
    id: -1,
    title: 'Select Pull Request',
    PR_link: '',
  });

  const handleStake = () => {
    if (stakeAmount <= 0) return;
    let resCalled = false;
    dispatch(onLoading('Staking tokens on the issue...'));
    stakeIssue(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      stakeAmount
    )
      .then((res) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: 'Issue Staking Successful',
            description: 'Check out your staking at',
            buttonText: 'Browse Issues',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Issue Staking Failed',
            description: err.message,
            redirect: null,
            buttonText: 'Continue',
            link: '',
          })
        );
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Issue Staking Successful',
              description: '',
              buttonText: 'Browse Issues',
              redirect: null,
              link: '',
            })
          );
          dispatch(setRefetch('issue'));
        }
      });
  };

  const handleCommitSubmit = () => {
    if (selectedSubmitPR?.PR_link === '' || !selectedSubmitPR?.PR_link.startsWith('https://github.com/')) return;
    dispatch(onLoading('Submitting your commit on the issue...'));
    const pullApiUrl = selectedSubmitPR?.PR_link
      .replace('https://github.com/', '')
      .replace('pull', 'pulls');

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
          let resCalled = false;

          var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${link?.replace(
              'https://github.com/',
              ''
            )}`,
            headers: {
              Authorization: `Bearer ${(session as any)?.accessToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          };

          const issueInfo = await axios(config)
            .then((res) => res.data)
            .catch((err) => console.log(err));

          const ipfsMetadata = await uploadMetadataToIPFS({
            issue_author_github: issueInfo.user.id,
            issue_title: issueInfo.title,
            issue_url: issueInfo.html_url,
            pr_url: res.data.html_url,
          });

          addCommit(
            wallet.publicKey as PublicKey,
            new PublicKey(account),
            new PublicKey(
              userMappingState.userMapping?.verifiedUserAccount as string
            ),
            latestCommit.commit.tree.sha,
            latestCommit.sha,
            ipfsMetadata
          )
            .then((res: any) => {
              resCalled = true;
              dispatch(
                onSuccess({
                  label: 'Issue Submit Commit Successful',
                  description: 'Check out your commit submit at',
                  buttonText: 'Browse Issues',
                  redirect: null,
                  link: res
                    ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
                    : '',
                })
              );
              dispatch(setRefetch('issue'));
            })
            .catch((err) => {
              resCalled = true;
              dispatch(
                onFailure({
                  label: 'Issue Submit Commit Failed',
                  description: err.message,
                  redirect: null,
                  buttonText: 'Continue',
                  link: '',
                })
              );
            })
            .finally(() => {
              if (!resCalled) {
                dispatch(
                  onSuccess({
                    label: 'Issue Submit Commit Successful',
                    description: '',
                    buttonText: 'Browse Issues',
                    redirect: null,
                    link: '',
                  })
                );
                dispatch(setRefetch('issue'));
              }
            });
        });
      })
      .catch((err) => {
        dispatch(
          onFailure({
            label: 'Issue Submit Commit Failed',
            description: err.message,
            redirect: null,
            buttonText: 'Continue',
            link: '',
          })
        );
      });
  };

  const getPRsToSelect = async () => {
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: link
        .replace('github.com', 'api.github.com/repos')
        .concat('/timeline'),
      headers: {
        Authorization: `Bearer ${(session as any)?.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    };
    const timeline = await axios(config)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const allPRs = timeline.filter(
      (item: any) => item.event === 'cross-referenced'
    );
    const MyPRs = allPRs.filter((item: any) => item.actor.id === userInfo.id && item.source.issue.state==='open');
    const _sortlistPRs = MyPRs.map((item:any)=>{
      return {
        id:item?.source?.issue?.number,
        title:item?.source?.issue?.title,
        PR_link:item?.source?.issue?.html_url
      }
    })
    const _listPRs = [
      {
        id: -1,
        title: 'Select Pull Request',
        PR_link: '',
      },
      ..._sortlistPRs,
    ];
    setPRSort(_listPRs)
  }

  useEffect(() => {
    if (!link.includes('github.com')) return;
    getPRsToSelect();
  }, [link]);

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex items-center gap-4">
        <Button
          color={expandState === 'issue' ? 'info' : 'primary'}
          size="mini"
          shape="rounded"
          onClick={(e) => setExpandState('issue')}
        >
          Issue
        </Button>
        <Button
          color={expandState === 'pull request' ? 'info' : 'primary'}
          size="mini"
          shape="rounded"
          onClick={(e) => setExpandState('pull request')}
        >
          Pull Request
        </Button>
      </div>
      {expandState === 'issue' && (
        <div className="flex w-full justify-between gap-5 py-5 text-xs xl:text-sm 3xl:text-base">
          <div className="flex w-1/2 flex-col gap-3">
            <strong>Description</strong>
            <div className="tracking-wider">
              {issueDesc.length === 0 && 'No Description available'}
              {issueDesc.length > 250
                ? issueDesc.slice(0, 240) + '...'
                : issueDesc}
            </div>
            <AnchorLink href={link} target="_blank">
              <strong className="underline">view Thread on Github</strong>
            </AnchorLink>
          </div>
          <div className="flex w-1/2 flex-col gap-3">
            <div className="flex-flex-col w-full">
              <div className="mb-2">Speed Up 🚅</div>
              <div className="flex w-full items-center justify-center gap-2">
                <Input
                  type="text"
                  placeholder="Stake Amount"
                  inputClassName="w-full !h-10 !my-0"
                  className="w-full"
                  onChange={(e) => {
                    setStakeAmount(parseFloat(e.target.value));
                  }}
                />
                <Button
                  color="success"
                  size="small"
                  shape="rounded"
                  onClick={handleStake}
                  isLoading={stateLoading === 'loading'}
                >
                  Stake
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {expandState === 'pull request' && (
        <div className="flex w-full flex-col justify-between gap-5 py-5">
          {PRData.length > 0 && (
            <div className="flex w-full flex-row items-center justify-between">
              <PRSlider
                PRs={PRData}
                selectedPR={selectedPR}
                setSelectedPR={setSelectedPR}
              />
            </div>
          )}
          {PRData.length === 0 && (
            <div className="flex w-full flex-col items-center justify-center gap-5">
              <EmptyList />
              <div className="text-lg text-gray-500">
                No PRs available on this issue.
              </div>
            </div>
          )}
          <div className="flex w-full items-end gap-5">
            {PRData.length > 0 && (
              <div className="flex-flex-col w-1/3">
                <div className="mb-2">Stake On Pull Request 💸</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Stake Amount"
                    inputClassName="w-full !h-10 !my-0"
                    className="w-full"
                    onChange={(e) => {
                      setPRStakeAmount(parseFloat(e.target.value));
                    }}
                  />
                  <Button
                    color="success"
                    size="small"
                    shape="rounded"
                    // onClick={handleStake}
                    isLoading={stateLoading === 'loading'}
                  >
                    Stake
                  </Button>
                </div>
              </div>
            )}
            <div className="flex-flex-col w-1/3">
              <div className="mb-2">Build 🛠️</div>
              <div className="flex w-full items-center justify-center gap-2">
                <SortList sort={PRSort} selectedSubmitPR={selectedSubmitPR} setSelectedSubmitPR={setSelectedSubmitPR} />
                <Button
                  color="info"
                  size="small"
                  shape="rounded"
                  onClick={handleCommitSubmit}
                  isLoading={stateLoading === 'loading'}
                >
                  Submit
                </Button>
              </div>
            </div>
            {PRData.length > 0 && (
              <Button
                color="info"
                size="small"
                shape="rounded"
                isLoading={stateLoading === 'loading'}
              >
                Merge Selected Pull Request
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenIssueExpand;
