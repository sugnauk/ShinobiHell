'use strict';
// HELL OF THE EMPEROR - purposeful dressing. Nature (bamboo, grass, rocks, reeds...) is still scattered freely, but
// man-made props (tents, fires, lamps, banners, racks, shrines...) only appear as small scenes that make sense together:
// a tent with its campfire, a spear rack and a banner; a wayside jizo with its lantern and incense. At most one scene
// per room, set back towards the edge, and plenty of rooms get none.

// what may still be scattered on its own, per stage (everything else in STAGEDECO is a set piece)
const DECO_SCATTER=new Set(['bamboo','tallgrass','bush','rock','reeds','deadtree','crystal','stalag','mushroom','web','rubble','charred','pine','iceshard','maple','sakura','bonsai','bones','lily','spikes']);
// the scenes for each stage: [kind, dx, dy, flip] in world pixels around an anchor
const DECO_GROUPS=[
 [[['tent',0,0],['campfire',4,24],['spearrack',-24,8],['banner',22,-4]],                                   // I   a war-camp tent
  [['campfire',0,0],['rock',-12,-6],['rock',12,6],['spearrack',-20,14]],                                     //     a cook-fire
  [['banner',-18,0],['banner',18,0,1],['spearrack',0,-10]]],                                                 //     a weapons post
 [[['scarecrow',0,0],['ricebale',-16,10],['ricebale',14,12]],[['jizo',0,0],['lantern',-14,4],['lantern',14,4,1]],[['ricebale',0,0],['ricebale',10,6],['ricebale',-8,8]]],
 [[['crates',0,0],['barrel',16,4],['crate',-14,8]],[['barrel',0,0],['barrel',10,4],['crates',-14,-2]]],
 [[['burnhouse',0,0],['rubble',-20,14],['charred',22,10]],[['brazier',0,0],['plantern',-16,8],['plantern',16,8,1]],[['vent',0,0],['rubble',12,8]]],
 [[['signpost',0,0],['lantern',-14,6],['rock',14,6]],[['campfire',0,0],['rock',-12,-4],['rock',12,4],['pine',-20,-18]],[['torii',0,0],['lantern',-20,10],['lantern',20,10,1]]],
 [[['barricade',-14,0],['barricade',14,0,1],['cannon',0,16]],[['tent',0,0],['torch',-18,10],['torch',18,10],['banner',0,-16]],[['arrows',0,0],['crate',14,6],['arrows',-12,8]]],
 [[['jizo',0,0],['incense',-12,10],['candles',12,10]],[['bell',0,0],['lantern',-18,8],['lantern',18,8,1]],[['pagoda',0,0],['lantern',-20,12],['maple',22,-6]]],
 [[['cage',0,0],['chains',16,4],['bones',-12,10]],[['torch',-18,0],['torch',18,0],['pillar',0,-8]],[['barrel',0,0],['barrel',12,4],['chains',-14,6]]],
 [[['byobu',0,0],['vase',-16,10],['vase',16,10,1]],[['armour',0,0],['taru',-14,8],['plantern',14,8]],[['taiko',0,0],['plantern',-16,6],['plantern',16,6,1]]],
 [[['komainu',-18,0],['komainu',18,0,1],['lantern',0,-12]],[['jizo',0,0],['sakura',-18,-10],['lantern',16,6]],[['bonsai',-10,0],['bonsai',10,0,1]]],
 [[['jadestatue',0,0],['goldbrazier',-18,10],['goldbrazier',18,10,1]],[['urn',-12,0],['urn',12,0,1],['bonsai',0,-12]],[['komainu',-16,0],['komainu',16,0,1]]],
 [[['goldbrazier',-18,0],['goldbrazier',18,0,1],['banner',0,-14]],[['armour',0,0],['candles',-14,10],['candles',14,10]],[['banner',-14,0],['banner',14,0,1]]]];

