'use strict';
// ===== LAIRS: optional challenge bosses behind locked doors =====
// The twelve guardians on the story path are all people. The old monsters still live in the dungeons, each sealed in a
// side room off the main path: the Earth Spider in the tunnels of stage III. Their doors open with a LAIR KEY, sold by the trader in the stages before. Fighting one is optional and
// hard; beating it drops a royal bag (a legendary) and a war trophy.
const LAIRS=[
 {stage:2,art:'TSUCHIGUMO, EARTH SPIDER',name:'TSUCHIGUMO, THE EARTH SPIDER',title:"THE EARTH SPIDER'S DEN",col:'#c89040',et:'lairspider',hp:.5,ai:'spider',half:'IT SHEDS ITS SHELL'},
 {stage:5,art:'THE HITOBASHIRA',name:'THE HITOBASHIRA, MAIDEN OF THE WALL',title:'THE SEALED FOUNDATION',col:'#7af0d0',et:'lairghost',hp:.5,ai:'ghost',half:'THE PILLAR BREAKS',unique:'pillar'}];
const lairFor=di=>LAIRS.find(L=>L.stage===di&&(!L.when||L.when()));
ET.lairspider={n:'TSUCHIGUMO',desc:'THE EARTH SPIDER, SEALED IN A LOCKED DEN',hp:400,spd:40,pos:700,r:14,ai:'dummy',rng:0,wl:0,atks:[]};
ET.lairghost={n:'THE HITOBASHIRA',desc:'A MAIDEN WALLED UP ALIVE IN THE CASTLE FOUNDATIONS',hp:400,spd:50,pos:600,r:10,ai:'dummy',rng:0,wl:0,atks:[]};
ROOMCOL.lair='#e05050';

// ---------- the map: a sealed room off one of the middle rooms, behind a locked door ----------
{const _gm=genMap;genMap=function(di){let m=_gm.apply(this,arguments);try{const L=lairFor(di);if(L&&R&&!R.training&&!(R.lairDone&&R.lairDone[di])){
  // a lair needs room beside the path: try a few sizes, and if this layout has no space, lay out the stage again
  for(let tr=0;tr<12&&!m.lair;tr++){if(tr)m=_gm.apply(this,arguments);for(const [sz,gap] of [[18,6],[16,5],[16,8],[14,4]])if(!m.lair)addLair(m,L,sz,gap);}}}catch(err){console.warn('lair',err);}return m;};}
