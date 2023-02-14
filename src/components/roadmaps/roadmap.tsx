import Button from '@/components/ui/button';
import Feeds from '@/components/roadmaps/feeds';
import { useDrawer } from '@/components/drawer-views/context';
import { Filters, GridSwitcher } from '@/components/roadmaps/filters';
import { OptionIcon } from '@/components/icons/option';
import { SearchIcon } from '@/components/icons/search';

function Search() {
  return (
    <form
      className="relative flex w-full rounded-full"
      noValidate
      role="search"
    >
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-600 bg-transparent py-1 pr-5 pl-10 text-sm tracking-tighter text-white outline-none transition-all placeholder:text-gray-500 focus:border-gray-500"
          placeholder="Search Roadmaps"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute left-0 flex h-full w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 text-gray-500 hover:text-gray-900 sm:pl-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </form>
  );
}

export default function Roadmap() {
  const { openDrawer } = useDrawer();
  return (
    <>
      <div className="grid 2xl:grid-cols-[280px_minmax(auto,_1fr)] 4xl:grid-cols-[320px_minmax(auto,_1fr)]">
        <div className="hidden border-r border-dashed border-gray-700 pr-8 2xl:block">
          <Filters />
        </div>

        <div className="2xl:pl-8 4xl:pl-10">
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <span className="w-1/2 text-xs font-medium text-white sm:text-sm">
              <Search />
            </span>

            <div className="flex gap-6 3xl:gap-8">
              <div className="flex items-center justify-center">
                <Button shape="rounded" disabled className="!bg-gray-800">
                  + Create New Roadmap
                </Button>
                <span className="relative z-[2] ml-2 rounded-full bg-gray-900 px-2 py-0.5 normal-case text-red-700">
                  Coming Soon
                </span>
              </div>
              <div className="hidden 3xl:block">
                <GridSwitcher />
              </div>
              <div className="hidden sm:block 2xl:hidden">
                <Button
                  shape="rounded"
                  size="small"
                  variant="ghost"
                  color="gray"
                  onClick={() => openDrawer('DRAWER_SEARCH')}
                  className="!h-11 !p-3 hover:!translate-y-0 hover:!shadow-none focus:!translate-y-0 focus:!shadow-none"
                >
                  <OptionIcon className="relative h-auto w-[18px]" />
                </Button>
              </div>
            </div>
          </div>
          <Feeds />
        </div>

        <div className="fixed bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-9 sm:hidden">
          <Button onClick={() => openDrawer('DRAWER_SEARCH')} fullWidth>
            Filters
          </Button>
        </div>
      </div>
    </>
  );
}
