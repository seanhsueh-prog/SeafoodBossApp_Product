// 檔名：sw-product-v1.0.js
// 說明：Product Version 專用 Service Worker，使用獨立 Cache Name

const CACHE_NAME = 'seafood-boss-product-v1.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html', // 實際上傳後主程式通常為 index.html
    './SeafoodBossApp_Product_v1.0.html', // 保險起見
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// 安裝 Service Worker 並快取靜態資源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 啟用 Service Worker 並清除舊快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 這裡的邏輯是：只要不是目前的 CACHE_NAME，就刪除
                    // 這樣可以避免 Product 版和 Demo 版 (v4.8) 的快取混淆
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 攔截請求並回傳快取內容
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果快取中有，直接回傳
                if (response) {
                    return response;
                }
                // 否則從網路抓取
                return fetch(event.request);
            })
    );
});