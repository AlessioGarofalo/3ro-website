import {installEntrance} from './entry.js';
import {createKnock} from './knock.js';
import {courseDestination} from './hosting-config.js';
import {WAITLIST,FIELD_MAP} from './waitlist-config.js';
import {validate,buildPayload,fallbackMailto} from './waitlist.js';

const COURSE_URL=courseDestination();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Waitlist ---------- */
const MESSAGES={
  email:'Please enter a valid email address.',
  consent:'Please tick the box so we can send you updates.',
  sending:'Adding you to the list…',
  done:'You\'re on the list. Check your inbox to confirm your email.',
  fallback:'Your email app should open with a pre-filled message. Just press send.',
  error:'Something went wrong. Please try again, or write to info@3ro.io.'
};

for(const form of document.querySelectorAll('[data-waitlist]')){
  const status=form.querySelector('.form-status');
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data=new FormData(form);
    const consentBox=form.querySelector('[name="consent"]');
    const fields={
      email:String(data.get('email')||''),
      firstname:String(data.get('firstname')||''),
      interest:String(data.get('interest')||''),
      website:String(data.get('website')||''),
      // The short hero form has no checkbox: submitting it is the request, and the
      // provider's double opt-in email confirms consent.
      consent:consentBox?consentBox.checked:true
    };
    const check=validate(fields);
    if(!check.ok){
      if(check.reason==='spam'){form.classList.add('is-done');status.textContent=MESSAGES.done;return;}
      status.textContent=MESSAGES[check.reason];form.dataset.state='error';
      form.querySelector(check.reason==='email'?'[name="email"]':'[name="consent"]')?.focus();
      return;
    }
    if(!WAITLIST.action){
      window.location.href=fallbackMailto(fields,WAITLIST.fallbackEmail);
      status.textContent=MESSAGES.fallback;form.dataset.state='done';return;
    }
    form.dataset.state='sending';status.textContent=MESSAGES.sending;
    form.querySelector('button[type="submit"]').disabled=true;
    try{
      // Providers do not return CORS headers to static sites; an opaque response means delivered.
      await fetch(WAITLIST.action,{method:'POST',mode:'no-cors',body:buildPayload(fields,WAITLIST.provider,FIELD_MAP)});
      form.dataset.state='done';form.classList.add('is-done');status.textContent=MESSAGES.done;
      form.reset();
    }catch{
      form.dataset.state='error';status.textContent=MESSAGES.error;
    }finally{
      form.querySelector('button[type="submit"]').disabled=false;
    }
  });
}

/* ---------- Scroll reveal ---------- */
const revealables=document.querySelectorAll('.reveal');
if(reduced||!('IntersectionObserver' in window)){revealables.forEach(el=>el.classList.add('in'));}
else{
  const io=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target);}
  },{rootMargin:'0px 0px -10% 0px',threshold:.08});
  revealables.forEach(el=>io.observe(el));
}

/* ---------- Nav state ---------- */
const nav=document.querySelector('.nav');
const onScroll=()=>nav.classList.toggle('scrolled',scrollY>24);
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- Learner entrance ----------
   Hold 3 + R + O on a keyboard, or knock 3-2-2 on the hero portrait on a phone.
   An entrance gesture, not authentication: the course itself sits behind Cloudflare Access. */
let entering=false;
function enterCourse(){
  if(entering)return;entering=true;
  document.documentElement.classList.add('entering');
  setTimeout(()=>window.location.assign(COURSE_URL),reduced?150:1100);
}
installEntrance({open:enterCourse});
const portal=document.querySelector('#portal');
const knock=createKnock({onEnter:enterCourse,onSingleTap:()=>{}});
let down=0,origin=null;
portal.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;down=performance.now();origin={x:e.clientX,y:e.clientY};},{passive:true});
portal.addEventListener('pointerup',e=>{
  if(e.pointerType!=='touch'||!origin)return;
  const moved=Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>8,now=performance.now();
  if(!moved&&now-down<=280)knock.tap(now);else knock.reset();origin=null;
});
portal.addEventListener('pointercancel',()=>knock.reset());
document.querySelectorAll('[data-course-link]').forEach(a=>{
  a.href=COURSE_URL;a.addEventListener('click',e=>{e.preventDefault();enterCourse();});
});

/* ---------- Portrait parallax ---------- */
if(!reduced&&matchMedia('(pointer: fine)').matches){
  portal.addEventListener('pointermove',e=>{
    const r=portal.getBoundingClientRect();
    portal.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));
    portal.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3));
  });
  portal.addEventListener('pointerleave',()=>{portal.style.setProperty('--px',0);portal.style.setProperty('--py',0);});
}

/* ---------- Curriculum map filter ---------- */
const phasesEl=document.querySelector('.phases'),stripEl=document.querySelector('.strip');
document.querySelectorAll('.lg').forEach(btn=>btn.addEventListener('click',()=>{
  const on=btn.getAttribute('aria-pressed')!=='true';
  document.querySelectorAll('.lg').forEach(b=>b.setAttribute('aria-pressed','false'));
  btn.setAttribute('aria-pressed',String(on));
  const f=on?btn.dataset.cat:'';phasesEl.dataset.filter=f;stripEl.dataset.filter=f;
}));

document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=new Date().getFullYear();});
