import React, { useEffect } from 'react';
import Spinner from '@/components/custom/spinner';
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { ExportIcon } from '@/components/icons/export-icon';
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
  const successBtnText = useAppSelector(
    (state) => state.callLoader.success.buttonText
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
  const failureBtnText = useAppSelector(
    (state) => state.callLoader.failure.buttonText
  );

  if (callStatus !== 'none') {
    return (
      <div className="fixed top-0 left-0 z-[200] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
        {/* loading */}
        {callStatus === 'loading' && <Spinner label={loadingLabel} />}

        {/* success */}
        {callStatus === 'success' && (
          <div className="flex w-[34rem] flex-col items-center justify-between gap-5 rounded-lg bg-light-dark px-10 py-10 shadow-xl">
            <div className="flex flex-col items-center justify-center gap-5">
              <CheckBadgeIcon className="h-16 w-16 text-blue-500" />
              <div className="text-center text-lg">{successLabel}</div>
            </div>
            <div className="text-md text-center text-gray-400">
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
            <Button
              onClick={() => {
                dispatch(resetLoader());
                if (successRedirect !== null) {
                  router.push(successRedirect);
                }
              }}
              size="medium"
              shape="rounded"
            >
              {successBtnText !== '' ? successBtnText : 'Continue'}
            </Button>
          </div>
        )}

        {/* failure */}
        {callStatus === 'failure' && (
          <div className="flex w-[34rem] flex-col items-center justify-between gap-5 rounded-lg bg-light-dark px-10 py-10 shadow-xl">
            <div className="flex flex-col items-center justify-center gap-5">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-600" />
              <div className="text-center text-lg">{failureLabel}</div>
            </div>
            <div className="text-md text-center text-gray-400">
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
            <Button
              onClick={() => {
                dispatch(resetLoader());
                if (failureRedirect !== null) {
                  router.push(failureRedirect);
                }
              }}
              size="medium"
              shape="rounded"
            >
              {failureBtnText !== '' ? failureBtnText : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default ContractProcess;
