/**
 * Staggered reveals, nav scroll, skill badge cascade
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const heroStack = document.getElementById('hero-stack');
  if (heroStack) {
    heroStack.querySelectorAll('span').forEach((el, i) => {
      el.style.setProperty('--i', String(i));
    });
  }

  document.querySelectorAll('.section-flourish.reveal').forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
  });

  /* Skill badge cascade handled in skills-stack.js */
})();
