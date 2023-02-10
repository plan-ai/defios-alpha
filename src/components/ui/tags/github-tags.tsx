import React from 'react';
import cn from 'classnames';

interface GithubTagsProps {
  tag: string;
  assign?: true;
  handleRemove?: any;
}

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
}) => {
  return (
    <div
      onClick={() => {
        if (!assign || assign === undefined) return;
        handleRemove(tag);
      }}
      className={cn(
        'mx-1 my-1 flex items-center justify-center rounded-full border py-0.5 px-3 text-xs',
        {
          'border-[#CD9CA6] bg-[#321820] text-[#CD9CA6]': tag === 'bug',
          'border-[#148DFF] bg-[#0B2337] text-[#148DFF]':
            tag === 'documentation',
          'border-[#CDD1D5] bg-[#30343A] text-[#CDD1D5]': tag === 'duplicate',
          'border-[#A0EEEE] bg-[#28393E] text-[#A0EEEE]': tag === 'enhancement',
          'border-[#C1B8E0] bg-[#1F1E41] text-[#C1B8E0]':
            tag === 'good first issue',
          'border-[#00E6BA] bg-[#0B2628] text-[#00E6BA]': tag === 'help wanted',
          'border-[#E5E562] bg-[#343726] text-[#E5E562]': tag === 'invalid',
          'border-[#D97EE0] bg-[#0D1117] text-[#D97EE0]': tag === 'question',
          'border-[#F093B2] bg-[#351B29] text-[#F093B2]': tag === 'urgent',
        }
      )}
    >
      {tag}
    </div>
  );
};

export default GithubTags;
