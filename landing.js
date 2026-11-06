import {installEntrance} from './entry.js';
import {ease,cinematicTime,cinematicParticle} from './cinema.js';
import {createKnock} from './knock.js';
import {courseDestination} from './hosting-config.js';

const canvas=document.querySelector('#field'),ctx=canvas.getContext('2d',{alpha:false});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pointer={x:-10000,y:-10000,active:false};
let width=0,height=0,scale=1,frame=0,last=0,particles=[],sourceAspect=1,logoAspect=1,ready=false;
let colour=false,colourMix=0,tapOrigin=null,tapDragged=false,entrance=null,pendingEntrance=false;
let lastTouch=-Infinity,tapStarted=0;
const images={};
const knock=createKnock({onEnter:enterCourse,onSingleTap:toggleColour});
const COURSE_URL=courseDestination();
let seed=319;
const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};

function resize(){
  width=innerWidth;height=innerHeight;scale=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
  ctx.setTransform(scale,0,0,scale,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);
}
function place(event){
  pointer.x=event.clientX;pointer.y=event.clientY;pointer.active=true;
  if(tapOrigin&&Math.hypot(event.clientX-tapOrigin.x,event.clientY-tapOrigin.y)>8)tapDragged=true;
  if(event.pointerType==='touch'&&tapDragged)knock.reset();
}
window.addEventListener('resize',resize,{passive:true});
canvas.addEventListener('pointermove',place,{passive:true});
canvas.addEventListener('pointerdown',event=>{
  if(event.pointerType==='touch'&&!event.isPrimary){tapDragged=true;knock.reset();return;}
  tapOrigin={x:event.clientX,y:event.clientY};tapStarted=performance.now();tapDragged=false;place(event);
},{passive:true});
canvas.addEventListener('pointerleave',()=>{pointer.active=false;});
canvas.addEventListener('pointerup',event=>{
  if(event.pointerType!=='mouse')pointer.active=false;
  if(event.pointerType==='touch'){
    lastTouch=performance.now();
    if(!tapDragged&&event.isPrimary&&lastTouch-tapStarted<=280&&!entrance)knock.tap(lastTouch);
    else knock.reset();
  }
});
canvas.addEventListener('pointercancel',()=>{pointer.active=false;tapDragged=true;knock.reset();});
window.addEventListener('blur',()=>{pointer.active=false;knock.reset();});
function toggleColour(){if(ready&&!entrance){colour=!colour;canvas.dataset.mode=colour?'colour':'cloud';}}
canvas.addEventListener('click',event=>{
  // Touch clicks are handled by the rhythm recognizer, avoiding seven colour flashes.
  if(event.pointerType==='touch'||performance.now()-lastTouch<700)return;
  if(!tapDragged)toggleColour();
});
function enterCourse(){
  if(entrance)return;
  knock.reset();
  if(!ready){pendingEntrance=true;return;}
  pointer.active=false;
  entrance={start:performance.now(),reduced:reduced.matches,redirected:false,colourStart:colourMix};
  colour=false;
  for(const p of particles){p.previous=null;}
  canvas.dataset.mode='entrance';
}
installEntrance({open:enterCourse});resize();

async function sampleAsset(src,group,sampleHeight,step){
  const portrait=new Image();portrait.src=src;await portrait.decode();
  images[group]=portrait;
  // Alpha defines the point cloud. The original is shown only in the click-to-colour mode.
  const sample=document.createElement('canvas');
  sample.height=sampleHeight;sample.width=Math.round(sampleHeight*portrait.naturalWidth/portrait.naturalHeight);
  const read=sample.getContext('2d',{willReadFrequently:true});
  read.drawImage(portrait,0,0,sample.width,sample.height);
  const rgba=read.getImageData(0,0,sample.width,sample.height).data;
  if(group==='suit')sourceAspect=sample.width/sample.height;else logoAspect=sample.width/sample.height;
  for(let y=1;y<sample.height-1;y+=step){
    for(let x=1;x<sample.width-1;x+=step){
      const at=(y*sample.width+x)*4;if(rgba[at+3]<100)continue;
      const light=(rgba[at]*.2126+rgba[at+1]*.7152+rgba[at+2]*.0722)/255;
      const edge=Math.max(Math.abs(rgba[at]-rgba[Math.max(0,at-step*4)]),Math.abs(rgba[at]-rgba[Math.min(rgba.length-4,at+step*4)]))/255;
      particles.push({group,u:(x+random()*1.8)/sample.width-.5,v:(y+random()*1.8)/sample.height-.5,
        light:Math.min(1,.18+Math.pow(light,.65)*.70+edge*.28),size:.35+random()*.65,
        phase:random()*Math.PI*2,depth:random(),energy:0});
    }
  }
}
async function loadPortrait(){
  await sampleAsset('assets/suit-source.png','suit',1000,4);
  // Sample the exact approved logo; the vector and its proportions are unchanged.
  await sampleAsset('assets/logo-white.svg','logo',500,4);
  ready=true;canvas.dataset.ready='true';canvas.dataset.points=String(particles.length);
  canvas.dataset.suitPoints=String(particles.filter(p=>p.group==='suit').length);
  canvas.dataset.logoPoints=String(particles.filter(p=>p.group==='logo').length);
  canvas.dataset.mode='cloud';
  if(pendingEntrance)enterCourse();
}

