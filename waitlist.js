// Pure helpers for the waitlist form, kept free of DOM access so they can be unit-tested.
export const EMAIL_PATTERN=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate({email='',consent=true,website=''}){
  if(website)return {ok:false,reason:'spam'};
  if(!EMAIL_PATTERN.test(email.trim()))return {ok:false,reason:'email'};
  if(!consent)return {ok:false,reason:'consent'};
  return {ok:true};
}

export function buildPayload(fields,provider,fieldMap){
  const map=fieldMap[provider];
  if(!map)throw new Error(`Unknown waitlist provider: ${provider}`);
  const body=new URLSearchParams();
  body.set(map.email,fields.email.trim());
  if(fields.firstname?.trim())body.set(map.firstname,fields.firstname.trim());
  if(fields.interest)body.set(map.interest,fields.interest);
  for(const [key,value] of Object.entries(map.extra))body.set(key,value);
  return body;
}

export function fallbackMailto(fields,address){
  const subject='3RO founding waitlist';
  const lines=[`Please add me to the 3RO founding waitlist.`,``,`Email: ${fields.email.trim()}`];
  if(fields.firstname?.trim())lines.push(`Name: ${fields.firstname.trim()}`);
  if(fields.interest)lines.push(`Interest: ${fields.interest}`);
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
