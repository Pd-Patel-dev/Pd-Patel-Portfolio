/**
 * 3D tilt + shine for all .card-scene > .card-3d elements
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 1024px)').matches;
  if (reduced || coarse || narrow) return;

  const MAX_TILT = 14;

  function bindTilt(scene) {
    if (scene.id === 'portrait-scene' || scene.classList.contains('portrait-stage')) return;
    if (scene.dataset.tiltBound === '1') return;
    const card = scene.querySelector('.card-3d');
    if (!card) return;
    scene.dataset.tiltBound = '1';

    const shine = card.querySelector('.card-3d-shine');

    scene.addEventListener('mousemove', (e) => {
      const rect = scene.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 2 - 1;
      const py = (y / rect.height) * 2 - 1;
      const rotateY = px * MAX_TILT;
      const rotateX = -py * MAX_TILT;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;

      if (shine) {
        const mx = (x / rect.width) * 100;
        const my = (y / rect.height) * 100;
        shine.style.setProperty('--mx', mx + '%');
        shine.style.setProperty('--my', my + '%');
      }
    });

    scene.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
      if (shine) {
        shine.style.setProperty('--mx', '50%');
        shine.style.setProperty('--my', '30%');
      }
    });
  }

  document.querySelectorAll('.card-scene').forEach(bindTilt);
})();
