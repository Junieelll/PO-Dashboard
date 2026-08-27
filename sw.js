const CACHE_NAME = 'po-tracker-v2'; // bump this on every deploy
const ASSETS = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/api.js',
  '/icon.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate new SW immediately, don't wait for old one to be closed
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // take control of open tabs right away
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for HTML/navigation, so the shell itself is never stale
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets, but fall back to network + update cache
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
      return cached || fetchPromise;
    })
  );
});