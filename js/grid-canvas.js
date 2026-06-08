/**
 * Perspective-style grid on canvas — crisp lines, radial fade, major/minor cells
 */
(function () {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const CELL = 56;
  const MAJOR_EVERY = 4;

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const offsetX = ((w % CELL) / 2) | 0;
    const offsetY = ((h % CELL) / 2) | 0;

    /* Minor vertical lines */
    for (let x = offsetX, i = 0; x <= w + CELL; x += CELL, i++) {
      const major = i % MAJOR_EVERY === 0;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.strokeStyle = major
        ? 'rgba(148, 163, 184, 0.09)'
        : 'rgba(148, 163, 184, 0.035)';
      ctx.lineWidth = major ? 1 : 1;
      ctx.stroke();
    }

    /* Minor horizontal lines */
    for (let y = offsetY, j = 0; y <= h + CELL; y += CELL, j++) {
      const major = j % MAJOR_EVERY === 0;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.strokeStyle = major
        ? 'rgba(148, 163, 184, 0.09)'
        : 'rgba(148, 163, 184, 0.035)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* Intersection nodes — major crossings only */
    for (let x = offsetX, i = 0; x <= w + CELL; x += CELL, i++) {
      if (i % MAJOR_EVERY !== 0) continue;
      for (let y = offsetY, j = 0; y <= h + CELL; y += CELL, j++) {
        if (j % MAJOR_EVERY !== 0) continue;
        const gx = x;
        const gy = y;
        const dist = Math.hypot(gx - w / 2, gy - h * 0.38);
        const maxDist = Math.max(w, h) * 0.65;
        const fade = Math.max(0, 1 - dist / maxDist);
        if (fade < 0.08) continue;

        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.12 * fade})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.04 * fade})`;
        ctx.fill();
      }
    }

    /* Center glow — violet/cyan only */
    const glow = ctx.createRadialGradient(w / 2, h * 0.32, 0, w / 2, h * 0.32, Math.max(w, h) * 0.55);
    glow.addColorStop(0, 'rgba(139, 92, 246, 0.06)');
    glow.addColorStop(0.35, 'rgba(56, 189, 248, 0.03)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    /* Vignette — fades grid at edges */
    const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.72);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(0.55, 'transparent');
    vignette.addColorStop(1, 'rgba(4, 4, 10, 0.92)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  draw();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 120);
  });
})();
