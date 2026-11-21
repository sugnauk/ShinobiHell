'use strict';
// SHINOBIDUNGEONS - the advanced bullet-hell library for the late game (stages XIII and beyond).
// Every pattern is a timed GENERATOR with adjustable parameters (speed, density, angle, timing, rotation, gap, duration)
// that emits over its life instead of firing once, so patterns can be layered and run side by side. Emissions are
// checked before they appear (see 187-director.js): a batch that would leave the player no reachable safe ground is
// thinned until it does. Patterns, by family:
//  SPIRAL    spiral (either way, interlocking pairs, periodic reversal, breathing speed, expand/contract), multispiral
//  RADIAL    ring (full, concentric speeds, staggered, sequential waves, rotating gap), radialaim (rings alternating
//            with aimed fans)
//  AIMED     aimed: direct volleys, predictive (leads you), successive re-aimed volleys, spreading fans, delayed traps
//            on the spot you just left
//  CROSSING  cross: diagonal streams crossing the arena, opposing walls with offset gaps, alternating horizontal and
//            vertical barrages, waves at different speeds
//  DYNAMIC   dyn: curving fans, accelerating / decelerating shots, shots that stop, flash and turn once toward you,
//            orbs that split into rings, comets that shed a stream, orbiting shells released outward
//  ARENA     arena: sweeping lasers, rotating laser wheels, temporary walls, a moving safe corridor, a narrowing ring,
//            barrages from the arena's edges, a sequence of hazard circles that drives you across the room
// Bullets come from a pool (no garbage per shot), player shots find foes through a spatial grid, and the projectile
// list is compacted in place.
const BHT={grid:new Map(),gridT:-1,bosses:[],near:[],empty:new Set(),pv:{x:0,y:0,px:0,py:0}};
// ---------------- spatial grid: player shots only test the foes near them ----------------
const BHCELL=48;
function bhBuildGrid(){const G=BHT.grid;for(const v of G.values())v.length=0;BHT.bosses.length=0;
 for(const e of enemies){if(e.dead)continue;if(e.boss||e.r>24){BHT.bosses.push(e);continue;}const k=((e.x/BHCELL)|0)*4096+((e.y/BHCELL)|0);let L=G.get(k);if(!L){L=[];G.set(k,L);}L.push(e);}}
projFoes=function(q){if(BHT.gridT!==R.time){BHT.gridT=R.time;bhBuildGrid();}const N=BHT.near;N.length=0;for(const b of BHT.bosses)N.push(b);
 const cx=(q.x/BHCELL)|0,cy=(q.y/BHCELL)|0;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const L=BHT.grid.get((cx+i)*4096+cy+j);if(L)for(const e of L)N.push(e);}return N;};
// ---------------- pooled enemy bullets ----------------
function bhNew(x,y,a,sp,dmg,o){const q=BHPOOL.pop()||{};for(const k in q)q[k]=undefined;
 if(R&&R.asc)sp*=1+.06*R.asc;
 q.from='e';q.x=x;q.y=y;q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp;q.r=3;q.dmg=dmg;q.life=5;q.col='#f66';q.pd=10;q.pierce=0;q.hit=BHT.empty;q.own=null;q.peril=false;q.arrow=false;q.bhp=1;q.pool=undefined;q.dead=false;q.age=0;
 if(o)for(const k in o)q[k]=o[k];return q;}
