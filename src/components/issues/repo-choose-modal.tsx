import React, { useState } from 'react';
import { coinList } from '@/data/static/coin-list';
import { SearchIcon } from '@/components/icons/search';
import Button from '@/components/ui/button/button';
import cn from 'classnames';

interface RepoChooseModalProps {
  repo: string;
  setRepo: React.Dispatch<React.SetStateAction<string>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dummyData = [
  {
    projectName: 'DefiOS',
    coin: 'USDC',
  },
  {
    projectName: 'DefiOS-aplha',
    coin: 'USDT',
  },
  {
    projectName: 'DefiOS Rust',
    coin: 'BNB',
  },
  {
    projectName: 'MusicProX',
    coin: 'BTC',
  },
  {
    projectName: 'FitBro',
    coin: 'ETH',
  },
];

const RepoChooseModal: React.FC<RepoChooseModalProps> = ({
  repo,
  modalOpen,
  setModalOpen,
  setRepo,
}) => {
  const [choosenRepo, setChoosenRepo] = useState('');
  const handleSubmit = () => {
    if (choosenRepo !== '' && choosenRepo !== repo) {
      setRepo(choosenRepo);
      setModalOpen(false);
      setChoosenRepo('');
    } else if (choosenRepo !== '' && choosenRepo === repo) {
      setModalOpen(false);
      setChoosenRepo('');
    }
  };
  return (
    <div className="w-full rounded-lg bg-dark text-sm shadow-large xs:w-[400px]">
      <h2 className="p-6 text-lg font-medium uppercase text-white">
        Choose Repository
      </h2>
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-gray-700" />
        <input
          type="search"
          autoFocus={true}
          placeholder="Search Repository"
          className="w-full border-y border-x-0 border-dashed border-gray-700 bg-light-dark py-3.5 pl-14 pr-6 text-sm focus:border-gray-600 focus:ring-0"
        />
      </div>
      <div className="h-[40vh] overflow-y-scroll py-3">
        {dummyData.length > 0 &&
          dummyData.map((item, index) => {
            const data = coinList.filter((_data) => {
              return _data.code === item.coin;
            });
            return (
              <div
                key={index}
                onClick={() => setChoosenRepo(item.projectName)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 py-3 px-6 outline-none hover:bg-gray-800 focus:bg-gray-900',
                  {
                    'bg-black': item.projectName === choosenRepo,
                  }
                )}
              >
                {data[0].icon}
                <span className="normal-case">{item.projectName}</span>
              </div>
            );
          })}
      </div>
      <div className="w-full p-4">
        <Button
          onClick={handleSubmit}
          shape="rounded"
          size="small"
          color="info"
          fullWidth
        >
          Confirm Selected Repository
        </Button>
      </div>
    </div>
  );
};
export default RepoChooseModal;
