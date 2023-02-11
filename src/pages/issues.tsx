import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import RightSideIssues from '@/components/issues/right-side-issues';
import ToggleBtn from '@/components/ui/button/toggle';
import { SearchIcon } from '@/components/icons/search';
import IssuesList from '@/components/issues/list';
import { IssuesData } from '@/data/static/issues-data';

import OpenIssueExpand from '@/components/issues/open-issues-expand';
import VotingExpand from '@/components/issues/voting-expand';
import WinnerDeclaredExpand from '@/components/issues/winner-declared-expand';
import ClosedIssueExpand from '@/components/issues/closed-issue-expand';

function Search() {
  return (
    <form
      className="relative flex w-full rounded-full"
      noValidate
      role="search"
    >
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-600 bg-transparent py-1 pr-5 pl-10 text-sm tracking-tighter text-white outline-none transition-all placeholder:text-gray-500 focus:border-gray-500"
          placeholder="Search Issues"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute left-0 flex h-full w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 text-gray-500 hover:text-gray-900 sm:pl-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </form>
  );
}

const sliderData = [
  {
    title: 'Pull Request1',
    stakerConfidence: '50%',
    originality: '75',
    author: 'Rohitkk432',
    link: 'https://github.com/AbhisekBasu1/DefiOS/pull/27',
  },
  {
    title: 'Pull Request2',
    stakerConfidence: '50%',
    originality: '75',
    author: 'Rohitkk432',
    link: 'https://github.com/AbhisekBasu1/DefiOS/pull/27',
  },
  {
    title: 'Pull Request3',
    stakerConfidence: '50%',
    originality: '75',
    author: 'Rohitkk432',
    link: 'https://github.com/AbhisekBasu1/DefiOS/pull/27',
  },
  {
    title: 'Pull Request4',
    stakerConfidence: '50%',
    originality: '75',
    author: 'Rohitkk432',
    link: 'https://github.com/AbhisekBasu1/DefiOS/pull/27',
  },
  {
    title: 'Pull Request5',
    stakerConfidence: '50%',
    originality: '75',
    author: 'Rohitkk432',
    link: 'https://github.com/AbhisekBasu1/DefiOS/pull/27',
  },
];

const IssuesPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Issues"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="flex items-center justify-start">
        <div className="flex h-full w-3/4 flex-col">
          <div className="mb-2 flex w-full gap-5">
            <Search />
            <ToggleBtn option1="All Issues" option2="My Issues" />
          </div>
          <div className="my-3 grid grid-cols-7 gap-6 rounded-lg bg-light-dark shadow-card">
            <span className="col-span-3 px-6 py-4 text-xs tracking-wider text-gray-300 sm:text-sm">
              Issue Title
            </span>
            <span className="px-6 py-4 text-xs tracking-wider text-gray-300 sm:text-sm">
              Project Name
            </span>
            <span className="px-6 py-4 text-xs tracking-wider text-gray-300 sm:text-sm">
              Staked Tokens
            </span>
            <span className="col-span-2 px-6 py-4 text-xs tracking-wider text-gray-300 sm:text-sm">
              Tags
            </span>
          </div>
          {IssuesData.map((issue) => (
            <IssuesList
              issueName={issue.issueName}
              projectName={issue.projectName}
              issueTags={issue.issueTags}
              totalStaked={issue.totalStaked}
              tags={issue.tags}
              key={issue.id}
              coin={issue.coin}
            >
              {issue.issueTags === 'open' && (
                <OpenIssueExpand issueDesc={issue.description} />
              )}
              {issue.issueTags === 'voting' && (
                <VotingExpand PRData={sliderData} />
              )}
              {issue.issueTags === 'winner declared' && (
                <WinnerDeclaredExpand
                  winningPR={issue.winner.winningPR}
                  winningAuthor={issue.winner.winningAuthor}
                  winnerMargin={issue.winner.winnerMargin}
                  originality={issue.winner.originality}
                />
              )}
              {issue.issueTags === 'closed' && (
                <ClosedIssueExpand
                  winningPR={issue.winner.winningPR}
                  winningAuthor={issue.winner.winningAuthor}
                  totalPRs={issue.totalPRs}
                  totalAmountStaked={issue.totalStaked}
                  totalVotes={issue.winner.totalVotes}
                  timeTakenToClose={issue.winner.timeTakenToClose}
                  codeQuality={issue.winner.codeQuality}
                  winnerMargin={issue.winner.winnerMargin}
                  coin={issue.coin}
                />
              )}
            </IssuesList>
          ))}
        </div>
        <RightSideIssues />
      </div>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IssuesPage;
