'use strict';
// SHINOBIDUNGEONS - the tutorial, cut to about a minute of action. The old ten trials taught everything up front
// (potions, loot, shrines, boss events, the guide) and took several minutes of reading. A new player now gets three
// fights and a payoff, one key at a time, with Master Kaito shouting from the side:
//  1. AMBUSH!       - straw bandits rush you from the edges: walk, aim, LMB. Six go down in a shower of straw.
//  2. ARROW STORM   - a turret looses volleys: dash through two of them (a perfect dodge counts at once).
//  3. THE STRAW OGRE - a hulking dummy with a health bar lumbers at you and slams the ground (red circles!). RMB and
//                     Q W F E unlock, and their cooldowns come back almost at once: unleash everything.
//  4. JACKPOT       - the ogre bursts into a treasure bag and the portal opens: grab it all and start the march.
// Everything else is taught when you first meet it in the real game, with one-time tips (potions, bags, shops,
// shrines, curse altars, stuns, elites, guardians and their invulnerable events). Nothing hurts in the tutorial, and
// N still skips it.
const QS_DUMMY_HP=()=>Math.max(8,S.atk*1.4);
LESSONS.length=0;
LESSONS.push(
 {t:'AMBUSH!',l:()=>['WALK '+[kN('up'),kN('left'),kN('down'),kN('right')].join('')+', AIM WITH THE MOUSE, LMB ATTACKS.','CUT DOWN THE STRAW BANDITS!'],unlock:['m'],need:6,
  say:'BANDITS! ...STRAW ONES. STILL - CUT THEM DOWN!',
  go:()=>{const T=R.training;T.hd=[];T.ht=.2;T.spawned=0;},
  tick:(dt,TR)=>{TR.c+=tKills(TR,'hd',e=>{TR.streak=(TR.streak||0)+1;txtFx(e.x,e.y-12,TR.streak>2?TR.streak+' IN A ROW!':'SHRED!','#ffb060',1);sfx('coin');shake=Math.max(shake,3);hitstop=Math.max(hitstop,.04);
    for(let i=0;i<10;i++)particles.push({x:e.x,y:e.y-6,vx:rnd(-70,70),vy:rnd(-80,-10),t:.6,col:pick(['#d8b060','#a07a40','#f0d890'])});});
   TR.ht-=dt;const alive=TR.hd.filter(e=>!e.dead).length;
   if(TR.ht<=0&&alive<3&&TR.c+alive<6){TR.ht=.5;const r=tRoom(),side=TR.spawned%2,y=(r.y+3+Math.random()*(r.h-6))*T,x=(side?r.x+r.w-2:r.x+2)*T;TR.spawned++;
    const e=tTarget(x,y,{horde:1,hp:QS_DUMMY_HP(),maxhp:QS_DUMMY_HP()});TR.hd.push(e);}
   for(const e of TR.hd)if(!e.dead){const a=Math.atan2(P.y-e.y,P.x-e.x);if(Math.hypot(P.x-e.x,P.y-e.y)>16)move(e,Math.cos(a)*30*dt,Math.sin(a)*30*dt,5);}}},
 {t:'ARROW STORM',l:()=>[kN('dash')+' DASHES - NOTHING CAN TOUCH YOU MID-DASH.','DASH THROUGH 2 VOLLEYS. TIME IT AS THEY ARRIVE FOR A PERFECT DODGE!'],unlock:['d'],need:2,ev:'dodge',
  say:'ARCHERS! DO NOT RUN FROM THE ARROWS - DASH THROUGH THEM!',
  go:()=>{tClear();tTurret(1.2,{cnt:5,spread:.7,sp:64,dmg:3,pd:2,col:'#fd4'});},
  tick:(dt,T)=>{const t=enemies.find(e=>e.type==='turret'&&!e.dead);if(t&&Math.hypot(t.x-P.x,t.y-P.y)>170)tTurret(1.2,t.tPat);},
  done:T=>T.c>=2||!!(T.ev&&T.ev.perfect)},
 {t:'THE STRAW OGRE',l:()=>['HOLD RMB TO CHARGE A HEAVY BLOW.   '+[kN('q'),kN('w'),kN('f'),kN('e')].join(' ')+': YOUR ABILITIES.','THEY RECHARGE FAST HERE - UNLEASH EVERYTHING! RED CIRCLES: MOVE!'],unlock:['h','q','w','f','e'],need:1,
  say:'NOW THE BIG ONE. GIVE IT EVERYTHING YOU HAVE!',
  go:()=>{tClear();const T=R.training;T.slots=new Set();const p=tRandSpot(80,110),hp=Math.max(900,S.atk*190);
   const e=tTarget(p.x,p.y,{ogre:1,label:'STRAW OGRE',labelC:'#ffb060',hp,maxhp:hp,maxPosture:70,r:12});T.og=[e];T.slam=2.2;fxRing(p.x,p.y,50,'#ffb060',.6);sfx('boss');shake=Math.max(shake,6);},
  tick:(dt,T)=>{const e=T.og&&T.og[0];
   T.c+=tKills(T,'og',o=>{const x=o.x,y=o.y;pickups.push({x,y,k:'bag',tier:6,items:[mkGear('wpn',1,false,2),{t:'ench',k:'fire'},{t:'hp'}],t:0,z:2,vz:120});
    for(let i=0;i<16;i++)dropPickup(x,y,'sen',2);sfx('rare');sfx('break');shake=Math.max(shake,10);hitstop=Math.max(hitstop,.15);flashT=Math.max(flashT,.12);
    fxRing(x,y,70,'#ffd040',.7);fxRing(x,y,40,'#fff',.4);spark(x,y,'#ffd040',40,150);
    for(let i=0;i<40;i++)particles.push({x,y:y-10,vx:rnd(-120,120),vy:rnd(-150,-20),t:1,col:pick(['#d8b060','#a07a40','#f0d890','#ffd040'])});txtFx(x,y-20,'JACKPOT!','#ffd040',2);});
   if(!e||e.dead)return;const d=Math.hypot(P.x-e.x,P.y-e.y);
   if(d>22){const a=Math.atan2(P.y-e.y,P.x-e.x);move(e,Math.cos(a)*16*dt,Math.sin(a)*16*dt,10);}
   // the slam: red circles where you stand (harmless here, but you learn to step out of them)
   T.slam-=dt;if(T.slam<=0){T.slam=2.6;txtFx(e.x,e.y-26,'SLAM!','#ff6040');for(let i=0;i<3;i++){const a=Math.random()*TAU,r=i?rnd(14,30):0;dh.push({x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,r:16,t:1.1,dur:1.1,dmg:3,col:'#f55'});}}}},
 {t:'THE ROAD AHEAD',l:()=>['STAND ON THE TREASURE BAG: '+kN('use')+' TAKES IT ALL.','THEN STEP INTO THE PORTAL AND PRESS '+kN('use')+'. THE MARCH BEGINS!'],
  say:'HA! NOT BAD AT ALL. NOW GO - THE EMPEROR WILL NOT WAIT.',
  go:()=>{const p=tRandSpot(70,100);portal={x:p.x,y:p.y,t:0,pending:false};tClear();dh=[];const T=R.training,sec=T.total||0;T.stars=sec<75?3:sec<120?2:1;
   if(!meta.trialsReward){meta.trialsReward=1;meta.sen=(meta.sen||0)+50;saveMeta();T.paid=1;}},done:()=>false});
