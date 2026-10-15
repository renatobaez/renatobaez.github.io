'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
const progress = document.querySelector('.scroll-progress');
let scrollPending = false;
function updateProgress() { const distance = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${distance > 0 ? scrollY / distance * 100 : 0}%`; scrollPending = false; }
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress); updateProgress();
if ('IntersectionObserver' in window) {
  const sections = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) nav.querySelectorAll('a').forEach(a => { const active = a.hash === '#' + entry.target.id; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  }), { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(s => sections.observe(s));
}
const projectCards = [...document.querySelectorAll('.project-card')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  projectCards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) { count++; card.classList.add('visible'); } });
  document.querySelector('#filter-status').textContent = `${count} proyectos visibles`;
}));
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#dialog-title').textContent = button.dataset.title;
  const img = document.querySelector('#dialog-image'); img.src = button.dataset.image; img.alt = `Vista ampliada de ${button.dataset.title}`;
  dialog.showModal(); document.body.style.overflow = 'hidden';
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('rbaezlobos@gmail.com'); status.textContent = 'Email copiado.'; }
  catch { status.textContent = 'Puedes copiarlo aquí: rbaezlobos@gmail.com'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
