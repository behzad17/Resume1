/* Progressive enhancement: content stays visible without animation support. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const activeAnimations = new Set();
  const cards = document.querySelectorAll('.home-service, .service-card, .resume-skill-card, .featured-project, .project-card');
  const reset = (card) => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
    card.classList.remove('pointer-active');
  };
  cards.forEach((card) => {
    let bounds;
    card.addEventListener('pointerenter', () => { bounds = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', (event) => {
      if (motion.matches || !pointer.matches || !bounds) return;
      const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      card.style.setProperty('--spot-x', `${x}px`);
      card.style.setProperty('--spot-y', `${y}px`);
      card.style.setProperty('--tilt-x', `${(0.5 - y / bounds.height) * 6}deg`);
      card.style.setProperty('--tilt-y', `${(x / bounds.width - 0.5) * 6}deg`);
      card.classList.add('pointer-active');
    });
    card.addEventListener('pointerleave', () => reset(card));
    card.addEventListener('pointercancel', () => reset(card));
  });

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(({target, isIntersecting}) => {
        if (!isIntersecting) return;
        reveal.unobserve(target);
        if (motion.matches || typeof target.animate !== 'function') return;
        const animation = target.animate([
          {opacity: 0.35, transform: 'translateY(22px)'},
          {opacity: 1, transform: 'translateY(0)'}
        ], {duration: 580, easing: 'cubic-bezier(.2,.7,.2,1)'});
        activeAnimations.add(animation);
        animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
      });
    }, {threshold: 0.08});
    document.querySelectorAll('.section-top, .home-service, .featured-project, .service-card, .project-card, .process-layout, .home-contact-layout').forEach((item) => reveal.observe(item));
    const hero = document.querySelector('.hero');
    if (hero) {
      const visibility = new IntersectionObserver(([entry]) => hero.classList.toggle('hero-in-view', entry.isIntersecting));
      visibility.observe(hero);
    }
  }
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    cards.forEach(reset);
    activeAnimations.forEach((animation) => animation.cancel());
    activeAnimations.clear();
  });
  pointer.addEventListener('change', () => cards.forEach(reset));
})();
