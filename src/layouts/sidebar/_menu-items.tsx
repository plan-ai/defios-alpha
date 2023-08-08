import routes from '@/config/routes';
import { HomeIcon } from '@/components/icons/home';
import { BookOpenIcon } from '@/components/icons/book-open';
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
    name: 'learn',
    icon: <BookOpenIcon />,
    href: routes.learn,
  },
  {
    name: 'projects',
    icon: <FarmIcon />,
    href: routes.projects,
  },
  {
    name: 'swap',
    icon: <ExchangeIcon />,
    href: routes.swap,
  },
  {
    name: 'roadmaps',
    icon: <CompassIcon />,
    href: routes.roadmaps,
  },
  {
    name: 'issues',
    icon: <PoolIcon />,
    href: routes.issues,
  },
  {
    name: 'create a project',
    icon: <PlusCircle />,
    href: routes.incentivizeContributors,
  },
  {
    name: 'jobs',
    icon: <BriefcaseIcon />,
    href: routes.jobs,
    comingSoon: true,
  },
  // {
  //   name: 'enterprise',
  //   icon: <BuildingIcon />,
  //   href: routes.enterprise,
  //   comingSoon: true,
  // },
];
