'use strict';
// SHINOBIDUNGEONS - the GUNNER kit performed (see ANIMATION_AUDIT.md; core in 191). Black powder smoke, orange fire, brass.
//  RMB HEAVY SLUG  the recoil shoves him back; a fan of fire and a cloud of smoke at the muzzle; the slug is a hot iron
//                  ball trailing a corkscrew of smoke
//  Q   GRAPESHOT   a cone of fire bursts from the barrel the width of the spread, and the pellets fly as hot shards
//  E   POWDER ROLL (the roll was already real) the keg goes up in a fireball, a smoke ring and flying barrel staves
//  F   TRIPOD GUN  set up leg by leg, then the gun drops onto it; it turns to its target, kicks and flashes on every shot
//  R   SIEGEBREAKER (already the standard) unchanged
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
// fix: the siege cannon was drawn on EVERY recoil pose (Heavy Slug, Grapeshot...) while Siegebreaker was equipped;
// now only the ultimate's own brace and recoil draw it
{const _cu=castUlt;castUlt=function(){const H0=ABPOSE;const r=_cu.apply(this,arguments);if(ABPOSE&&ABPOSE!==H0&&ultName()==='SIEGEBREAKER'&&ABPOSE.k==='recoil')ABPOSE.sb=1;return r;};}
{const _sg=drawSiegeGun;drawSiegeGun=function(){const H=ABPOSE;if(!H||!(H.k==='u_brace'||H.sb))return;return _sg.apply(this,arguments);};}
// ---- areas you can see: the tripod's firing range and the keg's blast ----
function areaRing(x,y,r,col,al,dash){ctx.globalAlpha=al;ctx.strokeStyle=col;if(dash)ctx.setLineDash([3,3]);ctx.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(sx(px,py),sy(px,py)):ctx.moveTo(sx(px,py),sy(px,py));}ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
const TRIPOD_RANGE=240;
{const _td=CZD.tripod;CZD.tripod=z=>{const f=Math.min(1,z.t/.3);ctx.globalAlpha=.06*f;wdisc(z.x,z.y,TRIPOD_RANGE,'#ffd060');ctx.globalAlpha=1;areaRing(z.x,z.y,TRIPOD_RANGE,'#ffd060',.45*f,true);return _td(z);};}
{const _kd=CZD.gkeg;CZD.gkeg=z=>{const fl=Math.floor(time*10)%2;ctx.globalAlpha=.14+(fl?.08:0);wdisc(z.x,z.y,z.r,'#ff8030');ctx.globalAlpha=1;areaRing(z.x,z.y,z.r,'#ff8030',.8);return _kd(z);};}
// the wizard's thunder totem (an E/F alternative) shows its reach too
if(CZD.totem){const _tt=CZD.totem;CZD.totem=z=>{areaRing(z.x,z.y,z.r,'#ffff66',.4,true);return _tt(z);};}
// ---- SIEGEBREAKER's gun, restyled: a bronze o-zutsu with a dragon-head muzzle on a red lacquered stock. The dragon's
// jaws glow as it charges and breathe fire when it goes off ----
drawSiegeGun=function(X,Y,aim,pull,after){const H=ABPOSE;if(!H||!(H.k==='u_brace'||H.sb))return;
 const v=scrVec(Math.cos(aim),Math.sin(aim)),aimA=Math.atan2(v[1],v[0]),left=v[0]<0,swing=abEase(Math.min(1,pull/.4)),a=aimA+(1-swing)*(left?1.6:-1.6);
 const kick=after>0?Math.max(0,1-after*3)*6:0,tremble=pull>=1||after>0?0:pull>.45?Math.sin(time*70)*.8:0,alpha=after>.7?1-(after-.7)/.3:1;
 ctx.save();ctx.globalAlpha*=Math.max(0,alpha);ctx.translate(Math.round(X+(left?-2:2)),Math.round(Y-11+tremble));ctx.rotate(a);if(left)ctx.scale(1,-1);ctx.translate(-kick,0);
 const sc=.6+.4*swing;ctx.scale(sc,sc);const Rr=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 Rr(-13,-4,13,8,'#14101a');Rr(-12,-3,11,6,'#a01818');Rr(-12,-3,11,1,'#d04040');Rr(-13,-4,2,8,'#e0b040');          // lacquered stock, gold butt
 Rr(-1,-5,24,10,'#14101a');Rr(0,-4,22,8,'#a0702a');Rr(0,-4,22,2,'#d8a850');Rr(0,2,22,2,'#6a4418');                  // bronze barrel
 for(const bx of [3,10,17]){Rr(bx,-5,2,10,'#14101a');Rr(bx,-4,2,8,'#e0b040');}                                       // gold rings
 // the dragon's head: brow and horn, red eye, upper jaw, open mouth, lower jaw, teeth
 Rr(21,-8,14,16,'#14101a');Rr(22,-7,9,5,'#c08a30');Rr(22,-7,9,1,'#e8c060');Rr(20,-10,4,3,'#14101a');Rr(21,-9,3,2,'#e8c060');Rr(27,-6,2,2,'#ff3030');
 Rr(31,-6,4,3,'#c08a30');Rr(22,3,13,4,'#a0702a');Rr(22,6,13,1,'#6a4418');
 const glow=after===0&&pull>.35?(pull-.35)/.65:0;Rr(28,-3,7,6,glow?(Math.floor(time*20)%2?'#ff9030':'#ffd060'):'#3a0a0a');
 for(const tx of [29,32])Rr(tx,-3,1,2,'#ffffff');for(const tx of [30,33])Rr(tx,2,1,2,'#ffffff');
 Rr(-4,4,3,5,'#14101a');Rr(-3,4,1,4,'#3a2416');                                                                     // grip
 if(after>0&&after<.3){ctx.globalAlpha=Math.max(0,alpha)*(1-after/.3);Rr(35,-7,10,14,'#ff9030');Rr(37,-5,10,10,'#ffd060');Rr(40,-3,8,6,'#ffffff');}
 ctx.restore();
 if(after>0&&after<.6&&Math.random()<.5){const wx=P.x+Math.cos(aim)*18,wy=P.y+Math.sin(aim)*18;particles.push({x:wx,y:wy,vx:rnd(-10,10),vy:rnd(-25,-8),t:.6,col:'#8a8494'});}};
