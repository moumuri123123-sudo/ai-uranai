const CACHE_VERSION = "v2";
const CACHE_NAME = `uranaidokoro-${CACHE_VERSION}`;
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/data/")) return;

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icon-") ||
    /\.(webp|png|jpg|jpeg|gif|svg|ico|woff2?|css|js)$/i.test(url.pathname);

  const isNavigation = event.request.mode === "navigate";

  if (!isStaticAsset && !isNavigation) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && isStaticAsset) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((r) => r || caches.match(OFFLINE_URL))
      )
  );
});
