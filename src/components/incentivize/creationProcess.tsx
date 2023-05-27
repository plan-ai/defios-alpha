import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '@/components/icons/chevron-down';
import ProcessUI from '@/components/incentivize/process-ui';
import { Check } from '@/components/icons/check';
import { selectCreation } from '@/store/creationSlice';
import {
  createRepository,
  createRepositoryImported,
} from '@/lib/helpers/contractInteract';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '@/lib/helpers/metadata';

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
  const dispatch = useAppDispatch();
  const [isExpand, setIsExpand] = useState(false);
  const [step, setStep] = useState(0);
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

  const AddTokenDataToIPFS = async () => {
    const imageHash = await uploadFileToIPFS(
      creationState.step3.tokenSpecs.tokenIcon as File
    );
    const metadataHash = await uploadMetadataToIPFS({
      name: creationState.step3.tokenSpecs.tokenName,
      symbol: creationState.step3.tokenSpecs.tokenSymbol,
      image: `https://ipfs.io/ipfs/${imageHash}`,
    });
    return `https://ipfs.io/ipfs/${metadataHash}`;
  };

  useEffect(() => {
    if (isExpand) {
      dispatch(onLoading('Creating Project Repository...'));
      setStep(1);
      let resCalled = false;

      if (!creationState.step3.tokenSpecs.address) {
        AddTokenDataToIPFS()
          .then((data) => {
            createRepository(
              new PublicKey(userMappingState.userMapping?.userPubkey as string),
              creationState.step2.repoName,
              creationState.step2.repoLink,
              creationState.step3.tokenSpecs.tokenName,
              creationState.step3.tokenSpecs.tokenSymbol,
              data,
              new PublicKey(
                userMappingState.userMapping?.verifiedUserAccount as string
              )
            )
              .then((res) => {
                resCalled = true;
                dispatch(
                  onSuccess({
                    label: 'Project Repository Creation Success',
                    description: 'check out created project repository at',
                    link: res
                      ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
                      : '',
                    redirect: '/projects',
                    buttonText: 'Browse Projects',
                  })
                );
                setStep(2);
              })
              .catch((err) => {
                console.log(err);
                resCalled = true;
                dispatch(
                  onFailure({
                    label: 'Project Repository Creation Failed',
                    description: err.message,
                    link: '',
                    redirect: '/projects',
                    buttonText: 'Browse Other Projects',
                  })
                );
              })
              .finally(() => {
                if (!resCalled) {
                  dispatch(
                    onSuccess({
                      label: 'Project Repository Creation Success',
                      description: '',
                      link: '',
                      redirect: '/projects',
                      buttonText: 'Browse Projects',
                    })
                  );
                  setStep(2);
                }
              });
          })
          .catch((err) => console.log(err.message));
      } else {
        createRepositoryImported(
          new PublicKey(userMappingState.userMapping?.userPubkey as string),
          creationState.step2.repoName,
          creationState.step2.repoLink,
          new PublicKey(
            userMappingState.userMapping?.verifiedUserAccount as string
          )
        )
          .then((res) => {
            resCalled = true;
            dispatch(
              onSuccess({
                label: 'Project Repository Creation Success',
                description: 'check out created project repository at',
                link: res
                  ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
                  : '',
                redirect: '/projects',
                buttonText: 'Browse Projects',
              })
            );
            setStep(2);
          })
          .catch((err) => {
            resCalled = true;
            dispatch(
              onFailure({
                label: 'Project Repository Creation Failed',
                description: err.message,
                link: '',
                redirect: '/projects',
                buttonText: 'Browse Other Projects',
              })
            );
          })
          .finally(() => {
            if (!resCalled) {
              dispatch(
                onSuccess({
                  label: 'Project Repository Creation Success',
                  description: '',
                  link: '',
                  redirect: '/projects',
                  buttonText: 'Browse Projects',
                })
              );
              setStep(2);
            }
          });
      }
    }
  }, [isExpand]);

  return (
    <div className="mb-4 flex w-[80%] flex-col rounded-xl bg-light-dark shadow-card transition-all">
      <div className="my-4 flex w-full cursor-pointer items-start justify-between px-5">
        <div className="flex w-full items-center gap-3">
          <div className="text-base xl:text-lg 3xl:text-xl">
            4. Creation Process
          </div>
          {stepOfCreation === 4 && (
            <div className="flex text-2xs text-gray-500 xl:text-xs 3xl:text-sm">
              ( {step - 1}/1 creation steps are completed )
            </div>
          )}
        </div>
        {stepOfCreation === 4 && (
          <div
            className={`duration-400 z-[1] transition-transform ${
              isExpand ? 'rotate-180' : ''
            }`}
            onClick={() => setIsExpand(!isExpand)}
          >
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
        {stepOfCreation > 4 && (
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
