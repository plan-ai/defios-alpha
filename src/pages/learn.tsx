import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import Learn from '@/components/learn/learnPost';
import mixpanel from 'mixpanel-browser';

const LearnPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Learn"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <Learn />
    </>
  );
};

LearnPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default LearnPage;
