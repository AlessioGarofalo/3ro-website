const test=require('node:test'),assert=require('node:assert/strict');
test('waitlist helpers',async()=>{
  const {validate,buildPayload,fallbackMailto}=await import('./waitlist.js');
  const {FIELD_MAP}=await import('./waitlist-config.js');
  assert.equal(validate({email:'bad'}).reason,'email');
  assert.equal(validate({email:'a@b.io',consent:false}).reason,'consent');
  assert.equal(validate({email:'a@b.io',website:'x'}).reason,'spam');
  assert.ok(validate({email:' a@b.io '}).ok);
  const b=buildPayload({email:' a@b.io ',firstname:'Ada',interest:'builder'},'brevo',FIELD_MAP);
  assert.equal(b.get('EMAIL'),'a@b.io');assert.equal(b.get('FIRSTNAME'),'Ada');assert.equal(b.get('INTEREST'),'builder');assert.equal(b.get('locale'),'en');
  const d=buildPayload({email:'a@b.io'},'buttondown',FIELD_MAP);assert.equal(d.get('email'),'a@b.io');assert.equal(d.has('tag'),false);
  assert.throws(()=>buildPayload({email:'a@b.io'},'nope',FIELD_MAP));
  assert.match(fallbackMailto({email:'a@b.io',interest:'learner'},'info@3ro.io'),/^mailto:info@3ro\.io\?subject=3RO/);
});
