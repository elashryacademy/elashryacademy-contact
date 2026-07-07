/**
 * ============================================================
 *  El Ashry Academy — Admin Panel Logic
 * ============================================================
 *  - حماية الصفحة (تتطلب تسجيل دخول)
 *  - تعديل كل بيانات CONFIG (Hero/Footer/SEO/Theme/Media)
 *  - إدارة المنصات: إضافة/حذف/ترتيب بالسحب/إظهار-إخفاء
 *  - رفع الصور (Base64)
 *  - تغيير بيانات تسجيل الدخول
 *  - Export/Import config.json
 * ============================================================ */
(function () {
  "use strict";

  /* ====== Auth guard ====== */
  if (!window.Auth) {
    alert("نظام المصادقة غير محمّل");
    return;
  }
  if (!window.Auth.isAuthenticated()) {
    sessionStorage.setItem("elashry_auth_redirect", window.location.href);
    window.location.href = "../login.html";
    return;
  }

  /* ====== Helpers ====== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function showToast(msg) {
    const t = $("#toast");
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
    const target = parts.reduce((o, k) => (o[k] = o[k] || ({}), o[k]), obj);
    target[last] = val;
  }

  function getCfg() { return window.ConfigManager.get(); }
  function patchCfg(partial) {
    window.ConfigManager.patch(partial);
    showSaved();
    applyLivePreview();
  }
  function showSaved() {
    const s = $("#saveStatus");
    if (s) {
      s.textContent = "✓ تم الحفظ تلقائيًا";
      s.classList.add("is-saved");
      clearTimeout(s._t);
      s._t = setTimeout(() => {
        s.textContent = "كل التعديلات بتتخزن تلقائيًا";
        s.classList.remove("is-saved");
      }, 2000);
    }
  }

  function applyLivePreview() {
    const cfg = getCfg();
    if (window.ThemeManager && cfg.theme) window.ThemeManager.applyConfigTheme(cfg.theme);
  }

  /* ====== Modal helpers ====== */
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); }
  }
  function closeModal(m) {
    if (m) { m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); }
  }
  $$(".modal").forEach(m => {
    $$("[data-close]", m).forEach(el => el.addEventListener("click", () => closeModal(m)));
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $$(".modal.is-open").forEach(closeModal);
  });

  /* ====== Tab navigation ====== */
  function initTabs() {
    const btns = $$(".admin__nav button");
    const panels = $$(".admin__content section");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        btns.forEach(b => b.classList.toggle("is-active", b === btn));
        panels.forEach(p => p.classList.toggle("is-active", p.getAttribute("data-panel") === tab));
      });
    });
  }

  /* ====== Fill generic data-key inputs ====== */
  function fillForm() {
    const cfg = getCfg();
    $$("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      const val = getNested(cfg, key);
      if (val != null) {
        if (el.type === "checkbox") el.checked = val;
        else el.value = val;
      }
      el.addEventListener("input", () => {
        const v = el.type === "checkbox" ? el.checked :
                  el.type === "color" ? el.value :
                  el.value;
        patchCfg(setPath(key, v));
      });
      el.addEventListener("change", () => {
        const v = el.type === "checkbox" ? el.checked : el.value;
        patchCfg(setPath(key, v));
      });
    });

    // Previews للصور
    ["logo", "profileImage", "coverImage", "qrImage"].forEach(key => {
      const val = getNested(cfg, key);
      const img = $("#preview-" + key);
      if (img && val) img.src = val;
    });
  }
  function setPath(path, val) {
    // يبني object partial من dotted path
    const partial = {};
    const parts = path.split(".");
    if (parts.length === 1) {
      partial[parts[0]] = val;
    } else {
      let cur = partial;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = val;
    }
    return partial;
  }

  /* ====== File uploads ====== */
  function initUploads() {
    $$("input[type=file][data-file]").forEach(input => {
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
          patchCfg(setPath(key, ev.target.result));
          const textInput = $(`input[type=text][data-key="${key}"]`);
          if (textInput) textInput.value = ev.target.result;
          const img = $("#preview-" + key);
          if (img) img.src = ev.target.result;
          showToast("تم رفع الصورة ✓");
        };
        reader.readAsDataURL(file);
      });
    });
  }

  /* ====== Platforms management ====== */
  let currentEditIndex = -1;

  function renderPlatforms() {
    const list = $("#platformsList");
    if (!list) return;
    const cfg = getCfg();
    const platforms = (cfg.platforms || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

    list.innerHTML = platforms.map((p, i) => {
      const iconPath = window.CardsRenderer ? window.CardsRenderer.getIcon(p.icon || p.id) : "";
      return `
        <li draggable="true" data-idx="${i}" data-id="${p.id}">
          <span class="drag-handle">⋮⋮</span>
          <span class="platform-color" style="background:${p.color || '#888'}"></span>
          <span class="platform-icon">
            <svg viewBox="0 0 24 24">${iconPath}</svg>
          </span>
          <div class="platform-info">
            <div class="platform-name">${p.name}</div>
            <div class="platform-desc">${p.desc || ''}</div>
          </div>
          <input type="checkbox" ${p.visible !== false ? "checked" : ""} aria-label="إظهار ${p.name}" />
          <button class="admin__btn admin__btn--ghost edit-btn" style="padding:0.35rem 0.7rem">تعديل</button>
        </li>
      `;
    }).join("");

    // ربط الأحداث
    list.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", e => {
        const li = e.target.closest("li");
        const idx = parseInt(li.getAttribute("data-idx"));
        const cfg = getCfg();
        const platforms = cfg.platforms.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        platforms[idx].visible = e.target.checked;
        patchCfg({ platforms });
        renderPlatforms();
      });
    });

    list.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const li = e.target.closest("li");
        const idx = parseInt(li.getAttribute("data-idx"));
        openEditPlatform(idx);
      });
    });

    // Drag & Drop
    enableDrag(list);
  }

  function enableDrag(list) {
    let dragSrc = null;
    list.querySelectorAll("li").forEach(li => {
      li.addEventListener("dragstart", e => {
        dragSrc = li;
        li.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", li.getAttribute("data-idx"));
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
        const fromIdx = parseInt(dragSrc.getAttribute("data-idx"));
        const toIdx   = parseInt(li.getAttribute("data-idx"));
        const cfg = getCfg();
        const platforms = cfg.platforms.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const [moved] = platforms.splice(fromIdx, 1);
        platforms.splice(toIdx, 0, moved);
        platforms.forEach((p, i) => p.order = i);
        patchCfg({ platforms });
        renderPlatforms();
      });
    });
  }

  /** فتح modal تعديل منصة */
  function openEditPlatform(idx) {
    currentEditIndex = idx;
    const cfg = getCfg();
    const platforms = cfg.platforms.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    const p = platforms[idx];
    if (!p) return;

    // ملء الحقول
    $$("[data-pkey]").forEach(el => {
      const key = el.getAttribute("data-pkey");
      el.value = p[key] != null ? p[key] : "";
    });

    // ملء قائمة الأيقونات
    const iconSelect = $("[data-pkey=icon]");
    if (iconSelect && window.CardsRenderer) {
      const icons = Object.keys(window.CardsRenderer.ICONS);
      iconSelect.innerHTML = icons.map(i => `<option value="${i}">${i}</option>`).join("");
      iconSelect.value = p.icon || p.id;
    }

    // حالة زر الحذف (لو منصة جديدة، خفيه)
    const delBtn = $("#deletePlatformBtn");
    if (delBtn) delBtn.style.display = idx === -1 ? "none" : "inline-flex";

    openModal("platformModal");
  }

  /** إضافة منصة جديدة */
  function addPlatform() {
    const cfg = getCfg();
    const platforms = cfg.platforms.slice();
    const newId = "platform_" + Date.now();
    const newPlatform = {
      id: newId,
      name: "منصة جديدة",
      desc: "وصف قصير",
      url: "YOUR_LINK",
      color: "#FFBF00",
      icon: "default",
      visible: true,
      order: platforms.length
    };
    platforms.push(newPlatform);
    patchCfg({ platforms });
    renderPlatforms();
    // فتح التعديل عليها
    const sorted = platforms.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    openEditPlatform(sorted.findIndex(p => p.id === newId));
  }

  /** حفظ تعديلات المنصة الحالية */
  function savePlatform() {
    if (currentEditIndex < 0) {
      // منصة جديدة فعلاً
      return;
    }
    const cfg = getCfg();
    const platforms = cfg.platforms.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    const p = platforms[currentEditIndex];
    if (!p) return;
    $$("[data-pkey]").forEach(el => {
      const key = el.getAttribute("data-pkey");
      p[key] = el.value;
    });
    patchCfg({ platforms });
    renderPlatforms();
    closeModal($("#platformModal"));
    showToast("تم حفظ المنصة ✓");
  }

  /** حذف المنصة الحالية */
  function deletePlatform() {
    if (currentEditIndex < 0) return;
    if (!confirm("متأكد من حذف هذه المنصة؟")) return;
    const cfg = getCfg();
    const platforms = cfg.platforms.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    platforms.splice(currentEditIndex, 1);
    platforms.forEach((p, i) => p.order = i);
    patchCfg({ platforms });
    renderPlatforms();
    closeModal($("#platformModal"));
    showToast("تم حذف المنصة");
  }

  /* ====== Export ====== */
  function initExport() {
    $("#exportBtn").addEventListener("click", () => {
      const json = window.ConfigManager.exportJSON();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("تم تصدير config.json ✓");
    });
  }

  /* ====== Import ====== */
  function initImport() {
    $("#importInput").addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          window.ConfigManager.importJSON(ev.target.result);
          showToast("تم الاستيراد ✓");
          setTimeout(() => location.reload(), 700);
        } catch (err) {
          showToast("ملف غير صالح");
        }
      };
      reader.readAsText(file);
    });
  }

  /* ====== Change credentials ====== */
  function initChangeAuth() {
    $("#changeAuthBtn").addEventListener("click", () => {
      $("#newUsername").value = "";
      $("#newPassword").value = "";
      $("#confirmPassword").value = "";
      openModal("authModal");
    });

    $("#saveAuthBtn").addEventListener("click", async () => {
      const u = $("#newUsername").value.trim();
      const p = $("#newPassword").value;
      const c = $("#confirmPassword").value;
      if (!u || !p) { showToast("املأ كل الحقول"); return; }
      if (p !== c) { showToast("كلمتا المرور غير متطابقتين"); return; }
      if (p.length < 6) { showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
      await window.Auth.changeCredentials(u, p);
      closeModal($("#authModal"));
      showToast("تم تغيير بيانات الدخول ✓");
    });
  }

  /* ====== Logout ====== */
  function initLogout() {
    $("#logoutBtn").addEventListener("click", () => {
      if (!confirm("تسجيل الخروج؟")) return;
      window.Auth.logout();
      window.location.href = "../login.html";
    });
  }

  /* ====== Save platform button ====== */
  function initPlatformModal() {
    $("#savePlatformBtn").addEventListener("click", savePlatform);
    $("#deletePlatformBtn").addEventListener("click", deletePlatform);
    $("#addPlatformBtn").addEventListener("click", addPlatform);
  }

  /* ====== Init ====== */
  function init() {
    initTabs();
    fillForm();
    renderPlatforms();
    initUploads();
    initExport();
    initImport();
    initChangeAuth();
    initLogout();
    initPlatformModal();
    applyLivePreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
