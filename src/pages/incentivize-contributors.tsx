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

const IncentivizeContributorsPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();

  const [stepOfCreation, setStepOfCreation] = useState(1);
  const [reset, setReset] = useState(0);
  return (
    <>
      <NextSeo
        title="Incentivize Contributors"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="flex h-full w-full flex-col items-center justify-between px-5">
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
      </div>
    </>
  );
};

IncentivizeContributorsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IncentivizeContributorsPage;
