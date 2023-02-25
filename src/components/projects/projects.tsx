import Button from '@/components/ui/button';
import ProjectList from '@/components/projects/list';
import ActiveLink from '@/components/ui/links/active-link';
import { ProjectsData } from '@/data/static/projects-data';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { Transition } from '@/components/ui/transition';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import { Switch } from '@/components/ui/switch';
import { ChevronDown } from '@/components/icons/chevron-down';
import { SearchIcon } from '@/components/icons/search';
import routes from '@/config/routes';
import PriceChart from '@/components/ui/chats/price-chart';
import CoinTicker from '@/components/custom/coin-ticker';
import DataWithImage from '@/components/custom/data-with-image';

const sort = [
  { id: 1, name: 'Hot' },
  { id: 2, name: 'Urgent' },
  { id: 3, name: 'Total Staked' },
  { id: 4, name: 'Total Contributors' },
  { id: 5, name: 'Latest' },
  { id: 6, name: 'Beginners' },
];

function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0]);
  return (
    <div className="relative w-full lg:w-auto">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-11 w-full items-center justify-between rounded-lg bg-light-dark px-4 text-sm text-white md:w-36 lg:w-40 xl:w-48">
          {selectedItem.name}
          <ChevronDown />
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-lg bg-[rgba(0,0,0,0.5)] p-3 px-1.5 shadow-large shadow-gray-900 backdrop-blur">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-white transition  ${
                      selected ? 'my-1 bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

function Search() {
  return (
    <div className="relative flex w-full rounded-full ">
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-600 bg-transparent py-1 pr-5 pl-10 text-sm tracking-tighter text-white outline-none transition-all placeholder:text-gray-500 focus:border-gray-500"
          placeholder="Search Projects"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute left-0 flex h-full w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 text-gray-500 hover:text-gray-900 sm:pl-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
      <Button
        shape="rounded"
        size="small"
        className="mx-2 flex items-center justify-center"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

function StackedSwitch() {
  const [isStacked, setIsStacked] = useState(false);
  return (
    <Switch
      checked={isStacked}
      onChange={setIsStacked}
      className="flex items-center gap-2 text-gray-400 sm:gap-3"
    >
      <div
        className={cn(
          isStacked ? 'bg-blue-500' : 'bg-gray-500',
          'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
        )}
      >
        <span
          className={cn(
            isStacked
              ? 'translate-x-5 bg-light-dark'
              : 'translate-x-0.5 bg-light-dark',
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
          )}
        />
      </div>
      <span className="inline-flex text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
        Native Tokens only
      </span>
    </Switch>
  );
}

function Status() {
  const [status, setStatus] = useState('global projects');
  return (
    <RadioGroup
      value={status}
      onChange={setStatus}
      className="flex items-center sm:gap-3"
    >
      <RadioGroup.Option value="global projects">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-40 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-40 sm:text-sm ${
              checked ? 'text-white' : 'text-white/50'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">Global Projects</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="my projects">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-40 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-40 sm:text-sm ${
              checked ? 'text-white' : 'text-white/50'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">My Projects</span>
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

export default function Projects() {
  return (
    <div className="mx-auto w-full">
      <div
        className={cn(
          'mb-6 flex flex-col justify-between gap-4',
          'md:flex-row md:items-center md:gap-6'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Status />
          <div className={cn('md:hidden')}>
            <StackedSwitch />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className={cn('hidden shrink-0 ', 'md:block')}>
            <StackedSwitch />
          </div>
          <Search />
          <SortList />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-8 gap-6 rounded-lg bg-light-dark shadow-card">
        <span className="col-span-2 px-6 py-6 text-xs tracking-wider text-gray-300 sm:text-sm">
          Name
        </span>
        <span className="px-6 py-6 text-xs tracking-wider text-gray-300 sm:text-sm">
          Open Issues
        </span>
        <span className="px-6 py-6 text-xs tracking-wider text-gray-300 sm:text-sm">
          Repository Status
        </span>
        <span className="col-span-2 px-6 py-6 text-xs tracking-wider text-gray-300 sm:text-sm ">
          Liquidity
        </span>
        <span className="col-span-2 px-6 py-6 text-xs tracking-wider text-gray-300 sm:text-sm ">
          Top Contributors
        </span>
      </div>

      {ProjectsData.map((project) => (
        <ProjectList
          key={project.id}
          name={project.name}
          openIssues={project.openIssues}
          repositoryStatus={project.repositoryStatus}
          liquidityStaked={project.liquidityStaked}
          liquidityRewarded={project.liquidityRewarded}
          topBuilder={project.topBuilder}
          topSupporter={project.topSupporter}
          coin={project.coin}
        >
          <div className="mb-2 flex flex-row items-center justify-between text-sm">
            <div className="flex w-[30%]">
              <CoinTicker
                value={project.coinValue}
                coin={project.coin}
                change={project.change}
              />
              <div className="w-full">
                <PriceChart />
              </div>
            </div>
            <div className="flex w-[30%]">
              <DataWithImage
                image="health"
                header="Community Health"
                value={project.healthValue}
              />
              <div className="w-full">
                <PriceChart />
              </div>
            </div>
            <div className="flex w-[30%]">
              <DataWithImage
                image="handshake"
                header="Contributions"
                value={project.contributionValue}
                change={project.contributionChange}
              />
              <div className="w-full">
                <PriceChart />
              </div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-3 gap-3 text-sm">
            <ActiveLink href={routes.projects}>
              <Button shape="rounded" fullWidth size="medium">
                Explore Related Roadmaps
              </Button>
            </ActiveLink>
            <ActiveLink href={routes.projects}>
              <Button shape="rounded" color="info" fullWidth size="medium">
                Explore Open Issues
              </Button>
            </ActiveLink>
            <ActiveLink href={routes.projects}>
              <Button shape="rounded" color="success" fullWidth size="medium">
                Claim Pending Tokens
              </Button>
            </ActiveLink>
          </div>
        </ProjectList>
      ))}
    </div>
  );
}
