import React from 'react';

//ui components
import Image from '@/components/ui/image';
import ProgressBar from '@/components/ui/progress-bar';
import AnchorLink from '@/components/ui/links/anchor-link';
import Spinner from '@/components/custom/spinner';
import Button from '@/components/ui/button/ButtonNew';

//icons
import {
  LockClosedIcon,
  CheckIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { GithubOutlineIcon } from '@/components/icons/github-outline';

//contract utils
import { useWallet } from '@solana/wallet-adapter-react';

interface PRBoxProps {
  prData: any;
  totalPower: number;
  voted: boolean;
  votingPower: number;
  isOwner: boolean;
  mergeFunc?: any;
  isMerging?: boolean;
  isClosed?: boolean;
  isWinner?: boolean;
  claimable?: boolean;
  claimFunc?: any;
  votingFunc?: any;
  claimed?: boolean;
}

export const PRBox: React.FC<PRBoxProps> = ({
  prData,
  voted,
  votingPower,
  totalPower,
  isOwner,
  mergeFunc,
  isMerging,
  isClosed,
  isWinner,
  claimable,
  claimFunc,
  votingFunc,
  claimed,
}) => {
  const wallet = useWallet();
  return (
    <div className="grid w-full grid-cols-9 items-center gap-12 text-sm xl:text-base 3xl:text-lg">
      <AnchorLink
        href={prData?.issue_pr_link}
        target="_blank"
        className="col-span-4 flex items-center gap-3"
      >
        <GithubOutlineIcon className="h-10 w-10" />
        <div>
          #
          {
            prData?.issue_pr_link.split('/')[
              prData?.issue_pr_link.split('/').length - 1
            ]
          }
        </div>
        <div>
          {prData?.issue_pr_title.length > 60
            ? prData?.issue_pr_title.slice(0, 60) + '...'
            : prData?.issue_pr_title}
        </div>
      </AnchorLink>
      <div className="col-span-2 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={`https://avatars.githubusercontent.com/u/${prData?.issue_pr_github}?v=4`}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>{prData?.issue_pr_github_name}</div>
      </div>
      <div className="col-span-2">
        <ProgressBar
          completed={{
            value:
              Math.round((prData.issue_vote_amount / totalPower) * 10000) / 100,
            percentage:
              Math.round((prData.issue_vote_amount / totalPower) * 10000) / 100,
          }}
          remaining={{
            value:
              Math.round(
                ((totalPower - prData.issue_vote_amount) / totalPower) * 10000
              ) / 100,
            percentage:
              Math.round(
                ((totalPower - prData.issue_vote_amount) / totalPower) * 10000
              ) / 100,
          }}
        />
      </div>

      {/* for contributors */}

      {/* not voted  */}
      {!voted && !isOwner && !(isClosed === true) && (
        <Button
          size="small"
          onClick={() => {
            if (!voted && votingPower > 0) {
              votingFunc(prData);
            }
          }}
        >
          {/* cant vote */}
          {votingPower === 0 && <LockClosedIcon className="h-5 w-5" />}
          <div>vote</div>
        </Button>
      )}

      {/* voted */}
      {voted &&
        !isOwner &&
        !(isClosed === true) &&
        prData.issue_pr_voters.includes(wallet.publicKey?.toString()) && (
          <Button size="small" color="GreenOutline">
            <CheckIcon className="h-5 w-5" />
            <div>voted</div>
          </Button>
        )}

      {/* winner choosen , not you */}
      {isWinner === true && !(claimable === true) && (
        <Button size="small" color="GreenOutline">
          <CheckIcon className="h-5 w-5" />
          <div>Winner</div>
        </Button>
      )}

      {/* you are winner */}
      {claimable === true && !(claimed === true) && (
        <Button onClick={claimFunc} size="small" color="GreenOutline">
          <BanknotesIcon className="h-5 w-5" />
          <div>Claim</div>
        </Button>
      )}

      {claimable === true && claimed === true && (
        <Button size="small" color="GreenOutline">
          <BanknotesIcon className="h-5 w-5" />
          <div>Claimed</div>
        </Button>
      )}

      {/* for owners */}
      {isOwner && !(isClosed === true) && (
        <Button
          onClick={() => {
            if (!isMerging) {
              mergeFunc(prData);
            }
          }}
          isLoading={isMerging}
          size="small"
        >
          <div>merge</div>
        </Button>
      )}
    </div>
  );
};

export default PRBox;
