'use strict';
// ===== SET DRESSING AND COVER: every stage furnished for its own story =====
// - New props drawn for the stories: Akagane's war camp (tents, campfires, spear racks), the marsh's scarecrows,
//   the smugglers' crates and webs, the burnt town's ruined houses and rubble, the pass's waystation signs, Tetsuo's cannons
//   and barricades, the jailer's cages and chains, the castle's folding screens and armour stands, the palace's jade statues.
// - Each stage picks its props from its own list (two stages that share a floor no longer look alike).
// - COVER: bigger fight rooms get a few low obstacles in the stage's border style (rocks, bamboo, crates of stone...).
//   They block bullets from both sides, so you can break line of fire, and so can they.
(()=>{
 const blob=(R,cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const hw=Math.round(rx*Math.sqrt(Math.max(0,1-(y/ry)**2)));R(cx-hw,cy+y,hw*2+1,1,c);}};
 // war camp
 defDeco('tent',22,16,(R)=>{for(let y=0;y<14;y++){const w=Math.round(1+y*.8);R(11-w,y,w*2,1,y%4===0?'#6a1a14':'#a02a1e');}R(10,0,2,14,'#3a2418');R(8,8,6,6,'#2a1410');R(0,14,22,2,'#4a2a18');R(11,-0,1,1,'#e0b040');},{big:1});
 defDeco('campfire',12,8,(R)=>{R(1,6,10,2,'#4a2a18');R(2,5,8,1,'#6a3a20');R(0,7,3,1,'#5a5a64');R(9,7,3,1,'#5a5a64');R(4,4,4,2,'#ff8a30');},{big:0,fire:{y:-7,s:3},glow:{c:'#ff8a30',y:-8,r:12}});
 defDeco('spearrack',12,18,(R)=>{R(0,16,12,2,'#4a2a18');R(0,10,12,1,'#4a2a18');for(const x of [1,4,7,10]){R(x,1,1,16,'#6a4a2a');R(x,0,1,2,'#c8c8d0');}},{big:1});
 // marsh
 defDeco('scarecrow',13,22,(R)=>{R(6,4,1,18,'#5a3a22');R(0,7,13,1,'#5a3a22');R(3,0,7,3,'#c8a050');R(2,3,9,1,'#a08040');R(4,4,5,5,'#c8b88a');R(5,5,1,1,'#2a2010');R(7,5,1,1,'#2a2010');R(3,9,7,7,'#6a5a8a');R(3,9,7,1,'#8a7aaa');R(0,8,2,4,'#c8b060');R(11,8,2,4,'#c8b060');},{big:1});
 // caverns
 defDeco('web',18,10,(R)=>{const c='#d8d0e0';for(let i=0;i<9;i++)R(i*2,5-Math.round(i*.5),1,1,c);for(let i=0;i<9;i++)R(i*2,5+Math.round(i*.5),1,1,c);R(0,5,18,1,c);R(9,0,1,10,c);for(const r of [3,6])for(let a=0;a<12;a++){const x=9+Math.round(Math.cos(a/12*6.28)*r*1.4),y=5+Math.round(Math.sin(a/12*6.28)*r*.6);R(x,y,1,1,c);}},{big:0,flat:1});
 defDeco('crates',14,16,(R)=>{const cr=(x,y,w,h)=>{R(x,y,w,h,'#9a6a34');R(x,y,w,1,'#c08a48');R(x,y,1,h,'#6a4820');R(x+w-1,y,1,h,'#6a4820');R(x,y+h-1,w,1,'#6a4820');R(x+1,y+1,w-2,1,'#6a4820');};cr(0,7,9,9);cr(6,9,8,7);cr(2,0,8,8);R(4,3,4,1,'#3a2a14');},{big:1});
 // burnt town
 defDeco('rubble',16,7,(R)=>{blob(R,8,4,7,3,'#3a2a22');R(2,2,4,2,'#5a4a3a');R(9,1,5,2,'#4a3a2e');R(6,0,1,3,'#2a1a12');R(12,3,1,1,'#ff6020');R(4,5,1,1,'#ff8a30');},{big:0});
 defDeco('burnhouse',22,24,(R)=>{R(2,6,2,18,'#2a1a12');R(17,9,2,15,'#2a1a12');R(0,6,14,2,'#1e120c');R(10,4,10,2,'#2a1a12');R(4,12,13,1,'#2a1a12');R(5,13,4,9,'#8a7a64');R(12,15,4,7,'#6a5a48');R(5,13,4,1,'#4a3a2a');R(1,22,20,2,'#3a2a22');},{big:1,fire:{y:-22,s:3},glow:{c:'#ff6020',y:-18,r:14}});
 // frost pass
 defDeco('signpost',12,18,(R)=>{R(5,3,2,15,'#5a3a22');R(0,2,12,5,'#8a6a42');R(0,2,12,1,'#eef4fb');R(2,4,7,1,'#2a1a10');R(1,8,9,4,'#7a5a3a');R(2,10,5,1,'#2a1a10');R(4,16,4,2,'#eef4fb');},{big:1});
 // outer walls
 defDeco('cannon',18,11,(R)=>{R(2,7,14,2,'#5a3a22');blob(R,4,8,3,3,'#3a2418');blob(R,14,8,3,3,'#3a2418');R(4,2,13,5,'#3a3a42');R(4,2,13,1,'#6a6a74');R(15,1,3,7,'#2a2a30');R(1,3,3,3,'#2a2a30');},{big:0});
 defDeco('barricade',18,12,(R)=>{R(0,10,18,2,'#4a3a22');for(let i=0;i<4;i++){for(let k=0;k<9;k++){R(1+i*4+(k>>1),10-k,1,1,'#7a5a32');R(5+i*4-(k>>1),10-k,1,1,'#6a4a2a');}}R(0,6,18,1,'#5a3a22');},{big:0});
 defDeco('arrows',9,12,(R)=>{R(1,10,7,2,'#4a3a22');for(const x of [1,3,5,7]){R(x,1,1,10,'#8a6a42');R(x,0,1,1,'#c8c8d0');R(x-0,9,1,1,'#e8e0d0');}R(0,6,9,2,'#6a4a2a');},{big:0});
 // iron cellars
 defDeco('cage',14,22,(R)=>{R(0,0,14,2,'#3a3a42');R(0,20,14,2,'#3a3a42');for(const x of [0,3,6,9,12])R(x,2,2,18,'#5a5a64');R(4,15,6,4,'#c8c0b0');R(5,14,3,2,'#c8c0b0');R(6,0,2,1,'#8a8a94');},{big:1});
 defDeco('chains',8,22,(R)=>{R(0,0,8,2,'#3a3a42');for(let y=2;y<20;y+=3){R(2,y,3,2,'#6a6a74');R(3,y+1,1,1,'#2a2a30');}R(1,19,6,3,'#4a4a54');},{big:1});
 // crane castle
 defDeco('byobu',18,16,(R)=>{for(let i=0;i<4;i++){const x=i*4+(i%2);R(x,0,5,16,'#2a1810');R(x+1,1,3,14,i%2?'#e8d8b0':'#f0e0c0');R(x+1,8,3,1,'#c8a040');}R(3,5,3,3,'#c03020');R(11,9,3,2,'#3a6a3a');},{big:1});
 defDeco('armour',12,22,(R)=>{R(5,18,2,4,'#3a2418');R(1,20,10,2,'#3a2418');R(2,7,8,10,'#8a1818');R(2,7,8,1,'#e0b040');R(1,8,2,4,'#a02020');R(9,8,2,4,'#a02020');R(3,1,6,6,'#2a2a30');R(2,0,8,2,'#3a3a42');R(4,3,4,2,'#e0b040');R(1,0,1,3,'#e0b040');R(10,0,1,3,'#e0b040');},{big:1});
 defDeco('vase',7,10,(R)=>{blob(R,3,6,3,3,'#3a6aa0');R(2,1,3,3,'#3a6aa0');R(1,0,5,1,'#2a4a7a');R(2,5,1,2,'#e8eef6');R(4,7,1,1,'#e8eef6');},{big:0});
 // jade palace and throne room
 defDeco('jadestatue',12,24,(R)=>{R(1,20,10,4,'#8a8a82');R(1,20,10,1,'#b0b0a8');R(3,8,6,12,'#3e9a6a');R(3,8,2,12,'#5ec08a');R(4,3,4,5,'#3e9a6a');R(3,2,6,2,'#2e7a52');R(2,10,1,6,'#2e7a52');R(9,10,1,6,'#2e7a52');R(5,4,1,1,'#1a3a2a');},{big:1});
 defDeco('goldbrazier',12,14,(R)=>{R(5,6,2,8,'#a07020');R(2,13,8,1,'#a07020');R(0,3,12,3,'#e0b040');R(0,3,12,1,'#fff0a0');R(1,6,10,1,'#a07020');R(1,2,10,1,'#ff6020');},{big:0,fire:{y:-13,s:3},glow:{c:'#ffb040',y:-14,r:12}});
})();
// what each stage is furnished with (index = stage). Keys from the shared set and the new story props above.
const STAGEDECO=[
 [['bamboo',4],['tallgrass',3],['bush',2],['tent',2],['campfire',2],['spearrack',2],['banner',2],['rock',1]],          // I   Akagane's camp in the bamboo
 [['reeds',5],['tallgrass',3],['scarecrow',2],['ricebale',2],['lantern',2],['deadtree',1],['jizo',1]],                 // II  the abandoned paddies
 [['crystal',4],['stalag',3],['mushroom',2],['web',3],['crates',2],['barrel',1]],                                       // III smugglers and the spider
 [['charred',3],['burnhouse',2],['rubble',4],['brazier',1],['plantern',2],['vent',2]],                                  // IV  the burnt town
 [['pine',4],['iceshard',2],['rock',2],['signpost',1],['lantern',2],['campfire',1],['torii',1]],                       // V   the waystation on the pass
 [['barricade',3],['cannon',2],['arrows',3],['banner',2],['crate',2],['torch',2],['tent',1]],                           // VI  Tetsuo's ramparts
 [['maple',3],['lantern',3],['incense',2],['bell',2],['jizo',2],['pagoda',1],['candles',1]],                           // VII the bell temple
 [['cage',3],['chains',3],['bones',2],['torch',3],['barrel',2],['pillar',1]],                                           // VIII the iron cellars
 [['byobu',3],['armour',2],['vase',3],['taru',1],['plantern',2],['taiko',1],['bonsai',1]],                             // IX  the halls of the keep
 [['sakura',4],['bonsai',2],['lantern',3],['bush',3],['jizo',1],['komainu',1]],                                         // X   the royal gardens
 [['rpillar',3],['jadestatue',2],['goldbrazier',2],['bonsai',2],['komainu',1],['urn',2]],                               // XI  the jade palace
 [['rpillar',3],['goldbrazier',3],['banner',3],['candles',2],['bones',1],['armour',1]]];                                // XII the throne room
{const _gd=genDecos;genDecos=function(di){const k=map&&map.env&&map.env.k,L=STAGEDECO[di];if(!k||!L||map.train)return _gd.apply(this,arguments);
 const old=ENVDECO[k];ENVDECO[k]=L;try{return _gd.apply(this,arguments);}finally{ENVDECO[k]=old;}};}

