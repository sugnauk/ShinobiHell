'use strict';
// SHINOBIDUNGEONS - the LANCER kit performed (see ANIMATION_AUDIT.md; core in 191). Ice-blue steel, banner red.
//  RMB SKY PIERCER  (was Spiral Lunge, a dash like the samurai's) he steps in and drives one very long thrust: the
//                   spear shoots out to its full length, everything along it is hit and shoved back down the line;
//                   a full charge reaches a third further and pins them for a moment
//  Q   POLE VAULT   (was Wheel Sweep, a spin like the samurai's) he plants the spear and vaults to the cursor,
//                   untouchable in the air, and comes down spear-first: foes round the landing are struck and thrown
//                   out, and shots near it are broken
//  E   DEFLECT      the spear spun in front of him like a propeller, fast and wide, a blur disc behind the blades;
//                   every shot it turns back throws a spark
//  F   WAR BANNER   he drives a tall banner into the ground: the cloth ripples, and pennant stakes stand on the
//                   edge of its area instead of a flat red disc
//  R   THOUSAND THRUSTS (already the standard) unchanged
Object.assign(ABTUNE,{pierce:{len:110,full:1.35,out:.1,hold:.1,back:.14,push:240},vault:{max:100,air:.42,height:26,land:46},deflect:{spin:26,len:22},banner:{pole:30,stakes:8}});
// the new names and words
{const H=SPELLS.h.find(x=>x.n==='SPIRAL LUNGE'),Q=SPELLS.q.find(x=>x.n==='WHEEL SWEEP');
 if(H){H.n='SKY PIERCER';H.g='>';H.d='A HUGE THRUST DOWN A LONG LINE. SHOVES FOES BACK.';H.x='FULL CHARGE: A THIRD LONGER, PINS FOES';H.more='EVERYTHING ON THE LINE IS HIT AND DRIVEN BACK. FULL CHARGE REACHES FURTHER AND PINS THEM.';H.tip='LINE THEM UP IN A CORRIDOR.';}
 if(Q){Q.n='POLE VAULT';Q.g='^';Q.d='VAULT TO THE CURSOR ON YOUR SPEAR AND LAND SPEAR-FIRST.';Q.dx='';Q.more='UNTOUCHABLE IN THE AIR. THE LANDING THROWS FOES OUT AND BREAKS SHOTS.';Q.tip='VAULT OUT OF A CROWD, OR INTO ONE.';}
 SPRULES.unshift([/SKY PIERCER/,'arrow'],[/POLE VAULT/,'dash']);}
