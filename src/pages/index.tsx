import { signIn, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import LogoFull from '@/assets/images/logo-full.png';
import React from 'react';
import Button from '@/components/ui/button/button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Globe = dynamic(import('../components/Globe'), { ssr: false });

interface HomepageProps {}

const Homepage: React.FC<HomepageProps> = ({}) => {
  const { data: session } = useSession();
  return (
    <div className="h-screen">
      <div className="homepageGradient flex h-full w-full flex-col items-center justify-start px-[6%] text-white">
        <Head>
          <title>DefiOS - Scaling Layer for Open Source Collaborations.</title>
        </Head>

        {/* navbar */}
        <div className="z-20 flex h-[7vh] w-full flex-row items-center justify-between pt-[2%]">
          <Image src={LogoFull} alt="logo" height={60} />
          <div className="flex h-full w-full flex-row items-center justify-end">
            <a
              href="#"
              target="_blank"
              className="mx-[2%] text-[2vh] font-bold text-[#90A9FC]"
            >
              Alpha 🚀
            </a>
            <a href="#" target="_blank" className="mx-[2%] text-[2vh]">
              For Projects 👨‍💻
            </a>
            <a href="#" target="_blank" className="mx-[2%] text-[2vh]">
              For Entrepreneurs 🤔
            </a>
            <a href="#" target="_blank" className="mx-[2%] text-[2vh]">
              For Enterprise 🏦
            </a>
            <a
              href="mailto:abhi@defi-os.com?Subject=Product%20Query"
              className="mx-[2%] text-[2vh]"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="absolute z-10 hidden h-screen w-full flex-row-reverse items-center overflow-hidden pt-[2%] lg:flex">
          <Globe />
        </div>

        <div className="z-20 flex h-full w-full items-center justify-start px-[6%] pt-[2%]">
          <div className="">
            <div className="workSansFont flex w-full flex-col items-start justify-center text-[10vh] font-semibold leading-[12vh]">
              <div>Scaling Layer for</div>
              <div>Open Source</div>
              <div>Collaborations</div>
            </div>
            <div className="m-auto my-[8%] flex w-[100%] flex-col items-center justify-center text-[2.3vh]">
              <div className="flex w-full flex-col items-start justify-center">
                <div className="text-[#9D9AA7]">
                  Tokenize your project in 4 clicks and onboard incentivized
                </div>
                <div className="text-[#9D9AA7]">
                  contributors. Stake tokens on issues to allow devs to compete
                </div>
                <div className="text-[#9D9AA7]">
                  for the reward and discover the price of closing your issue.
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row items-center justify-start gap-4 text-[2vh] font-semibold text-white">
              {!session && (
                <Button
                  onClick={() =>
                    signIn('github', {
                      callbackUrl: `${window.location.origin}/home`,
                    })
                  }
                  shape="rounded"
                  className="!bg-[#90A9FC] !text-black"
                >
                  Continue with GitHub{' '}
                  <ArrowRightIcon className=" inline-block h-5 w-5 text-black" />
                </Button>
              )}
              {session && (
                <Link href="/home">
                  <Button shape="rounded" className="!bg-[#90A9FC] !text-black">
                    Continue with GitHub{' '}
                    <ArrowRightIcon className=" inline-block h-5 w-5 text-black" />
                  </Button>
                </Link>
              )}
              <Button shape="rounded">View Documentation</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
