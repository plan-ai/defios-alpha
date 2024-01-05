import cn from 'classnames';
import Image from 'next/image';
import { useAppDispatch } from '@/store/store';
import { clicked } from '@/store/notifClickSlice';
import { useRouter } from 'next/router';
export interface NotificationCardProps {
  notif_action_api_params: {
    searched: string;
  };
  notif_action_path: string;
  notif_action_state_params: {
    first_expanded: boolean;
  };
  notif_content: string;
  notif_post_time: string;
  notif_read_status: boolean;
  notif_type: string;
  reciever: string;
  sender_id: string;
  sender_name: string;
  sender_profile_pic: string;
}

const notifMessages = {
  'issue-raised': 'Raised an issue. Click on this issue to replicate',
  'issue-staked': 'Staked Tokens on an issue.',
  'issue-voting-open': 'Voting is open on an issue.',
  'issue-closed': 'Issue Closed.',
};

export default function NotificationCard({
  notif_action_api_params,
  notif_action_path,
  notif_action_state_params,
  notif_content,
  notif_post_time,
  notif_read_status,
  notif_type,
  reciever,
  sender_id,
  sender_name,
  sender_profile_pic,
}: NotificationCardProps) {
  const dateFormatted = new Date(notif_post_time).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeFormatted = new Date(notif_post_time).toLocaleTimeString('en-IN', {
    timeStyle: 'short',
  });

  const notifType = notif_type
    .split('_')
    .map((word: string) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClickHandler = () => {
    const payload = {
      searchQuery: notif_action_api_params.searched,
      setSearchQuery: true,
      expandFirst: notif_action_state_params.first_expanded,
      pathname: notif_action_path,
    };
    dispatch(clicked(payload));
    router.push(notif_action_path);
  };

  return (
    <div
      onClick={onClickHandler}
      className="mb-4 flex items-start rounded-xl bg-light-dark p-4 shadow-card transition-all duration-200 last:mb-0 hover:-translate-y-0.5 hover:shadow-large sm:mb-5 sm:p-5"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
        <Image
          src={sender_profile_pic || ''}
          alt={sender_name || ''}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="ml-3 sm:ml-4">
        <div className="flex items-center justify-between text-xs tracking-tighter sm:text-sm">
          <div
            className={cn({
              'text-red-500': notif_type == 'opened_new_issue',
              'text-new-green': notif_type == 'staked_initial_amount',
              'text-yellow-400': notif_type == 'voting_started',
              'text-emerald-400': notif_type == 'vote_cast',
              'text-orange-500': notif_type == 'voting_closed',
              'text-new-blue': notif_type == 'issue_closed',
            })}
          >
            <span className="mr-2 font-medium text-white">{sender_name}</span>
            {notifType}
          </div>
          <div className="text-xs tracking-tighter text-gray-400">
            {dateFormatted} | {timeFormatted}
          </div>
        </div>

        <div className="mt-2 text-sm tracking-tighter text-gray-300">
          {notif_content}
        </div>
      </div>
    </div>
  );
}
