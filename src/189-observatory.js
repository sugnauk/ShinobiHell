'use strict';
// SHINOBIDUNGEONS - STAGE XIII: THE STARFALL OBSERVATORY (tier 3, advanced late game).
// Beyond the throne, the Emperor's astrologers kept a tower above the clouds; from it they read his victories in the
// stars and wrote the omens that sent armies marching. Its keeper, HOSHIYOMI THE STAR READER, still reads the sky.
// Signature challenge: CONSTELLATIONS - star nodes appear, warn, and are joined by lines of light; the lanes between
// them are where you live. The stage's foes coordinate: a Herald times its allies' attacks into one combined volley.
// New foes (late archetypes, each with its own sprite and a readable warning before it attacks):
//  WEAVER     (pattern weaver) slow, long-lived star spirals that shape where you can walk
//  SEER       (sniper)        a red sight-line warns where it will shoot - and it aims where you are GOING
//  ORBITER    (orbiter)       circles you at a distance and looses fans from the side
//  SPLITTER   (splitter)      lobs heavy orbs that flash, then burst into rings
//  WARDEN     (suppressor)    marches curtains of shards across the room, each with one gap
//  HERALD     (coordinator)   beats a drum: every late foe near it fires at once, on its beat
const OBS={c:'#c8a0ff',c2:'#80d0ff',gold:'#e0c070',ink:'#14101a'};
// ---------------- furnishings ----------------
(function obsDecos(){
 defDeco('armillary',14,20,(R)=>{R(6,14,2,6,'#6a4a20');R(3,19,8,1,'#8a6a30');for(let a=0;a<14;a++){const t=a/14*Math.PI*2;R(Math.round(7+Math.cos(t)*6),Math.round(7+Math.sin(t)*6),1,1,'#c8a050');R(Math.round(7+Math.cos(t)*6*.4),Math.round(7+Math.sin(t)*6),1,1,'#a07a30');}R(1,7,13,1,'#e0c070');R(6,6,2,2,'#ffe8a0');},{big:1,glow:{c:'#e0c070',y:-12,r:6}});
 defDeco('telescope',14,16,(R)=>{for(let i=0;i<10;i++)R(2+i,9-Math.round(i*.7),3,2,i<7?'#a07a30':'#c8a050');R(11,1,3,3,'#e0c070');R(12,2,1,1,'#80d0ff');R(5,9,1,7,'#5a3a1a');R(2,15,1,1,'#5a3a1a');R(8,15,1,1,'#5a3a1a');L2(R,5,10,2,15,'#5a3a1a');L2(R,6,10,9,15,'#5a3a1a');},{big:1});
 defDeco('starchart',12,18,(R)=>{R(0,0,12,16,'#1e2240');R(1,1,10,14,'#2a2e58');for(const [x,y] of [[2,3],[5,2],[8,5],[4,8],[9,10],[3,12],[7,13]])R(x,y,1,1,'#ffe8a0');R(2,3,3,1,'#c8a050');R(5,3,1,3,'#8a7a50');R(0,0,12,1,'#c8a050');R(0,15,12,1,'#c8a050');R(1,16,1,2,'#5a3a1a');R(10,16,1,2,'#5a3a1a');},{big:0});
 defDeco('candelabra',8,16,(R)=>{R(3,4,2,11,'#8a6a30');R(1,15,6,1,'#8a6a30');R(0,4,8,1,'#a07a30');for(const x of [0,3,6]){R(x,1,2,3,'#f0e8d0');R(x,0,2,1,'#ffd060');}},{big:0,fire:{y:-15,s:2},glow:{c:'#ffd070',y:-15,r:8}});
 defDeco('celglobe',12,16,(R)=>{for(let y=0;y<10;y++){const w=Math.round(Math.sqrt(25-(y-4.5)*(y-4.5))*2);R(6-w/2,y,w,1,y%3?'#2a3a6a':'#3a4a8a');}for(const [x,y] of [[4,2],[7,4],[5,7],[8,6]])R(x,y,1,1,'#ffe8a0');R(0,4,12,1,'#c8a050');R(5,10,2,4,'#6a4a20');R(2,14,8,2,'#8a6a30');},{big:0});
 defDeco('stardesk',16,10,(R)=>{R(0,3,16,3,'#5a3a20');R(0,3,16,1,'#8a5a30');R(1,6,2,4,'#3a2414');R(13,6,2,4,'#3a2414');R(2,1,5,2,'#e8e0c8');R(9,0,5,3,'#2a2e58');R(10,1,1,1,'#ffe8a0');R(12,1,1,1,'#ffe8a0');R(3,1,3,1,'#c8a050');},{big:0});
 function L2(R,x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)R(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1,c);}
})();
// the walls: indigo stone courses with a gold band and inlaid stars, capped with slate-blue dome tiles
{const _pw=paintWall;paintWall=function(g,st,faces,tall,v){if(st!=='observatory')return _pw.apply(this,arguments);const h=tall?17:5;
 block(g,faces,h,()=>'#2a3060',(x,k,H)=>x%8===0?'#14162e':k===3?'#c8a050':(k>4&&hash(x*5+v,k*3)<.05)?'#ffe8a0':k%5===0?'#1a1c3a':'#262a52',(x,k,H)=>x%8===0?'#0c0e20':k===3?'#8a6a30':(k>4&&hash(x*7+v,k*5)<.04)?'#c8b070':k%5===0?'#121430':'#1a1e3e',
  (by,fy)=>{roofCap(g,by,'#1e2450','#2e3670','#c8a050');if(tall&&v===2){const j=fy(24);SP(g,'#80d0ff',8+24,by+j+8,1,1);SP(g,'#80d0ff',8+23,by+j+9,3,1);SP(g,'#80d0ff',8+24,by+j+10,1,1);}});};}
