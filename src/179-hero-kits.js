'use strict';
// SHINOBIDUNGEONS - new kits for the five newer heroes (Marionettist, Tengu, Kagura, Chimiko, Kanemori).
// Their old abilities were mostly a ring of damage around a point. Every ability here changes how the fight plays:
// it moves, controls, blocks or redirects something. The show comes from shaped projectiles, objects in the world
// and the hero's pose, never from particle clouds. (The plan is written out in CHANGELOG.md, 0.8.1.)

// ======================================== shared machinery ========================================
const HK={};                       // per-hero state that is not on P
const TOPFX=[];                     // things drawn above the sprites and below the bullets: {t0,dur,draw(o,k)}
const topFx=(o)=>{o.t0=time;TOPFX.push(o);return o;};
const kitFoe=e=>e&&!e.dead&&!e.air&&!e.ghost&&!(e.iv>0)&&!e.prop;
const kitFoes=(x,y,r)=>enemies.filter(e=>kitFoe(e)&&Math.hypot(e.x-x,e.y-y)<=r+e.r&&los(x,y,e.x,e.y));
const kitNearest=(x,y,r,skip)=>{let b=null,bd=r;for(const e of enemies){if(!kitFoe(e)||(skip&&skip(e)))continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd&&los(x,y,e.x,e.y)){bd=d;b=e;}}return b;};
const kitAim=(p,range)=>{const m=mouseWorld(),a=angTo(p,m),l=rayLen(p.x,p.y,a,Math.min(range,dist(p,m)));return {x:p.x+Math.cos(a)*l,y:p.y+Math.sin(a)*l,a};};
const kitFinal=()=>typeof heroTransformed==='function'&&heroTransformed();
const kitHero=()=>P&&typeof CLS==='function'?CLS().k:'';
const kitShot=(x,y,a,sp,dmg,o)=>{const q=mkProj('p',x,y,a,sp,dmg,Object.assign({main:true,pierce:0,pd:8,life:.6*(1+S.rangeM)},o||{}));projs.push(q);return q;};
const HSX=(x,y)=>sx(x,y),HSY=(x,y)=>sy(x,y);
// enemy bullets near a point (never red peril shots)
const kitBullets=(x,y,r)=>projs.filter(q=>q.from==='e'&&!q.dead&&!q.peril&&Math.hypot(q.x-x,q.y-y)<=r);
// an enemy bullet turned into one of yours
function kitTurn(q,a,sp,dmg,col,o){q.from='p';q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp;q.dmg=dmg;q.pd=12;q.pierce=0;q.hit=new Set();q.life=1.2;q.col=col;q.st=null;q.own=null;q.main=true;q.src=o&&o.src||null;if(o&&o.spr)q.spr=o.spr;return q;}
// a pixel-art rectangle in screen space, mirrored by f (1 or -1) around X
const KR=(X,Y,f,x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(f>0?X+x:X-x-w),Math.round(Y+y),w,h);};
// a thick line in screen space
function kLine(x0,y0,x1,y1,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(Math.round(x0)+.5,Math.round(y0)+.5);ctx.lineTo(Math.round(x1)+.5,Math.round(y1)+.5);ctx.stroke();ctx.lineWidth=1;}

// projectiles: a per-frame tick, an on-hit hook and an on-end hook
{const _up=updProjs;updProjs=function(dt){const L=projs.filter(q=>q.tick||q.onHit||q.onEnd);
 for(const q of L){q._hn=q.hit.size;if(q.tick&&!q.dead)q.tick(q,dt);}
 _up.apply(this,arguments);
 for(const q of L){if(q.onHit&&q.hit.size>q._hn){const arr=[...q.hit];for(let i=q._hn;i<arr.length;i++)q.onHit(q,arr[i]);}
  if(q.dead&&q.onEnd&&!q._end){q._end=1;q.onEnd(q);}}};}
// the top layer: drawn after the sprites, before the bullets (like the Dragon Spirit)
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);
 for(let i=TOPFX.length-1;i>=0;i--){const o=TOPFX[i],k=(time-o.t0)/o.dur;if(k>1||o.dead){TOPFX.splice(i,1);continue;}try{o.draw(o,Math.max(0,k));}catch(_){TOPFX.splice(i,1);}ctx.globalAlpha=1;}
 for(const z of zones)if(z.t>0&&z.top)try{z.top(z);}catch(_){}ctx.globalAlpha=1;};}
{const _ld=loadDungeon;loadDungeon=function(){TOPFX.length=0;for(const k in HK)delete HK[k];return _ld.apply(this,arguments);};}
// a zone whose behaviour and drawing live on the zone itself
CZ.kit=(z,dt,tick)=>{z.age=(z.age||0)+dt;if(z.step)z.step(z,dt,tick);if(z.t<=0&&z.end&&!z._end){z._end=1;z.end(z);}};
CZD.kit=z=>{if(z.ground)z.ground(z);};
const kitZone=o=>{const z=Object.assign({k:'kit',x:P.x,y:P.y,r:0,tk:0,age:0},o);zones.push(z);return z;};

// ======================================== MARIONETTIST ========================================
const MAR='#dfa6ff',MAR2='#f6e6ff',WOOD='#a8743a',WOOD2='#6a4422';
// LMB SILK NEEDLE: a fast needle trailing silk; a hit stitches the foe (up to 3) for the other abilities
function marNeedle(p,a,dmg){const q=kitShot(p.x,p.y,a,310,dmg,{spr:'needle',col:MAR,r:2,src:'m',tr:[]});
 q.tick=(q)=>{q.tr.push([q.x,q.y]);if(q.tr.length>7)q.tr.shift();};
 q.onHit=(q,e)=>{e.stitch=Math.min(3,(e.stitch||0)+1);e.stitchT=R.time+5;};}
const stitches=e=>e.stitchT>R.time?e.stitch||0:0;
// RMB REEL IN: a hook on a string. The first foe hit is yanked to you and stunned; a boss pulls you to it instead.
function marReel(p,a,dmg,full){const q=kitShot(p.x,p.y,a,330,dmg,{spr:'hook',col:MAR,r:3,src:'h',life:.46*(1+S.rangeM*.5),pierce:full?2:0,pd:20,reeled:[]});
 q.onHit=(q,e)=>{const st=stitches(e);if(st){hurtE(e,dmg*.25*st,10,{src:'h'});e.stitch=0;}
  if(e.boss||e.type==='turret'||e.elite==='armored'){q.dead=true;kitZone({src:'h',t:.3,e,step(z,dt){const d=dist(P,z.e);if(z.e.dead||d<z.e.r+12){z.t=0;return;}const s=Math.min(d-z.e.r-12,420*dt),an=angTo(P,z.e);move(P,Math.cos(an)*s,Math.sin(an)*s,4);P.iv=Math.max(P.iv,.12);},
   top(z){marString(P.x,P.y,z.e.x,z.e.y,0);}});return;}
  sumoInterrupt(e,1.3);e.sumoFlight=true;kitZone({src:'h',t:.32,e,step(z,dt){const e=z.e;if(e.dead){z.t=0;return;}const d=dist(P,e),want=e.r+14;if(d>want){const s=Math.min(d-want,520*dt),an=angTo(e,P);move(e,Math.cos(an)*s,Math.sin(an)*s,e.r);}e.z=Math.sin(Math.min(1,z.age/.32)*Math.PI)*7;},
   end(z){z.e.z=0;z.e.sumoFlight=false;if(!z.e.dead){z.e.stun=Math.max(z.e.stun||0,1);spark(z.e.x,z.e.y,MAR,4,40);}},top(z){if(!z.e.dead)marString(P.x,P.y,z.e.x,z.e.y,z.e.z||0);}});};}
function marString(x0,y0,x1,y1,z,col){const X0=HSX(x0,y0)+3,Y0=HSY(x0,y0)-14,X1=HSX(x1,y1),Y1=HSY(x1,y1)-10-(z||0);ctx.globalAlpha=.9;kLine(X0,Y0,X1,Y1,1,col||MAR2);ctx.globalAlpha=1;}
// Q CURSED THREAD: a spool ricochets between foes, linking them. Hitting one hurts the others (the existing link
// damage), and linked foes are tethered: none can wander far from the rest.
function marSpool(p,a,dmg){const cap=kitFinal()?8:5;
 kitZone({src:'q',t:2.2,x:p.x,y:p.y,vx:Math.cos(a)*300,vy:Math.sin(a)*300,tg:null,left:.42,chain:[],step(z,dt){
  if(z.done){return;}
  if(z.tg){if(z.tg.dead){z.tg=null;}else{const an=angTo(z,z.tg);z.vx=Math.cos(an)*340;z.vy=Math.sin(an)*340;}}
  z.x+=z.vx*dt;z.y+=z.vy*dt;z.left-=dt;if(solid(z.x,z.y)||(!z.tg&&z.left<=0)){z.done=1;z.t=Math.min(z.t,.25);return;}
  const e=z.tg&&dist(z,z.tg)<z.tg.r+5?z.tg:!z.tg?enemies.find(e=>kitFoe(e)&&!z.chain.includes(e)&&dist(z,e)<e.r+5):null;
  if(e){z.chain.push(e);e.threadUntil=R.time+6;hurtE(e,dmg,14,{src:'q'});spark(e.x,e.y,MAR,3,40);sfx('tool');
   if(z.chain.length>=cap){z.done=1;z.t=.2;return;}
   const n=kitNearest(e.x,e.y,110,o=>z.chain.includes(o));if(n){z.tg=n;z.left=1;}else{z.done=1;z.t=.2;}}},
  end(z){if(z.chain.length>1){const L={list:z.chain.slice(),until:R.time+6};(HK.links=HK.links||[]).push(L);}},
  top(z){if(z.done)return;const X=HSX(z.x,z.y),Y=HSY(z.x,z.y)-10,f=Math.floor(time*20)%2;
   KR(X,Y,1,-3,-2,6,4,'#14101a');KR(X,Y,1,-2,-1,4,2,f?MAR:MAR2);KR(X,Y,1,-3,-3,6,1,WOOD);KR(X,Y,1,-3,2,6,1,WOOD);
   for(let i=0;i<z.chain.length;i++){const e=z.chain[i];marString(i?z.chain[i-1].x:e.x,i?z.chain[i-1].y:e.y,e.x,e.y,0,MAR);}
   const last=z.chain[z.chain.length-1];if(last&&!last.dead){const X1=HSX(last.x,last.y),Y1=HSY(last.x,last.y)-10;kLine(X1,Y1,X,Y,1,MAR);}}});}
// the tether: linked foes are pulled back toward the group and the threads are drawn between them
function marLinks(dt){if(!HK.links)return;HK.links=HK.links.filter(L=>L.until>R.time&&L.list.filter(e=>!e.dead&&e.threadUntil>R.time).length>1);
 for(const L of HK.links){const live=L.list.filter(e=>!e.dead&&e.threadUntil>R.time);let cx=0,cy=0;for(const e of live){cx+=e.x;cy+=e.y;}cx/=live.length;cy/=live.length;
  for(const e of live){if(e.boss)continue;const d=Math.hypot(e.x-cx,e.y-cy),lim=40+live.length*6;if(d>lim){const s=Math.min(d-lim,120*dt);move(e,(cx-e.x)/d*s,(cy-e.y)/d*s,e.r);}}}}
// E SWAP DOLL: a wooden doll stands where you were; nearby foes go after it for 3s, and it soaks up to 8 shots
let DOLLSWAP=false;
function marDoll(p,a){const D=HK.doll={x:p.x,y:p.y,t:3,hp:kitFinal()?12:8,hitT:-9};rosterShift(p,a+Math.PI,62);fxRing(D.x,D.y,14,MAR,.25);
 for(const e of enemies)if(kitFoe(e)&&!e.boss&&Math.hypot(e.x-D.x,e.y-D.y)<170)e.taunt=R.time+3;
 topFx({dur:3.2,draw(o,k){const D=HK.doll;if(!D||D!==o.D){o.dead=1;return;}marDrawDoll(D);},D});}
