// hooks/useMangaFetch.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getFromStorage,
  getRawFromStorage,
  saveToStorage,
  markAsFailed,
  clearFailure,
  // also export helper to get TTL map
  TYPE_TTL_SECONDS,
} from '../util/MangaList/cache';

const buildCacheKey = (type, page) => `manga_${type}_${page}`;

// small in-memory session cache to avoid repeated JSON.parse()
const memoryCache = new Map();

export const fetchMangaType = async (type, page) => {
  const cacheKey = buildCacheKey(type, page);
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  const ttlMs = ttlSeconds * 1000;

  // Quick return from in-memory session cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // Quick-return if localStorage cache is fresh & ok
  const cached = getFromStorage(cacheKey, ttlMs);
  if (cached) {
    memoryCache.set(cacheKey, cached);
    return cached;
  }

  // Prepare abort controller to avoid hanging fetches
  const controller = new AbortController();
  const signal = controller.signal;
  const revalidateSecs = ['favourite', 'latestArrivals', 'rating'].includes(type) ? 24 * 3600 : 60;

  try {
    const res = await fetch(`/api/manga/${type}?page=${page}`, {
      next: { revalidate: revalidateSecs },
      signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      markAsFailed(cacheKey, `HTTP ${res.status}: ${errText}`);
      throw new Error(`Failed to fetch ${type} page ${page}: ${res.status}`);
    }

    const data = await res.json();
    // save to localStorage and update in-memory cache
    saveToStorage(cacheKey, data);
    memoryCache.set(cacheKey, data);
    return data;
  } catch (err) {
    // mark tainted and rethrow
    markAsFailed(cacheKey, err);
    throw err;
  } finally {
    // if consumer ever wants to abort, they can; here we just cleanup controller reference
  }
};

export const useMangaFetch = (type, page) => {
  const queryClient = useQueryClient();
  const cacheKey = buildCacheKey(type, page);

  // choose TTL per type (seconds)
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  const staleTime = ttlSeconds * 1000; // ms
  const cacheTime = Math.max(staleTime * 2, 1000 * 60 * 60); // at least 1h or double staleTime

  const q = useQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime,
    cacheTime,
    refetchOnMount: false, // don't refetch automatically on every mount; rely on staleTime
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false,
    onError: (err) => {
      markAsFailed(cacheKey, err);
    },
    onSuccess: (data) => {
      clearFailure(cacheKey, data);
    },
  });

  useEffect(() => {
    // If the stored raw entry is tainted (exists but ok === false), invalidate to force a retry
    const raw = getRawFromStorage(cacheKey);
    if (raw && raw.ok === false) {
      queryClient.invalidateQueries(['manga', type, page]);
    }
  }, [type, page, queryClient, cacheKey]);

  return q;
};