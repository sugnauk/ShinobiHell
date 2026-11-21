'use strict';
// HELL OF THE EMPEROR - THE MOTH QUEEN, a mini-boss. She haunts one room in the middle of the Burning Castle Town (stage IV):
// a court lady with atlas-moth wings who fills the room with wing dust. Half her health gone, her wings blaze and she speeds
// up. Her hoard has a 10% chance to contain legendary gear. Her art lives in 90-bosses.js (BART['THE MOTH QUEEN']).
ET.mothqueen={n:'THE MOTH QUEEN',desc:'A MINI-BOSS OF THE BURNING TOWN. HER WINGS SHED BURNING DUST',hp:400,spd:46,pos:520,r:9,ai:'dummy',rng:0,wl:0,fly:true,atks:[]};
const MOTH={stage:3,
 spr:half=>{const k=half?'h':'n';if(!MOTH[k]){ARTHURT=!!half;try{MOTH[k]=bossArt('THE MOTH QUEEN');}finally{ARTHURT=false;}}return MOTH[k];},
 // the room nearest halfway between the start and the boss arena
 pickRoom(){const st=map.startRoom,br=map.bossRoom,c=r=>({x:r.x+r.w/2,y:r.y+r.h/2}),a=c(st),b=c(br),mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  let best=null,bd=1e9;for(const r of map.rooms){if(r===st||r===br||r.k==='boss'||r.k==='start'||r.type==='shop'||r.w<10||r.h<10)continue;const d=Math.hypot(c(r).x-mid.x,c(r).y-mid.y);if(d<bd){bd=d;best=r;}}return best;},
 spawn(){const r=MOTH.pickRoom();if(!r)return;for(const e of enemies)if(e.room===r&&!e.prop)e.dead=true;enemies=enemies.filter(e=>!e.dead);
  const e=mkEnemy('mothqueen',(r.x+r.w/2)*T,(r.y+r.h/2)*T,r,R.di);const hp=BOSS[MOTH.stage].hp*BOSSHP*.3*DF().hp*(R.ngp?1.25:1);Object.assign(e,{hp,maxhp:hp,mini:1,sprOv:MOTH.spr(0),phase:1,label:null,elite:null,at:2,bt:1,k:0,ang:0});enemies.push(e);MOTH.e=e;},
 inRoom(e){const r=e.room;return P.x>r.x*T&&P.x<(r.x+r.w)*T&&P.y>r.y*T&&P.y<(r.y+r.h)*T;},
};
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld(di);MOTH.e=null;if(di===MOTH.stage&&R&&!R.training)MOTH.spawn();return r;};}
// her own little director: drift around you, a constant dust layer, and a named attack every few seconds
{const _ue=updEnemy;updEnemy=function(e,dt){_ue(e,dt);if(!e.mini||e.dead||!e.awake||e.stag>0||e.stun>0||(e.st&&e.st.frozen>0))return;
  if(!e.met){e.met=1;sfx('boss');setToast('THE MOTH QUEEN DESCENDS','#ff9040',3);fxRing(e.x,e.y,60,'#ff9040',.5);}
  const k=e.half?1.3:1,a=aimAt(e);tickBarrage(e,dt);
  if(!e.half&&e.hp<e.maxhp*.5){e.half=1;e.phase=2;e.sprOv=MOTH.spr(1);for(const q of projs)if(q.from==='e'&&q.own===e)q.dead=true;impact(e.x,e.y,'#ff9040',9,true);sfx('break');txtFx(e.x,e.y-16,'HER WINGS BLAZE','#ff9040',2);e.iv=1;}
  // flutter round you at a distance, bobbing
  e.ang+=dt*.6;const tx=P.x+Math.cos(e.ang)*100,ty=P.y+Math.sin(e.ang)*100,p=freeSpot(e,tx,ty,e.r),da=Math.atan2(p.y-e.y,p.x-e.x),dd=Math.hypot(p.x-e.x,p.y-e.y);if(dd>4)steer(e,da,Math.min(dd/dt,e.spd*1.4*k),dt);
  // the dust layer
  e.bt-=dt;if(e.bt<=0){e.bt=(e.half?.45:.6)/(DF().bh||1);e.k++;const L=e.half?[{pat:'flower',cnt:22,sp:52,st:'wave',col:'#f0a0e0'},{cnt:7,spread:.9,sp:95,col:BC.aim,burst:2,gap:.18},{pat:'gapring',cnt:30,gw:.4,sp:56,col:'#ff9040',burst:2,gap:.3},{pat:'spiral',arms:6,spin:.4,sp:60,st:'wave',col:'#c8a0f0',burst:8,gap:.09}]
   :[{pat:'flower',cnt:18,sp:50,st:'wave',col:'#f0a0e0'},{cnt:5,spread:.7,sp:90,col:BC.aim},{pat:'gapring',cnt:24,gw:.45,sp:52,col:'#ff9040'}];if(eShots()<220)bossBarrage(e,Object.assign({dmg:9},L[e.k%L.length]));}
  // a named attack every 3.5s (2.6s blazing)
  e.at-=dt;if(e.at<=0){e.at=(e.half?2.6:3.5);const n=['dust','gaze','swarm','scales'][Math.floor(Math.random()*4)];e.act0=n;
   if(n==='dust'){e.tele=1;say(e,'',null,.1);for(let i=0;i<14;i++)bsh(e,e.x,e.y,0,0,8,{st:'hang',wait:.3+i*.12,ha:i*.45,csp:58,then:'wave',wa:40,wf:6,col:'#f0a0e0',r:3});for(let i=0;i<14;i++)bsh(e,e.x,e.y,0,0,8,{st:'hang',wait:.3+i*.12,ha:-i*.45+Math.PI,csp:58,then:'wave',wa:40,wf:6,col:'#c8a0f0',r:3});}
   if(n==='gaze'){for(let r=0;r<(e.half?3:2);r++)setTimeout(()=>{if(!e.dead)bring(e,e.x,e.y,26,54,9,{st:'curve',curve:r%2?.5:-.5,col:'#ffe080',r:3},r*.12,aimAt(e)+r,.4);},r*350);mark({k:'c',x:e.x,y:e.y,r:22,t:.4,col:'#ffe080',quiet:1});}
   if(n==='swarm'){for(let i=0;i<(e.half?8:6);i++)bsh(e,e.x,e.y,a+(i-2.5)*.4,70,9,{spr:'wisp',st:'seek',turn:1.3,seekT:1.8,col:'#f0e0ff',r:3,life:5});sfx('tool');}
   if(n==='scales'){for(let i=0;i<(e.half?8:6);i++){const an=i/6*TAU+Math.random(),r=i?rnd(25,70):0;mark({k:'c',x:P.x+Math.cos(an)*r,y:P.y+Math.sin(an)*r,r:15,t:.9+i*.1,dmg:12*e.dm,col:'#ff9040',src:e});}}}
  if(Math.random()<dt*10)particles.push({x:e.x+rnd(-14,14),y:e.y+rnd(-6,6),vx:rnd(-10,10),vy:-20,t:.6,col:e.half?'#ffb040':'#f0d0f0'});};}
// her death: a miniboss bag and a score bonus
{const _k=killE;killE=function(e){const was=e.mini&&!e.dead;_k(e);if(was&&e.dead){for(const q of projs)if(q.own===e)q.dead=true;dropBag(e.x+12,e.y+12,minibossBag(),true);addScore(2500,e.x,e.y,'#ff9040');setToast('THE MOTH QUEEN FALLS','#ff9040',3);MOTH.e=null;}};}
// a health bar across the top while you fight her
{const _h=drawHUD;drawHUD=function(){_h();const e=MOTH.e;if(!e||e.dead||!e.awake||!MOTH.inRoom(e))return;const w=120,x=Math.round((W-w)/2);txt('THE MOTH QUEEN',x+Math.round((w-txtW('THE MOTH QUEEN'))/2),14,'#ff9040');bar(x,21,w,4,e.hp/e.maxhp,'#c84a90','#2a1030');};}
