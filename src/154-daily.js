'use strict';
// SHINOBIDUNGEONS - the daily challenge. One run a day that is the same for everyone: the stages are laid out from the
// day's seed and the hero is chosen for you (rotating through the heroes you have unlocked). It is harder than a normal
// run and pays better: foes always have +15% health and hit 15% harder, and the run earns +25% jade. On top of that the
// day deals three PACTS - each one a trade, a drawback paired with a reward (take 30% more damage for 30% more jade,
// move 50% faster but deal 10% less damage...) - so every day plays differently. Your best score and furthest stage for
// the day are kept. It's on the main menu as DAILY CHALLENGE.
// a pact: n name, bad / good the two sides, and its effect on the day's numbers (fx) or a flag the hooks below read
const DPACTS=[
 {k:'brutal',n:'BRUTAL BLOWS',bad:'YOU TAKE 30% MORE DAMAGE',good:'+30% JADE',fx:{taken:1.3,jade:1.3}},
 {k:'mud',n:'MUDDY ROADS',bad:'YOU MOVE 10% SLOWER',good:'+25% GOLD',fx:{spd:.9,gold:1.25}},
 {k:'wind',n:'WINDWALKER',good:'YOU MOVE 50% FASTER',bad:'YOU DEAL 10% LESS DAMAGE',fx:{spd:1.5,deal:.9}},
 {k:'glass',n:'GLASS CANNON',good:'YOU DEAL 60% MORE DAMAGE',bad:'YOU HAVE HALF THE HEALTH',fx:{deal:1.6,maxhp:.5}},
 {k:'bounce',n:'RICOCHET',bad:'ENEMY SHOTS BOUNCE OFF WALLS',good:'+25% JADE',fx:{jade:1.25}},
 {k:'swift',n:'SWIFT FOES',bad:'FOES MOVE 25% FASTER',good:'+20% JADE',fx:{foeSpd:1.25,jade:1.2}},
 {k:'elites',n:'ELITE HUNT',bad:'AN EXTRA ELITE IN EVERY FIGHT',good:'EVERY ELITE DROPS A LOOT BAG',fx:{}},
 {k:'noshop',n:'NO TRADERS',bad:'THE TRADERS HAVE FLED',good:'EVERY GUARDIAN GIVES AN EXTRA RELIC',fx:{}},
 {k:'gold',n:'GOLD RUSH',good:'DOUBLE GOLD',bad:'FOES HAVE 25% MORE HEALTH',fx:{gold:2,foeHp:1.25}},
 {k:'vamp',n:'BLOOD THIRST',good:'EVERY KILL HEALS 3% HEALTH',bad:'NO POTIONS',fx:{}},
 {k:'blood',n:'BLOOD PRICE',good:'START WITH 2 RELICS',bad:'25% LESS MAX HEALTH',fx:{maxhp:.75}},
 {k:'quick',n:'QUICK HANDS',good:'15% SHORTER ABILITY COOLDOWNS',bad:'FOES HIT 20% HARDER',fx:{cdr:.85,taken:1.2}},
 {k:'iron',n:'IRON SKIN',good:'YOU TAKE 25% LESS DAMAGE',bad:'YOU DEAL 20% LESS DAMAGE',fx:{taken:.75,deal:.8}},
 {k:'big',n:'BIG GAME',bad:'FOES HAVE 40% MORE HEALTH',good:'+40% JADE',fx:{foeHp:1.4,jade:1.4}},
 {k:'shadow',n:'SHADOW STEP',good:'20% SHORTER DASH COOLDOWN',bad:'YOU TAKE 15% MORE DAMAGE',fx:{dash:.8,taken:1.15}},
 {k:'moon',n:'MOONLIT MARCH',good:'EVERY STAGE MAP IS REVEALED',bad:'FOES MOVE 15% FASTER',fx:{foeSpd:1.15}}];
