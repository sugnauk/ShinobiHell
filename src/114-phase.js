'use strict';
// ===== PHASE CHANGE: a transformation you watch in the fight, not a cutscene =====
// When a guardian crosses half health: every enemy bullet shatters, the guardian stops and becomes untouchable, the
// camera pulls over to frame it, and over about two seconds it trembles, flashes, draws energy in and then erupts into its
// second form with a shockwave that pushes you back. You keep full control the whole time.
const PHDUR=2.2;
let phaseCam=null,phaseBanner=null;
{const _dh=doHalf;
 doHalf=function(e,K){if(e.phx||e.half)return;
  e.phx={t:0,K,col:bsty(e).c};clearEnemyShots(false,1);if(typeof BMK!=='undefined')BMK.length=0;cancelAtk(e);e.brq=[];e.iv=999;e.kx=e.ky=0;
  phaseCam={e,t:0};sfx('boss');shake=Math.max(shake,4);
  for(let i=0;i<14;i++){const a=i/14*TAU;fx.push({k:'burst',x:e.x+Math.cos(a)*8,y:e.y+Math.sin(a)*8,t:.25,dur:.25,r:14,n:6,a0:a,col:e.phx.col});}};
 // while a transformation runs it owns the boss's frame: nothing fires, the arena stays clear, then the second form arrives
 const _pg=phaseGate;phaseGate=function(e,K,dt){const X=e.phx;if(!X)return _pg.apply(this,arguments);
  X.t+=dt;e.iv=999;e.A=null;e.tele=0;e.brq=[];for(const q of projs)if(q.from==='e'&&!q.dead){q.dead=true;spark(q.x,q.y,q.col||'#fff',1,30);}
  // energy spirals in
  if(X.t>.4&&X.t<PHDUR-.2&&Math.random()<dt*40){const a=Math.random()*TAU,r=rnd(50,80);particles.push({x:e.x+Math.cos(a)*r,y:e.y+Math.sin(a)*r,vx:-Math.cos(a)*r*1.6,vy:-Math.sin(a)*r*1.6,t:.55,col:Math.random()<.5?X.col:'#ffffff'});}
  e.flash=X.t>.6&&Math.floor(X.t*(6+X.t*6))%2?.05:0;
  if(X.t>=PHDUR){delete e.phx;e.iv=0;_dh(e,K);
   // the eruption
   fxRing(e.x,e.y,120,X.col,.7);fxRing(e.x,e.y,70,'#ffffff',.45);spark(e.x,e.y,X.col,40,180);spark(e.x,e.y,'#fff',16,120);flashT=Math.max(flashT,.18);
   if(P){const d=Math.hypot(P.x-e.x,P.y-e.y);if(d<70){const a=Math.atan2(P.y-e.y,P.x-e.x),k=(70-d)*.9;move(P,Math.cos(a)*k,Math.sin(a)*k,4);}}
   phaseBanner={t:0,text:'PHASE II',sub:(K.halfName||'ENRAGED'),col:X.col};}
  return true;};}
// the boss trembles while it changes
{const _de=drawEnemy;drawEnemy=function(e){if(!e.phx)return _de.apply(this,arguments);const X=e.phx,amp=Math.min(2.5,X.t*1.6),ox=e.x,oy=e.y;
 e.x+=Math.sin(time*70)*amp*.6;e.y+=Math.cos(time*55)*amp*.3;_de.apply(this,arguments);e.x=ox;e.y=oy;
 // tightening rings around it
 const sx0=sx(e.x,e.y),sy0=sy(e.x,e.y)-12;ctx.strokeStyle=X.col;for(let i=0;i<3;i++){const p=((X.t*1.2+i/3)%1),r=40*(1-p)+6;ctx.globalAlpha=p*.8;ctx.beginPath();ctx.ellipse(sx0,sy0,r,r*.6,0,0,TAU);ctx.stroke();}ctx.globalAlpha=1;};}
// the camera eases over to frame the guardian (and eases back), without pausing the fight
{const _rp=renderPlay;renderPlay=function(){const C=phaseCam;if(!C||!C.e||C.e.dead){phaseCam=null;return _rp.apply(this,arguments);}
 const span=PHDUR+.8,t=C.t=Math.min(span,C.t+(paused?0:RDT)),g=Math.min(1,t/.45,(span-t)/.6);if(t>=span){phaseCam=null;return _rp.apply(this,arguments);}
 const oT=introT,oE=introE;introE={x:P.x+(C.e.x-P.x)*.8,y:P.y+(C.e.y-P.y)*.8,camOnly:1};introT=Math.max(.001,g*.5);
 try{_rp.apply(this,arguments);}finally{introT=oT;introE=oE;}};}
{const _di=drawIntro;drawIntro=function(){if(introE&&introE.camOnly)return;return _di.apply(this,arguments);};}
// "PHASE II" banner across the middle of the screen
{const _dre=drawRoomEvents;drawRoomEvents=function(){_dre.apply(this,arguments);const B=phaseBanner;if(!B)return;B.t+=paused?0:RDT;if(B.t>2){phaseBanner=null;return;}
 const a=Math.min(1,B.t/.2,(2-B.t)/.4),w=Math.round(W*Math.min(1,B.t/.25));ctx.globalAlpha=a;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(Math.round((W-w)/2),H/2-26,w,28);ctx.fillStyle=B.col;ctx.fillRect(Math.round((W-w)/2),H/2-26,w,1);ctx.fillRect(Math.round((W-w)/2),H/2+1,w,1);
 txt(B.text,Math.round((W-txtW(B.text,2))/2),H/2-22,'#fff',2);txt(B.sub,Math.round((W-txtW(B.sub))/2),H/2-7,B.col);ctx.globalAlpha=1;};}
// nobody fires while a guardian transforms (its minions and turrets hold too)
{const _es=enemyShoot;enemyShoot=function(e){if(boss&&boss.phx&&!e.lantern)return;return _es.apply(this,arguments);};}
{const _mk=mark;mark=function(o){if(boss&&boss.phx)return {x:0,y:0,t:0,dead:true};return _mk.apply(this,arguments);};}
{const _mp=mkProj;mkProj=function(from){const q=_mp.apply(this,arguments);if(from==='e'&&boss&&boss.phx)q.dead=true;return q;};}