function marDrawDoll(D){const X=HSX(D.x,D.y),Y=HSY(D.x,D.y),hit=time-D.hitT<.2,j=hit?Math.round(Math.sin(time*60)*1.5):0,f=1;
 shadow(X,Y-1,8);const o='#14101a',w=hit?'#ffffff':WOOD,w2=hit?'#e0d0ff':WOOD2;
 KR(X+j,Y,f,-3,-17,6,6,o);KR(X+j,Y,f,-2,-16,4,4,w);KR(X+j,Y,f,-1,-15,1,1,o);KR(X+j,Y,f,1,-15,1,1,o);KR(X+j,Y,f,-1,-13,2,1,'#c02030');
 KR(X,Y,f,-4,-11,8,7,o);KR(X,Y,f,-3,-10,6,5,w2);KR(X,Y,f,-3,-10,6,1,MAR);KR(X,Y,f,-6,-10,3,2,w);KR(X,Y,f,3,-10,3,2,w);
 KR(X,Y,f,-3,-4,2,4,w);KR(X,Y,f,1,-4,2,4,w);for(const x of [-5,4])KR(X,Y,f,x,-30,1,20,'rgba(246,230,255,.5)');
 const n=Math.max(0,D.hp);for(let i=0;i<n;i++)KR(X,Y,f,-n+i*2,-21,1,1,MAR);}
{const _ue=updEnemy;updEnemy=function(e,dt){const D=HK.doll;if(D&&D.t>0&&e.taunt>R.time&&P&&!e.boss){const px=P.x,py=P.y;P.x=D.x;P.y=D.y;DOLLSWAP=true;try{return _ue.apply(this,arguments);}finally{DOLLSWAP=false;P.x=px;P.y=py;}}return _ue.apply(this,arguments);};}
{const _hp=hitPlayer;hitPlayer=function(){if(DOLLSWAP&&HK.doll){const D=HK.doll;D.hp--;D.hitT=time;spark(D.x,D.y,WOOD,3,40);return 'dodge';}return _hp.apply(this,arguments);};}
function marDollTick(dt){const D=HK.doll;if(!D)return;D.t-=dt;for(const q of kitBullets(D.x,D.y,10)){q.dead=true;D.hp--;D.hitT=time;spark(q.x,q.y,WOOD,3,40);}
 if(D.t<=0||D.hp<=0){for(let i=0;i<6;i++)particles.push({x:D.x,y:D.y,vx:rnd(-50,50),vy:rnd(-60,-10),t:.5,col:i%2?WOOD:WOOD2});sfx('break');HK.doll=null;for(const e of enemies)e.taunt=0;}}
// F PUPPET DANCE: a foe hangs on your strings for 3s and follows your cursor; swing it into the others. A boss is
// bound and slowed instead.
function marPuppet(p,dmg){const v=kitAim(p,150);let e=kitNearest(v.x,v.y,60)||kitNearest(p.x,p.y,110);if(!e)return false;
 if(e.boss||e.type==='turret'){kitZone({src:'f',t:3,e,step(z){if(z.e.dead){z.t=0;return;}z.e.zs=Math.min(z.e.zs||1,.45);if(!z.hit){z.hit=1;z.e.posture=(z.e.posture||0)+40;if(typeof checkBreak==='function')checkBreak(z.e);}},
  top(z){if(z.e.dead)return;for(const o of [-6,0,6])marString(P.x,P.y,z.e.x+o,z.e.y,6);}});return;}
 sumoInterrupt(e,3.3);e.sumoFlight=true;const hitT=new Map();
 kitZone({src:'f',t:kitFinal()?4:3,e,step(z,dt){const e=z.e;if(e.dead){z.t=0;return;}e.stun=Math.max(e.stun||0,.2);e.act=null;e.kx=e.ky=0;
   e.z=10+Math.sin(z.age*6)*3;const m=mouseWorld(),d=Math.hypot(m.x-e.x,m.y-e.y),s=Math.min(d,170*dt);if(d>2){z.vx=(m.x-e.x)/d*s/dt;z.vy=(m.y-e.y)/d*s/dt;move(e,(m.x-e.x)/d*s,(m.y-e.y)/d*s,e.r);}
   for(const o of enemies){if(o===e||!kitFoe(o)||Math.hypot(o.x-e.x,o.y-e.y)>o.r+e.r+3)continue;if((hitT.get(o)||0)>z.age)continue;hitT.set(o,z.age+.45);
    const an=angTo(e,o);hurtE(o,dmg,22,{src:'f',kb:an});hurtE(e,dmg*.5,10,{src:'f'});impact(o.x,o.y,MAR,3);sfx('break');}},
  end(z){const e=z.e;e.z=0;e.sumoFlight=false;if(!e.dead){hurtE(e,dmg*1.3,30,{src:'f'});e.stun=Math.max(e.stun||0,1.2);impact(e.x,e.y,MAR,4);}},
  top(z){const e=z.e;if(e.dead)return;for(const o of [-5,0,5])marString(P.x,P.y,e.x+o*.6,e.y,(e.z||0)+4);
   const X=HSX(P.x,P.y)+3,Y=HSY(P.x,P.y)-17;KR(X,Y,1,-4,0,9,1,WOOD);KR(X,Y,1,0,-2,1,5,WOOD);}});}
// R GRAND THEATRE: a giant puppeteer's cross-bar appears overhead, strings drop onto the foes and hoist them up,
// then the bar yanks them all together and slams them down
function marTheatre(p,dmg){const cap=kitFinal()?14:10,c=kitAim(p,110),foes=kitFoes(p.x,p.y,170).sort((a,b)=>dist(a,c)-dist(b,c)).slice(0,cap);
 for(const e of foes)if(!e.boss&&e.type!=='turret'){sumoInterrupt(e,2.4);e.sumoFlight=true;e.theatre={x:e.x,y:e.y};}
 kitZone({src:'e',t:2.1,x:c.x,y:c.y,foes,step(z,dt){const k=z.age;
   for(const e of z.foes){if(e.dead)continue;if(e.boss||!e.theatre){e.zs=Math.min(e.zs||1,.15);continue;}e.stun=Math.max(e.stun||0,.2);e.act=null;e.kx=e.ky=0;
    if(k<.35)e.z=0;else if(k<1.3)e.z=Math.min(34,(k-.35)/.95*34)+Math.sin(k*9+e.x)*2;
    else if(k<1.6){const f=(k-1.3)/.3,tx=z.x+(e.theatre.x-z.x)*.18*(1-f),ty=z.y+(e.theatre.y-z.y)*.18*(1-f);move(e,(tx-e.x)*Math.min(1,dt*14),(ty-e.y)*Math.min(1,dt*14),e.r);e.z=34-f*8;}
    else e.z=Math.max(0,e.z-dt*400);}
   if(k>=1.6&&!z.slam){z.slam=1;impact(z.x,z.y,MAR,9);sfx('break');shake=Math.max(shake,8);const n=z.foes.filter(e=>!e.dead).length;
    for(const e of z.foes){if(e.dead)continue;hurtE(e,dmg*(1+.12*Math.min(6,n-1)),75,{src:'e'});if(e.theatre){e.z=0;e.sumoFlight=false;e.stun=Math.max(e.stun||0,1.4);}}}},
  end(z){for(const e of z.foes){e.z=0;e.sumoFlight=false;e.theatre=null;}},
  top(z){const k=z.age,X=HSX(z.x,z.y),Y=HSY(z.x,z.y)-70,a=Math.min(1,k/.3)*(z.t<.3?z.t/.3:1);ctx.globalAlpha=a;
   const sway=Math.round(Math.sin(k*3)*3),yank=k>1.3&&k<1.6?-Math.round((k-1.3)/.3*10):0;
   // the cross-bar: a big wooden cross with a carved pommel, swaying, and yanked up for the slam
   const BX=X+sway,BY=Y+yank;KR(BX,BY,1,-44,-3,88,7,'#14101a');KR(BX,BY,1,-43,-2,86,5,WOOD);KR(BX,BY,1,-43,-2,86,1,'#d8a060');KR(BX,BY,1,-43,2,86,1,WOOD2);
   KR(BX,BY,1,-4,-22,9,40,'#14101a');KR(BX,BY,1,-3,-21,7,38,WOOD);KR(BX,BY,1,-3,-21,1,38,'#d8a060');KR(BX,BY,1,-6,-27,13,7,'#14101a');KR(BX,BY,1,-5,-26,11,5,MAR);KR(BX,BY,1,-3,-25,3,2,MAR2);
   for(const sgn of [-1,1])KR(BX,BY,1,sgn>0?40:-46,-5,6,11,'#14101a'),KR(BX,BY,1,sgn>0?41:-45,-4,4,9,MAR);
   // the strings: drop from the bar to each foe
   const drop=Math.min(1,k/.4);for(let i=0;i<z.foes.length;i++){const e=z.foes[i];if(e.dead)continue;const ax=BX-40+i*80/Math.max(1,z.foes.length-1),ay=BY+3,ex=HSX(e.x,e.y),ey=HSY(e.x,e.y)-12-(e.z||0);
    ctx.globalAlpha=a*.85;kLine(ax,ay,ax+(ex-ax)*drop,ay+(ey-ay)*drop,1,i%2?MAR2:MAR);}ctx.globalAlpha=1;}});}

// ======================================== TENGU ========================================
const WND='#9cead2',WND2='#e8fff8',FEATH='#203a3a';
// LMB FEATHER BLADE: two feathers weaving around each other on a twisting path
function tenFeathers(p,a,dmg){for(const s of [-1,1])kitShot(p.x,p.y,a,250,dmg,{spr:'feather',col:WND,r:2,src:'m',st:'wave',wt:0,wf:16,wa:7*s,pierce:S.pierce});}
// RMB GUST: a wide wall of wind that shoves foes and blows enemy shots back as yours
function tenGust(p,a,dmg,full){const w=full?42:30,dur=full?.62:.46,hit=new Set();
 kitZone({src:'h',t:dur,x:p.x+Math.cos(a)*8,y:p.y+Math.sin(a)*8,a,w,step(z,dt){const ca=Math.cos(z.a),sa=Math.sin(z.a);z.x+=ca*190*dt;z.y+=sa*190*dt;if(solid(z.x,z.y)){z.t=0;return;}
   for(const e of enemies){if(!kitFoe(e))continue;const dx=e.x-z.x,dy=e.y-z.y,al=dx*ca+dy*sa,pe=-dx*sa+dy*ca;if(Math.abs(al)>9+e.r||Math.abs(pe)>z.w+e.r)continue;
    if(!hit.has(e)){hit.add(e);hurtE(e,dmg,24,{src:'h'});}if(!e.boss&&e.type!=='turret'){e.kx=ca*230;e.ky=sa*230;e.act=null;}}
   for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;const dx=q.x-z.x,dy=q.y-z.y,al=dx*ca+dy*sa,pe=-dx*sa+dy*ca;if(Math.abs(al)>10||Math.abs(pe)>z.w)continue;
    kitTurn(q,z.a+rnd(-.15,.15),240,S.atk*.4*AP(),WND,{src:'h'});}},
  top(z){const k=z.age/dur,ca=Math.cos(z.a),sa=Math.sin(z.a);ctx.globalAlpha=Math.min(1,(1-k)*2);
   for(let i=-6;i<=6;i++){const f=i/6,bend=(1-f*f)*6,wx=z.x-sa*f*z.w+ca*bend,wy=z.y+ca*f*z.w+sa*bend,X=HSX(wx,wy),Y=HSY(wx,wy)-8;
    const [vx,vy]=scrVec(ca,sa),l=Math.hypot(vx,vy)||1,len=4+((i*7+Math.floor(time*30))%5);kLine(X-vx/l*len,Y-vy/l*len,X+vx/l*2,Y+vy/l*2,1,Math.abs(i)<3?WND2:WND);}}});}
// Q WIND CUTTER: a spinning blade that ricochets off walls up to 3 times, faster and stronger after each bounce
function tenCutter(p,a,dmg){const q=kitShot(p.x,p.y,a,210,dmg,{spr:'cutter',col:WND,r:5,src:'q',st:'bounce',bn:kitFinal()?5:3,life:2.4,pierce:99,pd:16});
 q.nb=q.bn;q.tick=q=>{if(q.bn<q.nb){q.nb=q.bn;q.vx*=1.25;q.vy*=1.25;q.dmg*=1.15;q.hit=new Set();q.life=Math.max(q.life,.9);sfx('tool');}};}
