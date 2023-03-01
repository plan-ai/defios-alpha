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
      <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-700 bg-light-dark text-white shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none sm:h-12 sm:w-12">
        <BellIcon />
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-slate-50 shadow-light sm:h-3 sm:w-3" />
      </div>
    </AnchorLink>
  );
}

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-4 sm:gap-6 lg:gap-8">
      <NotificationButton />
      <WalletMultiButton className="rounded-full bg-blue-500" />
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
        'sticky top-0 right-0 z-30 h-16 w-full transition-all duration-300 sm:h-20 3xl:h-24',
        (isMounted && windowScroll.y) > 2
          ? 'bg-gradient-to-b from-dark to-dark/80 shadow-card backdrop-blur'
          : '',
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div className="mr-2 block sm:mr-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="solid"
              onClick={() => openDrawer('DASHBOARD_SIDEBAR')}
              className="text-white"
            />
          </div>
          {router.pathname === '/' && (
            <div className="text-2xl">Welcome to DefiOS!!</div>
          )}
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <Logo />
          </div>
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
