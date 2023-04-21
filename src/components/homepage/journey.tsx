import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import { Check } from '@/components/icons/check';
import TopupButton from '../ui/topup-button';
import ButtonImg from '../custom/ButtonImg';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper';

interface CheckItemProps {
  label: string;
  checked: boolean;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, checked }) => {
  return (
    <div className="text-md flex w-full items-start gap-3">
      <div
        className={cn('flex h-6 w-6 items-center justify-center rounded-sm', {
          'bg-gray-700': !checked,
          'bg-new-blue': checked,
        })}
      >
        {checked && <Check />}
      </div>
      <div
        className={cn('w-full', {
          'text-gray-500 line-through': checked,
        })}
      >
        {label}
      </div>
    </div>
  );
};

type listData = {
  id: number;
  label: string;
  checked: boolean;
};

interface JourneyChecklistProps {
  items: listData[];
}

const JourneyChecklist: React.FC<JourneyChecklistProps> = ({ items }) => {
  return (
    <div className="flex flex w-full flex-col gap-5">
      {items.map((item: any, idx: number) => {
        return <CheckItem key={idx} label={item?.[0]} checked={item?.[1]} />;
      })}
    </div>
  );
};

interface JourneyProps {
  data: any;
  className?: string;
}

const Journey: React.FC<JourneyProps> = ({ className, data }) => {
  const [activeTab, setActiveTab] = useState('Developer');
  const [dataToShow, setDataToShow] = useState<any>([]);
  useEffect(() => {
    if (data === null || data === undefined) return;
    if (activeTab === 'Developer') {
      setDataToShow(data?.developer);
    } else if (activeTab === 'Maintainer') {
      setDataToShow(data?.maintainer);
    } else if (activeTab === 'Enterprise') {
      setDataToShow(data?.enterprise);
    }
  }, [activeTab, data]);
  return (
    <div
      className={cn(
        'fixed top-0 right-0 z-20 h-full w-[22rem] w-full max-w-full border-l border-dashed border-gray-700 pt-20',
        className
      )}
    >
      <Scrollbar style={{ height: 'calc(100%)' }}>
        <div className="h-screen w-full py-3 px-5">
          <div className="mb-2 flex w-full flex-col items-center gap-3 border-b border-dashed border-gray-700 pt-3 pb-8">
            <div className="flex flex-col items-center">
              <div>Lets Supercharge Open</div>
              <div>Source Collaboration Now</div>
            </div>
            <Link href="/projects" className="w-full">
              <TopupButton label="Support Existing Projects" />
            </Link>

            <div>OR</div>
            <Link href="/incentivize-contributors" className="w-full">
              <TopupButton
                label="Create New Project"
                className="border-white !bg-new-blue"
              />
            </Link>
          </div>
          <div className="flex w-full flex-col items-center px-1 py-2 pb-32">
            <div className="mb-4 text-lg">Choose Your Journey</div>
            <div className="mb-8 w-full pb-4">
              <Swiper
                modules={[A11y]}
                spaceBetween={5}
                slidesPerView={2}
                observer={true}
                dir="ltr"
              >
                <SwiperSlide>
                  <ButtonImg
                    active={activeTab === 'Developer'}
                    onClick={() => setActiveTab('Developer')}
                    image="Developer"
                    label="Developer"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <ButtonImg
                    active={activeTab === 'Maintainer'}
                    onClick={() => setActiveTab('Maintainer')}
                    image="Maintainer"
                    label="Maintainer"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <ButtonImg
                    active={activeTab === 'Enterprise'}
                    onClick={() => setActiveTab('Enterprise')}
                    image="Enterprise"
                    label="Enterprise"
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            <JourneyChecklist items={dataToShow} />
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};

export default Journey;
