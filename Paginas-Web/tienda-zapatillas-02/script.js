/* ===================================================================
   VOLT. — Lógica de la tienda
   ===================================================================
   ESTA ES LA ÚNICA PARTE DEL ARCHIVO QUE NECESITÁS TOCAR SEGURO:
   la configuración general y la lista de productos, más abajo.
   =================================================================== */

/* -------------------------------------------------------------------
   1. CONFIGURACIÓN GENERAL
   ------------------------------------------------------------------- */
const CONFIG = {
  nombreTienda: "VOLT.",
  moneda: "$",
  // Número de WhatsApp SIN el "+" ni espacios, con código de país.
  // Ejemplo Argentina: 54 9 11 1234-5678  ->  "5491112345678"
  whatsapp: "5491112345678",
  mensajeContactoGeneral: "Hola! Quería consultarte sobre las zapatillas que tenés disponibles.",
  // Referencia para la "barra de voltaje" (urgencia de stock) de cada tarjeta.
  // Si un producto tiene stockCantidad >= a este número, la barra se muestra llena.
  stockReferencia: 15,
  // Textos que se repiten en la cinta animada del header y el footer.
  ticker: [
    "⚡ Drop nuevo cada semana",
    "🚚 Envío gratis desde $50.000",
    "🔥 Stock limitado",
    "↩️ Cambios en 10 días",
  ],
};

/* -------------------------------------------------------------------
   2. PRODUCTOS
   ------------------------------------------------------------------- 
   Copiá un bloque { ... } y pegalo para agregar un producto nuevo.
   Borrá el bloque para sacar un producto.

   Campos:
   - id             -> único, no lo repitas (texto o número)
   - nombre         -> nombre del modelo
   - categoria      -> "running", "urbana", "basquet" o "retro"
                       (podés inventar categorías nuevas, se listan solas arriba)
   - precio         -> número, sin puntos ni comas. Ej: 89999
   - precioAntes    -> opcional. Si tiene descuento, poné el precio viejo.
                       Si no hay descuento, dejalo en null.
   - talles         -> lista de talles disponibles, ej: [38, 39, 40, 41]
   - destacado      -> true / false, para que aparezca primero en "Destacados"
   - stockCantidad  -> número de pares que quedan. Poné 0 si no hay stock.
   - color          -> color del ícono de la zapatilla en la tarjeta (hex)
   - imagen         -> opcional. Ruta a una foto real, ej: "img/modelo-1.jpg"
                       Si la dejás vacía (""), se muestra un ícono de zapatilla.
------------------------------------------------------------------- */
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Runner Bolt",
    categoria: "running",
    precio: 89999,
    precioAntes: null,
    talles: [38, 39, 40, 41, 42],
    destacado: true,
    stockCantidad: 14,
    color: "#D7FF3E",
    imagen: "",
  },
  {
    id: 2,
    nombre: "Street 90",
    categoria: "urbana",
    precio: 74999,
    precioAntes: 89999,
    talles: [37, 38, 39, 40],
    destacado: true,
    stockCantidad: 6,
    color: "#FF3EA5",
    imagen: "",
  },
  {
    id: 3,
    nombre: "Court Flow",
    categoria: "basquet",
    precio: 109999,
    precioAntes: null,
    talles: [40, 41, 42, 43, 44],
    destacado: true,
    stockCantidad: 20,
    color: "#7C5CFF",
    imagen: "",
  },
  {
    id: 4,
    nombre: "Retro Classic 82",
    categoria: "retro",
    precio: 64999,
    precioAntes: null,
    talles: [37, 38, 39, 40, 41],
    destacado: false,
    stockCantidad: 9,
    color: "#35E1D0",
    imagen: "",
  },
  {
    id: 5,
    nombre: "Runner Air Light",
    categoria: "running",
    precio: 95999,
    precioAntes: null,
    talles: [39, 40, 41, 42],
    destacado: false,
    stockCantidad: 0,
    color: "#D7FF3E",
    imagen: "",
  },
  {
    id: 6,
    nombre: "Urban Low",
    categoria: "urbana",
    precio: 59999,
    precioAntes: null,
    talles: [36, 37, 38, 39, 40],
    destacado: false,
    stockCantidad: 3,
    color: "#FF3EA5",
    imagen: "",
  },
];

