// hooks/useMangaFetch.js
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  getFromStorage,
  saveToStorage,
  markAsFailed,
  clearFailure,
  isCacheStale,
  TYPE_TTL_SECONDS,
} from '../util/MangaList/cache';

const buildCacheKey = (type, page) => `manga_${type}_${page}`;

export const fetchMangaType = async (type, page) => {
  const cacheKey = buildCacheKey(type, page);
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  const ttlMs = ttlSeconds * 1000;

  // Check cache first
  const cached = getFromStorage(cacheKey, ttlMs);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  try {
    const res = await fetch(`/api/manga/${type}?page=${page}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      markAsFailed(cacheKey, `HTTP ${res.status}: ${errText}`);
      throw new Error(`Failed to fetch ${type} page ${page}: ${res.status}`);
    }

    const data = await res.json();
    saveToStorage(cacheKey, data);
    return data;
  } catch (err) {
    markAsFailed(cacheKey, err);
    throw err;
  }
};

export const useMangaFetch = (type, page) => {
  const cacheKey = buildCacheKey(type, page);
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  const ttlMs = ttlSeconds * 1000;

  // Track if this is the initial mount
  const isInitialMount = useRef(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Check if cache is stale on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Check if we need to refetch in background
      if (typeof window !== 'undefined') {
        const isStale = isCacheStale(cacheKey, ttlMs);
        if (isStale) {
          // Delay refetch slightly to avoid blocking initial render
          setTimeout(() => setShouldRefetch(true), 100);
        }
      }
    }
  }, [cacheKey, ttlMs]);

  const query = useQuery({
  queryKey: ['manga', type, page],
  queryFn: () => fetchMangaType(type, page),
  
  staleTime: ttlMs,
  gcTime: Math.max(ttlMs * 2, 1000 * 60 * 60),
  
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  
  retry: 2,
  retryDelay: 1000,
  
  // CRITICAL: These prevent hydration issues
  initialData: () => {
    if (typeof window === 'undefined') return undefined;
    return getFromStorage(cacheKey, ttlMs);
  },
  
  initialDataUpdatedAt: () => {
    if (typeof window === 'undefined') return 0;
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return 0;
    try {
      const entry = JSON.parse(raw);
      return entry.timestamp || 0;
    } catch {
      return 0;
    }
  },
         onError: (err) => {
      markAsFailed(cacheKey, err);
    },
    onSuccess: (data) => {
      clearFailure(cacheKey, data);
    },
  // Add these to prevent suspense throwing
  throwOnError: false,
  notifyOnChangeProps: ['data', 'error'],
});

  // Background refetch if needed (won't trigger suspense)
  useEffect(() => {
  if (shouldRefetch && !query.isFetching) {
    query.refetch();
    setShouldRefetch(false);
  }
}, [shouldRefetch, query]);

// Return modified query result to hide background loading
return {
  ...query,
  // Override isLoading to only be true when we have NO data at all
  isLoading: query.isLoading && !query.data,
  // Keep isFetching for optional loading indicators
  isFetching: query.isFetching,
};
};