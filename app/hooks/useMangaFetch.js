// hooks/useMangaFetch.js
import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getFromStorage,
  saveToStorage,
  markAsFailed,
  clearFailure,
  TYPE_TTL_SECONDS,
} from '../util/MangaList/cache';

const buildCacheKey = (type, page) => `manga_${type}_${page}`;
const memoryCache = new Map();

export const fetchMangaType = async (type, page) => {
  const cacheKey = buildCacheKey(type, page);
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  const ttlMs = ttlSeconds * 1000;

  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    // Even with memory cache, check if it's stale
    const cacheTime = cached.__timestamp || 0;
    if (Date.now() - cacheTime < ttlMs) {
      return cached.data;
    }
  }

  // Check localStorage
  const cached = getFromStorage(cacheKey, ttlMs);
  if (cached) {
    memoryCache.set(cacheKey, { data: cached, __timestamp: Date.now() });
    return cached;
  }

  // Fetch fresh data
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const res = await fetch(`/api/manga/${type}?page=${page}`, { 
      signal,
      // Force no-cache to get fresh data from server
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      markAsFailed(cacheKey, `HTTP ${res.status}: ${errText}`);
      throw new Error(`Failed to fetch ${type} page ${page}: ${res.status}`);
    }

    const data = await res.json();
    saveToStorage(cacheKey, data);
    memoryCache.set(cacheKey, { data, __timestamp: Date.now() });
    return data;
  } catch (err) {
    markAsFailed(cacheKey, err);
    throw err;
  }
};

export const useMangaFetch = (type, page) => {
  const cacheKey = buildCacheKey(type, page);
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  
  // Shorter staleTime for better freshness
  const staleTime = ttlSeconds * 1000;
  const gcTime = Math.max(staleTime * 2, 1000 * 60 * 60);

  const query = useSuspenseQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime, // Data becomes stale after this time
    gcTime,
    refetchOnMount: false, // Don't refetch on mount—rely on staleTime
    refetchOnWindowFocus: true, // Background refetch if stale when tab regains focus
    refetchOnReconnect: false, // Skip on reconnect to avoid churn
    retry: 2,
    // IMPORTANT: Stale-while-revalidate pattern
    refetchInterval: false, // Don't poll, but allow background updates
    onError: (err) => {
      markAsFailed(cacheKey, err);
    },
    onSuccess: (data) => {
      clearFailure(cacheKey, data);
    },
  });

  // REMOVED: Background revalidation useEffect—let staleTime + refetchOnWindowFocus handle freshness without fighting hydration

  return query;
};