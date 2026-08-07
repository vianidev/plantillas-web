/* ===========================================================
   CAJA — script.js
   -----------------------------------------------------------
   EDITAR PRODUCTOS ACÁ:
   Cada objeto del array PRODUCTOS es una zapatilla del catálogo.
   Campos:
     nombre      -> nombre del producto
     categoria   -> "urbanas" | "running" | "basketball" | "skate"
                    (tiene que coincidir con data-filtro del HTML)
     precio      -> número, se formatea solo
     descripcion -> texto corto
     talles      -> texto corto del rango disponible, ej: "US 6 – 12"
     imagenAlt   -> texto del placeholder de imagen (usalo como "alt"
                    cuando insertes la foto real)
   Para agregar una zapatilla nueva, copiá un bloque { ... } y
   pegalo dentro del array, con una coma después del anterior.
   =========================================================== */

const PRODUCTOS = [
  {
    nombre: "Street Low Canvas",
    categoria: "urbanas",
    precio: 42900,
    descripcion: "Lona resistente, suela de goma vulcanizada, uso diario.",
    talles: "US 5 – 11",
    imagenAlt: "Zapatilla urbana baja de lona color blanco"
  },
  {
    nombre: "Street Retro 88",
    categoria: "urbanas",
    precio: 54900,
    descripcion: "Cuero sintético, diseño retro, entresuela amortiguada.",
    talles: "US 5 – 12",
    imagenAlt: "Zapatilla urbana retro color crema y azul"
  },
  {
    nombre: "Runner Aire 90",
    categoria: "running",
    precio: 68900,
    descripcion: "Amortiguación de aire, malla transpirable, drop bajo.",
    talles: "US 6 – 13",
    imagenAlt: "Zapatilla de running color negro y volt"
  },
  {
    nombre: "Runner Pulso",
    categoria: "running",
    precio: 61900,
    descripcion: "Espuma liviana, suela con tacos para asfalto y tierra.",
    talles: "US 6 – 12",
    imagenAlt: "Zapatilla de running color gris y naranja"
  },
  {
    nombre: "Court Classic High",
    categoria: "basketball",
    precio: 74900,
    descripcion: "Caña alta, sujeción de tobillo, suela con agarre en cancha.",
    talles: "US 7 – 13",
    imagenAlt: "Zapatilla de basketball caña alta color blanco y rojo"
  },
  {
    nombre: "Court Flight Low",
    categoria: "basketball",
    precio: 69900,
    descripcion: "Caña baja, amortiguación reactiva, para juego rápido.",
    talles: "US 7 – 13",
    imagenAlt: "Zapatilla de basketball caña baja color negro"
  },
  {
    nombre: "Skate Vulcan",
    categoria: "skate",
    precio: 47900,
    descripcion: "Suela vulcanizada, buen tacto de tabla, refuerzo en punta.",
    talles: "US 6 – 12",
    imagenAlt: "Zapatilla de skate color negro con detalles blancos"
  },
  {
    nombre: "Skate Pro Grip",
    categoria: "skate",
    precio: 52900,
    descripcion: "Suela cupsole con mayor agarre, lengüeta acolchada.",
    talles: "US 6 – 12",
    imagenAlt: "Zapatilla de skate color gris oscuro"
  }
];

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(valor);

const NOMBRES_CATEGORIA = {
  urbanas: "Urbana",
  running: "Running",
  basketball: "Basketball",
  skate: "Skate"
};

/* ---------- Render de productos ---------- */
function crearTarjetaProducto(producto, index) {
  const card = document.createElement("article");
  card.className = "producto-card";
  card.dataset.categoria = producto.categoria;
  card.style.animationDelay = `${(index % 8) * 60}ms`;

  card.innerHTML = `
    <div class="producto-media">
      <div class="img-placeholder">
        <span>Foto: ${producto.imagenAlt}</span>
      </div>
      <span class="producto-tag">${NOMBRES_CATEGORIA[producto.categoria] || producto.categoria}</span>
      <span class="producto-talles">${producto.talles}</span>
    </div>
    <div class="producto-info">
      <h3 class="producto-nombre">${producto.nombre}</h3>
      <p class="producto-desc">${producto.descripcion}</p>
      <div class="producto-footer">
        <span class="producto-precio">${formatearPrecio(producto.precio)}</span>
        <a href="#contacto" class="producto-cta">Consultar</a>
      </div>
    </div>
  `;
  return card;
}

