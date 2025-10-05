// app/layout.tsx
import React, { Suspense } from "react";
import TanstackProvider from "@/app/providers/TanstackProvider";
import { MangaProvider } from "@/app/providers/MangaContext";
import LoadingSpinner from "./Components/LoadingSpinner";
import "./globals.css";
import TopNavbar from "./Components/TopNavbar";
import { ThemeProviderClient } from "./providers/ThemeProviderClient";
import { PreferencesProvider } from "./providers/PreferencesContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import {getMeasurementId} from "./lib/gtag"
// Dynamic import with proper loading state
const AnalyticsClient = dynamic(() => import("./Components/AnalyticsClient"));

const BASE_URL = "https://ai-mangareader.vercel.app";
const SITE_NAME = "AI Manga Reader";
const DEFAULT_TITLE = "AI Manga Reader — Read Manga, Manhwa & Manhua with OCR & TTS";
const DEFAULT_DESCRIPTION =
  "AI Manga Reader: Browse, read, translate and listen to manga, manhwa and manhua. OCR translations, TTS, MangaDex integration, Latest Activity feed, and multiple reading modes.";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | AI Manga Reader',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: "manga, manhwa, manhua, manga reader, OCR, translation, TTS, MangaDex, read manga online, manga list",
  authors: [{ name: "AI Manga Reader" }],
  creator: "AI Manga Reader",
  publisher: "AI Manga Reader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/logo.svg`,
        width: 1200,
        height: 630,
        alt: "AI Manga Reader — Read and Translate Manga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: "@AIMangaReader",
    images: [`${BASE_URL}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: BASE_URL,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://mangadex.org" />
        <link rel="dns-prefetch" href="https://uploads.mangadex.org" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body cz-shortcut-listen="true">
        <Suspense fallback={<LoadingSpinner text="Please Wait..." />}>
          <TanstackProvider>
            <MangaProvider>
              <ThemeProviderClient>
                <PreferencesProvider>
                  <TopNavbar />
                  <AnalyticsClient />
                  {children}
                </PreferencesProvider>
              </ThemeProviderClient>
            </MangaProvider>
          </TanstackProvider>
        </Suspense>
        <GoogleAnalytics gaId={getMeasurementId()} />
      </body>
    </html>
  );
}