import React from 'react';
import cn from 'classnames';

import Avatar from '@/components/ui/avatar';
import AuthorImage from '@/assets/images/coin/binance.svg';
import TransactionInfo from './transaction-info';
import PriceChart from './chats/price-chart';

interface CoinDetailsCardProps {}

const CoinDetailsCard: React.FC<CoinDetailsCardProps> = ({}) => {
  return (
    <div className="mb-5 flex h-full  w-full flex-col justify-center rounded-lg bg-light-dark p-6 shadow-card xl:p-8">
      <Avatar
        image={AuthorImage}
        alt="Author"
        className="mx-auto mb-6"
        size="lg"
      />
      <TransactionInfo className="my-2" label={'Coin Name'} value={'Binance'} />
      <TransactionInfo className="my-2" label={'Coin Creator'} />
      <TransactionInfo className="my-2" label={'Coin Creation Date'} />
      <TransactionInfo className="my-2" label={'Total Supply'} />
      <TransactionInfo className="my-2" label={'Github Repo'} />
      <div className="my-2">Last Traded Price:</div>
      <PriceChart />
      <div className="my-2">Repo Activity:</div>
      <PriceChart />
    </div>
  );
};

export default CoinDetailsCard;
