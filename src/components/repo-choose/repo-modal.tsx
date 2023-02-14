import React, { useState } from 'react';
import Input from '@/components/ui/forms/input';
import { SearchIcon } from '@/components/icons/search';
import ToggleBtn from '@/components/ui/button/toggle';
import RepoItem from '@/components/repo-choose/repo-item';
import Button from '@/components/ui/button/button';

interface RepoModalProps {
  repo: string;
  setRepo: React.Dispatch<React.SetStateAction<string>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  stepOfCreation?: number;
  setStepOfCreation?: React.Dispatch<React.SetStateAction<number>>;
}

const dummyData = [
  {
    link: 'https://github.com/Rohitkk432/DefiOS',
    description: '',
    stars: 0,
    forks: 3,
    visibility: 'public',
  },
  {
    link: 'https://github.com/Rohitkk432/defios-alpha',
    description: 'description of defios alpha',
    stars: 0,
    forks: 1,
    visibility: 'private',
  },
  {
    link: 'https://github.com/Rohitkk432/MusicProX',
    description: 'description of MusicProX',
    stars: 0,
    forks: 3,
    visibility: 'public',
  },
  {
    link: 'https://github.com/Rohitkk432/FitBro',
    description: 'description of FitBro',
    stars: 0,
    forks: 1,
    visibility: 'private',
  },
];

const RepoModal: React.FC<RepoModalProps> = ({
  repo,
  setRepo,
  setModalOpen,
  stepOfCreation,
  setStepOfCreation,
}) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  return (
    <div className="flex h-full w-full flex-col p-5">
      <div className="relative flex w-full">
        <Input placeholder="Search Repositories" className="w-full" />
        <SearchIcon className="absolute right-4 top-4 h-5 w-5" />
      </div>
      <ToggleBtn option1="Owner" option2="Organization" className="my-3" />
      <div className="mb-4 h-full w-full overflow-y-scroll pr-4">
        {dummyData.length !== 0 &&
          dummyData.map((item, idx) => (
            <RepoItem
              key={idx}
              description={item.description}
              forks={item.forks}
              link={item.link}
              stars={item.stars}
              visibility={item.visibility}
              selectedRepo={selectedRepo}
              setSelect={setSelectedRepo}
            />
          ))}
      </div>
      <Button
        shape="rounded"
        size="small"
        color="info"
        onClick={() => {
          if (selectedRepo !== '') {
            setRepo(selectedRepo);
            setModalOpen(false);
            if (
              stepOfCreation !== undefined &&
              setStepOfCreation !== undefined
            ) {
              setStepOfCreation(stepOfCreation + 1);
            }
          }
        }}
      >
        Confirm Selected Repository
      </Button>
    </div>
  );
};

export default RepoModal;
