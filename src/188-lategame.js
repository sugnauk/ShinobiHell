'use strict';
// SHINOBIDUNGEONS - the late game: the march does not end at the throne.
// The campaign is the twelve stages; beating the Emperor wins it (a run that has beaten him always ends as a victory).
// His portal then leads on, if you choose, into new stages built on the advanced bullet-hell library:
//   TIER 1-2  stages I-XII     the campaign, unchanged
//   TIER 3    stage XIII       advanced late game (its own stage, foes and guardian)
//   TIER 4    stage XIV        endgame (its own stage, foes and guardian)
//   TIER 5+   THE ABYSS        endless depths beyond: each depth remixes the late stages with a deeper director tier
//                              and new guardian modifiers, so the patterns grow more intricate, not the numbers
// At any late portal: G goes deeper, L leaves in triumph. Depth is recorded on the victory screen and in the trials.
// Late stages are added into every per-stage table (stage, scenery, guardian, art, music, furnishings, floor art,
// mood, trails, relics, campfire words...) through lateAdd(); a table a stage does not define copies its base stage.
const CAMPAIGN_END=DUN.length-1;          // the throne room
const LATE=[];                             // the late stages, in order (XIII, XIV...)
const lateTier=di=>di<=CAMPAIGN_END?0:di===CAMPAIGN_END+1?3:di===CAMPAIGN_END+2?4:5+Math.floor((di-CAMPAIGN_END-3)/2);
const lateDepth=di=>di-CAMPAIGN_END;       // XIII = depth 1
const romanOf=n=>{const V=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const [v,r] of V)while(n>=v){s+=r;n-=v;}return s;};
// every per-stage table: [name, getter]. A late stage writes its own value or copies its base stage's.
const LTABLES=()=>[['DUN',DUN],['ENV',ENV],['BOSS',BOSS],['BLOOK',BLOOK],['BSTYLE',BSTYLE],['BMODES',BMODES],['BMOTIF',typeof BMOTIF!=='undefined'?BMOTIF:null],['ROMAN',ROMAN],
 ['STAGEDECO',typeof STAGEDECO!=='undefined'?STAGEDECO:null],['DECO_GROUPS',typeof DECO_GROUPS!=='undefined'?DECO_GROUPS:null],['FLOORART',typeof FLOORART!=='undefined'?FLOORART:null],
 ['MOOD',typeof MOOD!=='undefined'?MOOD:null],['PSTAGE',typeof PSTAGE!=='undefined'?PSTAGE:null],['BMUSIC',typeof BMUSIC!=='undefined'?BMUSIC:null],['TRAILS',typeof TRAILS!=='undefined'?TRAILS:null],
 ['MASTER_LINES',typeof MASTER_LINES!=='undefined'?MASTER_LINES:null],['BOSS_HPT',typeof BOSS_HPT!=='undefined'?BOSS_HPT:null],['BOSSRELIC',typeof BOSSRELIC!=='undefined'?BOSSRELIC:null],
 ['PMAP',typeof PMAP!=='undefined'?PMAP:null],['SCN',typeof SCN!=='undefined'?SCN:null],['POOLADD',typeof POOLADD!=='undefined'?POOLADD:null]];
function lateInstall(def,i){const base=def.base;
 for(const [k,a] of LTABLES()){if(!a)continue;const own=def.t&&def.t[k];let v=own!==undefined?own:a[base];
  if(v&&typeof v==='object'&&!Array.isArray(v)&&typeof v!=='function'&&own===undefined)v=Object.assign({},v);
  a[i]=v;}
 if(typeof BOSSSPR!=='undefined')BOSSSPR[i]=null;
 if(typeof STAGE_SCATTER!=='undefined'&&def.scatter)STAGE_SCATTER[i]=def.scatter;
 if(typeof INDOOR!=='undefined'&&def.indoor)INDOOR.add(i);
 // the stage's story text where the scenery and chronicle read it
 const d=DUN[i];d.story=def.story;d.tale=def.tale;const bs=(DUN[base]&&DUN[base].scn)||(typeof SCN!=='undefined'&&SCN[base])||{};d.scn=Object.assign({},bs,def.scn||{},{short:def.story,tale:def.tale});d.late=lateTier(i);
 // its guardian's relic joins the item pool like the others
 const rel=def.t&&def.t.BOSSRELIC;if(rel&&!ITEMBY[rel.id]){ITEMS.push({id:rel.id,name:rel.name,d:rel.d,g:rel.g,r:3,bossRelic:1});ITEMBY[rel.id]=ITEMS[ITEMS.length-1];FXK[rel.id]=rel.fx||'control';if(typeof RELICMO!=='undefined')RELICMO[rel.id]=rel.mo;}}
