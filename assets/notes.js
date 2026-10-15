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
  // desk-nav highlighting on the notes index. Driven by IntersectionObserver
  // rather than scroll events, matching the article .nx-toc pattern: the root
  // is collapsed by rootMargin to a thin band just below the sticky bar, and
  // because the three groups are tall and stacked, exactly one crosses it at a
  // time. Falls back to a scroll listener where IO is unavailable.
  var dtoc=[].slice.call(d.querySelectorAll('.nx-desk-toc a'));
  var dgroups=[].slice.call(d.querySelectorAll('.nx-desk'));
  if(dtoc.length&&dgroups.length){
    var dset=function(hit){
      for(var j=0;j<dtoc.length;j++){
        if(hit&&dtoc[j].getAttribute('href')==='#'+hit){
          dtoc[j].setAttribute('aria-current','true');
        }else{
          dtoc[j].removeAttribute('aria-current');
        }
      }
    };
    if('IntersectionObserver' in window){
      // The bar sticks at top:var(--nav). Do NOT read its offsetTop here: for a
      // position:sticky element offsetTop returns the stuck position, which
      // collapses the band to nothing. Use the nav height plus 172px of
      // headroom so an arrived-at group's heading (which lands just past 208)
      // is inside the band, and collapse the root to a thin strip from there.
      // Percentages are unreliable here, so use pixels.
      var dnav=d.querySelector('.nx-desk-toc');
      var dbar=68+Math.round(dnav.getBoundingClientRect().height)+172;
      var dio=new IntersectionObserver(function(es){
        for(var i=0;i<es.length;i++){
          if(es[i].isIntersecting){dset(es[i].target.id)}
        }
      },{rootMargin:'-'+dbar+'px 0px -'+(window.innerHeight-dbar-1)+'px 0px',threshold:0});
      dgroups.forEach(function(g){dio.observe(g)});
    }
    var dq=0;
    window.addEventListener('scroll',function(){
      if(dq)return;
      dq=requestAnimationFrame(function(){
        dq=0;
        // A group is current once its heading has risen to the sticky bar.
        // scroll-margin-top is nav+56 = 124px, and browsers add the desk
        // header's own leading on top of that, so an arrived-at group's section
        // top measures just over 208px. Cut above that line with headroom, so
        // a freshly jumped-to group is the one selected and keeps it until the
        // next group passes. The float is fractional, so never test equality.
        var cut=240;
        var hit=null;
        for(var i=0;i<dgroups.length;i++){
          if(dgroups[i].getBoundingClientRect().top<=cut){hit=dgroups[i]}else{break}
        }
        dset(hit?hit.id:null);
      });
    },{passive:true});
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
