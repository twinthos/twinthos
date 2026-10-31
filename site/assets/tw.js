/* Twinthos v8 site script. No dependencies. Nav, mobile menu, sticky CTA, enquiry form. */
(function(){
'use strict';
var d=document, W=window;
var STQ=W.matchMedia('(min-width: 900px)');

/* nav */
var nav=d.querySelector('.nav'), tog=d.querySelector('.nav-toggle'), links=d.getElementById('navLinks');
function onS(){nav&&nav.classList.toggle('scrolled',W.scrollY>8);}
W.addEventListener('scroll',onS,{passive:true});onS();
if(tog){
  var setNav=function(o){tog.setAttribute('aria-expanded',o);tog.setAttribute('aria-label',o?'Close menu':'Open menu');links.classList.toggle('open',o);};
  tog.addEventListener('click',function(){setNav(tog.getAttribute('aria-expanded')!=='true');});
  links.addEventListener('click',function(e){if(e.target.closest('a'))setNav(false);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&tog.getAttribute('aria-expanded')==='true'){setNav(false);tog.focus();}});
  STQ.addEventListener&&STQ.addEventListener('change',function(){setNav(false);});
}

/* mobile sticky call-to-action: appears once the hero button has scrolled away, hides at pricing and the closing call */
var stick=d.querySelector('.stick'), prime=d.querySelector('.hs-cta .btn');
if(stick&&prime&&'IntersectionObserver' in W){
  var vis={hero:true,end:false};
  var upd=function(){stick.classList.toggle('on',!vis.hero&&!vis.end);};
  new IntersectionObserver(function(e){vis.hero=e[0].isIntersecting;upd();},{rootMargin:'-68px 0px 0px 0px'}).observe(prime);
  var endEl=d.querySelector('#close');
  if(endEl)new IntersectionObserver(function(e){vis.end=e[0].isIntersecting;upd();},{threshold:.2}).observe(endEl);
}

/* ── enquiry form ── */
d.querySelectorAll('form[data-form]').forEach(function(f){
  var done=d.getElementById(f.dataset.done), fail=f.querySelector('.form-fail'), btn=f.querySelector('[type=submit]');
  var subj=f.querySelector('[name=_subject]');
  var LBL={fit:'Discovery call',audit:'Operations audit (£999)',managed:'Managed digital employee (£5,000 per month)',unsure:'Not sure yet'};
  var sel=f.querySelector('.interest');
  var sync=function(){var c=f.querySelector('[name=interest]:checked');if(!c)return;
    subj.value='Twinthos enquiry: '+LBL[c.value];
    d.querySelectorAll('[data-for]').forEach(function(e){e.hidden=e.dataset.for!==c.value;});};
  if(sel){
    var want=new URLSearchParams(location.search).get('interest');
    var r=want&&f.querySelector('[name=interest][value="'+want+'"]');
    if(r)r.checked=true;
    sel.addEventListener('change',sync);sync();
  }
  var check=function(i){
    var w=i.closest('.fld'),v=i.value.trim(),bad=!v||(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
    w.classList.toggle('err',bad);i.setAttribute('aria-invalid',bad?'true':'false');return !bad;
  };
  f.querySelectorAll('[required]').forEach(function(i){
    i.addEventListener('blur',function(){if(i.value.trim()||i.closest('.fld').classList.contains('err'))check(i);});
    i.addEventListener('input',function(){if(i.closest('.fld').classList.contains('err'))check(i);});
  });
  f.addEventListener('submit',function(e){
    e.preventDefault();var first=null;
    f.querySelectorAll('[required]').forEach(function(i){if(!check(i)&&!first)first=i;});
    var sum=f.querySelector('.form-sum');
    if(first){if(sum){sum.hidden=false;}first.focus();return;}
    if(sum)sum.hidden=true;
    if(f.querySelector('[name=_honey]').value)return;
    var o={};new FormData(f).forEach(function(v,k2){o[k2]=v;});
    if(o.interest)o.interest=LBL[o.interest]||o.interest;
    btn.disabled=true;var old=btn.innerHTML;btn.textContent='Sending…';fail.hidden=true;
    fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(o)})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||String(j.success)==='false')throw 0;});})
      .then(function(){f.hidden=true;done.hidden=false;var h=done.querySelector('h2');h.setAttribute('tabindex','-1');h.focus();})
      .catch(function(){fail.hidden=false;btn.disabled=false;btn.innerHTML=old;fail.focus();});
  });
});
})();

