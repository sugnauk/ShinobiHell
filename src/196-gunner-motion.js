'use strict';
// SHINOBIDUNGEONS - the GUNNER kit performed (see ANIMATION_AUDIT.md; core in 191). Black powder smoke, orange fire, brass.
//  RMB HEAVY SLUG  the recoil shoves him back; a fan of fire and a cloud of smoke at the muzzle; the slug is a hot iron
//                  ball trailing a corkscrew of smoke
//  Q   GRAPESHOT   a cone of fire bursts from the barrel the width of the spread, and the pellets fly as hot shards
//  E   POWDER ROLL (the roll was already real) the keg goes up in a fireball, a smoke ring and flying barrel staves
//  F   TRIPOD GUN  set up leg by leg, then the gun drops onto it; it turns to its target, kicks and flashes on every shot
//  R   SIEGEBREAKER a heavy cannon locks against the shoulder, then kicks the Gunner backward
Object.assign(ABTUNE,{slug:{flash:.09,smoke:.6},grape:{cone:.12},keg:{ball:.28,staves:8},tripod:{build:.45,kick:.08}});
for(const n of ['HEAVY SLUG','GRAPESHOT','POWDER ROLL','TRIPOD GUN'])ABX_OWN.add(n);
const isGun=()=>P&&CLS().k==='gunner';
// the muzzle in front of him along the aim
const gunMuzzle=(d)=>({x:P.x+Math.cos(P.aim)*(d||12),y:P.y+Math.sin(P.aim)*(d||12)});
function gunFlash(x,y,a,len,spread,dur,col){topFx({dur,x,y,a,draw(o,k){const n=9,f=1-k;for(let i=0;i<n;i++){const aa=a+(i/(n-1)-.5)*spread,L=len*(.55+.45*Math.sin(i/(n-1)*Math.PI))*(.6+.4*f);
  for(let s=2;s<L;s+=2){const px=x+Math.cos(aa)*s,py=y+Math.sin(aa)*s,X=Math.round(sx(px,py)),Y=Math.round(sy(px,py))-8,hot=s<L*.45;ctx.globalAlpha=f*(hot?1:.7);ctx.fillStyle=hot?'#fff0bd':s<L*.75?'#ffad5f':'#e0602a';ctx.fillRect(X,Y,hot?2:1,hot?2:1);}}ctx.globalAlpha=1;}});}
function gunSmoke(x,y,n,spd){for(let i=0;i<n;i++)particles.push({x:x+rnd(-3,3),y:y+rnd(-3,3),vx:rnd(-spd,spd),vy:rnd(-spd,spd)-12,t:rnd(.4,.8),col:pick(['#8a8494','#a8a2b4','#6a6474'])});}
// ---- RMB HEAVY SLUG ----
PSPR.slug=(X,Y,ux,uy,q)=>{ctx.fillStyle='#14101a';ctx.beginPath();ctx.arc(X,Y,4,0,TAU);ctx.fill();ctx.fillStyle='#3a3a44';ctx.beginPath();ctx.arc(X,Y,3,0,TAU);ctx.fill();ctx.fillStyle=q.cut?'#ffffff':'#ffad5f';ctx.fillRect(Math.round(X+ux*2)-1,Math.round(Y+uy*2)-1,2,2);ctx.fillStyle='#6a6a7a';ctx.fillRect(X-2,Y-2,2,1);};
{const _cc=classCast;classCast=function(k){const n0=projs.length,b=P&&P.ab.h;const r=_cc.apply(this,arguments);if(!isGun())return r;
 if(k==='h'&&P.ab.h!==b){const m=gunMuzzle(14);gunFlash(m.x,m.y,P.aim,22,.7,ABTUNE.slug.flash);gunSmoke(m.x,m.y,10,22);
  for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from!=='p')continue;q.spr='slug';q.sk=0;q.tick=(q,dt)=>{q.sk+=dt*28;particles.push({x:q.x+Math.cos(q.sk)*3,y:q.y+Math.sin(q.sk)*3,vx:-q.vx*.05,vy:-q.vy*.05-8,t:.35,col:Math.random()<.5?'#8a8494':'#a8a2b4'});};}}
 return r;};}
