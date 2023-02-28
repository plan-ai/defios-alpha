import React from 'react';
import IssuesTableList from '@/components/homepage/issues-table-list';

interface OpenIssuesTableProps {}

const dummyData = [
  {
    issueTitle: 'Issue Title 1',
    projectName: 'project name 1',
    amountStaked: 'amountStaked 1',
    skillsetNeeded: 'skillset 1',
  },
  {
    issueTitle: 'Issue Title 2',
    projectName: 'project name 2',
    amountStaked: 'amountStaked 2',
    skillsetNeeded: 'skillset 2',
  },
  {
    issueTitle: 'Issue Title 2',
    projectName: 'project name 2',
    amountStaked: 'amountStaked 2',
    skillsetNeeded: 'skillset 2',
  },
];

export const OpenIssuesTable: React.FC<OpenIssuesTableProps> = ({}) => {
  return (
    <div className="mx-auto w-full">
      <div className="mb-3 flex flex-col rounded-lg border-b-2 border-gray-500 bg-light-dark shadow-card">
        <div className="flex w-full items-center justify-center py-4 px-6 text-xl uppercase text-gray-300">
          Open Issues For You
        </div>
        <div className="grid grid-cols-4 gap-6 border-t border-dashed border-gray-600 text-gray-300">
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm">
            Issue Title
          </span>
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm">
            Project Name
          </span>
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm ">
            Amount Staked
          </span>
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm ">
            Skillset Needed
          </span>
        </div>
      </div>
      {dummyData.length !== 0 &&
        dummyData.map((item, idx) => {
          return (
            <IssuesTableList
              issueTitle={item.issueTitle}
              projectName={item.projectName}
              amountStaked={item.amountStaked}
              skillsetNeeded={item.skillsetNeeded}
              key={idx}
            ></IssuesTableList>
          );
        })}
    </div>
  );
};

export default OpenIssuesTable;
