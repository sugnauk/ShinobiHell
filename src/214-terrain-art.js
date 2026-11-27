'use strict';
// Dungeon materials use low-contrast facets. The strongest outlines stay on characters and hazards.
const FLOOR_SURFACE={
 grass:'earth',swamp:'earth',stone:'stone',temple:'sand',planks:'wood',ember:'basalt',
 snow:'snow',marble:'tiles',cave:'basalt',blood:'tiles'
};
const ROOM_SURFACE={approach:'stone',rest:'earth',treasure:'tiles',shop:'wood',shrine:'tiles',altar:'basalt'};
const MATERIAL_TILES=new Map();
function materialTile(type,base,seam,variant){
 const key=[type,base,seam,variant,TILEH].join('/');
 if(MATERIAL_TILES.has(key))return MATERIAL_TILES.get(key);
 if(MATERIAL_TILES.size>=640)MATERIAL_TILES.delete(MATERIAL_TILES.keys().next().value);
 const rim=shade(base,.105),under=shade(base,-.13),mild=shade(base,.052);
 const tile=mk(32,TILEH,g=>{
  const {poly,line,ink}=heroPainter(g);
  // Build the clip from the same profile used by the dungeon mesh and liquids.
  g.beginPath();
  for(let j=0;j<TILEH;j++){const half=dHalf(j);g.rect(16-half,j,half*2,1);}
  g.save();g.clip();ink(0,0,32,TILEH,base);
  if(type==='wood'){
   for(let i=-2;i<4;i++){
    const y=i*4+variant%2;
    line([[0,y],[24,y+12],[32,y+16]],1,under);
    line([[0,y+1],[24,y+13],[32,y+17]],.8,rim);
   }
   for(let i=0;i<4;i++){
    const x=3+(variant*13+i*9)%22,y=1+(i*5+variant)%TILEH;
    line([[x,y],[x+4,y+2],[x+7,y+3]],.65,i%2?mild:under);
   }
  }else if(type==='tiles'||type==='stone'){
   poly([[2,8],[16,1],[26,6],[19,12],[10,13]],mild,false);
   if(variant%4===0)line([[5,6],[11,6],[13,8],[19,8],[22,10]],.85,under);
   if(type==='tiles'&&variant%4===1){
    poly([[16,5],[22,8],[16,11],[10,8]],rim,false);
    poly([[16,6],[20,8],[16,10],[12,8]],base,false);
   }
   line([[1,8],[16,0],[31,8]],1,rim);
   line([[1,8],[16,TILEH-1],[31,8]],1,seam);
  }else if(type==='earth'||type==='sand'||type==='snow'){
   const dune=type==='sand';
   const pts=[[0,9],[9,5+(variant%3)],[21,6],[31,2],[32,12],[23,13],[12,10],[5,14]];
   poly(pts,mild,false);
   for(let i=0;i<4;i++){
    const x=(variant*17+i*11)%25,y=3+(i*7+variant)%10;
    if(dune)line([[x-3,y],[x+3,y],[x+6,y+1]],.75,rim);
    else if(type==='snow')ink(x,y,2,1,rim);
    else if((variant+i)%2)line([[x,y+1],[x+1,y-1],[x+3,y]],.65,under);
   }
  }else{
   poly([[0,7],[9,3],[17,3],[20,7],[31,6],[23,13],[13,13]],mild,false);
   line([[6,4],[11,5],[13,8],[17,9],[19,12]],1,under);
   line([[14,8],[18,7],[21,6],[26,7]],.7,under);
   if(variant%4===1)line([[13,8],[17,9],[19,11]],.65,shade(base,.19));
  }
  g.restore();
 });
 MATERIAL_TILES.set(key,tile);return tile;
}
function paintMaterialTile(g,X,Y,x,y,room,base,seam){
 const kind=ROOM_SURFACE[room?.type]||FLOOR_SURFACE[map.env.k]||'stone';
 const variant=Math.floor(hash(x*3+7,y*5+19)*8);
 g.drawImage(materialTile(kind,base,seam,variant),X-16,Y);
}
function paintFloorDetail(g,X,Y,x,y,h,th){
 const env=map.env.k,px=X-6+Math.floor(hash(x+5,y+7)*12),py=Y+5+Math.floor(hash(x+17,y-23)*5);
 const {poly,line,ink}=heroPainter(g),ground=th.fl[(x+y)&1];
 if((env==='grass'||env==='swamp')&&h>.76){
  line([[px-2,py+1],[px,py-1],[px+1,py+1],[px+3,py-1]],.75,shade(ground,.25));
  if(h>.95)ink(px+1,py-1,1,1,env==='grass'?'#c7a783':'#aca276');
 }else if((env==='snow'||env==='marble'||env==='temple')&&h>.86){
  poly([[px-2,py],[px,py-1],[px+2,py],[px+1,py+1],[px-1,py+1]],env==='marble'?'#b98295':shade(ground,.20),false);
 }else if((env==='ember'||env==='cave'||env==='blood')&&h>.9){
  ink(px,py,1,1,env==='ember'?'#b77b58':env==='cave'?'#b78ab7':'#ba7776');
 }
}

