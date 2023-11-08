import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axiosClient';
import cn from 'classnames';

//redux
import { useAppSelector } from '@/store/store';

//ui components
import AnchorLink from '@/components/ui/links/anchor-link';

//icons
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';

//components
import ProjectTopBoxes from '@/components/project-details/ProjectTopBoxes';
import ProjectReadme from '@/components/project-details/ProjectReadme';
import ProjectIssues from '@/components/project-details/ProjectIssues';

//contract functions
import {
  get_pda_from_seeds,
  getProvider,
  getDefiOsProgram,
  getSupplyModified,
  calculateSellAmount,
} from '@/lib/helpers/contractInteract';
import { fetchTokenMetadata } from '@/lib/helpers/metadata';
// import { getTokenBalance } from '@/lib/helpers/metadata';

//contract utils
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { Signer, Connection } from '@/lib/helpers/wallet';

interface ProjectDetailsProps {}

type tabStateType = 'readme' | 'price chart' | 'issues';

const ProjectDetails: React.FC<ProjectDetailsProps> = ({}) => {
  const router = useRouter();

  const wallet = useWallet();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  //loading spinner
  const [isLoading, setIsLoading] = useState(true);

  const [tabState, setTabState] = useState<tabStateType>('readme');

  const [projectData, setProjectData] = useState<any>();

  const [refetch, setRefetch] = useState(0);

  let [tokenDecimals, setTokenDecimals] = useState(0);

  const getTokenInfo = async () => {
    const response: any = await fetchTokenMetadata(
      projectData?.project_token?.token_spl_addr
    );
    setTokenDecimals(response.decimals);
  };

  const getProjectsData = async () => {
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/projects`, {
        params: {
          'filter.pagesize': 1,
          'filter.pageno': 1,
          'search.project_account': router.query.account,
        },
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setProjectData(res.data.projects[0]);
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
      getProjectsData();
    } else {
      setTimeout(() => {
        getProjectsData();
      }, 2000);
    }
  }, [firebase_jwt, refetch]);

  useEffect(() => {
    if (
      projectData?.project_token?.token_spl_addr !== null &&
      projectData?.project_token?.token_spl_addr !== undefined &&
      projectData?.project_token?.token_spl_addr !== ''
    ) {
      getTokenInfo();
    }
  }, [projectData]);

  return (
    <div className="landing-font flex h-full w-full flex-col gap-3 px-3.5 pb-4">
      <AnchorLink
        href={'/projects'}
        className="flex cursor-pointer items-center gap-3 text-xs text-gray-500 xl:text-sm 3xl:text-base"
      >
        <ArrowLongLeftIcon className="h-10" />
        <div>Go back to projects</div>
      </AnchorLink>
      <ProjectTopBoxes data={projectData} tokenDecimals={tokenDecimals} />
      <div className="mt-6 mb-4 flex w-full flex-col gap-6">
        <div className="flex w-full items-center justify-between px-6">
          <div
            className={cn(
              'cursor-pointer text-lg font-semibold xl:text-xl 3xl:text-2xl',
              {
                'text-white': tabState !== 'readme',
                'textShadow text-primary': tabState === 'readme',
              }
            )}
            onClick={() => setTabState('readme')}
          >
            readme
          </div>
          <div
            className={cn(
              'cursor-pointer text-lg font-semibold xl:text-xl 3xl:text-2xl',
              {
                'text-white': tabState !== 'price chart',
                'textShadow text-primary': tabState === 'price chart',
              }
            )}
            onClick={() => setTabState('price chart')}
          >
            price chart
          </div>
          <div
            className={cn(
              'cursor-pointer text-lg font-semibold xl:text-xl 3xl:text-2xl',
              {
                'text-white': tabState !== 'issues',
                'textShadow text-primary': tabState === 'issues',
              }
            )}
            onClick={() => setTabState('issues')}
          >
            issues
          </div>
        </div>
        <div className="lineGradientHorizontal h-0.5 w-full"></div>
      </div>

      {tabState === 'readme' && (
        <ProjectReadme project_url={projectData?.project_repo_link} />
      )}
      {tabState === 'issues' && (
        <ProjectIssues project_account={projectData?.project_account} />
      )}

      {/* contributor , staker/voter but not project owner */}
      {/* {tabState === 'pull requests' &&
        wallet?.publicKey?.toString() !==
          tokenDetails?.repositoryCreator?.toString() && (
          <IssuePullRequests
            issueData={issueData}
            tokenDetails={tokenDetails}
            setRefetch={setRefetch}
          />
        )} */}

      {/* project owner */}
      {/* {tabState === 'pull requests' &&
        wallet?.publicKey?.toString() ===
          tokenDetails?.repositoryCreator?.toString() && (
          <IssuePullRequestsOwner
            issueData={issueData}
            tokenDetails={tokenDetails}
            setRefetch={setRefetch}
          />
        )} */}
    </div>
  );
};

export default ProjectDetails;
