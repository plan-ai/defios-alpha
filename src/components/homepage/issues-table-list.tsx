import React, { useState } from 'react';
import ListCard from '@/components/ui/list-card';

interface IssuesTableListProps {
  issueTitle: string;
  projectName: string;
  amountStaked: string;
  skillsetNeeded: string;
}

export const IssuesTableList: React.FC<IssuesTableListProps> = ({
  issueTitle,
  projectName,
  amountStaked,
  skillsetNeeded,
}) => {
  let [isExpand, setIsExpand] = useState(false);

  return (
    <div className="relative mb-2 overflow-hidden rounded-lg bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large">
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-4 items-start gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="px-6 text-xs font-medium tracking-wider text-white sm:text-sm">
          {issueTitle}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {projectName}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {amountStaked}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          <ListCard
            item={{
              name: skillsetNeeded,
            }}
            className="w-fit rounded-full bg-dark py-2 px-4 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default IssuesTableList;
