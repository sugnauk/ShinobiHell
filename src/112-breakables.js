'use strict';
// ===== BREAKABLE PROPS AND POWDER KEGS =====
// Barrels, crates, vases, urns and rice bales break when your attacks hit them (shots, slashes, blasts), sometimes
// spilling gold or a potion. Red powder kegs (on the war-camp, burnt-town and rampart stages) explode when hit: they hurt
// every foe around them, and you too if you are standing next to one.
const BREAKABLE={barrel:1,crate:1,crates:1,taru:1,vase:1,urn:1,ricebale:1,powderkeg:1};
defDeco('powderkeg',9,11,(R)=>{R(0,2,9,8,'#a02018');R(0,2,9,1,'#d04030');R(0,5,9,1,'#3a2418');R(0,8,9,1,'#3a2418');R(3,0,3,2,'#3a2418');R(4,0,1,1,'#ffd040');R(2,4,1,1,'#ffd0a0');},{big:0});
// kegs join the camps, the burnt town and the ramparts
for(const d of [0,3,5])if(STAGEDECO[d])STAGEDECO[d].push(['powderkeg',2]);
function breakDeco(o,src){if(o.broken)return;o.broken=1;decos=decos.filter(x=>x!==o);const s=DECOSPR[o.k];
 spark(o.x,o.y,'#c8a060',10,70);spark(o.x,o.y,'#6a4a2a',6,50);sfx('break');
 if(o.k==='powderkeg'){impact(o.x,o.y,'#ff8030',6,true);fxRing(o.x,o.y,40,'#ff8030',.4);fxRing(o.x,o.y,22,'#ffe080',.3);spark(o.x,o.y,'#ff8030',24,130);
  shockwave(o.x,o.y,40,S.atk*3.5);if(P&&Math.hypot(P.x-o.x,P.y-o.y)<30)hitPlayer(12+(R.di||0)*2,o.x,o.y,{});
  // a keg can set off the next keg
  for(const k of decos)if(k.k==='powderkeg'&&!k.broken&&Math.hypot(k.x-o.x,k.y-o.y)<44)setTimeout(()=>breakDeco(k),120);return;}
 const r=Math.random();if(r<.28)dropPickup(o.x,o.y,'sen',Math.max(1,Math.round(rnd(1,3)*(1+(R.di||0)*.3))));else if(r<.31)dropPickup(o.x,o.y,'pot',1);}
const brkNear=(x,y,rad)=>{for(const o of decos)if(BREAKABLE[o.k]&&!o.broken&&Math.hypot(o.x-x,o.y-y)<rad)return o;return null;};
// shots: a player shot that touches a breakable breaks it (and stops, unless it pierces)
{const _up=updProjs;updProjs=function(dt){_up.apply(this,arguments);if(!R||R.training)return;
 for(const q of projs){if(q.from!=='p'||q.dead)continue;const o=brkNear(q.x,q.y,7);if(!o)continue;breakDeco(o);if(!(q.pierce>0))q.dead=true;}};}
// slashes, lines and blasts break what they sweep across
{const _ch=coneHit;coneHit=function(x,y,a,range,arc,fn){const r=_ch.apply(this,arguments);if(R&&!R.training)for(const o of decos.slice()){if(!BREAKABLE[o.k]||o.broken)continue;const d=Math.hypot(o.x-x,o.y-y);if(d<range&&Math.abs(angDiff(Math.atan2(o.y-y,o.x-x),a))<arc/2)breakDeco(o);}return r;};}
{const _lh=lineHit;lineHit=function(x,y,a,len,wid,fn){const r=_lh.apply(this,arguments);if(R&&!R.training)for(const o of decos.slice()){if(!BREAKABLE[o.k]||o.broken)continue;const dx=o.x-x,dy=o.y-y,al=dx*Math.cos(a)+dy*Math.sin(a),pe=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(al>-4&&al<len&&pe<wid+4)breakDeco(o);}return r;};}
{const _sw=shockwave;shockwave=function(x,y,r,dmg){const res=_sw.apply(this,arguments);if(R&&!R.training)for(const o of decos.slice())if(BREAKABLE[o.k]&&!o.broken&&o.k!=='powderkeg'&&Math.hypot(o.x-x,o.y-y)<r)breakDeco(o);return res;};}
// enemy shots can set off kegs too
{const _up2=updProjs;updProjs=function(dt){_up2.apply(this,arguments);if(!R||R.training)return;for(const q of projs){if(q.from!=='e'||q.dead)continue;for(const o of decos){if(o.k==='powderkeg'&&!o.broken&&Math.hypot(o.x-q.x,o.y-q.y)<6){q.dead=true;breakDeco(o);break;}}}};}
