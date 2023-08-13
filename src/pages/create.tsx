import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import Create from '@/components/create/Create';

import mixpanel from 'mixpanel-browser';

const CreatePage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Create"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <Create />
    </>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default CreatePage;