/* Twinthos timeline helper: one Web Animations track per element, one shared clock. No dependencies. */
(function(W){
'use strict';
var EO='cubic-bezier(.16,1,.3,1)',EI='cubic-bezier(.65,0,.35,1)',ES='cubic-bezier(.33,1,.68,1)';
/* closed-form spring step response (zeta .6, ~9% overshoot) as a CSS linear() easing; falls back to EO where unsupported */
var SP=(function(){
  try{if(!(W.CSS&&CSS.supports&&CSS.supports('animation-timing-function','linear(0,1)')))return EO;}catch(e){return EO;}
  var z=.6,w=12,wd=w*Math.sqrt(1-z*z),n=26,pts=[];
  for(var i=0;i<=n;i++){var t=i/n,v=1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z/Math.sqrt(1-z*z)*Math.sin(wd*t));pts.push(i===n?'1':(+v.toFixed(4)).toString());}
  return 'linear('+pts.join(',')+')';
})();
function TL(dur){this.dur=dur;this.a=[];this.master=null;this.bm=new Map();}
TL.prototype.clear=function(){this.a.forEach(function(x){try{x.cancel();}catch(e){}});this.a=[];this.master=null;this.bm.clear();};
/* read layout once, before any animation is created, to avoid layout thrash */
TL.prototype.prime=function(els){var m=this.bm;els.forEach(function(el){if(el)m.set(el,[el.offsetLeft,el.offsetTop]);});};
/* keys: [[t,{X,Y (absolute, via element base), x,y (raw px), r, s, sx, o, cp},ease]]; ease belongs to the segment ARRIVING at the key */
TL.prototype.mk=function(el,keys){
  if(!el)return null;
  var DUR=this.dur,bl=0,bt=0,need=keys.some(function(k){return k[1]&&(k[1].X!=null||k[1].Y!=null);});
  if(need){var b=this.bm.get(el);if(!b){b=[el.offsetLeft,el.offsetTop];this.bm.set(el,b);}bl=b[0];bt=b[1];}
  keys=keys.slice();
  if(keys[0][0]>0)keys.unshift([0,{},null]);
  if(keys[keys.length-1][0]<DUR)keys.push([DUR,{},null]);
  var cur={x:0,y:0,r:0,s:1,sx:1,sy:1,o:null,cp:null,bl:undefined},fr=[],lastT=0;
  keys.forEach(function(k){
    k=[Math.max(lastT,k[0]),k[1],k[2]];lastT=k[0];
    var s=k[1]||{};
    if(s.X!=null)cur.x=s.X-bl; if(s.Y!=null)cur.y=s.Y-bt;
    if(s.x!=null)cur.x=s.x; if(s.y!=null)cur.y=s.y;
    ['r','s','sx','sy','o','cp','bl'].forEach(function(f){if(s[f]!==undefined)cur[f]=s[f];});
    var f={offset:Math.max(0,Math.min(1,k[0]/DUR))};
    f.transform='translate3d('+cur.x+'px,'+cur.y+'px,0) rotate('+cur.r+'deg) scale('+(cur.sx*cur.s)+','+(cur.sy*cur.s)+')';
    if(cur.o!==null)f.opacity=cur.o;
    if(cur.cp!==null)f.clipPath=cur.cp;
    if(cur.bl!==undefined)f.filter='blur('+cur.bl+'px)';
    fr.push(f);
  });
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=el.animate(fr,{duration:DUR*1000,fill:'both',easing:'linear'});
  a.pause();this.a.push(a);
  if(!this.master)this.master=a;
  return a;
};
/* opacity windows with a small rise/settle. wins: [[t0,t1],...]; t1>=dur holds to the end. */
TL.prototype.win=function(el,wins,o){
  o=o||{};var inn=o.in==null?.35:o.in,out=o.out==null?.3:o.out,dy=o.dy==null?10:o.dy,s0=o.s==null?1:o.s,DUR=this.dur;
  var keys=[],first=true;
  wins.forEach(function(w){
    var t0=w[0],t1=w[1];
    if(t0<=0){keys.push([0,{o:1,y:0,s:1}]);}
    else{
      if(first)keys.push([0,{o:0,y:dy,s:s0}]);
      keys.push([t0,{o:0,y:dy,s:s0}],[t0+inn,{o:1,y:0,s:1},o.sp?SP:EO]);
    }
    first=false;
    if(t1<DUR){keys.push([t1,{o:1,y:0,s:1}],[t1+out,{o:0,y:-dy*.5,s:s0===1?1:(1+s0)/2+.01},ES]);}
  });
  if(keys[0][0]>0)keys.unshift([0,{o:0,y:dy,s:s0}]);
  return this.mk(el,keys);
};
/* clip-path reveal */
TL.prototype.reveal=function(el,t0,t1,from,ease){
  from=from||'inset(0 100% 0 0)';
  return this.mk(el,[[0,{cp:from}],[t0,{cp:from}],[t1,{cp:'inset(0 0 0 0)'},ease||EO]]);
};
/* edge-light bumps on a glass surface when an action becomes available */
TL.prototype.bump=function(el,times,base){
  base=base==null?.28:base;var keys=[[0,{o:base}]];
  times.forEach(function(t,i){var nx=times[i+1],end=nx!=null?Math.min(t+1.3,nx-.05):t+1.3;keys.push([t,{o:base}],[t+.22,{o:1},EO],[Math.max(t+.3,end),{o:base},ES]);});
  return this.mk(el,keys);
};
/* camera: individual transform properties (translate/scale) so the element's own transform stays intact. keys: [[t,{x,y,s},ease]] */
TL.prototype.cam=function(el,keys){
  if(!el||!(W.CSS&&CSS.supports&&CSS.supports('scale','1')))return null;
  var DUR=this.dur;keys=keys.slice();
  if(keys[0][0]>0)keys.unshift([0,keys[0][1],null]);
  if(keys[keys.length-1][0]<DUR)keys.push([DUR,keys[keys.length-1][1],null]);
  var fr=keys.map(function(k){var v=k[1];return{offset:Math.max(0,Math.min(1,k[0]/DUR)),translate:(v.x||0).toFixed(2)+'px '+(v.y||0).toFixed(2)+'px',scale:String(v.s==null?1:v.s)};});
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=el.animate(fr,{duration:DUR*1000,fill:'both',easing:'linear'});a.pause();this.a.push(a);return a;
};
TL.prototype.seek=function(t){var ms=Math.max(0,Math.min(this.dur,t))*1000;this.a.forEach(function(x){x.currentTime=ms;});};
TL.prototype.time=function(){return this.master?(this.master.currentTime||0)/1000:0;};
TL.prototype.play=function(){this.a.forEach(function(x){x.play();});};
TL.prototype.pause=function(){this.a.forEach(function(x){x.pause();});};
W.TWTL={TL:TL,EO:EO,EI:EI,ES:ES,SP:SP};
})(window);

