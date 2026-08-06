
/* =====================================================
   DATOS DE EJEMPLO — reemplazar por productos reales
   ===================================================== */
const PRODUCTS = [
  {id:1, name:"[Nombre de la prenda]", cat:"remeras", catLabel:"Remeras", price:0, oldPrice:0, sizes:["S","M","L","XL"], colors:["#17140F","#8A8168"], sku:"REM-001"},
  {id:2, name:"[Nombre de la prenda]", cat:"remeras", catLabel:"Remeras", price:0, oldPrice:null, sizes:["S","M","L"], colors:["#2B3EFF","#F6F4EC"], sku:"REM-002"},
  {id:3, name:"[Nombre de la prenda]", cat:"pantalones", catLabel:"Pantalones", price:0, oldPrice:0, sizes:["S","M","L","XL"], colors:["#17140F"], sku:"PAN-001"},
  {id:4, name:"[Nombre de la prenda]", cat:"pantalones", catLabel:"Pantalones", price:0, oldPrice:null, sizes:["M","L","XL"], colors:["#8A8168","#17140F"], sku:"PAN-002"},
  {id:5, name:"[Nombre de la prenda]", cat:"calzado", catLabel:"Calzado", price:0, oldPrice:null, sizes:["S","M","L"], colors:["#F6F4EC","#17140F"], sku:"CAL-001"},
  {id:6, name:"[Nombre de la prenda]", cat:"calzado", catLabel:"Calzado", price:0, oldPrice:0, sizes:["M","L"], colors:["#17140F"], sku:"CAL-002"},
  {id:7, name:"[Nombre de la prenda]", cat:"remeras", catLabel:"Remeras", price:0, oldPrice:null, sizes:["S","M","L","XL"], colors:["#8A8168"], sku:"REM-003"},
  {id:8, name:"[Nombre de la prenda]", cat:"pantalones", catLabel:"Pantalones", price:0, oldPrice:null, sizes:["S","M"], colors:["#2B3EFF"], sku:"PAN-003"},
  {id:9, name:"[Nombre de la prenda]", cat:"calzado", catLabel:"Calzado", price:0, oldPrice:0, sizes:["S","L","XL"], colors:["#17140F","#8A8168"], sku:"CAL-003"},
];

let activeCat = "todos";
let activeSize = "todos";
let cart = [];

const productGrid = document.getElementById('productGrid');
const resultsCount = document.getElementById('resultsCount');

function money(n){ return "$" + n; }

