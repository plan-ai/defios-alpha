import React, { useState, useEffect } from 'react';
import IssueComment from '@/components/issue-details/IssueComment';
import IssueCommentCreator from '@/components/issue-details/IssueCommentCreator';
import Spinner from '@/components/custom/spinner';
import TagImage from '@/components/ui/tags/tag-image';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';

import CoinInput from '@/components/ui/coin-input';

import StakeHolders from '@/components/issue-details/StakeHolders';

import Image from '@/components/ui/image';
import Button from '@/components/ui/button/button';

interface IssueStakeProps {}

export const IssueStake: React.FC<IssueStakeProps> = ({}) => {
  const { data: session } = useSession();

  const [pieChartData, setPieChartData] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState(0);

  const coinList = [
    {
      token_image_url:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU/logo.png',
      token_symbol: 'USDC',
      token_spl_addr: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    },
    {
      repository: '2c8tDPE7eBy7EJUjuiweCRheH1rQoQMBXBKk5ga8UbJs',
      token_image_url:
        'https://ipfs.io/ipfs/QmNeUqucEW5g53mJ1rt5fzvHzNfQo14TGuEuNV2o5LBQte',
      token_new: true,
      token_spl_addr: '91tB1NHt4yi3bgyqc45vLq1VdXcubpMyJhsS5aL71JEn',
      token_symbol: 'DOSA',
    },
  ];

  const [stakeCoin, setStakeCoin] = useState<any>(coinList[0]);

  const [isLoading, setIsLoading] = useState(true);

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
                disabled
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
              <Button fullWidth shape="rounded" size="small" color="info">
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
