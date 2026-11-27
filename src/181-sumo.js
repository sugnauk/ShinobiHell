'use strict';
// SHINOBIDUNGEONS - the Sumo, renovated. A new kit built on real sumo, where every move pushes, carries, throws or
// pins foes instead of hitting a ring around him, and a new sprite with proper sumo poses.
//  LMB TSUPPARI        rapid open-palm thrusts; every third is a double palm that shoves the foe back
//  RMB TACHIAI         the charging clash: plow forward carrying the first foe, bowling others aside; drive it into a
//                      wall for an OSHIDASHI slam. A boss stops you cold and takes heavy posture damage
//  Q   UWATENAGE       grab a foe, swing it round you like a club, then hurl it skidding through the pack
//  E   SALT THROW      a fan of purifying salt that erases enemy shots and blinds foes so they cannot shoot
//  F   SHIKO           the leg-raise stomp: cracks race through the floor to the nearest foes and rock spikes launch them
//  R   YOKOZUNA'S RING a giant spirit yokozuna stomps behind you and a straw ring forms: foes inside cannot walk out,
//                      shots from outside stop at the rope, you hit +40% harder inside, and any foe you shove, charge or
//                      throw OUT of the ring takes massive OSHIDASHI damage
const SUMC='#f4ae72',SUMW='#fff1c8',STRAW='#d8b868',STRAW2='#8a6a2a';
const SHIKO_IMPACT=.48,RING_IMPACT=.6;
const sumoGrab=e=>sumoCanHit(e)&&sumoCanThrow(e)&&!e.sumoFlight;
// LMB TSUPPARI
function sumTsuppari(p,a,A,bp,em){p.tsu=(R.time-(p.tsuT??-9)>.9?1:(p.tsu||0)+1)%3;p.tsuT=R.time;const dbl=p.tsu===0,dm=A*1.6*bp*em*(dbl?1.6:1);
 for(const off of dbl?[-5,5]:[0]){const px=p.x-Math.sin(a)*off,py=p.y+Math.cos(a)*off;
  const q=kitShot(px,py,a,250,dm,{spr:'palm',col:SUMC,r:5,src:'m',life:.13*(1+S.rangeM*.4),pierce:dbl?1:0,pd:dbl?28:12,dbl});
  if(dbl)q.onHit=(q,e)=>{if(!e.boss&&e.type!=='turret'){e.kx=Math.cos(a)*260;e.ky=Math.sin(a)*260;e.act=null;e.shoved=R.time;}};}
 p.atkCd=(dbl?.36:.26)/S.aspd;if(dbl){sfx('break');}}
// RMB TACHIAI
function sumTachiai(p,a,dmg,full){const len=full?92:56,dur=len/300;P.iv=Math.max(P.iv,dur+.08);const bowled=new Set();
 kitZone({src:'h',t:dur,a,carry:null,step(z,dt){const ca=Math.cos(z.a),sa=Math.sin(z.a),s=300*dt,ox=P.x,oy=P.y;move(P,ca*s,sa*s,4);const moved=Math.hypot(P.x-ox,P.y-oy);if(moved<s*.3&&z.age>.05){z.t=0;}
   P.iv=Math.max(P.iv,.06);
   if(z.carry){const e=z.carry;if(e.dead){z.carry=null;}else{const tx=P.x+ca*(e.r+8),ty=P.y+sa*(e.r+8);move(e,tx-e.x,ty-e.y,e.r);e.kx=e.ky=0;e.stun=Math.max(e.stun||0,.2);}}
   for(const e of enemies){if(!kitFoe(e)||e===z.carry||bowled.has(e))continue;if(Math.hypot(e.x-P.x,e.y-P.y)>e.r+10)continue;
    if(e.boss||e.type==='turret'){z.t=0;bowled.add(e);hurtE(e,dmg*1.3,full?110:80,{src:'h',slash:true});impact(e.x,e.y,SUMC,6);sfx('break');return;}
    if(!z.carry&&sumoGrab(e)){z.carry=e;sumoInterrupt(e,1);e.carried=1;hurtE(e,dmg*.4,20,{src:'h'});continue;}
    bowled.add(e);const side=(-sa*(e.x-P.x)+ca*(e.y-P.y))>=0?1:-1;hurtE(e,dmg*.5,20,{src:'h'});if(!e.boss){e.kx=(-sa*side)*230+ca*80;e.ky=(ca*side)*230+sa*80;e.shoved=R.time;}}},
  end(z){const e=z.carry;if(!e||e.dead)return;e.carried=0;const ca=Math.cos(z.a),sa=Math.sin(z.a);
   if(solid(e.x+ca*(e.r+6),e.y+sa*(e.r+6))){hurtE(e,dmg*2,90,{src:'h'});e.stun=Math.max(e.stun||0,1.5);impact(e.x,e.y,SUMC,8);sfx('break');txtFx(e.x,e.y-12,'OSHIDASHI!',SUMW);shake=Math.max(shake,6);}
   else{hurtE(e,dmg,45,{src:'h'});e.kx=ca*300;e.ky=sa*300;e.shoved=R.time;impact(e.x,e.y,SUMC,4);sfx('break');}},
  top(z){const ca=Math.cos(z.a),sa=Math.sin(z.a),[vx,vy]=scrVec(ca,sa),l=Math.hypot(vx,vy)||1,X=HSX(P.x,P.y),Y=HSY(P.x,P.y)-10;
   // speed lines streaming off his back
   for(let i=-2;i<=2;i++){const ox=-vy/l*i*4,oy=vx/l*i*3,len=10+((i*5+Math.floor(time*40))%6);ctx.globalAlpha=.7;kLine(X-vx/l*8+ox,Y-vy/l*8+oy,X-vx/l*(8+len)+ox,Y-vy/l*(8+len)+oy,1,i%2?SUMW:SUMC);}ctx.globalAlpha=1;}});}
