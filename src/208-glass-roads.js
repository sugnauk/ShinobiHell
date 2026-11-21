'use strict';
// XVII. Cistern mirrors teach reflections. Kiln plates teach timing and linked breaks.
const GLASS={name:'RURI, THE GLASS WARDEN',blue:'#97e9ff',violet:'#e7abff',pillars:[]};
const KILN={name:'RURI, THE FURNACE WARDEN',amber:'#ffd186',red:'#ff8b70',plates:[]};
const SHARDSMITH='THE SHARDSMITH';
const LAPIS_RELIC={id:'lapisprism',name:'LAPIS PRISM',d:'YOUR SHOTS RICOCHET ONCE OFF WALLS',g:'P',fx:'control',mo:'mirror'};
const KILN_RELIC={id:'temperedseal',name:'TEMPERED SEAL',d:'A PERFECT DODGE GRANTS A 0.7 SECOND WARD',g:'S',fx:'guard',mo:'vortex'};

function glassDecor(){
 defDeco('glassplinth',14,19,R=>{
  R(1,16,12,3,'#273249');R(4,4,6,12,'#3e738d');R(5,2,4,2,'#73b4cc');R(5,5,2,9,'#b4e5f0');R(8,6,1,8,'#759cae');
 },{glow:{c:'#9de8fc',r:8,y:-11}});
 defDeco('kilnstack',14,17,R=>{
  R(1,13,12,4,'#50343a');R(2,7,10,6,'#81504a');R(3,5,8,2,'#ae7456');
  R(4,9,6,4,'#2a1821');R(6,10,3,2,'#e48857');R(5,1,4,4,'#795556');
 },{glow:{c:'#f49c62',r:7,y:-7}});
}
glassDecor();
function glassStage({name,dungeon,palette,accent,prop,relic,hp,tale,tags}){
 const [floor,light,wall,mood]=palette;
 function floorArt(g,r,cx,cy,x,y,X,Y){
  const h=hash(x*7,y*19);
  if((x+y)%4===0)fDia(g,X,Y,accent,.15,2);
  g.fillStyle=h<.25?floor:light;g.fillRect(X-6+(x&1)*2,Y+7,10,1);g.fillRect(X-3,Y+11,7,1);
 }
 return {base:FERRY_STAGE,remix:false,indoor:true,story:dungeon+' - '+tags[0],tale,
  scn:{gr:[floor,light],wall:'temple',seal:'tomoe'},scatter:[[prop,5],['offering',2]],
  t:{
   DUN:{name:dungeon,fl:[floor,light],sp:mood,wt:mood,wf:wall,we:accent,cloth:wall,dark:mood,acc:accent,
    pool:['seer','warden','orbiter','crab','splitter','herald','seer','frog']},
   ENV:{k:'marble',liq:0,amt:0,lc:[mood,floor,wall],wall:'temple',fl:[floor,light],sp:mood},
   ROMAN:'XVII',STAGEDECO:[[prop,6],['offering',2]],DECO_GROUPS:[[[prop,-13,0],[prop,13,0],['offering',0,8]]],
   FLOORART:floorArt,MOOD:[mood,.31],PSTAGE:['insen',44,62],BMUSIC:{s:'insen',r:46,b:132,w:'triangle'},
   BMOTIF:[0,3,7,10,7,3,0,null,3,7,5,3,0,null],TRAILS:{n:'GLASS LIGHT',c:accent,c2:light},
   BOSS_HPT:hp,POOLADD:[],PMAP:[.97,.04],BOSSRELIC:relic,
   MASTER_LINES:'THE LAST SHARD FALLS STILL. TAKE THE ROAD DOWN OR LEAVE WITH YOUR VICTORY.',
   BOSS:{name,hp:2700,hat:'kasa',pref:79,spd:40,r:12,k1:[],k2:[],pal:basePal(wall,floor,accent,mood)},
   BSTYLE:{c:accent,t:tags,ph:[[{pat:'aimedring',cnt:12,sp:48,col:accent}],[{pat:'gapring',cnt:16,sp:52,col:accent}]]},
   BMODES:['circle','chase']
  }};
}
const CISTERN_STAGE=glassStage({name:GLASS.name,dungeon:'THE LAPIS CISTERN',palette:['#253342','#324757','#42637b','#142132'],
 accent:GLASS.blue,prop:'glassplinth',relic:LAPIS_RELIC,hp:29,
 tale:'THE PALACE STORED ITS CLEAN WATER BEHIND LAPIS MIRRORS. RURI STILL KEEPS LIGHT TURNING IN THE CISTERN.',
 tags:['FOLLOW THE REFLECTION','THE MIRRORS BREAK','BROKEN LIGHT']});
