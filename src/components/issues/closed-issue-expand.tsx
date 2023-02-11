import React from 'react';
import DataWithImage from '@/components/custom/data-with-image';
import { coinListBig } from '@/data/static/coin-list';
interface ClosedIssueExpandProps {
  winningPR: string;
  winningAuthor: string;
  totalPRs: string;
  totalAmountStaked: string;
  totalVotes: string;
  timeTakenToClose: string;
  codeQuality: string;
  winnerMargin: string;
  coin: string;
}

const ClosedIssueExpand: React.FC<ClosedIssueExpandProps> = ({
  winningPR,
  winningAuthor,
  totalPRs,
  totalAmountStaked,
  totalVotes,
  timeTakenToClose,
  codeQuality,
  winnerMargin,
  coin,
}) => {
  const prValSplit = winningPR.split('/');
  const prValue =
    prValSplit[prValSplit.length - 2] + '/' + prValSplit[prValSplit.length - 1];
  return (
    <div className="flex w-full flex-col justify-between gap-5 py-5">
      <div className="mb-3 flex w-full flex-row items-center justify-between">
        <DataWithImage header="Winning PR" value={prValue} image="trophy" />
        <DataWithImage
          header="Winning Author"
          value={winningAuthor}
          image="wench"
        />
        <DataWithImage
          header="Total PRs submitted"
          value={totalPRs}
          image="number"
        />
        <DataWithImage
          header="Total amount staked"
          value={totalAmountStaked}
          image=""
          coin={coin}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <DataWithImage
          header="Total number of votes"
          value={totalVotes}
          image="vote"
        />
        <DataWithImage
          header="Time taken to close issue"
          value={timeTakenToClose}
          image="clock"
        />
        <DataWithImage header="Code Quality" value={codeQuality} image="code" />
        <DataWithImage
          header="Winner Margin"
          value={winnerMargin}
          image="banknotes"
        />
      </div>
    </div>
  );
};

export default ClosedIssueExpand;
