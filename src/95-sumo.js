'use strict';

const SUMO_COLOUR='#f4ae72';
const IRON_BELLY_SECONDS=5;

function addSumoSpell(slot, spell) {
 const variants=SPELLS[slot];
 return variants.push({c:SUMO_COLOUR,...spell})-1;
}
const SUMO_KIT={
 m:addSumoSpell('m',{n:'PALM STRIKES',g:'P',d:'QUICK PALMS. EVERY THIRD HIT SHOVES.',dm:1.28,db:'b'}),
 h:addSumoSpell('h',{n:'DRIVING SHOVE',g:'>',cd:1.5,d:'SEND A FOE FLYING THROUGH THE PACK.',dm:2.7,db:'b'}),
 q:addSumoSpell('q',{n:'SUMO TOSS',g:'>',cd:5,d:'THROW A FOE. LANDING HITS IN A CIRCLE.',dm:2.2,db:'q'}),
 w:addSumoSpell('w',{n:'IRON BELLY',g:'O',cd:12,d:'HEAL AND SHIELD FOR 15% OF MISSING HP.'}),
 f:addSumoSpell('f',{n:'STOMP',g:'*',cd:7,d:'STAGGER NEARBY FOES WITH A SHOCKWAVE.',dm:2.05,db:'a'}),
 e:addSumoSpell('e',{n:'GRAND SLAM',g:'!',cd:26,d:'SLAM THE GROUND AND LAUNCH NEARBY FOES.',dm:6.2,db:'e'})
};
WTYPES['HAND WRAPS']=SUMO_KIT.m;
LMBRATE[SUMO_KIT.m]=.29;
WFAM.sumo=['HAND WRAPS'];
WSIG.sumo='HAND WRAPS';
CLASSES.push({k:'sumo',n:'SUMO',col:SUMO_COLOUR,d:'CLOSE-RANGE BRAWLER. 15% LESS DAMAGE. +60% HP.',hp:1.6,incomingDamage:.85,spd:.96,dash:1.05,def:1,kit:SUMO_KIT});
EVONAMES.sumo=['APPRENTICE','RING NOVICE','RING FIGHTER','PALM FIGHTER','STABLE CHAMPION','SUMO','RING CHAMPION','GRAND CHAMPION','MOUNTAIN HAND','YOKOZUNA'];
{
 const baseHero=heroEV;
 heroEV=function(cls,stage){
  if(cls!=='sumo')return baseHero(cls,stage);
  return {n:EVONAMES.sumo[stage],hat:'topknot',wpn:'palms',sumoStage:stage,C:{
   hat:'#241a21',hatL:'#55404b',skin:'#dc9b71',robe:mixC('#784457','#a03431',stage/9),
   robeS:'#622d37',trim:stage>=6?'#ffe19b':'#ece0bd',band:'#f5e7ca',boot:'#946045'
  }};
 };
}

const sumoCanHit=e=>!e.dead&&!e.air&&!(e.iv>0)&&!e.ghost;
const sumoCanThrow=e=>!e.boss&&!e.prop&&e.type!=='turret';
function sumoInterrupt(e,seconds){
 e.act=null;
 e.tele=0;
 e.stun=Math.max(e.stun||0,seconds);
}
function sumoTarget(p,a,reach,arc){
 let target=null,best=Infinity;
 coneHit(p.x,p.y,a,reach,arc,e=>{
  const distance=dist(p,e)-e.r;
  if(sumoCanHit(e)&&!e.sumoFlight&&distance<best){target=e;best=distance;}
 });
 return target;
}

function sumoLaunch(e,a,speed,duration,damage,src){
 sumoInterrupt(e,duration);
 e.kx=e.ky=0;
 e.sumoFlight=true;
 // Keep the launch path even if the initial strike defeats the thrown foe.
 zones.push({k:'sumoThrow',src,x:e.x,y:e.y,r:e.r,t:duration,duration,tk:0,e,
  vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,dm:damage,hit:new Set([e])});
}

