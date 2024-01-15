import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import { LongArrowUp } from '@/components/icons/long-arrow-up';
import { PoolIcon } from '@/components/icons/pool';
import { StaticImageData } from 'next/image';
import { ExportIcon } from '@/components/icons/export-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import cn from 'classnames';
import Avatar from 'react-avatar';

import { fetchDecimals } from '@/lib/helpers/metadata';

interface CardProps {
  item: any;
}

interface TransactionFromToProps {
  transactionUserAvatar: string;
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
        {transactionUser && (
          <Avatar
            name={transactionUser}
            src={transactionUserAvatar}
            className="rounded-full"
            size="40"
          />
        )}
      </div>
      <div className="ml-2 flex flex-col">
        <span className="mb-0.5 text-xs text-gray-400">
          {transactionType === 'inbound' ? 'From' : 'To'}
        </span>
        <strong className="font-medium -tracking-wider text-white">
          {transactionUser}
        </strong>
      </div>
    </div>
  );
};

interface TrasactionAmountELProps {
  transactionCoin: string;
  transactionCoinImg: string;
  transactionAmount: number;
}

export const TrasactionAmountEL: React.FC<TrasactionAmountELProps> = ({
  transactionAmount,
  transactionCoin,
  transactionCoinImg,
}) => {
  return (
    <div className="flex items-center lg:w-1/2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
        <div className="relative h-12 w-12 overflow-hidden rounded-full ">
          <Image
            src={transactionCoinImg || ''}
            alt={transactionCoin || ''}
            className="object-cover"
            fill
          />
        </div>
      </div>
      <div className="ml-2.5 flex flex-col  xl:ml-4">
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

const ContributionsHistoryCard: React.FC<CardProps> = ({ item }) => {
  const dateStr = new Date(item?.contribution_timestamp).toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );
  const timeStr = new Date(item?.contribution_timestamp).toLocaleTimeString(
    'en-IN',
    {
      hour: 'numeric',
      minute: '2-digit',
    }
  );

  return (
    <div className="rounded-xl bg-light-dark p-4 text-sm shadow-card sm:p-5 md:p-6">
      <div className="flex items-center justify-between border-b border-dashed border-gray-700 pb-3.5 sm:pb-5">
        <div className="flex items-center font-medium ">
          {/* <Image
            src={projectImg}
            alt="wallet"
            width={24}
            height={24}
            placeholder="blur"
            className="rounded-full"
          /> */}
          <div className="ml-2  -tracking-wider text-white">
            {item?.contributor_project_name}
          </div>
        </div>
        <div className=" pl-2 text-xs -tracking-wide text-gray-400 xs:text-sm ">
          {dateStr} - {timeStr}
        </div>
      </div>
      <div className="grid grid-cols-9 gap-x-3 pt-4 md:gap-x-5 md:pt-6">
        <div className="col-span-4 flex flex-col gap-2.5 sm:flex-row sm:gap-x-4 md:flex-col 2xl:flex-row">
          <div className="flex items-center lg:w-1/2">
            <div
              className={cn(
                'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white md:h-9 md:w-9 xl:h-10 xl:w-10',
                {
                  'bg-[#D2D786]': item?.contribution_type === 'inbound',
                  'bg-[#F2C672]': item?.contribution_type === 'outbound',
                }
              )}
            >
              <LongArrowUp
                className={`h-5 w-5 xl:h-6 xl:w-6 ${
                  item?.contribution_type === 'inbound'
                    ? 'rotate-180'
                    : 'rotate-0'
                }`}
              />
              {/* <div className="absolute top-0 -right-1.5 ">
                <VerifiedIcon className="h-4 w-4" />
              </div> */}
            </div>
            <div className="ml-2.5 flex flex-col  xl:ml-4">
              <strong className="mb-0.5 font-medium -tracking-wider text-white">
                {item?.contribution_type === 'inbound' ? 'Receive' : 'Send'}
              </strong>
              <span className="text-xs text-gray-400">{timeStr}</span>
            </div>
          </div>
          {item?.contribution_type === 'inbound' ? (
            <TransactionFromTo
              transactionType={item?.contribution_type}
              transactionUser={item?.contributor_name}
              transactionUserAvatar={item?.contributor_profile_pic}
            />
          ) : (
            <TrasactionAmountEL
              transactionAmount={
                item?.contribution_amt
              }
              transactionCoin={item?.contribution_token_symbol}
              transactionCoinImg={item?.token_image_url}
            />
          )}
        </div>
        <div className="col-span-1 flex items-center text-gray-400 sm:pl-3 md:pl-0 lg:pl-3">
          <LongArrowRight className="h-5 w-5 md:h-6 md:w-6 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
        </div>
        <div className="col-span-4  flex flex-col gap-2.5 sm:flex-row sm:gap-x-4 md:flex-col 2xl:flex-row">
          {item?.contribution_type === 'inbound' ? (
            <TrasactionAmountEL
              transactionAmount={
                item?.contribution_amt
              }
              transactionCoin={item?.contribution_token_symbol}
              transactionCoinImg={item?.token_image_url}
            />
          ) : (
            <TransactionFromTo
              transactionType={item?.contribution_type}
              transactionUser={item?.contributor_name}
              transactionUserAvatar={item?.contributor_profile_pic}
            />
          )}
          <div className="flex items-center lg:w-2/3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
              <PoolIcon className="h-4 w-4" />
            </div>
            <div className="ml-2.5 flex flex-col  xl:ml-4">
              <span className="mb-0.5 text-xs text-gray-400">For Solving</span>
              <strong className="font-medium -tracking-wider text-white">
                <AnchorLink
                  href={item?.contribution_link || '#'}
                  target="_blank"
                >
                  <div className="flex items-center justify-center">
                    <div>
                      {item?.contribution_link?.includes('pull')
                        ? 'Pull Request'
                        : item?.contribution_link?.includes('issue')
                        ? 'Issue'
                        : null}
                    </div>
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
};

export default ContributionsHistoryCard;
