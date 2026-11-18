'use strict';
// SHINOBIDUNGEONS - IAI CLEAVE (the samurai's RMB) is a short dash with a cut: the samurai darts forward along the aim,
// untouchable for the moment it lasts, and every foe on the way (and just ahead of the blade) is cut once. A full charge
// also cuts the enemy shots the dash passes through. When the dash ends, the cut shows as one white line.
const IAI_REACH=48;
{const _u=update;update=function(dt){_u.apply(this,arguments);const p=P;if(!p||!p.iai||mode!=='play')return;const I=p.iai;I.t-=dt;
 const sx0=I.lx,sy0=I.ly,seg=Math.hypot(p.x-sx0,p.y-sy0);
 lineHit(sx0,sy0,I.a,seg+IAI_REACH,14,e=>{if(I.hit.has(e))return;I.hit.add(e);hurtE(e,I.dm,45,{slash:true,kb:I.a,src:'h'});spark(e.x,e.y,'#fff',3,60);});
 if(I.full)for(const q of projs)if(q.from==='e'&&!q.peril&&!q.dead&&Math.hypot(q.x-p.x,q.y-p.y)<16){q.dead=true;spark(q.x,q.y,'#ffe080',3,40);}
 I.lx=p.x;I.ly=p.y;
 if(I.t<=0||!(p.dash>0)){p.iai=null;const len=Math.hypot(p.x-I.x0,p.y-I.y0)+IAI_REACH;
  fx.push({k:'line',x:I.x0,y:I.y0,a:I.a,len,t:.18,dur:.18,col:I.full?'#ffe080':'#fff'});sfx('slash');impact(p.x+Math.cos(I.a)*10,p.y+Math.sin(I.a)*10,'#fff',3);if(I.hit.size)shake=Math.max(shake,2);}};}
{const _ld=loadDungeon;loadDungeon=function(){if(P)P.iai=null;return _ld.apply(this,arguments);};}
