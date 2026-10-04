/* Twinthos v9 motion layer. No dependencies. Scroll progress, section reveals, hero spotlight, workspace tour. */
(function(W){
'use strict';
var d=document,RM=W.matchMedia('(prefers-reduced-motion: reduce)');
if(RM.matches)return;
/* scroll progress */
var nav=d.querySelector('.nav');
if(nav){
  var bar=d.createElement('i');bar.className='nav-prog';bar.setAttribute('aria-hidden','true');nav.appendChild(bar);
  var tick=false,upd=function(){tick=false;var h=d.documentElement.scrollHeight-W.innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,W.scrollY/h):0).toFixed(4)+')';};
  W.addEventListener('scroll',function(){if(!tick){tick=true;W.requestAnimationFrame(upd);}},{passive:true});upd();
}
/* section reveals: headings mask up, leads and cards rise on a spring, staggered inside each group */
if('IntersectionObserver' in W){
  var groups=[].slice.call(d.querySelectorAll('.sec-head,.offers-head,.faq-wrap,.close-in,.offer-grid'));
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;io.unobserve(e.target);
    var els=e.target._rv||[];els.forEach(function(x,i){x.style.setProperty('--i',i);x.classList.add('rv-in');x.classList.remove('rv-pre');});
  });},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  groups.forEach(function(g){
    var els=[].slice.call(g.querySelectorAll('.eyebrow,.d1,.d2,.d3,.lead,.offer,.faq-l>*,.close-cta'));
    if(g.classList.contains('offer-grid'))els=[].slice.call(g.children);
    if(!els.length)return;
    els.forEach(function(x){x.classList.add('rv-pre');if(/(^|\s)d[123](\s|$)/.test(x.className))x.classList.add('rv-h');});
    g._rv=els;io.observe(g);
  });
}
/* hero spotlight follows the pointer on hover devices */
var hs=d.querySelector('.hs');
if(hs&&W.matchMedia('(hover:hover) and (pointer:fine)').matches){
  var px=0,py=0,pend=false;
  hs.addEventListener('pointermove',function(e){
    var r=hs.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;
    if(!pend){pend=true;W.requestAnimationFrame(function(){pend=false;hs.style.setProperty('--mx',px+'px');hs.style.setProperty('--my',py+'px');hs.classList.add('spot');});}
  },{passive:true});
  hs.addEventListener('pointerleave',function(){hs.classList.remove('spot');});
}
/* workspace tour: steps through the six parts until the visitor takes over */
var ws=d.querySelector('.ws');
if(ws&&'IntersectionObserver' in W){
  var items=[].slice.call(ws.querySelectorAll('.ws-list li')),cur=-1,timer=null,took=false,seen=false;
  var set=function(n,on){[].slice.call(ws.querySelectorAll('[data-n="'+n+'"]')).forEach(function(e){e.classList.toggle('hi',on);});};
  var clear=function(){items.forEach(function(li){set(li.dataset.n,false);});};
  var step=function(){if(took||d.hidden)return;if(cur>=0)set(items[cur].dataset.n,false);cur=(cur+1)%items.length;set(items[cur].dataset.n,true);};
  var stop=function(){took=true;clearInterval(timer);timer=null;};
  var grab=function(){if(!took){stop();}};
  items.forEach(function(li){['mouseenter','touchstart','click','focus'].forEach(function(ev){li.addEventListener(ev,grab,{passive:true});});});
  [].slice.call(ws.querySelectorAll('.wsx')).forEach(function(w){w.addEventListener('pointerdown',grab,{passive:true});});
  new IntersectionObserver(function(e){
    if(took)return;
    if(e[0].isIntersecting){if(!timer){step();timer=setInterval(step,2300);seen=true;}}
    else{clearInterval(timer);timer=null;if(seen)clear();cur=-1;}
  },{threshold:.45}).observe(ws.querySelector('.ws-grid')||ws);
}
})(window);
