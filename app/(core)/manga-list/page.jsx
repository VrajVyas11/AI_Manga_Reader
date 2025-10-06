// app/manga-list/page.tsx
import React from 'react';
import MangaListClient from './MangaListClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Manga List - Discover Latest Manga | AI Manga Reader',
  description: 'Browse the latest manga releases, top-rated series, and fan favorites. Read manga with OCR translation and TTS.',
  openGraph: {
    title: 'Manga List - AI Manga Reader',
    description: 'Browse latest manga, manhwa and manhua with AI-powered features',
    url: 'https://ai-mangareader.vercel.app/manga-list',
  },
};

// Import TTLs for server-side revalidation alignment
import { TYPE_TTL_SECONDS } from '../../util/MangaList/cache'; // Adjust path if needed

async function fetchMangaType(type, page) {
  const headersList = await headers();
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const host = headersList.get('host') || 'localhost:3000';
  const baseUrl = `${proto}://${host}`;

  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;

  try {
    const res = await fetch(`${baseUrl}/api/manga/${type}?page=${page}`, {
      next: { revalidate: ttlSeconds }, // Align with TTL—caches server fetch for full duration
    });

    if (!res.ok) {
      console.warn(`Failed to prefetch ${type}:`, res.status);
      return { data: [], error: `HTTP ${res.status}` };
    }

    return res.json();
  } catch (error) {
    console.error(`Error prefetching ${type}:`, error);
    return { data: [], error: String(error) };
  }
}

async function prefetchData() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes for faster updates (overridable per-query)
        retry: 1,
      },
    },
  });

  // Only prefetch critical above-fold data
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['manga', 'random', 1],
      queryFn: () => fetchMangaType('random', 1),
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'latest', 1],
      queryFn: () => fetchMangaType('latest', 1),
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'latestArrivals', 1],
      queryFn: () => fetchMangaType('latestArrivals', 1),
    }),
  ]);

  // Prefetch below-fold data but don't block
  Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['manga', 'rating', 1],
      queryFn: () => fetchMangaType('rating', 1),
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'favourite', 1],
      queryFn: () => fetchMangaType('favourite', 1),
    }),
  ]).catch(() => {}); // Silent catch

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