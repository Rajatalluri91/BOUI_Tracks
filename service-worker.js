// sw.js

const CACHE_NAME = 'boui-music-dynamic-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  clients.claim(); // Take control of uncontrolled clients
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      if (cachedRes) {
        return cachedRes;
      }

      return fetch(event.request)
        .then((networkRes) => {
          // Cache only same-origin or CORS-allowed responses
          if (!networkRes || networkRes.status !== 200 || networkRes.type === 'opaque') {
            return networkRes;
          }

          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          return new Response('Offline – Resource unavailable');
        });
    })
  );
});
