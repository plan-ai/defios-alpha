import React, { useState, useEffect, useMemo } from 'react';
import {
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@/components/icons/star';
import { ForkIcon } from '@/components/icons/fork-icon';
import EmptyList from '@/components/icons/EmptyList';

import Uploader from '@/components/ui/forms/uploader';
import Input from '@/components/ui/forms/input';
import Image from 'next/image';
import Spinner from '../custom/spinner';
import cn from 'classnames';

import axios from '@/lib/axiosClient';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setStep1Data } from '@/store/newCreationSlice';
import { useSession } from 'next-auth/react';

interface TokenTypeProps {
  values: any[];
  tokenType: any;
  setTokenType: React.Dispatch<React.SetStateAction<any>>;
}

export const TokenType: React.FC<TokenTypeProps> = ({
  values,
  tokenType,
  setTokenType,
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      {values.map((item: any, idx: number) => {
        return (
          <div
            onClick={() => setTokenType(item)}
            key={idx}
            className="flex items-center gap-4"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary">
              {tokenType === item && (
                <div className="h-3 w-3 rounded-full bg-primary"></div>
              )}
            </div>
            <div className="text-sm uppercase xl:text-base 3xl:text-lg">
              {item.name}
            </div>
            <QuestionMarkCircleIcon className="h-5 w-5 " />
          </div>
        );
      })}
    </div>
  );
};

interface RepoItemProps {
  repo: any;
  selectedRepo: any;
  setSelect: React.Dispatch<React.SetStateAction<any>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setChooseRepo: React.Dispatch<React.SetStateAction<boolean>>;
}

const RepoItem: React.FC<RepoItemProps> = ({
  repo,
  selectedRepo,
  setSelect,
  setSearch,
  setChooseRepo,
}) => {
  const { full_name, forks, stargazers_count } = repo;
  return (
    <div
      className={cn('w-full cursor-pointer text-gray-300 hover:text-white', {
        '!text-primary hover:!text-primary': repo?.id === selectedRepo?.id,
      })}
      onClick={(e) => {
        e.stopPropagation();
        setSelect(repo);
        setChooseRepo(false);
        setSearch(repo.full_name);
      }}
    >
      <div className="my-1 flex w-full items-center justify-between">
        <div className="text-3xs xl:text-2xs 3xl:text-xs">{full_name}</div>
        <div className="flex flex-col gap-2 text-2xs xl:text-xs 3xl:text-sm">
          <div className="flex items-center gap-2">
            <div className="pl-1">
              {stargazers_count > 1000
                ? Math.round(stargazers_count * 100) / 100 + 'K'
                : stargazers_count}
            </div>
            <StarIcon />
          </div>
          <div className="flex items-center gap-2">
            <div className="pl-1">
              {forks > 1000 ? Math.round(forks * 100) / 100 + 'K' : forks}
            </div>
            <ForkIcon />
          </div>
        </div>
      </div>
      <div
        className={`h-0.5 w-full ${
          repo?.id === selectedRepo?.id
            ? 'lineGradientHorizontal'
            : 'lineGradientHorizontalGray'
        }`}
      ></div>
    </div>
  );
};

const tokenTypes = [
  { name: 'create new token', info: '' },
  { name: 'import existing token', info: '' },
];

