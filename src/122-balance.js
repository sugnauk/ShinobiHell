'use strict';
// ===== BALANCE PASS (measured with a headless DPS sim against a training dummy) =====
// 1. WEAPONS: the shorter the reach, the more damage. Each weapon's reach was measured (the furthest distance its basic
//    attack still lands), and its value = single-target DPS, plus a little credit for hitting a pack (a weapon that hits all
//    five packed foes counts 1.32x). Target value: 260 at melee reach (50) falling to ~150 at bow range (160): 260*(50/reach)^0.48.
// 2. CLASSES: with its signature weapon and its abilities, each class aims at a damage target that trades off against its
//    survivability - target ~ 1/sqrt(HP multiplier) x (1 - 3% per DEF) x (melee 1.12 / ranged 0.95) - averaged to today's
//    overall damage so the game as a whole is not stronger or weaker.
const WTUNE={"STAFF":1.15,"WAR FAN":2.25,"CENSER":1.38,"KATANA":1.0,"NAGINATA":1.35,"ODACHI":1.33,"YUMI":0.76,"HANKYU":0.85,"REPEATER":0.72,"KUNAI":0.56,"SHURIKEN":0.86,"KUSARIGAMA":1.26,"OFUDA":1.22,"SUZU BELL":2.57,"SPIRIT MIRROR":0.92,"TANEGASHIMA":1.04,"YARI":0.72};
const CTUNE={"wizard":1.09,"archer":1.63,"samurai":0.8,"shinobi":1.08,"onmyoji":0.88,"gunner":0.9,"lancer":0.85};
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(e&&e!==P&&!(o&&o.foe)&&R){const src=o&&o.src!==undefined?o.src:castSrc;
  if(src==='m'&&R.eq&&R.eq.wpn){const t=WTUNE[wtName(R.eq.wpn)];if(t)dmg*=t;}
  if(src||castSrc)dmg*=CTUNE[CLS().k]||1;}
 return _h.call(this,e,dmg,pd,o);};}

// 3. BOSS HEALTH BY STAGE: a bot carrying everything a thorough player collects by each boss (three relics a stage, the
//    best gear and enchants that drop at that depth, scroll upgrades) killed the late bosses in about a minute - player
//    power outgrows them. The bot never stops attacking; a real player spends a share of every fight dodging, so the bot's
//    kill time is aimed at ~0.65x the design length (Akagane ~70s, ten seconds more each guardian, the Emperor ~3 minutes).
//    The invulnerable events, phase changes and the Emperor's last stand are fixed time, so the late bosses need far more
//    health for the fight itself to lengthen. Lady Hotaru ran long and comes down.
const BOSS_HPT=[.85,1.0,1.1,.45,2.4,1.8,2.9,2.7,1.0,3.5,7.6,8.6];
{const _mb=mkBoss;mkBoss=function(di){const e=_mb.apply(this,arguments);const f=BOSS_HPT[di]||1;e.hp*=f;e.maxhp*=f;e.di=di;return e;};}

// 4. THE DAMAGE CHECK: every guardian enrages if the fight runs past 1.6x its target length. A well-built character finishes
//    with time to spare; one that skipped its upgrades (or fights carelessly) faces a faster, harder-hitting, denser boss.
//    Time only runs while you can actually hurt it (not during a survival event or the phase change). The timer is shown
//    under the health bar, red in its last 15 seconds.
const ENRAGE_AT=di=>Math.round((di>=11?180:70+10*di)*1.6);
function bossActive(e){return e.awake&&!e.dead&&!e.phx&&!(e.EV&&(e.EV.survival||e.storm>0))&&!(e.iv>5);}
{const _u=updEnemy;updEnemy=function(e,dt){_u(e,dt);if(!e.boss||e.dead||!e.awake||!BKIT[e.name])return;
  if(bossActive(e))e.fightClock=(e.fightClock||0)+dt;
  if(!e.enr&&e.fightClock>=ENRAGE_AT(e.di)){e.enr=1;e.dm*=1.35;e.spdK=(e.spdK||1)*1.3;sfx('boss');shake=Math.max(shake,8);flashT=Math.max(flashT,.2);
   fxRing(e.x,e.y,90,'#ff3030',.7);phaseBanner={t:0,text:'ENRAGED',sub:'FINISH IT BEFORE IT FINISHES YOU','col':'#ff4040'};}
  if(e.enr&&Math.random()<dt*14)particles.push({x:e.x+rnd(-e.r,e.r),y:e.y+rnd(-5,5),vx:0,vy:-34,t:.45,col:Math.random()<.5?'#ff3030':'#ffb040'});};}
// enraged guardians fire their barrages faster
{const _bt=barrageTick;barrageTick=function(e,K,dt){if(e.enr&&e.bgT!=null&&e.bgT>0)e.bgT-=dt*.45;return _bt.apply(this,arguments);};}
// a guardian that resets (you left the arena) forgets the clock
{const _br=bossReset;bossReset=function(e){e.fightClock=0;if(e.enr){e.enr=0;}return _br.apply(this,arguments);};}
// the timer under the health bar
{const _hud=drawHUD;drawHUD=function(){_hud();const b=boss;if(!b||!b.awake||b.dead||!BKIT[b.name]||!b.fightClock)return;const {x,y,w}=bossBarBox();
  const left=Math.max(0,ENRAGE_AT(b.di)-b.fightClock),m=Math.floor(left/60),s=String(Math.floor(left%60)).padStart(2,'0');
  const str=b.enr?'ENRAGED':'ENRAGE '+m+':'+s,col=b.enr?(Math.floor(time*6)%2?'#ff4040':'#ffb040'):left<15?(Math.floor(time*4)%2?'#ff5050':'#ff9070'):'#b8a8b8';ctx.fillStyle='rgba(10,6,14,.9)';ctx.fillRect(x+w-txtW(str)-4,y+8,txtW(str)+4,8);txt(str,x+w-txtW(str)-2,y+9,col);};}
