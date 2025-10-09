import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { getWagmiConfig } from "../../wagmi/config";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TDPV5S3X');`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TDPV5S3X"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <Providers initialWagmiState={initialWagmiState} params={params}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
