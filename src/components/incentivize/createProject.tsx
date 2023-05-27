import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Check } from '@/components/icons/check';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setStep1Data } from '@/store/creationSlice';

interface CreateProjectProps {
  stepOfCreation: number;
  setStepOfCreation: React.Dispatch<React.SetStateAction<number>>;
  reset: number;
}

const CreateProject: React.FC<CreateProjectProps> = ({
  stepOfCreation,
  setStepOfCreation,
  reset,
}) => {
  const dispatch = useAppDispatch();

  const [isExpand, setIsExpand] = useState(false);
  const [projectName, setProjectName] = useState('');
  // const [ownerCut, setOwnerCut] = useState(0);

  useEffect(() => {
    setIsExpand(false);
    setProjectName('');
    // setOwnerCut(0);
  }, [reset]);
  useEffect(() => {
    if (stepOfCreation === 1) {
      setIsExpand(true);
    }
  }, [stepOfCreation]);

  return (
    <div className="mb-4 flex w-[80%] flex-col rounded-xl bg-light-dark shadow-card transition-all">
      <div className="my-4 flex w-full cursor-pointer items-start justify-between px-5">
        <div className="flex w-full flex-col gap-3">
          <div className="text-base xl:text-lg 3xl:text-xl">
            1. Create Project
          </div>
          {projectName !== '' &&
            // && ownerCut !== 0
            !isExpand && (
              <div className="flex gap-10 text-2xs text-gray-500 xl:text-xs 3xl:text-sm">
                <div>Project Name: {projectName}</div>
                {/* <div>Owner Cut: {ownerCut} %</div> */}
              </div>
            )}
        </div>
        {stepOfCreation === 1 && (
          <div
            className={`duration-400 z-[1] transition-transform ${
              isExpand ? 'rotate-180' : ''
            }`}
            onClick={() => setIsExpand(!isExpand)}
          >
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
        {stepOfCreation > 1 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-new-blue">
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
              <div className="flex w-full flex-col py-5">
                <div className="flex w-full gap-3">
                  <Input
                    label="Enter your Project Name"
                    placeholder="project name"
                    className="w-full"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  {/* <Input
                    label="Set Project Owner Cut in %"
                    placeholder="project owner cut in %"
                    className="w-full"
                    type="number"
                    value={ownerCut}
                    onChange={(e) => setOwnerCut(parseInt(e.target.value))}
                  /> */}
                </div>
                <Button
                  onClick={() => {
                    if (projectName !== '' 
                    // && ownerCut !== 0
                    ) {
                      dispatch(
                        setStep1Data({
                          projectName: projectName,
                          // ownerCut: ownerCut,
                        })
                      );
                      setIsExpand(!isExpand);
                      setStepOfCreation(stepOfCreation + 1);
                    }
                  }}
                  className="mt-4"
                  shape="rounded"
                  color="info"
                >
                  Save Project Information
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateProject;
