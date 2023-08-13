import React, { useState, useEffect } from 'react';
import { VotePoolIcon } from '@/components/icons/vote-pool';
import TagImage from '@/components/ui/tags/tag-image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button/button';

import { CrownIcon } from '@/components/icons/crown';

interface PRBoxProps {
  votingDone: boolean;
  winner?: boolean;
  percentage:number;
}

export const PRBox: React.FC<PRBoxProps> = ({ votingDone, winner,percentage }) => {
  const [isExpand, setIsExpand] = useState(false);
  return (
    <div className="relative flex w-full flex-col gap-2">
      {winner && (
        <CrownIcon className="absolute -top-8 -left-4 z-[20] h-14 w-14 -rotate-[30deg]" />
      )}
      <div
        onClick={() => {
          setIsExpand(!isExpand);
        }}
        className="relative flex w-full justify-between rounded-lg border border-gray-700 bg-body p-3 lg:border-2 xl:p-3.5 3xl:p-4"
      >
        <div className="flex flex-col gap-3">
          <div className="text-base font-semibold xl:text-lg 3xl:text-xl">
            Add Selenium testing
          </div>
          <div className="flex items-center gap-3">
            <TagImage tag="Rohitkk432" />
          </div>
        </div>
        <div className="flex h-full items-center gap-4 rounded-lg bg-gray-900 py-3 px-6 text-base xl:text-lg 3xl:text-xl">
          <VotePoolIcon className="h-12 w-12" />
          <div>{percentage}%</div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {!votingDone && isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="relative">
              <Button size="small" shape="rounded" color="success" fullWidth>
                Submit Vote
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PRBox;
