import { useState, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import ButtonOld from '@/components/ui/button/button';
import Button from '@/components/ui/button/ButtonNew';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';

import RightSideInfo from '@/components/swaps/right-side-info';
import Spinner from '@/components/custom/spinner';

import AnchorLink from '@/components/ui/links/anchor-link';

import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppSelector, useAppDispatch } from '@/store/store';
import axios from '@/lib/axiosClient';

import mixpanel from 'mixpanel-browser';

import {
  calculateBuyAmount,
  calculateSellAmount,
  getAmtOfBuy,
  getAmtOfSell,
  getSupplyModified,
  swapTransaction,
} from '@/lib/helpers/contractInteract';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

interface SwapConsoleProps {
  setConsoleType: React.Dispatch<React.SetStateAction<'swap' | 'buy'>>;
}

const SwapConsole: React.FC<SwapConsoleProps> = ({ setConsoleType }) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const userMappingState = useAppSelector(selectUserMapping);

  const wallet = useWallet();

  const [toggleCoin, setToggleCoin] = useState(false);
  const [coinList, setCoinList] = useState<any>([]);
  const [fromCoin, setFromCoin] = useState<any>(null);
  const [toCoin, setToCoin] = useState<any>(null);

  const [sellSupply, setSellSupply] = useState<BN>(new BN(0));
  const [buySupply, setBuySupply] = useState<BN>(new BN(0));
  const [sellDecimals, setSellDecimals] = useState(0);
  const [buyDecimals, setBuyDecimals] = useState(0);

  const [sellAmt, setSellAmt] = useState<string>('0');
  const [buyAmt, setBuyAmt] = useState<string>('0');

  const [buyAmtBN, setBuyAmtBN] = useState<BN>(new BN(0));
  const [sellAmtBN, setSellAmtBN] = useState<BN>(new BN(0));

  const handleFromChange = (e: any) => {
    const sellAmount = e.target.value.toString();
    const value = calculateSellAmount(sellSupply, new BN(sellAmount));
    const buyAmount = getAmtOfBuy(buySupply, value);

    setSellAmt(e.target.value);
    setSellAmtBN(new BN(sellAmount).mul(new BN(10).pow(new BN(sellDecimals))));
    setBuyAmtBN(buyAmount.mul(new BN(10).pow(new BN(buyDecimals))));
    setBuyAmt(parseInt(buyAmount.toString()).toString());
  };

  const handleToChange = (e: any) => {
    const buyAmount = e.target.value.toString();
    const value = calculateBuyAmount(buySupply, new BN(buyAmount));
    const sellAmount = getAmtOfSell(sellSupply, value);

    setBuyAmt(e.target.value);
    setBuyAmtBN(new BN(buyAmount).mul(new BN(10).pow(new BN(buyDecimals))));
    setSellAmtBN(sellAmount.mul(new BN(10).pow(new BN(sellDecimals))));
    setSellAmt(parseInt(sellAmount.toString()).toString());
  };

  const auth_cred = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (fromCoin === null) return;
    if (
      fromCoin.token_spl_addr === undefined ||
      fromCoin.token_spl_addr === null
    )
      return;
    getSupplyModified(fromCoin.token_spl_addr)
      .then((res) => {
        const { supplyModified, decimals } = res;
        setSellSupply(supplyModified.div(new BN(10).pow(new BN(decimals))));
        setSellDecimals(decimals);
        setSellAmt('0');
        setBuyAmt('0');
        setSellAmtBN(new BN(0));
        setBuyAmtBN(new BN(0));
      })
      .catch((err) => console.log(err));
  }, [fromCoin]);

  useEffect(() => {
    if (toCoin === null) return;
    if (toCoin.token_spl_addr === undefined || toCoin.token_spl_addr === null)
      return;
    getSupplyModified(toCoin.token_spl_addr)
      .then((res) => {
        const { supplyModified, decimals } = res;
        setBuySupply(supplyModified.div(new BN(10).pow(new BN(decimals))));
        setBuyDecimals(decimals);
        setSellAmt('0');
        setBuyAmt('0');
        setSellAmtBN(new BN(0));
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

  const handleSwapTransaction = () => {
    if (buyAmtBN.eq(new BN(0)) || sellAmtBN.eq(new BN(0))) return;
    let resCalled = false;
    dispatch(
      onLoading(
        `Swapping ${sellAmt} ${fromCoin.token_symbol} --> ${buyAmt} ${toCoin.token_symbol} ...`
      )
    );
    swapTransaction(
      new PublicKey(fromCoin.repository),
      new PublicKey(toCoin.repository),
      sellAmtBN,
      buyAmtBN
    )
      .then((res) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: `Swapping ${sellAmt} ${fromCoin.token_symbol} --> ${buyAmt} ${toCoin.token_symbol} Successful`,
            description: 'check out the tx at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Swap Success', {
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
          sell_token_repository_account: fromCoin.repository,
          sell_token_address: fromCoin.token_spl_addr,
          sell_token_symbol: fromCoin.token_symbol,
          sell_token_decimals: sellDecimals,
          sell_token_amt: sellAmt,
          sell_token_amount_BN: sellAmtBN.toString(),
          sell_token_supply_BN: sellSupply.toString(),
        });
      })
      .catch((err) => {
        resCalled = true;
        dispatch(
          onFailure({
            label: `Swapping ${sellAmt} ${fromCoin.token_symbol} --> ${buyAmt} ${toCoin.token_symbol} Failed`,
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Swap Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: `Swapping ${sellAmt} ${fromCoin.token_symbol} --> ${buyAmt} ${toCoin.token_symbol} Successful`,
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Swap Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
        }
      });
  };

  return (
    <div className="relative flex h-full w-full items-center justify-between">
      <Trade>
        <div className="mb-3 w-[18.7rem] border-b border-dashed border-gray-800 pb-2 xl:mb-5 xl:w-[20.2rem] xl:pb-4 2xl:w-[22.7rem] 3xl:mb-7 3xl:w-[24.2rem] 3xl:pb-6">
          <div className="mb-5 flex items-center gap-5">
            <Button color="PrimaryOutline" size="small">
              Swap
            </Button>
            <Button
              color="GrayOutline"
              size="small"
              onClick={() => setConsoleType('buy')}
            >
              Buy
            </Button>
          </div>
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
                value={sellAmt}
                type="number"
                handleOnChange={handleFromChange}
                defaultCoinIndex={0}
                getCoinValue={(data) => console.log('Coin Changed')}
                coinList={coinList}
                selectedCoin={fromCoin}
                setSelectedCoin={setFromCoin}
              />
              <div className="absolute top-1/2 left-1/2 z-[1] -mt-4 -ml-4 rounded-full bg-gray-600 shadow-large">
                <ButtonOld
                  size="mini"
                  color="gray"
                  shape="circle"
                  variant="transparent"
                  onClick={() => setToggleCoin(!toggleCoin)}
                >
                  <SwapIcon className="h-auto w-3" />
                </ButtonOld>
              </div>
              <CoinInput
                label={'To'}
                exchangeRate={0.0}
                value={buyAmt}
                type="number"
                handleOnChange={handleToChange}
                defaultCoinIndex={1}
                getCoinValue={(data) => console.log('Coin Changed')}
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
          color="PrimarySolid"
          className="mt-4"
          fullWidth={true}
          onClick={handleSwapTransaction}
          isLoading={stateLoading === 'loading'}
        >
          SWAP
        </Button>
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

export default SwapConsole;
