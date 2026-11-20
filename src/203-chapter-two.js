'use strict';
// Chapter II opens at the gate below the lake. The ferryman's safe lanes are fixed when he shows the warning.
const FERRY={name:'SAZANAMI, FERRYMAN OF THE HOLLOW',jade:'#8ce4d3',amber:'#ffbf75',pale:'#d8fff4',dark:'#18282c'};
defDeco('ferrybeacon',14,24,R=>{R(6,2,2,20,'#695950');R(2,8,10,2,'#191f25');R(3,10,8,9,'#202c2d');
 R(4,11,6,7,'#df985b');R(6,11,2,6,'#ffdfa2');R(2,19,10,2,'#1a2327');R(4,22,6,2,'#493f42');},{glow:{c:'#ffbb68',y:-11,r:7}});
function ferryFloor(g,r,cx,cy,x,y,X,Y){const h=hash(x*13,y*7),a=(x-cx)*2;
 if(r.k==='boss'&&Math.abs(a%12)<2)fDia(g,X,Y,'#739c92',.27,2);
 if(h<.56){g.fillStyle=h<.3?'#182529':'#2f3c3d';g.fillRect(X-7+(x&1)*3,Y+6,9,1);g.fillRect(X-4,Y+11,12,1);}
 if(h>.94)fDia(g,X,Y,'#76837b',.18,4);}
const FERRY_STAGE=lateAdd({base:ECL_I,remix:false,indoor:true,
 story:'CHAPTER II - THE FERRYMAN GUARDS THE ROAD BELOW THE LAKE',
 tale:'WHEN GETSUREI\'S MIRROR BREAKS, THE BLACK LAKE DRAINS THROUGH A GATE IN THE STONE. SAZANAMI HAS CARRIED THE DEAD THROUGH IT FOR CENTURIES. THIS TIME HE LEAVES THE FERRY TO FIGHT.',
 scn:{gr:['#152426','#1c3030'],seal:'tomoe',wall:'temple',out:'garden'},scatter:[['ferrybeacon',3],['shimerock',3]],
 t:{DUN:{name:'THE GATE OF STILL WATER',fl:['#263335','#2c3839'],sp:'#17282b',wt:'#102024',wf:'#2f3e3e',we:'#87aaa0',cloth:'#b4704f',dark:'#132125',acc:FERRY.jade,
  pool:['weaver','warden','orbiter','herald','splitter','kitsune','seer','herald','warden','splitter']},
  ENV:{k:'planks',liq:0,amt:0,lc:['#0a191f','#122a30','#637d78'],wall:'temple',fl:['#263335','#2c3839'],sp:'#17282b'},
  ROMAN:'XV',STAGEDECO:[['ferrybeacon',6],['shimerock',3],['susuki',4],['offering',2]],
  DECO_GROUPS:[[['ferrybeacon',-16,0],['offering',0,6],['ferrybeacon',16,0]],[['shimerock',0,0],['susuki',-10,8],['susuki',10,8]]],
  FLOORART:ferryFloor,MOOD:['#061a1e',.38],PSTAGE:['insen',47,64],BMUSIC:{s:'insen',r:44,b:140,w:'triangle'},
  TRAILS:{n:'FERRY LIGHT',c:FERRY.jade,c2:FERRY.amber},BOSS_HPT:10.5,POOLADD:[],PMAP:[.97,.04],
  MASTER_LINES:'SAZANAMI\'S LANTERNS GO OUT. THE GATE STANDS OPEN AND THE ABYSS LIES BEYOND IT. TAKE THE ROAD DOWN, OR RETURN WITH YOUR STORY.',
  BOSSRELIC:{id:'ferrytoken',name:'FERRYMAN\'S TOKEN',d:'A PERFECT DODGE GRANTS A BRIEF BURST OF MOVEMENT SPEED (3 SECOND COOLDOWN)',g:'T',fx:'speed',mo:'vortex'},
  BOSS:{name:FERRY.name,hp:2980,hat:'kasa',pref:95,spd:41,r:12,k1:[],k2:[],pal:basePal('#48746f','#25625b','#f2ae68','#152628')},
  BSTYLE:{c:FERRY.jade,t:['THE FERRYMAN','THE LAST CROSSING','THE GATE OPENS'],ph:[[{pat:'gapring',cnt:16,sp:52,col:FERRY.jade}],[{pat:'aimedring',cnt:18,sp:58,col:FERRY.amber}]]},
  BMODES:['circle','blink'],BMOTIF:[0,1,5,7,5,1,0,null,0,5,8,7,5,1,0,null]}});
