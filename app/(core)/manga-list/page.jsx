// app/manga-list/page.tsx
import React from 'react';
import MangaListClient from './MangaListClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ai-mangareader.vercel.app';
  
  try {
    const res = await fetch(`${baseUrl}/api/manga/${type}?page=${page}`, {
      next: { 
        revalidate: ['favourite', 'latestArrivals', 'rating'].includes(type) ? 86400 : 3600 
      },
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
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });

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
      queryKey: ['manga', 'rating', 1],
      queryFn: () => fetchMangaType('rating', 1),
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'favourite', 1],
      queryFn: () => fetchMangaType('favourite', 1),
    }),
    queryClient.prefetchQuery({
      queryKey: ['manga', 'latestArrivals', 1],
      queryFn: () => fetchMangaType('latestArrivals', 1),
    }),
  ]);

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