// ---------------- new bullet behaviours (q.bst) ----------------
//  turn     flies, slows to a stop and flashes, then sets off again at a new angle (toward you, or a fixed turn)
//  breath   its speed swells and shrinks as it flies
//  burst    after a while it bursts into a ring (or an aimed fan) of smaller shots
//  shed     sheds a small shot sideways every so often as it flies (a comet with a tail of danger)
//  orbitrel circles a centre for a while, then is released outward or toward you
//  accel2   accelerates or decelerates toward a target speed
//  hang     stops after a set distance and hangs in place (a temporary wall), then fades
{const _ss=stepStyle;stepStyle=function(q,dt){if(!q.bst)return _ss.apply(this,arguments);q.age=(q.age||0)+dt;
 switch(q.bst){
  case 'turn':{if(q.age<q.t1){const k=1-Math.min(1,q.age/q.t1)*.92,sp=q.sp0*k;const a=Math.atan2(q.vy,q.vx);q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp;}
   else if(!q.turned&&q.age>=q.t1+q.hold){q.turned=1;const a=q.ta==='aim'?Math.atan2(P.y-q.y,P.x-q.x)+(q.tj||0):Math.atan2(q.vy,q.vx)+q.ta;q.vx=Math.cos(a)*q.sp1;q.vy=Math.sin(a)*q.sp1;}
   else if(!q.turned){q.vx*=.5;q.vy*=.5;}break;}
  case 'breath':{const a=Math.atan2(q.vy,q.vx),sp=q.sp0*(1+q.amp*Math.sin(q.age*q.fq+(q.ph||0)));q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp;break;}
  case 'burst':{if(!q.bursted&&q.age>=q.tb){q.bursted=1;q.dead=true;const n=q.bn||8,pa=Math.atan2(P.y-q.y,P.x-q.x),off=q.baim?pa-(n-1)/2*(q.bsp||.3):Math.random()*TAU;
    for(let i=0;i<n;i++){const an=q.baim?off+i*(q.bsp||.3):off+i/n*TAU;projs.push(bhNew(q.x,q.y,an,q.bv||48,q.dmg*.8,{r:2,col:q.bcol||q.col,spr:'bgrain',own:q.own,life:4}));}}break;}
  case 'shed':{q.st2=(q.st2||0)-dt;if(q.st2<=0){q.st2=q.si||.18;const a=Math.atan2(q.vy,q.vx);for(const s of q.both?[-1,1]:[q.side||1])projs.push(bhNew(q.x,q.y,a+s*Math.PI/2,q.sv||26,q.dmg*.6,{r:2,col:q.scol||q.col,spr:'bgrain',own:q.own,life:3.5}));}break;}
  case 'orbitrel':{if(q.age<q.to){const c=q.oc;q.oa+=q.ow*dt;const cx=c&&!c.dead?c.x:q.ox,cy=c&&!c.dead?c.y:q.oy;q.ox=cx;q.oy=cy;q.x=cx+Math.cos(q.oa)*q.orad;q.y=cy+Math.sin(q.oa)*q.orad;q.vx=q.vy=0;}
   else if(!q.rel){q.rel=1;const a=q.raim?Math.atan2(P.y-q.y,P.x-q.x):q.oa+(q.rtan?Math.sign(q.ow)*Math.PI/2:0);q.vx=Math.cos(a)*q.rv;q.vy=Math.sin(a)*q.rv;}
   break;}
  case 'accel2':{const a=Math.atan2(q.vy,q.vx),sp=Math.hypot(q.vx,q.vy),ns=sp+(q.tv-sp)*Math.min(1,q.ak*dt);q.vx=Math.cos(a)*ns;q.vy=Math.sin(a)*ns;break;}
  case 'hang':{q.dd=(q.dd||0)+Math.hypot(q.vx,q.vy)*dt;if(q.dd>=q.hd&&!q.hung){q.hung=1;q.vx=q.vy=0;q.life=Math.min(q.life,q.hl||2.4);}break;}
 }
 if(q.curve2){const c=Math.cos(q.curve2*dt),s=Math.sin(q.curve2*dt),vx=q.vx*c-q.vy*s;q.vy=q.vx*s+q.vy*c;q.vx=vx;}};}
// the turn, burst and orbit-release are telegraphed: a flashing ring around the shot just before it changes
{const _dp=drawProj;drawProj=function(q){_dp.apply(this,arguments);if(!q.bst||q.from!=='e'||q.dead)return;let warn=0;
 if(q.bst==='turn'&&!q.turned&&q.age>q.t1-.05)warn=1;else if(q.bst==='burst'&&!q.bursted&&q.age>q.tb-.35)warn=1;else if(q.bst==='orbitrel'&&!q.rel&&q.age>q.to-.3)warn=1;
 if(!warn||Math.floor(time*16)%2)return;const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7;ctx.strokeStyle='#ffffff';ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(X,Y,q.r+3,0,TAU);ctx.stroke();ctx.globalAlpha=1;};}
