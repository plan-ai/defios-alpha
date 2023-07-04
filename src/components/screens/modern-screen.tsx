/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo';
import { useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';

import TopTokenFeedSlider from '@/components/homepage/top-token-feed';
import OpenIssuesTable from '@/components/homepage/open-issues-table';

import RoadmapCard from '@/components/roadmaps/roadmap-card';
import ListCard from '@/components/ui/list-card';

import TopProjectCard from '@/components/homepage/top-project-card';

import OverviewChart from '@/components/ui/chats/overview-chart';

import axios from '@/lib/axiosClient';
import Spinner from '../custom/spinner';
// import Journey from '@/components/homepage/journey';

export default function ModernScreen() {
  const [homeData, setHomeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === '') return;
    setIsLoading(true);
    axios
      .get('https://api-v1.defi-os.com/home', {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setHomeData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [firebase_jwt]);
  return (
    <>
      <NextSeo
        title="DefiOS"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      {!isLoading && homeData !== null && (
        <>
          {/* w-73% with journey */}
          <div className="flex w-full w-full flex-col items-center justify-center gap-5">
            <div className="w-full">
              <TopTokenFeedSlider TopTokenFeeds={homeData?.tokens} />
            </div>
            <OpenIssuesTable data={homeData?.issues} />
            <div className="grid w-full grid-cols-3 gap-3">
              <TopProjectCard
                item={homeData?.projects}
                className="scale-y-90"
              />
              <div className="relative">
                <RoadmapCard item={homeData?.roadmap} className="scale-y-90" />
                <ListCard
                  item={{
                    name: '🔥 Hot',
                  }}
                  className="absolute top-28 right-3 rounded-full border-2 border-gray-700 bg-dark p-2 pr-4 text-white"
                />
              </div>
              <OverviewChart className="scale-y-90" />
            </div>
          </div>
          {/* <Journey data={homeData?.paths} /> */}
        </>
      )}
      {isLoading && (
        <div className="mt-20 flex h-full w-full items-center justify-center">
          <Spinner label="Fetching Homepage Data..." />
        </div>
      )}
    </>
  );
}
