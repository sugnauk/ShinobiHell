'use strict';
// Hero art is painted at 80×96, then sampled into a 40×48 game frame and a 20×24 thumbnail.
const HERO_FRAME={w:20,h:24,count:16};
const HERO_ART={
 wizard:        {cut:'robe',  head:'pilgrim', tool:'staff',   fabric:'#3b6484',night:'#343575',trim:'#e5bc74',spark:'#81eedc'},
 archer:        {cut:'coat',  head:'hood',    tool:'bow',     fabric:'#59673c',night:'#32734e',trim:'#c5cc82',spark:'#c0efaa'},
 samurai:       {cut:'armor', head:'kasa',    tool:'sword',   fabric:'#764841',night:'#9f3941',trim:'#e8ba72',spark:'#fce29c'},
 shinobi:       {cut:'gi',    head:'mask',    tool:'ninja',   fabric:'#424e65',night:'#41406f',trim:'#cf5872',spark:'#c5abf6'},
 onmyoji:       {cut:'robe',  head:'eboshi',  tool:'gohei',   fabric:'#bfb4a4',night:'#c7bcca',trim:'#a965ac',spark:'#e9d3fd'},
 gunner:        {cut:'coat',  head:'jingasa', tool:'gun',     fabric:'#64564b',night:'#8a4246',trim:'#e9a367',spark:'#ffd69a'},
 lancer:        {cut:'armor', head:'helm',    tool:'spear',   fabric:'#3b5e7e',night:'#3976a0',trim:'#9bd3e9',spark:'#effbff'},
 sumo:          {cut:'sumo',  head:'topknot', tool:'fists',   fabric:'#8a4053',night:'#aa444a',trim:'#ebd7ac',spark:'#fff2c2'},
 marionettist:  {cut:'robe',  head:'doll',    tool:'puppet',  fabric:'#62467c',night:'#76508e',trim:'#d39fe5',spark:'#ffdbf9'},
 tengu:         {cut:'coat',  head:'tengu',   tool:'feather', fabric:'#38615b',night:'#337b6d',trim:'#90cbbb',spark:'#d2f3db'},
 kagura:        {cut:'robe',  head:'dancer',  tool:'fans',    fabric:'#943f56',night:'#ba4b63',trim:'#edab78',spark:'#ffeabc'},
 bloodoracle:   {cut:'robe',  head:'oracle',  tool:'brush',   fabric:'#772b42',night:'#9e304e',trim:'#e7959d',spark:'#ffcecf'},
 bellwarden:    {cut:'robe',  head:'cowl',    tool:'bell',    fabric:'#71583a',night:'#926b38',trim:'#e2bd72',spark:'#ffe9a2'}
};
const HERO_POSES=[
 // body lean, bob, stride, main hand x/y relative to the shoulder, weapon angle
 [0,0,0,8,10,-1.28], [0,1,0,8,10,-1.38],
 [0,0,-3,7,11,-1.21], [1,1,-1,8,10,-1.42], [0,0,3,9,9,-1.55], [-1,1,1,7,10,-1.35],
 [-2,1,-2,-4,3,-2.70], [2,0,3,11,2,-.16],
 [-1,0,0,7,0,-1.56], [0,-1,0,7,-4,-1.32], [0,-1,-2,6,-7,-1.61], [3,3,4,8,3,-.24],
 [-2,1,-2,0,0,-2.43], [2,0,3,11,2,-.10], [1,2,1,9,12,.59], [-1,0,0,5,8,-1.24]
];
const HERO_OUTLINE='#171521',HERO_LEATHER='#493642',HERO_STEEL='#9daeba',HERO_LINEN='#e3d8bd';
const HERO_STRIKE_GRIP={gun:20,bow:24,sword:23,spear:21};
function heroPainter(g){
 const poly=(pts,c,edge=true)=>{
  g.beginPath();g.moveTo(...pts[0]);for(const point of pts.slice(1))g.lineTo(...point);g.closePath();
  if(edge){g.lineJoin='round';g.lineWidth=1.35;g.strokeStyle=HERO_OUTLINE;g.stroke();}
  g.fillStyle=c;g.fill();
 };
 const line=(points,width,c)=>{
  g.beginPath();g.moveTo(...points[0]);for(const point of points.slice(1))g.lineTo(...point);
  g.lineJoin='round';g.lineCap='round';g.lineWidth=width;g.strokeStyle=c;g.stroke();
 };
 const ink=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
 const stone=(x,y,r,c)=>poly([[x,y-r],[x+r,y],[x,y+r],[x-r,y]],c);
 return {g,poly,line,ink,stone};
}

