'use strict';
// SHINOBIDUNGEONS - bags. There used to be twelve kinds of bag (sacks, packs, satchels, pouches, the royal bag and
// seven themed ones), and a bag's look said which loot table it came from, not what was inside. Now:
//  ONE LOOK PER RARITY  a bag looks like the best thing inside it: COMMON sack, UNCOMMON pack, RARE satchel, EPIC
//                       pouch, LEGENDARY royal bag. Take the best item out and the bag changes to match what is left.
//  ONE BAG PER FOE      no foe drops more than one bag, whatever promised it (a curse, a hunted elite, its loot table)
//  RANDOM, NOT LAST     rooms no longer hand a bag to whoever dies last. Every minion has its own small chance to drop
//                       one (heavier foes more, elites most), and foes in ambush and challenge rooms carry better odds.
//                       Bosses and mini-bosses keep their trophy bags.
const BAGNAMES=['COMMON BAG','UNCOMMON BAG','RARE BAG','EPIC BAG','LEGENDARY BAG'];
// the rarity of one item, 0 common .. 4 legendary
function itemRarity(it){if(!it)return 0;
 if(it.t==='gear')return it.rare?4:Math.max(0,Math.min(4,it.q|0));
 if(it.t==='relic'){const r=ITEMBY[it.id];return r?(prologueLoot()&&r.r<2?r.r:Math.min(4,(r.r|0)+1)):1;}
 if(it.t==='scroll')return it.regular?2:4;
 if(it.t==='ench')return 2;
 return 0;}
const bagLook=items=>items&&items.length?Math.max(...items.map(itemRarity)):0;
// the five looks reuse the first five bag sprites and colours; the names and guide entries follow suit
BAGN.length=5;BAGN.splice(0,5,...BAGNAMES);BAGCOL.length=5;
if(typeof BAGDESC!=='undefined'){BAGDESC.length=0;BAGDESC.push('THE BEST THING INSIDE IS COMMON','THE BEST THING INSIDE IS UNCOMMON','HOLDS SOMETHING RARE: GEAR, AN ENCHANT OR A SCROLL','HOLDS SOMETHING EPIC','HOLDS A LEGENDARY');}
// drop a bag: the old loot tables still decide what goes in; the bag then shows the best of it
dropBag=function(x,y,tier,boss){const items=bagContents(tier,boss);if(!items.length)return;const look=bagLook(items),a=Math.random()*TAU,s=rnd(15,35);
 pickups.push({x,y,k:'bag',tier:look,items,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,z:2,vz:[80,90,100,115,150][look]});
 if(look===4){sfx('rare');spark(x,y,'#fff6c0',30,120);spark(x,y,'#fff',12,80);fxRing(x,y,30,'#fff6c0',.5);setToast('* A LEGENDARY BAG *','#fff6c0',3);}
 else if(look===3){fxRing(x,y,18,BAGCOL[3],.35);}};
// every bag, however it was made (shops, tutorials, monk's bundles...), looks like what it holds right now
{const _up=updPickups;updPickups=function(){for(const k of pickups)if(k.k==='bag'&&k.items&&k.items.length)k.tier=bagLook(k.items);return _up.apply(this,arguments);};}
// the loot tables: every minion can carry a bag now, never more than one
Object.assign(LOOT,{basic:{gold:0,pot:.04,bags:[[2,.012],[1,.025],[0,.05]]},heavy:{gold:2,pot:.08,bags:[[2,.05],[1,.1],[0,.14]]},elite:{gold:4,pot:.4,bags:[['good',.7],[2,.3]]}});
const roomOdds=e=>{const ev=e&&e.room&&e.room.ev;return ev&&(ev.k==='ambush'||ev.k==='challenge')?2.5:1;};
{const _k=killE;killE=function(e){
 // the original handles everything else; it may want to drop several bags, which this turns into just one
 if(!e||e.dead||e.boss||e.mini)return _k.apply(this,arguments);
 const wants=[],_db=dropBag;
 dropBag=function(x,y,tier,boss){wants.push([x,y,tier,boss]);};
 // better odds in ambush and challenge rooms: roll the table again (still at most one bag)
 try{_k.apply(this,arguments);}finally{dropBag=_db;}
 if(!wants.length&&roomOdds(e)>1&&!R.training){const LT=LOOT[lootKind(e)];for(const [tier,ch] of LT.bags)if(Math.random()<ch*(roomOdds(e)-1)){wants.push([e.x,e.y,tier==='good'?(R.di>=1?goodBag():2):tier]);break;}}
 if(wants.length){wants.sort((a,b)=>(b[2]==='good'?9:b[2])-(a[2]==='good'?9:a[2]));const w=wants[0];dropBag(w[0],w[1],w[2],w[3]);}};}
