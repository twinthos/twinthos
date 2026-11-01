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

/* Hero scene: "The work between the work". 28 s presentation timing, live HTML, recomposed for wide and narrow. */
(function(W){
'use strict';
var d=document,root=d.querySelector('.hs'),T=W.TWTL;
if(!root||!T||!root.animate)return;
var st=root.querySelector('[data-stage]'),btn=root.querySelector('[data-ctl]'),DUR=28;
var EO=T.EO,EI=T.EI,ES=T.ES,SP=T.SP,steps=function(n){return 'steps('+n+',end)';};
var NARROW=W.matchMedia('(max-width: 1279.98px)'),RM=W.matchMedia('(prefers-reduced-motion: reduce)');
var tl=new T.TL(DUR),mode=null,userPaused=false,started=false,viewable=false,finished=false;
function $(s){return st.querySelector(s);}

/* size the world on wide screens */
function fit(){
  if(NARROW.matches){['--k','--cx','--wt'].forEach(function(p){root.style.removeProperty(p);});return;}
  var vw=root.clientWidth,hh=root.clientHeight,nav=68;
  var cp=root.querySelector('.hs-copy').getBoundingClientRect(),zl=cp.right+32,zw=vw-zl;
  var k=Math.min(zw/830,(hh-nav-40)/620,1.45);k=Math.max(k,.86);
  var wt=nav+Math.max(6,(hh-nav-610*k)/2-4);
  root.style.setProperty('--k',k.toFixed(3));
  root.style.setProperty('--cx',(zl+zw/2).toFixed(1)+'px');
  root.style.setProperty('--wt',wt.toFixed(1)+'px');
}

function common(wide){
  var q=function(s){return $(s);};
  /* master clock: progress bar */
  tl.mk(root.querySelector('.hs-prog i'),[[0,{sx:0}],[DUR,{sx:1},'linear']]);
  /* captions (same for both) */
  var caps=[['.c1',.3,2.8],['.c2',3.1,5.1],['.c3',9.4,13.9],['.c4',14.2,18.4],['.c4b',18.6,20.5],['.c5',22.5,24.4],['.c6',24.5,26.2]];
  caps.forEach(function(c){tl.win(q(c[0]),[[c[1],c[2]]],{dy:12,in:.45,out:.35});});
  tl.win(q('.lock'),[[26.4,DUR+1]],{dy:12,in:.7});
  /* Operational Drag */
  q('.sc-drag').style.opacity=1;
  tl.win(q('.dg-t'),[[6.5,9.0]],{dy:16,in:.6,out:.4});
  tl.win(q('.dg-d'),[[7.2,9.0]],{dy:12,in:.6,out:.4});
  /* delay labels */
  var dl=wide?[['.d1',5.2,9.2],['.d2',5.8,9.2],['.d3',6.4,9.2]]:[['.d1',5.3,5.95],['.d2',6.0,6.65],['.d3',6.7,9.0]];
  dl.forEach(function(x){tl.win(q(x[0]),[[x[1],x[2]]],{dy:8,in:.4,out:.35});});
  /* bridges and nodes: gaps connect as the work moves */
  [['.b1',14.2,14.9],['.b2',16.4,17.1],['.b3',20.5,21.1]].forEach(function(b){
    tl.mk(q(b[0]),[[0,{sx:0}],[b[1],{}],[b[2],{sx:1},EO]]);});
  [['.n1',14.0],['.n2',16.0],['.n3',18.2],['.n4',21.8]].forEach(function(n){
    tl.win(q(n[0]+' .on'),[[n[1],DUR+1]],{dy:0,in:.3});});
  /* work item state: Waiting > In progress > Ready for review > Completed within scope */
  var c1='.chip1 ',c2='.chip2 ',z={dy:0,in:.25,out:.25};
  tl.win(q(c1+'.dw'),[[1.2,14.0]],z);
  tl.win(q(c1+'.s-w'),[[1.2,14.0]],z);
  tl.win(q(c1+'.dp'),[[14.0,18.7],[20.4,22.0]],z);
  tl.win(q(c1+'.s-p'),[[14.0,18.7],[20.4,22.0]],z);
  tl.win(q(c1+'.s-r'),[[18.7,20.4]],z);
  tl.win(q(c1+'.dd'),[[22.0,DUR+1]],{dy:0,in:.3});
  tl.win(q(c1+'.s-d'),[[22.0,DUR+1]],{dy:0,in:.3});
  tl.win(q(c2+'.dw'),[[0,23.6]],z);
  tl.win(q(c2+'.s-w'),[[0,23.6]],z);
  tl.win(q(c2+'.dp'),[[23.6,DUR+1]],{dy:0,in:.3});
  tl.win(q(c2+'.s-p'),[[23.6,DUR+1]],{dy:0,in:.3});
  /* one action at a time above the work item */
  [['.a1',14.0,15.2],['.a2',15.2,16.4],['.a3',16.4,18.0],['.a4',18.0,19.3],['.a5',20.6,22.0]].forEach(function(a){
    tl.win(q(a[0]),[[a[1],a[2]]],{dy:8,in:.3,out:.25});});
  /* surface content: the same task, the same facts, visibly changing */
  tl.win(q('.sf-mail .hl-a'),[[0,9.4]],{dy:0,in:.2,out:.3});
  tl.win(q('.sf-mail .hl-b'),[[9.2,DUR+1]],{dy:0,in:.4});
  tl.win(q('.sf-rec .hl-a'),[[0,9.4]],{dy:0,in:.2,out:.3});
  tl.win(q('.sf-rec .hl-b'),[[9.2,DUR+1]],{dy:0,in:.4});
  tl.win(q('.sf-mail .mk'),[[9.0,DUR+1]],{dy:0,in:.5});
  tl.win(q('.sf-rec .mk'),[[9.0,DUR+1]],{dy:0,in:.5});
  tl.win(q('.ml-in'),[[0,17.9]],{dy:0,in:.2,out:.3});
  tl.reveal(q('.ml-re'),17.9,18.8,'inset(0 0 100% 0)');
  tl.win(q('.ml-ap'),[[18.8,20.9]],{dy:6,in:.4,out:.4});
  tl.win(q('.ap-b1'),[[0,20.0]],{dy:0,in:.1,out:.15});
  tl.win(q('.ap-b2'),[[20.0,DUR+1]],{dy:0,in:.2});
  tl.win(q('.ml-sent'),[[20.6,DUR+1]],{dy:4,in:.4});
  tl.mk(q('.ptr'),[[0,{x:170,y:320,o:0,s:1}],[19.0,{}],[19.35,{x:150,y:312,o:1},EO],[19.95,{x:67,y:260},EI],[20.1,{s:.8},ES],[20.35,{s:1.15,o:.6},EO],[20.7,{o:0,s:1.4},ES]]);
  tl.win(q('.rc>div:nth-child(3) .miss'),[[0,16.9]],{dy:0,in:.2,out:.2});
  tl.win(q('.rc>div:nth-child(4) .miss'),[[0,21.0]],{dy:0,in:.2,out:.2});
  tl.reveal(q('.sd'),16.9,17.6,null,steps(10));
  tl.reveal(q('.ns'),21.0,21.8,null,steps(14));
  tl.win(q('.v1'),[[0,17.8]],{dy:0,in:.2,out:.25});
  tl.win(q('.v2'),[[17.8,DUR+1]],{dy:0,in:.3});
  tl.win(q('.rs-a'),[[0,17.7]],{dy:0,in:.2,out:.25});
  tl.win(q('.rs-b'),[[17.7,DUR+1]],{dy:0,in:.3});
  tl.win(q('.tk-a'),[[0,17.7]],{dy:0,in:.2,out:.3});
  tl.win(q('.tk-m'),[[17.7,21.0]],{dy:0,in:.3,out:.3});
  tl.win(q('.tk-b'),[[21.0,DUR+1]],{dy:0,in:.4});
  /* glass edge catches light when an action becomes available */
  tl.bump(q('.sf-rec .sf-edge'),[10.0,16.4,21.0]);
  tl.bump(q('.sf-phone .sf-edge'),[11.0,20.8]);
  tl.bump(q('.sf-mail .sf-edge'),[12.4,14.2,18.2,18.9]);
  tl.bump(q('.sf-ctx .sf-edge'),[13.2,15.3]);
  tl.bump(q('.sf-task .sf-edge'),[1.9,21.0]);
  tl.bump(q('.sf-out .sf-edge'),[23.2]);
}


/* camera: a slow push-in that follows the work (wide only). Individual translate/scale, so the world's own scale(k) is untouched. */
function camera(){
  var k=parseFloat(root.style.getPropertyValue('--k'))||1,cx=parseFloat(root.style.getPropertyValue('--cx'))||0,wt=parseFloat(root.style.getPropertyValue('--wt'))||0,vw=root.clientWidth;
  var cp=root.querySelector('.hs-copy').getBoundingClientRect(),lim=cp.right+14,rim=vw-12,smax=Math.max(1,(rim-lim)/(746*k));
  function f(fx,fy,s){
    s=Math.min(s,smax);
    var x=(1-s)*k*(fx-380),y=(1-s)*k*fy;if(wt+y<78)y=78-wt;
    var xr=cx+x+s*k*366;if(xr>rim)x-=xr-rim;
    var xl=cx+x-s*k*380;if(xl<lim)x+=lim-xl;
    return{x:x,y:y,s:s};
  }
  var CE='cubic-bezier(.45,0,.2,1)';
  tl.cam(st.querySelector('.hs-cl'),[
    [0,f(380,300,1)],[5,f(380,300,1.035),'linear'],[9.4,f(380,300,1),CE],[14.2,f(380,300,1)],[15.4,f(330,170,1.09),CE],[16.8,f(330,170,1.09)],
    [18.0,f(160,220,1.14),CE],[20.9,f(160,220,1.14)],[22.1,f(330,150,1.08),CE],[22.9,f(330,150,1.08)],[24.3,f(380,260,1),CE]]);
}

function buildWide(){
  var q=function(s){return $(s);};
  var mail=q('.sf-mail'),rec=q('.sf-rec'),task=q('.sf-task'),phone=q('.sf-phone'),ctx=q('.sf-ctx'),out=q('.sf-out');
  tl.prime([mail,rec,task,phone,ctx,out,q('.chip1'),q('.chip2')]);
  /* 0-5 work arrives: three separate surfaces, slightly out of true. 5-9 they recede. 9-14 they align into one workspace. */
  tl.mk(mail,[[0,{X:0,Y:86,r:-1.4,o:0,s:.985,bl:0}],[.1,{}],[1.0,{Y:60,o:1,s:1},SP],[5,{}],[5.7,{Y:76,r:-2.4,o:.16,bl:4},EI],[9,{}],[10.4,{X:0,Y:40,r:0,o:1,bl:0},EI],[22.2,{}],[23.1,{o:0,Y:52},ES]]);
  tl.mk(rec,[[0,{X:236,Y:48,r:.8,o:0,s:.985,bl:0}],[.4,{}],[1.3,{Y:24,o:1,s:1},SP],[5,{}],[5.7,{Y:36,r:1.8,o:.16,bl:4},EI],[9,{}],[10.4,{X:244,Y:0,r:0,o:1,bl:0},EI],[22.4,{}],[23.7,{X:0,Y:96},EI]]);
  tl.mk(task,[[0,{X:548,Y:122,r:1.6,o:0,s:.985,bl:0}],[.7,{}],[1.6,{Y:100,o:1,s:1},SP],[5,{}],[5.7,{Y:114,r:2.6,o:.16,bl:4},EI],[9,{}],[10.4,{X:532,Y:300,r:0,o:1,bl:0},EI],[22.2,{}],[23,{o:0,Y:312},ES]]);
  tl.mk(phone,[[0,{X:586,Y:26,o:0}],[10.6,{}],[11.5,{Y:0,o:1},SP],[22.2,{}],[23,{o:0,Y:12},ES]]);
  tl.mk(ctx,[[0,{X:256,Y:272,o:0}],[12.8,{}],[13.6,{Y:254,o:1},SP],[22.2,{}],[23,{o:0,Y:266},ES]]);
  tl.mk(out,[[0,{X:348,Y:114,o:0}],[22.6,{}],[23.7,{Y:96,o:1},SP]]);
  tl.win(q('.bub.out'),[[20.8,DUR+1]],{dy:6,in:.4});
  /* the work item rides the path. It reaches a gap and stops; a second task queues behind it. */
  tl.mk(q('.chip1'),[[0,{X:-340,o:0}],[.6,{}],[.75,{o:1}],[2.4,{X:-126},EO],[2.7,{X:-138},ES],[16.0,{}],[17.0,{X:122},EI],[17.2,{}],[18.2,{X:346},EI],[21.1,{}],[22.0,{X:432},EI]]);
  tl.mk(q('.chip2'),[[0,{X:-460,o:0}],[2.0,{}],[3.1,{X:-394,o:.9},EO],[23.0,{}],[24.2,{X:170},EI]]);
  common(true);
  camera();
}

function buildNarrow(){
  var q=function(s){return $(s);};
  var S={dy:14,s:.98,in:.4,out:.25};
  tl.win(q('.sf-mail'),[[.3,2.0],[14.0,15.3],[18.4,20.8]],S);
  tl.win(q('.sf-rec'),[[2.3,3.7],[9.2,10.4],[16.6,18.1],[21.1,22.6]],S);
  tl.win(q('.sf-task'),[[4.0,5.0]],S);
  tl.win(q('.sf-phone'),[[10.6,11.8]],S);
  tl.win(q('.sf-ctx'),[[12.0,13.7],[15.5,16.4]],S);
  tl.win(q('.sf-out'),[[22.9,DUR+1]],S);
  tl.win(q('.bub.out'),[[20.8,DUR+1]],{dy:6,in:.4});
  /* the camera follows the work along the path; the chip stays in view at the left */
  tl.mk(q('.pp'),[[0,{x:-136}],[5.0,{}],[5.7,{x:-130},EI],[5.9,{}],[6.4,{x:-370},EI],[6.6,{}],[7.1,{x:-610},EI],[9.1,{}],[10.3,{x:-136},EI],[15.0,{}],[16.0,{x:-376},EI],[17.2,{}],[18.2,{x:-616},EI],[21.1,{}],[22.0,{x:-688},EI]]);
  tl.mk(q('.chip1'),[[0,{x:-120,o:0}],[1.2,{}],[1.35,{o:1}],[2.9,{x:8},EO],[3.2,{x:0},ES]]);
  tl.mk(q('.chip2'),[[0,{x:12,y:-80,o:0}],[2.8,{}],[3.6,{o:.55},EO],[23.0,{}],[24.2,{x:0,y:0,o:.9},EI]]);
  common(false);
}

function build(){
  var t=tl.time(),live=tl.master&&tl.master.playState==='running';
  tl.clear();fit();mode=NARROW.matches?'narrow':'wide';
  root.classList.remove('is-static');root.classList.add('is-live','has-js');
  if(mode==='wide')buildWide();else buildNarrow();
  tl.master.onfinish=onEnd;
  tl.seek(t);
  if(live)tl.play();
}


/* your turn: once per run the scene stops on the approval and waits for the visitor's click (auto-continues after a few seconds) */
var ASK_T=19.25,ASK_MAX=4200,asking=false,asked=false,askLeft=0,askTick=null,apb=null,hint=null;
function askSetup(){
  apb=root.querySelector('.ap-b');if(!apb)return;
  if(!hint){hint=d.createElement('span');hint.className='ap-hint';hint.textContent='Your turn: tap Approve';apb.parentNode.appendChild(hint);}
  apb.addEventListener('click',function(){if(asking)endAsk(true);});
  apb.addEventListener('keydown',function(e){if(asking&&(e.key==='Enter'||e.key===' ')){e.preventDefault();endAsk(true);}});
}
function startAsk(){
  asking=true;asked=true;tl.pause();tl.seek(ASK_T);root.classList.add('is-ask');root.classList.remove('is-playing');label('play');
  apb.setAttribute('role','button');apb.setAttribute('tabindex','0');apb.setAttribute('aria-label','Approve the reply');
  askLeft=ASK_MAX;clearInterval(askTick);
  askTick=setInterval(function(){if(viewable&&!d.hidden){askLeft-=100;if(askLeft<=0)endAsk(false);}},100);
}
function endAsk(byUser){
  if(!asking)return;asking=false;clearInterval(askTick);root.classList.remove('is-ask');
  apb.removeAttribute('role');apb.removeAttribute('tabindex');apb.removeAttribute('aria-label');
  if(byUser){apb.classList.remove('tap');void apb.offsetWidth;apb.classList.add('tap');root.classList.add('is-you');tl.seek(20.45);}
  userPaused=false;tl.play();root.classList.add('is-playing');label('pause');
}
function askWatch(){
  if(!asking&&!asked&&root.classList.contains('is-playing')&&apb){var t=tl.time();if(t>=ASK_T-.02&&t<ASK_T+.6)startAsk();}
  W.requestAnimationFrame(askWatch);
}

/* controls */
function label(s){
  btn.className='hs-btn is-'+s+(s==='replay'&&finished?' done':'');
  var t={pause:['Pause','Pause animation'],play:['Play','Play animation'],replay:['Replay','Replay animation']}[s];
  btn.querySelector('span').textContent=t[0];btn.setAttribute('aria-label',t[1]);
}
function onEnd(){finished=true;root.classList.remove('is-playing');root.classList.add('is-done');label('replay');}
function run(){
  if(finished||!started)return;
  tl.play();root.classList.add('is-playing');label('pause');
}
function freeze(){tl.pause();root.classList.remove('is-playing');}
function restart(){asked=false;root.classList.remove('is-you');if(asking){asking=false;clearInterval(askTick);root.classList.remove('is-ask');}finished=false;userPaused=false;started=true;root.classList.remove('is-done','is-static');root.classList.add('is-live');tl.seek(0);tl.play();root.classList.add('is-playing');label('pause');}
function staticPoster(){
  started=true;finished=true;tl.seek(DUR);tl.pause();root.classList.add('is-static');root.classList.remove('is-live');root.classList.remove('is-playing');label('play');
}
btn.addEventListener('click',function(){
  if(asking){endAsk(false);return;}
  if(root.classList.contains('is-static')||finished){restart();return;}
  if(root.classList.contains('is-playing')){userPaused=true;freeze();label('play');}
  else{userPaused=false;run();}
});
function sync(){
  if(asking)return;
  if(!started||finished||root.classList.contains('is-static'))return;
  var go=viewable&&!d.hidden&&!userPaused;
  if(go&&!root.classList.contains('is-playing')){tl.play();root.classList.add('is-playing');label('pause');}
  else if(!go&&root.classList.contains('is-playing')){freeze();if(!userPaused)label('play');}
}
d.addEventListener('visibilitychange',sync);

/* go */
fit();build();askSetup();
if(!RM.matches)W.requestAnimationFrame(askWatch);
if(RM.matches){staticPoster();}
else{tl.seek(0);label('pause');}
if('IntersectionObserver' in W){
  new IntersectionObserver(function(e){
    viewable=e[0].isIntersecting;
    if(viewable&&!started&&!RM.matches){started=true;tl.play();root.classList.add('is-playing');}
    sync();
  },{threshold:.3}).observe(st);
}else if(!RM.matches){started=true;viewable=true;tl.play();root.classList.add('is-playing');}
var rz;W.addEventListener('resize',function(){cancelAnimationFrame(rz);rz=requestAnimationFrame(function(){
  var m=NARROW.matches?'narrow':'wide';
  if(m!==mode){var was=root.classList.contains('is-static');build();if(was)staticPoster();}
  else fit();
});});
W.__hs={seek:function(t){if(asking){asking=false;clearInterval(askTick);root.classList.remove('is-ask');}asked=true;freeze();tl.seek(t);},ask:function(){asked=false;},tl:tl,play:run,restart:restart,poster:staticPoster};
})(window);

