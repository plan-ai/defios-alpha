import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';

import Button from '@/components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';

import IssueBox from '@/components/issue-details/IssueBox';

import IssueDescription from '@/components/issue-details/IssueDescription';
import IssueStake from '@/components/issue-details/IssueStake';
import IssueImpact from '@/components/issue-details/IssueImpact';
import IssuePullRequests from '@/components/issue-details/IssuePullRequests';

interface IssueDetailsProps {}

type tabStateType =
  | 'description'
  | 'stake'
  | 'pull requests'
  | 'impact'
  | 'replicate';

const IssueDetails: React.FC<IssueDetailsProps> = ({}) => {
  const router = useRouter();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  //loading spinner
  const [isLoading, setIsLoading] = useState(true);

  const [tabState, setTabState] = useState<tabStateType>('description');

  const [issueData, setIssueData] = useState<any>();

  useEffect(() => {
    if (firebase_jwt === '' || firebase_jwt === null) return;
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
  }, [firebase_jwt]);

  return (
    <div className="flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden px-3.5 pb-4">
      <div className="flex items-center gap-3 text-xs text-gray-500 xl:text-sm 3xl:text-base">
        <ArrowLongLeftIcon className="h-10" />
        <div>Go back to issues</div>
      </div>
      <IssueBox />
      <div className="mt-4 flex items-center gap-3">
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('description')}
          color={tabState === 'description' ? 'info' : 'primary'}
        >
          Description
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('stake')}
          color={tabState === 'stake' ? 'info' : 'primary'}
        >
          Stake
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('pull requests')}
          color={tabState === 'pull requests' ? 'info' : 'primary'}
        >
          Pull Requests
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('impact')}
          color={tabState === 'impact' ? 'info' : 'primary'}
        >
          Impact
        </Button>
        <Button
          shape="rounded"
          size="small"
          onClick={() => setTabState('replicate')}
          color={tabState === 'replicate' ? 'info' : 'primary'}
        >
          Replicate
        </Button>
      </div>

      {tabState === 'description' && (
        <IssueDescription issue_url={issueData?.issue_gh_url} />
      )}
      {tabState === 'stake' && <IssueStake />}
      {tabState === 'impact' && <IssueImpact />}
      {tabState === 'pull requests' && <IssuePullRequests />}
    </div>
  );
};

export default IssueDetails;
