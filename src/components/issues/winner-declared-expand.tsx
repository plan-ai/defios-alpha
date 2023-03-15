import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/button';
import DataWithImage from '@/components/custom/data-with-image';
import AnchorLink from '../ui/links/anchor-link';
import { claimReward } from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useAppSelector } from '@/store/store';
import { selectUserMapping } from '@/store/userMappingSlice';

interface WinnerDeclaredExpandProps {
  data: any;
  issueAccount: string;
}

const WinnerDeclaredExpand: React.FC<WinnerDeclaredExpandProps> = ({
  data,
  issueAccount,
}) => {
  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);
  const [winner, setWinner] = useState<any>();
  const [winningMargin, setWinningMargin] = useState(0);
  const [reducedLink, setReducedLink] = useState('');
  useEffect(() => {
    if (data === undefined || data === null) return;
    const PrsList = data?.issue_prs;
    const _winner = PrsList?.reduce((prev: any, current: any) => {
      return prev?.issue_vote_amount > current?.issue_vote_amount
        ? prev
        : current;
    });

    const removeWinner = PrsList.filter((Pr: any) => {
      return Pr !== _winner;
    });

    const _runnerup = removeWinner?.reduce((prev: any, current: any) => {
      return prev?.issue_vote_amount > current?.issue_vote_amount
        ? prev
        : current;
    });

    setWinningMargin(_winner?.issue_vote_amount - _runnerup?.issue_vote_amount);
    const prValSplit = _winner?.issue_pr_link?.split('/');
    const prValue =
      prValSplit[prValSplit.length - 2] +
      '/' +
      prValSplit[prValSplit.length - 1];

    setWinner(_winner);
    setReducedLink(prValue);
  }, [data]);

  const handleClaim = () => {
    claimReward(
      wallet.publicKey as PublicKey,
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      new PublicKey(issueAccount)
    );
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
          header="Winner Margin"
          value={winningMargin.toString()}
          image="banknotes"
        />
        <DataWithImage
          header="Originality Score"
          value={winner?.issue_originality_score || ''}
          image="wench"
        />
      </div>
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
        <Button
          color="success"
          className="ml-2 w-1/2"
          size="small"
          shape="rounded"
          onClick={handleClaim}
        >
          Claim Reward
        </Button>
      </div>
    </div>
  );
};

export default WinnerDeclaredExpand;
