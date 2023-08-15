import React from 'react';
import Image from '@/components/ui/image';
import LandingScreen from '@/assets/images/LandingScreen1.png';

interface HeaderScreenProps {}

export const HeaderScreen: React.FC<HeaderScreenProps> = ({}) => {
  return (
    <div className="relative flex h-[907px] w-[1368.50px] items-start justify-center">
      <div className="absolute h-[800px] w-[1000px] opacity-75 blur-[100px]">
        <div className="absolute left-[600px] top-[-60px] h-[1200px] w-[720px] origin-top-left rotate-[19.53deg] rounded-full bg-cyan-800 blur-[100px]" />
        <div className="absolute left-[400px] top-[310px] h-[600px] w-[620px] rounded-full bg-white blur-[100px]" />
        <div className="absolute left-[-50px] top-[260px] h-[530px] w-[530px] rounded-full bg-white blur-[100px]" />
        <div className="absolute left-[-40px] top-[65px] h-[830px] w-[680px] rounded-full bg-indigo-300 blur-[100px]" />
      </div>
      <div className="absolute left-0 top-[18px] h-[775.50px] w-[1368.50px]">
        <div className="absolute left-[-10px] top-[20px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="169"
            height="95"
            viewBox="0 0 169 95"
            fill="none"
          >
            <g opacity="0.1">
              <path d="M1 1L168 94" stroke="white" strokeWidth="2" />
            </g>
          </svg>
        </div>
        <div className="absolute left-[180px] top-[1.5px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="102"
            height="86"
            viewBox="0 0 102 86"
            fill="none"
          >
            <g opacity="0.1">
              <path d="M1.5 1.5L101 84.5" stroke="white" strokeWidth="2" />
            </g>
          </svg>
        </div>
        <div className="absolute right-[-10px] top-[1.5px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="984"
            height="119"
            viewBox="0 0 984 119"
            fill="none"
          >
            <g opacity="0.1">
              <path
                d="M1.5 2L64.5 89M155 1L193.5 87M433.5 1L406 87M586 2L524 87M785 2L685 86.5M982.5 20.5L817.5 117.5"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
        <div className="absolute left-[-10px] bottom-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="604"
            height="142"
            viewBox="0 0 604 142"
            fill="none"
          >
            <g opacity="0.1">
              <path
                d="M187.5 2.5L1 106M357 2.5L192 140.5M487.5 1.5L386.5 140.5M603 1.5L542.5 139"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
        <div className="absolute right-[-10px] bottom-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="596"
            height="142"
            viewBox="0 0 596 142"
            fill="none"
          >
            <g opacity="0.1">
              <path
                d="M393 1L594.5 118.5M231.5 1L395.5 138M99.5 2L199.5 140.5M1 1.5L47 141.5"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>

        <div className="absolute left-[1px] top-[1.50px] h-[0px] w-[1366px] border border-white opacity-10"></div>
        <div className="absolute left-[1px] top-[80.50px] h-[0px] w-[1366px] border border-white opacity-10"></div>
        <div className="absolute left-[1px] top-[770.50px] h-[0px] w-[1366px] border border-white opacity-10"></div>
        <div className="absolute left-[1px] top-[700.50px] h-[0px] w-[1366px] border border-white opacity-10"></div>
        <div className="absolute left-[1px] top-[641.50px] h-[0px] w-[1366px] border border-white opacity-10"></div>
        <div className="absolute left-[153px] top-[1.50px] h-[0px] w-[769px] origin-top-left rotate-90 border border-white opacity-10"></div>
        <div className="absolute left-[1205px] top-[1.50px] h-[0px] w-[769px] origin-top-left rotate-90 border border-white opacity-10"></div>
      </div>

      <Image
        width={0}
        height={0}
        alt="screen"
        className="absolute mt-[60px] w-[1050px] rounded-lg drop-shadow-2xl"
        src={LandingScreen}
      />
    </div>
  );
};

export default HeaderScreen;