// Q UWATENAGE
function sumThrow(p,a,dmg){let e=null,best=1e9;coneHit(p.x,p.y,a,38,2,o=>{const d=dist(p,o);if(sumoGrab(o)&&d<best){best=d;e=o;}});
 if(!e){const heavy=sumoTarget(p,a,36,1.95);if(heavy){hurtE(heavy,dmg,65,{slash:true,src:'q'});impact(heavy.x,heavy.y,SUMC,4);sfx('break');return;}setToast('NO FOE TO THROW',SUMC,.8);return false;}
 sumoInterrupt(e,2);e.sumoFlight=true;e.carried=1;const swung=new Set([e]),a0=angTo(p,e),spin=TAU*1.25,swing=.42;
 kitZone({src:'q',t:swing+.42,e,step(z,dt){const e=z.e;if(e.dead){z.t=0;return;}const k=z.age;
   if(k<swing){const an=a0+spin*(k/swing)*(k/swing),r=18;const tx=P.x+Math.cos(an)*r,ty=P.y+Math.sin(an)*r;e.x=tx;e.y=ty;e.z=6+Math.sin(k/swing*Math.PI)*6;e.kx=e.ky=0;
    for(const o of enemies){if(!kitFoe(o)||swung.has(o)||Math.hypot(o.x-e.x,o.y-e.y)>o.r+e.r+2)continue;swung.add(o);hurtE(o,dmg*.55,20,{src:'q'});if(!o.boss){const an2=angTo(P,o);o.kx=Math.cos(an2)*220;o.ky=Math.sin(an2)*220;o.shoved=R.time;}spark(o.x,o.y,SUMC,3,50);}
    return;}
   if(!z.thrown){z.thrown=1;z.ta=angTo(P,mouseWorld());z.hit=new Set([e]);sfx('dash');}
   const u=(k-swing)/.42,s=330*(1-u*.6)*dt,nx=e.x+Math.cos(z.ta)*s,ny=e.y+Math.sin(z.ta)*s;if(!blocked(nx,ny,e.r)){e.x=nx;e.y=ny;}else if(!z.wall){z.wall=1;hurtE(e,dmg*.6,30,{src:'q'});impact(e.x,e.y,SUMC,5);}
   e.z=u<.55?Math.sin(u/.55*Math.PI)*18:0;
   if(u>=.55){if(!z.landed){z.landed=1;hurtE(e,dmg,50,{src:'q'});impact(e.x,e.y,SUMC,5);sfx('break');}
    for(const o of enemies){if(!kitFoe(o)||z.hit.has(o)||Math.hypot(o.x-e.x,o.y-e.y)>o.r+e.r+3)continue;z.hit.add(o);hurtE(o,dmg*.7,30,{src:'q'});if(!o.boss){o.kx=Math.cos(z.ta)*200;o.ky=Math.sin(z.ta)*200;o.shoved=R.time;}}}},
  end(z){const e=z.e;e.z=0;e.sumoFlight=false;e.carried=0;if(!e.dead){e.stun=Math.max(e.stun||0,1);e.shoved=R.time;}},
  top(z){if(z.age<swing||!z.landed)return;const e=z.e;if(e.dead)return;const X=HSX(e.x,e.y),Y=HSY(e.x,e.y);ctx.globalAlpha=.5;for(let i=1;i<4;i++)kLine(X-Math.cos(z.ta)*i*5,Y-Math.sin(z.ta)*i*2.5+1,X-Math.cos(z.ta)*(i*5+3),Y-Math.sin(z.ta)*(i*2.5+1.5)+1,1,'#c8b898');ctx.globalAlpha=1;}});}
