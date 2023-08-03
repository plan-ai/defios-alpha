import React from 'react';
import LogoFull from '@/assets/images/logo-full.png';
import Image from '@/components/ui/image';

interface NavProps {}

export const Nav: React.FC<NavProps> = ({}) => {
  return (
    <div className="mt-5 inline-flex w-full items-center justify-between gap-[193px] px-[3rem]">
      <div className="h-10 xl:h-12 3xl:h-14">
        <Image
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 'auto', height: '100%' }} // optional
          src={LogoFull}
        />
      </div>
      <div className="flex items-center justify-center gap-7 text-sm font-normal leading-[21px] tracking-tight text-white xl:text-base 3xl:text-lg">
        <div>features</div>
        <div>how it works</div>
        <div>docs</div>
        <div>pricing</div>
      </div>
      <div className="flex items-center justify-center gap-4 text-sm font-medium leading-[21px] tracking-tight text-indigo-300 xl:text-base 3xl:text-lg">
        <div>say hi!</div>
      </div>
    </div>
  );
};

export default Nav;
