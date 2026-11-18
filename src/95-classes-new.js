'use strict';
// HELL OF THE EMPEROR - two more characters.
//  GUNNER: a matchlock teppo soldier. Slow, hard-hitting piercing shots at long range, grapeshot, a powder-keg roll, a tripod gun
//          and a siege cannon. Sturdy (+2 DEF) but slower.
//  LANCER: a yari spearman. The longest melee reach in the game, a lunging spiral thrust, a wheel sweep, a deflecting parry that
//          throws bullets back, a war banner and a thousand-thrust flurry. A melee class: blades cut bullets (94-melee.js).
// Spells sit at SPELLS[slot][8] (gunner) and [9] (lancer); their LMB weapons are types 16 (TANEGASHIMA) and 17 (YARI).
SPELLS.m.push({n:'TANEGASHIMA',g:'=',c:'#ffd060',d:'SLOW, HEAVY ROUND. PIERCES 2. LONG RANGE',dm:1.7,db:'b'},
 {n:'YARI THRUST',g:'-',c:'#c8e0ff',d:'LONG THRUST. EVERY 3RD STRIKES THREE TIMES',dm:1.3,db:'b'});
SPELLS.h.push({n:'HEAVY SLUG',g:'O',c:'#ffd060',cd:1.1,d:'HUGE ROUND THAT PIERCES EVERYTHING',dm:3,db:'b',x:'FULL CHARGE: CUTS SHOTS ON ITS PATH'},
 {n:'SPIRAL LUNGE',g:'>',c:'#c8e0ff',cd:1.2,d:'LUNGE FORWARD, UNTOUCHABLE, SPEAR FIRST',dm:2.8,db:'b',x:'FULL CHARGE: SPINS AT THE END'});
SPELLS.q.push({n:'GRAPESHOT',g:'*',c:'#c8c8d0',cd:4,d:'CONE OF 11 PELLETS. BRUTAL UP CLOSE',dm:.55,db:'q',dx:' X 11'},
 {n:'WHEEL SWEEP',g:'O',c:'#c8e0ff',cd:5,d:'TWO HUGE SPEAR SWEEPS AROUND YOU',dm:1.6,db:'q',dx:' X 2'});
SPELLS.w.push({n:'POWDER ROLL',g:'<',c:'#ff8030',cd:5,d:'ROLL BACK, LEAVE A KEG THAT BLOWS',dm:3,db:'a'},
 {n:'DEFLECT',g:'D',c:'#e0b040',cd:6,d:'1S: BULLETS NEAR YOU FLY BACK AS YOURS',dm:.6,db:'a'});
SPELLS.f.push({n:'TRIPOD GUN',g:'T',c:'#ffd060',cd:14,d:'A GUN ON A TRIPOD FIRES FOR 7S',dm:.55,db:'a',dx:' EVERY 0.25S'},
 {n:'WAR BANNER',g:'B',c:'#e04030',cd:16,d:'PLANT A BANNER: +30% DAMAGE, HEAL 2%/S INSIDE',dm:0,db:'a'});
SPELLS.e.push({n:'SIEGEBREAKER',g:'#',c:'#ffad5f',cd:32,d:'FIRES A WIDE CANNON BLAST THAT CLEARS SHOTS',dm:7,db:'e'},
 {n:'THOUSAND THRUSTS',g:'!',c:'#c8e0ff',cd:30,d:'A FLURRY OF THRUSTS FOR 1.6S',dm:.9,db:'e',dx:' X 20'});
