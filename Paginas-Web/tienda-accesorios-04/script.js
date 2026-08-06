// ============================================
// NÍTIDO — script principal
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
      navToggle.classList.toggle('is-active', isOpen);
    });

    // cerrar el menú al tocar un link (mobile)
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
    // navegadores sin soporte: mostrar todo directamente
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- formulario de pedido -> WhatsApp ---------- */
  const orderForm = document.getElementById('orderForm');
  const formNote = document.getElementById('formNote');
  const WHATSAPP_NUMBER = '5491100000000'; // reemplazar por el número real, con código de país sin "+"

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = orderForm.nombre.value.trim();
      const telefono = orderForm.telefono.value.trim();
      const producto = orderForm.producto.value;
      const mensaje = orderForm.mensaje.value.trim();

      if (!nombre || !telefono || !producto) {
        formNote.textContent = 'Por favor completá nombre, teléfono y producto.';
        formNote.style.color = '#e8632c';
        return;
      }

      const partes = [
        `Hola NÍTIDO, quiero hacer un pedido.`,
        `Nombre: ${nombre}`,
        `Teléfono: ${telefono}`,
        `Producto: ${producto}`,
      ];
      if (mensaje) partes.push(`Mensaje: ${mensaje}`);

      const texto = encodeURIComponent(partes.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

      formNote.textContent = 'Te estamos redirigiendo a WhatsApp…';
      formNote.style.color = '#17423b';

      window.open(url, '_blank', 'noopener');
      orderForm.reset();
    });
  }

  /* ---------- header: sombra sutil al scrollear ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8
        ? '0 8px 24px -20px rgba(15,46,41,.6)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});