'use strict';
// Shared finishing for bespoke sheets. Sample each source frame independently so adjacent poses cannot bleed.
const WORLD_FINISH=new WeakMap();
function finishWorldSprite(s){
 if(!s?.c||s.hd||!s.fw||!s.fh)return s;
 if(WORLD_FINISH.has(s))return WORLD_FINISH.get(s);
 const {c,fw,fh}=s,w=c.width,h=c.height;
 if(!w||!h)return s;
 const src=mk(w,h,g=>g.drawImage(c,0,0)),d=src.getContext('2d').getImageData(0,0,w,h).data;
 const hd=mk(w*2,h*2,g=>{
  const o=g.createImageData(w*2,h*2),data=o.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=(y*w+x)*4,a=d[i+3];if(!a)continue;
   const sample=(xx,yy)=>xx>=0&&xx<w&&yy>=0&&yy<h&&Math.floor(xx/fw)===Math.floor(x/fw)?(yy*w+xx)*4:-1;
   const up=sample(x,y-1),left=sample(x-1,y),down=sample(x,y+1),right=sample(x+1,y);
   const alpha=j=>j<0?0:d[j+3];
   const l=(d[i]*3+d[i+1]*6+d[i+2])/10;
   const topEdge=l>37&&alpha(up)<96,lit=topEdge||l>55&&alpha(left)<96;
   const low=l>39&&(alpha(down)<96||alpha(right)<96);
   for(let v=0;v<2;v++)for(let u=0;u<2;u++){
    const j=((y*2+v)*w*2+x*2+u)*4;
    const mark=(lit&&!v&&(topEdge||!u)?8:0)-(low&&v&&u?8:0);
    data[j]=clamp(d[i]+mark+(l>=48?2:0),0,255);
    data[j+1]=clamp(d[i+1]+mark,0,255);
    data[j+2]=clamp(d[i+2]+mark+(l<92?2:-1),0,255);
    data[j+3]=a;
   }
  }
  g.putImageData(o,0,0);
 });
 const art={...s,hd,hdWhite:whiteOf(hd)};
 WORLD_FINISH.set(s,art);return art;
}
{const previous=sprOf;sprOf=function(e){return finishWorldSprite(previous.apply(this,arguments));};}

