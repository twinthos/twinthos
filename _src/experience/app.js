/* Twinthos: accessible, explicitly illustrative workflow comparison.
   This does not make API calls or represent production execution. */
(()=>{
  'use strict';
  const header=document.querySelector('.site-header');
  const menu=document.querySelector('.nav-mobile');
  if(header&&menu){
    function closeMenu(){header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
    menu.addEventListener('click',()=>{
      const open=menu.getAttribute('aria-expanded')!=='true';
      header.classList.toggle('menu-open',open);
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    });
    header.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  }
  const story=document.querySelector('[data-story]');
  if(!story)return;
  const steps=[
    {title:'An enquiry arrives.',manual:'Someone stops what they are doing to open a new request.',operator:'The assigned operator receives the enquiry through its approved channel.',manualAction:'Find time to open and read the message',agentAction:'Identify the request and its context'},
    {title:'Context matters.',manual:'A person searches for previous emails, documents and customer history.',operator:'The operator checks permitted records and approved business knowledge.',manualAction:'Search previous messages and records',agentAction:'Retrieve authorised business context'},
    {title:'The record changes.',manual:'Someone copies information between disconnected systems.',operator:'The operator prepares or applies an allowed update within its job scope.',manualAction:'Manually transfer details to the right system',agentAction:'Prepare the permitted record update'},
    {title:'The response takes shape.',manual:'A person drafts the reply, consulting policy and available slots.',operator:'The operator prepares an approved response or proposed next action.',manualAction:'Write and check the follow-up',agentAction:'Prepare the agreed next response'},
    {title:'A person makes the call.',manual:'The request needs an authorised manager to decide an exception.',operator:'The operator pauses; a human decision is required before the exception proceeds.',manualAction:'Escalate to an authorised human decision',agentAction:'Request a human decision'},
    {title:'The work continues.',manual:'Someone has to remember to check for a reply and follow up again.',operator:'The scoped workflow tracks the next step on its agreed schedule.',manualAction:'Remember and carry out the next follow-up',agentAction:'Maintain the approved follow-up queue'}
  ];
  let index=0,mode='operator';
  const select=s=>story.querySelector(s);
  const modeControls=[...story.querySelectorAll('[data-story-mode]')];
  const stepControls=[...story.querySelectorAll('[data-story-step]')];
  const render=()=>{
    const item=steps[index],isOperator=mode==='operator';
    story.dataset.mode=mode;
    select('[data-story-counter]').textContent=String(index+1).padStart(2,'0')+' / 06';
    select('[data-story-title]').textContent=item.title;
    select('[data-story-detail]').textContent=isOperator?item.operator:item.manual;
    select('[data-story-action]').textContent=isOperator?item.agentAction:item.manualAction;
    select('[data-story-boundary]').textContent=isOperator?(index===4?'Human decision required':'Within the agreed permissions'):(index===4?'Human decision required':'A person must carry this step');
    select('[data-story-progress]').style.width=((index+1)/steps.length*100)+'%';
    select('[data-story-outcome]').textContent=isOperator?'A defined workflow can continue within approved tools; exceptions return to a person.':'The same six steps require people to pick up, transfer and remember the work.';
    select('[data-story-prev]').disabled=index===0;
    select('[data-story-next]').disabled=index===steps.length-1;
    modeControls.forEach(el=>{const on=el.dataset.storyMode===mode;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});
    stepControls.forEach(el=>{const on=Number(el.dataset.storyStep)===index;if(on)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
  };
  story.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!story.contains(button))return;
    if(button.dataset.storyMode){mode=button.dataset.storyMode;index=0}
    else if(button.hasAttribute('data-story-step'))index=Number(button.dataset.storyStep);
    else if(button.hasAttribute('data-story-prev'))index=Math.max(0,index-1);
    else if(button.hasAttribute('data-story-next'))index=Math.min(steps.length-1,index+1);
    else return;
    render();
  });
  render();
})();
