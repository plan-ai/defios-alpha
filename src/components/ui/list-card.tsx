import React from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
type ItemType = {
  id?: string | number;
  name: string;
  logo?: StaticImageData | string;
  element?: JSX.Element;
  balance?: string;
  coinType?: string;
};
type CardProps = {
  item: ItemType;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
};

const variants = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-8 h-8 sm:w-10 sm:h-10',
};

function handleImageSize(variant: string) {
  let size: number = 0;
  if (variant === 'large') {
    size = 40;
  } else if (variant === 'medium') {
    size = 32;
  } else {
    size = 24;
  }
  return size;
}

export default function ListCard({
  item,
  className = 'p-3 tracking-wider rounded-xl sm:p-4',
  variant = 'small',
}: CardProps) {
  const { name, logo, balance, coinType, element } = item ?? {};
  return (
    <div
      className={cn(
        'flex items-center justify-between bg-gray-900 text-2xs font-medium shadow-card xl:text-xs 3xl:text-sm',
        className
      )}
    >
      <div className="flex items-center">
        {logo !== undefined && (
          <div className={cn('rounded-full', variants[variant])}>
            <Image
              src={logo || ''}
              alt={name || ''}
              width={handleImageSize(variant)}
              height={handleImageSize(variant)}
              className="rounded-full"
            />
          </div>
        )}
        {element !== undefined && (
          <div
            className={cn(
              'flex items-center justify-center rounded-full pl-1',
              variants[variant]
            )}
          >
            {element}
          </div>
        )}

        <div className="ml-3">
          {name}
          {coinType && (
            <span className="block pt-0.5 text-3xs font-normal capitalize text-gray-400 xl:text-2xs 3xl:text-xs">
              {coinType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