/* Home hero film "One employee". 18 s on one clock (TWTL), four chapters:
   1 the drag: the headline, then routine work piling up around it
   2 one employee: an inbox, a phone, a computer, fused into one mark
   3 the work: every task handled into the mark; the one that matters stops at the Authority Line for the visitor's own click
   4 time returned: the promise, then the resting hero (base CSS = this final frame)
   Sound is synthesised with Web Audio and strictly opt-in (the Sound button). */
(function(W){
'use strict';
var d=document,root=d.querySelector('.kn'),T=W.TWTL;
if(!root||!T||!root.animate)return;
if(W.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var DUR=18,EO=T.EO,EI=T.EI,ES=T.ES,SP=T.SP,CH=[0,4.2,9.2,14.6],ASK_T=13.4,ASK_MAX=5000;
var fx=root.querySelector('.kn-fx'),mk=root.querySelector('.kn-mk'),st=root.querySelector('.kn-st'),
  h1=root.querySelector('.kn-h'),sub=root.querySelector('.kn-sub'),
  cta=root.querySelector('.kn-cta'),desc=root.querySelector('.kn-desc'),words=[].slice.call(h1.querySelectorAll('.w>i')),
  pp=root.querySelector('.kn-pp'),ppT=pp.querySelector('.t'),snd=root.querySelector('.kn-snd'),
  chs=[].slice.call(root.querySelectorAll('.kn-ch button'));
if(!fx||!mk||!pp)return;

/* ---------- film elements (built once, decorative) ---------- */
var TASKS=[['Reply to Maya about the quote','2d'],['Chase invoice #2041','9d'],['Update the CRM','3d'],['Book the site visit','1d'],
  ['Send the contract','4d'],['Call back the supplier','2d'],['Confirm Monday\u2019s start','1d'],['Request missing documents','6d'],
  ['Follow up the new enquiry','3d'],['Send the weekly report','2d']];
var CHECK='<svg viewBox="0 0 10 10"><path d="M1.5 5.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var ICONS=[['An inbox.','<svg viewBox="0 0 64 64"><rect x="6" y="13" width="52" height="38" rx="6" pathLength="1"/><path d="M8 17l24 18 24-18" pathLength="1"/></svg>'],
  ['A phone.','<svg viewBox="0 0 64 64"><rect x="19" y="5" width="26" height="54" rx="7" pathLength="1"/><path d="M28.5 51h7" pathLength="1"/></svg>'],
  ['A computer.','<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="34" rx="4" pathLength="1"/><path d="M32 44v10M22 54h20" pathLength="1"/></svg>']];
function el(tag,cls,html){var e=d.createElement(tag);e.className=cls;if(html)e.innerHTML=html;e.setAttribute('aria-hidden','true');fx.appendChild(e);return e;}
var glow=el('i','kn-glow');
var chips=TASKS.map(function(t){return el('span','kn-chip','<i><span class="ck">'+CHECK+'</span></i>'+t[0]+'<em>'+t[1]+'</em>');});
var xchip=el('span','kn-chip x','<i></i>Refund \u00a31,200<em>needs you</em>');
var ics=ICONS.map(function(c){return el('div','kn-ic',c[1]+'<b>'+c[0]+'</b>');});
var ring=el('i','kn-ring');
var caps=[el('p','kn-cap','Work waiting for someone to remember.'),el('p','kn-cap l','Not three tools. One employee.'),
  el('p','kn-cap','Routine work, handled.'),el('p','kn-cap l','Anything that matters waits for you.')];
var al=el('div','kn-al');
var card=el('div','kn-card','<div><small>Refund request</small><p>\u00a31,200 to Harbour &amp; Co</p></div><button type="button" class="kn-ap" tabindex="-1"><span class="b1">Approve</span><span class="b2">Approved</span></button><span class="kn-ok"></span><span class="kn-hint">Your turn</span>');
var ap=card.querySelector('.kn-ap');
var pr=el('p','kn-pr','<span><span class="w"><i>Work</i></span> <span class="w"><i>handled.</i></span></span><span class="g"><span class="w"><i>Time</i></span> <span class="w"><i>returned.</i></span></span>');
var prw=[].slice.call(pr.querySelectorAll('.w>i'));
root.classList.add('is-film');

/* ---------- layout ---------- */
function off(e){var x=0,y=0,n=e;while(n&&n!==root){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}return {x:x,y:y,w:e.offsetWidth,h:e.offsetHeight};}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var tl=new T.TL(DUR),M=null,cues=[],absorb=[];

function measure(){
  var w=root.clientWidth,h=root.clientHeight,nar=w<641;
  root.style.setProperty('--is',nar?'72px':'116px');
  var m={W:w,H:h,nar:nar,cx:w/2,gut:nar?20:Math.max(28,w*.04)};
  m.nav=(d.querySelector('.nav')||{offsetHeight:68}).offsetHeight||68;
  m.cy=Math.round((m.nav+h-96)/2);m.SC=nar?1.25:1.3;m.mC={x:m.cx,y:m.cy-(nar?104:124)};
  m.mk=off(mk);m.mc={x:m.mk.x+m.mk.w/2,y:m.mk.y+m.mk.h/2};m.st=off(st);
  m.h1=off(h1);m.wh=words[0].offsetHeight;
  m.chip=chips.concat([xchip]).map(function(c){return [c.offsetWidth,c.offsetHeight];});m.NX=chips.length;
  m.ic=[ics[0].offsetWidth,ics[0].offsetHeight];m.is=nar?72:116;
  m.cap=caps.map(function(c){return c.offsetHeight;});
  m.card=[card.offsetWidth,card.offsetHeight];m.pr=pr.offsetHeight;m.prwh=prw[0].offsetHeight;
  return m;
}
function place(m){
  /* chapter 3 stack: mark (scaled SC) at mC, status under it, Authority Line, card, caption */
  m.stC=Math.round(m.mC.y+m.mk.h*m.SC/2+14);
  m.alY=Math.round(m.stC+m.st.h+(m.nar?50:58));
  m.cardX=Math.round(m.cx-m.card[0]/2);m.cardY=m.alY+(m.nar?52:48);
  m.cardC={x:m.cardX+m.card[0]/2,y:m.cardY+m.card[1]/2};
  m.capC=Math.round(m.cardY+m.card[1]+(m.nar?32:46));
  /* chips: best-candidate scatter around the headline, never over it, its caption, the chapter-3 mark and caption, the nav or the controls */
  var cw3=Math.min(m.W,640),ex=[{x:m.h1.x-18,y:m.h1.y-14,w:m.h1.w+36,h:m.h1.h+28},
    {x:m.cx-Math.min(m.W,640)/2,y:m.h1.y+m.h1.h+14,w:Math.min(m.W,640),h:m.cap[0]+24},
    {x:m.cx-150,y:m.mC.y-m.mk.h*m.SC/2-16,w:m.nar?0:300,h:m.stC+m.st.h+18-(m.mC.y-m.mk.h*m.SC/2-16)}],
    top=m.nav+16,bot=m.H-112,r=rng(11+Math.round(m.W/40)),done=[],all=[xchip].concat(chips);
  all.forEach(function(c,ci){
    var sz=ci===0?m.chip[m.NX]:m.chip[ci-1],cw=sz[0],ch=sz[1],best=null,bd=-1,found=0;
    for(var k=0;k<600&&found<28;k++){
      var q={x:m.gut+r()*Math.max(1,m.W-2*m.gut-cw),y:top+r()*Math.max(1,bot-top-ch),w:cw,h:ch},bad=false,i,o;
      for(i=0;i<ex.length+done.length;i++){o=i<ex.length?ex[i]:done[i-ex.length];
        if(q.x<o.x+o.w+18&&q.x+q.w+18>o.x&&q.y<o.y+o.h+14&&q.y+q.h+14>o.y){bad=true;break;}}
      if(bad)continue;found++;
      var dm=1e9;for(i=0;i<done.length;i++){o=done[i];var dx=(q.x+q.w/2)-(o.x+o.w/2),dy=((q.y+q.h/2)-(o.y+o.h/2))*1.6;dm=Math.min(dm,dx*dx+dy*dy);}
      if(!done.length)dm=-Math.abs(q.x+q.w/2-m.cx)+r()*200;
      if(dm>bd){bd=dm;best=q;}
    }
    c._p=best;if(best)done.push(best);
  });
  /* writes */
  chips.concat([xchip]).forEach(function(c){if(c._p){c.style.left=Math.round(c._p.x)+'px';c.style.top=Math.round(c._p.y)+'px';c.style.display='';}else c.style.display='none';});
  var gap=m.nar?Math.min(124,(m.W-24)/3):Math.min(290,m.W*.21);
  ics.forEach(function(e,i){e._x=m.cx+(i-1)*gap;e._y=m.cy-m.is/2-14;e.style.left=Math.round(e._x)+'px';e.style.top=Math.round(e._y)+'px';});
  ring.style.left=m.cx+'px';ring.style.top=m.cy+'px';
  glow.style.left=Math.round(m.mc.x)+'px';glow.style.top=Math.round(m.mc.y)+'px';
  var S=m.nar?1.9:2.2;m.S=S;
  var alW=m.nar?m.W*.92:Math.min(m.W*.66,920);
  al.style.left=Math.round(m.cx-alW/2)+'px';al.style.width=Math.round(alW)+'px';al.style.top=m.alY+'px';al.style.setProperty('--in',Math.max(0,Math.round((alW-m.card[0])/2))+'px');
  card.style.left=m.cardX+'px';card.style.top=m.cardY+'px';
  caps[0].style.top=Math.round(m.h1.y+m.h1.h+26)+'px';
  caps[1].style.top=Math.round(m.cy+m.mk.h*S/2+34)+'px';
  caps[2].style.top=caps[3].style.top=m.capC+'px';
  pr.style.top=Math.round(m.cy-m.pr/2+(m.nar?16:34))+'px';
}

/* ---------- the score ---------- */
function prop(e,name,keys){
  keys=keys.slice();if(keys[0][0]>0)keys.unshift([0,keys[0][1]]);if(keys[keys.length-1][0]<DUR)keys.push([DUR,keys[keys.length-1][1]]);
  var fr=keys.map(function(k){var f={offset:Math.min(1,Math.max(0,k[0]/DUR))};f[name]=k[1];return f;});
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=e.animate(fr,{duration:DUR*1000,fill:'both'});a.pause();tl.a.push(a);return a;
}
var PENTA=[587.33,659.25,739.99,880,987.77,1174.66,1318.51,1479.98,1760,1975.53,2349.32,2637.02,2959.96];
function score(m){
  tl.clear();cues=[];absorb=[];
  var dxm=m.cx-m.mc.x,dym=m.cy-m.mc.y,S=m.S,SC=m.SC,cxm=m.mC.x-m.mc.x,cym=m.mC.y-m.mc.y,sdy=m.stC-m.st.y,T3=m.mC;
  /* master track first: the headline, which spans the whole clock */
  tl.mk(h1,[[0,{o:1,y:0}],[3.95,{o:1,y:0}],[4.4,{o:0,y:-16},ES],[16.9,{o:0,y:0}],[16.95,{o:1,y:0}]]);
  var wh=Math.round(m.wh*1.12);
  words.forEach(function(w,i){var a=.15+i*.075,b=16.98+i*.055;
    tl.mk(w,[[0,{y:wh}],[a,{y:wh}],[a+.95,{y:0},SP],[4.45,{y:0}],[4.5,{y:wh}],[b,{y:wh}],[b+.95,{y:0},SP]]);});
  tl.win(sub,[[17.3,DUR]],{dy:14});tl.win(cta,[[17.5,DUR]],{dy:14});tl.win(desc,[[17.65,DUR]],{dy:8});
  /* the drag: chips pile up; the frame leans in; the room goes quiet at 4.2 */
  tl.cam(fx,[[0,{s:1}],[4.15,{s:1.035}],[4.7,{s:1},EO]]);
  var list=chips.filter(function(c){return c._p;}),n=list.length;
  list.forEach(function(c,j){c._a=1.0+j*.16;cues.push([c._a+.04,'tick']);});
  if(xchip._p){xchip._a=1.0+n*.16;cues.push([xchip._a+.04,'tick']);}
  cues.push([2.35,'riser']);
  tl.win(caps[0],[[2.1,3.95]],{dy:10});
  /* absorption order: nearest to the mark first */
  var order=list.slice().sort(function(a,b){var pa=a._p,pb=b._p;
    return Math.hypot(pa.x+pa.w/2-m.mc.x,pa.y+pa.h/2-m.mc.y)-Math.hypot(pb.x+pb.w/2-m.mc.x,pb.y+pb.h/2-m.mc.y);});
  order.forEach(function(c,k){c._c=10.1+k*.15;absorb.push(c._c+.62);cues.push([c._c,'pluck',k]);});
  list.forEach(function(c){var p=c._p,dx=T3.x-(p.x+p.w/2),dy=T3.y-(p.y+p.h/2);
    tl.mk(c,[[0,{o:0,y:10,s:.85}],[c._a,{o:0,y:10,s:.85}],[c._a+.5,{o:1,y:0,s:1},SP],[4.2,{o:1,s:1}],[4.6,{o:0,s:.96},ES],
      [c._c-.2,{o:0,s:.96}],[c._c,{o:1,s:1},EO],[c._c+.2,{o:1,x:0,y:0,s:1}],[c._c+.7,{o:0,x:dx,y:dy,s:.25},EI]]);
    tl.mk(c.querySelector('.ck'),[[0,{o:0,s:.4}],[c._c+.02,{o:0,s:.4}],[c._c+.2,{o:1,s:1},SP]]);
  });
  if(xchip._p){var p=xchip._p;
    tl.mk(xchip,[[0,{o:0,y:10,s:.85}],[xchip._a,{o:0,y:10,s:.85}],[xchip._a+.5,{o:1,y:0,s:1},SP],[4.2,{o:1,s:1}],[4.6,{o:0,s:.96},ES],
      [11.75,{o:0,s:.96}],[12.0,{o:1,s:1},EO],[12.2,{o:1,x:0,y:0,s:1}],[12.7,{o:0,x:m.cardC.x-(p.x+p.w/2),y:m.cardC.y-(p.y+p.h/2),s:1.25},EI]]);}
  /* one employee */
  ics.forEach(function(e,i){var t0=4.6+i*.7,dx=m.cx-e._x,dy=m.cy-(e._y+m.is/2);
    tl.mk(e,[[0,{o:0,y:18}],[t0,{o:0,y:18}],[t0+.6,{o:1,y:0},SP],[6.9,{o:1,x:0,y:0,s:1}],[7.5,{o:0,x:dx,y:dy,s:.3},EI]]);
    [].slice.call(e.querySelectorAll('svg *')).forEach(function(s){prop(s,'strokeDashoffset',[[0,1],[t0,1],[t0+.95,0,EO]]);});
    tl.win(e.querySelector('b'),[[t0+.25,6.75]],{dy:10});
    cues.push([t0,'bell',i]);
  });
  cues.push([6.92,'whoosh']);cues.push([7.48,'merge']);
  tl.mk(ring,[[0,{o:0,s:.5}],[7.48,{o:0,s:.5}],[7.52,{o:.9,s:.6}],[8.7,{o:0,s:3.4},EO]]);
  tl.mk(mk,[[0,{o:0,x:dxm,y:dym,s:S*.6}],[7.42,{o:0,x:dxm,y:dym,s:S*.6}],[7.95,{o:1,s:S},SP],[9.3,{o:1,x:dxm,y:dym,s:S}],[10.1,{o:1,x:cxm,y:cym,s:SC},EI],[14.55,{o:1,x:cxm,y:cym,s:SC}],[15.25,{o:1,x:0,y:0,s:1},EI]]);
  tl.mk(glow,[[0,{o:0,x:dxm,y:dym,s:.5}],[7.4,{o:0,s:.5}],[7.85,{o:1,s:1.15},EO],[8.9,{o:.65,s:1},ES],[9.3,{o:.65,x:dxm,y:dym}],[10.1,{o:.5,x:cxm,y:cym,s:.75},EI],
    [13.6,{o:.5,s:.75}],[13.85,{o:.95,s:.9},EO],[14.55,{o:.45,s:.75,x:cxm,y:cym},ES],[15.25,{o:.45,x:0,y:0},EI],[16.4,{o:.45}],[17.2,{o:0,s:.6},ES]]);
  tl.win(caps[1],[[8.05,9.3]],{dy:12});
  /* the work */
  tl.mk(st,[[0,{o:0,y:sdy+8}],[10.0,{o:0,y:sdy+8}],[10.35,{o:1,y:sdy},EO],[14.55,{o:1,y:sdy}],[15.25,{o:1,y:0},EI]]);cues.push([9.32,'whoosh']);
  tl.mk(card,[[0,{o:0,s:.92,y:10}],[12.45,{o:0,s:.92,y:10}],[12.95,{o:1,s:1,y:0},SP],[14.1,{o:1,s:1,x:0,y:0}],[14.6,{o:0,s:.3,x:T3.x-m.cardC.x,y:T3.y-m.cardC.y},EI]]);
  cues.push([12.5,'low']);
  tl.mk(al,[[0,{o:0,cp:'inset(-40px 50% -40px 50%)'}],[12.55,{o:1,cp:'inset(-40px 50% -40px 50%)'}],[13.15,{o:1,cp:'inset(-40px 0% -40px 0%)'},EO],[14.2,{o:1}],[14.6,{o:0},ES]]);
  tl.win(caps[3],[[12.95,14.4]],{dy:10});
  tl.mk(ap,[[0,{s:1}],[13.55,{s:1}],[13.62,{s:.94}],[13.9,{s:1},SP]]);
  tl.win(ap.querySelector('.b2'),[[13.62,DUR]],{in:.18,dy:0});
  tl.win(card.querySelector('.kn-ok'),[[13.62,14.15]],{in:.2,dy:0});
  cues.push([13.6,'approve']);cues.push([14.42,'pluck',12]);
  /* time returned */
  tl.mk(pr,[[0,{o:0}],[14.78,{o:0}],[14.8,{o:1,y:0}],[16.45,{o:1,y:0}],[16.9,{o:0,y:-24},ES]]);
  var pwh=Math.round(m.prwh*1.12);
  prw.forEach(function(w,i){var b=14.85+i*.13+(i>1?.25:0);tl.mk(w,[[0,{y:pwh}],[b,{y:pwh}],[b+1,{y:0},SP]]);});
  cues.push([14.85,'pad']);cues.push([17.0,'end']);
  /* chapter bars */
  chs.forEach(function(b,i){tl.mk(b.querySelector('i'),[[0,{sx:0}],[CH[i],{sx:0}],[CH[i+1]||DUR,{sx:1}]]);});
  cues.sort(function(a,b){return a[0]-b[0];});
}

/* ---------- status line under the mark ---------- */
var stTxt='';
function status(t){
  var n=absorb.length,k=0,s;for(var i=0;i<n;i++)if(absorb[i]<=t)k++;
  if(t<12.45)s=(n-k)+' waiting \u00b7 '+k+' handled';
  else if(t<13.62)s=n+' handled \u00b7 1 needs you';
  else if(t<16.85)s=(n+1)+' handled \u00b7 approved by you';
  else s='Your digital employee<span class="kn-st2"> \u00b7 all caught up</span>';
  if(s!==stTxt){stTxt=s;st.innerHTML=s;}
}

/* ---------- sound (Web Audio, synthesised, opt-in) ---------- */
var A=null,out=null,bedG=null,on=false;
function ac(){
  if(!A){var C=W.AudioContext||W.webkitAudioContext;if(!C)return null;A=new C();
    var comp=A.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(A.destination);
    out=A.createGain();out.gain.value=0;out.connect(comp);
    var lp=A.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;lp.Q.value=.4;bedG=A.createGain();bedG.gain.value=0;lp.connect(bedG);bedG.connect(out);
    [[73.42,0],[110,3],[146.83,-4]].forEach(function(f){var o=A.createOscillator();o.type='sine';o.frequency.value=f[0];o.detune.value=f[1];
      var g=A.createGain();g.gain.value=f[0]>140?.35:1;o.connect(g);g.connect(lp);o.start();});
    var lfo=A.createOscillator(),lg=A.createGain();lfo.frequency.value=.11;lg.gain.value=160;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();}
  if(A.state==='suspended')A.resume();
  return A;
}
function tone(f,type,peak,att,dec,at){var t0=A.currentTime+(at||0),o=A.createOscillator(),g=A.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+att);g.gain.exponentialRampToValueAtTime(.0001,t0+att+dec);
  o.connect(g);g.connect(out);o.start(t0);o.stop(t0+att+dec+.05);return o;}
var NB=null;function noiseBuf(){if(!NB){NB=A.createBuffer(1,A.sampleRate*2,A.sampleRate);var c=NB.getChannelData(0);for(var i=0;i<c.length;i++)c[i]=Math.random()*2-1;}return NB;}
function sweep(dur,f0,f1,peak,q,cut){var t0=A.currentTime,s=A.createBufferSource(),bp=A.createBiquadFilter(),g=A.createGain();s.buffer=noiseBuf();s.loop=true;
  bp.type='bandpass';bp.Q.value=q||1.2;bp.frequency.setValueAtTime(f0,t0);bp.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+dur*(cut?.97:.5));g.gain.exponentialRampToValueAtTime(.0001,t0+dur+(cut?.03:dur*.6));
  s.connect(bp);bp.connect(g);g.connect(out);s.start(t0);s.stop(t0+dur*1.7+.1);}