// ---- Q GRAPESHOT: a cone of fire and hot shards ----
PSPR.pellet=(X,Y,ux,uy,q)=>{ctx.fillStyle='#e0602a';ctx.fillRect(Math.round(X-ux*3),Math.round(Y-uy*3),1,1);ctx.fillStyle='#ffad5f';ctx.fillRect(Math.round(X-ux),Math.round(Y-uy),1,1);ctx.fillStyle='#fff0bd';ctx.fillRect(X,Y,2,1);};
{const _cc=classCast;classCast=function(k){const n0=projs.length,b=P&&P.ab.q;const r=_cc.apply(this,arguments);if(!isGun())return r;
 if(k==='q'&&P.ab.q!==b){const m=gunMuzzle(12);gunFlash(m.x,m.y,P.aim,40,.9,ABTUNE.grape.cone);gunSmoke(m.x,m.y,14,30);for(let i=n0;i<projs.length;i++)if(projs[i].from==='p')projs[i].spr='pellet';}
 return r;};}
// ---- E POWDER ROLL: the keg goes up ----
{const _kg=CZ.gkeg;CZ.gkeg=function(z){const t0=z.t,f0=flashT;const r=_kg.apply(this,arguments);if(z.t===0&&t0>0&&!z.blown){z.blown=1;flashT=f0;const K=ABTUNE.keg,x=z.x,y=z.y,R0=z.r;
  topFx({dur:K.ball+.25,draw(o,k){const t=time-o.t0,X=sx(x,y),Y=sy(x,y)-6;if(t<K.ball){const g=abEase(t/K.ball);ctx.globalAlpha=1-g*.5;ctx.fillStyle='#ffad5f';ctx.beginPath();ctx.arc(X,Y,4+R0*.45*g,0,TAU);ctx.fill();ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.arc(X,Y,2+R0*.25*(1-g),0,TAU);ctx.fill();}
   // the smoke ring at the blast's edge
   const rr=R0*abEase(Math.min(1,t/(K.ball+.1)));ctx.globalAlpha=Math.max(0,.6*(1-t/(K.ball+.25)));for(let i=0;i<16;i++){const a=i/16*TAU,px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;ctx.fillStyle='#6a6474';ctx.fillRect(Math.round(sx(px,py))-2,Math.round(sy(px,py))-3,4,3);}ctx.globalAlpha=1;}});
  for(let i=0;i<K.staves;i++){const a=i/K.staves*TAU+rnd(-.3,.3),s=rnd(60,120);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.4,.6),col:i%2?'#7a4a20':'#3a3a40'});}gunSmoke(x,y,12,40);}return r;};}
// ---- F TRIPOD GUN: assembled, then it aims and kicks ----
{const _cc=classCast;classCast=function(k){const nz=zones.length;const r=_cc.apply(this,arguments);if(isGun()&&k==='f')for(const z of zones.slice(nz))if(z.k==='tripod'){z.born=time;z.ga=P.aim;}return r;};}
{const _tp=CZ.tripod;CZ.tripod=function(z,dt){if(z.born&&time-z.born<ABTUNE.tripod.build){z.tk=Math.max(z.tk,.05);return;}const n0=projs.length;const r=_tp.apply(this,arguments);
 if(projs.length>n0){const q=projs[projs.length-1];z.ga=Math.atan2(q.vy,q.vx);z.fired=time;const mx=z.x+Math.cos(z.ga)*9,my=z.y+Math.sin(z.ga)*9;particles.push({x:mx,y:my,vx:rnd(-8,8),vy:-14,t:.35,col:'#a8a2b4'});}
 else if(z.tgA!=null)z.ga=z.tgA;return r;};}
