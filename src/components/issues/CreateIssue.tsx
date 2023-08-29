import React, { useState, useEffect, useMemo } from 'react';

import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import EmptyList from '@/components/icons/EmptyList';

import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Spinner from '../custom/spinner';
import cn from 'classnames';
import Image from '@/components/ui/image';

import { PublicKey } from '@solana/web3.js';
import { createIssueStake } from '@/lib/helpers/contractInteract';
import { useAppSelector, useAppDispatch } from '@/store/store';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { selectUserMapping } from '@/store/userMappingSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import mixpanel from 'mixpanel-browser';

const tagsList = [
  'bug',
  'documentation',
  'duplicate',
  'enhancement',
  'good first issue',
  'help wanted',
  'invalid',
  'question',
  'urgent',
];

interface TagItemProps {
  tag: string;
  tagsSearch: string;
  addTag: (newtag: string) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, tagsSearch, addTag }) => {
  return (
    <div
      className={cn('w-full cursor-pointer text-gray-300 hover:text-white', {
        '!text-primary hover:!text-primary': tagsSearch.includes(tag),
      })}
      onClick={(e) => {
        e.stopPropagation();
        addTag(tag);
      }}
    >
      <div className="my-1 flex w-full items-center text-3xs xl:text-2xs 3xl:text-xs">
        {tag}
      </div>
      <div
        className={`h-0.5 w-full ${
          tagsSearch.includes(tag)
            ? 'lineGradientHorizontal'
            : 'lineGradientHorizontalGray'
        }`}
      ></div>
    </div>
  );
};

interface IssueItemProps {
  item: any;
  selectedIssue: any;
  setSelectedIssue: React.Dispatch<React.SetStateAction<any>>;
  setChooseIssue: React.Dispatch<React.SetStateAction<boolean>>;
  setIssueSearch: React.Dispatch<React.SetStateAction<string>>;
  setIssueDescription: React.Dispatch<React.SetStateAction<string>>;
  setTagsSearch: React.Dispatch<React.SetStateAction<string>>;
  setIssueType: React.Dispatch<React.SetStateAction<'import' | 'create'>>;
}

const IssueItem: React.FC<IssueItemProps> = ({
  item,
  selectedIssue,
  setSelectedIssue,
  setChooseIssue,
  setIssueSearch,
  setIssueType,
  setIssueDescription,
  setTagsSearch,
}) => {
  return (
    <div
      className={cn('w-full cursor-pointer text-gray-300 hover:text-white', {
        '!text-primary hover:!text-primary': selectedIssue?.id === item?.id,
      })}
      onClick={(e) => {
        const labels = item.labels.map((item: any) => item.name);
        if (labels.length > 1) {
          setTagsSearch(labels.join(','));
        } else {
          setTagsSearch(labels.join(''));
        }
        e.stopPropagation();
        setSelectedIssue(item);
        setIssueSearch(item.title);
        setChooseIssue(false);
        setIssueType('import');
        setIssueDescription(item.body);
      }}
    >
      <div className="my-1 flex w-full items-center justify-between">
        <div className="text-3xs xl:text-2xs 3xl:text-xs">
          {item?.title}
          {' #'}
          {item?.number}
        </div>
        <div className="flex flex-col gap-2 text-2xs xl:text-xs 3xl:text-sm">
          <div className="flex items-center gap-2">
            <div className="pl-1">{item?.comments}</div>
            <ChatBubbleLeftIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div
        className={`h-0.5 w-full ${
          selectedIssue?.id === item?.id
            ? 'lineGradientHorizontal'
            : 'lineGradientHorizontalGray'
        }`}
      ></div>
    </div>
  );
};

interface ProjectItemProps {
  item: any;
  selectedProject: any;
  setSelectedProject: React.Dispatch<React.SetStateAction<any>>;
  setChooseProject: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectSearch: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  item,
  selectedProject,
  setSelectedProject,
  setChooseProject,
  setProjectSearch,
}) => {
  return (
    <div
      className={cn('w-full cursor-pointer text-gray-300 hover:text-white', {
        '!text-primary hover:!text-primary':
          selectedProject?.account === item?.account,
      })}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedProject(item);
        setProjectSearch(item.project_name);
        setChooseProject(false);
      }}
    >
      <div className="my-1 flex w-full items-center gap-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image
            src={item?.token_url?.replace(
              'https://ipfs.io',
              'https://defi-os.infura-ipfs.io'
            )}
            alt="token image"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-3xs xl:text-2xs 3xl:text-xs">
          {item.project_name}
        </div>
      </div>
      <div
        className={`h-0.5 w-full ${
          selectedProject?.account === item?.account
            ? 'lineGradientHorizontal'
            : 'lineGradientHorizontalGray'
        }`}
      ></div>
    </div>
  );
};