// E SALT THROW
const SUMO_SALT_LEECH=.25,SUMO_SALT_HEAL_CAP=.20;
function sumSalt(p,a,dmg){const n=kitFinal()?20:14;let healed=0;
 sumSaltArc(p.x,p.y,a);
 for(let i=0;i<n;i++){const an=a+rnd(-.55,.55),q=kitShot(p.x,p.y,an,rnd(200,270),dmg,{spr:'salt',col:'#ffffff',r:2,src:'w',life:rnd(.32,.45),pierce:1,erase:2,pd:4});
  q.tick=q=>{if(q.erase<=0)return;for(const b of projs){if(b.from!=='e'||b.dead||b.peril)continue;if(Math.hypot(b.x-q.x,b.y-q.y)<b.r+4){b.dead=true;q.erase--;spark(b.x,b.y,'#e8f4ff',3,42);if(q.erase<=0)break;}}};
  q.onDamage=dealt=>{
   if(p!==P||p.hp<=0||p.dying>0)return;
   const amount=Math.min(dealt*SUMO_SALT_LEECH,S.maxhp-p.hp,S.maxhp*SUMO_SALT_HEAL_CAP-healed);
   if(amount<=0)return;
   if(!healed){txtFx(p.x,p.y-12,'+HP','#50e060');sfx('heal');}
   p.hp+=amount;healed+=amount;
  };
  q.onHit=(q,e)=>{e.blind=Math.max(e.blind||0,2.5);if(!e.saltT||e.saltT<R.time-.5){e.saltT=R.time;txtFx(e.x,e.y-10,'BLINDED','#fff8e0');}};}
 sfx('tool');}
// The salt travels as one visible fan. The bright grains inside it still do the actual work.
function sumSaltArc(x,y,a){topFx({x,y,a,dur:.42,draw(o,k){const fade=1-abEase((k-.35)/.65),r=8+81*k;
 ctx.save();for(const [color,w,alpha,offset] of [['#3a3442',5,.84,0],['#c9e1e5',3,.85,0],['#fff6db',1,1,2]]){
  ctx.globalAlpha=fade*alpha;ctx.beginPath();
  for(let i=0;i<=16;i++){const f=i/16,an=o.a+(f-.5)*1.1,d=r*(.68+.32*Math.sin(f*Math.PI))+offset;
   const X=HSX(o.x+Math.cos(an)*d,o.y+Math.sin(an)*d),Y=HSY(o.x+Math.cos(an)*d,o.y+Math.sin(an)*d)-Math.round(4+6*Math.sin(k*Math.PI));if(i)ctx.lineTo(X,Y);else ctx.moveTo(X,Y);}
  ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();}
 ctx.restore();}});}
// F SHIKO
function sumShiko(p,dmg){const cracks=kitFinal()?5:3;P.iv=Math.max(P.iv,.15);
 kitZone({src:'f',t:SHIKO_IMPACT,end(z){sumStamp(P.x,P.y,22,.32);snd('sumoStomp');shake=Math.max(shake,5);
   for(const q of kitBullets(P.x,P.y,22)){q.dead=true;}
   const foes=kitFoes(P.x,P.y,150).sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,cracks);
   for(let i=0;i<cracks;i++){const e=foes[i],an=e?angTo(P,e):P.aim+(i-(cracks-1)/2)*.5;sumCrack(P.x,P.y,an,e,dmg,z);}}});}
function sumCrack(x,y,a,tg,dmg,stomp){const pts=[[x,y]];
 kitZone({src:'f',t:1.2,x,y,a,tg,go:0,step(z,dt){if(z.done)return;const ta=z.tg&&!z.tg.dead?angTo(z,z.tg):z.a;z.a+=clamp(angDiff(ta,z.a),-4*dt,4*dt);const s=220*dt;z.x+=Math.cos(z.a)*s;z.y+=Math.sin(z.a)*s;z.go+=s;
   if(Math.random()<.5||pts.length<2)pts.push([z.x+rnd(-2,2),z.y+rnd(-2,2)]);
   const e=enemies.find(o=>kitFoe(o)&&Math.hypot(o.x-z.x,o.y-z.y)<o.r+5);
   if(e||z.go>150||solid(z.x,z.y)){z.done=1;z.t=Math.min(z.t,.6);z.burst=time;z.bx=z.x;z.by=z.y;
    if(e){const hp=e.hp;hurtE(e,dmg,40,{src:'f',impactCue:true});
     if(e.hp<hp&&!e.dead){
      if(sumoCanThrow(e)&&!e.sumoFlight){sumoInterrupt(e,.8);e.kx=e.ky=0;e.sumoFlight=true;zones.push({k:'sumoLift',src:'f',e,t:.6,tk:0,duration:.6,dm:dmg*.35,stomp});}
      else if(e.boss){e.posture=(e.posture||0)+30;e.kick={a:z.a,p:4,t:.21,dur:.21,drop:3};}}}
    if(!stomp.rumble){stomp.rumble=true;snd('sumoStone');}}},
  ground(z){const fade=Math.min(1,z.t/.3);ctx.globalAlpha=fade;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];kLine(HSX(a[0],a[1]),HSY(a[0],a[1]),HSX(b[0],b[1]),HSY(b[0],b[1]),4,'#261a24');kLine(HSX(a[0],a[1]),HSY(a[0],a[1])-1,HSX(b[0],b[1]),HSY(b[0],b[1])-1,1,'#c29872');}ctx.globalAlpha=1;},
  top(z){if(!z.burst)return;const k=(time-z.burst)/.49;if(k>1)return;const X=HSX(z.bx,z.by),Y=HSY(z.bx,z.by),
   h=abEase(k/.28)*(1-abEase((k-.48)/.52))*25;
   ctx.save();ctx.globalAlpha=1-abEase((k-.7)/.3);shadow(X,Y+1,22);
   for(const [ox,scale,lean] of [[-8,.59,-3],[7,.78,3],[0,1,-1]])sumStone(X+ox,Y,Math.round(h*scale),lean);
   ctx.restore();}});}
