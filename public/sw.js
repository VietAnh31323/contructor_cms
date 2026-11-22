const CACHE_NAME = "constructor-erp-v1";
const SHELL_URLS = ["/Dashboard", "/Constructor/FieldReport"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/public/")) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
