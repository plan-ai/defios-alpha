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
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';
import mixpanel from 'mixpanel-browser';
import { fetchTokenMetadata, getTokenBalance } from '@/lib/helpers/metadata';

import {
  Program,
  AnchorProvider,
  web3,
  Wallet,
  Idl,
  BN,
} from '@project-serum/anchor';
import { contractAddresses } from '@/config/addresses';
import { Defios, IDL } from '@/types/idl/defios';
import { Signer, Connection } from '@/lib/helpers/wallet';

import CoinInput from '@/components/ui/coin-input';

// import StakeHolders from '@/components/issue-details/StakeHolders';

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
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
  refetch: number;
}

export const IssueStake: React.FC<IssueStakeProps> = ({
  account,
  issueTokenAddress,
  link,
  setRefetch,
  refetch,
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

  const [isLoading, setIsLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  const [isUnstaking, setIsUnstaking] = useState(false);

  const [votingPower, setVotingPower] = useState(0);
  const [stakeByMe, setStakeByMe] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  const [tokenDecimals, setTokenDecimals] = useState(0);

  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenImageUrl, setTokenImageUrl] = useState('');

  const handleIssueStake = () => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (tokenAmount <= 0 && usdcAmount <= 0) return;
    dispatch(onLoading('Staking tokens on the issue...'));
    setIsStaking(true);
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
        setIsStaking(false);
        setRefetch((state) => state + 1);
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
        setIsStaking(false);
      });
  };

  const handleIssueUnstake = () => {
    dispatch(onLoading('Unstaking tokens on the issue...'));
    setIsUnstaking(true);
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
        setIsUnstaking(false);
        setRefetch((state) => state + 1);
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
        setIsUnstaking(false);
      });
  };

  const get_pda_from_seeds = async (seeds: any, program: any) => {
    return await web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );
  };

  const getDefiOsProgram = async (provider: AnchorProvider) => {
    const program: Program<Defios> = new Program(
      IDL,
      contractAddresses.defios,
      provider
    );
    return program;
  };

  const getProvider = async (
    connection: web3.Connection,
    signerWallet: any
  ) => {
    const provider = new AnchorProvider(connection, signerWallet, {});
    return provider;
  };

  const getTokenInfo = async () => {
    const response: any = await fetchTokenMetadata(issueTokenAddress);
    if (response.decimals) {
      setTokenImageUrl(response.json.image);
      setTokenSymbol(response.symbol);
      setTokenDecimals(response.decimals);
    } else {
      const resp: any = await axios.get('https://api-v1.defi-os.com/tokens', {
        headers: {
          Authorization: firebase_jwt,
        },
        params: {
          token_addr: issueTokenAddress,
        },
      });
      if (resp.token_decimals) {
        setTokenImageUrl(resp.token_image_url);
        setTokenSymbol(resp.token_symbol);
        setTokenDecimals(resp.token_decimals);
      }
    }
  };

  const getIssueStakeDetails = async () => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const issueAccount = new PublicKey(account);
    const issueStaker = wallet.publicKey as PublicKey;

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const issueStakerFetch = await program.account.issueStaker
      .fetch(issueStakerAccount)
      .catch((err) => {
        return null;
      });

    let myStake = 0;
    let myVotingPower = 0;
    if (issueStakerFetch !== null) {
      myStake =
        Math.round(
          (parseFloat(issueStakerFetch.stakedAmount[0].toString()) * 100) /
            10 ** tokenDecimals
        ) / 100;
      myVotingPower = parseFloat(issueStakerFetch.prVotingPower.toString());
    }

    const tokenBalanceData = await getTokenBalance(issueTokenAddress);
    setTokenBalance(tokenBalanceData?.uiAmount || 0);

    setStakeByMe(myStake);
    setVotingPower(myVotingPower);
  };

  useEffect(() => {
    getTokenInfo();
  }, []);

  useEffect(() => {
    getIssueStakeDetails();
  }, [tokenDecimals, refetch]);

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
                type="number"
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
                type="number"
                value={usdcAmount}
                onChange={(e) => {
                  setUsdcAmount(parseFloat(e.target.value));
                }}
              />
            </div>
            <div
              onClick={() => {
                if (!isStaking) {
                  handleIssueStake();
                }
              }}
              className="z-[40] w-fit cursor-pointer rounded-full bg-primary py-2 px-8 text-sm font-semibold text-newdark xl:text-base 3xl:text-lg"
            >
              {isStaking ? (
                <Spinner
                  label={null}
                  spinnerClass="!w-6 !h-6"
                  className="px-1.5 py-0.5"
                />
              ) : (
                'stake'
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs xl:text-sm 3xl:text-base">
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              {tokenImageUrl !== '' && (
                <Image
                  src={tokenImageUrl}
                  alt="token image"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="mr-3">{tokenSymbol} balance: </div>
            <div>{tokenBalance}</div>
            <div className="w-fit cursor-pointer rounded-full border border-primary bg-newdark py-0.5 px-3 text-3xs font-semibold text-primary xl:text-2xs 3xl:text-xs">
              but tokens
            </div>
          </div>

          <div className="mt-8 flex w-full items-end gap-4">
            <div className="flex w-[65%] flex-col gap-8 text-base xl:text-lg 3xl:text-xl">
              <div className="flex w-full items-center justify-between">
                <div>Your current voting power:</div>
                <div>{votingPower}</div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div>Your current stake:</div>
                <div>{stakeByMe}</div>
              </div>
            </div>
            <div
              className="z-[40] w-fit cursor-pointer rounded-full border border-new-red bg-newdark py-1 px-4 text-xs font-semibold text-new-red text-newdark xl:text-sm 3xl:text-base"
              onClick={() => {
                if (!isUnstaking) {
                  handleIssueUnstake();
                }
              }}
            >
              {isUnstaking ? (
                <Spinner
                  label={null}
                  spinnerClass="!w-5 !h-5 !text-red-300 fill-red-500"
                  className="px-4 py-0.5"
                />
              ) : (
                'unstake'
              )}
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
