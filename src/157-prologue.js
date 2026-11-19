'use strict';
// SHINOBIDUNGEONS - PROLOGUE I: THE BURNING VILLAGE. A gentle first stage before stage I, part of every new run (it can
// be switched off on character select with P). Bandits wearing the Emperor's colours are burning a village for the
// tax; their captain GORO is a teaching boss: slow, clearly telegraphed swings and charges, a few slow fans of bullets,
// and a second phase that adds a leap. Foes here are fewer and weaker. Beat Goro and Master Kaito sends you on to
// stage I as normal: nothing in stages I-XII changes.
// How it works: while the prologue is being played, slot 0 of the stage tables (stage, scenery, guardian, art, music)
// holds the prologue's entries; they are put back the moment you reach the campfire, die or leave.
const PRO={
 dun:{name:'THE BURNING VILLAGE',fl:['#4a2e22','#52342a'],sp:'#3a2018',wt:'#140a08',wf:'#6a3a24',we:'#d07830',cloth:'#7a4424',dark:'#4a2a14',acc:'#e08040',
  pool:['bandit','bandit','bandit','ashigaru','archer','boar'],story:'BANDITS IN THE EMPEROR\'S COLOURS BURN THE VILLAGE',
  tale:'THE EMPEROR\'S TAX MEN HIRED BANDITS TO COLLECT FROM THE VILLAGES THAT COULD NOT PAY. GORO AND HIS MEN ARE BURNING YOURS. THIS IS WHERE THE MARCH BEGINS.'},
 boss:{name:'GORO, THE BANDIT CAPTAIN',hp:300,hat:'kasa',pal:null,pref:30,spd:36,r:9},
 style:{c:'#e08040',t:['WILD SWINGS','TORCHES','LAST STAND'],ph:[
  [{cnt:3,spread:.5,sp:46,col:'#e08040'}],
  [{cnt:5,spread:.8,sp:48,col:'#e08040'},{pat:'gapring',cnt:10,gw:1,sp:42,col:'#ffb060'}],
  [{cnt:5,spread:.8,sp:50,col:'#e08040'},{pat:'gapring',cnt:12,gw:.9,sp:44,col:'#ffb060'}]]},
 modes:['chase','chase','dashes'],
 motif:[0,2,4,2,0,null,4,5,4,2,0,null,-1,0,2,null],
 master:'THE VILLAGE IS SAFE. GORO WORE THE EMPEROR\'S COLOURS - SO DO THE WARBANDS IN THE BAMBOO. IF WE WANT IT TO END, WE MARCH ON THE CASTLE.'};
PRO.boss.pal=basePal('#6a4a2a','#3a3028','#c02020','#18120e');
PRO.boss.k1=[SL({hits:1,w:1,dmg:10,wt:3,range:30}),CH({wt:2,dmg:12})];
PRO.boss.k2=[SL({hits:2,w:.85,w2:.4,dmg:11,wt:3,range:30}),CH({wt:2,dmg:13}),TH({dist:50,dmg:12,wt:1})];
// ---------- the swap ----------
let PRO_ON=false,PROQ=false;const PROSAVE={};
const PROSLOTS=()=>[['DUN',DUN],['ENV',ENV],['BOSS',BOSS],['BLOOK',BLOOK],['BSTYLE',BSTYLE],['BMODES',BMODES],['BMOTIF',typeof BMOTIF!=='undefined'?BMOTIF:null],['ROMAN',ROMAN],['BOSSSPR',BOSSSPR]];
// the stage's furnishings, scattered nature, set-piece groups, floor art and colour mood are kept per stage slot too:
// the prologue takes the burnt town's (ruined houses, rubble, braziers, ember light) instead of stage I's bamboo camp
const PRODRESS=()=>[['STAGEDECO',typeof STAGEDECO!=='undefined'?STAGEDECO:null],['DECO_GROUPS',typeof DECO_GROUPS!=='undefined'?DECO_GROUPS:null],
 ['FLOORART',typeof FLOORART!=='undefined'?FLOORART:null],['MOOD',typeof MOOD!=='undefined'?MOOD:null],['STAGE_SCATTER',typeof STAGE_SCATTER!=='undefined'?STAGE_SCATTER:null]];