const KILN_STAGE=glassStage({name:KILN.name,dungeon:'THE SHARD KILN',palette:['#3d2929','#523832','#805447','#21151c'],
 accent:KILN.amber,prop:'kilnstack',relic:KILN_RELIC,hp:29,
 tale:'THE KILN FIRES THE CISTERN MIRRORS. HERE THE HEAT TURNS RURI AMBER. THE SHARDSMITH TENDS A SIDE FURNACE.',
 tags:['WATCH THE GLASS UNDERFOOT','LINKED FRACTURES','KILN RELEASE']});
const RURI_I=lateAdd(CISTERN_STAGE);

function glassPoint(e,x,y,r){
 const A=arenaOf(e),h=(A.x1-A.x0)/2,v=(A.y1-A.y0)/2;
 x=clamp(x,A.x0+r+4,A.x1-r-4);y=clamp(y,A.y0+r+4,A.y1-r-4);
 const distance=Math.abs(x-A.cx)/h+Math.abs(y-A.cy)/v,limit=1.35-r*Math.hypot(1/h,1/v);
 if(distance>limit){x=A.cx+(x-A.cx)*limit/distance;y=A.cy+(y-A.cy)*limit/distance;}
 // The arena's actual floor can narrow near a corner even inside its bounding box.
 for(let i=0;i<8&&blocked(x,y,r+1);i++){
  x=A.cx+(x-A.cx)*.85;y=A.cy+(y-A.cy)*.85;
 }
 return {x,y};
}
function glassRoomPoint(r,x,y,pad){
 if(!blocked(x,y,pad))return {x,y};
 const c=roomCenter(r);
 return blocked(c.x,c.y,pad)?null:c;
}
function glassRooms(){
 GLASS.pillars.length=0;KILN.plates.length=0;
 if(R.di!==RURI_I||!boss)return;
 const mirrors=boss.name===GLASS.name;
 const rooms=map.rooms.filter(r=>r.k==='room'&&r.type==='combat').sort((a,b)=>a.ord-b.ord);
 const teach=rooms[0];
 if(teach){
  const foes=enemies.filter(e=>e.room===teach&&!e.prop&&!e.boss).sort((a,b)=>a.spd-b.spd);
  for(const e of foes.slice(1))e.dead=true;
 }
 if(map.approach)rooms.push(map.approach);
 for(const r of rooms){
  const c=roomCenter(r);
  const point=glassRoomPoint(r,c.x+(r===teach?0:9),c.y,16);
  if(!point)continue;
  if(mirrors)GLASS.pillars.push({...point,r:r===teach?19:15,room:r});
  else KILN.plates.push({...point,r:15,room:r,t:Infinity,teaching:r===teach});
 }
 if(mirrors){
  const a=arenaOf(boss);
  for(const [x,y] of [[-64,-44],[64,-44],[-64,44],[64,44]])GLASS.pillars.push({x:a.cx+x,y:a.cy+y,r:17,room:boss.room});
 }
 if(teach){const m=mirrors?'BLUE PILLARS REFLECT SHOTS FROM EITHER SIDE. TRY A BANK SHOT.':'THE AMBER PANES CRACK UNDERFOOT. KEEP MOVING WHEN THEY LIGHT.';
  map.glassTeach={room:teach,m,col:mirrors?GLASS.blue:KILN.amber};}
}
{const base=loadDungeon;loadDungeon=function(){const r=base.apply(this,arguments);glassRooms();return r;};}