const DBASE={foeHp:1.15,taken:1.15,jade:1.25};
// kept so an old save's single modifier still reads
const DMODS=DPACTS;
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const daySeed=k=>{let h=2166136261;for(const c of k)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
function seededRng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function dailyToday(){const k=dayKey(),s=daySeed(k),n=Math.min(meta.unlocked||2,CLASSES.length),rng=seededRng(s^0x9e3779b9),pool=DPACTS.slice(),pacts=[];
 const n2=2+Math.floor(rng()*4);for(let i=0;i<n2;i++)pacts.push(pool.splice(Math.floor(rng()*pool.length),1)[0]);return {k,s,cls:s%n,pacts};}
let DPEND=null;const DAILY=()=>DPEND||(R&&R.daily?R.daily:null);
const dHas=k=>{const D=DAILY();return !!(D&&(D.mods?D.mods.includes(k):D.mod===k));};
// the day's numbers: the base, times every pact's effect
function dailyFx(D){D=D||DAILY();const o={taken:1,deal:1,spd:1,maxhp:1,gold:1,jade:1,foeHp:1,foeSpd:1,cdr:1,dash:1};if(!D)return o;
 const ks=D.mods||[D.mod],all=[DBASE].concat(ks.map(k=>(DPACTS.find(p=>p.k===k)||{}).fx||{}));for(const f of all)for(const k in f)o[k]*=f[k];
 o.pactBonus=pactBonus(ks.length);o.jade*=o.pactBonus;return o;}
// the more pacts you carry, the bigger the payout: the jade bonus grows exponentially with the number of pacts
// (x1.3 for each pact after the first: 2 pacts x1.3, 3 x1.69, 4 x2.2, 5 x2.86), on top of each pact's own jade
const PACTX=1.3,pactBonus=n=>Math.pow(PACTX,Math.max(0,n-1));
meta.daily=meta.daily||{};
function startDaily(){const D=dailyToday();meta.cls=D.cls;saveMeta();DPEND={k:D.k,s:D.s,mods:D.pacts.map(p=>p.k)};try{startRun(0);}finally{R.daily=DPEND;DPEND=null;}
 if(dHas('blood'))for(let i=0;i<2;i++)applyItem(randItem(['rez']).id);
 if(dHas('vamp'))R.pots=0;
 S=calcStats();P.hp=S.maxhp;setToast('DAILY: '+D.pacts.map(p=>p.n).join(' / '),'#ff80c0',4);}
// the stages come from the day's seed: Math.random is swapped for a seeded one while a stage is built
{const _ld=loadDungeon;loadDungeon=function(di){const D=DAILY();if(!D)return _ld.apply(this,arguments);const mr=Math.random;Math.random=seededRng(D.s+di*7919);
 let r;try{r=_ld.apply(this,arguments);}finally{Math.random=mr;}
 if(dHas('moon')&&map&&map.expl)for(let i=0;i<map.expl.length;i++)if(map.t[i])map.expl[i]=1;return r;};}
// ---- your numbers
{const _cs=calcStats;calcStats=function(){const s=_cs.apply(this,arguments);const D=DAILY();if(D&&s){const f=dailyFx(D);
 scalePower(s,f.deal);s.maxhp=Math.max(1,Math.round(s.maxhp*f.maxhp));s.spd*=f.spd;s.cdr*=f.cdr;s.dashCd*=f.dash;}return s;};}
{const _hp=hitPlayer;hitPlayer=function(raw){const D=DAILY();if(D&&!(R&&R.training)){const a=[...arguments];a[0]=raw*dailyFx(D).taken;return _hp.apply(this,a);}return _hp.apply(this,arguments);};}
// ---- the foes
{const _mk=mkEnemy;mkEnemy=function(){const e=_mk.apply(this,arguments);const D=DAILY();if(D&&e){const f=dailyFx(D);e.hp*=f.foeHp;e.maxhp*=f.foeHp;e.spd*=f.foeSpd;}return e;};}
{const _mb=mkBoss;mkBoss=function(){const b=_mb.apply(this,arguments);const D=DAILY();if(D&&b){const f=dailyFx(D);b.hp*=f.foeHp;b.maxhp*=f.foeHp;}return b;};}
{const _mp=mkProj;mkProj=function(from){const q=_mp.apply(this,arguments);if(dHas('bounce')&&from==='e'&&q&&!q.st){q.st='bounce';q.bn=1;}return q;};}
{const _pr=populateRoom;populateRoom=function(r,di){if(dHas('noshop')&&r.type==='shop')r.type='combat';_pr.apply(this,arguments);
 if(dHas('elites')&&r.type==='combat'){const pool=DUN[di].pool.filter(t=>t!=='wisp'),s=spotIn(r);enemies.push(mkElite(pick(pool),s.x,s.y,r,di));}
 if(dHas('vamp')&&r.type==='shop')props=props.filter(p=>!(p.room===r&&p.k==='pedestal'&&p.heal));};}
// ---- the rewards
{const _dp=dropPickup;dropPickup=function(x,y,k,v,id){const D=DAILY();if(D&&k==='sen')v=Math.max(1,Math.round(v*dailyFx(D).gold));return _dp.call(this,x,y,k,v,id);};}
{const _ke=killE;killE=function(e){const was=e&&!e.dead;const r=_ke.apply(this,arguments);if(!was||!e.dead||!DAILY()||e.prop)return r;
 if(dHas('elites')&&e.elite)dropBag(e.x,e.y,2);
 if(dHas('noshop')&&e.boss){const it=randItem(['rez']);applyItem(it.id);setToast('NO TRADERS: THE GUARDIAN LEAVES YOU '+it.name,'#ff80c0',3);}
 if(dHas('vamp')&&P&&!P.dying){const h=S.maxhp*.03;P.hp=Math.min(S.maxhp,P.hp+h);}
 return r;};}
{const _ug=useGourd;useGourd=function(){if(dHas('vamp')){txtFx(P.x,P.y,'NO POTIONS TODAY','#ff80c0');return;}return _ug.apply(this,arguments);};}
// the day's banner during the run
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);const D=DAILY();if(!D)return;const s='DAILY '+D.k+'  -  '+(D.mods||[D.mod]).map(k=>(DPACTS.find(p=>p.k===k)||{n:k}).n).join(' / ');txt(s,Math.round((W-txtW(s))/2),H-46,'#ff80c0');};}
// keep the day's best, and pay the day's jade
{const _fr=finishRun;finishRun=function(win){const D=DAILY();let rec=null;if(D){rec={score:R.score||0,di:R.di||0,win:!!win};if(!R._dPaid){R._dPaid=1;R.sen=Math.round((R.sen||0)*dailyFx(D).jade);}}const r=_fr.apply(this,arguments);
 if(rec){const b=meta.daily[D.k]||{score:0,di:0,runs:0};b.runs=(b.runs||0)+1;if(rec.score>b.score)b.score=rec.score;if(rec.di>b.di)b.di=rec.di;if(rec.win)b.win=1;meta.daily[D.k]=b;saveMeta();if(deadInfo)deadInfo.daily=b;}return r;};}
