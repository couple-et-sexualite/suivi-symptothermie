const CACHE_NAME = 'symrella-shell-v12';
// Keep the app shell, the original logo, and the SVG icon wrappers available offline.
const APP_SHELL = [
  './',
  './app.js',
  './manifest.webmanifest',
  './icons/symrella-logo.png',
  './icons/icon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];
const CACHEABLE_PATHS = new Set(APP_SHELL.map(path => new URL(path, self.registration.scope).pathname));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (!CACHEABLE_PATHS.has(url.pathname)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