function bell(f,p){tone(f,'sine',p,.006,2.2);tone(f*2,'sine',p*.3,.004,1.1);tone(f*3.01,'sine',p*.1,.003,.6);}
var SFX={
  tick:function(){tone(1700+Math.random()*900,'sine',.022,.002,.045);tone(240,'sine',.02,.002,.06);},
  riser:function(){sweep(1.85,300,3200,.05,1.4,true);},
  bell:function(i){bell([293.66,369.99,440][i],.11);},
  whoosh:function(){sweep(.55,1800,260,.035,.8);},
  merge:function(){[146.83,220,293.66,369.99].forEach(function(f){bell(f,.06);});
    var t0=A.currentTime,o=A.createOscillator(),g=A.createGain();o.frequency.setValueAtTime(92,t0);o.frequency.exponentialRampToValueAtTime(38,t0+.9);
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.32,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+1.5);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+1.6);
    tone(1760,'sine',.02,.01,1.4,.05);tone(2637,'sine',.012,.01,1.2,.12);},
  pluck:function(k){var f=PENTA[Math.min(k,PENTA.length-1)];tone(f,'triangle',.05,.004,.32);tone(f*2,'sine',.012,.003,.18);},
  low:function(){tone(146.83,'sine',.08,.25,.9);},
  approve:function(){bell(1318.51,.07);setTimeout(function(){if(on)bell(1975.53,.06);},90);},
  pad:function(){[146.83,220,369.99,587.33].forEach(function(f,i){var t0=A.currentTime,o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.value=f;o.detune.value=(i%2?4:-4);
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(i>2?.018:.035,t0+.9);g.gain.setValueAtTime(i>2?.018:.035,t0+1.6);g.gain.exponentialRampToValueAtTime(.0001,t0+3.6);
    o.connect(g);g.connect(out);o.start(t0);o.stop(t0+3.7);});},
  end:function(){bell(587.33,.05);}
};
function fire(c){if(!on||!A||A.state!=='running')return;try{SFX[c[1]](c[2]);}catch(e){}}
var bedV=-1;function bed(t){if(!A)return;var duck=t>4.15&&t<4.6,v=(on&&playing&&!duck&&t<16.7)?.05:0;if(v===bedV)return;bedV=v;bedG.gain.setTargetAtTime(v,A.currentTime,v?.5:(duck?.04:.3));}

