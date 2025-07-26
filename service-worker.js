
const CACHE_NAME = 'boui-v1';
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([
      './',
      './index.html',
      './manifest.json'
    ]))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(networkResp => {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, networkResp.clone());
        return networkResp;
      });
    }))
  );
});
