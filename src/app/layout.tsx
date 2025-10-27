import { metadata } from "@/base/meta/Metadata";

metadata.manifest = "/manifest.json";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

import { poppins, spaceGrotesk } from "@/base/fonts/Fonts";

import "@/base/style/globals.css";

import { GoogleTagManager, GoogleTagManagerNoScript } from '@/base/analytics/GoogleTagManager'

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const BASE_URL = getBaseUrl();
  const breadcrumbItems = [
    { name: "Beranda", item: BASE_URL }
  ];

  return (
    <html lang="id">
      <head>
        <GoogleTagManager />
        <BreadcrumbJsonLd items={breadcrumbItems} />
      </head>
      <body
        className={`${poppins.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <GoogleTagManagerNoScript />
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}
