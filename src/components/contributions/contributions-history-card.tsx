import React from 'react';
import Image from '@/components/ui/image';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import { LongArrowUp } from '@/components/icons/long-arrow-up';
import { VerifiedIcon } from '@/components/icons/verified-icon';
import { PoolIcon } from '@/components/icons/pool';
import { StaticImageData } from 'next/image';
import { coinListBig } from '@/data/static/coin-list';
import { ExportIcon } from '@/components/icons/export-icon';
import AnchorLink from '@/components/ui/links/anchor-link';

type CardProps = {
  projectName: string;
  projectImg: StaticImageData | string;
  date: string;
  time: string;
  transactionType: string;
  transactionUser: string;
  transactionUserAvatar: StaticImageData | string;
  transactionCoin: string;
  transactionAmount: number;
  PRLink: string;
};

interface TransactionFromToProps {
  transactionUserAvatar: StaticImageData | string;
  transactionUser: string;
  transactionType: string;
}

const TransactionFromTo: React.FC<TransactionFromToProps> = ({
  transactionType,
  transactionUser,
  transactionUserAvatar,
}) => {
  return (
    <div className="flex items-center lg:w-1/2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {transactionUserAvatar && (
          <Image
            src={transactionUserAvatar}
            alt={transactionUser}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>
      <div className="ml-2.5 flex flex-col truncate xl:ml-4">
        <span className="mb-0.5 text-xs text-gray-400">
          {transactionType === 'received' ? 'From' : 'To'}
        </span>
        <strong className="truncate font-medium -tracking-wider text-white">
          {transactionUser}
        </strong>
      </div>
    </div>
  );
};

interface TrasactionAmountELProps {
  transactionCoin: string;
  transactionAmount: number;
}

const TrasactionAmountEL: React.FC<TrasactionAmountELProps> = ({
  transactionAmount,
  transactionCoin,
}) => {
  return (
    <div className="flex items-center lg:w-1/2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {coinListBig.find((el) => el.code === transactionCoin)?.icon}
      </div>
      <div className="ml-2.5 flex flex-col truncate xl:ml-4">
        <span className="mb-0.5 text-xs text-gray-400">
          {transactionAmount}
        </span>
        <strong className="font-medium -tracking-wider text-white">
          {transactionCoin}
        </strong>
      </div>
    </div>
  );
};

export default function ContributionsHistoryCard({
  item,
}: {
  item: CardProps;
}) {
  const {
    projectName,
    projectImg,
    date,
    time,
    transactionCoin,
    transactionUserAvatar,
    transactionUser,
    transactionAmount,
    transactionType,
    PRLink,
  } = item ?? {};
  const bgColor = transactionType === 'received' ? '#D2D786' : '#F2C672';
  return (
    <div className="rounded-lg bg-light-dark p-4 text-sm shadow-card sm:p-5 md:p-6">
      <div className="flex items-center justify-between border-b border-dashed border-gray-700 pb-3.5 sm:pb-5">
        <div className="flex items-center font-medium ">
          <Image
            src={projectImg}
            alt="wallet"
            width={24}
            height={24}
            placeholder="blur"
            className="rounded-full"
          />
          <div className="ml-2 truncate -tracking-wider text-white">
            {projectName}
          </div>
        </div>
        <div className="truncate pl-2 text-xs -tracking-wide text-gray-400 xs:text-sm ">
          {date}
        </div>
      </div>
      <div className="grid grid-cols-9 gap-x-3 pt-4 md:gap-x-5 md:pt-6">
        <div className="col-span-4 flex flex-col gap-2.5 sm:flex-row sm:gap-x-4 md:flex-col 2xl:flex-row">
          <div className="flex items-center lg:w-1/2">
            <div
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white md:h-9 md:w-9 xl:h-10 xl:w-10"
              style={{ backgroundColor: bgColor }}
            >
              <LongArrowUp
                className={`h-5 w-5 xl:h-6 xl:w-6 ${
                  transactionType === 'received' ? 'rotate-180' : 'rotate-0'
                }`}
              />
              {/* <div className="absolute top-0 -right-1.5 ">
                <VerifiedIcon className="h-4 w-4" />
              </div> */}
            </div>
            <div className="ml-2.5 flex flex-col truncate xl:ml-4">
              <strong className="mb-0.5 font-medium -tracking-wider text-white">
                {transactionType === 'received' ? 'Receive' : 'Send'}
              </strong>
              <span className="text-xs text-gray-400">{time}</span>
            </div>
          </div>
          {transactionType === 'received' ? (
            <TransactionFromTo
              transactionType={transactionType}
              transactionUser={transactionUser}
              transactionUserAvatar={transactionUserAvatar}
            />
          ) : (
            <TrasactionAmountEL
              transactionAmount={transactionAmount}
              transactionCoin={transactionCoin}
            />
          )}
        </div>
        <div className="col-span-1 flex items-center text-gray-400 sm:pl-3 md:pl-0 lg:pl-3">
          <LongArrowRight className="h-5 w-5 md:h-6 md:w-6 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
        </div>
        <div className="col-span-4  flex flex-col gap-2.5 sm:flex-row sm:gap-x-4 md:flex-col 2xl:flex-row">
          {transactionType === 'received' ? (
            <TrasactionAmountEL
              transactionAmount={transactionAmount}
              transactionCoin={transactionCoin}
            />
          ) : (
            <TransactionFromTo
              transactionType={transactionType}
              transactionUser={transactionUser}
              transactionUserAvatar={transactionUserAvatar}
            />
          )}
          <div className="flex items-center lg:w-1/2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
              <PoolIcon className="h-4 w-4" />
            </div>
            <div className="ml-2.5 flex flex-col truncate xl:ml-4">
              <span className="mb-0.5 text-xs text-gray-400">For Solving</span>
              <strong className="font-medium -tracking-wider text-white">
                <AnchorLink href={PRLink} target="_blank">
                  <div className="flex items-center justify-center">
                    <div>Pull Request</div>
                    <ExportIcon className="ml-2 h-3 w-3" />
                  </div>
                </AnchorLink>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