function heroGarments(H,A,F){
 const {poly,line,ink,stone}=H,{cx:x,sy:y,final,back,level}=F;
 const {cut,base,shade1,light,trim,bright}=A;
 const w=cut==='sumo'?11:cut==='armor'?8:7;
 const left=x-w,right=x+w;
 const waist=y+12,hem=cut==='robe'?42:cut==='armor'?37:cut==='sumo'?34:35;
 const edge=cut==='robe'?4:cut==='sumo'?0:2;
 poly([[left+1,y],[right-2,y],[right,y+4],[right-2,waist],[right+edge,hem-2],[right,hem],
  [left-edge,hem],[left-1,hem-3],[left+1,waist],[left,y+5]],base);
 poly([[left+2,y+2],[x-2,y+1],[x-4,waist],[left-edge+2,hem-2],[left-edge,hem-2],[left+2,waist]],light,false);
 poly([[right-3,y+4],[right-1,y+5],[right-3,waist],[right+edge-1,hem-2],[x+1,hem],[x+3,waist]],shade1,false);
 if(back){
  line([[left+2,y+3],[x,y+6],[right-3,y+3]],1,shade1);
  line([[x,y+6],[x-1,hem-3]],1,light);
  if(level>=5)stone(x,y+8,2,trim);
 }else{
  line([[left+3,y+1],[x+3,waist],[x-1,hem-2]],1.5,trim);
  line([[right-4,y+1],[x,waist-4]],1,bright);
 }
 if(cut==='armor'){
  for(let row=0;row<3;row++){
   const yy=y+3+row*2.4;
   line([[left+1,yy],[right-1,yy]],1.2,shade1);
   for (const xx of [left+3,right-3])ink(xx,yy,1,1,trim);
  }
  for(let i=0;i<3;i++){
   const xx=x-7+i*5;
   poly([[xx,waist],[xx+4,waist],[xx+5,hem],[xx-1,hem]],i===1?light:base);
   line([[xx,hem-2],[xx+4,hem-2]],1,trim);
  }
 }
 if(cut==='robe'||cut==='coat'){
  line([[left-edge+2,hem-2],[x,hem-1],[right+edge-2,hem-2]],1,trim);
  if(final)for(const xx of [left-1,left+2,right-2])ink(xx,hem-5,1,2,bright);
 }
 line([[left+1,waist],[right-1,waist]],cut==='sumo'&&final?4:2.5,trim);
 line([[left+2,waist-.75],[right-2,waist-.75]],1,bright);
 if(cut==='sumo'){
  if(final)for(let i=-8;i<9;i+=3)line([[x+i,waist-1],[x+i+2,waist+1]],1,HERO_LEATHER);
  const apron=back?4:5;
  poly([[x-apron,waist+2],[x+apron,waist+2],[x+apron-1,hem+5],[x-apron+1,hem+5]],shade1);
  line([[x-apron+1,hem+4],[x+apron-1,hem+4]],1,trim);
  if(!back&&level>=5)stone(x,waist+5,1.7,bright);
  if(!back&&final)for(const d of [-1,1]){
   const xx=x+d*3;
   line([[xx,waist+2],[xx+1,waist+4],[xx,waist+6],[xx+1,waist+8]],1.1,'#f9efd9');
  }
 }else if(!back){
  poly([[x-2,waist-1],[x+2,waist-1],[x+2,waist+1],[x-2,waist+1]],bright);
 }
}