// E UPDRAFT: leap toward the cursor on the wind, untouchable while airborne; landing blasts foes away
function tenUpdraft(p,dmg){const v=kitAim(p,kitFinal()?120:95),x0=p.x,y0=p.y,dur=.52;P.iv=Math.max(P.iv,dur+.1);
 kitZone({src:'w',t:dur,x0,y0,tx:v.x,ty:v.y,step(z){const k=Math.min(1,z.age/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,nx=z.x0+(z.tx-z.x0)*e,ny=z.y0+(z.ty-z.y0)*e;move(P,nx-P.x,ny-P.y,4);P.lift=Math.sin(k*Math.PI)*22;P.iv=Math.max(P.iv,.08);},
  end(z){P.lift=0;for(const e of kitFoes(P.x,P.y,46)){hurtE(e,dmg,22,{src:'w'});if(!e.boss&&e.type!=='turret'){const an=angTo(P,e);e.kx=Math.cos(an)*260;e.ky=Math.sin(an)*260;e.stun=Math.max(e.stun||0,.4);}}
   tenLandFx(P.x,P.y);sfx('dash');},
  top(z){tenWings(P,P.lift||0,z.age);}});}
function tenLandFx(x,y){topFx({dur:.35,x,y,draw(o,k){ctx.globalAlpha=1-k;for(let i=0;i<10;i++){const an=i/10*TAU,r0=6+k*40,X=HSX(o.x+Math.cos(an)*r0,o.y+Math.sin(an)*r0),Y=HSY(o.x+Math.cos(an)*r0,o.y+Math.sin(an)*r0),X2=HSX(o.x+Math.cos(an)*(r0+6),o.y+Math.sin(an)*(r0+6)),Y2=HSY(o.x+Math.cos(an)*(r0+6),o.y+Math.sin(an)*(r0+6));kLine(X,Y-2,X2,Y2-2,1,i%2?WND:WND2);}}});}
// the tengu's wings, spread while airborne: drawn as layered black feathers behind the shoulders
function tenWings(p,lift,age,scale){const X=HSX(p.x,p.y),Y=HSY(p.x,p.y)-14-lift,fl=Math.sin(age*18)*2,s=scale||1;
 for(const f of [-1,1]){for(let i=0;i<5;i++){const len=Math.round((10-i)*s),x=Math.round(3+i*2.4*s),y=Math.round(-3+i*2+fl*(i/4));KR(X,Y,f,x,y,len,3,'#14101a');KR(X,Y,f,x+1,y+1,len-2,1,i<2?'#3a5a5a':FEATH);if(i===0)KR(X,Y,f,x+1,y,len-3,1,WND);}}}
{const _dp=drawPlayer;drawPlayer=function(){const l=P&&P.lift;if(!l)return _dp.apply(this,arguments);shadow(HSX(P.x,P.y),HSY(P.x,P.y)+2,8);ctx.save();ctx.translate(0,-Math.round(l));try{return _dp.apply(this,arguments);}finally{ctx.restore();}};}
// F CYCLONE: a real tornado that drifts after your cursor, sucks foes in and spins them around it, catches enemy
// shots in orbit, and flings them out as yours when it dies
function tenCyclone(x,y,o){const z=kitZone(Object.assign({x,y,r:30,pull:70,t:3,caught:[],spin:0,drift:55,follow:true,dm:0,src:'f',height:48},o,{
 step(z,dt,tick){z.spin+=dt*9;if(z.follow){const m=mouseWorld(),d=Math.hypot(m.x-z.x,m.y-z.y);if(d>3){const s=Math.min(d,z.drift*dt),nx=z.x+(m.x-z.x)/d*s,ny=z.y+(m.y-z.y)/d*s;if(!solid(nx,ny)){z.x=nx;z.y=ny;}}}
  for(const e of enemies){if(!kitFoe(e))continue;const dx=e.x-z.x,dy=e.y-z.y,d=Math.hypot(dx,dy)||1;if(d>z.pull+e.r||!los(z.x,z.y,e.x,e.y))continue;
   if(e.boss||e.type==='turret'){e.zs=Math.min(e.zs||1,.7);continue;}
   // pulled in and spun around the funnel
   const want=Math.max(8,z.r*.45),inward=d>want?Math.min(d-want,(z.big?150:110)*dt):0,tang=(z.big?5:4)*dt*Math.min(d,30),ux=dx/d,uy=dy/d;
   move(e,-ux*inward-uy*tang,-uy*inward+ux*tang,e.r);e.kx=e.ky=0;if(d<z.r+e.r){e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,.15);e.z=Math.min(14,(e.z||0)+dt*40);e.spun=R.time+.2;}}
  if(tick){z.tk=.3;for(const e of kitFoes(z.x,z.y,z.r)){hurtE(e,z.dm,8,{src:z.src});e.flash=Math.min(e.flash||0,.03);}}
  for(const q of projs){if(q.from!=='e'||q.dead||q.peril||z.caught.length>=24)continue;const d=Math.hypot(q.x-z.x,q.y-z.y);if(d>z.r+12)continue;q.dead=true;z.caught.push({a:Math.atan2(q.y-z.y,q.x-z.x),r:Math.max(10,d),h:4+Math.random()*30,col:q.col});}
  for(const c of z.caught){c.a+=dt*7;c.r+= (14-c.r)*dt;}},
 end(z){for(const e of enemies)if(e.spun>R.time-.3){e.z=0;}for(const c of z.caught){const q=kitShot(z.x,z.y,c.a,250,S.atk*.4*AP(),{col:WND,r:2,src:z.src,pierce:1});}
  if(z.caught.length)sfx('shoot');},
 ground(z){ctx.globalAlpha=.25;wdisc(z.x,z.y,z.r,'#204040');ctx.globalAlpha=1;},
 top(z){tenFunnel(z);}}));return z;}
function tenFunnel(z){const X=HSX(z.x,z.y),Y=HSY(z.x,z.y),H=z.height,fade=z.t<.3?z.t/.3:Math.min(1,z.age/.2),n=z.big?12:9;ctx.globalAlpha=fade;
 // stacked rotating bands, wider at the top, the whole column swaying
 for(let i=0;i<n;i++){const f=i/(n-1),rx=Math.round(5+f*(z.big?46:22)),ry=Math.max(2,Math.round(rx*.35)),cx=X+Math.round(Math.sin(z.spin*.5+f*2.4)*(2+f*5)),cy=Math.round(Y-f*H);
  ctx.strokeStyle=i%3===0?WND2:WND;ctx.globalAlpha=fade*(.55+.35*f);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,z.spin+i,z.spin+i+Math.PI*1.4);ctx.stroke();
  ctx.globalAlpha=fade*.35;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,z.spin+i+Math.PI*1.5,z.spin+i+Math.PI*1.9);ctx.stroke();}
 // caught bullets and debris spinning in it
 for(const c of z.caught){const px=X+Math.round(Math.cos(c.a)*c.r*1.2),py=Math.round(Y-c.h+Math.sin(c.a)*c.r*.4);ctx.globalAlpha=fade;ctx.fillStyle='#14101a';ctx.fillRect(px-1,py-1,3,3);ctx.fillStyle=c.col||'#f66';ctx.fillRect(px,py,1,1);}
 ctx.globalAlpha=1;}
// R HEAVEN'S GALE: a colossal tornado lands on the cursor and drags the room in while giant feathers dive from the
// sky onto everything caught in it
function tenGale(p,dmg,tickDm){const v=kitAim(p,150);const z=tenCyclone(v.x,v.y,{r:kitFinal()?58:48,pull:170,t:3.5,follow:false,dm:tickDm,src:'e',big:true,height:96,drift:0});
 if(kitFinal())for(const s of [-1,1])tenCyclone(v.x+Math.cos(p.aim+s*1.57)*70,v.y+Math.sin(p.aim+s*1.57)*70,{r:24,pull:60,t:2.6,follow:false,dm:tickDm*.6,src:'e',height:44});
 z.fe=0;const st=z.step;z.step=(z,dt,tick)=>{st(z,dt,tick);z.fe-=dt;if(z.fe<=0&&z.age>.3&&z.t>.3){z.fe=.18;const e=kitFoes(z.x,z.y,z.pull).sort(()=>Math.random()-.5)[0];
  const tx=e?e.x+rnd(-4,4):z.x+rnd(-30,30),ty=e?e.y+rnd(-4,4):z.y+rnd(-30,30);topFx({dur:.24,x:tx,y:ty,tg:e,draw:tenDiveFeather,fired:0});}};
 shake=Math.max(shake,6);}
function tenDiveFeather(o,k){const X=HSX(o.x,o.y),Y=HSY(o.x,o.y),fall=Math.round((1-k)*110),y=Y-fall-6;
 if(k>=.98&&!o.fired){o.fired=1;const e=o.tg&&!o.tg.dead?o.tg:kitNearest(o.x,o.y,16);if(e)hurtE(e,S.atk*1.1*AP()*(1+.25*S.epow),20,{src:'e'});spark(o.x,o.y,WND2,3,50);}
 // a long black feather spear diving point-first, with a wind streak behind it
 ctx.globalAlpha=.5;kLine(X+3,y-26,X+1,y-8,1,WND2);ctx.globalAlpha=1;KR(X,y,1,-2,-14,4,14,'#14101a');KR(X,y,1,-1,-13,2,12,FEATH);KR(X,y,1,0,-13,1,12,WND);KR(X,y,1,-1,0,2,3,'#f0f0f0');KR(X,y,1,0,2,1,2,'#ffffff');
 shadow(X,Y,Math.round(2+k*5));}

// ======================================== KAGURA ========================================
const PET='#ff8aab',PET2='#ffe0ea',KGOLD='#ffd36a';
// LMB DANCING CUT: alternating left and right fan cuts
function kagCut(p,a,dmg,r){p.kside=-(p.kside||1);const aa=a+.32*p.kside;let hit=false;
 coneHit(p.x,p.y,aa,r,1.7,e=>{if(!kitFoe(e))return;hit=true;hurtE(e,dmg,16,{slash:true});});
 if(hit)buildFlow(p);fx.push({k:'slash',x:p.x,y:p.y,a:aa,arc:1.7,r,t:.16,dur:.16,col:p.kside>0?PET:PET2});}
// RMB SILK VEIL: a ribbon sweeps in front of you; shots it touches are thrown back as petals at the nearest foe
function kagVeil(p,a,dmg,full){const arc=full?2.9:2.2,r=full?50:40,dur=full?.55:.36,hit=new Set();let got=0;
 kitZone({src:'h',t:dur,a,arc,r,step(z){z.x=P.x;z.y=P.y;
   for(const q of projs){if(got>=10)break;if(q.from!=='e'||q.dead||q.peril)continue;const d=Math.hypot(q.x-z.x,q.y-z.y);if(d>z.r||Math.abs(angDiff(Math.atan2(q.y-z.y,q.x-z.x),z.a))>z.arc/2)continue;
    const e=kitNearest(q.x,q.y,220),ta=e?angTo(q,e):z.a;kitTurn(q,ta,280,S.atk*.5*AP(),PET,{src:'h',spr:'petal'});q.home=true;if(++got<=2)buildFlow(P);if(got>=10)break;}
   coneHit(z.x,z.y,z.a,z.r,z.arc,e=>{if(!kitFoe(e)||hit.has(e))return;hit.add(e);hurtE(e,dmg,20,{slash:true,src:'h'});});},
  top(z){const k=z.age/dur,sweep=z.a-z.arc/2+z.arc*Math.min(1,k*1.6);ctx.globalAlpha=Math.min(1,(1-k)*2.5);
   // the ribbon: a flowing band trailing behind its leading edge
   for(let i=0;i<14;i++){const an=sweep-i*.09;if(an<z.a-z.arc/2)break;const rr=z.r-4+Math.sin(time*20+i)*2,x=z.x+Math.cos(an)*rr,y=z.y+Math.sin(an)*rr,X=HSX(x,y),Y=HSY(x,y)-8,w=i<3?3:2;
    ctx.fillStyle='#14101a';ctx.fillRect(X-1,Y-1,w+2,w+2);ctx.fillStyle=i<2?PET2:i%2?PET:'#ff5c86';ctx.fillRect(X,Y,w,w);}}});}
// Q FAN WALTZ: two fans fly to the cursor, cut a figure eight there, then come back to your hands
function kagWaltz(p,dmg){const v=kitAim(p,125),hits=new Map(),dur=kitFinal()?1.9:1.6;
 kitZone({src:'q',t:dur,cx:v.x,cy:v.y,fans:[{},{}],step(z,dt){const k=z.age;
   z.fans.forEach((f,i)=>{let x,y;const ph=i*Math.PI;
    if(k<.25){const u=k/.25;x=P.x+(z.cx-P.x)*u;y=P.y+(z.cy-P.y)*u;}
    else if(k<dur-.3){const th=(k-.25)*4.6+ph,s=Math.sin(th),c=Math.cos(th),den=1+s*s;x=z.cx+26*c/den;y=z.cy+26*s*c/den;}
    else{const u=(k-(dur-.3))/.3;x=(f.x||z.cx)+(P.x-(f.x||z.cx))*u;y=(f.y||z.cy)+(P.y-(f.y||z.cy))*u;}
    f.x=x;f.y=y;
    for(const e of enemies){if(!kitFoe(e)||Math.hypot(e.x-x,e.y-y)>e.r+8)continue;const key=e.id||e;const t=hits.get(e)||0;if(t>k)continue;hits.set(e,k+.22);hurtE(e,dmg,10,{slash:true,src:'q'});if(Math.random()<.5)buildFlow(P);}});},
  top(z){for(const f of z.fans)if(f.x!=null)kagFan(HSX(f.x,f.y),HSY(f.x,f.y)-9,time*16);}});}
// a spinning folding fan: ribs and a painted leaf, rotating
function kagFan(X,Y,rot){ctx.save();ctx.translate(X,Y);ctx.rotate(rot);ctx.fillStyle='#14101a';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,7,-1.3,1.3);ctx.closePath();ctx.fill();
 ctx.fillStyle=PET;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,6,-1.2,1.2);ctx.closePath();ctx.fill();ctx.strokeStyle=KGOLD;ctx.lineWidth=1;for(const an of [-.8,0,.8]){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*6,Math.sin(an)*6);ctx.stroke();}
 ctx.fillStyle='#fff';ctx.fillRect(3,-1,2,2);ctx.restore();}
// E PIROUETTE: a spinning dash; every foe you pass gets a petal that blooms into a cut a moment later
function kagPirouette(p,a,dmg){const x0=p.x,y0=p.y;rosterShift(p,a,58);const len=Math.hypot(p.x-x0,p.y-y0);
 for(let i=1;i<=4;i++){const f=i/5;topFx({dur:.3,x:x0+(p.x-x0)*f,y:y0+(p.y-y0)*f,f,draw(o,k){const s=heroSpr(CLS().k,P.evo||0);ctx.globalAlpha=(1-k)*.45;drawSpr(s,HSX(o.x,o.y),HSY(o.x,o.y)+3,true,ABPOSE?0:0,Math.floor((o.f*4+k*8))%2===1);}});}
 lineHit(x0,y0,a,len+10,16,e=>{if(!kitFoe(e))return;topFx({dur:.9,e,draw:kagBloom,dm:dmg,done:0});});}
