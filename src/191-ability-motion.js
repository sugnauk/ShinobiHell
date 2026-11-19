'use strict';
// SHINOBIDUNGEONS - every ability performed by the body or by a real summoned thing (see ANIMATION_AUDIT.md).
// This file: the shared core (tuning table ABTUNE, the generic-burst mute, clean pose cancels) and the SAMURAI kit.
// Each further kit is its own file (192 onmyoji, ...) so a kit can be rolled back on its own.
// Built on the same systems as the reference abilities (Whirlwind, Dragon Cleave, Dragon Spirit): the AB_ANIM pose
// player (167), the top layer between sprites and bullets (170/179), shaped projectiles (PSPR) and class zones (CZD).
// Every timing is in ABTUNE below so the feel can be tuned without touching the code. Damage, cooldowns and hitboxes
// are not changed here; where a visual has a reach (a counter ring, a stun ring, a heal radius) it is drawn at
// exactly the gameplay radius.
const ABTUNE={
 // SAMURAI
 iai:{sheathe:.22,stop:.03},                                   // resheathe follow-through; hit-stop when something was cut
 guard:{crouch:.9,gleam:.55,counter:.16,ring:.12,stop:.05,shake:3},
 warcry:{inhale:.05,shout:.12,plant:.3,glyph:.6,ring:.12,fade:.3,stop:.04,shake:4}};
