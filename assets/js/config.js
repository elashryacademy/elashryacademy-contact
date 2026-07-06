/**
 * ============================================================
 *  El Ashry Academy - Configuration File
 * ============================================================
 *  كل البيانات الأساسية للموقع بتتبني من هنا.
 *  الموقع بياخد كل القيم من الكائن ده، ومفيش أي بيانات ثابتة
 *  مكتوبة جوه HTML.
 *
 *  ✦ من لوحة الإدارة تقدر تعدّل أي قيمة وتتخزن في LocalStorage
 *    وتفضل محفوظة حتى بعد إعادة فتح الصفحة.
 *  ✦ كل الروابط دلوقتي Placeholders، استبدلها بالروابط الحقيقية.
 * ============================================================
 */

const CONFIG = {
  /* -------- معلومات الأكاديمية الأساسية -------- */
  academyName: "El Ashry Academy",
  academyNameAr: "أكاديمية العشري",
  ownerName: "باشمهندس عبده العشري",
  ownerNameEn: "Eng. Abdo El Ashry",
  bio: "منصة تعليمية هندسية متخصصة في تقديم المحتوى التقني الاحترافي بأسلوب عملي يربط بين الفهم النظري والتطبيق العملي. هدفنا مساعدتك تتعلم صح، وتطبّق بإيدك، وتحترف.",
  slogan: "اتعلّم صح... وطبّق بإيدك... واحتَرِف",

  /* -------- روابط التواصل (Placeholders) -------- */
  youtube:    "YOUR_YOUTUBE_LINK",
  facebook:   "YOUR_FACEBOOK_LINK",
  instagram:  "YOUR_INSTAGRAM_LINK",
  tiktok:     "YOUR_TIKTOK_LINK",
  linkedin:   "YOUR_LINKEDIN_LINK",
  telegram:   "YOUR_TELEGRAM_LINK",
  twitter:    "YOUR_TWITTER_LINK",
  threads:    "YOUR_THREADS_LINK",
  discord:    "YOUR_DISCORD_LINK",
  github:     "YOUR_GITHUB_LINK",
  website:    "YOUR_WEBSITE_LINK",
  email:      "YOUR_EMAIL@example.com",
  whatsapp:   "YOUR_WHATSAPP_NUMBER",
  location:   "YOUR_LOCATION_LINK",
  courses:    "YOUR_COURSES_LINK",

  /* -------- الصور -------- */
  logo:         "assets/images/Logo.png",
  coverImage:   "",
  profileImage: "",

  /* -------- إعدادات المظهر الافتراضية -------- */
  theme: {
    mode: "dark",                       // "dark" | "light" | "auto"
    primaryColor:   "#00255F",          // الأزرق الكحلي
    accentColor:    "#FFBA00",          // الذهبي
    backgroundColor:"#0a0f1f",
    fontFamily:     "'Cairo', 'Tajawal', 'Segoe UI', sans-serif",
    buttonStyle:    "glass",            // "glass" | "solid" | "gradient"
    animationLevel: "full"              // "full" | "reduced" | "off"
  },

  /* -------- ترتيب وإظهار المنصات -------- */
  platforms: [
    { id: "youtube",    visible: true,  order: 0 },
    { id: "whatsapp",   visible: true,  order: 1 },
    { id: "facebook",   visible: true,  order: 2 },
    { id: "instagram",  visible: true,  order: 3 },
    { id: "tiktok",     visible: true,  order: 4 },
    { id: "linkedin",   visible: true,  order: 5 },
    { id: "telegram",   visible: true,  order: 6 },
    { id: "twitter",    visible: true,  order: 7 },
    { id: "threads",    visible: true,  order: 8 },
    { id: "discord",    visible: true,  order: 9 },
    { id: "github",     visible: true,  order: 10 },
    { id: "email",      visible: true,  order: 11 },
    { id: "website",    visible: true,  order: 12 },
    { id: "location",   visible: true,  order: 13 },
    { id: "courses",    visible: true,  order: 14 }
  ]
};

/**
 * بيانات وصفية لكل منصة (أيقونة + اسم + وصف + لون مميز).
 * بتُستخدم داخل main.js وبعض الكود المشترك بين الموقع ولوحة الإدارة.
 */
const PLATFORM_META = {
  youtube:    { name: "YouTube",    desc: "قناة الأكاديمية التعليمية",     color: "#FF0000", icon: "youtube" },
  whatsapp:   { name: "WhatsApp",   desc: "تواصل مباشر ورد سريع",          color: "#25D366", icon: "whatsapp" },
  facebook:   { name: "Facebook",   desc: "صفحة الأكاديمية الرسمية",       color: "#1877F2", icon: "facebook" },
  instagram:  { name: "Instagram",  desc: "متابعة اللحظات اليومية",         color: "#E4405F", icon: "instagram" },
  tiktok:     { name: "TikTok",     desc: "محتوى قصير وسريع",              color: "#000000", icon: "tiktok" },
  linkedin:   { name: "LinkedIn",   desc: "الملف المهني للأكاديمية",        color: "#0A66C2", icon: "linkedin" },
  telegram:   { name: "Telegram",   desc: "قناة التحديثات الفورية",         color: "#26A5E4", icon: "telegram" },
  twitter:    { name: "X (Twitter)",desc: "آخر الأخبار والتعليقات",         color: "#000000", icon: "twitter" },
  threads:    { name: "Threads",    desc: "نصوص ومحادثات قصيرة",            color: "#000000", icon: "threads" },
  discord:    { name: "Discord",    desc: "مجتمع الأكاديمية التفاعلي",      color: "#5865F2", icon: "discord" },
  github:     { name: "GitHub",     desc: "الكود والمشاريع مفتوحة المصدر",  color: "#181717", icon: "github" },
  email:      { name: "Email",      desc: "راسلنا عبر البريد الإلكتروني",   color: "#EA4335", icon: "email" },
  website:    { name: "Website",    desc: "الموقع الرسمي للأكاديمية",       color: "#00255F", icon: "website" },
  location:   { name: "Location",   desc: "موقع الأكاديمية على الخريطة",    color: "#34A853", icon: "location" },
  courses:    { name: "Courses",    desc: "استكشف الكورسات المتاحة",        color: "#FFBA00", icon: "courses" }
};

// تصدير للاستخدام في الوحدات (إن لزم)
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
  window.PLATFORM_META = PLATFORM_META;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, PLATFORM_META };
}
