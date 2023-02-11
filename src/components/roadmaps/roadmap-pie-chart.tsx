import cn from 'classnames';
import { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const data = [
  {
    id: 1,
    name: 'Frontend contract Integrations',
    value: 400,
    color: '#F79517',
  },
  {
    id: 2,
    name: 'Web3 Backend Rust',
    value: 300,
    color: '#259C77',
  },
  {
    id: 3,
    name: 'Web2 Backend',
    value: 300,
    color: '#3468D1',
  },
  {
    id: 4,
    name: 'Homepage',
    value: 15,
    color: '#F3BA2F',
  },
];

export default function RoadmapPieChart() {
  const [percentage, setPercentage] = useState(data[0].value);
  return (
    <div className="rounded-lg bg-transparent  ">
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
              onMouseMove={(_data) => {
                setPercentage(
                  _data.payload.payload && _data.payload.payload.value
                );
              }}
            >
              {data.map((expense) => (
                <Cell
                  key={`cell-${expense.id}`}
                  fill={expense.color}
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

      <div className="mb-10">
        <div className="mb-5 flex items-center justify-between text-sm font-medium text-gray-400">
          <span>Expense</span>
          <span>Split</span>
        </div>
        <ul className="grid gap-5">
          {data.map((expense) => (
            <li
              key={expense.id}
              className="grid grid-cols-4 items-center justify-between text-sm font-medium text-white"
            >
              <span className="col-span-3 flex w-full items-center gap-2.5">
                <div
                  className={cn('h-2 w-2 rounded-full', {
                    'bg-[#F79517]': expense.color === '#F79517',
                    'bg-[#259C77]': expense.color === '#259C77',
                    'bg-[#3468D1]': expense.color === '#3468D1',
                    'bg-[#F3BA2F]': expense.color === '#F3BA2F',
                  })}
                ></div>
                <div className="text-wrap">{expense.name}</div>
              </span>
              <span className={cn('flex items-center justify-end')}>
                {expense.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
