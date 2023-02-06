import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import ComingSoon from '@/components/screens/coming-soon';

const JobsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Jobs"
        description="Defios - Tokenize your Open Source Project."
      />
      <ComingSoon
        header="2-click job application"
        discription="Stop creating, uploading and maintaining your resume.pdf on multiple
          portals. Focus on building your proof of work, apply to jobs with
          customized resume from your wallet."
        videoLink="https://www.youtube.com/embed/5C_HPTJg5ek"
        inputPrompt="Enter your email"
        submitPrompt="Get Notified"
      />
    </>
  );
};

JobsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default JobsPage;
