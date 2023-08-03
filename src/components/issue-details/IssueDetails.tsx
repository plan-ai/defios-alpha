import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';

import IssueBox from '@/components/issue-details/IssueBox';

import IssueDescription from '@/components/issue-details/IssueDescription';
import IssueStake from '@/components/issue-details/IssueStake';

interface IssueDetailsProps {}

type tabStateType =
  | 'description'
  | 'stake'
  | 'pull requests'
  | 'impact'
  | 'replicate';

const IssueDetails: React.FC<IssueDetailsProps> = ({}) => {
  const [tabState, setTabState] = useState<tabStateType>('description');
  return (
    <div className="flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden px-3.5 pb-4">
      <div className="flex items-center gap-3 text-xs text-gray-500 xl:text-sm 3xl:text-base">
        <ArrowLongLeftIcon className="h-10" />
        <div>Go back to issues</div>
      </div>
      <IssueBox />
      <div className="mt-4 flex items-center gap-3">
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('description')}
          color={tabState === 'description' ? 'info' : 'primary'}
        >
          Description
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('stake')}
          color={tabState === 'stake' ? 'info' : 'primary'}
        >
          Stake
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('pull requests')}
          color={tabState === 'pull requests' ? 'info' : 'primary'}
        >
          Pull Requests
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('impact')}
          color={tabState === 'impact' ? 'info' : 'primary'}
        >
          Impact
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('replicate')}
          color={tabState === 'replicate' ? 'info' : 'primary'}
        >
          Replicate
        </Button>
      </div>

      {tabState === 'description' && <IssueDescription />}
      {tabState === 'stake' && <IssueStake />}
    </div>
  );
};

export default IssueDetails;
