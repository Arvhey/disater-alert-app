const CACHE_NAME = 'disaster-alert-cache-v3';

self.addEventListener('install', (event) => {
  // Force the new SW to activate immediately, replacing the old one
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete ALL old caches so the new icon/manifest is fetched fresh
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass all requests through — no caching of icon/manifest
  event.respondWith(fetch(event.request).catch(() => new Response('Offline')));
});
