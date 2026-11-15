'use strict';
// HELL OF THE EMPEROR - older scripted boss fights and props (part of the former game.js; files load in numeric order, see index.html)
// ================= SCRIPTED BOSS FIGHTS =================
// A boss in BKIT runs its own fight: two events (at 66% and 33% HP) that are a SURVIVAL phase, a MINION wave
// (the boss is shielded until its guard is beaten) or BOTH; a desperation move near death; its own movement modes
// (BMODEFN), bullet styles and projectile sprites; and an arena it reshapes and interacts with.
const BKIT={},BMODEFN={};
function rebuildVis(m){const t=m.t,vis=m.vis;vis.fill(0);for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(t[i])continue;let near=false;for(let j=-1;j<=1&&!near;j++)for(let k=-1;k<=1;k++){const xx=x+k,yy=y+j;if(xx>=0&&yy>=0&&xx<MW&&yy<MH&&t[yy*MW+xx]){near=true;break;}}if(near)vis[i]=(y+1<MH&&t[i+MW])?2:1;}
 m.liqList=[];for(let i=0;i<MW*MH;i++)if(m.liq[i])m.liqList.push(i);}
const rcen=r=>({x:(r.x+r.w/2)*T,y:(r.y+r.h/2)*T});
const solidBlock=(m,x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)m.t[j*MW+i]=0;};
const liqPool=(m,cx,cy,rx,ry,v)=>{for(let j=-ry;j<=ry;j++)for(let i=-rx;i<=rx;i++)if((i/rx)**2+(j/ry)**2<=1){const k=(cy+j)*MW+cx+i;if(m.t[k])m.liq[k]=v;}};
function propFoe(type,x,y,room,o){const e=mkEnemy(type,x,y,room,R.di);Object.assign(e,{prop:true,awake:true},o||{});enemies.push(e);return e;}
function spawnMin(e,type,n,o){const r=e.room,out=[];for(let i=0;i<n;i++){let s,k=0;do{s=spotIn(r);k++;}while(Math.hypot(s.x-P.x,s.y-P.y)<70&&k<25);
  const m=mkEnemy(type,s.x,s.y,r,R.di);m.awake=true;m.minion=true;Object.assign(m,o||{});enemies.push(m);out.push(m);spark(s.x,s.y,'#f55',10,70);fxRing(s.x,s.y,14,'#f55',.3);}return out;}
const evName=e=>e.ev?e.ev.name:'';
function bossKitTick(e,dt,d){const K=BKIT[e.name];
 if(!e.kitOn){e.kitOn=1;if(K.init)K.init(e);}
 if(K.squad)return K.squadTick(e,dt,d);
 const f=e.hp/e.maxhp;
 if(!e.ev){if(e.phase===1&&f<.66)bossEvent(e,0);else if(e.phase===2&&f<.33)bossEvent(e,1);
  else if(!e.desp&&f<.12&&K.desperate){e.desp=1;txtFx(e.x,e.y-12,K.despName,'#ff4040',2);setToast(e.name+': '+K.despName,'#ff4040',2.5);sfx('boss');shake=Math.max(shake,6);K.desperate(e);}}
 e.lastPh=e.phase; // the generic survival phases never trigger for a scripted boss
 if(e.ev){if(K.tick)K.tick(e,dt,d,true);evTick(e,dt);return true;}
 if(K.tick&&K.tick(e,dt,d,false)===true)return true;
 return false;}
function bossEvent(e,i){const K=BKIT[e.name],ev=K.events[i],c=bsty(e).c;e.phase=i+2;e.kit=e.b['k'+(i+2)]||e.b.k2||e.kit;e.t=Object.assign({},e.t,i?{cdMin:.32,cdMax:.7}:{cdMin:.45,cdMax:.95});
 e.act=null;e.mode=null;e.tele=0;e.air=false;e.z=0;e.ceil=0;e.iv=999;e.posture=0;for(const q of projs)if(q.from==='e')q.dead=true;
 e.ev=Object.assign({t:0,mins:[],n:i},ev);if(ev.dur){e.storm=ev.dur;e.stormMax=ev.dur;}
 if(ev.spawn)e.ev.mins=ev.spawn(e)||[];
 sfx('boss');shake=Math.max(shake,8);fxRing(e.x,e.y,80,c,.5);fxRing(e.x,e.y,50,'#fff',.35);txtFx(e.x,e.y-14,ev.name,c,2);
 setToast(ev.name+' - '+(ev.dur&&ev.spawn?'SURVIVE AND DEFEAT THE GUARD':ev.dur?'SURVIVE!':'DEFEAT THE GUARD TO BREAK THE SHIELD'),c,3.5);}