function addLair(m,L,SZ,GAP){const t=m.t,LW=SZ||18,LH=SZ||18;GAP=GAP||6;
 const cands=m.rooms.filter(r=>r.k==='room'&&r.type!=='shop');for(let i=cands.length-1;i>0;i--){const j=ri(0,i);[cands[i],cands[j]]=[cands[j],cands[i]];}
 const clear=(x,y,w,h)=>{if(x<2||y<2||x+w>MW-2||y+h>MH-2||x+w>MW-38)return false;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(t[j*MW+i])return false;return true;};
 for(const par of cands)for(const d of [0,1,2,3].sort(()=>Math.random()-.5)){
  const pcx=par.x+(par.w>>1),pcy=par.y+(par.h>>1);let lx,ly,cor;
  // d: 0 north, 1 south, 2 west, 3 east. The corridor runs from the parent's edge to the lair's edge, three wide.
  if(d===0){lx=pcx-(LW>>1);ly=par.y-GAP-LH;cor={x:pcx-1,y:ly+LH,w:3,h:par.y-(ly+LH)};}
  else if(d===1){lx=pcx-(LW>>1);ly=par.y+par.h+GAP;cor={x:pcx-1,y:par.y+par.h,w:3,h:ly-(par.y+par.h)};}
  else if(d===2){lx=par.x-GAP-LW;ly=pcy-(LH>>1);cor={x:lx+LW,y:pcy-1,w:par.x-(lx+LW),h:3};}
  else{lx=par.x+par.w+GAP;ly=pcy-(LH>>1);cor={x:par.x+par.w,y:pcy-1,w:lx-(par.x+par.w),h:3};}
  if(!clear(lx-2,ly-2,LW+4,LH+4))continue;
  // the corridor may only touch floor at the parent end
  let ok=true;for(let j=cor.y;j<cor.y+cor.h&&ok;j++)for(let i=cor.x-1;i<cor.x+cor.w+1;i++){if(i>=par.x&&i<par.x+par.w&&j>=par.y&&j<par.y+par.h)continue;if(t[j*MW+i]&&!(d<2?false:false)){ok=false;break;}}
  if(!ok)continue;
  // carve the lair (an octagon like the boss arenas), the corridor, and a path back into the parent's open floor
  const mx=lx+(LW-1)/2,my=ly+(LH-1)/2;for(let j=ly;j<ly+LH;j++)for(let i=lx;i<lx+LW;i++){if(Math.abs((i-mx)/(LW/2))+Math.abs((j-my)/(LH/2))<=1.45)t[j*MW+i]=1;}
  for(let j=cor.y;j<cor.y+cor.h;j++)for(let i=cor.x;i<cor.x+cor.w;i++)t[j*MW+i]=1;
  {let x=d>=2?(d===2?cor.x+cor.w:cor.x-1):pcx,y=d<2?(d===0?cor.y+cor.h:cor.y-1):pcy;const sx2=d===2?1:d===3?-1:0,sy2=d===0?1:d===1?-1:0;
   for(let k=0;k<40&&!(t[y*MW+x]&&t[(y+sy2*2)*MW+x+sx2*2]);k++){for(let w=-1;w<=1;w++)t[(y+(d>=2?w:0))*MW+x+(d<2?w:0)]=1;x+=sx2;y+=sy2;}
   for(let w=-1;w<=1;w++)t[(y+(d>=2?w:0))*MW+x+(d<2?w:0)]=1;}
  // the door: the corridor's three cells next to the parent stay solid until it is unlocked
  const door=[];if(d===0)for(let i=0;i<3;i++)door.push([cor.x+i,cor.y+cor.h-1]);else if(d===1)for(let i=0;i<3;i++)door.push([cor.x+i,cor.y]);
  else if(d===2)for(let i=0;i<3;i++)door.push([cor.x+cor.w-1,cor.y+i]);else for(let i=0;i<3;i++)door.push([cor.x,cor.y+i]);
  for(const [i,j] of door)t[j*MW+i]=0;
  const room={x:lx,y:ly,w:LW,h:LH,k:'lair',type:'lair',shape:'arena',lair:L};m.rooms.push(room);
  const idx=m.rooms.length-1;for(let j=ly;j<ly+LH;j++)for(let i=lx;i<lx+LW;i++)if(t[j*MW+i]){m.roomOf[j*MW+i]=idx;m.liq[j*MW+i]=0;}
  for(let j=cor.y;j<cor.y+cor.h;j++)for(let i=cor.x;i<cor.x+cor.w;i++)m.liq[j*MW+i]=0;
  m.liqList=[];for(let i=0;i<MW*MH;i++)if(m.liq[i])m.liqList.push(i);
  rebuildVis(m);
  // where the door prop stands: on the parent side of the door cells
  const [c0,c1]=[door[1][0],door[1][1]],off=d===0?1:d===1?-1:0,offx=d===2?1:d===3?-1:0;
  m.lair={L,room,door,dir:d,parent:par,px:(c0+.5+offx*.9)*T,py:(c1+.5+off*.9)*T,locked:true};return true;}
 return false;}
function unlockLair(){const Z=map&&map.lair;if(!Z||!Z.locked)return;Z.locked=false;for(const [i,j] of Z.door)map.t[j*MW+i]=1;
 rebuildVis(map);map.scene=null;map.mc={};mapCanvas=map.mc[camRot]=renderMap(map.th);
 for(const p of props)if(p.lairDoor)p.used=true;sfx('rare');shake=Math.max(shake,4);fxRing(Z.px,Z.py,40,Z.L.col,.5);
 setToast('THE SEAL BREAKS. '+Z.L.title+' LIES OPEN','#ffd040',3.5);}

