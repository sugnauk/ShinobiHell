'use strict';

const HERO_FINAL_STAGE=9;
const heroTransformed=()=>P.evo>=HERO_FINAL_STAGE;

function rosterTargets(x,y,r){
 return enemies.filter(e=>!e.dead&&!e.air&&!e.ghost&&!(e.iv>0)&&Math.hypot(e.x-x,e.y-y)<=r+e.r&&los(x,y,e.x,e.y));
}
function rosterAim(p,range){
 const m=mouseWorld(),a=angTo(p,m),length=rayLen(p.x,p.y,a,Math.min(range,dist(p,m)));
 return {x:p.x+Math.cos(a)*length,y:p.y+Math.sin(a)*length};
}
function rosterBurst(x,y,r,damage,posture,col,options){
 const targets=rosterTargets(x,y,r);
 for(const e of targets)hurtE(e,damage,posture,options);
 fxRing(x,y,r,col,.32);
 spark(x,y,col,6,75);
 return targets.length;
}
function rosterShift(p,a,length){
 const dx=Math.cos(a)*2,dy=Math.sin(a)*2;
 for(let i=0;i<length/2;i++){
  if(blocked(p.x+dx,p.y+dy,4))break;
  p.x+=dx;p.y+=dy;
 }
 p.iv=Math.max(p.iv,.25);
}
function rosterShots(p,a,count,spread,damage,col,options){
 for(let i=0;i<count;i++){
  const angle=a+(i-(count-1)/2)*spread;
  pShot(p.x,p.y,angle,260,damage,{col,life:.55,pd:10,...options,...(options?.st==='boom'?{bd:angle,bt:0}:null)});
 }
}
function rosterClear(x,y,r,limit,col){
 let hits=0;
 for(const q of projs){
  if(q.from!=='e'||q.dead||q.peril||Math.hypot(q.x-x,q.y-y)>r||!los(x,y,q.x,q.y))continue;
  q.dead=true;spark(q.x,q.y,col,2,45);
  if(++hits>=limit)break;
 }
 return hits;
}
function rosterGraze(handler){
 const base=graze;
 graze=function(q){base(q);handler();};
}

const MARIONETTE='#dfa6ff',WIND='#9cead2',PETAL='#ff8aab',BLOOD='#f65c76',CHIME='#ffda83';
function rosterAdd(spec){
 const {key,name,final,col,weapon,pose,hat,role,lore,stats,kit,art}=spec;
 const slots={};
 for(const [i,k] of [...'mhqwfe'].entries()){
  const [n,cd,d,cast]=kit[i],variants=SPELLS[k],id=variants.length;
  variants.push({n,g:k.toUpperCase(),c:col,cd,d,more:'',tip:''});
  slots[k]=id;
  NEWCAST[id*10+i]=args=>{
   if(i<2&&args.mik>0)args.bp*=1.6;
   if(cast(args)===false)return false;
   sfx(ROSTER_SOUNDS[key][i]);
  };
  const icon=['sword','shards','arrow','shield','whirl','shout'][i];
  SPRULES.unshift([new RegExp('^'+n+'$'),icon]);
 }
 WTYPES[weapon]=slots.m;
 LMBRATE[slots.m]=.31;
 WSIG[key]=weapon;
 WFAM[key]=[weapon];
 CLASSES.push({k:key,n:name,col,d:lore,hp:1,spd:1,dash:1,def:0,kit:slots,...stats});
 const evoBase=heroEV;
 EVONAMES[key]=Array.from({length:10},(_,i)=>i===9?final:name);
 heroEV=function(cls,stage){
  if(cls!==key)return evoBase(cls,stage);
  return {n:EVONAMES[key][stage],wpn:pose,hat:stage===9?'kabuto':hat,crest:stage===9,
   C:{hat:art[0],hatL:col,robe:stage===9?art[2]:art[1],robeS:art[0],trim:stage===9?'#ffe1a0':col,
      band:col,staff:art[0],staffL:col,orb:col,orbL:'#fff3c7'},orb:1,rosterDetail:key,rosterFinal:stage===9};
 };
 ROSTER_INFO[key]={role,diff:2,lore};
}
const ROSTER_INFO={};
const ROSTER_SOUNDS={
 marionettist:['shoot','slash','tool','dash','block','break'],
 tengu:['shoot','shoot','slash','dash','tool','boss'],
 kagura:['slash','slash','tool','dash','rare','boss'],
 bloodoracle:['shoot','tool','tool','dash','heal','boss'],
 bellwarden:['slash','break','break','deflect','shoot','boss']
};