MASTER_LINES[ECL_I]='THE MIRROR IS BROKEN. THE LAKE DRAINS INTO CHAPTER II: '+DUN[FERRY_STAGE].name+'. TAKE THE ROAD THROUGH THE GATE TO REACH THE ABYSS.';

function ferryArt(p,Q){const {R,E,L,seg,trap,arm,leg,by}=HUM(p,Q),j=ARTHURT?'#537068':'#325950',iv='#d1cdb2',brim='#1b2729';
 for(const side of [-1,1])leg(36+side*5,49,36+side*8,62,36+side*10,74,brim,j,'#594d46',5);
 trap(36,26+by,65,12,21,j,{pleats:3});trap(36,26+by,51,8,11,'#557b69');
 L(23,33+by,43,53+by,iv,2);R(23,48+by,26,4,'#211d1c');R(24,48+by,23,1,'#d2ac65');
 arm([[26,30],[18,41],[20,50]],j,'#1b3e38',iv,5);const near=Q.near||[[46,31],[51,42],[48,48]];arm(near,j,'#1b3e38',iv,5);
 const [hx,hy]=near[2],poleX=hx+7;seg(hx-5,68,hx+11,8+by,3,brim);L(hx-4,66,hx+11,8+by,'#ac8a63',1);
 L(hx+12,8+by,poleX+7,19+by,iv,1);R(poleX+2,19+by,11,10,brim);R(poleX+4,20+by,7,7,ARTHURT?'#ffc77c':'#a9e9d3');R(poleX+6,21+by,3,5,'#fff1bf');
 E(36,21+by,9,11,brim);E(36,22+by,7,9,'#b4a98b');R(30,20+by,12,3,'#172323');R(32,21+by,2,1,FERRY.amber);R(39,21+by,2,1,FERRY.amber);
 trap(36,5+by,17+by,5,19,brim);trap(36,6+by,15+by,3,15,'#697b62');R(17,16+by,38,3,'#b09764');R(15,19+by,42,2,brim);
 for(const side of [-1,1]){L(36+side*14,19+by,36+side*13,33+by,'#b2a983',1);R(36+side*13,31+by,2,4,'#e6b171');}}
humBoss(FERRY.name,ferryArt,{idle0:{},idle1:{b:1},atk:{near:[[46,31],[52,26],[48,23]],dy:-1}},{sc:1.13});

// The crossing is a sequence of floor strikes. The entire marked shape is dangerous, and the bright lane is safe.
function ferryBand(e,E,lo,hi,t){const A=E.arena,h=E.axis==='x';if(hi<=lo)return;
 const box=h?{x0:lo,x1:hi,y0:A.y0-T,y1:A.y1+T}:{x0:A.x0-T,x1:A.x1+T,y0:lo,y1:hi};
 mark(Object.assign(box,{k:'rect',t,stay:.36,grow:false,col:E.beat===3?'#ea7f65':'#ce7463',dmg:13*e.dm,src:e,survival:E,quiet:true}));}
