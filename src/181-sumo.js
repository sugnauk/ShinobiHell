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
const sumoGrab=e=>sumoCanHit(e)&&sumoCanThrow(e)&&!e.sumoFlight;
// LMB TSUPPARI
function sumTsuppari(p,a,A,bp,em){p.tsu=(R.time-(p.tsuT??-9)>.9?1:(p.tsu||0)+1)%3;p.tsuT=R.time;const dbl=p.tsu===0,dm=A*1.25*bp*em*(dbl?1.6:1);
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
function sumSalt(p,a,dmg){const n=kitFinal()?20:14;
 for(let i=0;i<n;i++){const an=a+rnd(-.55,.55),q=kitShot(p.x,p.y,an,rnd(200,270),dmg,{spr:'salt',col:'#ffffff',r:2,src:'w',life:rnd(.32,.45),pierce:1,erase:2,pd:4});
  q.tick=q=>{if(q.erase<=0)return;for(const b of projs){if(b.from!=='e'||b.dead||b.peril)continue;if(Math.hypot(b.x-q.x,b.y-q.y)<b.r+4){b.dead=true;q.erase--;if(q.erase<=0)break;}}};
  q.onHit=(q,e)=>{e.blind=Math.max(e.blind||0,2.5);if(!e.saltT||e.saltT<R.time-.5){e.saltT=R.time;txtFx(e.x,e.y-10,'BLINDED','#fff8e0');}};}
 sfx('tool');}
// F SHIKO
function sumShiko(p,dmg){const cracks=kitFinal()?5:3;P.iv=Math.max(P.iv,.15);
 kitZone({src:'f',t:.42,step(){P.shiko=1;},end(){P.shiko=0;impact(P.x,P.y,SUMC,6);sfx('break');shake=Math.max(shake,5);
   for(const q of kitBullets(P.x,P.y,22)){q.dead=true;}
   const foes=kitFoes(P.x,P.y,150).sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,cracks);
   for(let i=0;i<cracks;i++){const e=foes[i],an=e?angTo(P,e):P.aim+(i-(cracks-1)/2)*.5;sumCrack(P.x,P.y,an,e,dmg);}}});}
function sumCrack(x,y,a,tg,dmg){const pts=[[x,y]];
 kitZone({src:'f',t:1.2,x,y,a,tg,go:0,step(z,dt){if(z.done)return;const ta=z.tg&&!z.tg.dead?angTo(z,z.tg):z.a;z.a+=clamp(angDiff(ta,z.a),-4*dt,4*dt);const s=220*dt;z.x+=Math.cos(z.a)*s;z.y+=Math.sin(z.a)*s;z.go+=s;
   if(Math.random()<.5||pts.length<2)pts.push([z.x+rnd(-2,2),z.y+rnd(-2,2)]);
   const e=enemies.find(o=>kitFoe(o)&&Math.hypot(o.x-z.x,o.y-z.y)<o.r+5);
   if(e||z.go>150||solid(z.x,z.y)){z.done=1;z.t=Math.min(z.t,.6);z.burst=time;z.bx=z.x;z.by=z.y;
    if(e){hurtE(e,dmg,40,{src:'f'});if(sumoCanThrow(e)&&!e.sumoFlight){sumoInterrupt(e,.8);e.kx=e.ky=0;e.sumoFlight=true;zones.push({k:'sumoLift',src:'f',e,t:.6,tk:0,duration:.6,dm:dmg*.35});}else if(e.boss){e.posture=(e.posture||0)+30;}}
    sfx('break');}},
  ground(z){const fade=Math.min(1,z.t/.3);ctx.globalAlpha=fade;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];kLine(HSX(a[0],a[1]),HSY(a[0],a[1]),HSX(b[0],b[1]),HSY(b[0],b[1]),2,'#1a120c');kLine(HSX(a[0],a[1]),HSY(a[0],a[1])-1,HSX(b[0],b[1]),HSY(b[0],b[1])-1,1,'#5a4630');}ctx.globalAlpha=1;},
  top(z){if(!z.burst)return;const k=(time-z.burst)/.45;if(k>1)return;const X=HSX(z.bx,z.by),Y=HSY(z.bx,z.by),h=Math.round(Math.sin(Math.min(1,k*2.2)*Math.PI*.5)*14*(1-Math.max(0,k-.6)/.4));
   // rock spikes bursting up from the floor
   for(const [ox,hh] of [[-5,.6],[0,1],[5,.75]]){const H=Math.round(h*hh);if(H<1)continue;ctx.fillStyle='#14101a';ctx.fillRect(X+ox-2,Y-H-1,5,H+1);ctx.fillStyle='#8a7a68';ctx.fillRect(X+ox-1,Y-H,3,H);ctx.fillStyle='#c8b8a0';ctx.fillRect(X+ox-1,Y-H,1,Math.max(1,H-2));}}});}
