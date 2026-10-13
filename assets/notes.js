(function(){
  var d=document, rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // reading progress
  var bar=d.querySelector('.nx-progress'), art=d.querySelector('.nx-article');
  if(bar&&art){
    var tick=false;
    function upd(){
      var r=art.getBoundingClientRect(), h=r.height-innerHeight*.6;
      var p=Math.min(1,Math.max(0,(-r.top+innerHeight*.2)/Math.max(h,1)));
      bar.style.transform='scaleX('+p+')'; tick=false;
    }
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
    upd();
  }
  // TOC highlighting
  var links=[].slice.call(d.querySelectorAll('.nx-toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a)a.classList.add('on')}
      });
    },{rootMargin:'-20% 0px -70% 0px'});
    Object.keys(map).forEach(function(id){var el=d.getElementById(id);if(el)io.observe(el)});
  }
  // chart reveal
  var charts=[].slice.call(d.querySelectorAll('.nx-chart'));
  if(charts.length&&'IntersectionObserver' in window&&!rm){
    charts.forEach(function(c){c.classList.add('js-arm')});
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');cio.unobserve(e.target)}});
    },{threshold:.25});
    charts.forEach(function(c){cio.observe(c)});
  }
  // calculator
  var calc=d.querySelector('[data-calc]');
  if(calc){
    var h=calc.querySelector('[name=hours]'), v=calc.querySelector('[name=rate]');
    var fmt=new Intl.NumberFormat('en-GB',{maximumFractionDigits:0});
    function run(){
      var hrs=Math.max(0,parseFloat(h.value)||0), rate=Math.max(0,parseFloat(v.value)||0);
      var yr=hrs*52, cost=yr*rate;
      calc.querySelector('[data-o=year]').textContent=fmt.format(yr);
      calc.querySelector('[data-o=days]').textContent=fmt.format(yr/8);
      calc.querySelector('[data-o=cost]').textContent='£'+fmt.format(cost);
    }
    [h,v].forEach(function(i){i.addEventListener('input',run)});run();
  }
})();
