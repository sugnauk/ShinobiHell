'use strict';
// SHINOBIDUNGEONS - STAGE XIV: THE ECLIPSE SHRINE (tier 4, the endgame).
// Below the observatory, on a black lake, stands the shrine where the Emperor's line was crowned under a darkened moon.
// Its priestess, GETSUREI, keeps the sacred mirror that once held the sun; while it hangs behind her, night never ends.
// Signature challenge: THE TIDE - attacks wash IN and then back OUT. Bullets that have passed you return, so the safe
// place is where the wave has just been, never where it is going. The stage's foes return in their tier-4 forms:
// weavers interlock their spirals, splitters burst wider, orbiters circle tighter, wardens march faster curtains.
const ECL={c:'#e8e8ff',c2:'#ff4060',sil:'#c8d0e0',ink:'#0c0a10'};
// ---------------- furnishings ----------------
(function eclDecos(){
 defDeco('mirrorstand',14,22,(R)=>{R(6,12,2,9,'#2a1a14');R(2,20,10,2,'#3a2418');for(let y=0;y<12;y++){const w=Math.round(Math.sqrt(36-(y-5.5)*(y-5.5))*2);R(7-w/2,y,w,1,y%3?'#c8d0e0':'#e8ecf8');}
  for(let y=2;y<10;y++){const w=Math.round(Math.sqrt(16-(y-5.5)*(y-5.5))*2);R(7-w/2,y,w,1,'#14101a');}R(2,5,1,2,'#e8e8ff');R(11,5,1,2,'#e8e8ff');R(4,0,6,1,'#c03030');},{big:1,glow:{c:'#c8d0e0',y:-16,r:7}});
 defDeco('moontoro',10,18,(R)=>{R(3,12,4,5,'#6a6a72');R(1,17,8,1,'#5a5a62');R(1,6,8,6,'#7a7a84');R(3,7,4,4,'#fff4c0');R(4,8,2,2,'#ffffff');R(0,4,10,2,'#5a5a62');R(3,2,4,2,'#6a6a72');R(4,1,2,1,'#c8d0e0');},{big:0,glow:{c:'#fff4c0',y:-9,r:9}});
 defDeco('shimerock',18,14,(R)=>{for(let y=0;y<12;y++){const w=Math.round(8-Math.abs(y-5)*.9);R(9-w,y+2,w*2,1,y<4?'#5a5a66':y<9?'#4a4a56':'#3a3a46');}R(1,6,16,2,'#e8dca0');for(const x of [3,8,13])R(x,8,2,4,'#f0f0f0');R(5,3,4,1,'#6a6a78');},{big:0});
 defDeco('susuki',10,14,(R)=>{for(const [x,h,c] of [[2,12,'#8a8a6a'],[4,14,'#9a9a7a'],[6,11,'#7a7a5a'],[8,13,'#8a8a6a']]){R(x,14-h,1,h,c);R(x-1,14-h,2,3,'#d8d0b0');}},{big:0});
 defDeco('offering',14,10,(R)=>{R(1,5,12,2,'#7a1a14');R(2,7,2,3,'#4a0e0a');R(10,7,2,3,'#4a0e0a');R(3,2,3,3,'#f0f0f0');R(8,1,3,4,'#e8e0c8');R(9,0,1,1,'#3a7a3a');R(4,1,1,1,'#c8d0e0');},{big:0});
 defDeco('blacktorii',20,22,(R)=>{R(3,4,3,18,'#1a1418');R(14,4,3,18,'#1a1418');R(0,2,20,2,'#1a1418');R(1,1,18,1,'#c8d0e0');R(2,7,16,2,'#2a2028');R(9,3,2,4,'#2a2028');R(3,20,3,2,'#c03030');R(14,20,3,2,'#c03030');},{big:1});
})();
// the floor: black slate laid in rings, inlaid with the moon's phases in silver round the heart of each big room
const eclFloor=(g,r,cx,cy,x,y,X,Y)=>{const h=hash(x*5,y*9),d=Math.hypot((x-cx)/(r.w*.38),(y-cy)/(r.h*.38));
 if(Math.abs(d-1)<.07){fDia(g,X,Y,'#a8b0c0',.45,3);const ph=((Math.atan2(y-cy,x-cx)+Math.PI)/TAU*8)|0;if(h<.5){g.fillStyle='#e8ecf8';g.fillRect(X-2,Y+6,4,3);g.fillStyle='#0c0a10';g.fillRect(X-2+(ph%4),Y+6,2,3);}}
 else if(d<.3)fDia(g,X,Y,'#1a1820',.5,2);
 if(h>.95){g.strokeStyle='rgba(200,208,224,.25)';g.beginPath();g.moveTo(X-7,Y+7);g.lineTo(X+7,Y+7);g.stroke();}
 if(h<.04){g.fillStyle='#c8d0e0';g.fillRect(X-3+((h*900)|0)%7,Y+5+((h*500)|0)%6,1,1);}};