const threadNodes=()=>enemies.filter(e=>!e.dead&&e.threadUntil>R.time);
function threadBind(p,r){
 const cap=heroTransformed()?8:5;
 const pool=[...new Set([...rosterTargets(p.x,p.y,r),...threadNodes()])];
 pool.sort((a,b)=>dist(a,p)-dist(b,p));
 for(const e of pool.slice(cap))e.threadUntil=0;
 for(const e of pool.slice(0,cap))e.threadUntil=R.time+6;
 fxRing(p.x,p.y,r,MARIONETTE,.32);
}
rosterAdd({
 key:'marionettist',name:'MARIONETTIST',final:'SILK TYRANT',col:MARIONETTE,weapon:'PUPPET ROD',
 pose:'gohei',hat:'mask',role:'RANGED - CONTROL',lore:'LINK ENEMIES TO SHARE DAMAGE.',art:['#32203c','#724a89','#461f6a'],
 stats:{hp:.9,pw:.97},
 kit:[
 ['NEEDLE CAST',0,'FIRES A FAST SPIRIT NEEDLE.',({p,a,A,bp,em})=>{rosterShots(p,a,1,0,A*bp*em,MARIONETTE);p.atkCd=.31/S.aspd;}],
 ['PUPPET LASH',1.25,'PIERCING THREAD LASH. EXTENDS ACTIVE LINKS.',({p,a,A,bp,em})=>{
  lineHit(p.x,p.y,a,p.hFull?104:74,10,e=>{if(e.threadUntil>R.time)e.threadUntil+=1;hurtE(e,A*2.1*bp*em,26,{slash:true});});
  fx.push({k:'line',x:p.x,y:p.y,a,len:84,t:.24,dur:.24,col:MARIONETTE});
 }],
 ['CURSED THREAD',5,'LINKS FOES. HITTING ONE HURTS THE OTHERS.',({p})=>threadBind(p,114)],
 ['THREAD STEP',7,'DASH ALONG A NEARBY CURSED THREAD.',({p,a})=>{
  const e=threadNodes().filter(e=>los(p.x,p.y,e.x,e.y)).sort((a,b)=>dist(p,a)-dist(p,b))[0];
  rosterShift(p,e?angTo(p,e):a,e?Math.min(78,dist(p,e)):42);fxRing(p.x,p.y,22,MARIONETTE,.25);
 }],
 ['COCOON',9,'ROOT A NEARBY FOE AND CATCH UP TO SIX SHOTS.',({p,a})=>{
  const v=rosterAim(p,118),e=rosterTargets(v.x,v.y,42).find(e=>!e.boss&&!e.prop);
  if(e){e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,1.6);}
  zones.push({k:'rosterWard',src:'f',x:e?.x??v.x,y:e?.y??v.y,r:28,t:1.6,tk:0,left:6,col:MARIONETTE});
 }],
 ['PUPPET MASTER',27,'PULL LINKED FOES TOGETHER AND DETONATE THEM.',({p,A,ep,em})=>{
  if(!threadNodes().length)threadBind(p,100);
  const nodes=threadNodes(),v=rosterAim(p,112),radius=heroTransformed()?62:46,hit=new Set();
  for(const e of nodes)e.threadUntil=0;
  for(const e of nodes){
   if(!e.boss&&!e.prop&&los(e.x,e.y,v.x,v.y))move(e,(v.x-e.x)*.65,(v.y-e.y)*.65,e.r);
   hit.add(e);hurtE(e,A*5.2*ep*em,75,{src:'e'});
  }
  for(const e of rosterTargets(v.x,v.y,radius))if(!hit.has(e))hurtE(e,A*4*ep*em,52,{src:'e'});
  fxRing(v.x,v.y,radius,MARIONETTE,.48);impact(v.x,v.y,MARIONETTE,7,true);
 }]]
});

