import React from 'react';
import { GitIcon } from '@/components/icons/git';
import { StarIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import LangTags from '@/components/ui/tags/lang-tags';

interface SpotlightProjectProps {}

const SpotlightProject: React.FC<SpotlightProjectProps> = ({}) => {
  const dummyTags = ['JavaScript', 'HTML'];

  return (
    <>
      <div className="ml-2 text-sm xl:text-lg 3xl:text-xl">Featured:</div>
      <div className="gradient-border-box-hover flex  items-center justify-between rounded-lg border border-gray-700 bg-body p-3 transition-all hover:scale-[102%] lg:border-2 xl:p-3.5 3xl:p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="mr-2 text-base font-semibold xl:text-lg 3xl:text-xl">
              defios/defios-alpha
            </div>
            <div className="flex items-center gap-1">
              {dummyTags.map((tag, idx) => {
                return <LangTags tag={tag} key={idx} />;
              })}
            </div>
          </div>
          <div className="mt-4 text-xs xl:text-sm 3xl:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint sed
            omnis explicabo assumenda incidunt voluptas quaerat, saepe expedita
            fugit, perferendis itaque distinctionnnnnn itaque distinctio ....
            <strong>
              <u>Click to Read More</u>
            </strong>
          </div>
        </div>
        <div className="flex h-full gap-6 rounded-lg bg-body py-3 px-6">
          <div className="flex flex-col items-center justify-between gap-1 text-sm xl:text-base 3xl:text-lg">
            <GitIcon />
            <div>240</div>
          </div>
          <div className="flex flex-col items-center justify-between gap-1 text-sm xl:text-base 3xl:text-lg">
            <UserGroupIcon className="h-8 w-8" />
            <div>12</div>
          </div>
          <div className="flex flex-col items-center justify-between gap-1 text-sm xl:text-base 3xl:text-lg">
            <StarIcon className="h-8 w-8" />
            <div>12</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotlightProject;
