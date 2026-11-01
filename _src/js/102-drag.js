/* Interactive, illustrative handoff comparison. No network actions. */
(()=>{'use strict';
const root=document.querySelector('[data-drag-demo]');if(!root)return;
const steps=[
['Receive','Read the enquiry','Open a new inbox','Read the incoming request'],
['Remember','Find previous conversations','Search other tools for context','Use the approved knowledge store'],
['Update','Edit the customer record','Copy details into the CRM','Update an approved record'],
['Prepare','Draft a useful response','Write a reply from scratch','Prepare the agreed response'],
['Decide','Check whether approval is needed','Interrupt a manager','Ask a human before an exception'],
['Follow up','Keep track of the next action','Remember to chase again','Maintain the agreed follow-up queue']
];
let index=0,mode='manual';
const find=s=>root.querySelector(s);
const text=(s,v)=>{find(s).textContent=v};
function render(){
 const agent=mode==='agent',row=steps[index];
 root.dataset.dragMode=mode;
 text('[data-drag-counter]',String(index+1).padStart(2,'0')+' / 06 · '+(agent?'OPERATED WORKFLOW':'HUMAN HANDOFF'));
 text('[data-drag-title]',agent?row[3]+'.':row[1]+'.');
 text('[data-drag-detail]',agent?'The dedicated operator follows the assigned job and pauses where approval is required.':'A person must switch context and carry this small step forward.');
 text('[data-drag-app]',agent?'TWINTHOS / WORKSPACE':'TEAM / MANUAL');
 text('[data-drag-action]',agent?row[3]:row[2]);
 text('[data-drag-actor]',agent?'Scoped digital employee':'Waiting for a team member');
 text('[data-drag-state]',agent?(index===4?'APPROVAL':'IN SCOPE'):'HANDOFF');
 text('[data-drag-result]',agent?'The same chain is coordinated as one scoped workflow, with humans making consequential decisions.':'Six small tasks compete for human attention.');
 find('[data-drag-progress]').style.width=((index+1)/steps.length*100)+'%';
 find('[data-drag-prev]').disabled=index===0;
 find('[data-drag-next]').disabled=index===steps.length-1;
 root.querySelectorAll('[data-drag-mode-button]').forEach(b=>{const on=b.dataset.dragModeButton===mode;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on));});
 root.querySelectorAll('[data-drag-step]').forEach(b=>{const on=Number(b.dataset.dragStep)===index;b.classList.toggle('is-selected',on);if(on)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
}
root.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||!root.contains(b))return;
 if(b.dataset.dragModeButton){mode=b.dataset.dragModeButton;index=0;}
 else if(b.dataset.dragStep!==undefined)index=Number(b.dataset.dragStep);
 else if(b.hasAttribute('data-drag-next'))index=Math.min(steps.length-1,index+1);
 else if(b.hasAttribute('data-drag-prev'))index=Math.max(0,index-1);
 else return;
 render();
});
render();
})();