/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectUserMapping, getUserMapping } from '@/store/userMappingSlice';
import { useEffect } from 'react';

import TopTokenFeedSlider from '@/components/homepage/top-token-feed';
import OpenIssuesTable from '@/components/homepage/open-issues-table';
import { priceFeedData } from '@/data/static/price-feed-retro';

import RoadmapCard from '@/components/roadmaps/roadmap-card';
import { RoadmapList } from '@/data/static/roadmap-list';
import ListCard from '@/components/ui/list-card';

import { profileProjects } from '@/data/static/profile-projects';
import TopProjectCard from '@/components/homepage/top-project-card';

import OverviewChart from '@/components/ui/chats/overview-chart';

import Journey from '@/components/homepage/journey';

export default function ModernScreen() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //@ts-ignore
    if (
      //@ts-ignore
      session?.user?.id &&
      wallet.publicKey &&
      //@ts-ignore
      session?.accessToken &&
      !userMappingState.isLoading
    ) {
      dispatch(
        getUserMapping({
          //@ts-ignore
          userID: session?.user.id,
          //@ts-ignore
          accessToken: session?.accessToken,
          userPubkey: wallet.publicKey.toBase58(),
        })
      );
    }
    //@ts-ignore
  }, [wallet.publicKey, session?.accessToken, session?.user.id]);
  return (
    <>
      <NextSeo
        title="DefiOS"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="flex h-full w-[57vw] flex-col items-center justify-center gap-5">
        <div className="w-full">
          <TopTokenFeedSlider TopTokenFeeds={priceFeedData} />
        </div>
        <OpenIssuesTable />
        <div className="grid w-full grid-cols-3 gap-3">
          <TopProjectCard item={profileProjects[0]} className="scale-y-90" />
          <div className="relative">
            <RoadmapCard
              name={RoadmapList[0].name}
              image={RoadmapList[0].image}
              creator={RoadmapList[0].creator}
              creatorImage={RoadmapList[0].creatorImage}
              totalStake={RoadmapList[0].totalStake}
              creationDate={RoadmapList[0].creationDate}
              details={RoadmapList[0].details}
              deliverable={RoadmapList[0].deliverable}
              status={RoadmapList[0].status}
              activeObjectives={RoadmapList[0].activeObjectives}
              className="scale-y-90"
            />
            <ListCard
              item={{
                name: '🔥 Hot',
              }}
              className="absolute top-9 right-3 rounded-full bg-black p-2 pr-4 text-white"
            />
          </div>
          <OverviewChart className="scale-y-90" />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-10">
        </div>
      </div>
      <Journey />
    </>
  );
}
