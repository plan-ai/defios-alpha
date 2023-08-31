import React, { useState, useEffect, Fragment } from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import ProgressBar from '@/components/ui/progress-bar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';
import cn from 'classnames';
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
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl bg-light-gray px-4 text-2xs text-white xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
          <div>
            {selectedSubmitPR.title.length > 60
              ? selectedSubmitPR.title.slice(0, 60) + '...'
              : selectedSubmitPR.title}
          </div>
          <div className="font-semibold">
            {selectedSubmitPR.id !== -1 ? '#' + selectedSubmitPR.id : null}
          </div>
          <ChevronDown className="w-6 text-gray-400" />
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
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-light-gray p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item: any) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-zinc-900' : 'hover:bg-zinc-700'
                    }`}
                  >
                    <div>
                      {item.title.length > 60
                        ? item.title.slice(0, 60) + '...'
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

  const [section, setSection] = useState(2);

  const [selectedPR, setSelectedPR] = useState<any>();

  const [PRSort, setPRSort] = useState<any>([
    {
      id: -1,
      title: 'select the pull request that you wish to submit',
      PR_link: '',
    },
  ]);

  const [selectedSubmitPR, setSelectedSubmitPR] = useState<any>({
    id: -1,
    title: 'select the pull request that you wish to submit',
    PR_link: '',
  });

  return (
    <div className="mt-16 flex w-full items-center justify-end text-sm xl:text-base 3xl:text-lg">
      {section === 1 && (
        <div className="mx-auto flex w-[42rem] w-full flex-col items-center gap-8">
          <div className="flex w-full items-center justify-between text-3xl xl:text-4xl 3xl:text-5xl">
            <div className="textShadowWhite">total rewards: </div>
            <div className="textShadowGreen text-new-green">$5432</div>
          </div>
          <div className="my-8 flex flex-col items-center gap-2 text-center text-base xl:text-lg 3xl:text-xl">
            <div>
              submit a pull request that solves this issue for a chance to win
              the reward.
            </div>
            <div>
              if your pull request gets merged, you&apos;ll receive the rewards
              automatically
            </div>
            {/* <div>
              as the repository owner, you can directly merge your PR that
              solves this issue to claim all the rewards
            </div>
            <div>
              you can also scroll down & review the current PRs to reward
              someone else
            </div> */}
          </div>

          {/* Submit PR */}
          <div className="flex w-full items-center justify-center gap-4">
            <SortList
              sort={PRSort}
              selectedSubmitPR={selectedSubmitPR}
              setSelectedSubmitPR={setSelectedSubmitPR}
            />
            <div className="z-[40] w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg">
              submit
            </div>

            {/* <div className="z-[40] w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg">
              merge
            </div> */}
          </div>
        </div>
      )}
      {section === 2 && (
        <div className="mx-32 flex w-full flex-col items-center gap-8">
          <div className="textShadowWhite mb-8 text-xl font-semibold xl:text-2xl 3xl:text-3xl">
            Vote for a PR
            {/* Merge a PR */}
          </div>
          <PRBox />
          <PRBox />
          <PRBox />
        </div>
      )}
      {/* switcher */}
      <div className="flex flex-col items-center gap-8">
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 1,
            'h-4 w-4': section !== 1,
          })}
          onClick={() => setSection(1)}
        ></div>
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 2,
            'h-4 w-4': section !== 2,
          })}
          onClick={() => setSection(2)}
        ></div>
      </div>
    </div>
  );
};

export default IssuePullRequests;
