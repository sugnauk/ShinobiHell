'use strict';
// Stage XVI alternate. Wet lacquer carries movement. Once cured, the raised strips stop shots.
const LAC={name:'NEBARI, THE LACQUER MASTER',warm:'#ffd095',red:'#c3483c',trails:[],presses:[],teach:null};
const LAC_RELIC={id:'lacquerseal',name:'LACQUER SEAL',d:'PERFECT DODGE: HEAVY HITS DEAL +25% DAMAGE FOR 4 SECONDS',g:'L',fx:'power',mo:'vortex'};
function lacquerTrail(x,y,r,wet,life,room){
 const t={x,y,r,wet,life,room};
 LAC.trails.push(t);
 if(LAC.trails.length>72)LAC.trails.shift();
 return t;
}
function lacquerContains(t,x,y){return (t.x-x)**2+(t.y-y)**2<t.r*t.r;}
{const base=playerMoveVec;playerMoveVec=function(p,dt){
 const [mx,my]=base(p,dt);
 if(R?.di!==NEB_I||boss?.name!==LAC.name)return [mx,my];
 const wet=LAC.trails.some(t=>t.wet>0&&lacquerContains(t,p.x,p.y));
 if(!wet||p.dash>0||p.stag>0){p.lacVX=mx;p.lacVY=my;return [mx,my];}
 const k=1-Math.exp(-dt*10);
 p.lacVX=(p.lacVX??mx)+(mx-(p.lacVX??mx))*k;
 p.lacVY=(p.lacVY??my)+(my-(p.lacVY??my))*k;
 return [p.lacVX,p.lacVY];
};}
{const base=projectileCover;projectileCover=function(q,x,y){
 if(base(q,x,y))return true;
 if(R?.di!==NEB_I||boss?.name!==LAC.name)return false;
 const dx=q.x-x,dy=q.y-y,length2=dx*dx+dy*dy;
 return LAC.trails.some(t=>{
  if(t.wet>0)return false;
  const f=length2?clamp(((t.x-x)*dx+(t.y-y)*dy)/length2,0,1):0;
  return lacquerContains(t,x+f*dx,y+f*dy);
 });
};}
function lacquerStroke(e,room,x,y,axis,count,tele,r,damage){
 const half=!!e?.half,span=(count-1)*r*.6;
 const inset=r+2;
 x=clamp(x,room.x0+inset+(axis==='x'?span:0),room.x1-inset-(axis==='x'?span:0));
 y=clamp(y,room.y0+inset+(axis==='y'?span:0),room.y1-inset-(axis==='y'?span:0));
 if(e){
  // The arena is octagonal. Pull the whole row inward at corners rather than clipping individual dabs.
  const hx=(room.x1-room.x0)/2,hy=(room.y1-room.y0)/2,cx=room.cx,cy=room.cy;
  const limit=1.37-span/(axis==='x'?hx:hy)-r*Math.hypot(1/hx,1/hy);
  const distance=Math.abs(x-cx)/hx+Math.abs(y-cy)/hy;
  if(distance>limit){x=cx+(x-cx)*limit/distance;y=cy+(y-cy)*limit/distance;}
 }
 const marks=[];
 for(let i=0;i<count;i++){
  const offset=(i-(count-1)/2)*r*1.2;
  const px=axis==='x'?x+offset:x,py=axis==='y'?y+offset:y;
  marks.push(mark({k:'c',x:px,y:py,r,t:tele,src:e,col:half?LAC.warm:LAC.red,dmg:damage,
   lacquer:true,quiet:true,on(){
    lacquerTrail(px,py,r,half?0:3.1,half?8:9,e?.room??room.room);
   }}));
 }
 return marks;
}
function lacquerBounds(r){return {x0:(r.x+1)*T,y0:(r.y+1)*T,x1:(r.x+r.w-1)*T,y1:(r.y+r.h-1)*T,room:r};}
function lacquerRooms(){
 LAC.trails.length=0;LAC.presses.length=0;LAC.teach=null;LAC.told=false;
 if(R.di!==NEB_I||boss?.name!==LAC.name)return;
 const rooms=map.rooms.filter(r=>r.k==='room'&&r.type==='combat').sort((a,b)=>a.ord-b.ord);
 LAC.teach=rooms[0];
 if(LAC.teach){
  // The first room is a workshop with test strips. Preserve one foe so normal room completion still triggers.
  const foes=enemies.filter(e=>e.room===LAC.teach&&!e.prop&&!e.boss);
  foes.sort((a,b)=>a.spd-b.spd).slice(1).forEach(e=>{e.dead=true;});
  const c=roomCenter(LAC.teach);
  for(const i of [-1,0,1])lacquerTrail(c.x+i*24,c.y-18,17,Infinity,Infinity,LAC.teach);
  for(const i of [-1,0,1])lacquerTrail(c.x+i*24,c.y+24,17,0,Infinity,LAC.teach);
 }
 for(const r of rooms.slice(1)){
  const c=roomCenter(r);
  LAC.presses.push({room:r,x:c.x,y:c.y,t:2.1});
 }
 if(map.approach){
  const r=map.approach,c=roomCenter(r);
  lacquerTrail(c.x,c.y,14,0,Infinity,r);
 }
}
{const base=updPlay;updPlay=function(dt){
 if(R?.di===NEB_I&&boss?.name===LAC.name){
  for(let i=LAC.trails.length-1;i>=0;i--){
   const trail=LAC.trails[i];trail.life-=dt;trail.wet=Math.max(0,trail.wet-dt);
   if(trail.life<=0)LAC.trails.splice(i,1);
  }
  if(LAC.teach&&!LAC.told&&inRoom(LAC.teach,P.x,P.y,0)){
   LAC.told=true;setToast('WET LACQUER CARRIES YOU. HARD LACQUER STOPS SHOTS.',LAC.warm,4);
  }
  for(const press of LAC.presses){
   if(!inRoom(press.room,P.x,P.y,2))continue;
   press.t-=dt;
   if(press.t<=0){
    press.t=5;
    lacquerStroke(null,lacquerBounds(press.room),press.x,press.y,'x',2,1.25,15,9);
   }
  }
 }
 return base.apply(this,arguments);
};}
{const base=drawBossFloor;drawBossFloor=function(){
 base.apply(this,arguments);
 if(!LAC.trails.length||R?.di!==NEB_I)return;
 ctx.save();worldXf();
 for(const t of LAC.trails){
  const wet=t.wet>0;
  ctx.globalAlpha=Math.min(1,t.life/.35);
  ctx.fillStyle=wet?'#641f29':'#281824';
  ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,TAU);ctx.fill();
  ctx.strokeStyle=wet?'#e17b53':'#d0a798';ctx.lineWidth=wet?1.5:2;
  ctx.beginPath();ctx.arc(t.x,t.y,t.r-.5,0,TAU);ctx.stroke();
  ctx.strokeStyle=wet?'#f5a16b':'#735063';
  ctx.beginPath();ctx.arc(t.x-2,t.y-2,t.r*.59,3.22,5.18);ctx.stroke();
  if(!wet){ctx.beginPath();ctx.moveTo(t.x-8,t.y+4);ctx.lineTo(t.x+8,t.y-3);ctx.stroke();}
 }
 ctx.restore();
};}