function heroHead(H,A,F){
 const {poly,line,ink,stone}=H,{cx:x,sy:shoulder,back,level,final}=F;
 const y=shoulder-10,{head,base,shade1,light,skin,hair,trim,bright,spark}=A;
 const hood=head==='hood'||head==='mask'||head==='doll'||head==='cowl';
 const face=head==='tengu'?'#c74c40':head==='doll'?'#f3e6f1':skin;
 const hairInk=head==='tengu'?'#e4e5d9':hair;
 poly([[x-5,y+1],[x-2,y-2],[x+4,y-2],[x+6,y+1],[x+6,y+7],[x+3,y+10],[x-2,y+10],[x-6,y+7]],back?hairInk:face);
 if(!back){
  poly([[x+2,y],[x+6,y+1],[x+6,y+7],[x+3,y+10],[x+1,y+8],[x+4,y+6]],shade(face,-.27),false);
  ink(x+1,y+4,2,1,head==='tengu'?bright:HERO_OUTLINE);
  if(head==='doll'){ink(x-3,y+4,2,1,HERO_OUTLINE);ink(x+4,y+7,1,1,trim);}
  else ink(x+3,y+7,2,1,shade(face,-.45));
 }
 if(hood){
  poly([[x-7,y+7],[x-7,y],[x-4,y-4],[x+2,y-5],[x+6,y-2],[x+7,y+2],[x+3,y],[x-3,y+1],[x-4,y+6],[x-2,y+10],[x-7,y+11]],shade1);
  line([[x-6,y],[x-3,y-3],[x+2,y-4]],1.3,light);
  if(back)line([[x+4,y-2],[x+4,y+7],[x+1,y+10]],1,trim);
  if(head==='mask'&&!back){
   poly([[x-3,y+6],[x+6,y+5],[x+4,y+10],[x,y+11],[x-4,y+9]],shade1);
   line([[x-3,y+6],[x+4,y+5]],1,light);
  }
  if(head==='hood'&&level>=5){
   poly([[x-7,y],[x-4,y-5],[x+3,y-6],[x+6,y-2],[x+9,y],[x+4,y+1]],base);
   line([[x-4,y-4],[x+2,y-5],[x+7,y-1]],1,final?bright:trim);
   if(final)poly([[x-4,y-4],[x-9,y-9],[x-9,y-13],[x-5,y-10],[x-2,y-5]],spark);
  }
  if(head==='mask'&&level>=5){
   line([[x-6,y-1],[x-1,y-3],[x+5,y-2]],1,trim);
   if(final)for(const d of [-1,1]){
    poly([[x+d*4,y-3],[x+d*6,y-8],[x+d*8,y-7],[x+d*7,y-2]],base);
    line([[x+d*6,y-7],[x+d*7,y-6]],1,spark);
   }
  }
  if(head==='cowl'){
   poly([[x-10,y+1],[x-7,y-3],[x+4,y-4],[x+9,y],[x+9,y+2],[x-9,y+3]],shade1);
   line([[x-9,y+1],[x+8,y]],1.25,trim);
   if(final)line([[x-8,y-9],[x-3,y-12],[x+3,y-12],[x+8,y-9]],1.5,bright);
  }
 }else{
  poly([[x-6,y+4],[x-6,y-1],[x-2,y-4],[x+4,y-3],[x+6,y],[x+1,y+1],[x-2,y+4],[x-3,y+9],[x-7,y+11]],hairInk);
  line([[x-5,y],[x-2,y-2],[x+2,y-2]],1,shade(hairInk,.22));
 }
 if(head==='pilgrim'||head==='kasa'||head==='jingasa'){
  const kabuto=head==='kasa'&&level>=5;
  const pointed=head==='pilgrim'&&level>=5;
  const top=pointed?-15:kabuto?-9:-7, brim=kabuto?3:0;
  poly([[x-10,y],[x-6,y-3],[x-3,y+top],[x+2,y+top],[x+6,y-4],[x+10,y],[x+8,y+brim+1],[x-8,y+brim+1]],head==='kasa'&&!kabuto?'#a97942':base);
  poly([[x-8,y-1],[x-4,y-3],[x-2,y+top+1],[x+1,y+top+1],[x+1,y-2]],head==='kasa'&&!kabuto?'#dbb778':light,false);
  line([[x-8,y],[x+7,y+brim]],1.2,trim);
  if(kabuto){
   for(const d of [-1,1]){
    poly([[x+d*5,y+1],[x+d*8,y-2],[x+d*8,y+8],[x+d*5,y+9]],shade1);
    line([[x+d*6,y+5],[x+d*7,y+5]],1,trim);
   }
   if(final)poly([[x-5,y-10],[x-2,y-7],[x,y-10],[x+2,y-7],[x+5,y-10],[x+3,y-4],[x-3,y-4]],bright);
  }else if(level>=5)stone(x,y-3,2,bright);
  if(pointed&&!back)poly([[x-2,y+6],[x+3,y+7],[x+3,y+11],[x-1,y+14],[x-4,y+11]],final?'#d5d9de':'#b49a8f');
 }
 if(head==='eboshi'){
  const peak=level>=5?-12:-7;
  poly([[x-6,y+1],[x-5,y-5],[x-2,y+peak],[x+2,y+peak],[x+5,y-4],[x+6,y+1]],hair);
  line([[x-4,y-1],[x-3,y-5],[x-1,y+peak+2]],1,light);
  line([[x-5,y],[x+5,y]],1.5,trim);
  if(final)stone(x,y-4,2,spark);
 }
 if(head==='helm'){
  poly([[x-7,y+4],[x-7,y-1],[x-4,y-6],[x+4,y-6],[x+7,y-1],[x+7,y+3],[x+3,y+2],[x-3,y+2]],base);
  line([[x-4,y-5],[x+3,y-5],[x+6,y-1]],1.4,trim);
  if(level>=5)poly([[x-1,y-5],[x-2,y-11],[x+4,y-9],[x+6,y-6],[x+2,y-6]],light);
 }
 if(head==='topknot'){
  poly([[x-4,y-3],[x-4,y-6],[x-1,y-8],[x+3,y-7],[x+4,y-4],[x+2,y-2]],hair);
  ink(x-2,y-6,3,1,trim);
 }
 if(head==='tengu'){
  if(!back)poly([[x+2,y+4],[x+10,y+4],[x+11,y+6],[x+4,y+7]],'#c74c40');
  poly([[x-3,y-3],[x-2,y-6],[x+1,y-6],[x+3,y-3]],shade1);
  line([[x-2,y-4],[x+2,y-4]],1,trim);
 }
 if(head==='dancer'||head==='oracle'){
  for(const d of [-1,1]){
   poly([[x+d*4,y-2],[x+d*7,y-1],[x+d*9,y+8],[x+d*6,y+13],[x+d*5,y+6]],hair);
   if(head==='dancer')line([[x+d*5,y-1],[x+d*7,y+3],[x+d*7,y+5]],1.2,trim);
  }
  if(head==='oracle'&&level>=5){
   stone(x,y-8,final?4:2,spark);
   if(final)for(const d of [-1,1]){
    poly([[x+d*6,y-7],[x+d*9,y-6],[x+d*9,y-2],[x+d*6,y-3]],HERO_LINEN);
    ink(x+d*7,y-5,1,2,trim);
   }
  }
 }
 if(head==='doll'||head==='dancer'||head==='cowl'){
  line([[x-6,y-1],[x,y-3],[x+6,y-1]],1,trim);
  if(level>=5)stone(x,y-3,final?3:2,bright);
 }
}

