importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
	console.log(`Workbox load successfully`);
	const apply = (context, files) => {
		return files.map(([file, revision]) => ({
			url: context + file,
			revision
		}));
	};
	
	const {cacheNames, setCacheNameDetails} = workbox.core;
	
	setCacheNameDetails({
		prefix: 'footbola-pwa-app',
		suffix: 'v1',
		precache: 'app-shell',
		runtime: 'external-resource'
	});

	const pages = [
		['home.html', 1],
		['bundesliga.html', 1],
		['premiereleague.html', 1],
		['primeradivision.html', 1],
		['serieA.html', 1],
		['favorite.html', 1]
	];

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
	
	workbox.precaching.precacheAndRoute(
		[
			{url: '/', revision: 1},
			{url: '/index.html', revision: 1},
			{url: '/manifest.json', revision: 1},
			apply('/src/js/', scripts),
			apply('/assets/', assets),
			apply('/fonts/', fonts),
			apply('/icons/', icons),
			apply('/pages/', pages),
			apply('/src/css/', styles),
			apply('/src/libs/', libs),
			apply('/src/services/', services),
			apply('/src/data/', data)
		].flat()
	);
	
	workbox.routing.registerRoute(
		/^https:\/\/api\.football-data\.org\/v2/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'footbola-pwa-app-api-resource-v1',
		}),
	);
	
	workbox.routing.registerRoute(
		/.*(?:png|gif|jpg|jpeg|svg)$/,
		new workbox.strategies.CacheFirst({
			plugins: [
				new workbox.cacheableResponse.Plugin({
					statues: [0, 200]
				}),
			],
		}),
	);
} else {
	console.log(`Workbox load failed`);
}

self.addEventListener('push', event => {
	const title = 'Footbola Notifications'
	let body;
	
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message not payload';
	}

	let options = {
		title: title,
		body: body,
		icon: 'icons/logo192.png',
		vibrate: [100, 50, 100],
		data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
	};

	event.waitUntil(self.registration.showNotification('Push Notification', options));
});
