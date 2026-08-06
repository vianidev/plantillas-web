
/* =====================================================
   DATOS DE EJEMPLO — reemplazar por looks reales
   ===================================================== */
const LOOKS = [
  {id:1, name:"[Nombre conceptual del look]", coll:"capsula", size:"lg", price:0, sizes:["S","M","L"], colors:["#15120E","#B4854C"]},
  {id:2, name:"[Nombre conceptual del look]", coll:"otono", size:"sm", price:0, sizes:["S","M"], colors:["#7A3630"]},
  {id:3, name:"[Nombre conceptual del look]", coll:"total-black", size:"md", price:0, sizes:["M","L","XL"], colors:["#15120E"]},
  {id:4, name:"[Nombre conceptual del look]", coll:"capsula", size:"sm", price:0, sizes:["S","M","L"], colors:["#B4854C","#15120E"]},
  {id:5, name:"[Nombre conceptual del look]", coll:"otono", size:"md", price:0, sizes:["S","M","L"], colors:["#7A3630","#15120E"]},
  {id:6, name:"[Nombre conceptual del look]", coll:"total-black", size:"sm", price:0, sizes:["M","L"], colors:["#15120E"]},
];

let activeColl = "todas";
let bag = [];

const looksGrid = document.getElementById('looksGrid');

function money(n){ return "$" + n; }

function renderLooks(){
  const filtered = LOOKS.filter(l => activeColl === "todas" || l.coll === activeColl);
  looksGrid.innerHTML = filtered.map((l, i) => `
    <article class="look-card ${l.size === 'lg' ? 'size-lg' : (l.size === 'sm' ? 'size-sm' : '')}" data-id="${l.id}">
      <div class="look-photo">
        <span class="lbl">Foto perchero /<br>fondo neutro</span>
      </div>
      <div class="look-photo model">
        <span class="lbl">Foto con modelo /<br>estilo de vida</span>
      </div>
      <span class="look-tag mono">LOOK ${String(i+1).padStart(2,'0')}</span>
      <div class="look-info">
        <h3>${l.name}</h3>
        <p class="look-price">${money(l.price)} · Ver detalle</p>
      </div>
    </article>
  `).join('');
}

document.getElementById('collectionFilters').addEventListener('click', e=>{
  const btn = e.target.closest('[data-coll]');
  if(!btn) return;
  activeColl = btn.dataset.coll;
  document.querySelectorAll('#collectionFilters .filter-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderLooks();
});

looksGrid.addEventListener('click', e=>{
  const card = e.target.closest('.look-card');
  if(card) openQuickView(LOOKS.find(l => l.id == card.dataset.id));
});

renderLooks();

/* =====================================================
   HEADER — sólido al hacer scroll
   ===================================================== */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('scrolled', window.scrollY > 60);
});

/* =====================================================
   MENÚ FULLSCREEN
   ===================================================== */
const navOverlay = document.getElementById('navOverlay');
document.getElementById('navOpen').addEventListener('click', ()=> navOverlay.classList.add('show'));
document.getElementById('navClose').addEventListener('click', ()=> navOverlay.classList.remove('show'));
navOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> navOverlay.classList.remove('show')));

/* =====================================================
   HERO SLIDER
   ===================================================== */
const slides = document.querySelectorAll('.slide');
const dotsWrap = document.getElementById('sliderDots');
let currentSlide = 0;
let sliderTimer;

slides.forEach((s,i)=>{
  const dot = document.createElement('button');
  if(i===0) dot.classList.add('active');
  dot.addEventListener('click', ()=> goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(i){
  slides[currentSlide].classList.remove('active');
  dotsWrap.children[currentSlide].classList.remove('active');
  currentSlide = i;
  slides[currentSlide].classList.add('active');
  dotsWrap.children[currentSlide].classList.add('active');
}
function nextSlide(){ goToSlide((currentSlide + 1) % slides.length); }
function startSlider(){ sliderTimer = setInterval(nextSlide, 5500); }
startSlider();

/* =====================================================
   SHOP THE LOOK — hotspots
   ===================================================== */
document.querySelectorAll('.hotspot').forEach(hs=>{
  hs.addEventListener('click', e=>{
    e.stopPropagation();
    const id = hs.dataset.hotspot;
    const card = document.getElementById('hcard-' + id);
    const isOpen = card.classList.contains('show');
    document.querySelectorAll('.hotspot-card').forEach(c=>c.classList.remove('show'));
    document.querySelectorAll('.hotspot').forEach(h=>h.classList.remove('open'));
    if(!isOpen){ card.classList.add('show'); hs.classList.add('open'); }
  });
});
document.addEventListener('click', ()=>{
  document.querySelectorAll('.hotspot-card').forEach(c=>c.classList.remove('show'));
  document.querySelectorAll('.hotspot').forEach(h=>h.classList.remove('open'));
});
document.querySelectorAll('[data-quickview]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    e.stopPropagation();
    const id = Number(btn.dataset.quickview);
    openQuickView(LOOKS.find(l=>l.id === id) || LOOKS[0]);
  });
});

