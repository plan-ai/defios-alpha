import React, { useState, useEffect, Fragment } from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import ProgressBar from '@/components/ui/progress-bar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';

import {
  addPullRequest,
  acceptPr,
  stakeIssue,
  unstakeIssue,
  stakePr,
  unstakePr,
} from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setRefetch } from '@/store/refetchSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

import PRBox from '@/components/issue-details/PRBox';

const sort = [
  { id: 1, name: 'Repository creator' },
  { id: 2, name: 'By amount of code contributed (minified)' },
  { id: 3, name: 'By duration of project involvement (compute intensive)' },
];

interface SortListProps {
  sort: any;
  selectedSubmitPR: any;
  setSelectedSubmitPR: React.Dispatch<React.SetStateAction<any>>;
}

const SortList: React.FC<SortListProps> = ({
  sort,
  selectedSubmitPR,
  setSelectedSubmitPR,
}) => {
  return (
    <div className="relative w-full">
      <Listbox value={selectedSubmitPR} onChange={setSelectedSubmitPR}>
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl border border-gray-700 bg-light-dark px-4 text-2xs text-white xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
          <div>
            {selectedSubmitPR.title.length > 21
              ? selectedSubmitPR.title.slice(0, 20) + '...'
              : selectedSubmitPR.title}
          </div>
          <div className="font-semibold">
            {selectedSubmitPR.id !== -1 ? '#' + selectedSubmitPR.id : null}
          </div>
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
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-dark p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item: any) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-gray-800' : 'hover:bg-gray-700'
                    }`}
                  >
                    <div>
                      {item.title.length > 21
                        ? item.title.slice(0, 20) + '...'
                        : item.title}
                    </div>
                    <div className="font-semibold">
                      {item.id !== -1 ? '#' + item.id : null}
                    </div>
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

interface IssuePullRequestsProps {}

export const IssuePullRequests: React.FC<IssuePullRequestsProps> = ({}) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const wallet = useWallet();
  const { data: session } = useSession();
  const userMappingState = useAppSelector(selectUserMapping);

  const [selectedPR, setSelectedPR] = useState<any>();

  const [PRSort, setPRSort] = useState<any>([
    {
      id: -1,
      title: 'Select Pull Request',
      PR_link: '',
    },
  ]);

  const [selectedSubmitPR, setSelectedSubmitPR] = useState<any>({
    id: -1,
    title: 'Select Pull Request',
    PR_link: '',
  });

  return (
    <div className="mt-4 flex w-full flex-col gap-8 pb-12 text-sm xl:text-base 3xl:text-lg">
      {/* Submit PR */}
      <div className="flex w-full flex-col gap-4">
        <div className="text-base xl:text-lg 3xl:text-xl">
          Submit new pull request
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <SortList
            sort={PRSort}
            selectedSubmitPR={selectedSubmitPR}
            setSelectedSubmitPR={setSelectedSubmitPR}
          />
          <Button
            color="info"
            size="small"
            shape="rounded"
            // onClick={handlePRSubmit}
            isLoading={stateLoading === 'loading'}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="text-base xl:text-lg 3xl:text-xl">My Vote</div>
        <PRBox votingDone={true} percentage={51} />
      </div>
      <div className="flex w-full flex-col gap-4">
        <ProgressBar
          title="Open PRs"
          completed={{
            value: 70,
            percentage: 70,
          }}
          remaining={{
            value: 30,
            percentage: 30,
          }}
          item="voting"
          type="voting"
        />
        <PRBox winner={true} votingDone={true} percentage={51} />
        <PRBox votingDone={true} percentage={5} />
        <PRBox votingDone={true} percentage={14} />
      </div>
    </div>
  );
};

export default IssuePullRequests;
