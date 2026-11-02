
(()=>{'use strict';
const nav=document.querySelector('.site-header'),menu=document.querySelector('.nav-mobile');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('menu-open',!expanded);});document.querySelectorAll('.site-header nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('menu-open');}));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const story=document.querySelector('[data-story]');
const scenes=[
 {label:'INSTRUCTION RECEIVED',title:'An enquiry arrives.',manual:'Someone stops to open the inbox, leaving another job unfinished.',operator:'Your assigned operator reads the incoming enquiry through the approved channel.',manualAction:'Open and understand the message',agentAction:'Identify the request and its context'},
 {label:'CONTEXT RETRIEVED',title:'The last conversation matters.',manual:'A person searches email threads, documents and records to understand the history.',operator:'The operator checks the available business context and approved memory for relevant history.',manualAction:'Search for previous conversations',agentAction:'Use the authorised knowledge store'},
 {label:'RECORDS UPDATED',title:'The details must move.',manual:'Someone copies the details into the customer record and checks whether anything was missed.',operator:'The assigned workflow updates the permitted record and keeps the task linked to the enquiry.',manualAction:'Copy data between applications',agentAction:'Prepare or apply allowed record updates'},
 {label:'FOLLOW-UP PREPARED',title:'The next message is drafted.',manual:'A team member writes the response and checks the relevant policies.',operator:'The operator prepares an agreed response using the business voice and approved information.',manualAction:'Draft and review the reply',agentAction:'Prepare the approved next response'},
 {label:'AUTHORITY CHECKED',title:'A judgement belongs to you.',manual:'The team must escalate an unusual request, discount or consequential decision.',operator:'The operator pauses at the approval boundary and presents the exception for a person to decide.',manualAction:'Find a manager to make the decision',agentAction:'Ask for a human decision'},
 {label:'CONTINUITY MAINTAINED',title:'Tomorrow has a next step.',manual:'Someone must remember to check whether the customer replied and what comes next.',operator:'The defined workflow keeps the follow-up in its queue and continues on the agreed schedule.',manualAction:'Remember to chase the outcome',agentAction:'Keep the approved follow-up task alive'}
];
let step=0,mode='operator',timer=null;
function select(s){return story.querySelector(s)}
function renderStory(){const x=scenes[step],auto=mode==='operator';story.dataset.mode=mode;
 select('[data-story-counter]').textContent=String(step+1).padStart(2,'0')+' / 06';
 select('[data-story-label]').textContent=x.label;select('[data-story-title]').textContent=x.title;
 select('[data-story-detail]').textContent=auto?x.operator:x.manual;
 select('[data-story-action]').textContent=auto?x.agentAction:x.manualAction;
 select('[data-story-agent]').textContent=auto?'THE OPERATOR':'HUMAN HANDOFF';
 select('[data-story-boundary]').textContent=auto?(step===4?'Human approval required':'Within the agreed permissions'):'Requires a team member';
 select('[data-story-progress]').style.width=(step+1)/6*100+'%';
 select('[data-story-outcome]').textContent=auto?'One scoped workflow can continue across approved tools. High-impact decisions still require a person.':'The same six steps interrupt different people, tools and moments of the day.';
 story.querySelectorAll('[data-relay-index]').forEach(node=>{
  const idx=Number(node.dataset.relayIndex);
  node.classList.toggle('is-active',idx===step);
  node.classList.toggle('is-complete',idx<step);
  node.classList.toggle('is-human',idx===4);
 });
 const activeRelay=story.querySelector('[data-story-relay-fill]');
 if(activeRelay)activeRelay.style.height=((step+1)/6*100)+'%';
  select('[data-story-prev]').disabled=step===0;select('[data-story-next]').disabled=step===5;
 story.querySelectorAll('[data-story-mode]').forEach(b=>{const active=b.dataset.storyMode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 story.querySelectorAll('[data-story-step]').forEach(b=>{let active=Number(b.dataset.storyStep)===step;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});}
function stop(){if(timer!==null){clearInterval(timer);timer=null}select('[data-story-play-label]').textContent='Play story'}
function start(){if(reduced){step=(step+1)%6;renderStory();return;}stop();select('[data-story-play-label]').textContent='Pause story';timer=setInterval(()=>{if(document.hidden)return;if(step>=5){stop();return}step++;renderStory()},3500)}
story.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!story.contains(b))return;
 if(b.dataset.storyMode){stop();mode=b.dataset.storyMode;step=0;renderStory();return}
 if(b.dataset.storyStep!==undefined){stop();step=Number(b.dataset.storyStep);renderStory();return}
 if(b.hasAttribute('data-story-prev')){stop();step=Math.max(0,step-1);renderStory();return}
 if(b.hasAttribute('data-story-next')){stop();step=Math.min(5,step+1);renderStory();return}
 if(b.hasAttribute('data-story-play')){timer===null?start():stop();return}
});renderStory();if(reduced){select('[data-story-play-label]').textContent='Advance story'}
const parts={
 computer:['01','⌘','ITS OWN WORKSPACE','A dedicated computer.','Its own working environment: the approved applications, files and processes needed for a real job—not a single chat window.','Tools and files are limited to the written job specification.'],
 inbox:['02','✉','ITS OWN COMMUNICATION','An assigned email.','A dedicated inbox and sender identity can manage agreed enquiries, communications and follow-ups in your business voice.','Who can be contacted, and what may be sent, is defined beforehand.'],
 phone:['03','☎','THE CHANNELS YOU ALREADY USE','Phone and messaging.','A configured phone or connected messaging channel can let you give instructions to the operator as naturally as to a colleague.','Available providers, verified identity and allowed requests depend on the deployment.'],
 tools:['04','✦','ACTUAL BUSINESS WORK','Approved tools.','Calendars, records, files and other business applications can be connected to move the next step forward.','Every integration is explicitly scoped and tested.'],
 card:['05','▣','CONTROLLED PURCHASING','Its own card.','Where appropriate, an assigned card or purchasing route can support a defined job without using an employee’s personal payment details.','Provider limits and human approvals must govern consequential spending.'],
 memory:['06','∞','CONTEXT THAT CARRIES FORWARD','Long-term memory.','Playbooks, prior work, business context and approved customer information can remain available across sessions.','Storage, retention, correction and access are agreed for each deployment.'],
 specialists:['07','◈','MORE THAN ONE SKILL','Specialist helpers.','A coordinating operator can delegate narrow research, content, support or admin steps to specialist processes if the job requires them.','Delegated work retains the same authority boundaries.'],
 control:['08','◇','RESPONSIBILITY STAYS HUMAN','Human oversight.','Reviewable task summaries, exceptions and permissions keep important decisions visible and controlled.','No monitoring layer or AI system guarantees perfect safety.']
};
const anatomy=document.querySelector('[data-anatomy]');if(anatomy){const read=k=>anatomy.querySelector('[data-part-'+k+']');anatomy.addEventListener('click',e=>{const b=e.target.closest('[data-part]');if(!b)return;const p=parts[b.dataset.part];if(!p)return;['counter','icon','kicker','title','description','boundary'].forEach((k,i)=>read(k).textContent=p[i]);anatomy.querySelectorAll('[data-part]').forEach(btn=>{let chosen=btn===b;btn.classList.toggle('selected',chosen);btn.setAttribute('aria-pressed',String(chosen))});});anatomy.querySelector('[data-part="computer"]').setAttribute('aria-pressed','true');}
if(!reduced&&'IntersectionObserver' in window){const items=[...document.querySelectorAll('[data-reveal]')];if(items.length){document.documentElement.classList.add('reveal-armed');const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.05});items.forEach(x=>obs.observe(x));}}

/* The visual follows the pointer subtly on desktop; never moves controls. */
const stage=document.querySelector('.core-v3 .core-scene');
if(stage&&!reduced&&window.matchMedia('(pointer:fine)').matches){
  const host=stage.closest('.core-v3');
  let queued=false,point=null;
  host.addEventListener('pointermove',e=>{
    const box=host.getBoundingClientRect();
    point=[(e.clientX-box.left-box.width/2)/box.width*9,(e.clientY-box.top-box.height/2)/box.height*9];
    if(queued)return;
    queued=true;requestAnimationFrame(()=>{
      queued=false;
      if(!point)return;
      stage.style.setProperty('--shift-x',point[0].toFixed(2)+'px');
      stage.style.setProperty('--shift-y',point[1].toFixed(2)+'px');
    });
  },{passive:true});
  host.addEventListener('pointerleave',()=>{
    stage.style.setProperty('--shift-x','0px');stage.style.setProperty('--shift-y','0px');
  });
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();

