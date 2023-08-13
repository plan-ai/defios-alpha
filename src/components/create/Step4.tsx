import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/store';

interface Step4Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step4: React.FC<Step4Props> = ({ setStep }) => {
  const step1Data = useAppSelector((state) => state.newCreation.step1);
  const step2Data = useAppSelector((state) => state.newCreation.step2);

  return (
    <div className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg"></div>
  );
};

export default Step4;
