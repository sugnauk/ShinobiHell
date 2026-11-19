'use strict';
// SHINOBIDUNGEONS - the SHINOBI kit performed (see ANIMATION_AUDIT.md; core in 191). Violet shadow, smoke grey.
//  RMB SHURIKEN FAN  a sweeping throw; real four-pointed stars that spin as they fly
//  Q   SHADOW STEP   (already a real blink and stab) unchanged
//  E   SMOKE BOMB    (the original smoke cloud, kept)
//  F   CALTROPS      a low sweeping toss: the spikes bounce out of his hand and land as little spiked jacks
//  R   SHADOW CLONES the clones are drawn in his throwing pose when they throw, not as still copies
Object.assign(ABTUNE,{shuri:{spin:22},calt:{n:12,fly:.3},clone:{throw:.18}});
for(const n of ['SHURIKEN FAN','CALTROPS'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'SHURIKEN FAN':['fanthrow',.28],'CALTROPS':['scatter',.34]});
const isNin=()=>P&&CLS().k==='shinobi';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // the arm sweeps across: hand back, flung through, follow-through low
  case 'fanthrow':{o.frame=u<.3?12:u<.6?13:14;o.skew=(u<.3?-.2*abEase(u/.3):.28*(1-abEase((u-.3)/.7)))*d;o.dx=Math.round((u<.3?-1.5:2*(1-u))*d);o.trail=u>.3&&u<.6;break;}
  // crouch low and toss underhand
  case 'scatter':{o.frame=u<.4?15:14;const k2=Math.sin(u*Math.PI);o.sy=1-.16*k2;o.sx=1+.06*k2;o.skew=.1*d*k2;break;}
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
 for(const J of z.jacks){const u=Math.min(1,Math.max(0,(time-z.born-J.d)/C.fly)),x=z.from.x+(J.x-z.from.x)*u,y=z.from.y+(J.y-z.from.y)*u,h=Math.round(Math.abs(Math.sin(u*Math.PI*1.5))*10*(1-u*.5)),X=Math.round(sx(x,y)),Y=Math.round(sy(x,y))-h;
  // a spiked jack: four points, one always up
  ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-2,5,3);ctx.fillRect(X,Y-4,1,2);ctx.fillStyle='#a0a8b0';ctx.fillRect(X-1,Y-1,3,1);ctx.fillRect(X+(J.f?1:-1),Y-2,1,1);ctx.fillStyle='#e8eef6';ctx.fillRect(X,Y-3,1,1);}ctx.globalAlpha=1;};
// ---- E SMOKE BOMB: the original smoke (kept: it reads best)
// ---- R SHADOW CLONES: they throw in the throwing pose ----
{const _cl=CZ.clone;CZ.clone=function(z,dt){const n0=projs.length;const r=_cl.apply(this,arguments);if(projs.length>n0){z.thrT=time;z.thrA=angTo(z,{x:projs[projs.length-1].x+projs[projs.length-1].vx,y:projs[projs.length-1].y+projs[projs.length-1].vy});}return r;};}
CZD.clone=z=>{const s=heroSpr(CLS().k,P.evo||0),thr=z.thrT&&time-z.thrT<ABTUNE.clone.throw,fl=thr?scrVec(Math.cos(z.thrA),Math.sin(z.thrA))[0]<0:z.x>P.x;
 ctx.globalAlpha=.25;ctx.fillStyle='#000';ctx.fillRect(Math.round(sx(z.x,z.y))-4,Math.round(sy(z.x,z.y))+1,9,2);ctx.globalAlpha=.6;drawSpr(s,sx(z.x,z.y),sy(z.x,z.y)+3,false,thr?13:Math.floor(time*2.5+z.ang)%2,fl);
 ctx.globalAlpha=.35;drawSpr(s,sx(z.x,z.y),sy(z.x,z.y)+3,true,thr?13:Math.floor(time*2.5+z.ang)%2,fl);ctx.globalAlpha=1;};
