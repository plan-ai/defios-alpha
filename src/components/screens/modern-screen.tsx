/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo';
import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@/components/ui/button/button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectUserMapping, getUserMapping } from '@/store/userMappingSlice';
import { useEffect, useState } from 'react';

import TopTokenFeedSlider from '@/components/homepage/top-token-feed';
import OpenIssuesTable from '@/components/homepage/open-issues-table';

import RoadmapCard from '@/components/roadmaps/roadmap-card';
import ListCard from '@/components/ui/list-card';

import TopProjectCard from '@/components/homepage/top-project-card';

import OverviewChart from '@/components/ui/chats/overview-chart';

import axios from 'axios';
import Spinner from '../custom/spinner';
import Journey from '@/components/homepage/journey';
import { setConnection, setSigner } from '@/lib/helpers/wallet';

export default function ModernScreen() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);
  const dispatch = useAppDispatch();

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
        description="Defios - Tokenize your Open Source Project."
      />
      {!isLoading && homeData !== null && (
        <>
          <div className="flex h-full w-[57vw] flex-col items-center justify-center gap-5">
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
          <Journey data={homeData?.paths} />
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
