/* Home hero film "One employee". 18 s on one clock (TWTL), four chapters:
   1 the drag: the headline, then routine work piling up around it (calm, composed rows, never a scatter)
   2 one employee: its own inbox, phone and computer, fused into one mark: one digital employee
   3 the work: the same tasks come back as a dated work log; the one that matters stops at the Authority Line for the visitor's own click
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
/* each task: [waiting label, age, done label, time done] - chapter 1 shows the first, chapter 3 the second */
var TASKS=[['Reply to Maya about the quote','2d','Replied to Maya with the quote','09:02'],['Chase invoice #2041','9d','Chased invoice #2041','09:04'],
  ['Update the CRM','3d','Updated the CRM','09:05'],['Book the site visit','1d','Booked the site visit','09:07'],
  ['Send the weekly report','2d','Sent the weekly report','09:09'],['Follow up the new enquiry','3d','Followed up the new enquiry','09:11']];
var CHECK='<svg viewBox="0 0 10 10"><path d="M1.5 5.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var ICONS=[['Inbox','<svg viewBox="0 0 64 64"><rect x="6" y="13" width="52" height="38" rx="6" pathLength="1"/><path d="M8 17l24 18 24-18" pathLength="1"/></svg>'],
  ['Phone','<svg viewBox="0 0 64 64"><rect x="19" y="5" width="26" height="54" rx="7" pathLength="1"/><path d="M28.5 51h7" pathLength="1"/></svg>'],
  ['Computer','<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="34" rx="4" pathLength="1"/><path d="M32 44v10M22 54h20" pathLength="1"/></svg>'],['Team chat','<svg viewBox="0 0 64 64"><path d="M12 12h40a5 5 0 015 5v22a5 5 0 01-5 5H30l-11 9v-9h-7a5 5 0 01-5-5V17a5 5 0 015-5z" pathLength="1"/><path d="M21 28h.01M32 28h.01M43 28h.01" pathLength="1"/></svg>'],['Memory','<svg viewBox="0 0 64 64"><path d="M8 12h18a6 6 0 016 6v36a4 4 0 00-4-4H8z" pathLength="1"/><path d="M56 12H38a6 6 0 00-6 6v36a4 4 0 014-4h20z" pathLength="1"/></svg>'],['Card','<svg viewBox="0 0 64 64"><rect x="5" y="15" width="54" height="36" rx="5" pathLength="1"/><path d="M5 25h54M13 41h12" pathLength="1"/></svg>']];
