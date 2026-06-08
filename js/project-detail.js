/**
 * Project case study — tabs, pipeline, metric bars, scroll reveal
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tabs */
  const tabs = document.querySelectorAll('.detail-tab');
  const panels = document.querySelectorAll('.detail-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      panels.forEach((p) => {
        const match = p.id === target;
        p.classList.toggle('active', match);
        p.hidden = !match;
      });
    });
  });

  /* Pipeline steps */
  const pipelineSteps = document.querySelectorAll('.pipeline-step');
  const pipelineDetail = document.getElementById('pipeline-detail-text');

  if (pipelineSteps.length && pipelineDetail) {
    pipelineSteps.forEach((step) => {
      step.addEventListener('click', () => {
        pipelineSteps.forEach((s) => s.classList.remove('active'));
        step.classList.add('active');
        pipelineDetail.textContent = step.dataset.detail || '';
      });
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.detail-reveal, .quick-stat, .metric-row');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* Quick stat counters */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (reduced || Number.isNaN(target)) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.floor(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  });

  /* Sidebar nav → switch tabs */
  document.querySelectorAll('.sidebar-nav a[data-panel]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.panel;
      const tab = document.querySelector(`.detail-tab[data-panel="${id}"]`);
      if (tab) tab.click();
    });
  });

  /* Navbar scroll */
  const nav = document.querySelector('.navbar');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