defDeco('lacquerstand',16,21,R=>{
 R(1,17,14,3,'#332431');R(3,7,10,11,'#603438');R(4,5,8,2,'#c37d55');
 R(5,1,6,4,'#924537');R(6,1,2,12,'#df9865');R(3,12,10,2,'#1c1120');
},{glow:{c:'#d77954',y:-12,r:8}});
function lacquerFloor(g,r,cx,cy,x,y,X,Y){
 const h=hash(x*17,y*5);
 g.fillStyle=h<.5?'#38262a':'#594044';g.fillRect(X-7,Y+8+(x&1),13,1);
 if(h>.72){g.fillStyle='#99635a';g.fillRect(X-4,Y+6,8,1);}
}
const LAC_STAGE={base:FERRY_STAGE,remix:false,indoor:true,
 story:'THE PALACE LACQUER WORKS - WATCH THE FLOOR AS THE COAT SETS',
 tale:'THE FLOOD LEFT THE IMPERIAL WORKS INTACT. THE LACQUER MASTER STILL COATS THE PLATES ON WHICH THE EMPEROR STAMPED HIS ORDERS.',
 scn:{gr:['#251622','#3f2430'],seal:'tomoe',wall:'temple'},scatter:[['lacquerstand',4],['sunkjar',3]],
 t:{
  DUN:{name:'THE PALACE LACQUER WORKS',fl:['#35242b','#40292f'],sp:'#281923',wt:'#1d111b',wf:'#5d383d',we:'#b67b60',
   cloth:'#704344',dark:'#281522',acc:LAC.red,pool:['seer','crab','warden','splitter','herald','orbiter','frog','seer']},
  ENV:{k:'planks',liq:0,amt:0,lc:['#180f18','#422632','#91604f'],wall:'temple',fl:['#35242b','#40292f'],sp:'#281923'},
  ROMAN:'XVI',STAGEDECO:[['lacquerstand',6],['sunkjar',5],['offering',1]],
  DECO_GROUPS:[[['lacquerstand',-13,0],['sunkjar',0,4],['lacquerstand',13,0]]],
  FLOORART:lacquerFloor,MOOD:['#1b0e17',.32],PSTAGE:['insen',46,64],BMUSIC:{s:'insen',r:46,b:128,w:'triangle'},
  TRAILS:{n:'RED LACQUER',c:LAC.red,c2:LAC.warm},BOSS_HPT:24,POOLADD:[],PMAP:[.97,.04],
  MASTER_LINES:'THE FINAL COAT SETS. BEYOND THE WORKS, A BLUE LIGHT SHINES THROUGH THE WATER.',
  BOSSRELIC:LAC_RELIC,
  BOSS:{name:LAC.name,hp:2700,hat:'kasa',pref:74,spd:39,r:11,k1:[],k2:[],pal:basePal('#7c343b','#27212d',LAC.warm,'#190f19')},
  BSTYLE:{c:LAC.red,t:['THE WET COAT','FLASH CURE','FINAL COAT'],ph:[[{pat:'aimedring',cnt:12,sp:48,col:LAC.red}],[{pat:'gapring',cnt:16,sp:52,col:LAC.warm}]]},
  BMODES:['circle','chase'],BMOTIF:[0,2,5,3,0,null,5,3,2,0,null,0,2,0,null]
 }};

