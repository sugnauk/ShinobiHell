'use strict';
// SHINOBIDUNGEONS - the ONMYOJI kit performed by paper and spirit (see ANIMATION_AUDIT.md; core in 191).
//  RMB SPIRIT FOX   a talisman flicked from two fingers becomes a running fox of cyan fox-fire (two on a full charge)
//  Q   SHIKIGAMI    talismans unfold into paper servants (hitogata) that hover, lean and throw origami cranes
//  E   BARRIER      a dome of light rises and cracks as the shield is spent
//  F   HEALING CIRCLE  a soft green circle on the healing radius with motes rising inside it
// (R DRAGON SPIRIT is a reference ability and is not touched.)
Object.assign(ABTUNE,{fox:{flick:.3,gallop:12},shiki:{summon:.42,unfold:.3,fold:.3,lean:.18},barrier:{seal:.45,land:.2,burn:.3,rad:16},heal:{plant:.5,fall:.3,wards:8}});
for(const n of ['SPIRIT FOX','SHIKIGAMI','BARRIER','HEALING CIRCLE'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'SPIRIT FOX':['flick',ABTUNE.fox.flick],'SHIKIGAMI':['summon',ABTUNE.shiki.summon],'BARRIER':['sealhand',ABTUNE.barrier.seal],'HEALING CIRCLE':['plantstaff',ABTUNE.heal.plant]});
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // ONMYOJI: a talisman flicked from two fingers (it becomes the fox)
  case 'flick':{o.frame=u<.35?12:u<.75?13:14;o.skew=(u<.35?-.12:.18*(1-u))*d;o.dx=Math.round((u<.35?-1:2*(1-u))*d);break;}
  // a two-handed summon: charms thrown up, the body rising on its toes
  case 'summon':{o.frame=u<.3?8:u<.7?9:15;const k2=Math.sin(u*Math.PI);o.sy=1+.08*k2;o.dy=-Math.round(2*k2);break;}
  // the hand seal held before the chest while the shield rises
  case 'sealhand':{o.frame=u<.6?8:9;const k2=u<.25?abEase(u/.25):1-abEase((u-.6)/.4);o.sy=1-.1*Math.max(0,k2);o.sx=1+.04*Math.max(0,k2);break;}
  // kneel and drive the wand into the ground
  case 'plantstaff':{o.frame=u<.4?12:u<.7?14:8;const k2=u<.4?abEase(u/.4):1-abEase((u-.4)/.6);o.sy=1-.24*k2;o.sx=1+.08*k2;o.dy=0;break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ======================================== ONMYOJI ========================================
// SPIRIT FOX: the heavy's homing shot is a running fox of cyan fox-fire, two on a full charge
PSPR.fox=(X,Y,ux,uy,q)=>{const f=ux>=0?1:-1,g=Math.floor(time*ABTUNE.fox.gallop+q.x*.1)%2,b=g?-1:0,BODY='#e8f8ff',FUR='#9fe8ff',INK='#14101a',FIRE='#5fd8ff';
 // the flame tail(s), streaming back along the path
 for(let i=1;i<=7;i++){const tx=X-ux*i*1.6,ty=Y-uy*i*1.6+Math.sin(time*20+i)*.8;ctx.globalAlpha=.85-i*.1;ctx.fillStyle=i<3?BODY:FIRE;ctx.fillRect(Math.round(tx)-(i<4?1:0),Math.round(ty)-1,i<4?3:2,2);}ctx.globalAlpha=1;
 const R=(x,y,w,h,c)=>KR(X,Y+b,f,x,y,w,h,c);
 R(-5,-2,10,5,INK);R(-4,-1,8,3,FUR);R(-4,-1,8,1,BODY);           // body
 R(3,-4,5,4,INK);R(4,-3,3,2,BODY);R(7,-2,2,1,INK);R(6,-2,1,1,'#ff5060');// head, snout, eye
 R(3,-6,2,3,INK);R(4,-5,1,1,FUR);R(6,-6,2,3,INK);R(6,-5,1,1,FUR);       // ears
 R(g?-4:-3,2,1,2,INK);R(g?2:3,2,1,2,INK);};                               // legs, galloping
{const _cc=classCast;classCast=function(k){const n0=projs.length;const r=_cc.apply(this,arguments);
 if(P&&k==='h'&&CLS().k==='onmyoji')for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from!=='p')continue;q.spr='fox';q.col='#9fe8ff';q.r=Math.max(q.r,4);
  q.onHit=(q,e)=>{spark(e.x,e.y,'#e8f8ff',4,50);for(let j=0;j<3;j++)particles.push({x:e.x+rnd(-4,4),y:e.y+rnd(-4,4),vx:rnd(-20,20),vy:rnd(-30,-10),t:.3,col:'#5fd8ff'});};}
 return r;};}