function evTick(e,dt){const ev=e.ev;ev.t+=dt;if(!e.squad)e.iv=999;tickBarrage(e,dt);
 if(ev.dur)e.storm=Math.max(0,ev.dur-ev.t);
 if(!ev.free&&!e.squad){e.x+=(e.hx-e.x)*Math.min(1,dt*3);e.y+=(e.hy-e.y)*Math.min(1,dt*3);}
 if(ev.tick)ev.tick(e,dt,ev);
 const left=ev.mins.filter(m=>!m.dead).length;
 if((!ev.dur||ev.t>=ev.dur)&&left===0&&ev.t>1.2){if(ev.end)ev.end(e,ev);e.ev=null;if(!e.squad)e.iv=0;e.storm=0;e.air=false;e.z=0;e.ceil=0;e.cd=1;e.modeT=2;sfx('break');fxRing(e.x,e.y,60,'#fff',.4);setToast(ev.name+' BROKEN - STRIKE NOW!','#fff',2.2);}}
// a tiny sprite helper for arena props and small foes (outlined, optional 2 frames)
function miniSpr(w,h,fn,frames){frames=frames||1;const sheet=mk((w+2)*frames,h+2,()=>{}),sg=sheet.getContext('2d');for(let f=0;f<frames;f++){const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R,f);});sg.drawImage(outlined(fr),f*(w+2),0);}
 return {c:sheet,wc:whiteOf(sheet),fw:w+2,fh:h+2,frames,sc:1,ok:true};}
DUMMYSPR.warbanner=miniSpr(12,28,R=>{R(2,0,1,28,'#5a3a22');R(3,2,8,12,'#c02020');R(3,2,8,1,'#e04030');R(5,5,4,4,'#e0b040');R(6,6,2,2,'#c02020');R(3,13,8,1,'#801010');R(0,26,5,2,'#3a2a1a');R(1,0,3,1,'#e0b040');});
DUMMYSPR.eggsac=miniSpr(12,11,(R,f)=>{R(1,2,10,9,'#e8e0c8');R(2,1,8,1,'#e8e0c8');R(1,2,2,8,'#c8c0a8');R(4,4,2,2,'#c8b890');R(7,6,2,2,'#c8b890');R(5,8,2,1,'#c8b890');for(const [x,y] of [[0,4],[11,6],[3,10],[9,10]])R(x,y,1,1,'#f0f0f8');if(f)R(5,3,2,2,'#a08060');},2);
DUMMYSPR.spiderling=miniSpr(11,7,(R,f)=>{R(3,2,5,4,'#4a3420');R(4,1,3,1,'#5a4028');R(4,3,1,1,'#ff3020');R(6,3,1,1,'#ff3020');for(let i=0;i<3;i++){R(f?1:0,2+i,3,1,'#3a2416');R(f?7:8,2+i,3,1,'#3a2416');}R(0,6,1,1,'#3a2416');R(10,6,1,1,'#3a2416');},2);
Object.assign(ET,{warbanner:{n:'WAR BANNER',hp:30,spd:0,pos:999,r:6,ai:'dummy',rng:0,wl:0,atks:[]},eggsac:{n:'EGG SAC',hp:22,spd:0,pos:999,r:6,ai:'dummy',rng:0,wl:0,atks:[]},
 spiderling:{n:'SPIDERLING',desc:'HATCHED BY THE EARTH SPIDER. FAST AND FRAIL',hp:7,spd:72,pos:10,r:3,ai:'melee',rng:18,wl:4,atks:[TH({w:.25,dist:30,sp:210,dmg:8,pd:6})]}});
