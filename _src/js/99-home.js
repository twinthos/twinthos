/* Twinthos homepage / progressive enhancement only.
   Interactive example selector + one-time viewport reveals.
   Never makes network calls, runs model actions or represents live systems. */
(function(){
  'use strict';
  var root=document.querySelector('.home-v11');
  if(!root)return;
  var bench=document.querySelector('[data-workbench]');
  var scenes={
    enquiry:{
      message:'“Find the enquiries we haven’t replied to and prepare the next steps.”',
      rule:'Update records and prepare approved follow-ups. Ask before sending anything outside the agreed template.',
      steps:['Check the shared inbox','Match messages to open records','Prepare the follow-up','Request approval when needed'],
      outcome:'Outcome: a clear queue of prepared responses and exceptions for your team.'
    },
    admin:{
      message:'“Check next week’s appointments and flag anything missing.”',
      rule:'Use the agreed calendar and records. Do not move or cancel appointments without the required approval.',
      steps:['Review the agreed calendar','Compare booking records','Prepare reminders and missing details','Ask before changing any booking'],
      outcome:'Outcome: a cleaner schedule and a shortlist of decisions for your team.'
    },
    research:{
      message:'“Research these prospects and prepare a short briefing.”',
      rule:'Use approved public sources only. Preserve references; do not contact any prospect without permission.',
      steps:['Read the assigned research brief','Review approved public information','Prepare a sourced summary','Request approval before outreach'],
      outcome:'Outcome: a reviewable briefing, with sources and unanswered questions.'
    }
  };
  if(bench){
    var controls=Array.prototype.slice.call(bench.querySelectorAll('[data-scene]'));
    var message=bench.querySelector('[data-scene-message]');
    var rule=bench.querySelector('[data-scene-rule]');
    var outcome=bench.querySelector('[data-scene-outcome]');
    var steps=Array.prototype.slice.call(bench.querySelectorAll('[data-step]'));
    controls.forEach(function(control){
      control.addEventListener('click',function(){
        var key=control.getAttribute('data-scene');
        var scene=scenes[key];
        if(!scene)return;
        controls.forEach(function(other){
          var current=(other===control);
          other.classList.toggle('is-current',current);
          other.setAttribute('aria-pressed',current?'true':'false');
        });
        message.textContent=scene.message;
        rule.textContent=scene.rule;
        outcome.textContent=scene.outcome;
        steps.forEach(function(step,index){step.textContent=scene.steps[index];});
      });
    });
  }
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced||!('IntersectionObserver' in window))return;
  var reveals=Array.prototype.slice.call(document.querySelectorAll('.pg-home [data-reveal]'));
  if(!reveals.length)return;
  document.documentElement.classList.add('v11-armed');
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('v11-visible');
        observer.unobserve(entry.target);
      }
    });
  },{rootMargin:'0px 0px -6% 0px',threshold:0.07});
  reveals.forEach(function(item){observer.observe(item);});
})();