// SHIKIGAMI: paper servants (hitogata) unfold from the talismans, hover, lean and throw origami cranes
PSPR.crane=(X,Y,ux,uy,q)=>{const f=ux>=0?1:-1,w=Math.floor(time*14+q.x)%2;const R=(x,y,ww,h,c)=>KR(X,Y,f,x,y,ww,h,c);
 R(-3,0,7,2,'#14101a');R(-2,0,5,1,'#ffffff');R(2,-1,2,1,'#ffffff');R(3,-2,1,1,'#e03040');   // body and neck, red head
 if(w){R(-2,-3,3,3,'#14101a');R(-1,-2,2,2,'#f0ece0');}else{R(-2,2,3,2,'#14101a');R(-1,2,2,1,'#f0ece0');} // the wing beat
 R(-4,1,2,1,'#c8d8e8');};
{const _sh=CZ.shiki;CZ.shiki=function(z,dt){const n0=projs.length;const r=_sh.apply(this,arguments);for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from!=='p')continue;q.spr='crane';q.col='#f0ece0';z.throwT=time;}return r;};}
CZD.shiki=z=>{const S=ABTUNE.shiki,age=7-z.t,unf=Math.min(1,age/S.unfold),fold=z.t<S.fold?z.t/S.fold:1,open=Math.min(unf,fold);
 const X=sx(z.x,z.y),Y=sy(z.x,z.y)-16+Math.round(Math.sin(time*5+z.ang)*2),lean=z.throwT&&time-z.throwT<S.lean?1:0,f=(P&&z.x<P.x)?-1:1;
 // its shadow, and a faint cyan glow
 ctx.globalAlpha=.25;ctx.fillStyle='#000';ctx.fillRect(X-3,sy(z.x,z.y)-1,7,2);ctx.globalAlpha=1;
 if(open<.35){ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-4,5,8);ctx.fillStyle='#f0ece0';ctx.fillRect(X-1,Y-3,3,6);ctx.fillStyle='#e03040';ctx.fillRect(X,Y-2,1,4);return;} // still a folded slip
 const R=(x,y,w,h,c)=>KR(X+(lean?f:0),Y,f,x,y,w,h,c),sp=Math.round(3*open),sway=Math.round(Math.sin(time*7+z.ang));
 R(-2,-6,5,5,'#14101a');R(-1,-5,3,3,'#ffffff');                          // the round paper head
 R(-1-sp,-1,3+sp*2,3,'#14101a');R(-sp,0,1+sp*2,1,'#f0ece0');            // arms spread as it unfolds
 R(-2,-1,5,7,'#14101a');R(-1,0,3,5,'#f0ece0');R(0,1,1,3,'#e03040');     // the body, a red ink seal down the middle
 R(-2,5+sway,2,3,'#14101a');R(1,5-sway,2,3,'#14101a');R(-1,5+sway,1,2,'#f0ece0');R(1,5-sway,1,2,'#f0ece0'); // legs fluttering
 if(fold<1){ctx.globalAlpha=1-fold;ctx.fillStyle='#ff8040';ctx.fillRect(X-3,Y-6+Math.round(12*fold),7,2);ctx.globalAlpha=1;}}; // burning away at the end
// BARRIER: the dome cracks as the shield is spent
{const _cc=classCast;classCast=function(k){const before=P&&P.ab.rmb;const r=_cc.apply(this,arguments);
 if(P&&k==='w'&&CLS().k==='onmyoji'&&P.ab.rmb!==before&&P.shieldHp>0)P.abxBarrier={t0:time,max:P.shieldHp,end:0,a:Math.random()*TAU};return r;};}
