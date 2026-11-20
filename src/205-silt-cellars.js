'use strict';
// SHINOBIDUNGEONS - STAGE XVI: THE SILT CELLARS (Chapter II, the descent; see CHAPTER_II_DESCENT.md).
// When Sazanami falls, the black lake drains through his gate. Below it lie the palace's drowned storehouses, now a
// lakebed of black silt and tar vents, kept by NEBARI, the Mire Warden.
// ONE IDEA - MIRE: wet silt grips your feet (you walk at about half speed in it; a dash still carries you across).
//  TEACH    the first room past the start: silt pools, a couple of slow lake creatures, no pressure.
//  COMBINE  the rooms on the way: silt with ranged foes, and tar vents that bloom on a warning (a small Tar Bloom).
//  CENTRAL  Nebari's fight. Signature: TAR BLOOM - a dark ring spreads where he aims (1.1s): walk out of it. It bursts
//           into a silt pool, and the splash mires him in his own tar for 1.6s: he cannot move or attack and takes
//           extra posture damage (the opening melee heroes wait for). PHASE TWO - THE SILT SETS: every pool hardens into a stone mound that no longer slows
//           you but stops shots (his and yours). He changes to aimed mud volleys: the hazard you avoided is now cover.
//  EVENT    THE DRAINING (at 28%): he sinks into the arena's heart while the lakebed blooms round you and volleys come in;
//           every bloom sets into fresh cover.
// Every warning fits inside the arena, and a hero at base speed walking out of a bloom's centre through silt is clear
// with time to spare (34px at ~58px/s = 0.6s against a 1.1s warning).
// Stage XV (and this stage) name their music scale 'insen', which the piano knew only as 'in': the music crashed the game
// loop when it started. 'insen' is now the same scale.
if(typeof PSC!=='undefined'&&!PSC.insen)PSC.insen=PSC.in;
const NEB={name:'NEBARI, THE MIRE WARDEN',c:'#d89848',amber:'#ffb040',tar:'#1e1a18',silt:'#120e0a',silt2:'#8a7656',sheen:'#c8b088',stone:'#6e685e',stone2:'#9a9488',
 pools:[],vents:[],teach:null,taught:0,
 R:{bloom:34,tele:1.1,mire:1.6,ventR:26,ventTele:1.1}};

// ---------------------------------------------------------------- the silt and the stone
// a pool: {x,y,r,life (s, Infinity for the stage's own), hard (0/1), setAt (seconds until it hardens), room}
function nebPool(x,y,r,o){if(NEB.pools.length>40)NEB.pools.shift();const p=Object.assign({x,y,r,life:Infinity,hard:0,setAt:-1,age:0,seed:Math.random()*99},o||{});NEB.pools.push(p);return p;}
const nebSoftAt=(x,y)=>NEB.pools.some(p=>!p.hard&&p.age>.15&&Math.hypot(x-p.x,y-p.y)<p.r);
function nebHarden(p){if(p.hard)return;p.hard=1;p.life=Math.min(p.life,14);p.age=0;fxRing(p.x,p.y,p.r,NEB.stone2,.35);for(let i=0;i<6;i++)particles.push({x:p.x+rnd(-p.r,p.r)*.6,y:p.y+rnd(-p.r,p.r)*.6,vx:rnd(-15,15),vy:rnd(-30,-10),t:.5,col:NEB.stone2});}
{const _u=updPlay;updPlay=function(dt){const r=_u.apply(this,arguments);if(mode!=='play'||!P||!R||paused)return r;
 for(let i=NEB.pools.length-1;i>=0;i--){const p=NEB.pools[i];p.age+=dt;if(p.setAt>0){p.setAt-=dt;if(p.setAt<=0)nebHarden(p);}p.life-=dt;if(p.life<=0)NEB.pools.splice(i,1);}
 // soft silt grips the feet; a dash still carries you through
 if(P.dash<=0&&nebSoftAt(P.x,P.y)){P.slowT=Math.max(P.slowT||0,.12);if(!NEB.taught&&R.di===NEB_I){NEB.taught=1;setToast('THE SILT GRIPS YOUR FEET - WALK ROUND IT, OR DASH ACROSS',NEB.c,3.5);}}
 // stone mounds stop shots from either side
 if(NEB.pools.some(p=>p.hard))for(const q of projs){if(q.dead||q.peril)continue;for(const p of NEB.pools){if(!p.hard)continue;if(Math.hypot(q.x-p.x,q.y-p.y)<p.r*.8){q.dead=true;if(Math.random()<.5)spark(q.x,q.y,NEB.stone2,2,30);break;}}}
 // the tar vents bloom while you are in their room (never once the guardian is awake: the arena's door touches the
 // approach room)
 const fight=boss&&boss.awake&&!boss.dead&&R.di===NEB_I;
 for(const v of NEB.vents){const rm=v.room,inRoom=!fight&&P.x>rm.x*T&&P.x<(rm.x+rm.w)*T&&P.y>rm.y*T&&P.y<(rm.y+rm.h)*T;if(!inRoom){v.t=Math.max(v.t,1.2);continue;}
  v.t-=dt;if(v.t<=0){v.t=rnd(3.6,5);nebBloomMark(v.x,v.y,NEB.R.ventR,NEB.R.ventTele,10,null,{life:5});}}
 return r;};}
