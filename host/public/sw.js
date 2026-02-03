// 10dos — no service worker; static site. Kept so /sw.js does not 404.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