// the floor: night-blue stone with a gold star map inlaid, and a zodiac circle at the heart of the big rooms
const obsFloor=(g,r,cx,cy,x,y,X,Y)=>{const h=hash(x*7,y*3),d=Math.hypot((x-cx)/(r.w*.36),(y-cy)/(r.h*.36));
 if(Math.abs(d-1)<.08){fDia(g,X,Y,'#c8a050',.55,3);if(h<.3){g.fillStyle='#ffe8a0';g.fillRect(X,Y+8,1,1);}}
 else if(d<.95&&Math.abs(d-.55)<.05)fDia(g,X,Y,'#8a7a50',.4,4);
 if(h<.08){g.fillStyle=h<.03?'#ffffff':'#ffe8a0';g.fillRect(X-4+((h*900)|0)%9,Y+5+((h*700)|0)%7,1,1);}
 if(h>.94){g.strokeStyle='rgba(200,160,80,.35)';g.beginPath();g.moveTo(X-6,Y+8);g.lineTo(X+5,Y+4);g.stroke();}};
// ---------------- the stage ----------------
const OBS_I=lateAdd({base:10,tier:3,
 story:'THE EMPEROR\'S ASTROLOGERS READ HIS FATE IN THE STARS',abyss:'THE STARS STILL FALL',
 tale:'ABOVE THE CLOUDS STANDS THE TOWER WHERE THE EMPEROR\'S ASTROLOGERS READ HIS VICTORIES IN THE STARS AND WROTE THE OMENS THAT SENT ARMIES TO WAR. ITS KEEPER, HOSHIYOMI, STILL READS THE SKY - AND THE SKY ANSWERS HIM.',
 scn:{gr:['#0e1024','#121430'],seal:'tomoe',wall:'observatory'},
 scatter:[['candelabra',3],['stardesk',2],['celglobe',1]],
 t:{DUN:{name:'THE STARFALL OBSERVATORY',fl:['#1e2038','#24263e'],sp:'#161830',wt:'#0a0a18',wf:'#3a3a6a',we:'#c8a050',cloth:'#3a2e6a',dark:'#1e1a3a',acc:'#c8a0ff',
   pool:['weaver','seer','orbiter','splitter','warden','herald','weaver','seer','orbiter','splitter','assassin','shaman']},
  ENV:{k:'marble',liq:0,amt:0,lc:['#0a0c20','#141a3a','#a0c8ff'],wall:'palace',fl:['#1e2038','#24263e'],sp:'#161830'},
  ROMAN:'XIII',STAGEDECO:[['armillary',3],['telescope',3],['starchart',3],['candelabra',3],['celglobe',2],['stardesk',2]],
  DECO_GROUPS:[[['armillary',0,0],['candelabra',-16,8],['candelabra',16,8,1]],[['telescope',0,0],['stardesk',-18,10],['starchart',18,-6]],[['celglobe',0,0],['starchart',-14,-4],['starchart',14,-4,1]]],
  FLOORART:obsFloor,MOOD:['#06061a',.42],PSTAGE:['kumoi',47,70],BMUSIC:{s:'insen',r:44,b:118,w:'triangle'},
  TRAILS:{n:'STARFALL',c:'#c8a0ff',c2:'#ffffff'},BOSS_HPT:9.5,POOLADD:[],PMAP:[.97,.04],
  MASTER_LINES:'THE STAR READER IS SILENT. BELOW THE TOWER THE SKY GOES DARK - SOMETHING ECLIPSES THE MOON. WE GO ON, OR WE GO HOME AS VICTORS. IT IS YOUR CHOICE.',
  BOSSRELIC:{id:'orrery',name:'ORRERY CHARM',d:'THREE STAR WARDS ORBIT YOU. EACH BREAKS ONE SHOT, THEN RE-FORMS AFTER 8S',g:'O',fx:'guard',mo:'vortex'},
  BOSS:{name:'HOSHIYOMI, THE STAR READER',hp:2500,hat:'kasa',pref:95,spd:34,r:10,k1:[],k2:[],pal:null},
  BSTYLE:{c:'#c8a0ff',t:['CONSTELLATIONS','THE ORRERY','THE STAR CHART'],ph:[[{pat:'aimedring',cnt:12,sp:46,col:'#c8a0ff'}],[{pat:'aimedring',cnt:14,sp:48,col:'#c8a0ff'}],[{pat:'aimedring',cnt:16,sp:50,col:'#c8a0ff'}]]},
  BMODES:['circle','blink','circle'],BMOTIF:[0,4,7,9,7,4,2,null,0,2,4,7,4,2,0,null]}});
