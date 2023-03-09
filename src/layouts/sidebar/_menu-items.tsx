import routes from '@/config/routes';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { ExchangeIcon } from '@/components/icons/exchange';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';
import { BriefcaseIcon } from '@/components/icons/briefcase';
import { BuildingIcon } from '@/components/icons/building';

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
    name: 'Create a Project',
    icon: <PlusCircle />,
    href: routes.incentivizeContributors,
  },
  {
    name: 'Profile',
    icon: <ProfileIcon />,
    href: routes.profile,
  },
  {
    name: 'Jobs',
    icon: <BriefcaseIcon />,
    href: routes.jobs,
    comingSoon: true,
  },
  // {
  //   name: 'Enterprise',
  //   icon: <BuildingIcon />,
  //   href: routes.enterprise,
  //   comingSoon: true,
  // },
];
