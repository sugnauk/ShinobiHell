'use strict';

// Each technique uses the existing five combat slots and the current run's evolution.
const FINAL_HERO_NAMES={wizard:'ARCHMAGE',shinobi:'SHADOW LORD',samurai:'SWORD SAINT',
 archer:'STORM HUNTER',onmyoji:'SPIRIT SOVEREIGN',gunner:'SIEGEBREAKER',lancer:'DRAGON LANCER'};
const HERO_TRAITS={
 wizard:'ELEMENTS REACT WITH ONE ANOTHER.',shinobi:'MARK FOES FOR EXECUTION.',
 samurai:'COUNTER WITH E, THEN SPEND RESOLVE WITH A FULL RMB CHARGE.',
 archer:'EMBED ARROWS WITH PRECISE SHOTS OR Q. RMB AND R DETONATE THEM.',
 onmyoji:'Q SUMMONS ATTACK AND GUARD SPIRITS. EVOLVED, CAST F FIRST TO FUSE THEM.',
 gunner:'BASIC HITS BUILD HEAT. SPEND IT WITH RMB OR R.',
 lancer:'MOVE AND STRIKE TO BUILD MOMENTUM. SPEND IT WITH RMB, Q OR R.',sumo:'MOUNTAIN ENDURANCE REDUCES DAMAGE.'
};
for(const [key,name] of Object.entries(FINAL_HERO_NAMES)){
 if(key==='wizard')WIZEVO[9].n=name;
 else EVONAMES[key][9]=name;
}
// The fifth boss reward awakens the existing evolution path. Keep both form names in the same save progression.
const AWAKENED_NAMES={wizard:'STORM ADEPT',archer:'GALE MARKSMAN',samurai:'CRIMSON HATAMOTO',
 shinobi:'VEILED ASSASSIN',onmyoji:'SPIRIT BINDER',gunner:'POWDER CAPTAIN',lancer:'DRAGON VANGUARD',
 sumo:'STABLE GRANDMASTER',marionettist:'SILK WEAVER',tengu:'GALE HERALD',kagura:'PETAL DANCER',
 bloodoracle:'CRIMSON MIKO',bellwarden:'RESONANT KEEPER'};
for(const [key,name] of Object.entries(AWAKENED_NAMES)){
 if(key==='wizard')WIZEVO[5].n=name;else EVONAMES[key][5]=name;
}
Object.assign(CLSINFO,ROSTER_INFO);
for(const [key,trait] of Object.entries(HERO_TRAITS))CLSINFO[key].lore=trait;
const HERO_LIMITS={
 wizard:'SPELLS NEED SETUP',shinobi:'LOW HEALTH',samurai:'SLOWER DODGE RECOVERY',
 archer:'LOW HEALTH',onmyoji:'SPIRITS NEED TIME',gunner:'SLOW RELOAD',lancer:'NEEDS ROOM TO MOVE',
 sumo:'SHORT REACH',marionettist:'NEEDS GROUPS OF FOES',tengu:'LOW HEALTH',
 kagura:'MISSED TIMINGS BREAK FLOW',bloodoracle:'SEALS COST HEALTH',bellwarden:'ECHO NEEDS ENEMY SHOTS'
};
for(const [key,limit] of Object.entries(HERO_LIMITS))CLSINFO[key].limit=limit;

const heroReward=(n=1)=>{
 if(R&&!R.test&&!R.training&&!R.rush)R.techniqueXP=Math.min(140,(R.techniqueXP||0)+n);
};

function gunnerHeat(amount){P.heat=Math.min(6,(P.heat||0)+amount);}

function techniqueStatus(e,key){
 return e.st?.[key]>0;
}

