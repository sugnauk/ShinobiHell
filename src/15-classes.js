'use strict';
// HELL OF THE EMPEROR - character classes (part of the former game.js; files load in numeric order, see index.html)
// ================= CHARACTER CLASSES =================
// spells for the four new classes live at SPELLS[slot][4..7]; the wizard uses variant 0 of every slot
// dm = damage multiplier of POWER, db = which scaling it uses (b basic, a ability, q Q-power, e ultimate)
SPELLS.m.push({n:'KATANA COMBO',g:'/',c:'#e8eef6',d:'3-HIT SLASH COMBO. 3RD HIT CLEAVES',dm:1.25,db:'b',x:'3RD HIT: X2 DAMAGE, WIDER, KNOCKBACK'},
 {n:'QUICK ARROW',g:'>',c:'#e8dcb0',d:'FAST, LONG-RANGE ARROWS',dm:.85,db:'b'},
 {n:'KUNAI',g:'K',c:'#d0d8e0',d:'TWIN KUNAI, VERY FAST',dm:.6,db:'b',dx:' X 2'},
 {n:'PAPER TALISMAN',g:'T',c:'#f0e8d0',d:'HOMING TALISMANS',dm:.95,db:'b'});
SPELLS.h.push({n:'IAI CLEAVE',g:'-',c:'#fff',cd:1,d:'LUNGING LINE SLASH. BIG STUN',dm:2.6,db:'b',x:'FULL CHARGE: +50%, DEFLECTS SHOTS'},
 {n:'CHARGED SHOT',g:'!',c:'#ffe080',cd:.9,d:'ARROW THAT PIERCES EVERYTHING',dm:2.4,db:'b',x:'FULL CHARGE: +50%, CUTS SHOTS'},
 {n:'SHURIKEN FAN',g:'*',c:'#c8c8d0',cd:.8,d:'FAN OF 5 SHURIKEN',dm:.75,db:'b',dx:' X 5',x:'FULL CHARGE: 7 SHURIKEN'},
 {n:'SPIRIT FOX',g:'F',c:'#ff9a40',cd:1.4,d:'HOMING FOX, PIERCES 3',dm:1.9,db:'b',x:'FULL CHARGE: TWO FOXES'});
SPELLS.q.push({n:'WHIRLWIND',g:'O',c:'#e8eef6',cd:5,d:'SPIN SLASH: 3 HITS, CUTS SHOTS',dm:1.4,db:'q',dx:' X 3'},
 {n:'ARROW RAIN',g:'R',c:'#e8dcb0',cd:5,d:'VOLLEY AT CURSOR FOR 1.6S',dm:.35,db:'q',dx:' EVERY 0.15S'},
 {n:'SHADOW STEP',g:'S',c:'#9a7aff',cd:4,d:'BLINK BEHIND A FOE AND STAB',dm:3,db:'q'},
 {n:'SHIKIGAMI',g:'B',c:'#f0e8d0',cd:6,d:'2 PAPER SPIRITS FIGHT FOR 7S',dm:.3,db:'q',dx:' EVERY 0.45S EACH'});
SPELLS.w.push({n:'GUARD STANCE',g:'G',c:'#e0b040',cd:6,d:'BLOCK 1.2S. COUNTER-SLASH ON BLOCK',dm:2,db:'a',x:'BLOCKS ANY NON-PERIL HIT'},
 {n:'EVADE ROLL',g:'<',c:'#8f8',cd:4,d:'ROLL AWAY AND LEAVE A SNARE TRAP',dm:3,db:'a',x:'TRAP STUNS FOR 1S'},
 {n:'SMOKE BOMB',g:'%',c:'#aab',cd:10,d:'VANISH: FOES NEARBY GO BLIND',x:'1.2S INVULNERABLE, BLIND 3S'},
 {n:'BARRIER',g:'=',c:'#8cf',cd:12,d:'SHIELD ABSORBS 30% MAX HP FOR 6S'});
SPELLS.f.push({n:'WAR CRY',g:'!',c:'#f84',cd:12,d:'STUN FOES, +30% DAMAGE, HASTE 4S',x:'BOSSES TAKE STUN INSTEAD'},
 {n:'HAWK',g:'V',c:'#c8a060',cd:14,d:'HAWK FIRES HOMING FEATHERS 8S',dm:.5,db:'a',dx:' EVERY 0.5S'},
 {n:'CALTROPS',g:'X',c:'#8f4',cd:8,d:'SPIKES: SLOW, POISON, DAMAGE 5S',dm:.2,db:'a',dx:' EVERY 0.35S'},
 {n:'HEALING CIRCLE',g:'+',c:'#6f6',cd:15,d:'HEAL 5%/S INSIDE FOR 5S. HURTS FOES',dm:.25,db:'a'});
SPELLS.e.push({n:'DRAGON CLEAVE',g:'D',c:'#f44',cd:30,d:'DASH THROUGH FOES, THEN EXPLODE',dm:6,db:'e'},
 {n:'ARROW STORM',g:'#',c:'#e8dcb0',cd:34,d:'30 ARROWS RAIN ON THE CURSOR',dm:.8,db:'e',dx:' X 30'},
 {n:'SHADOW CLONES',g:'C',c:'#9a7aff',cd:30,d:'3 CLONES THROW KUNAI FOR 6S',dm:.3,db:'e',dx:' EVERY 0.25S EACH'},
 {n:'DRAGON SPIRIT',g:'D',c:'#6cf',cd:38,d:'A DRAGON TEARS THROUGH THE AIM LINE',dm:2.2,db:'e',dx:' X 9 BLASTS'});
