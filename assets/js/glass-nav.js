/* Enhance the existing links; the original navigation remains usable without JS. */
(() => {
  const header = document.querySelector('.site-header');
  const original = header?.querySelector('.site-nav');
  if (!original) return;
  const mobile = matchMedia('(max-width: 767px)');
  const panel = document.createElement('aside');
  panel.className = 'glass-nav';
  panel.id = 'glass-navigation';
  panel.setAttribute('aria-label', 'ناوبری BJcode');
  const brand = header.querySelector('.brand').cloneNode(true);
  brand.classList.add('glass-brand');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'glass-toggle';
  toggle.setAttribute('aria-controls', panel.id);
  toggle.innerHTML = '<span aria-hidden="true">☰</span>';
  const nav = original.cloneNode(true);
  nav.className = 'glass-links';
  const icons = ['home', 'code', 'briefcase', 'github', 'envelope'];
  nav.querySelectorAll('a').forEach((link, index) => {
    const label = link.textContent.trim();
    link.setAttribute('aria-label', label);
    link.textContent = '';
    const icon = document.createElement('i');
    icon.className = `fa fa-${icons[index] || 'link'}`;
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.className = 'glass-label';
    text.textContent = label;
    const tooltip = document.createElement('span');
    tooltip.className = 'glass-tooltip';
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.textContent = label;
    link.append(icon, text, tooltip);
  });
  const note = document.createElement('span');
  note.className = 'glass-note';
  note.textContent = 'از ایده تا اجرا';
  panel.append(toggle, brand, nav, note);
  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'glass-backdrop';
  backdrop.setAttribute('aria-label', 'بستن منو');
  backdrop.tabIndex = -1;
  backdrop.hidden = true;
  document.body.append(backdrop, panel);
  let expanded = false;
  const update = () => {
    if (mobile.matches) header.querySelector('.header-inner').append(toggle);
    else if (toggle.parentElement !== panel) panel.prepend(toggle);
    panel.inert = mobile.matches && !expanded;
    document.body.classList.toggle('glass-expanded', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'جمع کردن منو' : 'باز کردن منو');
    toggle.querySelector('span').textContent = expanded ? '×' : '☰';
    backdrop.hidden = !mobile.matches || !expanded;
  };
  toggle.addEventListener('click', () => { expanded = !expanded; update(); });
  const close = () => { expanded = false; update(); toggle.focus(); };
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && expanded) close();
  });
  document.addEventListener('click', event => {
    if (expanded && !mobile.matches && !panel.contains(event.target) && !toggle.contains(event.target)) {
      expanded = false; update();
    }
  });
  mobile.addEventListener('change', () => { expanded = false; update(); });
  document.body.classList.add('glass-ready');
  update();
})();