/* ===================================================================
   A PARTIR DE ACÁ ES LA LÓGICA DEL SITIO.
   No hace falta que la edites para cambiar productos o precios.
   =================================================================== */

const NOMBRES_CATEGORIA = {
  running: "Running",
  urbana: "Urbana",
  basquet: "Básquet",
  retro: "Retro",
};

let estado = {
  categoriaActiva: "todos",
  busqueda: "",
  orden: "destacado",
};

let carrito = []; // { productoId, nombre, precio, talle, cantidad, color }

/* -------------------- Utilidades -------------------- */
function formatearPrecio(numero) {
  return CONFIG.moneda + numero.toLocaleString("es-AR");
}

function iconoZapatilla(color) {
  return `
    <svg viewBox="0 0 200 200" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 130 Q20 110 45 105 L70 95 Q85 70 110 65 Q130 60 145 75 L165 95 Q180 100 180 120 Q180 140 160 145 L35 145 Q20 143 20 130 Z"/>
      <path d="M45 105 L45 130 M70 95 L75 125 M110 65 L115 110"/>
    </svg>`;
}

/* -------------------- Cinta animada (ticker) -------------------- */
function renderTicker() {
  const items = CONFIG.ticker;
  // Se repite la lista varias veces para que el loop sea continuo
  const bloque = items.map((t) => `<span>${t}</span>`).join("");
  const contenido = bloque + bloque; // duplicado para el efecto de scroll infinito

  const track1 = document.getElementById("tickerTrack");
  const track2 = document.getElementById("tickerTrackFooter");
  if (track1) track1.innerHTML = contenido;
  if (track2) track2.innerHTML = contenido;
}

/* -------------------- Render de categorías (tabs) -------------------- */
function obtenerCategorias() {
  const set = new Set(PRODUCTOS.map((p) => p.categoria));
  return Array.from(set);
}

function renderTabs() {
  const cont = document.getElementById("categoryTabs");
  const categorias = obtenerCategorias();

  const tabs = [{ id: "todos", label: "Todos" }].concat(
    categorias.map((c) => ({ id: c, label: NOMBRES_CATEGORIA[c] || c }))
  );

  cont.innerHTML = tabs
    .map(
      (t) => `
      <button class="tab ${t.id === estado.categoriaActiva ? "is-active" : ""}" data-cat="${t.id}">
        ${t.label}
      </button>`
    )
    .join("");

  cont.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      estado.categoriaActiva = btn.dataset.cat;
      renderTabs();
      renderProductos();
    });
  });
}

/* -------------------- Render de productos -------------------- */
function obtenerProductosFiltrados() {
  let lista = PRODUCTOS.slice();

  if (estado.categoriaActiva !== "todos") {
    lista = lista.filter((p) => p.categoria === estado.categoriaActiva);
  }

  if (estado.busqueda.trim() !== "") {
    const q = estado.busqueda.trim().toLowerCase();
    lista = lista.filter((p) => p.nombre.toLowerCase().includes(q));
  }

  if (estado.orden === "precio-asc") {
    lista.sort((a, b) => a.precio - b.precio);
  } else if (estado.orden === "precio-desc") {
    lista.sort((a, b) => b.precio - a.precio);
  } else {
    lista.sort((a, b) => {
      const aStock = a.stockCantidad > 0;
      const bStock = b.stockCantidad > 0;
      if (aStock !== bStock) return aStock ? -1 : 1;
      return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
    });
  }

  return lista;
}

