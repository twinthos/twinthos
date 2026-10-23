/* Twinthos site v2: reveal blocks as they scroll into view. Content stays visible without it. */
(function(){
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var els=[].slice.call(document.querySelectorAll('main section .wrap > *, .nx-article > *, .nx-card')).filter(function(e){
  return e.getBoundingClientRect().top>innerHeight*0.9&&!e.closest('form')&&!e.matches('form,script,style');});
els.forEach(function(e){e.classList.add('v2rv');});
function go(){var lim=innerHeight*0.94;els=els.filter(function(e){if(e.getBoundingClientRect().top<lim){e.classList.add('in');return false;}return true;});}
var q=false;addEventListener('scroll',function(){if(!q){q=true;requestAnimationFrame(function(){q=false;go();});}},{passive:true});
addEventListener('resize',go);go();
/* safety net: never leave anything hidden */
setTimeout(function(){addEventListener('scroll',go,{passive:true});},50);
})();
