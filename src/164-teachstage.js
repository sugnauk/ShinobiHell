'use strict';
// SHINOBIDUNGEONS - tips belong to the first stage. The one-time tips now only appear on the first stage of a run (the
// prologue when it is on, otherwise stage I); after that the game leaves you alone. And while a new player still has
// tips to see, that first stage is built to teach everything: it always holds a trader, a shrine, a curse altar and an
// elite foe (stage I normally has no shop and only sometimes the others). A tip you never trigger there waits for the
// first stage of a later run. No tips are shown or used up anywhere else.
const TEACH_ROOMS=[['shop','shop'],['shrine','shrine'],['curse','altar']];
const teachPending=()=>OPT().tips!==0&&meta.tips&&(TEACH_ROOMS.some(([id])=>!meta.tips[id])||!meta.tips.elite);
let FIRSTLOAD=false,TEACHMAP=false;
{const _sr=startRun;startRun=function(di,cont){FIRSTLOAD=!cont&&!trainNext&&!(typeof RUSHING!=='undefined'&&RUSHING);return _sr.apply(this,arguments);};}
// the first stage's map: every teaching room present (in different fight rooms, never the start or the boss's room)
{const _gm=genMap;genMap=function(di){const m=_gm.apply(this,arguments);if(!TEACHMAP||!m||!m.rooms)return m;
 // plain fight rooms first; if the stage runs short, a trap, ambush, gong, spring or treasure room gives way
 // never in the first rooms after the start: those stay fights (in a prologue road, the first two rooms along it)
 const st=m.rooms.find(r=>r.k==='start'),cd=r=>st?Math.hypot(r.x+r.w/2-st.x-st.w/2,r.y+r.h/2-st.y-st.h/2):0;
 const early=new Set(m.rooms.filter(r=>r.k==='room').sort((a,b)=>a.ord!=null&&b.ord!=null?a.ord-b.ord:cd(a)-cd(b)).slice(0,2));
 const pref=['combat','trap','ambush','challenge','rest','treasure'],free=pref.map(t=>m.rooms.filter(r=>r.k==='room'&&r.type===t&&!early.has(r)));
 for(const [id,type] of TEACH_ROOMS){if(meta.tips[id]||m.rooms.some(r=>r.type===type))continue;const L=free.find(l=>l.length);if(!L)continue;const r=L.splice(ri(0,L.length-1),1)[0];r.type=type;r.ev=null;}
 return m;};}
{const _ld=loadDungeon;loadDungeon=function(di){const first=FIRSTLOAD;FIRSTLOAD=false;TEACHMAP=first&&teachPending()&&!(typeof DAILY==='function'&&DAILY());
 let r;try{r=_ld.apply(this,arguments);}finally{const teach=TEACHMAP;TEACHMAP=false;if(R)R.tipStage=first;
  // and an elite to meet
  if(teach&&!meta.tips.elite&&map&&!enemies.some(e=>e.elite&&!e.dead)){const rooms=map.rooms.filter(q=>q.k==='room'&&q.type==='combat');const rm=rooms.length?pick(rooms):null;
   if(rm){const pool=DUN[di].pool.filter(t=>t!=='wisp'),s=spotIn(rm);enemies.push(mkElite(pick(pool),s.x,s.y,rm,di));}}}
 return r;};}
// tips only on that first stage (not shown, and not used up, anywhere else)
{const _tp=tip;tip=function(){if(!R||!R.tipStage)return;if(P&&(P.dying>0||P.hp<=0))return; // never on the blow that kills you
 return _tp.apply(this,arguments);};}
// a tip still up when you fall is cleared, so the death plays out
{const _sd=startDeath;startDeath=function(){if(typeof TIPHOLD!=='undefined'){TIPHOLD=null;TIPQ.length=0;}return _sd.apply(this,arguments);};}
