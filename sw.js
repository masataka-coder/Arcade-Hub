const CACHE_NAME = 'arcade-hub-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './games.js',
    './manifest.json',
    './games/block/index.html',
    './games/tank/index.html',
    './games/tower/index.html',
    './games/neon/index.html',
    './games/cafe/index.html',
    './games/village/index.html',
    './games/golf/index.html',
    './games/lost/index.html',
    './games/color/index.html',
    './games/sushi/index.html',
    './assets/thumbnails/block.png',
    './assets/thumbnails/tank.png',
    './assets/thumbnails/tower.png',
    './assets/thumbnails/neon.png',
    './assets/thumbnails/golf.png',
    './assets/thumbnails/lost.png',
    './assets/thumbnails/color.png',
    './assets/thumbnails/village.png',
    './assets/thumbnails/color.png',
    './assets/icon.svg',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