BOSS[OBS_I].pal=basePal('#2a2e6a','#1e1a3a','#c8a0ff','#0e0c1c');
// ---------------- late foes ----------------
// telegraph: a foe about to attack glows (a ring that tightens) so you always see it coming
const lateTele=(e,t,c)=>{e.lt0=t;e.ltT=t;e.ltCol=c;};
{const _de=typeof drawEnemy==='function'?drawEnemy:null;}
function lateFoe(k,o){ET[k]=Object.assign({hp:70,spd:28,pos:60,r:6,ai:'ranged',keep:90,rng:0,wl:8,atks:[],late:1,desc:o.desc},o.et);FOESPR[k]={draw:o.draw};if(o.sc)FOESC[k]=o.sc;LFOE[k]=o;}
const LFOE={};
lateFoe('weaver',{desc:'A PATTERN WEAVER. SLOW STAR SPIRALS SHAPE WHERE YOU CAN WALK.',et:{hp:45,spd:20,keep:110,r:6},sc:1,iv:5.5,tele:.8,col:'#c8a0ff',
 draw:({R,U,b})=>{U(4,3,10,4,'#2a2e58');U(5,2,8,1,'#3a3e78');U(6,1,6,1,'#c8a050');U(4,7,2,6,'#2a2e58');U(12,7,2,6,'#2a2e58');for(let y=12;y<22;y++)R(5-(y>17?1:0),y,8+(y>17?2:0),1,y%2?'#2a2e58':'#343868');R(7,15,4,1,'#c8a050');
  R(14,8+b,1,10,'#8a6a30');for(const [x,y] of [[15,9],[16,11],[15,13],[16,15]])R(x,y+b,1,1,'#ffe8a0');R(13,8+b,3,1,'#c8a050');},
 fire(e){bhStart(e,'spiral',{arms:3,spin:.38,rate:.24,sp:22,life:7.5,dur:2.4,spr:'bstar',col:'#c8a0ff',interlock:e.lateTier>=4?1:0})}});
lateFoe('seer',{desc:'A SNIPER. ITS RED SIGHT-LINE AIMS WHERE YOU ARE GOING - CHANGE DIRECTION.',et:{hp:30,spd:30,keep:130,r:5},iv:3.4,tele:.85,col:'#ff5060',
 draw:({R,U,b})=>{U(5,3,8,3,'#3a1a2a');U(4,5,10,1,'#c8a050');U(6,6,6,1,'#14101a');U(7,6,1,1,'#ff5060');U(10,6,1,1,'#ff5060');U(5,13,8,1,'#c8a050');
  for(let i=0;i<9;i++)R(2+Math.round(i*.2),8+i+b,1,1,'#8a6a30');R(0,9+b,4,2,'#c8c8d0');R(1,8+b,1,1,'#ff5060');},
 // the sight line points where you will be, so stepping the same way twice gets you hit
 aimAt(e){const V=BHT.pv,d=Math.hypot(P.x-e.x,P.y-e.y),tt=d/220+.85;return Math.atan2(P.y+V.vy*tt*.7-e.y,P.x+V.vx*tt*.7-e.x);},
 telegraph(e){e.sight=LFOE.seer.aimAt(e);},
 fire(e){const a=LFOE.seer.aimAt(e);const own=e;const fire=(an,sp,o)=>BHSTAGE.push(bhNew(e.x,e.y,an,sp,10*e.dm,Object.assign({r:2,col:'#ff5060',spr:'bcomet',own,life:2.5},o)));fire(a,220);for(const s of [-1,1])fire(a+s*.12,150,{col:'#ffa0a8'});e.sight=null;}});
lateFoe('orbiter',{desc:'CIRCLES YOU AT A DISTANCE AND FIRES FANS FROM THE SIDE.',et:{hp:34,spd:44,keep:85,r:5},iv:2.6,tele:.55,col:'#80d0ff',
 draw:({R,U,b})=>{U(4,4,10,6,'#1e3a5a');U(5,3,8,1,'#2a5a8a');U(6,6,2,1,'#80d0ff');U(10,6,2,1,'#80d0ff');for(let y=12;y<20;y++)R(4,y,10,1,y%2?'#1e3a5a':'#26486e');for(const [x,y] of [[1,10],[16,10],[1,16],[16,16]]){R(x,y+b,2,2,'#80d0ff');R(x,y+b,1,1,'#ffffff');}},
 move(e,dt){const t=(e.oa=(e.oa==null?Math.atan2(e.y-P.y,e.x-P.x):e.oa)+dt*.75*(e.odir||(e.odir=Math.random()<.5?1:-1)));const R0=e.lateTier>=4?78:88,tx=P.x+Math.cos(t)*R0,ty=P.y+Math.sin(t)*R0,dx=tx-e.x,dy=ty-e.y,l=Math.hypot(dx,dy);if(l>1){const s=Math.min(l,e.spd*1.6*dt);move(e,dx/l*s,dy/l*s,e.r);}},
 fire(e){const pa=Math.atan2(P.y-e.y,P.x-e.x),n=5;for(let i=0;i<n;i++)BHSTAGE.push(bhNew(e.x,e.y,pa+(i-(n-1)/2)*.2+.15*e.odir,64,9*e.dm,{r:2,col:'#80d0ff',spr:'bgrain',own:e,life:3.5}));}});