const lacquerArms=[[[25,27],[19,39],[23,48]],[[45,27],[52,36],[51,45]]];
const lacquerArt=hiArt((H,Q)=>{
 const {by,two}=H,cx=70,far=(Q.far||lacquerArms[0]).map(H.pt),near=(Q.near||lacquerArms[1]).map(H.pt);
 const tunic='#343541',lit='#505261',red=two?'#7f333b':'#a94d42',light=two?'#e48867':'#cc7760',belt='#756050',skin='#c0997b';
 HIP.legs(H,Q,cx,101,([hp,kn,ft])=>{HIP.leg(H,hp,kn,ft,tunic,'#242531','#867567',13);
  H.rect(ft[0]-7,ft[1]-10,14,3,'#e0d7ba');});
 // Tool rack and rolled sleeve cuffs give his working clothes a distinct outline.
 H.poly([[43,75+by],[65,79+by],[59,110],[41,104]],'#59433d');
 H.ln(46,82+by,59,85+by,2,'#ae8262');
 H.poly([[48,49+by],[90,48+by],[99,100],[46,103]],tunic);
 H.fill([[50,50+by],[63,51+by],[60,99],[48,99]],lit);
 H.poly([[51,62+by],[85,58+by],[91,114],[46,114]],red);
 H.fill([[55,64+by],[72,62+by],[68,111],[50,111]],two?'#482332':'#8c383c');
 if(two){
  for(const [x,y,w] of [[53,65,25],[61,88,23],[52,97,20]]){
   H.poly([[x,y+by],[x+w,y+by-1],[x+w-4,y+by+7],[x+1,y+by+9]],'#592636');
   H.ln(x+2,y+by+1,x+w-3,y+by,2,'#d58965');
   H.ln(x+5,y+by+4,x+w-9,y+by+3,1,'#a45951');
  }
 }
 H.ln(85,64+by,88,112,2,light);H.ln(47,112,89,112,2,light);
 H.ln(47,83,92,80,5,belt);H.rect(66,80,9,5,'#d49c6d');
 H.ln(52,63+by,52,50+by,4,'#ac876d');H.ln(82,60+by,87,49+by,4,'#ac876d');
 for(const [x,y] of [[56,90],[62,97],[78,101],[82,92],[72,108]]){
  H.rect(x,y,3,2,two?'#ecb68a':'#692333');if(two)H.rect(x+1,y-2,2,1,'#e3a05e');
 }
 H.limb(far,13,tunic,lit);HIP.hand(H,...far[2],'#725644');
 H.limb(near,13,tunic,lit);
 const [x,y]=near[2],a=Q.la??-1.42,ca=Math.cos(a),sa=Math.sin(a),nx=-sa,ny=ca;
 const len=Q.ll??Math.min(52,(y-18)/Math.max(.3,-sa));
 const tx=x+ca*len,ty=y+sa*len;
 HIP.pole(H,x,y,a,Math.min(43,146-y),len,6,'#6f4939');
 H.poly([[tx-nx*5,ty-ny*5],[tx+nx*5,ty+ny*5],[tx+ca*12+nx*9,ty+sa*12+ny*9],
  [tx+ca*12-nx*9,ty+sa*12-ny*9]],two?'#c36861':'#b4bcc0');
 H.ln(tx+ca*10-nx*7,ty+sa*10-ny*7,tx+ca*10+nx*7,ty+sa*10+ny*7,2,'#fae4c8');
 HIP.hand(H,x,y,'#795d52');
 const hy=33+by;
 H.ell(cx,hy,14,17,two?'#262130':'#3d3036');H.ell(cx,hy+4,11,12,skin,0);
 H.poly([[cx-12,hy+2],[cx+11,hy+2],[cx+12,hy+13],[cx+2,hy+16],[cx-10,hy+11]],'#ddd1bb');
 H.ln(cx-10,hy+6,cx+10,hy+6,2,'#9d928e');
 H.rect(cx-10,hy-2,20,4,two?'#422335':'#71605c');
 H.rect(cx-8,hy-1,4,2,two?'#ffd398':'#211d2a');H.rect(cx+4,hy-1,4,2,two?'#ffd398':'#211d2a');
 H.poly([[cx-18,hy-6],[cx-11,hy-13],[cx+12,hy-14],[cx+18,hy-6],[cx+9,hy-4],[cx-11,hy-4]],two?'#532c40':'#884439');
 H.ln(cx-12,hy-7,cx+13,hy-8,3,'#d18c61');
 if(two){H.ln(cx-7,hy-13,cx-3,hy-7,2,'#ffd094');H.ln(76,65,84,71,2,'#ffb77a');}
});
humBoss(LAC.name,lacquerArt,{idle0:{},idle1:{b:1},atk:{legs:'lunge',near:[[45,27],[53,26],[51,33]],far:[[25,27],[23,33],[27,43]],la:-.37,ll:24}},
 {sc:1.1});