// the main menu entry and its panel
{const _mi=mmItems;mmItems=function(){const L=_mi.apply(this,arguments);const i=L.findIndex(x=>x.k==='train');L.splice(i<0?2:i+1,0,{k:'daily',n:'DAILY CHALLENGE',r:(meta.daily[dayKey()]&&meta.daily[dayKey()].runs)?'DONE':'NEW'});return L;};}
{const _md=mmDo;mmDo=function(it){if(it&&it.k==='daily'){sfx('tool');startDaily();return;}return _md.apply(this,arguments);};}
{const _rm=renderMenu;renderMenu=function(){_rm.apply(this,arguments);const L=mmItems(),it=L[clamp(mmSel,0,L.length-1)];if(!it||it.k!=='daily')return;
 const D=dailyToday(),C=CLASSES[D.cls],X=MM.PX,Y=8,Wd=W-X-6,Hd=H-16;m2Box(X,Y,Wd,Hd,'#ff80c0');const x=X+8;let y=Y+8;
 txt('DAILY CHALLENGE',x,y,'#fff',2);txt(D.k,X+Wd-8-txtW(D.k),y+4,'#888');y+=18;
 txt('THE SAME RUN FOR EVERYONE TODAY. HARDER, AND BETTER PAID.',x,y,'#ddd');y+=9;
 txt('ALWAYS: FOES +15% HEALTH AND DAMAGE  /  +25% JADE',x,y,'#aaa');y+=12;
 {const sp=heroSpr(C.k,0);txt('HERO',x,y,'#d02030');ctx.drawImage(sp.c,WIZ.idle[Math.floor(time*2.5)%2]*sp.fw,0,sp.fw,sp.fh,x+26,y-12,sp.fw,sp.fh);txt(C.n,x+30+sp.fw,y,C.col);}y+=14;
 txt('TODAY\'S PACTS ('+D.pacts.length+')',x,y,'#d02030');{const pb='PACT BONUS: JADE x'+pactBonus(D.pacts.length).toFixed(2);txt(pb,x+txtW('TODAY\'S PACTS (5)')+12,y,'#ffd040');}y+=10;
 const tight=D.pacts.length>3;
 for(const p of D.pacts){txt(p.n,x,y,'#ff80c0');y+=8;if(tight){const g='+ '+p.good;txt(g,x+6,y,'#70e090');txt('- '+p.bad,x+16+txtW(g),y,'#ff7070');y+=10;}else{txt('+ '+p.good,x+6,y,'#70e090');y+=8;txt('- '+p.bad,x+6,y,'#ff7070');y+=10;}}
 const f=dailyFx({mods:D.pacts.map(p=>p.k)}),jl='JADE x'+f.jade.toFixed(2).replace(/0$/,'');txt(jl,X+Wd-8-txtW(jl),Y+46,'#ffd040');
 const b=meta.daily[D.k];txt(b?('BEST TODAY: SCORE '+b.score+'  FURTHEST '+ROMAN[b.di]+(b.win?'  EMPEROR SLAIN!':'')+'  RUNS '+b.runs):'NOT PLAYED YET',x,Math.min(y+2,Y+Hd-10),b?'#ffd040':'#777');};}
