import Button from '@/components/ui/button/ButtonNew';
import ProjectList from '@/components/projects/list';
import ActiveLink from '@/components/ui/links/active-link';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import { ChevronDown } from '@/components/icons/chevron-down';
import routes from '@/config/routes';
import { PlusCircle } from '@/components/icons/plus-circle';
import PriceChart from '@/components/ui/chats/price-chart';
import CoinTicker from '@/components/custom/coin-ticker';
import DataWithImage from '@/components/custom/data-with-image';
import StackedSwitch from '@/components/custom/stacked-switch';
import EmptyList from '@/components/icons/EmptyList';
import Spinner from '@/components/custom/spinner';
import Input from '@/components/ui/forms/input';
import CreateProjectBtn from '@/components/projects/CreateProjectBtn';

import _debounce from 'lodash/debounce';
import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { reset } from '@/store/notifClickSlice';
import { clicked } from '@/store/notifClickSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

import { Tooltip } from 'flowbite-react';
import { InfoCircle } from '@/components/icons/info-circle';
import { unlockTokens } from '@/lib/helpers/contractInteract';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { PublicKey } from '@solana/web3.js';

import mixpanel from 'mixpanel-browser';

const sort = [
  { id: 0, name: 'Hot', order_by: '-num_open_issues' },
  { id: 1, name: 'Urgent', order_by: '-num_open_issues' },
  { id: 2, name: 'Total Staked', order_by: '-num_open_issues' },
  { id: 3, name: 'Latest', order_by: '-num_open_issues' },
];

interface SortListProps {
  selectedItem: any;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
}

