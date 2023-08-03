import React from 'react';
import Image from '@/components/ui/image';
import { TagIcon } from '@heroicons/react/24/outline';
import GithubTags from '@/components/ui/tags/github-tags';
import cn from 'classnames';
import { useAppSelector } from '@/store/store';

interface IssueCommentProps {
  commentType: string;
  data: any;
}

export const IssueComment: React.FC<IssueCommentProps> = ({
  commentType,
  data,
}) => {
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  return (
    <div className="flex w-full flex-col">
      {commentType === 'comment' && (
        <div className="flex w-full">
          <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={data?.user?.avatar_url || ''}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
          <div
            className={cn(
              'flex w-full flex-col rounded-lg border-2 text-xs xl:text-sm 3xl:text-base',
              {
                'border-blue-500/50': data?.user?.id === githubInfo?.id,
                'border-gray-500/50': data?.user?.id !== githubInfo?.id,
              }
            )}
          >
            <div
              className={cn(
                'flex w-full items-center justify-between rounded-t-lg border-b-2  py-2 px-4',
                {
                  'border-blue-500/50 bg-blue-500/[.15]':
                    data?.user?.id === githubInfo?.id,
                  'border-gray-500/50 bg-gray-500/[.15]':
                    data?.user?.id !== githubInfo?.id,
                }
              )}
            >
              <div className="flex items-center gap-2">
                <div className="font-semibold">{data?.user?.login}</div>
                <div className="text-gray-400">commented last week</div>
              </div>

              {data?.author_association !== 'NONE' && (
                <div
                  className={cn(
                    'rounded-full border border-blue-500/50 py-1 px-3 text-2xs text-gray-400 xl:text-xs 3xl:text-sm',
                    {
                      'border-blue-500/50': data?.user?.id === githubInfo?.id,
                      'border-gray-500/50': data?.user?.id !== githubInfo?.id,
                    }
                  )}
                >
                  {data?.author_association}
                </div>
              )}
            </div>
            <div className="w-full whitespace-pre-wrap rounded-b-lg p-4">
              {data?.body}
            </div>
          </div>
        </div>
      )}
      {commentType === 'label' && (
        <div className="flex w-full items-center gap-2 pl-[4.5rem] text-xs xl:text-sm 3xl:text-base">
          <div className="mr-2 flex h-[3rem] w-[3rem] items-center justify-center rounded-full border-2 border-body bg-gray-800">
            <TagIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="relative mr-2 h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={data?.user?.avatar_url || ''}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="font-semibold">{data?.user?.login}</div>
          <div className="text-gray-400">added</div>
          {data?.labels?.map((item: any, idx: number) => {
            return <GithubTags tag={item?.name || ''} key={idx} />;
          })}
          <div className="text-gray-400">labels last week</div>
        </div>
      )}
      <div className="h-8 w-[6rem] border-r-2 border-gray-600"></div>
    </div>
  );
};

export default IssueComment;