function abxBarrierState(){const B=P&&P.abxBarrier;if(!B)return null;const live=P.shieldHp>0&&P.shieldT>0;if(!live&&!B.end){B.end=time;if(time-B.t0>.1){shake=Math.max(shake,2);flashT=Math.max(flashT,.05);flashCol='#9fe8ff';}}
 if(B.end&&time-B.end>ABTUNE.barrier.burn){P.abxBarrier=null;return null;}return B;}
function abxBarrierDraw(front){const B=abxBarrierState();if(!B)return;const BA=ABTUNE.barrier,t=time-B.t0,land=Math.min(1,t/BA.land),out=B.end?1-(time-B.end)/BA.burn:1,hp=B.end?0:clamp(P.shieldHp/B.max,0,1);
 const cx=P.x,cy=P.y;
 if(!front){
  ctx.globalAlpha=.6*out*land;ctx.strokeStyle='#5fd8ff';ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*TAU,x=cx+Math.cos(a)*BA.rad*1.6,y=cy+Math.sin(a)*BA.rad*1.6;if(i)ctx.lineTo(sx(x,y),sy(x,y));else ctx.moveTo(sx(x,y),sy(x,y));}ctx.stroke();
  // the back half of the dome
  ctx.globalAlpha=.16*out*land;ctx.fillStyle='#9fe8ff';ctx.beginPath();ctx.ellipse(sx(cx,cy),sy(cx,cy)-10,22,24,0,Math.PI,TAU);ctx.fill();ctx.globalAlpha=1;return;}
 // the dome's front, its rim brighter, cracking as the shield is spent
 const X=sx(cx,cy),Y=sy(cx,cy)-10;ctx.globalAlpha=(.14+.08*Math.sin(time*5))*out*land;ctx.fillStyle='#9fe8ff';ctx.beginPath();ctx.ellipse(X,Y,22,24,0,0,Math.PI);ctx.ellipse(X,Y,22,24,0,Math.PI,TAU);ctx.fill();
 ctx.globalAlpha=.6*out*land;ctx.strokeStyle='#e8f8ff';ctx.beginPath();ctx.ellipse(X,Y,22,24,0,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
 const cracks=Math.floor((1-hp)*5);ctx.strokeStyle='#ffffff';ctx.globalAlpha=.8*out;for(let i=0;i<cracks;i++){const a=B.a+i*2.1,x0=X+Math.cos(a)*18,y0=Y+Math.sin(a)*18;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0-Math.cos(a)*6+3,y0-Math.sin(a)*6-2);ctx.lineTo(x0-Math.cos(a)*10,y0-Math.sin(a)*9+1);ctx.stroke();}
 ctx.globalAlpha=1;}
{const _dp=drawPlayer;drawPlayer=function(){const ok=P&&!(P.dying>0)&&P.abxBarrier;if(ok)abxBarrierDraw(false);const r=_dp.apply(this,arguments);if(ok)abxBarrierDraw(true);return r;};}
// HEALING CIRCLE: a gohei wand planted at the centre, eight paper wards standing on the healing radius, a star turning
CZD.heal=z=>{const H=ABTUNE.heal,fade=z.t<H.fall?z.t/H.fall:1,X0=sx(z.x,z.y),Y0=sy(z.x,z.y),rx=z.r;
 ctx.globalAlpha=(.14+.05*Math.sin(time*3))*fade;wdisc(z.x,z.y,rx,'#6fdc8c');
 ctx.globalAlpha=.75*fade;ctx.strokeStyle='#a8f0c0';ctx.beginPath();for(let i=0;i<=40;i++){const a=i/40*TAU,x=z.x+Math.cos(a)*rx,y=z.y+Math.sin(a)*rx;if(i)ctx.lineTo(sx(x,y),sy(x,y));else ctx.moveTo(sx(x,y),sy(x,y));}ctx.stroke();ctx.globalAlpha=1;
 // soft motes rising inside the circle
 if(Math.random()<.5){const a=Math.random()*TAU,r=Math.sqrt(Math.random())*rx;particles.push({x:z.x+Math.cos(a)*r,y:z.y+Math.sin(a)*r,vx:0,vy:-24,t:.8,col:Math.random()<.5?'#c8ffe0':'#ffffff'});}};
{const _ld=loadDungeon;loadDungeon=function(){if(P)P.abxBarrier=null;return _ld.apply(this,arguments);};}
