'use strict';
// SHINOBIDUNGEONS - indoor stages are furnished, not overgrown. The cellars, the castle keep, the jade palace and the
// throne room lose every scattered plant and rock; in their place are the things an invaded castle is full of: cushions
// and low tables, tea sets, piles of scrolls, sake jugs, paper andon lamps, tansu chests, scroll shelves, sword stands,
// braziers with kettles, and straw and buckets in the cells. Outdoor stages keep their nature (the outer walls get
// rubble and rocks instead of a carpet of grass).

const INDOOR=new Set([7,8,10,11]);
const NATURE=new Set(['tallgrass','bush','bamboo','rock','reeds','deadtree','maple','sakura','pine','mushroom','lily','iceshard','stalag','crystal','web']);

// ---------- the furniture ----------
defDeco('zabuton',9,4,(R)=>{R(0,1,9,3,'#8a2a3a');R(1,0,7,1,'#a83a4a');R(0,1,9,1,'#c04a5a');R(4,2,1,1,'#e0b040');},{big:0});
defDeco('lowtable',16,7,(R)=>{R(0,0,16,3,'#5a3420');R(0,0,16,1,'#8a5a3a');R(1,3,2,4,'#3a2014');R(13,3,2,4,'#3a2014');R(3,1,4,1,'#2a1810');},{big:0});
defDeco('teaset',9,5,(R)=>{R(0,4,9,1,'#5a3420');R(1,1,4,3,'#3a5a4a');R(2,0,2,1,'#3a5a4a');R(5,2,1,1,'#3a5a4a');R(6,3,2,1,'#e8e0d0');R(2,2,1,1,'#6a9a8a');},{big:0});
defDeco('scrolls',10,5,(R)=>{for(const [x,y,c] of [[0,3,'#e8dcc0'],[4,3,'#d8c8a0'],[2,1,'#f0e4c8'],[6,1,'#e0d0b0']]){R(x,y,4,2,c);R(x,y,1,2,'#a02020');R(x+3,y,1,2,'#a02020');}},{big:0});
defDeco('sakejug',5,8,(R)=>{R(1,0,3,1,'#6a4a2a');R(1,1,3,1,'#e8e0d0');R(0,2,5,6,'#e8e0d0');R(0,2,1,6,'#fff');R(4,2,1,6,'#b8b0a0');R(1,4,3,2,'#2a4a8a');},{big:0});
defDeco('andon',7,13,(R)=>{R(0,12,7,1,'#3a2414');R(1,11,1,1,'#3a2414');R(5,11,1,1,'#3a2414');R(0,2,7,9,'#3a2414');R(1,3,5,7,'#f4e4b0');R(1,3,5,1,'#fff4d0');R(3,3,1,7,'#d8c088');R(1,0,5,2,'#5a3a22');},{big:1,glow:{c:'#ffd080',y:-7,r:9}});
defDeco('tansu',13,15,(R)=>{R(0,0,13,15,'#4a2a18');R(0,0,13,1,'#6a4a2a');for(let y=2;y<14;y+=4){R(1,y,11,3,'#6a3a20');R(5,y+1,3,1,'#c8a040');}R(0,0,1,15,'#2a1810');},{big:1});
defDeco('shelf',15,18,(R)=>{R(0,0,15,18,'#3a2414');R(1,1,13,16,'#2a1a10');for(const y of [5,11,17])R(0,y,15,1,'#5a3a22');for(let y=0;y<3;y++)for(let i=0;i<4;i++){const c=['#e8dcc0','#d8c8a0','#c04040','#e0d0b0'][(i+y)%4];R(2+i*3,y*6+2,2,3,c);}},{big:1});
defDeco('swordstand',12,8,(R)=>{R(1,6,10,2,'#2a1810');R(1,1,1,6,'#3a2414');R(10,1,1,6,'#3a2414');R(0,2,12,1,'#1a1a22');R(0,2,3,1,'#8a2020');R(0,4,12,1,'#1a1a22');R(0,4,3,1,'#c8a040');R(11,2,1,1,'#c8c8d0');R(11,4,1,1,'#c8c8d0');},{big:0});
defDeco('hibachi',10,9,(R)=>{R(0,4,10,5,'#3a2a22');R(0,4,10,1,'#5a4a3a');R(1,5,8,1,'#ff6020');R(3,1,4,3,'#2a2a30');R(4,0,2,1,'#2a2a30');R(7,2,2,1,'#2a2a30');},{big:0,smoke:'#c8c0b8',glow:{c:'#ff6020',y:-4,r:7}});
defDeco('goboard',10,6,(R)=>{R(0,1,10,4,'#c8a060');R(0,1,10,1,'#e0c080');R(1,5,1,1,'#6a4a2a');R(8,5,1,1,'#6a4a2a');for(const [x,y,c] of [[2,2,'#14101a'],[4,3,'#fff'],[6,2,'#14101a'],[7,3,'#fff'],[3,3,'#14101a']])R(x,y,1,1,c);},{big:0});
defDeco('straw',13,4,(R)=>{R(0,2,13,2,'#a88a40');R(1,1,11,1,'#c8a858');for(let x=0;x<13;x+=2)R(x,1+(x%3?1:0),1,1,'#e0c870');},{big:0,flat:1});
defDeco('bucket',6,6,(R)=>{R(0,1,6,5,'#6a4a2a');R(0,1,6,1,'#8a6a3a');R(0,3,6,1,'#3a3a40');R(1,0,1,1,'#3a3a40');R(4,0,1,1,'#3a3a40');R(2,0,2,1,'#3a3a40');},{big:0});
defDeco('stool',6,5,(R)=>{R(0,0,6,2,'#6a4a2a');R(0,0,6,1,'#8a6a3a');R(0,2,1,3,'#3a2414');R(5,2,1,3,'#3a2414');},{big:0});
defDeco('incenseburner',8,8,(R)=>{R(1,2,6,5,'#8a7030');R(1,2,6,1,'#c8a040');R(0,7,2,1,'#5a4a20');R(6,7,2,1,'#5a4a20');R(3,0,2,2,'#c8a040');},{big:0,smoke:'#d8d0e0'});

