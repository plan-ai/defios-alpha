import React, { useEffect, useState } from 'react';
import Xshare from '@/components/create/Xshare';
import { Close } from '@/components/icons/close';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { reset } from '@/store/issueCreateSlice';

interface Step4Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const Step4: React.FC<Step4Props> = ({ setStep }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const step3Data = useAppSelector((state) => state.issueCreate.step3);
  return (
    <div className="absolute z-[40] flex h-full w-full flex-col justify-between rounded-xl bg-newdark p-8 text-sm xl:text-base 3xl:text-lg">
      <div
        onClick={() => {
          dispatch(reset());
          router.push('/issues');
        }}
        className="mb-5 flex justify-end text-gray-500"
      >
        <Close className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-8 text-lg font-semibold xl:text-xl 3xl:text-2xl">
        <div className="px-4">congrats!</div>
        <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
      </div>
      <div className="mt-5 flex h-full flex-col items-center gap-4 px-4 text-sm xl:text-base 3xl:text-lg">
        <div className="mb-16 flex flex-col items-center gap-2">
          <div>you have successfully created your </div>
          <div>
            <AnchorLink
              href={step3Data.issueLink || ''}
              target="_blank"
              className="inline font-semibold text-primary underline"
            >
              issue
            </AnchorLink>{' '}
            on{' '}
            <AnchorLink
              href={step3Data.repoLink}
              target="_blank"
              className="inline font-semibold text-primary underline"
            >
              project
            </AnchorLink>
          </div>
          <div> and incentivized it on defiOS!</div>
        </div>
        <Xshare
          tweet={`Hey i added created my issue ${
            step3Data.issueLink
          } on ${step3Data.repoLink.replace(
            'https://github.com/',
            ''
          )} incentivized it, check it out at defi-os.com`}
        />
        <div className="mt-16 mb-6 flex flex-col items-center gap-2">
          <div>Share this on X.com (formerly Twitter), letting</div>
          <div>developers know that you&apos;ve funded the issue.</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div>don&apos;t worry if you have no developer followers.</div>
          <div>when we find your post on X.com, we&apos;ll repost it.</div>
          <div>(that&apos;s a promise!)</div>
        </div>
      </div>
      <div className="lineGradientHorizontalGray mb-20 h-0.5 w-full"></div>
    </div>
  );
};

export default Step4;
