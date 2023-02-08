import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityStatus from '../custom/security-status';

interface ProjectListTypes {
  name: string;
  openIssues: number;
  repositoryStatus: string;
  liquidityStaked: string;
  liquidityRewarded: string;
  topSupporter: string;
  topBuilder: string;
}

export default function ProjectList({
  name,
  openIssues,
  repositoryStatus,
  liquidityStaked,
  liquidityRewarded,
  topSupporter,
  topBuilder,
  children,
}: React.PropsWithChildren<ProjectListTypes>) {
  let [isExpand, setIsExpand] = useState(false);
  return (
    <div className="relative mb-3 overflow-hidden rounded-lg bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large">
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-8 items-start gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-6 text-xs font-medium tracking-wider text-white sm:text-sm">
          {name}
        </div>
        <div className="px-6 text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
          {openIssues}
        </div>
        <div className="px-6 text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
          {/* <SecurityStatus security={repositoryStatus}/> */}
          {repositoryStatus}
        </div>
        <div className="col-span-2 px-6 text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
          <div className="mb-1 flex items-center justify-start ">
            <div className="mr-2 text-gray-500">#Staked</div>
            <div>{liquidityStaked}</div>
          </div>
          <div className="mb-1 flex items-center justify-start ">
            <div className="mr-2 text-gray-500">#Rewarded</div>
            <div>{liquidityRewarded}</div>
          </div>
        </div>
        <div className="col-span-2 px-6 text-xs font-medium tracking-wider text-white sm:text-sm">
          <div>{topBuilder} (Builder 🛠️)</div>
          <div>{topSupporter} (Supporter 💰)</div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpand && (
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
            <div className="border-t border-dashed border-gray-700 px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