// R YOKOZUNA'S RING
const RING={};
function sumRing(p,dmg){const r=kitFinal()?100:82;RING.z=kitZone({src:'e',t:6.5,x:p.x,y:p.y,r,out:new Set(),inside:new Set(),dm:dmg,
  step(z){if(z.age<.6)return;if(!z.stomped){z.stomped=1;impact(z.x,z.y,SUMC,9);sfx('boss');shake=Math.max(shake,9);
    for(const e of kitFoes(z.x,z.y,z.r)){hurtE(e,z.dm*.45,60,{src:'e'});if(sumoCanThrow(e)&&!e.sumoFlight){sumoInterrupt(e,.7);e.kx=e.ky=0;e.sumoFlight=true;zones.push({k:'sumoLift',src:'e',e,t:.55,tk:0,duration:.55,dm:z.dm*.15});}}}
   for(const e of enemies){if(e.dead||e.boss||e.type==='turret')continue;const d=Math.hypot(e.x-z.x,e.y-z.y);
    if(d<z.r-e.r){z.inside.add(e);continue;}if(!z.inside.has(e)||z.out.has(e))continue;
    const forced=e.carried||e.sumoFlight||(e.shoved>R.time-.6)||Math.hypot(e.kx||0,e.ky||0)>90;
    if(forced){z.out.add(e);hurtE(e,z.dm,90,{src:'e'});e.stun=Math.max(e.stun||0,1.5);impact(e.x,e.y,SUMW,6);sfx('break');txtFx(e.x,e.y-14,'OSHIDASHI!',SUMW);}
    else{const an=Math.atan2(e.y-z.y,e.x-z.x),lim=z.r-e.r-1;e.x=z.x+Math.cos(an)*lim;e.y=z.y+Math.sin(an)*lim;}}
   // the rope stops shots fired from outside the ring
   for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;const d=Math.hypot(q.x-z.x,q.y-z.y);if(d<z.r&&d>z.r-8&&(q.vx*(q.x-z.x)+q.vy*(q.y-z.y))<0){q.dead=true;spark(q.x,q.y,STRAW,2,30);}}},
  end(){RING.z=null;},
  ground(z){const k=Math.min(1,z.age/.6),fade=z.t<.4?z.t/.4:1;ctx.globalAlpha=.18*fade;wdisc(z.x,z.y,z.r,'#c8a870');ctx.globalAlpha=fade;
   // the tawara: straw bales laid edge to edge round the ring, appearing round the circle
   const n=Math.round(z.r*.55);for(let i=0;i<n*k;i++){const an=i/n*TAU,x=z.x+Math.cos(an)*z.r,y=z.y+Math.sin(an)*z.r,X=HSX(x,y),Y=HSY(x,y);ctx.fillStyle='#14101a';ctx.fillRect(X-3,Y-3,7,5);ctx.fillStyle=i%2?STRAW:'#c8a858';ctx.fillRect(X-2,Y-2,5,3);ctx.fillStyle=STRAW2;ctx.fillRect(X-2,Y,5,1);}
   // the shikiri-sen: the two white start lines in the middle
   for(const o of [-8,8]){const x=z.x+o,y=z.y-o*.2;ctx.fillStyle='#ffffff';ctx.fillRect(HSX(x,y)-3,HSY(x,y),6,1);}ctx.globalAlpha=1;},
  top(z){const fade=z.t<.4?z.t/.4:Math.min(1,z.age/.5);
   // four great tassels (fusa) in the corners: blue, red, white and black
   [['#3a6ad0',-1,-1],['#d03a3a',1,-1],['#f0f0f0',1,1],['#2a2a30',-1,1]].forEach(([c,a,b])=>{const x=z.x+a*z.r*.78,y=z.y+b*z.r*.78,X=HSX(x,y),Y=HSY(x,y)-30+Math.round(Math.sin(time*2+a)*1);ctx.globalAlpha=fade;
    ctx.fillStyle='#14101a';ctx.fillRect(X-3,Y-14,7,16);ctx.fillRect(X,Y-26,1,12);ctx.fillStyle=c;ctx.fillRect(X-2,Y-12,5,13);ctx.fillStyle='#ffffff';ctx.globalAlpha=fade*.35;ctx.fillRect(X-2,Y-12,1,13);ctx.globalAlpha=fade;ctx.fillStyle='#e0c060';ctx.fillRect(X-2,Y-14,5,2);});ctx.globalAlpha=1;}});
 // the spirit yokozuna: a towering ghost of the hero performs the stomp behind him
 topFx({dur:1.1,x:p.x,y:p.y,draw(o,k){const s=heroSpr('sumo',9,false),X=HSX(o.x,o.y),Y=HSY(o.x,o.y)-6,fr=k<.35?8:k<.55?9:10,Z=4,dy=k<.55?-Math.round(k*10):0,a=k<.15?k/.15:k>.75?(1-k)/.25:1;
  ctx.save();ctx.globalAlpha=.38*a;ctx.translate(X,Y+dy);ctx.scale(Z,Z);drawSpr(s,0,0,false,fr,false);ctx.restore();ctx.globalAlpha=1;}});}
