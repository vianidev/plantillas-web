/* ==========================================================================
   CANCHA — script.js
   -------------------------------------------------------------------------
   TODO LO QUE NECESITÁS EDITAR ESTÁ EN "PRODUCTS" Y "STORE_INFO" ABAJO.
   No hace falta tocar el resto del archivo para cambiar precios, nombres,
   talles o colores.
   ========================================================================== */

/* --------------------------------------------------------------------
   1) PRODUCTOS
   Copiá un bloque { ... } para agregar un modelo nuevo.
   - category   : "running" | "urbano" | "basquet" | "skate"
   - price      : precio actual (número, sin puntos ni signo $)
   - oldPrice   : precio anterior si está en oferta, o null si no
   - badge      : texto corto opcional ("Nuevo", "Oferta"...) o null
   - colors     : lista de colores disponibles, cada uno con su código hex
   - sizes      : talles disponibles
   -------------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Vento Runner',
    brand: 'Pulso',
    category: 'running',
    price: 79999,
    oldPrice: null,
    badge: 'Nuevo',
    colors: ['#FF4622', '#14141A', '#C9F24C'],
    sizes: [38, 39, 40, 41, 42, 43],
  },
  {
    id: 'p2',
    name: 'Calle 90',
    brand: 'Urbanix',
    category: 'urbano',
    price: 64999,
    oldPrice: 78999,
    badge: 'Oferta',
    colors: ['#14141A', '#FAF8F4'],
    sizes: [36, 37, 38, 39, 40],
  },
  {
    id: 'p3',
    name: 'Aro Alto',
    brand: 'Salto',
    category: 'basquet',
    price: 94999,
    oldPrice: null,
    badge: null,
    colors: ['#FF4622', '#14141A'],
    sizes: [40, 41, 42, 43, 44, 45],
  },
  {
    id: 'p4',
    name: 'Rampa Low',
    brand: 'Deckside',
    category: 'skate',
    price: 58999,
    oldPrice: null,
    badge: 'Nuevo',
    colors: ['#14141A', '#6B6A66'],
    sizes: [38, 39, 40, 41, 42],
  },
  {
    id: 'p5',
    name: 'Maratón Air',
    brand: 'Pulso',
    category: 'running',
    price: 88999,
    oldPrice: 99999,
    badge: 'Oferta',
    colors: ['#C9F24C', '#14141A'],
    sizes: [37, 38, 39, 40, 41],
  },
  {
    id: 'p6',
    name: 'Barrio Classic',
    brand: 'Urbanix',
    category: 'urbano',
    price: 54999,
    oldPrice: null,
    badge: null,
    colors: ['#FF4622', '#FAF8F4', '#14141A'],
    sizes: [36, 37, 38, 39, 40, 41],
  },
  {
    id: 'p7',
    name: 'Triple Doble',
    brand: 'Salto',
    category: 'basquet',
    price: 102999,
    oldPrice: null,
    badge: 'Nuevo',
    colors: ['#14141A', '#FF4622'],
    sizes: [41, 42, 43, 44, 45],
  },
  {
    id: 'p8',
    name: 'Bordillo Mid',
    brand: 'Deckside',
    category: 'skate',
    price: 61999,
    oldPrice: 69999,
    badge: 'Oferta',
    colors: ['#6B6A66', '#14141A'],
    sizes: [38, 39, 40, 41, 42, 43],
  },
];

/* --------------------------------------------------------------------
   2) DATOS DE LA TIENDA (WhatsApp, mail, dirección, redes)
   Se usan en la sección de Contacto / Ubicación del HTML directamente,
   así que si los cambiás acá también actualizá el index.html.
   -------------------------------------------------------------------- */
const STORE_INFO = {
  whatsapp: '+54 9 11 0000-0000',
  email: 'hola@cancha.com.ar',
  instagram: '@cancha.sneakers',
  address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  hours: 'Lun a sáb, 10 a 20hs',
};

/* ==========================================================================
   A partir de acá es la lógica del sitio. No hace falta tocar nada,
   pero está comentado por si querés ajustar algo puntual.
   ========================================================================== */

const money = (n) =>
  '$ ' + n.toLocaleString('es-AR');

const favorites = new Set();