// weapon-type LMB attacks (indices 8-15): each class has a weapon family, and the equipped weapon picks the LMB
SPELLS.m.push(
 {n:'NAGINATA SWEEP',g:'(',c:'#e8eef6',d:'LONG REACH SWEEP IN A WIDE ARC',dm:1.4,db:'b'},
 {n:'ODACHI CLEAVE',g:'/',c:'#ffe080',d:'SLOW, HUGE SLASH. BIG STUN DAMAGE',dm:3,db:'b'},
 {n:'HANKYU VOLLEY',g:'^',c:'#e8dcb0',d:'3 ARROWS IN A FAN',dm:.6,db:'b',dx:' X 3'},
 {n:'REPEATER BOLTS',g:'=',c:'#d8c8a0',d:'VERY FAST, LIGHT BOLTS',dm:.45,db:'b'},
 {n:'SHURIKEN',g:'*',c:'#c8c8d0',d:'SPINNING STAR. PIERCES 2 FOES',dm:1,db:'b'},
 {n:'KUSARIGAMA',g:'S',c:'#a0a8b0',d:'CHAIN SICKLE LASH. PULLS FOES IN',dm:1.3,db:'b'},
 {n:'SUZU PULSE',g:'o',c:'#ffe080',d:'BELL RING HITS ALL FOES AROUND YOU',dm:.9,db:'b'},
 {n:'SPIRIT MIRROR',g:'|',c:'#e0f0ff',d:'PIERCING BEAM OF LIGHT',dm:1.3,db:'b'});
// every weapon type and the LMB attack it gives. Any class can wield any type;
// each class mostly finds its own family and gets +25% LMB damage with its SIGNATURE type.
const WTYPES={STAFF:0,'WAR FAN':1,CENSER:2,KATANA:4,NAGINATA:8,ODACHI:9,YUMI:5,HANKYU:10,REPEATER:11,KUNAI:6,SHURIKEN:12,KUSARIGAMA:13,OFUDA:7,'SUZU BELL':14,'SPIRIT MIRROR':15};
const WFAM={wizard:['STAFF','WAR FAN','CENSER'],samurai:['KATANA','NAGINATA','ODACHI'],archer:['YUMI','HANKYU','REPEATER'],
 shinobi:['KATANA','KUNAI','SHURIKEN','KUSARIGAMA'],onmyoji:['OFUDA','SUZU BELL','SPIRIT MIRROR']};
const WSIG={wizard:'STAFF',samurai:'KATANA',archer:'YUMI',shinobi:'KATANA',onmyoji:'OFUDA'},SIGBONUS=1.25;
const LMBRATE={0:.3,1:.5,2:.5,3:.38,4:.3,5:.22,6:.2,7:.3,8:.4,9:.75,10:.3,11:.11,12:.28,13:.38,14:.45,15:.42};
const wfam=()=>WFAM[CLS().k];
function rollWT(){return Math.random()<.75?pick(wfam()):pick(Object.keys(WTYPES));}
const wtName=g=>(g&&typeof g.wt==='string')?g.wt:WSIG[CLS().k];
const isSig=g=>wtName(g)===WSIG[CLS().k];
// legendary weapons: a wizard's legendary staff fires Kami Seekers; every other legendary empowers its attack
function wpnLMB(g){if(!g)return WTYPES[WSIG[CLS().k]];if(g.rare&&CLS().k==='wizard'&&wtName(g)==='STAFF')return 3;return WTYPES[wtName(g)];}
function syncLMB(){if(!P||!R||!R.eq)return;const g=R.eq.wpn;
 // enchants live ON the equipped weapon: R.ench is that weapon's list (swap weapons and its enchants come with it)
 R.ench=g?(g.ench=g.ench||[]):[];G('w',wtName(g));if(R.eq.ring&&R.eq.ring.stat)G('t',R.eq.ring.stat);P.lo.m=wpnLMB(g);P.emp=P.emp||{};P.emp.m=g&&g.rare&&P.lo.m!==3?1:0;P.sig=isSig(g);}
const CLASSES=[
 {k:'wizard',n:'WIZARD',col:'#c8f',d:'RANGED SPELLS, ELEMENTAL COMBOS. +20% POWER.',pw:1.2,hp:1,spd:1,dash:1,def:0,kit:{m:0,h:1,q:0,w:0,f:0,e:0}},
 {k:'archer',n:'ARCHER',col:'#8f8',d:'LONG RANGE, TRAPS AND A HAWK. FAST.',hp:.9,spd:1.08,dash:.9,def:0,kit:{m:5,h:5,q:5,w:5,f:5,e:5}},
 {k:'samurai',n:'SAMURAI',col:'#f55',d:'BLADES CUT BULLETS. GUARD COUNTERS. +35% HP, +3 DEF.',hp:1.35,spd:.97,dash:1.1,def:3,kit:{m:4,h:4,q:4,w:4,f:4,e:4}},
 {k:'shinobi',n:'SHINOBI',col:'#9a7aff',d:'BLINKS AND POISON. BLADES CUT BULLETS. SWIFT.',hp:.82,spd:1.15,dash:.65,def:0,kit:{m:4,h:6,q:6,w:6,f:6,e:6}},
 {k:'onmyoji',n:'ONMYOJI',col:'#f0e8d0',d:'SUMMONS SPIRITS, SHIELDS AND HEALS.',hp:.95,spd:1,dash:1,def:1,kit:{m:7,h:7,q:7,w:7,f:7,e:7}}];
