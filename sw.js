const CACHE_NAME = "l2auth-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/basic-auth.html",
  "/jwt.html",
  "/oauth2.html",
  "/oidc.html",
  "/demystifying-tokens.html",
  "/concepts/index.html",
  "/concepts/auth-n-z.html",
  "/concepts/auth-n-z-new.html",
  "/concepts/claims-reference.html",
  "/concepts/id-token-vs-access-token.html",
  "/concepts/sca.html",
  "/concepts/scopes-vs-claims.html",
  "/concepts/well-known.html",
  "/styles/main.css",
  "/scripts/main.js",
  "/manifest.json",
  "/assets/pizza-icon.svg",
];

// Install: cache all static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