/* -------------------- Ícono de zapatilla reutilizable -------------------- */
function sneakerIcon(color) {
  return `
    <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 96c0-5 4-8 10-10l28-10c5-2 7-5 9-11 3-9 10-15 21-16 15-2 28 3 39 11l30 21c7 5 11 11 11 19v9c0 4-3 7-7 7H26c-5 0-8-3-8-8v-12z" fill="${color}" opacity="0.9"/>
      <path d="M18 96c0-5 4-8 10-10l28-10c5-2 7-5 9-11 3-9 10-15 21-16 15-2 28 3 39 11l30 21" stroke="#14141A" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M28 107h134" stroke="#14141A" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M30 87l7-8M42 89l7-9M54 91l7-10M66 92l6-10" stroke="#14141A" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

/* -------------------- Render del catálogo -------------------- */
const grid = document.getElementById('productGrid');

function renderProducts(filter = 'todos') {
  const items = PRODUCTS.filter((p) => filter === 'todos' || p.category === filter);

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-state">Todavía no hay modelos cargados en esta categoría.</p>`;
    return;
  }

  grid.innerHTML = items
    .map((p) => {
      const isFav = favorites.has(p.id);
      const mainColor = p.colors[0];
      return `
      <article class="product-card" data-id="${p.id}" data-reveal>
        <div class="card-top">
          ${p.badge ? `<span class="card-badge ${p.badge === 'Oferta' ? 'is-oferta' : ''}">${p.badge}</span>` : '<span></span>'}
          <button class="fav-toggle ${isFav ? 'is-active' : ''}" data-fav="${p.id}" aria-label="Marcar como favorito" aria-pressed="${isFav}">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 6.98 5.6 9.03c-1.3 1.78-1.06 4.16.6 5.72l5.4 5.1a.7.7 0 0 0 .96 0l5.4-5.1c1.66-1.56 1.9-3.94.6-5.72-1.5-2.05-4.54-2.43-6.36-.39z"/></svg>
          </button>
        </div>

        <div class="card-media" style="--card-tint:${hexToTint(mainColor)}" data-media="${p.id}">
          ${sneakerIcon(mainColor)}
        </div>

        <div class="card-body">
          <span class="card-brand">${p.brand}</span>
          <h3>${p.name}</h3>

          <div class="color-dots" data-colors="${p.id}">
            ${p.colors
              .map(
                (c, i) =>
                  `<span class="color-dot ${i === 0 ? 'is-active' : ''}" style="background:${c}" data-color="${c}" role="button" tabindex="0" aria-label="Color ${c}"></span>`
              )
              .join('')}
          </div>

          <div class="card-sizes">
            ${p.sizes.map((s) => `<span class="size-chip">${s}</span>`).join('')}
          </div>

          <div class="card-footer">
            <div class="price-block">
              ${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ''}
              <span class="price-now">${money(p.price)}</span>
            </div>
            <span class="swing-tag">stock ok</span>
          </div>
        </div>
      </article>
    `;
    })
    .join('');

  attachCardEvents();
  observeReveals();
}

function hexToTint(hex) {
  // Genera un fondo pastel a partir del color principal del modelo.
  return hex + '26'; // agrega transparencia (~15%) al hex
}

function attachCardEvents() {
  // Favoritos
  grid.querySelectorAll('[data-fav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.fav;
      if (favorites.has(id)) {
        favorites.delete(id);
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        favorites.add(id);
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        showToast('Agregado a favoritos');
      }
      document.getElementById('favCount').textContent = favorites.size;
    });
  });

  // Selector de color: cambia el tinte de la miniatura y el color del ícono
  grid.querySelectorAll('[data-colors]').forEach((wrap) => {
    const id = wrap.dataset.colors;
    const media = grid.querySelector(`[data-media="${id}"]`);
    wrap.querySelectorAll('.color-dot').forEach((dot) => {
      dot.addEventListener('click', () => selectColor(wrap, dot, media));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectColor(wrap, dot, media);
        }
      });
    });
  });
}

function selectColor(wrap, dot, media) {
  wrap.querySelectorAll('.color-dot').forEach((d) => d.classList.remove('is-active'));
  dot.classList.add('is-active');
  const color = dot.dataset.color;
  media.style.setProperty('--card-tint', hexToTint(color));
  media.innerHTML = sneakerIcon(color);
}

/* -------------------- Filtros de categoría -------------------- */
const filterButtons = document.querySelectorAll('.filter-pill');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderProducts(btn.dataset.filter);
  });
});

/* -------------------- Menú móvil -------------------- */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  })
);

/* -------------------- Botón de favoritos del header -------------------- */
document.getElementById('favBtn').addEventListener('click', () => {
  if (favorites.size === 0) {
    showToast('Todavía no marcaste favoritos');
    return;
  }
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  showToast(`Tenés ${favorites.size} favorito${favorites.size > 1 ? 's' : ''}`);
});

/* -------------------- Formulario de contacto -------------------- */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  ['nombre', 'email', 'mensaje'].forEach((name) => {
    const input = form.elements[name];
    const field = input.closest('.field');
    const filled = input.value.trim().length > 0;
    const emailOk = name !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

    if (!filled || !emailOk) {
      field.classList.add('has-error');
      valid = false;
    } else {
      field.classList.remove('has-error');
    }
  });

  if (!valid) return;

  // Acá no hay backend conectado: esto simula el envío.
  // Para conectarlo de verdad, reemplazá este bloque por tu fetch()
  // a tu servidor, formulario de terceros, o mailto.
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-label').textContent = 'Enviando...';

  setTimeout(() => {
    successMsg.classList.add('is-visible');
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-label').textContent = 'Enviar mensaje';
    form.reset();
    setTimeout(() => successMsg.classList.remove('is-visible'), 4500);
  }, 700);
});

/* -------------------- Toast -------------------- */
let toastTimer;
function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

/* -------------------- Animaciones al hacer scroll -------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function observeReveals() {
  document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => revealObserver.observe(el));
}

/* -------------------- Año en el footer -------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* -------------------- Inicio -------------------- */
renderProducts('todos');
observeReveals();