const PROP_METAL={wood:'#77574e',dark:'#473640',gold:'#c69e65',gleam:'#f3d69a',rock:'#6d7183'};
const PROP_ATLAS=new Map();
function propCanvas(key,w,h,paint){
 if(!PROP_ATLAS.has(key))PROP_ATLAS.set(key,mk(w*2,h*2,g=>{g.scale(2,2);paint(heroPainter(g));}));
 return PROP_ATLAS.get(key);
}
function usePropArt(key,w,h,X,Y,paint){
 const c=propCanvas(key,w,h,paint);
 ctx.drawImage(c,Math.round(X-w/2),Math.round(Y-h),w,h);
}
function propPlinth(H,x,y,w,h,c,trim){
 const {poly,line,ink}=H,L=x-w/2,R=x+w/2,Z=y+h;
 poly([[L,y+3],[x,y],[R,y+3],[R,y+7],[R-2,y+8],[R-2,Z-2],[L+2,Z],[L+2,y+8],[L,y+7]],c);
 poly([[L+1,y+3],[x,y+1],[R-1,y+3],[x,y+6]],shade(c,.28),false);
 poly([[x,y+7],[R-1,y+5],[R-3,Z-3],[x,Z-2]],shade(c,-.26),false);
 line([[L+1,y+6],[x,y+8],[R-1,y+6]],1.25,trim);
 line([[L+3,Z-3],[x,Z-2],[R-3,Z-4]],1,shade(trim,-.27));
 for(const xx of [L+4,R-5])ink(xx,y+9,1,2,trim);
}
function drawArtChest(p,X,Y){
 const age=p.openedAt==null?1:time-p.openedAt;
 const f=p.used?Math.min(3,1+Math.floor(Math.max(0,age)/.065)):0;
 shadow(X,Y,27);
 usePropArt('chest'+f,34,29,X,Y,H=>{
  const {poly,line,ink,stone}=H,M=PROP_METAL;
  propPlinth(H,17,13,29,15,'#7d5148',M.gold);
  if(f){
   const lift=5+f*3;
   poly([[3,16],[3,16-lift],[16,11-lift],[31,14-lift],[31,16],[17,19]],M.dark);
   line([[4,15-lift],[16,12-lift],[30,15-lift]],1.2,M.gleam);
   line([[7,17],[17,19],[29,16]],1,'#656271');
  }else{
   poly([[2,15],[4,8],[11,5],[21,3],[29,6],[32,13],[17,18]],'#895959');
   poly([[4,9],[12,6],[21,4],[28,7],[18,11],[9,13]],'#b78366',false);
   poly([[18,11],[29,7],[31,13],[17,17]],'#60404a',false);
   for(const dx of [-9,8])line([[17+dx,8-2*(dx>0)],[17+dx,21-2*(dx>0)]],1.7,M.gold);
   stone(17,17,2.25,M.gleam);ink(17,17,1,1,M.dark);
  }
 });
 if(!p.used&&(time+hash(Math.floor(p.x),Math.floor(p.y))*2)%3.1<.25)twinkle(X,Y-12,2,'#e7c18d');
}
function drawArtShrine(p,X,Y){
 const kind=p.curse?'curse':p.god||'crane',C={curse:'#735263',crane:'#a7bbc6',fox:'#cf8660',ox:'#b85c53',moon:'#8994c7'}[kind]||'#9e90c6';
 shadow(X,Y,24);
 usePropArt('shrine/'+kind,28,30,X,Y,H=>{
  const {poly,line,ink,stone}=H,M=PROP_METAL;
  propPlinth(H,14,14,25,15,p.curse?'#4e3e50':M.wood,M.gold);
  poly([[4,13],[7,10],[14,9],[22,10],[24,13],[21,16],[7,16]],M.dark);
  if(kind==='curse'){
   poly([[9,7],[11,4],[17,4],[20,7],[20,11],[17,13],[17,16],[11,16],[11,13],[9,11]],'#b5a3a6');
   ink(11,8,2,2,M.dark);ink(16,8,2,2,M.dark);ink(14,11,1,1,M.dark);
   for(const xx of [12,14,16])ink(xx,14,.65,1.8,M.dark);
  }else if(kind==='fox'||kind==='ox')poly([[9,11],[8,3],[12,7],[17,7],[21,3],[20,12],[14,16]],C);
  else if(kind==='crane')poly([[8,13],[10,9],[15,9],[15,4],[18,2],[21,4],[18,6],[18,12],[15,15]],C);
  else poly([[9,8],[12,4],[17,4],[21,8],[20,13],[16,16],[10,13]],C);
  if(!p.curse)stone(14,11,2,M.gleam);
  for(const xx of [7,20])line([[xx,17],[xx+2,20],[xx,23]],1,M.gleam);
  ink(13,24,3,1,M.gold);
 });
 if(p.used)return;
 const yy=Math.round(Y-27+Math.sin(time*2+p.x)*2);
 const aura=p.col||C;ctx.save();ctx.globalAlpha*=.27;disc(X,yy,6,aura);ctx.restore();
 ctx.drawImage(shotSprite(p.curse?'gem':'orb',aura,3,0,0),X-16,yy-16,32,32);
}
function drawArtStand(X,Y){
 shadow(X,Y,16);
 usePropArt('stand',22,14,X,Y,H=>{
  propPlinth(H,11,1,19,12,'#884d52','#d1a66b');
 });
}
function drawArtGong(p,X,Y){
 shadow(X,Y,18);
 usePropArt('gong'+Number(!!p.used),28,29,X,Y,H=>{
  const {poly,line,stone}=H,M=PROP_METAL;
  for(const x of [5,23]){
   line([[x,4],[x,25]],3,M.dark);line([[x-1,6],[x-1,24]],1,M.wood);
   stone(x,25,2.5,M.gold);
  }
  poly([[2,5],[4,2],[24,2],[26,5],[22,8],[5,8]],'#875157');
  line([[3,5],[25,5]],1,M.gold);
  line([[11,7],[12,13],[17,13],[18,7]],1.1,M.gleam);
  poly([[8,14],[11,11],[17,11],[20,14],[20,20],[17,23],[11,23],[8,20]],p.used?'#806950':'#c99a61');
  line([[9,15],[12,12],[17,12]],1,M.gleam);
  stone(14,17,2,p.used?'#8a7156':'#f6d592');
 });
}
function drawArtSpring(p,X,Y){
 const w=66,h=35;
 usePropArt('spring'+Number(!!p.used),w,h,X,Y+13,H=>{
  const {poly,line,stone}=H;
  const edge=[[2,19],[7,12],[20,7],[44,7],[57,12],[64,20],[56,28],[41,32],[21,32],[7,27]];
  poly(edge,'#626879');
  poly([[7,19],[14,13],[25,10],[43,10],[53,14],[58,20],[49,25],[36,28],[19,26],[11,23]],p.used?'#3d5761':'#477e87');
  line([[8,18],[16,12],[24,9],[42,9],[52,12]],1.5,'#9eabb0');
  for(const path of [[[16,19],[25,18],[37,21],[48,19]],[[18,23],[28,23],[36,25]],[[20,15],[26,14],[33,16]]])
   line(path,1,p.used?'#59707b':'#95c9be');
  for(const [x,y] of [[10,24],[17,27],[28,30],[42,30],[54,24]])line([[x,y],[x+1,y-3]],1,'#372f41');
  stone(45,16,2.3,'#90a67e');stone(46,15,1.25,'#dda9ac');
 });
 if(!p.used){ctx.save();ctx.globalAlpha*=.65;for(let i=0;i<5;i++){
  const t=(time*.6+i*.2)%1,xx=X+Math.sin(i*25+time)*14,yy=Y+4-t*18;
  if(t<.85)twinkle(xx,yy,1,'#ceddba');
 }ctx.restore();}
}
function drawArtEntrance(p,X,Y){
 const boss=p.gate==='boss',kind=p.k,b=kind==='doorpost',edge=boss?'#ac6255':'#709b82',light=boss?'#f3c18a':'#cae0ad';
 shadow(X,Y,14);
 usePropArt('entry/'+kind+'/'+boss,28,32,X,Y,H=>{
  const {poly,line,stone}=H,M=PROP_METAL;
  line([[14,8],[14,28]],b?5:4,M.dark);
  line([[13,10],[13,28]],1.2,M.wood);
  if(b){
   propPlinth(H,14,25,11,6,'#6c5962',edge);
   poly([[7,9],[10,4],[18,4],[21,9],[17,12],[10,12]],M.dark);
   poly([[9,10],[14,8],[19,10],[19,20],[14,23],[9,20]],edge);
   stone(14,15,3,light);
  }else{
   poly([[1,12],[5,8],[23,8],[27,12],[24,21],[4,21]],M.dark);
   line([[4,13],[7,10],[22,10],[25,13]],1.2,edge);
   line([[4,20],[24,20]],1,edge);
  }
 });
 if(!b){const word=boss?'BOSS':'SHOP';txt(word,X-Math.round(txtW(word)/2),Y-19,light);}
}