// ---------- the door and the boss, placed when the stage loads ----------
{const _pr=populateRoom;populateRoom=function(r,di){if(r.type!=='lair')return _pr.apply(this,arguments);
 const L=r.lair,Z=map.lair;props.push({k:'lairdoor',lairDoor:true,x:Z.px,y:Z.py,room:Z.parent,L});
 const c=roomCenter(r),e=mkEnemy(L.et,c.x,c.y,r,di),hp=BOSS[L.stage].hp*BOSSHP*L.hp*DF().hp*(R.ngp?1.25:1);
 Object.assign(e,{hp,maxhp:hp,lairBoss:L,sprOv:lairSpr(L,0),phase:1,label:null,elite:null,at:2.5,bt:1.2,k:0,ang:0,dm:1+.2*di,brq:[]});enemies.push(e);};}
const LAIRSPR={};
function lairSpr(L,half){const k=L.art+(half?'h':'n');if(!LAIRSPR[k]){ARTHURT=!!half;try{LAIRSPR[k]=bossArt(L.art);}finally{ARTHURT=false;}}return LAIRSPR[k];}
const inRoomR=(r,x,y)=>x>r.x*T&&x<(r.x+r.w)*T&&y>r.y*T&&y<(r.y+r.h)*T;

// the door: a lacquered gate across the corridor with a paper seal and an iron padlock
{const _dp=drawProp;drawProp=function(p){if(p.k!=='lairdoor')return _dp.apply(this,arguments);if(p.used)return;
 const X=sx(p.x,p.y),Y=sy(p.x,p.y),c=p.L.col;
 shadow(X,Y,26);ctx.fillStyle='#14101a';ctx.fillRect(X-15,Y-30,30,31);
 ctx.fillStyle='#4a1a14';ctx.fillRect(X-14,Y-29,28,29);ctx.fillStyle='#6a2a1c';ctx.fillRect(X-14,Y-29,28,2);
 for(let i=-12;i<=10;i+=6){ctx.fillStyle='#2a0e0a';ctx.fillRect(X+i,Y-27,1,27);}
 ctx.fillStyle='#14101a';ctx.fillRect(X-17,Y-33,34,4);ctx.fillStyle='#8a2a1c';ctx.fillRect(X-16,Y-32,32,2);
 for(const yy of [-22,-8]){ctx.fillStyle='#3a3a44';ctx.fillRect(X-14,Y+yy,28,2);ctx.fillStyle='#7a7a88';ctx.fillRect(X-14,Y+yy,28,1);}
 // the paper seal with the beast's sign, and a padlock that glints
 ctx.fillStyle='#14101a';ctx.fillRect(X-5,Y-25,10,15);ctx.fillStyle='#f0e8d0';ctx.fillRect(X-4,Y-24,8,13);ctx.fillStyle=c;ctx.fillRect(X-2,Y-21,4,1);ctx.fillRect(X-1,Y-22,2,6);ctx.fillRect(X-3,Y-17,6,1);
 ctx.fillStyle='#14101a';ctx.fillRect(X-4,Y-10,8,8);ctx.fillStyle='#a07020';ctx.fillRect(X-3,Y-9,6,6);ctx.fillStyle='#e0b040';ctx.fillRect(X-3,Y-9,6,1);ctx.fillStyle='#14101a';ctx.fillRect(X-1,Y-7,2,3);
 ctx.strokeStyle='#a07020';ctx.beginPath();ctx.arc(X+.5,Y-11,2.5,Math.PI,0);ctx.stroke();
 if(Math.floor(time*2)%3===0){ctx.fillStyle='#fff';ctx.fillRect(X+2,Y-9,1,1);}
 const gl=.25+.15*Math.sin(time*3);ctx.globalAlpha=gl;ctx.fillStyle=c;ctx.fillRect(X-15,Y-34,30,1);ctx.globalAlpha=1;};}
// G at the door: unlock it with a key, or be told where to get one
{const _in=interact;interact=function(){const p=nearProp();if(p&&p.k==='lairdoor'){
 if(p.L.free)unlockLair();
 else if((R.keys||0)>0){R.keys--;unlockLair();}
 else{txtFx(P.x,P.y,'LOCKED','#c55');sfx('block');setToast('SEALED. THE TRADER SELLS LAIR KEYS','#e0b040',3);}
 return;}return _in.apply(this,arguments);};}

