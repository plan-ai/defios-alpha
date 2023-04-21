import React from 'react';
import IssuesTableList from '@/components/homepage/issues-table-list';

interface OpenIssuesTableProps {
  data: any;
}

export const OpenIssuesTable: React.FC<OpenIssuesTableProps> = ({ data }) => {
  return (
    <div className="mx-auto w-full">
      <div className="mb-3 flex flex-col rounded-xl border-b-2 border-gray-500 bg-light-dark shadow-card">
        <div className="flex w-full items-center py-4 px-6 text-xl uppercase text-gray-300">
          Open Issues For You
        </div>
        <div className="grid grid-cols-5 gap-6 border-t border-dashed border-gray-600 text-gray-300">
          <span className="col-span-2 py-4 px-6 text-xs tracking-wider sm:text-sm">
            Issue Title
          </span>
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm ">
            Issue state
          </span>
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm">
            Project Name
          </span>
          <span className="py-4 text-center text-xs tracking-wider sm:text-sm ">
            Amount Staked
          </span>
        </div>
      </div>
      {data.length !== 0 &&
        data.map((item: any, idx: number) => {
          return <IssuesTableList item={item} key={idx} />;
        })}
    </div>
  );
};

export default OpenIssuesTable;