function windColumn(p,a,A,duration,radius,speed){
 zones.push({k:'rosterWind',x:p.x,y:p.y,a,r:radius,t:duration,tk:0,dm:A,speed,col:WIND});
}
rosterAdd({
 key:'tengu',name:'TENGU',final:'STORM ASCENDANT',col:WIND,weapon:'GALE FAN',
 pose:'kunai',hat:'kasa',role:'RANGED - MOBILITY',lore:'DASH THROUGH THE FIGHT ON WIND CURRENTS.',art:['#193a3e','#36746b','#285854'],
 stats:{hp:.89,spd:1.12,dash:.78},
 kit:[
 ['FEATHER BLADE',0,'THROW A PAIR OF WIND FEATHERS.',({p,a,A,bp,em})=>{rosterShots(p,a,2,.17,A*.68*bp*em,WIND);p.atkCd=.25/S.aspd;}],
 ['GALE WING',1.2,'RELEASE A WIDE FAN OF PIERCING WINDS.',({p,a,A,bp,em})=>rosterShots(p,a,5,.17,A*.73*bp*em,WIND,{pierce:2})],
 ['WIND CUTTER',4,'FIRE A PIERCING BLADE. WIND CURRENTS EXTEND ITS REACH.',({p,a,A,qm,em})=>{
  const riding=zones.some(z=>z.k==='rosterCurrent'&&dist(z,p)<z.r);
  rosterShots(p,a,heroTransformed()?3:1,.23,A*2.25*qm*em,WIND,{pierce:5,life:riding?1.15:.8});
  if(riding&&enemies.some(e=>!e.dead&&!e.prop&&dist(p,e)<140))heroReward();
 }],
 ['TAILWIND',6,'DASH AND LEAVE A CURRENT THAT SPEEDS YOU UP.',({p,a})=>{
  const {x,y}=p;rosterShift(p,a,heroTransformed()?87:63);
  zones.push({k:'rosterCurrent',x:(x+p.x)/2,y:(y+p.y)/2,r:39,t:3,tk:0,col:WIND});
 }],
 ['CYCLONE',8,'SEND OUT A VORTEX THAT BENDS ENEMY SHOTS.',({p,a,A,ap,em})=>windColumn(p,a,A*.7*ap*em,2,28,62)],
 ['DIVINE TEMPEST',26,'SEND A HUGE TORNADO ACROSS THE ARENA.',({p,a,A,ep,em})=>{
  windColumn(p,a,A*1.5*ep*em,3.1,heroTransformed()?53:42,78);
  if(heroTransformed())for(const side of [-.55,.55])windColumn(p,a+side,A*.7*ep*em,2,25,68);
  impact(p.x,p.y,WIND,7);
 }]]
});

