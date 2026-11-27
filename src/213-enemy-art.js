'use strict';
// Enemy uniforms use the hero painter so faces, cuffs, blades and layered cloth share the same pixel density.
const FOE_UNIFORM={
 ashigaru:['lancer','armor','kasa','spear'],archer:['archer','coat','kasa','bow'],
 samurai:['samurai','armor','kasa','sword'],ninja:['shinobi','gi','mask','ninja'],
 monk:['bellwarden','robe','cowl','spear'],shielder:['lancer','armor','helm','shield'],
 shaman:['wizard','robe','doll','staff'],sniper:['archer','gi','mask','bow'],
 assassin:['shinobi','coat','mask','ninja'],bandit:['gunner','gi','dancer','ninja'],
 jailer:['lancer','armor','helm','club'],brute:['sumo','sumo','oni','club'],
 bomber:['gunner','robe','hood','bomb'],priest:['onmyoji','robe','eboshi','gohei'],
 guardian:['lancer','armor','helm','shield'],blood:['bloodoracle','robe','oracle','brush'],
 gunner:['gunner','coat','jingasa','gun'],tengu:['tengu','coat','tengu','feather'],
 gaikotsu:['samurai','armor','skull','sword'],yamabushi:['bellwarden','robe','cowl','spear'],
 weaver:['marionettist','robe','doll','puppet'],seer:['archer','coat','kasa','bow'],
 orbiter:['wizard','robe','helm','staff'],splitter:['sumo','sumo','oni','bomb'],
 warden:['lancer','armor','helm','shield'],herald:['samurai','armor','eboshi','spear'],
};
const FOE_CREATURE={
 frog:'frog',wisp:'wisp',imp:'imp',shroom:'shroom',wraith:'ghost',spiderling:'spider',
 eggsac:'egg',shikigami:'paper',dummy:'dummy',turret:'turret',warbanner:'banner',
 kappa:'kappa',kasa:'umbrella'
};
const FOE_ATLAS=new Map();
function worldSprite(source,fw,fh,count,paint){
 const frame=mk(80,96,()=>{}),g=frame.getContext('2d');
 const hd=mk(fw*count*2,fh*2,atlas=>{
  atlas.imageSmoothingEnabled=false;
  for(let i=0;i<count;i++){
   g.clearRect(0,0,80,96);g.save();g.scale(2,2);paint(heroPainter(g),i);g.restore();
   atlas.drawImage(frame,fw*i*2,0,fw*2,fh*2);
  }
  const d=atlas.getImageData(0,0,atlas.canvas.width,atlas.canvas.height);
  for(let i=3;i<d.data.length;i+=4)d.data[i]=d.data[i]>=128?255:0;
  atlas.putImageData(d,0,0);
 });
 const c=mk(fw*count,fh,d=>{d.imageSmoothingEnabled=false;d.drawImage(hd,0,0,fw*count,fh);});
 return {...source,c,wc:whiteOf(c),hd,hdWhite:whiteOf(hd),fw,fh,frames:count,animal:true,ok:true};
}