// A swept ray treats a mirror as a circle. The same reflection is used for live shots and Prism Lance.
function mirrorImpact(x,y,dx,dy,len,mirrors){
 let nearest=null;
 for(const m of mirrors){
  const ox=x-m.x,oy=y-m.y,b=ox*dx+oy*dy,c=ox*ox+oy*oy-m.r*m.r;
  const disc=b*b-c;
  if(c<=0||b>=0||disc<0)continue;
  const t=-b-Math.sqrt(disc);
  if(t<0||t>len||nearest&&t>=nearest.t)continue;
  const nx=(ox+dx*t)/m.r,ny=(oy+dy*t)/m.r,dot=dx*nx+dy*ny;
  nearest={t,x:x+dx*t,y:y+dy*t,dx:dx-2*dot*nx,dy:dy-2*dot*ny,m};
 }
 return nearest;
}
const liveMirrors=()=>GLASS.pillars.filter(m=>!m.broken);
{const base=projectileCover;projectileCover=function(q,x,y){
 if(base(q,x,y))return true;
 if(R?.di===RURI_I&&boss?.name===GLASS.name&&(q.glassBounces||0)<2){
  const dx=q.x-x,dy=q.y-y,len=Math.hypot(dx,dy);
  const hit=len&&mirrorImpact(x,y,dx/len,dy/len,len,liveMirrors());
  if(hit){
   const speed=Math.hypot(q.vx,q.vy);
   q.x=hit.x+hit.dx*.8;q.y=hit.y+hit.dy*.8;q.vx=hit.dx*speed;q.vy=hit.dy*speed;
   q.glassBounces=(q.glassBounces||0)+1;spark(hit.x,hit.y,GLASS.blue,3,42);
  }
 }
 if(!R?.inv.lapisprism||q.from!=='p'||q.lapisBounce||(q.st==='bounce'&&q.bn>0)||!solid(q.x,q.y)||solid(x,y))return false;
 const sx0=solid(q.x,y),sy0=solid(x,q.y);
 if(sx0||!sy0)q.vx=-q.vx;
 if(sy0||!sx0)q.vy=-q.vy;
 q.x=x;q.y=y;q.lapisBounce=true;spark(x,y,GLASS.blue,3,42);
 return false;
};}

