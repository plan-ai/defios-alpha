import { SearchIcon } from '@/components/icons/search';

export default function TransactionSearchForm() {
  return (
    <div className="mb-10 block">
      <form
        className="relative flex w-full rounded-full"
        noValidate
        role="search"
      >
        <label className="flex flex-1 items-center">
          <input
            className="h-12 w-full rounded-full border border-gray-600 bg-light-dark py-1 pr-5 pl-11  text-sm text-white placeholder:text-gray-400 focus:border-gray-500 focus:outline-none sm:pl-14 xl:pl-16 "
            placeholder="Filter by protocol, token, event, etc..."
            autoComplete="off"
            type="search"
          />
          <div className="absolute left-0 flex h-full w-10 items-center justify-center pl-2 text-white sm:w-14 sm:pl-3 xl:w-16">
            <SearchIcon className="h-4 w-4" />
          </div>
        </label>
      </form>
    </div>
  );
}