function sumStone(x,y,h,lean){if(h<2)return;
 const face=(c,pts)=>{ctx.fillStyle=c;ctx.beginPath();for(const [i,[dx,dy]] of pts.entries())i?ctx.lineTo(x+dx,y+dy):ctx.moveTo(x+dx,y+dy);ctx.fill();};
 face('#292031',[[-5,0],[-5,-h*.35],[lean,-h],[4,-h*.62],[6,0],[1,3]]);
 face('#9a7966',[[-4,-1],[-4,-h*.37],[lean,-h+1],[2,-h*.44],[0,1]]);
 face('#d3ae83',[[-4,-h*.39],[lean,-h+1],[2,-h*.44],[lean,-h*.64]]);
 face('#55414a',[[0,1],[2,-h*.44],[4,-h*.6],[5,-1],[1,2]]);}
// R YOKOZUNA'S RING
const RING={};
function sumRing(p,dmg){const r=kitFinal()?100:82,flip=scrVec(Math.cos(p.aim),Math.sin(p.aim))[0]<0;RING.z=kitZone({src:'e',t:6.5,x:p.x,y:p.y,r,flip,out:new Set(),inside:new Set(),dm:dmg,
  step(z){if(z.age<RING_IMPACT)return;if(!z.stomped){z.stomped=1;sumStamp(z.x,z.y,z.r,.36);sfx('boss');shake=Math.max(shake,9);
    for(const e of kitFoes(z.x,z.y,z.r)){hurtE(e,z.dm*.8,60,{src:'e'});if(sumoCanThrow(e)&&!e.sumoFlight){sumoInterrupt(e,.7);e.kx=e.ky=0;e.sumoFlight=true;zones.push({k:'sumoLift',src:'e',e,t:.55,tk:0,duration:.55,dm:z.dm*.25});}}}
   for(const e of enemies){if(e.dead||e.boss||e.type==='turret')continue;const d=Math.hypot(e.x-z.x,e.y-z.y);
    if(d<z.r-e.r){z.inside.add(e);continue;}if(!z.inside.has(e)||z.out.has(e))continue;
    const forced=e.carried||e.sumoFlight||(e.shoved>R.time-.6)||Math.hypot(e.kx||0,e.ky||0)>90;
    if(forced){z.out.add(e);hurtE(e,z.dm,90,{src:'e'});e.stun=Math.max(e.stun||0,1.5);impact(e.x,e.y,SUMW,6);sfx('break');txtFx(e.x,e.y-14,'OSHIDASHI!',SUMW);}
    else{const an=Math.atan2(e.y-z.y,e.x-z.x),lim=z.r-e.r-1;e.x=z.x+Math.cos(an)*lim;e.y=z.y+Math.sin(an)*lim;}}
   // the rope stops shots fired from outside the ring
   for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;const d=Math.hypot(q.x-z.x,q.y-z.y);if(d<z.r&&d>z.r-8&&(q.vx*(q.x-z.x)+q.vy*(q.y-z.y))<0){q.dead=true;spark(q.x,q.y,STRAW,2,30);}}},
  end(){RING.z=null;},
  ground:drawSumoRing});}
function drawSumoRing(z){const progress=abEase(z.age/RING_IMPACT),fade=Math.min(1,z.t/.4),glow=z.stomped?1-abEase((z.age-RING_IMPACT)/.46):0;
 ctx.save();ctx.globalAlpha=(.065+.09*glow)*fade;wdisc(z.x,z.y,z.r,'#dfb57b');
 // A braided boundary cinches into place on the stomp. Its edge is the actual ring-out line.
 const n=72;
 for(let i=0;i<n*progress;i++){const a=i/n*TAU,b=(i+1)/n*TAU,x0=z.x+Math.cos(a)*z.r,y0=z.y+Math.sin(a)*z.r,
  x1=z.x+Math.cos(b)*z.r,y1=z.y+Math.sin(b)*z.r;
  if(solid(x0,y0)||solid(x1,y1))continue;
  const X0=HSX(x0,y0),Y0=HSY(x0,y0),X1=HSX(x1,y1),Y1=HSY(x1,y1);
  ctx.globalAlpha=fade;kLine(X0,Y0,X1,Y1,5,'#2e2330');
  kLine(X0,Y0-1,X1,Y1-1,3,glow>.3?SUMW:i%2?STRAW:'#9b7449');
  if(i%9===0){KR(X0,Y0,1,-2,-8,5,9,'#332533');KR(X0,Y0,1,-1,-7,3,6,'#ba8c55');KR(X0,Y0,1,-2,-8,5,2,'#f0d2a1');}}
 for(const off of [-8,8]){const x=z.x+off,y=z.y-off*.2;KR(HSX(x,y),HSY(x,y),1,-3,0,6,1,SUMW);}
 ctx.restore();if(z.age<RING_IMPACT+.48)sumSpirit(z);}
