import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

const ProjectsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Projects"
        description="Defios - Tokenize your Open Source Project."
      />
      <div>Projects</div>
    </>
  );
};

ProjectsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ProjectsPage;