// abilities that now carry their own motion: the generic cast burst (rings, rays, seals from 147) is muted for them
const ABX_OWN=new Set(['GUARD STANCE','WAR CRY']);   // each kit file adds its own
let ABX_MUTE=0;
{const _j=juice;juice=function(o){if(ABX_MUTE)return;return _j.apply(this,arguments);};}
{const _cs=castShow;castShow=function(k){const sp=P&&SPELLS[k]&&SPELLS[k][P.lo[k]];const own=sp&&ABX_OWN.has(sp.n);if(own)ABX_MUTE++;try{return _cs.apply(this,arguments);}finally{if(own)ABX_MUTE--;}};}
// the poses each one plays (kind, duration)
Object.assign(AB_ANIM,{'GUARD STANCE':['stance',1.2],'WAR CRY':['kiai',ABTUNE.warcry.inhale+ABTUNE.warcry.shout+ABTUNE.warcry.plant]});
// screen point of a pixel in the hero's frame (x,y in the 20x24 frame), honouring the flip
const abxPx=(X,feetY,fx,fy,flip)=>({x:flip?X+10-fx:X-10+fx,y:feetY-24+fy});
const abxHeroFlip=()=>ABPOSE?ABPOSE.dir<0:(P.face<0);
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // SAMURAI: the resheathe after Iai Cleave: hand back on the hilt, a small settle
  case 'sheathe':{o.frame=15;const k2=Math.sin(u*Math.PI);o.sy=1-.06*k2;o.skew=-.06*d*(1-u);break;}
  // GUARD STANCE: blade raised high in a low, still crouch; the counter replaces it with the draw cut
  case 'stance':{const G=ABTUNE.guard,k2=abEase(Math.min(1,(time-H.t0)/.08));o.frame=8;o.sy=1-(1-G.crouch)*k2;o.sx=1+.05*k2;o.skew=-.05*d;break;}
  case 'counter':{const k2=u<.4?abEase(u/.4):1-abEase((u-.4)/.6);o.frame=u<.55?13:14;o.skew=.3*d*k2;o.dx=Math.round(3*d*k2);o.sy=1-.08*(1-k2);o.trail=u<.6;break;}
  // WAR CRY: inhale (squash), rear up with the blade overhead (stretch), then plant (squash and settle)
  case 'kiai':{const W=ABTUNE.warcry,t=time-H.t0;if(t<W.inhale){const k2=abEase(t/W.inhale);o.frame=12;o.sy=1-.12*k2;o.sx=1+.06*k2;}
   else if(t<W.inhale+W.shout){const k2=abEase((t-W.inhale)/W.shout);o.frame=10;o.sy=.88+.26*k2;o.sx=1.06-.1*k2;o.dy=-Math.round(3*k2);o.dx=Math.round(Math.sin(time*90)*k2);}
   else{const k2=abEase((t-W.inhale-W.shout)/W.plant);o.frame=k2<.5?10:14;o.sy=1.14-.22*Math.sin(k2*Math.PI)-.14*k2;o.sx=.96+.1*Math.sin(k2*Math.PI);o.dy=-Math.round(3*(1-k2));}break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ======================================== SAMURAI ========================================
// IAI CLEAVE: when the dash ends the samurai resheathes; everything he cut flashes at once, with a beat of hit-stop
{const _u=update;update=function(dt){const was=P&&P.iai;_u.apply(this,arguments);if(!P||mode!=='play')return;
 if(was&&!P.iai){const cut=[...was.hit].filter(e=>!e.dead);ABPOSE={k:'sheathe',dur:ABTUNE.iai.sheathe,p:1,t0:time,dir:scrVec(Math.cos(was.a),Math.sin(was.a))[0]<0?-1:1};
  if(was.hit.size){hitstop=Math.max(hitstop,ABTUNE.iai.stop);for(const e of cut)e.flash=Math.max(e.flash||0,.14);}}}}
// GUARD STANCE: hold the high guard while the stance lasts; a gleam runs up the blade
{const _cc=classCast;classCast=function(k){const before=P&&P.guardSt;const r=_cc.apply(this,arguments);
 if(P&&k==='w'&&CLS().k==='samurai'&&P.guardSt>0&&P.guardSt!==before){ABPOSE={k:'stance',dur:P.guardSt,p:1,t0:time,dir:abxHeroFlip()?-1:1};P.abxGuard={t0:time};}return r;};}
// the counter: the first hit taken snaps into a full-circle draw cut, exactly the counter's reach (50)
{const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){const armed=P&&CLS().k==='samurai'&&P.guardSt>0&&!(o&&o.peril);const r=_hp.apply(this,arguments);
 if(armed&&P.guardSt===0){const G=ABTUNE.guard,a=Math.atan2((y||P.y)-P.y,(x||P.x)-P.x),dir=scrVec(Math.cos(a),Math.sin(a))[0]<0?-1:1;
  ABPOSE={k:'counter',dur:G.counter+.14,p:1,t0:time,dir};P.abxGuard=null;
  topFx({dur:G.ring+.18,x:P.x,y:P.y,a,draw(o,k){const R0=50,k2=Math.min(1,(time-o.t0)/G.ring),fade=k2<1?1:1-(time-o.t0-G.ring)/.18,sweep=k2*TAU;
   ctx.globalAlpha=Math.max(0,fade);for(let i=0;i<48;i++){const t=i/48*TAU;if(t>sweep)break;const aa=o.a+t,px=o.x+Math.cos(aa)*R0,py=o.y+Math.sin(aa)*R0,X=sx(px,py),Y=sy(px,py)-8,lead=sweep-t<.5;
    ctx.fillStyle=lead?'#ffffff':'#e8eef6';ctx.fillRect(Math.round(X)-1,Math.round(Y),lead?3:2,lead?2:1);if(lead){ctx.fillStyle='#ffe080';ctx.fillRect(Math.round(X),Math.round(Y)-1,1,1);}}}});
  hitstop=Math.max(hitstop,G.stop);shake=Math.max(shake,G.shake);}return r;};}
