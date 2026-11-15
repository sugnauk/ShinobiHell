'use strict';
// HELL OF THE EMPEROR - main loop and debug hook (part of the former game.js; files load in numeric order, see index.html)
// ---------- loop ----------
let last=performance.now();
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;try{update(dt);render();}catch(e){console.error(e);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);txt('ERROR: '+e.message,4,4,'#f55');}requestAnimationFrame(loop);}
requestAnimationFrame(loop);
// debug hook for testing
window.__dbg={start:d=>{meta.reached=9;meta.tut3=true;startRun(d||0);},state:()=>({mode,enemies:enemies.length,hp:P&&P.hp,boss:!!boss}),killBoss:()=>{if(boss){boss.hp=1;hurtE(boss,5,0,{});}},teleportBoss:()=>{const r=map.bossRoom;P.x=(r.x+2)*T;P.y=(r.y+r.h/2)*T;},god:()=>{P.hp=9999;S.maxhp=9999;}};
