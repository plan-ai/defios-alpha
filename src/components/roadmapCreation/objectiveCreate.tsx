import React, { useState, Fragment, useEffect, useCallback } from 'react';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Button from '@/components/ui/button/ButtonNew';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Close } from '@/components/icons/close';

import { useRouter } from 'next/router';
import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { setRefetch } from '@/store/refetchSlice';
import { addObjectiveToRoadmap } from '@/lib/helpers/contractInteract';

import { selectUserMapping } from '@/store/userMappingSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import AttachIssue from '@/components/roadmapCreation/attachIssue';

import mixpanel from 'mixpanel-browser';

const sortDeliverables = [
  { id: 1, name: 'Infrastructure', data: { infrastructure: {} } },
  { id: 2, name: 'Tooling', data: { tooling: {} } },
  { id: 3, name: 'Publication', data: { publication: {} } },
  { id: 4, name: 'Product', data: { product: {} } },
  { id: 5, name: 'Other', data: { other: {} } },
];

const sortObjectiveParent = [
  { id: 1, name: 'Root' },
  { id: 2, name: 'Selected Objective' },
];

interface SortListProps {
  sortLabel: string;
  sort: any;
  selectedItem: any;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
}

const SortList: React.FC<SortListProps> = ({
  sortLabel,
  sort,
  selectedItem,
  setSelectedItem,
}) => {
  return (
    <div className="relative w-full">
      <span className="text-gray-10 mb-3 block text-xs font-medium uppercase tracking-widest xl:text-sm 3xl:text-base">
        {sortLabel}
      </span>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex !h-9 w-full items-center justify-between rounded-xl border border-gray-700 bg-light-dark px-4 text-2xs text-white xl:text-xs 2xl:!h-10 3xl:!h-11 3xl:text-sm">
          {selectedItem.name}
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
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-xl bg-light-dark p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item: any) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-xl px-3 py-3 text-2xs font-medium text-white transition xl:text-xs 3xl:text-sm  ${
                      selected ? 'my-1 bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
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

interface ObjectiveCreateProps {
  projectAccount: string;
  objectiveSelected: any;
  setCreateObjectiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  existingObjIssueAcc: string[];
}

const ObjectiveCreate: React.FC<ObjectiveCreateProps> = ({
  projectAccount,
  objectiveSelected,
  setCreateObjectiveModal,
  existingObjIssueAcc,
}) => {
  const router = useRouter();

  const [objectiveTitle, setObjectiveTitle] = useState('');
  const [objectiveDescription, setObjectiveDescription] = useState('');
  const [objectiveIssue, setObjectiveIssue] = useState<any>();
  const [objectiveDeliverables, setObjectiveDeliverables] = useState(
    sortDeliverables[0]
  );

  const [parentType, setParentType] = useState(sortObjectiveParent[0]);

  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);

  const dispatch = useAppDispatch();

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [issuesData, setIssuesData] = useState<any>([]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 50,
      'search.issue_project_id': projectAccount,
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/issues`, {
        params: searchParams,
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        const dataFiltered = res.data.issues.filter((item: any) => {
          return !existingObjIssueAcc.includes(item.issue_account);
        });
        setIssuesData(dataFiltered);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [firebase_jwt, projectAccount]);

  const handleObjectiveCreate = async () => {
    if (
      objectiveTitle === '' ||
      objectiveDescription === '' ||
      objectiveIssue === null ||
      objectiveIssue === undefined
    )
      return;
    if (parentType.name !== 'Root' && objectiveSelected === null) return;
    dispatch(onLoading('Creating and adding Objective to Roadmap...'));
    let resCalled = false;
    addObjectiveToRoadmap(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      new PublicKey(projectAccount),
      new PublicKey(objectiveIssue.issue_account),
      objectiveIssue.issue_gh_url.split('/')[
        objectiveIssue.issue_gh_url.split('/').length - 1
      ],
      objectiveTitle,
      objectiveDescription,
      objectiveDeliverables.data,
      objectiveSelected ? objectiveSelected.objective_key : null
    )
      .then((res) => {
        resCalled = true;
        dispatch(
          onSuccess({
            label: 'Objective Added Successfully',
            description: 'check out added objective at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: null,
          })
        );
        mixpanel.track('Objective Creation Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          project_account: projectAccount,
          issue_account: objectiveIssue.issue_account,
          objective_id:
            objectiveIssue.issue_gh_url.split('/')[
              objectiveIssue.issue_gh_url.split('/').length - 1
            ],
          objective_title: objectiveTitle,
          objective_description: objectiveDescription,
          objective_deliverables: objectiveDeliverables.name,
          objective_parent: objectiveSelected
            ? objectiveSelected.objective_key
            : null,
        });
        dispatch(setRefetch('objective'));
      })
      .catch((err) => {
        console.log(err);
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Objective Creation Failed',
            description: err.message,
            link: '',
            redirect: '/roadmaps',
          })
        );
        mixpanel.track('Objective Creation Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Objective Added Successfully',
              description: '',
              link: '',
              redirect: null,
            })
          );
          mixpanel.track('Objective Creation Success', {
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
          Add Objective
        </div>
        <Close
          className="h-8 w-8 cursor-pointer font-bold text-white"
          onClick={() => setCreateObjectiveModal(false)}
        />
      </div>
      <div className="flex h-full w-full flex-col gap-1 overflow-y-auto px-2 pr-5">
        <Input
          id="objectivetitle"
          label="Title"
          placeholder="Enter Objective Title"
          className="w-full"
          type="text"
          value={objectiveTitle}
          onChange={(e) => setObjectiveTitle(e.target.value)}
        />
        <Textarea
          className="my-2 w-full"
          placeholder="Objective Description"
          inputClassName="text-xs xl:text-sm 3xl:text-base resize-none"
          label="Description"
          value={objectiveDescription}
          onChange={(e) => setObjectiveDescription(e.target.value)}
        />
        <div className="flex w-full gap-2">
          <SortList
            sortLabel="Deliverables"
            sort={sortDeliverables}
            selectedItem={objectiveDeliverables}
            setSelectedItem={setObjectiveDeliverables}
          />
          <SortList
            sortLabel="Parent"
            sort={sortObjectiveParent}
            selectedItem={parentType}
            setSelectedItem={setParentType}
          />
        </div>
        <AttachIssue
          issue={objectiveIssue}
          setIssue={setObjectiveIssue}
          issueData={issuesData}
        />
        <Button
          onClick={() => handleObjectiveCreate()}
          className="ml-auto mt-auto"
          color="PrimarySolid"
        >
          Add Objective
        </Button>
      </div>
    </div>
  );
};

export default ObjectiveCreate;