function renderProductos(filtro = "todo") {
  const grid = document.getElementById("productosGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const lista = filtro === "todo"
    ? PRODUCTOS
    : PRODUCTOS.filter((p) => p.categoria === filtro);

  if (lista.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "sin-resultados";
    aviso.textContent = "No hay zapatillas en esta categoría todavía.";
    grid.appendChild(aviso);
    return;
  }

  lista.forEach((producto, i) => {
    grid.appendChild(crearTarjetaProducto(producto, i));
  });
}

/* ---------- Filtros de categoría ---------- */
function initFiltros() {
  const filtros = document.getElementById("filtros");
  if (!filtros) return;

  filtros.addEventListener("click", (e) => {
    const btn = e.target.closest(".filtro-btn");
    if (!btn) return;

    filtros.querySelectorAll(".filtro-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    renderProductos(btn.dataset.filtro);
  });
}

/* ---------- Buscador de talle (conversor CM / US / UK / EU) ----------
   Tablas de referencia aproximadas. Podés reemplazarlas por tu
   propia tabla de talles si tu proveedor usa otra numeración. */
const TALLES = {
  hombre: [
    { cm: 23.0, us: "5",    uk: "4.5",  eu: "37"   },
    { cm: 23.5, us: "5.5",  uk: "5",    eu: "37.5" },
    { cm: 24.0, us: "6",    uk: "5.5",  eu: "38"   },
    { cm: 24.5, us: "6.5",  uk: "6",    eu: "39"   },
    { cm: 25.0, us: "7",    uk: "6.5",  eu: "40"   },
    { cm: 25.5, us: "7.5",  uk: "7",    eu: "40.5" },
    { cm: 26.0, us: "8",    uk: "7.5",  eu: "41"   },
    { cm: 26.5, us: "8.5",  uk: "8",    eu: "42"   },
    { cm: 27.0, us: "9",    uk: "8.5",  eu: "42.5" },
    { cm: 27.5, us: "9.5",  uk: "9",    eu: "43"   },
    { cm: 28.0, us: "10",   uk: "9.5",  eu: "44"   },
    { cm: 28.5, us: "10.5", uk: "10",   eu: "44.5" },
    { cm: 29.0, us: "11",   uk: "10.5", eu: "45"   },
    { cm: 29.5, us: "11.5", uk: "11",   eu: "45.5" },
    { cm: 30.0, us: "12",   uk: "11.5", eu: "46"   }
  ],
  mujer: [
    { cm: 21.5, us: "5",    uk: "3",   eu: "35.5" },
    { cm: 22.0, us: "5.5",  uk: "3.5", eu: "36"   },
    { cm: 22.5, us: "6",    uk: "4",   eu: "36.5" },
    { cm: 23.0, us: "6.5",  uk: "4.5", eu: "37"   },
    { cm: 23.5, us: "7",    uk: "5",   eu: "37.5" },
    { cm: 24.0, us: "7.5",  uk: "5.5", eu: "38"   },
    { cm: 24.5, us: "8",    uk: "6",   eu: "38.5" },
    { cm: 25.0, us: "8.5",  uk: "6.5", eu: "39"   },
    { cm: 25.5, us: "9",    uk: "7",   eu: "40"   },
    { cm: 26.0, us: "9.5",  uk: "7.5", eu: "40.5" },
    { cm: 26.5, us: "10",   uk: "8",   eu: "41"   },
    { cm: 27.0, us: "10.5", uk: "8.5", eu: "42"   }
  ],
  ninos: [
    { cm: 15.0, us: "8",   uk: "7",   eu: "24"   },
    { cm: 15.5, us: "8.5", uk: "7.5", eu: "25"   },
    { cm: 16.0, us: "9",   uk: "8",   eu: "25.5" },
    { cm: 16.5, us: "9.5", uk: "8.5", eu: "26"   },
    { cm: 17.0, us: "10",  uk: "9",   eu: "27"   },
    { cm: 17.5, us: "10.5",uk: "9.5", eu: "28"   },
    { cm: 18.0, us: "11",  uk: "10",  eu: "28.5" },
    { cm: 18.5, us: "11.5",uk: "10.5",eu: "29"   },
    { cm: 19.0, us: "12",  uk: "11",  eu: "30"   },
    { cm: 19.5, us: "12.5",uk: "11.5",eu: "31"   },
    { cm: 20.0, us: "13",  uk: "12",  eu: "31.5" },
    { cm: 20.5, us: "1",   uk: "13",  eu: "32"   },
    { cm: 21.0, us: "1.5", uk: "13.5",eu: "33"   },
    { cm: 21.5, us: "2",   uk: "1",   eu: "33.5" }
  ]
};

function initBuscadorTalle() {
  const tabs = document.getElementById("tallesTabs");
  const slider = document.getElementById("tallesSlider");
  const cmEl = document.getElementById("tallesCm");
  const usEl = document.getElementById("tallesUs");
  const ukEl = document.getElementById("tallesUk");
  const euEl = document.getElementById("tallesEu");
  if (!tabs || !slider) return;

  let grupoActual = "hombre";

  const actualizar = () => {
    const tabla = TALLES[grupoActual];
    slider.max = tabla.length - 1;
    if (Number(slider.value) > tabla.length - 1) slider.value = Math.floor(tabla.length / 2);

    const fila = tabla[Number(slider.value)];
    cmEl.textContent = fila.cm.toFixed(1);
    usEl.textContent = fila.us;
    ukEl.textContent = fila.uk;
    euEl.textContent = fila.eu;
  };

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".talles-tab");
    if (!btn) return;

    tabs.querySelectorAll(".talles-tab").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    grupoActual = btn.dataset.grupo;
    slider.value = Math.floor((TALLES[grupoActual].length - 1) / 2);
    actualizar();
  });

  slider.addEventListener("input", actualizar);

  actualizar();
}