const proMood=()=>{if(typeof MOODC!=='undefined')for(const k in MOODC)if(k.startsWith('0:'))delete MOODC[k];};
function proOn(){if(PRO_ON)return;for(const [k,a] of PROSLOTS())if(a)PROSAVE[k]=a[0];
 const env=Object.assign({},PROSAVE.ENV,ENV[3]||{});
 DUN[0]=Object.assign({},PROSAVE.DUN,DUN[3]?{scn:Object.assign({},DUN[3].scn||{},{short:PRO.dun.story,tale:PRO.dun.tale,seal:(PROSAVE.DUN.scn||{}).seal||'ox'})}:{},PRO.dun);
 ENV[0]=env;BOSS[0]=PRO.boss;BLOOK[0]=PROSAVE.BLOOK;BSTYLE[0]=PRO.style;BMODES[0]=PRO.modes;if(typeof BMOTIF!=='undefined')BMOTIF[0]=PRO.motif;ROMAN[0]='PROLOGUE';BOSSSPR[0]=PROSAVE.PROSPR||null;
 for(const [k,a] of PRODRESS())if(a){PROSAVE['d_'+k]=a[0];a[0]=a[3];}proMood();PRO_ON=true;}
function proOff(){if(!PRO_ON)return;if(BOSSSPR[0])PROSAVE.PROSPR=BOSSSPR[0];for(const [k,a] of PROSLOTS())if(a&&k in PROSAVE)a[0]=PROSAVE[k];for(const [k,a] of PRODRESS())if(a&&('d_'+k) in PROSAVE)a[0]=PROSAVE['d_'+k];proMood();PRO_ON=false;}
const proOpt=()=>meta.opt.prologue!==false;
// a new run from character select starts at the prologue (training, the daily and boss rush don't)
{const _sc=selConfirm;selConfirm=function(){const lk=selLock;_sc.apply(this,arguments);if(!lk&&selLock&&proOpt())PROQ=true;};}
{const _sr=startRun;startRun=function(di){const go=PROQ&&!di&&!trainNext;PROQ=false;proOff();if(go)proOn();const r=_sr.apply(this,arguments);if(go&&R){R.pro=1;setToast('PROLOGUE - THE BURNING VILLAGE','#e08040',4);}return r;};}
{const _cr=continueRun;continueRun=function(){const s=savedRun();if(s&&s.R&&s.R.pro)PROQ=true;const r=_cr.apply(this,arguments);PROQ=false;return r;};}
// the campfire after Goro leads on to stage I
{const _om=openMaster;openMaster=function(){if(!(R&&R.pro))return _om.apply(this,arguments);proOff();const r=_om.apply(this,arguments);if(CS){CS.next=0;CS.line=PRO.master;CS.pro=1;}return r;};}
{const _ld=loadDungeon;loadDungeon=function(di){if(R&&R.pro&&!PRO_ON){R.pro=0;R.proDone=1;}return _ld.apply(this,arguments);};}
{const _rm=renderMaster;renderMaster=function(){_rm.apply(this,arguments);if(!CS||!CS.pro)return;ctx.fillStyle='#100d18';ctx.fillRect(0,4,W*.6,10);txt('PROLOGUE. '+PRO.dun.name,11,6,'#d5b48f');};}
// winning or leaving puts the tables back (a death in the prologue keeps them until you leave the death screen, so it
// says where you fell)
{const _fr=finishRun;finishRun=function(win){const pro=R&&R.pro;const r=_fr.apply(this,arguments);if(pro&&deadInfo)deadInfo.pro=1;if(!pro||win)proOff();return r;};}
{const _rmn=renderMenu;renderMenu=function(){if(PRO_ON)proOff();return _rmn.apply(this,arguments);};}
{const _rsl=renderSelect;renderSelect=function(){if(PRO_ON)proOff();return _rsl.apply(this,arguments);};}
// ---------- a gentler stage: fewer, weaker foes; no extra elites ----------
{const _mk=mkEnemy;mkEnemy=function(){const e=_mk.apply(this,arguments);if(e&&PRO_ON&&!e.boss){e.hp*=.55;e.maxhp*=.55;e.dm*=.6;e.maxPosture*=.7;}return e;};}
{const _pr=populateRoom;populateRoom=function(r){const n0=enemies.length;const o=_pr.apply(this,arguments);if(PRO_ON){const mine=enemies.slice(n0);let keep=0;
  enemies.length=n0;for(const e of mine){if(e.elite&&r.type!=='elite')continue;if(keep>=2&&Math.random()<.5)continue;keep++;enemies.push(e);}}return o;};}
{const _bb=bossBarrage;bossBarrage=function(e){if(e&&e.boss&&PRO_ON&&Math.random()<.5)return;return _bb.apply(this,arguments);};}
{const _mb=mkBoss;mkBoss=function(di){const b=_mb.apply(this,arguments);if(b&&PRO_ON){b.dm*=.65;b.dm0*=.65;b.maxPosture*=.7;b.pro=1;}return b;};}
// ---------- character select: P switches the prologue on or off ----------
{const _sk=selectKey;selectKey=function(c){if(c==='KeyP'&&!selLock){meta.opt.prologue=!proOpt();saveMeta();sfx('coin');return;}return _sk.apply(this,arguments);};}
{const _rs=renderSelect;renderSelect=function(){_rs.apply(this,arguments);const s='P: PROLOGUE '+(proOpt()?'ON':'OFF');txt(s,SR.X+2,srY(CLASSES.length)+26,proOpt()?'#e08040':'#777');};}
// ---------- GORO, THE BANDIT CAPTAIN ----------
// A big, scarred bandit: an open leather vest over a bare chest, a red sash, straw-wrapped shins, a red headband round a
// topknot, an eyepatch and a notched machete. Second form: the headband gone, hair loose, a red eye, the vest torn.
function gorDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const VS='#6a4a2a',VS2='#8a6438',PN='#3a3028',PN2='#4a4034',SH='#a03020',SK='#d8a070',SK2='#b07a50',HB='#c02020',HR='#18120e',ST='#a8a8b8',ST2='#e8e8f0';
 // legs: a wide bandit stance, straw-wrapped shins
 const lg=Q.legs||'stand';
 if(lg==='stand'){leg(31,50,26,61,24,73,PN,PN2,'#1a1410',6);leg(41,50,46,61,48,73,PN,PN2,'#1a1410',6);}
 else{leg(31,50,22,58,18,70,PN,PN2,'#1a1410',6);leg(41,50,50,60,54,73,PN,PN2,'#1a1410',6);}
 for(const [x,y0] of (lg==='stand'?[[25,63],[47,63]]:[[20,62],[52,63]]))for(let y=y0;y<71;y+=3)R(x-3,y,6,1,'#c8a868');
 // torso: bare chest under an open vest, a red sash
 trap(cx,26+by,49+by,10,11,VS);R(cx-4,27+by,9,18,SK);R(cx-4,27+by,3,18,'#e8b888');R(cx+3,27+by,2,18,SK2);L(cx,31+by,cx,40+by,SK2,1);L(cx-3,35+by,cx+3,35+by,SK2,1);
 if(two){L(cx-9,30+by,cx-6,40+by,'#2a1a10',1);R(cx+6,36+by,3,5,SK);}else{for(let y=29;y<46;y+=4){R(cx-6,y+by,1,1,VS2);R(cx+6,y+by,1,1,VS2);}}
 R(cx-11,44+by,23,4,SH);R(cx-11,44+by,23,1,'#d04030');R(cx+7,47+by,3,6,SH);R(cx+9,48+by,2,5,'#802010');
 // arms: bare, with leather wristbands
 const far=Q.far||[[26,29],[21,39],[23,48]],near=Q.near||[[46,29],[52,38],[52,47]];
 arm(far,SK,SK,SK2,5);arm(near,SK,SK,SK2,5);
 for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;const t=.7;R(Math.round(c+(e-c)*t)-2,Math.round(d+(f-d)*t)+by-1,5,3,'#4a3020');}
 // the machete: broad, notched, on his shoulder or swung overhead
 {const [x,y]=near[2],a=Q.ba!=null?Q.ba:-1.05,len=Q.bl||26,ca=Math.cos(a),sa=Math.sin(a);
  L(x-ca*6,y+by-sa*6,x,y+by,OUTC,5);L(x-ca*6,y+by-sa*6,x,y+by,'#5a3418',3);
  L(x,y+by,x+ca*len,y+by+sa*len,OUTC,7);L(x,y+by,x+ca*len,y+by+sa*len,ST,5);L(x+sa*2,y+by-ca*2,x+ca*len+sa*2,y+by+sa*len-ca*2,ST2,1);
  for(const k of [.45,.7]){R(Math.round(x+ca*len*k-sa*2),Math.round(y+by+sa*len*k+ca*2),2,2,OUTC);}R(x-2,y+by-2,5,5,'#2a1a10');}
 // head: topknot and headband (lost in the second form), eyepatch, stubble
 const hx=cx,hy=17+by;
 if(two){for(let i=-7;i<=7;i+=2)L(hx+i,hy-6,hx+i*1.3,hy+3+Math.abs(i)%3,HR,2);}
 face(hx,hy,SK,{eye:OUTC,brow:HR,mouth:'#6a2a1a'});R(hx-4,hy+3,9,3,'#4a3428');R(hx-1,hy+4,3,1,'#6a2a1a');
 R(hx+1,hy-1,4,3,OUTC);L(hx-6,hy-3,hx+6,hy-1,OUTC,1);
 if(two){R(hx-3,hy,2,1,'#ff3030');L(hx-5,hy-4,hx-2,hy+3,'#a03020',1);E(hx,hy-6,7,3,HR);}
 else{E(hx,hy-6,6,3,HR);R(hx-1,hy-12,3,6,HR);R(hx-2,hy-13,5,2,HR);R(hx-6,hy-4,13,2,HB);R(hx-6,hy-4,13,1,'#e04040');L(hx-6,hy-3,hx-11,hy+1,HB,1);L(hx-6,hy-3,hx-10,hy+3,HB,1);}}