function drawFoeBody(H,A,i,baseTool){
 const moving=i===1||i===2,raise=i===3,hit=i===4,brace=i===5;
 const b=i===1?1:0,lean=hit?2:raise?-1:0,wide=A.cut==='sumo';
 const sy=(wide?21:20)+b,x=18+lean;
 const handX=raise?0:hit?11:6,handY=raise?-2:hit?3:8;
 paintHeroFrame(H.g,A,{cx:x,sy,frame:hit?13:brace?14:raise?8:moving?i+1:0,
  stride:i===1?-2:i===2?2:hit?2:0,handX,handY,angle:raise?-2.1:hit?-.14:brace?.6:-1.21,
  back:false,level:baseTool==='sword'||A.cut==='armor'?6:3,final:false});
 const {poly,line,ink,stone}=H;
 if(baseTool==='shield'){
  const X=hit?29:25,Y=sy-(raise?6:1);
  poly([[X-5,Y],[X+2,Y-3],[X+8,Y],[X+7,Y+13],[X+3,Y+17],[X-4,Y+14]],'#8f6649');
  poly([[X+2,Y-2],[X+7,Y+1],[X+6,Y+12],[X+3,Y+16],[X+1,Y+14]],'#574347',false);
  line([[X-4,Y],[X+2,Y-2],[X+7,Y]],1.3,'#d3a576');
  line([[X-4,Y+11],[X+6,Y+11]],1,'#4a3940');stone(X+2,Y+6,3,A.trim);
 }else if(baseTool==='club'){
  const X=hit?31:29,Y=sy+(raise?-10:3);
  line([[X-5,Y+9],[X+3,Y-7]],4,HERO_OUTLINE);
  line([[X-5,Y+9],[X+3,Y-7]],2.5,'#85634e');
  poly([[X-3,Y-4],[X,Y-10],[X+5,Y-10],[X+7,Y-7],[X+3,Y],[X,Y+1]],'#5d6170');
  line([[X-2,Y-4],[X+1,Y-9],[X+4,Y-9]],1.25,'#a5a3aa');
  for(const [sx,yy] of [[-2,-7],[1,-3],[5,-7]])stone(X+sx,Y+yy,1.35,A.trim);
 }else if(baseTool==='bomb'){
  const X=x+handX+3,Y=sy+handY;
  poly([[X-5,Y+1],[X-3,Y-4],[X+3,Y-4],[X+6,Y+1],[X+4,Y+6],[X-3,Y+6]],'#563948');
  line([[X-3,Y],[X+4,Y]],1.6,'#d58254');
  line([[X,Y-4],[X+1,Y-7],[X+4,Y-8]],1.3,'#b9a178');stone(X+4,Y-8,1.25,'#ffb76b');
 }
 if(A.head==='oni'){
  for(const d of [-1,1])poly([[x+d*3,sy-13],[x+d*8,sy-20],[x+d*7,sy-11]],'#e4cea0');
  ink(x+1,sy-6,2,1,'#ffdb96');
 }
 if(A.head==='skull'){
  poly([[x-5,sy-13],[x+4,sy-14],[x+7,sy-10],[x+5,sy-4],[x+2,sy-2],[x-3,sy-4]],'#d9c8ab');
  ink(x-2,sy-9,2,2,HERO_OUTLINE);ink(x+3,sy-9,2,2,HERO_OUTLINE);
  for(const dx of [-1,1,3])ink(x+dx,sy-5,.65,2,'#675260');
 }
 if(A.head==='doll')line([[x-4,sy],[x+3,sy+1]],1,A.trim);
}

