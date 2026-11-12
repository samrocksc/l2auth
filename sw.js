const CACHE_VERSION = "v10";
const SHELL_CACHE = `l2auth-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `l2auth-runtime-${CACHE_VERSION}`;

const PRECACHE = [
  "./",
  "./index.html",
  "./basic-auth.html",
  "./oauth2.html",
  "./oidc.html",
  "./demystifying-tokens.html",
  "./concepts/index.html",
  "./concepts/auth-security-parameters.html",
  "./concepts/auth-n-z.html",
  "./concepts/sca.html",
  "./concepts/mfa-factors.html",
  "./concepts/authenticators.html",
  "./concepts/authenticator-assurance-levels.html",
  "./concepts/bcrypt-password-matching.html",
  "./concepts/glossary.html",
  "./concepts/claims-reference.html",
  "./concepts/custom-attributes.html",
  "./concepts/id-token-vs-access-token.html",
  "./concepts/jwt.html",
  "./concepts/well-known.html",
  "./concepts/jwks.html",
  "./l2auth_ciam_adventure.html",
  "./offline.html",
  "./404.html",
  "./styles/main.css",
  "./scripts/theme-init.js",
  "./scripts/site.js",
  "./scripts/site-config.js",
  "./scripts/header-fallback.js",
  "./components/lazy-wc-markdown.js",
  "./components/vendor/wc-markdown.js",
  "./manifest.json",
  "./assets/pizza-icon.svg",
  "./assets/diagrams/oauth2-authorization-code.svg",
  "./assets/diagrams/oidc-token-flow.svg",
  "./assets/diagrams/refresh-token-flow.svg",
  "./assets/diagrams/jwt-authentication-flow.svg",
  "./assets/diagrams/discovery-bootstrapping.svg",
  "./assets/diagrams/id-token-vs-access-token.svg",
  "./assets/diagrams/custom-attributes-lineage.svg",
  "./content/index.md",
  "./content/basic-auth.md",
  "./content/concepts/jwt.md",
  "./content/oauth2.md",
  "./content/oidc.md",
  "./content/demystifying-tokens.md",
  "./content/concepts/index.md",
  "./content/concepts/auth-n-z.md",
  "./content/concepts/sca.md",
  "./content/concepts/bcrypt-password-matching.md",
  "./content/concepts/glossary.md",
  "./content/concepts/claims-reference.md",
  "./content/concepts/custom-attributes.md",
  "./content/concepts/id-token-vs-access-token.md",
  "./content/concepts/jwt.md",
  "./content/concepts/well-known.md",
  "./content/concepts/jwks.md",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheableResponse(response) {
  return response?.ok && response.type !== "opaque";
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return caches.match("./offline.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (isCacheableResponse(response)) {
    const cache = await caches.open(SHELL_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (isCacheableResponse(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.hostname === "www.googletagmanager.com") {
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
