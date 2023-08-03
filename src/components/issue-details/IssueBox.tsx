import React from 'react';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';
import IssueState from '@/components/ui/tags/issue-state';
import AnchorLink from '@/components/ui/links/anchor-link';
import TagImage from '@/components/ui/tags/tag-image';

interface IssueBoxProps {}

const IssueBox: React.FC<IssueBoxProps> = ({}) => {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-700 bg-body p-3 lg:border-2 xl:p-3.5 3xl:p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <div className="text-base font-semibold xl:text-lg 3xl:text-xl">
            Add Logging
          </div>
          <AnchorLink
            href={'https://github.com/defi-os/defios-alpha/issues/68'}
            target="_blank"
            className="text-base text-primary xl:text-lg 3xl:text-xl"
          >
            #68
          </AnchorLink>
        </div>
        <div className="flex items-center gap-6">
          <IssueState state="open" className="!px-7" />
          <TagImage tag="defi-os/defios-aplha" />
        </div>
        <div className="flex items-center gap-2 text-xs xl:text-sm 3xl:text-base">
          <AnchorLink
            className="text-primary"
            target="_blank"
            href={'https://github.com/Rohitkk432'}
          >
            Rohitkk432
          </AnchorLink>
          <div>opened issue on</div>
          <div>24th July 2023</div>
        </div>
      </div>
      <div className="flex h-full basis-auto gap-6 whitespace-nowrap rounded-lg bg-gray-900 py-3 px-6">
        <div className="flex flex-col items-center justify-center text-xs xl:text-sm 3xl:text-base">
          <div className="relative mb-3 h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={
                'https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte'
              }
              alt="coin"
              fill
              className="object-cover"
            />
          </div>
          <div>3.5K DOS</div>
          <div className="text-gray-400">(~$120)</div>
        </div>
      </div>
    </div>
  );
};

export default IssueBox;
