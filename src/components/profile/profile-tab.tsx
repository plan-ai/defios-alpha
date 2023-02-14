import cn from 'classnames';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import TransactionSearchForm from '@/components/author/transaction-search-form';
import ContributionsHistory from '@/components/profile/contributions-history';
import ProfileProjectCard from '@/components/profile/profile-project-card';
// static data
import { profileProjects } from '@/data/static/profile-projects';
import GitHubCalendar from 'react-github-calendar';
import ReactTooltip from 'react-tooltip';

const tabMenu = [
  {
    title: 'Projects',
    path: 'projects',
  },
  {
    title: 'Contributions',
    path: 'contributions',
  },
  {
    title: 'Skills',
    path: 'skills',
    comingSoon: true,
  },
];

export default function ProfileTab() {
  return (
    <ParamTab tabMenu={tabMenu}>
      <TabPanel className="focus:outline-none">
        <TransactionSearchForm />
        <div
          className={cn(
            'grid gap-4 xs:grid-cols-2 lg:grid-cols-2 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4',
            'md:grid-cols-1'
          )}
        >
          {profileProjects?.map((project) => (
            <ProfileProjectCard
              item={project}
              key={`project-key-${project?.id}`}
            />
          ))}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="space-y-8 xl:space-y-9">
          <div className="w-full lg:mx-2">
            <GitHubCalendar
              theme={{
                level0: '#161b22',
                level1: '#0e4429',
                level2: '#006d32',
                level3: '#26a641',
                level4: '#39d353',
              }}
              labels={{
                tooltip: '<strong>{{count}} contributions</strong> on {{date}}',
                totalCount: '{{count}} contributions in {{year}}',
              }}
              showWeekdayLabels={true}
              username="Rohitkk432"
            >
              <ReactTooltip html />
            </GitHubCalendar>
          </div>

          <ContributionsHistory />
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div>Coming Soon</div>
      </TabPanel>
    </ParamTab>
  );
}
