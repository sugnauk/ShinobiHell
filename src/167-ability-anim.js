'use strict';
// SHINOBIDUNGEONS - the hero's body acts out each ability. The hero sheets only have a few poses (idle, walk, cast,
// ultimate, dash and a 3-frame attack), so every ability used to play the same generic cast or swing. Now each ability
// has a motion built from those frames, the back-view sheet and transforms, played over several frames:
//  SPIN     a real turn: front view, narrowing to the side, the back view, round to the front again, with a ghost
//           trailing the turn (Whirlwind spins 3 times, Wheel Sweep twice, sweeping heavies half a turn)
//  THRUST   wind back, then lunge forward with the strike frame and afterimages (Yari, Iai Cleave, Spiral Lunge...)
//  FLURRY   rapid alternating thrusts (Thousand Thrusts)
//  SLAM     rise up and stretch, then crash down into a squash (Odachi, Frost Nova, War Banner...)
//  CAST     arms raised, hovering a little (spells); BIG CAST holds the ultimate pose, rises and releases
//  THROW    a quick wind-up and release (kunai, shuriken, caltrops)
//  RECOIL   the body kicks back with the shot (Tanegashima, Heavy Slug, Grapeshot, Siegebreaker)
//  ROLL     a full roll, head over heels (Evade Roll, Powder Roll)
//  GUARD    crouched behind a raised guard, with a shield arc in front (Guard Stance, Ward, Deflect, Barrier)
//  VANISH   fades out in the smoke and flickers back; BLINK pinches to a line and snaps open (Kitsune / Shadow Step)
//  PLANT    kneels to set something down, then stands (totems, the tripod gun, the hawk, circles)
//  ROAR     rears up and shakes (War Cry)
// Holding RMB to charge a heavy also shows: the hero crouches and trembles, and flashes when the charge is full.
const AB_ANIM={
 // LMB (only the melee and special ones get a pose; ranged basics keep the quick shot)
 'ODACHI CLEAVE':['slam',.42],'YARI THRUST':['thrust',.22],'NAGINATA SWEEP':['spin',.3,.5],'KUSARIGAMA':['throw',.25],'SUZU PULSE':['cast',.3],
 // RMB heavies
 'SPIRIT BLADE':['spin',.3,.5],'VOID ORB':['cast',.3],'FROST LANCE':['throw',.24],'MOONLIT CRESCENT':['spin',.34,.6],'IAI CLEAVE':['thrust',.3,1.4],
 'CHARGED SHOT':['recoil',.22,.6],'SHURIKEN FAN':['throw',.24],'SPIRIT FOX':['cast',.3],'HEAVY SLUG':['recoil',.34,1.2],'SPIRAL LUNGE':['lunge',.5],
 // Q
 'CHAIN LIGHTNING':['cast',.32],'FLAME WAVE':['thrust',.3,.6],'KITSUNE STEP':['blink',.3],'HEAVENLY JUDGMENT':['bigcast',.5],'WHIRLWIND':['spin',.62,3],
 'ARROW RAIN':['cast',.36],'SHADOW STEP':['blinkstab',.4],'SHIKIGAMI':['cast',.36],'GRAPESHOT':['recoil',.3,1],'WHEEL SWEEP':['spin',.5,2],
 // E
 'SPIRIT WARD':['guard',.6],'HEALING RITE':['cast',.5],'STILLNESS SEAL':['plant',.36],'DIVINE AEGIS':['bigcast',.55],'GUARD STANCE':['guard',1.2],
 'EVADE ROLL':['roll',.36,1],'SMOKE BOMB':['vanish',.7],'BARRIER':['guard',.5],'POWDER ROLL':['roll',.36,-1],'DEFLECT':['guard',1],
 // F
 'FROST NOVA':['slam',.4],'GRAVITY WELL':['cast',.36],'THUNDER TOTEM':['plant',.38],'BLACK HOLE':['bigcast',.55],'WAR CRY':['roar',.55],
 'HAWK':['cast',.34],'CALTROPS':['throw',.28],'HEALING CIRCLE':['plant',.38],'TRIPOD GUN':['plant',.4],'WAR BANNER':['slam',.45],
 // R
 'DRAGON DESCENT':['bigcast',.7],'TALISMAN STORM':['spin',4,8],'STOPPED TIME':['bigcast',.7],'METEOR RAIN':['bigcast',.7],'DRAGON CLEAVE':['thrust',.45,2.2],
 'ARROW STORM':['bigcast',.6],'SHADOW CLONES':['vanish',.6],'DRAGON SPIRIT':['bigcast',.6],'SIEGEBREAKER':['recoil',.5,2],'THOUSAND THRUSTS':['flurry',1.6]};