/* ---------- playback ---------- */
var playing=false,userPaused=false,viewable=false,finished=false,asking=false,asked=false,askLeft=0,askTick=null,prevT=0;
function ui(){
  root.classList.toggle('is-paused',!playing&&!finished&&!asking);root.classList.toggle('is-done',finished);
  var l=finished?'Replay':(playing||asking)?'Pause':'Play';
  if(ppT.textContent!==l){ppT.textContent=l;pp.setAttribute('aria-label',l+' the film');}
}
function sync(){
  if(asking){ui();return;}
  var go=viewable&&!d.hidden&&!userPaused&&!finished;
  if(go&&!playing){tl.play();playing=true;}else if(!go&&playing){tl.pause();playing=false;}
  ui();
}
function jump(t){if(asking)stopAsk();finished=t>=DUR;asked=t>ASK_T;tl.pause();playing=false;tl.seek(t);prevT=t;status(t);sync();}
function startAsk(){
  asking=true;asked=true;tl.pause();playing=false;tl.seek(ASK_T);prevT=ASK_T;root.classList.add('is-ask');
  card.removeAttribute('aria-hidden');ap.tabIndex=0;ap.setAttribute('aria-label','Approve the refund');
  askLeft=ASK_MAX;clearInterval(askTick);askTick=setInterval(function(){if(viewable&&!d.hidden&&!userPaused){askLeft-=100;if(askLeft<=0)endAsk(false);}},100);ui();
}
function stopAsk(){asking=false;clearInterval(askTick);root.classList.remove('is-ask');card.setAttribute('aria-hidden','true');ap.tabIndex=-1;ap.removeAttribute('aria-label');}
function endAsk(byUser){
  if(!asking)return;stopAsk();
  if(byUser){ap.classList.remove('tap');void ap.offsetWidth;ap.classList.add('tap');tl.seek(13.55);prevT=13.55;userPaused=false;}
  sync();
}
ap.addEventListener('click',function(){if(asking)endAsk(true);});
pp.addEventListener('click',function(){
  if(finished){jump(0);userPaused=false;sync();return;}
  if(asking){userPaused=!userPaused;ui();return;}
  userPaused=!userPaused;sync();
});
chs.forEach(function(b,i){b.addEventListener('click',function(){userPaused=false;jump(CH[i]);});});
snd.addEventListener('click',function(){
  on=!on;snd.setAttribute('aria-pressed',on?'true':'false');snd.querySelector('.t').textContent=on?'Sound on':'Sound off';
  if(on){if(!ac()){on=false;snd.setAttribute('aria-pressed','false');snd.querySelector('.t').textContent='Sound off';return;}
    out.gain.cancelScheduledValues(A.currentTime);out.gain.setTargetAtTime(.9,A.currentTime,.05);SFX.tick();
    if(finished){userPaused=false;jump(0);}else if(userPaused){userPaused=false;sync();}
  }else if(A){out.gain.setTargetAtTime(0,A.currentTime,.06);}
});