// a bloom: the warning ring (with bubbles drawn by the floor), then a burst that leaves silt (or stone, set=seconds)
function nebBloomMark(x,y,r,t,dmg,src,o){o=o||{};sfx('tool');
 return mark({k:'c',x,y,r,t,dmg:dmg*((src&&src.dm)||(1+.06*Math.max(0,(R&&R.di||0)-CAMPAIGN_END))),col:NEB.amber,src,quiet:true,neb:1,on(m){
  const p=nebPool(x,y,r,{life:o.life||9,setAt:o.set||-1});shake=Math.max(shake,3);sfx('break');
  for(let i=0;i<14;i++){const a=i/14*TAU;particles.push({x:x+Math.cos(a)*r*.5,y:y+Math.sin(a)*r*.5,vx:Math.cos(a)*50,vy:Math.sin(a)*50-20,t:.45,col:i%3?NEB.tar:NEB.amber});}
  if(o.on)o.on(p);}});}
// keep a circle inside the arena so its whole warning is visible and reachable
function nebClamp(A,x,y,r){return {x:clamp(x,A.x0+r+4,A.x1-r-4),y:clamp(y,A.y0+r+4,A.y1-r-4)};}

// ---------------------------------------------------------------- the floor: silt pools, stone mounds, vents, bubbles
{const _bf=drawBossFloor;drawBossFloor=function(){_bf.apply(this,arguments);if(!NEB.pools.length&&!NEB.vents.length&&!BMK.some(m=>m.neb))return;
 ctx.save();worldXf();
 for(const v of NEB.vents){ctx.globalAlpha=.9;ctx.fillStyle='#120e0c';ctx.beginPath();ctx.arc(v.x,v.y,7,0,TAU);ctx.fill();ctx.strokeStyle=NEB.silt2;ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=NEB.amber;ctx.globalAlpha=.55+.35*Math.sin(time*3+v.x);ctx.beginPath();ctx.arc(v.x,v.y,2.5,0,TAU);ctx.fill();}
 for(const p of NEB.pools){const fade=Math.min(1,p.age/.2,isFinite(p.life)?p.life/.6:1);
  if(!p.hard){ctx.globalAlpha=.85*fade;ctx.fillStyle=NEB.silt;ctx.beginPath();for(let i=0;i<=16;i++){const a=i/16*TAU,rr=p.r*(.9+.1*Math.sin(a*3+p.seed));i?ctx.lineTo(p.x+Math.cos(a)*rr,p.y+Math.sin(a)*rr):ctx.moveTo(p.x+Math.cos(a)*rr,p.y+Math.sin(a)*rr);}ctx.closePath();ctx.fill();
   ctx.strokeStyle=NEB.silt2;ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=.6*fade;ctx.strokeStyle=NEB.sheen;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.x-p.r*.25,p.y-p.r*.2,p.r*.45,3.6,4.8);ctx.stroke();ctx.beginPath();ctx.arc(p.x+p.r*.2,p.y+p.r*.15,p.r*.25,.2,1.2);ctx.stroke();
   // a slow bubble now and then
   const bt=(time*.7+p.seed)%1;if(bt<.3){ctx.globalAlpha=fade*(1-bt/.3);ctx.strokeStyle=NEB.silt2;ctx.beginPath();ctx.arc(p.x+Math.sin(p.seed)*p.r*.4,p.y+Math.cos(p.seed*2)*p.r*.3,1+bt*8,0,TAU);ctx.stroke();}}
  else{const k=Math.min(1,p.age/.25);ctx.globalAlpha=fade;ctx.fillStyle='#3a362e';ctx.beginPath();ctx.arc(p.x,p.y,p.r*.82*k,0,TAU);ctx.fill();ctx.fillStyle=NEB.stone;ctx.beginPath();ctx.arc(p.x-1,p.y-1,p.r*.7*k,0,TAU);ctx.fill();
   ctx.strokeStyle=NEB.stone2;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.x-2,p.y-2,p.r*.5*k,3.4,5.2);ctx.stroke();ctx.strokeStyle='#2a2620';ctx.beginPath();ctx.moveTo(p.x-p.r*.3,p.y);ctx.lineTo(p.x+p.r*.1,p.y+p.r*.3);ctx.stroke();}}
 // a bloom's warning: tar spreading inward from the ring, bubbles rising
 for(const m of BMK){if(!m.neb||m.fired)continue;const k=1-Math.max(0,m.t)/m.dur;ctx.globalAlpha=.25+.35*k;ctx.fillStyle=NEB.tar;ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,TAU);ctx.arc(m.x,m.y,m.r*(1-k),0,TAU,true);ctx.fill();
  ctx.globalAlpha=.8;ctx.fillStyle=NEB.amber;for(let i=0;i<5;i++){const a=i*1.3+m.x,rr=m.r*((i*.37+k*2)%1);ctx.beginPath();ctx.arc(m.x+Math.cos(a)*rr,m.y+Math.sin(a)*rr,1.2,0,TAU);ctx.fill();}}
 ctx.restore();ctx.globalAlpha=1;};}

