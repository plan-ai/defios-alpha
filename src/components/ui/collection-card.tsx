import Image from '@/components/ui/image';
import cn from 'classnames';
import AnchorLink from '@/components/ui/links/anchor-link';
import GithubLogo from '@/assets/images/github-mark-white.svg';
import CoinTicker from '@/components/custom/coin-ticker';
import PriceChart from '@/components/ui/chats/price-chart';
import DataWithImage from '@/components/custom/data-with-image';
import StatsData from '@/components/custom/stats-data';
import SecurityStatus from '@/components/custom/security-status';

type ItemType = {
  id?: string | number;
  repoURL: string;
  coin: string;
  coinValue: number;
  change: string;
  communityScore: string;
  Security: string;
  topSupporter: string;
  topBuilder: string;
  issues: string;
  staked: string;
  rewarded: string;
};
type CardProps = {
  item: ItemType;
  className?: string;
};

export default function CollectionCard({ item, className = '' }: CardProps) {
  const {
    repoURL,
    coin,
    coinValue,
    change,
    communityScore,
    Security,
    topBuilder,
    topSupporter,
    issues,
    rewarded,
    staked,
  } = item ?? {};
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
            href={repoURL || ''}
            target="_blank"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-black px-4 text-sm font-medium uppercase normal-case -tracking-wide
          text-white backdrop-blur-[40px]"
          >
            <Image src={GithubLogo} alt={'github'} className="mr-1 h-5 w-5" />
            {repoURL.replace('https://github.com', '').length > 27
              ? repoURL.replace('https://github.com', '').slice(0, 27) + '...'
              : repoURL.replace('https://github.com', '')}
          </AnchorLink>
          <SecurityStatus security={Security} />
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="my-5 flex w-full flex-row items-center justify-center">
            <StatsData icon={'issues'} header={'Open Issues'} value={issues} />
            <StatsData
              icon={'health'}
              header={'Community Score'}
              value={communityScore}
            />
          </div>
          <div className="my-5 flex w-full flex-row items-center justify-center">
            <StatsData icon={'lock'} header={'Staked Coins'} value={staked} />

            <StatsData
              icon={'banknotes'}
              header={'Coins Rewarded'}
              value={rewarded}
            />
          </div>
          <div className="my-5 flex w-full flex-row items-center justify-between">
            <DataWithImage
              image={'briefcase'}
              header={'Top Supporter'}
              value={topSupporter}
            />
            <DataWithImage
              image={'wench'}
              header={'Top Builder'}
              value={topBuilder}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-between border-t border-dashed border-gray-800 pt-3">
            <CoinTicker value={coinValue} coin={coin} change={change} />
            <div className="w-[50%]">
              <PriceChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
