import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import cn from 'classnames';

interface StackedSwitchProps {
  label: string;
  isStacked: boolean;
  setIsStacked: React.Dispatch<React.SetStateAction<boolean>>;
}
const StackedSwitch: React.FC<StackedSwitchProps> = ({ label,isStacked,setIsStacked }) => {
  return (
    <Switch
      checked={isStacked}
      onChange={setIsStacked}
      className="flex items-center gap-2 text-gray-400 sm:gap-3"
    >
      <div
        className={cn(
          isStacked ? 'bg-new-blue' : 'bg-gray-500',
          'relative inline-flex 3xl:h-[22px] 2xl:h-[19px] h-[16px] 3xl:w-10 w-9 items-center rounded-full transition-colors duration-300'
        )}
      >
        <span
          className={cn(
            isStacked
              ? 'translate-x-5 bg-light-dark'
              : 'translate-x-0.5 bg-light-dark',
            'inline-block 3xl:h-[18px] 3xl:w-[18px] 2xl:h-[15px] 2xl:w-[15px] h-[12px] w-[12px]  transform rounded-full bg-white transition-transform duration-200'
          )}
        />
      </div>
      <span className="inline-flex text-3xs xl:text-2xs 2xl:text-xs 3xl:text-sm font-medium uppercase tracking-wider text-white">
        {label}
      </span>
    </Switch>
  );
};

export default StackedSwitch;
