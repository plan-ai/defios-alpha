import dynamic from 'next/dynamic';
import Loader from '@/components/ui/loader';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getFirebaseJwt } from '@/store/firebaseTokensSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
// dynamic imports
const ModernLayout = dynamic(() => import('@/layouts/_modern'), {
  loading: () => <FallbackLoader />,
});

function FallbackLoader() {
  return (
    <div className="fixed z-50 grid h-full w-full place-content-center">
      <Loader variant="blink" />
    </div>
  );
}

export default function RootLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  const isMounted = useIsMounted();
  const wallet = useWallet();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );
  useEffect(() => {
    if (
      firebase_jwt === null &&
      //@ts-ignore
      session?.user?.id &&
      wallet.publicKey &&
      //@ts-ignore
      session?.accessToken &&
      sessionStorage.getItem('browser-notif-token') !== undefined
    ) {
      const notifToken = sessionStorage.getItem('browser-notif-token');
      dispatch(
        getFirebaseJwt({
          //@ts-ignore
          github_id: session.user.id,
          //@ts-ignore
          firebase_uid: notifToken,
          //@ts-ignore
          user_gh_access_token: session.accessToken,
          //@ts-ignore
          pub_key: wallet.publicKey,
        })
      );
    }
  }, [session, wallet, dispatch, firebase_jwt]);

  // fix the `Hydration failed because the initial UI does not match` issue
  if (!isMounted) return null;

  // render default layout which is modern
  return (
    <ModernLayout contentClassName={contentClassName}>{children}</ModernLayout>
  );
}