function ferryCrossing(at,axis,width){return {at,dur:14,name:axis==='x'?'THE STILL WATER CROSSING':'THE LAST CROSSING',hint:'MOVE TO THE LIT LANE',survival:true,storm:1,ownPressure:true,
 start(e,E){const A=E.arena=arenaOf(e);E.axis=axis;E.mid=axis==='x'?A.cx:A.cy;
  E.lo=(axis==='x'?A.x0:A.y0)-T;E.hi=(axis==='x'?A.x1:A.y1)+T;
  E.side=P[axis]<E.mid?1:-1;E.edge=E.mid+E.side*102;E.home=freeSpot(e,A.cx,A.cy-54,e.r);E.hint='FIND THE CENTRE LANE';},
 tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*4);e.y+=(E.home.y-e.y)*Math.min(1,dt*4);
  if(!E.beat){E.beat=1;E.safe=E.mid;E.width=width+8;E.shut=4.1;ferryBand(e,E,E.lo,E.safe-E.width,4.1);ferryBand(e,E,E.safe+E.width,E.hi,4.1);snd('bell');}
  else if(E.beat===1&&E.t>=4.9){E.beat=2;E.safe=E.edge;E.width=width;E.shut=8.2;E.hint='CROSS TO THE LIT FAR LANE';
   ferryBand(e,E,E.lo,E.safe-width,3.3);ferryBand(e,E,E.safe+width,E.hi,3.3);snd('puppetPluck');}
  else if(E.beat===2&&E.t>=9.1){E.beat=3;E.shut=12.4;E.hint='HOLD THE LANE THROUGH THE SWEEP';const L=E.safe-width,R=E.safe+width;
   const outer=E.side>0?E.lo:E.hi,near=E.side>0?L:R;for(let i=0;i<5;i++){
    const a=lerp(outer,near,i/5),b=lerp(outer,near,(i+1)/5);ferryBand(e,E,Math.min(a,b)-.4,Math.max(a,b)+.4,1.75+i*.33);}
   if(E.side>0)ferryBand(e,E,R,E.hi,3.05);else ferryBand(e,E,E.lo,L,3.05);snd('bell');}},
 end(e,E){e.ferryWait=1.6;}};}
function drawFerryLane(e){const E=e.EV,A0=e.A;
 if(!E?.beat){if(A0?.n==='LANTERN FERRY'&&A0.arena&&!A0.waves){const B=A0.arena;
   ctx.save();worldXf();ctx.globalAlpha=.4;ctx.strokeStyle=FERRY.jade;ctx.setLineDash([4,5]);ctx.strokeRect(B.x0,A0.origin-51,B.x1-B.x0,66);ctx.restore();}return;}
 const A=E.arena,h=E.axis==='x',lo=E.safe-E.width,hi=E.safe+E.width;
 ctx.save();worldXf();ctx.globalAlpha=E.t<E.shut?.68:.32;ctx.fillStyle=FERRY.jade;ctx.strokeStyle=FERRY.pale;ctx.lineWidth=1.6;
 ctx.setLineDash([6,4]);ctx.strokeRect(h?lo:A.x0,h?A.y0:lo,h?hi-lo:A.x1-A.x0,h?A.y1-A.y0:hi-lo);ctx.setLineDash([]);
 ctx.globalAlpha=.15;ctx.fillRect(h?lo:A.x0,h?A.y0:lo,h?hi-lo:A.x1-A.x0,h?A.y1-A.y0:hi-lo);
 if(E.beat===2&&E.t<E.shut){ctx.globalAlpha=.75;ctx.strokeStyle=FERRY.pale;ctx.lineWidth=2;
  for(const o of [-34,0,34])for(const f of [.34,.57,.8]){const v=lerp(E.mid,E.safe,f),d=E.side*8,other=(h?A.cy:A.cx)+o;
   ctx.beginPath();if(h){ctx.moveTo(v-d,other-5);ctx.lineTo(v,other);ctx.lineTo(v-d,other+5);}else{ctx.moveTo(other-5,v-d);ctx.lineTo(other,v);ctx.lineTo(other+5,v-d);}ctx.stroke();}}
 ctx.restore();}