// register a late stage (in order); it is installed right away at the next free index
function lateAdd(def){LATE.push(def);const i=CAMPAIGN_END+LATE.length;lateInstall(def,i);return i;}
// the endless depths: an abyss depth remixes a late stage (alternating) with its guardian transformed by modifiers
const ABYSS_MODS=[
 {k:'swift',n:'SWIFT',d:'ITS PATTERNS COME FASTER'},
 {k:'echo',n:'ECHOING',d:'EVERY PATTERN ECHOES, MIRRORED, A MOMENT LATER'},
 {k:'shroud',n:'SHROUDED',d:'THE ARENA PERIODICALLY CLOSES IN'},
 {k:'twin',n:'TWINNED',d:'A SHADE OF THE GUARDIAN CASTS A SECOND LAYER'},
 {k:'relentless',n:'RELENTLESS',d:'SHORTER PAUSES BETWEEN ATTACKS'},
 {k:'warded',n:'STAR-WARDED',d:'ORBITING WARDS SHIELD IT UNTIL STRUCK DOWN'}];
function abyssMods(di){const d=lateDepth(di)-LATE.length;if(d<1)return [];const n=Math.min(3,1+Math.floor((d-1)/2)),out=[];let s=(Math.imul(di+1,2654435761)^0x5bd1e995)>>>0;const rnd2=()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};rnd2();rnd2();
 const pool=ABYSS_MODS.slice();for(let i=0;i<n&&pool.length;i++)out.push(pool.splice(Math.floor(rnd2()*pool.length),1)[0]);return out;}
function lateEnsure(di){if(!LATE.length)return;while(DUN.length<=di+1){const i=DUN.length,d=lateDepth(i)-LATE.length,src=LATE[(d-1)%LATE.length];
  const def=Object.assign({},src,{t:Object.assign({},src.t),story:'THE ABYSS, DEPTH '+romanOf(lateDepth(i))+' - '+src.abyss,tale:src.tale});
  def.t.ROMAN=romanOf(i+1);def.t.DUN=Object.assign({},src.t.DUN,{name:'THE ABYSS - '+src.t.DUN.name.replace(/^THE /,'')});
  // the guardian is the same person, transformed: its name carries the depth, and its modifiers are set on spawn
  def.t.BOSS=Object.assign({},src.t.BOSS,{hp:Math.round(src.t.BOSS.hp*(1+.12*d))});
  def.t.BOSSRELIC=null;def.t.TRAILS=src.t.TRAILS;
  lateInstall(def,i);DUN[i].abyss=d;}}
{const _ld=loadDungeon;loadDungeon=function(di){if(di>CAMPAIGN_END)lateEnsure(di);return _ld.apply(this,arguments);};}
// a late guardian carries its tier and, in the abyss, its modifiers
{const _mb=mkBoss;mkBoss=function(di){const e=_mb.apply(this,arguments);if(e&&di>CAMPAIGN_END){e.lateTier=lateTier(di);e.mods=abyssMods(di).map(m=>m.k);
  // depth adds a little damage, not a wall of numbers: the patterns do the work
  e.dm=e.dm0=1+.14*CAMPAIGN_END+.06*(di-CAMPAIGN_END);}return e;};}
// late foes: health and damage grow only gently past the throne room (the tiered patterns are the challenge)
{const _mk=mkEnemy;mkEnemy=function(type,x,y,room,di){if(di>CAMPAIGN_END){const e=_mk.call(this,type,x,y,room,CAMPAIGN_END);if(e){const k=di-CAMPAIGN_END,f=1+.08*k;e.hp*=f;e.maxhp*=f;e.dm*=1+.04*k;e.lateTier=lateTier(di);}return e;}return _mk.apply(this,arguments);};}
// ---------------- the campaign is won at the throne; the run goes on if you want it to ----------------
{const _ob=onBossDead;onBossDead=function(e){const r=_ob.apply(this,arguments);if(R&&e&&e.di===CAMPAIGN_END&&!R.rush&&!R.training){R.campaignWon=1;setToast('THE EMPEROR IS DEAD - THE CAMPAIGN IS WON','#ffd040',4);}
 if(R&&e&&e.di>CAMPAIGN_END&&!R.rush&&!R.training){R.lateBest=Math.max(R.lateBest||0,lateDepth(e.di));meta.lateBest=Math.max(meta.lateBest||0,lateDepth(e.di));saveMeta();if(typeof trialsCheck==="function")trialsCheck();}return r;};}
