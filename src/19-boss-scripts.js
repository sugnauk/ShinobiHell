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
// (the older scripted fights that lived here - General Akagane, the Five Ronin, the Lantern Witch and the first
//  Tsuchigumo - were replaced by the boss director in 90-bosses.js and have been removed)
// ---- per-boss arena overlays drawn on the floor (spider webs) ----
function drawBossFloor(){if(!map||!map.webs)return;ctx.globalAlpha=.55;for(const w of map.webs){for(let i=0;i<8;i++){const a=i/8*TAU;sline(sx(w.x,w.y),sy(w.x,w.y),sx(w.x+Math.cos(a)*w.r,w.y+Math.sin(a)*w.r),sy(w.x+Math.cos(a)*w.r,w.y+Math.sin(a)*w.r),'#d8d8e8');}
 for(const k of [.35,.7,1])wcirc(w.x,w.y,w.r*k,'#c8c8d8');}ctx.globalAlpha=1;}