// ---- movement modes for scripted bosses ----
const dustTrail=(e,c)=>{if(Math.random()<.6)particles.push({x:e.x+rnd(-e.r,e.r)*.6,y:e.y+rnd(-3,3),vx:rnd(-12,12),vy:-12,t:.45,col:c||'#9a8a70'});};
// cavalry (the general): gallop a wide circle round the arena loosing arrows inward, then wheel and charge straight at you
BMODEFN.cavalry=(e,dt,d,a,m,end)=>{const c=rcen(e.room),R0=Math.min(e.room.w,e.room.h)*T*.34;
 if(m.ph===0){m.ang=(m.ang==null?Math.atan2(e.y-c.y,e.x-c.x):m.ang)+dt*1.5*e.sdir;const tx=c.x+Math.cos(m.ang)*R0,ty=c.y+Math.sin(m.ang)*R0,da=Math.atan2(ty-e.y,tx-e.x),dd=Math.hypot(tx-e.x,ty-e.y),s=Math.min(dd/dt,e.spd*4.2);
  move(e,Math.cos(da)*s*dt,Math.sin(da)*s*dt,e.r);dustTrail(e);bossContact(e);
  if(m.tt<=0){m.tt=.34-.03*e.phase;bShot(e,{cnt:2+e.phase,spread:.22,sp:115,spr:'arrow',col:'#d02030'});}
  if(m.t>2.4){m.ph=1;m.tt=.55;m.da=a;sfx('boss');txtFx(e.x,e.y-14,'CHARGE!','#f84');}return true;}
 if(m.ph===1){e.tele=2;m.da=Math.atan2(P.y-e.y,P.x-e.x);if(m.tt<=0){m.ph=2;m.tt=1.1;e.tele=0;sfx('dash');}return true;}
 const s=340,ox=e.x,oy=e.y;move(e,Math.cos(m.da)*s*dt,Math.sin(m.da)*s*dt,e.r);bossContact(e);dustTrail(e);
 if(Math.random()<dt*25)projs.push(mkProj('e',e.x,e.y,m.da+Math.PI/2*(Math.random()<.5?1:-1),24,8*e.dm,{own:e,col:'#d02030',spr:'arrow',life:1.8,pd:5}));
 if(Math.hypot(e.x-ox,e.y-oy)<s*dt*.35||m.tt<=0){bShot(e,{pat:'flower',cnt:10+e.phase*2,sp:58,spr:'naginata',r:5,col:'#ff6040'});shake=Math.max(shake,4);
  if(m.left>1){m.left--;m.ph=1;m.tt=.35;return true;}return end();}
 return true;};
// ceiling (the spider): climbs out of sight, its shadow hunts you, then it drops with a crash and a venom burst
BMODEFN.ceiling=(e,dt,d,a,m,end)=>{
 if(m.ph===0){e.air=true;e.ceil=1;e.z=Math.min(170,(e.z||0)+dt*420);if(e.z>=170){m.ph=1;m.tt=1.7-.15*e.phase;}return true;}
 if(m.ph===1){if(m.tt>.55){const da=Math.atan2(P.y-e.y,P.x-e.x),dd=Math.hypot(P.x-e.x,P.y-e.y);e.x+=Math.cos(da)*Math.min(dd,e.spd*3.2*dt);e.y+=Math.sin(da)*Math.min(dd,e.spd*3.2*dt);}else e.tele=2;
  if(Math.random()<dt*2.5)dh.push({x:P.x+rnd(-40,40),y:P.y+rnd(-40,40),r:10,t:.9,dur:.9,dmg:9*e.dm,col:'#e8e8f0'});
  if(m.tt<=0){m.ph=2;e.tele=0;}return true;}
 e.z=Math.max(0,e.z-dt*800);
 if(e.z<=0){e.air=false;e.ceil=0;shake=Math.max(shake,8);sfx('break');fxRing(e.x,e.y,46,'#c89040',.45);spark(e.x,e.y,'#8a7050',20,110);
  if(Math.hypot(P.x-e.x,P.y-e.y)<46&&P.iv<=0&&P.dash<=0)hitPlayer(24*e.dm,e.x,e.y,{peril:true,src:e});
  bShot(e,{pat:'gapring',cnt:12+e.phase*3,gw:.5,sp:58,spr:'venom',st:'big',r:4,col:'#70d040',life:1.7,pool:{r:11,t:3,dps:9,col:'#4a9a20'}});
  if(m.left>1){m.left--;m.ph=0;return true;}return end();}
 return true;};
// flit (the witch): glides between points in the square, leaving fire behind her, ringing out embers at each stop
BMODEFN.flit=(e,dt,d,a,m,end)=>{const N=3+e.phase;if(m.n>=N)return end();
 if(!m.tg){const s=spotIn(e.room);m.tg=s;}
 const da=Math.atan2(m.tg.y-e.y,m.tg.x-e.x),dd=Math.hypot(m.tg.x-e.x,m.tg.y-e.y),s=Math.min(dd/dt,e.spd*3.4);move(e,Math.cos(da)*s*dt,Math.sin(da)*s*dt,e.r);
 m.ft=(m.ft||0)-dt;if(m.ft<=0){m.ft=.3;hz.push({x:e.x,y:e.y,r:10,t:3.2,dps:10*e.dm,col:'#ff6020'});}
 if(dd<8||m.t>2.5*(m.n+1)){m.n++;m.tg=null;bShot(e,{pat:'flower',cnt:10+e.phase*2,sp:55,spr:'ember',col:'#ff8030'});}
 return true;};
