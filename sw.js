const CACHE_NAME = 'kalidas-dynamic-v1';

// सर्व्हिस वर्कर इन्स्टॉल करणे
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// जुना कॅशे ॲक्टिव्हेट करणे
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// डायनॅमिक फेच आणि कॅशिंग (हे ऑफलाइन चालवण्यासाठी जादू करते)
self.addEventListener('fetch', (event) => {
    // फक्त GET रिक्वेस्टसाठी कॅशे तपासा
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // जर इंटरनेट असेल, तर आलेला नवीन डेटा/फाइल कॅशेमध्ये सेव्ह करा
                let responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // जर इंटरनेट नसेल (ऑफलाइन), तर सेव्ह केलेल्या कॅशमधून फाइल दाखवा
                return caches.match(event.request);
            })
    );
});
