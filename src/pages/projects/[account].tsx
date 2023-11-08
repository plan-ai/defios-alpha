import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import ProjectDetails from '@/components/project-details/ProjectDetails';

import mixpanel from 'mixpanel-browser';

const ProjectDetailsPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();
  return (
    <>
      <NextSeo
        title="Project Details"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <ProjectDetails />
    </>
  );
};

ProjectDetailsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ProjectDetailsPage;
