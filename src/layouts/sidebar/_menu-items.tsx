import routes from '@/config/routes';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { DiskIcon } from '@/components/icons/disk';
import { ExchangeIcon } from '@/components/icons/exchange';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';

export const menuItems = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    href: routes.home,
  },
  {
    name: 'Projects',
    icon: <FarmIcon />,
    href: routes.projects,
  },
  {
    name: 'Swap',
    icon: <ExchangeIcon />,
    href: routes.swap,
  },
  {
    name: 'Roadmaps',
    icon: <CompassIcon />,
    href: routes.roadmaps,
  },
  {
    name: 'Issues',
    icon: <PoolIcon />,
    href: routes.issues,
  },
  {
    name: 'Incentivize Contributors',
    icon: <PlusCircle />,
    href: routes.incentivizeContributors,
  },
  {
    name: 'Profile',
    icon: <ProfileIcon />,
    href: routes.profile,
  },
  {
    name: 'Jobs [coming soon]',
    icon: <DiskIcon />,
    href: routes.jobs,
  },
  {
    name: 'Enterprise [coming soon]',
    icon: <DiskIcon />,
    href: routes.enterprise,
  },
];
