import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '@/components/icons/chevron-down';
import ProcessUI from '@/components/incentivize/process-ui';
import { Check } from '@/components/icons/check';
import { useAppSelector } from '@/store/store';
import { selectCreation } from '@/store/creationSlice';
import { createRepository } from '@/lib/helpers/contractInteract';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';

interface CreationProcessProps {
  stepOfCreation: number;
  setStepOfCreation: React.Dispatch<React.SetStateAction<number>>;
  reset: number;
}

const CreationProcess: React.FC<CreationProcessProps> = ({
  stepOfCreation,
  setStepOfCreation,
  reset,
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const [step, setStep] = useState(2);
  const creationState = useAppSelector(selectCreation);
  const userMappingState = useAppSelector(selectUserMapping);
  useEffect(() => {
    setIsExpand(false);
  }, [reset]);
  useEffect(() => {
    if (stepOfCreation === 4) {
      setIsExpand(true);
    }
  }, [stepOfCreation]);

  useEffect(() => {
    if (isExpand)
      createRepository(
        new PublicKey(
          userMappingState.userMapping?.verifiedUserAccount as string
        ),
        creationState.step3.tokenSpecs.tokenIcon as File,
        creationState.step3.tokenSpecs.tokenName,
        creationState.step3.tokenSpecs.tokenSymbol,
        creationState.step2.repoName,
        creationState.step2.repoLink,
        creationState.step3.tokenSpecs.totalSupply
      );
  }, [isExpand]);

  return (
    <div className="mb-4 flex w-[80%] flex-col rounded-lg bg-light-dark shadow-card transition-all">
      <div className="my-4 flex w-full cursor-pointer items-start justify-between px-5">
        <div className="flex w-full items-center gap-3">
          <div className="text-xl">4. Creation Process</div>
          {stepOfCreation === 4 && (
            <div className="flex text-sm text-gray-500">
              ( {step - 1}/5 creation steps are completed )
            </div>
          )}
        </div>
        {stepOfCreation === 4 && (
          <div
            className={`duration-400 z-[1] p-2 transition-transform ${
              isExpand ? 'rotate-180' : ''
            }`}
            onClick={() => setIsExpand(!isExpand)}
          >
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
        {stepOfCreation > 4 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Check />
          </div>
        )}
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
              <div className="mb-4 flex w-full flex-col py-5">
                <ProcessUI step={step} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreationProcess;
