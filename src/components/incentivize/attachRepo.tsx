import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import RepoModal from '@/components/repo-choose/repo-modal';
import Image from 'next/image';
import GithubLogo from '@/assets/images/github-mark-white.svg';
import { Check } from '@/components/icons/check';

interface AttachRepoProps {
  stepOfCreation: number;
  setStepOfCreation: React.Dispatch<React.SetStateAction<number>>;
  reset: number;
  setRepoCallback?: (repo: string) => void;
}

const AttachRepo: React.FC<AttachRepoProps> = ({
  stepOfCreation,
  setStepOfCreation,
  reset,
  setRepoCallback,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [repo, setRepo] = useState('');
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setModalOpen(false);
  });
  useLockBodyScroll(modalOpen);

  useEffect(() => {
    setRepo('');
  }, [reset]);
  useEffect(() => {
    if (stepOfCreation === 2) {
      setModalOpen(true);
    }
  }, [stepOfCreation]);

  return (
    <div className="mb-4 flex w-[80%] flex-col rounded-xl bg-light-dark shadow-card transition-all">
      <div className="my-4 flex w-full cursor-pointer items-start justify-between px-5">
        <div
          onClick={() => {
            if (repo === '' && stepOfCreation === 2) setModalOpen(true);
          }}
          className="flex w-full flex-col gap-3"
        >
          <div className="text-base xl:text-lg 3xl:text-xl">
            2. Attach Repository
          </div>
          {repo !== '' && (
            <div className="flex text-2xs text-gray-500 xl:text-xs 3xl:text-sm">
              <Image
                src={GithubLogo}
                alt="github logo"
                className="mr-1 h-3.5 w-3.5"
              />
              <div>{repo.replace('https://github.com', '')}</div>
            </div>
          )}
        </div>
        {stepOfCreation > 2 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-new-blue">
            <Check />
          </div>
        )}
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
                <RepoModal
                  repo={repo}
                  setRepo={(repo) => {
                    setRepo(repo);
                    if (setRepoCallback) setRepoCallback(repo);
                  }}
                  setModalOpen={setModalOpen}
                  setStepOfCreation={setStepOfCreation}
                  stepOfCreation={stepOfCreation}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttachRepo;
