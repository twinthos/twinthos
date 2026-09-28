/* Twinthos site script: nav, reveal-once, demo controller, form. No dependencies. */
(function(){
  var d=document, RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var R=d.documentElement; R.classList.remove('no-js'); if(!RM)R.classList.add('js-motion');
  requestAnimationFrame(function(){requestAnimationFrame(function(){R.classList.add('hero-in');});});

  /* Nav hairline once the page moves */
  var nv=d.querySelector('.nav');
  if(nv){var sc=function(){nv.classList.toggle('scrolled',window.scrollY>8);};sc();window.addEventListener('scroll',sc,{passive:true});}

  /* Hero ledger: the work record plays out once, then rests complete. Replay on request. */
  var lg=d.querySelector('[data-ledger]');
  if(lg){
    var rows=[].slice.call(lg.querySelectorAll('.ledger-row')), clk=lg.querySelector('[data-clock]'),
        stt=lg.querySelector('[data-state]'), rep=d.querySelector('[data-replay]'), lt=[];
    var endClock=clk?clk.textContent:'';
    function lgClear(){lt.forEach(clearTimeout);lt=[];}
    function lgRun(){
      lgClear(); lg.classList.add('play','running'); lg.classList.remove('complete');
      rows.forEach(function(r){r.classList.remove('in','now');});
      if(stt)stt.textContent='In progress'; if(clk)clk.textContent=rows[0].querySelector('time').textContent;
      if(rep)rep.hidden=true;
      var at=650;
      rows.forEach(function(r,i){
        var gap=(i===3)?1100:(i>3?420:620);  /* a visible pause while the team quotes */
        at+=gap;
        lt.push(setTimeout(function(){
          rows.forEach(function(x){x.classList.remove('now');});
          r.classList.add('in','now'); if(clk)clk.textContent=r.querySelector('time').textContent;
        },at));
      });
      lt.push(setTimeout(function(){
        rows.forEach(function(x){x.classList.remove('now');});
        lg.classList.remove('running'); lg.classList.add('complete');
        if(stt)stt.textContent='Complete'; if(clk)clk.textContent=endClock; if(rep)rep.hidden=false;
      },at+700));
    }
    if(!RM){lgRun(); if(rep)rep.addEventListener('click',lgRun);}
    d.addEventListener('visibilitychange',function(){if(d.hidden&&lg.classList.contains('running')){lgClear();
      rows.forEach(function(r){r.classList.add('in');r.classList.remove('now');});lg.classList.remove('running');lg.classList.add('complete');
      if(stt)stt.textContent='Complete';if(clk)clk.textContent=endClock;if(rep)rep.hidden=false;}});
  }

  /* Problem list: once read, each question is struck through as handled */
  var dl=d.querySelector('.drag-list');
  if(dl){
    if(RM||!('IntersectionObserver' in window))dl.classList.add('struck');
    else{var o3=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){o3.disconnect();setTimeout(function(){dl.classList.add('struck');},900);}});},{threshold:1,rootMargin:'0px 0px -8% 0px'});o3.observe(dl.lastElementChild);}
  }

  /* Nav */
  var nav=d.querySelector('.nav'), tg=d.querySelector('.nav-toggle');
  if(nav&&tg){tg.addEventListener('click',function(){var o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o);});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');tg.setAttribute('aria-expanded','false');tg.focus();}});}

  /* Reveal once */
  var els=d.querySelectorAll('.rv,.drag-list li');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});}
  else{var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{rootMargin:'0px 0px -12% 0px',threshold:.15});
    els.forEach(function(e){io.observe(e);});}

  /* Demo */
  d.querySelectorAll('[data-demo]').forEach(function(root){
    var panels=root.querySelectorAll('.panel'), steps=root.querySelectorAll('[data-go]'),
        play=root.querySelector('[data-act=play]'), lbl=play.querySelector('span'),
        replay=root.querySelector('[data-act=replay]'), appr=root.querySelector('[data-act=approval]'),
        status=root.querySelector('.demo-status'), prog=root.querySelector('.stage-prog');
    var LAST=4, EXC=5, DUR=RM?5200:3400, cur=0, playing=false, t=null, seen=false;
    var names=['Ready','Enquiry received','Information requested','Record updated and assigned','Follow-up sent','Approval step'];
    var typed=root.querySelector('[data-type]'), full=typed?typed.textContent:'', tt=null;
    function type(){ if(!typed)return; clearInterval(tt); if(RM||!playing){typed.textContent=full;return;}
      var i=0; typed.textContent=''; var c=d.createElement('span'); c.className='caret';
      tt=setInterval(function(){i+=2; typed.textContent=full.slice(0,i); if(i<full.length){typed.appendChild(c);}else{clearInterval(tt);}},28);}
    var lastCur=-1;
    function paint(){
      if(cur!==lastCur){ if(cur===2)type(); else if(typed){clearInterval(tt);typed.textContent=full;} lastCur=cur; }
      else if(cur===2&&!playing&&typed&&typed.textContent!==full){clearInterval(tt);typed.textContent=full;}
      panels.forEach(function(p){p.classList.toggle('on',+p.dataset.p===cur);p.setAttribute('aria-hidden',+p.dataset.p===cur?'false':'true');});
      steps.forEach(function(s){var n=+s.dataset.go;
        s.classList.toggle('on',n===cur);
        s.classList.toggle('done',cur!==EXC&&n<cur&&n<=LAST||cur===LAST&&n===LAST);
        s.setAttribute('aria-current',n===cur?'step':'false');});
      lbl.textContent=playing?'Pause':(cur===0?'Play example':(cur===LAST||cur===EXC)?'Play again':'Resume');
      play.setAttribute('aria-pressed',playing);
      status.textContent=cur===0?'Press play to begin':cur===EXC?'Exception · waiting for your team':('Step '+cur+' of 4 · '+names[cur]+(playing?'':' · paused'));
      if(cur===LAST&&!playing)status.textContent='Complete · the enquiry has a next step';
    }
    function bar(run){if(!prog||RM)return;prog.classList.remove('run');prog.style.transitionDuration='0ms';prog.style.width='0';
      if(run){void prog.offsetWidth;prog.classList.add('run');prog.style.transitionDuration=DUR+'ms';prog.style.width='100%';}}
    function stop(){playing=false;clearTimeout(t);bar(false);paint();}
    function tick(){if(cur>=LAST){stop();return;}t=setTimeout(function(){cur++;paint();if(cur<LAST){bar(true);tick();}else stop();},DUR);}
    function start(){if(cur===LAST||cur===EXC)cur=0;playing=true;if(cur===0){cur=1;}paint();bar(true);tick();}
    play.addEventListener('click',function(){seen=true;playing?stop():start();});
    replay.addEventListener('click',function(){seen=true;stop();cur=0;start();});
    appr.addEventListener('click',function(){seen=true;stop();cur=EXC;paint();});
    steps.forEach(function(s){s.addEventListener('click',function(){seen=true;stop();cur=+s.dataset.go;paint();});});
    root.addEventListener('keydown',function(e){if(!e.target.closest('.steps'))return;var fs=e.target.closest('[data-go]');if(fs)cur=+fs.dataset.go;
      if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();stop();cur=Math.min(EXC,cur+1);paint();root.querySelector('[data-go="'+cur+'"]').focus();}
      if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();stop();cur=Math.max(1,cur-1);paint();root.querySelector('[data-go="'+cur+'"]').focus();}});
    d.addEventListener('visibilitychange',function(){if(d.hidden&&playing)stop();});
    if(!RM&&'IntersectionObserver' in window&&root.hasAttribute('data-autoplay')){
      var o2=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting&&!seen){seen=true;start();o2.disconnect();}});},{threshold:.3});o2.observe(root);}
    paint();
  });

  /* Form: FormSubmit AJAX, honest confirmation or honest failure */
  d.querySelectorAll('form[data-form]').forEach(function(f){
    var done=d.getElementById(f.dataset.done), fail=f.querySelector('.form-fail'), btn=f.querySelector('[type=submit]');
    f.addEventListener('submit',function(e){
      e.preventDefault(); var ok=true, first=null;
      f.querySelectorAll('[required]').forEach(function(i){var w=i.closest('.fld'),bad=!i.value.trim()||(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value));
        w.classList.toggle('err',bad);i.setAttribute('aria-invalid',bad);if(bad){ok=false;first=first||i;}});
      if(!ok){first.focus();return;}
      if(f.querySelector('[name=_honey]').value)return;
      var fd=new FormData(f), o={}; fd.forEach(function(v,k){o[k]=v;});
      btn.disabled=true; var old=btn.innerHTML; btn.textContent='Sending…'; fail.classList.remove('on');
      fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(o)})
        .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)==='false')throw 0;});})
        .then(function(){f.hidden=true;done.classList.add('on');done.setAttribute('tabindex','-1');done.focus();})
        .catch(function(){fail.classList.add('on');btn.disabled=false;btn.innerHTML=old;});
    });
  });
})();

