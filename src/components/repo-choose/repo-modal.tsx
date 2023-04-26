import React, { useState, useEffect, useMemo } from 'react';
import Input from '@/components/ui/forms/input';
import { SearchIcon } from '@/components/icons/search';
import RepoItem from '@/components/repo-choose/repo-item';
import Button from '@/components/ui/button/button';
import { useSession } from 'next-auth/react';
import EmptyList from '@/components/icons/EmptyList';
import Image from 'next/image';
import Spinner from '../custom/spinner';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setStep2Data } from '@/store/creationSlice';

interface RepoModalProps {
  repo: string;
  setRepo: (repo: string) => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  stepOfCreation?: number;
  setStepOfCreation?: React.Dispatch<React.SetStateAction<number>>;
}

const RepoModal: React.FC<RepoModalProps> = ({
  repo,
  setRepo,
  setModalOpen,
  stepOfCreation,
  setStepOfCreation,
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const [selectedRepo, setSelectedRepo] = useState('');

  const [repos, setRepos] = useState<any>([]);
  const [orgRepos, setOrgRepos] = useState<any>([]);
  const [collaboratorRepos, setCollaboratorRepos] = useState<any>([]);

  const [reposToShow, setReposToShow] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [reposState, setReposState] = useState('Owner');

  const fetchRepos = async () => {
    let affiliation = 'owner';
    let keepGoing = true;
    let pagination = 1;
    let _repos: any = [];
    while (keepGoing) {
      const res = await fetch(
        `https://api.github.com/user/repos?affiliation=${affiliation}&sort=pushed&per_page=100&page=${pagination}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));

      //already exists as project checker needed here , condition it in filter
      const refinedRes = res.filter((repo: any) => repo.permissions.admin);

      if (refinedRes.length === 0 && affiliation === 'owner') {
        affiliation = 'collaborator';
        pagination = 1;
        _repos = [];
      } else if (refinedRes.length === 0 && affiliation === 'collaborator') {
        affiliation = 'organization_member';
        pagination = 1;
        _repos = [];
      } else if (
        refinedRes.length === 0 &&
        affiliation === 'organization_member'
      ) {
        keepGoing = false;
      } else if (affiliation === 'owner') {
        _repos = [..._repos, ...refinedRes];
        setRepos(_repos);
        setIsLoading(false);
        pagination++;
      } else if (affiliation === 'collaborator') {
        _repos = [..._repos, ...refinedRes];
        setCollaboratorRepos(_repos);
        setIsLoading(false);
        pagination++;
      } else if (affiliation === 'organization_member') {
        _repos = [..._repos, ...refinedRes];
        setOrgRepos(_repos);
        setIsLoading(false);
        pagination++;
      }
    }
  };

  const [search, setSearch] = useState('');

  const repoSearch = useMemo(() => {
    if (search === '')
      return {
        repos: repos,
        orgRepos: orgRepos,
        collaboratorRepos: collaboratorRepos,
      };
    const filteredRepos = repos.filter((_repo: any) => {
      return (
        _repo.name.toLowerCase().includes(search.toLowerCase()) ||
        _repo.full_name === selectedRepo
      );
    });
    const filteredOrgRepos = orgRepos.filter((_repo: any) => {
      return (
        _repo.name.toLowerCase().includes(search.toLowerCase()) ||
        _repo.full_name === selectedRepo
      );
    });
    const filteredCollabRepos = collaboratorRepos.filter((_repo: any) => {
      return (
        _repo.name.toLowerCase().includes(search.toLowerCase()) ||
        _repo.full_name === selectedRepo
      );
    });
    return {
      repos: filteredRepos,
      orgRepos: filteredOrgRepos,
      collaboratorRepos: filteredCollabRepos,
    };
  }, [search, repos, orgRepos, collaboratorRepos]);

  useEffect(() => {
    if (
      session &&
      (session as any)?.accessToken &&
      repos.length === 0 &&
      orgRepos.length === 0 &&
      collaboratorRepos.length === 0
    ) {
      fetchRepos();
    }
    setReposToShow(
      reposState === 'Owner'
        ? repoSearch.repos
        : reposState === 'Organization'
        ? repoSearch.orgRepos
        : repoSearch.collaboratorRepos
    );
  }, [session, reposState, repoSearch]);

  return (
    <div className="flex h-full w-full flex-col p-3 xl:p-4 3xl:p-5">
      <div className="relative flex w-full">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Repositories"
          className="w-full"
        />
        <SearchIcon className="absolute right-4 top-4 h-5 w-5" />
      </div>
      <div className="my-3 flex gap-3">
        <Button
          size="mini"
          shape="rounded"
          color={reposState === 'Owner' ? 'info' : 'primary'}
          onClick={() => setReposState('Owner')}
        >
          Owner
        </Button>
        <Button
          size="mini"
          shape="rounded"
          color={reposState === 'Organization' ? 'info' : 'primary'}
          onClick={() => setReposState('Organization')}
        >
          Organization
        </Button>
        <Button
          size="mini"
          shape="rounded"
          color={reposState === 'Collaborator' ? 'info' : 'primary'}
          onClick={() => setReposState('Collaborator')}
        >
          Collaborator
        </Button>
      </div>
      <div className="mb-4 h-full w-full overflow-y-scroll pr-4">
        {!isLoading &&
          reposToShow.length !== 0 &&
          reposToShow.map((item: any, idx: number) => (
            <RepoItem
              key={idx}
              repo={item}
              selectedRepo={selectedRepo}
              setSelect={setSelectedRepo}
            />
          ))}
        {!isLoading && reposToShow.length === 0 && (
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
      <Button
        shape="rounded"
        size="small"
        color="info"
        onClick={() => {
          if (selectedRepo !== '') {
            setRepo(selectedRepo);
            const repoInfo = reposToShow.filter((item: any) => {
              return item.html_url === selectedRepo;
            });
            dispatch(
              setStep2Data({
                repoLink: selectedRepo,
                repoName: repoInfo[0].full_name,
              })
            );
            setModalOpen(false);
            if (
              stepOfCreation !== undefined &&
              setStepOfCreation !== undefined
            ) {
              setStepOfCreation(stepOfCreation + 1);
            }
          }
        }}
      >
        Confirm Selected Repository
      </Button>
    </div>
  );
};

export default RepoModal;
