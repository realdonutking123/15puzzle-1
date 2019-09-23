var cacheName = '15puzzle';
var filesToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/puzzle_game.js'
];

// start the service and cache content
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// serve cached content when offline
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
