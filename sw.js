/**
 * Sluekie Service Worker
 * Progressive Web App - Offline Support
 * Version: 1.0.0
 * Updated: 2025-12-13
 */

const CACHE_VERSION = 'sluekie-v1';
const CACHE_NAME = `${CACHE_VERSION}-${Date.now()}`;

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/components.js',
    '/favicon.png',
    '/manifest.json',
    '/404.html'
];

// Assets to cache on first request
const CACHE_ON_DEMAND = [
    '/products.html',
    '/product.html',
    '/about.html',
    '/contact.html',
    '/account.html'
];

// Assets that should always be fetched from network
const NETWORK_FIRST = [
    '/api/',
    '/admin/',
    '/checkout',
    '/cart'
];

// ============================================================================
// SERVICE WORKER LIFECYCLE EVENTS
// ============================================================================

// Install Event - Cache critical assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching critical assets');
                return cache.addAll(CRITICAL_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            // Remove old caches
                            return cacheName.startsWith('sluekie-') && cacheName !== CACHE_NAME;
                        })
                        .map(cacheName => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
    );
});

// ============================================================================
// FETCH EVENT - Handle network requests
// ============================================================================

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }

    // Network First Strategy for dynamic content
    if (NETWORK_FIRST.some(path => url.pathname.startsWith(path))) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache First Strategy for static assets
    if (request.method === 'GET') {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Default: Network only for non-GET requests
    event.respondWith(fetch(request));
});

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

/**
 * Cache First Strategy
 * Returns cached response if available, otherwise fetches from network
 */
async function cacheFirst(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            console.log('[Service Worker] Cache hit:', request.url);
            return cachedResponse;
        }

        console.log('[Service Worker] Cache miss, fetching:', request.url);
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;

    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/404.html');
            if (offlinePage) {
                return offlinePage;
            }
        }

        // Return a basic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network First Strategy
 * Tries network first, falls back to cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;

    } catch (error) {
        console.log('[Service Worker] Network failed, trying cache:', request.url);

        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

self.addEventListener('message', event => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CACHE_URLS') {
        cacheUrls(event.data.urls);
    }

    if (event.data.type === 'CLEAR_CACHE') {
        clearCache();
    }

    if (event.data.type === 'GET_CACHE_SIZE') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({ size });
        });
    }
});

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(urls);
}

/**
 * Clear all caches
 */
async function clearCache() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

/**
 * Get total cache size
 */
async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }

    return totalSize;
}

// ============================================================================
// BACKGROUND SYNC (Future Enhancement)
// ============================================================================

self.addEventListener('sync', event => {
    console.log('[Service Worker] Sync event:', event.tag);

    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncOrders() {
    // Placeholder for order synchronization
    console.log('[Service Worker] Syncing orders...');
}

// ============================================================================
// PUSH NOTIFICATIONS (Future Enhancement)
// ============================================================================

self.addEventListener('push', event => {
    console.log('[Service Worker] Push received:', event);

    const options = {
        body: event.data ? event.data.text() : 'New notification from Sluekie',
        icon: '/favicon.png',
        badge: '/favicon.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/favicon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/favicon.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Sluekie', options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('[Service Worker] Loaded successfully');
