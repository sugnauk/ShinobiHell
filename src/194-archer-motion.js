'use strict';
// SHINOBIDUNGEONS - the ARCHER kit performed (see ANIMATION_AUDIT.md; core in 191). Bone-white fletching, leaf green.
//  RMB CHARGED SHOT  the bow strains, then a long arrow leaves a wake of wind rings in the air behind it
//  Q   ARROW RAIN    she leans back and looses one arrow straight up; a moment later the volley falls on the mark
//                    and the arrows stay stuck in the ground, so you can see where it rained
//  E   EVADE ROLL    a low skid backwards (no somersault), dust kicked up; the snare left behind is a rope noose
//  F   HAWK          a top-down hawk that eases into a banked orbit, alternating wingbeats with glides
//  R   ARROW STORM   the same language as Arrow Rain, bigger: each blast is a tinted patch where arrows land in dust and
//                    splinters and stay standing (no white pillars or generic bursts); the slow motion is shorter
Object.assign(ABTUNE,{arrow:{wake:.03},rain:{up:.18,fall:.14,stuck:30},hawk:{swoop:.68,height:23},storm:{fall:.12,stay:1.2}});
for(const n of ['CHARGED SHOT','ARROW RAIN','HAWK','ARROW STORM'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'ARROW RAIN':['skyshot',.36],'HAWK':['whistle',.4],'EVADE ROLL':['skid',.36]});
ABX_OWN.add('EVADE ROLL');
const isArc=()=>P&&CLS().k==='archer';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // lean back and loose upward: the drawn bow, then the release, the body arched back
  case 'skyshot':{const k2=u<.5?abEase(u/.5):1-abEase((u-.5)/.5);o.frame=u<.5?12:13;o.rot=-.45*d*k2;o.sy=1-.05*k2;break;}
  // an arm raised for the hawk to come to
  // a low skid backwards: crouched, leaning into the aim, dust from the heels
  case 'skid':{o.frame=u<.7?11:15;const k2=Math.sin(u*Math.PI);o.sy=1-.16*k2;o.sx=1+.08*k2;o.skew=.12*d*k2;o.trail=u<.6;if(Math.random()<.5&&u<.7)particles.push({x:P.x+rnd(-3,3),y:P.y+rnd(-2,2),vx:rnd(-12,12),vy:rnd(-18,-6),t:.35,col:'#b8a888'});break;}
  case 'whistle':{o.frame=u<.6?8:15;o.sy=1+.05*Math.sin(u*Math.PI);o.dy=-Math.round(Math.sin(u*Math.PI));break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ---- RMB CHARGED SHOT: a long arrow with a wake of wind rings ----
PSPR.bigarrow=(X,Y,ux,uy,q)=>{for(let i=-8;i<=4;i++){ctx.fillStyle=i>2?'#ffffff':i>-6?q.col:'#e8e8e0';ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}
 const fx0=X-ux*7,fy0=Y-uy*7;ctx.fillStyle='#a5f0aa';ctx.fillRect(Math.round(fx0-uy*2),Math.round(fy0+ux*2),1,1);ctx.fillRect(Math.round(fx0+uy*2),Math.round(fy0-ux*2),1,1);};
{const _cc=classCast;classCast=function(k){const n0=projs.length;const r=_cc.apply(this,arguments);if(isArc()&&k==='h')for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from!=='p'||!q.arrow)continue;q.spr='bigarrow';q.wk=0;
  q.tick=(q,dt)=>{q.wk-=dt;if(q.wk>0)return;q.wk=ABTUNE.arrow.wake;const l=Math.hypot(q.vx,q.vy)||1,nx=-q.vy/l,ny=q.vx/l;for(const s of [-1,1])particles.push({x:q.x+nx*s*3,y:q.y+ny*s*3,vx:nx*s*30-q.vx*.05,vy:ny*s*30-q.vy*.05,t:.18,col:'#e8f0e0'});};}return r;};}
// ---- Q ARROW RAIN: one arrow up, the volley down, arrows left standing ----
{const _cc=classCast;classCast=function(k){const nz=zones.length;const r=_cc.apply(this,arguments);if(isArc()&&k==='q'){const z=zones.slice(nz).find(z=>z.k==='rain');if(z){z.arrows=[];z.delay=ABTUNE.rain.up;
  topFx({dur:ABTUNE.rain.up,x:P.x,y:P.y,draw(o,k){const X=sx(o.x,o.y),Y=sy(o.x,o.y)-14-Math.round(k*90);ctx.fillStyle='#e8dcb0';ctx.fillRect(X,Y,1,7);ctx.fillStyle='#ffffff';ctx.fillRect(X,Y-1,1,1);}});}}return r;};}
{const _rn=CZ.rain;CZ.rain=function(z,dt){if(z.delay>0){z.delay-=dt;z.tk=Math.max(z.tk,z.delay);}const tk=z.tk;const r=_rn.apply(this,arguments);
 if(z.arrows&&tk<=0){for(let i=0;i<3;i++){const an=Math.random()*TAU,rr=Math.sqrt(Math.random())*z.r;z.arrows.push({x:z.x+Math.cos(an)*rr,y:z.y+Math.sin(an)*rr,t0:time,a:rnd(-.3,.3)});}if(z.arrows.length>ABTUNE.rain.stuck)z.arrows.splice(0,z.arrows.length-ABTUNE.rain.stuck);}return r;};}
