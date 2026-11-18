'use strict';

const SUMO_COLOUR='#f4ae72';
const IRON_BELLY_SECONDS=5;

function addSumoSpell(slot, spell) {
 const variants=SPELLS[slot];
 return variants.push({c:SUMO_COLOUR,...spell})-1;
}
const SUMO_KIT={
 m:addSumoSpell('m',{n:'PALM STRIKES',g:'P',d:'QUICK PALMS. EVERY THIRD HIT SHOVES.',dm:1,db:'b'}),
 h:addSumoSpell('h',{n:'DRIVING SHOVE',g:'>',cd:1.5,d:'SEND A FOE FLYING THROUGH THE PACK.',dm:2.1,db:'b'}),
 q:addSumoSpell('q',{n:'SHOULDER RUSH',g:'>',cd:5,d:'CHARGE THROUGH SMALL FOES.',dm:1.6,db:'q'}),
 w:addSumoSpell('w',{n:'IRON BELLY',g:'O',cd:12,d:'HEAL AND SHIELD FOR 15% OF MISSING HP.'}),
 f:addSumoSpell('f',{n:'STOMP',g:'*',cd:8,d:'STAGGER NEARBY FOES WITH A SHOCKWAVE.',dm:1.4,db:'a'}),
 e:addSumoSpell('e',{n:'RING OUT',g:'!',cd:30,d:'HURL A FOE. SLAM BOSSES AT POINT BLANK.',dm:4.8,db:'e'})
};
WTYPES['HAND WRAPS']=SUMO_KIT.m;
LMBRATE[SUMO_KIT.m]=.29;
WFAM.sumo=['HAND WRAPS'];
WSIG.sumo='HAND WRAPS';
CLASSES.push({k:'sumo',n:'SUMO',col:SUMO_COLOUR,d:'CLOSE-RANGE BRAWLER. +60% HP.',hp:1.6,spd:.96,dash:1.05,def:1,kit:SUMO_KIT});
EVONAMES.sumo=['APPRENTICE','RING NOVICE','RING FIGHTER','PALM FIGHTER','STABLE CHAMPION','SUMO','RING CHAMPION','GRAND CHAMPION','MOUNTAIN HAND','IMMOVABLE MOUNTAIN'];
{
 const baseHero=heroEV;
 heroEV=function(cls,stage){
  if(cls!=='sumo')return baseHero(cls,stage);
  return {n:EVONAMES.sumo[stage],hat:'topknot',wpn:'palms',crest:stage>=6,C:{
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
  if(sumoCanHit(e)&&distance<best){target=e;best=distance;}
 });
 return target;
}

function sumoLaunch(e,a,speed,duration,damage,src){
 sumoInterrupt(e,duration);
 e.kx=e.ky=0;
 // Keep the launch path even if the initial strike defeats the thrown foe.
 zones.push({k:'sumoThrow',src,x:e.x,y:e.y,r:e.r,t:duration,tk:0,e,
  vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,dm:damage,hit:new Set([e])});
}

CZ.sumoThrow=function(z,dt){
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
   hurtE(e,z.dm,26,{kb:Math.atan2(z.vy,z.vx)});
   spark(e.x,e.y,SUMO_COLOUR,5,65);
  }
 }
};
CZD.sumoThrow=function(z){
 const a=Math.atan2(z.vy,z.vx);
 wline(z.x,z.y,a,-12,0,SUMO_COLOUR,5);
 if(z.e.dead)drawSpr(sprOf(z.e),sx(z.x,z.y),sy(z.x,z.y)+4,true,0,false);
};

