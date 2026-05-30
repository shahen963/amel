// ===== شاهين إكسبريس — Firebase Service Worker للإشعارات =====
// ضع هذا الملف في ROOT المشروع (نفس مكان index.html)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey:            "AIzaSyB7UYhxlp9ey6h5y-93XGvACr2XDL2iNys",
    authDomain:        "shaheen-5a1bc.firebaseapp.com",
    projectId:         "shaheen-5a1bc",
    storageBucket:     "shaheen-5a1bc.firebasestorage.app",
    messagingSenderId: "8978921835",
    appId:             "1:8978921835:web:398e60e58dd4edf94df42e"
});

const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية (الموقع مغلق أو مخفي)
messaging.onBackgroundMessage(function(payload) {
    const title = payload.notification?.title || 'شاهين إكسبريس 🦅';
    const body  = payload.notification?.body  || 'تحديث على طلبك';
    const icon  = 'https://i.postimg.cc/QxzPkmPf/Whats-App-Image-2026-04-10-at-6-22-30-PM-t7edrz.jpg';

    self.registration.showNotification(title, {
        body,
        icon,
        badge: icon,
        dir: 'rtl',
        lang: 'ar',
        vibrate: [200, 100, 200],
        tag: 'shahen-order-update',
        renotify: true,
        data: payload.data || {}
    });
});

// عند الضغط على الإشعار — فتح الموقع
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
