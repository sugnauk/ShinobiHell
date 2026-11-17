'use strict';
// SHINOBIDUNGEONS - a guardian's defeat is a moment: it shudders and flashes, sinks to its knees and topples, bursting into
// embers, under a "GUARDIAN DEFEATED" letterbox banner. (Before, it simply vanished.)
let BOSSFALL=null;
{const _ob=onBossDead;onBossDead=function(e){try{const s=sprOf(e);if(s&&s.c&&s.fw){let fr=0;try{fr=s.pick?(s.pick(Object.assign({},e,{A:null,_hitT:time,storm:0,phx:null}))??0):0;}catch(_){}
  BOSSFALL={s,fr:s.frames>1?fr%s.frames:0,x:e.x,y:e.y,r:e.r,t:time,flip:(!!s.animal||!!s.bossSpr)&&sx(P.x,P.y)<sx(e.x,e.y),name:e.name,col:(typeof bsty==='function'&&bsty(e).c)||'#ffd040'};}}catch(_){}
 return _ob.apply(this,arguments);};}
function drawBossFall(){const B=BOSSFALL;if(!B)return;const k=time-B.t;if(k>2.2){BOSSFALL=null;return;}
 const s=B.s,X=sx(B.x,B.y)+(k<.6?(Math.floor(time*40)%2?1:-1):0),Y=sy(B.x,B.y)+Math.min(6,Math.round(B.r*.6))+2;
 // 0-0.6s: shudder and flash; 0.6-1.4s: sink and topple; then fade
 const f=clamp((k-.6)/.8,0,1),lean=Math.round(f*f*Math.min(16,s.fw*.3))*(B.flip?-1:1),rows=Math.round(f*s.fh*.45);
 ctx.globalAlpha=k<1.5?1:Math.max(0,1-(k-1.5)/.7);
 CUR={s,frame:B.fr,shear:lean,rows};try{drawSpr(s,X,Y,k<.6&&Math.floor(time*12)%2===0,B.fr,B.flip);}finally{CUR=null;}ctx.globalAlpha=1;
 if(k<.6&&Math.random()<.5)spark(B.x+rnd(-8,8),B.y+rnd(-6,6),B.col,2,40);
 if(!B.burst&&k>=.6){B.burst=1;spark(B.x,B.y,B.col,40,160);spark(B.x,B.y,'#fff',16,90);fxRing(B.x,B.y,40,B.col,.6);shake=Math.max(shake,8);}
 if(k>1&&k<1.6&&Math.random()<.6)particles.push({x:B.x+rnd(-12,12),y:B.y+rnd(-4,4),vx:rnd(-10,10),vy:-rnd(30,60),t:.8,col:pick([B.col,'#ffb040','#fff0c0'])});}
{const _dp=drawPortal;drawPortal=function(){drawBossFall();return _dp.apply(this,arguments);};}
// the banner across the letterbox
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);const B=BOSSFALL;if(!B)return;const k=time-B.t;if(k<.3)return;
 const a=Math.min(1,(k-.3)/.25,(2.2-k)/.3),bar=Math.round(H*.1*a);ctx.fillStyle='#000';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
 if(a>.6){ctx.globalAlpha=(a-.6)/.4;const s1='GUARDIAN DEFEATED',s2=B.name||'';txt(s1,Math.round((W-txtW(s1,2))/2),H-bar+Math.round((bar-14)/2),'#ffd040',2);txt(s2,Math.round((W-txtW(s2))/2),Math.round(bar/2)-3,'#ddd');ctx.globalAlpha=1;}};}

// let the fall play out before the reward cards cover the screen
{const _ob2=onBossDead;onBossDead=function(e){const r=_ob2.apply(this,arguments);setTimeout(()=>{if(mode==='play'&&portal&&portal.pending)mode='choose';},2300);return r;};}
{const _r=render;render=function(){if(mode==='choose'&&BOSSFALL&&time-BOSSFALL.t<2.1)mode='play';return _r();};}