Object.assign(WTYPES,{TANEGASHIMA:16,YARI:17});Object.assign(LMBRATE,{16:.55,17:.3});
Object.assign(WFAM,{gunner:['TANEGASHIMA','REPEATER'],lancer:['YARI','NAGINATA']});Object.assign(WSIG,{gunner:'TANEGASHIMA',lancer:'YARI'});
CLASSES.push({k:'gunner',n:'GUNNER',col:'#ffb060',d:'MATCHLOCK: SLOW, PIERCING SHOTS, A TURRET. +2 DEF.',hp:1.05,spd:.95,dash:1.1,def:2,kit:{m:16,h:8,q:8,w:8,f:8,e:8}},
 {k:'lancer',n:'LANCER',col:'#80c0ff',d:'YARI: THE LONGEST REACH. TOUGH AGAINST BULLETS. +20% HP.',hp:1.2,spd:1,dash:1,def:2,kit:{m:17,h:9,q:9,w:9,f:9,e:9}});
EVONAMES.gunner=['RECRUIT','LOADER','MUSKETEER','SHARP GUN','GUN CAPTAIN','TEPPO','FIRE LANCE','THUNDER GUN','CANNONEER','GUN SAINT'];
EVONAMES.lancer=['SPEAR BOY','PIKEMAN','YARI-ASHIGARU','LANCER','SPEAR CAPTAIN','HATAMOTO','SPIRAL SPEAR','HEAVEN PIERCER','DRAGON LANCE','SPEAR SAINT'];
{const _he=heroEV;heroEV=function(cls,st){const t=st/9,n=(EVONAMES[cls]||[])[st];
  if(cls==='gunner')return {n,hat:st<2?'teppo':st<5?'kasa':'kabuto',crest:st>=7,beard:st>=8?1:0,wpn:'gun',C:{hat:st<2?'#3b4557':st<5?'#8a6a40':mixC('#3a3a44','#6a4a20',t),hatL:st<2?'#798795':st<5?'#a8885a':'#c0a040',band:st>=4?'#ffb060':'#c77d54',robe:mixC('#5f4a48','#3a3a48',t),robeS:mixC('#3a2a1a','#22222c',t),trim:st>=3?'#ffb060':'#3a2a1a',beard:'#3a3a3a',beardS:'#2a2a2a'}};
  if(cls==='lancer')return {n,hat:st<3?'kasa':'kabuto',crest:st>=5,beard:st>=8?1:0,wpn:'spear',C:{hat:st<3?'#7a8a9a':mixC('#3a4a5a','#203a6a',t),hatL:st<3?'#9aaaba':'#c8e0ff',band:st>=4?'#80c0ff':'#4a5a6a',robe:mixC('#5a6a7a','#20406a',t),robeS:mixC('#3a4a5a','#10203a',t),trim:st>=4?'#c8e0ff':'#2a3a4a',beard:'#3a3a3a',beardS:'#2a2a2a'}};
  return _he(cls,st);};}
// the lancer fights at blade range: MELEE() in 94-melee.js includes it, so blades cut bullets for it too
// seven characters: narrower cards so they all fit on the select screen
Object.assign(SELCARD,{w:41,gap:3,x0:Math.round((320-(CLASSES.length*44-3))/2)});

