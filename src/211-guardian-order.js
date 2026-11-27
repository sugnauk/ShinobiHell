'use strict';
// SHINOBIDUNGEONS 0.8.19 - THE GUARDIAN ORDER. Akagane, the Red Ox, was the first guardian after the prologue and the
// hardest early fight by far. He now guards stage VIII, and every guardian from Kusakari to Onikuma moves up one stage:
//    I Kusakari   II Itohime   III Hotaru   IV the Ronin Seven   V Tetsuo   VI the Abbot   VII Onikuma   VIII Akagane
// The STAGES do not move (scenery, foes, rooms, the Moth Queen at IV, the Hitobashira's lair at VI): only who waits in
// each arena. A guardian keeps its own fight, art, theme, relic, spirit trail, arena seal and music; it takes the
// difficulty of its new stage (damage and posture by stage, base health by stage), and its own health multiplier
// (BOSS_HPT, which carries shields like Hotaru's lanterns) is re-tuned with the fight bot so each fight lands in the
// owner's target windows (see GORDER.TUNE below).
const GORDER={src:[1,2,3,4,5,6,7,0]};          // the old stage index of the guardian now at each stage 0..7
GORDER.newOf=[];GORDER.src.forEach((o,n)=>{GORDER.newOf[o]=n;});
{const N=GORDER.src.length,perm=a=>{if(!a)return;const old=a.slice(0,N);for(let i=0;i<N;i++)a[i]=old[GORDER.src[i]];};
 // the guardians (base health stays with the stage), and everything that belongs to a guardian
 const hp0=BOSS.slice(0,N).map(b=>b.hp);perm(BOSS);BOSS.slice(0,N).forEach((b,i)=>{b.hp=hp0[i];b.oi=GORDER.src[i];});
 for(const T2 of [typeof BLOOK!=='undefined'?BLOOK:null,typeof BSTYLE!=='undefined'?BSTYLE:null,typeof BMODES!=='undefined'?BMODES:null,
  typeof BMOTIF!=='undefined'?BMOTIF:null,typeof BMUSIC!=='undefined'?BMUSIC:null,typeof BOSSRELIC!=='undefined'?BOSSRELIC:null,
  typeof TRAILS!=='undefined'?TRAILS:null,typeof BOSS_HPT!=='undefined'?BOSS_HPT:null])perm(T2);
 // the arena seal is the guardian's emblem
 const seals=SCN.slice(0,N).map(s=>s.seal);SCN.slice(0,N).forEach((s,i)=>{s.seal=seals[GORDER.src[i]];});}
// ---- each guardian's own health multiplier in its new stage, measured with the fight bot (docs/chapter2/fight-bot.js)
// against the owner's windows: early stages I-III 45-90s, mid stages IV-VIII 90-120s.
GORDER.TUNE=[.45,.3,.25,.25,.45,.33,1.3,2.1];
for(let i=0;i<GORDER.TUNE.length;i++)BOSS_HPT[i]*=GORDER.TUNE[i];

// ---- the story: each stage keeps its setting and names the guardian now waiting there
Object.assign(SCN[0],{short:'KUSAKARI STALKS THE BAMBOO WHERE THE WARBAND CAMPS',
 tale:'THE MARCH BEGINS. AKAGANE\'S WARBAND HAS CAMPED IN THE BAMBOO, AND THE RED OX HAS SET KUSAKARI, THE REED HUNTER, TO WATCH THE ROAD. NO ONE GETS PAST HIS TRAPS. BREAK HIM AND THE ROAD OPENS.'});
Object.assign(SCN[1],{short:'THE SPIDER CLAN STRINGS ITS WIRES THROUGH THE FLOODED PADDIES',
 tale:'THE RICE MARSH GUARDS THE CASTLE FLANK. ITOHIME OF THE SPIDER CLAN HAS STRUNG HER WIRES THROUGH THE REEDS, AND THE EARTH SPIDER SHE KEEPS SLEEPS BEHIND A LOCKED DOOR.'});
