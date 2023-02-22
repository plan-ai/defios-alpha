import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import NotificationCard, {
  NotificationCardProps,
} from '@/components/ui/notification-card';
import RootLayout from '@/layouts/_root-layout';

let notifications = [
  {
    notif_action_api_params: {
      searched:
        'issue_title:Create API Documentation,issue_creator:never2average,issue_project:DefiOSBackend',
    },
    notif_action_path: '/issues',
    notif_action_state_params: {
      first_expanded: true,
    },
    notif_content:
      '@never2average has created a new issue titled "Create API Documentation" on DefiOSBackend that you contribute to and staked an amount of 20 DOS on it. Check it out.',
    notif_post_time: 'Tue, 21 Feb 2023 07:07:37 GMT',
    notif_read_status: false,
    notif_type: 'opened_new_issue',
    reciever: '74586376',
    sender_id: '31365087',
    sender_name: 'Priyesh',
    sender_profile_pic: 'https://avatars.githubusercontent.com/u/31365087?v=4',
  },
  {
    notif_action_api_params: {
      searched:
        'issue_title:Create API Documentation,issue_creator:Rohitkk432,issue_project:DefiOSRust',
    },
    notif_action_path: '/issues',
    notif_action_state_params: {
      first_expanded: true,
    },
    notif_content:
      '@AbhisekBasu1 has staked an amount of 50 DOS on the issue "Create API Documentation" related to the DefiOSRust that you contribute to. Solve it Now.',
    notif_post_time: 'Tue, 21 Feb 2023 07:07:40 GMT',
    notif_read_status: false,
    notif_type: 'staked_initial_amount',
    reciever: '74586376',
    sender_id: '40645221',
    sender_name: 'Abhi',
    sender_profile_pic: 'https://avatars.githubusercontent.com/u/40645221?v=4',
  },
  {
    notif_action_api_params: {
      searched:
        'issue_title:Create API Documentation,issue_creator:Rohitkk432,issue_project:MusicProX',
    },
    notif_action_path: '/issues',
    notif_action_state_params: {
      first_expanded: true,
    },
    notif_content:
      'Voting has started on issue titled "Create API Documentation" in the project MusicProX where you have staked an amount of 50 MPX. Act Now.',
    notif_post_time: 'Tue, 21 Feb 2023 07:07:49 GMT',
    notif_read_status: false,
    notif_type: 'voting_started',
    reciever: '74586376',
    sender_id: '74586376',
    sender_name: 'Rohit Kodam',
    sender_profile_pic: 'https://avatars.githubusercontent.com/u/74586376?v=4',
  },
  {
    notif_action_api_params: {
      searched:
        'issue_title:Create API Documentation,issue_creator:Rohitkk432,issue_project:MusicProX',
    },
    notif_action_path: '/issues',
    notif_action_state_params: {
      first_expanded: true,
    },
    notif_content:
      '@AbhisekBasu1 has cast a vote on the issue titled "Create API Documentation" in your project MusicProX in favor of a fix title "Wrote an API documentation with Swagger api" written by @MayankMittal1.',
    notif_post_time: 'Tue, 21 Feb 2023 07:09:02 GMT',
    notif_read_status: false,
    notif_type: 'vote_cast',
    reciever: '74586376',
    sender_id: '40645221',
    sender_name: 'Abhi',
    sender_profile_pic: 'https://avatars.githubusercontent.com/u/40645221?v=4',
  },
  {
    notif_action_api_params: {
      searched:
        'issue_title:Create API Documentation,issue_creator:Rohitkk432,issue_project:MusicProX',
    },
    notif_action_path: '/issues',
    notif_action_state_params: {
      first_expanded: true,
    },
    notif_content:
      'Voting has closed for the issue "Create API Documentation" on project MusicProX and @MayankMittal1 has been chosen as the winner by a 70% margin',
    notif_post_time: 'Tue, 21 Feb 2023 07:18:33 GMT',
    notif_read_status: false,
    notif_type: 'voting_closed',
    reciever: '74586376',
    sender_id: '74586376',
    sender_name: 'Rohit Kodam',
    sender_profile_pic: 'https://avatars.githubusercontent.com/u/74586376?v=4',
  },
  {
    notif_action_api_params: {
      searched:
        'issue_title:Create API Documentation,issue_creator:Rohitkk432,issue_project:MusicProX',
    },
    notif_action_path: '/issues',
    notif_action_state_params: {
      first_expanded: true,
    },
    notif_content:
      'The issue "Create API Documentation" on project MusicProX has been closed and @MayankMittal1 has won 150 MPX for his submission "Wrote an API documentation with Swagger api".',
    notif_post_time: 'Tue, 21 Feb 2023 07:18:33 GMT',
    notif_read_status: false,
    notif_type: 'issue_closed',
    reciever: '74586376',
    sender_id: '74586376',
    sender_name: 'Rohit Kodam',
    sender_profile_pic: 'https://avatars.githubusercontent.com/u/74586376?v=4',
  },
];

const NotificationPage: NextPageWithLayout = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  return (
    <>
      <NextSeo
        title="Notifications"
        description="Defios - Tokenize your Open Source Project."
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

        {notificationList.map((notification, idx) => {
          const notificationItem = notification as NotificationCardProps;
          return <NotificationCard key={idx} {...notificationItem} />;
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
