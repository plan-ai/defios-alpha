import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';
import RootLayout from '@/layouts/_root-layout';

import WalletCard from '@/components/ui/wallet-card';
import CoinDetailsCard from '@/components/ui/coin-details-card';

const SwapPage: NextPageWithLayout = () => {
  let [toggleCoin, setToggleCoin] = useState(false);
  return (
    <>
      <NextSeo
        title="Swaps"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="flex w-full flex-row items-start justify-evenly px-5">
        <Trade>
          <div className="mb-5 border-b border-dashed border-gray-800 pb-5 xs:mb-7 xs:pb-6">
            <div
              className={cn(
                'relative flex gap-3',
                toggleCoin ? 'flex-col-reverse' : 'flex-col'
              )}
            >
              <CoinInput
                label={'From'}
                exchangeRate={0.0}
                defaultCoinIndex={0}
                getCoinValue={(data) => console.log('From coin value:', data)}
              />
              <div className="absolute top-1/2 left-1/2 z-[1] -mt-4 -ml-4 rounded-full bg-gray-600 shadow-large">
                <Button
                  size="mini"
                  color="gray"
                  shape="circle"
                  variant="transparent"
                  onClick={() => setToggleCoin(!toggleCoin)}
                >
                  <SwapIcon className="h-auto w-3" />
                </Button>
              </div>
              <CoinInput
                label={'To'}
                exchangeRate={0.0}
                defaultCoinIndex={1}
                getCoinValue={(data) => console.log('To coin value:', data)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 xs:gap-[18px]">
            <TransactionInfo label={'Min. Received'} />
            <TransactionInfo label={'Rate'} />
            <TransactionInfo label={'Offered by'} />
            <TransactionInfo label={'Price Slippage'} value={'1%'} />
            <TransactionInfo label={'Network Fee'} />
            <TransactionInfo label={'Criptic Fee'} />
          </div>
          <Button
            size="large"
            shape="rounded"
            fullWidth={true}
            className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          >
            SWAP
          </Button>
        </Trade>
        <div className="flex flex-col items-center justify-start">
          <CoinDetailsCard />
          <WalletCard />
        </div>
      </div>
    </>
  );
};

SwapPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SwapPage;
