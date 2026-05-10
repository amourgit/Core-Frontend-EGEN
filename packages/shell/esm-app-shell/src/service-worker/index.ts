// Service Worker principal — mode offline=enable (Workbox)
declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Workbox injecte la liste des assets ici lors du build
declare const __WB_MANIFEST: Array<{ url: string; revision: string | null }>;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Cache API
registerRoute(
  ({ url }: { url: URL }) => url.pathname.startsWith('/egen/ws/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 86400 })],
  })
);

// Assets statiques
registerRoute(
  ({ request }: { request: Request }) =>
    request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 604800 })],
  })
);

// Navigation SPA
registerRoute(
  ({ request }: { request: Request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({ cacheName: 'html-cache' })
);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

export {};
