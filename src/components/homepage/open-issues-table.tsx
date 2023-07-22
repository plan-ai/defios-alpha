import React from 'react';
import IssuesTableList from '@/components/homepage/issues-table-list';
import Link from 'next/link';
import Button from '@/components/ui/button';
interface OpenIssuesTableProps {
  data: any;
}

export const OpenIssuesTable: React.FC<OpenIssuesTableProps> = ({ data }) => {
  return (
    <div className="mx-auto w-full">
      <div className="mb-3 flex flex-col rounded-xl border-b-2 border-gray-500 bg-light-dark shadow-card">
        <div className="flex w-full items-center justify-between py-3 px-6 text-base uppercase text-gray-300 xl:py-3.5 xl:text-lg 2xl:text-xl 3xl:py-4">
          <div>Open Issues For You</div>
          <Link href="/issues">
            <Button shape="rounded" color="info" size="small">
              create an issue
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-5 items-center gap-6 border-t border-dashed border-gray-600 text-2xs uppercase text-gray-300 xl:text-xs 2xl:text-sm">
          <span className="col-span-2 py-3 px-6 tracking-wider xl:py-3.5 3xl:py-4">
            Issue Title
          </span>
          <span className="py-3 text-center tracking-wider xl:py-3.5 3xl:py-4 ">
            Issue state
          </span>
          <span className="py-3 text-center tracking-wider xl:py-3.5 3xl:py-4">
            Project Name
          </span>
          <span className="py-3 text-center tracking-wider xl:py-3.5 3xl:py-4 ">
            Amount Staked
          </span>
        </div>
      </div>
      {data.length !== 0 &&
        data.map((item: any, idx: number) => {
          return (
            <IssuesTableList
              item={item}
              key={idx}
              last={data.length === idx + 1}
              first={idx === 0}
            />
          );
        })}
    </div>
  );
};

export default OpenIssuesTable;