let ABPOSE=null;
function abStartPose(k){if(!P)return;const sp=SPELLS[k]&&SPELLS[k][P.lo[k]];const A=sp&&AB_ANIM[sp.n];if(!A)return;
 // a lunge or spin uses the direction you are aiming (screen left or right)
 const ax=scrVec(Math.cos(P.aim||0),Math.sin(P.aim||0))[0];
 ABPOSE={k:A[0],dur:A[1],p:A[2]!=null?A[2]:1,t0:time,dir:ax<0?-1:1,full:k==='h'&&!!P.hFull};}
{const _cs=castShow;castShow=function(k){const r=_cs.apply(this,arguments);try{abStartPose(k);}catch(_){}return r;};}
{const _cb=castBolt;castBolt=function(){const b=P&&P.atkCd;const r=_cb.apply(this,arguments);try{if(P&&P.atkCd!==b)abStartPose('m');}catch(_){}return r;};}
// ---- the pose at a moment: which sheet view, frame and flip, and how the body is moved, leaned, squashed or turned
const abEase=t=>t<0?0:t>1?1:t*t*(3-2*t);
function abPoseAt(H,dirFlip){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1,ghost:null};
 switch(H.k){
  case 'spin':{const th=u*H.p*TAU,c=Math.cos(th),s=Math.sin(th);o.sx=Math.max(.28,Math.abs(c));o.back=c<0;o.flip=(s*d<0)?!(d<0):(d<0); // the turn: front, side, back, side, front
   o.frame=13;o.dy=-Math.round(Math.sin(u*Math.PI)*2);o.ghost={th:th-.7};break;}
  case 'thrust':{if(u<.3){o.frame=12;o.skew=-.18*d;o.dx=-2*d*abEase(u/.3);}else{const k2=abEase((u-.3)/.25);o.frame=u<.7?13:14;o.skew=.28*d*(1-abEase((u-.55)/.45));o.dx=(-2+(6*H.p)*k2)*d*(1-abEase((u-.7)/.3));o.trail=u<.75;}break;}
  case 'lunge':{o.frame=u<.2?12:u<.75?13:14;o.skew=(u<.2?-.15:.3)*d;o.dx=(u<.2?-2:4)*d;o.trail=u>.2&&u<.8;if(H.full&&u>.7){const th=(u-.7)/.3*TAU;o.sx=Math.max(.28,Math.abs(Math.cos(th)));o.back=Math.cos(th)<0;}break;}
  case 'flurry':{const n=Math.floor(u*H.dur/.07);o.frame=n%2?13:14;o.skew=.22*d;o.dx=(n%2?3:1)*d;o.dy=n%3===0?-1:0;o.trail=true;break;}
  case 'slam':{if(u<.45){const k2=abEase(u/.45);o.frame=12;o.sy=1+.14*k2;o.sx=1-.06*k2;o.dy=-Math.round(4*k2);}else if(u<.62){o.frame=13;o.sy=.8;o.sx=1.18;o.impact=1;}else{const k2=abEase((u-.62)/.38);o.frame=14;o.sy=.8+.2*k2;o.sx=1.18-.18*k2;}break;}
  case 'cast':{o.frame=Math.floor((time-H.t0)*14)%2?9:8;o.dy=-Math.round(2*Math.sin(u*Math.PI));o.sy=1+.05*Math.sin(u*Math.PI);break;}
  case 'bigcast':{o.frame=10;if(u<.6){const k2=abEase(u/.6);o.dy=-Math.round(5*k2);o.sy=1+.1*k2;}else{const k2=abEase((u-.6)/.4);o.dy=-Math.round(5*(1-k2));o.sy=1.1-.25*Math.sin(k2*Math.PI);o.sx=1+.12*Math.sin(k2*Math.PI);}o.glow=1;break;}
  case 'throw':{o.frame=u<.35?12:u<.7?13:14;o.skew=(u<.35?-.15:.2)*d;o.dx=(u<.35?-1:2)*d*(1-u);break;}
  case 'recoil':{o.frame=13;const k2=u<.15?u/.15:1-abEase((u-.15)/.85);o.skew=-.25*d*k2*H.p;o.dx=-Math.round(3*H.p*k2)*d;o.sy=1-.05*k2;break;}
  case 'roll':{o.frame=11;o.rot=u*TAU*d*H.p;o.sy=.85;o.sx=.92;o.dy=-Math.round(3*Math.sin(u*Math.PI));o.trail=true;break;}
  case 'guard':{o.frame=8;o.sy=.93;o.skew=-.08*d;o.shield=1;break;}
  case 'vanish':{o.frame=8;o.alpha=u<.25?1-u/.25*.9:u<.75?(Math.floor(time*20)%2?.1:.25):(u-.75)/.25;break;}
  case 'blink':{o.frame=11;const k2=u<.5?abEase(u/.5):1-abEase((u-.5)/.5);o.sx=1-.88*k2;o.sy=1+.4*k2;o.alpha=1-.4*k2;break;}
  case 'blinkstab':{if(u<.35){const k2=abEase(u/.35);o.frame=11;o.sx=1-.88*k2;o.sy=1+.4*k2;}else{const k2=abEase((u-.35)/.3);o.frame=u<.7?13:14;o.sx=.12+.88*k2;o.skew=.25*d*(1-abEase((u-.65)/.35));o.dx=3*d*(1-u);}break;}
  case 'plant':{o.frame=u<.6?12:8;const k2=u<.35?abEase(u/.35):1-abEase((u-.6)/.4);o.sy=1-.22*Math.max(0,k2);o.sx=1+.08*Math.max(0,k2);break;}
  case 'roar':{o.frame=10;const k2=Math.sin(u*Math.PI);o.sy=1+.12*k2;o.dx=Math.round(Math.sin(time*80)*1.2*k2);o.dy=-Math.round(2*k2);break;}}
 return o;}
