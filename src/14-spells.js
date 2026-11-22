'use strict';
// HELL OF THE EMPEROR - aiming, spells (part of the former game.js; files load in numeric order, see index.html)
// ---------- screen <-> world (isometric input) ----------
function screenToWorldDelta(mx,my){const dx=(mx-W/2)/sceneZoom,dy=(my-(H/2+6))/(ISOK*sceneZoom),w=unrot((dy+dx)/2,(dy-dx)/2);return {x:w[0],y:w[1]};}
const mouseWorld=()=>{const d=screenToWorldDelta(mouse.x,mouse.y);return {x:P.x+d.x,y:P.y+d.y};};
function moveVec(){let mx=(keys[KB.right]||keys.ArrowRight?1:0)-(keys[KB.left]||keys.ArrowLeft?1:0),my=(keys[KB.down]||keys.ArrowDown?1:0)-(keys[KB.up]||keys.ArrowUp?1:0);if(!mx&&!my)return [0,0];const l=Math.hypot(mx,my);mx/=l;my/=l;return unrot((mx+my)*.7071,(my-mx)*.7071);} // WASD stays screen-relative at any camera angle

// ---------- spells: 3 choices per slot ----------
const SPELLS={
 m:[{n:'TALISMAN BOLT',g:'T',c:'#ff8a30',d:'FAST FIRE BOLT. RELIABLE DAMAGE'},
    {n:'SPIRIT SHARDS',g:'S',c:'#c8f',d:'SHOTGUN BURST. HUGE UP CLOSE'},
    {n:'HOMING WISP',g:'H',c:'#8fc',d:'SLOW WISPS THAT SEEK TARGETS'},
    {n:'KAMI SEEKERS',g:'>',c:'#ffe060',rare:1,d:'3 GOLDEN SEEKERS THAT PIERCE'}],
 h:[{n:'SPIRIT BLADE',g:'/',c:'#c8f',cd:.55,d:'MELEE ARC. BIG STUN'},
    {n:'VOID ORB',g:'0',c:'#a6f',cd:1.1,d:'SLOW ORB THAT PIERCES EVERYTHING'},
    {n:'FROST LANCE',g:'!',c:'#bef',cd:.8,d:'FAST PIERCING LANCE. CHILLS'},
    {n:'MOONLIT CRESCENT',g:'(',c:'#e0f0ff',cd:.7,rare:1,d:'HUGE SLASH + PIERCING CRESCENT WAVE'}],
 f:[{n:'FROST NOVA',g:'N',c:'#9df',cd:10,d:'BLAST AROUND YOU. FREEZES FOES'},
    {n:'GRAVITY WELL',g:'G',c:'#a6f',cd:12,d:'PULLS FOES IN, THEN DETONATES'},
    {n:'THUNDER TOTEM',g:'Y',c:'#ff6',cd:15,d:'TOTEM ZAPS NEARBY FOES FOR 6S'},
    {n:'BLACK HOLE',g:'V',c:'#c080ff',cd:14,rare:1,d:'DEVOURS SHOTS, DRAGS EVEN BOSSES'}],
 w:[{n:'SPIRIT WARD',g:'W',c:'#8cf',cd:7,d:'REFLECT SHOTS, BLOCK MELEE'},
    {n:'HEALING RITE',g:'+',c:'#6f6',cd:14,d:'HEAL 25% OVER 3S + HASTE'},
    {n:'STILLNESS SEAL',g:'O',c:'#4af',cd:10,d:'ZONE THAT SLOWS AND CHILLS'},
    {n:'DIVINE AEGIS',g:'A',c:'#fff4b0',cd:15,rare:1,d:'INVULNERABLE, HEAL, BLAST FOES AWAY'}],
 q:[{n:'CHAIN LIGHTNING',g:'L',c:'#fff',cd:4.5,d:'ARCS THROUGH 4 FOES. SHOCKS'},
    {n:'FLAME WAVE',g:'F',c:'#f80',cd:5,d:'CONE OF FIRE. BURNS + KNOCKBACK'},
    {n:'KITSUNE STEP',g:'K',c:'#fc6',cd:6,d:'TELEPORT TO CURSOR + BLAST'},
    {n:'HEAVENLY JUDGMENT',g:'J',c:'#ffffa0',cd:7,rare:1,d:'LIGHTNING SMITES 5 FOES NEAR CURSOR'}],
 e:[{n:'DRAGON DESCENT',g:'R',c:'#fd4',cd:32,d:'HUGE DELAYED BLAST AT CURSOR'},
    {n:'TALISMAN STORM',g:'*',c:'#ff8a30',cd:36,d:'4S OF BOLTS SPIRALING OUT'},
    {n:'STOPPED TIME',g:'=',c:'#8cf',cd:44,d:'FREEZE ALL ENEMIES FOR 3.5S'},
    {n:'METEOR RAIN',g:'M',c:'#ff6030',cd:40,rare:1,d:'14 METEORS CRASH DOWN AT CURSOR'}],
};
const SLOTKEY={m:'LMB',h:'RMB',q:'Q',w:'E',f:'F',e:'R'},SLOTS='mhqwfe';
// spell rank grows with each dungeon: rank boosts power and size; cooldown bonuses stop scaling after the first twelve ranks
const RK=()=>(R&&R.di)||0,AP=()=>1.25*(1+.1*RK()),BP=()=>1+.04*RK(),AZ=()=>1.12*(1+.03*RK());
function spellCd(k){
 const bonus=R?.addon?.[k],C=COOLDOWN;
 const rank=k==='h'?1:1-C.rank*Math.min(C.maxRank,RK());
 const scale=S.cdr*rank*(P.emp?.[k]?1-C.empowered:1)*(bonus?.cd?1-C.scroll:1)*(bonus?.tempo?1-C.tempo:1);
 return SPELLS[k][P.lo[k]].cd*Math.max(C.minSpell,scale);
}
const slotCd=k=>k==='m'?P.atkCd:k==='w'?P.ab.rmb:P.ab[k];