// ---------------- bullet looks: each family has its own silhouette, with a white core the size of its hitbox ----------------
Object.assign(PSPR,{
 // a four-point star (field bullets)
 bstar(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y),r=q.r+1;ctx.fillStyle='#14101a';ctx.fillRect(x-r-1,y-1,r*2+3,3);ctx.fillRect(x-1,y-r-1,3,r*2+3);ctx.fillStyle=q.col;ctx.fillRect(x-r,y,r*2+1,1);ctx.fillRect(x,y-r,1,r*2+1);ctx.fillRect(x-1,y-1,3,3);ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);},
 // a comet: a bright head and a short tail along its flight (aimed and fast bullets)
 bcomet(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y);ctx.strokeStyle=q.col;ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-ux*9,y-uy*9);ctx.lineTo(x,y);ctx.stroke();ctx.lineWidth=1;ctx.globalAlpha=1;
  ctx.fillStyle='#14101a';ctx.fillRect(x-3,y-3,6,6);ctx.fillStyle=q.col;ctx.fillRect(x-2,y-2,4,4);ctx.fillStyle='#fff';ctx.fillRect(x-1,y-1,2,2);},
 // a shard: a diamond pointing along its flight (walls and crossing streams)
 bshard(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y);ctx.fillStyle='#14101a';ctx.beginPath();ctx.moveTo(x+ux*6,y+uy*6);ctx.lineTo(x-uy*3,y+ux*3);ctx.lineTo(x-ux*5,y-uy*5);ctx.lineTo(x+uy*3,y-ux*3);ctx.closePath();ctx.fill();
  ctx.fillStyle=q.col;ctx.beginPath();ctx.moveTo(x+ux*4,y+uy*4);ctx.lineTo(x-uy*2,y+ux*2);ctx.lineTo(x-ux*3,y-uy*3);ctx.lineTo(x+uy*2,y-ux*2);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);},
 // a rice grain: small and elongated (secondary shots, splits, sheds)
 bgrain(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y);ctx.strokeStyle='#14101a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-ux*3,y-uy*3);ctx.lineTo(x+ux*3,y+uy*3);ctx.stroke();ctx.strokeStyle=q.col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-ux*2,y-uy*2);ctx.lineTo(x+ux*2,y+uy*2);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);},
 // a big orb with a glowing ring (slow, heavy, and the ones that burst)
 borb(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y),r=q.r+1;ctx.fillStyle='#14101a';ctx.beginPath();ctx.arc(x,y,r+1,0,TAU);ctx.fill();ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(x,y,Math.max(1,r-2.5),0,TAU);ctx.fill();ctx.globalAlpha=1;}});
// ---------------- lasers ----------------
// A laser warns first (a thin flickering line for `tele` seconds), then fires a beam for `stay` seconds. It can sweep
// or spin while it fires. Dashing passes through it; touching it otherwise hurts.
const LZ=[];
function bhLaser(o){const L=Object.assign({x:0,y:0,a:0,len:400,max0:420,w:6,tele:.8,stay:1.2,om:0,col:'#80d0ff',dmg:12,t:0,own:null,follow:null},o);L.len=L.len||400;LZ.push(L);return L;}
function lzEnd(L){return [L.x+Math.cos(L.a)*L.len,L.y+Math.sin(L.a)*L.len];}
function lzHits(L,x,y,pad){const dx=x-L.x,dy=y-L.y,c=Math.cos(L.a),s=Math.sin(L.a),u=dx*c+dy*s,v=-dx*s+dy*c;return u>=0&&u<=L.len&&Math.abs(v)<=L.w/2+(pad||0);}
function lzTick(dt){for(const L of LZ){if(L.dead)continue;L.t+=dt;if(L.own&&L.own.dead&&!L.free){L.dead=1;continue;}if(L.follow)L.follow(L,dt);
  // the beam stops at walls
  if(!L.fixedLen){let d=8;const c=Math.cos(L.a),s=Math.sin(L.a);while(d<L.max0&&!solid(L.x+c*d,L.y+s*d))d+=6;L.len=d;}
  const live=L.t>=L.tele;if(live)L.a+=L.om*dt;
  if(live&&L.len>0&&L.t<L.tele+L.stay&&P&&P.hp>0&&!(P.dying>0)&&P.dash<=0&&P.iv<=0&&lzHits(L,P.x,P.y,1.5))hitPlayer(L.dmg,P.x,P.y,{src:L.own,pd:12,bullet:true});
  if(L.t>=L.tele+L.stay+.15)L.dead=1;}
 for(let i=LZ.length-1;i>=0;i--)if(LZ[i].dead)LZ.splice(i,1);}
