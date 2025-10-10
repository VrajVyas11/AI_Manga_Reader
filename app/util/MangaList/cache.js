// util/MangaList/cache.js
const DEFAULT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const TYPE_TTL_SECONDS = {
  favourite: 24 * 3600,
  latestArrivals: 24 * 3600,
  rating: 24 * 3600,
  latest: 1800, // 30 minutes
  random: 1800, // 30 minutes
  default: 3600,
};

const isClient = () => typeof window !== 'undefined';
const sessionCache = new Map();

export const getFromStorage = (key, maxAgeMs = DEFAULT_CACHE_DURATION) => {
  if (!isClient()) return null;

  // Check session cache first
  if (sessionCache.has(key)) {
    const val = sessionCache.get(key);
    if (Date.now() - val.timestamp <= maxAgeMs) {
      return val.data;
    }
    sessionCache.delete(key);
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (!entry || typeof entry.timestamp !== 'number') {
      localStorage.removeItem(key);
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > maxAgeMs) {
      localStorage.removeItem(key);
      return null;
    }

    if (entry.ok === false) return null;

    // Sync to session cache
    sessionCache.set(key, { data: entry.data, timestamp: entry.timestamp });
    return entry.data ?? null;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    try {
      localStorage.removeItem(key);
    } catch {}
    return null;
  }
};

export const saveToStorage = (key, data) => {
  if (!isClient()) return;
  try {
    const timestamp = Date.now();
    const entry = {
      data,
      timestamp,
      ok: true,
    };
    localStorage.setItem(key, JSON.stringify(entry));
    sessionCache.set(key, { data, timestamp });
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

// Check if cache is stale without returning data
export const isCacheStale = (key, maxAgeMs) => {
  if (!isClient()) return true;

  if (sessionCache.has(key)) {
    const val = sessionCache.get(key);
    return Date.now() - val.timestamp > maxAgeMs;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return true;

    const entry = JSON.parse(raw);
    if (!entry || typeof entry.timestamp !== 'number' || entry.ok === false) {
      return true;
    }

    return Date.now() - entry.timestamp > maxAgeMs;
  } catch {
    return true;
  }
};