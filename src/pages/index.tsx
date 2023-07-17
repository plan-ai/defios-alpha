import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import LogoFull from '@/assets/images/logo-full.png';
import React from 'react';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import axios from '@/lib/axiosClient';

const Globe = dynamic(import('../components/Globe'), { ssr: false });

interface HomepageProps {}

const Homepage: React.FC<HomepageProps> = ({}) => {
  const { data: session } = useSession();

  // const [email, setEmail] = useState('');
  // const onSubmitHandler = () => {
  //   if (email === '' || !email.includes('@')) return;
  //   axios
  //     .post(
  //       `https://api-v1.defi-os.com/waitlist/jobs?email=${email}&wl_type=jobs`
  //     )
  //     .then((res) => {
  //       setEmail('');
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <div className="h-screen">
      <div className="homepageGradient flex h-full w-full flex-col items-center justify-start px-[6%] text-white">
        <Head>
          <title>DefiOS - Scaling Layer for Open Source Collaboration.</title>
        </Head>

        {/* navbar */}
        <div className="z-20 flex h-[7vh] w-full flex-row items-center justify-between pt-[2%]">
          <Image src={LogoFull} alt="logo" height={60} />
          <div className="flex h-full w-full flex-row items-center justify-end">
            {/* <a
              href="#"
              target="_blank"
              className="mx-[2%] text-[2vh] font-bold text-[#90A9FC]"
            >
              View Documentation
            </a>
            <a href="#" target="_blank" className="mx-[2%] text-[2vh]">
              For Projects 👨‍💻
            </a>
            <a href="#" target="_blank" className="mx-[2%] text-[2vh]">
              For Entrepreneurs 🤔
            </a>
            <a href="#" target="_blank" className="mx-[2%] text-[2vh]">
              For Enterprise 🏦
            </a> */}
            <a
              href="mailto:hellodefios@gmail.com?Subject=Product%20Query"
              className="mx-[2%] text-[2vh]"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="absolute z-10 hidden h-screen w-full flex-row-reverse items-center overflow-hidden pt-[2%] lg:flex">
          <Globe />
        </div>

        <div className="z-20 flex h-full w-full items-center justify-start px-[6%]">
          <div className="">
            <div className="workSansFont flex w-full flex-col items-start justify-center text-[10vh] font-semibold leading-[12vh]">
              <div>Scaling Layer for</div>
              <div>Open Source</div>
              <div>Collaboration</div>
            </div>
            <div className="m-auto my-4 flex w-[100%] flex-col items-center justify-center text-[2.3vh]">
              <div className="flex w-full flex-col items-start justify-center">
                <div className="my-2 text-[#9D9AA7]">
                  Tokenize your open source project in just 4 clicks!
                  <br />
                  With defiOS, you can incentivize contributors to compete for
                  <br />
                  rewards by staking tokens on specific issues.
                </div>
                <div className="my-2 text-[#9D9AA7]">
                  Say goodbye to thankless traditional open source software and
                  <br />
                  hello to a more efficient, collaborative, and rewarding
                  process.
                  <br />
                  Try defiOS today!
                </div>
              </div>
            </div>
            <div className="flex w-full gap-4 text-[2vh] font-semibold text-white">
              {!session && (
                <Button
                  onClick={() =>
                    signIn('github', {
                      callbackUrl: `${window.location.origin}/home`,
                    })
                  }
                  shape="rounded"
                  color="info"
                >
                  Continue with GitHub{' '}
                  <ArrowRightIcon className=" inline-block h-5 w-5" />
                </Button>
              )}
              {session && (
                <Link href="/home">
                  <Button shape="rounded" color="info">
                    Continue with GitHub{' '}
                    <ArrowRightIcon className=" inline-block h-5 w-5" />
                  </Button>
                </Link>
              )}
              {/* <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[25rem]"
                />
                <Button onClick={onSubmitHandler} shape="rounded" color="info">
                  Join Waitlist
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
