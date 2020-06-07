importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
	console.log(`Workbox load successfully`);
} else {
	console.log(`Workbox load failed`);
}
	
const {precacheAndRoute} = workbox.precaching;
const {registerRoute} = workbox.routing;
const {cacheNames, setCacheNameDetails } = workbox.core;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;

setCacheNameDetails({
	prefix: 'footbola-pwa-app',
	suffix: 'v1',
	precache: 'app-shell',
	runtime: 'external-resource',
});

const page = ([_page, revision]) => {
	return [
		[`${_page}.html`, revision]
	];
};
const apply = (context, files) => {
	return files.map(([file, revision]) => ({
		url: context + file,
		revision
	}));
};

const getPrecacheList = () => {
	const pages = [
		['home', 1],
		['bundesliga', 1],
		['premiereleague', 1],
		['primeradivision', 1],
		['serieA', 1],
		['favorite', 1]
	].map(page).flat();

	const styles = [
		['page.css', 1],
	];

	const libs = [
		['lazysizes.min.js', 1],
		['materialize.min.css', 1],
		['materialize.min.js', 1],
	];

	const assets = [
		['bundesligaLogo.png', 1],
		['football.png', 1],
		['laLiga.png', 1],
		['premiereleagueLogo.png', 1],
		['serieA.png', 1],
	];

	const icons = [
		'favicon.ico',
		'logo96.png',
		'logo128.png',
		'logo192.png',
		'logo512.png',
	].map(icon => [icon, 1]);

	const fonts = [
		['FiraSans-Medium.ttf', 1],
		['FiraSans-Regular.ttf', 1],
	]

	const services = [
		['dbController.js', 1],
		['idb.js', 1],
	];

	const data = [
		['favoriteData.js', 1],
		['teamData.js', 1],
	];

	const scripts = [
		['main.js', 1],
		['serviceWorkerRegister.js', 1]
	];
	
	return [
		{url: '/index.html', revision: 1},
		{ur: '/manifest.json', revision: 1},
		apply('/assets/', assets),
		apply('/fonts/', fonts),
		apply('/icons/', icons),
		apply('/pages/', pages),
		apply('/src/css/', styles),
		apply('/src/js/', scripts),
		apply('/src/libs/', libs),
		apply('/src/services/', services),
	].flat();
};

precacheAndRoute(getPrecacheList());

registerRoute(
	/https:\/\/api\.football-data\.org\/v2/,
	new StaleWhileRevalidate({
		cacheName: `${cacheNames.prefix}-api-resource-${cacheNames.suffix}`
	}),
);

registerRoute(
	({request}) => request.destination === 'image',
	new CacheFirst({
		plugins: [
			new CacheableResponsePlugin({
				statues: [0, 200]
			}),
		],
	}),
);
// const CACHE_NAME = 'footbola-pwa-app-v1';
// const urlsToCache = [
// 	'/',
// 	'/index.html',
// 	'/pages/home.html',
// 	'/pages/bundesliga.html',
// 	'/pages/serieA.html',
// 	'/pages/premiereleague.html',
// 	'/pages/primeradivision.html',
// 	'/pages/favorite.html',
// 	'/manifest.json',
// 	'/src/main.js',
// 	'/src/js/serviceWorkerRegister.js',
// 	'/src/js/materialize.min.js',
// 	'/src/js/lazysizes.min.js',
// 	'/src/css/materialize.min.css',
// 	'/src/css/page.css',
// 	'/src/services/idb.js',
// 	'/src/services/dbController.js',
// 	'/src/data/teamData.js',
// 	'/src/data/favoriteData.js',
// 	'/assets/bundesligaLogo.png',
// 	'/assets/premiereleagueLogo.png',
// 	'/assets/serieA.png',
// 	'/assets/laLiga.png',
// 	'/assets/football.png',
// 	'/icons/favicon.ico',
// 	'/icons/logo96.png',
// 	'/icons/logo128.png',
// 	'/icons/logo192.png',
// 	'/icons/logo512.png',
// 	'/fonts/FiraSans-Regular.ttf',
// 	'/fonts/FiraSans-Medium.ttf'
// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
// 		caches.open(CACHE_NAME)
// 			.then((cache) => {
// 				return cache.addAll(urlsToCache);
// 			}),
//   );
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
// 		caches.keys()
// 			.then((cacheNames) => {
// 				return Promise.all(
// 					cacheNames.map((cacheName) => {
// 						if (cacheName != CACHE_NAME && cacheName.startsWith("footbola-pwa-app")) {
// 							return caches.delete(cacheName);
// 						}
// 					}),
// 				);
// 			}),
//   	);
// });

// self.addEventListener('fetch', function(event) {
// 	event.respondWith(
// 		caches.open(CACHE_NAME).then(function (cache) {
// 			return cache.match(event.request).then(response => {
// 				const fetchPromise = fetch(event.request).then(networkResponse => {
// 					cache.put(event.request, networkResponse.clone());
// 					return networkResponse;
// 				})
// 				return response || fetchPromise;
// 			})
// 		})
// 	)
// })

// self.addEventListener('push', event => {
// 	const title = 'Footbola Notifications'
// 	let body;
	
// 	if (event.data) {
// 		body = event.data.text();
// 	} else {
// 		body = 'Push message not payload';
// 	}

// 	let options = {
// 		title: title,
// 		body: body,
// 		icon: 'icons/logo192.png',
// 		vibrate: [100, 50, 100],
// 		data: {
//       dateOfArrival: Date.now(),
//       primaryKey: 1
//     }
// 	}

// 	event.waitUntil(self.registration.showNotification('Push Notification', options));
// });

