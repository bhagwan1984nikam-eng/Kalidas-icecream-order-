

const CACHE_NAME = 'kalidas-icecream-offline-v2';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const file of FILES_TO_CACHE) {
                try {
                    await cache.add(file);
                } catch (error) {
                    console.log('Cache file error:', file, error);
                }
            }
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key =>
                        key.startsWith('kalidas-icecream-offline-') &&
                        key !== CACHE_NAME
                    )
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response && response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put('./index.html', copy);
                        });
                    }

                    return response;
                })
                .catch(async () => {
                    return await caches.match('./index.html') ||
                           await caches.match('./');
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                if (response && response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copy);
                    });
                }

                return response;
            });
        })
    );
});
