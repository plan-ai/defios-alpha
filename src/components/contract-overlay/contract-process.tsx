import React, { useEffect } from 'react';
import Spinner from '@/components/custom/spinner';
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { ExportIcon } from '@/components/icons/export-icon';
import { Close } from '@/components/icons/close';
import { Twitter } from '@/components/icons/brands/twitter';

import Button from '@/components/ui/button/button';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { resetLoader } from '@/store/callLoaderSlice';

import { useRouter } from 'next/router';

interface ContractProcessProps {}

const ContractProcess: React.FC<ContractProcessProps> = ({}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const callStatus = useAppSelector((state) => state.callLoader.callState);
  const loadingLabel = useAppSelector((state) => state.callLoader.loadingLabel);

  useLockBodyScroll(callStatus !== 'none');

  // success
  const successState = useAppSelector((state) => state.callLoader.success);

  const successLabel = useAppSelector(
    (state) => state.callLoader.success.label
  );
  const successDescription = useAppSelector(
    (state) => state.callLoader.success.description
  );
  const successLink = useAppSelector((state) => state.callLoader.success.link);
  const successRedirect = useAppSelector(
    (state) => state.callLoader.success.redirect
  );

  // failure
  const failureLabel = useAppSelector(
    (state) => state.callLoader.failure.label
  );
  const failureDescription = useAppSelector(
    (state) => state.callLoader.failure.description
  );
  const failureLink = useAppSelector((state) => state.callLoader.failure.link);
  const failureRedirect = useAppSelector(
    (state) => state.callLoader.failure.redirect
  );

  if (callStatus !== 'none') {
    return (
      <div
        className="fixed top-0 left-0 z-[200] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30"
        onClick={() => {
          if (callStatus === 'success') {
            dispatch(resetLoader());
          }
        }}
      >
        {/* loading */}
        {callStatus === 'loading' && <Spinner label={loadingLabel} />}

        {/* success */}
        {callStatus === 'success' && (
          <div
            className="relative flex w-[28rem] flex-col items-center justify-between gap-5 rounded-xl bg-light-dark p-6 shadow-xl xl:w-[31rem] xl:p-8 3xl:w-[34rem] 3xl:p-10"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <CheckBadgeIcon className="h-12 w-12 text-new-blue xl:h-14 xl:w-14 3xl:h-16 3xl:w-16" />
              <div className="text-center text-sm xl:text-base 3xl:text-lg">
                {successLabel}
              </div>
            </div>
            <Close
              onClick={() => {
                dispatch(resetLoader());
                if (successRedirect !== null) {
                  router.push(successRedirect);
                }
              }}
              className="absolute top-6 right-6 h-6 w-6 cursor-pointer font-bold text-white"
            />
            <div className="text-xs text-gray-400 xl:text-sm 3xl:text-base">
              {successDescription}
              {successLink !== '' && (
                <AnchorLink
                  className="inline text-white"
                  href={successLink}
                  target="_blank"
                >
                  <ExportIcon className="ml-5 inline h-3.5 w-3.5" />
                </AnchorLink>
              )}
            </div>
            <div className="flex items-center justify-center">
              {successState.tweetLink && (
                <AnchorLink
                  className="flex items-center justify-center gap-2 rounded-full bg-[#0c7abf] py-2 px-5 text-sm text-white xl:text-base 3xl:text-lg"
                  href={successState.tweetLink}
                  target="_blank"
                >
                  <Twitter className="w-6" />
                  <div>Tweet</div>
                </AnchorLink>
              )}
            </div>
          </div>
        )}

        {/* failure */}
        {callStatus === 'failure' && (
          <div className="relative flex w-[28rem] flex-col items-center justify-between gap-5 rounded-xl bg-light-dark p-6 shadow-xl xl:w-[30rem] xl:p-8 3xl:w-[34rem] 3xl:p-10">
            <div className="flex flex-col items-center justify-center gap-5">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600 xl:h-14 xl:w-14 3xl:h-16 3xl:w-16" />
              <div className="text-center text-sm xl:text-base 3xl:text-lg">
                {failureLabel}
              </div>
            </div>
            <Close
              onClick={() => {
                dispatch(resetLoader());
                if (failureRedirect !== null) {
                  router.push(failureRedirect);
                }
              }}
              className="absolute top-6 right-6 h-6 w-6 cursor-pointer font-bold text-white"
            />
            <div className=" text-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
              {failureDescription}
              {failureLink !== '' && (
                <AnchorLink
                  className="inline text-white"
                  href={failureLink}
                  target="_blank"
                >
                  <ExportIcon className="ml-5 inline h-3.5 w-3.5" />
                </AnchorLink>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default ContractProcess;
