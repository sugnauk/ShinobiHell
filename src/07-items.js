'use strict';
// HELL OF THE EMPEROR - items, abilities, meta progression (part of the former game.js; files load in numeric order, see index.html)
// ---------- items & tools ----------
const COOLDOWN={charm:.05,focusRank:.02,wisdom:.005,frenzy:.08,stillWater:.04,
 rank:.01,maxRank:12,empowered:.15,scroll:.20,tempo:.06,timeWeaver:.10,gearFocus:.05,bells:.05,
 minSpell:.75,minDash:.55,shadow:.08,dashRank:.04,ghostStep:.08,wraith:.10,
 graze:.04,grazeNode:.01,grazeInterval:.35,dodge:.10,dodgeDash:.08,kill:.6,soulEater:.5,echoChance:.15,echoRefund:.10};
const cdPct=f=>Math.round(f*10000)/100+'%';
const ITEMS=[
 {id:'atk',name:'SPIRIT POWER',d:'+3 SPELL POWER',g:'A',r:0},{id:'aspd',name:'QUICK HANDS',d:'+12% CAST SPEED',g:'S',r:0},
 {id:'range',name:'FAR SIGHT',d:'+BOLT RANGE',g:'L',r:0},{id:'hp',name:'VITALITY BEAD',d:'+20 MAX HP',g:'V',r:0},
 {id:'pos',name:'STEADY BEAD',d:'+15 STUN RESIST',g:'P',r:0},{id:'spd',name:'LIGHT FOOT',d:'+8% MOVE SPEED',g:'F',r:0},
 {id:'parry',name:'WARD SEAL',d:'+WARD DURATION',g:'D',r:1},{id:'crit',name:'CRITICAL EYE',d:'+8% CRIT',g:'C',r:0},
 {id:'blood',name:'BLOOD MIST',d:'HEAL 3 ON KILL',g:'B',r:1},{id:'fire',name:'FIRE OIL',d:'EVERY ATTACK MAY BURN (LMB TOO)',g:'O',r:1},
 {id:'poison',name:'POISON MIST',d:'EVERY ATTACK POISONS (LMB TOO)',g:'X',r:1},{id:'shadow',name:'SHADOW STEP',d:'FASTER DASH',g:'H',r:1},
 {id:'emb',name:'FOCUS CHARM',d:'-'+cdPct(COOLDOWN.charm)+' COOLDOWNS',g:'E',r:0},{id:'thorn',name:'REPRISAL',d:'WARD SHOCKWAVE',g:'R',r:2},
 {id:'wave',name:'TWIN TALISMAN',d:'+1 SIDE BOLT',g:'W',r:2},{id:'gourd',name:'POTION SATCHEL',d:'+1 HP POTION NOW',g:'G',r:1},
 {id:'rez',name:'RESURRECTION',d:'+1 REVIVE',g:'Z',r:2},{id:'magnet',name:'GOLD MAGNET',d:'+GOLD +PICKUP',g:'M',r:1},
 {id:'hunger',name:'DEATHBLOW HUNGER',d:'DEATHBLOW HEALS',g:'U',r:2},{id:'mikiri',name:'PHASE STRIKE',d:'DASH->NEXT BOLT +60%',g:'K',r:2},
 {id:'iron',name:'IRON BODY',d:'-8% DAMAGE TAKEN',g:'I',r:1},{id:'ghost',name:'PHANTOM',d:'6% DODGE',g:'N',r:1},
];
const RCOL=['#9ab','#6c6','#c6f'],ITEMBY={};ITEMS.forEach(i=>ITEMBY[i.id]=i);
const prologueLoot=()=>typeof PRO_ON!=='undefined'&&PRO_ON;
const RELIC_STACK_POWER=[0,1,1.5,1.75];
const SINGLE_RELICS=new Set(['wave','pierce','dblow','flare','poison','gourd','rez','phoenix']);
function relicLimit(id){
 const it=ITEMBY[id];
 return it?.bossRelic||it?.pwRelic||SINGLE_RELICS.has(id)?1:RELIC_STACK_POWER.length-1;
}
function relicPower(id,count=R?.inv?.[id]||0){return RELIC_STACK_POWER[Math.min(relicLimit(id),Math.max(0,count|0))];}
const relicMaxed=id=>(R?.inv?.[id]||0)>=relicLimit(id);
const relicSurplusGold=id=>10+5*ITEMBY[id].r;
function relicPool(minR,maxR){
 const cap=prologueLoot()?Math.min(1,maxR):maxR,minimum=Math.min(minR,cap);
 return ITEMS.filter(it=>!it.bossRelic&&it.r>=minimum&&it.r<=cap);
}
const relicTradeAvailable=(minR,maxR,excl)=>relicPool(minR,maxR).some(it=>!excl.includes(it.id)&&!relicMaxed(it.id));
function randItem(excl,minR=0,maxR=3){
 const weights=[14,7,3,2];
 // Registration marks boss rewards even when their road is absent from the active stage table.
 const allowed=relicPool(minR,maxR);
 const available=allowed.filter(it=>!excl?.includes(it.id));
 const candidates=available.length?available:allowed;
 const useful=candidates.filter(it=>!relicMaxed(it.id));
 return wpick((useful.length?useful:candidates).map(it=>({it,wt:weights[it.r]}))).it;
}
const RELIC_CHEST_CHANCE=.25;
const relicTradeDepth=()=>R.pro?'prologue-'+R.pro:R.di;

// ---------- mage abilities ----------
const ULT_CD=32,WARD_CD=7,CHAIN_CD=4.5;

// ---------- meta progression ----------
const UPG=[{k:'vit',name:'VITALITY',d:'+12 MAX HP',base:30,max:10},{k:'atk',name:'MIGHT',d:'+2 SPELL POWER',base:40,max:10},{k:'pos',name:'RESOLVE',d:'+10 STUN RESIST',base:30,max:10},{k:'emb',name:'FOCUS',d:'-'+cdPct(COOLDOWN.focusRank)+' COOLDOWNS',base:35,max:8},{k:'sen',name:'GREED',d:'+10% GOLD',base:50,max:8},{k:'res',name:'SECOND WIND',d:'+1 RESURRECTION',base:300,max:2}];
function loadMeta(){let m=null;try{m=JSON.parse(localStorage.getItem('shinobiDungeons1'));}catch(e){}if(!m||!m.up)m={sen:0,reached:0,runs:0,wins:0,up:{vit:0,atk:0,pos:0,emb:0,sen:0,res:0}};if(!m.loadout)m.loadout={};for(const k of 'mhqwfe')if(m.loadout[k]==null)m.loadout[k]=0;if(!m.stats)m.stats={att:0,def:0,spd:0,dex:0,vit:0,wis:0};if(!m.codex)m.codex={sp:{},gear:{}};if(m.asc==null){m.asc=0;m.ascMax=0;}
 // characters: 2 to start, one more after each finished run (older saves get credit for runs already played)
 if(m.unlocked==null)m.unlocked=Math.min(5,2+(m.runs||0));if((m.cls||0)>=m.unlocked)m.cls=0;return m;}
let meta=loadMeta();function saveMeta(){try{localStorage.setItem('shinobiDungeons1',JSON.stringify(meta));}catch(e){}}
