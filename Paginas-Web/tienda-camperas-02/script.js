// ============================================
// CRUDO — script principal
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- año en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- animación al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- formulario de consulta -> WhatsApp ---------- */
  const orderForm = document.getElementById('orderForm');
  const formNote = document.getElementById('formNote');
  const WHATSAPP_NUMBER = '5491100000000'; // reemplazar por el número real, con código de país sin "+"

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = orderForm.nombre.value.trim();
      const telefono = orderForm.telefono.value.trim();
      const producto = orderForm.producto.value;
      const talle = orderForm.talle.value;
      const mensaje = orderForm.mensaje.value.trim();

      if (!nombre || !telefono || !producto) {
        formNote.textContent = 'Por favor completá nombre, teléfono y modelo.';
        formNote.style.color = '#c1392b';
        return;
      }

      const partes = [
        `Hola CRUDO, quiero hacer una consulta.`,
        `Nombre: ${nombre}`,
        `Teléfono: ${telefono}`,
        `Modelo: ${producto}`,
      ];
      if (talle) partes.push(`Talle: ${talle}`);
      if (mensaje) partes.push(`Mensaje: ${mensaje}`);

      const texto = encodeURIComponent(partes.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

      formNote.textContent = 'Te estamos redirigiendo a WhatsApp…';
      formNote.style.color = '#2e4fa6';

      window.open(url, '_blank', 'noopener');
      orderForm.reset();
    });
  }

});