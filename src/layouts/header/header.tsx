import { useRouter } from 'next/router';
import cn from 'classnames';
import Logo from '@/components/ui/logo';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import { BellIcon } from '@/components/icons/bell';
import Hamburger from '@/components/ui/hamburger';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import routes from '@/config/routes';
import { setSigner, setConnection } from '@/lib/helpers/wallet';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectUserMapping, getUserMapping } from '@/store/userMappingSlice';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

function NotificationButton() {
  const router = useRouter();
  return (
    <AnchorLink
      href={
        router.pathname === routes.notification
          ? routes.home
          : routes.notification
      }
    >
      <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-700 bg-light-dark text-white shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none xl:h-12 xl:w-12">
        <BellIcon />
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-slate-50 shadow-light xl:h-3 xl:w-3" />
      </div>
    </AnchorLink>
  );
}

function HeaderRightArea() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const { connection } = useConnection();
  const userMappingState = useAppSelector(selectUserMapping);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //@ts-ignore
    if (
      //@ts-ignore
      session?.user?.id &&
      wallet.publicKey &&
      //@ts-ignore
      session?.accessToken &&
      !userMappingState.isLoading
    ) {
      dispatch(
        getUserMapping({
          //@ts-ignore
          userID: session?.user.id,
          //@ts-ignore
          accessToken: session?.accessToken,
          userPubkey: wallet.publicKey.toBase58(),
        })
      );
    }
    //@ts-ignore
  }, [wallet.publicKey, session?.accessToken, session?.user.id]);

  useEffect(() => {
    if (wallet.publicKey)
      setSigner(
        wallet.publicKey,
        wallet.signTransaction,
        wallet.signAllTransactions
      );
    if (connection) setConnection(connection);
  }, [wallet.publicKey, connection]);

  return (
    <div className="relative order-last flex shrink-0 items-center justify-end gap-4 gap-3 2xl:gap-8">
      <NotificationButton />
      <WalletMultiButton className="h-10 rounded-full bg-new-blue  2xl:h-12" />
    </div>
  );
}

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 right-0 z-30 h-[5.5rem] w-full transition-all duration-300 lg:h-[6.5rem] 2xl:h-[7.5rem]',
        isMounted && windowScroll.y
          ? 'bg-gradient-to-b from-dark to-dark/80 shadow-card backdrop-blur'
          : '',
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="mr-5 block lg:hidden">
            <Hamburger
              isOpen={false}
              variant="solid"
              onClick={() => openDrawer('DASHBOARD_SIDEBAR', 'left')}
              className="text-white"
            />
          </div>
          {/* <div
            onClick={() => router.push(routes.home)}
            className="mr-4 flex items-center lg:hidden"
          >
            <Logo />
          </div> */}
          {router.pathname === '/home' && (
            <div className="text-lg xl:text-xl 2xl:text-xl">
              Welcome to defiOS
            </div>
          )}
          {router.pathname === '/projects' && (
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-primary xl:text-4xl 2xl:text-5xl mb-2 2xl:mb-2.5 3xl:mb-3 mt-4 xl:mt-6 3xl:mt-8">
                projects
              </div>
              <div className="text-xs xl:text-sm 2xl:text-base">
                get rewarded when you contribute to a project.
              </div>
              <div className="text-xs xl:text-sm 2xl:text-base">
                create your own project to incentivize contributors.
              </div>
            </div>
          )}
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
