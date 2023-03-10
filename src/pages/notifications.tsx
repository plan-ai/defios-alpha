import { useEffect, useState } from 'react';
import axios from 'axios';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import NotificationCard, {
  NotificationCardProps,
} from '@/components/ui/notification-card';
import RootLayout from '@/layouts/_root-layout';
import { useAppSelector } from '@/store/store';
import Spinner from '@/components/custom/spinner';

const NotificationPage: NextPageWithLayout = () => {
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
    await axios
      .put('https://api-v1.defi-os.com/notifications/read', {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .catch((err) => console.log(err));
  };

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
