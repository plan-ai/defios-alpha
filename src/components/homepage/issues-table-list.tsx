import React, { useState } from 'react';
import IssueState from '../ui/tags/issue-state';
import { useAppDispatch } from '@/store/store';
import { clicked } from '@/store/notifClickSlice';
import { useRouter } from 'next/router';

interface IssuesTableListProps {
  item: any;
}

export const IssuesTableList: React.FC<IssuesTableListProps> = ({ item }) => {
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

  return (
    <div
      className="relative mb-2 overflow-hidden rounded-lg bg-light-dark shadow-card transition-all last:mb-0 hover:shadow-large"
      onClick={onClickHandler}
    >
      <div
        className="relative my-4 grid h-auto cursor-pointer grid-cols-5 items-start gap-6"
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
          {Math.round(item?.issue_stake_amount * 100) / 100}{' '}
          {item?.issue_stake_token_symbol}
        </div>
      </div>
    </div>
  );
};

export default IssuesTableList;
