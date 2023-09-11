import React, { useState } from 'react';
import Button from '@/components/ui/button/button';
import { Close } from '@/components/icons/close';
import { Check } from '@/components/icons/check';
import { ArrowDownIcon } from '@heroicons/react/24/solid';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { setRefetch } from '@/store/refetchSlice';
import { addChildObjectiveToObjective } from '@/lib/helpers/contractInteract';

import { selectUserMapping } from '@/store/userMappingSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import ListCard from '@/components/ui/list-card';

import { CogIcon } from '@/components/icons/cog';
import { WenchScrewdriverIcon } from '@/components/icons/wench-screwdriver';
import { BookOpenIcon } from '@/components/icons/book-open';
import { CloudIcon } from '@/components/icons/cloud';
import { ArchiveBoxIcon } from '@/components/icons/archive-box';

import { LockIcon } from '@/components/icons/lock';
import { ClockIcon } from '@/components/icons/clock';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import mixpanel from 'mixpanel-browser';

export const deliverableList = [
  {
    name: 'Infrastructure',
    element: <CogIcon />,
  },
  {
    name: 'Tooling',
    element: <WenchScrewdriverIcon />,
  },
  {
    name: 'Publication',
    element: <BookOpenIcon />,
  },
  {
    name: 'Product',
    element: <CloudIcon />,
  },
  {
    name: 'Other',
    element: <ArchiveBoxIcon />,
  },
];

export const stateList = [
  {
    name: 'Locked',
    element: <LockIcon />,
  },
  {
    name: 'InProgress',
    element: <ClockIcon />,
  },
  {
    name: 'Closed',
    element: <XMarkIcon className="h-6 w-6 text-white" />,
  },
  {
    name: 'Deprecated',
    element: <ExclamationTriangleIcon className="h-6 w-6 text-white" />,
  },
];

interface ObjectiveLinkProps {
  objectiveSelected: any;
  setLinkObjectiveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ObjectiveLink: React.FC<ObjectiveLinkProps> = ({
  objectiveSelected,
  setLinkObjectiveModal,
}) => {
  const [chooseType, setChooseType] = useState<'Parent' | 'Child' | 'None'>(
    'None'
  );

  const [parentObjective, setParentObjective] = useState<any>(null);
  const [childObjective, setChildObjective] = useState<any>(null);

  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);

  const dispatch = useAppDispatch();

  const handleResetSelect = () => {
    setParentObjective(null);
    setChildObjective(null);
    setChooseType('None');
  };

  const handleSetParent = () => {
    if (chooseType === 'Parent' && objectiveSelected !== null) {
      if (
        childObjective !== null &&
        childObjective.objective_key === objectiveSelected.objective_key
      )
        return;
      setParentObjective({ ...objectiveSelected });
      setChooseType('None');
    }
  };

  const handleSetChild = () => {
    if (chooseType === 'Child' && objectiveSelected !== null) {
      if (
        parentObjective !== null &&
        parentObjective.objective_key === objectiveSelected.objective_key
      )
        return;
      setChildObjective({ ...objectiveSelected });
      setChooseType('None');
    }
  };

