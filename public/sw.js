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

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '🚨 EMERGENCY ALERT';
  const options = {
    body: data.body || 'New tactical report received. Review immediately.',
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
    data: { url: '/' },
    tag: 'emergency-alert',
    renotify: true,
    requireInteraction: true,
    silent: false // Request the OS to play the default notification sound (Siren if set in Android Settings)
  };

  event.waitUntil(self.registration.showNotification(title, options));
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