function kagBloom(o,k){const e=o.e;if(e.dead){o.dead=1;return;}const X=HSX(e.x,e.y),Y=HSY(e.x,e.y)-14-(e.z||0),open=k<.66?.15:Math.min(1,(k-.66)/.15);
 if(k>=.66&&!o.done){o.done=1;hurtE(e,o.dm,24,{slash:true,src:'w'});buildFlow(P);sfx('slash');}
 ctx.globalAlpha=k>.9?(1-k)*10:1;for(let i=0;i<5;i++){const an=i/5*TAU+time*(k>.66?6:1),r=2+open*5,px=X+Math.round(Math.cos(an)*r),py=Y+Math.round(Math.sin(an)*r*.8);ctx.fillStyle='#14101a';ctx.fillRect(px-1,py-1,4,3);ctx.fillStyle=i%2?PET:PET2;ctx.fillRect(px,py,2,1);}
 ctx.fillStyle=KGOLD;ctx.fillRect(X,Y,1,1);}
// F RHYTHM: a beat ring closes on you every half second; attacks that land on the beat crit and build double flow
const KBEAT=.5;
function kagRhythm(p){const flow=kaguraFlow(p);p.flow=0;HK.rhythm={t0:R.time,end:R.time+5+flow*.6};}
const onBeat=()=>{const r=HK.rhythm;if(!r||R.time>r.end||kitHero()!=='kagura')return false;const ph=((R.time-r.t0)%KBEAT)/KBEAT;return ph<.18||ph>.88;};
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(P&&R&&onBeat()&&o&&!o.chain&&(o.slash||o.src)&&!e.dead){const now=R.time;if(!(e.beatT>now-.1)){e.beatT=now;dmg*=1.6;if(!(HK.beatFlow>now-.2)){HK.beatFlow=now;buildFlow(P);txtFx(e.x,e.y-6,'ON KBEAT','#ffd36a');}}}return _h.call(this,e,dmg,pd,o);};}
function kagRhythmDraw(){const r=HK.rhythm;if(!r||!P||R.time>r.end||kitHero()!=='kagura')return;const ph=((R.time-r.t0)%KBEAT)/KBEAT,X=HSX(P.x,P.y),Y=HSY(P.x,P.y)-6,rad=Math.round(6+28*(1-ph));
 ctx.strokeStyle=ph<.18||ph>.88?KGOLD:PET;ctx.globalAlpha=ph>.88||ph<.18?.95:.6;ctx.beginPath();ctx.ellipse(X,Y,rad,Math.round(rad*.5),0,0,TAU);ctx.stroke();
 if(ph<.12){ctx.globalAlpha=1-ph/.12;ctx.beginPath();ctx.ellipse(X,Y,9,4,0,0,TAU);ctx.stroke();}ctx.globalAlpha=1;}
// R LOTUS DANCE: you vanish and blink-strike foe after foe, untouchable; a lotus grows on each, and at the end they
// all bloom at once
function kagLotus(p,dmg,bloomDm){const cap=kitFinal()?10:8;let tg=[];let from=p;const pool=kitFoes(p.x,p.y,170);
 while(tg.length<cap&&pool.length){pool.sort((a,b)=>dist(a,from)-dist(b,from));from=pool.shift();tg.push(from);}
 const boss=tg.find(e=>e.boss);while(tg.length&&tg.length<5){tg.push(boss||tg[tg.length%Math.max(1,tg.length)]);}
 if(!tg.length)return false;HK.lotus=[];
 kitZone({src:'e',t:tg.length*.18+.55,tg,i:0,nx:0,lx:p.x,ly:p.y,step(z,dt){P.iv=Math.max(P.iv,.15);z.nx-=dt;
   if(z.i<z.tg.length&&z.nx<=0){z.nx=.18;const e=z.tg[z.i++];if(e.dead)return;const an=angTo(P,e),tx=e.x+Math.cos(an)*(e.r+8),ty=e.y+Math.sin(an)*(e.r+8);
    const lx=P.x,ly=P.y;if(!blocked(tx,ty,4)){P.x=tx;P.y=ty;}P.face=Math.cos(an+Math.PI)>=0?1:-1;P.aim=an+Math.PI;
    hurtE(e,dmg,26,{slash:true,src:'e'});sfx('slash');topFx({dur:.25,x0:lx,y0:ly,x1:P.x,y1:P.y,draw(o,k){ctx.globalAlpha=(1-k)*.8;kLine(HSX(o.x0,o.y0),HSY(o.x0,o.y0)-10,HSX(o.x1,o.y1),HSY(o.x1,o.y1)-10,2,PET2);ctx.globalAlpha=(1-k)*.5;kLine(HSX(o.x0,o.y0),HSY(o.x0,o.y0)-9,HSX(o.x1,o.y1),HSY(o.x1,o.y1)-9,4,PET);}});
    if(!HK.lotus.find(l=>l.e===e))HK.lotus.push(topFx({dur:9,e,draw:kagLotusDraw,open:0}));}
   if(z.i>=z.tg.length&&!z.bloom&&z.nx<=-.3){z.bloom=1;shake=Math.max(shake,6);sfx('rare');for(const l of HK.lotus){l.open=time;const e=l.e;if(!e.dead){hurtE(e,bloomDm,40,{src:'e'});heroReward&&heroReward(1);}}}},
  end(){for(const l of HK.lotus||[]){l.dur=Math.min(l.dur,(time-l.t0)+.4);}}});}
function kagLotusDraw(o,k){const e=o.e;if(!o.open&&e.dead){o.dead=1;return;}const X=HSX(e.x,e.y),Y=HSY(e.x,e.y)-3,u=o.open?Math.min(1,(time-o.open)/.25):0,fade=o.open?Math.max(0,1-(time-o.open-.15)/.3):1;ctx.globalAlpha=Math.min(1,fade+.001);
 // a lotus on the ground under the foe: a closed bud that opens into eight petals
 const n=8;for(let i=0;i<n;i++){const an=i/n*TAU,len=Math.round(3+u*9),px=X+Math.round(Math.cos(an)*len),py=Y+Math.round(Math.sin(an)*len*.5);ctx.fillStyle='#14101a';ctx.fillRect(px-2,py-1,5,3);ctx.fillStyle=i%2?PET:PET2;ctx.fillRect(px-1,py,3,1);}
 ctx.fillStyle=KGOLD;ctx.fillRect(X-1,Y-1,3,2);if(u>0){ctx.strokeStyle=PET2;ctx.globalAlpha=fade*(1-u);ctx.beginPath();ctx.ellipse(X,Y-8,6+u*14,(6+u*14)*.6,0,0,TAU);ctx.stroke();}ctx.globalAlpha=1;}

// ======================================== CHIMIKO ========================================
const BLD='#f65c76',BLD2='#ffd0d8',INK='#3a0812';
// LMB SCARLET INK: a piercing ink dart; three hits on a foe seal it
function chiInk(p,a,dmg){const q=kitShot(p.x,p.y,a,280,dmg,{spr:'ink',col:BLD,r:2,src:'m',pierce:1+S.pierce});q.onHit=(q,e)=>{e.ink=(e.ink||0)+1;if(e.ink>=3){e.ink=0;chiSeal(e);}};}
function chiSeal(e){if(!e.bloodSeal||e.bloodSeal<R.time)topFx({dur:.4,e,draw(o,k){const e=o.e;if(e.dead)return;const X=HSX(e.x,e.y),Y=HSY(e.x,e.y)-26-(e.z||0)-Math.round((1-k)*6);ctx.globalAlpha=k<.5?k*2:1;chiKanji(X,Y);}});e.bloodSeal=R.time+8;}
// the seal mark: a small red talisman with a kanji-like glyph
function chiKanji(X,Y){ctx.fillStyle='#14101a';ctx.fillRect(X-3,Y-4,7,9);ctx.fillStyle='#f4e8d8';ctx.fillRect(X-2,Y-3,5,7);ctx.fillStyle='#c01830';ctx.fillRect(X-1,Y-2,3,1);ctx.fillRect(X,Y-2,1,5);ctx.fillRect(X-1,Y+1,3,1);ctx.fillRect(X-2,Y+3,5,1);}
// sealed foes wear the mark and take +20% damage
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(P&&R&&e.bloodSeal>R.time&&kitHero()==='bloodoracle')dmg*=1.2;return _h.call(this,e,dmg,pd,o);};}
// RMB BLOOD BRUSH: paint a stroke from you to the cursor; it erupts into spikes a moment later. A full charge leaves
// the stroke standing as a wall that blocks enemy shots.
function chiBrush(p,dmg,full,o){const v=kitAim(p,o&&o.len||145),x0=o&&o.x0!=null?o.x0:p.x,y0=o&&o.y0!=null?o.y0:p.y,x1=o&&o.x1!=null?o.x1:v.x,y1=o&&o.y1!=null?o.y1:v.y,a=Math.atan2(y1-y0,x1-x0),len=Math.hypot(x1-x0,y1-y0),paint=o&&o.paint||.14,delay=o&&o.delay||.35,wall=full?2:0,w=o&&o.w||5;
 return kitZone({src:o&&o.src||'h',t:delay+.25+wall,x0,y0,x1,y1,a,len,w,step(z){if(z.age>=delay&&!z.boom){z.boom=1;lineHit(z.x0,z.y0,z.a,z.len,z.w+6,e=>{if(kitFoe(e))hurtE(e,dmg,30,{src:z.src});});shake=Math.max(shake,2);sfx('break');}
   if(wall&&z.boom){const ca=Math.cos(z.a),sa=Math.sin(z.a);for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;const dx=q.x-z.x0,dy=q.y-z.y0,al=dx*ca+dy*sa,pe=Math.abs(-dx*sa+dy*ca);if(al>-2&&al<z.len+2&&pe<z.w+3){q.dead=true;spark(q.x,q.y,BLD,2,30);}}}},
  ground(z){const u=Math.min(1,z.age/paint),fade=z.t<.25?z.t/.25:1,ca=Math.cos(z.a),sa=Math.sin(z.a);ctx.globalAlpha=fade;
   // a tapered brush stroke: thick at the start, thinning with a dry-brush tail, painted along over a moment
   const L=z.len*u;for(let d=0;d<=L;d+=1.5){const f=d/Math.max(1,z.len),wd=Math.max(1,Math.round(z.w*(1.2-f*.7)+Math.sin(d*.7)*.6)),x=z.x0+ca*d,y=z.y0+sa*d,X=HSX(x,y),Y=HSY(x,y);
    ctx.fillStyle=INK;ctx.fillRect(X-wd,Y-Math.ceil(wd/2),wd*2,wd);ctx.fillStyle=z.boom?'#c01830':'#8a1024';ctx.fillRect(X-wd+1,Y-Math.ceil(wd/2)+1,Math.max(1,wd*2-2),Math.max(1,wd-2));}
   ctx.globalAlpha=1;},
  top(z){if(!z.boom)return;const k=Math.min(1,(z.age-delay)/.25),ca=Math.cos(z.a),sa=Math.sin(z.a);if(k>=1&&!wall)return;ctx.globalAlpha=wall?.9:(1-k);
   // crimson spikes rising out of the stroke
   for(let d=4;d<z.len;d+=9){const x=z.x0+ca*d,y=z.y0+sa*d,X=HSX(x,y),Y=HSY(x,y),h=Math.round((wall?8:12)*Math.min(1,k*3)*(.7+.3*Math.sin(d)));ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-h-1,4,h+1);ctx.fillStyle=BLD;ctx.fillRect(X-1,Y-h,2,h);ctx.fillStyle=BLD2;ctx.fillRect(X-1,Y-h,1,2);}}});}
// Q BLOOD SEAL: spend 6% HP; a seal talisman flies out and the seal jumps from the first foe to up to 5 near it
function chiSealShot(p,a,dmg){const cost=S.maxhp*.06;if(p.hp<=cost+1)return false;p.hp-=cost;txtFx(p.x,p.y-8,'-'+Math.round(cost),'#f65c76');
 const q=kitShot(p.x,p.y,a,250,dmg,{spr:'talisman',col:BLD,r:3,src:'q',life:.7});
 q.onHit=(q,e)=>{const done=[e];chiSeal(e);let from=e;const cap=kitFinal()?8:5;
  for(let i=0;i<cap;i++){const n=kitNearest(from.x,from.y,80,o=>done.includes(o));if(!n)break;done.push(n);fx.push({k:'bolt',pts:[{x:from.x,y:from.y},{x:n.x,y:n.y}],col:BLD,t:.2,dur:.2});chiSeal(n);hurtE(n,dmg*.6,10,{src:'q'});from=n;}};}
