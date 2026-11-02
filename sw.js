const VERSION="pi-zo-v3";
const ASSETS=["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(e.request.mode==="navigate"){
    e.respondWith(Promise.race([
      fetch(e.request,{cache:"no-store"}).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put("./",cp));return res}),
      new Promise((_,rej)=>setTimeout(rej,2500))
    ]).catch(()=>caches.match("./").then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{const net=fetch(e.request).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(VERSION).then(c=>c.put(e.request,cp))}return res}).catch(()=>hit);return hit||net}));
});
