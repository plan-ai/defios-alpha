import React, { useState } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import cn from 'classnames';
interface ToggleBtnProps {
  label?: string;
  option1: string;
  option2: string;
  className?: string;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({
  option1,
  option2,
  label,
  className,
}) => {
  const [status, setStatus] = useState(option1);
  return (
    <div className="flex flex-row items-center justify-start">
      {label && <div className="mr-2">{label}:</div>}
      <RadioGroup
        value={status}
        onChange={setStatus}
        className="flex items-center sm:gap-3"
      >
        <RadioGroup.Option value={option1}>
          {({ checked }) => (
            <span
              className={cn(
                'relative flex h-8 w-32 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:text-sm',
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
                'relative flex h-8 w-32 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:text-sm',
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