function lzDraw(){for(const L of LZ){if(L.dead||L.len<=0)continue;const [ex,ey]=lzEnd(L),X0=sx(L.x,L.y),Y0=sy(L.x,L.y)-6,X1=sx(ex,ey),Y1=sy(ex,ey)-6;
 if(L.t<L.tele){const k=L.t/L.tele;ctx.globalAlpha=(Math.floor(time*(10+k*20))%2?.85:.35);ctx.strokeStyle=L.col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X0,Y0);ctx.lineTo(X1,Y1);ctx.stroke();
  // the warning widens to the beam's width as it gets ready
  ctx.globalAlpha=.18*k;ctx.lineWidth=Math.max(1,L.w*k);ctx.beginPath();ctx.moveTo(X0,Y0);ctx.lineTo(X1,Y1);ctx.stroke();}
 else{const k=L.t-L.tele,fade=k>L.stay?1-(k-L.stay)/.15:Math.min(1,k/.06);ctx.globalAlpha=.45*fade;ctx.strokeStyle=L.col;ctx.lineWidth=L.w+2;ctx.beginPath();ctx.moveTo(X0,Y0);ctx.lineTo(X1,Y1);ctx.stroke();
  ctx.globalAlpha=.95*fade;ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(1,L.w*.4);ctx.beginPath();ctx.moveTo(X0,Y0);ctx.lineTo(X1,Y1);ctx.stroke();}
 ctx.lineWidth=1;ctx.globalAlpha=1;}}
// ---------------- the generator runner ----------------
// An instance: {def, own, p (params), t, dur, st (state)}; each frame its tick emits into a staging batch that the
// director checks for fairness before it joins the fight.
const BHI=[],BHSTAGE=[];
const BHP={}; // name -> {fam, tags, cost(p), dur, tick(I,dt)}
function bhArena(own){const r=(own&&own.room)||(P&&P.room)||(map&&map.rooms&&map.rooms.find(r=>inRoom(r,P.x,P.y,0)));if(!r)return {x0:P.x-150,y0:P.y-110,x1:P.x+150,y1:P.y+110,cx:P.x,cy:P.y};
 return {x0:(r.x+1)*T,y0:(r.y+1)*T,x1:(r.x+r.w-1)*T,y1:(r.y+r.h-1)*T,cx:(r.x+r.w/2)*T,cy:(r.y+r.h/2)*T};}
function bhStart(own,name,p){const D=BHP[name];if(!D)return null;const P0=Object.assign({},D.def||{},p||{});const I={def:D,name,own,p:P0,t:0,dur:P0.dur||D.dur||4,st:{},cd:0,A:bhArena(own)};D.init&&D.init(I);BHI.push(I);return I;}
function bhStop(own){for(const I of BHI)if(!own||I.own===own)I.dead=1;for(const L of LZ)if(!own||L.own===own)L.dead=1;}
const bhOX=I=>I.st.ex!=null?I.st.ex:(I.own&&!I.own.dead?I.own.x:I.A.cx),bhOY=I=>I.st.ey!=null?I.st.ey:(I.own&&!I.own.dead?I.own.y:I.A.cy);
const paim=(x,y)=>Math.atan2(P.y-y,P.x-x);
// shoot into the staging batch
function bhFire(I,x,y,a,sp,o){const dm=(I.p.dmg||10)*((I.own&&I.own.dm)||1);const q=bhNew(x,y,a,sp,dm,Object.assign({col:I.p.col||'#f8c',spr:I.p.spr||null,r:I.p.r||3,own:I.own&&!I.own.virtual?I.own:null,life:I.p.life||5},o||null));q._I=I;BHSTAGE.push(q);return q;}
function bhTick(dt){if(!P)return;
 // the player's velocity, for predictive aim
 const V=BHT.pv;V.vx=(P.x-V.px)/Math.max(dt,1e-3);V.vy=(P.y-V.py)/Math.max(dt,1e-3);V.px=P.x;V.py=P.y;
 for(const I of BHI){if(I.dead)continue;if(I.own&&I.own.dead&&!I.own.virtual){I.dead=1;continue;}I.t+=dt;if(I.t>=I.dur){I.dead=1;I.def.end&&I.def.end(I);continue;}
  BHSTAGE.length=0;I.def.tick(I,dt);if(BHSTAGE.length)bhCommit(I);}
 for(let i=BHI.length-1;i>=0;i--)if(BHI[i].dead)BHI.splice(i,1);
 lzTick(dt);}