lateFoe('splitter',{desc:'LOBS HEAVY ORBS THAT FLASH, THEN BURST INTO RINGS.',et:{hp:40,spd:24,keep:120,r:6},iv:3.2,tele:.6,col:'#ffb070',
 draw:({R,U,b})=>{U(4,4,10,5,'#5a3a1e');U(5,3,8,1,'#7a5a2e');U(6,6,6,1,'#14101a');U(7,6,1,1,'#ffb070');U(10,6,1,1,'#ffb070');for(let y=12;y<21;y++)R(4-(y>17?1:0),y,10+(y>17?2:0),1,'#4a2e18');R(13,9+b,4,4,'#ffb070');R(14,10+b,2,2,'#ffffff');},
 fire(e){const pa=Math.atan2(P.y-e.y,P.x-e.x);BHSTAGE.push(bhNew(e.x,e.y,pa,40,11*e.dm,{bst:'burst',tb:1.2,bn:e.lateTier>=4?10:8,bv:42,r:4,col:'#ffb070',spr:'borb',own:e,life:3}));}});
lateFoe('warden',{desc:'A SUPPRESSOR. MARCHES CURTAINS OF SHARDS ACROSS THE ROOM, EACH WITH ONE GAP.',et:{hp:60,spd:18,keep:140,r:7,pos:120},sc:1.1,iv:4.6,tele:.9,col:'#a0f0ff',
 draw:({R,U,b})=>{U(3,3,12,5,'#3a4a5a');U(4,2,10,1,'#5a6a7a');U(6,5,6,1,'#14101a');U(8,5,2,1,'#a0f0ff');for(let y=11;y<21;y++)R(3,y,12,1,y%3?'#3a4a5a':'#4a5a6a');R(0,9+b,3,12,'#5a6a7a');R(0,9+b,3,1,'#a0f0ff');R(1,12+b,1,6,'#a0f0ff');},
 // a curtain of shards across your path, marching toward you, with one gap that changes each time
 fire(e){const pa=Math.atan2(P.y-e.y,P.x-e.x),pr=pa+Math.PI/2,n=13,g0=3+((Math.random()*(n-7))|0);for(let i=0;i<n;i++){if(i>=g0&&i<g0+3)continue;const off=(i-(n-1)/2)*11;BHSTAGE.push(bhNew(e.x+Math.cos(pr)*off,e.y+Math.sin(pr)*off,pa,40,10*e.dm,{r:2,col:'#a0f0ff',spr:'bshard',own:e,life:5}));}}});
lateFoe('herald',{desc:'A COORDINATOR. LINKS NEARBY ALLIES WITH GOLD LINES, THEN THEY ALL FIRE ON ITS BEAT.',et:{hp:50,spd:22,keep:120,r:6},iv:5,tele:1,col:'#ffd060',
 draw:({R,U,b})=>{U(4,4,10,5,'#5a1a2a');U(5,3,8,1,'#7a2a3a');U(6,6,6,1,'#14101a');U(4,12,10,9,'#5a1a2a');R(5,13,8,7,'#7a2a3a');R(6,15,6,4,'#c8a050');R(8,16,2,2,'#5a1a2a');R(15,2+b,1,18,'#5a3a1a');R(13,2+b,4,6,'#ffd060');R(14,3+b,2,4,'#c03030');},
 // links its allies, then everyone fires on the same beat
 telegraph(e){e.links=enemies.filter(o=>o!==e&&!o.dead&&o.awake&&LFOE[o.type]&&o.type!=='herald'&&Math.hypot(o.x-e.x,o.y-e.y)<150).slice(0,4);},
 fire(e){for(const o of e.links||[])if(!o.dead){LFOE[o.type].fire(o);o.lcd=LFOE[o.type].iv*(.8+Math.random()*.4);}e.links=null;
  const off=Math.random()*TAU,n=14,g=Math.atan2(P.y-e.y,P.x-e.x);for(let i=0;i<n;i++){const a=off+i/n*TAU;if(Math.abs(angDiff(a,g+Math.PI))<.5)continue;BHSTAGE.push(bhNew(e.x,e.y,a,38,9*e.dm,{r:3,col:'#ffd060',spr:'borb',own:e,life:4}));}}});
// their behaviour on top of the shared enemy update: stay in range (orbiters circle), warn, then attack
{const _ue=updEnemy;updEnemy=function(e,dt){const r=_ue.apply(this,arguments);const L=LFOE[e.type];if(!L||e.dead||!e.awake||!P)return r;
 if(e.stun>0||e.stag>0||(e.st&&e.st.frozen>0))return r;if(L.move)L.move(e,dt);
 if(e.ltT>0){e.ltT-=dt;if(e.ltT<=0){L.fire(e);bhCommit(null);sfx('shoot');e.lcd=L.iv*(.85+Math.random()*.3);}return r;}
 e.lcd=(e.lcd==null?1+Math.random()*1.5:e.lcd)-dt;if(e.lcd<=0&&Math.hypot(P.x-e.x,P.y-e.y)<230){e.lcd=99;lateTele(e,L.tele,L.col);if(L.telegraph)L.telegraph(e);}return r;};}
// the warnings: a tightening ring; the seer's red sight line; the herald's links to the allies it will command
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);for(const e of enemies){const L=LFOE[e.type];if(!L||e.dead||!(e.ltT>0))continue;const k=1-e.ltT/e.lt0,X=sx(e.x,e.y),Y=sy(e.x,e.y)-9;
  ctx.globalAlpha=.5+.5*k;ctx.strokeStyle=L.col;ctx.beginPath();ctx.arc(X,Y,Math.round(14-9*k),0,TAU);ctx.stroke();
  if(e.sight!=null){const ex=e.x+Math.cos(e.sight)*240,ey=e.y+Math.sin(e.sight)*240;ctx.globalAlpha=Math.floor(time*20)%2?.8:.4;ctx.strokeStyle='#ff3040';ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(sx(ex,ey),sy(ex,ey)-9);ctx.stroke();}
  if(e.links)for(const o of e.links){if(o.dead)continue;ctx.globalAlpha=.4+.4*k;ctx.strokeStyle='#ffd060';ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(sx(o.x,o.y),sy(o.x,o.y)-9);ctx.stroke();ctx.setLineDash([]);}}ctx.globalAlpha=1;};}
