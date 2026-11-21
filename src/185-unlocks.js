'use strict';
// The roster opens as you beat guardians. Lifetime clears include the prologues and carry across runs.
const HERO_START=['wizard','samurai','archer','sumo'];
const HERO_RECRUITS=[
 ['shinobi','gunner','lancer'],
 ['onmyoji','marionettist','tengu'],
 ['kagura','bloodoracle','bellwarden']
];
const heroOwned=k=>!!meta.heroes?.[k];
function heroSync(){
 meta.unlocked=CLASSES.filter(c=>heroOwned(c.k)).length;
 if(!heroOwned(CLASSES[meta.cls|0]?.k))meta.cls=CLASSES.findIndex(c=>c.k==='samurai');
}
// Test Mode and the test harness can still open the full roster.
heroLocked=function(i){
 const C=CLASSES[i];
 return !C||((meta.unlocked||0)<=CLASSES.length&&!heroOwned(C.k));
};
function heroLockInfo(i){
 const k=CLASSES[i]?.k,need=HERO_RECRUITS.findIndex(group=>group.includes(k))+1;
 if(!need)return null;
 const target=need===1?'A GUARDIAN':need+' GUARDIANS';
 return {title:'GUARDIANS DEFEATED',d:'DEFEAT '+target+'. WINS ADD UP ACROSS RUNS, INCLUDING THE PROLOGUE.',cur:meta.life.bosses,need};
}
function recruitHeroes(){
 const recruits=[];
 for(const group of HERO_RECRUITS.slice(0,meta.life.bosses)){
  for(const k of group){
   if(heroOwned(k))continue;
   meta.heroes[k]=1;
   recruits.push(CLASSES.find(c=>c.k===k));
  }
 }
 heroSync();
 return recruits;
}
(function heroInit(){
 meta.heroes??={};
 if(!meta.heroesV&&(meta.runs||0)>0){
  for(const C of CLASSES.slice(0,meta.unlocked||0))meta.heroes[C.k]=1;
 }
 for(const k of HERO_START)meta.heroes[k]=1;
 meta.heroesV=1;
 meta.life.bosses=Math.max(meta.life.bosses||0,meta.uc?.bossBest||0,meta.uc?.first?1:0);
 recruitHeroes();
 saveMeta();
})();

let HEROANN=null;
function heroAnnounce(heroes){
 HEROANN={heroes,t0:performance.now()/1000};
 sfx('rare');
 if(deadInfo&&!deadInfo.unlock)deadInfo.unlock=heroes[0];
}
// Show recruits together and wait until the guardian reward has been picked.
{const base=render;render=function(){
 const result=base.apply(this,arguments),A=HEROANN;
 if(!A)return result;
 const now=performance.now()/1000;
 if(mode==='choose'||mode==='play'&&portal?.pending){A.hold??=now;return result;}
 if(A.hold!=null){A.t0+=now-A.hold;A.hold=null;}
 const age=now-A.t0;
 if(age>4.5){HEROANN=null;return result;}
 drawInView(()=>{
  const [first]=A.heroes,alpha=Math.min(1,age/.25,(4.5-age)/.4),w=Math.min(W-20,240),x=Math.round((W-w)/2),y=Math.round(H*.16);
  const names=wrapTxt(A.heroes.map(C=>C.n).join(' / '),Math.floor((w-48)/5)),h=37+names.length*8;
  ctx.globalAlpha=alpha*.94;ctx.fillStyle='#0c0a12';ctx.fillRect(x,y,w,h);
  ctx.fillStyle=first.col;ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);ctx.globalAlpha=alpha;
  drawSpr(heroSpr(first.k,0),x+20,y+h-6,false,0,false);
  txt(A.heroes.length===1?'NEW HERO':'NEW HEROES',x+40,y+8,first.col);
  names.forEach((name,i)=>txt(name,x+40,y+20+i*8,'#e0c070'));
  txt('CHOOSE THEM ON CHARACTER SELECT',x+40,y+h-14,'#aaa');
 });
 return result;
};}
// The Trials counter records real guardian wins and skips training and Test Mode.
{const base=onBossDead;onBossDead=function(){
 const before=meta.life.bosses,result=base.apply(this,arguments);
 if(meta.life.bosses>before&&before<HERO_RECRUITS.length){
  const recruits=recruitHeroes();
  if(recruits.length){heroAnnounce(recruits);trialsCheck();}
  saveMeta();
 }
 return result;
};}
{const base=dailyToday;dailyToday=function(){
 const d=base.apply(this,arguments),owned=CLASSES.map((_,i)=>i).filter(i=>!heroLocked(i));
 if(owned.length)d.cls=owned[d.s%owned.length];
 return d;
};}
