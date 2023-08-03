import React from 'react';
import Head from 'next/head';

import Nav from '@/components/landing/Nav';
import JoinCommunityBtn from '@/components/landing/JoinCommunityBtn';
import HeaderLanding from '@/components/landing/HeaderLanding';
import HeaderScreen from '@/components/landing/HeaderScreen';
import TrustedPartners from '@/components/landing/TrustedPartners';
import Features from '@/components/landing/Features';
import RoadmapReimagined from '@/components/landing/RoadmapReimagined';
import ReapRewards from '@/components/landing/ReapRewards';
import LandingPreFooter from '@/components/landing/LandingPreFooter';
import LandingFooter from '@/components/landing/LandingFooter';

interface LandingProps {}

export const Landing: React.FC<LandingProps> = ({}) => {
  return (
    <>
      <Head>
        <title>DefiOS - Scaling Layer for Open Source Collaboration.</title>
      </Head>
      <div className="landing-font flex min-h-screen w-screen flex-col items-center overflow-y-auto overflow-x-hidden bg-[#060606]">
        <Nav />
        <div className="mt-20">
          <JoinCommunityBtn />
        </div>
        <HeaderLanding />
        <HeaderScreen />
        <TrustedPartners />
        <Features />
        <RoadmapReimagined />
        <ReapRewards />
        <LandingPreFooter />
        <LandingFooter />
      </div>
    </>
  );
};

export default Landing;
