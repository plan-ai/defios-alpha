import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import Create from '@/components/create/Create';

import mixpanel from 'mixpanel-browser';

const IncentivizeContributorsPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Incentivize Contributors"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <Create />
    </>
  );
};

IncentivizeContributorsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IncentivizeContributorsPage;
