// util/MangaList/cache.js
const DEFAULT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

// Per-type TTLs in seconds (exported so hook can reference)
export const TYPE_TTL_SECONDS = {
  favourite: 24 * 3600,
  latestArrivals: 24 * 3600,
  rating: 24 * 3600,
  default: 3600, // 1 hour
};

const isClient = () => typeof window !== 'undefined';

// In-memory session cache (used across the app when helpful)
const sessionCache = new Map();

export const getFromStorage = (key, maxAgeMs = DEFAULT_CACHE_DURATION) => {
  if (!isClient()) return null;

  // try session cache first
  if (sessionCache.has(key)) {
    const val = sessionCache.get(key);
    // validate age if stored with timestamp
    if (val && val.__timestamp) {
      if (Date.now() - val.__timestamp > maxAgeMs) {
        sessionCache.delete(key);
      } else {
        return val.data;
      }
    } else {
      // no timestamp stored (unlikely), return raw
      return val.data ?? null;
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
      localStorage.removeItem(key);
      return null;
    }

    if (entry.ok === false) return null;

    // populate session cache for faster subsequent lookups
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
    const entry = JSON.parse(raw);
    return entry;
  } catch (err) {
    console.error(`Error reading raw ${key} from localStorage:`, err);
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
    // update session cache too
    try {
      const sessionEntry = { data, __timestamp: entry.timestamp };
      sessionCache.set(key, sessionEntry);
    } catch (e) {
      console.log(e)
      // ignore
    }
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
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
    // remove session cache so next read triggers re-parse and invalidation logic
    sessionCache.delete(key);
  } catch (err) {
    console.error(`Error marking ${key} as failed:`, err);
  }
};

export const clearFailure = (key, data) => {
  saveToStorage(key, data);
};