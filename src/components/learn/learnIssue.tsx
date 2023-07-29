import React from 'react';
import { PullRequestIcon } from '@/components/icons/pull-request';
import LangTags from '@/components/ui/tags/lang-tags';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';
import { Verified } from '@/components/icons/verified';

interface LearnIssueProps {}

const LearnIssue: React.FC<LearnIssueProps> = ({}) => {
  const dummyTags = ['JavaScript', 'HTML'];

  return (
    <div className="gradient-border-box-hover flex w-full  items-center justify-between gap-4 rounded-lg border border-gray-700 bg-body p-3 transition-all hover:scale-[102%] lg:border-2 xl:p-3.5 3xl:p-4">
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold xl:text-lg 3xl:text-xl">
          Create an Error logging system
        </div>
        <div className="my-1 flex items-center gap-1">
          {dummyTags.map((tag, idx) => {
            return <LangTags tag={tag} key={idx} />;
          })}
        </div>
        <div className="my-1 flex items-center gap-2">
          <div className="mr-2">Learning Objectives:</div>
          <div className="inline-flex items-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
            Solana
            <Verified className="ml-1 h-5 w-5" />
          </div>
          <div className="inline-flex items-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
            Anchor
            <Verified className="ml-1 h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-xs xl:text-sm 3xl:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint sed
          omnis explicabo assumenda incidunt voluptas quaerat, saepe expedita
          fugit, perferendis itaque distinctionnnnnn itaque distinctio ....
          <strong>
            <u>Click to Read More</u>
          </strong>
        </div>
      </div>
      <div className="flex basis-auto flex-col gap-4">
        <div className="flex h-full basis-auto flex-col gap-6 rounded-lg bg-gray-900 py-4 px-4">
          <div className="flex items-center gap-2 whitespace-nowrap text-xs xl:text-sm 3xl:text-base">
            <div className="flex h-8 w-8 items-center justify-center">
              <PullRequestIcon />
            </div>
            <div className="text-gray-400">Open Pull Requests:</div>
            <div>4</div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap text-xs xl:text-sm 3xl:text-base">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={
                  'https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte'
                }
                alt="coin"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-gray-400">Amount Staked:</div>
            <div>3.5K DOS (-120)</div>
          </div>
        </div>
        <Button size="small" shape="rounded" color="info">
          Check out the Project
        </Button>
      </div>
    </div>
  );
};

export default LearnIssue;
