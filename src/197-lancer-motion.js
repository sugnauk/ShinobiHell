'use strict';
// SHINOBIDUNGEONS - the LANCER kit performed (see ANIMATION_AUDIT.md; core in 191). Ice-blue steel, banner red.
//  RMB SPIRAL LUNGE  FIX: it used to teleport him to the end of the lunge. Now he really drives forward over ~0.17s,
//                    spear first and untouchable, cutting each foe once as the spearhead reaches it (same reach,
//                    same damage); a full charge still ends in a spin
//  Q   WHEEL SWEEP   his own move, no longer the samurai's whirlwind arcs: the full length of the spear is seen
//                    sweeping round him twice, the blade at the tip leaving a trail (same two hits, same radius)
//  E   DEFLECT       the spear spun in front of him like a propeller; every shot it turns back throws a spark
//  F   WAR BANNER    he drives a tall banner into the ground: the cloth ripples, and pennant stakes stand on the
//                    edge of its area instead of a flat red disc
//  R   THOUSAND THRUSTS (already the standard) unchanged
Object.assign(ABTUNE,{lunge:{speed:360,reach:60},wheel:{turns:2,gap:.25},deflect:{spin:18,len:15},banner:{pole:30,stakes:8}});
for(const n of ['SPIRAL LUNGE','WHEEL SWEEP','DEFLECT','WAR BANNER'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'DEFLECT':['propeller',1]});
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // braced behind the spinning spear, feet planted
  case 'propeller':{o.frame=13;o.sy=.94;o.sx=1.04;o.skew=-.06*d;o.dx=Math.round(Math.sin(time*40)*.6);break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ---- RMB SPIRAL LUNGE: a real lunge ----
NEWCAST[91]=(c)=>{const {p,a,A,bp,em}=c,L=ABTUNE.lunge;let n=0;for(let s=0;s<=60;s+=3){if(blocked(p.x+Math.cos(a)*s,p.y+Math.sin(a)*s,4))break;n=s;}
 const D=Math.max(.05,n/L.speed);p.iv=Math.max(p.iv,D+.2);p.lunging=1;
 zones.push({k:'lunge',x:p.x,y:p.y,x0:p.x,y0:p.y,a,n,d:0,t:D+.02,tk:0,dm:A*2.8*bp*em,full:!!p.hFull,fa:A*1.6*bp*em,hit:new Set(),src:'h'});sfx('dash');};
CZ.lunge=(z,dt)=>{const L=ABTUNE.lunge;z.d=Math.min(z.n,z.d+L.speed*dt);P.x=z.x0+Math.cos(z.a)*z.d;P.y=z.y0+Math.sin(z.a)*z.d;P.iv=Math.max(P.iv,.05);
 // the spearhead leads by its reach: everything between the start and the tip is cut once
 lineHit(z.x0,z.y0,z.a,z.d+L.reach,12,e=>{if(z.hit.has(e))return;z.hit.add(e);hurtE(e,z.dm,40,{slash:true,kb:z.a,src:'h'});spark(e.x,e.y,'#c8e0ff',3,50);});
 if(z.d>=z.n&&!z.done){z.done=1;z.t=0;P.lunging=0;const f={k:'line',x:z.x0,y:z.y0,a:z.a,len:z.n+L.reach,t:.22,dur:.22,col:'#c8e0ff',style:'spear'};fx.push(f);impact(P.x,P.y,'#c8e0ff',3);
  if(z.full){coneHit(P.x,P.y,z.a,44,TAU,e=>hurtE(e,z.fa,30,{slash:true,kb:Math.atan2(e.y-P.y,e.x-P.x),src:'h'}));fx.push({k:'slash',x:P.x,y:P.y,a:z.a,arc:TAU,r:44,t:.2,dur:.2,col:'#fff'});}}};
CZD.lunge=z=>{};
// ---- Q WHEEL SWEEP: the spear sweeping round him ----
NEWCAST[92]=(c)=>{const {p,A,qm,em}=c;zones.push({k:'wheel',x:p.x,y:p.y,r:66*AZ(),t:.62,dur:.62,tk:0,dm:A*1.6*qm*em,n:0,a0:p.aim});sfx('dash');};
CZ.wheel=(z,dt)=>{z.x=P.x;z.y=P.y;if(z.tk<=0&&z.n<ABTUNE.wheel.turns){z.tk=ABTUNE.wheel.gap;z.n++;
 for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r&&los(z.x,z.y,e.x,e.y))hurtE(e,z.dm,14,{slash:true,kb:Math.atan2(e.y-z.y,e.x-z.x)});
 for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,z)<z.r){q.dead=true;spark(q.x,q.y,'#c8e0ff',2,30);}sfx('slash');}};
