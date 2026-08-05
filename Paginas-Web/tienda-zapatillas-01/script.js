/* ===================================================================
   LA CAJA° — Lógica de la tienda
   ===================================================================
   ESTA ES LA ÚNICA PARTE DEL ARCHIVO QUE NECESITÁS TOCAR SEGURO:
   la configuración general y la lista de productos, más abajo.
   =================================================================== */

/* -------------------------------------------------------------------
   1. CONFIGURACIÓN GENERAL
   ------------------------------------------------------------------- */
const CONFIG = {
  nombreTienda: "LA CAJA°",
  moneda: "$",
  // Número de WhatsApp SIN el "+" ni espacios, con código de país.
  // Ejemplo Argentina: 54 9 11 1234-5678  ->  "5491112345678"
  whatsapp: "5491112345678",
  mensajeContactoGeneral: "Hola! Quería consultarte sobre las zapatillas que tenés disponibles.",
};

/* -------------------------------------------------------------------
   2. PRODUCTOS
   ------------------------------------------------------------------- 
   Copiá un bloque { ... } y pegalo para agregar un producto nuevo.
   Borrá el bloque para sacar un producto.

   Campos:
   - id          -> único, no lo repitas (texto o número)
   - nombre      -> nombre del modelo
   - categoria   -> "running", "urbana", "basquet" o "retro"
                    (podés inventar categorías nuevas, se listan solas arriba)
   - precio      -> número, sin puntos ni comas. Ej: 89999
   - precioAntes -> opcional. Si tiene descuento, poné el precio viejo. 
                    Si no hay descuento, dejalo en null.
   - talles      -> lista de talles disponibles, ej: [38, 39, 40, 41]
   - destacado   -> true / false, para que aparezca primero en "Destacados"
   - stock       -> true / false. Si es false, se muestra "Sin stock"
   - color       -> color del ícono de la zapatilla en la tarjeta (hex)
   - imagen      -> opcional. Ruta a una foto real, ej: "img/modelo-1.jpg"
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
    stock: true,
    color: "#FF5A1F",
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
    stock: true,
    color: "#17140F",
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
    stock: true,
    color: "#2643C7",
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
    stock: true,
    color: "#5C5646",
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
    stock: false,
    color: "#FF5A1F",
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
    stock: true,
    color: "#17140F",
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
    // destacados primero, sin stock al final
    lista.sort((a, b) => {
      if (a.stock !== b.stock) return a.stock ? -1 : 1;
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
      const media = p.imagen
        ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.replaceWith(document.createRange().createContextualFragment('${iconoZapatilla(p.color).replace(/'/g, "\\'")}'))">`
        : iconoZapatilla(p.color);

      const talles = p.talles.map((t) => `<option value="${t}">Talle ${t}</option>`).join("");

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media">
            ${!p.stock ? `<span class="product-badge">Sin stock</span>` : p.destacado ? `<span class="product-badge">Destacado</span>` : ""}
            ${media}
          </div>
          <div class="perforation"></div>
          <div class="product-info">
            <span class="product-category">${NOMBRES_CATEGORIA[p.categoria] || p.categoria}</span>
            <h3 class="product-name">${p.nombre}</h3>
            <div class="product-price-row">
              <span class="product-price">${formatearPrecio(p.precio)}</span>
              ${p.precioAntes ? `<span class="product-price-old">${formatearPrecio(p.precioAntes)}</span>` : ""}
            </div>
            <div class="product-sizes">
              <label for="talle-${p.id}">Talle</label>
              <select id="talle-${p.id}" ${!p.stock ? "disabled" : ""}>
                ${talles}
              </select>
            </div>
            <button class="add-btn" data-id="${p.id}" ${!p.stock ? "disabled" : ""}>
              ${p.stock ? "Agregar al carrito" : "Sin stock"}
            </button>
          </div>
        </article>`;
    })
    .join("");

  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const select = document.getElementById(`talle-${id}`);
      agregarAlCarrito(id, select ? select.value : null);
    });
  });
}

/* -------------------- Carrito -------------------- */
function agregarAlCarrito(productoId, talle) {
  const producto = PRODUCTOS.find((p) => p.id === productoId);
  if (!producto || !producto.stock) return;

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
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
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

/* -------------------- Abrir / cerrar drawer del carrito -------------------- */
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
  if (carrito.length === 0) {
    return CONFIG.mensajeContactoGeneral;
  }
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

/* -------------------- Inicialización -------------------- */
function init() {
  renderTabs();
  renderProductos();
  renderCarrito();

  // Buscador
  document.getElementById("searchInput").addEventListener("input", (e) => {
    estado.busqueda = e.target.value;
    renderProductos();
  });

  // Orden
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    estado.orden = e.target.value;
    renderProductos();
  });

  // Carrito: abrir / cerrar
  document.getElementById("cartBtn").addEventListener("click", abrirCarrito);
  document.getElementById("closeCart").addEventListener("click", cerrarCarrito);
  document.getElementById("cartOverlay").addEventListener("click", cerrarCarrito);

  // Checkout
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    irAWhatsapp(armarMensajePedido());
  });

  // Botón de contacto general
  document.getElementById("whatsappContact").addEventListener("click", (e) => {
    e.preventDefault();
    irAWhatsapp(CONFIG.mensajeContactoGeneral);
  });

  // Menú mobile
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