// commit a staged batch: the director's fairness check may thin it first (bhFair is defined in 187-director.js)
function bhCommit(I){const B=BHSTAGE;if(typeof bhFair==='function')bhFair(B,I);for(const q of B)if(!q.dead)projs.push(q);else if(BHPOOL.length<4000)BHPOOL.push(q);B.length=0;}
const every=(I,key,dt,iv)=>{I.st[key]=(I.st[key]==null?0:I.st[key])-dt;if(I.st[key]<=0){I.st[key]+=iv;return true;}return false;};
// ---------------- SPIRAL ----------------
BHP.spiral={fam:'spiral',tags:['field'],cost:p=>2+(p.interlock?1:0)+(p.rev?.5:0)+(p.breathe?.5:0),def:{arms:4,spin:.22,rate:.1,sp:46,dir:1,rev:0,swav:0,interlock:0,breathe:0,dur:5,spr:'bstar',col:'#c8a0ff'},
 init(I){I.st.a=Math.random()*TAU;},
 tick(I,dt){const p=I.p;if(!every(I,'e',dt,p.rate))return;let dir=p.dir;if(p.rev)dir*=Math.sin(I.t*Math.PI/p.rev)>=0?1:-1;I.st.a+=p.spin*dir;
  const sp=p.sp*(1+p.swav*Math.sin(I.t*2.2))*(p.breathe?1+p.breathe*Math.sin(I.t*1.6):1),x=bhOX(I),y=bhOY(I),r0=p.breathe?6+p.breathe*14*(1+Math.sin(I.t*1.6)):6;
  for(let i=0;i<p.arms;i++){const a=I.st.a+i*TAU/p.arms;bhFire(I,x+Math.cos(a)*r0,y+Math.sin(a)*r0,a,sp);}
  if(p.interlock)for(let i=0;i<p.arms;i++){const a=-I.st.a+(i+.5)*TAU/p.arms;bhFire(I,x+Math.cos(a)*r0,y+Math.sin(a)*r0,a,sp*.85,{col:p.col2||'#80d0ff'});}}};
// several spiral emitters orbiting the owner, each turning its own way
BHP.multispiral={fam:'spiral',tags:['field'],cost:()=>3,def:{n:3,orad:30,ow:.8,arms:2,spin:.3,rate:.14,sp:42,dur:5,spr:'bstar',col:'#ffb0e0'},
 init(I){I.st.a=0;I.st.s=[];for(let k=0;k<I.p.n;k++)I.st.s.push(Math.random()*TAU);},
 tick(I,dt){const p=I.p;I.st.a+=p.ow*dt;if(!every(I,'e',dt,p.rate))return;for(let k=0;k<p.n;k++){const ea=I.st.a+k*TAU/p.n,x=bhOX(I)+Math.cos(ea)*p.orad,y=bhOY(I)+Math.sin(ea)*p.orad;I.st.s[k]+=p.spin*(k%2?-1:1);
  for(let i=0;i<p.arms;i++)bhFire(I,x,y,I.st.s[k]+i*TAU/p.arms,p.sp);}}};
// ---------------- RADIAL ----------------
// waves of rings: concentric speeds, a half-step stagger each wave, and a gap that turns from wave to wave
BHP.ring={fam:'radial',tags:['radial'],cost:p=>1.5+(p.gapRot?.5:0)+(p.conc&&p.conc.length>1?.5:0),def:{cnt:20,sp:44,waves:4,wgap:.7,gapW:.7,gapRot:.5,stagger:1,conc:[1],dur:3.4,spr:'borb',col:'#ff8090',r:3},
 init(I){I.st.w=0;I.st.g=Math.random()*TAU;I.st.e=.05;},
 tick(I,dt){const p=I.p;if(I.st.w>=p.waves||!every(I,'e',dt,p.wgap))return;const w=I.st.w++,off=(p.stagger&&w%2?.5:0)/p.cnt*TAU,g=I.st.g+w*p.gapRot,x=bhOX(I),y=bhOY(I);
  for(const k of p.conc)for(let i=0;i<p.cnt;i++){const a=off+i/p.cnt*TAU;if(p.gapW&&Math.abs(angDiff(a,g))<p.gapW/2)continue;bhFire(I,x,y,a,p.sp*k);}}};
// rings that alternate with aimed fans: read the ring, then step out of the fan
BHP.radialaim={fam:'radial',tags:['radial','aimed'],cost:()=>3,def:{cnt:18,sp:42,fan:5,fsp:80,spread:.16,iv:.75,dur:4,col:'#ffb070',spr:'borb'},
 tick(I,dt){const p=I.p;if(!every(I,'e',dt,p.iv))return;const x=bhOX(I),y=bhOY(I),k=(I.st.k=(I.st.k||0)+1);
  if(k%2){const off=Math.random()*TAU;for(let i=0;i<p.cnt;i++)bhFire(I,x,y,off+i/p.cnt*TAU,p.sp);}
  else{const pa=paim(x,y);for(let i=0;i<p.fan;i++)bhFire(I,x,y,pa+(i-(p.fan-1)/2)*p.spread,p.fsp,{spr:'bcomet',r:2,col:'#fff0c0'});}}};