CZD.wheel=z=>{const W=ABTUNE.wheel,u=1-z.t/z.dur,a=z.a0+u*W.turns*TAU,X0=sx(z.x,z.y),Y0=sy(z.x,z.y)-8;
 // the trail of the blade round the circle
 for(let i=1;i<14;i++){const aa=a-i*.09,px=z.x+Math.cos(aa)*z.r,py=z.y+Math.sin(aa)*z.r;ctx.globalAlpha=.7*(1-i/14);ctx.fillStyle=i<4?'#ffffff':'#c8e0ff';ctx.fillRect(Math.round(sx(px,py)),Math.round(sy(px,py))-8,2,1);}ctx.globalAlpha=1;
 // the shaft and the blade at its tip
 const tx=z.x+Math.cos(a)*z.r,ty=z.y+Math.sin(a)*z.r,TX=sx(tx,ty),TY=sy(tx,ty)-8,bx=z.x+Math.cos(a)*(z.r-8),by=z.y+Math.sin(a)*(z.r-8);
 kLine(X0,Y0,sx(bx,by),sy(bx,by)-8,3,'#14101a');kLine(X0,Y0,sx(bx,by),sy(bx,by)-8,1,'#7a5a3a');kLine(sx(bx,by),sy(bx,by)-8,TX,TY,3,'#14101a');kLine(sx(bx,by),sy(bx,by)-8,TX,TY,1,'#e8eef6');ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(TX),Math.round(TY),1,1);};
// ---- E DEFLECT: the spear spun like a propeller ----
CZD.deflect=z=>{const D=ABTUNE.deflect,a=time*D.spin,X=sx(P.x,P.y),Y=sy(P.x,P.y)-11,c=Math.cos(a)*D.len,s=Math.sin(a)*D.len*.5;
 ctx.globalAlpha=.25;ctx.strokeStyle='#e0b040';ctx.beginPath();ctx.ellipse(X,Y,D.len,D.len*.5,0,0,TAU);ctx.stroke();ctx.globalAlpha=1;
 kLine(X-c,Y-s,X+c,Y+s,3,'#14101a');kLine(X-c,Y-s,X+c,Y+s,1,'#7a5a3a');ctx.fillStyle='#e8eef6';ctx.fillRect(Math.round(X+c)-1,Math.round(Y+s)-1,3,3);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+c),Math.round(Y+s),1,1);
 // the blurred second blade
 ctx.globalAlpha=.4;const c2=Math.cos(a-.5)*D.len,s2=Math.sin(a-.5)*D.len*.5;kLine(X-c2,Y-s2,X+c2,Y+s2,1,'#c8e0ff');ctx.globalAlpha=1;};
{const _df=CZ.deflect;CZ.deflect=function(z){const n=projs.filter(q=>q.from==='e').length;const r=_df.apply(this,arguments);if(projs.filter(q=>q.from==='e').length<n)spark(P.x,P.y-4,'#ffd040',3,60);return r;};}
// ---- F WAR BANNER: a tall rippling banner and stakes on its edge ----
CZD.banner=z=>{const B=ABTUNE.banner,X=Math.round(sx(z.x,z.y)),Y=Math.round(sy(z.x,z.y)),fade=Math.min(1,z.t/.4);ctx.globalAlpha=fade;
 for(let i=0;i<B.stakes;i++){const a=i/B.stakes*TAU,x=z.x+Math.cos(a)*z.r,y=z.y+Math.sin(a)*z.r,SX=Math.round(sx(x,y)),SY=Math.round(sy(x,y)),w=Math.round(Math.sin(time*5+i)*1);
  ctx.fillStyle='#14101a';ctx.fillRect(SX-1,SY-7,3,8);ctx.fillStyle='#7a5a3a';ctx.fillRect(SX,SY-6,1,6);ctx.fillStyle='#c02020';ctx.fillRect(SX+1,SY-6+w,3,2);}
 // the pole and the cloth, rippling column by column
 const top=Y-B.pole;ctx.fillStyle='#14101a';ctx.fillRect(X-1,top-2,3,B.pole+2);ctx.fillStyle='#3a2a1a';ctx.fillRect(X,top-1,1,B.pole+1);ctx.fillStyle='#e0b040';ctx.fillRect(X-1,top-3,3,2);
 for(let cx=0;cx<9;cx++){const off=Math.round(Math.sin(time*6-cx*.7)*cx*.25);ctx.fillStyle='#14101a';ctx.fillRect(X+1+cx,top+off-1,1,15);ctx.fillStyle=cx%3===0?'#a01818':'#c02020';ctx.fillRect(X+1+cx,top+off,1,13);
  if(cx>=3&&cx<=6){ctx.fillStyle='#80c0ff';ctx.fillRect(X+1+cx,top+off+4,1,(cx===3||cx===6)?3:5);}}
 ctx.globalAlpha=1;};
