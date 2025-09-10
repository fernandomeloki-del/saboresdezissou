const CACHE_NAME = 'sabores-de-zissou-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update SW
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 🔔 NOTIFICAÇÕES PUSH

// Receber notificações push
self.addEventListener('push', (event) => {
  console.log('📱 Push recebido:', event);
  
  let notificationData = {
    title: 'Sabores de Zissou',
    body: 'Nova notificação!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'sabores-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '👀 Ver Detalhes'
      },
      {
        action: 'dismiss',
        title: '❌ Dispensar'
      }
    ]
  };

  // Se há dados na notificação, usar eles
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (error) {
      console.error('Erro ao processar dados push:', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notificação clicada:', event);
  
  event.notification.close();

  // Ação específica
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Apenas fecha a notificação
    return;
  } else {
    // Clique na notificação (não nas ações)
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Se já há uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        // Senão, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notificação fechada:', event);
  
  // Aqui você pode registrar analytics, etc.
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Fazer sync de dados offline, enviar pedidos pendentes, etc.
      console.log('Executando sincronização em background')
    );
  }
});