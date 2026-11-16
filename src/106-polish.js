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
