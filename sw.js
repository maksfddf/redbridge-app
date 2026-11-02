// RedBridge — Service Worker для Web Push (iPhone/Android/десктоп).
// Задача одна: показать системное уведомление, когда приложение закрыто.
// Кэширования нет специально — приложение всегда должно открываться свежим.

self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });

self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) {
    try { d = { body: event.data ? event.data.text() : '' }; } catch (_) { d = {}; }
  }
  const title = d.title || 'RedBridge';
  const opts = {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'redbridge',
    renotify: true,
    requireInteraction: !!d.require,
    silent: false,
    data: { url: d.url || './index.html' },
    vibrate: [220, 100, 220, 100, 220]
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      try {
        if ('focus' in c) { await c.focus(); return; }
      } catch (e) {}
    }
    try { await self.clients.openWindow(target); } catch (e) {}
  })());
});
