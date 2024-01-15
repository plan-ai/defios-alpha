import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import cn from 'classnames';
import mixpanel from 'mixpanel-browser';

//redux
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

//ui components
import Spinner from '@/components/custom/spinner';
import Image from '@/components/ui/image';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/ButtonNew';

//contract functions , utils
import {
  stakeIssueTokens,
  unstakeIssueTokens,
} from '@/lib/helpers/contractInteract';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface IssueStakeProps {
  issueData: any;
  tokenDetails: any;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const IssueStake: React.FC<IssueStakeProps> = ({
  issueData,
  tokenDetails,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const wallet = useWallet();
  const { data: session } = useSession();
  const userMappingState = useAppSelector(selectUserMapping);

  const [tokenAmount, setTokenAmount] = React.useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleIssueStake = () => {
    if (
      issueData === null ||
      issueData === undefined ||
      issueData.issue_account === null ||
      issueData.issue_account === undefined
    )
      return;
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (tokenAmount <= 0 ) return;
    dispatch(onLoading('Staking tokens on the issue...'));
    setIsStaking(true);
    stakeIssueTokens(
      wallet.publicKey as PublicKey,
      new PublicKey(issueData?.issue_account),
      tokenAmount,
      firebase_jwt,
      issueData?.issue_token?.token_decimals
    )
      .then((res) => {
        setTokenAmount(0);
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
          issue_account: issueData?.issue_account,
          token_address: issueData?.issue_token?.token_spl_addr,
          token_amount: tokenAmount,
          issue_github_link: issueData?.issue_gh_url,
        });
        setIsStaking(false);
        setRefetch((state) => state + 1);
      })
      .catch((err) => {
        setTokenAmount(0);
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
        setIsStaking(false);
      });
  };

  const handleIssueUnstake = () => {
    dispatch(onLoading('Unstaking tokens on the issue...'));
    setIsUnstaking(true);
    unstakeIssueTokens(
      wallet.publicKey as PublicKey,
      new PublicKey(issueData?.issue_account)
    )
      .then((res) => {
        setTokenAmount(0);
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
          issue_account: issueData?.issue_account,
          token_address: issueData?.issue_token?.token_spl_addr,
          issue_github_link: issueData?.issue_gh_url,
        });
        setIsUnstaking(false);
        setRefetch((state) => state + 1);
      })
      .catch((err) => {
        setTokenAmount(0);
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
        setIsUnstaking(false);
      });
  };

  return (
    <div className="relative mx-32 w-full">
      <div className="relative z-[40] flex w-full flex-col justify-between gap-3 rounded-[3rem] bg-body px-12 py-8 xl:px-14 xl:py-10 3xl:px-16 3xl:py-12">
        <div className="flex w-full w-full items-end gap-12">
          <div className="flex w-[30%] flex-col gap-2">
            <div className="ml-1 text-base font-semibold uppercase xl:text-lg 3xl:text-xl">
              Token Incentive
            </div>
            <Input
              inputClassName="border-light-gray"
              type="number"
              value={tokenAmount}
              onChange={(e) => {
                setTokenAmount(parseFloat(e.target.value));
              }}
            />
          </div>
          <Button
            color={
              issueData?.issue_state === 'open' ? 'PrimarySolid' : 'GraySolid'
            }
            onClick={() => {
              if (!isStaking && issueData?.issue_state === 'open') {
                handleIssueStake();
              }
            }}
            disabled={issueData?.issue_state === 'closed'}
            isLoading={isStaking}
          >
            stake
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs xl:text-sm 3xl:text-base">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            {issueData?.issue_token?.token_image_url !== '' && (
              <Image
                src={issueData?.issue_token?.token_image_url}
                alt="token image"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="mr-3">
            {issueData?.issue_token?.token_symbol} balance:{' '}
          </div>
          <div>{tokenDetails?.tokenBalance}</div>
          <div className="w-fit cursor-pointer rounded-full border border-primary bg-newdark py-0.5 px-3 text-3xs font-semibold text-primary xl:text-2xs 3xl:text-xs">
            buy tokens
          </div>
        </div>

        <div className="mt-8 flex w-full items-end gap-4">
          <div className="flex w-[65%] flex-col gap-8 text-base xl:text-lg 3xl:text-xl">
            <div className="flex w-full items-center justify-between">
              <div>Your current voting power:</div>
              <div>
                {tokenDetails?.votingPower}
                %
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div>Your current stake:</div>
              <div>{tokenDetails?.stakeByMe}</div>
            </div>
          </div>
          <Button
            color={
              issueData?.issue_state === 'open' && !tokenDetails?.voted
                ? 'RedOutline'
                : 'GrayOutline'
            }
            onClick={() => {
              if (
                !isUnstaking &&
                issueData?.issue_state === 'open' &&
                !tokenDetails?.voted
              ) {
                handleIssueUnstake();
              }
            }}
            disabled={
              issueData?.issue_state === 'closed' || tokenDetails?.voted
            }
            isLoading={isUnstaking}
            size="small"
          >
            unstake
          </Button>
        </div>
      </div>
      <div className="absolute left-0 right-0 top-[30%] bottom-[20%] z-[10] rounded-full bg-[#1D606A] blur-[80px]"></div>
    </div>
  );
};

export default IssueStake;
