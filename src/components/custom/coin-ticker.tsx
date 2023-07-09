import React from 'react';
import cn from 'classnames';
import Image from 'next/image';

interface CoinTickerProps {
  coin: any;
  value: number;
  change: string;
  className?: string;
}

const CoinTicker: React.FC<CoinTickerProps> = ({
  value,
  coin,
  change,
  className,
}) => {
  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative h-10 w-10 rounded-full xl:h-11 xl:w-11 3xl:h-12 3xl:w-12">
        <Image
          src={
            coin?.token_new === true
              ? coin?.token_image_url?.replace(
                  'https://ipfs.io',
                  'https://defi-os.infura-ipfs.io'
                ) || ''
              : coin?.token_image_url || ''
          }
          alt={coin?.token_name || ''}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="ml-2.5 flex flex-col  text-xs xl:ml-4 xl:text-sm 3xl:text-base">
        <strong className="font-medium -tracking-wider text-white">
          {coin?.token_name}
        </strong>
        <span className="mb-0.5 flex text-3xs xl:text-2xs 2xl:text-xs 3xl:text-sm">
          ${value}
          <div
            className={cn('ml-2', {
              'text-new-green': change[0] !== '-',
              'text-red-500': change[0] === '-',
            })}
          >
            {change[0] === '-' ? change : '+' + change}%
          </div>
        </span>
      </div>
    </div>
  );
};

export default CoinTicker;
