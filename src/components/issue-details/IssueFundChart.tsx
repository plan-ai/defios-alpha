import React, { useState, useEffect } from 'react';

import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import Image from '@/components/ui/image';

const dateFormatter = (date: any) => {
  const xDate = new Date(date);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatDate = new Intl.DateTimeFormat('en-US', {
    // dateStyle: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
    // timeZone: tz,
  }).format(xDate);

  return formatDate;
};

function CustomAxisX({ x, y, payload }: any) {
  const dateOp = dateFormatter(payload.value);
  return (
    <g transform={`translate(${x},${y})`} className="text-sm text-white">
      <text x={0} y={0} dy={25} textAnchor="middle" fill="currentColor">
        {dateOp}
      </text>
    </g>
  );
}

function CustomAxisY({ x, y, payload,tokenSymbol }: any) {
  return (
    <g transform={`translate(${x},${y})`} className="text-sm text-white">
      <text x={-20} y={5} textAnchor="middle" fill="currentColor">
        {payload.value}
      </text>
    </g>
  );
}

const CustomTooltip = ({ active, payload, label,tokenSymbol }: any) => {
  if (active && payload && payload.length) {
    // console.log(payload);
    return (
      <div className="relative">
        <div className="relative z-[40] flex  items-center gap-3 rounded-full border-2 border-primary bg-body p-3 text-sm xl:text-base 3xl:text-lg">
          {Object.keys(payload[0]?.payload?.data).length !== 0 ? (
            <>
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={payload[0]?.payload?.data?.avatar || ''}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="font-bold">
                {payload[0]?.payload?.data?.staker_name}
              </div>
              {payload[0]?.payload?.data?.staked === true && (
                <>
                  <div>funded this issue with</div>
                  <div className="font-medium text-[#90FAC7]">
                    {payload[0]?.payload?.data?.staker_amount} {tokenSymbol}
                  </div>
                </>
              )}
              {payload[0]?.payload?.data?.staked === false && (
                <>
                  <div>withdrew their stake worth</div>
                  <div className="font-medium text-[#FA9090]">
                    {payload[0]?.payload?.data?.staker_amount} {tokenSymbol}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div>Total Amount Staked :</div>
              <div className="font-medium">
                {payload[0].value} {tokenSymbol}
              </div>
            </>
          )}
        </div>
        <div className="absolute left-0 right-0 top-0 bottom-0 z-[10] rounded-full bg-[#92ABFB] blur-[10px]"></div>
      </div>
    );
  }

  return null;
};

const calculateFallsRises = (data: any) => {
  const res: any[] = [];
  const totalDateDiff = data[data.length - 1].date - data[0].date;
  for (let i = 0; i < data.length - 1; i++) {
    const diffVals = data[i + 1].value - data[i].value;
    const startPerc = ((data[i].date - data[0].date) / totalDateDiff) * 100;
    const endPerc = ((data[i + 1].date - data[0].date) / totalDateDiff) * 100;
    const difference = diffVals < 0 ? 0 : 1;
    res.push({
      start: startPerc,
      end: endPerc,
      difference: difference,
    });
  }
  return res;
};

interface IssueFundChartProps {
  chartData: any;
  token: any;
}

export const IssueFundChart: React.FC<IssueFundChartProps> = ({
  chartData,
  token
}) => {
  
  const [gradData, setgradData] = useState([
    { start: 100, end: 100, difference: 1 },
  ]);

  useEffect(() => {
    const output = calculateFallsRises(chartData);
    console.log(output);
    setgradData(output);
  }, [chartData]);

  return (
    <div className="mx-10 mb-5 h-[30rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          width={500}
          height={400}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
              {gradData.map((item, idx) => {
                return (
                  <>
                    <stop
                      offset={`${item.start}%`}
                      stopColor={item.difference === 1 ? '#90FAC7' : '#FA9090'}
                    />
                    <stop
                      offset={`${item.end}%`}
                      stopColor={item.difference === 1 ? '#90FAC7' : '#FA9090'}
                    />
                  </>
                );
              })}
            </linearGradient>
          </defs>
          {/* <CartesianGrid vertical={false} stroke="#A3A3A3" /> */}
          <Tooltip
            // position={{ y: 250 }}
            wrapperStyle={{ outline: 'none' }}
            content={<CustomTooltip tokenSymbol={token?.token_symbol} />}
          />
          <Line
            type="linear"
            dataKey="value"
            // stroke="#90FAC7"
            stroke="url(#gradient)"
            strokeWidth={2}
            dot={true}
          />
          <YAxis
            stroke="#FFF"
            tick={<CustomAxisY tokenSymbol={token?.token_symbol} />}
          />
          <XAxis
            stroke="#FFF"
            scale="linear"
            domain={[chartData[0].date, chartData[chartData.length - 1].date]}
            type="number"
            dataKey="date"
            tick={<CustomAxisX />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssueFundChart;
