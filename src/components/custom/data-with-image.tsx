import React from 'react';
import { StaticImageData } from 'next/image';
import { WenchIcon } from '../ui/icons/wench';
import { BriefcaseIcon } from '../icons/briefcase';
import { HandshakeIcon } from '@/components/ui/icons/handshake';
import { StethoscopeIcon } from '../ui/icons/stethoscope';

import cn from 'classnames';

interface DataWithImageProps {
  image: StaticImageData | string;
  value: string;
  header: string;
  change?: string;
  trunc?: number;
  className?: string;
}

const DataWithImage: React.FC<DataWithImageProps> = ({
  header,
  value,
  image,
  trunc,
  className,
  change,
}) => {
  return (
    <div className={cn('flex w-full items-center', className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-200 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {image === 'wench' && <WenchIcon />}
        {image === 'briefcase' && <BriefcaseIcon />}
        {image === 'handshake' && <HandshakeIcon />}
        {image === 'health' && <StethoscopeIcon />}
      </div>
      <div className="ml-2.5 flex flex-col xl:ml-4">
        <span className="mb-0.5 text-xs text-gray-400">{header}</span>
        {change == undefined && (
          <strong className="text-sm font-medium -tracking-wider text-white">
            {value.length > (trunc || 12)
              ? value.slice(0, trunc || 12) + '...'
              : value}
          </strong>
        )}

        {change !== undefined && (
          <span className="mb-0.5 flex text-sm">
            {value}
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

export default DataWithImage;