// the walls: black lacquered shrine walls with a silver band, vermilion posts and a slate roof
{const _pw=paintWall;paintWall=function(g,st,faces,tall,v){if(st!=='eclipse')return _pw.apply(this,arguments);const h=tall?16:5;
 block(g,faces,h,()=>'#2a2a34',(x,k,H)=>x%8===0?'#a02420':k===2?'#c8d0e0':k===H-1?'#3a3a46':'#1a1620',(x,k,H)=>x%8===0?'#701410':k===2?'#8a90a0':k===H-1?'#2a2a34':'#110e16',
  (by,fy)=>{roofCap(g,by,'#24242e','#3a3a48','#c8d0e0');if(tall&&v===1){const j=fy(23);SP(g,'#e8ecf8',8+21,by+j+5,4,4);SP(g,'#0c0a10',8+22,by+j+5,3,3);}});};}
// ---------------- the stage ----------------
const ECL_I=lateAdd({base:9,tier:4,
 story:'THE PRIESTESS OF THE BLACK MOON KEEPS THE SUN IN A MIRROR',abyss:'THE MOON NEVER RISES',
 tale:'BELOW THE TOWER LIES A BLACK LAKE, AND ON IT THE SHRINE WHERE THE EMPEROR\'S LINE WAS CROWNED UNDER A DARKENED MOON. ITS PRIESTESS, GETSUREI, KEEPS THE SACRED MIRROR THAT ONCE HELD THE SUN. WHILE IT HANGS BEHIND HER, NIGHT NEVER ENDS.',
 scn:{gr:['#0c0c14','#10101a'],seal:'tomoe',wall:'eclipse',out:'garden'},
 scatter:[['moontoro',3],['susuki',4],['offering',1]],
 t:{DUN:{name:'THE ECLIPSE SHRINE',fl:['#24222c','#2a2832'],sp:'#1a1820',wt:'#08080c',wf:'#1a1620',we:'#c8d0e0',cloth:'#7a1a20',dark:'#14101a',acc:'#e8e8ff',
   pool:['weaver','seer','orbiter','splitter','warden','herald','orbiter','splitter','seer','warden','tengu','kitsune']},
  ENV:{k:'marble',liq:0,amt:0,lc:['#08080c','#101018','#c8d0e0'],wall:'palace',fl:['#24222c','#2a2832'],sp:'#1a1820'},
  ROMAN:'XIV',STAGEDECO:[['mirrorstand',2],['moontoro',4],['shimerock',3],['susuki',4],['offering',2],['blacktorii',2]],
  DECO_GROUPS:[[['blacktorii',0,0],['moontoro',-18,10],['moontoro',18,10,1]],[['mirrorstand',0,0],['offering',0,14],['susuki',-14,6],['susuki',14,6,1]],[['shimerock',0,0],['susuki',-12,8],['moontoro',16,-4]]],
  FLOORART:eclFloor,MOOD:['#04040a',.5],PSTAGE:['hira',45,64],BMUSIC:{s:'hira',r:42,b:124,w:'sawtooth'},
  TRAILS:{n:'ECLIPSE',c:'#e8e8ff',c2:'#ff4060'},BOSS_HPT:10.5,POOLADD:[],PMAP:[.97,.04],
  MASTER_LINES:'THE MIRROR IS BROKEN AND THE MOON RISES. BUT BENEATH THE LAKE THE DARK GOES DOWN AND DOWN - THE ABYSS. THOSE WHO DESCEND NEVER FIND ITS FLOOR. GO ON, OR LEAVE AS A LEGEND.',
  BOSSRELIC:{id:'eclipsemirror',name:'ECLIPSE MIRROR',d:'A PERFECT DODGE RETURNS THE NEAREST SHOT AS A MOON-BOLT (ONCE PER SECOND)',g:'M',fx:'guard',mo:'vortex'},
  BOSS:{name:'GETSUREI, THE ECLIPSE PRIESTESS',hp:2900,hat:'hair',pref:95,spd:36,r:10,k1:[],k2:[],pal:null},
  BSTYLE:{c:'#e8e8ff',t:['THE TIDE','THE ECLIPSE','TOTAL ECLIPSE'],ph:[[{pat:'aimedring',cnt:12,sp:46,col:'#e8e8ff'}],[{pat:'aimedring',cnt:14,sp:48,col:'#e8e8ff'}],[{pat:'aimedring',cnt:16,sp:50,col:'#ff4060'}]]},
  BMODES:['circle','circle','blink'],BMOTIF:[0,3,5,7,5,3,0,null,7,5,3,2,0,null,0,null]}});
