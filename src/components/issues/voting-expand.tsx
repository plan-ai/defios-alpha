import React from 'react';
import Button from '@/components/ui/button/button';
import PRSlider, { PRCardProps } from '@/components/issues/pr-slider';

interface VotingExpandProps {
  PRData: PRCardProps[];
}

const VotingExpand: React.FC<VotingExpandProps> = ({ PRData }) => {
  return (
    <div className="flex w-full flex-col justify-between gap-5 py-5">
      <div className="mb-3 flex w-full flex-row items-center justify-between">
        <PRSlider PRs={PRData} />
      </div>
      <Button color="info" fullWidth size="small" shape="rounded">
        Submit Vote
      </Button>
    </div>
  );
};

export default VotingExpand;