const PLANT_PROPS=new Set(['bush','tallgrass','bamboo','sakura','maple','pine','reeds','deadtree','charred','bonsai']);
const STONE_PROPS=new Set(['rock','pillar','column','jizo','komainu','statue','stalag','crystal','iceshard']);
const WOOD_PROPS=new Set(['crate','barrel','taru','ricebale','banner','torii','blacktorii','pagoda','rpillar','stall','scarecrow']);
const LIGHT_PROPS=new Set(['plantern','lantern','torch','brazier','candles','bell','incense']);
function paintDressing(H,s,kind){
 const {poly,line,ink,stone}=H,w=s.w,h=s.h,x=w/2,y=h-2,M=PROP_METAL;
 if(PLANT_PROPS.has(kind)){
  const leafy=['sakura','maple','pine','bush','bonsai'].includes(kind),dry=kind==='deadtree'||kind==='charred';
  const base=kind==='sakura'?'#b9879b':kind==='maple'?'#ad765b':dry?'#765d59':'#617a55';
  if(leafy||dry){
   line([[x-1,y],[x,y*.56],[x-2,y*.33]],Math.max(2,w*.13),M.dark);
   line([[x-1,y-1],[x,y*.55],[x+3,y*.45]],1.2,M.wood);
   for(let i=0;i<4;i++){
    const cx=x+(i%2?1:-1)*w*(.15+(i%3)*.05),cy=y*(.2+i*.125),r=w*.23;
    if(dry){line([[x,y*.67],[cx,cy+3],[cx+1,cy]],1.8,base);continue;}
    poly([[cx-r,cy+2],[cx-r*.8,cy-1],[cx-r*.3,cy-4],[cx+r*.4,cy-4],[cx+r,cy],[cx+r*.6,cy+4],[cx-r*.3,cy+5]],base);
    line([[cx-r*.6,cy],[cx-r*.2,cy-2],[cx+r*.35,cy-3]],1,shade(base,.30));
    ink(cx+1,cy+2,1.3,1,shade(base,-.25));
   }
  }else for(let i=0;i<5;i++){
   const px=3+i*(w-6)/4,tilt=(i-2)*.8,top=y*(.10+.25*hash(i,w));
   line([[px,y],[px+tilt,top]],kind==='bamboo'?2.6:1.5,M.dark);
   line([[px-.2,y-1],[px+tilt,top]],1.1,base);
   for(let j=0;j<3;j++){
    const yy=top+(y-top)*(j+.4)/3;
    line([[px,yy],[px+(j%2?-3:3),yy-2]],1,shade(base,.29));
   }
  }
 }else if(STONE_PROPS.has(kind)){
  const gem=kind==='crystal'||kind==='iceshard',base=gem?(kind==='crystal'?'#9b7bab':'#9bbdcc'):M.rock;
  const tall=kind!=='rock'&&kind!=='komainu',l=Math.max(2,w*.16),r=w-l,t=tall?2:h*.34;
  poly([[l,y],[l-1,t+5],[x-1,t],[r-2,t+2],[r,t+5],[r+1,y]],base);
  poly([[l+1,t+5],[x-1,t+1],[r-3,t+3],[x-1,t+6],[l+2,y-1]],shade(base,.29),false);
  poly([[x-1,t+6],[r,t+5],[r+1,y],[x+1,y-1]],shade(base,-.30),false);
  if(gem){
   stone(x-3,y-4,2,shade(base,.42));line([[x,t+6],[x+1,y-3]],.8,'#e7d8df');
  }else{
   line([[l+2,t+7],[x,t+10],[x-1,t+13]],.8,shade(base,-.33));
   if(kind==='jizo'||kind==='statue'){
    line([[l+2,t+9],[r-1,t+10],[x+1,t+13]],1.8,'#a36863');ink(x,t+6,1.2,.85,M.dark);
   }
  }
 }else if(WOOD_PROPS.has(kind)||LIGHT_PROPS.has(kind)){
  const old=finishWorldSprite({c:s.c,fw:s.w,fh:s.h,frames:1,sc:1});
  H.g.drawImage(old.hd,0,0,w,h);
  if(kind==='brazier'||kind==='incense'||kind==='bell')stone(x,y*.49,1.3,M.gleam);
  if(kind==='torii'||kind==='blacktorii'||kind==='pagoda'||kind==='stall'){
   line([[3,3],[x,2],[w-4,3]],1.1,kind==='blacktorii'?'#916064':'#c49875');
   for(const dx of [4,w-5])line([[dx,5],[dx,y-2]],.75,'#a87666');
  }else if(kind==='banner'||kind==='plantern')line([[x-2,3],[x+1,4],[x+2,7]],.85,M.gleam);
 }
}
function refreshDressing(){
 for(const [kind,s] of Object.entries(DECOSPR)){
  let hd;
  if(PLANT_PROPS.has(kind)||STONE_PROPS.has(kind)||WOOD_PROPS.has(kind)||LIGHT_PROPS.has(kind))
   hd=propCanvas('dressing/'+kind,s.w,s.h,H=>paintDressing(H,s,kind));
  else hd=finishWorldSprite({c:s.c,fw:s.w,fh:s.h,frames:1,sc:1}).hd;
  s.hd=hd;
  s.c=mk(s.w,s.h,g=>{g.imageSmoothingEnabled=false;g.drawImage(hd,0,0,s.w,s.h);});
 }
}
refreshDressing();

