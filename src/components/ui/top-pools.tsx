import cn from 'classnames';
import { TopPoolsData } from '@/data/static/token-data';
import CurrencySwapIcons from '@/components/ui/currency-swap-icons';
import { CoinList } from '@/components/ui/currency-swap-icons';

interface TopPoolsProps {
  limit?: number;
}

export default function TopPools({ limit }: TopPoolsProps) {
  return (
    <div className={cn('rounded-xl bg-light-dark p-6 shadow-card sm:p-8')}>
      <h3 className="mb-6 text-base font-medium uppercase">Top Pools</h3>
      <div className="mb-5 flex items-center justify-between text-sm text-gray-400">
        <span className="col-span-2">Pool</span>
        <span>Volume</span>
      </div>

      {TopPoolsData.slice(0, limit ?? -1).map((pool, index) => {
        let from = pool.from as CoinList;
        let to = pool.to as CoinList;
        return (
          <div
            className="mb-5 flex items-center justify-between text-sm text-white last:mb-0"
            key={index}
          >
            <div className="col-span-2 flex items-center gap-2">
              <CurrencySwapIcons from={from} to={to} />
            </div>
            <span>{pool.volume}</span>
          </div>
        );
      })}
    </div>
  );
}