function paintLiquidSurface(g,X,Y,lq,h,tu,tv){
 const at=(u,v)=>{const [x,y]=tileW(u,v);return x>=0&&y>=0&&x<MW&&y<MH&&map.liq[y*MW+x]===lq;};
 const C=map.env.lc,base=C[1],dark=shade(base,-.24),light=shade(C[0],.13);
 const {poly,line,ink}=heroPainter(g);
 g.save();g.beginPath();
 for(let j=0;j<TILEH;j++){const half=dHalf(j);g.rect(X-half,Y+j,half*2,1);}
 g.clip();ink(X-16,Y,32,TILEH,base);
 poly([[X-16,Y+4],[X-6,Y+3],[X+6,Y+7],[X+16,Y+7],[X+13,Y+11],[X+1,Y+10],[X-12,Y+7]],dark,false);
 for(let n=0;n<3;n++){
  const xx=X-9+Math.floor(hash(tu+n*3,tv+7)*13),yy=Y+4+n*4;
  line([[xx-4,yy],[xx,yy],[xx+3,yy-1],[xx+8,yy-1]],.9,n===0?C[0]:light);
 }
 if(lq===4&&h>.42)line([[X-9,Y+7],[X+2,Y+7],[X+5,Y+5],[X+9,Y+5]],.8,C[2]);
 if(lq===2&&h>.5)for(const i of [-1,1])ink(X+i*3,Y+7+i,1,1,'#eab270');
 if(lq===3&&h>.67)poly([[X-3,Y+8],[X,Y+5],[X+3,Y+8],[X,Y+10]],'#619978',false);
 g.restore();
 const clay=lq===2?'#764535':lq===4?'#bbcfd7':shade(base,.18);
 const edges=[[-1,0,0,0,-1],[0,-1,0,0,1],[1,0,15,HY,-1],[0,1,-16,HY,1]];
 for(const [du,dv,dx,dy,d] of edges)if(!at(tu+du,tv+dv)){
  isoLn(g,dark,X+dx,Y+dy,8,d);isoLn(g,clay,X+dx,Y+dy+1,7,d);
 }
}

function finishWallMaterial(g,mask,variant,faceY,top){
 const material=map.env.wall,glazed=material==='palace'||material==='lacquer'||material==='shoji';
 const {poly,line,ink}=heroPainter(g);
 if(glazed){
  g.save();g.beginPath();
  for(let j=1;j<TILEH-1;j++){const half=dHalf(j);g.rect(17-half,j,half*2-2,1);}
  g.clip();
  for(let x=-5;x<32;x+=6){
   line([[x,0],[x+21,TILEH]],1,material==='palace'?'#c49d5b':'#788296');
   line([[x+1,0],[x+22,TILEH]],.8,material==='palace'?'#765635':'#3b4658');
  }
  g.restore();
 }
 for(let x=1;x<31;x++){
  if(!(mask&(x<16?1:2)))continue;
  const y=faceY(x);
  if(material==='hedge'||material==='bamboo'){
   if(x%3===0)ink(x,y+2+(x+variant)%4,1,2,'#6c8652');
  }else if(material==='snow'){
   if(x%3===1)ink(x,y+2,1,1,'#c4d3df');
  }else{
   if((x+variant)%5<3)ink(x,y+2,1,1,glazed?'#ab8a62':shade(top,.18));
   if((x+variant*3)%7===0)ink(x,y+WH-3,1,2,shade(top,-.35));
  }
 }
 if(!glazed&&material!=='hedge'&&material!=='bamboo'){
  g.save();g.beginPath();g.moveTo(16,1);g.lineTo(30,HY);g.lineTo(16,TILEH-2);g.lineTo(2,HY);g.closePath();g.clip();
  poly([[3,HY],[11,4],[17,4],[24,HY],[16,TILEH-2],[8,HY+3]],shade(top,.08),false);
  line([[8,HY],[13,HY-2],[18,HY-2],[23,HY]],.7,shade(top,-.14));g.restore();
 }
}

const OUTSIDE_SURFACE={forest:'earth',paddy:'earth',cave:'basalt',ashes:'basalt',snow:'snow',field:'earth',
 gravel:'sand',garden:'earth',town:'wood',palace:'tiles',hall:'tiles'};
function paintOutsideTile(g,style,X,Y,x,y,color){
 const kind=OUTSIDE_SURFACE[style]||FLOOR_SURFACE[map.env.k]||'stone';
 const variant=Math.floor(hash(x*3+31,y*5+9)*8);
 g.drawImage(materialTile(kind,color,shade(color,-.17),variant),X-16,Y);
}
function paintWallCladding(g,faces,tall,variant){
 const h=tall?14:7;
 const stone=map.env.k==='marble'?'#647f91':map.env.k==='planks'?'#816856':
  map.env.k==='blood'?'#6e535e':map.env.k==='swamp'?'#56695c':'#626372';
 const top=shade(stone,.20),under=shade(stone,-.27);
 const y=SBY-h;
 block(g,faces,h,(x,j)=>{
  const row=(j+(x>>1)+variant)%8;
  return row===0?shade(top,.09):row===7?stone:top;
 },(x,k)=>k%5===0||((x+((k/5)|0)%2*4)%8===0)?under:k%5===1?top:stone,
 (x,k)=>k%5===0||((x+((k/5)|0)%2*4)%8===0)?shade(under,-.23):k%5===1?stone:shade(stone,-.16));
 const {poly,line}=heroPainter(g);
 g.save();g.beginPath();
 for(let j=1;j<TILEH-1;j++){const half=dHalf(j);g.rect(25-half,y+j,half*2-2,1);}
 g.clip();
 poly([[11,y+HY],[23,y+1],[33,y+6],[31,y+10],[21,y+10]],shade(top,.11),false);
 line([[11,y+HY],[24,y+2],[37,y+HY]],1,'#a08d81');
 line([[13,y+HY+1],[24,y+4],[35,y+HY+1]],.7,shade(top,.20));g.restore();
}
