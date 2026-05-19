const CACHE_NAME = "l2auth-v2";
const STATIC_CACHE = "l2auth-static-v2";

const STATIC_ASSETS = [
  "/styles/main.css",
  "/scripts/main.js",
  "/manifest.json",
  "/assets/pizza-icon.svg",
];

// Install: cache static assets only (not HTML)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches, take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE).map((k) => caches.delete(k)))
      ),
      self.clients.claim(),
    ])
  );
});

// Fetch: network-first for HTML, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isHTML = url.pathname === "/" || url.pathname.endsWith(".html");

  if (isHTML) {
    // Network-first: always try the server, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else if (STATIC_ASSETS.includes(url.pathname)) {
    // Cache-first for known static assets
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
  // Everything else: pass through (fonts, unpkg CDN, etc.)
});
