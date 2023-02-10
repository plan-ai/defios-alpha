import React from 'react';
import Button from '@/components/ui/button/button';
import DataWithImage from '@/components/custom/data-with-image';

interface WinnerDeclaredExpandProps {
  winningPR: string;
  winningAuthor: string;
  winnerMargin: string;
  originality: string;
}

const WinnerDeclaredExpand: React.FC<WinnerDeclaredExpandProps> = ({
  winningPR,
  winnerMargin,
  winningAuthor,
  originality,
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
          header="Winner Margin"
          value={winnerMargin}
          image="banknotes"
        />
        <DataWithImage
          header="Originality Score"
          value={originality}
          image="wench"
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <Button color="info" className="w-1/2" size="small" shape="rounded">
          View Merge on Github
        </Button>
        <Button
          color="success"
          className="ml-2 w-1/2"
          size="small"
          shape="rounded"
        >
          Claim Reward
        </Button>
      </div>
    </div>
  );
};

export default WinnerDeclaredExpand;
