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
        'flex items-center justify-between rounded-full bg-dark py-2 px-3 text-xs font-medium tracking-wider shadow-card w-28',
        {
          'text-blue-400': state === 'open',
          'text-orange-400': state === 'voting',
          'text-green-400': state === 'winner declared',
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
          {state === 'voting' && <ChartBarIcon />}
          {state === 'winner declared' && <TrophyIcon />}
          {state === 'closed' && <LockIcon />}
        </div>
        <div>{state.replace(' declared', '')}</div>
      </div>
    </div>
  );
};

export default IssueState;
