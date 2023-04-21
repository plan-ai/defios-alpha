import React, { Fragment, useState, useEffect } from 'react';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import { Plus } from '@/components/icons/plus';
import GithubTags, { tagsList } from '@/components/ui/tags/github-tags';

interface TagsDropDownProps {
  handleTagSet: (tag: string) => void;
  tags: string[];
}

const TagsDropDown: React.FC<TagsDropDownProps> = ({ handleTagSet, tags }) => {
  const [tagsToShow, setTagsToShow] = useState(tagsList);
  useEffect(() => {
    const newTagsToShow = tagsList.filter((tag) => {
      return !tags.includes(tag);
    });
    setTagsToShow(newTagsToShow);
  }, [tags]);
  return (
    <div className="relative">
      <Menu>
        <Menu.Button
          disabled={tagsToShow.length === 0}
          className="flex h-5 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-white transition-colors hover:bg-gray-700"
        >
          <Plus />
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
          <Menu.Items className="absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-xl bg-gray-800 py-2 shadow-large">
            <div className="px-2">
              {tagsToShow.map((tag, idx) => (
                <Menu.Item key={idx}>
                  <div className="pb-0.5" onClick={() => handleTagSet(tag)}>
                    <GithubTags tag={tag} />
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default TagsDropDown;
