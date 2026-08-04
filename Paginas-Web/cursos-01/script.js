(function(){
  "use strict";

  /* ---------- Announcement bar ---------- */
  var announceBar = document.getElementById('announceBar');
  var closeAnnounce = document.getElementById('closeAnnounce');
  closeAnnounce.addEventListener('click', function(){
    announceBar.style.display = 'none';
  });

  /* ---------- Sticky navbar + mobile menu ---------- */
  var navbar = document.getElementById('navbar');
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');

  function onScroll(){
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    var progress = document.getElementById('scrollProgress');
    var h = document.documentElement;
    var scrollPct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight) * 100;
    progress.style.width = scrollPct + '%';

    var toTop = document.getElementById('toTop');
    toTop.classList.toggle('show', window.scrollY > 700);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  navToggle.addEventListener('click', function(){
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  document.getElementById('toTop').addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal:not(.is-visible)');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------- Hero cursor spotlight ---------- */
  var hero = document.querySelector('.hero');
  var spot = document.getElementById('heroSpot');
  if(hero && window.matchMedia('(hover:hover)').matches){
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      spot.style.setProperty('--x', (e.clientX - r.left) + 'px');
      spot.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- Hero typing animation ---------- */
  var typeTarget = document.getElementById('typeTarget');
  var codeLines = [
    '<span class="tok-com">// tu plan de carrera</span>',
    '<span class="tok-key">const</span> <span class="tok-var">alumno</span> = {',
    '&nbsp;&nbsp;nivel: <span class="tok-str">"cero"</span>,',
    '&nbsp;&nbsp;meta: <span class="tok-str">"primer cliente"</span>,',
    '&nbsp;&nbsp;plazo: <span class="tok-str">"90 días"</span>',
    '};',
    '',
    '<span class="tok-fn">compilar</span>(<span class="tok-var">alumno</span>);',
    '<span class="tok-com">// ✔ build exitoso</span>'
  ];
  function typeCode(){
    var out = '';
    var li = 0;
    function typeLine(){
      if(li >= codeLines.length){
        typeTarget.innerHTML = out + '<span class="caret"></span>';
        return;
      }
      out += (li>0 ? '<br>' : '') + '<span class="ln">' + String(li+1).padStart(2,'0') + '</span>' + codeLines[li];
      typeTarget.innerHTML = out + '<span class="caret"></span>';
      li++;
      setTimeout(typeLine, 220);
    }
    typeLine();
  }
  setTimeout(typeCode, 400);

  /* ---------- Timeline progress ---------- */
  var timeline = document.getElementById('timeline');
  var timelineFill = document.getElementById('timelineFill');
  var steps = document.querySelectorAll('.tl-step');
  function updateTimeline(){
    if(!timeline) return;
    var r = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = r.height;
    var visible = Math.min(Math.max(vh*0.75 - r.top, 0), total);
    var pct = Math.min(100, (visible/total)*100);
    timelineFill.style.setProperty('height', pct + '%');
    steps.forEach(function(step, i){
      var sr = step.getBoundingClientRect();
      if(sr.top < vh*0.8) step.classList.add('is-visible');
    });
  }
  document.addEventListener('scroll', updateTimeline, {passive:true});
  updateTimeline();

  /* ---------- Animated counters ---------- */
  var counted = false;
  var statsGrid = document.getElementById('statsGrid');
  function animateCounters(){
    if(counted) return;
    counted = true;
    document.querySelectorAll('.num[data-count]').forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var start = 0;
      var dur = 1400;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progress = Math.min((ts-startTime)/dur, 1);
        var eased = 1 - Math.pow(1-progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('es-AR');
        if(progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('es-AR');
      }
      requestAnimationFrame(step);
    });
  }
  if(statsGrid){
    var statsIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) animateCounters(); });
    }, {threshold:.4});
    statsIO.observe(statsGrid);
  }

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById('testiTrack');
  var dotsWrap = document.getElementById('testiDots');
  var cards = track.children.length;
  function perView(){
    return window.innerWidth <= 900 ? 1 : 3;
  }
  var page = 0;
  function totalPages(){ return Math.max(1, cards - perView() + 1); }
  function renderDots(){
    dotsWrap.innerHTML = '';
    for(var i=0; i<totalPages(); i++){
      var b = document.createElement('button');
      if(i===page) b.classList.add('active');
      b.addEventListener('click', function(idx){ return function(){ page = idx; update(); }; }(i));
      dotsWrap.appendChild(b);
    }
  }
  function update(){
    var cardWidth = track.children[0].getBoundingClientRect().width + 22;
    track.style.transform = 'translateX(' + (-page*cardWidth) + 'px)';
    Array.from(dotsWrap.children).forEach(function(d,i){ d.classList.toggle('active', i===page); });
  }
  renderDots();
  var testiTimer = setInterval(function(){
    page = (page+1) % totalPages();
    update();
  }, 4500);
  window.addEventListener('resize', function(){ page=0; renderDots(); update(); });

  /* ---------- Video play toggle (cosmetic) ---------- */
  var videoShell = document.getElementById('videoShell');
  videoShell.addEventListener('click', function(){
    videoShell.classList.toggle('playing');
  });

  /* ---------- Billing toggle ---------- */
  var billingSwitch = document.getElementById('billingSwitch');
  var yearly = false;
  billingSwitch.addEventListener('click', function(){
    yearly = !yearly;
    billingSwitch.classList.toggle('on', yearly);
    document.querySelectorAll('.amount').forEach(function(el){
      var val = yearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
      el.textContent = '$' + val;
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(item.classList.contains('open')){
      a.style.maxHeight = a.scrollHeight + 'px';
    }
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Countdown timer ---------- */
  var deadline = new Date().getTime() + (2*3600 + 35*60 + 18) * 1000;
  function updateCountdown(){
    var diff = Math.max(0, deadline - new Date().getTime());
    var h = Math.floor(diff/3600000);
    var m = Math.floor((diff%3600000)/60000);
    var s = Math.floor((diff%60000)/1000);
    document.getElementById('cdH').textContent = String(h).padStart(2,'0');
    document.getElementById('cdM').textContent = String(m).padStart(2,'0');
    document.getElementById('cdS').textContent = String(s).padStart(2,'0');
    if(diff > 0) setTimeout(updateCountdown, 1000);
  }
  updateCountdown();

  /* ---------- Fake purchase notification ---------- */
  var names = ['Juan', 'Camila', 'Martín', 'Valentina', 'Lucas', 'Rocío', 'Federico', 'Agustina'];
  var courses = ['el curso de Desarrollo Web', 'la mentoría 1 a 1', 'el plan Profesional', 'el pack de plantillas'];
  var toast = document.getElementById('fakeToast');
  var toastName = document.getElementById('toastName');
  var toastTime = document.getElementById('toastTime');
  function showToast(){
    var n = names[Math.floor(Math.random()*names.length)];
    var c = courses[Math.floor(Math.random()*courses.length)];
    toastName.textContent = n + ' compró ' + c;
    toastTime.textContent = 'Hace ' + (Math.floor(Math.random()*8)+1) + ' minutos';
    toast.classList.add('show');
    setTimeout(function(){ toast.classList.remove('show'); }, 5000);
  }
  setTimeout(showToast, 6000);
  setInterval(showToast, 22000);

  /* ---------- Newsletter (cosmetic) ---------- */
  document.getElementById('newsBtn').addEventListener('click', function(){
    var input = this.previousElementSibling;
    if(input.value && input.value.includes('@')){
      this.textContent = '¡Listo!';
      input.value = '';
      setTimeout(function(){ document.getElementById('newsBtn').textContent = 'Unirme'; }, 2500);
    } else {
      input.focus();
    }
  });

})();