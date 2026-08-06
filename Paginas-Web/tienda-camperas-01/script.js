// ============================================
// NORTE — script principal
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

  /* ---------- guía de temperatura ---------- */
  const tempSlider = document.getElementById('tempSlider');
  const tempValue = document.getElementById('tempValue');
  const guiaResult = document.getElementById('guiaResult');
  const cards = document.querySelectorAll('.product-card[data-min]');

  function actualizarGuia() {
    const temp = Number(tempSlider.value);
    tempValue.textContent = `${temp}°C`;

    const coincidencias = [];

    cards.forEach(card => {
      const min = Number(card.dataset.min);
      const max = Number(card.dataset.max);
      const coincide = temp >= min && temp <= max;

      card.classList.toggle('is-match', coincide);
      card.classList.toggle('is-dim', !coincide);

      if (coincide) {
        const nombre = card.querySelector('h3').textContent;
        coincidencias.push(nombre);
      }
    });

    if (coincidencias.length) {
      guiaResult.innerHTML = `Para ${temp}°C te recomendamos: <strong>${coincidencias.join(', ')}</strong>`;
    } else {
      guiaResult.textContent = `No tenemos un modelo exacto para ${temp}°C. Elegí la campera más cercana y ajustá con capas debajo.`;
    }
  }

  if (tempSlider && cards.length) {
    tempSlider.addEventListener('input', actualizarGuia);
    actualizarGuia();
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
        formNote.style.color = '#dd6b35';
        return;
      }

      const partes = [
        `Hola NORTE, quiero hacer una consulta.`,
        `Nombre: ${nombre}`,
        `Teléfono: ${telefono}`,
        `Modelo: ${producto}`,
      ];
      if (talle) partes.push(`Talle: ${talle}`);
      if (mensaje) partes.push(`Mensaje: ${mensaje}`);

      const texto = encodeURIComponent(partes.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

      formNote.textContent = 'Te estamos redirigiendo a WhatsApp…';
      formNote.style.color = '#7ec8d8';

      window.open(url, '_blank', 'noopener');
      orderForm.reset();
    });
  }

  /* ---------- header: sombra sutil al scrollear ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8
        ? '0 8px 24px -20px rgba(0,0,0,.6)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});