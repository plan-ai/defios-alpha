import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { GithubOutlineIcon } from '@/components/icons/github-outline';

interface SigninBtnProps {}

export const SigninBtn: React.FC<SigninBtnProps> = ({}) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div
      onClick={() => {
        const user_type = localStorage.getItem('user_type');
        if (session && (session as any)?.accessToken?.includes('gho_')) {
          if (user_type === null || user_type === undefined) {
            router.push('/onboarding');
          } else {
            router.push('/learn');
          }
        } else {
          signIn('github', {
            callbackUrl:
              user_type === null
                ? `${window.location.origin}/onboarding`
                : `${window.location.origin}/learn`,
          });
        }
      }}
      className="group relative flex items-center justify-center"
    >
      <div className="absolute z-[20] flex cursor-pointer items-center justify-start gap-3 whitespace-nowrap rounded-full bg-[#0a0a0a] px-[12px] py-2 text-xs transition-all duration-300 xl:px-[16px] xl:py-2.5 xl:text-sm 3xl:px-[18px] 3xl:py-3 3xl:text-base">
        <GithubOutlineIcon />
        <div className="flex w-10 items-center gap-5 overflow-hidden transition-all duration-300 group-hover:w-16 xl:w-11 xl:gap-4 xl:group-hover:w-20 3xl:w-12 3xl:gap-3.5 3xl:group-hover:w-24">
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            Sign in
          </div>
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            with Github
          </div>
        </div>
        <ArrowRightIcon className="h-3.5 xl:h-4 3xl:h-5" />
      </div>
      <div className="absolute z-[10] flex items-center justify-start gap-3 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-300 to-cyan-800 px-[12px] py-2 text-xs blur-[16px] transition-all duration-300 xl:px-[16px] xl:py-2.5 xl:text-sm 3xl:px-[18px] 3xl:py-3 3xl:text-base">
        <GithubOutlineIcon />
        <div className="flex w-10 items-center gap-5 overflow-hidden transition-all duration-300 group-hover:w-16 xl:w-11 xl:gap-4 xl:group-hover:w-20 3xl:w-12 3xl:gap-3.5 3xl:group-hover:w-24">
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            Sign in
          </div>
          <div className="transition-all duration-300 group-hover:-translate-x-14">
            with Github
          </div>
        </div>
        <ArrowRightIcon className="h-3.5 xl:h-4 3xl:h-5" />
      </div>
    </div>
  );
};

export default SigninBtn;
