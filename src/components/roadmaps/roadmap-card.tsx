import Image from '@/components/ui/image';
import { useState, useRef } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Verified } from '@/components/icons/verified';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import { useAppSelector } from '@/store/store';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import RoadmapDetails from '@/components/roadmaps/roadmap-details';
import ListCard from '../ui/list-card';
import cn from 'classnames';
import Link from 'next/link';
import CreateRoadmapBtn from '@/components/roadmaps/CreateRoadmapBtn';

import EmptyList from '@/components/icons/EmptyList';
import { ClockIcon } from '@/components/icons/clock';

import Avatar from 'react-avatar';

type RoadmapCardProps = {
  item: any;
  className?: string;
  setRoadmap: React.Dispatch<React.SetStateAction<string>>;
  roadmap: string;
};

export default function RoadmapCard({
  item,
  className,
  roadmap,
  setRoadmap,
}: RoadmapCardProps) {
  const callPopupState = useAppSelector((state) => state.callLoader.callState);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    if (callPopupState === 'none') {
      setRoadmap('');
    }
  });
  useLockBodyScroll(roadmap === item?.roadmap_key);
  const datestr = new Date(
    item?.creation_date?.split(':').slice(0, 2).join(':')
  ).toLocaleDateString('en-IN', {
    day: 'numeric',
    year: 'numeric',
    month: 'long',
  });
  return (
    <div className="relative h-full overflow-hidden transition-all duration-200">
      {Object.keys(item).length !== 0 && (
        <div
          className={cn(
            'rounded-xl bg-light-dark shadow-card hover:shadow-large',
            className
          )}
        >
          <div className="h-20 p-4">
            <div className="text-base font-semibold text-white xl:text-lg 3xl:text-xl ">
              {item?.title?.length > 45
                ? item?.title.slice(0, 45) + '...'
                : item?.title}
            </div>
          </div>
          <div
            onClick={(e) => setRoadmap(item?.roadmap_key)}
            className="relative block h-80 w-full"
          >
            <Image
              src={
                item?.cover_image?.replace(
                  'https://ipfs.io',
                  'https://defi-os.infura-ipfs.io'
                ) || ''
              }
              alt={item?.title || ''}
              fill
              className="object-cover object-cover"
            />
          </div>

          <div className="p-5 pt-3">
            <div className="flex items-center gap-2">
              <div className="text-2xs xl:text-xs 3xl:text-sm">Created by:</div>
              <ListCard
                item={{
                  name: item?.creator_name,
                  element: (
                    <Avatar
                      name={item?.creator_name}
                      src={item?.creator_profile_pic}
                      className="rounded-full"
                      size="24"
                    />
                  ),
                }}
                className="rounded-full bg-black px-3 py-2"
              />
            </div>
            <div className=" mt-1.5 flex items-center gap-2">
              <div className="text-2xs xl:text-xs 3xl:text-sm">Outlook:</div>
              <ListCard
                item={{
                  name: item?.outlook,
                  element: <ClockIcon />,
                }}
                className="rounded-full bg-black px-3 py-2"
              />
            </div>
            <div className=" mt-1.5 flex items-center gap-2">
              <div className="text-2xs xl:text-xs 3xl:text-sm">
                Created on:{' '}
              </div>
              <div className="text-sm text-gray-500">{datestr}</div>
            </div>
          </div>
        </div>
      )}
      {Object.keys(item).length === 0 && (
        <div
          className={cn(
            'h-full rounded-xl bg-light-dark shadow-card hover:shadow-large',
            className
          )}
        >
          <div className="flex h-full w-full flex-col items-center justify-center">
            <EmptyList />
            <div className="text-center text-sm text-gray-500 xl:text-base 3xl:text-lg">
              No Roadmap Available
            </div>
            <div className="text-center text-sm text-gray-500 xl:text-base 3xl:text-lg">
              Stay Tuned for Roadmaps!
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {roadmap === item?.roadmap_key && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[50] overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
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
                  roadmapData={item}
                  setRoadmap={setRoadmap}
                  projectId={item.project}
                  projectAccount={item.project_account}
                  roadmapAccount={item.roadmap_key}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
