/* Pointer-only decoration: no layout reads while the pointer moves. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.home-service, .service-card, .resume-skill-card').forEach((card) => {
    let bounds;
    card.addEventListener('pointerenter', () => {
      bounds = card.getBoundingClientRect();
    });
    card.addEventListener('pointermove', (event) => {
      if (motion.matches || !pointer.matches || !bounds) return;
      card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    });
  });
})();