BOSS[ECL_I].pal=basePal('#e8e8f0','#7a1a20','#c8d0e0','#0c0a10');
// ---------------- GETSUREI, THE ECLIPSE PRIESTESS ----------------
// A shrine priestess: white haori over deep crimson hakama, long black hair tied low with a white paper band, a gohei
// wand of white paper streamers in her hand. Behind her hangs the sacred mirror as a halo - a black disc ringed with a
// silver corona. Second form: the mirror cracks and its corona turns red, her hair loosens and turns white.
function getDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const WH='#eceef4',HK=two?'#3a0a10':'#8a1a24',HA=two?'#e8e8f0':'#14101a',SK='#e8c8a8',CO=two?'#ff4060':'#c8d0e0';
 // the mirror halo behind her: corona rays, a silver rim, a black disc (cracked in the second form)
 const mx=cx,my=18+by;for(let i=0;i<16;i++){const a=i/16*TAU+(Q.spin||0)*.3,r0=17,r1=i%2?21:24;L(Math.round(mx+Math.cos(a)*r0),Math.round(my+Math.sin(a)*r0),Math.round(mx+Math.cos(a)*r1),Math.round(my+Math.sin(a)*r1),CO,1);}
 E(mx,my,16,16,OUTC);E(mx,my,15,15,CO);E(mx,my,13,13,'#0c0a10');E(mx-4,my-4,3,3,'#1a1620');
 if(two){L(mx-8,my-10,mx-1,my-2,'#ff4060',1);L(mx-1,my-2,mx+5,my+9,'#ff4060',1);L(mx-1,my-2,mx+9,my-5,'#ff4060',1);}
 // hakama to the floor, white haori over the body with wide sleeves
 trap(cx,42+by,72,9,15,HK,{pleats:2});trap(cx,24+by,46,8,11,WH);R(cx-1,26+by,3,18,'#d0d4dc');R(cx-9,44+by,19,2,'#c03030');
 // arms; the near hand holds the gohei up when she casts
 const far=Q.far||[[28,28],[24,37],[27,44]],near=Q.near||[[44,28],[49,36],[47,44]];
 trap(far[1][0],far[0][1]+by,far[1][1]+6+by,3,7,WH);arm(far,WH,WH,SK,5);arm(near,WH,WH,SK,5);trap(near[1][0],near[0][1]+by,near[1][1]+6+by,3,7,WH);
 const gx=near[2][0],gy=near[2][1]+by;L(gx,gy,gx+(Q.gdx||3),gy-(Q.gdy||14),'#8a6a40',1);const tx=gx+(Q.gdx||3),ty=gy-(Q.gdy||14);
 for(let i=0;i<4;i++){const zx=tx-3+i*2;for(let k=0;k<7;k++)R(zx+((k>>1)%2),ty+k,1,1,k%2?'#ffffff':'#e0e4ec');}
 // head: long hair framing a calm face, tied low; loose and white in the second form
 const hx=cx,hy=16+by;E(hx,hy-1,8,8,OUTC);E(hx,hy-1,7,7,HA);face(hx,hy+1,SK,{eye:two?'#ff4060':OUTC,brow:two?'#c8c8d0':'#14101a',mouth:false});
 R(hx-7,hy-1,3,two?22:16,HA);R(hx+5,hy-1,3,two?22:16,HA);R(hx-7,hy-7,15,3,HA);if(!two){R(hx-7,hy+9,3,2,'#ffffff');R(hx+5,hy+9,3,2,'#ffffff');}
 R(hx-1,hy-2,3,1,two?'#ff4060':'#c03030');}
humBoss('GETSUREI, THE ECLIPSE PRIESTESS',getDraw,{idle0:{},idle1:{b:1,spin:.5},
 atk:{dy:-1,near:[[44,28],[51,22],[52,14]],gdx:2,gdy:15,spin:1.5}},{sc:1.15});
