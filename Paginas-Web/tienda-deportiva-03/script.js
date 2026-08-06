/* ============================================
   FORJA — Diseño 3 (script-v3.js)
   Menú móvil, filtro de productos, scoreboard
   animado, copiar dirección y validación de
   formulario de contacto.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMenuMovil();
  initFiltroProductos();
  initScoreboard();
  initCopiarDireccion();
  initFormularioContacto();
});

/* ---------- Menú móvil ---------- */
function initMenuMovil() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Filtro de catálogo de productos ---------- */
function initFiltroProductos() {
  const botones = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.producto-card');
  const vacio = document.getElementById('productosVacio');
  if (!botones.length || !cards.length) return;

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('is-active'));
      boton.classList.add('is-active');

      const filtro = boton.dataset.filter;
      let visibles = 0;

      cards.forEach(card => {
        const coincide = filtro === 'todos' || card.dataset.categoria === filtro;
        card.classList.toggle('is-hidden', !coincide);
        if (coincide) {
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
          visibles++;
        }
      });

      if (vacio) vacio.hidden = visibles !== 0;
    });
  });
}

/* ---------- Scoreboard animado (cuenta como un marcador digital) ---------- */
function initScoreboard() {
  const numeros = document.querySelectorAll('.score-number');
  if (!numeros.length) return;

  const animarNumero = (el) => {
    const destino = parseInt(el.dataset.count, 10) || 0;
    const digitos = el.textContent.length;
    const duracion = 1300;
    const inicio = performance.now();

    const paso = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      const valor = Math.floor(facilitado * destino);
      el.textContent = String(valor).padStart(digitos, '0');

      if (progreso < 1) {
        requestAnimationFrame(paso);
      } else {
        el.textContent = String(destino).padStart(digitos, '0');
      }
    };
    requestAnimationFrame(paso);
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarNumero(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.6 });

  numeros.forEach(num => observador.observe(num));
}

/* ---------- Copiar dirección al portapapeles ---------- */
function initCopiarDireccion() {
  const boton = document.getElementById('copiarDireccion');
  const mensaje = document.getElementById('copiadoMsg');
  if (!boton || !mensaje) return;

  const direccion = 'Av. del Deporte 1234, Buenos Aires, Argentina';

  boton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(direccion);
      mensaje.textContent = 'Dirección copiada ✓';
    } catch (error) {
      mensaje.textContent = direccion;
    }
    setTimeout(() => { mensaje.textContent = ''; }, 3500);
  });
}

/* ---------- Validación del formulario de contacto ---------- */
function initFormularioContacto() {
  const form = document.getElementById('contactoForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  const reglas = {
    nombre: (valor) => valor.trim().length >= 2 || 'Ingresá tu nombre.',
    email: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) || 'Ingresá un email válido.',
    mensaje: (valor) => valor.trim().length >= 10 || 'Contanos un poco más (mínimo 10 caracteres).',
  };

  const limpiarError = (campo) => {
    const contenedor = form.querySelector(`[name="${campo}"]`).closest('.form-field');
    const errorEl = form.querySelector(`[data-error-for="${campo}"]`);
    contenedor.classList.remove('has-error');
    errorEl.textContent = '';
  };

  const mostrarError = (campo, mensaje) => {
    const contenedor = form.querySelector(`[name="${campo}"]`).closest('.form-field');
    const errorEl = form.querySelector(`[data-error-for="${campo}"]`);
    contenedor.classList.add('has-error');
    errorEl.textContent = mensaje;
  };

  Object.keys(reglas).forEach(campo => {
    const input = form.querySelector(`[name="${campo}"]`);
    input.addEventListener('input', () => limpiarError(campo));
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    let formularioValido = true;

    Object.entries(reglas).forEach(([campo, validar]) => {
      const input = form.querySelector(`[name="${campo}"]`);
      const resultado = validar(input.value);
      if (resultado !== true) {
        mostrarError(campo, resultado);
        formularioValido = false;
      } else {
        limpiarError(campo);
      }
    });

    if (!formularioValido) {
      status.textContent = 'Revisá los campos marcados en rojo.';
      status.style.color = '#E38187';
      return;
    }

    status.style.color = '';
    status.textContent = 'Enviando...';

    setTimeout(() => {
      status.textContent = '¡Gracias! Te vamos a responder a la brevedad.';
      form.reset();
    }, 700);
  });
}