// the trader sells a lair key on the stages that lead up to a lair
{const _pr2=populateRoom;populateRoom=function(r,di){const out=_pr2.apply(this,arguments);if(r.type==='shop'&&LAIRS.some(L=>!L.free&&L.stage>=di&&L.stage-di<=2&&!(R.lairDone&&R.lairDone[L.stage]))){const c=roomCenter(r),dry=(x,y)=>!blocked(x,y,8)&&!map.liq[((y/T)|0)*MW+((x/T)|0)]&&map.roomOf[((y/T)|0)*MW+((x/T)|0)]===map.rooms.indexOf(r),
   spot=[[65,38],[-65,38],[0,62],[65,10],[-65,10],[26,62],[-26,62]].map(([a,b])=>({x:c.x+a,y:c.y+b})).find(q=>dry(q.x,q.y))||{x:c.x+65,y:c.y+38};
  props.push({k:'pedestal',x:spot.x,y:spot.y,room:r,lairKey:true,price:Math.round(SHOPX*110*(1+.2*di)),name:'LAIR KEY'});}return out;};}

// ---------- the lair bosses: a self-contained director each ----------
{const _ue=updEnemy;updEnemy=function(e,dt){_ue(e,dt);const L=e.lairBoss;if(!L||e.dead)return;
 const inside=inRoomR(e.room,P.x,P.y);if(!e.awake&&inside)e.awake=true;if(!e.awake)return;
 if(!e.met){e.met=1;sfx('boss');shake=Math.max(shake,6);setToast(L.name+' AWAKENS','#ff8060',3);fxRing(e.x,e.y,70,L.col,.6);}
 if(e.stag>0||e.stun>0||(e.st&&e.st.frozen>0))return;
 if(!inside){e.at=Math.max(e.at,1.5);if(L.onLeave)L.onLeave(e);return;} // it will not chase you out of its lair
 tickBarrage(e,dt);
 if(!e.half&&e.hp<e.maxhp*.5){e.half=1;e.phase=2;e.sprOv=lairSpr(L,1);for(const q of projs)if(q.from==='e'&&q.own===e)q.dead=true;impact(e.x,e.y,L.col,10,true);sfx('break');txtFx(e.x,e.y-20,L.half||'IT RAGES',L.col,2);e.iv=1;if(L.onHalf)L.onHalf(e);}
 LAIRAI[L.ai||'spider'](e,dt,e.half?1.3:1);};}
