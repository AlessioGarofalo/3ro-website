const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const entry=import('data:text/javascript;base64,'+fs.readFileSync(__dirname+'/entry.js').toString('base64'));
function key(target,type,code,extra={}){const event=new Event(type,{cancelable:true});Object.assign(event,{code,...extra});target.dispatchEvent(event);return event;}
test('typing 3 R O in sequence is not the simultaneous entrance chord',async()=>{
 const {installEntrance}=await entry,target=new EventTarget();let opens=0;
 installEntrance({target,open:()=>opens++});
 for(const code of ['Digit3','KeyR','KeyO']){key(target,'keydown',code);key(target,'keyup',code);}
 assert.equal(opens,0);
});
test('overlapping three-key chord enters once and prevents the final key default',async()=>{
 const {installEntrance}=await entry,target=new EventTarget();let opens=0;
 installEntrance({target,open:()=>opens++});
 key(target,'keydown','KeyR');key(target,'keydown','Digit3');const last=key(target,'keydown','KeyO');
 assert.equal(opens,1);assert.equal(last.defaultPrevented,true);
 key(target,'keydown','KeyO',{repeat:true});assert.equal(opens,1);
});
test('focus loss clears held keys; cleanup detaches the entrance',async()=>{
 const {installEntrance}=await entry,target=new EventTarget();let opens=0;
 const dispose=installEntrance({target,open:()=>opens++});
 key(target,'keydown','Digit3');key(target,'keydown','KeyR');target.dispatchEvent(new Event('blur'));key(target,'keydown','KeyO');
 assert.equal(opens,0);dispose();
 key(target,'keydown','Digit3');key(target,'keydown','KeyR');assert.equal(opens,0);
});
test('browser shortcuts cannot trigger the entrance',async()=>{
 const {installEntrance}=await entry,target=new EventTarget();let opens=0;
 installEntrance({target,open:()=>opens++});
 for(const code of ['Digit3','KeyR','KeyO'])key(target,'keydown',code,{ctrlKey:true});
 assert.equal(opens,0);
});
