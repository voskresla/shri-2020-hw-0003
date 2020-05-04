// build instruction https://developers.google.com/web/tools/workbox/modules/workbox-build#injectmanifest_mode

const workboxBuild = require('workbox-build');


const buildSW = () => {
	return workboxBuild.injectManifest({
		swSrc: 'src/sw-template.js',
		swDest: 'build/sw.js',
		globDirectory: 'build',
		globPatterns: [
			'**\/!(service-worker|precache-manifest.*).{html,svg}',
		],
	}).then(({ count, size, warnings }) => {
		warnings.forEach(console.warn);
		console.log(`${count} files will be precached, totaling ${size} bytes.`);
	});
}

buildSW()
