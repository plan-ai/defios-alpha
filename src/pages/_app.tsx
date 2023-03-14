import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import Head from 'next/head';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import WalletContextProvider from '@/components/wallet/WalletContextProvider';
import { SessionProvider } from 'next-auth/react';
// base css file
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';
import { Provider } from 'react-redux';
import store from '../store/store';

import '../utils/firebase';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  //could remove this if you don't need to page level layout
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <title>DefiOS - Scaling Layer for Open Source Collaborations.</title>
      </Head>
      <Provider store={store}>
        <SessionProvider session={session}>
          <WalletContextProvider>
            {getLayout(<Component {...pageProps} />)}
            <ModalsContainer />
            <DrawersContainer />
          </WalletContextProvider>
        </SessionProvider>
      </Provider>
    </>
  );
}

export default CustomApp;
