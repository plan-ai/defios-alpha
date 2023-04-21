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
          'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
        )}
      >
        <span
          className={cn(
            isStacked
              ? 'translate-x-5 bg-light-dark'
              : 'translate-x-0.5 bg-light-dark',
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
          )}
        />
      </div>
      <span className="inline-flex text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
        {label}
      </span>
    </Switch>
  );
};

export default StackedSwitch;
