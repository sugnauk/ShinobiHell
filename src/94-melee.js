'use strict';
// HELL OF THE EMPEROR - melee survival in a bullet hell, and the starting characters.
// The Samurai and Shinobi fight up close, where the bullets are thickest. To survive there:
//  - every blade strike (combo swings, cleaves, lunges) cuts up to 5 enemy bullets it passes through (6 a second at most); every 4 cut heal 1% max HP
//  - 30% less damage from bullets
//  - a 40% longer untouchable window on the dash
//  - blade hits heal 0.5% max HP each (at most 4% a second)
const MELEE=()=>{const k=CLS().k;return k==='samurai'||k==='shinobi'||k==='lancer';};
// each strike cuts at most 5 bullets, nearest first, from a budget of 6 a second: it opens a path through a pattern, it is not a wall
function bladeCut(test){if(!P||!R||!MELEE())return;const hit=[];for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;if(test(q))hit.push(q);}
 hit.sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y));const now=R.time;P.cutBud=Math.min(6,(P.cutBud==null?6:P.cutBud)+(now-(P.cutT||now))*6);P.cutT=now;const take=Math.min(5,Math.floor(P.cutBud));P.cutBud-=take;let n=0;for(const q of hit.slice(0,take)){q.dead=true;n++;spark(q.x,q.y,'#e8eef6',3,50);}
 if(!n)return;P.cutN=(P.cutN||0)+n;addScore(15*n);while(P.cutN>=4){P.cutN-=4;P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.01);}
 if(n>=3){txtFx(P.x,P.y-14,'CUT '+n,'#e8eef6');tone(1600,.05,'triangle',.03,-600);}}
// blade shapes: the same cone or line that hits foes also cuts bullets (a little wider, so a swing feels generous)
{const _ch=coneHit;coneHit=function(x,y,a,range,arc,fn){_ch(x,y,a,range,arc,fn);if(P&&Math.hypot(x-P.x,y-P.y)<4)bladeCut(q=>{const d=Math.hypot(q.x-x,q.y-y);return d<range+6&&(d<8||Math.abs(angDiff(Math.atan2(q.y-y,q.x-x),a))<arc/2+.15);});};}
{const _lh=lineHit;lineHit=function(x,y,a,len,wid,fn){_lh(x,y,a,len,wid,fn);bladeCut(q=>{const dx=q.x-x,dy=q.y-y,u=dx*Math.cos(a)+dy*Math.sin(a),v=-dx*Math.sin(a)+dy*Math.cos(a);return u>-6&&u<len+6&&Math.abs(v)<wid/2+6;});};}
// tougher against bullets
{const _hp=hitPlayer;hitPlayer=function(raw,sx2,sy2,o){if(o&&o.bullet&&R&&MELEE())raw*=.7;return _hp(raw,sx2,sy2,o);};}
// a longer dash dodge
// longer reach for everyone: every projectile, beam and arc that scales with range (+35% base)
{const _cs=calcStats;calcStats=function(){const s=_cs();s.rangeM=(s.rangeM||0)+.35;if(meta&&CLASSES&&MELEE()&&s.dashIv)s.dashIv*=1.4;return s;};}
// blade hits mend you
{const _he=hurtE;hurtE=function(e,dmg,pd,o){const r=_he(e,dmg,pd,o);if(o&&o.slash&&P&&R&&MELEE()&&!e.prop){const now=R.time;if(now-(P.lsW||0)>1){P.lsW=now;P.lsN=0;}if((P.lsN||0)<.04){P.lsN=(P.lsN||0)+.005;P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.005);}}return r;};}
// the Wizard and Archer are the two starting characters (the class list was reordered: old saves keep their class)
{if(!meta.clsV2){const swap=i=>i===1?2:i===2?1:i;meta.cls=swap(meta.cls||0);try{const k='shinobiDungeonsRun',s=JSON.parse(localStorage.getItem(k));if(s&&s.cls!=null){s.cls=swap(s.cls);localStorage.setItem(k,JSON.stringify(s));}}catch(e){}
  meta.clsV2=1;if((meta.cls||0)>=(meta.unlocked||2))meta.cls=0;saveMeta();}}