const CLS=()=>CLASSES[(R&&R.testCls!=null)?R.testCls:((meta&&meta.cls)||0)]; // a test run (99-testmode.js) plays its own character
// class stat modifiers + the deathblow item effect, layered on top of the base stat calculation
{const cs0=calcStats;calcStats=function(){const s=cs0(),c=CLS();s.maxhp=Math.round(s.maxhp*c.hp);s.atk*=c.pw||1;s.spd*=c.spd;s.dashCd*=c.dash;s.def+=c.def;
 // skill tree nodes (temple)
 s.crit+=.03*upLv('crit');s.atk*=1+.1*upLv('wrath');s.def+=upLv('iron');s.spd*=1+.03*upLv('swift');s.dashCd*=Math.pow(.92,upLv('dashm'));s.dblow=(R&&R.inv?(R.inv.dblow||0):0)+(R&&R.eq?(gearStats().fx.dblow||0):0);return s;};}
// ten evolution names and looks per class
const EVONAMES={samurai:['RONIN','FOOTMAN','ASHIGARU','SWORDSMAN','HATAMOTO','SAMURAI','KENSHI','WARLORD','SHOGUN BLADE','KENSEI'],
 archer:['HUNTER','SCOUT','BOWMAN','MARKSMAN','RANGER','SHARPSHOOTER','HAWKEYE','WINDSTRIDER','STORM ARCHER','MASTER ARCHER'],
 shinobi:['THIEF','GENIN','SHADOW','INFILTRATOR','CHUNIN','ASSASSIN','JONIN','SHADOW MASTER','PHANTOM','GRANDMASTER'],
 onmyoji:['ACOLYTE','SCRIBE','DIVINER','EXORCIST','SPIRIT CALLER','ONMYOJI','SAGE','HIGH ONMYOJI','SPIRIT LORD','GRAND ONMYOJI']};