// ---------------------------------------------------------------- the stage
(function nebDecos(){
 defDeco('mooring',8,20,R=>{R(2,2,4,17,'#3a2e22');R(2,2,1,17,'#5a4834');R(1,0,6,3,'#2a2018');R(1,7,6,2,'#b8a070');R(1,9,6,1,'#8a7450');R(2,16,4,3,'#1e1a14');},{big:0});
 defDeco('sunkjar',12,10,R=>{R(2,3,8,6,'#6a4a30');R(3,2,6,1,'#8a6a48');R(3,4,2,3,'#8a6a48');R(1,8,10,2,'#2a2218');R(4,1,4,1,'#3a2a1c');},{big:0});
 defDeco('silttorch',8,18,R=>{R(3,6,2,11,'#3a2e22');R(1,16,6,2,'#2a2018');R(2,2,4,4,'#2a2018');R(3,3,2,2,'#ffb040');R(3,1,2,1,'#ffe080');},{big:0,glow:{c:'#ffb040',y:-12,r:8}});
 defDeco('deadreed',10,14,R=>{for(const [x,h] of [[2,11],[4,13],[6,10],[8,12]]){R(x,14-h,1,h,'#4a4232');R(x-1,14-h,2,2,'#6a5e44');}},{big:0});})();
function nebFloor(g,r,cx,cy,x,y,X,Y){const h=hash(x*11,y*5);
 if(h<.5){g.fillStyle=h<.25?'#221c16':'#2c241c';g.fillRect(X-6+(x&1)*3,Y+6,8,1);g.fillRect(X-3,Y+10,10,1);}
 if(h>.93)fDia(g,X,Y,'#3a3024',.35,3);if(h>.985){g.fillStyle='#ffb040';g.fillRect(X+((h*700)|0)%9-4,Y+7,1,1);}}
