import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IssuesTableListProps {
  issueTitle: string;
  projectName: string;
  amountStaked: string;
  skillsetNeeded: string;
}

export const IssuesTableList = ({
  issueTitle,
  projectName,
  amountStaked,
  skillsetNeeded,
  children,
}: React.PropsWithChildren<IssuesTableListProps>) => {
  let [isExpand, setIsExpand] = useState(false);

  return (
    <div className="relative mb-2 overflow-hidden rounded-lg bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large">
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-4 items-start gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="px-6 text-xs font-medium tracking-wider text-white sm:text-sm">
          {issueTitle}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {projectName}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {amountStaked}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {skillsetNeeded}
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
};

export default IssuesTableList;
