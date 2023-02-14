import cn from 'classnames';
import { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { walletCurrencies } from '@/data/static/wallet-currencies';
import Avatar from '@/components/ui/avatar';

const data = [
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

export default function WalletCard() {
  const [percentage, setPercentage] = useState(data[0].volume);
  return (
    <div className="rounded-lg bg-transparent  ">
      <h3 className="text-center text-base font-medium uppercase lg:text-left">
        Top Holders
      </h3>

      <div className="relative flex h-[290px] justify-center">
        <ResponsiveContainer width={290} height="100%">
          <PieChart className="h-[290px] w-[290px] md:scale-[.90] xl:scale-100">
            <Pie
              data={data}
              cx={140}
              cy={140}
              innerRadius={78}
              outerRadius={105}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              onMouseMove={(data) => {
                setPercentage(
                  data.payload.payload && data.payload.payload.volume
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
          <span className={cn('flex items-center text-base font-medium')}>
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
          {walletCurrencies.map((currency) => (
            <li
              key={currency.id}
              className="grid grid-cols-[150px_repeat(2,1fr)] items-center justify-between text-sm font-medium text-white 2xl:grid-cols-[140px_repeat(2,1fr)] 3xl:grid-cols-[150px_repeat(2,1fr)]"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                <Avatar image={currency.avatar} alt="img" />
                {currency.name}
              </span>
              <span className="text-center"></span>
              <span className={cn('flex items-center justify-end')}>
                {currency.volume}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
