import React from 'react';

import LogoFull from '@/assets/images/logo-full.png';
import Image from '@/components/ui/image';

//icons
import { XTwitterIcon } from '@/components/icons/brand/x-twitter';
import { DiscordIcon } from '@/components/icons/brand/discord';
import { GithubIcon } from '@/components/icons/brand/github';
import { YoutubeIcon } from '@/components/icons/brand/youtube';
import { MediumIcon } from '@/components/icons/brand/medium';

interface LandingFooterProps {}

export const LandingFooter: React.FC<LandingFooterProps> = ({}) => {
  return (
    <div className="flex w-screen justify-between border-t-2 border-primary bg-[#060606] py-16 px-12">
      <div className="h-12 xl:h-13 3xl:h-14">
        <Image
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 'auto', height: '100%' }} // optional
          src={LogoFull}
        />
      </div>
      <div className="flex flex-col items-end gap-8">
        <div className="flex gap-8 text-base xl:text-lg 3xl:text-xl">
          <div className="text-indigo-300">say hi</div>
          <div>terms of services</div>
          <div>privacy policy</div>
          <div>Copyright © 2023</div>
        </div>
        <div className="flex gap-10">
          <div className="flex h-8 w-10 cursor-pointer items-center justify-center">
            <XTwitterIcon />
          </div>
          <div className="flex h-8 w-10 cursor-pointer items-center justify-center">
            <DiscordIcon />
          </div>
          <div className="flex h-8 w-10 cursor-pointer items-center justify-center">
            <GithubIcon />
          </div>
          <div className="flex h-8 w-10 cursor-pointer items-center justify-center">
            <YoutubeIcon />
          </div>
          <div className="flex h-8 w-10 cursor-pointer items-center justify-center">
            <MediumIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
