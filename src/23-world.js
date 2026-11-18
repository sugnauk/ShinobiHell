'use strict';
// HELL OF THE EMPEROR - world simulation (part of the former game.js; files load in numeric order, see index.html)
// ---------- world simulation: zones, hazards, delayed strikes, traps, buffs ----------
function updWorld(dt){
 const p=P;
 if(freezeT>0)freezeT-=dt;
 if(p.hot>0){p.hot-=dt;p.hp=Math.min(S.maxhp,p.hp+p.hotAmt*dt);}
 if(p.haste>0)p.haste-=dt;if(p.guardSt>0)p.guardSt-=dt;if(p.rage>0)p.rage-=dt;if(p.shieldT>0){p.shieldT-=dt;if(p.shieldT<=0)p.shieldHp=0;}
 if(p.storm>0){p.storm-=dt;p.stormT-=dt;if(p.stormT<=0){p.stormT=.12;p.stormA+=.42;const dm=S.atk*.65*(1+.25*S.epow)*AP();for(let i=0;i<6;i++){const a=p.stormA+i*TAU/6;projs.push(mkProj('p',p.x,p.y,a,190,dm,{r:3,pd:6,life:.7,col:'#ff8a30',pierce:1+(abFx('e').pierce||0),main:true,src:'e'}));}sfx('shoot');}}
 for(const z of zones){if(z.t<=0)continue;castSrc=z.src||null;z.t-=dt;z.tk-=dt;const tick=z.tk<=0;if(z.k&&CZ[z.k]){CZ[z.k](z,dt,tick);continue;}
  if(z.k==='grav'){ // pull non-bosses toward the centre, detonate on expiry
   if(tick)z.tk=.3;
   for(const e of enemies){if(e.dead||e.air)continue;const d=Math.hypot(e.x-z.x,e.y-z.y);if(d<z.r+e.r&&los(z.x,z.y,e.x,e.y)){e.zs=z.hole?.3:.5;const pull=e.boss?(z.hole?28:0):(z.hole?130:80);if(pull&&d>4){const a=Math.atan2(z.y-e.y,z.x-e.x);move(e,Math.cos(a)*pull*dt,Math.sin(a)*pull*dt,e.r);}if(tick)hurtE(e,z.dm*.06,z.hole?6:2,{nost:true});}}
   if(z.hole){for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-z.x,q.y-z.y)<z.r){const a=Math.atan2(z.y-q.y,z.x-q.x);q.vx+=Math.cos(a)*400*dt;q.vy+=Math.sin(a)*400*dt;if(Math.hypot(q.x-z.x,q.y-z.y)<10){q.dead=true;spark(z.x,z.y,'#c080ff',2,30);}}
    if(Math.random()<dt*20){const a=Math.random()*TAU;particles.push({x:z.x+Math.cos(a)*z.r,y:z.y+Math.sin(a)*z.r,vx:-Math.cos(a)*z.r*1.6,vy:-Math.sin(a)*z.r*1.6,t:.55,col:pick(['#c080ff','#fff','#529'])});}}
   if(z.t<=0&&z.hole){impact(z.x,z.y,'#c080ff',12,true);hitstop=Math.max(hitstop,.1);sfx('break');sfx('boss');}
   if(z.t<=0){shake=Math.max(shake,8);hitstop=Math.max(hitstop,.06);sfx('break');fxRing(z.x,z.y,z.r,'#a6f',.4);fxRing(z.x,z.y,z.r*.5,'#fff',.3);spark(z.x,z.y,'#a6f',30,140);for(const e of enemies){if(e.dead||e.air)continue;if(los(z.x,z.y,e.x,e.y)&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r)hurtE(e,z.dm,45,{slash:true,kb:Math.atan2(e.y-z.y,e.x-z.x)});}}
   continue;
  }
  if(z.k==='totem'){ // zap the nearest foe in range
   if(tick){z.tk=.45;let best=null,bd=z.r;for(const e of enemies){if(e.dead||e.air||!los(z.x,z.y,e.x,e.y))continue;const d=Math.hypot(e.x-z.x,e.y-z.y);if(d<bd){bd=d;best=e;}}
    if(best){fx.push({k:'bolt',pts:[{x:z.x,y:z.y-1},{x:best.x,y:best.y}],t:.15,dur:.15});hurtE(best,z.dm,10,{slash:true,el:'shock'});sfx('shoot');}}
   continue;
  }
  if(tick)z.tk=.35;for(const e of enemies){if(e.dead||e.air)continue;if(los(z.x,z.y,e.x,e.y)&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){e.zs=e.boss?.6:.35;if(tick){hurtE(e,z.dm||S.atk*.3,3,{nost:true});if(Math.random()<.35)applyStatus(e,'chill');}}}}
 castSrc=null;zones=zones.filter(z=>z.t>0);
 if(freezeT<=0){for(const d of dh){d.t-=dt;if(d.t<=0){d.dead=true;fxRing(d.x,d.y,d.r,d.col||'#f55',.25);spark(d.x,d.y,d.col||'#f55',8,70);shake=Math.max(shake,2);if(Math.hypot(P.x-d.x,P.y-d.y)<d.r+3)hitPlayer(d.dmg,d.x,d.y,{peril:true,src:d.own,cause:d.own?undefined:'FALLING PROJECTILE'});}}dh=dh.filter(d=>!d.dead);}
 for(const h of hz){h.t-=dt;if(Math.hypot(P.x-h.x,P.y-h.y)<h.r+3)hitPlayer(h.dps*.5,h.x,h.y,{peril:true,src:h.own,cause:h.cor?'CORRUPTION POOL':h.own?undefined:'LINGERING HAZARD'});}
 hz=hz.filter(h=>h.t>0);
 {const lq=liqAt(P.x,P.y);if((lq===2||lq===3)&&P.dash<=0&&P.iv<=0){const r=hitPlayer(lq===2?7+R.di:4+R.di*.6,P.x,P.y,{peril:true,cause:lq===2?'LAVA':'POISON POOL'});if(r!=='dodge'){txtFx(P.x,P.y,lq===2?'BURNING':'POISON',lq===2?'#f80':'#c6f');P.iv=.6;}}}
 if(traps.length){const ptx=P.x/T|0,pty=P.y/T|0;for(const t of traps)if(t.tx===ptx&&t.ty===pty&&trapState(t)===2){hitPlayer(10*(1+.15*R.di),P.x,P.y,{peril:true,cause:'FLOOR TRAP'});break;}}
}
