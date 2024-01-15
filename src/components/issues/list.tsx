import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import cn from 'classnames';
import axios from '@/lib/axiosClient';

import Image from '@/components/ui/image';
import { GithubIssueIcon } from '@/components/icons/github-issue';
import PlainTags from '@/components/ui/tags/plain-tags';

import { useAppSelector } from '@/store/store';
import { fetchTokenMetadata } from '@/lib/helpers/metadata';

import { useRouter } from 'next/router';

interface IssuesListTypes {
  data: any;
}

const IssuesList: React.FC<IssuesListTypes> = ({ data }) => {
  const router = useRouter();

  let [issueTags, setIssueTags] = useState<string[]>([]);
  const wallet = useWallet();

  let userMappingIsLoading = useAppSelector(
    (state) => state.userMapping.isLoading
  );
  let userMappingIsError = useAppSelector((state) => state.userMapping.isError);
  let firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );


  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    setIssueTags(removeDuplicates(data?.issue_tags));
  }, [data, firebase_jwt]);

  const removeDuplicates = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => router.push(`/issues/${data?.issue_account}`)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-3xl bg-body py-4 px-8 pr-16"
      >
        {/* <div className="mr-8 flex items-center gap-3  text-base xl:text-lg 3xl:text-xl">
          <HeartIcon className="h-6 w-6" />
          <div>2</div>
        </div> */}
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold xl:text-xl 3xl:text-2xl">
              {data?.issue_title}
            </div>
            <GithubIssueIcon
              className={cn('h-6 w-6', {
                'text-new-green': data?.issue_state === 'open',
                'text-new-red': data?.issue_state === 'closed',
              })}
            />
            {issueTags.map((tag: string, idx: number) => {
              return <PlainTags key={idx} tag={tag} />;
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              {data?.issue_token?.token_image_url !== '' && (
                <Image
                  src={data?.issue_token?.token_image_url.replace(
                    'https://ipfs.io',
                    'https://defi-os.infura-ipfs.io'
                  )}
                  alt="token image"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              {data?.issue_project_name} ({data?.issue_token?.token_symbol})
            </div>
          </div>
        </div>
        <div className="flex text-base gap-3 xl:text-lg 3xl:text-xl">
          <div className="text-new-green">{data?.issue_stake_amount}</div>
          <div>{data?.issue_token?.token_symbol}</div>
        </div>
      </div>
      <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
    </div>
  );
};

export default IssuesList;
