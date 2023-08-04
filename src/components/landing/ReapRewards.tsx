import React from 'react';
import Image from '@/components/ui/image';
import LandingScreen3 from '@/assets/images/LandingScreen3.png';

interface ReapRewardsProps {}

export const ReapRewards: React.FC<ReapRewardsProps> = ({}) => {
  return (
    <div className="flex w-screen flex-col items-center justify-center gap-6 bg-[#181E2D] py-32">
      <div className="text-4xl font-black tracking-tight text-white 2xl:text-5xl">
        reap the rewards of funding builders early
      </div>
      <div className="text-center text-base text-gray-400 xl:text-lg 3xl:text-xl">
        by working for a project&apos;s tokens or buying a project&apos;s tokens
        early (when it&apos;s necessary).
        <br />
        as a project succeeds, the demand for its tokens should also increase
        because of their inherent
        <br />
        utility of prioritizing project features as well as other project
        specific utilities.
      </div>
      <div className="conic-gradient-2 flex w-[55rem] items-end rounded-2xl p-16 pb-0 xl:w-[60rem] 3xl:w-[65rem]">
        <Image
          width={0}
          height={0}
          alt="screen"
          style={{ width: '100%', height: 'auto' }} // optional
          sizes="100vw"
          src={LandingScreen3}
        />
      </div>
    </div>
  );
};

export default ReapRewards;
