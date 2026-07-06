/* ============================================================
   El Ashry Academy - Admin Panel Logic
   ============================================================
   - يقرأ CONFIG من config.js + overlay من LocalStorage
   - أي تعديل يُحفظ في LocalStorage ويتطبيق على الموقع فورًا
   - Export: ينزّل config.json كامل
   - Import: يرفع config.json ويدمجه
   - Drag & Drop لترتيب المنصات
   - رفع الصور (تتحول لـ Base64)
   ============================================================ */
(function () {
  "use strict";

  const LS_KEY = "elashry_config_overlay";
  const PLATFORM_IDS = [
    "youtube","whatsapp","facebook","instagram","tiktok","linkedin",
    "telegram","twitter","threads","discord","github","website",
    "email","location","courses"
  ];

  /* ---------- Helpers ---------- */
  function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("is-visible"), 2200);
  }

  function getNested(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setNested(obj, path, val) {
    const parts = path.split(".");
    const last = parts.pop();
    const target = parts.reduce((o, k) => (o[k] = o[k] || {}, o[k]]), obj);
    target[last] = val;
  }

  /* ---------- Load / Save ---------- */
  function loadOverlay() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "null") || {}; }
    catch (e) { return {}; }
  }
  function saveOverlay(overlay) {
    localStorage.setItem(LS_KEY, JSON.stringify(overlay));
  }
  function mergedConfig() {
    const base = JSON.parse(JSON.stringify(window.CONFIG || {}));
    const overlay = loadOverlay();
    if (overlay.theme) base.theme = Object.assign({}, base.theme || {}, overlay.theme);
    if (Array.isArray(overlay.platforms)) base.platforms = overlay.platforms;
    return Object.assign(base, overlay);
  }

  /* ---------- Tab navigation ---------- */
  function initTabs() {
    const navBtns = document.querySelectorAll(".admin__nav button");
    const panels = document.querySelectorAll(".admin__content section");
    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        navBtns.forEach(b => b.classList.toggle("is-active", b === btn));
        panels.forEach(p => p.classList.toggle("is-active", p.getAttribute("data-panel") === tab));
      });
    });
  }

  /* ---------- Fill basic + links + appearance ---------- */
  function fillForm() {
    const cfg = mergedConfig();
    // كل [data-key]
    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      const val = getNested(cfg, key);
      if (val != null) el.value = val;
      el.addEventListener("input", () => {
        const overlay = loadOverlay();
        setNested(overlay, key, el.value);
        // theme يحتاج دمج
        if (key.startsWith("theme.")) {
          overlay.theme = Object.assign({}, window.CONFIG.theme || {}, overlay.theme || {});
        }
        saveOverlay(overlay);
        applyLivePreview();
        document.getElementById("saveStatus").textContent = "✓ تم الحفظ تلقائيًا";
      });
    });

    // Previews للصور
    ["logo", "profileImage", "coverImage"].forEach(key => {
      const val = getNested(cfg, key);
      const img = document.getElementById("preview-" + key);
      if (img && val) { img.src = val; }
    });

    // روابط التواصل
    const linksGrid = document.getElementById("linksGrid");
    const meta = window.PLATFORM_META || {};
    linksGrid.innerHTML = PLATFORM_IDS.map(id => {
      const info = meta[id] || { name: id, desc: "" };
      return `<label>
        <span style="display:flex;align-items:center;gap:0.4rem;">
          <span style="width:14px;height:14px;background:${info.color};border-radius:4px;display:inline-block;"></span>
          ${info.name}
        </span>
        <input type="text" data-key="${id}" placeholder="YOUR_${id.toUpperCase()}_LINK" />
      </label>`;
    }).join("");
    // إعادة ربط المستمعين للحقول الجديدة
    linksGrid.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      el.value = getNested(cfg, key) || "";
      el.addEventListener("input", () => {
        const overlay = loadOverlay();
        overlay[key] = el.value;
        saveOverlay(overlay);
        document.getElementById("saveStatus").textContent = "✓ تم الحفظ تلقائيًا";
      });
    });
  }

  /* ---------- Platforms drag & drop ---------- */
  function initPlatformsList() {
    const list = document.getElementById("platformsList");
    if (!list) return;
    const cfg = mergedConfig();
    let platforms = Array.isArray(cfg.platforms) ? cfg.platforms.slice() : PLATFORM_IDS.map((id, i) => ({ id, visible: true, order: i }));

    function render() {
      platforms.sort((a, b) => (a.order || 0) - (b.order || 0));
      const meta = window.PLATFORM_META || {};
      list.innerHTML = platforms.map((p, i) => {
        const info = meta[p.id] || { name: p.id, color: "#888" };
        return `<li draggable="true" data-id="${p.id}" data-idx="${i}">
          <span class="drag-handle">⋮⋮</span>
          <span class="platform-color" style="background:${info.color}"></span>
          <span class="platform-name">${info.name}</span>
          <input type="checkbox" ${p.visible ? "checked" : ""} aria-label="إظهار ${info.name}" />
        </li>`;
      }).join("");

      list.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", e => {
          const li = e.target.closest("li");
          const id = li.getAttribute("data-id");
          const p = platforms.find(p => p.id === id);
          if (p) p.visible = e.target.checked;
          savePlatforms();
        });
      });

      // Drag
      let dragSrc = null;
      list.querySelectorAll("li").forEach(li => {
        li.addEventListener("dragstart", e => {
          dragSrc = li;
          li.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });
        li.addEventListener("dragend", () => {
          li.classList.remove("dragging");
          list.querySelectorAll("li").forEach(x => x.classList.remove("drag-over"));
        });
        li.addEventListener("dragover", e => {
          e.preventDefault();
          if (dragSrc && dragSrc !== li) li.classList.add("drag-over");
        });
        li.addEventListener("dragleave", () => li.classList.remove("drag-over"));
        li.addEventListener("drop", e => {
          e.preventDefault();
          if (!dragSrc || dragSrc === li) return;
          const fromId = dragSrc.getAttribute("data-id");
          const toId = li.getAttribute("data-id");
          const fromIdx = platforms.findIndex(p => p.id === fromId);
          const toIdx = platforms.findIndex(p => p.id === toId);
          const [moved] = platforms.splice(fromIdx, 1);
          platforms.splice(toIdx, 0, moved);
          // re-order
          platforms.forEach((p, i) => p.order = i);
          savePlatforms();
          render();
        });
      });
    }

    function savePlatforms() {
      const overlay = loadOverlay();
      overlay.platforms = platforms;
      saveOverlay(overlay);
      applyLivePreview();
      document.getElementById("saveStatus").textContent = "✓ تم الحفظ تلقائيًا";
    }

    render();
  }

  /* ---------- File uploads ---------- */
  function initUploads() {
    document.querySelectorAll("input[type=file][data-file]").forEach(input => {
      input.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          showToast("حجم الصورة كبير جدًا (أقصى 2MB)");
          return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
          const key = input.getAttribute("data-file");
          const overlay = loadOverlay();
          overlay[key] = ev.target.result;
          saveOverlay(overlay);
          // حدّث حقل النص والـ preview
          const textInput = document.querySelector(`input[type=text][data-key="${key}"]`);
          if (textInput) textInput.value = "(صورة مرفوعة)";
          const img = document.getElementById("preview-" + key);
          if (img) img.src = ev.target.result;
          applyLivePreview();
          showToast("تم رفع الصورة");
        };
        reader.readAsDataURL(file);
      });
    });
  }

  /* ---------- Live preview (apply on the admin theme too) ---------- */
  function applyLivePreview() {
    const cfg = mergedConfig();
    if (window.ThemeManager && cfg.theme) window.ThemeManager.applyConfigTheme(cfg.theme);
  }

  /* ---------- Export ---------- */
  function initExport() {
    document.getElementById("exportBtn").addEventListener("click", () => {
      const cfg = mergedConfig();
      // تنظيف: شيل القيم اللي فاضية
      const clean = JSON.parse(JSON.stringify(cfg));
      const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("تم تصدير config.json");
    });
  }

  /* ---------- Import ---------- */
  function initImport() {
    document.getElementById("importInput").addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          saveOverlay(data);
          showToast("تم الاستيراد. حدّث الصفحة.");
          setTimeout(() => location.reload(), 800);
        } catch (err) {
          showToast("ملف غير صالح");
        }
      };
      reader.readAsText(file);
    });
  }

  /* ---------- Reset ---------- */
  function initReset() {
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm("متأكد؟ هتروح كل التعديلات وترجع للإعدادات الأصلية.")) return;
      localStorage.removeItem(LS_KEY);
      showToast("تمت إعادة التعيين");
      setTimeout(() => location.reload(), 800);
    });
  }

  /* ---------- Save button (manual refresh) ---------- */
  function initSaveBtn() {
    document.getElementById("saveBtn").addEventListener("click", () => {
      showToast("تم الحفظ. افتح الموقع لرؤية التغييرات.");
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initTabs();
    fillForm();
    initPlatformsList();
    initUploads();
    initExport();
    initImport();
    initReset();
    initSaveBtn();
    applyLivePreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
