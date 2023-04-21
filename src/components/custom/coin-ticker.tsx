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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
        <Image
          src={coin?.token_image_url || ''}
          alt={coin?.token_name || ''}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="ml-2.5 flex flex-col  xl:ml-4">
        <strong className="font-medium -tracking-wider text-white">
          {coin?.token_name}
        </strong>
        <span className="mb-0.5 flex text-sm">
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
