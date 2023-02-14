import React from 'react';
import cn from 'classnames';
import { Check } from '@/components/icons/check';

const Spinner = () => {
  return (
    <div className="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

interface StepOfProcessProps {
  stepNumber: number;
  step: number;
  label?: string;
  isEnd?: boolean;
  isStart?: boolean;
}

const StepOfProcess: React.FC<StepOfProcessProps> = ({
  stepNumber,
  step,
  label,
  isEnd,
  isStart,
}) => {
  return (
    <div className="flex w-32 flex-col">
      <div className="mb-4 flex w-full items-center">
        <div
          className={cn('h-0.5 w-8', {
            'border-t-2 border-blue-500':
              step >= stepNumber && isStart === undefined,
            'border-t-2 border-dashed border-gray-500':
              step < stepNumber && isStart === undefined,
          })}
        ></div>
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl text-gray-400 ',
            {
              'border-blue-500 bg-blue-500': step > stepNumber,
              'border-dashed border-gray-500 bg-transparent':
                step <= stepNumber,
            }
          )}
        >
          {step === stepNumber ? (
            <Spinner />
          ) : step < stepNumber ? (
            stepNumber
          ) : (
            <Check className="h-6 w-6" />
          )}
        </div>
        <div
          className={cn('h-0.5 w-8 ', {
            'border-t-2 border-blue-500':
              step > stepNumber && isEnd === undefined,
            'border-t-2 border-dashed border-gray-500':
              step <= stepNumber && isEnd === undefined,
          })}
        ></div>
      </div>
      <div className="text-center text-sm">{label}</div>
    </div>
  );
};

interface ProcessUIProps {
  step: number;
}

const ProcessUI: React.FC<ProcessUIProps> = ({ step }) => {
  return (
    <div className="flex h-full w-full">
      <StepOfProcess
        step={step}
        stepNumber={1}
        isStart={true}
        label="Request Submitted"
      />
      <StepOfProcess step={step} stepNumber={2} label="Received Responses" />
      <StepOfProcess step={step} stepNumber={3} label="Negotiation Done" />
      <StepOfProcess step={step} stepNumber={4} label="Hired Professionals" />
      <StepOfProcess
        step={step}
        stepNumber={5}
        isEnd={true}
        label="Service Completed"
      />
    </div>
  );
};

export default ProcessUI;
