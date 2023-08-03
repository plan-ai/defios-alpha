import React, { useState, useEffect } from 'react';
import IssueComment from '@/components/issue-details/IssueComment';
import IssueCommentCreator from '@/components/issue-details/IssueCommentCreator';
import Spinner from '@/components/custom/spinner';
import TagImage from '@/components/ui/tags/tag-image';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';

import Image from '@/components/ui/image';

interface IssueDescriptionProps {}

export const IssueDescription: React.FC<IssueDescriptionProps> = ({}) => {
  const { data: session } = useSession();

  const [issueData, setIssueData] = useState<any>();
  const [issueComments, setIssueComments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!(session as any)?.accessToken) return;
    axios
      .get('https://api.github.com/repos/defi-os/defios-alpha/issues/68', {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => {
        setIssueData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get(
        'https://api.github.com/repos/defi-os/defios-alpha/issues/68/comments',
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
  }, [session]);

  return (
    <div className="mt-5 flex w-full flex-col">
      {!isLoading && (
        <>
          <div className="mb-8 flex h-7 w-full items-center gap-4">
            <Image
              alt="badge"
              src={
                'https://img.shields.io/github/languages/top/defi-os/defios-alpha'
              }
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: '100%' }} // optional
            />
            <Image
              alt="badge"
              src={'https://img.shields.io/github/license/defi-os/defios-alpha'}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: '100%' }} // optional
            />
          </div>
          <div className="mb-8 flex items-center gap-3 text-sm xl:text-base 3xl:text-lg">
            <div>Assignees: </div>
            <TagImage tag="Rohitkk432" />
          </div>
          <div className="mb-8 w-full whitespace-pre-wrap text-sm xl:text-base 3xl:text-lg">
            {issueData?.body}
          </div>
          <IssueComment commentType="comment" data={issueData} />
          {issueData?.labels?.length > 0 && (
            <IssueComment commentType="label" data={issueData} />
          )}
          {issueComments.length > 0 &&
            issueComments.map((item: any, idx: number) => {
              return (
                <IssueComment commentType="comment" data={item} key={idx} />
              );
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