  const handleObjectiveLink = async () => {
    if (parentObjective === null || childObjective === null) return;
    dispatch(onLoading('linking the objectives...'));
    let resCalled = false;
    addChildObjectiveToObjective(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(parentObjective.objective_key),
      new PublicKey(childObjective.objective_key)
    )
      .then((res) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: 'Objectives linked Successfully',
            description: 'check out linked objectives at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: null,
          })
        );
        mixpanel.track('Objective Link Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          parent_objective_account: parentObjective.objective_key,
          parent_objective_issue_account:
            parentObjective.objective_issue_account,
          child_objective_account: childObjective.objective_key,
          child_objective_issue_account: childObjective.objective_issue_account,
        });
        dispatch(setRefetch('objective'));
      })
      .catch((err) => {
        console.log(err);
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Objectives Linking Failed',
            description: err.message,
            link: '',
            redirect: '/roadmaps',
          })
        );
        mixpanel.track('Objective Link Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Objectives Linked Successfully',
              description: '',
              link: '',
              redirect: null,
            })
          );
          mixpanel.track('Objective Link Success', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
          });
          dispatch(setRefetch('objective'));
        }
      });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex justify-between">
        <div className="mb-2 text-2xl font-bold text-primary xl:text-3xl 3xl:text-4xl">
          Link Objectives
        </div>
        <Close
          className="h-8 w-8 cursor-pointer font-bold text-white"
          onClick={() => setLinkObjectiveModal(false)}
        />
      </div>
      <div className="flex h-full w-full flex-col items-center gap-3 overflow-y-auto px-2 pr-5">
        <div className="relative mt-3 flex h-[35%] w-full flex-col gap-1 overflow-y-auto rounded-lg border border-gray-600 px-5 py-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="text-base text-primary xl:text-lg 3xl:text-xl">
                Parent Objective
              </div>
              {chooseType === 'Parent' &&
                objectiveSelected !== null &&
                parentObjective === null && (
                  <div
                    className="bg-newDark flex w-fit cursor-pointer items-center justify-center rounded-full border-2 border-new-green py-0.5 px-8 text-xs font-semibold text-new-green xl:text-sm 3xl:text-base"
                    onClick={handleSetParent}
                  >
                    Confirm
                  </div>
                )}
            </div>
            {chooseType === 'Parent' && parentObjective === null && (
              <Close
                className="h-6 w-6 cursor-pointer font-bold text-white"
                onClick={() => setChooseType('None')}
              />
            )}
            {parentObjective !== null && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-new-blue">
                <Check />
              </div>
            )}
          </div>
          {((objectiveSelected !== null && chooseType === 'Parent') ||
            parentObjective !== null) && (
            <>
              <div className="text-sm font-semibold xl:text-base 3xl:text-lg">
                {parentObjective !== null
                  ? parentObjective.objective_title
                  : objectiveSelected.objective_title}
              </div>
              <div className="text-2xs xl:text-xs 3xl:text-sm">
                {parentObjective !== null
                  ? parentObjective.objective_description
                  : objectiveSelected.objective_description}
              </div>
              <div className="mt-2 flex gap-2">
                <ListCard
                  item={{
                    name:
                      parentObjective !== null
                        ? parentObjective.objective_deliverable
                        : objectiveSelected.objective_deliverable,
                    element: deliverableList.filter((item) => {
                      return (
                        item.name ===
                        (parentObjective !== null
                          ? parentObjective.objective_deliverable
                          : objectiveSelected.objective_deliverable)
                      );
                    })[0].element,
                  }}
                  className="rounded-full bg-black p-2 pr-4"
                />
                <ListCard
                  item={{
                    name:
                      parentObjective !== null
                        ? parentObjective.objective_state
                        : objectiveSelected.objective_state,
                    element: stateList.filter((item) => {
                      return (
                        item.name ===
                        (parentObjective !== null
                          ? parentObjective.objective_state
                          : objectiveSelected.objective_state)
                      );
                    })[0].element,
                  }}
                  className="rounded-full bg-black p-2 pr-4"
                />
              </div>
            </>
          )}
          {objectiveSelected === null &&
            chooseType === 'Parent' &&
            parentObjective === null && (
              <>
                <div className="m-auto text-sm xl:text-base 3xl:text-lg">
                  Choose Objective from DAG Tree
                </div>
              </>
            )}
          {chooseType !== 'Parent' && parentObjective === null && (
            <div
              className="bg-newDark flex w-fit cursor-pointer items-center justify-center rounded-full border-2 border-gray-400 py-0.5 px-8 text-xs font-semibold text-gray-400 xl:text-sm 3xl:text-base"
              onClick={() => setChooseType('Parent')}
            >
              Choose Parent Objective
            </div>
          )}
        </div>
        <ArrowDownIcon className="h-10 w-10 text-white" />
        <div className="relative flex h-[35%] w-full flex-col gap-1 overflow-y-auto rounded-lg border border-gray-600 px-5 py-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="text-base text-primary xl:text-lg 3xl:text-xl">
                Child Objective
              </div>
              {chooseType === 'Child' &&
                objectiveSelected !== null &&
                childObjective === null && (
                  <div
                    className="bg-newDark flex w-fit cursor-pointer items-center justify-center rounded-full border-2 border-new-green py-0.5 px-8 text-xs font-semibold text-new-green xl:text-sm 3xl:text-base"
                    onClick={handleSetChild}
                  >
                    Confirm
                  </div>
                )}
            </div>
            {chooseType === 'Child' && childObjective === null && (
              <Close
                className="h-6 w-6 cursor-pointer font-bold text-white"
                onClick={() => setChooseType('None')}
              />
            )}
            {childObjective !== null && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-new-blue">
                <Check />
              </div>
            )}
          </div>
          {((objectiveSelected !== null && chooseType === 'Child') ||
            childObjective !== null) && (
            <>
              <div className="text-sm font-semibold xl:text-base 3xl:text-lg">
                {childObjective !== null
                  ? childObjective.objective_title
                  : objectiveSelected.objective_title}
              </div>
              <div className="text-2xs xl:text-xs 3xl:text-sm">
                {childObjective !== null
                  ? childObjective.objective_description
                  : objectiveSelected.objective_description}
              </div>
              <div className="mt-2 flex gap-2">
                <ListCard
                  item={{
                    name:
                      childObjective !== null
                        ? childObjective.objective_deliverable
                        : objectiveSelected.objective_deliverable,
                    element: deliverableList.filter((item) => {
                      return (
                        item.name ===
                        (childObjective !== null
                          ? childObjective.objective_deliverable
                          : objectiveSelected.objective_deliverable)
                      );
                    })[0].element,
                  }}
                  className="rounded-full bg-black p-2 pr-4"
                />
                <ListCard
                  item={{
                    name:
                      childObjective !== null
                        ? childObjective.objective_state
                        : objectiveSelected.objective_state,
                    element: stateList.filter((item) => {
                      return (
                        item.name ===
                        (childObjective !== null
                          ? childObjective.objective_state
                          : objectiveSelected.objective_state)
                      );
                    })[0].element,
                  }}
                  className="rounded-full bg-black p-2 pr-4"
                />
              </div>
            </>
          )}
          {objectiveSelected === null &&
            chooseType === 'Child' &&
            childObjective === null && (
              <>
                <div className="m-auto text-sm xl:text-base 3xl:text-lg">
                  Choose Objective from DAG Tree
                </div>
              </>
            )}
          {chooseType !== 'Child' && childObjective === null && (
            <div
              className="bg-newDark flex w-fit cursor-pointer items-center justify-center rounded-full border-2 border-gray-400 py-0.5 px-8 text-xs font-semibold text-gray-400 xl:text-sm 3xl:text-base"
              onClick={() => setChooseType('Child')}
            >
              Choose Child Objective
            </div>
          )}
        </div>
        <div className="flex w-full flex-col">
          <div
            className="bg-newDark flex w-fit cursor-pointer items-center justify-center rounded-full border-2 border-new-red py-1 px-8 text-sm font-semibold text-new-red xl:text-base 3xl:text-lg"
            onClick={() => handleResetSelect()}
          >
            Reset
          </div>
          <div
            className="bg-newDark mt-4 flex w-full cursor-pointer items-center justify-center rounded-full border-2 border-primary py-1 px-8 text-sm font-semibold text-primary xl:text-base 3xl:text-lg"
            onClick={() => handleObjectiveLink()}
          >
            Link the Objectives
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveLink;