const NEB_I=lateAdd({base:FERRY_STAGE,remix:false,indoor:true,
 story:'THE DRAINED LAKEBED: THE SILT CELLARS BENEATH THE GATE',abyss:'THE SILT NEVER SETTLES',
 tale:'WITH THE FERRYMAN FALLEN, THE BLACK LAKE DRAINS AWAY THROUGH HIS GATE. BELOW IT LIE THE PALACE\'S DROWNED STOREHOUSES, BURIED IN BLACK SILT AND BREATHING TAR. NEBARI, THE MIRE WARDEN, DREDGED THESE CELLARS FOR THE EMPEROR, AND HE DOES NOT MEAN TO LET THE DEAD BE FOLLOWED.',
 scn:{gr:['#1a1612','#211b15'],seal:'tomoe',wall:'temple',out:'garden'},scatter:[['deadreed',4],['sunkjar',3],['mooring',2]],
 t:{DUN:{name:'THE SILT CELLARS',fl:['#2a231b','#30281f'],sp:'#1c1712',wt:'#100c09',wf:'#2e261c',we:'#7a6a4c',cloth:'#6a4a2a',dark:'#15110d',acc:NEB.c,
   pool:['frog','toad','seer','warden','crab','herald','frog','splitter','seer','orbiter']},
  ENV:{k:'planks',liq:0,amt:0,lc:['#0c0907','#16110c','#5a4c36'],wall:'temple',fl:['#2a231b','#30281f'],sp:'#1c1712'},
  ROMAN:'XVI',STAGEDECO:[['silttorch',5],['mooring',4],['sunkjar',4],['deadreed',5],['offering',1]],
  DECO_GROUPS:[[['mooring',-14,0],['silttorch',0,-6],['mooring',14,0]],[['sunkjar',0,0],['sunkjar',10,6],['deadreed',-10,6]]],
  FLOORART:nebFloor,MOOD:['#120c06',.42],PSTAGE:['insen',47,64],BMUSIC:{s:'insen',r:40,b:132,w:'square'},
  TRAILS:{n:'SILT',c:NEB.c,c2:'#5a4c36'},BOSS_HPT:9,POOLADD:[],PMAP:[.97,.04],
  MASTER_LINES:'THE SILT LIES STILL AND THE MIRE WARDEN SLEEPS IN IT. BELOW THE CELLARS THE WATER RUNS CLEAR AGAIN, BLUE AS GLASS. SOMETHING SHINES DOWN THERE. TAKE THE ROAD DOWN, OR RETURN WITH YOUR STORY.',
  BOSSRELIC:{id:'mirelantern',name:'MIRE LANTERN',d:'ENEMIES THAT TOUCH YOU ARE MIRED: SLOWED FOR 2 SECONDS (ONCE PER FOE EVERY 4 SECONDS)',g:'L',fx:'control',mo:'vortex'},
  BOSS:{name:NEB.name,hp:2900,hat:'kasa',pref:90,spd:40,r:12,k1:[],k2:[],pal:basePal('#2a2420','#1e1a18','#d89848','#120e0c')},
  BSTYLE:{c:NEB.c,t:['THE MIRE','THE SILT SETS','THE DRAINING'],ph:[[{pat:'aimedring',cnt:12,sp:46,col:NEB.c}],[{pat:'gapring',cnt:16,gw:.5,sp:50,col:NEB.amber}]]},
  BMODES:['chase','circle'],BMOTIF:[0,1,3,1,0,null,3,5,3,1,0,null,-2,0,1,null]}});
// the ferryman's gate now leads down into the cellars
MASTER_LINES[FERRY_STAGE]='SAZANAMI\'S LANTERNS GO OUT AND HIS GATE STANDS OPEN. THE BLACK LAKE HAS DRAINED THROUGH IT, AND THE ROAD GOES DOWN INTO WHAT IT LEFT BEHIND: '+DUN[NEB_I].name+'. TAKE THE ROAD DOWN, OR RETURN WITH YOUR STORY.';