const LAIRAI={
 // the spider: crawls after you, spits venom fans, webs the floor, broods spiderlings and leaps onto you
 spider(e,dt,k){const a=aimAt(e),d=dist(e,P);
  if(!e.leap){const p=freeSpot(e,P.x-Math.cos(a)*60,P.y-Math.sin(a)*60,e.r),da=Math.atan2(p.y-e.y,p.x-e.x),dd=Math.hypot(p.x-e.x,p.y-e.y);if(dd>6)steer(e,da,Math.min(dd/dt,e.spd*k),dt);}
  else{e.leap.t+=dt;e.tele=1;if(e.leap.t>=.9){const m=e.leap;e.x=m.x;e.y=m.y;e.tele=0;e.leap=null;shake=Math.max(shake,5);sfx('slam');fxRing(e.x,e.y,44,'#c89040',.5);
    for(let i=0;i<(e.half?16:12);i++)bsh(e,e.x,e.y,i/(e.half?16:12)*TAU,62,10,{col:BC.fix,r:3});}return;}
  e.bt-=dt;if(e.bt<=0){e.bt=(e.half?.9:1.2)/(DF().bh||1);e.k++;const Lp=[{pat:'lattice',cnt:11,sp:56,col:BC.fix},{pat:'layered',cnt:12,sp:54,col:BC.fix2},{cnt:5,spread:.6,sp:84,col:BC.aim}];if(eShots()<200)bossBarrage(e,Object.assign({dmg:10},Lp[e.k%Lp.length]));}
  e.at-=dt;if(e.at<=0){e.at=e.half?2.4:3.2;const n=pick(['spit','web','brood','leap']);
   if(n==='spit'){for(let w=0;w<(e.half?3:2);w++)setTimeout(()=>{if(e.dead)return;const a2=aimAt(e);for(let i=-3;i<=3;i++)bsh(e,e.x,e.y,a2+i*.16,96,11,{col:BC.haz,r:3});sfx('shoot');},w*260);say(e,'',null,.1);}
   if(n==='web'){for(let i=0;i<(e.half?7:5);i++){const an=Math.random()*TAU,r=i?rnd(20,70):0;mark({k:'c',x:P.x+Math.cos(an)*r,y:P.y+Math.sin(an)*r,r:16,t:1+i*.12,dmg:12*e.dm,col:'#e8e0c8',src:e});}}
   if(n==='brood'&&enemies.filter(o=>!o.dead&&o.type==='spiderling').length<8){for(let i=0;i<(e.half?4:3);i++){const an=i/3*TAU,s=freeSpot(e,e.x+Math.cos(an)*24,e.y+Math.sin(an)*24,4);const m=mkEnemy('spiderling',s.x,s.y,e.room,R.di);m.awake=true;enemies.push(m);spark(s.x,s.y,'#e8e0c8',8,50);}txtFx(e.x,e.y-20,'THE BROOD STIRS','#e8e0c8',1.4);}
   if(n==='leap'&&d>40){const s=freeSpot(e,P.x,P.y,e.r);e.leap={x:s.x,y:s.y,t:0};mark({k:'c',x:s.x,y:s.y,r:30,t:.9,dmg:24*e.dm,col:BC.aim,src:e});sfx('tool');}}},
 // the hitobashira: drifts round you, sends ghost-fire after you, splits into reflections of herself (whose shots are
 // hollow), and passes through the stone to appear behind you
 ghost(e,dt,k){e.ang+=dt*.7*k;const tx=P.x+Math.cos(e.ang)*90,ty=P.y+Math.sin(e.ang)*90,p=freeSpot(e,tx,ty,e.r),da=Math.atan2(p.y-e.y,p.x-e.x),dd=Math.hypot(p.x-e.x,p.y-e.y);if(dd>4)steer(e,da,Math.min(dd/dt,e.spd*1.3*k),dt);
  if(Math.random()<dt*8)particles.push({x:e.x+rnd(-8,8),y:e.y+rnd(-4,4),vx:0,vy:-16,t:.6,col:Math.random()<.5?'#7af0d0':'#d0fff4'});
  e.bt-=dt;if(e.bt<=0){e.bt=(e.half?.8:1.1)/(DF().bh||1);e.k++;const Lp=[{pat:'rose',cnt:24,petals:6,sp:58,col:'#7af0d0'},{pat:'dspiral',arms:3,sp:56,burst:6,gap:.1,col:'#d0fff4'},{cnt:7,spread:.9,sp:88,col:BC.aim}];if(eShots()<210)bossBarrage(e,Object.assign({dmg:10},Lp[e.k%Lp.length]));}
  e.at-=dt;if(e.at<=0){e.at=e.half?2.2:3;const n=pick(['onibi','reflect','through']);
   if(n==='onibi'){for(let i=0;i<(e.half?9:6);i++)bsh(e,e.x,e.y,i/(e.half?9:6)*TAU,64,10,{spr:'wisp',st:'seek',turn:1.2,seekT:1.8,col:'#7af0d0',r:3,life:5});sfx('tool');}
   if(n==='reflect'&&!(e.clones||[]).some(c=>!c.dead)){e.clones=[];for(let i=0;i<(e.half?3:2);i++){const an=Math.random()*TAU,s=freeSpot(e,P.x+Math.cos(an)*80,P.y+Math.sin(an)*80,8);
     const c=mkEnemy('foxclone',s.x,s.y,e.room,R.di);Object.assign(c,{awake:true,sprOv:e.sprOv,hp:1,maxhp:1,lairClone:e});enemies.push(c);e.clones.push(c);spark(s.x,s.y,'#7af0d0',10,60);}
    txtFx(e.x,e.y-20,'WHICH ONE IS REAL?','#7af0d0',1.6);}
   if(n==='through'){const an=aimAt(e)+Math.PI+rnd(-.5,.5),s=freeSpot(e,P.x+Math.cos(an)*-50,P.y+Math.sin(an)*-50,e.r);spark(e.x,e.y,'#7af0d0',14,70);e.x=s.x;e.y=s.y;spark(e.x,e.y,'#d0fff4',14,70);sfx('dash');
    for(let i=0;i<(e.half?14:10);i++)bsh(e,e.x,e.y,i/(e.half?14:10)*TAU,58,10,{col:'#7af0d0',r:3});}}
  // reflections drift too, and fire hollow rings that do no harm
  for(const c of e.clones||[]){if(c.dead)continue;c.ct=(c.ct||rnd(.5,1.5))-dt;if(c.ct<=0){c.ct=1.6;for(let i=0;i<8;i++)fakeShot(e,c.x,c.y,i/8*TAU,52,{col:'#a8e8dc',r:3,life:3});}}}
};
// a lair boss's death: the rare rewards, and the lair stays beaten for the rest of the run
{const _k=killE;killE=function(e){const L=e.lairBoss,was=L&&!e.dead;_k(e);
 if(was&&e.dead){if(L.onDeath)L.onDeath(e);for(const q of projs)if(q.own===e)q.dead=true;for(const c of e.clones||[])if(!c.dead)c.dead=true;for(const o of enemies)if(!o.dead&&o.type==='spiderling'&&o.room===e.room)o.dead=true;
  (R.lairDone??={})[L.stage]=1;if(L.unique&&ITEMBY[L.unique]){applyItem(L.unique);fxRing(P.x,P.y,40,L.col,.6);}dropBag(e.x-10,e.y+10,GOLDBAG,true);dropBag(e.x+12,e.y+12,TROPHY,true);for(let i=0;i<8;i++)dropPickup(e.x,e.y,'sen',Math.round(rnd(8,14)*(1+R.di*.3)*S.sen));
  addScore(6000,e.x,e.y,L.col);setToast(L.unique?'GUARANTEED BONUS: '+ITEMBY[L.unique].name+' - '+ITEMBY[L.unique].d:L.name+' IS SLAIN. ITS HOARD IS YOURS','#ffd040',5);shake=Math.max(shake,8);fxRing(e.x,e.y,80,L.col,.7);}};}
