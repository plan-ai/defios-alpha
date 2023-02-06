import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

const IssuesPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Issues"
        description="Defios - Tokenize your Open Source Project."
      />
      <div>Issues</div>
    </>
  );
};

IssuesPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default IssuesPage;
