import React from 'react';
import cn from 'classnames';
import { TrophyIcon } from '@/components/icons/trophy';
import { CodeIcon } from '@/components/icons/code';
import { ChartBarIcon } from '@/components/icons/chartbar';
import { LockIcon } from '@/components/icons/lock';
interface IssueStateProps {
  state: string;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
}
const variants = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-8 h-8 sm:w-10 sm:h-10',
};

const IssueState: React.FC<IssueStateProps> = ({
  state,
  className,
  variant = 'small',
}) => {
  return (
    <div
      className={cn(
        'mx-1 my-0.5 flex items-center justify-between rounded-full bg-black py-1 px-2 text-xs font-medium tracking-wider shadow-card xl:text-sm 2xl:py-1.5 2xl:px-2.5 2xl:px-3 3xl:py-2 3xl:text-base',
        {
          'text-blue-400': state === 'open',
          'text-red-400': state === 'closed',
        },
        className
      )}
    >
      <div className="flex items-center">
        <div
          className={cn(
            'mr-2 flex items-center justify-center rounded-full pl-1',
            variants[variant]
          )}
        >
          {state === 'open' && <CodeIcon />}
          {state === 'closed' && <LockIcon />}
        </div>
        <div>{state[0].toUpperCase() + state.slice(1)}</div>
      </div>
    </div>
  );
};

export default IssueState;