// ---------------- AIMED ----------------
BHP.aimed={fam:'aimed',tags:['aimed'],cost:p=>({direct:1,predict:1.5,successive:2,fan:1.5,trap:2}[p.mode]||1.5),def:{mode:'direct',n:3,sp:96,spread:.1,iv:.55,vol:4,dur:3,col:'#fff0c0',spr:'bcomet',r:2,delay:.9},
 tick(I,dt){const p=I.p,x=bhOX(I),y=bhOY(I);
  if(p.mode==='trap'){if(!every(I,'e',dt,p.iv))return;// the spot you are on now erupts a moment later: keep moving
   const {x:tx,y:ty}=latePoint(I.A,P.x,P.y,12);mark({k:'c',x:tx,y:ty,r:12,t:p.delay,dmg:0,col:p.col,quiet:1,src:I.own,lateCheck:true,on(){
    for(let i=0;i<8;i++)bhFire(I,tx,ty,i/8*TAU,52,{r:2,col:p.col,spr:'bgrain',life:3});
    bhCommit(I);
   }});return;}
  if(!every(I,'e',dt,p.iv))return;if((I.st.v=(I.st.v||0)+1)>p.vol)return;
  let pa=paim(x,y);
  if(p.mode==='predict'){const V=BHT.pv,d=Math.hypot(P.x-x,P.y-y),tt=d/p.sp;pa=Math.atan2(P.y+V.vy*tt*.8-y,P.x+V.vx*tt*.8-x);}
  const n=p.mode==='fan'?p.n+2:p.n,sprd=p.mode==='fan'?p.spread*2.2:p.spread;
  for(let i=0;i<n;i++)bhFire(I,x,y,pa+(i-(n-1)/2)*sprd,p.sp*(p.mode==='successive'?1+.08*I.st.v:1));}};
// ---------------- CROSSING ----------------
BHP.cross={fam:'cross',tags:['wall'],cost:p=>({diag:2.5,walls:2.5,hv:3,multi:3}[p.mode]||2.5),def:{mode:'diag',sp:60,iv:.32,gap:26,lanes:9,dur:4,col:'#a0f0ff',spr:'bshard',r:2},
 tick(I,dt){const p=I.p,A=I.A;if(!every(I,'e',dt,p.iv))return;const k=(I.st.k=(I.st.k||0)+1);
  if(p.mode==='diag'){// two streams from opposite corners, crossing the middle; their aim sways so the crossing point wanders
   const sw=Math.sin(I.t*1.3)*.35;for(const [x,y,ta] of [[A.x0,A.y0,Math.atan2(A.cy-A.y0,A.cx-A.x0)+sw],[A.x1,A.y1,Math.atan2(A.cy-A.y1,A.cx-A.x1)+sw],[A.x1,A.y0,Math.atan2(A.cy-A.y0,A.cx-A.x1)-sw],[A.x0,A.y1,Math.atan2(A.cy-A.y1,A.cx-A.x0)-sw]])
    if((k+(x===A.x0?0:1))%2)for(const o of [-.08,.08])bhFire(I,x,y,ta+o,p.sp);}
  else{// walls marching in from the edges with a gap; horizontal and vertical alternate, or opposing walls with offset gaps
   const hv=p.mode==='hv'?k%2:0,op=p.mode==='walls',spd=p.mode==='multi'?p.sp*(k%3===0?1.4:k%3===1?.8:1):p.sp;
   const sides=op?[0,1]:[k%2];for(const sd of sides){const horiz=hv?1:0;const len=horiz?A.y1-A.y0:A.x1-A.x0,n=Math.max(4,Math.floor(len/12)),g0=(n*(.2+Math.random()*.6))|0,gw=Math.max(2,Math.round(p.gap/12));
    for(let i=0;i<n;i++){if(i>=g0&&i<g0+gw)continue;const f=(i+.5)/n;if(horiz){const x=sd?A.x1:A.x0,y=A.y0+f*len;bhFire(I,x,y,sd?Math.PI:0,spd);}else{const y=sd?A.y1:A.y0,x=A.x0+f*len;bhFire(I,x,y,sd?-Math.PI/2:Math.PI/2,spd);}}}}}};
