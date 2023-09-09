import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import { ChevronDown } from '@/components/icons/chevron-down';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import Image from 'next/image';
// dynamic import
const CoinSelectView = dynamic(
  () => import('@/components/ui/coin-select-view')
);

interface CoinInputTypes extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  exchangeRate?: number;
  defaultCoinIndex?: number;
  className?: string;
  value: string;
  handleOnChange?: (e: any) => void;
  getCoinValue: (param: { coin: string; value: string }) => void;
  coinList: any;
  selectedCoin: any;
  setSelectedCoin?: React.Dispatch<any>;
}

const decimalPattern = /^[0-9]*[.,]?[0-9]*$/;

export default function CoinInput({
  label,
  getCoinValue,
  defaultCoinIndex = 0,
  exchangeRate,
  className,
  coinList,
  setSelectedCoin,
  selectedCoin,
  handleOnChange,
  value,
  ...rest
}: CoinInputTypes) {
  let [visibleCoinList, setVisibleCoinList] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setVisibleCoinList(false);
  });
  useLockBodyScroll(visibleCoinList);

  function handleSelectedCoin(coin: any) {
    if (
      setSelectedCoin === undefined ||
      selectedCoin === coin ||
      coin === undefined
    )
      return;
    setSelectedCoin(coin);
    setVisibleCoinList(false);
  }

  useEffect(() => {
    if (coinList.length !== 0 && setSelectedCoin !== undefined) {
      setSelectedCoin(coinList[0]);
    }
  }, [coinList, setSelectedCoin]);

  return (
    <>
      <div
        className={cn(
          'group flex w-full rounded-xl border border-gray-700 transition-colors duration-200 hover:border-gray-600',
          className
        )}
      >
        <div className="border-r border-gray-700 p-3 transition-colors duration-200 group-hover:border-gray-600">
          <span className="mb-1.5 block text-3xs uppercase text-gray-400 xl:text-2xs 3xl:text-xs">
            {label}
          </span>
          <button
            onClick={() => {
              if (setSelectedCoin === undefined) return;
              setVisibleCoinList(true);
            }}
            className="flex w-full items-center text-xs font-medium text-gray-100 outline-none xl:text-sm 3xl:text-base"
          >
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image
                src={
                  selectedCoin?.token_image_url?.replace(
                    'https://ipfs.io',
                    'https://defi-os.infura-ipfs.io'
                  ) || ''
                }
                alt={selectedCoin?.token_symbol || ''}
                fill
                className="object-cover"
              />
            </div>
            <span className="ml-2">{selectedCoin?.token_symbol} </span>
            <ChevronDown className="ml-1.5 h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col text-right">
          <input
            type="text"
            value={value}
            placeholder="0"
            inputMode="decimal"
            onChange={(e) => {
              if (handleOnChange === undefined) return;
              handleOnChange(e);
            }}
            className="w-full rounded-tr-lg rounded-br-lg border-0 bg-light-dark pb-0.5 text-right text-sm outline-none focus:ring-0 xl:text-base 3xl:text-lg"
            {...rest}
          />
          <span className="font-xs px-3 text-xs text-gray-400 xl:text-sm 3xl:text-base">
            = ${exchangeRate ? exchangeRate : '0.00'}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {visibleCoinList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
          >
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-full align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              ref={modalContainerRef}
              className="inline-block text-left align-middle"
            >
              <CoinSelectView
                onSelect={(selectedCoin) => handleSelectedCoin(selectedCoin)}
                coinList={coinList}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

CoinInput.displayName = 'CoinInput';
