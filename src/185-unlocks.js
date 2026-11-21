'use strict';
// SHINOBIDUNGEONS - heroes are earned. The SAMURAI and the ARCHER are there from the start; every other hero joins you
// when you complete a challenge of their own, one that suits them. (It used to be one new hero per finished run, in
// roster order.) Progress is kept between runs unless a challenge says "in one run"; the character select screen shows
// a locked hero's challenge and how far along you are, and a hero who joins is announced the moment it happens.
// Saves from before this keep every hero they had already unlocked.
const HERO_START=['samurai','archer'];
// k: hero; t: title; d: what to do; prog(): [now, needed]; run: counts within a single run
const HERO_CH=[
 {k:'wizard',t:'THE MASTER\'S FIRST LESSON',d:'FINISH THE PROLOGUE BY DEFEATING KAGEYAMA AT THE WATCHTOWER, OR DEFEAT AKAGANE IN STAGE I.',prog:()=>[UC().first?1:0,1]},
 {k:'shinobi',t:'A HAIR\'S BREADTH',d:'GRAZE 60 ENEMY SHOTS IN ONE RUN: LET THEM PASS WITHIN A WHISKER OF YOU.',run:1,prog:()=>[Math.max(UC().grazeBest||0,R&&!R.training?R.grazes||0:0),60]},
 {k:'onmyoji',t:'THE SPIRITS LISTEN',d:'MAKE AN OFFERING AT 4 SHRINES.',prog:()=>[UC().shrine||0,4]},
 {k:'gunner',t:'POWDER AND SPLINTERS',d:'BREAK 40 BARRELS, CRATES AND POWDER KEGS.',prog:()=>[UC().brk||0,40]},
 {k:'lancer',t:'THE LONG MARCH',d:'DEFEAT 3 STAGE GUARDIANS IN ONE RUN.',run:1,prog:()=>[Math.max(UC().bossBest||0,R&&!R.training?R.mainBosses||0:0),3]},
 {k:'sumo',t:'IRON STOMACH',d:'DEFEAT A GUARDIAN WITHOUT DRINKING A SINGLE POTION ON THAT STAGE.',prog:()=>[UC().nopot?1:0,1]},
 {k:'marionettist',t:'CUT THE STRINGS',d:'FREE 3 PRISONERS FROM THEIR CAGES.',prog:()=>[UC().cage||0,3]},
 {k:'tengu',t:'TO THE PEAKS',d:'REACH FROSTPEAK PASS, STAGE V.',prog:()=>[UC().peak?1:0,1]},
 {k:'kagura',t:'THE DANCE OF THE GONG',d:'WIN 3 CHALLENGE ROOMS: STRIKE THE GONG AND BEAT EVERY FOE BEFORE TIME RUNS OUT.',prog:()=>[UC().chal||0,3]},
 {k:'bloodoracle',t:'A PRICE IN BLOOD',d:'TAKE ON 3 CURSES AT CURSE ALTARS.',prog:()=>[UC().curse||0,3]},
 {k:'bellwarden',t:'UNTOUCHED',d:'DEFEAT A GUARDIAN WITHOUT BEING HIT.',prog:()=>[UC().nohit?1:0,1]}];
const UC=()=>meta.uc||(meta.uc={});
const heroOwned=k=>!!(meta.heroes&&meta.heroes[k]);
// first load: start with the two, and keep whatever an older save had already unlocked
(function heroInit(){if(meta.heroes&&meta.heroesV)return;const H={};for(const k of HERO_START)H[k]=1;
 if((meta.runs||0)>0)for(let i=0;i<Math.min(meta.unlocked||0,CLASSES.length);i++)H[CLASSES[i].k]=1;
 meta.heroes=H;meta.heroesV=1;heroSync();saveMeta();})();
function heroSync(){meta.unlocked=CLASSES.filter(c=>heroOwned(c.k)).length;const i=meta.cls|0;if(!CLASSES[i]||!heroOwned(CLASSES[i].k))meta.cls=Math.max(0,CLASSES.findIndex(c=>c.k==='samurai'));}
// test mode and the test harness can still open every hero (meta.unlocked raised past the roster)
heroLocked=function(i){const C=CLASSES[i];if(!C)return true;if((meta.unlocked||0)>CLASSES.length)return false;return !heroOwned(C.k);};
function heroLockInfo(i){const C=CLASSES[i],H=C&&HERO_CH.find(h=>h.k===C.k);if(!H)return {title:'',d:'',cur:0,need:1};const [cur,need]=H.prog();return {title:H.t,d:H.d,cur,need,run:!!H.run};}
// check every challenge; a hero whose challenge is met joins at once
function heroCheck(){if(!meta.heroes)return;let any=null;for(const H of HERO_CH){if(heroOwned(H.k))continue;const [c,n]=H.prog();if(c>=n){meta.heroes[H.k]=1;any=H;heroAnnounce(H);}}
 if(any){heroSync();saveMeta();}}
