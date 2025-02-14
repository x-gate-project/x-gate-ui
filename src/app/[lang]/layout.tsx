import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { getWagmiConfig } from "../../wagmi.config";
import { Providers } from "./providers";

import "./globals.css";
import { SupportedLocale } from "../../dicts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-Gate",
  description: "X-Gate",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLocale }>;
}>) {
  const initialWagmiState = cookieToInitialState(
    getWagmiConfig(),
    (await headers()).get("cookie")
  );

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers initialWagmiState={initialWagmiState} params={params}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
