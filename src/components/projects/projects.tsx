import Button from '@/components/ui/button';
import ProjectList from '@/components/projects/list';
import ActiveLink from '@/components/ui/links/active-link';
import React, { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import { ChevronDown } from '@/components/icons/chevron-down';
import { SearchIcon } from '@/components/icons/search';
import routes from '@/config/routes';
import { PlusCircle } from '../icons/plus-circle';
import PriceChart from '@/components/ui/chats/price-chart';
import CoinTicker from '@/components/custom/coin-ticker';
import DataWithImage from '@/components/custom/data-with-image';
import StackedSwitch from '@/components/custom/stacked-switch';
import EmptyList from '@/components/icons/EmptyList';
import Spinner from '@/components/custom/spinner';
import { Close } from '@/components/icons/close';

import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { reset } from '@/store/notifClickSlice';
import { clicked } from '@/store/notifClickSlice';

import { Tooltip } from 'flowbite-react';
import { InfoCircle } from '@/components/icons/info-circle';
import { claimTokens } from '@/lib/helpers/contractInteract';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { PublicKey } from '@solana/web3.js';

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
        <Listbox.Button className="flex h-11 w-full items-center justify-between rounded-lg bg-light-dark px-4 text-sm text-white md:w-36 lg:w-40 xl:w-48">
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
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-lg bg-[rgba(0,0,0,0.5)] p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-white transition  ${
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
  const tooltipVal =
    'direct project name \nsearch or using keys\n====Search==>\n<key>:<value> separated by ;\n====keys==>\nid, num_open_issues,\ntop_supporter_name,\ntokens_staked,\nproject_owner_github,\ninternal_tags';
  return (
    <div className="relative flex w-full items-center rounded-full ">
      <label className="relative flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-600 bg-transparent py-1 pr-5 pl-5 text-sm tracking-tighter text-white outline-none transition-all placeholder:text-gray-500 focus:border-gray-500"
          placeholder="Search Projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        <Close
          onClick={() => setSearch('')}
          className="absolute right-3 h-4 w-4"
        />
      </label>
      <Button
        shape="rounded"
        size="small"
        className="mx-2 mr-5 flex items-center justify-center"
        onClick={() => setTriggerSearch(true)}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      <Tooltip
        content={tooltipVal}
        placement="right-start"
        style="light"
        className="!whitespace-pre-wrap"
        arrow={false}
      >
        <InfoCircle />
      </Tooltip>
    </div>
  );
};

export default function Projects() {
  const router = useRouter();
  const { data: session } = useSession();
  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);

  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<any>(sort[0]);
  const [isMine, setIsMine] = useState(false);
  const [isNative, setIsNative] = useState(false);

  const [triggerSearch, setTriggerSearch] = useState(false);

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
    axios
      .get('https://api-v1.defi-os.com/projects', {
        params: {
          'filter.pageno': '1',
          'filter.pagesize': 30,
        },
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        getAllImgUrls(res.data.projects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, [firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 30,
      'filter.order_by': orderBy.order_by,
    };
    if (isNative) {
      searchParams['search.is_token_native'] = true;
    }
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
      .get('https://api-v1.defi-os.com/projects', {
        params: searchParams,
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        getAllImgUrls(res.data.projects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
    setInitExpand(false);
  }, [isNative, isMine, orderBy, firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (triggerSearch === true) {
      setIsLoading(true);
      const searchParams: any = {
        'filter.pageno': '1',
        'filter.pagesize': 30,
        'filter.order_by': orderBy.order_by,
      };
      if (isNative) {
        searchParams['search.is_token_native'] = true;
      }
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
        .get('https://api-v1.defi-os.com/projects', {
          params: searchParams,
          headers: {
            Authorization: firebase_jwt,
          },
        })
        .then((res) => {
          getAllImgUrls(res.data.projects);
          setIsLoading(false);
          setTriggerSearch(false);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
          setTriggerSearch(false);
        });
    }
    setInitExpand(false);
  }, [triggerSearch, firebase_jwt]);

  const getAllImgUrls = async (data: any) => {
    const projects = data;
    const newProjects = await Promise.all(
      await projects.map(async (project: any): Promise<any> => {
        const _project = project;
        const _url = _project?.project_token?.token_image_url;
        const IpfsNewGateway = _url.replace('gateway.pinata.cloud', 'ipfs.io');
        await axios
          .get(IpfsNewGateway)
          .then((res) => {
            if (typeof res.data === 'object') {
              if (res.data.image) {
                _project.project_token.token_image_url = res.data.image;
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return _project;
      })
    );
    setProjectsData(newProjects);
  };

  const getChartData = async () => {
    const projects = projectsData;
    const newProjects = await Promise.all(
      await projects.map(async (item: any): Promise<any> => {
        const priceData = await axios
          .post('/api/chart', {
            data_url: item?.project_token?.token_price_feed,
          })
          .then((res) => res.data)
          .catch((err) => console.log(err.message));
        const communityHealthData = await axios
          .post('/api/chart', { data_url: item?.community_health_graph })
          .then((res) => res.data)
          .catch((err) => console.log(err.message));
        const contributionsData = await axios
          .post('/api/chart', {
            data_url: item?.num_contributions_graph,
          })
          .then((res) => res.data)
          .catch((err) => console.log(err.message));
        item.project_token.token_price_feed = priceData;
        item.community_health_graph = communityHealthData;
        item.num_contributions_graph = contributionsData;
        return item;
      })
    );
    setProjectsData(newProjects);
  };

  useEffect(() => {
    if (projectsData.length === 0) return;
    if (typeof projectsData[0].community_health_graph !== 'string') return;
    getChartData();
  }, [projectsData]);

  useEffect(() => {
    if (projectsData.length === 0) return;
    if (searchQuery !== '' && setSearchQuery && clickPathname === '/projects') {
      setSearch(searchQuery);
      setInitExpand(expandFirst);
      setTriggerSearch(true);
      dispatch(reset());
    }
  }, [projectsData, searchQuery, setSearchQuery, expandFirst, dispatch]);

  const claimPendingTokens = (project: any) => {
    claimTokens(
      //@ts-ignore
      session?.user.id,
      wallet.publicKey as PublicKey,
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      new PublicKey(project.account) // Pass here the project account
    );
  };

  return (
    <div className="mx-auto w-full">
      <div className="mb-5 flex w-full items-center justify-between">
        <div className="w-[50%]">
          <Search
            search={search}
            setSearch={setSearch}
            setTriggerSearch={setTriggerSearch}
          />
        </div>
        <div className="flex items-center justify-between gap-6">
          <div>
            <StackedSwitch
              isStacked={isMine}
              setIsStacked={setIsMine}
              label="My Projects"
            />
          </div>
          <div>
            <StackedSwitch
              isStacked={isNative}
              setIsStacked={setIsNative}
              label="Native Tokens Only"
            />
          </div>
          <SortList selectedItem={orderBy} setSelectedItem={setOrderBy} />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-8 gap-6 rounded-lg border-b-2 border-gray-500 bg-light-dark shadow-card">
        <span className="col-span-2 px-6 py-6 text-xs tracking-wider text-gray-300 sm:text-sm">
          Name
        </span>
        <span className="py-6 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
          Open Issues
        </span>
        <span className="py-6 text-center text-xs tracking-wider text-gray-300 sm:text-sm">
          Repository Status
        </span>
        <span className="col-span-2 py-6 text-center text-xs tracking-wider text-gray-300 sm:text-sm ">
          Liquidity
        </span>
        <span className="col-span-2 py-6 text-center text-xs tracking-wider text-gray-300 sm:text-sm ">
          Top Contributors
        </span>
      </div>

      {!isLoading &&
        projectsData.length !== 0 &&
        projectsData.map((project: any, idx: number) => (
          <ProjectList
            initExpand={idx == 0 ? initExapand : false}
            key={idx}
            data={project}
          >
            <div className="mb-2 flex flex-row items-center justify-between text-sm">
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
            </div>
            <div className="mb-6 grid grid-cols-3 gap-3 text-sm">
              <ActiveLink href={routes.projects}>
                <Button shape="rounded" fullWidth size="medium">
                  Explore Related Roadmaps
                </Button>
              </ActiveLink>
              <Button
                onClick={() => {
                  if (project?._id) {
                    const payload = {
                      searchQuery: `issue_project_id:${project?._id};state:open`,
                      setSearchQuery: true,
                      expandFirst: false,
                      pathname: '/issues',
                    };
                    dispatch(clicked(payload));
                  }
                  router.push('/issues');
                }}
                shape="rounded"
                color="info"
                fullWidth
                size="medium"
              >
                Explore Open Issues
              </Button>
              <ActiveLink href={routes.projects}>
                <Button
                  shape="rounded"
                  color="success"
                  fullWidth
                  size="medium"
                  onClick={() => {
                    claimPendingTokens(project);
                  }}
                >
                  Claim Pending Tokens
                </Button>
              </ActiveLink>
            </div>
          </ProjectList>
        ))}
      {!isLoading && projectsData.length === 0 && (
        <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
          <EmptyList />
          <div className="text-lg text-gray-500">
            No projects found that match your filter and search settings
          </div>
          <Button
            onClick={() => router.push('incentivize-contributors')}
            shape="rounded"
            size="small"
            color="info"
          >
            <div className="flex items-center gap-2">
              <PlusCircle />
              <div>Create New Project</div>
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
  );
}