// Dust, kicked stones and a planted impact scar, kept low enough that enemy shots stay visible.
function sumStamp(x,y,r,dur){topFx({x,y,r,dur,draw(o,k){const radius=o.r*(.18+.82*abEase(k/.71)),n=Math.max(14,Math.round(o.r*.42));
 ctx.save();ctx.globalAlpha=1-abEase(k);
 for(let i=0;i<n;i++){const a=i/n*TAU,d=radius-(i%3)*2,wx=o.x+Math.cos(a)*d,wy=o.y+Math.sin(a)*d,X=HSX(wx,wy),Y=HSY(wx,wy);
  if(solid(wx,wy))continue;const h=Math.round(Math.sin(k*Math.PI)*(3+i%5));
  KR(X,Y,1,-3,1,6,2,'#513742');KR(X,Y,1,-2,-h,4,3,i%3?'#c29a72':'#e0c39c');KR(X,Y,1,-2,-h,3,1,SUMW);}
 if(k<.55){const X=HSX(o.x,o.y),Y=HSY(o.x,o.y);kLine(X-9,Y+2,X,Y,3,'#392733');kLine(X,Y,X+8,Y+4,3,'#392733');
  KR(X,Y,1,-4,-2,8,3,'#d6a17a');}
 ctx.restore();}});}
// A distinct guardian yokozuna, with an ivory ceremonial rope and a clear planted-leg silhouette.
const YOKOZUNA_ART=[false,true].map(lift=>mk(72,70,g=>{const hi=mk(216,210,h=>{h.scale(3,3);
 const face=(c,pts)=>{h.fillStyle=c;h.beginPath();h.moveTo(...pts[0]);for(const p of pts.slice(1))h.lineTo(...p);h.fill();};
 const oval=(c,x,y,rx,ry)=>{h.fillStyle=c;h.beginPath();h.ellipse(x,y,rx,ry,0,0,TAU);h.fill();};
 face('#2a192b',[[20,43],[34,42],[34,62],[30,69],[13,69],[13,64]]);
 face('#9f6a52',[[21,47],[31,45],[30,61],[26,66],[16,66],[17,62]]);
 if(lift){
  face('#2a192b',[[37,47],[47,48],[53,40],[55,29],[62,25],[68,26],[70,33],[66,41],[62,48],[53,60],[41,61],[37,56]]);
  face('#d8a073',[[40,49],[48,52],[55,42],[58,31],[63,27],[67,29],[67,34],[60,44],[54,52],[48,57],[41,57]]);
  face('#7d4851',[[47,56],[57,46],[64,35],[67,30],[66,39],[60,48],[52,59]]);
 }else{
  face('#2a192b',[[37,43],[50,43],[55,63],[60,65],[60,69],[41,69],[37,63]]);
  face('#ba8262',[[40,47],[48,46],[52,61],[56,66],[43,66],[41,60]]);}
 oval('#2a192b',35,37,25,19);oval('#bb805c',34,36,22,17);oval('#d89d6e',31,32,17,13);
 face('#2a192b',[[22,22],[17,20],[11,23],[5,31],[3,43],[8,48],[14,47],[19,42],[18,33],[25,29]]);
 face('#d49b70',[[20,24],[14,23],[8,33],[6,42],[9,45],[14,42],[15,33],[22,29]]);
 face('#2a192b',[[45,21],[52,19],[58,23],[62,34],[61,40],[55,42],[49,38],[48,31],[43,28]]);
 face('#bb8060',[[48,23],[53,22],[57,27],[59,34],[57,38],[53,37],[52,29]]);
 oval('#291e2e',35,18,13,12);oval('#d69a6b',35,20,10,8);
 face('#362537',[[23,16],[24,9],[29,7],[29,3],[40,2],[43,5],[42,9],[47,11],[48,16],[41,14],[32,16]]);
 h.fillStyle='#392431';h.fillRect(28,19,4,2);h.fillRect(38,19,4,2);h.fillRect(33,24,4,1);
 face('#884e49',[[25,34],[35,36],[44,34],[43,38],[34,39],[28,38]]);h.fillRect(34,43,3,2);
 face('#51333c',[[14,44],[26,49],[45,49],[56,43],[55,50],[44,56],[26,56],[15,51]]);
 face('#fff0d2',[[14,44],[26,48],[44,48],[56,43],[55,48],[44,53],[26,53],[14,49]]);
 for(const [x,y] of [[23,49],[34,51],[45,49]])face('#f7dfbb',[[x,y],[x+5,y],[x+3,y+4],[x+5,y+6],[x+2,y+10],[x-1,y+8],[x+1,y+5]]);
 });g.imageSmoothingEnabled=false;g.drawImage(hi,0,0,72,70);}));
