import React from 'react';

import LogoFull from '@/assets/images/logo-full.png';
import Image from '@/components/ui/image';

import AnchorLink from '@/components/ui/links/anchor-link';

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
      <AnchorLink href={'#'} className="h-12 xl:h-13 3xl:h-14">
        <Image
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 'auto', height: '100%' }} // optional
          src={LogoFull}
        />
      </AnchorLink>
      <div className="flex flex-col items-end gap-8">
        <div className="flex gap-8 text-base xl:text-lg 3xl:text-xl">
          <AnchorLink
            href={'mailto:hellodefiOS@gmail.com'}
            className="text-indigo-300"
          >
            say hi
          </AnchorLink>
          <AnchorLink href={'#'}>terms of services</AnchorLink>
          <AnchorLink href={'#'}>privacy policy</AnchorLink>
          <div>Copyright © 2023</div>
        </div>
        <div className="flex gap-10">
          <AnchorLink
            href={'https://twitter.com/defiOSofficial'}
            target="_blank"
            className="flex h-8 w-10 cursor-pointer items-center justify-center"
          >
            <XTwitterIcon />
          </AnchorLink>
          <AnchorLink
            href={'https://discord.gg/kMDuqbccey'}
            target="_blank"
            className="flex h-8 w-10 cursor-pointer items-center justify-center"
          >
            <DiscordIcon />
          </AnchorLink>
          <AnchorLink
            href={'https://github.com/defi-os'}
            target="_blank"
            className="flex h-8 w-10 cursor-pointer items-center justify-center"
          >
            <GithubIcon />
          </AnchorLink>
          <AnchorLink
            href={'#'}
            className="flex h-8 w-10 cursor-pointer items-center justify-center"
          >
            <YoutubeIcon />
          </AnchorLink>
          <AnchorLink
            href={'#'}
            className="flex h-8 w-10 cursor-pointer items-center justify-center"
          >
            <MediumIcon />
          </AnchorLink>
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
