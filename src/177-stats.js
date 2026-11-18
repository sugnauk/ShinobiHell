'use strict';
// SHINOBIDUNGEONS - the six stats (ATTACK, DEFENSE, SPEED, DEXTERITY, VITALITY, WISDOM) no longer come from stat potions.
// The old elixirs were permanent and saved forever, so a long-played save quietly grew stronger run after run. Now:
//  HERO      every hero has base stats: the knob for balancing heroes against each other (HERO_ST below)
//  RELICS    every relic also grants a few points of the stat that fits it (more for rarer relics)
//  ENCHANTS  every enchant stack grants 2 points of its stat
//  RINGS     rings keep the stats they already rolled
// Bags that used to hold an elixir hold a relic or an enchant instead. Points from old elixirs are refunded as jade.
const HERO_ST={wizard:{att:3,wis:3},archer:{dex:3,spd:3},samurai:{def:3,vit:3},shinobi:{spd:3,dex:2,att:1},
 onmyoji:{wis:3,vit:3},gunner:{att:4,def:2},lancer:{att:2,def:2,vit:2}};
// relic stat: chosen by id where it reads naturally, else by the relic's effect style; amount by rarity
const RELIC_ST_ID={atk:'att',crit:'att',pierce:'att',range:'dex',aspd:'dex',mikiri:'dex',wave:'dex',echo:'dex',emb:'wis',ecd:'wis',cd:'wis',
 qpow:'wis',epow:'wis',parry:'def',iron:'def',pos:'def',thorn:'def',ghost:'spd',spd:'spd',shadow:'spd',magnet:'spd',hp:'vit',gourd:'vit',rez:'vit'};
const RELIC_ST_STYLE={dmg:'att',fire:'att',frost:'wis',storm:'dex',poison:'att',heal:'vit',speed:'spd',guard:'def',control:'wis',wealth:'spd'};
const RELIC_ST_AMT=[2,2,3,4];
const ENCH_ST={fire:'att',frost:'wis',shock:'dex',poison:'att',blast:'att',leech:'vit',gale:'spd'},ENCH_ST_AMT=2;
function relicSt(id){const it=ITEMBY[id];if(!it)return null;return {k:RELIC_ST_ID[id]||RELIC_ST_STYLE[fxStyle(id)]||'att',n:RELIC_ST_AMT[Math.min(3,it.r|0)]};}
const STSHORT=k=>STATS.find(s=>s.k===k).n.slice(0,3);
// write the bonus into every relic's and enchant's description, so it shows wherever they do
for(const it of ITEMS){const b=relicSt(it.id);if(b&&!it.stD){it.stD=1;it.d=it.d+'. +'+b.n+' '+STSHORT(b.k);}}
for(const e of ENCH){const k=ENCH_ST[e.k];if(k&&!e.stD){e.stD=1;e.d=e.d+'. +'+ENCH_ST_AMT+' '+STSHORT(k);}}
function heroBaseSt(){const c=typeof CLS==='function'&&meta?CLS():null;return Object.assign({att:0,def:0,spd:0,dex:0,vit:0,wis:0},c&&HERO_ST[c.k]||{});}
function heroRunStats(){const s=heroBaseSt();if(!R)return s;
 for(const id in (R.inv||{})){const b=relicSt(id);if(b)s[b.k]+=b.n*(R.inv[id]|0);}
 for(const k of (R.ench||[])){const st=ENCH_ST[k];if(st)s[st]+=ENCH_ST_AMT;}return s;}
// a bag that would have held an elixir holds a relic (60%) or an enchant
function statSwap(){return Math.random()<.6?{t:'relic',id:randItem(['rez']).id}:mkEnch();}
// old saves: elixir points become jade, once
const ELIXIR_JADE=25;
{const ms=meta.stats||{};let pts=0;for(const k in ms)pts+=ms[k]|0;
 if(pts>0&&!meta.elixirRefund){meta.sen=(meta.sen||0)+pts*ELIXIR_JADE;meta.elixirRefund=pts;meta.elixirNote=1;for(const k in ms)ms[k]=0;saveMeta();}}
{const _sr=startRun;startRun=function(){const r=_sr.apply(this,arguments);if(meta.elixirNote){meta.elixirNote=0;saveMeta();
 setToast('STAT POTIONS ARE GONE: YOUR '+meta.elixirRefund+' POINTS BECAME '+meta.elixirRefund*ELIXIR_JADE+' JADE','#5fd08a',5);}return r;};}
