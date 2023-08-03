import React from 'react';
import Logo from '@/assets/images/logo.png';
import Image from '@/components/ui/image';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface LandingPreFooterProps {}

export const LandingPreFooter: React.FC<LandingPreFooterProps> = ({}) => {
  return (
    <div className="flex w-screen flex-col items-center justify-center gap-6 bg-[#060606] py-20">
      <div className="relative h-20 w-20 overflow-hidden rounded-full xl:h-24 xl:w-24 3xl:h-28 3xl:w-28">
        <Image className="object-cover" src={Logo} alt="logo" fill />
      </div>
      <div className="text-center text-4xl font-black tracking-tight text-white 2xl:text-5xl">
        get started with defiOS today.
      </div>
      <div className="text-center text-lg text-gray-400 xl:text-xl 3xl:text-2xl">
        defiOS helps you scale open source software without any
        <br />
        friction. we&apos;ll create a world where open source is well funded
        <br />
        and better than all the alternatives.
        <br />
        join defiOS, earn, build and help open source win.
      </div>
      <div className="flex cursor-pointer items-center justify-start gap-3 rounded-full bg-gradient-to-r from-cyan-900 to-indigo-300 py-3.5 px-8">
        <div className=" btn-text-gradient text-xs font-semibold xl:text-sm 3xl:text-base">
          sign in with github
        </div>
        <ArrowRightIcon className="h-3.5 text-white xl:h-4 3xl:h-5" />
      </div>
    </div>
  );
};

export default LandingPreFooter;