{
 const base=hurtE;
 hurtE=function(e,damage,pd,o){
  if(!P||!R||o?.chain||o?.foe||e.dead||e.air||e.iv>0)return base.apply(this,arguments);
  const src=o?.src!==undefined?o.src:castSrc,key=CLS().k,final=heroTransformed(),hp=e.hp;
  let executed=false,arrows=0;
  if(!src)return base.apply(this,arguments);
  if(key==='shinobi'){
   if(e.shadowMark>R.time&&(src==='h'||src==='q'||src==='e')){
    executed=true;e.shadowMark=0;damage*=final?1.8:1.46;pd+=25;if(!e.prop)heroReward(2);
    fxRing(e.x,e.y,final?24:16,'#b885ff',.23);
   }else if(src==='q')e.shadowMark=R.time+4;
  }else if(key==='samurai'&&src==='h'&&P.iaiResolve>0){
   damage*=1+(final?.16:.12)*P.iaiResolve;
   pd+=P.iaiResolve*8;
  }else if(key==='archer'){
   if(src==='q'||src==='m'&&Math.abs(angDiff(angTo(P,e),P.aim))<.18){
    e.embedded=Math.min(final?7:5,(e.embedded||0)+1);
   }
   if((src==='h'||src==='e')&&e.embedded){
    arrows=e.embedded;damage*=1+arrows*(final?.22:.15);e.embedded=0;if(!e.prop)heroReward(2);
    fxRing(e.x,e.y,final?24:16,'#a5f0aa',.24);
   }
  }else if(key==='gunner'){
   if(src==='m')gunnerHeat(.7);
   if((src==='h'||src==='e')&&P.gunHeat>0&&P.gunHeatUntil>R.time)damage*=1+P.gunHeat*(final?.13:.1);
  }else if(key==='lancer'){
   if(src==='m')P.momentum=Math.min(6,(P.momentum||0)+.4);
   if((src==='h'||src==='q'||src==='e')&&P.spentMomentum>0)damage*=1+P.spentMomentum*(final?.13:.09);
  }
  const result=base.call(this,e,damage,pd,o);
  if(arrows){
   for(const target of rosterTargets(e.x,e.y,final?27:17)){
    if(target!==e)base(target,S.atk*arrows*(final?.29:.18),10,{src,nost:true,chain:true});
   }
  }
  if(executed&&final&&e.dead&&!e.prop){
   for(const target of rosterTargets(e.x,e.y,47).slice(0,3))target.shadowMark=R.time+4;
  }
  if(key==='wizard'&&e.hp<hp&&!e.dead){
   const element=o?.el;
   const reaction=element==='burn'&&techniqueStatus(e,'chillT')||
    element==='chill'&&techniqueStatus(e,'burn')||element==='shock'&&(techniqueStatus(e,'burn')||techniqueStatus(e,'chillT'));
   if(reaction&&!(e.nextReaction>R.time)){
    e.nextReaction=R.time+1;
    if(element==='shock'&&techniqueStatus(e,'chillT'))e.st.chillT=0;
    else if(element==='chill'||element==='shock')e.st.burn=0;
    else e.st.chillT=0;
    for(const target of rosterTargets(e.x,e.y,final?43:29))
     base(target,S.atk*(final?1.4:.8),12,{src:null,nost:true,chain:true});
    fxRing(e.x,e.y,final?43:29,'#ffe1b0',.3);heroReward(2);
   }
  }
  return result;
 };
}

{
 const base=perfectDodge;
 perfectDodge=function(){
  const count=R.pdodge||0;
  base.apply(this,arguments);
  if(CLS().k!=='shinobi'||count===(R.pdodge||0))return;
  const final=heroTransformed();
  if(zones.filter(z=>z.k==='clone').length>=5)return;
  zones.push({k:'clone',src:'e',x:P.x-8,y:P.y+8,r:0,ang:P.aim,t:final?4:2.2,tk:0,dm:S.atk*(final?.55:.4)});
  heroReward();
 };
}
{
 const base=hitPlayer;
 hitPlayer=function(raw,x,y,o){
  const counter=CLS().k==='samurai'&&P.guardSt>0&&!o?.peril;
  const result=base.apply(this,arguments);
  if(counter&&P.guardSt===0){
   P.resolve=Math.min(5,(P.resolve||0)+1);
   heroReward(2);
   if(heroTransformed()){
    const a=angTo(P,{x,y});
    rosterShots(P,a,3,.24,S.atk*.65,'#ffdbac',{src:'w',pierce:2});
   }
  }
  return result;
 };
}
{
 const base=updPlayer;
 updPlayer=function(dt){
  base(dt);
  if(CLS().k==='lancer'&&(P.mv||P.dash>0))P.momentum=Math.min(6,(P.momentum||0)+dt*(P.dash>0?4:1.2));
 };
}