/* Industry stage (one reusable scene), workspace highlights, reveal-on-view for the quieter sections. */
(function(W){
'use strict';
var d=document,T=W.TWTL;
var RM=W.matchMedia('(prefers-reduced-motion: reduce)');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ---------- industry stage ---------- */
var root=d.querySelector('[data-is]'),dataEl=d.getElementById('ind-data');
if(root&&dataEl&&T&&root.animate){
  var DATA=JSON.parse(dataEl.textContent),DUR=11.5;
  var body=root.querySelector('[data-is-body]'),outs=root.querySelector('[data-is-outs]'),nameEl=root.querySelector('[data-is-name]');
  var tabs=[].slice.call(d.querySelectorAll('.ind-tab')),sub=d.querySelector('.ind-sub'),panels=[].slice.call(d.querySelectorAll('.ind-panel'));
  var tl=new T.TL(DUR),cur=null,viewable=false,started=false,lastSub='consultancies',EO=T.EO,EI=T.EI,ES=T.ES;
  var steps=function(n){return 'steps('+n+',end)';};

  var cardHTML=function(c,i,n){
    var h='<div class="ic'+(c.flag?' flag':'')+'"><span class="ic-node"><i class="n0"></i><i class="n1"></i></span>';
    if(i<n-1)h+='<span class="ic-line'+(i===1?' gap':'')+'"><i class="l0"></i><i class="l1"></i></span>';
    h+='<div class="ic-h"><span class="ic-app">'+esc(c.app)+'</span><span class="ic-st"><span class="s0">'+esc(c.st[0])+'</span>'+(c.st[1]?'<span class="s1">'+esc(c.st[1])+'</span>':'')+'</span></div>';
    if(c.from)h+='<span class="ic-from">'+esc(c.from)+'</span>';
    if(c.t)h+='<p class="ic-t">'+esc(c.t)+'</p>';
    if(c.rows){h+='<dl class="ic-r">';c.rows.forEach(function(r){
      h+='<div><dt>'+esc(r[0])+'</dt><dd'+(r[2]?' class="rv"':'')+'>'+(r[2]?'<span class="miss">'+esc(r[1])+'</span><b class="fill">'+esc(r[2])+'</b>':esc(r[1]))+'</dd></div>';});h+='</dl>';}
    if(c.slots){h+='<div class="ic-slots">';c.slots.forEach(function(s,k){h+='<span>'+esc(s)+(k===c.pick?'<u class="ring"></u>':'')+'</span>';});h+='</div>';}
    if(c.reply)h+='<p class="ic-reply">'+esc(c.reply)+'</p>';
    return h+'<i class="ic-act" aria-hidden="true"></i></div>';
  };

  function build(id){
    var it=DATA[id];if(!it)return;cur=id;tl.clear();
    nameEl.textContent=it.stage;
    var h='<div class="is-caps">'+it.caps.map(function(c){return '<p class="is-cap">'+esc(c)+'</p>';}).join('')+'</div>';
    h+=it.cards.map(function(c,i){return cardHTML(c,i,it.cards.length);}).join('');
    body.innerHTML=h;
    outs.innerHTML=it.outs.map(function(o){return '<li>'+esc(o)+'</li>';}).join('');
    var $a=function(s,c){return [].slice.call((c||body).querySelectorAll(s));};
    var caps=$a('.is-cap'),cards=$a('.ic'),times=[.2,1.7,3.5,7.2],capT=[[.2,1.6],[1.7,3.4],[3.5,5.4],[5.5,7.1],[7.2,DUR+1]];
    var R=5.6; /* the dependency resolves */
    tl.mk(root.querySelector('.is-top'),[[0,{o:1}]]);
    caps.forEach(function(c,i){tl.win(c,[capT[i]],{dy:10,in:.4,out:.25});});
    cards.forEach(function(c,i){
      /* upcoming steps are already on stage as faint ghosts; the spring activates each one in turn */
      var SPR=T.SP||EO;
      if(i===0)tl.mk(c,[[0,{o:0,y:16}],[times[0],{}],[times[0]+.7,{o:1,y:0},SPR]]);
      else tl.mk(c,[[0,{o:.14,y:0}],[times[i],{}],[times[i]+.7,{o:1,y:0},SPR]]);
      tl.win($a('.n1',c)[0],[[times[i]+.25,DUR+1]],{dy:0,in:.3});
      /* the step being worked on now carries the emerald edge */
      tl.win($a('.ic-act',c)[0],[[times[i]+.15,i<times.length-1?times[i+1]+.1:DUR+1]],{dy:0,in:.35,out:.4});
      var s1=$a('.s1',c)[0],s0=$a('.s0',c)[0];
      if(s1){var ts=i===1?R+.3:i===2?R:i===3?times[3]+1.1:R;tl.win(s0,[[0,ts]],{dy:0,in:.01,out:.2});tl.win(s1,[[ts,DUR+1]],{dy:0,in:.25});}
    });
    /* path: draws as the work moves; the dependency is a visible gap until it resolves */
    var ln=$a('.ic-line .l1');
    var lt=[[1.5,2.1],[R,R+.7],[7.0,7.6]];
    ln.forEach(function(l,i){var t=lt[i]||[7,7.6];tl.mk(l,[[0,{sy:0}],[t[0],{}],[t[1],{sy:1},EO]]);});
    /* the dependency: a missing value, then the supplied one */
    var miss=$a('.miss'),fill=$a('.fill');
    miss.forEach(function(m){tl.win(m,[[0,R+.3]],{dy:0,in:.2,out:.2});});
    fill.forEach(function(f){tl.reveal(f,R+.3,R+1.1,null,steps(10));});
    $a('.ic-reply').forEach(function(r){tl.win(r,[[R-.4,DUR+1]],{dy:6,in:.45});});
    $a('.ring').forEach(function(r){tl.win(r,[[R-.2,DUR+1]],{dy:0,in:.3});});
    $a('.ic-slots .ring').forEach(function(r){r.style.cssText='position:absolute;inset:-1px;border:1.5px solid var(--green);border-radius:999px;pointer-events:none';r.parentNode.style.position='relative';});
    $a('.ic-st .s1').forEach(function(){});
    $a('li',outs).length;
    [].slice.call(outs.children).forEach(function(li,i){tl.win(li,[[8.6+i*.55,DUR+1]],{dy:6,in:.4});});
    tl.mk(root.querySelector('.is-top'),[[0,{o:1}]]);
    tl.master.onfinish=function(){root.classList.add('is-done');};
    root.classList.remove('is-done');
    if(RM.matches){tl.seek(DUR);tl.pause();root.classList.add('is-static');}
    else{root.classList.remove('is-static');tl.seek(0);if(viewable||started){tl.play();started=true;}}
  }

  function show(id,fromTab){
    panels.forEach(function(p){p.hidden=(p.id!=='ip-'+id);});
    tabs.forEach(function(t){
      var sel=(t.dataset.g===id)||(t.dataset.g==='professional'&&['consultancies','legal','insurance'].indexOf(id)>-1);
      t.setAttribute('aria-selected',sel?'true':'false');t.tabIndex=sel?0:-1;
    });
    var isPro=['consultancies','legal','insurance'].indexOf(id)>-1;if(isPro)lastSub=id;
    sub.hidden=!isPro;
    build(id);
    if(fromTab&&!RM.matches){tl.seek(0);started=true;tl.play();}
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){
      var g=t.dataset.g;if(g==='professional')g=lastSub;
      show(g,true);
    });
    t.addEventListener('keydown',function(e){
      var list=t.closest('.ind-tabs').querySelectorAll('.ind-tab'),k=[].indexOf.call(list,t),n=null;
      if(e.key==='ArrowRight')n=list[(k+1)%list.length];else if(e.key==='ArrowLeft')n=list[(k-1+list.length)%list.length];
      else if(e.key==='Home')n=list[0];else if(e.key==='End')n=list[list.length-1];
      if(n){e.preventDefault();n.focus();n.click();}
    });
  });
  root.querySelector('[data-is-replay]').addEventListener('click',function(){started=true;tl.seek(0);root.classList.remove('is-static','is-done');tl.play();});
  show('agencies',false);
  if('IntersectionObserver' in W){
    new IntersectionObserver(function(e){
      viewable=e[0].isIntersecting;
      if(viewable&&!started&&!RM.matches){started=true;tl.seek(0);tl.play();}
      else if(started&&!root.classList.contains('is-done')&&!RM.matches){if(viewable&&!d.hidden)tl.play();else tl.pause();}
    },{threshold:.35}).observe(root);
  }
  d.addEventListener('visibilitychange',function(){if(!started||root.classList.contains('is-done'))return;if(d.hidden)tl.pause();else if(viewable)tl.play();});
  W.__is={show:show,seek:function(t){tl.pause();tl.seek(t);},tl:tl};
}

