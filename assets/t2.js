/* Twinthos site v2 behaviour. Everything works without it; this adds life. */
(function(){
'use strict';
var d=document,w=window,R=d.documentElement;
R.classList.remove('no-js');R.classList.add('js');
var reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav border on scroll, menu closes on tap */
var nv=d.querySelector('.nv');
function onS(){if(nv)nv.classList.toggle('sc',w.scrollY>8);}
w.addEventListener('scroll',onS,{passive:true});onS();
d.querySelectorAll('.mp a').forEach(function(a){a.addEventListener('click',function(){var m=d.querySelector('.mn');if(m)m.removeAttribute('open');});});

/* reveal on scroll: a plain position check, robust on iOS Safari */
var rv=[].slice.call(d.querySelectorAll('.rv'));
function reveal(){if(!rv.length)return;var lim=w.innerHeight*0.94;rv=rv.filter(function(e){if(e.getBoundingClientRect().top<lim){e.classList.add('in');return false;}return true;});}
if(reduce)rv.forEach(function(e){e.classList.add('in');});
else{var rq=false;w.addEventListener('scroll',function(){if(!rq){rq=true;requestAnimationFrame(function(){rq=false;reveal();});}},{passive:true});w.addEventListener('resize',reveal);reveal();setTimeout(reveal,300);}

/* the employee card: live London time, tilt, task ticker */
var clk=d.querySelectorAll('[data-clock]');
function tick(){var s;try{s=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/London'}).format(new Date());}catch(e){var n=new Date();s=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);}clk.forEach(function(c){c.textContent=s;});}
tick();setInterval(tick,10000);
var bd=d.querySelector('.badge'),idleT=null;
if(bd&&!reduce){
  bd.classList.add('idle');
  var setT=function(x,y){bd.classList.remove('idle');bd.style.setProperty('--ry',(x*16).toFixed(2)+'deg');bd.style.setProperty('--rx',(-y*12).toFixed(2)+'deg');bd.style.setProperty('--mx',(50+x*60).toFixed(1)+'%');bd.style.setProperty('--my',(40+y*60).toFixed(1)+'%');clearTimeout(idleT);idleT=setTimeout(function(){bd.style.setProperty('--rx','0deg');bd.style.setProperty('--ry','0deg');bd.classList.add('idle');},2600);};
  var hero=d.querySelector('.hero');
  (hero||bd).addEventListener('pointermove',function(e){var r=bd.getBoundingClientRect();var x=clamp((e.clientX-r.left)/r.width-0.5,-0.7,0.7),y=clamp((e.clientY-r.top)/r.height-0.5,-0.7,0.7);setT(x,y);},{passive:true});
}
var tk=d.querySelector('.ticker b');
var TASKS=['Replying to a new enquiry in Gmail','Chasing an overdue invoice in Xero','Booking a visit into the calendar','Updating a contact in HubSpot','Filing a signed document in Google Drive','Texting a reminder for tomorrow','Preparing the weekly status report'];
if(tk&&!reduce){var ti=0;setInterval(function(){tk.classList.add('out');setTimeout(function(){ti=(ti+1)%TASKS.length;tk.textContent=TASKS[ti];tk.classList.remove('out');},360);},2800);}

function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function prog(el){var r=el.getBoundingClientRect(),pin=el.querySelector('.pin'),h=r.height-(pin?pin.offsetHeight:w.innerHeight);return h>0?clamp(-r.top/h,0,1):1;}
function lerpSteps(k,ts){/* k 0..1 over the whole span; ts are step times; returns value and step index */var v=k*ts[ts.length-1],i=0;while(i<ts.length-1&&v>=ts[i+1])i++;return {v:v,i:k<=0?-1:i};}

/* story 1: one enquiry, two ways */
var s1=d.querySelector('.s-two');
var OLD=[0,108,386,1421,1456,1491],OLDT=['Tue 09:14','Tue 11:02','Tue 15:40','Wed 08:55','Wed 09:30','Wed 10:05'];
var NEW=[0,1,3,6,9,12],NEWT=['09:14:00','09:14:01','09:14:03','09:14:06','09:14:09','09:14:12'];
var STEPS_OLD=['Enquiry lands in a shared inbox','Someone is free to open it','Diary checked, a slot pencilled in','Customer added to the CRM','Quote written and sent','Visit booked'];
var STEPS_NEW=['Enquiry received','Read and understood','Diary checked: Thursday 10:00 free','Customer added to the CRM','Quote sent from your price list','Visit booked, invite sent'];
var CAP1=['Same enquiry. Same tools. Scroll, and watch the clock.','The usual way: it waits until someone has a minute.','With Twinthos: it is handled the moment it lands.','24 hours 51 minutes, or 12 seconds. Same work, done properly.'];
function lane(sel){var l=s1&&s1.querySelector(sel);if(!l)return null;return {el:l,cnt:l.querySelector('.cnt'),fill:l.querySelector('.fill'),dots:l.querySelectorAll('.track i'),step:l.querySelector('.step')};}
var LA=lane('.old'),LB=lane('.tw'),cap1=s1&&s1.querySelector('.st-cap'),last1='';
function fmtM(m){m=Math.round(m);return Math.floor(m/60)+'h '+('0'+(m%60)).slice(-2)+'m';}
function setLane(L,k,ts,tt,steps,fmt){
  var r=lerpSteps(k,ts);L.cnt.textContent=fmt(r.v);L.fill.style.width=(k*100).toFixed(2)+'%';
  L.dots.forEach(function(e,i){e.classList.toggle('on',i<=r.i);});
  var h=r.i<0?'<span class="mono">'+tt[0]+'</span>Waiting to start':'<span class="mono">'+tt[r.i]+'</span>'+steps[r.i];
  if(L.step.__h!==h){L.step.innerHTML=h;L.step.__h=h;}
  L.el.classList.toggle('on',k>0&&k<1.0001);
}
function upd1(){
  if(!s1)return;var p=prog(s1);
  var ka=clamp((p-0.06)/0.36,0,1),kb=clamp((p-0.5)/0.26,0,1);
  setLane(LA,ka,OLD,OLDT,STEPS_OLD,fmtM);
  setLane(LB,kb,NEW,NEWT,STEPS_NEW,function(v){return Math.round(v)+'s';});
  LA.el.classList.toggle('on',p>0.04&&p<0.48);LB.el.classList.toggle('on',p>0.48);
  var c=p<0.06?0:p<0.48?1:p<0.8?2:3;if(CAP1[c]!==last1){last1=CAP1[c];cap1.textContent=last1;}
}

/* story 2: the authority line */
var s2=d.querySelector('.s-auth');
var tks=s2?s2.querySelectorAll('.z-tw .tk'):[],ask=s2&&s2.querySelector('.ask'),askB=ask&&ask.querySelector('.bt'),cap2=s2&&s2.querySelector('.st-cap'),last2='';
var CAP2=['Routine work happens below the line, inside your tools.','Anything that needs judgement goes up to you. It waits.','You approve. It carries on. Every step is logged.'];
function upd2(){
  if(!s2)return;var p=prog(s2);
  tks.forEach(function(e,i){var th=parseFloat(e.getAttribute('data-at'));e.classList.toggle('in',p>=th);if(e.classList.contains('rise'))e.classList.toggle('gone',p>=0.56);});
  if(ask){ask.classList.toggle('up',p>=0.56);ask.classList.toggle('ok',p>=0.76);var t=p>=0.76?'Approved by you':'Needs you';if(askB.textContent!==t)askB.textContent=t;}
  var c=p<0.46?0:p<0.76?1:2;if(CAP2[c]!==last2){last2=CAP2[c];cap2.textContent=last2;}
}
if(!reduce&&(s1||s2)){
  var q=false;var run=function(){q=false;upd1();upd2();};
  var req=function(){if(!q){q=true;requestAnimationFrame(run);}};
  w.addEventListener('scroll',req,{passive:true});w.addEventListener('resize',req);run();
}else{
  if(s1){setLane(LA,1,OLD,OLDT,STEPS_OLD,fmtM);setLane(LB,1,NEW,NEWT,STEPS_NEW,function(v){return Math.round(v)+'s';});cap1.textContent=CAP1[3];}
  if(s2){tks.forEach(function(e){e.classList.add('in');if(e.classList.contains('rise'))e.classList.add('gone');});if(ask){ask.classList.add('up','ok');askB.textContent='Approved by you';}cap2.textContent=CAP2[2];}
}

/* industries carousel buttons */
var ind=d.querySelector('.ind');
d.querySelectorAll('.ind-nav button').forEach(function(b){b.addEventListener('click',function(){var c=ind.querySelector('.ic-card');ind.scrollBy({left:(c?c.offsetWidth+14:320)*(b.dataset.d==='1'?1:-1),behavior:reduce?'auto':'smooth'});});});
})();
