import dynamic from 'next/dynamic';
import Loader from '@/components/ui/loader';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    if (
      //@ts-ignore
      session?.user?.id &&
      wallet.publicKey &&
      //@ts-ignore
      session?.accessToken &&
      sessionStorage.getItem('browser-notif-token') !== undefined
    ) {
      axios
        .post('/api/firebase-token/notif', {
          //@ts-ignore
          github_id: session?.user?.id,
          firebase_uid: sessionStorage.getItem('browser-notif-token'),
          //@ts-ignore
          user_gh_access_token: session?.accessToken,
          pub_key: wallet.publicKey,
        })
        .then((response) => {
          sessionStorage.setItem('firebase_jwt', response.data.auth_creds);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [session, wallet]);

  // fix the `Hydration failed because the initial UI does not match` issue
  if (!isMounted) return null;

  // render default layout which is modern
  return (
    <ModernLayout contentClassName={contentClassName}>{children}</ModernLayout>
  );
}