function sumSpirit(z){const after=z.age-RING_IMPACT,appear=abEase(z.age/.21),fade=appear*(1-abEase(after/.48)),
 cast=abEase(z.age/.23),press=after<0?0:1-abEase(after/.17),lift=z.age>.18&&after<0,
 X=HSX(z.x,z.y),Y=HSY(z.x,z.y)-15+Math.round((1-cast)*17);
 ctx.save();ctx.globalAlpha=.89*fade;ctx.translate(X,Y);ctx.scale(z.flip?-(1+.10*press):1+.10*press,1-.12*press);
 ctx.drawImage(YOKOZUNA_ART[lift?1:0],-36,-70);ctx.restore();}
// inside your own ring you hit 40% harder
{const _h=hurtE;hurtE=function(e,dmg,pd,o){const z=RING.z;if(z&&z.t>0&&P&&kitHero()==='sumo'&&Math.hypot(P.x-z.x,P.y-z.y)<z.r)dmg*=1.4;return _h.call(this,e,dmg,pd,o);};}
{const _ld=loadDungeon;loadDungeon=function(){RING.z=null;return _ld.apply(this,arguments);};}

// ---------------- projectile looks ----------------
Object.assign(PSPR,{
 palm(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y),O='#14101a',sk='#e8a878';const f=ux>=0?1:-1;
  // an open palm, fingers forward, with a white impact edge
  ctx.fillStyle=O;ctx.fillRect(x-3,y-3,7,7);ctx.fillStyle=sk;ctx.fillRect(x-2,y-2,5,5);ctx.fillStyle='#c88058';ctx.fillRect(x-2,y+1,5,1);
  ctx.fillStyle=O;for(let i=0;i<3;i++)ctx.fillRect(x+f*3,y-2+i*2,f*2,1);ctx.fillStyle=SUMW;ctx.fillRect(x+f*3,y-2,1,5);if(q.dbl){ctx.fillStyle='#fff';ctx.fillRect(x+f*4,y-3,1,7);}},
 salt(X,Y,ux,uy){const x=Math.round(X),y=Math.round(Y);kLine(x-ux*4,y-uy*4,x,y,3,'#665567');
  kLine(x-ux*3,y-uy*3,x+ux,y+uy,2,'#f3e7d7');KR(x,y,1,0,-1,2,2,'#ffffff');}});

// ---------------- the sprite ----------------
// The original compact rikishi silhouette (broad torso, small head, fists at the sides), kept exactly, with the detail
// it lacked: a face with both eyes, brows and a mouth; a proper topknot; belly shading, chest line and navel; knuckles
// on the fists; a real mawashi with its knot and hanging sagari fringe. Middle forms wear an embroidered kesho-mawashi
// apron instead of armour plates; the final form is the yokozuna: a thick white braided rope with zigzag paper shide
// and a ginkgo-leaf topknot.
// Draw the raised leg with a bent knee and a pointed foot, then sample it at the sheet's native resolution.
const shikoLeg=mk(20,24,g=>{const hi=mk(80,96,h=>{h.scale(4,4);
 const shape=(col,pts)=>{h.beginPath();h.moveTo(...pts[0]);for(const p of pts.slice(1))h.lineTo(...p);h.closePath();h.fillStyle=col;h.fill();};
 shape('#e0b080',[[11,18],[14.5,15],[15.5,11.5],[17.5,10],[19,11],[19.5,14.5],[18.1,18],[15,21.5],[11,22.5],[10,21]]);
 shape('#b06e4a',[[11,20.5],[15,19],[17.5,16.4],[19,11.6],[19.5,14.5],[18.1,18],[15,21.5],[11,22.5]]);
 shape('#f0c098',[[13.7,16.5],[15.4,13],[17.3,11.2],[17.8,12.4],[16.5,15.1],[15.1,16.5]]);
 shape('#2a2236',[[16.5,11.3],[16.5,9.5],[18.5,8.5],[19.25,9.1],[19.5,12.3],[18.2,12.8]]);
 shape('#927369',[[16.7,9.6],[18.5,8.8],[18.9,9.5],[17,10.4]]);});g.imageSmoothingEnabled=false;g.drawImage(hi,0,0,20,24);});