// ---------------- HOSHIYOMI, THE STAR READER ----------------
// An old court astrologer: a deep indigo hooded star-cloak embroidered with gold constellations, flaring to the floor;
// a long white beard; a staff crowned with a bronze armillary sphere; small stars circling his hood. Second form: the
// hood thrown back - a shaven head with a glowing star mark on the brow - the cloak torn, the stars turned red.
function hosDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const CL='#1e2250',CL2='#2a3070',CL3='#3a4290',GD='#d8b060',SK='#d8b090',BD='#eceef6',ST=two?'#ff6070':'#ffe8a0';
 // the cloak flaring to the floor, gold constellations on it
 trap(cx,24+by,72,10,18,CL,{pleats:3,hem:GD});for(const [x,y] of [[-10,58],[-6,52],[-2,60],[4,55],[9,62],[12,50],[-12,66],[6,68]]){R(cx+x,y+by,1,1,ST);}
 L(cx-10,58+by,cx-6,52+by,GD,1);L(cx-6,52+by,cx-2,60+by,GD,1);L(cx+4,55+by,cx+9,62+by,GD,1);L(cx+9,62+by,cx+12,50+by,GD,1);
 if(two){for(const [x,y] of [[-14,66],[10,64],[-4,70]])L(cx+x,y+by,cx+x+3,y+by+5,OUTC,1);}
 // the staff with its armillary sphere
 const sx2=Q.sx!=null?Q.sx:52,sy2=Q.sy!=null?Q.sy:8;L(sx2,sy2+by,sx2-2,70,OUTC,3);L(sx2,sy2+by,sx2-2,70,'#6a4a20',1);
 for(let a=0;a<16;a++){const t=a/16*TAU,rr=6;R(Math.round(sx2+Math.cos(t)*rr),Math.round(sy2+by+Math.sin(t)*rr),1,1,GD);R(Math.round(sx2+Math.cos(t)*rr*.35),Math.round(sy2+by+Math.sin(t)*rr),1,1,'#a07a30');}
 E(sx2,sy2+by,2,2,two?'#ff6070':'#ffe8a0');
 // arms in wide cloak sleeves; the far hand raised to the sky when he casts
 const far=Q.far||[[27,28],[21,36],[22,44]],near=Q.near||[[45,28],[50,30],[sx2-1,sy2+18]];
 arm(far,CL2,CL2,SK,5);arm(near,CL2,CL2,SK,5);
 // head: a hood with gold trim and a long white beard (hood back, star-marked brow in the second form)
 const hx=cx,hy=16+by;
 if(two){face(hx,hy,SK,{eye:'#ff6070',brow:'#9a9aa8',mouth:false});R(hx-1,hy-5,3,3,'#ff6070');R(hx,hy-6,1,5,'#ffd0d8');R(hx-3,hy+5,7,1,BD);trap(hx,hy+6,hy+16,3,6,BD);}
 else{E(hx,hy-1,9,9,OUTC);E(hx,hy-1,8,8,CL);E(hx-3,hy-3,3,3,CL3);face(hx,hy+1,SK,{eye:OUTC,brow:'#c8c8d0',mouth:false});R(hx-3,hy+5,7,1,BD);trap(hx,hy+6,hy+17,3,6,BD);R(hx-1,hy+6,3,1,'#c8c8d0');R(hx-8,hy+3,2,6,CL);R(hx+7,hy+3,2,6,CL);
  for(let a=-6;a<=6;a+=3)R(hx+a,hy-9+Math.abs(a)/3,2,1,GD);}
 // the stars circling his head
 for(let i=0;i<5;i++){const t=i/5*TAU+(p.f||0)*.6+(Q.spin||0),X=Math.round(hx+Math.cos(t)*14),Y=Math.round(hy-4+Math.sin(t)*5);R(X-1,Y,3,1,ST);R(X,Y-1,1,3,ST);}}
humBoss('HOSHIYOMI, THE STAR READER',hosDraw,{idle0:{},idle1:{b:1,spin:.6},
 atk:{dy:-2,far:[[27,28],[20,18],[18,8]],near:[[45,28],[51,26],[51,26]],sx:52,sy:6,spin:1.2}},{sc:1.15});
