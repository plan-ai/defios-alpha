import React, { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import ProgressBar from '@/components/ui/progress-bar';
import { token } from '@metaplex-foundation/js';

interface StakerListProps {
  stakerData: any;
  total_stake: any;
}

const StakerList: React.FC<StakerListProps> = ({ stakerData, total_stake }) => {
  return (
    <div className="mb-10 grid w-full grid-cols-6 text-sm xl:text-base 3xl:text-lg">
      <div className="col-span-2 flex items-center gap-2">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={stakerData?.issue_staker_avatar || ''}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>{stakerData?.issue_staker_name}</div>
      </div>
      <div className="flex justify-end px-2">
        {stakerData?.issue_staker_amount}
      </div>
      <div className="col-span-3 flex justify-end">
        <div className="w-1/2">
          <ProgressBar
            completed={{
              value:
                Math.round(
                  (stakerData?.issue_staker_amount / total_stake) * 1000
                ) / 10,
              percentage:
                Math.round(
                  (stakerData?.issue_staker_amount / total_stake) * 1000
                ) / 10,
            }}
            remaining={{
              value:
                Math.round(
                  ((total_stake - stakerData?.issue_staker_amount) /
                    total_stake) *
                    1000
                ) / 10,
              percentage:
                Math.round(
                  ((total_stake - stakerData?.issue_staker_amount) /
                    total_stake) *
                    1000
                ) / 10,
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface IssueStakersProps {
  data: any;
  total_stake: number;
  token: any;
}

const IssueStakers: React.FC<IssueStakersProps> = ({
  data,
  total_stake,
  token,
}) => {
  const [stakersData, setStakersData] = useState<any[]>([]);
  useEffect(() => {
    const sortedData = data.sort((a: any, b: any) =>
      a?.issue_staker_amount > b?.issue_staker_amount ? -1 : 1
    );
    setStakersData(sortedData);
  }, [data]);
  return (
    <div className="mx-20 -mt-5 flex w-full flex-col items-center gap-12">
      <div className="textShadowWhite text-2xl xl:text-3xl 3xl:text-4xl">
        top supporters
      </div>
      <div className="grid w-full grid-cols-6 text-sm font-medium uppercase xl:text-base 3xl:text-lg">
        <div className="col-span-2 underline">Supporter</div>
        <div className="flex justify-end underline">
          Stake (in {token?.token_symbol})
        </div>
        <div className="col-span-3 flex justify-end underline">
          Voting Power
        </div>
      </div>
      <div className="flex w-full flex-col">
        {stakersData.length > 0 &&
          stakersData.map((staker, idx) => {
            if (staker.issue_staker_amount > 0) {
              return (
                <StakerList
                  stakerData={staker}
                  total_stake={total_stake}
                  key={idx}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default IssueStakers;