/* Showreel: muted autoplay only while on screen; honours reduced motion; explicit pause control */
(function(){
  var d=document, v=d.querySelector('.reel-video'); if(!v) return;
  var b=d.querySelector('.reel-toggle'), RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var want=!RM, onScreen=false;
  if(window.innerWidth<900&&v.dataset.srcSm){v.src=v.dataset.srcSm;}
  function label(){ var on=!v.paused; b.textContent=on?'Pause':'Play'; b.setAttribute('aria-pressed',String(!on)); }
  function sync(){ if(want&&onScreen){var p=v.play(); if(p&&p.catch)p.catch(function(){want=false;label();});} else v.pause(); label(); }
  v.addEventListener('play',label); v.addEventListener('pause',label);
  b.addEventListener('click',function(){want=v.paused; if(want&&v.ended)v.currentTime=0; if(want){var p=v.play(); if(p&&p.catch)p.catch(function(){});} else v.pause(); label();});
  v.addEventListener('click',function(){b.click();}); v.style.cursor='pointer';
  if('IntersectionObserver' in window){ new IntersectionObserver(function(en){en.forEach(function(x){onScreen=x.isIntersecting; sync();});},{threshold:.35}).observe(v); }
  else { onScreen=true; }
  d.addEventListener('visibilitychange',function(){ if(d.hidden) v.pause(); else sync(); });
  sync();
})();