/* =====================================================
   QUICK VIEW MODAL
   ===================================================== */
const qvModal = document.getElementById('qvModal');
const overlay = document.getElementById('overlay');
let currentQV = null, qvSize = null, qvColor = null;

function openQuickView(look){
  currentQV = look;
  qvSize = look.sizes[0];
  qvColor = look.colors[0];

  document.getElementById('qvCollection').textContent = "Colección — " + look.coll;
  document.getElementById('qvName').textContent = look.name;
  document.getElementById('qvPrice').textContent = money(look.price);

  document.getElementById('qvSizes').innerHTML = look.sizes.map((s,i)=>`
    <button class="qv-size-chip ${i===0?'selected':''}" data-size="${s}">${s}</button>
  `).join('');
  document.getElementById('qvColors').innerHTML = look.colors.map((c,i)=>`
    <button class="qv-color ${i===0?'selected':''}" data-color="${c}" style="background:${c}"></button>
  `).join('');
  document.getElementById('qvThumbs').innerHTML = ['Look','Detalle','Textil'].map((l,i)=>`
    <button class="qv-thumb ${i===0?'active':''}" data-thumb="${l}">${l}</button>
  `).join('');
  document.getElementById('qvMainPhoto').textContent = '[ FOTO LOOK — reemplazar ]';

  qvModal.classList.add('show');
  overlay.classList.add('show');
}
function closeQV(){ qvModal.classList.remove('show'); overlay.classList.remove('show'); }
document.getElementById('qvClose').addEventListener('click', closeQV);

document.getElementById('qvSizes').addEventListener('click', e=>{
  const b = e.target.closest('.qv-size-chip'); if(!b) return;
  document.querySelectorAll('.qv-size-chip').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected'); qvSize = b.dataset.size;
});
document.getElementById('qvColors').addEventListener('click', e=>{
  const b = e.target.closest('.qv-color'); if(!b) return;
  document.querySelectorAll('.qv-color').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected'); qvColor = b.dataset.color;
});
document.getElementById('qvThumbs').addEventListener('click', e=>{
  const b = e.target.closest('.qv-thumb'); if(!b) return;
  document.querySelectorAll('.qv-thumb').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById('qvMainPhoto').textContent = `[ FOTO ${b.dataset.thumb.toUpperCase()} — reemplazar ]`;
});
document.getElementById('qvAddBtn').addEventListener('click', ()=>{
  addToBag(currentQV, qvSize, qvColor);
  closeQV();
});

/* =====================================================
   BOLSA
   ===================================================== */
const bagDrawer = document.getElementById('bagDrawer');
const bagItemsEl = document.getElementById('bagItems');
const bagCountEl = document.getElementById('bagCount');
const bagTotalEl = document.getElementById('bagTotal');

function addToBag(look, size, color){
  bag.push({...look, size, color, uid: Date.now()+Math.random()});
  renderBag();
  showToast(`${look.name} agregado a la bolsa`);
}
function removeFromBag(uid){
  bag = bag.filter(i=>i.uid != uid);
  renderBag();
}
function renderBag(){
  bagCountEl.textContent = bag.length;
  if(bag.length === 0){
    bagItemsEl.innerHTML = '<p class="bag-empty">Todavía no agregaste piezas.</p>';
    bagTotalEl.textContent = money(0);
    return;
  }
  bagItemsEl.innerHTML = bag.map(item=>`
    <div class="bag-item">
      <div class="thumb"></div>
      <div>
        <div class="bi-name">${item.name}</div>
        <div class="bi-meta">${item.size ? 'Talle ' + item.size : ''} · ${money(item.price)}</div>
        <button class="remove-btn" data-remove="${item.uid}">Quitar</button>
      </div>
    </div>
  `).join('');
  const total = bag.reduce((s,i)=>s+i.price,0);
  bagTotalEl.textContent = money(total);
}
bagItemsEl.addEventListener('click', e=>{
  const b = e.target.closest('[data-remove]');
  if(b) removeFromBag(b.dataset.remove);
});
function openBag(){ bagDrawer.classList.add('open'); overlay.classList.add('show'); }
function closeBag(){ bagDrawer.classList.remove('open'); overlay.classList.remove('show'); }
document.getElementById('bagToggle').addEventListener('click', openBag);
document.getElementById('closeBag').addEventListener('click', closeBag);

overlay.addEventListener('click', ()=>{ closeBag(); closeQV(); });
window.addEventListener('keydown', e=>{ if(e.key === 'Escape'){ closeBag(); closeQV(); navOverlay.classList.remove('show'); } });

/* =====================================================
   NEWSLETTER
   ===================================================== */
document.getElementById('newsletterForm').addEventListener('submit', e=>{
  e.preventDefault();
  document.getElementById('newsletterMsg').textContent = "¡Listo! Revisá tu email — te llega el código [PONER CÓDIGO] con tu descuento.";
  e.target.reset();
});

/* =====================================================
   TOAST
   ===================================================== */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2200);
}