function glassFence(A,x,y,pad){
 return x>=A.x0+pad&&x<=A.x1-pad&&y>=A.y0+pad&&y<=A.y1-pad&&!blocked(x,y,pad);
}
function glassRay(A,x,y,dx,dy,limit,pad){
 let len=0;
 for(let i=2;i<=limit;i+=2){
  if(!glassFence(A,x+dx*i,y+dy*i,pad))break;
  len=i;
 }
 return len;
}
function prismPath(e,angle){
 const a=arenaOf(e),w=16,pad=w/2+2,origin=glassPoint(e,e.x,e.y,pad);
 const parts=[];let {x,y}=origin,dx=Math.cos(angle),dy=Math.sin(angle),last=null;
 const reflectors=liveMirrors().filter(m=>m.room===e.room);
 for(let turn=0;turn<(e.half?3:2);turn++){
  const limit=glassRay(a,x,y,dx,dy,600,pad);
  const mirror=e.half?null:mirrorImpact(x,y,dx,dy,limit,reflectors.filter(m=>m!==last));
  const len=mirror?.t??limit;
  if(len>1)parts.push({x,y,a:Math.atan2(dy,dx),len,w});
  if(mirror){
   x=mirror.x+mirror.dx;y=mirror.y+mirror.dy;dx=mirror.dx;dy=mirror.dy;last=mirror.m;continue;
  }
  if(!e.half)break;
  const ex=x+dx*len,ey=y+dy*len,hitX=!glassFence(a,ex+dx*4,ey,pad),hitY=!glassFence(a,ex,ey+dy*4,pad);
  if(hitX||!hitY)dx=-dx;
  if(hitY||!hitX)dy=-dy;
  x=ex+dx*2;y=ey+dy*2;
 }
 return {parts,last};
}
function prismLance(e,target,delay,damage,survival){
 const direct=angTo(e,target),mirrors=liveMirrors().filter(m=>m.room===e.room);
 const mirror=mirrors.sort((p,q)=>Math.abs(angDiff(angTo(e,p),direct))-Math.abs(angDiff(angTo(e,q),direct)))[0];
 const angle=mirror&&Math.abs(angDiff(angTo(e,mirror),direct))<.65?angTo(e,mirror)+.045:direct;
 const path=prismPath(e,angle),marks=[];
 path.parts.forEach((part,i)=>marks.push(mark({...part,k:'l',t:delay+i*.08,stay:.28,grow:false,
  dmg:damage,src:e,survival,col:e.half?GLASS.violet:GLASS.blue,quiet:true,glassLine:true})));
 return marks;
}
function removeGlassMarks(marks){
 for(const m of marks??[]){const i=BMK.indexOf(m);if(i>=0&&!m.fired)BMK.splice(i,1);}
}
function glassFan(name,col,mirror=false){
 return {n:name,wt:2,gap:1.1,run(e,A){
  if(at(A,0)){
   e.tele=1;A.angle=aimAt(e);snd('bell');
   if(mirror&&!e.half){
    const pillar=liveMirrors().filter(m=>m.room===e.room).sort((x,y)=>dist(x,e)-dist(y,e))[0];
    if(pillar)A.bank=angTo(e,pillar);
   }
  }
  if(at(A,.68))lateFan(e,{a:A.angle,n:9,step:.14,gap:.17,sp:56,col,life:2.4});
  if(at(A,1.43)){
   e.tele=0;lateFan(e,{a:A.bank??A.angle+.09,n:7,step:.13,gap:A.bank==null?.17:0,sp:64,col,life:2.1});
  }
  return A.t>1.65;
 }};
}
const mirrorFan=glassFan('LAPIS SHARDS',GLASS.blue,true);
BKIT[GLASS.name]={director:bossDirector,noContact:true,pref:83,halfName:'THE MIRRORS SHATTER',
 guide:['THE BLUE PILLARS REFLECT SHOTS FROM EITHER SIDE.',
  'PRISM LANCE DRAWS ITS WHOLE PATH FIRST. STEP SIDEWAYS AND STRIKE WHILE RURI RECHARGES.',
  'FORM TWO: THE PILLARS GO DARK. THE LANCE BOUNCES OFF THE WALLS.'],
 atks:[{n:'PRISM LANCE',wt:5,gap:1.8,run(e,A){
  if(at(A,0)){e.tele=1;A.path=prismLance(e,P,1.12,14*e.dm);snd('bell');}
  if(at(A,1.3)){e.tele=0;e.glassOpen=1.65;snd('spearSteel');}
  return A.t>1.55;
 },end(e,A){removeGlassMarks(A.path);}},mirrorFan],
 onHalf(e){for(const m of GLASS.pillars)if(m.room===e.room)m.broken=true;},
 move(e,dt,d,a){if(e.glassOpen>0){e.glassOpen-=dt;e.gapT=Math.max(e.gapT,e.glassOpen+.03);return;}defaultMove(e,dt,d,a,BKIT[GLASS.name]);},
 dmgMod:e=>e.glassOpen>0?1.22:1,
 events:[{at:.27,dur:12,name:'BROKEN LIGHT',hint:'READ THE WALL BOUNCES',survival:true,storm:1,ownPressure:true,
  tick(e,dt,E){
   for(const t of [.6,3.65,8.2])if(at(E,t))prismLance(e,P,1.18,12*e.dm,E);
   if(at(E,6.5)){E.angle=aimAt(e);fxRing(e.x,e.y,27,GLASS.violet,.72);snd('bell');}
   if(at(E,7.35))lateFan(e,{a:E.angle,n:15,step:.4,gap:.65,sp:48,col:GLASS.violet,life:2.1});
  },end(e){e.glassOpen=1.65;}}],
 reset(e){e.glassOpen=0;for(const m of GLASS.pillars)if(m.room===e.room)m.broken=false;}
};

