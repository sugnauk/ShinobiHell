'use strict';
// SHINOBIDUNGEONS - rage. Some guardians (not all) fly into a rage in their last 15% of health, once every phase has
// been played. A red banner names it, the guardian glows and hits 20% harder, and it changes how it fights:
//  CHARGE - it lowers its head, a red line shows where it will go, and it charges straight through you, again and again
//           (Akagane, Kusakari, Onikuma, Kurogane)
//  FLEE   - it keeps its distance, backing away whenever you close in and firing as it goes; Kage also vanishes and
//           reappears across the arena (Tetsuo, Kage, Tamamo)
//  FRENZY - it moves and attacks much faster (Itohime)
// The Lady Hotaru, the Ronin Seven, the Abbot and the Emperor fight to the end as they are.
const RAGE={
 'AKAGANE, THE RED OX':{k:'charge',n:'BLIND FURY'},
 'KUSAKARI, THE REED HUNTER':{k:'charge',n:'THE HUNT ENDS HERE'},
 'ONIKUMA, THE JAILER':{k:'charge',n:'HE BREAKS HIS OWN CHAINS'},
 'LORD KUROGANE':{k:'charge',n:'NO RETREAT'},
 'TETSUO THE GUNSMITH':{k:'flee',n:'FALLING BACK, FIRING'},
 'KAGE, THE SHINOBI MASTER':{k:'flee',n:'INTO THE SHADOWS',blink:1},
 'TAMAMO, THE ILLUSIONIST':{k:'flee',n:'THE FOX RUNS'},
 'ITOHIME, THE WIRE WEAVER':{k:'frenzy',n:'FRENZY'}};
const RAGE_AT=.15,RAGEC='#ff3030';
function rageStart(e,D){e.rage={k:D.k,t:0,ct:1.4,st:0,sh:.8,bt:3};e.dm*=1.2;e.iv=Math.max(e.iv||0,.8);cancelAtk&&e.A&&cancelAtk(e);
 if(D.k==='frenzy'){e.spdK=(e.spdK||1)*1.45;e.spd*=1.4;}
 sfx('boss');shake=Math.max(shake,10);hitstop=Math.max(hitstop,.1);fxRing(e.x,e.y,90,RAGEC,.6);fxRing(e.x,e.y,50,'#fff',.4);spark(e.x,e.y,RAGEC,30,150);
 clearEnemyShots(true,1);phaseBanner={t:0,text:'RAGE',sub:D.n,col:RAGEC};setToast(e.name.split(',')[0]+': '+D.n,RAGEC,3);}
