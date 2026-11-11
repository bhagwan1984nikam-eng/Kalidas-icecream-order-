
const CACHE_NAME = 'kalidas-offline-v4';

const APP_FILES = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key =>
                        key.startsWith('kalidas-offline-') &&
                        key !== CACHE_NAME
                    )
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', event => {
    const request = event.request;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        (async () => {
            try {
                const cached = await caches.match(request);

                if (cached) return cached;

                const response = await fetch(request);

                if (response && response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }

                return response;

            } catch (error) {
                const cached = await caches.match(request);

                if (cached) return cached;

                if (request.mode === 'navigate') {
                    const appPage = await caches.match('./index.html');
                    if (appPage) return appPage;
                }

                return new Response('इंटरनेट उपलब्ध नाही.', {
                    status: 503,
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                });
            }
        })()
    );
});
