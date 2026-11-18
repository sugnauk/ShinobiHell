'use strict';
// SHINOBIDUNGEONS - interactables come alive with particles instead of markers. The pillar of light, ground ring and
// bobbing icon over shrines, springs, chests, gongs and cages are gone; like the blood shrine, each now gives itself
// away with its own gentle particles in its own colour, and goes quiet once used:
//  shrine  spirit motes rise in the spirit's colour, with the odd twinkle over the offering table
//  spring  bubbles rise from the water and a cool mist drifts off it, with sparkles on the surface
//  chest   gold glints wink around the lid (red embers while it is still sealed by the room's guards)
//  gong    a soft golden hum of sparks rises from the disc
//  cage    the prisoner's colour drifts up through the bars
// Only things near you emit, and only a few motes at a time.
imarkKind=function(){return null;};
const IM_PART=(x,y,vx,vy,t,col)=>particles.push({x,y,vx,vy,t,col});
function imEmit(p,dt){const r=Math.random;
 if(p.k==='altar'&&p.god&&!p.curse){const c=GODS[p.god]?GODS[p.god].c:'#c6f';
  if(r()<dt*7)IM_PART(p.x+rnd(-12,12),p.y+rnd(-8,8),rnd(-3,3),-rnd(12,22),rnd(.9,1.4),r()<.75?c:'#ffffff');
  if(r()<dt*2.5)IM_PART(p.x+rnd(-8,8),p.y-rnd(2,8),0,-6,.35,'#ffffff');}
 else if(p.k==='spring'){
  if(r()<dt*12)IM_PART(p.x+rnd(-14,14),p.y+rnd(-14,14),rnd(-2,2),-rnd(10,18),rnd(.8,1.2),r()<.6?'#8fffc0':'#e0fff0');
  if(r()<dt*3)IM_PART(p.x+rnd(-20,20),p.y+rnd(-20,20),rnd(-8,8),-rnd(2,5),rnd(1.2,1.8),'#a8e8d0');
  if(r()<dt*3)IM_PART(p.x+rnd(-12,12),p.y+rnd(-12,12),0,-3,.25,'#ffffff');}
 else if(p.k==='chest'){const sealed=typeof chestLocked==='function'&&chestLocked(p);
  if(r()<dt*(sealed?4:8))IM_PART(p.x+rnd(-9,9),p.y+rnd(-5,3),rnd(-3,3),-rnd(sealed?6:8,sealed?12:16),rnd(.5,.9),sealed?(r()<.6?'#ff5040':'#a02020'):(r()<.6?'#ffd040':'#fff6c0'));}
 else if(p.k==='gong'){if(r()<dt*4)IM_PART(p.x+rnd(-7,7),p.y+rnd(-3,3),rnd(-6,6),-rnd(10,18),rnd(.6,1),r()<.6?'#ffc040':'#fff0a0');}
 else if(p.k==='cage'&&typeof ALLIES!=='undefined'&&ALLIES[p.ally]){if(r()<dt*4)IM_PART(p.x+rnd(-9,9),p.y+rnd(-4,4),rnd(-2,2),-rnd(10,16),rnd(.8,1.2),r()<.7?ALLIES[p.ally].c:'#ffffff');}}
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!P||!props)return;
 for(const p of props){if(p.used||p.sold||(p.k==='cage'&&p.used))continue;if(Math.abs(p.x-P.x)>260||Math.abs(p.y-P.y)>260)continue;imEmit(p,dt);}};}
