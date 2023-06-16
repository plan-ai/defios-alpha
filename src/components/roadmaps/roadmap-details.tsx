import React, { useState } from 'react';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import RoadmapPopupDetails from '@/components/roadmaps/roadmap-popup-details';
import PreReqCard from '@/components/roadmaps/pre-req-card';
import { RoadmapList, detailsType } from '@/data/static/roadmap-list';

import RoadmapContributions from '@/components/roadmaps/roadmap-contributions';
import { StaticImageData } from 'next/image';

import ListCard from '@/components/ui/list-card';
import { LockIcon } from '@/components/icons/lock';
import { YellowClock } from '@/components/icons/yellow-clock';
import { Close } from '@/components/icons/close';
import Button from '@/components/ui/button/button';

import { deliverableList } from '@/data/static/roadmap-list';
import Avatar from 'react-avatar';

import Dag from '@/components/dag/dag';

import ObjectiveCreate from '@/components/roadmapCreation/objectiveCreate';

type RoadmapDetailsProps = {
  creator: string;
  creatorImage: StaticImageData;
  image: StaticImageData;
  name: string;
  creationDate: string;
  totalStake: string;
  deliverable: string;
  status: string;
  details: detailsType | undefined;
  activeObjectives: string;
  setRoadmap: any;
  projectId:string;
  projectAccount:string;
};

const RoadmapDetails: React.FC<RoadmapDetailsProps> = ({
  creator,
  creatorImage,
  image,
  name,
  creationDate,
  totalStake,
  details,
  deliverable,
  status,
  activeObjectives,
  setRoadmap,
  projectId,
  projectAccount
}) => {
  const [nodeSelected, setNodeSelected] = useState<any>();
  const [createObjective, setCreateObjective] = useState(false);
  return (
    <div className="mx-auto flex h-full w-full flex-row justify-between overflow-y-hidden rounded-xl p-6 transition-all xl:p-8 3xl:p-10">
      <div className="mr-10 flex h-full w-[55%] flex-col items-center justify-end">
        <div className="flex h-full max-h-full w-full items-center justify-center overflow-hidden">
          <div className="h-full w-full rounded-xl">
            <Dag
              nodeSelected={nodeSelected}
              setNodeSelected={setNodeSelected}
            />
          </div>
        </div>
        {/* <NftFooter
          className="flex"
          currentBid={nftData?.bids[nftData?.bids?.length - 1]}
          auctionTime={Date.now() + 4000000 * 10}
          isAuction={isAuction}
          price={price}
        /> */}
      </div>

      <div className="flex h-full w-[40%] flex-col justify-between">
        {nodeSelected !== null &&
          nodeSelected !== undefined &&
          !createObjective && (
            <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll pr-10">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <h2 className="flex w-[90%] items-center gap-2 text-lg font-medium leading-[1.45em] -tracking-wider text-white xl:text-xl 3xl:text-2xl">
                    {/* {name} */}
                    {nodeSelected?.data?.name}
                  </h2>
                  {status === 'lock' && <LockIcon />}
                  {status === 'open' && <YellowClock />}
                  <Close
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoadmap('');
                    }}
                    className="ml-2 h-6 w-6"
                  />
                </div>
                <div className="mt-1.5 inline-flex items-center text-2xs -tracking-wider text-gray-400 hover:text-white xl:mt-2.5  xl:text-xs 3xl:text-sm">
                  created at {creationDate}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 pt-0.5 lg:-mx-6 lg:mt-6 lg:gap-0">
                  <div className="shrink-0 border-dashed border-gray-700 lg:border-r lg:px-6">
                    <h3 className="mb-2 text-2xs font-medium uppercase tracking-wider text-white xl:text-xs 3xl:text-sm">
                      Created By
                    </h3>
                    <ListCard
                      item={{
                        name: creator,
                        element: (
                          <Avatar
                            name={creator}
                            src={creator}
                            githubHandle={creator}
                            className="rounded-full"
                            size="24"
                          />
                        ),
                      }}
                      className="rounded-full p-2 pr-4 text-gray-400 hover:text-white"
                    />
                  </div>
                  <div className="shrink-0 lg:px-4">
                    <h3 className="mb-2.5 text-2xs font-medium uppercase tracking-wider text-white xl:text-xs 3xl:text-sm">
                      Deliverable
                    </h3>
                    <ListCard
                      item={{
                        name: deliverable,
                        element: deliverableList.filter((item) => {
                          return item.name === deliverable;
                        })[0].element,
                      }}
                      className="rounded-full p-2 pr-4 text-gray-400 hover:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex w-full flex-col pb-5 xl:mt-2">
                <ParamTab
                  tabMenu={[
                    {
                      title: 'Details',
                      path: 'details',
                    },
                    {
                      title: 'Pre-Requisites',
                      path: 'pre-requisites',
                    },
                    {
                      title: 'Contributions',
                      path: 'contributions',
                    },
                  ]}
                >
                  <TabPanel className="focus:outline-none">
                    <RoadmapPopupDetails
                      details={
                        details?.details || RoadmapList[0].details.details
                      }
                    />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <div className="flex flex-col-reverse">
                      {details?.preRequisites &&
                        details.preRequisites.length !== 0 &&
                        details.preRequisites?.map(
                          (preReq: any, idx: number) => (
                            <PreReqCard
                              item={preReq}
                              key={idx}
                              className="mb-3 first:mb-0"
                            />
                          )
                        )}
                    </div>
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <div className="flex flex-col-reverse">
                      <RoadmapContributions
                        contributions={
                          details?.contributions ||
                          RoadmapList[0].details.contributions
                        }
                      />
                    </div>
                  </TabPanel>
                </ParamTab>
              </div>
            </div>
          )}
        {(nodeSelected === null || nodeSelected === undefined) &&
          !createObjective && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-lg xl:text-xl 3xl:text-2xl">
              <div className="flex flex-col items-center justify-center">
                <div>Select a Node</div>
                <div>to Continue</div>
              </div>
              <div>OR</div>
              <Button
                onClick={() => setCreateObjective(true)}
                shape="rounded"
                size="medium"
                color="info"
              >
                Create an Objective
              </Button>
            </div>
          )}
        {createObjective && <ObjectiveCreate projectId={projectId} projectAccount={projectAccount} />}
      </div>
    </div>
  );
};

export default RoadmapDetails;