for(const n of ['SKY PIERCER','POLE VAULT','DEFLECT','WAR BANNER'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'DEFLECT':['propeller',1],'SKY PIERCER':['longthrust',.36],'POLE VAULT':['vault',.42]});
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // braced behind the spinning spear, feet planted
  // step in and drive the spear out: wind back, then the long extension, then pull back
  case 'longthrust':{if(u<.25){const k2=abEase(u/.25);o.frame=12;o.skew=-.2*d*k2;o.dx=-Math.round(2*k2)*d;}else{const k2=1-abEase((u-.25)/.75);o.frame=13;o.skew=.3*d*k2;o.dx=Math.round(4*k2)*d;o.sy=1-.05*k2;o.trail=u<.5;}break;}
  // the vault: a crouch, the body swinging up over the planted spear, then the drop spear-first
  case 'vault':{const air=Math.sin(Math.min(1,u)*Math.PI);o.frame=u<.15?12:u<.8?10:14;o.dy=-Math.round(ABTUNE.vault.height*air);o.rot=(u<.8?-.25*air:.15)*d;o.sy=u<.12?.85:u>.9?.85:1;break;}
  case 'propeller':{o.frame=13;o.sy=.94;o.sx=1.04;o.skew=-.06*d;o.dx=Math.round(Math.sin(time*40)*.6);break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ---- RMB SKY PIERCER: one huge thrust down a long line ----
NEWCAST[91]=(c)=>{const {p,a,A,bp,em}=c,K=ABTUNE.pierce,full=!!p.hFull,len=rayLen(p.x,p.y,a,K.len*(full?K.full:1)*(1+S.rangeM*.3));
 // a short step in behind the thrust (never into a wall)
 for(let i=0;i<6;i++){const nx=p.x+Math.cos(a),ny=p.y+Math.sin(a);if(blocked(nx,ny,4))break;p.x=nx;p.y=ny;}
 zones.push({k:'pierce',x:p.x,y:p.y,a,len,t:K.out+K.hold+K.back,dur:K.out+K.hold+K.back,tk:0,dm:A*2.8*bp*em,full,hit:new Set(),src:'h'});sfx('dash');};
CZ.pierce=(z,dt)=>{const K=ABTUNE.pierce,age=z.dur-z.t;z.x=P.x;z.y=P.y;if(age<K.out||z.done)return;z.done=1;
 lineHit(z.x,z.y,z.a,z.len,14,e=>{if(z.hit.has(e))return;z.hit.add(e);hurtE(e,z.dm,45,{slash:true,kb:z.a,src:'h'});if(!e.boss&&!e.dead&&e.type!=='turret'){e.kx=Math.cos(z.a)*K.push;e.ky=Math.sin(z.a)*K.push;e.shoved=R.time;if(z.full){e.stun=Math.max(e.stun||0,.6);e.act=null;}}spark(e.x,e.y,'#c8e0ff',4,60);});
 for(const q of projs)if(q.from==='e'&&!q.peril&&!q.dead){const dx=q.x-z.x,dy=q.y-z.y,u=dx*Math.cos(z.a)+dy*Math.sin(z.a),v=-dx*Math.sin(z.a)+dy*Math.cos(z.a);if(u>0&&u<z.len&&Math.abs(v)<8&&z.full){q.dead=true;spark(q.x,q.y,'#c8e0ff',2,30);}}
 const tx=z.x+Math.cos(z.a)*z.len,ty=z.y+Math.sin(z.a)*z.len;for(let i=0;i<6;i++)particles.push({x:tx,y:ty,vx:Math.cos(z.a)*rnd(20,60)+rnd(-20,20),vy:Math.sin(z.a)*rnd(20,60)+rnd(-20,20),t:.3,col:i%2?'#c8e0ff':'#ffffff'});impact(tx,ty,'#c8e0ff',3);};
// the spear itself shooting out to its full length, the tip flashing, then pulled back
CZD.pierce=z=>{const K=ABTUNE.pierce,age=z.dur-z.t,ext=age<K.out?abEase(age/K.out):age<K.out+K.hold?1:1-abEase((age-K.out-K.hold)/K.back),L=8+(z.len-8)*ext,ca=Math.cos(z.a),sa=Math.sin(z.a);
 const x0=z.x-ca*8,y0=z.y-sa*8,x1=z.x+ca*L,y1=z.y+sa*L,X0=sx(x0,y0),Y0=sy(x0,y0)-9,X1=sx(x1,y1),Y1=sy(x1,y1)-9,hx=sx(x1-ca*9,y1-sa*9),hy=sy(x1-ca*9,y1-sa*9)-9;
 if(ext>.6){ctx.globalAlpha=.35*ext;kLine(X0,Y0,X1,Y1,5,'#c8e0ff');ctx.globalAlpha=1;}
 kLine(X0,Y0,hx,hy,3,'#14101a');kLine(X0,Y0,hx,hy,1,'#7a5a3a');kLine(hx,hy,X1,Y1,4,'#14101a');kLine(hx,hy,X1,Y1,2,'#e8eef6');ctx.fillStyle='#c02020';ctx.fillRect(Math.round(hx)-1,Math.round(hy)-1,3,3);
 if(age>=K.out&&age<K.out+K.hold){ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X1)-2,Math.round(Y1)-1,5,3);ctx.fillRect(Math.round(X1)-1,Math.round(Y1)-2,3,5);}};