function renderProductos() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const lista = obtenerProductosFiltrados();

  if (lista.length === 0) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  grid.innerHTML = lista
    .map((p) => {
      const conStock = p.stockCantidad > 0;
      const media = p.imagen
        ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.replaceWith(document.createRange().createContextualFragment('${iconoZapatilla(p.color).replace(/'/g, "\\'")}'))">`
        : iconoZapatilla(p.color);

      const talles = p.talles.map((t) => `<option value="${t}">Talle ${t}</option>`).join("");

      const porcentaje = conStock
        ? Math.max(8, Math.min(100, Math.round((p.stockCantidad / CONFIG.stockReferencia) * 100)))
        : 0;
      const etiquetaStock = conStock
        ? p.stockCantidad <= 5
          ? `¡Quedan ${p.stockCantidad}!`
          : `${p.stockCantidad} disponibles`
        : "Sin stock";

      let badge = "";
      if (!conStock) badge = `<span class="product-badge badge-sinstock">Sin stock</span>`;
      else if (p.destacado) badge = `<span class="product-badge badge-destacado">Destacado</span>`;

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-glow"></div>
          <div class="product-media">
            ${badge}
            ${media}
          </div>
          <div class="product-info">
            <span class="product-category" style="color:${p.color}">${NOMBRES_CATEGORIA[p.categoria] || p.categoria}</span>
            <h3 class="product-name">${p.nombre}</h3>
            <div class="product-price-row">
              <span class="product-price">${formatearPrecio(p.precio)}</span>
              ${p.precioAntes ? `<span class="product-price-old">${formatearPrecio(p.precioAntes)}</span>` : ""}
            </div>
            <div class="volt-meter">
              <span class="volt-meter-label"><span>Stock</span><span>${etiquetaStock}</span></span>
              <span class="volt-meter-track"><span class="volt-meter-fill" data-width="${porcentaje}"></span></span>
            </div>
            <div class="product-sizes">
              <label for="talle-${p.id}">Talle</label>
              <select id="talle-${p.id}" ${!conStock ? "disabled" : ""}>
                ${talles}
              </select>
            </div>
            <button class="add-btn" data-id="${p.id}" ${!conStock ? "disabled" : ""}>
              ${conStock ? "Agregar al carrito" : "Sin stock"}
            </button>
          </div>
        </article>`;
    })
    .join("");

  // Animar las barras de voltaje después de insertarlas en el DOM
  requestAnimationFrame(() => {
    grid.querySelectorAll(".volt-meter-fill").forEach((el) => {
      el.style.width = el.dataset.width + "%";
    });
  });

  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const select = document.getElementById(`talle-${id}`);
      agregarAlCarrito(id, select ? select.value : null);
      microAnimacionAgregado(btn);
    });
  });

  // Efecto tilt 3D + glow que sigue al cursor (se desactiva si el usuario prefiere menos movimiento)
  if (!prefiereMenosMovimiento()) {
    grid.querySelectorAll(".product-card").forEach(activarTilt);
  }
}

function microAnimacionAgregado(btn) {
  const textoOriginal = btn.textContent;
  btn.textContent = "¡Agregado! ✓";
  btn.classList.add("is-added");
  setTimeout(() => {
    btn.textContent = textoOriginal;
    btn.classList.remove("is-added");
  }, 900);
}

function prefiereMenosMovimiento() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* -------------------- Efecto tilt 3D en las tarjetas -------------------- */
function activarTilt(card) {
  const glow = card.querySelector(".product-glow");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y / rect.height) - 0.5) * -8;
    const rotY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    if (glow) {
      glow.style.left = x + "px";
      glow.style.top = y + "px";
    }
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
}

/* -------------------- Carrito -------------------- */
function agregarAlCarrito(productoId, talle) {
  const producto = PRODUCTOS.find((p) => p.id === productoId);
  if (!producto || producto.stockCantidad <= 0) return;

  const existente = carrito.find((it) => it.productoId === productoId && it.talle === talle);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      productoId,
      nombre: producto.nombre,
      precio: producto.precio,
      talle,
      cantidad: 1,
      color: producto.color,
    });
  }
  renderCarrito();
  abrirCarrito();
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  renderCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

function calcularTotal() {
  return carrito.reduce((sum, it) => sum + it.precio * it.cantidad, 0);
}

function renderCarrito() {
  const cont = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");

  const cantidadTotal = carrito.reduce((s, it) => s + it.cantidad, 0);
  countEl.textContent = cantidadTotal;
  countEl.classList.remove("bump");
  void countEl.offsetWidth; // fuerza el reinicio de la animación
  countEl.classList.add("bump");

  if (carrito.length === 0) {
    cont.innerHTML = `<p class="cart-empty" id="cartEmptyMsg">Todavía no agregaste ninguna zapatilla.</p>`;
  } else {
    cont.innerHTML = carrito
      .map(
        (it, index) => `
        <div class="cart-item">
          <div class="cart-item-thumb">${iconoZapatilla(it.color)}</div>
          <div>
            <div class="cart-item-name">${it.nombre}</div>
            <div class="cart-item-meta">Talle ${it.talle}</div>
            <div class="cart-item-qty">
              <button data-action="menos" data-index="${index}" aria-label="Restar cantidad">−</button>
              <span>${it.cantidad}</span>
              <button data-action="mas" data-index="${index}" aria-label="Sumar cantidad">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item-price">${formatearPrecio(it.precio * it.cantidad)}</div>
            <button class="cart-item-remove" data-action="quitar" data-index="${index}">Quitar</button>
          </div>
        </div>`
      )
      .join("");

    cont.querySelectorAll("[data-action='mas']").forEach((btn) =>
      btn.addEventListener("click", () => cambiarCantidad(Number(btn.dataset.index), 1))
    );
    cont.querySelectorAll("[data-action='menos']").forEach((btn) =>
      btn.addEventListener("click", () => cambiarCantidad(Number(btn.dataset.index), -1))
    );
    cont.querySelectorAll("[data-action='quitar']").forEach((btn) =>
      btn.addEventListener("click", () => eliminarDelCarrito(Number(btn.dataset.index)))
    );
  }

  totalEl.textContent = formatearPrecio(calcularTotal());
}

function abrirCarrito() {
  document.getElementById("cartDrawer").classList.add("is-open");
  document.getElementById("cartOverlay").classList.add("is-open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
}
function cerrarCarrito() {
  document.getElementById("cartDrawer").classList.remove("is-open");
  document.getElementById("cartOverlay").classList.remove("is-open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

/* -------------------- Checkout por WhatsApp -------------------- */
function armarMensajePedido() {
  if (carrito.length === 0) return CONFIG.mensajeContactoGeneral;

  let msg = `Hola! Quiero hacer este pedido en ${CONFIG.nombreTienda}:\n\n`;
  carrito.forEach((it) => {
    msg += `• ${it.nombre} — Talle ${it.talle} — x${it.cantidad} — ${formatearPrecio(it.precio * it.cantidad)}\n`;
  });
  msg += `\nTotal: ${formatearPrecio(calcularTotal())}`;
  return msg;
}

function irAWhatsapp(mensajeSinCodificar) {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensajeSinCodificar)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* -------------------- Contador animado de estadísticas -------------------- */
function iniciarContadores() {
  const numeros = document.querySelectorAll(".stat-number");
  if (numeros.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animarNumero(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  numeros.forEach((el) => observer.observe(el));
}

function animarNumero(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const decimal = el.dataset.decimal ? Number("0." + el.dataset.decimal) : 0;
  const finalValue = target + decimal;
  const duracion = prefiereMenosMovimiento() ? 0 : 1200;
  const inicio = performance.now();

  function frame(ahora) {
    const progreso = duracion === 0 ? 1 : Math.min(1, (ahora - inicio) / duracion);
    const valorActual = finalValue * progreso;
    el.textContent = (decimal ? valorActual.toFixed(1) : Math.round(valorActual)) + suffix;
    if (progreso < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* -------------------- Revelado al hacer scroll -------------------- */
function iniciarRevelado() {
  const elementos = document.querySelectorAll(".reveal");
  if (elementos.length === 0) return;

  if (prefiereMenosMovimiento()) {
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

  elementos.forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 60, 300) + "ms";
    observer.observe(el);
  });
}

/* -------------------- Inicialización -------------------- */
function init() {
  renderTicker();
  renderTabs();
  renderProductos();
  renderCarrito();
  iniciarContadores();
  iniciarRevelado();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    estado.busqueda = e.target.value;
    renderProductos();
  });

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    estado.orden = e.target.value;
    renderProductos();
  });

  document.getElementById("cartBtn").addEventListener("click", abrirCarrito);
  document.getElementById("closeCart").addEventListener("click", cerrarCarrito);
  document.getElementById("cartOverlay").addEventListener("click", cerrarCarrito);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    irAWhatsapp(armarMensajePedido());
  });

  document.getElementById("whatsappContact").addEventListener("click", (e) => {
    e.preventDefault();
    irAWhatsapp(CONFIG.mensajeContactoGeneral);
  });

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", () => {
    const abierto = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );
}

document.addEventListener("DOMContentLoaded", init);