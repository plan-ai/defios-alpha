import React, { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import ToggleBtn from '@/components/ui/button/toggle';
import Button from '@/components/ui/button/button';
import { SearchIcon } from '@/components/icons/search';
import { PlusCircle } from '@/components/icons/plus-circle';
import IssuesList from '@/components/issues/list';
import { IssuesData } from '@/data/static/issues-data';

import OpenIssueExpand from '@/components/issues/open-issues-expand';
import VotingExpand from '@/components/issues/voting-expand';
import WinnerDeclaredExpand from '@/components/issues/winner-declared-expand';
import ClosedIssueExpand from '@/components/issues/closed-issue-expand';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { reset } from '@/store/notifClickSlice';

import { useDrawer } from '@/components/drawer-views/context';

interface searchProps {
  placeholder?: string;
  initValue?: string;
}

const Search: React.FC<searchProps> = ({ placeholder, initValue }) => {
  const [search, setSearch] = useState(initValue || '');
  useEffect(() => {
    if (initValue !== '' && initValue !== undefined) {
      setSearch(initValue);
    }
  }, [initValue]);
  return (
    <div className="relative flex w-full rounded-full">
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-600 bg-transparent py-1 pr-5 pl-10 text-sm tracking-tighter text-white outline-none transition-all placeholder:text-gray-500 focus:border-gray-500"
          placeholder={placeholder || 'Search'}
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="pointer-events-none absolute left-0 flex h-full w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 text-gray-500 hover:text-gray-900 sm:pl-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
      <Button
        shape="rounded"
        size="small"
        className="mx-2 flex items-center justify-center"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

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
  const { openDrawer } = useDrawer();

  const [initSearch, setInitSearch] = useState('');
  const [initExapand, setInitExpand] = useState(false);
  const searchQuery = useAppSelector((state) => state.notifClick.searchQuery);
  const setSearchQuery = useAppSelector(
    (state) => state.notifClick.setSearchQuery
  );
  const expandFirst = useAppSelector((state) => state.notifClick.expandFirst);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchQuery !== '' && setSearchQuery) {
      setInitSearch(searchQuery);
      setInitExpand(expandFirst);
      dispatch(reset());
    }
  }, [searchQuery, setSearchQuery, expandFirst, dispatch]);

  return (
    <>
      <NextSeo
        title="Issues"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="flex items-center justify-start">
        <div className="flex h-full w-full flex-col">
          <div className="mb-2 flex w-full gap-5">
            <Search placeholder="Search Issues" initValue={initSearch} />
            <ToggleBtn option1="All Issues" option2="My Issues" />
            <Button
              onClick={() =>
                openDrawer('ISSUE_CREATE', 'right', 'transparent-glass')
              }
              color="info"
              shape="rounded"
              size="small"
            >
              <div className="flex flex-row items-center justify-center gap-2">
                <PlusCircle />
                New Issue
              </div>
            </Button>
          </div>
          <div className="my-3 grid grid-cols-7 gap-6 rounded-lg border-b-3 border-gray-600 bg-light-dark shadow-card">
            <span className=" col-span-2 py-4 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
              Issue Title
            </span>
            <span className="py-4 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
              Issue State
            </span>
            <span className="py-4 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
              Project Name
            </span>
            <span className="py-4 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
              Staked Tokens
            </span>
            <span className="col-span-2 py-4 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
              Tags
            </span>
          </div>
          {IssuesData.map((issue, idx) => (
            <IssuesList
              issueName={issue.issueName}
              projectName={issue.projectName}
              issueTags={issue.issueTags}
              totalStaked={issue.totalStaked}
              tags={issue.tags}
              key={issue.id}
              coin={issue.coin}
              initExpand={idx == 0 ? initExapand : false}
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
      </div>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IssuesPage;
