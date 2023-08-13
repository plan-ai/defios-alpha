import React, { useState, useEffect } from 'react';
import IssueComment from '@/components/issue-details/IssueComment';
import IssueCommentCreator from '@/components/issue-details/IssueCommentCreator';
import Spinner from '@/components/custom/spinner';
import TagImage from '@/components/ui/tags/tag-image';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';

import { stakeIssue, unstakeIssue } from '@/lib/helpers/contractInteract';
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

  const [stakeAmount, setStakeAmount] = React.useState<number>(0);
  const [stakeCoin, setStakeCoin] = useState<any>(coinList[0]);

  const [pieChartData, setPieChartData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleIssueStake = () => {
    if (firebase_jwt === null || firebase_jwt === undefined) return;
    if (stakeAmount <= 0) return;
    dispatch(onLoading('Staking tokens on the issue...'));
    stakeIssue(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      stakeAmount,
      new PublicKey(issueTokenAddress),
      firebase_jwt
    )
      .then((res) => {
        setStakeAmount(0);
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
          stake_amount: stakeAmount,
          issue_github_link: link,
        });
        dispatch(setRefetch('issue'));
      })
      .catch((err) => {
        setStakeAmount(0);
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
    unstakeIssue(
      wallet.publicKey as PublicKey,
      new PublicKey(account),
      new PublicKey(issueTokenAddress)
    )
      .then((res) => {
        setStakeAmount(0);
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
        setStakeAmount(0);
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

  useEffect(() => {
    setPieChartData(null);
    const coin = coinList[1];
    if (coin?.token_spl_addr && coin.token_spl_addr === '') return;

    axios
      .get(
        `https://api.solscan.io/token/holders?token=${coin?.token_spl_addr}&offset=0&size=4&cluster=devnet`
      )
      .then((res) => {
        const data = res.data.data.result;
        const newData = data.map((item: any) => {
          let volume = '';
          const amt = item.uiAmount;
          if (amt > 10 ** 12) {
            volume = (Math.floor(amt / 10 ** 10) / 100).toString() + ' Tn';
          } else if (amt > 10 ** 9) {
            volume = (Math.floor(amt / 10 ** 7) / 100).toString() + ' Bn';
          } else if (amt > 10 ** 6) {
            volume = (Math.floor(amt / 10 ** 5) / 100).toString() + ' Mn';
          } else {
            volume = (Math.floor(amt / 10 ** 1) / 100).toString() + ' K';
          }
          return {
            owner: item.address,
            value: parseInt(item.amount),
            decimals: item.decimals,
            volume: volume,
          };
        });
        setPieChartData({ chartData: newData, coin: coin });
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="mt-5 flex w-full flex-col">
      <div className="flex w-full justify-between">
        <div className="flex w-[70%] justify-center">
          {isLoading && (
            <div className="mt-10">
              <Spinner label="Loading issue stake chart ..." />
            </div>
          )}
          {!isLoading && pieChartData !== null && (
            <StakeHolders chartData={pieChartData} />
          )}
        </div>
        <div className="flex w-[30%] flex-col items-center gap-4 ">
          <div className="flex w-full flex-col gap-2 text-sm xl:text-base 3xl:text-lg">
            <div className="ml-2">Stake on Issue</div>
            <div className="flex flex-col items-end gap-2 rounded-xl bg-gray-900 p-4 text-2xs xl:text-xs 3xl:text-sm">
              <div className="mr-2">Bal: 100.23 USDC</div>
              <CoinInput
                label={'From'}
                exchangeRate={0.0}
                value={stakeAmount.toString()}
                handleOnChange={(e) => setStakeAmount(e.target.value)}
                type="number"
                defaultCoinIndex={1}
                getCoinValue={(data) => console.log('Coin changed')}
                coinList={coinList}
                selectedCoin={stakeCoin}
                setSelectedCoin={setStakeCoin}
              />
              <div className="flex items-center gap-2">
                <Button
                  shape="rounded"
                  size="mini"
                  className="text-gray-400"
                  variant="transparent"
                >
                  50%
                </Button>
                <Button
                  shape="rounded"
                  size="mini"
                  className="text-primary"
                  variant="transparent"
                >
                  MAX
                </Button>
              </div>
              <Button fullWidth shape="rounded" size="small" color="info">
                Stake
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 text-sm xl:text-base 3xl:text-lg">
            <div className="ml-2">Your Current Stake</div>
            <div className="flex flex-col gap-3 rounded-xl bg-gray-900 p-4 text-2xs xl:text-xs 3xl:text-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    alt="coin"
                    src={coinList[1].token_image_url}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>3.5K DOS</div>
                <div className="text-gray-500">(~$120)</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    alt="coin"
                    src={coinList[0].token_image_url}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>1200 USDC</div>
                <div className="text-gray-500">(~$1200.0)</div>
              </div>
              <Button
                onClick={handleIssueUnstake}
                fullWidth
                shape="rounded"
                size="small"
                color="info"
              >
                Unstake
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueStake;
