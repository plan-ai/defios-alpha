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
import IssueBox from '@/components/issue-details/IssueBox';
import IssueDescription from '@/components/issue-details/IssueDescription';
import IssueFunding from '@/components/issue-details/IssueFunding';
import IssuePullRequests from '@/components/issue-details/IssuePullRequests';
import IssuePullRequestsOwner from '@/components/issue-details/IssuePullRequestsOwner';

//contract functions
import {
  get_pda_from_seeds,
  getProvider,
  getDefiOsProgram,
  getSupplyModified,
  calculateSellAmount,
} from '@/lib/helpers/contractInteract';
import { getTokenBalance } from '@/lib/helpers/metadata';

//contract utils
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { Signer, Connection } from '@/lib/helpers/wallet';

interface IssueDetailsProps {}

type tabStateType = 'description' | 'funding' | 'pull requests';

const IssueDetails: React.FC<IssueDetailsProps> = ({}) => {
  const router = useRouter();

  const wallet = useWallet();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);

  //loading spinner
  const [isLoading, setIsLoading] = useState(true);

  const [tabState, setTabState] = useState<tabStateType>('description');

  const [issueData, setIssueData] = useState<any>();

  const [refetch, setRefetch] = useState(0);

  const [tokenDetails, setTokenDetails] = useState<any>();

  const getTokenDetails = async () => {
    if (
      issueData === null ||
      issueData === undefined ||
      issueData.issue_token === null ||
      issueData.issue_token === undefined ||
      issueData.issue_token.token_spl_addr === null ||
      issueData.issue_token.token_spl_addr === undefined
    )
      return;

    //total power calc
    const { supplyModified, decimals, supplyActual } = await getSupplyModified(
      issueData.issue_token.token_spl_addr
    );

    const total_stake_BN = new BN(issueData.issue_stake_amount);
    const total_power = calculateSellAmount(supplyActual, total_stake_BN);

    //init contract connection
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const issueAccount = new PublicKey(issueData?.issue_account);
    const issueStaker = wallet.publicKey as PublicKey;

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const { repository } = await program.account.issue.fetch(issueAccount);

    const { repositoryCreator } = await program.account.repository.fetch(
      repository
    );

    //issue staker acc fetch
    const issueStakerFetch = await program.account.issueStaker
      .fetch(issueStakerAccount)
      .catch((err) => {
        return null;
      });

    //voting,staking
    let myStake = 0;
    let myVotingPower = 0;
    if (issueStakerFetch !== null) {
      myStake =
        Math.round(
          (parseFloat(issueStakerFetch.stakedAmount[0].toString()) * 100) /
            10 ** decimals
        ) / 100;
      myVotingPower = parseFloat(issueStakerFetch.prVotingPower.toString());
    }

    //token balance
    const tokenBalanceData = await getTokenBalance(
      issueData?.issue_token?.token_spl_addr
    );

    //fix in a state for nested use in child components
    setTokenDetails({
      totalPower: parseInt(total_power.toString()),
      voted: issueStakerFetch !== null ? issueStakerFetch.hasVoted : false,
      votingPower: myVotingPower,
      tokenBalance: tokenBalanceData?.uiAmount || 0,
      stakeByMe: myStake,
      decimals: decimals,
      repositoryCreator: repositoryCreator,
    });
  };

  const getIssueDetails = async () => {
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/issues`, {
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

  useEffect(() => {
    if (
      wallet === null ||
      wallet === undefined ||
      wallet.publicKey === null ||
      wallet.publicKey === undefined
    )
      return;
    getTokenDetails();
  }, [issueData, wallet]);

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
        <IssueFunding
          tokenDetails={tokenDetails}
          issueData={issueData}
          setRefetch={setRefetch}
        />
      )}

      {/* contributor , staker/voter but not project owner */}
      {tabState === 'pull requests' &&
        wallet?.publicKey?.toString() !==
          tokenDetails?.repositoryCreator?.toString() && (
          <IssuePullRequests
            issueData={issueData}
            tokenDetails={tokenDetails}
            setRefetch={setRefetch}
          />
        )}

      {/* project owner */}
      {tabState === 'pull requests' &&
        wallet?.publicKey?.toString() ===
          tokenDetails?.repositoryCreator?.toString() && (
          <IssuePullRequestsOwner
            issueData={issueData}
            tokenDetails={tokenDetails}
            setRefetch={setRefetch}
          />
        )}
    </div>
  );
};

export default IssueDetails;
