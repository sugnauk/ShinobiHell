'use strict';
// ===== READABLE BULLETS =====
// In a bullet hell every enemy shot must read instantly on any floor. Thin styles (arrows, kunai, spears, silk, lances,
// shuriken, stars, the hollow ring, rice grains) were drawn with 1-pixel lines, and the harmless illusion shots as faint
// translucent rings. Now:
//  - thin styles are drawn thicker (an extra pass one pixel over) with a solid core in their colour;
//  - harmless illusion shots are solid, opaque hollow rings with a dark edge: still hollow (hollow = harmless), but clear.
const THIN_ST=new Set(['accel','curve','boom','star','lance','seek','bounce','zig','orbit']);
const THIN_SPR=new Set(['arrow','silk','spear','kunai','shuriken','charm','chainlink','blade','scale','petal','crane']);
{const _dp=drawProj;drawProj=function(q){
  if(q.from!=='e'||q.dead)return _dp(q);
  const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,view=sceneBounds;
  if(X<view.left-40||X>view.right+40||Y<view.top-40||Y>view.bottom+40)return _dp(q);
  const thin=(q.st&&THIN_ST.has(q.st))||(q.spr&&THIN_SPR.has(q.spr))||q.arrow||q.crescent,waiting=q.st==='lance'&&q.wait>0;
  if(thin&&!waiting){ctx.save();ctx.translate(1,0);_dp(q);ctx.restore();ctx.save();ctx.translate(0,1);_dp(q);ctx.restore();}
  _dp(q);
  if(thin&&!waiting){ctx.fillStyle=q.col||'#ff4a3a';ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle='#ffffff';ctx.fillRect(X,Y,1,1);}};}
// harmless illusion shots: a solid hollow ring, fully opaque, with a dark edge
drawFakes=function(){for(const q of fakes){const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,r=Math.max(3,Math.round(q.r||3))+1;
  circ(X,Y,r+1,'#0a0610');circ(X,Y,r,q.col);circ(X,Y,r-1,q.col);circ(X,Y,r-2,'#0a0610');}};