interface CreateProps {}

export const Create: React.FC<CreateProps> = ({}) => {
  const [chooseTags, setChooseTags] = useState(false);
  const [tagsSearch, setTagsSearch] = useState('');

  const [projectSearch, setProjectSearch] = useState('');
  const [chooseProject, setChooseProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>();

  const [issueDescription, setIssueDescription] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  const [chooseIssue, setChooseIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>();
  const [issueType, setIssueType] = useState<'import' | 'create'>('create');

  const [tokenIncentive, setTokenIncentive] = useState(0);
  const [usdcIncentive, setUsdcIncentive] = useState(0);

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const userMappingState = useAppSelector(selectUserMapping);

  const [repoIssues, setRepoIssues] = useState<any>([]);
  const [projectsList, setProjectsList] = useState<any>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const getProjects = async () => {
    setProjectsLoading(true);
    axios
      .get('https://api-v1.defi-os.com/projects/minified', {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setProjectsList(res.data);
        setProjectsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setProjectsLoading(false);
      });
  };

  const getIssues = async () => {
    setIssuesLoading(true);
    axios
      .get(
        selectedProject.project_url.replace(
          'https://github.com/',
          'https://api.github.com/repos/'
        ) + '/issues',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )
      .then((res) => setRepoIssues(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIssuesLoading(false));
  };

  const ProjectSearch = useMemo(() => {
    if (projectSearch === '') return projectsList;
    const filteredProjects = projectsList.filter((_project: any) => {
      return _project.project_name
        .toLowerCase()
        .includes(projectSearch.toLowerCase());
    });
    return filteredProjects;
  }, [projectSearch, projectsList]);

  const IssuesSearch = useMemo(() => {
    if (issueSearch === '') return repoIssues;
    const filteredIssues = repoIssues.filter((_issue: any) => {
      return _issue.title
        .toLowerCase()
        .includes(issueSearch.toLocaleLowerCase());
    });
    return filteredIssues;
  }, [issueSearch, repoIssues]);

  const TagsSearch = useMemo(() => {
    const searchTerm = tagsSearch
      .split(',')
      [tagsSearch.split(',').length - 1].trim();
    if (searchTerm === '') return tagsList;
    const filteredTags = tagsList.filter((tag: any) => {
      return tag.toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (tagsList.includes(searchTerm)) {
      return [...filteredTags];
    } else {
      return [searchTerm, ...filteredTags];
    }
  }, [tagsSearch]);

  const addTag = (newTag: string) => {
    const searchTerm = tagsSearch
      .split(',')
      .slice(0, tagsSearch.split(',').length - 1);
    searchTerm.push(newTag);
    let newTerm = searchTerm.join(',');
    if (newTag.startsWith(',')) {
      newTerm.slice(1);
    }
    setTagsSearch(newTerm + ',');
  };

  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    getProjects();
  }, [firebase_jwt]);

  useEffect(() => {
    if (
      session &&
      (session as any)?.accessToken &&
      selectedProject !== null &&
      selectedProject !== undefined &&
      selectedProject.project_url
    ) {
      getIssues();
      if (issueType === 'import') {
        setSelectedIssue(undefined);
        setIssueDescription('');
        setIssueSearch('');
        setTagsSearch('');
      }
    }
  }, [selectedProject]);

  const createGHIssue = async () => {
    const TagsRefined = tagsSearch
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    const data = JSON.stringify({
      title: selectedIssue.title,
      body:
        issueDescription +
        '\n\nThis issue was created at https://www.defi-os.com , please login/signup on it to get cash rewards for solving it.',
      labels: TagsRefined,
    });

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.github.com/repositories/${selectedProject.project_github_id}/issues`,
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    return axios(config)
      .then((res) => res.data.html_url)
      .catch((err) => err);
  };

  const AddIssueToDefiOS = async () => {
    if (
      selectedProject === null ||
      selectedProject === undefined ||
      selectedIssue === null ||
      selectedIssue === undefined
    )
      return;
    dispatch(onLoading('Creating an Issue...'));

    let hadError = false;

    let issueUrl = '';
    if (issueType === 'create') {
      issueUrl = await createGHIssue().catch((err) => {
        hadError = false;
        dispatch(
          onFailure({
            label: 'GH issue creation in project creation Failed',
            description: err.message,
            link: '',
            redirect: null,
          })
        );
        mixpanel.track('GH issue creation in project creation Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
        return '';
      });
    } else {
      issueUrl = selectedIssue.html_url;
    }

    if (hadError) return;

    await createIssueStake(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      issueUrl,
      new PublicKey(selectedProject.account),
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      tokenIncentive,
      usdcIncentive,
      firebase_jwt || ''
    )
      .then((res) => {
        dispatch(
          onSuccess({
            label: 'Issue Creation Success',
            description: 'check out created project at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: '/issues',
          })
        );
        mixpanel.track('Issue Creation Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          repo_github_id: selectedProject.project_github_id,
          repo_github_link: selectedProject.project_url,
          issue_url: issueUrl,
          issue_title: selectedIssue.title,
          issue_description: issueDescription,
          issue_token_incentive: tokenIncentive,
          issue_usdc_incentive: usdcIncentive,
        });
      })
      .catch((err) => {
        dispatch(
          onFailure({
            label: 'Project Creation Failed',
            description: err.message,
            link: '',
            redirect: '/issues',
          })
        );
        mixpanel.track('Project Creation Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  return (
    <div className="landing-font flex flex-col items-center gap-6 xl:gap-8 3xl:gap-10">
      <div className="z-[40] flex items-center rounded-full bg-newdark py-2 px-4 text-base font-bold xl:text-lg 3xl:text-xl">
        <div className="text-primary">create or import an issue</div>
      </div>
      <div className="relative flex h-[38rem] w-[34rem] items-center justify-center xl:h-[44rem] xl:w-[40rem]  2xl:h-[46rem] 2xl:w-[42rem]">
        <div className="absolute z-[20] h-full w-full">
          <div className="absolute -left-[2.5%] bottom-0 h-[60%] w-[102.5%] rounded-full border-2 bg-white blur-[100px]" />
          <div
            className="absolute left-[20%] bottom-[12%] h-[50%] w-full -rotate-[48.87deg] rounded-full border-2 bg-cyan-800 blur-[50px]
           "
          />
          <div className="absolute -left-[2.5%] -top-[1%] h-[75%] w-[105%] rounded-full border-2 bg-indigo-300 blur-[100px]" />
        </div>
        <div
          className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg"
          onClick={() => {
            setChooseTags(false);
            setChooseIssue(false);
            setChooseProject(false);
            if (selectedIssue !== undefined || selectedIssue !== null) {
              setIssueSearch(selectedIssue?.title || '');
            }
            if (tagsSearch.endsWith(',')) {
              setTagsSearch(tagsSearch.slice(0, tagsSearch.length - 1));
            }
          }}
        >
          <div className="text-lg font-semibold xl:text-xl 3xl:text-2xl ">
            issue details
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 uppercase ">
              <div>Choose a project</div>
              <QuestionMarkCircleIcon className="h-5 w-5 " />
            </div>
            <div className="relative">
              <Input
                placeholder="type and select a project that you want to create an issue on"
                searchLeft={true}
                value={projectSearch}
                onChange={(e) => {
                  setProjectSearch(e.target.value);
                }}
                inputClassName="text-2xs xl:text-xs 3xl:text-sm"
                className="absolute"
                onClick={(e) => {
                  e.stopPropagation();
                  setChooseProject(true);
                }}
              />
              <div
                className={`gradient-border-box-bottom absolute z-[40] h-[24rem] w-full flex-col gap-2 overflow-y-auto rounded-b-xl border-b bg-light-gray px-6 py-2 drop-shadow-xl xl:h-[29.5rem] ${
                  chooseProject ? 'flex' : 'hidden'
                }`}
              >
                {!projectsLoading &&
                  ProjectSearch !== undefined &&
                  ProjectSearch.map((_project: any, idx: number) => (
                    <ProjectItem
                      item={_project}
                      selectedProject={selectedProject}
                      setProjectSearch={setProjectSearch}
                      setSelectedProject={setSelectedProject}
                      setChooseProject={setChooseProject}
                      key={idx}
                    />
                  ))}
                {projectsLoading && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                    <Spinner />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 uppercase ">
              <div>Choose or Create an Issue</div>
              <QuestionMarkCircleIcon className="h-5 w-5 " />
            </div>
            <div className="relative">
              <Input
                placeholder="type and select an issue to import it or create a new one"
                searchLeft={true}
                value={issueSearch}
                onChange={(e) => {
                  setIssueSearch(e.target.value);
                }}
                inputClassName="text-2xs xl:text-xs 3xl:text-sm"
                className="absolute"
                onClick={(e) => {
                  e.stopPropagation();
                  setChooseIssue(true);
                }}
              />
              <div
                className={`gradient-border-box-bottom absolute z-[40] h-[24rem] w-full flex-col gap-2 overflow-y-auto rounded-b-xl border-b bg-light-gray px-6 py-2 drop-shadow-xl xl:h-[29.5rem] ${
                  chooseIssue ? 'flex' : 'hidden'
                }`}
              >
                <div
                  className="my-1 flex cursor-pointer items-center gap-3 rounded-lg bg-[#1D2025] px-4 py-2 text-3xs drop-shadow-lg xl:text-2xs 3xl:text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIssueDescription('');
                    setTagsSearch('');
                    setIssueType('create');
                    setChooseIssue(false);
                    setSelectedIssue({
                      title: issueSearch,
                    });
                  }}
                >
                  <PlusIcon className="h-6 w-6" />
                  <div>Create</div>
                  <div>{issueSearch}</div>
                </div>
                {!issuesLoading &&
                  IssuesSearch !== undefined &&
                  IssuesSearch.map((_issue: string, idx: number) => (
                    <IssueItem
                      item={_issue}
                      selectedIssue={selectedIssue}
                      setIssueSearch={setIssueSearch}
                      setSelectedIssue={setSelectedIssue}
                      setChooseIssue={setChooseIssue}
                      setIssueType={setIssueType}
                      setIssueDescription={setIssueDescription}
                      setTagsSearch={setTagsSearch}
                      key={idx}
                    />
                  ))}
                {issuesLoading && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                    <Spinner />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 uppercase ">
              <div>Issue Description</div>
              <QuestionMarkCircleIcon className="h-5 w-5 " />
            </div>
            <Textarea
              placeholder="describe the issue in detail so that developers know how to solve it. like all issues in software, the more descriptive you can be about it, the easier it will be for developers to solve it "
              value={issueDescription}
              disabled={issueType === 'import'}
              onChange={(e) => setIssueDescription(e.target.value)}
              inputClassName="text-2xs xl:text-xs 3xl:text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 uppercase ">
              <div>Select Tags</div>
              <QuestionMarkCircleIcon className="h-5 w-5 " />
            </div>
            <div className="relative">
              <Input
                placeholder="search for an issue tag or select one or more from the list"
                searchLeft={true}
                value={tagsSearch}
                onChange={(e) => setTagsSearch(e.target.value)}
                inputClassName="text-2xs xl:text-xs 3xl:text-sm"
                className="absolute"
                disabled={issueType === 'import'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (issueType !== 'import') {
                    setChooseTags(true);
                  }
                }}
              />
              <div
                className={`gradient-border-box-bottom absolute z-[40] h-[12rem] w-full flex-col gap-2 overflow-y-auto rounded-b-xl border-b bg-light-gray px-6 py-2 drop-shadow-xl xl:h-[14rem] ${
                  chooseTags ? 'flex' : 'hidden'
                }`}
              >
                {TagsSearch.map((_tag: string, idx: number) => (
                  <TagItem
                    tag={_tag}
                    addTag={addTag}
                    tagsSearch={tagsSearch}
                    key={idx}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex w-[40%] flex-col gap-2">
              <div className="flex items-center gap-3 uppercase ">
                <div>Token Incentive</div>
                <QuestionMarkCircleIcon className="h-5 w-5 " />
              </div>
              <Input
                placeholder="0"
                value={tokenIncentive}
                onChange={(e) => setTokenIncentive(parseFloat(e.target.value))}
                type="number"
                inputClassName="text-2xs xl:text-xs 3xl:text-sm"
              />
            </div>
            <div className="flex w-[55%] flex-col gap-2">
              <div className="flex items-center gap-3 uppercase ">
                <div>
                  USDC Incentive{' '}
                  <div className="normal inline text-gray-400">(optional)</div>
                </div>
                <QuestionMarkCircleIcon className="h-5 w-5 " />
              </div>
              <Input
                placeholder="0"
                value={usdcIncentive}
                onChange={(e) => setUsdcIncentive(parseFloat(e.target.value))}
                type="number"
                inputClassName="text-2xs xl:text-xs 3xl:text-sm"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <div
              className="w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg"
              onClick={AddIssueToDefiOS}
            >
              create
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
