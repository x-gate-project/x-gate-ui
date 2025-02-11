import 'moment-duration-format';
import React, { useCallback, useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import App, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { appWithTranslation, useTranslation } from 'next-i18next';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Collapse from '@mui/material/Collapse';

import theme from '~/styles/theme';
import { useStore } from '~/store/with-redux';
import { InitialState } from '~/store/configure-store';
import NProgress from 'nprogress';
import Router, { useRouter } from 'next/router';
import nextI18NextConfig from '../../next-i18next.config';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '~/styles/emotionCache';
import { TssCacheProvider } from 'tss-react';
import {
  GUWalletConnectorProvider,
  InjectedConnector,
  createClient,
  WalletConnectConnector,
} from '@gusdk/gu-wallet-connector';
import { getEnv } from '~/env';

let cachedClient: ReturnType<typeof createClient> | undefined = undefined;

const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = getEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');

const MyApp = ({
  Component,
  pageProps,
  emotionCache = createEmotionCache(),
}: AppProps & { emotionCache: EmotionCache }) => {
  const store = useStore(
    pageProps.initialReduxState ? JSON.parse(pageProps.initialReduxState) : InitialState,
  );
  const { t } = useTranslation();
  const router = useRouter();
  const [client] = useState(() => {
    if (!cachedClient) {
      cachedClient = createClient({
        connectors: [
          new InjectedConnector(),
          new WalletConnectConnector({
            options: {
              projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
            },
          }),
        ],
      });
    }
    return cachedClient;
  });

  const onRouteStart = useCallback(() => NProgress.start(), []);
  const onRouteDone = useCallback(() => NProgress.done(), []);

  useEffect(() => {
    Router.events.on('routeChangeStart', onRouteStart);
    Router.events.on('routeChangeComplete', onRouteDone);
    Router.events.on('routeChangeError', onRouteDone);

    return () => {
      Router.events.off('routeChangeStart', onRouteStart);
      Router.events.off('routeChangeComplete', onRouteDone);
      Router.events.off('routeChangeError', onRouteDone);
    };
  }, [onRouteStart, onRouteDone]);

  return (
    <React.Fragment>
      <Head>
        <title>{pageProps.title ? `${t(pageProps.title)} - USDTX` : 'USDTX'}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content="JOC Dashboard" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CacheProvider value={emotionCache}>
        <TssCacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              TransitionComponent={Collapse}
            >
              <Provider store={store}>
                <GUWalletConnectorProvider client={client}>
                  <Component {...pageProps} />
                </GUWalletConnectorProvider>
              </Provider>
            </SnackbarProvider>
          </ThemeProvider>
        </TssCacheProvider>
      </CacheProvider>
    </React.Fragment>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
  };
};

export default appWithTranslation(MyApp as any, nextI18NextConfig);