// the rooms: teach, then combine. Built after every load of the stage.
function nebRooms(){NEB.pools.length=0;NEB.vents.length=0;NEB.teach=null;NEB.taught=0;if(!R||R.di!==NEB_I||!map||!map.rooms)return;
 const rooms=map.rooms.filter(r=>r.k==='room'&&r.type!=='shop'&&r.type!=='shrine'&&r.type!=='altar'&&r.type!=='rest').sort((a,b)=>(a.ord||0)-(b.ord||0));
 const inner=(r,k)=>{const s=spotIn(r);return {x:clamp(s.x,(r.x+2)*T,(r.x+r.w-2)*T),y:clamp(s.y,(r.y+2)*T,(r.y+r.h-2)*T)};};
 // TEACH: the first room on the way, wide pools and only two slow foes
 const teach=rooms[0];if(teach){NEB.teach=teach;for(let i=0;i<5;i++){const s=inner(teach);nebPool(s.x,s.y,rnd(22,30),{room:teach});}
  let kept=0;for(const e of enemies)if(e.room===teach&&!e.boss&&!e.prop){if(kept<2&&(e.type==='frog'||e.type==='toad'||e.type==='crab'||kept<1)){kept++;continue;}e.dead=true;}enemies=enemies.filter(e=>!e.dead);}
 // COMBINE: the rest carry silt and, in the bigger rooms, a tar vent among the ranged foes
 for(const r of rooms.slice(1)){const n=r.w*r.h>120?3:2;for(let i=0;i<n;i++){const s=inner(r);nebPool(s.x,s.y,rnd(16,24),{room:r});}
  if(r.w>=10&&r.h>=10&&r.type!=='treasure'){const s=inner(r);NEB.vents.push({x:s.x,y:s.y,room:r,t:rnd(1.5,3)});}}
 const ap=map.rooms.find(r=>r.k==='approach');if(ap){for(let i=0;i<2;i++){const s=inner(ap);nebPool(s.x,s.y,rnd(18,24),{room:ap});}if(ap.w>=8&&ap.h>=8){const s=inner(ap);NEB.vents.push({x:s.x,y:s.y,room:ap,t:2});}}}
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld.apply(this,arguments);try{nebRooms();}catch(err){console.warn('silt',err);}return r;};}
// the first time you step into the teaching room
{const _u=updPlay;updPlay=function(dt){const r=_u.apply(this,arguments);const t=NEB.teach;if(t&&!NEB.toldRoom&&P&&R&&R.di===NEB_I&&P.x>t.x*T&&P.x<(t.x+t.w)*T&&P.y>t.y*T&&P.y<(t.y+t.h)*T){NEB.toldRoom=1;setToast('THE SILT CELLARS - BLACK SILT LIES IN POOLS ON THE FLOOR',NEB.c,3);}return r;};}
{const _sr=startRun;startRun=function(){NEB.toldRoom=0;return _sr.apply(this,arguments);};}