function heroEquipment(H,A,F){
 const {poly,line,ink,stone}=H,{cx:x,sy:y,back,level,final,frame}=F;
 const {base,shade1,light,trim,bright,spark,head,tool}=A;
 if(tool==='bow'||tool==='spear'){
  const bx=back?x+3:x-6;
  line([[bx-3,y-3],[bx+1,y+13]],4,HERO_OUTLINE);
  line([[bx-3,y-3],[bx+1,y+13]],2,tool==='bow'?HERO_LEATHER:bright);
  if(tool==='bow')for(let i=0;i<3;i++){
   line([[bx-5+i*2,y-10+i],[bx-3+i*2,y-2]],1,HERO_STEEL);
   ink(bx-5+i*2,y-10+i,1,3,trim);
  }
  else if(level>=5){
   poly([[bx-5,y-10],[bx+2,y-10],[bx+4,y+4],[bx-4,y+6]],shade1);
   line([[bx-4,y-9],[bx+1,y-9],[bx+3,y+3]],1.25,trim);
   if(final)stone(bx-1,y-4,2,bright);
  }
 }
 if(head==='tengu'||head==='mask'||head==='oracle'||head==='jingasa'){
  const ends=frame===11?[[-14,9],[-12,15]]:[[-9,15],[-10,19]];
  poly([[x-4,y],[x-9,y-2],[x+ends[0][0],y+ends[0][1]],[x+ends[1][0],y+ends[1][1]],[x-4,y+12]],shade1);
  line([[x-8,y],[x-10,y+8],[x+ends[1][0]+1,y+ends[1][1]-2]],1,light);
  if(head==='tengu'){
   for(let i=0;i<3;i++)line([[x-8+i*2,y+4],[x-12+i*2,y+14-i]],1.3,i%2?light:trim);
   poly([[x+2,y],[x+8,y-3],[x+12,y+6],[x+10,y+13],[x+4,y+9]],shade1);
   line([[x+7,y-1],[x+10,y+6],[x+8,y+10]],1,light);
  }
 }
 if(tool==='gun'&&back){
  poly([[x-5,y+2],[x+5,y+2],[x+7,y+11],[x-4,y+13]],HERO_LEATHER);
  line([[x-3,y+4],[x+4,y+3]],1.4,trim);
 }
 if(tool==='puppet'){
  const px=Math.max(4,x-12),py=y+(frame%2)*2;
  line([[px-3,py-7],[px+3,py-8]],2,HERO_LEATHER);
  for(const d of [-1,1])line([[px+d*3,py-7],[px+d*2,py+5]],.7,spark);
  poly([[px-2,py],[px+2,py],[px+2,py+4],[px-2,py+4]],HERO_LINEN);
  poly([[px-3,py+4],[px+3,py+4],[px+4,py+8],[px-4,py+8]],base);
  line([[px-2,py+8],[px-2,py+11]],1.4,trim);
  line([[px+2,py+8],[px+2,py+11]],1.4,trim);
 }
}

