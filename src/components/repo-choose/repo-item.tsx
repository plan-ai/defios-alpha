import React from 'react';
import GithubLogo from '@/assets/images/github-mark-white.svg';
import Image from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { LockIcon } from '@/components/ui/icons/lock';
import { StarIcon } from '@/components/icons/star';
import { ForkIcon } from '@/components/icons/fork-icon';
import { LinkIcon } from '@/components/icons/link-icon';
import cn from 'classnames';

interface RepoItemProps {
  link: string;
  description: string;
  stars: number;
  forks: number;
  visibility: string;
  selectedRepo: string;
  setSelect: React.Dispatch<string>;
}

const RepoItem: React.FC<RepoItemProps> = ({
  link,
  description,
  stars,
  forks,
  visibility,
  selectedRepo,
  setSelect,
}) => {
  return (
    <div
      className={cn(
        'mb-2 flex h-28 w-full flex-col rounded-lg border border-gray-600 p-2',
        { 'border-blue-700': selectedRepo === link }
      )}
      onClick={() => setSelect(link)}
    >
      <div className="mb-1 flex items-start justify-between">
        <div className="flex items-center rounded-full bg-black px-4 py-2">
          <Image src={GithubLogo} alt="github logo" className="mr-1 h-4 w-4" />
          <div className="text-xs">
            {link.replace('https://github.com', '')}
          </div>
        </div>
        {visibility === 'private' && <LockIcon />}
      </div>
      {description !== '' && (
        <div className="h-9 w-full px-2 text-xs">
          {description.length > 140
            ? description.slice(0, 140) + '...'
            : description}
        </div>
      )}
      {description === '' && (
        <div className="h-9 w-full px-2 text-xs text-gray-500">
          No Description Provided
        </div>
      )}
      <div className="mt-1 flex justify-between px-2">
        <div className="flex items-center text-sm">
          <div className="flex w-20 items-center">
            <StarIcon />
            <div className="pl-1">{stars}</div>
          </div>
          <div className="flex w-20 items-center">
            <ForkIcon />
            <div className="pl-1">{forks}</div>
          </div>
          <AnchorLink
            onClick={(e) => e.stopPropagation()}
            href={link || ''}
            target="_blank"
          >
            <LinkIcon />
          </AnchorLink>
        </div>
      </div>
    </div>
  );
};

export default RepoItem;
