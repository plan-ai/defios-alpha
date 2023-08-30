import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { XTwitterIcon } from '@/components/icons/brand/x-twitter'
import AnchorLink from '../ui/links/anchor-link';

interface XshareProps {
  tweet:string;
}

export const Xshare: React.FC<XshareProps> = ({tweet}) => {
  return (
    <AnchorLink
      href={`https://twitter.com/intent/tweet?text=${tweet}`}
      target='_blank'
      className="group relative flex items-center justify-center"
    >
      <div className="absolute z-[20] flex cursor-pointer items-center justify-start gap-3 whitespace-nowrap rounded-full bg-[#0a0a0a] px-[12px] py-2 text-sm transition-all duration-300 xl:px-[16px] xl:py-2.5 xl:text-base 3xl:px-[18px] 3xl:py-3 3xl:text-lg">
        <XTwitterIcon className="h-8 w-8 text-primary" />
        <div className="flex w-11 items-center gap-5 overflow-hidden transition-all duration-300 group-hover:w-16 xl:w-12 xl:gap-4 xl:group-hover:w-20 3xl:w-14 3xl:gap-3.5 3xl:group-hover:w-24">
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            share
          </div>
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            on X.com
          </div>
        </div>
        <ArrowRightIcon className="h-3.5 xl:h-4 3xl:h-5" />
      </div>
      <div className="absolute z-[10] flex items-center justify-start gap-3 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-300 to-cyan-800 px-[12px] py-2 text-xs blur-[16px] transition-all duration-300 xl:px-[16px] xl:py-2.5 xl:text-sm 3xl:px-[18px] 3xl:py-3 3xl:text-base">
        <XTwitterIcon className="h-8 w-8 text-primary" />
        <div className="flex w-11 items-center gap-5 overflow-hidden transition-all duration-300 group-hover:w-16 xl:w-11 xl:gap-4 xl:group-hover:w-20 3xl:w-12 3xl:gap-3.5 3xl:group-hover:w-24">
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            share
          </div>
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            on X.com
          </div>
        </div>
        <ArrowRightIcon className="h-3.5 xl:h-4 3xl:h-5" />
      </div>
    </AnchorLink>
  );
};

export default Xshare;
