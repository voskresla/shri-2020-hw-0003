// 	workbox.precaching.precache(self.__WB_MANIFEST);
const CACHE_NAME = 'custom-cache-v1';
const CACHE_NAME_2 = 'custom-runtime-v1';
const URLS_TO_PRECACHE = [
	'/index.html',
	'/logo192.png',
	'/logo512.png',
	'/favico.ico',
]


self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('cache opened')
			return cache.addAll(URLS_TO_PRECACHE)
		})
	)
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return true
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {

	if (
		event.request.method !== 'GET' ||
		!(event.request.url.indexOf('http') === 0) ||
		!customMatch(event.request.url)
	) {
		return;
	}

	event.respondWith(
		caches.open(CACHE_NAME_2).then(function (cache) {
			return cache.match(event.request).then(function (response) {
				var fetchPromise = fetch(event.request).then(function (networkResponse) {
					if (networkResponse.status === 200 && networkResponse.statusText !== 'ERROR') {
						cache.put(event.request, networkResponse.clone());
					}
					return networkResponse;
				})
				return response || fetchPromise;
			})
		})
	);
});

function customMatch(url) {
	if (url.indexOf('logs') > -1) return true
	if (url.indexOf('static') > -1) return true
}