function mixC(a,b,t){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function heroEV(cls,st){if(cls==='wizard')return WIZEVO[st];const t=st/9,n=EVONAMES[cls][st];
 if(cls==='samurai')return {n,hat:st<3?'kasa':'kabuto',crest:st>=6,beard:st>=8?1:0,wpn:st<1?'bokken':'katana',C:{hat:st<3?'#c8a050':mixC('#5a4a3a','#8a1818',t),hatL:st<3?'#e0c070':'#c8c8d0',band:st>=4?'#e0b040':'#6a5a4a',robe:mixC('#6a5a4a','#a02020',t),robeS:mixC('#4a3a2a','#5a1010',t),trim:st>=4?'#e0b040':'#3a2a1a',beard:'#3a3a3a',beardS:'#2a2a2a'}};
 if(cls==='archer')return {n,hat:st<6?'hood':'kasa',beard:0,wpn:'bow',C:{hat:mixC('#5a5a3a','#2e6a2a',t),hatL:mixC('#7a7a5a','#4a9a3a',t),band:st>=6?'#c8c8d0':'#4a4a2a',robe:mixC('#6a6a4a','#2e7a3a',t),robeS:mixC('#4a4a2a','#1e4a22',t),trim:st>=5?'#c8c8d0':'#5a4a2a'}};
 if(cls==='shinobi')return {n,hat:'mask',beard:0,wpn:'kunai',C:{hat:mixC('#4a4a52','#1a1628',t),hatL:'#5a5a6a',band:st>=2?mixC('#802020','#e02040',t):'#3a3a42',robe:mixC('#4a4a52','#1e1a30',t),robeS:mixC('#32323a','#100c1c',t),trim:st>=4?'#9a7aff':'#2a2a32'}};
 return {n,hat:st<2?'hood':'eboshi',beard:st>=7?1:0,wpn:'gohei',C:{hat:st<2?'#a8a090':'#1a1a1a',hatL:st<2?'#c8c0b0':'#3a3a3a',band:st>=5?'#8a3ac8':'#a8a090',robe:mixC('#c8c0b0','#f4f4fc',t),robeS:mixC('#a8a090','#c8c8e0',t),trim:st>=3?mixC('#c03030','#8a3ac8',t):'#a8a090',beard:'#2a2a2a',beardS:'#1a1a1a'}};}
const HEROC={};
function heroSpr(cls,st,back){const k=cls+st+(back?'b':'');if(HEROC[k])return HEROC[k];
 if(!back)return HEROC[k]=cls==='wizard'?WIZSPR[st]:buildHero(heroEV(cls,st),false);
 return HEROC[k]=cls==='wizard'?buildHero(WIZEVO[st],st>=9,true):buildHero(heroEV(cls,st),false,true);}
const evoName=st=>heroEV(CLS().k,st).n;
// class ability helpers
const EMP=k=>P&&P.emp&&P.emp[k]?1.6:1;
function setCd(k){if(k==='m')return;if(k==='h')P.ab.h=spellCd('h')/S.aspd;else if(k==='w')P.ab.rmb=spellCd('w');else P.ab[k]=spellCd(k);}
function lineHit(x,y,a,len,wid,fn){for(const e of enemies){if(e.dead||e.air)continue;const dx=e.x-x,dy=e.y-y,al=dx*Math.cos(a)+dy*Math.sin(a),pe=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(al>-6&&al<len+e.r&&pe<wid+e.r&&los(x,y,e.x,e.y))fn(e);}}
function nearestFoe(x,y,r){let best=null,bd=r;for(const e of enemies){if(e.dead||e.air||e.type==='turret')continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd&&los(x,y,e.x,e.y)){bd=d;best=e;}}return best;}
const pShot=(x,y,a,sp,dmg,o)=>projs.push(mkProj('p',x,y,a,sp,dmg,Object.assign({main:true,pierce:S.pierce,pd:8,life:.6*(1+S.rangeM)},o||{})));
function classCast(k){const p=P,v=p.lo[k],a=p.aim,em=EMP(k),A=S.atk,bp=BP()*(p.mik>0&&(k==='m'||k==='h')?1.6:1)*(k==='h'&&p.hFull?1.5:1),ap=AP(),qm=(1+.3*S.qpow)*ap,ep=(1+.25*S.epow)*(1+.06*RK())*ap,rage=1;
 if(p.stag>0)return;if(k==='m'&&p.atkCd>0)return;if(k==='h'&&p.ab.h>0)return;if(k==='w'&&p.ab.rmb>0)return;if('qfe'.includes(k)&&p.ab[k]>0)return;
 if(k==='m'||k==='h')p.mik=0;
 const mw=mouseWorld(),clampT=(d)=>{d*=1.4;let tx=mw.x,ty=mw.y;const dd=Math.hypot(tx-p.x,ty-p.y);if(dd>d){tx=p.x+(tx-p.x)/dd*d;ty=p.y+(ty-p.y)/dd*d;}return {x:tx,y:ty};};
 const cutCone=(r,arc)=>{for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<r&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a))<arc){q.dead=true;spark(q.x,q.y,'#fff',3,40);}};
 switch(v*10+'mhqwfe'.indexOf(k)){
  // ---------- SAMURAI ----------
  case 40:{const cont=R.time-(p.lastSw||-9)<.75;p.combo=cont?((p.combo||0)+1)%3:0;p.lastSw=R.time;const fin=p.combo===2,rr=(fin?40:32)*(1.12+S.rangeM*.5);
   coneHit(p.x,p.y,a,rr,fin?2.6:1.7,e=>hurtE(e,A*(fin?2.5:1.25)*bp*em,fin?24:12,{slash:true,kb:fin?Math.atan2(e.y-p.y,e.x-p.x):undefined}));
   fx.push({k:'slash',x:p.x,y:p.y,a:a+(p.combo===1?.3:-.3),arc:fin?2.6:1.7,r:rr,t:.14,dur:.14,col:fin?'#ffe080':'#e8eef6'});sfx('slash');if(fin)shake=Math.max(shake,2);p.atkCd=(fin?.42:.24)/S.aspd;break;}
  case 41:{let n=0;for(let s=0;s<=30;s+=2){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;n=s;}const x0=p.x,y0=p.y;p.x+=Math.cos(a)*n;p.y+=Math.sin(a)*n;
   lineHit(x0,y0,a,90,14,e=>hurtE(e,A*2.6*bp*em,45,{slash:true,kb:a}));if(p.hFull)for(const q of projs)if(q.from==='e'&&!q.peril){const dx=q.x-x0,dy=q.y-y0,al=dx*Math.cos(a)+dy*Math.sin(a);if(al>0&&al<95&&Math.abs(-dx*Math.sin(a)+dy*Math.cos(a))<16){q.dead=true;spark(q.x,q.y,'#fff',3,40);}}
   fx.push({k:'line',x:x0,y:y0,a,len:95,t:.18,dur:.18,col:p.hFull?'#ffe080':'#fff'});sfx('slash');impact(p.x,p.y,'#fff',3);break;}
  case 42:{zones.push({k:'whirl',x:p.x,y:p.y,r:46*AZ(),t:.62,tk:0,dm:A*1.4*qm*em,n:0});sfx('dash');break;}
  case 43:{p.guardSt=1.2;fxRing(p.x,p.y,18,'#e0b040',.3);sfx('block');break;}
  case 44:{const r=85*AZ();impact(p.x,p.y,'#f84',6,true);fxRing(p.x,p.y,r,'#f84',.45);sfx('boss');p.haste=4;p.rage=5;txtFx(p.x,p.y,'WAR CRY','#f84');
   for(const e of enemies){if(e.dead||e.air||!los(p.x,p.y,e.x,e.y)||Math.hypot(e.x-p.x,e.y-p.y)>r+e.r)continue;if(e.boss){e.posture+=60*em;checkBreak(e);}else{e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,1.2*em);}}break;}
  case 45:{let n=0;for(let s=0;s<=130;s+=3){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;n=s;}const x0=p.x,y0=p.y;p.x+=Math.cos(a)*n;p.y+=Math.sin(a)*n;p.iv=Math.max(p.iv,.6);
   lineHit(x0,y0,a,n,22,e=>hurtE(e,A*6*ep*em,80,{slash:true}));fx.push({k:'line',x:x0,y:y0,a,len:n,t:.35,dur:.35,col:'#f44'});
   fx.push({k:'ult',x:p.x,y:p.y,t:.3,dur:.3,r:50,col:'#f44',dm:A*3*ep*em,met:1,done:false});sfx('boss');impact(p.x,p.y,'#f44',8,true);break;}
  // ---------- ARCHER ----------
  case 50:{const n=1+S.wave;for(let i=0;i<n;i++)pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+(n>1?(i-(n-1)/2)*.15:0),300,A*.85*bp*em*(n>1?.8:1),{r:2,arrow:true,col:'#e8dcb0',life:.75*(1+S.rangeM)});p.atkCd=.22/S.aspd;sfx('shoot');break;}
  case 51:{pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a,380,A*2.4*bp*em,{r:3,arrow:true,col:p.hFull?'#fff':'#ffe080',pierce:99,cut:p.hFull?1:0,life:.7*(1+S.rangeM),pd:20});sfx('shoot');if(p.hFull)impact(p.x,p.y,'#ffe080',2);break;}
  case 52:{const t=clampT(160);zones.push({k:'rain',x:t.x,y:t.y,r:42*AZ(),t:1.6,tk:0,dm:A*.35*qm*em});sfx('shoot');break;}
  case 53:{const ra=a+Math.PI;zones.push({k:'trap',x:p.x,y:p.y,r:16,t:10,tk:0,dm:A*3*ap*em});p.dx=Math.cos(ra);p.dy=Math.sin(ra);p.dash=.2;p.iv=Math.max(p.iv,.4);sfx('dash');break;}
  case 54:{zones.push({k:'hawk',x:p.x,y:p.y,r:0,t:8,tk:.3,dm:A*.5*ap*em,ang:0});sfx('rare');break;}
  case 55:{const t=clampT(170);sfx('boss');setToast('ARROW STORM','#e8dcb0',1.2);for(let i=0;i<30;i++){const an=Math.random()*TAU,rr=Math.sqrt(Math.random())*70;fx.push({k:'ult',x:t.x+Math.cos(an)*rr,y:t.y+Math.sin(an)*rr,wait:i*.09,t:.35,dur:.35,r:16,col:'#e8dcb0',dm:A*.8*ep*em,met:1,done:false});}break;}
  // ---------- SHINOBI ----------
  case 60:{for(const o of [-.07,.07])pShot(p.x+Math.cos(a)*5,p.y+Math.sin(a)*5,a+o,290,A*.6*bp*em,{r:2,arrow:true,col:'#d0d8e0'});p.atkCd=.2/S.aspd;sfx('shoot');break;}
  case 61:{const n=p.hFull?7:5;for(let i=0;i<n;i++)pShot(p.x,p.y,a+(i/(n-1)-.5)*.9,210,A*.75*bp*em,{r:2,col:'#c8c8d0',pierce:1+S.pierce,cut:p.hFull?1:0});sfx('shoot');break;}
  case 62:{let tg=null,bd=1e9;for(const e of enemies){if(e.dead||e.air||e.type==='turret'||dist(e,p)>170||!los(p.x,p.y,e.x,e.y))continue;const d=dist(e,mw);if(d<bd){bd=d;tg=e;}}if(!tg){txtFx(p.x,p.y,'NO TARGET','#aaa');return;}
   const ba=Math.atan2(tg.y-p.y,tg.x-p.x);spark(p.x,p.y,'#9a7aff',14,80);let nx=tg.x+Math.cos(ba)*(tg.r+8),ny=tg.y+Math.sin(ba)*(tg.r+8);if(blocked(nx,ny,4)){nx=tg.x-Math.cos(ba)*(tg.r+8);ny=tg.y-Math.sin(ba)*(tg.r+8);}if(!blocked(nx,ny,4)){p.x=nx;p.y=ny;}
   p.iv=Math.max(p.iv,.4);hurtE(tg,A*3*qm*em,40,{slash:true});spark(tg.x,tg.y,'#fff',10,90);impact(tg.x,tg.y,'#9a7aff',4);sfx('dash');break;}
  case 63:{p.iv=Math.max(p.iv,1.2);zones.push({k:'smoke',x:p.x,y:p.y,r:60,t:3,tk:0});for(const e of enemies)if(!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<100){e.blind=3*em;e.act=null;e.tele=0;}sfx('dash');for(let i=0;i<40;i++){const an=Math.random()*TAU,s=rnd(20,80);particles.push({x:p.x,y:p.y,vx:Math.cos(an)*s,vy:Math.sin(an)*s,t:rnd(.6,1.2),col:pick(['#aab','#889','#ccd'])});}break;}
  case 64:{zones.push({k:'calt',x:p.x,y:p.y,r:36*AZ(),t:5,tk:0,dm:A*.2*ap*em});sfx('tool');break;}
  case 65:{for(let i=0;i<3;i++)zones.push({k:'clone',x:p.x,y:p.y,r:0,t:6,tk:i*.08,dm:A*.3*ep*em,ang:i*TAU/3});sfx('boss');spark(p.x,p.y,'#9a7aff',30,120);break;}
  // ---------- ONMYOJI ----------
  case 70:{pShot(p.x+Math.cos(a)*5,p.y+Math.sin(a)*5,a,170,A*.95*bp*em,{r:3,col:'#f0e8d0',home:true,life:1.1*(1+S.rangeM)});p.atkCd=.3/S.aspd;sfx('shoot');break;}
  case 71:{const n=p.hFull?2:1;for(let i=0;i<n;i++)pShot(p.x,p.y,a+(n>1?(i?.3:-.3):0),130,A*1.9*bp*em,{r:4,col:'#ff9a40',home:true,pierce:3+S.pierce,life:1.6,pd:16});sfx('tool');break;}
  case 72:{for(let i=0;i<2;i++)zones.push({k:'shiki',x:p.x,y:p.y,r:0,t:7,tk:i*.2,dm:A*.3*qm*em,ang:i*Math.PI});sfx('rare');break;}
  case 73:{p.shieldHp=S.maxhp*.3*em;p.shieldT=6;fxRing(p.x,p.y,20,'#8cf',.4);sfx('heal');break;}
  case 74:{zones.push({k:'heal',x:p.x,y:p.y,r:40*AZ(),t:5,tk:0,dm:A*.25*ap*em,hp:S.maxhp*.0125*em});sfx('heal');break;}
  case 75:{sfx('boss');setToast('DRAGON SPIRIT','#6cf',1.2);for(let i=0;i<9;i++){const d=20+i*18,x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(solid(x,y))break;fx.push({k:'ult',x,y,wait:i*.1,t:.3,dur:.3,r:26,col:'#6cf',dm:A*2.2*ep*em,met:1,done:false});}break;}
  // ---------- WEAPON-TYPE LMB ATTACKS ----------
  case 80:{const rr=48*(1.12+S.rangeM*.5);coneHit(p.x,p.y,a,rr,2.4,e=>hurtE(e,A*1.4*bp*em,14,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   fx.push({k:'slash',x:p.x,y:p.y,a,arc:2.4,r:rr,t:.16,dur:.16,col:'#e8eef6'});sfx('slash');p.atkCd=LMBRATE[8]/S.aspd;break;}
  case 90:{const rr=40*(1.12+S.rangeM*.5);coneHit(p.x,p.y,a,rr,2,e=>hurtE(e,A*3*bp*em,40,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   fx.push({k:'slash',x:p.x,y:p.y,a,arc:2,r:rr,t:.2,dur:.2,col:'#ffe080'});fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.7,r:rr-8,t:.16,dur:.16,col:'#fff'});sfx('slash');shake=Math.max(shake,3);hitstop=Math.max(hitstop,.03);p.atkCd=LMBRATE[9]/S.aspd;break;}
  case 100:{for(let i=-1;i<=1;i++)pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+i*.18,280,A*.6*bp*em,{r:2,arrow:true,col:'#e8dcb0',life:.6*(1+S.rangeM)});p.atkCd=LMBRATE[10]/S.aspd;sfx('shoot');break;}
  case 110:{pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+rnd(-.06,.06),320,A*.45*bp*em,{r:2,arrow:true,col:'#d8c8a0',life:.55*(1+S.rangeM)});p.atkCd=LMBRATE[11]/S.aspd;sfx('shoot');break;}
  case 120:{pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a,230,A*bp*em,{r:3,col:'#c8c8d0',pierce:2+S.pierce,life:.7*(1+S.rangeM)});p.atkCd=LMBRATE[12]/S.aspd;sfx('shoot');break;}
  case 130:{const len=62*(1.12+S.rangeM*.5);lineHit(p.x,p.y,a,len,8,e=>{hurtE(e,A*1.3*bp*em,14,{slash:true});if(!e.boss&&!e.dead){e.kx-=Math.cos(a)*70;e.ky-=Math.sin(a)*70;}});
   fx.push({k:'line',x:p.x,y:p.y,a,len,t:.14,dur:.14,col:'#a0a8b0'});sfx('slash');p.atkCd=LMBRATE[13]/S.aspd;break;}
  case 140:{const r=38*AZ();for(const e of enemies){if(e.dead||e.air||Math.hypot(e.x-p.x,e.y-p.y)>r+e.r||!los(p.x,p.y,e.x,e.y))continue;hurtE(e,A*.9*bp*em,8,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)});}
   fxRing(p.x,p.y,r,'#ffe080',.22);sfx('tool');p.atkCd=LMBRATE[14]/S.aspd;break;}
  case 150:{const len=130*(1+S.rangeM);lineHit(p.x,p.y,a,len,6,e=>hurtE(e,A*1.3*bp*em,10,{slash:true}));
   fx.push({k:'line',x:p.x,y:p.y,a,len,t:.16,dur:.16,col:'#e0f0ff'});sfx('shoot');p.atkCd=LMBRATE[15]/S.aspd;break;}
  default:return;}
 setCd(k);}
