import { useEffect, useState } from 'react';
import { SearchIcon } from '@/components/icons/search';
import Image from 'next/image';

interface CoinSelectViewTypes {
  onSelect: (selectedCoin: any) => void;
  coinList: any;
}

export default function CoinSelectView({
  onSelect,
  coinList,
}: CoinSelectViewTypes) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [coinListData, setCoinListData] = useState<any>([]);
  useEffect(() => {
    if (searchKeyword.length > 0 && coinList.length > 0) {
      const newData = coinList.filter((item: any) => {
        const token_symbol = item.token_symbol;
        return (
          token_symbol.match(searchKeyword) ||
          (token_symbol.toLowerCase().match(searchKeyword) && token_symbol)
        );
      });
      setCoinListData(newData);
    } else {
      setCoinListData(coinList);
    }
  }, [coinList, searchKeyword]);

  function handleSelectedCoin(item: any) {
    onSelect(item);
  }
  function handleSelectedCoinOnKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>,
    item: any
  ) {
    if (event.code === 'Enter') {
      onSelect(item);
    }
  }
  return (
    <div className="w-full w-[20rem] rounded-xl bg-dark text-2xs shadow-large xl:w-[21.5rem] xl:text-xs 2xl:w-[23.5rem] 3xl:w-[25rem] 3xl:text-sm">
      <h2 className="p-6 text-sm font-medium uppercase text-white xl:text-base 3xl:text-lg">
        Pay with
      </h2>
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-gray-700" />
        <input
          type="search"
          autoFocus={true}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search Your Coin by Name"
          className="w-full border-y border-x-0 border-dashed border-gray-700 bg-light-dark py-3.5 pl-14 pr-6 text-sm focus:border-gray-600 focus:ring-0"
        />
      </div>
      <ul className="h-[45vh] overflow-auto py-3">
        {coinListData.length > 0 ? (
          coinListData.map((item: any, idx: number) => (
            <li
              key={idx}
              onClick={() => handleSelectedCoin(item)}
              onKeyDown={(event) => handleSelectedCoinOnKeyDown(event, item)}
              className="flex cursor-pointer items-center gap-2 py-3 px-6 outline-none hover:bg-gray-800 focus:bg-gray-900"
            >
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={item.token_image_url || ''}
                  alt={item.token_symbol || ''}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="uppercase">{item.token_symbol}</span>
            </li>
          ))
        ) : (
          // FIXME: need coin not found svg from designer
          <li className="px-6 py-20 text-center">
            <h3 className="mb-2 text-base">Ops! not found</h3>
            <p className="text-gray-500">Try another keyword for search</p>
          </li>
        )}
      </ul>
    </div>
  );
}
