import Image from '@/components/ui/image';
import { useState, useRef } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Verified } from '@/components/icons/verified';
import Avatar from '@/components/ui/avatar';
import { StaticImageData } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import routes from '@/config/routes';
import { nftData } from '@/data/static/single-nft';
import RoadmapDetails from './roadmap-details';
import {
  detailsType,
  roadmapListType,
  RoadmapList,
} from '@/data/static/roadmap-list';

type RoadmapCardProps = roadmapListType;

export default function RoadmapCard({
  creator,
  creatorImage,
  image,
  name,
  creationDate,
  totalStake,
  details,
}: RoadmapCardProps) {
  const [roadmap, setRoadmap] = useState('');
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setRoadmap('');
  });
  useLockBodyScroll(roadmap !== '');
  return (
    <div className="relative overflow-hidden rounded-lg bg-light-dark shadow-card transition-all duration-200 hover:shadow-large">
      <div className="p-4">
        <AnchorLink
          href={routes.roadmaps}
          className="flex items-center text-sm font-medium text-gray-300 transition hover:text-white"
        >
          <Avatar
            image={creatorImage}
            alt={name}
            size="sm"
            className="mr-3 text-ellipsis border-gray-500"
          />
          <span className="overflow-hidden text-ellipsis">@{creator}</span>
        </AnchorLink>
      </div>
      <div
        onClick={() => setRoadmap(name)}
        className="relative block w-full pb-full"
      >
        <Image
          src={image}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </div>

      <div className="p-5">
        <AnchorLink
          href="/nft-details"
          className="text-sm font-medium text-white"
        >
          {name}
        </AnchorLink>
        <div className="mt-1.5 flex">
          <AnchorLink
            href="/"
            className="inline-flex items-center text-xs text-gray-400"
          >
            {creationDate}
            <Verified className="ml-1" />
          </AnchorLink>
        </div>
        <div className="mt-4 text-lg font-medium text-white">{totalStake}</div>
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
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