// ---------- cover: low obstacles in the bigger fight rooms ----------
{const _gm=genMap;genMap=function(di){const m=_gm.apply(this,arguments);try{addCover(m,di);}catch(e){console.error(e);}return m;};}
function addCover(m,di){const SH=[[[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[1,0],[0,1]],[[0,0],[1,0],[0,1],[1,1]]];let changed=false;
 for(const r of m.rooms){if(r.k!=='room'||!['combat','elite','ambush','challenge'].includes(r.type)||r.w<12||r.h<12)continue;
  const n=Math.min(5,1+Math.floor(r.w*r.h/110)),placed=[];
  for(let t=0;t<n*12&&placed.length<n;t++){const gx=r.x+3+Math.floor(Math.random()*(r.w-7)),gy=r.y+3+Math.floor(Math.random()*(r.h-7));
   const cx=r.x+r.w/2,cy=r.y+r.h/2;if(Math.abs(gx-cx)<3&&Math.abs(gy-cy)<3)continue;
   if(placed.some(p=>Math.abs(p[0]-gx)<5&&Math.abs(p[1]-gy)<5))continue;
   const sh=SH[Math.floor(Math.random()*SH.length)],cells=sh.map(([a,b])=>[gx+a,gy+b]);
   // every cell and a ring of one tile around must be open floor, so you can always walk round
   let ok=true;for(const [x,y] of cells)for(let j=-1;j<=1&&ok;j++)for(let i=-1;i<=1;i++){const k=(y+j)*MW+(x+i);if(!m.t[k]||m.liq[k]){ok=false;break;}}
   if(!ok)continue;m.cover=m.cover||new Uint8Array(MW*MH);for(const [x,y] of cells){m.t[y*MW+x]=0;m.cover[y*MW+x]=1;}placed.push([gx,gy]);changed=true;}
  r.cover=placed.length;}
 if(changed)rebuildVis(m);}
