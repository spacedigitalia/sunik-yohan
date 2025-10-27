import { metadata } from "@/base/meta/Metadata";

metadata.manifest = "/manifest.json";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

import { poppins, spaceGrotesk } from "@/base/fonts/Fonts";

import "@/base/style/globals.css";

import { GoogleTagManager, GoogleTagManagerNoScript } from '@/base/analytics/GoogleTagManager'

export { metadata };

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://spacedigitalia.my.id" },
      { "@type": "ListItem", "position": 2, "name": "About", "item": "https://spacedigitalia.my.id/about" },
      { "@type": "ListItem", "position": 3, "name": "Products", "item": "https://spacedigitalia.my.id/products" },
      { "@type": "ListItem", "position": 4, "name": "Gallery", "item": "https://spacedigitalia.my.id/gallery" },
      { "@type": "ListItem", "position": 5, "name": "Blog", "item": "https://spacedigitalia.my.id/blog" }
    ]
  }
  return (
    <html lang="id">
      <head>
        <GoogleTagManager />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd)
          }}
          strategy="afterInteractive"
        />
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