CZD.tripod=z=>{const B=ABTUNE.tripod,age=z.born?time-z.born:9,X=Math.round(sx(z.x,z.y)),Y=Math.round(sy(z.x,z.y)),fade=Math.min(1,z.t/.3);ctx.globalAlpha=fade;
 // legs, one at a time
 const legs=[[-5,3],[5,3],[0,-2]];legs.forEach(([lx,ly],i)=>{if(age<i*.1)return;ctx.fillStyle='#14101a';for(let s=0;s<=6;s++)ctx.fillRect(X+Math.round(lx*s/6)-1,Y-7+Math.round((ly+7)*s/6)-1,3,2);ctx.fillStyle='#7a5a32';for(let s=0;s<=6;s++)ctx.fillRect(X+Math.round(lx*s/6),Y-7+Math.round((ly+7)*s/6),1,1);});
 if(age<.3){ctx.globalAlpha=1;return;}
 // the gun drops onto the mount, then follows its target, kicking back on each shot
 const drop=Math.max(0,1-(age-.3)/.15),[vx,vy]=scrVec(Math.cos(z.ga||0),Math.sin(z.ga||0)),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l,kick=z.fired&&time-z.fired<B.kick?2:0,gx=X-ux*kick,gy=Y-9-Math.round(drop*10);
 ctx.strokeStyle='#14101a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx-ux*5,gy-uy*5);ctx.lineTo(gx+ux*10,gy+uy*10);ctx.stroke();ctx.strokeStyle='#4a4a56';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx-ux*4,gy-uy*4);ctx.lineTo(gx+ux*9,gy+uy*9);ctx.stroke();ctx.lineWidth=1;
 ctx.fillStyle='#c8a040';ctx.fillRect(Math.round(gx),Math.round(gy)-1,2,2);ctx.fillStyle='#6a4428';ctx.fillRect(Math.round(gx-ux*5)-1,Math.round(gy-uy*5)-1,3,3);
 if(kick){ctx.fillStyle='#fff0bd';ctx.fillRect(Math.round(gx+ux*11)-1,Math.round(gy+uy*11)-1,3,3);ctx.fillStyle='#ffad5f';ctx.fillRect(Math.round(gx+ux*13),Math.round(gy+uy*13),2,2);}
 ctx.globalAlpha=1;};
