import React, { useState } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import cn from 'classnames';
interface ToggleBtnProps {
  label?: string;
  option1: string;
  option2: string;
  className?: string;
  stateChoosen?: string;
  setStateChoosen?: React.Dispatch<React.SetStateAction<string>>;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({
  option1,
  option2,
  label,
  className,
  stateChoosen,
  setStateChoosen,
}) => {
  const [status, setStatus] = useState(option1);
  return (
    <div className="flex flex-row items-center justify-start">
      {label && (
        <div className="mr-2 text-xs xl:text-sm 3xl:text-base">{label}:</div>
      )}
      <RadioGroup
        value={
          stateChoosen !== undefined && setStateChoosen !== undefined
            ? stateChoosen
            : status
        }
        onChange={
          stateChoosen !== undefined && setStateChoosen !== undefined
            ? setStateChoosen
            : setStatus
        }
        className="flex items-center sm:gap-3"
      >
        <RadioGroup.Option value={option1}>
          {({ checked }) => (
            <span
              className={cn(
                'relative flex h-6 xl:h-7 3xl:h-8 w-[5.25rem] cursor-pointer items-center justify-center rounded-lg text-center text-2xs font-medium tracking-wider 2xl:w-[6rem] xl:text-xs 3xl:w-[6.75rem] 3xl:text-sm',
                checked ? 'text-white' : 'text-white/50',
                className
              )}
            >
              {checked && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                  layoutId="statusIndicator"
                />
              )}
              <span className="relative">{option1}</span>
            </span>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={option2}>
          {({ checked }) => (
            <span
              className={cn(
                'relative flex h-6 xl:h-7 3xl:h-8 w-[5.25rem] cursor-pointer items-center justify-center rounded-lg text-center text-2xs font-medium tracking-wider 2xl:w-[6rem] xl:text-xs 3xl:w-[6.75rem] 3xl:text-sm',
                checked ? 'text-white' : 'text-white/50',
                className
              )}
            >
              {checked && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                  layoutId="statusIndicator"
                />
              )}
              <span className="relative">{option2}</span>
            </span>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
};

export default ToggleBtn;
