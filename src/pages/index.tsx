import { signIn, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import LogoFull from '@/assets/images/logo-full.png';
import React from 'react';
import Button from '@/components/ui/button/button';

const Globe = dynamic(import('../components/Globe'), { ssr: false });

interface HomepageProps {}

const Homepage: React.FC<HomepageProps> = ({}) => {
  const { data: session } = useSession();
  const actionButtons = () => (
    <div className="flex gap-3">
      <button className="rounded border border-[#90A9FC] px-4 py-2 text-sm font-semibold leading-3 text-[#90A9FC]">
        BUY
      </button>
      <button className="rounded border border-[#90A9FC] px-4 py-2 text-sm font-semibold leading-3 text-[#90A9FC]">
        SELL
      </button>
    </div>
  );

  const tableData = {
    columns: ['Name', 'Price', 'Contributors', 'Buy Date', 'Name', 'Actions'],
    rows: [
      {
        id: 1,
        name: '$DoS',
        price: 4535.23,
        contributors: 2,
        buyDate: 'in 6 months',
        untility: 'DeFiOS',
        actions: actionButtons,
      },
      {
        id: 2,
        name: '$SNE',
        price: 3456.66,
        contributors: 5,
        buyDate: 'in 6 months',
        untility: 'Superteam Earn',
        actions: actionButtons,
      },
      {
        id: 3,
        name: '$FFx',
        price: 1343.33,
        contributors: 77,
        buyDate: 'in 6 months',
        untility: 'Firefox',
        actions: actionButtons,
      },
      {
        id: 4,
        name: '$LNX',
        price: 465.23,
        contributors: 1820,
        buyDate: 'in 6 months',
        untility: 'Linux',
        actions: actionButtons,
      },
      {
        id: 5,
        name: '$GMP',
        price: 3425.54,
        contributors: 65,
        buyDate: 'in 6 months',
        untility: 'GIMP',
        actions: actionButtons,
      },
      {
        id: 6,
        name: '$VLC',
        price: 546.23,
        contributors: 772,
        buyDate: 'in 6 months',
        untility: 'VLC',
        actions: actionButtons,
      },
    ],
  };
  return (
    <div className="min-h-full">
      <div className="homepageGradient flex h-screen w-full flex-col items-center justify-start px-[6%] py-[2%] text-white">
        <Head>
          <title>Defios - Tokenize your Open Source Project.</title>
        </Head>

        {/* navbar */}
        <div className="z-20 flex h-[7vh] w-full flex-row items-center justify-between">
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

        <div className="absolute z-10 hidden h-screen w-full flex-row-reverse items-center overflow-hidden lg:flex">
          <Globe />
        </div>

        <div className="z-20 flex h-full w-full items-center justify-start px-[6%]">
          <div className="">
            <div className="workSansFont flex w-full flex-col items-start justify-center text-[10vh] font-semibold leading-[12vh]">
              <div>Tokenize Your</div>
              <div>Open Source</div>
              <div>Project</div>
            </div>
            <div className="m-auto my-[8%] flex w-[100%] flex-col items-center justify-center text-[2.3vh]">
              <div className="flex w-full flex-col items-start justify-center">
                <div className="text-[#9D9AA7]">
                  Discover the tokens of open-source
                </div>
                <div className="text-[#9D9AA7]">
                  infrastructure projects that are key to the
                </div>
                <div className="text-[#9D9AA7]">developer ecosystem.</div>
              </div>
            </div>
            <div className="flex w-full gap-4 flex-row items-center justify-start text-[2vh] font-semibold text-white">
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
                  Continue with GitHub
                </Button>
              )}
              {session && (
                <Link href="/home">
                  <Button shape="rounded" color="info">
                    Continue with GitHub
                  </Button>
                </Link>
              )}
              <Button shape="rounded">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="homepageGradient flex h-screen w-full flex-col items-center justify-start px-[6%] py-[2%] text-white">
        <div className="workSansFont flex w-full items-center justify-center text-[4vh] font-bold leading-[12vh] md:text-[5vh] lg:text-[6vh]">
          Every Repository has a Token
        </div>
        <div className="flex w-full justify-center overflow-auto">
          <table className="glass-table w-[85%] table-auto xl:w-[70%]">
            <thead>
              <tr className="border-b border-b-slate-700">
                {tableData.columns.map((col) => (
                  <th key={col} className="truncate p-6 text-start">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index < tableData.rows.length - 1
                      ? 'border-b border-b-slate-700'
                      : ''
                  }
                >
                  <td className="truncate px-5 py-4">{row.name}</td>
                  <td className="truncate px-5 py-4">{row.price}</td>
                  <td className="truncate px-5 py-4">{row.contributors}</td>
                  <td className="truncate px-5 py-4">{row.buyDate}</td>
                  <td className="truncate px-5 py-4">{row.untility}</td>
                  <td className="truncate px-5 py-4">{row.actions()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