// ---- areas you can see: the tripod's firing range and the keg's blast ----
function areaRing(x,y,r,col,al,dash){ctx.globalAlpha=al;ctx.strokeStyle=col;if(dash)ctx.setLineDash([3,3]);ctx.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(sx(px,py),sy(px,py)):ctx.moveTo(sx(px,py),sy(px,py));}ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
{const _td=CZD.tripod;CZD.tripod=z=>{const f=Math.min(1,z.t/.3);ctx.globalAlpha=.06*f;wdisc(z.x,z.y,TRIPOD_RANGE,'#ffd060');ctx.globalAlpha=1;areaRing(z.x,z.y,TRIPOD_RANGE,'#ffd060',.45*f,true);return _td(z);};}
{const _kd=CZD.gkeg;CZD.gkeg=z=>{const fl=Math.floor(time*10)%2;ctx.globalAlpha=.14+(fl?.08:0);wdisc(z.x,z.y,z.r,'#ff8030');ctx.globalAlpha=1;areaRing(z.x,z.y,z.r,'#ff8030',.8);return _kd(z);};}
// the wizard's thunder totem (an E/F alternative) shows its reach too
if(CZD.totem){const _tt=CZD.totem;CZD.totem=z=>{areaRing(z.x,z.y,z.r,'#ffff66',.4,true);return _tt(z);};}
// ---- R SIEGEBREAKER: lock the cannon, light the fuse, then ride the recoil. ----
const SIEGE_FX={charge:.36,recovery:.54,recoilTime:.22,recoilDistance:38,blast:.62};
ULTSEQ.SIEGEBREAKER.k='siegeaim';
AB_ANIM.SIEGEBREAKER=['siegehold',SIEGE_FX.charge+.06];
function siegePose(h){
 const age=time-h.t0,u=clamp(age/h.dur,0,1),raising=h.k==='u_siegeaim';
 const brace=raising?abEase(u/.76):1-abEase((u-.48)/.52)*(h.k==='siegekick'?.62:0);
 const kick=h.k==='siegekick'?1-abEase(age/.25):0;
 return {u,brace,kick};
}
{const base=abPoseAt;abPoseAt=function(h){
 if(h.k!=='u_siegeaim'&&h.k!=='siegehold'&&h.k!=='siegekick')return base.apply(this,arguments);
 const {u,brace,kick}=siegePose(h),d=h.dir;
 return {u,frame:h.k==='u_siegeaim'&&u<.38?12:kick>.05?14:13,flip:d<0,
  dx:Math.round(-(2*brace+6*kick)*d),sx:1+.13*kick,sy:1-.19*brace+.1*kick,
  skew:d*(.15*brace-.44*kick),rot:-d*.18*kick,alpha:1};
};}
function drawSiegeCannon(x,y,a,brace,kick,fuse){
 const [vx,vy]=scrVec(Math.cos(a),Math.sin(a)),side=vx<0?-1:1;
 ctx.save();
 ctx.translate(x+side*(2-3*kick),y-10+(1-brace)*6+brace*2-3*kick);
 ctx.rotate(Math.atan2(vy,vx)+side*(.68*(1-brace)-.28*kick));
 if(side<0)ctx.scale(1,-1);
 ctx.translate(-kick*4,0);
 const pixel=(x,y,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x,y,w,h);};
 // The wood cheek rest, reinforced breech and a barrel visibly heavier than the matchlock.
 pixel(-12,-3,15,7,'#151018');pixel(-11,-2,12,5,'#714132');
 pixel(-10,-2,9,1,'#b27c50');pixel(-9,1,8,1,'#492837');
 pixel(-4,-5,11,10,'#151018');pixel(-3,-4,9,8,'#4c3d48');pixel(-3,-4,8,2,'#766676');
 pixel(4,-4,18,8,'#151018');pixel(5,-3,16,6,'#514954');
 pixel(5,-3,15,1,'#8d7e8b');pixel(6,1,14,1,'#292631');
 for(const x of [4,12,20]){
  pixel(x,-5,3,10,'#241822');pixel(x,-4,2,8,'#a97544');pixel(x,-4,2,2,'#e0b275');
 }
 pixel(21,-4,3,8,'#25202b');pixel(22,-3,2,6,'#b48b68');pixel(23,-2,1,4,'#211720');
 pixel(-1,-6,4,2,'#c08e5b');pixel(-2,4,3,3,'#503036');
 if(fuse>0){
  const bright=.65+.35*Math.sin(time*48);
  ctx.globalAlpha=fuse;
  pixel(21,-2,3,4,'#e7652e');pixel(23,-1,2,2,'#fff1ab');
  ctx.globalAlpha=bright*fuse;
  pixel(0,-7,5,2,'#d96539');pixel(1,-8,2,3,'#fff0a5');pixel(-2,-10,1,1,'#ffd174');
 }
 ctx.restore();
}
{const base=drawPlayer;drawPlayer=function(){
 const result=base.apply(this,arguments),h=ABPOSE;
 if(!P||P.dying>0||!h||!h.k.includes('siege'))return result;
 const {brace,kick}=siegePose(h);
 if(h.k==='u_siegeaim')drawSiegeCannon(sx(P.x,P.y),sy(P.x,P.y),P.aim,brace,0,0);
 if(h.k==='siegehold'){
  const z=zones.find(z=>z.k==='siege');
  if(z)drawSiegeCannon(sx(P.x,P.y),sy(P.x,P.y),z.a,brace,0,abEase(1-z.t/SIEGE_FX.charge));
 }
 if(h.k==='siegekick')drawSiegeCannon(sx(P.x,P.y),sy(P.x,P.y),h.a,brace,kick,kick);
 return result;
};}

