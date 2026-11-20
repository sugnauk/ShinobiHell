'use strict';
// SHINOBIDUNGEONS - the SHINOBI kit performed (see ANIMATION_AUDIT.md; core in 191). Violet shadow, smoke grey.
//  RMB SHURIKEN FAN  a sweeping throw; real four-pointed stars that spin as they fly
//  Q   SHADOW STEP   (already a real blink and stab) unchanged
//  E   SMOKE BOMB    a capsule hits the floor and cracks open into the original smoke
//  F   CALTROPS      a low sweeping toss: the spikes bounce out of his hand and land as little spiked jacks
//  R   SHADOW CLONES the clones are drawn in his throwing pose when they throw, not as still copies
Object.assign(ABTUNE,{shuri:{spin:22},calt:{n:12,fly:.3},smoke:{drop:.14},clone:{throw:.18}});
for(const n of ['SHURIKEN FAN','CALTROPS','SMOKE BOMB','SHADOW CLONES'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'SHURIKEN FAN':['fanthrow',.28],'CALTROPS':['scatter',.34],'SMOKE BOMB':['smoketoss',.26]});
const isNin=()=>P&&CLS().k==='shinobi';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // the arm sweeps across: hand back, flung through, follow-through low
  case 'fanthrow':{o.frame=u<.3?12:u<.6?13:14;o.skew=(u<.3?-.2*abEase(u/.3):.28*(1-abEase((u-.3)/.7)))*d;o.dx=Math.round((u<.3?-1.5:2*(1-u))*d);o.trail=u>.3&&u<.6;break;}
  // crouch low and toss underhand
  case 'scatter':{o.frame=u<.4?15:14;const k2=Math.sin(u*Math.PI);o.sy=1-.16*k2;o.sx=1+.06*k2;o.skew=.1*d*k2;break;}
  case 'smoketoss':{const reach=Math.sin(u*Math.PI);o.frame=u<.28?12:u<.72?13:14;o.sy=1-.18*reach;o.skew=.2*d*reach;o.dx=Math.round(2*d*reach);break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ---- RMB SHURIKEN FAN: spinning stars ----
PSPR.shuri=(X,Y,ux,uy,q)=>{const s=Math.floor(time*ABTUNE.shuri.spin+q.x)%2,c='#c8c8d0',k='#14101a';ctx.fillStyle=k;ctx.fillRect(X-3,Y-1,7,3);ctx.fillRect(X-1,Y-3,3,7);
 ctx.fillStyle=c;if(s){ctx.fillRect(X-2,Y,5,1);ctx.fillRect(X,Y-2,1,5);}else{ctx.fillRect(X-2,Y-2,1,1);ctx.fillRect(X+2,Y-2,1,1);ctx.fillRect(X-2,Y+2,1,1);ctx.fillRect(X+2,Y+2,1,1);ctx.fillRect(X-1,Y-1,3,3);}ctx.fillStyle='#ffffff';ctx.fillRect(X,Y,1,1);};
{const _cc=classCast;classCast=function(k){const n0=projs.length;const r=_cc.apply(this,arguments);if(isNin()&&k==='h')for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from==='p')q.spr='shuri';}return r;};}
// ---- F CALTROPS: tossed out of the hand, bouncing into place ----
{const _cc=classCast;classCast=function(k){const nz=zones.length;const r=_cc.apply(this,arguments);if(isNin()&&k==='f')for(const z of zones.slice(nz))if(z.k==='calt'){const C=ABTUNE.calt;z.born=time;z.from={x:P.x+Math.cos(P.aim)*4,y:P.y+Math.sin(P.aim)*4};
  z.jacks=[];for(let i=0;i<C.n;i++){const a=i/C.n*TAU+rnd(-.2,.2),rr=z.r*(.25+.75*Math.sqrt(Math.random()));z.jacks.push({x:z.x+Math.cos(a)*rr,y:z.y+Math.sin(a)*rr,d:rnd(0,.08),f:Math.random()<.5});}}return r;};}