drawSumoFrame=function(R,frame,back,stage,skin,g){
 const mid=stage>=5&&stage<9,final=stage>=9,walk=frame>=2&&frame<=5,bob=walk&&frame%2===1?1:0,y=12+bob,lean=frame===11?1:0;
 const shiko=frame===15,raised=(frame>=8&&frame<=10)||frame===12||shiko,SH='#b06e4a',HI='#f0c098';
 if(shiko)g.drawImage(shikoLeg,0,0);
 // body: the original shape
 R(5,y,10,2,'skin');R(4,y+2,12,5,'skin');
 // belly shading: a darker right side and underside, a highlight on the left of the chest
 R(14,y+1,1,6,SH);R(15,y+2,1,4,SH);R(5,y+5,10,1,SH);R(5,y,3,1,HI);R(4,y+2,1,2,HI);
 if(!back){R(10,y+4,1,1,'#7a3a24');R(6,y+4,1,1,SH);R(13,y+3,1,2,SH);}
 else{R(10,y,1,5,SH);R(7,y+1,2,1,SH);R(12,y+1,2,1,SH);}
 // the mawashi: a wide belt with its knot, and the sagari fringe hanging down the front
 R(4,y+6,12,2,'robe');R(4,y+6,12,1,'band');R(5,y+7,10,1,'robeS');
 if(!back){R(8,y+6,4,2,'robe');R(9,y+6,2,1,'trim');for(const x of [6,8,10,12])R(x,y+8,1,2+(x%4?0:1),'robeS');}
 else{R(8,y+5,4,4,'robe');R(9,y+5,2,1,'band');R(9,y+8,2,2,'robeS');}
 // legs and feet
 // the feet step in turn: one forward as the other goes back, the passing foot lifted
 const wi=walk?frame-2:-1,st=walk?[2,0,-2,0][wi]:0,lf=wi===1?1:0,ln=wi===3?1:0;
 R(5+st,21-lf,4,2,'skin');R(5+st,22-lf,4,1,SH);R(5+st,23-lf,4,1,'boot');
 if(!shiko){R(11-st,21-ln,4,2,'skin');R(11-st,22-ln,4,1,'boot');}
 // arms: fists at the sides, raised for the stomp and ceremony, punched out for the palm strikes
 const striking=frame===7||frame===13,leftY=raised?10:y+3,rightX=shiko?12:striking||frame===11?16:14,rightY=shiko?7:raised?9:striking?y+1:y+3;
 R(2,leftY,4,3,'skin');R(2,leftY,1,3,SH);R(3,leftY,1,1,HI);R(2,leftY+2,2,1,'#c88058');
 R(rightX,rightY,3,3,'skin');R(rightX+2,rightY,1,3,SH);R(rightX,rightY,1,1,HI);R(rightX,rightY+2,3,1,'#c88058');
 if(striking)R(Math.min(19,rightX+3),rightY,1,3,'#fff1c8');
 // head: the original block, then a face
 R(7+lean,8+bob,6,5,back?'hat':'skin');R(7+lean,7+bob,6,2,'hat');R(8+lean,5+bob,4,2,'hat');
 if(back){R(8+lean,11+bob,4,1,'hatL');R(7+lean,9+bob,6,1,'hatL');}
 else{R(12+lean,10+bob,1,3,SH);R(8+lean,10+bob,1,1,'#2a1418');R(11+lean,10+bob,1,1,'#2a1418');R(8+lean,11+bob,1,1,'#e88870');R(11+lean,11+bob,1,1,'#e88870');R(9+lean,12+bob,2,1,'#8a4a34');}
 // the topknot: a tied bun (chonmage), or the yokozuna's ginkgo-leaf oicho-mage
 if(final){R(7+lean,4+bob,6,2,'hat');R(8+lean,3+bob,4,1,'hat');R(9+lean,4+bob,2,1,'hatL');R(7+lean,4+bob,1,1,'hatL');R(12+lean,4+bob,1,1,'hatL');R(9+lean,5+bob,2,1,'#e8e0d0');}
 else{R(9+lean,3+bob,2,2,'hat');R(9+lean,3+bob,1,1,'hatL');R(9+lean,5+bob,2,1,'#e8e0d0');}
 R(9+lean,6+bob,2,1,'hatL');
 // middle forms: the embroidered kesho-mawashi apron hanging to the knees
 if(mid&&!back){R(7,y+8,6,3,'trim');R(8,y+8,4,2,'robe');R(9,y+9,2,1,'band');R(7,y+11,6,1,'#14101a');}
 // the yokozuna: a thick white braided rope with zigzag paper shide
 if(final){for(let x=3;x<17;x++)R(x,y+5,1,2,(x+(frame&1))%2?'#ffffff':'#d0d0d0');R(3,y+4,14,1,'#14101a');
  if(!back)for(const x of [5,9,13]){R(x,y+7,1,1,'#ffffff');R(x+1,y+8,1,1,'#ffffff');R(x,y+9,1,1,'#ffffff');R(x+1,y+10,1,1,'#ffffff');}
  else{R(7,y+2,6,3,'#ffffff');R(8,y+3,1,1,'#d0d0d0');R(11,y+3,1,1,'#d0d0d0');}}
 // mastery skins: a patterned mawashi and wrapped fists
 if(skin){for(let x=5;x<15;x+=3)R(x,y+7,1,1,'trim');R(2,leftY,4,1,'band');R(rightX,rightY,3,1,'band');if(skin===2)R(4,y+6,12,1,'trim');}};
for(const k in HEROC)if(k.startsWith('sumo'))delete HEROC[k];