// inside your own ring you hit 40% harder
{const _h=hurtE;hurtE=function(e,dmg,pd,o){const z=RING.z;if(z&&z.t>0&&P&&kitHero()==='sumo'&&Math.hypot(P.x-z.x,P.y-z.y)<z.r)dmg*=1.4;return _h.call(this,e,dmg,pd,o);};}
{const _ld=loadDungeon;loadDungeon=function(){RING.z=null;if(P)P.shiko=0;return _ld.apply(this,arguments);};}

// ---------------- projectile looks ----------------
Object.assign(PSPR,{
 palm(X,Y,ux,uy,q){const x=Math.round(X),y=Math.round(Y),O='#14101a',sk='#e8a878';const f=ux>=0?1:-1;
  // an open palm, fingers forward, with a white impact edge
  ctx.fillStyle=O;ctx.fillRect(x-3,y-3,7,7);ctx.fillStyle=sk;ctx.fillRect(x-2,y-2,5,5);ctx.fillStyle='#c88058';ctx.fillRect(x-2,y+1,5,1);
  ctx.fillStyle=O;for(let i=0;i<3;i++)ctx.fillRect(x+f*3,y-2+i*2,f*2,1);ctx.fillStyle=SUMW;ctx.fillRect(x+f*3,y-2,1,5);if(q.dbl){ctx.fillStyle='#fff';ctx.fillRect(x+f*4,y-3,1,7);}},
 salt(X,Y){const x=Math.round(X),y=Math.round(Y);ctx.fillStyle='#14101a';ctx.fillRect(x-1,y-1,3,3);ctx.fillStyle=Math.floor(time*20+x)%3?'#ffffff':'#e8f4ff';ctx.fillRect(x,y,1,1);}});

// ---------------- the sprite ----------------
// The original compact rikishi silhouette (broad torso, small head, fists at the sides), kept exactly, with the detail
// it lacked: a face with both eyes, brows and a mouth; a proper topknot; belly shading, chest line and navel; knuckles
// on the fists; a real mawashi with its knot and hanging sagari fringe. Middle forms wear an embroidered kesho-mawashi
// apron instead of armour plates; the final form is the yokozuna: a thick white braided rope with zigzag paper shide
// and a ginkgo-leaf topknot.
drawSumoFrame=function(R,frame,back,stage,skin){
 const mid=stage>=5&&stage<9,final=stage>=9,walk=frame>=2&&frame<=5,bob=walk&&frame%2===1?1:0,y=12+bob,lean=frame===11?1:0;
 const raised=(frame>=8&&frame<=10)||frame===12,SH='#b06e4a',HI='#f0c098';
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
 const stride=walk?[0,1,2,1][frame-2]:0;
 R(5+stride,21,4,2,'skin');R(5+stride,22,4,1,SH);R(11+stride,21-(stride%2),4,2,'skin');R(11+stride,22-(stride%2),4,1,'boot');R(5+stride,23,4,1,'boot');
 // arms: fists at the sides, raised for the stomp and ceremony, punched out for the palm strikes
 const striking=frame===7||frame===13,leftY=raised?10:y+3,rightX=striking||frame===11?16:14,rightY=raised?9:striking?y+1:y+3;
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
 ['q','UWATENAGE',5,'SWING A FOE ROUND YOU, THEN HURL IT.',({p,a,A,qm,em})=>sumThrow(p,a,A*2.3*qm*em)],
 ['w','SALT THROW',8,'PURIFYING SALT ERASES SHOTS AND BLINDS FOES.',({p,a,A,ap,em})=>sumSalt(p,a,A*.3*ap*em)],
 ['f','SHIKO',8,'STOMP: CRACKS LAUNCH THE NEAREST FOES.',({p,A,ap,em})=>sumShiko(p,A*2.2*ap*em)],
 ['e',"YOKOZUNA'S RING",28,'A SUMO RING. PUSH FOES OUT OF IT.',({p,A,ep,em})=>sumRing(p,A*4.2*ep*em)]];
