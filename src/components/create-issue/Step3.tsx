import React, { useEffect, useState } from 'react';
import Logo from '@/assets/images/logo.png';
import Image from '@/components/ui/image';

import { createIssueStake } from '@/lib/helpers/contractInteract';

import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setStep3Data } from '@/store/issueCreateSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { useSession } from 'next-auth/react';
import mixpanel from 'mixpanel-browser';
import axios from '@/lib/axiosClient';

interface Step4Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step4: React.FC<Step4Props> = ({ setStep }) => {
  const step1Data = useAppSelector((state) => state.issueCreate.step1);

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const userMappingState = useAppSelector(selectUserMapping);

  const createGHIssue = async () => {
    const data = JSON.stringify({
      title: step1Data.issueTitle,
      body:
        step1Data.issueDescription +
        '\n\nThis issue was created at https://www.defi-os.com , please login/signup on it to get cash rewards for solving it.',
      labels: step1Data.tags,
    });

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.github.com/repositories/${step1Data.repoId}/issues`,
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    return axios(config)
      .then((res) => res.data.html_url)
      .catch((err) => err);
  };

  const AddIssueToDefiOS = async () => {
    if (
      step1Data.selectedProject === null ||
      step1Data.selectedProject === undefined ||
      step1Data.selectedIssue === null ||
      step1Data.selectedIssue === undefined
    )
      return;
    dispatch(onLoading('Creating an Issue...'));

    let hadError = false;

    let issueUrl = '';
    if (step1Data.issueType === 'create') {
      issueUrl = await createGHIssue().catch((err) => {
        hadError = false;
        dispatch(
          onFailure({
            label: 'GH issue creation in project creation Failed',
            description: err.message,
            link: '',
            redirect: null,
          })
        );
        mixpanel.track('GH issue creation in project creation Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
        return '';
      });
    } else {
      issueUrl = step1Data.selectedIssue.html_url;
    }

    if (hadError) return;

    await createIssueStake(
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      issueUrl,
      new PublicKey(step1Data.selectedProject.project_account),
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      step1Data.tokenIncentive,
      step1Data.usdcIncentive,
      firebase_jwt || ''
    )
      .then((res) => {
        dispatch(
          setStep3Data({
            repoLink: step1Data.repoLink,
            issueLink: issueUrl,
          })
        );
        dispatch(
          onSuccess({
            label: 'Issue Creation Success',
            description: 'check out created project at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: null,
          })
        );
        mixpanel.track('Issue Creation Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          repo_github_id: step1Data.selectedProject.project_github_id,
          repo_github_link: step1Data.selectedProject.project_repo_link,
          issue_url: issueUrl,
          issue_title: step1Data.selectedIssue.title,
          issue_description: step1Data.issueDescription,
          issue_token_incentive: step1Data.tokenIncentive,
          issue_usdc_incentive: step1Data.usdcIncentive,
        });
        setStep(4);
      })
      .catch((err) => {
        dispatch(
          onFailure({
            label: 'Issue Creation Failed',
            description: err.message,
            link: '',
            redirect: null,
          })
        );
        mixpanel.track('Project Creation Failed', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          error: err.message,
        });
      });
  };

  useEffect(() => {
    if (
      firebase_jwt === null ||
      firebase_jwt === undefined ||
      (session as any).accessToken === null ||
      (session as any).accessToken === undefined ||
      step1Data.selectedProject === null ||
      step1Data.selectedProject === undefined ||
      step1Data.selectedIssue === undefined ||
      step1Data.selectedIssue === null
    )
      return;
    AddIssueToDefiOS();
  }, [firebase_jwt, session, step1Data]);

  return (
    <div className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg">
      <div className="flex flex-col gap-8 text-lg font-semibold xl:text-xl 3xl:text-2xl">
        <div className="px-4">creating</div>
        <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
      </div>
      <div className="mt-5 flex h-full flex-col gap-4 px-4 text-xs xl:text-sm 3xl:text-base">
        <div>starting issue creation...</div>
        <div>first issue created...</div>
        <div>staking issue tokens...</div>
        <div>tokens staked...</div>
        <div>completed...</div>
      </div>
      <div className="flex flex-col items-center gap-6 text-xs xl:text-sm 3xl:text-base">
        <div className="relative h-28 w-28 animate-spin overflow-hidden rounded-full">
          <Image src={Logo} alt="logo" fill className="object-cover" />
        </div>
        <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
        <div>please sign the transaction with your wallet</div>
      </div>
    </div>
  );
};

export default Step4;