// ---------------- wiring: the new kit replaces the old one ----------------
const SUMODEF=[
 ['m','TSUPPARI',0,'RAPID PALM THRUSTS. EVERY THIRD SHOVES.',({p,a,A,bp,em})=>sumTsuppari(p,a,A,bp,em)],
 ['h','TACHIAI',1.6,'CHARGE AND CARRY A FOE. DRIVE IT INTO A WALL.',({p,a,A,bp,em})=>sumTachiai(p,a,A*2.6*bp*em,p.hFull)],
 ['q','UWATENAGE',5,'SWING A FOE ROUND YOU, THEN HURL IT.',({p,a,A,qm,em})=>sumThrow(p,a,A*3*qm*em)],
 ['w','SALT THROW',8,'PURIFYING SALT: HEALS FROM DAMAGE, ERASES SHOTS, BLINDS FOES.',({p,a,A,ap,em})=>sumSalt(p,a,A*.3*ap*em)],
 ['f','SHIKO',8,'STOMP: CRACKS LAUNCH THE NEAREST FOES.',({p,A,ap,em})=>sumShiko(p,A*2.2*ap*em)],
 ['e',"YOKOZUNA'S RING",28,'A SUMO RING. PUSH FOES OUT OF IT.',({p,A,ep,em})=>sumRing(p,A*4.2*ep*em)]];
for(const [slot,name,cd,d,fn] of SUMODEF){const id=SUMO_KIT[slot],sp=SPELLS[slot][id];sp.n=name;sp.d=d;if(cd)sp.cd=cd;sp.kit179=0;
 NEWCAST[id*10+SLOTS.indexOf(slot)]=ctx=>{if((slot==='m'||slot==='h')&&ctx.mik>0)ctx.bp*=1.6;return fn(ctx);};
 SPRULES.unshift([new RegExp('^'+name+'$'),['dash','dash','dash','shield','whirl','shout'][SLOTS.indexOf(slot)]]);}
Object.assign(AB_ANIM,{'TSUPPARI':['thrust',.16,.5],'TACHIAI':['lunge',.3],'UWATENAGE':['spin',.42,1.25],'SALT THROW':['saltcast',.36],'SHIKO':['shiko',SHIKO_IMPACT+.16],"YOKOZUNA'S RING":['shiko_ring',RING_IMPACT+.18]});
Object.assign(ULTSEQ,{"YOKOZUNA'S RING":{pre:.36,iv:.6,k:'brace',col:SUMC}});
Object.assign(ABTXT,{
 'TSUPPARI':['RAPID OPEN-PALM THRUSTS.','EVERY THIRD IS A DOUBLE PALM THAT SHOVES THE FOE BACK.','KEEP THRUSTING TO DRIVE FOES OUT OF YOUR RING.'],
 'TACHIAI':['CHARGE FORWARD, CARRYING THE FIRST FOE YOU MEET.','FOES IN THE WAY ARE BOWLED ASIDE. DRIVE THE CARRIED FOE INTO A WALL FOR OSHIDASHI: DOUBLE DAMAGE AND A LONG STUN.','A BOSS STOPS YOU COLD AND TAKES HEAVY POSTURE DAMAGE.'],
 'UWATENAGE':['GRAB A FOE, SWING IT ROUND YOU, THEN HURL IT.','THE SWUNG FOE CLUBS ANYTHING IT HITS, THEN SKIDS THROUGH THE PACK.','BOSSES CANNOT BE GRABBED: THEY TAKE A HEAVY SLAP.'],
 'SALT THROW':['HEAL FOR '+cdPct(SUMO_SALT_LEECH)+' OF THE DAMAGE SALT DEALS.','HEAL UP TO '+cdPct(SUMO_SALT_HEAL_CAP)+' MAX HP PER THROW. SALT ALSO ERASES SHOTS AND BLINDS FOES FOR 2.5S.','LAND IT ON A GROUP TO HEAL MORE.'],
 'SHIKO':['RAISE A LEG HIGH AND STOMP.','CRACKS RACE THROUGH THE FLOOR TO THE 3 NEAREST FOES. ROCK SPIKES LAUNCH THEM INTO THE AIR.','THE STOMP ALSO CRUSHES SHOTS AT YOUR FEET.'],
 "YOKOZUNA'S RING":['A SPIRIT YOKOZUNA STOMPS AND A SUMO RING FORMS ROUND YOU FOR 6S.','FOES INSIDE CANNOT WALK OUT. SHOTS FROM OUTSIDE STOP AT THE ROPE. YOU DEAL +40% INSIDE.','SHOVE, CHARGE OR THROW A FOE OUT OF THE RING: OSHIDASHI!']});
for(const [slot] of SUMODEF){const sp=SPELLS[slot][SUMO_KIT[slot]],t=ABTXT[sp.n];if(t){sp.d0=sp.d;sp.d=t[0];sp.more=t[1];sp.tip=t[2];}}
if(typeof CLSINFO!=='undefined'&&CLSINFO.sumo){CLSINFO.sumo.lore='PUSH, CARRY AND THROW FOES. RING THEM OUT.';CLSINFO.sumo.limit='SHORT REACH';}