// ---------------------------------------------------------------- NEBARI (temporary art: concept direction A)
// A hulking lake-dredger in a tar-soaked hooded oilcloth cape, a huge tar ladle, amber eyes in the hood's shadow.
// Second form: the tar sets into stone plates with molten cracks. (Replaced once a concept direction is chosen.)
const nebArt=hiArt((H,Q)=>{const {by,two}=H,cx=72,far=(Q.far||[[25,30],[20,40],[22,49]]).map(H.pt),near=(Q.near||[[47,30],[53,39],[52,47]]).map(H.pt);
 const TAR='#1e1a18',TAR2='#3a3430',MUD='#7a6440',AMB='#ffb040',ST='#6a6660',ST2='#8a8680';
 HIP.legs(H,Q,cx,104,([hp,kn,ft])=>{H.limb([hp,kn],18,MUD,H.lt(MUD));H.limb([kn,[ft[0],ft[1]-6]],14,TAR,TAR2);H.poly([[ft[0]-12,ft[1]-8],[ft[0]+13,ft[1]-8],[ft[0]+14,ft[1]],[ft[0]-12,ft[1]]],TAR);});
 {const [x,y]=near[2],a=Q.la!=null?Q.la:-1.4,ca=Math.cos(a),sa=Math.sin(a),L=(Q.ll||44)*2,bx=x+ca*L,byy=y+sa*L;
  H.limb([[x-ca*30,y-sa*30],[bx,byy]],6,'#5a4028','#7a5a38');H.ell(bx+ca*4,byy+sa*4,13,8,TAR);H.ell(bx+ca*4,byy+sa*4-3,10,4,two?'#ff7030':'#3a2010',0);for(const d of [-4,3])H.rect(bx+ca*4+d,byy+sa*4-4,2,2,AMB);}
 H.poly([[cx-24,48+by],[cx+24,48+by],[cx+44,124],[cx-44,124]],TAR);H.fill([[cx-22,52+by],[cx-12,52+by],[cx-24,122],[cx-40,122]],TAR2);
 for(let x=-40;x<=40;x+=8)H.limb([[cx+x,122],[cx+x+1,128+(x%3+3)*2]],3,TAR);
 if(two){for(const [x,y,w,h] of [[-30,70,22,18],[6,64,24,20],[-20,96,26,18],[12,92,24,22]]){H.poly([[cx+x,y+by],[cx+x+w,y+by+2],[cx+x+w-2,y+by+h],[cx+x+2,y+by+h-2]],ST);H.ln(cx+x+3,y+by+3,cx+x+w-3,y+by+3,2,ST2);}
  for(const [x0,y0,x1,y1] of [[-8,70,-2,90],[4,88,14,104],[-26,92,-14,96]])H.ln(cx+x0,y0+by,cx+x1,y1+by,2,'#ff7030');}
 for(let i=0;i<7;i++)H.ell(cx-18+i*6,58+by+Math.abs(i-3)*2,3,2,'#c8a060',1);H.rect(cx-16,98+by,8,10,'#2a2018');H.rect(cx-14,100+by,4,6,AMB);
 H.limb(far,14,TAR,TAR2);HIP.hand(H,far[2][0],far[2][1],'#5a4a3a');H.limb(near,14,TAR,TAR2);HIP.hand(H,near[2][0],near[2][1],'#5a4a3a');
 const hy=34+by;H.poly([[cx-18,hy+16],[cx-16,hy-10],[cx,hy-20],[cx+16,hy-10],[cx+18,hy+16]],TAR);H.ell(cx,hy+2,11,12,'#0a0808',0);H.rect(cx-7,hy,4,2,two?'#ff7030':AMB);H.rect(cx+3,hy,4,2,two?'#ff7030':AMB);
 if(two)H.poly([[cx-18,hy-4],[cx-4,hy-16],[cx+10,hy-12],[cx+18,hy+4],[cx+6,hy-2]],ST);});
humBoss(NEB.name,nebArt,{idle0:{},idle1:{b:1},atk:{dy:-1,legs:'lunge',near:[[47,28],[55,20],[56,12]],la:-2.2,ll:30,far:[[25,29],[17,36],[13,44]]}},{sc:1.12});
hiPoses(NEB.name,[[[25,30],[20,40],[22,49]],[[47,30],[53,39],[52,47]]]);