function buildFlow(p){
 const gap=R.time-(p.lastFlow??-10);
 p.flow=gap>.95?1:Math.min(5,(p.flow||0)+(gap>=.16?1:0));
 p.lastFlow=R.time;
}
function kaguraFlow(p){return R.time-p.lastFlow<=(heroTransformed()?2:1.3)?p.flow||0:0;}
function kaguraCut(p,a,r,damage,col){
 let hit=false;
 coneHit(p.x,p.y,a,r,2.4,e=>{if(e.iv>0)return;hit=true;hurtE(e,damage,18,{slash:true});});
 if(hit){
  buildFlow(p);
  if(p.flowBoost>R.time&&heroTransformed()){
   rosterShots(p,a,2,.5,damage*.32,col,{pierce:2});heroReward();
  }
 }
 fx.push({k:'slash',x:p.x,y:p.y,a,arc:2.4,r,t:.18,dur:.18,col});
}
rosterAdd({
 key:'kagura',name:'KAGURA',final:'CRIMSON LOTUS',col:PETAL,weapon:'RITUAL FANS',
 pose:'kunai',hat:'eboshi',role:'MELEE - COMBO',lore:'CHAIN HITS TO BUILD FLOW AND FINISH STRONG.',art:['#541c36','#9a3b55','#9d253c'],
 stats:{hp:.94,spd:1.04,dash:.88},
 kit:[
 ['DANCING CUT',0,'CLOSE FAN SLASHES BUILD FLOW.',({p,a,A,bp,em})=>{
  const boost=p.flowBoost>R.time;
  kaguraCut(p,a,boost?44:34,A*bp*em*(boost?1.45:1.2),PETAL);p.atkCd=.29/S.aspd;
 }],
 ['CRIMSON SWEEP',1.2,'A CHARGED FAN FINISHER WITH WIDE REACH.',({p,a,A,bp,em})=>kaguraCut(p,a,50,A*2.1*bp*em,PETAL)],
 ['CRESCENT FAN',4,'THROW FANS THAT CURVE BACK TOWARD YOU.',({p,a,A,qm,em})=>rosterShots(p,a,3,.25,A*1.1*qm*em,PETAL,{st:'boom',bd:a,bs:250,bT:1.15,life:1.25,pierce:3})],
 ['PIROUETTE',6,'DASH THROUGH FOES, CUTTING AS YOU SPIN.',({p,a,A,ap,em})=>{
  rosterShift(p,a,43);if(rosterBurst(p.x,p.y,38,A*1.7*ap*em,25,PETAL,{slash:true}))buildFlow(p);
 }],
 ['PERFECT RHYTHM',8,'SPEND FLOW TO EMPOWER A SERIES OF PALM-FAN CUTS.',({p})=>{
  const flow=kaguraFlow(p);if(!flow)return false;
  p.flowBoost=R.time+1+flow*.52;p.flow=0;fxRing(p.x,p.y,26,PETAL,.38);
 }],
 ['THOUSAND PETALS',26,'SPIN THROUGH A STORM OF PETALS, THEN FINISH.',({p,A,ep,em})=>{
  const flow=kaguraFlow(p);p.flow=0;if(flow>=3)heroReward(flow);
  zones.push({k:'rosterBells',x:p.x,y:p.y,r:heroTransformed()?70:56,t:1.12,tk:0,
   dm:A*ep*em*(1.1+flow*.13),col:PETAL,petals:true,follow:true,interval:.28});
 }]]
});

function sealTargets(x,y,r,cap){
 for(const e of rosterTargets(x,y,r).slice(0,cap))e.bloodSeal=R.time+8;
}
function popSeals(p,damage,limit){
 const marked=enemies.filter(e=>!e.dead&&e.bloodSeal>R.time).slice(0,limit);
 marked.forEach(e=>{e.bloodSeal=0;});
 let heal=0;
 for(const e of marked){
  rosterBurst(e.x,e.y,heroTransformed()?29:23,damage,19,BLOOD);
  if(e.dead&&!e.prop){
   heroReward(2);
   heal+=S.maxhp*(heroTransformed()?.045:.035);
   if(heroTransformed())sealTargets(e.x,e.y,42,2);
  }
 }
 p.hp=Math.min(S.maxhp,p.hp+Math.min(heal,S.maxhp*.16));
}
rosterAdd({
 key:'bloodoracle',name:'BLOOD ORACLE',final:'SCARLET PROPHET',col:BLOOD,weapon:'RITUAL BRUSH',
 pose:'staff',hat:'hood',role:'RANGED - SACRIFICE',lore:'SPEND HEALTH ON SEALS AND HARVEST THE DEAD.',art:['#421726','#7e2848','#491431'],
 stats:{hp:1.05,def:0,pw:1.08},
 kit:[
 ['SCARLET INK',0,'FIRE A PIERCING INK DART.',({p,a,A,bp,em})=>{rosterShots(p,a,1,0,A*1.22*bp*em,BLOOD,{pierce:1});p.atkCd=.32/S.aspd;}],
 ['RED SCRIBE',1.3,'PAINT A CRIMSON BURST AT YOUR CURSOR.',({p,A,bp,em})=>{const v=rosterAim(p,140);rosterBurst(v.x,v.y,27,A*2.35*bp*em,30,BLOOD);}],
 ['BLOOD SEAL',4,'SPEND 6% MAX HP TO SEAL UP TO SIX ENEMIES.',({p})=>{
  const v=rosterAim(p,125),cost=S.maxhp*.06,marked=rosterTargets(v.x,v.y,55).slice(0,6);
  if(p.hp<=cost||!marked.length)return false;
  p.hp-=cost;for(const e of marked)e.bloodSeal=R.time+8;fxRing(v.x,v.y,55,BLOOD,.4);
 }],
 ['CRIMSON PASSAGE',7,'DASH FORWARD AND LEAVE A DAMAGING BLOOD TRAIL.',({p,a,A,ap,em})=>{
  const {x,y}=p;rosterShift(p,a,61);
  for(const f of [.2,.55,.9])zones.push({k:'rosterPool',x:x+(p.x-x)*f,y:y+(p.y-y)*f,r:14,t:1.6,tk:0,dm:A*.35*ap*em,col:BLOOD});
 }],
 ['HARVEST',5,'DETONATE SEALS. MARKED KILLS RESTORE HEALTH.',({p,A,ap,em})=>popSeals(p,A*2.2*ap*em,6)],
 ['FORBIDDEN PROPHECY',27,'SEAL A WIDE AREA AND DETONATE ALL ACTIVE SEALS.',({p,A,ep,em})=>{
  sealTargets(p.x,p.y,140,heroTransformed()?10:7);popSeals(p,A*3.2*ep*em,heroTransformed()?10:7);
  impact(p.x,p.y,BLOOD,7,true);
 }]]
});

