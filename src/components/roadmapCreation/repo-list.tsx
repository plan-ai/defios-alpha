import { useState } from 'react';
import SecurityStatus from '@/components/custom/security-status';
import Image from 'next/image';
import cn from 'classnames';

interface RepoListProps {
  data: any;
  selectedRepo?: any;
  setSelectedRepo: React.Dispatch<React.SetStateAction<any>>;
}

const RepoList: React.FC<RepoListProps> = ({
  data,
  setSelectedRepo,
  selectedRepo,
}) => {
  return (
    <div
      className={cn(
        'parentDiv relative mb-2 overflow-hidden rounded-xl border-2 border-light-dark bg-light-dark shadow-lg transition-all last:mb-0 hover:shadow-2xl',
        { 'gradient-border-box': selectedRepo === data }
      )}
      onClick={() => setSelectedRepo(data)}
    >
      <div className="relative my-4 grid h-auto cursor-pointer grid-cols-7 items-start items-center gap-6 text-2xs xl:text-xs 2xl:text-sm">
        <div className="col-span px-6  font-medium uppercase tracking-wider text-white">
          <div className="relative h-9 w-9 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12">
            <Image
              src={
                data?.project_token?.token_new === true
                  ? data?.project_token?.token_image_url?.replace(
                      'https://ipfs.io',
                      'https://defi-os.infura-ipfs.io'
                    ) || ''
                  : data?.project_token?.token_image_url || ''
              }
              alt={data?.project_token?.token_symbol || ''}
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-2 px-6 font-medium tracking-wider text-white">
          <div>{data?.project_token?.token_name}</div>
          <div>{data?.project_token?.token_symbol}</div>
        </div>
        <div className="col-span-4 px-6 font-medium tracking-wider text-white">
          {data?.project_name}
        </div>
      </div>
      <div className="childDiv h-0.5 w-full"></div>
    </div>
  );
};

export default RepoList;
