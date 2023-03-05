import React from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import AnchorLink from '../ui/links/anchor-link';

interface OpenIssueExpandProps {
  issueDesc: string;
  link: string;
}

const OpenIssueExpand: React.FC<OpenIssueExpandProps> = ({
  issueDesc,
  link,
}) => {
  return (
    <div className="flex w-full justify-between gap-5 py-5">
      <div className="flex w-1/2 flex-col gap-3">
        <strong>Description</strong>
        <div className="tracking-wider">
          {issueDesc.length === 0 && 'No Description available'}
          {issueDesc.length > 250 ? issueDesc.slice(0, 240) + '...' : issueDesc}
        </div>
        <AnchorLink href={link} target="_blank">
          <strong className="underline">view Thread on Github</strong>
        </AnchorLink>
      </div>
      <div className="flex w-1/2 flex-col gap-3">
        <div className="flex-flex-col w-full">
          <div className="mb-2">Build 🛠️</div>
          <div className="flex w-full items-center justify-center">
            <Input
              type="text"
              placeholder="Pull Request URL"
              inputClassName="w-full border-r-0 !h-10 !rounded-r-none !my-0"
              className="w-full"
            />
            <Button
              color="info"
              className="w-1/3 -translate-x-2"
              size="small"
              shape="rounded"
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="flex-flex-col w-full">
          <div className="mb-2">Speed Up 🚅</div>
          <div className="flex w-full items-center justify-center">
            <Input
              type="text"
              placeholder="Stake Amount"
              inputClassName="w-full border-r-0 !h-10 !rounded-r-none !my-0"
              className="w-full"
            />
            <Button
              color="success"
              className="w-1/3 -translate-x-2"
              size="small"
              shape="rounded"
            >
              Stake
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenIssueExpand;
