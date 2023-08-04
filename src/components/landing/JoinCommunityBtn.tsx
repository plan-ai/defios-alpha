import React from 'react';
import Logo from '@/assets/images/logo.png';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';

interface JoinCommunityBtnProps {}

export const JoinCommunityBtn: React.FC<JoinCommunityBtnProps> = ({}) => {
  return (
    <div className="relative flex items-center justify-center">
      <AnchorLink
        href={'https://discord.gg/kMDuqbccey'}
        target="_blank"
        className="absolute z-[20] flex cursor-pointer items-center justify-start gap-3 whitespace-nowrap rounded-lg bg-[#0a0a0a] px-[18px] py-3 text-xs xl:text-sm 3xl:text-base"
      >
        <div className="relative h-6 w-6 overflow-hidden rounded-full xl:h-7 xl:w-7 3xl:h-8 3xl:w-8">
          <Image className="object-cover" src={Logo} alt="logo" fill />
        </div>
        <div className="flex items-start justify-start gap-6">
          <div className="font-normal leading-normal text-white">
            defiOS is in public beta
          </div>
          <div className="h-[0px] w-5 origin-top-left rotate-90 border border-zinc-800"></div>
          <div className="flex items-start justify-start gap-3">
            <div className="font-medium leading-snug tracking-tight text-indigo-300">
              join community
            </div>
            <ArrowRightIcon className="h-3.5 text-indigo-300 xl:h-4 3xl:h-5" />
          </div>
        </div>
      </AnchorLink>
      <div className="absolute z-[10] flex items-center justify-start gap-3 whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-300 to-cyan-800 px-[18px] px-[18px] py-3 py-3 text-xs blur-[16px] xl:text-sm 3xl:text-base">
        <div className="relative h-6 w-6 overflow-hidden rounded-full opacity-0 xl:h-7 xl:w-7 3xl:h-8 3xl:w-8">
          <Image className="object-cover" src={Logo} alt="logo" fill />
        </div>
        <div className="flex items-start justify-start gap-6 opacity-0">
          <div className="font-normal leading-normal text-white">
            defiOS is in public beta
          </div>
          <div className="h-[0px] w-5 origin-top-left rotate-90 border border-zinc-800"></div>
          <div className="flex items-start justify-start gap-3">
            <div className="font-medium leading-snug tracking-tight text-indigo-300">
              join community
            </div>
            <ArrowRightIcon className="h-3.5 text-indigo-300 xl:h-4 3xl:h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunityBtn;
