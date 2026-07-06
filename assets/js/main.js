/* ============================================================
   El Ashry Academy - Main Controller
   ============================================================
   - يقرأ CONFIG (ومن LocalStorage لو فيه تعديلات من لوحة الإدارة)
   - يملأ بيانات Hero
   - يربط البطاقات والأزرار والـ Modals
   - يدعم Ripple + Toast + QR + VCF + Share + Back-to-top
   ============================================================ */
(function () {
  "use strict";

  const LS_KEY = "elashry_config_overlay";
  const toast = document.getElementById("toast");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Helpers ---------- */
  function showToast(msg, type = "") {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = "toast is-visible " + (type ? `toast--${type}` : "");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); }
  }
  function closeModal(m) {
    if (m) { m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); }
  }
  document.querySelectorAll(".modal").forEach(m => {
    m.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", () => closeModal(m)));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(m); });
  });

  /* ---------- Load config with overlay ---------- */
  function loadConfig() {
    let overlay = null;
    try { overlay = JSON.parse(localStorage.getItem(LS_KEY) || "null"); } catch (e) {}
    // دمج overlay فوق CONFIG
    const merged = Object.assign({}, window.CONFIG || {}, overlay || {});
    // دمج theme و platforms بشكل عميق
    if (overlay && overlay.theme) merged.theme = Object.assign({}, (window.CONFIG || {}).theme || {}, overlay.theme);
    if (overlay && Array.isArray(overlay.platforms)) merged.platforms = overlay.platforms;
    return merged;
  }

  /* ---------- Apply config to DOM ---------- */
  function applyConfig(cfg) {
    // البيانات النصية
    setText("academyName", cfg.academyName);
    setText("academyNameAr", cfg.academyNameAr);
    setText("ownerName", cfg.ownerName);
    setText("slogan", cfg.slogan);
    setText("footerSlogan", cfg.slogan);
    setText("bio", cfg.bio);

    // اللوجو
    const logo = document.getElementById("heroLogo");
    if (logo && cfg.logo) logo.src = cfg.logo;

    // المظهر
    if (window.ThemeManager && cfg.theme) {
      window.ThemeManager.applyConfigTheme(cfg.theme);
    }

    // البطاقات
    if (window.CardsRenderer) {
      window.CardsRenderer.render(cfg, window.PLATFORM_META || {});
    }

    // عنوان الصفحة
    if (cfg.academyName) document.title = `${cfg.academyName} | ${cfg.academyNameAr || ""}`;
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  }

  /* ---------- Ripple Effect ---------- */
  function attachRipple() {
    document.addEventListener("pointerdown", e => {
      const target = e.target.closest(".ripple, .card, .fab, .btn");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ink = document.createElement("span");
      ink.className = "ripple-ink";
      ink.style.width = ink.style.height = size + "px";
      ink.style.left = (e.clientX - rect.left - size / 2) + "px";
      ink.style.top = (e.clientY - rect.top - size / 2) + "px";
      target.appendChild(ink);
      setTimeout(() => ink.remove(), 600);
    });
  }

  /* ---------- Card click handler ---------- */
  function attachCards(cfg) {
    document.addEventListener("click", e => {
      const card = e.target.closest(".card");
      if (!card) return;
      const url = card.getAttribute("data-url");
      const name = card.getAttribute("data-name");
      if (!url) {
        showToast("المنصة دي مش متاحة دلوقتي ❤️", "error");
        return;
      }
      // نسخ رقم WhatsApp لو النقر بزر يمين أو مع shift
      if (card.getAttribute("data-platform") === "whatsapp" && (e.shiftKey)) {
        const num = (cfg.whatsapp || "").replace(/[^0-9]/g, "");
        if (num) {
          navigator.clipboard?.writeText(num).then(() => showToast("تم نسخ رقم الواتساب", "success"));
          return;
        }
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  /* ---------- FAB: theme, QR, VCF, back-to-top ---------- */
  function attachFABs(cfg) {
    // Theme toggle
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", () => {
      const mode = window.ThemeManager ? window.ThemeManager.toggleTheme() : "dark";
      showToast(mode === "dark" ? "الوضع الليلي" : "الوضع النهاري");
    });

    // QR modal
    const qrBtn = document.getElementById("qrBtn");
    if (qrBtn) qrBtn.addEventListener("click", () => {
      const container = document.getElementById("qrCode");
      const pageUrl = window.location.href;
      if (window.QRCodeGenerator && container) {
        window.QRCodeGenerator.renderInto(container, pageUrl);
      }
      openModal("qrModal");
    });

    // VCF download
    const vcfBtn = document.getElementById("vcfBtn");
    if (vcfBtn) vcfBtn.addEventListener("click", () => downloadVCF(cfg));

    // Back to top
    const topBtn = document.getElementById("topBtn");
    if (topBtn) {
      topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
      window.addEventListener("scroll", () => {
        if (window.scrollY > 400) topBtn.classList.add("is-visible");
        else topBtn.classList.remove("is-visible");
      }, { passive: true });
    }
  }

  /* ---------- VCF card ---------- */
  function downloadVCF(cfg) {
    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${cfg.ownerName || ""}`,
      `FN:${cfg.ownerName || ""}`,
      `ORG:${cfg.academyName || ""}`,
      `TITLE:${cfg.ownerNameEn || ""}`,
      `NOTE:${cfg.slogan || ""}`,
      cfg.email ? `EMAIL:${cfg.email}` : "",
      cfg.website ? `URL:${cfg.website}` : "",
      cfg.whatsapp ? `TEL:${cfg.whatsapp}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "el-ashry-academy.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("تم تحميل بطاقة التواصل", "success");
  }

  /* ---------- Share ---------- */
  function attachShare(cfg) {
    const btn = document.getElementById("shareBtn");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const shareData = {
        title: cfg.academyName || "El Ashry Academy",
        text: cfg.slogan || "",
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("تم نسخ رابط الصفحة", "success");
        } catch (e) {
          showToast("تعذّر المشاركة");
        }
      }
    });
  }

  /* ---------- Quick Contact modal ---------- */
  function attachQuickContact(cfg) {
    const btn = document.getElementById("quickContactBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const container = document.getElementById("contactQuick");
      if (!container) return;
      const meta = window.PLATFORM_META || {};
      const quickIds = ["whatsapp", "email", "telegram", "linkedin"];
      container.innerHTML = quickIds.map(id => {
        const info = meta[id];
        const url = window.CardsRenderer ? window.CardsRenderer.getUrl(id, cfg) : "";
        if (!info) return "";
        const icon = (window.CardsRenderer && window.CardsRenderer.ICONS[info.icon]) || "";
        return `<button data-url="${url}" data-platform="${id}">
          <svg viewBox="0 0 24 24" style="color:${info.color}">${icon}</svg>
          <span>${info.name}</span>
        </button>`;
      }).join("");
      container.querySelectorAll("button").forEach(b => {
        b.addEventListener("click", () => {
          const url = b.getAttribute("data-url");
          if (url) window.open(url, "_blank", "noopener,noreferrer");
          else showToast("المنصة دي مش متاحة دلوقتي ❤️", "error");
        });
      });
      openModal("contactModal");
    });
  }

  /* ---------- Loader ---------- */
  function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("is-hidden");
      setTimeout(() => loader.remove(), 700);
    }
  }

  /* ---------- Init ---------- */
  function init() {
    const cfg = loadConfig();
    applyConfig(cfg);
    attachRipple();
    attachCards(cfg);
    attachFABs(cfg);
    attachShare(cfg);
    attachQuickContact(cfg);
    hideLoader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // تصدير للوحة الإدارة لو احتاجت
  window.ElAshryApp = { loadConfig, applyConfig, LS_KEY };
})();
