import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import IssueStake from '@/components/issue-details/IssueStake';
import IssueFundChart from '@/components/issue-details/IssueFundChart';
import IssueStakers from '@/components/issue-details/IssueStakers';

interface IssueFundingProps {
  issueData: any;
  tokenDetails: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const IssueFunding: React.FC<IssueFundingProps> = ({
  issueData,
  tokenDetails,
  setRefetch,
}) => {
  const [section, setSection] = useState(1);

  return (
    <div className="mt-16 flex w-full justify-end">
      {section === 1 && (
        <IssueStake
          tokenDetails={tokenDetails}
          issueData={issueData}
          setRefetch={setRefetch}
        />
      )}
      {section === 2 && <IssueFundChart />}
      {section === 3 && <IssueStakers />}
      <div className="mt-20 flex flex-col items-center gap-8">
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 1,
            'h-4 w-4': section !== 1,
          })}
          onClick={() => setSection(1)}
        ></div>
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 2,
            'h-4 w-4': section !== 2,
          })}
          onClick={() => setSection(2)}
        ></div>
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 3,
            'h-4 w-4': section !== 3,
          })}
          onClick={() => setSection(3)}
        ></div>
      </div>
    </div>
  );
};

export default IssueFunding;