const rageBusy=e=>e.EV||e.ev||e.phx||e.storm>0||e.dying||e.stag>0;
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!boss||boss.dead||!boss.awake||!P)return;const e=boss,D=RAGE[e.name];if(!D)return;
 if(!e.rage){if(e.hp/e.maxhp<RAGE_AT&&!rageBusy(e)&&(typeof bossNextTh!=='function'||bossNextTh(e)==null))rageStart(e,D);return;}
 const G=e.rage;G.t+=dt;if(rageBusy(e))return;
 if(Math.random()<dt*25)particles.push({x:e.x+rnd(-e.r,e.r),y:e.y+rnd(-4,4),vx:rnd(-10,10),vy:-30,t:.4,col:Math.random()<.7?RAGEC:'#ffb0a0'});
 const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;
 if(G.k==='charge'){
  // wind-up: stop, face you, show the line; then charge until it has gone far enough or hits a wall
  if(G.st===0){G.ct-=dt;if(G.ct<=0){G.st=1;G.w=.65;G.a=Math.atan2(dy,dx);G.len=Math.min(220,d+70);cancelAtk(e);e.A=null;sfx('block');}}
  else if(G.st===1){G.w-=dt;e.A=null;e.tele=1;e.x=e.x;if(G.w<=0){G.st=2;G.go=0;e.tele=0;shake=Math.max(shake,4);sfx('dash');}}
  else{e.A=null;const sp=300*dt,nx=e.x+Math.cos(G.a)*sp,ny=e.y+Math.sin(G.a)*sp;G.go+=sp;
   if(blocked(nx,ny,e.r)||G.go>=G.len){G.st=0;G.ct=Math.max(.9,1.8-G.t*.04);shake=Math.max(shake,5);spark(e.x,e.y,'#c8a060',14,90);}else{e.x=nx;e.y=ny;}
   if(Math.random()<.6)particles.push({x:e.x+rnd(-4,4),y:e.y+rnd(-2,2),vx:0,vy:-8,t:.35,col:'#9a8a70'});
   if(P.iv<=0&&P.dash<=0&&Math.hypot(P.x-e.x,P.y-e.y)<e.r+7&&!G.hit){G.hit=1;hitPlayer(20*e.dm,e.x,e.y,{src:e,pd:25});}
   if(G.st===0)G.hit=0;}}
 else if(G.k==='flee'){
  // back away when you come close; fire fans as it goes
  if(d<110&&!e.A){steer(e,Math.atan2(-dy,-dx),e.spd*1.7,dt);}
  G.sh-=dt;if(G.sh<=0){G.sh=.85;enemyShoot(e,{cnt:3,spread:.45,sp:72,dmg:9,col:bsty(e).c},Math.atan2(dy,dx));}
  if(RAGE[e.name].blink){G.bt-=dt;if(G.bt<=0&&d<140){G.bt=3.2;const r=e.room;for(let t=0;t<30;t++){const x=(r.x+2+Math.random()*(r.w-4))*T,y=(r.y+2+Math.random()*(r.h-4))*T;
    if(!blocked(x,y,e.r+2)&&Math.hypot(x-P.x,y-P.y)>150){spark(e.x,e.y,'#30304a',18,90);fxRing(e.x,e.y,20,RAGEC,.3);e.x=x;e.y=y;cancelAtk(e);spark(x,y,'#30304a',18,90);sfx('dash');break;}}}}}
 // frenzy: the speed is set when it starts; it also throws quick fans between attacks
 else if(G.k==='frenzy'){G.sh-=dt;if(G.sh<=0){G.sh=1.4;enemyShoot(e,{cnt:5,spread:.9,sp:80,dmg:9,col:bsty(e).c},Math.atan2(dy,dx));}}};}
// leaving the arena resets the guardian, rage included
{const _br=bossReset;bossReset=function(e){const r=_br.apply(this,arguments);if(e&&e.rage){if(e.rage.k==='frenzy'){e.spdK/=1.45;e.spd/=1.4;}e.dm/=1.2;e.rage=null;e.tele=0;}return r;};}
// the red glow, and the charge line on the floor
{const _de=drawEnemy;drawEnemy=function(e){if(e&&e.boss&&e.rage&&!e.dead){const X=sx(e.x,e.y),Y=sy(e.x,e.y),p=.5+.5*Math.sin(time*12);ctx.globalAlpha=.18+.14*p;ctx.fillStyle=RAGEC;ctx.beginPath();ctx.ellipse(X,Y,e.r*2.2+p*3,e.r*1.1+p*2,0,0,TAU);ctx.fill();ctx.globalAlpha=1;}
 return _de.apply(this,arguments);};}
{const _bf=drawBossFloor;drawBossFloor=function(){_bf.apply(this,arguments);const e=boss;if(!e||e.dead||!e.rage||e.rage.k!=='charge'||e.rage.st!==1)return;const G=e.rage;
 const n=Math.round(G.len/6),bl=Math.floor(time*10)%2;for(let i=0;i<n;i++){const wx=e.x+Math.cos(G.a)*i*6,wy=e.y+Math.sin(G.a)*i*6;ctx.globalAlpha=.35+.35*(1-i/n);ctx.fillStyle=bl?RAGEC:'#ff8080';ctx.fillRect(Math.round(sx(wx,wy))-2,Math.round(sy(wx,wy))-1,4,2);}ctx.globalAlpha=1;};}
