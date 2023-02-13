import React, { useState, useRef } from 'react';
import { Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import DistributionModal from './distributionModal';

interface DistributionCardProps {
  username: string;
  address: string;
  split: number;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditData: React.Dispatch<React.SetStateAction<string>>;
}

const distributionData = [
  {
    username: 'Rohitkk432',
    address: '0xA7b933...090ed028',
    split: 25,
  },
  {
    username: 'never2average',
    address: '0xA7b933...090ed028',
    split: 25,
  },
  {
    username: 'AbhisekBasu1',
    address: '0xA7b933...090ed028',
    split: 25,
  },
  {
    username: 'Mayank',
    address: '0xA7b933...090ed028',
    split: 25,
  },
];

export const DistributionCard: React.FC<DistributionCardProps> = ({
  setModalOpen,
  setEditData,
  username,
  address,
  split,
}) => {
  return (
    <div
      className={cn(
        'flex h-20 w-full flex-row items-center justify-between rounded-lg border border-gray-800 bg-dark p-4 shadow-xl'
      )}
      onClick={() => {
        setEditData(username);
        setModalOpen(true);
      }}
    >
      <div className="flex flex-row items-center">
        <div className="mr-4 h-12 w-12 rounded-full bg-black"></div>
        <div className="flex flex-col gap-1 text-sm">
          <div>{username}</div>
          <div>{address}</div>
        </div>
      </div>
      <div>{split}%</div>
    </div>
  );
};

interface DistributionSliderProps {}

const DistributionSlider: React.FC<DistributionSliderProps> = ({}) => {
  const [data, setData] = useState(distributionData);
  const [editData, SetEditData] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setModalOpen(false);
  });
  useLockBodyScroll(modalOpen);
  const sliderBreakPoints = {
    640: {
      slidesPerView: 3,
      spaceBetween: 10,
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
        {data.length !== 0 &&
          data.map((item, idx) => (
            <SwiperSlide key={idx}>
              <DistributionCard
                setModalOpen={setModalOpen}
                setEditData={SetEditData}
                username={item.username}
                address={item.address}
                split={item.split}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
          >
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-full align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              ref={modalContainerRef}
              className="inline-block text-left align-middle"
            >
              <div className="h-[35vh] w-[30vw] rounded-2xl bg-dark">
                <DistributionModal
                  modalOpen={modalOpen}
                  setModalOpen={setModalOpen}
                  data={data}
                  setData={setData}
                  editData={editData}
                  setEditData={SetEditData}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DistributionSlider;
