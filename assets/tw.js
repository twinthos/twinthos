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

/* Industry stage (one reusable demonstration), workspace highlights, reveal-on-view for the quieter sections. */
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
  [].slice.call(d.querySelectorAll('.ws,.dep')).forEach(function(s){
    s.classList.add('pre');
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){s.classList.remove('pre');o.disconnect();}},{threshold:.18}).observe(s);
  });
}
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
