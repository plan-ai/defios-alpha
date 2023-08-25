import React from 'react';

interface PlainTagsProps {
  tag: string;
}

export const PlainTags: React.FC<PlainTagsProps> = ({ tag }) => {
  return (
    <div className="flex items-center justify-center rounded-full border px-4 py-0.5 text-2xs xl:text-xs 3xl:text-sm">
      {tag}
    </div>
  );
};

export default PlainTags;