/* ---------- Menú móvil ---------- */
function initMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const abierto = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", abierto);
    toggle.setAttribute("aria-expanded", String(abierto));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Header: sombra al hacer scroll ---------- */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const actualizar = () => {
    header.style.boxShadow = window.scrollY > 12
      ? "0 6px 18px rgba(32,27,21,.12)"
      : "none";
  };
  actualizar();
  window.addEventListener("scroll", actualizar, { passive: true });
}

/* ---------- Animación al hacer scroll (reveal) ---------- */
function initReveal() {
  const elementos = document.querySelectorAll(
    ".talles-card, .presentacion-text, .presentacion-media, .section-head, .ubicacion-text, .ubicacion-mapa, .contacto-form-col, .contacto-info-col"
  );
  elementos.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((el) => observer.observe(el));
}

/* ---------- Formulario de contacto ---------- */
function validarFormulario(datos) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = "Ingresá tu nombre.";
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim());
  if (!emailValido) {
    errores.email = "Ingresá un email válido.";
  }

  if (!datos.mensaje.trim() || datos.mensaje.trim().length < 10) {
    errores.mensaje = "Contanos un poco más (mínimo 10 caracteres).";
  }

  return errores;
}

function initFormulario() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    form.querySelectorAll(".form-row").forEach((row) => row.classList.remove("has-error"));
    form.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
    status.textContent = "";
    status.className = "form-status";

    const datos = {
      nombre: form.nombre.value,
      email: form.email.value,
      asunto: form.asunto.value,
      mensaje: form.mensaje.value
    };

    const errores = validarFormulario(datos);

    if (Object.keys(errores).length > 0) {
      Object.entries(errores).forEach(([campo, texto]) => {
        const errorEl = form.querySelector(`[data-error-for="${campo}"]`);
        const row = form.querySelector(`#${campo}`)?.closest(".form-row");
        if (errorEl) errorEl.textContent = texto;
        if (row) row.classList.add("has-error");
      });
      status.textContent = "Revisá los campos marcados.";
      status.classList.add("error");
      return;
    }

    // No hay backend conectado todavía: se simula el envío.
    // Para conectarlo de verdad, reemplazá este bloque por un
    // fetch() a tu servidor, a un formulario de Formspree/Getform,
    // o por un mailto:// con los datos precargados.
    status.textContent = `¡Gracias, ${datos.nombre.split(" ")[0]}! Recibimos tu mensaje y te vamos a responder a la brevedad.`;
    status.classList.add("ok");
    form.reset();
  });
}

/* ---------- Año del footer ---------- */
function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Init general ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProductos("todo");
  initFiltros();
  initBuscadorTalle();
  initMenu();
  initHeaderScroll();
  initReveal();
  initFormulario();
  initFooterYear();
});