// Project the same lane used by damage and bullet clearing.
function siegePoint(z,along,side=0){
 const c=Math.cos(z.a),s=Math.sin(z.a);
 const x=z.x+c*along-s*side,y=z.y+s*along+c*side;
 return [sx(x,y),sy(x,y)];
}
CZD.siege=z=>{
 const charge=abEase(1-z.t/SIEGE_FX.charge),lit=z.len*charge;
 ctx.save();
 for(const side of [-1,1]){
  const [x,y]=siegePoint(z,0,side*z.r),[endX,endY]=siegePoint(z,z.len,side*z.r);
  const [sparkX,sparkY]=siegePoint(z,lit,side*z.r);
  ctx.globalAlpha=.3;kLine(x,y,endX,endY,1,'#e09351');
  ctx.globalAlpha=.72;kLine(x,y,sparkX,sparkY,1,'#ffc27b');
  ctx.fillStyle='#fff1ba';ctx.fillRect(sparkX-1,sparkY-1,3,2);
 }
 ctx.restore();
};
function siegePlume(z,profile,color,alpha,lift){
 ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();
 for(const [i,[along,side]] of profile.entries()){
  const [x,y]=siegePoint(z,along,side);
  if(i===0)ctx.moveTo(x,y-lift);else ctx.lineTo(x,y-lift);
 }
 ctx.fill();
}
function siegeBlast(z){
 topFx({dur:SIEGE_FX.blast,draw(o,k){
  const age=time-o.t0,front=z.len*abEase(age/.155),width=z.r*abEase(age/.095);
  const tail=Math.max(0,front-55),fade=1-k;
  ctx.save();
  siegePlume(z,[[0,0],[front*.48,-width*.62],[front,-width],[front,width],[front*.48,width*.62]],'#793c38',.67*fade,0);
  siegePlume(z,[[0,0],[front*.46,-width*.88],[front,-width*.78],[front,width*.78],[front*.46,width*.88]],'#b7623d',.46*fade,7);
  const heat=Math.max(0,1-age/.24);
  if(heat>0){
   siegePlume(z,[[tail,0],[front*.83,-width*.54],[front,-width*.72],[front,width*.72],[front*.83,width*.54]],'#ffae5e',.84*heat,8);
   siegePlume(z,[[tail,0],[front,-width*.17],[front,width*.17]],'#fff1bc',heat,8);
  }
  for(const [delay,color] of [[0,'#fff3c8'],[.065,'#ec9860']]){
   const travel=age-delay;if(travel<0||travel>.26)continue;
   const d=z.len*abEase(travel/.155),r=z.r*abEase(travel/.078);
   const [lx,ly]=siegePoint(z,d,-r),[rx,ry]=siegePoint(z,d,r),[cx,cy]=siegePoint(z,Math.min(z.len,d+9),0);
   ctx.globalAlpha=(1-travel/.26)*(delay?.63:1);
   kLine(lx,ly-3,cx,cy-15,delay?1:3,color);
   kLine(cx,cy-15,rx,ry-3,delay?1:3,color);
  }
  ctx.restore();
 }});
}
function fireSiegeFx(z){
 const cos=Math.cos(z.a),sin=Math.sin(z.a),duration=SIEGE_FX.recoilTime;
 P.recoil={x:-cos*SIEGE_FX.recoilDistance,y:-sin*SIEGE_FX.recoilDistance,duration,left:duration};
 ABPOSE={k:'siegekick',dur:SIEGE_FX.recovery,t0:time,dir:scrVec(cos,sin)[0]<0?-1:1,a:z.a};

 const mx=P.x+cos*15,my=P.y+sin*15;
 gunFlash(mx,my,z.a,42,.8,.15,'#fff0ad');
 gunSmoke(mx,my,26,53);
 for(let i=0;i<24;i++){
  const a=z.a+rnd(-.65,.65),speed=rnd(60,160);
  particles.push({x:mx,y:my,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,t:rnd(.18,.46),col:pick(['#fff1ae','#ffae57','#da5a2b'])});
 }
 for(const side of [-1,1])gunSmoke(P.x-sin*side*7,P.y+cos*side*7,7,36);
 siegeBlast(z);
}