// ======== I. GENERAL AKAGANE: a mounted general. Cavalry circles, charges, war banners that shield him ========
BKIT['GENERAL AKAGANE']={
 style:{c:'#e04030',t:['VANGUARD','RALLY THE VANGUARD','LAST CHARGE'],ph:[
  [{cnt:5,spread:.6,sp:95,spr:'arrow',col:'#d02030'},{cnt:2,spread:.4,sp:66,spr:'naginata',r:5,col:'#ff6040'}],
  [{pat:'wall',cnt:11,sp:70,spr:'arrow',col:'#d02030'},{cnt:3,spread:.7,sp:70,spr:'naginata',r:5,col:'#ff6040'},{pat:'curtain',cnt:7,sp:80,spr:'arrow',col:'#ff8040'}],
  [{pat:'wall',cnt:13,sp:78,spr:'arrow',col:'#d02030'},{cnt:5,spread:1.1,sp:74,spr:'naginata',r:5,col:'#ff6040'},{pat:'gapring',cnt:20,gw:.45,sp:60,spr:'drum',col:'#e0b040'}]]},
 modes:['cavalry','cavalry','dashes'],modeName:{cavalry:'CAVALRY!'},modeGap:.6,
 // each war banner still standing cuts the damage he takes by 12%
 dmgMod:e=>1-.12*(e.banners||[]).filter(b=>!b.dead).length,
 populate(e,r){const c=rcen(r),k=r.w*T*.3;e.banners=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx2,sy2])=>propFoe('warbanner',c.x+sx2*k,c.y+sy2*k,r,{propCol:'#c02020'}));},
 reset(e){for(const b of e.banners||[])b.dead=true;this.populate(e,e.room);},
 events:[
  {name:'RALLY THE VANGUARD',spawn:e=>[...spawnMin(e,'ashigaru',4),...spawnMin(e,'archer',2),...spawnMin(e,'shielder',1)],
   tick(e,dt,ev){ev.dr=(ev.dr||.5)-dt;if(ev.dr<=0){ev.dr=1.4;enemyShoot(e,{pat:'gapring',cnt:18,gw:.5,sp:50,spr:'drum',col:'#e0b040',dmg:9,pd:6},0);sfx('beat');fxRing(e.x,e.y,20,'#e0b040',.25);}}},
  {name:'LAST CHARGE',dur:9,free:true,spawn:e=>spawnMin(e,'samurai',2),
   tick(e,dt,ev){const c=rcen(e.room),R0=Math.min(e.room.w,e.room.h)*T*.38;ev.ang=(ev.ang==null?0:ev.ang)+dt*1.8;const tx=c.x+Math.cos(ev.ang)*R0,ty=c.y+Math.sin(ev.ang)*R0;e.x+=(tx-e.x)*Math.min(1,dt*6);e.y+=(ty-e.y)*Math.min(1,dt*6);dustTrail(e);
    ev.ar=(ev.ar||0)-dt;if(ev.ar<=0){ev.ar=.28;enemyShoot(e,{cnt:3,spread:.3,sp:120,spr:'arrow',col:'#d02030',dmg:9,pd:6},Math.atan2(c.y-e.y,c.x-e.x));}
    ev.rn=(ev.rn||0)-dt;if(ev.rn<=0){ev.rn=.85;for(let i=0;i<2;i++)dh.push({x:P.x+rnd(-36,36),y:P.y+rnd(-36,36),r:15,t:1.1,dur:1.1,dmg:12*e.dm,col:'#d02030'});}}}],
 despName:'NO RETREAT',desperate(e){e.mode={k:'cavalry',t:9,n:0,ph:1,tt:.5,left:3};}};
