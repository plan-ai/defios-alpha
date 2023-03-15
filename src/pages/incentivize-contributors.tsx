import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import CreateProject from '@/components/incentivize/createProject';
import AttachRepo from '@/components/incentivize/attachRepo';
import ConfigToken from '@/components/incentivize/configToken';
import CreationProcess from '@/components/incentivize/creationProcess';
import Button from '@/components/ui/button/button';
import { useAppDispatch } from '@/store/store';
import { reset as resetCreation } from '@/store/creationSlice';
import { useWallet } from '@solana/wallet-adapter-react';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const IncentivizeContributorsPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const wallet = useWallet();

  const [stepOfCreation, setStepOfCreation] = useState(1);
  const [reset, setReset] = useState(0);
  const [repo, setRepo] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSupply, setTokenSupply] = useState(1000000);
  const [tokenLogo, setTokenLogo] = useState('');
  return (
    <>
      <NextSeo
        title="Incentivize Contributors"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <div className="relative flex h-full w-full flex-col items-center justify-between py-10 px-5">
        <div className="mb-5 w-[80%]">
          <Button
            shape="rounded"
            size="small"
            onClick={() => {
              setStepOfCreation(1);
              setReset(reset + 1);
              dispatch(resetCreation());
            }}
          >
            Reset
          </Button>
        </div>
        <CreateProject
          setStepOfCreation={setStepOfCreation}
          stepOfCreation={stepOfCreation}
          reset={reset}
        />
        <AttachRepo
          setStepOfCreation={setStepOfCreation}
          stepOfCreation={stepOfCreation}
          reset={reset}
          setRepoCallback={setRepo}
        />
        <ConfigToken
          setStepOfCreation={setStepOfCreation}
          stepOfCreation={stepOfCreation}
          reset={reset}
        />
        <CreationProcess
          setStepOfCreation={setStepOfCreation}
          stepOfCreation={stepOfCreation}
          reset={reset}
        />
        {wallet.publicKey === null && (
          <div className="absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-5 rounded-lg border-2 border-white bg-dark p-10 text-xl shadow-2xl">
              <Image src={ErrorDarkImage} className="w-80" alt="404 Error" />
              <div>Connect Wallet to Continue</div>
              <WalletMultiButton className="rounded-full bg-blue-500" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

IncentivizeContributorsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IncentivizeContributorsPage;
