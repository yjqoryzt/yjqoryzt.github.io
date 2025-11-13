const CACHE_NAME = "wordpet-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./utils.js",
  "./data.js",
  "./pet.js",
  "./game.js",
  "./manifest.webmanifest",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];
self.addEventListener("install", function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) { return Promise.all(keys.map(function(k){ return k !== CACHE_NAME ? caches.delete(k) : Promise.resolve(); })); }));
  self.clients.claim();
});
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(function(){ return caches.match("./index.html"); }));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if (cached) return cached;
      return fetch(event.request).then(function(response){
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return response;
      });
    })
  );
});
