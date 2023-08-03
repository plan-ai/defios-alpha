import React from 'react';
import cn from 'classnames';
import Image from '@/components/ui/image';

import GithubImage from '@/assets/images/github-mark-white.svg';

interface TagImageProps {
  tag: string;
  assign?: true;
  handleRemove?: any;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
}
const variants = {
  small: 'w-8 h-8',
  medium: 'w-9 h-9',
  large: 'w-10 h-10 sm:w-12 sm:h-12',
};

const TagImage: React.FC<TagImageProps> = ({
  tag,
  assign,
  handleRemove,
  className,
  variant = 'small',
}) => {
  return (
    <div
      className={cn(
        'mx-1 my-0.5 flex items-center justify-between rounded-full bg-black  shadow-card',
        className
      )}
      onClick={() => {
        if (!assign || assign === undefined) return;
        handleRemove(tag);
      }}
    >
      <div className="flex items-center">
        <div
          className={cn(
            'relative m-0.5 overflow-hidden rounded-full rounded-full',
            variants[variant]
          )}
        >
          <Image
            alt="icon"
            src={GithubImage || ''}
            className="object-cover"
            fill
          />
        </div>
        <div className="py-1 px-2 text-3xs font-medium tracking-wider lg:text-2xs 2xl:py-1.5 2xl:px-2.5 2xl:px-3 2xl:text-xs 3xl:py-2">
          {tag}
        </div>
      </div>
    </div>
  );
};

export default TagImage;