// signature 1: THE TIDE - crescents of moonlight wash in from the edges of the arena, slow to a halt, then pull back
// out the way they came. Each crescent has a gap; the gap of the returning tide is not where it was going in.
BHP.crescent={fam:'sig',tags:['wall','field'],cost:p=>2.5+.4*(p.waves-2),def:{waves:3,n:15,arc:1.6,sp:70,iv:1.15,t1:1.6,hold:.35,back:58,gapW:.32,dur:4.6,col:'#e8e8ff'},
 tick(I,dt){const p=I.p,A=I.A;if(!every(I,'w',dt,p.iv)||(I.st.k|0)>=p.waves)return;const k=I.st.k=(I.st.k|0)+1;
  const R0=Math.min(A.x1-A.x0,A.y1-A.y0)*.52,c=Math.atan2(P.y-A.cy,P.x-A.cx)+(k%2?.5:-.5)+(Math.random()-.5)*.4,gap=(Math.random()-.5)*p.arc*.6;
  for(let i=0;i<p.n;i++){const off=(i/(p.n-1)-.5)*p.arc;if(Math.abs(off-gap)<p.gapW)continue;const a=c+off,x=A.cx+Math.cos(a)*R0,y=A.cy+Math.sin(a)*R0;
   // turning back, each shot swings a little sideways so the returning crescent's opening moves
   bhFire(I,x,y,a+Math.PI,p.sp,{bst:'turn',sp0:p.sp,t1:p.t1,hold:p.hold,ta:Math.PI+(gap>0?-.25:.25),sp1:p.back,spr:'bshard',r:3,col:k%2?p.col:'#c8d0e0',life:p.t1+p.hold+4});}}};
// signature 2: ECLIPSE - a black moon drifts toward you with a corona of short rotating beams round its rim; inside the
// ring of beams is safe, and the beams pass over you if you stay with the moon. At the end it bursts into a ring.
BHP.eclipse={fam:'sig',tags:['arena','zone'],cost:p=>3+.4*(p.rays-6),def:{rays:6,rim:22,ray:46,om:.7,drift:22,tele:1,dur:6,col:'#e8e8ff',burst:18},
 tick(I,dt){const p=I.p,st=I.st;
  if(!st.go){st.go=1;st.x=bhOX(I);st.y=bhOY(I);st.m={x:st.x,y:st.y,I};ECLM.push(st.m);
   for(let i=0;i<p.rays;i++){const a0=i/p.rays*TAU;const L0=bhLaser({x:st.x,y:st.y,a:a0,len:p.ray,fixedLen:1,w:5,tele:p.tele,stay:p.dur-p.tele-.2,col:p.col,dmg:13*((I.own&&I.own.dm)||1),own:I.own});
    L0.follow=(L,d)=>{const rot=(L.rot=(L.rot||0)+(L.t>L.tele?p.om*d:0));const a=a0+rot;L.a=a;L.x=st.x+Math.cos(a)*p.rim;L.y=st.y+Math.sin(a)*p.rim;L.om=0;};}}
  // drift toward you, slower than you walk
  const dx=P.x-st.x,dy=P.y-st.y,l=Math.hypot(dx,dy);if(l>4){st.x+=dx/l*p.drift*dt;st.y+=dy/l*p.drift*dt;}st.m.x=st.x;st.m.y=st.y;
  if(I.t>=p.dur-.25&&!st.b){st.b=1;const off=Math.random()*TAU;for(let i=0;i<p.burst;i++)bhFire(I,st.x,st.y,off+i/p.burst*TAU,40,{r:2,spr:'bgrain',col:p.col,life:4});}}};
