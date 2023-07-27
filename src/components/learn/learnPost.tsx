import React, { useState, useEffect, useCallback } from 'react';
import _debounce from 'lodash/debounce';
import Input from '@/components/ui/forms/input';
import ListCard from '@/components/ui/list-card';
import { SearchIcon } from '@/components/icons/search';
import Button from '@/components/ui/button';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

import SpotlightProject from '@/components/learn/spotlightProject';

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
          if (e.key === 'Enter') {
            debounceFn();
          }
        }}
      />
      <div className="flex items-center gap-2">
        {/* <div className="ml-2 text-sm text-gray-400 xl:text-base 3xl:text-lg">
          Trending Now:
        </div> */}
        {trending.map((text, idx) => {
          return (
            <ListCard
              key={idx}
              item={{
                name: text,
                element: <GlobeAltIcon className="h-8 w-8" />,
              }}
              className="rounded-full px-4 py-1.5 transition-transform hover:-translate-y-0.5 xl:py-2 3xl:py-2.5"
            />
          );
        })}
      </div>
    </div>
  );
};

interface LearnProps {}

const Learn: React.FC<LearnProps> = ({}) => {
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  return (
    <div className="mx-auto w-full">
      <div className="mb-5 w-full flex-col items-center justify-between">
        <div className="w-full">
          <Search
            search={search}
            setSearch={setSearch}
            setTriggerSearch={setTriggerSearch}
          />
        </div>
      </div>
      <div className="fixed bottom-5 flex w-[95%] flex-col gap-3 lg:w-[78%]">
        <SpotlightProject />
        <div className="flex w-full items-center justify-between rounded-xl border border-gray-600 bg-body px-4 py-2 text-sm lg:border-2 xl:py-2.5 xl:text-base 3xl:py-3 3xl:text-lg">
          <div>
            You seem to have dropped off midway during your last web development
            learning path.
          </div>
          <Button size="small" shape="rounded" color="info">
            <div className="flex items-center gap-2">
              <div>Resume Now</div>
              <ArrowRightIcon className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learn;
