import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import Image from '@/components/ui/image';
import Avatar from 'react-avatar';

import Profile from '@/components/profile/profile';
// static data
import { authorData } from '@/data/static/author';
import RootLayout from '@/layouts/_root-layout';
import { useAppSelector } from '@/store/store';

import mixpanel from 'mixpanel-browser';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const AuthorProfilePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  mixpanel.track_pageview();

  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  return (
    <>
      <NextSeo
        title="Profile"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <div className="relative mt-3 h-[15rem] w-full overflow-hidden rounded-xl lg:h-[15.5rem] xl:h-[17rem] 2xl:h-[19rem] 3xl:h-[20rem]">
        <Image
          src={authorData?.cover_image?.thumbnail}
          placeholder="blur"
          fill
          alt="Cover Image"
          className="object-cover"
        />
      </div>
      <div className="mx-auto flex w-full shrink-0 flex-col md:px-4 xl:px-6 4xl:max-w-[1700px] 4xl:px-12">
        <div className="relative z-10 mx-0 -mt-12 flex h-24 w-24 items-center justify-center rounded-full xl:-mt-14 xl:h-28 xl:w-28 3xl:-mt-16 3xl:h-32 3xl:w-32">
          <Avatar
            src={githubInfo?.avatar_url || ''}
            name={githubInfo?.name || ''}
            className="rounded-full border-2 border-gray-500 object-cover"
            size="100%"
          />
        </div>

        <Profile />
      </div>
    </>
  );
};

AuthorProfilePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default AuthorProfilePage;