// ---------------------------------------------------------------- his fight
// mired: caught in his own tar after a bloom; he cannot move or attack, and takes more posture damage
function nebMire(e,t){e.mireT=Math.max(e.mireT||0,t);e.gapT=Math.max(e.gapT||0,t+.2);txtFx(e.x,e.y-22,'MIRED!',NEB.amber,1.2);nebPool(e.x,e.y+2,16,{life:t+.4});}
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(e&&e.boss&&e.mireT>0&&e.name===NEB.name){dmg*=1.2;pd=(pd||0)*1.6;}return _h.call(this,e,dmg,pd,o);};}
const NEB_ATKS=[
 // the signature: TAR BLOOM. Tell: the ring spreads where he aims (he raises the ladle); response: walk out; opening:
 // the splash mires him for 1.6s
 {n:'TAR BLOOM',wt:3,gap:.5,run(e,A){const A0=arenaOf(e);
  if(at(A,0)){e.tele=1;const c=nebClamp(A0,P.x+(P.vx||0)*.15,P.y+(P.vy||0)*.15,NEB.R.bloom);A.c=c;
   nebBloomMark(c.x,c.y,NEB.R.bloom,NEB.R.tele,14,e,{life:e.half?20:8,set:e.half?1.4:-1});}
  if(at(A,NEB.R.tele)){e.tele=0;nebMire(e,NEB.R.mire);shake=Math.max(shake,5);}
  return A.t>NEB.R.tele+.15;}},
 // close in: the ladle swept through a wide arc in front of him (1s warning: a hero standing in silt beside him still
 // clears the 56px arc with time to spare)
 {n:'LADLE SWEEP',wt:1.5,gap:1,ok:(e,d)=>d<90,run(e,A){
  if(at(A,0)){e.tele=2;const a=aimAt(e);mark({k:'cone',x:e.x,y:e.y,a,r:56,arc:1.9,t:1,dmg:15*e.dm,col:NEB.c,src:e});sfx('tool');}
  if(at(A,1)){e.tele=0;sfx('spearSteel');}return A.t>1.3;}},
 // phase one: a fan of slow tar globs that grip you if they touch (they slow, and hurt only a little)
 {n:'SILT SPRAY',wt:2,half:0,gap:.9,ok:(e,d)=>d>55,run(e,A){
  if(at(A,0))e.tele=1;
  if(at(A,.5)){e.tele=0;const a=aimAt(e);for(let i=-2;i<=2;i++)bsh(e,e.x,e.y,a+i*.22,72,6,{r:4,spr:'bgrain',col:NEB.c,slowP:.9,life:3.4});sfx('shoot');}
  return A.t>.9;}},
 // phase two: aimed mud volleys. Tell: his ladle levels and a thin line shows the aim; response: put a stone mound
 // between you, or sidestep; opening: he reloads the ladle after the third burst
 {n:'MUD VOLLEY',wt:3,half:1,gap:1.3,run(e,A){
  if(at(A,0)){e.tele=2;A.a=aimAt(e);A.m=mark({k:'l',x:e.x,y:e.y,a:A.a,len:300,w:6,t:.75,col:NEB.amber,src:e,quiet:true});sfx('tool');}
  for(const [k,tt] of [[1,.75],[2,1],[3,1.25]])if(at(A,tt)){if(k===1)e.tele=0;const a=A.a+(Math.random()-.5)*.06;for(const o of [-.07,0,.07])bsh(e,e.x,e.y,a+o,170,9,{r:3,spr:'bgrain',col:NEB.amber,life:2.6});sfx('shoot');}
  return A.t>1.45;}}];