/* Authority Line instrument: routine work flows below the line and completes on its own.
   One exception rises above the line, waits for the team, is approved, and rejoins the flow.
   Time-based, transform-only, pauses off screen. Reduced motion keeps the authored static frame. */
(function(){
  var d=document, root=d.querySelector('[data-al]'); if(!root) return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var stage=root.querySelector('[data-al-stage]'); if(!stage) return;
  var LAB=['Enquiry logged','Missing details requested','Follow-up sent','Customer record updated','Next action assigned','Document received','Reminder sent','Booking confirmed'];
  var STEP=[1,6,19,4,11,2,9,14], mins=9*60+10, n=0, acc=1e9, items=[], W=0, V=56, DY=-84, GAP=260, onScreen=true, raf=0, last=0;
  function eo(t){return t>=1?1:1-Math.pow(2,-10*t);}           /* expo out  */
  function io(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}   /* cubic in-out */
  function hhmm(){mins+=STEP[n%8];var h=Math.floor(mins/60)%24,m=mins%60;return (h<10?'0':'')+h+':'+(m<10?'0':'')+m;}
  function measure(){W=stage.clientWidth;var sm=W<700;V=sm?40:58;DY=sm?-74:-84;GAP=Math.max(sm?220:320,W/4.2);}
  function spawn(){
    var exc=(n%7===4), el=d.createElement('span'); el.className='al-it'+(exc?' exc':'');
    var t=d.createElement('time'); t.textContent=hhmm(); el.appendChild(t);
    el.appendChild(d.createTextNode(exc?'Asks for 15% off':LAB[n%LAB.length]));
    if(exc){var em=d.createElement('em');em.textContent='Waiting for you';el.appendChild(em);}
    stage.appendChild(el); var w=el.offsetWidth;
    items.push({el:el,x:-w-24,y:0,exc:exc,st:0,t:0,done:false,em:el.querySelector('em'),lab:el.childNodes[1]}); n++;
  }
  function update(dt){
    acc+=V*dt; if(acc>=GAP){acc=0;spawn();}
    for(var i=items.length-1;i>=0;i--){
      var it=items[i];
      if(it.exc&&it.st<4){
        if(it.st===0){it.x+=V*dt; if(it.x>=W*.40){it.st=1;it.t=0;}}
        else{ it.t+=dt;
          if(it.st===1){it.y=DY*eo(it.t/1.0); if(it.t>=1.0){it.st=2;it.t=0;}}            /* rises to the team */
          else if(it.st===2){ if(it.t>=2.6){it.st=3;it.t=0;it.em.textContent='Approved by your team';it.el.classList.add('ok');}}
          else if(it.st===3){ if(it.t>=1.1){ var k=Math.min(1,(it.t-1.1)/.8); it.y=DY*(1-io(k));
              if(k>=1){it.st=4;it.y=0;it.em.remove();it.el.classList.remove('exc','ok');it.lab.nodeValue='Agreed discount applied';}}}
        }
      } else { it.x+=V*dt; }
      if(!it.done&&!it.exc&&it.x>W*.6){it.done=true;it.el.classList.add('done');}
      if(it.x>W+40){it.el.remove();items.splice(i,1);continue;}
      it.el.style.transform='translate3d('+it.x.toFixed(1)+'px,'+it.y.toFixed(1)+'px,0)';
    }
  }
  function frame(ts){ if(!last)last=ts; var dt=Math.min(.05,(ts-last)/1000); last=ts; update(dt); raf=requestAnimationFrame(frame); }
  function play(){ if(!raf&&onScreen&&!d.hidden){last=0;raf=requestAnimationFrame(frame);} }
  function stop(){ if(raf){cancelAnimationFrame(raf);raf=0;} }
  stage.innerHTML=''; root.classList.add('js-al'); measure();
  for(var s=0;s<260;s++) update(.1);   /* start mid-flow, never on an empty line */
  window.addEventListener('resize',measure,{passive:true});
  if('IntersectionObserver' in window){ new IntersectionObserver(function(en){onScreen=en[0].isIntersecting; onScreen?play():stop();}).observe(root); }
  d.addEventListener('visibilitychange',function(){ d.hidden?stop():play(); });
  play();
})();
