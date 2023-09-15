import React, { useState, useEffect } from 'react';

import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { clicked } from '@/store/notifClickSlice';
import { resetRefetch } from '@/store/refetchSlice';
import { useRouter } from 'next/router';

import Spinner from '@/components/custom/spinner';
import Image from '@/components/ui/image';
import ListCard from '@/components/ui/list-card';
import { ClockIcon } from '@/components/icons/clock';
import { Close } from '@/components/icons/close';

import Button from '@/components/ui/button/ButtonNew';

import Avatar from 'react-avatar';

import Dag from '@/components/dag/dag';

import ObjectiveCreate from '@/components/roadmapCreation/objectiveCreate';
import ObjectiveLink from '@/components/roadmapCreation/objectiveLink';

import ObjectiveDetails from '@/components/roadmaps/objectiveDetails';

import RepoList from '@/components/roadmapCreation/repo-list';

interface RoadmapDetailsProps {
  roadmapData: any;
  setRoadmap: any;
  projectId: string;
  projectAccount: string;
  roadmapAccount: string;
}

const RoadmapDetails: React.FC<RoadmapDetailsProps> = ({
  roadmapData,
  setRoadmap,
  projectId,
  projectAccount,
  roadmapAccount,
}) => {
  const [nodeSelected, setNodeSelected] = useState<any>();
  const [objectiveSelected, setObjectiveSelected] = useState<any>();

  const [createObjective, setCreateObjective] = useState(false);
  const [linkObjective, setLinkObjective] = useState(false);

  const [existingObjIssueAcc, setExistingObjIssueAcc] = useState<string[]>([]);

  const [objectivesData, setObjectivesData] = useState<any>();

  const [initEdges, setInitEdges] = useState<any>();
  const [initNodes, setInitNodes] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  let userMapping = useAppSelector((state) => state.userMapping.userMapping);

  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  const [project, setProject] = useState<any>();
  const [projectsData, setProjectsData] = useState<any>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const refetchPart = useAppSelector((state) => state.refetch.refetchPart);
  const [fetchAgain, setFetchAgain] = useState(0);

  const onClickHandler = () => {
    const payload = {
      searchQuery: `id:${projectsData?.[0]?._id}`,
      setSearchQuery: true,
      expandFirst: false,
      pathname: '/projects',
    };
    dispatch(clicked(payload));
    router.push('/projects');
  };

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    const searchParams: any = {
      'filter.pageno': '1',
      'filter.pagesize': 1,
      'search.project_account': projectAccount,
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/projects`, {
        params: searchParams,
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setProjectsData(res.data.projects);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [firebase_jwt, projectAccount]);

  useEffect(() => {
    if (nodeSelected !== undefined && nodeSelected !== null) {
      setObjectiveSelected(nodeSelected.data);
    } else {
      setObjectiveSelected(null);
    }
  }, [nodeSelected]);

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (roadmapAccount.length === 0) return;
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/roadmaps/objectives`, {
        headers: {
          Authorization: firebase_jwt,
        },
        params: {
          roadmap_key: roadmapAccount,
        },
      })
      .then((res) => {
        setObjectivesData(res.data);
        if (res.data.objectives_list && res.data.objective_graph) {
          const existingIssues: string[] = [];
          const vertices = res.data.objectives_list.map((item: any) => {
            existingIssues.push(item.objective_issue_account);
            return {
              id: item.objective_key,
              type: 'custom',
              data: item,
              selectable: true,
            };
          });
          const edges: any[] = [];
          res.data.objective_graph.forEach((item: any) => {
            const split = item.split(':');
            if (split[0] !== 'root') {
              edges.push({
                id: item,
                source: split[0],
                target: split[1],
              });
            }
          });
          setExistingObjIssueAcc(existingIssues);
          setInitNodes(vertices);
          setInitEdges(edges);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, [firebase_jwt, fetchAgain]);

  useEffect(() => {
    if (refetchPart === 'objective') {
      setCreateObjective(false);
      setLinkObjective(false);
      setObjectiveSelected(null);
      setNodeSelected(null);
      setTimeout(() => setFetchAgain(fetchAgain + 1), 1500);
      dispatch(resetRefetch());
    }
  }, [refetchPart]);

  return (
    <div className="mx-auto flex h-full w-full flex-row justify-between overflow-y-hidden rounded-xl p-6 transition-all xl:p-8 3xl:p-10">
      <div className="mr-10 flex h-full w-[55%] flex-col items-center justify-end">
        <div className="flex h-full max-h-full w-full items-center justify-center overflow-hidden">
          <div className="h-full w-full rounded-xl">
            {!isLoading && (
              <Dag
                nodeSelected={nodeSelected}
                setNodeSelected={setNodeSelected}
                initNodes={initNodes}
                initEdges={initEdges}
                setInitEdges={setInitEdges}
                setInitNodes={setInitNodes}
              />
            )}
            {isLoading && (
              <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                <Spinner />
                <div>Loading DAG Tree</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-full w-[40%] flex-col justify-between overflow-y-auto">
        {objectiveSelected !== null &&
          objectiveSelected !== undefined &&
          !createObjective &&
          !linkObjective && (
            <ObjectiveDetails objectiveSelected={objectiveSelected} />
          )}
        {(objectiveSelected === null || objectiveSelected === undefined) &&
          !createObjective &&
          !linkObjective && (
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center">
                <div className="relative mr-6 h-12 w-12 rounded-full">
                  <Image
                    src={
                      roadmapData?.cover_image?.replace(
                        'https://ipfs.io',
                        'https://defi-os.infura-ipfs.io'
                      ) || ''
                    }
                    alt={roadmapData?.title || ''}
                    fill
                    className="rounded-full object-cover object-cover"
                  />
                </div>
                <div className="text-2xl font-bold xl:text-3xl 3xl:text-4xl">
                  {roadmapData?.title}
                </div>
              </div>
              <div
                className="my-3 h-[25%] w-full overflow-y-auto
              rounded-lg border border-gray-600 p-3 text-sm xl:text-base 3xl:text-lg"
              >
                {roadmapData.description
                  ? roadmapData.description
                  : 'No Description Available'}
              </div>
              <div className="mb-3 flex items-center gap-2">
                <div className="text-sm xl:text-base 3xl:text-lg">Outlook:</div>
                <ListCard
                  item={{
                    name: roadmapData?.outlook,
                    element: <ClockIcon />,
                  }}
                  className="rounded-full bg-black px-3 py-2"
                />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <div className="text-sm xl:text-base 3xl:text-lg">
                  Created by:
                </div>
                <ListCard
                  item={{
                    name: roadmapData?.creator_name,
                    element: (
                      <Avatar
                        name={roadmapData?.creator_name}
                        src={roadmapData?.creator_profile_pic}
                        className="rounded-full"
                        size="24"
                      />
                    ),
                  }}
                  className="rounded-full bg-black px-3 py-2"
                />
              </div>
              {projectsData.length !== 0 && (
                <div onClick={onClickHandler}>
                  <RepoList
                    data={projectsData[0]}
                    setSelectedRepo={setProject}
                  />
                </div>
              )}
              <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-600 p-2 text-base xl:p-3 xl:text-lg 3xl:p-4 3xl:text-xl">
                <div className="flex flex-col items-center justify-center">
                  <div>Select an Objective</div>
                  <div>to View Details</div>
                </div>
                {githubInfo.id.toString() === roadmapData.creator.toString() &&
                  userMapping !== null && (
                    <>
                      <div>OR</div>
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          fullWidth={true}
                          size="small"
                          onClick={() => setCreateObjective(true)}
                        >
                          Create Objective
                        </Button>
                        <Button
                          fullWidth={true}
                          size="small"
                          onClick={() => setLinkObjective(true)}
                        >
                          Link Objectives
                        </Button>
                      </div>
                    </>
                  )}
              </div>
            </div>
          )}
        {createObjective && (
          <ObjectiveCreate
            projectAccount={projectAccount}
            objectiveSelected={objectiveSelected}
            setCreateObjectiveModal={setCreateObjective}
            existingObjIssueAcc={existingObjIssueAcc}
          />
        )}
        {linkObjective && (
          <ObjectiveLink
            objectiveSelected={objectiveSelected}
            setLinkObjectiveModal={setLinkObjective}
          />
        )}
      </div>
    </div>
  );
};

export default RoadmapDetails;
