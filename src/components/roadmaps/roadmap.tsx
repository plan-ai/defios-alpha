import React, { useState, useEffect,useCallback } from 'react';
import Button from '@/components/ui/button';
import Feeds from '@/components/roadmaps/feeds';
import { useDrawer } from '@/components/drawer-views/context';
import { Filters, GridSwitcher } from '@/components/roadmaps/filters';
import { OptionIcon } from '@/components/icons/option';
import { SearchIcon } from '@/components/icons/search';
import { PlusCircle } from '../icons/plus-circle';
import Input from '@/components/ui/forms/input';

import _debounce from 'lodash/debounce';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { triggerFilter, searchDone } from '@/store/roadmapFilterSlice';
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
    'direct roadmap title search or using keys\n====Search==>\n<key>:<value> separated by ;\n====keys==>\n creator\n====filters==>\nchoose from side panel.';
  return (
    <div className="relative flex w-full items-center rounded-full ">
      <Input
        className="w-full"
        placeholder="search roadmaps"
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

export default function Roadmap() {
  const { openDrawer } = useDrawer();

  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [roadmapsData, setRoadmapsData] = useState<any>([]);

  const dispatch = useAppDispatch();

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const filterData = useAppSelector((state) => state.roadmapFilter.filter);
  const searchTrigger = useAppSelector(
    (state) => state.roadmapFilter.searchTrigger
  );

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    axios
      .get('https://api-v1.defi-os.com/roadmaps', {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setRoadmapsData(res.data);
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
      dispatch(triggerFilter());
    }
  }, [triggerSearch, firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (triggerSearch === true && searchTrigger === true) {
      const searchParams: any = { ...filterData };
      if (search !== '') {
        if (search.includes(';')) {
          const searchArray = search.trim().split(';');
          searchArray.map((item) => {
            const [key, value] = item.trim().split(':');
            if (key === 'creator') {
              searchParams['search.roadmap_creator_gh_name'] = value;
            }
          });
        } else if (search.includes(':') && !search.includes(';')) {
          const [key, value] = search.trim().split(':');
          if (key === 'creator') {
            searchParams['search.roadmap_creator_gh_name'] = value;
          }
        } else if (!search.includes(':') && !search.includes(';')) {
          searchParams['search.roadmap_title'] = search.trim();
        }
      }

      axios
        .get('https://api-v1.defi-os.com/roadmaps', {
          params: searchParams,
          headers: {
            Authorization: firebase_jwt,
          },
        })
        .then((res) => {
          setRoadmapsData(res.data);
          setIsLoading(false);
          setTriggerSearch(false);
          dispatch(searchDone());
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
          setTriggerSearch(false);
          dispatch(searchDone());
        });
    }
  }, [triggerSearch, searchTrigger, firebase_jwt]);

  return (
    <>
      <div className="grid 2xl:grid-cols-[280px_minmax(auto,_1fr)]">
        <div className="hidden border-r border-dashed border-gray-700 pr-8 2xl:block">
          <Filters />
        </div>

        <div className="2xl:pl-8">
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <span className="w-3/5 text-xs font-medium text-white sm:text-sm">
              <Search
                search={search}
                setSearch={setSearch}
                setTriggerSearch={setTriggerSearch}
              />
            </span>

            <div className="flex gap-6 4xl:gap-8">
              <div className="flex items-center justify-center">
                <Button shape="rounded" disabled className="!bg-gray-800">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <PlusCircle />
                    Create New Roadmap
                  </div>
                </Button>
                <span className="relative z-[2] ml-2 rounded-full bg-gray-900 px-2 py-0.5 normal-case text-red-700">
                  Coming Soon
                </span>
              </div>
              <div className="hidden 4xl:block">
                <GridSwitcher />
              </div>
              <div className="block 2xl:hidden">
                <Button
                  shape="rounded"
                  size="small"
                  variant="ghost"
                  color="gray"
                  onClick={() => openDrawer('DRAWER_SEARCH', 'right')}
                  className="!h-11 !p-3 hover:!translate-y-0 hover:!shadow-none focus:!translate-y-0 focus:!shadow-none"
                >
                  <OptionIcon className="relative h-auto w-[18px]" />
                </Button>
              </div>
            </div>
          </div>
          <Feeds isLoading={isLoading} data={roadmapsData} />
        </div>

        <div className="fixed bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-9 sm:hidden">
          <Button
            onClick={() => openDrawer('DRAWER_SEARCH', 'right')}
            fullWidth
          >
            Filters
          </Button>
        </div>
      </div>
    </>
  );
}
