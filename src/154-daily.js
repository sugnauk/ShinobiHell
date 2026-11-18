'use strict';
// SHINOBIDUNGEONS - the daily challenge. One run a day that is the same for everyone: the stages are laid out from the
// day's seed, the hero is chosen for you (rotating through the heroes you have unlocked), and one modifier changes the
// rules. Your best score and furthest stage for the day are kept. It's on the main menu as DAILY CHALLENGE.
const DMODS=[
 {k:'bounce',n:'BOUNCING BULLETS',d:'ENEMY SHOTS BOUNCE OFF WALLS ONCE'},
 {k:'elites',n:'DOUBLE ELITES',d:'EVERY FIGHT ROOM HOLDS AN EXTRA ELITE'},
 {k:'noshop',n:'NO SHOPS',d:'THE TRADERS HAVE FLED. LIVE ON WHAT YOU FIND'},
 {k:'glass',n:'GLASS CANNON',d:'YOU DEAL 60% MORE DAMAGE BUT HAVE HALF THE HEALTH'},
 {k:'swift',n:'SWIFT FOES',d:'EVERY FOE MOVES 25% FASTER'},
 {k:'gold',n:'GOLD RUSH',d:'DOUBLE GOLD FROM EVERYTHING'}];
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const daySeed=k=>{let h=2166136261;for(const c of k)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
function seededRng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function dailyToday(){const k=dayKey(),s=daySeed(k),n=Math.min(meta.unlocked||2,CLASSES.length);return {k,s,cls:s%n,mod:DMODS[(s>>>8)%DMODS.length]};}
let DPEND=null;const DAILY=()=>DPEND||(R&&R.daily?R.daily:null);
meta.daily=meta.daily||{};
function startDaily(){const D=dailyToday();meta.cls=D.cls;saveMeta();DPEND={k:D.k,s:D.s,mod:D.mod.k};try{startRun(0);}finally{R.daily=DPEND;DPEND=null;}setToast('DAILY: '+D.mod.n,'#ff80c0',3.5);}
// the stages come from the day's seed: Math.random is swapped for a seeded one while a stage is built
{const _ld=loadDungeon;loadDungeon=function(di){const D=DAILY();if(!D)return _ld.apply(this,arguments);const mr=Math.random;Math.random=seededRng(D.s+di*7919);
 try{return _ld.apply(this,arguments);}finally{Math.random=mr;}};}
// modifiers
{const _mp=mkProj;mkProj=function(from){const q=_mp.apply(this,arguments);const D=DAILY();if(D&&D.mod==='bounce'&&from==='e'&&q&&!q.st){q.st='bounce';q.bn=1;}return q;};}
{const _pr=populateRoom;populateRoom=function(r,di){const D=DAILY();if(D&&D.mod==='noshop'&&r.type==='shop')r.type='combat';_pr.apply(this,arguments);
 if(D&&D.mod==='elites'&&r.type==='combat'){const pool=DUN[di].pool.filter(t=>t!=='wisp'),s=spotIn(r);enemies.push(mkElite(pick(pool),s.x,s.y,r,di));}};}
{const _cs=calcStats;calcStats=function(){const s=_cs.apply(this,arguments);const D=DAILY();if(D&&D.mod==='glass'&&s){s.atk*=1.6;s.maxhp=Math.max(1,Math.round(s.maxhp*.5));}return s;};}
{const _mk=mkEnemy;mkEnemy=function(){const e=_mk.apply(this,arguments);const D=DAILY();if(D&&D.mod==='swift'&&e)e.spd*=1.25;return e;};}
{const _dp=dropPickup;dropPickup=function(x,y,k,v,id){const D=DAILY();if(D&&D.mod==='gold'&&k==='sen')v=Math.round(v*2);return _dp.call(this,x,y,k,v,id);};}
// the day's banner during the run
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);const D=DAILY();if(!D)return;const M=DMODS.find(m=>m.k===D.mod),s='DAILY '+D.k+'  -  '+(M?M.n:'');txt(s,Math.round((W-txtW(s))/2),H-46,'#ff80c0');};}
// keep the day's best
{const _fr=finishRun;finishRun=function(win){const D=DAILY();let rec=null;if(D)rec={score:R.score||0,di:R.di||0,win:!!win};const r=_fr.apply(this,arguments);
 if(rec){const b=meta.daily[D.k]||{score:0,di:0,runs:0};b.runs=(b.runs||0)+1;if(rec.score>b.score)b.score=rec.score;if(rec.di>b.di)b.di=rec.di;if(rec.win)b.win=1;meta.daily[D.k]=b;saveMeta();if(deadInfo)deadInfo.daily=b;}return r;};}
// the main menu entry and its panel
{const _mi=mmItems;mmItems=function(){const L=_mi.apply(this,arguments);const i=L.findIndex(x=>x.k==='train');L.splice(i<0?2:i+1,0,{k:'daily',n:'DAILY CHALLENGE',r:(meta.daily[dayKey()]&&meta.daily[dayKey()].runs)?'DONE':'NEW'});return L;};}
{const _md=mmDo;mmDo=function(it){if(it&&it.k==='daily'){sfx('tool');startDaily();return;}return _md.apply(this,arguments);};}
{const _rm=renderMenu;renderMenu=function(){_rm.apply(this,arguments);const L=mmItems(),it=L[clamp(mmSel,0,L.length-1)];if(!it||it.k!=='daily')return;
 const D=dailyToday(),C=CLASSES[D.cls],X=MM.PX,Y=8,Wd=W-X-6,Hd=H-16;m2Box(X,Y,Wd,Hd,'#ff80c0');const x=X+8;let y=Y+8;
 txt('DAILY CHALLENGE',x,y,'#fff',2);txt(D.k,X+Wd-8-txtW(D.k),y+4,'#888');y+=20;
 const para=(s,c)=>{for(const l of wrapTxt(s,Math.floor((Wd-16)/4.6))){txt(l,x,y,c||'#bbb');y+=8;}};
 para('ONE RUN A DAY, THE SAME FOR EVERYONE: THE SAME STAGES, THE SAME HERO, THE SAME TWIST. HOW FAR CAN YOU GET?','#ddd');y+=6;
 txt('TODAY\'S HERO',x,y,'#d02030');y+=10;{const sp=heroSpr(C.k,0);ctx.drawImage(sp.c,WIZ.idle[Math.floor(time*2.5)%2]*sp.fw,0,sp.fw,sp.fh,x,y-4,sp.fw*2,sp.fh*2);txt(C.n,x+sp.fw*2+6,y+8,C.col,2);}y+=48;
 const M=D.mod;txt('TODAY\'S TWIST',x,y,'#d02030');y+=10;txt(M.n,x,y,'#ff80c0',2);y+=16;para(M.d,'#ddd');y+=6;
 const b=meta.daily[D.k];txt('YOUR BEST TODAY',x,y,'#d02030');y+=10;txt(b?('SCORE '+b.score+'   FURTHEST '+ROMAN[b.di]+(b.win?'   EMPEROR SLAIN!':'')+'   RUNS '+b.runs):'NOT PLAYED YET',x,y,b?'#ffd040':'#777');};}