{
 const base=classCast;
 classCast=function(k){
  const p=P,key=CLS().k,final=heroTransformed();
  const cooldown=k==='w'?'rmb':k;
  const before=k==='m'?p.atkCd:p.ab[cooldown];
  const ready=!p.stag&&!(before>0);
  if(ready&&key==='samurai'&&k==='h')p.iaiResolve=p.hFull?(p.resolve||0):0;
  if(ready&&key==='gunner'&&(k==='h'||k==='e')){p.gunHeat=(p.heat||0)>=2?p.heat:0;p.gunHeatUntil=R.time+1.5;}
  if(ready&&key==='lancer'&&'hqe'.includes(k))p.spentMomentum=(p.momentum||0)>=2?p.momentum:0;
  const oldZones=zones.length;
  const result=base.apply(this,arguments);
  if((k==='m'?p.atkCd:p.ab[cooldown])===before)return result;
  if(key==='samurai'&&k==='h'){
   if(p.iaiResolve){
    p.resolve=0;
    p.iaiResolveUntil=R.time+.5;
    const endX=p.x+Math.cos(p.aim)*28,endY=p.y+Math.sin(p.aim)*28;
    rosterBurst(endX,endY,final?37:24,S.atk*p.iaiResolve*(final?.35:.23),18,'#ffe0aa',{src:'h',chain:true});
   }
  }
  if(key==='gunner'&&(k==='h'||k==='e')&&p.gunHeat>=2){
   const v=rosterAim(p,k==='e'?147:105);
   p.heat=0;
   rosterBurst(v.x,v.y,final?42:30,S.atk*(1+p.gunHeat*.28),32,'#ff9f65',{src:k});
   heroReward();
  }
  if(key==='lancer'&&'hqe'.includes(k)&&p.spentMomentum>=2){
   p.momentum=0;
   rosterShots(p,p.aim,final?3:1,.26,S.atk*(.75+p.spentMomentum*.16),'#9cdfff',{src:k,pierce:4});
   heroReward();
  }
  if(final&&key==='shinobi'&&k==='e'){
   for(const z of zones.slice(oldZones).filter(z=>z.k==='clone')){
    z.t+=1.5;z.evolved=true;
   }
   const clones=zones.filter(z=>z.k==='clone'&&z.t>0);
   for(const z of clones.slice(0,Math.max(0,clones.length-5)))z.t=0;
  }
  if(key==='onmyoji'&&k==='q'){
   const support=zones.some(z=>z.k==='healing'||z.k==='heal');
   const summon=zones.slice(oldZones).find(z=>z.k==='shiki');
   if(summon){
    const col='#c2f3df',x=summon.x,y=summon.y;
    zones.push({k:'rosterWard',src:'q',x,y,r:32,t:1.6,tk:0,left:final?7:3,col});
    if(final&&support){
     summon.k='rosterYokai';summon.t=8;summon.dm*=2.4;
     rosterBurst(x,y,58,S.atk*2.5,52,col,{src:k});heroReward(3);
    }
    const spirits=zones.filter(z=>(z.k==='shiki'||z.k==='rosterYokai')&&z.t>0);
    for(const z of spirits.slice(0,Math.max(0,spirits.length-4)))z.t=0;
   }
  }else if(final&&key==='onmyoji'&&k==='e'){
   for(const z of zones.filter(z=>z.t>0&&(z.k==='shiki'||z.k==='rosterYokai')).slice(0,4)){
    rosterBurst(z.x,z.y,37,S.atk*2.2,38,'#c2f3df',{src:k});z.t=0;
   }
  }else if(final&&key==='archer'&&k==='q'){
   rosterShots(p,p.aim,3,.2,S.atk*.7,'#a5f0aa',{src:k,home:true,pierce:1});
  }
  return result;
 };
}

CZ.rosterYokai=function(z,dt,tick){
 z.ang+=dt*1.5;z.x=P.x+Math.cos(z.ang)*28;z.y=P.y+Math.sin(z.ang)*28;
 if(!tick)return;
 z.tk=.52;
 const e=nearestFoe(z.x,z.y,170);
 if(e)rosterShots(z,angTo(z,e),3,.25,z.dm,'#c2f3df',{src:'q',home:true,pierce:1});
};
CZD.rosterYokai=function(z){
 const x=sx(z.x,z.y),y=sy(z.x,z.y)-15;
 circ(x,y,5,'#c2f3df');
 ctx.fillStyle='#effff9';ctx.fillRect(x-3,y-3,7,7);
 ctx.fillStyle='#625089';ctx.fillRect(x-2,y-1,1,2);ctx.fillRect(x+2,y-1,1,2);
};

{
 const base=updWorld;
 updWorld=function(dt){
  base(dt);
  if(P.iaiResolve>0&&R.time>(P.iaiResolveUntil||0))P.iaiResolve=0;
 };
}

// Awakened ultimates leave a second strike. Its origin follows the hero's combat role.
const HERO_RESURGE={
 wizard:96,archer:108,samurai:24,shinobi:28,onmyoji:53,gunner:106,lancer:58,
 sumo:0,marionettist:90,tengu:78,kagura:0,bloodoracle:70,bellwarden:0
};
CZ.heroResurge=function(z){if(z.t>0)return;
 rosterBurst(z.x,z.y,z.r,z.dm,22,z.col,{src:'e',chain:true});sfx('break');};
CZD.heroResurge=z=>{if(z.t>.42)return;ctx.globalAlpha=.42;wcirc(z.x,z.y,z.r,z.col);ctx.globalAlpha=1;};