// class zones: per-frame behaviour and drawing
const CZ={
 whirl:(z,dt)=>{z.x=P.x;z.y=P.y;if(z.tk<=0&&z.n<3){z.tk=.2;z.n++;for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r&&los(z.x,z.y,e.x,e.y))hurtE(e,z.dm,14,{slash:true,kb:Math.atan2(e.y-z.y,e.x-z.x)});for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,z)<z.r){q.dead=true;spark(q.x,q.y,'#fff',2,30);}sfx('slash');}},
 rain:(z)=>{if(z.tk<=0){z.tk=.15;for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r&&los(z.x,z.y,e.x,e.y))hurtE(e,z.dm,4,{nost:true});const an=Math.random()*TAU,rr=Math.random()*z.r;particles.push({x:z.x+Math.cos(an)*rr,y:z.y+Math.sin(an)*rr,vx:0,vy:0,t:.15,col:'#e8dcb0'});}},
 trap:(z)=>{for(const e of enemies){if(e.dead||e.air||e.type==='turret'||Math.hypot(e.x-z.x,e.y-z.y)>z.r+e.r)continue;z.t=0;fxRing(z.x,z.y,40,'#8f8',.35);impact(z.x,z.y,'#8f8',4);sfx('break');for(const o of enemies)if(!o.dead&&!o.air&&Math.hypot(o.x-z.x,o.y-z.y)<40+o.r&&los(z.x,z.y,o.x,o.y)){hurtE(o,z.dm,30,{nost:true});if(!o.dead&&!o.boss){o.stun=Math.max(o.stun||0,1);o.act=null;}}break;}},
 hawk:(z,dt)=>{z.ang+=dt*3;z.x=P.x+Math.cos(z.ang)*22;z.y=P.y+Math.sin(z.ang)*22;if(z.tk<=0){z.tk=.5;const e=nearestFoe(z.x,z.y,220);if(e)pShot(z.x,z.y,Math.atan2(e.y-z.y,e.x-z.x),200,z.dm,{r:2,col:'#c8a060',home:true,life:1});}},
 calt:(z)=>{for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r)e.zs=e.boss?.7:.45;if(z.tk<=0){z.tk=.35;for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){hurtE(e,z.dm,3,{nost:true});applyStatus(e,'poison');}}},
 smoke:()=>{},
 clone:(z,dt)=>{z.ang+=dt*1.2;z.x=P.x+Math.cos(z.ang)*26;z.y=P.y+Math.sin(z.ang)*26;if(z.tk<=0){z.tk=.25;const e=nearestFoe(z.x,z.y,220);if(e)pShot(z.x,z.y,Math.atan2(e.y-z.y,e.x-z.x),280,z.dm,{r:2,arrow:true,col:'#9a7aff',life:.7});}},
 shiki:(z,dt)=>{z.ang+=dt*2.2;z.x=P.x+Math.cos(z.ang)*22;z.y=P.y+Math.sin(z.ang)*22;if(z.tk<=0){z.tk=.45;const e=nearestFoe(z.x,z.y,220);if(e)pShot(z.x,z.y,Math.atan2(e.y-z.y,e.x-z.x),150,z.dm,{r:2,col:'#f0e8d0',home:true,life:1.2});}},
 heal:(z)=>{if(z.tk<=0){z.tk=.25;if(Math.hypot(P.x-z.x,P.y-z.y)<z.r){P.hp=Math.min(S.maxhp,P.hp+z.hp);particles.push({x:P.x+rnd(-4,4),y:P.y,vx:0,vy:-25,t:.5,col:'#6f6'});}for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r)hurtE(e,z.dm,2,{nost:true});}}};
