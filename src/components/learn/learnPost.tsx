import React, { useState, useEffect, useCallback } from 'react';
import _debounce from 'lodash/debounce';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button';

import { ArrowLongDownIcon } from '@heroicons/react/24/solid';
import LearnIssue from '@/components/learn/learnIssue';
import LearnContent from '@/components/learn/learnContent';
import ProgressBar from '@/components/ui/progress-bar';

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

  return (
    <div className="relative mt-3 flex w-full flex-col gap-3 rounded-full ">
      <Input
        className="w-full"
        inputClassName="3xl:!h-[4rem] 2xl:!h-[4rem] !h-[4rem] 3xl:!text-xl xl:!text-lg !text-base !px-6 !rounded-2xl"
        placeholder={'Search'}
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
    </div>
  );
};

interface LearnProps {}

const Learn: React.FC<LearnProps> = ({}) => {
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-3.5 pb-4">
      <div className="mb-5 w-full flex-col items-center justify-between">
        <div className="w-full">
          <Search
            search={search}
            setSearch={setSearch}
            setTriggerSearch={setTriggerSearch}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-full rounded-xl border border-dashed border-gray-600 p-4">
          <ProgressBar
            title="some motivational text"
            completed={{ value: 3, percentage: 60 }}
            remaining={{ value: 2, percentage: 40 }}
            item="issues"
          />
        </div>
        <ArrowLongDownIcon className="h-12" />
        <div className="flex w-full items-center justify-between rounded-xl border border-gray-600 bg-body px-4 py-2 text-sm lg:border-2 xl:py-2.5 xl:text-base 3xl:py-3 3xl:text-lg">
          <div>🎉 Well done! You have completed this learning path</div>
          <Button size="small" shape="rounded" color="info">
            <div className="flex items-center gap-2">
              <div>Explore More Issues</div>
            </div>
          </Button>
        </div>
        <LearnIssue />
        <LearnContent />
      </div>
    </div>
  );
};

export default Learn;