// E BLOOD MIRROR: swap places with the sealed (or nearest) foe near the cursor; shots meant for you hit it instead
function chiMirror(p,a){const v=kitAim(p,150);const e=kitNearest(v.x,v.y,70,o=>o.boss||o.type==='turret'||!(o.bloodSeal>R.time))||kitNearest(v.x,v.y,60,o=>o.boss||o.type==='turret');
 if(!e){rosterShift(p,a,52);return;}const px=p.x,py=p.y;p.x=e.x;p.y=e.y;e.x=px;e.y=py;e.mirror=R.time+1.2;e.act=null;e.tele=0;p.iv=Math.max(p.iv,.35);sfx('dash');
 for(const pt of [{x:px,y:py},{x:p.x,y:p.y}])topFx({dur:.35,x:pt.x,y:pt.y,draw(o,k){const X=HSX(o.x,o.y),Y=HSY(o.x,o.y)-10;ctx.globalAlpha=1-k;for(let i=0;i<8;i++){const an=i/8*TAU+k*2,r=4+k*16;ctx.fillStyle=i%2?BLD:BLD2;ctx.fillRect(X+Math.round(Math.cos(an)*r),Y+Math.round(Math.sin(an)*r*.7),2,3);}}});}
function chiMirrorTick(){for(const e of enemies){if(!(e.mirror>R.time)||e.dead)continue;for(const q of projs){if(q.from!=='e'||q.dead||q.peril||q.own===e)continue;if(Math.hypot(q.x-e.x,q.y-e.y)<e.r+3){q.dead=true;hurtE(e,S.atk*.8+q.dmg*2,12,{src:'w'});spark(q.x,q.y,BLD,3,40);}}}}
// F HARVEST: red threads tear blood orbs out of every sealed foe; the orbs fly back to you, healing you and hurting
// whatever they pass through
function chiHarvest(p,dmg){const marked=enemies.filter(e=>!e.dead&&e.bloodSeal>R.time).slice(0,kitFinal()?12:8);if(!marked.length)return false;let healed=0;
 kitZone({src:'f',t:.42,marked,step(){},end(z){for(const e of z.marked){if(e.dead)continue;e.bloodSeal=0;hurtE(e,dmg,20,{src:'f'});
   const q=kitShot(e.x,e.y,angTo(e,P),150,dmg*.35,{spr:'orb',col:BLD,r:3,src:'f',life:2,pierce:99});
   q.tick=(q,dt)=>{const an=angTo(q,P),sp=Math.min(320,Math.hypot(q.vx,q.vy)+500*dt);q.vx=Math.cos(an)*sp;q.vy=Math.sin(an)*sp;if(dist(q,P)<8){q.dead=true;if(healed<S.maxhp*.16){const h=S.maxhp*.035;healed+=h;P.hp=Math.min(S.maxhp,P.hp+h);txtFx(P.x,P.y-10,'+'+Math.round(h),'#50e060');}}};}
   sfx('heal');},
  top(z){const k=z.age/.42;for(const e of z.marked){if(e.dead)continue;ctx.globalAlpha=.8;const X0=HSX(P.x,P.y),Y0=HSY(P.x,P.y)-10,X1=HSX(e.x,e.y),Y1=HSY(e.x,e.y)-10;
   const mx=(X0+X1)/2,my=(Y0+Y1)/2-10*(1-k);ctx.strokeStyle=BLD;ctx.beginPath();ctx.moveTo(X0,Y0);ctx.quadraticCurveTo(mx,my,X1,Y1);ctx.stroke();}ctx.globalAlpha=1;}});}
// R CRIMSON MOON: a blood moon rises; a giant kanji is painted stroke by stroke across the cursor and each stroke
// erupts. For 4s, sealed foes that die burst into blood lances that seek more foes.
const KANJI=[[[-34,-26],[34,-26]],[[0,-40],[0,34]],[[-30,6],[30,6]],[[-26,-14],[-36,30]],[[26,-14],[38,30]]];
function chiMoon(p,dmg){const c=kitAim(p,120);for(const e of kitFoes(p.x,p.y,150).slice(0,kitFinal()?12:8))chiSeal(e);HK.moon=R.time+4;
 KANJI.forEach((s,i)=>{const t=.25+i*.2;
  kitZone({src:'e',t:t+.01,step(z){},end(z){chiBrush(P,dmg,false,{x0:c.x+s[0][0],y0:c.y+s[0][1],x1:c.x+s[1][0],y1:c.y+s[1][1],paint:.16,delay:.22,w:7,src:'e'});}});});
 topFx({dur:4.2,draw(o,k){const rise=Math.min(1,k*4.2/.6),fade=k>.92?(1-k)/.08:1,X=W-56,Y=Math.round(52-rise*20);ctx.globalAlpha=.85*fade;
  // the blood moon: a big red disc with darker maria and a pale rim, hanging in the sky over the fight
  ctx.fillStyle='#14101a';ctx.beginPath();ctx.arc(X,Y,23,0,TAU);ctx.fill();ctx.fillStyle='#b01828';ctx.beginPath();ctx.arc(X,Y,22,0,TAU);ctx.fill();ctx.fillStyle='#e03048';ctx.beginPath();ctx.arc(X-3,Y-3,18,0,TAU);ctx.fill();
  ctx.fillStyle='#901020';for(const [mx,my,mr] of [[-8,-6,5],[6,4,6],[-2,10,3],[9,-9,3]]){ctx.beginPath();ctx.arc(X+mx,Y+my,mr,0,TAU);ctx.fill();}ctx.strokeStyle=BLD2;ctx.globalAlpha=.5*fade;ctx.beginPath();ctx.arc(X,Y,22,-2.4,-.6);ctx.stroke();
  // a red tint over the world while the moon is up
  ctx.globalAlpha=.08*fade;ctx.fillStyle='#ff0020';ctx.fillRect(0,0,W,H);}});}
{const _k=killE;killE=function(e){const sealed=e&&e.bloodSeal>R.time&&HK.moon>R.time&&kitHero()==='bloodoracle';const r=_k.apply(this,arguments);
 if(sealed){for(let i=0;i<3;i++){const tg=kitNearest(e.x,e.y,160,o=>o===e);const an=tg?angTo(e,tg)+rnd(-.5,.5):i/3*TAU;const q=kitShot(e.x,e.y,an,220,S.atk*1.4*AP()*(1+.25*S.epow),{spr:'lance',col:BLD,r:3,src:'e',home:true,life:1.1,pierce:1});}}return r;};}

// ======================================== KANEMORI ========================================
const BEL='#ffda83',BEL2='#fff3c7',BRZ='#a0702a',BRZ2='#5a3a14';
// draw a temple bell: bronze, banded, with a lip; s = scale, X,Y = bottom centre
function bellDraw(X,Y,s,lit){const o='#14101a',b=lit?BEL:BRZ,d=lit?'#c09040':BRZ2,hi=lit?'#ffffff':'#e0b060',H=Math.round(16*s);
 // a bell's profile, row by row from the crown down: a round dome, a body that widens slowly, then a flared lip
 const half=f=>f<.18?3+Math.sqrt(f/.18)*4.2:f<.82?7.2+(f-.18)*3.2:9.2+(f-.82)/.18*2.6;
 // the hanging loop on top
 const lw=Math.max(1,Math.round(2*s)),lh=Math.round(3*s);ctx.fillStyle=o;ctx.fillRect(X-lw-1,Y-H-lh-1,lw*2+2,lh+2);ctx.fillStyle=d;ctx.fillRect(X-lw,Y-H-lh,lw*2,lh);ctx.fillStyle=o;ctx.fillRect(X-Math.max(1,Math.round(s))+0,Y-H-lh+Math.round(s),Math.max(1,Math.round(s)),Math.max(1,lh-2*Math.round(s)));
 for(let r=0;r<H;r++){const f=r/(H-1),w=Math.round(half(f)*s),y=Y-H+r;ctx.fillStyle=o;ctx.fillRect(X-w-1,y,w*2+2,1);}
 ctx.fillStyle=o;ctx.fillRect(X-Math.round(half(0)*s),Y-H-1,Math.round(half(0)*s)*2,1);ctx.fillRect(X-Math.round(half(1)*s)-1,Y,Math.round(half(1)*s)*2+2,1);
 for(let r=0;r<H;r++){const f=r/(H-1),w=Math.round(half(f)*s),y=Y-H+r;if(w<1)continue;
  ctx.fillStyle=b;ctx.fillRect(X-w,y,w*2,1);ctx.fillStyle=d;ctx.fillRect(X+Math.round(w*.35),y,w-Math.round(w*.35),1);
  ctx.fillStyle=hi;if(f>.12&&f<.8)ctx.fillRect(X-w+Math.max(1,Math.round(s)),y,Math.max(1,Math.round(s)),1);}
 // bands round the waist and above the lip, and rows of studs on the shoulder
 ctx.fillStyle=d;for(const f of [.5,.84]){const y=Y-H+Math.round(f*(H-1)),w=Math.round(half(f)*s);ctx.fillRect(X-w,y,w*2,Math.max(1,Math.round(s*.8)));}
 for(let i=-2;i<=2;i++){const y=Y-H+Math.round(.3*H),x=X+Math.round(i*2.4*s);ctx.fillStyle=o;ctx.fillRect(x-1,y-1,Math.max(1,Math.round(s))+2,Math.max(1,Math.round(s))+2);ctx.fillStyle=lit?BEL2:'#d8a050';ctx.fillRect(x,y,Math.max(1,Math.round(s)),Math.max(1,Math.round(s)));}
 // the striking boss on the front
 const bx=X-Math.round(2*s),by=Y-Math.round(H*.32);ctx.fillStyle=o;ctx.fillRect(bx-1,by-1,Math.round(3*s)+2,Math.round(3*s)+2);ctx.fillStyle=lit?BEL2:d;ctx.fillRect(bx,by,Math.round(3*s),Math.round(3*s));}
// LMB BELL SWING: a wide arc that also smashes up to 3 enemy shots in it, storing their echo
function kanSwing(p,a,dmg){coneHit(p.x,p.y,a,37,2.5,e=>{if(kitFoe(e))hurtE(e,dmg,18,{slash:true});});let n=0;
 for(const q of kitBullets(p.x,p.y,37)){if(n>=3)break;if(Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a))>1.25)continue;q.dead=true;n++;spark(q.x,q.y,BEL,2,40);}if(n)addEcho(n);
 fx.push({k:'slash',x:p.x,y:p.y,a,arc:2.5,r:37,t:.2,dur:.2,col:BEL});}
// RMB IRON BELL: hurl the bell on its chain; it lands, stands as a shield that soaks shots for echo, then is yanked
// back through the foes between it and you
function kanBell(p,dmg,full){const v=kitAim(p,115),hold=full?3.4:2.4,hitBack=new Set();
 kitZone({src:'h',t:.24+hold+.26,x0:p.x,y0:p.y,tx:v.x,ty:v.y,x:p.x,y:p.y,h:0,step(z,dt){const k=z.age;
   if(k<.24){const u=k/.24;z.x=z.x0+(z.tx-z.x0)*u;z.y=z.y0+(z.ty-z.y0)*u;z.h=Math.sin(u*Math.PI)*26;return;}
   if(!z.landed){z.landed=1;z.h=0;z.x=z.tx;z.y=z.ty;for(const e of kitFoes(z.x,z.y,16))hurtE(e,dmg,full?50:36,{src:'h'});for(const e of kitFoes(z.x,z.y,26))if(!e.boss&&e.type!=='turret'){const an=angTo(z,e);e.kx=Math.cos(an)*180;e.ky=Math.sin(an)*180;}impact(z.x,z.y,BEL,4);sfx('break');}
   if(k<.24+hold){let n=0;for(const q of kitBullets(z.x,z.y,14)){q.dead=true;n++;spark(q.x,q.y,BEL,2,30);}if(n){addEcho(n);z.ring=time;}return;}
   const u=Math.min(1,(k-.24-hold)/.26),bx=z.tx+(P.x-z.tx)*u,by=z.ty+(P.y-z.ty)*u;z.x=bx;z.y=by;z.h=4;
   for(const e of kitFoes(bx,by,12))if(!hitBack.has(e)){hitBack.add(e);hurtE(e,dmg*.6,20,{src:'h',kb:angTo(e,P)});}},
  top(z){const X0=HSX(P.x,P.y)+2,Y0=HSY(P.x,P.y)-12,X=HSX(z.x,z.y),Y=HSY(z.x,z.y)-Math.round(z.h||0);
   // the chain: alternating links from your hand to the bell
   const n=Math.max(2,Math.round(Math.hypot(X-X0,Y-Y0)/4));for(let i=1;i<n;i++){const f=i/n,cx=Math.round(X0+(X-X0)*f),cy=Math.round(Y0+(Y-12-Y0)*f+Math.sin(f*Math.PI)*4);ctx.fillStyle='#14101a';ctx.fillRect(cx-1,cy-1,3,3);ctx.fillStyle=i%2?'#c8c0b0':'#7a7468';ctx.fillRect(cx,cy,1,1);}
   shadow(X,HSY(z.x,z.y),12);const shake2=z.ring&&time-z.ring<.15?Math.round(Math.sin(time*80)):0;bellDraw(X+shake2,Y+1,1,z.ring&&time-z.ring<.15);}});}
