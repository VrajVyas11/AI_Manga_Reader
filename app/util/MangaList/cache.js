// utils/cache.js
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const isClient = () => typeof window !== 'undefined';

export const getFromStorage = (key) => {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || !('timestamp' in entry)) {
      localStorage.removeItem(key);
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    // Only return if not tainted (ok === true)
    if (entry.ok === false) return null;

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
    // keep the entry even if stale; the caller can inspect timestamp/ok
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
  } catch (err) {
    console.error(`Error marking ${key} as failed:`, err);
  }
};

export const clearFailure = (key, data) => {
  // same as saveToStorage
  saveToStorage(key, data);
};