import AnchorLink from '@/components/ui/links/anchor-link';
import Image from '@/components/ui/image';
import { StaticImageData } from 'next/image';

type notificationType = 'followed' | 'liked' | 'purchased';
type actor = {
  name: string;
  avatar: StaticImageData;
};

export interface NotificationCardProps {
  type: notificationType;
  actor: actor;
  time: string;
  url: string;
  notifier: string;
}

export default function NotificationCard({
  type,
  actor,
  time,
  url,
  notifier,
}: NotificationCardProps) {
  return (
    <AnchorLink
      href={url}
      className="mb-4 flex items-center rounded-lg p-4 shadow-card transition-all duration-200 last:mb-0 hover:-translate-y-0.5 hover:shadow-large bg-light-dark sm:mb-5 sm:p-5"
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
        <div className="text-xs tracking-tighter text-gray-400 sm:text-sm">
          <span className="mr-2 font-medium text-white">
            @{actor.name}
          </span>
          {type} {notifier}
        </div>
        <div className="mt-1 text-xs tracking-tighter text-gray-400 sm:text-sm">
          {time}
        </div>
      </div>
    </AnchorLink>
  );
}
