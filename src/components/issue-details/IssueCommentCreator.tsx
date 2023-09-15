import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useSession } from 'next-auth/react';
import axios from '@/lib/axiosClient';

//redux
import { useAppSelector } from '@/store/store';

//ui components
import Textarea from '@/components/ui/forms/textarea';
import Spinner from '@/components/custom/spinner';
import MarkdownRenderer from '@/components/ui/markdown';
import Button from '@/components/ui/button/ButtonNew';

interface IssueCommentCreatorProps {
  issueUrl: string;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const IssueCommentCreator: React.FC<IssueCommentCreatorProps> = ({
  issueUrl,
  setRefetch,
}) => {
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  const { data: session } = useSession();

  const [viewPreview, setViewPreview] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [isCommenting, setIsCommenting] = useState(false);

  const handleCommentCreate = () => {
    if (!(session as any)?.accessToken || newComment.trim().length === 0)
      return;

    setIsCommenting(true);
    let data = JSON.stringify({
      body: newComment,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url:
        issueUrl.replace(
          'https://github.com/',
          'https://api.github.com/repos/'
        ) + '/comments',
      headers: {
        Authorization: `Bearer ${(session as any)?.accessToken}`,
        'Content-Type': 'application/vnd.github.v3+json',
      },
      data: data,
    };

    axios(config)
      .then(() => {
        setNewComment('');
        setRefetch((state) => state + 1);
        setIsCommenting(false);
      })
      .catch((err) => console.log(err));
  };

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
      <Button
        color="PrimarySolid"
        onClick={() => {
          if (!isCommenting) {
            handleCommentCreate();
          }
        }}
        isLoading={isCommenting}
        className='!absolute bottom-6 right-6'
      >comment</Button>
    </div>
  );
};

export default IssueCommentCreator;