// ---------- the casts ----------
const NEWCAST={
 // GUNNER
 160:(c)=>{const {p,a,A,bp,em}=c;pShot(p.x+Math.cos(a)*8,p.y+Math.sin(a)*8,a,360,A*1.7*bp*em,{r:3,col:'#ffd060',pierce:2+S.pierce,life:.85*(1+S.rangeM),pd:18});for(let i=0;i<6;i++)particles.push({x:p.x+Math.cos(a)*10,y:p.y+Math.sin(a)*10,vx:Math.cos(a+rnd(-.5,.5))*rnd(10,40),vy:Math.sin(a+rnd(-.5,.5))*rnd(10,40)-10,t:.5,col:'#a8a8a8'});move(p,-Math.cos(a)*1.5,-Math.sin(a)*1.5,4);p.atkCd=LMBRATE[16]/S.aspd;sfx('shoot');shake=Math.max(shake,1);},
 81:(c)=>{const {p,a,A,bp,em}=c;pShot(p.x+Math.cos(a)*8,p.y+Math.sin(a)*8,a,330,A*3*bp*em,{r:5,col:p.hFull?'#fff':'#ffd060',pierce:99,cut:p.hFull?1:0,life:.9*(1+S.rangeM),pd:40,st:'big'});move(p,-Math.cos(a)*10,-Math.sin(a)*10,4);impact(p.x,p.y,'#ffd060',4);sfx('break');},
 82:(c)=>{const {p,a,A,qm,em}=c;for(let i=0;i<11;i++){const o=(i/10-.5)*.9+rnd(-.04,.04);pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+o,rnd(260,320),A*.55*qm*em,{r:2,col:'#c8c8d0',life:.45*(1+S.rangeM)});}impact(p.x,p.y,'#c8c8d0',4);sfx('break');},
 83:(c)=>{const {p,a,A,ap,em}=c;zones.push({k:'gkeg',x:p.x,y:p.y,r:50*AZ(),t:.8,tk:0,dm:A*3*ap*em});const ra=a+Math.PI;p.dx=Math.cos(ra);p.dy=Math.sin(ra);p.dash=.2;p.iv=Math.max(p.iv,.45);sfx('dash');},
 84:(c)=>{const {p,A,ap,em}=c;zones.push({k:'tripod',x:p.x,y:p.y,r:0,t:7,tk:.3,dm:A*.55*ap*em});sfx('tool');},
 85:({p,a,A,ep,em})=>{
  const len=rayLen(p.x,p.y,a,Math.min(200,164*(1+.3*S.rangeM)));
  zones.push({k:'siege',src:'e',x:p.x,y:p.y,a,len,r:24,t:.36,tk:.36,dm:A*7*ep*em});
  setToast('SIEGEBREAKER','#ffad5f',1.5);sfx('tool');
 },
 // LANCER
 170:(c)=>{const {p,a,A,bp,em}=c;const cont=R.time-(p.lastSw||-9)<.8;p.combo=cont?((p.combo||0)+1)%3:0;p.lastSw=R.time;const fin=p.combo===2,len=70*(1.12+S.rangeM*.5);
  for(const o of fin?[-.22,0,.22]:[0]){lineHit(p.x,p.y,a+o,len,9,e=>hurtE(e,A*1.3*(fin?1.1:1)*bp*em,16,{slash:true,kb:a}));fx.push({k:'line',x:p.x,y:p.y,a:a+o,len,t:.12,dur:.12,col:fin?'#ffffff':'#c8e0ff'});}
  sfx('slash');p.atkCd=(fin?.45:LMBRATE[17])/S.aspd;},
 91:(c)=>{const {p,a,A,bp,em}=c;let n=0;for(let s=0;s<=60;s+=3){if(blocked(p.x+Math.cos(a)*s,p.y+Math.sin(a)*s,4))break;n=s;}const x0=p.x,y0=p.y;p.x+=Math.cos(a)*n;p.y+=Math.sin(a)*n;p.iv=Math.max(p.iv,.35);
  lineHit(x0,y0,a,n+60,12,e=>hurtE(e,A*2.8*bp*em,40,{slash:true,kb:a}));fx.push({k:'line',x:x0,y:y0,a,len:n+60,t:.2,dur:.2,col:'#c8e0ff'});
  if(p.hFull){coneHit(p.x,p.y,a,44,TAU,e=>hurtE(e,A*1.6*bp*em,30,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));fx.push({k:'slash',x:p.x,y:p.y,a,arc:TAU,r:44,t:.2,dur:.2,col:'#fff'});}sfx('dash');impact(p.x,p.y,'#c8e0ff',3);},
 92:(c)=>{const {p,A,qm,em}=c;zones.push({k:'whirl',x:p.x,y:p.y,r:66*AZ(),t:.62,tk:0,dm:A*1.6*qm*em,n:1});sfx('dash');},
 93:(c)=>{const {p,A,ap,em}=c;zones.push({k:'deflect',x:p.x,y:p.y,r:30,t:1,tk:0,dm:A*.6*ap*em});fxRing(p.x,p.y,30,'#e0b040',.3);sfx('block');},
 94:(c)=>{const {p}=c;zones.push({k:'banner',x:p.x,y:p.y,r:70*AZ(),t:8,tk:0});sfx('rare');},
 95:(c)=>{const {p,a,A,ep,em}=c;p.iv=Math.max(p.iv,.5);zones.push({k:'flurry',x:p.x,y:p.y,r:0,t:1.6,tk:0,a,dm:A*.9*ep*em});sfx('boss');setToast('THOUSAND THRUSTS','#c8e0ff',1.2);},
};
{const _cc=classCast;classCast=function(k){const p=P;if(!p)return;const v=p.lo[k],code=v*10+'mhqwfe'.indexOf(k),fn=NEWCAST[code];if(!fn)return _cc(k);
  if(p.stag>0)return;if(k==='m'&&p.atkCd>0)return;if(k==='h'&&p.ab.h>0)return;if(k==='w'&&p.ab.rmb>0)return;if('qfe'.includes(k)&&p.ab[k]>0)return;
  const em=EMP(k),A=S.atk,bp=BP()*(k==='h'&&p.hFull?1.5:1),ap=AP(),qm=(1+.3*S.qpow)*ap,ep=(1+.25*S.epow)*(1+.06*RK())*ap;
  const mik=p.mik;
  if(k==='m'||k==='h')p.mik=0;
  fn({p,a:p.aim,A,bp,em,ap,qm,ep,mik});setCd(k);};}