function loop(){
  var t=tl.time();
  if(playing){
    if(!asked&&t>=ASK_T-.02&&t<ASK_T+.5){startAsk();t=ASK_T;}
    else{for(var i=0;i<cues.length;i++){var c=cues[i];if(c[0]>prevT&&c[0]<=t)fire(c);}}
    if(t>=DUR-.005){finished=true;playing=false;tl.pause();tl.seek(DUR);t=DUR;ui();try{sessionStorage.setItem('kn-seen','1');}catch(e){}}
  }
  prevT=t;status(t);bed(t);
  W.requestAnimationFrame(loop);
}

/* ---------- build / rebuild ---------- */
var lastW=0,lastH=0;
function build(){
  var t=tl.time(),was=playing;M=measure();lastW=M.W;lastH=M.H;
  place(M);score(M);tl.seek(t);prevT=t;
  if(was){tl.play();}
  status(t);
}
build();
var seen=false;try{seen=sessionStorage.getItem('kn-seen')==='1';}catch(e){}
if(seen){finished=true;tl.seek(DUR);prevT=DUR;status(DUR);}
if('IntersectionObserver' in W){new IntersectionObserver(function(es){viewable=es[0].intersectionRatio>=.35;sync();},{threshold:[0,.35,.6]}).observe(root);}
else{viewable=true;}
d.addEventListener('visibilitychange',function(){if(A){d.hidden?A.suspend():(on&&A.resume());}sync();});
var rt=null;W.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){
  if(root.clientWidth!==lastW||Math.abs(root.clientHeight-lastH)>80)build();},180);});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){var w=words[0].offsetHeight;if(M&&(w!==M.wh||root.clientWidth!==lastW))build();});
