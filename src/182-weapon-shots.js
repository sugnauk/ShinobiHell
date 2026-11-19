'use strict';
// SHINOBIDUNGEONS - the straight-line weapons fire real projectiles. Yari Thrust, Kusarigama and Spirit Mirror used to
// hit everything on a line at once and draw a solid spear, chain or beam that shot out and snapped back. Now each
// throws a projectile that flies out to the same reach, piercing everything on its way: same damage, same reach,
// same attack speed, and the same extras (the yari's triple third thrust, the kusarigama's pull).
//  YARI THRUST     a spirit spear-tip that flies straight out; every third thrust throws three
//  KUSARIGAMA      a spinning sickle; foes it cuts are tugged back toward you
//  SPIRIT MIRROR   a fast shard of mirror light
const WSHOT=(p,a,sp,len,dmg,o)=>kitShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a,sp,dmg,Object.assign({src:'m',pierce:99,life:(len+8)/sp,pd:12},o)); // +8: the old line also reached the foe's body
// Yari Thrust (lancer)
NEWCAST[170]=(c)=>{const {p,a,A,bp,em}=c;const cont=R.time-(p.lastSw||-9)<.8;p.combo=cont?((p.combo||0)+1)%3:0;p.lastSw=R.time;const fin=p.combo===2,len=70*(1.12+S.rangeM*.5);
 for(const o of fin?[-.22,0,.22]:[0])WSHOT(p,a+o,380,len,A*1.3*(fin?1.1:1)*bp*em,{spr:'yaribolt',col:fin?'#ffffff':'#c8e0ff',r:3,pd:16,kbA:a});
 sfx('slash');p.atkCd=(fin?.45:LMBRATE[17])/S.aspd;};
// Kusarigama (shinobi)
NEWCAST[130]=(c)=>{const {p,a,A,bp,em}=c;const len=62*(1.12+S.rangeM*.5);
 const q=WSHOT(p,a,300,len,A*1.3*bp*em,{spr:'sickle',col:'#a0a8b0',r:4,pd:14});
 q.onHit=(q,e)=>{if(!e.boss&&!e.dead){e.kx-=Math.cos(a)*70;e.ky-=Math.sin(a)*70;}};
 sfx('slash');p.atkCd=LMBRATE[13]/S.aspd;};
// Spirit Mirror (onmyoji)
NEWCAST[150]=(c)=>{const {p,a,A,bp,em}=c;const len=130*(1+S.rangeM);
 WSHOT(p,a,430,len,A*1.3*bp*em,{spr:'mirrorbolt',col:'#e0f0ff',r:3,pd:10});
 sfx('shoot');p.atkCd=LMBRATE[15]/S.aspd;};
Object.assign(PSPR,{
 // a spirit spear-tip: a leaf blade with a short glowing tail
 yaribolt(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y),c=q.col;kLine(X-ux*7,Y-uy*7,X+ux*1,Y+uy*1,3,'#14101a');kLine(X-ux*7,Y-uy*7,X,Y,1,'#7a9ac0');
  ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X+ux*2)-2,Math.round(Y+uy*2)-2,5,5);ctx.fillStyle=c;ctx.fillRect(Math.round(X+ux*2)-1,Math.round(Y+uy*2)-1,3,3);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+ux*4),Math.round(Y+uy*4),1,1);},
 // a spinning sickle blade with two trailing chain links
 sickle(X,Y,ux,uy){ctx.save();ctx.translate(Math.round(X),Math.round(Y));ctx.rotate(time*22);ctx.strokeStyle='#14101a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,4,-.4,2.4);ctx.stroke();
  ctx.strokeStyle='#d8dee8';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,4,-.4,2.4);ctx.stroke();ctx.fillStyle='#6a4428';ctx.fillRect(-1,-1,2,2);ctx.restore();
  for(const k of [6,10]){ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X-ux*k)-1,Math.round(Y-uy*k)-1,3,3);ctx.fillStyle='#a0a8b0';ctx.fillRect(Math.round(X-ux*k),Math.round(Y-uy*k),1,1);}},
 // a shard of mirror light
 mirrorbolt(X,Y,ux,uy){kLine(X-ux*6,Y-uy*6,X+ux*3,Y+uy*3,3,'#2a3a5a');kLine(X-ux*6,Y-uy*6,X+ux*3,Y+uy*3,1,'#e0f0ff');ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+ux*2),Math.round(Y+uy*2),1,1);}});
// the strike looks (171) no longer apply to these three
for(const n of ['YARI THRUST','KUSARIGAMA','SPIRIT MIRROR'])delete STRIKE_STYLE[n];
