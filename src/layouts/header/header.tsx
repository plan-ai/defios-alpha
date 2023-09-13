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
import {
  selectUserMapping,
  getUserMapping,
  resetMapping,
} from '@/store/userMappingSlice';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

function NotificationButton() {
  const router = useRouter();
  return (
    <AnchorLink
      href={
        router.pathname === routes.notification
          ? routes.learn
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
  const router = useRouter();
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
    } else if (!wallet.publicKey) {
      console.log('entered else if');
      dispatch(resetMapping());
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
    <div className="flex flex-col items-end gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10">
      <div className="relative mt-5 flex shrink-0 items-center justify-end gap-4 gap-3 2xl:gap-8">
        {/* <NotificationButton /> */}
        <WalletMultiButton className="gradient-border-box border-0.5 h-10 rounded-full bg-newdark 2xl:h-12" />
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col">
      <div className="mb-3 mt-5 text-5xl font-bold text-primary xl:mt-3.5 xl:text-6xl 2xl:mb-3.5 2xl:text-7xl 3xl:mb-4 3xl:mt-4">
        {title}
      </div>
      {description &&
        description.length !== 0 &&
        description.map((item: string, idx: number) => (
          <div key={idx} className="text-xs xl:text-sm 2xl:text-base">
            {item}
          </div>
        ))}
    </div>
  );
};

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'relative top-0 right-0 z-30 h-[7rem] w-full transition-all duration-300 lg:h-[8rem] 2xl:h-[11rem]',
        // isMounted && windowScroll.y
        //   ? 'bg-gradient-to-b from-dark to-dark/80 shadow-card backdrop-blur'
        //   : '',
        {
          '!h-[5rem]':
            router.pathname.includes('/issues/') ||
            router.pathname.includes('/issues') ||
            router.pathname.includes('/projects') ||
            router.pathname.includes('/roadmaps'),
          '!hidden': router.pathname === '/learn',
        },
        className
      )}
    >
      <div className="flex h-full items-start justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="m-5 ml-0 block lg:hidden">
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
          {router.pathname === '/swap' && (
            <PageHeader
              title="swap"
              description={[
                'purchase and HODL your favorite tokens.',
                'swap with project tokens of new projects that you want to support.',
              ]}
            />
          )}
          {router.pathname === '/profile' && (
            <PageHeader
              title="profile"
              description={[
                'explore and analyse your contributions.',
                'build your proof of work to showcase your skills.',
              ]}
            />
          )}
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
