import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

const RoadmapsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Roadmaps"
        description="Defios - Tokenize your Open Source Project."
      />
      <div>Roadmaps</div>
    </>
  );
};

RoadmapsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default RoadmapsPage;