function draw(now){
  const dt=Math.min((now-last)/1000||.016,.05);last=now;
  ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);
  let visible=0,visibleLogo=0;
  if(ready){
    const suitHeight=Math.min(height*.73,width*.90/sourceAspect),suitWidth=suitHeight*sourceAspect;
    const logoHeight=Math.min(height*.17,150,width*.38/logoAspect),logoWidth=logoHeight*logoAspect;
    const gap=Math.min(18,height*.025),top=(height-suitHeight-gap-logoHeight)/2;
    const radius=Math.max(115,Math.min(245,width*.28)),time=now*.001,motion=reduced.matches?0:1;
    const elapsed=entrance?now-entrance.start:0;
    const cinema=entrance?cinematicTime(elapsed,entrance.reduced):null;
    canvas.dataset.stage=cinema?.stage||'idle';
    if(cinema?.finished&&!entrance.redirected){
      entrance.redirected=true;canvas.dataset.stage='complete';
      window.location.assign(COURSE_URL);
    }
    if(entrance)colourMix=entrance.colourStart*(1-ease(elapsed/1100));
    else colourMix+=((colour?1:0)-colourMix)*Math.min(1,dt*12);
    if(colourMix>.001){
      ctx.globalAlpha=colourMix;
      ctx.drawImage(images.suit,(width-suitWidth)/2,top,suitWidth,suitHeight);
      ctx.drawImage(images.logo,(width-logoWidth)/2,top+suitHeight+gap,logoWidth,logoHeight);
      ctx.globalAlpha=1;
    }
    for(const p of particles){
      const isLogo=p.group==='logo';
      const baseX=width*.5+p.u*(isLogo?logoWidth:suitWidth);
      const baseY=top+(isLogo?suitHeight+gap+logoHeight/2:suitHeight/2)+p.v*(isLogo?logoHeight:suitHeight);
      const dx=baseX-pointer.x,dy=baseY-pointer.y,distance=Math.hypot(dx,dy);
      const field=pointer.active&&!entrance?Math.max(0,1-distance/radius):0;
      if(entrance)p.energy=cinema.reveal;
      else if(field>0&&!colour)p.energy=Math.min(1,p.energy+dt*(.35+field*5));
      else p.energy=Math.max(0,p.energy-dt*.5);
      if(p.energy<.012||(!entrance&&colourMix>.995))continue;
      visible++;if(isLogo)visibleLogo++;
      const assembled=1-p.energy,scatter=assembled*assembled*18*motion;
      const driftX=Math.sin(time*.65+p.phase+p.v*8)*(1.3+p.depth*1.5)*motion;
      const driftY=Math.cos(time*.55+p.phase+p.u*6)*1.6*motion;
      const repulsion=field>.5?(field-.5)*4*motion:0;
      let x=baseX+Math.cos(p.phase+time*.2)*scatter+driftX+dx/(distance||1)*repulsion;
      let y=baseY+Math.sin(p.phase+time*.2)*scatter+driftY+dy/(distance||1)*repulsion;
      const scan=.88+.12*Math.sin(p.v*15-time*1.5)*motion;
      let alpha=Math.min(1,p.energy*(.35+p.light*.65)*scan)*(entrance?1:1-colourMix);
      let progress=0;
      if(entrance){
        alpha*=cinema.fade;
        if(!entrance.reduced){
          const path=cinematicParticle({x:baseX,y:baseY,phase:p.phase,depth:p.depth},elapsed,width,height);
          x=path.x+driftX*(1-path.progress);y=path.y+driftY*(1-path.progress);
          alpha*=path.opacity;progress=path.progress;
        }
      }
      const tone=Math.round(110+p.light*145);
      ctx.fillStyle=`rgba(${tone},${tone},${tone},${alpha.toFixed(3)})`;
      const r=p.size*(.8+suitHeight/1300);
      ctx.fillRect(x,y,r,r);
      if(progress>.01&&progress<.96&&p.depth>.84&&p.previous){
        ctx.strokeStyle=`rgba(${tone},${tone},${tone},${(alpha*.24).toFixed(3)})`;ctx.lineWidth=.55;
        ctx.beginPath();ctx.moveTo(p.previous.x,p.previous.y);ctx.lineTo(x,y);ctx.stroke();
      }
      p.previous={x,y};
      // Rare short fragments give the cloud a scanning texture without a wireframe or a photo layer.
      if(motion&&p.depth>.992&&field>.12){ctx.globalAlpha=.22;ctx.fillRect(x-3,y,7,.5);ctx.globalAlpha=1;}
    }
  }
  canvas.dataset.visiblePoints=String(visible);
  canvas.dataset.visibleLogoPoints=String(visibleLogo);
  frame=requestAnimationFrame(draw);
}
document.addEventListener('visibilitychange',()=>{
  cancelAnimationFrame(frame);pointer.active=false;knock.reset();
  if(!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}
});
loadPortrait().catch(()=>{document.querySelector('#visual-status').textContent='The interactive portrait could not be loaded.';canvas.dataset.error='portrait';if(pendingEntrance)window.location.assign(COURSE_URL);});
frame=requestAnimationFrame(draw);
