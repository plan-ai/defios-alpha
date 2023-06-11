import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IssueState from '@/components/ui/tags/issue-state';
import GithubTags from '@/components/ui/tags/github-tags';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import cn from 'classnames';
import Button from '@/components/ui/button/button';
import axios from '@/lib/axiosClient';

import { fetchTokenMetadata } from '@/lib/helpers/metadata';

interface IssuesListTypes {
  data: any;
  initExpand?: boolean;
  last?: boolean;
  first?: boolean;
}

export default function IssuesList({
  data,
  initExpand,
  children,
  last,
  first,
}: React.PropsWithChildren<IssuesListTypes>) {
  let [isExpand, setIsExpand] = useState(initExpand || false);
  let [issueTags, setIssueTags] = useState<string[]>([]);
  const wallet = useWallet();

  let [tokenDecimals, setTokenDecimals] = useState(0);

  const [tokenSymbol, setTokenSymbol] = useState('');
  useEffect(() => {
    getTokenInfo();
  }, [data]);

  const removeDuplicates = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  const getTokenInfo = async () => {
    const response: any = await fetchTokenMetadata(data?.issue_stake_token_url);
    setTokenSymbol(response.symbol);
    setTokenDecimals(response.decimals);
  };

  useEffect(() => {
    setIssueTags(removeDuplicates(data?.issue_tags));
    if (initExpand && initExpand !== undefined) {
      setIsExpand(initExpand);
    }
  }, [initExpand]);
  return (
    <div
      className={cn(
        'parentDiv relative bg-light-dark shadow-lg transition-all last:mb-0 hover:shadow-2xl',
        {
          'rounded-b-xl': last,
          'rounded-t-xl': first,
        }
      )}
    >
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-7 items-start items-center gap-6 text-2xs xl:text-xs 2xl:text-sm"
        onClick={() => setIsExpand(!isExpand)}
      >
        <span className="col-span-2 flex items-center justify-start px-6 font-medium tracking-wider text-white">
          {data?.issue_title}
        </span>
        <span className="flex items-center justify-center text-center font-medium tracking-wider text-white">
          <IssueState state={data?.issue_state} />
        </span>
        <span className="flex items-center justify-center text-center font-medium tracking-wider text-white">
          {data?.issue_project_name}
        </span>
        <span className="text-center font-medium tracking-wider text-white">
          {Math.round((data?.issue_stake_amount * 100) / 10 ** tokenDecimals) /
            100}{' '}
          {tokenSymbol}
        </span>
        <span className="col-span-2 flex flex-nowrap items-center justify-start px-6 text-center font-medium tracking-wider text-white">
          {issueTags.length !== 0 && <GithubTags tag={issueTags[0]} key={0} />}
          <div className="group relative">
            {issueTags.length - 1 > 0 && (
              <Button size="mini" shape="pill" color="gray">
                (+{issueTags.length - 1})
              </Button>
            )}
            <div className="absolute top-8 right-2 z-[100] hidden w-[15rem] flex-wrap rounded-xl bg-dark p-2 shadow-xl group-hover:flex xl:p-2.5 3xl:p-3">
              {issueTags.slice(1).map((tag, idx) => (
                <GithubTags tag={tag} key={idx + 1} />
              ))}
            </div>
          </div>
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
      {!last && <div className="childDiv mx-6 border border-gray-500"></div>}
    </div>
  );
}
