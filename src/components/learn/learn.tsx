import React, { useState, useEffect, useCallback } from 'react';
import _debounce from 'lodash/debounce';
import axios from '@/lib/axiosClient';
import { useAppSelector } from '@/store/store';
import mixpanel from 'mixpanel-browser';

//UI components
import Input from '@/components/ui/forms/input';
import ListCard from '@/components/ui/list-card';
import Spinner from '@/components/custom/spinner';
import Button from '@/components/ui/button/ButtonNew';

//Icons
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

//Components
import SpotlightProject from '@/components/learn/spotlightProject';
import LearnIssue from '@/components/learn/learnIssue';
import LearnContent from '@/components/learn/learnContent';
import ProgressBar from '@/components/ui/progress-bar';

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  preSearch: boolean;
  setPreSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<SearchProps> = ({
  search,
  setSearch,
  preSearch,
  setPreSearch,
  isLoading,
  setIsLoading,
  setTriggerSearch,
}) => {
  const handleDebounceFn = () => {
    if (preSearch) {
      setPreSearch(false);
    }
    setTriggerSearch(true);
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 500), []);

  const texts = [
    'Type in what you want to learn',
    'Solve relevant open source issues',
    'Read recommended educational material',
    'Upgrade your resume',
  ];

  const trending = [
    'How to make my first open source contribution?',
    'I want to learn react js',
    'Solana dev for beginners',
  ];

  const [placeholderText, setPlaceholderText] = useState(
    'Type in what you want to learn'
  );

  useEffect(() => {
    setTimeout(() => {
      const index = texts.findIndex((text) => placeholderText === text);
      const nextText = index + 1 < texts.length ? texts[index + 1] : texts[0];
      setPlaceholderText(nextText);
    }, 3500);
  }, [placeholderText]);

  return (
    <div className="relative mt-3 flex w-full flex-col gap-3 rounded-full ">
      <Input
        className="w-full"
        inputClassName="3xl:!h-[4rem] 2xl:!h-[4rem] !h-[4rem] 3xl:!text-xl xl:!text-lg !text-base !px-6 !rounded-2xl"
        placeholder={placeholderText}
        value={search}
        searchLeft={true}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            debounceFn();
          }
        }}
      />
      {preSearch && (
        <div className="flex items-center gap-2">
          {/* <div className="ml-2 text-sm text-gray-400 xl:text-base 3xl:text-lg">
          Trending Now:
        </div> */}
          {trending.map((text, idx) => {
            return (
              <div
                onClick={() => {
                  setSearch(text);
                  debounceFn();
                }}
                key={idx}
                className="cursor-pointer"
              >
                <ListCard
                  item={{
                    name: text,
                    element: <GlobeAltIcon className="h-8 w-8" />,
                  }}
                  className="cursor-pointer rounded-full px-4 py-1.5 transition-transform hover:-translate-y-0.5 xl:py-2 3xl:py-2.5"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface LearnProps {}

const Learn: React.FC<LearnProps> = ({}) => {
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [preSearch, setPreSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [retries, setRetries] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const [completed, setCompleted] = useState(0);
  const [numClosed, setNumClosed] = useState(0);

  const [learnRes, setLearnRes] = useState<any>(null);
  const [featuredProject, setFeaturedProject] = useState<any>(null);

  const handleSearch = async () => {
    if (search === '') return;
    setTriggerSearch(false);
    setErrorMessage('');
    setIsLoading(true);

    let data = JSON.stringify({
      user_request: search,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/learn/search`,
      headers: {
        Authorization: firebase_jwt,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((res) => {
        setLearnRes(res.data);
        setIsLoading(false);
        setRetries(3);
        setErrorMessage('');
        mixpanel.track('Learn Search Success', {
          learnQuery: res?.data?.learn_search_last_query,
          learnIssuesCount: res?.data?.search_results?.length,
          learnIssues: res?.data?.search_results,
          learnContentCount: res?.data?.learning_resources?.length,
          learnContent: res?.data?.learning_resources,
        });
        localStorage.setItem('learn-used', 'true');
      })
      .catch((error) => {
        console.log(error);
        if (retries > 0) {
          setRetries(retries - 1);
          mixpanel.track('Learn Search Error Retying', {
            learnQuery: search,
            error: error.message,
            retriesLeft: retries,
          });
          setTriggerSearch(true);
        } else {
          mixpanel.track('Learn Search Failed', {
            learnQuery: search,
            error: error.message,
          });
          setErrorMessage('Something went wrong try again after some time');
          setPreSearch(true);
          setIsLoading(false);
        }
      });
  };

  const handleResume = async () => {
    if (preSearch) {
      setPreSearch(false);
    }
    setErrorMessage('');
    setIsLoading(true);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/learn/search/cached`,
      headers: {
        Authorization: firebase_jwt,
        'Content-Type': 'application/json',
      },
    };

    axios
      .request(config)
      .then((res) => {
        setLearnRes(res.data);
        setSearch(res.data.learn_search_last_query);
        setIsLoading(false);
        setErrorMessage('');
        mixpanel.track('Learn Cached Success', {
          learnQuery: res?.data?.learn_search_last_query,
          learnIssuesCount: res?.data?.search_results?.length,
          learnIssues: res?.data?.search_results,
          learnContentCount: res?.data?.learning_resources?.length,
          learnContent: res?.data?.learning_resources,
        });
      })
      .catch((error) => {
        mixpanel.track('Learn Cached Failed', {
          error: error.message,
        });
        console.log(error);
        setIsLoading(false);
        setPreSearch(true);
        setErrorMessage('Something went wrong try again after some time');
      });
  };

  const getSpotlight = async () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/daily/featured?daily_featured=repo`,
        {
          headers: {
            Authorization: firebase_jwt,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        if (res.data.featured_repo) {
          setFeaturedProject(res.data.featured_repo);
        }
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    if (preSearch) {
      getSpotlight();
    }
    if (triggerSearch && search !== '') {
      handleSearch();
    }
  }, [triggerSearch]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-3.5 pb-4">
      <div className="mb-5 w-full flex-col items-center gap-6">
        <div className="w-full">
          <Search
            search={search}
            setSearch={setSearch}
            preSearch={preSearch}
            setPreSearch={setPreSearch}
            setTriggerSearch={setTriggerSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
        {isLoading && (
          <div className="mt-20">
            <Spinner label="fetching suitable learning path for you" />
          </div>
        )}
        {errorMessage !== '' && (
          <div className="mt-20 flex w-full items-center justify-center text-center text-sm xl:text-base 3xl:text-lg">
            {errorMessage}
          </div>
        )}
      </div>

      {!preSearch && !isLoading && errorMessage === '' && (
        <div className="flex flex-col items-center gap-3">
          {learnRes !== null &&
            learnRes !== undefined &&
            learnRes.search_results &&
            learnRes.search_results.length !== completed && (
              <div className="w-full rounded-xl border border-dashed border-gray-600 p-4">
                <ProgressBar
                  title="some motivational text"
                  completed={{
                    value: completed,
                    percentage:
                      (completed / learnRes.search_results.length) * 100,
                  }}
                  remaining={{
                    value: learnRes.search_results.length - completed,
                    percentage:
                      ((learnRes.search_results.length - completed) /
                        learnRes.search_results.length) *
                      100,
                  }}
                />
              </div>
            )}
          {learnRes !== null &&
            learnRes !== undefined &&
            learnRes.search_results &&
            (learnRes.search_results.length === completed ||
              learnRes.search_results.length === numClosed) && (
              <div className="flex w-full items-center justify-between rounded-xl border border-gray-600 bg-body px-4 py-2 text-sm lg:border-2 xl:py-2.5 xl:text-base 3xl:py-3 3xl:text-lg">
                <div>
                  {numClosed === completed
                    ? '🎉 Well done! You have completed this learning path'
                    : 'All the issues on this learning path are closed'}
                </div>
                <Button
                  onClick={() => {
                    setSearch(learnRes?.learn_search_last_query);
                    setTriggerSearch(true);
                  }}
                >
                  Explore More Issues
                </Button>
              </div>
            )}
          {learnRes !== null &&
            learnRes !== undefined &&
            learnRes.search_results &&
            learnRes.search_results.map((item: any, idx: number) => {
              return (
                <LearnIssue
                  setNumClosed={setNumClosed}
                  setCompleted={setCompleted}
                  item={item}
                  key={idx}
                />
              );
            })}
          {learnRes !== null &&
            learnRes !== undefined &&
            learnRes.learning_resources &&
            learnRes.learning_resources.map((item: any, idx: number) => {
              return <LearnContent item={item} key={idx} />;
            })}
        </div>
      )}

      {preSearch && !isLoading && (
        <div className="fixed bottom-5 flex w-[95%] flex-col gap-3 lg:w-[78%]">
          {featuredProject !== null && featuredProject !== undefined && (
            <SpotlightProject item={featuredProject} />
          )}
          {localStorage.getItem('learn-used') !== undefined &&
            localStorage.getItem('learn-used') !== null && (
              <div className="flex w-full items-center justify-between rounded-xl border border-gray-600 bg-body px-4 py-2 text-sm lg:border-2 xl:py-2.5 xl:text-base 3xl:py-3 3xl:text-lg">
                <div>
                  You seem to have dropped off midway during your last web
                  development learning path.
                </div>
                <Button onClick={handleResume} size="small">
                  <div className="flex items-center gap-2">
                    <div>Resume Now</div>
                    <ArrowRightIcon className="h-5 w-5" />
                  </div>
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Learn;
