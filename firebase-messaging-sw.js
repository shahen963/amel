// firebase-messaging-sw.js — تطبيق العميل
// [FEATURE-WEB-PUSH] Service Worker لإشعارات الويب — يستقبل الإشعارات حتى لو المتصفح مغلق تماماً
// أو بالخلفية. يجب أن يبقى بهذا الاسم بالضبط وبجذر الموقع (نفس مستوى index.html).

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ── إعدادات مشروع Firebase الخاص بتطبيق العميل (shahinexpress-e843d) ──
firebase.initializeApp({
  apiKey: "AIzaSyBJULSIdyrtoH3Z3CagsvEbYeUM7JSq3cI",
  authDomain: "shahinexpress-e843d.firebaseapp.com",
  projectId: "shahinexpress-e843d",
  storageBucket: "shahinexpress-e843d.firebasestorage.app",
  messagingSenderId: "616694890269",
  appId: "1:616694890269:android:0004c75123e6bb047cebf4"
});

const messaging = firebase.messaging();

// استقبال الإشعار والتطبيق مغلق/بالخلفية — يعرضه Service Worker مباشرة
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'شاهين إكسبريس';
  const body = payload.notification?.body || 'لديك إشعار جديد';
  self.registration.showNotification(title, {
    body,
    icon: 'https://i.postimg.cc/QxzPkmPf/Whats-App-Image-2026-04-10-at-6-22-30-PM-t7edrz.jpg',
    badge: 'https://i.postimg.cc/QxzPkmPf/Whats-App-Image-2026-04-10-at-6-22-30-PM-t7edrz.jpg',
    vibrate: [200, 100, 200],
    dir: 'rtl',
    lang: 'ar',
    requireInteraction: true
  });
});

// عند الضغط على الإشعار — فتح/تركيز نافذة التطبيق
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
