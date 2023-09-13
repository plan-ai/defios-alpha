import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/button';
import Image from '@/components/ui/image';
import cn from 'classnames';

import { useSession } from 'next-auth/react';
import { getFirebaseJwt } from '@/store/firebaseTokensSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import axios from '@/lib/axiosClient';
import { useRouter } from 'next/router';

import ContibutorImage from '@/assets/images/undraw_programmer_re_owql.svg';
import RepoOwnerImage from '@/assets/images/undraw_instant_analysis_re_mid5.svg';

interface OnboardingProps {}

const Onboarding: React.FC<OnboardingProps> = ({}) => {
  const [userRole, setUserRole] = useState('unchoosen');

  const router = useRouter();

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (
      firebase_jwt === null &&
      //@ts-ignore
      session?.user?.id &&
      //@ts-ignore
      session?.accessToken
    ) {
      const notifToken = sessionStorage.getItem('browser-notif-token');
      //@ts-ignore
      dispatch(
        getFirebaseJwt({
          //@ts-ignore
          github_id: session.user.id,
          //@ts-ignore
          firebase_uid: notifToken !== null ? notifToken : session.user.id,
          //@ts-ignore
          user_gh_access_token: session.accessToken,
          //@ts-ignore
          pub_key: '',
        })
      );
    }
  }, [session, dispatch, firebase_jwt]);

  const handleSumbitType = async () => {
    if (
      userRole === 'repo_owner' ||
      userRole === 'contributor' ||
      userRole === 'unchoosen'
    ) {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/track/user/type?user_type=${userRole}`,
        headers: {
          Authorization: firebase_jwt,
        },
      };

      axios
        .request(config)
        .then((res) => {
          localStorage.setItem('user_type', res.data.user_type);
          router.push('/learn');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-body">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-base xl:text-lg 3xl:text-xl">
          Which of the following best describes how you want to use defi-os.com?
        </div>
        <div className="flex items-center justify-center gap-6">
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-gray-700 p-6 shadow-xl transition-all hover:scale-[103%] hover:border-gray-500',
              {
                'gradient-border-box': userRole === 'contributor',
              }
            )}
            onClick={() => setUserRole('contributor')}
          >
            <div className="relative h-32 w-32 xl:h-40 xl:w-40 3xl:h-48 3xl:w-48">
              <Image
                src={ContibutorImage}
                alt="contributor"
                className="object-cover"
                fill
              />
            </div>
            <div className="py-0.5 text-lg font-semibold text-primary xl:text-xl 3xl:text-2xl">
              Contributor
            </div>
            <div className="text-wrap xl:w-68 w-64 text-center text-xs xl:text-sm 3xl:w-72 3xl:text-base">
              if you are working on existing open source projects or
              staking money on open issues.
            </div>
          </div>
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-gray-700 p-6 shadow-xl transition-all hover:scale-[103%] hover:border-gray-500',
              {
                'gradient-border-box': userRole === 'repo_owner',
              }
            )}
            onClick={() => setUserRole('repo_owner')}
          >
            <div className="relative h-32 w-32 xl:h-40 xl:w-40 3xl:h-48 3xl:w-48">
              <Image
                src={RepoOwnerImage}
                alt="repo owner"
                className="object-cover"
                fill
              />
            </div>
            <div className="py-0.5 text-lg font-semibold text-primary xl:text-xl 3xl:text-2xl">
              Repo Owner
            </div>
            <div className="text-wrap xl:w-68 w-64 text-center text-xs xl:text-sm 3xl:w-72 3xl:text-base">
              For people who own and operate multiple open source
              repositories and want a management console.
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setUserRole('unchoosen');
          handleSumbitType();
        }}
        className="absolute top-5 right-5 cursor-pointer text-sm text-gray-400 xl:text-base 3xl:text-lg"
      >
        Skip
      </div>
      <div className="absolute bottom-5 right-5">
        <Button
          onClick={() => {
            if (userRole === 'repo_owner' || userRole === 'contributor') {
              handleSumbitType();
            }
          }}
          size="small"
          shape="rounded"
          color="info"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