// The kiln trades reflection for pressure. An armed plate visibly counts down before it breaks.
function kilnPlate(e,x,y,r=22){
 const p={...glassPoint(e,x,y,r),r,room:e.room,t:11,owner:e};
 KILN.plates.push(p);return p;
}
function primePlate(p,delay){
 if(p.mark||p.spent)return;
 const e=p.owner;
 p.mark=mark({k:'c',x:p.x,y:p.y,r:p.r,t:delay,src:e,col:KILN.amber,quiet:true,glassPlate:true,
  survival:e?.EV,dmg:12*(e?.dm??1.8),on(){
   p.spent=true;fxRing(p.x,p.y,p.r,KILN.red,.35);spark(p.x,p.y,KILN.amber,12,58);snd('spearSteel');
  }});
 const linked=p.link;
 if(linked&&!linked.mark&&!linked.spent)primePlate(linked,delay+.38);
}
function kilnPair(e,x,y,axis,delay){
 const p=kilnPlate(e,x,y),side=axis==='x'?(p.x<arenaOf(e).cx?1:-1):(p.y<arenaOf(e).cy?1:-1);
 const q=kilnPlate(e,p.x+(axis==='x'?side*62:0),p.y+(axis==='y'?side*62:0));
 if(e.half){p.link=q;q.link=p;}
 primePlate(p,delay);return [p,q];
}
{const base=updPlay;updPlay=function(dt){
 if(R?.di===RURI_I){
  const teach=map.glassTeach;
  if(teach&&inRoom(teach.room,P.x,P.y,0)){setToast(teach.m,teach.col,4);map.glassTeach=null;}
  for(let i=KILN.plates.length-1;i>=0;i--){
   const p=KILN.plates[i];p.t-=dt;
   if(p.spent||(p.t<=0&&!p.mark)){KILN.plates.splice(i,1);continue;}
   if(!p.mark&&inRoom(p.room,P.x,P.y,0)&&Math.abs(p.x-P.x)+Math.abs(p.y-P.y)<p.r)primePlate(p,.95);
  }
 }
 return base.apply(this,arguments);
};}
function clearKilnPanes(e){
 for(const p of KILN.plates)if(p.owner===e){removeGlassMarks([p.mark]);p.spent=true;}
}
const kilnFan=glassFan('FURNACE FAN',KILN.amber);
const kilnRelease={n:'KILN RELEASE',wt:5,gap:1.8,run(e,A){
 if(at(A,0)){e.tele=1;A.panels=kilnPair(e,P.x,P.y,e.sdir>0?'x':'y',1.12);A.angle=aimAt(e);snd('bell');}
 if(at(A,1.14)){e.tele=0;sfx('spearSteel');}
 if(e.half&&at(A,1.8))lateFan(e,{a:A.angle+(e.sdir>0?.2:-.2),n:e.lairBoss?7:11,step:.18,gap:.33,sp:54,col:KILN.amber,life:1.45});
 const open=e.half?2.25:1.55;
 if(at(A,open))e.glassOpen=1.75;
 return A.t>open+.08;
},end(e,A){
 if(A.t>=(e.half?2.25:1.55))return;
 for(const p of A.panels??[]){removeGlassMarks([p.mark]);p.spent=true;}
}};
BKIT[KILN.name]={director:bossDirector,noContact:true,pref:76,halfName:'THE PANES LINK',
 guide:['STEPPING ON AN AMBER PANE LIGHTS IT. WALK OFF BEFORE IT BREAKS.',
  'KILN RELEASE: RURI LIGHTS THE FIRST PANE. STEP ASIDE, THEN STRIKE WHILE HER SHARDS DRAW BACK.',
  'FORM TWO: A LIT PANE PRIMES ITS LINKED NEIGHBOR. THE GOLD LINE SHOWS THE LINK.'],
 atks:[kilnRelease,kilnFan],
 move(e,dt,d,a){if(e.glassOpen>0){e.glassOpen-=dt;e.gapT=Math.max(e.gapT,e.glassOpen+.03);return;}defaultMove(e,dt,d,a,BKIT[KILN.name]);},
 dmgMod:e=>e.glassOpen>0?1.22:1,
 events:[{at:.28,dur:12,name:'KILN RELEASE',hint:'FOLLOW THE LINKS AND KEEP MOVING',survival:true,storm:1,ownPressure:true,
  tick(e,dt,E){
   [.6,3.65,7.2].forEach((t,i)=>{if(at(E,t)){E.angle=aimAt(e);kilnPair(e,P.x,P.y,i%2?'x':'y',1.18);}});
   if(at(E,9))lateFan(e,{a:E.angle,n:11,step:.2,gap:.34,sp:54,col:KILN.amber,life:1.6});
  },
  end(e){clearKilnPanes(e);e.glassOpen=1.75;}}],
 onHalf:clearKilnPanes,
 reset(e){e.glassOpen=0;clearKilnPanes(e);},
 onDeath:clearKilnPanes
};
{const base=drawBossFloor;drawBossFloor=function(){
 base.apply(this,arguments);
 if(R?.di!==RURI_I)return;
 ctx.save();worldXf();
 for(const m of GLASS.pillars){
  ctx.fillStyle=m.broken?'#344a5d':'#2a5775';ctx.strokeStyle=m.broken?'#597485':GLASS.blue;ctx.lineWidth=1.7;
  ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,TAU);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(m.x-7,m.y+3);ctx.lineTo(m.x+6,m.y-6);ctx.stroke();
 }
 for(const p of KILN.plates){
  if(p.spent)continue;
  if(p.link&&!p.link.spent){ctx.strokeStyle='#c88d55';ctx.lineWidth=1.6;ctx.setLineDash([4,4]);
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.link.x,p.link.y);ctx.stroke();ctx.setLineDash([]);}
  ctx.fillStyle=p.mark?'#a85c42':'#604145';ctx.strokeStyle=p.mark?KILN.amber:'#c08f66';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(p.x,p.y-p.r);ctx.lineTo(p.x+p.r,p.y);ctx.lineTo(p.x,p.y+p.r);ctx.lineTo(p.x-p.r,p.y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(p.x-7,p.y+1);ctx.lineTo(p.x+2,p.y-3);ctx.lineTo(p.x+8,p.y);ctx.stroke();
 }
 ctx.restore();
 for(const m of liveMirrors()){
  const X=sx(m.x,m.y),Y=sy(m.x,m.y);
  ctx.fillStyle='#244152';ctx.fillRect(X-5,Y-23,10,22);ctx.fillStyle='#5897b9';ctx.fillRect(X-3,Y-22,7,19);
  ctx.fillStyle='#b7f6ff';ctx.fillRect(X-2,Y-20,2,16);ctx.fillRect(X-3,Y-24,8,2);
 }
};}
{const base=perfectDodge;perfectDodge=function(){
 const before=R?.pdodge,r=base.apply(this,arguments);
 if(R?.inv.temperedseal&&R.pdodge!==before)P.ward=Math.max(P.ward,.7);
 return r;
};}

