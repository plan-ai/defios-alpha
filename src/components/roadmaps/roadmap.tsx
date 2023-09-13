import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '@/components/ui/button';
import Feeds from '@/components/roadmaps/feeds';
import { useDrawer } from '@/components/drawer-views/context';
import { Filters, GridSwitcher } from '@/components/roadmaps/filters';
import { OptionIcon } from '@/components/icons/option';
import { SearchIcon } from '@/components/icons/search';
import { PlusCircle } from '../icons/plus-circle';
import Input from '@/components/ui/forms/input';

import _debounce from 'lodash/debounce';
import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { searchDone } from '@/store/roadmapFilterSlice';
import { reset } from '@/store/notifClickSlice';
import { resetRefetch } from '@/store/refetchSlice';
import { Close } from '@/components/icons/close';

import { Tooltip } from 'flowbite-react';
import { InfoCircle } from '@/components/icons/info-circle';

import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';

import RoadmapCreate from '@/components/roadmapCreation/roadmapCreate';

import { useWallet } from '@solana/wallet-adapter-react';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CreateRoadmapBtn from '@/components/roadmaps/CreateRoadmapBtn';

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
  const wallet = useWallet();

  let userMappingIsLoading = useAppSelector(
    (state) => state.userMapping.isLoading
  );
  let userMappingIsError = useAppSelector((state) => state.userMapping.isError);
  const callPopupState = useAppSelector((state) => state.callLoader.callState);

  const [createRoadmap, setCreateRoadmap] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    if (callPopupState === 'none') {
      setCreateRoadmap(false);
    }
  });
  useLockBodyScroll(createRoadmap);

  const { openDrawer } = useDrawer();

  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  //redirect to page and query search
  const searchQuery = useAppSelector((state) => state.notifClick.searchQuery);
  const setSearchQuery = useAppSelector(
    (state) => state.notifClick.setSearchQuery
  );
  const clickPathname = useAppSelector((state) => state.notifClick.pathname);
  const refetchPart = useAppSelector((state) => state.refetch.refetchPart);

  const [roadmapsData, setRoadmapsData] = useState<any>([]);

  const [existingRoadmaps, setExistingRoadmaps] = useState<string[]>([]);

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
    const searchParams: any = {
      ...filterData,
    };
    if (search !== '') {
      if (search.includes(';')) {
        const searchArray = search.trim().split(';');
        searchArray.map((item) => {
          const [key, value] = item.trim().split(':');
          if (key === 'creator') {
            searchParams['search.roadmap_creator_gh_name'] = value;
          }
          if (key === 'project_account') {
            searchParams['search.roadmap_project'] = value;
          }
        });
      } else if (search.includes(':') && !search.includes(';')) {
        const [key, value] = search.trim().split(':');
        if (key === 'creator') {
          searchParams['search.roadmap_creator_gh_name'] = value;
        }
        if (key === 'project_account') {
          searchParams['search.roadmap_project'] = value;
        }
      } else if (!search.includes(':') && !search.includes(';')) {
        searchParams['search.roadmap_title'] = search.trim();
      }
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/roadmaps`, {
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
        const existingRoadmapAcc: string[] = [];
        res.data.forEach((item: any) => {
          if (item.project_account) {
            existingRoadmapAcc.push(item.project_account);
          }
        });
        setExistingRoadmaps(existingRoadmapAcc);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        setTriggerSearch(false);
        dispatch(searchDone());
      });
  }, [fetchTrigger, firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (triggerSearch || searchTrigger) {
      setFetchTrigger(fetchTrigger + 1);
    }
    if (searchQuery !== '' && setSearchQuery && clickPathname === '/roadmaps') {
      setSearch(searchQuery);
      setFetchTrigger(fetchTrigger + 1);
      dispatch(reset());
    }
    if (refetchPart === 'roadmaps') {
      setTimeout(() => setFetchTrigger(fetchTrigger + 1), 1500);
      dispatch(resetRefetch());
    }
  }, [triggerSearch, searchTrigger, refetchPart, firebase_jwt]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex h-[15rem] w-full flex-col justify-between rounded-3xl bg-[#7CAA8E] p-12">
        <div className="w-[50%] text-2xl font-bold xl:text-3xl 3xl:text-4xl">
          roadmaps
        </div>
        <div className="w-[50%] text-base xl:text-lg 3xl:text-xl">
          plan how projects pan out as a community.
          <br />
          use your staked tokens to drive the direction
          <br />
          of your favorite projects.
        </div>
      </div>
      <div className="my-12">
        <CreateRoadmapBtn onClick={() => setCreateRoadmap(true)} />
      </div>
      <div className="grid 2xl:grid-cols-[280px_minmax(auto,_1fr)]">
        <div className="hidden border-r border-dashed border-gray-700 pr-8 2xl:block">
          <Filters />
        </div>

        <div className="2xl:pl-8">
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <span className="w-[80%] text-xs font-medium text-white sm:text-sm">
              <Search
                search={search}
                setSearch={setSearch}
                setTriggerSearch={setTriggerSearch}
              />
            </span>

            <div className="flex gap-3 4xl:gap-4">
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
        <AnimatePresence>
          {createRoadmap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
            >
              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-full align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                exit={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                ref={modalContainerRef}
                className="inline-block text-left align-middle"
              >
                <div className="relative h-[90vh] w-[80vw] rounded-2xl bg-dark">
                  <RoadmapCreate
                    existingRoadmaps={existingRoadmaps}
                    setCreateRoadmap={setCreateRoadmap}
                  />
                  {(userMappingIsLoading ||
                    userMappingIsError ||
                    wallet.publicKey === null) && (
                    <div className="absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-sm">
                      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-white bg-dark p-4 text-center text-base shadow-2xl xl:gap-4 xl:p-6 xl:text-lg 3xl:gap-5 3xl:p-8 3xl:text-xl">
                        <Image
                          src={ErrorDarkImage}
                          className="w-80"
                          alt="404 Error"
                        />
                        <div>
                          {wallet.publicKey === null
                            ? 'Connect Wallet to Continue'
                            : userMappingIsLoading
                            ? 'Loading...'
                            : 'Connected to Authorized Wallet which is mapped to your Github on DefiOS'}
                        </div>
                        <WalletMultiButton className="rounded-full bg-new-blue" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
