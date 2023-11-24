import React from 'react';
import cn from 'classnames';

interface TooltipProps {
  note: string;
  direction: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const Tooltip = ({
  note,
  direction,
  children,
}: React.PropsWithChildren<TooltipProps>) => {
  return (
    <div className="pointer-cursor group relative">
      {children}
      <div
        className={cn(
          'absolute z-[50] flex scale-0 text-2xs normal-case opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 xl:text-xs 3xl:text-sm',
          {
            'top-5 left-5 origin-top-left': direction === 'top-left',
            'bottom-5 left-5 origin-bottom-left': direction === 'bottom-left',
            'top-5 right-5 origin-top-right': direction === 'top-right',
            'bottom-5 right-5 origin-bottom-right':
              direction === 'bottom-right',
          }
        )}
      >
        <div
          className={cn(
            'rounded-tl-0 z-[50] w-[16rem] bg-dark p-3 shadow-[0_0_15px_2px_#92ABFB]',
            {
              'rounded-tl-0 rounded-r-lg rounded-b-lg':
                direction === 'top-left',
              'rounded-bl-0 rounded-r-lg rounded-t-lg':
                direction === 'bottom-left',
              'rounded-tr-0 rounded-l-lg rounded-b-lg':
                direction === 'top-right',
              'rounded-br-0 rounded-l-lg rounded-t-lg':
                direction === 'bottom-right',
            }
          )}
        >
          {note}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
