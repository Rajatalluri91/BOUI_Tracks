
const CACHE_NAME = 'boui-dynamic-v1';
const OFFLINE_FILES = [
  '/',
  '/index.html',
  '/style.css',
  // Add any assets like icons or fonts used
];

// Install event – pre-cache some files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event – cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event – dynamic cache for MP3 and lyrics
self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (url.endsWith('.mp3') || url.endsWith('.txt')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(response => {
          return response || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      )
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request)
      )
    );
  }
});
