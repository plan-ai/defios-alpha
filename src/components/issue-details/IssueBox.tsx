import React, { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import { GithubIssueIcon } from '@/components/icons/github-issue';
import PlainTags from '@/components/ui/tags/plain-tags';

import { useAppSelector } from '@/store/store';
import { fetchTokenMetadata } from '@/lib/helpers/metadata';
import axios from '@/lib/axiosClient';

import AnchorLink from '@/components/ui/links/anchor-link';

import Spinner from '@/components/custom/spinner';

interface IssueBoxProps {
  data: any;
}

const IssueBox: React.FC<IssueBoxProps> = ({ data }) => {
  const [issueTags, setIssueTags] = useState<string[]>([]);

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  const [tokenDecimals, setTokenDecimals] = useState(0);

  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (data === null || data === undefined) return;
    getTokenInfo();
    setIssueTags(removeDuplicates(data?.issue_tags));
  }, [data, firebase_jwt]);

  const removeDuplicates = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  const getTokenInfo = async () => {
    if (
      data.issue_token?.token_spl_addr === null ||
      data.issue_token?.token_spl_addr === undefined
    )
      return;
    const response: any = await fetchTokenMetadata(
      data?.issue_token?.token_spl_addr
    );
    if (response.decimals) {
      setTokenDecimals(response.decimals);
    } else {
      const resp: any = await axios.get('https://api-v1.defi-os.com/tokens', {
        headers: {
          Authorization: firebase_jwt,
        },
        params: {
          token_addr: data?.issue_token?.token_spl_addr,
        },
      });
      if (resp.token_decimals) {
        setTokenDecimals(resp.token_decimals);
      }
    }
  };

  return (
    <AnchorLink
      href={data?.issue_gh_url || ''}
      target="_blank"
      className="relative w-full"
    >
      <div className="relative z-[40] flex w-full items-center justify-between gap-3 rounded-3xl bg-body p-5 xl:p-6 3xl:p-8">
        {data !== null && data !== undefined && (
          <>
            <div className="flex flex-col gap-4">
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
            <div className="text-base text-new-green xl:text-lg 3xl:text-xl">
              {Math.round(
                (data?.issue_stake_amount * 100) / 10 ** tokenDecimals
              ) / 100}
            </div>
          </>
        )}
        {(data === null || data === undefined) && (
          <div className="w-full items-center justify-center">
            <Spinner label="loading issue..." />
          </div>
        )}
      </div>
      <div className="absolute left-0 right-0 top-0 bottom-[40%] z-[10] rounded-full bg-[#92ABFB] blur-[60px]"></div>
    </AnchorLink>
  );
};

export default IssueBox;
