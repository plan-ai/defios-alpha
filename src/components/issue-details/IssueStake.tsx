import React, { useState, useEffect } from 'react';
import IssueComment from '@/components/issue-details/IssueComment';
import IssueCommentCreator from '@/components/issue-details/IssueCommentCreator';
import Spinner from '@/components/custom/spinner';
import TagImage from '@/components/ui/tags/tag-image';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';
import cn from 'classnames';
import Input from '@/components/ui/forms/input';

import {
  stakeIssueTokens,
  unstakeIssueTokens,
} from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setRefetch } from '@/store/refetchSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import mixpanel from 'mixpanel-browser';

import CoinInput from '@/components/ui/coin-input';

import StakeHolders from '@/components/issue-details/StakeHolders';

import { getAssociatedTokenAddress } from '@solana/spl-token';
import classNames from 'classnames';

const coinList = [
  {
    repository: '2c8tDPE7eBy7EJUjuiweCRheH1rQoQMBXBKk5ga8UbJs',
    token_image_url:
      'https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte',
    token_new: true,
    token_spl_addr: '91tB1NHt4yi3bgyqc45vLq1VdXcubpMyJhsS5aL71JEn',
    token_symbol: 'DOSA',
  },
  {
    token_image_url:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU/logo.png',
    token_symbol: 'USDC',
    token_spl_addr: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  },
];

interface IssueStakeProps {
  account: string;
  issueTokenAddress: string;
  link: string;
}

export const IssueStake: React.FC<IssueStakeProps> = ({
  account,
  issueTokenAddress,
  link,
}) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const wallet = useWallet();
  const { data: session } = useSession();
  const userMappingState = useAppSelector(selectUserMapping);

  const [section, setSection] = useState(1);

  const [tokenAmount, setTokenAmount] = React.useState<number>(0);
  const [usdcAmount, setUsdcAmount] = React.useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);

  const handleIssueStake = () => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (tokenAmount <= 0 && usdcAmount <= 0) return;
    dispatch(onLoading('Staking tokens on the issue...'));
    stakeIssueTokens(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      tokenAmount,
      usdcAmount,
      firebase_jwt
    )
      .then((res) => {
        setTokenAmount(0);
        setUsdcAmount(0);
        dispatch(
          onSuccess({
            label: 'Issue Staking Successful',
            description: 'Check out your staking at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Issue Staking Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: account,
          token_address: issueTokenAddress,
          token_amount: tokenAmount,
          usdc_amount: usdcAmount,
          issue_github_link: link,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        setTokenAmount(0);
        setUsdcAmount(0);
        dispatch(
          onFailure({
            label: 'Issue Staking Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Issue Staking Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  const handleIssueUnstake = () => {
    dispatch(onLoading('Unstaking tokens on the issue...'));
    unstakeIssueTokens(wallet.publicKey as PublicKey, new PublicKey(account))
      .then((res) => {
        setTokenAmount(0);
        setUsdcAmount(0);
        dispatch(
          onSuccess({
            label: 'Issue Unstaking Successful',
            description: 'Check out your unstaking at',
            redirect: null,
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Issue Unstaking Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          issue_account: account,
          token_address: issueTokenAddress,
          issue_github_link: link,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        setTokenAmount(0);
        setUsdcAmount(0);
        dispatch(
          onFailure({
            label: 'Issue Unstaking Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Issue Unstaking Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  return (
    <div className="mt-16 flex w-full items-center justify-end">
      <div className="relative mx-32 w-full">
        <div className="relative z-[40] flex w-full flex-col justify-between gap-3 rounded-[3rem] bg-body px-12 py-8 xl:px-14 xl:py-10 3xl:px-16 3xl:py-12">
          <div className="flex w-full w-full items-end gap-12">
            <div className="flex w-[30%] flex-col gap-2">
              <div className="ml-1 text-base font-semibold uppercase xl:text-lg 3xl:text-xl">
                Token Incentive
              </div>
              <Input
                inputClassName="border-light-gray"
                type="text"
                value={tokenAmount}
                onChange={(e) => {
                  setTokenAmount(parseFloat(e.target.value));
                }}
              />
            </div>
            <div className="flex w-[30%] flex-col gap-2">
              <div className="ml-1 text-base font-semibold uppercase xl:text-lg 3xl:text-xl">
                USDC Incentive{' '}
                <div className="inline font-normal">(OPTIONAL)</div>
              </div>
              <Input
                inputClassName="border-light-gray"
                type="text"
                value={usdcAmount}
                onChange={(e) => {
                  setUsdcAmount(parseFloat(e.target.value));
                }}
              />
            </div>
            <div
              onClick={handleIssueStake}
              className="z-[40] w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg"
            >
              stake
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs xl:text-sm 3xl:text-base">
            <div className="relative h-5 w-5 overflow-hidden rounded-full">
              <Image
                src="https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte"
                alt="token image"
                fill
                className="object-cover"
              />
            </div>
            <div className="mr-3">$TSYM balance: </div>
            <div>5432</div>
            <div className="w-fit cursor-pointer rounded-full border border-primary bg-newdark py-0.5 px-3 text-3xs font-semibold text-primary xl:text-2xs 3xl:text-xs">
              but tokens
            </div>
          </div>

          <div className="mt-8 flex w-full items-end gap-4">
            <div className="flex w-[65%] flex-col gap-8 text-base xl:text-lg 3xl:text-xl">
              <div className="flex w-full items-center justify-between">
                <div>Your current voting power:</div>
                <div>22.69%</div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div>Your current stake (in $):</div>
                <div>1123</div>
              </div>
            </div>
            <div
              className="z-[40] w-fit cursor-pointer rounded-full border border-new-red bg-newdark py-1 px-4 text-xs font-semibold text-new-red text-newdark xl:text-sm 3xl:text-base"
              onClick={handleIssueUnstake}
            >
              unstake?
            </div>
          </div>
        </div>
        <div className="absolute left-0 right-0 top-[30%] bottom-[20%] z-[10] rounded-full bg-[#1D606A] blur-[80px]"></div>
      </div>
      <div className="flex flex-col items-center gap-8">
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 1,
            'h-4 w-4': section !== 1,
          })}
          onClick={() => setSection(1)}
        ></div>
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 2,
            'h-4 w-4': section !== 2,
          })}
          onClick={() => setSection(2)}
        ></div>
        <div
          className={cn('cursor-pointer rounded-full border border-primary', {
            'h-6 w-6 border-4': section === 3,
            'h-4 w-4': section !== 3,
          })}
          onClick={() => setSection(3)}
        ></div>
      </div>
    </div>
  );
};

export default IssueStake;
