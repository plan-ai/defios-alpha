import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IssueState from '@/components/ui/tags/issue-state';
import GithubTags from '@/components/ui/tags/github-tags';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { fetchDecimals } from '@/lib/helpers/metadata';

interface IssuesListTypes {
  data: any;
  initExpand?: boolean;
}

export default function IssuesList({
  data,
  initExpand,
  children,
}: React.PropsWithChildren<IssuesListTypes>) {
  let [isExpand, setIsExpand] = useState(initExpand || false);
  const wallet = useWallet();

  let [tokenDecimals, setTokenDecimals] = useState(1);

  const removeDuplicates = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  const getDecimals = async () => {
    const decimals = await fetchDecimals(data?.issue_stake_token_url);
    setTokenDecimals(decimals);
  };

  useEffect(() => {
    getDecimals();
    if (initExpand && initExpand !== undefined) {
      setIsExpand(initExpand);
    }
  }, [initExpand]);
  return (
    <div className="relative mb-3 overflow-hidden rounded-xl bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large">
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-7 items-start gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <span className="col-span-2 flex items-center justify-start px-6 text-sm font-medium tracking-wider text-white">
          {data?.issue_title}
        </span>
        <span className="flex items-center justify-center text-center text-sm font-medium tracking-wider text-white">
          <IssueState state={data?.issue_state} />
        </span>
        <span className="flex items-center justify-center text-center text-sm font-medium tracking-wider text-white">
          {data?.issue_project_name}
        </span>
        <span className="col-span-2 text-center text-sm font-medium tracking-wider text-white">
          {Math.round((data?.issue_stake_amount * 100) / 10 ** tokenDecimals) /
            100}{' '}
          {data?.issue_stake_token_symbol}
        </span>
        <span className="flex flex-wrap items-center justify-center text-center text-sm font-medium tracking-wider text-white">
          {data?.issue_tags?.length !== 0 &&
            removeDuplicates(data?.issue_tags)?.map(
              (tag: string, idx: number) => <GithubTags tag={tag} key={idx} />
            )}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="relative border-t border-dashed border-gray-700 px-6">
              {children}
              {wallet.publicKey === null && (
                <div className="absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-5 rounded-xl border-2 border-white bg-dark p-5 px-10  text-xl shadow-2xl">
                    <div>Connect Wallet to Continue</div>
                    <WalletMultiButton className="rounded-full bg-new-blue" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
