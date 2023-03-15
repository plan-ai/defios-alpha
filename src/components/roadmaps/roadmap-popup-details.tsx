import React from 'react';
import cn from 'classnames';
import RoadmapPieChart from '@/components/roadmaps/roadmap-pie-chart';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import GithubTags from '@/components/ui/tags/github-tags';
import { detailsTabType } from '@/data/static/roadmap-list';
import ListCard from '@/components/ui/list-card';

interface RoadmapPopupDetailsProps {
  details: detailsTabType;
}

const RoadmapPopupDetails: React.FC<RoadmapPopupDetailsProps> = ({
  details,
}) => {
  const {
    description,
    topContributor,
    tags,
    timeframe,
    stakerIncentive,
    raisedAmount,
    toBeRaised,
    topContributorImg,
  } = details;
  return (
    <div className="space-y-6 ">
      <div className="block">
        <h3 className="text-heading-style mb-2 uppercase text-white">
          Description
        </h3>
        <div className="whitespace-pre-wrap text-sm leading-6 -tracking-wider text-gray-400">
          {description}
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style mb-2 uppercase text-white">
          Top Contributor
        </h3>
        <div className="flex">
          <ListCard
            item={{
              name: topContributor,
              logo: 'https://avatars.githubusercontent.com/u/74586376?v=4',
            }}
            className="rounded-full p-2 pr-4 text-gray-400 hover:text-white"
          />
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style mb-2 uppercase text-white">Tag</h3>
        <div className="flex">
          {tags.map((tag, idx) => {
            return <GithubTags tag={tag} key={idx} />;
          })}
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style mb-2 uppercase text-white">
          Timeframe
        </h3>
        <div className="text-sm leading-6 -tracking-wider text-gray-400">
          {timeframe}
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style mb-2 uppercase text-white">
          Staker Incentive
        </h3>
        <div className="text-sm leading-6 -tracking-wider text-gray-400">
          {stakerIncentive}
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style mb-4 uppercase text-white">
          Contributions to be Raised (progress)
        </h3>
        <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={cn('h-2.5 rounded-full bg-blue-600 dark:bg-blue-500')}
            style={{ width: `${(raisedAmount / toBeRaised) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm leading-6 -tracking-wider text-gray-400">
          ({raisedAmount}/{toBeRaised}) {(raisedAmount / toBeRaised) * 100}%
          raised
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style uppercase text-white">
          Split of the Funds Expense
        </h3>
        <div className="w-full">
          <RoadmapPieChart />
        </div>
      </div>
      <div className="block">
        <h3 className="text-heading-style mb-4 uppercase text-white">
          Stake on Issue
        </h3>
        <div className="w-full">
          <div className="flex w-full flex-row items-center ">
            <Input
              placeholder="Amount"
              type="number"
              className="my-2 w-full"
              inputClassName="!h-10"
            />
            <div className="ml-2 flex h-full items-center gap-1">
              <Button size="mini" shape="rounded">
                50%
              </Button>
              <Button size="mini" shape="rounded">
                100%
              </Button>
            </div>
          </div>
          <Button className="my-2 w-full" shape="rounded">
            Approve DIC Spend
          </Button>
          <Button className="my-2 w-full" shape="rounded" color="success">
            Stake DIC
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPopupDetails;