const CZD={
 whirl:z=>{const k=1-z.t/.62;for(let i=0;i<3;i++)fxArc(z.x,z.y,z.r-i*6,time*14+i*2,2.2,'#e8eef6');},
 rain:z=>{ctx.globalAlpha=.2;wdisc(z.x,z.y,z.r,'#e8dcb0');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#e8dcb0');for(let i=0;i<5;i++){const an=Math.random()*TAU,rr=Math.random()*z.r,x=z.x+Math.cos(an)*rr,y=z.y+Math.sin(an)*rr;sline(sx(x,y)+3,sy(x,y)-14,sx(x,y),sy(x,y),'#e8dcb0');}},
 trap:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#5a4a2a';ctx.fillRect(X-4,Y-1,9,3);ctx.fillStyle=Math.floor(time*3)%2?'#8f8':'#4a8';ctx.fillRect(X-3,Y-2,1,1);ctx.fillRect(X+3,Y-2,1,1);ctx.fillRect(X,Y-1,1,1);},
 hawk:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y)-18,w=Math.floor(time*10)%2;ctx.fillStyle='#14101a';ctx.fillRect(X-4,Y-1,9,3);ctx.fillStyle='#8a6a40';ctx.fillRect(X-1,Y-1,3,2);ctx.fillStyle='#c8a060';ctx.fillRect(X-4,Y-(w?1:0),3,1);ctx.fillRect(X+2,Y-(w?1:0),3,1);ctx.fillStyle='#fff';ctx.fillRect(X+1,Y-1,1,1);},
 calt:z=>{ctx.globalAlpha=.25;wdisc(z.x,z.y,z.r,'#4a6a2a');ctx.globalAlpha=1;for(let i=0;i<10;i++){const an=i*2.4,rr=(i*7%10)/10*z.r,x=z.x+Math.cos(an)*rr,y=z.y+Math.sin(an)*rr;ctx.fillStyle='#a0a8b0';ctx.fillRect(sx(x,y),sy(x,y)-1,2,1);ctx.fillRect(sx(x,y),sy(x,y)-2,1,1);}},
 smoke:z=>{ctx.globalAlpha=Math.min(.45,z.t*.25);for(let i=0;i<6;i++){const an=i+time*.5;wdisc(z.x+Math.cos(an)*12,z.y+Math.sin(an)*12,z.r*.6,'#8a8a96');}ctx.globalAlpha=1;},
 clone:z=>{const s=heroSpr(CLS().k,P.evo||0);ctx.globalAlpha=.55;drawSpr(s,sx(z.x,z.y),sy(z.x,z.y)+3,false,0,false);ctx.globalAlpha=1;},
 shiki:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y)-14+Math.round(Math.sin(time*6+z.ang)*2);ctx.fillStyle='#14101a';ctx.fillRect(X-4,Y-2,9,4);ctx.fillStyle='#f0e8d0';ctx.fillRect(X-3,Y-1,7,2);ctx.fillStyle='#e03040';ctx.fillRect(X,Y-1,1,2);},
 heal:z=>{ctx.globalAlpha=.18+.08*Math.sin(time*4);wdisc(z.x,z.y,z.r,'#6f6');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#8f8');for(let i=0;i<4;i++){const an=time+i*1.57,x=z.x+Math.cos(an)*z.r*.6,y=z.y+Math.sin(an)*z.r*.6;ctx.fillStyle='#cfc';ctx.fillRect(sx(x,y),sy(x,y)-3,1,3);ctx.fillRect(sx(x,y)-1,sy(x,y)-2,3,1);}}};
function fxArc(x,y,r,a0,arc,col){ctx.fillStyle=col;for(let a=0;a<arc;a+=.12){const aa=a0+a,px=x+Math.cos(aa)*r,py=y+Math.sin(aa)*r;ctx.fillRect(sx(px,py),sy(px,py)-6,1,1);}}
// route each slot to the class version when the class kit uses variant 4+
{const cw=(fn,k)=>function(){if(P&&P.lo[k]>=4)return classCast(k);return fn.apply(this,arguments);};
 castBolt=cw(castBolt,'m');castHeavy=cw(castHeavy,'h');castChain=cw(castChain,'q');castWard=cw(castWard,'w');castF=cw(castF,'f');castUlt=cw(castUlt,'e');}
// play the matching wizard animation whenever a spell actually goes off (its cooldown changes)
const wrapA=(fn,get,k,t)=>function(){const b=P&&get();fn.apply(this,arguments);if(P&&get()!==b){P.animK=k;P.animT=t;P.animD=t;P.combatT=2;}};
castBolt=wrapA(castBolt,()=>P.atkCd,'atk',.16);castHeavy=wrapA(castHeavy,()=>P.ab.h,'atk',.2);
castChain=wrapA(castChain,()=>P.ab.q,'cast',.32);castWard=wrapA(castWard,()=>P.ab.rmb,'cast',.32);castF=wrapA(castF,()=>P.ab.f,'cast',.32);castUlt=wrapA(castUlt,()=>P.ab.e,'ult',.6);
// training: locked slots do nothing; successful casts report to the lesson
const lockW=(fn,k,get)=>function(){if(P&&P.lock&&P.lock[k])return;const b=get&&P&&get();const r=fn.apply(this,arguments);if(get&&P&&R&&R.training&&get()!==b)trainEv('cast',k);return r;};
castBolt=lockW(castBolt,'m');castHeavy=lockW(castHeavy,'h');castChain=lockW(castChain,'q',()=>P.ab.q);castWard=lockW(castWard,'w',()=>P.ab.rmb);castF=lockW(castF,'f',()=>P.ab.f);castUlt=lockW(castUlt,'e',()=>P.ab.e);tryDash=lockW(tryDash,'d');
// tag every shot, zone and blast a cast creates with its slot, so enchants and scroll add-ons only touch abilities (never LMB)
{const srcW=(fn,k)=>function(){if(k==='m')syncLMB();const n0=projs.length,z0=zones.length,f0=fx.length,prev=castSrc;castSrc=k;
  try{return fn.apply(this,arguments);}finally{castSrc=prev;
   const ex=k==='m'?0:abFx(k).pierce||0;
   for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from==='p'&&q.src==null){q.src=k;q.pierce=(q.pierce||0)+ex;}}
   for(let i=z0;i<zones.length;i++)if(zones[i].src==null)zones[i].src=k;for(let i=f0;i<fx.length;i++)if(fx[i].src==null)fx[i].src=k;}};
 castBolt=srcW(castBolt,'m');castHeavy=srcW(castHeavy,'h');castChain=srcW(castChain,'q');castWard=srcW(castWard,'w');castF=srcW(castF,'f');castUlt=srcW(castUlt,'e');}
