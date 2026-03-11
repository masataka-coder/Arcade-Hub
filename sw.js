const CACHE_NAME = 'arcade-hub-v3';
const ASSETS_TO_CACHE = [
    './',
    './.gitignore',
    './index.html',
    './manifest.json',
    './script.js',
    './style.css',
    './assets/apple-touch-icon.png',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './assets/icon.svg',
    './assets/images/cafe/android.png',
    './assets/images/cafe/cat.png',
    './assets/images/cafe/messenger.png',
    './assets/images/cafe/owl.png',
    './assets/images/cafe/t-rex.png',
    './assets/images/cafe/triceratops.png',
    './assets/images/cafe/masters/coffee.png',
    './assets/images/cafe/masters/humberger.png',
    './assets/images/cafe/masters/sandwhich.png',
    './assets/images/cafe/masters/smuji.png',
    './assets/images/cafe/normals/nomal1.png',
    './assets/images/cafe/normals/nomal2.png',
    './assets/images/cafe/vips/aroha.png',
    './assets/images/cafe/vips/godon.png',
    './assets/images/cafe/vips/mika.png',
    './assets/movies/block-cg.mp4',
    './assets/movies/block.mp4',
    './assets/movies/cafe-cg.mp4',
    './assets/movies/color-cg.mp4',
    './assets/movies/color.mp4',
    './assets/movies/golf-cg.mp4',
    './assets/movies/lost-cg.mp4',
    './assets/movies/neon-cg.mp4',
    './assets/movies/neon.mp4',
    './assets/movies/sushi-cg.mp4',
    './assets/movies/sushi.mp4',
    './assets/movies/tank-cg.mp4',
    './assets/movies/tank.mp4',
    './assets/movies/tower-cg.mp4',
    './assets/movies/tower.mp4',
    './assets/movies/village-cg.mp4',
    './assets/musics/block/bgm.mp3',
    './assets/musics/cafe/bgm.mp3',
    './assets/musics/color/bgm.mp3',
    './assets/musics/golf/bgm.mp3',
    './assets/musics/lost/bgm.mp3',
    './assets/musics/lost/effects/cat1.mp3',
    './assets/musics/lost/effects/cat2.mp3',
    './assets/musics/lost/effects/cat3.mp3',
    './assets/musics/lost/effects/environment1.mp3',
    './assets/musics/lost/effects/environment2.mp3',
    './assets/musics/lost/effects/environment3.mp3',
    './assets/musics/lost/effects/environment4.mp3',
    './assets/musics/lost/effects/rain.mp3',
    './assets/musics/tank/bgm.mp3',
    './assets/musics/tank/effects/bomb1.mp3',
    './assets/musics/tank/effects/bomb2.mp3',
    './assets/musics/tank/effects/shoot.mp3',
    './assets/musics/tank/effects/start.mp3',
    './assets/musics/tower/bgm.mp3',
    './assets/musics/village/bgm.mp3',
    './assets/thumbnails/block.png',
    './assets/thumbnails/cafe.png',
    './assets/thumbnails/color.png',
    './assets/thumbnails/golf.png',
    './assets/thumbnails/lost.png',
    './assets/thumbnails/neon.png',
    './assets/thumbnails/sushi.png',
    './assets/thumbnails/tank.png',
    './assets/thumbnails/tower.png',
    './assets/thumbnails/village.png',
    './games/block/index.html',
    './games/block/script.js',
    './games/block/style.css',
    './games/cafe/index.html',
    './games/cafe/script.js',
    './games/cafe/style.css',
    './games/color/index.html',
    './games/golf/index.html',
    './games/lost/index.html',
    './games/lost/main.js',
    './games/lost/style.css',
    './games/neon/index.html',
    './games/neon/script.js',
    './games/neon/style.css',
    './games/pitagora/index.html',
    './games/sand/index.html',
    './games/sushi/index.html',
    './games/tank/check_js.py',
    './games/tank/index.html',
    './games/tank/script.js',
    './games/tank/style.css',
    './games/tank/style_copy.css',
    './games/tower/fix_html.ps1',
    './games/tower/index.html',
    './games/tower/script.js',
    './games/tower/style.css',
    './games/village/index.html',
    './games/village/script.js',
    './games/village/style.css'
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
