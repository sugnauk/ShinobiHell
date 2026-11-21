'use strict';
// SHINOBIDUNGEONS - ultimates get a show of their own. Pressing R now plays a short lead-in before the ultimate goes
// off (you are invulnerable through it; the Wizard can move), then the ultimate fires, then its follow-through:
//  DRAGON CLEAVE (samurai)     lifted high into the air in his dash stance, wind rushing in and the dash line burning gold, then
//                              the dash: a streak of afterimages along the path, and a landing slam
//  ARROW STORM (archer)        leaps high, looses the storm from the top of the leap, and drops back down
//  SHADOW CLONES (shinobi)     vanishes in smoke as three shadows split away, then reappears among them
//  SIEGEBREAKER (gunner)       braces low as the barrel glows and trembles, then fires and is shoved back by the blast
//  THOUSAND THRUSTS (lancer)   twirls the spear overhead, then the flurry
//  DRAGON SPIRIT (onmyoji)     kneels to call the dragon, then rises as it is released
//  DRAGON DESCENT, METEOR RAIN, STOPPED TIME, TALISMAN STORM (wizard and the rare scrolls)
//                              float up inside a circle of turning runes (a clock face for Stopped Time), then release
const ULTSEQ={
 'DRAGON CLEAVE':{pre:.38,iv:.75,k:'hover',rise:22,line:1,dashPose:1,col:'#ff6040'},
 'ARROW STORM':{pre:.3,iv:.7,k:'leap',rise:16,col:'#e8dcb0'},
 'SHADOW CLONES':{pre:.28,iv:.55,k:'smoke',col:'#9a7aff'},
 'SIEGEBREAKER':{pre:.36,iv:.36,k:'brace',col:'#ffd060',shove:10},
 'THOUSAND THRUSTS':{pre:.22,iv:.22,k:'twirl',col:'#c8e0ff'},
 'DRAGON SPIRIT':{pre:.3,iv:.4,k:'kneel',col:'#6cf'},
 'DRAGON DESCENT':{pre:.28,iv:.4,k:'hover',rise:6,runes:1,col:'#fd4'},
 'METEOR RAIN':{pre:.3,iv:.4,k:'hover',rise:8,runes:1,col:'#ff6030'},
 'STOPPED TIME':{pre:.3,iv:.4,k:'hover',rise:6,clock:1,col:'#8cf'},
 'TALISMAN STORM':{pre:.22,iv:.3,k:'hover',rise:5,runes:1,col:'#ff8a30'}};
// the follow-through each one plays once it fires (replacing the plain pose from 167)
Object.assign(AB_ANIM,{'ARROW STORM':['fall',.34],'DRAGON CLEAVE':['dragondash',.42],'SIEGEBREAKER':['recoil',.55,2.4],'SHADOW CLONES':['appear',.35]});
let ULT=null,ULTGO=false;
const ultName=()=>P&&SPELLS.e[P.lo.e]?SPELLS.e[P.lo.e].n:'';
{const _cu=castUlt;castUlt=function(){const D=ULTSEQ[ultName()];
 if(ULTGO||!D||!P)return _cu.apply(this,arguments);
 if(ULT||P.ab.e>0||P.stag>0||(P.lock&&P.lock.e)||mode!=='play')return;
 ULT={D,t0:time,x:P.x,y:P.y,a:P.aim,mobile:CLS().k==='wizard'};P.iv=Math.max(P.iv||0,D.iv);sfx('tool');
 ABPOSE={k:'u_'+D.k,dur:D.pre,p:1,t0:time,dir:scrVec(Math.cos(P.aim),Math.sin(P.aim))[0]<0?-1:1,D};};}