function el(tag,cls,html){var e=d.createElement(tag);e.className=cls;if(html)e.innerHTML=html;e.setAttribute('aria-hidden','true');fx.appendChild(e);return e;}
var glow=el('i','kn-glow');
var chips=TASKS.map(function(t){return el('span','kn-chip','<i></i>'+t[0]+'<em>'+t[1]+'</em>');});
var rows=TASKS.map(function(t){return el('span','kn-row','<time>'+t[3]+'</time><i class="ck">'+CHECK+'</i><span>'+t[2]+'</span>');});
var ics=ICONS.map(function(c){return el('div','kn-ic',c[1]+'<b>'+c[0]+'</b>');});
var ring=el('i','kn-ring');
var caps=[el('p','kn-cap','Work waiting for someone to remember.'),el('p','kn-cap l','One digital employee.'),
  el('p','kn-cap l','Anything that matters waits for you.'),el('p','kn-cap','Everything an employee needs.')];
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
  root.style.setProperty('--is',nar?'54px':(w<1100?'72px':'84px'));
  var m={W:w,H:h,nar:nar,cx:w/2,gut:nar?20:Math.max(28,w*.04)};
  m.nav=(d.querySelector('.nav')||{offsetHeight:68}).offsetHeight||68;
  m.cy=Math.round((m.nav+h-96)/2);m.SC=nar?1.25:1.3;m.NC=(nar||w<1000)?4:6;
  m.mk=off(mk);m.mc={x:m.mk.x+m.mk.w/2,y:m.mk.y+m.mk.h/2};m.st=off(st);
  m.h1=off(h1);m.wh=words[0].offsetHeight;
  m.chip=chips.map(function(c){return [c.offsetWidth,c.offsetHeight];});
  m.row=rows.map(function(r){return r.offsetWidth;});m.rh=nar?34:40;
  m.ic=[ics[0].offsetWidth,ics[0].offsetHeight];m.is=nar?54:(w<1100?72:84);
  m.cap=caps.map(function(c){return c.offsetHeight;});
  m.card=[card.offsetWidth,card.offsetHeight];m.pr=pr.offsetHeight;m.prwh=prw[0].offsetHeight;
  return m;
}
function place(m){
  /* chapter 3 stack, centred between the nav and the controls: mark, status, work log, Authority Line, card, caption */
  var mh=m.mk.h*m.SC,gA=m.nar?22:28,gB=m.nar?44:52,gC=m.nar?54:60,gD=m.nar?30:40,avail=m.H-96-m.nav,N=4,tot;
  for(;N>=2;N--){tot=mh+14+m.st.h+gA+N*m.rh+gB+gC+m.card[1]+gD+m.cap[2];if(tot<=avail-16)break;}
  m.N=Math.max(2,N);tot=mh+14+m.st.h+gA+m.N*m.rh+gB+gC+m.card[1]+gD+m.cap[2];
  var top=Math.round(m.nav+Math.max(8,(avail-tot)/2));
  m.mC={x:m.cx,y:Math.round(top+mh/2)};m.stC=Math.round(top+mh+14);
  m.logY=m.stC+m.st.h+gA;m.alY=Math.round(m.logY+m.N*m.rh+gB);
  m.cardX=Math.round(m.cx-m.card[0]/2);m.cardY=m.alY+gC;
  m.cardC={x:m.cardX+m.card[0]/2,y:m.cardY+m.card[1]/2};
  m.capC=Math.round(m.cardY+m.card[1]+gD);
  /* chapter 1: the waiting tasks sit in composed rows above and below the headline, never on it */
  var cap0=Math.round(m.h1.y+m.h1.h+26),zA=[m.nav+18,m.h1.y-20],zB=[cap0+m.cap[0]+26,m.H-112];
  var nA=Math.ceil(m.NC/2),use=chips.slice(0,m.NC);
  function lay(list,z,jit){
    var k=list.length,zh=z[1]-z[0],ws=list.map(function(c){return m.chip[chips.indexOf(c)];}),sum=0,i;
    for(i=0;i<k;i++)sum+=ws[i][0];
    var avW=m.W-2*m.gut,ch=ws[0]?ws[0][1]:40;
    if(k&&sum+48*(k-1)<=avW*.94&&zh>=ch+16){ /* one row, evenly spaced, gentle vertical offsets */
      var gap=(avW-sum)/(k+1),x=m.gut+gap,amp=Math.max(0,Math.min(26,(zh-ch)/2-8));
      for(i=0;i<k;i++){list[i]._p={x:x,y:z[0]+(zh-ch)/2+jit[i%jit.length]*amp,w:ws[i][0],h:ch};x+=ws[i][0]+gap;}
    }else{ /* stacked, alternating sides of the centre line */
      var fit=Math.max(0,Math.min(k,Math.floor((zh+12)/(ch+14))));
      for(i=fit;i<k;i++)list[i]._p=null;
      var rg=fit?Math.min(26,(zh-fit*ch)/(fit+1)):0,y=z[0]+(zh-fit*ch-(fit-1)*rg)/2;
      for(i=0;i<fit;i++){var cw=ws[i][0],sh=Math.min(44,Math.max(0,(avW-cw)/2));
        list[i]._p={x:m.cx-cw/2+(i%2?sh:-sh),y:y,w:cw,h:ch};y+=ch+rg;}
    }
  }
  chips.forEach(function(c){c._p=null;});
  lay(use.slice(0,nA),zA,[.7,-.6,.3]);lay(use.slice(nA),zB,[-.5,.6,-.2]);
  m.NC=chips.filter(function(c){return c._p;}).length;
  chips.forEach(function(c){if(c._p){c.style.left=Math.round(c._p.x)+'px';c.style.top=Math.round(c._p.y)+'px';c.style.display='';}else c.style.display='none';});
  /* chapter 3 log column, centred on its widest row */
  var lw=0;for(var j=0;j<m.NC;j++)lw=Math.max(lw,m.row[j]);m.logX=Math.round(m.cx-lw/2);
  rows.forEach(function(r,j){r.style.display=j<m.NC?'':'none';r.style.left=m.logX+'px';r.style.top=Math.round(m.logY)+'px';r.style.height=m.rh+'px';});
  var gap2=m.nar?Math.min(124,(m.W-24)/3):Math.min(290,m.W*.21);
  /* chapter 2: six tools in one calm row (3 x 2 on phones) */
  var cols=m.nar?3:6,cw2=m.nar?Math.min(118,(m.W-24)/3):Math.min(190,(m.W-2*m.gut)/6),rg2=m.is+(m.nar?62:0),icB=0;
  ics.forEach(function(e,i){var c=i%cols,r=Math.floor(i/cols),nr=Math.ceil(ics.length/cols);
    e._x=m.cx+(c-(cols-1)/2)*cw2;e._y=m.cy-m.is/2-14+(r-(nr-1)/2)*rg2;icB=Math.max(icB,e._y+e.offsetHeight);
    e.style.left=Math.round(e._x)+'px';e.style.top=Math.round(e._y)+'px';});
  caps[3].style.top=Math.round(icB+(m.nar?30:44))+'px';
  ring.style.left=m.cx+'px';ring.style.top=m.cy+'px';
  glow.style.left=Math.round(m.mc.x)+'px';glow.style.top=Math.round(m.mc.y)+'px';
  var S=m.nar?1.9:2.2;m.S=S;
  var alW=m.nar?m.W*.92:Math.min(m.W*.66,920);
  al.style.left=Math.round(m.cx-alW/2)+'px';al.style.width=Math.round(alW)+'px';al.style.top=m.alY+'px';al.style.setProperty('--in',Math.max(0,Math.round((alW-m.card[0])/2))+'px');
  card.style.left=m.cardX+'px';card.style.top=m.cardY+'px';
  caps[0].style.top=cap0+'px';
  caps[1].style.top=Math.round(m.cy+m.mk.h*S/2+34)+'px';
  caps[2].style.top=m.capC+'px';
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
  words.forEach(function(w,i){var a=.06+i*.075,b=16.98+i*.055;
    tl.mk(w,[[0,{y:wh}],[a,{y:wh}],[a+.95,{y:0},SP],[4.45,{y:0}],[4.5,{y:wh}],[b,{y:wh}],[b+.95,{y:0},SP]]);});
  tl.win(sub,[[17.3,DUR]],{dy:14});tl.win(cta,[[17.5,DUR]],{dy:14});tl.win(desc,[[17.65,DUR]],{dy:8});
  /* the drag: chips pile up; the frame leans in; the room goes quiet at 4.2 */
  tl.cam(fx,[[0,{s:1}],[4.15,{s:1.035}],[4.7,{s:1},EO]]);
  var list=chips.filter(function(c){return c._p;});
  list.forEach(function(c,j){c._a=1.0+j*.22;cues.push([c._a+.04,'tick']);
    tl.mk(c,[[0,{o:0,y:12,s:.9}],[c._a,{o:0,y:12,s:.9}],[c._a+.5,{o:1,y:0,s:1},SP],[4.2,{o:1,y:0,s:1}],[4.6,{o:0,y:-6,s:.97},ES]]);});
  cues.push([2.35,'riser']);
  tl.win(caps[0],[[2.1,3.95]],{dy:10});
  /* one employee */
  ics.forEach(function(e,i){var t0=4.55+i*.26,dx=m.cx-e._x,dy=m.cy-(e._y+m.is/2);
    tl.mk(e,[[0,{o:0,y:18}],[t0,{o:0,y:18}],[t0+.6,{o:1,y:0},SP],[6.9,{o:1,x:0,y:0,s:1}],[7.5,{o:0,x:dx,y:dy,s:.3},EI]]);
    [].slice.call(e.querySelectorAll('svg *')).forEach(function(s){prop(s,'strokeDashoffset',[[0,1],[t0,1],[t0+.95,0,EO]]);});
    tl.win(e.querySelector('b'),[[t0+.25,6.75]],{dy:10});
    cues.push([t0,'bell',i%3]);
  });
  tl.win(caps[3],[[5.5,6.85]],{dy:10});
  cues.push([6.92,'whoosh']);cues.push([7.48,'merge']);
  tl.mk(ring,[[0,{o:0,s:.5}],[7.48,{o:0,s:.5}],[7.52,{o:.9,s:.6}],[8.7,{o:0,s:3.4},EO]]);
  tl.mk(mk,[[0,{o:0,x:dxm,y:dym,s:S*.6}],[7.42,{o:0,x:dxm,y:dym,s:S*.6}],[7.95,{o:1,s:S},SP],[9.3,{o:1,x:dxm,y:dym,s:S}],[10.1,{o:1,x:cxm,y:cym,s:SC},EI],[14.55,{o:1,x:cxm,y:cym,s:SC}],[15.25,{o:1,x:0,y:0,s:1},EI]]);
  tl.mk(glow,[[0,{o:0,x:dxm,y:dym,s:.5}],[7.4,{o:0,s:.5}],[7.85,{o:1,s:1.15},EO],[8.9,{o:.65,s:1},ES],[9.3,{o:.65,x:dxm,y:dym}],[10.1,{o:.5,x:cxm,y:cym,s:.75},EI],
    [13.6,{o:.5,s:.75}],[13.85,{o:.95,s:.9},EO],[14.55,{o:.45,s:.75,x:cxm,y:cym},ES],[15.25,{o:.45,x:0,y:0},EI],[16.4,{o:.45}],[17.2,{o:0,s:.6},ES]]);
  tl.win(caps[1],[[8.05,9.3]],{dy:12});
  /* the work: the same tasks return as a dated log, newest at the bottom; older lines scroll up once the window is full */
  tl.mk(st,[[0,{o:0,y:sdy+8}],[10.0,{o:0,y:sdy+8}],[10.35,{o:1,y:sdy},EO],[14.55,{o:1,y:sdy}],[15.25,{o:1,y:0},EI]]);cues.push([9.32,'whoosh']);
  var NC=m.NC,N=m.N,rh=m.rh,ta=[];for(var j=0;j<NC;j++)ta.push(10.35+j*.3);
  rows.slice(0,NC).forEach(function(r,j){
    var s0=j<N?j:N-1,k=[[0,{o:0,x:-12,y:s0*rh}],[ta[j],{o:0,x:-12,y:s0*rh}],[ta[j]+.42,{o:1,x:0,y:s0*rh},EO]],sl=s0;
    for(var q=j+1;q<NC;q++){if(q>=N){sl--;k.push([ta[q],{o:sl>=0?1:1,x:0,y:(sl+1)*rh}]);k.push([ta[q]+.42,{o:sl>=0?1:0,x:0,y:sl*rh},EO]);}}
    if(sl>=0){k.push([12.4,{o:1,x:0,y:sl*rh}]);k.push([12.8,{o:.42,x:0,y:sl*rh},ES]);k.push([14.25,{o:.42,x:0,y:sl*rh}]);k.push([14.6,{o:0,x:0,y:sl*rh},ES]);}
    tl.mk(r,k);
    tl.mk(r.querySelector('.ck'),[[0,{o:0,s:.3}],[ta[j]+.12,{o:0,s:.3}],[ta[j]+.36,{o:1,s:1},SP]]);
    absorb.push(ta[j]+.2);cues.push([ta[j]+.12,'pluck',j*2]);
  });
  tl.mk(card,[[0,{o:0,s:.92,y:10}],[12.45,{o:0,s:.92,y:10}],[12.95,{o:1,s:1,y:0},SP],[14.1,{o:1,s:1,x:0,y:0}],[14.6,{o:0,s:.3,x:T3.x-m.cardC.x,y:T3.y-m.cardC.y},EI]]);
  cues.push([12.5,'low']);
  tl.mk(al,[[0,{o:0,cp:'inset(-40px 50% -40px 50%)'}],[12.55,{o:1,cp:'inset(-40px 50% -40px 50%)'}],[13.15,{o:1,cp:'inset(-40px 0% -40px 0%)'},EO],[14.2,{o:1}],[14.6,{o:0},ES]]);
  tl.win(caps[2],[[12.95,14.4]],{dy:10});
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
    if(t>=DUR-.005){finished=true;playing=false;tl.pause();tl.seek(DUR);t=DUR;ui();}
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
/* start on the first frame: visibility is known synchronously; wait for the display face at most 300 ms so the words never re-flow mid-rise */
var started=false,r0=root.getBoundingClientRect();viewable=r0.top<W.innerHeight*.65&&r0.bottom>W.innerHeight*.35;
function start(){if(started)return;started=true;W.__knStart=performance.now();if(M&&words[0].offsetHeight!==M.wh)build();sync();}
if('IntersectionObserver' in W){new IntersectionObserver(function(es){viewable=es[0].intersectionRatio>=.35;if(started)sync();},{threshold:[0,.35,.6]}).observe(root);}
else{viewable=true;}
if(d.fonts&&d.fonts.load){d.fonts.load('600 64px "Inter Tight"').then(start,start);setTimeout(start,300);}else start();
d.addEventListener('visibilitychange',function(){if(A){d.hidden?A.suspend():(on&&A.resume());}sync();});
var rt=null;W.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){
  if(root.clientWidth!==lastW||Math.abs(root.clientHeight-lastH)>80)build();},180);});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){var w=words[0].offsetHeight;if(M&&(w!==M.wh||root.clientWidth!==lastW))build();});
ui();W.requestAnimationFrame(loop);
W.__kn={tl:tl,seek:function(t){userPaused=true;jump(t);},play:function(){userPaused=false;sync();},
  ask:function(){return asking;},M:function(){return M;},sound:function(){return on&&A?A.state:'off';}};
})(window);
