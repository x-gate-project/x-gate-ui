"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SnackbarProvider, useSnackbar } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import { ConnectKitProvider } from "connectkit";
import theme from "../../theme.config";
import { getWagmiConfig } from "../../wagmi.config";
import { DictProvider } from "@/contexts/DictContext";
import { SupportedLocale } from "../../dicts";
import { TransactionStateProvider } from "@/contexts/TransactionStateContext";

type Props = {
  children: ReactNode;
  initialWagmiState: State | undefined;
  params: Promise<{ lang: SupportedLocale }>;
};

export function Providers({ children, initialWagmiState, params }: Props) {
  const [config] = useState(() => getWagmiConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppRouterCacheProvider>
        <DictProvider params={params}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <WagmiProvider config={config} initialState={initialWagmiState}>
              <TransactionStateProvider>
                <QueryClientProvider client={queryClient}>
                  <ConnectKitProvider>{children}</ConnectKitProvider>
                </QueryClientProvider>
              </TransactionStateProvider>
            </WagmiProvider>
          </SnackbarProvider>
          </ThemeProvider>
        </DictProvider>
    </AppRouterCacheProvider>
  );
}