// ======== II. THE FIVE RONIN: a squad of five, each with their own weapon. One shared health bar ========
const RONIN=[{type:'ashigaru',label:'TETSU',c:'#4080ff'},{type:'archer',label:'KAEDE',c:'#50d060'},{type:'assassin',label:'JIN',c:'#b060ff'},{type:'bomber',label:'GORO',c:'#ff8030'},{type:'monk',label:'SEN',c:'#ffd040'}];
const RONSPR={};
function roninSpr(def){return RONSPR[def.label]||(RONSPR[def.label]=Object.assign({},foeSprite(def.type,basePal(def.c,shade(def.c,-.4),'#f0e8d8',shade(def.c,-.55))),{sc:1.35}));}
BKIT['THE FIVE RONIN']={squad:true,
 style:{c:'#c0c8d8',t:['THE FIVE','FIVE-POINT FORMATION','CALL THE GANG'],ph:[[],[],[]]},
 init(e){e.ghost=true;e.air=true;e.squad=true;const c=rcen(e.room),per=e.maxhp/5;
  e.members=RONIN.map((def,i)=>{const a=i/5*TAU-Math.PI/2,m=mkEnemy(def.type,c.x+Math.cos(a)*50,c.y+Math.sin(a)*50,e.room,R.di);
   Object.assign(m,{hp:per,maxhp:per,maxPosture:e.maxPosture*.45,label:def.label,labelC:def.c,sprOv:roninSpr(def),member:e,ronin:def.label,awake:e.awake,r:6});
   m.dm*=1.35;m.spd*=1.15;m.t=Object.assign({},m.t,{cdMin:.55,cdMax:1.05});enemies.push(m);return m;});
  e.hp=e.maxhp;e.alive=5;e.comboT=6;e.healT=4.5;},
 reset(e){for(const m of e.members||[])m.dead=true;e.kitOn=0;},
 squadTick(e,dt){const ms=e.members,alive=ms.filter(m=>!m.dead);
  for(const m of alive)if(!m.awake)m.awake=true;
  e.hp=alive.reduce((s,m)=>s+Math.max(0,m.hp),0);
  if(!alive.length){e.hp=0;killE(e);return true;}
  if(alive.length<e.alive){const fell=ms.filter(m=>m.dead&&!m.mourned);for(const m of fell){m.mourned=1;setToast(m.ronin+' FALLS - THE OTHERS GROW FIERCER','#ff8080',2.5);}for(const m of alive){m.dm*=1.12;m.spd*=1.08;}e.alive=alive.length;
   if(alive.length===1){const l=alive[0];txtFx(l.x,l.y-14,'LAST RONIN','#ff4040',2);l.dm*=1.2;l.t=Object.assign({},l.t,{cdMin:.35,cdMax:.7});}}
  const f=e.hp/e.maxhp;
  if(!e.ev){if(e.phase===1&&f<.66)bossEvent(e,0);else if(e.phase===2&&f<.33)bossEvent(e,1);}
  e.lastPh=e.phase;
  if(e.ev){for(const m of alive)m.iv=Math.max(m.iv,.25);evTick(e,dt);return true;}
  // COMBINATION: every few seconds all of them strike at once - telegraphed spears from every side at you
  e.comboT-=dt;if(e.comboT<=0){e.comboT=Math.max(3.5,6.5-.6*(5-alive.length));setToast('COMBINATION!','#c0c8d8',1);
   for(const m of alive)enemyShoot(m,{cnt:1,sp:230,dmg:12,pd:10,st:'lance',wait:.55,spr:'spear',col:m.labelC},Math.atan2(P.y-m.y,P.x-m.x));}
  // SEN, the monk, mends whichever of them is hurt worst
  const sen=alive.find(m=>m.ronin==='SEN');if(sen){e.healT-=dt;if(e.healT<=0){e.healT=4.5;const w=alive.reduce((a,b)=>a.hp/a.maxhp<b.hp/b.maxhp?a:b);w.hp=Math.min(w.maxhp,w.hp+w.maxhp*.07);txtFx(w.x,w.y-10,'+HEAL','#ffd040');
   for(let i=0;i<10;i++){const k=i/10;particles.push({x:sen.x+(w.x-sen.x)*k,y:sen.y+(w.y-sen.y)*k,vx:0,vy:-8,t:.5,col:'#ffd040'});}}}
  return true;},
 events:[
  // the five leap to the points of a star around the arena and fire along its lines while it turns
  {name:'FIVE-POINT FORMATION',dur:9,tick(e,dt,ev){const c=rcen(e.room),al=e.members.filter(m=>!m.dead),n=al.length;ev.rot=(ev.rot||0)+dt*.35;
    al.forEach((m,i)=>{const a=ev.rot+i/n*TAU-Math.PI/2,tx=c.x+Math.cos(a)*92,ty=c.y+Math.sin(a)*92;m.stun=.1;m.act=null;m.x+=(tx-m.x)*Math.min(1,dt*5);m.y+=(ty-m.y)*Math.min(1,dt*5);});
    ev.sh=(ev.sh||1.2)-dt;if(ev.sh<=0){ev.sh=1.15;ev.k=(ev.k||0)+1;
     al.forEach((m,i)=>{const o=al[(i+2)%n]||al[0];if(ev.k%2)enemyShoot(m,{cnt:1,sp:170,dmg:10,pd:8,st:'lance',wait:.5,spr:'spear',col:m.labelC},Math.atan2(o.y-m.y,o.x-m.x));
      else enemyShoot(m,{pat:'gapring',cnt:10,gw:.6,sp:50,dmg:9,pd:6,col:m.labelC},0);});}}},
  {name:'CALL THE GANG',spawn:e=>[...spawnMin(e,'bandit',4),...spawnMin(e,'bomber',1)]}]};
