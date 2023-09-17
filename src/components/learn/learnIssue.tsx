import React, { useState, useEffect } from 'react';
import { PullRequestIcon } from '@/components/icons/pull-request';
import LangTags from '@/components/ui/tags/lang-tags';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/ButtonNew';
import { Verified } from '@/components/icons/verified';
import GithubTags from '@/components/ui/tags/github-tags';
import IssueState from '@/components/ui/tags/issue-state';
import AnchorLink from '@/components/ui/links/anchor-link';

import { CheckBadgeIcon } from '@heroicons/react/24/outline';

import MarkdownRenderer from '@/components/ui/markdown';

import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';

interface LearnIssueProps {
  item: any;
  setCompleted: React.Dispatch<React.SetStateAction<number>>;
  setNumClosed: React.Dispatch<React.SetStateAction<number>>;
}

const LearnIssue: React.FC<LearnIssueProps> = ({
  item,
  setCompleted,
  setNumClosed,
}) => {
  // const dummyTags = ['JavaScript', 'HTML'];

  const { data: session } = useSession();

  const [pullRequestCount, setPullRequestCount] = useState(0);
  const [issueState, setIssueState] = useState('open');
  const [solvedByMe, setSolvedByMe] = useState(false);

  useEffect(() => {
    if (!(session as any)?.accessToken) return;
    if (item === undefined || item == null || item.url === undefined) return;
    const repo_url = item.url.split('/issues/')[0];

    axios
      .get(item.url + '/timeline', {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => {
        let solved: boolean = false;
        let _solvedByMe: boolean = false;
        let pull_requests: number = 0;

        const filteredData = res.data.filter((item: any) => {
          if (item.event === 'cross-referenced') {
            return item;
          } else if (item.event === 'closed') {
            solved = true;
            return item;
          }
        });

        filteredData.map((item: any) => {
          if (item?.source?.type === 'issue') {
            if (
              item?.source?.issue.repository_url === repo_url &&
              item?.source?.issue.pull_request
            ) {
              pull_requests++;
              if (item?.source?.issue?.pull_request?.merged_at !== null) {
                setNumClosed((state) => state + 1);
                if (item?.source?.issue?.user?.id === (session as any)?.id) {
                  _solvedByMe = true;
                  setCompleted((state) => state + 1);
                }
              }
            }
          }
        });

        setPullRequestCount(pull_requests);
        setIssueState(solved ? 'closed' : 'open');
        setSolvedByMe(_solvedByMe);
      });
  }, [item, session]);

  return (
    <div className="flex w-full  items-start justify-between gap-4 rounded-lg border border-gray-700 bg-body p-3 lg:border-2 xl:p-3.5 3xl:p-4">
      <div className="flex w-[65%] flex-col gap-2">
        <div className="text-base font-semibold xl:text-lg 3xl:text-xl">
          {item?.title}{' '}
          {item.html_url && (
            <span className="ml-4 text-primary">
              #{item?.html_url.split('/')[item?.html_url.split('/').length - 1]}
            </span>
          )}
        </div>
        {item?.labels?.length > 0 && (
          <div className="my-1 flex flex-wrap items-center gap-1">
            {item?.labels?.map((item: any, idx: number) => {
              return <GithubTags tag={item?.name} key={idx} />;
            })}
          </div>
        )}
        {/* <div className="my-1 flex items-center gap-1">
          {dummyTags.map((tag, idx) => {
            return <LangTags tag={tag} key={idx} />;
          })}
        </div> */}
        {/* <div className="my-1 flex items-center gap-2">
          <div className="mr-2">Learning Objectives:</div>
          <div className="inline-flex items-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
            Solana
            <Verified className="ml-1 h-5 w-5" />
          </div>
          <div className="inline-flex items-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
            Anchor
            <Verified className="ml-1 h-5 w-5" />
          </div>
        </div> */}
        <div className="mt-3 w-full text-xs xl:text-sm 3xl:text-base">
          {item?.body?.length < 350 || item?.body === null ? (
            <MarkdownRenderer className="w-full">
              {item?.body ?? 'no description'}
            </MarkdownRenderer>
          ) : (
            <>
              <MarkdownRenderer className="w-full">
                {item?.body?.slice(0, 350)}
              </MarkdownRenderer>
              <div className="inline">....</div>
              <AnchorLink
                href={item?.html_url}
                target="_blank"
                className="inline font-bold underline"
              >
                Click to Read More
              </AnchorLink>
            </>
          )}{' '}
        </div>
      </div>
      <div className="flex w-[35%] flex-col gap-4">
        <div className="flex w-fit items-center gap-4">
          <IssueState state={issueState} />
          {solvedByMe && <CheckBadgeIcon className="h-8 w-8 text-green-500" />}
        </div>
        <div className="flex h-full w-full flex-col gap-6 rounded-lg bg-black bg-gray-900 py-4 px-4">
          <div className="text-wrap flex flex-wrap items-center gap-2 whitespace-nowrap text-xs xl:text-sm 3xl:text-base">
            <div className="flex h-8 w-8 items-center justify-center">
              <PullRequestIcon />
            </div>
            <div className="text-gray-400">Open Pull Requests:</div>
            <div>{pullRequestCount}</div>
          </div>
          <div className="text-wrap flex flex-wrap items-center gap-2 whitespace-nowrap text-xs xl:text-sm 3xl:text-base">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={
                  'https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte'
                }
                alt="coin"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-gray-400">Amount Staked:</div>
            <div>0 (Not on defiOS)</div>
          </div>
        </div>
        <AnchorLink href={item?.html_url} target="_blank" className="w-full">
          <Button fullWidth={true} size="small">
            Check out the Issue
          </Button>
        </AnchorLink>
      </div>
    </div>
  );
};

export default LearnIssue;
