'use strict';
// SHINOBIDUNGEONS - guardian hitboxes match their sprites. A guardian stands ~80px tall on screen but its hit circle sat
// at its feet, so shots that clearly struck the body or head flew through. Now:
//  - each sprite's solid CORE is measured once (columns that are mostly body, ignoring thin spears, banners and wires)
//  - a shot hits a guardian if it overlaps that core on screen, as well as by the old circle at the feet
//  - beams, cones and shockwaves use a radius as wide as the core, so area attacks agree with what you see
const HBC=new WeakMap();
function spriteCore(s,fr){let m=HBC.get(s);if(!m){m={};HBC.set(s,m);}if(m[fr])return m[fr];
 const fw=s.fw,fh=s.fh,c=document.createElement('canvas');c.width=fw;c.height=fh;const g=c.getContext('2d');g.drawImage(s.c,fr*fw,0,fw,fh,0,0,fw,fh);
 const d=g.getImageData(0,0,fw,fh).data,col=new Array(fw).fill(0);let top=fh,bot=0;
 for(let x=0;x<fw;x++)for(let y=0;y<fh;y++)if(d[(y*fw+x)*4+3]>40)col[x]++;
 const mx=Math.max(1,...col),keep=col.map(n=>n>=mx*.4);let x0=keep.indexOf(true),x1=keep.lastIndexOf(true);if(x0<0){x0=0;x1=fw-1;}
 for(let x=x0;x<=x1;x++)for(let y=0;y<fh;y++)if(d[(y*fw+x)*4+3]>40){top=Math.min(top,y);bot=Math.max(bot,y);}
 return m[fr]={x0,x1,top,bot,fw,fh};}
// the core's rectangle on screen for this guardian, as drawn right now
function bossCoreRect(e){const s=sprOf(e);if(!s||!s.c||!s.fw)return null;let fr=0;try{fr=s.pick?s.pick(e)||0:0;}catch(_){}fr=s.frames>1?fr%s.frames:0;
 const k=spriteCore(s,fr),sc=s.sc||1,X=sx(e.x,e.y),Y=sy(e.x,e.y)+Math.min(6,Math.round(e.r*.6))+2-(e.z||0);
 const flip=(!!s.animal||!!s.bossSpr)&&sx(P.x,P.y)<X,left=X-Math.round(s.fw*sc/2),dy=Y-Math.round(s.fh*sc);
 let a=left+k.x0*sc,b=left+(k.x1+1)*sc;if(flip){const a2=2*X-b,b2=2*X-a;a=a2;b=b2;}
 const pad=2; // a little forgiveness inside the outline
 return {x0:a+pad,x1:b-pad,y0:dy+k.top*sc+pad,y1:dy+(k.bot+1)*sc,w:(b-a)};}
function bossBodyHit(q,e){if(e.dead||e.air||e.iv>0&&false)return false;const r=bossCoreRect(e);if(!r)return false;const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,qr=Math.max(1,(q.r||2)*.8);
 return X+qr>=r.x0&&X-qr<=r.x1&&Y+qr>=r.y0&&Y-qr<=r.y1;}
// area attacks: guardians count as wide as their core while these run
const bossReach=e=>{const r=bossCoreRect(e);return r?Math.max(e.r,Math.round(r.w*.4)):e.r;};
for(const nm of ['lineHit','coneHit','shockwave']){const f=globalThis[nm];if(typeof f!=='function')continue;
 globalThis[nm]=function(){const sw=[];for(const e of enemies)if(e.boss&&!e.dead){sw.push([e,e.r]);e.r=bossReach(e);}try{return f.apply(this,arguments);}finally{for(const [e,r] of sw)e.r=r;}};}
