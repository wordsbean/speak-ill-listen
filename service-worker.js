const CACHE_NAME = 'speak-ill-listen-shell-v2';
const APP_SHELL = ['./', './index.html', './manifest.json', './data/translate.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch((err) => {
      console.warn('일부 캐시 대상 파일을 찾지 못함:', err);
    }))
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

// 개발 중(아직 배포 전)에는 "네트워크 우선"으로 통일 - 캐시가 낡은 파일을 계속 서빙해서
// 수정사항이 반영 안 되는 것처럼 보이는 혼란을 방지. 오프라인일 때만 캐시로 대체됨.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok && e.request.method === 'GET') {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
