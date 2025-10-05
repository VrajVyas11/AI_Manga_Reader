// hooks/useMangaFetch.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getFromStorage,
  getRawFromStorage,
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
    return memoryCache.get(cacheKey);
  }

  // Check localStorage
  const cached = getFromStorage(cacheKey, ttlMs);
  if (cached) {
    memoryCache.set(cacheKey, cached);
    return cached;
  }

  // Fetch fresh data
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const res = await fetch(`/api/manga/${type}?page=${page}`, { signal });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      markAsFailed(cacheKey, `HTTP ${res.status}: ${errText}`);
      throw new Error(`Failed to fetch ${type} page ${page}: ${res.status}`);
    }

    const data = await res.json();
    saveToStorage(cacheKey, data);
    memoryCache.set(cacheKey, data);
    return data;
  } catch (err) {
    markAsFailed(cacheKey, err);
    throw err;
  }
};

export const useMangaFetch = (type, page) => {
  const queryClient = useQueryClient();
  const cacheKey = buildCacheKey(type, page);
  const ttlSeconds = TYPE_TTL_SECONDS[type] ?? TYPE_TTL_SECONDS.default;
  const staleTime = ttlSeconds * 1000;
  const gcTime = Math.max(staleTime * 2, 1000 * 60 * 60);

  const query = useQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime,
    gcTime, // Changed from cacheTime (React Query v5)
    refetchOnMount: false,
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
    const raw = getRawFromStorage(cacheKey);
    if (raw && raw.ok === false) {
      queryClient.invalidateQueries({ queryKey: ['manga', type, page] });
    }
  }, [type, page, queryClient, cacheKey]);

  return query;
};