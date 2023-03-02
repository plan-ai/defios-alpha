import React, { useState, Fragment, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import { ChevronDown } from '@/components/icons/chevron-down';
import ToggleBtn from '@/components/ui/button/toggle';
import Uploader from '@/components/ui/forms/uploader';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import cn from 'classnames';
import { Check } from '@/components/icons/check';
import DistributionSlider from '@/components/incentivize/distribution-slider';

import { useAppDispatch } from '@/store/store';
import { setAlgo, setStep3Data } from '@/store/creationSlice';

const sort = [
  { id: 1, name: 'Repository creator' },
  { id: 2, name: 'By amount of code contributed (minified)' },
  { id: 3, name: 'By duration of project involvement (compute intensive)' },
];

function SortList() {
  const dispatch = useAppDispatch();
  const [selectedItem, setSelectedItem] = useState(sort[0]);

  useEffect(() => {
    dispatch(setAlgo(selectedItem.name));
  }, [selectedItem, dispatch]);
  return (
    <div className="relative w-full">
      <span className="text-gray-10 mb-3 block text-sm font-medium uppercase tracking-widest">
        Distribution Strategy
      </span>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-700 bg-light-dark px-4 text-sm text-white">
          {selectedItem.name}
          <ChevronDown />
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-lg bg-dark p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-3 text-sm font-medium text-white transition  ${
                      selected ? 'my-1 bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

interface ConfigTokenProps {
  stepOfCreation: number;
  setStepOfCreation: React.Dispatch<React.SetStateAction<number>>;
  reset: number;
}

const ConfigToken: React.FC<ConfigTokenProps> = ({
  stepOfCreation,
  setStepOfCreation,
  reset,
}) => {
  const dispatch = useAppDispatch();
  const [isExpand, setIsExpand] = useState(false);
  const [tokenType, setTokenType] = useState('Create New Token');

  const [isSubmitted, setIsSubmitted] = useState(false);

  //Create New Token
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);

  //Import Existing
  const [splTokenAddress, setSplTokenAddress] = useState('');

  useEffect(() => {
    setIsExpand(false);
    setTokenSymbol('');
    setTokenName('');
    setTotalSupply(0);
    setSplTokenAddress('');
    setTokenType('Create New Token');
    setIsSubmitted(false);
  }, [reset]);

  useEffect(() => {
    if (stepOfCreation === 3) {
      setIsExpand(true);
    }
  }, [stepOfCreation]);

  const CheckSubmit = () => {
    if (tokenType === 'Create New Token') {
      if (tokenSymbol !== '' && tokenName !== '' && totalSupply !== 0) {
        dispatch(
          setStep3Data({
            tokenIcon: '',
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            totalSupply: totalSupply,
          })
        );
        setIsExpand(false);
        setIsSubmitted(true);
        setStepOfCreation(stepOfCreation + 1);
      }
    } else if (tokenType === 'Import Existing') {
      if (splTokenAddress !== '') {
        setIsExpand(false);
        setIsSubmitted(true);
        setStepOfCreation(stepOfCreation + 1);
      }
    }
  };

  return (
    <div className="mb-4 flex w-[80%] flex-col rounded-lg bg-light-dark shadow-card transition-all">
      <div className="my-4 flex w-full cursor-pointer items-start justify-between px-5">
        <div className="flex w-full flex-col gap-3">
          <div className="text-xl">3. Configure Token</div>
          {isSubmitted && !isExpand && tokenType === 'Create New Token' && (
            <div className="flex gap-10 text-sm text-gray-500">
              <div>Token Name: {tokenName}</div>
              <div>Token Symbol: {tokenSymbol}</div>
              <div>Token Supply: {totalSupply}</div>
            </div>
          )}
          {isSubmitted && !isExpand && tokenType === 'Import Existing' && (
            <div className="flex gap-10 text-sm text-gray-500">
              <div>SPL Token Address: {splTokenAddress}</div>
            </div>
          )}
        </div>
        {stepOfCreation === 3 && (
          <div
            className={`duration-400 z-[1] p-2 transition-transform ${
              isExpand ? 'rotate-180' : ''
            }`}
            onClick={() => setIsExpand(!isExpand)}
          >
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
        {stepOfCreation > 3 && (
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
              <div className="flex w-full flex-col py-5">
                <ToggleBtn
                  option1="Create New Token"
                  option2="Import Existing"
                  className="mb-4 h-10 !w-48"
                  stateChoosen={tokenType}
                  setStateChoosen={setTokenType}
                />
                {tokenType === 'Create New Token' && (
                  <>
                    <div className="mb-3 flex w-full gap-3">
                      <Input
                        id="tokenSymbol"
                        label="Token Symbol"
                        placeholder="Enter Token symbol"
                        className="w-full"
                        type="text"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                      />
                      <Input
                        id="tokenName"
                        label="Token Name"
                        placeholder="Enter Token name"
                        className="w-full"
                        type="text"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                      />
                      <Input
                        id="tokenSupply"
                        label="Total Supply"
                        placeholder="Enter Total supply"
                        className="w-full"
                        type="number"
                        value={totalSupply}
                        onChange={(e) =>
                          setTotalSupply(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="flex w-full gap-3">
                      <Uploader label="Token Icon" />
                      <SortList />
                    </div>

                    <div className="mb-3 mt-4 flex w-full flex-row items-center justify-between overflow-hidden">
                      <DistributionSlider />
                    </div>

                    <Button
                      onClick={() => CheckSubmit()}
                      className="mt-4"
                      shape="rounded"
                      color="info"
                    >
                      Save Token Configuration
                    </Button>
                  </>
                )}
                {tokenType === 'Import Existing' && (
                  <>
                    <div className="mb-3 flex w-full gap-3">
                      <div className="flex w-full items-end">
                        <Input
                          id="splTokenAddress"
                          label="Enter Token SPL Address"
                          placeholder="SPL Token Address"
                          className="w-full"
                          type="text"
                          value={splTokenAddress}
                          onChange={(e) => setSplTokenAddress(e.target.value)}
                          inputClassName="!border-r-0"
                        />
                        <Button shape="rounded" className="-ml-3">
                          Import
                        </Button>
                      </div>
                      <Input
                        label="Token Name"
                        placeholder="Token Name"
                        className="w-full"
                        type="text"
                        value={'DefiOS'}
                        inputClassName="!bg-transparent !border-blue-900"
                        disabled
                      />
                    </div>
                    <div className="flex w-full gap-3">
                      <Input
                        label="Token Symbol"
                        placeholder="Token Symbol"
                        className="w-full"
                        type="text"
                        value={'DOS'}
                        inputClassName="!bg-transparent !border-blue-900"
                        disabled
                      />
                      <Input
                        label="Token Decimal Places"
                        placeholder="Token Decimal Places"
                        className="w-full"
                        type="text"
                        value={'5'}
                        inputClassName="!bg-transparent !border-blue-900"
                        disabled
                      />
                    </div>
                    <Button
                      onClick={() => CheckSubmit()}
                      className="mt-4"
                      shape="rounded"
                      color="info"
                    >
                      Save Token Configuration
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfigToken;
