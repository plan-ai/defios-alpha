import React, { useState, useEffect } from 'react';
import { SearchIcon } from '@/components/icons/search';
import Button from '@/components/ui/button/button';
import cn from 'classnames';
import AnchorLink from '../ui/links/anchor-link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAppSelector } from '@/store/store';
import Image from 'next/image';
import { PlusCircle } from '../icons/plus-circle';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Spinner from '@/components/custom/spinner';

interface RepoChooseModalProps {
  repo: string;
  setRepo: React.Dispatch<React.SetStateAction<string>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RepoItemProps {
  item: any;
  choosenRepo: any;
  setChoosenRepo: React.Dispatch<React.SetStateAction<string>>;
}

const RepoItem: React.FC<RepoItemProps> = ({
  item,
  choosenRepo,
  setChoosenRepo,
}) => {
  return (
    <div
      onClick={() => setChoosenRepo(item)}
      className={cn(
        'flex cursor-pointer items-center gap-2 py-3 px-6 outline-none hover:bg-gray-800 focus:bg-gray-900',
        {
          'bg-black': item?.project_name === choosenRepo?.project_name,
        }
      )}
    >
      <Image src={item?.token_url || ''} alt="token" width={24} height={24} />
      <span className="ml-2 normal-case">{item?.project_name}</span>
    </div>
  );
};

const RepoChooseModal: React.FC<RepoChooseModalProps> = ({
  repo,
  modalOpen,
  setModalOpen,
  setRepo,
}) => {
  const router = useRouter();
  const [choosenRepo, setChoosenRepo] = useState<any>(null);
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
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const [reposData, setReposData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === '') return;
    setIsLoading(true);
    axios
      .get('https://api-v1.defi-os.com/projects/minified', {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setReposData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [firebase_jwt]);

  return (
    <div className="w-full rounded-lg bg-dark text-sm shadow-large xs:w-[400px]">
      <h2 className="p-6 text-lg font-medium uppercase text-white">
        Choose Project
      </h2>
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-gray-700" />
        <input
          type="search"
          autoFocus={true}
          placeholder="Search Project"
          className="w-full border-y border-x-0 border-dashed border-gray-700 bg-light-dark py-3.5 pl-14 pr-6 text-sm focus:border-gray-600 focus:ring-0"
        />
      </div>
      <div className="h-[40vh] overflow-y-scroll py-3">
        {!isLoading && reposData.length === 0 && (
          <div className="mt-5 flex w-full flex-col items-center justify-center gap-5">
            <Image src={ErrorDarkImage} className="w-52" alt="404 Error" />
            <div className="w-60 text-center text-sm text-gray-500">
              No projects found that match your search.
            </div>
          </div>
        )}
        {!isLoading &&
          reposData.length > 0 &&
          reposData.map((item: any, idx: number) => (
            <RepoItem
              item={item}
              key={idx}
              choosenRepo={choosenRepo}
              setChoosenRepo={setChoosenRepo}
            />
          ))}
        {isLoading && (
          <div className="mt-10 flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
      <div className="w-full p-4 pb-0">
        <Button
          onClick={handleSubmit}
          shape="rounded"
          size="small"
          color="success"
          fullWidth
        >
          Confirm Selected Project
        </Button>
      </div>
      <div className="w-full p-4">
        <AnchorLink href="/incentivize-contributors">
          <Button
            onClick={handleSubmit}
            shape="rounded"
            size="small"
            color="info"
            fullWidth
          >
            Can&rsquo;t find project? Create One
          </Button>
        </AnchorLink>
      </div>
    </div>
  );
};
export default RepoChooseModal;
