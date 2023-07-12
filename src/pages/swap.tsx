import { useState, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';

import SwapConsole from '@/components/swaps/SwapConsole';
import BuyConsole from '@/components/swaps/BuyConsole';

import mixpanel from 'mixpanel-browser';

const SwapPage: NextPageWithLayout = () => {
  mixpanel.track_pageview();

  const [consoleType, setConsoleType] = useState<'swap' | 'buy'>('swap');

  return (
    <>
      <NextSeo
        title="Swaps"
        description="DefiOS - Scaling Layer for Open Source Collaboration."
      />
      {consoleType === 'swap' && (
        <SwapConsole setConsoleType={setConsoleType} />
      )}
      {consoleType === 'buy' && <BuyConsole setConsoleType={setConsoleType} />}
    </>
  );
};

SwapPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SwapPage;