CZD.rain=z=>{const F=ABTUNE.rain;ctx.globalAlpha=.16+.05*Math.sin(time*8);wdisc(z.x,z.y,z.r,'#c8e8a0');ctx.globalAlpha=.55;for(let i=0;i<24;i++){const a=i/24*TAU+time*.3,x=z.x+Math.cos(a)*z.r,y=z.y+Math.sin(a)*z.r;ctx.fillStyle='#e8dcb0';ctx.fillRect(Math.round(sx(x,y)),Math.round(sy(x,y)),2,1);}ctx.globalAlpha=1;
 if(!z.arrows)return;for(const A of z.arrows){const k=(time-A.t0)/F.fall,X=Math.round(sx(A.x,A.y)),Yg=Math.round(sy(A.x,A.y));
  if(k>=1&&!A.hit){A.hit=1;for(let j=0;j<3;j++)particles.push({x:A.x+rnd(-2,2),y:A.y+rnd(-2,2),vx:rnd(-20,20),vy:rnd(-25,-8),t:.3,col:j?'#b8a888':'#e8dcb0'});}
  if(k<1){const h=Math.round(70*(1-k)),dx=Math.round(A.a*h*.5);ctx.fillStyle='#e8dcb0';for(let j=0;j<7;j++)ctx.fillRect(X+dx+Math.round(A.a*j*.5),Yg-h-j,1,1);continue;}
  // stuck in the ground: a short slanted shaft and its fletching
  const tilt=A.a>0?1:-1;ctx.fillStyle='#14101a';ctx.fillRect(X-1,Yg-6,3,6);ctx.fillStyle='#c8a870';ctx.fillRect(X,Yg-5,1,5);ctx.fillStyle='#a5f0aa';ctx.fillRect(X+tilt,Yg-6,1,2);ctx.fillRect(X,Yg-7,1,1);}};
// ---- E EVADE ROLL: the snare is a rope noose pegged to a stake ----
CZD.trap=z=>{const X=Math.round(sx(z.x,z.y)),Y=Math.round(sy(z.x,z.y)),arm=Math.floor(time*3)%2;ctx.strokeStyle='#14101a';ctx.beginPath();ctx.ellipse(X,Y,7,3,0,0,TAU);ctx.stroke();ctx.strokeStyle='#c8a870';ctx.beginPath();ctx.ellipse(X,Y-1,6,2,0,0,TAU);ctx.stroke();
 ctx.fillStyle='#14101a';ctx.fillRect(X+6,Y-7,3,8);ctx.fillStyle='#8a6a40';ctx.fillRect(X+7,Y-6,1,6);ctx.fillStyle='#c8a870';ctx.fillRect(X+5,Y-2,2,1);ctx.fillStyle=arm?'#a5f0aa':'#4a8a4a';ctx.fillRect(X-1,Y-1,2,1);};
// ---- F HAWK: a real hawk ----
{const _cc=classCast;classCast=function(k){const nz=zones.length;const r=_cc.apply(this,arguments);if(isArc()&&k==='f')for(const z of zones.slice(nz))if(z.k==='hawk'){z.t0=z.t;z.top=drawHawkFlight;}return r;};}
{const _hk=CZ.hawk;CZ.hawk=function(z,dt){const n0=projs.length,r=_hk.apply(this,arguments);for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from==='p'){q.spr='feather';z.shotAt=z.t;}}return r;};}
PSPR.feather=(X,Y,ux,uy,q)=>{for(let i=-3;i<=3;i++){ctx.fillStyle=i>1?'#ffffff':'#c8a060';ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}ctx.fillStyle='#8a6a40';ctx.fillRect(Math.round(X-ux*2-uy),Math.round(Y-uy*2+ux),1,1);ctx.fillRect(Math.round(X-ux*2+uy),Math.round(Y-uy*2-ux),1,1);};