// one action at a time: every cast briefly locks out the others, and nothing else fires while RMB is charging
{const LOCK={m:.06,h:.15,q:.3,w:.3,f:.3,e:.4};
 // abilities (Q, RMB ward, F, E) take priority: the basic attack's tiny lock never blocks them and they work while RMB charges.
 // An ability pressed during another ability's lock is buffered and goes off as soon as the lock ends.
 const actW=(fn,k,get)=>function(){if(!P)return;const ab=k!=='m'&&k!=='h',args=[...arguments];
  if(P.lockT>0&&!(ab&&P.lockK==='m')){if(ab)P.qAb={t:.35,f:()=>({q:castChain,w:castWard,f:castF,e:castUlt})[k](...args)};return;}
  if(!ab&&k!=='h'&&P.hCh>0)return;
  const b=get();const r=fn.apply(this,arguments);if(get()!==b){P.lockT=LOCK[k];P.lockK=k;if(ab)P.qAb=null;}return r;};
 castBolt=actW(castBolt,'m',()=>P.atkCd);castHeavy=actW(castHeavy,'h',()=>P.ab.h);castChain=actW(castChain,'q',()=>P.ab.q);
 castWard=actW(castWard,'w',()=>P.ab.rmb);castF=actW(castF,'f',()=>P.ab.f);castUlt=actW(castUlt,'e',()=>P.ab.e);}