function drawFoeCreature(H,k,i,p){
 const {poly,line,ink,stone}=H,x=20,b=i%2,y=38-b*2;
 const color=p.c||'#754574',edge=shade(color,-.35),light=shade(color,.31),accent=p.a||'#e6c890';
 if(k==='frog'||k==='spider'){
  const spider=k==='spider',leg=spider?'#6d463e':edge;
  for(const d of [-1,1])for(let n=0;n<(spider?4:2);n++){
   const yy=y-3-n*3;
   line([[x+d*5,yy],[x+d*(11+n%2*2),yy-2+i%2],[x+d*(15+n%2),yy+5]],3,HERO_OUTLINE);
   line([[x+d*5,yy],[x+d*(11+n%2*2),yy-2+i%2],[x+d*(15+n%2),yy+5]],1.3,leg);
  }
  poly([[x-11,y-4],[x-8,y-13],[x+5,y-15],[x+11,y-10],[x+13,y-1],[x+7,y+6],[x-8,y+6]],spider?'#6f443d':color);
  poly([[x-9,y-3],[x+10,y-3],[x+8,y+4],[x-6,y+5]],spider?'#462e36':accent,false);
  line([[x-7,y-10],[x-3,y-13],[x+6,y-12]],1.5,light);
  for(const xx of [-5,5])stone(x+xx,y-9,spider?2.1:3,spider?'#eb765e':'#ffc66f');
  if(!spider){ink(x-5,y-10,1,2,HERO_OUTLINE);ink(x+5,y-10,1,2,HERO_OUTLINE);}
 }else if(k==='umbrella'||k==='kappa'){
  if(k==='umbrella'){
   line([[x,y-18],[x-2,y+3],[x+3,y+8]],3,'#ad8771');
   poly([[x-10,y+7],[x+7,y+7],[x+9,y+10],[x-11,y+10]],'#725557');
   poly([[x-16,y-11],[x-10,y-19],[x,y-24],[x+11,y-20],[x+17,y-11],[x+11,y-7],[x-9,y-7]],'#a45362');
   line([[x-14,y-12],[x-9,y-18],[x,y-22],[x+11,y-18],[x+15,y-12]],1.5,'#ebac9e');
   stone(x,y-14,5,'#f2dac2');stone(x+1,y-15,2,'#493448');
   line([[x+2,y-8],[x+4,y-4],[x+1,y+1]],2,'#d77b98');
  }else{
   poly([[x-15,y-3],[x-16,y-13],[x-10,y-19],[x-5,y-18],[x,y-8],[x-6,y+5],[x-12,y+4]],'#8a7454');
   line([[x-13,y-12],[x-10,y-16],[x-7,y-14],[x-6,y-9]],1.5,'#c2a375');
   poly([[x-5,y-11],[x+4,y-12],[x+10,y-5],[x+10,y+3],[x+3,y+8],[x-6,y+7]],'#6b986b');
   poly([[x-7,y-16],[x-5,y-24],[x+5,y-25],[x+10,y-19],[x+11,y-13],[x+4,y-10],[x-5,y-11]],'#7ca27a');
   line([[x-4,y-23],[x+5,y-24],[x+8,y-21]],1.4,'#e2e8bd');
   stone(x+5,y-17,2.2,'#e2e8bd');ink(x+6,y-17,1,1,HERO_OUTLINE);
   poly([[x+8,y-15],[x+15,y-14],[x+10,y-11],[x+7,y-12]],'#d9ae68');
  }
 }else if(k==='shroom'||k==='egg'){
  const egg=k==='egg';
  poly([[x-7,y+7],[x-10,y],[x-6,y-12],[x,y-16],[x+6,y-12],[x+10,y],[x+7,y+7]],egg?'#ab8e80':'#c7b4a0');
  if(!egg){
   poly([[x-14,y-7],[x-12,y-15],[x-6,y-22],[x+5,y-23],[x+12,y-16],[x+15,y-7],[x+8,y-4],[x-8,y-4]],color);
   line([[x-11,y-14],[x-6,y-20],[x+4,y-21],[x+10,y-16]],1.5,light);
  }
  for(const [dx,dy] of [[-4,-12],[1,-16],[6,-9]])stone(x+dx,y+dy,1.8,egg?'#e3c59c':accent);
  if(!egg){ink(x-4,y-1,2,2,'#542942');ink(x+4,y-1,2,2,'#542942');}
 }else if(k==='wisp'||k==='ghost'||k==='paper'||k==='imp'){
  const ice=k==='ghost',paper=k==='paper',imp=k==='imp';
  const mid=ice?'#91b8cc':paper?'#d2c8ac':imp?'#b44b46':'#b89463';
  poly([[x-12,y+2],[x-9,y-8],[x-7,y-18],[x,y-24],[x+7,y-20],[x+10,y-11],[x+13,y+2],[x+6,y+7],[x+3,y+4],[x-4,y+9],[x-7,y+3]],mid);
  poly([[x-8,y-7],[x-5,y-17],[x+2,y-21],[x+7,y-18],[x+1,y-16],[x-4,y-7],[x-8,y+2]],shade(mid,.32),false);
  poly([[x-5,y-12],[x-2,y-17],[x+6,y-15],[x+7,y-7],[x+3,y-4],[x-4,y-6]],shade(mid,-.56));
  ink(x-2,y-11,2,1.5,paper?'#d6755b':'#fff4d1');ink(x+3,y-11,2,1.5,paper?'#d6755b':'#fff4d1');
  if(imp)for(const d of [-1,1])poly([[x+d*4,y-17],[x+d*9,y-24],[x+d*9,y-16]],'#f4c9a0');
  if(paper)line([[x,y-3],[x-2,y],[x+1,y+2]],1.2,'#aa5d4d');
 }else{
  line([[x,y-26],[x,y+7]],4,HERO_OUTLINE);
  line([[x,y-26],[x,y+7]],2,'#a27d59');
  poly([[x-11,y+5],[x+10,y+5],[x+12,y+8],[x-12,y+8]],'#6b5260');
  if(k==='banner'){
   poly([[x-2,y-26],[x+15,y-24],[x+12,y-8],[x+4,y-10],[x-2,y-9]],'#aa4c49');
   line([[x,y-24],[x+14,y-22]],1.2,'#e1b579');stone(x+7,y-17,3,'#eac998');
  }else if(k==='dummy'){
   poly([[x-7,y-17],[x+8,y-18],[x+10,y-4],[x-10,y-3]],'#a9875d');
   for(let j=0;j<3;j++)line([[x-7,y-14+j*3],[x+7,y-14+j*3]],1,'#cbb489');
   stone(x,y-23,5,'#c1a177');
  }else{
   poly([[x-8,y-22],[x-5,y-26],[x+6,y-26],[x+9,y-22],[x+7,y-11],[x-7,y-11]],'#5c4665');
   stone(x,y-19,4,i?'#ead1ff':'#b998e1');line([[x-7,y-14],[x+7,y-14]],1.25,'#c39369');
  }
 }
}