// ---- R ARROW STORM: Arrow Rain's language, bigger ----
{const _df=drawFx;drawFx=function(f){if(f.arrow){if(f.t>0&&!(f.wait>0)){const k=1-f.t/f.dur;ctx.globalAlpha=.12+.06*k;wdisc(f.x,f.y,f.r*Math.min(1,.5+k),'#a9ca7e');ctx.globalAlpha=1;}return;}return _df.apply(this,arguments);};}
{const _ub=ultBlast;ultBlast=function(f){if(!f.arrow)return _ub.apply(this,arguments);
 // the hit itself is unchanged; the show is dust, splinters and a small shake instead of the generic burst
 ABX_MUTE++;try{
  for(const e of enemies){if(e.dead||e.air)continue;if(los(f.x,f.y,e.x,e.y)&&Math.hypot(e.x-f.x,e.y-f.y)<f.r+e.r){hurtE(e,f.dm||S.atk*7*(1+.25*S.epow)*AP(),60,{slash:true,el:'burn'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=.5;}}}
 }finally{ABX_MUTE--;}
 shake=Math.max(shake,2);sfx('hit');for(let j=0;j<6;j++){const a=Math.random()*TAU,s2=rnd(15,40);particles.push({x:f.x,y:f.y,vx:Math.cos(a)*s2,vy:Math.sin(a)*s2-15,t:.4,col:j%3?'#b8a888':j?'#e8dcb0':'#a5f0aa'});}};}
{const _cc=classCast;classCast=function(k){const n0=fx.length;const r=_cc.apply(this,arguments);if(isArc()&&k==='e'){const L=fx.slice(n0).filter(f=>f.k==='ult');
  for(const f of L){f.arrow=1;const A=ABTUNE.storm,w=f.wait||0;topFx({dur:w+f.dur+A.stay,f,lean:rnd(-.25,.25),draw(o,k){const t=time-o.t0,land=w+f.dur,X=Math.round(sx(f.x,f.y)),Yg=Math.round(sy(f.x,f.y));if(t<land-A.fall)return;
    if(t<land){const u=(t-(land-A.fall))/A.fall,h=Math.round(100*(1-u));ctx.fillStyle='#e8dcb0';for(let j=0;j<9;j++)ctx.fillRect(X+Math.round(o.lean*(h+j)),Yg-h-j,1,1);ctx.fillStyle='#ffffff';ctx.fillRect(X+Math.round(o.lean*h),Yg-h,1,1);return;}
    ctx.globalAlpha=Math.max(0,1-(t-land)/A.stay);ctx.fillStyle='#14101a';ctx.fillRect(X-1,Yg-7,3,7);ctx.fillStyle='#c8a870';ctx.fillRect(X,Yg-6,1,6);ctx.fillStyle='#a5f0aa';ctx.fillRect(X,Yg-8,1,2);ctx.globalAlpha=1;}});}}return r;};}
// ---- F HAWK: swept feathers, short wingbeats and a bank into the glide ----
const HAWK_WING=mk(11,10,g=>{const hi=mk(44,40,h=>{h.scale(4,4);
 const face=(col,pts)=>{h.fillStyle=col;h.beginPath();h.moveTo(...pts[0]);for(const p of pts.slice(1))h.lineTo(...p);h.fill();};
 face('#14101a',[[3,0],[8,0],[10,2],[8,5],[5,8],[1,10],[2,8],[0,9],[1,5]]);
 face('#9a7449',[[4,0],[8,1],[9,2],[7,5],[4,8],[2,9],[4,6],[2,7]]);
 face('#c49b67',[[4,1],[7,1],[8,2],[6,4],[3,6]]);
 face('#e8dcb0',[[4,7],[7,4],[8,3],[7,5],[5,7]]);});
 g.imageSmoothingEnabled=false;g.drawImage(hi,0,0,11,10);});
CZD.hawk=z=>{ctx.save();ctx.globalAlpha=.28*Math.min(1,z.t/.4);ctx.fillStyle='#14101a';ctx.beginPath();ctx.ellipse(sx(z.x,z.y),sy(z.x,z.y),5,1.5,0,0,TAU);ctx.fill();ctx.restore();};
function drawHawkFlight(z){const HK=ABTUNE.hawk,age=z.t0-z.t,swoop=abEase(age/HK.swoop),
 h=HK.height+54*(1-swoop)+Math.sin(age*3.2)*2,
 cycle=age%1.27,flap=Math.sin(age*TAU*3)*abEase(cycle/.11)*(1-abEase((cycle-.5)/.14)),
 spread=z.shotAt==null?0:1-abEase((z.shotAt-z.t)/.2),
 bank=.5+.22*Math.sin(z.ang*2);
 // Use the orbit tangent for direction. The archer's movement cannot jerk the hawk's heading.
 const [dx,dy]=scrVec(-Math.sin(z.ang),Math.cos(z.ang));
 ctx.save();ctx.globalAlpha=abEase(age/.13)*Math.min(1,z.t/.4);ctx.translate(sx(z.x,z.y),Math.round(sy(z.x,z.y)-h));ctx.rotate(Math.atan2(dy,dx));
 for(const side of [-1,1]){const span=1+.20*flap*(1-spread)+.12*spread-side*.28*bank;
  ctx.save();ctx.scale(1,side*span);ctx.drawImage(HAWK_WING,-5,1);ctx.restore();}
 const R=(x,y,w,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,hh);};
 R(-8,-2,4,4,'#14101a');R(-7,-1,3,2,'#8a6a40');R(-7,-1,1,2,'#e8dcb0');
 R(-4,-2,8,4,'#14101a');R(-3,-1,6,2,'#a07a48');R(-3,0,5,1,'#e8dcb0');
 R(4,-2,4,4,'#14101a');R(4,-1,3,2,'#a07a48');R(5,-1,1,1,'#ffffff');R(8,-1,2,2,'#ffd060');
 ctx.restore();}
