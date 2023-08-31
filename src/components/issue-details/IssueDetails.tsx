import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import AnchorLink from '@/components/ui/links/anchor-link';
import cn from 'classnames';
import Button from '@/components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';

import IssueBox from '@/components/issue-details/IssueBox';

import IssueDescription from '@/components/issue-details/IssueDescription';
import IssueStake from '@/components/issue-details/IssueStake';
import IssuePullRequests from '@/components/issue-details/IssuePullRequests';

interface IssueDetailsProps {}

type tabStateType = 'description' | 'funding' | 'pull requests';

const IssueDetails: React.FC<IssueDetailsProps> = ({}) => {
  const router = useRouter();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  //loading spinner
  const [isLoading, setIsLoading] = useState(true);

  const [tabState, setTabState] = useState<tabStateType>('description');

  const [issueData, setIssueData] = useState<any>();

  const [refetch, setRefetch] = useState(0);

  const getIssueDetails = async () => {
    setIsLoading(true);
    axios
      .get('https://api-v1.defi-os.com/issues', {
        params: {
          'filter.pagesize': 1,
          'filter.pageno': 1,
          'search.issue_account': router.query.account,
        },
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setIssueData(res.data.issues[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
    if (refetch === 0) {
      getIssueDetails();
    } else {
      setTimeout(() => {
        getIssueDetails();
      }, 2000);
    }
  }, [firebase_jwt, refetch]);

  return (
    <div className="landing-font flex h-full w-full flex-col gap-3 px-3.5 pb-4">
      <AnchorLink
        href={'/issues'}
        className="flex cursor-pointer items-center gap-3 text-xs text-gray-500 xl:text-sm 3xl:text-base"
      >
        <ArrowLongLeftIcon className="h-10" />
        <div>Go back to issues</div>
      </AnchorLink>
      <IssueBox data={issueData} />
      <div className="mt-12 flex w-full flex-col gap-6">
        <div className="flex w-full items-center justify-between px-6">
          <div
            className={cn(
              'cursor-pointer text-lg font-semibold xl:text-xl 3xl:text-2xl',
              {
                'text-white': tabState !== 'description',
                'textShadow text-primary': tabState === 'description',
              }
            )}
            onClick={() => setTabState('description')}
          >
            description
          </div>
          <div
            className={cn(
              'cursor-pointer text-lg font-semibold xl:text-xl 3xl:text-2xl',
              {
                'text-white': tabState !== 'funding',
                'textShadow text-primary': tabState === 'funding',
              }
            )}
            onClick={() => setTabState('funding')}
          >
            funding
          </div>
          <div
            className={cn(
              'cursor-pointer text-lg font-semibold xl:text-xl 3xl:text-2xl',
              {
                'text-white': tabState !== 'pull requests',
                'textShadow text-primary': tabState === 'pull requests',
              }
            )}
            onClick={() => setTabState('pull requests')}
          >
            pull requests
          </div>
        </div>
        <div className="lineGradientHorizontal h-0.5 w-full"></div>
      </div>

      {tabState === 'description' && (
        <IssueDescription issue_url={issueData?.issue_gh_url} />
      )}
      {tabState === 'funding' && (
        <IssueStake
          account={issueData?.issue_account}
          issueTokenAddress={issueData?.issue_stake_token_url}
          link={issueData?.issue_gh_url}
          setRefetch={setRefetch}
          refetch={refetch}
        />
      )}
      {tabState === 'pull requests' && <IssuePullRequests />}
    </div>
  );
};

export default IssueDetails;