// This is the approved Glass Warden painting and frame size from the earlier sprite review.
function crystalPalette(p,Q){
 const {R,L}=p,{b=0,swing=0}=Q,ink='#100f1a';
 const plate=(points,c)=>{artPoly(R,points,c);for(let i=0;i<points.length;i++)L(...points[i],...points[(i+1)%points.length],ink,2);};
 const fill=(points,c)=>artPoly(R,points,c);
 const glint=(x,y,c)=>{R(x-2,y,5,1,c);R(x,y-2,1,5,c);R(x,y,1,1,'#fff6e2');};
 return {R,L,plate,fill,glint,b,swing,ink,half:ARTHURT};
}
function drawGlassWarden(p,Q,heated=false){
 const {R,L,plate,fill,glint,b,swing,ink,half}=crystalPalette(p,Q);
 const colors=heated?(half?['#ffab86','#da5346','#632936','#ffdcc2','#ac4b55','#a34c57']:['#ffe2a4','#cb8648','#61404b','#fff0cb','#965f56','#a37750']):
  (half?['#e39af4','#c7599d','#522b70','#f4bcea','#9f55aa','#8d4b9d']:['#a6f4ff','#50adc9','#273e70','#ddfcff','#6c90bd','#62a4bd']);
 const [a,c,d,shine,edge,rim]=colors;
 function shard(x,y,dx,dy,w){
  const len=Math.hypot(dx,dy),u=-dy/len*w,v=dx/len*w,m=[x+dx*.46,y+dy*.46],tip=[x+dx,y+dy];
  const left=[m[0]+u,m[1]+v],right=[m[0]-u,m[1]-v];
  plate([[x,y],left,tip,right],c);fill([[x,y],right,tip,m],d);fill([[x,y],left,tip,m],a);
  L(...m,...tip,'#fff7fd',1);
  const between=(u,v,k)=>[u[0]+(v[0]-u[0])*k,u[1]+(v[1]-u[1])*k];
  const ridge=between(m,tip,.53);
  if(w>=7){
   fill([between(left,tip,.2),between(left,tip,.58),ridge],shine);
   L(...between(right,tip,.17),...ridge,edge,1);
   L(...between([x,y],m,.25),...between(m,tip,.24),rim,1);
  }
 }
 const y=35-b;
 for(const side of [-1,1]){
  const x=49+side*(half?26:19);
  shard(x,y+15,side*(13+swing*8),-33+swing*17,7);
  shard(x,y+15,side*(14+swing*10),31,8);
  shard(49+side*10,66-b,side*(half?19:9),22,5);
  if(half){shard(49+side*27,48-b,side*13,17,4);glint(49+side*34,32-b,a);}
 }
 shard(49,79-b,0,14,5);
 plate([[49,y-8],[62,y+6],[61,y+21],[49,y+31],[37,y+21],[36,y+6]],d);
 fill([[49,y-6],[60,y+6],[49,y+23],[38,y+6]],c);
 if(half){plate([[49,y-5],[56,y+7],[49,y+18],[43,y+7]],ink);glint(49,y+7,heated?'#fff1a6':'#ffb8ed');}
 else shard(49,y+20,0,-23,7);
 shard(49,y-9,half?7:0,-20,8);
 R(44,y-19,11,2,heated?'#fff1cc':'#f7e8ff');R(51,y-19,3,2,half?(heated?'#b84d40':'#9d4297'):d);
}
const crystalPoses={idle0:{},idle1:{b:2},wind:{swing:-.24},atk:{swing:1},recover:{swing:.32}};
const glassPoseTiming=[['wind','atk','recover','idle0'],[0,1.02,1.3,1.65]];
humBoss(GLASS.name,drawGlassWarden,crystalPoses,{fw:112,fh:98,sc:.98,anim:{
 'PRISM LANCE':glassPoseTiming,'LAPIS SHARDS':[['wind','atk','wind','atk','recover'],[0,.68,.92,1.43,1.58]]
}});
humBoss(KILN.name,(p,Q)=>drawGlassWarden(p,Q,true),crystalPoses,{fw:112,fh:98,sc:.98,anim:{
 'KILN RELEASE':[['wind','atk','recover','idle0'],[0,1.02,1.14,1.55]],
 'FURNACE FAN':[['wind','atk','wind','atk','recover'],[0,.68,.92,1.43,1.58]]
}});