Object.assign(SCN[2],{short:'LADY HOTARU\'S FIREFLIES LIGHT THE SMUGGLERS\' TUNNELS',
 tale:'SMUGGLERS DUG THESE TUNNELS UNDER THE HILLS TO SNEAK RICE PAST THE EMPEROR\'S TAX MEN. LADY HOTARU HUNTS THEM NOW, AND HER FIREFLY LANTERNS ARE THE ONLY LIGHT DOWN HERE. PUT THEM OUT.'});
Object.assign(SCN[3],{short:'THE RONIN SEVEN HOLD THE BURNING TOWN',
 tale:'THE EMPEROR TORCHED THE TOWN AT THE CASTLE\'S FEET TO SLOW YOU DOWN, AND PAID SEVEN MASTERLESS SWORDS TO HOLD ITS ASHES. THEY FIGHT AS ONE.'});
Object.assign(SCN[4],{short:'TETSUO\'S GUNS COVER FROSTPEAK PASS',
 tale:'THE ONLY ROAD TO THE GATES CROSSES FROSTPEAK PASS. TETSUO THE GUNSMITH HAS HAULED HIS CANNONS UP TO ITS WAYSTATION. CROSS THE SNOW BETWEEN HIS VOLLEYS.'});
Object.assign(SCN[5],{short:'A THOUSAND BELLS TOLL FROM THE RAMPARTS',
 tale:'THE OUTER WALLS HAVE NEVER FALLEN. THE ABBOT WHO SOLD THE CASTLE SHRINE NOW RINGS A THOUSAND BELLS FROM THE RAMPARTS TO DROWN OUT HIS CURSES. THE MASONS SAY A MAIDEN WAS WALLED UP IN THE FOUNDATIONS SO THE WALLS WOULD HOLD.'});
Object.assign(SCN[6],{short:'ONIKUMA HAS MADE THE TEMPLE HIS PRISON',
 tale:'THE CASTLE TEMPLE IS A PRISON NOW. ONIKUMA, THE JAILER, CHAINS THE EMPEROR\'S ENEMIES TO ITS PILLARS AND HAS DUG FIRE CHANNELS INTO ITS FLOOR. TAKE HIS KEYS.'});
Object.assign(SCN[7],{short:'AKAGANE, THE RED OX, HOLDS THE IRON CELLARS',
 tale:'BENEATH THE KEEP LIE THE IRON CELLARS. AKAGANE, THE RED OX, THE EMPEROR\'S GENERAL, HAS PULLED HIS WARBAND BACK HERE TO HOLD THE LAST WAY INTO THE CASTLE. HE HAS GROWN STRONGER SINCE YOU FIRST HEARD HIS NAME. BREAK HIM.'});
DUN.slice(0,8).forEach((d,i)=>{const s=SCN[i];d.story=s.short;d.tale=s.tale;d.scn=s;});
MASTER_LINES[0]='THE REED HUNTER HAS FALLEN. THE MARSHES GUARD THE CASTLE FLANK - KEEP LOW AND KEEP MOVING.';
MASTER_LINES[5]='THE WALLS ARE BREACHED AND THE BELLS ARE SILENT. BEYOND THEM THE TEMPLE HAS BECOME A PRISON.';
MASTER_LINES[6]='THE JAILER\'S KEYS ARE OURS. BENEATH THE KEEP LIE THE IRON CELLARS, AND AKAGANE\'S WARBAND WAITS IN THEM.';
MASTER_LINES[7]='THE RED OX IS BROKEN. YOU WALK INSIDE THE CASTLE NOW. THE KEEP HALLS ARE FULL OF HIS GUARD.';
if(typeof PRO3!=='undefined')PRO3.master='THE TOWER IS DOWN AND THE ROAD IS OPEN. AHEAD, AKAGANE\'S WARBAND HAS CAMPED IN THE BAMBOO, AND HIS REED HUNTER WATCHES THE ROAD. THIS IS WHERE THE MARCH ON THE CASTLE TRULY BEGINS.';
// the Earth Spider's lair follows the spider clan to stage II
{const L=LAIRS.find(l=>l.art==='TSUCHIGUMO, EARTH SPIDER');if(L)L.stage=GORDER.newOf[L.stage];}

