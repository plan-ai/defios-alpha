import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PriceChartProps {}

const PriceChart: React.FC<PriceChartProps> = ({}) => {
  return (
    <div className="my-2 h-20 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={[
            { name: 1, value: 9187.44 },
            { name: 2, value: 21356.99 },
            { name: 3, value: 34698.98 },
            { name: 4, value: 37587.55 },
            { name: 5, value: 17577.4 },
            { name: 6, value: 55577.4 },
            { name: 7, value: 49577.4 },
            { name: 8, value: 28577.4 },
            { name: 9, value: 28577.4 },
          ]}
        >
          <defs>
            <linearGradient id="liquidity-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bc9aff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#7645D9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="natural"
            dataKey="value"
            stroke="#7645D9"
            strokeWidth={1.5}
            fill="url(#liquidity-gradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
