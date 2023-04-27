import cn from 'classnames';
import { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import ListCard from '@/components/ui/list-card';
import { contributionsType } from '@/data/static/roadmap-list';

interface RoadmapContributionsProps {
  contributions: contributionsType[];
}

const RoadmapContributions: React.FC<RoadmapContributionsProps> = ({
  contributions,
}) => {
  const [percentage, setPercentage] = useState(contributions?.[0]?.value);
  return (
    <div className="rounded-xl bg-transparent  ">
      <div className="relative flex h-[290px] justify-center">
        <ResponsiveContainer width={290} height="100%">
          <PieChart className="h-[290px] w-[290px] md:scale-[.90] xl:scale-100">
            <Pie
              data={contributions}
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
              {contributions &&
                contributions.length !== 0 &&
                contributions.map((contrib) => (
                  <Cell
                    key={`cell-${contrib?.id}`}
                    fill={contrib?.color}
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
              'flex items-center text-xs font-medium xl:text-sm 3xl:text-base'
            )}
          >
            {percentage} %
          </span>
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-5 flex items-center justify-between text-2xs font-medium text-gray-400 xl:text-xs 3xl:text-sm">
          <span>Username</span>
          <span>Contribution</span>
        </div>
        <ul className="grid gap-5">
          {contributions &&
            contributions.length !== 0 &&
            contributions.map((contributor) => (
              <li
                key={contributor?.id}
                className="grid grid-cols-4 items-center justify-between text-2xs font-medium text-white xl:text-xs 3xl:text-sm"
              >
                <span className="col-span-3 flex w-full items-center gap-2.5">
                  <div
                    className={cn('h-2 w-2 rounded-full', {
                      'bg-[#F79517]': contributor?.color === '#F79517',
                      'bg-[#259C77]': contributor?.color === '#259C77',
                      'bg-[#3468D1]': contributor?.color === '#3468D1',
                      'bg-[#F3BA2F]': contributor?.color === '#F3BA2F',
                    })}
                  ></div>
                  <ListCard
                    item={{
                      name: contributor?.username,
                      logo: contributor?.userImage,
                    }}
                    className="rounded-full p-2 pr-4 text-gray-400 hover:text-white"
                  />
                </span>
                <span className={cn('flex items-center justify-end')}>
                  {contributor?.value} %
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RoadmapContributions;