ui();sync();W.requestAnimationFrame(loop);
W.__kn={tl:tl,seek:function(t){userPaused=true;jump(t);},play:function(){userPaused=false;sync();},
  ask:function(){return asking;},M:function(){return M;},sound:function(){return on&&A?A.state:'off';}};
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

/* Twinthos v3 site script. No dependencies.
   The Workflow Wheel: one renderer, driven by a single progress value p (0..1).
   Every visual state is a pure function of p, so scrolling back reverses cleanly. */
(function(){
'use strict';
var d=document, H=d.documentElement, W=window;
var GEO=/*GEO*/{};
var RMQ=W.matchMedia('(prefers-reduced-motion: reduce)');
var STQ=W.matchMedia('(min-width: 900px)');

/* ── nav ── */
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

/* ── maths ── */
function cl(x){return x<0?0:x>1?1:x;}
function ez(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function lp(a,b,t){return a+(b-a)*t;}
var BEATS=[[0,.14],[.14,.25],[.25,.47],[.47,.61],[.61,.74],[.74,.89],[.89,1]];
function win(b,a,z){var s=BEATS[b][0],L=BEATS[b][1]-s;return [s+a*L,s+z*L];}
function k(p,b,a,z){var w=win(b,a,z);return ez(cl((p-w[0])/(w[1]-w[0])));}
function at(p,b,t){return p>=win(b,t,t)[0];}
function beatOf(p){for(var i=0;i<BEATS.length;i++)if(p<BEATS[i][1]||i===BEATS.length-1)return [i,cl((p-BEATS[i][0])/(BEATS[i][1]-BEATS[i][0]))];}
var CIRC=2*Math.PI*(GEO.R||300);
function pt(deg,r){var a=deg*Math.PI/180;r=r||GEO.R;return [GEO.C+r*Math.sin(a),GEO.C-r*Math.cos(a)];}
function sArc(deg){return (((deg-90)%360)+360)%360/360*CIRC;}

/* ── the wheel renderer ── */
function Wheel(svg){
  var q=function(s){return svg.querySelector(s);}, qa=function(s){return svg.querySelectorAll(s);};
  this.svg=svg;
  this.ring=q('.w-ring');this.done=q('.w-done');this.mk=q('.w-mk');this.mtag=q('.w-mtag');
  this.chord=q('.w-chord');this.branch=q('.w-branch');this.bound=q('.w-bound');this.boundL=q('.w-bound-l');
  this.team=q('.w-team');this.cust=q('.w-cust');this.clock=q('.w-clock');this.attn=q('.w-attn');
  this.pkt=q('.w-pkt');this.ghosts=qa('.w-ghosts>g');this.ticks=q('.w-ticks');
  this.later=q('.w-later');this.lead=q('.w-lead');this.email=q('.w-email');this.emailL=q('.w-email-l');
  this.late=[q('.l-D'),q('.n-D'),q('.w-bound')];this.lE=q('.l-E');
  this.labs=qa('.w-lab:not(.w-bound-l)');
  this.teth=qa('.w-teth');
  var OFF=[[-18,-196,-5],[292,128,4],[-240,105,-3]];
  this.frags=[].map.call(qa('.w-frag'),function(g,i){
    var r=g.querySelector('.w-chip');
    var x=+r.getAttribute('x'),y=+r.getAttribute('y'),w=+r.getAttribute('width'),h=+r.getAttribute('height');
    return {g:g,chip:r,cx:x+w/2,cy:y+h/2,o:OFF[i]};
  });
  this.chordL=this.chord.getTotalLength();this.branchL=this.branch.getTotalLength();
  this.mtag.style.opacity=0;
}
Wheel.prototype.set=function(p){
  var S=this, E=GEO.ang;
  var scatter=1-k(p,0,.08,.72), attn=1-k(p,1,0,.22), late=k(p,0,.5,.95);
  var out=k(p,6,0,.5);
  /* beat 1: loose fragments, a broken path, everything tethered to one person */
  var gap=64*scatter, seg=CIRC/3;
  if(gap<.5){S.ring.removeAttribute('stroke-dasharray');S.ring.removeAttribute('stroke-dashoffset');}
  else{S.ring.setAttribute('stroke-dasharray',(seg-gap)+' '+gap);S.ring.setAttribute('stroke-dashoffset',seg-gap/2-sArc(20));}
  S.frags.forEach(function(f,i){
    var dx=f.o[0]*scatter,dy=f.o[1]*scatter,r=f.o[2]*scatter;
    f.g.setAttribute('transform','translate('+dx.toFixed(1)+' '+dy.toFixed(1)+') rotate('+r.toFixed(2)+' '+f.cx+' '+f.cy+')');
    f.chip.style.opacity=scatter;
    var t=S.teth[i];t.setAttribute('x1',500);t.setAttribute('y1',500);t.setAttribute('x2',(f.cx+dx).toFixed(1));t.setAttribute('y2',(f.cy+dy).toFixed(1));
    t.style.opacity=scatter;
  });
  S.attn.style.opacity=attn;
  S.late.forEach(function(e){e.style.opacity=late;});
  [S.lead,S.email,S.emailL,S.later,S.cust].forEach(function(e){e.style.opacity=late*(1-out*.7);});
  /* marker path: lead-in, then the circle, forward only */
  var mkOp=k(p,1,.12,.3), lead=k(p,1,.2,.62);
  var ang=E.A+48*k(p,2,0,.22)+115*k(p,3,0,.35)+35*k(p,4,0,.28)+35*k(p,4,.5,.7)+67*k(p,5,0,.3);
  var x,y;
  if(lead<1){x=lp(GEO.email[0],pt(E.A)[0],lead);y=pt(E.A)[1];}
  else{var q=pt(ang);x=q[0];y=q[1];}
  S.mk.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+')');
  S.mk.style.opacity=mkOp;
  var dl=lead<1?0:sArc(ang)-sArc(E.A);if(dl<0)dl+=CIRC;if(ang-E.A>=359.9)dl=CIRC;
  S.done.setAttribute('stroke-dasharray',dl.toFixed(1)+' '+CIRC);
  S.done.style.opacity=1-out*.55;
  var bt=beatOf(p),b=bt[0],t=bt[1];
  var wait=(b===2&&t>=.36&&t<.74)||(b===4&&t>=.28&&t<.66);
  var amber=at(p,5,.3);
  S.mk.classList.toggle('wait',wait&&!amber);S.mk.classList.toggle('amber',amber);
  /* customer: request out, the wait, reply back */
  S.chord.style.opacity=(b===2)?.9:.35*late;
  var clk=k(p,2,.3,.38)*(1-k(p,2,.74,.8));
  S.clock.style.opacity=clk;
  S.clock.setAttribute('transform','rotate('+(540*cl((t-.36)/.38)*(b===2?1:0)).toFixed(1)+' '+GEO.cust[0]+' '+GEO.cust[1]+')');
  var pk=null;
  if(b===2&&t>=.12&&t<.34){pk=[S.chord,S.chordL,cl((t-.12)/.22)];}
  else if(b===2&&t>=.62&&t<.8){pk=[S.chord,S.chordL,1-cl((t-.62)/.18)];}
  else if((b===5&&t>=.5)||b===6){pk=[S.branch,S.branchL,b===6?1:ez(cl((t-.5)/.3))];}
  if(pk){var P2=pk[0].getPointAtLength(pk[1]*pk[2]);S.pkt.setAttribute('transform','translate('+P2.x.toFixed(1)+' '+P2.y.toFixed(1)+')');S.pkt.style.opacity=b===6?1-out:1;}
  else S.pkt.style.opacity=0;
  /* the later date notch */
  S.later.classList.toggle('on',b===4);
  /* the approval branch */
  S.bound.classList.toggle('on',amber);
  var bl=k(p,5,.3,.45);S.boundL.style.opacity=bl*(1-out*.8);S.lE.style.opacity=late*(1-bl)*(1-out*.8);
  S.branch.setAttribute('stroke-dasharray',k(p,5,.3,.55).toFixed(3)+' 1');
  S.team.style.opacity=k(p,5,.44,.56);
  /* other enquiries keep moving while this one waits for a person */
  var gs=cl((p-BEATS[5][0])/(BEATS[6][1]-BEATS[5][0])), gop=k(p,5,.35,.5)*(1-out);
  [[300,70],[462,58]].forEach(function(g,i){var c=pt(g[0]+g[1]*gs),e=S.ghosts[i];e.setAttribute('transform','translate('+c[0].toFixed(1)+' '+c[1].toFixed(1)+')');e.style.opacity=gop;});
  /* the outro simplifies the wheel into a map */
  S.ticks.style.opacity=1-out;
  S.labs.forEach(function(e){if(e.closest('.w-attn'))return;if(e.classList.contains('l-E'))return;var lt=e.classList.contains('l-D')?late:1;e.style.opacity=lt*(1-out*.8);});
  return bt;
};

/* ── specimen stack (live stage only) ── */
function Spec(root){
  this.root=root;this.lv={};var S=this;
  root.querySelectorAll('.lv').forEach(function(e){S.lv[e.dataset.l]=e;});
  this.rr=root.querySelector('.lv-rr');
  this.reply=root.querySelector('.rr-reply');this.rec=root.querySelector('.rr-rec');
  this.team=root.querySelector('.rec-team');
  this.toks=[].slice.call(root.querySelectorAll('.tok'));
  this.days=root.querySelectorAll('.day span');
  this.measure();
}
Spec.prototype.measure=function(){
  var R=this.rr.getBoundingClientRect(),S=this;
  this.path=this.toks.map(function(tk){
    var a=S.reply.querySelector('.slot[data-k="'+tk.dataset.k+'"]').getBoundingClientRect();
    var b=S.rec.querySelector('.slot[data-k="'+tk.dataset.k+'"]').getBoundingClientRect();
    return [a.left-R.left,a.top-R.top,b.left-R.left,b.top-R.top];
  });
  this.rr.style.height='';
  this.hA=this.reply.offsetHeight;this.hB=this.rec.offsetHeight;
  this.pad=this.rr.offsetHeight-Math.max(this.hA,this.hB);
  this.last=-1;
};
Spec.prototype.set=function(p,b,t){
  var L=null,m=0,S=this,out=k(p,6,0,.35);
  if(b===1&&t>=.3)L='msg';
  else if(b===2)L=t<.66?'req':'rr';
  else if(b===3){L='rr';m=k(p,3,.12,.62);}
  else if(b===4){L=t<.28?'rr':'fup';m=1;}
  else if(b===5)L='disc';
  else if(b===6&&out<1)L='disc';
  if(b===4&&L==='rr')m=1;
  for(var n in S.lv)S.lv[n].classList.toggle('on',n===L);
  S.lv.req.classList.toggle('card-wait',b===2&&t>=.36);
  S.lv.disc.style.opacity=b===6?1-out:'';
  S.lv.fup.classList.toggle('card-wait',b===4&&t<.62);S.lv.fup.classList.toggle('sent',!(b===4&&t<.62));
  S.rr.style.height=(S.pad+lp(S.hA,S.hB,ez(cl((m-.1)/.6)))).toFixed(1)+'px';
  S.reply.style.opacity=1-cl(m/.3);
  var shown=cl((m-.3)/.35);
  S.rec.querySelectorAll('.card-h,dt').forEach(function(e){e.style.opacity=shown;});
  S.team.style.opacity=cl((m-.7)/.25);
  S.toks.forEach(function(tk,i){var q=S.path[i],e=ez(cl((m-.08*i)/(.84)));
    tk.style.transform='translate('+lp(q[0],q[2],e).toFixed(1)+'px,'+lp(q[1],q[3],e).toFixed(1)+'px)';tk.style.fontSize=lp(1.14,1,e)+'em';});
  var day=(b>=1&&b<=3)||(b===4&&t<.3)?0:b===4?1:-1;
  S.days.forEach(function(e,i){e.classList.toggle('on',i===day);});
};

/* ── the film: a 15-second silent reel in the first screen ── */
var srcSvg=d.querySelector('#wheel-src svg');
var tpl=srcSvg?srcSvg.cloneNode(true):null;
var film=d.getElementById('film');
if(film){
  var v=film.querySelector('video'), tg=film.querySelector('.film-toggle'), tap=film.querySelector('.film-tap');
  var userPaused=false, inView=true;
  if(W.matchMedia('(max-width: 899px)').matches&&v.dataset.posterSm){v.poster=v.dataset.posterSm;
    var ps=v.querySelector('source[media]');if(ps&&v.currentSrc&&v.currentSrc.indexOf('portrait')<0){v.src=ps.getAttribute('src');v.load();}}
  var label=function(){var on=!v.paused&&!v.ended;var tx=on?'Pause':(v.ended?'Replay':'Play');tg.textContent=tx;tg.setAttribute('aria-label',on?'Pause the film':(v.ended?'Replay the film':'Play the film'));film.classList.toggle('is-paused',!on);};
  var go=function(){if(userPaused||RMQ.matches||!inView||v.ended)return;var pr=v.play();
    if(pr&&pr.catch)pr.then(function(){tap.classList.remove('on');}).catch(function(){tap.classList.add('on');label();});};
  ['play','pause','ended'].forEach(function(e){v.addEventListener(e,label);});
  ['loadeddata','canplay'].forEach(function(e){v.addEventListener(e,go);});
  tg.addEventListener('click',function(){if(v.paused){userPaused=false;inView=true;var pr=v.play();pr&&pr.catch&&pr.catch(function(){});}else{userPaused=true;v.pause();}});
  tap.addEventListener('click',function(){userPaused=false;var pr=v.play();pr&&pr.then&&pr.then(function(){tap.classList.remove('on');});});
  var once=function(e){if(e.target.closest&&e.target.closest('a,button,input,select,textarea,label'))return;
    if(v.paused&&!userPaused&&!RMQ.matches){var pr=v.play();pr&&pr.then&&pr.then(function(){tap.classList.remove('on');});}
    d.removeEventListener('touchstart',once);d.removeEventListener('click',once);};
  d.addEventListener('touchstart',once,{passive:true});d.addEventListener('click',once);
  if('IntersectionObserver' in W){new IntersectionObserver(function(en){inView=en[0].isIntersecting;if(inView)go();else if(!v.paused)v.pause();},{threshold:.2}).observe(film);}
  var rm=function(){if(RMQ.matches){v.pause();v.removeAttribute('autoplay');}else go();};
  RMQ.addEventListener&&RMQ.addEventListener('change',rm);
  rm();label();
}

/* ── static figures: the same wheel, fixed at one moment ── */
if(tpl){
  d.querySelectorAll('.beat-fig[data-p]').forEach(function(f){
    var box=d.createElement('div');box.className='fig';var s=tpl.cloneNode(true);box.appendChild(s);
    f.insertBefore(box,f.firstChild);new Wheel(s).set(parseFloat(f.dataset.p));
  });
}

/* ── offer maps: the managed map makes one lap, once ── */
var mm=d.querySelector('.map-managed');
if(mm&&!RMQ.matches&&'IntersectionObserver' in W){
  mm.classList.add('armed');
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){requestAnimationFrame(function(){mm.classList.add('run');});io.disconnect();}});},{threshold:.55});
  io.observe(mm);
}