// charging a heavy: crouch and tremble, a flash when the charge is full
function abChargePose(){const p=P;if(!p||!(p.hCh>0)||ABPOSE)return null;const f=clamp(p.hCh/HCHARGE,0,1),full=f>=1;
 return {frame:12,sy:1-.08*f,sx:1+.04*f,dx:full?Math.round(Math.sin(time*60)):0,skew:-.1*(p.face<0?-1:1)*f,flash:full&&Math.floor(time*16)%2===0,back:false,flip:p.face<0,dy:0,rot:0,alpha:1};}
// ---- drawing: while the hero's own sheet is drawn, the pose takes over
let ABPOSE_DRAW=null;
const abIsHero=s=>{if(!P||!s)return false;const k=CLS().k,e=P.evo||0;return s===heroSpr(k,e,false)||s===heroSpr(k,e,true);};
{const _ds=drawSpr;drawSpr=function(s,x,feetY,white,frame,flip){const O=ABPOSE_DRAW;if(!O||!abIsHero(s))return _ds.apply(this,arguments);
 const k=CLS().k,e=P.evo||0,s2=heroSpr(k,e,!!O.back),fr=O.frame!=null?O.frame:frame,fl=O.flip!=null?O.flip:flip,h=s2.fh*(s2.sc||1);
 const one=(o,alphaMul,wh)=>{ctx.save();ctx.globalAlpha*=alphaMul;ctx.translate(Math.round(x+(o.dx||0)),Math.round(feetY+(o.dy||0)));
  if(o.rot){ctx.translate(0,-h/2);ctx.rotate(o.rot);ctx.translate(0,h/2);}
  ctx.transform(o.sx||1,0,-(o.skew||0),o.sy||1,0,0);_ds.call(this,o.s2||s2,0,0,wh,o.fr!=null?o.fr:fr,o.fl!=null?o.fl:fl);ctx.restore();};
 // a ghost trailing a spin, afterimages behind a lunge or roll
 if(O.ghost&&!white){const c=Math.cos(O.ghost.th),gs=heroSpr(k,e,c<0);one({dx:O.dx,dy:O.dy,sx:Math.max(.28,Math.abs(c)),sy:O.sy,s2:gs,fr:13,fl:Math.sin(O.ghost.th)<0?!fl:fl},.32,true);}
 if(O.trail&&!white){const d=(O.flip?-1:1);for(let i=1;i<=2;i++)one({dx:(O.dx||0)-d*i*4,dy:O.dy,sx:O.sx,sy:O.sy,skew:O.skew,rot:O.rot?O.rot-i*.6*d:0},.22/i,true);}
 one(O,O.alpha==null?1:O.alpha,white||!!O.flash);};}
{const _dp=drawPlayer;drawPlayer=function(){const p=P;if(!p||p.dying>0){ABPOSE=null;return _dp.apply(this,arguments);}
 if(ABPOSE&&time-ABPOSE.t0>ABPOSE.dur)ABPOSE=null;
 const O=ABPOSE?abPoseAt(ABPOSE):abChargePose();if(!O)return _dp.apply(this,arguments);
 ABPOSE_DRAW=O;try{_dp.apply(this,arguments);}finally{ABPOSE_DRAW=null;}
 // the guard's shield arc, the slam's dust, the big cast's glow
 const X=sx(p.x,p.y),Y=sy(p.x,p.y)+3;
 if(O.shield){const d=O.flip?-1:1,pulse=.6+.4*Math.sin(time*12);ctx.strokeStyle='#bfe8ff';ctx.globalAlpha=.55*pulse;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X+d*7,Y-11,6,11,0,d>0?-1.3:Math.PI-1.3+.0,d>0?1.3:Math.PI+1.3);ctx.stroke();ctx.lineWidth=1;ctx.globalAlpha=1;}
 if(O.impact&&!ABPOSE.dusted){ABPOSE.dusted=1;for(let i=0;i<10;i++)particles.push({x:p.x+rnd(-8,8),y:p.y+rnd(-3,3),vx:rnd(-40,40),vy:rnd(-20,0),t:.4,col:'#a89880'});shake=Math.max(shake,3);}
 if(O.glow){const c=SPELLS.e[p.lo.e]?SPELLS.e[p.lo.e].c:'#fff',k=(time*3)%1;ctx.strokeStyle=c;ctx.globalAlpha=.7*(1-k);ctx.beginPath();ctx.ellipse(X,Y-1,6+k*14,(6+k*14)*.38,0,0,TAU);ctx.stroke();ctx.globalAlpha=.5;ctx.beginPath();ctx.ellipse(X,Y-1,9,3.5,0,0,TAU);ctx.stroke();ctx.globalAlpha=1;}};}
// a new stage, a death or the end of a run clears any pose
{const _ld=loadDungeon;loadDungeon=function(){ABPOSE=null;return _ld.apply(this,arguments);};}
