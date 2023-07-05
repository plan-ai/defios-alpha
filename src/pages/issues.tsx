import React, {
  useEffect,
  useState,
  useCallback,
  // useMemo,
  // useRef,
} from 'react';

import axios from '@/lib/axiosClient';
import _debounce from 'lodash/debounce';

//layout
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

//UI components
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import StackedSwitch from '@/components/custom/stacked-switch';
import Spinner from '@/components/custom/spinner';
import { Tooltip } from 'flowbite-react';
import { useDrawer } from '@/components/drawer-views/context';

//Icons
import { InfoCircle } from '@/components/icons/info-circle';
import EmptyList from '@/components/icons/EmptyList';
import { PlusCircle } from '@/components/icons/plus-circle';
import {
  FunnelIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

//Components
import IssuesList from '@/components/issues/list';
import OpenIssueExpand from '@/components/issues/open-issues-expand';
import ClosedIssueExpand from '@/components/issues/closed-issue-expand';

//redux store
import { useAppSelector, useAppDispatch } from '@/store/store';
import { reset } from '@/store/notifClickSlice';
import { resetRefetch } from '@/store/refetchSlice';

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
  //debounce,denounce for searchbar
  const handleDebounceFn = () => {
    setTriggerSearch(true);
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 500), []);

  const tooltipVal =
    'direct issue title search or using keys\n====Search==>\n<key>:<value> separated by ;\n====keys==>\nid,\nissue_project_id,\nissue_project_name,\nstate,\nstake_amount,\nstake_token_symbol,\nnum_prs,\ncreator_gh,\nissue_tags';
  return (
    <div className="relative flex w-full items-center rounded-full">
      <Input
        className="w-full"
        placeholder={placeholder || 'Search'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
        search={true}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            debounceFn();
          }
        }}
      />
      <Tooltip
        content={tooltipVal}
        placement="right-start"
        style="light"
        className="!whitespace-pre-wrap text-black"
        arrow={false}
      >
        <InfoCircle className="ml-4" />
      </Tooltip>
    </div>
  );
};

