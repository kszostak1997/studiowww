/* shared.js – language toggle, mobile menu, active nav link */

(function () {
  /* ── language ─────────────────────────────────────────── */
  const STORAGE_KEY = 'sw_lang';

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    ['pl', 'en'].forEach(l => {
      document.getElementById('btn-' + l)?.classList.toggle('active', l === lang);
      document.getElementById('btn-' + l + '-m')?.classList.toggle('active', l === lang);
    });

    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    });

    document.querySelectorAll('[data-' + lang + '-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute('data-' + lang + '-placeholder');
    });
  }

  function initLang() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'pl';
    setLang(saved);
  }

  /* ── mobile menu ──────────────────────────────────────── */
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    document.getElementById('hamburger')?.classList.toggle('open', menuOpen);
    document.getElementById('mobile-menu')?.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    menuOpen = false;
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('mobile-menu')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── active nav link ──────────────────────────────────── */
  function markActive() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('[data-nav-path]').forEach(a => {
      const target = a.getAttribute('data-nav-path').replace(/\/$/, '') || '/';
      a.classList.toggle('active', path === target);
    });
  }

  /* ── contact form ─────────────────────────────────────── */
  function submitForm() {
    const lang = localStorage.getItem(STORAGE_KEY) || 'pl';
    const name    = document.getElementById('f-name')?.value.trim();
    const email   = document.getElementById('f-email')?.value.trim();
    const service = document.getElementById('f-service')?.value;
    const message = document.getElementById('f-message')?.value.trim();
    const errEl   = document.getElementById('form-error');
    if (errEl) errEl.style.display = 'none';

    const errors = {
      pl: { name:'Wpisz imię i nazwisko.', email:'Wpisz poprawny adres e-mail.', service:'Wybierz usługę.', message:'Wpisz wiadomość.' },
      en: { name:'Please enter your name.', email:'Please enter a valid email.', service:'Please select a service.', message:'Please enter a message.' }
    };
    const t = errors[lang];
    if (!name)                          { showErr(t.name); return; }
    if (!email || !email.includes('@')) { showErr(t.email); return; }
    if (!service)                       { showErr(t.service); return; }
    if (!message)                       { showErr(t.message); return; }

    const fields  = document.getElementById('form-fields');
    const success = document.getElementById('form-success');
    if (fields)  fields.style.display  = 'none';
    if (success) success.style.display = 'block';
    setLang(lang); // re-apply translations to success block
  }

  function showErr(msg) {
    const el = document.getElementById('form-error');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  /* ── portfolio filter ─────────────────────────────────── */
  function filterPortfolio(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  }

  /* ── expose globals ───────────────────────────────────── */
  window.setLang        = setLang;
  window.toggleMenu     = toggleMenu;
  window.closeMenu      = closeMenu;
  window.submitForm     = submitForm;
  window.filterPortfolio = filterPortfolio;

  /* ── init ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLang();
    markActive();
  });
})();
