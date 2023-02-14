import React from 'react';
import { BriefcaseIcon } from '@/components/icons/briefcase';
import { PoolIcon } from '@/components/icons/pool';
import { LockIcon } from '@/components/icons/lock';
import { WenchIcon } from '@/components/icons/wench';
import { BankNotesIcon } from '@/components/icons/banknotes';
import { StethoscopeIcon } from '@/components/icons/stethoscope';
import { HandshakeIcon } from '@/components/icons/handshake';
import cn from 'classnames';

interface StatsDataProps {
  icon: string;
  value: string;
  header: string;
  change?: string;
}

const StatsData: React.FC<StatsDataProps> = ({
  header,
  value,
  icon,
  change,
}) => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20%] bg-gray-900 text-gray-200 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {icon === 'issues' && <PoolIcon />}
        {icon === 'health' && <StethoscopeIcon />}
        {icon === 'banknotes' && <BankNotesIcon />}
        {icon === 'lock' && <LockIcon />}
        {icon === 'handshake' && <HandshakeIcon />}
      </div>
      <div className="mt-2.5 flex flex-col items-center justify-center">
        <span className="mb-2 text-sm text-gray-400">{header}</span>
        {change == undefined && (
          <strong className="text-md font-medium -tracking-wider text-white">
            {value.length > 12 ? value.slice(0, 12) + '...' : value}
          </strong>
        )}
        {change !== undefined && (
          <span className="mb-0.5 flex text-sm">
            {value}$
            <div
              className={cn('ml-2', {
                'text-green-500': change[0] === '+',
                'text-red-500': change[0] === '-',
              })}
            >
              {change}%
            </div>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsData;