// ---- each guardian keeps its own boss music (the riffs and the piano theme were seeded by stage number)
{const _m=mkBossSong;mkBossSong=function(di){const b=BOSS[di];return _m.call(this,b&&b.oi!=null&&!(R&&R.pro)?b.oi:di);};}
{const _p=pSong;pSong=function(seed,scale,root,bpm){const b=R&&BOSS[R.di];if(b&&b.oi!=null&&!R.pro&&seed===R.di*31+5){seed=b.oi*31+5;scale=['hira','in','min','kumoi'][b.oi%4];}return _p.call(this,seed,scale,root,bpm);};}

// ---- Onikuma's fire channels: a lava tile in a stage whose own liquid is water still burns, and is now drawn molten
GORDER.lava=(ENV[7]&&ENV[7].liq===2&&ENV[7].lc)||['#7a1a08','#c83a10','#ffb040'];
{const _d=drawLiquidTile;drawLiquidTile=function(g,X,Y,x0,y0,lq){if(lq!==2||!map||!map.env||map.env.liq===2)return _d.apply(this,arguments);
 const lc=map.env.lc;map.env.lc=GORDER.lava;try{return _d.apply(this,arguments);}finally{map.env.lc=lc;}};}

// ---- the prologue borrows stage I's slot: winning it must not mark stage I's guardian beaten or award its trail
{const _ob=onBossDead;onBossDead=function(e){if(!(R&&R.pro))return _ob.apply(this,arguments);
 const g=meta.guide&&meta.guide.e,k0=g&&g.boss0,r0=meta.ranks&&meta.ranks[0],c0=meta.cos&&meta.cos[0];
 const res=_ob.apply(this,arguments);
 if(g){if(k0===undefined)delete g.boss0;else g.boss0=k0;}if(meta.ranks){if(r0===undefined)delete meta.ranks[0];else meta.ranks[0]=r0;}if(meta.cos){if(c0===undefined)delete meta.cos[0];else meta.cos[0]=c0;}
 saveMeta();return res;};}

// ---- saved progress: records kept by stage number follow their guardian to its new stage (once)
function gorderMigrate(){if(!meta||meta.gOrder>=1)return;const nw=GORDER.newOf,N=GORDER.src.length;
 const remap=obj=>{if(!obj)return obj;const out={};for(const k in obj){const i=+k;out[(Number.isInteger(i)&&i>=0&&i<N)?nw[i]:k]=obj[k];}return out;};
 if(meta.guide&&meta.guide.e){const e=meta.guide.e,moved={};for(let i=0;i<N;i++)if(('boss'+i) in e){moved['boss'+nw[i]]=e['boss'+i];delete e['boss'+i];}Object.assign(e,moved);}
 if(meta.ranks)meta.ranks=remap(meta.ranks);if(meta.cos)meta.cos=remap(meta.cos);
 if(meta.opt&&Number.isInteger(meta.opt.trail)&&meta.opt.trail>=0&&meta.opt.trail<N)meta.opt.trail=nw[meta.opt.trail];
 if(meta.guardianClears){const gc={};for(const k in meta.guardianClears){const m=/^(\d+):(.*)$/.exec(k);const i=m?+m[1]:-1;gc[(m&&i<N)?nw[i]+':'+m[2]:k]=meta.guardianClears[k];}meta.guardianClears=gc;}
 meta.gOrder=1;try{saveMeta();}catch(_){}}
try{gorderMigrate();}catch(err){console.warn('guardian order migration',err);}

// ---- sheets and portraits cached by stage number are rebuilt for the new order
try{if(typeof BOSSSPR!=='undefined')BOSSSPR.fill(null);for(const C of [typeof HURTSPR!=='undefined'?HURTSPR:null,typeof BSHEETC!=='undefined'?BSHEETC:null,typeof GPORT!=='undefined'?GPORT:null,typeof GECHO!=='undefined'?GECHO.mini:null])if(C)for(const k in C)delete C[k];}catch(_){}
