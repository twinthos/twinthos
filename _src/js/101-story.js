/* Twinthos 2027 / progressive enhancement.
   Demonstrations are illustrative and never call external systems.
   Each control uses textContent and retains accessible static fallback. */
(function(){
 'use strict';
 const sim=document.querySelector('[data-w-simulator]');
 const scenes={
 leads:{
  message:'“Find the enquiries that went quiet, prepare the next replies and flag any decisions.”',
  policy:'May prepare agreed replies and update records. Unapproved offers or discounts require review.',
  steps:['Review the assigned inbox','Read customer history','Prepare the next action','Ask before changing an offer'],
  result:'Your team receives prepared follow-ups and a short exception list.'
 },
 scheduling:{
  message:'“Check next week’s appointments and highlight what needs attention.”',
  policy:'May confirm details and prepare reminders. Moving bookings or changing prices needs approval.',
  steps:['Read the agreed calendar','Match booking records','Prepare permitted reminders','Ask before changing a booking'],
  result:'A clearer schedule, with anything unusual ready for a person.'
 },
 research:{
  message:'“Research our prospective partners and prepare a sourced briefing.”',
  policy:'Use approved public sources; preserve links and evidence. Do not contact anyone without approval.',
  steps:['Review the research brief','Search approved sources','Prepare a sourced summary','Ask before external outreach'],
  result:'A briefing with references, open questions and proposed next actions.'
 }
 };
 if(sim){
  const buttons=[...sim.querySelectorAll('[data-w-scene]')];
  const message=sim.querySelector('[data-w-message]');
  const policy=sim.querySelector('[data-w-policy]');
  const steps=[...sim.querySelectorAll('[data-w-step]')];
  const result=sim.querySelector('[data-w-result]');
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
   const scene=scenes[btn.dataset.wScene];if(!scene)return;
   buttons.forEach(el=>{const on=el===btn;el.classList.toggle('w-selected',on);el.setAttribute('aria-pressed',String(on));});
   message.textContent=scene.message;policy.textContent=scene.policy;
   steps.forEach((el,i)=>{el.textContent=scene.steps[i]||'';});
   result.textContent=scene.result;
  }));
 }
 const anatomy=document.querySelector('[data-w-anatomy]');
 const parts={
  computer:['01','⌘','A PLACE TO WORK','Its own computer.','A dedicated workspace where approved applications, files and tasks can run beyond a single conversation.','Files, apps and runtime permissions are scoped to the agreed job.'],
  email:['02','✉','A DEDICATED IDENTITY','Its own email.','An assigned inbox and sending address can handle agreed enquiries, follow-ups and updates in your business voice.','External sending, recipients and templates must be explicitly approved.'],
  phone:['03','☎','REACHABLE WHERE YOU ALREADY WORK','Phone & messages.','A dedicated number or connected Telegram/Slack channel can let you message the operator as naturally as a colleague.','Channel availability and identity checks depend on the providers and deployment.'],
  tools:['04','⌘','REAL-WORLD ACCESS','Tools & connectors.','The operator can move between approved calendars, inboxes, records and business applications instead of leaving every step to a person.','A tool is only connected when its access and failure behaviour are agreed.'],
  card:['05','▣','CONTROLLED PURCHASING','Its own card.','Where appropriate, a dedicated payment card or approved purchasing route can support a defined business task without using a staff member’s personal card.','Spending limits, provider availability and explicit human approval come first; this is not unrestricted autonomous spending.'],
  memory:['06','∞','CONTEXT THAT CONTINUES','Long-term memory.','Business rules, examples, client-specific knowledge and past decisions can remain available across work sessions in an agreed persistent knowledge store.','Information can become stale; retention, correction, access and deletion must be defined.'],
  specialists:['07','✦','THE RIGHT HELP FOR THE JOB','Specialist helpers.','One coordinating operator can delegate narrowly defined research, content, support or outreach steps to specialist processes when the job calls for them.','The same permissions and approval boundaries apply to every delegated action.'],
  oversight:['08','◇','RESPONSIBILITY STAYS HUMAN','Oversight & records.','The team receives status summaries, exceptional cases and reviewable records rather than an AI system silently making consequential decisions.','Logging and alert coverage must be tested for the actual setup; no log is a guarantee of safety.']
 };
 if(anatomy){
  const buttons=[...anatomy.querySelectorAll('[data-w-part]')];
  const get=k=>anatomy.querySelector('[data-w-'+k+']');
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
   const p=parts[btn.dataset.wPart];if(!p)return;
   buttons.forEach(el=>{let active=el===btn;el.classList.toggle('w-active',active);el.setAttribute('aria-pressed',String(active));});
   get('index').textContent=p[0];get('symbol').textContent=p[1];get('tag').textContent=p[2];
   get('title').textContent=p[3];get('desc').textContent=p[4];get('limit').textContent=p[5];
  }));
 }
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const nodes=[...document.querySelectorAll('[data-w-reveal]')];
 if(!nodes.length||reduce||!('IntersectionObserver' in window))return;
 // Avoid hiding content if the user navigates with keyboard or JS is deferred.
 document.documentElement.classList.add('w-reveal-armed');
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('w-revealed');observer.unobserve(e.target);
 }),{rootMargin:'0px 0px -4% 0px',threshold:.04});
 nodes.forEach(n=>observer.observe(n));
})();
