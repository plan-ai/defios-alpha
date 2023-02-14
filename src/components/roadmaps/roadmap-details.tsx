import React from 'react';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import Image from '@/components/ui/image';
import NftFooter from '@/components/nft/nft-footer';
import cn from 'classnames';
import RoadmapPopupDetails from '@/components/roadmaps/roadmap-popup-details';
import PreReqCard from '@/components/roadmaps/pre-req-card';
import { roadmapListType, RoadmapList } from '@/data/static/roadmap-list';
import RoadmapPieChart from '@/components/roadmaps/roadmap-pie-chart';

import ListCard from '@/components/ui/list-card';
import { LockIcon } from '@/components/ui/icons/lock';
import { YellowClock } from '@/components/icons/yellow-clock';

import { deliverableList } from '@/data/static/roadmap-list';

import Dag from '@/components/dag/dag';

type RoadmapDetailsProps = roadmapListType;

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
}) => {
  return (
    <div className="mx-auto flex h-full w-full flex-row justify-between overflow-y-hidden rounded-lg p-10 transition-all">
      <div className="mr-10 flex h-full w-[55%] flex-col items-center justify-end">
        <div className="flex h-full max-h-full w-full items-center justify-center overflow-hidden">
          <div className="h-full w-full rounded-xl">
            <Dag />
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
        <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll pr-10">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-white md:text-2xl xl:text-3xl">
                {name}
              </h2>
              {status === 'lock' && <LockIcon />}
              {status === 'open' && <YellowClock />}
            </div>
            <div className="mt-1.5 inline-flex items-center text-sm -tracking-wider text-gray-400 hover:text-white xl:mt-2.5">
              created at {creationDate}
            </div>
            <div className="mt-4 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-6 lg:gap-0">
              <div className="shrink-0 border-dashed border-gray-700 lg:border-r lg:px-6">
                <h3 className="text-heading-style mb-2 uppercase text-white">
                  Created By
                </h3>
                <ListCard
                  item={{ name: creator, logo: creatorImage }}
                  className="rounded-full p-2 text-gray-400 hover:text-white"
                />
              </div>
              <div className="shrink-0 lg:px-6">
                <h3 className="text-heading-style mb-2.5 uppercase text-white">
                  Deliverable
                </h3>
                <ListCard
                  item={{
                    name: deliverable,
                    element: deliverableList.filter((item) => {
                      return item.name === deliverable;
                    })[0].element,
                  }}
                  className="rounded-full p-2 text-gray-400 hover:text-white"
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
                  details={details?.details || RoadmapList[0].details.details}
                />
              </TabPanel>
              <TabPanel className="focus:outline-none">
                <div className="flex flex-col-reverse">
                  {details?.preRequisites &&
                    details.preRequisites.length !== 0 &&
                    details.preRequisites?.map((preReq: any, idx: number) => (
                      <PreReqCard
                        item={preReq}
                        key={idx}
                        className="mb-3 first:mb-0"
                      />
                    ))}
                </div>
              </TabPanel>
              <TabPanel className="focus:outline-none">
                <div className="flex flex-col-reverse">
                  <RoadmapPieChart />
                </div>
              </TabPanel>
            </ParamTab>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetails;
