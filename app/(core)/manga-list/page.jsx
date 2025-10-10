// app/manga-list/page.jsx
import React from 'react';
import MangaListClient from './MangaListClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { TYPE_TTL_SECONDS } from '../../util/MangaList/cache';

export const metadata = {
  title: 'Manga List - Discover Latest Manga | AI Manga Reader',
  description: 'Browse the latest manga releases, top-rated series, and fan favorites. Read manga with OCR translation and TTS.',
  openGraph: {
    title: 'Manga List - AI Manga Reader',
    description: 'Browse latest manga, manhwa and manhua with AI-powered features',
    url: 'https://ai-mangareader.vercel.app/manga-list',
  },
};

async function fetchMangaType(type, page) {
  const headersList = await headers();
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const host = headersList.get('host') || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;

  try {
    const res = await fetch(`${baseUrl}/api/manga/${type}?page=${page}`, {
      next: { revalidate: ttlSeconds },
      // Add cache headers
      headers: {
        'Cache-Control': `public, max-age=${ttlSeconds}`,
      },
    });

    if (!res.ok) {
      console.warn(`Failed to prefetch ${type}:`, res.status);
      return null; // Return null instead of error object
    }

    return res.json();
  } catch (error) {
    console.error(`Error prefetching ${type}:`, error);
    return null;
  }
}

async function prefetchData() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Match the staleTime with TTL for consistency
        staleTime: 30 * 60 * 1000, // 30 minutes default
        gcTime: 60 * 60 * 1000, // 1 hour
        retry: 1,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  // Prefetch critical above-fold data
  const criticalPrefetches = [
    queryClient.prefetchQuery({
      queryKey: ['manga', 'random', 1],
      queryFn: () => fetchMangaType('random', 1),
      staleTime: TYPE_TTL_SECONDS.random * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'latest', 1],
      queryFn: () => fetchMangaType('latest', 1),
      staleTime: TYPE_TTL_SECONDS.latest * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'latestArrivals', 1],
      queryFn: () => fetchMangaType('latestArrivals', 1),
      staleTime: TYPE_TTL_SECONDS.latestArrivals * 1000,
    }),
  ];

  await Promise.allSettled(criticalPrefetches);

  // Start below-fold prefetch (non-blocking)
  Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['manga', 'rating', 1],
      queryFn: () => fetchMangaType('rating', 1),
      staleTime: TYPE_TTL_SECONDS.rating * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'favourite', 1],
      queryFn: () => fetchMangaType('favourite', 1),
      staleTime: TYPE_TTL_SECONDS.favourite * 1000,
    }),
  ]).catch(() => {});

  return dehydrate(queryClient);
}

export default async function MangaListPage() {
  const dehydratedState = await prefetchData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MangaListClient />
    </HydrationBoundary>
  );
}