const PICKUP_ART={
 sen:(H,w,h)=>{
  const {poly,line,ink}=H;poly([[2,1],[5,1],[6,3],[6,7],[5,9],[2,9],[1,7],[1,3]],'#bd8f54');
  line([[2,3],[3,2],[5,2]],1.2,'#f5d695');ink(2,4,3,1,'#e3b96d');ink(3,5,2,2,'#785640');
 },
 pot:(H,w,h)=>{
  const {poly,line,ink}=H;
  poly([[3,1],[6,1],[6,3],[8,5],[8,9],[6,11],[3,11],[1,9],[1,5],[3,3]],'#c8b4b4');
  poly([[2,5],[7,5],[7,9],[5,10],[3,10],[2,9]],'#b34b63',false);
  ink(3,1,3,1,'#aa7957');line([[2.5,6],[2.5,8]],1,'#f9c9c4');
 },
 heart:(H,w,h)=>{
  const {poly,line}=H;
  poly([[1,3],[3,2],[4,3],[6,2],[8,3],[8,5],[4.5,9],[1,5]],'#b35a70');
  line([[2,4],[3,3],[4,4]],1,'#f4bcc4');
 },
 gourd:(H,w,h)=>{
  const {poly,line}=H;
  poly([[3,1],[6,1],[6,4],[8,6],[8,9],[6,11],[2,10],[1,7],[3,4]],'#8d9a57');
  line([[3,4],[5,4]],1.25,'#dfc59b');line([[2.5,7],[3,9]],1,'#c2ce7f');
 }
};
function drawWorldPickup(k,X,Y,bob){
 const painter=PICKUP_ART[k.k];if(!painter)return false;
 const w=k.k==='sen'?8:10,h=k.k==='sen'?10:12;
 const art=propCanvas('pickup/'+k.k,w,h,painter),spin=k.k==='sen'?.38+.62*Math.abs(Math.cos(time*3+k.x)):1;
 ctx.drawImage(art,Math.round(X-w*spin/2),Math.round(Y-h+bob),w*spin,h);
 return true;
}

