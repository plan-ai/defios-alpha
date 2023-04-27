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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const AuthorProfilePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  return (
    <>
      <NextSeo
        title="Profile"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      <div className="relative h-36 w-full overflow-hidden rounded-xl sm:h-44 md:h-64 xl:h-80 2xl:h-96 4xl:h-[448px]">
        <Image
          src={authorData?.cover_image?.thumbnail}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          alt="Cover Image"
        />
      </div>
      <div className="mx-auto flex w-full shrink-0 flex-col md:px-4 xl:px-6 4xl:max-w-[1700px] 4xl:px-12">
        <div className="z-10 relative mx-0 -mt-16 flex h-32 w-32 items-center justify-center rounded-full border-2 border-gray-500">
          <Avatar
            src={githubInfo?.avatar_url || ''}
            name={githubInfo?.name || ''}
            className="rounded-full object-cover"
            style={'fill'}
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
