/* IOL Wire service worker.
 *
 * Deliberately conservative: the only things served cache-first are assets that
 * never change under a given URL (icons, story posters). Everything else is
 * network-first with a cache fallback, so a stale build can never be pinned —
 * which also keeps this safe to run alongside the dev server's HMR.
 */

const VERSION = "iol-wire-v2";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

/** Enough to boot the app with no network, posters included so the feed still
 *  has artwork for stories you haven't scrolled to yet. The clips themselves
 *  are far too big to precache and stay network-only. */
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/logo.jpeg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/stories/cape-storm.jpg",
  "/stories/burnout-escape.jpg",
  "/stories/point-duty.jpg",
  "/stories/bmw-m3-e92.png",
];

/** Immutable by URL — safe to serve from cache first. */
const isImmutable = (url) =>
  url.pathname.startsWith("/stories/") ||
  url.pathname.startsWith("/icon") ||
  url.pathname === "/logo.jpeg" ||
  url.pathname === "/apple-touch-icon.png";

/** Dev-server and streaming endpoints the worker must stay out of. */
const isBypassed = (url) =>
  url.pathname.startsWith("/_next/webpack-hmr") ||
  url.pathname.startsWith("/__nextjs") ||
  // Video is served with range requests; answering those from a cached full
  // body breaks seeking, so let the browser talk to the network directly.
  url.pathname.endsWith(".mp4");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // Individually, so one 404 can't fail the whole install.
      .then((cache) =>
        Promise.all(
          PRECACHE.map((path) =>
            cache.add(path).catch(() => undefined)
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL && k !== RUNTIME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isBypassed(url)) return;

  if (isImmutable(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(RUNTIME).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Network-first for everything else, falling back to whatever we have.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => {
        // Build assets are immutable per path, but the dev server appends a
        // fresh ?v= to some of them on every load, so match on path alone or
        // they'd never be found again offline.
        const hit = await caches.match(request, {
          ignoreSearch: url.pathname.startsWith("/_next/static/"),
        });
        if (hit) return hit;
        // A navigation with nothing cached still gets the app shell.
        if (request.mode === "navigate") {
          const shell = await caches.match("/");
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
