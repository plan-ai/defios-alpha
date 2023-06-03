import React, { useEffect, useState } from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import AnchorLink from '@/components/ui/links/anchor-link';
import GithubLogo from '@/assets/images/github-mark-white.svg';
import CoinTicker from '@/components/custom/coin-ticker';
import PriceChart from '@/components/ui/chats/price-chart';
import StatsData from '@/components/custom/stats-data';
import axios from 'axios';
import { useAppDispatch } from '@/store/store';
import { clicked } from '@/store/notifClickSlice';
import { useRouter } from 'next/router';

interface TopProjectCardProps {
  item: any;
  className?: string;
}

export const TopProjectCard: React.FC<TopProjectCardProps> = ({
  className,
  item,
}) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (typeof item?.project_token?.token_price_feed === 'string') {
      axios
        .post('/api/chart', {
          data_url: item?.project_token?.token_price_feed,
        })
        .then((res) => setChartData(res.data))
        .catch((err) => console.log(err));
    }
  }, [item]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClickHandler = () => {
    const payload = {
      searchQuery: `id:${item?._id}`,
      setSearchQuery: true,
      expandFirst: true,
      pathname: '/projects',
    };
    dispatch(clicked(payload));
    router.push('/projects');
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div
        className="relative top-0 left-0 z-[5] flex aspect-[8/11] h-full w-full flex-col justify-between bg-gradient-to-t from-black to-slate-900 p-5 md:p-6"
        onClick={onClickHandler}
      >
        <div className="text-base uppercase xl:text-lg 3xl:text-xl">
          Most Trending Project
        </div>
        <div className="flex justify-between gap-3">
          <AnchorLink
            href={item?.project_repo_link || ''}
            target="_blank"
            className="inline-flex h-8 shrink-0 items-center rounded-full bg-black px-4 text-2xs font-medium uppercase normal-case -tracking-wide text-white backdrop-blur-[40px] xl:h-9 xl:text-xs
          3xl:h-10 3xl:text-sm"
          >
            <Image
              src={GithubLogo}
              alt={'github'}
              className="mr-1 h-3.5 w-3.5  xl:h-4 xl:w-4 3xl:h-5 3xl:w-5"
            />
            {item?.project_repo_link?.replace('https://github.com', '').length >
            24
              ? item?.project_repo_link
                  ?.replace('https://github.com', '')
                  .slice(0, 24) + '...'
              : item?.project_repo_link?.replace('https://github.com', '')}
          </AnchorLink>
        </div>
        <div className="my-3.5 flex w-full flex-row items-center justify-center xl:my-4 3xl:my-5">
          <StatsData
            icon={'issues'}
            header={'Open Issues'}
            value={item?.num_open_issues}
          />
          <StatsData
            icon={'lock'}
            header={'Staked Coins'}
            value={item?.coins_staked + ' ' + item?.project_token?.token_symbol}
          />
        </div>
        <div className="flex w-full flex-row items-center justify-between border-t border-dashed border-gray-800 pt-3">
          <CoinTicker
            value={Math.round(item?.project_token?.token_ltp * 100) / 100}
            coin={item?.project_token}
            change={(
              Math.round(item?.project_token?.token_ltp_24h_change * 100) / 100
            ).toString()}
          />
          {chartData !== null && (
            <div className="w-full">
              <PriceChart
                change={chartData?.change}
                chartData={chartData?.data}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProjectCard;
