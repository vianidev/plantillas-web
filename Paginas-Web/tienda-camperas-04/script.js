/* ===========================================================
   ABRIGO — script.js
   -----------------------------------------------------------
   EDITAR PRODUCTOS ACÁ:
   Cada objeto del array PRODUCTOS es una campera del catálogo.
   Campos:
     nombre      -> nombre del producto
     categoria   -> "plumas" | "parkas" | "rompevientos" | "impermeables"
                    (tiene que coincidir con data-filtro del HTML)
     precio      -> número, se formatea solo
     descripcion -> texto corto
     abrigo      -> "Bajo" | "Medio" | "Alto" (nivel de abrigo)
     tempRango   -> texto corto, ej: "-5° a 5°C" (se muestra en la tarjeta)
     imagenAlt   -> texto del placeholder de imagen (usalo como "alt"
                    cuando insertes la foto real)
   Para agregar una campera nueva, copiá un bloque { ... } y pegalo
   dentro del array, con una coma después del bloque anterior.
   =========================================================== */

const PRODUCTOS = [
  {
    nombre: "Pluma Ártico 700",
    categoria: "plumas",
    precio: 89900,
    descripcion: "Relleno de pluma 700 cuin, capucha con borde de piel sintética.",
    abrigo: "Alto",
    tempRango: "-15° a 0°C",
    imagenAlt: "Campera de pluma larga color negro"
  },
  {
    nombre: "Pluma Nevado Corta",
    categoria: "plumas",
    precio: 79900,
    descripcion: "Pluma sintética, corte corto, bolsillos con cierre estanco.",
    abrigo: "Alto",
    tempRango: "-10° a 2°C",
    imagenAlt: "Campera de pluma corta color verde militar"
  },
  {
    nombre: "Parka Patagonia",
    categoria: "parkas",
    precio: 64900,
    descripcion: "Largo hasta el muslo, forro polar desmontable, capucha ajustable.",
    abrigo: "Alto",
    tempRango: "-5° a 8°C",
    imagenAlt: "Parka larga color camel con capucha"
  },
  {
    nombre: "Parka Urbana Gris",
    categoria: "parkas",
    precio: 59900,
    descripcion: "Exterior repelente al agua, interior acolchado, corte recto.",
    abrigo: "Medio-Alto",
    tempRango: "-2° a 9°C",
    imagenAlt: "Parka color gris oscuro corte urbano"
  },
  {
    nombre: "Rompeviento Trail",
    categoria: "rompevientos",
    precio: 38900,
    descripcion: "Liviano, se guarda en su propio bolsillo, corta el viento.",
    abrigo: "Bajo",
    tempRango: "9° a 18°C",
    imagenAlt: "Rompeviento liviano color azul"
  },
  {
    nombre: "Rompeviento Softshell",
    categoria: "rompevientos",
    precio: 45900,
    descripcion: "Tela softshell con leve forro, ideal para entretiempo activo.",
    abrigo: "Medio",
    tempRango: "6° a 15°C",
    imagenAlt: "Campera softshell color gris"
  },
  {
    nombre: "Impermeable Shell 3L",
    categoria: "impermeables",
    precio: 69900,
    descripcion: "Membrana 3 capas, costuras selladas, ventilación en axilas.",
    abrigo: "Variable",
    tempRango: "Cualquier temp. con lluvia",
    imagenAlt: "Campera impermeable amarilla"
  },
  {
    nombre: "Impermeable Poncho Urbano",
    categoria: "impermeables",
    precio: 32900,
    descripcion: "Corte holgado para usar sobre otra campera, capucha grande.",
    abrigo: "Variable",
    tempRango: "Cualquier temp. con lluvia",
    imagenAlt: "Poncho impermeable color negro"
  }
];

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(valor);

const NOMBRES_CATEGORIA = {
  plumas: "Pluma",
  parkas: "Parka",
  rompevientos: "Rompeviento",
  impermeables: "Impermeable"
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
      <span class="producto-temp">${producto.tempRango}</span>
    </div>
    <div class="producto-info">
      <h3 class="producto-nombre">${producto.nombre}</h3>
      <p class="producto-abrigo">Abrigo: ${producto.abrigo}</p>
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
    aviso.textContent = "No hay camperas en esta categoría todavía.";
    grid.appendChild(aviso);
    return;
  }

  lista.forEach((producto, i) => {
    grid.appendChild(crearTarjetaProducto(producto, i));
  });
}