CZD.calt=z=>{const C=ABTUNE.calt;ctx.globalAlpha=.4;for(let i=0;i<20;i++){const a=i/20*TAU,x=z.x+Math.cos(a)*z.r,y=z.y+Math.sin(a)*z.r;ctx.fillStyle='#8a8a96';ctx.fillRect(Math.round(sx(x,y)),Math.round(sy(x,y)),1,1);}ctx.globalAlpha=1;
 if(!z.jacks)return;const fade=Math.min(1,z.t/.3);ctx.globalAlpha=fade;
 for(const J of z.jacks){const u=Math.min(1,Math.max(0,(time-z.born-J.d)/C.fly)),x=z.from.x+(J.x-z.from.x)*u,y=z.from.y+(J.y-z.from.y)*u,h=Math.round(u<.76?10*Math.sin(u/.76*Math.PI):3*Math.sin((u-.76)/.24*Math.PI)),X=Math.round(sx(x,y)),Y=Math.round(sy(x,y))-h;
  // a spiked jack: four points, one always up
  ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-2,5,3);ctx.fillRect(X,Y-4,1,2);ctx.fillStyle='#a0a8b0';ctx.fillRect(X-1,Y-1,3,1);ctx.fillRect(X+(J.f?1:-1),Y-2,1,1);ctx.fillStyle='#e8eef6';ctx.fillRect(X,Y-3,1,1);}ctx.globalAlpha=1;};
// ---- E SMOKE BOMB: the protection starts at cast, with the smoke burst timed to the capsule landing.
CZ.smoke=(z,dt)=>{if(z.bombA==null||z.landed)return;z.age+=dt;if(z.age<ABTUNE.smoke.drop)return;
 z.landed=true;sfx('tool');
 for(let i=0;i<40;i++){const a=Math.random()*TAU,s=rnd(20,80);particles.push({x:z.x,y:z.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.6,1.2),col:pick(['#aab','#889','#ccd'])});}};
{const _sm=CZD.smoke;CZD.smoke=function(z){if(z.bombA==null||z.landed)return _sm(z);};}
function drawSmokeCapsule(z){if(z.landed)return;
 const u=clamp(z.age/ABTUNE.smoke.drop,0,1),x=z.x+Math.cos(z.bombA)*6*(1-u),y=z.y+Math.sin(z.bombA)*6*(1-u),
  X=sx(x,y),Y=sy(x,y)-Math.round(11*(1-u*u)+Math.sin(u*Math.PI)*3);
 ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-2,5,4);
 ctx.fillStyle='#525066';ctx.fillRect(X-1,Y-2,3,3);
 ctx.fillStyle='#a6a4bc';ctx.fillRect(X,Y-2,1,2);
 ctx.fillStyle='#d79968';ctx.fillRect(X+1,Y-3,1,1);}
// ---- R SHADOW CLONES: they throw in the throwing pose ----
{const _cl=CZ.clone;CZ.clone=function(z,dt){const n0=projs.length,r=_cl.apply(this,arguments);z.viewAge=(z.viewAge||0)+dt;
 if(projs.length>n0){const q=projs[projs.length-1];z.thrT=time;z.thrA=Math.atan2(q.vy,q.vx);}return r;};}
CZD.clone=z=>{const age=z.viewAge||0,t=time-(z.thrT??-100),toss=t<ABTUNE.clone.throw,
 frame=toss?(t<.064?13:14):z.tk<.07&&z.thrT!=null?12:Math.floor(age*3+z.ang)%2,
 fl=toss?scrVec(Math.cos(z.thrA),Math.sin(z.thrA))[0]<0:scrVec(-Math.sin(z.ang),Math.cos(z.ang))[0]<0,
 fade=(z.fromUlt?1:abEase(age/.16))*abEase(z.t/.35);
 const x=z.fromUlt&&!age?P.x+Math.cos(z.ang)*26:z.x,y=z.fromUlt&&!age?P.y+Math.sin(z.ang)*26:z.y;
 const X=sx(x,y),Y=sy(x,y);ctx.save();ctx.globalAlpha=.4*fade;shadow(X,Y+1,9);
 ctx.globalAlpha=.66*fade;drawSpr(heroSpr(CLS().k,P.evo||0),X,Y+3,false,frame,fl);ctx.restore();};
