// custom cache rules go here

// if ('function' === typeof importScripts) {
importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

// add for skipWaiting
addEventListener('message', (event) => {
	console.log('RUN SIPWAITING')
	if (event.data && event.data.type === 'SKIP_WAITING') {
		skipWaiting();
	}
});

console.log('Workbox is loaded');

/* injection point for manifest files.  */
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

/* custom cache rules*/
// workbox.routing.registerNavigationRoute('/index.html', {
// 	blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
// });

workbox.routing.registerRoute(
	/\.(?:js|svg)$/,
	workbox.strategies.cacheFirst({
		cacheName: 'MY_JS_For_AUDIT',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	})
);

	// } else {
	// 	console.log('Workbox could not be loaded. No Offline support');
	// }
// }