function addEcho(amount){
 const cap=heroTransformed()?12:8;
 P.bellEcho=Math.min(cap,(P.bellEcho||0)+amount);
}
rosterAdd({
 key:'bellwarden',name:'BELLWARDEN',final:'ENLIGHTENED GUARDIAN',col:CHIME,weapon:'TEMPLE BELL',
 pose:'gohei',hat:'pilgrim',role:'MELEE - COUNTER',lore:'INTERCEPT SHOTS AND TURN THEM INTO ECHO.',art:['#51413a','#9b7443','#71502a'],
 stats:{hp:1.28,spd:.93,def:2},
 kit:[
 ['BELL SWING',0,'SWING YOUR TEMPLE BELL IN A WIDE ARC.',({p,a,A,bp,em})=>{
  coneHit(p.x,p.y,a,37,2.5,e=>hurtE(e,A*1.2*bp*em,18,{slash:true}));
  fx.push({k:'slash',x:p.x,y:p.y,a,arc:2.5,r:37,t:.2,dur:.2,col:CHIME});p.atkCd=.36/S.aspd;
 }],
 ['TEMPLE TOLL',1.4,'RING A HEAVY BELL TOLL AROUND YOU.',({p,A,bp,em})=>rosterBurst(p.x,p.y,49,A*2.1*bp*em,38,CHIME)],
 ['RESONANT STRIKE',4,'SEND A DAMAGING CIRCULAR SHOCKWAVE.',({p,A,qm,em})=>rosterBurst(p.x,p.y,57,A*2.15*qm*em,46,CHIME)],
 ['SACRED CHIME',7,'DESTROY NEARBY SHOTS AND STORE THEIR ECHO.',({p})=>{
  zones.push({k:'rosterWard',src:'w',x:p.x,y:p.y,r:heroTransformed()?46:37,t:.85,tk:0,left:heroTransformed()?12:8,col:CHIME,follow:true,echo:true});
 }],
 ['ECHO RELEASE',6,'SPEND ECHO ON PIERCING RESONANCE PROJECTILES.',({p,a,A,ap,em})=>{
  const count=p.bellEcho||0;if(!count)return false;p.bellEcho=0;heroReward(count);
  rosterShots(p,a,Math.min(7,count+1),.18,A*(.9+count*.13)*ap*em,CHIME,{pierce:4});
 }],
 ['THOUSAND BELLS',28,'SEND EXPANDING WAVES THAT DISRUPT PROJECTILES.',({p,A,ep,em})=>{
  zones.push({k:'rosterBells',x:p.x,y:p.y,r:heroTransformed()?105:84,t:1.4,tk:0,dm:A*1.6*ep*em,col:CHIME,interval:.34,echo:true});
  impact(p.x,p.y,CHIME,7,true);
 }]]
});

