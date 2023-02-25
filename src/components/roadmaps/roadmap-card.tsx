import Image from '@/components/ui/image';
import { useState, useRef } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Verified } from '@/components/icons/verified';
import Avatar from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import routes from '@/config/routes';
import RoadmapDetails from '@/components/roadmaps/roadmap-details';
import ListCard from '../ui/list-card';
import { roadmapListType, RoadmapList } from '@/data/static/roadmap-list';

type RoadmapCardProps = roadmapListType;

export default function RoadmapCard({
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
}: RoadmapCardProps) {
  const [roadmap, setRoadmap] = useState('');
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setRoadmap('');
  });
  useLockBodyScroll(roadmap !== '');
  return (
    <div
      className="relative overflow-hidden rounded-lg bg-light-dark shadow-card transition-all duration-200 hover:shadow-large"
      onClick={() => setRoadmap(name)}
    >
      <div className="p-4">
        <div className="text-md font-medium text-white">
          {/* <Avatar
            image={creatorImage}
            alt={name}
            size="sm"
            className="mr-3 text-ellipsis border-gray-500"
          />
          <span className="overflow-hidden text-ellipsis">@{creator}</span> */}
          {name}
        </div>
      </div>
      <div className="relative block w-full pb-full">
        <Image
          src={image}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </div>

      <div className="p-5 pt-3">
        <div className="flex items-center gap-2">
          <div className="text-xs">Created by:</div>
          <ListCard
            item={{ name: creator, logo: creatorImage }}
            className="rounded-full bg-dark px-3 py-2"
          />
        </div>
        <div className=" mt-1.5 flex items-center gap-2">
          <div className="text-xs">Total Staked:</div>
          <div>{totalStake}</div>
        </div>
        <div className=" mt-1.5 flex items-center gap-2">
          <div className="text-xs">Active Objectives:</div>
          <div>{activeObjectives}</div>
        </div>
        <div className=" mt-1.5 flex items-center gap-2">
          <div className="text-xs">Created</div>
          <div>{creationDate}</div>
        </div>
      </div>
      <AnimatePresence>
        {roadmap !== '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
          >
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-full align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              ref={modalContainerRef}
              className="inline-block text-left align-middle"
            >
              <div className="h-[90vh] w-[80vw] rounded-2xl bg-dark">
                <RoadmapDetails
                  name={name}
                  creationDate={creationDate}
                  creator={creator}
                  creatorImage={creatorImage}
                  image={image}
                  totalStake={totalStake}
                  details={details || RoadmapList[0].details}
                  deliverable={deliverable}
                  status={status}
                  activeObjectives={activeObjectives}
                  setRoadmap={setRoadmap}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
