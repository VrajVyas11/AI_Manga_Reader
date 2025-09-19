// hooks/useMangaFetch.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getFromStorage,
  getRawFromStorage,
  saveToStorage,
  markAsFailed,
  clearFailure,
} from '../util/MangaList/cache';

const buildCacheKey = (type, page) => `manga_${type}_${page}`;

export const fetchMangaType = async (type, page) => {
  const cacheKey = buildCacheKey(type, page);

  // Quick-return if cached and ok
  const cached = getFromStorage(cacheKey);
  if (cached) return cached;

  // If raw exists but ok === false, we'll still fetch and overwrite
  // Do the network request
  try {
    // fetch(`/api/manga/${type}?page=${page}`, { next: { revalidate: 60 } })
    const res = await fetch(`/api/manga/${type}?page=${page}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      // mark as failed so subsequent calls won't read cached data
      markAsFailed(cacheKey, `HTTP ${res.status}: ${errText}`);
      throw new Error(`Failed to fetch ${type} page ${page}: ${res.status}`);
    }
    const data = await res.json();
    saveToStorage(cacheKey, data);
    return data;
  } catch (err) {
    // Network / other error: mark tainted and rethrow
    markAsFailed(cacheKey, err);
    throw err;
  }
};

export const useMangaFetch = (type, page) => {
  const queryClient = useQueryClient();
  const cacheKey = buildCacheKey(type, page);

  const q = useQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnMount: true, // Changed from 'always' to true (default behavior: refetch only if stale)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false,
    onError: (err) => {
      // Ensure storage is marked failed (defensive)
      markAsFailed(cacheKey, err);
    },
    onSuccess: (data) => {
      // Save latest and clear any failure state
      clearFailure(cacheKey, data);
    },
  });

  useEffect(() => {
    // If the stored raw entry is tainted (exists but ok === false), invalidate to force a retry
    const raw = getRawFromStorage(cacheKey);
    if (raw && raw.ok === false) {
      queryClient.invalidateQueries(['manga', type, page]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page, queryClient]);

  return q;
};