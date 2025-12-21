/* eslint-disable no-restricted-globals */
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute, setDefaultHandler} from 'workbox-routing';
import {NetworkFirst, StaleWhileRevalidate, CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {clientsClaim} from 'workbox-core';

self.skipWaiting();
clientsClaim();

// Build injects revisioned assets here
precacheAndRoute(self.__WB_MANIFEST || []);

// Navigations (app shell) → NetworkFirst
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 3,
    plugins: [new ExpirationPlugin({maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60})]
  })
);

// JS & CSS → StaleWhileRevalidate
registerRoute(
  ({request}) => ['script', 'style'].includes(request.destination),
  new StaleWhileRevalidate({cacheName: 'static'})
);

// Images (incl. TMDB posters) → CacheFirst with limits
registerRoute(
  ({request, url}) => request.destination === 'image' || url.hostname === 'image.tmdb.org',
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({maxEntries: 120, maxAgeSeconds: 14 * 24 * 60 * 60})]
  })
);

// Default handler as a safety net
setDefaultHandler(new NetworkFirst());
