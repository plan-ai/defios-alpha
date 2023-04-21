import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityStatus from '@/components/custom/security-status';
import Image from 'next/image';
import axios from 'axios';
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
  return (
    <div className="relative mb-3 overflow-hidden rounded-xl bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large">
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-8 items-start gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-6 text-xs font-medium tracking-wider text-white sm:text-sm">
          {data?.project_name}
        </div>
        <div className="text-center text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
          {data?.num_open_issues}
        </div>
        <div className="px-6 text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
          <SecurityStatus noIcon={true} security={data?.project_status} />
        </div>
        <div className="col-span-2 px-6 text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
          <div className="flex items-center">
            <Image
              src={data?.project_token?.token_image_url || ''}
              alt={data?.project_token?.token_symbol || ''}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="ml-3">
              <div className="mb-1 flex items-center justify-start ">
                <div className="mr-2 text-gray-500">#Staked</div>
                <div>
                  {data?.coins_staked} {data?.project_token?.token_symbol}
                </div>
              </div>
              <div className="flex items-center justify-start ">
                <div className="mr-2 text-gray-500">#Rewarded</div>
                <div>
                  {data?.coins_rewarded} {data?.project_token?.token_symbol}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 px-2 text-xs font-medium tracking-wider text-white sm:text-sm">
          <div>
            {data.top_builder_name}
            <span className="text-gray-500">(Builder🛠️)</span>
          </div>
          <div>
            {data.top_supporter_name}
            <span className="text-gray-500">(Supporter💰)</span>
          </div>
        </div>
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
            <div className="border-t border-dashed border-gray-700 px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
