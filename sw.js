const CACHE_NAME = 'eiken5-pwa-v1';

const ASSETS_TO_CACHE = [

'./',

'./index.html',

'./manifest.json',

'https://cdn.tailwindcss.com/3.4.17',

'https://cdn.jsdelivr.net/npm/lucide@0.577.0/dist/umd/lucide.min.js',

'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Cardo:wght@400;700&display=swap'

];



// Install Event

self.addEventListener('install', (event) => {

event.waitUntil(

caches.open(CACHE_NAME).then((cache) => {

console.log('Caching essential PWA assets');

return cache.addAll(ASSETS_TO_CACHE);

})

);

self.skipWaiting();

});



// Activate Event

self.addEventListener('activate', (event) => {

event.waitUntil(

caches.keys().then((cacheNames) => {

return Promise.all(

cacheNames.map((cache) => {

if (cache !== CACHE_NAME) {

console.log('Clearing old cache:', cache);

return caches.delete(cache);

}

})

);

})

);

self.clients.claim();

});



// Fetch Event (Network First, falling back to cache)

self.addEventListener('fetch', (event) => {

event.respondWith(

fetch(event.request)

.then((response) => {

// Dynamic caching for new resources

if (event.request.method === 'GET') {

const responseClone = response.clone();

caches.open(CACHE_NAME).then((cache) => {

cache.put(event.request, responseClone);

});

}

return response;

})

.catch(() => {

// Cache fallback when offline

return caches.match(event.request).then((response) => {

if (response) return response;

if (event.request.headers.get('accept').includes('text/html')) {

return caches.match('./index.html');

}

});

})

);

});