const SortList: React.FC<SortListProps> = ({
  selectedItem,
  setSelectedItem,
}) => {
  return (
    <div className="relative w-full lg:w-auto">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl bg-light-dark px-4 text-2xs text-white md:w-36 lg:w-40 xl:w-48 xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
          {selectedItem.name}
          <ChevronDown />
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-[rgba(0,0,0,0.5)] p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-xl px-3 py-2 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setTriggerSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<SearchProps> = ({
  search,
  setSearch,
  setTriggerSearch,
}) => {
  const handleDebounceFn = () => {
    setTriggerSearch(true);
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 500), []);

  const tooltipVal =
    'direct project name \nsearch or using keys\n====Search==>\n<key>:<value> separated by ;\n====keys==>\nid, num_open_issues,\ntop_supporter_name,\ntokens_staked,\nproject_owner_github,\ninternal_tags';
  return (
    <div className="relative flex w-full items-center rounded-full ">
      <Input
        className="w-full"
        placeholder="search projects"
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
        className="m-2 !whitespace-pre-wrap text-black"
        arrow={false}
      >
        <InfoCircle className="ml-4" />
      </Tooltip>
    </div>
  );
};

export default function Projects() {
  const router = useRouter();
  const { data: session } = useSession();
  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<any>(sort[0]);
  const [isNative, setIsNative] = useState(false);

  //new filters
  const [newProjects, setNewProjects] = useState(false);
  const [myProjects, setMyProjects] = useState(false);
  const [duration, setDuration] = useState<'1D' | '7D' | '30D' | 'ALL' | null>(
    null
  );
  const [filter, setFilter] = useState(false);
  const [favorites, setFavorites] = useState(false);

  const [triggerSearch, setTriggerSearch] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [initExapand, setInitExpand] = useState(false);
  const searchQuery = useAppSelector((state) => state.notifClick.searchQuery);
  const setSearchQuery = useAppSelector(
    (state) => state.notifClick.setSearchQuery
  );
  const expandFirst = useAppSelector((state) => state.notifClick.expandFirst);
  const clickPathname = useAppSelector((state) => state.notifClick.pathname);

  const dispatch = useAppDispatch();

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [projectsData, setProjectsData] = useState<any>([]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 50,
      'filter.order_by': orderBy.order_by,
    };
    if (isNative) {
      searchParams['search.is_token_native'] = true;
    }
    if (myProjects) {
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
          if (key === 'num_open_issues') {
            searchParams['search.num_open_issues'] = parseInt(value);
          }
          if (key === 'top_supporter_name') {
            searchParams['search.top_supporter_name'] = value;
          }
          if (key === 'internal_tags') {
            searchParams['search.internal_tags'] = value;
          }
          if (key === 'tokens_staked') {
            searchParams['search.tokens_staked'] = parseInt(value);
          }
          if (key === 'project_owner_github') {
            searchParams['search.project_owner_github'] = parseInt(value);
          }
        });
      } else if (search.includes(':') && !search.includes(';')) {
        const [key, value] = search.trim().split(':');
        if (key === 'id') {
          searchParams['first_id'] = value;
        }
        if (key === 'num_open_issues') {
          searchParams['search.num_open_issues'] = parseInt(value);
        }
        if (key === 'top_supporter_name') {
          searchParams['search.top_supporter_name'] = value;
        }
        if (key === 'internal_tags') {
          searchParams['search.internal_tags'] = value;
        }
        if (key === 'tokens_staked') {
          searchParams['search.tokens_staked'] = parseInt(value);
        }
        if (key === 'project_owner_github') {
          searchParams['search.project_owner_github'] = parseInt(value);
        }
      } else if (!search.includes(':') && !search.includes(';')) {
        searchParams['search.project_name'] = search.trim();
      }
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/projects`, {
        params: searchParams,
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setProjectsData(res.data.projects);
        setIsLoading(false);
        setTriggerSearch(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        setTriggerSearch(false);
      });
    setInitExpand(false);
  }, [fetchTrigger, firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setFetchTrigger(fetchTrigger + 1);
  }, [isNative, myProjects, orderBy, triggerSearch, firebase_jwt]);

  useEffect(() => {
    if (projectsData.length === 0) return;
    if (searchQuery !== '' && setSearchQuery && clickPathname === '/projects') {
      setSearch(searchQuery);
      setInitExpand(expandFirst);
      setFetchTrigger(fetchTrigger + 1);
      dispatch(reset());
    }
  }, [projectsData, searchQuery, setSearchQuery, expandFirst, dispatch]);

  const claimPendingTokens = (project: any) => {
    let resCalled = false;
    dispatch(onLoading('Claiming Pending Tokens on the Project...'));
    unlockTokens(
      new PublicKey(project.project_account),
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(project.project_token.token_spl_addr)
    )
      .then((res: any) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: 'Pending Token Claim Successful',
            description: 'Check out your token claim at',
            redirect: null,
            link: res
              ? `https://solscan.io/tx/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Token Unlock Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          project_account: project.project_account,
          repo_github_id: project.project_github_id,
          repo_github_url: project.project_repo_link,
          token_address: project.project_token.token_spl_addr,
          token_symbol: project.project_token.token_symbol,
        });
        setTriggerSearch(true);
      })
      .catch((err: any) => {
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Pending Token Claim Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Token Unlock Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
        setTriggerSearch(true);
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Pending Token Claim Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Token Unlock Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          setTriggerSearch(true);
        }
      });
  };

  return (
    <div className="mx-auto flex w-full flex-col">
      <div className="flex h-[15rem] w-full flex-col justify-between rounded-3xl bg-[#7CAA8E] p-12">
        <div className="w-[50%] text-2xl font-bold xl:text-3xl 3xl:text-4xl">
          projects
        </div>
        <div className="w-[50%] text-base xl:text-lg 3xl:text-xl">
          claim the tokens for your own project.
          <br />
          explore what other projects are working
          <br />
          on and how communities are working.
        </div>
      </div>
      <div className="my-12">
        <CreateProjectBtn />
      </div>

      <div className="flex w-full items-center gap-8">
        <div
          className={cn(
            'cursor-pointer whitespace-pre text-sm font-semibold uppercase xl:text-base 3xl:text-lg',
            {
              'text-gray-400': !newProjects,
              'textShadow text-primary': newProjects,
            }
          )}
          onClick={() => setNewProjects(!newProjects)}
        >
          New Projects
        </div>
        <div
          className={cn(
            'cursor-pointer whitespace-pre text-sm font-semibold uppercase xl:text-base 3xl:text-lg',
            {
              'text-gray-400': !myProjects,
              'textShadow text-primary': myProjects,
            }
          )}
          onClick={() => setMyProjects(!myProjects)}
        >
          My Projects
        </div>
        <div className="flex gap-2 whitespace-pre text-sm font-semibold uppercase xl:text-base 3xl:text-lg">
          <div
            className={cn('cursor-pointer whitespace-pre ', {
              'text-gray-400': duration !== '1D',
              'textShadow text-primary': duration === '1D',
            })}
            onClick={() => setDuration(duration === '1D' ? null : '1D')}
          >
            1D
          </div>
          <div
            className={cn('cursor-pointer whitespace-pre ', {
              'text-gray-400': duration !== '7D',
              'textShadow text-primary': duration === '7D',
            })}
            onClick={() => setDuration(duration === '7D' ? null : '7D')}
          >
            7D
          </div>
          <div
            className={cn('cursor-pointer whitespace-pre ', {
              'text-gray-400': duration !== '30D',
              'textShadow text-primary': duration === '30D',
            })}
            onClick={() => setDuration(duration === '30D' ? null : '30D')}
          >
            30D
          </div>
          <div
            className={cn('cursor-pointer whitespace-pre ', {
              'text-gray-400': duration !== 'ALL',
              'textShadow text-primary': duration === 'ALL',
            })}
            onClick={() => setDuration(duration === 'ALL' ? null : 'ALL')}
          >
            ALL
          </div>
        </div>
        <Search
          search={search}
          setSearch={setSearch}
          setTriggerSearch={setTriggerSearch}
        />
        <div
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
        </div>
      </div>

      <div className="my-3 grid grid-cols-11 gap-6 border-b border-gray-600 bg-newdark text-base font-semibold shadow-card xl:text-lg 2xl:text-xl">
        <div></div>
        <span className="col-span-7 px-6 py-3 tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
          project
        </span>
        <span className="flex flex-col items-center justify-center gap-1 py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
          <div>issues</div>
          <div className="text-xs xl:text-sm 3xl:text-base">(#,ALL)</div>
        </span>
        <span className="flex flex-col items-center justify-center gap-1 py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
          <div>staked</div>
          <div className="text-xs xl:text-sm 3xl:text-base">($,ALL)</div>
        </span>
        <span className="flex flex-col items-center justify-center gap-1 py-3 text-center tracking-wider text-gray-300 xl:py-3.5 3xl:py-4">
          <div>rewarded</div>
          <div className="text-xs xl:text-sm 3xl:text-base">($,ALL)</div>
        </span>
      </div>

      {!isLoading &&
        projectsData.length !== 0 &&
        projectsData.map((project: any, idx: number) => (
          <ProjectList
            initExpand={idx === 0 ? initExapand : false}
            key={idx}
            data={project}
          >
            {/* <div className="mb-2 flex flex-row items-center justify-between text-sm">
              <div className="flex w-[30%]">
                <CoinTicker
                  value={
                    Math.round(project?.project_token?.token_ltp * 100) / 100
                  }
                  coin={project?.project_token}
                  change={(
                    Math.round(
                      project?.project_token?.token_ltp_24h_change * 100
                    ) / 100
                  ).toString()}
                />
                <div className="w-full">
                  <PriceChart
                    chartData={
                      typeof project?.project_token?.token_price_feed !==
                      'string'
                        ? project?.project_token?.token_price_feed?.data
                        : null
                    }
                    change={
                      project?.project_token?.token_price_feed?.change || '+'
                    }
                  />
                </div>
              </div>
              <div className="flex w-[30%]">
                <DataWithImage
                  image="health"
                  header="Community Health"
                  value={project?.community_health}
                />
                <div className="w-full">
                  <PriceChart
                    chartData={
                      typeof project?.community_health_graph !== 'string'
                        ? project?.community_health_graph?.data
                        : null
                    }
                    change={project?.community_health_graph?.change || '+'}
                  />
                </div>
              </div>
              <div className="flex w-[30%]">
                <DataWithImage
                  image="handshake"
                  header="Contributions"
                  value={project?.num_contributions?.toString()}
                  change={(
                    Math.round(project?.num_contributions_chg_perc * 100) / 100
                  ).toString()}
                />
                <div className="w-full">
                  <PriceChart
                    chartData={
                      typeof project?.num_contributions_graph !== 'string'
                        ? project?.num_contributions_graph?.data
                        : null
                    }
                    change={project?.num_contributions_graph?.change || '+'}
                  />
                </div>
              </div>
            </div> */}
            <div className="my-6 grid grid-cols-3 gap-3 text-sm">
              <Button
                fullWidth={true}
                onClick={() => {
                  if (project?.project_account) {
                    const payload = {
                      searchQuery: `project_account:${project?.project_account}`,
                      setSearchQuery: true,
                      expandFirst: false,
                      pathname: '/roadmaps',
                    };
                    dispatch(clicked(payload));
                  }
                  router.push('/roadmaps');
                }}
              >
                Explore Related Roadmaps
              </Button>
              <Button
                fullWidth={true}
                onClick={() => {
                  if (project?.project_account) {
                    const payload = {
                      searchQuery: `issue_project_id:${project?.project_account};state:open`,
                      setSearchQuery: true,
                      expandFirst: false,
                      pathname: '/issues',
                    };
                    dispatch(clicked(payload));
                  }
                  router.push('/issues');
                }}
              >
                Explore Open Issues
              </Button>
              <Button
                fullWidth={true}
                color="GreenOutline"
                onClick={() => {
                  claimPendingTokens(project);
                }}
              >
                Claim Pending Tokens
              </Button>
            </div>
          </ProjectList>
        ))}
      {!isLoading && projectsData.length === 0 && (
        <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
          <EmptyList />
          <div className="text-lg text-gray-500">
            No projects found that match your filter and search settings
          </div>
          <div className="mt-12">
            <CreateProjectBtn />
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-10 flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
