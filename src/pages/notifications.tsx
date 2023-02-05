import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import NotificationCard, {
  NotificationCardProps,
} from '@/components/ui/notification-card';
import RootLayout from '@/layouts/_root-layout';
//images
import User1 from '@/assets/images/avatar/8.jpg';
import User2 from '@/assets/images/avatar/9.jpg';
import User3 from '@/assets/images/avatar/10.jpg';
import User4 from '@/assets/images/avatar/11.jpg';
import User5 from '@/assets/images/avatar/8.jpg';

let notifications = [
  {
    id: 1,
    type: 'issue-raised',
    actor: {
      name: 'dolcemariposa',
      avatar: User1,
    },
    time: 'Just Now',
    url: '#',
  },
  {
    id: 2,
    type: 'issue-staked',
    actor: {
      name: 'pimptronot',
      avatar: User2,
    },
    time: '10 minutes ago',
    url: '#',
  },
  {
    id: 3,
    type: 'issue-voting-open',
    actor: {
      name: 'centralgold',
      avatar: User3,
    },
    time: '20 minutes ago',
    url: '#',
  },
  {
    id: 4,
    type: 'issue-closed',
    actor: {
      name: 'theline',
      avatar: User4,
    },
    time: '30 minutes ago',
    url: '#',
  },
  {
    id: 4,
    type: 'new-obj-added-on-roadmap',
    actor: {
      name: 'bruhh',
      avatar: User5,
    },
    time: '50 minutes ago',
    url: '#',
  },
];

const NotificationPage: NextPageWithLayout = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  return (
    <>
      <NextSeo
        title="Notifications"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-[660px] max-w-full">
        <div className="mb-7 flex items-center justify-between gap-6">
          <h2 className="text-center text-lg font-medium text-white sm:text-xl lg:text-2xl">
            Notifications
          </h2>
          <Button
            color="white"
            variant="transparent"
            size="mini"
            shape="rounded"
            onClick={() => {
              setNotificationList([]);
            }}
          >
            <span className="text-xs tracking-tighter">Mark all as read</span>
          </Button>
        </div>

        {notificationList.map((notification) => {
          const notificationItem = notification as NotificationCardProps;
          return (
            <NotificationCard key={notification.id} {...notificationItem} />
          );
        })}
        {notificationList.length === 0 && (
          <div className="mt-20 flex h-full w-full items-center justify-center pt-20">
            No More Notifications Left
          </div>
        )}
      </div>
    </>
  );
};

NotificationPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default NotificationPage;
