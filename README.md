# El Ashry Academy | أكاديمية العشري

صفحة تواصل احترافية لبراند **El Ashry Academy** بقيادة باشمهندس عبده العشري.

> **اتعلّم صح... وطبّق بإيدك... واحتَرِف**

---

## ✨ المميزات

- ✅ **HTML + CSS + JavaScript** فقط — بدون أي Framework
- ✅ **Mobile First** و Responsive بالكامل
- ✅ **Glassmorphism** و **Gradient Background** و **Particles**
- ✅ **Dark / Light Theme** مع حفظ اختيار المستخدم
- ✅ **Ripple Effect** + **Glow Effect** + **Hover Animations**
- ✅ **QR Code** داخلي (بدون مكتبات)
- ✅ **Download VCF** (بطاقة تواصل)
- ✅ **Share Page** + **Copy WhatsApp Number**
- ✅ **Back to Top** + **Loading Screen**
- ✅ **SEO كامل**: Meta + Open Graph + Twitter Card + Schema.org
- ✅ **PWA Ready**: manifest.json + apple-touch-icon + android-chrome
- ✅ **404.html** + **robots.txt** + **sitemap.xml**
- ✅ **لوحة إدارة** في `/admin` بدون Backend
  - تعديل كل البيانات والألوان والخطوط
  - إظهار/إخفاء المنصات + ترتيب بالسحب والإفلات
  - رفع لوجو/صور (Base64)
  - Export / Import (`config.json`)
  - كل التعديلات تُحفظ في LocalStorage

---

## 📁 هيكل المشروع

```
el-ashry-academy/
├── index.html                  الصفحة الرئيسية
├── 404.html                    صفحة الخطأ
├── manifest.json               PWA manifest
├── robots.txt
├── sitemap.xml
├── README.md
├── admin/                      لوحة الإدارة
│   ├── index.html
│   ├── admin.css
│   └── admin.js
└── assets/
    ├── css/
    │   ├── style.css           التصميم الرئيسي
    │   ├── themes.css          متغيرات الألوان والثيم
    │   └── animations.css      كل الأنيميشن
    ├── js/
    │   ├── config.js           ⚙️ كل البيانات والروابط هنا
    │   ├── main.js             المنطق الرئيسي
    │   ├── cards.js            رندر بطاقات التواصل + الأيقونات
    │   ├── theme.js            إدارة الثيم
    │   ├── particles.js        خلفية الجسيمات
    │   └── qr.js               مولّد QR (بدون مكتبات)
    └── images/
        ├── Logo.png
        ├── Logo.svg
        ├── Logo-white.png
        ├── Logo-black.png
        ├── favicon.ico
        ├── favicon.svg
        ├── apple-touch-icon.png
        ├── android-chrome-192.png
        ├── android-chrome-512.png
        └── og-image.png
```

---

## 🚀 النشر على GitHub Pages

1. ارفع المجلد كاملًا لمستودع GitHub
2. اذهب لـ **Settings → Pages**
3. اختر الفرع (مثلاً `main`) ومجلد `/root`
4. احفظ — الموقع هيكون متاح خلال دقائق

---

## ⚙️ التعديل

### الطريقة الأولى: تعديل مباشر
افتح `assets/js/config.js` وعدّل الروابط والبيانات.

### الطريقة الثانية: لوحة الإدارة
1. افتح `https://<your-site>/admin/`
2. عدّل أي حاجة (البيانات، الألوان، الخطوط، ترتيب المنصات...)
3. كل التعديلات بتتخزن في LocalStorage
4. استخدم **Export** لتنزيل `config.json`
5. استخدم **Import** لرفعه تاني

---

## 📝 ملاحظات

- كل الروابط في `config.js` حاليًا Placeholders (مثل `YOUR_YOUTUBE_LINK`)
- لو الرابط فاضي: الموقع هيعرض Popup "المنصة دي مش متاحة دلوقتي ❤️"
- اللوجو اتولّد منه كل الصيغ (PNG/SVG/ICO/Favicon/Apple-touch/Android-chrome)
- الألوان الأساسية: أزرق كحلي `#00255F` + ذهبي `#FFBA00`

---

صُنع بكل ❤️ لـ **El Ashry Academy**
