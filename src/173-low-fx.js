'use strict';
// SHINOBIDUNGEONS - effects that never hide a bullet. Ultimates and legendary weapons used to throw clouds of particles,
// full-screen flashes and ray bursts that made enemy shots hard to see. They now lean on crisp shapes and motion:
//  ultimates  no full-screen flash (a brief glow at the screen edges in the ultimate's colour instead), no ray burst,
//             one ring instead of three, and every spark burst cut to a handful; the blasts themselves shed far less
//  legendary  weapons and armour keep their colours and character, but shed far fewer motes, drawn fainter, with a
//             low cap on how many can exist at once
let LOWFX=0;const EDGEFX={col:'#fff',t0:-9};
{const _sp=spark;spark=function(x,y,col,n,sp){if(LOWFX)n=Math.min(n||6,LOWFX===2?3:6);return _sp.call(this,x,y,col,n,sp);};}
{const _j=juice;let rings=0;juice=function(o){if(LOWFX&&o){if(o.k==='rays')return;if(o.k==='ring'&&++rings>1)return;}return _j.apply(this,arguments);};
 // the ultimate's own show, quieter
 const _cs=castShow;castShow=function(k){if(k!=='e')return _cs.apply(this,arguments);const f0=flashT;LOWFX=1;rings=0;try{return _cs.apply(this,arguments);}finally{LOWFX=0;flashT=f0;
  const sp=P&&SPELLS.e[P.lo.e];EDGEFX.col=(sp&&sp.c)||'#fff';EDGEFX.t0=time;}};}
// the blasts an ultimate calls down (meteors, arrows, the dragon's blasts...) shed only a little
{const _ub=ultBlast;ultBlast=function(){const f0=flashT;LOWFX=2;try{return _ub.apply(this,arguments);}finally{LOWFX=0;flashT=f0;}};}
// the glow at the screen edges
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);const k=(time-EDGEFX.t0)/.45;if(k<0||k>1||mode!=='play')return;
 const a=.32*(1-k),d=Math.round(10+6*k),{left,top,right,bottom}=visibleView();
 ctx.fillStyle=EDGEFX.col;
 for(let i=0;i<d;i++){
  ctx.globalAlpha=a*(1-i/d);
  ctx.fillRect(left,top+i,right-left,1);ctx.fillRect(left,bottom-1-i,right-left,1);
  ctx.fillRect(left+i,top,1,bottom-top);ctx.fillRect(right-1-i,top,1,bottom-top);
 }
 ctx.globalAlpha=1;};}
// legendary motes: about a third as many, a low cap
{const _lp=legPart;legPart=function(){if(Math.random()>.35)return;_lp.apply(this,arguments);if(LEGP.length>70)LEGP.splice(0,LEGP.length-70);};}
// no screen flash for the next moment after an ultimate, whichever part of it asks for one (Dragon Cleave's strike,
// Siegebreaker's blast...)
{const _u=update;update=function(dt){_u.apply(this,arguments);if(time-EDGEFX.t0<1.5&&flashT>0)flashT=0;};}
