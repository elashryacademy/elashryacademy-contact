/**
 * ============================================================
 *  El Ashry Academy — Theme Manager
 * ============================================================
 *  - يحفظ اختيار المستخدم في localStorage
 *  - يدعم dark / light
 *  - يطبّق إعدادات المظهر من CONFIG.theme (ألوان/خط/أنيميشن)
 * ============================================================ */
(function () {
  "use strict";
  const LS_KEY = "elashry_theme";

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    return "dark";
  }

  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", mode === "dark" ? "#070B16" : "#F7F8FB");
    }
  }

  function hexToRgb(hex) {
    if (!hex) return null;
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  /** تطبيق إعدادات المظهر من CONFIG.theme */
  function applyConfigTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;

    if (theme.mode) applyTheme(theme.mode);

    if (theme.primaryColor) {
      root.style.setProperty("--primary", theme.primaryColor);
      const rgb = hexToRgb(theme.primaryColor);
      if (rgb) root.style.setProperty("--primary-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    if (theme.accentColor) {
      root.style.setProperty("--accent", theme.accentColor);
      const rgb = hexToRgb(theme.accentColor);
      if (rgb) root.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    if (theme.backgroundColor) {
      root.style.setProperty("--bg", theme.backgroundColor);
    }
    if (theme.surfaceColor) {
      root.style.setProperty("--surface", theme.surfaceColor);
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

  applyTheme(getSavedTheme());

  window.ThemeManager = {
    getSavedTheme, applyTheme, applyConfigTheme,
    STORAGE_KEY: LS_KEY
  };
})();