// ======== III. TSUCHIGUMO: webs that slow you, egg sacs that hatch, ceiling drops, silk that hangs in the air ========
BKIT['TSUCHIGUMO, EARTH SPIDER']={
 style:{c:'#c89040',t:['SILK SNARE','THE BROOD HATCHES','WEB OF SPIRITS'],ph:[
  [{pat:'web',cnt:8,rings:2,sp:62,spr:'silk',st:'stick',sd:75,life:4,col:'#e8e8f0'},{cnt:3,spread:.7,sp:55,spr:'venom',st:'big',r:4,life:1.6,col:'#70d040',pool:{r:12,t:3,dps:9,col:'#4a9a20'}}],
  [{pat:'web',cnt:10,rings:2,sp:64,spr:'silk',st:'stick',sd:85,life:4,col:'#e8e8f0'},{cnt:5,spread:1,sp:55,spr:'venom',st:'big',r:4,life:1.6,col:'#70d040',pool:{r:12,t:3,dps:10,col:'#4a9a20'}},{pat:'spiral',arms:5,spin:.32,sp:60,spr:'silk',col:'#e8e8f0',burst:5,gap:.1}],
  [{pat:'web',cnt:12,rings:3,sp:66,spr:'silk',st:'stick',sd:95,life:4,col:'#e8e8f0'},{cnt:7,spread:1.4,sp:58,spr:'venom',st:'big',r:4,life:1.6,col:'#70d040',pool:{r:13,t:3.2,dps:11,col:'#4a9a20'}},{pat:'spiral',arms:7,spin:.36,sp:62,spr:'silk',col:'#e8e8f0',burst:7,gap:.09}]]},
 modes:['ceiling','ceiling','chase'],modeName:{ceiling:'IT CLIMBS...'},modeGap:.7,
 shape(m,r){const cx=r.x+(r.w>>1),cy=r.y+(r.h>>1);for(let i=0;i<6;i++){const a=i/6*TAU+.3,x=Math.round(cx+Math.cos(a)*10),y=Math.round(cy+Math.sin(a)*10);solidBlock(m,x,y,2,2);}}, // stalagmite pillars
 populate(e,r){const c=rcen(r);map.webs=[];for(let i=0;i<5;i++){const a=i/5*TAU,k=r.w*T*(i%2?.24:.34);map.webs.push({x:c.x+Math.cos(a)*k,y:c.y+Math.sin(a)*k,r:30});}map.webs.push({x:c.x,y:c.y,r:22});
  e.eggs=[];for(let i=0;i<5;i++){const a=i/5*TAU+.6,k=r.w*T*.4;e.eggs.push(propFoe('eggsac',c.x+Math.cos(a)*k,c.y+Math.sin(a)*k,r,{propCol:'#e8e0c8'}));}e.hatchT=14;},
 reset(e){for(const g of e.eggs||[])g.dead=true;this.populate(e,e.room);},
 hatch(e,g,n){g.dead=true;spark(g.x,g.y,'#e8e0c8',16,80);sfx('break');const out=[];for(let i=0;i<n;i++){const m=mkEnemy('spiderling',g.x+rnd(-8,8),g.y+rnd(-8,8),e.room,R.di);m.awake=true;m.minion=true;enemies.push(m);out.push(m);}return out;},
 tick(e,dt,d,inEv){if(map.webs){P.webT=0;for(const w of map.webs)if(Math.hypot(P.x-w.x,P.y-w.y)<w.r)P.webT=.15;}
  // left alone, an egg sac hatches every so often: break them early
  if(!inEv&&e.awake){e.hatchT-=dt;if(e.hatchT<=0){e.hatchT=14;const g=(e.eggs||[]).find(x=>!x.dead);if(g){this.hatch(e,g,2);txtFx(g.x,g.y-8,'HATCHING!','#e8e0c8');}}}},
 events:[
  {name:'THE BROOD HATCHES',spawn(e){const K=BKIT['TSUCHIGUMO, EARTH SPIDER'];let out=[];for(const g of (e.eggs||[]).filter(x=>!x.dead))out=out.concat(K.hatch(e,g,3));out=out.concat(spawnMin(e,'spiderling',Math.max(4,10-out.length)));e.air=true;e.z=170;e.ceil=1;return out;},
   free:true,tick(e,dt,ev){e.air=true;e.z=170;e.ceil=1;const da=Math.atan2(P.y-e.y,P.x-e.x);e.x+=Math.cos(da)*Math.min(Math.hypot(P.x-e.x,P.y-e.y),40*dt);e.y+=Math.sin(da)*Math.min(Math.hypot(P.x-e.x,P.y-e.y),40*dt);
    ev.rn=(ev.rn||0)-dt;if(ev.rn<=0){ev.rn=.75;dh.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),r:12,t:1,dur:1,dmg:10*e.dm,col:'#e8e8f0'});}},
   end(e){shake=Math.max(shake,8);sfx('break');fxRing(e.x,e.y,46,'#c89040',.45);bShot(e,{pat:'gapring',cnt:16,gw:.5,sp:58,spr:'venom',st:'big',r:4,col:'#70d040',life:1.7,pool:{r:11,t:3,dps:9,col:'#4a9a20'}});}},
  {name:'WEB OF SPIRITS',dur:9,tick(e,dt,ev){ev.sh=(ev.sh||.4)-dt;if(ev.sh<=0){ev.sh=.55;ev.k=(ev.k||0)+1;const o=ev.k%3;
    enemyShoot(e,o===0?{pat:'web',cnt:12,rings:3,sp:62,spr:'silk',st:'stick',sd:110,life:3.5,col:'#e8e8f0',dmg:10,pd:6}:o===1?{pat:'spiral',arms:8,spin:.4,sp:60,spr:'silk',col:'#e8e8f0',dmg:9,pd:6}:{cnt:5,spread:2.4,sp:50,spr:'venom',st:'big',r:4,life:1.8,col:'#70d040',dmg:10,pd:6,pool:{r:12,t:3,dps:9,col:'#4a9a20'}},Math.atan2(P.y-e.y,P.x-e.x));}}}],
 despName:'VENOM FLOOD',desperate(e){bossBarrage(e,{pat:'gapring',cnt:18,gw:.42,sp:52,spr:'venom',st:'big',r:4,life:2,col:'#70d040',pool:{r:12,t:3.5,dps:10,col:'#4a9a20'},burst:3,gap:.55});}};