Object.assign(CZ,{
 rosterWard(z){
  if(z.follow){z.x=P.x;z.y=P.y;}
  if(z.left<=0)return;
  const hits=rosterClear(z.x,z.y,z.r,z.left,z.col);z.left-=hits;
  if(hits&&z.echo)addEcho(hits);
 },
 rosterWind(z,dt,tick){
  const x=z.x+Math.cos(z.a)*z.speed*dt,y=z.y+Math.sin(z.a)*z.speed*dt;
  if(solid(x,y)){z.t=0;return;}z.x=x;z.y=y;
  if(!tick)return;
  z.tk=.3;
  for(const e of rosterTargets(x,y,z.r))hurtE(e,z.dm,12);
  for(const q of projs){
   if(q.from!=='e'||q.dead||q.peril||Math.hypot(q.x-x,q.y-y)>z.r)continue;
   const speed=Math.hypot(q.vx,q.vy),angle=Math.atan2(q.vy,q.vx)+.24;
   q.vx=Math.cos(angle)*speed;q.vy=Math.sin(angle)*speed;
  }
 },
 rosterCurrent(z){
  if(dist(z,P)<z.r)P.haste=Math.max(P.haste,.15);
 },
 rosterPool(z,dt,tick){
  if(!tick)return;z.tk=.3;
  for(const e of rosterTargets(z.x,z.y,z.r))hurtE(e,z.dm,6);
 },
 rosterBells(z,dt,tick){
  if(!tick)return;z.tk=z.interval;
  if(z.follow){z.x=P.x;z.y=P.y;}
  z.wave=(z.wave||0)+1;
  const radius=z.r*Math.min(1,.32+.18*z.wave);
  rosterBurst(z.x,z.y,radius,z.dm*(z.petals&&z.t<=z.interval?1.7:1),26,z.col);
  if(z.echo)addEcho(rosterClear(z.x,z.y,radius,5,z.col));
 }
});
function rosterZoneRing(z){
 ctx.globalAlpha=.55;wcirc(z.x,z.y,z.r,z.col);ctx.globalAlpha=1;
}
Object.assign(CZD,{rosterWard:rosterZoneRing,rosterWind:rosterZoneRing,rosterCurrent:rosterZoneRing,
 rosterPool:rosterZoneRing,rosterBells:()=>{}});

{
 const base=hurtE;
 hurtE=function(e,amount,posture,options){
  const linked=R&&P&&e.threadUntil>R.time&&CLS().k==='marionettist'&&!options?.chain&&!options?.foe&&!e.dead;
  const hp=e.hp;
  const result=base.apply(this,arguments);
  if(linked&&hp>e.hp){
   if(e.dead)heroReward(2);
   const damage=Math.min(hp-e.hp,hp)*(heroTransformed()?.31:.22);
   for(const target of threadNodes()){
    if(target===e)continue;
    if(!los(e.x,e.y,target.x,target.y))continue;
    base(target,damage,5,{chain:true,src:null,nost:true});
    fx.push({k:'bolt',pts:[{x:e.x,y:e.y},{x:target.x,y:target.y}],col:MARIONETTE,t:.16,dur:.16});
   }
   if(e.dead&&heroTransformed()){
    const fresh=rosterTargets(e.x,e.y,52).find(target=>!(target.threadUntil>R.time));
    if(fresh&&threadNodes().length<8){
     fresh.threadUntil=R.time+4;
     base(fresh,damage,12,{chain:true,src:null,nost:true});
     fxRing(e.x,e.y,25,MARIONETTE,.24);
    }
   }
  }
  return result;
 };
}
rosterGraze(()=>{if(CLS().k==='bellwarden')addEcho(1);});
