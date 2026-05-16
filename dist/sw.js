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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
