import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Avatar from '@/components/ui/avatar';
import HoldersChart from '@/components/swaps/holders-chart';
//images
import AuthorImage from '@/assets/images/coin/binance.svg';
import TransactionInfo from '@/components/ui/transaction-info';
import PriceChart from '@/components/ui/chats/price-chart';

export default function RightSideInfo({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'top-0 right-0 z-20 h-full w-full max-w-full border-dashed border-gray-700 lg:fixed lg:w-[400px] lg:border-l xl:pt-20 3xl:w-[550px]',
        className
      )}
    >
      <Scrollbar style={{ height: 'calc(100% - 20px)' }}>
        <div className="relative z-20 h-screen pb-5">
          <div className="my-16 mx-5 flex h-full flex-col justify-between overflow-x-hidden rounded-lg bg-transparent sm:mx-6 sm:flex-row lg:mx-0 lg:flex-col lg:p-6 xl:my-0 2xl:p-8">
            <div className="w-full sm:w-[48%] lg:w-full">
              <Avatar
                image={AuthorImage}
                alt="Author"
                className="mx-auto mb-10"
                size="lg"
              />
              <TransactionInfo
                className="my-2"
                label={'Coin Name'}
                value={'Binance'}
              />
              <TransactionInfo
                className="my-2"
                label={'Created By'}
                value={'never2average'}
              />
              <TransactionInfo
                className="my-2"
                label={'Created At'}
                value={'10 days ago'}
              />
              <TransactionInfo
                className="my-2"
                label={'Total Supply'}
                value={800}
              />
              <TransactionInfo
                className="my-2"
                label={'Circulating Supply'}
                value={500}
              />
              <TransactionInfo
                className="my-2"
                label={'Source Code'}
                value={'github'}
              />
              <div className="my-2">Last Traded Price:</div>
              <PriceChart />
              <div className="my-2">Repo Activity:</div>
              <PriceChart />
              <div>
                <span className="-mx-6 block border-t border-dashed border-t-gray-700 3xl:-mx-8" />
              </div>
              <span className="-mx-6 block border-t border-dashed border-t-gray-700 3xl:-mx-8" />
            </div>
            <div className="mt-10 w-full sm:mt-0 sm:w-[48%] lg:mt-8 lg:w-full">
              <HoldersChart />
            </div>
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
