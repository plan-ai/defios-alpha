import cn from 'classnames';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 1200,
    pv: 800,
  },
  {
    name: 'Page B',
    uv: 2600,
    pv: 100,
  },
  {
    name: 'Page C',
    uv: 1900,
    pv: 1600,
  },
  {
    name: 'Page D',
    uv: 2280,
    pv: 1508,
  },
  {
    name: 'Page E',
    uv: 1290,
    pv: 3500,
  },
  {
    name: 'Page F',
    uv: 1690,
    pv: 3000,
  },
  {
    name: 'Page G',
    uv: 2590,
    pv: 4500,
  },
];

interface Props {
  chartWrapperClass?: string;
  className?: string;
  comingSoon?: boolean;
}

export default function OverviewChart({
  chartWrapperClass,
  className,
  comingSoon,
}: Props) {
  return (
    <div
      className={cn(
        'h-full w-full flex flex-col items-center rounded-xl bg-light-dark p-6 text-white shadow-card sm:p-8',
        className
      )}
    >
      <div className="text-xl font-medium tracking-tighter text-white">
        Community Issue Solving Capacity
      </div>
      {comingSoon === true && (
        <div className="m-auto rounded-full bg-gray-800 py-2 px-6 text-base text-red-600 xl:text-lg 3xl:text-xl">
          Coming Soon
        </div>
      )}
      {comingSoon !== true && (
        <>
          <div className="mt-5 text-2xl font-medium tracking-tighter text-white">
            72%
          </div>
          <div className={cn('h-60 w-full', chartWrapperClass)}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  type="natural"
                  dataKey="pv"
                  stroke="#1E40AF"
                  strokeWidth={4}
                  dot={false}
                />
                <Line
                  type="natural"
                  dataKey="uv"
                  stroke="#374151"
                  strokeWidth={4}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-md mt-10 mb-1 font-medium text-gray-400">
            Compare to 34% last week
          </p>
        </>
      )}
    </div>
  );
}
