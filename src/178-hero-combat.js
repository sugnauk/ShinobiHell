'use strict';

// Each technique uses the existing five combat slots and the current run's evolution.
const FINAL_HERO_NAMES={wizard:'ARCHMAGE',shinobi:'SHADOW LORD',samurai:'SWORD SAINT',
 archer:'STORM HUNTER',onmyoji:'SPIRIT SOVEREIGN',gunner:'SIEGEBREAKER',lancer:'DRAGON LANCER'};
const HERO_TRAITS={
 wizard:'ELEMENTS REACT WITH ONE ANOTHER.',shinobi:'MARK FOES FOR EXECUTION.',
 samurai:'COUNTERS BUILD RESOLVE.',archer:'EMBED ARROWS, THEN DETONATE THEM.',
 onmyoji:'COMMAND ATTACKING AND DEFENSIVE SPIRITS.',gunner:'SUSTAINED FIRE BUILDS HEAT.',
 lancer:'MOVE AND STRIKE TO BUILD MOMENTUM.',sumo:'MOUNTAIN ENDURANCE REDUCES DAMAGE.'
};
for(const [key,name] of Object.entries(FINAL_HERO_NAMES)){
 if(key==='wizard')WIZEVO[9].n=name;
 else EVONAMES[key][9]=name;
}
Object.assign(CLSINFO,ROSTER_INFO);
for(const [key,trait] of Object.entries(HERO_TRAITS))CLSINFO[key].lore=trait;

const heroReward=(n=1)=>{
 if(R&&!R.test&&!R.training&&!R.rush)R.techniqueXP=Math.min(140,(R.techniqueXP||0)+n);
};

function techniqueStatus(e,key){
 return e.st?.[key]>0;
}

{
 const base=hurtE;
 hurtE=function(e,damage,pd,o){
  if(!P||!R||o?.chain||o?.foe||e.dead||e.air||e.iv>0)return base.apply(this,arguments);
  const src=o?.src!==undefined?o.src:castSrc,key=CLS().k,final=heroTransformed(),hp=e.hp;
  if(!src)return base.apply(this,arguments);
  if(key==='shinobi'){
   if(e.shadowMark>R.time&&(src==='h'||src==='e')){
    e.shadowMark=0;damage*=final?1.8:1.46;pd+=25;heroReward(2);
    fxRing(e.x,e.y,final?24:16,'#b885ff',.23);
   }else if(src==='q'||src==='m'&&Math.random()<S.crit+.1)e.shadowMark=R.time+4;
  }else if(key==='samurai'&&src==='h'&&P.iaiResolve>0){
   damage*=1+(final?.16:.12)*P.iaiResolve;
   pd+=P.iaiResolve*8;
  }else if(key==='archer'){
   if(src==='m'&&Math.abs(angDiff(angTo(P,e),P.aim))<.18){
    e.embedded=Math.min(final?7:5,(e.embedded||0)+1);
   }
   if((src==='h'||src==='e')&&e.embedded){
    damage*=1+e.embedded*(final?.22:.15);e.embedded=0;heroReward(2);
    fxRing(e.x,e.y,final?24:16,'#a5f0aa',.24);
   }
  }else if(key==='gunner'){
   if(src==='m')P.heat=Math.min(6,(P.heat||0)+.7);
   if((src==='h'||src==='e')&&P.gunHeat>0&&P.gunHeatUntil>R.time)damage*=1+P.gunHeat*(final?.13:.1);
  }else if(key==='lancer'){
   if(src==='m')P.momentum=Math.min(6,(P.momentum||0)+.4);
   if((src==='h'||src==='q'||src==='e')&&P.spentMomentum>0)damage*=1+P.spentMomentum*(final?.13:.09);
  }
  const result=base.call(this,e,damage,pd,o);
  if(key==='wizard'&&e.hp<hp&&!e.dead){
   const element=o?.el;
   const reaction=element==='burn'&&techniqueStatus(e,'chillT')||
    element==='chill'&&techniqueStatus(e,'burn')||element==='shock'&&techniqueStatus(e,'burn');
   if(reaction&&!(e.nextReaction>R.time)){
    e.nextReaction=R.time+1;
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
  if(key==='samurai'&&k==='h')p.iaiResolve=p.hFull?(p.resolve||0):0;
  if(key==='gunner'&&(k==='h'||k==='e')){p.gunHeat=(p.heat||0)>=2?p.heat:0;p.gunHeatUntil=R.time+1.5;}
  if(key==='lancer'&&'hqe'.includes(k))p.spentMomentum=(p.momentum||0)>=2?p.momentum:0;
  const oldZones=zones.length;
  const result=base.apply(this,arguments);
  if((k==='m'?p.atkCd:p.ab[cooldown])===before)return result;
  if(key==='samurai'&&k==='h'){
   if(p.iaiResolve){
    p.resolve=0;
    p.iaiResolveUntil=R.time+.5;
    const endX=p.x+Math.cos(p.aim)*28,endY=p.y+Math.sin(p.aim)*28;
    fxRing(endX,endY,final?37:24,'#ffe0aa',.32);
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
  if(key==='onmyoji'&&k==='q'){
   const support=zones.some(z=>z.k==='healing'||z.k==='heal');
   const summon=zones.slice(oldZones).find(z=>z.k==='shiki');
   if(summon){
    const col='#c2f3df',x=summon.x,y=summon.y;
    zones.push({k:'rosterWard',src:'q',x,y,r:32,t:1.6,tk:0,left:final?7:3,col});
    if(final&&support)rosterBurst(x,y,58,S.atk*3,56,col,{src:k});
   }
  }else if(final&&key==='onmyoji'&&k==='e'){
   for(const z of zones.filter(z=>z.k==='shiki').slice(0,4)){
    rosterBurst(z.x,z.y,37,S.atk*2.2,38,'#c2f3df',{src:k});z.t=0;
   }
  }else if(final&&key==='archer'&&k==='q'){
   rosterShots(p,p.aim,3,.2,S.atk*.7,'#a5f0aa',{src:k,home:true,pierce:1});
  }
  return result;
 };
}

{
 const base=updWorld;
 updWorld=function(dt){
  base(dt);
  if(P.iaiResolve>0&&R.time>(P.iaiResolveUntil||0))P.iaiResolve=0;
 };
}

{
 const base=castUlt;
 castUlt=function(){
  const before=P.ab.e;
  const result=base.apply(this,arguments);
  if(CLS().k==='wizard'&&heroTransformed()&&P.ab.e>before){
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
  const key=CLS().k,level=mLevel(key),look=MPAL[hPick(key).pal],style=look?.fx||0;
  if(style&&level>=look.lv){
   const col=CLS().col,ultimate=k==='e';
   fxRing(P.x,P.y,ultimate&&level>=30?48:20+style*3,col,.28);
   spark(P.x,P.y,col,Math.min(14,3+style*2),64);
   if(ultimate&&style>=3){
    const pose=ABPOSE;
    if(pose)ABPOSE={...pose,dur:pose.dur*1.16};
    if(style>=4)fxRing(P.x,P.y,58,'#fff2c4',.54);
   }
  }
 };
}
