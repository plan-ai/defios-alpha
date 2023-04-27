import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityStatus from '@/components/custom/security-status';
import Image from 'next/image';
import cn from 'classnames';
import axios from 'axios';
interface ProjectListTypes {
  data: any;
  initExpand?: boolean;
  last?: boolean;
  first?: boolean;
}

export default function ProjectList({
  data,
  initExpand,
  children,
  last,
  first,
}: React.PropsWithChildren<ProjectListTypes>) {
  let [isExpand, setIsExpand] = useState(initExpand || false);
  return (
    <div
      className={cn(
        'parentDiv relative overflow-hidden bg-light-dark shadow-lg transition-all last:mb-0 hover:shadow-2xl',
        {
          'rounded-b-xl': last,
          'rounded-t-xl': first,
        }
      )}
    >
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-8 items-start items-center gap-6 text-2xs xl:text-xs 2xl:text-sm"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-6  font-medium tracking-wider text-white">
          {data?.project_name}
        </div>
        <div className="text-center  font-medium uppercase tracking-wider text-white">
          {data?.num_open_issues}
        </div>
        <div className="px-6 font-medium  uppercase tracking-wider text-white">
          <SecurityStatus noIcon={true} security={data?.project_status} />
        </div>
        <div className="col-span-2 px-6  font-medium uppercase tracking-wider text-white">
          <div className="flex items-center">
            <div className="relative h-9 w-9 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12">
              <Image
                src={data?.project_token?.token_image_url || ''}
                alt={data?.project_token?.token_symbol || ''}
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="ml-3 text-3xs xl:text-xs 2xl:text-sm">
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
        <div className="col-span-2 px-6  font-medium tracking-wider text-white">
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
      <div className="childDiv mx-6 border border-gray-700"></div>
    </div>
  );
}