function heroTool(H,A,F,hx,hy,angle){
 const {g,poly,line,ink,stone}=H,{tool,trim,bright,spark,light}=A,{level,frame}=F;
 if(tool==='fists')return;
 g.save();g.translate(hx,hy);
 if(tool==='bow'){
  const pull=frame===6||frame===8||frame===12;
  line([[0,-10],[4,-6],[5,0],[4,6],[0,10]],3,HERO_OUTLINE);
  line([[0,-10],[4,-6],[5,0],[4,6],[0,10]],1.7,'#ad7848');
  line([[0,-10],[pull?-5:1,0],[0,10]],.8,HERO_LINEN);
  if(pull||frame===7||frame===13)line([[-5,0],[8,0]],1,bright);
  g.restore();return;
 }
 g.rotate(angle);
 const steel=tool==='ninja'?'#c3b3e5':HERO_STEEL;
 if(tool==='sword'||tool==='ninja'||tool==='spear'){
  const spear=tool==='spear',length=spear?17:tool==='ninja'?11:15;
  line([[spear?-12:-5,0],[spear?11:3,0]],3,HERO_OUTLINE);
  line([[spear?-11:-4,0],[spear?11:2,0]],1.7,HERO_LEATHER);
  const root=spear?10:3,wood=tool==='sword'&&level===0;
  poly([[root,-2.2],[length-3,-2],[length,0],[length-4,2],[root,1.5]],wood?'#9f7445':steel);
  line([[root,-1.6],[length-3,-1.4],[length-.6,-.2]],1,wood?bright:'#eef5f7');
  line([[root-1,-2.5],[root-1,2.5]],1.6,trim);
 }else if(tool==='gun'){
  poly([[-6,-1],[1,-1],[1,1],[-2,4],[-6,4]],'#9e6548');
  poly([[-1,-2],[12,-2],[12,1.5],[-1,1.5]],'#626e7d');
  line([[0,-1.5],[11,-1.5]],1,HERO_STEEL);
  for(const xx of [2,8])line([[xx,-2],[xx,2]],1,trim);
  if(frame===7||frame===13)poly([[13,0],[16,-3],[16,-1],[19,0],[16,1],[16,3]],bright,false);
 }else if(tool==='bell'){
  line([[-7,0],[3,0]],2.5,HERO_OUTLINE);
  line([[-6,0],[3,0]],1.3,trim);
  poly([[2,-2],[5,-4],[8,-4],[11,-6],[11,6],[8,4],[5,4],[2,2]],'#a67743');
  line([[5,-3],[9,-4],[10,-5]],1.3,bright);
  line([[9,-5],[9,5]],1.2,trim);
  ink(11,-.5,2,1,bright);
 }else if(tool==='fans'||tool==='feather'){
  poly([[0,0],[6,-6],[10,-4],[12,0],[10,4],[6,6]],tool==='fans'?trim:light);
  line([[2,0],[6,-5],[10,-3],[11,0]],1,bright);
  for(const yy of [-3,0,3])line([[2,0],[9,yy]],.8,HERO_LEATHER);
 }else {
  const length=tool==='staff'?13:tool==='puppet'?8:11;
  line([[-9,0],[length,0]],3,HERO_OUTLINE);
  line([[-8,0],[length,0]],1.5,'#ab805a');
  if(tool==='staff'){
   stone(length,0,3.5,spark);ink(length-1,-1,1,1,'#f4ffef');
  }else if(tool==='gohei'){
   for(const d of [-1,1])poly([[length-2,d],[length+1,d],[length-1,d*3],[length,d*4],[length-3,d*5]],HERO_LINEN);
  }else if(tool==='brush'){
   poly([[length-2,-2],[length+1,-2],[length+4,0],[length+1,2],[length-2,2]],spark);
  }else line([[length-2,-3],[length-2,3]],1.5,trim);
 }
 g.restore();
}

