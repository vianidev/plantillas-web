/* ==========================================================================
   AURELIA — script.js
   Header al hacer scroll, menú mobile, filtro de colección,
   carrusel de testimonios, revelado en scroll, validación de contacto.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header sólido al hacer scroll ---------- */
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Menú mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Revelado suave al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Filtro de la colección ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const gridEmpty = document.getElementById('gridEmpty');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      productCards.forEach(card => {
        const match = filter === 'todos' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
        if (match) visibleCount++;
      });

      gridEmpty.hidden = visibleCount !== 0;
    });
  });

  /* ---------- Carrusel de testimonios ---------- */
  const slides = Array.from(document.querySelectorAll('.t-slide'));
  const dotsWrap = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  let current = 0;
  let autoplayId = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function restartAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = setInterval(() => goToSlide(current + 1), 6000);
  }

  prevBtn.addEventListener('click', () => { goToSlide(current - 1); restartAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(current + 1); restartAutoplay(); });

  restartAutoplay();

  /* ---------- Validación del formulario de contacto ---------- */
  const form = document.getElementById('contactForm');
  const submitLabel = document.getElementById('submitLabel');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Contanos tu nombre.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Ingresá un email válido.',
    message: (v) => v.trim().length >= 10 || 'Contanos un poco más (mínimo 10 caracteres).',
  };

  function validateField(field) {
    const input = form.elements[field];
    const row = input.closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    const result = validators[field](input.value);

    if (result === true) {
      row.classList.remove('has-error');
      errorEl.textContent = '';
      return true;
    } else {
      row.classList.add('has-error');
      errorEl.textContent = result;
      return false;
    }
  }

  Object.keys(validators).forEach(field => {
    form.elements[field].addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(validators).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) return;

    submitLabel.textContent = 'Enviando…';
    form.querySelector('button[type="submit"]').disabled = true;

    // Simulación de envío: en un sitio real este bloque llamaría a un backend
    // o servicio de formularios (por ejemplo, un endpoint propio o Formspree).
    setTimeout(() => {
      form.reset();
      form.querySelectorAll('.form-row').forEach(row => row.classList.remove('has-error'));
      submitLabel.textContent = 'Enviar mensaje';
      form.querySelector('button[type="submit"]').disabled = false;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 900);
  });

});