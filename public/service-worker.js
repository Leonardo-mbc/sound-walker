/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

importScripts(
  "precache-manifest/33162a815f90197b9b275de736bf8e55.js"
);

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/assets\/images/, workbox.strategies.cacheFirst({ "cacheName":"images", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":86400,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/assets\/sounds/, workbox.strategies.cacheFirst({ "cacheName":"sounds", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":2592000,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/musics/, workbox.strategies.cacheFirst({ "cacheName":"musics", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":2592000,"purgeOnQuotaError":false})] }), 'GET');
