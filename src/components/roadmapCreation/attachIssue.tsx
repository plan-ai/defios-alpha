import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import IssueModal from '@/components/roadmapCreation/issue-modal';

interface AttachIssueProps {
  issue: any;
  setIssue: React.Dispatch<React.SetStateAction<any>>;
  issueData: any;
}

const AttachIssue: React.FC<AttachIssueProps> = ({
  issue,
  issueData,
  setIssue,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setModalOpen(false);
  });
  useLockBodyScroll(modalOpen);

  return (
    <div className="mt-4 flex w-full  flex-col rounded-xl border border-gray-600 bg-light-dark shadow-card transition-all">
      <div className="flex w-full cursor-pointer items-start justify-between px-5 py-2">
        <div
          onClick={() => {
            setModalOpen(true);
          }}
          className="flex w-full flex-col gap-2"
        >
          <div className="text-sm xl:text-base 3xl:text-lg">Attach Issue:</div>
          {issue !== null && issue !== undefined && (
            <div className="text-xs xl:text-sm 3xl:text-base">
              issue #
              {
                issue?.issue_gh_url.split('/')[
                  issue?.issue_gh_url.split('/').length - 1
                ]
              }{' '}
              - {issue?.issue_title}
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {modalOpen && (
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
              <div className="h-[90vh] w-[35vw] rounded-2xl bg-dark">
                <IssueModal
                  issue={issue}
                  setIssue={setIssue}
                  issueData={issueData}
                  setModalOpen={setModalOpen}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttachIssue;