const kilnArms=[[[26,28],[22,38],[25,45]],[[46,28],[51,38],[49,46]]];
const kilnArt=hiArt((H,Q)=>{
 const {two,by}=H,cx=72,far=(Q.far||kilnArms[0]).map(H.pt),near=(Q.near||kilnArms[1]).map(H.pt);
 const coal='#312b3b',glaze=two?'#965341':'#836346',ivory=two?'#f3b08b':'#e4c897',hot=two?'#ff8369':'#ffc575';
 if(two)for(const side of [-1,1]){
  const x=cx+side*24,y=45+by;
  H.poly([[x,y+13],[x+side*3,y-7],[x+side*13,y-19],[x+side*14,y+2],[x+side*8,y+15]],'#773d39');
  H.fill([[x+side*3,y+7],[x+side*11,y-13],[x+side*10,y+2]],hot);
  H.ln(x+side*6,y+1,x+side*11,y-12,1,'#ffe1a1');
 }
 HIP.legs(H,Q,cx,98,([a,k,f])=>HIP.leg(H,a,k,f,coal,'#493b4b','#5d4851',13));
 H.poly([[48,50+by],[95,48+by],[111,126],[85,134],[72,126],[52,136],[33,124]],'#513746');
 H.fill([[47,63+by],[59,64+by],[53,119],[38,125]],'#80504e');
 H.fill([[83,64+by],[94,64+by],[105,125],[91,129]],'#372f43');
 H.poly([[49,52+by],[93,51+by],[90,91],[78,111],[61,111],[49,94]],glaze);
 for(let i=0;i<4;i++){
  const y=62+i*9+by;
  H.ln(51+i,y,91-i,y-1,3,coal);
  H.ln(54+i,y-2,88-i,y-3,2,'#ad8a61');
  if(i%2===0)H.rect(69,y+2,5,2,hot);
 }
 if(two){H.ln(70,57+by,63,80+by,2,hot);H.ln(63,80+by,78,95+by,2,hot);}
 H.limb(far,14,coal,'#6e5a65');HIP.hand(H,...far[2],'#84635a');
 H.limb(near,14,coal,'#6e5a65');
 const [x,y]=near[2],a=Q.ta??-1.25,dx=Math.cos(a),dy=Math.sin(a),ox=-dy,oy=dx;
 const tip=HIP.pole(H,x,y,a,27,Q.tl??37,6,'#64545e');
 const jaws=two?11:8;
 for(const side of [-1,1])H.limb([tip,[tip[0]+dx*9+ox*side*jaws,tip[1]+dy*9+oy*side*jaws],
  [tip[0]+dx*15+ox*side*4,tip[1]+dy*15+oy*side*4]],5,'#4f3e4d',ivory);
 if(two)H.ell(tip[0]+dx*8,tip[1]+dy*8,3,3,hot,0);
 HIP.hand(H,x,y,'#84635a');
 const hy=34+by;
 H.ell(cx,hy,16,19,coal);H.ell(cx-1,hy+2,12,13,'#65545e',0);
 H.poly([[cx-13,hy-9],[cx+9,hy-11],[cx+13,hy-1],[cx+9,hy+10],[cx,hy+14],[cx-11,hy+7]],ivory);
 H.fill([[cx+4,hy-9],[cx+12,hy-2],[cx+9,hy+9],[cx+2,hy+13],[cx+5,hy+2]],'#a78672');
 H.ln(cx-10,hy-2,cx+10,hy-3,4,coal);H.rect(cx-5,hy-3,3,2,hot);H.rect(cx+5,hy-4,3,2,hot);
 if(two){H.ln(cx+4,hy-10,cx,hy-1,2,coal);H.ln(cx,hy-1,cx+5,hy+7,2,hot);}
 H.poly([[cx-19,hy-8],[cx-12,hy-17],[cx+11,hy-18],[cx+20,hy-9],[cx+6,hy-10],[cx-8,hy-7]],glaze);
 H.ln(cx-12,hy-12,cx+10,hy-14,2,hot);
});
humBoss(SHARDSMITH,kilnArt,{idle0:{},idle1:{b:1},atk:{legs:'lunge',near:[[46,28],[54,25],[53,32]],ta:-.3,tl:15}},
 {sc:1.12});