let HEROANN=null;
function heroAnnounce(H){const C=CLASSES.find(c=>c.k===H.k);HEROANN={C,H,t0:performance.now()/1000};try{sfx('rare');}catch(_){}
 if(typeof deadInfo!=='undefined'&&deadInfo&&!deadInfo.unlock)deadInfo.unlock=C;}
// Keep the unlock banner clear of the boss reward cards and their lead-in.
{const _r=render;render=function(){const r=_r.apply(this,arguments);const A=HEROANN;if(!A)return r;
 const now=performance.now()/1000;
 if(mode==='choose'||mode==='play'&&portal?.pending){A.hold??=now;return r;}
 if(A.hold!=null){A.t0+=now-A.hold;A.hold=null;}
 const k=now-A.t0;if(k>4.5){HEROANN=null;return r;}
 const a=Math.min(1,k/.25,(4.5-k)/.4),w=Math.min(W-20,240),h=46,x=Math.round(W/2-w/2),y=Math.round(H*.16);ctx.globalAlpha=a*.94;ctx.fillStyle='#0c0a12';ctx.fillRect(x,y,w,h);ctx.fillStyle=A.C.col;ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 ctx.globalAlpha=a;try{drawSpr(heroSpr(A.C.k,0),x+20,y+h-6,false,0,false);}catch(_){}
 txt('NEW HERO: '+A.C.n,x+40,y+8,A.C.col,1);txt(A.H.t,x+40,y+20,'#e0c070');txt('CHOOSE THEM ON CHARACTER SELECT',x+40,y+31,'#aaa');ctx.globalAlpha=1;return r;};}
// ---------------- what the challenges watch ----------------
const ucOn=()=>R&&!R.training&&!R.test;
{const _ob=onBossDead;onBossDead=function(e){const r=_ob.apply(this,arguments);try{if(ucOn()){const U=UC(),pro=R.pro|0;
  if(pro===3||(!pro&&R.di===0))U.first=1;
  if(!pro){R.mainBosses=(R.mainBosses||0)+1;U.bossBest=Math.max(U.bossBest||0,R.mainBosses);}
  if(!R.potStage)U.nopot=1;if(!(e.hitsT>0))U.nohit=1;heroCheck();}}catch(_){}return r;};}
{const _ug=useGourd;useGourd=function(){const n=R&&R.pots;const r=_ug.apply(this,arguments);if(R&&R.pots<n)R.potStage=1;return r;};}
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld.apply(this,arguments);try{if(R){R.potStage=0;if(ucOn()&&!(typeof PRO_ON!=='undefined'&&PRO_ON)&&R.di>=4){UC().peak=1;heroCheck();}}}catch(_){}return r;};}
{const _gz=graze;graze=function(q){const r=_gz.apply(this,arguments);if(ucOn()){const U=UC();U.grazeBest=Math.max(U.grazeBest||0,R.grazes||0);if((R.grazes||0)%10===0)heroCheck();}return r;};}
{const _pe=pickEvent;pickEvent=function(i){const p=evProp,was=p&&p.used;const r=_pe.apply(this,arguments);if(ucOn()&&p&&!was&&p.used&&p.k==='altar'&&!p.curse){UC().shrine=(UC().shrine||0)+1;heroCheck();}return r;};}
{const _tc=takeCurse;takeCurse=function(p){const r=_tc.apply(this,arguments);if(ucOn()){UC().curse=(UC().curse||0)+1;heroCheck();}return r;};}
{const _fa=freeAlly;freeAlly=function(p){const was=p&&p.used;const r=_fa.apply(this,arguments);if(ucOn()&&p&&!was){UC().cage=(UC().cage||0)+1;heroCheck();}return r;};}
{const _bd=breakDeco;breakDeco=function(o,src){const was=o&&o.broken;const r=_bd.apply(this,arguments);if(ucOn()&&o&&!was&&o.broken){const U=UC();U.brk=(U.brk||0)+1;if(U.brk%5===0)heroCheck();else if(U.brk>=40)heroCheck();}return r;};}
// a challenge room is won when its foes all fall before the time runs out
{const _ur=updRoomEvents;updRoomEvents=function(dt){const live=map&&map.rooms?map.rooms.filter(r=>r.ev&&r.ev.k==='challenge'&&r.ev.state===1):[];const r=_ur.apply(this,arguments);
 for(const rm of live){if(rm.ev.state===2&&rm.ev.t>0&&ucOn()){UC().chal=(UC().chal||0)+1;heroCheck();}}return r;};}
// the daily challenge picks its hero from the heroes you have
{const _dt=dailyToday;dailyToday=function(){const d=_dt.apply(this,arguments);const own=CLASSES.map((c,i)=>i).filter(i=>!heroLocked(i));if(own.length)d.cls=own[d.s%own.length];return d;};}
// the roster counts in menus and the guide follow the heroes you own
heroSync();
