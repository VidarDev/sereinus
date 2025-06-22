const CACHE_NAME = 'amai-v1';
const STATIC_CACHE_NAME = 'amai-static-v1';
const RUNTIME_CACHE_NAME = 'amai-runtime-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icon.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

const CACHE_CONFIG = {
  images: { strategy: CACHE_STRATEGIES.CACHE_FIRST, maxAge: 86400000 }, // 24h
  static: { strategy: CACHE_STRATEGIES.CACHE_FIRST, maxAge: 604800000 }, // 7d
  api: { strategy: CACHE_STRATEGIES.NETWORK_FIRST, maxAge: 300000 }, // 5m
  pages: { strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, maxAge: 86400000 } // 24h
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== RUNTIME_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
      .then(() => {})
      .catch((error) => {
        console.error('[SW] Error:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!request.url.startsWith('http')) {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  const cacheStrategy = getCacheStrategy(request);
  
  switch (cacheStrategy.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(handleCacheFirst(request, cacheStrategy));
      break;
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(handleNetworkFirst(request, cacheStrategy));
      break;
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(handleStaleWhileRevalidate(request, cacheStrategy));
      break;
    
    default:
      break;
  }
});

self.addEventListener('message', (event) => {  
  if (isExtensionMessage(event)) {
    return;
  }
  
  if (!event.data || typeof event.data !== 'object') {
    return;
  }

  const { type } = event.data;
  const port = event.ports?.[0];
  
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
    port?.postMessage({ success: true });
  } else if (type === 'GET_VERSION') {
    port?.postMessage();
  } else {
    port?.postMessage({ error: 'Type de message non reconnu' });
  }
});

function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Images
  if (request.destination === 'image' || 
      /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname)) {
    return CACHE_CONFIG.images;
  }
  
  // (CSS, JS, fonts)
  if (request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font' ||
      pathname.includes('/_next/static/') ||
      /\.(css|js|woff|woff2|ttf|eot)$/i.test(pathname)) {
    return CACHE_CONFIG.static;
  }
  
  // APIs and data
  if (pathname.startsWith('/api/') || 
      pathname.includes('/actions/')) {
    return CACHE_CONFIG.api;
  }
  
  // Navigation pages
  if (request.mode === 'navigate' || 
      request.destination === 'document') {
    return CACHE_CONFIG.pages;
  }
  
  // Default: no cache
  return { strategy: null };
}

async function handleCacheFirst(request, config) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('[SW] Error Cache First for:', request.url);
    
    // Fallback to cache even if expired
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to main page for navigation
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

async function handleNetworkFirst(request, config) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {    
    const cachedResponse = await caches.match(request);
    if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function handleStaleWhileRevalidate(request, config) {
  const cachedResponse = await caches.match(request);
  
  // Always try to update in the background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors in stale-while-revalidate mode
  });
  
  // Return the cache immediately if it exists
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for the network response
  return fetchPromise;
}

function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  
  return (now.getTime() - responseDate.getTime()) > maxAge;
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
});

// Utility function to detect extension messages
function isExtensionMessage(event) {
  // Chrome extensions often use these patterns
  if (event.origin === 'chrome-extension://' || 
      event.origin === 'moz-extension://' ||
      event.origin === 'safari-extension://') {
    return true;
  }
  
  // Check if the message comes from an extension script
  if (event.data && typeof event.data === 'object') {
    const extensionMarkers = ['__EXTENSION__', 'extension', 'chrome', 'browser'];
    const dataString = JSON.stringify(event.data).toLowerCase();
    
    for (const marker of extensionMarkers) {
      if (dataString.includes(marker)) {
        return true;
      }
    }
  }
  
  return false;
}