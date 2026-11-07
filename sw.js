const CACHE_NAME = 'kalidas-cache-v2';

// इन्स्टॉल करताना सर्व फाईल्स कॅशे करणे
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// फेट्च करताना त्रुटी न येण्यासाठी नेटवर्क फर्स्ट (Network First) पद्धत
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