// ---- Q POLE VAULT: over the top, spear-first ----
NEWCAST[92]=(c)=>{const {p,A,qm,em}=c,V=ABTUNE.vault,m=mouseWorld(),a=Math.atan2(m.y-p.y,m.x-p.x),want=Math.min(V.max,Math.hypot(m.x-p.x,m.y-p.y));let n=0;
 for(let s=0;s<=want;s+=3){if(blocked(p.x+Math.cos(a)*s,p.y+Math.sin(a)*s,4))break;n=s;}
 p.iv=Math.max(p.iv,V.air+.15);zones.push({k:'vault',x:p.x,y:p.y,x0:p.x,y0:p.y,a,n,t:V.air,dur:V.air,tk:0,dm:A*3*qm*em,src:'q'});sfx('dash');};
CZ.vault=(z,dt)=>{const V=ABTUNE.vault,u=Math.min(1,1-z.t/z.dur);P.x=z.x0+Math.cos(z.a)*z.n*abEase(u);P.y=z.y0+Math.sin(z.a)*z.n*abEase(u);P.iv=Math.max(P.iv,.05);
 if(z.t<=dt*1.5&&!z.landed){z.landed=1;const r=V.land*AZ();
  for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-P.x,e.y-P.y)<r+e.r&&los(P.x,P.y,e.x,e.y)){hurtE(e,z.dm,40,{slash:true,kb:Math.atan2(e.y-P.y,e.x-P.x),src:'q'});if(!e.boss&&!e.dead){const an=Math.atan2(e.y-P.y,e.x-P.x);e.kx=Math.cos(an)*200;e.ky=Math.sin(an)*200;e.shoved=R.time;}}
  for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-P.x,q.y-P.y)<r*.7){q.dead=true;spark(q.x,q.y,'#c8e0ff',2,30);}
  impact(P.x,P.y,'#c8e0ff',4);sfx('break');
  topFx({dur:.35,x:P.x,y:P.y,r,draw(o,k){ctx.globalAlpha=1-k;for(let i=0;i<20;i++){const a=i/20*TAU,rr=o.r*(.3+.7*k),x=o.x+Math.cos(a)*rr,y=o.y+Math.sin(a)*rr;ctx.fillStyle=i%2?'#d8ccb0':'#c8e0ff';ctx.fillRect(Math.round(sx(x,y))-1,Math.round(sy(x,y))-1,3,2);}
   const X=sx(o.x,o.y),Y=sy(o.x,o.y);ctx.fillStyle='#14101a';ctx.fillRect(X-1,Y-6,3,7);ctx.fillStyle='#e8eef6';ctx.fillRect(X,Y-5,1,5);ctx.globalAlpha=1;}});}};
