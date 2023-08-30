import React, { useState, useEffect } from 'react';

import Step1 from '@/components/create/Step1';
import Step2 from '@/components/create/Step2';
import Step3 from '@/components/create/Step3';
import Step4 from '@/components/create/Step4';
import Step5 from '@/components/create/Step5';

interface CreateProps {}

export const Create: React.FC<CreateProps> = ({}) => {
  const [step, setStep] = useState(1);

  return (
    <div className="landing-font flex flex-col items-center gap-6 xl:gap-8 3xl:gap-10">
      {step === 1 && (
        <div className="z-[40] flex items-center rounded-full bg-newdark py-2 px-4 text-base font-bold xl:text-lg 3xl:text-xl">
          <div className="text-primary">Step 1.</div>
          <div>initial setup</div>
        </div>
      )}
      {step === 2 && (
        <div className="z-[40] flex items-center rounded-full bg-newdark py-2 px-4 text-base font-bold xl:text-lg 3xl:text-xl">
          <div className="text-primary">Step 2.</div>
          <div>funding an issue</div>
        </div>
      )}
      {step === 3 && (
        <div className="z-[40] flex items-center rounded-full bg-newdark py-2 px-4 text-base font-bold xl:text-lg 3xl:text-xl">
          <div className="text-primary">Step 3.</div>
          <div>preview</div>
        </div>
      )}
      {step === 4 && (
        <div className="z-[40] flex items-center rounded-full bg-newdark py-2 px-4 text-base font-bold xl:text-lg 3xl:text-xl">
          <div className="text-primary">creating your project</div>
        </div>
      )}
      {step === 5 && (
        <div className="z-[40] flex items-center rounded-full bg-newdark py-2 px-4 text-base font-bold xl:text-lg 3xl:text-xl">
          <div className="text-primary">project created!</div>
        </div>
      )}
      <div className="relative flex h-[38rem] w-[34rem] items-center justify-center xl:h-[44rem] xl:w-[40rem]  2xl:h-[46rem] 2xl:w-[42rem]">
        <div className="absolute z-[20] h-full w-full">
          <div className="absolute -left-[2.5%] bottom-0 h-[60%] w-[102.5%] rounded-full border-2 bg-white blur-[100px]" />
          <div
            className="absolute left-[20%] bottom-[12%] h-[50%] w-full -rotate-[48.87deg] rounded-full border-2 bg-cyan-800 blur-[50px]
           "
          />
          <div className="absolute -left-[2.5%] -top-[1%] h-[75%] w-[105%] rounded-full border-2 bg-indigo-300 blur-[100px]" />
        </div>
        {step === 1 && <Step1 setStep={setStep} />}
        {step === 2 && <Step2 setStep={setStep} />}
        {step === 3 && <Step3 setStep={setStep} />}
        {step === 4 && <Step4 setStep={setStep} />}
        {step === 5 && <Step5 setStep={setStep} />}
      </div>
    </div>
  );
};

export default Create;
