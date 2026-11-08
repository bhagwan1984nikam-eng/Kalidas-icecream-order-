const CACHE_NAME = 'kalidas-icecream-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './kaju.png',
    './mawa.png',
    './gadabad.png',
    './strawberry.png',
    './pista.png',
    './vanilla.png',
    './mango.png',
    './butterscotch.png',
    './sauce.png',
    './choco.png',
    './family_vanilla.png',
    './family_mango.png'
];

// इंस्टॉल करताना सर्व फाईल्स मेमरीमध्ये सेव्ह करा
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// जुना कॅशे साफ करणे
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// ऑफलाईन असताना सेव्ह केलेल्या फाईल्स दाखवणे
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // इंटरनेट नसेल तर इंडेक्स फाईल दाखवा
                return caches.match('./index.html');
            });
        })
    );
});
