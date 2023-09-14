import { useState, useEffect } from 'react';
import cn from 'classnames';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import Trade from '@/components/ui/trade';

import AnchorLink from '@/components/ui/links/anchor-link';
import RightSideInfo from '@/components/swaps/right-side-info';
import Spinner from '@/components/custom/spinner';

import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppSelector, useAppDispatch } from '@/store/store';
import axios from '@/lib/axiosClient';

import mixpanel from 'mixpanel-browser';

import {
  calculateBuyAmount,
  getSupplyModified,
  buyTransaction,
} from '@/lib/helpers/contractInteract';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

interface BuyConsoleProps {
  setConsoleType: React.Dispatch<React.SetStateAction<'swap' | 'buy'>>;
}

const BuyConsole: React.FC<BuyConsoleProps> = ({ setConsoleType }) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const userMappingState = useAppSelector(selectUserMapping);

  const wallet = useWallet();

  const [coinList, setCoinList] = useState<any>([]);
  const [toCoin, setToCoin] = useState<any>(null);
  const fromCoin = {
    token_image_url:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU/logo.png',
    token_symbol: 'USDC',
  };

  const [buySupply, setBuySupply] = useState<BN>(new BN(0));

  const [usdcAmt, setUsdcAmt] = useState<string>('0');
  const [buyAmt, setBuyAmt] = useState<string>('0');

  const [buyAmtBN, setBuyAmtBN] = useState<BN>(new BN(0));
  const [usdcAmtBN, setUsdcAmtBN] = useState<BN>(new BN(0));

  const [buyDecimals, setBuyDecimals] = useState(0);

  const handleBuyChange = (e: any) => {
    const buyAmount = e.target.value.toString();
    const usdcAmount = calculateBuyAmount(buySupply, new BN(buyAmount));

    setBuyAmt(e.target.value);
    setBuyAmtBN(new BN(buyAmount).mul(new BN(10).pow(new BN(buyDecimals))));
    setUsdcAmtBN(usdcAmount);
    setUsdcAmt((parseInt(usdcAmount.toString()) / 10 ** 6).toString());
  };

  const auth_cred = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (toCoin === null) return;
    if (toCoin.token_spl_addr === undefined || toCoin.token_spl_addr === null)
      return;
    getSupplyModified(toCoin.token_spl_addr)
      .then((res) => {
        const { supplyModified, decimals } = res;
        setBuySupply(supplyModified.div(new BN(10).pow(new BN(decimals))));
        setBuyDecimals(decimals);
        setUsdcAmt('0');
        setBuyAmt('0');
        setUsdcAmtBN(new BN(0));
        setBuyAmtBN(new BN(0));
      })
      .catch((err) => console.log(err));
  }, [toCoin]);

  useEffect(() => {
    if (auth_cred === null) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/swap/list`, {
        headers: {
          Authorization: auth_cred,
        },
      })
      .then((res) => {
        setCoinList(res.data);
      })
      .catch((err) => console.log(err.message));
  }, [auth_cred]);

  const handleBuyTransaction = () => {
    if (buyAmtBN.eq(new BN(0)) || usdcAmtBN.eq(new BN(0))) return;
    let resCalled = false;
    dispatch(onLoading(`Buying ${buyAmt} ${toCoin.token_symbol} ...`));
    buyTransaction(new PublicKey(toCoin.repository), buyAmtBN, usdcAmtBN)
      .then((res) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: `Buy Successful: ${buyAmt} ${toCoin.token_symbol}`,
            description: 'check out the tx at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Buy Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          buy_token_repository_account: toCoin.repository,
          buy_token_address: toCoin.token_spl_addr,
          buy_token_symbol: toCoin.token_symbol,
          buy_token_decimals: buyDecimals,
          buy_token_amt: buyAmt,
          buy_token_amount_BN: buyAmtBN.toString(),
          buy_token_supply_BN: buySupply.toString(),
          usdc_token_amt: usdcAmt,
          usdc_token_amount_BN: usdcAmtBN.toString(),
        });
      })
      .catch((err) => {
        resCalled = true;
        dispatch(
          onFailure({
            label: `Buy Fail: ${buyAmt} ${toCoin.token_symbol}`,
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Buy Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error:err.message
        });
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: `Buy Successful: ${buyAmt} ${toCoin.token_symbol}`,
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Buy Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
        }
      });
  };

  return (
    <div className="flex h-full w-full items-center justify-between">
      <Trade>
        <div className="mb-3 w-[18.7rem] border-b border-dashed border-gray-800 pb-2 xl:mb-5 xl:w-[20.2rem] xl:pb-4 2xl:w-[22.7rem] 3xl:mb-7 3xl:w-[24.2rem] 3xl:pb-6">
          <div className="mb-5 flex items-center gap-5">
            <div
              className="w-fit cursor-pointer rounded-full border border-gray-500 bg-newdark py-0.5 px-6 text-sm font-semibold text-gray-500 xl:text-base 3xl:text-lg"
              onClick={() => setConsoleType('swap')}
            >
              Swap
            </div>
            <div className="w-fit cursor-pointer rounded-full border border-primary bg-newdark py-0.5 px-6 text-sm font-semibold text-primary xl:text-base 3xl:text-lg">
              Buy
            </div>
          </div>
          {coinList.length !== 0 ? (
            <div className={cn('relative flex flex-col gap-3')}>
              <CoinInput
                label={'Buy'}
                exchangeRate={0.0}
                value={buyAmt}
                type="number"
                handleOnChange={handleBuyChange}
                defaultCoinIndex={0}
                getCoinValue={(data) => console.log('Coin changed')}
                coinList={coinList}
                selectedCoin={toCoin}
                setSelectedCoin={setToCoin}
              />
              <div className="absolute top-1/2 left-1/2 z-[1] -mt-4 -ml-4 rounded-full bg-gray-600 shadow-large">
                <Button
                  size="mini"
                  color="gray"
                  shape="circle"
                  variant="transparent"
                >
                  <ArrowDownIcon className="h-auto w-3" />
                </Button>
              </div>
              <CoinInput
                label={'From'}
                exchangeRate={0.0}
                value={usdcAmt}
                type="number"
                defaultCoinIndex={1}
                getCoinValue={(data) => console.log('Coin changed')}
                coinList={coinList}
                selectedCoin={fromCoin}
                disabled
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
        <div
          className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:mt-6 xl:text-base 3xl:mt-8 3xl:text-lg"
          onClick={handleBuyTransaction}
        >
          {stateLoading === 'loading' ? (
            <Spinner className="h-7 w-7" label={null} />
          ) : (
            'BUY'
          )}
        </div>
      </Trade>
      <RightSideInfo coin={toCoin} />
      {/* remove below later */}
      {/* <div className="absolute top-0 left-0 z-[100] flex h-full w-full items-start justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-white bg-dark p-4 text-center shadow-2xl xl:p-6 3xl:p-8">
          <div className="mb-6 text-2xl font-semibold xl:mb-7 xl:text-3xl 3xl:mb-8 3xl:text-4xl">
            Announcement
          </div>
          <div className="mb-1 text-sm xl:mb-1.5 xl:text-base 3xl:mb-2 3xl:text-lg">
            Between 24th July and 4th August the following devnet tokens
          </div>
          <div className="mb-1 flex items-center text-xs xl:mb-1.5 xl:text-sm 3xl:mb-2 3xl:text-base">
            <AnchorLink
              href={
                'https://solscan.io/token/91tB1NHt4yi3bgyqc45vLq1VdXcubpMyJhsS5aL71JEn?cluster=devnet'
              }
              target="_blank"
              className="text-primary"
            >
              DefiOS-Alpha (DOSA)
            </AnchorLink>
            <div>, </div>
            <AnchorLink
              href={
                'https://solscan.io/token/78CTpXRFkJXuP4fc4SoF93SfMRPSfTAJH5TGaxX4LmNz?cluster=devnet'
              }
              target="_blank"
              className="text-primary"
            >
              Pyth (DPY)
            </AnchorLink>
            <div>, </div>
            <AnchorLink
              href={
                'https://solscan.io/token/FYtjpyggagzonTH9gnQ9KWQrAeTbaiXbLWpw1PDG8JcG?cluster=devnet'
              }
              target="_blank"
              className="text-primary"
            >
              RUS (Rustly)
            </AnchorLink>
            <div>, </div>
            <AnchorLink
              href={
                'https://solscan.io/token/79Cndqbk46LcoqtmTjNx8DShTcJX1RE2azb3enkbuqWM?cluster=devnet'
              }
              target="_blank"
              className="text-primary"
            >
              GHB (GithubBot)
            </AnchorLink>
            <div>, </div>
            <AnchorLink
              href={
                'https://solscan.io/token/7sJpmcAoETYFHBoJyKRCLjVkK1Nw3WJaq1nSJGwuJR8p?cluster=devnet'
              }
              target="_blank"
              className="text-primary"
            >
              NodeJS-API (NJA)
            </AnchorLink>
          </div>
          <div className="mb-4 text-sm xl:mb-5 xl:text-base 3xl:mb-6 3xl:text-lg">
            are exchangeable at rate of 0.16 Solana Mainnet USDC per token
          </div>
          <div className="flex gap-2 text-sm xl:text-base 3xl:text-lg">
            <div>please message</div>
            <AnchorLink
              href={'https://twitter.com/defiOSofficial'}
              target="_blank"
              className="text-primary"
            >
              @defiOSofficial
            </AnchorLink>
            <div>or </div>
            <AnchorLink
              href={'https://twitter.com/chained_alchemy'}
              target="_blank"
              className="text-primary"
            >
              @chained_alchemy
            </AnchorLink>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BuyConsole;
