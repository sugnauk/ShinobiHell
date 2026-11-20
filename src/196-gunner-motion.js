'use strict';
// SHINOBIDUNGEONS - the GUNNER kit performed (see ANIMATION_AUDIT.md; core in 191). Black powder smoke, orange fire, brass.
//  RMB HEAVY SLUG  the recoil shoves him back; a fan of fire and a cloud of smoke at the muzzle; the slug is a hot iron
//                  ball trailing a corkscrew of smoke
//  Q   GRAPESHOT   a cone of fire bursts from the barrel the width of the spread, and the pellets fly as hot shards
//  E   POWDER ROLL (the roll was already real) the keg goes up in a fireball, a smoke ring and flying barrel staves
//  F   TRIPOD GUN  set up leg by leg, then the gun drops onto it; it turns to its target, kicks and flashes on every shot
//  R   SIEGEBREAKER a compact hand cannon braces against the shoulder and fires a single pressure front
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
// ---- R SIEGEBREAKER: shoulder the short cannon, hold while the match catches, then kick on the shot.
ULTSEQ.SIEGEBREAKER.k='siegeaim';
AB_ANIM.SIEGEBREAKER=['siegehold',.55];
{const _pa=abPoseAt;abPoseAt=function(H){if(!['u_siegeaim','siegehold','siegekick'].includes(H.k))return _pa.apply(this,arguments);
 const u=clamp((time-H.t0)/H.dur,0,1),raise=H.k==='u_siegeaim'?abEase(u/.7):1,
  kick=H.k==='siegekick'?1-abEase(u/.7):0,d=H.dir;
 return {u,frame:H.k==='u_siegeaim'&&u<.4?12:kick>.15?14:13,flip:d<0,
  dx:-Math.round((raise+3*kick)*d),sx:1+.08*kick,sy:1-.13*raise-.06*kick,skew:d*(.1*raise-.28*kick),alpha:1};};}
function drawSiegeCarbine(X,Y,a,raise,match,kick){const [vx,vy]=scrVec(Math.cos(a),Math.sin(a)),side=vx<0?-1:1;
 ctx.save();ctx.translate(X+side*2,Y-10+(1-raise)*5);ctx.rotate(Math.atan2(vy,vx)+side*.72*(1-raise));
 if(side<0)ctx.scale(1,-1);ctx.translate(-kick*4,0);
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 rect(-8,-3,11,6,'#14101a');rect(-7,-2,9,4,'#724a30');rect(-7,-2,8,1,'#a5784b');
 rect(-1,-4,16,7,'#14101a');rect(0,-3,14,5,'#454650');rect(0,-3,13,1,'#8a8c91');
 rect(4,-3,2,5,'#ae8342');rect(12,-4,3,7,'#14101a');rect(13,-3,1,5,'#71717a');
 rect(-2,2,3,3,'#38251f');rect(-3,-5,2,2,'#a87944');
 if(match){rect(-2,-6,2,2,'#e8803e');rect(-1,-6,1,1,'#ffe0ad');}
 ctx.restore();}
{const _dp=drawPlayer;drawPlayer=function(){const r=_dp.apply(this,arguments),H=ABPOSE;
 if(!P||P.dying>0||!H)return r;
 const u=clamp((time-H.t0)/H.dur,0,1),z=H.k==='siegehold'?zones.find(z=>z.k==='siege'):null;
 if(H.k==='u_siegeaim')drawSiegeCarbine(sx(P.x,P.y),sy(P.x,P.y)-u,P.aim,abEase(u/.7),false,0);
 if(z)drawSiegeCarbine(sx(P.x,P.y),sy(P.x,P.y),z.a,1,z.t<.2,0);
 if(H.k==='siegekick')drawSiegeCarbine(sx(P.x,P.y),sy(P.x,P.y),H.a,1,false,1-abEase(u/.65));
 return r;};}
function fireSiegeFx(z){const c=Math.cos(z.a),s=Math.sin(z.a),mx=P.x+c*13,my=P.y+s*13;
 if(ABPOSE?.k==='siegehold')ABPOSE={k:'siegekick',dur:.33,t0:time,dir:scrVec(c,s)[0]<0?-1:1,a:z.a};
 gunFlash(mx,my,z.a,24,.46,.12,'#ffad5f');gunSmoke(mx,my,12,32);
 topFx({dur:.32,draw(o,k){const front=z.len*abEase(k/.38),fade=1-k,
   path=(along,offset)=>[sx(z.x+c*along-s*offset,z.y+s*along+c*offset),sy(z.x+c*along-s*offset,z.y+s*along+c*offset)-7];
   ctx.save();ctx.globalAlpha=.6*fade;ctx.fillStyle='#86736e';ctx.beginPath();
   for(const [i,[d,w]] of [[0,0],[front*.56,-z.r*.56],[front,-z.r*.76],[front,z.r*.76],[front*.56,z.r*.56]].entries()){
    const [x,y]=path(d,w);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}
   ctx.fill();ctx.globalAlpha=fade;
   const [x0,y0]=path(front,-z.r*.78),[x1,y1]=path(front,z.r*.78),[xm,ym]=path(Math.min(z.len,front+6),0);
   kLine(x0,y0,xm,ym,2,'#e99858');kLine(xm,ym,x1,y1,2,'#e99858');
   ctx.globalAlpha=.8*fade;ctx.fillStyle='#ffe0aa';ctx.fillRect(xm-2,ym-1,5,3);ctx.restore();}});}
