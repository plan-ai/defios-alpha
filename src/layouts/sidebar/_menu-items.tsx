import routes from '@/config/routes';
import {
  HomeIcon,
  LightBulbIcon,
  FolderIcon,
  ArrowPathRoundedSquareIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { HammerIcon } from '@/components/icons/hammer';

export const menuItems: any = [
  {
    name: 'home',
    icon: <HomeIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />,
    href: routes.home,
  },
  {
    name: 'learn',
    icon: <LightBulbIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />,
    href: routes.learn,
  },
  {
    name: 'projects',
    icon: <FolderIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />,
    // href: routes.projects,
    href: routes.newCreate,
  },
  {
    name: 'issues',
    icon: <HammerIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />,
    href: routes.issues,
  },
  {
    name: 'swap',
    icon: (
      <ArrowPathRoundedSquareIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />
    ),
    href: routes.swap,
  },
  {
    name: 'roadmaps',
    icon: <MapIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />,
    href: routes.roadmaps,
  },
  // {
  //   name: 'create a project',
  //   icon: <PlusCircle className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />,
  //   href: routes.incentivizeContributors,
  // },
  // {
  //   name: 'jobs',
  //   icon: (
  //     <BriefcaseIcon className="h-5 w-5 xl:h-6 xl:w-6 3xl:h-7 3xl:w-7" />
  //   ),
  //   href: routes.jobs,
  //   comingSoon: true,
  // },
];