const IssuesPage: NextPageWithLayout = () => {
  //right sidebar (new issue) trigger
  const { openDrawer } = useDrawer();

  //loading spinner
  const [isLoading, setIsLoading] = useState(true);

  //search input , triggers
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  //redirect to page and query search
  const searchQuery = useAppSelector((state) => state.notifClick.searchQuery);
  const setSearchQuery = useAppSelector(
    (state) => state.notifClick.setSearchQuery
  );
  const expandFirst = useAppSelector((state) => state.notifClick.expandFirst);
  const [initExapand, setInitExpand] = useState(false);
  const clickPathname = useAppSelector((state) => state.notifClick.pathname);
  const refetchPart = useAppSelector((state) => state.refetch.refetchPart);

  //redux
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  //fetched data
  const [issuesData, setIssuesData] = useState<any>([]);

  //filters
  const [isMine, setIsMine] = useState(false);
  const [stakeOrder, setStakeOrder] = useState('');

  //pagination with intersection observer for infinite scroll
  // const [page, setPage] = useState(1);
  // const [donePagination, setDonePagination] = useState(false);
  // const observerTarget = useRef(null);

  //adds filters,search,page and fetches
  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    // pagination
    const searchParams: any = {
      'filter.pageno': 1,
      'filter.pagesize': 50,
    };
    //filters
    if (stakeOrder !== '') {
      searchParams['filter.order_by'] = `${
        stakeOrder === '-' ? '-' : ''
      }issue_stake_amount`;
    }
    if (isMine) {
      searchParams['filter.mine'] = true;
    }
    //search multiple
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
          if (key === 'state') {
            searchParams['search.issue_state'] = value;
          }
          if (key === 'stake_amount') {
            searchParams['search.issue_stake_amount'] = parseInt(value);
          }
          if (key === 'stake_token_symbol') {
            searchParams['search.issue_stake_token_symbol'] = value;
          }
          if (key === 'num_prs') {
            searchParams['search.issue_num_prs'] = parseInt(value);
          }
          if (key === 'creator_gh') {
            searchParams['search.issue_creator_gh'] = parseInt(value);
          }
          if (key === 'issue_tags') {
            searchParams['search.issue_tags'] = value;
          }
        });
      }
      //search single param
      else if (search.includes(':') && !search.includes(';')) {
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
        if (key === 'state') {
          searchParams['search.issue_state'] = value;
        }
        if (key === 'stake_amount') {
          searchParams['search.issue_stake_amount'] = parseInt(value);
        }
        if (key === 'stake_token_symbol') {
          searchParams['search.issue_stake_token_symbol'] = value;
        }
        if (key === 'num_prs') {
          searchParams['search.issue_num_prs'] = parseInt(value);
        }
        if (key === 'creator_gh') {
          searchParams['search.issue_creator_gh'] = parseInt(value);
        }
        if (key === 'issue_tags') {
          searchParams['search.issue_tags'] = value;
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
        // if (res.data.issues.length !== 0) {
          //first page
          // if (page === 1) {
          setIssuesData(res.data.issues);
          // } else {
          //   setIssuesData([...issuesData, ...res.data.issues]);
          // }
        // }
        //no more data to fetch end pagination
        // if (res.data.issues.length === 0) {
        //   setDonePagination(true);
        // }
        setIsLoading(false);
        setTriggerSearch(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        setTriggerSearch(false);
      });
    setInitExpand(false);
  }, [
    // page,
    fetchTrigger,
    firebase_jwt,
  ]);

  //triggers refetch when any of filters,search is changed from page1
  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    // setPage(1);
    // setDonePagination(false);
    setFetchTrigger(fetchTrigger + 1);
  }, [isMine, stakeOrder, triggerSearch, firebase_jwt]);

  //redux redirected searches
  useEffect(() => {
    if (issuesData.length === 0) return;
    if (searchQuery !== '' && setSearchQuery && clickPathname === '/issues') {
      setSearch(searchQuery);
      setInitExpand(expandFirst);
      setFetchTrigger(fetchTrigger + 1);
      dispatch(reset());
    }
    if (refetchPart === 'issue') {
      setFetchTrigger(fetchTrigger + 1);
      dispatch(resetRefetch());
    }
  }, [
    issuesData,
    searchQuery,
    setSearchQuery,
    expandFirst,
    dispatch,
    refetchPart,
  ]);

  //intersection observer for infinite scroll/pagination
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         // console.log(entry);
  //         if (entry.isIntersecting && !donePagination) {
  //           setPage(page + 1);
  //         }
  //       });
  //     },
  //     { threshold: 1.0 }
  //   );

  //   if (observerTarget.current) {
  //     observer.observe(observerTarget.current);
  //   }
  // }, [observerTarget]);

  //useMemo to avoid rerenders previous fetched items because of infinite fetches of data array.
  // const listPart = useMemo(() => {
  // return issuesData.map((issue: any, idx: number) => (
  //   <IssuesList
  //     data={issue}
  //     key={issue._id}
  //     initExpand={idx == 0 ? initExapand : false}
  //     last={issuesData.length === idx + 1}
  //     first={idx === 0}
  //   >
  //     {issue?.issue_state === 'open' && (
  //       <OpenIssueExpand
  //         issueDesc={issue?.issue_summary}
  //         link={issue?.issue_gh_url}
  //         account={issue?.issue_account}
  //         PRData={issue?.issue_prs}
  //         issueCreatorGH={issue?.issue_creator_gh}
  //         issueTokenAddress={issue?.issue_stake_token_url}
  //       />
  //     )}
  //     {issue?.issue_state === 'voting' && (
  //       <OpenIssueExpand
  //         issueDesc={issue?.issue_summary}
  //         link={issue?.issue_gh_url}
  //         account={issue?.issue_account}
  //         PRData={issue?.issue_prs}
  //         issueCreatorGH={issue?.issue_creator_gh}
  //         issueTokenAddress={issue?.issue_stake_token_url}
  //       />
  //     )}
  //     {issue?.issue_state === 'winner_declared' && (
  //       <ClosedIssueExpand data={issue} />
  //     )}
  //     {issue?.issue_state === 'closed' && <ClosedIssueExpand data={issue} />}
  //   </IssuesList>
  // ));
  // }, [issuesData]);

  return (
    <>
      <NextSeo
        title="Issues"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <div className="flex items-center justify-start">
        <div className="relative flex h-full w-full flex-col">
          <div className="mb-2 flex w-full items-center gap-5">
            <Search
              placeholder="search issues"
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
          <div className="my-3 grid grid-cols-7 items-center gap-6 rounded-xl border-b-3 border-gray-600 bg-light-dark text-2xs uppercase shadow-card xl:text-xs 2xl:text-sm">
            <span className="col-span-2 px-6 py-3 tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
              Issue Title
            </span>
            <span className="py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
              Issue State
            </span>
            <span className="py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
              Project Name
            </span>
            <span
              onClick={() => {
                setStakeOrder(
                  stakeOrder === '' ? '+' : stakeOrder === '+' ? '-' : ''
                );
              }}
              className="flex py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4"
            >
              Staked Tokens
              {stakeOrder === '' && (
                <FunnelIcon className="ml-2 h-4 w-4 text-white" />
              )}
              {stakeOrder === '+' && (
                <ChevronDownIcon className="ml-2 h-4 w-4 text-white" />
              )}
              {stakeOrder === '-' && (
                <ChevronUpIcon className="ml-2 h-4 w-4 text-white" />
              )}
            </span>
            <span className="col-span-2 py-3 px-6 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
              Tags
            </span>
          </div>
          {issuesData?.length !== 0 &&
            issuesData.map((issue: any, idx: number) => (
              <IssuesList
                data={issue}
                key={issue._id}
                initExpand={idx == 0 ? initExapand : false}
                last={issuesData.length === idx + 1}
                first={idx === 0}
              >
                {issue?.issue_state === 'open' && (
                  <OpenIssueExpand
                    issueDesc={issue?.issue_summary}
                    link={issue?.issue_gh_url}
                    account={issue?.issue_account}
                    PRData={issue?.issue_prs}
                    issueCreatorGH={issue?.issue_creator_gh}
                    issueTokenAddress={issue?.issue_stake_token_url}
                  />
                )}
                {issue?.issue_state === 'voting' && (
                  <OpenIssueExpand
                    issueDesc={issue?.issue_summary}
                    link={issue?.issue_gh_url}
                    account={issue?.issue_account}
                    PRData={issue?.issue_prs}
                    issueCreatorGH={issue?.issue_creator_gh}
                    issueTokenAddress={issue?.issue_stake_token_url}
                  />
                )}
                {issue?.issue_state === 'winner_declared' && (
                  <ClosedIssueExpand data={issue} />
                )}
                {issue?.issue_state === 'closed' && (
                  <ClosedIssueExpand data={issue} />
                )}
              </IssuesList>
            ))}
          {!isLoading && issuesData.length === 0 && (
            <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
              <EmptyList />
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

          {/* intersection element 40vh above from bottom of content */}
          {/* <div
            ref={observerTarget}
            className="absolute left-0 right-0 bottom-[40vh]"
          ></div> */}
        </div>
      </div>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IssuesPage;
