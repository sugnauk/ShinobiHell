'use strict';
// ===== INTERACTABLES YOU CAN SEE FROM ACROSS THE ROOM =====
// Shrines, curse altars, springs, treasure chests and challenge gongs blended into the floor. Each unused one now has a
// marker in its own colour: a soft pillar of light rising from it, a pulsing ring on the floor and a bobbing icon above
// (a lotus for a shrine, a skull for a curse, a droplet for a spring, a coin for a chest, a drum-strike for a gong). The
// marker fades away once you have used it.
const IMARK={
 shrine:{c:p=>GODS[p.god]?GODS[p.god].c:'#c6f',ico:'shrine'},curse:{c:()=>'#ff4050',ico:'skull'},spring:{c:()=>'#60e080',ico:'drop'},
 chest:{c:()=>'#ffd040',ico:'coin'},gong:{c:()=>'#ffc040',ico:'gong'}};
function imarkKind(p){if(p.used)return null;if(p.k==='altar')return p.curse?'curse':p.god?'shrine':null;if(p.k==='spring')return 'spring';if(p.k==='chest')return 'chest';if(p.k==='gong')return 'gong';return null;}
function imarkIcon(kind,x,y,c){const O='#14101a';
 if(kind==='shrine'){ctx.fillStyle=O;ctx.fillRect(x-4,y-3,9,7);ctx.fillStyle=c;ctx.fillRect(x-3,y,7,2);ctx.fillRect(x-1,y-2,3,3);ctx.fillRect(x-3,y-1,1,1);ctx.fillRect(x+3,y-1,1,1);ctx.fillStyle='#ffffff';ctx.fillRect(x,y-2,1,1);}
 else if(kind==='skull'){ctx.fillStyle=O;ctx.fillRect(x-4,y-4,9,9);ctx.fillStyle='#f0e8e0';ctx.fillRect(x-3,y-3,7,5);ctx.fillRect(x-2,y+2,5,2);ctx.fillStyle=c;ctx.fillRect(x-2,y-1,2,2);ctx.fillRect(x+1,y-1,2,2);ctx.fillStyle=O;ctx.fillRect(x-1,y+3,1,1);ctx.fillRect(x+1,y+3,1,1);}
 else if(kind==='drop'){ctx.fillStyle=O;ctx.fillRect(x-3,y-4,7,9);ctx.fillRect(x-1,y-5,3,1);ctx.fillStyle=c;ctx.fillRect(x-2,y-1,5,4);ctx.fillRect(x-1,y-3,3,2);ctx.fillRect(x,y-4,1,1);ctx.fillStyle='#e0ffe8';ctx.fillRect(x-1,y,1,2);}
 else if(kind==='coin'){ctx.fillStyle=O;ctx.fillRect(x-4,y-4,9,9);ctx.fillStyle=c;ctx.fillRect(x-3,y-3,7,7);ctx.fillStyle='#fff6c0';ctx.fillRect(x-2,y-3,3,1);ctx.fillRect(x-3,y-2,1,2);ctx.fillStyle=O;ctx.fillRect(x-1,y-1,3,3);}
 else{ctx.fillStyle=O;ctx.fillRect(x-4,y-4,9,9);ctx.fillStyle=c;ctx.fillRect(x-3,y-3,7,7);ctx.fillStyle='#fff6c0';ctx.fillRect(x-1,y-1,3,3);ctx.fillStyle=O;ctx.fillRect(x+4,y-6,1,3);ctx.fillRect(x+3,y-7,3,1);}}
{const _dp=drawProp;drawProp=function(p){const kind=imarkKind(p);if(!kind)return _dp(p);const M=IMARK[kind],c=M.c(p),X=sx(p.x,p.y),Y=sy(p.x,p.y),ph=time*3+p.x*.01,pulse=.5+.5*Math.sin(ph);
  // the ring on the floor and the pillar of light, behind the prop
  ctx.globalAlpha=.35+.25*pulse;wcirc(p.x,p.y,12+pulse*3,c);ctx.globalAlpha=.18;wdisc(p.x,p.y,10,c);
  for(let i=0;i<34;i++){ctx.globalAlpha=(1-i/34)*.16*(.7+.3*pulse);ctx.fillStyle=c;ctx.fillRect(X-4+Math.round(Math.sin(i*.4+ph)*.5),Y-6-i*2,9,2);ctx.fillStyle='#ffffff';ctx.globalAlpha*=.6;ctx.fillRect(X-1,Y-6-i*2,3,2);}
  ctx.globalAlpha=1;_dp(p);
  // the icon, bobbing above, and a few motes rising
  const iy=Y-48+Math.round(Math.sin(ph)*2);imarkIcon(M.ico,X,iy,c);
  for(let i=0;i<3;i++){const k=((time*.6+i/3+p.x*.003)%1);ctx.globalAlpha=1-k;ctx.fillStyle=c;ctx.fillRect(X-6+i*6,Math.round(Y-4-k*30),1,2);}ctx.globalAlpha=1;};}