// its health bar across the top while you are in the lair
{const _h=drawHUD;drawHUD=function(){_h();for(const e of enemies){const L=e.lairBoss;if(!L||e.dead||!e.awake||!inRoomR(e.room,P.x,P.y))continue;
  const w=140,x=Math.round((W-w)/2);txt(L.name,x+Math.round((w-txtW(L.name))/2),14,L.col);bar(x,21,w,4,e.hp/e.maxhp,L.col,'#2a1020');break;}
 if((R&&R.keys)>0){const s='LAIR KEY x'+R.keys;txt(s,4,H-36,'#e0b040');}};}

// a reflection struck down is only an illusion
{const _k2=killE;killE=function(e){const was=e.lairClone&&!e.dead;_k2(e);if(was&&e.dead){spark(e.x,e.y,'#7af0d0',12,60);txtFx(e.x,e.y,'ONLY A REFLECTION','#a8e8dc',1);}};}
// ---- the Pillar Stone: the hitobashira's guaranteed bonus, found nowhere else
ITEMS.push({id:'pillar',name:'PILLAR STONE',d:'+1 REVIVE AND +30 MAX HP',g:'P',r:3});ITEMBY.pillar=ITEMS[ITEMS.length-1];FXK.pillar='guard';RELICMO.pillar='shield';
{const _ri=randItem;randItem=function(excl,minR){return _ri((excl||[]).concat(['pillar']),minR);};}
{const _ai=applyItem;applyItem=function(id){if(id==='pillar')P.rez=(P.rez||0)+1;return _ai.apply(this,arguments);};}
{const _cs=calcStats;calcStats=function(){const s=_cs();if(R&&R.inv&&R.inv.pillar){s.maxhp+=30*R.inv.pillar;}return s;};}
