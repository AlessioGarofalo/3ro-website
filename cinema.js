export const CINEMA={resolve:1200,hold:1800,explode:3400,finish:3800};
export const clamp=value=>Math.max(0,Math.min(1,value));
export const ease=value=>{const t=clamp(value);return t*t*(3-2*t);};
export function cinematicTime(elapsed,reduced=false){
  if(reduced)return {stage:elapsed<300?'resolve':'fade',reveal:ease(elapsed/200),fade:1-ease((elapsed-300)/350),finished:elapsed>=650};
  return {stage:elapsed<CINEMA.resolve?'resolve':elapsed<CINEMA.hold?'hold':elapsed<CINEMA.explode?'explode':'fade',
    reveal:ease(elapsed/CINEMA.resolve),fade:1-ease((elapsed-CINEMA.explode)/(CINEMA.finish-CINEMA.explode)),finished:elapsed>=CINEMA.finish};
}
export function cinematicParticle({x,y,phase,depth},elapsed,width,height){
  const cx=width*.5,cy=height*.49;
  const progress=clamp((elapsed-CINEMA.hold)/(CINEMA.explode-CINEMA.hold));
  // Each point flies out along its own fixed ray: no rotation, orbit or inward contraction.
  const angle=Math.atan2(y-cy,x-cx)+(phase-Math.PI)*.45;
  const distance=Math.max(width,height)*(.65+depth*.7)*Math.pow(progress,.72);
  return {x:x+Math.cos(angle)*distance,y:y+Math.sin(angle)*distance,
    opacity:Math.pow(1-progress,1.1),progress};
}
