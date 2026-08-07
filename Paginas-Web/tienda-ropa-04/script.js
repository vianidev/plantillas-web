/* ===========================================================
   TRAMA — script.js
   -----------------------------------------------------------
   EDITAR PRODUCTOS ACÁ:
   Cada objeto del array PRODUCTOS es una prenda del catálogo.
   Campos:
     nombre      -> nombre del producto
     categoria   -> "remeras" | "pantalones" | "sueteres" | "accesorios"
                    (tiene que coincidir con data-filtro del HTML)
     precio      -> número, se formatea solo
     descripcion -> texto corto
     imagenAlt   -> texto que se muestra en el placeholder de imagen
                    (cuando insertes la imagen real, usalo como "alt")
   Para agregar una prenda nueva, copiá un bloque { ... } y pegalo
   dentro del array, con una coma después del bloque anterior.
   =========================================================== */

const PRODUCTOS = [
  {
    nombre: "Remera Básica Oversize",
    categoria: "remeras",
    precio: 18500,
    descripcion: "Algodón peinado 24/1, corte oversize, cuello redondo reforzado.",
    imagenAlt: "Remera básica oversize color crudo"
  },
  {
    nombre: "Remera Rayada Marina",
    categoria: "remeras",
    precio: 19900,
    descripcion: "Rayas finas, algodón grueso, ideal para entretiempo.",
    imagenAlt: "Remera a rayas azul y blanco"
  },
  {
    nombre: "Pantalón Cargo Recto",
    categoria: "pantalones",
    precio: 34900,
    descripcion: "Gabardina reforzada, bolsillos laterales, calce recto.",
    imagenAlt: "Pantalón cargo color verde oliva"
  },
  {
    nombre: "Pantalón Jean Wide",
    categoria: "pantalones",
    precio: 39900,
    descripcion: "Denim rígido 14oz, tiro alto, pierna ancha.",
    imagenAlt: "Jean wide leg azul oscuro"
  },
  {
    nombre: "Suéter Cuello Redondo",
    categoria: "sueteres",
    precio: 42500,
    descripcion: "Lana merino, tejido medio, ideal para capas.",
    imagenAlt: "Suéter cuello redondo color camel"
  },
  {
    nombre: "Suéter Trenzado",
    categoria: "sueteres",
    precio: 46900,
    descripcion: "Punto trenzado grueso, cuello alto, calce holgado.",
    imagenAlt: "Suéter trenzado color crudo"
  },
  {
    nombre: "Gorro de Lana",
    categoria: "accesorios",
    precio: 9900,
    descripcion: "Punto arroz, una talla, doble capa.",
    imagenAlt: "Gorro de lana color gris"
  },
  {
    nombre: "Cinturón de Cuero",
    categoria: "accesorios",
    precio: 14900,
    descripcion: "Cuero vacuno curtido natural, hebilla metálica.",
    imagenAlt: "Cinturón de cuero marrón"
  }
];

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(valor);

const NOMBRES_CATEGORIA = {
  remeras: "Remera",
  pantalones: "Pantalón",
  sueteres: "Suéter",
  accesorios: "Accesorio"
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
    aviso.textContent = "No hay productos en esta categoría todavía.";
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
      ? "0 6px 18px rgba(22,23,26,.08)"
      : "none";
  };
  actualizar();
  window.addEventListener("scroll", actualizar, { passive: true });
}

/* ---------- Animación al hacer scroll (reveal) ---------- */
function initReveal() {
  const elementos = document.querySelectorAll(
    ".presentacion-text, .presentacion-media, .section-head, .ubicacion-text, .ubicacion-mapa, .contacto-form-col, .contacto-info-col"
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

    // Limpiar errores previos
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
  initMenu();
  initHeaderScroll();
  initReveal();
  initFormulario();
  initFooterYear();
});