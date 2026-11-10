document.documentElement.classList.add('js');

// ── WhatsApp ──
var WA = '573195037492';
var WA_MSG = 'Hola, quiero agendar una cita en la Clínica de la Eléctrica';
document.querySelectorAll('.wa-link').forEach(function(a){
  a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(a.dataset.msg || WA_MSG);
});
document.getElementById('yr').textContent = new Date().getFullYear();

// Un solo estado para el menú y su etiqueta accesible.
(function(){
  var header = document.getElementById('topnav');
  var burger = header.querySelector('.burger');
  function setMenu(open, restoreFocus){
    header.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (restoreFocus) burger.focus();
  }
  burger.addEventListener('click', function(){
    setMenu(!header.classList.contains('open'), false);
  });
  header.querySelectorAll('nav a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false, false); });
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && header.classList.contains('open')) {
      setMenu(false, true);
    }
  });
  document.addEventListener('click', function(e){
    if (!header.contains(e.target)) setMenu(false, false);
  });
  window.addEventListener('resize', function(){
    if (window.innerWidth > 980) setMenu(false, false);
  });
})();

// ── 01 Despiece interactivo ──
if (document.getElementById('moto')) {
var PARTS = [
  {t:'Batería de litio o plomo', d:'Revisamos estado, voltaje, conexiones y cuánta autonomía real le queda.', x:418, y:282},
  {t:'Motor', d:'El motor va en la rueda trasera. Revisamos ruidos, fuerza, sensores y rodamientos.', x:676, y:330},
  {t:'Controlador', d:'Es el cerebro: reparte la energía de la batería al motor. Revisamos fallas y cortes.', x:597, y:288},
  {t:'Carga', d:'Cargador, puerto y cables. Si tu moto no carga o carga lento, aquí está la pista.', x:445, y:244},
  {t:'Frenos', d:'Pastillas, discos y el sensor que corta el motor al frenar.', x:228, y:340},
  {t:'Suspensión', d:'Amortiguadores delanteros y traseros: golpes, fugas y ajuste.', x:240, y:196},
  {t:'Llantas y rodamientos', d:'Desgaste, presión, pinchazos y rodamientos de las ruedas.', x:134, y:420},
  {t:'Tablero y controles', d:'Pantalla, acelerador, botones y manubrio.', x:282, y:44},
  {t:'Luces e instalación', d:'Luces, direccionales, pito y todo el cableado de la moto.', x:262, y:118},
  {t:'Chasis y carrocería', d:'Estructura, tornillería, piso y piezas plásticas.', x:600, y:262}
];
var svg = document.getElementById('moto'), hots = document.getElementById('hots'), list = document.getElementById('plist');
var NS = 'http://www.w3.org/2000/svg', cur = 0, timer, HR = window.innerWidth < 600 ? 24 : 16;
var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
var paused = motionQuery.matches;
var pauseButton = document.getElementById('part-pause');
function syncPlayback(){
  clearInterval(timer);
  pauseButton.textContent = paused ? 'Reanudar recorrido' : 'Pausar recorrido';
  pauseButton.setAttribute('aria-pressed', String(paused));
  if (!paused) timer = setInterval(next, 3800);
}
function pausePlayback(){
  paused = true;
  syncPlayback();
}
PARTS.forEach(function(p, i){
  var g = document.createElementNS(NS,'g'); g.setAttribute('class','hot'); g.dataset.i = i;
  g.setAttribute('role', 'button');
  g.setAttribute('tabindex', '0');
  g.setAttribute('aria-label', p.t);
  g.setAttribute('aria-controls', 'part-details');
  g.innerHTML = '<circle class="ring" cx="'+p.x+'" cy="'+p.y+'" r="'+HR+'"/><circle class="dot" cx="'+p.x+'" cy="'+p.y+'" r="'+HR+'"/><text x="'+p.x+'" y="'+(p.y+1)+'"'+(HR>16?' style="font-size:19px"':'')+'>'+String(i+1).padStart(2,'0')+'</text>';
  g.addEventListener('click', function(){ show(i, true); });
  g.addEventListener('focus', pausePlayback);
  g.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      show(i, true);
    }
  });
  hots.appendChild(g);
  var li = document.createElement('li');
  var button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-controls', 'part-details');
  button.innerHTML = '<span aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span>'+p.t;
  button.addEventListener('click', function(){ show(i, true); });
  button.addEventListener('focus', pausePlayback);
  li.appendChild(button);
  list.appendChild(li);
});
function show(i, user){
  cur = i;
  svg.classList.add('focus');
  svg.querySelectorAll('.part').forEach(function(el){ el.classList.toggle('on', +el.dataset.p === i+1); });
  hots.querySelectorAll('.hot').forEach(function(el){
    var selected = +el.dataset.i === i;
    el.classList.toggle('on', selected);
    el.setAttribute('aria-pressed', String(selected));
  });
  list.querySelectorAll('li').forEach(function(el, k){
    el.classList.toggle('on', k === i);
    el.querySelector('button').setAttribute('aria-pressed', String(k === i));
    if (k === i && window.innerWidth < 600) {
      list.scrollTo({left: el.offsetLeft - list.offsetLeft - 8, behavior: motionQuery.matches ? 'auto' : 'smooth'});
    }
  });
  document.getElementById('pc-n').textContent = String(i+1).padStart(2,'0');
  document.getElementById('pi-t').textContent = PARTS[i].t;
  document.getElementById('pi-d').textContent = PARTS[i].d;
  if (user) {
    pausePlayback();
    document.getElementById('part-status').textContent = PARTS[i].t + '. ' + PARTS[i].d;
  }
}
function next(){ if (!document.hidden) show((cur+1) % PARTS.length); }
pauseButton.addEventListener('click', function(){
  paused = !paused;
  syncPlayback();
});
motionQuery.addEventListener('change', function(e){
  if (e.matches) pausePlayback();
});
show(0);
syncPlayback();
}