// what is scattered loose in each stage (outdoor stages keep their nature; indoor ones get clutter)
const STAGE_SCATTER={
 5:[['rubble',4],['rock',3],['tallgrass',1],['arrows',1]],
 7:[['straw',4],['bucket',2],['bones',1],['crate',1],['sakejug',1]],
 8:[['zabuton',3],['scrolls',2],['teaset',1],['sakejug',2],['vase',1],['andon',1],['goboard',1]],
 10:[['zabuton',3],['vase',2],['urn',1],['teaset',1],['scrolls',1],['incenseburner',2],['andon',1]],
 11:[['candles',3],['zabuton',2],['scrolls',1],['swordstand',1],['sakejug',1],['incenseburner',1]]};
// furnished scenes for the indoor stages, on top of the ones they had
{const add=(di,...gs)=>{DECO_GROUPS[di]=(DECO_GROUPS[di]||[]).concat(gs);};
 const tea=[['lowtable',0,0],['zabuton',-12,10],['zabuton',12,10],['teaset',0,-2],['andon',-20,-8]];
 const study=[['shelf',0,0],['lowtable',4,18],['scrolls',-12,18],['zabuton',4,28],['andon',18,8]];
 const guard=[['lowtable',0,0],['stool',-12,8],['stool',12,8],['sakejug',-2,-2],['goboard',4,-1],['spearrack',-24,-4]];
 const store=[['taru',-8,0],['taru',6,2],['ricebale',-2,12],['crate',16,10],['sakejug',-16,10]];
 const armory=[['armour',0,0],['swordstand',-16,8],['spearrack',16,4],['tansu',-28,-6]];
 const kitchen=[['hibachi',0,0],['bucket',-12,6],['taru',12,2],['stool',-4,12]];
 add(7,store,kitchen,[['straw',0,0],['bucket',-10,6],['chains',12,-4]]);
 add(8,tea,study,guard,armory,kitchen);
 add(10,tea,study,[['incenseburner',0,0],['zabuton',-12,8],['zabuton',12,8],['vase',-20,-6],['vase',20,-6,1]]);
 add(11,armory,guard,[['swordstand',0,0],['candles',-14,6],['candles',14,6],['zabuton',0,12]]);}