// ---------------- DYNAMIC ----------------
BHP.dyn={fam:'dyn',tags:p=>({curve:['field'],accel:['field'],turn:['aimed'],split:['radial'],shed:['aimed','field'],orbit:['radial']}[p.mode]||['field']),cost:p=>({curve:2,accel:2,turn:2.5,split:2,shed:3,orbit:2.5}[p.mode]||2),
 def:{mode:'curve',n:7,sp:58,iv:.5,dur:4,col:'#a0ffc0',spr:'bgrain',r:2,curve:.9,orad:22,ow:2.4,to:1.4},
 tick(I,dt){const p=I.p,x=bhOX(I),y=bhOY(I),pa=paim(x,y);
  if(p.mode==='orbit'){if(I.st.done)return;I.st.done=1;for(let i=0;i<(p.n+3);i++)bhFire(I,x,y,0,0,{bst:'orbitrel',oc:I.own,ox:x,oy:y,oa:i/(p.n+3)*TAU,orad:p.orad,ow:p.ow,to:p.to,rv:p.sp,raim:!!p.raim,rtan:!p.raim,spr:'borb',r:3,life:p.to+4});return;}
  if(!every(I,'e',dt,p.iv))return;const k=(I.st.k=(I.st.k||0)+1);
  if(p.mode==='curve'){for(let i=0;i<p.n;i++){const a=pa+(i-(p.n-1)/2)*.32;bhFire(I,x,y,a,p.sp,{curve2:(k%2?1:-1)*p.curve,life:4});}}
  else if(p.mode==='accel'){for(let i=0;i<p.n;i++){const a=pa+(i-(p.n-1)/2)*.28;const slow=k%2;bhFire(I,x,y,a,slow?18:p.sp*1.6,{bst:'accel2',tv:slow?p.sp*1.5:p.sp*.45,ak:slow?.9:1.4});}}
  else if(p.mode==='turn'){for(let i=0;i<p.n;i++){const a=pa+(i-(p.n-1)/2)*.5+Math.PI*(k%2?0:.15);bhFire(I,x,y,a,p.sp,{bst:'turn',sp0:p.sp,t1:.7,hold:.35,ta:'aim',tj:(i-(p.n-1)/2)*.05,sp1:p.sp*1.35,spr:'bcomet',r:2});}}
  else if(p.mode==='split'){bhFire(I,x,y,pa+(Math.random()-.5)*.6,p.sp*.6,{bst:'burst',tb:1.1,bn:p.n+3,bv:44,spr:'borb',r:4,bcol:p.col2||'#ffffff'});}
  else if(p.mode==='shed'){bhFire(I,x,y,pa+(k%2?.3:-.3),p.sp*.8,{bst:'shed',si:.16,sv:24,both:1,spr:'bcomet',r:3,life:4});}}};