/* ---------- workspace: link the six annotations to the illustration ---------- */
var ws=d.querySelector('.ws');
if(ws){
  var items=[].slice.call(ws.querySelectorAll('.ws-list li'));
  var setHi=function(n,on){[].slice.call(ws.querySelectorAll('[data-n="'+n+'"]')).forEach(function(e){e.classList.toggle('hi',on);});};
  items.forEach(function(li){
    var n=li.dataset.n;
    li.addEventListener('mouseenter',function(){setHi(n,true);});
    li.addEventListener('mouseleave',function(){setHi(n,false);});
    li.addEventListener('click',function(){var on=!li.classList.contains('hi');items.forEach(function(x){setHi(x.dataset.n,false);});if(on)setHi(n,true);});
  });
}
/* quiet reveal for the workspace and deployment sections (content is readable without it) */
if('IntersectionObserver' in W&&!RM.matches){
  [].slice.call(d.querySelectorAll('.ws,.dep,.kit,.vs')).forEach(function(s){
    s.classList.add('pre');
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){s.classList.remove('pre');o.disconnect();}},{threshold:.18}).observe(s);
  });
}
})(window);
/* key words light up once, with a single sweep of light, the first time they scroll into view */
(function(W){
var d=document,gs=[].slice.call(d.querySelectorAll('.gl')).filter(function(g){return !g.closest('.kn');});
if(!gs.length||!('IntersectionObserver' in W)||W.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
gs.forEach(function(g){g.classList.add('lt');});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('lit');io.unobserve(e.target);}});},{threshold:1,rootMargin:'0px 0px -12% 0px'});
gs.forEach(function(g){io.observe(g);});
})(window);

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
/* hero flow: 1 Work comes in > 2 Twinthos handles it > 3 You approve, following the scene clock */
var fl=[].slice.call(d.querySelectorAll('.hs-flow li'));
if(fl.length&&W.__hs){
  var last=-1;
  var sync=function(){
    var tl=W.__hs.tl,t=tl&&tl.time?tl.time():0,a=t<14?0:t<18.7?1:t<22?2:3;
    if(a!==last){last=a;fl.forEach(function(li,i){li.classList.toggle('on',i===a);li.classList.toggle('done',i<a);});}
  };
  setInterval(function(){if(!d.hidden)sync();},200);sync();
}
/* magnetic primary CTA (fine pointers): the button leans toward the cursor */
if(W.matchMedia('(hover:hover) and (pointer:fine)').matches){
  [].slice.call(d.querySelectorAll('.hs-cta .btn,.close-cta .btn-ink')).forEach(function(b){
    b.classList.add('btn-mag');var zone=b.parentNode;
    zone.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      if(Math.abs(dx)<r.width/2+60&&Math.abs(dy)<r.height/2+50)b.style.translate=(dx*.18).toFixed(1)+'px '+(dy*.28).toFixed(1)+'px';else b.style.translate='';},{passive:true});
    zone.addEventListener('pointerleave',function(){b.style.translate='';});
  });
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
