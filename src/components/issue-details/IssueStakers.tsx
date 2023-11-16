import React from 'react';
import Image from '@/components/ui/image';
import ProgressBar from '@/components/ui/progress-bar';

interface StakerListProps {}

const StakerList: React.FC<StakerListProps> = ({}) => {
  return (
    <div className="mb-10 grid w-full grid-cols-6 text-sm xl:text-base 3xl:text-lg">
      <div className="col-span-2 flex items-center gap-2">
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
      <div className="flex justify-end px-2">345</div>
      <div className="col-span-3 flex justify-end">
        <div className='w-1/2' >
          <ProgressBar
            completed={{ value: 30, percentage: 30 }}
            remaining={{ value: 70, percentage: 70 }}
          />
        </div>
      </div>
    </div>
  );
};

interface IssueStakersProps {}

const IssueStakers: React.FC<IssueStakersProps> = ({}) => {
  return (
    <div className="mx-20 -mt-5 flex w-full flex-col items-center gap-12">
      <div className="textShadowWhite text-2xl xl:text-3xl 3xl:text-4xl">
        top supporters
      </div>
      <div className="grid w-full grid-cols-6 text-sm font-medium uppercase xl:text-base 3xl:text-lg">
        <div className="col-span-2 underline">Supporter</div>
        <div className="flex justify-end underline">Stake (in $)</div>
        <div className="col-span-3 flex justify-end underline">
          Voting Power
        </div>
      </div>
      <div className="flex w-full flex-col">
        <StakerList />
        <StakerList />
        <StakerList />
        <StakerList />
      </div>
    </div>
  );
};

export default IssueStakers;
