import { useState } from 'react';
import { StaticImageData } from 'next/image';
import { SearchIcon } from '@/components/icons/search';
import Avatar from '@/components/ui/avatar';
import CollectionImage1 from '@/assets/images/collection/collection-1.jpg';
import CollectionImage2 from '@/assets/images/collection/collection-2.jpg';
import CollectionImage3 from '@/assets/images/collection/collection-3.jpg';
import CollectionImage4 from '@/assets/images/collection/collection-4.jpg';

export const collectionList = [
  {
    icon: CollectionImage1,
    name: 'Iron flower',
    value: 'iron-flower',
  },
  {
    icon: CollectionImage2,
    name: 'Creative web',
    value: 'creative-web',
  },
  {
    icon: CollectionImage3,
    name: 'Art in binary',
    value: 'art-in-binary',
  },
  {
    icon: CollectionImage4,
    name: 'Sound of wave',
    value: 'sound-of-wave',
  },
  {
    icon: CollectionImage2,
    name: 'Pixel art',
    value: 'pixel-art',
  },
];

interface CollectionSelectTypes {
  onSelect: (value: string) => void;
}

export default function CollectionSelect({ onSelect }: CollectionSelectTypes) {
  let [searchKeyword, setSearchKeyword] = useState('');
  let coinListData = collectionList;
  if (searchKeyword.length > 0) {
    coinListData = collectionList.filter(function (item) {
      const name = item.name;
      return (
        name.match(searchKeyword) ||
        (name.toLowerCase().match(searchKeyword) && name)
      );
    });
  }
  function handleSelectedCoin(value: string) {
    onSelect(value);
  }
  return (
    <div className="w-full rounded-lg bg-light-dark text-sm shadow-large">
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-white" />
        <input
          type="search"
          autoFocus={true}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search..."
          className="w-full border-x-0 border-b border-dashed border-gray-600 bg-light-dark py-3.5 pl-14 pr-6 text-sm text-white focus:border-gray-500 focus:ring-0"
        />
      </div>
      <ul role="listbox" className="py-3">
        {coinListData.length > 0 ? (
          coinListData.map((item, index) => (
            <li
              key={index}
              role="listitem"
              tabIndex={index}
              onClick={() => handleSelectedCoin(item.value)}
              className="mb-1 flex cursor-pointer items-center gap-3 py-1.5 px-6 outline-none hover:bg-gray-700 focus:bg-gray-600"
            >
              <Avatar image={item.icon} size="xs" alt={item.name} />
              <span className="text-sm tracking-tight text-white">
                {item.name}
              </span>
            </li>
          ))
        ) : (
          // FIXME: need coin not found svg from designer
          <li className="px-6 py-5 text-center">
            <h3 className="mb-2 text-sm text-white">Ops! not found</h3>
          </li>
        )}
      </ul>
    </div>
  );
}
