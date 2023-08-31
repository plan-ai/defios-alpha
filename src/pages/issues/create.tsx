import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import CreateIssue from '@/components/create-issue/CreateIssue';

import mixpanel from 'mixpanel-browser';

const CreateIssuePage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Create Issue"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <CreateIssue />
    </>
  );
};

CreateIssuePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default CreateIssuePage;
