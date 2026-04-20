// WildHome Service Worker
// Strategy:
//   - Static app shell (HTML, JS, CSS, assets): cache-first
//   - External API calls (iNaturalist, Nominatim, etc.): network-first with cache fallback

const CACHE_NAME = 'wildhome-v1';

// App shell URLs to pre-cache on install
const APP_SHELL = [
  '/',
  '/index.html',
];

// Domains that are treated as "API" (network-first)
const API_DOMAINS = [
  'api.inaturalist.org',
  'api.zippopotam.us',
  'nominatim.openstreetmap.org',
  'inaturalist-open-data.s3.amazonaws.com',
  'static.inaturalist.org',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  const isApiRequest = API_DOMAINS.some(d => url.hostname.includes(d));

  if (isApiRequest) {
    // Network-first: try network, fall back to cache
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first: serve from cache, fall back to network and cache the result
    event.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
            }
            return response;
          });
        })
    );
  }
});
