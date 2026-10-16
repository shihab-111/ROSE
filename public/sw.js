// Self-purging Service Worker to unregister and clear stale caches on mobile devices
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

// Pass-through fetch handler ensuring zero interference with Vite ESM modules
self.addEventListener('fetch', () => {
  // Let the browser handle network fetch directly
  return;
});
