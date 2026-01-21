/* 檔名：sw-product-v1.0.js */
/* 適用於：SeafoodBossApp_Product_v1.0.html */

const CACHE_NAME = 'seafood-product-v1.0';
const ASSETS_TO_CACHE = [
    './SeafoodBossApp_Product_v1.0.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // 如果是 HTML 請求失敗（例如離線），回傳主頁
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./SeafoodBossApp_Product_v1.0.html');
                }
            });
        })
    );
});