for(const [slot,name,cd,d,fn] of SUMODEF){const id=SUMO_KIT[slot],sp=SPELLS[slot][id];sp.n=name;sp.d=d;if(cd)sp.cd=cd;sp.kit179=0;
 NEWCAST[id*10+SLOTS.indexOf(slot)]=ctx=>{if((slot==='m'||slot==='h')&&ctx.mik>0)ctx.bp*=1.6;return fn(ctx);};
 SPRULES.unshift([new RegExp('^'+name+'$'),['dash','dash','dash','shield','whirl','shout'][SLOTS.indexOf(slot)]]);}
Object.assign(AB_ANIM,{'TSUPPARI':['thrust',.16,.5],'TACHIAI':['lunge',.3],'UWATENAGE':['spin',.42,1.25],'SALT THROW':['throw',.28],'SHIKO':['slam',.42],"YOKOZUNA'S RING":['roar',.6]});
Object.assign(ULTSEQ,{"YOKOZUNA'S RING":{pre:.36,iv:.6,k:'brace',col:SUMC}});
Object.assign(ABTXT,{
 'TSUPPARI':['RAPID OPEN-PALM THRUSTS.','EVERY THIRD IS A DOUBLE PALM THAT SHOVES THE FOE BACK.','KEEP THRUSTING TO DRIVE FOES OUT OF YOUR RING.'],
 'TACHIAI':['CHARGE FORWARD, CARRYING THE FIRST FOE YOU MEET.','FOES IN THE WAY ARE BOWLED ASIDE. DRIVE THE CARRIED FOE INTO A WALL FOR OSHIDASHI: DOUBLE DAMAGE AND A LONG STUN.','A BOSS STOPS YOU COLD AND TAKES HEAVY POSTURE DAMAGE.'],
 'UWATENAGE':['GRAB A FOE, SWING IT ROUND YOU, THEN HURL IT.','THE SWUNG FOE CLUBS ANYTHING IT HITS, THEN SKIDS THROUGH THE PACK.','BOSSES CANNOT BE GRABBED: THEY TAKE A HEAVY SLAP.'],
 'SALT THROW':['A FAN OF PURIFYING SALT.','EACH GRAIN ERASES ENEMY SHOTS. FOES IT HITS ARE BLINDED AND CANNOT SHOOT FOR 2.5S.','THROW IT INTO A VOLLEY, OR AT THE ARCHERS.'],
 'SHIKO':['RAISE A LEG HIGH AND STOMP.','CRACKS RACE THROUGH THE FLOOR TO THE 3 NEAREST FOES. ROCK SPIKES LAUNCH THEM INTO THE AIR.','THE STOMP ALSO CRUSHES SHOTS AT YOUR FEET.'],
 "YOKOZUNA'S RING":['A SPIRIT YOKOZUNA STOMPS AND A SUMO RING FORMS ROUND YOU FOR 6S.','FOES INSIDE CANNOT WALK OUT. SHOTS FROM OUTSIDE STOP AT THE ROPE. YOU DEAL +40% INSIDE.','SHOVE, CHARGE OR THROW A FOE OUT OF THE RING: OSHIDASHI!']});
for(const [slot] of SUMODEF){const sp=SPELLS[slot][SUMO_KIT[slot]],t=ABTXT[sp.n];if(t){sp.d0=sp.d;sp.d=t[0];sp.more=t[1];sp.tip=t[2];}}
if(typeof CLSINFO!=='undefined'&&CLSINFO.sumo){CLSINFO.sumo.lore='PUSH, CARRY AND THROW FOES. RING THEM OUT.';CLSINFO.sumo.limit='SHORT REACH';}
