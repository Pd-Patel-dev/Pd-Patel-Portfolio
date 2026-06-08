/**
 * Contact panel — copy email, hint feedback
 */
(function () {
  const emailLink = document.querySelector('.contact-channel[data-contact="email"]');
  const hint = document.getElementById('contact-hint');
  const location = document.getElementById('location-card');

  if (emailLink) {
    emailLink.addEventListener('click', async (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();

      const email = 'pd.dev267@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        emailLink.classList.add('is-copied');
        const icon = emailLink.querySelector('.contact-channel-action i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
        }
        if (hint) {
          hint.textContent = 'Email copied to clipboard';
        }
        setTimeout(() => {
          emailLink.classList.remove('is-copied');
          if (icon) {
            icon.className = 'fa-solid fa-copy';
          }
          if (hint) {
            hint.textContent = 'Tap email to copy · links open in a new tab';
          }
        }, 2200);
      } catch {
        /* mailto still opens */
      }
    });
  }

  if (location) {
    location.addEventListener('click', (e) => e.preventDefault());
  }
})();
