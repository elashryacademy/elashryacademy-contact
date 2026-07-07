# El Ashry Academy

الصفحة الرسمية للتواصل — Official Contact Page / Smart Link / Digital Business Card.

> **نتعلّم صح... ونشتغل صح.**

---

## ✦ المميزات

- **HTML + CSS + JavaScript** فقط — بدون أي Framework
- **Mobile First** و Responsive بالكامل (Desktop / Tablet / Mobile)
- **Glassmorphism** + **Particles** + **Dark Gradient** أنيق
- **Loading Screen** احترافي
- **Ripple Effect** + **Hover Animations** + **Glow**
- **QR Code** داخلي بدون مكتبات خارجية
- **Share Page** + **Back to Top**
- **SEO كامل**: Meta + Open Graph + Twitter Card + Schema.org + Canonical
- **PWA Ready**: manifest + apple-touch-icon + android-chrome icons
- **404.html** + **robots.txt** + **sitemap.xml**
- **لوحة تحكم محمية** في `/admin` (تتطلب تسجيل دخول)

---

## ✦ هيكل المشروع

```
el-ashry-academy/
├── index.html                 الصفحة الرئيسية
├── login.html                 صفحة تسجيل الدخول
├── 404.html                   صفحة 404
├── manifest.json              PWA manifest
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── admin/                     لوحة التحكم (محمية)
│   ├── index.html
│   ├── admin.css
│   └── admin.js
└── assets/
    ├── css/
    │   ├── themes.css         متغيرات الألوان والثيم
    │   ├── style.css          التصميم الرئيسي
    │   └── animations.css     كل الأنيميشن
    ├── js/
    │   ├── config.js          ⚙️ الإعدادات الافتراضية
    │   ├── config-manager.js  إدارة overlay + localStorage
    │   ├── auth.js            نظام تسجيل الدخول
    │   ├── theme.js           إدارة الثيم
    │   ├── particles.js       خلفية الجسيمات
    │   ├── qr.js              مولّد QR (بدون مكتبات)
    │   ├── cards.js           رندر البطاقات + الأيقونات
    │   └── main.js            المنطق الرئيسي
    └── images/
        ├── Logo.png           اللوجو الأساسي (شفاف)
        ├── Logo.svg           نسخة فيكتور
        ├── Logo-white.png     نسخة بيضاء
        ├── Logo-black.png     نسخة سوداء
        ├── Logo-full.png      اللوجو بخلفية
        ├── EA-Icon.png        أيقونة EA
        ├── EA-Icon.svg
        ├── favicon.ico
        ├── favicon.svg
        ├── apple-touch-icon.png
        ├── android-chrome-192.png
        ├── android-chrome-512.png
        └── og-image.png
```

---

## ✦ بيانات تسجيل الدخول الافتراضية

```
Username: admin
Password: elashry2026
```

> ⚠️ **مهم:** غيّر بيانات الدخول فورًا بعد أول تسجيل من:
> لوحة التحكم → زر "بيانات الدخول"

---

## ✦ النشر على GitHub Pages

1. ارفع كل الملفات إلى مستودع GitHub
2. **Settings → Pages**
3. اختر الفرع `main` والمجلد `/root`
4. احفظ — الموقع سيعمل خلال دقائق

---

## ✦ تخصيص المحتوى

### الطريقة الأولى: من لوحة التحكم
1. افتح `https://<your-site>/login.html`
2. سجّل الدخول بالبيانات الافتراضية
3. عدّل كل شيء من الواجهة:
   - الهوية (الاسم، الجملة، الـ Footer)
   - المنصات (إضافة/حذف/ترتيب بالسحب/إظهار-إخفاء)
   - المظهر (الألوان، الخطوط، الأنيميشن)
   - الصور (اللوجو، QR، Favicon)
   - SEO (العنوان، الوصف، الكلمات المفتاحية)
4. كل التعديلات تُحفظ تلقائيًا في LocalStorage
5. استخدم **Export** لتنزيل `config.json` كـ Backup

### الطريقة الثانية: تعديل مباشر
افتح `assets/js/config.js` وعدّل `DEFAULT_CONFIG`.

---

## ✦ لوحة التحكم — كل ما يمكنك تعديله

- ✅ اسم الأكاديمية (إنجليزي/عربي)
- ✅ الجملة أسفل الاسم (Tagline)
- ✅ نص الـ Footer
- ✅ اللوجو (رفع ملف أو URL)
- ✅ الألوان (Primary / Accent / Background / Surface)
- ✅ الخطوط
- ✅ نمط الأزرار (Glass / Solid / Gradient)
- ✅ مستوى الأنيميشن (Full / Reduced / Off)
- ✅ تفعيل/تعطيل الجسيمات
- ✅ كل روابط التواصل
- ✅ إضافة منصات جديدة
- ✅ حذف المنصات
- ✅ ترتيب المنصات بالسحب والإفلات
- ✅ إظهار/إخفاء أي منصة
- ✅ تغيير الأيقونة واللون لكل منصة
- ✅ رفع صورة شخصية وغلاف
- ✅ رفع QR مخصص
- ✅ رفع Favicon
- ✅ بيانات SEO (Title / Description / Keywords / Canonical)
- ✅ تغيير بيانات تسجيل الدخول
- ✅ Export / Import (config.json)

---

صُنع بكل ❤️ في مصر
