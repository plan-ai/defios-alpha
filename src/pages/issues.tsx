import React, { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import Button from '@/components/ui/button/button';
import StackedSwitch from '@/components/custom/stacked-switch';
import { SearchIcon } from '@/components/icons/search';
import { PlusCircle } from '@/components/icons/plus-circle';
import IssuesList from '@/components/issues/list';
import { Close } from '@/components/icons/close';

import OpenIssueExpand from '@/components/issues/open-issues-expand';
import VotingExpand from '@/components/issues/voting-expand';
import WinnerDeclaredExpand from '@/components/issues/winner-declared-expand';
import ClosedIssueExpand from '@/components/issues/closed-issue-expand';

import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Image from 'next/image';
import Spinner from '@/components/custom/spinner';
import axios from 'axios';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { reset } from '@/store/notifClickSlice';

import { useDrawer } from '@/components/drawer-views/context';
interface searchProps {
  placeholder?: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setTriggerSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<searchProps> = ({
  placeholder,
  search,
  setSearch,
  setTriggerSearch,
}) => {
  return (
    <div className="relative flex w-full rounded-full">
      <label className="relative flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-600 bg-transparent py-1 pr-5 pl-5 text-sm tracking-tighter text-white outline-none transition-all placeholder:text-gray-500 focus:border-gray-500"
          placeholder={placeholder || 'Search'}
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Close
          onClick={() => setSearch('')}
          className="absolute right-3 h-4 w-4"
        />
      </label>
      <Button
        shape="rounded"
        size="small"
        className="mx-2 flex items-center justify-center"
        onClick={() => setTriggerSearch(true)}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const IssuesPage: NextPageWithLayout = () => {
  const { openDrawer } = useDrawer();

  const [isMine, setIsMine] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const [initExapand, setInitExpand] = useState(false);
  const searchQuery = useAppSelector((state) => state.notifClick.searchQuery);
  const setSearchQuery = useAppSelector(
    (state) => state.notifClick.setSearchQuery
  );
  const expandFirst = useAppSelector((state) => state.notifClick.expandFirst);

  const dispatch = useAppDispatch();

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [issuesData, setIssuesData] = useState<any>([]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    axios
      .get('https://api-v1.defi-os.com/issues', {
        params: {
          'filter.pageno': '1',
          'filter.pagesize': 30,
        },
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setIssuesData(res.data.issues);
        setIsLoading(false);
      })
      .catch((err) => console.log(err.message));
  }, [firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 30,
    };
    if (isMine) {
      searchParams['filter.mine'] = true;
    }
    if (search !== '') {
      if (search.includes(';')) {
        const searchArray = search.trim().split(';');
        searchArray.map((item) => {
          const [key, value] = item.trim().split(':');
          if (key === 'id') {
            searchParams['first_id'] = value;
          }
          if (key === 'issue_project_id') {
            searchParams['search.issue_project_id'] = value;
          }
          if (key === 'issue_project_name') {
            searchParams['search.issue_project_name'] = value;
          }
          if (key === 'issue_state') {
            searchParams['search.issue_state'] = value;
          }
          if (key === 'issue_stake_amount') {
            searchParams['search.issue_stake_amount'] = parseInt(value);
          }
          if (key === 'issue_stake_token_symbol') {
            searchParams['search.issue_stake_token_symbol'] = value;
          }
          if (key === 'issue_num_prs') {
            searchParams['search.issue_num_prs'] = parseInt(value);
          }
          if (key === 'issue_creator_gh') {
            searchParams['search.issue_creator_gh'] = parseInt(value);
          }
          if (key === 'issue_tags') {
            searchParams['search.issue_tags'] = value;
          }
          if (key === 'order_by') {
            searchParams['filter.order_by'] = value;
          }
        });
      } else if (search.includes(':') && !search.includes(';')) {
        const [key, value] = search.trim().split(':');
        if (key === 'id') {
          searchParams['first_id'] = value;
        }
        if (key === 'issue_project_id') {
          searchParams['search.issue_project_id'] = value;
        }
        if (key === 'issue_project_name') {
          searchParams['search.issue_project_name'] = value;
        }
        if (key === 'issue_state') {
          searchParams['search.issue_state'] = value;
        }
        if (key === 'issue_stake_amount') {
          searchParams['search.issue_stake_amount'] = parseInt(value);
        }
        if (key === 'issue_stake_token_symbol') {
          searchParams['search.issue_stake_token_symbol'] = value;
        }
        if (key === 'issue_num_prs') {
          searchParams['search.issue_num_prs'] = parseInt(value);
        }
        if (key === 'issue_creator_gh') {
          searchParams['search.issue_creator_gh'] = parseInt(value);
        }
        if (key === 'issue_tags') {
          searchParams['search.issue_tags'] = value;
        }
        if (key === 'order_by') {
          searchParams['filter.order_by'] = value;
        }
      } else if (!search.includes(':') && !search.includes(';')) {
        searchParams['search.issue_title'] = search.trim();
      }
    }
    axios
      .get('https://api-v1.defi-os.com/issues', {
        params: searchParams,
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setIssuesData(res.data.issues);
        setIsLoading(false);
      })
      .catch((err) => console.log(err.message));
    setInitExpand(false);
  }, [isMine, firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (triggerSearch === true) {
      setIsLoading(true);
      const searchParams: any = {
        'filter.pageno': '1',
        'filter.pagesize': 30,
      };
      if (isMine) {
        searchParams['filter.mine'] = true;
      }
      if (search !== '') {
        if (search.includes(';')) {
          const searchArray = search.trim().split(';');
          searchArray.map((item) => {
            const [key, value] = item.trim().split(':');
            if (key === 'id') {
              searchParams['first_id'] = value;
            }
            if (key === 'issue_project_id') {
              searchParams['search.issue_project_id'] = value;
            }
            if (key === 'issue_project_name') {
              searchParams['search.issue_project_name'] = value;
            }
            if (key === 'issue_state') {
              searchParams['search.issue_state'] = value;
            }
            if (key === 'issue_stake_amount') {
              searchParams['search.issue_stake_amount'] = parseInt(value);
            }
            if (key === 'issue_stake_token_symbol') {
              searchParams['search.issue_stake_token_symbol'] = value;
            }
            if (key === 'issue_num_prs') {
              searchParams['search.issue_num_prs'] = parseInt(value);
            }
            if (key === 'issue_creator_gh') {
              searchParams['search.issue_creator_gh'] = parseInt(value);
            }
            if (key === 'issue_tags') {
              searchParams['search.issue_tags'] = value;
            }
            if (key === 'order_by') {
              searchParams['filter.order_by'] = value;
            }
          });
        } else if (search.includes(':') && !search.includes(';')) {
          const [key, value] = search.trim().split(':');
          if (key === 'id') {
            searchParams['first_id'] = value;
          }
          if (key === 'issue_project_id') {
            searchParams['search.issue_project_id'] = value;
          }
          if (key === 'issue_project_name') {
            searchParams['search.issue_project_name'] = value;
          }
          if (key === 'issue_state') {
            searchParams['search.issue_state'] = value;
          }
          if (key === 'issue_stake_amount') {
            searchParams['search.issue_stake_amount'] = parseInt(value);
          }
          if (key === 'issue_stake_token_symbol') {
            searchParams['search.issue_stake_token_symbol'] = value;
          }
          if (key === 'issue_num_prs') {
            searchParams['search.issue_num_prs'] = parseInt(value);
          }
          if (key === 'issue_creator_gh') {
            searchParams['search.issue_creator_gh'] = parseInt(value);
          }
          if (key === 'issue_tags') {
            searchParams['search.issue_tags'] = value;
          }
          if (key === 'order_by') {
            searchParams['filter.order_by'] = value;
          }
        } else if (!search.includes(':') && !search.includes(';')) {
          searchParams['search.issue_title'] = search.trim();
        }
      }

      axios
        .get('https://api-v1.defi-os.com/issues', {
          params: searchParams,
          headers: {
            Authorization: firebase_jwt,
          },
        })
        .then((res) => {
          setIssuesData(res.data.issues);
          setIsLoading(false);
          setTriggerSearch(false);
        })
        .catch((err) => console.log(err.message));
    }
    setInitExpand(false);
  }, [triggerSearch, firebase_jwt]);

  useEffect(() => {
    if (issuesData.length === 0) return;
    if (searchQuery !== '' && setSearchQuery) {
      setSearch(searchQuery);
      setInitExpand(expandFirst);
      setTriggerSearch(true);
      dispatch(reset());
    }
  }, [issuesData, searchQuery, setSearchQuery, expandFirst, dispatch]);

  return (
    <>
      <NextSeo
        title="Issues"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="flex items-center justify-start">
        <div className="flex h-full w-full flex-col">
          <div className="mb-2 flex w-full items-center gap-5">
            <Search
              placeholder="Search Issues"
              search={search}
              setSearch={setSearch}
              setTriggerSearch={setTriggerSearch}
            />
            <div className="w-52">
              <StackedSwitch
                isStacked={isMine}
                setIsStacked={setIsMine}
                label="My Issues"
              />
            </div>
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
          {!isLoading &&
            issuesData?.length !== 0 &&
            issuesData.map((issue: any, idx: number) => (
              <IssuesList
                data={issue}
                key={idx}
                initExpand={idx == 0 ? initExapand : false}
              >
                {issue?.issue_state === 'open' && (
                  <OpenIssueExpand
                    issueDesc={issue?.issue_summary}
                    link={issue?.issue_gh_url}
                  />
                )}
                {issue?.issue_state === 'voting' && (
                  <VotingExpand PRData={issue?.issue_prs} />
                )}
                {issue?.issue_state === 'winner_declared' && (
                  <WinnerDeclaredExpand data={issue} />
                )}
                {issue?.issue_state === 'closed' && (
                  <ClosedIssueExpand data={issue} />
                )}
              </IssuesList>
            ))}
          {!isLoading && issuesData.length === 0 && (
            <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
              <Image src={ErrorDarkImage} className="w-80" alt="404 Error" />
              <div className="text-lg text-gray-500">
                No Issues found that match your filter and search settings
              </div>
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
                  Create New Issue
                </div>
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="mt-10 flex h-full w-full items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IssuesPage;
