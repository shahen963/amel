
function _restoreSavedCart() {
    try {
        const saved = JSON.parse(localStorage.getItem('shahen_saved_cart') || 'null');
        if (!saved || !saved.cart || saved.cart.length === 0) return;
        cart = saved.cart;
        currentResId = saved.resId;
        document.getElementById('cart-reminder-banner').style.display = 'none';
        if (typeof switchPage === 'function') switchPage('p-cart');
        else if (typeof nav === 'function') nav('p-cart');
        if (typeof renderCart === 'function') renderCart();
        if (typeof showNotify === 'function') showNotify('🛒 تم استرجاع سلتك بنجاح');
    } catch(e) {}
}
setTimeout(() => {
    try {
        const saved = JSON.parse(localStorage.getItem('shahen_saved_cart') || 'null');
        if (saved && saved.cart && saved.cart.length > 0 && (Date.now() - (saved.savedAt || 0)) < 48 * 60 * 60 * 1000) {
            const banner = document.getElementById('cart-reminder-banner');
            if (banner) banner.style.display = 'block';
        }
    } catch(e) {}
}, 4000);


/* ==== الكتلة التالية ==== */


(function() {
  function hideVideoSplash() {
    const el = document.getElementById('video-splash-overlay');
    if (el) { el.style.transition = 'opacity .35s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 380); }
  }
  window._hideVideoSplash = hideVideoSplash;
  const vid = document.getElementById('video-splash-player');
  if (vid) {
    vid.addEventListener('ended', hideVideoSplash);
    // [BUGFIX-VIDEO-PLACEHOLDER-FLASH] نُظهر الفيديو فقط لحظة بدء التشغيل الفعلي (حدث playing)،
    // بدل ما يكون ظاهراً من البداية — هذا يمنع نهائياً ظهور شاشة التحميل الافتراضية (زر التشغيل
    // الوردي) اللي كانت تومض قبل بدء الفيديو فعلياً، لأن الخلفية البنفسجية الصلبة تبقى وحدها
    // الظاهرة حتى تلك اللحظة بالضبط
    vid.addEventListener('playing', () => { vid.style.opacity = '1'; });
    vid.play().catch(() => { vid.muted = true; vid.play().catch(() => hideVideoSplash()); });
    // سقف أمان: حتى لو تعطّل الفيديو أو الحدث "ended" لأي سبب، لا تبقى الشاشة عالقة لأكثر من 6 ثواني
    setTimeout(hideVideoSplash, 6000);
  } else {
    hideVideoSplash();
  }

  // [FEATURE-UPFRONT-PERMISSIONS] الموقع فقط يُطلب مبكراً عند فتح التطبيق — الكاميرا/الميكروفون
  // تُطلب تلقائياً بشكل طبيعي فقط وقت استخدام ميزة الاستشارة الفعلية (تصوير/مكالمة صوتية)، لا حاجة
  // لطلبها مسبقاً بلا داعٍ عند فتح التطبيق
  if (window.Capacitor) {
    try {
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {}, { timeout: 8000 });
    } catch(e) {}
  }
})();


/* ==== الكتلة التالية ==== */


    const getStorage = (key) => {
        let val = localStorage.getItem(key);
        try { return JSON.parse(val) || []; } catch(e) { return []; }
    };
    const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

    // ===== [SEC-FIX-XSS] دالة تنقية HTML لمنع XSS - مطلوبة قبل أي innerHTML يحتوي بيانات مستخدم =====
    function escHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    // ===== نهاية [SEC-FIX-XSS] =====

    // ===== [SEC-FIX-XSS-ATTR] دالة تنقية مخصّصة للقيم التي تُدرَج داخل سمة onclick="..." =====
    // escHtml وحدها غير كافية هنا: المتصفح يفكّ ترميز HTML entities أولاً ثم ينفّذ محتوى onclick كـ JS،
    // فلو استخدمنا escHtml (التي تحوّل ' إلى &#x27;) فسيُعاد فكّها إلى ' حرفياً قبل التنفيذ فيكسر السلسلة
    // النصية في JS (أو يفتح ثغرة). لذلك: نهرب أحرف JS الخاصة أولاً (backslash ثم quote)، ثم نُرمّز الأحرف
    // التي قد تكسر سمة HTML نفسها (" و < و >) بترميز HTML عادي — وهذه الأخيرة تُفكّ بأمان قبل التنفيذ
    // لأنها ليست أحرفاً خاصة داخل سلسلة JS محاطة بعلامة اقتباس مفردة.
    function escJsAttr(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    // ===== نهاية [SEC-FIX-XSS-ATTR] =====

    // ===== [SEC-FIX-INPUT] دالة التحقق من صحة المبلغ المالي =====
    function sanitizeAmount(val) {
        const num = parseFloat(String(val).replace(/,/g, ''));
        if (isNaN(num) || num < 0 || num > 999999999) return 0;
        return Math.floor(num);
    }
    // ===== نهاية [SEC-FIX-INPUT] =====
    const SB_URL = "https://qfyggwffibmrlsvlzwgs.supabase.co";
    // [SEC-WARNING] هذا مفتاح publishable (anon key) وليس service_role key.
    // تأكد من ضبط Row Level Security (RLS) في Supabase لحماية البيانات.
    // لا تستخدم service_role key في الواجهة الأمامية أبداً.
    const SB_KEY = "sb_publishable_FIh2oKce-lHn0BVQgHWE1Q_erut1cMR";
    // [SEC-FIX-SESSION-COLLISION] مفتاح تخزين مخصّص لجلسة العميل — معزول عن لوحة الإدارة
    // [BUGFIX-CRITICAL-GLOBAL-TIMEOUT] نفس الإصلاح الجذري المطبَّق بتطبيق المندوب — 157 استعلاماً كان
    // بدون أي حماية زمنية، أي واحد منها ممكن يعلّق للأبد ويجمّد العملية المرتبطة فيه. حماية تلقائية
    // بمستوى الاتصال نفسه تشمل الجميع دفعة وحدة، بدل تعديل كل موضع يدوياً
    const _fetchWithTimeout = (url, options = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        return fetch(url, { ...options, signal: controller.signal })
            .finally(() => clearTimeout(timeoutId));
    };
    const _supabase = supabase.createClient(SB_URL, SB_KEY, {
        auth: { storageKey: 'shahin-customer-auth' },
        global: { fetch: _fetchWithTimeout }
    });

    // ════════════════════════════════════════════════════
    //  [CURRENCY-SYS] نظام دعم العملة السورية (قديمة/جديدة)
    //  مطابق تماماً لنفس النظام في لوحة الإدارة وتطبيق المندوب
    // ════════════════════════════════════════════════════
    window._currSettings = { mode:'both', newColor:'#22c55e', oldColor:'#ef4444' };
    window._loadCurrencySettings = async function(){
        try{
            const r = await fetch(SB_URL+'/rest/v1/app_currency_settings?select=*&id=eq.1&limit=1', {
                headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
            });
            if(!r.ok) return;
            const rows = await r.json();
            const row = rows[0];
            if(row){
                window._currSettings = {
                    mode: row.display_mode || 'both',
                    newColor: row.new_color || '#22c55e',
                    oldColor: row.old_color || '#ef4444'
                };
            }
        }catch(e){ /* استخدام الإعدادات الافتراضية بصمت لو فشل الجلب */ }
    };
    window.fmtSYP = function(oldAmount, opts){
        opts = opts || {};
        const s = window._currSettings || {mode:'both',newColor:'#22c55e',oldColor:'#ef4444'};
        const oldVal = Math.round(parseFloat(oldAmount)||0);
        const newVal = Math.round(oldVal/100);
        const oldStr = oldVal.toLocaleString('en-US') + ' ل.س';
        const newStr = newVal.toLocaleString('en-US') + ' ل.س';
        const sizeStyle = opts.size ? `font-size:${opts.size}px;` : '';
        const sep = opts.inline ? ' &nbsp; ' : '<br>';
        let html = '';
        // [UX-FIX-CURRENCY-EMPHASIS] الأخضر (العملة الجديدة) دائماً هو البارز بالحجم الكامل المطلوب،
        // والأحمر (العملة القديمة) دائماً أصغر وثانوي — بغض النظر عن وضع inline، بناءً على طلب المستخدم
        const oldSizeStyle = opts.size ? `font-size:${Math.round(opts.size * 0.72)}px;` : 'font-size:10px;';
        if(s.mode==='new') html = `<span style="color:${s.newColor};font-weight:bold;${sizeStyle}">🟢 ${newStr}</span>`;
        else if(s.mode==='old') html = `<span style="color:${s.oldColor};font-weight:bold;${sizeStyle}">🔴 ${oldStr}</span>`;
        else html = `<span style="color:${s.newColor};font-weight:bold;${sizeStyle}">🟢 ${newStr}</span>${sep}<span style="color:${s.oldColor};opacity:0.75;${oldSizeStyle}">🔴 ${oldStr}</span>`;
        return html;
    };
    window._loadCurrencySettings(); // تحميل فوري عند بدء التطبيق

    // ════════════════════════════════════════════════════
    //  [PUSH-NOTIF] نظام الإشعارات الحقيقية (تصل حتى لو التطبيق مغلق تماماً)
    // ════════════════════════════════════════════════════
    const _VAPID_PUBLIC_KEY = "BBuVEt0hXoVVn5rEwiFI_nHY8RBGmJCc6HhXADxruVOR4a-ozttF_0QKpCgFDxHFsuPeRk-XQspszlomUvcbHkw";

    function _urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
        return outputArray;
    }

    async function initPushNotifications() {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return; // المتصفح لا يدعم الإشعارات
            if (!currentUser || !currentUser.uid) return; // العميل غير مسجَّل دخول بعد

            const registration = await navigator.serviceWorker.register('/sw.js');

            // طلب الصلاحية فقط لو لم يُطلب من قبل (لا نُكرر الطلب على العميل في كل فتحة)
            if (Notification.permission === 'default') {
                const perm = await Notification.requestPermission();
                if (perm !== 'granted') return;
            }
            if (Notification.permission !== 'granted') return;

            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: _urlBase64ToUint8Array(_VAPID_PUBLIC_KEY)
                });
            }

            // حفظ الاشتراك في قاعدة البيانات (متجاهلين التكرار لو موجود مسبقاً)
            const subJson = subscription.toJSON();
            await _supabase.from('push_subscriptions').upsert({
                customer_id: currentUser.uid,
                endpoint: subJson.endpoint,
                p256dh: subJson.keys.p256dh,
                auth: subJson.keys.auth,
                updated_at: new Date().toISOString()
            }, { onConflict: 'endpoint' });
        } catch (e) {
            // فشل صامت — الإشعارات العادية داخل التطبيق تبقى تعمل كخيار احتياطي
        }
    }
    // تفعيل الإشعارات بعد دخول المستخدم بقليل (حتى لا يُربكه طلب الصلاحية فوراً عند الفتح)
    setTimeout(() => { try { initPushNotifications(); } catch(e) {} }, 3000);

    // [FIX-PROMO-MESSAGES] فحص دوري عن رسائل إعلامية جديدة من الإدارة — كل رسالة تظهر مرة واحدة فقط
    async function _checkPromoBroadcast() {
        try {
            const { data, error } = await _supabase.from('promo_broadcast_log').select('*').eq('target', 'customer').order('sent_at', { ascending: false }).limit(1).maybeSingle();
            if (error) { console.error('[FIX-PROMO-MESSAGES] خطأ أثناء الفحص:', error); return; }
            if (!data) { console.log('[FIX-PROMO-MESSAGES] لا توجد أي رسالة مُرسَلة بعد لهذا القسم'); return; }
            const lastSeenId = localStorage.getItem('shaheen_last_promo_id');
            console.log('[FIX-PROMO-MESSAGES] آخر رسالة بالسجل:', data.id, '| آخر رسالة شُوهدت محلياً:', lastSeenId);
            if (String(data.id) !== String(lastSeenId)) {
                localStorage.setItem('shaheen_last_promo_id', String(data.id));
                showNotify((data.heading ? data.heading + ': ' : '') + data.body, 'success');
                console.log('[FIX-PROMO-MESSAGES] تم عرض رسالة جديدة ✅');
            }
        } catch(e) { console.error('[FIX-PROMO-MESSAGES] استثناء غير متوقع:', e); }
    }
    setInterval(_checkPromoBroadcast, 20000); // [FIX-PROMO-MESSAGES] كل 20 ثانية بدل دقيقتين — استجابة أسرع بكثير
    setTimeout(_checkPromoBroadcast, 3000); // فحص أولي بعد فتح التطبيق

    // ===== [FIX-NATIVE-PUSH-BACKGROUND] إشعارات Firebase عبر Capacitor الأصلية (Native) =====
    // يعمل فقط داخل تطبيق أندرويد المبني عبر Capacitor — لا يؤثر إطلاقاً على نسخة الويب. هذا ما يجعل
    // وصول الإشعارات موثوقاً حتى مع إغلاق التطبيق بالكامل من الذاكرة، لأنه يمر عبر خدمة FCM على مستوى
    // نظام التشغيل مباشرة، لا عبر صفحة الويب أو Service Worker الذي يتوقف عند إغلاق التطبيق فعلياً.
    (function () {
        if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) return;
        const PN = window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications;
        if (!PN) return;

        async function _saveNativeCustomerToken(token) {
            if (!token || !currentUser || !currentUser.uid) return;
            try {
                await _supabase.from('customers').update({ fcm_token: token }).eq('id', currentUser.uid);
            } catch(e) { console.error('[FIX-NATIVE-PUSH] فشل حفظ التوكن:', e); }
        }

        async function _initNativePushCustomer() {
            try {
                // [BUGFIX-NOTIFICATION-CHANNEL] قناة إشعار صريحة بأعلى أولوية — كانت مفقودة تماماً،
                // وهذا سبب عدم ظهور الإشعار كـPop-up (يصل بصمت، يظهر فقط بسحب ستارة الإشعارات يدوياً)
                try {
                    await PN.createChannel({
                        id: 'shahin_orders_channel',
                        name: 'طلبات شاهين إكسبريس',
                        description: 'إشعارات تحديثات الطلبات والرسائل',
                        importance: 5, // IMPORTANCE_HIGH
                        visibility: 1,
                        sound: 'notif_sound', // نفس صوت تطبيق المندوب بالضبط
                        vibration: true,
                        lights: true
                    });
                } catch(chErr) { console.warn('[FIX-NATIVE-PUSH] تعذّر إنشاء قناة الإشعار:', chErr); }

                let perm = await PN.checkPermissions();
                if (perm.receive !== 'granted') perm = await PN.requestPermissions();
                if (perm.receive !== 'granted') return;
                await PN.register();
            } catch(e) { console.error('[FIX-NATIVE-PUSH] فشل تسجيل الإشعارات الأصلية:', e); }
        }

        PN.addListener('registration', (token) => {
            if (token && token.value) _saveNativeCustomerToken(token.value);
        });
        PN.addListener('registrationError', (err) => console.error('[FIX-NATIVE-PUSH] خطأ تسجيل:', err));
        PN.addListener('pushNotificationReceived', () => {
            if (typeof checkOrderAction === 'function' && currentOrderKey) checkOrderAction(currentOrderKey, '');
        });
        PN.addListener('pushNotificationActionPerformed', () => {
            if (typeof nav === 'function') nav('p-history');
        });

        // ننتظر تسجيل دخول العميل قبل التسجيل (نفس توقيت initPushNotifications أعلاه)
        setTimeout(() => { if (currentUser && currentUser.uid) _initNativePushCustomer(); }, 3200);
    })();
    // ===== نهاية إشعارات Capacitor الأصلية =====

    // [FEATURE-WEB-PUSH] إشعارات نسخة الويب (PWA) لتطبيق العميل — يعمل فقط بالمتصفح، لا يتعارض مع Native APK إطلاقاً
    if (!window.Capacitor && 'serviceWorker' in navigator && 'PushManager' in window) {
        (async function initWebPushCustomer() {
            try {
                const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                const tryRegisterToken = async () => {
                    if (typeof currentUser === 'undefined' || !currentUser || !currentUser.uid) return;
                    if (typeof firebase === 'undefined') return;
                    try {
                        if (!firebase.apps || firebase.apps.length === 0) {
                            firebase.initializeApp({
                                apiKey: "AIzaSyBuNbDhnXY7hl6khqjrm1qQjflnNUMKVe8",
                                authDomain: "shahinexpress-e843d.firebaseapp.com",
                                projectId: "shahinexpress-e843d",
                                storageBucket: "shahinexpress-e843d.firebasestorage.app",
                                messagingSenderId: "616694890269",
                                appId: "1:616694890269:web:6aaa861d3042b2377cebf4"
                            });
                        }
                        const messaging = firebase.messaging();
                        const perm = await Notification.requestPermission();
                        if (perm !== 'granted') return;
                        // ⚠️ [يحتاج إعداد] استبدل هذا بمفتاح VAPID الحقيقي من Firebase Console
                        // لمشروع shahinexpress-e843d تحديداً (مختلف عن مفتاح المندوب)
                        const VAPID_KEY = 'BO4CQ4FUq40UzbMzJ4MKQ92i1_G5W-u4K5oPLZ9lTZLsEQL4LKsIisSdLB2mluYEvsS4W2VwX5S0diVdEF9EGvs';
                        if (VAPID_KEY === 'ضع_مفتاح_VAPID_الخاص_بالعميل_هنا') { console.warn('[web-push] لم يُضبط مفتاح VAPID بعد'); return; }
                        const token = await messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
                        if (token && typeof _supabase !== 'undefined') {
                            await _supabase.from('push_tokens_v2').upsert(
                                [{ user_id: String(currentUser.uid), token, platform: 'web', app: 'customer' }],
                                { onConflict: 'token' }
                            );
                        }
                    } catch(e) { console.warn('[web-push] فشل التسجيل:', e); }
                };
                setTimeout(tryRegisterToken, 4000);
                setInterval(tryRegisterToken, 30000);
            } catch(e) { console.warn('[web-push] فشل تسجيل Service Worker:', e); }
        })();
    }

    // ════════════════════════════════════════════════════
    //  [END-CURRENCY-SYS]
    // ════════════════════════════════════════════════════

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('shahen_user') || 'null');
    } catch(e) {
        localStorage.removeItem('shahen_user');
        currentUser = null;
    }
    // ===== FIX-LOC-INIT: استعادة موقع المستخدم المحفوظ مسبقاً =====
    let userLoc = { lat: 35.1318, lng: 36.7578 }; // موقع افتراضي
    if (currentUser && currentUser.lat && currentUser.lng) {
        userLoc = { lat: currentUser.lat, lng: currentUser.lng };
    }
    let data = getStorage('cached_restaurants'); 
    let pharmacyData = getStorage('cached_pharmacies'); 
    let cart = [], currentResId = null, orderHistory = getStorage('shahen_local_history'), cancelInterval = null, isLoginMode = true;
    let _lastCheckedOrderState = null; // [FIX-CHAT-DUPLICATE] منع إعادة بناء الدردشة المتكررة لنفس الحالة
    let _orderNotesValue = ''; // [ORDER-NOTES] ملاحظات الطلب — يبقى محفوظاً عبر إعادة رسم السلة
    let currentOrderKey = localStorage.getItem('shahen_active_order_id'); 
    let profileMap = null, mapMarker = null, mapPickup = null, mapDropoff = null, markerPickup = null, markerDropoff = null;
    let pickupLoc = {lat:0, lng:0}, dropoffLoc = {lat:0, lng:0}, historyTab = 'active', currentRating = 0, lastStatusNotified = ""; 
    let discountAmount = 0, appliedCoupon = "", paymentMethod = 'cash', pointsDiscountUsed = 0;
    let pointsConfig = { pointsPerOrder: 0, moneyPerPoint: 0, minOrderForBonus: 99000, bonusPoints: 5 };
    let _serviceType = 'delivery'; // 'delivery' | 'pickup'
    // [REMOVED] لا يوجد اختيار لطريقة دفع لطلبات الاستلام إطلاقاً — الدفع يتم في المطعم مباشرة

    // [POINTS-MONEY] دالة موحّدة لتحديث القيمة النقدية لنقاط العميل أسفل رصيد النقاط
    function _updatePointsMoneyDisplay(){
        const el = document.getElementById('shahen-points-money');
        if(!el) return;
        const pts = (currentUser && currentUser.points) ? parseFloat(currentUser.points) : 0;
        const rate = pointsConfig.moneyPerPoint || 0;
        if(rate > 0 && pts > 0){
            el.innerText = `= ${(pts * rate).toLocaleString()} ل.س`;
        } else {
            el.innerText = '';
        }
    }
    let verificationCode = 0; 
    let lastMsgCount = 0; 
    let phFilter = 'all';

    // متغيرات إضافية للصيدلية والخرائط
    let selectedPharmacyId = null;
    let fullMap = null, fullMapMarker = null, activeMapType = null;

    // --- دالة توليد ID فريد دائماً بدون تكرار ---
    // تجمع الوقت الحالي بالملي ثانية + رقم عشوائي لضمان عدم التكرار
    // [FIX-ORDER-ID-COLLISION] عدّاد متزايد دائماً ضمن نفس الجلسة — يضمن استحالة تكرار نفس المعرّف
    // لطلبين يُنشآن من نفس المتصفح مهما كانت سرعة الضغط المتتالي أو التزامن، بصرف النظر عن التوقيت
    let _orderIdSeqCounter = 0;
    function generateUniqueId() {
        // [FIX-ORDER-ID-COLLISION] كان الاعتماد سابقاً على آخر 6 أرقام من الوقت (بدقة ملّي ثانية) +
        // 3 أرقام عشوائية فقط (900 احتمال) — إذا أُنشئ طلبان خلال نفس المللي ثانية (وارد جداً مع نقر
        // متتالٍ سريع)، كان هناك احتمال حقيقي غير مهمَل لتطابق المعرّفين بالكامل، مما يعني عملياً دمج/
        // استبدال بيانات أحد الطلبين بالآخر في قاعدة البيانات — وهذا هو السبب الجذري الحقيقي لمشكلة
        // "دمج بيانات الطلبين" التي وُصِفت. الحل الآن: دقة زمنية أعلى (جزء من الألف من الملّي ثانية
        // عبر performance.now())، عدّاد متسلسل يضمن عدم التكرار المطلق ضمن نفس الجلسة، وعشوائية أعلى
        // بكثير (6 أرقام بدل 3) لتقليل احتمال التصادم بين أجهزة/جلسات مختلفة إلى ما يقارب الصفر عملياً.
        _orderIdSeqCounter = (_orderIdSeqCounter + 1) % 100; // رقمان يضمنان تسلسلاً ضمن نفس الجلسة
        const timestamp = Date.now() % 1000000; // آخر 6 أرقام من الوقت (ملّي ثانية)
        const random = Math.floor(10000 + Math.random() * 90000); // 5 أرقام عشوائية بدل 3
        // [FIX-SAFE-INTEGER] الناتج 6+2+5 = 13 رقماً كحد أقصى — يبقى ضمن مجال الأعداد الصحيحة الدقيقة
        // في جافاسكريبت (2^53) بأمان تام، بخلاف محاولة أولى وصلت 16 رقماً وكانت ستفقد الدقة العددية
        return parseInt(String(timestamp) + String(_orderIdSeqCounter).padStart(2, '0') + String(random));
    }

    // دالة التبديل بين أحجام الشاشة (تعديل: إضافة إغلاق المينيو)
    function toggleSizeDropdown() {
        const menu = document.getElementById('size-dropdown-menu');
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    }

    function resizeAppUI(size) {
        resizeApp(size);
        document.getElementById('size-dropdown-menu').style.display = 'none';
        // حفظ الاختيار الجديد في localStorage وفي حساب المستخدم
        localStorage.setItem('shahen_display_size', size);
        if (currentUser) {
            _supabase.from('customers').update({ display_size: size }).eq('id', currentUser.uid).catch(() => {});
        }
        showNotify("تم تغيير حجم العرض بنجاح ✅", "info");
    }

    // ===== [SCREEN-SIZE-FUNC] دالة اختيار المقاس من مودال ما قبل الدخول =====
    function _selectScreenSize(size) {
        // حفظ في localStorage
        localStorage.setItem('shahen_display_size', size);
        // تطبيق المقاس فوراً
        resizeApp(size);
        // [SCREEN-SIZE-DB-FIX] حفظ في قاعدة البيانات إذا كان المستخدم مسجل دخول
        if (currentUser && currentUser.uid) {
            _supabase.from('customers').update({ display_size: size }).eq('id', currentUser.uid).catch(() => {});
        }
        // إخفاء المودال
        const _overlay = document.getElementById('screen-size-overlay');
        if (_overlay) _overlay.style.display = 'none';
    }
    // ===== نهاية SCREEN-SIZE-FUNC =====

    function resizeApp(size) {
        const shell = document.getElementById('main-app-shell');
        if (size === 'mobile') { shell.style.width = '375px'; shell.style.height = '812px'; shell.style.borderRadius = '40px'; }
        else if (size === 'tablet') { shell.style.width = '768px'; shell.style.height = '1024px'; shell.style.borderRadius = '40px'; }
        else if (size === 'desktop') { shell.style.width = '1024px'; shell.style.height = '100vh'; shell.style.borderRadius = '40px'; }
        else if (size === 'full') { shell.style.width = '100vw'; shell.style.height = '100vh'; shell.style.borderRadius = '0'; }
        setTimeout(() => { if(fullMap) fullMap.invalidateSize(); }, 600);
    }

    // دالة تبديل المظهر الصباحي والليلي
    function toggleTheme(mode) {
        const body = document.body;
        if(mode === 'light') {
            body.classList.add('light-mode');
            localStorage.setItem('shahen_theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('shahen_theme', 'dark');
        }
    }

    async function getSuggestions(val) {
        if (val.length < 3) return;
        const box = document.getElementById('search-suggestions');
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${val}&countrycodes=sy,sa&limit=5`);
            const res = await resp.json();
            if (res.length > 0) {
                // [SEC-PATCH-7] escHtml applied to display_name and lat/lon to prevent XSS from Nominatim
                box.innerHTML = res.map(item => {
                    // [SEC-FIX-NOMINATIM-XSS] display_name يأتي من Nominatim (بيانات خارجية غير موثوقة، من
                    // مساهمي OpenStreetMap) — escHtml وحدها غير كافية داخل onclick لأن المتصفح يفكّ ترميز
                    // HTML entities قبل تنفيذ الخاصية كـ JS، فيعيد أي علامة اقتباس مُرمَّزة إلى حرفها الأصلي
                    // ويكسر السلسلة النصية. نستخدم escJsAttr للقيمة داخل onclick، وescHtml للنص المعروض فقط.
                    const rawName = String(item.display_name || '');
                    const displayName = escHtml(rawName);
                    const jsAttrName = escJsAttr(rawName);
                    const safeLat = parseFloat(item.lat) || 0;
                    const safeLon = parseFloat(item.lon) || 0;
                    return `<div class="suggestion-item" onclick="selectSuggestion('${jsAttrName}', ${safeLat}, ${safeLon})">${displayName}</div>`;
                }).join('');
                box.style.display = 'block';
            }
        } catch(e) {}
    }

    function selectSuggestion(name, lat, lon) {
        const input = document.getElementById('full-map-search-input');
        input.value = name;
        document.getElementById('search-suggestions').style.display = 'none';
        const loc = { lat: parseFloat(lat), lng: parseFloat(lon) };
        fullMap.setView(loc, 16);
        fullMapMarker.setLatLng(loc);
        reverseGeocode(loc);
    }

    function formatUserAccount() {
        if(confirm("هل أنت متأكد من فرمتة بيانات الطلبات المحلية لهذا الحساب؟ (سيتم حذف السجل والطلبات النشطة من جهازك)")) {
            localStorage.removeItem('shahen_local_history');
            localStorage.removeItem('orders');
            localStorage.removeItem('shahen_active_order_id');
            orderHistory = [];
            cart = [];
            currentOrderKey = null;
            alert("تم تصفير الحساب بنجاح. سيتم تحديث الصفحة الآن 🦅");
            location.reload();
        }
    }

    function showNotify(msg, type = 'success') {
        const n = document.getElementById('in-app-notify');
        const icon = document.getElementById('notify-icon');
        document.getElementById('notify-msg').innerText = msg;
        n.className = 'show notify-' + type;
        icon.className = type === 'success' ? 'fas fa-check-circle' : (type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle');
        setTimeout(() => n.classList.remove('show'), 3000);
    }

    // ═══════════════════════════════════════════════════════════
    // [FIX-AUTH-REDESIGN] نظامان منفصلان تماماً: تسجيل الدخول (بريد فقط، لحسابات مفعَّلة) وإنشاء حساب
    // (بيانات كاملة ثم تفعيل). لا يوجد أي إنشاء تلقائي لمستخدم بمجرد كتابة بريد إلكتروني في شاشة الدخول.
    // ═══════════════════════════════════════════════════════════
    let _authSendInProgress = false;
    let _authResendCooldownUntil = 0;
    let _authResendTimer = null;
    let _authVerifyAttempts = 0;
    let _authLockUntil = 0;
    let _loginCurrentEmail = '';
    let _registerCurrentEmail = '';

    // [SEC-FIX-ADDRESS-REQUIRED-ALL-PATHS] فحص حيّ من قاعدة البيانات لوجود عنوان مسجَّل — مشترك
    // بين كل مسارات إنشاء الطلبات (الرئيسي، استشارة صيدلية، متجر تخصصي، أسرة منتجة). يرجع true لو
    // مسموح بالمتابعة، false لو يجب إيقاف الطلب (والرسالة المناسبة تُعرَض هنا مباشرة)
    // [SEC-FIX-RESTAURANTS-VIEW-REGRESSION] بعد تقييد جدول restaurants للإدارة فقط، أي قراءة مباشرة
    // منه من تطبيق العميل تفشل بصمت (RLS) — هذا كان يمنع تحديد موقع المطعم رغم وجوده فعلياً بالإدارة.
    // هذي الدالة تحوّل أي قراءة من 'restaurants' لتذهب لـ'restaurants_public' (نفس البيانات، بدون
    // access_code)، بينما تبقى 'pharmacies' كما هي (غير مقيَّدة، لا تحتاج تحويل).
    function _readTable(t) { return t === 'restaurants' ? 'restaurants_public' : t; }

    async function _verifyCustomerAddressLive(requiresAddress) {
        if (!requiresAddress) return true; // طلبات استلام لا تحتاج عنوان توصيل
        try {
            // [BUGFIX-ADDRESS-SOURCE] كان يفحص customers.address (عمود قديم من نظام العنوان الفردي
            // السابق)، بدل جدول customer_addresses الفعلي (نظام العناوين المتعددة المحفوظة الحالي) —
            // هذا كان يسمح بمرور عملاء بدون أي عنوان محفوظ فعلياً طالما عندهم قيمة قديمة بذاك العمود
            const { data: _addrCheck, error: _addrCheckErr } = await _supabase
                .from('customer_addresses').select('id').eq('customer_id', currentUser.uid).limit(1);
            if (_addrCheckErr) throw _addrCheckErr;
            if (!_addrCheck || _addrCheck.length === 0) {
                showNotify('⛔ يجب إضافة عنوان واحد على الأقل قبل إنشاء أي طلب', 'error');
                if (typeof openAddAddressModal === 'function') openAddAddressModal();
                return false;
            }
            return true;
        } catch (_addrCheckEx) {
            showNotify('⚠️ تعذّر التحقق من عنوانك حالياً، يرجى المحاولة مجدداً', 'error');
            return false;
        }
    }
    let _registerPendingData = null; // { name, phone, address, email }
    const _AUTH_SEND_COOLDOWN_MS = 45000;
    const _AUTH_MAX_VERIFY_ATTEMPTS = 5;
    const _AUTH_LOCK_MS = 60000;

    function _emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function _showAuthScreen(id) {
        ['login-step-email','login-step-code','register-step-form','register-step-code'].forEach(sid => {
            const el = document.getElementById(sid);
            if (el) el.style.display = (sid === id) ? 'block' : 'none';
        });
        if (_authResendTimer) clearInterval(_authResendTimer);
    }

    // [FIX-EMAIL-DOMAIN-CHIPS] يعمل الآن على أي حقل بريد بالاسم المُمرَّر (شاشة الدخول أو التسجيل)
    function _appendEmailDomain(inputId, domain) {
        const input = document.getElementById(inputId);
        if (!input) return;
        let val = input.value.trim();
        const atIdx = val.indexOf('@');
        if (atIdx === -1) { val = val + '@' + domain; } else { val = val.substring(0, atIdx) + '@' + domain; }
        input.value = val;
        input.focus();
    }

    function _startAuthResendCooldown(btnId) {
        _authResendCooldownUntil = Date.now() + _AUTH_SEND_COOLDOWN_MS;
        const btn = document.getElementById(btnId);
        if (_authResendTimer) clearInterval(_authResendTimer);
        _authResendTimer = setInterval(() => {
            const remaining = Math.ceil((_authResendCooldownUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                clearInterval(_authResendTimer);
                if (btn) { btn.disabled = false; btn.innerText = 'إعادة إرسال الرمز'; }
            } else {
                if (btn) { btn.disabled = true; btn.innerText = `إعادة الإرسال بعد ${remaining} ثانية`; }
            }
        }, 500);
    }

    // ───────────────────────────────────────────────────────────
    // تسجيل الدخول (بريد فقط — لا إنشاء تلقائي لأي حساب)
    // ───────────────────────────────────────────────────────────
    async function loginSendCode() {
        if (_authSendInProgress) return;
        const email = document.getElementById('login-email-input').value.trim().toLowerCase();
        if (!email) return showNotify("يرجى إدخال البريد الإلكتروني", "error");
        if (!_emailIsValid(email)) return showNotify("صيغة البريد الإلكتروني غير صحيحة", "error");

        try {
            const { data: _banCheck } = await _supabase.from('banned_emails').select('email').eq('email', email).maybeSingle();
            if (_banCheck) return showNotify("⛔ هذا البريد الإلكتروني محظور من استخدام التطبيق. تواصل مع الإدارة.", "error");
        } catch(_e) {}

        const _sendBtn = document.getElementById('login-send-btn');
        _authSendInProgress = true;
        if (_sendBtn) { _sendBtn.disabled = true; _sendBtn.innerText = '⏳ جاري التحقق...'; }
        try {
            // [FIX-AUTH-REDESIGN] فحص وجود الحساب أولاً — قبل إرسال أي رمز، وممنوع إنشاء أي شيء هنا
            // [FIX-DUPLICATE-KEY-V3] استخدام select عادي بدل maybeSingle() — الأخير يفشل بخطأ إن
            // وُجد أكثر من صف بنفس البريد (بيانات تجريبية قديمة متبقية)، مما كان يُظهَر خطأً كـ"غير
            // مسجَّل" رغم أن الحساب موجود فعلاً. نُفضِّل الصف المفعَّل إن وُجد أكثر من صف بالخطأ.
            // [SEC-FIX-RLS-VIEW] بعد إغلاق سياسات anon المفتوحة على customers، الفحص المسبق (قبل
            // تسجيل الدخول) لازم يستخدم customers_public_check (VIEW محدود الأعمدة) بدل الجدول
            // مباشرة، لأن anon ما عاد يقدر يقرأ الجدول الأصلي إطلاقاً.
            const { data: _dbCustRows } = await _supabase.from('customers_public_check').select('id,email,is_activated,account_status').eq('email', email).order('is_activated', { ascending: false }).limit(1);
            const dbCust = (_dbCustRows && _dbCustRows[0]) || null;
            if (!dbCust) {
                showNotify("هذا البريد الإلكتروني غير مسجل، يرجى إنشاء حساب جديد.", "error");
                return;
            }
            if (dbCust.account_status === 'blocked') {
                showNotify("⛔ حسابك محظور. يرجى التواصل مع الإدارة.", "error");
                return;
            }
            if (!dbCust.is_activated) {
                showNotify("⚠️ حسابك غير مفعَّل بعد، يرجى إكمال تفعيله أولاً", "error");
                // نوجّهه لإكمال التفعيل بدل الدخول
                _registerCurrentEmail = email;
                const { error: resendErr } = await _supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
                if (!resendErr) {
                    document.getElementById('register-sent-to-email').innerText = email;
                    _showAuthScreen('register-step-code');
                    document.querySelectorAll('.register-otp-box').forEach(b => b.value = '');
                    const firstBox = document.querySelector('.register-otp-box[data-idx="0"]');
                    if (firstBox) firstBox.focus();
                    showNotify("تم إرسال رمز تفعيل جديد لحسابك 📧");
                    _startAuthResendCooldown('register-resend-btn');
                }
                return;
            }
            // الحساب موجود ومفعَّل — أرسل رمز الدخول
            const { error } = await _supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
            if (error) {
                showNotify("تعذّر إرسال الرمز: " + error.message, "error");
                return;
            }
            _loginCurrentEmail = email;
            _authVerifyAttempts = 0; _authLockUntil = 0;
            document.getElementById('login-sent-to-email').innerText = email;
            document.getElementById('login-otp-status-msg').innerText = '';
            document.querySelectorAll('.login-otp-box').forEach(b => b.value = '');
            _showAuthScreen('login-step-code');
            const firstBox = document.querySelector('.login-otp-box[data-idx="0"]');
            if (firstBox) firstBox.focus();
            showNotify("تم إرسال رمز الدخول إلى بريدك 📧");
            _startAuthResendCooldown('login-resend-btn');
        } catch(_e) {
            showNotify("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً", "error");
        } finally {
            _authSendInProgress = false;
            if (_sendBtn) { _sendBtn.disabled = false; _sendBtn.innerText = 'إرسال رمز الدخول 📧'; }
        }
    }

    async function loginResendCode() {
        const _now = Date.now();
        if (_now < _authResendCooldownUntil) return;
        document.getElementById('login-email-input').value = _loginCurrentEmail;
        await loginSendCode();
    }

    async function _verifyLoginOtp() {
        const _now = Date.now();
        if (_now < _authLockUntil) {
            const secs = Math.ceil((_authLockUntil - _now) / 1000);
            document.getElementById('login-otp-status-msg').innerText = `⛔ محاولات كثيرة جداً. انتظر ${secs} ثانية`;
            return;
        }
        const boxes = document.querySelectorAll('.login-otp-box');
        const code = Array.from(boxes).map(b => b.value).join('');
        if (code.length < boxes.length) return;
        document.getElementById('login-otp-status-msg').innerText = '⏳ جاري التحقق...';
        try {
            const { data, error } = await _supabase.auth.verifyOtp({ email: _loginCurrentEmail, token: code, type: 'email' });
            if (error) {
                _authVerifyAttempts++;
                if (_authVerifyAttempts >= _AUTH_MAX_VERIFY_ATTEMPTS) {
                    _authLockUntil = Date.now() + _AUTH_LOCK_MS; _authVerifyAttempts = 0;
                    document.getElementById('login-otp-status-msg').innerText = '⛔ محاولات كثيرة جداً. انتظر دقيقة كاملة';
                } else {
                    document.getElementById('login-otp-status-msg').innerText = `❌ رمز غير صحيح أو منتهي الصلاحية (${_AUTH_MAX_VERIFY_ATTEMPTS - _authVerifyAttempts} محاولات متبقية)`;
                }
                document.querySelectorAll('.login-otp-box').forEach(b => b.value = '');
                boxes[0].focus();
                return;
            }
            document.getElementById('login-otp-status-msg').innerText = '✅ تم التحقق بنجاح';
            // [FIX-AUTH-RACE-CONDITION] رفع العلم فوراً لمنع أي تعارض مع المستمع العام القديم
            window._authFlowHandledSignIn = true;
            const { data: dbCust } = await _supabase.from('customers').select('*').eq('id', data.user.id).maybeSingle();
            if (!dbCust || !dbCust.is_activated) {
                // حالة نادرة: تحقّق نجح لكن الحساب غير مفعَّل فعلياً بقاعدة البيانات — لا نسمح بالدخول
                await _supabase.auth.signOut();
                showNotify("⚠️ حسابك غير مفعَّل بعد، يرجى إكمال إنشاء الحساب", "error");
                _showAuthScreen('login-step-email');
                return;
            }
            if (dbCust.account_status === 'blocked') {
                await _supabase.auth.signOut();
                showNotify('⛔ حسابك محظور. يرجى التواصل مع الإدارة.', 'error');
                _showAuthScreen('login-step-email');
                return;
            }
            currentUser = { uid: dbCust.id, name: dbCust.name, email: dbCust.email, phone: dbCust.phone, address: dbCust.address, points: dbCust.points, balance: dbCust.balance };
            localStorage.setItem('shahen_user', JSON.stringify(currentUser));
            _enterAppAfterLogin();
        } catch(_e) {
            document.getElementById('login-otp-status-msg').innerText = 'حدث خطأ غير متوقع، حاول مجدداً';
        }
    }

    // ───────────────────────────────────────────────────────────
    // إنشاء حساب جديد (بيانات كاملة أولاً، ثم تفعيل عبر رمز)
    // ───────────────────────────────────────────────────────────
    async function registerSendCode() {
        if (_authSendInProgress) return;
        const n = document.getElementById('reg-uName').value.trim();
        const _phRaw = document.getElementById('reg-uPhone').value.trim();
        const _countryCode = document.getElementById('reg-country-code').value;
        // [FIX-COUNTRY-CODE-PHONE] دمج مفتاح الدولة المختار مع الرقم المحلي — إزالة الصفر الأول إن
        // وُجد (الصيغة القياسية عند إضافة مفتاح دولي)، فيصبح الرقم المخزَّن دولياً كاملاً وغير قابل
        // للَّبس عند بناء روابط واتساب لاحقاً بغض النظر عن جنسية الرقم
        const _phLocal = _phRaw.replace(/^0+/, '');
        const ph = _phRaw ? (_countryCode + _phLocal) : '';
        const addr = document.getElementById('reg-uAddress').value.trim();
        const email = document.getElementById('reg-uEmail').value.trim().toLowerCase();
        if (!n || !_phRaw || !addr || !email) return showNotify("يرجى إكمال كافة الحقول", "error");
        if (!_emailIsValid(email)) return showNotify("صيغة البريد الإلكتروني غير صحيحة", "error");

        try {
            const { data: _banCheck } = await _supabase.from('banned_emails').select('email').eq('email', email).maybeSingle();
            if (_banCheck) return showNotify("⛔ هذا البريد الإلكتروني محظور من استخدام التطبيق.", "error");
        } catch(_e) {}

        const _sendBtn = document.getElementById('register-send-btn');
        _authSendInProgress = true;
        if (_sendBtn) { _sendBtn.disabled = true; _sendBtn.innerText = '⏳ جاري الإنشاء...'; }
        try {
            // [FIX-AUTH-REDESIGN] فحص إن كان البريد مسجَّلاً بالفعل ومفعَّلاً
            // [FIX-DUPLICATE-KEY-V3] نفس التحصين ضد صفوف مكرَّرة محتملة من بيانات تجريبية سابقة
            // [SEC-FIX-RLS-VIEW] نفس السبب: استخدام customers_public_check بدل customers مباشرة
            const { data: _existingRows } = await _supabase.from('customers_public_check').select('id,is_activated').eq('email', email).order('is_activated', { ascending: false }).limit(1);
            const existing = (_existingRows && _existingRows[0]) || null;
            if (existing && existing.is_activated) {
                showNotify("هذا البريد الإلكتروني مستخدم بالفعل، يرجى تسجيل الدخول.", "error");
                return;
            }

            // [FIX-PHONE-UNIQUE] فحص إن كان رقم الجوال مستخدَماً بالفعل من قبل حساب آخر مفعَّل
            // [SEC-FIX-RLS-VIEW] نفس السبب: استخدام customers_public_check بدل customers مباشرة
            const { data: existingPhone } = await _supabase.from('customers_public_check').select('id,email').eq('phone', ph).eq('is_activated', true).maybeSingle();
            if (existingPhone && existingPhone.email !== email) {
                showNotify("رقم الجوال مستخدم بالفعل.", "error");
                return;
            }

            const { error } = await _supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, data: { full_name: n } } });
            if (error) {
                showNotify("تعذّر إرسال رمز التفعيل: " + error.message, "error");
                return;
            }

            // [FIX-AUTH-ID-MISMATCH] لا نُنشئ أو نُحدِّث أي صف في customers هنا إطلاقاً — معرّف
            // المستخدم الحقيقي في نظام المصادقة (auth.users.id) غير معروف بعد في هذه اللحظة، ولا
            // يتوفر إلا بعد نجاح التحقق من الرمز في verifyOtp(). إنشاء الصف الآن بمعرّف عشوائي منفصل
            // كان يعني أن أي تحديث لاحق لحالة "التفعيل" باستخدام المعرّف الحقيقي لن يجد هذا الصف
            // إطلاقاً، فيبقى الحساب غير مفعَّل بقاعدة البيانات إلى الأبد رغم دخول المستخدم فعلياً محلياً.
            // نحتفظ فقط بالبيانات مؤقتاً بالذاكرة، وننشئ الصف الحقيقي بعد التحقق الناجح مباشرة.

            _registerCurrentEmail = email;
            _registerPendingData = { name: n, phone: ph, address: addr, email };
            _authVerifyAttempts = 0; _authLockUntil = 0;
            document.getElementById('register-sent-to-email').innerText = email;
            document.getElementById('register-otp-status-msg').innerText = '';
            document.querySelectorAll('.register-otp-box').forEach(b => b.value = '');
            _showAuthScreen('register-step-code');
            const firstBox = document.querySelector('.register-otp-box[data-idx="0"]');
            if (firstBox) firstBox.focus();
            showNotify("تم إرسال رمز التفعيل إلى بريدك 📧");
            _startAuthResendCooldown('register-resend-btn');
        } catch(_e) {
            showNotify("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً", "error");
        } finally {
            _authSendInProgress = false;
            if (_sendBtn) { _sendBtn.disabled = false; _sendBtn.innerText = 'إنشاء حساب 🦅'; }
        }
    }

    async function registerResendCode() {
        const _now = Date.now();
        if (_now < _authResendCooldownUntil) return;
        _authSendInProgress = true;
        try {
            const { error } = await _supabase.auth.signInWithOtp({ email: _registerCurrentEmail, options: { shouldCreateUser: true } });
            if (!error) { showNotify("تم إعادة إرسال رمز التفعيل 📧"); _startAuthResendCooldown('register-resend-btn'); }
        } finally { _authSendInProgress = false; }
    }

    async function _verifyRegisterOtp() {
        const _now = Date.now();
        if (_now < _authLockUntil) {
            const secs = Math.ceil((_authLockUntil - _now) / 1000);
            document.getElementById('register-otp-status-msg').innerText = `⛔ محاولات كثيرة جداً. انتظر ${secs} ثانية`;
            return;
        }
        const boxes = document.querySelectorAll('.register-otp-box');
        const code = Array.from(boxes).map(b => b.value).join('');
        if (code.length < boxes.length) return;
        document.getElementById('register-otp-status-msg').innerText = '⏳ جاري التحقق...';
        try {
            const { data, error } = await _supabase.auth.verifyOtp({ email: _registerCurrentEmail, token: code, type: 'email' });
            if (error) {
                _authVerifyAttempts++;
                if (_authVerifyAttempts >= _AUTH_MAX_VERIFY_ATTEMPTS) {
                    _authLockUntil = Date.now() + _AUTH_LOCK_MS; _authVerifyAttempts = 0;
                    document.getElementById('register-otp-status-msg').innerText = '⛔ محاولات كثيرة جداً. انتظر دقيقة كاملة';
                } else {
                    document.getElementById('register-otp-status-msg').innerText = `❌ رمز غير صحيح أو منتهي الصلاحية (${_AUTH_MAX_VERIFY_ATTEMPTS - _authVerifyAttempts} محاولات متبقية)`;
                }
                document.querySelectorAll('.register-otp-box').forEach(b => b.value = '');
                boxes[0].focus();
                return;
            }
            // [FIX-AUTH-RACE-CONDITION] يجب رفع هذا العلم فوراً هنا، قبل أي عملية إضافية — المستمع
            // العام القديم (onAuthStateChange) يتفاعل مع حدث "SIGNED_IN" بشكل غير متزامن فور نجاح
            // verifyOtp، وقد يسبق تنفيذه إنشاء صف العميل أدناه. سابقاً كان هذا العلم يُرفَع في نهاية
            // الدالة، مما يترك نافذة زمنية حقيقية يستطيع خلالها ذلك المستمع أن يجد "لا يوجد صف عميل
            // بعد" فيسجّل خروج المستخدم فوراً (auth.signOut())، مما قد يعطّل صلاحية عملية الإدراج
            // التالية ويفسّر بدقة سبب عدم حفظ الحساب فعلياً رغم ظهور رسالة النجاح.
            window._authFlowHandledSignIn = true;

            // [FIX-AUTH-ID-MISMATCH] الآن فقط نعرف المعرّف الحقيقي للمستخدم في نظام المصادقة.
            // [FIX-DUPLICATE-KEY-V3] تبسيط جذري نهائي: بدل أي منطق شرطي (تحقّق ثم قرّر، أو upsert)
            // قد يفشل بطرق غير متوقعة، نحذف ببساطة أي صف موجود بنفس البريد (مهما كان عدده أو معرّفه)
            // أولاً وبلا أي شرط، ثم ننشئ صفاً واحداً جديداً نظيفاً مباشرة. هذا يضمن رياضياً عدم بقاء
            // أي صف مكرَّر بنفس البريد إطلاقاً، ويزيل احتمال تعارض المفتاح الأساسي نهائياً.
            const p = _registerPendingData || {};
            const _custPayload = {
                email: _registerCurrentEmail, name: p.name, phone: p.phone, address: p.address,
                points: 0, balance: 0, is_activated: true
            };
            await _supabase.from('customers').delete().eq('email', _registerCurrentEmail);
            const { error: _insErr } = await _supabase.from('customers').insert([{ id: data.user.id, ..._custPayload, auto_username: _generateAutoUsername('CUS') }]);
            if (_insErr) {
                document.getElementById('register-otp-status-msg').innerText = '⚠️ تم التحقق لكن تعذّر إنشاء الحساب: ' + _insErr.message;
                return;
            }
            document.getElementById('register-otp-status-msg').innerText = '✅ تم تفعيل حسابك بنجاح';
            currentUser = { uid: data.user.id, name: p.name, email: p.email || data.user.email, phone: p.phone, address: p.address, points: 0, balance: 0 };
            localStorage.setItem('shahen_user', JSON.stringify(currentUser));
            showNotify("🎉 تم إنشاء حسابك وتفعيله بنجاح");
            _enterAppAfterLogin();
        } catch(_e) {
            document.getElementById('register-otp-status-msg').innerText = 'حدث خطأ غير متوقع، حاول مجدداً';
        }
    }

    // [FIX-AUTH-REDESIGN] تنقّل تلقائي بين خانات كل مجموعة (دخول/تسجيل) بشكل مستقل + تحقق تلقائي
    document.addEventListener('DOMContentLoaded', () => {
        function _wireOtpGroup(selector, verifyFn) {
            const boxes = document.querySelectorAll(selector);
            boxes.forEach((box, i) => {
                box.addEventListener('input', () => {
                    box.value = box.value.replace(/[^0-9]/g, '').slice(0, 1);
                    if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
                    const allFilled = Array.from(boxes).every(b => b.value.length === 1);
                    if (allFilled) verifyFn();
                });
                box.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
                });
                box.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
                    if (!pasted) return;
                    boxes.forEach((b, idx) => { b.value = pasted[idx] || ''; });
                    const lastFilled = Math.min(pasted.length, boxes.length) - 1;
                    if (lastFilled >= 0) boxes[lastFilled].focus();
                    if (pasted.length >= boxes.length) verifyFn();
                });
            });
        }
        _wireOtpGroup('.login-otp-box', _verifyLoginOtp);
        _wireOtpGroup('.register-otp-box', _verifyRegisterOtp);
    });

    // [FIX-AUTH-REDESIGN] الانتقال الفعلي من شاشة الدخول إلى الصفحة الرئيسية
    function _enterAppAfterLogin() {
        document.getElementById('p-login').style.display = 'none';
        document.getElementById('my-name').innerText = currentUser.name || "--";
        document.getElementById('my-phone').innerText = currentUser.phone || "--";
        document.getElementById('my-address').innerText = currentUser.address || "--";
        { const _emailEl = document.getElementById('my-email'); if (_emailEl) _emailEl.innerText = currentUser.email || 'غير مسجَّل'; }
        document.getElementById('shahen-points').innerText = currentUser.points || "0";
        _updatePointsMoneyDisplay();
        _refreshMyFamilyChatsBadge();
        _listenMyFamilyChatsRealtime();

        if (!localStorage.getItem('shahen_pledge')) {
            document.getElementById('p-pledge').style.display = 'flex';
            document.getElementById('tab-bar').style.display = 'none';
            document.getElementById('manual-refresh').style.display = 'none';
            document.getElementById('admin-notif-bell').style.display = 'none';
            loadUserData();
        } else {
            document.getElementById('tab-bar').style.display = 'flex';
            document.getElementById('manual-refresh').style.display = 'flex';
            document.getElementById('admin-notif-bell').style.display = 'flex';
            nav('p-home');
            loadUserData();
        }
    }
    // ═══════════════════════════════════════════════════════════
    // نهاية [FIX-AUTH-REDESIGN]
    // ═══════════════════════════════════════════════════════════


    // [PERF-PATCH-LOGIN-4] مزامنة بيانات DB في الخلفية بعد ما يدخل المستخدم
    // لا تحجب الواجهة — تُحدَّث البيانات بهدوء
    async function _loginSyncDbProfile(userId) {
        try {
            const { data: dbCust, error: dbError } = await _supabase.from('customers').select('*').eq('id', userId).single();
            if (dbError || !dbCust) {
                // مستخدم جديد — أنشئ سجله
                const _newUser = {
                    id: userId,
                    name: currentUser.name,
                    email: currentUser.email,
                    phone: currentUser.phone,
                    address: currentUser.address,
                    points: 0,
                    balance: 0,
                    auto_username: _generateAutoUsername('CUS')
                };
                await _supabase.from('customers').insert([_newUser]).catch(() => {});
            } else {
                // مستخدم موجود — حدّث currentUser بالبيانات الكاملة من DB
                currentUser = { uid: dbCust.id, name: dbCust.name, email: dbCust.email, phone: dbCust.phone, address: dbCust.address, points: dbCust.points, balance: dbCust.balance };
                localStorage.setItem('shahen_user', JSON.stringify(currentUser));
                // تحديث الواجهة بالبيانات الحقيقية من DB
                document.getElementById('my-name').innerText = currentUser.name || "--";
                document.getElementById('my-phone').innerText = currentUser.phone || "--";
                document.getElementById('my-address').innerText = currentUser.address || "--";
                { const _emailEl = document.getElementById('my-email'); if (_emailEl) _emailEl.innerText = (currentUser.email && !currentUser.email.includes('@shaheen.local')) ? currentUser.email : 'غير مسجَّل'; }
                document.getElementById('shahen-points').innerText = currentUser.points || "0";
        _updatePointsMoneyDisplay(); // [POINTS-MONEY]
                // screen size sync
                const _loginSize = localStorage.getItem('shahen_display_size');
                if (_loginSize) _supabase.from('customers').update({ display_size: _loginSize }).eq('id', dbCust.id).catch(() => {});
                // auto_username
                if (!dbCust.auto_username) {
                    _supabase.from('customers').update({ auto_username: _generateAutoUsername('CUS') }).eq('id', dbCust.id).catch(() => {});
                }
            }
        } catch(_syncErr) { /* تجاهل — البيانات الأساسية موجودة من auth */ }
    }

    function acceptPledge() {
        if(!document.getElementById('pledge-check').checked) return showNotify("يجب الموافقة على التعهد للمتابعة", "error");
        localStorage.setItem('shahen_pledge', 'accepted');
        // [PLEDGE-FIX] إعادة ضبط style الـ pledge بالكامل ثم إخفاؤه
        const _pledgeDivAccept = document.getElementById('p-pledge');
        _pledgeDivAccept.style.cssText = 'display:none;';
        document.getElementById('tab-bar').style.display = 'flex';
        document.getElementById('manual-refresh').style.display = 'flex';
        document.getElementById('admin-notif-bell').style.display = 'flex';
        renderRes(); nav('p-home');
        // إصلاح المشكلة الرابعة: تحميل بيانات المستخدم بعد قبول التعهد مباشرة
        loadUserData();
    }

    function updatePromoBar(text) {
        const track = document.getElementById('promo-track');
        const typingContent = document.getElementById('typing-text-content');
        if (typingContent && text) typingContent.innerText = text + " 🦅";
        if (!track || !text) return;
        const item = `<span class="promo-text-item">${text} 🦅</span>`;
        track.innerHTML = item.repeat(12);
    }

    async function loadUserData() {
        // --- تعديل اختبارات: تصفير السجل القديم لمرة واحدة لضمان نظافة التجارب ---
        if(!localStorage.getItem('shahen_reset_v2')) {
            localStorage.removeItem('orders');
            localStorage.removeItem('shahen_active_order_id');
            localStorage.setItem('shahen_reset_v2', 'true');
        }

        // فحص المظهر المفضل
        const savedTheme = localStorage.getItem('shahen_theme');
        if(savedTheme === 'light') toggleTheme('light');
        else toggleTheme('dark');

        // ===== [SCREEN-SIZE-LOAD] تحميل مقاس الشاشة المحفوظ في حساب المستخدم =====
        if (currentUser) {
            try {
                const { data: _custData } = await _supabase.from('customers')
                    .select('display_size').eq('id', currentUser.uid).single();
                if (_custData && _custData.display_size) {
                    // [SCREEN-SIZE-FIX] الأولوية للـ localStorage (اختيار المستخدم الأخير)
                    // إذا لم يكن في localStorage نأخذ من DB
                    const _localSize = localStorage.getItem('shahen_display_size');
                    if (!_localSize) {
                        localStorage.setItem('shahen_display_size', _custData.display_size);
                        resizeApp(_custData.display_size);
                    }
                    // إذا كان في localStorage نطبقه ونحدّث DB ليطابقه
                    else if (_localSize !== _custData.display_size) {
                        _supabase.from('customers').update({ display_size: _localSize }).eq('id', currentUser.uid).catch(() => {});
                    }
                }
            } catch(_dsErr) { /* تجاهل خطأ تحميل المقاس */ }
        }
        // ===== نهاية SCREEN-SIZE-LOAD =====

        const { data: config } = await _supabase.from('app_config').select('*').eq('id', 1).single();
        if(config) {
            pointsConfig = { 
                pointsPerOrder: config.points_per_order, 
                moneyPerPoint: config.money_per_point,
                minOrderForBonus: config.min_order_for_bonus || 99000, 
                bonusPoints: config.bonus_points || 5 
            };
            // ===== [WASSAYNI-PRICE] تحميل سعر خدمة وصيني من الإعدادات =====
            if (config.wassayni_base_price) {
                window._wassayniBasePrice = config.wassayni_base_price;
            }
            if (config.wassayni_extra_price) {
                window._wassayniExtraPriceFromAdmin = config.wassayni_extra_price;
            }
            document.getElementById('points-config-display').innerText = `كل طلب يمنحك ${config.points_per_order} نقطة (1 نقطة = ${config.money_per_point} ل.س)`;
            _updatePointsMoneyDisplay(); // [POINTS-MONEY] تحديث فور توفر سعر النقطة
            updatePromoBar(config.news_text);
            // ===== تحميل رابط قناة تيليجرام المناديب من الإعدادات =====
            if (config.driver_telegram_channel) {
                // حفظ الرابط في _tgLinks للفتح الموثوق
                _tgLinks.admin   = config.driver_telegram_channel;
                _tgLinks.channel = config.driver_telegram_channel;
                // الاحتفاظ بـ href للتوافق
                const tgBtnSocial = document.getElementById('admin-telegram-social-btn');
                if (tgBtnSocial) tgBtnSocial.href = config.driver_telegram_channel;
                // [FIX-TG-6] عرض إشعار للمستخدم الجديد لدعوته للقناة
                const _tgShownKey = 'tg_invite_shown_' + (currentUser ? currentUser.uid : 'guest');
                if (!localStorage.getItem(_tgShownKey)) {
                    localStorage.setItem(_tgShownKey, '1');
                    setTimeout(() => {
                        showNotify('📢 انضم لقناة شاهين على تيليجرام للأخبار والعروض!', 'info');
                    }, 4000);
                }
            }
            // ===== نهاية تحميل رابط تيليجرام =====
            // ===== [CONTACT-SYNC] تحميل روابط التواصل الاجتماعي من قاعدة البيانات =====
            if (config.contact_whatsapp1) {
                const _waLink1 = document.getElementById('admin-whatsapp-link-1');
                if (_waLink1) _waLink1.href = 'https://wa.me/' + config.contact_whatsapp1.replace(/[^0-9]/g,'');
            }
            if (config.contact_facebook && config.contact_facebook.trim() !== '') {
                const _fbLink = document.getElementById('admin-facebook-link');
                if (_fbLink) _fbLink.href = config.contact_facebook;
            }
            if (config.contact_instagram && config.contact_instagram.trim() !== '') {
                const _igLink = document.getElementById('admin-instagram-link');
                if (_igLink) _igLink.href = config.contact_instagram;
            }
            if (config.driver_whatsapp_channel && config.driver_whatsapp_channel.trim() !== '') {
                const _waChLink = document.getElementById('admin-whatsapp-channel-link');
                const _waChWrap = document.getElementById('admin-whatsapp-channel-wrap');
                if (_waChLink) _waChLink.href = config.driver_whatsapp_channel;
                if (_waChWrap) _waChWrap.style.display = 'block';
            }
            // ===== [END-CONTACT-SYNC] =====
        }
        
        // [BUGFIX-DUPLICATE-CHANNEL] حارس يمنع تسجيل هذه القناة أكثر من مرة — كان يسبب خطأ
        // "cannot add postgres_changes callbacks... after subscribe()" لو أُعيد تنفيذ هذا الجزء
        // لأي سبب (مثل استئناف التطبيق من الخلفية بواسطة نظام أندرويد)
        if (!window._configUpdatesChannelInitialized) {
        window._configUpdatesChannelInitialized = true;
        _supabase.channel('config_updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_config', filter: 'id=eq.1' }, payload => {
            if(payload.new.news_text) {
                updatePromoBar(payload.new.news_text);
            }
            if(payload.new.points_per_order) pointsConfig.pointsPerOrder = payload.new.points_per_order;
            if(payload.new.min_order_for_bonus) pointsConfig.minOrderForBonus = payload.new.min_order_for_bonus;
            if(payload.new.bonus_points) pointsConfig.bonusPoints = payload.new.bonus_points;
            // ===== [WASSAYNI-PRICE-RT] تحديث سعر وصيني لحظياً =====
            if(payload.new.wassayni_base_price) { window._wassayniBasePrice = payload.new.wassayni_base_price; }
            if(payload.new.wassayni_extra_price) { window._wassayniExtraPriceFromAdmin = payload.new.wassayni_extra_price; }
            // ===== [END-WASSAYNI-PRICE-RT] =====
            // ===== تحديث رابط تيليجرام المناديب لحظياً =====
            if(payload.new.driver_telegram_channel) {
                _tgLinks.admin   = payload.new.driver_telegram_channel;
                _tgLinks.channel = payload.new.driver_telegram_channel;
                const tgBtnSocial = document.getElementById('admin-telegram-social-btn');
                if (tgBtnSocial) tgBtnSocial.href = payload.new.driver_telegram_channel;
                // [FIX-TG-6b] تحديث الروابط فور تغييرها من الإدارة
            }
            // ===== نهاية تحديث تيليجرام =====
            // ===== [CONTACT-SYNC-RT] تحديث روابط التواصل لحظياً =====
            if (payload.new.contact_whatsapp1) {
                const _rWa1 = document.getElementById('admin-whatsapp-link-1');
                if (_rWa1) _rWa1.href = 'https://wa.me/' + payload.new.contact_whatsapp1.replace(/[^0-9]/g,'');
            }
            if (payload.new.contact_facebook && payload.new.contact_facebook.trim() !== '') {
                const _rFb = document.getElementById('admin-facebook-link');
                if (_rFb) _rFb.href = payload.new.contact_facebook;
            }
            if (payload.new.contact_instagram && payload.new.contact_instagram.trim() !== '') {
                const _rIg = document.getElementById('admin-instagram-link');
                if (_rIg) _rIg.href = payload.new.contact_instagram;
            }
            if (payload.new.driver_whatsapp_channel && payload.new.driver_whatsapp_channel.trim() !== '') {
                const _rWaCh = document.getElementById('admin-whatsapp-channel-link');
                const _rWaWrap = document.getElementById('admin-whatsapp-channel-wrap');
                if (_rWaCh) _rWaCh.href = payload.new.driver_whatsapp_channel;
                if (_rWaWrap) _rWaWrap.style.display = 'block';
            }
            // ===== [END-CONTACT-SYNC-RT] =====
        }).subscribe();
        } // نهاية حارس [BUGFIX-DUPLICATE-CHANNEL]

        // ===== [RT-RESTAURANTS] مراقبة جدول المطاعم لحظياً — يضمن ظهور المطاعم الجديدة فور إضافتها من الإدارة =====
        _supabase.channel('restaurants_realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'restaurants' }, payload => {
            // مطعم جديد أُضيف من الإدارة — أعِد الجلب وحدّث العرض
            _cache.resTs = 0; // إبطال الكاش لإجبار الجلب
            _fetchResAndRender();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'restaurants' }, payload => {
            // مطعم عُدِّل من الإدارة — حدّث الكاش وأعِد العرض
            _cache.resTs = 0;
            _fetchResAndRender();
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'restaurants' }, payload => {
            // مطعم حُذف من الإدارة — أعِد الجلب وحدّث العرض
            _cache.resTs = 0;
            localStorage.removeItem('cached_restaurants'); // مسح الكاش القديم لضمان عدم ظهور المحذوف
            _cache.res = null;
            _fetchResAndRender();
        })
        .subscribe();
        // ===== [END-RT-RESTAURANTS] =====

        if(!currentUser) return;

        // [SEC-FIX-LOADUSERDATA-TRYCATCH] المنطق التالي (استعادة بيانات المستخدم، الطلب النشط، والملاحة)
        // كان بدون أي معالجة أخطاء على مستوى الدالة — أي استثناء من أي استدعاء Supabase (خصوصاً
        // .single() الذي يرمي خطأ فعلياً عند عدم وجود صف مطابق أو وجود أكثر من صف) كان يوقف الدالة
        // بالكامل بصمت، تاركاً المستخدم عالقاً على شاشة تسجيل الدخول/السبلاش بدون أي مخرج. الآن نضمن
        // أن أي فشل جزئي هنا لا يمنع المستخدم من الدخول لواجهة التطبيق على الأقل.
        try {

        const { data: dbUser } = await _supabase.from('customers').select('*').eq('id', currentUser.uid).single();
        if(dbUser) {
            currentUser.balance = dbUser.balance;
            currentUser.points = dbUser.points;
            currentUser.address = dbUser.address;
            currentUser.name = dbUser.name;
            currentUser.phone = dbUser.phone;
            // ===== FIX-LOC-3: استعادة الإحداثيات المحفوظة من قاعدة البيانات =====
            if(dbUser.lat && dbUser.lng) {
                currentUser.lat = dbUser.lat;
                currentUser.lng = dbUser.lng;
                userLoc = { lat: dbUser.lat, lng: dbUser.lng };
            }
            localStorage.setItem('shahen_user', JSON.stringify(currentUser));
        }

        document.getElementById('my-name').innerText = currentUser.name || "--";
        document.getElementById('my-phone').innerText = currentUser.phone || "--";
        document.getElementById('my-address').innerText = currentUser.address || "--";
        { const _emailEl = document.getElementById('my-email'); if (_emailEl) _emailEl.innerText = (currentUser.email && !currentUser.email.includes('@shaheen.local')) ? currentUser.email : 'غير مسجَّل'; }
        document.getElementById('shahen-points').innerText = currentUser.points || "0";
        _updatePointsMoneyDisplay(); // [POINTS-MONEY]
        
        fetchAdminMessages();
        initRealtimeNotifications();

        document.getElementById('p-login').style.display = 'none';
        document.getElementById('tab-bar').style.display = 'flex';
        document.getElementById('manual-refresh').style.display = 'flex';
        document.getElementById('admin-notif-bell').style.display = 'flex';
        if(!localStorage.getItem('shahen_pledge')) {
            // [PLEDGE-FIX] إظهار التعهد بشكل مضمون مع إخفاء tab-bar
            const _pledgeDiv = document.getElementById('p-pledge');
            _pledgeDiv.style.cssText = 'display:flex !important; position:absolute; top:0; left:0; width:100%; height:100%; background:var(--purple); z-index:10005; align-items:center; justify-content:center; padding:30px; text-align:center;';
            document.getElementById('tab-bar').style.display = 'none';
        } else {
            document.getElementById('tab-bar').style.display = 'flex';
            document.getElementById('manual-refresh').style.display = 'flex';
            document.getElementById('admin-notif-bell').style.display = 'flex';
            renderRes(); 
            
            // إصلاح 4: فحص دقيق للطلبات النشطة في السيرفر لضمان المزامنة الصامتة بدون انتقال خاطئ
            // نجلب حالات الاستشارة والمناديب معاً
            const { data: activeList } = await _supabase.from('sh_public_orders')
                .select('*')
                .eq('customer_id', currentUser.uid)
                .in('status', ['searching', 'pending', 'accepted', 'preparing', 'ready', 'consulting', 'awaiting_driver', 'store_invoice_sent', 'pickup_pending']);
                
            if(activeList && activeList.length > 0) {
                // ===== إصلاح ثبات الطلب: نرتب حسب الأحدث ونختار الطلب الصحيح =====
                // نعطي الأولوية للطلب المخزّن في localStorage إذا كان ما زال نشطاً في السيرفر
                const savedActiveId = localStorage.getItem('shahen_active_order_id');
                let latestActive = null;
                if (savedActiveId) {
                    latestActive = activeList.find(o => String(o.id) === String(savedActiveId));
                }
                // إذا لم يُوجد الطلب المحفوظ في القائمة النشطة، نأخذ الأحدث
                if (!latestActive) {
                    latestActive = activeList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                }
                currentOrderKey = latestActive.id;
                localStorage.setItem('shahen_active_order_id', latestActive.id);
                verificationCode = latestActive.verify_code;
                
                // تحديث السجل المحلي ليطابق السيرفر بصمت
                let localOrders = getStorage('orders');
                const exists = localOrders.find(o => String(o.id) === String(latestActive.id));
                if(!exists) {
                    localOrders.push({...latestActive, date: new Date(latestActive.created_at).toLocaleString('ar-SA')});
                } else {
                    localOrders = localOrders.map(o => String(o.id) === String(latestActive.id) ? {...o, status: latestActive.status, verify_code: latestActive.verify_code, driver_name: latestActive.driver_name || o.driver_name, total: latestActive.total || o.total, delivery_price: latestActive.delivery_price || o.delivery_price, order_type: o.order_type || latestActive.res_type} : o);
                }
                setStorage('orders', localOrders);

                // [FIX-REFRESH-PICKUP-BUG] فحوصات طلب الاستلام أولاً وقبل أي شيء آخر في هذه السلسلة —
                // كانت فحوصات أخرى (استشارة صيدلية/متجر تخصصي) تُطابق طلب استلام بالخطأ إن صادف أن كان
                // من نوع صيدلية، فيُفتح مساره الخاطئ بدل شاشة الاستلام. كما أضفنا إشارة احتياطية
                // (admin_sent_to_restaurant=true بلا driver_id) لتغطية أي طلب استلام قديم لم يُسجَّل له
                // service_type بشكل موثوق، بدل الاعتماد على هذا الحقل فقط.
                const _isRestoredPickup = latestActive.service_type === 'pickup' ||
                    (latestActive.admin_sent_to_restaurant === true && !latestActive.driver_id && latestActive.res_type !== 'pharmacy' && latestActive.is_consultation !== true);
                if (_isRestoredPickup && (latestActive.status === 'searching' || latestActive.status === 'pickup_pending')) {
                    // [PICKUP-RESUME] طلب استلام لا يزال بانتظار موافقة المطعم — أعد فتح شاشة الانتظار
                    _showPickupWaiting(latestActive.restaurant_name || 'المطعم', latestActive.id, latestActive.total || 0);
                    return;
                } else if (_isRestoredPickup && (latestActive.status === 'accepted' || latestActive.status === 'preparing' || latestActive.status === 'ready')) {
                    // [PICKUP-RESUME] المطعم وافق فعلاً — أعد فتح شاشة طلب الاستلام النهائية مباشرة، ولا
                    // نكمل أبداً لأي فرع آخر قد يعرض بيانات مندوب لا معنى لها لطلب استلام
                    const { data: freshPickupOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', latestActive.id).maybeSingle();
                    await _showPickupSuccess(freshPickupOrder || latestActive);
                    return;
                }

                // استعادة الحالة الحقيقية بدون انتقال خاطئ
                // ===== إصلاح 1: لا يتم استدعاء startSearching أو simulateAccept تلقائياً عند الـ refresh =====
                // يتم فقط استعادة الحالة وعرض الوضع الصحيح بدون تشغيل منطق طلب المندوب
                if (latestActive.status === 'consulting') {
                    // الاستشارة قيد الانتظار - نعرض شاشة الانتظار ونستمع فقط
                    document.getElementById('consulting-status-text').innerText = "جاري التواصل مع " + (latestActive.restaurant_name || "الشريك") + "... 🦅";
                    document.getElementById('eagle-consulting').style.display = 'flex';
                    listenConsultStatusOnly(latestActive.id);
                    // لا نشغل الصوت تلقائياً عند الـ refresh
                    // ===== إصلاح التحديث: لا ننتقل للرئيسية، الاستشارة تظهر فوق الصفحة الحالية =====
                    nav('p-history');
                    if(typeof switchHistoryTab === 'function') switchHistoryTab('active');
                    return;
                } else if (latestActive.status === 'store_invoice_sent') {
                    // الفاتورة وصلت من المتجر — نفتح الدردشة ونظهر زر الإرسال للمناديب
                    _isConsultChatOpen = false;
                    const { data: freshStoreOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', latestActive.id).single();
                    if (freshStoreOrder) {
                        openSpecialtyChat(freshStoreOrder.id, freshStoreOrder.restaurant_name, freshStoreOrder.specialty_type || 'other');
                        // تحديث المبلغ المتفق عليه مباشرة
                        if (freshStoreOrder.order_price > 0) {
                            _spAgreedAmount = freshStoreOrder.order_price;
                            document.getElementById('sp-agreed-amount').innerText = freshStoreOrder.order_price.toLocaleString() + ' ل.س';
                            document.getElementById('sp-dispatch-area').style.display = 'block';
                            const _wn = document.getElementById('sp-waiting-invoice-notice');
                            if (_wn) _wn.style.display = 'none';
                        }
                    }
                    return;
                } else if (latestActive.status === 'accepted' && latestActive.res_type === 'specialty' && !latestActive.driver_id) {
                    // طلب المتجر مقبول — نفتح دردشة المتجر (specialty chat)
                    _isConsultChatOpen = false;
                    const { data: freshSpecOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', latestActive.id).single();
                    if (freshSpecOrder) openSpecialtyChat(freshSpecOrder.id, freshSpecOrder.restaurant_name, freshSpecOrder.specialty_type || 'other');
                    return;
                } else if (latestActive.status === 'accepted' && (latestActive.is_consultation === true || latestActive.res_type === 'pharmacy') && !latestActive.driver_id) {
                    // الاستشارة مقبولة ولم يُحوَّل للمندوب بعد - نفتح المحادثة مباشرة
                    // ===== إصلاح: نجلب البيانات الكاملة من السيرفر ثم نفتح الدردشة =====
                    _isConsultChatOpen = false; // نسمح بإعادة الفتح
                    const { data: freshOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', latestActive.id).single();
                    openPharmacyConsultChat(freshOrder || latestActive);
                    return; // لا نكمل لـ nav الأخيرة
                } else if (latestActive.status === 'accepted' && (latestActive.is_consultation === true || latestActive.res_type === 'pharmacy')) {
                    // الاستشارة مقبولة - نفتح المحادثة مباشرة
                    // ===== إصلاح: نجلب البيانات الكاملة من السيرفر ثم نفتح الدردشة =====
                    _isConsultChatOpen = false; // نسمح بإعادة الفتح
                    const { data: freshOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', latestActive.id).single();
                    openPharmacyConsultChat(freshOrder || latestActive);
                    return; // لا نكمل لـ nav الأخيرة
                } else if (latestActive.status === 'searching' || latestActive.status === 'awaiting_driver') {
                    // ===== إصلاح: عند الـ refresh لا نعرض شاشة eagle-searching أبداً =====
                    // نذهب لصفحة الطلبات النشطة مباشرة ونستمع للتحديثات بصمت في الخلفية
                    document.getElementById('eagle-searching').style.display = 'none';
                    document.getElementById('reveal-order-code').innerText = verificationCode || '----';
                    document.getElementById('client-reveal-code').innerText = verificationCode || '----';
                    showNotify("طلبك قيد البحث عن صقر 🦅", "info");
                    // [FIX-RESTORE-NO-POLL-FALLBACK] كان هذا المسار (بعد تحديث الصفحة أثناء البحث عن
                    // مندوب) يعتمد فقط على الاتصال اللحظي بدون أي شبكة أمان احتياطية — بخلاف مسار إنشاء
                    // الطلب الجديد الذي يشغّل استطلاعاً دورياً كل 3 ثوانٍ بالتوازي دائماً. إن انقطع
                    // الاتصال اللحظي بصمت (سيناريو معروف ومُصلَح سابقاً في تطبيق المندوب لنفس السبب)،
                    // كان العميل يبقى عالقاً هنا فعلياً حتى يحدّث الصفحة يدوياً من جديد — بالضبط المشكلة
                    // الموصوفة. الآن نُشغّل نفس شبكة الأمان الدورية هنا أيضاً:
                    currentOrderKey = latestActive.id;
                    lastStatusNotified = ""; // [FIX-STUCK-SEARCHING] نفس إعادة الضبط المستخدمة في startSearching لمنع تجاهل الحالة بصمت
                    _startSearchPoll(latestActive.id);
                    // استمع للتحديثات في الخلفية فقط
                    if (_orderChannel) { _supabase.removeChannel(_orderChannel); _orderChannel = null; }
                    _orderChannel = _supabase.channel('order_watch_restore_' + latestActive.id)
                        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: `id=eq.${latestActive.id}` }, payload => {
                            const s = payload.new.status;
                            if (s === 'cancelled') {
                                document.getElementById('eagle-searching').style.display = 'none';
                                document.getElementById('searching-sound').pause();
                                showNotify("تم إلغاء الطلب ❌", "error");
                                localStorage.removeItem('shahen_active_order_id');
                                currentOrderKey = null;
                                updateOrderStatus(payload.new.id, 'cancelled');
                                renderHistory();
                            } else if (s === 'accepted' || s === 'preparing' || s === 'ready') {
                                document.getElementById('eagle-searching').style.display = 'none';
                                document.getElementById('searching-sound').pause();
                                updateOrderStatus(latestActive.id, s);
                                showNotify("تم قبول طلبك من قبل صقر الشاهين 🦅");
                                checkOrderAction(latestActive.id, s);
                            }
                        }).subscribe();
                    // ===== إصلاح التحديث: نذهب لصفحة الطلبات النشطة لا الرئيسية =====
                    nav('p-history');
                    // تبديل تبويب الطلبات النشطة
                    if(typeof switchHistoryTab === 'function') switchHistoryTab('active');
                    return; // لا نكمل لـ nav الأخيرة
                } else if (latestActive.status === 'accepted' || latestActive.status === 'preparing' || latestActive.status === 'ready') {
                    // طلب مقبول أو قيد التجهيز - نفتح صفحة التتبع مباشرة بدون simulateAccept
                    // ===== إصلاح التحديث: لا نستدعي nav بعدها لأن checkOrderAction ستنقل للصفحة الصحيحة =====
                    checkOrderAction(latestActive.id, latestActive.status);
                    return; // نوقف الكود هنا ولا ننتقل للصفحة الأخيرة
                } else {
                    // حالات أخرى - نستمع فقط بدون تشغيل منطق تلقائي
                    simulateAccept();
                    // [FIX-MISSING-POLL] هذا المسار (استعادة الطلب عند فتح التطبيق) كان يفتقد الاستطلاع
                    // الاحتياطي بالكامل، فيعتمد فقط على Realtime — وهذا السبب الحقيقي لتعليق الشاشة "أحياناً"
                    if (currentOrderKey) _startSearchPoll(currentOrderKey);
                }
            } else {
                // إذا لم توجد طلبات نشطة في السيرفر، نصفر المفتاح محلياً
                localStorage.removeItem('shahen_active_order_id');
                currentOrderKey = null;
            }
            
            // العودة لآخر صفحة كان عليها المستخدم أو الصفحة الرئيسية
            // ===== إصلاح التحديث: إذا كانت الصفحة الأخيرة هي p-chat نذهب للطلبات النشطة إذا لم يعد هناك طلب نشط =====
            const lastView = localStorage.getItem('shahen_current_view') || 'p-home';
            if(lastView === 'p-chat' && !currentOrderKey) {
                nav('p-history');
            } else if(lastView !== 'p-login') {
                nav(lastView);
            } else {
                nav('p-home');
            }
        }
        } catch(_luErr) {
            // [SEC-FIX-LOADUSERDATA-TRYCATCH] فشل جزئي (غالباً انقطاع شبكة أو استثناء .single()) —
            // نسجّل الخطأ للتشخيص، ونضمن أن المستخدم لا يبقى عالقاً على شاشة تسجيل الدخول
            console.error('[loadUserData] فشل جزئي أثناء استعادة بيانات المستخدم/الطلب النشط:', _luErr);
            try {
                document.getElementById('p-login').style.display = 'none';
                document.getElementById('tab-bar').style.display = 'flex';
                document.getElementById('manual-refresh').style.display = 'flex';
                document.getElementById('admin-notif-bell').style.display = 'flex';
                if (typeof nav === 'function') nav('p-home');
                showNotify('⚠️ حدث خلل بسيط أثناء تحميل بياناتك، جرّب تحديث الصفحة إن لاحظت أي نقص', 'error');
            } catch(_fallbackErr) { /* لا شيء إضافي ممكن هنا بأمان */ }
        }
    }

    // تعديل: زر التحديث يقوم بتحديث مرئي مع أنيميشن وتحديث بيانات كامل
    async function manualRefreshDataUI() {
        const btn = document.getElementById('manual-refresh');
        btn.classList.add('refreshing');
        showNotify("جاري تحديث بيانات الشاهين... 🦅", "info");
        await manualRefreshData();
        setTimeout(() => {
            btn.classList.remove('refreshing');
            showNotify("تم التحديث بنجاح ✅");
        }, 1000);
    }

    // [ORDER-LOCK-FIX] تعريف متغير الـ interval هنا قبل أي استخدام له لمنع Temporal Dead Zone
    let _manualRefreshInterval = null;

    async function manualRefreshData() {
        if(!currentUser) return;
        // [ORDER-LOCK-FIX] لا تُشغّل التحديث التلقائي أثناء إرسال طلب جديد
        if (_confirmOrderPending || _medConsultPending || _storeConsultPending || _wassayniPending) return;
        // [REFRESH-LOCK-FIX] منع تشغيل متزامن لنسختين من manualRefreshData
        if (window._manualRefreshRunning) return;
        window._manualRefreshRunning = true;
        try {
        // تحديث صامت للنقاط والبيانات فقط دون تغيير الصفحة
        const { data: dbUser } = await _supabase.from('customers').select('*').eq('id', currentUser.uid).single();
        if(dbUser) { currentUser.points = dbUser.points; document.getElementById('shahen-points').innerText = dbUser.points; }
        
        if(currentOrderKey) {
           const _refreshOrderId = currentOrderKey; // نحفظ الـ ID قبل أي تصفير
           const { data: active, error: _refreshErr } = await _supabase.from('sh_public_orders').select('*').eq('id', _refreshOrderId).maybeSingle();
           
           // ===== حماية: إذا فشل الجلب بسبب شبكة أو خطأ، لا نصفّر الطلب =====
           if (_refreshErr) return;
           
           if(active) {
              // ===== حماية طلبات الصيدلية: لا نُشغّل updateOrderStatus على consulting/accepted(pharmacy) =====
              const _isPharmacyConsult = (active.res_type === 'pharmacy' || active.res_type === 'pharmacy_delivery') &&
                                         (active.status === 'consulting' || active.status === 'accepted');
              if (!_isPharmacyConsult) {
                  await updateOrderStatus(active.id, active.status);
              }
              // تحديث السجل المحلي بأحدث البيانات من السيرفر بصمت
              let _lOrdersRefresh = getStorage('orders');
              _lOrdersRefresh = _lOrdersRefresh.map(o => String(o.id) === String(active.id) ? {
                  ...o,
                  status: active.status,
                  total: active.total || o.total,
                  delivery_price: active.delivery_price || o.delivery_price,
                  driver_name: active.driver_name || o.driver_name,
                  verify_code: active.verify_code || o.verify_code
              } : o);
              setStorage('orders', _lOrdersRefresh);
              // أرشفة الطلب تلقائياً إذا انتهى — بعد انتهاء الحفظ
              if(active.status === 'completed' || active.status === 'cancelled') {
                  if (String(currentOrderKey) === String(_refreshOrderId)) {
                      localStorage.removeItem('shahen_active_order_id');
                      currentOrderKey = null;
                  }
              }
           } else {
              // ===== إذا اختفى الطلب: نتحقق أولاً من السجل المحلي قبل التصفير =====
              let _lOrders = getStorage('orders');
              const _lFound = _lOrders.find(o => String(o.id) === String(_refreshOrderId));
              // إذا كان الطلب محلياً consulting أو pharmacy — لا نصفّر، قد يكون تأخر في الشبكة
              if (_lFound && (_lFound.status === 'consulting' || _lFound.res_type === 'pharmacy' || _lFound.order_type === 'pharmacy')) {
                  return; // نحافظ على الطلب ولا نصفّر
              }
              if (_lFound && !['completed','cancelled','failed','rejected'].includes(String(_lFound.status))) {
                  _lOrders = _lOrders.map(o => String(o.id) === String(_refreshOrderId) ? {...o, status: 'completed'} : o);
                  setStorage('orders', _lOrders);
              }
              localStorage.removeItem('shahen_active_order_id');
              currentOrderKey = null;
           }
        }
        renderHistory(); // تحديث قائمة الطلبات في الخلفية
        } catch(_mrErr) { /* تجاهل أخطاء التحديث التلقائي */ } finally {
            window._manualRefreshRunning = false;
        }
    }
    _manualRefreshInterval = setInterval(manualRefreshData, 20000);

    // ===== [FIX-AUTOREFRESH] شريط التحديث التلقائي الخفيف كل 5 دقائق =====
    (function _initAutoRefreshBar() {
        // إنشاء الشريط
        const bar = document.createElement('div');
        bar.id = '_auto-refresh-bar';
        bar.style.cssText = [
            'position:fixed', 'bottom:0', 'left:50%', 'transform:translateX(-50%)',
            'width:375px', 'max-width:100vw', 'height:2px',
            'background:rgba(212,175,55,0.15)', 'z-index:99990',
            'overflow:hidden', 'pointer-events:none'
        ].join(';');
        const fill = document.createElement('div');
        fill.id = '_auto-refresh-fill';
        fill.style.cssText = 'height:100%; width:0%; background:rgba(212,175,55,0.55); transition:width linear;';
        bar.appendChild(fill);
        document.body.appendChild(bar);

        const INTERVAL_MS = 5 * 60 * 1000; // 5 دقائق
        let _startTime = Date.now();

        function _updateBar() {
            const elapsed = Date.now() - _startTime;
            const pct = Math.min(100, (elapsed / INTERVAL_MS) * 100);
            fill.style.width = pct + '%';
        }

        const _barTick = setInterval(_updateBar, 3000);

        setInterval(async () => {
            // التحديث التلقائي للبيانات فقط — بدون reload الصفحة
            if (typeof manualRefreshData === 'function') {
                await manualRefreshData();
            }
            // إعادة ضبط الشريط
            _startTime = Date.now();
            fill.style.transition = 'none';
            fill.style.width = '0%';
            setTimeout(() => { fill.style.transition = 'width linear'; }, 50);
        }, INTERVAL_MS);
    })();
    // ===== نهاية [FIX-AUTOREFRESH] =====

    // تعديل دالة فتح/إغلاق المودال
    function toggleAdminModal() {
        const modal = document.getElementById('admin-modal');
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'flex';
            fetchAdminMessages();
        }
    }

    async function fetchAdminMessages() {
        const modalInbox = document.getElementById('modal-inbox-content');
        const readBtn = document.getElementById('mark-read-btn');
        const badge = document.getElementById('bell-badge');
        if(!currentUser) return;
        const now = new Date();
        const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
        
        const { data: messages } = await _supabase.from('notifications')
            .select('*')
            .eq('user_id', currentUser.uid)
            .eq('is_read', false)
            .gte('created_at', yesterday)
            .order('created_at', {ascending: false});
        
        if(messages && messages.length > 0) {
            const unreadCount = messages.length;
            badge.innerText = unreadCount;
            badge.style.display = 'flex';
            if(readBtn) readBtn.style.display = 'block';
            const htmlContent = messages.map(m => `
                <div class="admin-msg-item" id="notif-${m.id}" ${m.type==='family_chat' ? `onclick="_handleNotifClick('${m.id}','${m.type}','${m.reference_id||''}')" style="cursor:pointer;"` : ''}>
                    <b>${m.type==='family_chat' ? '' : 'الإدارة: '}</b>${escHtml(m.message)}
                    <span class="admin-msg-time">${new Date(m.created_at).toLocaleString('ar-SY')}</span>
                    <button class="single-read-btn" onclick="event.stopPropagation(); markSingleAsRead(${m.id})">تمت القراءة</button>
                    <div style="clear:both;"></div>
                </div>
            `).join('');
            if(modalInbox) modalInbox.innerHTML = htmlContent;
        } else {
            badge.style.display = 'none';
            if(readBtn) readBtn.style.display = 'none';
            if(modalInbox) modalInbox.innerHTML = '<p style="text-align:center; opacity:0.5; font-size:11px; padding:20px;">لا توجد رسائل جديدة</p>';
        }
    }

    // [FEATURE-NOTIF-CLICK-NAVIGATE] الضغط على إشعار محادثة أسرة منتجة يحوّل مباشرة لتلك المحادثة
    async function _handleNotifClick(id, type, referenceId) {
        await markSingleAsRead(id);
        toggleAdminModal(); // إغلاق نافذة التنبيهات
        if (type === 'family_chat' && referenceId) {
            await openFamilyChatById(referenceId);
        }
    }

    // دالة تم قراءة إشعار واحد
    async function markSingleAsRead(id) {
        const { error } = await _supabase.from('notifications').update({ is_read: true }).eq('id', id);
        if(!error) {
            const item = document.getElementById(`notif-${id}`);
            if(item) item.style.display = 'none';
            const badge = document.getElementById('bell-badge');
            let count = parseInt(badge.innerText) - 1;
            if(count > 0) {
                badge.innerText = count;
            } else {
                badge.style.display = 'none';
                document.getElementById('modal-inbox-content').innerHTML = '<p style="text-align:center; opacity:0.5; font-size:11px; padding:20px;">لا توجد رسائل جديدة</p>';
                document.getElementById('mark-read-btn').style.display = 'none';
            }
        }
    }

    async function markAllAsRead() {
        if(!currentUser) return;
        const { error } = await _supabase.from('notifications')
            .update({ is_read: true })
            .eq('user_id', currentUser.uid);
        
        if(!error) {
            document.getElementById('bell-badge').style.display = 'none';
            document.getElementById('mark-read-btn').style.display = 'none';
            fetchAdminMessages();
            showNotify("تم قراءة الجميع ✅");
        }
    }

    function initRealtimeNotifications() {
        if(!currentUser) return;
        // [CANCEL-FIX] تنظيف القناة القديمة قبل إنشاء جديدة لمنع التكديس عند إعادة الاستدعاء
        try {
            const _oldNotifCh = _supabase.channel('custom-filter-channel');
            if (_oldNotifCh) _supabase.removeChannel(_oldNotifCh);
        } catch(_e) {}
        // [NOTIF-FIX] انتظر قصير قبل إنشاء القناة الجديدة لضمان إتمام التنظيف الكامل
        setTimeout(function() {
            try {
                _supabase.channel('custom-filter-channel')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${currentUser.uid}` }, payload => {
                    fetchAdminMessages();
                }).subscribe((status) => {
                    // [NOTIF-FIX-RETRY] إعادة المحاولة تلقائياً عند فشل القناة
                    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                        setTimeout(function() { try { initRealtimeNotifications(); } catch(_re) {} }, 5000);
                    }
                });
            } catch(_initErr) {}
        }, 100);
    }

    // ============================================================
    // نظام الكاش الموحّد — يمنع إعادة التحميل عند كل تنقل
    // ============================================================
    let _cache = {
        res:      null,
        pharma:   null,
        oncall:   null,
        resTs:    0,
        pharmaTs: 0,
        TTL:      60000
    };
    function _cacheValid(ts) { return ts > 0 && (Date.now() - ts) < _cache.TTL; }

    // ── قاعدة التفعيل الموحّدة ──
    const ACTIVE_STATUSES = ['مشترك', 'مفعل'];
    function _resIsLocked(r) { return r.is_locked === true; }
    function _resIsActive(r) { return ACTIVE_STATUSES.includes(r.subscription_status); }

    // ── صفحة المطعم غير المفعّل ──
    function _openInactiveRes(name, id) {
        const menuDiv    = document.getElementById('menu-items');
        const catsBar    = document.getElementById('menu-cats-bar');
        const contactBtn = document.getElementById('menu-contact-btn');
        const logoEl     = document.getElementById('menu-logo');
        document.getElementById('menu-title').innerText = name;
        document.getElementById('menu-sub-info').innerHTML = '';
        if(logoEl)     logoEl.style.display = 'none';
        if(catsBar)    catsBar.style.display = 'none';
        if(contactBtn) contactBtn.style.display = 'none';
        if(menuDiv) menuDiv.innerHTML = `
            <div style="text-align:center;padding:35px 20px;background:rgba(231,76,60,0.07);border:2px solid #e74c3c;border-radius:18px;margin:16px 0;">
                <i class="fas fa-store-slash" style="font-size:50px;color:#e74c3c;display:block;margin-bottom:14px;"></i>
                <b style="color:#e74c3c;font-size:16px;display:block;margin-bottom:10px;">خارج الخدمة حالياً</b>
                <p style="font-size:12px;color:#bbb;margin:0 0 16px;line-height:1.6;">
                    هذا المطعم غير متاح للطلب في الوقت الحالي.<br>
                    يرجى الطلب من المنيو المتاح أو المحاولة لاحقاً.
                </p>
                <button onclick="nav('p-home',event)" style="background:var(--gold);color:#000;border:none;padding:10px 24px;border-radius:12px;font-size:13px;font-weight:bold;cursor:pointer;">
                    <i class="fas fa-arrow-right"></i> العودة للقائمة
                </button>
            </div>`;
        nav('p-menu');
    }
    function _showClosedNotice(name, id) { _openInactiveRes(name, id); }

    function nav(id, event = null) {
        if (event) { event.preventDefault(); event.stopPropagation(); }
        localStorage.setItem('shahen_current_view', id);

        // [FIX-PERF-CHAT-LEAK] تنظيف احتياطي لقناة الدردشة اللحظية عند أي تنقّل صفحات — يغطي
        // مسار الرجوع الشائع (مغادرة تفاصيل نشاط دون إغلاق الدردشة يدوياً)
        if (id !== 'p-family-detail' && typeof _famChatChannel !== 'undefined' && _famChatChannel) {
            try { _supabase.removeChannel(_famChatChannel); } catch(e){}
            _famChatChannel = null; _famChatId = null;
            const chatOverlay = document.getElementById('fam-chat-overlay');
            if (chatOverlay) chatOverlay.style.display = 'none';
        }

        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        const target = document.getElementById(id);
        if (target) { target.classList.add('active'); target.style.display = 'flex'; }

        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.tab-item[onclick*="'${id}'"]`);
        if (activeTab) activeTab.classList.add('active');

        const mainNav = document.getElementById('main-nav-sticky');
        if (mainNav) mainNav.style.display = (id === 'p-home') ? 'flex' : 'none';

        // ── تحميل البيانات حسب الصفحة مع الكاش ──
        if (id === 'p-home')    { _navHome(); }
        if (id === 'p-cart')    { renderCart(); _ensureConnectionBeforeOrder && _ensureConnectionBeforeOrder().catch(()=>{}); }
        if (id === 'p-history') { renderHistory(); }
        if (id === 'p-profile') { initProfileMap(); if (currentUser) _refreshMyFamilyChatsBadge(); loadSavedAddresses(); }
        if (id !== 'p-chat' && _clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
    }

    // ── فتح الصفحة الرئيسية مع كاش ذكي ──
    function _navHome() {
        // ===== عرض الكاش فوراً إذا متوفر — لا تختفي المطاعم أبداً =====
        if (_cache.res && _cache.res.length > 0) {
            _renderResFromData(_cache.res);
        } else {
            // محاولة جلب من LocalStorage قبل السيرفر
            const _stored = getStorage('cached_restaurants');
            if (_stored && _stored.length > 0) {
                _cache.res = _stored;
                _renderResFromData(_stored);
            } else {
                // [PERF-PATCH-LOGIN-5] عرض skeleton cards فوراً لحين وصول البيانات
                const _skListDiv = document.getElementById('res-list');
                if (_skListDiv && !_skListDiv.innerHTML.trim()) {
                    const _skHtml = Array(6).fill(0).map(() =>
                        `<div class="sk-card"><div class="sk-img"></div><div class="sk-lines"><div class="sk-line"></div><div class="sk-line short"></div></div></div>`
                    ).join('');
                    _skListDiv.innerHTML = _skHtml;
                }
            }
        }
        // تحديث من DB فقط إذا انتهى TTL
        if (!_cacheValid(_cache.resTs)) {
            _fetchResAndRender();
        }
    }

    // ===== [FEATURE-RES-FILTERS] فلترة المطاعم (ذهبية / مفتوحة الآن) + حساب حالة الفتح الفعلية =====
    let _resFilterFeatured = false;
    let _resFilterOpen = false;

    function _isResOpenNow(r) {
        if (!r.open_time || !r.close_time) return true; // لا نعرف أوقات العمل — نعتبره متاحاً افتراضياً
        try {
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const parseTime = (str) => {
                const m = String(str).match(/(\d{1,2}):(\d{2})/);
                if (!m) return null;
                return parseInt(m[1]) * 60 + parseInt(m[2]);
            };
            const openMin = parseTime(r.open_time);
            const closeMin = parseTime(r.close_time);
            if (openMin === null || closeMin === null) return true;
            if (closeMin > openMin) {
                // نفس اليوم (مثال: 08:00 - 23:00)
                return nowMinutes >= openMin && nowMinutes < closeMin;
            } else {
                // يمتد لليوم التالي (مثال: 18:00 - 02:00)
                return nowMinutes >= openMin || nowMinutes < closeMin;
            }
        } catch(e) { return true; }
    }

    function _toggleResFilter(type) {
        if (type === 'featured') _resFilterFeatured = !_resFilterFeatured;
        if (type === 'open') _resFilterOpen = !_resFilterOpen;
        const fBtn = document.getElementById('filter-featured-btn');
        const oBtn = document.getElementById('filter-open-btn');
        if (fBtn) { fBtn.style.background = _resFilterFeatured ? 'var(--gold)' : 'transparent'; fBtn.style.color = _resFilterFeatured ? '#1a051a' : 'var(--gold)'; }
        if (oBtn) { oBtn.style.background = _resFilterOpen ? '#2ecc71' : 'transparent'; oBtn.style.color = _resFilterOpen ? '#1a051a' : '#2ecc71'; }
        _renderResFromData(_cache.res || data);
    }

    async function renderRes() {
        // عرض الكاش فوراً إذا متوفر
        if (_cache.res && _cache.res.length > 0) {
            _renderResFromData(_cache.res);
        }
        // جلب من السيرفر فقط إذا انتهى الكاش
        if (!_cacheValid(_cache.resTs)) {
            await _fetchResAndRender();
        }
    }

    async function _fetchResAndRender() {
        const loader = document.getElementById('shahen-home-loader');
        // أظهر loader فقط إذا لا يوجد كاش
        if (!_cache.res || _cache.res.length === 0) {
            if(loader) loader.style.display = 'flex';
        }
        try {
            const { data: dbData, error } = await _supabase
                .from('restaurants_public')
                // [PERF-FIX-1] استبعاد عمود restaurant_menu الثقيل من استعلام القائمة الرئيسية
                // كان يُحمَّل لكل مطعم في كل مرة فقط لعرض بطاقة (اسم+شعار+سعر)، مما يُبطّئ فتح الصفحة بشكل واضح
                // يُجلب المنيو الكامل فقط عند فتح مطعم محدد (عبر _fetchAndOpenMenu)
                .select('id,name,logo,delivery_fee,open_time,close_time,is_locked,subscription_status,maps_url,branch,is_direct_contact,specialty_type,is_featured');

            if(error) throw error;
            if(dbData) {
                // data تحتوي الكل للبحث في openMenu
                const newData = dbData.filter(r => r.is_locked !== true);
                // ===== حماية ترتيب المطاعم: لا تُحدَّث القائمة إذا جاءت فارغة من السيرفر =====
                // يمنع اختفاء المطاعم أو تغيّر مكانها في حالة خطأ مؤقت من السيرفر
                if (newData.length > 0) {
                    // الحفاظ على الترتيب الموجود في الكاش إذا كان هناك بيانات سابقة
                    if (_cache.res && _cache.res.length > 0) {
                        // ترتيب القائمة الجديدة بنفس ترتيب الكاش القديم (المطاعم المعروفة أولاً)
                        const oldOrder = _cache.res.map(r => r.id);
                        const orderedNew = [
                            ...newData.filter(r => oldOrder.includes(r.id)).sort((a, b) => oldOrder.indexOf(a.id) - oldOrder.indexOf(b.id)),
                            ...newData.filter(r => !oldOrder.includes(r.id))
                        ];
                        data = orderedNew;
                    } else {
                        data = newData;
                    }
                    _cache.res   = data;
                    _cache.resTs = Date.now();
                    setStorage('cached_restaurants', data);
                } else if (_cache.res && _cache.res.length > 0) {
                    // السيرفر أرجع فارغاً — احتفظ بالكاش القديم ولا تغير شيئاً
                    data = _cache.res;
                }
                // ===== نهاية حماية ترتيب المطاعم =====
            }
        } catch(e) {
            // [SEC-FIX-LOG] تم إزالة console.warn في بيئة الإنتاج لمنع تسريب معلومات داخلية
            // ===== عند الخطأ: عرض الكاش المحلي دائماً بدون إخفاء المطاعم =====
            const stored = getStorage('cached_restaurants');
            if(stored && stored.length > 0) { data = stored; _cache.res = stored; }
            // إذا كان الكاش في الذاكرة موجوداً استخدمه مباشرةً
            else if (_cache.res && _cache.res.length > 0) { data = _cache.res; }
            // ===== نهاية حماية الكاش =====
        }
        if(loader) loader.style.display = 'none';
        if(data && data.length > 0) {
            // ===== عرض جميع المطاعم — الشراكة لا تخفي المطعم من الواجهة =====
            // branch='شريك خارجي' تعني فقط أنه شريك، لا تعني إخفاءه عن العميل
            const mainList = data;
            _renderResFromData(mainList);
        } else {
            // ===== ممنوع عرض "لا توجد مطاعم" إذا كان هناك كاش سابق =====
            const _fallback = getStorage('cached_restaurants');
            if (_fallback && _fallback.length > 0) {
                data = _fallback;
                _cache.res = _fallback;
                const mainList = _fallback;
                _renderResFromData(mainList);
            } else {
                const listDiv = document.getElementById('res-list');
                if(listDiv) listDiv.innerHTML = "<p style='text-align:center;font-size:12px;color:#888;padding:30px;'>لا توجد مطاعم متاحة حالياً</p>";
            }
            // ===== نهاية حماية العرض =====
        }
    }

    function _renderResFromData(resData) {
        const listDiv = document.getElementById('res-list');
        if(!listDiv) return;
        // ===== ممنوع مسح القائمة إذا جاءت البيانات فارغة — استخدم الكاش =====
        if(!resData || resData.length === 0) {
            // إذا القائمة فارغة حالياً أيضاً، نعرض رسالة — وإلا نبقي القائمة كما هي
            if (!listDiv.innerHTML || listDiv.innerHTML.includes('لا توجد') || listDiv.innerHTML.trim() === '') {
                listDiv.innerHTML = "<p style='text-align:center;font-size:12px;color:#888;padding:30px;'>لا توجد مطاعم متاحة حالياً</p>";
            }
            // إذا كانت القائمة معروضة من قبل، لا نغيرها
            return;
        }
        // ===== نهاية الحماية =====
        // [FEATURE-RES-FILTERS] تطبيق الفلاتر النشطة (ذهبية / مفتوحة الآن) قبل العرض
        let _filteredData = resData;
        if (_resFilterFeatured) _filteredData = _filteredData.filter(r => r.is_featured === true);
        if (_resFilterOpen) _filteredData = _filteredData.filter(r => _isResOpenNow(r));
        if (_filteredData.length === 0) {
            listDiv.innerHTML = "<p style='text-align:center;font-size:12px;color:#888;padding:30px;'>لا توجد مطاعم مطابقة لهذا الفلتر حالياً</p>";
            return;
        }
        listDiv.innerHTML = _filteredData.map(r => {
            // [FEATURE-GOLD-PARTNER-BADGE] تمييز بصري للمطعم المميز (is_featured من لوحة الإدارة) —
            // إطار ذهبي + نجمة + شارة "شريك ذهبي"، بدون أي تغيير على باقي تصميم البطاقة
            const _isFeatured = r.is_featured === true;
            const _featuredBorder = _isFeatured ? 'border:4px solid var(--gold); box-shadow:0 0 16px rgba(212,175,55,0.55); position:relative;' : '';
            const _featuredStar = _isFeatured ? '<div style="position:absolute; top:-8px; left:-8px; background:var(--gold); color:#1a051a; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; box-shadow:0 2px 6px rgba(0,0,0,0.4); z-index:2;">⭐</div>' : '';
            const _featuredBadge = _isFeatured ? '<div style="margin-top:6px; text-align:center;"><span style="background:linear-gradient(135deg,#d4af37,#b8962e); color:#1a051a; font-size:8px; font-weight:bold; padding:2px 10px; border-radius:10px; display:inline-block;">✨ شريك ذهبي</span></div>' : '';
            // [FEATURE-CLOSED-DIM] تعتيم بصري + شارة "مغلق" للمطاعم المغلقة حالياً حسب أوقات عملها
            const _isOpen = _isResOpenNow(r);
            const _closedStyle = !_isOpen ? 'filter:grayscale(0.85) brightness(0.55); position:relative;' : 'position:relative;';
            const _closedBadge = !_isOpen ? '<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:3; pointer-events:none;"><span style="background:rgba(0,0,0,0.75); color:#e74c3c; font-size:10px; font-weight:bold; padding:4px 12px; border-radius:20px; border:1px solid #e74c3c;"><i class="fas fa-lock"></i> مغلق حالياً</span></div>' : '';
            return `
            <div class="card res-card" onclick="openMenu('${r.id}')" style="cursor:pointer; ${_featuredBorder} ${_closedStyle}">
                ${_featuredStar}
                ${_closedBadge}
                <div class="flex-reverse">
                    <img src="${r.logo||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'}" style="border-radius:8px;border:1px solid var(--gold);object-fit:cover;width:52px;height:52px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'">
                    <div style="flex:1;text-align:right;margin-right:8px;">
                        <b class="res-name" style="font-size:11px;">${escHtml(r.name)}</b>
                        <br><small style="font-size:9px;">${window._deliveryPricingMode === 'distance' ? '🚗 حسب المسافة' : fmtSYP(r.delivery_fee||0,{inline:true,size:9})} • ${r.open_time||''}</small>
                    </div>
                </div>
                ${_featuredBadge}
            </div>`;
        }).join('');
    }
    // ============================================================
    // نهاية نظام الكاش الموحّد
    // ============================================================

    function switchCategory(cat) {
        // [FIX-PERF-CHAT-LEAK] تنظيف احتياطي لأي قناة دردشة لحظية عالقة لو غادر العميل الصفحة
        // بدون إغلاق الدردشة يدوياً (مثلاً بزر الرجوع) — يمنع تراكم اتصالات مفتوحة تسبب بطء تدريجي
        if (typeof _famChatChannel !== 'undefined' && _famChatChannel) { try { _supabase.removeChannel(_famChatChannel); } catch(e){} _famChatChannel = null; _famChatId = null; }
        document.querySelectorAll('.m-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.category-view').forEach(v => v.classList.remove('active'));
        if(cat === 'restaurants') {
            document.querySelectorAll('.m-tab')[0].classList.add('active');
            document.getElementById('view-restaurants').classList.add('active');
            // ===== عرض جميع المطاعم بدون فلتر branch — الشراكة لا تخفي المطعم =====
            if(_cache.res && _cache.res.length > 0) {
                _renderResFromData(_cache.res);
            }
            if(!_cacheValid(_cache.resTs)) _fetchResAndRender();
        }
        if(cat === 'pharmacies') {
            document.querySelectorAll('.m-tab')[1].classList.add('active');
            document.getElementById('view-pharmacies').classList.add('active');
            // عرض الكاش فوراً + تحديث إذا انتهى TTL
            if(_cache.pharma && _cache.pharma.length > 0) _renderPharmaFromData(_cache.pharma, _cache.oncall||[]);
            if(!_cacheValid(_cache.pharmaTs)) renderPharmacies();
        }
        if(cat === 'flowers')   { document.querySelectorAll('.m-tab')[2].classList.add('active'); document.getElementById('view-flowers').classList.add('active'); }
        if(cat === 'wassayni')  { document.querySelectorAll('.m-tab')[3].classList.add('active'); document.getElementById('view-wassayni').classList.add('active'); initWassayniMaps(); calcWassayniPrice(); }
        if(cat === 'family')    { document.querySelectorAll('.m-tab')[4].classList.add('active'); document.getElementById('view-family').classList.add('active'); loadFamilyBusinesses(); }
    }

    // ═══════════════════════════════════════════════════
    // [FAMILY-BIZ] الأسر المنتجة — وظائف مستقلة بالكامل
    // لا تتشارك أي متغير أو دالة مع باقي النظام (مطاعم/صيدليات/إلخ)
    // ═══════════════════════════════════════════════════
    let _familyCache = [];
    let _currentFamilyBiz = null;
    let _currentFamilyProducts = []; // كاش آمن للمنتجات (لتجنب تمرير JSON عبر onclick)
    let _famOrderQty = 1;
    let _famOrderProductId = null;

    let _familyCacheTimestamp = 0;
    async function loadFamilyBusinesses(){
        const loader = document.getElementById('shahen-family-loader');
        const listDiv = document.getElementById('family-list');
        if(_familyCache.length){ _renderFamilyList(_familyCache); }
        else if(loader) loader.style.display = 'flex';
        // [FIX-PERF-FAMILY-RELOAD] تفادي إعادة تحميل الصور الثقيلة (base64) في كل مرة يفتح فيها
        // العميل هذا القسم — نكتفي بالنسخة المخزَّنة لو حُمِّلت خلال آخر 60 ثانية
        if (_familyCache.length && (Date.now() - _familyCacheTimestamp) < 60000) {
            if(loader) loader.style.display = 'none';
            return;
        }
        try{
            const r = await fetch(SB_URL+'/rest/v1/family_businesses_public?select=*&status=eq.active&order=created_at.desc', {
                headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
            });
            if(!r.ok){
                if(!_familyCache.length && listDiv) listDiv.innerHTML = '<p style="text-align:center;color:#888;font-size:11px;padding:30px;">لا توجد أسر منتجة متاحة حالياً</p>';
                return;
            }
            const list = await r.json();
            _familyCache = list || [];
            _familyCacheTimestamp = Date.now();
            _renderFamilyList(_familyCache); // [PERF-FIX-2] عرض القائمة فوراً بدون انتظار التقييمات
            // [FAM-RATING] جلب التقييمات في الخلفية ثم تحديث الشارات فقط — لا يُبطئ ظهور القائمة الأولى
            _loadFamilyRatingStats(_familyCache.map(b=>b.id)).then(()=>{ _renderFamilyList(_familyCache); });
        }catch(e){
            if(!_familyCache.length && listDiv) listDiv.innerHTML = '<p style="text-align:center;color:#888;font-size:11px;padding:30px;">تعذر تحميل الأسر المنتجة، حاول لاحقاً</p>';
        } finally {
            if(loader) loader.style.display = 'none';
        }
    }

    // [FAM-RATING] جلب كل التقييمات لقائمة من المتاجر دفعة واحدة (استعلام واحد لا استعلام لكل بطاقة)
    let _famRatingStats = {}; // business_id -> {avg, count}
    async function _loadFamilyRatingStats(businessIds){
        if(!businessIds || !businessIds.length) return;
        try{
            const idsParam = businessIds.join(',');
            const r = await fetch(SB_URL+`/rest/v1/family_business_ratings?select=business_id,stars&business_id=in.(${idsParam})`, {
                headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
            });
            if(!r.ok) return;
            const rows = await r.json();
            const grouped = {};
            (rows||[]).forEach(row=>{
                if(!grouped[row.business_id]) grouped[row.business_id] = [];
                grouped[row.business_id].push(row.stars);
            });
            Object.keys(grouped).forEach(bid=>{
                const arr = grouped[bid];
                _famRatingStats[bid] = { avg: (arr.reduce((a,b)=>a+b,0)/arr.length), count: arr.length };
            });
        }catch(e){}
    }

    function _famStarsHtml(avg, size){
        size = size || 10;
        let html = '';
        const rounded = Math.round(avg*2)/2; // أقرب نصف نجمة
        for(let i=1;i<=5;i++){
            if(rounded >= i) html += `<i class="fas fa-star" style="color:#f4c430;font-size:${size}px;"></i>`;
            else if(rounded >= i-0.5) html += `<i class="fas fa-star-half-alt" style="color:#f4c430;font-size:${size}px;"></i>`;
            else html += `<i class="far fa-star" style="color:#555;font-size:${size}px;"></i>`;
        }
        return html;
    }

    function _renderFamilyList(list){
        const listDiv = document.getElementById('family-list');
        if(!listDiv) return;
        if(!list || !list.length){
            listDiv.innerHTML = '<p style="text-align:center;color:#888;font-size:11px;padding:30px;">لا توجد أسر منتجة متاحة حالياً</p>';
            return;
        }
        listDiv.innerHTML = list.map(b => {
            const rating = _famRatingStats[b.id];
            const ratingHtml = rating
                ? `<span style="display:inline-flex;align-items:center;gap:3px;">${_famStarsHtml(rating.avg,9)} <small style="color:#888;font-size:9px;">(${rating.count})</small></span>`
                : `<small style="color:#666;font-size:9px;">لا توجد تقييمات بعد</small>`;
            return `
            <div class="card" style="cursor:pointer;">
                <div class="flex-reverse" onclick="openFamilyBusiness('${b.id}')">
                    <img src="${b.main_image||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'}" style="border-radius:10px;border:1px solid var(--gold);object-fit:cover;width:65px;height:65px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'">
                    <div style="flex:1;text-align:right;margin-right:8px;">
                        <b class="res-name" style="font-size:11px;">${escHtml(b.name)}</b>
                        ${b.category?` <small style="font-size:9px;color:var(--gold);">| ${escHtml(b.category)}</small>`:''}
                        <br>${ratingHtml}
                        <br><small style="font-size:9px;color:${b.is_open?'#2ecc71':'#e74c3c'};font-weight:bold;">${b.is_open?'🟢 مفتوح الآن':'🔴 مغلق حالياً'}</small>
                        ${b.address?` <small style="font-size:9px;color:#888;">| 📍 ${escHtml(b.address)}</small>`:''}
                    </div>
                </div>
                <div style="display:flex;gap:6px;margin-top:8px;">
                    <button onclick="event.stopPropagation();openFamilyBusiness('${b.id}', true)" style="flex:1;background:rgba(212,175,55,0.1);border:1px solid var(--gold);color:var(--gold);border-radius:8px;padding:6px;font-size:10px;cursor:pointer;">
                        <i class="fas fa-star"></i> عرض التقييمات
                    </button>
                    <button onclick="event.stopPropagation();_quickContactFamilyCard('${b.id}')" style="flex:1;background:rgba(37,211,102,0.1);border:1px solid #25d366;color:#25d366;border-radius:8px;padding:6px;font-size:10px;cursor:pointer;">
                        <i class="fas fa-comment-dots"></i> دردشة
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    // [FAM-AI-SEARCH] البحث الذكي بمساعدة الذكاء الاصطناعي
    const _FAM_AI_FN_URL = 'https://qfyggwffibmrlsvlzwgs.supabase.co/functions/v1/family-ai-search';
    let _famAiSearchPending = false;
    async function runFamilyAiSearch(){
        if(_famAiSearchPending) return;
        const query = document.getElementById('famAiQuery')?.value.trim();
        const resultsEl = document.getElementById('fam-ai-results');
        if(!query){ showNotify('اكتب طلبك أولاً'); return; }
        _famAiSearchPending = true;
        resultsEl.innerHTML = '<p style="text-align:center;color:#888;font-size:11px;padding:10px;"><i class="fas fa-spinner fa-spin"></i> الذكاء الاصطناعي يبحث لك...</p>';
        try{
            // جلب المنتجات لكل الأسر الظاهرة لإرسالها مع الطلب (دفعة واحدة)
            const bizList = _familyCache.length ? _familyCache : await (async()=>{ await loadFamilyBusinesses(); return _familyCache; })();
            const ids = bizList.map(b=>b.id);
            let productsMap = {};
            if(ids.length){
                const rp = await fetch(SB_URL+`/rest/v1/family_business_products?select=business_id,name,price&business_id=in.(${ids.join(',')})`, {
                    headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
                });
                const rows = rp.ok ? await rp.json() : [];
                (rows||[]).forEach(p=>{ if(!productsMap[p.business_id]) productsMap[p.business_id]=[]; productsMap[p.business_id].push(p); });
            }
            const payload = bizList.map(b=>({ id:b.id, name:b.name, category:b.category, description:b.description, products: productsMap[b.id]||[] }));

            const r = await fetch(_FAM_AI_FN_URL, {
                method:'POST',
                headers:{'Content-Type':'application/json','Authorization':'Bearer '+SB_KEY},
                body: JSON.stringify({ query, businesses: payload })
            });
            if(!r.ok){
                const txt = await r.text();
                resultsEl.innerHTML = `<p style="text-align:center;color:#e74c3c;font-size:11px;padding:10px;">تعذر البحث الذكي حالياً: ${escHtml(txt.slice(0,100))}</p>`;
                return;
            }
            const data = await r.json();
            if(!data.results || !data.results.length){
                resultsEl.innerHTML = '<p style="text-align:center;color:#888;font-size:11px;padding:10px;">لم يجد الذكاء الاصطناعي تطابقاً مناسباً — جرّب صياغة مختلفة</p>';
                return;
            }
            resultsEl.innerHTML = data.results.map(res=>{
                const biz = bizList.find(b=>String(b.id)===String(res.business_id));
                if(!biz) return '';
                return `
                <div class="card" onclick="openFamilyBusiness('${biz.id}')" style="cursor:pointer; margin-bottom:6px; border-color:var(--gold);">
                    <div class="flex-reverse">
                        <img src="${biz.main_image||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'}" style="border-radius:8px;width:50px;height:50px;object-fit:cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'">
                        <div style="flex:1;text-align:right;margin-right:8px;">
                            <b style="font-size:11px;">${escHtml(biz.name)}</b>
                            <div style="font-size:9px;color:var(--gold);margin-top:2px;"><i class="fas fa-magic"></i> ${escHtml(res.reason||'')}</div>
                            ${res.suggested_products && res.suggested_products.length ? `<div style="font-size:9px;color:#aaa;margin-top:2px;">مقترح: ${res.suggested_products.map(p=>escHtml(p)).join('، ')}</div>` : ''}
                        </div>
                    </div>
                </div>`;
            }).join('');
        }catch(e){
            resultsEl.innerHTML = '<p style="text-align:center;color:#e74c3c;font-size:11px;padding:10px;">تعذر الاتصال بخدمة البحث الذكي</p>';
        } finally {
            _famAiSearchPending = false;
        }
    }

    function searchFamily(){
        const q = (document.getElementById('familySearch')?.value||'').trim().toLowerCase();
        if(!q){ _renderFamilyList(_familyCache); return; }
        const filtered = _familyCache.filter(b =>
            (b.name||'').toLowerCase().includes(q) || (b.description||'').toLowerCase().includes(q)
        );
        _renderFamilyList(filtered);
    }

    async function openFamilyBusiness(id, openRatings){
        let biz = _familyCache.find(b => String(b.id) === String(id));
        if(!biz){
            try{
                const r = await fetch(SB_URL+'/rest/v1/family_businesses_public?select=*&id=eq.'+id+'&limit=1', {
                    headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
                });
                const rows = await r.json();
                biz = rows[0];
            }catch(e){}
        }
        if(!biz){ showNotify('تعذر تحميل بيانات الأسرة المنتجة', 'error'); return; }
        _currentFamilyBiz = biz;

        document.getElementById('fam-detail-title').innerText = biz.name || 'الأسرة المنتجة';
        const imgEl = document.getElementById('fam-detail-image');
        if(biz.main_image){ imgEl.src = biz.main_image; imgEl.style.display = 'block'; } else imgEl.style.display = 'none';

        const badgeEl = document.getElementById('fam-detail-status-badge');
        badgeEl.innerText = biz.is_open ? '🟢 مفتوح الآن' : '🔴 مغلق حالياً';
        badgeEl.style.background = biz.is_open ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)';
        badgeEl.style.color = biz.is_open ? '#2ecc71' : '#e74c3c';
        const catBadgeEl = document.getElementById('fam-detail-cat-badge');
        if(catBadgeEl){
            if(biz.category){ catBadgeEl.style.display='inline-block'; catBadgeEl.innerText = biz.category; }
            else catBadgeEl.style.display='none';
        }

        // [FAM-RATING] تحميل وعرض التقييمات
        document.getElementById('fam-ratings-panel').style.display = 'none';
        document.getElementById('fam-submit-rating-box').style.display = 'none';
        await _loadFamRatingsDetail(biz.id);
        if (openRatings === true) _toggleFamRatingsPanel(true);

        document.getElementById('fam-detail-desc').innerText = biz.description || '';

        const hoursEl = document.getElementById('fam-detail-hours');
        hoursEl.innerHTML = (biz.open_time || biz.close_time)
            ? `<i class="fas fa-clock" style="color:var(--gold);"></i> ${escHtml(biz.open_time||'')}${biz.close_time?(' - '+escHtml(biz.close_time)):''}`
            : '';
        const addrEl = document.getElementById('fam-detail-address');
        addrEl.innerHTML = biz.address ? `<i class="fas fa-map-marker-alt" style="color:var(--gold);"></i> ${escHtml(biz.address)}` : '';

        const prodDiv = document.getElementById('fam-detail-products');
        prodDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;font-size:11px;padding:10px;">جاري تحميل المنتجات...</p>';
        try{
            const rp = await fetch(SB_URL+'/rest/v1/family_business_products?select=*&business_id=eq.'+biz.id+'&order=created_at.asc', {
                headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
            });
            const products = await rp.json();
            _currentFamilyProducts = products || []; // كاش آمن لتجنب تمرير بيانات معقدة عبر onclick
            if(!products || !products.length){
                prodDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;font-size:11px;padding:10px;">لم تتم إضافة منتجات بعد</p>';
            } else {
                prodDiv.innerHTML = products.map(p => {
                    const unavailable = p.is_available === false;
                    return `
                    <div class="card" style="padding:8px;text-align:center;${unavailable?'opacity:.5;':''}">
                        <img src="${p.image||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'}" style="width:100%;height:70px;object-fit:cover;border-radius:8px;margin-bottom:6px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'">
                        <b style="font-size:11px;display:block;">${escHtml(p.name)}</b>
                        ${p.description?`<div style="font-size:9px;color:#888;margin:2px 0;">${escHtml(p.description)}</div>`:''}
                        ${p.prep_time?`<div style="font-size:8px;color:var(--gold);margin:2px 0;"><i class="fas fa-clock"></i> ${escHtml(p.prep_time)}</div>`:''}
                        <div style="font-size:11px;margin:4px 0;">${fmtSYP(p.price,{inline:true,size:11})}</div>
                        ${unavailable ? `
                            <div style="font-size:9px;color:#e74c3c;font-weight:bold;background:rgba(231,76,60,0.1);border-radius:6px;padding:4px;">غير متوفر حالياً</div>
                        ` : p.needs_customization ? `
                            <button onclick="contactFamilyProduct('${p.id}')" style="width:100%;background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); border-radius:8px; padding:6px; font-size:10px; cursor:pointer; margin-bottom:4px;">
                                <i class="fas fa-comment-dots"></i> دردشة للتخصيص
                            </button>
                            <button onclick="_openProductCustomizeBox('${p.id}')" style="width:100%;background:transparent; border:1px solid #555; color:#ccc; border-radius:8px; padding:5px; font-size:9px; cursor:pointer;">
                                <i class="fas fa-pen"></i> تخصيص الطلب
                            </button>
                        ` : `
                            <div style="display:flex; gap:4px; margin-bottom:4px;">
                                <button onclick="contactFamilyProduct('${p.id}')" style="flex:1; background:rgba(255,255,255,0.06); border:1px solid #555; color:#ccc; border-radius:8px; padding:6px 2px; font-size:9px; cursor:pointer;">
                                    <i class="fas fa-comment-dots"></i> دردشة
                                </button>
                                <button onclick="famOrderProduct('${p.id}')" style="flex:1.3; background:var(--gold); border:none; color:#1a1a1a; border-radius:8px; padding:6px 2px; font-size:9px; font-weight:bold; cursor:pointer;">
                                    <i class="fas fa-shopping-cart"></i> اطلب مع التوصيل
                                </button>
                            </div>
                            <button onclick="_openProductCustomizeBox('${p.id}')" style="width:100%;background:transparent; border:1px solid #555; color:#ccc; border-radius:8px; padding:5px; font-size:9px; cursor:pointer;">
                                <i class="fas fa-pen"></i> تخصيص الطلب
                            </button>
                        `}
                        <div id="fam-customize-box-${p.id}" style="display:none; margin-top:6px; text-align:right;">
                            <textarea id="fam-customize-input-${p.id}" placeholder="اكتب طلبك الخاص أو ملاحظاتك..." style="width:100%; min-height:45px; background:rgba(0,0,0,0.25); border:1px solid rgba(212,175,55,0.3); border-radius:6px; padding:6px; color:#fff; font-size:10px; resize:vertical; font-family:inherit; margin-bottom:5px;"></textarea>
                            <button onclick="_sendProductCustomization('${p.id}')" style="width:100%; background:var(--gold); color:#000; border:none; border-radius:6px; padding:6px; font-size:9px; cursor:pointer;"><i class="fas fa-paper-plane"></i> إرسال عبر الدردشة</button>
                        </div>
                    </div>`;
                }).join('');
            }
        }catch(e){
            prodDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;font-size:11px;padding:10px;">تعذر تحميل المنتجات</p>';
        }

        nav('p-family-detail');
    }

    async function _famResolveContactPhone(){
        if(!_currentFamilyBiz) return '';
        let phone = _currentFamilyBiz.contact_phone || '';
        if(_currentFamilyBiz.contact_mode === 'admin'){
            try{
                const r = await fetch(SB_URL+'/rest/v1/app_config?select=contact_whatsapp1&id=eq.1&limit=1', {
                    headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
                });
                const rows = await r.json();
                if(rows[0]?.contact_whatsapp1) phone = rows[0].contact_whatsapp1;
            }catch(e){}
        }
        return (phone||'').replace(/[^0-9]/g,'');
    }

    // ══ [FAM-RATING] نظام التقييمات الكامل ══
    let _famCurrentRatingStars = 0;
    let _famDetailRatings = [];

    async function _loadFamRatingsDetail(businessId){
        try{
            const r = await fetch(SB_URL+'/rest/v1/family_business_ratings?select=*&business_id=eq.'+businessId+'&order=created_at.desc', {
                headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
            });
            _famDetailRatings = r.ok ? (await r.json() || []) : [];
        }catch(e){ _famDetailRatings = []; }

        const badgeEl = document.getElementById('fam-detail-rating-badge');
        const summaryEl = document.getElementById('fam-ratings-summary');
        const listEl = document.getElementById('fam-ratings-list');

        if(!_famDetailRatings.length){
            if(badgeEl) badgeEl.innerHTML = `<small style="color:#888;font-size:11px;">لا توجد تقييمات بعد — كن أول من يقيّم!</small>`;
            if(summaryEl) summaryEl.innerHTML = `<p style="color:#888;font-size:11px;margin:0;">لا توجد تقييمات بعد</p>`;
            if(listEl) listEl.innerHTML = '';
            return;
        }
        const avg = _famDetailRatings.reduce((s,r)=>s+r.stars,0) / _famDetailRatings.length;
        if(badgeEl) badgeEl.innerHTML = `${_famStarsHtml(avg,13)} <small style="color:#aaa;font-size:11px;">${avg.toFixed(1)} (${_famDetailRatings.length} تقييم) <i class="fas fa-chevron-down" style="font-size:9px;"></i></small>`;
        if(summaryEl) summaryEl.innerHTML = `
            <div style="font-size:22px; font-weight:bold; color:var(--gold);">${avg.toFixed(1)}</div>
            <div style="margin:4px 0;">${_famStarsHtml(avg,16)}</div>
            <small style="color:#aaa;">من ${_famDetailRatings.length} تقييم</small>`;
        if(listEl) listEl.innerHTML = _famDetailRatings.map(rt => `
            <div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <b style="font-size:11px;">${escHtml(rt.customer_name||'عميل')}</b>
                    <small style="color:#888; font-size:9px;">${new Date(rt.created_at).toLocaleDateString('ar-SY')}</small>
                </div>
                <div style="margin-bottom:4px;">${_famStarsHtml(rt.stars,11)}</div>
                ${rt.comment ? `<p style="font-size:11px; color:#ccc; margin:0;">${escHtml(rt.comment)}</p>` : ''}
            </div>`).join('');
    }

    function _toggleFamRatingsPanel(forceOpen){
        const panel = document.getElementById('fam-ratings-panel');
        if(!panel) return;
        const shouldOpen = forceOpen === true || panel.style.display === 'none';
        panel.style.display = shouldOpen ? 'block' : 'none';
        if(shouldOpen) panel.scrollIntoView({behavior:'smooth', block:'center'});
    }

    function _openSubmitFamRating(){
        if(!currentUser || !currentUser.uid){ showNotify('يرجى تسجيل الدخول أولاً للتقييم', 'error'); return; }
        _famCurrentRatingStars = 0;
        document.querySelectorAll('.fam-star-input').forEach(s=>{ s.className='far fa-star fam-star-input'; s.style.color='#555'; });
        document.getElementById('fam-rating-comment-input').value = '';
        document.getElementById('fam-submit-rating-box').style.display = 'block';
        document.getElementById('fam-submit-rating-box').scrollIntoView({behavior:'smooth', block:'center'});
    }

    function _setFamRatingStars(n){
        _famCurrentRatingStars = n;
        document.querySelectorAll('.fam-star-input').forEach(s=>{
            const val = parseInt(s.dataset.val);
            if(val <= n){ s.className='fas fa-star fam-star-input'; s.style.color='#f4c430'; }
            else { s.className='far fa-star fam-star-input'; s.style.color='#555'; }
        });
    }

    let _famRatingSubmitPending = false;
    async function _submitFamRating(){
        if(_famRatingSubmitPending) return;
        if(!_currentFamilyBiz) return;
        if(!currentUser || !currentUser.uid){ showNotify('يرجى تسجيل الدخول أولاً', 'error'); return; }
        if(_famCurrentRatingStars < 1){ showNotify('يرجى اختيار عدد النجوم أولاً', 'error'); return; }
        _famRatingSubmitPending = true;
        try{
            const comment = document.getElementById('fam-rating-comment-input')?.value.trim() || '';
            const payload = {
                business_id: _currentFamilyBiz.id,
                customer_id: currentUser.uid,
                customer_name: currentUser.name || 'عميل',
                stars: _famCurrentRatingStars,
                comment
            };
            const r = await fetch(SB_URL+'/rest/v1/family_business_ratings', {
                method:'POST',
                headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'},
                body: JSON.stringify(payload)
            });
            if(!r.ok){
                const txt = await r.text();
                showNotify(txt.includes('duplicate') || txt.includes('23505') ? '⚠️ لقد قيّمت هذه الأسرة من قبل — تم تحديث تقييمك' : 'تعذر إرسال التقييم', txt.includes('duplicate')?'success':'error');
            } else {
                showNotify('✅ شكراً لتقييمك!');
            }
            document.getElementById('fam-submit-rating-box').style.display = 'none';
            await _loadFamRatingsDetail(_currentFamilyBiz.id);
            _toggleFamRatingsPanel(true);
            // تحديث الكاش العام لتظهر النجوم الجديدة في القائمة أيضاً
            await _loadFamilyRatingStats([_currentFamilyBiz.id]);
        }catch(e){
            showNotify('تعذر إرسال التقييم، تحقق من الاتصال', 'error');
        } finally {
            _famRatingSubmitPending = false;
        }
    }

    // ============================================================================
    // [FEATURE-FAMILY-CHAT] نظام دردشة داخلي منفصل تماماً بين العميل والأسرة المنتجة
    // ============================================================================
    let _famChatId = null;
    let _famChatChannel = null;

    // [FEATURE-NOTIF-CLICK-NAVIGATE] فتح محادثة أسرة منتجة مباشرة بمعرّف المحادثة (من إشعار مثلاً)،
    // بدون الحاجة لوجود العميل بصفحة المحل أصلاً — يجلب بيانات المحل تلقائياً ثم يفتح نفس شاشة الدردشة
    async function openFamilyChatById(chatId) {
        if (!currentUser || !currentUser.uid) { showNotify('يرجى تسجيل الدخول أولاً', 'error'); return; }
        const { data: chat } = await _supabase.from('family_business_chats').select('*').eq('id', chatId).maybeSingle();
        if (!chat) { showNotify('تعذّر العثور على المحادثة', 'error'); return; }
        const { data: biz } = await _supabase.from('family_businesses').select('*').eq('id', chat.business_id).maybeSingle();
        _currentFamilyBiz = biz || { id: chat.business_id, name: 'المحل' };
        await openFamilyChat();
    }

    async function openFamilyChat(prefillNote) {
        if (!_currentFamilyBiz) return;
        if (!currentUser || !currentUser.uid) { showNotify('يرجى تسجيل الدخول أولاً', 'error'); return; }

        document.getElementById('fam-chat-title').innerText = 'دردشة مع ' + (_currentFamilyBiz.name || '');
        document.getElementById('fam-chat-overlay').style.display = 'flex';
        // [FIX-CHAT-UI-BLEED] إخفاء صريح لشريط التنقل السفلي وأي عناصر ثابتة تانية أثناء فتح
        // الدردشة، بدل الاعتماد فقط على z-index — يمنع أي تداخل بصري نهائياً
        // [FIX-CHAT-UI-BLEED-COMPLETE] إخفاء صريح لكل العناصر الثابتة اللي تعيش خارج أي صفحة
        // (.page) — الشريط اللي فيه الجرس والتحديث، وشريط العروض/التنبيهات — هذي ما كانت مغطاة
        // بالإصلاح السابق (كان يغطي بس شريط التنقل السفلي والتصنيفات)
        document.querySelectorAll('.tab-bar, .main-category-tabs, #typing-pulse-bar, #promo-bar').forEach(el => { el.dataset.wasVisible = el.style.display; el.style.display = 'none'; });
        document.getElementById('fam-chat-messages').innerHTML = `<div style="text-align:center; color:#888; font-size:11px; padding:20px;"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</div>`;

        // إيجاد أو إنشاء محادثة (فريدة لكل زوج عميل+نشاط)
        let { data: chat } = await _supabase.from('family_business_chats')
            .select('*').eq('business_id', _currentFamilyBiz.id).eq('customer_id', currentUser.uid).maybeSingle();
        if (!chat) {
            const { data: newChat, error } = await _supabase.from('family_business_chats').insert([{
                business_id: _currentFamilyBiz.id, customer_id: currentUser.uid, customer_name: currentUser.name || 'عميل'
            }]).select().single();
            if (error) { showNotify('⚠️ تعذّر بدء الدردشة: ' + error.message, 'error'); return; }
            chat = newChat;
        }
        _famChatId = chat.id;

        // تصفير علامة "غير مقروء" للعميل عند فتح الدردشة
        await _supabase.from('family_business_chats').update({ customer_unread: false, customer_unread_count: 0 }).eq('id', _famChatId);

        await _loadFamilyChatMessages();
        if (prefillNote) document.getElementById('fam-chat-input').value = prefillNote;

        // [FEATURE-FB-BLOCK-CUSTOMER] تنبيه واضح لو المحل حاظر هذا العميل + تعطيل الكتابة
        const chatInputEl = document.getElementById('fam-chat-input');
        let blockBanner = document.getElementById('fam-chat-blocked-banner');
        if (chat.is_blocked_by_business) {
            if (!blockBanner) {
                blockBanner = document.createElement('div');
                blockBanner.id = 'fam-chat-blocked-banner';
                blockBanner.style.cssText = 'background:rgba(231,76,60,0.15);border:1px solid var(--danger);color:#ff8a80;font-size:11px;padding:8px 12px;text-align:center;';
                blockBanner.innerText = '🚫 هذا المحل قام بحظرك، لا يمكنك إرسال رسائل جديدة له';
                document.getElementById('fam-chat-messages').insertAdjacentElement('beforebegin', blockBanner);
            }
            blockBanner.style.display = 'block';
            if (chatInputEl) chatInputEl.disabled = true;
        } else {
            if (blockBanner) blockBanner.style.display = 'none';
            if (chatInputEl) chatInputEl.disabled = false;
        }

        // استماع لحظي لأي رسالة جديدة
        if (_famChatChannel) { try { _supabase.removeChannel(_famChatChannel); } catch(e){} }
        _famChatChannel = _supabase.channel('fam_chat_' + _famChatId)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'family_business_messages', filter: 'chat_id=eq.' + _famChatId }, (payload) => {
                _appendFamilyChatMessage(payload.new);
                _scrollFamilyChatToBottom();
            }).subscribe();
    }

    function closeFamilyChat() {
        if (_famChatChannel) { try { _supabase.removeChannel(_famChatChannel); } catch(e){} _famChatChannel = null; }
        document.getElementById('fam-chat-overlay').style.display = 'none';
        // [FIX-CHAT-UI-BLEED] إعادة إظهار العناصر الثابتة اللي أخفيناها عند فتح الدردشة
        document.querySelectorAll('.tab-bar, .main-category-tabs, #typing-pulse-bar, #promo-bar').forEach(el => { el.style.display = el.dataset.wasVisible || ''; });
        _famChatId = null;
    }

    async function _loadFamilyChatMessages() {
        const { data: msgs } = await _supabase.from('family_business_messages').select('*').eq('chat_id', _famChatId).order('created_at', { ascending: true });
        const wrap = document.getElementById('fam-chat-messages');
        wrap.innerHTML = '';
        if (!msgs || msgs.length === 0) {
            wrap.innerHTML = `<div style="text-align:center; color:#888; font-size:11px; padding:20px;">ابدأ المحادثة الآن 👋</div>`;
            return;
        }
        msgs.forEach(m => _appendFamilyChatMessage(m));
        _scrollFamilyChatToBottom();
    }

    function _appendFamilyChatMessage(m) {
        const wrap = document.getElementById('fam-chat-messages');
        if (!wrap) return;
        const isMe = m.sender === 'customer';
        const bubble = document.createElement('div');
        bubble.style.cssText = `align-self:${isMe?'flex-end':'flex-start'}; max-width:75%; background:${isMe?'var(--gold)':'rgba(255,255,255,0.08)'}; color:${isMe?'#000':'#fff'}; padding:8px 12px; border-radius:14px; font-size:13px;`;
        if (m.image_url) {
            const img = document.createElement('img');
            img.src = m.image_url;
            img.style.cssText = 'max-width:100%; border-radius:10px; margin-bottom:' + (m.message ? '6px' : '0') + '; cursor:pointer; display:block;';
            img.onclick = () => window.open(m.image_url, '_blank');
            bubble.appendChild(img);
        }
        if (m.message) {
            const textEl = document.createElement('div');
            textEl.innerText = m.message;
            bubble.appendChild(textEl);
        }
        wrap.appendChild(bubble);
    }

    function _scrollFamilyChatToBottom() {
        const wrap = document.getElementById('fam-chat-messages');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
    }

    // [FIX-CHAT-DUPLICATE-IMAGE] معالجة اختيار صورة للإرسال — تحويلها لمعاينة قبل الإرسال الفعلي
    let _famChatPendingImage = null;
    function _handleFamChatImageSelected(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            _famChatPendingImage = e.target.result;
            const prev = document.getElementById('fam-chat-image-preview');
            prev.style.display = 'block';
            prev.innerHTML = `<div style="display:flex; align-items:center; gap:8px;"><img src="${e.target.result}" style="width:50px; height:50px; object-fit:cover; border-radius:8px; border:1px solid var(--gold);"><span style="font-size:11px; color:#ccc; flex:1;">صورة جاهزة للإرسال</span><button onclick="_famChatPendingImage=null; document.getElementById('fam-chat-image-preview').style.display='none';" style="background:none; border:none; color:var(--danger); font-size:16px;"><i class="fas fa-times"></i></button></div>`;
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    // [FIX-CHAT-DUPLICATE-IMAGE] حماية من الإرسال المزدوج (نفس نمط باقي التطبيق) + دعم إرفاق صورة
    let _famChatSendPending = false;
    async function sendFamilyChatMessage() {
        if (_famChatSendPending) return; // منع الإرسال المزدوج (نقرتين سريعتين أو Enter متكرر)
        const input = document.getElementById('fam-chat-input');
        const text = input.value.trim();
        const image = _famChatPendingImage;
        if (!text && !image) return;
        if (!_famChatId) return;
        // [FEATURE-FB-BLOCK-CUSTOMER] منع الإرسال لو المحل حظر هذا العميل
        const { data: chatCheck } = await _supabase.from('family_business_chats').select('is_blocked_by_business').eq('id', _famChatId).maybeSingle();
        if (chatCheck?.is_blocked_by_business) { showNotify('⚠️ لا يمكنك إرسال رسائل لهذا المحل حالياً', 'error'); return; }
        _famChatSendPending = true;
        input.value = '';
        _famChatPendingImage = null;
        document.getElementById('fam-chat-image-preview').style.display = 'none';
        try {
            const { error } = await _supabase.from('family_business_messages').insert([{ chat_id: _famChatId, sender: 'customer', message: text || null, image_url: image || null }]);
            if (error) { showNotify('⚠️ تعذّر إرسال الرسالة: ' + error.message, 'error'); return; }
            // [FIX-DUP-UPDATE] لم يعد التحديث اليدوي هنا ضرورياً — Trigger فـ fb_message_after_insert يحدّث
            // last_message / last_message_at / business_unread / business_unread_count تلقائياً وبدقة
        } finally {
            _famChatSendPending = false;
        }
    }

    // [FEATURE-FAMILY-CHAT] استبدال زر تواصل الواتساب بالبطاقة بفتح الدردشة مباشرة
    async function _quickContactFamilyCard(id){
        const biz = _familyCache.find(b => String(b.id) === String(id));
        if(!biz) return;
        _currentFamilyBiz = biz;
        await openFamilyChat();
    }

    // [FEATURE-FAMILY-CHAT] استفسار عن منتج محدد يفتح الدردشة مع تعبئة الرسالة تلقائياً
    async function _sendProductCustomization(productId){
        const note = document.getElementById('fam-customize-input-'+productId)?.value.trim();
        if(!note){ showNotify('يرجى كتابة طلبك أولاً', 'error'); return; }
        const p = _currentFamilyProducts.find(x => String(x.id) === String(productId));
        if(!p || !_currentFamilyBiz) return;
        document.getElementById('fam-customize-box-'+productId).style.display = 'none';
        await openFamilyChat(`بخصوص "${p.name}": ${note}`);
    }

    // [FAM-CUSTOMIZE] فتح/إغلاق صندوق كتابة طلب التخصيص لمنتج محدد
    function _openProductCustomizeBox(productId){
        const box = document.getElementById('fam-customize-box-'+productId);
        if(!box) return;
        const isHidden = box.style.display === 'none';
        document.querySelectorAll('[id^="fam-customize-box-"]').forEach(b=>{ if(b.id !== 'fam-customize-box-'+productId) b.style.display='none'; });
        box.style.display = isHidden ? 'block' : 'none';
        if(isHidden) document.getElementById('fam-customize-input-'+productId)?.focus();
    }

    // [FEATURE-FAMILY-CHAT] الاستفسار عن منتج محدد يفتح الدردشة مباشرة بدل واتساب
    async function contactFamilyProduct(productId){
        if(!_currentFamilyBiz) return;
        const p = _currentFamilyProducts.find(x => String(x.id) === String(productId));
        const productName = p ? p.name : '';
        await openFamilyChat(productName ? `أنا مهتم بـ"${productName}"` : '');
    }

    // ── [FAMILY-ORDER] طلب صنف جاهز مع التوصيل (يدخل في نظام الطلبات والتوصيل الحقيقي) ──
    function famOrderProduct(productId){
        const p = _currentFamilyProducts.find(x => String(x.id) === String(productId));
        if(!p){ showNotify('تعذر تحميل بيانات المنتج', 'error'); return; }
        // [FEATURE-PRODUCT-STOCK] منع الطلب لو نفذت الكمية
        if(p.quantity !== null && p.quantity !== undefined && p.quantity <= 0){ showNotify('⚠️ عذراً، نفذت كمية هذا المنتج', 'error'); return; }
        if(!currentUser || !currentUser.phone){ showNotify('يرجى تسجيل الدخول أولاً لإتمام الطلب', 'error'); return; }
        if(!currentUser.address){ showNotify('يرجى إضافة عنوانك من صفحة "حسابي" أولاً', 'error'); return; }
        _famOrderProductId = productId;
        _famOrderQty = 1;
        _famRenderOrderBox();
        const box = document.getElementById('fam-order-box');
        if(box){ box.style.display = 'block'; box.scrollIntoView({behavior:'smooth', block:'center'}); }
    }

    function famChangeOrderQty(delta){
        const p = _currentFamilyProducts.find(x => String(x.id) === String(_famOrderProductId));
        const maxQty = (p && p.quantity !== null && p.quantity !== undefined) ? p.quantity : Infinity;
        if(delta > 0 && _famOrderQty >= maxQty){ showNotify('الكمية المتوفرة: ' + maxQty + ' فقط', 'error'); return; }
        _famOrderQty = Math.max(1, Math.min(maxQty, _famOrderQty + delta));
        _famRenderOrderBox();
    }

    function _famRenderOrderBox(){
        const p = _currentFamilyProducts.find(x => String(x.id) === String(_famOrderProductId));
        if(!p) return;
        const deliveryFee = parseFloat(_currentFamilyBiz?.delivery_fee || 0);
        const subtotal = p.price * _famOrderQty;
        const total = subtotal + deliveryFee;
        const box = document.getElementById('fam-order-box');
        if(!box) return;
        box.innerHTML = `
            <div style="background:rgba(212,175,55,0.06); border:1px solid var(--gold); border-radius:12px; padding:12px;">
                <b style="font-size:12px; color:var(--gold);">🛒 طلب: ${escHtml(p.name)}</b>
                ${(p.quantity !== null && p.quantity !== undefined) ? `<div style="font-size:10px;color:#f59e0b;margin-top:2px;">متبقي ${p.quantity} فقط</div>` : ''}
                <div style="display:flex; align-items:center; justify-content:center; gap:14px; margin:10px 0;">
                    <button onclick="famChangeOrderQty(-1)" style="width:32px;height:32px;border-radius:8px;background:#333;color:#fff;border:none;font-size:16px;cursor:pointer;">-</button>
                    <b style="font-size:14px;">${_famOrderQty}</b>
                    <button onclick="famChangeOrderQty(1)" style="width:32px;height:32px;border-radius:8px;background:var(--gold);color:#1a1a1a;border:none;font-size:16px;cursor:pointer;">+</button>
                </div>
                <div style="font-size:11px;color:#ccc;display:flex;justify-content:space-between;margin-bottom:3px;"><span>الأصناف:</span><span>${fmtSYP(subtotal,{inline:true,size:11})}</span></div>
                <div style="font-size:11px;color:#ccc;display:flex;justify-content:space-between;margin-bottom:6px;"><span>التوصيل:</span><span>${fmtSYP(deliveryFee,{inline:true,size:11})}</span></div>
                <div style="font-size:13px;font-weight:bold;display:flex;justify-content:space-between;border-top:1px solid rgba(212,175,55,0.3);padding-top:6px;margin-bottom:10px;"><span>الإجمالي:</span><span style="color:var(--gold);">${fmtSYP(total,{inline:true,size:13})}</span></div>
                <div style="display:flex;gap:6px;">
                    <button onclick="famCancelOrderBox()" style="flex:1;background:transparent;border:1px solid #555;color:#aaa;border-radius:8px;padding:9px;font-size:12px;cursor:pointer;">إلغاء</button>
                    <button onclick="famConfirmOrder()" style="flex:2;background:var(--gold);border:none;color:#1a1a1a;border-radius:8px;padding:9px;font-size:12px;font-weight:bold;cursor:pointer;">✅ تأكيد الطلب</button>
                </div>
            </div>`;
    }

    function famCancelOrderBox(){
        const box = document.getElementById('fam-order-box');
        if(box){ box.style.display = 'none'; box.innerHTML = ''; }
        _famOrderProductId = null;
    }

    let _famOrderPending = false;
    async function famConfirmOrder(){
        if(_famOrderPending) return;
        const p = _currentFamilyProducts.find(x => String(x.id) === String(_famOrderProductId));
        if(!p || !_currentFamilyBiz) return;
        // [SEC-FIX-ADDRESS-REQUIRED-ALL-PATHS] طلبات الأسر المنتجة توصيل دائماً — تتطلب عنواناً
        if (!(await _verifyCustomerAddressLive(true))) return;
        _famOrderPending = true;
        const btn = event?.currentTarget;
        if(btn){ btn.disabled = true; btn.innerText = 'جاري الإرسال...'; }
        try{
            // [FEATURE-PRODUCT-STOCK] حجز الكمية ذرّياً قبل إنشاء الطلب (تحديث شرطي يمنع تعارض عميلين بنفس اللحظة)
            if (p.quantity !== null && p.quantity !== undefined) {
                const { data: stockRows, error: stockErr } = await _supabase.from('family_business_products')
                    .update({ quantity: p.quantity - _famOrderQty })
                    .eq('id', p.id).gte('quantity', _famOrderQty).select('id');
                if (stockErr || !stockRows || stockRows.length === 0) {
                    showNotify('⚠️ عذراً، الكمية المتوفرة تغيّرت أو نفذت — جرّب كمية أقل', 'error');
                    _famOrderPending = false;
                    if(btn){ btn.disabled = false; btn.innerText = '✅ تأكيد الطلب'; }
                    return;
                }
            }

            // [FEATURE-FB-FREE-DELIVERY] فحص إن كان صاحب المحل منح توصيلاً مجانياً لهذا العميل مسبقاً بالدردشة
            let isFreeDelivery = false;
            let freeDeliveryChatId = null;
            try {
                const { data: fdChat } = await _supabase.from('family_business_chats')
                    .select('id, free_delivery_granted')
                    .eq('business_id', _currentFamilyBiz.id)
                    .eq('customer_id', currentUser.uid)
                    .eq('free_delivery_granted', true)
                    .maybeSingle();
                if (fdChat) { isFreeDelivery = true; freeDeliveryChatId = fdChat.id; }
            } catch(e){ /* تجاهل أي خطأ هنا، الطلب يكمل عادي بدون إعفاء */ }

            const deliveryFee = parseFloat(_currentFamilyBiz.delivery_fee || 0);
            const subtotal = p.price * _famOrderQty;
            const total = subtotal + deliveryFee;
            const orderId = generateUniqueId();
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const itemsArr = [{id: p.id, n: p.name, p: p.price, qty: _famOrderQty}];

            const orderData = {
                id: orderId, customer_name: currentUser.name, phone: currentUser.phone,
                restaurant_name: _currentFamilyBiz.name, total: total,
                status: 'searching', date: new Date().toLocaleString('ar-SA'),
                items: itemsArr, points_earned: 0, points_spent: 0,
                delivery_price: deliveryFee, restaurant_id: null,
                customer_id: currentUser.uid, verify_code: verificationCode,
                is_free_delivery: isFreeDelivery
            };
            const safeOrderData = { ...orderData };
            delete safeOrderData.date; delete safeOrderData.phone;
            safeOrderData.items = JSON.stringify(itemsArr);
            const { error: err1 } = await _supabase.from('orders').insert([safeOrderData]);
            if(err1) throw err1;

            const _corePublicData = {
                id: orderId,
                customer_name: currentUser.name,
                phone: currentUser.phone,
                restaurant_name: _currentFamilyBiz.name,
                res_address: _currentFamilyBiz.address || 'موقع الأسرة المنتجة',
                customer_address: currentUser.address || 'عنوان العميل', // [CONFIRMED-OK] currentUser.address يتحدّث فعلياً عند اختيار عنوان (useSavedAddressForOrder)
                total: total,
                status: 'searching',
                items: JSON.stringify(itemsArr),
                customer_id: currentUser.uid,
                delivery_price: deliveryFee,
                created_at: new Date().toISOString(),
                verify_code: verificationCode,
                res_type: 'family',
                restaurant_id: _currentFamilyBiz.id, // [FIX-DRIVER-LOCATION] كان دائماً null — يمنع أي حل لموقع الاستلام
                pickup_lat: _currentFamilyBiz.pickup_lat || null,
                pickup_lng: _currentFamilyBiz.pickup_lng || null,
                notes: '🏠 طلب من أسرة منتجة',
                is_free_delivery: isFreeDelivery,
                original_delivery_fee: isFreeDelivery ? parseFloat(_currentFamilyBiz.delivery_fee || 0) : 0
            };
            if(currentUser.lat) _corePublicData.lat = currentUser.lat;
            if(currentUser.lng) _corePublicData.lng = currentUser.lng;
            const { error: err2 } = await _supabase.from('sh_public_orders').insert([_corePublicData]);
            if(err2) throw err2;

            // [FEATURE-FB-FREE-DELIVERY] استهلاك المنحة بعد إنشاء الطلب بنجاح (لا تُطبَّق على الطلبات القادمة تلقائياً)
            if (isFreeDelivery && freeDeliveryChatId) {
                await _supabase.from('family_business_chats').update({ free_delivery_granted: false }).eq('id', freeDeliveryChatId);
            }

            famCancelOrderBox();
            showNotify(isFreeDelivery ? `✅ تم إرسال طلبك بتوصيل مجاني! كود التسليم: ${verificationCode} 🎁` : `✅ تم إرسال طلبك! كود التسليم: ${verificationCode} 🦅`, 'success');
        }catch(e){
            showNotify('فشل إرسال الطلب، حاول مجدداً ❌', 'error');
        }finally{
            _famOrderPending = false;
            if(btn){ btn.disabled = false; btn.innerText = '✅ تأكيد الطلب'; }
        }
    }
    // ══ END [FAMILY-BIZ] ══

    function initWassayniMaps() {
        if(!mapPickup) {
            mapPickup = L.map('map-pickup', {zoomControl: false, attributionControl: false}).setView([userLoc.lat, userLoc.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapPickup);
        }
        if(!mapDropoff) {
            mapDropoff = L.map('map-dropoff', {zoomControl: false, attributionControl: false}).setView([userLoc.lat, userLoc.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapDropoff);
        }
    }

    async function searchAddress(type) {
        const query = document.getElementById(`search-${type}-text`).value;
        if(!query) return showNotify("اكتب عنواناً للبحث", "error");
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            const data = await resp.json();
            if(data && data.length > 0) {
                const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                if(type === 'pickup') {
                    pickupLoc = loc; mapPickup.setView([loc.lat, loc.lng], 15);
                    if(markerPickup) mapPickup.removeLayer(markerPickup);
                    markerPickup = L.marker(loc).addTo(mapPickup);
                } else {
                    dropoffLoc = loc; mapDropoff.setView([loc.lat, loc.lng], 15);
                    if(markerDropoff) mapDropoff.removeLayer(markerDropoff);
                    markerDropoff = L.marker(loc).addTo(mapDropoff);
                }
                showNotify("تم العثور على الموقع ✅");
            } else {
                showNotify("لم يتم العثور على العنوان", "error");
            }
        } catch(e) { showNotify("خطأ في الاتصال بالخرائط", "error"); }
    }

    // دوال الخريطة الكاملة الجديدة (دعم البحث والتحميل التلقائي ودعم الجوال)
    function openFullMap(type) {
        activeMapType = type;
        document.getElementById('full-map-overlay').style.display = 'flex';
        const titleMap = type === 'pickup' ? 'تحديد موقع الاستلام' : (type === 'dropoff' ? 'تحديد موقع التسليم' : 'تحديد موقعي الشخصي');
        document.getElementById('full-map-title').innerText = titleMap;

        let startLoc = userLoc;
        if(type === 'pickup' && pickupLoc.lat !== 0) startLoc = pickupLoc;
        if(type === 'dropoff' && dropoffLoc.lat !== 0) startLoc = dropoffLoc;

        if(!fullMap) {
            fullMap = L.map('full-map-container').setView([startLoc.lat, startLoc.lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(fullMap);
            fullMapMarker = L.marker([startLoc.lat, startLoc.lng], {draggable: true}).addTo(fullMap);
            
            // عند تحريك الدبوس، نقوم بجلب اسم المنطقة آلياً
            fullMapMarker.on('dragend', function(e) {
                reverseGeocode(e.target.getLatLng());
            });

            fullMap.on('click', (e) => {
                fullMapMarker.setLatLng(e.latlng);
                reverseGeocode(e.latlng);
            });
        } else {
            fullMap.setView([startLoc.lat, startLoc.lng], 16);
            fullMapMarker.setLatLng([startLoc.lat, startLoc.lng]);
        }
        setTimeout(() => fullMap.invalidateSize(), 300);
    }

    async function reverseGeocode(latlng) {
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`);
            const res = await resp.json();
            if(res && res.address) {
                const area = res.address.suburb || res.address.neighbourhood || res.address.city || res.address.town || "موقع محدد";
                document.getElementById('full-map-title').innerText = area;
                // إذا كنا في صفحة الحساب الشخصي، نحدث العنوان فوراً في الواجهة
                if(activeMapType === 'profile') {
                    document.getElementById('my-address').innerText = area;
                    currentUser.address = area;
                }
            }
        } catch(e) {}
    }

    async function searchAddressFull() {
        const query = document.getElementById('full-map-search-input').value;
        if(!query) return showNotify("أدخل اسم المنطقة للبحث", "info");
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            const results = await resp.json();
            if(results && results.length > 0) {
                const loc = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
                fullMap.setView([loc.lat, loc.lng], 16);
                fullMapMarker.setLatLng(loc);
                reverseGeocode(loc);
            } else { showNotify("لم يتم العثور على نتائج", "error"); }
        } catch(e) {}
    }

    function updateGPSProfileFull() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                fullMap.setView([loc.lat, loc.lng], 17);
                fullMapMarker.setLatLng(loc);
                reverseGeocode(loc);
            }, () => showNotify("فشل جلب الموقع", "error"), { enableHighAccuracy: true });
        }
    }

    function closeFullMap() {
        document.getElementById('full-map-overlay').style.display = 'none';
    }

    function confirmFullMapLocation() {
        const finalLoc = fullMapMarker.getLatLng();
        const areaName = document.getElementById('full-map-title').innerText;
        
        if(activeMapType === 'pickup') {
            pickupLoc = finalLoc;
            if(!mapPickup) initWassayniMaps();
            mapPickup.setView(finalLoc, 15);
            if(markerPickup) mapPickup.removeLayer(markerPickup);
            markerPickup = L.marker(finalLoc).addTo(mapPickup);
        } else if(activeMapType === 'dropoff') {
            dropoffLoc = finalLoc;
            if(!mapDropoff) initWassayniMaps();
            mapDropoff.setView(finalLoc, 15);
            if(markerDropoff) mapDropoff.removeLayer(markerDropoff);
            markerDropoff = L.marker(finalLoc).addTo(mapDropoff);
        } else if(activeMapType === 'profile') {
            userLoc = { lat: finalLoc.lat, lng: finalLoc.lng };
            document.getElementById('my-address').innerText = areaName;
            currentUser.address = areaName;
            // ===== FIX-LOC-1: حفظ الإحداثيات الحقيقية في كائن المستخدم =====
            currentUser.lat = finalLoc.lat;
            currentUser.lng = finalLoc.lng;
            localStorage.setItem('shahen_user', JSON.stringify(currentUser));
            if(profileMap) {
                profileMap.setView(finalLoc, 15);
                if(mapMarker) profileMap.removeLayer(mapMarker);
                mapMarker = L.marker(finalLoc).addTo(profileMap);
            }
            // [FIX-AUTO-SAVE-DB] حفظ مباشر في قاعدة البيانات بمجرد تأكيد الموقع على الخريطة —
            // بدون الاعتماد على ضغطة منفصلة لاحقة على "تحديث العنوان والبيانات" قد يتم تجاهلها سهواً
            if (currentUser && currentUser.uid) {
                _supabase.from('customers').update({ lat: finalLoc.lat, lng: finalLoc.lng, address: areaName }).eq('id', currentUser.uid)
                    .then(({ error }) => { if (!error) showNotify('تم حفظ موقعك بدقة في حسابك ✅'); });
            }
        }
        closeFullMap();
    }

    // تصفية الصيدليات المناوبة
    function setPhFilter(type) {
        phFilter = type;
        document.getElementById('ph-all-btn').classList.toggle('active', type === 'all');
        document.getElementById('ph-oncall-btn').classList.toggle('active', type === 'oncall');
        // إعادة رسم من الكاش فوراً — بدون fetch جديد
        if(_cache.pharma && _cache.pharma.length > 0) {
            _renderPharmaFromData(_cache.pharma, _cache.oncall || []);
        } else {
            renderPharmacies(); // fetch جديد فقط إذا لا يوجد كاش
        }
    }

    function updateGPSWassayni(type) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          if(type === 'pickup') {
            pickupLoc = loc; mapPickup.setView([loc.lat, loc.lng], 16);
            if(markerPickup) mapPickup.removeLayer(markerPickup);
            markerPickup = L.marker(loc).addTo(mapPickup);
          } else {
            dropoffLoc = loc; mapDropoff.setView([loc.lat, loc.lng], 16);
            if(markerDropoff) mapDropoff.removeLayer(markerDropoff);
            markerDropoff = L.marker(loc).addTo(mapDropoff);
          }
        });
      }
    }

    async function renderPharmacies() {
        const phListDiv = document.getElementById('ph-list');
        const phLoader  = document.getElementById('shahen-ph-loader');

        // عرض الكاش فوراً إذا متوفر مع oncall
        if(_cache.pharma && _cache.pharma.length > 0 && _cache.oncall !== null) {
            _renderPharmaFromData(_cache.pharma, _cache.oncall);
        } else {
            if(phLoader) phLoader.style.display = 'flex';
        }

        // جلب دائماً — oncall يتغير بالوقت فيحتاج تحديث
        // ===== حقول رسوم الاستشارة المطلوبة في جدول pharmacies =====
        // consultation_fee_enabled: boolean (true=مفعّل, false=مجاني)
        // consultation_fee: integer (قيمة الرسوم بالليرة السورية)
        // يتم التحكم بهما من لوحة الإدارة لكل صيدلية بشكل مستقل
        try {
            const [pharmaRes, oncallRes] = await Promise.all([
                _supabase.from('pharmacies').select('*'),
                _supabase.from('pharma_oncall').select('*').eq('is_active', true)
            ]);

            if(pharmaRes.data) {
                pharmacyData    = pharmaRes.data;
                _cache.pharma   = pharmaRes.data;
                _cache.pharmaTs = Date.now();
                setStorage('cached_pharmacies', pharmaRes.data);
            }
            // oncall يُحدَّث دائماً (حساس للوقت)
            _cache.oncall = oncallRes.data || [];

        } catch(e) {
            // [SEC-FIX-LOG] تم إزالة console.warn في بيئة الإنتاج لمنع تسريب معلومات داخلية
            const stored = getStorage('cached_pharmacies');
            if(stored && !_cache.pharma) { pharmacyData = stored; _cache.pharma = stored; }
            // تأكد oncall لا يبقى null
            if (_cache.oncall === null) _cache.oncall = [];
        } finally {
            // ===== إخفاء الـ loader دائماً حتى عند الخطأ =====
            if(phLoader) phLoader.style.display = 'none';
        }

        _renderPharmaFromData(_cache.pharma || [], _cache.oncall || []);
    }

    function _renderPharmaFromData(pharmaList, oncallRows) {
        const phListDiv = document.getElementById('ph-list');
        if(!phListDiv) return;
        const phLoader = document.getElementById('shahen-ph-loader');
        if(phLoader) phLoader.style.display = 'none';

        const now      = new Date();
        const dayNames = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
        const todayAr  = dayNames[now.getDay()];
        const todayDate= now.toISOString().split('T')[0];
        const nowMins  = now.getHours()*60 + now.getMinutes();

        // ===== بناء خريطة: pharmacy_id/name → بيانات المناوبة مع الوقت المتبقي =====
        const oncallMap = new Map(); // key: id أو name → { row, remainMins }

        (oncallRows||[]).forEach(row => {
            // ── مطابقة التاريخ: دعم صيغتي YYYY-MM-DD و DD-MM-YYYY ──
            let matchDate = false;
            if(row.specific_date) {
                const rd = row.specific_date.trim();
                // صيغة ISO: 2026-05-23
                const isoMatch  = rd === todayDate;
                // صيغة DD-MM-YYYY: 23-05-2026
                const parts     = todayDate.split('-'); // [YYYY, MM, DD]
                const altFormat = parts[2] + '-' + parts[1] + '-' + parts[0];
                const altMatch  = rd === altFormat;
                matchDate = isoMatch || altMatch;
            }

            // ── مطابقة اليوم الأسبوعي ──
            const daysArr  = Array.isArray(row.days) ? row.days : [];
            const matchDay = !row.specific_date && (
                daysArr.length === 0
                || daysArr.includes(todayAr)
            );

            if(!matchDate && !matchDay) return;

            let isOnDuty = true;
            let remainMins = 0;

            if(row.start_time && row.end_time) {
                const [sh,sm] = row.start_time.split(':').map(Number);
                const [eh,em] = row.end_time.split(':').map(Number);
                const st = sh*60+sm;
                const et = eh*60+em;
                // دعم المناوبة الليلية
                if(st <= et) {
                    isOnDuty = nowMins >= st && nowMins <= et;
                    remainMins = et - nowMins;
                } else {
                    isOnDuty = nowMins >= st || nowMins <= et;
                    remainMins = nowMins >= st ? (24*60 - nowMins + et) : (et - nowMins);
                }
                if(!isOnDuty) return;
            } else {
                // لا يوجد وقت محدد = مناوبة طوال اليوم
                remainMins = (24*60) - nowMins;
            }

            const entry = { row, remainMins };
            if(row.pharmacy_id)   oncallMap.set(String(row.pharmacy_id), entry);
            if(row.pharmacy_name) oncallMap.set(row.pharmacy_name.trim(), entry);
        });

        // ===== دالة حساب نص الوقت المتبقي =====
        function _remainText(mins) {
            if(!mins || mins <= 0) return '';
            if(mins >= 60) {
                const h = Math.floor(mins/60);
                const m = mins % 60;
                return m > 0 ? `${h} ساعة و${m} دقيقة` : `${h} ساعة`;
            }
            return `${mins} دقيقة`;
        }

        // ===== تمييز كل صيدلية =====
        pharmaList.forEach(p => {
            const byId   = oncallMap.get(String(p.id));
            const byName = oncallMap.get((p.name||'').trim());
            const entry  = byId || byName;
            p._isOnCallNow  = !!entry;
            p._remainMins   = entry ? entry.remainMins : 0;
            p._oncallRow    = entry ? entry.row : null;
        });
        // تشخيص مُعطَّل لتحسين الأداء
        // console.log('[ONCALL] اليوم:', todayAr, '| التاريخ:', todayDate);
        // console.log('[ONCALL] oncallMap keys:', [...oncallMap.keys()]);
        // console.log('[ONCALL] نتيجة:', pharmaList.map(p => p.name + ': ' + (p._isOnCallNow ? '✅ مناوبة' : '❌')));

        const filtered = phFilter==='oncall'
            ? pharmaList.filter(p => p._isOnCallNow)
            : pharmaList;

        if(filtered.length===0) {
            phListDiv.innerHTML = phFilter==='oncall'
                ? `<div style="text-align:center;padding:30px 20px;">
                    <div style="font-size:40px;margin-bottom:10px;">🌙</div>
                    <b style="color:var(--gold);font-size:13px;display:block;margin-bottom:6px;">لا توجد صيدليات مناوبة الآن</b>
                    <p style="font-size:11px;color:#888;margin:0;">جرّب لاحقاً أو اضغط <b style="color:var(--gold);">"الكل"</b> لرؤية جميع الصيدليات</p>
                   </div>`
                : "<p style='text-align:center;font-size:11px;color:#888;padding:20px;'>لا توجد صيدليات مسجلة حالياً</p>";
            return;
        }

        // ترتيب: المناوبة أولاً
        const sorted = [...filtered].sort((a,b) => (b._isOnCallNow ? 1 : 0) - (a._isOnCallNow ? 1 : 0));

        phListDiv.innerHTML = sorted.map(p => {
            const remainText = p._isOnCallNow && p._remainMins > 0 ? _remainText(p._remainMins) : '';
            const oncallBadge = p._isOnCallNow ? `
                <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:3px;">
                    <span style="background:var(--gold);color:#000;font-size:8px;padding:2px 7px;border-radius:5px;font-weight:bold;animation:pulse 2s infinite;">🌙 مناوبة الآن</span>
                    ${remainText ? `<span style="font-size:9px;color:#f1c40f;"><i class="fas fa-clock"></i> ينتهي بعد ${remainText}</span>` : ''}
                </div>` : '';

            const startText = p._oncallRow?.start_time || '';
            const endText   = p._oncallRow?.end_time   || '';
            const timeRange = startText && endText ? `<span style="font-size:9px;color:#888;"><i class="fas fa-clock"></i> ${startText} – ${endText}</span>` : '';

            return `
            <div class="card pharmacy-item" onclick="orderFromPharmacy('${p.id}')"
                 style="cursor:pointer;padding:10px;position:relative;
                        ${p._isOnCallNow ? 'border:2px solid var(--gold);background:rgba(212,175,55,0.06);box-shadow:0 0 10px rgba(212,175,55,0.15);' : ''}">
                ${p._isOnCallNow ? '<div style="position:absolute;top:0;right:0;background:var(--gold);color:#000;font-size:8px;padding:2px 8px;border-radius:0 10px 0 8px;font-weight:bold;">مناوبة 🌙</div>' : ''}
                <div class="flex-reverse">
                    <img src="${p.logo||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'}" width="48"
                         style="border-radius:10px;border:2px solid ${p._isOnCallNow?'var(--gold)':'rgba(255,255,255,0.1)'};flex-shrink:0;"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'">
                    <div style="flex:1;text-align:right;margin-right:10px;">
                        <b style="font-size:12px;color:${p._isOnCallNow?'#fff':'#3498db'};">
                            <i class="fas fa-prescription-bottle-alt" style="color:#3498db;"></i> ${escHtml(p.name)}
                        </b>
                        ${oncallBadge}
                        ${/* [FEATURE-LIVE-SHIFT-BADGE] مؤشر منفصل: هل الصيدلاني متصل ويستقبل استشارات الآن فعلياً —
                             مختلف عن جدول المناوبة الرسمي (🌙) أعلاه، وقد يكون فعّالاً بأي وقت اليوم */ ''}
                        <div style="margin-top:3px;">
                            ${p.is_open
                                ? '<span style="background:rgba(46,204,113,0.15); color:#2ecc71; border:1px solid #2ecc71; font-size:8px; padding:2px 7px; border-radius:5px; font-weight:bold;"><i class="fas fa-circle" style="font-size:6px;"></i> متاحة الآن للاستشارة</span>'
                                : '<span style="background:rgba(149,165,166,0.12); color:#888; border:1px solid #555; font-size:8px; padding:2px 7px; border-radius:5px;"><i class="fas fa-circle" style="font-size:6px;"></i> غير متصلة حالياً</span>'}
                        </div>
                        <div style="margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                            ${timeRange}
                            <small style="font-size:9px;">${p.fee ? fmtSYP(p.fee,{inline:true,size:9})+' توصيل' : ''}</small>
                            ${(p.consultation_fee_enabled && p.consultation_fee > 0) ? `<small style="font-size:9px;color:#f39c12;font-weight:bold;"><i class="fas fa-comment-medical"></i> رسوم استشارة: ${fmtSYP(p.consultation_fee,{inline:true,size:9})}</small>` : `<small style="font-size:9px;color:#2ecc71;">💬 استشارة مجانية</small>`}
                        </div>
                    </div>
                    <i class="fas fa-chevron-left" style="font-size:12px;color:var(--gold);flex-shrink:0;"></i>
                </div>
            </div>`;
        }).join('');
    }

    // [PHARMACY-WASSAYNI] تحويل طلب الصيدلية لخدمة وصيني
    function orderPharmacyViaWassayni() {
        // التبديل لتبويب وصيني
        switchCategory('wassayni');
        // وضع نص توضيحي في حقل تفاصيل الطلب
        setTimeout(function() {
            const taskEl = document.getElementById('wassayni-task');
            if (taskEl && !taskEl.value) {
                taskEl.value = 'طلب من صيدلية: ';
                taskEl.focus();
            }
        }, 400);
        showNotify('تم التحويل لخدمة وصيني 🦅 — اكتب اسم الصيدلية وما تحتاجه', 'info');
    }
    // [END-PHARMACY-WASSAYNI]

    function orderFromPharmacy(id) { 
        selectedPharmacyId = id;
        // عرض أو إخفاء صندوق رسوم الاستشارة حسب إعدادات الصيدلية
        const _ph = pharmacyData.find(p => String(p.id) === String(id));
        const _feeNotice = document.getElementById('consult-fee-notice');
        const _feeText = document.getElementById('consult-fee-amount-text');
        if (_ph && _ph.consultation_fee_enabled && _ph.consultation_fee > 0) {
            if (_feeNotice) _feeNotice.style.display = 'block';
            if (_feeText) _feeText.innerText = Number(_ph.consultation_fee).toLocaleString() + ' ل.س';
            // إعادة ضبط طريقة الدفع الافتراضية إلى كاش
            selectConsultPayMethod('cash');
            // فحص رصيد النقاط مقابل رسوم الاستشارة
            const _consultFeeVal = Number(_ph.consultation_fee);
            const _userPoints = currentUser ? (currentUser.points || 0) : 0;
            const _pointValue = (typeof pointsConfig !== 'undefined' && pointsConfig.moneyPerPoint) ? pointsConfig.moneyPerPoint : 1;
            const _pointsValueInMoney = _userPoints * _pointValue;
            const _pointsCheckEl = document.getElementById('consult-points-check');
            if (_pointsCheckEl) {
                if (_pointsValueInMoney >= _consultFeeVal) {
                    _pointsCheckEl.innerHTML = `<span style="color:#2ecc71;"><i class="fas fa-check-circle"></i> رصيد نقاطك كافٍ (${escHtml(String(_userPoints))} نقطة = ${escHtml(String(_pointsValueInMoney.toLocaleString()))} ل.س)</span>`;
                } else {
                    _pointsCheckEl.innerHTML = `<span style="color:#e74c3c;"><i class="fas fa-times-circle"></i> رصيد نقاطك غير كافٍ (${escHtml(String(_userPoints))} نقطة = ${escHtml(String(_pointsValueInMoney.toLocaleString()))} ل.س)</span>`;
                }
            }
        } else {
            if (_feeNotice) _feeNotice.style.display = 'none';
        }
        document.getElementById('medical-consult-modal').style.display = 'flex';
    }

    // ===== متغير ودالة اختيار طريقة دفع رسوم الاستشارة =====
    let _consultPayMethod = 'cash'; // 'cash' أو 'points'

    function selectConsultPayMethod(method) {
        _consultPayMethod = method;
        const cashEl = document.getElementById('consult-pay-cash');
        const pointsEl = document.getElementById('consult-pay-points');
        const pointsCheckEl = document.getElementById('consult-points-check');
        if (!cashEl || !pointsEl) return;
        if (method === 'cash') {
            cashEl.style.border = '2px solid #f39c12';
            cashEl.style.background = 'rgba(243,156,18,0.15)';
            pointsEl.style.border = '2px solid #555';
            pointsEl.style.background = 'rgba(0,0,0,0.2)';
            if (pointsCheckEl) pointsCheckEl.style.display = 'none';
        } else {
            pointsEl.style.border = '2px solid #f1c40f';
            pointsEl.style.background = 'rgba(241,196,15,0.15)';
            cashEl.style.border = '2px solid #555';
            cashEl.style.background = 'rgba(0,0,0,0.2)';
            if (pointsCheckEl) pointsCheckEl.style.display = 'block';
        }
    }
    // ===== نهاية دوال طريقة دفع رسوم الاستشارة =====

    // ===== [FEATURE-CONSULT-REDESIGN] نوع الاستشارة والصور المرفقة =====
    let _consultType = 'voice'; // 'voice' أو 'no_call'
    let _consultImages = []; // مصفوفة صور بصيغة data URL (نفس أسلوب رفع وثائق المندوب المُثبَت)

    function selectConsultType(type) {
        _consultType = type;
        const voiceEl = document.getElementById('consult-type-voice');
        const noCallEl = document.getElementById('consult-type-nocall');
        if (!voiceEl || !noCallEl) return;
        if (type === 'voice') {
            voiceEl.style.border = '2px solid #3498db'; voiceEl.style.background = 'rgba(52,152,219,0.15)';
            noCallEl.style.border = '2px solid #555'; noCallEl.style.background = 'rgba(0,0,0,0.2)';
        } else {
            noCallEl.style.border = '2px solid #9b59b6'; noCallEl.style.background = 'rgba(155,89,182,0.15)';
            voiceEl.style.border = '2px solid #555'; voiceEl.style.background = 'rgba(0,0,0,0.2)';
        }
    }

    function _handleConsultImagesSelected(event) {
        const files = Array.from(event.target.files || []);
        files.forEach(file => {
            if (_consultImages.length >= 4) { showNotify('⚠️ الحد الأقصى 4 صور', 'error'); return; }
            const reader = new FileReader();
            reader.onload = (e) => {
                _consultImages.push(e.target.result);
                _renderConsultImagesPreview();
            };
            reader.readAsDataURL(file);
        });
        event.target.value = '';
    }

    function _renderConsultImagesPreview() {
        const wrap = document.getElementById('consult-images-preview');
        if (!wrap) return;
        wrap.innerHTML = _consultImages.map((src, idx) => `
            <div style="position:relative;">
                <img src="${src}" style="width:100%; height:60px; object-fit:cover; border-radius:8px; border:1px solid var(--gold);">
                <button onclick="_removeConsultImage(${idx})" style="position:absolute; top:-6px; left:-6px; background:#e74c3c; color:#fff; border:none; border-radius:50%; width:18px; height:18px; font-size:10px; cursor:pointer;"><i class="fas fa-times"></i></button>
            </div>`).join('');
    }
    function _removeConsultImage(idx) {
        _consultImages.splice(idx, 1);
        _renderConsultImagesPreview();
    }
    function _resetConsultForm() {
        _consultImages = [];
        _consultType = 'voice';
        const descEl = document.getElementById('consult-problem-desc');
        if (descEl) descEl.value = '';
        _renderConsultImagesPreview();
        selectConsultType('voice');
    }
    // ===== نهاية [FEATURE-CONSULT-REDESIGN] =====

    let _medConsultPending = false; // [FIX-C2]
    async function submitMedicalConsult() {
        if (_medConsultPending) return;
        _medConsultPending = true;
        const _mcBtn = document.querySelector('[onclick="submitMedicalConsult()"]');
        if (_mcBtn) { _mcBtn.disabled = true; _mcBtn.innerText = 'جاري الإرسال...'; }
        try { await _submitMedicalConsult_inner(); } finally {
            _medConsultPending = false;
            if (_mcBtn) { _mcBtn.disabled = false; _mcBtn.innerText = 'أوافق وأطلب الآن 🚀'; }
        }
    }
    async function _submitMedicalConsult_inner() {
        const ph = pharmacyData.find(p => String(p.id) === String(selectedPharmacyId));
        if (!ph) { showNotify("عذراً، لم يتم العثور على بيانات الصيدلية", "error"); return; }
        // [FEATURE-BLOCK-CUSTOMER-CONSULT] فحص حظر العميل من الاستشارات (يديره الإدارة) — قبل أي
        // خطوة أخرى، سواء استشارة صوتية أو كتابية
        try {
            const { data: custCheck } = await _supabase.from('customers').select('is_blocked_from_consultation').eq('id', currentUser.uid).maybeSingle();
            if (custCheck && custCheck.is_blocked_from_consultation) {
                showNotify('⛔ عذراً، حسابك موقوف عن استخدام خدمة الاستشارات. تواصل مع الدعم لمزيد من التفاصيل', 'error');
                return;
            }
        } catch(e) { /* لا نمنع الاستشارة لو فشل الفحص نفسه لأي سبب تقني */ }
        // [SEC-FIX-ADDRESS-REQUIRED-ALL-PATHS] استشارة الصيدلية تنتهي بتوصيل الدواء — تتطلب عنواناً
        if (!(await _verifyCustomerAddressLive(true))) return;
        
        // احتساب رسوم الاستشارة إذا كانت مفعّلة
        const _consultFee = (ph.consultation_fee_enabled && ph.consultation_fee > 0) ? Number(ph.consultation_fee) : 0;
        const _deliveryFee = ph.fee || 0;
        const _totalFee = _consultFee + _deliveryFee;

        // ===== التحقق من دفع رسوم الاستشارة بالنقاط =====
        let _consultPayByPoints = false;
        if (_consultFee > 0 && _consultPayMethod === 'points') {
            const _userPoints = currentUser ? (currentUser.points || 0) : 0;
            const _pointValue = (typeof pointsConfig !== 'undefined' && pointsConfig.moneyPerPoint) ? pointsConfig.moneyPerPoint : 1;
            const _pointsValueInMoney = _userPoints * _pointValue;
            if (_pointsValueInMoney < _consultFee) {
                return showNotify(`رصيد نقاطك غير كافٍ (${_userPoints} نقطة = ${_pointsValueInMoney.toLocaleString()} ل.س). رسوم الاستشارة: ${_consultFee.toLocaleString()} ل.س`, "error");
            }
            // خصم نقاط الاستشارة من رصيد العميل فوراً — [SEC-FIX-ATOMIC-POINTS] عملية ذرّية
            // داخل القاعدة بدل حساب الرقم النهائي بجافاسكريبت وكتابته مباشرة (كان يسبب فقدان
            // تحديث حقيقي لو صار عمليتان متزامنتان لنفس العميل)
            const _pointsToDeduct = Math.ceil(_consultFee / _pointValue);
            const { data: _newPointsResult, error: _pointsErr } = await _supabase.rpc('adjust_customer_points', { p_customer_id: currentUser.uid, p_delta: -_pointsToDeduct });
            if (_pointsErr) { return showNotify('تعذّر خصم النقاط، حاول مجدداً', 'error'); }
            currentUser.points = _newPointsResult;
            localStorage.setItem('shahen_user', JSON.stringify(currentUser));
            const _ptEl = document.getElementById('shahen-points');
            if (_ptEl) _ptEl.innerText = _newPoints;
            _consultPayByPoints = true;
            showNotify(`✅ تم خصم ${_pointsToDeduct} نقطة مقابل رسوم الاستشارة`, "info");
        }
        
        // إخفاء المودال فوراً لبدء العملية
        document.getElementById('medical-consult-modal').style.display = 'none';

        const orderId = generateUniqueId();
        verificationCode = Math.floor(1000 + Math.random() * 9000);
        
        const publicOrderData = {
            id: orderId,
            customer_name: (currentUser && currentUser.name) || "عميل شاهين",
            phone: (currentUser && currentUser.phone) || "000",
            restaurant_name: ph.name,
            pharmacy_id: Number(ph.id),
            target_pharmacy: ph.name,
            restaurant_id: null,
            customer_address: (currentUser && currentUser.address) || "غير محدد",
            total: _totalFee,
            status: 'consulting',
            items: JSON.stringify([
                {n: "استشارة طبية", p: _consultFee},
                ...(_consultFee > 0 ? [{n: "رسوم استشارة", p: _consultFee}] : [])
            ].filter((v,i,a) => a.findIndex(x=>x.n===v.n)===i)),
            customer_id: currentUser ? currentUser.uid : null,
            delivery_price: _deliveryFee,
            consultation_fee: _consultFee,
            consult_pay_by_points: _consultPayByPoints,
            verify_code: verificationCode,
            res_type: 'pharmacy',
            restaurant_note: "طلب استشارة طبية" + (_consultFee > 0 ? ` | رسوم استشارة: ${_consultFee.toLocaleString()} ل.س (${_consultPayByPoints ? 'نقاط شاهين' : 'كاش'})` : ' مجانية'),
            created_at: new Date().toISOString(),
            // [BUGFIX-ADDRESS-PRIORITY] كان يفضّل عنوان الملف الشخصي الافتراضي دائماً بدل العنوان
            // اللي اختاره العميل فعلياً لهذا الطلب تحديداً — الأولوية الآن لـuserLoc (يعكس آخر اختيار
            // فعلي)، والعودة لعنوان الملف الشخصي فقط لو ما فيه أي عنوان مُختار إطلاقاً
            lat: (userLoc && userLoc.lat) ? userLoc.lat : ((currentUser && currentUser.lat) || 0),
            lng: (userLoc && userLoc.lng) ? userLoc.lng : ((currentUser && currentUser.lng) || 0),
            is_consultation: true,
            // [FEATURE-CONSULT-REDESIGN] وصف المشكلة + الصور + نوع الاستشارة — يقرأها الصيدلي
            // بدل نظام الدردشة القديم الملغى بالكامل
            problem_description: document.getElementById('consult-problem-desc') ? document.getElementById('consult-problem-desc').value.trim() : null,
            attached_images: _consultImages.length > 0 ? JSON.stringify(_consultImages) : null,
            consultation_type: _consultType
        };

        const { error } = await _supabase.from('sh_public_orders').insert([publicOrderData]);
        
        if(!error) {
            _resetConsultForm();
            currentOrderKey = orderId;
            localStorage.setItem('shahen_active_order_id', orderId);
            
            // إضافة الطلب للسجل المحلي لضمان ظهوره في قسم النشط
            let localOrderData = { id: orderId, customer_name: currentUser.name, phone: currentUser.phone, restaurant_name: ph.name, total: _totalFee, status: 'consulting', date: new Date().toLocaleString('ar-SA'), items: [{n: "استشارة طبية", p: _consultFee}], points_earned: 0, points_spent: 0, delivery_price: _deliveryFee, consultation_fee: _consultFee, consult_pay_by_points: _consultPayByPoints, restaurant_id: null, customer_id: currentUser.uid, verify_code: verificationCode, res_type: 'pharmacy', order_type: 'pharmacy' };
            let orders = getStorage('orders');
            orders.push(localOrderData);
            setStorage('orders', orders);

            // تعديل: استخدام شاشة تحميل الاستشارة المخصصة
            document.getElementById('consulting-status-text').innerText = "جاري طلب استشارة من " + ph.name + "... 🦅";
            document.getElementById('searching-sound').play();
            document.getElementById('eagle-consulting').style.display = 'flex';

            // [FEATURE-VOICE-REDESIGN] الاستشارة الصوتية: العميل ينتظر فقط (زي الكتابية بالضبط) —
            // الصيدلي هو من يبدأ الاتصال فور قبوله، والعميل ينضم تلقائياً بدون أي زر من طرفه
            if (_consultType === 'voice') {
                _listenForPharmacyCall(orderId);
            }

            // تشغيل الاستماع لتغيير الحالة
            listenConsultStatusOnly(orderId);
        } else {
            showNotify("خطأ في الاتصال بالخادم: " + error.message, "error");
        }
    }

    // ===== نظام المنيو الاحترافي بالأقسام =====
    let _currentMenuRes = null;
    let _currentMenuCatFilter = 'all';

    function openMenu(id) {
        // ابحث في data أولاً، ثم اجلب من DB مباشرة إن لم يوجد
        let res = data.find(r => r.id === id);
        // [PERF-FIX-1] لو الكائن المخزَّن هو نسخة القائمة الخفيفة فقط (بلا منيو)، نجلب النسخة الكاملة
        if(!res || res.restaurant_menu === undefined) { _fetchAndOpenMenu(id); return; }
        _doOpenMenu(res);
    }

    async function _fetchAndOpenMenu(id) {
        const { data: r } = await _supabase.from('restaurants_public').select('*').eq('id', id).single();
        if(r) {
            // [PERF-FIX-1] استبدال النسخة الخفيفة (إن وُجدت) بالنسخة الكاملة في الكاش لتجنّب إعادة الجلب لاحقاً بنفس الجلسة
            const idx = data.findIndex(x => x.id === r.id);
            if (idx > -1) data[idx] = r; else data.push(r);
            _doOpenMenu(r);
        }
    }

    function _doOpenMenu(res) {
        if(_resIsLocked(res)) return;
        _currentMenuRes = res;
        _currentMenuCatFilter = 'all';

        // تحديث رأس المطعم
        document.getElementById('menu-title').innerText = res.name || 'قائمة المنيو';
        document.getElementById('menu-sub-info').innerHTML = `
            <span>${window._deliveryPricingMode === 'distance' ? '🚗 سعر التوصيل يُحسَب حسب المسافة' : fmtSYP(res.delivery_fee||0,{inline:true,size:11}) + ' توصيل'}</span>
            ${res.open_time ? ' | ' + res.open_time + ' - ' + (res.close_time || '') : ''}
            ${res.maps_url ? ' | <a href="' + res.maps_url + '" target="_blank" style="color:#4285F4;text-decoration:none;"><i class="fas fa-map-marker-alt"></i> الموقع</a>' : ''}
        `;
        const logoEl = document.getElementById('menu-logo');
        if(res.logo) { logoEl.src = res.logo; logoEl.style.display = 'block'; logoEl.onerror = () => logoEl.style.display = 'none'; }
        else logoEl.style.display = 'none';

        // بناء المنيو
        _buildMenuUI(res);

        // ── زر التواصل ──
        // الشركاء (branch='شريك خارجي') + is_direct_contact=true: زر مفعّل
        // إذا is_direct_contact=false أو غير شريك: زر معطّل كلياً
        const contactBtn = document.getElementById('menu-contact-btn');
        if(contactBtn) {
            contactBtn.style.display = 'block';
            const isDirectContactEnabled = res.is_direct_contact === true;
            if(res.branch === 'شريك خارجي' && isDirectContactEnabled) {
                // ✅ مطعم شريك + التواصل المباشر مفعّل من الإدارة
                contactBtn.innerHTML = `
                    <div class="card" style="cursor:pointer;padding:14px;border:2px solid var(--gold);background:rgba(212,175,55,0.08);"
                         onclick="startStoreConsult('${escJsAttr(res.id)}','${escJsAttr(res.name||'')}','${escJsAttr(res.specialty_type||'other')}')">
                        <div style="text-align:center;">
                            <i class="fas fa-comments" style="color:var(--gold);font-size:26px;margin-bottom:8px;display:block;"></i>
                            <b style="font-size:14px;color:var(--gold);">التواصل مع ${res.name||'المطعم'}</b>
                            <p style="font-size:11px;color:#ddd;margin:5px 0 0;">تحدث مباشرة لتنسيق طلبك أو الاستفسار</p>
                        </div>
                    </div>`;
            } else if(res.branch === 'شريك خارجي' && !isDirectContactEnabled) {
                // ⛔ مطعم شريك لكن التواصل المباشر معطّل من الإدارة — زر معطّل بالكامل
                contactBtn.innerHTML = `
                    <div style="padding:12px;border:1px solid rgba(231,76,60,0.3);border-radius:14px;background:rgba(231,76,60,0.05);">
                        <div style="text-align:center;">
                            <i class="fas fa-lock" style="color:var(--danger);font-size:24px;margin-bottom:6px;display:block;"></i>
                            <b style="font-size:13px;color:var(--danger);">التواصل مع المطعم</b>
                            <p style="font-size:10px;color:#888;margin:4px 0 0;">
                                <i class="fas fa-ban" style="font-size:9px;"></i> 
                                غير مفعّل — قم بالطلب من المنيو
                            </p>
                        </div>
                    </div>`;
            } else {
                // ⛔ مطعم غير شريك — زر معطّل مع تنبيه عند الضغط
                contactBtn.innerHTML = `
                    <div style="padding:12px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.03);">
                        <div style="text-align:center;cursor:pointer;"
                             onclick="showNotify('يرجى الطلب من المنيو، المطعم غير نشط أو غير مفعل للتواصل المباشر حالياً.')">
                            <i class="fas fa-comments" style="color:#555;font-size:24px;margin-bottom:6px;display:block;"></i>
                            <b style="font-size:13px;color:#666;">التواصل مع المطعم</b>
                            <p style="font-size:10px;color:#555;margin:4px 0 0;">
                                <i class="fas fa-lock" style="font-size:9px;"></i> 
                                غير مفعّل — الطلب من المنيو فقط
                            </p>
                        </div>
                    </div>`;
            }
        }

        nav('p-menu');
    }

    function _buildMenuUI(res, filterCat) {
        const menuData = res.restaurant_menu || [];
        const catsBar  = document.getElementById('menu-cats-bar');
        const menuDiv  = document.getElementById('menu-items');
        menuDiv.innerHTML = '';

        const isNewFormat = menuData.some(m => m.type === 'cat');
        let cats  = [];
        let items = [];
        // [FIX-HIDE-CATEGORY] الأقسام المخفية بالكامل من قبل الإدارة/المطعم — لا تظهر إطلاقاً للعميل
        const _hiddenCats = res.hidden_categories || [];

        if(isNewFormat) {
            cats  = menuData.filter(m => m.type === 'cat' && !_hiddenCats.includes(m.name));
            const _hiddenCatIds = menuData.filter(m => m.type === 'cat' && _hiddenCats.includes(m.name)).map(m => m.id);
            items = menuData.filter(m => m.type === 'item' && m.available !== false && !_hiddenCatIds.includes(m.cid)); // [FIX-MENU-ITEM-VISIBILITY-TOGGLE] إخفاء الأصناف غير المتوفرة
        } else if(menuData.length > 0) {
            const groups = {};
            menuData.forEach(m => {
                const k = m.cat || 'القائمة';
                if (_hiddenCats.includes(k)) return; // [FIX-HIDE-CATEGORY] تجاهل القسم المخفي بالكامل
                if(!groups[k]) groups[k] = [];
                groups[k].push(m);
            });
            let idx = 0;
            Object.keys(groups).forEach(k => {
                const cid = 'legacy_' + idx++;
                cats.push({ id: cid, name: k, icon: '🍽️' });
                groups[k].forEach(m => { if (m.available !== false) items.push({ cid, n:m.n, p:m.p, img:m.img||'', desc:m.desc||'', extras:m.extras||'' }); }); // [FIX-MENU-ITEM-VISIBILITY-TOGGLE] إخفاء الأصناف غير المتوفرة عن العميل
            });
        }

        if(cats.length === 0 && items.length === 0) {
            catsBar.style.display = 'none';
            // إذا شريك خارجي بدون منيو — يعرض رسالة التواصل فقط
            if(res.branch === 'شريك خارجي') {
                menuDiv.innerHTML = `
                    <div style="text-align:center;padding:30px 20px;">
                        <i class="fas fa-comments" style="font-size:40px;color:var(--gold);display:block;margin-bottom:12px;"></i>
                        <b style="color:var(--gold);font-size:14px;display:block;margin-bottom:8px;">تواصل مع ${escHtml(res.name||'المحل')}</b>
                        <p style="font-size:12px;color:#aaa;">اضغط على زر التواصل أدناه لتنسيق طلبك مباشرة</p>
                    </div>`;
            } else {
                menuDiv.innerHTML = '<p style="text-align:center;color:#666;font-size:12px;padding:30px;">لا يوجد منيو متوفر حالياً</p>';
            }
            return;
        }

        // ── بناء شريط الأقسام ──
        catsBar.style.display = 'flex';
        catsBar.innerHTML = '';

        // حساب top شريط الأقسام بعد رأس المطعم
        requestAnimationFrame(() => {
            const header = document.getElementById('menu-header');
            if(header) {
                const hh = header.offsetHeight;
                catsBar.style.top = hh + 'px';
                // تحديث top الـ section-headers أيضاً
                const secTop = hh + catsBar.offsetHeight;
                document.querySelectorAll('.menu-section-header').forEach(el => {
                    el.style.top = secTop + 'px';
                });
            }
        });

        const allChip = document.createElement('div');
        allChip.className = 'menu-cat-chip' + (_currentMenuCatFilter === 'all' ? ' active' : '');
        allChip.innerHTML = '<span style="font-size:13px;">🔍</span> الكل';
        allChip.onclick = () => { _currentMenuCatFilter = 'all'; _applyMenuCatFilter(cats, items, 'all'); _setActiveChip(allChip); };
        catsBar.appendChild(allChip);

        cats.forEach(cat => {
            const chip = document.createElement('div');
            chip.className = 'menu-cat-chip' + (_currentMenuCatFilter === cat.id ? ' active' : '');
            chip.dataset.catid = cat.id;
            chip.innerHTML = `<span style="font-size:14px;">${escHtml(cat.icon||'📂')}</span> ${escHtml(cat.name)}`;
            chip.onclick = () => {
                _currentMenuCatFilter = cat.id;
                _applyMenuCatFilter(cats, items, cat.id);
                _setActiveChip(chip);
                // scroll للقسم
                setTimeout(() => {
                    const sec = document.getElementById('sec-' + cat.id);
                    if(sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            };
            catsBar.appendChild(chip);
        });

        _renderMenuSections(cats, items, filterCat || _currentMenuCatFilter, menuDiv);
    }

    function _setActiveChip(activeEl) {
        document.querySelectorAll('#menu-cats-bar .menu-cat-chip').forEach(c => c.classList.remove('active'));
        activeEl.classList.add('active');
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function _applyMenuCatFilter(cats, items, catFilter) {
        const menuDiv = document.getElementById('menu-items');
        _renderMenuSections(cats, items, catFilter, menuDiv);
        // إعادة حساب top بعد الرسم
        requestAnimationFrame(() => {
            const header  = document.getElementById('menu-header');
            const catsBar = document.getElementById('menu-cats-bar');
            if(header && catsBar) {
                const secTop = header.offsetHeight + catsBar.offsetHeight;
                document.querySelectorAll('.menu-section-header').forEach(el => {
                    el.style.top = secTop + 'px';
                });
            }
        });
    }

    function _renderMenuSections(cats, items, catFilter, container) {
        container.innerHTML = '';
        const filteredCats = catFilter === 'all' ? cats : cats.filter(c => c.id === catFilter);
        filteredCats.forEach(cat => {
            const catItems = items.filter(i => i.cid === cat.id);
            const block = document.createElement('div');
            block.className = 'menu-section-block';
            block.id = 'sec-' + cat.id;
            block.innerHTML = `
                <div class="menu-section-header">
                    <span class="sec-icon">${cat.icon||'📂'}</span>
                    <span class="sec-name">${cat.name}</span>
                    <span class="sec-count">${catItems.length} صنف</span>
                </div>
            `;
            if(catItems.length === 0) {
                block.innerHTML += '<div class="menu-empty-cat">لا توجد أصناف في هذا القسم حالياً</div>';
            } else {
                catItems.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'menu-item-card';
                    const imgHtml = item.img
                        ? `<img class="item-img" src="${escHtml(item.img)}" loading="lazy" onerror="this.onerror=null; this.src=''; this.className='item-img item-img-err'; this.alt='🍽️';">`  <!-- [SEC-FIX-C6] -->
                        : `<div class="item-img-placeholder">🍽️</div>`;
                    const extrasHtml = item.extras
                        ? `<div class="item-extras"><i class="fas fa-plus-circle"></i> ${escHtml(item.extras)}</div>`
                        : '';
                    // [FIX-MENU-QTY-STEPPER] معرّف فريد للصنف (اسم+سعر) لربط شريط الكمية بهذا العنصر
                    // تحديداً، حتى لو كان هناك أصناف بنفس الاسم من أقسام مختلفة
                    const _itemKey = (item.n + '|' + (item.p||0)).replace(/'/g, "\\'");
                    card.setAttribute('data-item-key', _itemKey);
                    // [SEC-FIX-MENU-XSS] escHtml على اسم/وصف الصنف قبل إدراجه في innerHTML، وعلى القيمة
                    // المستخدمة داخل سمات onclick — اسم الصنف يأتي من بيانات المطعم (بما فيها مطاعم شريكة
                    // خارجية) وكان يُدرج سابقاً بدون تعقيم، ما يفتح ثغرة XSS مخزّنة وكسر سمة onclick نفسها
                    card.innerHTML = `
                        ${imgHtml}
                        <div class="item-info">
                            <div class="item-name">${escHtml(item.n)}</div>
                            ${item.desc ? '<div class="item-desc">' + escHtml(item.desc) + '</div>' : ''}
                            ${extrasHtml}
                            <div class="item-price">${fmtSYP(item.p||0,{inline:true,size:12})}</div>
                        </div>
                        <div class="menu-qty-stepper" id="qty-stepper-${_itemKey.replace(/[^a-zA-Z0-9]/g,'_')}" style="display:flex; align-items:center; gap:6px;">
                            <button class="add-btn" style="display:none;" onclick="decrementMenuItemQty('${escJsAttr(_currentMenuRes?.id)}','${escJsAttr(item.n)}',${item.p || 0})">−</button>
                            <span class="menu-qty-count" style="display:none; min-width:16px; text-align:center; font-weight:bold; color:var(--gold); font-size:13px;">0</span>
                            <button class="add-btn" onclick="addToCart('${escJsAttr(_currentMenuRes?.id)}','${escJsAttr(item.n)}',${item.p || 0})">+</button>
                        </div>
                    `;
                    block.appendChild(card);
                });
            }
            container.appendChild(block);
        });
        // إذا لا يوجد شيء
        if(filteredCats.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#666; font-size:12px; padding:30px;">لا توجد أصناف</p>';
        }
        // [FIX-MENU-QTY-STEPPER] مزامنة أشرطة الكمية مع محتوى السلة الحالي فور بناء البطاقات
        _refreshMenuQtyBadges();
    }

    // ===== [FIX-SEARCH] البحث عن مطعم =====
    function searchRes() {
        const q = (document.getElementById('resSearch')?.value || '').trim().toLowerCase();
        const listDiv = document.getElementById('res-list');
        if (!listDiv) return;
        if (!q) {
            if (_cache.res && _cache.res.length > 0) { _renderResFromData(_cache.res); return; }
            if (data && data.length > 0) { _renderResFromData(data); return; }
            return;
        }
        const src = (_cache.res && _cache.res.length > 0) ? _cache.res : (data || []);
        const filtered = src.filter(r => (r.name || '').toLowerCase().includes(q));
        if (filtered.length === 0) {
            // [SEC-PATCH-8] escHtml applied to search query to prevent XSS
            listDiv.innerHTML = "<p style='text-align:center;font-size:12px;color:#888;padding:20px;'>لا توجد نتائج للبحث عن \"" + escHtml(q) + "\"</p>";
        } else {
            _renderResFromData(filtered);
        }
    }
    // ===== نهاية [FIX-SEARCH] =====

    function searchMenu() {
        const q = (document.getElementById('menuSearch')?.value || '').trim().toLowerCase();
        if(!_currentMenuRes) return;
        const menuData = _currentMenuRes.restaurant_menu || [];
        const isNewFormat = menuData.some(m => m.type === 'cat');
        let cats = [], items = [];
        // [FIX-HIDE-CATEGORY] الأقسام المخفية بالكامل من قبل الإدارة/المطعم — لا تظهر إطلاقاً للعميل
        const _hiddenCats2 = _currentMenuRes.hidden_categories || [];
        if(isNewFormat) {
            cats  = menuData.filter(m => m.type === 'cat' && !_hiddenCats2.includes(m.name));
            const _hiddenCatIds2 = menuData.filter(m => m.type === 'cat' && _hiddenCats2.includes(m.name)).map(m => m.id);
            items = menuData.filter(m => m.type === 'item' && m.available !== false && !_hiddenCatIds2.includes(m.cid)); // [FIX-MENU-ITEM-VISIBILITY-TOGGLE] إخفاء الأصناف غير المتوفرة
        } else {
            const groups = {};
            menuData.forEach(m => {
                const k = m.cat || 'القائمة';
                if (_hiddenCats2.includes(k)) return; // [FIX-HIDE-CATEGORY] تجاهل القسم المخفي بالكامل
                if(!groups[k]) groups[k] = [];
                groups[k].push(m);
            });
            let idx = 0;
            Object.keys(groups).forEach(k => {
                const cid = 'legacy_' + idx++;
                cats.push({ id: cid, name: k, icon: '🍽️' });
                groups[k].forEach(m => { if (m.available !== false) items.push({ cid, n: m.n, p: m.p, img: m.img||'', desc: m.desc||'', extras: m.extras||'' }); }); // [FIX-MENU-ITEM-VISIBILITY-TOGGLE] إخفاء الأصناف غير المتوفرة عن العميل
            });
        }
        if(!q) { _renderMenuSections(cats, items, _currentMenuCatFilter, document.getElementById('menu-items')); return; }
        // فلترة البحث
        const filteredItems = items.filter(i => i.n.toLowerCase().includes(q) || (i.desc||'').toLowerCase().includes(q));
        const usedCatIds = new Set(filteredItems.map(i => i.cid));
        const filteredCats = cats.filter(c => usedCatIds.has(c.id) || c.name.toLowerCase().includes(q));
        _renderMenuSections(filteredCats, filteredItems, 'all', document.getElementById('menu-items'));
    }
    // ===== نهاية نظام المنيو الاحترافي =====

    // ===== نظام التواصل مع المحل (مطابق لنظام الصيدلية) =====
    let _customOrderResId = null;
    let _customOrderResName = null;
    let _customOrderResType = null;

    // فتح نافذة تأكيد التواصل - مثل orderFromPharmacy تماماً
    function startStoreConsult(resId, resName, resType) {
        _customOrderResId = resId;
        _customOrderResName = resName;
        _customOrderResType = resType || 'specialty';
        // [FIX-SEC-2b] console.log محذوف في الإنتاج
        // ===== تحقق إضافي: هل التواصل المباشر مفعّل من الإدارة؟ =====
        const resObj = _currentMenuRes || (typeof data !== 'undefined' ? data.find(r => String(r.id) === String(resId)) : null);
        if (resObj && resObj.is_direct_contact !== true) {
            showNotify('التواصل المباشر غير مفعّل لهذا المطعم حالياً', 'error');
            return;
        }
        // ===== نهاية التحقق =====
        const modal = document.getElementById('custom-order-modal');
        if (!modal) return;
        document.getElementById('custom-order-store-name').innerText = resName;
        modal.style.display = 'flex';
    }

    // للتوافق مع الكود القديم
    function openCustomOrderModal(resId, resName) {
        startStoreConsult(resId, resName, 'specialty');
    }
    // ===== متغيرات دردشة الطلب المخصص =====
    let _spChatOrderId = null;
    let _spChatChannel = null;
    let _spMsgIds = new Set();
    let _spPollInterval = null;
    let _spAgreedAmount = 0;

    // submitStoreConsult - مطابق تماماً لـ submitMedicalConsult في نظام الصيدلية
    let _storeConsultPending = false; // [FIX-C4]
    async function submitStoreConsult() {
        if (_storeConsultPending) return;
        _storeConsultPending = true;
        const _scBtn = document.querySelector('[onclick="submitStoreConsult()"]');
        if (_scBtn) { _scBtn.disabled = true; _scBtn.innerText = 'جاري الإرسال...'; }
        try { await _submitStoreConsult_inner(); } finally {
            _storeConsultPending = false;
            if (_scBtn) { _scBtn.disabled = false; _scBtn.innerText = 'بدء التواصل 🦅'; }
        }
    }
    async function _submitStoreConsult_inner() {
        if (!currentUser) return showNotify('يرجى تسجيل الدخول أولاً', 'error');
        if (!_customOrderResName) return showNotify('خطأ: لم يتم تحديد المتجر', 'error');
        // [SEC-FIX-ADDRESS-REQUIRED-ALL-PATHS] استشارة المتجر التخصصي تنتهي بتوصيل — تتطلب عنواناً
        if (!(await _verifyCustomerAddressLive(true))) return;

        document.getElementById('custom-order-modal').style.display = 'none';

        const orderId = generateUniqueId();
        verificationCode = Math.floor(1000 + Math.random() * 9000);

        // بيانات الطلب - مطابق لـ submitMedicalConsult
        const storeOrderData = {
            id: orderId,
            customer_name: currentUser.name || 'عميل شاهين',
            phone: currentUser.phone || '000',
            restaurant_name: _customOrderResName,
            restaurant_id: String(_customOrderResId),
            customer_address: currentUser.address || 'غير محدد',
            total: 0,
            status: 'consulting',
            items: JSON.stringify([{n: 'التواصل مع المحل', p: 0}]),
            customer_id: currentUser.uid,
            delivery_price: 0,
            verify_code: verificationCode,
            res_type: 'specialty',
            specialty_type: _customOrderResType || 'other',
            created_at: new Date().toISOString(),
            // [BUGFIX-ADDRESS-PRIORITY] كان يفضّل عنوان الملف الشخصي الافتراضي دائماً بدل العنوان
            // اللي اختاره العميل فعلياً لهذا الطلب تحديداً — الأولوية الآن لـuserLoc (يعكس آخر اختيار
            // فعلي)، والعودة لعنوان الملف الشخصي فقط لو ما فيه أي عنوان مُختار إطلاقاً
            lat: (userLoc && userLoc.lat) ? userLoc.lat : ((currentUser && currentUser.lat) || 0),
            lng: (userLoc && userLoc.lng) ? userLoc.lng : ((currentUser && currentUser.lng) || 0),
            is_consultation: true
        };

        // [FIX-SEC-2] تم إزالة console.log في بيئة الإنتاج
        const { error } = await _supabase.from('sh_public_orders').insert([storeOrderData]);
        // [FIX-SEC-2] تم إزالة console.error في بيئة الإنتاج

        if (!error) {
            // حفظ محلي - نفس نظام الصيدلية
            let orders = getStorage('orders');
            orders.push({
                ...storeOrderData,
                date: new Date().toLocaleString('ar-SA'),
                items: [{n: 'التواصل مع المحل', p: 0}],
                points_earned: 0,
                points_spent: 0,
                order_type: 'specialty'
            });
            setStorage('orders', orders);
            currentOrderKey = String(orderId);
            localStorage.setItem('shahen_active_order_id', String(orderId));

            // عرض شاشة الانتظار - نفس الصيدلية تماماً
            document.getElementById('consulting-status-text').innerText = 'جاري التواصل مع ' + _customOrderResName + '... 🦅';
            document.getElementById('searching-sound').play();
            document.getElementById('eagle-consulting').style.display = 'flex';

            // الاستماع لتغيير الحالة - نفس listenConsultStatusOnly للصيدلية
            listenConsultStatusOnly(String(orderId));
            showNotify('تم إرسال طلبك لـ ' + _customOrderResName + ' 🦅');
        } else {
            showNotify('فشل الإرسال: ' + error.message, 'error');
        }
    }

    // للتوافق مع الكود القديم
    async function submitCustomOrder() {
        await submitStoreConsult();
    }

    // ===== فتح شاشة الدردشة البنفسجية =====
    async function openSpecialtyChat(orderId, storeName, firstMsg) {
        _spChatOrderId = orderId;
        _spMsgIds.clear();
        _spAgreedAmount = 0;
        document.getElementById('sp-chat-store-name').innerText = '🛍️ ' + storeName;
        document.getElementById('sp-chat-order-ref').innerText = 'طلب #' + String(orderId).slice(-8);
        document.getElementById('sp-chat-flow').innerHTML = '';
        document.getElementById('sp-dispatch-area').style.display = 'none';
        document.getElementById('sp-chat-status-bar').innerText = 'جاري التواصل مع المتجر...';
        document.getElementById('sp-chat-status-dot').style.background = '#f39c12';
        document.getElementById('specialty-chat-screen').style.display = 'flex';

        // جلب الرسائل القديمة
        let { data: oldMsgs } = await _supabase.from('sh_messages')
            .select('*').eq('order_id', orderId).order('created_at', { ascending: true });
        oldMsgs = _stripStatusMsgs(oldMsgs);

        if (oldMsgs && oldMsgs.length > 0) {
            oldMsgs.forEach(m => {
                _spMsgIds.add(m.id);
                _appendSpMsg(m.message, m.sender === 'client' ? 'out' : 'in', m.created_at);
                _spCheckForAmount(m.message);
            });
        } else if (firstMsg) {
            // إضافة رسالة العميل الأولى في الواجهة فوراً
            _appendSpMsg(firstMsg, 'out', new Date().toISOString());
            // حفظها في قاعدة البيانات
            const { data: saved } = await _supabase.from('sh_messages').insert({
                order_id: orderId, sender: 'client', message: firstMsg
            }).select().single();
            if (saved) _spMsgIds.add(saved.id);
        }
        _spScrollBottom();

        // Realtime listener
        if (_spChatChannel) _supabase.removeChannel(_spChatChannel);
        _spChatChannel = _supabase.channel('sp_chat_client_' + orderId)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sh_messages' }, payload => {
                const m = payload.new;
                if (String(m.order_id) !== String(orderId)) return;
                if (_spMsgIds.has(m.id)) return;
                _spMsgIds.add(m.id);
                if (m.sender !== 'client') {
                    _appendSpMsg(m.message, 'in', m.created_at);
                    _spCheckForAmount(m.message);
                    _spScrollBottom();
                    showNotify('رسالة جديدة من المتجر 💜', 'info');
                    document.getElementById('sp-chat-status-dot').style.background = '#2ecc71';
                    document.getElementById('sp-chat-status-bar').innerText = '✅ المتجر رد على طلبك';

                }
            }).subscribe((status, err) => {
                // [FIX-CHAT-3a] إعادة الاتصال عند انقطاع قناة الدردشة
                if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                    if (_spChatOrderId) {
                        setTimeout(() => {
                            if (_spChatChannel) { try { _supabase.removeChannel(_spChatChannel); } catch(e){} _spChatChannel = null; }
                            openSpecialtyChat(_spChatOrderId, document.getElementById('sp-chat-title') ? document.getElementById('sp-chat-title').innerText : '', '');
                        }, 3000);
                    }
                }
            });

        // Polling احتياطي كل 3 ثواني
        if (_spPollInterval) clearInterval(_spPollInterval);
        _spPollInterval = setInterval(async () => {
            // [FIX-ORDER-MIX] نفس الإصلاح لدردشة المحلات التخصصية
            if (!_spChatOrderId || String(_spChatOrderId) !== String(orderId)) { clearInterval(_spPollInterval); return; }
            const { data: newMsgsRaw } = await _supabase.from('sh_messages')
                .select('*').eq('order_id', orderId).order('created_at', { ascending: true });
            const newMsgs = _stripStatusMsgs(newMsgsRaw);
            if (newMsgs) {
                let hasNew = false;
                let _autoInvoiceDetected = false;
                newMsgs.forEach(m => {
                    if (_spMsgIds.has(m.id)) return;
                    _spMsgIds.add(m.id);
                    if (m.sender !== 'client') {
                        _appendSpMsg(m.message, 'in', m.created_at);
                        _spCheckForAmount(m.message);
                        hasNew = true;
                        // كشف رسالة الفاتورة لإرسال الطلب تلقائياً
                        if (m.message && (
                            m.message.includes('فاتورة') || m.message.includes('الاجمالي') ||
                            m.message.includes('الإجمالي') || m.message.includes('💰') ||
                            m.message.includes('🧾') || m.message.includes('STORE_TOTAL')
                        )) { _autoInvoiceDetected = true; } // للمستقبل فقط - التحويل يدوي
                    }
                });
                if (hasNew) {
                    _spScrollBottom();
                    showNotify('رسالة جديدة من المتجر 💜', 'info');
                }

            }
            // فحص حالة الطلب
            const { data: ord } = await _supabase.from('sh_public_orders')
                .select('status, driver_name').eq('id', orderId).single();
            if (ord) {
                if (ord.status === 'accepted' && ord.driver_name) {
                    document.getElementById('sp-chat-status-bar').innerText = '🦅 الصقر في الطريق: ' + ord.driver_name;
                    document.getElementById('sp-dispatch-area').style.display = 'none';
                } else if (ord.status === 'searching') {
                    // العميل أرسل الطلب للمناديب يدوياً — نحدّث النص فقط
                    document.getElementById('sp-chat-status-bar').innerText = '🔍 جاري البحث عن صقر...';
                } else if (ord.status === 'cancelled') {
                    document.getElementById('sp-chat-status-bar').innerText = '❌ تم إلغاء الطلب';
                    clearInterval(_spPollInterval);
                }
            }
        }, 4000); // [FIX-POLL-4a] تقليل polling من 8 لـ 4 ثواني لاستجابة أسرع

        // الاستماع لتغيير حالة الطلب
        listenConsultStatusOnly(orderId);
    }

    // إرسال رسالة من العميل
    let _spMsgPending = false; // [FIX-C6]
    async function sendSpecialtyMsg() {
        const inp = document.getElementById('sp-chat-input');
        const text = inp.value.trim();
        if (!text || !_spChatOrderId || _spMsgPending) return;
        // [SEC-FIX-RATELIMIT] منع إرسال رسائل متتالية بسرعة
        const _now = Date.now();
        if (_now - _lastMsgTime < _MSG_MIN_INTERVAL_MS) return;
        _lastMsgTime = _now;
        // [SEC-FIX-INPUT] تحديد الحد الأقصى لطول الرسالة
        if (text.length > 1000) return showNotify('الرسالة طويلة جداً (الحد 1000 حرف)', 'error');
        _spMsgPending = true;
        inp.value = '';
        _appendSpMsg(text, 'out', new Date().toISOString());
        _spScrollBottom();
        try {
            const { data: saved } = await _supabase.from('sh_messages').insert({
                order_id: _spChatOrderId, sender: 'client', message: text
            }).select().single();
            if (saved) _spMsgIds.add(saved.id);
        } catch(e) {
            showNotify("فشل إرسال الرسالة، تحقق من الاتصال ❌", "error");
        } finally {
            _spMsgPending = false; // [FIX-AUDIT-3] ضمان فتح القفل دائماً حتى عند خطأ شبكة غير متوقع
        }
    }

    // إضافة رسالة للواجهة
    function _appendSpMsg(text, dir, time) {
        // [FIX-HIDE-STATUS-MSG-SP] نفس الإصلاح المطبَّق على الدردشة الرئيسية — رسائل حالة الطلب
        // (🔖STATUS🔖) لا يجب أن تظهر كفقاعة دردشة هنا أيضاً، فهذا نظام دردشة منفصل تماماً لم يكن يطبّق الفلتر
        if (text && text.includes(_STATUS_TAG)) {
            _appendStatusTimeline(text.split(_STATUS_TAG).join('').trim());
            return;
        }
        const flow = document.getElementById('sp-chat-flow');
        const timeStr = time ? new Date(time).toLocaleTimeString('ar-SA', {hour:'2-digit', minute:'2-digit'}) : '';
        const wrap = document.createElement('div');
        wrap.className = 'sp-msg-wrap ' + dir;
        // [FIX-XSS-SP] استخدام DOM آمن بدلاً من innerHTML
        const msgDiv = document.createElement('div');
        msgDiv.className = 'sp-msg ' + dir;
        msgDiv.textContent = text;
        const timeDiv = document.createElement('div');
        timeDiv.className = 'sp-msg-time';
        timeDiv.textContent = timeStr;
        wrap.appendChild(msgDiv);
        wrap.appendChild(timeDiv);
        flow.appendChild(wrap);
    }

    function _spScrollBottom() {
        const f = document.getElementById('sp-chat-flow');
        if (f) f.scrollTop = f.scrollHeight;
    }

    // استخراج المبلغ من رسائل المتجر تلقائياً
    function _spCheckForAmount(text) {
        if (!text) return;
        const patterns = [
            /(?:المبلغ|الإجمالي|الاجمالي|إجمالي|اجمالي|السعر|التكلفة|المجموع|الفاتورة)[:\s]*([0-9][0-9,\.]*)/i,
            /([0-9][0-9,\.]*)[\s]*(?:ل\.س|ليرة|lira)/i,
            /([0-9]{4,})/
        ];
        for (const p of patterns) {
            const m = text.match(p);
            if (m) {
                const val = parseFloat(String(m[1]).replace(/,/g,''));
                if (!isNaN(val) && val > 100) {
                    _spAgreedAmount = val;
                    document.getElementById('sp-agreed-amount').innerText = val.toLocaleString() + ' ل.س';
                    document.getElementById('sp-dispatch-area').style.display = 'block';
                    // إخفاء تنبيه الانتظار الأحمر عند وصول الفاتورة
                    const _waitingNotice = document.getElementById('sp-waiting-invoice-notice');
                    if (_waitingNotice) _waitingNotice.style.display = 'none';
                    return;
                }
            }
        }
        // إذا لم يُعثر على مبلغ بعد، نُظهر منطقة الإرسال مع تنبيه الانتظار الأحمر
        const _dispatchArea = document.getElementById('sp-dispatch-area');
        const _waitingNotice = document.getElementById('sp-waiting-invoice-notice');
        if (_dispatchArea && _dispatchArea.style.display !== 'block') {
            _dispatchArea.style.display = 'block';
            if (_waitingNotice) _waitingNotice.style.display = 'block';
        }
    }

    // إرسال الطلب للمناديب بعد التنسيق - يدوياً من العميل فقط
    async function upgradeSpecialtyToDelivery() {
        if (_spAgreedAmount <= 0) return showNotify('انتظر حتى يرسل المتجر الفاتورة 🛍️', 'error');
        showNotify('جاري إرسال الطلب للمناديب... 🦅');

        // جلب بيانات الطلب الكاملة للمندوب
        const { data: _spOrderData } = await _supabase.from('sh_public_orders').select('*').eq('id', _spChatOrderId).single();
        const _spDeliveryPrice = _spOrderData ? (_spOrderData.delivery_price || 0) : 0;
        const _spGrandTotal = _spAgreedAmount + _spDeliveryPrice;
        const _spCustomerName = _spOrderData ? (_spOrderData.customer_name || 'العميل') : 'العميل';
        const _spCustomerAddress = _spOrderData ? (_spOrderData.customer_address || '') : '';
        const _spStoreName = _spOrderData ? (_spOrderData.restaurant_name || 'المتجر') : 'المتجر';
        const _spVerifyCode = _spOrderData ? (_spOrderData.verify_code || verificationCode || 0) : verificationCode || 0;

        // بناء نص الفاتورة للمندوب
        const _spInvoiceForDriver = '🛍️ فاتورة متجر - ' + _spStoreName + '\n' +
            '────────────────────\n' +
            '💰 قيمة الطلب: ' + _spAgreedAmount.toLocaleString() + ' ل.س\n' +
            '🛵 سعر التوصيل: ' + _spDeliveryPrice.toLocaleString() + ' ل.س\n' +
            '────────────────────\n' +
            '💰 المبلغ المقبوض النهائي: ' + _spGrandTotal.toLocaleString() + ' ل.س\n' +
            '🔑 كود التحقق: ' + _spVerifyCode + '\n' +
            '👤 العميل: ' + _spCustomerName + '\n' +
            '📍 العنوان: ' + _spCustomerAddress;

        await _supabase.from('sh_messages').insert({
            order_id: _spChatOrderId, sender: 'client',
            message: '✅ تم الاتفاق! جاري إرسال طلبنا للمندوب 🦅'
        });

        const { error: _spErr } = await _supabase.from('sh_public_orders').update({
            status: 'searching',
            is_consultation: false,
            total: _spGrandTotal,
            delivery_price: _spDeliveryPrice,
            res_type: 'specialty',
            restaurant_note: _spInvoiceForDriver,
            order_details: 'STORE_TOTAL:' + _spAgreedAmount + '\n' + _spInvoiceForDriver
        }).eq('id', _spChatOrderId);

        if (_spErr) { showNotify('فشل إرسال الطلب: ' + _spErr.message, 'error'); return; }

        // تحديث السجل المحلي
        let _spOrders = getStorage('orders');
        _spOrders = _spOrders.map(o => String(o.id) === String(_spChatOrderId) ? {
            ...o,
            status: 'searching',
            is_consultation: false,
            total: _spGrandTotal,
            delivery_price: _spDeliveryPrice,
            res_type: 'specialty',
            order_type: 'specialty',
            restaurant_note: _spInvoiceForDriver
        } : o);
        setStorage('orders', _spOrders);

        // ربط الطلب بـ currentOrderKey وتشغيل شاشة البحث
        currentOrderKey = String(_spChatOrderId);
        localStorage.setItem('shahen_active_order_id', String(_spChatOrderId));
        if (_spVerifyCode) { verificationCode = _spVerifyCode; }

        // إغلاق شاشة الدردشة وفتح شاشة البحث عن مندوب
        if (_spChatChannel) { _supabase.removeChannel(_spChatChannel); _spChatChannel = null; }
        if (_spPollInterval) { clearInterval(_spPollInterval); _spPollInterval = null; }
        document.getElementById('specialty-chat-screen').style.display = 'none';
        _spChatOrderId = null;
        _spMsgIds.clear();

        // عرض كود التحقق وتشغيل شاشة البحث
        document.getElementById('reveal-order-code').innerText = verificationCode || '----';
        document.getElementById('client-reveal-code').innerText = verificationCode || '----';
        document.getElementById('searching-text').innerText = 'جاري البحث عن صقر لاستلام طلبك... 🦅';
        startSearching();
    }

    // إغلاق شاشة الدردشة
    function closeSpecialtyChat() {
        if (_spChatChannel) { _supabase.removeChannel(_spChatChannel); _spChatChannel = null; }
        if (_spPollInterval) { clearInterval(_spPollInterval); _spPollInterval = null; }
        document.getElementById('specialty-chat-screen').style.display = 'none';
        _spChatOrderId = null;
        _spMsgIds.clear();
    }

    // ===== [SWITCH-RES-DIALOG] متغيرات مؤقتة للمنتج المعلّق ===== 
    var _pendingSwitchRid = null;
    var _pendingSwitchN = null;
    var _pendingSwitchP = null;
    var _pendingSwitchImg = null;

    function addToCart(rid, n, p, img) {
        if(currentResId && currentResId !== rid) {
            // [SWITCH-RES-DIALOG] بدلاً من منع الإضافة، نعرض Dialog احترافي
            _pendingSwitchRid = rid;
            _pendingSwitchN = n;
            _pendingSwitchP = p;
            _pendingSwitchImg = img;
            var dlg = document.getElementById('switch-res-dialog');
            if(dlg) dlg.classList.add('show');
            return;
        }
        currentResId = rid;
        // [FIX-CART-QUANTITY] كان كل ضغط على "أضف" يُنشئ عنصراً منفصلاً بنفس الاسم بدل زيادة الكمية —
        // الآن نبحث أولاً عن نفس الصنف (نفس الاسم والسعر) في السلة، ونزيد كميته إن وُجد، بدل التكرار
        const _existingItem = cart.find(it => it.n === n && it.p === p);
        if (_existingItem) {
            _existingItem.qty = (_existingItem.qty || 1) + 1;
        } else {
            cart.push({n, p, qty: 1});
        }
        document.getElementById('badge').innerText = cart.reduce((sum, it) => sum + (it.qty || 1), 0);
        document.getElementById('badge').style.display = 'block';
        showNotify("تمت الإضافة للسلة ✅");
        _refreshMenuQtyBadges();
    }

    // [FIX-MENU-QTY-STEPPER] زر "−" على بطاقة الصنف بالمنيو — ينقص الكمية مباشرة دون فتح السلة
    function decrementMenuItemQty(rid, n, p) {
        const idx = cart.findIndex(it => it.n === n && it.p === p);
        if (idx === -1) return;
        if ((cart[idx].qty || 1) > 1) {
            cart[idx].qty -= 1;
        } else {
            cart.splice(idx, 1);
        }
        if (cart.length === 0) currentResId = null;
        document.getElementById('badge').innerText = cart.reduce((sum, it) => sum + (it.qty || 1), 0);
        _refreshMenuQtyBadges();
    }

    // [FIX-MENU-QTY-STEPPER] يُزامن كل أشرطة الكمية بالمنيو مع محتوى السلة الفعلي — يُستدعى بعد أي
    // تغيير على السلة، وأيضاً عند فتح صفحة المنيو نفسها (لو كان العميل قد أضاف أصنافاً سابقاً)
    function _refreshMenuQtyBadges() {
        document.querySelectorAll('.menu-item-card[data-item-key]').forEach(card => {
            const key = card.getAttribute('data-item-key');
            const stepper = card.querySelector('.menu-qty-stepper');
            if (!stepper) return;
            const minusBtn = stepper.querySelector('.add-btn');
            const countEl = stepper.querySelector('.menu-qty-count');
            const [n, pStr] = key.split('|');
            const p = parseFloat(pStr);
            const item = cart.find(it => it.n === n && it.p === p);
            const qty = item ? (item.qty || 1) : 0;
            if (countEl) { countEl.innerText = qty; countEl.style.display = qty > 0 ? 'inline' : 'none'; }
            if (minusBtn) minusBtn.style.display = qty > 0 ? 'inline-flex' : 'none';
        });
    }

    // [SWITCH-RES-DIALOG] تأكيد إفراغ السلة والانتقال للمطعم الجديد
    function _confirmSwitchRes() {
        var dlg = document.getElementById('switch-res-dialog');
        if(dlg) dlg.classList.remove('show');
        // إفراغ السلة الحالية تماماً
        cart = [];
        currentResId = null;
        discountAmount = 0;
        appliedCoupon = '';
        pointsDiscountUsed = 0;
        // إضافة المنتج الجديد مباشرة
        if(_pendingSwitchRid !== null) {
            currentResId = _pendingSwitchRid;
            cart.push({n: _pendingSwitchN, p: _pendingSwitchP, qty: 1});
            document.getElementById('badge').innerText = cart.reduce((sum, it) => sum + (it.qty || 1), 0);
            document.getElementById('badge').style.display = 'block';
            showNotify("تمت الإضافة للسلة ✅");
        }
        // مسح المتغيرات المؤقتة
        _pendingSwitchRid = null;
        _pendingSwitchN = null;
        _pendingSwitchP = null;
        _pendingSwitchImg = null;
    }

    // [SWITCH-RES-DIALOG] إلغاء التبديل والبقاء على المطعم الحالي
    function _cancelSwitchRes() {
        var dlg = document.getElementById('switch-res-dialog');
        if(dlg) dlg.classList.remove('show');
        // مسح المتغيرات المؤقتة بدون أي تغيير
        _pendingSwitchRid = null;
        _pendingSwitchN = null;
        _pendingSwitchP = null;
        _pendingSwitchImg = null;
    }
    // ===== نهاية [SWITCH-RES-DIALOG] =====

    function removeFromCart(index) {
        // [FIX-CART-QUANTITY] إنقاص الكمية بمقدار واحد فقط بدل حذف السطر كاملاً دفعة واحدة — إن وصلت
        // الكمية للصفر، يُحذَف السطر بالكامل عندها فقط
        if (cart[index] && (cart[index].qty || 1) > 1) {
            cart[index].qty -= 1;
        } else {
            cart.splice(index, 1);
        }
        if(cart.length === 0) currentResId = null;
        document.getElementById('badge').innerText = cart.reduce((sum, it) => sum + (it.qty || 1), 0);
        renderCart();
    }

    // [FIX-DISTANCE-PRICING] نظام حساب أجرة التوصيل حسب المسافة — بديل اختياري للسعر الثابت، تتحكم
    // به الإدارة من لوحتها. نُخزِّن الإعدادات في متغيّرات عامة تُحدَّث دورياً بالخلفية، حتى تبقى دالة
    // حساب السعر نفسها متزامنة (Synchronous) وسريعة الاستخدام داخل renderCart() المتكرر الاستدعاء،
    // بدل انتظار استعلام شبكة في كل مرة يتغيّر فيها محتوى السلة.
    window._deliveryPricingMode = 'fixed'; // 'fixed' | 'distance'
    window._deliveryPricePerKm = 0;

    async function _refreshDeliveryPricingSettings() {
        try {
            const { data } = await _supabase.from('delivery_pricing_settings').select('mode, price_per_km').eq('id', 1).maybeSingle();
            if (data) {
                window._deliveryPricingMode = data.mode || 'fixed';
                window._deliveryPricePerKm = parseFloat(data.price_per_km) || 0;
            }
        } catch(e) { /* الجدول قد لا يكون موجوداً بعد قبل تشغيل SQL — النظام يستمر بالسعر الثابت افتراضياً */ }
    }
    // تحميل أولي فور بدء التطبيق، وتحديث دوري كل دقيقتين لالتقاط أي تغيير من الإدارة أثناء تصفّح العميل
    _refreshDeliveryPricingSettings();
    setInterval(_refreshDeliveryPricingSettings, 120000);

    // [FIX-DISTANCE-PRICING] حساب المسافة بخط مستقيم بين نقطتين — نستخدم إحداثيات المطعم والعميل
    // الموجودة أصلاً في قاعدة البيانات دون أي طلب بيانات إضافية أو نظام خرائط جديد
    function _calcDistanceKm(lat1, lng1, lat2, lng2) {
        if (!lat1 || !lng1 || !lat2 || !lng2) return null;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    // [FIX-DISTANCE-PRICING] الدالة الموحَّدة الوحيدة لحساب أجرة التوصيل — تُستخدَم في معاينة السلة
    // وفي إنشاء الطلب الفعلي معاً، لضمان أن الرقم الظاهر للعميل قبل الطلب هو نفسه المحفوظ مع الطلب
    function _computeDeliveryFeeForRes(res) {
        if (!res) return 0;
        if (window._deliveryPricingMode === 'distance' && window._deliveryPricePerKm > 0) {
            const resLat = parseFloat(res.pickup_lat), resLng = parseFloat(res.pickup_lng);
            const custLat = parseFloat(currentUser && currentUser.lat) || (userLoc && userLoc.lat);
            const custLng = parseFloat(currentUser && currentUser.lng) || (userLoc && userLoc.lng);
            // [SEC-FIX-DELIVERY-FEE-SANITY] تحقق صريح من صحة كل الإحداثيات قبل الحساب — كانت
            // إحداثيات ناقصة (NaN) تمرّ بصمت لدالة المسافة وتُنتج نتيجة غير صالحة تتسرّب لرسوم
            // توصيل خاطئة تماماً (رقم كبير غير منطقي)، وهذا على الأغلب ما كان يمنع إرسال الطلب
            // فعلياً (رقم غير صالح يُرفَض عند محاولة حفظه بقاعدة البيانات)
            const _coordsValid = [resLat, resLng, custLat, custLng].every(v => typeof v === 'number' && isFinite(v));
            if (_coordsValid) {
                const distKm = _calcDistanceKm(resLat, resLng, custLat, custLng);
                if (distKm !== null && isFinite(distKm) && distKm >= 0) {
                    const _calculatedFee = Math.round(distKm * window._deliveryPricePerKm);
                    // سقف أمان: أي رسوم توصيل محسوبة تتجاوز 50,000 ل.س تعتبر غير منطقية (خطأ بيانات
                    // مسافة أو سعر الكيلومتر)، نتراجع للسعر الثابت بدل تمرير رقم كارثي للعميل
                    const _DELIVERY_FEE_SANITY_CAP = 50000;
                    if (isFinite(_calculatedFee) && _calculatedFee >= 0 && _calculatedFee <= _DELIVERY_FEE_SANITY_CAP) {
                        return _calculatedFee;
                    }
                    console.warn('[SEC-FIX-DELIVERY-FEE-SANITY] رسوم محسوبة غير منطقية (' + _calculatedFee + ')، التراجع للسعر الثابت');
                }
            } else {
                console.warn('[FIX-DISTANCE-PRICING] تعذّر حساب المسافة — إحداثيات ناقصة، التراجع للسعر الثابت');
            }
        }
        return res.delivery_fee || 0;
    }

    function renderCart() {
        // [FEATURE-CART-PERSIST] حفظ السلة تلقائياً بالتخزين الدائم كل ما تتغيّر — أساس تذكير السلة المنسية
        try {
            if (cart.length > 0) {
                localStorage.setItem('shahen_saved_cart', JSON.stringify({ cart, resId: currentResId, savedAt: Date.now() }));
            } else {
                localStorage.removeItem('shahen_saved_cart');
            }
        } catch(e) {}
        const cont = document.getElementById('cart-content');
        const sum = document.getElementById('cart-summary');
        const cartHeader = document.getElementById('cart-res-header');
        const resNameDisplay = document.getElementById('cart-res-name');
        if(cart.length === 0) { 
            cont.innerHTML = "<p style='text-align:center; font-size: 12px;'>سلتك فارغة</p>"; 
            sum.style.display='none'; 
            if(cartHeader) cartHeader.style.display = 'none';
            return; 
        }
        const res = data.find(r => r.id === currentResId);
        if(res && cartHeader) { cartHeader.style.display = 'block'; resNameDisplay.innerText = res.name; }
        const sub = cart.reduce((s,i) => s + (i.p * (i.qty || 1)), 0); // [FIX-CART-QUANTITY] ضرب السعر بالكمية
        // [FIX-PICKUP-FIX] سعر التوصيل صفر عند اختيار الاستلام من المطعم، وإلا يُحسَب حسب النظام الفعّال (ثابت أو مسافة)
        const deliveryPrice = (_serviceType === 'pickup' || window._freeDeliveryCoupon) ? 0 : _computeDeliveryFeeForRes(res); // [FIX-COUPON-AUDIT] كوبون التوصيل المجاني يُصفِّر سعر التوصيل فعلياً
        const total = (sub + deliveryPrice) - discountAmount - pointsDiscountUsed;
        
        let bonusNotice = "";
        if (sub < pointsConfig.minOrderForBonus) {
            const diff = pointsConfig.minOrderForBonus - sub;
            bonusNotice = `<div class="card" style="background:rgba(212,175,55,0.1); border:1px dashed var(--gold); margin-bottom:8px; animation: pulse 2s infinite; text-align:center; padding: 10px;">
                <p style="margin:0; font-size:10px; color:var(--gold);">خلي فاتورتك بقيمة <b style="color:white;">${pointsConfig.minOrderForBonus.toLocaleString()}</b> ل.س واربح نقاط إضافية!</p>
            </div>`;
        } else {
            bonusNotice = `<div class="card" style="background:rgba(39, 174, 96, 0.2); border:1px solid #2ecc71; margin-bottom:8px; text-align:center; padding: 10px;">
                <p style="margin:0; font-size:10px; color:#2ecc71;">مبروك! ستحصل على <b style="color:white;">${pointsConfig.bonusPoints}</b> نقاط إضافية 🦅</p>
            </div>`;
        }

        // [REMOVED-BY-REQUEST] حُذف تحذير تعديل الفاتورة بناءً على طلبك
        const _priceChangeWarning = '';

        // [SEC-FIX-CART-XSS] تمرير اسم الصنف عبر escHtml — كان يُدرج مباشرة داخل innerHTML بدون تعقيم،
        // وبما أن اسم الصنف يأتي من بيانات المطعم (وقد يكون مطعماً شريكاً خارجياً)، فهذا يسد ثغرة XSS محتملة
        cont.innerHTML = '<div id="cart-address-picker-container"></div>' + _priceChangeWarning + bonusNotice + cart.map((i, idx) => `<div class="card" style="padding: 10px;"><div class="flex-reverse"><span><b style="font-size: 12px;">${escHtml(i.n)}${(i.qty && i.qty > 1) ? ' <span style=\"color:var(--gold);\">×' + i.qty + '</span>' : ''}</b></span><span style="font-size: 11px;">${(i.p * (i.qty || 1)).toLocaleString()} ل.س</span><i class="fas fa-trash" style="font-size: 12px;" onclick="removeFromCart(${idx})"></i></div></div>`).join('');
        // [FIX-CART-ADDRESS-PICKER] تحميل قائمة العناوين المحفوظة أعلى السلة — يعمل بشكل غير متزامن
        // حتى لا يؤخّر عرض بقية محتوى السلة نفسه
        if (typeof _loadCartAddressPicker === 'function') _loadCartAddressPicker();
        sum.style.display = 'block';
        sum.innerHTML = `
            <div class="card" style="background:rgba(212,175,55,0.05); border:1px dashed var(--gold); margin-bottom:8px; padding: 12px;">
                <div style="text-align:center; color:var(--gold); border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:8px; margin-bottom:8px; font-weight:bold; font-size: 13px;">فاتورة: ${res ? res.name : 'طلب خارجي'}</div>
                <div class="flex-reverse" style="font-size: 11px;"><span>الوجبات:</span><span>${fmtSYP(sub,{inline:true,size:11})}</span></div>
                ${_serviceType === 'pickup'
                    ? `<div class="flex-reverse" style="font-size:11px; color:#3498db;"><span>التوصيل:</span><span><s style="color:#555;">${fmtSYP(res ? res.delivery_fee : 0,{inline:true,size:11})}</s> <b>مجاناً 🏪</b></span></div>`
                    : `<div class="flex-reverse" style="font-size: 11px;"><span>التوصيل:</span><span>${fmtSYP(deliveryPrice,{inline:true,size:11})}</span></div>`
                }
                ${discountAmount > 0 ? `<div class="flex-reverse" style="color:var(--gold); font-size: 11px;"><span>خصم الكوبون:</span><span>-${fmtSYP(discountAmount,{inline:true,size:11})}</span></div>` : ''}
                ${pointsDiscountUsed > 0 ? `<div class="flex-reverse" style="color:var(--gold); font-size: 11px;"><span>خصم النقاط:</span><span>-${fmtSYP(pointsDiscountUsed,{inline:true,size:11})}</span></div>` : ''}
                <hr style="border:0; border-top:1px solid rgba(212,175,55,0.2); margin:5px 0;">
                <div class="flex-reverse" style="font-weight:bold; font-size:14px;"><span>الإجمالي:</span><span>${fmtSYP(total > 0 ? total : 0,{inline:true,size:14})}</span></div>
            </div>
            ${currentUser && currentUser.points >= 100 ? `
            <div class="card" style="margin-bottom:8px; background:rgba(212,175,55,0.1); padding: 8px;">
                <div class="flex-reverse" style="font-size: 10px;">
                    <div>لديك <b style="color:var(--gold);">${currentUser.points}</b> نقطة</div>
                    <button class="btn-gold" style="width:auto; padding:4px 8px; font-size:9px; border-radius:8px;" onclick="usePointsDiscount()">استبدال بـ 40,000</button>
                </div>
            </div>` : ''}
            <div class="flex-reverse" style="margin-bottom:8px; gap: 5px;">
                <input type="text" id="coupon-input" placeholder="كوبون خصم?" style="margin:0; flex:1; padding:8px; font-size:11px;">
                <button class="btn-gold" style="width:auto; padding:0 12px; font-size: 11px;" onclick="applyCoupon()">تطبيق</button>
            </div>
            <div class="card" style="margin-bottom:8px; padding:10px;">
                <label style="font-size:11px; color:var(--gold); display:block; margin-bottom:8px;"><i class="fas fa-truck"></i> نوع الخدمة</label>
                <div style="display:flex; gap:8px;">
                    <div id="svc-delivery-btn" onclick="setServiceType('delivery')" style="flex:1; padding:10px 6px; border-radius:10px; cursor:pointer; text-align:center; font-size:11px; font-weight:bold; ${_serviceType !== 'pickup' ? 'border:2px solid var(--gold); background:rgba(212,175,55,0.15); color:var(--gold);' : 'border:2px solid #555; background:transparent; color:#aaa;'}">
                        <i class="fas fa-motorcycle" style="display:block; font-size:18px; margin-bottom:4px;"></i>توصيل
                    </div>
                    ${res && res.is_featured ? `
                    <div id="svc-pickup-btn" onclick="setServiceType('pickup')" style="flex:1; padding:10px 6px; border-radius:10px; cursor:pointer; text-align:center; font-size:11px; font-weight:bold; ${_serviceType === 'pickup' ? 'border:2px solid var(--gold); background:rgba(212,175,55,0.15); color:var(--gold);' : 'border:2px solid #555; background:transparent; color:#aaa;'}">
                        <i class="fas fa-store" style="display:block; font-size:18px; margin-bottom:4px;"></i>استلام من المطعم
                    </div>` : ''}
                </div>
                <div id="svc-pickup-note" style="display:${_serviceType === 'pickup' ? 'block' : 'none'}; margin-top:8px; background:rgba(52,152,219,0.1); border:1px solid #3498db; border-radius:8px; padding:8px; font-size:10px; color:#3498db; line-height:1.7;">
                    <i class="fas fa-info-circle"></i> ستحضر للمطعم وتستلم طلبك بنفسك — لن يتم إرسال مندوب. الدفع يتم في المطعم مباشرة.
                </div>
            </div>
            <div class="card" style="margin-bottom:8px; padding:10px;">
                <label style="font-size:11px; color:var(--gold); display:block; margin-bottom:6px;"><i class="fas fa-sticky-note"></i> ملاحظات الطلب (اختياري)</label>
                <textarea id="order-notes-input" placeholder="مثال: بدون بصل، اتصل قبل الوصول..." style="width:100%; min-height:50px; background:rgba(0,0,0,0.2); border:1px solid rgba(212,175,55,0.3); border-radius:8px; padding:8px; color:#fff; font-size:11px; resize:vertical; font-family:inherit;" oninput="_orderNotesValue = this.value">${escHtml(_orderNotesValue)}</textarea>
            </div>
            <button class="btn-gold" id="main-confirm-order-btn" style="margin-top:8px; position:relative; overflow:hidden;" onclick="confirmOrderStart()"><span style="position:relative; z-index:2;">تأكيد الطلب 🦅</span></button>`;
    }

    async function applyCoupon() {
        const code = document.getElementById('coupon-input').value.toUpperCase().trim();
        if(!code) return;
        const { data: cp, error } = await _supabase.from('coupons').select('*').eq('code', code).single();
        if (!cp || error) {
            showNotify("الكوبون غير صحيح أو منتهي", "error");
            return;
        }
        // [FIX-COUPON-AUDIT] فحوصات حقيقية كانت مفقودة تماماً — أي كوبون بالكود الصحيح كان يُقبَل
        // بغض النظر عن حالته الفعلية، مما يسمح باستخدام كوبونات موقوفة أو مخصَّصة لعميل آخر أو مُستخدَمة
        // من قبل بالفعل
        if (cp.is_active === false) {
            showNotify("هذا الكوبون موقوف حالياً", "error");
            return;
        }
        if (cp.target_user && cp.target_user.trim() !== '' && cp.target_user.trim() !== (currentUser.phone || '').trim()) {
            showNotify("هذا الكوبون مخصَّص لعميل آخر ولا يمكنك استخدامه", "error");
            return;
        }
        if (cp.is_once && cp.used_at) {
            showNotify("تم استخدام هذا الكوبون بالفعل ولا يمكن إعادة استخدامه", "error");
            return;
        }
        // [FIX-COUPON-AUDIT] كوبونات "توصيل مجاني" كانت لا تُطبَّق أي خصم فعلياً (قيمتها 0 دائماً) —
        // الآن تُلغي سعر التوصيل مباشرة بدل محاولة خصم مبلغ صفر بلا أي أثر
        if (cp.type === 'free_delivery') {
            window._freeDeliveryCoupon = true;
            discountAmount = 0;
        } else {
            window._freeDeliveryCoupon = false;
            discountAmount = cp.value;
        }
        appliedCoupon = code;
        window._appliedCouponIsOnce = !!cp.is_once;
        showNotify(cp.type === 'free_delivery' ? "تم تطبيق كوبون توصيل مجاني 🚗" : `تم تطبيق خصم بقيمة ${cp.value} ل.س`);
        renderCart();
    }

    function usePointsDiscount() {
        if(currentUser.points < 100) return showNotify("تحتاج إلى 100 نقطة على الألق", "error");
        pointsDiscountUsed = 40000; 
        showNotify("تم تطبيق خصم نقاط الشاهين 🦅");
        renderCart();
    }

    let _confirmOrderPending = false; // [FIX-C1] guard ضد double-submit
    async function confirmOrderStart() {
        if (_confirmOrderPending) return;
        // [BUGFIX-REQUIRE-ADDRESS] إلزام وجود عنوان واحد على الأقل قبل السماح بإرسال أي طلب — نفس
        // الدالة الموحّدة المستخدَمة بكل مسارات الطلب الأخرى (اتساق تام)
        if (!(await _verifyCustomerAddressLive(true))) return;
        _confirmOrderPending = true;
        // [ORDER-LOCK-FIX] إيقاف التحديث التلقائي مؤقتاً أثناء إرسال الطلب لمنع التعارض
        if (_manualRefreshInterval) { clearInterval(_manualRefreshInterval); _manualRefreshInterval = null; }
        const _confirmBtn = document.getElementById('main-confirm-order-btn') || document.querySelector('[onclick="confirmOrderStart()"]');
        // [FEATURE-DETERMINATE-PROGRESS] شريط تقدّم يمتلئ فعلياً (0% إلى 90% تدريجياً أثناء الانتظار
        // الحقيقي، ثم يقفز لـ100% فوراً عند اكتمال الإرسال) — إحساس حقيقي بالتقدّم بدل حركة لا نهائية
        let _progressInterval = null;
        if (_confirmBtn) {
            _confirmBtn.disabled = true;
            _confirmBtn.innerHTML = `
                <div style="position:absolute; inset:0; background:rgba(0,0,0,0.2);">
                    <div id="confirm-btn-progress-fill" style="position:absolute; top:0; bottom:0; right:0; width:0%; background:rgba(255,255,255,0.35); transition:width .3s ease-out;"></div>
                </div>
                <span style="position:relative; z-index:2;"><i class="fas fa-circle-notch fa-spin"></i> جاري إرسال الطلب...</span>`;
            let _fakeProgress = 0;
            const _fillEl = document.getElementById('confirm-btn-progress-fill');
            _progressInterval = setInterval(() => {
                if (_fakeProgress < 90) {
                    _fakeProgress += (90 - _fakeProgress) * 0.12; // تباطؤ طبيعي كلما اقترب من النهاية
                    if (_fillEl) _fillEl.style.width = _fakeProgress + '%';
                }
            }, 150);
        }
        try {
            // [BG-ORDER-FIX] التحقق من الاتصال قبل الإرسال — يمنع التجمد بعد العودة من الخلفية
            await _ensureConnectionBeforeOrder();
            await _confirmOrderStart_inner();
            // إكمال الشريط 100% فوراً عند نجاح الإرسال الفعلي
            const _fillEl2 = document.getElementById('confirm-btn-progress-fill');
            if (_fillEl2) _fillEl2.style.width = '100%';
        } finally {
            if (_progressInterval) clearInterval(_progressInterval);
            _confirmOrderPending = false;
            if (_confirmBtn) { _confirmBtn.disabled = false; _confirmBtn.innerHTML = '<span style="position:relative; z-index:2;">تأكيد الطلب 🦅</span>'; }
            // [ORDER-LOCK-FIX] إعادة تشغيل التحديث التلقائي بعد انتهاء الإرسال
            if (!_manualRefreshInterval) { _manualRefreshInterval = setInterval(manualRefreshData, 20000); }
        }
    }

    // [BG-ORDER-FIX] دالة ضمان الاتصال قبل إرسال أي طلب
    async function _ensureConnectionBeforeOrder() {
        // اختبار سريع بـ fetch مباشر — أسرع وأكثر موثوقية من Supabase client
        try {
            const _ctrl = new AbortController();
            const _timer = setTimeout(() => _ctrl.abort(), 4000);
            await fetch('https://qfyggwffibmrlsvlzwgs.supabase.co/rest/v1/app_config?select=id&id=eq.1&limit=1', {
                signal: _ctrl.signal,
                headers: { 'apikey': 'sb_publishable_FIh2oKce-lHn0BVQgHWE1Q_erut1cMR', 'Accept': 'application/json' }
            });
            clearTimeout(_timer);
        } catch (_connErr) {
            // الاتصال بطيء — انتظر ثانية للتعافي
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async function _confirmOrderStart_inner() {
        // [FIX-CUSTOMER-BLOCK] فحص حيّ مباشر من القاعدة قبل أي طلب جديد — دفاع إضافي حتى لو بقيت
        // جلسة الدخول فعّالة محلياً لعميل تم حظره حديثاً من الإدارة
        try {
            const { data: _blockCheck } = await _supabase.from('customers').select('account_status').eq('id', currentUser.uid).maybeSingle();
            if (_blockCheck && _blockCheck.account_status === 'blocked') {
                showNotify('⛔ حسابك محظور. يرجى التواصل مع الإدارة لمزيد من التفاصيل.', 'error');
                return;
            }
        } catch(_e) { /* لا نمنع الطلب بسبب فشل هذا الفحص نفسه (مشكلة اتصال عابرة) */ }

        const res = data.find(r => r.id === currentResId);
        // ── فحص مزدوج: مقفول أو غير مفعّل → وقف الطلب ──
        if(res && (_resIsLocked(res) || !_resIsActive(res))) {
            showNotify('⛔ ' + (res.name||'المطعم') + ' خارج الخدمة حالياً، يرجى الطلب من المنيو المتاح', 'error');
            return;
        }
        // [REMOVED-BY-REQUEST] حُذف قيد "أقصى طلبين نشطين" بالكامل بناءً على طلبك — العميل يقدر
        // ينشئ أي عدد طلبات بدون أي حجب أو فحص مسبق لعددها.

        // [SEC-FIX-ADDRESS-REQUIRED-ALL-PATHS] فحص العنوان الآن مشترك بين كل مسارات الطلب (الرئيسي،
        // الاستشارات، الأسر المنتجة) — كان موجوداً بمسار الطلب الرئيسي فقط
        if (!(await _verifyCustomerAddressLive(true))) return;
        // ── مفعّل: الكود الأصلي كامل ──
        const sub = cart.reduce((s,i) => s + (i.p * (i.qty || 1)), 0); // [FIX-CART-QUANTITY] ضرب السعر بالكمية
        // [FIX-DISTANCE-PRICING] سعر التوصيل صفر عند اختيار الاستلام، وإلا يُحسَب حسب النظام الفعّال
        // وقت إنشاء هذا الطلب بالذات (ثابت أو مسافة) — هذه القيمة تُحفَظ مع الطلب نفسه ولا تتأثر
        // بأي تغيير لاحق تجريه الإدارة على نظام الحساب، تماماً كما هو مطلوب
        const deliveryPrice = (_serviceType === 'pickup' || window._freeDeliveryCoupon) ? 0 : _computeDeliveryFeeForRes(res); // [FIX-COUPON-AUDIT] كوبون التوصيل المجاني يُصفِّر سعر التوصيل فعلياً
        const total = (sub + deliveryPrice) - discountAmount - pointsDiscountUsed;
        // [SEC-FIX-ORDER-TOTAL-VALIDATION] بوابة تحقق نهائية قبل أي محاولة إرسال — تمنع وصول قيمة
        // غير صالحة (NaN أو رقم غير منطقي) لقاعدة البيانات إطلاقاً، وتعطي رسالة خطأ واضحة ومحدَّدة
        // بدل رسالة "تحقق من الاتصال" العامة المضلِّلة حين يكون السبب الحقيقي خلل بحساب السعر
        if (!isFinite(total) || total < 0 || total > 5000000) {
            console.error('[SEC-FIX-ORDER-TOTAL-VALIDATION] قيمة إجمالي غير صالحة قبل الإرسال:', { sub, deliveryPrice, discountAmount, pointsDiscountUsed, total });
            showNotify('⚠️ حدث خطأ بحساب سعر الطلب، يرجى إعادة فتح السلة والمحاولة من جديد', 'error');
            return;
        }
        const orderId = generateUniqueId(); 
        verificationCode = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('reveal-order-code').innerText = verificationCode;
        document.getElementById('client-reveal-code').innerText = verificationCode;
        let earnedPoints = pointsConfig.pointsPerOrder || 0;
        if (earnedPoints && sub >= pointsConfig.minOrderForBonus) { earnedPoints += pointsConfig.bonusPoints; }
        
        // ===== توليد اسم مستخدم تلقائي للعميل مع الطلب =====
        const _autoOrderUsername = _generateAutoUsername('ORD');
        // ===== نهاية توليد اسم المستخدم =====

        // ===== تحديد حالة الطلب بناءً على نوع المطعم ونوع الخدمة =====
        const _isPartnerRes = res && (res.branch === 'شريك خارجي' || res.allow_orders === true);
        // [FIX-ORDER-FLOW-ROOT-CAUSE] [PICKUP-STATUS] العزل عبر service_type وحده لم يكن كافياً: طلب
        // الاستلام كان يمرّ فعلياً بحالة 'searching' — وهي نفس الحالة الحرفية التي يراقبها أي نظام أو
        // مشغّل قاعدة بيانات (trigger) لدى المندوب لرصد "طلبات متاحة"، بصرف النظر عن قيمة service_type.
        // طالما أن status='searching'، فمن المرجّح أن أي آلية خارج هذا الملف (تطبيق المندوب، أو
        // مُشغّل على مستوى القاعدة) تلتقطها فوراً — وهذا الجذر الحقيقي للمشكلة، وليس مجرد سباق توقيت.
        // الحل الجذري: طلب الاستلام يحصل الآن على حالة مختلفة تماماً 'pickup_pending' لا تتقاطع
        // إطلاقاً مع أي حالة يراقبها نظام التوصيل. نحاول هذه القيمة أولاً؛ فقط إن رفضتها القاعدة
        // فعلياً (قيد CHECK على القيم المسموحة) نتراجع تلقائياً وبصمت إلى 'searching' حتى لا ينكسر
        // إنشاء الطلب أبداً — لكن هذا احتياط أخير فقط، وليس السلوك المقصود.
        let _initialOrderStatus = (_serviceType === 'pickup') ? 'pickup_pending' : 'searching';

        // [FIX-CART-3] تنظيف cart من أي حقول إضافية قبل إرسالها لقاعدة البيانات
        const _cleanCart = cart.map(i => ({n: i.n, p: i.p}));
        // [PICKUP-SAFE] نحتفظ بـ _isPickupOrder قبل أي reset محتمل
        const _isPickupOrder = _serviceType === 'pickup';
        // [FIX-DRIVER-RACE] service_type (وadmin_sent_to_restaurant لطلبات الاستلام) يجب أن تكون جزءاً
        // من الإدخال الأول نفسه، لا تحديثاً لاحقاً منفصلاً — التحديث المنفصل كان يفتح نافذة زمنية
        // قصيرة يظهر خلالها الطلب بدون service_type محدد بعد، فيلتقطه أي استعلام لدى تطبيق المندوب
        // يراقب الطلبات الجديدة (حالة 'searching')، فيصل إشعار للمندوب فوراً، ثم يختفي الطلب من عنده
        // بعد لحظات عندما يصل تحديث service_type='pickup' — بالضبط السلوك المُبلَّغ عنه.
        const orderData = { id: orderId, customer_name: currentUser.name, phone: currentUser.phone, restaurant_name: res ? res.name : "طلب خارجي", total: total > 0 ? total : 0, status: _initialOrderStatus, date: new Date().toLocaleString('ar-SA'), items: _cleanCart, points_earned: earnedPoints, points_spent: pointsDiscountUsed > 0 ? 100 : 0, delivery_price: _isPickupOrder ? 0 : deliveryPrice, restaurant_id: res ? res.id : null, customer_id: currentUser.uid, verify_code: verificationCode, service_type: _isPickupOrder ? 'pickup' : 'delivery' };
        if (_isPickupOrder) orderData.admin_sent_to_restaurant = true;
        // [FIX-SAFE] تنظيف safeOrderData: items → JSON string لضمان التوافق مع جميع أنواع الأعمدة
        const { date: d, phone: ph, ...safeOrderData } = orderData;
        if (Array.isArray(safeOrderData.items)) {
            safeOrderData.items = JSON.stringify(safeOrderData.items);
        }
        try {
            // ── جدول orders: الحقول المضمونة، مع احتياط غير مشروط عند أي خطأ من القاعدة ──
            const _orderTimeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 20000));
            let { error: err1 } = await Promise.race([_supabase.from('orders').insert([safeOrderData]), _orderTimeoutPromise]);
            if (err1) {
                // [FIX-UNCONDITIONAL-FALLBACK] لا نحاول تخمين شكل رسالة الخطأ إطلاقاً (قد تختلف حسب
                // إصدار قاعدة البيانات ولا يمكن ضمان مطابقتها بأي تعبير نصي) — أي فشل في المحاولة
                // الأولى بحالة 'pickup_pending' يعني تراجعاً فورياً وغير مشروط إلى 'searching' (القيمة
                // المضمونة تاريخياً)، بصرف النظر عن سبب الفشل الحقيقي. هذا يضمن أن إنشاء الطلب لن ينكسر
                // أبداً بسبب حالة status الجديدة، مهما كان شكل رفض القاعدة لها.
                console.error('[FIX-ORDER-FLOW-ROOT-CAUSE] فشل إدخال orders بالحالة الأصلية (' + safeOrderData.status + ')، تراجع غير مشروط إلى searching:', err1);
                if (safeOrderData.status !== 'searching') {
                    _initialOrderStatus = 'searching';
                    safeOrderData.status = 'searching';
                }
                const _retry1 = await _supabase.from('orders').insert([safeOrderData]);
                if (_retry1.error) {
                    // [FIX-OPTIONAL-COLUMNS] لا يزال يفشل — على الأغلب service_type/admin_sent_to_restaurant
                    // أعمدة غير موجودة بعد؛ آخر محاولة بدونها تماماً
                    console.error('[FIX-ORDER-FLOW-ROOT-CAUSE] لا يزال الإدخال يفشل، إعادة محاولة أخيرة بدون service_type:', _retry1.error);
                    const { service_type: _st, admin_sent_to_restaurant: _asr, ...safeOrderDataNoType } = safeOrderData;
                    const _retry2 = await _supabase.from('orders').insert([safeOrderDataNoType]);
                    if (_retry2.error) throw _retry2.error;
                }
            }

            // [FIX-ROBUST-LOC] حل موقع المطعم الآن، قبل بناء كائن الحفظ الرئيسي مباشرة — بحيث يكون
            // restaurant_id وإحداثيات المطعم جزءاً من نفس عملية الحفظ المضمونة الناجحة، لا تحديثاً
            // منفصلاً لاحقاً قد يفشل بصمت في خطوة إضافية يصعب رصدها
            let _resolvedResId = null, _resolvedPickupLat = null, _resolvedPickupLng = null, _resolvedAddr = null;
            try {
                const _resTableEarly = (res && (res.res_type === 'pharmacy' || res.res_type === 'pharmacy_delivery')) ? 'pharmacies' : 'restaurants';
                _resolvedResId = res && (res.id || res.restaurant_id) ? String(res.id || res.restaurant_id) : null;
                if (_resolvedResId) {
                    const { data: _resLocData, error: _resLocErr } = await _supabase.from(_readTable(_resTableEarly))
                        .select('pickup_lat,pickup_lng,res_address,address,maps_url')
                        .eq('id', _resolvedResId).maybeSingle();
                    if (_resLocErr) console.error('[FIX-ROBUST-LOC] خطأ أثناء جلب موقع المطعم قبل الحفظ:', _resLocErr);
                    if (_resLocData) {
                        if (_resLocData.pickup_lat)  _resolvedPickupLat = _resLocData.pickup_lat;
                        if (_resLocData.pickup_lng)  _resolvedPickupLng = _resLocData.pickup_lng;
                        _resolvedAddr = _resLocData.res_address || _resLocData.address || _resLocData.maps_url || null;
                    } else {
                        console.error('[FIX-ROBUST-LOC] لم يُعثر على صف المطعم في (' + _resTableEarly + ') لـ id:', _resolvedResId);
                    }
                } else {
                    console.error('[FIX-ROBUST-LOC] تعذّر تحديد restaurant_id من كائن res:', res);
                }
            } catch(_resolveErr) {
                console.error('[FIX-ROBUST-LOC] استثناء غير متوقع أثناء حل موقع المطعم قبل الحفظ:', _resolveErr);
            }

            // ── sh_public_orders: الحقول الأساسية المضمونة فقط (+ موقع المطعم محسوباً مسبقاً أعلاه) ──
            // [FIX-DRIVER-RACE] نفس المبدأ: service_type ضمن الإدخال الأول مباشرة، لا تحديث لاحق
            const _corePublicData = {
                id:               orderId,
                customer_name:    currentUser.name,
                phone:            currentUser.phone,
                restaurant_name:  res ? res.name : 'طلب خارجي',
                restaurant_id:    _resolvedResId,
                pickup_lat:       _resolvedPickupLat,
                pickup_lng:       _resolvedPickupLng,
                res_address:      _resolvedAddr || (res ? (res.address || 'عنوان المطعم') : 'موقع الاستلام'),
                customer_address: currentUser.address || 'عنوان العميل', // [CONFIRMED-OK] currentUser.address يتحدّث فعلياً عند اختيار عنوان (useSavedAddressForOrder)
                // [BUGFIX-MISSING-CUSTOMER-COORDS] إحداثيات موقع العميل كانت غائبة تماماً هنا — يُرسَل
                // نص العنوان بس بدون أي إحداثيات فعلية، فما كان يظهر دبوس موقع العميل على خريطة
                // المندوب إطلاقاً بهذا المسار (الرئيسي). userLoc يعكس دائماً آخر عنوان اختاره العميل فعلياً
                lat:              (userLoc && userLoc.lat) ? userLoc.lat : ((currentUser && currentUser.lat) || null),
                lng:              (userLoc && userLoc.lng) ? userLoc.lng : ((currentUser && currentUser.lng) || null),
                total:            total > 0 ? total : 0,
                status:           _initialOrderStatus,
                items:            JSON.stringify(_cleanCart),
                customer_id:      currentUser.uid,
                delivery_price:   _isPickupOrder ? 0 : deliveryPrice,
                created_at:       new Date().toISOString(),
                verify_code:      verificationCode,
                service_type:     _isPickupOrder ? 'pickup' : 'delivery'
            };
            if (_isPickupOrder) _corePublicData.admin_sent_to_restaurant = true;
            let _err2 = null;
            {
                const { error } = await _supabase.from('sh_public_orders').insert([_corePublicData]);
                _err2 = error;
            }
            if (_err2 && _corePublicData.status !== 'searching') {
                // [FIX-UNCONDITIONAL-FALLBACK] نفس المبدأ: أي فشل مع حالة 'pickup_pending' هنا يعني
                // تراجعاً فورياً وغير مشروط إلى 'searching'، بلا أي محاولة لتفسير سبب الفشل
                console.error('[FIX-ORDER-FLOW-ROOT-CAUSE] فشل إدخال sh_public_orders بالحالة (' + _corePublicData.status + ')، تراجع غير مشروط إلى searching:', _err2);
                _initialOrderStatus = 'searching';
                _corePublicData.status = 'searching';
                const _retryStatus = await _supabase.from('sh_public_orders').insert([_corePublicData]);
                _err2 = _retryStatus.error;
            }
            if (_err2 && (String(_err2.message||'').includes('service_type') || String(_err2.message||'').includes('admin_sent_to_restaurant'))) {
                // [FIX-OPTIONAL-COLUMNS] نفس الاحتياط: لو هذان العمودان تحديداً غير موجودين في
                // sh_public_orders، نعيد المحاولة فوراً بدونهما بلا أي تأخير
                console.error('[FIX-DRIVER-RACE] فشل إدخال sh_public_orders بسبب عمود service_type/admin_sent_to_restaurant، إعادة محاولة فورية بدونهما:', _err2);
                const { service_type: _st2, admin_sent_to_restaurant: _asr2, ...corePublicNoType } = _corePublicData;
                const _retry2 = await _supabase.from('sh_public_orders').insert([corePublicNoType]);
                _err2 = _retry2.error;
            }
            const err2 = _err2;
            if (err2) {
                console.error('[FIX-ROBUST-LOC] فشل إدخال sh_public_orders بالحقول الكاملة، إعادة محاولة بدون حقول الموقع:', err2);
                const { restaurant_id: _ri, pickup_lat: _pl, pickup_lng: _pn, ...minimalData } = _corePublicData;
                const { error: err2retry } = await _supabase.from('sh_public_orders').insert([minimalData]);
                if (err2retry) throw err2retry;
                try {
                    const { error: _lateErr } = await _supabase.from('sh_public_orders').update({ restaurant_id: _resolvedResId, pickup_lat: _resolvedPickupLat, pickup_lng: _resolvedPickupLng }).eq('id', orderId);
                    if (_lateErr) console.error('[FIX-ROBUST-LOC] فشلت أيضاً المحاولة الاحتياطية لحفظ موقع المطعم:', _lateErr);
                } catch(_lateEx) { console.error('[FIX-ROBUST-LOC] استثناء في المحاولة الاحتياطية:', _lateEx); }
            }

            // ── حقول اختيارية أخرى: update منفصل لا يوقف الطلب عند فشله ──
            const _extraFields = {};
            if (discountAmount + pointsDiscountUsed > 0) _extraFields.discount = discountAmount + pointsDiscountUsed;
            // [BUGFIX-ADDRESS-PRIORITY] كان يفضّل عنوان الملف الشخصي الافتراضي دائماً بدل العنوان
            // اللي اختاره العميل فعلياً لهذا الطلب — الأولوية الآن لـuserLoc (يعكس آخر اختيار حقيقي)
            const _orderLat = (userLoc && userLoc.lat) ? userLoc.lat : ((currentUser && currentUser.lat) || null);
            const _orderLng = (userLoc && userLoc.lng) ? userLoc.lng : ((currentUser && currentUser.lng) || null);
            if (_orderLat) _extraFields.lat = _orderLat;
            if (_orderLng) _extraFields.lng = _orderLng;
            // [FIX-DRIVER-RACE] service_type و admin_sent_to_restaurant أصبحا الآن جزءاً من الإدخال
            // الأول مباشرة (أعلاه) — لا حاجة لأي تحديث منفصل لاحق لهما بعد الآن، وهذا هو بالضبط ما
            // يمنع نافذة السباق التي كانت تُظهر الطلب لحظياً لتطبيق المندوب قبل اختفائه.
            _extraFields.is_partner_restaurant = _isPartnerRes;
            _extraFields.auto_username         = _autoOrderUsername;

            // [FIX-NOTES-ISOLATED-UPDATE] ملاحظات العميل تُحفظ الآن بتحديث مستقل تماماً عن كل الحقول
            // الأخرى — لأن الحقول السابقة كانت مجمّعة في تحديث واحد، وإذا فشل أي عمود واحد من الحقول
            // الأخرى (is_partner_restaurant/auto_username/lat/lng)، كان Postgrest يرفض التحديث بالكامل
            // ذرّياً، فتضيع الملاحظات أيضاً معه رغم أنها عمود سليم تماماً. الآن نجاحها أو فشلها لا يعتمد
            // على أي حقل آخر إطلاقاً.
            if (_orderNotesValue && _orderNotesValue.trim()) {
                try {
                    const { error: _notesErr } = await _supabase.from('sh_public_orders').update({ order_notes: _orderNotesValue.trim() }).eq('id', orderId);
                    if (_notesErr) {
                        console.error('[FIX-NOTES-ISOLATED-UPDATE] فشل حفظ ملاحظات العميل بشكل مستقل:', _notesErr);
                    } else {
                        // مزامنة نفس الحقل على جدول orders أيضاً إن أمكن (احتياط، بلا تأثير على sh_public_orders)
                        try { await _supabase.from('orders').update({ order_notes: _orderNotesValue.trim() }).eq('id', orderId); } catch(_e3) {}
                    }
                } catch(_notesEx) {
                    console.error('[FIX-NOTES-ISOLATED-UPDATE] استثناء غير متوقع أثناء حفظ الملاحظات:', _notesEx);
                }
            }

            // ===== نهاية FIX-STORE-LOC =====
            // [FIX-RELIABLE-LOC-COPY] الانتظار الفعلي لنتيجة التحديث + تسجيل أي فشل بوضوح، بدل تجاهله بصمت تماماً
            try {
                const { error: _locUpdateErr } = await _supabase.from('sh_public_orders').update(_extraFields).eq('id', orderId);
                if (_locUpdateErr) {
                    console.error('[FIX-STORE-LOC] فشل حفظ الحقول الإضافية (نقاط/خصم) على الطلب:', _locUpdateErr);
                }
                // [REMOVED-BY-REQUEST] حُذف تنبيه "قد يتأخر تحديد موقع المطعم للمندوب" نهائياً
            } catch(_locUpdateEx) {
                console.error('[FIX-STORE-LOC] استثناء غير متوقع أثناء حفظ الحقول الإضافية على الطلب:', _locUpdateEx);
            }

            const publicOrderData = { ..._corePublicData, ..._extraFields, order_notes: (_orderNotesValue||'').trim() || undefined };
            let orders = getStorage('orders');
            if(!Array.isArray(orders)) orders = []; 
            orders.push(orderData);
            setStorage('orders', orders);
            currentOrderKey = orderId;
            localStorage.setItem('shahen_active_order_id', orderId);
            cart = []; currentResId = null; try{localStorage.removeItem('shahen_saved_cart');}catch(e){} 
            document.getElementById('badge').innerText = 0;
            document.getElementById('badge').style.display = 'none';
            pointsDiscountUsed = 0; discountAmount = 0;
            // [FIX-COUPON-AUDIT] تسجيل استخدام الكوبون فقط الآن (نجاح الطلب الفعلي)، لا عند مجرد
            // تطبيقه بالسلة — حتى لا يُحرَق كوبون العميل إن غيّر رأيه ولم يكمل الطلب
            if (appliedCoupon && window._appliedCouponIsOnce) {
                _supabase.from('coupons').update({ used_at: new Date().toISOString(), used_by: currentUser.uid }).eq('code', appliedCoupon).then(() => {}).catch(() => {});
            }
            appliedCoupon = ''; window._freeDeliveryCoupon = false; window._appliedCouponIsOnce = false;
            _orderNotesValue = ''; // [ORDER-NOTES] إعادة الضبط بعد إرسال الطلب بنجاح
            // [PICKUP-WAIT-FOR-RESTAURANT] طلبات الاستلام: لا تُفتح شاشة "طلب الاستلام" فوراً — يجب
            // انتظار موافقة صريحة من المطعم أولاً (عبر لوحة/تطبيق المطعم)، تماماً كما هو مطلوب. العميل
            // يبقى في شاشة انتظار حتى يقبل المطعم الطلب فعلياً.
            if (_isPickupOrder) {
                _serviceType = 'delivery'; // إعادة الضبط للطلبات القادمة
                _showPickupWaiting(res ? res.name : 'المطعم', orderId, total > 0 ? total : 0);
            } else {
                startSearching();
            }
        } catch (error) {
            // [BG-ORDER-FIX] عند التجمد بعد الخلفية — أعد الاتصال أولاً ثم retry
            try {
                // إذا كان الخطأ Timeout — احتمال كبير أن السبب انقطاع الاتصال عند العودة من الخلفية
                if (error.message === 'TIMEOUT' || error.message === 'Failed to fetch' || error.message === 'NetworkError') {
                    try { initRealtimeNotifications(); } catch(_re) {}
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    await new Promise(r => setTimeout(r, 1500));
                }
                // [FIX-FALSE-FAILURE] قبل إعادة المحاولة: تحقق هل الطلب الأول نجح فعلياً على الخادم رغم
                // ظهور خطأ (Timeout) على جهاز العميل — هذا يحدث فعلياً عندما تصل الإضافة للخادم وتُنفَّذ
                // بنجاح، لكن الرد يتأخر عن العودة للمتصفح بسبب اتصال بطيء، فيُصنَّف كفشل ظلماً ثم تفشل
                // إعادة المحاولة لاحقاً بتعارض المعرّف (نفس orderId موجود مسبقاً) وتظهر رسالة خطأ مضللة
                // للعميل رغم أن طلبه أُرسل بنجاح فعلاً.
                let _alreadySucceeded = false;
                try {
                    const { data: _existingOrder } = await _supabase.from('orders').select('id').eq('id', orderId).maybeSingle();
                    if (_existingOrder) _alreadySucceeded = true;
                } catch(_checkEx) { /* تجاهل فشل التحقق، سنكمل بمسار إعادة المحاولة العادي */ }

                if (!_alreadySucceeded) {
                    // [FIX-IDEMPOTENT-RETRY] upsert بدل insert — لو نجح الطلب فعلياً بين لحظة الفشل الظاهري
                    // وهذه اللحظة (حالة تسابق نادرة)، لا نفشل بتعارض المعرّف، بل نحدّث نفس الصف بأمان
                    const { error: retryErr1 } = await _supabase.from('orders').upsert([safeOrderData], { onConflict: 'id' });
                    if (retryErr1) throw retryErr1;
                }
                const { error: retryErr2 } = await _supabase.from('sh_public_orders').upsert([_corePublicData], { onConflict: 'id' });
                if (retryErr2) throw retryErr2;
                // [FIX] إعادة حقول الـ update الاختيارية الأخرى (نقاط/خصم) بعد نجاح retry
                try {
                    const { error: _retryLocErr } = await _supabase.from('sh_public_orders').update(_extraFields).eq('id', orderId);
                    if (_retryLocErr) console.error('[FIX-STORE-LOC] فشل حفظ الحقول الإضافية بعد إعادة المحاولة:', _retryLocErr);
                } catch(_retryLocEx) { console.error('[FIX-STORE-LOC] استثناء أثناء حفظ الحقول الإضافية بعد إعادة المحاولة:', _retryLocEx); }
                // [FIX-NOTES-ISOLATED-UPDATE] إعادة محاولة حفظ الملاحظات بشكل مستقل أيضاً بعد نجاح retry
                if (_orderNotesValue && _orderNotesValue.trim()) {
                    try {
                        const { error: _retryNotesErr } = await _supabase.from('sh_public_orders').update({ order_notes: _orderNotesValue.trim() }).eq('id', orderId);
                        if (_retryNotesErr) console.error('[FIX-NOTES-ISOLATED-UPDATE] فشل حفظ الملاحظات بعد إعادة المحاولة:', _retryNotesErr);
                    } catch(_retryNotesEx) { console.error('[FIX-NOTES-ISOLATED-UPDATE] استثناء أثناء حفظ الملاحظات بعد إعادة المحاولة:', _retryNotesEx); }
                }
                // نجح الـ retry
                let orders = getStorage('orders');
                if(!Array.isArray(orders)) orders = [];
                orders.push(orderData);
                setStorage('orders', orders);
                currentOrderKey = orderId;
                localStorage.setItem('shahen_active_order_id', orderId);
                cart = []; currentResId = null; try{localStorage.removeItem('shahen_saved_cart');}catch(e){}
                document.getElementById('badge').innerText = 0;
                document.getElementById('badge').style.display = 'none';
                pointsDiscountUsed = 0; discountAmount = 0;
                // [FIX-COUPON-AUDIT] نفس منطق تسجيل استخدام الكوبون عند نجاح إعادة المحاولة
                if (appliedCoupon && window._appliedCouponIsOnce) {
                    _supabase.from('coupons').update({ used_at: new Date().toISOString(), used_by: currentUser.uid }).eq('code', appliedCoupon).then(() => {}).catch(() => {});
                }
                appliedCoupon = ''; window._freeDeliveryCoupon = false; window._appliedCouponIsOnce = false;
                if (_alreadySucceeded) showNotify('✅ تم إرسال طلبك بنجاح (الاتصال كان بطيئاً فقط)', 'success');
                if (_isPickupOrder) {
                    _serviceType = 'delivery';
                    _showPickupWaiting(res ? res.name : 'المطعم', orderId, total > 0 ? total : 0);
                } else {
                    startSearching();
                }
            } catch (retryError) {
                // [FIX-OFFLINE-QUEUE] قبل اعتبار الطلب فاشلاً نهائياً، نحفظه محلياً لإعادة المزامنة
                // التلقائية عند عودة الاتصال — يمنع ضياع الطلب بالكامل بسبب انقطاع إنترنت طويل
                console.error('[FIX-OFFLINE-QUEUE] فشلت كل محاولات الإرسال، يُحفظ الطلب محلياً لإعادة المحاولة لاحقاً:', retryError);
                try {
                    // [FIX-QUEUE-QUOTA] تنظيف أي عناصر قديمة جداً (أكثر من 3 أيام) من الطابور قبل الإضافة —
                    // يمنع فشل الحفظ بسبب امتلاء مساحة localStorage (شائع مع الاستخدام الطويل للتطبيق)
                    let queue = JSON.parse(localStorage.getItem('shaheen_pending_orders_queue') || '[]');
                    const _threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
                    queue = queue.filter(q => q.savedAt && q.savedAt > _threeDaysAgo);
                    queue.push({ orderId, corePublicData: _corePublicData, extraFields: _extraFields, savedAt: Date.now() });
                    localStorage.setItem('shaheen_pending_orders_queue', JSON.stringify(queue));
                    showNotify('⚠️ تعذّر إرسال الطلب الآن بسبب ضعف الاتصال — سيُرسَل تلقائياً بمجرد عودة الإنترنت، لا تُغلق الصفحة الآن إن أمكن', 'error');
                } catch(_queueErr) {
                    console.error('[FIX-OFFLINE-QUEUE] فشل حفظ الطلب في قائمة الانتظار المحلية أيضاً:', _queueErr);
                    showNotify("تعذّر إرسال الطلب — تحقق من الاتصال وأعد المحاولة ❌", "error");
                }
            }
        }
    }

    // [FIX-OFFLINE-QUEUE] إعادة محاولة إرسال أي طلبات محفوظة محلياً بسبب انقطاع سابق — تُستدعى عند بدء
    // تشغيل الصفحة وعند عودة الاتصال بالإنترنت. تتحقق أولاً إن كان الطلب نجح فعلاً (وصل للسيرفر لكن لم
    // يصل التأكيد للعميل) لتجنّب أي تكرار، قبل إعادة محاولة الإرسال من الصفر
    async function _retryPendingOfflineOrders() {
        let queue = [];
        try { queue = JSON.parse(localStorage.getItem('shaheen_pending_orders_queue') || '[]'); } catch(e) { return; }
        if (!queue.length) return;
        const remaining = [];
        for (const item of queue) {
            // طلبات أقدم من 24 ساعة نتخلى عنها — لا قيمة عملية للاحتفاظ بها بعد هذا الوقت
            if (Date.now() - (item.savedAt || 0) > 24 * 60 * 60 * 1000) continue;
            try {
                const { data: existing } = await _supabase.from('sh_public_orders').select('id').eq('id', item.orderId).maybeSingle();
                if (existing) continue; // نجح الإرسال فعلياً سابقاً، لا حاجة لإعادة المحاولة
                const { error: qErr } = await _supabase.from('sh_public_orders').insert([item.corePublicData]);
                if (qErr) { console.error('[FIX-OFFLINE-QUEUE] فشلت إعادة المحاولة لطلب:', item.orderId, qErr); remaining.push(item); continue; }
                if (item.extraFields) {
                    try { await _supabase.from('sh_public_orders').update(item.extraFields).eq('id', item.orderId); } catch(e) {}
                }
                showNotify('✅ تم إرسال طلبك المعلَّق بنجاح بعد عودة الاتصال 🦅');
            } catch(e) {
                console.error('[FIX-OFFLINE-QUEUE] استثناء أثناء إعادة محاولة طلب معلَّق:', e);
                remaining.push(item);
            }
        }
        localStorage.setItem('shaheen_pending_orders_queue', JSON.stringify(remaining));
    }

    // ===== دالة توليد اسم مستخدم تلقائي فريد =====
    function _generateAutoUsername(prefix) {
        const ts = Date.now().toString(36).toUpperCase().slice(-5);
        const rand = Math.floor(Math.random() * 9000 + 1000);
        return (prefix || 'USR') + '-' + ts + '-' + rand;
    }
    // ===== نهاية دالة توليد اسم المستخدم التلقائي =====

    // ===== FIX-RT-1: Polling سريع للكشف الفوري عن القبول (احتياطي للـ Realtime) =====
    let _searchPollInterval = null;
    function _startSearchPoll(orderId) {
        if (_searchPollInterval) clearInterval(_searchPollInterval);
        _searchPollInterval = setInterval(async () => {
            // [FIX-ORDER-MIX] نفس الإصلاح — لا نُطبّق نتيجة استطلاع طلب على شاشة طلب آخر مختلف حالياً
            if (!currentOrderKey || String(currentOrderKey) !== String(orderId)) { clearInterval(_searchPollInterval); _searchPollInterval = null; return; }
            const { data: _pollOrd } = await _supabase.from('sh_public_orders')
                .select('status, driver_name, driver_phone, driver_id, service_type').eq('id', orderId).maybeSingle();
            if (!_pollOrd) return;
            const _ps = _pollOrd.status;
            if (_ps === 'accepted' || _ps === 'preparing' || _ps === 'ready') {
                clearInterval(_searchPollInterval); _searchPollInterval = null;
                if (_ps !== lastStatusNotified) {
                    if(cancelInterval) clearInterval(cancelInterval);
                    document.getElementById('eagle-searching').style.display = 'none';
                    document.getElementById('searching-sound').pause();
                    updateOrderStatus(orderId, _ps);
                    lastStatusNotified = _ps;
                    // [FIX-ORDER-SCREEN-ROOT-CAUSE] رسالة دقيقة حسب الحالة الفعلية — لا نفترض وجود مندوب
                    // حقيقي إلا إذا كان driver_id موجوداً فعلاً
                    if (_pollOrd.service_type === 'pickup') {
                        showNotify('✅ وافق المطعم على طلب الاستلام!');
                    } else if (_pollOrd.driver_id) {
                        showNotify('تم قبول طلبك من صقر الشاهين 🦅');
                    } else {
                        showNotify('✅ وافق المطعم على طلبك — جاري البحث عن مندوب...');
                    }
                    checkOrderAction(orderId, _ps);
                }
            } else if (_ps === 'cancelled') {
                clearInterval(_searchPollInterval); _searchPollInterval = null;
                if(cancelInterval) clearInterval(cancelInterval);
                document.getElementById('eagle-searching').style.display = 'none';
                document.getElementById('searching-sound').pause();
                showNotify('تم إلغاء الطلب ❌', 'error');
                localStorage.removeItem('shahen_active_order_id'); currentOrderKey = null;
                updateOrderStatus(orderId, 'cancelled'); nav('p-home');
            } else if (_ps === 'completed') {
                // [FIX-SYNC-1] إغلاق الطلب عند العميل فوراً عند اكتمال التسليم من Polling
                clearInterval(_searchPollInterval); _searchPollInterval = null;
                if (!currentOrderKey) return; // تم معالجته بالفعل
                showNotify('✅ تم توصيل طلبك بنجاح! نوفي بعهدكم 🦅');
                localStorage.removeItem('shahen_active_order_id');
                currentOrderKey = null;
                document.getElementById('rating-overlay').style.display = 'flex';
            }
        }, 3000); // كل 3 ثواني
    }
    // ===== نهاية FIX-RT-1 =====

    function startSearching() {
        _lastCheckedOrderState = null; // [FIX-CHAT-DUPLICATE] إعادة الضبط لطلب جديد
        lastStatusNotified = ""; // [FIX-STUCK-SEARCHING] إعادة الضبط — أهم إصلاح! بدونه، أي طلب سابق وصل لحالة accepted يُسبب تجاهل كل الطلبات القادمة التي تصل لنفس الحالة بصمت
        document.getElementById('searching-sound').play();
        document.getElementById('eagle-searching').style.display = 'flex';
        // عرض كود التحقق داخل شاشة البحث إذا كان موجوداً
        if (verificationCode) {
            const codeNotice = document.getElementById('eagle-searching').querySelector('.verify-code-notice');
            if (!codeNotice) {
                const noticeDiv = document.createElement('div');
                noticeDiv.className = 'verify-code-notice';
                noticeDiv.style.cssText = 'background:rgba(212,175,55,0.15); border:1px dashed var(--gold); border-radius:12px; padding:10px 20px; margin-top:15px; text-align:center;';
                noticeDiv.innerHTML = `<p style="font-size:10px; color:var(--gold); margin:0 0 5px 0;">كود التحقق الخاص بك 🔑</p><div style="font-size:26px; font-weight:bold; letter-spacing:6px; color:#fff;">${escHtml(String(verificationCode))}</div>`;
                document.getElementById('eagle-searching').appendChild(noticeDiv);
            } else {
                codeNotice.querySelector('div').innerText = verificationCode;
            }
        }
        let timeLeft = 60; 
        document.getElementById('cancel-timer').innerText = timeLeft;
        if(cancelInterval) clearInterval(cancelInterval);
        cancelInterval = setInterval(() => {
            timeLeft--;
            const timerElement = document.getElementById('cancel-timer');
            if (timerElement) { timerElement.innerText = timeLeft; }
            if (timeLeft <= 0) {
                clearInterval(cancelInterval);
                if (_searchPollInterval) clearInterval(_searchPollInterval);
                document.getElementById('eagle-searching').style.display = 'none';
                document.getElementById('searching-sound').pause();
                showNotify("عذراً، لم يتم العثور على صقور حالياً. 🦅", "error");
                cancelOrder(); 
            }
        }, 1000);
        simulateAccept();
        // ===== FIX-RT-1: تشغيل polling احتياطي سريع =====
        if(currentOrderKey) _startSearchPoll(currentOrderKey);
    }

    function isPharmacyConsultOrder(order) {
        if (!order) return false;
        const status = String(order.status || '').toLowerCase();
        const isConsultStatus = status === 'consulting' || status === 'accepted';
        // الأولوية لـ order_type الثابت في قاعدة البيانات ثم res_type كاحتياط
        const isPharmacy = order.order_type === 'pharmacy' || order.res_type === 'pharmacy' || order.pharmacy_id || order.target_pharmacy;
        return isConsultStatus && isPharmacy;
    }

    let _consultChatChannel = null;
    let _consultMsgIds = new Set();

    // [DRIVER-STATUS-TIMELINE] علامة مخصصة لرسائل حالة الطلب — نستخدم sender:'driver' (مضمون أنه مقبول)
    // مع بادئة خاصة في النص للتمييز، بدل قيمة sender جديدة قد ترفضها قاعدة البيانات بصمت
    // [FIX-HIDE-STATUS-MSG-SOURCE] فلترة رسائل الحالة من المصدر مباشرة بعد كل جلب من القاعدة —
    // هذا يضمن عدم وصولها لأي دالة عرض إطلاقاً، بغض النظر عن أي مسار عرض حالي أو مستقبلي
    function _stripStatusMsgs(arr) {
        if (!arr) return arr;
        return arr.filter(m => !(m && m.message && m.message.includes('🔖STATUS🔖')));
    }
    const _STATUS_TAG = '🔖STATUS🔖';

    // دالة موحّدة لعرض رسالة في صندوق الدردشة العادي — رسائل حالة الطلب لا تظهر هنا أبداً (لها منطقة خاصة)
    function _appendOrderMsg(chatBoxEl, m) {
        if (!chatBoxEl) return;
        // [FIX-HIDE-STATUS-MSG] استخدام includes بدل startsWith لضمان حجب رسائل الحالة دائماً
        // حتى لو وُجدت مسافة بادئة أو اختلاف بسيط في تنسيق الرسالة المخزَّنة قديماً
        if (m.message && m.message.includes(_STATUS_TAG)) {
            _appendStatusTimeline(m.message.split(_STATUS_TAG).join('').trim());
            return;
        }
        const msgDiv = document.createElement('div');
        msgDiv.className = m.sender === 'client' ? 'chat-msg chat-out' : 'chat-msg chat-in';
        msgDiv.innerText = m.message;
        chatBoxEl.appendChild(msgDiv);
    }

    // [DRIVER-STATUS-TIMELINE] إضافة مرحلة جديدة للخط الزمني — وتعتيم كل المراحل السابقة تلقائياً
    // [PROGRESS-TRACKER] حساب وعرض المرحلة الحالية للطلب بناءً على البيانات الفعلية (status + driver_stage)
    // المراحل: 0=تم استلام الطلب 1=جاري التحضير 2=استلم المندوب الطلب 3=في الطريق 4=تم التسليم
    let _optLastIndex = -1;
    function _computeProgressStepIndex(order) {
        if (!order) return 0;
        const status = String(order.status || '').toLowerCase();
        const stage = order.driver_stage || null;
        if (status === 'completed') return 4;
        if (stage === 'to_customer' || stage === 'arrived') return 3; // "في الطريق" نشطة (و"استلم المندوب" مكتملة معها)
        // [FIX-PROGRESS-STAGE] "جاري التحضير" تعتمد على وصول المندوب الفعلي للمطعم (driver_stage)
        // لا على حالة الطلب العامة فقط — لأن مجرد قبول المندوب لا يعني وصوله أو بدء التحضير الفعلي
        if (stage === 'arrived_restaurant') return 1;
        if (status === 'accepted' || status === 'preparing' || status === 'ready') return 0; // تم استلام الطلب فقط — المندوب لسا متجه للمطعم
        return 0; // searching / pending أو أي حالة أولية أخرى
    }
    function _updateProgressTracker(order) {
        if (!order) return;
        const idx = _computeProgressStepIndex(order);
        if (idx === _optLastIndex) return; // لا تغيير — تفادي إعادة رسم غير ضرورية
        _optLastIndex = idx;
        const steps = document.querySelectorAll('#order-progress-tracker .opt-step');
        const lines = document.querySelectorAll('#order-progress-tracker .opt-line');
        steps.forEach((el) => {
            const n = parseInt(el.getAttribute('data-step'), 10);
            el.classList.remove('current');
            if (n <= idx) el.classList.add('active'); else el.classList.remove('active');
        });
        lines.forEach((el) => {
            const n = parseInt(el.getAttribute('data-line'), 10);
            if (n < idx) el.classList.add('active'); else el.classList.remove('active');
        });
        // نبضة بسيطة على المرحلة الحالية فقط (وليست المكتملة بالكامل) ما لم يكن الطلب قد اكتمل تماماً
        if (idx < 4) {
            const cur = document.querySelector(`#order-progress-tracker .opt-step[data-step="${idx}"]`);
            if (cur) cur.classList.add('current');
        }
    }

    // [DRIVER-STATUS-TIMELINE] إضافة مرحلة جديدة للخط الزمني القديم (مخفي الآن، لكن نتركه للتوافق الداخلي)
    function _appendStatusTimeline(text) {
        const wrap = document.getElementById('order-status-timeline');
        const list = document.getElementById('order-status-list');
        if (!wrap || !list) return;
        wrap.style.display = 'block';
        list.querySelectorAll('.status-entry').forEach(el => el.classList.add('status-entry-dimmed'));
        const entry = document.createElement('div');
        entry.className = 'status-entry';
        entry.innerHTML = `<span class="status-entry-check"><i class="fas fa-circle-notch fa-spin"></i></span> <span>${text}</span>`;
        list.appendChild(entry);
        // إيقاف الدوران بعد لحظة (تأثير "جاري التنفيذ" قصير فقط للمرحلة الجديدة)
        setTimeout(() => {
            const icon = entry.querySelector('.status-entry-check i');
            if (icon) icon.className = 'fas fa-check-circle';
        }, 900);
    }
    // تعديل: متغير للـ polling الاحتياطي في حال الـ Realtime لم يشتغل
    let _clientMsgPollInterval = null;

    let _isConsultChatOpen = false;

    // [FEATURE-CONSULT-REDESIGN] شاشة قرار الأدوية المقترحة — منفصلة تماماً عن نظام الدردشة القديم
    // وعن نظام nav() الرئيسي، لتفادي أي تعارض مع أنواع الطلبات الأخرى المشتركة بنفس الشاشات
    let _medDecisionChannel = null;
    async function openMedicationDecisionScreen(order) {
        currentOrderKey = order.id;
        localStorage.setItem('shahen_active_order_id', order.id);
        document.getElementById('eagle-searching').style.display = 'none';
        document.getElementById('eagle-consulting').style.display = 'none';
        try { document.getElementById('searching-sound').pause(); } catch(e) {}

        let meds = [];
        try { meds = typeof order.suggested_medications === 'string' ? JSON.parse(order.suggested_medications) : (order.suggested_medications || []); } catch(e) { meds = []; }
        const total = meds.reduce((s, m) => s + ((m.price||0) * (m.quantity||1)), 0);

        const overlay = document.createElement('div');
        overlay.id = 'med-decision-overlay';
        overlay.style.cssText = 'position:fixed; inset:0; max-width:480px; margin:0 auto; background:#0d0221; z-index:9998; display:flex; flex-direction:column; overflow-y:auto; padding:16px;';
        overlay.innerHTML = `
            <div style="text-align:center; margin-bottom:16px;">
                <i class="fas fa-prescription-bottle-medical" style="font-size:32px; color:var(--gold); margin-bottom:8px; display:block;"></i>
                <h3 style="color:var(--gold); margin:0;">الأدوية المقترحة من الصيدلي</h3>
                <p style="font-size:11px; color:#aaa; margin:6px 0 0;">راجع القائمة وقرر: تطلبها أو تنهي الاستشارة بدون طلب</p>
            </div>
            <div style="flex:1;">
                ${meds.map(m => `
                    <div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:12px; margin-bottom:8px;">
                        <div style="display:flex; justify-content:space-between;"><b style="font-size:13px;">${escHtml(m.name)}</b><span style="color:var(--gold); font-size:13px;">${(m.price*m.quantity).toLocaleString()} ل.س</span></div>
                        <div style="font-size:10px; color:#aaa; margin-top:4px;">الكمية: ${m.quantity} ${m.note ? '• ' + escHtml(m.note) : ''}</div>
                    </div>`).join('') || '<p style="text-align:center; color:#888; font-size:12px;">لم يقترح الصيدلي أي أدوية</p>'}
                ${order.consultation_notes ? `<div style="background:rgba(212,175,55,0.08); border:1px solid var(--gold); border-radius:12px; padding:12px; margin-top:10px; font-size:12px;"><b style="color:var(--gold);">ملاحظات الصيدلي:</b><br>${escHtml(order.consultation_notes)}</div>` : ''}
            </div>
            <div style="background:var(--glass); border-radius:12px; padding:14px; text-align:center; margin:14px 0;">
                <span style="font-size:12px; color:#aaa;">الإجمالي</span><br>
                <b style="font-size:22px; color:var(--gold);">${total.toLocaleString()} ل.س</b>
            </div>
            <div style="display:flex; gap:10px;">
                <button onclick="_declineMedications('${order.id}')" style="flex:1; padding:14px; background:rgba(231,76,60,0.15); color:#e74c3c; border:1px solid #e74c3c; border-radius:12px; font-weight:bold; cursor:pointer;">لا أريد الطلب</button>
                <button onclick="_acceptMedications('${order.id}')" style="flex:2; padding:14px; background:var(--gold); color:#000; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">أوافق وأطلب الآن 🚀</button>
            </div>`;
        document.body.appendChild(overlay);

        // تتبّع لحظي: لو انتهى الطلب من مكان آخر (مثلاً استخدم العميل جهازاً ثانياً)
        if (_medDecisionChannel) { try { _supabase.removeChannel(_medDecisionChannel); } catch(e){} }
        _medDecisionChannel = _supabase.channel('med_decision_' + order.id)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: 'id=eq.' + order.id }, (payload) => {
                if (payload.new && payload.new.customer_med_decision) closeMedicationDecisionScreen();
            }).subscribe();
    }

    function closeMedicationDecisionScreen() {
        if (_medDecisionChannel) { try { _supabase.removeChannel(_medDecisionChannel); } catch(e){} _medDecisionChannel = null; }
        const overlay = document.getElementById('med-decision-overlay');
        if (overlay) overlay.remove();
    }

    // [FEATURE-CONSULT-REDESIGN] قبول الأدوية — يُعيد استخدام نفس حالة 'searching' الموجودة أصلاً
    // بالنظام (نفس آلية توزيع الطلبات على المناديب الحالية)، فلا يُنشئ أي منطق طلب جديد إطلاقاً
    async function _acceptMedications(orderId) {
        let meds = [];
        try {
            const { data: ord } = await _supabase.from('sh_public_orders').select('suggested_medications').eq('id', orderId).single();
            meds = typeof ord.suggested_medications === 'string' ? JSON.parse(ord.suggested_medications) : (ord.suggested_medications || []);
        } catch(e) {}
        const total = meds.reduce((s, m) => s + ((m.price||0) * (m.quantity||1)), 0);
        const itemsJson = JSON.stringify(meds.map(m => ({ n: m.name, p: m.price, q: m.quantity })));

        const { error } = await _supabase.from('sh_public_orders').update({
            customer_med_decision: 'ordered',
            // [FIX-DRIVER-VISIBILITY] كان الطلب يبقى معلَّماً كـ"استشارة" حتى بعد تحوّله لطلب فعلي —
            // فلتر تطبيق المندوب الحالي يستبعد أي طلب بهذه العلامة تلقائياً، فما يظهر له إطلاقاً
            is_consultation: false,
            items: itemsJson,
            order_price: total,
            status: 'searching' // نفس حالة البحث عن مندوب المستخدمة أصلاً بكل مسارات الطلب
        }).eq('id', orderId);

        if (error) { showNotify('⚠️ تعذّر تأكيد الطلب: ' + error.message, 'error'); return; }
        closeMedicationDecisionScreen();
        showNotify('✅ تم تأكيد طلبك، جاري البحث عن مندوب 🦅', 'success');
        // [FEATURE-CONSULT-REDESIGN] إشعار الصيدلية بتأكيد العميل للطلب
        try {
            const { data: ordRow } = await _supabase.from('sh_public_orders').select('pharmacy_id, customer_name').eq('id', orderId).maybeSingle();
            if (ordRow && ordRow.pharmacy_id) {
                await _supabase.from('notifications').insert([{
                    user_id: ordRow.pharmacy_id,
                    message: `✅ وافق العميل ${ordRow.customer_name || ''} على طلب الأدوية المقترحة — تم إرسال الطلب للمندوب`,
                    type: 'med_order_confirmed',
                    created_at: new Date().toISOString()
                }]);
            }
        } catch(e) {}
        startSearching();
    }

    async function _declineMedications(orderId) {
        if (!confirm('هل أنت متأكد من إنهاء الاستشارة بدون طلب الأدوية؟')) return;
        const { error } = await _supabase.from('sh_public_orders').update({
            customer_med_decision: 'declined',
            status: 'completed'
        }).eq('id', orderId);
        if (error) { showNotify('⚠️ خطأ: ' + error.message, 'error'); return; }
        closeMedicationDecisionScreen();
        localStorage.removeItem('shahen_active_order_id');
        currentOrderKey = null;
        showNotify('تم إنهاء الاستشارة', 'info');
        nav('p-home');
    }

    // [FIX-VERIFY-CODE-PREMATURE] شاشة انتظار بسيطة للاستشارة الصيدلانية — بدون كود تحقق إطلاقاً،
    // تبقى ظاهرة لحد ما الصيدلي يقترح الأدوية فعلياً (عندها تنتقل تلقائياً لشاشة القرار)
    let _pharmWaitChannel = null;
    function _showPharmacyWaitingScreen(order) {
        currentOrderKey = order.id;
        localStorage.setItem('shahen_active_order_id', order.id);
        document.getElementById('eagle-searching').style.display = 'none';
        try { document.getElementById('searching-sound').pause(); } catch(e) {}
        document.getElementById('eagle-consulting').style.display = 'flex';
        const pharmName = order.restaurant_name || order.target_pharmacy || 'الصيدلية';
        document.getElementById('consulting-status-text').style.whiteSpace = 'pre-line';
        document.getElementById('consulting-status-text').innerText = `🏥 ${pharmName}\nبانتظار ردّ الصيدلية...`;

        if (_pharmWaitChannel) { try { _supabase.removeChannel(_pharmWaitChannel); } catch(e){} }
        console.log('[CALL-DEBUG] _showPharmacyWaitingScreen — consultation_type:', order.consultation_type);
        _pharmWaitChannel = _supabase.channel('pharm_wait_' + order.id)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: 'id=eq.' + order.id }, (payload) => {
                if (payload.new && payload.new.suggested_medications) {
                    try { _supabase.removeChannel(_pharmWaitChannel); } catch(e){}
                    document.getElementById('eagle-consulting').style.display = 'none';
                    openMedicationDecisionScreen(payload.new);
                } else if (payload.new && payload.new.status === 'cancelled') {
                    try { _supabase.removeChannel(_pharmWaitChannel); } catch(e){}
                    document.getElementById('eagle-consulting').style.display = 'none';
                    showNotify('تم إلغاء الاستشارة', 'error');
                    localStorage.removeItem('shahen_active_order_id');
                    currentOrderKey = null;
                    nav('p-home');
                }
            }).subscribe();

        // [FEATURE-VOICE-REDESIGN] لو الاستشارة صوتية، نتأكد الاستماع لمكالمة الصيدلي فعّال (احتياطي
        // لحالات إعادة تحميل الصفحة، بما إنه الاستماع الأساسي يبدأ وقت الإرسال مباشرة)
        if (order.consultation_type === 'voice') {
            _listenForPharmacyCall(order.id);
        }
    }

    // [FEATURE-VOICE-REDESIGN] الصيدلي هو من يبدأ الاتصال فور القبول، العميل ينضم تلقائياً
    let _voiceSignalChannel = null;
    let _customerPeerConnection = null;
    let _customerLocalStream = null;
    function _listenForPharmacyCall(orderId) {
        if (_voiceSignalChannel) { try { _supabase.removeChannel(_voiceSignalChannel); } catch(e){} }
        _voiceSignalChannel = _supabase.channel('voice_signal_' + orderId)
            .on('broadcast', { event: 'offer' }, ({ payload }) => {
                if (payload.from !== 'pharmacy') return;
                _autoJoinPharmacyCall(orderId, payload.offer);
            })
            .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
                if (payload.from !== 'pharmacy' || !_customerPeerConnection) return;
                try { await _customerPeerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate)); } catch(e) {}
            })
            .subscribe();
    }

    // [FEATURE-VOICE-REDESIGN] انضمام تلقائي فوري للمكالمة فور وصول اتصال الصيدلي — بدون أي زر
    async function _autoJoinPharmacyCall(orderId, offer) {
        if (document.getElementById('active-call-box')) return; // مكالمة مفتوحة أصلاً
        try {
            _customerLocalStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch(e) {
            showNotify('⚠️ يرجى السماح باستخدام الميكروفون للرد على مكالمة الصيدلية', 'error');
            return;
        }
        try { document.getElementById('searching-sound').pause(); } catch(e) {}
        document.getElementById('eagle-consulting').style.display = 'none';

        _customerPeerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]
        });
        _customerLocalStream.getTracks().forEach(t => _customerPeerConnection.addTrack(t, _customerLocalStream));
        _customerPeerConnection.onicecandidate = (event) => {
            if (event.candidate) _voiceSignalChannel.send({ type: 'broadcast', event: 'ice-candidate', payload: { candidate: event.candidate, from: 'customer' } });
        };

        const callBox = document.createElement('div');
        callBox.id = 'active-call-box';
        callBox.style.cssText = 'position:fixed; inset:0; max-width:480px; margin:0 auto; background:#0d0221; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center;';
        callBox.innerHTML = `
            <i class="fas fa-comment-medical" style="font-size:40px; color:var(--gold); margin-bottom:16px;"></i>
            <div style="color:var(--gold); font-size:16px; margin-bottom:12px;">🟢 المكالمة جارية مع الصيدلية</div>
            <div style="background:rgba(231,76,60,0.1); border:1px solid #e74c3c; border-radius:10px; padding:8px 14px; margin-bottom:20px; font-size:10px; color:#e74c3c; max-width:280px; text-align:center;">
                <i class="fas fa-circle" style="font-size:6px;"></i> هذه المكالمة مسجَّلة لدى شركة شاهين إكسبريس لأغراض الجودة والسلامة
            </div>
            <audio id="customer-remote-audio" autoplay></audio>
            <button onclick="_hangupCall('${orderId}')" style="width:60px; height:60px; border-radius:50%; background:#e74c3c; border:none; color:#fff; font-size:20px; margin-top:10px;"><i class="fas fa-phone-slash"></i></button>`;
        document.body.appendChild(callBox);

        _customerPeerConnection.ontrack = (event) => {
            const _custAudioEl = document.getElementById('customer-remote-audio');
            _custAudioEl.srcObject = event.streams[0];
            // [FIX-NO-AUDIO] بعض المتصفحات تمنع تشغيل الصوت تلقائياً حتى لو الاتصال نجح — نجبر
            // التشغيل صراحة، ونطلب من العميل التفاعل يدوياً لو استمر المنع
            _custAudioEl.play().catch(() => {
                showNotify('⚠️ اضغط على الشاشة لتفعيل صوت المكالمة', 'error');
                document.addEventListener('click', () => _custAudioEl.play().catch(()=>{}), { once: true });
            });
        };

        await _customerPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await _customerPeerConnection.createAnswer();
        await _customerPeerConnection.setLocalDescription(answer);
        _voiceSignalChannel.send({ type: 'broadcast', event: 'answer', payload: { answer, from: 'customer' } });
    }

    function _hangupCall(orderId) {
        if (_customerPeerConnection) { _customerPeerConnection.close(); _customerPeerConnection = null; }
        if (_customerLocalStream) { _customerLocalStream.getTracks().forEach(t => t.stop()); _customerLocalStream = null; }
        const callBox = document.getElementById('active-call-box');
        if (callBox) callBox.remove();
    }

    async function openPharmacyConsultChat(order) {
        if (!order) return;
        // [FEATURE-CONSULT-REDESIGN] فرع منعزل للاستشارة الصيدلانية الجديدة — يُطبَّق فقط أثناء
        // مرحلة الاستشارة الفعلية (قبل قرار العميل)، لا بعدها. بمجرد ما العميل يؤكّد الطلب
        // (customer_med_decision = 'ordered')، يسقط هذا الفرع تماماً ويكمل الطلب بنفس المسار
        // العادي المشترك مع كل أنواع الطلبات (كود تحقق، تتبّع، بيانات المندوب...) بدون أي تدخّل هنا
        const _isPharmacyType = order.order_type === 'pharmacy' || order.res_type === 'pharmacy' || order.pharmacy_id || order.target_pharmacy;
        if (_isPharmacyType && !order.customer_med_decision) {
            if (order.suggested_medications) {
                return openMedicationDecisionScreen(order);
            }
            // [FIX-VERIFY-CODE-PREMATURE] الصيدلي فتح/قبل الاستشارة لكن لم يقترح أدوية بعد — نبقى
            // على شاشة انتظار بسيطة (اسم الصيدلية + "بانتظار رد الصيدلية") بدون كود تحقق إطلاقاً،
            // بدل الانتقال للشاشة القديمة الكاملة اللي تعرض الكود (غير مناسب بهذه المرحلة)
            return _showPharmacyWaitingScreen(order);
        }
        if (_isConsultChatOpen && String(order.id) === String(currentOrderKey)) {
            // إذا الدردشة مفتوحة بالفعل لنفس الطلب، نتأكد فقط من عرض الصفحة
            if (document.getElementById('p-chat').style.display !== 'flex') {
                nav('p-chat');
            }
            return;
        }
        _isConsultChatOpen = true;
        if (cancelInterval) clearInterval(cancelInterval);
        document.getElementById('eagle-searching').style.display = 'none';
        document.getElementById('eagle-consulting').style.display = 'none';
        document.getElementById('searching-sound').pause();

        // إعادة ضبط حارس الاستدعاء المزدوج لأن هذا طلب جديد أو مختلف
        if (String(order.id) !== String(currentOrderKey)) {
            _isConsultChatOpen = false;
        }

        currentOrderKey = order.id;
        localStorage.setItem('shahen_active_order_id', order.id);
        if (order.verify_code) verificationCode = order.verify_code;
        updateOrderStatus(order.id, order.status || 'consulting');

        // ===== مسح الفواتير القديمة عند فتح محادثة جديدة لمنع التعارض =====
        _clearAndResetInvoiceInput();

        nav('p-chat');
        _consultMsgIds.clear();
        document.getElementById('chat-input-area').style.display = 'flex';
        // ===== إصلاح 3: كود التحقق يبقى ظاهراً دائماً - لا نخفيه في الاستشارة =====
        document.getElementById('reveal-order-code').innerText = verificationCode || '----';
        // لا نخفي client-code-notice هنا: document.getElementById('client-code-notice').style.display = 'none';
        document.getElementById('restaurant-notif-area').style.display = 'none';
        document.getElementById('driver-chat-phone').innerText = '';
        document.getElementById('call-driver-btn').onclick = null;

        const storeName = order.restaurant_name || order.target_pharmacy || 'المتجر';
        // الأولوية لـ order_type الثابت في قاعدة البيانات ثم res_type كاحتياط
        const isPharmacy = order.order_type === 'pharmacy' || order.res_type === 'pharmacy' || order.pharmacy_id || order.target_pharmacy;
        
        let typePrefix = "🛒 متجر: ";
        if(isPharmacy) typePrefix = "🏥 صيدلية: ";
        else if(order.res_type === 'specialty' || order.res_type === 'store') {
            const _sType = order.specialty_type || '';
            if(_sType === 'flowers') typePrefix = "🌸 ورود: ";
            else if(_sType === 'sweets') typePrefix = "🍬 حلويات: ";
            else if(_sType === 'gifts') typePrefix = "🎁 هدايا: ";
            else typePrefix = "🛍️ متجر: ";
        }
        else if(order.res_type === 'flowers') typePrefix = "🌸 ورود: ";
        else if(order.res_type === 'sweets') typePrefix = "🍬 حلويات: ";
        else if(order.res_type === 'restaurant') typePrefix = "🍔 مطعم: ";

        document.getElementById('driver-chat-name').innerText = typePrefix + storeName;

        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';

        let { data: oldMsgs } = await _supabase
            .from('sh_messages')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: true });
        oldMsgs = _stripStatusMsgs(oldMsgs);

        if (oldMsgs && oldMsgs.length > 0) {
            oldMsgs.forEach(m => {
                _consultMsgIds.add(m.id);
                const isInvoice = m.message && (m.message.includes('فاتورة') || m.message.includes('invoice') || m.message.includes('💊') || m.message.includes('إجمالي') || m.message.includes('السعر'));
                const msgType = (m.sender !== 'client' && isInvoice) ? 'pharmacy_invoice' : (m.sender !== 'client' ? 'pharmacy_new' : null);
                _appendConsultMsg(m.message, m.sender === 'client' ? 'out' : 'in', msgType);
            });
            // ===== تعبئة المبلغ تلقائياً من رسائل الصيدلي السابقة =====
            _prefillInvoiceFromHistory(order.id);
        }

        const upgradeDiv = document.createElement('div');
        upgradeDiv.id = 'consult-upgrade-box';
        upgradeDiv.className = 'card';
        upgradeDiv.style.cssText = 'margin: 10px; text-align:center; border:1.5px solid var(--gold); background:rgba(212,175,55,0.1); padding:10px; position: sticky; top: 0; z-index: 100; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';

        // تحديد حالة الطلب الحالية لإخفاء/إظهار الأزرار المناسبة
        const _orderStatus = String(order.status || 'consulting');
        const _hasDriver = !!(order.driver_id || order.driver_name);
        // إذا استلم المندوب الطلب (accepted/preparing/ready وعنده driver)، نخفي أزرار البحث والتحويل والإلغاء
        const _driverAccepted = _hasDriver && (_orderStatus === 'accepted' || _orderStatus === 'preparing' || _orderStatus === 'ready');

        if (_driverAccepted) {
            // المندوب استلم الطلب - لا نعرض أي أزرار تحكم، فقط كود التحقق
            // إخفاء كود التحقق إذا اكتمل طلب الصيدلية
            const _showVerifyCode = (_orderStatus !== 'completed') && (_orderStatus !== 'completed_consultation');
            upgradeDiv.innerHTML = `
                <p style="font-size:10px; color:var(--gold); margin-bottom:5px; font-weight:bold;">
                    🚀 الصقر في الطريق إليك، انتظر وصوله!
                </p>
                ${_showVerifyCode ? `<p style="font-size:9px; color:#ccc; margin:0;">كود التحقق: <b style="color:var(--gold); font-size:13px; letter-spacing:3px;">${verificationCode || order.verify_code || '----'}</b></p>` : ''}
            `;
        } else if (_orderStatus === 'searching' || _orderStatus === 'awaiting_driver') {
            // جاري البحث عن مندوب - لا نعرض أزرار التحويل
            upgradeDiv.innerHTML = `
                <p style="font-size:10px; color:var(--gold); margin-bottom:5px; font-weight:bold;">
                    🔍 جاري البحث عن صقر لاستلام طلبك...
                </p>
            `;
        } else {
            // حالة الاستشارة الأولية - نعرض أزرار التحويل والإلغاء
            if (isPharmacy) {
                upgradeDiv.innerHTML = `
                    <p style="font-size:10px; color:var(--gold); margin-bottom:5px; font-weight:bold;">
                        عند الانتهاء من الاستشارة، أدخل مبلغ فاتورة الصيدلية ثم أرسل للمناديب 🏥
                    </p>
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                        <input type="number" id="pharmacy-invoice-input" placeholder="يُعبَّأ تلقائياً من فاتورة الصيدلية..." min="0"
                            style="flex:1; background:#000; border:1px solid #3498db; color:#fff; padding:8px; border-radius:10px; font-size:12px; margin:0; outline:none;" title="يتم تعبئة هذا الحقل تلقائياً عند استلام فاتورة الصيدلي">
                        <span style="color:#a8c8ff; font-size:11px; white-space:nowrap;">ل.س</span>
                    </div>
                    <p style="font-size:9px; color:#2ecc71; margin:0 0 6px 0; text-align:right;">✅ يُعبَّأ تلقائياً عند إرسال الصيدلي للفاتورة</p>
                    <button class="btn-gold" style="padding: 8px; font-size: 11px; background:#3498db;" onclick="upgradeToDelivery()">&#x1F680; إرسال الطلب للمناديب</button>
                    <button class="btn-gold" style="padding: 8px; font-size: 10px; background:#e74c3c; color:#fff; margin-top:6px;" onclick="cancelConsultationByClient()">&#x274C; إلغاء الاستشارة</button>
                `;
            } else {
                upgradeDiv.innerHTML = `
                    <p style="font-size:10px; color:var(--gold); margin-bottom:5px; font-weight:bold;">
                        اطلب من المندوب استلام طلبك الآن 🦅
                    </p>
                    <button class="btn-gold" style="padding: 8px; font-size: 11px;" onclick="upgradeToDelivery()">&#x1F680; إرسال الطلب للمناديب</button>
                    <button class="btn-gold" style="padding: 8px; font-size: 10px; background:#e74c3c; color:#fff; margin-top:6px;" onclick="cancelConsultationByClient()">&#x274C; إلغاء الاستشارة</button>
                `;
            }
        }
        chatBox.appendChild(upgradeDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (_consultChatChannel) _supabase.removeChannel(_consultChatChannel);
        // تعديل: إزالة الـ filter من الـ channel لتجاوز مشكلة Realtime غير المفعّل، والمقارنة تصير في الكود
        _consultChatChannel = _supabase.channel('client_consult_' + order.id)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'sh_messages'
            }, payload => {
                const m = payload.new;
                // تعديل: مقارنة order_id بعد تحويل النوعين لنص لضمان التطابق
                if (String(m.order_id) !== String(order.id)) return;
                if (_consultMsgIds.has(m.id)) return;
                _consultMsgIds.add(m.id);
                // [FIX-HIDE-STATUS-MSG-CONSULT] حجب رسائل الحالة هنا أيضاً — هذا المسار لم يكن يفلترها إطلاقاً
                if (m.message && m.message.includes(_STATUS_TAG)) { return; }
                if (m.sender !== 'client') {
                    const isInvoice = m.message && (m.message.includes('فاتورة') || m.message.includes('invoice') || m.message.includes('💊') || m.message.includes('إجمالي') || m.message.includes('السعر'));
                    const msgType = isInvoice ? 'pharmacy_invoice' : 'pharmacy_new';
                    _appendConsultMsg(m.message, 'in', msgType);
                    chatBox.scrollTop = chatBox.scrollHeight;
                    showNotify("رسالة جديدة من " + (isPharmacy ? "الصيدلية" : "المتجر") + " 💬", "info");
                    // ===== تعبئة مبلغ الفاتورة تلقائياً عند وصول رسالة جديدة من الصيدلي =====
                    _autoFillInvoiceFromMessage(m.message);
                }
            })
            .subscribe((status, err) => {
                // [FIX-CHAT-3b] إعادة الاتصال عند انقطاع قناة استشارة العميل
                if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                    if (currentOrderKey) {
                        setTimeout(() => {
                            if (_consultChatChannel) { try { _supabase.removeChannel(_consultChatChannel); } catch(e){} _consultChatChannel = null; }
                            listenConsultStatusOnly(currentOrderKey);
                        }, 3000);
                    }
                }
            });

        // تعديل: polling احتياطي كل 3 ثواني لضمان وصول رسائل الصيدلي حتى لو الـ Realtime لم يشتغل
        if (_clientMsgPollInterval) clearInterval(_clientMsgPollInterval);
        const _pollOrderId = order.id;
        _clientMsgPollInterval = setInterval(async () => {
            // [FIX-ORDER-MIX] نفس الإصلاح لدردشة استشارة الصيدلية
            if (!currentOrderKey || String(currentOrderKey) !== String(_pollOrderId)) { clearInterval(_clientMsgPollInterval); return; }
            const { data: pollMsgsRaw1 } = await _supabase.from('sh_messages').select('*').eq('order_id', _pollOrderId).order('created_at', { ascending: true });
            const pollMsgs = _stripStatusMsgs(pollMsgsRaw1);
            if (pollMsgs) {
                let hasNew = false;
                pollMsgs.forEach(m => {
                    if (_consultMsgIds.has(m.id)) return;
                    _consultMsgIds.add(m.id);
                    if (m.sender !== 'client') {
                        const isInvoice = m.message && (m.message.includes('فاتورة') || m.message.includes('invoice') || m.message.includes('💊') || m.message.includes('إجمالي') || m.message.includes('السعر'));
                        const msgType = isInvoice ? 'pharmacy_invoice' : 'pharmacy_new';
                        _appendConsultMsg(m.message, 'in', msgType);
                        showNotify("رسالة جديدة من " + (isPharmacy ? "الصيدلية" : "المتجر") + " 💬", "info");
                        // ===== تعبئة مبلغ الفاتورة تلقائياً عند وصول رسالة جديدة من الصيدلي =====
                        _autoFillInvoiceFromMessage(m.message);
                        hasNew = true;
                    }
                });
                if (hasNew) chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 4000); // [FIX-POLL-4b] تقليل polling من 8 لـ 4 ثواني

        // --- مهم: لا نستدعي simulateAccept() هنا أبداً في مرحلة الاستشارة ---
        // --- simulateAccept() يُستدعى فقط من upgradeToDelivery() بعد موافقة العميل ---
        listenConsultStatusOnly(order.id);
    }

    // إصلاح 3: دالة إلغاء الاستشارة من العميل
    async function cancelConsultationByClient() {
        if (!currentOrderKey) return showNotify("لا يوجد طلب نشط", "error");
        if (!confirm("هل أنت متأكد من إلغاء الاستشارة؟")) return;
        // [FIX-RECORDS-2] طلب سبب الإلغاء (اختياري) ليظهر في سجلات الإدارة
        let _consultCancelReason = null;
        try { _consultCancelReason = prompt('سبب الإلغاء (اختياري) — اتركه فارغاً للتخطي:'); } catch(e) {}
        const _consultCancelPayload = { status: 'cancelled' };
        if (_consultCancelReason && _consultCancelReason.trim()) _consultCancelPayload.cancel_reason = _consultCancelReason.trim();
        const { error } = await _supabase.from('sh_public_orders').update(_consultCancelPayload).eq('id', currentOrderKey);
        if (!error) {
            // تحديث السجل المحلي
            let orders = getStorage('orders');
            orders = orders.map(o => String(o.id) === String(currentOrderKey) ? {...o, status: 'cancelled'} : o);
            setStorage('orders', orders);
            localStorage.removeItem('shahen_active_order_id');
            // [CANCEL-FIX] إغلاق جميع القنوات وتنظيف شامل
            if (_consultChatChannel) { try { _supabase.removeChannel(_consultChatChannel); } catch(e){} _consultChatChannel = null; }
            if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
            if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
            if (_spChatChannel) { try { _supabase.removeChannel(_spChatChannel); } catch(e){} _spChatChannel = null; }
            if (_clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
            if (_searchPollInterval) { clearInterval(_searchPollInterval); _searchPollInterval = null; }
            if (_spPollInterval) { clearInterval(_spPollInterval); _spPollInterval = null; }
            _isConsultChatOpen = false;
            currentOrderKey = null;
            // [CANCEL-FIX] إعادة تهيئة قناة الإشعارات لضمان استمرار الاتصال بعد الإلغاء
            setTimeout(() => {
                try { initRealtimeNotifications(); } catch(_e) {}
            }, 500);
            showNotify("تم إلغاء الاستشارة ❌", "error");
            nav('p-home');
        } else {
            showNotify("فشل الإلغاء: " + error.message, "error");
        }
    }

    function _appendConsultMsg(text, direction, msgType) {
        const chatBox = document.getElementById('chat-box');
        const d = document.createElement('div');
        d.className = `chat-msg chat-${direction}`;
        // إذا كانت الرسالة فاتورة أو من صيدلية، نضيف لون أزرق مميز
        if (direction === 'in' && msgType === 'pharmacy_invoice') {
            d.className += ' pharmacy-invoice-msg';
            d.style.color = '#fff';
        } else if (direction === 'in' && msgType === 'pharmacy_new') {
            d.className += ' chat-in-pharmacy-new';
            d.style.color = '#fff';
        }
        d.innerText = text;
        chatBox.appendChild(d);
    }

    // --- دالة الاستماع للاستشارة فقط بدون تشغيل منطق المندوبين ---
    // --- هذه الدالة تراقب تغيير الحالة في جدول sh_public_orders للاستشارة فقط ---
    // --- لا تُطلق أي حدث يتعلق بالمندوبين أو البحث عن سائق ---
    let _consultStatusChannel = null;
    function listenConsultStatusOnly(orderId) {
        if (_consultStatusChannel) _supabase.removeChannel(_consultStatusChannel);
        _consultStatusChannel = _supabase.channel('consult_status_only_' + orderId)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'sh_public_orders',
                filter: `id=eq.${orderId}`
            }, async payload => {
                const s = payload.new.status;
                // إذا الصيدلية قبلت الاستشارة فقط - نُظهر إشعاراً للعميل
                if (s === 'consulting' || s === 'accepted') {
                    if (s === 'accepted') {
                        showNotify("تم قبول طلبك، يمكنك التحدث الآن ✅", "info");
                        // عند القبول يتم فتح الدردشة فوراً وإخفاء شاشة التحميل المخصصة
                        document.getElementById('eagle-consulting').style.display = 'none';
                        // --- تعديل: جلب بيانات الطلب الكاملة من السيرفر لضمان توفر جميع الحقول ---
                        const { data: fullOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', orderId).single();
                        openPharmacyConsultChat(fullOrder || payload.new);
                    }
                    // لا نفعل شيئاً يتعلق بالمندوبين هنا
                    return;
                }
                // اكتملت الاستشارة - وصلت الفاتورة من المتجر/الصيدلية
                // store_invoice_sent: فاتورة المتجر وصلت — العميل يقرر إرسالها للمندوب
                // completed_consultation: فاتورة الصيدلية (النظام القديم)
                if (s === 'store_invoice_sent' || s === 'completed_consultation') {
                    document.getElementById('eagle-consulting').style.display = 'none';
                    document.getElementById('searching-sound').pause();
                    const { data: invoiceOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', orderId).single();
                    showNotify('وصلت الفاتورة من ' + (invoiceOrder ? invoiceOrder.restaurant_name : 'المتجر') + ' 🧾 اضغط إرسال للمناديب', 'info');
                    if (invoiceOrder) {
                        // الأولوية لـ order_type الثابت في قاعدة البيانات — ثم res_type — لا تخمين أبداً
                        const _orderTypeFinal = invoiceOrder.order_type || invoiceOrder.res_type || 'pharmacy';
                        const _isSpecialty = _orderTypeFinal === 'specialty';
                        if (_isSpecialty && document.getElementById('specialty-chat-screen') && document.getElementById('specialty-chat-screen').style.display === 'flex') {
                            // الدردشة مفتوحة بالفعل — نحدّث المبلغ فقط من order_price
                            if (invoiceOrder.order_price > 0) {
                                _spAgreedAmount = invoiceOrder.order_price;
                                document.getElementById('sp-agreed-amount').innerText = invoiceOrder.order_price.toLocaleString() + ' ل.س';
                                document.getElementById('sp-dispatch-area').style.display = 'block';
                                const _wn = document.getElementById('sp-waiting-invoice-notice');
                                if (_wn) _wn.style.display = 'none';
                            }
                        } else {
                            // الدردشة مغلقة — نفتح المناسبة
                            if (_isSpecialty) {
                                openSpecialtyChat(invoiceOrder.id, invoiceOrder.restaurant_name, invoiceOrder.specialty_type || invoiceOrder.res_type);
                            } else {
                                openPharmacyConsultChat(invoiceOrder);
                            }
                        }
                    }
                    return;
                }
                // إذا الطلب أُلغي
                if (s === 'cancelled') {
                    showNotify("تم إلغاء الاستشارة ❌", "error");
                    // حفظ الطلب في السابقة قبل تصفير المفتاح
                    const _cancelId = orderId;
                    let _cOrders = getStorage('orders');
                    const _cExists = _cOrders.find(o => String(o.id) === String(_cancelId));
                    if (_cExists) {
                        _cOrders = _cOrders.map(o => String(o.id) === String(_cancelId) ? {...o, status: 'cancelled'} : o);
                    } else {
                        _cOrders.push({ id: _cancelId, status: 'cancelled', restaurant_name: payload.new.restaurant_name || 'طلب', total: payload.new.total || 0, delivery_price: payload.new.delivery_price || 0, res_type: payload.new.res_type || 'pharmacy', date: new Date().toLocaleString('ar-SA'), points_earned: 0, points_spent: 0 });
                    }
                    setStorage('orders', _cOrders);
                    localStorage.removeItem('shahen_active_order_id');
                    currentOrderKey = null;
                    document.getElementById('eagle-consulting').style.display = 'none';
                    nav('p-home');
                    return;
                }
                // إذا تحولت الحالة لـ awaiting_driver أو searching
                // هذا يعني العميل ضغط زر الإرسال يدوياً من upgradeToDelivery أو upgradeSpecialtyToDelivery
                // لا نشغّل simulateAccept هنا لأن upgradeSpecialtyToDelivery تشغّله بنفسها
                // نكتفي بتحديث الواجهة فقط
                if (s === 'awaiting_driver' || s === 'searching') {
                    showNotify("جاري البحث عن صقر لاستلام طلبك 🦅");
                    return;
                }
            })
            .subscribe((status, err) => {
                // [FIX-CHAT-3c] إعادة الاتصال عند انقطاع قناة حالة الاستشارة
                if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                    const _retryId = orderId;
                    setTimeout(() => {
                        if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
                        if (currentOrderKey) listenConsultStatusOnly(_retryId);
                    }, 3000);
                }
            });
    }

    let _orderChannel = null;

    // ===== [FIX-LISTEN-1] listenForOrderUpdates: الدالة الرسمية للاستماع لتحديثات الطلب =====
    // كانت تُستدعى في 3 أماكن لكنها لم تكن معرّفة — هذا هو سبب عدم عمل التحديث بعد تسجيل الدخول وعند تعدد الطلبات
    function listenForOrderUpdates(orderId) {
        if (!orderId) return;
        // تنظيف القناة القديمة قبل إنشاء جديدة لمنع التعارض
        if (_orderChannel) {
            try { _supabase.removeChannel(_orderChannel); } catch(e) {}
            _orderChannel = null;
        }
        // تحديث currentOrderKey للتأكد من المزامنة
        if (currentOrderKey && String(currentOrderKey) !== String(orderId)) {
            // طلب مختلف عن الحالي — تحديث المفتاح
        }
        currentOrderKey = String(orderId);
        simulateAccept();
        // [FIX-MISSING-POLL] نفس الإصلاح — هذا المسار العام لم يكن يبدأ الاستطلاع الاحتياطي إطلاقاً
        _startSearchPoll(currentOrderKey);
    }
    // ===== نهاية [FIX-LISTEN-1] =====

    // ===== خامساً: منطق القنص - عند قبول مندوب للطلب يُخفى من واجهة المناديب الآخرين =====
    // يتم ذلك عبر حقل claimed_by_driver في sh_public_orders
    // المناديب الآخرون يقرؤون فقط الطلبات بحالة searching وبدون claimed_by_driver
    // عند القنص: status => accepted + claimed_by_driver => driver_id
    // هذا يمنع المناديب الآخرين من رؤيته أو قنصه

    function simulateAccept() {
        // الحماية: لا نبدأ البحث عن مندوب إذا كان الطلب لا يزال استشارة نشطة
        // الشرط: res_type صيدلية + الحالة consulting أو accepted + is_consultation لم يُلغَ بعد
        const currentOrders = getStorage('orders');
        const activeOrder = currentOrders.find(o => String(o.id) === String(currentOrderKey));
        if (activeOrder && 
            activeOrder.is_consultation !== false &&
            (activeOrder.res_type === 'pharmacy' || activeOrder.res_type === 'specialty') && 
            (activeOrder.status === 'consulting' || activeOrder.status === 'accepted')) {
            // [FIX-SEC-2d] console.warn محذوف في الإنتاج
            return;
        }

        // [FIX-RACE-1] تنظيف polling القديم لمنع تعارض الطلبات المتتالية
        if (_searchPollInterval) { clearInterval(_searchPollInterval); _searchPollInterval = null; }

        if (_orderChannel) {
            _supabase.removeChannel(_orderChannel);
            _orderChannel = null;
        }

        _orderChannel = _supabase.channel('order_watch_' + currentOrderKey)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: `id=eq.${currentOrderKey}` }, payload => {
                const s = payload.new.status;
                const restaurantNote = payload.new.restaurant_note;
                // [PROGRESS-TRACKER] تحديث الشريط فوراً مع كل تحديث للطلب (يشمل تغيّر مرحلة المندوب أيضاً)
                _updateProgressTracker(payload.new);

                if (s === 'cancelled') {
                    if(cancelInterval) clearInterval(cancelInterval);
                    document.getElementById('eagle-searching').style.display = 'none';
                    document.getElementById('eagle-consulting').style.display = 'none';
                    document.getElementById('searching-sound').pause();
                    showNotify("عذراً، تم إلغاء الطلب. ❌", "error");
                    localStorage.removeItem('shahen_active_order_id');
                    _isConsultChatOpen = false;
                    currentOrderKey = null;
                    updateOrderStatus(payload.new.id, 'cancelled');
                    // [MAPBOX-TRACK] إخفاء الزر وإغلاق صفحة التتبع إذا كانت مفتوحة
                    if (typeof window.closeDriverTrackingPage === 'function') window.closeDriverTrackingPage();
                    if (typeof window._refreshTrackButton === 'function') window._refreshTrackButton(null);
                    nav('p-home');
                    return;
                }

                if (s === 'consulting' && document.getElementById('p-chat').style.display !== 'flex') {
                    if(cancelInterval) clearInterval(cancelInterval);
                    document.getElementById('eagle-searching').style.display = 'none';
                    document.getElementById('eagle-consulting').style.display = 'none';
                    document.getElementById('searching-sound').pause();
                    showNotify("المتجر جاهز لاستشارتك.. تابع في الطلبات النشطة 🏥", "info");
                    return;
                }

                if (s === 'accepted' || s === 'preparing' || s === 'ready' || s === 'picked') {
                    if(cancelInterval) clearInterval(cancelInterval);
                    document.getElementById('eagle-searching').style.display = 'none';
                    document.getElementById('eagle-consulting').style.display = 'none';
                    document.getElementById('searching-sound').pause();
                    updateOrderStatus(currentOrderKey, s);
                    if(s !== lastStatusNotified) {
                        let msg = "تم قبول طلبك من قبل صقر الشاهين 🦅";
                        if(s === 'preparing') msg = "المطعم بدأ بتجهيز طلبك الآن 👨‍🍳";
                        if(s === 'ready')     msg = "طلبك جاهز وفي ذمة الصقر الآن 🦅";
                        if(s === 'picked')    msg = "الصقر استلم طلبك وهو في الطريق إليك 🛵";
                        showNotify(msg);
                        lastStatusNotified = s;
                    }
                    // [MAPBOX-TRACK] تحديث ظهور زر التتبع فوراً من بيانات التحديث اللحظي
                    if (typeof window._refreshTrackButton === 'function') window._refreshTrackButton(payload.new);
                    
                    // --- التعديل: استعادة صفحة التتبع فوراً عند تغير الحالة للسيرفر لضمان ظهور الكود ---
                    checkOrderAction(currentOrderKey, s);
                }

                if (s === 'completed') { 
                    // ===== إصلاح: نحفظ الـ ID قبل تصفير currentOrderKey لضمان حفظ البيانات =====
                    const _completedOrderId = currentOrderKey;
                    // نحفظ بيانات الطلب الكاملة من payload قبل أي تصفير
                    let _localOrders = getStorage('orders');
                    const _existsLocal = _localOrders.find(o => String(o.id) === String(_completedOrderId));
                    if (_existsLocal) {
                        // تحديث حالته وبياناته من السيرفر
                        _localOrders = _localOrders.map(o => {
                            if (String(o.id) === String(_completedOrderId)) {
                                return {
                                    ...o,
                                    status: 'completed',
                                    driver_name: payload.new.driver_name || o.driver_name,
                                    total: payload.new.total || o.total,
                                    delivery_price: payload.new.delivery_price || o.delivery_price,
                                    verify_code: payload.new.verify_code || o.verify_code,
                                    restaurant_note: payload.new.restaurant_note || o.restaurant_note,
                                    order_details: payload.new.order_details || o.order_details
                                };
                            }
                            return o;
                        });
                    } else {
                        // الطلب غير موجود محلياً — نضيفه من بيانات السيرفر
                        _localOrders.push({
                            id: _completedOrderId,
                            status: 'completed',
                            restaurant_name: payload.new.restaurant_name || 'طلب',
                            total: payload.new.total || 0,
                            delivery_price: payload.new.delivery_price || 0,
                            verify_code: payload.new.verify_code || '',
                            driver_name: payload.new.driver_name || '',
                            res_type: payload.new.res_type || '',
                            customer_id: payload.new.customer_id || '',
                            date: new Date(payload.new.created_at || Date.now()).toLocaleString('ar-SA'),
                            points_earned: 0,
                            points_spent: 0
                        });
                    }
                    setStorage('orders', _localOrders);
                    // تحديث النقاط — [SEC-FIX-ATOMIC-POINTS] عملية ذرّية داخل القاعدة
                    if (currentUser) {
                        const _ord = _localOrders.find(o => String(o.id) === String(_completedOrderId));
                        if (_ord) {
                            const _pointsDelta = (_ord.points_earned || 0) - (_ord.points_spent || 0);
                            _supabase.rpc('adjust_customer_points', { p_customer_id: currentUser.uid, p_delta: _pointsDelta }).then(({ data, error }) => {
                                if (!error && typeof data === 'number') {
                                    currentUser.points = data;
                                    localStorage.setItem('shahen_user', JSON.stringify(currentUser));
                                }
                            });
                        }
                    }
                    // الآن نصفّر المفتاح بأمان
                    localStorage.removeItem('shahen_active_order_id');
                    _isConsultChatOpen = false;
                    if (_clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
                    currentOrderKey = null;
                    // ===== FIX-RT-2: إشعار فوري وواضح بالتسليم =====
                    if (_searchPollInterval) { clearInterval(_searchPollInterval); _searchPollInterval = null; }
                    showNotify("✅ تم توصيل طلبك بنجاح! نوفي بعهدكم 🦅");
                    // إظهار إشعار تسليم بصري داخل صفحة الدردشة إذا كانت مفتوحة
                    const _chatBoxDelivery = document.getElementById('chat-box');
                    if (_chatBoxDelivery && document.getElementById('p-chat').style.display === 'flex') {
                        const _delivMsgDiv = document.createElement('div');
                        _delivMsgDiv.style.cssText = 'background:rgba(46,204,113,0.2);border:2px solid #2ecc71;border-radius:14px;padding:12px;text-align:center;margin:8px 0;';
                        _delivMsgDiv.innerHTML = '<i class="fas fa-check-circle" style="color:#2ecc71;font-size:20px;margin-bottom:6px;display:block;"></i><b style="color:#2ecc71;font-size:14px;">تم التوصيل بنجاح ✅</b><p style="font-size:11px;color:#ccc;margin:4px 0 0;">نوفي بعهدكم 🦅</p>';
                        _chatBoxDelivery.appendChild(_delivMsgDiv);
                        _chatBoxDelivery.scrollTop = _chatBoxDelivery.scrollHeight;
                    }
                    // تحديث اسم المندوب في نافذة التقييم
                    const _rateNameEl = document.getElementById('rate-driver-name');
                    if(_rateNameEl && payload.new.driver_name) {
                        _rateNameEl.innerText = payload.new.driver_name;
                    }
                    // إظهار نافذة تقييم المندوب لجميع الطلبات بما فيها الصيدلية
                    if (typeof window._refreshTrackButton === 'function') window._refreshTrackButton(null);
                    document.getElementById('rating-overlay').style.display = 'flex';
                }
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'sh_public_orders', filter: `id=eq.${currentOrderKey}` }, () => {
                showNotify("تم إنهاء الطلب أو أرشفته.", "info");
                localStorage.removeItem('shahen_active_order_id');
                currentOrderKey = null;
                renderHistory();
            })
            .subscribe((status, err) => {
                // [FIX-CHAT-3d] إعادة الاتصال عند انقطاع قناة متابعة الطلب
                if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                    const _savedKey = currentOrderKey;
                    setTimeout(() => {
                        if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
                        if (_savedKey) listenForOrderUpdates(_savedKey);
                    }, 3000);
                }
            });
    }

    // --- دالة مساعدة: استخراج المبلغ الرقمي من نص رسالة الصيدلي تلقائياً ---
    function _extractInvoiceAmountFromText(text) {
        if (!text) return 0;
        // محاولة 1: البحث عن أنماط شائعة مثل "1500 ل.س" أو "المبلغ: 1500" أو "الإجمالي: 1500"
        const patterns = [
            /(?:إجمالي|اجمالي|المبلغ|الإجمالي|الاجمالي|السعر|الفاتورة|التكلفة|المجموع)[:\s]*([0-9][0-9,\.]*)/i,
            /([0-9][0-9,\.]*)\s*(?:ل\.س|ليرة|ل\.ص|lira|sp)/i,
            /([0-9][0-9,\.]{2,})/  // أي رقم من 3 أرقام فصاعداً
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const val = parseFloat(String(match[1]).replace(/,/g, ''));
                if (!isNaN(val) && val > 0) return val;
            }
        }
        return 0;
    }

    // --- دالة: تحديث خانة المبلغ تلقائياً من آخر رسالة فاتورة ---
    function _autoFillInvoiceFromMessage(msgText) {
        const inputEl = document.getElementById('pharmacy-invoice-input');
        if (!inputEl) return;
        const extracted = _extractInvoiceAmountFromText(msgText);
        if (extracted > 0) {
            inputEl.value = extracted;
            // إضافة تأثير بصري لإعلام المستخدم بالتعبئة التلقائية
            inputEl.style.borderColor = '#2ecc71';
            inputEl.style.boxShadow = '0 0 8px rgba(46,204,113,0.5)';
            setTimeout(() => {
                inputEl.style.borderColor = '#3498db';
                inputEl.style.boxShadow = '';
            }, 2000);
            showNotify("تم تحديث مبلغ الفاتورة تلقائياً: " + extracted.toLocaleString() + " ل.س ✅", "info");
        }
    }

    // دالة مساعدة: تعبئة مبلغ الفاتورة من رسائل الصيدلي السابقة عند فتح الدردشة
    async function _prefillInvoiceFromHistory(orderId) {
        try {
            const { data: msgs } = await _supabase.from('sh_messages').select('*').eq('order_id', orderId).order('created_at', { ascending: false });
            if (!msgs || msgs.length === 0) return;
            // نبحث في رسائل الصيدلي (غير العميل) عن فاتورة
            for (const m of msgs) {
                if (m.sender !== 'client') {
                    const isInvoice = m.message && (m.message.includes('فاتورة') || m.message.includes('invoice') || m.message.includes('💊') || m.message.includes('إجمالي') || m.message.includes('السعر') || m.message.includes('المبلغ'));
                    if (isInvoice) {
                        _autoFillInvoiceFromMessage(m.message);
                        return; // نأخذ أول رسالة فاتورة فقط (الأحدث)
                    }
                }
            }
            // إذا لم نجد رسالة فاتورة واضحة، نجرب جميع رسائل الصيدلي
            for (const m of msgs) {
                if (m.sender !== 'client') {
                    const extracted = _extractInvoiceAmountFromText(m.message);
                    if (extracted > 0) {
                        _autoFillInvoiceFromMessage(m.message);
                        return;
                    }
                }
            }
        } catch(e) { /* [SEC-FIX-LOG] تم إزالة console.warn في بيئة الإنتاج */ }
    }

    // دالة مساعدة: مسح الفواتير القديمة وإعادة التعبئة عند تغيير الطلب
    function _clearAndResetInvoiceInput() {
        const inputEl = document.getElementById('pharmacy-invoice-input');
        if (inputEl) {
            inputEl.value = '';
            inputEl.style.borderColor = '#3498db';
            inputEl.style.boxShadow = '';
        }
    }

    async function upgradeToDelivery() {
        // ===== قراءة مبلغ فاتورة الصيدلية من الخانة (معبأ تلقائياً أو يدوياً) =====
        // ===== مسح أي قيم قديمة أو متعارضة قبل القراءة =====
        const _inputEl = document.getElementById('pharmacy-invoice-input');
        const pharmacyTotalFromMsg = _inputEl ? (sanitizeAmount(_inputEl.value) || 0) : 0;
        if (pharmacyTotalFromMsg <= 0) {
            // تحقق من نوع الطلب لتخصيص رسالة الخطأ
            const _curOrdList = getStorage('orders');
            const _curOrd = _curOrdList.find(o => String(o.id) === String(currentOrderKey));
            const _isStore = _curOrd && _curOrd.res_type === 'specialty';
            const _errMsg = _isStore
                ? 'انتظر حتى يرسل المتجر الفاتورة 🛍️'
                : 'لم يتم استلام مبلغ فاتورة الصيدلية بعد. انتظر حتى يرسل الصيدلي الفاتورة 🏥';
            return showNotify(_errMsg, "error");
        }

        showNotify("جاري تحويل الطلب للمناديب... 🦅");

        // ===== جمع تفاصيل الفاتورة من رسائل الصيدلي (للعرض النصي فقط) =====
        let pharmacyInvoiceNote = "";
        let pharmacyInvoiceItems = [];

        try {
            let { data: allMsgs } = await _supabase
                .from('sh_messages')
                .select('*')
                .eq('order_id', isNaN(currentOrderKey) ? currentOrderKey : Number(currentOrderKey))
                .order('created_at', { ascending: true });
            allMsgs = _stripStatusMsgs(allMsgs);

            if (allMsgs && allMsgs.length > 0) {
                const pharmacyMsgs = allMsgs.filter(m => m.sender !== 'client');
                if (pharmacyMsgs.length > 0) {
                    pharmacyInvoiceNote = pharmacyMsgs.map(m => m.message).join('\n');
                    pharmacyInvoiceItems = pharmacyMsgs.map(m => ({ n: m.message, p: 0 }));
                }
            }
        } catch(e) {
            /* [SEC-FIX-LOG] تم إزالة console.warn - تسرب معلومات */
        }

        // نجلب بيانات الطلب الحالي من السيرفر للحصول على total و items الأصلية
        const { data: currentOrderData } = await _supabase
            .from('sh_public_orders')
            .select('*')
            .eq('id', currentOrderKey)
            .single();

        // فاتورة الصيدلية الفعلية = من رسائل الصيدلي حصراً (pharmacyTotalFromMsg)
        // currentOrderData.total = ph.fee وهو سعر التوصيل وليس فاتورة الأدوية، لا نستخدمه هنا
        const finalTotal = pharmacyTotalFromMsg > 0 ? pharmacyTotalFromMsg : 0;

        // نبني نص الفاتورة الكاملة للمندوب
        const orderName = currentOrderData ? currentOrderData.restaurant_name : "صيدلية";
        const customerName = currentOrderData ? currentOrderData.customer_name : (currentUser ? currentUser.name : "العميل");
        const customerAddress = currentOrderData ? currentOrderData.customer_address : (currentUser ? currentUser.address : "");

        let fullInvoiceNote = `🏥 طلب صيدلية من: ${orderName}\n`;
        fullInvoiceNote += `👤 العميل: ${customerName}\n`;
        fullInvoiceNote += `📍 العنوان: ${customerAddress}\n`;
        fullInvoiceNote += `─────────────────\n`;
        if (pharmacyInvoiceNote) {
            fullInvoiceNote += `📋 تفاصيل الفاتورة:\n${pharmacyInvoiceNote}\n`;
            fullInvoiceNote += `─────────────────\n`;
        }
        fullInvoiceNote += `💰 المبلغ المطلوب تحصيله: ${finalTotal.toLocaleString()} ل.س\n`;
        fullInvoiceNote += `🔑 كود التحقق: ${verificationCode}`;

        // إعداد items النهائية للمندوب
        const finalItems = pharmacyInvoiceItems.length > 0
            ? JSON.stringify(pharmacyInvoiceItems)
            : (currentOrderData ? currentOrderData.items : JSON.stringify([{n: "طلب صيدلية", p: finalTotal}]));

        // ===== تحديث الطلب في sh_public_orders بالفاتورة الكاملة للمندوب =====
        // ph.fee = سعر التوصيل (محفوظ في delivery_price عند إنشاء الطلب)
        // pharmacyTotalFromMsg = فاتورة الأدوية الفعلية المستخرجة من رسائل الصيدلي
        const _deliveryPrice     = currentOrderData ? (currentOrderData.delivery_price || 0) : 0;
        // فاتورة الصيدلية = الرقم من رسائل الصيدلي فقط (وليس ph.fee الذي هو توصيل)
        const _pharmacyOnlyTotal = pharmacyTotalFromMsg > 0 ? pharmacyTotalFromMsg : 0;
        // ===== رسوم الاستشارة: يتم جلبها من بيانات الطلب المحفوظة مباشرة =====
        let _consultationFee = 0;
        // أولاً: من حقل consultation_fee في الطلب نفسه (تم حفظه عند الإنشاء)
        if (currentOrderData && currentOrderData.consultation_fee > 0) {
            _consultationFee = Number(currentOrderData.consultation_fee);
        }
        // ثانياً: كاحتياط — من قاعدة بيانات الصيدليات
        if (_consultationFee === 0 && currentOrderData && currentOrderData.pharmacy_id) {
            try {
                const { data: _phData } = await _supabase.from('pharmacies').select('consultation_fee, consultation_fee_enabled').eq('id', currentOrderData.pharmacy_id).maybeSingle();
                if (_phData && _phData.consultation_fee_enabled && _phData.consultation_fee > 0) {
                    _consultationFee = Number(_phData.consultation_fee);
                }
            } catch(_phErr) { /* [SEC-FIX-LOG] تم إزالة console.warn */ }
        }
        // المجموع النهائي = فاتورة الأدوية + سعر التوصيل + رسوم الاستشارة
        const _grandTotal = _pharmacyOnlyTotal + _deliveryPrice + _consultationFee;

        // بناء نص الفاتورة المنسقة للمندوب بشكل واضح مع كل الأرقام (3 بنود منفصلة)
        const _formattedInvoiceForDriver = `🏥 فاتورة صيدلية - ${orderName}\n` +
            `────────────────────\n` +
            `💊 فاتورة الصيدلية: ${_pharmacyOnlyTotal.toLocaleString()} ل.س\n` +
            `🛵 سعر التوصيل: ${_deliveryPrice.toLocaleString()} ل.س\n` +
            (_consultationFee > 0 ? `🩺 رسوم الاستشارة: ${_consultationFee.toLocaleString()} ل.س\n` : '') +
            `────────────────────\n` +
            `💰 المبلغ المقبوض النهائي: ${_grandTotal.toLocaleString()} ل.س\n` +
            `🔑 كود التحقق: ${verificationCode}\n` +
            `👤 العميل: ${customerName}\n` +
            `📍 العنوان: ${customerAddress}` +
            (pharmacyInvoiceNote ? `\n────────────────────\n📋 تفاصيل الفاتورة:\n${pharmacyInvoiceNote}` : '');

        // نبني order_details يحتوي على قيمة الفاتورة الرقمية بشكل يسهل استخراجها
        const _orderDetailsForDriver = `PHARMACY_TOTAL:${_pharmacyOnlyTotal}\nCONSULT_FEE:${_consultationFee}\n` + _formattedInvoiceForDriver;

        // تحديد res_type الصحيح: يُقرأ دائماً من res_type الأصلي في قاعدة البيانات (المحفوظ عند إنشاء الطلب)
        // ثم كاحتياط من السجل المحلي — بدون تخمين أبداً
        // الصيدلية: res_type = 'pharmacy' عند الإنشاء → يصبح 'pharmacy_delivery' هنا فقط
        // المتجر: res_type = 'specialty' عند الإنشاء → يبقى 'specialty' دائماً
        const _dbOriginalResType = currentOrderData ? currentOrderData.res_type : null;
        const _currentOrdersList = getStorage('orders');
        const _currentOrderObj = _currentOrdersList.find(o => String(o.id) === String(currentOrderKey));
        const _localOriginalResType = _currentOrderObj ? (_currentOrderObj.order_type || _currentOrderObj.res_type) : null;
        // الأولوية: قاعدة البيانات أولاً، ثم السجل المحلي
        const _resolvedOrderType = _dbOriginalResType || _localOriginalResType || 'pharmacy';
        const _isSpecialtyOrder = _resolvedOrderType === 'specialty';
        const _finalResType = _isSpecialtyOrder ? 'specialty' : 'pharmacy_delivery';

        const { error } = await _supabase.from('sh_public_orders').update({
            status: 'searching',
            is_consultation: false,
            res_type: _finalResType,
            restaurant_note: _formattedInvoiceForDriver,
            order_details: _orderDetailsForDriver,
            items: finalItems,
            total: _grandTotal,
            delivery_price: _deliveryPrice,
            consultation_fee: _consultationFee
        }).eq('id', currentOrderKey);

        if(!error) {
            // تحديث السجل المحلي بالأرقام الصحيحة
            let orders = getStorage('orders');
            orders = orders.map(o => String(o.id) === String(currentOrderKey) ? {
                ...o,
                status: 'searching',
                res_type: _finalResType,
                order_type: _resolvedOrderType,
                is_consultation: false,
                total: _grandTotal,
                delivery_price: _deliveryPrice,
                consultation_fee: _consultationFee,
                order_details: _orderDetailsForDriver,
                restaurant_note: _formattedInvoiceForDriver
            } : o);
            setStorage('orders', orders);
            document.getElementById('reveal-order-code').innerText = verificationCode;
            document.getElementById('client-reveal-code').innerText = verificationCode;
            showNotify("كود التحقق: " + verificationCode + " 🔑", "info");

            document.getElementById('searching-text').innerText = "جاري البحث عن صقر لاستلام طلبك... 🦅";
            startSearching();
        } else {
            showNotify("فشل التحويل: " + error.message, "error");
        }
    }

    async function updateOrderStatus(id, newStatus) {
        await _supabase.from('orders').update({ status: newStatus }).eq('id', id);
        let orders = getStorage('orders');
        const existsInLocal = orders.find(o => String(o.id) === String(id));
        if (!existsInLocal && (newStatus === 'completed' || newStatus === 'cancelled')) {
            // الطلب غير موجود محلياً — نجلبه من السيرفر ونضيفه
            try {
                const { data: missingOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', id).maybeSingle();
                if (missingOrder) {
                    orders.push({
                        id: String(id),
                        status: newStatus,
                        restaurant_name: missingOrder.restaurant_name || 'طلب',
                        total: missingOrder.total || 0,
                        delivery_price: missingOrder.delivery_price || 0,
                        verify_code: missingOrder.verify_code || '',
                        driver_name: missingOrder.driver_name || '',
                        res_type: missingOrder.res_type || '',
                        customer_id: missingOrder.customer_id || '',
                        date: new Date(missingOrder.created_at || Date.now()).toLocaleString('ar-SA'),
                        points_earned: 0,
                        points_spent: 0
                    });
                    setStorage('orders', orders);
                }
            } catch(e) { /* [SEC-FIX-LOG] تم إزالة console.warn */ }
        }
        orders = getStorage('orders');
        orders = orders.map(o => {
            if(String(o.id) === String(id)) {
                if(newStatus === 'completed' && currentUser) {
                    // [SEC-FIX-ATOMIC-POINTS] عملية ذرّية داخل القاعدة
                    const _pointsDelta2 = (o.points_earned || 0) - (o.points_spent || 0);
                    _supabase.rpc('adjust_customer_points', { p_customer_id: currentUser.uid, p_delta: _pointsDelta2 }).then(({ data, error }) => {
                        if (!error && typeof data === 'number') {
                            currentUser.points = data;
                            localStorage.setItem('shahen_user', JSON.stringify(currentUser));
                        }
                    });
                }
                return {...o, status: newStatus};
            }
            return o;
        });
        setStorage('orders', orders);
        // ===== إصلاح 5: إذا الطلب ملغي أو فاشل، ننقله للسابقة فوراً ونصفر المفتاح النشط =====
        if (newStatus === 'cancelled' || newStatus === 'failed' || newStatus === 'rejected') {
            if (String(id) === String(currentOrderKey)) {
                localStorage.removeItem('shahen_active_order_id');
                _isConsultChatOpen = false;
                currentOrderKey = null;
            }
        }
        // إصلاح إضافي: إذا اكتمل الطلب، ننقله للسابقة أيضاً مع جلب بياناته الكاملة من السيرفر
        if (newStatus === 'completed') {
            if (String(id) === String(currentOrderKey)) {
                // جلب بيانات الطلب الكاملة من السيرفر لحفظها في السجل المحلي
                try {
                    const { data: completedOrderData } = await _supabase.from('sh_public_orders').select('*').eq('id', id).maybeSingle();
                    if (completedOrderData) {
                        let ordersAfterComplete = getStorage('orders');
                        ordersAfterComplete = ordersAfterComplete.map(o => {
                            if (String(o.id) === String(id)) {
                                return {
                                    ...o,
                                    status: 'completed',
                                    restaurant_name: completedOrderData.restaurant_name || o.restaurant_name,
                                    total: completedOrderData.total || o.total,
                                    delivery_price: completedOrderData.delivery_price || o.delivery_price,
                                    driver_name: completedOrderData.driver_name || o.driver_name,
                                    verify_code: completedOrderData.verify_code || o.verify_code,
                                    order_details: completedOrderData.order_details || o.order_details,
                                    restaurant_note: completedOrderData.restaurant_note || o.restaurant_note,
                                    date: o.date || new Date(completedOrderData.created_at).toLocaleString('ar-SA')
                                };
                            }
                            return o;
                        });
                        setStorage('orders', ordersAfterComplete);
                    }
                } catch(e) { /* [SEC-FIX-LOG] تم إزالة console.warn */ }
                localStorage.removeItem('shahen_active_order_id');
                _isConsultChatOpen = false;
                currentOrderKey = null;
            }
        }
        // تحديث العرض إذا كانت صفحة الطلبات مفتوحة
        if (document.getElementById('p-history') && document.getElementById('p-history').style.display !== 'none') {
            renderHistory();
        }
    }

    // [FIX-CANCEL-BEFORE-DRIVER] إلغاء طلب مباشرة من قائمة "طلباتي" — يُسمح به فقط إن لم يُعيَّن أي
    // مندوب حقيقي بعد (يُعاد التحقق من هذا حيّاً من القاعدة هنا، لا من البيانات المعروضة محلياً فقط،
    // كي لا يُلغي العميل طلباً وصل فعلاً لمندوب بينما كانت الشاشة لم تتحدّث بعد). بمجرد وجود مندوب،
    // الإلغاء غير متاح للعميل إطلاقاً — فقط كود التحقق عند التسليم أو الإدارة.
    async function cancelOrderFromList(id) {
        if (!confirm('هل تريد إلغاء هذا الطلب؟')) return;
        try {
            const { data: fresh, error } = await _supabase.from('sh_public_orders').select('status, driver_id').eq('id', id).maybeSingle();
            if (error || !fresh) { showNotify('تعذّر التحقق من حالة الطلب الآن، حاول مجدداً', 'error'); return; }
            if (fresh.driver_id) {
                showNotify('⛔ تم تعيين مندوب لهذا الطلب بالفعل — لا يمكن إلغاؤه من هنا، سيُغلق تلقائياً عند التسليم', 'error');
                renderHistory();
                return;
            }
            if (!['searching','pending','pickup_pending','awaiting_driver'].includes(String(fresh.status))) {
                showNotify('لم يعد بالإمكان إلغاء هذا الطلب من هنا', 'error');
                renderHistory();
                return;
            }
            const _updatePayload = { status: 'cancelled' };
            await _supabase.from('orders').update(_updatePayload).eq('id', id);
            await _supabase.from('sh_public_orders').update(_updatePayload).eq('id', id);
            let orders = getStorage('orders');
            orders = orders.map(o => String(o.id) === String(id) ? {...o, status: 'cancelled'} : o);
            setStorage('orders', orders);
            if (String(currentOrderKey) === String(id)) {
                localStorage.removeItem('shahen_active_order_id');
                currentOrderKey = null;
                if (_searchPollInterval) { clearInterval(_searchPollInterval); _searchPollInterval = null; }
                if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
                document.getElementById('eagle-searching').style.display = 'none';
                try { document.getElementById('searching-sound').pause(); } catch(e) {}
            }
            showNotify('✅ تم إلغاء الطلب');
            renderHistory();
        } catch(e) {
            console.error('[FIX-CANCEL-BEFORE-DRIVER] خطأ أثناء إلغاء الطلب:', e);
            showNotify('حدث خطأ أثناء الإلغاء، حاول مجدداً', 'error');
        }
    }

    let _cancelOrderPending = false; // [SEC-FIX-CANCEL-DEBOUNCE]
    async function cancelOrder() {
        // [SEC-FIX-CANCEL-DEBOUNCE] هذي كانت الدالة الحرجة الوحيدة بالملف بدون أي حماية من الضغط
        // المزدوج — أي نقرتين متتاليتين (أو لمسة مزدوجة على الجوال) كانت تُشغّلها مرتين بنفس اللحظة،
        // ما يطابق بالضبط بلاغ "الطلب يُلغى بدون سبب واضح عند أي ضغط متكرر"
        if (_cancelOrderPending) return;
        _cancelOrderPending = true;
        try {
            await _cancelOrder_inner();
        } finally {
            _cancelOrderPending = false;
        }
    }
    async function _cancelOrder_inner() {
        // [FIX-RECORDS-1] طلب سبب الإلغاء (اختياري) ليظهر في سجلات الإدارة
        let _cancelReason = null;
        try { _cancelReason = prompt('سبب الإلغاء (اختياري) — اتركه فارغاً للتخطي:'); } catch(e) {}
        const _updatePayload = { status: 'cancelled' };
        if (_cancelReason && _cancelReason.trim()) _updatePayload.cancel_reason = _cancelReason.trim();
        await _supabase.from('orders').update(_updatePayload).eq('id', currentOrderKey);
        // [FIX-RECORDS-1b] لا نحذف السجل من sh_public_orders بعد الآن — فقط نحدّث حالته
        // (المناديب يفلترون بالحالة لرؤية الطلبات الجديدة، فلا تأثير وظيفي، لكن السجل يبقى محفوظاً للأرشيف)
        await _supabase.from('sh_public_orders').update(_updatePayload).eq('id', currentOrderKey);
        let orders = getStorage('orders');
        orders = orders.map(o => String(o.id) === String(currentOrderKey) ? {...o, status: 'cancelled'} : o);
        setStorage('orders', orders);
        localStorage.removeItem('shahen_active_order_id');
        if(cancelInterval) clearInterval(cancelInterval);
        document.getElementById('eagle-searching').style.display = 'none';
        document.getElementById('eagle-consulting').style.display = 'none';
        document.getElementById('searching-sound').pause();
        // [CANCEL-FIX] إغلاق جميع القنوات المرتبطة بالطلب الملغى ثم إعادة تهيئة النظام
        if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
        if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
        if (_consultChatChannel) { try { _supabase.removeChannel(_consultChatChannel); } catch(e){} _consultChatChannel = null; }
        if (_spChatChannel) { try { _supabase.removeChannel(_spChatChannel); } catch(e){} _spChatChannel = null; }
        if (_searchPollInterval) { clearInterval(_searchPollInterval); _searchPollInterval = null; }
        if (_clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
        if (_spPollInterval) { clearInterval(_spPollInterval); _spPollInterval = null; }
        _isConsultChatOpen = false;
        currentOrderKey = null;
        // [CANCEL-FIX-GUARDS] تصفير جميع حواجز الإرسال لضمان إمكانية إرسال طلب جديد فوراً بعد الإلغاء
        _confirmOrderPending = false;
        _medConsultPending = false;
        _storeConsultPending = false;
        _wassayniPending = false;
        // [CANCEL-FIX-BTNS] إعادة تفعيل جميع أزرار التأكيد التي قد تكون تعطلت
        try {
            const _confirmBtn = document.querySelector('[onclick="confirmOrderStart()"]');
            if (_confirmBtn) { _confirmBtn.disabled = false; _confirmBtn.innerText = 'تأكيد الطلب 🦅'; _confirmBtn.style.opacity = ''; _confirmBtn.style.pointerEvents = ''; }
            const _medBtn = document.querySelector('[onclick="submitMedicalConsult()"]');
            if (_medBtn) { _medBtn.disabled = false; _medBtn.innerText = 'أوافق وأطلب الآن 🚀'; _medBtn.style.opacity = ''; _medBtn.style.pointerEvents = ''; }
            const _scBtn = document.querySelector('[onclick="submitStoreConsult()"]');
            if (_scBtn) { _scBtn.disabled = false; _scBtn.innerText = 'بدء التواصل 🦅'; _scBtn.style.opacity = ''; _scBtn.style.pointerEvents = ''; }
        } catch(_btnErr) {}
        // [CANCEL-FIX] إعادة تهيئة قناة الإشعارات لضمان استمرار الاتصال بعد الإلغاء
        setTimeout(() => {
            try { initRealtimeNotifications(); } catch(_e) {}
            // [CANCEL-FIX-CONN] إعادة الاتصال بـ Supabase Realtime بشكل كامل بعد الإلغاء
            try {
                if (currentUser && _supabase.realtime && typeof _supabase.realtime.connect === 'function') {
                    _supabase.realtime.connect();
                }
            } catch(_rtErr) {}
        }, 500);
        showNotify("تم الإلغاء", "error");
        nav('p-home');
    }

    // ===== نظام الطلبات الجديد — يجلب من السيرفر مباشرة =====
    let _historyTab = 'active'; // active | completed | cancelled

    function switchHistoryTab(tab) {
        _historyTab = tab;
        historyTab = tab === 'active' ? 'active' : 'past'; // للتوافق مع الكود القديم
        document.querySelectorAll('.h-tab').forEach(t => t.classList.remove('active'));
        const tabEl = document.getElementById('tab-' + tab);
        if (tabEl) tabEl.classList.add('active');
        loadAllOrdersFromServer();
    }

    async function loadAllOrdersFromServer() {
        if (!currentUser) return;
        const loadingEl = document.getElementById('orders-loading');
        const cont = document.getElementById('history-content');
        if (loadingEl) loadingEl.style.display = 'block';
        cont.innerHTML = '';

        try {
            // جلب جميع طلبات العميل من السيرفر
            const { data: serverOrders, error } = await _supabase
                .from('sh_public_orders')
                .select('*')
                .eq('customer_id', currentUser.uid)
                .order('created_at', { ascending: false });

            if (loadingEl) loadingEl.style.display = 'none';

            if (error || !serverOrders) {
                // fallback على localStorage
                renderHistoryFromLocal();
                return;
            }

            // تحديث localStorage بأحدث البيانات من السيرفر
            const localOrders = getStorage('orders');
            serverOrders.forEach(so => {
                const idx = localOrders.findIndex(lo => String(lo.id) === String(so.id));
                if (idx >= 0) {
                    localOrders[idx] = { ...localOrders[idx], ...so, date: localOrders[idx].date || new Date(so.created_at).toLocaleString('ar-SA') };
                } else {
                    localOrders.push({ ...so, date: new Date(so.created_at).toLocaleString('ar-SA') });
                }
            });
            // إزالة المكررة
            const seen = new Set();
            const deduped = localOrders.filter(o => { const k = String(o.id); if (seen.has(k)) return false; seen.add(k); return true; });
            setStorage('orders', deduped);

            // تصنيف الطلبات
            const activeStatuses = ['searching', 'pending', 'accepted', 'preparing', 'ready', 'consulting', 'awaiting_driver', 'store_invoice_sent'];
            const completedStatuses = ['completed'];
            const cancelledStatuses = ['cancelled', 'failed', 'rejected'];

            let displayList;
            if (_historyTab === 'active') {
                displayList = serverOrders.filter(o => activeStatuses.includes(String(o.status)));
            } else if (_historyTab === 'completed') {
                displayList = serverOrders.filter(o => completedStatuses.includes(String(o.status)));
            } else {
                displayList = serverOrders.filter(o => cancelledStatuses.includes(String(o.status)));
            }

            _renderOrderCards(displayList, cont);

        } catch(e) {
            if (loadingEl) loadingEl.style.display = 'none';
            renderHistoryFromLocal();
        }
    }

    function renderHistoryFromLocal() {
        const cont = document.getElementById('history-content');
        const orders = getStorage('orders');
        const seen = new Set();
        const unique = orders.filter(o => { const k = String(o.id); if (seen.has(k)) return false; seen.add(k); return true; });
        setStorage('orders', unique);

        const activeStatuses = ['searching', 'pending', 'accepted', 'preparing', 'ready', 'consulting', 'awaiting_driver', 'store_invoice_sent'];
        let list;
        if (_historyTab === 'active') list = unique.filter(o => activeStatuses.includes(String(o.status)));
        else if (_historyTab === 'completed') list = unique.filter(o => o.status === 'completed');
        else list = unique.filter(o => ['cancelled','failed','rejected'].includes(String(o.status)));

        list.sort((a, b) => {
            const da = a.created_at ? new Date(a.created_at) : new Date(a.date || 0);
            const db = b.created_at ? new Date(b.created_at) : new Date(b.date || 0);
            return db - da;
        });

        _renderOrderCards(list, cont);
    }

    function _renderOrderCards(list, cont) {
        if (!list || list.length === 0) {
            const msgs = {
                active: 'لا توجد طلبات نشطة حالياً',
                completed: 'لا توجد طلبات مكتملة بعد',
                cancelled: 'لا توجد طلبات ملغية'
            };
            cont.innerHTML = `<div style="text-align:center; padding:40px 20px; color:#666;">
                <i class="fas fa-${_historyTab === 'active' ? 'bolt' : _historyTab === 'completed' ? 'check-circle' : 'times-circle'}" style="font-size:40px; margin-bottom:12px; display:block; opacity:0.3;"></i>
                <p style="font-size:12px; margin:0;">${msgs[_historyTab] || 'لا توجد طلبات'}</p>
            </div>`;
            return;
        }

        cont.innerHTML = list.map(o => {
            // --- نوع الطلب ---
            let typeIcon = '<i class="fas fa-utensils"></i>';
            let typeLabel = 'مطعم';
            let typeColor = 'var(--gold)';
            const _eff = o.order_type || o.res_type || '';
            if (_eff === 'pharmacy' || _eff === 'pharmacy_delivery' || _eff === 'delivery') {
                typeIcon = '<i class="fas fa-prescription-bottle-alt"></i>'; typeLabel = 'صيدلية'; typeColor = '#3498db';
            } else if (_eff === 'specialty' || o.res_type === 'specialty') {
                const _sp = o.specialty_type || '';
                if (_sp === 'flowers')      { typeIcon = '<i class="fas fa-seedling"></i>';    typeLabel = 'ورود 🌸';     typeColor = '#e91e8c'; }
                else if (_sp === 'sweets')  { typeIcon = '<i class="fas fa-cookie-bite"></i>'; typeLabel = 'حلويات 🍬';  typeColor = '#8e44ad'; }
                else if (_sp === 'gifts')   { typeIcon = '<i class="fas fa-gift"></i>';        typeLabel = 'هدايا 🎁';   typeColor = '#e67e22'; }
                else                        { typeIcon = '<i class="fas fa-store"></i>';       typeLabel = 'متجر 🛍️';   typeColor = '#16a085'; }
            } else if (o.res_type === 'flowers') { typeIcon = '<i class="fas fa-seedling"></i>';    typeLabel = 'ورود';    typeColor = '#e91e8c'; }
            else if (o.res_type === 'sweets')    { typeIcon = '<i class="fas fa-cookie-bite"></i>'; typeLabel = 'حلويات'; typeColor = '#8e44ad'; }
            else if (o.res_type === 'wassayni')  { typeIcon = '<i class="fas fa-paper-plane"></i>'; typeLabel = 'وصيني';  typeColor = '#2ecc71'; }

            // --- حالة الطلب ---
            let statusText = 'نشط ⚡';
            let statusColor = '#f39c12';
            let statusBg = 'rgba(243,156,18,0.15)';
            if (o.status === 'completed')           { statusText = 'تم التسليم ✅';           statusColor = '#2ecc71'; statusBg = 'rgba(46,204,113,0.15)'; }
            else if (o.status === 'cancelled')       { statusText = 'ملغي ❌';                  statusColor = '#e74c3c'; statusBg = 'rgba(231,76,60,0.15)'; }
            else if (o.status === 'failed')          { statusText = 'فشل ❌';                   statusColor = '#e74c3c'; statusBg = 'rgba(231,76,60,0.15)'; }
            else if (o.status === 'rejected')        { statusText = 'مرفوض ❌';                 statusColor = '#e74c3c'; statusBg = 'rgba(231,76,60,0.15)'; }
            else if (o.status === 'ready')           { statusText = 'في ذمة الصقر 🦅';         statusColor = '#9b59b6'; statusBg = 'rgba(155,89,182,0.15)'; }
            else if (o.status === 'preparing')       { statusText = 'قيد التجهيز 👨‍🍳';       statusColor = '#e67e22'; statusBg = 'rgba(230,126,34,0.15)'; }
            else if (o.status === 'accepted')        { statusText = 'قُبل — الصقر جاي 🦅';     statusColor = '#3498db'; statusBg = 'rgba(52,152,219,0.15)'; }
            else if (o.status === 'consulting')      { statusText = 'تواصل مع المتجر 💬';       statusColor = '#8e44ad'; statusBg = 'rgba(142,68,173,0.15)'; }
            else if (o.status === 'searching')       { statusText = 'جاري البحث عن صقر 🔍';    statusColor = '#f39c12'; statusBg = 'rgba(243,156,18,0.15)'; }
            else if (o.status === 'awaiting_driver') { statusText = 'انتظار مندوب 🛵';          statusColor = '#f39c12'; statusBg = 'rgba(243,156,18,0.15)'; }
            else if (o.status === 'store_invoice_sent') { statusText = 'وصلت الفاتورة 🧾';     statusColor = '#2ecc71'; statusBg = 'rgba(46,204,113,0.15)'; }
            else if (o.status === 'pending')         { statusText = 'بانتظار القبول ⏳';        statusColor = '#f39c12'; statusBg = 'rgba(243,156,18,0.15)'; }

            // --- التاريخ ---
            const _dateStr = o.created_at ? new Date(o.created_at).toLocaleString('ar-SA', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : (o.date || '');

            // --- المبالغ ---
            const _total    = parseFloat(o.total || 0);
            const _delivery = parseFloat(o.delivery_price || 0);
            const _sub      = Math.max(0, _total - _delivery);
            const isCurrentActive = String(o.id) === String(currentOrderKey);
            const isSpecialty = (o.order_type === 'specialty' || o.res_type === 'specialty');
            const isPharmacy  = (o.order_type === 'pharmacy' || o.res_type === 'pharmacy' || o.res_type === 'pharmacy_delivery');
            const isArchived  = ['completed','cancelled','failed','rejected'].includes(String(o.status));

            // --- حدود الكرت ---
            let cardStyle = `border-right: 4px solid ${typeColor}; background: rgba(0,0,0,0.15);`;
            if (isCurrentActive) cardStyle = `border: 2px solid ${typeColor}; box-shadow: 0 0 14px ${typeColor}44; background: ${typeColor}12;`;
            else if (isPharmacy) cardStyle = 'border: 2px solid #3498db; background: rgba(52,152,219,0.05);';
            else if (isSpecialty) cardStyle = `border: 2px solid ${typeColor}; background: ${typeColor}10;`;

            // --- onclick ---
            const isSpecialtyChat = isSpecialty && (o.status === 'consulting' || o.status === 'searching');
            // [FIX-DETAILS-NOT-RATING] الضغط على كرت طلب مكتمل/ملغي من السجل يجب أن يفتح ملخص التفاصيل دائماً،
            // لا منطق checkOrderAction الذي قد يُظهر نافذة التقييم خطأً لطلب اكتمل بالفعل من قبل
            const onclickAttr = isSpecialtyChat
                ? `openSpecialtyChat('${escJsAttr(o.id)}','${escJsAttr(o.restaurant_name||'')}','')`
                : isArchived
                    ? `showOrderDetailsSummary('${o.id}')`
                    : `checkOrderAction('${o.id}','${o.status}')`;

            return `
            <div class="card" style="padding:0; ${cardStyle} margin-bottom:10px; overflow:hidden; cursor:pointer;" onclick="${onclickAttr}">
                
                <!-- شريط الحالة العلوي -->
                <div style="background:${statusBg}; padding:6px 12px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid ${statusColor}33;">
                    <span style="color:${statusColor}; font-size:10px; font-weight:bold;">${statusText}</span>
                    <span style="color:#888; font-size:9px;">${_dateStr}</span>
                </div>

                <!-- محتوى الكرت -->
                <div style="padding:10px 12px;">
                    <!-- اسم المطعم ونوع الطلب -->
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                        <div>
                            <div style="font-size:12px; font-weight:bold; color:#fff;">${typeIcon} ${escHtml(o.restaurant_name || 'طلب وصيني')}</div>
                            <div style="font-size:9px; color:${typeColor}; margin-top:2px;">${typeLabel}</div>
                        </div>
                        <div style="text-align:left;">
                            <div style="font-size:14px; font-weight:bold;">${fmtSYP(_total,{inline:true,size:14})}</div>
                            <div style="font-size:8px; color:#888; text-align:left;">#${o.id}</div>
                        </div>
                    </div>

                    <!-- تفاصيل إضافية -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:9px; color:#888; background:rgba(0,0,0,0.2); border-radius:8px; padding:6px 8px;">
                        ${_delivery > 0 ? `<div>🛵 توصيل: <b>${fmtSYP(_delivery,{inline:true,size:9})}</b></div>` : '<div></div>'}
                        ${_sub > 0 && _delivery > 0 ? `<div>🛍️ طلب: <b>${fmtSYP(_sub,{inline:true,size:9})}</b></div>` : '<div></div>'}
                        ${o.driver_name ? `<div>🦅 المندوب: <b style="color:var(--gold);">${escHtml(o.driver_name)}</b></div>` : '<div></div>'}
                        ${o.verify_code && !isArchived ? `<div>🔑 الكود: <b style="color:var(--gold); letter-spacing:2px;">${o.verify_code}</b></div>` : '<div></div>'}
                    </div>

                    ${isCurrentActive && !isArchived ? `
                    <div style="margin-top:6px; background:rgba(46,204,113,0.1); border:1px solid rgba(46,204,113,0.3); border-radius:6px; padding:5px 8px; text-align:center;">
                        <span style="color:#2ecc71; font-size:10px; font-weight:bold;">● طلبك الحالي النشط — اضغط لمتابعته</span>
                    </div>` : ''}

                    <!-- [FIX-CANCEL-BEFORE-DRIVER] إلغاء ذاتي متاح فقط قبل تعيين أي مندوب حقيقي —
                         بمجرد وجود مندوب (driver_id)، لا يمكن إغلاق الطلب إلا بكود التحقق أو الإدارة -->
                    ${(!isArchived && !o.driver_id && ['searching','pending','pickup_pending','awaiting_driver'].includes(String(o.status))) ? `
                    <button onclick="event.stopPropagation(); cancelOrderFromList('${o.id}')" style="width:100%; margin-top:6px; background:rgba(231,76,60,0.12); color:#e74c3c; border:1px solid rgba(231,76,60,0.35); border-radius:8px; padding:6px; font-size:10px; font-weight:bold; cursor:pointer;">
                        <i class="fas fa-times-circle"></i> إلغاء الطلب
                    </button>` : ''}

                    ${o.status === 'completed' ? `
                    <div style="display:flex; gap:6px; margin-top:8px;">
                        <button onclick="event.stopPropagation(); sendComplaint('طلب #${o.id}')" style="flex:1; background:rgba(231,76,60,0.15); color:#e74c3c; border:1px solid rgba(231,76,60,0.3); border-radius:8px; padding:5px; font-size:9px; cursor:pointer;"><i class="fas fa-exclamation-circle"></i> شكوى</button>
                        <button onclick="event.stopPropagation(); showOrderDetailsSummary('${o.id}')" style="flex:1; background:rgba(212,175,55,0.1); color:var(--gold); border:1px solid rgba(212,175,55,0.3); border-radius:8px; padding:5px; font-size:9px; cursor:pointer;"><i class="fas fa-receipt"></i> تفاصيل</button>
                    </div>` : ''}

                    ${isSpecialtyChat ? `
                    <button onclick="event.stopPropagation(); openSpecialtyChat('${escJsAttr(o.id)}','${escJsAttr(o.restaurant_name||'')}','')"
                        style="width:100%; margin-top:8px; background:linear-gradient(135deg,#6c3483,#8e44ad); color:#fff; border:none; border-radius:10px; padding:8px; font-size:11px; font-weight:bold; cursor:pointer;">
                        💜 متابعة الدردشة مع المتجر
                    </button>` : ''}

                    ${o.status === 'cancelled' && o.cancel_reason ? `
                    <div style="margin-top:6px; background:rgba(231,76,60,0.1); border-radius:6px; padding:5px 8px; font-size:9px; color:#e74c3c;">
                        <i class="fas fa-info-circle"></i> سبب الإلغاء: ${escHtml(o.cancel_reason)}
                    </div>` : ''}
                    ${o.order_details && o.res_type === 'wassayni' ? `
                    <div style="margin-top:6px; background:rgba(52,152,219,0.1); border:1px solid rgba(52,152,219,0.3); border-radius:6px; padding:6px 8px; font-size:10px; color:#ddd; line-height:1.5;">
                        <b style="color:#3498db; display:block; margin-bottom:3px;"><i class="fas fa-file-alt"></i> تفاصيل الطلب:</b>
                        ${escHtml(o.order_details)}
                    </div>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    function renderHistory() {
        // إذا صفحة الطلبات مفتوحة يجلب من السيرفر، وإلا يعرض من الكاش المحلي فقط
        if (document.getElementById('p-history') && document.getElementById('p-history').style.display === 'flex') {
            loadAllOrdersFromServer();
        } else {
            renderHistoryFromLocal();
        }
    }

    // عرض ملخص الطلب المؤرشف من البيانات المحلية
    // [FIX-DETAILS-NOT-RATING] مدة التوصيل لعرضها في ملخص الطلب
    function _fmtDurationClient(startIso, endIso) {
        const ms = new Date(endIso) - new Date(startIso);
        if (isNaN(ms) || ms < 0) return '—';
        const mins = Math.round(ms / 60000);
        if (mins < 60) return mins + ' دقيقة';
        return Math.floor(mins / 60) + ' ساعة و ' + (mins % 60) + ' دقيقة';
    }
    // [FIX-DETAILS-NOT-RATING] دالة مخصصة لعرض تفاصيل طلب سابق من السجل — تجلب أحدث نسخة من السيرفر
    // ولا تستدعي أبداً منطق checkOrderAction الذي قد يفتح نافذة التقييم خطأً لطلب مكتمل من قبل
    // [FIX-RELIABLE-WA] الضغط على الزر يجلب رقم المندوب طازجاً من القاعدة في تلك اللحظة بالضبط —
    // لا يعتمد على أي متغيّر سابق قد لا يكون قد تم ضبطه بسبب أي مسار عرض لم يُنفَّذ
    window.openPersistentDriverWA = async function() {
        if (!currentOrderKey) { showNotify('لا يوجد طلب نشط حالياً', 'error'); return; }
        try {
            const { data: ord } = await _supabase.from('sh_public_orders').select('driver_phone,restaurant_name,customer_name,id').eq('id', currentOrderKey).maybeSingle();
            const phoneOk = ord && /^[0-9+]{7,15}$/.test(ord.driver_phone || '');
            const driverWA = phoneOk ? ord.driver_phone : '966546083283';
            const _custName = (currentUser && currentUser.name) || (ord && ord.customer_name) || 'العميل';
            const _resName = (ord && ord.restaurant_name) || 'المطعم';
            const _orderIdShort = String((ord && ord.id) || currentOrderKey).substring(0,8);
            const msg = encodeURIComponent(`مرحباً يا صقر شاهين، أنا ${_custName} أتواصل معك بخصوص طلب من مطعم ${_resName} — رقم الطلب: ${_orderIdShort}.`);
            window.open(`https://wa.me/${driverWA}?text=${msg}`);
        } catch(e) {
            showNotify('تعذّر فتح واتساب الآن، حاول مجدداً', 'error');
        }
    };

    async function showOrderDetailsSummary(id) {
        try {
            const { data: serverOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', id).single();
            if (serverOrder) { _showArchivedOrderSummary(serverOrder); return; }
        } catch(e) {}
        // إن تعذّر الجلب من السيرفر، نعرض النسخة المحلية المخزَّنة كحل أخير
        const localOrders = getStorage('orders');
        const localOrder = localOrders.find(o => String(o.id) === String(id));
        if (localOrder) _showArchivedOrderSummary(localOrder);
        else showNotify('تعذّر جلب تفاصيل هذا الطلب', 'error');
    }

    function _showArchivedOrderSummary(order) {
        const _statusMap = {
            'completed': 'تم التسليم ✅',
            'cancelled': 'ملغي ❌',
            'failed': 'فشل ❌',
            'rejected': 'مرفوض ❌'
        };
        const _statusText = _statusMap[order.status] || order.status;
        const _invLbl = order.res_type === 'pharmacy' ? 'فاتورة الصيدلية' :
                        order.res_type === 'sweets' ? 'فاتورة الحلويات' :
                        order.res_type === 'flowers' ? 'فاتورة الورود' :
                        order.res_type === 'specialty' ? 'فاتورة المتجر' : 'فاتورة المطعم';
        const _total = parseFloat(order.total || 0);
        const _delivery = parseFloat(order.delivery_price || 0);
        const _consultFee = parseFloat(order.consultation_fee || 0);
        const _subtotal = Math.max(0, _total - _delivery - _consultFee);
        const _dateStr = order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : '');
        // عرض الملخص في مودال أو تنبيه مؤقت
        const existingModal = document.getElementById('_archived-summary-modal');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.id = '_archived-summary-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:15px;';
        modal.innerHTML = `
            <div style="background:linear-gradient(135deg,#1a051a,#0a010a);border:1px solid var(--gold);border-radius:18px;padding:20px;max-width:360px;width:100%;text-align:right;direction:rtl;">
                <div style="text-align:center;margin-bottom:12px;">
                    <i class="fas fa-receipt" style="color:var(--gold);font-size:22px;"></i>
                    <div style="color:var(--gold);font-weight:bold;font-size:14px;margin-top:6px;">سجل الطلب #${order.id}</div>
                </div>
                <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:12px;font-size:11px;line-height:2;">
                    <div style="display:flex;justify-content:space-between;"><span style="color:#aaa;">الحالة:</span><b style="color:${order.status==='completed'?'#2ecc71':'#e74c3c'};">${_statusText}</b></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#aaa;">المطعم/المتجر:</span><b style="color:#fff;">${escHtml(order.restaurant_name || '---')}</b></div>
                    ${order.driver_name ? `<div style="display:flex;justify-content:space-between;"><span style="color:#aaa;">المندوب:</span><b style="color:var(--gold);">🦅 ${escHtml(order.driver_name)}</b></div>` : ''}
                    ${(order.status === 'completed' && order.created_at && order.delivered_at) ? `<div style="display:flex;justify-content:space-between;"><span style="color:#aaa;">⏱ مدة التوصيل:</span><b style="color:#fff;">${_fmtDurationClient(order.created_at, order.delivered_at)}</b></div>` : ''}
                    ${order.order_details ? `<div style="margin-top:6px; background:rgba(52,152,219,0.1); border:1px solid rgba(52,152,219,0.3); border-radius:8px; padding:8px;"><b style="color:#3498db; display:block; font-size:10px; margin-bottom:4px;"><i class="fas fa-file-alt"></i> تفاصيل الطلب:</b><div style="font-size:10px; color:#ddd; line-height:1.6; white-space:pre-wrap;">${escHtml(order.order_details)}</div></div>` : ''}
                    <div style="display:flex;justify-content:space-between;"><span style="color:#aaa;">${_invLbl}:</span><b>${fmtSYP(_subtotal,{inline:true,size:11})}</b></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#aaa;">🛵 التوصيل:</span><b>${fmtSYP(_delivery,{inline:true,size:11})}</b></div>
                    ${_consultFee > 0 ? `<div style="display:flex;justify-content:space-between;"><span style="color:#f39c12;">🩺 رسوم الاستشارة:</span><b style="color:#f39c12;">${fmtSYP(_consultFee,{inline:true,size:11})}</b></div>` : ''}
                    <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(212,175,55,0.3);padding-top:6px;margin-top:6px;"><span style="color:var(--gold);font-weight:bold;">الإجمالي:</span><b style="font-size:14px;">${fmtSYP(_total,{inline:true,size:14})}</b></div>
                    ${_dateStr ? `<div style="text-align:center;color:#aaa;font-size:9px;margin-top:4px;">${_dateStr}</div>` : ''}
                </div>
                <button onclick="document.getElementById('_archived-summary-modal').remove()" style="width:100%;margin-top:12px;background:var(--gold);color:#000;border:none;padding:10px;border-radius:10px;font-weight:bold;cursor:pointer;font-size:12px;">إغلاق</button>
            </div>`;
        document.body.appendChild(modal);
    }

    // [FIX-RELIABLE-TRACK-BTN] نسخة مستقلة وبسيطة من دالة إظهار/إخفاء زر التتبع، معرَّفة هنا مباشرة
    // (لا داخل نظام Mapbox المعقّد) — حتى لو فشل أي جزء من تهيئة الخريطة بصمت لأي سبب، يبقى الزر
    // يظهر بشكل صحيح دائماً بناءً على توفر مندوب للطلب، بشكل مستقل تماماً عن ذلك النظام
    if (typeof window._refreshTrackButton !== 'function') {
        window._refreshTrackButton = function(order) {
            const btn = document.getElementById('open-track-driver-btn');
            if (!btn) return;
            // [FIX-TRACK-BTN] إضافة 'picked' للحالات القابلة للتتبع — هي أهم مرحلة (المندوب في الطريق)
            const canTrack = order && order.driver_id && ['accepted', 'preparing', 'ready', 'picked'].includes(order.status);
            btn.style.display = canTrack ? 'block' : 'none';
            window._lastTrackableOrder = canTrack ? order : null;
        };
    }

    // [FIX-CHAT-ETA] حساب تقريبي للمسافة بين نقطتين (كم) لاستخدامه في تقدير الوقت المتبقي
    function _haversineKmChat(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    // [FIX-CHAT-ETA] تحديث الوقت المتبقي للمندوب في صفحة الدردشة — يعمل سواء كان متجهاً للمطعم أو للعميل،
    // بشكل مستقل تماماً عن صفحة التتبع الكاملة بالخريطة (لا حاجة لفتحها لمعرفة الوقت التقريبي المتبقي)
    // ===========================================================================
    // [INVOICE-REVISION] فحص وعرض ومعالجة طلبات تعديل فاتورة المطعم من المندوب
    // ===========================================================================
    let _invRevActiveId = null, _invRevOldAmt = 0, _invRevNewAmt = 0, _invRevDeliveryFee = 0;

    async function _checkPendingInvoiceRevision() {
        const card = document.getElementById('invoice-revision-card');
        if (!card || !currentOrderKey) return;
        try {
            const { data: req } = await _supabase.from('invoice_revision_requests')
                .select('*').eq('order_id', String(currentOrderKey)).eq('status', 'pending')
                .order('id', { ascending: false }).limit(1).maybeSingle();
            if (!req) { card.style.display = 'none'; _invRevActiveId = null; return; }

            _invRevActiveId = req.id;
            _invRevOldAmt = parseFloat(req.old_amount) || 0;
            _invRevNewAmt = parseFloat(req.new_amount) || 0;
            const { data: ord } = await _supabase.from('sh_public_orders').select('delivery_price').eq('id', currentOrderKey).maybeSingle();
            _invRevDeliveryFee = ord ? (parseFloat(ord.delivery_price) || 0) : 0;

            document.getElementById('inv-rev-card-old').innerText = _invRevOldAmt.toLocaleString() + ' ل.س';
            document.getElementById('inv-rev-card-new').innerText = _invRevNewAmt.toLocaleString() + ' ل.س';
            const diff = _invRevNewAmt - _invRevOldAmt;
            const diffEl = document.getElementById('inv-rev-card-diff');
            diffEl.style.color = diff > 0 ? '#e74c3c' : '#2ecc71';
            diffEl.innerText = (diff > 0 ? '⬆ زيادة بمقدار ' : '⬇ نقصان بمقدار ') + Math.abs(diff).toLocaleString() + ' ل.س';
            const reasonEl = document.getElementById('inv-rev-card-reason');
            if (req.reason) { reasonEl.style.display = 'block'; reasonEl.innerText = '📝 السبب: ' + req.reason; }
            else { reasonEl.style.display = 'none'; }
            card.style.display = 'block';
        } catch(e) { console.error('[INVOICE-REVISION] خطأ أثناء فحص طلب التعديل:', e); }
    }

    window.approveInvoiceRevision = async function() {
        if (!_invRevActiveId || !currentOrderKey) return;
        try {
            const newTotal = _invRevNewAmt + _invRevDeliveryFee;
            // [FIX-INVOICE-SYNC] تحديث الجدولين معاً — sh_public_orders (يقرأه العميل) و orders (يقرأه
            // المندوب/الإدارة في تقارير الأرباح والعمولات) — كان يُحدَّث الأول فقط، فيبقى المندوب
            // والإدارة يريان القيمة القديمة رغم موافقة العميل فعلياً على التعديل
            const { error: updErr } = await _supabase.from('sh_public_orders').update({ total: newTotal }).eq('id', currentOrderKey);
            if (updErr) { console.error('[INVOICE-REVISION] فشل تحديث إجمالي الطلب:', updErr); showNotify('⚠️ تعذّر تحديث الفاتورة، حاول مجدداً', 'error'); return; }
            try { await _supabase.from('orders').update({ total: newTotal }).eq('id', currentOrderKey); } catch(_e2) { console.error('[FIX-INVOICE-SYNC] فشل تحديث جدول orders الثانوي (لا يوقف نجاح العملية الأساسية):', _e2); }
            const { error: reqErr } = await _supabase.from('invoice_revision_requests').update({ status: 'approved', resolved_at: new Date().toISOString() }).eq('id', _invRevActiveId);
            if (reqErr) console.error('[INVOICE-REVISION] فشل تحديث حالة طلب التعديل (لكن الفاتورة تحدّثت بنجاح):', reqErr);
            document.getElementById('invoice-revision-card').style.display = 'none';
            showNotify('✅ تمت الموافقة، وتحديث فاتورة الطلب بنجاح');
            // [FIX-INVOICE-REFRESH] إعادة بناء شاشة الطلب بالكامل فوراً من بيانات القاعدة الحقيقية —
            // يضمن ظهور الإجمالي الجديد فوراً في كل مكان يُعرض فيه على هذه الشاشة، بدل الاعتماد على
            // تتبع كل عنصر عرض بشكل منفصل يدوياً
            try {
                const { data: _freshOrd } = await _supabase.from('sh_public_orders').select('status').eq('id', currentOrderKey).maybeSingle();
                if (_freshOrd) checkOrderAction(currentOrderKey, _freshOrd.status);
            } catch(_e3) {}
        } catch(e) { console.error('[INVOICE-REVISION] استثناء غير متوقع أثناء الموافقة:', e); showNotify('⚠️ خطأ غير متوقع', 'error'); }
    };

    window.rejectInvoiceRevision = async function() {
        if (!_invRevActiveId || !currentOrderKey) return;
        try {
            const { error: reqErr } = await _supabase.from('invoice_revision_requests').update({ status: 'rejected', resolved_at: new Date().toISOString() }).eq('id', _invRevActiveId);
            if (reqErr) console.error('[INVOICE-REVISION] فشل تحديث حالة الرفض:', reqErr);
            const { error: ordErr } = await _supabase.from('sh_public_orders').update({ invoice_dispute: true }).eq('id', currentOrderKey);
            if (ordErr) console.error('[INVOICE-REVISION] فشل رفع علم النزاع للإدارة:', ordErr);
            document.getElementById('invoice-revision-card').style.display = 'none';
            showNotify('✅ تم رفض التعديل، وتحويل الطلب لمراجعة الإدارة لحل الأمر');
        } catch(e) { console.error('[INVOICE-REVISION] استثناء غير متوقع أثناء الرفض:', e); showNotify('⚠️ خطأ غير متوقع', 'error'); }
    };

    async function _updateChatEtaWidget() {
        const widget = document.getElementById('chat-eta-widget');
        if (!widget) return;
        if (!currentOrderKey) { widget.style.display = 'none'; return; }
        try {
            const { data: ord } = await _supabase.from('sh_public_orders')
                .select('driver_id,driver_stage,status,restaurant_id,pickup_lat,pickup_lng,lat,lng,customer_id,res_type,order_type,restaurant_name,items,order_notes,delivery_price,total,is_free_delivery')
                .eq('id', currentOrderKey).maybeSingle();

            // [FIX-CUSTOMER-ORDER-SUMMARY-V2] مسار مستقل تماماً وضمن هذا الاستطلاع المؤكَّد عمله كل
            // 15 ثانية — يملأ بطاقة ملخص الطلب بغض النظر عن أي منطق آخر في checkOrderAction قد يمنعها
            // من الظهور لأي سبب. هذا يضمن ظهورها خلال 15 ثانية كحد أقصى مهما حدث.
            try {
                const _summaryCardEl2 = document.getElementById('customer-order-summary-card');
                const _isPharmacyOrd = ord && (ord.order_type === 'pharmacy' || ord.res_type === 'pharmacy_delivery' || ord.res_type === 'pharmacy');
                if (_summaryCardEl2 && ord && !_isPharmacyOrd && ['accepted','preparing','ready'].includes(ord.status)) {
                    let _itemsArr2 = [];
                    try { _itemsArr2 = typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : (Array.isArray(ord.items) ? ord.items : []); } catch(e) { _itemsArr2 = []; }
                    const _itemsHtml2 = _itemsArr2.length ? `
                        <div style="margin-top:8px; padding-top:8px; border-top:1px dashed rgba(212,175,55,0.2);">
                            ${_itemsArr2.map(it => `
                                <div style="display:flex; justify-content:space-between; font-size:11px; color:#eee; padding:3px 0; border-bottom:1px dashed rgba(255,255,255,0.06);">
                                    <span>${escHtml(String((it.p ?? it.price ?? 0) * (it.qty || 1)))} ل.س</span>
                                    <span>${escHtml(it.n || it.name || '')}${(it.qty && it.qty > 1) ? ' <span style="color:var(--gold);">×' + it.qty + '</span>' : ''}</span>
                                </div>`).join('')}
                        </div>` : '';
                    const _notesVal2 = ord.order_notes || '';
                    const _notesHtml2 = _notesVal2 ? `
                        <div style="margin-top:6px; background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.25); border-radius:8px; padding:6px 8px;">
                            <b style="color:var(--gold); font-size:10px;"><i class="fas fa-sticky-note"></i> ملاحظتك:</b>
                            <span style="font-size:10px; color:#fff;">${escHtml(_notesVal2)}</span>
                        </div>` : '';
                    _summaryCardEl2.style.display = 'block';
                    const _custOwes = ord.is_free_delivery ? Math.max(0, (parseFloat(ord.total)||0) - (parseFloat(ord.delivery_price)||0)) : (parseFloat(ord.total)||0);
                    _summaryCardEl2.innerHTML = `
                        <div class="card" style="background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.25); border-radius:14px; padding:12px; margin-bottom:10px;">
                            <b style="color:var(--gold); font-size:13px;"><i class="fas fa-store"></i> ${escHtml(ord.restaurant_name || 'المطعم')}</b>
                            ${_itemsHtml2}
                            ${_notesHtml2}
                            <div style="display:flex; justify-content:space-between; font-size:11px; color:#ccc; margin-top:8px; padding-top:6px; border-top:1px dashed rgba(212,175,55,0.2);">
                                <span>🚗 سعر التوصيل</span>${ord.is_free_delivery ? '<b style="color:#2ecc71;">🎁 مجاني عليك</b>' : `<b style="color:#fff;">${Number(ord.delivery_price||0).toLocaleString()} ل.س</b>`}
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:13px; margin-top:4px;">
                                <span style="color:var(--gold); font-weight:bold;">💰 المطلوب منك</span><b style="color:var(--gold); font-size:15px;">${_custOwes.toLocaleString()} ل.س</b>
                            </div>
                        </div>`;
                }
            } catch(_summaryErr2) { console.error('[FIX-CUSTOMER-ORDER-SUMMARY-V2] خطأ:', _summaryErr2); }

            // [FIX-STUCK-ON-COMPLETED] شبكة أمان: هذا الاستطلاع يعمل بالفعل كل 15 ثانية أثناء عرض
            // شاشة التتبع — إن فاتنا حدث Realtime الخاص باكتمال الطلب لأي سبب (انقطاع مؤقت للاتصال
            // اللحظي، تطبيق في الخلفية على أندرويد...)، هذا الفحص المستقل يكتشف الاكتمال بحد أقصى خلال
            // 15 ثانية وينقل العميل تلقائياً دون الحاجة لتحديث الصفحة يدوياً.
            if (ord && ord.status === 'completed' && String(currentOrderKey) === String(ord.id || currentOrderKey)) {
                console.log('[FIX-STUCK-ON-COMPLETED] اكتشاف اكتمال الطلب عبر الاستطلاع الاحتياطي (لم يصل حدث Realtime)');
                widget.style.display = 'none';
                if (typeof updateOrderStatus === 'function') await updateOrderStatus(currentOrderKey, 'completed');
                if (typeof checkOrderAction === 'function') checkOrderAction(currentOrderKey, 'completed');
                return;
            }
            if (!ord || !ord.driver_id || !['accepted', 'preparing', 'ready'].includes(ord.status)) {
                widget.style.display = 'none'; return;
            }
            const { data: pos } = await _supabase.from('sh_admin_tracking').select('lat,lng').eq('id', ord.driver_id).maybeSingle();
            if (!pos || !pos.lat || !pos.lng) { widget.style.display = 'none'; return; }

            let destLat = null, destLng = null, label = '';
            const stage = ord.driver_stage;
            if (stage === 'to_customer' || stage === 'arrived') {
                destLat = parseFloat(ord.lat); destLng = parseFloat(ord.lng);
                if (!destLat || !destLng) {
                    try {
                        const { data: cust } = await _supabase.from('customers').select('lat,lng').eq('id', ord.customer_id).maybeSingle();
                        if (cust && cust.lat && cust.lng) { destLat = parseFloat(cust.lat); destLng = parseFloat(cust.lng); }
                    } catch(e) {}
                }
                label = '⏱ الوقت المتبقي حتى يصلك المندوب 🏠';
            } else {
                destLat = parseFloat(ord.pickup_lat); destLng = parseFloat(ord.pickup_lng);
                label = '⏱ الوقت المتبقي لوصول المندوب للمطعم 🏪';
            }
            if (!destLat || !destLng) { widget.style.display = 'none'; return; }

            const distKm = _haversineKmChat(parseFloat(pos.lat), parseFloat(pos.lng), destLat, destLng);
            // تقدير بمتوسط سرعة 28 كم/سا (مناسب للتوصيل داخل المدينة) — تقدير تقريبي وليس مساراً دقيقاً
            const etaMin = Math.max(1, Math.round((distKm / 28) * 60));
            const distLabel = distKm < 1 ? Math.round(distKm * 1000) + ' م' : distKm.toFixed(1) + ' كم';
            document.getElementById('chat-eta-label').innerText = label;
            document.getElementById('chat-eta-value').innerText = `${etaMin} دقيقة تقريباً (${distLabel})`;
            widget.style.display = 'block';
        } catch(e) {
            widget.style.display = 'none';
        }
    }
    // استطلاع دوري لتحديث الوقت المتبقي كل 15 ثانية + تشغيل فوري عند تحميل الصفحة
    if (window._chatEtaInterval) clearInterval(window._chatEtaInterval);
    window._chatEtaInterval = setInterval(_updateChatEtaWidget, 15000);
    // [INVOICE-REVISION] فحص دوري لطلبات تعديل الفاتورة المعلَّقة كل 8 ثوانٍ — استجابة سريعة بما أن
    // هذا قرار مالي يحتاج العميل لرؤيته فور إرساله من المندوب
    if (window._invRevInterval) clearInterval(window._invRevInterval);
    window._invRevInterval = setInterval(_checkPendingInvoiceRevision, 8000);

    async function checkOrderAction(id, status) {
        // جلب الحالة الحقيقية من السيرفر عند الضغط على الطلب
        const { data: serverOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', id).single();

        // [FIX-EARLIEST-TRACK-BTN] تحديث زر التتبع هنا فوراً، أول شيء بعد جلب الطلب، بمعزل تام (try/catch
        // خاص به) عن أي كود لاحق قد يرمي استثناءً صامتاً ويوقف باقي الدالة قبل الوصول لتحديث الزر
        try {
            if (typeof window._refreshTrackButton === 'function') window._refreshTrackButton(serverOrder);
        } catch(e) { console.error('refreshTrackButton early-call error:', e); }
        try { _updateChatEtaWidget(); } catch(e) {}
        try { _checkPendingInvoiceRevision(); } catch(e) {}

        if(!serverOrder) {
            // الطلب غير موجود في السيرفر — عرض بياناته من السجل المحلي
            const localOrders = getStorage('orders');
            const localOrder = localOrders.find(o => String(o.id) === String(id));
            if(localOrder) {
                // عرض ملخص الطلب السابق من البيانات المحلية
                const _archivedStatuses = ['completed', 'cancelled', 'failed', 'rejected', 'completed_consultation'];
                if (_archivedStatuses.includes(String(localOrder.status).toLowerCase())) {
                    // عرض مودال ملخص الطلب السابق
                    _showArchivedOrderSummary(localOrder);
                    return;
                }
            }
            showNotify("الطلب مكتمل أو تم نقله للسجل", "info");
            renderHistory();
            return;
        }

        currentOrderKey = id;
        localStorage.setItem('shahen_active_order_id', id);
        // [PROGRESS-TRACKER] رسم الشريط فوراً بالحالة الحقيقية الحالية عند فتح الصفحة (وليس فقط عند التحديثات اللاحقة)
        _optLastIndex = -1; // إجبار إعادة الرسم لأن هذا طلب/فتح جديد
        _updateProgressTracker(serverOrder);
        verificationCode = serverOrder.verify_code;
        document.getElementById('reveal-order-code').innerText = verificationCode;
        document.getElementById('client-reveal-code').innerText = verificationCode;

        if (serverOrder.status === 'consulting') {
            // تعديل: إذا كان الطلب في حالة استشارة مخصصة، نظهر شاشة التحميل المخصصة
            if(serverOrder.is_consultation && !serverOrder.driver_id && serverOrder.status === 'consulting') {
                document.getElementById('consulting-status-text').innerText = "جاري التواصل مع " + serverOrder.restaurant_name + "... 🦅";
                document.getElementById('searching-sound').play();
                document.getElementById('eagle-consulting').style.display = 'flex';
                listenConsultStatusOnly(id);
            } else {
                _isConsultChatOpen = false;
                openPharmacyConsultChat(serverOrder);
            }
            return;
        }

        // ===== إصلاح حالة الطلب: إذا الطلب مقبول لكنه لا يزال استشارة (is_consultation=true)، نبقى في واجهة المحادثة مع الصيدلي =====
        if (serverOrder.status === 'accepted' && (serverOrder.is_consultation === true || serverOrder.res_type === 'pharmacy') && !serverOrder.driver_id) {
            _isConsultChatOpen = false;
            openPharmacyConsultChat(serverOrder);
            return;
        }

        // [FIX-ORDER-SCREEN-ROOT-CAUSE] طلبات الاستلام من المطعم لم تكن مُعالَجة إطلاقاً في هذه الدالة
        // من قبل — كانت تسقط في الفرع العام أدناه فتُفتح لها شاشة دردشة المندوب (مع اسم مندوب وهمي!)،
        // وهذا بالضبط سبب "الشاشة الناقصة التي تظهر رقم مندوب فقط" التي وصفها العميل عند فتح طلب
        // استلام من قسم الطلبات. الآن تُفتح لها شاشتها الحقيقية الكاملة (نفس الشاشة التي تظهر بعد
        // موافقة المطعم مباشرة، بكل تفاصيلها: الأصناف، الملاحظات، الموقع، الوقت المتبقي).
        if (serverOrder.service_type === 'pickup') {
            if (['accepted', 'preparing', 'ready'].includes(serverOrder.status)) {
                await _showPickupSuccess(serverOrder);
            } else if (serverOrder.status === 'searching' || serverOrder.status === 'pickup_pending') {
                _showPickupWaiting(serverOrder.restaurant_name || 'المطعم', serverOrder.id, serverOrder.total || 0);
            }
            return;
        }

        // [FIX-ORDER-SCREEN-ROOT-CAUSE] طلب توصيل: status='accepted' يعني أن **المطعم** قبل الطلب
        // وبدأ التجهيز — وهذا يحدث فوراً تلقائياً من لوحة المطعم، وليس بالضرورة أن مندوباً قد استلمه
        // بعد. الفرع العام تحته كان يفترض دائماً وجود مندوب حقيقي ويعرض بطاقة تواصل معه حتى لو لم يكن
        // قد تم تعيين أي مندوب فعلياً بعد (driver_id فارغ) — وهذا يُظهر اسم/رقم مندوب وهمياً ("صقر
        // الشاهين" + رقم دعم افتراضي)، وهو بالضبط سبب اللبس والشاشة "غير الصحيحة". الآن: قبل عرض شاشة
        // المندوب، نتحقق أولاً هل تم تعيين مندوب حقيقي فعلاً.
        if (['accepted', 'preparing', 'ready'].includes(serverOrder.status) && !serverOrder.driver_id) {
            _showRestaurantAcceptedAwaitingDriver(serverOrder);
            return;
        }

        // إذا كان الطلب مقبولاً، نفتح صفحة الدردشة والكود فوراً
        if (['accepted', 'preparing', 'ready'].includes(serverOrder.status)) {
            // [FIX-RENDER-SKIP-BUG] الإصلاح السابق كان يمنع إعادة البناء حتى لو كان صندوق الدردشة فاضياً
            // فعلياً (مثلاً بعد فتح الصفحة من جديد) — وهذا أدى لاختفاء بطاقة التواصل مع المندوب والكود!
            // الحل الصحيح: نتحقق إن كان صندوق الدردشة يحمل فعلاً محتوى مبنياً لنفس هذه الحالة بالضبط
            // (عبر خاصية data- تُضبط فقط عند نجاح البناء الحقيقي)، لا مجرد عدّاد استدعاءات عام قد يتأثر
            // بعمليات الخلفية (Polling/Realtime) التي لا تبني شيئاً بصرياً على الإطلاق
            const _stateKey = String(id) + '|' + serverOrder.status;
            const _chatBoxEl = document.getElementById('chat-box');
            const _isDuplicateState = !!(_chatBoxEl && _chatBoxEl.getAttribute('data-rendered-for') === _stateKey);
            _lastCheckedOrderState = _stateKey;
            nav('p-chat');

            // [FIX-LIGHTWEIGHT-ALWAYS] هذه التحديثات خفيفة وغير مكلفة (لا تتطلب جلب بيانات جديدة أو
            // إعادة بناء HTML ثقيل) — تُنفَّذ دائماً بدون أي شرط، لضمان عدم اختفاء زر التتبع أو رابط
            // الواتساب أو الكود أبداً بسبب فحص التكرار المخصَّص فقط لمنع إعادة بناء صندوق الدردشة الثقيل
            // [BUGFIX-DRIVERWA-UNDEFINED] كان هذا المتغيّر يُستخدَم هنا 3 مرات بدون أي تعريف بهذه
            // الدالة إطلاقاً (كان معرَّفاً فقط بدالة أخرى منفصلة) — يسبب خطأ "driverWA is not defined"
            // يوقف تحديث حالة الطلب بالكامل عند وصول تحديث من الخادم (بما فيها إرسال الطلب نفسه)
            const _driverPhoneOk = /^[0-9+]{7,15}$/.test(serverOrder.driver_phone || '');
            const driverWA = _driverPhoneOk ? serverOrder.driver_phone : '966546083283';
            const driverName = serverOrder.driver_name || "صقر الشاهين 🦅";
            document.getElementById('driver-chat-name').innerText = driverName;
            document.getElementById('driver-chat-phone').innerText = driverWA;
            const _custNameForDriverMsg = (currentUser && currentUser.name) || serverOrder.customer_name || 'العميل';
            const _resNameForDriverMsg = serverOrder.restaurant_name || 'المطعم';
            const _orderIdForDriverMsg = String(serverOrder.id || id).substring(0,8);
            const _custQuickMsg = encodeURIComponent(`مرحباً يا صقر شاهين، أنا ${_custNameForDriverMsg} أتواصل معك بخصوص طلب من مطعم ${_resNameForDriverMsg} — رقم الطلب: ${_orderIdForDriverMsg}.`);
            document.getElementById('call-driver-btn').onclick = () => window.open(`https://wa.me/${driverWA}?text=${_custQuickMsg}`);
            window._persistentWaLink = `https://wa.me/${driverWA}?text=${_custQuickMsg}`;
            document.getElementById('chat-input-area').style.display = 'flex';
            document.getElementById('client-code-notice').style.display = 'block';
            // [FIX-ORDER-DATA-MIXING] السبب الجذري لخلط بيانات الطلبين: كود التحقق كان يُعرَض من متغيّر
            // مشترك واحد (verificationCode) يُستخدَم لكل الطلبات معاً — فإذا كان لدى العميل طلبان نشطان
            // في نفس الوقت، أي تحديث خلفي للطلب الآخر (استطلاع أو اتصال لحظي) كان يُمكن أن يُعيد كتابة
            // هذا المتغيّر المشترك بكود الطلب الآخر، فيظهر للعميل كود طلب مختلف تماماً عن الطلب المعروض
            // فعلياً أمامه. الحل: القراءة دائماً مباشرة من verify_code الخاص بهذا الطلب بالذات (serverOrder)
            // كمصدر الحقيقة الأول، لا من المتغيّر المشترك إطلاقاً إلا كحل أخير عند غيابه فقط.
            document.getElementById('reveal-order-code').innerText = serverOrder.verify_code || verificationCode || '----';
            // [MAPBOX-TRACK] إظهار/إخفاء زر تتبع المندوب حسب توفر مندوب للطلب
            try { if (typeof window._refreshTrackButton === 'function') window._refreshTrackButton(serverOrder); } catch(_e1) { console.error('[FIX-CUSTOMER-ORDER-SUMMARY] خطأ في _refreshTrackButton (لا يوقف باقي الدالة):', _e1); }

            // [FIX-CUSTOMER-ORDER-SUMMARY] هذا القسم انتُقل إلى هنا عمداً (قبل فحص التكرار أدناه) —
            // كان موجوداً سابقاً بعد `if (_isDuplicateState) return;`، مما يعني أنه لا يعمل إلا في أول
            // مرة تُفتح فيها هذه الحالة بالضبط، ويُتجاهَل تماماً في أي استدعاء لاحق لنفس الحالة (كل
            // استطلاع دوري أو تحديث لحظي لاحق، أو حتى إعادة فتح التطبيق لاحقاً بنفس الحالة) — وهذا
            // بالضبط سبب عدم ظهور البطاقة رغم أن الكود يبدو صحيحاً ظاهرياً.
            // [FIX-DEBUG-WRAP] مُغلَّف بالكامل بـ try/catch الآن — أي خطأ غير متوقع هنا سيُسجَّل بوضوح
            // في الكونسول بدل أن يوقف تنفيذ باقي الدالة بصمت تام (وهو احتمال حقيقي لسبب عدم الظهور)
            // [BUGFIX-SCOPE] isPharmacyDeliveryOrder يُعرَّف هنا بالنطاق الخارجي (لا داخل try{} فقط)
            // لأنه يُستخدَم لاحقاً خارج كتلة try — كان هذا يسبب "isPharmacyDeliveryOrder is not defined"
            // ويوقف عرض بطاقة ملخص الطلب وفاتورة الصيدلية للعميل بصمت
            let isPharmacyDeliveryOrder = false;
            try {
                isPharmacyDeliveryOrder = serverOrder.order_type === 'pharmacy' || serverOrder.res_type === 'pharmacy_delivery' || serverOrder.res_type === 'pharmacy';
                const _summaryCardEl = document.getElementById('customer-order-summary-card');
                console.log('[FIX-CUSTOMER-ORDER-SUMMARY] فحص:', { found: !!_summaryCardEl, isPharmacy: isPharmacyDeliveryOrder, items: serverOrder.items, notes: serverOrder.order_notes });
                if (_summaryCardEl && !isPharmacyDeliveryOrder) {
                    let _custItemsArr = [];
                    try { _custItemsArr = typeof serverOrder.items === 'string' ? JSON.parse(serverOrder.items || '[]') : (Array.isArray(serverOrder.items) ? serverOrder.items : []); } catch(e) { _custItemsArr = []; }
                    const _custItemsHtml = _custItemsArr.length ? `
                        <div style="margin-top:8px; padding-top:8px; border-top:1px dashed rgba(212,175,55,0.2);">
                            ${_custItemsArr.map(it => `
                                <div style="display:flex; justify-content:space-between; font-size:11px; color:#eee; padding:3px 0; border-bottom:1px dashed rgba(255,255,255,0.06);">
                                    <span>${escHtml(String((it.p ?? it.price ?? 0) * (it.qty || 1)))} ل.س</span>
                                    <span>${escHtml(it.n || it.name || '')}${(it.qty && it.qty > 1) ? ' <span style="color:var(--gold);">×' + it.qty + '</span>' : ''}</span>
                                </div>`).join('')}
                        </div>` : '';
                    const _custNotesVal = serverOrder.order_notes || '';
                    const _custNotesHtml = _custNotesVal ? `
                        <div style="margin-top:6px; background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.25); border-radius:8px; padding:6px 8px;">
                            <b style="color:var(--gold); font-size:10px;"><i class="fas fa-sticky-note"></i> ملاحظتك:</b>
                            <span style="font-size:10px; color:#fff;">${escHtml(_custNotesVal)}</span>
                        </div>` : '';
                    _summaryCardEl.style.display = 'block';
                    _summaryCardEl.innerHTML = `
                        <div class="card" style="background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.25); border-radius:14px; padding:12px; margin-bottom:10px;">
                            <b style="color:var(--gold); font-size:13px;"><i class="fas fa-store"></i> ${escHtml(serverOrder.restaurant_name || 'المطعم')}</b>
                            ${_custItemsHtml}
                            ${_custNotesHtml}
                            <div style="display:flex; justify-content:space-between; font-size:11px; color:#ccc; margin-top:8px; padding-top:6px; border-top:1px dashed rgba(212,175,55,0.2);">
                                <span>🚗 سعر التوصيل</span><b style="color:#fff;">${Number(serverOrder.delivery_price||0).toLocaleString()} ل.س</b>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:13px; margin-top:4px;">
                                <span style="color:var(--gold); font-weight:bold;">💰 الإجمالي</span><b style="color:var(--gold); font-size:15px;">${Number(serverOrder.total||0).toLocaleString()} ل.س</b>
                            </div>
                        </div>`;
                    console.log('[FIX-CUSTOMER-ORDER-SUMMARY] تم بناء البطاقة بنجاح');
                } else if (_summaryCardEl) {
                    _summaryCardEl.style.display = 'none';
                    console.log('[FIX-CUSTOMER-ORDER-SUMMARY] البطاقة مخفية (طلب صيدلية أو لم يُعثر على العنصر)');
                }
            } catch(_summaryErr) {
                console.error('[FIX-CUSTOMER-ORDER-SUMMARY] خطأ غير متوقع أثناء بناء بطاقة الملخص:', _summaryErr);
            }

            if (_isDuplicateState) return;
            if (_chatBoxEl) _chatBoxEl.setAttribute('data-rendered-for', _stateKey);

            // إخفاء منطقة تنبيه المطعم لطلبات الصيدلية (الفاتورة تظهر في بطاقة مستقلة أدناه)
            // الأولوية لـ order_type الثابت في قاعدة البيانات
            const _isPharmacyNotif = serverOrder.order_type === 'pharmacy' || serverOrder.res_type === 'pharmacy_delivery' || serverOrder.res_type === 'pharmacy';
            document.getElementById('restaurant-notif-area').style.display = _isPharmacyNotif ? 'none' : 'block';
            if (!_isPharmacyNotif && serverOrder.restaurant_note) document.getElementById('res-notif-msg').innerText = serverOrder.restaurant_note;

            // ===== إضافة المبلغ النهائي في خانة الكود لطلبات الصيدلية فقط =====
            const _isPharmacyForCode = serverOrder.order_type === 'pharmacy' || serverOrder.res_type === 'pharmacy_delivery' || serverOrder.res_type === 'pharmacy';
            const _codeNoticeEl = document.getElementById('client-code-notice');
            const _oldAmountEl = document.getElementById('pharmacy-amount-in-code');
            if (_oldAmountEl) _oldAmountEl.remove();
            // تم إزالة عرض مستطيل المبلغ من واجهة العميل

            // ===== إصلاح: عرض الفاتورة للعميل إذا كان طلب صيدلية — مخفية مع زر استعراض =====
            // الأولوية لـ order_type الثابت في قاعدة البيانات
            let pharmacyInvoiceCardHTML = '';
            if (isPharmacyDeliveryOrder) {
                // --- استخراج أرقام الفاتورة بدقة ---
                // serverOrder.total = الإجمالي الكامل (صيدلية + توصيل + استشارة)
                // serverOrder.delivery_price = سعر التوصيل فقط
                // serverOrder.consultation_fee = رسوم الاستشارة
                // فاتورة الصيدلية = الإجمالي - التوصيل - الاستشارة
                const _phGrand = Number(serverOrder.total || 0);
                const _phDeliv = Number(serverOrder.delivery_price || 0);
                const _phConsult = Number(serverOrder.consultation_fee || 0);
                const _phOnly  = Math.max(0, _phGrand - _phDeliv - _phConsult); // فاتورة الصيدلية فقط

                // --- بناء سطور تفاصيل الرسائل (نتجاهل الأسطر الحسابية ونعرض فقط تفاصيل الأدوية) ---
                let _detailLines = '';
                if (serverOrder.restaurant_note) {
                    const _skipPatterns = ['فاتورة الصيدلية', 'سعر التوصيل', 'المبلغ المقبوض', 'كود التحقق', 'العميل:', 'العنوان:', 'PHARMACY_TOTAL', '────', '─────', '----'];
                    const _rawLines = serverOrder.restaurant_note.split('\n')
                        .filter(l => {
                            const trimmed = l.trim();
                            if (!trimmed) return false;
                            return !_skipPatterns.some(p => trimmed.includes(p));
                        });
                    _detailLines = _rawLines.map(l =>
                        `<div style="padding:3px 0; font-size:11px; color:#ddd; border-bottom:1px solid rgba(255,255,255,0.07);">${l}</div>`
                    ).join('');
                }

                // --- بطاقة الفاتورة مخفية بزر استعراض ---
                pharmacyInvoiceCardHTML = `
                <div style="background:rgba(30,10,30,0.95); border:1px solid var(--gold); border-radius:14px; padding:12px; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="fas fa-prescription-bottle-alt" style="color:var(--gold); font-size:14px;"></i>
                            <b style="color:var(--gold); font-size:12px;">فاتورة طلب الصيدلية</b>
                        </div>
                        <button id="ph-toggle-btn" onclick="(function(){var b=document.getElementById('ph-inv-body');var btn=document.getElementById('ph-toggle-btn');if(b.style.display==='none'){b.style.display='block';btn.innerText='إخفاء ▲';}else{b.style.display='none';btn.innerText='استعراض ▼';}})()" style="background:rgba(212,175,55,0.15); color:var(--gold); border:1px solid var(--gold); border-radius:8px; padding:4px 10px; font-size:10px; cursor:pointer; font-weight:bold;">استعراض ▼</button>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; padding:6px 0;">
                        <span style="color:var(--gold); font-weight:bold;">💰 المبلغ الإجمالي</span>
                        <b style="color:var(--gold); font-size:15px;">${_phGrand.toLocaleString()} ل.س</b>
                    </div>
                    <div id="ph-inv-body" style="display:none; margin-top:8px; border-top:1px solid rgba(212,175,55,0.2); padding-top:8px;">
                        <div style="display:flex; justify-content:space-between; font-size:11px; padding:4px 0; border-bottom:1px solid rgba(212,175,55,0.1);">
                            <span style="color:#aaa;">🏥 فاتورة الصيدلية</span>
                            <b style="color:#fff;">${_phOnly.toLocaleString()} ل.س</b>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:11px; padding:4px 0; border-bottom:1px solid rgba(212,175,55,0.1);">
                            <span style="color:#aaa;">🛵 سعر التوصيل</span>
                            <b style="color:#fff;">${_phDeliv.toLocaleString()} ل.س</b>
                        </div>
                        ${_phConsult > 0 ? `<div style="display:flex; justify-content:space-between; font-size:11px; padding:4px 0; border-bottom:1px solid rgba(212,175,55,0.1);">
                            <span style="color:#f39c12;">🩺 رسوم الاستشارة</span>
                            <b style="color:#f39c12;">${_phConsult.toLocaleString()} ل.س</b>
                        </div>` : ''}
                        ${_detailLines ? `<div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:8px; margin-top:8px;">${_detailLines}</div>` : ''}
                    </div>
                </div>`;
            }
            
            // ===== [GENERAL-INVOICE] بناء فاتورة عامة لجميع أنواع الطلبات غير الصيدلية =====
            let generalInvoiceCardHTML = '';
            if (!isPharmacyDeliveryOrder) {
                const _gTotal     = Number(serverOrder.total || 0);
                const _gDelivery  = Number(serverOrder.delivery_price || 0);
                const _gItemsVal  = Math.max(0, _gTotal - _gDelivery);
                const _gResName   = serverOrder.restaurant_name || serverOrder.res || 'المتجر';
                // استخراج الأصناف من حقل items
                let _gItemsRows = '';
                try {
                    const _gItems = typeof serverOrder.items === 'string' ? JSON.parse(serverOrder.items || '[]') : (serverOrder.items || []);
                    if (_gItems && _gItems.length > 0) {
                        _gItemsRows = _gItems.map(it => {
                            const _iName = it.n || it.name || 'صنف';
                            const _iPrice = Number(it.p || it.price || 0).toLocaleString();
                            const _iQty   = it.q || it.qty || it.quantity || 1;
                            return `<div style="display:flex; justify-content:space-between; font-size:11px; padding:3px 0; border-bottom:1px solid rgba(255,255,255,0.06); color:#ddd;">
                                <span>${_iName}${_iQty > 1 ? ' × ' + _iQty : ''}</span>
                                <b style="color:#fff;">${_iPrice} ل.س</b>
                            </div>`;
                        }).join('');
                    }
                } catch(_e) {}
                generalInvoiceCardHTML = `
                <div style="background:rgba(30,10,30,0.95); border:1px solid var(--gold); border-radius:14px; padding:12px; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="fas fa-receipt" style="color:var(--gold); font-size:14px;"></i>
                            <b style="color:var(--gold); font-size:12px;">فاتورة طلبك — ${_gResName}</b>
                        </div>
                        <button id="gen-inv-toggle-btn" onclick="(function(){var b=document.getElementById('gen-inv-body');var btn=document.getElementById('gen-inv-toggle-btn');if(b.style.display==='none'){b.style.display='block';btn.innerText='إخفاء ▲';}else{b.style.display='none';btn.innerText='استعراض ▼';}})()" style="background:rgba(212,175,55,0.15); color:var(--gold); border:1px solid var(--gold); border-radius:8px; padding:4px 10px; font-size:10px; cursor:pointer; font-weight:bold;">استعراض ▼</button>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; padding:6px 0;">
                        <span style="color:var(--gold); font-weight:bold;">💰 الإجمالي الكامل</span>
                        <b style="color:var(--gold); font-size:15px;">${_gTotal.toLocaleString()} ل.س</b>
                    </div>
                    <div id="gen-inv-body" style="display:none; margin-top:8px; border-top:1px solid rgba(212,175,55,0.2); padding-top:8px;">
                        ${_gItemsRows ? `<div style="margin-bottom:8px;">${_gItemsRows}</div>` : ''}
                        <div style="display:flex; justify-content:space-between; font-size:11px; padding:4px 0; border-bottom:1px solid rgba(212,175,55,0.1);">
                            <span style="color:#aaa;">🛵 سعر التوصيل</span>
                            <b style="color:#fff;">${_gDelivery.toLocaleString()} ل.س</b>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:12px; padding:6px 0; font-weight:bold;">
                            <span style="color:var(--gold);">🧾 الإجمالي</span>
                            <b style="color:var(--gold);">${_gTotal.toLocaleString()} ل.س</b>
                        </div>
                    </div>
                </div>`;
            }
            // ===== [END-GENERAL-INVOICE] =====
            
            document.getElementById('chat-box').innerHTML = pharmacyInvoiceCardHTML + generalInvoiceCardHTML + `
                ${serverOrder.order_details && serverOrder.res_type === 'wassayni' ? `<div style="background:rgba(52,152,219,0.1); border:1px solid rgba(52,152,219,0.3); border-radius:14px; padding:12px; margin-bottom:10px; direction:rtl; text-align:right;"><b style="color:#3498db; display:block; font-size:12px; margin-bottom:6px;"><i class='fas fa-file-alt'></i> تفاصيل الطلب:</b><div style="font-size:12px; color:#ddd; line-height:1.7; white-space:pre-wrap;">${escHtml(serverOrder.order_details)}</div></div>` : ''}
                <div class="card" style="text-align:center; background:rgba(212,175,55,0.1); border:1px solid var(--gold); border-radius:20px; padding:15px;">
                <i class="fas fa-motorcycle fa-2x" style="color:var(--gold); margin-bottom:12px;"></i>
                <h3 style="color:#fff; font-size:15px;">الصقر في الطريق إليك!</h3>
                <p style="font-size:11px; color:#ccc; margin-bottom:12px;">كود التحقق (سيطلبه المندوب):</p>
                <div style="background:#000; border:2px dashed var(--gold); border-radius:12px; padding:12px; font-size:28px; font-weight:bold; letter-spacing:8px; color:var(--gold); margin-bottom:15px;">${verificationCode}</div>
                <button class="btn-gold" style="background:#25d366; color:#fff; font-size:12px; padding:10px;" onclick="window.open('https://wa.me/${driverWA}?text=${_custQuickMsg}')">
                    <i class="fab fa-whatsapp"></i> تواصل مع الصقر
                </button>
            </div>`;

            // تعديل: تفعيل الاستماع للرسائل في الوقت الفعلي لدردشة المندوب العادي
            _consultMsgIds.clear();
            // تعديل: جلب الرسائل القديمة أولاً قبل تفعيل الـ listener
            let { data: driverOldMsgs } = await _supabase
                .from('sh_messages')
                .select('*')
                .eq('order_id', isNaN(id) ? id : Number(id))
                .order('created_at', { ascending: true });
            driverOldMsgs = _stripStatusMsgs(driverOldMsgs);
            if (driverOldMsgs && driverOldMsgs.length > 0) {
                const chatBoxOld = document.getElementById('chat-box');
                driverOldMsgs.forEach(m => {
                    _consultMsgIds.add(m.id);
                    _appendOrderMsg(chatBoxOld, m);
                });
                chatBoxOld.scrollTop = chatBoxOld.scrollHeight;
            }
            const orderIdForChannel = isNaN(id) ? id : Number(id);
            if (_consultChatChannel) _supabase.removeChannel(_consultChatChannel);
            // تعديل: إزالة الـ filter لتجاوز مشكلة Realtime، والمقارنة تصير في الكود
            _consultChatChannel = _supabase.channel('driver_chat_' + id)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'sh_messages'
                }, payload => {
                    const m = payload.new;
                    // تعديل: مقارنة order_id بعد تحويل النوعين لنص
                    if (String(m.order_id) !== String(id)) return;
                    if (_consultMsgIds.has(m.id)) return;
                    _consultMsgIds.add(m.id);
                    // [FIX-HIDE-STATUS-MSG-DRIVER-RT] حجب إضافي هنا أيضاً (احتياط) قبل أي معالجة أخرى
                    if (m.message && m.message.includes(_STATUS_TAG)) { return; }
                    if (m.sender !== 'client') {
                        const chatBoxLive = document.getElementById('chat-box');
                        _appendOrderMsg(chatBoxLive, m);
                        chatBoxLive.scrollTop = chatBoxLive.scrollHeight;
                        showNotify((m.message && m.message.startsWith(_STATUS_TAG)) ? "تحديث على حالة طلبك 📦" : "رسالة جديدة من المندوب 💬", "info");
                    }
                })
                .subscribe();

            // تعديل: polling احتياطي كل 3 ثواني لدردشة المندوب العادي
            if (_clientMsgPollInterval) clearInterval(_clientMsgPollInterval);
            const _driverPollId = id;
            _clientMsgPollInterval = setInterval(async () => {
                // [FIX-ORDER-MIX] نفس الإصلاح — لا نطبّق رسائل طلب قديم على شاشة طلب مختلف معروض حالياً
                if (!currentOrderKey || String(currentOrderKey) !== String(_driverPollId)) { clearInterval(_clientMsgPollInterval); return; }
                const { data: pollMsgsRaw2 } = await _supabase.from('sh_messages').select('*').eq('order_id', _driverPollId).order('created_at', { ascending: true });
                const pollMsgs = _stripStatusMsgs(pollMsgsRaw2);
                if (pollMsgs) {
                    let hasNew = false;
                    pollMsgs.forEach(m => {
                        if (_consultMsgIds.has(m.id)) return;
                        _consultMsgIds.add(m.id);
                        if (m.sender !== 'client') {
                            const chatBoxPoll = document.getElementById('chat-box');
                            _appendOrderMsg(chatBoxPoll, m);
                            hasNew = true;
                        }
                    });
                    if (hasNew) { document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight; showNotify("رسالة جديدة من المندوب 💬", "info"); }
                }
            }, 8000);

            // [FIX-PROGRESS-LAG] استطلاع سريع مخصص (كل 4 ثوانٍ) لمزامنة شريط مراحل الطلب فوراً مع حالة
            // المندوب الحقيقية — كان شريط المراحل يعتمد فقط على الاتصال اللحظي بدون أي نسخة احتياطية،
            // فيتأخر أو يتجمّد إذا تعطّل ذلك الاتصال لحظياً
            if (window._progressPollInterval) clearInterval(window._progressPollInterval);
            const _progressPollId = id;
            window._progressPollInterval = setInterval(async () => {
                // [FIX-ORDER-MIX] لا نطبّق أي تحديث إن تغيّر الطلب المعروض حالياً لطلب آخر — يمنع تسرّب
                // بيانات طلب سابق إلى شاشة طلب جديد لو لم تُنظَّف المؤقّتات القديمة لأي سبب
                if (!currentOrderKey || String(currentOrderKey) !== String(_progressPollId)) { clearInterval(window._progressPollInterval); return; }
                try {
                    const { data: freshOrd } = await _supabase.from('sh_public_orders')
                        .select('status,driver_stage,driver_name').eq('id', _progressPollId).maybeSingle();
                    if (freshOrd) {
                        _updateProgressTracker(freshOrd);
                        if (freshOrd.driver_name) {
                            const _dn = document.getElementById('driver-chat-name');
                            if (_dn && _dn.innerText !== freshOrd.driver_name) _dn.innerText = freshOrd.driver_name;
                        }
                        if (freshOrd.status === 'completed' || freshOrd.status === 'cancelled') {
                            clearInterval(window._progressPollInterval);
                        }
                    }
                } catch(e) {}
            }, 4000);

            // [FIX-SYNC-2] polling إضافي للكشف عن إغلاق الطلب (completed) من جهة المندوب
            // يعمل جنباً إلى جنب مع الـ Realtime channel كاحتياطي
            const _driverCompletePollId = id;
            const _driverCompletePoll = setInterval(async () => {
                if (!currentOrderKey || String(currentOrderKey) !== String(_driverCompletePollId)) {
                    clearInterval(_driverCompletePoll); return;
                }
                const { data: _dcp } = await _supabase.from('sh_public_orders')
                    .select('status, driver_name').eq('id', _driverCompletePollId).maybeSingle();
                if (_dcp && _dcp.status === 'completed') {
                    clearInterval(_driverCompletePoll);
                    if (currentOrderKey) { // لم يُعالَج بعد
                        showNotify('✅ تم توصيل طلبك بنجاح! نوفي بعهدكم 🦅');
                        const _rateNameEl = document.getElementById('rate-driver-name');
                        if (_rateNameEl && _dcp.driver_name) _rateNameEl.innerText = _dcp.driver_name;
                        // إغلاق الطلب وعرض التقييم
                        localStorage.removeItem('shahen_active_order_id');
                        _isConsultChatOpen = false;
                        if (_clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
                        currentOrderKey = null;
                        document.getElementById('rating-overlay').style.display = 'flex';
                    }
                }
            }, 6000);

            simulateAccept();
            // [FIX-MISSING-POLL] مسار ترقية الاستشارة لطلب توصيل — كان يفتقد الاستطلاع الاحتياطي أيضاً
            if (currentOrderKey) _startSearchPoll(currentOrderKey);
            return;
        }

        // awaiting_driver أو searching بعد استشارة - شاشة البحث مع الكود
        if (serverOrder.status === 'awaiting_driver' || serverOrder.status === 'searching') {
            document.getElementById('reveal-order-code').innerText = verificationCode;
            document.getElementById('client-reveal-code').innerText = verificationCode;
            document.getElementById('searching-text').innerText = "جاري البحث عن صقر لاستلام طلبك... 🦅";
            startSearching();
            return;
        }
        
        if (serverOrder.status === 'completed') {
            document.getElementById('rating-overlay').style.display = 'flex';
        }
    }

    // توافق: إذا استدعى كود قديم switchHistoryTab بـ 'past' نحوّله لـ 'completed'
    function _legacySwitchTab(tab) {
        if (tab === 'past') switchHistoryTab('completed');
        else switchHistoryTab(tab);
    }

    async function showVerifyCodeToClient() { 
      const { data } = await _supabase.from('sh_public_orders').select('status, driver_name, res_type').eq('id', currentOrderKey).single();
      if(data && data.status === 'completed') {
          // تحديث اسم المندوب في نافذة التقييم قبل عرضها
          const _rateDriverName = document.getElementById('rate-driver-name');
          if(_rateDriverName && data.driver_name) {
              _rateDriverName.innerText = data.driver_name;
          }
          document.getElementById('rating-overlay').style.display = 'flex'; 
      }
      else { showNotify("يرجى الانتظار حتى ينهي الصقر مهمته أولاً 🦅", "error"); }
    }

    function setStars(s) { currentRating = s; document.querySelectorAll('#main-rating-stars i').forEach((st, i) => st.className = i < s ? 'fas fa-star star-active' : 'fas fa-star'); }

    function submitMandatoryRating() {
        if(currentRating === 0) return showNotify("التقييم إجباري", "error");
        // نحفظ ID الطلب قبل تصفيره لأن updateOrderStatus يحتاجه
        const _completedOrderId = currentOrderKey;
        // تحديث الحالة للطلب المكتمل في السجل المحلي وفي قاعدة البيانات
        if (_completedOrderId) {
            // تحديث السجل المحلي مباشرة بدون الانتظار
            let orders = getStorage('orders');
            let _ratedDriverId = null;
            orders = orders.map(o => {
                if(String(o.id) === String(_completedOrderId)) {
                    _ratedDriverId = o.driver_id;
                    if(currentUser) {
                        currentUser.points = (currentUser.points - (o.points_spent || 0)) + (o.points_earned || 0);
                        localStorage.setItem('shahen_user', JSON.stringify(currentUser));
                    }
                    return {...o, status: 'completed'};
                }
                return o;
            });
            setStorage('orders', orders);
            // تحديث قاعدة البيانات بشكل غير متزامن
            _supabase.from('orders').update({ status: 'completed' }).eq('id', _completedOrderId).then();
            // ===== حفظ التقييم في قاعدة البيانات =====
            if (_ratedDriverId && currentRating > 0) {
                // حفظ التقييم في جدول driver_ratings
                _supabase.from('driver_ratings').insert({
                    driver_id: _ratedDriverId,
                    order_id: _completedOrderId,
                    rating: currentRating,
                    customer_id: currentUser ? currentUser.uid : null
                }).then(async () => {
                    // تحديث متوسط التقييم في جدول drivers
                    const { data: allRatings } = await _supabase.from('driver_ratings').select('rating').eq('driver_id', _ratedDriverId);
                    if (allRatings && allRatings.length > 0) {
                        const avgRating = allRatings.reduce((s, r) => s + Number(r.rating), 0) / allRatings.length;
                        await _supabase.from('drivers').update({
                            avg_rating: Math.round(avgRating * 10) / 10,
                            rating_count: allRatings.length
                        }).eq('id', _ratedDriverId);
                    }
                });
                // حفظ التقييم في الطلب نفسه + التعليق النصي (كان موجوداً بالواجهة فقط بدون حفظ فعلي)
                const _ratingCommentVal = (document.getElementById('rating-comment')?.value || '').trim();
                _supabase.from('sh_public_orders').update({ customer_rating: currentRating, customer_rating_comment: _ratingCommentVal || null }).eq('id', _completedOrderId).then();
            }
        }
        cart = []; currentResId = null; try{localStorage.removeItem('shahen_saved_cart');}catch(e){} 
        document.getElementById('badge').innerText = 0;
        document.getElementById('badge').style.display = 'none';
        localStorage.removeItem('shahen_active_order_id');
        _isConsultChatOpen = false;
        if (_clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
        if (_consultChatChannel) { _supabase.removeChannel(_consultChatChannel); _consultChatChannel = null; }
        if (_consultStatusChannel) { _supabase.removeChannel(_consultStatusChannel); _consultStatusChannel = null; }
        if (_orderChannel) { _supabase.removeChannel(_orderChannel); _orderChannel = null; }
        currentOrderKey = null;
        document.getElementById('rating-overlay').style.display = 'none';
        const _rc = document.getElementById('rating-comment'); if (_rc) _rc.value = '';
        showNotify("شكراً لتقييمك يا شاهين 🦅");
        _historyTab = 'completed';
        historyTab = 'past';
        nav('p-history');
    }

    let _sendMsgPending = false; // [FIX-C5]
    async function sendMsg() {
        const inp = document.getElementById('m-inp');
        const text = inp.value.trim();
        if (!text || _sendMsgPending) return;
        // [SEC-FIX-RATELIMIT] منع السبام في الدردشة
        const _nowMsg = Date.now();
        if (_nowMsg - _lastMsgTime < _MSG_MIN_INTERVAL_MS) return;
        _lastMsgTime = _nowMsg;
        // [SEC-FIX-INPUT] تحديد الحد الأقصى لطول الرسالة
        if (text.length > 1000) return showNotify('الرسالة طويلة جداً (الحد 1000 حرف)', 'error');
        _sendMsgPending = true;
        inp.value = '';

        const chatBox = document.getElementById('chat-box');
        const d = document.createElement('div');
        d.className = "chat-msg chat-out";
        d.innerText = text;
        chatBox.appendChild(d);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            if (currentOrderKey) {
                // تعديل: إرسال order_id كنص مباشرة بدون تحويل لـ Number لدعم UUID والأرقام معاً
                const orderIdToSend = isNaN(currentOrderKey) ? currentOrderKey : Number(currentOrderKey);
                const { data: saved, error: msgErr } = await _supabase.from('sh_messages').insert({
                    order_id: orderIdToSend,
                    sender: 'client',
                    message: text
                }).select().single();
                if (msgErr) {
                    // [FIX-C5] console.error محذوف في الإنتاج
                    showNotify("فشل إرسال الرسالة، حاول مجدداً ❌", "error");
                    inp.value = text;
                    chatBox.removeChild(d);
                }
                if (saved) _consultMsgIds.add(saved.id);
            }
        } catch(e) {
            showNotify("فشل إرسال الرسالة، تحقق من الاتصال ❌", "error");
            inp.value = text;
            if (d.parentNode) chatBox.removeChild(d);
        } finally {
            _sendMsgPending = false; // [FIX-AUDIT-2] ضمان فتح القفل دائماً حتى عند خطأ شبكة غير متوقع
        }
    }

    // ===== [FIX-MAX-2-ADDRESSES] نظام العناوين المحفوظة — عنوانان كحد أقصى فقط: أساسي وفرعي =====
    let _addressPickerMap = null;
    let _addressPickerCoords = null; // { lat, lng } آخر مركز مستقر للخريطة

    async function loadSavedAddresses() {
        const listEl = document.getElementById('saved-addresses-list');
        if (!listEl || !currentUser) return;
        listEl.innerHTML = '<div style="text-align:center; padding:10px; color:#888; font-size:11px;"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</div>';
        try {
            const { data, error } = await _supabase.from('customer_addresses').select('*').eq('customer_id', currentUser.uid).order('created_at', { ascending: true });
            if (error) { listEl.innerHTML = '<div style="text-align:center; color:#e74c3c; font-size:11px;">تعذّر تحميل العناوين</div>'; return; }
            window._savedAddressesCache = data || [];
            if (!data || data.length === 0) {
                listEl.innerHTML = '<div style="text-align:center; color:#888; font-size:11px; padding:8px;">لا توجد عناوين محفوظة بعد</div>';
            } else {
                listEl.innerHTML = data.map(addr => `
                    <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:6px; ${addr.is_default ? 'border:1px solid var(--gold);' : ''}">
                        <div style="flex:1; text-align:right;">
                            <b style="color:var(--gold); font-size:12px;"><i class="fas fa-map-pin"></i> ${escHtml(addr.label)} ${addr.is_default ? '<span style="font-size:9px; color:var(--gold);">(رئيسي)</span>' : ''}</b>
                            ${addr.address_text ? `<div style="font-size:10px; color:#ccc; margin-top:2px;">${escHtml(addr.address_text)}</div>` : ''}
                        </div>
                        <i class="fas fa-star" style="color:${addr.is_default ? 'var(--gold)' : '#555'}; font-size:14px; cursor:pointer; padding:6px;" title="تعيين كعنوان رئيسي" onclick="setDefaultAddress(${addr.id})"></i>
                        <i class="fas fa-trash" style="color:#e74c3c; font-size:13px; cursor:pointer; padding:6px;" onclick="deleteSavedAddress(${addr.id})"></i>
                    </div>`).join('');
            }
            // إخفاء زر الإضافة إن وصل الحد الأقصى (3 عناوين)
            const addBtn = document.getElementById('add-address-btn');
            if (addBtn) addBtn.style.display = (data && data.length >= 2) ? 'none' : 'block'; // [FIX-MAX-2-ADDRESSES] عنوانان كحد أقصى: أساسي وفرعي فقط
        } catch(e) {
            listEl.innerHTML = '<div style="text-align:center; color:#e74c3c; font-size:11px;">حدث خطأ غير متوقع</div>';
        }
    }

    function openAddAddressModal() {
        const count = (window._savedAddressesCache || []).length;
        if (count >= 2) { showNotify('⚠️ يمكنك حفظ عنوانين كحد أقصى فقط (أساسي وفرعي) — احذف أحدهما أولاً', 'error'); return; }
        document.getElementById('add-address-modal').style.display = 'flex';
        document.getElementById('new-address-text').value = '';
        document.getElementById('new-address-label').value = '';
        setTimeout(_initAddressPickerMap, 100); // بعد ظهور العنصر بالكامل حتى تُحسَب أبعاده بشكل صحيح
    }

    function closeAddAddressModal() {
        document.getElementById('add-address-modal').style.display = 'none';
    }

    function _initAddressPickerMap() {
        const startLat = (userLoc && userLoc.lat) || 35.13;
        const startLng = (userLoc && userLoc.lng) || 36.75;
        _addressPickerCoords = { lat: startLat, lng: startLng };
        if (!_addressPickerMap) {
            _addressPickerMap = L.map('address-map-picker', { zoomControl: true, attributionControl: false }).setView([startLat, startLng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(_addressPickerMap);
            // [FIX-SAVED-ADDRESSES] الدبوس ثابت في منتصف الشاشة (نمط شائع وسهل)، والخريطة نفسها تتحرك
            // تحته — نتتبّع مركز الخريطة الحالي كإحداثيات الموقع المختار في كل مرة يتوقف تحريكها
            _addressPickerMap.on('moveend', () => {
                const c = _addressPickerMap.getCenter();
                _addressPickerCoords = { lat: c.lat, lng: c.lng };
            });
        } else {
            _addressPickerMap.invalidateSize();
            _addressPickerMap.setView([startLat, startLng], 15);
        }
    }

    function _useCurrentLocationForAddress() {
        if (!navigator.geolocation) { showNotify('المتصفح لا يدعم تحديد الموقع', 'error'); return; }
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            _addressPickerCoords = { lat: latitude, lng: longitude };
            if (_addressPickerMap) _addressPickerMap.setView([latitude, longitude], 16);
        }, () => showNotify('تعذّر جلب موقعك الحالي', 'error'), { enableHighAccuracy: true });
    }

    async function saveNewAddress() {
        if (!currentUser) return;
        const label = document.getElementById('new-address-label').value.trim();
        const addressText = document.getElementById('new-address-text').value.trim();
        if (!label) { showNotify('يرجى كتابة اسم مختصر للعنوان (مثل: المنزل)', 'error'); return; }
        if (!_addressPickerCoords) { showNotify('يرجى تحديد الموقع من الخريطة أولاً', 'error'); return; }
        const count = (window._savedAddressesCache || []).length;
        if (count >= 2) { showNotify('⚠️ يمكنك حفظ عنوانين كحد أقصى فقط (أساسي وفرعي)', 'error'); return; }
        try {
            // [SEC-FIX-AUTH-UID-MISMATCH] استخدام هوية الجلسة الحقيقية اللحظية بدل currentUser.uid
            // المخزَّن محلياً — لو تعدّدت الحسابات المُجرَّبة بنفس المتصفح، القيمة المخزَّنة محلياً قد
            // تكون قديمة/غير مطابقة للجلسة الفعلية الحالية، فترفض قاعدة البيانات العملية RLS رغم أن
            // المستخدم مسجّل دخوله فعلياً وبشكل صحيح
            const { data: _authData, error: _authErr } = await _supabase.auth.getUser();
            if (_authErr || !_authData || !_authData.user) {
                showNotify('⚠️ انتهت صلاحية جلستك، يرجى تسجيل الدخول من جديد', 'error');
                return;
            }
            const _realCustomerId = _authData.user.id;
            const { error } = await _supabase.from('customer_addresses').insert([{
                customer_id: _realCustomerId,
                label: label,
                address_text: addressText || null,
                lat: _addressPickerCoords.lat,
                lng: _addressPickerCoords.lng
            }]);
            if (error) { showNotify('⚠️ تعذّر حفظ العنوان: ' + error.message, 'error'); return; }
            showNotify('✅ تم حفظ العنوان بنجاح');
            closeAddAddressModal();
            loadSavedAddresses();
        } catch(e) {
            showNotify('⚠️ خطأ غير متوقع أثناء الحفظ', 'error');
        }
    }

    async function deleteSavedAddress(id) {
        if (!confirm('هل تريد حذف هذا العنوان؟')) return;
        try {
            const { error } = await _supabase.from('customer_addresses').delete().eq('id', id);
            if (error) { showNotify('⚠️ تعذّر حذف العنوان', 'error'); return; }
            showNotify('✅ تم حذف العنوان');
            loadSavedAddresses();
        } catch(e) { showNotify('⚠️ خطأ غير متوقع', 'error'); }
    }

    // [FIX-CART-ADDRESS-PICKER] تعيين عنوان كرئيسي/افتراضي — نُلغي الافتراضي عن أي عنوان آخر أولاً
    async function setDefaultAddress(id) {
        if (!currentUser) return;
        try {
            await _supabase.from('customer_addresses').update({ is_default: false }).eq('customer_id', currentUser.uid);
            const { error } = await _supabase.from('customer_addresses').update({ is_default: true }).eq('id', id);
            if (error) { showNotify('⚠️ تعذّر التعيين: ' + error.message, 'error'); return; }
            showNotify('⭐ تم تعيين العنوان كرئيسي');
            loadSavedAddresses();
            if (typeof _loadCartAddressPicker === 'function') _loadCartAddressPicker();
        } catch(e) { showNotify('⚠️ خطأ غير متوقع', 'error'); }
    }

    // [FIX-SAVED-ADDRESSES] استخدام عنوان محفوظ كموقع تسليم للطلب الحالي — يُستدعى من شاشة السلة
    function useSavedAddressForOrder(id, silent) {
        const addr = (window._savedAddressesCache || []).find(a => a.id === id);
        if (!addr) return;
        userLoc = { lat: parseFloat(addr.lat), lng: parseFloat(addr.lng) };
        if (currentUser) currentUser.address = addr.address_text || addr.label;
        // [BUGFIX-ADDRESS-PRIORITY] السبب الجذري الحقيقي لباغ "العنوان الخاطئ عند المندوب": نص العنوان
        // كان يتحدّث صح، لكن إحداثيات الخريطة (lat/lng) اللي المندوب يستخدمها فعلياً للملاحة كانت
        // تبقى بالموقع الافتراضي القديم لأن currentUser.lat/lng ما كانت تتحدّث هنا إطلاقاً. الآن نحدّثها
        // معاً حتى يتطابق دبوس الخريطة مع نص العنوان المُختار فعلياً بنفس اللحظة
        if (currentUser) { currentUser.lat = userLoc.lat; currentUser.lng = userLoc.lng; }
        window._selectedCartAddressId = id;
        if (!silent) showNotify('📍 تم اختيار عنوان "' + addr.label + '" للتوصيل');
    }
    window.useSavedAddressForOrder = useSavedAddressForOrder;

    // [FIX-CART-ADDRESS-PICKER] عرض واختيار عنوان التوصيل مباشرة من داخل السلة، قبل تأكيد الطلب —
    // يُحمَّل بشكل مستقل وسريع (استعلام خفيف واحد فقط)، ولا يعيد تحميل الصفحة عند التبديل بين العناوين
    async function _loadCartAddressPicker() {
        const container = document.getElementById('cart-address-picker-container');
        if (!container || !currentUser) return;
        container.innerHTML = '<div class="card" style="padding:10px; text-align:center; color:#888; font-size:11px;"><i class="fas fa-spinner fa-spin"></i> جاري تحميل عناوينك...</div>';
        try {
            const { data, error } = await _supabase.from('customer_addresses').select('*').eq('customer_id', currentUser.uid).order('created_at', { ascending: true });
            if (error) { container.innerHTML = ''; return; }
            window._savedAddressesCache = data || [];

            if (!data || data.length === 0) {
                // [FIX-CART-ADDRESS-PICKER] لا توجد عناوين محفوظة — طلب صريح لإضافة عنوان قبل إكمال الطلب
                container.innerHTML = `
                    <div class="card" style="background:rgba(231,76,60,0.1); border:1px solid #e74c3c; margin-bottom:10px; padding:12px; text-align:center;">
                        <p style="margin:0 0 8px; font-size:11px; color:#e74c3c;"><i class="fas fa-map-marker-alt"></i> لا يوجد لديك أي عنوان محفوظ بعد. يرجى إضافة عنوان لإتمام الطلب.</p>
                        <button class="btn-gold" style="font-size:11px; padding:8px 16px;" onclick="nav('p-profile'); setTimeout(openAddAddressModal, 300);"><i class="fas fa-plus-circle"></i> إضافة عنوان الآن</button>
                    </div>`;
                window._selectedCartAddressId = null;
                return;
            }

            // اختيار العنوان الافتراضي تلقائياً (أو أول عنوان إن لم يوجد افتراضي مُعيَّن)
            const defaultAddr = data.find(a => a.is_default) || data[0];
            if (!window._selectedCartAddressId || !data.some(a => a.id === window._selectedCartAddressId)) {
                useSavedAddressForOrder(defaultAddr.id, true);
            }

            container.innerHTML = `
                <div class="card" style="padding:10px; margin-bottom:10px;">
                    <p style="margin:0 0 8px; font-size:11px; color:var(--gold); font-weight:bold;"><i class="fas fa-map-marker-alt"></i> عنوان التوصيل:</p>
                    <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
                        ${data.map(addr => `
                            <button onclick="selectCartAddress(${addr.id})" data-addr-id="${addr.id}" class="cart-addr-chip" style="flex-shrink:0; white-space:nowrap; padding:8px 14px; border-radius:20px; font-size:11px; cursor:pointer; ${window._selectedCartAddressId === addr.id ? 'background:var(--gold); color:#000; border:1px solid var(--gold); font-weight:bold;' : 'background:rgba(255,255,255,0.06); color:#ccc; border:1px solid rgba(255,255,255,0.15);'}">
                                <i class="fas fa-map-pin"></i> ${escHtml(addr.label)}${addr.is_default ? ' ⭐' : ''}
                            </button>`).join('')}
                        <!-- [FIX-MAX-2-ADDRESSES] زر "جديد" يظهر فقط إن كان لديه أقل من عنوانين — كان
                             يظهر سابقاً دائماً بغض النظر عن العدد الفعلي المحفوظ -->
                        ${data.length < 2 ? `
                        <button onclick="nav('p-profile'); setTimeout(openAddAddressModal, 300);" style="flex-shrink:0; white-space:nowrap; padding:8px 14px; border-radius:20px; font-size:11px; cursor:pointer; background:transparent; color:var(--gold); border:1px dashed var(--gold);">
                            <i class="fas fa-plus"></i> جديد
                        </button>` : ''}
                    </div>
                </div>`;
        } catch(e) {
            container.innerHTML = '';
        }
    }
    window._loadCartAddressPicker = _loadCartAddressPicker;

    // [FIX-CART-ADDRESS-PICKER] اختيار عنوان من داخل السلة — تحديث فوري وسلس دون أي إعادة تحميل للصفحة
    function selectCartAddress(id) {
        useSavedAddressForOrder(id);
        // تحديث شكل الأزرار فوراً (بلا إعادة رسم كامل للسلة) لإحساس فوري وسلس
        document.querySelectorAll('.cart-addr-chip').forEach(chip => {
            const isSelected = parseInt(chip.getAttribute('data-addr-id')) === id;
            chip.style.background = isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.06)';
            chip.style.color = isSelected ? '#000' : '#ccc';
            chip.style.border = isSelected ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)';
            chip.style.fontWeight = isSelected ? 'bold' : 'normal';
        });
    }
    window.selectCartAddress = selectCartAddress;

    // [FIX-CUSTOMER-INFO-COLLAPSE] إظهار/إخفاء بطاقة معلومات الحساب الشخصية
    function _toggleMyAccountInfo() {
        const card = document.getElementById('my-account-info-card');
        const chevron = document.getElementById('my-account-info-chevron');
        if (!card) return;
        const isHidden = card.style.display === 'none';
        card.style.display = isHidden ? 'block' : 'none';
        if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    window._toggleMyAccountInfo = _toggleMyAccountInfo;

    function initProfileMap() {
        if(!profileMap) {
            profileMap = L.map('profile-map-view', {zoomControl: false, attributionControl: false}).setView([userLoc.lat, userLoc.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(profileMap);
            mapMarker = L.marker([userLoc.lat, userLoc.lng]).addTo(profileMap);
        } else {
            profileMap.setView([userLoc.lat, userLoc.lng], 13);
            if(mapMarker) mapMarker.setLatLng([userLoc.lat, userLoc.lng]);
        }
    }

    function updateGPSProfile() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                userLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
                if(profileMap) {
                    profileMap.setView([userLoc.lat, userLoc.lng], 16);
                    if(mapMarker) profileMap.removeLayer(mapMarker);
                    mapMarker = L.marker([userLoc.lat, userLoc.lng]).addTo(profileMap);
                }
            }, () => showNotify("فشل جلب الموقع", "error"), { enableHighAccuracy: true });
        }
    }

    async function saveMapSelection() {
        if(!currentUser) return;
        // ===== FIX-LOC-2: حفظ الإحداثيات الحقيقية من userLoc =====
        const _saveLat = currentUser.lat || userLoc.lat;
        const _saveLng = currentUser.lng || userLoc.lng;
        const { error } = await _supabase.from('customers').update({ 
            lat: _saveLat, 
            lng: _saveLng,
            address: currentUser.address 
        }).eq('id', currentUser.uid);
        if(!error) { 
            currentUser.lat = _saveLat;
            currentUser.lng = _saveLng;
            localStorage.setItem('shahen_user', JSON.stringify(currentUser)); 
            document.getElementById('my-address').innerText = currentUser.address;
            showNotify('تم حفظ موقعك بإحداثيات دقيقة GPS ✅'); 
        }
    }

    let _wassayniPending = false; // [FIX-C3]
    // [LOC-CHOICE] متغير اختيار الموقع في وصيني
    window._wassayniLocEnabled = true; // افتراضي: الموقع مفعّل
    // [WASSAYNI-PRICE] السعر الأساسي لخدمة وصيني (يُحدَّث من إعدادات الإدارة)
    window._wassayniBasePrice = 25000; // القيمة الافتراضية 25,000 ل.س
    // [WASSAYNI-EXTRA-PRICE] سعر كل مكان إضافي
    const _WASSAYNI_EXTRA_PER_LOC = 10000;
    // [WASSAYNI-LOC-COUNT] عدد المكانات الحالية
    let _wassayniLocCount = 1;

    // [WASSAYNI-PRICE-CALC] حساب وعرض سعر التوصيل
    function calcWassayniPrice() {
        const base = window._wassayniBasePrice || 25000;
        const extraPerLoc = window._wassayniExtraPriceFromAdmin || _WASSAYNI_EXTRA_PER_LOC;
        const extra = (_wassayniLocCount - 1) * extraPerLoc;
        const total = base + extra;
        const priceEl = document.getElementById('wassayni-price-display');
        const detailsEl = document.getElementById('wassayni-price-details');
        if (priceEl) priceEl.innerText = total.toLocaleString() + ' ل.س';
        if (detailsEl) {
            if (_wassayniLocCount === 1) {
                detailsEl.innerText = 'مكان واحد — السعر الأساسي';
            } else {
                detailsEl.innerText = _wassayniLocCount + ' أماكن — ' + base.toLocaleString() + ' + ' + extra.toLocaleString() + ' ل.س';
            }
        }
        return total;
    }

    // [WASSAYNI-ADD-LOC] إضافة مكان جديد
    function addWassayniLocation() {
        _wassayniLocCount++;
        const list = document.getElementById('wassayni-locations-list');
        if (!list) return;
        const idx = _wassayniLocCount - 1;
        const div = document.createElement('div');
        div.className = 'wassayni-location-item';
        div.id = 'wassayni-loc-' + idx;
        div.innerHTML = `<button class="remove-loc-btn" onclick="removeWassayniLocation(${idx})"><i class="fas fa-times"></i> حذف</button><small style="color:var(--gold); font-size:10px; font-weight:bold;">📍 المكان رقم ${_wassayniLocCount} (+${_WASSAYNI_EXTRA_PER_LOC.toLocaleString()} ل.س)</small><input type="text" id="wassayni-loc-name-${idx}" placeholder="اسم المكان / المحل" style="font-size:11px; margin-top:6px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid #444; padding:8px; border-radius:8px; width:100%;">`;
        list.appendChild(div);
        calcWassayniPrice();
    }

    // [WASSAYNI-REMOVE-LOC] حذف مكان
    function removeWassayniLocation(idx) {
        const el = document.getElementById('wassayni-loc-' + idx);
        if (el) { el.remove(); _wassayniLocCount--; }
        // إعادة ترقيم المكانات
        const list = document.getElementById('wassayni-locations-list');
        if (list) {
            const items = list.querySelectorAll('.wassayni-location-item');
            _wassayniLocCount = items.length;
            items.forEach((item, i) => {
                if (i === 0) return; // المكان الأول لا يُحذف
                const lbl = item.querySelector('small');
                const btn = item.querySelector('.remove-loc-btn');
                if (lbl) lbl.innerText = '📍 المكان رقم ' + (i + 1) + ' (+' + _WASSAYNI_EXTRA_PER_LOC.toLocaleString() + ' ل.س)';
                if (btn) btn.setAttribute('onclick', 'removeWassayniLocation(' + i + ')');
                item.id = 'wassayni-loc-' + i;
                const inp = item.querySelector('input[type="text"]');
                if (inp) inp.id = 'wassayni-loc-name-' + i;
            });
        }
        calcWassayniPrice();
    }

    function setWassayniLocChoice(enabled) {
        window._wassayniLocEnabled = enabled;
        const mapSection = document.getElementById('wassayni-map-section');
        const btnYes = document.getElementById('loc-btn-yes');
        const btnNo = document.getElementById('loc-btn-no');
        const step3Icon = document.getElementById('wassayni-step3-icon');
        if (enabled) {
            if (mapSection) mapSection.style.display = 'block';
            if (btnYes) { btnYes.style.background = 'var(--gold)'; btnYes.style.color = '#000'; btnYes.style.borderColor = 'var(--gold)'; }
            if (btnNo) { btnNo.style.background = 'transparent'; btnNo.style.color = '#aaa'; btnNo.style.borderColor = '#555'; }
            if (step3Icon) step3Icon.innerText = '3';
        } else {
            if (mapSection) mapSection.style.display = 'none';
            if (btnNo) { btnNo.style.background = '#3498db'; btnNo.style.color = '#fff'; btnNo.style.borderColor = '#3498db'; }
            if (btnYes) { btnYes.style.background = 'transparent'; btnYes.style.color = '#aaa'; btnYes.style.borderColor = '#555'; }
            if (step3Icon) step3Icon.innerText = '1';
        }
    }
    // [END-LOC-CHOICE]
    async function submitWassayni() {
        if (_wassayniPending) return;
        _wassayniPending = true;
        try { await _submitWassayni_inner(); } finally { _wassayniPending = false; }
    }
    async function _submitWassayni_inner() {
        const task = document.getElementById('wassayni-task').value;
        const addrDetails = document.getElementById('wassayni-addr').value;
        // [LOC-CHOICE] التحقق من اختيار الموقع
        const _locEnabled = (window._wassayniLocEnabled !== false); // افتراضي: مفعّل
        if (_locEnabled && (pickupLoc.lat === 0 || dropoffLoc.lat === 0)) return showNotify("يرجى تحديد المواقع وكتابة تفاصيل الطلب", "error");
        if(!task) return showNotify("يرجى كتابة تفاصيل الطلب", "error");
        // [END-LOC-CHOICE]

        // [WASSAYNI-MULTI-LOC] جمع أسماء المكانات
        const _locNames = [];
        for (let _li = 0; _li < _wassayniLocCount; _li++) {
            const _locInp = document.getElementById('wassayni-loc-name-' + _li);
            if (_locInp && _locInp.value.trim()) _locNames.push(_locInp.value.trim());
        }
        // [WASSAYNI-PRICE-CALC] حساب السعر النهائي
        const _finalDeliveryPrice = calcWassayniPrice();
        const _locSummary = _locNames.length > 0 ? ('\nالمكانات: ' + _locNames.join(' ← ')) : '';
        const _fullTask = task + _locSummary;
        // [END-WASSAYNI-MULTI-LOC]
        
        document.getElementById('eagle-searching').style.display = 'flex';
        document.getElementById('searching-text').innerText = "جاري إرسال المهمة لصقور الشاهين... 🚀";
        document.getElementById('searching-sound').play();
        
        const orderId = generateUniqueId();
        verificationCode = Math.floor(1000 + Math.random() * 9000);
        
        const wassayniOrder = {
            id: orderId,
            customer_name: currentUser.name || "عميل شاهين",
            phone: currentUser.phone || "000",
            restaurant_name: "خدمة وصيني 🦅",
            customer_address: (currentUser.address || "") + " | " + addrDetails,
            total: 0,
            status: 'searching',
            items: JSON.stringify([{n: "مهمة وصيني", p: 0, task: _fullTask, locations: _locNames, loc_count: _wassayniLocCount}]),
            customer_id: currentUser.uid,
            delivery_price: _finalDeliveryPrice,
            verify_code: verificationCode,
            res_type: 'wassayni',
            created_at: new Date().toISOString(),
            lat: _locEnabled ? dropoffLoc.lat : ((userLoc && userLoc.lat) ? userLoc.lat : ((currentUser && currentUser.lat) || 0)),
            lng: _locEnabled ? dropoffLoc.lng : ((userLoc && userLoc.lng) ? userLoc.lng : ((currentUser && currentUser.lng) || 0)),
            order_details: _fullTask
        };
        
        const { error } = await _supabase.from('sh_public_orders').insert([wassayniOrder]);
        if(!error) {
            currentOrderKey = orderId;
            localStorage.setItem('shahen_active_order_id', orderId);
            
            let localWassayni = { id: orderId, restaurant_name: "خدمة وصيني 🦅", total: 0, status: 'searching', date: new Date().toLocaleString('ar-SA'), items: [{n: "مهمة وصيني", p: 0}], points_earned: 0, points_spent: 0, delivery_price: _finalDeliveryPrice, restaurant_id: null, customer_id: currentUser.uid, verify_code: verificationCode, res_type: 'wassayni', order_details: _fullTask };
            let orders = getStorage('orders');
            orders.push(localWassayni);
            setStorage('orders', orders);

            startSearching();
        } else {
            showNotify("فشل: " + error.message, "error");
            document.getElementById('eagle-searching').style.display = 'none';
            document.getElementById('searching-sound').pause();
        }
    }

    // ===== دالة فلترة الأقسام الرئيسية (ورود / حلويات / هدايا / أخرى) =====
    let _activeSpecialtyCategory = 'all';
    function filterSpecialtyByCategory(cat) {
        _activeSpecialtyCategory = cat;
        // تحديث التبويبات
        ['all','flowers','sweets','gifts','other'].forEach(t => {
            const btn = document.getElementById('sp-tab-' + t);
            if (!btn) return;
            if (t === cat) { btn.classList.add('active'); }
            else { btn.classList.remove('active'); }
        });
        const catNames = { all: '', flowers: '🌸 قسم الورود', sweets: '🍬 قسم الحلويات', gifts: '🎁 قسم الهدايا', other: '🦅 أقسام أخرى' };
        const labelEl = document.getElementById('specialty-category-label');
        if (labelEl) labelEl.innerText = catNames[cat] || '';
        // إخفاء الشبكة الأولية وعرض المتاجر مباشرة حسب القسم
        const sectionsGrid = document.getElementById('specialty-sections-grid');
        if (sectionsGrid) sectionsGrid.style.display = 'none';
        renderSpecialtyStores(cat);
    }

    // دوال جديدة لتفعيل قسم الورود والحلويات
    async function renderSpecialtyStores(type) {
        const storeListDiv = document.getElementById('specialty-store-list');
        const loader = document.getElementById('shahen-specialty-loader');
        const sectionsGrid = document.getElementById('specialty-sections-grid');
        
        sectionsGrid.style.display = 'none';
        loader.style.display = 'flex';
        storeListDiv.innerHTML = `<button class="btn-gold" style="background:#555; margin-bottom:10px; font-size:11px;" onclick="document.getElementById('specialty-sections-grid').style.display='grid'; document.getElementById('specialty-store-list').innerHTML='';">⬅️ العودة للأقسام</button>`;

        const { data: stores, error } = await _supabase.from('restaurants_public')
            .select('*')
            .eq('branch', 'شريك خارجي')
            .eq('contract', 'شريك حلويات وورود');

        loader.style.display = 'none';

        if(stores && stores.length > 0) {
            // التصفية حسب النوع (ورود أو حلويات) بناءً على specialty_type أو الاسم
            let filteredStores = stores;
            // تصفية حسب القسم المختار من الأقسام الرئيسية
            if (type && type !== 'all') {
                filteredStores = stores.filter(s => {
                    const st = s.specialty_type || '';
                    if (type === 'flowers') return st === 'flowers' || (s.name||'').includes('ورد') || (s.name||'').includes('زهور') || (s.name||'').includes('باقة');
                    if (type === 'sweets') return st === 'sweets' || (s.name||'').includes('حلوى') || (s.name||'').includes('حلويات') || (s.name||'').includes('كيك');
                    if (type === 'gifts') return st === 'gifts';
                    if (type === 'other') return st === 'other' || (!st && !((s.name||'').includes('ورد') || (s.name||'').includes('حلو') || (s.name||'').includes('كيك')));
                    return true;
                });
            }
            // ملاحظة: يمكنك تصفية المتاجر هنا بناءً على كلمات دلالية في الاسم أو الحقول
            
            storeListDiv.innerHTML += filteredStores.map(s => {
                // تحديد لون الحدود بناءً على نوع المتجر
                const isFlower = (s.name || '').includes('ورد') || (s.name || '').includes('زهور') || (s.name || '').includes('باقة') || type === 'flowers';
                const isSweet = (s.name || '').includes('حلوى') || (s.name || '').includes('حلويات') || (s.name || '').includes('كيك') || type === 'sweets';
                const borderColor = isFlower ? '#ff69b4' : isSweet ? '#9b59b6' : 'var(--gold)';
                const bgColor = isFlower ? 'rgba(255,105,180,0.07)' : isSweet ? 'rgba(155,89,182,0.07)' : 'transparent';
                const mapsUrl = s.maps_url || s.location_url || '';
                return `
                <div class="card" onclick="orderFromSpecialtyStore('${s.id}','${s.specialty_type||type}')" style="cursor:pointer; padding: 12px; border: 2px solid ${borderColor}; background: ${bgColor};">
                    <div class="flex-reverse">
                        <img src="${s.logo || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%232a1a2e%22/%3E%3Ctext x=%2250%22 y=%2258%22 font-size=%2240%22 text-anchor=%22middle%22%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E'}" width="55" height="55" style="border-radius:12px; border:2px solid ${borderColor};">
                        <div style="flex:1; text-align:right; margin-right:10px;">
                            <b style="font-size: 13px;">${s.name}</b>
                            <p style="margin:2px 0 0 0; font-size:10px; color:${borderColor};">${isFlower ? '🌸 محل ورود' : isSweet ? '🍬 محل حلويات' : '🛍️ متجر'}</p>
                            <p style="margin:2px 0 0 0; font-size:10px; color:var(--gold);">اضغط للتنسيق والطلب المباشر 🦅</p>
                        </div>
                        ${mapsUrl ? `<a href="${mapsUrl}" target="_blank" onclick="event.stopPropagation()" style="background:rgba(66,133,244,0.15); border:1px solid #4285F4; border-radius:8px; padding:5px 8px; color:#4285F4; font-size:9px; text-decoration:none; white-space:nowrap;"><i class="fas fa-map-marker-alt"></i> الخريطة</a>` : ''}
                        <i class="fas fa-chevron-left" style="color:${borderColor}; font-size:12px; margin-right:5px;"></i>
                    </div>
                </div>`;
            }).join('');
        } else {
            storeListDiv.innerHTML += `<p style="text-align:center; font-size:11px; padding:20px;">لا توجد متاجر متاحة حالياً في هذا القسم</p>`;
        }
    }

    async function orderFromSpecialtyStore(id, specType) {
        // جلب بيانات المتجر لنضمن الحصول على الاسم الصحيح
        const store = data.find(r => String(r.id) === String(id));
        if (store) {
            _customOrderResId   = store.id;
            _customOrderResName = store.name;
            _customOrderResType = specType || store.specialty_type || 'other';
            openMenu(id);
        } else {
            // المتجر غير موجود في الكاش، نجلبه من قاعدة البيانات
            const { data: storeDb } = await _supabase.from('restaurants_public').select('*').eq('id', id).single();
            if (storeDb) {
                _customOrderResId   = storeDb.id;
                _customOrderResName = storeDb.name;
                _customOrderResType = specType || storeDb.specialty_type || 'other';
                // نضيفه للكاش مؤقتاً
                data.push(storeDb);
                openMenu(id);
            }
        }
    }

    async function logout() {
        // [FIX-LOGOUT-SESSION] السبب الجذري لمشكلة "يرجع يسجّلني دخول تلقائياً بعد الخروج":
        // الدالة كانت تمسح فقط بيانات محلية (shahen_user) بدون إنهاء جلسة المصادقة الفعلية عند
        // Supabase (auth.signOut())، فتبقى الجلسة صالحة محفوظة، ويعيد onAuthStateChange تسجيل
        // الدخول تلقائياً عند إعادة تحميل الصفحة. الآن نُنهي الجلسة فعلياً أولاً قبل أي شيء آخر.
        try { await _supabase.auth.signOut(); } catch(_signOutErr) { /* حتى لو فشل الاتصال، نكمل تنظيف الحالة المحلية */ }
        // [FIX-C7] تنظيف كل الـ intervals والـ channels عند الخروج
        if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
        if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
        if (_consultChatChannel) { try { _supabase.removeChannel(_consultChatChannel); } catch(e){} _consultChatChannel = null; }
        if (_spChatChannel) { try { _supabase.removeChannel(_spChatChannel); } catch(e){} _spChatChannel = null; }
        if (_spPollInterval) { clearInterval(_spPollInterval); _spPollInterval = null; }
        if (_clientMsgPollInterval) { clearInterval(_clientMsgPollInterval); _clientMsgPollInterval = null; }
        currentOrderKey = null;
        _confirmOrderPending = false; _medConsultPending = false; _wassayniPending = false;
        _storeConsultPending = false; _sendMsgPending = false; _spMsgPending = false; localStorage.removeItem('shahen_user'); localStorage.removeItem('shahen_pledge'); location.reload(); }
    function sendComplaint(context) { window.open(`https://wa.me/966546083283?text=لدي شكوى بخصوص: ${encodeURIComponent(context||'')}`); }

    window.onload = () => {
        // [FIX-OFFLINE-QUEUE] فحص أي طلبات معلَّقة من جلسة سابقة عند فتح الصفحة من جديد
        try { if (navigator.onLine) _retryPendingOfflineOrders(); } catch(e) {}
        // ===== [SCREEN-SIZE-INIT] إظهار مودال اختيار المقاس قبل تسجيل الدخول =====
        const _savedSize = localStorage.getItem('shahen_display_size');
        // [FIX-MOBILE] إذا كان الجهاز جوال حقيقي — طبّق full تلقائياً بدون مودال
        const _isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && window.innerWidth < 500;
        if (_isMobileDevice && !_savedSize) {
            localStorage.setItem('shahen_display_size', 'full');
            resizeApp('full');
        } else if (_savedSize) {
            // إذا كان المقاس محفوظاً — طبّقه مباشرة بدون مودال
            resizeApp(_savedSize);
        } else {
            // أول مرة — أظهر المودال
            const _overlay = document.getElementById('screen-size-overlay');
            if (_overlay) _overlay.style.display = 'flex';
        }
        // ===== نهاية SCREEN-SIZE-INIT =====
        // ===== Listener رسمي من Supabase: يُفعَّل تلقائياً عند أي تغيير في حالة المصادقة =====
        // يعمل عند: تسجيل الدخول، تفعيل البريد، انتهاء الجلسة، إلخ
        _supabase.auth.onAuthStateChange(async (event, session) => {
            // [FIX-SEC-2e] console.log محذوف في الإنتاج

            // ===== عند الضغط على رابط التفعيل من البريد =====
            if (event === 'SIGNED_IN' && session && session.user) {
                const _verifiedUser = session.user;

                // إغلاق نافذة التحقق إن كانت مفتوحة
                const _overlayEl = document.getElementById('email-verify-overlay');
                if (_overlayEl) _overlayEl.style.display = 'none';

                // [FIX-AUTH-REDESIGN] إن كان تسجيل الدخول قد عولج بالفعل صراحة عبر شاشات الدخول/التسجيل
                // الجديدة (وهذا هو المسار الوحيد الآن)، لا داعي لتكرار أي شيء هنا — هذا المستمع العام
                // يبقى فقط لحالة استعادة الجلسة عند فتح الصفحة من جديد (جلسة سابقة صالحة أصلاً)
                if (window._authFlowHandledSignIn) { window._authFlowHandledSignIn = false; return; }

                // جلب بيانات المستخدم من قاعدة البيانات مباشرة
                const { data: dbCust } = await _supabase.from('customers').select('*').eq('id', _verifiedUser.id).single();

                // [FIX-CUSTOMER-BLOCK] حساب محظور من الإدارة — يُمنع الدخول فوراً مهما نجح التحقق
                if (dbCust && dbCust.account_status === 'blocked') {
                    try { await _supabase.auth.signOut(); } catch(e) {}
                    localStorage.removeItem('shahen_user');
                    if (_overlayEl) _overlayEl.style.display = 'none';
                    alert('⛔ حسابك محظور. يرجى التواصل مع الإدارة لمزيد من التفاصيل.');
                    return;
                }

                // [FIX-AUTH-REDESIGN] عدم وجود صف، أو وجوده بدون تفعيل، يعني عدم السماح بالدخول هنا
                // إطلاقاً — هذا مسار استعادة جلسة سابقة فقط، لا مسار تسجيل جديد
                // [FIX-AUTH-RACE-CONDITION] أُزيل استدعاء signOut() من هنا نهائياً — كان بإمكانه (في
                // حال حدوث أي تعارض توقيتي نادر) تعطيل جلسة تسجيل جارية فعلياً أثناء إنشاء حساب جديد
                // عبر الشاشات الصريحة، مما يفسّر حالات "الحساب لا يُحفَظ رغم ظهور رسالة النجاح". الآن
                // هذا المسار الاحتياطي يكتفي بعدم الدخول تلقائياً دون أي أثر جانبي فعلي على الجلسة.
                if (!dbCust || !dbCust.is_activated) {
                    return;
                }
                currentUser = { uid: dbCust.id, name: dbCust.name, email: dbCust.email, phone: dbCust.phone, address: dbCust.address, points: dbCust.points || 0, balance: dbCust.balance || 0 };

                // ===== تحديث الواجهة فوراً بدون refresh =====
                localStorage.setItem('shahen_user', JSON.stringify(currentUser));
                document.getElementById('my-name').innerText = currentUser.name || "--";
                document.getElementById('my-phone').innerText = currentUser.phone || "--";
                document.getElementById('my-address').innerText = currentUser.address || "--";
                { const _emailEl = document.getElementById('my-email'); if (_emailEl) _emailEl.innerText = (currentUser.email && !currentUser.email.includes('@shaheen.local')) ? currentUser.email : 'غير مسجَّل'; }
                document.getElementById('shahen-points').innerText = currentUser.points || "0";
        _updatePointsMoneyDisplay(); // [POINTS-MONEY]
                document.getElementById('p-login').style.display = 'none';
                document.getElementById('tab-bar').style.display = 'flex';
                document.getElementById('manual-refresh').style.display = 'flex';
                document.getElementById('admin-notif-bell').style.display = 'flex';

                showNotify("أهلاً بك يا شاهين 🦅 تم تسجيل دخولك");
                loadUserData();
                // [FIX-LOGIN-RT] إعادة تشغيل channels الطلب النشط فوراً بعد تسجيل الدخول
                setTimeout(async () => {
                    const _loginActiveId = localStorage.getItem('shahen_active_order_id');
                    if (_loginActiveId && currentUser) {
                        const { data: _loginOrder } = await _supabase.from('sh_public_orders')
                            .select('status').eq('id', _loginActiveId).maybeSingle();
                        if (_loginOrder && !['completed','cancelled','failed','rejected','inactive'].includes(_loginOrder.status)) {
                            if (!_orderChannel) {
                                currentOrderKey = _loginActiveId;
                                listenForOrderUpdates(_loginActiveId);
                            }
                        }
                    }
                }, 1500);
                return;
            }

            // ===== عند تسجيل الخروج: إعادة لصفحة الدخول =====
            if (event === 'SIGNED_OUT') {
                currentUser = null;
                nav('p-login');
                document.getElementById('tab-bar').style.display = 'none';
                return;
            }
        });

        // تحميل البيانات عند فتح التطبيق
        loadUserData();
        if(!currentUser) nav('p-login');

        // ===== تعديل: إزالة الطلب تلقائياً إذا أغلق العميل التطبيق أو لم يتفاعل خلال 3 دقائق =====
        let _inactivityTimer = null;
        const _INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 دقائق

        function resetInactivityTimer() {
            if (_inactivityTimer) clearTimeout(_inactivityTimer);
            _inactivityTimer = setTimeout(async () => {
                const _activeId = localStorage.getItem('shahen_active_order_id');
                if (_activeId) {
                    const { data: _checkOrd } = await _supabase.from('sh_public_orders').select('status').eq('id', _activeId).maybeSingle();
                    // فقط إذا كان الطلب لا يزال في حالة بحث (لم يقبله مندوب بعد)
                    if (_checkOrd && (_checkOrd.status === 'searching' || _checkOrd.status === 'pending')) {
                        await _supabase.from('sh_public_orders').update({ status: 'inactive' }).eq('id', _activeId);
                        await _supabase.from('orders').update({ status: 'cancelled' }).eq('id', _activeId);
                        localStorage.removeItem('shahen_active_order_id');
                        document.getElementById('eagle-searching').style.display = 'none';
                        if (cancelInterval) clearInterval(cancelInterval);
                    }
                }
            }, _INACTIVITY_TIMEOUT);
        }

        // إعادة تشغيل المؤقت عند أي تفاعل من المستخدم
        ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
            document.addEventListener(evt, resetInactivityTimer, { passive: true });
        });

        // [BG-FIX] لا نلغي الطلب عند الخروج للخلفية — نحفظ وقت الخروج فقط لمزامنة لاحقة
        // الكود القديم كان يلغي الطلب ويمسح active_order_id عند كل تحويل للخلفية وهو سبب التجمد
        let _bgHiddenAt = 0;
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                _bgHiddenAt = Date.now();
            }
        });

        resetInactivityTimer();
    };

    // ===================================================================
    // ===================================================================
    // [MAPBOX-TRACK] نظام تتبع المندوب الحي الجديد بالكامل — Mapbox GL
    // يحل محل النظام القديم المحذوف بالكامل (Leaflet) — مبني من الصفر
    // ===================================================================
    // ===================================================================
    // ===================================================================
    // [MAPBOX-TRACK] نظام تتبع المندوب الحي — Mapbox GL (إعادة بناء معماري)
    // كل العلامات الجغرافية (المندوب/المطعم/العميل) عبارة عن Symbol Layers
    // حقيقية مرتبطة بإحداثيات داخل محرك الخريطة نفسه — وليست عناصر HTML/CSS
    // عائمة فوق الخريطة. فقط عناصر واجهة الشاشة (زر الرجوع، البطاقة السفلية)
    // تبقى Overlay عادي لأنها ليست تمثيلاً لموقع جغرافي.
    // ===================================================================
    (function(){
        const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGZnaHJ0c2ZnaGoiLCJhIjoiY21xdTdtOXl6MHBhbDJzcXl1NnJiNDQ5ZyJ9.hjFDXHtLhfb_rnVbMcp7jQ';
        if (typeof mapboxgl !== 'undefined') mapboxgl.accessToken = MAPBOX_TOKEN;

        let _tMap = null;
        let _tOrderId = null, _tDriverId = null;
        let _tOrderChannel = null, _tPosChannel = null;
        let _tWatchdog = null, _tLastPosAt = 0, _tOrderPoll = null;
        let _tLastRouteAt = 0, _tLastRouteLatLng = null;
        let _tCurStage = 'to_restaurant'; // to_restaurant | arrived_restaurant | to_customer | arrived
        let _tAnimFrame = null;
        let _tCurrentOrder = null;
        let _tLiveCustomerPos = null; // [FIX-PROACTIVE-GEO] موقع العميل الحي إن وافق على الإذن (يُطلب فوراً عند فتح الصفحة)
        let _tLastDest = null;       // الوجهة المُحلَّلة الحالية {lat,lng,icon} أو null
        let _tDriverCurPos = null;   // [lng,lat] آخر موقع مُعروض فعلياً للمندوب على الخريطة (للأنيميشن)

        function _haversine(lat1, lon1, lat2, lon2) {
            const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
            const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }

        function _statusText(order) {
            if (order.status === 'cancelled') return 'تم إلغاء الطلب ❌';
            if (order.status === 'completed') return 'تم التسليم بنجاح ✅';
            if (_tCurStage === 'arrived') return 'المندوب وصل، بانتظارك 🦅';
            if (_tCurStage === 'to_customer') return 'الصقر في الطريق إليك 🛵';
            if (_tCurStage === 'arrived_restaurant') return 'الصقر عند المطعم 🏪';
            if (order.status === 'ready') return 'طلبك جاهز، الصقر متجه للمطعم 🏪';
            if (order.status === 'preparing') return 'المطعم يجهز طلبك 👨‍🍳';
            return 'الصقر متجه للمطعم 🏪';
        }

        // [FIX-MAPS-URL] استخراج الإحداثيات من رابط Google Maps طويل (يحتوي الإحداثيات في نص الرابط)
        function _extractCoordsFromMapsUrl(url) {
            if (!url) return null;
            const patterns = [
                /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
                /place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/
            ];
            for (const p of patterns) {
                const m = url.match(p);
                if (m) {
                    const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
                    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
                }
            }
            return null;
        }
        // [FIX-MAPS-URL] للروابط المختصرة (goo.gl/maps, maps.app.goo.gl) نطلب من Edge Function حلّها من جهة الخادم
        const _MAPS_RESOLVE_FN_URL = 'https://qfyggwffibmrlsvlzwgs.supabase.co/functions/v1/resolve-maps-url';
        async function _shResolveMapsUrlCoords(mapsUrl) {
            if (!mapsUrl) return null;
            const direct = _extractCoordsFromMapsUrl(mapsUrl);
            if (direct) return direct;
            try {
                const resp = await fetch(_MAPS_RESOLVE_FN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_KEY }, body: JSON.stringify({ url: mapsUrl }) });
                const data = await resp.json();
                if (data && typeof data.lat === 'number' && typeof data.lng === 'number') return { lat: data.lat, lng: data.lng };
            } catch(e) {}
            return null;
        }

        // [FIX-STALE-CACHE] حد أقصى منطقي للمسافة بين المندوب والمطعم (كم) — أي قيمة محفوظة تتجاوزه تُعتبر خطأ سابقاً ويُعاد استخراجها
        const _MAX_PLAUSIBLE_KM = 150;

        // [FIX-REAL-COORDS] تحديد الوجهة من بيانات حقيقية فقط — لا إحداثيات افتراضية أو ثابتة أبداً
        // [FIX-GEOLOCATION-FALLBACK] طلب موقع العميل الحي من المتصفح كخيار أخير إذا لم تتوفر إحداثيات محفوظة
        function _requestBrowserGeolocation() {
            return new Promise((resolve) => {
                if (!window.isSecureContext) {
                    _debugLog('geo: insecure context (needs HTTPS) — المتصفح يحظر الموقع على HTTP', 'geo');
                    resolve(null); return;
                }
                if (!navigator.geolocation) {
                    _debugLog('geo: navigator.geolocation غير متاح في هذا المتصفح', 'geo');
                    resolve(null); return;
                }
                _debugLog('geo: طلب الموقع الحي...', 'geo');
                navigator.geolocation.getCurrentPosition(
                    (pos) => { _debugLog(`geo: نجح ${pos.coords.latitude},${pos.coords.longitude}`, 'geo'); resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
                    (err) => { _debugLog(`geo: فشل code=${err.code} ${err.message}`, 'geo'); resolve(null); },
                    { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
                );
            });
        }

        async function _resolveDestination(order, driverPos) {
            _debugLog(`resolveDest stage:${_tCurStage} order.lat:${order.lat} order.lng:${order.lng} order.stage_field:${order.driver_stage}`, 'resolve');
            if (_tCurStage === 'to_customer' || _tCurStage === 'arrived') {
                // [FIX-CUSTOMER-LOC] إن لم تكن إحداثيات العنوان المحدد لهذا الطلب صالحة (صفر/فاضية)،
                // نرجع لإحداثيات موقع العميل المحفوظة في حسابه الشخصي (نفس مصدر "تحديد موقعي الدقيق")
                let cLat = parseFloat(order.lat), cLng = parseFloat(order.lng);
                if (!cLat || !cLng) {
                    try {
                        const { data: custRow } = await _supabase.from('customers').select('lat,lng').eq('id', order.customer_id).maybeSingle();
                        if (custRow && custRow.lat && custRow.lng) { cLat = parseFloat(custRow.lat); cLng = parseFloat(custRow.lng); }
                    } catch(e) {}
                }
                // [FIX-PROACTIVE-GEO] استخدام موقع العميل الحي المُطلَب مسبقاً عند فتح الصفحة (إن وافق) كاحتياطي
                let usedLiveGeo = false;
                if ((!cLat || !cLng) && _tLiveCustomerPos) { cLat = _tLiveCustomerPos.lat; cLng = _tLiveCustomerPos.lng; usedLiveGeo = true; }
                // [FIX-GEOLOCATION-FALLBACK] خيار أخير: إن لم يكن الموقع الحي جاهزاً بعد، نطلبه الآن مباشرة
                if (!cLat || !cLng) {
                    const live = await _requestBrowserGeolocation();
                    if (live) { cLat = live.lat; cLng = live.lng; _tLiveCustomerPos = live; usedLiveGeo = true; }
                }
                if (!cLat || !cLng) { _debugLog('dest-resolve: موقع العميل غير متوفر من أي مصدر', 'custResolve'); return { error: 'موقع العميل غير متوفر 📍' }; }
                // [FIX-SHARE-LIVE-LOC] نحفظ الموقع الحي في قاعدة البيانات فوراً عند استخدامه — حتى تراه لوحة
                // الإدارة وتطبيق المندوب أيضاً (موافقة الموقع تعمل فقط على جهاز العميل، فلا تظهر لأي مكان آخر
                // إلا بحفظها في القاعدة بهذه الطريقة)
                if (usedLiveGeo) {
                    try { await _supabase.from('sh_public_orders').update({ lat: cLat, lng: cLng }).eq('id', order.id); } catch(_e) {}
                }
                _debugLog(`dest-resolve: customer ${cLat},${cLng}`, 'custResolve');
                return { lat: cLat, lng: cLng, icon: 'customer-icon' };
            }
            let lat = null, lng = null;
            let _sawUnresolvableMapsUrl = null; // [FIX-DIAGNOSTIC] رابط خريطة موجود فعلاً لكن تعذّر استخراج إحداثيات منه
            const isPharmacy = order.res_type === 'pharmacy' || order.res_type === 'pharmacy_delivery';
            const primaryTable = isPharmacy ? 'pharmacies' : 'restaurants';

            // [FIX-ROOT-CAUSE] إزالة نهائية لفحص "المسافة المنطقية" بين المندوب والمطعم كشرط لقبول موقع
            // المطعم. هذا الفحص كان يرفض إحداثيات صحيحة 100% ومحفوظة فعلياً في ملف المطعم بالإدارة كلما
            // كان موقع المندوب اللحظي بعيداً (مندوب لم يتحرك بعد، GPS غير دقيق مؤقتاً، مندوب في بداية
            // مساره...)، فيظهر خطأ "تعذر تحديد الموقع" رغم أن الموقع موجود وصحيح فعلياً في الإدارة.
            // الإحداثيات المحفوظة في ملف المطعم (سواء يدوياً أو عبر رابط Google Maps) هي مصدر الحقيقة
            // الوحيد لموقع المطعم، ويجب استخدامها مباشرة بمجرد وجودها — دون أي شرط إضافي غير منطقي.
            // الفحص الوحيد الباقي هو فحص رقمي بسيط: هل هذا رقم إحداثي صالح فعلاً (وليس صفراً أو فارغاً
            // أو خارج نطاق الأرض الجغرافي)، بغض النظر عن موقع المندوب الحالي.
            function _isValidCoord(la, ln) {
                la = parseFloat(la); ln = parseFloat(ln);
                if (isNaN(la) || isNaN(ln)) return false;
                if (la === 0 && ln === 0) return false; // إحداثي صفر/صفر يعني عملياً "غير محدد"، ليس موقعاً حقيقياً
                return la >= -90 && la <= 90 && ln >= -180 && ln <= 180;
            }
            async function _tryResolveFromRow(resRow, table) {
                if (!resRow) return false;
                if (resRow.pickup_lat && resRow.pickup_lng && _isValidCoord(resRow.pickup_lat, resRow.pickup_lng)) {
                    lat = parseFloat(resRow.pickup_lat); lng = parseFloat(resRow.pickup_lng);
                    return true;
                }
                if (resRow.maps_url) {
                    const resolved = await _shResolveMapsUrlCoords(resRow.maps_url);
                    if (resolved && _isValidCoord(resolved.lat, resolved.lng)) {
                        lat = resolved.lat; lng = resolved.lng;
                        try { await _supabase.from(table).update({ pickup_lat: lat, pickup_lng: lng }).eq('id', resRow.id).then(); } catch(_e) {}
                        return true;
                    }
                    // [FIX-TEXT-ADDRESS-IN-URL-FIELD] أحياناً يضع الإداري عنواناً نصياً عادياً في حقل رابط
                    // الخريطة بدل رابط Google Maps فعلي — نحاول تحويله كنص عنوان عبر Mapbox Geocoding قبل
                    // اعتباره فاشلاً نهائياً
                    if (!/^https?:\/\//i.test(resRow.maps_url.trim())) {
                        try {
                            const _geoUrl2 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(resRow.maps_url.trim())}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
                            const _geoResp2 = await fetch(_geoUrl2);
                            const _geoData2 = await _geoResp2.json();
                            const _feat2 = _geoData2 && _geoData2.features && _geoData2.features[0];
                            if (_feat2 && Array.isArray(_feat2.center) && _isValidCoord(_feat2.center[1], _feat2.center[0])) {
                                lat = _feat2.center[1]; lng = _feat2.center[0];
                                try { await _supabase.from(table).update({ pickup_lat: lat, pickup_lng: lng }).eq('id', resRow.id).then(); } catch(_e) {}
                                return true;
                            }
                        } catch(_e2) {}
                    }
                    // [FIX-DIAGNOSTIC] الرابط موجود، لكن الاستخراج التلقائي (سواء مباشرة أو عبر خادم الحل) فشل —
                    // هذا مختلف تماماً عن "لا يوجد رابط أصلاً"، ويجب إخبار الإدارة بالفرق
                    _sawUnresolvableMapsUrl = resRow.maps_url;
                }
                return false;
            }

            // [FIX-PRIORITY-ORDER] الأولوية الآن لإحداثيات الطلب نفسه أولاً (لقطة ثابتة محفوظة وقت إنشاء
            // الطلب، لا تتغيّر بعد ذلك) — تماماً كما يجب أن يعمل النظام: نفس الإحداثيات التي يراها
            // تطبيق المندوب بالضبط. لا نبحث في جدول المطعم الحي إلا إذا كانت إحداثيات الطلب غير موجودة
            if (order.pickup_lat && order.pickup_lng && _isValidCoord(order.pickup_lat, order.pickup_lng)) {
                lat = parseFloat(order.pickup_lat); lng = parseFloat(order.pickup_lng);
            }
            if ((!lat || !lng) && order.restaurant_id) {
                try {
                    const { data: resRow } = await _supabase.from(_readTable(primaryTable)).select('id,pickup_lat,pickup_lng,maps_url').eq('id', order.restaurant_id).maybeSingle();
                    await _tryResolveFromRow(resRow, primaryTable);
                } catch(e) { console.error('[FIX-RES-LOC] خطأ أثناء جلب موقع المطعم عبر restaurant_id:', e); }
            }
            if ((!lat || !lng) && order.restaurant_name) {
                for (const table of ['restaurants', 'pharmacies']) {
                    try {
                        // [FIX-NAME-MATCH] مطابقة دقيقة أولاً، ثم مطابقة متسامحة (تتجاهل المسافات/حالة الأحرف)
                        // كي لا يفشل الربط بسبب فرق بسيط في التنسيق بين اسم الطلب واسم المطعم المحفوظ
                        let { data: resRow } = await _supabase.from(_readTable(table)).select('id,pickup_lat,pickup_lng,maps_url').eq('name', order.restaurant_name).maybeSingle();
                        if (!resRow) {
                            const { data: fuzzyRows } = await _supabase.from(_readTable(table)).select('id,pickup_lat,pickup_lng,maps_url').ilike('name', '%' + order.restaurant_name.trim() + '%').limit(1);
                            if (fuzzyRows && fuzzyRows.length) resRow = fuzzyRows[0];
                        }
                        if (await _tryResolveFromRow(resRow, table)) break;
                    } catch(e) { console.error('[FIX-RES-LOC] خطأ أثناء جلب موقع المطعم عبر الاسم (' + table + '):', e); }
                    if (lat && lng) break;
                }
            }

            // [FIX-GEOCODE-ADDRESS-FALLBACK] ملاذ أخير: إن بقي الموقع غير معروف من كل المصادر السابقة
            // (لا إحداثيات محفوظة، ولا رابط خرائط صالح)، نحاول تحويل نص عنوان المطعم/الصيدلية المحفوظ
            // (res_address) إلى إحداثيات فعلية عبر خدمة Mapbox Geocoding قبل الاستسلام وعرض رسالة خطأ.
            // نتجاهل نصوص العناوين الوهمية الافتراضية التي لا تمثل عنواناً حقيقياً.
            if ((!lat || !lng) && order.res_address) {
                const _placeholderAddrs = ['موقع الاستلام', 'عنوان المطعم', 'عنوان العميل'];
                const _addrText = String(order.res_address).trim();
                if (_addrText && !_placeholderAddrs.includes(_addrText)) {
                    try {
                        const _geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(_addrText)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
                        const _geoResp = await fetch(_geoUrl);
                        const _geoData = await _geoResp.json();
                        const _feat = _geoData && _geoData.features && _geoData.features[0];
                        if (_feat && Array.isArray(_feat.center)) {
                            const gLng = _feat.center[0], gLat = _feat.center[1];
                            if (_isValidCoord(gLat, gLng)) {
                                lat = gLat; lng = gLng;
                                _debugLog(`dest-resolve: تم تحديد الموقع من نص العنوان عبر Mapbox Geocoding (${gLat},${gLng})`, 'geocodeFallback');
                                // نحفظ النتيجة على المطعم إن أمكن حتى لا نكرر الطلب لاحقاً
                                if (order.restaurant_id) {
                                    try { await _supabase.from(primaryTable).update({ pickup_lat: gLat, pickup_lng: gLng }).eq('id', order.restaurant_id).then(); } catch(_e) {}
                                }
                            }
                        }
                    } catch(e) { console.error('[FIX-GEOCODE-ADDRESS-FALLBACK] فشل تحويل العنوان النصي إلى إحداثيات:', e); }
                }
            }

            if (!lat || !lng) {
                console.error('[FIX-RES-LOC] تعذّر تحديد موقع المطعم لهذا الطلب من أي مصدر — order.restaurant_id:', order.restaurant_id, 'order.restaurant_name:', order.restaurant_name, 'order.pickup_lat:', order.pickup_lat, 'order.pickup_lng:', order.pickup_lng, 'unresolvableMapsUrl:', _sawUnresolvableMapsUrl);
                if (_sawUnresolvableMapsUrl) {
                    // [FIX-DIAGNOSTIC] رسالة دقيقة: الرابط موجود فعلاً في الإدارة لكن تعذّر استخراج إحداثيات
                    // منه تلقائياً — على الأغلب لأنه رابط مختصر تعذّر فكّه، أو نص عادي وليس رابط خرائط حقيقي
                    return { error: 'تعذّر تحديد موقع دقيق من رابط الخريطة المحفوظ للمطعم 📍' + (order.restaurant_name ? ' (' + order.restaurant_name + ')' : '') + ' — الرجاء من الإدارة فتح الرابط والتأكد أنه يعرض نقطة على الخريطة، أو إدخال الإحداثيات يدوياً في ملف المطعم' };
                }
                return { error: 'موقع المطعم غير محدد 📍' + (order.restaurant_name ? ' (' + order.restaurant_name + ')' : '') + ' — يرجى مراجعة الإدارة لإضافة رابط خرائط للمطعم' };
            }
            return { lat, lng, icon: 'restaurant-icon' };
        }

        // [MAPBOX-TRACK-LABELS] دعم عرض أسماء الشوارع/الأحياء بالعربية إن وُجدت، وإلا بالإنجليزية
        function _applyArabicLabels(map) {
            try {
                const layers = map.getStyle().layers || [];
                layers.forEach(layer => {
                    if (layer.layout && layer.layout['text-field']) {
                        map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name_ar'], ['get', 'name_en'], ['get', 'name']]);
                    }
                });
            } catch(e) {}
        }
        function _firstSymbolLayerId(map) {
            try { const layers = map.getStyle().layers || []; const sym = layers.find(l => l.type === 'symbol'); return sym ? sym.id : undefined; } catch(e) { return undefined; }
        }

        // [FIX-EMOJI-LIMITATION] خطوط Mapbox الافتراضية لا تحتوي رموز Emoji ضمن مجموعة الحروف المتاحة فيها
        // (قيد معروف في خرائط Mapbox)، لذلك طبقة Text العادية تعرض دائرة فاضية بدون الرمز داخلها.
        // الحل: نرسم الرمز كصورة (Canvas) ونسجّلها داخل محرك الخريطة عبر addImage، ثم Symbol Layer
        // يستخدم هذه الصورة — فيظهر الرمز فعلياً، وتبقى الصورة جزءاً من محرك Mapbox نفسه لا عنصر HTML.
        function _makeIconCanvas(emoji, bg) {
            const size = 72, scale = 2;
            const canvas = document.createElement('canvas');
            canvas.width = size * scale; canvas.height = size * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2 - 4, 0, Math.PI * 2);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            ctx.font = (size * 0.5) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, size/2, size/2 + 2);
            // [FIX-ADDIMAGE-TYPE] map.addImage لا يقبل عنصر <canvas> مباشرة في كل البيئات —
            // يجب تحويله إلى ImageData (النوع المدعوم رسمياً) وإلا يفشل التسجيل بصمت بدون أي خطأ ظاهر
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        function _registerMapIcons(map) {
            try {
                if (!map.hasImage('driver-icon')) map.addImage('driver-icon', _makeIconCanvas('🛵', '#d4af37'), { pixelRatio: 2 });
                if (!map.hasImage('restaurant-icon')) map.addImage('restaurant-icon', _makeIconCanvas('🏪', '#1a051a'), { pixelRatio: 2 });
                if (!map.hasImage('customer-icon')) map.addImage('customer-icon', _makeIconCanvas('🏠', '#1a051a'), { pixelRatio: 2 });
                // ===== [LANDMARKS] نقطة صغيرة تمثل موقع المعلم الخاص =====
                if (!map.hasImage('shaheen-landmark-dot')) {
                    const c = document.createElement('canvas'); c.width = 24; c.height = 24;
                    const cx = c.getContext('2d');
                    cx.beginPath(); cx.arc(12, 12, 6, 0, Math.PI*2);
                    cx.fillStyle = '#f1c40f'; cx.fill();
                    cx.lineWidth = 2; cx.strokeStyle = '#000'; cx.stroke();
                    map.addImage('shaheen-landmark-dot', cx.getImageData(0, 0, 24, 24), { pixelRatio: 2 });
                }
                return true;
            } catch(e) { _debugLog('iconRegErr: ' + e.message, 'iconErr'); return false; }
        }

        // ===== [LANDMARKS] جلب وعرض المعالم الخاصة بشاهين إكسبريس على خريطة العميل =====
        const _SHAHEEN_LM_EMOJI = { 'حي':'🏘️','دوار':'🔄','جامع':'🕌','مستشفى':'🏥','مدرسة':'🏫','جامعة':'🎓','سوق':'🛒','مطعم مشهور':'🍽️','حديقة':'🌳','جهة حكومية':'🏛️','أخرى':'📍' };
        async function _loadShaheenLandmarks(map) {
            try {
                const { data } = await _supabase.from('custom_landmarks').select('name,type,lat,lng').eq('active', true);
                const features = (data || []).map(l => ({
                    type: 'Feature',
                    properties: { name: l.name, emoji: _SHAHEEN_LM_EMOJI[l.type] || '📍' },
                    geometry: { type: 'Point', coordinates: [l.lng, l.lat] }
                }));
                if (!map.getSource('shaheen-landmarks')) {
                    map.addSource('shaheen-landmarks', { type: 'geojson', data: { type: 'FeatureCollection', features } });
                    map.addLayer({ id: 'shaheen-landmarks-layer', type: 'symbol', source: 'shaheen-landmarks', layout: {
                        'text-field': ['concat', ['get', 'emoji'], ' ', ['get', 'name']],
                        'text-size': 11, 'text-offset': [0, 0.6], 'text-anchor': 'top', 'text-allow-overlap': false,
                        'icon-image': 'shaheen-landmark-dot', 'icon-size': 0.5, 'icon-allow-overlap': true
                    }, paint: { 'text-color': '#f1c40f', 'text-halo-color': '#000', 'text-halo-width': 1.4 } });
                } else {
                    map.getSource('shaheen-landmarks').setData({ type: 'FeatureCollection', features });
                }
            } catch(e) { console.warn('landmarks load error', e); }
        }

        function _showMapPlaceholder(show) {
            const el = document.getElementById('track-map-placeholder');
            if (el) el.style.display = show ? 'flex' : 'none';
        }
        function _setDestError(msg) {
            const el = document.getElementById('track-dest-error');
            if (!el) return;
            if (msg) {
                el.innerHTML = '⚠️ ' + msg + ' <button onclick="retryResolveDestination()" style="margin-right:6px; background:#fff; color:#e74c3c; border:none; border-radius:8px; padding:3px 10px; font-size:10px; font-weight:bold; cursor:pointer;">إعادة المحاولة 🔄</button>';
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
        // [FIX-RETRY] إعادة محاولة تحديد الوجهة يدوياً (مفيد بعد منح إذن الموقع أو تحسّن الشبكة)
        window.retryResolveDestination = async function() {
            if (!_tCurrentOrder) return;
            const dp = _tDriverCurPos ? { lat: _tDriverCurPos[1], lng: _tDriverCurPos[0] } : null;
            await _refreshDestinationAndRoute(_tCurrentOrder, dp);
        };

        // [FIX-RACE-ROBUST] طابور انتظار جاهزية الخريطة — أي عملية على المصادر/الطبقات تمر من هنا
        // فتُنفَّذ فوراً إن كانت الخريطة جاهزة، أو تُحفظ وتُنفَّذ تلقائياً بمجرد الجهوزية (مرة واحدة موثوقة)
        let _tMapIsReady = false;
        let _tMapReadyQueue = [];
        function _onMapReady(fn) {
            if (_tMapIsReady) fn();
            else _tMapReadyQueue.push(fn);
        }

        // [FIX-NATIVE-MARKERS] تحديث/إخفاء نقطة المندوب — Source/Layer حقيقي داخل الخريطة، وليس Marker DOM
        let _tDebugSlots = {};
        function _debugLog(msg, slot) {
            slot = slot || 'misc';
            _tDebugSlots[slot] = msg;
            const el = document.getElementById('track-debug-readout');
            if (el) el.innerText = Object.keys(_tDebugSlots).map(k => _tDebugSlots[k]).join('\n');
        }
        function _setDriverPoint(lat, lng) {
            _onMapReady(() => {
                const src = _tMap && _tMap.getSource('track-driver-point');
                const ok = !!src;
                if (src) src.setData({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: {} }] });
                _debugLog(`driver: ${lat.toFixed(5)},${lng.toFixed(5)} src=${ok} ready=${_tMapIsReady}`, 'pos');
            });
        }
        function _setDestPoint(lat, lng, iconId) {
            _onMapReady(() => {
                const src = _tMap && _tMap.getSource('track-dest-point');
                const ok = !!src;
                if (src) src.setData({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: { icon: iconId } }] });
                _debugLog(`dest: ${lat.toFixed(5)},${lng.toFixed(5)} icon=${iconId} src=${ok} hasImg=${_tMap ? _tMap.hasImage(iconId) : '?'}`, 'dest');
            });
        }
        function _clearDestPoint() {
            _onMapReady(() => {
                const src = _tMap && _tMap.getSource('track-dest-point');
                if (src) src.setData({ type: 'FeatureCollection', features: [] });
            });
        }

        // [FIX-MAP-CENTER] إنشاء الخريطة فقط عند توفر إحداثيات حقيقية لموقع المندوب — لا كرة أرضية ولا مركز افتراضي
        function _ensureMap(centerLat, centerLng, zoom) {
            if (_tMap) return;
            _tMapIsReady = false;
            _tMapReadyQueue = [];
            _tMap = new mapboxgl.Map({
                container: 'track-map',
                // [FIX-RICH-LABELS] نمط مخصص للتتبع الحي (مثل أوبر) — يعرض أسماء الشوارع والأحياء
                // بكثافة أعلى وبشكل ثابت عبر مستويات التكبير المختلفة، وهو الخيار الرسمي من Mapbox
                // لتطبيقات تتبع المندوبين/السائقين تحديداً
                style: 'mapbox://styles/mapbox/navigation-night-v1',
                center: [centerLng, centerLat],
                zoom: zoom || 16,
                pitch: 0,
                attributionControl: { compact: true }
            });
            _tMap.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');
            _tMap.on('dragstart', () => { _tFollowMode = false; _tUserInteracted = true; _updateRecenterBtnVisibility(); });
            _tMap.on('zoomstart', (e) => { if (e.originalEvent) { _tFollowMode = false; _tUserInteracted = true; _updateRecenterBtnVisibility(); } });

            function _setupLayers() {
                // [FIX-LABELS-MISSING] تم تعطيل استبدال نص التسميات مؤقتاً — كان يستبدل تعبير النص الأصلي
                // لكل طبقات الرموز بافتراض وجود name_ar/name_en في جميعها، وهذا غير صحيح لكل الطبقات
                // (تسميات الشوارع تحديداً تستخدم بنية مختلفة)، فكان يُسبب اختفاء التسميات بالكامل أحياناً.
                // النمط الافتراضي dark-v11 يعرض التسميات بشكل موثوق دون أي تعديل.
                // _applyArabicLabels(_tMap);
                _registerMapIcons(_tMap);
                _loadShaheenLandmarks(_tMap);

                if (!_tMap.getSource('track-route')) {
                    _tMap.addSource('track-route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } });
                    const beforeId = _firstSymbolLayerId(_tMap);
                    _tMap.addLayer({
                        id: 'track-route-casing', type: 'line', source: 'track-route',
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: { 'line-color': '#1a051a', 'line-width': 10, 'line-opacity': 0.85 }
                    }, beforeId);
                    _tMap.addLayer({
                        id: 'track-route-line', type: 'line', source: 'track-route',
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: { 'line-color': '#d4af37', 'line-width': 6, 'line-opacity': 1 }
                    }, beforeId);
                }
                if (!_tMap.getSource('track-dest-point')) {
                    _tMap.addSource('track-dest-point', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    // [FIX-EMOJI-LIMITATION] صورة Canvas مسجَّلة (دائرة + رمز حقيقي) بدل النص — الرمز يظهر فعلياً هذه المرة
                    _tMap.addLayer({
                        id: 'track-dest-layer', type: 'symbol', source: 'track-dest-point',
                        layout: { 'icon-image': ['get', 'icon'], 'icon-size': 0.85, 'icon-allow-overlap': true, 'icon-ignore-placement': true }
                    });
                }
                if (!_tMap.getSource('track-driver-point')) {
                    _tMap.addSource('track-driver-point', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    _tMap.addLayer({
                        id: 'track-driver-layer', type: 'symbol', source: 'track-driver-point',
                        layout: { 'icon-image': 'driver-icon', 'icon-size': 0.95, 'icon-allow-overlap': true, 'icon-ignore-placement': true }
                    });
                }

                // [FIX-RACE-ROBUST] الخريطة جاهزة الآن فعلياً — نُفرّغ كل العمليات المؤجلة (نقطة المندوب/الوجهة/المسار) دفعة واحدة
                _tMapIsReady = true;
                const queued = _tMapReadyQueue;
                _tMapReadyQueue = [];
                queued.forEach(fn => { try { fn(); } catch(e) {} });
            }

            // [FIX-RACE-ROBUST] نستخدم style.load لأنه الحدث الموثوق لجهوزية الستايل لإضافة Source/Layer،
            // ونحتاط بحدث load أيضاً في حال لم يكن الستايل قد اكتمل وقت style.load لأي سبب
            if (_tMap.isStyleLoaded()) _setupLayers();
            else {
                let _setupDone = false;
                _tMap.on('style.load', () => { if (!_setupDone) { _setupDone = true; _setupLayers(); } });
                _tMap.on('load', () => { if (!_setupDone) { _setupDone = true; _setupLayers(); } });
            }
            _showMapPlaceholder(false);

            // [FIX-CANVAS-SIZE] إجبار Mapbox على إعادة قياس حجم اللوحة (Canvas) ليطابق الحاوية الحقيقية فعلياً
            requestAnimationFrame(() => { if (_tMap) _tMap.resize(); });
            setTimeout(() => { if (_tMap) _tMap.resize(); }, 300);
            if (!window._tResizeListenerAdded) {
                window._tResizeListenerAdded = true;
                const _onWinResize = () => { if (_tMap && document.getElementById('p-track-driver').classList.contains('active')) _tMap.resize(); };
                window.addEventListener('resize', _onWinResize);
                window.addEventListener('orientationchange', () => setTimeout(_onWinResize, 250));
            }
        }

        // [FIX-NATIVE-MARKERS] تحريك نقطة المندوب بسلاسة عبر تحديث إحداثيات الـ Source تدريجياً بالأنيميشن
        // (نفس الأسلوب الذي تستخدمه تطبيقات التوصيل الاحترافية لتحريك نقاط GeoJSON بسلاسة)
        function _animateDriverTo(toLngLat, duration) {
            if (_tAnimFrame) cancelAnimationFrame(_tAnimFrame);
            const from = _tDriverCurPos || toLngLat;
            const start = performance.now();
            function step(now) {
                const t = Math.min(1, (now - start) / duration);
                const lng = from[0] + (toLngLat[0] - from[0]) * t;
                const lat = from[1] + (toLngLat[1] - from[1]) * t;
                _tDriverCurPos = [lng, lat];
                _setDriverPoint(lat, lng);
                if (t < 1) _tAnimFrame = requestAnimationFrame(step);
                else _tDriverCurPos = toLngLat;
            }
            _tAnimFrame = requestAnimationFrame(step);
        }

        async function _fetchRoute(origin, dest) {
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
                const res = await fetch(url);
                const data = await res.json();
                if (!data.routes || !data.routes.length) return null;
                return data.routes[0];
            } catch(e) { return null; }
        }

        async function _recalcRouteFromState(driverPos) {
            if (!_tMap || !driverPos || !_tLastDest || _tLastDest.error) return;
            // [FIX-RACE-ROBUST] إن لم تكن الخريطة جاهزة بعد، نؤجل التنفيذ عبر طابور الجهوزية الموحّد
            if (!_tMapIsReady) { _onMapReady(() => _recalcRouteFromState(driverPos)); return; }
            const route = await _fetchRoute(driverPos, _tLastDest);
            const src = _tMap.getSource('track-route');
            if (!route) {
                // [FIX-ROUTE-FALLBACK] خط مباشر تقريبي عند تعذّر حساب مسار طرق فعلي
                if (src) src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [[driverPos.lng, driverPos.lat], [_tLastDest.lng, _tLastDest.lat]] } });
                const km = _haversine(driverPos.lat, driverPos.lng, _tLastDest.lat, _tLastDest.lng);
                const etaEl = document.getElementById('track-eta');
                const distEl = document.getElementById('track-distance');
                if (etaEl) etaEl.innerText = '~' + Math.max(1, Math.ceil(km / 0.5)) + ' دقيقة';
                if (distEl) distEl.innerText = '~' + km.toFixed(1) + ' كم';
                return;
            }
            if (src) src.setData({ type: 'Feature', geometry: route.geometry });
            const mins = Math.max(1, Math.ceil(route.duration / 60));
            const km = (route.distance / 1000).toFixed(1);
            const etaEl = document.getElementById('track-eta');
            const distEl = document.getElementById('track-distance');
            if (etaEl) etaEl.innerText = mins + ' دقيقة';
            if (distEl) distEl.innerText = km + ' كم';
            if (route.distance < 120 && _tCurStage !== 'arrived') {
                if (_tCurStage === 'to_customer') {
                    _tCurStage = 'arrived';
                    if (_tCurrentOrder) _refreshStatusUI(_tCurrentOrder);
                }
            }
        }

        function _refreshStatusUI(order) {
            const pill = document.getElementById('track-status-pill');
            const statusEl = document.getElementById('track-order-status');
            const statusEl2 = document.getElementById('track-order-status-2');
            const text = _statusText(order);
            if (pill) pill.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> ' + text;
            if (statusEl) statusEl.innerText = text;
            if (statusEl2) statusEl2.innerText = text;
        }

        // [FIX-ROUTE-SOURCE] إعادة تحليل الوجهة (مطعم أو عميل) من بيانات حقيقية + تحديث نقطة الوجهة والمسار والكاميرا
        async function _refreshDestinationAndRoute(order, driverPos) {
            const dest = await _resolveDestination(order, driverPos);

            if (dest.error) {
                _tLastDest = null;
                _clearDestPoint();
                _setDestError(dest.error);
                if (_tMap) {
                    const src = _tMap.getSource('track-route');
                    if (src) src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
                    if (driverPos) _tMap.flyTo({ center: [driverPos.lng, driverPos.lat], zoom: 16 });
                }
                document.getElementById('track-eta').innerText = '--';
                document.getElementById('track-distance').innerText = '--';
                return;
            }

            _setDestError(null);
            _tLastDest = dest;
            _setDestPoint(dest.lat, dest.lng, dest.icon);

            if (driverPos) {
                _fitBounds(driverPos, dest);
                _tFollowMode = false;
                _tUserInteracted = false;
                _updateRecenterBtnVisibility();
                _scheduleAutoFollow();
                _tLastRouteAt = Date.now();
                _tLastRouteLatLng = { lat: driverPos.lat, lng: driverPos.lng };
                await _recalcRouteFromState(driverPos);
            }
        }

        // [FIX-SMOOTH-UPDATE] يُستدعى عند كل موقع جديد للمندوب — لا يعيد إنشاء الخريطة أبداً بعد أول مرة
        async function _updateDriverPosition(row, order) {
            if (!row || !row.lat || !row.lng) return;
            const lat = parseFloat(row.lat), lng = parseFloat(row.lng);
            _tLastPosAt = Date.now();
            const newPos = [lng, lat];

            if (!_tMap) {
                // أول وصول لموقع المندوب — هنا فقط تُبنى الخريطة، ومركزها هو موقع المندوب الحقيقي
                _ensureMap(lat, lng, 16);
                _tDriverCurPos = newPos;
                _setDriverPoint(lat, lng); // [FIX-RACE-ROBUST] تُنفَّذ بمجرد جهوزية الخريطة تلقائياً عبر طابور الجهوزية
                await _refreshDestinationAndRoute(order, { lat, lng });
                return;
            }

            if (!_tDriverCurPos) {
                _tDriverCurPos = newPos;
                _setDriverPoint(lat, lng);
            } else {
                // [FIX-LIVE-TRACKING] مدة الأنيميشن أصبحت تقارب فترة الاستطلاع (3 ثوانٍ) بدل ثانية واحدة فقط،
                // فتنزلق الأيقونة بسلاسة طوال الوقت بين كل تحديث وآخر بدل أن تتحرك بسرعة ثم تتوقف منتظرة
                _animateDriverTo(newPos, 2800);
            }

            // [FIX-FOLLOW] في وضع المتابعة التلقائية تنتقل الكاميرا بسلاسة لتبقي المندوب في منتصف الشاشة
            if (_tFollowMode && _tMap) {
                _tMap.easeTo({ center: newPos, duration: 1000 });
            }

            const now = Date.now();
            const moved = _tLastRouteLatLng ? _haversine(_tLastRouteLatLng.lat, _tLastRouteLatLng.lng, lat, lng) * 1000 : 999999;
            // [FIX-LIVE-TRACKING] تقليل الحد الزمني لإعادة حساب المسار/الوقت/المسافة من 8 ثوانٍ إلى 3 لتتزامن
            // مع تردد استطلاع الموقع الجديد — هذا يضمن أن الوقت والمسافة ينخفضان تدريجياً وبشكل حي حقيقي
            // مع كل اقتراب فعلي للمندوب، لا أن يبقيا ثابتين لفترة طويلة كما كانا سابقاً
            if (moved > 15 || (now - _tLastRouteAt) > 3000) {
                _tLastRouteAt = now;
                _tLastRouteLatLng = { lat, lng };
                _recalcRouteFromState({ lat, lng });
            }
        }

        // [FIX-FITBOUNDS-PADDING] حجز مساحة كافية أسفل الخريطة حتى لا تغطي البطاقة السفلية أي جزء من المسار
        function _fitBounds(driverPos, destPos) {
            if (!_tMap || !driverPos || !destPos) return;
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([driverPos.lng, driverPos.lat]);
            bounds.extend([destPos.lng, destPos.lat]);
            _tMap.fitBounds(bounds, { padding: { top: 90, bottom: 170, left: 60, right: 60 }, maxZoom: 16 });
        }

        async function _fetchDriverPos(driverId) {
            try {
                const { data: posRow } = await _supabase.from('sh_admin_tracking').select('*').eq('id', driverId).maybeSingle();
                return posRow;
            } catch(e) { return null; }
        }

        async function _loadOrderAndStart(order) {
            _tOrderId = order.id;
            _tDriverId = order.driver_id;
            _tCurStage = order.driver_stage || 'to_restaurant';
            _tCurrentOrder = order;
            _tLastDest = null;
            _tLastRouteLatLng = null;
            _tDriverCurPos = null;

            document.getElementById('track-order-id').innerText = '#' + String(order.id).substring(0,8);
            document.getElementById('track-res-name').innerText = order.restaurant_name || '--';
            document.getElementById('track-driver-name').innerText = order.driver_name || '--';
            _setDestError(null);
            _refreshStatusUI(order);

            _showMapPlaceholder(true);
            const posRow = await _fetchDriverPos(order.driver_id);
            if (posRow && posRow.lat && posRow.lng) {
                await _updateDriverPosition(posRow, order);
            }

            _subscribeRealtime(order);
            _startWatchdog(order);
        }

        // [FIX-POLL-FALLBACK] معالجة موحّدة لأي تحديث على بيانات الطلب — تُستخدم من الـ Realtime وأيضاً
        // من نظام الاستطلاع الدوري (Polling) الذي يعمل بشكل مستقل عن نجاح الاتصال اللحظي أو فشله
        function _handleOrderUpdate(newOrder) {
            const stageChanged = (newOrder.driver_stage || 'to_restaurant') !== _tCurStage;
            _tCurStage = newOrder.driver_stage || _tCurStage;
            _tCurrentOrder = newOrder;
            document.getElementById('track-driver-name').innerText = newOrder.driver_name || '--';
            _refreshStatusUI(newOrder);

            if (newOrder.status === 'completed') {
                document.getElementById('track-success-overlay').style.display = 'flex';
                setTimeout(() => closeDriverTrackingPage(), 3000);
                return;
            }
            if (newOrder.status === 'cancelled') {
                closeDriverTrackingPage();
                return;
            }
            if (stageChanged) {
                // [FIX-PICKUP-SWITCH] تبديل فوري للوجهة (مطعم↔عميل) من بيانات حقيقية + إعادة رسم المسار
                const dp = _tDriverCurPos ? { lat: _tDriverCurPos[1], lng: _tDriverCurPos[0] } : null;
                _refreshDestinationAndRoute(newOrder, dp);
            }
        }

        function _subscribeRealtime(order) {
            _cleanupChannels();

            const _sessionTag = Date.now() + '_' + Math.floor(Math.random() * 100000);
            _tPosChannel = _supabase.channel('track_pos_' + order.driver_id + '_' + _sessionTag)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'sh_admin_tracking', filter: `id=eq.${order.driver_id}` }, payload => {
                    _updateDriverPosition(payload.new, _tCurrentOrder || order);
                })
                .subscribe((status) => { _debugLog(`posChan:${status}`, 'posChanStatus'); });

            _tOrderChannel = _supabase.channel('track_order_' + order.id + '_' + _sessionTag)
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: `id=eq.${order.id}` }, payload => {
                    _debugLog(`order-evt stage:${payload.new.driver_stage} status:${payload.new.status}`, 'orderEvt');
                    _handleOrderUpdate(payload.new);
                })
                .subscribe((status) => { _debugLog(`orderChan:${status}`, 'orderChanStatus'); });
        }

        function _startWatchdog(order) {
            if (_tWatchdog) clearInterval(_tWatchdog);
            // [FIX-LIVE-TRACKING] الاستطلاع أصبح هو المصدر الأساسي والمضمون لتحديث موقع المندوب، لا مجرد
            // احتياط ينتظر 12 ثانية صمت — لأن الاتصال اللحظي (Realtime) أثبت عدم استقراره مراراً في هذا
            // المشروع (TIMED_OUT متكرر). الآن يجلب الموقع الحقيقي كل 3 ثوانٍ دائماً، فتبقى الحركة شبه
            // مباشرة ومضمونة بصرف النظر عن حالة الاتصال اللحظي — والأنيميشن السلس بين كل تحديث يجعلها تبدو متصلة
            _tWatchdog = setInterval(async () => {
                const posRow = await _fetchDriverPos(_tDriverId);
                if (posRow) _updateDriverPosition(posRow, _tCurrentOrder || order);
            }, 3000);

            // [FIX-POLL-FALLBACK] استطلاع دوري مستقل لحالة الطلب نفسها (status/driver_stage) كل 5 ثوانٍ —
            // يعمل بالتوازي مع الـ Realtime ويضمن استمرار عمل النظام حتى لو فشل الاتصال اللحظي تماماً
            if (_tOrderPoll) clearInterval(_tOrderPoll);
            _tOrderPoll = setInterval(async () => {
                try {
                    const { data: freshOrder } = await _supabase.from('sh_public_orders').select('*').eq('id', _tOrderId).maybeSingle();
                    if (freshOrder) {
                        const changed = (freshOrder.driver_stage || 'to_restaurant') !== _tCurStage || freshOrder.status !== (_tCurrentOrder && _tCurrentOrder.status);
                        _debugLog(`poll db.stage:${freshOrder.driver_stage} local.stage:${_tCurStage} changed:${changed}`, 'pollRaw');
                        if (changed) {
                            _debugLog(`poll-update stage:${freshOrder.driver_stage} status:${freshOrder.status}`, 'orderEvt');
                            _handleOrderUpdate(freshOrder);
                        }
                    }
                } catch(e) {}
            }, 5000);
        }

        function _cleanupChannels() {
            if (_tPosChannel) { try { _supabase.removeChannel(_tPosChannel); } catch(e){} _tPosChannel = null; }
            if (_tOrderChannel) { try { _supabase.removeChannel(_tOrderChannel); } catch(e){} _tOrderChannel = null; }
            if (_tWatchdog) { clearInterval(_tWatchdog); _tWatchdog = null; }
            if (_tOrderPoll) { clearInterval(_tOrderPoll); _tOrderPoll = null; }
        }

        // [FIX-MAP-CENTER] تدمير الخريطة بالكامل عند الإغلاق لضمان إعادة تمركز صحيحة عند الفتح التالي
        function _destroyMap() {
            if (_tMap) { try { _tMap.remove(); } catch(e){} _tMap = null; }
            _tDriverCurPos = null;
            _tLastDest = null; _tLastRouteLatLng = null; _tCurrentOrder = null;
            _tFollowMode = false; _tUserInteracted = false;
            _tMapIsReady = false; _tMapReadyQueue = [];
            _tLiveCustomerPos = null;
            _setDestError(null);
            _showMapPlaceholder(true);
        }

        // [FIX-BOTTOM-SHEET] منطق البطاقة السفلية القابلة للسحب + وضع متابعة المندوب
        let _tFollowMode = false;
        let _tUserInteracted = false;
        let _tSheetExpanded = false;
        let _tAutoFollowTimer = null;
        function _updateRecenterBtnVisibility() {
            const btn = document.getElementById('track-recenter-btn');
            if (btn) btn.style.display = _tFollowMode ? 'none' : 'flex';
        }
        window.recenterOnDriver = function() {
            _tFollowMode = true;
            _tUserInteracted = false;
            _updateRecenterBtnVisibility();
            if (_tMap && _tDriverCurPos) {
                _tMap.easeTo({ center: _tDriverCurPos, zoom: Math.max(_tMap.getZoom(), 15), duration: 600 });
            }
        };
        function _scheduleAutoFollow() {
            if (_tAutoFollowTimer) clearTimeout(_tAutoFollowTimer);
            _tAutoFollowTimer = setTimeout(() => {
                if (!_tUserInteracted) window.recenterOnDriver();
            }, 3500);
        }
        function _initBottomSheetDrag() {
            const sheet = document.getElementById('track-sheet');
            const handleWrap = document.getElementById('track-sheet-handle-wrap');
            if (!sheet || !handleWrap || sheet._dragInit) return;
            sheet._dragInit = true;
            let startY = 0, dragging = false;

            function setExpanded(expand) {
                _tSheetExpanded = expand;
                sheet.style.maxHeight = expand ? '78vh' : '128px';
                sheet.classList.remove('dragging');
                sheet.style.transform = 'translateY(0)';
                const recenterBtn = document.getElementById('track-recenter-btn');
                if (recenterBtn) { recenterBtn.style.opacity = expand ? '0' : '1'; recenterBtn.style.pointerEvents = expand ? 'none' : 'auto'; }
            }
            function onStart(clientY) { dragging = true; startY = clientY; sheet.classList.add('dragging'); }
            function onMove(clientY) { if (!dragging) return; const delta = clientY - startY; sheet.style.transform = `translateY(${Math.max(0, delta)}px)`; }
            function onEnd(clientY) {
                if (!dragging) return;
                dragging = false;
                const delta = clientY - startY;
                sheet.classList.remove('dragging');
                sheet.style.transform = 'translateY(0)';
                if (!_tSheetExpanded && delta < -25) setExpanded(true);
                else if (_tSheetExpanded && delta > 25) setExpanded(false);
                else if (!_tSheetExpanded) setExpanded(false);
            }
            handleWrap.addEventListener('touchstart', e => onStart(e.touches[0].clientY), { passive: true });
            handleWrap.addEventListener('touchmove', e => onMove(e.touches[0].clientY), { passive: true });
            handleWrap.addEventListener('touchend', e => onEnd(e.changedTouches[0].clientY));
            handleWrap.addEventListener('mousedown', e => {
                onStart(e.clientY);
                const mm = (ev) => onMove(ev.clientY);
                const mu = (ev) => { onEnd(ev.clientY); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); };
                document.addEventListener('mousemove', mm);
                document.addEventListener('mouseup', mu);
            });
            handleWrap.addEventListener('click', () => setExpanded(!_tSheetExpanded));
        }

        // ===== الدوال العامة المستخدمة من واجهة المستخدم =====
        window._refreshTrackButton = function(order) {
            const btn = document.getElementById('open-track-driver-btn');
            if (!btn) return;
            // [FIX-TRACK-BTN] 'picked' = المندوب في الطريق — أهم لحظة للتتبع
            const canTrack = order && order.driver_id && ['accepted', 'preparing', 'ready', 'picked'].includes(order.status);
            btn.style.display = canTrack ? 'block' : 'none';
            window._lastTrackableOrder = canTrack ? order : null;
        };

        window.openDriverTrackingPage = async function() {
            if (!currentOrderKey) return;
            const { data: order } = await _supabase.from('sh_public_orders').select('*').eq('id', currentOrderKey).single();
            if (!order || !order.driver_id) { showNotify('بانتظار قبول الصقر للطلب أولاً 🦅', 'info'); return; }
            document.getElementById('track-success-overlay').style.display = 'none';
            document.getElementById('p-track-driver').classList.add('active');
            const sheet = document.getElementById('track-sheet');
            if (sheet) { sheet.style.maxHeight = '128px'; sheet.style.transform = 'translateY(0)'; _tSheetExpanded = false; }
            _initBottomSheetDrag();
            _updateRecenterBtnVisibility();
            // [FIX-PROACTIVE-GEO] نطلب إذن الموقع فوراً عند فتح صفحة التتبع لأول مرة (لا ننتظر حدوث خطأ)
            // إن وافق العميل، يُستخدم موقعه لتحسين دقة المسار/الوقت كاحتياطي إضافي — وإن رفض، يستمر النظام
            // طبيعياً بالاعتماد على عنوان التوصيل المسجَّل بالطلب دون أي إجبار أو تكرار للطلب
            _tLiveCustomerPos = null;
            _requestBrowserGeolocation().then(pos => { _tLiveCustomerPos = pos; });
            await _loadOrderAndStart(order);
        };

        window.closeDriverTrackingPage = function() {
            document.getElementById('p-track-driver').classList.remove('active');
            if (_tAutoFollowTimer) { clearTimeout(_tAutoFollowTimer); _tAutoFollowTimer = null; }
            _cleanupChannels();
            _destroyMap();
        };
    })();
    // ===== نهاية نظام [MAPBOX-TRACK] =====
    // ===== نهاية نظام [MAPBOX-TRACK] =====

    // [DEL-TRACK] نظام تتبع المندوب الحي - محذوف بالكامل


    // ===== FIX-TG-CLIENT: دالة فتح قناة تيليجرام موثوقة (فتح خارجي دائماً) =====
    let _tgLinks = { admin: '#', channel: '#' };
    function _openTelegram(type) {
        const url = (_tgLinks[type] || '').trim();
        if (!url || url === '#' || url === '') {
            showNotify('رابط قناة التيليجرام غير متوفر حالياً', 'error');
            return;
        }
        // FIX: window.open مع خيارات صريحة تمنع إعادة تحميل نفس الصفحة
        const w = window.open(url, '_blank', 'noopener,noreferrer');
        // fallback إذا منع المتصفح النافذة المنبثقة
        if (!w || w.closed || typeof w.closed === 'undefined') {
            window.location.href = url;
        }
    }
    // ===== نهاية FIX-TG-CLIENT =====

    // [FIX-ERR-7] معالج عام للأخطاء غير المعالجة في العميل
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message) {
            const msg = event.reason.message;
            if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Load failed')) {
                event.preventDefault(); return;
            }
        }
        event.preventDefault();
    });

    // [FIX-ONLINE-7b] مراقبة حالة الاتصال
    window.addEventListener('offline', function() {
        showNotify('⚠️ انقطع الاتصال بالإنترنت — سيتم إعادة الاتصال تلقائياً', 'error');
    });
    window.addEventListener('online', function() {
        showNotify('✅ عاد الاتصال بالإنترنت', 'info');
        // [FIX-OFFLINE-QUEUE] إعادة محاولة أي طلبات تعذّر إرسالها سابقاً بسبب الانقطاع
        try { _retryPendingOfflineOrders(); } catch(e) {}
        // [ONLINE-FIX-KEY] استعادة currentOrderKey من localStorage عند عودة الإنترنت
        if (!currentOrderKey) {
            const _onlineSavedKey = localStorage.getItem('shahen_active_order_id');
            if (_onlineSavedKey) currentOrderKey = _onlineSavedKey;
        }
        // إعادة تشغيل القنوات النشطة
        try { initRealtimeNotifications(); } catch(_e) {}
        if (currentOrderKey) {
            if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
            listenForOrderUpdates(currentOrderKey);
            if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
            listenConsultStatusOnly(currentOrderKey);
        }
    });

    // ================================================================
    // [WATCHDOG-CLIENT] فحص دوري كل 20 ثانية لضمان بقاء القنوات حية
    // ================================================================
    setInterval(function() {
        if (!currentUser) return;
        // [CANCEL-FIX] فحص قناة الإشعارات دائماً — حتى بعد إلغاء الطلب أو بدون طلب نشط
        try {
            const _notifChCheck = _supabase.channel('custom-filter-channel');
            if (!_notifChCheck || _notifChCheck.state === 'errored' || _notifChCheck.state === 'closed' || _notifChCheck.state === 'leaving') {
                try { if (_notifChCheck) _supabase.removeChannel(_notifChCheck); } catch(_e2) {}
                initRealtimeNotifications();
            }
        } catch(_ne) {
            try { initRealtimeNotifications(); } catch(_e2) {}
        }
        // [BG-FIX-KEY] استعادة currentOrderKey من localStorage في حالة فُقد من الذاكرة
        if (!currentOrderKey) {
            const _wdSavedKey = localStorage.getItem('shahen_active_order_id');
            if (_wdSavedKey) currentOrderKey = _wdSavedKey;
        }
        // فحص قنوات الطلب النشط فقط إذا كان هناك طلب
        if (!currentOrderKey) return;
        let _dead = false;
        try {
            if (!_orderChannel) _dead = true;
            else if (_orderChannel.state === 'errored' || _orderChannel.state === 'closed' || _orderChannel.state === 'leaving') _dead = true;
        } catch(_e) { _dead = true; }
        try {
            if (!_consultStatusChannel) _dead = true;
            else if (_consultStatusChannel.state === 'errored' || _consultStatusChannel.state === 'closed' || _consultStatusChannel.state === 'leaving') _dead = true;
        } catch(_e) { _dead = true; }
        if (_dead) {
            if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
            if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
            listenForOrderUpdates(currentOrderKey);
            listenConsultStatusOnly(currentOrderKey);
        }
    }, 20000);

    // [PAGESHOW-CLIENT] استعادة من bfcache — شائع في Android WebView وiPhone Safari
    window.addEventListener('pageshow', function(e) {
        if (!currentUser) return;
        if (e.persisted) {
            // صفحة جاءت من bfcache = كانت في الخلفية فترة طويلة
            // [CANCEL-FIX] أعد تشغيل الإشعارات دائماً بغض النظر عن وجود طلب نشط
            try { initRealtimeNotifications(); } catch(_e) {}
            // [BG-FIX-KEY] استعادة currentOrderKey من localStorage عند العودة من bfcache
            if (!currentOrderKey) {
                const _pgSavedKey = localStorage.getItem('shahen_active_order_id');
                if (_pgSavedKey) currentOrderKey = _pgSavedKey;
            }
            if (currentOrderKey) {
                if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
                if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
                listenForOrderUpdates(currentOrderKey);
                listenConsultStatusOnly(currentOrderKey);
            }
        }
    });

    // [FOCUS-CLIENT] بعض WebView تُطلق focus بدلاً من visibilitychange
    window.addEventListener('focus', function() {
        if (!currentUser) return;
        setTimeout(function() {
            // [CANCEL-FIX] أعد تشغيل الإشعارات دائماً بغض النظر عن وجود طلب نشط
            try {
                const _notifFocusCh = _supabase.channel('custom-filter-channel');
                if (!_notifFocusCh || _notifFocusCh.state === 'errored' || _notifFocusCh.state === 'closed') {
                    try { if (_notifFocusCh) _supabase.removeChannel(_notifFocusCh); } catch(_e2) {}
                    initRealtimeNotifications();
                }
            } catch(_fe2) { try { initRealtimeNotifications(); } catch(_e3) {} }
            // [BG-FIX-KEY] استعادة currentOrderKey من localStorage عند العودة عبر focus
            if (!currentOrderKey) {
                const _focusSavedKey = localStorage.getItem('shahen_active_order_id');
                if (_focusSavedKey) currentOrderKey = _focusSavedKey;
            }
            if (!currentOrderKey) return;
            try {
                const _chState = _orderChannel ? _orderChannel.state : 'null';
                if (!_orderChannel || _chState === 'errored' || _chState === 'closed') {
                    if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
                    listenForOrderUpdates(currentOrderKey);
                }
                const _csState = _consultStatusChannel ? _consultStatusChannel.state : 'null';
                if (!_consultStatusChannel || _csState === 'errored' || _csState === 'closed') {
                    if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
                    listenConsultStatusOnly(currentOrderKey);
                }
            } catch(_fe) {}
        }, 500);
    });
    // ================================================================
    // [END-WATCHDOG-CLIENT]
    // ================================================================

    // ================================================================
    // [HEARTBEAT-CLIENT] فحص صحة الاتصال كل 45 ثانية — يكشف انقطاع WebSocket الصامت
    // يحدث عند: التنقل بين التطبيقات، قفل الشاشة، الخلفية على iOS/Android
    // ================================================================
    let _lastHeartbeatOk = Date.now();
    setInterval(async function() {
        if (!currentUser) return;
        try {
            // اختبار سريع بـ HTTP مباشر — أخف من Supabase client
            const _hbCtrl = new AbortController();
            const _hbTimer = setTimeout(() => _hbCtrl.abort(), 5000);
            const _hbResp = await fetch('https://qfyggwffibmrlsvlzwgs.supabase.co/rest/v1/app_config?select=id&id=eq.1&limit=1', {
                signal: _hbCtrl.signal,
                headers: { 'apikey': SB_KEY, 'Accept': 'application/json' }
            });
            clearTimeout(_hbTimer);
            if (_hbResp.ok) {
                _lastHeartbeatOk = Date.now();
            }
        } catch(_hbErr) {
            // فشل الـ heartbeat — الاتصال منقطع أو بطيء جداً
            // لا نفعل شيئاً هنا، الـ online/offline handler سيتولى الأمر
            return;
        }
        // إذا نجح الـ heartbeat، تحقق من حالة القنوات وأعد تشغيل المتوقفة
        if (!currentOrderKey) {
            const _hbSavedKey = localStorage.getItem('shahen_active_order_id');
            if (_hbSavedKey) currentOrderKey = _hbSavedKey;
        }
        // فحص قناة الإشعارات
        try {
            const _hbNotifCh = _supabase.channel('custom-filter-channel');
            if (!_hbNotifCh || _hbNotifCh.state === 'errored' || _hbNotifCh.state === 'closed') {
                try { if (_hbNotifCh) _supabase.removeChannel(_hbNotifCh); } catch(_e2) {}
                try { initRealtimeNotifications(); } catch(_e3) {}
            }
        } catch(_hbNe) {}
        // فحص قنوات الطلب
        if (currentOrderKey) {
            const _hbOrderDead = !_orderChannel || _orderChannel.state === 'errored' || _orderChannel.state === 'closed' || _orderChannel.state === 'leaving';
            const _hbCsDead = !_consultStatusChannel || _consultStatusChannel.state === 'errored' || _consultStatusChannel.state === 'closed' || _consultStatusChannel.state === 'leaving';
            if (_hbOrderDead) {
                if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
                try { listenForOrderUpdates(currentOrderKey); } catch(_e4) {}
            }
            if (_hbCsDead) {
                if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
                try { listenConsultStatusOnly(currentOrderKey); } catch(_e5) {}
            }
        }
    }, 45000);
    // ================================================================
    // [END-HEARTBEAT-CLIENT]
    // ================================================================

        // [FIX-VIS-5] إعادة تشغيل القنوات عند العودة للتبويب بعد غياب
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // [CANCEL-FIX] أعد تشغيل قناة الإشعارات دائماً عند العودة — حتى بدون طلب نشط
            setTimeout(function() {
                if (!currentUser) return;
                try {
                    const _visNotifCh = _supabase.channel('custom-filter-channel');
                    if (!_visNotifCh || _visNotifCh.state === 'errored' || _visNotifCh.state === 'closed' || _visNotifCh.state === 'leaving') {
                        try { if (_visNotifCh) _supabase.removeChannel(_visNotifCh); } catch(_e2) {}
                        initRealtimeNotifications();
                    }
                } catch(_vne) { try { initRealtimeNotifications(); } catch(_e2) {} }
            }, 300);

            // [BG-FIX-KEY] استعادة currentOrderKey من localStorage عند العودة من الخلفية
            // يحل مشكلة: currentOrderKey يصبح null بعد إلغاء الطلب ثم إنشاء طلب جديد
            if (!currentOrderKey) {
                const _bgSavedKey = localStorage.getItem('shahen_active_order_id');
                if (_bgSavedKey) {
                    currentOrderKey = _bgSavedKey;
                }
            }

            if (currentOrderKey) {
                // [BG-RECONNECT] أعد تشغيل القنوات دائماً عند العودة — لا تنتظر حالة closed فقط
                if (_orderChannel) { try { _supabase.removeChannel(_orderChannel); } catch(e){} _orderChannel = null; }
                listenForOrderUpdates(currentOrderKey);
                if (_consultStatusChannel) { try { _supabase.removeChannel(_consultStatusChannel); } catch(e){} _consultStatusChannel = null; }
                listenConsultStatusOnly(currentOrderKey);
                // [FIX-STUCK] إعادة مزامنة حالة الطلب عند العودة لمنع التعليق — بدون تحديث للمتصفح
                setTimeout(async () => {
                    try {
                        const _savedKey = localStorage.getItem('shahen_active_order_id');
                        if (!_savedKey) return;
                        // [BG-FIX-KEY] تأكيد تزامن currentOrderKey مع localStorage
                        if (!currentOrderKey) currentOrderKey = _savedKey;
                        const { data: _freshOrd } = await _supabase.from('sh_public_orders')
                            .select('status, verify_code, driver_name, driver_phone, total, delivery_price, items, restaurant_name, res_type, order_type, is_consultation, driver_id')
                            .eq('id', _savedKey).maybeSingle();
                        if (!_freshOrd) {
                            // الطلب لم يعد موجوداً في السيرفر — صفّر الكاش المحلي
                            localStorage.removeItem('shahen_active_order_id');
                            currentOrderKey = null;
                            return;
                        }
                        // تحديث الكود إذا تغيّر
                        if (_freshOrd.verify_code && _freshOrd.verify_code !== verificationCode) {
                            verificationCode = _freshOrd.verify_code;
                            const _rcEl = document.getElementById('reveal-order-code');
                            if (_rcEl) _rcEl.innerText = verificationCode;
                            const _ccEl = document.getElementById('client-reveal-code');
                            if (_ccEl) _ccEl.innerText = verificationCode;
                        }
                        // إذا تغيّرت الحالة لـ accepted/completed/cancelled نُعيد تهيئة الواجهة
                        const _liveStatus = _freshOrd.status;
                        if (_liveStatus === 'cancelled') {
                            localStorage.removeItem('shahen_active_order_id');
                            currentOrderKey = null;
                            showNotify('تم إلغاء طلبك ❌', 'error');
                            if (typeof renderHistory === 'function') renderHistory();
                        } else if (_liveStatus === 'completed') {
                            localStorage.removeItem('shahen_active_order_id');
                            currentOrderKey = null;
                            if (typeof renderHistory === 'function') renderHistory();
                        } else if ((_liveStatus === 'accepted' || _liveStatus === 'preparing' || _liveStatus === 'ready') && _freshOrd.driver_id) {
                            // إذا كان المندوب موجوداً ولم تظهر صفحة الكود — نفتحها
                            const _chatPage = document.getElementById('p-chat');
                            if (_chatPage && _chatPage.style.display === 'none') {
                                if (typeof checkOrderAction === 'function') checkOrderAction(_savedKey, _liveStatus);
                            }
                        }
                    } catch(_visErr) { /* تجاهل أخطاء إعادة المزامنة */ }
                }, 800);
                // [END-FIX-STUCK]
            }
            if (_spChatOrderId && (!_spChatChannel || _spChatChannel.state === 'closed')) {
                if (_spChatChannel) { try { _supabase.removeChannel(_spChatChannel); } catch(e){} _spChatChannel = null; }
                openSpecialtyChat(_spChatOrderId, '', '');
            }
            if (_spChatOrderId && _consultChatChannel && _consultChatChannel.state === 'closed') {
                try { _supabase.removeChannel(_consultChatChannel); } catch(e){}
                _consultChatChannel = null;
            }
        }
    });

    // ================================================================
    // [FORCE-RELOAD-BTN] تمت إزالة هذه الميزة بناءً على طلب المستخدم
    // ================================================================
    // ================================================================
    // [END-FORCE-RELOAD-BTN]
    // ================================================================

    // ===========================================================================
    // ===== [PICKUP-WAITING] شاشة "بانتظار موافقة المطعم" — تظهر فور إرسال طلب
    // الاستلام، ولا تنتقل لشاشة "طلب الاستلام" النهائية إلا بعد قبول صريح من المطعم =====
    // ===========================================================================
    let _pickupWaitPollInterval = null;

    function _showPickupWaiting(resName, orderId, total) {
        if (_pickupWaitPollInterval) { clearInterval(_pickupWaitPollInterval); _pickupWaitPollInterval = null; }
        let overlay = document.getElementById('pickup-waiting-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pickup-waiting-overlay';
            overlay.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:var(--purple); z-index:20000; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:24px; overflow-y:auto;';
            const shell = document.querySelector('.app-shell') || document.body;
            shell.appendChild(overlay);
        }
        overlay.innerHTML = `
            <div style="font-size:56px; margin-bottom:14px; animation:spin 2s linear infinite;">⏳</div>
            <h2 style="color:var(--gold); font-size:18px; margin:0 0 10px;">بانتظار موافقة المطعم...</h2>
            <p style="color:#ccc; font-size:12px; margin:0 0 18px; line-height:1.9;">
                جاري إرسال طلبك إلى <b style="color:var(--gold);">${escHtml(resName)}</b><br>
                يرجى الانتظار، سننتقل تلقائياً بمجرد موافقة المطعم على طلبك
            </p>
            <div style="background:rgba(212,175,55,0.1); border:1px dashed var(--gold); border-radius:14px; padding:12px 20px; margin-bottom:18px; width:100%; max-width:290px;">
                <div style="font-size:10px; color:#aaa; margin-bottom:4px;">رقم الطلب</div>
                <div style="font-size:16px; font-weight:bold; color:var(--gold); letter-spacing:2px;">#${escHtml(String(orderId).slice(-6).toUpperCase())}</div>
            </div>
            <button onclick="_cancelPickupWaiting('${orderId}')" style="width:100%; max-width:290px; padding:12px; background:transparent; color:#e74c3c; border:1px solid #e74c3c; border-radius:14px; font-weight:bold; font-size:13px; cursor:pointer;">
                <i class="fas fa-times"></i> إلغاء الطلب
            </button>`;
        overlay.style.display = 'flex';
        _startPickupWaitPoll(orderId, resName);
    }

    async function _cancelPickupWaiting(orderId) {
        if (!confirm('هل تريد إلغاء طلب الاستلام؟')) return;
        if (_pickupWaitPollInterval) { clearInterval(_pickupWaitPollInterval); _pickupWaitPollInterval = null; }
        if (window._pickupWaitRealtimeChannel) { try { _supabase.removeChannel(window._pickupWaitRealtimeChannel); } catch(e){} window._pickupWaitRealtimeChannel = null; }
        try { await _supabase.from('sh_public_orders').update({ status: 'cancelled' }).eq('id', orderId); } catch(e) {}
        try { await _supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId); } catch(e) {}
        const overlay = document.getElementById('pickup-waiting-overlay');
        if (overlay) overlay.style.display = 'none';
        localStorage.removeItem('shahen_active_order_id');
        currentOrderKey = null;
        showNotify('تم إلغاء طلب الاستلام', 'info');
        nav('p-home');
    }

    // [PICKUP-MANUAL-ACCEPT] يراقب حالة الطلب حتى يقبله المطعم فعلياً (status='accepted') — لا ينتقل
    // لشاشة الاستلام النهائية أبداً قبل ذلك. إن رفض المطعم الطلب (status='cancelled') يُخطر العميل بوضوح.
    // [SEC-FIX-PICKUP-WAIT-REALTIME] منطق مشترك لمعالجة تحديث حالة الطلب أثناء الانتظار — يُستدعى
    // من القناة اللحظية (فوري) ومن الاستطلاع الدوري (شبكة أمان) معاً، لتفادي تكرار المنطق
    async function _handlePickupWaitStatusUpdate(order, orderId, resName) {
        if (!order) return;
        if (order.status === 'accepted' || order.status === 'preparing' || order.status === 'ready') {
            if (_pickupWaitPollInterval) { clearInterval(_pickupWaitPollInterval); _pickupWaitPollInterval = null; }
            if (window._pickupWaitRealtimeChannel) { try { _supabase.removeChannel(window._pickupWaitRealtimeChannel); } catch(e){} window._pickupWaitRealtimeChannel = null; }
            const overlay = document.getElementById('pickup-waiting-overlay');
            if (overlay) overlay.style.display = 'none';
            await _showPickupSuccess(order);
        } else if (order.status === 'cancelled') {
            if (_pickupWaitPollInterval) { clearInterval(_pickupWaitPollInterval); _pickupWaitPollInterval = null; }
            if (window._pickupWaitRealtimeChannel) { try { _supabase.removeChannel(window._pickupWaitRealtimeChannel); } catch(e){} window._pickupWaitRealtimeChannel = null; }
            const overlay = document.getElementById('pickup-waiting-overlay');
            if (overlay) overlay.style.display = 'none';
            localStorage.removeItem('shahen_active_order_id');
            currentOrderKey = null;
            showNotify('⚠️ اعتذر ' + resName + ' عن استقبال طلبك حالياً — يرجى المحاولة لاحقاً أو اختيار مطعم آخر', 'error');
            nav('p-home');
        }
    }

    function _startPickupWaitPoll(orderId, resName) {
        if (_pickupWaitPollInterval) clearInterval(_pickupWaitPollInterval);
        // [SEC-FIX-PICKUP-WAIT-REALTIME] إضافة قناة لحظية بجانب الاستطلاع الدوري (لا تحل محله) —
        // تلتقط قبول المطعم فوراً بدل انتظار أقرب دورة استطلاع (حتى 3 ثوانٍ)، مع بقاء الاستطلاع
        // كشبكة أمان في حال فشل الاتصال اللحظي لأي سبب
        try {
            if (window._pickupWaitRealtimeChannel) { _supabase.removeChannel(window._pickupWaitRealtimeChannel); window._pickupWaitRealtimeChannel = null; }
            window._pickupWaitRealtimeChannel = _supabase.channel('pickup-wait-' + orderId)
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: 'id=eq.' + orderId }, (payload) => {
                    if (!payload || !payload.new) return;
                    _handlePickupWaitStatusUpdate(payload.new, orderId, resName);
                })
                .subscribe();
        } catch(_rtErr) { console.error('[SEC-FIX-PICKUP-WAIT-REALTIME] تعذّر الاشتراك اللحظي، سيعتمد على الاستطلاع الدوري فقط:', _rtErr); }
        _pickupWaitPollInterval = setInterval(async () => {
            try {
                if (!currentOrderKey || String(currentOrderKey) !== String(orderId)) { clearInterval(_pickupWaitPollInterval); _pickupWaitPollInterval = null; return; }
                let _pollOrd;
                try {
                    const { data } = await _supabase.from('sh_public_orders').select('*').eq('id', orderId).maybeSingle();
                    _pollOrd = data;
                } catch(e) { return; }
                if (!_pollOrd) return;
                await _handlePickupWaitStatusUpdate(_pollOrd, orderId, resName);
            } catch(_pollTickErr) {
                // [FIX-BLANK-SCREEN] أي خطأ غير متوقع هنا يُسجَّل فقط — لا يوقف الاستطلاع ولا يكسر الواجهة
                console.error('[PICKUP-POLL] خطأ غير متوقع في دورة الاستطلاع:', _pollTickErr);
            }
        }, 3000);
    }

    // ===========================================================================
    // ===== [PICKUP-SUCCESS] شاشة طلب الاستلام النهائية — تظهر فقط بعد قبول المطعم =====
    // ===========================================================================
    function _pkCard(iconHtml, label, valueHtml) {
        return `
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.25); border-radius:16px; padding:14px 16px; margin-bottom:12px; width:100%; max-width:320px;">
                <div style="display:flex; flex-direction:row-reverse; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="width:38px; height:38px; border-radius:50%; background:rgba(212,175,55,0.12); display:flex; align-items:center; justify-content:center; font-size:16px; color:var(--gold);">${iconHtml}</div>
                    <div style="font-size:12px; color:var(--gold); font-weight:bold;">${label}</div>
                </div>
                ${valueHtml}
            </div>`;
    }

    async function _showPickupSuccess(order) {
        const orderId = order.id;
        const resName = order.restaurant_name || 'المطعم';
        let overlay = document.getElementById('pickup-success-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pickup-success-overlay';
            overlay.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:var(--purple); z-index:20000; display:flex; flex-direction:column; align-items:center; padding:20px 16px 28px; overflow-y:auto;';
            const shell = document.querySelector('.app-shell') || document.body;
            shell.appendChild(overlay);
        }
        // [FIX-BLANK-SCREEN] شاشة اساسية تظهر فوراً قبل أي عملية شبكة غير مضمونة — لو فشل أي شيء لاحقاً
        // (كجلب موقع المطعم)، تبقى هذه البيانات الأساسية ظاهرة دائماً بدل شاشة فارغة تماماً تغطي
        // التطبيق كله (وهو ما كان يحدث فعلياً سابقاً عند فشل أي خطوة تالية دون معالجة).
        // [FIX-PICKUP-ITEMS-NOTES] الأصناف المطلوبة وملاحظات العميل — كلاهما موجود بالفعل ضمن كائن
        // الطلب نفسه (لا يحتاجان أي استدعاء شبكة)، فيُعرضان ضمن الجزء الأساسي المضمون من الشاشة
        let _pkItemsArr = [];
        try { _pkItemsArr = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (Array.isArray(order.items) ? order.items : []); } catch(e) { _pkItemsArr = []; }
        const itemsCard = _pkItemsArr.length ? _pkCard('<i class="fas fa-utensils"></i>', 'الأصناف المطلوبة', `
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${_pkItemsArr.map(it => `
                    <div style="display:flex; justify-content:space-between; font-size:12px; color:#eee; border-bottom:1px dashed rgba(255,255,255,0.08); padding-bottom:4px;">
                        <span>${escHtml(String(it.p ?? ''))} ل.س</span>
                        <span>${escHtml(it.n || '')}</span>
                    </div>`).join('')}
            </div>`) : '';
        const _pkNotes = order.order_notes || order.notes || '';
        const notesCard = _pkNotes ? _pkCard('<i class="fas fa-sticky-note"></i>', 'ملاحظاتك', `<div style="text-align:center; font-size:13px; color:var(--gold); font-weight:bold; line-height:1.7;">${escHtml(_pkNotes)}</div>`) : '';

        overlay.innerHTML = `
            <div style="width:100%; max-width:320px; text-align:center; margin-bottom:18px;">
                <div style="font-size:22px; font-weight:bold; color:var(--gold); margin-bottom:4px;">طلب استلام 🛵</div>
                <div style="font-size:12px; color:#ccc;">جاهز للاستلام من المطعم ✨</div>
            </div>
            ${_pkCard('<i class="fas fa-file-invoice"></i>', 'رقم الطلب', `<div style="text-align:center; font-size:26px; font-weight:bold; color:#fff; letter-spacing:2px;">${escHtml(String(orderId).slice(-6).toUpperCase())}</div>`)}
            ${_pkCard('<i class="fas fa-wallet"></i>', 'الفاتورة', `<div style="text-align:center; font-size:22px; font-weight:bold; color:#fff;">${Number(order.total||0).toLocaleString('ar-SA')} <span style="font-size:13px; color:#aaa;">ل.س</span></div>`)}
            ${_pkCard('<i class="fas fa-store"></i>', 'اسم المطعم', `<div style="text-align:center; font-size:18px; font-weight:bold; color:#fff;">${escHtml(resName)}</div>`)}
            ${itemsCard}
            ${notesCard}
            <div id="pickup-extra-cards" style="width:100%; display:flex; flex-direction:column; align-items:center;">
                <div style="font-size:11px; color:#aaa; margin-bottom:12px;"><i class="fas fa-spinner fa-spin"></i> جاري تحميل موقع المطعم...</div>
            </div>
            <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.3); border-radius:16px; padding:14px 16px; margin-bottom:16px; width:100%; max-width:320px; display:flex; flex-direction:row-reverse; align-items:center; gap:12px; text-align:right;">
                <div style="font-size:30px; flex-shrink:0;">🛵</div>
                <div style="font-size:12px; color:#eee; line-height:1.8;">
                    يرجى التوجه إلى المطعم لاستلام طلبك<br>
                    عند وصولك أخبر الموظف برقم الطلب
                </div>
            </div>
            <button onclick="_closePickupSuccess()" style="width:100%; max-width:320px; padding:14px; background:linear-gradient(135deg,#d4af37,#b8962e); color:#000; border:none; border-radius:14px; font-weight:bold; font-size:14px; cursor:pointer;">
                <i class="fas fa-check-circle"></i> حسناً، سأذهب للاستلام
            </button>`;
        overlay.style.display = 'flex';
        showNotify('✅ وافق المطعم على طلبك — توجّه لاستلامه', 'success');

        // [SEC-FIX-PICKUP-COMPLETION-TRACKING] لم تكن هذه الشاشة تحتوي أي آلية لاكتشاف "تم التسليم"
        // من طرف المطعم — تبقى معروضة للأبد حتى لو أنهى المطعم الطلب فعلياً. الآن: قناة لحظية +
        // استطلاع احتياطي (نفس نمط شاشة انتظار الموافقة)، تغلق الشاشة تلقائياً فور اكتمال الطلب
        _startPickupCompletionTracking(orderId);

        // [FIX-BLANK-SCREEN] كل ما بعد هذا (الموقع/الخريطة/العدّاد) تحسين إضافي — أي فشل فيه يُسجَّل
        // فقط ولا يمس الشاشة الأساسية المعروضة أعلاه بالفعل
        try {
            await _fillPickupExtraCards(order, orderId, resName);
        } catch(e) {
            console.error('[FIX-BLANK-SCREEN] فشل تحميل تفاصيل إضافية (الموقع/العدّاد):', e);
            const extra = document.getElementById('pickup-extra-cards');
            if (extra) extra.innerHTML = `<div style="font-size:11px; color:#e67e22; margin-bottom:12px;">⚠️ تعذّر تحميل موقع المطعم — تواصل معه مباشرة لمعرفة العنوان</div>`;
        }
    }

    // [SEC-FIX-PICKUP-COMPLETION-TRACKING] تتبّع اكتمال طلب الاستلام — يغلق الشاشة تلقائياً فور
    // ما يعلّم المطعم الطلب "تم التسليم"، بدون أي حاجة لتحديث الصفحة يدوياً
    let _pickupCompletionChannel = null;
    let _pickupCompletionPoll = null;
    function _startPickupCompletionTracking(orderId) {
        _stopPickupCompletionTracking();
        try {
            _pickupCompletionChannel = _supabase.channel('pickup-complete-' + orderId)
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sh_public_orders', filter: 'id=eq.' + orderId }, (payload) => {
                    if (payload && payload.new && payload.new.status === 'completed') _handlePickupCompleted(orderId);
                })
                .subscribe();
        } catch(e) { console.error('[SEC-FIX-PICKUP-COMPLETION-TRACKING] تعذّر الاشتراك اللحظي:', e); }
        // استطلاع احتياطي كل 5 ثوانٍ (شبكة أمان لو تعطّل الاتصال اللحظي)
        _pickupCompletionPoll = setInterval(async () => {
            try {
                if (!currentOrderKey || String(currentOrderKey) !== String(orderId)) { _stopPickupCompletionTracking(); return; }
                const { data } = await _supabase.from('sh_public_orders').select('status').eq('id', orderId).maybeSingle();
                if (data && data.status === 'completed') _handlePickupCompleted(orderId);
            } catch(e) {}
        }, 5000);
    }
    function _stopPickupCompletionTracking() {
        if (_pickupCompletionChannel) { try { _supabase.removeChannel(_pickupCompletionChannel); } catch(e) {} _pickupCompletionChannel = null; }
        if (_pickupCompletionPoll) { clearInterval(_pickupCompletionPoll); _pickupCompletionPoll = null; }
    }
    function _handlePickupCompleted(orderId) {
        _stopPickupCompletionTracking();
        const overlay = document.getElementById('pickup-success-overlay');
        if (overlay) overlay.remove();
        localStorage.removeItem('shahen_active_order_id');
        currentOrderKey = null;
        showNotify('🎉 تم تسليم طلبك بنجاح — بالهنا والشفا', 'success');
        nav('p-home');
    }

    // [FIX-BLANK-SCREEN] الجزء غير المضمون (يعتمد على الشبكة) بدالة مستقلة — لا يمكن لأي خطأ فيه أن
    // يمنع عرض الشاشة الأساسية (رقم الطلب/الفاتورة/اسم المطعم) إطلاقاً
    async function _fillPickupExtraCards(order, orderId, resName) {
        let resLat = null, resLng = null;
        try {
            const isPharmacy = order.res_type === 'pharmacy' || order.res_type === 'pharmacy_delivery';
            const table = isPharmacy ? 'pharmacies' : 'restaurants';
            if (order.restaurant_id) {
                const { data: resRow } = await _supabase.from(_readTable(table)).select('pickup_lat,pickup_lng,maps_url').eq('id', order.restaurant_id).maybeSingle();
                if (resRow) {
                    if (resRow.pickup_lat && resRow.pickup_lng) { resLat = parseFloat(resRow.pickup_lat); resLng = parseFloat(resRow.pickup_lng); }
                    else if (resRow.maps_url) {
                        const resolved = await _shResolveMapsUrlCoords(resRow.maps_url);
                        if (resolved) { resLat = resolved.lat; resLng = resolved.lng; }
                    }
                }
            }
            if ((!resLat || !resLng) && order.pickup_lat && order.pickup_lng) { resLat = parseFloat(order.pickup_lat); resLng = parseFloat(order.pickup_lng); }
        } catch(e) { console.error('[PICKUP-LOCATION] تعذّر جلب موقع المطعم:', e); }

        let timerCard = '';
        if (order.pickup_ready_at) {
            timerCard = _pkCard('<i class="fas fa-clock"></i>', 'الوقت المتبقي', `
                <div style="display:flex; justify-content:center;">
                    <div style="position:relative; width:120px; height:120px;">
                        <svg width="120" height="120" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(212,175,55,0.15)" stroke-width="8"/>
                            <circle id="pickup-timer-ring" cx="60" cy="60" r="52" fill="none" stroke="var(--gold)" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="0"/>
                        </svg>
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                            <div id="pickup-remaining-value" style="font-size:19px; font-weight:bold; color:#fff;">--:--</div>
                            <div style="font-size:10px; color:#aaa;">دقيقة</div>
                        </div>
                    </div>
                </div>`);
        }

        // [FEATURE-MAPBOX-ONLY] استبدال رابط "افتح بالخرائط" — كان يفتح جوجل مابس دائماً بشكل قسري.
        // بما إنه Mapbox لا تملك تطبيق ملاحة استهلاكي منتشر بصيغة رابط عالمي مكافئة لروابط جوجل، أدق
        // بديل هندسي صحيح هو معيار "geo:" العام — يترك لنظام الجهاز نفسه يفتح تطبيق الخرائط الافتراضي
        // المثبَّت عند المستخدم (سواء كان يعتمد على Mapbox أو غيره)، بدل فرض جوجل مابس تحديداً.
        const locationInner = `
            <div style="text-align:center; font-size:13px; color:#fff; margin-bottom:10px;">${escHtml(order.res_address || resName)}</div>
            ${(resLat && resLng) ? `
            <div id="pickup-map-container" style="width:100%; height:170px; border-radius:12px; overflow:hidden; background:#1a051a; margin-bottom:10px; position:relative;">
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#aaa; font-size:11px;"><i class="fas fa-spinner fa-spin"></i>&nbsp; جاري تحميل الخريطة...</div>
            </div>
            <div id="pickup-route-info" style="text-align:center; font-size:11px; color:#aaa; margin-bottom:8px;"></div>
            <button onclick="_openFullscreenPickupMap()" style="display:block; width:100%; padding:11px; background:rgba(212,175,55,0.15); color:#d4af37; border:1px solid #d4af37; border-radius:12px; font-weight:bold; font-size:12px; cursor:pointer; margin-bottom:8px;">
                <i class="fas fa-expand"></i> فتح الخريطة بشاشة كاملة
            </button>` : `<div style="font-size:11px; color:#e67e22; text-align:center;">⚠️ موقع المطعم غير محدد بعد — تواصل مع المطعم مباشرة لمعرفة العنوان</div>`}`;
        const locationCard = _pkCard('<i class="fas fa-map-marker-alt"></i>', 'موقع المطعم', locationInner);

        const extra = document.getElementById('pickup-extra-cards');
        if (extra) extra.innerHTML = timerCard + locationCard;

        // [FIX-DIRECTIONS-MAP] خريطة تفاعلية حقيقية بمسار الاتجاهات — لا صورة ثابتة فقط
        if (resLat && resLng) {
            window._pickupMapCoords = { resLat, resLng }; // [FEATURE-FULLSCREEN-MAP] لاستخدام زر الشاشة الكاملة
            try { await _renderPickupDirectionsMap('pickup-map-container', 'pickup-route-info', resLat, resLng); }
            catch(e) { console.error('[FIX-DIRECTIONS-MAP] فشل تحميل الخريطة التفاعلية:', e); }
        }

        if (order.pickup_ready_at) _startPickupCountdown(order.pickup_ready_at, order.pickup_prep_minutes);
    }

    // [FIX-DIRECTIONS-MAP] خريطة صغيرة مستقلة (لا تتشارك أي حالة مع خريطة تتبع المندوب الكبيرة) تعرض
    // موقع المطعم، وتحاول جلب موقع العميل الحالي لرسم مسار اتجاهات فعلي بينهما إن سمح المتصفح بذلك
    async function _renderPickupDirectionsMap(mapContainerId, infoContainerId, resLat, resLng) {
        const mapEl = document.getElementById(mapContainerId);
        if (!mapEl || typeof mapboxgl === 'undefined') return;
        mapEl.innerHTML = '';
        const map = new mapboxgl.Map({
            container: mapContainerId,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [resLng, resLat],
            zoom: 14,
            attributionControl: false,
            interactive: true
        });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false, showZoom: true }), 'top-left');

        new mapboxgl.Marker({ color: '#d4af37' }).setLngLat([resLng, resLat]).addTo(map);

        // [FIX-ROUTE-RELIABILITY] الموقع اللحظي (GPS) قد يُرفَض أو يتأخر بصمت — نستخدم عنوان العميل
        // المسجَّل بحسابه كبديل مضمون، عشان يظهر المسار دائماً تقريباً بدل الاعتماد فقط على إذن حي
        const custPos = await new Promise((resolve) => {
            if (!navigator.geolocation || !window.isSecureContext) return resolve(null);
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => resolve(null),
                { timeout: 5000, maximumAge: 60000 }
            );
        });
        let _finalCustPos = custPos;
        if (!_finalCustPos && currentUser && currentUser.uid) {
            try {
                const { data: custRow } = await _supabase.from('customers').select('lat,lng').eq('id', currentUser.uid).maybeSingle();
                if (custRow && custRow.lat && custRow.lng) {
                    _finalCustPos = { lat: parseFloat(custRow.lat), lng: parseFloat(custRow.lng) };
                }
            } catch(e) { console.error('[FIX-ROUTE-RELIABILITY] تعذّر جلب عنوان العميل المسجَّل كبديل:', e); }
        }

        if (!_finalCustPos) {
            map.on('load', () => { try { map.resize(); } catch(e) {} });
            return;
        }

        new mapboxgl.Marker({ color: '#3b82f6' }).setLngLat([_finalCustPos.lng, _finalCustPos.lat]).addTo(map);

        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${_finalCustPos.lng},${_finalCustPos.lat};${resLng},${resLat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
            const resp = await fetch(url);
            const data = await resp.json();
            const route = data && data.routes && data.routes[0];
            if (route && route.geometry) {
                map.on('load', () => {
                    try {
                        map.addSource('pk-route', { type: 'geojson', data: { type: 'Feature', geometry: route.geometry } });
                        map.addLayer({ id: 'pk-route-line', type: 'line', source: 'pk-route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#d4af37', 'line-width': 4 } });
                        const coords = route.geometry.coordinates;
                        const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]));
                        map.fitBounds(bounds, { padding: 40, duration: 0 });
                    } catch(e) { console.error('[FIX-DIRECTIONS-MAP] فشل رسم المسار:', e); }
                });
                const infoEl = document.getElementById(infoContainerId);
                if (infoEl && route.distance && route.duration) {
                    const km = (route.distance / 1000).toFixed(1);
                    const mins = Math.round(route.duration / 60);
                    infoEl.innerHTML = `<i class="fas fa-route"></i> ${km} كم — حوالي ${mins} دقيقة بالسيارة`;
                }
            } else {
                map.on('load', () => { try { map.resize(); } catch(e) {} });
            }
        } catch(e) {
            console.error('[FIX-DIRECTIONS-MAP] فشل جلب مسار الاتجاهات:', e);
        }
    }

    // [FEATURE-FULLSCREEN-MAP] فتح نفس خريطة المسار بشاشة كاملة، مع تتبّع حي لموقع العميل —
    // العلامة تتحرك والمسار والوقت المتبقي يتحدّثوا تلقائياً كل ما تحرّك العميل، بدون أي تفاعل يدوي
    let _fullscreenWatchId = null;
    function _openFullscreenPickupMap() {
        const coords = window._pickupMapCoords;
        if (!coords) { showNotify('⚠️ بيانات الموقع غير متوفرة حالياً', 'error'); return; }
        const overlay = document.createElement('div');
        overlay.id = 'fullscreen-map-overlay';
        overlay.style.cssText = 'position:fixed; inset:0; max-width:480px; margin:0 auto; background:#000; z-index:99999; display:flex; flex-direction:column;';
        overlay.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:14px; background:#1a051a; border-bottom:1px solid rgba(212,175,55,0.3);">
                <span style="color:var(--gold); font-weight:bold; font-size:14px;"><i class="fas fa-route"></i> المسار إلى المطعم</span>
                <button onclick="_closeFullscreenPickupMap()" style="background:rgba(231,76,60,0.15); color:#e74c3c; border:1px solid #e74c3c; border-radius:8px; padding:6px 14px; font-size:12px; cursor:pointer;"><i class="fas fa-times"></i> إغلاق</button>
            </div>
            <div id="fullscreen-map-container" style="flex:1; position:relative;">
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#aaa; font-size:12px;"><i class="fas fa-spinner fa-spin"></i>&nbsp; جاري تحميل الخريطة...</div>
            </div>
            <div id="fullscreen-route-info" style="text-align:center; font-size:13px; color:#d4af37; padding:12px; background:#1a051a; font-weight:bold;"></div>`;
        document.body.appendChild(overlay);
        _renderLivePickupMap('fullscreen-map-container', 'fullscreen-route-info', coords.resLat, coords.resLng);
    }

    function _closeFullscreenPickupMap() {
        if (_fullscreenWatchId !== null) { try { navigator.geolocation.clearWatch(_fullscreenWatchId); } catch(e) {} _fullscreenWatchId = null; }
        const overlay = document.getElementById('fullscreen-map-overlay');
        if (overlay) overlay.remove();
    }

    // [FEATURE-LIVE-ROUTE-TRACKING] خريطة بتتبّع حي — العلامة تتحرك والمسار/الوقت يتحدّثان تلقائياً
    // كل ما تحرّك العميل، عبر watchPosition (مراقبة مستمرة) بدل قراءة واحدة لمرة وحدة فقط
    async function _renderLivePickupMap(mapContainerId, infoContainerId, resLat, resLng) {
        // [FIX-SCOPE-ISSUE] تعريف المفتاح محلياً هنا مباشرة — تفادياً لأي مشكلة نطاق (scope) محتملة
        // لو كان المفتاح الأصلي معرَّفاً داخل دالة أخرى غير متاحة لهذه الدالة تحديداً
        const _LIVE_MAPBOX_TOKEN = 'pk.eyJ1IjoiZGZnaHJ0c2ZnaGoiLCJhIjoiY21xdTdtOXl6MHBhbDJzcXl1NnJiNDQ5ZyJ9.hjFDXHtLhfb_rnVbMcp7jQ';
        const mapEl = document.getElementById(mapContainerId);
        if (!mapEl || typeof mapboxgl === 'undefined') return;
        mapEl.innerHTML = '';
        const map = new mapboxgl.Map({
            container: mapContainerId, style: 'mapbox://styles/mapbox/dark-v11',
            center: [resLng, resLat], zoom: 14, attributionControl: false, interactive: true
        });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false, showZoom: true }), 'top-left');
        new mapboxgl.Marker({ color: '#d4af37' }).setLngLat([resLng, resLat]).addTo(map);

        let custMarker = null;
        let _lastRouteFetchAt = 0;
        let _lastRouteFetchPos = null;

        async function _updateRoute(lat, lng) {
            if (!custMarker) {
                custMarker = new mapboxgl.Marker({ color: '#3b82f6' }).setLngLat([lng, lat]).addTo(map);
            } else {
                custMarker.setLngLat([lng, lat]); // [FEATURE-LIVE-ROUTE-TRACKING] تحريك العلامة بدل إنشاء واحدة جديدة
            }
            // تحديد حركة كافية (أكثر من ~30 متراً) أو مرور 15 ثانية على الأقل قبل إعادة حساب المسار
            // فعلياً (توفير طلبات API غير ضرورية لتغيّرات موقع طفيفة جداً)
            const now = Date.now();
            const movedEnough = !_lastRouteFetchPos || _navHaversineSimple(lat, lng, _lastRouteFetchPos.lat, _lastRouteFetchPos.lng) > 0.03;
            if (!movedEnough && (now - _lastRouteFetchAt) < 15000) return;
            _lastRouteFetchAt = now; _lastRouteFetchPos = { lat, lng };
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${lng},${lat};${resLng},${resLat}?geometries=geojson&overview=full&access_token=${_LIVE_MAPBOX_TOKEN}`;
                const resp = await fetch(url);
                const data = await resp.json();
                const route = data && data.routes && data.routes[0];
                if (route && route.geometry) {
                    const src = map.getSource('pk-route-live');
                    if (src) { src.setData({ type: 'Feature', geometry: route.geometry }); }
                    else {
                        map.addSource('pk-route-live', { type: 'geojson', data: { type: 'Feature', geometry: route.geometry } });
                        map.addLayer({ id: 'pk-route-live-line', type: 'line', source: 'pk-route-live', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#d4af37', 'line-width': 4 } });
                    }
                    const coords2 = route.geometry.coordinates;
                    const bounds = coords2.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords2[0], coords2[0]));
                    map.fitBounds(bounds, { padding: 40, duration: 500 });
                    const infoEl = document.getElementById(infoContainerId);
                    if (infoEl && route.distance != null && route.duration != null) {
                        const km = (route.distance / 1000).toFixed(1);
                        const mins = Math.round(route.duration / 60);
                        infoEl.innerHTML = `<i class="fas fa-route"></i> ${km} كم — متبقّي حوالي ${mins} دقيقة`;
                    }
                }
            } catch(e) { console.error('[FEATURE-LIVE-ROUTE-TRACKING] فشل تحديث المسار الحي:', e); }
        }

        map.on('load', () => { try { map.resize(); } catch(e) {} });

        if (!navigator.geolocation || !window.isSecureContext) {
            const infoEl = document.getElementById(infoContainerId);
            if (infoEl) infoEl.innerHTML = '⚠️ يتطلب إذن الموقع لعرض المسار الحي';
            return;
        }
        if (_fullscreenWatchId !== null) { try { navigator.geolocation.clearWatch(_fullscreenWatchId); } catch(e) {} }
        _fullscreenWatchId = navigator.geolocation.watchPosition(
            (pos) => _updateRoute(pos.coords.latitude, pos.coords.longitude),
            (err) => {
                console.error('[FEATURE-LIVE-ROUTE-TRACKING] خطأ مراقبة الموقع:', err);
                const infoEl = document.getElementById(infoContainerId);
                if (infoEl) {
                    const msg = err.code === 1 ? '⚠️ تم رفض إذن الموقع — فعّله من إعدادات المتصفح لعرض موقعك على الخريطة'
                              : err.code === 2 ? '⚠️ تعذّر تحديد موقعك حالياً (إشارة GPS ضعيفة)'
                              : '⚠️ انتهت مهلة تحديد الموقع، جرّب مجدداً';
                    infoEl.innerHTML = msg;
                }
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
    }

    // [FEATURE-LIVE-ROUTE-TRACKING] حساب مسافة تقريبي بسيط بالكيلومتر (Haversine) لتحديد الحركة الكافية
    function _navHaversineSimple(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    let _pickupCountdownInterval = null;
    function _startPickupCountdown(readyAtIso, prepMinutes) {
        if (_pickupCountdownInterval) clearInterval(_pickupCountdownInterval);
        const readyAt = new Date(readyAtIso).getTime();
        const totalSec = Math.max(1, (parseInt(prepMinutes) || 15) * 60);
        const circumference = 326.7; // 2 * PI * 52
        function tick() {
            const valEl = document.getElementById('pickup-remaining-value');
            const ringEl = document.getElementById('pickup-timer-ring');
            if (!valEl) { clearInterval(_pickupCountdownInterval); _pickupCountdownInterval = null; return; }
            const diffSec = Math.max(0, Math.round((readyAt - Date.now()) / 1000));
            const frac = Math.max(0, Math.min(1, diffSec / totalSec));
            if (ringEl) ringEl.setAttribute('stroke-dashoffset', String(circumference * (1 - frac)));
            if (diffSec <= 0) {
                valEl.innerText = 'جاهز 🎉';
                clearInterval(_pickupCountdownInterval); _pickupCountdownInterval = null;
                return;
            }
            const m = Math.floor(diffSec / 60), s = diffSec % 60;
            valEl.innerText = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
        }
        tick();
        _pickupCountdownInterval = setInterval(tick, 1000);
    }

    function _closePickupSuccess() {
        const overlay = document.getElementById('pickup-success-overlay');
        if (overlay) { overlay.style.display = 'none'; }
        if (_pickupCountdownInterval) { clearInterval(_pickupCountdownInterval); _pickupCountdownInterval = null; }
        nav('p-history');
    }

    // ===========================================================================
    // ===== [FIX-ORDER-SCREEN-ROOT-CAUSE] شاشة "قبل المطعم الطلب — بانتظار مندوب" =====
    // تظهر لطلبات التوصيل التي وافق عليها المطعم لكن لم يُعيَّن لها مندوب حقيقي بعد. تحل محل عرض
    // شاشة دردشة بمندوب وهمي، وتبقى نفس الشاشة معروضة بثبات سواء عند القبول مباشرة، أو عند إعادة فتح
    // التطبيق لاحقاً، أو عند الضغط على الطلب من قسم "طلباتي" — لا تختلف الواجهة حسب طريقة الوصول إليها.
    // ===========================================================================
    let _restaurantAcceptedPollInterval = null;

    function _showRestaurantAcceptedAwaitingDriver(order) {
        if (_restaurantAcceptedPollInterval) { clearInterval(_restaurantAcceptedPollInterval); _restaurantAcceptedPollInterval = null; }
        currentOrderKey = order.id;
        localStorage.setItem('shahen_active_order_id', order.id);
        document.getElementById('eagle-searching').style.display = 'none';
        try { document.getElementById('searching-sound').pause(); } catch(e) {}

        let overlay = document.getElementById('restaurant-accepted-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'restaurant-accepted-overlay';
            overlay.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:var(--purple); z-index:20000; display:flex; flex-direction:column; align-items:center; padding:20px 16px 28px; overflow-y:auto;';
            const shell = document.querySelector('.app-shell') || document.body;
            shell.appendChild(overlay);
        }

        let itemsArr = [];
        try { itemsArr = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (Array.isArray(order.items) ? order.items : []); } catch(e) { itemsArr = []; }
        const itemsCard = itemsArr.length ? _pkCard('<i class="fas fa-utensils"></i>', 'الأصناف المطلوبة', `
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${itemsArr.map(it => `
                    <div style="display:flex; justify-content:space-between; font-size:12px; color:#eee; border-bottom:1px dashed rgba(255,255,255,0.08); padding-bottom:4px;">
                        <span>${escHtml(String(it.p ?? ''))} ل.س</span>
                        <span>${escHtml(it.n || '')}</span>
                    </div>`).join('')}
            </div>`) : '';
        const notesVal = order.order_notes || order.notes || '';
        const notesCard = notesVal ? _pkCard('<i class="fas fa-sticky-note"></i>', 'ملاحظاتك', `<div style="text-align:center; font-size:13px; color:var(--gold); font-weight:bold; line-height:1.7;">${escHtml(notesVal)}</div>`) : '';
        const custName = (currentUser && currentUser.name) || order.customer_name || 'العميل';

        overlay.innerHTML = `
            <div style="width:100%; max-width:320px; text-align:center; margin-bottom:18px;">
                <div style="font-size:56px; margin-bottom:6px;">✅</div>
                <div style="font-size:20px; font-weight:bold; color:var(--gold); margin-bottom:4px;">وافق المطعم على طلبك!</div>
                <div style="font-size:12px; color:#ccc;">جاري البحث عن صقر لتوصيل طلبك... 🦅</div>
            </div>
            ${_pkCard('<i class="fas fa-file-invoice"></i>', 'رقم الطلب', `<div style="text-align:center; font-size:26px; font-weight:bold; color:#fff; letter-spacing:2px;">${escHtml(String(order.id).slice(-6).toUpperCase())}</div>`)}
            ${_pkCard('<i class="fas fa-user"></i>', 'اسم العميل', `<div style="text-align:center; font-size:16px; font-weight:bold; color:#fff;">${escHtml(custName)}</div>`)}
            ${_pkCard('<i class="fas fa-store"></i>', 'اسم المطعم', `<div style="text-align:center; font-size:18px; font-weight:bold; color:#fff;">${escHtml(order.restaurant_name || 'المطعم')}</div>`)}
            ${_pkCard('<i class="fas fa-wallet"></i>', 'الفاتورة', `<div style="text-align:center; font-size:22px; font-weight:bold; color:#fff;">${Number(order.total||0).toLocaleString('ar-SA')} <span style="font-size:13px; color:#aaa;">ل.س</span></div>`)}
            ${itemsCard}
            ${notesCard}
            <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.3); border-radius:16px; padding:14px 16px; margin-bottom:16px; width:100%; max-width:320px; display:flex; flex-direction:row-reverse; align-items:center; gap:12px; text-align:right;">
                <div style="font-size:30px; flex-shrink:0;"><i class="fas fa-spinner fa-spin" style="color:var(--gold);"></i></div>
                <div style="font-size:12px; color:#eee; line-height:1.8;">
                    المطعم بدأ تجهيز طلبك، وسيصلك إشعار فور تعيين مندوب لتوصيله إليك.
                </div>
            </div>
            <button onclick="_closeRestaurantAcceptedOverlay()" style="width:100%; max-width:320px; padding:14px; background:linear-gradient(135deg,#d4af37,#b8962e); color:#000; border:none; border-radius:14px; font-weight:bold; font-size:14px; cursor:pointer;">
                <i class="fas fa-check-circle"></i> حسناً
            </button>`;
        overlay.style.display = 'flex';

        _restaurantAcceptedPollInterval = setInterval(async () => {
            if (!currentOrderKey || String(currentOrderKey) !== String(order.id)) { clearInterval(_restaurantAcceptedPollInterval); _restaurantAcceptedPollInterval = null; return; }
            try {
                const { data: fresh } = await _supabase.from('sh_public_orders').select('*').eq('id', order.id).maybeSingle();
                if (!fresh) return;
                if (fresh.driver_id) {
                    // [FIX-ORDER-SCREEN-ROOT-CAUSE] تم تعيين مندوب حقيقي الآن — ترقية فورية لشاشة
                    // التواصل الحقيقية معه
                    clearInterval(_restaurantAcceptedPollInterval); _restaurantAcceptedPollInterval = null;
                    overlay.style.display = 'none';
                    showNotify('🦅 تم تعيين مندوب لتوصيل طلبك!', 'success');
                    checkOrderAction(order.id, fresh.status);
                } else if (fresh.status === 'cancelled') {
                    clearInterval(_restaurantAcceptedPollInterval); _restaurantAcceptedPollInterval = null;
                    overlay.style.display = 'none';
                    localStorage.removeItem('shahen_active_order_id');
                    currentOrderKey = null;
                    showNotify('تم إلغاء الطلب ❌', 'error');
                    nav('p-home');
                } else if (fresh.status === 'completed') {
                    clearInterval(_restaurantAcceptedPollInterval); _restaurantAcceptedPollInterval = null;
                    overlay.style.display = 'none';
                    localStorage.removeItem('shahen_active_order_id');
                    currentOrderKey = null;
                    document.getElementById('rating-overlay').style.display = 'flex';
                }
            } catch(e) { console.error('[FIX-ORDER-SCREEN-ROOT-CAUSE] خطأ أثناء استطلاع حالة الطلب:', e); }
        }, 4000);
    }

    function _closeRestaurantAcceptedOverlay() {
        const overlay = document.getElementById('restaurant-accepted-overlay');
        if (overlay) overlay.style.display = 'none';
        nav('p-history');
    }


    let _sppClientPaymentData = null; // بيانات عملية الدفع المراد تأكيدها
    let _sppQrStream = null;          // Camera stream
    let _sppScanInterval = null;      // مؤقت تحليل الإطارات

    async function sppClientOpen() {
        if (!currentUser) { showNotify('سجّل دخولك أولاً', 'error'); return; }
        const overlay = document.getElementById('spp-scanner-overlay');
        overlay.style.display = 'flex';
        document.getElementById('spp-scan-status').textContent = 'جاري تشغيل الكاميرا...';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            _sppQrStream = stream;
            const video = document.getElementById('spp-qr-video');
            video.srcObject = stream;
            await video.play();
            document.getElementById('spp-scan-status').textContent = 'وجّه الكاميرا نحو رمز QR الصادر من المطعم';
            _sppStartFrameScan();
        } catch(e) {
            document.getElementById('spp-scan-status').textContent = 'تعذّر الوصول للكاميرا: ' + e.message;
        }
    }

    function _sppStartFrameScan() {
        const video  = document.getElementById('spp-qr-video');
        const canvas = document.getElementById('spp-qr-canvas');
        const ctx    = canvas.getContext('2d');
        _sppScanInterval = setInterval(async () => {
            if (video.readyState < 2) return;
            canvas.width  = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // استخدام jsQR إن كان محملاً، وإلا إيجاد بديل
            if (typeof jsQR === 'undefined') {
                // jsQR غير محمّل — نُحمّله ديناميكياً
                if (!window._jsqrLoading) {
                    window._jsqrLoading = true;
                    const s = document.createElement('script');
                    s.src = 'vendor/jsQR.js';
                    document.head.appendChild(s);
                }
                return;
            }
            const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
            if (code && code.data && code.data.startsWith('SPP-')) {
                clearInterval(_sppScanInterval); _sppScanInterval = null;
                await _sppClientHandleScan(code.data);
            }
        }, 350);
    }

    async function _sppClientHandleScan(token) {
        document.getElementById('spp-scan-status').textContent = 'جاري التحقق...';
        _sppStopCamera();
        try {
            const { data, error } = await _supabase.from('shahin_points_payments').select('*').eq('qr_token', token).eq('status', 'pending').maybeSingle();
            if (error || !data) {
                showNotify('رمز QR غير صالح أو منتهي الصلاحية', 'error');
                document.getElementById('spp-scanner-overlay').style.display = 'none';
                return;
            }
            // التحقق من رصيد العميل
            const userPoints  = parseFloat(currentUser.points || 0);
            const ptsRequired = parseFloat(data.points_required);
            if (userPoints < ptsRequired) {
                showNotify(`رصيدك من النقاط غير كافٍ (${userPoints} نقطة) — مطلوب ${ptsRequired} نقطة`, 'error');
                document.getElementById('spp-scanner-overlay').style.display = 'none';
                return;
            }
            _sppClientPaymentData = data;
            const balAfter = userPoints - ptsRequired;
            document.getElementById('spp-confirm-details').innerHTML =
                `<b style="color:var(--gold)">المطعم:</b> ${escHtml(data.restaurant_name)}<br>` +
                `<b style="color:var(--gold)">قيمة الفاتورة:</b> ${Number(data.invoice_amount).toLocaleString('ar-SA')} ل.س<br>` +
                `<b style="color:var(--gold)">النقاط المطلوبة:</b> <span style="color:#e74c3c; font-weight:bold;">${ptsRequired.toLocaleString('ar-SA')} نقطة</span><br>` +
                `<b style="color:var(--gold)">رصيدك الحالي:</b> ${userPoints.toLocaleString('ar-SA')} نقطة<br>` +
                `<b style="color:var(--gold)">الرصيد بعد الدفع:</b> <span style="color:#2ecc71; font-weight:bold;">${balAfter.toLocaleString('ar-SA')} نقطة</span>`;
            document.getElementById('spp-scanner-overlay').style.display = 'none';
            document.getElementById('spp-confirm-overlay').style.display = 'flex';
        } catch(e) {
            showNotify('خطأ: ' + e.message, 'error');
            document.getElementById('spp-scanner-overlay').style.display = 'none';
        }
    }

    async function sppClientConfirmPayment() {
        if (!_sppClientPaymentData) return;
        const btn = document.getElementById('spp-confirm-btn');
        if (btn) { btn.disabled = true; btn.innerText = 'جاري الدفع...'; }
        const p           = _sppClientPaymentData;
        const userPoints  = parseFloat(currentUser.points || 0);
        const ptsRequired = parseFloat(p.points_required);
        const balBefore   = userPoints;
        const balAfter    = userPoints - ptsRequired;
        try {
            // تحقق مجدد من الحالة (لمنع إعادة الاستخدام)
            const { data: fresh } = await _supabase.from('shahin_points_payments').select('status').eq('qr_token', p.qr_token).maybeSingle();
            if (!fresh || fresh.status !== 'pending') {
                showNotify('تم استخدام هذا الرمز من قبل أو انتهت صلاحيته', 'error');
                document.getElementById('spp-confirm-overlay').style.display = 'none';
                _sppClientPaymentData = null; if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الدفع'; }
                return;
            }
            // تحديث العملية بالبيانات الكاملة وتحديد الحالة "used"
            const { error: upErr } = await _supabase.from('shahin_points_payments').update({
                customer_id:    currentUser.uid,
                customer_name:  currentUser.name,
                status:         'used',
                balance_before: balBefore,
                balance_after:  balAfter,
                used_at:        new Date().toISOString()
            }).eq('qr_token', p.qr_token).eq('status', 'pending');
            if (upErr) throw new Error(upErr.message);
            // خصم النقاط من حساب العميل — [SEC-FIX-ATOMIC-POINTS] عملية ذرّية داخل القاعدة
            const { data: _qrNewPoints, error: _qrPtsErr } = await _supabase.rpc('adjust_customer_points', { p_customer_id: currentUser.uid, p_delta: -ptsRequired });
            if (_qrPtsErr) throw new Error(_qrPtsErr.message);
            currentUser.points = _qrNewPoints;
            const ptEl = document.getElementById('shahen-points');
            if (ptEl) ptEl.innerText = _qrNewPoints;
            // إشعار للمطعم
            _supabase.from('notifications').insert([{
                user_id: p.restaurant_id,
                message: `✅ تم دفع فاتورة ${Number(p.invoice_amount).toLocaleString('ar-SA')} ل.س من العميل ${currentUser.name} عبر ${ptsRequired} نقطة شاهين`,
                type: 'points_payment',
                created_at: new Date().toISOString()
            }]).then(() => {}).catch(() => {});
            document.getElementById('spp-confirm-overlay').style.display = 'none';
            showNotify('✅ تم الدفع بنجاح! تم خصم ' + ptsRequired.toLocaleString('ar-SA') + ' نقطة', 'success');
            _sppClientPaymentData = null;
        } catch(e) {
            showNotify('خطأ: ' + e.message, 'error');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الدفع'; }
        }
    }

    function sppClientCancelConfirm() {
        document.getElementById('spp-confirm-overlay').style.display = 'none';
        _sppClientPaymentData = null;
    }

    function sppClientClose() {
        _sppStopCamera();
        document.getElementById('spp-scanner-overlay').style.display = 'none';
    }

    function _sppStopCamera() {
        if (_sppScanInterval) { clearInterval(_sppScanInterval); _sppScanInterval = null; }
        if (_sppQrStream) { _sppQrStream.getTracks().forEach(t => t.stop()); _sppQrStream = null; }
        const video = document.getElementById('spp-qr-video');
        if (video) { video.srcObject = null; }
    }

    // [CLEANUP] تم حذف sppLoadPartnerRestaurants و spp-partner-restaurants بالكامل — استُبدلا
    // بميزة "محادثاتي مع الأسر المنتجة" (_openMyFamilyChatsModal)

    // ===== [SERVICE-TYPE] خيار توصيل / استلام من المطعم =====
    function setServiceType(type) {
        _serviceType = type;
        // [SIMPLIFIED] لم يعد هناك أي تلاعب يدوي بالـ DOM هنا — renderCart() تُعيد بناء الأزرار بالكامل
        // بألوانها الصحيحة اعتماداً على _serviceType مباشرة في كل مرة، فتبقى النتيجة متسقة دائماً
        renderCart();
    }

    // [FEATURE-MY-FAMILY-CHATS] تحديث عداد المحادثات غير المقروءة عند فتح صفحة الحساب + تفعيل الاستماع اللحظي
    document.addEventListener('DOMContentLoaded', () => {
        if (currentUser) { _refreshMyFamilyChatsBadge(); _listenMyFamilyChatsRealtime(); }
    });

    // Override openPage للصفحة الشخصية لتحديث عداد المحادثات
    const _origTabClicks = document.querySelectorAll('.m-tab');
    _origTabClicks.forEach(tab => {
        const prev = tab.onclick;
        tab.addEventListener('click', () => {
            if (tab.dataset && tab.dataset.page === 'profile') {
                setTimeout(() => {
                    if (currentUser) _refreshMyFamilyChatsBadge();
                }, 200);
            }
        });
    });

    // [FEATURE-MY-FAMILY-CHATS] عرض قائمة محادثات العميل مع كل الأسر المنتجة اللي تواصل معها
    async function _openMyFamilyChatsModal() {
        let modal = document.getElementById('my-fam-chats-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'my-fam-chats-modal';
            modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9000;align-items:center;justify-content:center;padding:20px;';
            modal.innerHTML = `
                <div style="background:var(--p-main,#1a0033);border:1px solid var(--gold);border-radius:16px;padding:18px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                        <b style="color:var(--gold);font-size:15px;"><i class="fas fa-comments"></i> محادثاتي مع الأسر المنتجة</b>
                        <button onclick="document.getElementById('my-fam-chats-modal').style.display='none'" style="background:none;border:none;color:#fff;font-size:18px;"><i class="fas fa-times"></i></button>
                    </div>
                    <div id="my-fam-chats-list"></div>
                </div>`;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        const listEl = document.getElementById('my-fam-chats-list');
        listEl.innerHTML = '<div style="text-align:center;padding:20px;color:#888;font-size:12px;"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</div>';

        const { data: chats } = await _supabase.from('family_business_chats').select('*')
            .eq('customer_id', currentUser.uid).order('last_message_at', { ascending: false });
        if (!chats || !chats.length) {
            listEl.innerHTML = '<div style="text-align:center;padding:30px 10px;color:#888;font-size:12px;"><i class="fas fa-comment-slash" style="font-size:28px;display:block;margin-bottom:8px;"></i>لا توجد محادثات بعد</div>';
            return;
        }
        const bizIds = [...new Set(chats.map(c => c.business_id))];
        const { data: bizRows } = await _supabase.from('family_businesses').select('id,name,main_image').in('id', bizIds);
        const bizMap = {}; (bizRows||[]).forEach(b => bizMap[b.id] = b);

        listEl.innerHTML = chats.map(c => {
            const biz = bizMap[c.business_id] || {};
            return `
            <div onclick="document.getElementById('my-fam-chats-modal').style.display='none'; openFamilyChatById('${c.id}');" style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.05);border:1px solid ${c.customer_unread?'var(--gold)':'rgba(255,255,255,0.1)'};border-radius:12px;padding:10px;margin-bottom:8px;cursor:pointer;">
                <div style="width:40px;height:40px;border-radius:10px;overflow:hidden;flex-shrink:0;background:#000;display:flex;align-items:center;justify-content:center;">
                    ${biz.main_image ? `<img src="${escHtml(biz.main_image)}" width="40" height="40" style="object-fit:cover;">` : '🏠'}
                </div>
                <div style="flex:1;min-width:0;">
                    <b style="font-size:12.5px;">${escHtml(biz.name||'محل')}</b>
                    <div style="font-size:10.5px;color:#aaa;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(c.last_message||'')}</div>
                </div>
                ${c.is_blocked_by_business ? '<span style="font-size:9px;color:var(--danger);"><i class="fas fa-ban"></i></span>' : (c.customer_unread ? '<span style="width:9px;height:9px;background:var(--gold);border-radius:50%;flex-shrink:0;"></span>' : '')}
            </div>`;
        }).join('');
    }

    // [FEATURE-MY-FAMILY-CHATS] عداد صغير على زر "محادثاتي" لعدد المحادثات غير المقروءة
    async function _refreshMyFamilyChatsBadge() {
        const badge = document.getElementById('my-fam-chats-badge');
        if (!badge || !currentUser) return;
        const { data } = await _supabase.from('family_business_chats').select('id').eq('customer_id', currentUser.uid).eq('customer_unread', true);
        if (data && data.length > 0) { badge.innerText = data.length; badge.style.display = 'flex'; }
        else { badge.style.display = 'none'; }
    }

    // [FEATURE-MY-FAMILY-CHATS] استماع لحظي لأي رسالة جديدة تصل من أي أسرة منتجة — يحدّث العداد
    // فوراً بغض النظر عن الصفحة اللي واقف فيها العميل حالياً، مع صوت وتنبيه toast
    let _myFamChatsRTChannel = null;
    function _listenMyFamilyChatsRealtime() {
        if (!currentUser || !currentUser.uid || _myFamChatsRTChannel) return;
        _myFamChatsRTChannel = _supabase.channel('my_fam_chats_' + currentUser.uid)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'family_business_chats', filter: 'customer_id=eq.' + currentUser.uid }, (payload) => {
                // تحديث فقط لو صار فيه رسالة جديدة غير مقروءة (customer_unread تحول true)
                if (payload.new && payload.new.customer_unread === true) {
                    _refreshMyFamilyChatsBadge();
                    try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(()=>{}); } catch(e){}
                    if (typeof showNotify === 'function') showNotify('💬 وصلتك رسالة جديدة من إحدى الأسر المنتجة', 'success');
                }
            })
            .subscribe();
    }

