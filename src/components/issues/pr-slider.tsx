import React from 'react';
import { Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LinkIcon } from '@/components/icons/link-icon';
import AnchorLink from '@/components/ui/links/anchor-link';

export type PRCardProps = {
  title: string;
  stakerConfidence: string;
  originality: string;
  author: string;
  link: string;
};

export const PRCard: React.FC<PRCardProps> = ({
  title,
  stakerConfidence,
  originality,
  author,
  link,
}) => {
  return (
    <div className="flex h-52 w-full flex-col justify-between rounded-lg border border-gray-800 bg-dark p-4 shadow-xl">
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
  PRs: PRCardProps[];
}

export default function PRSlider({ PRs }: PRSliderProps) {
  const sliderBreakPoints = {
    640: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  };

  return (
    <div className="w-full">
      <Swiper
        modules={[Scrollbar, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        breakpoints={sliderBreakPoints}
        observer={true}
        dir="ltr"
        className="[&_.swiper-scrollbar_>_.swiper-scrollbar-drag]:bg-body/50"
      >
        {PRs.map((PR, idx) => (
          <SwiperSlide key={idx}>
            <PRCard
              title={PR.title}
              stakerConfidence={PR.stakerConfidence}
              originality={PR.originality}
              author={PR.author}
              link={PR.link}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
