import React from 'react';
import Image from '@/components/ui/image';

import { GithubIssueIcon } from '../icons/github-issue';
import PlainTags from '../ui/tags/plain-tags';

interface IssueBoxProps {}

const IssueBox: React.FC<IssueBoxProps> = ({}) => {
  return (
    <div className="relative w-full">
      <div className="relative z-[40] flex w-full items-center justify-between gap-3 rounded-3xl bg-body p-5 xl:p-6 3xl:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold xl:text-xl 3xl:text-2xl">
              This is how an issue title should look
            </div>
            <GithubIssueIcon className="h-6 w-6 text-new-red" />
            <PlainTags tag="enhancement" />
            <PlainTags tag="bug" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte"
                alt="token image"
                fill
                className="object-cover"
              />
            </div>
            <div>Project Name $(token-symbol)</div>
          </div>
        </div>
        <div className="text-base text-new-green xl:text-lg 3xl:text-xl">
          5432
        </div>
      </div>
      <div className="absolute left-0 right-0 top-0 bottom-[40%] z-[10] rounded-full bg-[#92ABFB] blur-[60px]"></div>
    </div>
  );
};

export default IssueBox;