function paintHeroFrame(g,A,F){
 const H=heroPainter(g),{poly,line,ink,stone}=H;
 const {cx:x,sy:y,back,frame,stride,level,final}=F,{cut,base,shade1,light,trim,bright,skin}=A;
 const wide=cut==='sumo',shiko=wide&&frame===15,arm=wide?4.7:3.5,hip=wide?5:3.5;
 heroEquipment(H,A,F);
 for(const d of [-1,1]){
  const lifted=shiko&&d===1,fx=lifted?x+15:x+d*(hip+1)+stride*d,fy=lifted?29:47-(stride*d<0?2:0);
  const knee=lifted?[x+11,37]:[(x+d*hip+fx)/2,40];
  line([[x+d*hip,y+10],knee,[fx,fy-3]],wide?6:5,HERO_OUTLINE);
  line([[x+d*hip,y+10],knee,[fx,fy-3]],wide?4.5:3.6,d===1?base:shade1);
  line([[fx,fy-5],[fx,fy-2]],2.4,cut==='coat'?HERO_LINEN:light);
  poly([[fx-2,fy-3],[fx+2,fy-3],[fx+4,fy],[fx-2,fy]],HERO_LEATHER);
  ink(fx-1,fy-1,4,1,light);
 }
 const pull=A.tool==='bow'&&(frame===6||frame===8||frame===12);
 const raised=frame>=8&&frame<=10;
 const far=[[x-(wide?8:5),y+2],[x-(wide?11:8),y+6],[x-(wide?12:8)+(pull?7:0),y+(raised?3:10)]];
 line(far,arm+1.6,HERO_OUTLINE);line(far,arm,shade1);
 if(wide)stone(...far[2],2.3,HERO_LINEN);
 heroGarments(H,A,F);
 const strike=frame===7||frame===13;
 const hx=clamp(x+F.handX,6,strike?(HERO_STRIKE_GRIP[A.tool]||27):27);
 const hy=Math.max(A.tool==='staff'?17:14,y+F.handY);
 const near=[[x+(wide?8:5),y+2],[(x+hx)/2+4,y+(F.handY>3?6:1)],[hx,hy]];
 line(near,arm+1.6,HERO_OUTLINE);
 line(near,arm,base);
 line([[near[0][0]-1,near[0][1]-1],[near[1][0]-1,near[1][1]-1]],1.3,light);
 if(cut==='armor'){
  poly([[x+4,y],[x+9,y+1],[x+10,y+6],[x+5,y+5]],shade1);
  line([[x+5,y+1],[x+8,y+2]],1,trim);
 }
 if(A.tool==='gun'&&!back){
  line([[x-5,y+3],[x+3,y+10]],2,HERO_LEATHER);
  for(let i=0;i<3;i++)ink(x-4+i*2,y+4+i*2,1,2,bright);
 }
 heroHead(H,A,F);
 if(A.tool==='fans'){
  const [fx,fy]=far[2];heroTool(H,A,F,fx,fy,-2.1);
 }
 heroTool(H,A,F,hx,hy,F.angle);
 stone(hx,hy,wide?3:2.2,wide?HERO_LINEN:skin);
 ink(hx-1,hy-1,1,1,wide?bright:shade(skin,.25));
 if(final&&cut!=='armor'&&cut!=='sumo'&&A.head!=='eboshi'){
  for(const d of [-1,1])stone(x+d*7,y-1,1.4,bright);
 }
 if(level>=5&&(frame===9||frame===10)){
  for(const [dx,dy] of [[-10,-10],[10,-14],[13,1]])ink(x+dx,y+dy,1,1,A.spark);
 }
}

