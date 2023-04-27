import { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import AnchorLink from '@/components/ui/links/anchor-link';
import GithubLogo from '@/assets/images/github-mark-white.svg';
import CoinTicker from '@/components/custom/coin-ticker';
import PriceChart from '@/components/ui/chats/price-chart';
import DataWithImage from '@/components/custom/data-with-image';
import StatsData from '@/components/custom/stats-data';
import SecurityStatus from '@/components/custom/security-status';
import axios from 'axios';

type CardProps = {
  item: any;
  className?: string;
};

export default function ProfileProjectCard({
  item,
  className = '',
}: CardProps) {
  const [tokenImgUrl, setTokenImgUrl] = useState('');

  useEffect(() => {
    const _url = item?.project_token?.token_image_url;
    if (_url.includes('gateway.pinata.cloud')) {
      const IpfsNewGateway = _url.replace('gateway.pinata.cloud', 'ipfs.io');
      axios
        .get(IpfsNewGateway)
        .then((res) => {
          if (typeof res.data === 'object') {
            if (res.data.image) {
              setTokenImgUrl(res.data.image);
            } else {
              setTokenImgUrl(item?.project_token?.token_image_url);
            }
          } else {
            setTokenImgUrl(item?.project_token?.token_image_url);
          }
        })
        .catch((err) => {
          console.log(err);
          setTokenImgUrl(item?.project_token?.token_image_url);
        });
    }
    if (_url == '') {
      axios
        .get(
          `https://public-api.solscan.io/token/meta?tokenAddress=${item?.project_token?.token_spl_addr}`,
          {
            headers: {
              token: process.env.SOLSCAN_TOKEN,
            },
          }
        )
        .then((res) => {
          if (res.data.icon) {
            setTokenImgUrl(res.data.icon);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [item]);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div className="relative top-0 left-0 z-[5] flex aspect-[8/11] h-full w-full flex-col justify-between bg-gradient-to-t from-black to-slate-900 p-5 md:p-6">
        <div className="flex justify-between gap-3">
          <AnchorLink
            href={item?.project_repo_link || ''}
            target="_blank"
            className="xl-h-9 inline-flex h-8 shrink-0 items-center rounded-full bg-black px-4 text-2xs font-medium uppercase normal-case -tracking-wide text-white backdrop-blur-[40px] xl:text-xs
          3xl:h-10 3xl:text-sm"
          >
            <Image
              src={GithubLogo}
              alt={'github'}
              className="mr-1 h-3.5 w-3.5  xl:h-4 xl:w-4 3xl:h-5 3xl:w-5"
            />
            {item?.project_repo_link?.replace('https://github.com', '')
              ?.length > 27
              ? item?.project_repo_link
                  ?.replace('https://github.com', '')
                  ?.slice(0, 27) + '...'
              : item?.project_repo_link?.replace('https://github.com', '')}
          </AnchorLink>
          <SecurityStatus security={item?.project_status} />
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="my-3.5 flex w-full flex-row items-center justify-center xl:my-4 3xl:my-5">
            <StatsData
              icon={'issues'}
              header={'Open Issues'}
              value={item?.num_open_issues}
            />
            <StatsData
              icon={'health'}
              header={'Community Score'}
              value={item?.community_health}
            />
          </div>
          <div className="my-3.5 flex w-full flex-row items-center justify-center xl:my-4 3xl:my-5">
            <StatsData
              icon={'lock'}
              header={'Staked Coins'}
              value={
                item?.coins_staked + ' ' + item?.project_token?.token_symbol
              }
            />

            <StatsData
              icon={'banknotes'}
              header={'Coins Rewarded'}
              value={
                item?.coins_rewarded + ' ' + item?.project_token?.token_symbol
              }
            />
          </div>
          <div className="my-3.5 flex w-full flex-row items-center justify-between xl:my-4 3xl:my-5">
            <DataWithImage
              image={'briefcase'}
              header={'Top Supporter'}
              value={item?.top_supporter_address}
            />
            <DataWithImage
              image={'wench'}
              header={'Top Builder'}
              value={item?.top_builder_address}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-between border-t border-dashed border-gray-800 pt-3">
            <CoinTicker
              value={Math.round(item?.project_token?.token_ltp * 100) / 100}
              coin={{ ...item?.project_token, token_image_url: tokenImgUrl }}
              change={(
                Math.round(item?.project_token?.token_ltp_24h_change * 100) /
                100
              ).toString()}
            />
            <div className="w-[50%]">
              <PriceChart
                chartData={
                  typeof item?.project_token?.token_price_feed !== 'string'
                    ? item?.project_token?.token_price_feed?.data
                    : null
                }
                change={item?.project_token?.token_price_feed?.change || '+'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
