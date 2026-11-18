'use strict';
// SHINOBIDUNGEONS - no skipping a guardian's phases. A big enough hit used to carry a boss straight past a phase
// threshold (sometimes past two, or to death), skipping its survival phase. Now a boss's health stops at the next
// threshold it has not reached yet: anything more does nothing, the boss turns invulnerable for a moment and the next
// phase (its transformation, its event or its survival storm) begins. It can only die once every phase has been played.
// Every survival phase also lasts 50% longer.
const SURVX=1.5;
// the highest threshold (fraction of max health) this boss still has to pass through, or null
function bossNextTh(e){if(!e||!e.boss||e.dead||!e.maxhp)return null;const K=BKIT[e.name];
 if(K&&K.director&&!e.r7&&typeof phaseGate==="function"){if(e.EV||e.phx)return null;const L=bossEvents(K),seen=e.evSeen||{};let th=null;
  L.forEach((ev,i)=>{if(!seen[i]&&(th==null||ev.at>th))th=ev.at;});if(!e.half&&!K.noHalf&&(th==null||.5>th))th=.5;return th;}
 if(K&&K.director)return null; // a boss with its own director handles itself
 if(e.storm>0)return null;return e.phase===1?.6:e.phase===2?.3:null;}
const bossFloor=e=>{const th=bossNextTh(e);return th==null?null:th*e.maxhp-.5;};
function bossLock(e){e.hp=bossFloor(e);e.iv=Math.max(e.iv||0,.35);e.flash=.15;if(!e._lockMsg||time-e._lockMsg>2){e._lockMsg=time;txtFx(e.x,e.y-18,'INVULNERABLE','#fff');}}
{const _h=hurtE;hurtE=function(e){if(!e||!e.boss)return _h.apply(this,arguments);const fl=bossFloor(e);if(fl==null)return _h.apply(this,arguments);
 try{return _h.apply(this,arguments);}finally{if(!e.dead&&e.hp<fl)bossLock(e);}};}
// a killing blow (or a burn, or a deathblow) while phases remain does not kill: it stops at the threshold
{const _ke=killE;killE=function(e){if(e&&e.boss&&!e.dead&&!e.rush_skip){const fl=bossFloor(e);if(fl!=null&&fl>0){bossLock(e);return;}}return _ke.apply(this,arguments);};}
// damage that bypasses hurtE (burns, posture breaks) is caught every frame
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!boss||boss.dead)return;const fl=bossFloor(boss);if(fl!=null&&boss.hp<fl)bossLock(boss);};}
// ---------- survival phases last 50% longer ----------
for(const K of Object.values(BKIT)){if(!K||K._survx)continue;K._survx=1;if(K.event&&K.event.dur)K.event.dur*=SURVX;if(K.storm)K.storm.dur=(K.storm.dur||9)*SURVX;
 if(Array.isArray(K.events))for(const ev of K.events)if(ev&&ev.dur)ev.dur*=SURVX;delete K._evs;}
