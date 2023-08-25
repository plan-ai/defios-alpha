import React, { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';
import Textarea from '@/components/ui/forms/textarea';
import cn from 'classnames';
import { useAppSelector } from '@/store/store';

import MarkdownRenderer from '@/components/ui/markdown';

interface IssueCommentCreatorProps {}

export const IssueCommentCreator: React.FC<IssueCommentCreatorProps> = ({}) => {
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  const [viewPreview, setViewPreview] = useState(false);
  const [newComment, setNewComment] = useState('');

  return (
    <div className="relative flex min-h-[12rem] w-full flex-col items-end gap-2 rounded-3xl bg-[#24272D]">
      <div className="absolute right-6 top-4 z-[40] flex items-center gap-4 text-xs xl:text-sm 3xl:text-base">
        <div
          onClick={() => setViewPreview(false)}
          className={cn('flex cursor-pointer items-center py-2 px-3', {
            'textShadow text-primary': !viewPreview,
            'text-white': viewPreview,
          })}
        >
          Write
        </div>
        <div
          onClick={() => setViewPreview(true)}
          className={cn('flex cursor-pointer items-center py-2 px-3', {
            'textShadow text-primary': viewPreview,
            'text-white': !viewPreview,
          })}
        >
          Preview
        </div>
      </div>
      {!viewPreview && (
        <Textarea
          className="!h-full w-full"
          placeholder="Leave a comment. Your comment will be automatically posted on GitHub. "
          inputClassName="text-xs !bg-[#24272D] !border-0 !rounded-3xl !p-6 min-h-[12rem] lg:text-sm 2xl:text-base"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      )}
      {viewPreview && (
        <MarkdownRenderer className="w-full p-6">{newComment}</MarkdownRenderer>
      )}
      <div className="absolute bottom-6 right-6 z-[40] w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg">
        comment
      </div>
    </div>
  );
};

export default IssueCommentCreator;
