import React, { useState, useEffect } from 'react';
import { GithubIssueIcon } from '@/components/icons/github-issue';
import { StarIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import LangTags, { mappingGHSkill } from '@/components/ui/tags/lang-tags';

import AnchorLink from '@/components/ui/links/anchor-link';

import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import { setLazyProp } from 'next/dist/server/api-utils';
interface SpotlightProjectProps {
  item: any;
}

const SpotlightProject: React.FC<SpotlightProjectProps> = ({ item }) => {
  const { data: session } = useSession();

  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (!(session as any)?.accessToken) return;
    if (item === undefined || item == null || item.languages_url === undefined)
      return;
    axios
      .get(item.languages_url, {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => {
        const repoLangs = Object.keys(res.data);
        const filteredLangs = repoLangs.filter((lang: string) =>
          Object.keys(mappingGHSkill).includes(lang)
        );
        if (filteredLangs.length > 5) {
          setLanguages(filteredLangs.slice(5));
        } else {
          setLanguages(filteredLangs);
        }
      });
  }, [session, item]);

  return (
    <>
      <div className="ml-2 text-sm xl:text-lg 3xl:text-xl">Featured:</div>
      <AnchorLink
        href={item?.html_url || ''}
        target="_blank"
        className="gradient-border-box-hover flex w-full items-center justify-between rounded-lg border border-gray-700 bg-body p-3 transition-all hover:scale-[102%] lg:border-2 xl:p-3.5 3xl:p-4"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="mr-2 text-base font-semibold xl:text-lg 3xl:text-xl">
              {item?.full_name}
            </div>
            <div className="flex items-center gap-1">
              {languages.map((tag, idx) => {
                return <LangTags tag={tag} key={idx} />;
              })}
            </div>
          </div>
          <div className="mt-4 text-xs xl:text-sm 3xl:text-base">
            {item?.description} ....
            <AnchorLink
              href={item?.html_url || ''}
              target="_blank"
              className="inline font-bold underline"
            >
              Click to Read More
            </AnchorLink>
          </div>
        </div>
        <div className="flex h-full gap-6 rounded-lg bg-gray-900 py-3 px-6">
          <div className="flex flex-col items-center justify-between gap-1 text-sm xl:text-base 3xl:text-lg">
            <div className="flex h-8 w-8 items-center justify-center">
              <GithubIssueIcon />
            </div>
            <div>{item?.open_issues_count}</div>
          </div>
          <div className="flex flex-col items-center justify-between gap-1 text-sm xl:text-base 3xl:text-lg">
            <UserGroupIcon className="h-8 w-8" />
            <div>{item?.network_count}</div>
          </div>
          <div className="flex flex-col items-center justify-between gap-1 text-sm xl:text-base 3xl:text-lg">
            <StarIcon className="h-8 w-8" />
            <div>{item?.stargazers_count}</div>
          </div>
        </div>
      </AnchorLink>
    </>
  );
};

export default SpotlightProject;
