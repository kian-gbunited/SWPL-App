// SWPL App — Service Worker
// Caches the app shell for offline use and fast loads.

var CACHE_NAME = 'swpl-v1';
var SHELL = [
  '/',
  '/index.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k)  { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Let Apps Script / Google Sheets requests go straight to network
  if (e.request.url.indexOf('script.google.com') !== -1 ||
      e.request.url.indexOf('docs.google.com') !== -1) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});