const BAG_MATERIAL=['#897163','#679073','#6589a9','#9474aa','#c5a466'];
function refreshBagArt(){
 for(let i=0;i<BAG_MATERIAL.length;i++){
  const s=BAGSPR[i],base=BAG_MATERIAL[i],w=s.w,h=s.h,x=w/2,y=h-1;
  s.hd=propCanvas('bag/'+i,w,h,H=>{
   const {poly,line,ink,stone}=H;
   poly([[x-2,2],[x+2,2],[x+2,h*.36],[w-2,h*.60],[w-2,y-1],[x+2,y],[2,y-1],[1,h*.62],[x-2,h*.36]],base);
   poly([[x+1,h*.35],[w-2,h*.61],[w-2,y-1],[x+1,y-1]],shade(base,-.31),false);
   line([[x-2,h*.38],[x-4,h*.67],[x-4,y-2]],1,shade(base,.30));
   line([[x-2,h*.32],[x+2,h*.32]],1,'#e5c38c');
   if(i>=2)stone(x,y-3,1.2,shade(base,.48));else ink(x,y-3,1,1,shade(base,.28));
  });
  const c=mk(w,h,g=>{g.imageSmoothingEnabled=false;g.drawImage(s.hd,0,0,w,h);});
  s.c=c;
 }
}
refreshBagArt();

