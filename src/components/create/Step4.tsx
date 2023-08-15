import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/store';
import Logo from '@/assets/images/logo.png';
import Image from '@/components/ui/image';

interface Step4Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step4: React.FC<Step4Props> = ({ setStep }) => {
  const step1Data = useAppSelector((state) => state.newCreation.step1);
  const step2Data = useAppSelector((state) => state.newCreation.step2);

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
