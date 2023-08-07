import React, { useState, useEffect } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import Image from '@/components/ui/image';
import { Verified } from '@/components/icons/verified';
import MarkdownRenderer from '@/components/ui/markdown';
import axios from '@/lib/axiosClient';
import AnchorLink from '@/components/ui/links/anchor-link';

interface LearnContentProps {
  item: any;
}

const LearnContent: React.FC<LearnContentProps> = ({ item }) => {
  const [videoDuration, setVideoDuration] = useState('');

  useEffect(() => {
    if (item === null || item === undefined) return;
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${item.id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API}`
      )
      .then((res) => {
        const durationRaw = res?.data?.items?.[0]?.contentDetails?.duration;
        const formattedDuration = durationRaw
          .split(/[a-zA-Z]/)
          .filter((i: string) => i !== '')
          .join(':');
        setVideoDuration(formattedDuration);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [item]);

  return (
    <>
      <div className="gradient-border-box-hover flex w-full items-start justify-between gap-5 rounded-lg border border-gray-700 bg-body p-3 lg:border-2 xl:p-3.5 3xl:p-4">
        <AnchorLink
          href={item.id ? `https://www.youtube.com/watch?v=${item.id}` : '#'}
          target="_blank"
          className="relative flex h-[8rem] w-[22rem] overflow-hidden rounded-xl"
        >
          <Image
            src={item?.mediumThumbnail || ''}
            alt="content image"
            fill
            className="object-cover"
          />
        </AnchorLink>
        <div className="mt-2 flex w-full flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="mr-2 text-base font-semibold xl:text-lg 3xl:text-xl">
              {item?.title}
            </div>
          </div>
          {/* <div className="my-1 flex items-center gap-2">
            <div className="mr-2">Learning Objectives:</div>
            <div className="inline-flex items-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
              Solana
              <Verified className="ml-1 h-5 w-5" />
            </div>
            <div className="inline-flex items-center text-xs text-gray-400 xl:text-sm 3xl:text-base">
              Anchor
              <Verified className="ml-1 h-5 w-5" />
            </div>
          </div> */}
          {item?.description.length > 0 && (
            <MarkdownRenderer>{item?.description}</MarkdownRenderer>
          )}
        </div>
        <AnchorLink
          href={item.id ? `https://www.youtube.com/watch?v=${item.id}` : '#'}
          target="_blank"
          className="mt-2 flex h-full gap-6 whitespace-nowrap rounded-lg bg-gray-900 py-3 px-6"
        >
          <div className="flex flex-col items-center justify-between gap-2 text-sm xl:text-base 3xl:text-lg">
            <div className="flex h-8 w-8 items-center justify-center">
              <PlayIcon className="h-8 w-8" />
            </div>
            <div>{videoDuration}</div>
          </div>
        </AnchorLink>
      </div>
    </>
  );
};

export default LearnContent;
