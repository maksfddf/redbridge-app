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
  const ua = (self.navigator && self.navigator.userAgent) || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const opts = {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    // Уникальный tag на каждое уведомление: iOS не должен схлопывать
    // второе сообщение в первое. Если tag не пришёл — тоже уникальный.
    tag: d.tag || ('redbridge-' + Date.now()),
    data: { url: d.url || './index.html' },
    silent: false
  };
  // iOS игнорирует (а иногда и отвергает) vibrate/renotify/requireInteraction.
  // На iPhone оставляем только базовые поля — звук остаётся системным.
  if (!isIOS) {
    opts.renotify = true;
    opts.requireInteraction = !!d.require;
    opts.vibrate = [220, 100, 220, 100, 220];
  }
  event.waitUntil(
    self.registration.showNotification(title, opts).catch(() => {
      // Страховка: если прошивка отвергла необязательное поле, показываем
      // уведомление без него. Лучше без вибрации, чем совсем без сообщения.
      return self.registration.showNotification(title, {
        body: opts.body, icon: opts.icon, data: opts.data, silent: false
      }).catch(() => {});
    })
  );
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
