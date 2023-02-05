import { Fragment } from 'react';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import AnchorLink from '@/components/ui/links/anchor-link';
import { DotsIcon } from '@/components/icons/dots-icon';

export default function NftDropDown() {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="flex h-5 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-white transition-colors hover:bg-gray-700">
          <DotsIcon className="h-[3px] w-4" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <Menu.Items className="absolute right-0 z-20 mt-5 w-60 origin-top-right rounded-lg bg-gray-800 py-3 shadow-large">
            <div className="px-3">
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-white transition hover:bg-gray-700"
                >
                  Place floor bid
                  <span className="ml-2 inline-flex rounded-md bg-[#FF445C] px-2 py-1 text-xs text-white">
                    new
                  </span>
                </AnchorLink>
              </Menu.Item>
              <Menu.Item>
                <AnchorLink
                  href="/profile"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-white transition hover:bg-gray-700"
                >
                  New bid
                </AnchorLink>
              </Menu.Item>
            </div>
            <div className="my-2.5 h-[1px] w-full border-t border-dashed border-gray-700"></div>
            <div className="px-3">
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-white transition hover:bg-gray-700"
                >
                  Refresh metadata
                </AnchorLink>
              </Menu.Item>
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-white transition hover:bg-gray-700"
                >
                  Open original ipfs
                </AnchorLink>
              </Menu.Item>
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-white transition hover:bg-gray-700"
                >
                  Report
                </AnchorLink>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
