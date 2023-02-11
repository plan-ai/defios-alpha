import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IssueState from '@/components/ui/tags/issue-state';
import GithubTags from '@/components/ui/tags/github-tags';
interface IssuesListTypes {
  issueName: string;
  issueTags: string;
  tags: string[];
  projectName: string;
  totalStaked: string;
  coin:string
}

export default function IssuesList({
  issueName,
  issueTags,
  projectName,
  totalStaked,
  tags,
  children,
  coin
}: React.PropsWithChildren<IssuesListTypes>) {
  let [isExpand, setIsExpand] = useState(false);
  return (
    <div className="relative mb-3 overflow-hidden rounded-lg bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large">
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-7 items-start gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <span className="col-span-3 flex items-center px-6 text-sm font-medium tracking-wider text-white">
          <div>{issueName}</div> <IssueState state={issueTags} />
        </span>
        <span className="px-6 text-sm font-medium tracking-wider text-white">
          {projectName}
        </span>
        <span className="px-6 text-sm font-medium tracking-wider text-white">
          {totalStaked} {coin}
        </span>
        <span className="col-span-2 flex items-center px-6 text-sm font-medium tracking-wider text-white flex-wrap">
          {tags.length !== 0 &&
            tags.map((tag, idx) => <GithubTags tag={tag} key={idx} />)}
        </span>
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