// the spear planted where he jumped from, leaning after him as he goes over
CZD.vault=z=>{const u=1-z.t/z.dur;if(u>.75)return;const X0=sx(z.x0,z.y0),Y0=sy(z.x0,z.y0),X=sx(P.x,P.y),Y=sy(P.x,P.y)-8-Math.round(ABTUNE.vault.height*Math.sin(u*Math.PI));kLine(X0,Y0,X,Y,3,'#14101a');kLine(X0,Y0,X,Y,1,'#7a5a3a');ctx.fillStyle='#e8eef6';ctx.fillRect(Math.round(X0)-1,Math.round(Y0)-1,3,2);};
// ---- E DEFLECT: the spear spun like a propeller ----
CZD.deflect=z=>{const D=ABTUNE.deflect,a=time*D.spin,X=sx(P.x,P.y),Y=sy(P.x,P.y)-11;
 // the blur disc the blades sweep, and its bright rim
 ctx.globalAlpha=.22;ctx.fillStyle='#c8e0ff';ctx.beginPath();ctx.ellipse(X,Y,D.len,D.len*.5,0,0,TAU);ctx.fill();ctx.globalAlpha=.7;ctx.strokeStyle='#e0b040';ctx.beginPath();ctx.ellipse(X,Y,D.len+1,D.len*.5+1,0,0,TAU);ctx.stroke();
 // trailing ghosts of the spear, then the spear itself: shaft through his hands, blade at one end, a butt cap at the other
 for(const [g,al] of [[.9,.18],[.6,.3],[.3,.45]]){const c=Math.cos(a-g)*D.len,s=Math.sin(a-g)*D.len*.5;ctx.globalAlpha=al;kLine(X-c,Y-s,X+c,Y+s,2,'#c8e0ff');}
 const c=Math.cos(a)*D.len,s=Math.sin(a)*D.len*.5;ctx.globalAlpha=1;kLine(X-c,Y-s,X+c,Y+s,4,'#14101a');kLine(X-c,Y-s,X+c,Y+s,2,'#7a5a3a');
 kLine(X+c*.65,Y+s*.65,X+c,Y+s,3,'#e8eef6');ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+c)-1,Math.round(Y+s)-1,2,2);ctx.fillStyle='#c02020';ctx.fillRect(Math.round(X+c*.62)-1,Math.round(Y+s*.62)-1,3,3);ctx.fillStyle='#e0b040';ctx.fillRect(Math.round(X-c)-1,Math.round(Y-s)-1,3,3);
 // speed lines round the rim
 for(let i=0;i<4;i++){const b=a*1.3+i*TAU/4;ctx.globalAlpha=.6;ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+Math.cos(b)*(D.len+3)),Math.round(Y+Math.sin(b)*(D.len*.5+2)),2,1);}ctx.globalAlpha=1;};
{const _df=CZ.deflect;CZ.deflect=function(z){const n=projs.filter(q=>q.from==='e').length;const r=_df.apply(this,arguments);if(projs.filter(q=>q.from==='e').length<n)spark(P.x,P.y-4,'#ffd040',3,60);return r;};}
// ---- F WAR BANNER: a tall rippling banner and stakes on its edge ----
CZD.banner=z=>{const B=ABTUNE.banner,X=Math.round(sx(z.x,z.y)),Y=Math.round(sy(z.x,z.y)),fade=Math.min(1,z.t/.4);ctx.globalAlpha=fade;
 // the area it covers: a soft red field and its rim
 ctx.globalAlpha=(.12+.04*Math.sin(time*3))*fade;wdisc(z.x,z.y,z.r,'#e04030');ctx.globalAlpha=.6*fade;ctx.strokeStyle='#e04030';ctx.beginPath();for(let i=0;i<=40;i++){const a=i/40*TAU,x=z.x+Math.cos(a)*z.r,y=z.y+Math.sin(a)*z.r;i?ctx.lineTo(sx(x,y),sy(x,y)):ctx.moveTo(sx(x,y),sy(x,y));}ctx.stroke();ctx.globalAlpha=fade;
 for(let i=0;i<B.stakes;i++){const a=i/B.stakes*TAU,x=z.x+Math.cos(a)*z.r,y=z.y+Math.sin(a)*z.r,SX=Math.round(sx(x,y)),SY=Math.round(sy(x,y)),w=Math.round(Math.sin(time*5+i)*1);
  ctx.fillStyle='#14101a';ctx.fillRect(SX-1,SY-7,3,8);ctx.fillStyle='#7a5a3a';ctx.fillRect(SX,SY-6,1,6);ctx.fillStyle='#c02020';ctx.fillRect(SX+1,SY-6+w,3,2);}
 // the pole and the cloth, rippling column by column
 const top=Y-B.pole;ctx.fillStyle='#14101a';ctx.fillRect(X-1,top-2,3,B.pole+2);ctx.fillStyle='#3a2a1a';ctx.fillRect(X,top-1,1,B.pole+1);ctx.fillStyle='#e0b040';ctx.fillRect(X-1,top-3,3,2);
 for(let cx=0;cx<9;cx++){const off=Math.round(Math.sin(time*6-cx*.7)*cx*.25);ctx.fillStyle='#14101a';ctx.fillRect(X+1+cx,top+off-1,1,15);ctx.fillStyle=cx%3===0?'#a01818':'#c02020';ctx.fillRect(X+1+cx,top+off,1,13);
  if(cx>=3&&cx<=6){ctx.fillStyle='#80c0ff';ctx.fillRect(X+1+cx,top+off+4,1,(cx===3||cx===6)?3:5);}}
 ctx.globalAlpha=1;};
