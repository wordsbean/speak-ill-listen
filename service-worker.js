const CACHE_NAME = 'speak-ill-listen-shell-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './data/translate.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // 유튜브/번역 API 등 외부 요청은 캐시 우회, 앱 셸만 오프라인 캐싱
  if (e.request.url.includes('/index.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