/* ── v7: scroll-told sections (all progressive; content is visible without JS) ── */
(function(){
  var IO='IntersectionObserver' in W;
  /* the pile-up: bubbles drop in, the counter climbs */
  var chat=d.querySelector('[data-chat]');
  if(chat){
    var bs=chat.querySelectorAll('.bub'),cnt=chat.querySelector('[data-count]');
    var run=function(){
      if(RMQ.matches||!IO){bs.forEach(function(b){b.classList.add('in');});return;}
      if(cnt)cnt.textContent='0';
      bs.forEach(function(b,i){setTimeout(function(){b.classList.add('in');if(cnt)cnt.textContent=String(i+1);},350+i*520);});
    };
    if(IO){var o1=new IntersectionObserver(function(en){if(en[0].isIntersecting){o1.disconnect();run();}},{threshold:.35});o1.observe(chat);}else run();
  }
  /* the ledger: each job ticks off in order as it scrolls into view */
  var lg=d.querySelector('[data-ledger]');
  if(lg){
    var rows=[].slice.call(lg.querySelectorAll('.lg-r'));
    if(RMQ.matches||!IO){rows.forEach(function(r,i){r.classList.add('on');if(i<rows.length-1)r.classList.add('nx');});}
    else{
      var lit=function(){
        var vh=W.innerHeight,n=0;
        rows.forEach(function(r){var b=r.getBoundingClientRect();if(b.top<vh*.72){if(!r.classList.contains('on'))r.classList.add('on');n++;}});
        rows.forEach(function(r,i){var nx=rows[i+1];r.classList.toggle('nx',!!nx&&nx.classList.contains('on'));});
      };
      var tk=false,onS=function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;lit();});};
      W.addEventListener('scroll',onS,{passive:true});W.addEventListener('resize',onS);lit();
    }
  }
  /* the Authority Line draws itself, then the two halves settle */
  var al=d.querySelector('[data-al]');
  if(al){
    if(RMQ.matches||!IO)al.classList.add('in');
    else{var o3=new IntersectionObserver(function(en){if(en[0].isIntersecting){o3.disconnect();al.classList.add('in');}},{threshold:.3});o3.observe(al);}
  }
  /* sticky call-to-action on phones: appears once the hero has gone, hides at the end */
  var st=d.getElementById('stick'),hero=d.querySelector('.h7'),fin=d.querySelector('.final');
  if(st&&hero&&IO){
    var seenHero=true,seenFin=false;
    var upd=function(){var on=!seenHero&&!seenFin;st.classList.toggle('on',on);st.setAttribute('aria-hidden',on?'false':'true');
      var a=st.querySelector('a');if(a)a.tabIndex=on?0:-1;};
    new IntersectionObserver(function(en){seenHero=en[0].isIntersecting;upd();},{threshold:.0,rootMargin:'0px 0px -40% 0px'}).observe(hero);
    if(fin)new IntersectionObserver(function(en){seenFin=en[0].isIntersecting;upd();},{threshold:.15}).observe(fin);
  }
})();

/* ── enquiry form ── */
d.querySelectorAll('form[data-form]').forEach(function(f){
  var done=d.getElementById(f.dataset.done), fail=f.querySelector('.form-fail'), btn=f.querySelector('[type=submit]');
  var subj=f.querySelector('[name=_subject]');
  var LBL={fit:'15-minute fit call',audit:'Operations audit (£999)',managed:'Managed workflow (£5,000 per month)',unsure:'Not sure yet'};
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