hiPoses(SHARDSMITH,kilnArms);
const kilnPoses=BART[SHARDSMITH].posed;
Object.assign(kilnPoses.poses.wind,{ta:-2.31,tl:22});
Object.assign(kilnPoses.poses.follow,{near:[[46,28],[51,36],[53,43]],ta:.6,tl:15});
const kilnIdlePose=kilnPoses.pick;
kilnPoses.pick=(e,indices)=>e.A&&!e.phx?null:kilnIdlePose(e,indices);
kilnPoses.anim['KILN RELEASE']=[['wind','atk','follow','idle0'],[0,1.02,1.2,1.5]];
kilnPoses.anim['FURNACE FAN']=[['wind','atk','wind','atk','follow'],[0,.68,.92,1.43,1.58]];

ET.shardsmith={n:SHARDSMITH,desc:'THE KILN KEEPER',hp:400,spd:34,pos:900,r:11,ai:'dummy',rng:0,wl:0,atks:[]};
function finishSmithAttack(e){cancelAtk(e);clearKilnPanes(e);for(const q of projs)if(q.own===e)q.dead=true;}
LAIRS.push({stage:RURI_I,art:SHARDSMITH,name:SHARDSMITH,title:'THE SIDE FURNACE',col:KILN.amber,
 et:'shardsmith',hp:.36,ai:'shardsmith',half:'THE PANES LINK',free:true,
 when:()=>BOSS[RURI_I].name===KILN.name&&!R?.test&&!R?.rush,
 onHalf(e){finishSmithAttack(e);e.lastA=null;e.at=.8;},onDeath:finishSmithAttack,onLeave:finishSmithAttack});
LAIRAI.shardsmith=(e,dt)=>{
 if(e.A){e.A.t+=dt;if(e.A.run(e,e.A)){e.A.end?.(e,e.A);e.A=null;e.tele=0;}return;}
 if((e.glassOpen||0)>0)e.glassOpen-=dt;
 else defaultMove(e,dt,dist(e,P),aimAt(e),{pref:70});
 e.at-=dt;
 if(e.at<=0){e.at=e.half?1.15:1.55;startAtk(e,e.lastA===kilnRelease.n?kilnFan:kilnRelease);}
};

DESCENT_ROADS[RURI_I]=[
 {id:'ruriA',def:CISTERN_STAGE,reward:'YOUR SHOTS BOUNCE OFF WALLS'},
 {id:'ruriB',def:KILN_STAGE,reward:'PERFECT DODGE GRANTS A WARD'}
];
installDescentRoad(RURI_I,descentRoad(RURI_I,'ruriB'));
installDescentRoad(RURI_I,descentRoad(RURI_I,'ruriA'));
const glassRoadStory='CLEAR WATER RUNS BELOW. ONE ROAD LEADS INTO THE LAPIS CISTERN; THE OTHER GLOWS WITH THE HEAT OF THE SHARD KILN.';
for(const r of DESCENT_ROADS[NEB_I])r.def.t.MASTER_LINES=glassRoadStory;
MASTER_LINES[NEB_I]=glassRoadStory;

lateStagesReady=true;
