import React, { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';
import Textarea from '@/components/ui/forms/textarea';
import cn from 'classnames';
import { useAppSelector } from '@/store/store';

import ReactMarkdown from 'react-markdown';

interface IssueCommentCreatorProps {}

export const IssueCommentCreator: React.FC<IssueCommentCreatorProps> = ({}) => {
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  const [viewPreview, setViewPreview] = useState(false);
  const [newComment, setNewComment] = useState('');

  return (
    <div className="flex w-full flex-col">
      <div className="h-8 w-[full] border-t-2 border-gray-600"></div>
      <div className="flex w-full">
        <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={githubInfo?.avatar_url || ''}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col rounded-lg border-2 border-gray-500/50">
          <div className="flex w-full items-center gap-4 rounded-t-lg border-b-2 border-gray-500/50 bg-gray-500/[.15] px-4 text-xs xl:text-sm 3xl:text-base">
            <div
              onClick={() => setViewPreview(false)}
              className={cn(
                'mt-2 flex items-center rounded-t-lg border-2 border-b-0 py-2 px-3',
                {
                  'border-gray-500/50 bg-gray-900': !viewPreview,
                  'cursor-pointer border-transparent': viewPreview,
                }
              )}
            >
              <div className="text-gray-400">Write</div>
            </div>
            <div
              onClick={() => setViewPreview(true)}
              className={cn(
                'mt-2 flex items-center rounded-t-lg border-2 border-b-0 py-2 px-3',
                {
                  'border-gray-500/50 bg-gray-900': viewPreview,
                  'cursor-pointer border-transparent': !viewPreview,
                }
              )}
            >
              <div className="text-gray-400">Preview</div>
            </div>
          </div>
          <div className="flex w-full flex-col items-end gap-2 rounded-b-lg p-4">
            {!viewPreview && (
              <Textarea
                className="my-2 w-full"
                placeholder="Leave a comment"
                inputClassName="text-2xs min-h-[7rem] lg:text-xs 2xl:text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            )}
            {viewPreview && (
              <ReactMarkdown className="w-full">{newComment}</ReactMarkdown>
            )}
            <Button shape="rounded" size="small" color="success">
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCommentCreator;