// signature 1: CONSTELLATION - star nodes appear around the arena, warn, then lines of light join them; then the
// stars burst into small rings. The lanes between the lines are where you stay.
BHP.constellation={fam:'sig',tags:['arena','zone'],cost:p=>2.5+.5*(p.n-4),def:{n:5,tele:1.2,stay:1.1,w:6,dur:3.4,col:'#c8a0ff',ring:6,rot:0},
 tick(I,dt){if(I.st.go)return;I.st.go=1;const p=I.p,A=I.A,pts=[],n=p.n;
  for(let k=0;k<40&&pts.length<n;k++){const x=A.x0+12+Math.random()*(A.x1-A.x0-24),y=A.y0+12+Math.random()*(A.y1-A.y0-24);if(Math.hypot(x-P.x,y-P.y)<34)continue;if(pts.some(q=>Math.hypot(q[0]-x,q[1]-y)<42))continue;pts.push([x,y]);}
  // order them into a path (nearest neighbour), so the lines form a figure rather than a tangle
  const path=[pts.shift()];while(pts.length){const l=path[path.length-1];pts.sort((a,b)=>Math.hypot(a[0]-l[0],a[1]-l[1])-Math.hypot(b[0]-l[0],b[1]-l[1]));path.push(pts.shift());}
  for(const [x,y] of path)bhFire(I,x,y,0,0,{bst:'burst',tb:p.tele+p.stay,bn:p.ring,bv:40,r:4,spr:'borb',life:p.tele+p.stay+.2,col:p.col,bcol:'#ffffff'});
  for(let i=0;i<path.length-1;i++){const [x0,y0]=path[i],[x1,y1]=path[i+1];bhLaser({x:x0,y:y0,a:Math.atan2(y1-y0,x1-x0),len:Math.hypot(x1-x0,y1-y0),fixedLen:1,w:p.w,tele:p.tele,stay:p.stay,col:p.col,dmg:(p.dmg||12)*((I.own&&I.own.dm)||1),own:I.own});}}};
// signature 2: THE ORRERY - shells of stars orbit him like planets at different speeds, then each shell is released
// along its orbit in turn, inner first, unwinding into spiral arms
BHP.orrery={fam:'sig',tags:['radial','field'],cost:p=>3+.5*(p.shells-2),def:{shells:3,per:7,sp:44,dur:4.2,col:'#ffe8a0'},
 tick(I,dt){if(I.st.go)return;I.st.go=1;const p=I.p,x=bhOX(I),y=bhOY(I);for(let s=0;s<p.shells;s++){const rad=14+s*11,ow=(s%2?-1:1)*(2.2-s*.4),to=1.1+s*.55,n=p.per+s*2;
  for(let i=0;i<n;i++)bhFire(I,x,y,0,0,{bst:'orbitrel',oc:I.own,ox:x,oy:y,oa:i/n*TAU,orad:rad,ow,to,rv:p.sp*(1+s*.12),rtan:1,spr:'bstar',r:3,col:s===1?'#80d0ff':p.col,life:to+5});}}};
// the climax (final event): THE FALLING HEAVENS - meteors fall in a sweeping line, a rotating pentagram of light turns
// round the arena while a slow galaxy spirals, and at the end the orrery unwinds one last time
BHP.heavens={fam:'sig',tags:['arena'],cost:()=>5,def:{dur:16,col:'#c8a0ff'},
 tick(I,dt){const p=I.p,A=I.A,t=I.t,st=I.st;
  if(t<5){if(every(I,'m',dt,.22)){const k=(st.k=(st.k||0)+1),f=(k%12)/12,ang=(st.a=(st.a||Math.random()*TAU)+.12),x=A.cx+Math.cos(ang)*(A.x1-A.x0)*.38*f,y=A.cy+Math.sin(ang)*(A.y1-A.y0)*.38*f;
    mark({k:'c',x,y,r:18,t:1,dmg:14*((I.own&&I.own.dm)||1),col:'#ffb070',src:I.own,on(){for(let i=0;i<6;i++)BHSTAGE.push(bhNew(x,y,i/6*TAU+k,36,9*((I.own&&I.own.dm)||1),{r:2,col:'#ffb070',spr:'bgrain',own:I.own,life:3}));bhCommit(null);}});}}
  if(t>=4.5&&!st.pent){st.pent=1;const n=5,R0=Math.min(A.x1-A.x0,A.y1-A.y0)*.36,a0=Math.random()*TAU,vtx=[];for(let i=0;i<n;i++){const a=a0+i*2*TAU/n;vtx.push(a);}
   for(let i=0;i<n;i++){const L0=bhLaser({x:0,y:0,a:0,len:10,fixedLen:1,w:6,tele:1.4,stay:6,col:p.col,dmg:14*((I.own&&I.own.dm)||1),own:I.own});L0.i=i;L0.free=1;
    L0.follow=(L,d)=>{const rot=Math.max(0,L.t-L.tele)*.32,a1=vtx[L.i]+rot,a2=vtx[(L.i+1)%n]+rot,x1=A.cx+Math.cos(a1)*R0,y1=A.cy+Math.sin(a1)*R0,x2=A.cx+Math.cos(a2)*R0,y2=A.cy+Math.sin(a2)*R0;L.x=x1;L.y=y1;L.a=Math.atan2(y2-y1,x2-x1);L.len=Math.hypot(x2-x1,y2-y1);L.om=0;};}}
  if(t>=5.5&&t<12&&every(I,'g',dt,.11)){const a=(st.ga=(st.ga||0)+.27);for(let i=0;i<3;i++)bhFire(I,A.cx,A.cy,a+i*TAU/3,38,{spr:'bstar',r:3,col:'#80d0ff',life:6});}
  if(t>=12&&!st.or){st.or=1;bhStart(I.own,'orrery',{shells:3,per:8,sp:46});}}};