// ======== IV. THE LANTERN WITCH: drifting fire, paper charms; light the stone lanterns to lure and dazzle her ========
BKIT['THE LANTERN WITCH']={
 style:{c:'#ff8030',t:['WILL-O-WISP','LANTERN SPIRITS','INFERNO WALTZ'],ph:[
  [{cnt:4,spread:.9,sp:55,st:'seek',turn:1.4,seekT:1.6,spr:'ember',col:'#ff8030'},{pat:'spiral',arms:5,spin:.3,sp:58,spr:'charm',col:'#f8f4e8',burst:4,gap:.12}],
  [{cnt:6,spread:1.2,sp:57,st:'seek',turn:1.5,seekT:1.7,spr:'ember',col:'#ff8030'},{pat:'spiral',arms:7,spin:.32,sp:60,spr:'charm',col:'#f8f4e8',burst:6,gap:.11},{pat:'flower',cnt:16,sp:56,spr:'ember',col:'#ff6020'}],
  [{cnt:8,spread:1.6,sp:60,st:'seek',turn:1.6,seekT:1.8,spr:'ember',col:'#ff8030'},{pat:'spiral',arms:9,spin:.36,sp:62,spr:'charm',col:'#f8f4e8',burst:8,gap:.1},{pat:'gapring',cnt:24,gw:.42,sp:60,spr:'charm',col:'#f8f4e8'}]]},
 modes:['flit','flit','circle'],modeName:{flit:'DANCING FLAMES'},modeGap:.8,
 // dazzled by a lantern she takes 35% more damage
 dmgMod:e=>e.dazzle>0?1.35:1,
 init(e){e.t.fly=true;e.t0.fly=true;},
 populate(e,r){const c=rcen(r),k=r.w*T*.3;for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])props.push({k:'blantern',x:c.x+a*k,y:c.y+b*k,room:r,lit:0,cd:0});},
 reset(e){for(const p of props)if(p.k==='blantern'){p.lit=0;p.cd=0;}e.dazzle=0;e.lure=null;},
 tick(e,dt,d,inEv){for(const p of props)if(p.k==='blantern'){if(p.cd>0)p.cd-=dt;if(p.lit>0){p.lit-=dt;if(p.lit<=0)p.cd=8;}}
  if(inEv)return;
  if(e.dazzle>0){e.dazzle-=dt;e.cd=Math.max(e.cd,.3);e.mode=null;if(Math.random()<dt*10)particles.push({x:e.x+rnd(-8,8),y:e.y-rnd(4,16),vx:0,vy:-14,t:.5,col:'#ffe080'});if(e.dazzle<=0)txtFx(e.x,e.y-14,'SHE RECOVERS','#ff8030');return true;}
  // a lit lantern draws her in: she drops everything and flies to it, then is dazzled for a few seconds
  const lit=props.find(p=>p.k==='blantern'&&p.lit>0&&p.room===e.room);
  if(lit){e.mode=null;e.act=null;const da=Math.atan2(lit.y-e.y,lit.x-e.x),dd=Math.hypot(lit.x-e.x,lit.y-e.y);e.x+=Math.cos(da)*Math.min(dd,e.spd*3.5*dt);e.y+=Math.sin(da)*Math.min(dd,e.spd*3.5*dt);
   if(dd<14){lit.lit=0;lit.cd=14;e.dazzle=4;sfx('break');fxRing(lit.x,lit.y,36,'#ffe080',.5);spark(lit.x,lit.y,'#ffe080',24,110);txtFx(e.x,e.y-14,'DAZZLED!','#ffe080',2);setToast('DAZZLED - SHE TAKES +35% DAMAGE','#ffe080',2);}
   return true;}},
 events:[
  {name:'LANTERN SPIRITS',spawn:e=>[...spawnMin(e,'wisp',4),...spawnMin(e,'imp',2)],
   tick(e,dt,ev){ev.sh=(ev.sh||.5)-dt;if(ev.sh<=0){ev.sh=.7;enemyShoot(e,{pat:'spiral',arms:4,spin:.45,sp:52,spr:'charm',col:'#f8f4e8',dmg:9,pd:6},0);}}},
  {name:'INFERNO WALTZ',dur:9,spawn:e=>spawnMin(e,'bomber',2),
   tick(e,dt,ev){ev.sh=(ev.sh||.3)-dt;if(ev.sh<=0){ev.sh=.22;ev.a=(ev.a||0)+.42;for(let i=0;i<2;i++)projs.push(mkProj('e',e.x,e.y,ev.a+i*Math.PI,58,10*e.dm,{own:e,col:'#ff8030',spr:'ember',pd:6}));}
    ev.sk=(ev.sk||1)-dt;if(ev.sk<=0){ev.sk=1.3;enemyShoot(e,{cnt:5,spread:2,sp:55,st:'seek',turn:1.5,seekT:1.6,spr:'ember',col:'#ffb040',dmg:10,pd:6},Math.atan2(P.y-e.y,P.x-e.x));}
    ev.fp=(ev.fp||0)-dt;if(ev.fp<=0){ev.fp=1.6;const a=Math.random()*TAU;hz.push({x:P.x+Math.cos(a)*30,y:P.y+Math.sin(a)*30,r:12,t:3,dps:10*e.dm,col:'#ff6020'});}}}],
 despName:'THOUSAND LANTERNS',desperate(e){bossBarrage(e,{pat:'gapring',cnt:20,gw:.45,sp:50,st:'seek',turn:1.2,seekT:1.4,spr:'ember',col:'#ffb040',burst:3,gap:.6});}};
// ---- per-boss arena overlays drawn on the floor (spider webs) ----
function drawBossFloor(){if(!map||!map.webs)return;ctx.globalAlpha=.55;for(const w of map.webs){for(let i=0;i<8;i++){const a=i/8*TAU;sline(sx(w.x,w.y),sy(w.x,w.y),sx(w.x+Math.cos(a)*w.r,w.y+Math.sin(a)*w.r),sy(w.x+Math.cos(a)*w.r,w.y+Math.sin(a)*w.r),'#d8d8e8');}
 for(const k of [.35,.7,1])wcirc(w.x,w.y,w.r*k,'#c8c8d8');}ctx.globalAlpha=1;}
