// ════════════════════════════════════════════════════
//   Service Worker — شاهين إكسبريس
//   يستقبل إشعارات الدفع (Push) ويعرضها حتى لو التطبيق
//   مغلق بالكامل أو الهاتف مقفل
// ════════════════════════════════════════════════════

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// ── استقبال إشعار الدفع وعرضه ──
self.addEventListener('push', (event) => {
    let data = { title: 'شاهين إكسبريس 🦅', body: 'لديك تحديث جديد على طلبك', url: '/' };
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        if (event.data) data.body = event.data.text();
    }

    const options = {
        body: data.body || '',
        icon: 'https://i.postimg.cc/QxzPkmPf/Whats-App-Image-2026-04-10-at-6-22-30-PM-t7edrz.jpg',
        badge: 'https://i.postimg.cc/QxzPkmPf/Whats-App-Image-2026-04-10-at-6-22-30-PM-t7edrz.jpg',
        vibrate: [200, 100, 200],
        dir: 'rtl',
        lang: 'ar',
        data: { url: data.url || '/' },
        tag: data.tag || 'shaheen-order-update',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'شاهين إكسبريس 🦅', options)
    );
});

// ── عند الضغط على الإشعار: فتح التطبيق ──
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});
