/**
 * Cursor spotlight + section in-view rail
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (!reduced && !coarse) {
    const spot = document.createElement('div');
    spot.className = 'spotlight';
    spot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spot);

    let active = false;
    document.addEventListener(
      'mousemove',
      (e) => {
        if (!active) {
          spot.classList.add('active');
          active = true;
        }
        spot.style.setProperty('--spot-x', e.clientX + 'px');
        spot.style.setProperty('--spot-y', e.clientY + 'px');
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => spot.classList.remove('active'));
  }

  const sections = document.querySelectorAll('section[id]:not(#hero)');
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: '-10% 0px -55% 0px' }
  );

  sections.forEach((s) => io.observe(s));
})();
