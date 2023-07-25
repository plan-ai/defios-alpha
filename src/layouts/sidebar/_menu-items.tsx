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

export const menuItems:any = {
  contributor:[{
    name: 'learn',
    icon: <HomeIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />,
    href: routes.learn,
  },
  {
    name: 'home',
    icon: <HomeIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />,
    href: routes.home,
  },
  {
    name: 'projects',
    icon: <FarmIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />,
    href: routes.projects,
  },
  {
    name: 'swap',
    icon: (
      <ExchangeIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />
    ),
    href: routes.swap,
  }],
  repoOwner:[
    {
    name: 'roadmaps',
    icon: <CompassIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />,
    href: routes.roadmaps,
  },
  {
    name: 'issues',
    icon: <PoolIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />,
    href: routes.issues,
  },
  {
    name: 'create a project',
    icon: <PlusCircle className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />,
    href: routes.incentivizeContributors,
  },
  {
    name: 'jobs',
    icon: (
      <BriefcaseIcon className="h-3 w-3 xl:h-3.5 xl:w-3.5 3xl:h-4 3xl:w-4" />
    ),
    href: routes.jobs,
    comingSoon: true,
  }] 
};