{const _gd=genDecos;genDecos=function(di){
 const L=STAGEDECO[di];if(!L||!map||map.train)return _gd.apply(this,arguments);
 // 1) the normal pass, but with only the natural pieces
 const nat=L.filter(([k])=>DECO_SCATTER.has(k));STAGEDECO[di]=nat.length?nat:[['tallgrass',1]];
 let out;try{out=_gd.apply(this,arguments);}finally{STAGEDECO[di]=L;}
 // 1b) special rooms keep their fixed set pieces (torii, jizo pair, incense...) but lose the random extras around them
 {const FIX={shrine:[[0,-46],[-30,-12],[30,-12],[-16,22],[16,22]],altar:[[0,-46],[-24,16],[24,16],[-34,-8],[34,-8]],treasure:[[-32,-4],[32,-4],[-16,18],[16,18],[0,-22]],
   rest:[[76,76],[-76,76],[-76,-76],[76,-76],[44,-34]]};
  for(const r of map.rooms){const F=FIX[r.type];if(!F)continue;const c=roomCenter(r),idx=map.rooms.indexOf(r);
   out=out.filter(o=>{if(DECO_SCATTER.has(o.k)||o.onliq)return true;if(map.roomOf[(o.y/T|0)*MW+(o.x/T|0)]!==idx)return true;return F.some(([dx,dy])=>Math.hypot(o.x-c.x-dx,o.y-c.y-dy)<3);});}}
 // 2) one scene in some of the ordinary rooms, set towards the edge and clear of everything that matters
 const G=DECO_GROUPS[di]||[],ok=(x,y)=>{const tx=x/T|0,ty=y/T|0,j=ty*MW+tx;return map.t[j]&&!map.liq[j]&&!solid(x,y)&&!solid(x+8,y)&&!solid(x-8,y)&&!solid(x,y+8)&&!solid(x,y-8);};
 if(G.length)for(const r of map.rooms){
  const plain=r.k==='start'||(r.k==='room'&&['combat','elite','ambush','trap','challenge'].includes(r.type));if(!plain)continue;
  if(r.k!=='start'&&Math.random()>.55)continue;
  const g=pick(G),cx=r.x+r.w/2,cy=r.y+r.h/2;
  for(let tr=0;tr<40;tr++){const ax=(r.x+1.5+Math.random()*(r.w-3))*T,ay=(r.y+1.5+Math.random()*(r.h-3))*T;
   // towards the edge: not within the middle half of the room
   if(Math.abs(ax/T-cx)<r.w*.25&&Math.abs(ay/T-cy)<r.h*.25)continue;
   const pts=g.map(([k,dx,dy,f])=>({k,x:ax+dx,y:ay+dy,f:!!f,ph:Math.random()*6}));
   if(!pts.every(p=>DECOSPR[p.k]&&ok(p.x,p.y)))continue;
   if(props.some(p=>pts.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<34)))continue;
   if(map.lair&&pts.some(q=>Math.hypot(map.lair.px-q.x,map.lair.py-q.y)<40))continue;
   out=out.filter(o=>!pts.some(q=>Math.hypot(o.x-q.x,o.y-q.y)<14));out.push(...pts);break;}}
 // 3) lights: the old random lamps along every passage wall are gone; instead some doorways get a matching pair
 const HL={grass:'lantern',stone:'torch',planks:'plantern',ember:'brazier',swamp:'lantern',temple:'lantern',snow:'lantern',marble:'plantern',cave:'crystal',blood:'candles'}[map.env.k]||'torch';
 const inRoom=(x,y)=>map.rooms.some(r=>x>=r.x-1&&x<r.x+r.w+1&&y>=r.y-1&&y<r.y+r.h+1);
 out=out.filter(o=>!(o.k===HL&&!inRoom(o.x/T|0,o.y/T|0)));
 if(HL!=='crystal')for(const r of map.rooms){if(r.k!=='room'||r.type==='shop'||r===map.bossRoom)continue;
  if(Math.random()>.5)continue;const ops=roomOpenings(r).sort((a,b)=>b.g.length-a.g.length);
  for(const o of ops.slice(0,1)){const ps=openingPosts(o,[1.5,1]);if(ps.length<2)continue;
   if(ps.some(q=>props.some(p=>Math.hypot(p.x-q.x,p.y-q.y)<20)||out.some(d=>DECO_GROUPS.length&&d.k===HL&&Math.hypot(d.x-q.x,d.y-q.y)<30)))continue;
   out=out.filter(d=>!ps.some(q=>Math.hypot(d.x-q.x,d.y-q.y)<12));ps.forEach((q,i)=>out.push({k:HL,x:q.x,y:q.y,f:!!i,ph:Math.random()*6}));}}
 return out;};}
