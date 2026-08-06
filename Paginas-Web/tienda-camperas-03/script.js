
/* ===================== DATA ===================== */
const products = [
  {
    id:1, name:"Patagonia Impermeable", cat:"impermeable", price:89999,
    desc:"Membrana 10K/10K, costuras selladas y capucha desmontable. Pensada para lluvia y viento fuerte.",
    material:"Ripstop + membrana", sizes:"S–XXL",
    img:"https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=700&q=80"
  },
  {
    id:2, name:"Urbana Acolchada", cat:"urbana", price:54999,
    desc:"Relleno térmico liviano y corte recto. La ideal para el día a día en la ciudad.",
    material:"Poliéster acolchado", sizes:"S–XL",
    img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
  },
  {
    id:3, name:"Aviador de Cuero", cat:"cuero", price:129999,
    desc:"Cuero vacuno curtido al cromo, forro interior acolchado y cierres metálicos macizos.",
    material:"Cuero vacuno", sizes:"S–XL",
    img:"https://images.unsplash.com/photo-1520975922284-9bc0a3f8e0e6?auto=format&fit=crop&w=700&q=80"
  },
  {
    id:4, name:"Softshell Trekking", cat:"outdoor", price:74999,
    desc:"Elástica en 4 direcciones, cortaviento y transpirable. Para trekking y uso técnico diario.",
    material:"Softshell 3 capas", sizes:"S–XXL",
    img:"https://images.unsplash.com/photo-1547949003-9792a18a2645?auto=format&fit=crop&w=700&q=80"
  },
  {
    id:5, name:"Puffer Ligera", cat:"urbana", price:64999,
    desc:"Relleno sintético que abriga sin bulto, se guarda en su propio bolsillo interno.",
    material:"Nylon + relleno sintético", sizes:"S–XL",
    img:"https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=700&q=80"
  },
  {
    id:6, name:"Parka Militar", cat:"outdoor", price:99999,
    desc:"Largo hasta la cadera, capucha con piel sintética desmontable y bolsillos de carga.",
    material:"Algodón encerado", sizes:"M–XXL",
    img:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=700&q=80"
  }
];

const fmt = n => "$" + n.toLocaleString("es-AR");

/* ===================== RENDER CATALOG ===================== */
const grid = document.getElementById("productGrid");
function renderGrid(filter="todas"){
  grid.innerHTML = "";
  const list = filter === "todas" ? products : products.filter(p => p.cat === filter);
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-media">
        <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(160deg,#2a2118,#161a16)';">
        <div class="card-price-tag">${fmt(p.price)}</div>
        <div class="card-cat">${p.cat}</div>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card-meta"><span>${p.material}</span><span>Talles ${p.sizes}</span></div>
        <div class="card-actions">
          <button class="add-btn" data-id="${p.id}">Agregar</button>
          <button class="wish-btn" aria-label="Favorito">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.7-10-9.3C.5 8 2.4 4 6.4 4c2 0 3.6 1.2 4.6 2.7C12 5.2 13.6 4 15.6 4c4 0 5.9 4 4.4 7.7C19.5 16.3 12 21 12 21z"/></svg>
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
renderGrid();

document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if(!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGrid(btn.dataset.filter);
});

/* ===================== CART ===================== */
let cart = [];
const cartBadge = document.getElementById("cartBadge");
const drawerItems = document.getElementById("drawerItems");
const drawerTotal = document.getElementById("drawerTotal");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkoutBtn");

function openDrawer(){ drawer.classList.add("open"); overlay.classList.add("open"); }
function closeDrawer(){ drawer.classList.remove("open"); overlay.classList.remove("open"); }

document.getElementById("cartBtn").addEventListener("click", openDrawer);
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

grid.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if(!btn) return;
  const id = Number(btn.dataset.id);
  addToCart(id);
});

