import React, {
  useEffect,
  useState,
  useCallback,
  // useMemo,
  // useRef,
} from 'react';

import axios from '@/lib/axiosClient';
import _debounce from 'lodash/debounce';
import cn from 'classnames';
import Link from 'next/link';
//layout
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

//UI components
import Button from '@/components/ui/button/ButtonNew';
import Input from '@/components/ui/forms/input';
import Spinner from '@/components/custom/spinner';
import { Tooltip } from 'flowbite-react';
import { useDrawer } from '@/components/drawer-views/context';
import CreateIssueBtn from '@/components/issues/createIssueBtn';

//Icons
import { InfoCircle } from '@/components/icons/info-circle';
import EmptyList from '@/components/icons/EmptyList';
import { PlusCircle } from '@/components/icons/plus-circle';

//Components
import IssuesList from '@/components/issues/list';

//redux store
import { useAppSelector, useAppDispatch } from '@/store/store';
import { reset } from '@/store/notifClickSlice';
import { resetRefetch } from '@/store/refetchSlice';

import mixpanel from 'mixpanel-browser';

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
      {/* <Tooltip
        content={tooltipVal}
        placement="right-start"
        style="light"
        className="!whitespace-pre-wrap text-black"
        arrow={false}
      >
        <InfoCircle className="ml-4" />
      </Tooltip> */}
    </div>
  );
};

interface ProjectIssuessProps {
  project_account: string;
}

const ProjectIssues: React.FC<ProjectIssuessProps> = ({ project_account }) => {
  mixpanel.track_pageview();
  //right sidebar (new issue) trigger
  const { openDrawer } = useDrawer();

  //loading spinner
  const [isLoading, setIsLoading] = useState(true);

  //search input , triggers
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  //issue choose states
  const [newIssues, setNewIssues] = useState(false);
  const [showClosedIssues, setShowClosedIssues] = useState(false);
  const [filter, setFilter] = useState(false);
  const [favorites, setFavorites] = useState(false);

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
  const [stakeOrder, setStakeOrder] = useState('');

  //adds filters,search,page and fetches
  useEffect(() => {
    if (
      project_account === undefined ||
      project_account === null ||
      project_account === ''
    )
      return;
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    // pagination
    const searchParams: any = {
      'filter.pageno': 1,
      'filter.pagesize': 50,
      'search.issue_project_id': project_account,
    };
    //filters
    if (stakeOrder !== '') {
      searchParams['filter.order_by'] = `${
        stakeOrder === '-' ? '-' : ''
      }issue_stake_amount`;
    }
    if (!showClosedIssues) {
      searchParams['search.issue_state'] = 'open';
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
          if (key === 'issue_project_name') {
            searchParams['search.issue_project_name'] = value;
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
        if (key === 'issue_project_name') {
          searchParams['search.issue_project_name'] = value;
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
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/issues`, {
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
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        setTriggerSearch(false);
      });
    setInitExpand(false);
  }, [fetchTrigger, firebase_jwt, project_account]);

  //triggers refetch when any of filters,search is changed from page1
  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    // setPage(1);
    // setDonePagination(false);
    setFetchTrigger(fetchTrigger + 1);
  }, [stakeOrder, showClosedIssues, triggerSearch, firebase_jwt]);

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
      setTimeout(() => setFetchTrigger(fetchTrigger + 1), 1500);
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

  return (
    <div className="landing-font flex items-center justify-start">
      <div className="relative flex h-full w-full flex-col">
        <div className="flex w-full items-center gap-8">
          <div
            className={cn(
              'cursor-pointer whitespace-pre text-sm font-semibold uppercase xl:text-base 3xl:text-lg',
              {
                'text-gray-400': !showClosedIssues,
                'textShadow text-primary': showClosedIssues,
              }
            )}
            onClick={() => setShowClosedIssues(!showClosedIssues)}
          >
            Show Closed Issues
          </div>
          <Search
            placeholder="search issues"
            search={search}
            setSearch={setSearch}
            setTriggerSearch={setTriggerSearch}
          />
          {/* <div
              className={cn(
                'cursor-pointer whitespace-pre text-sm font-semibold uppercase xl:text-base 3xl:text-lg',
                {
                  'text-gray-400': !filter,
                  'textShadow text-primary': filter,
                }
              )}
              onClick={() => setFilter(!filter)}
            >
              Filter
            </div>
            <div
              className={cn(
                'cursor-pointer whitespace-pre text-sm font-semibold uppercase xl:text-base 3xl:text-lg',
                {
                  'text-gray-400': !favorites,
                  'textShadow text-primary': favorites,
                }
              )}
              onClick={() => setFavorites(!favorites)}
            >
              Favorites
            </div> */}
        </div>
        <div className="my-3 grid grid-cols-7 gap-6 border-b border-gray-600 bg-newdark text-base font-semibold shadow-card xl:text-lg 2xl:text-xl">
          <div></div>
          <span className="col-span-5 px-6 py-3 tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
            issue title
          </span>
          <span className="flex flex-col items-center justify-center gap-1 py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
            <div className="textShadow text-primary">rewards</div>
            <div className="text-xs xl:text-sm 3xl:text-base">($)</div>
          </span>
        </div>
        {issuesData?.length !== 0 &&
          issuesData.map((issue: any, idx: number) => (
            <IssuesList data={issue} key={issue._id} />
          ))}
        {!isLoading && issuesData.length === 0 && (
          <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
            <EmptyList />
            <div className="text-lg text-gray-500">
              No Issues found that match your filter and search settings
            </div>
            <Link href={'/issues/create'}>
              <Button color="PrimarySolid">
                <div className="flex flex-row items-center justify-center gap-2">
                  <PlusCircle />
                  Create New Issue
                </div>
              </Button>
            </Link>
          </div>
        )}
        {isLoading && (
          <div className="mt-10 flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIssues;
