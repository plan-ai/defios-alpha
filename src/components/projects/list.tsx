import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityStatus from '@/components/custom/security-status';
import Image from 'next/image';
import cn from 'classnames';
import axios from '@/lib/axiosClient';

import { useAppSelector } from '@/store/store';
import { fetchTokenMetadata } from '@/lib/helpers/metadata';

import { useRouter } from 'next/router';

interface ProjectListTypes {
  data: any;
  initExpand?: boolean;
}

export default function ProjectList({
  data,
  initExpand,
  children,
}: React.PropsWithChildren<ProjectListTypes>) {
  let [isExpand, setIsExpand] = useState(initExpand || false);

  let [tokenDecimals, setTokenDecimals] = useState(0);

  const router = useRouter();

  useEffect(() => {
    getTokenInfo();
  }, [data]);

  const getTokenInfo = async () => {
    const response: any = await fetchTokenMetadata(
      data?.project_token?.token_spl_addr
    );
    setTokenDecimals(response.decimals);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-light-dark shadow-lg transition-all last:mb-0 hover:shadow-2xl'
      )}
    >
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-11 items-start items-center gap-6 text-xs xl:text-sm 2xl:text-base"
        // onClick={() => setIsExpand(!isExpand)}
        onClick={() => router.push(`/projects/${data?.project_account}`)}
      >
        {/* <div></div> */}
        <div className="col-span-8 flex items-center gap-5 px-6 font-medium tracking-wider text-white">
          <div className="relative h-10 w-10 xl:h-12 xl:w-12 2xl:h-16 2xl:w-16">
            <Image
              src={
                data?.project_token?.token_new === true
                  ? data?.project_token?.token_image_url?.replace(
                      'https://ipfs.io',
                      'https://defi-os.infura-ipfs.io'
                    ) || ''
                  : data?.project_token?.token_image_url || ''
              }
              alt={data?.project_token?.token_symbol || ''}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold">{data?.project_name}</div>
            <div className="text-2xs xl:text-xs 2xl:text-sm">
              {data?.project_token?.token_name}{' '}
              {data?.project_token?.token_symbol
                ? `(${data?.project_token?.token_symbol})`
                : ''}
            </div>
          </div>
        </div>
        <div className="text-center font-semibold uppercase tracking-wider text-new-red">
          {data?.num_open_issues}
        </div>
        <div className="text-center font-semibold uppercase tracking-wider text-white">
          {Math.round((data?.coins_staked * 100) / 10 ** tokenDecimals) / 100}
        </div>
        <div className="text-center font-semibold uppercase tracking-wider text-new-green">
          {Math.round((data?.coins_rewarded * 100) / 10 ** tokenDecimals) / 100}
        </div>
      </div>
      {/* <AnimatePresence initial={false}>
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
            <div className="border-t border-dashed border-gray-700 px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <div className="lineGradientHorizontalGray h-0.5 w-full"></div>
    </div>
  );
}
