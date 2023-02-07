import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import RightSideIncentivize from '@/components/incentivize/right-side-incentivize';

const IncentivizeContributorsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Incentivize Contributors"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="flex h-full w-full items-center justify-between px-5">
        <div className="w-[65%]"></div>
        <RightSideIncentivize />
      </div>
    </>
  );
};

IncentivizeContributorsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IncentivizeContributorsPage;
