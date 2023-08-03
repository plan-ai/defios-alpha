import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface HeaderLandingProps {}

export const HeaderLanding: React.FC<HeaderLandingProps> = ({}) => {
  return (
    <div className="z-[20] mt-16 flex w-screen flex-col items-center">
      <div className="text-center text-5xl font-black text-white 2xl:text-6xl">
        like uber, but for <br />
        open source software
      </div>
      <div className="mt-10 text-center text-lg font-medium text-gray-400 xl:text-xl 3xl:text-2xl">
        defiOS helps you pay developers directly in tokens and stablecoins for
        their contributions.
        <br />
        tokenize any repository, stake tokens on issues and effectively
        incentivize any open source project. <br />
      </div>
      <div className="mt-12 flex cursor-pointer items-center justify-start gap-3 rounded-full bg-gradient-to-r from-cyan-900 to-indigo-300 py-3.5 px-8">
        <div className=" btn-text-gradient text-xs font-semibold xl:text-sm 3xl:text-base">
          sign in with github
        </div>
        <ArrowRightIcon className="h-3.5 text-white xl:h-4 3xl:h-5" />
      </div>
    </div>
  );
};

export default HeaderLanding;
