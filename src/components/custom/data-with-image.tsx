import React from 'react';
import Image from '@/components/ui/image';
import { StaticImageData } from 'next/image';
import { WenchIcon } from '../ui/icons/wench';
import { BriefcaseIcon } from '../icons/briefcase';
import cn from 'classnames';

interface DataWithImageProps {
  image: StaticImageData | string;
  value: string;
  header: string;
}

const DataWithImage: React.FC<DataWithImageProps> = ({
  header,
  value,
  image,
}) => {
  return (
    <div className="flex items-center lg:w-1/2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-200 md:h-9 md:w-9 xl:h-10 xl:w-10">
        {image === 'wench' && <WenchIcon />}
        {image === 'briefcase' && <BriefcaseIcon />}
      </div>
      <div className="ml-2.5 flex flex-col xl:ml-4">
        <span className="mb-0.5 text-xs text-gray-400">{header}</span>
        <strong className="text-sm font-medium -tracking-wider text-white">
          {value.length > 12 ? value.slice(0, 12) + '...' : value}
        </strong>
      </div>
    </div>
  );
};

export default DataWithImage;
