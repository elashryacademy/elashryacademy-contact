/**
 * ============================================================
 *  El Ashry Academy — Auth Manager
 * ============================================================
 *  نظام تسجيل دخول كامل بدون Backend:
 *    - Login Page (login.html)
 *    - Session management (sessionStorage)
 *    - Remember Me (localStorage)
 *    - Logout
 *    - تغيير بيانات الدخول من لوحة الإدارة
 *
 *  التخزين:
 *    - credentials: localStorage (username + sha-256 hash of password)
 *    - session: sessionStorage (token + expiry)
 *    - remembered: localStorage (username + token for 30 days)
 *
 *  ملاحظة أمنية: ده Frontend-only auth — مناسب للحماية من الزوار
 *  العاديين، لكن مش بديل عن Backend auth للحسابات الحساسة.
 * ============================================================
 */
(function () {
  "use strict";

  const CRED_KEY    = "elashry_auth_cred";
  const SESSION_KEY = "elashry_auth_session";
  const REMEMBER_KEY= "elashry_auth_remember";
  const SESSION_TTL = 30 * 60 * 1000;        // 30 دقيقة
  const REMEMBER_TTL= 30 * 24 * 60 * 60 * 1000; // 30 يوم

  /* ---------- SHA-256 (مدمجة من Web Crypto API) ---------- */
  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0")).join("");
  }

  /* ---------- إعداد الاعتماديات الافتراضية ---------- */
  function getStoredCredentials() {
    try {
      const stored = JSON.parse(localStorage.getItem(CRED_KEY) || "null");
      if (stored && stored.username && stored.hash) return stored;
    } catch (e) {}
    return null;
  }

  async function ensureDefaultCredentials() {
    if (getStoredCredentials()) return;
    const def = window.DEFAULT_CREDENTIALS || { username: "admin", password: "admin" };
    const hash = await sha256(def.password);
    localStorage.setItem(CRED_KEY, JSON.stringify({
      username: def.username,
      hash: hash,
      createdAt: Date.now()
    }));
  }

  /* ---------- تسجيل الدخول ---------- */
  async function login(username, password, remember) {
    await ensureDefaultCredentials();
    const cred = getStoredCredentials();
    if (!cred) return { ok:false, error:"لم تتم تهيئة بيانات الدخول" };

    const inputHash = await sha256(password);
    if (username !== cred.username || inputHash !== cred.hash) {
      return { ok:false, error:"اسم المستخدم أو كلمة المرور غير صحيحة" };
    }

    // إنشاء session token
    const token = (await sha256(username + Date.now() + Math.random())).slice(0, 32);
    const session = { token, username, expiresAt: Date.now() + SESSION_TTL };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    if (remember) {
      const remembered = {
        token, username,
        expiresAt: Date.now() + REMEMBER_TTL
      };
      localStorage.setItem(REMEMBER_KEY, JSON.stringify(remembered));
    }

    return { ok:true, session };
  }

  /* ---------- التحقق من الجلسة ---------- */
  function getSession() {
    // 1) جلسة نشطة في sessionStorage
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      if (s && s.expiresAt > Date.now()) return s;
      if (s) sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}

    // 2) جلسة محفوظة (Remember Me)
    try {
      const r = JSON.parse(localStorage.getItem(REMEMBER_KEY) || "null");
      if (r && r.expiresAt > Date.now()) {
        // تجديد session
        const session = { token:r.token, username:r.username, expiresAt: Date.now() + SESSION_TTL };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      }
      if (r) localStorage.removeItem(REMEMBER_KEY);
    } catch (e) {}

    return null;
  }

  function isAuthenticated() {
    return !!getSession();
  }

  /* ---------- تسجيل الخروج ---------- */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }

  /* ---------- تغيير بيانات الدخول ---------- */
  async function changeCredentials(newUsername, newPassword) {
    const hash = await sha256(newPassword);
    localStorage.setItem(CRED_KEY, JSON.stringify({
      username: newUsername,
      hash: hash,
      updatedAt: Date.now()
    }));
    return true;
  }

  /* ---------- حارس الصفحة (للـ admin) ---------- */
  function requireAuth() {
    if (!isAuthenticated()) {
      // حفظ الصفحة المطلوبة للرجوع إليها بعد الدخول
      sessionStorage.setItem("elashry_auth_redirect", window.location.href);
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  /* تصدير */
  window.Auth = {
    login, logout, getSession, isAuthenticated,
    changeCredentials, requireAuth,
    ensureDefaultCredentials, getStoredCredentials,
    CRED_KEY, SESSION_KEY, REMEMBER_KEY
  };
})();
