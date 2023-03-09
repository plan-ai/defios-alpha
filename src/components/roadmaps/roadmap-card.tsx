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
import { detailsType, RoadmapList } from '@/data/static/roadmap-list';
import cn from 'classnames';

import { StaticImageData } from 'next/image';

type RoadmapCardProps = {
  item: any;
  className?: string;
};

export default function RoadmapCard({ item, className }: RoadmapCardProps) {
  const [roadmap, setRoadmap] = useState('');
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setRoadmap('');
  });
  useLockBodyScroll(roadmap !== '');
  const datestr = new Date(
    item?.creation_date?.split(':').slice(0, 2).join(':')
  ).toLocaleDateString('en-IN', {
    day: 'numeric',
    year: 'numeric',
    month: 'long',
  });
  return (
    <div className="relative overflow-hidden transition-all duration-200">
      <div
        className={cn(
          'rounded-lg bg-light-dark shadow-card hover:shadow-large',
          className
        )}
      >
        <div className="h-20 p-4">
          <div className="text-xl font-semibold text-white ">
            {item?.title?.length > 45
              ? item?.title.slice(0, 45) + '...'
              : item?.title}
          </div>
        </div>
        <div
          // onClick={(e) => setRoadmap(item?.title)}
          className="relative block"
        >
          <Image
            src={item?.cover_image || ''}
            alt=""
            width={320}
            height={320}
            className="h-80 w-80 object-cover object-center"
          />
        </div>

        <div className="p-5 pt-3">
          <div className="flex items-center gap-2">
            <div className="text-xs">Created by:</div>
            <ListCard
              item={{
                name: item?.creator_name,
                logo: item?.creator_profile_pic,
              }}
              className="rounded-full bg-dark px-3 py-2"
            />
          </div>
          <div className=" mt-1.5 flex items-center gap-2">
            <div className="text-xs">Total Staked:</div>
            <div className="text-xl font-semibold text-white">
              {'$' + Math.round(item?.total_stake * 100) / 100}
            </div>
          </div>
          <div className=" mt-1.5 flex items-center gap-2">
            <div className="text-xs">Active Objectives:</div>
            <div>{item?.active_objectives}</div>
          </div>
          <div className=" mt-1.5 flex items-center gap-2">
            <div className="text-xs">Created</div>
            <div className="text-sm text-gray-500">{datestr}</div>
          </div>
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
                {/* <RoadmapDetails
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
                /> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
