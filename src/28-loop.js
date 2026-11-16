'use strict';
// HELL OF THE EMPEROR - main loop and debug hook (part of the former game.js; files load in numeric order, see index.html)
// ---------- loop ----------
const FRAME_MS=1000/60,MAX_FRAME_DEBT=FRAME_MS*3;
let lastFrame=null,lastDraw=null,frameDebt=0;
function loop(now){
 requestAnimationFrame(loop);
 if(lastFrame===null)lastFrame=now-FRAME_MS;
 frameDebt=Math.min(MAX_FRAME_DEBT,frameDebt+now-lastFrame);lastFrame=now;
 if(frameDebt+1e-6<FRAME_MS)return;
 try{
  // Simulate missed ticks after a brief stall. Draw once, even on a 120/144 Hz display.
  while(frameDebt+1e-6>=FRAME_MS){frameDebt-=FRAME_MS;update(FRAME_MS/1000);}
  if(lastDraw!==null&&lastDraw<now&&meta.opt.dbg)DBG.fps=DBG.fps*.95+(1000/(now-lastDraw))*.05;
  lastDraw=now;render();
 }catch(e){console.error(e);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);txt('ERROR: '+e.message,4,4,'#f55');}
}
requestAnimationFrame(loop);
// debug hook for testing
window.__dbg={start:d=>{meta.reached=9;meta.tut3=true;startRun(d||0);},state:()=>({mode,enemies:enemies.length,hp:P&&P.hp,boss:!!boss}),killBoss:()=>{if(boss){boss.hp=1;hurtE(boss,5,0,{});}},teleportBoss:()=>{const r=map.bossRoom;P.x=(r.x+2)*T;P.y=(r.y+r.h/2)*T;},god:()=>{P.hp=9999;S.maxhp=9999;}};
