import React, { useState, useEffect } from 'react';
import { LockClosedIcon,CheckIcon } from '@heroicons/react/24/outline';
import { GithubOutlineIcon } from '@/components/icons/github-outline';
import Image from '@/components/ui/image';
import ProgressBar from '@/components/ui/progress-bar';

interface PRBoxProps {}

export const PRBox: React.FC<PRBoxProps> = ({}) => {
  return (
    <div className="grid w-full grid-cols-9 items-center gap-12 text-sm xl:text-base 3xl:text-lg">
      <div className="col-span-4 flex items-center gap-3">
        <GithubOutlineIcon className="h-10 w-10" />
        <div>This is a dummy PR Title</div>
      </div>
      <div className="col-span-2 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={'https://avatars.githubusercontent.com/u/74586376?v=4'}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>Rohitkk432</div>
      </div>
      <div className="col-span-2">
        <ProgressBar
          completed={{ value: 75, percentage: 75 }}
          remaining={{ value: 25, percentage: 25 }}
        />
      </div>

      {/* for contributors */}

      {/* <div className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-primary bg-newdark py-1 px-6 text-xs font-semibold text-primary xl:text-sm 3xl:text-base">
        <LockClosedIcon className="h-5 w-5" />
        <div>vote</div>
      </div> */}
      <div className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-new-green bg-newdark py-1 px-6 text-xs font-semibold text-new-green xl:text-sm 3xl:text-base">
        <CheckIcon className="h-5 w-5" />
        <div>voted</div>
      </div>

      {/* for owners */}

      {/* <div className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-primary bg-newdark py-1 px-6 text-xs font-semibold text-primary xl:text-sm 3xl:text-base">
        <div>merge</div>
      </div> */}
    </div>
  );
};

export default PRBox;
