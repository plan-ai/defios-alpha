import React from 'react';
import Image from '@/components/ui/image';
import { TagIcon } from '@heroicons/react/24/outline';
import GithubTags from '@/components/ui/tags/github-tags';
import cn from 'classnames';
import { useAppSelector } from '@/store/store';

import MarkdownRenderer from '@/components/ui/markdown';

interface IssueCommentProps {
  data: any;
}

export const IssueComment: React.FC<IssueCommentProps> = ({ data }) => {
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  return (
    <div className="mb-6 flex w-full flex-col">
      <div className="flex w-full">
        <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-full border-2 border-primary">
          <Image
            src={data?.user?.avatar_url || ''}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col text-xs xl:text-sm 3xl:text-base">
          <div className="flex w-full items-center justify-between py-2 px-4">
            <div className="flex items-center gap-2">
              <div
                className={`font-semibold ${
                  githubInfo?.id === data?.user?.id && 'text-primary'
                } `}
              >
                {data?.user?.login}
              </div>
              <div className="text-gray-400">commented last week</div>
            </div>
          </div>
          <div className="w-full rounded-b-lg p-4">
            <MarkdownRenderer className="w-full">{data?.body}</MarkdownRenderer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueComment;
