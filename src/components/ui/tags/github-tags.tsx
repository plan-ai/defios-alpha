import React from 'react';
import cn from 'classnames';
import { BugIcon } from '@/components/icons/bug';
import { ClockIcon } from '@/components/icons/clock';
import { DocumentationIcon } from '@/components/icons/documentation';
import { LifebuoyIcon } from '@/components/icons/lifebuoy';
import { QuestionIcon } from '@/components/icons/question-icon';
import { DuplicateIcon } from '@/components/icons/duplicate';
import { CautionIcon } from '@/components/icons/caution';
import { GearIcon } from '@/components/icons/gear';
import { WenchIcon } from '@/components/icons/wench';
import { CogIcon } from '@/components/icons/cog';

interface GithubTagsProps {
  tag: string;
  assign?: true;
  handleRemove?: any;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
}
const variants = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-8 h-8 sm:w-10 sm:h-10',
};

export const tagsList = [
  'bug',
  'documentation',
  'duplicate',
  'enhancement',
  'good first issue',
  'help wanted',
  'invalid',
  'question',
  'urgent',
];

const GithubTags: React.FC<GithubTagsProps> = ({
  tag,
  assign,
  handleRemove,
  className,
  variant = 'small',
}) => {
  return (
    <div
      className={cn(
        'mx-1 my-0.5 flex items-center justify-between rounded-full bg-black py-2 px-3 text-xs font-medium tracking-wider shadow-card',
        {
          'text-[#CD9CA6]': tag === 'bug',
          'text-[#148DFF]': tag === 'documentation',
          'text-[#CDD1D5]': tag === 'duplicate',
          'text-[#A0EEEE]': tag === 'enhancement',
          'text-[#C1B8E0]': tag === 'good first issue',
          'text-[#00E6BA]': tag === 'help wanted',
          'text-[#E5E562]': tag === 'invalid',
          'text-[#D97EE0]': tag === 'question',
          'text-[#F093B2]': tag === 'urgent',
        },
        className
      )}
      onClick={() => {
        if (!assign || assign === undefined) return;
        handleRemove(tag);
      }}
    >
      <div className="flex items-center">
        <div className={cn('mr-2 rounded-full pl-1', variants[variant])}>
          {tag === 'bug' && <BugIcon />}
          {tag === 'documentation' && <DocumentationIcon />}
          {tag === 'duplicate' && <DuplicateIcon />}
          {tag === 'enhancement' && <GearIcon />}
          {tag === 'good first issue' && <WenchIcon />}
          {tag === 'help wanted' && <LifebuoyIcon />}
          {tag === 'question' && <QuestionIcon />}
          {tag === 'invalid' && <CautionIcon />}
          {tag === 'urgent' && <ClockIcon />}
          {!tagsList.includes(tag) && <CogIcon />}
        </div>
        <div>{tag}</div>
      </div>
    </div>
  );
};

export default GithubTags;
