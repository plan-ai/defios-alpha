import React from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import AnchorLink from '../ui/links/anchor-link';
import { addCommit, stakeIssue } from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useAppSelector } from '@/store/store';
import { selectUserMapping } from '@/store/userMappingSlice';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface OpenIssueExpandProps {
  issueDesc: string;
  link: string;
  account: string;
}

const OpenIssueExpand: React.FC<OpenIssueExpandProps> = ({
  issueDesc,
  link,
  account,
}) => {
  const wallet = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState<number>(0);
  const { data: session } = useSession();
  const [prUrl, setPrUrl] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const userMappingState = useAppSelector(selectUserMapping);
  const [prLoading, setPrLoading] = React.useState<boolean>(false);

  const handleStake = () => {
    setIsLoading(true);
    stakeIssue(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      stakeAmount
    )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCommitSubmit = () => {
    setPrLoading(true);

    const pullApiUrl = prUrl
      .replace('https://github.com/', '')
      .replace('pull', 'pulls');

    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.github.com/repos/${pullApiUrl}`,
      headers: {
        Authorization: `Bearer ${(session as any)?.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    };

    axios(config)
      .then((res) => {
        const commits = res.data.commits_url;

        var commitsConfig = {
          method: 'get',
          maxBodyLength: Infinity,
          url: commits,
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        };

        axios(commitsConfig).then((commitRes) => {
          const latestCommit = commitRes.data[commitRes.data.length];
          addCommit(
            wallet.publicKey as PublicKey,
            new PublicKey(account),
            new PublicKey(
              userMappingState.userMapping?.verifiedUserAccount as string
            ),
            latestCommit.commit.tree.sha,
            latestCommit.sha,
            res.data.html_url
          )
            .then(() => {
              setPrLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setPrLoading(false);
            });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="flex w-full justify-between gap-5 py-5">
      <div className="flex w-1/2 flex-col gap-3">
        <strong>Description</strong>
        <div className="tracking-wider">
          {issueDesc.length === 0 && 'No Description available'}
          {issueDesc.length > 250 ? issueDesc.slice(0, 240) + '...' : issueDesc}
        </div>
        <AnchorLink href={link} target="_blank">
          <strong className="underline">view Thread on Github</strong>
        </AnchorLink>
      </div>
      <div className="flex w-1/2 flex-col gap-3">
        <div className="flex-flex-col w-full">
          <div className="mb-2">Build 🛠️</div>
          <div className="flex w-full items-center justify-center">
            <Input
              type="text"
              placeholder="Pull Request URL"
              inputClassName="w-full border-r-0 !h-10 !rounded-r-none !my-0"
              className="w-full"
              onChange={(e) => {
                setPrUrl(e.target.value);
              }}
            />
            <Button
              color="info"
              className="w-1/3 -translate-x-2"
              size="small"
              shape="rounded"
              onClick={handleCommitSubmit}
              isLoading={prLoading}
              disabled={prLoading || isLoading || prUrl === ''}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="flex-flex-col w-full">
          <div className="mb-2">Speed Up 🚅</div>
          <div className="flex w-full items-center justify-center">
            <Input
              type="text"
              placeholder="Stake Amount"
              inputClassName="w-full border-r-0 !h-10 !rounded-r-none !my-0"
              className="w-full"
              onChange={(e) => {
                setStakeAmount(parseFloat(e.target.value));
              }}
            />
            <Button
              color="success"
              className="w-1/3 -translate-x-2"
              size="small"
              shape="rounded"
              onClick={handleStake}
              isLoading={isLoading}
              disabled={prLoading || isLoading || stakeAmount === 0}
            >
              Stake
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenIssueExpand;