CZ.sumoThrow=function(z,dt){
 const toss=z.src==='q';
 const step=Math.min(dt,Math.max(0,z.t+dt));
 const count=Math.max(1,Math.ceil(Math.hypot(z.vx,z.vy)*step/4));
 for(let i=0;i<count;i++){
  const x=z.x+z.vx*step/count,y=z.y+z.vy*step/count;
  if(blocked(x,y,z.r)){z.t=0;impact(z.x,z.y,SUMO_COLOUR,3);break;}
  z.x=x;z.y=y;
  if(!z.e.dead){z.e.x=x;z.e.y=y;}
  for(const e of enemies){
   if(!sumoCanHit(e)||z.hit.has(e)||dist(z,e)>z.r+e.r||!los(x,y,e.x,e.y))continue;
   z.hit.add(e);
   hurtE(e,z.dm*(toss?.55:1),26,{kb:Math.atan2(z.vy,z.vx)});
   if(toss)heroReward();
   if(toss&&heroTransformed()){
    for(const nearby of rosterTargets(e.x,e.y,21)){
     if(z.hit.has(nearby))continue;
     z.hit.add(nearby);hurtE(nearby,z.dm*.34,15,{src:'q',kb:angTo(e,nearby)});
    }
    fxRing(e.x,e.y,21,SUMO_COLOUR,.26);
   }
   spark(e.x,e.y,SUMO_COLOUR,5,65);
  }
 }
 if(toss){
  z.e.z=z.t>0?Math.sin(Math.PI*(1-z.t/z.duration))*27:0;
  if(z.t<=0)sumoShock(z.x,z.y,(P.evo>=9?43:34)*AZ(),z.dm,42,'q');
 }
 if(z.t<=0)z.e.sumoFlight=false;
};
CZD.sumoThrow=function(z){
 const a=Math.atan2(z.vy,z.vx);
 if(z.src==='h')wline(z.x,z.y,a,-12,0,SUMO_COLOUR,5);
 if(z.e.dead)drawSpr(sprOf(z.e),sx(z.x,z.y),sy(z.x,z.y)+4-(z.e.z||0),true,0,false);
};

function sumoShock(x,y,r,damage,posture,src){
 coneHit(x,y,0,r,TAU,e=>{
  if(sumoCanHit(e))hurtE(e,damage,posture,{src,kb:e.sumoFlight?undefined:angTo({x,y},e)});
 });
 fxRing(x,y,r,'#fff1c8',.4);
 impact(x,y,SUMO_COLOUR,5);
 sfx('break');
}

CZ.sumoLift=function(z){
 const e=z.e;
 if(e.dead){z.t=0;return;}
 const f=clamp(1-z.t/z.duration,0,1);
 e.z=z.stomp?(f<.35?1-(1-f/.35)**2:1-((f-.35)/.65)**2)*31:Math.sin(Math.PI*f)*31;
 if(z.t<=0){
  e.sumoFlight=false;
  if(sumoCanHit(e))hurtE(e,z.dm,23,{src:'e',impactCue:!!z.stomp});
  if(z.stomp){e.kick={a:0,p:0,t:.18,dur:.18,drop:4};sumStamp(e.x,e.y,10,.22);
   if(!z.stomp.landed){z.stomp.landed=true;snd('sumoStone');}}
  else fxRing(e.x,e.y,14,SUMO_COLOUR,.24);
 }
};
CZD.sumoLift=()=>{};

CZ.sumoAftershock=function(z){
 if(z.t<=0)sumoShock(z.x,z.y,z.r,z.dm,34,'e');
};
CZD.sumoAftershock=()=>{};

