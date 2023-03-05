import React, { useState, useEffect } from 'react';
import { Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LinkIcon } from '@/components/icons/link-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import cn from 'classnames';

interface PRChekerProps {
  title: string;
  stakerConfidence: string;
  originality: string;
  author: string;
  link: string;
  checked: boolean;
}

export const PRCard: React.FC<PRChekerProps> = ({
  title,
  stakerConfidence,
  originality,
  author,
  link,
  checked,
}) => {
  return (
    <div
      className={cn(
        'flex h-52 w-full flex-col justify-between rounded-lg border border-gray-800 bg-dark p-4 shadow-xl',
        { 'border-3 border-blue-500': checked }
      )}
    >
      <div className="flex w-full justify-between">
        <div>{title.length > 60 ? title.slice(0, 60) + '...' : title}</div>
        <AnchorLink
          href={link || ''}
          target="_blank"
          className="ml-2 h-9 w-9 translate-x-2 -translate-y-2 rounded-full bg-gray-800 p-2"
        >
          <LinkIcon />
        </AnchorLink>
      </div>
      <div className="flex w-full flex-col">
        <div>Staker Confidence: {stakerConfidence}</div>
        <div>Originality: {originality}</div>
        <div>Author: {author}</div>
      </div>
    </div>
  );
};

interface PRSliderProps {
  PRs: any;
}

export default function PRSlider({ PRs }: PRSliderProps) {
  const [selectedPR, setSelectedPR] = useState<any>();
  const [totalVotes, setTotalVotes] = useState(1);
  useEffect(() => {
    const _totalVotes = PRs?.map(
      (item: any) => item?.issue_vote_amount
    )?.reduce((prev: number, next: number) => prev + next);
    setTotalVotes(_totalVotes);
  }, [PRs]);

  return (
    <div className="w-full">
      <Swiper
        modules={[Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={3}
        scrollbar={{ draggable: true }}
        observer={true}
        dir="ltr"
        className="[&_.swiper-scrollbar_>_.swiper-scrollbar-drag]:bg-body/50"
      >
        {PRs.map((PR: any, idx: number) => (
          <SwiperSlide key={idx} onClick={() => setSelectedPR(PR)}>
            <PRCard
              title={PR?.issue_title}
              stakerConfidence={
                Math.round((PR?.issue_vote_amount / totalVotes) * 10000) / 100 +
                '%'
              }
              originality={PR?.issue_originality_score}
              author={PR?.issue_pr_author}
              link={PR?.issue_pr_link}
              checked={selectedPR !== undefined ? PR == selectedPR : false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
