import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import ComingSoon from '@/components/screens/coming-soon';

const EnterprisePage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Enterprise"
        description="Defios - Tokenize your Open Source Project."
      />
      <ComingSoon
        header="Secure your open source dependencies"
        discription="Code now is more internetworked than ever, open source dependency maintenance does not scale-in-house, Deploy capital intelligently to make sure your open source dependencies never break. Simply connect your enterprise VCS account and JIRA and leave the rest to us."
        videoLink="https://www.youtube.com/embed/5C_HPTJg5ek"
        inputPrompt="Enter your business email"
        submitPrompt="Request a Quote"
      />
    </>
  );
};

EnterprisePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default EnterprisePage;