// the ogre is drawn twice the size of a dummy, with a health bar
{const _so=sprOf;sprOf=function(e){const s=_so.apply(this,arguments);if(e&&e.ogre&&s){if(!s._ogre)s._ogre=Object.assign({},s,{sc:(s.sc||1)*2,_av:null});return s._ogre;}return s;};}
{const _de=drawEnemy;drawEnemy=function(e){const r=_de.apply(this,arguments);if(e&&e.ogre&&!e.dead){const X=sx(e.x,e.y),Y=sy(e.x,e.y)-52;bar(X-20,Y,40,3,e.hp/e.maxhp,'#ffb060','#3a2010');}return r;};}
// the ribbon counts the four abilities on the ogre trial
{const _dt=drawTraining;drawTraining=function(){_dt.apply(this,arguments);const T=R&&R.training,L=T&&LESSONS[T.i];if(!L||L.t!=='THE STRAW OGRE'||!T.slots||T.wait>0)return;
 const head='TRIAL '+(T.i+1)+'/'+LESSONS.length,lines=L.l(),w=Math.min(W-16,Math.max(txtW(head)+txtW(L.t)*2+30,...lines.map(q=>txtW(q)+12))),x=Math.round((W-w)/2);
 const s='ABILITIES '+T.slots.size+'/4';txt(s,x+w-6-txtW(s),8,T.slots.size>=4?'#80ff90':'#c8c0b0');};}
// ---- the lessons that left the tutorial come back as one-time tips when you first meet them
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!P||!R||R.training||typeof tip!=='function')return;
 if(props.some(p=>p.k==='altar'&&p.curse&&!p.used&&Math.hypot(p.x-P.x,p.y-P.y)<40))tip('curse',['A CURSE ALTAR','IT OFFERS POWER WITH A PRICE THAT LASTS ALL RUN. READ IT BEFORE YOU ACCEPT']);
 if(boss&&!boss.dead&&(boss.EV||boss.ev||boss.storm>0||boss.phx))tip('event',['THE GUARDIAN CANNOT BE HURT RIGHT NOW','SURVIVE UNTIL THE BAR EMPTIES - THEN STRIKE BACK']);};}
