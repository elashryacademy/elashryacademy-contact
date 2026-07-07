/**
 * ============================================================
 *  El Ashry Academy — Config Manager
 * ============================================================
 *  - يقرأ DEFAULT_CONFIG من config.js
 *  - يدمج فوقها overlay من localStorage (من لوحة الإدارة)
 *  - يوفّر دوال get/set/save
 * ============================================================
 */
(function () {
  "use strict";
  const LS_KEY = "elashry_config_v2";

  function deepMerge(base, overlay) {
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    if (Array.isArray(overlay)) return overlay.slice();
    if (overlay && typeof base === "object") {
      for (const k in overlay) {
        if (overlay[k] && typeof overlay[k] === "object" && !Array.isArray(overlay[k])) {
          out[k] = deepMerge(base[k] || {}, overlay[k]);
        } else {
          out[k] = overlay[k];
        }
      }
    }
    return out;
  }

  function readOverlay() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "null") || {}; }
    catch (e) { return {}; }
  }

  function get() {
    const base = window.DEFAULT_CONFIG || {};
    const overlay = readOverlay();
    return deepMerge(base, overlay);
  }

  function saveOverlay(overlay) {
    localStorage.setItem(LS_KEY, JSON.stringify(overlay));
  }

  function patch(partial) {
    const current = readOverlay();
    const merged = deepMerge(current, partial);
    saveOverlay(merged);
    return get();
  }

  function reset() {
    localStorage.removeItem(LS_KEY);
  }

  function exportJSON() {
    return JSON.stringify(get(), null, 2);
  }

  function importJSON(jsonStr) {
    const data = JSON.parse(jsonStr);
    saveOverlay(data);
    return get();
  }

  window.ConfigManager = { get, patch, saveOverlay, reset, exportJSON, importJSON, LS_KEY };
})();
