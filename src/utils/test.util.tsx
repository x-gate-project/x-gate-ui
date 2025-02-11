import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProviderProps } from '@mui/material/styles/ThemeProvider';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';
import { IpfsGatewaysProvider } from '@gu-corp/react-ipfs-media';
import {
  GUWalletConnectorProvider,
  createClient,
  InjectedConnector,
} from '@gusdk/gu-wallet-connector';
import theme from '~/styles/theme';
import {
  Provider as ReactReduxProvider,
  ProviderProps as ReactReduxProviderProps,
} from 'react-redux';
import { configureStore } from '~/store/configure-store';
import { SnackbarProvider, SnackbarProviderProps } from 'notistack';
import Collapse from '@mui/material/Collapse';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider, I18nextProviderProps } from 'react-i18next';
import commonEn from '~/../public/locales/en/common.json';
import commonJa from '~/../public/locales/ja/common.json';

interface RenderOptionsType extends Omit<RenderOptions, 'wrapper'> {
  mockedProviderProps?: MockedProviderProps;
  themeProviderProps?: ThemeProviderProps;
  reactReduxProviderProps?: ReactReduxProviderProps;
  snackbarProviderProps?: SnackbarProviderProps;
  i18nProviderProps?: I18nextProviderProps;
}
const client = createClient({
  connectors: [new InjectedConnector()],
});

const customRender = (
  ui: ReactElement,
  {
    mockedProviderProps,
    themeProviderProps,
    reactReduxProviderProps,
    snackbarProviderProps,
    i18nProviderProps,
    ...renderOptions
  }: RenderOptionsType = {},
) => {
  const AllTheProviders: React.FC = ({ children }) => {
    return (
      <I18nextProvider i18n={i18n} {...i18nProviderProps}>
        <MockedProvider {...mockedProviderProps}>
          <ThemeProvider theme={theme} {...themeProviderProps}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              TransitionComponent={Collapse}
              autoHideDuration={3000}
              {...snackbarProviderProps}
            >
              <IpfsGatewaysProvider>
                <ReactReduxProvider store={configureStore()} {...reactReduxProviderProps}>
                  <GUWalletConnectorProvider client={client}>{children}</GUWalletConnectorProvider>
                </ReactReduxProvider>
              </IpfsGatewaysProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </MockedProvider>
      </I18nextProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  react: {
    useSuspense: true,
  },
  keySeparator: '.',
  resources: {
    en: {
      common: commonEn,
    },
    ja: {
      common: commonJa,
    },
  },
});

export { customRender, i18n as customI18n };