function activarFiltro(nombreFiltro) {
  const filtros = document.getElementById("filtros");
  if (!filtros) return;
  filtros.querySelectorAll(".filtro-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.filtro === nombreFiltro);
  });
  renderProductos(nombreFiltro);
}

/* ---------- Filtros de categoría ---------- */
function initFiltros() {
  const filtros = document.getElementById("filtros");
  if (!filtros) return;

  filtros.addEventListener("click", (e) => {
    const btn = e.target.closest(".filtro-btn");
    if (!btn) return;
    activarFiltro(btn.dataset.filtro);
  });
}

/* ---------- Medidor de temperatura (guía de abrigo) ---------- */
function categoriaPorTemperatura(temp) {
  if (temp <= 0) {
    return { categoria: "plumas", nombre: "Pluma", color: "var(--ember-cold)" };
  }
  if (temp <= 9) {
    return { categoria: "parkas", nombre: "Parka", color: "var(--ember-cool)" };
  }
  if (temp <= 17) {
    return { categoria: "rompevientos", nombre: "Rompeviento", color: "var(--ember-mild)" };
  }
  return { categoria: "rompevientos", nombre: "Rompeviento liviano (o nada de campera)", color: "var(--ember-warm)" };
}

function initGauge() {
  const slider = document.getElementById("gaugeSlider");
  const tempEl = document.getElementById("gaugeTemp");
  const recoEl = document.getElementById("gaugeReco");
  const ctaEl = document.getElementById("gaugeCta");
  const locateBtn = document.getElementById("gaugeLocate");
  const statusEl = document.getElementById("gaugeStatus");
  if (!slider || !tempEl || !recoEl) return;

  const actualizarGauge = (temp) => {
    const info = categoriaPorTemperatura(temp);
    tempEl.textContent = temp;
    tempEl.style.color = info.color;
    recoEl.innerHTML = `Recomendado: <strong>${info.nombre}</strong>`;
    if (ctaEl) ctaEl.dataset.categoria = info.categoria;
  };

  actualizarGauge(Number(slider.value));

  slider.addEventListener("input", () => {
    actualizarGauge(Number(slider.value));
  });

  if (ctaEl) {
    ctaEl.addEventListener("click", () => {
      const cat = ctaEl.dataset.categoria || "todo";
      // Pequeño delay para que primero se vea el scroll y después el filtro
      setTimeout(() => activarFiltro(cat), 350);
    });
  }

  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      if (!("geolocation" in navigator)) {
        if (statusEl) statusEl.textContent = "Tu navegador no permite detectar la ubicación. Usá el control manual.";
        return;
      }

      if (statusEl) statusEl.textContent = "Buscando tu temperatura actual…";

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error("Respuesta no válida del servicio de clima");
            const data = await resp.json();
            const tempActual = Math.round(data?.current?.temperature_2m);

            if (Number.isNaN(tempActual)) throw new Error("No se pudo leer la temperatura");

            const tempClamp = Math.max(Number(slider.min), Math.min(Number(slider.max), tempActual));
            slider.value = tempClamp;
            actualizarGauge(tempClamp);

            if (statusEl) {
              statusEl.textContent = `Detectamos ${tempActual}°C en tu ubicación.`;
            }
          } catch (err) {
            if (statusEl) statusEl.textContent = "No pudimos obtener el clima ahora. Usá el control manual.";
          }
        },
        () => {
          if (statusEl) statusEl.textContent = "No nos diste permiso de ubicación. Usá el control manual.";
        },
        { timeout: 8000 }
      );
    });
  }
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
      ? "0 6px 18px rgba(11,22,34,.1)"
      : "none";
  };
  actualizar();
  window.addEventListener("scroll", actualizar, { passive: true });
}

/* ---------- Animación al hacer scroll (reveal) ---------- */
function initReveal() {
  const elementos = document.querySelectorAll(
    ".leyenda, .presentacion-text, .presentacion-media, .section-head, .ubicacion-text, .ubicacion-mapa, .contacto-form-col, .contacto-info-col"
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
  initGauge();
  initMenu();
  initHeaderScroll();
  initReveal();
  initFormulario();
  initFooterYear();
});