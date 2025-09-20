/* eslint-disable @next/next/no-sync-scripts */
// RootLayout.tsx (server component)
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
const AnalyticsClient = dynamic(() => import("./Components/AnalyticsClient"));
const BASE_URL = "https://ai-manga-reader.onrender.com"; // <- set your canonical site URL
const SITE_NAME = "AI Manga Reader";
const DEFAULT_TITLE = "AI Manga Reader — Read Manga, Manhwa & Manhua with OCR & TTS";
const DEFAULT_DESCRIPTION =
  "AI Manga Reader: Browse, read, translate and listen to manga, manhwa and manhua. OCR translations, TTS, MangaDex integration, Latest Activity feed, and multiple reading modes.";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": BASE_URL,
    "name": SITE_NAME,
    "description": DEFAULT_DESCRIPTION,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Primary meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta name="keywords" content="manga, manhwa, manhua, manga reader, OCR, translation, TTS, MangaDex, read manga online, manga list" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="canonical" href={BASE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:image" content={`${BASE_URL}/logo.svg`} />
        <meta property="og:image:alt" content="AI Manga Reader — Read and Translate Manga" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AIMangaReader" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={`${BASE_URL}/logo.svg`} />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon & icons (place files in public/) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg`" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Hreflang hints (set more if you support localized sites) */}
        <link rel="alternate" href={BASE_URL} hrefLang="en" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          // safe to place stringified JSON in layout head
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* optional analytics scripts can go here; ensure privacy/compliance */}
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
        <GoogleAnalytics gaId="G-KNS1W3ZXQQ" />
      </body>
    </html>
  );
}