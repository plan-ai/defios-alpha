import React, { useState,useEffect } from 'react';
import IssueState from '../ui/tags/issue-state';
import { useAppDispatch } from '@/store/store';
import { clicked } from '@/store/notifClickSlice';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { fetchDecimals } from '@/lib/helpers/metadata';

interface IssuesTableListProps {
  item: any;
  last?: boolean;
  first?: boolean;
}

export const IssuesTableList: React.FC<IssuesTableListProps> = ({
  item,
  last,
  first,
}) => {
  let [isExpand, setIsExpand] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClickHandler = () => {
    const payload = {
      searchQuery: `id:${item?._id}`,
      setSearchQuery: true,
      expandFirst: true,
      pathname: '/issues',
    };
    dispatch(clicked(payload));
    router.push('/issues');
  };

  let [tokenDecimals, setTokenDecimals] = useState(1);

  const getDecimals = async () => {
    const decimals = await fetchDecimals(item?.issue_stake_token_url);
    setTokenDecimals(decimals);
  };

  useEffect(() => {
    getDecimals();
  }, []);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-light-dark shadow-lg transition-all last:mb-0 hover:shadow-2xl',
        {
          'rounded-b-xl': last,
          'rounded-t-xl': first,
        }
      )}
      onClick={onClickHandler}
    >
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-5 items-center gap-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-6 text-xs font-medium tracking-wider text-white sm:text-sm">
          {item?.issue_title}
        </div>
        <div className="flex items-center justify-center text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          <IssueState state={item?.issue_state} />
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {item?.issue_project_name}
        </div>
        <div className="text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {Math.round((item?.issue_stake_amount * 100) / 10 ** tokenDecimals) /
            100}{' '}
          {item?.issue_stake_token_symbol}
        </div>
      </div>
      {!last && <div className="mx-3 border border-gray-500"></div>}
    </div>
  );
};

export default IssuesTableList;