// Q STANDING WAVE: three sound waves roll out along your aim, piercing, shoving foes and destroying shots
function kanWaves(p,a,dmg){for(let i=0;i<3;i++){const hit=new Set();
 kitZone({src:'q',t:.62+i*.12,delay:i*.12,a,x:p.x,y:p.y,w:16+i*4,step(z,dt){if(z.age<z.delay){z.x=P.x;z.y=P.y;return;}const ca=Math.cos(z.a),sa=Math.sin(z.a);z.x+=ca*200*dt;z.y+=sa*200*dt;if(solid(z.x,z.y)){z.t=0;return;}
   for(const e of enemies){if(!kitFoe(e)||hit.has(e))continue;const dx=e.x-z.x,dy=e.y-z.y,al=dx*ca+dy*sa,pe=-dx*sa+dy*ca;if(Math.abs(al)>6+e.r||Math.abs(pe)>z.w+e.r)continue;hit.add(e);hurtE(e,dmg,18,{src:'q'});if(!e.boss&&e.type!=='turret'){e.kx+=ca*150;e.ky+=sa*150;}}
   let n=0;for(const q of projs){if(q.from!=='e'||q.dead||q.peril)continue;const dx=q.x-z.x,dy=q.y-z.y,al=dx*ca+dy*sa,pe=-dx*sa+dy*ca;if(Math.abs(al)<7&&Math.abs(pe)<z.w){q.dead=true;n++;}}if(n)addEcho(Math.min(2,n));},
  top(z){if(z.age<z.delay)return;const ca=Math.cos(z.a),sa=Math.sin(z.a),fade=Math.min(1,z.t/.2);ctx.globalAlpha=fade;
   for(let j=0;j<2;j++){let px=null,py=null;for(let i=-8;i<=8;i++){const f=i/8,bend=(1-f*f)*(7-j*3),wx=z.x-sa*f*z.w+ca*(bend-j*3),wy=z.y+ca*f*z.w+sa*(bend-j*3),X=HSX(wx,wy),Y=HSY(wx,wy)-8;if(px!=null)kLine(px,py,X,Y,j?1:2,j?BEL2:BEL);px=X;py=Y;}}}});}}
// E SANCTUARY: a great bell drops over you: untouchable, shots that hit it become echo, and when it lifts its toll
// stuns the foes right next to you
function kanSanctuary(p,dmg){const dur=kitFinal()?1.1:.9;P.iv=Math.max(P.iv,dur+.05);
 kitZone({src:'w',t:dur,step(z){z.x=P.x;z.y=P.y;let n=0;for(const q of kitBullets(P.x,P.y,16)){q.dead=true;n++;}if(n){addEcho(n);z.ring=time;}},
  end(z){for(const e of kitFoes(P.x,P.y,30)){hurtE(e,dmg,40,{src:'w'});if(!e.boss)e.stun=Math.max(e.stun||0,1);}fxRing(P.x,P.y,30,BEL,.25);sfx('boss');},
  top(z){const drop=Math.max(0,1-z.age/.12),lift=z.t<.12?1-z.t/.12:0,X=HSX(P.x,P.y),Y=HSY(P.x,P.y)+3-Math.round((drop+lift)*30),j=z.ring&&time-z.ring<.12?Math.round(Math.sin(time*90)):0;bellDraw(X+j,Y,1.7,z.ring&&time-z.ring<.12);}});}
{const _dp=drawPlayer;drawPlayer=function(){if(zones.some(z=>z.k==='kit'&&z.src==='w'&&z.t>.12&&z.age>.1&&kitHero()==='bellwarden'))return;return _dp.apply(this,arguments);};}
// F ECHO NOTES: each stored echo becomes a note that ricochets between foes
function kanNotes(p,dmg){const n=Math.min(12,p.bellEcho||0);if(!n)return false;p.bellEcho=0;heroReward(n);
 for(let i=0;i<n;i++){const an=p.aim+(i-(n-1)/2)*.22,q=kitShot(p.x,p.y,an,170+i*6,dmg,{spr:'note',col:BEL,r:3,src:'f',life:1.4,pierce:2,home:true,bounces:2});
  q.onHit=(q,e)=>{const nx=kitNearest(e.x,e.y,120,o=>q.hit.has(o));if(nx){const a2=angTo(q,nx),sp=Math.hypot(q.vx,q.vy);q.vx=Math.cos(a2)*sp;q.vy=Math.sin(a2)*sp;q.life=Math.max(q.life,.6);}};}}
// R HEAVEN'S BELL: a colossal bell falls from the sky onto the cursor and rings three times. Each ring freezes every
// enemy shot in place; the last ring turns them all into your shots, fired at the nearest foes.
function kanHeaven(p,dmg,ringDm){const v=kitAim(p,135),frozen=[];
 kitZone({src:'e',t:2.6,x:v.x,y:v.y,rings:[],step(z,dt){const k=z.age;
   if(k>=.45&&!z.landed){z.landed=1;for(const e of kitFoes(z.x,z.y,26))hurtE(e,dmg,90,{src:'e'});for(const e of kitFoes(z.x,z.y,60))if(!e.boss&&e.type!=='turret'){const an=angTo(z,e);e.kx=Math.cos(an)*240;e.ky=Math.sin(an)*240;}impact(z.x,z.y,BEL,10);sfx('break');shake=Math.max(shake,9);}
   for(const [i,t] of [[0,.95],[1,1.55],[2,2.15]].map(([i,t])=>[i,t])){if(k>=t&&!z.rings[i]){z.rings[i]=time;sfx('boss');
     for(const q of projs)if(q.from==='e'&&!q.dead&&!q.peril){q.dead=true;if(frozen.length<36)frozen.push({x:q.x,y:q.y,col:q.col,r:q.r||3});}
     for(const e of kitFoes(z.x,z.y,100))hurtE(e,ringDm,30,{src:'e'});
     if(i===2){for(const f of frozen){const e=kitNearest(f.x,f.y,260);const an=e?angTo(f,e):Math.random()*TAU;kitShot(f.x,f.y,an,280,S.atk*.6*AP()*(1+.25*S.epow),{col:BEL,r:2,src:'e',home:true,pierce:1,life:1.3});}if(frozen.length)addEcho(Math.min(6,Math.ceil(frozen.length/4)));frozen.length=0;}}}},
  top(z){const k=z.age,X=HSX(z.x,z.y),Y=HSY(z.x,z.y)+2;
   // frozen shots, hanging in gold
   for(const f of frozen){const fx0=HSX(f.x,f.y),fy=HSY(f.x,f.y)-7;ctx.fillStyle='#14101a';ctx.fillRect(fx0-2,fy-2,5,5);ctx.fillStyle=Math.floor(time*8)%2?BEL:BEL2;ctx.fillRect(fx0-1,fy-1,3,3);}
   // the bell: a growing shadow, then it falls from the sky and stands, shaking as it rings
   if(k<.45){const u=k/.45;ctx.globalAlpha=.25+.4*u;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(X,Y,Math.round(8+u*22),Math.round(3+u*8),0,0,TAU);ctx.fill();ctx.globalAlpha=1;bellDraw(X,Math.round(Y-(1-u*u)*160),2.6,false);return;}
   ctx.globalAlpha=.4;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(X,Y,30,11,0,0,TAU);ctx.fill();ctx.globalAlpha=z.t<.25?z.t/.25:1;
   const lit=z.rings.some(t=>t&&time-t<.2),j=lit?Math.round(Math.sin(time*90)*2):0;bellDraw(X+j,Y,2.6,lit);
   for(const t of z.rings){if(!t)continue;const u=(time-t)/.6;if(u>1)continue;ctx.globalAlpha=(1-u)*.9;ctx.strokeStyle=u<.3?BEL2:BEL;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y-14,20+u*W*.6,(20+u*W*.6)*.5,0,0,TAU);ctx.stroke();ctx.lineWidth=1;}ctx.globalAlpha=1;}});}

// ======================================== projectile looks ========================================
Object.assign(PSPR,{
 needle(X,Y,ux,uy,q){if(q.tr&&q.tr.length>1){ctx.globalAlpha=.55;for(let i=1;i<q.tr.length;i++){const a=q.tr[i-1],b=q.tr[i];kLine(HSX(a[0],a[1]),HSY(a[0],a[1])-7,HSX(b[0],b[1]),HSY(b[0],b[1])-7,1,MAR2);}ctx.globalAlpha=1;}
  kLine(X-ux*5,Y-uy*5,X+ux*3,Y+uy*3,2,'#14101a');kLine(X-ux*4,Y-uy*4,X+ux*3,Y+uy*3,1,'#e8eef6');ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);ctx.fillStyle=MAR;ctx.fillRect(Math.round(X-ux*4),Math.round(Y-uy*4),1,1);},
 hook(X,Y,ux,uy,q){const X0=HSX(P.x,P.y)+3,Y0=HSY(P.x,P.y)-14;kLine(X0,Y0,X,Y,1,MAR2);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X)-2,Math.round(Y)-2,5,5);ctx.fillStyle='#c8c8d0';ctx.fillRect(Math.round(X+ux*2)-1,Math.round(Y+uy*2)-1,2,2);ctx.fillRect(Math.round(X-uy*2),Math.round(Y+ux*2),1,2);ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);},
 feather(X,Y,ux,uy){kLine(X-ux*5,Y-uy*5,X+ux*3,Y+uy*3,3,'#14101a');kLine(X-ux*4,Y-uy*4,X+ux*2,Y+uy*2,1,FEATH);ctx.fillStyle=WND;ctx.fillRect(Math.round(X+ux*2),Math.round(Y+uy*2),1,1);ctx.fillStyle=WND2;ctx.fillRect(Math.round(X-ux*4-uy),Math.round(Y-uy*4+ux),1,1);},
 cutter(X,Y,ux,uy,q){const r=time*24;ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X)-2,Math.round(Y)-2,5,5);for(let i=0;i<4;i++){const an=r+i*TAU/4,px=Math.round(X+Math.cos(an)*4),py=Math.round(Y+Math.sin(an)*3);kLine(X,Y,px,py,2,'#14101a');kLine(X,Y,px,py,1,i%2?WND:WND2);}ctx.fillStyle='#fff';ctx.fillRect(Math.round(X),Math.round(Y),1,1);},
 petal(X,Y){ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X)-2,Math.round(Y)-1,5,4);ctx.fillStyle=PET;ctx.fillRect(Math.round(X)-1,Math.round(Y),3,2);ctx.fillStyle=PET2;ctx.fillRect(Math.round(X)-1,Math.round(Y),1,1);},
 ink(X,Y,ux,uy){kLine(X-ux*4,Y-uy*4,X,Y,1,'#8a1024');ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X)-2,Math.round(Y)-2,4,4);ctx.fillStyle='#c01830';ctx.fillRect(Math.round(X)-1,Math.round(Y)-1,2,2);ctx.fillStyle=BLD2;ctx.fillRect(Math.round(X)-1,Math.round(Y)-1,1,1);},
 talisman(X,Y,ux,uy){ctx.save();ctx.translate(Math.round(X),Math.round(Y));ctx.rotate(time*10);ctx.fillStyle='#14101a';ctx.fillRect(-3,-5,6,10);ctx.fillStyle='#f4e8d8';ctx.fillRect(-2,-4,4,8);ctx.fillStyle='#c01830';ctx.fillRect(-1,-3,2,1);ctx.fillRect(0,-3,1,5);ctx.fillRect(-1,1,2,1);ctx.restore();},
 orb(X,Y){ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X)-3,Math.round(Y)-3,6,6);ctx.fillStyle='#c01830';ctx.fillRect(Math.round(X)-2,Math.round(Y)-2,4,4);ctx.fillStyle=BLD2;ctx.fillRect(Math.round(X)-1,Math.round(Y)-2,1,1);},
 lance(X,Y,ux,uy){kLine(X-ux*7,Y-uy*7,X+ux*4,Y+uy*4,3,'#14101a');kLine(X-ux*6,Y-uy*6,X+ux*3,Y+uy*3,1,BLD);ctx.fillStyle=BLD2;ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);},
 note(X,Y){const x=Math.round(X),y=Math.round(Y+Math.sin(time*12+X)*1.5);ctx.fillStyle='#14101a';ctx.fillRect(x-3,y,5,4);ctx.fillRect(x,y-6,3,8);ctx.fillStyle=BEL;ctx.fillRect(x-2,y+1,3,2);ctx.fillRect(x+1,y-5,1,6);ctx.fillRect(x+1,y-5,2,1);}});

// ======================================== wiring ========================================
function kitTick(dt){if(mode!=='play'||!P)return;marLinks(dt);marDollTick(dt);chiMirrorTick();
 // anything lifted by the wind settles back down once it is out of the funnel
 for(const e of enemies)if(e.z>0&&!e.sumoFlight&&!(e.spun>R.time))e.z=Math.max(0,e.z-dt*60);}
{const _u=update;update=function(dt){_u.apply(this,arguments);try{if(mode==='play'&&!paused)kitTick(dt);}catch(_){}};}
{const _rp=drawPortal;drawPortal=function(){_rp.apply(this,arguments);kagRhythmDraw();
 // links: threads between linked foes (Marionettist)
 if(HK.links)for(const L of HK.links){const live=L.list.filter(e=>!e.dead&&e.threadUntil>R.time);for(let i=1;i<live.length;i++){const a=live[i-1],b=live[i];ctx.globalAlpha=.7;marString(a.x,a.y,b.x,b.y,0,MAR);}ctx.globalAlpha=1;}};}