// The lead-in ends by firing from the hero's current position.
{const _u=update;update=function(dt){_u.apply(this,arguments);if(!ULT||mode!=='play'||!P)return;const U=ULT,D=U.D,k=(time-U.t0)/D.pre;
 if(P.dying>0||P.hp<=0){ULT=null;return;}
 if(!U.mobile){P.x=U.x;P.y=U.y;}
 P.iv=Math.max(P.iv,.05);
 // energy rushing in
 if(Math.random()<.18){const a=Math.random()*TAU,r=rnd(26,44);particles.push({x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,vx:-Math.cos(a)*r*2.6,vy:-Math.sin(a)*r*2.6,t:.35,col:Math.random()<.5?D.col:'#fff'});}
 if(k>=1){ULT=null;const x0=P.x,y0=P.y;ULTGO=true;try{castUlt();}finally{ULTGO=false;}
  if(ABPOSE&&ABPOSE.k==='dragondash'){ABPOSE.from={x:x0,y:y0};ABPOSE.to={x:P.x,y:P.y};}
  if(D.shove){const a=P.aim+Math.PI;for(let i=0;i<D.shove;i++){const nx=P.x+Math.cos(a),ny=P.y+Math.sin(a);if(blocked(nx,ny,4))break;P.x=nx;P.y=ny;}for(let i=0;i<12;i++)particles.push({x:P.x+rnd(-6,6),y:P.y+rnd(-2,2),vx:Math.cos(a)*rnd(20,60),vy:rnd(-20,0),t:.5,col:'#a89880'});}
  shake=Math.max(shake,6);}};}
