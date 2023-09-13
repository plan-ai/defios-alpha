import React, { useState, useEffect } from 'react';
import axios from '@/lib/axiosClient';
import { useAppSelector } from '@/store/store';

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

import IssueItem from '@/components/roadmapCreation/issue-item';

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

interface ObjectiveDetailsProps {
  objectiveSelected: any;
}

const ObjectiveDetails: React.FC<ObjectiveDetailsProps> = ({
  objectiveSelected,
}) => {
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [issue, setIssue] = useState<any>();
  const [issuesData, setIssuesData] = useState<any>([]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 1,
      'search.issue_account': objectiveSelected.objective_issue_account,
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/issues`, {
        params: searchParams,
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setIssuesData(res.data.issues);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [firebase_jwt, objectiveSelected]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="text-xl font-semibold text-primary xl:text-2xl 3xl:text-3xl">
        {objectiveSelected.objective_title}
      </div>
      <div
        className="my-3 h-[25%] w-full overflow-y-auto
              rounded-lg border border-gray-600 p-3 text-sm xl:text-base 3xl:text-lg"
      >
        {objectiveSelected.objective_description
          ? objectiveSelected.objective_description
          : 'No Description Available'}
      </div>
      <div className="mb-3 flex items-center gap-2">
        <div className="text-sm xl:text-base 3xl:text-lg">State:</div>
        <ListCard
          item={{
            name: objectiveSelected.objective_deliverable,
            element: deliverableList.filter((item) => {
              return item.name === objectiveSelected.objective_deliverable;
            })[0].element,
          }}
          className="rounded-full bg-black p-2 pr-4"
        />
      </div>
      <div className="mb-3 flex items-center gap-2">
        <div className="text-sm xl:text-base 3xl:text-lg">Deliverable:</div>
        <ListCard
          item={{
            name: objectiveSelected.objective_state,
            element: stateList.filter((item) => {
              return item.name === objectiveSelected.objective_state;
            })[0].element,
          }}
          className="rounded-full bg-black p-2 pr-4"
        />
      </div>
      {issuesData.length !== 0 && (
        <IssueItem setIssue={setIssue} data={issuesData[0]} />
      )}
    </div>
  );
};

export default ObjectiveDetails;
