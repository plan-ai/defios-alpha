import React from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import AnchorLink from '@/components/ui/links/anchor-link';
import GithubLogo from '@/assets/images/github-mark-white.svg';
import CoinTicker from '@/components/custom/coin-ticker';
import PriceChart from '@/components/ui/chats/price-chart';
import StatsData from '@/components/custom/stats-data';

type ItemType = {
  repoURL: string;
  issues: string;
  staked: string;
  coin: string;
  coinValue: number;
  change: string;
};

interface TopProjectCardProps {
  item: ItemType;
  className?: string;
}

export const TopProjectCard: React.FC<TopProjectCardProps> = ({
  className,
  item,
}) => {
  const {
    repoURL,
    issues,
    staked,
    coin,
    coinValue,
    change,
  } = item;
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div className="relative top-0 left-0 z-[5] flex aspect-[8/11] h-full w-full flex-col justify-between bg-gradient-to-t from-black to-slate-900 p-5 md:p-6">
        <div className='text-xl uppercase' >Most Trending Project</div>
        <div className="flex justify-between gap-3">
          <AnchorLink
            href={repoURL || ''}
            target="_blank"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-black px-4 text-sm font-medium uppercase normal-case -tracking-wide
          text-white backdrop-blur-[40px]"
          >
            <Image src={GithubLogo} alt={'github'} className="mr-1 h-5 w-5" />
            {repoURL.replace('rewarded: string;', '').length > 18
              ? repoURL.replace('https://github.com', '').slice(0, 18) + '...'
              : repoURL.replace('https://github.com', '')}
          </AnchorLink>
        </div>
        <div className="my-5 flex w-full flex-row items-center justify-center">
          <StatsData icon={'issues'} header={'Open Issues'} value={issues} />
          <StatsData icon={'lock'} header={'Staked Coins'} value={staked} />
        </div>
        <div className="flex w-full flex-col gap-3 border-t border-dashed border-gray-800 pt-6">
          <CoinTicker value={coinValue} coin={coin} change={change} />
          <div className="w-full">
            <PriceChart change={change.toString()[0] || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProjectCard;
