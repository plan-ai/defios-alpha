import React, { useState, useEffect, Fragment } from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import AnchorLink from '../ui/links/anchor-link';
import {
  addPullRequest,
  acceptPr,
  stakeIssue,
  unstakeIssue,
  stakePr,
  unstakePr,
} from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setRefetch } from '@/store/refetchSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

import EmptyList from '@/components/icons/EmptyList';
import PRSlider from '@/components/issues/pr-slider';

import { uploadMetadataToIPFS, getTokenBalance } from '@/lib/helpers/metadata';

import { ChevronDown } from '@/components/icons/chevron-down';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';

import mixpanel from 'mixpanel-browser';

const sort = [
  { id: 1, name: 'Repository creator' },
  { id: 2, name: 'By amount of code contributed (minified)' },
  { id: 3, name: 'By duration of project involvement (compute intensive)' },
];

interface SortListProps {
  sort: any;
  selectedSubmitPR: any;
  setSelectedSubmitPR: React.Dispatch<React.SetStateAction<any>>;
}

const SortList: React.FC<SortListProps> = ({
  sort,
  selectedSubmitPR,
  setSelectedSubmitPR,
}) => {
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
                    className={`block flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-gray-800' : 'hover:bg-gray-700'
                    }`}
                  >
                    <div>
                      {item.title.length > 21
                        ? item.title.slice(0, 20) + '...'
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

interface OpenIssueExpandProps {
  issueDesc: string;
  link: string;
  account: string;
  PRData: any;
  issueCreatorGH: string;
  issueTokenAddress: string;
}

const OpenIssueExpand: React.FC<OpenIssueExpandProps> = ({
  issueDesc,
  link,
  account,
  PRData,
  issueCreatorGH,
  issueTokenAddress,
}) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const wallet = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState<number>(0);
  const { data: session } = useSession();
  const userMappingState = useAppSelector(selectUserMapping);

  const [expandState, setExpandState] = useState('issue');

  const [PRStakeAmount, setPRStakeAmount] = React.useState<number>(0);
  const [selectedPR, setSelectedPR] = useState<any>();

  const userInfo = useAppSelector((state) => state.userInfo.githubInfo);
  const [userTokenInfo, setUserTokenInfo] = useState<any>(null);

  const refetchPart = useAppSelector((state)=> state.refetch.refetchPart);

  const [PRSort, setPRSort] = useState<any>([
    {
      id: -1,
      title: 'Select Pull Request',
      PR_link: '',
    },
  ]);

  const [selectedSubmitPR, setSelectedSubmitPR] = useState<any>({
    id: -1,
    title: 'Select Pull Request',
    PR_link: '',
  });

  const handleIssueStake = () => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (stakeAmount <= 0) return;
    let resCalled = false;
    dispatch(onLoading('Staking tokens on the issue...'));
    stakeIssue(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      stakeAmount,
      new PublicKey(issueTokenAddress),
      firebase_jwt
    )
      .then((res) => {
        resCalled = true;
        setStakeAmount(0);
        dispatch(
          onSuccess({
            label: 'Issue Staking Successful',
            description: 'Check out your staking at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Issue Staking Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: account,
          token_address: issueTokenAddress,
          stake_amount: stakeAmount,
          issue_github_link: link,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        resCalled = true;
        setStakeAmount(0);
        dispatch(
          onFailure({
            label: 'Issue Staking Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Issue Staking Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          setStakeAmount(0);
          dispatch(
            onSuccess({
              label: 'Issue Staking Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Issue Staking Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          dispatch(setRefetch('issue'));
        }
      });
  };

  const handleIssueUnstake = () => {
    let resCalled = false;
    dispatch(onLoading('Unstaking tokens on the issue...'));
    unstakeIssue(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      new PublicKey(issueTokenAddress)
    )
      .then((res) => {
        resCalled = true;
        setStakeAmount(0);
        dispatch(
          onSuccess({
            label: 'Issue Unstaking Successful',
            description: 'Check out your unstaking at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Issue Unstaking Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: account,
          token_address: issueTokenAddress,
          issue_github_link: link,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        resCalled = true;
        setStakeAmount(0);
        dispatch(
          onFailure({
            label: 'Issue Unstaking Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Issue Unstaking Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          setStakeAmount(0);
          dispatch(
            onSuccess({
              label: 'Issue Unstaking Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Issue Unstaking Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          dispatch(setRefetch('issue'));
        }
      });
  };

  const handlePRStake = () => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (selectedPR === undefined || selectedPR === null) return;
    if (
      selectedPR.issue_pr_account === null ||
      selectedPR.issue_pr_account === undefined
    )
      return;
    if (PRStakeAmount <= 0) return;
    let resCalled = false;
    dispatch(onLoading('Staking tokens on the pull request...'));
    stakePr(
      wallet.publicKey as PublicKey,
      new PublicKey(selectedPR.issue_pr_account),
      PRStakeAmount,
      new PublicKey(issueTokenAddress),
      firebase_jwt
    )
      .then((res) => {
        resCalled = true;
        setPRStakeAmount(0);
        dispatch(
          onSuccess({
            label: 'Pull Request Staking Successful',
            description: 'Check out your staking at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('PR Staking Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: account,
          issue_github_link: link,
          token_address: issueTokenAddress,
          stake_amount: stakeAmount,
          PR_account: selectedPR.issue_pr_account,
          PR_github_link: selectedPR.issue_pr_github,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        resCalled = true;
        setPRStakeAmount(0);
        dispatch(
          onFailure({
            label: 'Pull Request Staking Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('PR Staking Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          setPRStakeAmount(0);
          dispatch(
            onSuccess({
              label: 'Pull Request Staking Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('PR Staking Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          dispatch(setRefetch('issue'));
        }
      });
  };

  const handlePRUnstake = () => {
    if (selectedPR === undefined || selectedPR === null) return;
    if (
      selectedPR.issue_pr_account === null ||
      selectedPR.issue_pr_account === undefined
    )
      return;
    let resCalled = false;
    dispatch(onLoading('Staking tokens on the pull request...'));
    unstakePr(
      wallet.publicKey as PublicKey,
      new PublicKey(selectedPR.issue_pr_account),
      new PublicKey(issueTokenAddress)
    )
      .then((res) => {
        resCalled = true;
        setPRStakeAmount(0);
        dispatch(
          onSuccess({
            label: 'Pull Request Staking Successful',
            description: 'Check out your staking at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('PR Untaking Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: account,
          issue_github_link: link,
          token_address: issueTokenAddress,
          PR_account: selectedPR.issue_pr_account,
          PR_github_link: selectedPR.issue_pr_github,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        resCalled = true;
        setPRStakeAmount(0);
        dispatch(
          onFailure({
            label: 'Pull Request Staking Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('PR Untaking Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          setPRStakeAmount(0);
          dispatch(
            onSuccess({
              label: 'Pull Request Staking Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('PR Untaking Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          dispatch(setRefetch('issue'));
        }
      });
  };

  const handlePRSubmit = () => {
    if (
      selectedSubmitPR?.PR_link === '' ||
      !selectedSubmitPR?.PR_link.startsWith('https://github.com/')
    )
      return;
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
          let resCalled = false;

          addPullRequest(
            wallet.publicKey as PublicKey,
            new PublicKey(account),
            new PublicKey(
              userMappingState.userMapping?.verifiedUserAccount as string
            ),
            latestCommit.commit.tree.sha,
            latestCommit.sha,
            res.data.html_url,
            new PublicKey(issueTokenAddress)
          )
            .then((resp: any) => {
              resCalled = true;
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
                issue_account: account,
                issue_github_link: link,
                token_address: issueTokenAddress,
                PR_github_link: res.data.html_url,
                tree_hash_unsliced: latestCommit.commit.tree.sha,
                commit_hash_unsliced: latestCommit.sha,
              });
              dispatch(setRefetch('issue'));
            })
            .catch((err) => {
              resCalled = true;
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
            })
            .finally(() => {
              if (!resCalled) {
                dispatch(
                  onSuccess({
                    label: 'Issue Submit Pull Request Successful',
                    description: '',
                    redirect: null,
                    link: '',
                  })
                );
                mixpanel.track('PR Submit Success', {
                  github_id: userMappingState.userMapping?.userName,
                  user_pubkey: userMappingState.userMapping?.userPubkey,
                });
                dispatch(setRefetch('issue'));
              }
            });
        });
      })
      .catch((err) => {
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

  const handleAcceptPR = () => {
    if (selectedPR === undefined || selectedPR === null) return;
    if (
      selectedPR.issue_pr_account === null ||
      selectedPR.issue_pr_account === undefined ||
      selectedPR.issue_pr_link === null ||
      selectedPR.issue_pr_link === undefined ||
      selectedPR.issue_pr_link === ''
    )
      return;
    let resCalled = false;
    dispatch(onLoading('Merging pull request...'));
    acceptPr(new PublicKey(selectedPR.issue_pr_account))
      .then((res) => {
        const pullApiUrl = selectedPR.issue_pr_link
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
            resCalled = true;
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
              issue_account: account,
              issue_github_link: link,
              token_address: issueTokenAddress,
              PR_account: selectedPR.issue_pr_account,
              PR_github_link: selectedPR.issue_pr_github,
            });
            dispatch(setRefetch('issue'));
          })
          .catch((err) => {
            resCalled = true;
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
          })
          .finally(() => {
            if (!resCalled) {
              dispatch(
                onSuccess({
                  label: 'Pull Request Merging Successful',
                  description: '',
                  redirect: null,
                  link: '',
                })
              );
              mixpanel.track('PR Merge Success', {
                github_id: userMappingState.userMapping?.userName,
                user_pubkey: userMappingState.userMapping?.userPubkey,
              });
              dispatch(setRefetch('issue'));
            }
          });
      })
      .catch((err) => {
        resCalled = true;
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
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Pull Request Merging Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          dispatch(setRefetch('issue'));
        }
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
    const MyPRs = allPRs.filter(
      (item: any) =>
        !PRData.some(
          (e: any) => e.issue_pr_link === item.source.issue.html_url
        ) &&
        item.actor.id === userInfo.id &&
        item.source.issue.state === 'open'
    );
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

  const setTokenStakingState = async () => {
    const tokenBalanceData = await getTokenBalance(issueTokenAddress);
    setUserTokenInfo(tokenBalanceData);
  };

  useEffect(() => {
    setTokenStakingState();
    if (!link.includes('github.com')) return;
    getPRsToSelect();
  }, [link]);

  useEffect(() => {
    if(refetchPart==='issue'){
      setTokenStakingState();
      setStakeAmount(0);
      setPRStakeAmount(0);
    }
  }, [refetchPart]);

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
            <div className="whitespace-pre-line">
              {issueDesc.length === 0 && 'No Description available'}
              {issueDesc.length > 260
                ? issueDesc.slice(0, 260) + '...'
                : issueDesc}
            </div>
            <AnchorLink href={link} target="_blank">
              <strong className="underline">view Thread on Github</strong>
            </AnchorLink>
          </div>
          <div className="flex w-1/2 flex-col gap-3">
            <div className="flex-flex-col w-full">
              <div className="mb-2">stake project token on the issue</div>
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
                  onClick={handleIssueStake}
                  isLoading={stateLoading === 'loading'}
                  disabled={
                    userTokenInfo === null ||
                    parseInt(userTokenInfo.amount) /
                      10 ** userTokenInfo.decimals ===
                      0
                  }
                >
                  Stake
                </Button>
                <Button
                  color="info"
                  size="small"
                  shape="rounded"
                  onClick={handleIssueUnstake}
                  isLoading={stateLoading === 'loading'}
                  disabled={userTokenInfo === null}
                >
                  Unstake
                </Button>
              </div>
              <div className="mt-3">
                {userTokenInfo === null
                  ? "User doesn't have tokens."
                  : userTokenInfo.amount && userTokenInfo.decimals
                  ? `Balance: ${
                      parseInt(userTokenInfo.amount) /
                      10 ** userTokenInfo.decimals
                    }`
                  : null}
              </div>
            </div>
          </div>
        </div>
      )}
      {expandState === 'pull request' && (
        <div className="flex w-full flex-col justify-between gap-5 py-5 text-xs xl:text-sm 3xl:text-base">
          {PRData.length > 0 && (
            <div className="flex w-full flex-row items-center justify-between">
              <PRSlider
                PRs={PRData}
                selectedPR={selectedPR}
                setSelectedPR={setSelectedPR}
                issueTokenAddress={issueTokenAddress}
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
          <div className="flex w-full items-end justify-center gap-5">
            {PRData.length > 0 && (
              <div className="flex-flex-col w-full">
                <div className="mb-2">
                  stake project tokens on the pull request
                </div>
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
                    onClick={handlePRStake}
                    isLoading={stateLoading === 'loading'}
                    disabled={
                      userTokenInfo === null ||
                      parseInt(userTokenInfo.amount) /
                        10 ** userTokenInfo.decimals ===
                        0
                    }
                  >
                    Stake
                  </Button>
                  <Button
                    color="info"
                    size="small"
                    shape="rounded"
                    onClick={handlePRUnstake}
                    isLoading={stateLoading === 'loading'}
                    disabled={userTokenInfo === null}
                  >
                    Unstake
                  </Button>
                </div>
                <div className="mt-3">
                  {userTokenInfo === null
                    ? "User doesn't have tokens."
                    : userTokenInfo.amount && userTokenInfo.decimals
                    ? `Balance: ${
                        parseInt(userTokenInfo.amount) /
                        10 ** userTokenInfo.decimals
                      }`
                    : null}
                </div>
              </div>
            )}
            <div className="flex-flex-col w-full">
              <div className="mb-2">submit new pull request</div>
              <div className="flex w-full items-center justify-center gap-2">
                <SortList
                  sort={PRSort}
                  selectedSubmitPR={selectedSubmitPR}
                  setSelectedSubmitPR={setSelectedSubmitPR}
                />
                <Button
                  color="info"
                  size="small"
                  shape="rounded"
                  onClick={handlePRSubmit}
                  isLoading={stateLoading === 'loading'}
                >
                  Submit
                </Button>
              </div>
            </div>
            {PRData.length > 0 && issueCreatorGH === userInfo.id.toString() && (
              <Button
                color="info"
                size="small"
                shape="rounded"
                className="!w-[30%]"
                onClick={handleAcceptPR}
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
