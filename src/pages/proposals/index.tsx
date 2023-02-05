import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import cn from 'classnames';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import Image from '@/components/ui/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import VoteList from '@/components/vote/vote-list';
import { ExportIcon } from '@/components/icons/export-icon';
// static data
import { getVotesByStatus } from '@/data/static/vote-data';
import votePool from '@/assets/images/vote-pool.svg';
import RootLayout from '@/layouts/_root-layout';

const ProposalsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { totalVote: totalActiveVote } = getVotesByStatus('active');
  const { totalVote: totalOffChainVote } = getVotesByStatus('off-chain');
  const { totalVote: totalExecutableVote } = getVotesByStatus('executable');
  const { totalVote: totalPastVote } = getVotesByStatus('past');
  function goToCreateProposalPage() {
    setTimeout(() => {
      router.push(routes.createProposal);
    }, 800);
  }
  const tabMenuItems = [
    {
      title: (
        <>
          Active{' '}
          {totalActiveVote > 0 && (
            <span className="ml-0.5 md:ml-1.5 lg:ml-2">{totalActiveVote}</span>
          )}
        </>
      ),
      path: 'active',
    },
    {
      title: (
        <>
          Off-Chain{' '}
          {totalOffChainVote > 0 && (
            <span className="ml-0.5 md:ml-1.5 lg:ml-2">
              {totalOffChainVote}
            </span>
          )}
        </>
      ),
      path: 'off-chain',
    },
    {
      title: (
        <>
          Executable{' '}
          {totalExecutableVote > 0 && (
            <span className="ml-0.5 md:ml-1.5 lg:ml-2">
              {totalExecutableVote}
            </span>
          )}
        </>
      ),
      path: 'executable',
    },
    {
      title: (
        <>
          Past{' '}
          {totalPastVote > 0 && (
            <span className="ml-0.5 md:ml-1.5 lg:ml-2">{totalPastVote}</span>
          )}
        </>
      ),
      path: 'past',
    },
  ];
  return (
    <>
      <NextSeo
        title="Proposal"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <section className="mx-auto w-full max-w-[1160px] text-sm ">
        <header
          className={cn(
            'mb-8 flex flex-col gap-4 rounded-lg bg-light-dark p-5 py-6 shadow-card xs:p-6 ',
            'sm:flex-row sm:items-center sm:justify-between'
          )}
        >
          <div className="flex items-start gap-4 xs:items-center xs:gap-3 xl:gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-dark">
              <Image alt="Vote Pool" src={votePool} width={32} height={32} />
            </div>
            <div>
              <h2 className="mb-2 font-medium uppercase text-gray-100 xl:text-lg">
                You have 100 votes
              </h2>
              <p className="leading-relaxed text-gray-400">
                You need CRIPTIC or CRIPTIC tokens to participate in governance.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              shape="rounded"
              fullWidth={true}
              className="uppercase"
              onClick={() => goToCreateProposalPage()}
            >
              Create Proposal
            </Button>
          </div>
        </header>
        <ParamTab tabMenu={tabMenuItems}>
          <TabPanel className="focus:outline-none">
            <VoteList voteStatus={'active'} />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <>
              <div className="mb-6 rounded-lg border-2 border-gray-700 bg-light-dark p-5 xs:py-6 lg:px-6 lg:py-6">
                <div className="mb-3 flex flex-col gap-3 xs:mb-4 sm:gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="flex items-center gap-4 font-semibold text-gray-100">
                    <span className="inline-block rounded-3xl bg-gray-900 px-2.5 py-0.5 text-sm font-medium text-white">
                      Tip
                    </span>{' '}
                    Vote gas-free + earn rewards
                  </h3>
                  <div className="flex items-center gap-4 text-gray-100">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://snapshot.org/#/"
                      className="inline-flex items-center gap-2 text-gray-100 transition-opacity duration-200 hover:underline hover:opacity-90"
                    >
                      Go to Snapshot <ExportIcon className="h-auto w-3" />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="#"
                      className="inline-flex items-center gap-2 text-gray-100 transition-opacity duration-200 hover:underline hover:opacity-90"
                    >
                      Learn more <ExportIcon className="h-auto w-3" />
                    </a>
                  </div>
                </div>
                <p className="leading-loose text-gray-400">
                  In order to vote on SnapShot, you need to have ptPOOL tokens.
                  You can obtain them by depositing your token icon POOL into
                  the POOL Pool . By doing so, you will be eligible to vote
                  gas-free and have a chance to win a weekly prize.
                </p>
              </div>
              <VoteList voteStatus={'off-chain'} />
            </>
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <VoteList voteStatus={'executable'} />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <VoteList voteStatus={'past'} />
          </TabPanel>
        </ParamTab>
      </section>
    </>
  );
};

ProposalsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ProposalsPage;
