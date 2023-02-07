import React from 'react';
import { BriefcaseIcon } from '@/components/icons/briefcase';
import { PoolIcon } from '@/components/ui/icons/pool';
import { LockIcon } from '@/components/ui/icons/lock';
import { WenchIcon } from '@/components/ui/icons/wench';
import { BankNotesIcon } from '@/components/ui/icons/banknotes';
import { StethoscopeIcon } from '../ui/icons/stethoscope';

import cn from 'classnames';

interface StatsDataProps {
  icon: string;
  value: string;
  header: string;
}

const StatsData: React.FC<StatsDataProps> = ({ header, value, icon }) => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20%] bg-gray-900 text-gray-200 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {icon === 'issues' && <PoolIcon />}
        {icon === 'health' && <StethoscopeIcon />}
        {icon === 'banknotes' && <BankNotesIcon />}
        {icon === 'lock' && <LockIcon />}
      </div>
      <div className="mt-2.5 flex flex-col items-center justify-center">
        <span className="mb-2 text-sm text-gray-400">{header}</span>
        <strong className="text-md font-medium -tracking-wider text-white">
          {value.length > 12 ? value.slice(0, 12) + '...' : value}
        </strong>
      </div>
    </div>
  );
};

export default StatsData;
