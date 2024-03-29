import React from 'react';
import { StaticImageData } from 'next/image';
import { WenchIcon } from '@/components/icons/wench';
import { BriefcaseIcon } from '@/components/icons/briefcase';
import { HandshakeIcon } from '@/components/icons/handshake';
import { StethoscopeIcon } from '@/components/icons/stethoscope';
import { LinkIcon } from '@/components/icons/link-icon';
import { BankNotesIcon } from '@/components/icons/banknotes';
import { TrophyIcon } from '@/components/icons/trophy';
import { CodeIcon } from '@/components/icons/code';
import { PresentationChartIcon } from '@/components/icons/presentation-chart';
import { ClockIcon } from '@/components/icons/clock';
import { DollarCoinIcon } from '@/components/icons/dollar-coin';
import { ChartBarIcon } from '@/components/icons/chartbar';
import cn from 'classnames';
import Image from 'next/image';

interface DataWithImageProps {
  image?: StaticImageData | string;
  value?: string;
  header: string;
  change?: string;
  trunc?: number;
  className?: string;
  coin?: string;
}

const DataWithImage: React.FC<DataWithImageProps> = ({
  header,
  value,
  image,
  trunc,
  className,
  change,
  coin,
}) => {
  return (
    <div className={cn('flex w-full items-center', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-200 xl:h-11 xl:w-11 3xl:h-12 3xl:w-12">
        {image === 'wench' && <WenchIcon />}
        {image === 'briefcase' && <BriefcaseIcon />}
        {image === 'handshake' && <HandshakeIcon />}
        {image === 'health' && <StethoscopeIcon />}
        {image === 'link' && <LinkIcon />}
        {image === 'banknotes' && <BankNotesIcon />}
        {image === 'trophy' && <TrophyIcon />}
        {image === 'code' && <CodeIcon />}
        {image === 'vote' && <PresentationChartIcon />}
        {image === 'clock' && <ClockIcon />}
        {image === 'dollar' && <DollarCoinIcon />}
        {image === 'number' && <ChartBarIcon />}
        {coin !== undefined && (
          <Image
            src={coin || ''}
            alt={'coin'}
            width={48}
            height={48}
            className={'rounded-full'}
          />
        )}
      </div>
      <div className="ml-2.5 flex flex-col xl:ml-4">
        <span className="mb-0.5 text-3xs text-gray-400 xl:text-2xs 3xl:text-xs">
          {header}
        </span>
        {change == undefined && value !== undefined && (
          <strong className="text-2xs font-medium -tracking-wider text-white xl:text-xs 3xl:text-sm">
            {value.length > (trunc || 12)
              ? value.slice(0, trunc || 12) + '...'
              : value}{' '}
          </strong>
        )}

        {change !== undefined && (
          <span className="mb-0.5 flex text-2xs xl:text-xs 3xl:text-sm">
            {value}
            <div
              className={cn('ml-2', {
                'text-new-green': change[0] !== '',
                'text-red-500': change[0] === '-',
              })}
            >
              {change[0] === '-' ? change : '+' + change}%
            </div>
          </span>
        )}
      </div>
    </div>
  );
};

export default DataWithImage;
