import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import IssueDetails from '@/components/issue-details/IssueDetails';

import mixpanel from 'mixpanel-browser';

const IssueDetailsPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Issue Details"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <IssueDetails />
    </>
  );
};

IssueDetailsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IssueDetailsPage;
