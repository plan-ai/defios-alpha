import { useEffect, useState } from 'react';
import axios from '@/lib/axiosClient';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import NotificationCard, {
  NotificationCardProps,
} from '@/components/notifications/notification-card';
import RootLayout from '@/layouts/_root-layout';
import { useAppSelector } from '@/store/store';
import Spinner from '@/components/custom/spinner';

import mixpanel from 'mixpanel-browser'

const NotificationPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();

  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (firebase_jwt === null) {
      if (
        sessionStorage.getItem('browser-notif-token') === null ||
        sessionStorage.getItem('browser-notif-token') === undefined ||
        sessionStorage.getItem('browser-notif-token') === ''
      ) {
        setLoading(false);
      }
      return;
    }
    axios
      .get('/api/notifications', {
        headers: {
          firebase_jwt,
        },
      })
      .then((res) => setNotificationList(res.data))
      .catch((err) => console.log(err.message));
    setLoading(false);
  }, [firebase_jwt]);

  const markAllRead = async () => {
    if (firebase_jwt === null || firebase_jwt === '') return;
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/notifications/read`,
      headers: {
        Authorization: firebase_jwt,
      },
    };
    await axios(config).catch((err) => console.log(err));
  };

  return (
    <>
      <NextSeo
        title="Notifications"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
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
              markAllRead();
              setNotificationList([]);
            }}
          >
            <span className="text-xs tracking-tighter">Mark all as read</span>
          </Button>
        </div>

        {!loading &&
          notificationList.length !== 0 &&
          notificationList.map((notification, idx) => {
            const notificationItem = notification as NotificationCardProps;
            return <NotificationCard key={idx} {...notificationItem} />;
          })}
        {!loading && notificationList.length === 0 && (
          <div className="mt-20 flex h-full w-full items-center justify-center pt-20">
            No More Notifications Left
          </div>
        )}
        {loading && <Spinner />}
      </div>
    </>
  );
};

NotificationPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default NotificationPage;