// Normal attacks introduce the two rules separately: follow a lit gap, then move when the toll marks your position.
function clearFerryMarks(e,A){for(const m of A.marks||[]){const i=BMK.indexOf(m);if(i>=0)BMK.splice(i,1);}}
const FERRY_ATTACKS=[
 {n:'LANTERN FERRY',wt:3,gap:.88,run(e,A){
  if(at(A,0)){A.arena=arenaOf(e);A.origin=clamp(P.y,A.arena.y0+56,A.arena.y1-56);A.dir=P.x<A.arena.cx?1:-1;A.waves=0;e.tele=1;snd('bell');}
  const B=A.arena,step=e.half?.57:.76;if(A.waves<(e.half?4:3)&&A.t>=.88+A.waves*step){
   e.tele=0;const dir=A.waves%2?-A.dir:A.dir,gap=A.origin+((A.waves%3)-1)*19,sp=e.half?154:132;A.waves++;
   for(let y=B.y0+5;y<B.y1;y+=14){if(Math.abs(y-gap)<33)continue;
    bsh(e,dir>0?B.x0+6:B.x1-6,y,dir>0?0:Math.PI,sp,5,{r:3,spr:'bgrain',life:4.4,col:dir>0?FERRY.jade:FERRY.amber});}
   sfx('shoot');}
  return A.t>(e.half?3.3:2.9);}},
 {n:'ANCHOR TOLL',wt:2,gap:1.18,end:clearFerryMarks,run(e,A){const count=e.half?3:2,next=e.half?.63:.82;
  if(at(A,0)){A.waves=0;A.marks=[];e.tele=1;}
  if(A.waves<count&&A.t>=.13+A.waves*next){A.waves++;const x=P.x,y=P.y,n=e.half?15:12;
   const m=mark({k:'c',x,y,r:e.half?29:26,t:.84,dmg:12*e.dm,col:FERRY.amber,src:e,quiet:true,on(){
    const a=aimAt(e,x,y);for(let i=-3;i<=3;i++){if(i===0)continue;const q=a+i*.2;bsh(e,e.x,e.y,q,112+3*n,6,{r:3,spr:'bshard',life:1.8,col:FERRY.pale});}
    fxRing(x,y,m.r,FERRY.amber,.34);snd('sumoStomp');}});A.marks.push(m);}
  if(A.t>1.1)e.tele=0;return A.t>(e.half?2.55:2.25);}},
 {n:'MOORING CUT',half:1,wt:2,gap:1.05,end:clearFerryMarks,run(e,A){
  if(at(A,0)){const a=aimAt(e),D=arenaOf(e);e.tele=2;A.marks=[];for(const off of [-.26,.26])A.marks.push(mark({k:'l',x:e.x,y:e.y,a:a+off,len:D.R*1.65,w:13,t:1.03,stay:.25,dmg:14*e.dm,col:FERRY.amber,src:e,quiet:true}));snd('puppetPluck');}
  if(at(A,1.03)){e.tele=0;snd('spearSteel');}return A.t>1.65;}}
];
BKIT[FERRY.name]={director:bossDirector,noContact:true,pref:98,halfName:'THE LANTERNS GO RED',
 guide:['THE GATE OF STILL WATER OPENS CHAPTER II. SAZANAMI GUARDS THE ROAD INTO THE ABYSS.',
  'LANTERN FERRY: FIND THE GAP IN THE SHOTS FROM EITHER BANK. ANCHOR TOLL MARKS THE GROUND UNDERFOOT.',
  'DURING THE CROSSING, MOVE TO THE LIT CENTRE LANE. THEN CROSS TO THE FAR LANE AND HOLD THROUGH THE SWEEP.'],
 events:[ferryCrossing(.68,'x',43),ferryCrossing(.24,'y',38)],atks:FERRY_ATTACKS,floor:drawFerryLane,
 reset(e){e.ferryWait=0;},
 move(e,dt,d,a){if(e.ferryWait>0){e.ferryWait-=dt;e.gapT=Math.max(e.gapT,e.ferryWait);return;}defaultMove(e,dt,d,a,BKIT[FERRY.name]);}};

{const _pd=perfectDodge;perfectDodge=function(){const n=R?.pdodge,r=_pd.apply(this,arguments);
 if(R?.inv.ferrytoken&&R.pdodge!==n&&R.time>=(P.ferryReady||0)){P.ferryReady=R.time+3;P.haste=Math.max(P.haste,.85);}return r;};}
