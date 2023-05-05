import React from 'react';
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

import { uploadMetadataToIPFS } from '@/lib/helpers/metadata';

interface OpenIssueExpandProps {
  issueDesc: string;
  link: string;
  account: string;
}

const OpenIssueExpand: React.FC<OpenIssueExpandProps> = ({
  issueDesc,
  link,
  account,
}) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const wallet = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState<number>(0);
  const { data: session } = useSession();
  const [prUrl, setPrUrl] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const userMappingState = useAppSelector(selectUserMapping);
  const [prLoading, setPrLoading] = React.useState<boolean>(false);

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
    if (prUrl === '' || !prUrl.startsWith('https://github.com/')) return;
    dispatch(onLoading('Submitting your commit on the issue...'));
    const pullApiUrl = prUrl
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

  return (
    <div className="flex w-full justify-between gap-5 py-5 text-xs xl:text-sm 3xl:text-base">
      <div className="flex w-1/2 flex-col gap-3">
        <strong>Description</strong>
        <div className="tracking-wider">
          {issueDesc.length === 0 && 'No Description available'}
          {issueDesc.length > 250 ? issueDesc.slice(0, 240) + '...' : issueDesc}
        </div>
        <AnchorLink href={link} target="_blank">
          <strong className="underline">view Thread on Github</strong>
        </AnchorLink>
      </div>
      <div className="flex w-1/2 flex-col gap-3">
        <div className="flex-flex-col w-full">
          <div className="mb-2">Build 🛠️</div>
          <div className="flex w-full items-center justify-center">
            <Input
              type="text"
              placeholder="Pull Request URL"
              inputClassName="w-full border-r-0 !h-10 !rounded-r-none !my-0"
              className="w-full"
              onChange={(e) => {
                setPrUrl(e.target.value);
              }}
            />
            <Button
              color="info"
              className="w-1/3 -translate-x-2"
              size="small"
              shape="rounded"
              onClick={handleCommitSubmit}
              isLoading={stateLoading === 'loading'}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="flex-flex-col w-full">
          <div className="mb-2">Speed Up 🚅</div>
          <div className="flex w-full items-center justify-center">
            <Input
              type="text"
              placeholder="Stake Amount"
              inputClassName="w-full border-r-0 !h-10 !rounded-r-none !my-0"
              className="w-full"
              onChange={(e) => {
                setStakeAmount(parseFloat(e.target.value));
              }}
            />
            <Button
              color="success"
              className="w-1/3 -translate-x-2"
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
  );
};

export default OpenIssueExpand;