function drawGateFrame(X,Y,kind){
 const lair=kind==='lair',w=lair?36:48,h=lair?37:49;
 usePropArt('gate/'+kind,w,h,X,Y,H=>{
  const {poly,line,stone,ink}=H,M=PROP_METAL,x=w/2;
  if(lair){
   poly([[3,h-3],[3,8],[7,5],[w-7,5],[w-3,8],[w-3,h-3]],'#58404a');
   for(let j=7;j<w-4;j+=5){
    line([[j,8],[j,h-4]],1.4,'#3c3040');line([[j+1,8],[j+1,h-4]],.8,'#86615c');
   }
   for(const y of [13,26]){
    line([[5,y],[w-5,y]],2,'#9a9194');line([[6,y-1],[w-6,y-1]],.7,'#ddd0b8');
   }
   poly([[x-5,8],[x+4,8],[x+5,22],[x-1,21],[x-5,23]],'#e7ceb1');
   line([[x,11],[x-1,15],[x+2,18]],1.4,'#ae6859');
   stone(x,27,3,M.gold);ink(x-.5,27,1,2,M.dark);
  }
  for(const d of [-1,1]){
   const lx=x+d*(lair?14:15);
   poly([[lx-2,8],[lx+2,8],[lx+2,h-1],[lx-3,h-1]],lair?M.rock:'#a85854');
   line([[lx-2,11],[lx-2,h-3]],1.25,lair?'#b8aeb1':'#e5a078');
  }
  poly([[2,3],[8,5],[w-8,5],[w-2,3],[w-4,9],[w-8,11],[8,11],[4,9]],M.dark);
  line([[4,5],[9,6],[w-9,6],[w-4,5]],1.5,M.gold);
  if(!lair)line([[7,15],[w-7,15]],2.7,'#a85854');
  stone(x,11,1.9,M.gleam);
 });
}

function drawCageFrame(X,Y){
 usePropArt('captive cage',30,39,X,Y+5,H=>{
  const {poly,line,stone}=H,M=PROP_METAL;
  poly([[1,7],[6,4],[24,4],[29,7],[26,10],[4,10]],M.wood);
  poly([[1,33],[6,30],[24,30],[29,33],[26,37],[4,37]],M.dark);
  for(let j=3;j<29;j+=5){
   line([[j,8],[j,33]],2.6,HERO_OUTLINE);line([[j,9],[j,32]],1.2,M.wood);
   if(j%2)line([[j-.7,10],[j-.7,31]],.5,'#bea181');
  }
  line([[3,24],[27,24]],1.5,'#a98a70');
  stone(15,23,2.4,M.gleam);
 });
}

const ICON_FINISH=new WeakMap();
function finishIcon(c){
 if(!ICON_FINISH.has(c))ICON_FINISH.set(c,finishWorldSprite({c,fw:c.width,fh:c.height,frames:1,sc:1}).hd);
 return ICON_FINISH.get(c);
}
function drawFacetedIcon(c,x,y,w=c.width,h=c.height){
 ctx.drawImage(finishIcon(c),x,y,w,h);
}