const SUMO_CASTS={
 m({p,a,A,bp,em}){
  const reach=24*(1+S.rangeM*.35);
  const e=sumoTarget(p,a,reach,1.6);
  let finisher=false;
  if(e){
   p.palmHits=(R.time-(p.lastPalmHit??-Infinity)>.9?1:(p.palmHits||0)+1)%3;
   p.lastPalmHit=R.time;
   finisher=p.palmHits===0;
   const hitAngle=angTo(p,e);
   hurtE(e,A*bp*em*(finisher?1.5:1),finisher?21:11,
    finisher?{slash:true,kb:hitAngle,kbm:2.4}:{slash:true});
  }
  fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.6,r:reach,t:.12,dur:.12,col:finisher?'#fff1c8':SUMO_COLOUR});
  p.atkCd=(finisher?.37:LMBRATE[SUMO_KIT.m])/S.aspd;
  if(e)sfx('hit');
 },
 h({p,a,A,bp,em}){
  const e=sumoTarget(p,a,30*(1+S.rangeM*.35),1.35),damage=A*2.1*bp*em;
  if(e){
   if(sumoCanThrow(e))sumoLaunch(e,a,p.hFull?330:230,p.hFull?.29:.23,damage*.75,'h');
   hurtE(e,damage,e.boss?(p.hFull?88:58):32,{slash:true});
   impact(e.x,e.y,SUMO_COLOUR,p.hFull?5:3);
  }
  fxRing(p.x+Math.cos(a)*18,p.y+Math.sin(a)*18,20,SUMO_COLOUR,.21);
  sfx('break');
 },
 q({p,a,A,qm,em}){
  const hit=new Set(),damage=A*1.6*qm*em;
  const dx=Math.cos(a)*2,dy=Math.sin(a)*2,x=p.x,y=p.y;
  for(let i=0;i<24;i++){
   const nx=p.x+dx,ny=p.y+dy;
   if(blocked(nx,ny,4))break;
   let stop=false;
   for(const e of enemies){
    if(!sumoCanHit(e)||hit.has(e)||Math.hypot(nx-e.x,ny-e.y)>e.r+6||!los(p.x,p.y,e.x,e.y))continue;
    hit.add(e);
    const heavy=!sumoCanThrow(e)||e.elite||e.r>=8;
    hurtE(e,damage,heavy?32:18,heavy?{}:{kb:a,kbm:1.8});
    stop=stop||heavy;
   }
   if(stop)break;
   p.x=nx;p.y=ny;
  }
  fx.push({k:'line',x,y,a,len:dist(p,{x,y}),t:.2,dur:.2,col:SUMO_COLOUR});
  impact(p.x,p.y,SUMO_COLOUR,3);
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
  const radius=39*AZ();
  coneHit(p.x,p.y,0,radius,TAU,e=>{
   if(!sumoCanHit(e))return;
   hurtE(e,A*1.4*ap*em,e.boss?44:20);
   if(sumoCanThrow(e)&&!e.dead)sumoInterrupt(e,.85);
  });
  fxRing(p.x,p.y,radius,SUMO_COLOUR,.35);
  impact(p.x,p.y,SUMO_COLOUR,5);
  sfx('break');
 },
 e({p,a,A,ep,em}){
  const e=sumoTarget(p,a,28,2.2),damage=A*4.8*ep*em;
  if(e){
   if(sumoCanThrow(e))sumoLaunch(e,a,385,.38,damage,'e');
   hurtE(e,damage,e.boss?130:55,{slash:true});
  }
  fxRing(p.x,p.y,34,SUMO_COLOUR,.35);
  impact(p.x,p.y,SUMO_COLOUR,5);
  sfx('boss');
 }
};
for(const [slot,cast] of Object.entries(SUMO_CASTS)){
 NEWCAST[SUMO_KIT[slot]*10+SLOTS.indexOf(slot)]=ctx=>{
  if((slot==='m'||slot==='h')&&ctx.mik>0)ctx.bp*=1.6;
  cast(ctx);
 };
}

SPRULES.unshift([/PALM STRIKES|DRIVING SHOVE|SHOULDER RUSH/,'dash'],[/IRON BELLY/,'shield'],
 [/^STOMP$/,'whirl'],[/RING OUT/,'shout']);
