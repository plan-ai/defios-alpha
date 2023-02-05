import cn from 'classnames';
import AnchorLink from '@/components/ui/links/anchor-link';
import Image from '@/components/ui/image';
import { StaticImageData } from 'next/image';

type notificationType =
  | 'issue-raised'
  | 'issue-staked'
  | 'issue-voting-open'
  | 'issue-closed'
  | 'new-obj-added-on-roadmap';
type actor = {
  name: string;
  avatar: StaticImageData;
};

export interface NotificationCardProps {
  type: notificationType;
  actor: actor;
  time: string;
  url: string;
}

const notifMessages = {
  'issue-raised': 'Raised an issue. Click on this issue to replicate',
  'issue-staked': 'Staked Tokens on an issue.',
  'issue-voting-open': 'Voting is open on an issue.',
  'issue-closed': 'Issue Closed.',
  'new-obj-added-on-roadmap': 'New objective added on Roadmap.',
};

export default function NotificationCard({
  type,
  actor,
  time,
  url,
}: NotificationCardProps) {
  return (
    <AnchorLink
      href={url}
      className="mb-4 flex items-center rounded-lg bg-light-dark p-4 shadow-card transition-all duration-200 last:mb-0 hover:-translate-y-0.5 hover:shadow-large sm:mb-5 sm:p-5"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
        <Image
          src={actor.avatar}
          alt={actor.name}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="ml-3 sm:ml-4">
        <div
          className={cn('text-xs tracking-tighter text-gray-400 sm:text-sm', {
            'text-[#e34234]': type == 'issue-raised',
            'text-[#009e60]': type == 'issue-staked',
            'text-[#FFFF00]': type == 'issue-voting-open',
            'text-[#2a52be]': type == 'issue-closed',
            'text-[#ffa500]': type == 'new-obj-added-on-roadmap',
          })}
        >
          <span className="mr-2 font-medium text-white">@{actor.name}</span>
          {notifMessages[type]}
        </div>
        <div className="mt-1 text-xs tracking-tighter text-gray-400 sm:text-sm">
          {time}
        </div>
      </div>
    </AnchorLink>
  );
}
