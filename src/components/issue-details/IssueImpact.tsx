import React, { useState, useEffect } from 'react';

import Dag from '@/components/dag/dag';
import ObjectiveDetails from '@/components/roadmaps/objectiveDetails';

interface IssueImpactProps {}

const dummyInitNodes = [
  {
    id: '1',
    type: 'custom',
    data: {
      objective_title: 'E2E testing with selenium',
      objective_description: 'issue1 description',
      objective_deliverable: 'Infrastructure',
      objective_state: 'InProgress',
      objective_issue_account: 'BpSiWmBg8wW1Jxhce62wrF1wYgmoqq9dcunyBCujH6kz',
    },
    selectable: true,
  },
  {
    id: '2',
    type: 'custom',
    data: {
      objective_title: 'Add logging',
      objective_description: 'issue2 description',
      objective_deliverable: 'Publication',
      objective_state: 'InProgress',
      objective_issue_account: '4Zhau6g695SX5EhzF4YWTaE5xeKgoCy2WqWEbCv2C2x5',
    },
    selectable: true,
  },
  {
    id: '3',
    type: 'custom',
    data: {
      objective_title: 'Profile page Cover image',
      objective_description: 'issue3 description',
      objective_deliverable: 'Tooling',
      objective_state: 'InProgress',
      objective_issue_account: 'C4CSamMspegSbkydnN9krDziprrSNspEmEbSHHaXGC1j',
    },
    selectable: true,
  },
  {
    id: '4',
    type: 'custom',
    data: {
      objective_title: 'Add pre-commit hook for prettier',
      objective_description: 'issue4 description',
      objective_deliverable: 'Infrastructure',
      objective_state: 'InProgress',
      objective_issue_account: 'Ho9Gf7qMacNV5JHsZMQqByYjfEnRc5i3QDDwuGtxAUsK',
    },
    selectable: true,
  },
  {
    id: '5',
    type: 'custom',
    data: {
      objective_title: 'Add Documentation',
      objective_description: 'issue5 description',
      objective_deliverable: 'Tooling',
      objective_state: 'InProgress',
      objective_issue_account: 'D8De8dvxZk29J3VNXrCBAmQJmMKj9FYUkjXtsjuN2TmX',
    },
    selectable: true,
  },
  {
    id: '6',
    type: 'custom',
    data: {
      objective_title: 'Demo Video Creation, Integration',
      objective_description: 'issue6 description',
      objective_deliverable: 'Infrastructure',
      objective_state: 'InProgress',
      objective_issue_account: 'H5WphcScYQqR5f1Z6sGdbWAD2FiYcssxp5JYsqqs7SQ4',
    },
    selectable: true,
  },
];

const dummyInitEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2',
  },
  {
    id: '1-3',
    source: '1',
    target: '3',
  },
  {
    id: '2-5',
    source: '2',
    target: '5',
  },
  {
    id: '5-6',
    source: '5',
    target: '6',
  },
  {
    id: '2-4',
    source: '2',
    target: '4',
  },
];

export const IssueImpact: React.FC<IssueImpactProps> = ({}) => {
  const [nodeSelected, setNodeSelected] = useState<any>();
  const [objectiveSelected, setObjectiveSelected] = useState<any>();

  const [initEdges, setInitEdges] = useState<any>(dummyInitEdges);
  const [initNodes, setInitNodes] = useState<any>(dummyInitNodes);

  useEffect(() => {
    if (nodeSelected !== undefined && nodeSelected !== null) {
      setObjectiveSelected(nodeSelected.data);
    } else {
      setObjectiveSelected(null);
    }
  }, [nodeSelected]);

  return (
    <div className="mt-5 flex h-full w-full justify-between gap-5">
      <div className="h-[30rem] w-[50%] overflow-hidden rounded-xl border-2 border-gray-500">
        <Dag
          nodeSelected={nodeSelected}
          setNodeSelected={setNodeSelected}
          initNodes={initNodes}
          initEdges={initEdges}
          setInitEdges={setInitEdges}
          setInitNodes={setInitNodes}
        />
      </div>
      <div className="h-full w-[50%]">
        {(objectiveSelected === null || objectiveSelected === undefined) && (
          <div className="mt-40 flex flex-col items-center justify-center text-sm xl:text-base 3xl:text-lg">
            <div>Select an Objective</div>
            <div>to View Details</div>
          </div>
        )}
        {objectiveSelected !== null && objectiveSelected !== undefined && (
          <ObjectiveDetails objectiveSelected={objectiveSelected} />
        )}
      </div>
    </div>
  );
};

export default IssueImpact;
