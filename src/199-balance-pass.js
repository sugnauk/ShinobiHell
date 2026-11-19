'use strict';
// SHINOBIDUNGEONS - fun / balance / clarity fixes found by the ability sweep (see ANIMATION_AUDIT.md):
//  - SHADOW STEP with no foe in reach used to do nothing but say NO TARGET. Now it is a short shadow blink toward the
//    cursor (70px, through nothing solid) at half the cooldown and no damage: a press is never wasted, and the
//    shinobi gets a second, weaker escape
//  - HARVEST (no sealed foes) and ECHO NOTES (no stored echo) failed silently; they now say why, and cost nothing
//  - THOUSAND THRUSTS dealt about 1.5x the next strongest ultimate against a pack (133x ATK vs 91x on six foes):
//    each thrust is trimmed from 0.9x to 0.75x ATK (single target it stays the best melee ultimate)
//  - ARROW RAIN now starts when its first arrows land (0.18s after the cast), so the damage matches what you see
const BAL={stepFallback:{dist:70,cd:.5},flurry:.75/.9};
// SHADOW STEP fallback
{const _cc=classCast;classCast=function(k){const p=P;if(p&&k==='q'&&CLS().k==='shinobi'&&p.lo.q===6&&!(p.ab.q>0)&&!(p.stag>0)){
  const has=enemies.some(e=>!e.dead&&!e.air&&e.type!=='turret'&&dist(e,p)<=170&&los(p.x,p.y,e.x,e.y));
  if(!has){const mw=mouseWorld(),a=Math.atan2(mw.y-p.y,mw.x-p.x),dd=Math.min(BAL.stepFallback.dist,Math.hypot(mw.x-p.x,mw.y-p.y));let nx=p.x,ny=p.y;
   for(let s=0;s<=dd;s+=2){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;nx=tx;ny=ty;}
   spark(p.x,p.y,'#9a7aff',10,60);p.x=nx;p.y=ny;p.iv=Math.max(p.iv,.25);spark(nx,ny,'#9a7aff',10,60);sfx('dash');
   p.ab.q=spellCd('q')*BAL.stepFallback.cd;ABPOSE={k:'blink',dur:.26,p:1,t0:time,dir:scrVec(Math.cos(a),Math.sin(a))[0]<0?-1:1};return;}}
 return _cc.apply(this,arguments);};}
// say why nothing happened
{const _h=chiHarvest;chiHarvest=function(p){const r=_h.apply(this,arguments);if(r===false)txtFx(p.x,p.y-14,'NO SEALED FOES','#f65c76');return r;};}
{const _n=kanNotes;kanNotes=function(p){const r=_n.apply(this,arguments);if(r===false)txtFx(p.x,p.y-14,'NO ECHO STORED','#ffda83');return r;};}
// THOUSAND THRUSTS trim
{const _f=NEWCAST[95];NEWCAST[95]=function(c){const n0=zones.length;const r=_f.apply(this,arguments);for(const z of zones.slice(n0))if(z.k==='flurry')z.dm*=BAL.flurry;return r;};}
if(typeof ABTXT!=='undefined'&&ABTXT['SHADOW STEP'])ABTXT['SHADOW STEP'][1]='NO FOE IN REACH: A SHORT SHADOW BLINK TOWARD THE CURSOR, HALF COOLDOWN.';