// LMB - main spell
function castBolt(){
 const p=P,a=p.aim,v=p.lo.m,mik=(p.mik>0?1.6:1)*BP();p.mik=0;
 const fire=a2=>{
  if(v===0){const n=1+S.wave,dm=S.atk*mik*(n>1?.8:1);for(let i=0;i<n;i++){const off=n===1?0:(i-(n-1)/2)*.24;projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2+off,215,dm,{r:3,pd:8+S.atk*.3,life:.55*(1+S.rangeM),col:'#ff8a30',pierce:S.pierce,main:true}));}}
  else if(v===1){const n=4+S.wave*2;for(let i=0;i<n;i++){const off=(i/(n-1)-.5)*.75+rnd(-.05,.05);projs.push(mkProj('p',p.x,p.y,a2+off,rnd(210,250),S.atk*.45*mik,{r:2,pd:4+S.atk*.15,life:.3*(1+S.rangeM),col:'#c8f',pierce:S.pierce,main:true}));}}
  else if(v===3){const n=3+S.wave;for(let i=0;i<n;i++){const off=(i-(n-1)/2)*.32;projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2+off,200,S.atk*.9*mik,{r:3,pd:9+S.atk*.3,life:.9*(1+S.rangeM),col:'#ffe060',pierce:2+S.pierce,main:true,home:true,rare:1}));}}
  else{const n=1+S.wave;for(let i=0;i<n;i++){const off=n===1?0:(i-(n-1)/2)*.5;projs.push(mkProj('p',p.x,p.y,a2+off,125,S.atk*1.15*mik,{r:3,pd:10+S.atk*.3,life:1.5*(1+S.rangeM),col:'#8fc',pierce:S.pierce,main:true,home:true}));}}
 };
 fire(a);if(S.echo&&Math.random()<.15*S.echo)fire(a+.12);
 p.atkCd=(v===0?.3:v===3?.38:.5)/S.aspd;sfx('shoot');spark(p.x+Math.cos(a)*8,p.y+Math.sin(a)*8,SPELLS.m[v].c,3,40);
}
// RMB - second basic attack (hold to repeat)
const HCHARGE=.6; // seconds of holding RMB for a full charge (+50% damage; blades deflect shots)
function castHeavy(){
 const p=P;if(!p||p.ab.h>0||p.stag>0)return;const v=p.lo.h,a=p.aim,bp=BP()*(p.mik>0?1.6:1)*(p.hFull?1.5:1);p.mik=0;p.ab.h=spellCd('h')/S.aspd;
 const fire=a2=>{
  if(v===0){
   const rr=42*(1.12+S.rangeM*.6);coneHit(p.x,p.y,a2,rr,1.9,e=>hurtE(e,S.atk*1.5*bp,26,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   if(p.hFull)for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<rr+4&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a2))<1){q.dead=true;spark(q.x,q.y,'#c8f',4,50);}
   fx.push({k:'slash',x:p.x,y:p.y,a:a2,arc:1.9,r:rr,t:.16,dur:.16,col:'#c8f'});sfx('dash');
  }else if(v===3){
   const rr=58*(1.12+S.rangeM*.6);coneHit(p.x,p.y,a2,rr,2.5,e=>hurtE(e,S.atk*2.2*bp,34,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   if(p.hFull)for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<rr+4&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a2))<1.3){q.dead=true;spark(q.x,q.y,'#e0f0ff',4,50);}
   projs.push(mkProj('p',p.x+Math.cos(a2)*8,p.y+Math.sin(a2)*8,a2,240,S.atk*1.6*bp,{r:6,pd:16,life:.55*(1+S.rangeM),col:'#e0f0ff',pierce:99,main:true,crescent:1,cut:p.hFull?1:0}));
   fx.push({k:'slash',x:p.x,y:p.y,a:a2,arc:2.5,r:rr,t:.2,dur:.2,col:'#e0f0ff'});fx.push({k:'slash',x:p.x,y:p.y,a:a2,arc:2.2,r:rr-10,t:.16,dur:.16,col:'#8cf'});sfx('dash');shake=Math.max(shake,3);hitstop=Math.max(hitstop,.03);
  }else if(v===1){projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2,100,S.atk*2*bp,{r:5,pd:18,life:1.4*(1+S.rangeM),col:'#a6f',pierce:99,main:true}));sfx('tool');}
  else{projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2,330,S.atk*1.4*bp,{r:2,pd:10,life:.5*(1+S.rangeM),col:'#bef',pierce:3+S.pierce,main:true,el:'chill'}));sfx('shoot');}
 };
 fire(a);if(S.echo&&Math.random()<.15*S.echo)fire(a+.15);
}
// E - support spell
function castWard(){
 const p=P;if(!p||p.ab.rmb>0||p.stag>0)return;const v=p.lo.w,seal=relicPower('parry');
 if(v===0){if(p.ward>0)return;p.wardRef=0;p.ward=S.wardDur*(1+.05*RK());p.ab.rmb=spellCd('w')+p.ward;sfx('tool');fxRing(p.x,p.y,24,'#8cf',.3);}
 else if(v===1){p.hot=3;p.hotAmt=S.maxhp*(.25+.05*seal+.015*RK())/3;p.haste=3+.5*seal;p.ab.rmb=spellCd('w');sfx('heal');fxRing(p.x,p.y,20,'#6f6',.4);spark(p.x,p.y,'#6f6',12,50);}
 else if(v===3){const r=90*AZ();p.aegis=2.5*(1+.05*RK());p.iv=Math.max(p.iv,p.aegis);p.hp=Math.min(S.maxhp,p.hp+S.maxhp*.2);p.ab.rmb=spellCd('w');
  impact(p.x,p.y,'#fff4b0',9,true);fxRing(p.x,p.y,r,'#fff4b0',.45);fxRing(p.x,p.y,r*.6,'#fff',.35);spark(p.x,p.y,'#fff4b0',40,170);sfx('rare');txtFx(p.x,p.y,'AEGIS','#fff4b0');
  for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<r+20)q.dead=true;
  for(const e of enemies){if(e.dead||e.air)continue;if(los(p.x,p.y,e.x,e.y)&&Math.hypot(e.x-p.x,e.y-p.y)<r+e.r){hurtE(e,S.atk*2*AP(),40,{nost:true,kb:Math.atan2(e.y-p.y,e.x-p.x),kbm:2.5});}}}
 else{const mw=mouseWorld();let tx=mw.x,ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>150){tx=p.x+(tx-p.x)/d*150;ty=p.y+(ty-p.y)/d*150;}const r=52*(1+.1*seal)*AZ();zones.push({x:tx,y:ty,r,t:4+.5*seal,tk:0,dm:S.atk*.3*AP()});p.ab.rmb=spellCd('w');sfx('tool');fxRing(tx,ty,r,'#8cf',.3);}
}
// F - utility ability
function castF(){
 const p=P;if(!p||p.ab.f>0||p.stag>0)return;const v=p.lo.f,ap=AP(),az=AZ();p.ab.f=spellCd('f');
 if(v===0){
  const r=66*az;impact(p.x,p.y,'#9df',7,true);sfx('break');fxRing(p.x,p.y,r,'#9df',.4);fxRing(p.x,p.y,r*.6,'#fff',.3);spark(p.x,p.y,'#9df',30,140);
  for(const e of enemies){if(e.dead||e.air)continue;if(los(p.x,p.y,e.x,e.y)&&Math.hypot(e.x-p.x,e.y-p.y)<r+e.r){hurtE(e,S.atk*1.6*ap,22,{nost:true,kb:Math.atan2(e.y-p.y,e.x-p.x)});if(!e.dead){applyStatus(e,'chill');applyStatus(e,'chill');applyStatus(e,'chill');}}}
  for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<r)q.dead=true;
 }else{
  let tx=p.x,ty=p.y;
  if(v===1||v===3){const mw=mouseWorld();tx=mw.x;ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>150){tx=p.x+(tx-p.x)/d*150;ty=p.y+(ty-p.y)/d*150;}}
  if(v===3){zones.push({k:'grav',hole:1,x:tx,y:ty,r:105*az,t:3.2,dur:3.2,tk:0,dm:S.atk*6*ap});sfx('boss');impact(tx,ty,'#c080ff',5);fxRing(tx,ty,105*az,'#c080ff',.5);return;}
  zones.push(v===1?{k:'grav',x:tx,y:ty,r:62*az,t:2.2,dur:2.2,tk:0,dm:S.atk*3.2*ap}:{k:'totem',x:tx,y:ty,r:105*az,t:6,tk:.2,dm:S.atk*1.3*ap});
  sfx('tool');fxRing(tx,ty,v===1?62*az:20,v===1?'#a6f':'#ff6',.35);
 }
}
// Q - ability
function castChain(){
 const p=P;if(!p||p.ab.q>0||p.stag>0)return;const v=p.lo.q,qm=(1+.3*S.qpow)*AP();
 if(v===3){
  const mw=mouseWorld(),tg=enemies.filter(e=>!e.dead&&!e.air&&dist(e,mw)<130&&los(p.x,p.y,e.x,e.y)).sort((a,b)=>dist(a,mw)-dist(b,mw)).slice(0,5+Math.floor(RK()/4));
  if(!tg.length){txtFx(p.x,p.y,'NO TARGET','#aaa');return;}
  p.ab.q=spellCd('q');sfx('rare');
  tg.forEach((e,i)=>fx.push({k:'strike',x:e.x,y:e.y,tgt:e,wait:i*.09,t:.35,dur:.35,dm:S.atk*3.6*qm,r:22*AZ()}));
  return;}
 if(v===0){
  const mw=mouseWorld();let first=null,bd=1e9;
  for(const e of enemies){if(e.dead||e.air||dist(e,p)>200||!los(p.x,p.y,e.x,e.y))continue;const d=dist(e,mw);if(d<bd){bd=d;first=e;}}
  if(!first){txtFx(p.x,p.y,'NO TARGET','#aaa');return;}
  p.ab.q=spellCd('q');sfx('tool');impact(first.x,first.y,'#cef',4);
  const hit=[first],pts=[{x:p.x,y:p.y},{x:first.x,y:first.y}];let cur=first;
  for(let i=0;i<3+(S.shock?1:0)+Math.floor(RK()/3);i++){let nx=null,nd=80;for(const e of enemies){if(e.dead||e.air||hit.includes(e)||!los(cur.x,cur.y,e.x,e.y))continue;const d=dist(e,cur);if(d<nd){nd=d;nx=e;}}if(!nx)break;hit.push(nx);pts.push({x:nx.x,y:nx.y});cur=nx;}
  fx.push({k:'bolt',pts,t:.25,dur:.25});
  hit.forEach((e,i)=>{hurtE(e,S.atk*2.4*qm*(1-i*.12),28,{slash:true,el:'shock'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,.45);}});
 }else if(v===1){
  const a=p.aim;p.ab.q=spellCd('q');sfx('tool');impact(p.x+Math.cos(a)*30,p.y+Math.sin(a)*30,'#f80',5);
  coneHit(p.x,p.y,a,72*AZ(),1.5,e=>hurtE(e,S.atk*2*qm,30,{slash:true,el:'burn',kb:Math.atan2(e.y-p.y,e.x-p.x)}));
  for(const q of projs)if(q.from==='e'&&dist(q,p)<75&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a))<.75)q.dead=true;
  fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.5,r:64,t:.25,dur:.25,col:'#f80'});fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.3,r:42,t:.2,dur:.2,col:'#fd4'});
  for(let i=0;i<30;i++){const an=a+rnd(-.7,.7),s=rnd(60,170);particles.push({x:p.x,y:p.y,vx:Math.cos(an)*s,vy:Math.sin(an)*s,t:rnd(.2,.5),col:pick(['#f80','#fc4','#f40'])});}
 }else{
  const mw=mouseWorld(),a=Math.atan2(mw.y-p.y,mw.x-p.x),d=Math.min(115,Math.hypot(mw.x-p.x,mw.y-p.y));
  let nx=p.x,ny=p.y;for(let s=0;s<=d;s+=2){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;nx=tx;ny=ty;}
  p.ab.q=spellCd('q');sfx('dash');fxRing(p.x,p.y,20,'#fc6',.3);spark(p.x,p.y,'#fc6',10,60);
  p.x=nx;p.y=ny;p.iv=Math.max(p.iv,.5);if(S.mikiri)p.mik=1.5;
  fxRing(nx,ny,36,'#fc6',.35);spark(nx,ny,'#fc6',14,90);impact(nx,ny,'#fc6',5);
  for(const e of enemies){if(e.dead||e.air)continue;if(los(nx,ny,e.x,e.y)&&Math.hypot(e.x-nx,e.y-ny)<36*AZ()+e.r)hurtE(e,S.atk*1.6*qm,30,{slash:true,el:'burn',kb:Math.atan2(e.y-ny,e.x-nx)});}
 }
}
// R - ultimate
function castUlt(){
 const p=P;if(!p||p.ab.e>0||p.stag>0)return;const v=p.lo.e,ep=(1+.25*S.epow)*(1+.06*RK());p.ab.e=spellCd('e');
 if(v===0){const mw=mouseWorld();let tx=mw.x,ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>240){tx=p.x+(tx-p.x)/d*240;ty=p.y+(ty-p.y)/d*170;}sfx('boss');fx.push({k:'ult',x:tx,y:ty,t:.9,dur:.9,r:58*Math.sqrt(ep),done:false});}
 else if(v===1){p.storm=4*ep;p.stormT=0;p.stormA=p.aim;sfx('boss');setToast('TALISMAN STORM','#ff8a30',1.5);}
 else if(v===3){const mw=mouseWorld();let tx=mw.x,ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>240){tx=p.x+(tx-p.x)/d*240;ty=p.y+(ty-p.y)/d*170;}sfx('boss');setToast('METEOR RAIN','#ff6030',1.5);
  const n=14+Math.floor(RK()/2);for(let i=0;i<n;i++){const a=Math.random()*TAU,rr=Math.sqrt(Math.random())*85;fx.push({k:'ult',x:tx+Math.cos(a)*rr,y:ty+Math.sin(a)*rr,wait:i*.22,t:.6,dur:.6,r:30*Math.sqrt(ep),col:'#ff6030',dm:S.atk*3.2*ep*AP(),done:false,met:1});}}
 else{freezeT=3.5*(1+.15*S.epow);sfx('boss');setToast('TIME STOPS','#8cf',2);for(const e of enemies)if(!e.dead){e.act=null;e.tele=0;e.air=false;e.z=0;}}
}
