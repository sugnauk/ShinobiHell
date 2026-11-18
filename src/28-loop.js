'use strict';
// HELL OF THE EMPEROR - main loop and debug hook (part of the former game.js; files load in numeric order, see index.html)
// ---------- loop ----------
// Each display callback can draw at most once, with deadlines paced at 60 Hz. Simulation uses elapsed time.
// Long stalls are split into steps of at most 1/30 s, and anything past 0.1 s is dropped, so the game never leaps ahead.
const FRAME_MS=1000/60,MAX_STEP=1000/30,MAX_GAP=100;
let nextFrame=null,lastFrame=null,lastDraw=null,RDT=1/60; // RDT: seconds since the last drawn frame, for timers that live in the drawing code
function loop(now){
 requestAnimationFrame(loop);
 if(nextFrame===null)nextFrame=now;
 if(now+.75<nextFrame)return;
 nextFrame+=Math.max(1,Math.floor((now-nextFrame)/FRAME_MS)+1)*FRAME_MS;
 if(lastFrame===null)lastFrame=now-FRAME_MS;
 let gap=Math.min(MAX_GAP,Math.max(0,now-lastFrame));lastFrame=now;RDT=gap/1000;
 try{
  while(gap>0){const step=Math.min(MAX_STEP,gap);gap-=step;update(step/1000);}
  if(lastDraw!==null&&lastDraw<now&&meta.opt.dbg)DBG.fps=DBG.fps*.95+(1000/(now-lastDraw))*.05;
  lastDraw=now;render();
 }catch(e){console.error(e);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);txt('ERROR: '+e.message,4,4,'#f55');}
}
requestAnimationFrame(loop);
// debug hook for testing
window.__dbg={start:d=>{meta.reached=9;meta.tut3=true;startRun(d||0);},state:()=>({mode,enemies:enemies.length,hp:P&&P.hp,boss:!!boss}),killBoss:()=>{if(boss){boss.hp=1;hurtE(boss,5,0,{});}},teleportBoss:()=>{const r=map.bossRoom;P.x=(r.x+2)*T;P.y=(r.y+r.h/2)*T;},god:()=>{P.hp=9999;S.maxhp=9999;}};