{
 const base=castUlt;
 castUlt=function(){
  const before=P.ab.e;
  const result=base.apply(this,arguments);
  if(P.ab.e<=before||P.evo<5)return result;
  const key=CLS().k,final=heroTransformed(),range=HERO_RESURGE[key],v=range?rosterAim(P,range):P;
  const delay=key==='marionettist'&&ultName()==='GRAND THEATRE'?MAR_SLAM+.28:.42;
  zones.push({k:'heroResurge',src:'e',x:v.x,y:v.y,r:final?36:27,t:delay,tk:0,dm:S.atk*(final?1.75:1.1),col:CLS().col});
  if(key==='wizard'&&final){
   const v=rosterAim(P,135);
   windColumn(v,P.aim,S.atk*.75,1.7,36,35);
   zones[zones.length-1].src='e';
  }
  return result;
 };
}

{
 const base=castShow;
 castShow=function(k){
  base.apply(this,arguments);
  const key=CLS().k,look=masteryLook(key),style=look.fx||0;
  if(style){
   const col=CLS().col,ultimate=k==='e';
   fxRing(P.x,P.y,ultimate&&style>=2?48:20+style*3,col,.28);
   spark(P.x,P.y,col,Math.min(14,3+style*2),64);
   if(ultimate&&style>=3){
    const pose=ABPOSE;
    if(pose)ABPOSE={...pose,dur:pose.dur*1.16};
    for(const side of [-1,1]){
     const a=P.aim+side*.8;
     fx.push({k:'slash',x:P.x,y:P.y,a,arc:1.2,r:25,t:.36,dur:.36,col});
    }
    if(style>=4)fxRing(P.x,P.y,58,'#fff2c4',.54);
   }
  }
 };
}

{const base=evolve;evolve=function(){
 const previous=P.evo||0;
 const result=base.apply(this,arguments);
 if(P.evo>previous){
  const key=CLS().k,col=CLS().col,look=masteryLook(key);
  fxRing(P.x,P.y,heroTransformed()?48:31,col,.54);
  if(P.evo===5){txtFx(P.x,P.y-24,'AWAKENED',col,2);fxRing(P.x,P.y,40,'#fff',.62);sfx('rare');}
  if(look.skin===2){
   fxRing(P.x,P.y,58,'#fff0b0',.65);spark(P.x,P.y,col,12,82);
  }
 }
 return result;
};}

function heroTechniqueDisplay(){
 switch(CLS().k){
  case 'samurai':return ['RESOLVE',P.resolve,5];
  case 'gunner':return ['HEAT',P.heat,6];
  case 'lancer':return ['MOMENTUM',P.momentum,6];
  case 'kagura':return ['FLOW',kaguraFlow(P),5];
  case 'bellwarden':return ['ECHO',P.bellEcho,heroTransformed()?12:8];
 }
}
{const base=drawHUD;drawHUD=function(){
 base.apply(this,arguments);
 const gauge=heroTechniqueDisplay();
 if(!gauge)return;
 const [name,value,maximum]=gauge,label=name+' '+Math.floor(value||0)+' / '+maximum;
 txt(label,Math.round((W-txtW(label))/2),H-24,CLS().col);
};}

{const base=drawEnemy;drawEnemy=function(e){
 base.apply(this,arguments);
 if(e.dead||!e.awake)return;
 const thread=e.threadUntil>R.time,seal=e.bloodSeal>R.time,marked=e.shadowMark>R.time,arrows=e.embedded||0;
 if(!thread&&!seal&&!marked&&!arrows)return;
 const x=sx(e.x,e.y),y=sy(e.x,e.y)-2;
 if(thread){
  const anchor=enemies.find(target=>!target.dead&&target.threadUntil>R.time);
  if(anchor&&anchor!==e&&los(anchor.x,anchor.y,e.x,e.y)){
   ctx.globalAlpha=.4;sline(x,y,sx(anchor.x,anchor.y),sy(anchor.x,anchor.y)-2,MARIONETTE);ctx.globalAlpha=1;
  }
 }
 ctx.fillStyle=thread?MARIONETTE:seal?BLOOD:marked?'#b885ff':'#a5f0aa';
 const count=arrows||1;
 for(let i=0;i<count;i++)ctx.fillRect(x-2*count+1+4*i,y,2,2);
};}

// Last stats wrapper: class, gear, Temple, synergies and Daily have all applied.
{const _cs=calcStats;calcStats=function(){const s=_cs.apply(this,arguments);
 s.dashCd=Math.max(s.dashCd,s.dashIv*2.5);s.dodge=Math.min(.30,s.dodge||0);return s;};}
