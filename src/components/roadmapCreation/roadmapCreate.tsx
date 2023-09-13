import React, { useState, Fragment, useEffect, useCallback } from 'react';
import Uploader from '@/components/ui/forms/uploader';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Button from '@/components/ui/button/button';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Tooltip } from 'flowbite-react';
import { InfoCircle } from '@/components/icons/info-circle';
import { PlusCircle } from '@/components/icons/plus-circle';
import EmptyList from '@/components/icons/EmptyList';
import Spinner from '@/components/custom/spinner';
import CreateProjectBtn from '@/components/projects/CreateProjectBtn';

import { useRouter } from 'next/router';
import _debounce from 'lodash/debounce';
import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { setRefetch } from '@/store/refetchSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { addRoadmapData } from '@/lib/helpers/contractInteract';
import { uploadFileToIPFS } from '@/lib/helpers/metadata';

import { selectUserMapping } from '@/store/userMappingSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import RepoList from '@/components/roadmapCreation/repo-list';

import mixpanel from 'mixpanel-browser'

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

const sort = [
  { id: 1, name: 'Long Term Public', data: { longTerm: {} } },
  { id: 2, name: 'Good (>5 Years)', data: { plus5: {} } },
  { id: 3, name: 'Next 5 Years', data: { next5: {} } },
  { id: 4, name: 'Next 2 Years', data: { next2: {} } },
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
    <div className="relative w-full">
      <span className="text-gray-10 mb-3 block text-xs font-medium uppercase tracking-widest xl:text-sm 3xl:text-base">
        Roadmap Outlook
      </span>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl border border-gray-700 bg-light-dark px-4 text-2xs text-white xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
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
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-light-dark p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
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

interface RoadmapCreateProps {
  existingRoadmaps: string[];
  setCreateRoadmap: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoadmapCreate: React.FC<RoadmapCreateProps> = ({ existingRoadmaps,setCreateRoadmap }) => {
  const router = useRouter();

  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const [roadmapOutlook, setRoadmapOutlook] = useState(sort[0]);

  const [selectedRepo, setSelectedRepo] = useState<any>();

  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  const [search, setSearch] = useState('');

  const dispatch = useAppDispatch();

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [projectsData, setProjectsData] = useState<any>([]);

  const [triggerSearch, setTriggerSearch] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setIsLoading(true);
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 50,
      'filter.mine': true,
    };
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
        const filteredData = res.data.projects.filter((item: any) => {
          return !existingRoadmaps.includes(item.project_account);
        });
        setProjectsData(filteredData);
        setIsLoading(false);
        setTriggerSearch(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        setTriggerSearch(false);
      });
  }, [fetchTrigger, firebase_jwt]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    setFetchTrigger(fetchTrigger + 1);
  }, [triggerSearch, existingRoadmaps, firebase_jwt]);

  const handleRoadmapCreate = async () => {
    if (
      roadmapTitle === '' ||
      roadmapDescription === '' ||
      imageFile === undefined ||
      selectedRepo === null ||
      selectedRepo === undefined
    )
      return;
    dispatch(onLoading('Creating Roadmap...'));
    const imageHash = await uploadFileToIPFS(imageFile as File);
    let resCalled = false;
    addRoadmapData(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      new PublicKey(selectedRepo.project_account),
      roadmapTitle,
      roadmapDescription,
      `https://ipfs.io/ipfs/${imageHash}`,
      roadmapOutlook.data
    )
      .then((res) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: 'Roadmap Creation Success',
            description: 'check out created roadmap at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: null,
          })
        );
        mixpanel.track('Roadmap Creation Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          project_account: selectedRepo.project_account,
          repo_github_id: selectedRepo.project_github_id,
          repo_github_url: selectedRepo.project_repo_link,
          roadmap_title: roadmapTitle,
          roadmap_description: roadmapDescription,
          roadmap_image_url: `https://ipfs.io/ipfs/${imageHash}`,
          roadmapOutlook: roadmapOutlook.name
        });
        setCreateRoadmap(false);
        dispatch(setRefetch('roadmaps'));
      })
      .catch((err) => {
        console.log(err);
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Roadmap Creation Failed',
            description: err.message,
            link: '',
            redirect: null,
          })
        );
        mixpanel.track('Roadmap Creation Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message
        });
        setCreateRoadmap(false);
        dispatch(setRefetch('roadmaps'));
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Roadmap Creation Success',
              description: '',
              link: '',
              redirect: null,
            })
          );
          mixpanel.track('Roadmap Creation Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          setCreateRoadmap(false);
          dispatch(setRefetch('roadmaps'));
        }
      });
  };

  return (
    <div className="flex h-full w-full justify-between p-10">
      <div className="flex w-[48%] flex-col gap-8">
        <div className="mb-2 text-3xl font-bold text-primary xl:text-4xl 3xl:text-5xl">
          Create Roadmap
        </div>
        <Input
          id="roadmaptitle"
          label="Roadmap Title"
          placeholder="Enter Roadmap Title"
          className="w-full"
          type="text"
          value={roadmapTitle}
          onChange={(e) => setRoadmapTitle(e.target.value)}
        />
        <Textarea
          className="my-2 w-full"
          placeholder="Roadmap Description"
          inputClassName="text-xs xl:text-sm 3xl:text-base resize-none"
          label="Roadmap Description"
          value={roadmapDescription}
          onChange={(e) => setRoadmapDescription(e.target.value)}
        />
        <SortList
          selectedItem={roadmapOutlook}
          setSelectedItem={setRoadmapOutlook}
        />
        <Uploader
          label="Roadmap Image"
          setFile={(file) => {
            setImageFile(file);
          }}
        />
        <div
          className="ml-auto mt-auto w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg"
          onClick={() => handleRoadmapCreate()}
        >
          Create Roadmap
        </div>
      </div>
      <div className="flex h-full w-[48%] flex-col">
        <Search
          search={search}
          setSearch={setSearch}
          setTriggerSearch={setTriggerSearch}
        />
        <div className="h-[90%] w-full overflow-y-auto pr-5">
          {!isLoading &&
            projectsData.length !== 0 &&
            projectsData.map((project: any, idx: number) => (
              <RepoList
                key={idx}
                data={project}
                selectedRepo={selectedRepo}
                setSelectedRepo={setSelectedRepo}
              />
            ))}
          {!isLoading && projectsData.length === 0 && (
            <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
              <EmptyList />
              <div className="mx-10 text-center text-lg text-gray-500">
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
      </div>
    </div>
  );
};

export default RoadmapCreate;
