if ('function' === typeof importScripts) {
	importScripts(
		'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
	);

	// self.addEventListener('install', (event) => {
	// 	console.log('fire1')
	// });

	// self.addEventListener('activate', (event) => {
	// 	console.log('fire2')
	// });

	// self.addEventListener('fetch', (event) => {
	// 	console.log('fire3')
	// });

	if (workbox) {
		console.log('Workbox is loaded');

		workbox.core.skipWaiting();
		workbox.core.clientsClaim();

		workbox.core.setCacheNameDetails({
			prefix: 'ci-server-svg',
			suffix: 'v0.1'
		});

		workbox.precaching.cleanupOutdatedCaches()

		workbox.precaching.precache(self.__WB_MANIFEST);

		/* custom cache rules*/
		// workbox.routing.registerNavigationRoute('/index.html', {
		// 	blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
		// });

		workbox.routing.registerRoute(
			new RegExp('/static/'),
			new workbox.strategies.NetworkFirst({
				cacheName: "static-resources_v2",
				plugins: [
					new workbox.expiration.Plugin({
						maxEntries: 60,
						maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Days
					}),
				],
			})
		);

		workbox.routing.registerRoute(
			/\.(?:png)$/,
			new workbox.strategies.NetworkFirst({
				cacheName: "images-resources_v2",
				plugins: [
					new workbox.expiration.Plugin({
						maxEntries: 60,
						maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Days
					}),
				],
			})
		);

	} else {
		console.log('Workbox could not be loaded. No Offline support');
	}
}