hiPoses(LAC.name,lacquerArms);
Object.assign(BART[LAC.name].posed.poses.wind,{la:-2.48,ll:31});
Object.assign(BART[LAC.name].posed.poses.follow,{near:[[45,27],[51,35],[54,44]],la:.72,ll:19});

function lacquerSweep(axis){
 return {n:axis==='x'?'LACQUER SWEEP':'CROSS COAT',wt:axis==='x'?4:2,gap:1.8,run(e,A){
  if(at(A,0)){
   e.tele=1;sfx('tool');
   A.marks=lacquerStroke(e,arenaOf(e),P.x,P.y,axis,3,1.24,18,14*e.dm);
   A.aim=aimAt(e)+(axis==='x'?.24:-.24);
  }
  if(at(A,1.24)){
   e.tele=0;sfx('spearSteel');
  }
  if(at(A,1.85))lateFan(e,{a:A.aim,n:9,step:.17,gap:.27,sp:e.half?86:55,col:LAC.warm,life:1.4});
  if(at(A,2.28)){e.lacOpen=1.7;txtFx(e.x,e.y-18,'TOOL STUCK',LAC.warm,1.25);}
  return A.t>2.4;
 },end(e,A){for(const m of A.marks??[]){const i=BMK.indexOf(m);if(i>=0&&!m.fired)BMK.splice(i,1);}}};
}
const lacquerPicks=BART[LAC.name].posed;
const lacquerIdlePose=lacquerPicks.pick;
lacquerPicks.pick=(e,indices)=>e.A&&!e.phx?null:lacquerIdlePose(e,indices);
BKIT[LAC.name]={director:bossDirector,noContact:true,pref:74,gap:1.1,halfName:'THE COAT SETS ON CONTACT',
 guide:['WET LACQUER CARRIES YOUR MOMENTUM. CURED LACQUER STOPS BOTH SIDES’ SHOTS.',
  'LACQUER SWEEP: LEAVE THE ROW SIDEWAYS. READ THE SPLATTER, THEN STRIKE WHILE HE FREES HIS TOOL.',
  'FORM TWO: THE SWEEP CURES ON IMPACT. LEAD IT AWAY FROM YOUR FIRING LANE.'],
 atks:[lacquerSweep('x'),Object.assign(lacquerSweep('y'),{half:1}),
  {n:'BRUSH SPLATTER',wt:2,gap:1.1,run(e,A){
   if(at(A,0)){e.tele=1;A.angle=aimAt(e);}
   if(at(A,.64)||at(A,.92)){e.tele=0;bfan(e,e.x,e.y,A.angle,5,.9,111,8,{r:3,spr:'bgrain',col:LAC.warm,life:2});sfx('shoot');}
   return A.t>1.1;
  }},
  {n:'EDGE COAT',wt:2,gap:1,run(e,A){
   if(at(A,0)){
    e.tele=1;const a=aimAt(e);
    A.marks=lacquerStroke(e,arenaOf(e),e.x+Math.cos(a)*58,e.y+Math.sin(a)*58,'y',1,1.15,28,13*e.dm);
   }
   if(at(A,1.15))e.tele=0;return A.t>1.4;
  },end(e,A){for(const m of A.marks??[]){const i=BMK.indexOf(m);if(i>=0&&!m.fired)BMK.splice(i,1);}}}],
 onHalf(e){for(const t of LAC.trails)if(t.room===e.room)t.wet=0;},
 move(e,dt,d,a){if(e.lacOpen>0){e.lacOpen-=dt;e.gapT=Math.max(e.gapT,e.lacOpen+.03);return;}defaultMove(e,dt,d,a,BKIT[LAC.name]);},
 dmgMod(e){return e.lacOpen>0?1.2:1;},
 events:[{at:.27,dur:10,name:'FINAL COAT',hint:'STEP OFF EACH MARKED ROW',survival:true,storm:1,ownPressure:true,
  tick(e,dt,E){for(const [i,t] of [.6,3.35,6.4].entries()){
   if(at(E,t)){E.aim=aimAt(e);lacquerStroke(e,arenaOf(e),P.x,P.y,i%2?'y':'x',3,1.24,18,12*e.dm);}
   if(at(E,t+1.85))lateFan(e,{a:E.aim,n:9,step:.18,gap:.3,sp:60,col:LAC.warm});
  }},
  end(e){e.lacOpen=1.7;}}],
 reset(e){e.lacOpen=0;for(let i=LAC.trails.length-1;i>=0;i--)if(LAC.trails[i].room===e.room)LAC.trails.splice(i,1);},
 onDeath(e){LAC.trails.length=0;LAC.presses.length=0;}
};
for(const attack of BKIT[LAC.name].atks){
 lacquerPicks.anim[attack.n]=[['wind','atk','follow'],[0,attack.n==='BRUSH SPLATTER'?.64:1.24,attack.n==='EDGE COAT'?1.35:2.28]];
}
{const base=perfectDodge;perfectDodge=function(){
 const before=R?.pdodge,r=base.apply(this,arguments);
 if(R?.inv.lacquerseal&&R.pdodge!==before)P.lacquerHeavyUntil=R.time+4;
 return r;
};}
{const base=hurtE;hurtE=function(e,dmg,pd,o){
 if(R?.inv.lacquerseal&&P?.lacquerHeavyUntil>R.time&&(o?.src??castSrc)==='h')dmg*=1.25;
 return base.call(this,e,dmg,pd,o);
};}
