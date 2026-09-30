/* Twinthos v3 site script. No dependencies.
   The Workflow Wheel: one renderer, driven by a single progress value p (0..1).
   Every visual state is a pure function of p, so scrolling back reverses cleanly. */
(function(){
'use strict';
var d=document, H=d.documentElement, W=window;
var GEO={"C": 500.0, "R": 300.0, "ang": {"A": 292, "B": 340, "C": 455, "N": 490, "D": 525, "E": 598}, "email": [58.0, 387.6], "cust": [648.0, 92.0], "team": [118.0, 842.0]};
var RMQ=W.matchMedia('(prefers-reduced-motion: reduce)');
var STQ=W.matchMedia('(min-width: 900px) and (min-height: 600px)');

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

/* ── the stage ── */
var sec=d.querySelector('section.wheel'), liveSvg=sec&&sec.querySelector('.fig-live svg');
var tpl=liveSvg?liveSvg.cloneNode(true):null;
if(sec&&liveSvg){
  var stage=sec.querySelector('.stage'), wheel=new Wheel(liveSvg), spec=new Spec(sec.querySelector('.spec-live'));
  var beats=[].slice.call(sec.querySelectorAll('.beat')), outro=sec.querySelector('.outro');
  var ctrl=sec.querySelector('.stage-ctrl'), dots=[].slice.call(ctrl.querySelectorAll('.sc-dots button'));
  var prev=ctrl.querySelector('.sc-prev'), next=ctrl.querySelector('.sc-next');
  var on=false, cur=-1, target=0, shown=-1, raf=0, curBeat=-1;
  var travel=function(){return sec.offsetHeight-stage.offsetHeight;};
  var top0=function(){return sec.getBoundingClientRect().top+W.scrollY-nav.offsetHeight;};
  var readP=function(){var tr=travel();return tr>0?cl((W.scrollY-top0())/tr):0;};
  var paint=function(p){
    var bt=wheel.set(p),b=bt[0],t=bt[1];
    spec.set(p,b,t);
    if(b!==curBeat){
      beats.forEach(function(e,i){var a=i===Math.min(b,5)&&b<6;e.classList.toggle('on',a);});
      outro.classList.toggle('on',b===6);
      dots.forEach(function(e,i){if(i===Math.min(b,5))e.setAttribute('aria-current','step');else e.removeAttribute('aria-current');});
      prev.disabled=b===0;next.disabled=b>=5;curBeat=b;
    }
    if(b<6){var sts=beats[b].querySelectorAll('.st'),pick=0;
      sts.forEach(function(e,i){if(t>=parseFloat(e.dataset.t||0))pick=i;});
      sts.forEach(function(e,i){e.classList.toggle('on',i===pick);});}
  };
  var tick=function(){raf=0;if(!on)return;
    var dd=target-cur;cur=Math.abs(dd)<.0004?target:cur+dd*.2;
    if(cur!==shown){paint(cur);shown=cur;}
    if(cur!==target)raf=requestAnimationFrame(tick);
  };
  var onScroll=function(){if(!on)return;target=readP();if(!raf)raf=requestAnimationFrame(tick);};
  var go=function(i){var s=BEATS[i][0]+.62*(BEATS[i][1]-BEATS[i][0]);W.scrollTo({top:top0()+s*travel()+1,behavior:RMQ.matches?'auto':'smooth'});};
  dots.forEach(function(e,i){e.addEventListener('click',function(){go(i);});});
  prev.addEventListener('click',function(){go(Math.max(0,Math.min(curBeat,6)-1));});
  next.addEventListener('click',function(){go(Math.min(5,curBeat+1));});
  var mode=function(){
    var want=STQ.matches&&!RMQ.matches;
    H.classList.toggle('stage-on',want);ctrl.hidden=!want;on=want;
    beats.forEach(function(e){e.classList.remove('on');});outro.classList.remove('on');curBeat=-1;
    if(want){spec.measure();cur=target=readP();shown=-1;paint(cur);}
  };
  mode();
  STQ.addEventListener&&STQ.addEventListener('change',mode);
  RMQ.addEventListener&&RMQ.addEventListener('change',mode);
  W.addEventListener('scroll',onScroll,{passive:true});
  W.addEventListener('resize',function(){if(on){spec.measure();target=readP();cur=target;shown=-1;paint(cur);}});
  d.fonts&&d.fonts.ready.then(function(){if(on){spec.measure();shown=-1;paint(cur);}});
  W.TW_STAGE={paint:paint,readP:readP,go:go};
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
