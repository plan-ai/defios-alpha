import React, { useEffect, useState } from 'react';
import Logo from '@/assets/images/logo.png';
import Image from '@/components/ui/image';

import {
  createRepositoryUnlockIssueStake,
  createRepositoryImportedIssueStake,
} from '@/lib/helpers/contractInteract';
import { PublicKey } from '@solana/web3.js';
import { selectUserMapping } from '@/store/userMappingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setStep4Data } from '@/store/newCreationSlice';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '@/lib/helpers/metadata';
import { useSession } from 'next-auth/react';
import mixpanel from 'mixpanel-browser';
import axios from '@/lib/axiosClient';

interface Step4Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step4: React.FC<Step4Props> = ({ setStep }) => {
  const step1Data = useAppSelector((state) => state.newCreation.step1);
  const step2Data = useAppSelector((state) => state.newCreation.step2);

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const userMappingState = useAppSelector(selectUserMapping);

  const AddTokenDataToIPFS = async () => {
    const imageHash = await uploadFileToIPFS(step1Data.tokenIcon as File);
    const metadataHash = await uploadMetadataToIPFS({
      name: step1Data.tokenName,
      symbol: step1Data.tokenSymbol,
      image: `https://ipfs.io/ipfs/${imageHash}`,
    });
    return `https://ipfs.io/ipfs/${metadataHash}`;
  };

  const createGHIssue = async () => {
    const data = JSON.stringify({
      title: step2Data.issueTitle,
      body:
        step2Data.issueDescription +
        '\n\nThis issue was created at https://www.defi-os.com , please login/signup on it to get cash rewards for solving it.',
      labels: step2Data.tags,
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

  const createProjectNewToken = async () => {
    dispatch(onLoading('Creating Project Repository...'));

    let hadError = false;

    const tokenIpfsHash = await AddTokenDataToIPFS().catch((err) => {
      hadError = false;
      dispatch(
        onFailure({
          label: 'Token IPFS pinning Failed',
          description: err.message,
          link: '',
          redirect: null,
        })
      );
      mixpanel.track('Token IPFS pinning Failed', {
        github_id: userMappingState.userMapping?.userName,
        user_pubkey: userMappingState.userMapping?.userPubkey,
        error: err.message,
      });
      return '';
    });

    if (hadError) return;

    let issueUrl = '';
    if (step2Data.issueType === 'create') {
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
      issueUrl = step2Data.selectedIssue.html_url;
    }

    if (hadError) return;

    await createRepositoryUnlockIssueStake(
      //repo
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      step1Data.repoId,
      step1Data.projectDescription,
      step1Data.repoLink,
      step1Data.tokenName,
      step1Data.tokenSymbol,
      tokenIpfsHash,
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      //issue
      issueUrl,
      //stake
      step2Data.tokenIncentive,
    )
      .then((res) => {
        dispatch(
          setStep4Data({
            repoLink: step1Data.repoLink,
            issueLink: issueUrl,
          })
        );
        dispatch(
          onSuccess({
            label: 'Project Creation Success',
            description: 'check out created project at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: null,
          })
        );
        mixpanel.track('Project Creation Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          repo_github_id: step1Data.repoId,
          repo_github_name: step1Data.repoName,
          project_description: step1Data.projectDescription,
          repo_github_link: step1Data.repoLink,
          token_name: step1Data.tokenName,
          token_symbol: step1Data.tokenSymbol,
          token_metadata_url: tokenIpfsHash,
          issue_url: issueUrl,
          token_type: 'new',
          issue_title: step2Data.issueTitle,
          issue_description: step2Data.issueDescription,
          issue_token_incentive: step2Data.tokenIncentive,
        });
        setStep(5);
      })
      .catch((err) => {
        dispatch(
          onFailure({
            label: 'Project Creation Failed',
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

  const createProjectImported = async () => {
    dispatch(onLoading('Creating Project Repository...'));

    let hadError = false;

    let issueUrl = '';
    if (step2Data.issueType === 'create') {
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
      issueUrl = step2Data.selectedIssue.html_url;
    }

    if (hadError) return;

    await createRepositoryImportedIssueStake(
      //repo
      new PublicKey(userMappingState.userMapping?.userPubkey as string),
      step1Data.repoId,
      step1Data.projectDescription,
      step1Data.repoLink,
      new PublicKey(
        userMappingState.userMapping?.verifiedUserAccount as string
      ),
      step1Data.tokenAddress || '',
      step1Data.tokenName,
      step1Data.tokenSymbol,
      step1Data.tokenImgLink,
      firebase_jwt || '',
      //issue
      issueUrl,
      //stake
      step2Data.tokenIncentive,
    )
      .then((res) => {
        dispatch(
          setStep4Data({
            repoLink:step1Data.repoLink,
            issueLink:issueUrl,
          })
        );
        dispatch(
          onSuccess({
            label: 'Project Creation Success',
            description: 'check out created project at',
            link: res
              ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
              : '',
            redirect: null,
          })
        );
        mixpanel.track('Project Creation Success', {
          github_id: userMappingState.userMapping?.userName,
          user_pubkey: userMappingState.userMapping?.userPubkey,
          tx_link: res
            ? `https://solscan.io/account/${res.toString()}?cluster=devnet`
            : '',
          repo_github_id: step1Data.repoId,
          repo_github_name: step1Data.repoName,
          project_description: step1Data.projectDescription,
          repo_github_link: step1Data.repoLink,
          token_name: step1Data.tokenName,
          token_symbol: step1Data.tokenSymbol,
          token_image: step1Data.tokenImgLink,
          token_address: step1Data,
          token_type: 'imported',
          issue_url: issueUrl,
          issue_title: step2Data.issueTitle,
          issue_description: step2Data.issueDescription,
          issue_token_incentive: step2Data.tokenIncentive,
        });
        setStep(5);
      })
      .catch((err) => {
        dispatch(
          onFailure({
            label: 'Project Creation Failed',
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
      (session as any).accessToken === undefined
    )
      return;
    if (step1Data.tokenType === 'create new token') {
      createProjectNewToken();
    }
    if (step1Data.tokenType === 'import existing token') {
      createProjectImported();
    }
  }, [firebase_jwt, session]);

  return (
    <div className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg">
      <div className="flex flex-col gap-8 text-lg font-semibold xl:text-xl 3xl:text-2xl">
        <div className="px-4">creating</div>
        <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
      </div>
      <div className="mt-5 flex h-full flex-col gap-4 px-4 text-xs xl:text-sm 3xl:text-base">
        <div>creating your project...</div>
        <div>project created.</div>
        <div>creating project token...</div>
        <div>sending on-chain instructions...</div>
        <div>token created.</div>
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
