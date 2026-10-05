/* Home hero film "Answers vs work". 17.2 s on one clock (TWTL), one task told end to end:
   1 a chatbot: you ask it to chase an overdue invoice; it hands you a draft - still on your to-do list
   2 Twinthos: the same request, done - found in Xero, emailed, texted - each tool lights as it is used
   3 your call: the client asks for a payment plan; the card stops at the Authority Line for the visitor's own Approve,
     then the work log closes the loop and the memory keeps it
   4 time returned: the promise, then the resting hero (base CSS = this final frame)
   Sound is synthesised with Web Audio and strictly opt-in (the Sound button). */
(function(W){
'use strict';
var d=document,root=d.querySelector('.kn'),T=W.TWTL;
if(!root||!T||!root.animate)return;
if(W.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var DUR=17.2,EO=T.EO,EI=T.EI,ES=T.ES,SP=T.SP,CH=[0,5.0,9.3,12.6],ASK_T=10.3,ASK_MAX=5000;
var fx=root.querySelector('.kn-fx'),idb=root.querySelector('.kn-id'),
  h1=root.querySelector('.kn-h'),sub=root.querySelector('.kn-sub'),
  cta=root.querySelector('.kn-cta'),desc=root.querySelector('.kn-desc'),words=[].slice.call(h1.querySelectorAll('.w>i')),
  h1au=[].slice.call(h1.querySelectorAll('.au')),
  pp=root.querySelector('.kn-pp'),ppT=pp&&pp.querySelector('.t'),snd=root.querySelector('.kn-snd'),
  chs=[].slice.call(root.querySelectorAll('.kn-ch button'));
if(!fx||!idb||!pp)return;

/* ---------- film elements (built once, decorative) ---------- */
var CHECK='<svg viewBox="0 0 10 10"><path d="M1.5 5.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function sv(b){return '<svg viewBox="0 0 64 64">'+b.replace(/\/>/g,' pathLength="1"/>')+'</svg>';}
var TOOLS=[['Computer',sv('<rect x="6" y="10" width="52" height="34" rx="4"/><path d="M32 44v10M22 54h20"/>')],
  ['Inbox',sv('<rect x="6" y="13" width="52" height="38" rx="6"/><path d="M8 17l24 18 24-18"/>')],
  ['Phone',sv('<rect x="19" y="5" width="26" height="54" rx="7"/><path d="M28.5 51h7"/>')],
  ['Memory',sv('<path d="M8 12h18a6 6 0 016 6v36a4 4 0 00-4-4H8z"/><path d="M56 12H38a6 6 0 00-6 6v36a4 4 0 014-4h20z"/>')],
  ['Team chat',sv('<path d="M12 12h40a5 5 0 015 5v22a5 5 0 01-5 5H30l-11 9v-9h-7a5 5 0 01-5-5V17a5 5 0 015-5z"/><path d="M21 28h.01M32 28h.01M43 28h.01"/>')]];
/* work log: [time, text, tool, amber] - rows 0-3 before the decision, 4-5 after it */
var ROWS=[['09:02','Found invoice #2041 in Xero',0],['09:02','Emailed Sam at Hartley &amp; Co',1],['09:03','Texted Sam a reminder',2],
  ['09:41','Sam asks to pay in two parts',1,1],['09:44','Plan agreed \u00b7 Xero updated',0],['09:44','Remembered for next time',3]];
var TA=[6.45,7.1,7.75,8.55,10.95,11.45];
function el(tag,cls,html){var e=d.createElement(tag);e.className=cls;if(html)e.innerHTML=html;e.setAttribute('aria-hidden','true');fx.appendChild(e);return e;}
function wds(txt,g){var p=txt.split(' '),h='';p.forEach(function(w,i){var s='<span class="w"><i>'+w+'</i></span>';
  if(g!=null&&i===g)h+='<span class="gl"><span class="au"></span>';h+=s+(i<p.length-1?' ':'');});if(g!=null)h+='</span>';return h;}
var glow=el('i','kn-glow');
var hl=[el('p','kn-hl',wds('Chatbots give you answers.')),el('p','kn-hl',wds('Twinthos does the work.',2)),el('p','kn-hl s',wds('Anything that matters waits for you.'))];
var hlw=hl.map(function(e){return [].slice.call(e.querySelectorAll('.w>i'));});
var req=el('div','kn-req','<span class="tx">Chase Hartley &amp; Co for invoice #2041</span><i class="hl"></i>'),reqTx=req.querySelector('.tx');
var bot=el('div','kn-bot','<small><i></i>AI chatbot</small><span class="dots"><i></i><i></i><i></i></span><p>Here\u2019s an email you could send:</p><span class="dr"><i></i><i></i><i></i></span>');
var todo=el('span','kn-todo','<i></i>Still on your to-do list');
var tools=TOOLS.map(function(t){return el('div','kn-tl','<span class="k">'+t[1]+'<span class="hot">'+t[1]+'</span></span><b>'+t[0]+'</b>');});
var rows=ROWS.map(function(r){return el('span','kn-row'+(r[3]?' wr':''),'<time>'+r[0]+'</time><i class="ck'+(r[3]?' w':'')+'">'+(r[3]?'!':CHECK)+'</i><span>'+r[1]+'</span>');});
var al=el('div','kn-al');
var card=el('div','kn-card','<div><small>Payment plan \u00b7 Hartley &amp; Co</small><p>\u00a34,800 in two payments</p></div><button type="button" class="kn-ap" tabindex="-1"><span class="b1">Approve</span><span class="b2">Approved</span></button><span class="kn-ok"></span><span class="kn-hint">Your turn</span>');
var ap=card.querySelector('.kn-ap');
var pr=el('p','kn-pr','<span><span class="w"><i>Work</i></span> <span class="w"><i>handled.</i></span></span><span class="g"><span class="w"><i>Time</i></span> <span class="w"><i>returned.</i></span></span>');
var prw=[].slice.call(pr.querySelectorAll('.w>i'));
root.classList.add('is-film');

/* ---------- layout ---------- */
var tl=new T.TL(DUR),M=null,cues=[];
function measure(){
  var w=root.clientWidth,h=root.clientHeight,nar=w<641;
  var m={W:w,H:h,nar:nar,cx:w/2,gut:nar?20:Math.max(28,w*.04)};
  m.nav=(d.querySelector('.nav')||{offsetHeight:68}).offsetHeight||68;
  m.colW=Math.min(nar?w-40:560,w-2*m.gut);
  m.wh=words[0].offsetHeight;m.hlwh=hlw.map(function(a){return a[0].offsetHeight;});
  m.hl=hl.map(function(e){return e.offsetHeight;});
  m.req=[req.offsetWidth,req.offsetHeight];m.bot=[bot.offsetWidth,bot.offsetHeight];m.todo=[todo.offsetWidth,todo.offsetHeight];
  m.tl=[tools[0].offsetWidth,tools[0].offsetHeight];m.row=rows.map(function(r){return r.offsetWidth;});m.rh=nar?34:40;
  m.card=[card.offsetWidth,card.offsetHeight];m.pr=pr.offsetHeight;m.prwh=prw[0].offsetHeight;
  return m;
}
function place(m){
  var hlM=Math.max(m.hl[0],m.hl[1],m.hl[2]),g1=m.nar?22:30,g2=m.nar?22:30,gT=m.nar?20:28,gB=m.nar?42:50,gC=m.nar?40:46,
    avail=m.H-96-m.nav,z1=m.bot[1]+14+m.todo[1],N=4,z2,tot;
  for(;N>=2;N--){z2=m.tl[1]+gT+N*m.rh+gB+gC+m.card[1];tot=hlM+g1+m.req[1]+g2+Math.max(z1,z2);if(tot<=avail-12)break;}
  m.N=Math.max(2,N);z2=m.tl[1]+gT+m.N*m.rh+gB+gC+m.card[1];tot=hlM+g1+m.req[1]+g2+Math.max(z1,z2);
  var top=Math.round(m.nav+Math.max(6,(avail-tot)/2)),c0=m.cx-m.colW/2;
  hl.forEach(function(e,i){e.style.top=Math.round(top+(hlM-m.hl[i])/2)+'px';});
  m.reqY=top+hlM+g1;req.style.left=Math.round(c0+m.colW-m.req[0])+'px';req.style.top=Math.round(m.reqY)+'px';
  var zy=m.reqY+m.req[1]+g2;
  bot.style.left=Math.round(c0)+'px';bot.style.top=Math.round(zy)+'px';
  todo.style.left=Math.round(c0)+'px';todo.style.top=Math.round(zy+m.bot[1]+14)+'px';
  var pitch=m.nar?Math.min(70,(m.W-20)/5):Math.min(124,(m.W-2*m.gut)/5);
  tools.forEach(function(e,i){e.style.left=Math.round(m.cx-m.tl[0]/2+(i-2)*pitch)+'px';e.style.top=Math.round(zy)+'px';});
  m.logY=Math.round(zy+m.tl[1]+gT);
  var lw=0;m.row.forEach(function(x){lw=Math.max(lw,x);});m.logX=Math.round(m.cx-lw/2);
  rows.forEach(function(r){r.style.left=m.logX+'px';r.style.top=m.logY+'px';r.style.height=m.rh+'px';});
  m.alY=Math.round(m.logY+m.N*m.rh+gB);
  var alW=m.nar?m.W*.92:Math.min(m.W*.6,760);
  al.style.left=Math.round(m.cx-alW/2)+'px';al.style.width=Math.round(alW)+'px';al.style.top=m.alY+'px';al.style.setProperty('--in',Math.max(0,Math.round((alW-m.card[0])/2))+'px');
  m.cardX=Math.round(m.cx-m.card[0]/2);m.cardY=m.alY+gC;m.cardC={x:m.cardX+m.card[0]/2,y:m.cardY+m.card[1]/2};
  card.style.left=m.cardX+'px';card.style.top=m.cardY+'px';
  m.zc=Math.round(zy+z2/2);glow.style.left=Math.round(m.cx)+'px';glow.style.top=m.zc+'px';
  pr.style.top=Math.round((m.nav+m.H-96)/2-m.pr/2)+'px';
}

/* ---------- the score ---------- */
function prop(e,name,keys){
  keys=keys.slice();if(keys[0][0]>0)keys.unshift([0,keys[0][1]]);if(keys[keys.length-1][0]<DUR)keys.push([DUR,keys[keys.length-1][1]]);
  var fr=keys.map(function(k){var f={offset:Math.min(1,Math.max(0,k[0]/DUR))};f[name]=k[1];return f;});
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=e.animate(fr,{duration:DUR*1000,fill:'both'});a.pause();tl.a.push(a);return a;
}
/* a headline line: words rise through a mask, then leave upwards */
function line(e,ws,wh,a,b){
  tl.mk(e,[[0,{o:0}],[a-.02,{o:0}],[a,{o:1}],[b+.5,{o:1}],[b+.55,{o:0}]]);
  ws.forEach(function(w,i){var s=a+.05+i*.07,o=b+i*.03;
    tl.mk(w,[[0,{y:wh}],[s,{y:wh}],[s+.9,{y:0},SP],[o,{y:0}],[o+.38,{y:-wh},EI]]);});
}
var PENTA=[587.33,659.25,739.99,880,987.77,1174.66,1318.51,1479.98,1760,1975.53,2349.32,2637.02,2959.96];
function score(m){
  tl.clear();cues=[];
  /* master track first: the resting headline, which spans the whole clock */
  tl.mk(h1,[[0,{o:0}],[15.25,{o:0}],[15.3,{o:1}]]);
  var wh=Math.round(m.wh*1.12);
  words.forEach(function(w,i){var b=15.35+i*.06;tl.mk(w,[[0,{y:wh}],[b,{y:wh}],[b+.95,{y:0},SP]]);});
  h1au.forEach(function(a){tl.mk(a,[[0,{o:0}],[16.0,{o:0}],[16.8,{o:1},EO]]);});
  tl.win(idb,[[15.1,DUR]],{dy:10});tl.win(sub,[[15.85,DUR]],{dy:14});tl.win(cta,[[16.0,DUR]],{dy:14});tl.win(desc,[[16.15,DUR]],{dy:8});

  /* 1 a chatbot */
  line(hl[0],hlw[0],Math.round(m.hlwh[0]*1.12),.0,4.7);
  tl.mk(req,[[0,{o:0,s:.94,y:10}],[.4,{o:0,s:.94,y:10}],[.8,{o:1,s:1,y:0},SP],[1.95,{o:1,y:0}],[2.05,{o:1,y:-4},EO],[2.4,{o:1,y:0},SP],[12.45,{o:1,s:1,y:0}],[12.85,{o:0,y:-10},ES]]);
  tl.mk(reqTx,[[0,{cp:'inset(0 100% 0 0)'}],[.7,{cp:'inset(0 100% 0 0)'}],[1.85,{cp:'inset(0 0% 0 0)'},'steps(36,end)']]);
  for(var k=0;k<11;k++)cues.push([.72+k*.1,'tick']);
  cues.push([1.97,'whoosh']);
  tl.mk(bot,[[0,{o:0,y:14}],[2.1,{o:0,y:14}],[2.45,{o:1,y:0},EO],[4.7,{o:1,y:0}],[5.05,{o:0,y:16},EI]]);
  tl.win(bot.querySelector('.dots'),[[2.15,2.75]],{dy:0,in:.15,out:.12});
  tl.win(bot.querySelector('p'),[[2.8,DUR]],{dy:6,in:.3});
  [].slice.call(bot.querySelectorAll('.dr i')).forEach(function(b,j){tl.mk(b,[[0,{sx:0}],[2.9+j*.12,{sx:0}],[3.4+j*.12,{sx:1},EO]]);});
  cues.push([2.8,'pluck',0]);
  tl.mk(todo,[[0,{o:0,s:.9}],[3.65,{o:0,s:.9}],[4.0,{o:1,s:1},SP],[4.7,{o:1,s:1,y:0}],[5.05,{o:0,y:16},EI]]);
  cues.push([3.68,'low']);

  /* 2 Twinthos: the same request, done */
  line(hl[1],hlw[1],Math.round(m.hlwh[1]*1.12),5.1,9.2);
  tl.mk(hl[1].querySelector('.au'),[[0,{o:0}],[5.8,{o:0}],[6.5,{o:1},EO],[9.2,{o:1}],[9.6,{o:0},ES]]);
  cues.push([5.12,'merge']);
  tl.mk(req.querySelector('.hl'),[[0,{o:0}],[5.25,{o:0}],[5.7,{o:1},EO],[12.45,{o:1}]]);
  tl.mk(glow,[[0,{o:0,s:.6}],[5.2,{o:0,s:.6}],[6.3,{o:.85,s:1},EO],[10.3,{o:.85,s:1}],[10.55,{o:1,s:1.08},EO],[11.2,{o:.85,s:1},ES],[12.4,{o:.85,s:1}],[12.95,{o:0,s:1.1},ES]]);
  var hot=[[],[],[],[],[]];
  tools.forEach(function(e,i){var t0=5.45+i*.09;
    tl.mk(e,[[0,{o:0,y:12}],[t0,{o:0,y:12}],[t0+.5,{o:1,y:0},SP],[12.45,{o:1,y:0}],[12.85,{o:0,y:-8},ES]]);
    [].slice.call(e.querySelectorAll('.k>svg *')).forEach(function(s){prop(s,'strokeDashoffset',[[0,1],[t0,1],[t0+.9,0,EO]]);});
  });
  ROWS.forEach(function(r,j){hot[r[2]].push(TA[j]);});hot[4].push(9.75);
  tools.forEach(function(e,i){tl.bump(e.querySelector('.hot'),hot[i],0);});
  /* the work log: newest at the bottom; once the window is full, older lines scroll up and out */
  var N=m.N,rh=m.rh,n=ROWS.length;
  rows.forEach(function(r,j){
    var s0=j<N?j:N-1,ky=[[0,{o:0,x:-12,y:s0*rh}],[TA[j],{o:0,x:-12,y:s0*rh}],[TA[j]+.42,{o:1,x:0,y:s0*rh},EO]],sl=s0;
    for(var q=j+1;q<n;q++){if(q>=N){sl--;ky.push([TA[q],{o:sl+1>=0?1:0,x:0,y:(sl+1)*rh}]);ky.push([TA[q]+.42,{o:sl>=0?1:0,x:0,y:sl*rh},EO]);}}
    if(sl>=0){ky.push([12.45,{o:1,x:0,y:sl*rh}]);ky.push([12.85,{o:0,x:0,y:sl*rh-8},ES]);}
    tl.mk(r,ky);
    tl.mk(r.querySelector('.ck'),[[0,{o:0,s:.3}],[TA[j]+.12,{o:0,s:.3}],[TA[j]+.36,{o:1,s:1},SP]]);
    cues.push([TA[j]+.12,ROWS[j][3]?'low':'pluck',j*2+1]);
  });

  /* 3 your call: the request that needs a person stops at the Authority Line */
  line(hl[2],hlw[2],Math.round(m.hlwh[2]*1.12),9.45,11.75);
  tl.mk(al,[[0,{o:0,cp:'inset(-40px 50% -40px 50%)'}],[9.45,{o:1,cp:'inset(-40px 50% -40px 50%)'}],[10.05,{o:1,cp:'inset(-40px 0% -40px 0%)'},EO],[11.1,{o:1}],[11.45,{o:0},ES]]);
  var slot=Math.min(N-1,4),tx=m.logX+Math.min(m.card[0],m.row[4])/2-m.cardC.x,ty=m.logY+slot*rh+rh/2-m.cardC.y;
  tl.mk(card,[[0,{o:0,s:.92,y:12}],[9.7,{o:0,s:.92,y:12}],[10.15,{o:1,s:1,y:0},SP],[10.85,{o:1,s:1,x:0,y:0}],[11.25,{o:0,s:.4,x:tx,y:ty},EI]]);
  cues.push([9.72,'low']);
  tl.mk(ap,[[0,{s:1}],[10.45,{s:1}],[10.52,{s:.94}],[10.8,{s:1},SP]]);
  tl.win(ap.querySelector('.b2'),[[10.52,DUR]],{in:.18,dy:0});
  tl.win(card.querySelector('.kn-ok'),[[10.52,11.0]],{in:.2,dy:0});
  cues.push([10.5,'approve']);

  /* 4 time returned */
  tl.mk(pr,[[0,{o:0}],[12.95,{o:0}],[12.97,{o:1,y:0}],[14.75,{o:1,y:0}],[15.15,{o:0,y:-24},ES]]);
  var pwh=Math.round(m.prwh*1.12);
  prw.forEach(function(w,i){var b=13.0+i*.13+(i>1?.25:0);tl.mk(w,[[0,{y:pwh}],[b,{y:pwh}],[b+1,{y:0},SP]]);});
  cues.push([13.0,'pad']);cues.push([15.4,'end']);
  /* chapter bars */
  chs.forEach(function(b,i){tl.mk(b.querySelector('i'),[[0,{sx:0}],[CH[i],{sx:0}],[CH[i+1]||DUR,{sx:1}]]);});
  cues.sort(function(a,b){return a[0]-b[0];});
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
  tick:function(){tone(1700+Math.random()*900,'sine',.018,.002,.04);tone(240,'sine',.016,.002,.05);},
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
var bedV=-1;function bed(t){if(!A)return;var v=(on&&playing&&t>5.0&&t<15.2)?.05:0;if(v===bedV)return;bedV=v;bedG.gain.setTargetAtTime(v,A.currentTime,v?.5:.3);}

/* ---------- playback ---------- */
var playing=false,userPaused=false,viewable=false,finished=false,asking=false,asked=false,askLeft=0,askTick=null,prevT=0;
function ui(){
  root.classList.toggle('is-paused',!playing&&!finished&&!asking);root.classList.toggle('is-done',finished);
  var l=finished?'Replay':(playing||asking)?'Pause':'Play';
  if(ppT&&ppT.textContent!==l){ppT.textContent=l;pp.setAttribute('aria-label',l+' the film');}
}
function sync(){
  if(asking){ui();return;}
  var go=viewable&&!d.hidden&&!userPaused&&!finished;
  if(go&&!playing){tl.play();playing=true;}else if(!go&&playing){tl.pause();playing=false;}
  ui();
}
function jump(t){if(asking)stopAsk();finished=t>=DUR;asked=t>ASK_T;tl.pause();playing=false;tl.seek(t);prevT=t;sync();}
function startAsk(){
  asking=true;asked=true;tl.pause();playing=false;tl.seek(ASK_T);prevT=ASK_T;root.classList.add('is-ask');
  card.removeAttribute('aria-hidden');ap.tabIndex=0;ap.setAttribute('aria-label','Approve the payment plan');
  askLeft=ASK_MAX;clearInterval(askTick);askTick=setInterval(function(){if(viewable&&!d.hidden&&!userPaused){askLeft-=100;if(askLeft<=0)endAsk(false);}},100);ui();
}
function stopAsk(){asking=false;clearInterval(askTick);root.classList.remove('is-ask');card.setAttribute('aria-hidden','true');ap.tabIndex=-1;ap.removeAttribute('aria-label');}
function endAsk(byUser){
  if(!asking)return;stopAsk();
  if(byUser){ap.classList.remove('tap');void ap.offsetWidth;ap.classList.add('tap');tl.seek(ASK_T+.15);prevT=ASK_T+.15;userPaused=false;}
  sync();
}
ap.addEventListener('click',function(){if(asking)endAsk(true);});
pp.addEventListener('click',function(){
  if(finished){jump(0);userPaused=false;sync();return;}
  if(asking){userPaused=!userPaused;ui();return;}
  userPaused=!userPaused;sync();
});
chs.forEach(function(b,i){b.addEventListener('click',function(){userPaused=false;jump(CH[i]);});});
if(snd)snd.addEventListener('click',function(){
  on=!on;snd.setAttribute('aria-pressed',on?'true':'false');snd.querySelector('.t').textContent=on?'Sound on':'Sound off';
  if(on){if(!ac()){on=false;snd.setAttribute('aria-pressed','false');snd.querySelector('.t').textContent='Sound off';return;}
    out.gain.cancelScheduledValues(A.currentTime);out.gain.setTargetAtTime(.9,A.currentTime,.05);SFX.pluck(4);
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
  prevT=t;bed(t);
  W.requestAnimationFrame(loop);
}

/* ---------- build / rebuild ---------- */
var lastW=0,lastH=0;
function build(){
  var t=tl.time(),was=playing;M=measure();lastW=M.W;lastH=M.H;
  place(M);score(M);tl.seek(t);prevT=t;
  if(was){tl.play();}
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