interface Step1Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step1: React.FC<Step1Props> = ({ setStep }) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const step1Data = useAppSelector((state) => state.newCreation.step1);

  const [search, setSearch] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<any>();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenType, setTokenType] = useState(tokenTypes[0]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const [chooseRepo, setChooseRepo] = useState(false);
  const [repos, setRepos] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRepos = async () => {
    let keepGoing = true;
    let pagination = 1;
    let _repos: any = [];
    const existingRepos: any = await createExistingArray();

    while (keepGoing) {
      const res = await axios
        .get(
          `https://api.github.com/user/repos?sort=pushed&per_page=100&page=${pagination}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${(session as any)?.accessToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));

      //filter conditions added
      // 1) admin controls
      // 2) public repo
      // 3) if not a fork (as cant create issues on forked repos)
      // 4) existing project on defios

      const refinedRes = res.filter(
        (repo: any) =>
          repo.permissions.admin &&
          repo.visibility === 'public' &&
          !repo.fork &&
          !existingRepos.includes(repo.html_url)
      );

      if (refinedRes.length === 0) {
        keepGoing = false;
      } else {
        _repos = [..._repos, ...refinedRes];
        setRepos(_repos);
        setIsLoading(false);
        pagination++;
      }
    }
  };

  const createExistingArray = async () => {
    setIsLoading(true);
    return await axios
      .get('https://api-v1.defi-os.com/projects/minified', {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        const existing = res.data;
        const arr: string[] = [];
        existing.forEach((item: any) => {
          arr.push(item?.project_url);
        });
        return arr;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

  const repoSearch = useMemo(() => {
    if (search === '') return repos;
    const filteredRepos = repos.filter((_repo: any) => {
      return _repo.full_name.toLowerCase().includes(search.toLowerCase());
    });
    return filteredRepos;
  }, [search, repos, selectedRepo]);

  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === '') return;
    if (session && (session as any)?.accessToken && repos.length === 0) {
      fetchRepos();
      setSearch(step1Data.repoName);
      setTokenName(step1Data.tokenName);
      setTokenSymbol(step1Data.tokenSymbol);
      setImageFile(step1Data.tokenIcon);
      setProjectName(step1Data.projectName);
      setProjectDescription(step1Data.projectDescription);
      setSelectedRepo(step1Data.selectedRepo);
    }
  }, [session, firebase_jwt]);

  const handleSubmit = () => {
    if (
      selectedRepo === null ||
      selectedRepo === undefined ||
      imageFile === null ||
      imageFile === undefined ||
      projectName === '' ||
      projectDescription === '' ||
      tokenName === '' ||
      tokenSymbol === ''
    )
      return;
    dispatch(
      setStep1Data({
        repoName: selectedRepo.full_name,
        selectedRepo: selectedRepo,
        repoLink: selectedRepo.html_url,
        repoId: selectedRepo.id.toString(),
        projectName: projectName,
        projectDescription: projectDescription,
        tokenSymbol: tokenSymbol,
        tokenName: tokenName,
        tokenType: tokenType.name,
        tokenIcon: imageFile,
      })
    );
    setStep(2);
  };

  return (
    <div
      className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg"
      onClick={() => {
        setChooseRepo(false);
        if (selectedRepo !== null && selectedRepo !== undefined) {
          setSearch(selectedRepo.full_name);
        }
      }}
    >
      <div className="text-lg font-semibold xl:text-xl 3xl:text-2xl ">
        project details
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 uppercase ">
          <div>Choose Repository</div>
          <QuestionMarkCircleIcon className="h-5 w-5 " />
        </div>
        <div className="relative">
          <Input
            placeholder="type the name of your repository and choose it from the list"
            searchLeft={true}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputClassName="text-2xs xl:text-xs 3xl:text-sm"
            className="absolute"
            onClick={(e) => {
              e.stopPropagation();
              setChooseRepo(true);
              setSearch('');
            }}
          />
          <div
            className={`gradient-border-box-bottom absolute z-[40] h-[24rem] w-full flex-col gap-2 overflow-y-auto rounded-b-xl border-b bg-light-gray px-6 py-2 drop-shadow-xl xl:h-[29.5rem] ${
              chooseRepo ? 'flex' : 'hidden'
            }`}
          >
            {!isLoading &&
              repoSearch.length !== 0 &&
              repoSearch.map((item: any, idx: number) => (
                <RepoItem
                  key={idx}
                  repo={item}
                  selectedRepo={selectedRepo}
                  setSelect={setSelectedRepo}
                  setSearch={setSearch}
                  setChooseRepo={setChooseRepo}
                />
              ))}
            {!isLoading && repoSearch.length === 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <EmptyList />
                <div className="text-lg text-gray-500">No Repos Available</div>
              </div>
            )}
            {isLoading && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 uppercase ">
          <div>Project Name</div>
          <QuestionMarkCircleIcon className="h-5 w-5 " />
        </div>
        <Input
          placeholder="e.g. Linux, VLC media player"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          inputClassName="text-2xs xl:text-xs 3xl:text-sm"
          className="w-1/2"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 uppercase ">
          <div>One Line Description</div>
          <QuestionMarkCircleIcon className="h-5 w-5 " />
        </div>
        <Input
          placeholder="e.g. Audacity is a free and open-source digital audio editor."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          inputClassName="text-2xs xl:text-xs 3xl:text-sm"
        />
      </div>
      <TokenType
        values={tokenTypes}
        tokenType={tokenType}
        setTokenType={setTokenType}
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[40%] flex-col gap-2">
          <div className="flex items-center gap-3 uppercase ">
            <div>Token Symbol</div>
            <QuestionMarkCircleIcon className="h-5 w-5 " />
          </div>
          <Input
            placeholder="e.g. ADX, TGT, BUYN"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            inputClassName="text-2xs xl:text-xs 3xl:text-sm"
          />
        </div>
        <div className="flex w-[55%] flex-col gap-2">
          <div className="flex items-center gap-3 uppercase ">
            <div>Token Name</div>
            <QuestionMarkCircleIcon className="h-5 w-5 " />
          </div>
          <Input
            placeholder="e.g. Audacity token, Uber dev token"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            inputClassName="text-2xs xl:text-xs 3xl:text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 uppercase ">
          <div>Token Icon</div>
          <QuestionMarkCircleIcon className="h-5 w-5 " />
        </div>
        <div className="flex w-full items-center gap-2">
          <Uploader
            setFile={(file) => {
              setImageFile(file);
            }}
            uploaded={step1Data.tokenIcon}
          />
          <SparklesIcon className="h-8 w-8 text-primary " />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <div
          onClick={handleSubmit}
          className="w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg"
        >
          next
        </div>
      </div>
    </div>
  );
};

export default Step1;
