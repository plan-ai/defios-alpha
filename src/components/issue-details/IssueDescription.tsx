import React, { useState, useEffect } from 'react';
import IssueComment from '@/components/issue-details/IssueComment';
import IssueCommentCreator from '@/components/issue-details/IssueCommentCreator';
import Spinner from '@/components/custom/spinner';
import TagImage from '@/components/ui/tags/tag-image';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from '@/components/ui/image';

import MarkdownRenderer from '@/components/ui/markdown';

interface IssueDescriptionProps {
  issue_url: string;
}

export const IssueDescription: React.FC<IssueDescriptionProps> = ({
  issue_url,
}) => {
  const { data: session } = useSession();

  const [issueGHData, setIssueGHData] = useState<any>();
  const [issueComments, setIssueComments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(issue_url);
    if (!(session as any)?.accessToken || issue_url === undefined) return;
    axios
      .get(issue_url.replace('github.com', 'api.github.com/repos'), {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => {
        setIssueGHData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get(
        issue_url.replace('github.com', 'api.github.com/repos') + '/comments',
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )
      .then((res) => {
        setIssueComments(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [session, issue_url]);

  return (
    <div className="mt-5 flex w-full flex-col px-6">
      {!isLoading && (
        <>
          <div className="mb-8 flex items-center gap-3 text-sm xl:text-base 3xl:text-lg">
            <div>Assignees: </div>
            <TagImage tag="Rohitkk432" />
          </div>
          <div className="mb-8 w-full text-sm xl:text-base 3xl:text-lg">
            <MarkdownRenderer className="w-full">
              {issueGHData?.body}
            </MarkdownRenderer>
          </div>
          {issueComments.length > 0 &&
            issueComments.map((item: any, idx: number) => {
              return <IssueComment data={item} key={idx} />;
            })}
          <IssueCommentCreator />
        </>
      )}
      {isLoading && (
        <div className="mt-10">
          <Spinner label="Loading issue data ..." />
        </div>
      )}
    </div>
  );
};

export default IssueDescription;
