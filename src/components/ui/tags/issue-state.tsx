import React from 'react';
import cn from 'classnames';

interface IssueStateProps {
  state: string;
}

const IssueState: React.FC<IssueStateProps> = ({ state }) => {
  return (
    <div
      className={cn('flex items-center justify-center rounded-full border py-0.5 px-3 text-xs mx-2', {
        'border-blue-400 bg-blue-900 text-blue-400': state === 'open',
        'border-orange-500 bg-orange-900 text-orange-400': state === 'voting',
        'border-green-500 bg-green-900 text-green-400':
          state === 'winner declared',
        'border-red-500 bg-red-900 text-red-400': state === 'closed',
      })}
    >
      {state}
    </div>
  );
};

export default IssueState;
