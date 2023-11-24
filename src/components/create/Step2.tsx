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
import Button from '@/components/ui/button/ButtonNew';
import Tooltip from '@/components/ui/Tooltip';

import { useAppSelector, useAppDispatch } from '@/store/store';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { setStep2Data } from '@/store/newCreationSlice';

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
      <div className={'lineGradientHorizontalGray h-0.5 w-full'}></div>
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
      <div className={'lineGradientHorizontalGray h-0.5 w-full'}></div>
    </div>
  );
};

interface Step2Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step2: React.FC<Step2Props> = ({ setStep }) => {
  const step2Data = useAppSelector((state) => state.newCreation.step2);

  const [chooseTags, setChooseTags] = useState(false);
  const [tagsSearch, setTagsSearch] = useState('');

  const [issueDescription, setIssueDescription] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  const [chooseIssue, setChooseIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>();
  const [issueType, setIssueType] = useState<'import' | 'create'>('create');

  const [tokenIncentive, setTokenIncentive] = useState(0);
  const [usdcIncentive, setUsdcIncentive] = useState(0);

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const repoURL = useAppSelector((state) => state.newCreation.step1.repoLink);
  const [repoIssues, setRepoIssues] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nextError, setNextError] = useState('');

  const getIssues = async () => {
    setIsLoading(true);
    axios
      .get(
        repoURL.replace(
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
      .then((res) => {
        const filteredIssues = res.data.filter((item: any) => {
          return !Object.keys(item).includes('pull_request');
        });
        setRepoIssues(filteredIssues);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

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
    if (session && (session as any)?.accessToken && repoIssues.length === 0) {
      getIssues();
      setSelectedIssue(step2Data.selectedIssue);
      setIssueSearch(step2Data.issueTitle);
      setIssueDescription(step2Data.issueDescription);
      setTagsSearch(
        step2Data.tags.length > 1
          ? step2Data.tags.join(',')
          : step2Data.tags.join('')
      );
      setTokenIncentive(step2Data.tokenIncentive);
      setUsdcIncentive(step2Data.usdcIncentive);
      setIssueType(step2Data.issueType);
    }
  }, [session]);

  const handleSubmit = () => {
    if (
      issueSearch === '' ||
      selectedIssue === null ||
      selectedIssue === undefined
    ) {
      setNextError('select or create an issue.');
      return;
    }
    setNextError('');
    if (issueType === 'create') {
      const TagsRefined = tagsSearch
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
      dispatch(
        setStep2Data({
          issueType: 'create',
          issueTitle: issueSearch,
          issueDescription: issueDescription,
          selectedIssue: selectedIssue,
          tokenIncentive: tokenIncentive,
          usdcIncentive: usdcIncentive,
          tags: TagsRefined,
          issueNumber: undefined,
          issueLink: undefined,
        })
      );
      setStep(3);
    }
    if (issueType === 'import') {
      const TagsRefined = tagsSearch
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
      dispatch(
        setStep2Data({
          issueType: 'import',
          issueTitle: issueSearch,
          issueDescription: issueDescription,
          selectedIssue: selectedIssue,
          tokenIncentive: tokenIncentive,
          usdcIncentive: usdcIncentive,
          tags: TagsRefined,
          issueNumber: selectedIssue.number,
          issueLink: selectedIssue.html_url,
        })
      );
      setStep(3);
    }
  };

  return (
    <div
      className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg"
      onClick={() => {
        setChooseTags(false);
        setChooseIssue(false);
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
          <div>Choose or Create an Issue</div>
          <Tooltip
            note={`Select or create an issue on your repository that you want to see solved. tokens you created in the last step will be staked on it.`}
            direction="top-left"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 " />
          </Tooltip>
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
            {!isLoading &&
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
          <div>Issue Description</div>
          <Tooltip
            note={`Remember to be as descriptive as possible to help developers solve this effectively - who are unfamiliar with your codebase.`}
            direction="top-left"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 " />
          </Tooltip>
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
          <Tooltip
            note={`if this is a new issue, tags will automatically be created. for existing issues, any new tags added here will be automatically added to your repository.`}
            direction="top-left"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 " />
          </Tooltip>
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
            <Tooltip
              note={`You can choose to stake USDC on this issue if this needs an urgent solution and your existing token has no $ value.`}
              direction="top-left"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 " />
            </Tooltip>
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
        <div className="normal w-full text-xs text-red-400 xl:text-sm 3xl:text-base">
          {nextError}
        </div>
        <Button color="PrimaryOutline" onClick={() => setStep(1)}>
          back
        </Button>
        <Button color="PrimarySolid" onClick={handleSubmit}>
          next
        </Button>
      </div>
    </div>
  );
};

export default Step2;
