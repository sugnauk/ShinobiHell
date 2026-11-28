'use strict';
// ===== BALANCE PASS (measured with a headless DPS sim against a training dummy) =====
// 1. WEAPONS: the shorter the reach, the more damage. Each weapon's reach was measured (the furthest distance its basic
//    attack still lands), and its value = single-target DPS, plus a little credit for hitting a pack (a weapon that hits all
//    five packed foes counts 1.32x). Target value: 260 at melee reach (50) falling to ~150 at bow range (160): 260*(50/reach)^0.48.
// 2. CLASSES: compare full attack rotations and moving guardian fights. Close-range kits have a modest edge
//    when they stay on target. Class tuning applies to abilities, while basic attacks use weapon tuning.
const WTUNE={"KATANA":0.89,"ODACHI":1.21,"SUZU BELL":2.57,"WAR FAN":2.21,"NAGINATA":1.18,"KUSARIGAMA":1.28,"STAFF":1.38,"HANKYU":1.11,"YARI":0.60,"YUMI":0.76,"CENSER":1.46,"REPEATER":0.82,"KUNAI":0.57,"SHURIKEN":0.91,"OFUDA":1.16,"SPIRIT MIRROR":0.94,"TANEGASHIMA":1.25,
 "SHADOW KATANA":.80,"HAND WRAPS":.60};
const CTUNE={
 wizard:.88,archer:1.72,samurai:1.02,shinobi:.67,onmyoji:.80,gunner:1.25,lancer:.61,
 sumo:.63,marionettist:1.48,tengu:1.04,kagura:1.10,bloodoracle:1.42,bellwarden:1.06
};
function basicAttackPower(){
 const weapon=R.eq?.wpn;
 // Apply weapon tuning at the cast so switching weapons cannot change a shot already in flight.
 return S.weaponAtk*(weapon?(WTUNE[wtName(weapon)]??1):1);
}
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(e&&e!==P&&!o?.foe&&R){
  const src=o?.src!==undefined?o.src:castSrc;
  const tuned=src||castSrc;
  if(tuned&&tuned!=='m')dmg*=CTUNE[CLS().k]||1;}
 return _h.call(this,e,dmg,pd,o);};}

// 3. BOSS HEALTH: keep each encounter's authored HP tuning, including route variants and Abyss remixes.
const BOSS_HPT=[.7,1.3,1.1,.35,2.4,1.8,2.9,2.7,1.0,3.5,7.6,8.6];
function bossHealthScale(di,pro){
 if(pro)return 1.5;
 if(di<4)return 1.85;
 return di<=CAMPAIGN_END?2:1.6;
}
const MINIBOSS_HEALTH=1.5;
{const _mb=mkBoss;mkBoss=function(di){
 const e=_mb.apply(this,arguments),f=(BOSS_HPT[di]||1)*bossHealthScale(di,PRO_ON);
 e.hp*=f;e.maxhp*=f;e.di=di;
 return e;
};}

// 4. THE DAMAGE CHECK: every guardian enrages if the fight runs past 1.6x its target length. A well-built character finishes
//    with time to spare; one that skipped its upgrades (or fights carelessly) faces a faster, harder-hitting, denser boss.
//    Time only runs while you can actually hurt it (not during a survival event or the phase change). The timer is shown
//    under the health bar, red in its last 15 seconds.
const ENRAGE_AT=e=>Math.round((e.di>=11?180:70+10*e.di)*1.6*bossHealthScale(e.di,e.pro));
function bossActive(e){return e.awake&&!e.dead&&!e.phx&&!(e.EV&&(e.EV.survival||e.storm>0))&&!(e.iv>5);}
{const _u=updEnemy;updEnemy=function(e,dt){_u(e,dt);if(!e.boss||e.dead||!e.awake||!BKIT[e.name])return;
  if(bossActive(e))e.fightClock=(e.fightClock||0)+dt;
  if(!e.enr&&e.fightClock>=ENRAGE_AT(e)){e.enr=1;e.dm*=1.35;e.spdK=(e.spdK||1)*1.3;sfx('boss');shake=Math.max(shake,8);flashT=Math.max(flashT,.2);
   fxRing(e.x,e.y,90,'#ff3030',.7);phaseBanner={t:0,text:'ENRAGED',sub:'FINISH IT BEFORE IT FINISHES YOU','col':'#ff4040'};}
  if(e.enr&&Math.random()<dt*14)particles.push({x:e.x+rnd(-e.r,e.r),y:e.y+rnd(-5,5),vx:0,vy:-34,t:.45,col:Math.random()<.5?'#ff3030':'#ffb040'});};}
// enraged guardians fire their barrages faster
{const _bt=barrageTick;barrageTick=function(e,K,dt){if(e.enr&&e.bgT!=null&&e.bgT>0)e.bgT-=dt*.45;return _bt.apply(this,arguments);};}
// a guardian that resets (you left the arena) forgets the clock
{const _br=bossReset;bossReset=function(e){e.fightClock=0;if(e.enr){e.enr=0;}return _br.apply(this,arguments);};}
// the timer under the health bar
{const _hud=drawHUD;drawHUD=function(){_hud();const b=boss;if(!b||!b.awake||b.dead||!BKIT[b.name]||!b.fightClock)return;const {x,y,w}=bossBarBox();
  const left=Math.max(0,ENRAGE_AT(b)-b.fightClock),m=Math.floor(left/60),s=String(Math.floor(left%60)).padStart(2,'0');
  const str=b.enr?'ENRAGED':'ENRAGE '+m+':'+s,col=b.enr?(Math.floor(time*6)%2?'#ff4040':'#ffb040'):left<15?(Math.floor(time*4)%2?'#ff5050':'#ff9070'):'#b8a8b8';ctx.fillStyle='rgba(10,6,14,.9)';ctx.fillRect(x+w-txtW(str)-4,y+8,txtW(str)+4,8);txt(str,x+w-txtW(str)-2,y+9,col);};}

// 5. ABILITIES SCALE EVENLY: measured from stage I to XII with a full-upgrade loadout, Q, F and R damage grew 17-48x while
//    the basic attack and the RMB heavy grew 5-10x, so by the end the ultimate was everything and the basic attack an
//    afterthought. Every damage source now follows the same curve as a character's overall damage: each slot gets a
//    multiplier that moves smoothly from 1 at stage I to the value below at stage XII.
const SLOTSCALE={"m":2.234,"h":1.729,"q":0.55,"f":0.841,"e":0.357};
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(e&&e!==P&&R){const src=o&&o.src!==undefined?o.src:castSrc,m=SLOTSCALE[src];if(m)dmg*=Math.pow(m,Math.min(11,R.di||0)/11);}return _h.call(this,e,dmg,pd,o);};}
