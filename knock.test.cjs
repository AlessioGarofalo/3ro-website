const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const moduleReady=import('data:text/javascript;base64,'+fs.readFileSync(__dirname+'/knock.js').toString('base64'));
function clock(){
 let time=0,next=0;const jobs=new Map();
 return {get time(){return time;},schedule(fn,delay){const id=++next;jobs.set(id,{fn,at:time+delay});return id;},cancel(id){jobs.delete(id);},advance(delta){
  const until=time+delta;
  while(true){const due=[...jobs.entries()].filter(([,v])=>v.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;time=due[1].at;jobs.delete(due[0]);due[1].fn();}
  time=until;
 }};
}
async function setup(){const {createKnock}=await moduleReady,c=clock(),calls={enter:0,single:0};const knock=createKnock({onEnter:()=>calls.enter++,onSingleTap:()=>calls.single++,schedule:c.schedule,cancel:c.cancel});return {c,calls,knock};}
test('3-2-2 rhythm enters once with no intermediate colour toggles',async()=>{
 const {c,calls,knock}=await setup();knock.tap(c.time);
 for(const gap of [200,200,700,200,700,200]){c.advance(gap);knock.tap(c.time);}
 c.advance(2000);assert.deepEqual(calls,{enter:1,single:0});knock.tap(c.time);assert.equal(calls.enter,1);
});
test('tempo tolerances allow quick and paused groups without strict musical timing',async()=>{
 const {c,calls,knock}=await setup();knock.tap(c.time);
 for(const gap of [60,420,550,420,1300,60]){c.advance(gap);knock.tap(c.time);}
 assert.deepEqual(calls,{enter:1,single:0});
});
test('single touch remains a colour toggle after the short recognition window',async()=>{
 const {c,calls,knock}=await setup();knock.tap(c.time);c.advance(450);assert.equal(calls.single,0);c.advance(1);assert.deepEqual(calls,{enter:0,single:1});
});
test('seven evenly spaced taps do not accidentally open the course',async()=>{
 const {c,calls,knock}=await setup();knock.tap(c.time);
 for(let i=0;i<6;i++){c.advance(200);knock.tap(c.time);}c.advance(1500);assert.equal(calls.enter,0);
});
test('gesture cancellation clears pending single taps and partial sequences',async()=>{
 const {c,calls,knock}=await setup();knock.tap(c.time);knock.reset();c.advance(2000);assert.deepEqual(calls,{enter:0,single:0});
 knock.tap(c.time);c.advance(200);knock.tap(c.time);knock.reset();c.advance(2000);assert.equal(calls.enter,0);
});
