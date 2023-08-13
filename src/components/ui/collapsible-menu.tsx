import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useMeasure } from '@/lib/hooks/use-measure';
import ActiveLink from '@/components/ui/links/active-link';
import { ChevronDown } from '@/components/icons/chevron-down';

type MenuItemProps = {
  name?: string;
  icon: React.ReactNode;
  href: string;
  dropdownItems?: DropdownItemProps[];
  isActive?: boolean;
  comingSoon?: boolean;
};

type DropdownItemProps = {
  name: string;
  href: string;
};

export function MenuItem({
  name,
  icon,
  href,
  dropdownItems,
  isActive,
  comingSoon,
}: MenuItemProps) {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = useState(false);
  const [ref, { height }] = useMeasure<HTMLUListElement>();
  const isChildrenActive =
    dropdownItems && dropdownItems.some((item) => item.href === pathname);
  useEffect(() => {
    if (isChildrenActive) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mb-0.5 list-none last:mb-0 xl:mb-1 3xl:mb-1.5">
      {dropdownItems?.length ? (
        <>
          <div
            className={cn(
              'relative flex h-12 cursor-pointer items-center justify-between whitespace-nowrap  rounded-xl px-4 text-sm transition-all xl:text-base 3xl:text-lg',
              isChildrenActive ? 'text-white' : 'text-gray-500 hover:text-white'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="z-[1] mr-3 flex items-center">
              <span className={cn('mr-3')}>{icon}</span>
              {name}
            </span>
            <span
              className={`z-[1] transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown />
            </span>

            {isChildrenActive && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-xl shadow-large"
                layoutId="menu-item-active-indicator"
              />
            )}
          </div>

          <div
            style={{
              height: isOpen ? height : 0,
            }}
            className="ease-[cubic-bezier(0.33, 1, 0.68, 1)] overflow-hidden transition-all duration-[350ms]"
          >
            <ul ref={ref}>
              {dropdownItems.map((item, index) => (
                <li className="first:pt-2" key={index}>
                  <ActiveLink
                    href={{
                      pathname: item.href,
                    }}
                    className="flex items-center rounded-xl p-3 pl-6 text-sm text-gray-500 transition-all before:mr-5 before:h-1 before:w-1 before:rounded-full before:bg-gray-500 xl:text-base 3xl:text-lg"
                    activeClassName=" !text-white before:!bg-white before:!w-2 before:!h-2 before:-ml-0.5 before:!mr-[18px]  !font-medium"
                  >
                    {item.name}
                  </ActiveLink>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <ActiveLink
          href={{
            pathname: href,
          }}
          className={cn(
            'relative flex h-10 items-center whitespace-nowrap rounded-xl px-4 text-sm text-gray-500  transition-all hover:text-white xl:text-base 2xl:h-12 3xl:text-lg'
          )}
          activeClassName="!text-primary"
        >
          <span
            className={cn(
              'relative z-[1] mr-3 duration-100 before:absolute before:-right-3 before:top-[50%] before:h-1 before:w-1 before:-translate-y-2/4 before:rounded-full before:bg-none',
              {
                'text-white': isActive,
              }
            )}
          >
            {icon}
          </span>
          <span className="relative z-[1] "> {name}</span>
          {comingSoon && href !== pathname && (
            <span className="relative z-[2] mx-2 rounded-full bg-gray-800 px-2 py-0.5 text-red-700">
              Coming Soon
            </span>
          )}
          {href === pathname && (
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-full w-full rounded-xl shadow-large"
              layoutId="menu-item-active-indicator"
            />
          )}
        </ActiveLink>
      )}
    </div>
  );
}
