import React from 'react';
import { coinListBig } from '@/data/static/coin-list';
import cn from 'classnames';

interface CoinTickerProps {
  coin: string;
  value: number;
  change: string;
}

const CoinTicker: React.FC<CoinTickerProps> = ({ value, coin, change }) => {
  const data = coinListBig.find((el) => el.code === coin);
  return (
    <div className="flex items-center lg:w-1/2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {data?.icon}
      </div>
      <div className="ml-2.5 flex flex-col  xl:ml-4">
        <strong className="font-medium -tracking-wider text-white">
          {coin}
        </strong>
        <span className="mb-0.5 flex text-sm">
          {value}$
          <div
            className={cn('ml-2', {
              'text-green-500': change[0] === '+',
              'text-red-500': change[0] === '-',
            })}
          >
            {change}%
          </div>
        </span>
      </div>
    </div>
  );
};

export default CoinTicker;
