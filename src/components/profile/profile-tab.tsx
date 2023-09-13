import cn from 'classnames';
import React, { useState, useEffect, useCallback } from 'react';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import ContributionsHistory from '@/components/profile/contributions-history';
import ProfileProjectCard from '@/components/profile/profile-project-card';
import EmptyList from '@/components/icons/EmptyList';
import Spinner from '@/components/custom/spinner';
import Button from '../ui/button/button';
import { PlusCircle } from '../icons/plus-circle';
import { SearchIcon } from '@/components/icons/search';
import { useRouter } from 'next/router';
import Input from '@/components/ui/forms/input';

import GitHubCalendar from 'react-github-calendar';
import ReactTooltip from 'react-tooltip';

import _debounce from 'lodash/debounce';
import axios from '@/lib/axiosClient';
import { useAppSelector } from '@/store/store';
import { Close } from '@/components/icons/close';

import { Tooltip } from 'flowbite-react';
import { InfoCircle } from '@/components/icons/info-circle';

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
    'direct project name search \nor using keys\n====Search==>\n<key>:<value> separated by ;\n====keys==>\nid, num_open_issues,\ntop_supporter_name, tokens_staked,\nproject_owner_github, internal_tags';
  return (
    <div className="relative mb-5 flex w-full items-center rounded-full">
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
        placement="left-start"
        style="light"
        className="!whitespace-pre-wrap text-black"
        arrow={false}
      >
        <InfoCircle className="ml-4" />
      </Tooltip>
    </div>
  );
};

const tabMenu = [
  {
    title: 'Projects',
    path: 'projects',
  },
  {
    title: 'Contributions',
    path: 'contributions',
  },
  {
    title: 'Skills',
    path: 'skills',
    comingSoon: true,
  },
];

export default function ProfileTab() {
  const router = useRouter();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [projectsData, setProjectsData] = useState<any>([]);

  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/projects`, {
        params: {
          'filter.pageno': '1',
          'filter.pagesize': 30,
          'filter.mine': true,
        },
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setProjectsData(res.data.projects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, [firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (triggerSearch === true) {
      setIsLoading(true);
      const searchParams: any = {
        'filter.pageno': '1',
        'filter.pagesize': 30,
        'filter.mine': true,
      };
      if (search !== '') {
        if (search.includes(';')) {
          const searchArray = search.split(';');
          searchArray.map((item) => {
            const [key, value] = item.split(':');
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
          const [key, value] = search.split(':');
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
          searchParams['search.project_name'] = search;
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
    }
  }, [triggerSearch, firebase_jwt]);

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
        item.project_token.token_price_feed = priceData;
        return item;
      })
    );
    setProjectsData(newProjects);
  };

  useEffect(() => {
    if (projectsData.length === 0) return;
    if (typeof projectsData[0]?.project_token?.token_price_feed !== 'string')
      return;
    getChartData();
  }, [projectsData]);

  return (
    <ParamTab tabMenu={tabMenu}>
      <TabPanel className="focus:outline-none">
        <Search
          search={search}
          setSearch={setSearch}
          setTriggerSearch={setTriggerSearch}
        />
        {!isLoading &&
          projectsData.length !== 0 &&
          typeof projectsData[0]?.project_token?.token_price_feed !==
            'string' && (
            <div className={cn('grid grid-cols-2 gap-4 lg:gap-5 xl:gap-6')}>
              {projectsData.map((project: any, idx: number) => (
                <ProfileProjectCard item={project} key={idx} />
              ))}
            </div>
          )}
        {!isLoading && projectsData.length === 0 && (
          <div className="mt-16 flex h-full w-full flex-col items-center justify-center gap-5">
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
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="space-y-8 xl:space-y-9">
          <div className="mx-4 w-full">
            <GitHubCalendar
              theme={{
                level0: '#161b22',
                level1: '#0e4429',
                level2: '#006d32',
                level3: '#26a641',
                level4: '#39d353',
              }}
              labels={{
                tooltip: '<strong>{{count}} contributions</strong> on {{date}}',
                totalCount: '{{count}} contributions in {{year}}',
              }}
              showWeekdayLabels={true}
              username={githubInfo?.login || 'Rohitkk432'}
            >
              <ReactTooltip html />
            </GitHubCalendar>
          </div>

          <ContributionsHistory />
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div>Coming Soon</div>
      </TabPanel>
    </ParamTab>
  );
}
