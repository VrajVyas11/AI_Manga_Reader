// util/MangaList/cache.js
const DEFAULT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const TYPE_TTL_SECONDS = {
  favourite: 24 * 3600,
  latestArrivals: 24 * 3600,
  rating: 24 * 3600,
  latest: 1800, // 30 minutes for latest
  random: 1800, // 30 minutes for random
  default: 3600,
};

const isClient = () => typeof window !== 'undefined';
const sessionCache = new Map();

export const getFromStorage = (key, maxAgeMs = DEFAULT_CACHE_DURATION) => {
  if (!isClient()) return null;

  if (sessionCache.has(key)) {
    const val = sessionCache.get(key);
    if (val && val.__timestamp) {
      if (Date.now() - val.__timestamp > maxAgeMs) {
        sessionCache.delete(key);
      } else {
        return val.data;
      }
    }
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (!entry || !('timestamp' in entry)) {
      localStorage.removeItem(key);
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > maxAgeMs) {
      // Cache expired - remove it
      localStorage.removeItem(key);
      sessionCache.delete(key);
      return null;
    }

    if (entry.ok === false) return null;

    sessionCache.set(key, { data: entry.data ?? null, __timestamp: entry.timestamp });
    return entry.data ?? null;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    try {
      localStorage.removeItem(key);
    } catch {}
    return null;
  }
};

export const getRawFromStorage = (key) => {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading raw ${key}:`, err);
    try {
      localStorage.removeItem(key);
    } catch {}
    return null;
  }
};

export const saveToStorage = (key, data) => {
  if (!isClient()) return;
  try {
    const entry = {
      data,
      timestamp: Date.now(),
      ok: true,
      failedAt: null,
    };
    localStorage.setItem(key, JSON.stringify(entry));
    sessionCache.set(key, { data, __timestamp: entry.timestamp });
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
};

export const markAsFailed = (key, error) => {
  if (!isClient()) return;
  try {
    const raw = localStorage.getItem(key);
    const prev = raw ? JSON.parse(raw) : {};
    const entry = {
      data: prev.data ?? null,
      timestamp: prev.timestamp ?? Date.now(),
      ok: false,
      failedAt: Date.now(),
      error: error ? String(error) : undefined,
    };
    localStorage.setItem(key, JSON.stringify(entry));
    sessionCache.delete(key);
  } catch (err) {
    console.error(`Error marking ${key} as failed:`, err);
  }
};

export const clearFailure = (key, data) => {
  saveToStorage(key, data);
};