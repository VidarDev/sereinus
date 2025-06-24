
const SW_VERSION = '1.0.0';

console.log(`[SW] Service Worker v${SW_VERSION} starting...`);

self.addEventListener('install', (event) => {
	console.log(`[SW] Installing v${SW_VERSION}`);
	
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	console.log(`[SW] Activating v${SW_VERSION}`);
	
	event.waitUntil(
		// Take control of all clients immediately
		clients.claim().then(() => {
			console.log('[SW] Claimed all clients');
			
			// Notify all clients of activation
			return clients.matchAll().then(clients => {
				clients.forEach(client => {
					client.postMessage({
						type: 'SW_ACTIVATED',
						version: SW_VERSION
					});
				});
			});
		})
	);
});

self.addEventListener('message', (event) => {
	console.log('[SW] Message received:', event.data);
	
	if (event.data && event.data.type === 'SKIP_WAITING') {
		event.ports[0].postMessage({ success: true });
		self.skipWaiting();
	}
	
	if (event.data && event.data.type === 'GET_VERSION') {
		event.ports[0].postMessage({ version: SW_VERSION });
	}
});

// No listener 'fetch' - no request interception
// No cache API - no storage
// Application always online and up to date
