import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import Projects from '@/components/projects/projects';

import mixpanel from 'mixpanel-browser'

const ProjectsPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Projects"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <Projects />
    </>
  );
};

ProjectsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ProjectsPage;