function addToCart(id){
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if(existing){ existing.qty++; } else { cart.push({...product, qty:1}); }
  updateCart();
  showToast(`Agregado: ${product.name}`);
}

function updateCart(){
  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  cartBadge.textContent = totalQty;

  if(cart.length === 0){
    drawerItems.innerHTML = '<div class="drawer-empty">Todavía no agregaste ninguna campera.</div>';
  } else {
    drawerItems.innerHTML = cart.map(i => `
      <div class="drawer-item">
        <img src="${i.img}" alt="${i.name}" onerror="this.style.background='#222'; this.src='';">
        <div class="drawer-item-info">
          <h4>${i.name}</h4>
          <span>${fmt(i.price)} c/u</span>
          <div class="qty-ctrl">
            <button data-id="${i.id}" data-action="dec">−</button>
            <span class="mono">${i.qty}</span>
            <button data-id="${i.id}" data-action="inc">+</button>
          </div>
          <div class="drawer-item-price">${fmt(i.price * i.qty)}</div>
          <button class="remove-item" data-id="${i.id}" data-action="remove">Quitar</button>
        </div>
      </div>`).join("");
  }

  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  drawerTotal.textContent = fmt(total);

  const msg = cart.length
    ? `Hola! Quiero comprar: ${cart.map(i => `${i.name} x${i.qty}`).join(", ")}. Total ${fmt(total)}`
    : `Hola! Quiero consultar por una campera`;
  checkoutBtn.href = `https://wa.me/5491122334455?text=${encodeURIComponent(msg)}`;
}

drawerItems.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const item = cart.find(i => i.id === id);
  if(!item) return;
  const action = btn.dataset.action;
  if(action === "inc") item.qty++;
  if(action === "dec") item.qty = Math.max(1, item.qty - 1);
  if(action === "remove") cart = cart.filter(i => i.id !== id);
  updateCart();
});

/* ===================== TOAST ===================== */
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
let toastTimer;
function showToast(text){
  toastMsg.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ===================== TESTIMONIALS SLIDER ===================== */
const slides = document.querySelectorAll(".testi-slide");
const testiNav = document.getElementById("testiNav");
let testiIndex = 0;
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "testi-dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => showTesti(i));
  testiNav.appendChild(dot);
});
function showTesti(i){
  slides[testiIndex].classList.remove("active");
  testiNav.children[testiIndex].classList.remove("active");
  testiIndex = i;
  slides[testiIndex].classList.add("active");
  testiNav.children[testiIndex].classList.add("active");
}
setInterval(() => showTesti((testiIndex + 1) % slides.length), 5500);

/* ===================== CONTACT FORM ===================== */
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const msg = document.getElementById("cMsg").value.trim();
  const box = document.getElementById("formMsg");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  box.classList.remove("show","ok","err");
  if(!name || !emailOk || !msg){
    box.textContent = "Revisá los campos: nombre, un email válido y tu mensaje son obligatorios.";
    box.classList.add("show","err");
    return;
  }
  box.textContent = "¡Gracias " + name.split(" ")[0] + "! Recibimos tu mensaje y te respondemos a la brevedad.";
  box.classList.add("show","ok");
  e.target.reset();
});

/* ===================== NEWSLETTER ===================== */
document.getElementById("newsBtn").addEventListener("click", () => {
  const val = document.getElementById("newsEmail").value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  showToast(emailOk ? "¡Listo! Ya estás suscripto." : "Ingresá un email válido.");
  if(emailOk) document.getElementById("newsEmail").value = "";
});

/* ===================== MOBILE MENU ===================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  const open = navLinks.style.display === "flex";
  navLinks.style.display = open ? "none" : "flex";
  navLinks.style.cssText += `
    position:absolute; top:76px; left:0; right:0; background:${open ? '' : 'var(--bg-2)'};
    flex-direction:column; padding:20px 28px; border-bottom:1px solid var(--border); gap:18px;
  `;
});

updateCart();
