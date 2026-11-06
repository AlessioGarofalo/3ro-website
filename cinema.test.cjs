const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const motion=import('data:text/javascript;base64,'+fs.readFileSync(__dirname+'/cinema.js').toString('base64'));
test('entrance resolves, holds, explodes outward and then opens the course',async()=>{
 const {cinematicTime}=await motion;
 assert.equal(cinematicTime(1000).stage,'resolve');
 assert.equal(cinematicTime(1500).stage,'hold');
 assert.equal(cinematicTime(2400).stage,'explode');
 assert.equal(cinematicTime(3600).stage,'fade');
 assert.equal(cinematicTime(3700).finished,false);
 assert.equal(cinematicTime(3800).finished,true);
 assert.equal(cinematicTime(3800).fade,0);
});
test('reduced motion has a short reveal/fade without a dissolution stage',async()=>{
 const {cinematicTime}=await motion;
 assert.equal(cinematicTime(200,true).stage,'resolve');
 assert.equal(cinematicTime(400,true).stage,'fade');
 assert.equal(cinematicTime(650,true).finished,true);
});
test('particles travel away from the centre on straight rays, with finite positions and opacity',async()=>{
 const {cinematicParticle}=await motion;
 for(const point of [{x:600,y:80,phase:0,depth:0},{x:780,y:930,phase:4,depth:1}]){
  let lastDistance=Math.hypot(point.x-720,point.y-490);
  for(const time of [0,1200,1800,2100,2500,3000,3400,3800]){
   const p=cinematicParticle(point,time,1440,1000);
   assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(p.opacity>=0&&p.opacity<=1);
   const distance=Math.hypot(p.x-720,p.y-490);assert.ok(distance>=lastDistance-.001);lastDistance=distance;
  }
  const final=cinematicParticle(point,10400,1440,1000);
  assert.ok(Math.hypot(final.x-720,final.y-490)>1000);
  assert.equal(final.opacity,0);
 }
});