humBoss('GORO, THE BANDIT CAPTAIN',gorDraw,{
 idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[46,28],[54,20],[56,10]],ba:-2.3,bl:28,far:[[26,29],[18,36],[14,44]]}},{sc:1.1});
// ---------- falling in the prologue is not the end: Kaito pulls you out and you go again ----------
// You wake at the start of the stage with everything you carry. The stage is as you left it: opened chests stay open,
// foes you killed stay dead, used shrines stay used. If you fell to Goro, he goes back to his post at full health.
{const _fr2=finishRun;finishRun=function(win){if(!win&&R&&R.pro&&PRO_ON&&P&&!R.test)return proRespawn();return _fr2.apply(this,arguments);};}
function proRespawn(){R.proDeaths=(R.proDeaths||0)+1;
 try{if(typeof AMBX!=='undefined'&&AMBX.r){const r=AMBX.r;ambOpen();if(r.ev)r.ev.state=2;}}catch(_){}
 if(boss&&!boss.dead){try{bossReset(boss);}catch(_){}boss.hp=boss.maxhp;}
 for(const e of enemies)if(!e.dead&&!e.boss){e.awake=false;e.act=null;e.tele=0;}
 projs=projs.filter(q=>q.from!=='e');hz=[];if(typeof BMK!=='undefined')BMK.length=0;
 const sr=map.startRoom;P.x=(sr.x+sr.w/2)*T;P.y=(sr.y+sr.h/2)*T;P.dying=0;P.hp=S.maxhp;P.iv=2.5;P.stag=0;P.dash=0;P.deathCause=null;
 R.pots=Math.max(R.pots||0,1);mode='play';flashT=0;
 fxRing(P.x,P.y,40,'#ffd070',.6);spark(P.x,P.y,'#ffd070',24,90);sfx('heal');
 setToast('MASTER KAITO PULLS YOU FROM THE FIRE - TRY AGAIN','#ffd070',4);}
// ambush waves in the prologue bring one foe fewer (never below two)
{const _rs=roomSpawn;roomSpawn=function(r,n){if(PRO_ON)n=Math.max(2,n-1);return _rs.call(this,r,n);};}