function renderGrid(){
  const filtered = PRODUCTS.filter(p=>{
    const catOk = activeCat === "todos" || p.cat === activeCat;
    const sizeOk = activeSize === "todos" || p.sizes.includes(activeSize);
    return catOk && sizeOk;
  });

  resultsCount.textContent = filtered.length + (filtered.length === 1 ? " producto" : " productos");

  if(filtered.length === 0){
    productGrid.innerHTML = '<div class="empty-state">No hay productos que coincidan con estos filtros.</div>';
    return;
  }

  productGrid.innerHTML = filtered.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-photo">
        <div class="crop-corner tl"></div><div class="crop-corner tr"></div>
        <div class="crop-corner bl"></div><div class="crop-corner br"></div>
        <span class="field-tag">[FOTO]</span>
        ${p.oldPrice ? '<span class="sale-tag">OFERTA</span>' : ''}
        <div class="photo-label">Foto del producto<br>(fondo neutro / modelo)</div>
        <button class="quick-add" data-quickadd="${p.id}">Agregar rápido</button>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.catLabel}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="price-row">
          <span class="price-now">${money(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

/* Filtros de categoría */
document.getElementById('categoryFilters').addEventListener('click', e=>{
  const btn = e.target.closest('[data-filter-cat]');
  if(!btn) return;
  activeCat = btn.dataset.filterCat;
  document.querySelectorAll('#categoryFilters .filter-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
});

/* Filtros de talle */
document.getElementById('sizeFilters').addEventListener('click', e=>{
  const btn = e.target.closest('[data-filter-size]');
  if(!btn) return;
  activeSize = btn.dataset.filterSize;
  document.querySelectorAll('#sizeFilters .filter-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
});

/* Click en tarjeta -> abrir modal / quick add */
productGrid.addEventListener('click', e=>{
  const quickBtn = e.target.closest('[data-quickadd]');
  if(quickBtn){
    e.stopPropagation();
    const p = PRODUCTS.find(x=>x.id == quickBtn.dataset.quickadd);
    addToCart(p, p.sizes[0], null);
    return;
  }
  const card = e.target.closest('.product-card');
  if(card) openModal(PRODUCTS.find(p=>p.id == card.dataset.id));
});

/* =====================================================
   MODAL DE PRODUCTO
   ===================================================== */
const modal = document.getElementById('productModal');
const overlay = document.getElementById('overlay');
let currentModalProduct = null;
let selectedSize = null;
let selectedColor = null;

function openModal(p){
  currentModalProduct = p;
  selectedSize = p.sizes[0];
  selectedColor = p.colors[0];

  document.getElementById('modalCat').textContent = p.catLabel;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalSku').textContent = "Código: " + p.sku;
  document.getElementById('modalPrice').textContent = money(p.price);
  document.getElementById('modalOldPrice').textContent = p.oldPrice ? money(p.oldPrice) : '';
  document.getElementById('modalStock').textContent = "Stock disponible: [poner cantidad]";

  document.getElementById('modalSizes').innerHTML = p.sizes.map((s,i)=>`
    <button class="size-chip ${i===0?'selected':''}" data-size="${s}">${s}</button>
  `).join('');

  document.getElementById('modalColors').innerHTML = p.colors.map((c,i)=>`
    <button class="color-chip ${i===0?'selected':''}" data-color="${c}" style="background:${c}"></button>
  `).join('');

  document.getElementById('modalThumbs').innerHTML = ['Frente','Espalda','Textil'].map((label,i)=>`
    <button class="modal-thumb ${i===0?'active':''}" data-thumb="${label}">${label}</button>
  `).join('');
  document.getElementById('modalMainPhotoLabel').textContent = '[ FOTO FRENTE — subir imagen ]';

  modal.classList.add('show');
  overlay.classList.add('show');
}

document.getElementById('modalSizes').addEventListener('click', e=>{
  const btn = e.target.closest('.size-chip'); if(!btn) return;
  document.querySelectorAll('.size-chip').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSize = btn.dataset.size;
});
document.getElementById('modalColors').addEventListener('click', e=>{
  const btn = e.target.closest('.color-chip'); if(!btn) return;
  document.querySelectorAll('.color-chip').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedColor = btn.dataset.color;
});
document.getElementById('modalThumbs').addEventListener('click', e=>{
  const btn = e.target.closest('.modal-thumb'); if(!btn) return;
  document.querySelectorAll('.modal-thumb').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('modalMainPhotoLabel').textContent = `[ FOTO ${btn.dataset.thumb.toUpperCase()} — subir imagen ]`;
});

document.getElementById('modalAddBtn').addEventListener('click', ()=>{
  addToCart(currentModalProduct, selectedSize, selectedColor);
  closeModal();
});

function closeModal(){
  modal.classList.remove('show');
  overlay.classList.remove('show');
}
document.getElementById('closeModal').addEventListener('click', closeModal);

/* =====================================================
   CARRITO
   ===================================================== */
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');

function addToCart(p, size, color){
  cart.push({...p, size, color, uid: Date.now()+Math.random()});
  renderCart();
  showToast(`${p.name} agregado al carrito`);
}

function removeFromCart(uid){
  cart = cart.filter(i => i.uid != uid);
  renderCart();
}

function renderCart(){
  cartCountEl.textContent = cart.length;
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p class="cart-empty">Todavía no agregaste productos.</p>';
    cartTotalEl.textContent = money(0);
    return;
  }
  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="thumb"></div>
      <div class="ci-info">
        <div class="name">${item.name}</div>
        <div class="meta">${item.size ? 'Talle ' + item.size : ''}${item.color ? ' · Color' : ''} · ${money(item.price)}</div>
        <button class="remove-btn" data-remove="${item.uid}">Quitar</button>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((sum,i)=> sum + i.price, 0);
  cartTotalEl.textContent = money(total);
}

cartItemsEl.addEventListener('click', e=>{
  const btn = e.target.closest('[data-remove]');
  if(btn) removeFromCart(btn.dataset.remove);
});

function openCart(){ cartDrawer.classList.add('open'); overlay.classList.add('show'); }
function closeCart(){ cartDrawer.classList.remove('open'); overlay.classList.remove('show'); }
document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);

/* Overlay cierra todo lo abierto */
overlay.addEventListener('click', ()=>{
  closeCart();
  closeModal();
  document.getElementById('mainNav').classList.remove('open');
});
window.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){ closeCart(); closeModal(); }
});

/* Menú mobile */
document.getElementById('menuToggle').addEventListener('click', ()=>{
  document.getElementById('mainNav').classList.toggle('open');
  overlay.classList.toggle('show');
});

/* Toast */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2200);
}

/* Init */
renderGrid();