// [hero, old name, new name, cooldown, description, cast]
const KITDEF=[
 ['marionettist','NEEDLE CAST','SILK NEEDLE',0,'A FAST NEEDLE THAT STITCHES FOES.',({p,a,A,bp,em})=>{marNeedle(p,a,A*1.05*bp*em);p.atkCd=.31/S.aspd;}],
 ['marionettist','PUPPET LASH','REEL IN',1.3,'HOOK A FOE AND YANK IT TO YOU.',({p,a,A,bp,em})=>marReel(p,a,A*2.3*bp*em,p.hFull)],
 ['marionettist','CURSED THREAD','CURSED THREAD',5,'A SPOOL LINKS FOES. HIT ONE, HURT ALL.',({p,a,A,qm,em})=>marSpool(p,a,A*1.3*qm*em)],
 ['marionettist','THREAD STEP','SWAP DOLL',8,'LEAVE A DECOY DOLL AND LEAP BACK.',({p,a})=>marDoll(p,a)],
 ['marionettist','COCOON','PUPPET DANCE',10,'LIFT A FOE ON STRINGS AND SWING IT.',({p,A,ap,em})=>marPuppet(p,A*1.6*ap*em)],
 ['marionettist','PUPPET MASTER','GRAND THEATRE',28,'HOIST FOES ON STRINGS, THEN SLAM THEM.',({p,A,ep,em})=>marTheatre(p,A*4.4*ep*em)],
 ['tengu','FEATHER BLADE','FEATHER BLADE',0,'TWO FEATHERS WEAVING AROUND EACH OTHER.',({p,a,A,bp,em})=>{tenFeathers(p,a,A*.68*bp*em);p.atkCd=.25/S.aspd;}],
 ['tengu','GALE WING','GUST',1.2,'A WALL OF WIND: SHOVES FOES, RETURNS SHOTS.',({p,a,A,bp,em})=>tenGust(p,a,A*1.3*bp*em,p.hFull)],
 ['tengu','WIND CUTTER','WIND CUTTER',4.5,'A BLADE THAT RICOCHETS OFF WALLS.',({p,a,A,qm,em})=>tenCutter(p,a,A*1.05*qm*em)],
 ['tengu','TAILWIND','UPDRAFT',6,'LEAP ON THE WIND, UNTOUCHABLE.',({p,A,ap,em})=>tenUpdraft(p,A*1.4*ap*em)],
 ['tengu','CYCLONE','CYCLONE',9,'A TORNADO THAT SWALLOWS FOES AND SHOTS.',({p,a,A,ap,em})=>{tenCyclone(p.x+Math.cos(a)*24,p.y+Math.sin(a)*24,{dm:A*.26*ap*em,t:kitFinal()?3.6:3});}],
 ['tengu','DIVINE TEMPEST',"HEAVEN'S GALE",27,'A COLOSSAL TORNADO AND DIVING FEATHERS.',({p,A,ep,em})=>tenGale(p,A*1.1*ep*em,A*.4*ep*em)],
 ['kagura','DANCING CUT','DANCING CUT',0,'ALTERNATING FAN CUTS BUILD FLOW.',({p,a,A,bp,em})=>{const b=p.flowBoost>R.time;kagCut(p,a,A*bp*em*(b?1.45:1.2),b?44:36);p.atkCd=.29/S.aspd;}],
 ['kagura','CRIMSON SWEEP','SILK VEIL',1.3,'A RIBBON THAT THROWS SHOTS BACK.',({p,a,A,bp,em})=>kagVeil(p,a,A*1.5*bp*em,p.hFull)],
 ['kagura','CRESCENT FAN','FAN WALTZ',5,'FANS DANCE A FIGURE EIGHT AT THE CURSOR.',({p,A,qm,em})=>kagWaltz(p,A*.62*qm*em)],
 ['kagura','PIROUETTE','PIROUETTE',6,'A SPINNING DASH. PASSED FOES BLOOM.',({p,a,A,ap,em})=>kagPirouette(p,a,A*2.1*ap*em)],
 ['kagura','PERFECT RHYTHM','RHYTHM',12,'HIT ON THE KBEAT FOR CRITS AND FLOW.',({p})=>kagRhythm(p)],
 ['kagura','THOUSAND PETALS','LOTUS DANCE',27,'BLINK FROM FOE TO FOE. LOTUSES BLOOM.',({p,A,ep,em})=>kagLotus(p,A*1.6*ep*em,A*2.6*ep*em)],
 ['bloodoracle','SCARLET INK','SCARLET INK',0,'INK DARTS. 3 HITS SEAL A FOE.',({p,a,A,bp,em})=>{chiInk(p,a,A*1.15*bp*em);p.atkCd=.32/S.aspd;}],
 ['bloodoracle','RED SCRIBE','BLOOD BRUSH',1.3,'PAINT A STROKE THAT ERUPTS.',({p,A,bp,em})=>{chiBrush(p,A*2.4*bp*em,p.hFull);}],
 ['bloodoracle','BLOOD SEAL','BLOOD SEAL',4,'6% HP: A SEAL THAT SPREADS TO 5 FOES.',({p,a,A,qm,em})=>chiSealShot(p,a,A*1.3*qm*em)],
 ['bloodoracle','CRIMSON PASSAGE','BLOOD MIRROR',7,'SWAP PLACES WITH A FOE.',({p,a})=>chiMirror(p,a)],
 ['bloodoracle','HARVEST','HARVEST',6,'TEAR BLOOD ORBS FROM SEALED FOES.',({p,A,ap,em})=>chiHarvest(p,A*2*ap*em)],
 ['bloodoracle','FORBIDDEN PROPHECY','CRIMSON MOON',28,'A BLOOD MOON AND A KANJI THAT ERUPTS.',({p,A,ep,em})=>chiMoon(p,A*2.6*ep*em)],
 ['bellwarden','BELL SWING','BELL SWING',0,'A WIDE SWING THAT SMASHES SHOTS.',({p,a,A,bp,em})=>{kanSwing(p,a,A*1.2*bp*em);p.atkCd=.36/S.aspd;}],
 ['bellwarden','TEMPLE TOLL','IRON BELL',1.5,'HURL THE BELL. IT SHIELDS, THEN RETURNS.',({p,A,bp,em})=>kanBell(p,A*2.6*bp*em,p.hFull)],
 ['bellwarden','RESONANT STRIKE','STANDING WAVE',4.5,'THREE SOUND WAVES ROLL FORWARD.',({p,a,A,qm,em})=>kanWaves(p,a,A*.95*qm*em)],
 ['bellwarden','SACRED CHIME','SANCTUARY',7,'A BELL DROPS OVER YOU. UNTOUCHABLE.',({p,A,ap,em})=>kanSanctuary(p,A*1.3*ap*em)],
 ['bellwarden','ECHO RELEASE','ECHO NOTES',5,'EVERY ECHO BECOMES A RICOCHETING NOTE.',({p,A,ap,em})=>kanNotes(p,A*.9*ap*em)],
 ['bellwarden','THOUSAND BELLS',"HEAVEN'S BELL",28,'A GIANT BELL FREEZES EVERY SHOT.',({p,A,ep,em})=>kanHeaven(p,A*4.5*ep*em,A*1.1*ep*em)]];
