
const CACHE_NAME = 'kalidas-offline-v1';

const APP_FILES = [
    './',
    './index.html'
];

// Install: Save the main application
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(APP_FILES);
        })
    );
    self.skipWaiting();
});

// Activate: Remove old application caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Serve cached files when offline
self.addEventListener('fetch', event => {

    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Handle only same-origin files
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copy);
                    });
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(event.request);

                if (cached) return cached;

                // Offline page fallback
                if (event.request.mode === 'navigate') {
                    return await caches.match('./index.html');
                }

                return new Response('Offline - File not available', {
                    status: 503,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            })
    );
});
