import React from 'react';
import Image from '@/components/ui/image';
import RoadmapScreen from '@/assets/images/RoadmapScreen.png';

interface RoadmapReimaginedProps {}

export const RoadmapReimagined: React.FC<RoadmapReimaginedProps> = ({}) => {
  return (
    <div className="flex w-screen items-center justify-between bg-[#060606] py-32">
      <div className="flex flex-col gap-8 pl-32">
        <div className="text-5xl font-black text-white 2xl:text-6xl">
          Roadmaps,
          <br /> reimagined.
        </div>
        <div className="text-base text-gray-400 xl:text-lg 3xl:text-xl">
          <span className="text-white">Plan.</span> Lay out your product roadmap
          <br />
          in public, for all to see and contribute.
        </div>
        <div className="text-base text-gray-400 xl:text-lg 3xl:text-xl">
          <span className="text-white">Decentralized funding.</span> Let the
          people
          <br />
          vote on issues and PRs with tokens and
          <br />
          USDC to accelerate development.
        </div>
      </div>
      <div className="conic-gradient-1 flex w-[35rem] rounded-l-2xl py-10 xl:w-[40rem] 3xl:w-[45rem]">
        <Image
          width={0}
          height={0}
          alt="screen"
          style={{ width: '100%', height: 'auto' }} // optional
          sizes="100vw"
          src={RoadmapScreen}
        />
      </div>
    </div>
  );
};

export default RoadmapReimagined;
