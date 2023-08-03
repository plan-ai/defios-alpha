import cn from 'classnames';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { walletCurrencies } from '@/data/static/wallet-currencies';
import AnchorLink from '../ui/links/anchor-link';

const dummyData = [
  {
    name: 'never2average',
    value: 400,
    volume: '400',
  },
  {
    name: 'Rohitkk432',
    value: 300,
    volume: '300',
  },
  {
    name: 'AbhishekBasu01',
    value: 300,
    volume: '300',
  },
  {
    name: 'Mayank',
    value: 15,
    volume: '15',
  },
];

interface StakeHoldersProps {
  chartData?: any;
}

const StakeHolders: React.FC<StakeHoldersProps> = ({ chartData }) => {
  const [percentage, setPercentage] = useState('Hover on Chart');
  useEffect(() => {
    setPercentage('Hover on Chart');
  }, [chartData]);
  return (
    <div className="rounded-xl bg-transparent  ">
      <h3 className="text-center text-sm font-medium uppercase xl:text-base 2xl:text-lg 3xl:text-xl">
        Top Holders
      </h3>

      <div className="relative flex h-[290px] justify-center">
        <ResponsiveContainer width={290} height="100%">
          <PieChart className="h-[290px] w-[290px] md:scale-[.90] xl:scale-100">
            <Pie
              data={chartData.chartData || dummyData}
              cx={140}
              cy={140}
              innerRadius={78}
              outerRadius={105}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              onMouseMove={(data) => {
                setPercentage(
                  data.payload.payload &&
                    `${data.payload.payload.volume} ${chartData.coin.token_symbol}`
                );
              }}
            >
              {walletCurrencies.map((currency) => (
                <Cell
                  key={`cell-${currency.id}`}
                  fill={currency.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<></>} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute left-2/4 top-2/4 flex h-[136px]  w-[136px] -translate-x-2/4 -translate-y-2/4 transform  items-center  justify-center rounded-full border border-dashed border-gray-600 bg-transparent md:h-32 md:w-32 xl:h-[136px] xl:w-[136px]">
          <span
            className={cn(
              'flex items-center justify-center text-center text-xs font-medium xl:text-sm 2xl:text-base'
            )}
          >
            {percentage}
          </span>
        </div>
      </div>

      <div className="mb-20">
        <div className="mb-5 flex items-center justify-between text-sm font-medium text-gray-400">
          <span>Username</span>
          <span>Supply Owned</span>
        </div>
        <ul className="grid gap-5">
          {chartData.chartData &&
            chartData.chartData.map((item: any, idx: number) => (
              <li
                key={idx}
                className="grid grid-cols-2 items-center justify-between text-2xs font-medium text-white xl:text-xs 2xl:text-sm"
              >
                <AnchorLink
                  href={`https://solscan.io/account/${item.owner}`}
                  target="_blank"
                  className="flex items-center gap-2.5 whitespace-nowrap"
                >
                  {item.owner.slice(0, 8) + '...' + item.owner.slice(36, 44)}
                </AnchorLink>
                <span className={cn('flex items-center justify-end gap-2')}>
                  <div>{item.volume}</div>
                  <div>{chartData.coin.token_symbol}</div>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default StakeHolders;