function buildHero16(cls,level,back,skin=0){
 const {w,h,count}=HERO_FRAME,scale=2,fw=w*scale,fh=h*scale;
 const look=HERO_ART[cls],ev=heroEV(cls,level),C=ev.C;
 const base=mixC(look.fabric,look.night,level/9),trim=skin===2?'#ffdfa1':skin===1?'#edb5ba':look.trim;
 const A={...look,base,trim,light:shade(base,.30),shade1:shade(base,-.37),bright:shade(trim,.30),
  skin:C.skin||'#d69d78',hair:cls==='wizard'?'#382933':'#241e2b'};
 const paint=mk(fw*2,fh*2,()=>{}),g=paint.getContext('2d',{willReadFrequently:true});
 const hd=mk(fw*count,fh,d=>{
  d.imageSmoothingEnabled=false;
  for(let frame=0;frame<count;frame++){
   const [lean,bob,stride,handX,handY,angle]=HERO_POSES[frame];
   g.clearRect(0,0,paint.width,paint.height);
   g.save();g.scale(2,2);
   paintHeroFrame(g,A,{cx:19+lean,sy:(look.cut==='sumo'?23:21)+bob,back,frame,stride,handX,handY,angle,level,final:level===9});
   g.restore();
   d.drawImage(paint,frame*fw,0,fw,fh);
  }
  // Remove partial coverage from brush edges so the silhouettes stay crisp against bright arena floors.
  const image=d.getImageData(0,0,fw*count,fh),pixels=image.data;
  for(let i=3;i<pixels.length;i+=4)pixels[i]=pixels[i]>=128?255:0;
  d.putImageData(image,0,0);
 });
 const c=mk(w*count,h,d=>{d.imageSmoothingEnabled=false;d.drawImage(hd,0,0,w*count,h);});
 return {c,wc:whiteOf(c),hd,hdWhite:whiteOf(hd),fw:w,fh:h,frames:count,sc:1};
}

function tintHeroSprite(sprite,filter){
 const tint=img=>mk(img.width,img.height,g=>{
  g.filter=filter;g.imageSmoothingEnabled=false;g.drawImage(img,0,0);
 });
 return {...sprite,c:tint(sprite.c),hd:tint(sprite.hd),_av:null};
}
