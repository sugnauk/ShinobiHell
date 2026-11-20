'use strict';
// SHINOBIDUNGEONS - the newer heroes' kits already act through real objects (bells, fans, threads, tornadoes, salt);
// what they lacked was the body: several abilities played the shared cast/guard/roar. Each now has its own motion
// (see ANIMATION_AUDIT.md; core in 191):
//  KAGURA      F PETAL VOLLEY  flicks both fans open and throws the volley
//  BELL WARDEN RMB IRON BELL   a two-handed overhead heave before the throw
//              E SANCTUARY     drops to one knee, palms together, as the great bell comes down
//              F ECHO NOTES    strikes the bell at his hip; the notes leave it
//              R HEAVEN'S BELL hauls down an unseen bell rope twice before the bell falls (it used to show the
//                              gunner's siege cannon)
//  SUMO        R YOKOZUNA'S RING the leg-raise and stamp of a dohyo-iri before the spirit appears (it also used to
//                              show the siege cannon)
//              Q UWATENAGE     the grab reaches a little further (38 -> 54) so it no longer whiffs on a foe at arm's
//                              length; out of reach it still tells you and costs nothing
//  TENGU       E UPDRAFT       a deep crouch and a spring up into the wind
//              F CYCLONE       a full swing of the feather fan that throws the tornado out
//  CHIMIKO     F HARVEST       pulls the red threads back hard, the body straining
//  MARIONETTIST F PUPPET DANCE both hands up, the fingers working the strings
Object.assign(AB_ANIM,{'IRON BELL':['heave',.34],'SANCTUARY':['pray',.9],'ECHO NOTES':['bellstrike',.3],
 'UPDRAFT':['springup',.4],'CYCLONE':['fanswing',.34],'HARVEST':['strain',.45],'PUPPET DANCE':['puppeteer',.5]});
