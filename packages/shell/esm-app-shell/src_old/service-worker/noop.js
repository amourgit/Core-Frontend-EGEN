// No-op service worker - désactive le cache
// Workbox InjectManifest injecte ici une liste vide (exclude: /.*/)
self.__WB_MANIFEST;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