// ---- the poses: lead-ins and follow-throughs
{const _pa=abPoseAt;abPoseAt=function(H){const D=H.D,u=clamp((time-H.t0)/H.dur,0,1),d=H.dir;
 const o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  case 'u_hover':{const r=D.rise*abEase(Math.min(1,u/.7));o.frame=10;o.dy=-Math.round(r+Math.sin(time*18)*.8);o.sy=1+.06*u;o.float=r;o.glow=0;
   // a dash ultimate leans forward into its line in the last moments, blade drawn back, before it launches
   // the samurai is lifted already in his dash stance, leaning into the line he is about to cut
   // the samurai rises coiled like a charged heavy: crouched, weight back, trembling, flashing when it is ready
   if(D.dashPose){const k2=abEase(Math.min(1,u/.6));o.frame=12;o.sy=1-.1*k2;o.sx=1+.05*k2;o.skew=-.14*d*k2;o.dx=Math.round(Math.sin(time*60)*Math.min(1,u*1.5));o.flash=u>.8&&Math.floor(time*16)%2===0;o.dy=-Math.round(r);break;}
   if(D.line&&u>.6){const k2=abEase((u-.6)/.4);o.frame=12;o.skew=.34*k2*d;o.dx=Math.round(2*d*k2);o.sy=1-.06*k2;o.sx=1+.04*k2;o.dy=-Math.round(r*(1-.35*k2));}break;}
  case 'u_leap':{const r=D.rise*Math.sin(Math.min(1,u)*Math.PI/2);o.frame=u<.4?12:13;o.dy=-Math.round(r);o.sy=u<.15?.82:1.05;o.float=r;break;}
  case 'u_smoke':{o.frame=8;o.alpha=1-.88*abEase((u-.15)/.85);o.sy=1-.08*abEase(u);break;}
  case 'u_brace':{o.frame=13;o.sy=.84;o.sx=1.08;o.skew=.12*d;o.dx=Math.round(Math.sin(time*70)*u);o.muzzle=u;break;}
  case 'u_twirl':{const th=u*TAU;o.frame=10;o.sx=Math.max(.3,Math.abs(Math.cos(th)));o.back=Math.cos(th)<0;o.dy=-2;break;}
  case 'u_kneel':{o.frame=12;o.sy=1-.24*abEase(Math.min(1,u/.5));o.sx=1+.08*abEase(Math.min(1,u/.5));o.runes=1;break;}
  case 'fall':{const r=16*(1-abEase(u));o.frame=u<.8?13:14;o.dy=-Math.round(r);o.sy=u>.85?.82:1;o.float=r;if(u>.85)o.impact=1;break;}
  case 'appear':{o.frame=u<.5?8:9;o.alpha=Math.min(1,.2+u*1.6);o.sy=1+.08*(1-u);break;}
  case 'dragondash':{o.frame=u<.7?13:14;o.skew=.25*d*(1-u);o.trail=u<.6;if(u>.7&&!H.landed){H.landed=1;o.impact=1;}o.streak=1;break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ---- the extras around the body: rune circles, the clock, the dash line, the shadows splitting away, the muzzle glow,
// the shadow left on the ground while airborne, and the dragon streak along the dash
{const _dp=drawPlayer;drawPlayer=function(){const H=ABPOSE,p=P;
 if(H&&p&&!(p.dying>0)){const X=sx(p.x,p.y),Y=sy(p.x,p.y)+3,D=H.D||ULTSEQ[ultName()]||{col:'#fff'},u=clamp((time-H.t0)/H.dur,0,1),col=D.col||'#fff';
  // under the body
  if(H.k==='u_hover'||H.k==='u_kneel'){const n=D.clock?12:8,rr=12+4*u;ctx.globalAlpha=.75;for(let i=0;i<n;i++){const a=i/n*TAU+time*(D.clock?0:1.6),x=X+Math.cos(a)*rr,y=Y-1+Math.sin(a)*rr*.38;ctx.fillStyle=i%2?col:'#fff';ctx.fillRect(Math.round(x),Math.round(y),2,1);}
   ctx.strokeStyle=col;ctx.globalAlpha=.5;ctx.beginPath();ctx.ellipse(X,Y-1,rr,rr*.38,0,0,TAU);ctx.stroke();
   if(D.clock){const ha=time*6;ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(X,Y-1);ctx.lineTo(X+Math.cos(ha)*rr*.8,Y-1+Math.sin(ha)*rr*.3);ctx.moveTo(X,Y-1);ctx.lineTo(X+Math.cos(ha/12)*rr*.5,Y-1+Math.sin(ha/12)*rr*.2);ctx.stroke();}ctx.globalAlpha=1;}
  if(H.k==='u_hover'&&D.line){const a=p.aim,len=130,bl=Math.floor(time*12)%2;for(let s=10;s<len;s+=5){const wx=p.x+Math.cos(a)*s,wy=p.y+Math.sin(a)*s;if(blocked(wx,wy,2))break;ctx.globalAlpha=(.35+.4*u)*(1-s/len*.5);ctx.fillStyle=bl?col:'#ffd080';ctx.fillRect(Math.round(sx(wx,wy))-1,Math.round(sy(wx,wy)),3,2);}ctx.globalAlpha=1;}
  if(H.k==='dragondash'&&H.from&&H.to){const n=7,k2=1-u;for(let i=0;i<n;i++){const f=i/(n-1),wx=H.from.x+(H.to.x-H.from.x)*f,wy=H.from.y+(H.to.y-H.from.y)*f;ctx.globalAlpha=.5*k2*(.3+.7*f);
    ctx.fillStyle=i%2?col:'#ffd080';ctx.beginPath();ctx.ellipse(sx(wx,wy),sy(wx,wy)-10,6,9,0,0,TAU);ctx.fill();}ctx.globalAlpha=1;}
  if(H.k==='u_smoke'){const split=abEase((u-.12)/.88),s=heroSpr(CLS().k,p.evo||0,false);
   ctx.save();ctx.globalAlpha=.66*split;
   for(let i=0;i<3;i++){const a=i/3*TAU,r=26*split,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;
    drawSpr(s,sx(x,y),sy(x,y)+3,false,0,scrVec(-Math.sin(a),Math.cos(a))[0]<0);}
   ctx.restore();}}
 return _dp.apply(this,arguments);};}
// while airborne, the shadow stays on the ground (drawn first, under the hero)
{const _sh=shadow;shadow=function(x,y,r){const H=ABPOSE;if(H&&P&&(H.k==='u_hover'||H.k==='u_leap'||H.k==='fall')){const sc=H.k==='u_leap'||H.k==='fall'?.7:.85;return _sh.call(this,x,y,Math.max(3,Math.round(r*sc)));}return _sh.apply(this,arguments);};}
// clear on a new stage
{const _ld=loadDungeon;loadDungeon=function(){ULT=null;return _ld.apply(this,arguments);};}