for(const [hero,old,name,cd,d,fn] of KITDEF){const slot='mhqwfe'[KITDEF.filter(r=>r[0]===hero).findIndex(r=>r[1]===old)];const C=CLASSES.find(c=>c.k===hero);if(!C)continue;
 const id=C.kit[slot],sp=SPELLS[slot][id];if(!sp)continue;sp.n=name;sp.d=d;sp.cd=cd;const i='mhqwfe'.indexOf(slot),snd=ROSTER_SOUNDS[hero][i];
 NEWCAST[id*10+i]=args=>{if(i<2&&args.mik>0)args.bp*=1.6;if(fn(args)===false)return false;sfx(snd);};
 SPRULES.unshift([new RegExp('^'+name.replace(/'/g,"'")+'$'),['sword','shards','arrow','shield','whirl','shout'][i]]);}
// poses (167) and ultimate lead-ins (168)
Object.assign(AB_ANIM,{'REEL IN':['throw',.26],'CURSED THREAD':['throw',.26],'SWAP DOLL':['vanish',.3],'PUPPET DANCE':['cast',.4],'GRAND THEATRE':['bigcast',.6],
 'GUST':['throw',.28],'WIND CUTTER':['throw',.24],'UPDRAFT':['cast',.5],'CYCLONE':['cast',.3],"HEAVEN'S GALE":['fall',.4],
 'DANCING CUT':['swing',.16],'SILK VEIL':['spin',.32,.7],'FAN WALTZ':['throw',.3],'PIROUETTE':['spin',.24,1],'RHYTHM':['roar',.36],'LOTUS DANCE':['spin',1,3],
 'BLOOD BRUSH':['thrust',.28,.8],'BLOOD SEAL':['throw',.3],'BLOOD MIRROR':['blink',.28],'HARVEST':['cast',.45],'CRIMSON MOON':['bigcast',.7],
 'BELL SWING':['swing',.2],'IRON BELL':['throw',.32],'STANDING WAVE':['slam',.32],'SANCTUARY':['guard',.9],'ECHO NOTES':['cast',.3],"HEAVEN'S BELL":['roar',.5]});
Object.assign(ULTSEQ,{'GRAND THEATRE':{pre:.34,iv:.6,k:'hover',rise:10,runes:1,col:MAR},"HEAVEN'S GALE":{pre:.32,iv:.7,k:'leap',rise:18,col:WND},
 'LOTUS DANCE':{pre:.24,iv:.4,k:'twirl',col:PET},'CRIMSON MOON':{pre:.32,iv:.5,k:'kneel',col:BLD},"HEAVEN'S BELL":{pre:.3,iv:.5,k:'brace',col:BEL}});
// what each one does, in the ability text (166): [description, second line, tip]
Object.assign(ABTXT,{
 'SILK NEEDLE':['A FAST NEEDLE ON A SILK THREAD.','EACH HIT STITCHES THE FOE (UP TO 3). REEL IN SPENDS STITCHES FOR DAMAGE.','KEEP NEEDLING YOUR NEXT REEL TARGET.'],
 'REEL IN':['HOOK THE FIRST FOE HIT AND YANK IT TO YOU, STUNNED.','A BOSS PULLS YOU TO IT INSTEAD. FULL CHARGE: THE HOOK PIERCES AND REELS 3.','PULL A CASTER OUT OF ITS PACK.'],
 'CURSED THREAD':['A SPOOL BOUNCES BETWEEN UP TO 5 FOES, LINKING THEM.','HIT ONE AND THE OTHERS HURT. LINKED FOES CANNOT SPREAD APART.','LINK A PACK, THEN FOCUS ONE FOE.'],
 'SWAP DOLL':['LEAVE A WOODEN DOLL AND LEAP BACK.','NEARBY FOES ATTACK THE DOLL FOR 3S. IT SOAKS UP TO 8 SHOTS.','DROP IT WHEN YOU ARE SURROUNDED.'],
 'PUPPET DANCE':['LIFT A FOE ON STRINGS FOR 3S. IT FOLLOWS YOUR CURSOR.','SMASH IT INTO OTHER FOES. A BOSS IS BOUND AND SLOWED INSTEAD.','SWING A BRUTE THROUGH THE ARCHERS.'],
 'GRAND THEATRE':['STRINGS HOIST UP TO 10 FOES INTO THE AIR, HELPLESS.','THEN THEY ARE YANKED TOGETHER AND SLAMMED DOWN. MORE FOES, MORE DAMAGE.','CAST IT IN THE MIDDLE OF A CROWD.'],
 'FEATHER BLADE':['TWO FEATHERS WEAVE AROUND EACH OTHER.','THEIR WIDE PATH CATCHES FOES YOU DO NOT AIM AT DIRECTLY.','KEEP MOVING AND KEEP THROWING.'],
 'GUST':['A WALL OF WIND SHOVES FOES BACK.','ENEMY SHOTS IT TOUCHES BLOW BACK AS YOURS. FULL CHARGE: WIDER, LONGER.','FIRE IT INTO A WALL OF BULLETS.'],
 'WIND CUTTER':['A SPINNING BLADE THAT RICOCHETS OFF WALLS UP TO 3 TIMES.','EVERY BOUNCE MAKES IT FASTER AND STRONGER, AND IT CAN HIT AGAIN.','THROW IT INTO A CORRIDOR OR A CORNER.'],
 'UPDRAFT':['LEAP ON THE WIND TOWARD THE CURSOR.','UNTOUCHABLE IN THE AIR. LANDING BLASTS NEARBY FOES AWAY.','JUMP OVER A PACK, NOT INTO ONE.'],
 'CYCLONE':['A TORNADO DRIFTS AFTER YOUR CURSOR FOR 3S.','IT SUCKS FOES IN AND SPINS THEM, AND CATCHES ENEMY SHOTS, THEN FLINGS THEM OUT AS YOURS.','STEER IT THROUGH THE ENEMY LINE.'],
 "HEAVEN'S GALE":['A COLOSSAL TORNADO DRAGS THE ROOM IN FOR 3.5S.','GIANT FEATHERS DIVE FROM THE SKY ONTO EVERYTHING CAUGHT IN IT.','DROP IT WHERE THE ROOM IS THICKEST.'],
 'DANCING CUT':['ALTERNATING LEFT AND RIGHT FAN CUTS.','HITS BUILD FLOW.','A STEADY RHYTHM KEEPS FLOW HIGH.'],
 'SILK VEIL':['A RIBBON SWEEPS IN FRONT OF YOU.','ENEMY SHOTS IT TOUCHES FLY BACK AS PETALS AT THE NEAREST FOE. FULL CHARGE: WIDER, LONGER.','TIME IT AS A VOLLEY ARRIVES.'],
 'FAN WALTZ':['TWO FANS FLY TO THE CURSOR AND DANCE A FIGURE EIGHT.','THEY CUT FOR 1.2S, THEN RETURN TO YOUR HANDS.','THROW THEM ON A PACK AND FIGHT ELSEWHERE.'],
 'PIROUETTE':['A SPINNING DASH THROUGH FOES.','EVERY FOE YOU PASS IS MARKED WITH A PETAL THAT BLOOMS INTO A CUT.','DASH THROUGH A LINE OF FOES.'],
 'RHYTHM':['A KBEAT RING CLOSES ON YOU EVERY HALF SECOND FOR 5S.','HITS ON THE KBEAT DEAL +60% AND BUILD EXTRA FLOW. FLOW YOU HOLD LENGTHENS IT.','ATTACK WHEN THE RING TURNS GOLD.'],
 'LOTUS DANCE':['VANISH AND BLINK-STRIKE UP TO 8 FOES, UNTOUCHABLE.','A LOTUS GROWS ON EACH. AT THE END THEY ALL BLOOM AT ONCE.','A LONE BOSS IS STRUCK SEVERAL TIMES.'],
 'SCARLET INK':['A PIERCING INK DART.','THREE HITS ON ONE FOE SEAL IT.','SEALED FOES TAKE +20% DAMAGE.'],
 'BLOOD BRUSH':['PAINT A BRUSH STROKE TO THE CURSOR. IT ERUPTS IN SPIKES.','FULL CHARGE: THE STROKE STANDS FOR 2S AS A WALL THAT BLOCKS ENEMY SHOTS.','PAINT A WALL BETWEEN YOU AND THE SHOOTERS.'],
 'BLOOD SEAL':['COSTS 6% HP. A SEAL TALISMAN FLIES OUT.','THE FIRST FOE HIT IS SEALED, AND THE SEAL JUMPS TO 5 MORE.','SEALED FOES TAKE +20%. SEALED KILLS FEED HARVEST.'],
 'BLOOD MIRROR':['SWAP PLACES WITH A SEALED (OR ANY) FOE NEAR THE CURSOR.','SHOTS MEANT FOR YOU HIT IT INSTEAD FOR A MOMENT.','SWAP OUT JUST AS A VOLLEY ARRIVES.'],
 'HARVEST':['RED THREADS TEAR BLOOD ORBS FROM EVERY SEALED FOE.','THE ORBS FLY BACK TO YOU, HEALING YOU AND HURTING FOES ON THE WAY.','SEAL A PACK FIRST, THEN HARVEST.'],
 'CRIMSON MOON':['A BLOOD MOON RISES AND A GIANT KANJI IS PAINTED AT THE CURSOR.','EACH STROKE ERUPTS. FOR 4S, SEALED FOES THAT DIE BURST INTO SEEKING LANCES.','SEAL THE ROOM, THEN CALL THE MOON.'],
 'BELL SWING':['A WIDE SWING OF THE TEMPLE BELL.','IT SMASHES UP TO 3 ENEMY SHOTS IN ITS ARC AND STORES THEIR ECHO.','SWING INTO INCOMING SHOTS.'],
 'IRON BELL':['HURL THE BELL ON ITS CHAIN. IT STANDS AS A SHIELD.','SHOTS THAT HIT IT BECOME ECHO. THEN IT IS YANKED BACK THROUGH FOES. FULL CHARGE: STAYS LONGER.','PLANT IT BETWEEN YOU AND THE SHOOTERS.'],
 'STANDING WAVE':['THREE SOUND WAVES ROLL OUT ALONG YOUR AIM.','THEY PIERCE, SHOVE FOES AND DESTROY ENEMY SHOTS FOR ECHO.','CLEAR A LANE THROUGH A VOLLEY.'],
 'SANCTUARY':['A GREAT BELL DROPS OVER YOU: UNTOUCHABLE.','SHOTS THAT HIT IT BECOME ECHO. WHEN IT LIFTS, ITS TOLL STUNS FOES BESIDE YOU.','DROP IT INSIDE A WALL OF BULLETS.'],
 'ECHO NOTES':['EVERY STORED ECHO BECOMES A NOTE.','NOTES SEEK FOES AND RICOCHET BETWEEN THEM.','STORE ECHO, THEN UNLOAD IT ON A PACK.'],
 "HEAVEN'S BELL":['A COLOSSAL BELL FALLS ON THE CURSOR AND RINGS 3 TIMES.','EACH RING FREEZES EVERY ENEMY SHOT. THE LAST RING FIRES THEM ALL AT THE FOES.','CALL IT DOWN IN THE THICK OF A BULLET STORM.']});
for(const k of 'mhqwfe')for(const sp of SPELLS[k]){const t=ABTXT[sp.n];if(t&&!sp.kit179){sp.kit179=1;sp.d0=sp.d;sp.d=t[0];sp.more=t[1];sp.tip=t[2];}}

// ======================================== the five heroes' looks ========================================
// Each gets a clear silhouette of their own, kept through every evolution; the final form adds a crown or halo of
// their own instead of the samurai helmet they all used to share.
const HERO_LOOK={
 marionettist:{hat:'mask',C:{robe:'#5a3478',robeS:'#3a2050',hat:'#2a1838',hatL:'#7a5498',trim:'#dfa6ff',band:'#dfa6ff'}},
 tengu:{hat:'bare',C:{skin:'#c83828',robe:'#2e5e58',robeS:'#1e3e3a',hat:'#14101a',hatL:'#3a3a40',trim:'#3a6a62',band:'#9cead2'}},
 kagura:{hat:'bare',C:{robe:'#c02838',robeS:'#7a1424',hat:'#1a1018',hatL:'#3a2430',trim:'#ffd36a',band:'#ff8aab'}},
 bloodoracle:{hat:'bare',C:{robe:'#8a1424',robeS:'#4a0a14',hat:'#1a1018',hatL:'#3a2430',trim:'#f4eef0',band:'#f65c76'}},
 bellwarden:{hat:'pilgrim',C:{robe:'#6a4a2a',robeS:'#3e2a16',hat:'#c8a050',hatL:'#e8c878',trim:'#ffda83',band:'#7a2a20'}}};
{const _ev=heroEV;heroEV=function(cls,stage){const r=_ev.apply(this,arguments);const L=HERO_LOOK[cls];if(!L||!r)return r;
 return Object.assign({},r,{hat:L.hat,crest:false,C:Object.assign({},r.C,L.C,stage===9?{trim:'#ffe1a0'}:{})});};}
{const _rd=drawRosterDetail;drawRosterDetail=function(R,kind,final,bob,back){if(!HERO_LOOK[kind])return _rd.apply(this,arguments);const b=bob,O='#14101a';
 if(kind==='marionettist'){
  // a white porcelain mask with dark eye holes and a painted blush
  if(!back){R(8,10+b,5,3,'#f4eef4');R(8,10+b,5,1,'#ffffff');R(9,11+b,1,1,O);R(11,11+b,1,1,O);R(12,12+b,1,1,'#e05080');R(10,12+b,1,1,'#c0b0c0');}
  // a little marionette doll dancing on two strings at her side
  const sw=b?1:0;R(1,6+b,4,1,'#a8743a');R(1+sw,7+b,1,6,'#9a80b0');R(3+sw,7+b,1,7,'#9a80b0');
  R(1+sw,12+b,3,3,O);R(2+sw,13+b,1,1,'#f0e0c8');R(0+sw,15+b,5,4,O);R(1+sw,15+b,3,3,'#dfa6ff');R(1+sw,15+b,3,1,'#f6e6ff');R(1+sw,19+b,1,2,O);R(3+sw,19+b,1,2,O);
  if(final){R(7,6+b,7,2,O);R(8,6+b,5,1,'#dfa6ff');R(8,5+b,1,1,'#dfa6ff');R(10,4+b,1,2,'#ffe1a0');R(12,5+b,1,1,'#dfa6ff');}}
 else if(kind==='tengu'){
  // the tengu's red face and long nose with a fierce gold eye, a wild white mane, and a small black tokin on the brow
  R(7,8+b,7,2,'#f0f0f0');R(7,10+b,1,5,'#f0f0f0');R(6,11+b,1,3,'#d8d8d8');if(back){R(8,10+b,5,5,'#f0f0f0');R(8,14+b,5,1,'#d8d8d8');}
  if(!back){R(8,10+b,5,4,'#c83828');R(12,11+b,4,2,'#c83828');R(15,11+b,1,1,'#e05040');R(12,12+b,3,1,'#9a2018');R(10,10+b,2,1,'#f0f0f0');R(11,11+b,1,1,'#ffe080');R(8,13+b,3,1,'#9a2018');}
  R(9,6+b,3,2,O);R(10,5+b,1,1,O);R(10,7+b,1,1,'#3a3a40');
  // folded black wings behind the shoulders, and the yamabushi's white pom-poms
  for(const [x,d] of [[3,1],[15,-1]]){R(x,11+b,3,8,O);R(x+(d>0?1:0),12+b,2,6,'#203a3a');R(x+(d>0?1:0),12+b,2,1,'#3a5a5a');}
  if(!back){R(8,15+b,1,1,'#f0f0f0');R(11,15+b,1,1,'#f0f0f0');R(8,16+b,1,1,'#9cead2');R(11,16+b,1,1,'#9cead2');}
  if(final){for(const [x,d] of [[0,1],[17,-1]]){R(x,8+b,3,9,O);R(x+(d>0?1:0),9+b,2,7,'#203a3a');R(x+(d>0?1:0),9+b,2,1,'#9cead2');}R(9,5+b,3,1,'#ffe1a0');}}
 else if(kind==='kagura'){
  // long black hair, a gold crown with dangling ornaments, a white kosode over red hakama
  R(7,8+b,6,2,'hat');R(7,10+b,1,7,'hat');R(13,10+b,1,4,'hat');if(back){R(8,10+b,5,8,'hat');R(9,17+b,3,1,'band');}
  R(7,7+b,6,1,'trim');R(8,6+b,1,1,'trim');R(10,5+b,1,2,'trim');R(12,6+b,1,1,'trim');R(6,8+b,1,3,'trim');R(6,11+b,1,1,'band');R(14,8+b,1,3,'trim');R(14,11+b,1,1,'band');
  R(7,13+b,7,3,'#f4eef0');R(10,13+b,1,3,'#d8d0d8');R(7,16+b,7,1,'band');
  if(final){R(7,5+b,1,2,'band');R(13,5+b,1,2,'band');R(9,3+b,3,2,'band');R(10,2+b,1,1,'#ffe0ea');R(8,4+b,1,1,'band');R(12,4+b,1,1,'band');}}
 else if(kind==='bloodoracle'){
  // black hair with a red ribbon, a white kosode, and a seal talisman floating at her side
  R(7,8+b,6,2,'hat');R(7,10+b,1,6,'hat');R(13,10+b,1,3,'hat');if(back){R(8,10+b,5,7,'hat');R(9,11+b,3,1,'band');}R(7,8+b,2,2,'band');
  R(7,13+b,7,3,'#f4eef0');R(10,13+b,1,3,'#d8c8c8');R(7,16+b,7,1,'#f65c76');
  if(!back){R(10,13+b,1,1,'#f65c76');R(11,11+b,1,1,'#ff3040');}
  R(1,9+b,4,6,O);R(2,10+b,2,4,'#f4e8d8');R(2,11+b,2,1,'#c01830');R(2,13+b,2,1,'#c01830');
  if(final)for(const [x,y] of [[4,3],[9,1],[14,3]]){R(x,y+b,4,5,O);R(x+1,y+1+b,2,3,'#f4e8d8');R(x+1,y+2+b,2,1,'#c01830');}}
 else if(kind==='bellwarden'){
  // a bronze temple bell strapped to his back, and prayer beads across the chest
  R(1,11+b,6,9,O);R(2,12+b,4,7,'#a0702a');R(2,12+b,1,6,'#e0b060');R(5,12+b,1,7,'#5a3a14');R(1,18+b,6,1,'#c09040');R(3,10+b,2,2,O);R(3,10+b,2,1,'#a0702a');
  if(!back)for(let i=0;i<5;i++)R(7+i,13+b+i,1,1,i%2?'#f4e8c8':'#7a2a20');
  if(final){R(6,1+b,9,1,'#ffe1a0');R(5,2+b,1,2,'#ffe1a0');R(15,2+b,1,2,'#ffe1a0');R(10,0+b,1,1,'#ffffff');}}};}
// rebuild any hero sheets made before this file loaded
if(typeof HEROC!=='undefined')for(const k in HEROC)delete HEROC[k];
