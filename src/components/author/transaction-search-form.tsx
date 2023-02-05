import ListCard from '@/components/ui/list-card';
import Avalanche from '@/assets/images/avalanche.svg';
import Anchor from '@/assets/images/anchor.svg';
import Cappasity from '@/assets/images/cappasity.svg';
import PancakeBunny from '@/assets/images/pancake-bunny.svg';
import Ethereum from '@/assets/images/currency/ethereum.svg';
import { SearchIcon } from '@/components/icons/search';
const searchFilter = [
  { id: 1, name: 'AVALANCHE', logo: Avalanche },
  { id: 2, name: 'ETHEREUM', logo: Ethereum },
  { id: 3, name: 'CAPPASITY', logo: Cappasity },
  { id: 4, name: 'ANCHOR', logo: Anchor },
  { id: 5, name: 'PANCAKEBUNNY', logo: PancakeBunny },
];

export default function TransactionSearchForm() {
  return (
    <div className="block">
      <form
        className="relative flex w-full rounded-full"
        noValidate
        role="search"
      >
        <label className="flex flex-1 items-center">
          <input
            className="h-12 w-full rounded-full border py-1 pr-5 pl-11 text-sm focus:outline-none  border-gray-600 bg-light-dark text-white placeholder:text-gray-400 focus:border-gray-500 sm:pl-14 xl:pl-16 "
            placeholder="Filter by protocol, token, event, etc..."
            autoComplete="off"
            type="search"
          />
          <div className="absolute left-0 flex h-full w-10 items-center justify-center pl-2 text-white sm:w-14 sm:pl-3 xl:w-16">
            <SearchIcon className="h-4 w-4" />
          </div>
        </label>
      </form>
      <div className="mt-4 flex flex-wrap gap-3 sm:mt-5 lg:mt-6">
        {searchFilter?.map((item) => (
          <div key={item?.id} role="button">
            <ListCard
              item={item}
              className="shrink-0 rounded-full p-2 pr-5 transition-transform hover:-translate-y-0.5 hover:bg-gray-50 focus:-translate-y-0.5 focus:bg-gray-50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
