'use strict';
// SHINOBIDUNGEONS - the newer heroes' kits already act through real objects (bells, fans, threads, tornadoes, salt);
// what they lacked was the body: several abilities played the shared cast/guard/roar. Each now has its own motion
// (see ANIMATION_AUDIT.md; core in 191):
//  KAGURA      F RHYTHM        steps on the beat: a stamp-and-turn, the fan snapping open on every step
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
Object.assign(AB_ANIM,{'RHYTHM':['beatstep',.48],'IRON BELL':['heave',.34],'SANCTUARY':['pray',.9],'ECHO NOTES':['bellstrike',.3],
 'UPDRAFT':['springup',.4],'CYCLONE':['fanswing',.34],'HARVEST':['strain',.45],'PUPPET DANCE':['puppeteer',.5]});
for(const n of ['RHYTHM','SANCTUARY','ECHO NOTES','UPDRAFT','CYCLONE','HARVEST','PUPPET DANCE'])ABX_OWN.add(n);
ULTSEQ["HEAVEN'S BELL"].k='bellpull';ULTSEQ["YOKOZUNA'S RING"].k='dohyo';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  case 'beatstep':{const n=Math.floor(u*4),k2=(u*4)%1;o.frame=n%2?13:14;o.flip=n%2?d>0:d<0;o.sy=1-.08*Math.sin(k2*Math.PI);o.dy=-Math.round(2*Math.sin(k2*Math.PI));break;}
  case 'heave':{if(u<.45){const k2=abEase(u/.45);o.frame=10;o.sy=1+.08*k2;o.skew=-.14*d*k2;o.dy=-Math.round(2*k2);}else{const k2=abEase((u-.45)/.55);o.frame=k2<.5?13:14;o.skew=.26*d*(1-k2);o.dx=Math.round(3*d*(1-k2));o.sy=.94+.06*k2;}break;}
  case 'pray':{const k2=abEase(Math.min(1,u/.2));o.frame=8;o.sy=1-.2*k2;o.sx=1+.06*k2;break;}
  case 'bellstrike':{o.frame=u<.3?12:u<.6?13:14;o.skew=(u<.3?-.15:.22*(1-u))*d;o.dx=Math.round((u<.3?-1:2*(1-u))*d);if(u>.3&&u<.45)o.dx+=Math.round(Math.sin(time*80));break;}
  case 'springup':{if(u<.4){const k2=abEase(u/.4);o.frame=12;o.sy=1-.22*k2;o.sx=1+.1*k2;}else{const k2=abEase((u-.4)/.6);o.frame=10;o.sy=1.12-.12*k2;o.dy=-Math.round(8*Math.sin(k2*Math.PI));}break;}
  case 'fanswing':{o.frame=u<.35?12:u<.7?13:14;o.skew=(u<.35?-.22*abEase(u/.35):.32*(1-abEase((u-.35)/.65)))*d;o.dx=Math.round((u<.35?-2:3*(1-u))*d);o.trail=u>.35&&u<.7;break;}
  case 'strain':{o.frame=12;const k2=u<.3?abEase(u/.3):1-abEase((u-.7)/.3);o.skew=-.2*d*Math.max(0,k2);o.dx=-Math.round(2*d*Math.max(0,k2))+Math.round(Math.sin(time*70)*Math.max(0,k2));o.sy=1-.06*Math.max(0,k2);break;}
  case 'puppeteer':{o.frame=Math.floor((time-H.t0)*16)%2?8:9;o.dy=-Math.round(Math.abs(Math.sin(u*Math.PI*3)));o.sy=1+.04*Math.sin(u*Math.PI);break;}
  // lead-ins (168 plays them as 'u_' + kind before the ultimate goes off)
  case 'u_bellpull':{const D=H.D||{},k2=(u*2)%1,pull=k2<.5?abEase(k2/.5):1-abEase((k2-.5)/.5);o.frame=pull<.5?10:12;o.sy=1+.1*(1-pull)-.12*pull;o.dy=-Math.round(3*(1-pull));o.skew=-.06*d;break;}
  case 'u_dohyo':{if(u<.6){const k2=abEase(u/.6);o.frame=12;o.sy=1+.12*k2;o.sx=1-.05*k2;o.skew=-.1*d*k2;o.dy=-Math.round(3*k2);}else{const k2=abEase((u-.6)/.4);o.frame=13;o.sy=1.12-.32*k2;o.sx=.95+.25*k2;if(k2>.6)o.impact=1;}break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// the stamp at the end of the dohyo-iri is felt
{const _cu=castUlt;castUlt=function(){const r=_cu.apply(this,arguments);if(P&&ultName()==="YOKOZUNA'S RING"&&ABPOSE&&ABPOSE.k==='u_dohyo'){const t0=ABPOSE.t0,dur=ABPOSE.dur;topFx({dur:dur+.3,x:P.x,y:P.y,draw(o,k){const t=time-t0-dur*.85;if(t<0)return;if(!o.shook){o.shook=1;shake=Math.max(shake,5);}
  const r=8+40*Math.min(1,t/.2);ctx.globalAlpha=Math.max(0,.7-t*2);for(let i=0;i<18;i++){const a=i/18*TAU,x=o.x+Math.cos(a)*r,y=o.y+Math.sin(a)*r;ctx.fillStyle=i%2?'#d8ccb0':'#a89878';ctx.fillRect(Math.round(sx(x,y))-1,Math.round(sy(x,y))-1,3,2);}ctx.globalAlpha=1;}});}return r;};}
// UWATENAGE: reach a foe at arm's length
{const _ch=coneHit;let wid=0;coneHit=function(x,y,a,r,arc,fn){if(wid&&r===38&&arc===2)r=54;return _ch.call(this,x,y,a,r,arc,fn);};
 const _st=sumThrow;sumThrow=function(){wid=1;try{return _st.apply(this,arguments);}finally{wid=0;}};}
