import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

const IncentivizeContributorsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Incentivize Contributors"
        description="Defios - Tokenize your Open Source Project."
      />
      <div>Incentivize Contributors</div>
    </>
  );
};

IncentivizeContributorsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IncentivizeContributorsPage;