const SUMO_CASTS={
 m({p,a,A,bp,em}){
  const reach=29*(1+S.rangeM*.35);
  const e=sumoTarget(p,a,reach,1.6);
  let finisher=false;
  if(e){
   p.palmHits=(R.time-(p.lastPalmHit??-Infinity)>.9?1:(p.palmHits||0)+1)%3;
   p.lastPalmHit=R.time;
   finisher=p.palmHits===0;
   const hitAngle=angTo(p,e);
   const damage=A*1.28*bp*em*(finisher?1.65:1);
   hurtE(e,damage,finisher?30:13,finisher?{slash:true,kb:hitAngle,kbm:2.7}:{slash:true});
   let extra=2;
   coneHit(p.x,p.y,a,reach,1.6,other=>{
    if(other===e||!sumoCanHit(other)||extra<=0)return;
    extra--;
    hurtE(other,damage*.65,finisher?22:10,finisher?{slash:true,kb:angTo(p,other)}:{slash:true});
   });
   if(finisher){impact(e.x,e.y,SUMO_COLOUR,3);sfx('break');}
  }
  fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.6,r:reach,t:.12,dur:.12,col:finisher?'#fff1c8':SUMO_COLOUR});
  p.atkCd=(finisher?.37:LMBRATE[SUMO_KIT.m])/S.aspd;
  if(e)sfx('hit');
 },
 h({p,a,A,bp,em}){
  const e=sumoTarget(p,a,30*(1+S.rangeM*.35),1.35),damage=A*2.7*bp*em;
  if(e){
   if(sumoCanThrow(e))sumoLaunch(e,a,p.hFull?370:250,p.hFull?.34:.24,damage*.8,'h');
   hurtE(e,damage,e.boss?(p.hFull?88:58):32,{slash:true});
   impact(e.x,e.y,SUMO_COLOUR,p.hFull?5:3);
  }
  fxRing(p.x+Math.cos(a)*18,p.y+Math.sin(a)*18,20,SUMO_COLOUR,.21);
  sfx('break');
 },
 q({p,a,A,qm,em}){
  let target=null,range=Infinity;
  coneHit(p.x,p.y,a,36,1.95,e=>{
   const distance=dist(p,e)-e.r;
   if(sumoCanHit(e)&&sumoCanThrow(e)&&!e.sumoFlight&&distance<range){target=e;range=distance;}
  });
  if(!target){
   const heavy=sumoTarget(p,a,36,1.95);
   if(!heavy||sumoCanThrow(heavy)){setToast('NO FOE TO THROW',SUMO_COLOUR,.8);return false;}
   hurtE(heavy,A*2.2*qm*em,65,{slash:true});
   impact(heavy.x,heavy.y,SUMO_COLOUR,4);sfx('break');return;
  }
  sumoLaunch(target,a,218,.46,A*2.2*qm*em,'q');
  sfx('dash');
 },
 w({p}){
  const missing=Math.max(0,S.maxhp-p.hp);
  const recovery=missing*.15;
  p.hp+=recovery;
  p.ironBellyShield=recovery;
  p.ironBellyPower=Math.min(.4,.5*missing/S.maxhp);
  p.ironBellyUntil=R.time+IRON_BELLY_SECONDS;
  fxRing(p.x,p.y,25,'#8cf',.4);
  if(recovery>0)txtFx(p.x,p.y-10,'+'+Math.round(recovery)+' HP / SHIELD','#8cf');
  sfx('heal');
 },
 f({p,A,ap,em}){
  const radius=45*AZ();
  coneHit(p.x,p.y,0,radius,TAU,e=>{
   if(!sumoCanHit(e))return;
   hurtE(e,A*2.05*ap*em,e.boss?60:29);
   if(sumoCanThrow(e)&&!e.dead)sumoInterrupt(e,.85);
  });
  fxRing(p.x,p.y,radius,SUMO_COLOUR,.35);
  impact(p.x,p.y,SUMO_COLOUR,5);
  sfx('break');
 },
 e({p,A,ep,em}){
  const radius=62*AZ(),damage=A*6.2*ep*em;
  coneHit(p.x,p.y,0,radius,TAU,e=>{
   if(!sumoCanHit(e))return;
   hurtE(e,damage,e.boss?165:55,{slash:true});
   if(!e.dead&&sumoCanThrow(e)&&!e.sumoFlight){
    const duration=.7;
    sumoInterrupt(e,duration);
    e.z=1;e.kx=e.ky=0;e.sumoFlight=true;
    zones.push({k:'sumoLift',src:'e',e,t:duration,tk:0,duration,dm:damage*.42});
   }
  });
  if(p.evo>=9)zones.push({k:'sumoAftershock',src:'e',x:p.x,y:p.y,t:.78,tk:0,r:radius*1.28,dm:damage*.5});
  fxRing(p.x,p.y,radius,'#fff1c8',.48);
  fxRing(p.x,p.y,radius*.55,SUMO_COLOUR,.26);
  impact(p.x,p.y,SUMO_COLOUR,8,true);
  sfx('boss');
 }
};
for(const [slot,cast] of Object.entries(SUMO_CASTS)){
 NEWCAST[SUMO_KIT[slot]*10+SLOTS.indexOf(slot)]=ctx=>{
  if((slot==='m'||slot==='h')&&ctx.mik>0)ctx.bp*=1.6;
  return cast(ctx);
 };
}

SPRULES.unshift([/PALM STRIKES|DRIVING SHOVE|SUMO TOSS/,'dash'],[/IRON BELLY/,'shield'],
 [/^STOMP$/,'whirl'],[/GRAND SLAM/,'shout']);
