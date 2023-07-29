import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import Image from '@/components/ui/image';
import { Verified } from '@/components/icons/verified';

interface LearnContentProps {}

const LearnContent: React.FC<LearnContentProps> = ({}) => {
  const dummyTags = ['JavaScript', 'HTML'];

  return (
    <>
      <div className="gradient-border-box-hover flex w-full items-center justify-between gap-5 rounded-lg border border-gray-700 bg-body p-3 transition-all hover:scale-[102%] lg:border-2 xl:p-3.5 3xl:p-4">
        <div className="relative flex h-[8rem] w-[16rem] overflow-hidden rounded-xl">
          <Image
            src={
              'https://forkast.news/wp-content/uploads/2021/08/Solana-768x479.png'
            }
            alt="content image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="mr-2 text-base font-semibold xl:text-lg 3xl:text-xl">
              Learn Solana Dev
            </div>
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
        </div>
        <div className="flex h-full gap-6 whitespace-nowrap rounded-lg bg-gray-900 py-3 px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-sm xl:text-base 3xl:text-lg">
            <div className="flex h-8 w-8 items-center justify-center">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <div>14 mins read</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnContent;
