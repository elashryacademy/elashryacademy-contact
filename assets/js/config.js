/**
 * ============================================================
 *  El Ashry Academy — Configuration Source
 * ============================================================
 *  المصدر الوحيد للحقيقة (Single Source of Truth).
 *  كل البيانات الأساسية للموقع بتطلع من هنا.
 *
 *  - الزائر العادي بيشوف ده.
 *  - لوحة الإدارة بتعدّل نسخة overlay في localStorage
 *    وبتدمجها فوق الكائن ده.
 *
 *  كل الروابط دلوقتي Placeholders — استبدلها بالروابط الحقيقية.
 * ============================================================
 */

const DEFAULT_CONFIG = {
  /* ====== الهوية ====== */
  academyName:    "El Ashry Academy",
  academyNameAr:  "أكاديمية العشري",
  tagline:        "نتعلّم صح... ونشتغل صح.",
  description:    "الصفحة الرسمية للتواصل — كل روابطنا في مكان واحد.",

  /* ====== Footer ====== */
  footerText:     "© 2026 El Ashry Academy",
  footerCredit:   "Made with ❤️ in Egypt",

  /* ====== الصور ====== */
  logo:        "assets/images/Logo.png",
  logoWhite:   "assets/images/Logo-white.png",
  favicon:     "assets/images/favicon.svg",
  profileImage:"",
  coverImage:  "",
  qrImage:     "",

  /* ====== SEO ====== */
  siteUrl:       "https://elashry-academy.github.io/",
  seoTitle:      "El Ashry Academy | الصفحة الرسمية للتواصل",
  seoDescription:"El Ashry Academy — أكاديمية العشري. الصفحة الرسمية للتواصل: YouTube, WhatsApp, Facebook, LinkedIn وأكثر.",
  seoKeywords:   "El Ashry Academy, أكاديمية العشري, تواصل, El Ashry, contact, smart link, digital card",

  /* ====== المظهر ====== */
  theme: {
    mode:            "dark",          // dark | light
    primaryColor:    "#002662",       // Dark Navy
    accentColor:     "#FFBF00",       // Golden Yellow
    backgroundColor: "#070B16",
    surfaceColor:    "#0F1525",
    fontFamily:      "'Inter', 'Cairo', system-ui, sans-serif",
    buttonStyle:     "glass",         // glass | solid | gradient
    animationLevel:  "full",          // full | reduced | off
    particlesEnabled:true
  },

  /* ====== المنصات ======
     كل منصة لها:
       id      : مفتاح فريد
       name    : الاسم الظاهر
       desc    : وصف قصير جدًا
       url     : الرابط (أو Placeholder)
       color   : لون المنصة (للأيقونة والـ glow)
       icon    : اسم الأيقونة من مكتبة cards.js
       visible : إظهار/إخفاء
       order   : الترتيب
  */
  platforms: [
    { id:"youtube",   name:"YouTube",   desc:"القناة الرسمية",       url:"YOUR_YOUTUBE_LINK",   color:"#FF0000", icon:"youtube",   visible:true, order:0 },
    { id:"facebook",  name:"Facebook",  desc:"صفحتنا الرسمية",       url:"YOUR_FACEBOOK_LINK",  color:"#1877F2", icon:"facebook",  visible:true, order:1 },
    { id:"whatsapp",  name:"WhatsApp",  desc:"تواصل مباشر",          url:"YOUR_WHATSAPP_NUMBER",color:"#25D366", icon:"whatsapp",  visible:true, order:2 },
    { id:"linkedin",  name:"LinkedIn",  desc:"الملف المهني",         url:"YOUR_LINKEDIN_LINK",  color:"#0A66C2", icon:"linkedin",  visible:true, order:3 },
    { id:"instagram", name:"Instagram", desc:"لحظاتنا اليومية",      url:"YOUR_INSTAGRAM_LINK", color:"#E4405F", icon:"instagram", visible:true, order:4 },
    { id:"tiktok",    name:"TikTok",    desc:"محتوى قصير",           url:"YOUR_TIKTOK_LINK",    color:"#000000", icon:"tiktok",    visible:true, order:5 },
    { id:"threads",   name:"Threads",   desc:"نصوص ومحادثات",        url:"YOUR_THREADS_LINK",   color:"#000000", icon:"threads",   visible:true, order:6 },
    { id:"twitter",   name:"X",         desc:"آخر الأخبار",          url:"YOUR_X_LINK",         color:"#000000", icon:"twitter",   visible:true, order:7 },
    { id:"telegram",  name:"Telegram",  desc:"قناة التحديثات",       url:"YOUR_TELEGRAM_LINK",  color:"#26A5E4", icon:"telegram",  visible:true, order:8 },
    { id:"github",    name:"GitHub",    desc:"مشاريع مفتوحة المصدر", url:"YOUR_GITHUB_LINK",    color:"#181717", icon:"github",    visible:true, order:9 },
    { id:"discord",   name:"Discord",   desc:"مجتمع الأكاديمية",     url:"YOUR_DISCORD_LINK",   color:"#5865F2", icon:"discord",   visible:true, order:10 },
    { id:"website",   name:"Website",   desc:"الموقع الرسمي",        url:"YOUR_WEBSITE_LINK",   color:"#002662", icon:"website",   visible:true, order:11 },
    { id:"email",     name:"Email",     desc:"راسلنا",               url:"YOUR_EMAIL",          color:"#EA4335", icon:"email",     visible:true, order:12 },
    { id:"location",  name:"Location",  desc:"موقعنا على الخريطة",   url:"YOUR_LOCATION_LINK",  color:"#34A853", icon:"location",  visible:true, order:13 }
  ]
};

/* ====== بيانات تسجيل الدخول الافتراضية ======
   ⚠️  دي قيم ابتدائية فقط. أول مرة تفتح فيها لوحة الإدارة
   هتحتاج تسجل بها. بعد كده تقدر تغيّرها من لوحة التحكم نفسها
   (القيم بتتخزن hash في localStorage).
   غيّرها فورًا بعد أول دخول.
   ============================================================ */
const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "elashry2026"
};

/* تصدير عالمي */
if (typeof window !== "undefined") {
  window.DEFAULT_CONFIG = DEFAULT_CONFIG;
  window.DEFAULT_CREDENTIALS = DEFAULT_CREDENTIALS;
}
