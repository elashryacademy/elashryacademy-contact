/**
 * ============================================================
 *  El Ashry Academy — Main Controller
 * ============================================================
 *  - يقرأ CONFIG من ConfigManager
 *  - يملأ بيانات Hero و Footer و SEO
 *  - يربط البطاقات والأزرار والـ Modals
 *  - Ripple + Toast + QR + Share + Back-to-top
 * ============================================================ */
(function () {
  "use strict";

  const toast = document.getElementById("toast");

  /* ---------- Helpers ---------- */
  function showToast(msg, ms = 2400) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("is-visible"), ms);
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
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modal.is-open").forEach(closeModal);
  });

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  }
  function setAttr(id, attr, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.setAttribute(attr, val);
  }

  /* ---------- Apply config ---------- */
  function applyConfig(cfg) {
    // Hero
    setText("heroName", cfg.academyName);
    setText("heroTagline", cfg.tagline);
    const heroLogo = document.getElementById("heroLogo");
    if (heroLogo && cfg.logo) heroLogo.src = cfg.logo;

    // Footer
    setText("footerText", cfg.footerText);
    setText("footerCredit", cfg.footerCredit);

    // SEO
    document.title = cfg.seoTitle || `${cfg.academyName} | الصفحة الرسمية للتواصل`;
    setAttr("seoDesc", "content", cfg.seoDescription);
    setAttr("seoKeywords", "content", cfg.seoKeywords);
    setAttr("canonicalLink", "href", cfg.siteUrl);
    setAttr("ogTitle", "content", cfg.academyName);
    setAttr("ogDesc", "content", cfg.seoDescription || cfg.tagline);
    setAttr("ogUrl", "content", cfg.siteUrl);
    setAttr("twTitle", "content", cfg.academyName);
    setAttr("twDesc", "content", cfg.seoDescription || cfg.tagline);

    // Schema.org
    const schema = document.getElementById("schemaData");
    if (schema) {
      const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": cfg.academyName,
        "alternateName": cfg.academyNameAr,
        "url": cfg.siteUrl,
        "logo": cfg.logo,
        "image": "assets/images/og-image.png",
        "description": cfg.seoDescription || cfg.tagline
      };
      schema.textContent = JSON.stringify(data);
    }

    // Theme
    if (window.ThemeManager && cfg.theme) {
      window.ThemeManager.applyConfigTheme(cfg.theme);
    }

    // Cards
    if (window.CardsRenderer) {
      window.CardsRenderer.render(cfg.platforms || []);
    }
  }

  /* ---------- Ripple ---------- */
  function attachRipple() {
    document.addEventListener("pointerdown", e => {
      const target = e.target.closest(".card, .fab");
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

  /* ---------- Card clicks ---------- */
  function attachCards() {
    document.addEventListener("click", e => {
      const card = e.target.closest(".card");
      if (!card) return;
      const urlRaw = card.getAttribute("data-url");
      const url = urlRaw ? decodeURIComponent(urlRaw) : "";
      if (!url) {
        showToast("المنصة دي مش متاحة دلوقتي ❤️");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  /* ---------- FABs ---------- */
  function attachFABs() {
    // QR
    const qrBtn = document.getElementById("qrBtn");
    if (qrBtn) qrBtn.addEventListener("click", () => {
      const container = document.getElementById("qrCode");
      const url = window.location.href;
      if (window.QRCodeGenerator && container) {
        window.QRCodeGenerator.renderInto(container, url);
      }
      openModal("qrModal");
    });

    // Share
    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) shareBtn.addEventListener("click", async () => {
      const cfg = window.ConfigManager ? window.ConfigManager.get() : {};
      const shareData = {
        title: cfg.academyName || "El Ashry Academy",
        text: cfg.tagline || "",
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("تم نسخ رابط الصفحة ✓");
        } catch (e) {
          showToast("تعذّر المشاركة");
        }
      }
    });

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
    if (!window.ConfigManager) {
      console.error("ConfigManager not loaded");
      hideLoader();
      return;
    }
    const cfg = window.ConfigManager.get();
    applyConfig(cfg);
    attachRipple();
    attachCards();
    attachFABs();
    hideLoader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
