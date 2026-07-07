/**
 * ============================================================
 *  El Ashry Academy — Particles Background
 * ============================================================
 *  Particles خفيفة على Canvas. بتتوقف تلقائيًا لو:
 *    - prefers-reduced-motion
 *    - data-anim = reduced | off
 *    - particlesEnabled = false في الإعدادات
 * ============================================================ */
(function () {
  "use strict";

  function init() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;

    // تحقق من الإعدادات
    const animLevel = document.documentElement.getAttribute("data-anim");
    if (animLevel === "off" || animLevel === "reduced") {
      canvas.style.display = "none";
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }
    // التحقق من إعداد الموقع
    if (window.ConfigManager) {
      const cfg = window.ConfigManager.get();
      if (cfg.theme && cfg.theme.particlesEnabled === false) {
        canvas.style.display = "none";
        return;
      }
    }

    const ctx = canvas.getContext("2d");
    let w, h, particles, rafId;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const COUNT = window.innerWidth < 640 ? 22 : 38;
    const MAX_SPEED = 0.3;

    function resize() {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function readColor() {
      const c = getComputedStyle(document.documentElement)
        .getPropertyValue("--particle-color").trim();
      return c || "rgba(255,191,0,0.55)";
    }

    function makeParticles() {
      const arr = [];
      for (let i = 0; i < COUNT; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1.8 + 0.5) * DPR,
          vx: (Math.random() - 0.5) * MAX_SPEED,
          vy: (Math.random() - 0.5) * MAX_SPEED,
          a: Math.random() * 0.5 + 0.2
        });
      }
      return arr;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const color = readColor();
      const m = color.match(/rgba?\(([^)]+)\)/);
      let base = "255, 191, 0";
      if (m) {
        const p = m[1].split(",").map(s => s.trim());
        base = `${p[0]}, ${p[1]}, ${p[2]}`;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${base}, ${p.a})`;
        ctx.fill();
      }

      // وصل الجسيمات القريبة
      const maxDist = 110 * DPR;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${base}, ${0.12 * (1 - d / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      particles = makeParticles();
      if (rafId) cancelAnimationFrame(rafId);
      draw();
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        particles = makeParticles();
      }, 200);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        draw();
      }
    });

    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