// ---------- their zones ----------
Object.assign(CZ,{
 siege:(z)=>{
  if(z.tk>0)return;
  const c=Math.cos(z.a),s=Math.sin(z.a),x=z.x+c*z.len,y=z.y+s*z.len;
  lineHit(z.x,z.y,z.a,z.len,z.r,e=>hurtE(e,z.dm,48,{kb:z.a}));
  for(const q of projs){
   if(q.dead||q.from!=='e'||q.peril)continue;
   const dx=q.x-z.x,dy=q.y-z.y,d=dx*c+dy*s;
   if(d>=0&&d<=z.len&&Math.abs(-dx*s+dy*c)<z.r&&los(z.x,z.y,q.x,q.y))q.dead=true;
  }
  for(const offset of [-18,-9,0,9,18])fx.push({k:'line',x:z.x-s*offset,y:z.y+c*offset,a:z.a,len:z.len,t:.22,dur:.22,col:offset?'#ff8845':'#fff0bd'});
  for(let i=0;i<=4;i++)spark(z.x+c*z.len*i/4,z.y+s*z.len*i/4,'#ffad5f',5,90);
  fxRing(x,y,28,'#ffab67',.38);impact(z.x,z.y,'#ffad5f',8,true);sfx('boss');sfx('break');z.t=0;
 },
 gkeg:(z)=>{if(z.t<=dt0()){impact(z.x,z.y,'#ff8030',8,true);fxRing(z.x,z.y,z.r,'#ff8030',.4);sfx('break');for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r&&los(z.x,z.y,e.x,e.y))hurtE(e,z.dm,40,{nost:true,kb:Math.atan2(e.y-z.y,e.x-z.x)});
   for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-z.x,q.y-z.y)<z.r)q.dead=true;z.t=0;}},
 tripod:(z)=>{if(z.tk<=0){z.tk=.25;const e=nearestFoe(z.x,z.y,240);if(e){const a=Math.atan2(e.y-z.y,e.x-z.x);projs.push(mkProj('p',z.x,z.y-4,a,320,z.dm,{r:2,col:'#ffd060',life:.9,pd:6,pierce:1}));sfx('shoot');}}},
 deflect:(z)=>{z.x=P.x;z.y=P.y;for(const q of projs)if(q.from==='e'&&!q.peril&&!q.dead&&Math.hypot(q.x-z.x,q.y-z.y)<z.r){const s=Math.hypot(q.vx,q.vy)*1.4||200,a=Math.atan2(q.y-z.y,q.x-z.x);q.from='p';q.vx=Math.cos(a)*s;q.vy=Math.sin(a)*s;q.dmg=z.dm;q.col='#ffd040';q.hit=new Set();q.life=1.2;q.pierce=0;q.st=null;spark(q.x,q.y,'#ffd040',3,40);}},
 banner:(z,dt,tick)=>{const inside=Math.hypot(P.x-z.x,P.y-z.y)<z.r;if(inside){P.rage=Math.max(P.rage||0,.2);if(tick)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.007);}if(tick)z.tk=.35;},
 flurry:(z)=>{z.x=P.x;z.y=P.y;if(z.tk<=0){z.tk=.08;const a=P.aim+rnd(-.35,.35),len=100*(1+S.rangeM*.4);lineHit(P.x,P.y,a,len,8,e=>hurtE(e,z.dm,8,{slash:true}));fx.push({k:'line',x:P.x,y:P.y,a,len,t:.08,dur:.08,col:Math.random()<.5?'#fff':'#c8e0ff'});if(Math.random()<.5)sfx('slash');}}});
