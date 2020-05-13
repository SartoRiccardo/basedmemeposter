
function run() {
  if ('function' === typeof importScripts) {
    importScripts(
      'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
    );

    /* Global workbox */
    if(!workbox) return;
    workbox.setConfig({ debug: false });

    /* Injection point for manifest files. */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    /* Custom cache rules */
    workbox.routing.registerRoute(
      ({ url }) => url.origin === "https://www.instagram.com",
      workbox.strategies.cacheFirst({
        cacheName: 'instagram',
        plugins: [
          new workbox.expiration.Plugin({ maxAgeSeconds: 24 * 60 * 60 }),
        ],
      })
    );
  }
}

run();
