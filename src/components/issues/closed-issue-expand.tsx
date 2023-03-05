import React, { useState, useEffect } from 'react';
import DataWithImage from '@/components/custom/data-with-image';
interface ClosedIssueExpandProps {
  data: any;
}

const ClosedIssueExpand: React.FC<ClosedIssueExpandProps> = ({ data }) => {
  const [winner, setWinner] = useState<any>();
  const [winningMargin, setWinningMargin] = useState(0);
  const [reducedLink, setReducedLink] = useState('');
  const [totalVotes, setTotalVotes] = useState(1);
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

    const _totalVotes = PrsList?.map(
      (item: any) => item?.issue_vote_amount
    )?.reduce((prev: number, next: number) => prev + next);
    const prValSplit = _winner?.issue_pr_link?.split('/');
    const prValue =
      prValSplit[prValSplit.length - 2] +
      '/' +
      prValSplit[prValSplit.length - 1];

    setWinner(_winner);
    setTotalVotes(_totalVotes);
    setReducedLink(prValue);
  }, [data]);
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
      <div className="flex w-full flex-row items-center justify-between">
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
      </div>
    </div>
  );
};

export default ClosedIssueExpand;
