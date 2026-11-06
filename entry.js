// An entrance gesture, not authorization. The preview opens the existing local course.
// Production must point to a separately authenticated course service, never bundled course HTML.
export function installEntrance({target=window,open=()=>window.location.assign('http://127.0.0.1:8765/')}={}) {
  const held=new Set(),chord=['Digit3','KeyR','KeyO'];
  let entered=false;
  function down(event){
    if(event.ctrlKey||event.altKey||event.metaKey||event.isComposing)return;
    if(event.target?.closest?.('input,textarea,[contenteditable="true"]'))return;
    held.add(event.code);
    if(!entered&&chord.every(key=>held.has(key))){entered=true;event.preventDefault();held.clear();open();}
  }
  const up=event=>held.delete(event.code),clear=()=>held.clear();
  target.addEventListener('keydown',down);target.addEventListener('keyup',up);target.addEventListener('blur',clear);
  return ()=>{target.removeEventListener('keydown',down);target.removeEventListener('keyup',up);target.removeEventListener('blur',clear);};
}
