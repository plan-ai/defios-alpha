import React, { useState, useEffect } from 'react';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';

//ui components
import Spinner from '@/components/custom/spinner';
import TagImage from '@/components/ui/tags/tag-image';
import MarkdownRenderer from '@/components/ui/markdown';
import AnchorLink from '@/components/ui/links/anchor-link';

//components
import IssueComment from '@/components/issue-details/IssueComment';
import IssueCommentCreator from '@/components/issue-details/IssueCommentCreator';


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
  const [refetch, setRefetch] = useState(0);

  //fetch issue body,tags,assignees
  useEffect(() => {
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
  }, [session, issue_url]);

  //fetch issue comments
  useEffect(() => {
    if (!(session as any)?.accessToken || issue_url === undefined) return;
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
  }, [session, issue_url, refetch]);

  return (
    <div className="mt-5 flex w-full flex-col px-6">
      {!isLoading && (
        <>
          {issueGHData?.assignees?.length > 0 && (
            <div className="mb-8 flex items-center gap-3 text-sm xl:text-base 3xl:text-lg">
              <div>Assignees: </div>
              {issueGHData?.assignees?.map((_assignee: any, idx: number) => {
                return (
                  <AnchorLink
                    key={idx}
                    href={_assignee?.html_url}
                    target="_blank"
                  >
                    <TagImage tag={_assignee?.login} />
                  </AnchorLink>
                );
              })}
            </div>
          )}
          <div className="mb-8 w-full text-sm xl:text-base 3xl:text-lg">
            <MarkdownRenderer className="w-full">
              {issueGHData?.body}
            </MarkdownRenderer>
          </div>
          {issueComments.length > 0 &&
            issueComments.map((item: any, idx: number) => {
              return <IssueComment data={item} key={idx} />;
            })}
          <IssueCommentCreator issueUrl={issue_url} setRefetch={setRefetch} />
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
