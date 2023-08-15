import React, { useEffect, useState } from 'react';
import Xshare from '@/components/create/Xshare';
import { Close } from '@/components/icons/close';

interface Step5Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step5: React.FC<Step5Props> = ({ setStep }) => {
  return (
    <div className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg">
      <div className="mb-5 flex justify-end text-gray-500">
        <Close className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-8 text-lg font-semibold xl:text-xl 3xl:text-2xl">
        <div className="px-4">congrats!</div>
        <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
      </div>
      <div className="mt-5 flex h-full flex-col items-center gap-4 px-4 text-sm xl:text-base 3xl:text-lg">
        <div className="mb-16 flex flex-col items-center gap-2">
          <div>
            you have successfully created your{' '}
            <div className="inline font-semibold text-primary underline">
              project
            </div>{' '}
            and
          </div>
          <div>
            incentivized its{' '}
            <div className="inline font-semibold text-primary underline">
              first issue
            </div>{' '}
            on defiOS!
          </div>
        </div>
        <Xshare />
        <div className="mt-16 mb-6 flex flex-col items-center gap-2">
          <div>Share this on X.com (formerly Twitter), letting</div>
          <div>developers know that you&apos;ve funded the issue.</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div>don&apos;t worry if you have no developer followers.</div>
          <div>when we find your post on X.com, we&apos;ll repost it.</div>
          <div>(that&apos;s a promise!)</div>
        </div>
      </div>
      <div className="lineGradientHorizontalGray mb-20 h-0.5 w-full"></div>
    </div>
  );
};

export default Step5;
