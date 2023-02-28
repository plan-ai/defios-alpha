import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button/button';
import { Check } from '@/components/icons/check';
import TopupButton from '../ui/topup-button';
import ButtonImg from '../custom/ButtonImg';

interface CheckItemProps {
  label: string;
  checked: boolean;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, checked }) => {
  return (
    <div className="text-md flex w-full items-start gap-3">
      <div
        className={cn('flex h-6 w-6 items-center justify-center rounded-sm', {
          'bg-gray-700': !checked,
          'bg-blue-500': checked,
        })}
      >
        {checked && <Check />}
      </div>
      <div
        className={cn({
          'text-gray-500 line-through': checked,
        })}
      >
        {label}
      </div>
    </div>
  );
};

type listData = {
  id: number;
  label: string;
  checked: boolean;
};

interface JourneyChecklistProps {
  items: listData[];
}

const JourneyChecklist: React.FC<JourneyChecklistProps> = ({ items }) => {
  return (
    <div className="flex flex w-full flex-col gap-5">
      {items.map((item) => {
        return (
          <CheckItem key={item.id} label={item.label} checked={item.checked} />
        );
      })}
    </div>
  );
};

const dummyData: listData[] = [
  {
    id: 1,
    label: 'Login with Github.',
    checked: true,
  },
  {
    id: 2,
    label: 'Connect Wallet.',
    checked: false,
  },
  {
    id: 3,
    label: 'Create A Project.',
    checked: false,
  },
  {
    id: 4,
    label: 'Stake on an issue.',
    checked: false,
  },
  {
    id: 5,
    label: 'Solve an Issue and send PR.',
    checked: false,
  },
];

interface JourneyProps {
  className?: string;
}

const Journey: React.FC<JourneyProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('Developer');
  return (
    <div
      className={cn(
        'fixed top-0 right-0 z-20 h-full w-[22rem] w-full max-w-full border-l border-dashed border-gray-700 pt-20',
        className
      )}
    >
      <Scrollbar style={{ height: 'calc(100% - 20px)' }}>
        <div className="w-full py-3 px-5">
          <div className="mb-2 flex w-full flex-col items-center gap-3 border-b border-dashed border-gray-700 pt-3 pb-8">
            <div className="flex flex-col items-center">
              <div>Welcome to DefiOS!!</div>
              <div>Lets Supercharge Open</div>
              <div>Source Collaboration Now</div>
            </div>
            <TopupButton label="Support Existing Projects" />
            <TopupButton
              label="Create New Project"
              className="border-white bg-blue-500"
              symbolClass="!bg-blue-500"
            />
          </div>
          <div className="flex w-full flex-col items-center px-1 py-2">
            <div className="mb-4 text-lg">Chose Your Role</div>
            <div className="flew-wrap mb-8 flex w-full items-center justify-between gap-2 overflow-x-scroll pb-4">
              <ButtonImg
                active={activeTab === 'Developer'}
                onClick={() => setActiveTab('Developer')}
                image="Developer"
                label="Developer"
              />
              <ButtonImg
                active={activeTab === 'Repository Owner'}
                onClick={() => setActiveTab('Repository Owner')}
                image="Repository Owner"
                label="Repository Owner"
              />
              <ButtonImg
                active={activeTab === 'Company'}
                onClick={() => setActiveTab('Company')}
                image="Company"
                label="Company"
              />
            </div>
            <JourneyChecklist items={dummyData} />
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};

export default Journey;
