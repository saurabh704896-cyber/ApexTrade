const CACHE_NAME = 'apextrade-pro-v10';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './logo.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Mock Database in memory
const mockDb = {
    users: [],
    trades: []
};

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // --- MOCK API BACKEND ---
  if (url.pathname.startsWith('/api/')) {
      event.respondWith((async () => {
          // Simulate network latency (300ms - 800ms)
          const delay = Math.floor(Math.random() * 500) + 300;
          await new Promise(r => setTimeout(r, delay));
          
          try {
              if (url.pathname === '/api/login' && event.request.method === 'POST') {
                  const body = await event.request.json();
                  const token = "jwt_" + Math.random().toString(36).substr(2) + Date.now();
                  return new Response(JSON.stringify({ success: true, token, user: body.email, name: body.name }), {
                      headers: { 'Content-Type': 'application/json' }
                  });
              }
              
              if (url.pathname === '/api/trade' && event.request.method === 'POST') {
                  const body = await event.request.json();
                  mockDb.trades.push(body);
                  return new Response(JSON.stringify({ success: true, tradeId: "trd_" + Date.now(), status: 'EXECUTED', data: body }), {
                      headers: { 'Content-Type': 'application/json' }
                  });
              }
              
              return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404 });
          } catch(err) {
              return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
          }
      })());
      return;
  }

  // --- NORMAL CACHE LOGIC ---
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Update cache with new version if successful
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request);
      })
  );
});
