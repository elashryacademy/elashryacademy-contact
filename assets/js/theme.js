/* ============================================================
   El Ashry Academy - Theme Manager
   ============================================================
   - يحفظ اختيار المستخدم في localStorage
   - يدعم auto / dark / light
   - بيوافق prefers-color-scheme لما تكون auto
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "elashry_theme";

  /** قراءة التيمة المحفوظة أو الافتراضية */
  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    return "dark"; // الافتراضي
  }

  /** تطبيق التيمة على عنصر html */
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    // تحديث meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", mode === "dark" ? "#0a0f1f" : "#f5f7fb");
    }
  }

  /** تبديل بين dark / light */
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    // إشعار باقي السكربتات
    window.dispatchEvent(new CustomEvent("themechange", { detail: { mode: next } }));
    return next;
  }

  /** تطبيق إعدادات المظهر من CONFIG.theme (ألوان، خط، إلخ) */
  function applyConfigTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.primaryColor) {
      root.style.setProperty("--primary", theme.primaryColor);
      const rgb = hexToRgb(theme.primaryColor);
      if (rgb) root.style.setProperty("--primary-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    if (theme.accentColor) {
      root.style.setProperty("--accent", theme.accentColor);
      const rgb = hexToRgb(theme.accentColor);
      if (rgb) {
        root.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        root.style.setProperty("--accent-soft", lighten(theme.accentColor, 0.2));
      }
    }
    if (theme.backgroundColor) {
      root.style.setProperty("--bg", theme.backgroundColor);
    }
    if (theme.fontFamily) {
      root.style.setProperty("--font-family", theme.fontFamily);
      root.style.setProperty("--font-display", theme.fontFamily);
    }
    if (theme.buttonStyle) {
      document.body.setAttribute("data-btn-style", theme.buttonStyle);
    }
    if (theme.animationLevel) {
      document.documentElement.setAttribute("data-anim", theme.animationLevel);
    }
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function lighten(hex, amt) {
    const rgb = hexToRgb(hex); if (!rgb) return hex;
    const r = Math.min(255, Math.round(rgb.r + 255 * amt));
    const g = Math.min(255, Math.round(rgb.g + 255 * amt));
    const b = Math.min(255, Math.round(rgb.b + 255 * amt));
    return `rgb(${r}, ${g}, ${b})`;
  }

  // تطبيق التيمة مبكرًا لتفادي الوميض
  applyTheme(getSavedTheme());

  // تصدير
  window.ThemeManager = {
    getSavedTheme,
    applyTheme,
    toggleTheme,
    applyConfigTheme,
    STORAGE_KEY
  };
})();
