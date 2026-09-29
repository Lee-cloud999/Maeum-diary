// 배포할 때마다 VERSION 숫자만 올리면 이전 캐시가 지워지고 새 파일로 갱신돼요.
const VERSION='v7';
const C='maeum-'+VERSION;
const FILES=['./','./index.html','./manifest.json','./icon.svg','./img/poodle1.png','./img/poodle2.png','./img/poodle3.png','./img/poodle4.png','./img/poodle5.png','./img/poodle6.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// 네트워크 우선, 실패(오프라인)하면 캐시 사용
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});