// the moon discs (drawn, harmless: the eye of the storm); they go when their pattern ends
const ECLM=[];
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);for(let i=ECLM.length-1;i>=0;i--){const m=ECLM[i];if(m.I.dead||!BHI.includes(m.I)){ECLM.splice(i,1);continue;}
 const X=sx(m.x,m.y),Y=sy(m.x,m.y)-6;ctx.globalAlpha=.35;ctx.fillStyle='#e8e8ff';ctx.beginPath();ctx.arc(X,Y,12,0,TAU);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#e8e8ff';ctx.beginPath();ctx.arc(X,Y,9,0,TAU);ctx.fill();ctx.fillStyle='#0c0a10';ctx.beginPath();ctx.arc(X,Y,8,0,TAU);ctx.fill();}};}
{const _ld=loadDungeon;loadDungeon=function(){ECLM.length=0;return _ld.apply(this,arguments);};}
// the climax: TOTAL ECLIPSE - the moon covers the sun at the arena's heart; a long corona turns round it while the tide
// washes in from every side, and at the last the dark closes to a ring and the mirror shatters into a final burst
BHP.totality={fam:'sig',tags:['arena'],cost:()=>6,def:{dur:17,col:'#ff4060'},
 tick(I,dt){const p=I.p,A=I.A,t=I.t,st=I.st;
  if(!st.c){st.c=1;const n=4;for(let i=0;i<n;i++){const a0=i/n*TAU;const L0=bhLaser({x:A.cx,y:A.cy,a:a0,len:300,w:7,tele:1.6,stay:13,col:p.col,dmg:15*((I.own&&I.own.dm)||1),own:I.own});L0.free=1;
    L0.follow=(L,d)=>{const r=(L.rot=(L.rot||0)+(L.t>L.tele?(.32+.1*Math.min(1,Math.max(0,L.t-6)/4))*d:0));L.a=a0+r;L.x=A.cx+Math.cos(L.a)*16;L.y=A.cy+Math.sin(L.a)*16;L.om=0;};}}
  if(t>1.8&&t<15&&every(I,'tide',dt,2.3))bhStart(I.own,'crescent',{waves:2,n:13,iv:.5,sp:66,t1:1.5,dur:1.4,col:'#ff8090'});
  if(t>6&&t<14&&every(I,'sp',dt,.2)){const a=(st.a=(st.a||0)-.21);for(let i=0;i<2;i++)bhFire(I,A.cx,A.cy,a+i*Math.PI,34,{spr:'bstar',r:3,col:'#e8e8ff',life:6});}
  if(t>=15.5&&!st.f){st.f=1;const off=Math.random()*TAU,g=Math.atan2(P.y-A.cy,P.x-A.cx);for(let w=0;w<2;w++)for(let i=0;i<30;i++){const a=off+i/30*TAU;if(Math.abs(angDiff(a,g+w*.6))<.35)continue;bhFire(I,A.cx,A.cy,a,44+w*12,{spr:'bshard',r:3,col:'#ff4060',life:6});}}}};
const GET_POOL={
 1:t=>[{n:'crescent',w:2.5,sig:1,gap:1.1,p:()=>({waves:3,n:15})},{n:'spiral',w:1,p:()=>({arms:4,spin:.24,rate:.11,sp:46,interlock:1,col:'#c8d0e0',dur:5})},{n:'aimed',w:1,p:()=>({mode:'predict',n:3,sp:100,iv:.5,vol:4,col:'#ff8090'})}],
 2:t=>[{n:'crescent',w:1.6,sig:1,gap:1,p:()=>({waves:4,n:16,iv:1})},{n:'eclipse',w:2.2,sig:1,gap:1.2,p:()=>({rays:6,om:.7})},{n:'dyn',w:1,p:()=>({mode:'shed',n:3,sp:60,iv:.9,dur:3.6,col:'#e8e8ff'})},{n:'ring',w:.8,p:()=>({cnt:22,sp:48,waves:4,gapW:.6,gapRot:.7,conc:[1,.8]})}],
 3:t=>[{n:'crescent',w:1.4,sig:1,gap:.9,p:()=>({waves:4,n:17,iv:.9,gapW:.28})},{n:'eclipse',w:1.6,sig:1,gap:1,p:()=>({rays:7,om:.85,drift:26})},{n:'aimed',w:1,p:()=>({mode:'trap',iv:.9,delay:.8,dur:4})},{n:'spiral',w:1,p:()=>({arms:4,spin:.24,rate:.11,sp:48,interlock:1,rev:2,dur:5})},{n:'cross',w:.8,p:()=>({mode:'walls',sp:54,iv:1.1,gap:30,dur:4.5})}],
 4:t=>[{n:'crescent',w:1.5,sig:1,gap:.8,p:()=>({waves:5,n:18,iv:.85,gapW:.26,sp:76})},{n:'eclipse',w:1.5,sig:1,gap:.9,p:()=>({rays:8,om:.95,drift:30})},{n:'dyn',w:1,p:()=>({mode:'orbit',n:8,sp:56,orad:20,ow:2.4,to:1.2,raim:1,dur:3.4})},{n:'aimed',w:1,p:()=>({mode:'predict',n:3,sp:110,iv:.4,vol:6})},{n:'multispiral',w:.8,p:()=>({n:3,spin:.3,rate:.14,sp:42,dur:5})},{n:'arena',w:.7,p:()=>({mode:'corridor',sp:50,iv:.5,dur:4})}]};
// ---------------- her fight ----------------
// ESTABLISHMENT (the tide; learn to follow it out), ESCALATION (the eclipse joins), ADVANCED (both, with snares and
// reversing spirals; she blinks between the moon's phases), SIGNATURE CLIMAX (TOTAL ECLIPSE, then everything).
const getPhase=e=>{const f=e.hp/e.maxhp;return f>.72?1:f>.46?2:f>.2?3:4;};
BKIT['GETSUREI, THE ECLIPSE PRIESTESS']={director:bossDirector,guide:['PRIESTESS OF THE BLACK MOON. SHE KEEPS THE SUN IN A MIRROR.','THE TIDE: CRESCENTS WASH IN, STOP, AND PULL BACK OUT. STAND WHERE THE WAVE HAS BEEN.','ECLIPSE: A BLACK MOON FOLLOWS YOU WITH A CORONA OF TURNING BEAMS. INSIDE THE BEAMS IS SAFE.','AT THE LAST, TOTAL ECLIPSE: THE CORONA FILLS THE ARENA.'],pref:100,gap:1,halfName:'THE MIRROR CRACKS - THE CORONA BLEEDS',noContact:true,
 events:[lateSurvival({at:.55,dur:18,name:'THE TIDE OF NIGHT',tier:4}),
  {at:.2,dur:18,name:'TOTAL ECLIPSE',hint:'THE SUN GOES OUT - FOLLOW THE TIDE',survival:true,storm:1,
   start(e,E){const A=arenaOf(e);E.home=freeSpot(e,A.cx,A.cy-30,e.r);bhStart(e,'totality',{dur:17.5});},
   tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*3);e.y+=(E.home.y-e.y)*Math.min(1,dt*3);},
   end(e,E){bhStop(e);}}],
 tick(e,dt,d,inEv){if(phaseGate(e,BKIT[e.name],dt))return true;const ph=getPhase(e);
  if(!e.D||e.Dph!==ph){if(e.D)ldirStop(e.D);e.Dph=ph;const t=(e.lateTier||4)+(ph>=3?1:0);e.D=ldirNew(e,t,GET_POOL[ph](t),{maxLayers:ph<=2?2:3});
   if(ph>1){txtFx(e.x,e.y-20,['','','THE ECLIPSE','THE TURNING TIDE','THE LAST NIGHT'][ph],ECL.c,1.6);sfx('boss');}}
  ldirTick(e.D,dt);lateBossMods(e,e.D,dt);
  const a=Math.atan2(P.y-e.y,P.x-e.x);if(ph>=3){e.blT=(e.blT==null?3.6:e.blT)-dt;if(e.blT<=0){e.blT=4;const A=arenaOf(e);const s=freeSpot(e,A.x0+30+Math.random()*(A.x1-A.x0-60),A.y0+30+Math.random()*(A.y1-A.y0-60),e.r);if(Math.hypot(s.x-P.x,s.y-P.y)>60){fxRing(e.x,e.y,16,ECL.c,.3);e.x=s.x;e.y=s.y;fxRing(e.x,e.y,16,ECL.c,.3);}}}
  defaultMove(e,dt,d,a,BKIT[e.name]);return true;},
 onDeath(e){bhStop(e);if(e.D)ldirStop(e.D);}};
// the eclipse mirror: a perfect dodge (a dash through a shot) returns the nearest enemy shot as a moon-bolt
{const _u=updPlay;updPlay=function(dt){const r=_u.apply(this,arguments);if(!P||!R||!R.inv||!R.inv.eclipsemirror)return r;R.emT=Math.max(0,(R.emT||0)-dt);
 if(P.dash>0&&R.emT<=0){let best=null,bd=18;for(const q of projs){if(q.from!=='e'||q.dead)continue;const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<bd){bd=d;best=q;}}
  if(best){R.emT=1;best.dead=true;let tg=null,td=260;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<td){td=d;tg=e;}}
   const a=tg?Math.atan2(tg.y-P.y,tg.x-P.x):Math.atan2(-best.vy,-best.vx);projs.push(mkProj('p',P.x,P.y,a,240,S.atk*1.6,{r:3,col:'#e8e8ff',life:1.4,pierce:1}));spark(P.x,P.y,'#e8e8ff',5,50);}}return r;};}
