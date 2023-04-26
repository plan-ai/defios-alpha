import { useState, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';
import RootLayout from '@/layouts/_root-layout';

import RightSideInfo from '@/components/swaps/right-side-info';
import Spinner from '@/components/custom/spinner';
import { useAppSelector } from '@/store/store';
import axios from 'axios';

const SwapPage: NextPageWithLayout = () => {
  const [toggleCoin, setToggleCoin] = useState(false);
  const [coinList, setCoinList] = useState<any>([]);
  const [fromCoin, setFromCoin] = useState<any>(null);
  const [toCoin, setToCoin] = useState<any>(null);

  const auth_cred = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const getAllImgUrls = async (data: any) => {
    const tokens = data;
    const newTokens = await Promise.all(
      await tokens.map(async (token: any): Promise<any> => {
        const _token = token;
        const _url = _token?.token_image_url;
        if (_url.includes('gateway.pinata.cloud')) {
          const IpfsNewGateway = _url.replace(
            'gateway.pinata.cloud',
            'ipfs.io'
          );
          await axios
            .get(IpfsNewGateway)
            .then((res) => {
              if (typeof res.data === 'object') {
                if (res.data.image) {
                  _token.token_image_url = res.data.image;
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (_url == '') {
          await axios
            .get(
              `https://public-api.solscan.io/token/meta?tokenAddress=${_token.token_spl_addr}`,
              {
                headers: {
                  token: process.env.SOLSCAN_TOKEN,
                },
              }
            )
            .then((res) => {
              if (res.data.icon) {
                _token.token_image_url = res.data.icon;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        return _token;
      })
    );
    setCoinList(newTokens);
  };

  useEffect(() => {
    if (auth_cred === null) return;
    axios
      .get('https://api-v1.defi-os.com/swap/list', {
        headers: {
          Authorization: auth_cred,
        },
      })
      .then((res) => {
        getAllImgUrls(res.data);
      })
      .catch((err) => console.log(err.message));
  }, [auth_cred]);

  return (
    <>
      <NextSeo
        title="Swaps"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <div className="flex h-full w-full items-center justify-between">
        <Trade>
          <div className="w-[18.7rem] border-b border-dashed border-gray-800 mb-3 pb-2 xl:mb-5 xl:pb-4 3xl:mb-7 3xl:pb-6 xl:w-[20.2rem] 2xl:w-[22.7rem] 3xl:w-[24.2rem]">
            {coinList.length !== 0 ? (
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
                  coinList={coinList}
                  selectedCoin={fromCoin}
                  setSelectedCoin={setFromCoin}
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
                  coinList={coinList}
                  selectedCoin={toCoin}
                  setSelectedCoin={setToCoin}
                />
              </div>
            ) : (
              <Spinner />
            )}
          </div>
          <div className="flex flex-col gap-3 xl:gap-3.5 3xl:gap-4">
            <TransactionInfo label={'Min. Received'} />
            <TransactionInfo label={'Rate'} />
            <TransactionInfo label={'Offered by'} />
            <TransactionInfo label={'Price Slippage'} value={'1%'} />
            <TransactionInfo label={'Network Fee'} />
            <TransactionInfo label={'DefiOS Fee'} />
          </div>
          <Button
            size="large"
            shape="rounded"
            fullWidth={true}
            className="mt-4 xl:mt-6 3xl:mt-8 uppercase xs:tracking-widest"
            color="info"
          >
            SWAP
          </Button>
        </Trade>
        <RightSideInfo coin={toCoin} />
      </div>
    </>
  );
};

SwapPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SwapPage;
