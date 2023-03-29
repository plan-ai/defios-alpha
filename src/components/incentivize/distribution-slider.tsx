import React, { useState, useRef, useEffect } from 'react';
import { Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import DistributionModal from '@/components/incentivize/distributionModal';
import Image from 'next/image';

import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setDistribution } from '@/store/creationSlice';

import Spinner from '@/components/custom/spinner';

import {
  CodeContributorStats,
  OptionRepoOwner,
  CodeDurationStats,
} from '@/utils/contributorStats';

interface DistributionCardProps {
  data: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
}

export const DistributionCard: React.FC<DistributionCardProps> = ({
  setModalOpen,
  setEditData,
  data,
}) => {
  const [share, setShare] = useState('0%');
  const Contributors = useAppSelector(
    (state) => state.creation.step3.distribution
  );

  useEffect(() => {
    if (Contributors === null) return;
    setShare(
      Math.round(parseFloat(Contributors[`${data.login}`]) * 100) / 100 + '%'
    );
  }, [Contributors, setShare]);

  return (
    <div
      className={cn(
        'flex h-20 w-full flex-row items-center justify-between rounded-lg border border-gray-800 bg-dark p-4 shadow-xl'
      )}
      onClick={() => {
        setEditData(data);
        setModalOpen(true);
      }}
    >
      <div className="flex flex-row items-center">
        <div className="mr-4 h-12 w-12 rounded-full bg-black">
          <Image
            src={data.avatar_url || ''}
            alt={data.login || ''}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div>{data.login}</div>
        </div>
      </div>
      <div>{share}</div>
    </div>
  );
};

interface DistributionSliderProps {}

const DistributionSlider: React.FC<DistributionSliderProps> = ({}) => {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();
  const Algo = useAppSelector((state) => state.creation.step3.algorithm);
  const repoFullName = useAppSelector((state) => state.creation.step2.repoName);
  const Contributors = useAppSelector(
    (state) => state.creation.step3.distribution
  );
  const [MainDistribution, setMainDistribution] = useState('30');
  const [isLoading, setIsLoading] = useState(true);

  const [fetchData, setFetchData] = useState<any>([]);
  const [editData, SetEditData] = useState<any>();

  const [modalOpen, setModalOpen] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const myInfo = useAppSelector((state) => state.userInfo.githubInfo);

  useClickAway(modalContainerRef, () => {
    setModalOpen(false);
  });
  useLockBodyScroll(modalOpen);

  const FetchContributors = async () => {
    const resp = await fetch(
      `https://api.github.com/repos/${repoFullName}/stats/contributors`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setFetchData(resp);

    if (Object.keys(resp).length === 0) return;
    console.log('emptyReturn');
    let isContributor = false;
    let isCollaborator = false;
    for (let i = 0; i < resp.length; i++) {
      if (myInfo.login === repoFullName.split('/')[0]) {
        isCollaborator = true;
        if (isContributor) {
          break;
        }
      }
      if (myInfo.login === myInfo.login) {
        isContributor = true;
        if (isCollaborator) {
          break;
        }
      }
    }
    if (!isContributor) {
      const weekData = [];
      for (let i = 0; i < resp[0].weeks.length; i++) {
        const _data = resp[0].weeks[i];
        _data.c = 0;
        _data.a = 0;
        _data.d = 0;
        weekData.push(_data);
      }
      resp.push({
        total: 0,
        weeks: weekData,
        author: {
          login: myInfo.login,
          id: myInfo.id,
          avatar_url: myInfo.avatar_url,
        },
      });
    }

    setFetchData(resp);
    setIsLoading(false);

    const distributionInit: any = {};
    resp.forEach((el: any) => {
      const contri = el?.author?.login;
      distributionInit[`${contri}`] = '0%';
    });
    setIsLoading(false);
    dispatch(setDistribution(distributionInit));
  };

  const AlgoOwner = () => {
    const newData = OptionRepoOwner(
      repoFullName,
      fetchData,
      MainDistribution,
      myInfo.login
    );
    dispatch(setDistribution(newData));
  };

  const AlgoCode = () => {
    const newData = CodeContributorStats(fetchData, MainDistribution);
    dispatch(setDistribution(newData));
  };

  const AlgoDuration = () => {
    const newData = CodeDurationStats(fetchData, MainDistribution);
    dispatch(setDistribution(newData));
  };

  useEffect(() => {
    if (
      session &&
      (session as any)?.accessToken &&
      (fetchData === null ||
        fetchData === undefined ||
        Object.keys(fetchData).length === 0)
    ) {
      setIsLoading(true);
      FetchContributors();
    } else {
      if (Algo === 'Repository creator') {
        AlgoOwner();
      } else if (Algo === 'By amount of code contributed (minified)') {
        AlgoCode();
      } else if (
        Algo === 'By duration of project involvement (compute intensive)'
      ) {
        AlgoDuration();
      }
    }
  }, [session, Algo, fetchData]);

  return (
    <div className="w-full">
      {!isLoading && (
        <Swiper
          modules={[Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={3}
          scrollbar={{ draggable: true }}
          observer={true}
          dir="ltr"
          className="[&_.swiper-scrollbar_>_.swiper-scrollbar-drag]:bg-body/50"
        >
          {fetchData !== null &&
            fetchData !== undefined &&
            Object.keys(fetchData).length !== 0 &&
            fetchData?.map((item: any, idx: number) => {
              return (
                <SwiperSlide key={idx}>
                  <DistributionCard
                    setModalOpen={setModalOpen}
                    setEditData={SetEditData}
                    data={item.author}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>
      )}
      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <Spinner />
        </div>
      )}
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