// the director's menu for each phase: his signatures plus the general late library at his tier
const HOS_POOL={
 1:t=>[{n:'constellation',w:2.5,sig:1,gap:1.2,p:()=>({n:5,tele:1.2,stay:1.1})},{n:'spiral',w:1,p:()=>({arms:5,spin:.2,rate:.1,sp:46,col:'#c8a0ff',dur:5})},{n:'aimed',w:1,p:()=>({mode:'direct',n:3,sp:100,iv:.55,vol:4})}],
 2:t=>[{n:'constellation',w:1.6,sig:1,gap:1.1,p:()=>({n:6,tele:1.1,stay:1.2})},{n:'orrery',w:2.2,sig:1,gap:1.2,p:()=>({shells:3,per:8,sp:50})},{n:'dyn',w:1,p:()=>({mode:'turn',n:4,sp:74,iv:.85,dur:3.6,col:'#ffe8a0'})},{n:'spiral',w:.8,p:()=>({arms:4,spin:.22,rate:.1,sp:46,interlock:1,dur:5})}],
 3:t=>[{n:'constellation',w:1.4,sig:1,gap:1,p:()=>({n:7,tele:1,stay:1.3})},{n:'orrery',w:1.6,sig:1,gap:1,p:()=>({shells:3,per:9,sp:52})},{n:'aimed',w:1,p:()=>({mode:'predict',n:3,sp:104,iv:.45,vol:5})},{n:'spiral',w:1,p:()=>({arms:5,spin:.22,rate:.1,sp:46,interlock:1,rev:2.2,dur:5})},{n:'cross',w:.8,p:()=>({mode:'diag',sp:62,iv:.3,dur:4})}],
 4:t=>[{n:'constellation',w:1.5,sig:1,gap:.9,p:()=>({n:8,tele:.95,stay:1.4})},{n:'orrery',w:1.5,sig:1,gap:.9,p:()=>({shells:4,per:9,sp:56})},{n:'dyn',w:1,p:()=>({mode:'turn',n:5,sp:78,iv:.75,dur:3.6})},{n:'aimed',w:1,p:()=>({mode:'predict',n:3,sp:108,iv:.42,vol:6})},{n:'arena',w:.8,p:()=>({mode:'rotlasers',n:3,om:.55,tele:1,stay:2.6,w:6,dur:4})},{n:'ring',w:.8,p:()=>({cnt:24,sp:50,waves:5,gapW:.6,gapRot:.7,conc:[1,.8]})}]};
// the abyss modifiers act on any late guardian: faster, echoing, a closing arena, a twin shade, shorter pauses, wards
function lateBossMods(e,D,dt){const M=e.mods||[];if(!M.length)return;
 if(M.includes('swift'))D.gapK=.8;if(M.includes('relentless'))D.gapK=(D.gapK||1)*.75;
 if(M.includes('echo')){if(D.last&&D.k!==D.echoK){D.echoK=D.k;D.echoQ={t:.7,E:D.last};}
  if(D.echoQ&&(D.echoQ.t-=dt)<=0){const E=D.echoQ.E;D.echoQ=null;const J=bhStart(e,E.n,Object.assign(E.p?E.p(D.tier,D.k):{},{dir:-1}));if(J&&J.st)J.st.a=(J.st.a||0)+Math.PI;}}
 if(M.includes('shroud')){e.shT=(e.shT==null?8:e.shT)-dt;if(e.shT<=0){e.shT=11;bhStart(e,'arena',{mode:'narrow',sp:46,iv:.5,dur:3.2});}}
 if(M.includes('twin')&&!e.twin){e.twin={own:{virtual:1,x:e.x,y:e.y,room:e.room,dm:e.dm},D:null};}
 if(e.twin){const T=e.twin,A=arenaOf(e);T.own.x=A.cx*2-e.x;T.own.y=A.cy*2-e.y;if(!T.D)T.D=ldirNew(T.own,Math.max(3,D.tier-1),lpoolAll(Math.max(3,D.tier-1)),{maxLayers:1,gapK:1.6});ldirTick(T.D,dt);}
 if(M.includes('warded')&&!e.wards){e.wards=[0,1,2].map(i=>({a:i/3*TAU,hp:3}));}
 if(e.wards)for(const w of e.wards)w.a+=dt*1.6;}
// the abyss modifiers made visible: the twin shade (a dark mirror of the guardian) and the orbiting wards
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);const e=boss;if(!e||e.dead)return;
 if(e.twin){const T=e.twin.own,X=sx(T.x,T.y),Y=sy(T.x,T.y)-14,k=.5+.2*Math.sin(time*4);ctx.globalAlpha=.25*k;ctx.fillStyle='#8060c0';ctx.beginPath();ctx.ellipse(X,Y+12,10,4,0,0,TAU);ctx.fill();
  ctx.globalAlpha=.55*k+.2;ctx.fillStyle='#14101a';ctx.beginPath();ctx.ellipse(X,Y,7,12,0,0,TAU);ctx.fill();ctx.fillStyle='#c8a0ff';ctx.fillRect(X-3,Y-5,2,1);ctx.fillRect(X+2,Y-5,2,1);ctx.globalAlpha=1;}
 if(e.wards)for(const w of e.wards){if(w.hp<=0)continue;const x=e.x+Math.cos(w.a)*18,y=e.y+Math.sin(w.a)*18,X=sx(x,y),Y=sy(x,y)-12;ctx.fillStyle='#14101a';ctx.fillRect(X-3,Y-1,7,3);ctx.fillRect(X-1,Y-3,3,7);ctx.fillStyle='#c8a0ff';ctx.fillRect(X-2,Y,5,1);ctx.fillRect(X,Y-2,1,5);for(let i=0;i<w.hp;i++)ctx.fillRect(X-2+i*2,Y+5,1,1);}};}