// WAR CRY: the kiai glyph (喝, KATSU) bursts above him, and two pressure rings of dust run out to the stun radius (85)
const ABX_KATSU=['.....xxxxxx..','.....x....x..','xxx..xxxxxx..','x.x..x....x..','x.x..xxxxxx..','x.x...x......','xxx..xxxxxxxx','x.x..x.x....x','.....x..x.x.x','.....x...x..x','.....x..x.x.x','.....x......x','.....xxxxxxx.'];
function abxKatsu(X,Y,sc,alpha){ctx.globalAlpha=alpha;for(const [col,off] of [['#14101a',1],['#ffffff',0]])for(let y=0;y<13;y++)for(let x=0;x<13;x++){if(ABX_KATSU[y][x]!=='x')continue;ctx.fillStyle=col;ctx.fillRect(Math.round(X+(x-6.5)*sc+off),Math.round(Y+(y-6.5)*sc+off),Math.ceil(sc),Math.ceil(sc));}ctx.globalAlpha=1;}
{const _cc=classCast;classCast=function(k){const before=P&&P.ab.f,n0=fx.length,fl0=flashT;const r=_cc.apply(this,arguments);
 if(P&&k==='f'&&CLS().k==='samurai'&&P.ab.f!==before){const W=ABTUNE.warcry;
  // the old generic look (a screen flash and a plain ring) gives way to the kiai: flashes are kept for ultimates
  flashT=fl0;for(let i=fx.length-1;i>=n0;i--)if(fx[i].k==='ring')fx.splice(i,1);
  topFx({dur:W.glyph,draw(o,k){const t=time-o.t0;const X=sx(P.x,P.y),Y=sy(P.x,P.y)-30,k2=Math.min(1,t/.08),f=t>W.glyph-.25?Math.max(0,(W.glyph-t)/.25):1;abxKatsu(X,Y-4*k2,1.4+.8*k2-.2*(t/W.glyph),f);}});
  topFx({dur:W.ring+W.fade+.05,x:P.x,y:P.y,draw(o,k){const t=time-o.t0;const R0=85;
   for(const [lag,n] of [[0,28],[.05,20]]){const kk=Math.min(1,Math.max(0,(t-lag)/W.ring)),r=R0*kk,a=t>W.ring?Math.max(0,1-(t-W.ring)/W.fade):1;if(kk<=0)continue;
    ctx.globalAlpha=.75*a;for(let i=0;i<n;i++){const aa=i/n*TAU+lag*9,px=o.x+Math.cos(aa)*r,py=o.y+Math.sin(aa)*r,X=sx(px,py),Y=sy(px,py);ctx.fillStyle=i%2?'#d8ccb0':'#a89878';ctx.fillRect(Math.round(X)-1,Math.round(Y)-1,3,2);ctx.fillRect(Math.round(X),Math.round(Y)-2,1,1);}}
   ctx.globalAlpha=1;}});
  shake=Math.max(shake,W.shake);hitstop=Math.max(hitstop,W.stop);}return r;};}
{const _ld=loadDungeon;loadDungeon=function(){if(P){P.abxGuard=null;}return _ld.apply(this,arguments);};}
// held poses end cleanly: the stance ends with the guard, and a dash cancels any of these motions
const ABTUNE_HELD=new Set(['stance','kiai','summon','sealhand','plantstaff','flick','sheathe']);
{const _u=update;update=function(dt){_u.apply(this,arguments);const H=ABPOSE;if(!P||!H)return;
 if(H.k==='stance'&&!(P.guardSt>0))ABPOSE=null;else if(ABTUNE_HELD.has(H.k)&&P.dash>0&&!P.iai)ABPOSE=null;};}
// ---- global clean-up for every hero ----
// the white star sigil (the generic 'seal' burst under the hero on every E and R) is gone: each ability now shows
// its own thing, the generic burst is no longer needed
{const _j=juice;juice=function(o){if(o&&o.k==='seal')return;return _j.apply(this,arguments);};}
// basic abilities stay subtle: only an ultimate may flash the whole screen (shake and hit-stop are kept)
for(const nm of ['castHeavy','castChain','castWard','castF']){const f=globalThis[nm];if(typeof f!=='function')continue;
 globalThis[nm]=function(){const f0=flashT;const r=f.apply(this,arguments);if(flashT>f0)flashT=f0;return r;};}
{const _cc=classCast;classCast=function(k){const f0=flashT;const r=_cc.apply(this,arguments);if(k!=='e'&&flashT>f0)flashT=f0;return r;};}
// the siege cannon belongs to the gunner's SIEGEBREAKER alone (other heroes' 'brace' lead-ins used to draw it too)
{const _sg=drawSiegeGun;drawSiegeGun=function(){if(ultName()!=='SIEGEBREAKER')return;return _sg.apply(this,arguments);};}
