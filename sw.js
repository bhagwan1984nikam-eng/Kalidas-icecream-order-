const CACHE_NAME = 'kalidas-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './icon.png'
];

// इन्स्टॉल करताना फाईल्स कॅशे करणे
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// ऑफलाइन असताना कॅशेमधून डेटा पुरवणे
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
