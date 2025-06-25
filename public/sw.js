const SW_VERSION = '1.0.1';

self.addEventListener('install', (event) => {
	console.log(`[SW] Service Worker v${SW_VERSION} installed`);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	console.log(`[SW] Service Worker v${SW_VERSION} activated (no cache)`);
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
	event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
	if (!event.data) return;

	try {
		const data = event.data.json();
		const options = {
			body: data.body || 'Nouveau message',
			icon: '/icon.png',
			badge: '/icon.png',
			vibrate: [100, 50, 100],
			data: data.data || {},
			actions: data.actions || []
		};

		event.waitUntil(
			self.registration.showNotification(data.title || 'Sereinus', options)
		);
	} catch (error) {
		console.error('[SW] Erreur push:', error);
	}
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	
	if (event.action) {
		console.log('[SW] Action notification:', event.action);
	} else {
		event.waitUntil(
			self.clients.matchAll({ type: 'window' }).then((clients) => {
				if (clients.length > 0) {
					return clients[0].focus();
				}
				return self.clients.openWindow('/');
			})
		);
	}
});

// No listener 'message' - no request interception
// No cache API - no storage
// Application always online and up to date
