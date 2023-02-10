import { useState } from 'react';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import TagsDropDown from '@/components/ui/tags/tags-dropdown';
import GithubTags from '@/components/ui/tags/github-tags';

export default function RightSideIssues({ className }: { className?: string }) {
  const [tags, setTags] = useState<string[]>([]);
  const handleTagSet = (tag: string) => {
    const newTags = [...tags, tag];
    setTags(newTags);
  };
  const handleTagRemove = (tag: string) => {
    const newTags = tags.filter((_tag) => {
      return _tag !== tag;
    });
    setTags(newTags);
  };
  return (
    <aside
      className={cn(
        'fixed top-0 right-0 z-20 h-full w-1/5 border-dashed border-gray-700 lg:border-l xl:pt-20',
        className
      )}
    >
      <Scrollbar style={{ height: 'calc(100%)' }}>
        <div className="relative z-20 h-screen pb-5">
          <div className="flex h-full flex-col overflow-x-hidden px-5 pb-32">
            <Button className="my-2 w-full" shape="rounded">
              Search for Repository
            </Button>
            <Input
              placeholder="Issue Name"
              type="text"
              className="my-2 w-full"
            />
            <Textarea className="my-2 w-full" placeholder="Issue Description" />
            <div className="my-2 flex w-full">
              <div className="mr-2">Tags: </div>
              <TagsDropDown handleTagSet={handleTagSet} tags={tags} />
            </div>
            {tags.length !== 0 && (
              <div className="my-2 flex w-full flex-wrap">
                {tags.map((tag, idx) => (
                  <GithubTags
                    tag={tag}
                    assign={true}
                    handleRemove={handleTagRemove}
                    key={idx}
                  />
                ))}
              </div>
            )}
            <Button className="my-2 mb-5 w-full" shape="rounded" color="info">
              Create Issue
            </Button>
            <div className="flex w-full flex-row items-center ">
              <Input
                placeholder="Amount"
                type="number"
                className="my-2 w-full"
                inputClassName="!h-10"
              />
              <div className="ml-2 flex h-full items-center gap-1">
                <Button size="mini" shape="rounded">
                  50%
                </Button>
                <Button size="mini" shape="rounded">
                  100%
                </Button>
              </div>
            </div>
            <Button className="my-2 w-full" shape="rounded">
              Approve DIC Spend
            </Button>
            <Button className="my-2 w-full" shape="rounded" color="success">
              Stake DIC
            </Button>
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