function smite(f){ // Heavenly Judgment: a bolt from the sky on each target
 if(f.tgt&&!f.tgt.dead){f.x=f.tgt.x;f.y=f.tgt.y;}
 impact(f.x,f.y,'#ffffa0',6,true);sfx('deflect');fxRing(f.x,f.y,f.r,'#ffffa0',.3);
 for(const e of enemies){if(e.dead||e.air)continue;if(los(f.x,f.y,e.x,e.y)&&Math.hypot(e.x-f.x,e.y-f.y)<f.r+e.r){hurtE(e,e===f.tgt?f.dm:f.dm*.5,40,{slash:true,el:'shock'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,1);}}}
}
function ultBlast(f){
 {const gz=zones.find(z=>z.k==='grav'&&Math.hypot(z.x-f.x,z.y-f.y)<z.r);if(gz&&!f.sing){f.sing=1;f.dm=(f.dm||S.atk*7*(1+.25*S.epow)*AP())*1.5;f.r*=1.3;txtFx(f.x,f.y,'SINGULARITY','#c080ff',2);fxRing(f.x,f.y,f.r*1.6,'#c080ff',.6);}}
 const c=f.col||'#fd4';if(f.met){impact(f.x,f.y,c,6);sfx('hit');sfx('break');}else{impact(f.x,f.y,c,12,true);hitstop=.12;sfx('break');}fxRing(f.x,f.y,f.r*1.2,c,.5);spark(f.x,f.y,c,f.met?20:40,160);spark(f.x,f.y,'#fff',f.met?6:16,110);
 for(const e of enemies){if(e.dead||e.air)continue;if(los(f.x,f.y,e.x,e.y)&&Math.hypot(e.x-f.x,e.y-f.y)<f.r+e.r){hurtE(e,f.dm||S.atk*7*(1+.25*S.epow)*AP(),f.met?60:170,{slash:true,el:'burn'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=f.met?.5:1.2;}}}
 for(const q of projs)if(q.from==='e'&&Math.hypot(q.x-f.x,q.y-f.y)<f.r)q.dead=true;
}
