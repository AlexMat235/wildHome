// localStorage cache with per-entry TTL.
// All cache keys are namespaced under WILDHOME_ to avoid collisions.

const NAMESPACE = 'WILDHOME_';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Write a value to the cache.
 * @param {string} key
 * @param {*} value  Any JSON-serialisable value
 * @param {number}  [ttlMs=DEFAULT_TTL_MS]
 */
export function cacheSet(key, value, ttlMs = DEFAULT_TTL_MS) {
  try {
    const entry = { v: value, exp: Date.now() + ttlMs };
    localStorage.setItem(NAMESPACE + key, JSON.stringify(entry));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

/**
 * Read a value from the cache.  Returns null on miss or expiry.
 */
export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(NAMESPACE + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() > entry.exp) {
      localStorage.removeItem(NAMESPACE + key);
      return null;
    }
    return entry.v;
  } catch {
    return null;
  }
}

/**
 * Remove a single cache entry.
 */
export function cacheDel(key) {
  try {
    localStorage.removeItem(NAMESPACE + key);
  } catch { /* ignore */ }
}

/**
 * Clear every WildHome cache entry from localStorage.
 */
export function cacheClear() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NAMESPACE))
      .forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

/**
 * Higher-order helper: if cached, return cached value.  Otherwise call
 * fetcher(), store the result, and return it.
 *
 * @param {string}   key
 * @param {Function} fetcher  Async function returning the value to cache
 * @param {number}   [ttlMs]
 */
export async function cachedFetch(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
  const cached = cacheGet(key);
  if (cached !== null) return cached;
  const result = await fetcher();
  if (result !== null && result !== undefined) {
    cacheSet(key, result, ttlMs);
  }
  return result;
}