{const previous=getSpr;getSpr=function(type,di){
 const U=FOE_UNIFORM[type],creature=FOE_CREATURE[type],animal=DUNGEON_FAUNA[type];
 if(!U&&!creature&&!animal)return previous.apply(this,arguments);
 const key=type+'/'+di;
 if(FOE_ATLAS.has(key))return FOE_ATLAS.get(key);
 const source=previous.apply(this,arguments);
 const p=typePal(type,DUN[di]||DUN[0]);
 let art;
 if(U){
  const [,cut,head,tool]=U,base=p.c||'#6b5967',trim=p.a||'#dcb181',look=HERO_ART[U[0]];
  const A={...look,cut,head,tool:['club','shield','bomb'].includes(tool)?'fists':tool,
   base,trim,shade1:shade(base,-.34),light:shade(base,.31),bright:shade(trim,.3),
   hair:p.h||'#332b36',skin:p.s||'#d39b78',spark:trim};
  const w=cut==='sumo'?30:26,h=cut==='sumo'?32:29;
  art=worldSprite(source,w,h,6,(H,i)=>drawFoeBody(H,A,i,tool));
  art.foePoses=true;
 }else if(animal){
  art=worldSprite(source,source.fw,source.fh,4,(H,i)=>paintDungeonAnimal(H,type,animal,i));
 }else{
  const [w,h]=creature==='spider'?[14,10]:creature==='egg'?[14,12]:creature==='wisp'?[14,17]:[source.fw,source.fh];
  art=worldSprite(source,w,h,2,(H,i)=>drawFoeCreature(H,creature,i,p));
 }
 FOE_ATLAS.set(key,art);return art;
};}