let _dt0=.016;const dt0=()=>_dt0;{const _uw=updWorld;updWorld=function(dt){_dt0=dt;_uw(dt);};}
Object.assign(CZD,{
 siege:z=>{
  const c=Math.cos(z.a),s=Math.sin(z.a);
  ctx.globalAlpha=.58;
  for(const offset of [-z.r,z.r])wline(z.x-s*offset,z.y+c*offset,z.a,0,z.len,'#ffc274',0);
  ctx.globalAlpha=1;
  wcirc(z.x,z.y,8+Math.round((.36-z.t)*20),'#ffe1a0');
 },
 gkeg:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#14101a';ctx.fillRect(X-4,Y-8,9,9);ctx.fillStyle='#7a4a20';ctx.fillRect(X-3,Y-7,7,7);ctx.fillStyle='#3a3a40';ctx.fillRect(X-3,Y-5,7,1);ctx.fillStyle=Math.floor(time*16)%2?'#ffe060':'#ff6020';ctx.fillRect(X,Y-10,1,2);ctx.globalAlpha=.15;wcirc(z.x,z.y,z.r,'#ff8030');ctx.globalAlpha=1;},
 tripod:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#5a3a22';ctx.fillRect(X-4,Y-2,1,3);ctx.fillRect(X+3,Y-2,1,3);ctx.fillRect(X,Y-3,1,3);ctx.fillStyle='#3a3a44';ctx.fillRect(X-3,Y-6,8,2);ctx.fillStyle='#ffd060';ctx.fillRect(X+5,Y-6,1,1);},
 deflect:z=>{ctx.globalAlpha=.5+.3*Math.sin(time*20);wcirc(P.x,P.y,z.r,'#ffd040');ctx.globalAlpha=1;},
 banner:z=>{ctx.globalAlpha=.12;wdisc(z.x,z.y,z.r,'#e04030');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#e04030');const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#3a2a1a';ctx.fillRect(X,Y-26,1,26);ctx.fillStyle='#c02020';ctx.fillRect(X+1,Y-25,7,10);ctx.fillStyle='#e0b040';ctx.fillRect(X+3,Y-22,3,3);},
 flurry:z=>{}});
// hotbar icons for the new abilities (first matching rule wins, so these go in front)
SPRULES.unshift([/TANEGASHIMA|HEAVY SLUG/,'orb'],[/GRAPESHOT/,'shards'],[/POWDER ROLL/,'meteor'],[/TRIPOD GUN/,'totem'],[/SIEGEBREAKER/,'meteor'],
 [/YARI THRUST|SPIRAL LUNGE|THOUSAND THRUSTS/,'arrow'],[/WHEEL SWEEP/,'whirl'],[/DEFLECT/,'mirror'],[/WAR BANNER/,'shout']);
