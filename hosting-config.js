export const courseDestination=()=>['127.0.0.1','localhost'].includes(location.hostname)
 ?'http://127.0.0.1:8765/?theme=dark&entrance=3ro'
  :'https://learn.3ro.io/?theme=dark&entrance=3ro';
