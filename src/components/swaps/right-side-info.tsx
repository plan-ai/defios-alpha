import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Avatar from '@/components/ui/avatar';
import HoldersChart from '@/components/swaps/holders-chart';
//images
import AuthorImage from '@/assets/images/coin/binance.svg';
import TransactionInfo from '@/components/ui/transaction-info';
import PriceChart from '@/components/ui/chats/price-chart';
import Image from 'next/image';
import Spinner from '../custom/spinner';

import { useAppSelector } from '@/store/store';
import axios from 'axios';

export default function RightSideInfo({
  className,
  coin,
}: {
  className?: string;
  coin: any;
}) {
  const [coinInfo, setCoinInfo] = useState<any>(null);
  const [priceChartData, setPriceChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const auth_cred = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    setCoinInfo(null);
    if (auth_cred === null || coin === null) return;
    axios
      .get('https://api-v1.defi-os.com/swap/profile', {
        params: {
          token_symbol: coin.token_symbol,
        },
        headers: {
          Authorization: auth_cred,
        },
      })
      .then((res) => {
        setCoinInfo(res.data?.details);
      })
      .catch((err) => console.log(err.message));
  }, [coin, auth_cred]);

  useEffect(() => {
    setPriceChartData(null);
    if (coinInfo === null) return;
    if (coinInfo?.token_price_feed && coinInfo.token_price_feed === '') return;
    axios
      .post('api/token/price-chart', {
        price_url: coinInfo?.token_price_feed,
      })
      .then((res) => {
        setPriceChartData(res.data);
      })
      .catch((err) => console.log(err));
  }, [coinInfo]);

  useEffect(() => {
    setPieChartData(null);
    if (coin === null) return;
    if (coin?.token_spl_addr && coin.token_spl_addr === '') return;
    axios
      .post('api/token/holders-data', {
        token_address: coin?.token_spl_addr,
      })
      .then((res) => {
        setPieChartData(res.data);
      })
      .catch((err) => console.log(err));
  }, [coin]);

  return (
    <aside
      className={cn(
        'top-0 right-0 z-20 h-full w-full max-w-full border-dashed border-gray-700 lg:fixed lg:w-[400px] lg:border-l xl:pt-20 3xl:w-[550px]',
        className
      )}
    >
      <Scrollbar style={{ height: 'calc(100% - 20px)' }}>
        <div className="relative z-20 h-screen pb-5">
          <div className="my-16 mx-5 flex h-full flex-col justify-between overflow-x-hidden rounded-lg bg-transparent sm:mx-6 sm:flex-row lg:mx-0 lg:flex-col lg:p-6 xl:my-0 2xl:p-8">
            {coinInfo !== null ? (
              <div className="w-full sm:w-[48%] lg:w-full">
                {coinInfo?.token_image_url && (
                  <Image
                    src={coinInfo?.token_image_url || ''}
                    alt="Author"
                    width={80}
                    height={80}
                    className="mx-auto mb-6"
                  />
                )}
                <TransactionInfo
                  className="my-5"
                  label={'Coin Name'}
                  value={coinInfo?.token_name}
                />
                <TransactionInfo
                  className="my-5"
                  label={'Created By'}
                  value={
                    coinInfo?.token_creator_name.slice(0, 8) +
                    '...' +
                    coinInfo?.token_creator_name.slice(36, 44)
                  }
                />
                <TransactionInfo
                  className="my-5"
                  label={'Created At'}
                  value={new Date(
                    coinInfo?.token_creation_date
                  ).toLocaleDateString('en-IN')}
                />
                <TransactionInfo
                  className="my-5"
                  label={'Total Supply'}
                  value={coinInfo?.token_total_supply}
                />
                <TransactionInfo
                  className="my-5"
                  label={'Circulating Supply'}
                  value={coinInfo?.token_circulating_supply}
                />
                <div className="my-5">Last Traded Price:</div>
                {priceChartData !== null && (
                  <PriceChart
                    chartData={priceChartData.data}
                    change={priceChartData.change}
                  />
                )}
                <div>
                  <span className="-mx-6 block border-t border-dashed border-t-gray-700 3xl:-mx-8" />
                </div>
                <span className="-mx-6 block border-t border-dashed border-t-gray-700 3xl:-mx-8" />
              </div>
            ) : (
              <Spinner />
            )}
            {pieChartData !== null ? (
              <div className="mt-10 w-full sm:mt-0 sm:w-[48%] lg:mt-8 lg:w-full">
                <HoldersChart chartData={pieChartData} />
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
