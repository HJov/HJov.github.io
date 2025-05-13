// Service Worker for Space Explorer PWA

const CACHE_NAME = 'space-explorer-v1';

// Files to cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/data.js',
  '/js/canvas-manager.js',
  '/data/topics.json',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add image files
  '/images/earth.jpg',
  '/images/mars.jpg',
  '/images/jupiter.jpg',
  '/images/blackhole.jpg',
  '/images/hubble.jpg',
  '/images/iss.jpg',
  '/images/nebula.jpg',
  '/images/apollo.jpg',
  // Add audio files
  '/audio/earth.mp3',
  '/audio/mars.mp3',
  '/audio/jupiter.mp3',
  '/audio/blackhole.mp3',
  '/audio/hubble.mp3',
  '/audio/iss.mp3',
  '/audio/nebula.mp3',
  '/audio/apollo.mp3'
];

// Install event - Cache files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  // Skip waiting forces newly installed service worker to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and content');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Cache addAll failed:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  // Ensure service worker takes control of the page immediately
  return self.clients.claim();
});

// Fetch event - Serve from cache, then network
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetch:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache responses from external domains to avoid CORS issues
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Cache the fetched response
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('[Service Worker] Cache put failed:', error);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // For navigation requests, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return a simple error for non-navigation requests
            return new Response('Network error occurred', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Push event - Handle push notifications
self.addEventListener('push', event => {
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Space Explorer',
        body: event.data.text(),
        icon: '/icons/icon-192x192.png'
      };
    }
  } else {
    notificationData = {
      title: 'Space Explorer',
      body: 'New space content available!',
      icon: '/icons/icon-192x192.png'
    };
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: '/icons/badge-72x72.png',
      data: {
        url: notificationData.url || '/'
      }
    })
  );
});

// Notification click event - Open the app when notification is clicked
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window/tab is open with the URL, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});