const DUNGEON_FAUNA={
 boar:['beast','#80605a','#c69a75'],rat:['beast','#786779','#c29190'],tanuki:['beast','#997966','#d0b195'],
 monkey:['beast','#987260','#d4a182'],wolf:['beast','#788998','#cbd0cb'],kitsune:['beast','#be7858','#f0c093'],
 stag:['beast','#93715c','#d4b38a'],salamander:['crawler','#b77259','#f2b778'],viper:['crawler','#6f935f','#ccc187'],
 centipede:['crawler','#ad6156','#eea677'],toad:['toad','#78965e','#d7cb8c'],crab:['shell','#b96858','#e3a87c'],
 beetle:['shell','#577f71','#a9bf8b'],hornet:['shell','#a38c5c','#e7cc7f'],
 crane:['bird','#d2cdba','#fff1cb'],bat:['bird','#655373','#c08abd'],raven:['bird','#53596e','#ac889f'],owl:['bird','#8c725f','#dec197']
};
function paintDungeonAnimal(H,name,profile,frame){
 const [kind,c,a]=profile,L=shade(c,.31),D=shade(c,-.31),x=20,y=35+(frame%2);
 const {poly,line,ink,stone}=H;
 if(kind==='beast'){
  const long=name==='wolf'||name==='kitsune'||name==='stag',upright=name==='tanuki'||name==='monkey',step=[0,2,0,-2][frame];
  const ht=upright?13:9,right=long?33:31,earX=right-3;
  for(let i=0;i<4;i++){
   const xx=12+i*5,foot=xx+(i%2?step:-step),down=upright&&i%3===1?3:0;
   line([[xx,y-1],[foot,y+10-down]],3,HERO_OUTLINE);line([[xx,y],[foot,y+9-down]],1.4,i%2?L:D);
  }
  poly([[6,y-4],[10,y-ht],[19,y-ht-2],[26,y-ht],[30,y-4],[30,y+4],[22,y+6],[10,y+5]],c);
  poly([[8,y-5],[12,y-ht+1],[22,y-ht],[26,y-7],[20,y-4],[11,y]],L,false);
  poly([[9,y+1],[17,y+3],[29,y-1],[29,y+4],[23,y+6],[11,y+5]],D,false);
  if(name==='rat'||name==='monkey')line([[9,y],[4,y-3],[2,y-8],[5,y-11]],1.4,a);
  else poly([[12,y+1],[5,y-1],[2,y-9],[5,y-10],[10,y-6]],name==='kitsune'?a:D);
  poly([[24,y-ht],[earX,y-ht-4],[right+1,y-ht],[right+3,y-6],[right+6,y-4],[right+2,y],[28,y]],c);
  if(name==='stag')for(const d of [-1,1])line([[earX+d*2,y-ht-2],[earX+d*4,y-ht-9],[earX+d*2,y-ht-12]],1.4,a);
  else if(name==='boar')line([[right+2,y-3],[right+3,y-7]],1.6,a);
  else line([[earX,y-ht-2],[earX+2,y-ht+.5]],1.4,a);
  ink(right-2,y-ht+1.5,1.5,1.4,'#ffe1ac');ink(right+3,y-5,1.4,1.5,HERO_OUTLINE);
 }else if(kind==='bird'){
  const bat=name==='bat',crane=name==='crane',owl=name==='owl',rise=frame%2?8:3;
  if(crane||owl)for(const d of [-1,1])line([[x+d*3,y],[x+d*4,y+10],[x+d*6,y+10]],1.6,'#a48063');
  for(const s of [-1,1]){
   const dx=x+s*(bat?17:15);
   poly([[x+s*4,y-10],[dx,y-10-rise],[dx-s*2,y-4],[dx-s*5,y-6],[dx-s*6,y-1],[x+s*5,y+1]],D);
   line([[x+s*5,y-9],[dx-s*4,y-7-rise],[dx-s*.8,y-10-rise]],1.3,L);
   for(const off of [5,8,11])line([[x+s*off,y-8-rise*.45],[x+s*(off-1),y-3]],.9,c);
  }
  poly([[x-7,y-9],[x-4,y-14],[x+5,y-14],[x+8,y-9],[x+7,y+1],[x,y+5],[x-7,y+1]],c);
  const yy=crane?y-23:y-15;
  if(crane)line([[x+2,y-10],[x+8,y-18],[x+8,yy]],3,L);
  else if(bat||owl)for(const d of [-1,1])poly([[x+d*3,yy],[x+d*7,yy-5],[x+d*6,yy+3]],D);
  stone(x+(crane?8:3),yy+1,3.6,L);
  ink(x+(crane?9:4),yy,1.3,1.2,bat?'#ed9ca7':HERO_OUTLINE);
  if(!bat)poly([[x+(crane?10:5),yy+2],[x+(crane?16:10),yy+3],[x+(crane?10:5),yy+5]],a);
 }else if(kind==='crawler'){
  const snake=name==='viper',many=name==='centipede';
  const pts=Array.from({length:6},(_,i)=>[4+i*5,y-Math.sin(i*1.9+frame)*3-(i===5?6:0)]);
  if(!snake)for(let i=1;i<5;i++)line([pts[i],[pts[i][0]-2,y+6+(i+frame)%2]],2.2,D);
  line(pts,many?7:6,HERO_OUTLINE);line(pts,many?5.4:4.3,c);
  for(let i=1;i<5;i++)ink(pts[i][0]-1,pts[i][1]-1.3,2,1.2,i%2?L:a);
  poly([[25,y-8],[31,y-12],[36,y-9],[37,y-4],[32,y-2],[26,y-5]],c);
  line([[29,y-10],[34,y-9]],1.25,L);ink(33,y-8,1.3,1.3,'#f9dea4');
 }else{
  const crab=name==='crab',wasp=name==='hornet';
  for(const d of [-1,1])for(let i=0;i<3;i++){
   line([[x+d*5,y-3-i*3],[x+d*12,y-2-i*3],[x+d*(14+i),y+6]],2.1,D);
   if(wasp&&i===0)poly([[x+d*6,y-8],[x+d*14,y-18+frame%2*3],[x+d*17,y-13],[x+d*9,y-5]],'#c1b8a5');
  }
  if(crab)for(const d of [-1,1])poly([[x+d*10,y-3],[x+d*16,y-8],[x+d*18,y-10],[x+d*18,y-4],[x+d*16,y-1]],c);
  poly([[x-12,y-3],[x-10,y-11],[x-5,y-15],[x+6,y-14],[x+10,y-9],[x+12,y-2],[x+7,y+5],[x-8,y+5]],c);
  poly([[x-10,y-5],[x-8,y-10],[x-4,y-13],[x+5,y-12],[x,y-8]],L,false);
  line([[x,y-12],[x+1,y+3]],1.25,D);
  for(const d of [-1,1]){stone(x+d*4,y-8,1.8,a);ink(x+d*4,y-8,1,1,HERO_OUTLINE);}
 }
}
