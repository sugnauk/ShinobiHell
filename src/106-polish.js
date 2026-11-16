'use strict';
// ===== POLISH: fairness and readability in the bullet hell =====
// - MERCY: after a bullet hits you, bullets can't hurt you for a third of a second and the ones touching you shatter.
//   A tight cluster used to land three or four hits in a few frames; now one mistake costs one hit.
// - BULLET CONTRAST (option): enemy bullets get a dark rim and a bright core, so they stand out on busy floors.
// - DANGER EDGE: enemy bullets close to you but still off screen show as small red ticks at the screen edge.
{const _hp=hitPlayer;hitPlayer=function(raw,sx2,sy2,o){o=o||{};
 if(o.bullet&&P&&P.mercy>0)return 'dodge';
 const r=_hp(raw,sx2,sy2,o);
 if(r==='hit'&&o.bullet&&P){P.mercy=.33;let n=0;for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;if(Math.hypot(q.x-P.x,q.y-P.y)<24){q.dead=true;n++;spark(q.x,q.y,q.col||'#fff',2,40);}}
  if(n)fxRing(P.x,P.y,24,'#ffffff',.18);}
 return r;};}
{const _up=updPlayer;updPlayer=function(dt){if(P&&P.mercy>0)P.mercy-=dt;return _up.apply(this,arguments);};}

// bullet contrast
{const _dp=drawProj;drawProj=function(q){if(q.from==='e'&&!q.dead&&OPT().bcon){const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,r=Math.max(2,(q.r||3)+1);
  if(X>-8&&X<W+8&&Y>-8&&Y<H+8){ctx.fillStyle='#07040a';ctx.fillRect(X-r-1,Y-r-1,r*2+3,r*2+3);}}
 _dp(q);
 if(q.from==='e'&&!q.dead&&OPT().bcon){const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7;if(X>-4&&X<W+4&&Y>-4&&Y<H+4){ctx.fillStyle='#ffffff';ctx.fillRect(X,Y,1,1);}}};}
// danger edge: bullets near you but off screen show as red ticks on the edge they will come from
{const _hud=drawHUD;drawHUD=function(){_hud.apply(this,arguments);if(!P||!R||R.training)return;let n=0;
 for(const q of projs){if(q.from!=='e'||q.dead)continue;const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7;if(X>=0&&X<W&&Y>=0&&Y<H)continue;if(Math.hypot(q.x-P.x,q.y-P.y)>180)continue;
  const cx=clamp(X,2,W-4),cy=clamp(Y,2,H-4);ctx.fillStyle=Math.floor(time*8)%2?'#ff5050':'#ff9090';ctx.fillRect(cx,cy,2,2);if(++n>40)break;}};}

// ---------- the portal (and boss loot) never lands inside a wall ----------
// They appear where the guardian fell, which can be against a wall, inside an arena block, or under the Ronin Seven's
// invisible coordinator. If that spot is blocked, move to the nearest open floor (preferring spots you can see).
function openSpotNear(x,y,rad){if(!blocked(x,y,rad))return {x,y};
 for(let r=8;r<=200;r+=6){let best=null;for(let a=0;a<24;a++){const an=a/24*TAU,nx=x+Math.cos(an)*r,ny=y+Math.sin(an)*r;if(blocked(nx,ny,rad))continue;const s=P&&los(nx,ny,P.x,P.y)?0:1;if(!best||s<best.s)best={x:nx,y:ny,s};}
  if(best)return {x:best.x,y:best.y};}return {x,y};}
function unstickPortal(){if(!portal)return;if(blocked(portal.x,portal.y,9)){const s=openSpotNear(portal.x,portal.y,9);portal.x=s.x;portal.y=s.y;}
 for(const k of pickups)if(!k.dead&&solid(k.x,k.y)){const s=openSpotNear(k.x,k.y,4);k.x=s.x;k.y=s.y;}}
{const _ob=onBossDead;onBossDead=function(e){const r=_ob.apply(this,arguments);unstickPortal();return r;};}
{const _up=updPlay;updPlay=function(dt){_up.apply(this,arguments);if(portal&&map&&blocked(portal.x,portal.y,9))unstickPortal();};}