BKIT[NEB.name]={director:bossDirector,noContact:true,pref:90,gap:.8,halfName:'THE SILT SETS',
 guide:['THE MIRE WARDEN DREDGED THE SILT CELLARS FOR THE EMPEROR.','TAR BLOOM: A DARK RING SPREADS WHERE HE AIMS. WALK OUT OF IT; THE SPLASH MIRES HIM - STRIKE THEN.','THE SILT SETS: AT HALF HEALTH HIS POOLS HARDEN INTO STONE THAT STOPS SHOTS. HIDE BEHIND IT FROM HIS MUD VOLLEYS.'],
 atks:NEB_ATKS,
 onHalf(e){const A=arenaOf(e);let n=0;for(const p of NEB.pools){if(!p.hard&&Math.hypot(p.x-A.cx,p.y-A.cy)<A.R*1.2){p.setAt=.05+n*.06;n++;}}
  // and cover is always there: four mounds round the middle of the room
  for(let i=0;i<4;i++){const a=i/4*TAU+.4,s=nebClamp(A,A.cx+Math.cos(a)*A.R*.42,A.cy+Math.sin(a)*A.R*.42,20);nebPool(s.x,s.y,20,{life:20,setAt:.3+i*.08});}},
 events:[{at:.28,dur:11,name:'THE DRAINING',hint:'THE LAKEBED BLOOMS - HIDE BEHIND THE STONE',survival:true,storm:1,
  start(e,E){const A=E.A=arenaOf(e);E.home=freeSpot(e,A.cx,A.cy,e.r);E.bt=.6;E.vt=1.8;},
  tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*3);e.y+=(E.home.y-e.y)*Math.min(1,dt*3);
   E.bt-=dt;if(E.bt<=0){E.bt=.85;const a=Math.random()*TAU,rr=rnd(20,60),c=nebClamp(E.A,P.x+Math.cos(a)*rr,P.y+Math.sin(a)*rr,28);nebBloomMark(c.x,c.y,28,NEB.R.tele,12,e,{life:12,set:1.2});}
   E.vt-=dt;if(E.vt<=0){E.vt=2.2;const a=aimAt(e);mark({k:'l',x:e.x,y:e.y,a,len:300,w:6,t:.75,col:NEB.amber,src:e,quiet:true,on(){for(const o of [-.1,0,.1])bsh(e,e.x,e.y,a+o,150,9,{r:3,spr:'bgrain',col:NEB.amber,life:2.6});sfx('shoot');}});}},
  end(e,E){e.gapT=1.6;}}],
 reset(e){e.mireT=0;},
 move(e,dt,d,a){if(e.mireT>0){e.mireT-=dt;if(Math.random()<dt*10)spark(e.x+rnd(-6,6),e.y+2,NEB.amber,1,20);return;}defaultMove(e,dt,d,a,BKIT[NEB.name]);},
 floor(e){if(!(e.mireT>0))return;ctx.save();worldXf();ctx.globalAlpha=.9;ctx.fillStyle=NEB.silt;ctx.beginPath();ctx.arc(e.x,e.y,20,0,TAU);ctx.fill();
  // the opening, made plain: a pulsing amber ring round the tar that holds him
  ctx.globalAlpha=.75+.25*Math.sin(time*14);ctx.strokeStyle=NEB.amber;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(e.x,e.y,22+Math.sin(time*12)*1.5,0,TAU);ctx.stroke();ctx.restore();ctx.globalAlpha=1;},
 // mired: tar clings to his legs and drips while he is stuck
 drawAfter(e){if(!(e.mireT>0))return;const X=sx(e.x,e.y),Y=sy(e.x,e.y);ctx.globalAlpha=.9;ctx.fillStyle=NEB.silt;ctx.fillRect(X-13,Y-12,26,12);ctx.fillStyle=NEB.silt2;for(let i=0;i<6;i++)ctx.fillRect(X-12+i*5,Y-12-((i*7+Math.floor(time*8))%5),2,3);ctx.fillStyle=NEB.amber;ctx.fillRect(X-10,Y-13,20,1);ctx.globalAlpha=1;},
 onDeath(e){for(const p of NEB.pools)if(p.hard)p.life=Math.min(p.life,2);}};
// the mire lantern: foes that touch you are slowed for 2s (once per foe every 4s)
{const _u=updPlay;updPlay=function(dt){const r=_u.apply(this,arguments);if(!P||!R||!R.inv||!R.inv.mirelantern)return r;
 for(const e of enemies){if(e.dead||e.boss||e.prop)continue;if((e.mlT||0)>R.time)continue;if(Math.hypot(e.x-P.x,e.y-P.y)<e.r+10){e.mlT=R.time+4;e.st=e.st||{};e.st.chillT=Math.max(e.st.chillT||0,2);e.st.chillS=Math.max(e.st.chillS||0,2);spark(e.x,e.y,NEB.c,4,40);}}return r;};}

// ---------------------------------------------------------------- saves made in the Abyss before this stage existed
// The Abyss starts one stage later now; a checkpoint inside it keeps its depth.
{const _sv=savedRun;savedRun=function(){const s=_sv.apply(this,arguments);if(!s||!s.R)return s;const oldAbyss=CAMPAIGN_END+LATE.length;// first Abyss index before XVI
 if((s.R.lateLayout|0)<2){if(s.R.di>=oldAbyss){s.R.di++;if(s.R.start>=oldAbyss)s.R.start++;}s.R.lateLayout=2;if(s.R.di>CAMPAIGN_END)lateEnsure(s.R.di);}return s;};}
{const _ld=loadDungeon;loadDungeon=function(){const r=_ld.apply(this,arguments);if(R)R.lateLayout=2;return r;};}
{const _ld=loadDungeon;loadDungeon=function(){NEB.pools.length=0;NEB.vents.length=0;return _ld.apply(this,arguments);};}