for(const n of ['PETAL VOLLEY','SANCTUARY','ECHO NOTES','UPDRAFT','CYCLONE','HARVEST','PUPPET DANCE','SHIKO','SALT THROW',"YOKOZUNA'S RING",'GRAND THEATRE','CRIMSON MOON'])ABX_OWN.add(n);
ULTSEQ["HEAVEN'S BELL"].k='bellpull';ULTSEQ["YOKOZUNA'S RING"].k='dohyo';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  case 'petalcast':{const release=abEase((u-.12)/.27)*(1-abEase((u-.55)/.45));o.frame=u<.24?12:u<.58?13:14;
   o.dx=Math.round(3*d*release);o.skew=.2*d*release;o.sy=1-.085*release;break;}
  case 'heave':{if(u<.45){const k2=abEase(u/.45);o.frame=10;o.sy=1+.08*k2;o.skew=-.14*d*k2;o.dy=-Math.round(2*k2);}else{const k2=abEase((u-.45)/.55);o.frame=k2<.5?13:14;o.skew=.26*d*(1-k2);o.dx=Math.round(3*d*(1-k2));o.sy=.94+.06*k2;}break;}
  case 'pray':{const k2=abEase(Math.min(1,u/.2));o.frame=8;o.sy=1-.2*k2;o.sx=1+.06*k2;break;}
  case 'bellstrike':{o.frame=u<.3?12:u<.6?13:14;o.skew=(u<.3?-.15:.22*(1-u))*d;o.dx=Math.round((u<.3?-1:2*(1-u))*d);if(u>.3&&u<.45)o.dx+=Math.round(Math.sin(time*80));break;}
  case 'springup':{if(u<.4){const k2=abEase(u/.4);o.frame=12;o.sy=1-.22*k2;o.sx=1+.1*k2;}else{const k2=abEase((u-.4)/.6);o.frame=10;o.sy=1.12-.12*k2;o.dy=-Math.round(8*Math.sin(k2*Math.PI));}break;}
  case 'fanswing':{o.frame=u<.35?12:u<.7?13:14;o.skew=(u<.35?-.22*abEase(u/.35):.32*(1-abEase((u-.35)/.65)))*d;o.dx=Math.round((u<.35?-2:3*(1-u))*d);o.trail=u>.35&&u<.7;break;}
  case 'strain':{o.frame=12;const k2=u<.3?abEase(u/.3):1-abEase((u-.7)/.3);o.skew=-.2*d*Math.max(0,k2);o.dx=-Math.round(2*d*Math.max(0,k2))+Math.round(Math.sin(time*70)*Math.max(0,k2));o.sy=1-.06*Math.max(0,k2);break;}
  case 'puppeteer':{o.frame=Math.floor((time-H.t0)*16)%2?8:9;o.dy=-Math.round(Math.abs(Math.sin(u*Math.PI*3)));o.sy=1+.04*Math.sin(u*Math.PI);break;}
  // lead-ins (168 plays them as 'u_' + kind before the ultimate goes off)
  case 'u_bellpull':{const D=H.D||{},k2=(u*2)%1,pull=k2<.5?abEase(k2/.5):1-abEase((k2-.5)/.5);o.frame=pull<.5?10:12;o.sy=1+.1*(1-pull)-.12*pull;o.dy=-Math.round(3*(1-pull));o.skew=-.06*d;break;}
  case 'saltcast':{const load=abEase(u/.27),sweep=abEase((u-.2)/.27)*(1-abEase((u-.57)/.43));
   o.frame=u<.25?12:u<.58?13:14;o.skew=d*(.29*sweep-.16*load*(1-sweep));o.dx=Math.round(d*(-2+6*sweep));o.sy=1-.13*sweep;break;}
  case 'u_dohyo':case 'shiko':case 'shiko_ring':{const t=time-H.t0,ring=H.k==='shiko_ring',lead=H.k==='u_dohyo',at=ring?RING_IMPACT:SHIKO_IMPACT;
   if(lead||t<at){const lift=abEase((t-.05)/.15),drop=lead?0:abEase((t-at+.09)/.09);
    o.frame=t<.085?12:15;o.skew=-.32*d*lift*(1-drop);o.sy=1+.12*lift-.18*drop;o.dx=-Math.round(3*lift*(1-drop))*d;}
   else{const stamp=1-abEase((t-at)/.16);o.frame=10;o.sy=1-.26*stamp;o.sx=1+.22*stamp;}break;}
  case 'u_theatre':{const pull=abEase((u-.2)/.6);o.frame=u<.22?8:10;o.dy=-Math.round(pull*8);o.sy=1+.08*pull;break;}
  case 'theatre_release':{o.frame=u<.55?9:8;o.dy=-Math.round(8*(1-abEase(u)));break;}
  case 'u_moon':{const kneel=abEase(u/.6);o.frame=12;o.sy=1-.24*kneel;o.sx=1+.08*kneel;break;}
  case 'moon_release':{const rise=abEase(u);o.frame=u<.4?12:13;o.sy=.76+.24*rise;o.sx=1.08-.08*rise;break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// Basic attacks can continue during these casts without replacing the wind-up pose.
const ROSTER_HELD_POSES=new Set(['shiko','shiko_ring','u_dohyo','u_theatre','u_moon']);
{const _cs=castShow;castShow=function(){const r=_cs.apply(this,arguments);
 if(ABPOSE?.k==='shiko'||ABPOSE?.k==='shiko_ring')ABPOSE.runAt=R.time;return r;};}
{const _cb=castBolt;castBolt=function(){const H=ABPOSE,r=_cb.apply(this,arguments);
 if(H&&ROSTER_HELD_POSES.has(H.k)&&(H.runAt==null?time-H.t0:R.time-H.runAt)<H.dur)ABPOSE=H;return r;};}
// Theatre strings descend onto the hands. The Moon's ink pools beneath the kneeling caster.
{const _dp=drawPlayer;drawPlayer=function(){const H=ABPOSE;if(H?.runAt!=null)H.t0=time-(R.time-H.runAt);
 if(!H||!P||P.dying>0||!['u_moon','moon_release','u_theatre'].includes(H.k)||time-H.t0>H.dur)return _dp.apply(this,arguments);
 const O=abPoseAt(H),X=HSX(P.x,P.y),Y=HSY(P.x,P.y)+3;
 if(H.k==='u_moon'||H.k==='moon_release'){const release=H.k==='moon_release',size=release?1+.18*O.u:abEase(O.u/.85),fade=release?1-O.u:1;
  ctx.save();ctx.globalAlpha=.84*fade;
  for(let y=-5;y<=4;y++){const w=Math.round([4,9,12,14,16,16,15,13,10,5][y+5]*size),dy=Math.round(y*size);if(!w)continue;
   KR(X,Y,1,-w,dy,w*2,1,'#380912');KR(X,Y,1,-w+2,dy,Math.max(1,w*2-5),1,y%3?'#700f22':'#a51a30');}
  if(size>.5){KR(X,Y,1,-9,-1,5,1,'#dc3d50');KR(X,Y,1,6,2,4,1,'#dc3d50');}
  ctx.restore();}
 const r=_dp.apply(this,arguments);
 if(H.k==='u_theatre'){const drop=abEase(O.u/.62),feet=Y+O.dy;
  ctx.save();ctx.globalAlpha=abEase(O.u/.23);
  for(const side of [-1,1]){const hx=X+side*7,hy=feet-17,ax=X+side*16,ay=Y-66,tx=ax+(hx-ax)*drop,ty=ay+(hy-ay)*drop;
   kLine(ax+1,ay,tx+1,ty,2,'#4a265e');kLine(ax,ay,tx,ty,1,MAR);
   if(drop===1){kLine(hx,hy,hx+side*3,hy-8,1,MAR2);KR(hx,hy,1,-1,-1,2,2,MAR2);}}
  ctx.restore();}
 return r;};}
// UWATENAGE: reach a foe at arm's length
{const _ch=coneHit;let wid=0;coneHit=function(x,y,a,r,arc,fn){if(wid&&r===38&&arc===2)r=54;return _ch.call(this,x,y,a,r,arc,fn);};
 const _st=sumThrow;sumThrow=function(){wid=1;try{return _st.apply(this,arguments);}finally{wid=0;}};}
