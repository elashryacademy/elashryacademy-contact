/* ============================================================
   El Ashry Academy - Particles Background
   ============================================================
   Particles خفيفة على Canvas، بتتوقف تلقائيًا لو:
   - prefers-reduced-motion
   - أو مستوى الأنيميشن "reduced" / "off"
   ============================================================ */
(function () {
  "use strict";

  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // تحقق من مستوى الأنيميشن
    const animLevel = document.documentElement.getAttribute("data-anim");
    if (animLevel === "off" || animLevel === "reduced") {
      canvas.style.display = "none";
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    let w, h, particles, rafId;
    const PARTICLE_COUNT = window.innerWidth < 640 ? 25 : 50;
    const MAX_SPEED = 0.4;

    function resize() {
      w = canvas.width = window.innerWidth * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function readColor() {
      // قراءة --particles-color من :root
      const c = getComputedStyle(document.documentElement).getPropertyValue("--particles-color").trim();
      return c || "rgba(255,186,0,0.5)";
    }

    function makeParticles() {
      const arr = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.2 + 0.6,
          vx: (Math.random() - 0.5) * MAX_SPEED,
          vy: (Math.random() - 0.5) * MAX_SPEED,
          a: Math.random() * 0.6 + 0.2
        });
      }
      return arr;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const color = readColor();
      // استخراج rgba الأساسي
      const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);
      let base = "255, 186, 0";
      if (rgbaMatch) {
        const parts = rgbaMatch[1].split(",").map(s => s.trim());
        base = `${parts[0]}, ${parts[1]}, ${parts[2]}`;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${base}, ${p.a})`;
        ctx.fill();
      }

      // وصل الجسيمات القريبة بخطوط رفيعة
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120 * window.devicePixelRatio;
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${base}, ${0.15 * (1 - dist / maxDist)})`;
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
      resizeTimer = setTimeout(() => { resize(); particles = makeParticles(); }, 200);
    });

    // إيقاف عند التبديل للـ off (عبر event)
    window.addEventListener("themechange", () => {
      // إعادة قراءة اللون فقط — ما نوقفش الأنيميشن
    });

    // إيقاف عند الإخفاء (توفير للأداء)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        draw();
      }
    });

    start();
  }

  // شغّل بعد تحميل DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParticles);
  } else {
    initParticles();
  }
})();
