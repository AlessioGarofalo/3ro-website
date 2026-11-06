// Seven taps in three groups: 3 quick taps, pause, 2 quick taps, pause, 2 quick taps.
// This is an entrance gesture, not authentication.
export function createKnock({onEnter,onSingleTap,schedule=setTimeout,cancel=clearTimeout}){
  const gaps=['quick','quick','pause','quick','pause','quick'];
  let taps=[],timer=null,entered=false;
  function reset(){if(timer!==null)cancel(timer);timer=null;taps=[];}
  function tap(time=performance.now()){
    if(entered)return;
    if(timer!==null)cancel(timer);timer=null;
    if(taps.length){
      const gap=time-taps[taps.length-1],kind=gaps[taps.length-1];
      const valid=kind==='quick'?gap>=60&&gap<=420:gap>=550&&gap<=1300;
      if(!valid)reset();
    }
    taps.push(time);
    if(taps.length===7){entered=true;reset();onEnter();return;}
    const wait=gaps[taps.length-1]==='pause'?1301:451;
    timer=schedule(()=>{const single=taps.length===1;reset();if(single&&!entered)onSingleTap();},wait);
  }
  return {tap,reset};
}
