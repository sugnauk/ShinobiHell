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

// A bank follows the shape of the walkable room, including its clipped corners.
function ferryBank(A,y,dir,pad){
 const start=dir>0?A.x0+pad:A.x1-pad;
 for(let x=start;dir*(A.cx-x)>=0;x+=dir*2)if(!blocked(x,y,pad))return x;
 return null;
}
function ferryCue(e,state,row){
 state.cue=row;e.tele=1;snd('bell');
}
function ferryRows(e,state,slots,gap,shift,first,lead=1){
 const A=state.arena=arenaOf(e);
 const origin=clamp(P.y,A.cy-32,A.cy+32);
 state.rows=slots.map((t,i)=>({t,lead,y:origin+(i%2?shift:0),gap,dir:i%2?-first:first}));
}
function ferryWave(e,A,row){
 const shots=[],speed=95,col=row.dir>0?FERRY.jade:FERRY.amber;
 for(let y=A.y0+8;y<A.y1-7;y+=13){
  if(Math.abs(y-row.y)<row.gap/2+3)continue;
  const x=ferryBank(A,y,row.dir,5);
  if(x==null)continue;
  // The water carries a row across the arena; it dissipates at the other bank.
  const far=ferryBank(A,y,-row.dir,5);
  if(far==null||Math.abs(far-x)<30)continue;
  shots.push(bhNew(x,y,row.dir>0?0:Math.PI,speed,5*e.dm,{r:3,col,spr:'bgrain',
   own:e,life:Math.abs(far-x)/(speed*(1+.06*(R.asc||0))),ferryRow:true}));
 }
 bhFair(shots,null);
 for(const q of shots)if(!q.dead)projs.push(q);else if(BHPOOL.length<4000)BHPOOL.push(q);
 sfx('shoot');
}
function ferryStep(e,S){
 for(const row of S.rows){
  if(at(S,row.t-row.lead))ferryCue(e,S,row);
  if(at(S,row.t)){
   ferryWave(e,S.arena,row);S.release=S.t;
   if(S.cue===row)S.cue=null;
   e.tele=S.cue?1:0;
  }
 }
}
function drawFerryLane(e){
 const S=e.EV||e.A,row=S?.cue||(S?.cut?S.rows.at(-1):null);
 if(!row)return;
 const A=S.arena,lo=row.y-row.gap/2,hi=row.y+row.gap/2;
 ctx.save();worldXf();
 // Narrow bands of light fill the safe channel. Arrows point away from the firing bank.
 ctx.fillStyle=row.dir>0?FERRY.jade:FERRY.amber;ctx.globalAlpha=.19;
 for(let y=lo;y<hi;y+=3){
  const x0=ferryBank(A,y,1,4),x1=ferryBank(A,y,-1,4);
  if(x0!=null&&x1!=null)ctx.fillRect(x0,y,x1-x0,Math.min(3,hi-y));
 }
 ctx.globalAlpha=.95;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=2;
 const arrow=(x,y)=>{
  ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+row.dir*8,y);ctx.lineTo(x,y+5);ctx.stroke();
 };
 for(const y of S.cue?[lo+7,row.y,hi-7]:[]){
  const bank=ferryBank(A,y,row.dir,6);
  if(bank!=null)arrow(bank+row.dir*10,y);
 }
 // The bank can be off-screen on phones. Repeat the direction cue within the camera's view.
 if(S.cue){
  for(const off of [-26,26]){
   const x=clamp(P.x+off,A.x0+16,A.x1-16);
   if(!blocked(x,row.y,12))arrow(x,row.y);
  }
 }
 ctx.restore();
}
function ferryToll(e,S){
 const A=S.arena,r=23,y=clamp(P.y,A.y0+r+4,A.y1-r-4),x=clamp(P.x,A.x0+r+4,A.x1-r-4);
 // Keep the route between consecutive gaps clear, even if the player is already in it.
 if(S.rows.some(row=>Math.abs(y-row.y)<row.gap/2+r+8)||blocked(x,y,r+3))return;
 S.marks.push(mark({k:'c',x,y,r,t:1.15,dmg:12*e.dm,col:FERRY.amber,src:e,quiet:true,ferryCheck:true,on(){
  fxRing(x,y,r,FERRY.amber,.34);snd('sumoStomp');
 }}));
}
function ferryMooringCut(e,S){
 const A=S.arena,row=S.rows.at(-1),w=12,pad=w/2+2;
 for(const side of [-1,1]){
  const dir=side*row.dir,y=row.y+side*(row.gap/2+10),x=ferryBank(A,y,dir,pad);
  if(x==null)continue;
  let len=0;
  for(let d=2;d<=A.x1-A.x0;d+=2){
   const u=x+dir*d;
   if(u<A.x0+pad||u>A.x1-pad||blocked(u,y,pad))break;
   len=d;
  }
  if(len<24)continue;
  S.marks.push(mark({k:'l',x,y,a:dir>0?0:Math.PI,len,w,t:1.1,stay:.25,grow:false,
   dmg:13*e.dm,col:FERRY.amber,src:e,quiet:true,ferryCheck:true}));
 }
 if(S.marks.length){S.cut=true;e.tele=1;snd('puppetPluck');}
}
function ferryClear(e){
 for(const q of projs)if(q.own===e&&q.ferryRow)q.dead=true;
}
function ferryEnd(e,S){
 for(const m of S.marks??[]){const i=BMK.indexOf(m);if(i>=0&&!m.fired)BMK.splice(i,1);}
 S.cue=null;ferryClear(e);
}
const lanternFerry={n:'LANTERN FERRY',wt:1,gap:.45,run(e,S){
 if(at(S,0)){
  const cycle=e.ferryCycle++;
  // Each form opens with a solo demonstration. The first red-lantern row comes from the other bank.
  const demo=cycle===0,first=(e.half?-1:1)*(cycle%2?-1:1);
  ferryRows(e,S,[1,1.95,2.9],e.half?48:60,demo?0:(cycle%2?-18:18),first,.9);
  S.demo=demo;S.marks=[];
 }
 ferryStep(e,S);
 if(!S.demo&&at(S,2.12))ferryToll(e,S);
 if(e.half&&!S.demo&&at(S,4.15))ferryMooringCut(e,S);
 if(S.cut&&at(S,5.25)){S.cut=false;S.release=S.t;e.tele=0;snd('spearSteel');}
 if(at(S,5.9)){ferryClear(e);S.recover=true;e.tele=0;fxRing(e.x,e.y,24,FERRY.jade,.45);}
 // The ferryman holds still through the whole opening so melee can close.
 return S.t>=7.5;
},end:ferryEnd};
const lastCrossing={at:.24,dur:12,name:'THE LAST CROSSING',hint:'FOLLOW THE LIGHT. WATCH THE NEXT BANK.',survival:true,storm:1,ownPressure:true,
 start(e,S){
  ferryRows(e,S,[1.15,2.1,4.3,5.25,7.35,8.3,9.25],48,18,1,.9);
  // The final sweep comes from one bank instead of alternating again.
  S.rows[5].dir=S.rows[4].dir;S.rows[6].dir=S.rows[4].dir;
 },
 tick(e,dt,S){ferryStep(e,S);},
 end(e,S){ferryEnd(e,S);e.ferryWait=1.8;fxRing(e.x,e.y,29,FERRY.jade,.55);}
};
BKIT[FERRY.name]={director:bossDirector,noContact:true,pref:78,halfName:'THE LANTERNS GO RED',
 guide:['THE LANTERN LIGHTS THE NEXT GAP. THE ARROWS SHOW WHICH BANK FIRES.',
  'FOLLOW THE GAPS. IF AN ANCHOR MARKS THE OLD LANE, KEEP CROSSING.',
  'RED LANTERNS REVERSE THE FIRST BANK. MOORING CUT SWEEPS BESIDE THE LAST GAP. STRIKE WHEN HIS LANTERN DROPS.'],
 events:[lastCrossing],atks:[lanternFerry],floor:drawFerryLane,
 init(e){e.ferryCycle=0;},
 onHalf(e){ferryClear(e);e.ferryCycle=0;},
 reset(e){ferryClear(e);e.ferryWait=0;},
 onDeath:ferryClear,
 move(e,dt,d,a){
  if(e.ferryWait>0){e.ferryWait-=dt;e.gapT=Math.max(e.gapT,e.ferryWait);return;}
  defaultMove(e,dt,d,a,BKIT[FERRY.name]);
 }};

{const _pd=perfectDodge;perfectDodge=function(){const n=R?.pdodge,r=_pd.apply(this,arguments);
 if(R?.inv.ferrytoken&&R.pdodge!==n&&R.time>=(P.ferryReady||0)){P.ferryReady=R.time+3;P.haste=Math.max(P.haste,.85);}return r;};}
