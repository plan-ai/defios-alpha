import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { fetchTokenMetadata } from '@/lib/helpers/metadata';
import axios from '@/lib/axiosClient';

//redux
import { useAppSelector } from '@/store/store';

//ui components
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import PlainTags from '@/components/ui/tags/plain-tags';
import Spinner from '@/components/custom/spinner';

//icons
import { GithubOutlineIcon } from '@/components/icons/github-outline';

interface IssueBoxProps {
  data: any;
}

const IssueBox: React.FC<IssueBoxProps> = ({ data }) => {
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  return (
    <div className="relative w-full">
      <div className="relative z-[40] flex w-full items-center justify-between gap-3">
        <div className="flex h-[16rem] w-[49%] flex-col gap-4 rounded-3xl bg-body p-5 xl:p-6 3xl:p-8">
          <AnchorLink
            href={data?.project_repo_link || ''}
            target="_blank"
            className="flex w-fit items-center gap-4 rounded-full bg-light-gray py-2 px-4 text-base xl:text-lg 3xl:text-xl"
          >
            <GithubOutlineIcon className="h-8 w-8" />
            <div>{data?.project_name}</div>
          </AnchorLink>
          <div className="flex h-full w-full flex-col items-center items-center justify-center gap-4">
            {data !== undefined && data !== null && (
              <div className="flex items-center gap-4 text-lg xl:text-xl 3xl:text-2xl">
                <div className="relative h-8 w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12">
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
                <div>{data?.project_token?.token_name}</div>
                <div>({data?.project_token?.token_symbol})</div>
              </div>
            )}
            <div className="text-xl text-new-green xl:text-2xl 3xl:text-3xl">
              {data?.coins_staked}
            </div>
          </div>
        </div>
        <div className="h-[16rem] w-[49%] rounded-3xl bg-body p-5 xl:p-6 3xl:p-8"></div>
      </div>
      <div className="absolute left-0 right-0 top-[20%] bottom-[20%] z-[10] rounded-full bg-[#92ABFB] blur-[60px]"></div>
    </div>
  );
};

export default IssueBox;