// ── 04 Mantenimiento ──
(function(){
  var list=document.getElementById('mt-list'); if(!list) return;
  var li=[].slice.call(list.children), fill=document.getElementById('mt-fill'), st=document.getElementById('mt-st'), res=document.getElementById('mt-res'), busy=false, done=false;
  function run(){
    if(busy) return; busy=true; done=true;
    li.forEach(function(el){ el.className=''; }); fill.style.width='0%';
    st.textContent='Revisando…'; res.textContent='El técnico revisa la moto punto por punto…';
    li.forEach(function(el,k){
      setTimeout(function(){ el.classList.add('chk'); }, 650*k+200);
      setTimeout(function(){ el.classList.remove('chk'); el.classList.add('on'); fill.style.width=((k+1)/li.length*100)+'%';
        if(k===li.length-1){ st.textContent='Revisión completa'; res.innerHTML='<span style="color:var(--gd)">Lista para rodar otro año.</span> Te contamos todo lo que encontramos antes de hacer cualquier cambio.'; busy=false; }
      }, 650*k+650);
    });
  }
  var btn=document.getElementById('mt-run'), card=list.closest('.mt');
  btn.addEventListener('click', function(){
    var open=!card.classList.contains('open');
    card.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.querySelector('span').textContent = open ? 'Ocultar lista' : 'Ver qué revisamos';
    if(open){ setTimeout(run, 250); }
  });
})();

// ── Aparición al hacer scroll ──
var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold: .12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

// proceso animado
(function(){
  var st=[].slice.call(document.querySelectorAll('#steps .step')), fill=document.getElementById('steps-fill'), cur=0, t=null, vis=false, hold=false;
  if(!st.length) return;
  function go(i){ cur=i; st.forEach(function(s,k){ s.classList.toggle('on',k===i); }); fill.style.width=((i+1)*25)+'%'; }
  function tick(){ if(vis && !hold) go((cur+1)%st.length); }
  st.forEach(function(s,k){ s.addEventListener('mouseenter',function(){ hold=true; go(k); }); s.addEventListener('mouseleave',function(){ hold=false; }); s.addEventListener('click',function(){ go(k); }); });
  new IntersectionObserver(function(e){ vis=e[0].isIntersecting; }, {threshold:.3}).observe(document.getElementById('steps'));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    t=setInterval(tick,3200);
  }
})();
