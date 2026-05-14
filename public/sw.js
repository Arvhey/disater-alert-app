const CACHE_NAME = 'disaster-alert-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A dummy fetch handler is required by Chrome to trigger the PWA install prompt.
  // This will just pass the request through.
  event.respondWith(fetch(event.request).catch(() => new Response('Offline')));
});
