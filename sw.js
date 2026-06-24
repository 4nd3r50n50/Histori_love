const CACHE_NAME = 'historilove-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './imagenes/pinguino_andy.png',
    './imagenes/kuromi_jessie.png',
    './imagenes/portada_musica.jpg',
    './imagenes/primer_recuerdo.png',
    './imagenes/lugar_especial.png',
    './imagenes/nuestra_cancion.png',
    './imagenes/proxima_aventura.png'
];

// Instalar el Service Worker y cachear los archivos principales
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activar el Service Worker y limpiar caches viejos
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia Network-First: intenta red primero, y si no hay internet va al caché
self.addEventListener('fetch', (e) => {
    // Solo manejar peticiones HTTP/HTTPS (ignora chrome-extension, etc.)
    if (!e.request.url.startsWith('http')) return;

    e.respondWith(
        fetch(e.request).then((response) => {
            // Guardar una copia en el caché si la petición es exitosa
            if (response.status === 200 && e.request.method === 'GET') {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseClone);
                });
            }
            return response;
        }).catch(() => {
            // Offline: servir desde caché
            return caches.match(e.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Si es una navegación, ir a index.html
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
