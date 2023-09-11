import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { FolderIcon } from '@heroicons/react/24/outline';
import AnchorLink from '@/components/ui/links/anchor-link';

interface CreateProjectBtnProps {}

export const CreateProjectBtn: React.FC<CreateProjectBtnProps> = ({}) => {
  return (
    <AnchorLink
      href="/incentivize-contributors"
      className="group relative flex items-center justify-center"
    >
      <div className="absolute z-[20] flex cursor-pointer items-center justify-start gap-3 whitespace-nowrap rounded-full bg-[#0a0a0a] px-[14px] py-2 text-sm transition-all duration-300 xl:px-[18px] xl:py-2.5 xl:text-base 3xl:px-[21px] 3xl:py-3 3xl:text-lg">
        <FolderIcon className="h-7 w-7 text-primary" />
        <div className="flex w-16 items-center gap-5 overflow-hidden transition-all duration-300 group-hover:w-28 xl:w-16 xl:gap-4 xl:group-hover:w-32 3xl:w-16 3xl:gap-3.5 3xl:group-hover:w-36">
          <div className="transition-all duration-300 group-hover:-translate-x-20">
            create
          </div>
          <div className="transition-all duration-300 group-hover:-translate-x-20">
            a new project
          </div>
        </div>
        <ArrowRightIcon className="h-3.5 xl:h-4 3xl:h-5" />
      </div>
      <div className="absolute z-[10] flex items-center justify-start gap-3 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-300 to-cyan-800 px-[14px] py-2 text-xs blur-[16px] transition-all duration-300 xl:px-[18px] xl:py-2.5 xl:text-sm 3xl:px-[21px] 3xl:py-3 3xl:text-base">
        <FolderIcon className="h-7 w-7 text-primary" />
        <div className="flex w-16 items-center gap-5 overflow-hidden transition-all duration-300 group-hover:w-28 xl:w-16 xl:gap-4 xl:group-hover:w-32 3xl:w-16 3xl:gap-3.5 3xl:group-hover:w-36">
          <div className="transition-all duration-300 group-hover:-translate-x-20">
            create
          </div>
          <div className="transition-all duration-300 group-hover:-translate-x-20">
            a new project
          </div>
        </div>
        <ArrowRightIcon className="h-3.5 xl:h-4 3xl:h-5" />
      </div>
    </AnchorLink>
  );
};

export default CreateProjectBtn;
