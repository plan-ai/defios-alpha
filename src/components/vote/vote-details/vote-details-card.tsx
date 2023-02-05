import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import cn from 'classnames';
import Button from '@/components/ui/button';
import RevealContent from '@/components/ui/reveal-content';
import AuctionCountdown from '@/components/nft/auction-countdown';
import { Switch } from '@/components/ui/switch';
import { ExportIcon } from '@/components/icons/export-icon';
import VotePoll from '@/components/vote/vote-details/vote-poll';
import VoteActions from '@/components/vote/vote-details/vote-actions';
import VoterTable from '@/components/vote/vote-details/voter-table';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';

function VoteActionButton() {
  return (
    <div className="mt-4 flex items-center gap-3 xs:mt-6 xs:inline-flex md:mt-10">
      <Button shape="rounded" color="success" className="flex-1 xs:flex-auto">
        Accept
      </Button>
      <Button shape="rounded" color="danger" className="flex-1 xs:flex-auto">
        Reject
      </Button>
    </div>
  );
}

// FIXME: need to add vote type
export default function VoteDetailsCard({ vote }: any) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <motion.div
      layout
      initial={{ borderRadius: 8 }}
      className={cn(
        'mb-3 rounded-lg p-5 transition-shadow duration-200 bg-light-dark xs:p-6 xl:p-4',
        isExpand ? 'shadow-large' : 'shadow-card hover:shadow-large'
      )}
    >
      <motion.div
        layout
        className={cn(
          'flex w-full flex-col-reverse justify-between ',
          'md:grid md:grid-cols-3'
        )}
      >
        <div className="self-start md:col-span-2">
          <h3
            onClick={() => setIsExpand(!isExpand)}
            className="cursor-pointer font-medium leading-normal text-gray-100 2xl:text-lg"
          >
            {vote.title}
          </h3>
          <p className="mt-2 text-gray-400">
            Proposal #{vote.id}
          </p>

          {/* show only when vote is active */}
          {vote.status === 'active' && (
            <>
              {!isExpand ? (
                <Button
                  onClick={() => setIsExpand(!isExpand)}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Vote Now
                </Button>
              ) : (
                <VoteActionButton />
              )}
            </>
          )}

          {/* show only for past vote */}
          {vote.status === 'past' && (
            <time className="mt-4 block text-gray-400 xs:mt-6 md:mt-7">
              <span className="font-medium">Executed</span> at{' '}
              {dayjs(vote.executed_at).format('MMM DD, YYYY')}
            </time>
          )}
        </div>

        {/* vote countdown timer only for active & off-chain vote */}
        {['active', 'off-chain'].indexOf(vote.status) !== -1 && (
          <div
            className={cn(
              "before:content-[' '] relative grid h-full gap-2 before:absolute before:bottom-0 before:left-0 before:border-b before:border-r before:border-dashed  border-gray-700 before:border-gray-700 xs:gap-2.5 ",
              'mb-5 pb-5 before:h-[1px] before:w-full md:mb-0 md:pb-0 md:pl-5 md:before:h-full md:before:w-[1px] xl:pl-3'
            )}
          >
            <h3 className="text-gray-400 md:text-base md:font-medium md:uppercase md:text-gray-100 2xl:text-lg ">
              Voting ends in
            </h3>
            <AuctionCountdown date={new Date(Date.now() + 172800000)} />
          </div>
        )}

        {/* switch toggle indicator for past vote */}
        {vote.status === 'past' && (
          <div className="mb-4 flex items-center gap-3 md:mb-0 md:items-start md:justify-end">
            <Switch
              checked={isExpand}
              onChange={setIsExpand}
              className="flex items-center gap-3 text-gray-400"
            >
              <span className="inline-flex text-xs font-medium uppercase sm:text-sm">
                Close
              </span>
              <div
                className={cn(
                  isExpand
                    ? 'bg-white'
                    : 'bg-gray-700',
                  'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
                )}
              >
                <span
                  className={cn(
                    isExpand
                      ? 'translate-x-5 bg-gray-700'
                      : 'translate-x-0.5 bg-gray-200',
                    'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
                  )}
                />
              </div>
              <span className="inline-flex text-xs font-medium uppercase sm:text-sm">
                View
              </span>
            </Switch>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {isExpand && (
          <motion.div
            layout
            initial="exit"
            animate="enter"
            exit="exit"
            variants={fadeInBottom('easeIn', 0.25, 16)}
          >
            <div className="my-6 border-y border-dashed py-6 border-gray-700 text-gray-400">
              Proposed by:{' '}
              <a
                href={vote.proposed_by.link}
                className="ml-1 inline-flex items-center gap-3 font-medium hover:underline hover:opacity-90 focus:underline focus:opacity-90 text-gray-100"
              >
                {vote.proposed_by.id} <ExportIcon className="h-auto w-3" />
              </a>
            </div>
            <VotePoll
              title={'Votes'}
              accepted={vote?.accepted}
              rejected={vote?.rejected}
            />
            <VoterTable votes={vote?.votes} />
            <RevealContent defaultHeight={250}>
              <h4 className="mb-6 uppercase text-gray-100">Description</h4>
              <div
                className="dynamic-html grid gap-2 leading-relaxed text-gray-400"
                dangerouslySetInnerHTML={{ __html: vote.description }}
              />
            </RevealContent>
            <RevealContent
              defaultHeight={320}
              className="mt-6 border-t border-dashed pt-6 border-gray-700"
            >
              <VoteActions title={'Actions'} action={vote?.action} />
            </RevealContent>
            <div className="mt-6 flex items-center justify-center border-t border-dashed pt-6 border-gray-700">
              <Button
                shape="rounded"
                fullWidth={true}
                className={cn('sm:w-4/6 md:w-3/6 xl:w-2/6')}
              >
                Add POOL token to MetaMask
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