// ---------------- ARENA CONTROL ----------------
BHP.arena={fam:'arena',tags:p=>({laser:['arena'],rotlasers:['arena'],wall:['zone'],corridor:['arena','wall'],narrow:['arena','zone'],boundary:['wall'],sequence:['zone']}[p.mode]||['arena']),
 cost:p=>({laser:2.5,rotlasers:3.5,wall:2,corridor:4,narrow:4,boundary:2.5,sequence:2}[p.mode]||2.5),
 def:{mode:'laser',n:3,om:.6,sweep:1.6,tele:.9,stay:2,w:7,sp:56,iv:.45,dur:4,col:'#80d0ff',spr:'bshard',r:2,dmg:12},
 tick(I,dt){const p=I.p,A=I.A,x=bhOX(I),y=bhOY(I);
  if(p.mode==='laser'){if(I.st.go)return;I.st.go=1;const a0=paim(x,y)-p.sweep/2;bhLaser({x,y,a:a0,w:p.w,tele:p.tele,stay:p.stay,om:p.sweep/p.stay,col:p.col,dmg:p.dmg,own:I.own,max0:420,follow:I.own&&!I.own.virtual?(L=>{L.x=I.own.x;L.y=I.own.y;}):null});return;}
  if(p.mode==='rotlasers'){if(I.st.go)return;I.st.go=1;const a0=Math.random()*TAU;for(let i=0;i<p.n;i++)bhLaser({x,y,a:a0+i*TAU/p.n,w:p.w,tele:p.tele,stay:p.stay,om:p.om*(p.dir||1),col:p.col,dmg:p.dmg,own:I.own,max0:420,follow:I.own&&!I.own.virtual?(L=>{L.x=I.own.x;L.y=I.own.y;}):null});return;}
  if(p.mode==='wall'){// a line of shots flies out and hangs as a temporary wall, with one gap, then fades
   if(!every(I,'e',dt,p.iv*4))return;const pa=paim(x,y),pr=pa+Math.PI/2,n=13,g0=2+((Math.random()*(n-5))|0);for(let i=0;i<n;i++){if(i>=g0&&i<g0+3)continue;const off=(i-(n-1)/2)*11;bhFire(I,x+Math.cos(pr)*off,y+Math.sin(pr)*off,pa,p.sp,{bst:'hang',hd:Math.min(110,Math.hypot(P.x-x,P.y-y)*.7),hl:2.2,spr:'bshard'});}return;}
  if(p.mode==='corridor'){// two parallel streams pour across the arena; the safe lane between them drifts from side to side
   if(!every(I,'e',dt,p.iv))return;const mid=(A.y0+A.y1)/2+Math.sin(I.t*.9)*(A.y1-A.y0)*.28,half=p.cw||26;for(const yy of [A.y0,A.y1])for(let s=0;s<3;s++){const t2=(s+.5)/3,y1=yy===A.y0?A.y0+(mid-half-A.y0)*t2:mid+half+(A.y1-mid-half)*t2;bhFire(I,A.x0,y1,0,p.sp,{spr:'bshard'});}return;}
  if(p.mode==='narrow'){// a ring of shots closes in around the arena centre; its gap turns as it closes
   if(!every(I,'e',dt,p.iv*2.2))return;const n=34,R0=Math.min(A.x1-A.x0,A.y1-A.y0)*.62,g=I.t*.8,gw=.9;for(let i=0;i<n;i++){const t2=i/n*TAU;if(Math.abs(angDiff(t2,g))<gw/2)continue;const bx=A.cx+Math.cos(t2)*R0,by=A.cy+Math.sin(t2)*R0;if(solid(bx,by))continue;bhFire(I,bx,by,t2+Math.PI,p.sp*.6,{spr:'bshard',life:R0/(p.sp*.6)+.2});}return;}
  if(p.mode==='boundary'){// shots from every edge of the arena, in random lanes (the edges are never safe)
   if(!every(I,'e',dt,p.iv))return;for(let s=0;s<2;s++){const side=(Math.random()*4)|0,f=.1+Math.random()*.8;const pts=[[A.x0+f*(A.x1-A.x0),A.y0,Math.PI/2],[A.x0+f*(A.x1-A.x0),A.y1,-Math.PI/2],[A.x0,A.y0+f*(A.y1-A.y0),0],[A.x1,A.y0+f*(A.y1-A.y0),Math.PI]][side];
    for(const o of [-.1,0,.1])bhFire(I,pts[0],pts[1],pts[2]+o,p.sp,{spr:'bshard'});}return;}
  if(p.mode==='sequence'){// hazard circles erupt one after another along a path, herding you across the room
   if(!every(I,'e',dt,p.iv*1.6))return;const a=I.st.a=(I.st.a==null?Math.random()*TAU:I.st.a+.9);
   const {x:tx,y:ty}=latePoint(A,P.x+Math.cos(a)*10,P.y+Math.sin(a)*10,22);
   mark({k:'c',x:tx,y:ty,r:22,t:1.1,dmg:(p.dmg||12)*((I.own&&I.own.dm)||1),col:p.col,src:I.own,lateCheck:true});return;}}};
// the runner ticks with the game, and lasers draw above the sprites and below the bullets
// it runs on game time (inside updPlay), so slow motion, hitstop, pauses and freezes all apply to it
{const _up=updPlay;updPlay=function(dt){const r=_up.apply(this,arguments);try{if(P&&!(P.dying>0)&&freezeT<=0)bhTick(dt);}catch(err){console.error(err);}return r;};}
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);if(LZ.length)lzDraw();};}
{const _ld=loadDungeon;loadDungeon=function(){BHI.length=0;LZ.length=0;return _ld.apply(this,arguments);};}
// a cleared screen (phase changes, bombs) also ends lasers and generators of the cleared side
{const _ces=clearEnemyShots;clearEnemyShots=function(){const r=_ces.apply(this,arguments);for(const L of LZ)if(L.t<L.tele)L.dead=1;return r;};}