// the throne room's portal (and every late portal): G goes deeper, L leaves in triumph
{const _in=interact;interact=function(){if(R&&!R.training&&!R.rush&&portal&&!portal.pending&&dist(portal,P)<20&&R.di>=CAMPAIGN_END&&R.campaignWon){openMaster();return;}return _in.apply(this,arguments);};}
{const _ok=onKey;onKey=function(c){if(c==='KeyL'&&mode==='play'&&R&&R.campaignWon&&portal&&!portal.pending&&dist(portal,P)<20&&!paused){finishRun(true);return;}return _ok.apply(this,arguments);};}
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);if(mode!=='play'||!R||!R.campaignWon||!portal||portal.pending||dist(portal,P)>=20)return;
 const s='G: DESCEND DEEPER    L: LEAVE IN TRIUMPH';ctx.fillStyle='rgba(8,6,12,.85)';ctx.fillRect(Math.round(W/2-txtW(s)/2)-4,H-62,txtW(s)+8,11);txt(s,Math.round(W/2-txtW(s)/2),H-60,'#ffd040');};}
// the campfire's journey bar stays readable however deep you go
{const _mj=masterJourney;masterJourney=function(acc){if(DUN.length<=CAMPAIGN_END+3)return _mj.apply(this,arguments);const keep=DUN.length;const n=Math.max(CAMPAIGN_END+1,(CS.next|0)+2);
 const saved=DUN.splice(n);try{return _mj.apply(this,arguments);}finally{DUN.push(...saved);}};}
// depth on the victory screen
{const _rw=typeof renderVictory==='function'?renderVictory:null;if(_rw)renderVictory=function(){_rw.apply(this,arguments);if(deadInfo&&deadInfo.depth){const s='DEPTH BEYOND THE THRONE: '+romanOf(deadInfo.depth)+(deadInfo.fell?' (FELL THERE)':'');txt(s,Math.round(W/2-txtW(s)/2),H-30,'#c8a0ff');}};}
// a run that has beaten the Emperor always ends as a victory; how deep it got is recorded
{const _fr=finishRun;finishRun=function(win){const d=R&&R.di>CAMPAIGN_END?lateDepth(R.di):0,fell=!!(R&&R.campaignWon&&!win);if(R&&R.campaignWon)win=true;const r=_fr.call(this,win);if(deadInfo&&d){deadInfo.depth=d;deadInfo.fell=fell;}return r;};}
// the late trials: feats beyond the throne, paid in jade like the others
if(typeof TRIALS!=='undefined'){TRIALS.push(
 {k:'late1',n:'ABOVE THE THRONE',d:'BEAT HOSHIYOMI, THE STAR READER (STAGE XIII)',j:400,ok:()=>(meta.lateBest||0)>=1},
 {k:'late2',n:'THE MIRROR BROKEN',d:'BEAT GETSUREI, THE ECLIPSE PRIESTESS (STAGE XIV)',j:600,ok:()=>(meta.lateBest||0)>=2},
 {k:'abyss5',n:'THE ABYSS GAZES BACK',d:'BEAT THE GUARDIAN OF ABYSS DEPTH V',j:800,ok:()=>(meta.lateBest||0)>=5},
 {k:'abyss10',n:'BOTTOMLESS',d:'BEAT THE GUARDIAN OF ABYSS DEPTH X',j:1200,ok:()=>(meta.lateBest||0)>=10},
 {k:'latenh',n:'DANCER IN THE DARK',d:'BEAT A GUARDIAN BEYOND THE THRONE WITHOUT BEING HIT',j:700,ok:()=>((meta.life&&meta.life.lateNohit)||0)>=1});
 {const _ob=onBossDead;onBossDead=function(e){if(R&&e&&e.di>CAMPAIGN_END&&!R.training&&!R.test&&!(e.hitsT>0)&&meta.life)meta.life.lateNohit=(meta.life.lateNohit||0)+1;return _ob.apply(this,arguments);};}}
// an abyss guardian's modifiers are announced when it wakes
{const _u=updPlay;updPlay=function(dt){const r=_u.apply(this,arguments);const e=boss;if(e&&!e.dead&&e.awake&&e.mods&&e.mods.length&&!e.modsShown){e.modsShown=1;
 const M=ABYSS_MODS.filter(m=>e.mods.includes(m.k));setToast(M.map(m=>m.n).join(' - ')+': '+M.map(m=>m.d).join('; '),'#c8a0ff',5);}return r;};}
// the guide lists each late guardian and stage once: abyss depths are the same people, transformed
{const _ge=guideEntries;guideEntries=function(tab){const L=_ge(tab);if((GTABS[tab]==='BOSSES'||GTABS[tab]==='CHRONICLE')&&L.length>CAMPAIGN_END+1+LATE.length)return L.slice(0,CAMPAIGN_END+1+LATE.length);return L;};}
