import React, { useState, useEffect } from 'react';
import DataWithImage from '@/components/custom/data-with-image';
import Button from '@/components/ui/button/button';
import AnchorLink from '../ui/links/anchor-link';
import { claimReward } from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { selectUserMapping } from '@/store/userMappingSlice';

import axios from 'axios';
import { fetchDecimals } from '@/lib/helpers/metadata';

interface ClosedIssueExpandProps {
  data: any;
}

const ClosedIssueExpand: React.FC<ClosedIssueExpandProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);

  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);

  const [winner, setWinner] = useState<any>();
  const [reducedLink, setReducedLink] = useState('');

  let [tokenDecimals, setTokenDecimals] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenImageUrl, setTokenImageUrl] = useState('');
  useEffect(() => {
    getDecimals();
    axios
      .get(
        `https://api.solscan.io/account?address=${data.issue_stake_token_url}&cluster=devnet`,
        {
          headers: {
            token: process.env.SOLSCAN_TOKEN,
          },
        }
      )
      .then((res) => {
        axios
          .get(res.data.data.metadata.data.uri)
          .then((resp) => {
            setTokenImageUrl(resp.data.image);
            setTokenSymbol(res.data.data.metadata.data.symbol);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [data]);

  const getDecimals = async () => {
    const decimals = await fetchDecimals(data?.issue_stake_token_url);
    setTokenDecimals(decimals);
  };

  useEffect(() => {
    if (data.rewardee === null || data.rewardee === undefined) return;
    const winnerPR = data.issue_prs.filter((PR: any) => {
      return PR.issue_pr_author.toString() === data.rewardee.toString();
    });
    if (winnerPR.length !== 1) return;
    const winnerLink = winnerPR[0].issue_pr_link;
    const linkSplit = winnerLink.split('/');
    const linkReduced =
      linkSplit[linkSplit.length - 2] + '/' + linkSplit[linkSplit.length - 1];
    setReducedLink(linkReduced);
    setWinner(winnerPR[0]);
  }, [data]);

  const handleClaim = async () => {
    if (winner === undefined || winner === null) return;
    if (
      winner.issue_pr_account === undefined ||
      winner.issue_pr_account === null
    )
      return;
    dispatch(onLoading('Claiming tokens for solving the issue...'));
    let resCalled = false;
    claimReward(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      new PublicKey(winner.issue_pr_account),
    )
      .then(() => {
        resCalled = true;
        onSuccess({
          label: 'Issue Reward Claiming Successful',
          description: '',
          buttonText: 'Browse Issues',
          redirect: null,
          link: '',
        });
      })
      .catch((err) => {
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Issue Reward Claiming Failed',
            description: err.message,
            redirect: null,
            buttonText: 'Continue',
            link: '',
          })
        );
      })
      .finally(() => {
        if (!resCalled) {
          onSuccess({
            label: 'Issue Reward Claiming Successful',
            description: '',
            buttonText: 'Browse Issues',
            redirect: null,
            link: '',
          });
        }
      });
  };

  return (
    <div className="flex w-full flex-col justify-between gap-5 py-5">
      <div className="mb-3 flex w-full flex-row items-center justify-between">
        <DataWithImage header="Winning PR" value={reducedLink} image="trophy" />
        <DataWithImage
          header="Winning Author"
          value={winner?.issue_pr_author || ''}
          image="wench"
        />
        <DataWithImage
          header="Total PRs submitted"
          value={data?.issue_prs.length || ''}
          image="number"
        />
        <DataWithImage
          header="Total amount staked"
          value={
            Math.round(
              ((data?.issue_stake_amount + winner?.issue_vote_amount) * 100) /
                10 ** tokenDecimals
            ) /
              100 +
              ' ' +
              tokenSymbol || ''
          }
          coin={tokenImageUrl}
        />
      </div>
      {/* <div className="flex w-full flex-row items-center justify-between">
        <DataWithImage
          header="Total number of votes"
          value={totalVotes.toString()}
          image="vote"
        />
        <DataWithImage
          header="Time taken to close issue"
          value={'5Days'}
          image="clock"
        />
        <DataWithImage
          header="Code Quality"
          value={winner?.issue_originality_score || ''}
          image="code"
        />
        <DataWithImage
          header="Winner Margin"
          value={winningMargin.toString()}
          image="banknotes"
        />
      </div> */}
      <div className="flex w-full flex-row items-center justify-between">
        <AnchorLink
          className="w-1/2"
          href={winner ? winner?.issue_pr_link : '#'}
          target="_blank"
        >
          <Button color="info" className="w-full" size="small" shape="rounded">
            View Merge on Github
          </Button>
        </AnchorLink>
        {userMappingState.userMapping?.userPubkey?.toString() ===
          winner?.issue_pr_author?.toString() && (
          <Button
            color="success"
            className="ml-2 w-1/2"
            size="small"
            shape="rounded"
            onClick={handleClaim}
            isLoading={stateLoading === 'loading'}
          >
            Claim Reward
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClosedIssueExpand;
