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
  useEffect(() => {
    if (data.rewardee === null || data.rewardee === undefined) return;
    const winnerPR = data.issue_prs.filter((PR: any) => {
      return PR.issue_pr_author.toString() === data.rewardee.toString();
    });
    setWinner(winnerPR);
  }, [data]);

  const handleClaim = () => {
    if (winner === undefined || winner === null) return;
    if (
      winner.issue_pr_account === undefined ||
      winner.issue_pr_account === null
    )
      return;
    dispatch(onLoading('Claiming tokens for solving the issue...'));
    let resCalled = false;
    claimReward(
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      new PublicKey(winner.issue_pr_account)
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
            Math.round(data?.issue_stake_amount * 100) / 100 +
              ' ' +
              data?.issue_stake_token_symbol || ''
          }
          coin={data?.issue_stake_token_url}
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
