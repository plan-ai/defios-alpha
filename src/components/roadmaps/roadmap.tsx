import Button from '@/components/ui/button';
import Feeds from '@/components/roadmaps/feeds';
import { useDrawer } from '@/components/drawer-views/context';
import { Filters, GridSwitcher, SortList } from '@/components/roadmaps/filters';
import { OptionIcon } from '@/components/icons/option';

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
            <span className="text-xs font-medium text-white sm:text-sm">
              5,686,066 items
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
