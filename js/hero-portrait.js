/**
 * Hero portrait — 3D tilt, parallax layers, float (single image)
 */
(function () {
  const img = document.getElementById('hero-portrait-img');
  const depth = document.getElementById('portrait-depth');
  const stage = document.getElementById('portrait-scene');
  const aurora = document.querySelector('.portrait-aurora');
  const shadowFloor = document.querySelector('.portrait-shadow-floor');
  const portrait = document.getElementById('hero-portrait');
  const col = document.getElementById('hero-portrait-wrap');

  if (!img || !depth) return;

  const CUTOUT = 'assets/profile-cutout.png';
  const PLACEHOLDER = 'assets/profile-placeholder.svg';

  img.addEventListener('error', () => {
    if (!img.src.includes(CUTOUT)) {
      img.src = CUTOUT;
    } else if (!img.src.includes('profile-placeholder')) {
      img.src = PLACEHOLDER;
    }
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 900px)').matches;

  const MAX_TILT = narrow ? 7 : 16;

  function setTilt(px, py) {
    depth.style.setProperty('--tilt-x', -py * MAX_TILT + 'deg');
    depth.style.setProperty('--tilt-y', px * MAX_TILT + 'deg');

    if (stage) {
      stage.style.setProperty('--img-lift', -py * 12 + 'px');
      stage.style.setProperty('--img-shift-x', px * 10 + 'px');
      stage.style.setProperty('--img-tilt-x', -py * 5 + 'deg');
      stage.style.setProperty('--img-tilt-y', px * 5 + 'deg');
    }

    if (aurora) {
      aurora.style.setProperty('--aura-x', px * 22 + 'px');
      aurora.style.setProperty('--aura-y', py * 18 + 'px');
    }

    if (shadowFloor) {
      shadowFloor.style.setProperty('--shadow-x', px * 16 + 'px');
      shadowFloor.style.setProperty('--shadow-scale', 1 + Math.abs(px) * 0.12);
    }
  }

  function resetTilt() {
    depth.style.setProperty('--tilt-x', '0deg');
    depth.style.setProperty('--tilt-y', '0deg');
    if (stage) {
      stage.style.setProperty('--img-lift', '0px');
      stage.style.setProperty('--img-shift-x', '0');
      stage.style.setProperty('--img-tilt-x', '0deg');
      stage.style.setProperty('--img-tilt-y', '0deg');
    }
    if (aurora) {
      aurora.style.setProperty('--aura-x', '0');
      aurora.style.setProperty('--aura-y', '0');
    }
    if (shadowFloor) {
      shadowFloor.style.setProperty('--shadow-x', '0');
      shadowFloor.style.setProperty('--shadow-scale', '1');
    }
  }

  if (!reduced && !coarse && col) {
    col.addEventListener('mousemove', (e) => {
      const rect = col.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setTilt(px, py);
    });

    col.addEventListener('mouseleave', resetTilt);
  }

  if (!reduced && portrait) {
    let t = 0;
    function floatTick() {
      t += 0.014;
      portrait.style.setProperty('--float-y', Math.sin(t) * 7 + 'px');
      requestAnimationFrame(floatTick);
    }
    requestAnimationFrame(floatTick);
  }
})();