// wards absorb hits until each takes three
{const _he=hurtE;hurtE=function(en,dmg,pd,o){if(en&&en.wards&&en.wards.some(w=>w.hp>0)){const w=en.wards.find(w=>w.hp>0);w.hp--;spark(en.x,en.y,'#c8a0ff',3,40);txtFx(en.x,en.y-18,'WARDED','#c8a0ff');return;}return _he.apply(this,arguments);};}
// ---------------- his fight ----------------
// four phases, each its own director at a rising budget: ESTABLISHMENT (his constellations, read them), ESCALATION (the
// orrery joins), ADVANCED COMBAT (both, with predictive comets and reversing spirals; he blinks between stars), and the
// SIGNATURE CLIMAX (THE FALLING HEAVENS, then everything at once). Two survival phases mark the turns.
function hosPhase(e){const f=e.hp/e.maxhp;return f>.7?1:f>.45?2:f>.2?3:4;}
BKIT['HOSHIYOMI, THE STAR READER']={director:bossDirector,guide:['THE EMPEROR\'S ASTROLOGER. HE READS THE SKY AND THE SKY ANSWERS.','CONSTELLATIONS: STARS APPEAR, WARN, AND ARE JOINED BY LINES OF LIGHT. LIVE IN THE LANES BETWEEN.','THE ORRERY: SHELLS OF STARS ORBIT HIM, THEN UNWIND ONE BY ONE.','FROM HALF HEALTH HE BLINKS BETWEEN STARS. AT THE END THE HEAVENS FALL.'],pref:100,gap:1,halfName:'THE HOOD FALLS - THE STARS TURN RED',noContact:true,
 events:[lateSurvival({at:.55,dur:18,name:'THE TURNING HEAVENS',tier:3}),
  {at:.2,dur:17,name:'THE FALLING HEAVENS',hint:'THE SKY FALLS - KEEP MOVING',survival:true,storm:1,
   start(e,E){const A=arenaOf(e);E.home=freeSpot(e,A.cx,A.cy,e.r);bhStart(e,'heavens',{dur:16.5});},
   tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*3);e.y+=(E.home.y-e.y)*Math.min(1,dt*3);},
   end(e,E){bhStop(e);}}],
 tick(e,dt,d,inEv){if(phaseGate(e,BKIT[e.name],dt))return true;const ph=hosPhase(e);
  if(!e.D||e.Dph!==ph){if(e.D)ldirStop(e.D);e.Dph=ph;const t=(e.lateTier||3)+(ph>=3?1:0);e.D=ldirNew(e,t,HOS_POOL[ph](t),{maxLayers:ph===1?2:ph===2?2:3});
   if(ph>1){const c=OBS.c;txtFx(e.x,e.y-20,['','','THE ORRERY TURNS','THE STAR CHART','THE LAST LIGHT'][ph],c,1.6);sfx('boss');}}
  ldirTick(e.D,dt);lateBossMods(e,e.D,dt);
  // he keeps his distance; from phase 3 he blinks between points of the sky
  const a=Math.atan2(P.y-e.y,P.x-e.x);if(ph>=3){e.blT=(e.blT==null?4:e.blT)-dt;if(e.blT<=0){e.blT=4.5;const A=arenaOf(e);const s=freeSpot(e,A.x0+30+Math.random()*(A.x1-A.x0-60),A.y0+30+Math.random()*(A.y1-A.y0-60),e.r);if(Math.hypot(s.x-P.x,s.y-P.y)>60){fxRing(e.x,e.y,16,OBS.c,.3);e.x=s.x;e.y=s.y;fxRing(e.x,e.y,16,OBS.c,.3);}}}
  defaultMove(e,dt,d,a,BKIT[e.name]);return true;},
 onDeath(e){bhStop(e);if(e.D)ldirStop(e.D);}};
{const _ob=onBossDead;onBossDead=function(e){if(e&&BKIT[e.name]&&e.D){ldirStop(e.D);bhStop(e);if(e.twin&&e.twin.D)ldirStop(e.twin.D);}return _ob.apply(this,arguments);};}
// the orrery charm: three star wards circle you; each breaks one shot, then re-forms 8s later
{const _u=updPlay;updPlay=function(dt){const r=_u.apply(this,arguments);if(!P||!R||!R.inv||!R.inv.orrery)return r;R.orw=R.orw||[0,0,0];
 for(let i=0;i<3;i++){if(R.orw[i]>0){R.orw[i]-=dt;continue;}const a=R.time*2.2+i/3*TAU,x=P.x+Math.cos(a)*14,y=P.y+Math.sin(a)*14;for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;if(Math.hypot(q.x-x,q.y-y)<q.r+3){q.dead=true;R.orw[i]=8;spark(x,y,'#c8a0ff',4,40);break;}}}return r;};}
{const _dp=drawPlayer;drawPlayer=function(){const r=_dp.apply(this,arguments);if(P&&R&&R.inv&&R.inv.orrery&&R.orw)for(let i=0;i<3;i++){if(R.orw[i]>0)continue;const a=R.time*2.2+i/3*TAU,x=P.x+Math.cos(a)*14,y=P.y+Math.sin(a)*14,X=sx(x,y),Y=sy(x,y)-8;ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-1,5,3);ctx.fillRect(X-1,Y-2,3,5);ctx.fillStyle='#c8a0ff';ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);}return r;};}
