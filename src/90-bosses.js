'use strict';
/* HELL OF THE EMPEROR - the twelve guardians, rebuilt from the Boss Design Plan.
   Loaded after game.js. Every boss here is a scripted fight run by the BOSS DIRECTOR below:
   - one gimmick that makes the fight unlike the others, and an arena it can be fought with
   - 4-6 named attacks, each with a tell (a pose, a sound, a ground marker) before it can hurt you
   - one EVENT (at 70% or 30% health, 15-25s, boss visible but invulnerable)
   - a HALF HEALTH change: the sprite breaks, one new attack, two old ones get faster
   Bullet colour language (shared by every fight):
     red = aimed at you, white/pale = a fixed pattern, green = leaves a hazard,
     gold = yours / cancels shots, purple = corruption (the Emperor only), hollow = harmless illusion. */

// ---------------------------------------------------------------- shared palette and helpers
const BC={aim:'#ff4a3a',aim2:'#ff8a60',fix:'#f0ecd8',fix2:'#c8d4e8',haz:'#70d040',gold:'#ffd040',cor:'#b040ff',cor2:'#e080ff'};
const at=(A,t)=>{const k='@'+t;if(A.t>=t&&!A[k]){A[k]=1;return true;}return false;}; // fires once when an attack's clock passes t
const aimAt=(e,x,y)=>Math.atan2((y==null?P.y:y)-e.y,(x==null?P.x:x)-e.x);
const lerp=(a,b,k)=>a+(b-a)*k;
function arenaOf(e){const r=e.room;return {x0:(r.x+1)*T,y0:(r.y+1)*T,x1:(r.x+r.w-1)*T,y1:(r.y+r.h-1)*T,cx:(r.x+r.w/2)*T,cy:(r.y+r.h/2)*T,R:r.w*T*.5};}
// a walkable spot inside the boss arena (falls back to the centre)
function freeSpot(e,x,y,r){const A=arenaOf(e);x=clamp(x,A.x0+8,A.x1-8);y=clamp(y,A.y0+8,A.y1-8);if(!blocked(x,y,r||6))return {x,y};
 for(let k=1;k<12;k++){const a=k*2.4,d=k*8,nx=x+Math.cos(a)*d,ny=y+Math.sin(a)*d;if(!blocked(nx,ny,r||6))return {x:nx,y:ny};}return {x:A.cx,y:A.cy};}
// how far a ray travels from (x,y) before it meets a wall (for charges and long lines)
function rayLen(x,y,a,max){for(let d=8;d<max;d+=6)if(solid(x+Math.cos(a)*d,y+Math.sin(a)*d))return d-6;return max;}

// a boss bullet. dmg is listed damage (the engine multiplies bullets by ESHOT_DMG); o carries style fields.
function bsh(e,x,y,a,sp,dmg,o){o=o||{};const q=mkProj('e',x,y,a,sp,dmg*e.dm,Object.assign({own:e,r:3,pd:6,col:BC.fix,life:4},o));
 if(q.st==='lance'){q.wait=o.wait||.45;q.lvx=q.vx;q.lvy=q.vy;q.vx=q.vy=0;}
 if(q.st==='boom'){q.bd=a;q.bs=sp;q.bt=0;q.bT=o.bT||1.6;}
 if(q.st==='orbit'){q.ox=o.ox==null?x:o.ox;q.oy=o.oy==null?y:o.oy;q.oa=o.oa==null?a:o.oa;q.or=o.or||6;q.ow=o.ow||2.6;q.orv=o.orv||28;}
 if(q.st==='seek'){q.turn=o.turn||1.4;q.seekT=o.seekT||1.6;}
 if(q.st==='zig'){q.zT=o.zT||.28;q.zA=o.zA||.8;q.zt=0;q.zs=1;q.zfirst=1;}
 if(q.st==='bounce')q.bn=o.bn||2;
 if(q.st==='curve')q.curve=o.curve||1;
 if(q.st==='accel'){q.acc=o.acc||1.6;q.cap=o.cap||220;}
 if(q.st==='wave'){q.wt=0;q.wa=o.wa||50;q.wf=o.wf||6;}
 projs.push(q);return q;}
// a ring of bullets with an optional gap (gap angle ga, half-width gw)
function bring(e,x,y,n,sp,dmg,o,off,ga,gw){for(let i=0;i<n;i++){const a=(off||0)+i/n*TAU;if(ga!=null&&Math.abs(angDiff(a,ga))<gw)continue;bsh(e,x,y,a,sp,dmg,o);}}
// a fan of n bullets centred on a, total width w
function bfan(e,x,y,a,n,w,sp,dmg,o){for(let i=0;i<n;i++)bsh(e,x,y,a+(n>1?(i/(n-1)-.5)*w:0),sp,dmg,o);}
// A full ring closes the stationary side lanes. Two faster shots ask for a second,
 // smaller dodge after the ring, with a lead based on the player's current movement.
function bossPressure(e){
 if(!e.boss||e.air||e.ghost||e.hid||e.dead||e.danmakuCast||!P||eShots()>165*BHK())return;
 const now=R.time;
 if(now<(e.pressureAt||0))return;
 e.pressureAt=now+(e.storm>0?1.6:2.2)/Math.sqrt(BHK());
 const a=aimAt(e),lead=Math.atan2(P.y+(P.mvy||0)*19-e.y,P.x+(P.mvx||0)*19-e.x);
 bring(e,e.x,e.y,12,58,7,{r:2,col:BC.fix2,life:2.2},a+(e.pressureTurn||0));
 e.pressureTurn=(e.pressureTurn||0)+.29;
 bsh(e,e.x,e.y,a,105,8,{col:BC.aim,r:2,life:1.8});
 if(Math.abs(angDiff(lead,a))>.085)bsh(e,e.x,e.y,lead,98,8,{col:BC.aim2,r:2,life:1.8});
}
function clearEnemyShots(keepPeril,cash){if(cash&&typeof cashOut==='function')cashOut(keepPeril);for(const q of projs)if(q.from==='e'&&!(keepPeril&&q.peril))q.dead=true;fakes.length=0;}
function say(e,s,c,t){e.say={s,c:c||'#fff',t:t||1};}

// ---------------------------------------------------------------- ground tells (markers)
// Shapes, all in world space: c circle (x,y,r) | l line (x,y,a,len,w) | cone (x,y,a,r,arc) | ring (x,y,r0,r1) | rect (x0,y0,x1,y1)
// t: seconds of warning. When t runs out the marker strikes: dmg if you stand in it, then on(m). stay: seconds it remains a live
// hazard after striking (contact damage sdmg). follow(m): re-aim every frame until lock (lock: seconds before the strike it freezes).
const BMK=[];
function mark(o){o.dur=o.t;o.col=o.col||BC.aim;BMK.push(o);return o;}
function inShape(m,x,y){switch(m.k){
 case 'c':return Math.hypot(x-m.x,y-m.y)<m.r;
 case 'l':{const dx=x-m.x,dy=y-m.y,c=Math.cos(m.a),s=Math.sin(m.a),u=dx*c+dy*s,v=-dx*s+dy*c;return u>=-m.w/2&&u<=m.len&&Math.abs(v)<=m.w/2;}
 case 'cone':{const d=Math.hypot(x-m.x,y-m.y);return d<m.r&&(d<6||Math.abs(angDiff(Math.atan2(y-m.y,x-m.x),m.a))<m.arc/2);}
 case 'ring':{const d=Math.hypot(x-m.x,y-m.y);return d>m.r0&&d<m.r1;}
 case 'rect':return x>m.x0&&x<m.x1&&y>m.y0&&y<m.y1;}return false;}
function tickMarks(dt){for(const m of BMK){
  if(m.dead)continue;
  if(m.survival&&m.src.EV!==m.survival){m.dead=1;continue;}
  if(m.follow&&(m.lock==null||m.t>m.lock))m.follow(m);m.t-=dt;
  if(!m.fired){if(m.t<=0){m.fired=1;
    if(m.dmg&&P.hp>0&&inShape(m,P.x,P.y))hitPlayer(m.dmg,m.x!=null?m.x:P.x,m.y!=null?m.y:P.y,{peril:!m.soft,src:m.src});
    if(m.on)m.on(m);if(!m.quiet){shake=Math.max(shake,m.shake||2);if(m.k==='c')fxRing(m.x,m.y,m.r,m.col,.25);}
    if(!m.stay)m.dead=1;}}
  else{m.stay-=dt;if(m.sdmg&&P.hp>0&&P.dash<=0&&inShape(m,P.x,P.y))hitPlayer(m.sdmg,P.x,P.y,{peril:true,src:m.src});if(m.stay<=0)m.dead=1;}}
 for(let i=BMK.length-1;i>=0;i--)if(BMK[i].dead)BMK.splice(i,1);}
// draw in world space: the iso projection is affine, so canvas paths can be drawn straight in world coordinates
function worldXf(){ctx.transform(RA-RD,ISOK*(RA+RD),RB-RE,ISOK*(RB+RE),RC-RF+VOFF-cam.x,ISOK*(RC+RF)-cam.y);}
function shapePath(m,k){ctx.beginPath();k=k==null?1:k;switch(m.k){
 case 'c':ctx.arc(m.x,m.y,Math.max(.1,m.r*k),0,TAU);break;
 case 'l':{const c=Math.cos(m.a),s=Math.sin(m.a),L=m.len*k,w=m.w/2;ctx.moveTo(m.x-s*w,m.y+c*w);ctx.lineTo(m.x-s*w+c*L,m.y+c*w+s*L);ctx.lineTo(m.x+s*w+c*L,m.y-c*w+s*L);ctx.lineTo(m.x+s*w,m.y-c*w);ctx.closePath();break;}
 case 'cone':ctx.moveTo(m.x,m.y);ctx.arc(m.x,m.y,Math.max(.1,m.r*k),m.a-m.arc/2,m.a+m.arc/2);ctx.closePath();break;
 case 'ring':ctx.arc(m.x,m.y,m.r1,0,TAU);ctx.arc(m.x,m.y,m.r0+(m.r1-m.r0)*(1-k),0,TAU,true);break;
 case 'rect':ctx.rect(m.x0,m.y0,m.x1-m.x0,m.y1-m.y0);break;}}
function drawMarks(){if(!BMK.length)return;ctx.save();worldXf();ctx.lineWidth=1.2;
 // fake walls (the fox's illusions) look real until a torii gate reveals them
 for(const m0 of BMK){if(m0.dead)continue;if(m0.survival&&m0.src.EV!==m0.survival)continue;if(m0.hidden&&!(m0.reveal&&m0.reveal(m0)))continue;const m=m0.fake&&!(revealed())?Object.assign({},m0,{fake:false}):m0;if(m.thin){ctx.globalAlpha=.55+.3*Math.sin(time*9);ctx.strokeStyle=m.col;ctx.lineWidth=.8;shapePath(Object.assign({},m,{w:.5}));ctx.stroke();ctx.lineWidth=1.2;continue;}
  const k=m.fired?1:clamp(1-m.t/m.dur,0,1),bl=Math.floor(time*14)%2;
  if(m.fired){ctx.globalAlpha=m.fake?.12:.35+.15*Math.sin(time*20);ctx.fillStyle=m.col;shapePath(m);ctx.fill();if(!m.fake){ctx.globalAlpha=.8;ctx.strokeStyle='#fff';ctx.stroke();}continue;}
  ctx.globalAlpha=m.fake?.06:.14;ctx.fillStyle=m.col;shapePath(m);ctx.fill();
  ctx.globalAlpha=m.fake?.15:.32;shapePath(m,m.grow===false?1:k);ctx.fill();
  ctx.globalAlpha=m.fake?.35:(m.t<.25&&bl?1:.75);ctx.strokeStyle=m.fake?m.col:(m.t<.25&&bl?'#fff':m.col);if(m.fake)ctx.setLineDash([2,2]);shapePath(m);ctx.stroke();ctx.setLineDash([]);}
 ctx.restore();ctx.globalAlpha=1;}

// ---------------------------------------------------------------- harmless illusions (the fox's hollow shots)
// kept out of the main bullet list so they can never deal damage
const fakes=[];
function fakeShot(e,x,y,a,sp,o){const q=Object.assign({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:3,life:4,col:'#c8a0ff'},o||{});if(q.st==='seek'){q.turn=q.turn||1.4;q.seekT=q.seekT||1.6;}fakes.push(q);return q;}
function tickFakes(dt){for(const q of fakes){if(q.st==='seek'||q.st==='curve'||q.st==='wave'||q.st==='accel')stepStyle(q,dt);q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;if(q.life<=0||solid(q.x,q.y))q.dead=1;}
 for(let i=fakes.length-1;i>=0;i--)if(fakes[i].dead)fakes.splice(i,1);}
function drawFakes(){for(const q of fakes){const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7;ctx.globalAlpha=.85;circ(X,Y,q.r,q.col);ctx.globalAlpha=1;}}
// a bullet style the engine lacks: decel (fast, then slows down to a crawl), and grav (thrown, falls back down)
{const _ss=stepStyle;stepStyle=function(q,dt){if(q.st==='crane'){if(q.wait>0){q.wait-=dt;q.vx=q.vy=0;if(q.wait<=0){const a=Math.atan2(P.y-q.y,P.x-q.x);q.vx=Math.cos(a)*q.csp;q.vy=Math.sin(a)*q.csp;q.st='seek';}}return;}
  if(q.st==='hang'){if(q.wait>0){q.wait-=dt;q.vx=q.vy=0;if(q.wait<=0){q.vx=Math.cos(q.ha)*q.csp;q.vy=Math.sin(q.ha)*q.csp;q.st=q.then||null;}}return;}
  if(q.st==='decel'){const s=Math.hypot(q.vx,q.vy);if(s>(q.minSp||20)){const k=Math.exp(-(q.dec||1.4)*dt);q.vx*=k;q.vy*=k;}return;}
  if(q.wind&&BX.wind){q.vx+=BX.wind.x*dt;q.vy+=BX.wind.y*dt;}return _ss(q,dt);};}

// ---------------------------------------------------------------- arena props drawn by the bosses
// shootable props are enemies (propFoe) with ai 'dummy'; onHurt lets a prop react to shots without dying
const BX={wind:null,dark:0,lights:[],smoke:null};
const revealed=()=>BX.reveal>0||!!(R&&R.inv&&R.inv.foxmask);
function bProp(e,type,x,y,o){const p=freeSpot(e,x,y,4);const m=mkEnemy(type,p.x,p.y,e.room,R.di);Object.assign(m,{prop:true,awake:true,bossOwned:e},o||{});enemies.push(m);return m;}
// boss minions fire far fewer bullets than stage foes: the boss's own patterns should be what you read
function bMin(e,type,x,y,o){const p=freeSpot(e,x,y,5);const m=mkEnemy(type,p.x,p.y,e.room,R.di);Object.assign(m,{awake:true,minion:true,bossOwned:e},o||{});
 if(ET[type]&&ET[type].volley&&!(o&&o.volley)){m.t=Object.assign({},m.t);delete m.t.volley;}m.pcd=rnd(2.5,4.5);enemies.push(m);spark(p.x,p.y,'#f55',8,60);return m;}
// pixel drawing at a sprite's feet on screen (for stateful props: lanterns that light, braziers that burn)
function pxAt(e,fn){const X=sx(e.x,e.y),Y=sy(e.x,e.y);fn((x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(X+x,Y+y,w,h);},X,Y);}
function killOwned(e){for(const o of enemies)if(o.bossOwned===e&&!o.dead){o.dead=true;}}
// tiny sprites for props and minions (miniSpr draws an outline around them)
const defProp=(k,n,hp,r,spr)=>{ET[k]={n,hp,spd:0,pos:9999,r,ai:'dummy',rng:0,wl:0,atks:[]};DUMMYSPR[k]=spr;};

// ---------------------------------------------------------------- the director
// BKIT[name] = {director:bossDirector, init, atks:[{n,wt,half,ok,run}], move, event:{at,dur,name,start,tick,end}, onHalf, halfName,
//               tick (always runs, even in events), draw/drawAfter (sprite hooks), floor, overlay, hud, guide, reset, onDeath}
function bossDirector(e,dt,d){const K=BKIT[e.name];
 kitStart(e,K);const a=aimAt(e);
 if(e.say){e.say.t-=dt;if(e.say.t<=0)e.say=null;}
 if(K.tick&&K.tick(e,dt,d,!!e.EV)===true)return true;
 tickBarrage(e,dt);
 if(phaseGate(e,K,dt))return true;
 e.lastPh=e.phase;
 if(K.barrage)barrageTick(e,K,dt);
 if(e.A){e.A.t+=dt;const done=e.A.run(e,e.A,dt,d,a);if(done&&e.A){if(e.A.end)e.A.end(e,e.A);e.gapT=(e.A.gap!=null?e.A.gap:(K.gap||.7))/e.spdK;e.A=null;e.tele=0;}if(!K.noContact)bossContact(e);return true;}
 e.gapT-=dt;
 if(K.move)K.move(e,dt,d,a);else defaultMove(e,dt,d,a,K);
 if(e.gapT<=0&&!e.stag){const nx=chooseAtk(e,K,d);if(nx)startAtk(e,nx);}
 if(!K.noContact)bossContact(e);
 return true;}
// events and the half-health change, shared by every director. true = this frame belongs to them
function phaseGate(e,K,dt){if(e.EV){runEvent(e,K,dt);return true;}const f=e.hp/e.maxhp,L=bossEvents(K);e.evSeen=e.evSeen||{};
 const due=L.find((ev,i)=>!e.evSeen[i]&&f<ev.at),halfDue=!e.half&&f<.5&&!K.noHalf;
 // half health first unless an event is due earlier in the fight
 if(halfDue&&!(due&&due.at>.5)){doHalf(e,K);return true;}
 if(due){e.evSeen[L.indexOf(due)]=1;startEvent(e,K,due);return true;}return false;}
// a boss's events: its own (event / events) plus the classic survival storm (storm), highest health threshold first
function bossEvents(K){if(K._evs)return K._evs;const L=[].concat(K.events||[],K.event?[K.event]:[]);if(K.storm)L.push(stormEvent(K.storm));return K._evs=L.sort((a,b)=>b.at-a.at);}
// the classic SURVIVAL phase from the original fights: the boss holds the centre, invulnerable, and throws its whole
// barrage set plus telegraphed rain at you
function stormEvent(S){return {at:S.at,dur:S.dur||9,name:S.name||'LAST STAND',hint:'SURVIVE THE STORM',storm:1,survival:true,
 start(e,E){const A=arenaOf(e);e.onCeil=0;e.ceil=0;E.home=freeSpot(e,A.cx,A.cy,e.r);E.bt=.6;E.rt=1.2;E.k=0;if(S.start)S.start(e,E);},
 tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*3);e.y+=(E.home.y-e.y)*Math.min(1,dt*3);const B=BKIT[e.name].barrage,L=S.patterns||(B&&(B.storm||B.ph1))||[];
  E.bt-=dt;if(E.bt<=0&&L.length){E.bt=(S.rate||.5)/BHK();if(eShots()<(S.cap||280)*BHK())bossBarrage(e,L[E.k++%L.length]);}
  E.rt-=dt;if(E.rt<=0){E.rt=S.rain||1.5;enemyShoot(e,{pat:'rain',cnt:4,rad:18,col:bsty(e).c,dmg:10,sp:0},0);}
  if(Math.random()<dt*20)spark(e.x,e.y,bsty(e).c,2,40);if(S.tick)S.tick(e,dt,E);}};}
// the bullet-hell layer: between (and during some) attacks the boss keeps throwing its signature barrages at you
// K.barrage = {ph1:[patterns], half:[patterns], rate:[s, s at half], during:[attack names it keeps firing through]}
const BHK=()=>(DF&&DF().bh)||1,BCAP=240,eShots=()=>{let n=0;for(const q of projs)if(q.from==='e')n++;return n;};
function barrageTick(e,K,dt){const B=K.barrage;if(e.air)return;if(e.A&&B.during!=='all'&&!(B.during||[]).includes(e.A.n))return;if(e.A&&B.not&&B.not.includes(e.A.n))return;
 e.bgT=(e.bgT==null?1.2:e.bgT)-dt;if(e.bgT>0)return;const r=B.rate||[1.1,.8];e.bgT=((e.ph===3&&r[2])||(e.half?r[1]:r[0]))/BHK();if(eShots()>(B.cap||BCAP)*BHK())return;
 const L=(B.pick&&B.pick(e))||(e.half&&B.half)||B.ph1;bossBarrage(e,L[(e.bgN=(e.bgN||0)+1)%L.length]);}
function kitStart(e,K){if(e.kitOn)return;e.kitOn=1;if(e.r0==null){e.r0=e.r;e.spd0=e.spd;}Object.assign(e,{evSeen:{},bgT:null,bgN:0,brq:[],ph:1,half:0,evDone:0,EV:null,A:null,gapT:1.4,spdK:1,lastA:null,say:null,mins:[]});e.drawAfter=bossDrawAfter;if(K.draw)e.drawFn=K.draw;if(K.init)K.init(e);}
function defaultMove(e,dt,d,a,K){const pref=K.pref||e.pref||70;if(d>pref+12)steer(e,a,e.spd,dt);else if(d<pref-20)steer(e,a+Math.PI,e.spd*.8,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.6,dt);if(Math.random()<dt*.3)e.sdir*=-1;}
function chooseAtk(e,K,d){let L=K.atks.filter(x=>(x.half==null||(x.half===1)===!!e.half)&&(!x.ok||x.ok(e,d)));if(L.length>1){const L2=L.filter(x=>x.n!==e.lastA);if(L2.length)L=L2;}if(!L.length)return null;return wpick(L);}
function startAtk(e,at){e.A={n:at.n,nm:at.n,t:0,run:at.run,end:at.end,gap:at.gap};e.lastA=at.n;} // nm keeps the name (some attacks reuse A.n as a counter)
function cancelAtk(e){if(e.A&&e.A.end)e.A.end(e,e.A);e.A=null;e.tele=0;e.air=false;e.z=0;}
function doHalf(e,K){e.half=1;e.phase=2;e.spdK=K.spdK||1.2;cancelAtk(e);clearEnemyShots(true,1);e.iv=1.4;e.gapT=1.6;
 if(!K.keepSpr)e.sprOv=bossHurtSpr(e.di);if(K.onHalf)K.onHalf(e);
 const c=bsty(e).c;sfx('break');sfx('boss');shake=Math.max(shake,9);hitstop=Math.max(hitstop,.12);impact(e.x,e.y,c,10,true);fxRing(e.x,e.y,90,c,.6);fxRing(e.x,e.y,50,'#fff',.4);
 txtFx(e.x,e.y-16,K.halfName||'ENRAGED',c,2);setToast(e.name.split(',')[0]+': '+(K.halfName||'ENRAGED'),c,3);}
function startEvent(e,K,ev){ev=ev||K.event;e.EVdef=ev;cancelAtk(e);e.brq=[];clearEnemyShots(true,1);e.evDone=1;e.EV={t:0,name:ev.name};e.iv=999;
 // the engine's HUD reads storm/stormMax for the SURVIVE countdown and ev.mins for "defeat the guard"
 e.storm=ev.dur;e.stormMax=ev.dur;e.ev={name:ev.name,mins:[]};if(ev.start)ev.start(e,e.EV);
 const c=bsty(e).c;sfx('boss');shake=Math.max(shake,8);fxRing(e.x,e.y,80,c,.5);txtFx(e.x,e.y-16,ev.name,c,2);setToast(ev.name+' - '+(ev.hint||'SURVIVE!'),c,3.5);}
// Stationary wall and long-range cover buy time, but a fixed tell makes either spot unsafe to hold.
function survivalPressure(e,E,dt){
 E.edgeCd=Math.max(0,(E.edgeCd||0)-dt);
 if(!P||e.storm<1.2||E.edgeCd>0)return;
 const A=arenaOf(e),x=P.x,y=P.y;
 const far=Math.hypot((x-A.cx)/(A.x1-A.cx),(y-A.cy)/(A.y1-A.cy))>.66||dist(e,P)>Math.min(A.x1-A.x0,A.y1-A.y0)*.38;
 let nearWall=false;
 for(let i=0;i<8&&!nearWall;i++)nearWall=solid(x+Math.cos(i*TAU/8)*28,y+Math.sin(i*TAU/8)*28);
 E.edgeTime=far||nearWall?(E.edgeTime||0)+dt:0;
 if(E.edgeTime<.65)return;
 E.edgeTime=0;E.edgeCd=1.7;
 const col=BC.aim,t=.95,late=e.di>CAMPAIGN_END;
 const {x:tx,y:ty}=late?latePoint(A,x,y,24):{x,y};
 mark({k:'c',x:tx,y:ty,r:24,t,col,dmg:13*e.dm,src:e,survival:E,quiet:true,lateCheck:late,on:()=>{
  fxRing(tx,ty,26,col,.32);sfx('beat');
  if(eShots()>210*BHK())return;
  // Aim from a nearby clear lane so a pillar cannot absorb the whole volley.
  const toward=aimAt({x:tx,y:ty},A.cx,A.cy);
  for(const offset of [0,1,-1,2,-2]){
   const a=toward+offset*.65,ox=tx+Math.cos(a)*92,oy=ty+Math.sin(a)*92;
   if(ox<A.x0||ox>A.x1||oy<A.y0||oy>A.y1||blocked(ox,oy,4)||!los(ox,oy,tx,ty))continue;
   bfan(e,ox,oy,Math.atan2(ty-oy,tx-ox),3,.38,108,8,{r:2,col,life:1.7});break;
  }
 }});
}
function runEvent(e,K,dt){const ev=e.EVdef||K.event,E=e.EV;E.t+=dt;e.iv=999;e.storm=Math.max(0,ev.dur-E.t);if(ev.tick)ev.tick(e,dt,E);
 if(ev.survival&&!ev.ownPressure&&!E.done)survivalPressure(e,E,dt);
 if(!ev.storm&&!ev.quiet&&E.t>.8)bossPressure(e);
 if(!ev.storm&&K.barrage&&!ev.quiet&&!e.ghost&&!e.air){E.bb=(E.bb==null?1.5:E.bb)-dt;if(E.bb<=0){E.bb=(K.barrage.rate||[1])[0]*1.7/BHK();if(eShots()<160){const L=K.barrage.ph1;bossBarrage(e,L[(E.bk=(E.bk||0)+1)%L.length]);}}}
 if(E.t>=ev.dur||(E.done)){if(ev.end)ev.end(e,E);if(ev.survival)clearEnemyShots(true,1);e.EV=null;e.ev=null;e.storm=0;e.iv=.5;e.gapT=1.2;e.air=false;e.z=0;e.alpha=null;sfx('break');fxRing(e.x,e.y,60,'#fff',.4);setToast(ev.name+' ENDS - STRIKE NOW!','#fff',2.2);}}
// speech bubble over the boss, and the generic sprite extras
function drawSurvivalWard(e){
 if(!(e.EV&&e.EVdef?.survival)||e.dead)return;
 const col='#8fe0ff',r=Math.max(16,e.r+9),x=sx(e.x,e.y),y=sy(e.x,e.y)-(e.z||0)-15;
 ctx.globalAlpha=.55+.16*Math.sin(time*7);wcirc(e.x,e.y,r,col);
 ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,r*1.24,r,0,Math.PI,TAU);ctx.stroke();ctx.globalAlpha=1;
 const label='INVULNERABLE';txt(label,x-Math.round(txtW(label)/2),y-r-8,col);
}
function bossDrawAfter(e){const K=BKIT[e.name];if(K&&K.drawAfter)K.drawAfter(e);drawSurvivalWard(e);
 if(e.say&&!e.dead){const X=sx(e.x,e.y),Y=sy(e.x,e.y)-e.z-58,s=e.say.s,w=txtW(s)+6;ctx.fillStyle='#14101a';ctx.fillRect(X-(w>>1)-1,Y-1,w+2,11);ctx.fillStyle='#f8f4e8';ctx.fillRect(X-(w>>1),Y,w,9);ctx.fillRect(X-1,Y+9,3,2);txt(s,X-(w>>1)+3,Y+2,e.say.c==='#fff'?'#14101a':e.say.c);}}
// draw a sprite by hand at some alpha (the engine's drawEnemy always draws fully opaque)
function drawGhostly(e,alpha,ox,oy,s){s=s||sprOf(e);const X=sx(e.x,e.y)+(ox||0),Y=sy(e.x,e.y)+(oy||0)+Math.min(6,Math.round(e.r*.6))+2;ctx.globalAlpha=alpha;
 const frame=s.bossSpr?(e.A?2:Math.floor(time*2.5)%2):Math.floor(time*4);drawSpr(s,X,Y-(e.z||0),e.flash>0&&alpha>.6,frame,(!!s.animal||!!s.bossSpr)&&sx(P.x,P.y)<X);ctx.globalAlpha=1;}

// ---------------------------------------------------------------- engine hooks (wrapping game.js functions)
{const _bk=bossKitTick;bossKitTick=function(e,dt,d){const K=BKIT[e.name];if(K&&K.director)return K.director(e,dt,d);return _bk(e,dt,d);};}
{const _h=hurtE;hurtE=function(e,dmg,pd,o){if(e&&e.onHurt&&!e.dead&&!e.air&&!(e.iv>0)){const r=e.onHurt(e,dmg,o||{});if(r===false)return;if(typeof r==='number'){if(r>0&&r<1&&R&&R.inv&&R.inv.spiritlantern)dmg*=1-(1-r)/2;else dmg*=r;}}return _h(e,dmg,pd,o);};}
{const _de=drawEnemy;drawEnemy=function(e){if(e.drawFn&&e.drawFn(e)===false){if(e.drawAfter)e.drawAfter(e);return;}
  if(e.alpha!=null&&e.alpha<1){if(e.alpha>.02)drawGhostly(e,e.alpha);}else _de(e);if(e.drawAfter)e.drawAfter(e);};}
{const _bf=drawBossFloor;drawBossFloor=function(){_bf();if(boss&&!boss.dead&&boss.kitOn&&BKIT[boss.name]&&BKIT[boss.name].floor)BKIT[boss.name].floor(boss);drawMarks();};}
// drawPortal is called right after the depth-sorted sprites and before bullets: the place for darkness, smoke and illusions
{const _dp=drawPortal;drawPortal=function(){_dp();if(boss&&boss.awake&&!boss.dead&&boss.kitOn&&BKIT[boss.name]&&BKIT[boss.name].overlay)BKIT[boss.name].overlay(boss);drawFakes();};}
{const _uw=updWorld;updWorld=function(dt){_uw(dt);if(freezeT>0)return;bossWorld(dt);};}
{const _mv=moveVec;moveVec=function(){const v=_mv();return P&&P.revT>0?[-v[0],-v[1]]:v;};}
function bossWorld(dt){tickMarks(dt);tickFakes(dt);
 if(P){if(P.slowT>0){P.slowT-=dt;P.webT=.1;}else if(P.webT>0)P.webT=0;if(P.revT>0)P.revT-=dt;}
 // slowing bullets (nets, shackles): they still hit normally; touching one also slows you
 for(const q of projs)if(q.from==='e'&&q.slowP&&P.iv<=0&&P.dash<=0&&scrDist(q)<q.r+HITR+1){P.slowT=Math.max(P.slowT||0,q.slowP);}
 // a posture break interrupts whatever the boss was doing
 if(boss&&boss.A&&boss.stag>0)cancelAtk(boss);}
{const _br=bossReset;bossReset=function(e){const K=BKIT[e.name];if(K&&K.director){cancelAtk(e);killOwned(e);BMK.length=0;fakes.length=0;BX.dark=0;BX.wind=null;BX.smoke=null;
   if(K.reset)K.reset(e);if(e.r0!=null){e.r=e.r0;e.spd=e.spd0;}e.kitOn=0;e.danmakuCast=null;e.danmakuContext=undefined;e.danmakuClock=2.3;e.danmakuTurn=0;e.pressureAt=0;e.pressureTurn=0;e.sprOv=null;e.corpse=null;e.fan=0;e.mounted=0;e.downT=0;e.stunT=0;e.EV=null;e.ev=null;e.storm=0;e.alpha=null;e.drawFn=null;e.air=false;e.z=0;e.ghost=false;}
  return _br(e);};}
{const _od=onBossDead;onBossDead=function(e){const K=BKIT[e.name];if(K&&K.director){if(K.onDeath)K.onDeath(e);killOwned(e);BMK.length=0;fakes.length=0;BX.dark=0;BX.wind=null;BX.smoke=null;if(P){P.slowT=0;P.revT=0;}
   clearEnemyShots(false,1);}return _od(e);};}
// HUD: the health bar shows its four damage steps and where the event triggers; the arena hint line
{const _hud=drawHUD;drawHUD=function(){_hud();const b=boss;if(!b||!b.awake||b.dead)return;const K=BKIT[b.name];if(!K||!K.director)return;
  const {x,y,w}=bossBarBox();if(!K.noTicks){ctx.fillStyle='#14101a';for(const k of [.25,.5,.75])ctx.fillRect(x+Math.round(w*k),y,1,6);bossEvents(K).forEach((ev,i)=>{if(b.evSeen&&b.evSeen[i])return;ctx.fillStyle='#ffd040';ctx.fillRect(x+Math.round(w*ev.at)-1,y-2,3,2);});}
  if(!b.EV&&K.hud){const s=K.hud(b);if(s)ctxt(s,H-40,K.hudC||'#e0b040');}
  if(K.hudExtra)K.hudExtra(b);};}
// projectile art for the new bullets
Object.assign(PSPR,{
 crane(X,Y,ux,uy,q){const f=Math.floor(time*8+q.x)%2;ctx.fillStyle='#f8f4e8';ctx.fillRect(X-1,Y-1,3,3);ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);ctx.fillRect(Math.round(X-uy*3),Math.round(Y+ux*3)-f,2,1);ctx.fillRect(Math.round(X+uy*3),Math.round(Y-ux*3)-f,2,1);ctx.fillStyle='#d02030';ctx.fillRect(X,Y,1,1);},
 kunai(X,Y,ux,uy,q){for(let i=-4;i<=3;i++){ctx.fillStyle=i>0?'#e8eef6':i>-2?'#3a3a48':q.col;ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}},
 shuriken(X,Y,ux,uy,q){const a=time*20+q.x;for(let i=0;i<4;i++){const c=Math.cos(a+i*Math.PI/2),s=Math.sin(a+i*Math.PI/2);ctx.fillStyle=q.col;ctx.fillRect(Math.round(X+c*2),Math.round(Y+s*2),1,1);ctx.fillRect(Math.round(X+c*3+s),Math.round(Y+s*3-c),1,1);}ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);},
 petal(X,Y,ux,uy,q){ctx.fillStyle=q.col;ctx.fillRect(X-2,Y-1,4,3);ctx.fillRect(X-1,Y-2,2,5);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);},
 bead(X,Y,ux,uy,q){ // a polished amber prayer bead: dark edge, shading, a bright highlight and the threading hole
  disc(X,Y,4,'#14101a');disc(X,Y,3,'#8a4a1a');disc(X-1,Y-1,2,'#d88a38');ctx.fillStyle='#ffe0a0';ctx.fillRect(X-2,Y-2,2,1);ctx.fillRect(X-2,Y-1,1,1);ctx.fillStyle='#2a1408';ctx.fillRect(X,Y,1,1);},
 ball(X,Y,ux,uy,q){disc(X,Y,q.r,'#1a1a20');circ(X,Y,q.r,'#5a5a66');ctx.fillStyle='#8a8a96';ctx.fillRect(X-2,Y-3,2,1);},
 shackle(X,Y,ux,uy,q){const a=time*10+q.x; // a solid iron ring with a spinning link
  disc(X,Y,5,'#14101a');disc(X,Y,4,'#8a8a9a');disc(X-1,Y-1,3,'#c8c8d8');disc(X,Y,2,'#14101a');ctx.fillStyle='#ffffff';ctx.fillRect(X-3,Y-2,1,1);
  const lx=Math.round(X+Math.cos(a)*5),ly=Math.round(Y+Math.sin(a)*5);ctx.fillStyle='#14101a';ctx.fillRect(lx-2,ly-2,4,4);ctx.fillStyle=q.col||'#dfccab';ctx.fillRect(lx-1,ly-1,2,2);},
 wisp(X,Y,ux,uy,q){const f=Math.floor(time*12+q.x)%2;disc(X,Y,3,q.col);ctx.fillStyle='#fff';ctx.fillRect(X-1,Y-1,2,2);ctx.fillStyle=q.col;ctx.fillRect(Math.round(X-ux*4),Math.round(Y-uy*4)-f,1,2);},
 scale(X,Y,ux,uy,q){ctx.fillStyle='#2a1030';ctx.fillRect(X-2,Y-2,5,5);ctx.fillStyle=q.col;ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle='#ffd040';ctx.fillRect(X-2,Y-2,5,1);},
 rider(X,Y,ux,uy,q){const f=Math.floor(time*12+q.y)%2;ctx.fillStyle='#14101a';ctx.fillRect(X-7,Y-6,14,7);ctx.fillStyle=q.col;ctx.fillRect(X-6,Y-5,12,5);ctx.fillRect(Math.round(X+ux*6)-1,Y-8,3,3);ctx.fillStyle='#14101a';ctx.fillRect(X-5,Y-1+f,2,3);ctx.fillRect(X+3,Y-1+(1-f),2,3);ctx.fillStyle='#e8eef6';ctx.fillRect(X-1,Y-12,2,6);ctx.fillRect(Math.round(X+ux*9),Math.round(Y-9+uy*3),2,1);},
 chainlink(X,Y,ux,uy,q){circ(X,Y,2,'#9a9aa8');ctx.fillStyle='#5a5a66';ctx.fillRect(X,Y,1,1);},
 blade(X,Y,ux,uy,q){for(let i=-3;i<=3;i++){ctx.fillStyle=Math.abs(i)<2?'#ffffff':q.col;ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}},
});

// ---------------------------------------------------------------- half-health sprites
// at half health a boss changes form: art functions read ARTHURT and draw their second phase (helmet off, robes shed...)
let ARTHURT=false;
const HURTSPR={};
function bossHurtSpr(di){if(HURTSPR[di])return HURTSPR[di];ARTHURT=true;let s;try{s=bossSheet(di);}finally{ARTHURT=false;}return HURTSPR[di]=s;}

// ---------------------------------------------------------------- guide entries
// (game.js reads BKIT[name].guide for the guide's boss page)

// ================================================================ THE ROSTER
// stage order is fixed by the campaign map; each stage gets the plan's guardian that fits its arena
function rebrand(i,name,o){const b=BOSS[i],old=b.name;b.name=name;if(!BART[name]&&BART[old])BART[name]=BART[old];Object.assign(b,o||{});BOSSSPR[i]=null;}
rebrand(0,'AKAGANE, THE RED OX');
rebrand(3,'LADY HOTARU',{r:8,spd:40});
rebrand(4,'THE RONIN SEVEN',{r:8,spd:40});
rebrand(5,'TETSUO THE GUNSMITH',{r:9,spd:40});
rebrand(7,'ONIKUMA, THE JAILER',{r:13,spd:34});
rebrand(8,'KAGE, THE SHINOBI MASTER',{r:8,spd:60});
rebrand(10,'LORD KUROGANE',{r:13,spd:60});
BOSS[1].r=12;BOSS[1].spd=46;
// fight length: 1 to 3 minutes. Each boss's health (at NORMAL) is set from a bot measurement of damage per second at the start
// of its stage (about 90-230), assuming you are shooting ~60% of the time, minus the time its event and storm keep it
// invulnerable, and allowing for its own shields (Hotaru's lanterns, the spider's ceiling, Tetsuo's armour, the Abbot's monks).
// Targets: Akagane ~70s, about 10s longer for each boss after, the Emperor ~3 min.
{const HPT=[4800,5200,4000,5800,8600,6600,6000,24600,21600,22000,21000,50000]; // doubled in 0.6.2 (bosses felt too short)
 BOSS.forEach((b,i)=>{b.hp=Math.round(HPT[i]/BOSSHP);});}
// stage story lines follow their new guardians
DUN[4].story='THE RONIN SEVEN HOLD THE PASS WAYSTATION';DUN[8].story='KAGE WAITS ON THE ROOFS OF THE KEEP';DUN[10].story='THE BLACK HORSE GENERAL GUARDS THE LAST COURT';
// the abbot fights on a 90 bpm beat: his theme plays at the same tempo
BMUSIC[6].b=90;
// the iron cellars are a forge prison: their pools are molten metal (the jailer's channels need it)
ENV[7]=Object.assign({},ENV[7],{liq:2,lc:['#5a1406','#c03a10','#ffb040']});

// ================================================================ I. AKAGANE, THE RED OX - reading telegraphs
// A loud drill captain who announces every attack: a speech bubble 0.6s before each order, and his ashigaru act on it.
// Banners regroup fallen troops; at half health his helmet breaks and he stops shouting (no more free warnings).
defProp('rack','WEAPON RACK',30,6,miniSpr(14,12,R=>{R(0,10,14,2,'#5a3a22');R(1,0,1,12,'#5a3a22');R(12,0,1,12,'#5a3a22');R(0,3,14,1,'#7a5a3a');for(let i=0;i<4;i++){R(3+i*2.5,0,1,10,'#6a4a2a');R(3+i*2.5,0,1,2,'#e8eef6');}}));
const AKA={
 troopSlots(e){const a=aimAt(e),px=-Math.sin(a),py=Math.cos(a),out=[];for(let i=0;i<4;i++){const o=(i-1.5)*16;out.push({x:e.x-Math.cos(a)*22+px*o,y:e.y-Math.sin(a)*22+py*o});}return out;},
 troops:e=>(e.troops||[]).filter(m=>!m.dead),
 mkTroop(e,x,y){const m=bMin(e,'ashigaru',x,y);m.t=Object.assign({},ET.ashigaru,{ai:'dummy'});m.drill=1;m.hp=m.maxhp=m.maxhp*1.4;return m;},
 order(e,s){if(!e.half){say(e,s,'#c02020',.8);sfx('beat');}},
};
BKIT['AKAGANE, THE RED OX']={director:bossDirector,pref:85,gap:1.25,halfName:'HELMET OFF - NO MORE ORDERS',
 // the bullet-hell layer (from the original fight): war-drum rings, arrow walls with a gap, arrow fans, and at half health
 // accelerating arrow streams and curtains. He keeps firing through his crescents, charges, rushes and stomps
 barrage:{rate:[.5,.38],during:['crescent','charge','rush','stomp','rain','spearwall'],
  ph1:[{pat:'gapring',cnt:28,gw:.4,sp:56,spr:'drum',col:'#e0b040',burst:2,gap:.3},{pat:'wall',cnt:15,sp:70,r:3,col:BC.aim,burst:2,gap:.45},{cnt:7,spread:.7,sp:95,r:3,col:BC.aim,burst:3,gap:.14},
   {pat:'spiral',arms:4,spin:.3,sp:58,spr:'drum',col:'#e0b040',burst:8,gap:.09},{pat:'curtain',cnt:9,sp:78,r:3,col:'#ff8040'},{pat:'flower',cnt:20,sp:52,spr:'drum',col:'#e0b040'}],
  half:[{pat:'wall',cnt:17,sp:80,r:3,col:BC.aim,burst:3,gap:.35},{pat:'stream',cnt:8,sp:110,st:'accel',r:3,col:BC.aim,burst:2,gap:.2},{pat:'gapring',cnt:32,gw:.38,sp:60,spr:'drum',col:'#e0b040',burst:3,gap:.28},
   {pat:'curtain',cnt:11,sp:84,r:3,col:'#ff8040',burst:2,gap:.3},{pat:'cross',dirs:6,cnt:4,sp:68,st:'boom',bT:1.4,col:'#ff6040',rot:.2},{pat:'spiral',arms:6,spin:.32,sp:62,spr:'drum',col:'#e0b040',burst:10,gap:.08}],
  storm:[{pat:'gapring',cnt:32,gw:.36,sp:58,spr:'drum',col:'#e0b040'},{pat:'wall',cnt:17,sp:84,r:3,col:BC.aim},{pat:'cross',dirs:8,cnt:3,sp:70,st:'boom',bT:1.4,col:'#ff6040',rot:.2},{pat:'curtain',cnt:11,sp:88,r:3,col:'#ff8040'},{pat:'spiral',arms:6,spin:.35,sp:62,spr:'drum',col:'#e0b040',burst:8,gap:.08}]},
 // the original fight's survival phase, kept as his last stand
 storm:{at:.3,dur:10,name:'LAST STAND',rate:.32,rain:1.1},
 style:{c:'#e04030',t:['DRILL','SQUAD','LAST STAND'],ph:[[],[],[]]},
 guide:['SKILL: READING TELEGRAPHS. HE SHOUTS EVERY ORDER','LOOSE = ARROW GRID. BRACE = SPEAR WALL. CHARGE = OX CHARGE','WAR DRUMS AND ARROW WALLS FILL THE GAPS: FIND THE HOLE','CUT HIS BANNERS OR FALLEN TROOPS REGROUP. 30%: LAST STAND'],
 init(e){const A=arenaOf(e),k=A.R*.62;e.flagsB=[];e.troops=[];
  for(const [sx2,sy2] of [[-1,-1],[1,-1],[-1,1],[1,1]])e.flagsB.push(bProp(e,'warbanner',A.cx+sx2*k,A.cy+sy2*k,{propCol:'#c02020'}));
  e.rack=bProp(e,'rack',A.cx,A.cy+30,{onBreak:r=>{for(let i=0;i<10;i++){const a=i/10*TAU;particles.push({x:r.x,y:r.y,vx:Math.cos(a)*90,vy:Math.sin(a)*90,t:.4,col:'#e8eef6'});}
   for(const m of enemies)if(m.minion&&!m.dead&&Math.hypot(m.x-r.x,m.y-r.y)<36)hurtE(m,m.maxhp,10,{nost:true});txtFx(r.x,r.y,'SPEARS SPILL','#c8c8d0');}});
  for(const s of AKA.troopSlots(e))e.troops.push(AKA.mkTroop(e,s.x,s.y));e.regroupT=8;},
 // the drill line keeps formation behind him; fallen troops regroup at a standing banner
 tick(e,dt,d,inEv){if(e.half)return;const tr=AKA.troops(e),sl=AKA.troopSlots(e);
  if(!inEv&&!e.brace)tr.forEach((m,i)=>{m.vt=(m.vt==null?1+i*.8:m.vt)-dt;if(m.vt<=0){m.vt=2.2;bfan(m,m.x,m.y,aimAt(m),5,.7,88,7,{spr:'arrow',col:BC.aim,r:2});}});
  tr.forEach((m,i)=>{if(e.brace)return;const s=sl[i];const a=Math.atan2(s.y-m.y,s.x-m.x),dd=Math.hypot(s.x-m.x,s.y-m.y);if(dd>3)move(m,Math.cos(a)*Math.min(dd,70*dt),Math.sin(a)*Math.min(dd,70*dt),m.r);});
  if(!inEv&&tr.length<4){const b=e.flagsB.filter(x=>!x.dead);if(b.length){e.regroupT-=dt;if(e.regroupT<=0){e.regroupT=8;const s=pick(b);e.troops=tr.concat([AKA.mkTroop(e,s.x,s.y+10)]);txtFx(s.x,s.y-10,'REGROUP!','#e04030');}}}},
 hud:e=>{const n=e.flagsB.filter(b=>!b.dead).length;return n?'WAR BANNERS: '+n+' - FALLEN TROOPS REGROUP AT THEM':null;},
 onHalf(e){for(const m of AKA.troops(e)){m.t=Object.assign({},ET.ashigaru);m.drill=0;}e.troops=[];},
 atks:[
  // Naginata crescent: pole raised, metal scrape, three slowing crescents 30 degrees apart
  {n:'crescent',wt:3,run(e,A){const k=1/e.spdK;if(A.t===0||!A.go){A.go=1;AKA.order(e,'CUT!');e.tele=1;sfx('slash');A.a=aimAt(e);mark({k:'cone',x:e.x,y:e.y,a:A.a,r:90,arc:1.3,t:.6*k,col:BC.aim,follow:m=>{m.x=e.x;m.y=e.y;m.a=A.a=aimAt(e);},lock:.15});}
    const fire=()=>{bfan(e,e.x,e.y,A.a,3,1.05,120,10,{spr:'naginata',r:5,col:BC.aim,st:'decel',dec:1.1,minSp:38,life:3.6});sfx('slash');};
    if(at(A,.6*k)){e.tele=0;fire();}if(e.half&&at(A,.85*k)){A.a=aimAt(e);fire();}return A.t>(e.half?1.1:.9)*k;}},
  // Arrow rain: "LOOSE!" - a grid of landing shadows, shifted half a cell each volley; stand in a cell the next grid misses
  {n:'rain',wt:2,ok:e=>!e.half||Math.random()<.5,run(e,A){const k=1/e.spdK,S=74,vol=e.half?3:3;if(!A.go){A.go=1;AKA.order(e,'LOOSE!');A.cx=P.x;A.cy=P.y;}
    for(let v=0;v<vol;v++)if(at(A,(.35+v*1.05)*k)){const ox=v%2?S/2:0;for(let gx=-3;gx<=3;gx++)for(let gy=-3;gy<=3;gy++){const x=A.cx+gx*S+ox,y=A.cy+gy*S+ox;if(Math.hypot(x-A.cx,y-A.cy)>170||blocked(x,y,2))continue;
      mark({k:'c',x,y,r:23,t:1.3*k,dmg:13*e.dm,col:'#3a2a20',src:e,on:m=>{for(let i=0;i<3;i++)particles.push({x:m.x+rnd(-6,6),y:m.y+rnd(-6,6),vx:0,vy:60,t:.25,col:'#e8eef6'});}});}sfx('shoot');}
    return A.t>(.35+vol*1.05+1)*k;}},
  // Ox charge: hoof scrape, head lowered, red line to the wall; dust puffs on the path burst sideways after 0.5s
  {n:'charge',wt:3,run(e,A,dt){const k=1/e.spdK;
    if(!A.go){A.go=1;A.ph=0;A.b=e.half?1:0;AKA.order(e,'CHARGE!');sfx('dash');A.tell=.75*k;}
    if(A.ph===0){if(!A.m){e.tele=2;A.a=aimAt(e);A.m=mark({k:'l',x:e.x,y:e.y,a:A.a,len:rayLen(e.x,e.y,A.a,520),w:e.r*2+8,t:A.tell,col:BC.aim,follow:m=>{m.x=e.x;m.y=e.y;m.a=A.a=aimAt(e);m.len=rayLen(e.x,e.y,m.a,520);},lock:.2});}
     if(Math.random()<.4)particles.push({x:e.x+rnd(-6,6),y:e.y+4,vx:rnd(-20,20),vy:-10,t:.3,col:'#9a8a70'});
     if(A.m.dead||A.m.fired){A.ph=1;A.m=null;A.dt=0;A.px=e.x;A.py=e.y;e.tele=0;sfx('dash');}return false;}
    const s=330*(e.half?1.1:1),ox=e.x,oy=e.y;move(e,Math.cos(A.a)*s*dt,Math.sin(A.a)*s*dt,e.r);A.dt+=dt;dustTrail(e);
    if(Math.hypot(e.x-A.px,e.y-A.py)>26){A.px=e.x;A.py=e.y;const px=e.x,py=e.y,aa=A.a;mark({k:'c',x:px,y:py,r:7,t:.5,col:'#c8b890',quiet:1,grow:false,on:()=>{for(const sd of [1,-1])bsh(e,px,py,aa+sd*Math.PI/2,62,8,{col:BC.fix,r:3,life:2.2});}});}
    const wall=Math.hypot(e.x-ox,e.y-oy)<s*dt*.35;
    if(wall||A.dt>1.4){if(wall){shake=Math.max(shake,7);sfx('break');fxRing(e.x,e.y,40,'#c8b890',.35);}
     if(A.b>0&&wall){A.b--;A.ph=0;A.tell=.35*k;return false;}return true;}return false;}},
  // Spear wall: "BRACE!" - the drill line steps in front, shots are blocked, then five parallel spears
  {n:'spearwall',wt:3,half:0,ok:e=>AKA.troops(e).length>=2,run(e,A,dt){const k=1/e.spdK,tr=AKA.troops(e);
    if(!A.go){A.go=1;AKA.order(e,'BRACE!');e.brace=1;A.a=aimAt(e);}
    const px=-Math.sin(A.a),py=Math.cos(A.a);
    tr.forEach((m,i)=>{const o=(i-(tr.length-1)/2)*18,tx=e.x+Math.cos(A.a)*26+px*o,ty=e.y+Math.sin(A.a)*26+py*o;m.x+=(tx-m.x)*Math.min(1,dt*8);m.y+=(ty-m.y)*Math.min(1,dt*8);m.iv=.2;});
    // the braced line blocks your shots
    for(const q of projs)if(q.from==='p'&&!q.dead)for(const m of tr)if(Math.hypot(q.x-m.x,q.y-m.y)<10){q.dead=true;spark(q.x,q.y,'#c8c8d0',3,40);break;}
    if(at(A,.5*k)){const all=tr.concat([e]);for(const m of all){const q=bsh(e,m.x,m.y,A.a,250,11,{spr:'spear',st:'lance',wait:.55*k,col:BC.aim,r:2,life:2.4});}sfx('tool');}
    if(A.t>2.2*k){e.brace=0;return true;}return false;},end(e){e.brace=0;}},
  // War rush (the original fight's dash mode): three or four short dashes at you, each telegraphed by a line, spraying
  // arrows to the sides and ending in a ring of drums
  {n:'rush',wt:2,run(e,A,dt){const k=1/e.spdK,N=e.half?4:3;if(!A.go){A.go=1;A.n=0;A.ph=0;AKA.order(e,'AT THEM!');}
    if(A.n>=N)return true;
    if(A.ph===0){if(!A.m){A.a=aimAt(e);A.m=mark({k:'l',x:e.x,y:e.y,a:A.a,len:Math.min(130,rayLen(e.x,e.y,A.a,130)),w:e.r*2+4,t:.4*k,col:BC.aim,grow:false,follow:m=>{m.x=e.x;m.y=e.y;m.a=A.a=aimAt(e);},lock:.12});e.tele=1;}
     if(A.m.fired){A.ph=1;A.m=null;A.dt=0;e.tele=0;sfx('dash');}return false;}
    move(e,Math.cos(A.a)*380*dt,Math.sin(A.a)*380*dt,e.r);A.dt+=dt;if(Math.random()<dt*28)bsh(e,e.x,e.y,A.a+Math.PI/2*(Math.random()<.5?1:-1),32,8,{spr:'arrow',col:BC.fix,r:2,life:1.8});
    if(A.dt>.3){A.ph=0;A.n++;enemyShoot(e,{pat:'flower',cnt:12+(e.half?4:0),sp:56,spr:'drum',col:'#e0b040',dmg:9},0);shake=Math.max(shake,3);}return false;}},
  // War stomp (half health): two rings with a gap, the second turned
  {n:'stomp',wt:2,half:1,run(e,A){if(!A.go){A.go=1;e.tele=2;mark({k:'c',x:e.x,y:e.y,r:42,t:.8,col:BC.fix,dmg:14*e.dm,src:e});}
    if(at(A,.8)){e.tele=0;shake=Math.max(shake,6);sfx('break');const g=Math.random()*TAU;bring(e,e.x,e.y,26,62,9,{col:BC.fix,r:4},0,g,.42);}
    if(at(A,1.2)){bring(e,e.x,e.y,26,55,9,{col:BC.fix,r:4},.12,aimAt(e)+Math.PI*.6,.42);}return A.t>1.5;}},
 ],
 // EVENT 70%: the gate squad rushes in. Cut them all down in 20s or the survivors join the fight
 event:{at:.7,dur:20,name:'ASHIGARU SQUAD',hint:'CUT THEM DOWN IN 20S OR THEY JOIN HIM',
  start(e,E){const A=arenaOf(e);E.mins=[];for(let i=0;i<7;i++)E.mins.push(bMin(e,i<6?'ashigaru':'archer',A.cx+(i-3)*22,A.y1-24));e.ev.mins=E.mins;E.home=freeSpot(e,A.cx,A.y0+60);E.rt=2.5;},
  tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*3);e.y+=(E.home.y-e.y)*Math.min(1,dt*3);
   E.dr=(E.dr==null?1:E.dr)-dt;if(E.dr<=0){E.dr=1.05;E.dk=(E.dk||0)+1;bossBarrage(e,E.dk%2?{pat:'gapring',cnt:26,gw:.42,sp:52,spr:'drum',col:'#e0b040',burst:2,gap:.3}:{pat:'wall',cnt:15,sp:68,r:3,col:BC.aim,burst:2,gap:.4});sfx('beat');}
   E.rt-=dt;if(E.rt<=0){E.rt=4.5;say(e,'LOOSE!','#c02020',.8);const cx=P.x,cy=P.y;for(let i=0;i<5;i++){const a=i/5*TAU+Math.random(),r=i?56:0;mark({k:'c',x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,r:21,t:1.4,dmg:12*e.dm,col:'#3a2a20',src:e});}}
   if(E.mins.every(m=>m.dead)&&E.t>2){E.done=1;setToast('SQUAD ROUTED','#ffd040',2);}},
  end(e,E){const left=E.mins.filter(m=>!m.dead).length;if(left)setToast(left+' ASHIGARU JOIN THE FIGHT','#ff8080',2.5);}},
};

// ================================================================ II. KUSAKARI, THE REED HUNTER - tracking unseen threats
// A masked marsh hunter in a straw raincoat who stalks you through the reeds: invisible in them, only bending stalks show his path. When the stalks
// go still he is about to strike. Your shots cut the reeds for good; a shrine lantern you shoot lights him up.
BART['KUSAKARI, THE REED HUNTER']=Object.assign(({R,E,L,f,atk})=>{
 const ice='#f5f2e3',white='#cad8db',shade='#8399ae',dark='#43536a',ink='#24273a';
 const gold='#dfaa61',red='#a85158',eye=ARTHURT?'#ff826b':'#89ffff';
 const back=atk?3:0,head=atk?5:0,top=atk?3:f,step=f===1?3:0;
 // The far legs sit below the rib cage. The near shoulder and haunch overlap them.
 L(22,33,19+step,45,dark,6);R(18+step,46,8,3,shade);
 L(46,31,49+head,44,dark,6);R(48+head,45,8,3,shade);
 for(let i=0;i<16;i++){
  const x=17-i,y=30-Math.sin(i/16*2.3)*(atk?7:17)+top;
  R(x,y,4,4,i%6<2||i>13?dark:white);
  if(i%6>=2&&i<14)R(x,y,3,1,ice);
 }
 E(30+back,30+top,16,9,shade);E(42,26+top,15,11,white);
 E(29+back,26+top,15,8,white);E(32+back,23+top,14,4,ice);
 E(42,24+top,12,7,ice);E(42,32+top,11,5,shade);
 E(21+back,30+top,8,10,white);E(45,31+top,8,10,white);
 L(22+back,34+top,20-step,46,white,6);L(46,33+top,50+head,46,white,6);
 R(18-step,46,11,3,ice);R(49+head,46,11,3,ice);
 for(const x of [23-step,26-step,55+head,58+head])R(x,48,1,1,dark);
 for(const [x,y,dx,dy] of [[15,23,5,6],[23,19,4,8],[30,17,3,8],[37,16,1,9],[44,17,-3,10],[16,33,5,1],[23,39,4,1],[44,35,7,-1],[47,40,5,-1]]){
  L(x,y+top,x+dx,y+dy+top,ink,2);L(x+dx,y+dy+top,x+dx+1,y+dy+1+top,dark);
 }
 // Rope and bronze charm. The snapped rope and burning eyes mark the second form.
 if(!ARTHURT){L(48,22+top,50,36+top,'#95633f',3);L(49,22+top,51,36+top,gold);R(49,37+top,5,4,gold);R(51,39+top,2,1,red);}
 else {L(47,24+top,49,29+top,red,2);L(49,32+top,54,35+top,red);L(32,21+top,29,30+top,red);L(35,21+top,32,28+top,red);}
 const x=55+head,y=22+top;
 E(x-3,y-7,4,5,dark);E(x+4,y-7,4,5,white);R(x+4,y-10,2,3,'#a66d83');
 E(x,y,10,9,white);E(x+2,y-3,8,5,ice);E(x-4,y+5,6,5,ice);
 L(x-7,y-4,x-2,y,ink,2);L(x-6,y+1,x-3,y+3,ink,2);L(x+2,y-7,x+3,y-2,ink,2);
 L(x+5,y-5,x+5,y-2,ink);R(x+1,y-1,6,2,ink);R(x+2,y-1,4,1,eye);R(x+5,y-1,1,1,'#fff8de');
 E(x+7,y+4,6,4,ice);R(x+11,y+1,3,2,red);R(x+11,y+2,3,1,ink);
 R(x+7,y+3,1,1,dark);R(x+9,y+5,1,1,dark);
 if(atk){E(x+7,y+8,6,3,ink);R(x+4,y+6,7,2,red);R(x+4,y+5,1,3,'#fff8de');R(x+10,y+5,1,3,'#fff8de');R(x+3,y+10,7,1,white);}
 else L(x+5,y+7,x+11,y+5,ink);
},{sc:1,fw:80,fh:53,raw:1});
defProp('slantern','SHRINE LANTERN',99,6,miniSpr(10,18,R=>{R(2,15,6,3,'#8a8a90');R(4,9,2,6,'#9a9aa0');R(1,5,8,4,'#b0b0b8');R(0,3,10,2,'#8a8a90');R(3,0,4,3,'#9a9aa0');R(3,6,4,2,'#3a3a40');}));
const TIG={inReed(e,x,y){for(const r of e.reeds)if(r.hp>0&&Math.hypot(x-r.x,y-r.y)<r.r)return r;return null;},
 lit(e){return e.lamps.some(l=>l.lit>0&&Math.hypot(e.x-l.x,e.y-l.y)<90);},
 mark(A,shape){const m=mark(shape);(A.marks??=[]).push(m);return m;},
 cancel(e,A){for(const m of A.marks||[])if(!m.fired){m.dead=true;m.t=Infinity;}e.air=false;e.z=0;},
 expose(e,t){e.recover=Math.max(e.recover,t);e.moving=false;e.alpha=1;e.hid=false;}};
BKIT['KUSAKARI, THE REED HUNTER']={director:bossDirector,pref:100,gap:.9,halfName:'HAT CUT - FRENZY',noContact:true,
 style:{c:'#a8d8ff',t:['STALKING','CHAIN STORM','FRENZY'],ph:[[],[],[]]},
 guide:['WATCH THE REEDS AND DODGE AFTER THE POUNCE RING LOCKS','SHOOT A LANTERN, THEN BAIT A POUNCE INTO ITS LIGHT','A LANDING IN LIGHT STAGGERS HIM AND ENDS THE LAST HUNT','SHOOT REEDS TO CLEAR COVER BEFORE HE STRIKES'],
 init(e){const A=arenaOf(e);e.reeds=[];e.walks=[{x0:A.cx-160,x1:A.cx+160,y0:A.cy-100,y1:A.cy-78},{x0:A.cx-160,x1:A.cx+160,y0:A.cy+78,y1:A.cy+100}];
  for(let gx=-3;gx<=3;gx++)for(let gy=-3;gy<=3;gy++){const x=A.cx+gx*66+rnd(-12,12),y=A.cy+gy*66+rnd(-12,12);if(Math.random()<.4||blocked(x,y,8)||Math.hypot(x-A.cx,y-A.cy)<40)continue;if(e.walks.some(w=>y>w.y0-14&&y<w.y1+14&&x>w.x0&&x<w.x1))continue;
   const r=rnd(26,34),st=[];for(let i=0;i<46;i++){const a=Math.random()*TAU,d=Math.sqrt(Math.random())*r*.95;st.push({x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,h:ri(9,15),c:pick(['#b8a050','#c8b060','#a89040','#d8c878'])});}e.reeds.push({x,y,r,hp:4,st});}
  e.lamps=[[0,-.62],[-.62,.35],[.62,.35]].map(([a,b])=>bProp(e,'slantern',A.cx+a*A.R,A.cy+b*A.R,{lit:0,cd:0,
   drawAfter:l=>pxAt(l,px=>{if(l.lit>0){px(-3,-14,6,4,'#d48743');px(-2,-15,4,4,'#ffe7a2');}else if(l.cd<=0)px(-1,-13,2,2,'#e9bd77');}),
   onHurt:l=>{if(l.lit<=0&&l.cd<=0){l.lit=5;l.cd=12;sfx('heal');fxRing(l.x,l.y,90,'#ffe080',.5);txtFx(l.x,l.y-12,'LIT!','#ffe080');}return false;}}));
  e.sang=Math.random()*TAU;e.alpha=1;e.recover=0;e.hid=false;e.moving=false;
  e.onHurt=()=>e.recover>0?1.25:e.hid?.45:1;},
 draw(e){
  if(!e.kitOn||!e.awake)return;
  const sp=sprOf(e),X=sx(e.x,e.y),Y=sy(e.x,e.y)+Math.min(6,Math.round(e.r*.6))+2;
  if(e.alpha>.05){
   ctx.globalAlpha=e.alpha;
   shadow(X,Y-2,e.r*2+6);
   const frame=sp.pick?sp.pick(e):e.air||e.A?.wind||e.EV?.strike?.wind?2:e.moving?Math.floor(time*7)%2:0;
   const dir=e.A?.dir??e.EV?.strike?.dir;
   const facing=dir==null?sx(P.x,P.y)<X:scrVec(Math.cos(dir),Math.sin(dir))[0]<0;
   drawSpr(sp,X,Y-e.z,e.flash>0&&meta.opt.flash,frame,facing);
   ctx.globalAlpha=1;
  }
  if(e.recover>0)txt('OPEN',X-7,Y-58,'#ffe8a0');
  return false;
 },
 tick(e,dt,d,inEv){for(const l of e.lamps){if(l.lit>0)l.lit-=dt;else if(l.cd>0)l.cd-=dt;}
  // your shots cut the reeds (each patch takes 4 shots); cut reeds never grow back
  for(const q of projs)if(q.from==='p'&&!q.dead&&!q.reed){const r=TIG.inReed(e,q.x,q.y);if(r){q.reed=1;r.hp--;if(r.hp<=0){for(let i=0;i<14;i++)particles.push({x:r.x+rnd(-r.r,r.r)*.7,y:r.y+rnd(-r.r,r.r)*.7,vx:rnd(-30,30),vy:-rnd(10,40),t:.5,col:'#90b050'});sfx('slash');}}}
  // hidden in the reeds unless lit, attacking, or frenzied
  e.recover=Math.max(0,e.recover-dt);
  const hide=!e.half&&!inEv&&e.recover<=0&&TIG.inReed(e,e.x,e.y)&&!TIG.lit(e)&&!e.A?.show;e.hid=hide;e.alpha=clamp(e.alpha+(hide?-dt*4:dt*5),0,1);
  // rustling stalks give him away while he moves
  if(hide&&e.moving&&Math.random()<dt*18)particles.push({x:e.x+rnd(-8,8),y:e.y+rnd(-5,5),vx:0,vy:-14,t:.35,col:'#d8f0a0'});
  const f=e.hp/e.maxhp;
  if(!inEv&&!e.A&&e.recover>0&&(f>=.30||e.evDone)&&(e.half||f>=.5))return true;
 },
 move(e,dt,d,a){
  if(e.half){e.moving=true;steer(e,d>87?a:a+Math.PI*.56*e.sdir,e.spd*1.65,dt);return;}
  // Circle the player at a distance, preferring cover.
  e.sang+=dt*.5*e.sdir;let best=null;for(let k=0;k<6;k++){const an=e.sang+(k%2?1:-1)*k*.3,x=P.x+Math.cos(an)*115,y=P.y+Math.sin(an)*115;if(TIG.inReed(e,x,y)&&!blocked(x,y,e.r)){best={x,y};e.sang=an;break;}}
  if(!best)best={x:P.x+Math.cos(e.sang)*115,y:P.y+Math.sin(e.sang)*115};const da=Math.atan2(best.y-e.y,best.x-e.x),dd=Math.hypot(best.x-e.x,best.y-e.y);e.moving=dd>6;if(e.moving)steer(e,da,Math.min(dd/dt,e.spd*1.4),dt);},
 floor(e){ctx.save();worldXf();ctx.fillStyle='#5a4028';ctx.globalAlpha=.9;for(const w of e.walks){ctx.fillRect(w.x0,w.y0,w.x1-w.x0,w.y1-w.y0);}ctx.fillStyle='#3a2a18';for(const w of e.walks)for(let x=w.x0;x<w.x1;x+=10)ctx.fillRect(x,w.y0,1.5,w.y1-w.y0);ctx.restore();ctx.globalAlpha=1;
  for(const l of e.lamps)if(l.lit>0){
   ctx.globalAlpha=.13;wdisc(l.x,l.y,90,'#ffe080');ctx.globalAlpha=.7;wcirc(l.x,l.y,90,'#ffe080');ctx.globalAlpha=1;
  }
  // reed beds: stalks sway, and part around the hunter as he slips through
  for(const r of e.reeds){if(r.hp<=0)continue;ctx.globalAlpha=.45;wdisc(r.x,r.y,r.r,'#3a3018');ctx.globalAlpha=1;}
  for(const r of e.reeds){if(r.hp<=0)continue;for(const s of r.st){const X=sx(s.x,s.y),Y=sy(s.x,s.y),near=Math.hypot(e.x-s.x,e.y-s.y)<14&&e.moving,bend=Math.round(Math.sin(time*2+s.x*.3)*1+(near?Math.sin(time*30)*2:0));ctx.fillStyle=near?'#fff8c0':s.c;ctx.fillRect(X,Y-s.h,1,s.h);ctx.fillRect(X+bend,Y-s.h-3,1,3);ctx.fillStyle='#6a5020';ctx.fillRect(X+bend,Y-s.h-3,1,1);}}},
 hud:e=>e.recover>0?'EXPOSED - STRIKE NOW':e.half?'FRENZY - WATCH FOR A SECOND POUNCE':'SHOOT A LANTERN. BAIT HIS POUNCE INTO THE LIGHT.',
 atks:[
  {n:'pounce',wt:4,half:0,end:TIG.cancel,run:(e,A,dt)=>TIG.pounce(e,A,dt,1,.98)},
  {n:'frenzy',wt:4,half:1,end:TIG.cancel,run:(e,A,dt)=>TIG.pounce(e,A,dt,2,.78)},
  {n:'claw',wt:3,gap:.95,end:TIG.cancel,run(e,A){
   const wind=e.half?.58:.72,duration=.22;
   if(!A.go){
    A.go=1;A.show=1;A.wind=1;e.moving=false;A.dir=aimAt(e);
    const C=arenaOf(e);A.x=e.x;A.y=e.y;
    const a=A.dir,max=rayLen(A.x,A.y,a,155),c=Math.cos(a),s=Math.sin(a);
    for(A.len=0;A.len+4<=max;A.len+=4){
     const x=A.x+c*(A.len+4),y=A.y+s*(A.len+4);
     if(x<C.x0+8||x>C.x1-8||y<C.y0+8||y>C.y1-8||blocked(x,y,e.r))break;
    }
    if(A.len<16)return true;
    TIG.mark(A,{k:'l',x:A.x,y:A.y,a,len:A.len,w:22,t:wind,dmg:17*e.dm,col:BC.aim,src:e,quiet:1,
     on:()=>{sfx('slash');for(const side of [-1,1])for(let i=1;i<4;i++){
      const d=A.len*i/4;bsh(e,A.x+c*d,A.y+s*d,a+side*Math.PI/2,65,8,{spr:'blade',col:BC.fix2,life:1.25});
     }}});
    tone(110,.32,'sawtooth',.055,-50);
   }
   if(A.t>=wind){
    const k=clamp((A.t-wind)/duration,0,1);
    e.x=A.x+Math.cos(A.dir)*A.len*k;e.y=A.y+Math.sin(A.dir)*A.len*k;
    if(k<1&&Math.floor(A.t*60)%2===0)spark(e.x,e.y,'#9ac7c8',2,36);
    A.wind=k<1;
   }
   return A.t>wind+duration+.42;
  }},
  {n:'roar',wt:2,gap:1.2,run(e,A){
   if(!A.go){A.go=1;A.show=1;A.wind=1;e.moving=false;A.ga=aimAt(e);tone(70,.62,'sawtooth',.075,-10);}
   const turn=e.half?.42:.25;
   for(let i=0;i<3;i++)if(at(A,.68+i*.48)){
    bring(e,e.x,e.y,24,62+i*5,9,{col:'#a8d8ff',r:3},i*.13,A.ga+i*turn,.53);
    fxRing(e.x,e.y,27,'#a8d8ff',.28);sfx('dash');
   }
   if(at(A,.92))bossPressure(e);
   if(A.t>1.75)A.wind=0;
   return A.t>2.15;
  }},
  {n:'tail',wt:2,ok:(e,d)=>d<74,end:TIG.cancel,run(e,A){
   const wind=e.half?.50:.62;
   if(!A.go){A.go=1;A.show=1;A.wind=1;e.moving=false;A.dir=aimAt(e);
    TIG.mark(A,{k:'cone',x:e.x,y:e.y,a:A.dir,r:68,arc:2.1,t:wind,dmg:14*e.dm,col:BC.aim,src:e,
     on:()=>{sfx('slash');bfan(e,e.x,e.y,A.dir,7,1.9,49,8,{r:4,col:'#c4b791',life:1.8});}});
   }
   if(A.t>wind+.13)A.wind=0;
   return A.t>wind+.72;
  }},
 ],
 event:{at:.30,dur:8,name:'THE LAST HUNT',hint:'BAIT A POUNCE INTO A LIT LANTERN',quiet:true,
  start(e,E){E.strike={t:0};e.alpha=1;e.recover=0;},
  tick(e,dt,E){
   const A=E.strike;
   if(A.pause>0&&A.left===0){A.pause-=dt;return;}
   if(A.left===0)E.strike={t:0};
   if(!E.strike.m&&e.storm<1)return;
   E.strike.t+=dt;
   if(TIG.pounce(e,E.strike,dt,6,.86)&&E.strike.trapped)E.done=true;
  },
  end(e,E){TIG.cancel(e,E.strike);TIG.expose(e,2);}
 },
 onHalf(e){e.alpha=1;e.recover=0;},
};
TIG.pounce=function(e,A,dt,count,wind){
 if(A.left==null)A.left=count;
 if(A.pause>0){A.pause-=dt;return false;}
 if(!A.m){
  e.moving=false;A.wind=1;A.sx=e.x;A.sy=e.y;
  tone(95,.45,'sawtooth',.06,-30);
  const col=BC.aim,flight=.34;
  A.m=TIG.mark(A,{k:'c',x:P.x,y:P.y,r:e.half?24:22,t:wind,lock:flight,col,dmg:18*e.dm,src:e,quiet:1,
   follow:m=>{m.x=P.x;m.y=P.y;},
   on:m=>{
    e.x=m.x;e.y=m.y;e.air=false;e.z=0;A.wind=0;
    shake=Math.max(shake,5);sfx('break');
    fxRing(m.x,m.y,m.r+9,'#acd0c5',.4);spark(m.x,m.y,'#b5ddcd',14,85);
    if(TIG.lit(e)){
     A.trapped=true;TIG.expose(e,1.65);sfx('deflect');fxRing(e.x,e.y,48,'#ffde87',.5);
    }else{
     bossPressure(e);
     const a=A.dir??aimAt(e);
     bring(e,m.x,m.y,e.half?17:13,68,8,{col:'#c3ded2',r:3,life:1.7},a,a+Math.PI,.46);
    }
    for(const r of e.reeds)if(r.hp>0&&Math.hypot(r.x-m.x,r.y-m.y)<r.r+14)r.hp=0;
   }});
  A.flight=flight;
 }
 if(A.m.fired){
  A.m=null;A.left--;A.pause=.43;
  return A.trapped||A.left<=0;
 }
 if(A.m.t<=A.flight){
  if(!e.air){A.show=1;A.dir=Math.atan2(A.m.y-A.sy,A.m.x-A.sx);e.air=true;sfx('dash');}
  const k=clamp(1-A.m.t/A.flight,0,1);
  e.x=lerp(A.sx,A.m.x,k);e.y=lerp(A.sy,A.m.y,k);e.z=Math.sin(k*Math.PI)*39;
 }
 return false;
};

// ================================================================ III. ITOHIME, THE WIRE WEAVER - arena control
// The spider-clan matriarch strings wires through the tunnels. Half the fight she is up in the rafters, only a shadow: spitting and dropping. On the floor she is open but her patterns
// are dense. Webs slow you; shoot a brazier three times to loose a fire arrow that burns webs and knocks her off the ceiling.
defProp('brazier','BRAZIER',99,6,miniSpr(10,12,R=>{R(1,0,8,4,'#5a4a3a');R(0,3,10,2,'#3a2a20');R(4,5,2,6,'#3a2a20');R(1,10,8,2,'#3a2a20');}));
const SPI={};
BKIT['ITOHIME, THE WIRE WEAVER']={director:bossDirector,pref:70,gap:.6,halfName:'WIRES CUT - SHE CANNOT CLIMB',
 style:{c:'#c89040',t:['SILK','THE HATCHING','HUNGERING DARK'],ph:[[],[],[]]},
 guide:['SKILL: ARENA CONTROL. KEEP A LANE OPEN','ON THE CEILING SHE IS ONLY A SHADOW: SHE CANNOT BE HURT','SHOOT A BRAZIER 3 TIMES: A FIRE ARROW BURNS WEBS','AND KNOCKS HER OFF THE CEILING. BREAK THE EGG SACS'],
 shape(m,r){const cx=r.x+(r.w>>1),cy=r.y+(r.h>>1);for(let i=0;i<4;i++){const a=i/4*TAU+.78,x=Math.round(cx+Math.cos(a)*7),y=Math.round(cy+Math.sin(a)*7);solidBlock(m,x,y,2,2);}},
 init(e){const A=arenaOf(e);map.webs=[];for(let i=0;i<6;i++){const a=i/6*TAU+.5,k=A.R*(i%2?.35:.55);map.webs.push({x:A.cx+Math.cos(a)*k,y:A.cy+Math.sin(a)*k,r:30});}
  e.eggs=[];for(let i=0;i<6;i++){const a=i/6*TAU,k=A.R*.78;e.eggs.push(bProp(e,'eggsac',A.cx+Math.cos(a)*k,A.cy+Math.sin(a)*k,{propCol:'#e8e0c8',hatchT:18+i*4}));}
  e.braz=[[0,-1],[1,0],[0,1],[-1,0]].map(([a,b])=>bProp(e,'brazier',A.cx+a*A.R*.5,A.cy+b*A.R*.5,{hits:0,cd:0,onHurt:z=>{if(z.cd>0)return false;z.hits++;spark(z.x,z.y-6,'#ff8030',4,40);if(z.hits>=3){z.hits=0;z.cd=7;SPI.arrow(e,z);}return false;},
   drawAfter:z=>pxAt(z,R=>{if(z.cd<=0){const f=Math.floor(time*10)%2;R(-3,-16-f,6,4,'#ff6020');R(-2,-18-f,4,3,'#ffd060');}for(let i=0;i<3;i++)R(-5+i*4,-22,3,2,i<z.hits?'#ffd040':'#3a2a20');})}));
  e.fire=[];e.segT=10;e.onCeil=0;},
 tick(e,dt,d,inEv){P.slowT=Math.max(P.slowT||0,0);if(map.webs)for(const w of map.webs)if(Math.hypot(P.x-w.x,P.y-w.y)<w.r)P.slowT=Math.max(P.slowT,.12);
  for(const z of e.braz)if(z.cd>0)z.cd-=dt;
  // eggs hatch three spiderlings when their timer runs out, unless broken first
  if(!inEv)for(const g of e.eggs)if(!g.dead){g.hatchT-=dt;if(g.hatchT<=0){g.hatchT=30;SPI.hatch(e,g,3);}}
  // fire arrows fly from the braziers to wherever she is, burning the webs on their way
  for(const f of e.fire){const a=Math.atan2(e.y-f.y,e.x-f.x);f.x+=Math.cos(a)*230*dt;f.y+=Math.sin(a)*230*dt;f.t-=dt;if(Math.random()<.8)particles.push({x:f.x,y:f.y,vx:rnd(-10,10),vy:-20,t:.3,col:pick(['#ff8030','#ffd060'])});
   if(map.webs)map.webs=map.webs.filter(w=>{if(Math.hypot(w.x-f.x,w.y-f.y)<w.r){fxRing(w.x,w.y,w.r,'#ff8030',.4);for(let i=0;i<10;i++)particles.push({x:w.x+rnd(-w.r,w.r)*.7,y:w.y+rnd(-w.r,w.r)*.7,vx:0,vy:-30,t:.5,col:'#ff8030'});return false;}return true;});
   if(Math.hypot(e.x-f.x,e.y-f.y)<e.r+8){f.t=0;if(e.onCeil&&!inEv){SPI.fall(e);}else if(!e.air&&!(e.iv>0)){hurtE(e,e.maxhp*.025,40,{nost:true});}fxRing(f.x,f.y,30,'#ff8030',.4);}}
  e.fire=e.fire.filter(f=>f.t>0);
  // pulled down: she lies on her back for a moment, wide open
  if(e.downT>0){e.downT-=dt;e.tele=0;if(Math.random()<dt*8)spark(e.x,e.y-6,'#ffd040',2,30);if(e.downT<=0)e.segT=8;return true;}
  if(inEv)return;
  e.segT-=dt;if(!e.A&&e.segT<=0&&!e.half){startAtk(e,BKIT[e.name].atks.find(x=>x.n===(e.onCeil?'drop':'climb')));}},
 move(e,dt,d,a){if(e.onCeil){const s=Math.min(d,e.spd*2.4*dt);e.x+=Math.cos(a)*s;e.y+=Math.sin(a)*s;return;}defaultMove(e,dt,d,a,{pref:75});},
 drawAfter(e){if(e.downT>0)txt('DOWN!',sx(e.x,e.y)-11,sy(e.x,e.y)-40,'#ffd040');for(const f of e.fire){const X=sx(f.x,f.y),Y=sy(f.x,f.y)-8;ctx.fillStyle='#ffd060';ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);}},
 hud:e=>(e.onCeil?'SHE IS ON THE CEILING - SHOOT A BRAZIER 3X TO BRING HER DOWN':'BRAZIERS BURN WEBS AND KNOCK HER DOWN')+(e.eggs.some(g=>!g.dead)?'  EGGS: '+e.eggs.filter(g=>!g.dead).length:''),
 onHalf(e){if(e.onCeil){e.onCeil=0;e.air=false;e.ceil=0;e.z=0;}e.downT=0;},
 atks:[
  // climbing: she scuttles up into the dark (invulnerable while up there)
  {n:'climb',wt:0,run(e,A,dt){if(!A.go){A.go=1;e.air=true;say(e,'...','#c89040',.6);}e.z=Math.min(170,(e.z||0)+dt*380);if(e.z>=170){e.onCeil=1;e.ceil=1;e.segT=8;return true;}return false;}},
  // ceiling drop: the shadow shrinks and darkens on your last spot, then she lands with a ring of fangs
  {n:'drop',wt:0,run(e,A,dt){const k=1/e.spdK;if(!A.go){A.go=1;A.m=mark({k:'c',x:P.x,y:P.y,r:26,t:.9*k,lock:.4*k,col:'#3a2416',dmg:20*e.dm,src:e,follow:m=>{m.x=P.x;m.y=P.y;e.x=m.x;e.y=m.y;},
    on:m=>{e.x=m.x;e.y=m.y;e.onCeil=0;e.ceil=0;e.air=false;e.z=0;shake=Math.max(shake,8);sfx('break');bring(e,e.x,e.y,8,70,9,{col:BC.fix,r:3,spr:'blade'},Math.random());e.segT=11;}});}
    if(!A.m.fired)e.z=Math.max(0,170*(A.m.t/A.m.dur));return A.m.fired&&A.t>A.m.dur+.3;}},
  // silk lines: 4-6 threads fly out and harden into walls for 4s (6s at half health). Keep a lane open
  {n:'silk',wt:3,ok:e=>!e.onCeil||Math.random()<.6,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=1;}
    if(at(A,.45*k)){e.tele=0;const n=ri(4,6),o=Math.random()*TAU;for(let i=0;i<n;i++){const a=o+i/n*TAU;for(let j=0;j<5;j++)bsh(e,e.x,e.y,a,60+j*10,8,{spr:'silk',st:'stick',sd:55+j*18,life:e.half?6:4,col:BC.fix,r:2});}sfx('shoot');}return A.t>.8*k;}},
  // venom globs: lobbed arcs; their landing circles show first; each leaves a 3s pool
  {n:'venom',wt:3,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;sfx('tool');for(let i=0;i<5;i++){const a=i/5*TAU+Math.random(),r=i?rnd(30,70):0,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(blocked(x,y,2))continue;
     mark({k:'c',x,y,r:16,t:(.75+i*.1)*k,dmg:12*e.dm,col:BC.haz,src:e,on:m=>{hz.push({x:m.x,y:m.y,r:14,t:3,dps:10*e.dm,col:'#4a9a20'});}});}}return A.t>1.3*k;}},
  // web net: she rears back, then a wide slow mesh that slows you if it touches you. Dash through its thin edge
  {n:'net',wt:2,ok:e=>!e.onCeil,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=2;A.a=aimAt(e);mark({k:'cone',x:e.x,y:e.y,a:A.a,r:80,arc:1.2,t:.5*k,col:BC.fix});}
    if(at(A,.5*k)){e.tele=0;for(let j=0;j<2;j++)bfan(e,e.x,e.y,A.a,7+j,1.1,50+j*12,7,{st:'big',r:5,col:'#e8e8f0',slowP:1.6,life:3});}return A.t>.8*k;}},
  // leg sweep (floor only): eight legs strike in a clockwise circle. Follow the circle round behind the strikes
  {n:'legs',wt:2,ok:(e,d)=>!e.onCeil&&d<90,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=1;const o=aimAt(e)+Math.PI;for(let i=0;i<8;i++){const a=o+i/8*TAU;mark({k:'c',x:e.x+Math.cos(a)*32,y:e.y+Math.sin(a)*32,r:15,t:(.4+i*.09)*k,dmg:13*e.dm,col:BC.aim,src:e});}}return A.t>1.2*k;}},
  // venom fan (half health): no longer able to climb, she spits wider fans
  {n:'fan',wt:3,half:1,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=1;A.a=aimAt(e);mark({k:'cone',x:e.x,y:e.y,a:A.a,r:70,arc:2.2,t:.45*k,col:BC.haz});}
    if(at(A,.45*k)){e.tele=0;bfan(e,e.x,e.y,A.a,11,2.2,70,9,{spr:'venom',st:'big',r:4,col:BC.haz,life:1.8,pool:{r:9,t:2,dps:8,col:'#4a9a20'}});}if(at(A,.75*k))bfan(e,e.x,e.y,A.a+.1,10,2,58,9,{spr:'venom',st:'big',r:4,col:BC.haz,life:1.8});return A.t>1*k;}},
 ],
 // EVENT 70%: the hatching. Every egg bursts at once and a swarm runs at you; she waits on the ceiling
 event:{at:.7,dur:20,name:'THE HATCHING',hint:'SURVIVE THE SWARM',
  start(e,E){e.air=true;e.ceil=1;e.z=170;e.onCeil=1;for(const g of e.eggs.filter(x=>!x.dead))SPI.hatch(e,g,3);E.sw=1;},
  tick(e,dt,E){e.air=true;e.z=170;const a=aimAt(e),dd=dist(e,P);e.x+=Math.cos(a)*Math.min(dd,40*dt);e.y+=Math.sin(a)*Math.min(dd,40*dt);
   E.sw-=dt;if(E.sw<=0){E.sw=2.4;const A=arenaOf(e);for(let i=0;i<2&&enemies.filter(m=>m.bossOwned===e&&m.minion&&!m.dead).length<14;i++){const an=Math.random()*TAU;const m=bMin(e,'spiderling',A.cx+Math.cos(an)*A.R*.75,A.cy+Math.sin(an)*A.R*.75);m.hp=m.maxhp*.7;}}
   E.dr=(E.dr||2)-dt;if(E.dr<=0){E.dr=1.6;mark({k:'c',x:P.x+rnd(-20,20),y:P.y+rnd(-20,20),r:14,t:1,dmg:10*e.dm,col:'#e8e8f0',src:e});}
   // the nest walls spit silk: rings with a gap from where the egg sacs hung
   E.wr=(E.wr==null?.8:E.wr)-dt;if(E.wr<=0&&eShots()<170){E.wr=1.1;const A=arenaOf(e),a=Math.random()*TAU,x=A.cx+Math.cos(a)*A.R*.72,y=A.cy+Math.sin(a)*A.R*.72;bring(e,x,y,22,50,8,{spr:'silk',col:BC.fix,r:3,life:6},Math.random(),Math.atan2(P.y-y,P.x-x),.38);}},
  end(e){e.segT=3;}},
};
SPI.hatch=function(e,g,n){g.dead=true;spark(g.x,g.y,'#e8e0c8',16,80);sfx('break');txtFx(g.x,g.y-8,'HATCHED!','#e8e0c8');for(let i=0;i<n;i++){const m=bMin(e,'spiderling',g.x+rnd(-8,8),g.y+rnd(-8,8));}};
SPI.arrow=function(e,z){e.fire.push({x:z.x,y:z.y-10,t:3});sfx('tool');txtFx(z.x,z.y-14,'FIRE ARROW!','#ff8030');};
SPI.fall=function(e){cancelAtk(e);e.onCeil=0;e.ceil=0;e.air=false;e.z=0;e.downT=4;shake=Math.max(shake,8);sfx('break');impact(e.x,e.y,'#ff8030',8,true);txtFx(e.x,e.y-16,'SHOT DOWN!','#ffd040',2);setToast('SHE FALLS - STRIKE!','#ffd040',2);};

// ================================================================ IV. LADY HOTARU, THE LANTERN ONMYOJI - breaking shields
// While any of her five charm-lanterns burns she is behind a gold barrier, and each lit lantern powers one paper spirit.
// Snuff them (5 shots each) to open her up; she relights one every 25s. Lighting a plain lantern lures her spirits away.
BART['LADY HOTARU']=Object.assign(p=>{const {R,E,L,f,atk}=p,b=f===1?1:0,hurt=ARTHURT,cx=24;
 // long black hair down her back
 R(cx-7,8,12,30,'#14101a');R(cx-8,14,3,22,'#14101a');
 // layered court robes (red, orange, gold edges), widening to the floor
 for(let j=0;j<32;j++){const w=7+Math.floor(j*.45),y=22+j+b*(j<4?1:0);R(cx-w,y,w*2,1,'#8a1a20');R(cx-w,y,2,1,'#e0a040');R(cx+w-2,y,2,1,'#e0a040');R(cx-w+2,y,2,1,'#ff8030');}
 R(cx-3,22+b,6,10,'#f8f4e8');R(cx-1,22+b,2,10,'#c02020');R(cx-9,33+b,18,2,'#e0b040');
 // great sleeves; the front one raised with two fingers when she casts
 R(cx-15,24+b,8,14,'#a02020');R(cx-15,36+b,8,2,'#e0a040');
 if(atk){R(cx+6,16,10,7,'#a02020');R(cx+15,13,2,4,'#f0d8c0');R(cx+17,12,1,3,'#f0d8c0');}else{R(cx+7,24+b,8,14,'#a02020');R(cx+7,36+b,8,2,'#e0a040');}
 // white-painted face, red lips, eyes, a gold hair pin
 bFace(p,cx,6+b,'#f8f0e8');R(cx+1,14+b,2,1,'#d02030');R(cx-6,4+b,13,4,'#14101a');R(cx+5,3+b,4,1,'#e0b040');R(cx+8,2+b,1,3,'#ff8030');
 // her lantern staff
 const lx=atk?cx+19:cx-18;R(lx,8,1,44,'#5a3a22');E(lx,8,4,5,'#ff8030');E(lx,8,3,4,'#ffd060');R(lx-3,3,7,1,'#14101a');R(lx-3,13,7,1,'#14101a');
 // paper talismans floating about her
 for(let i=0;i<3;i++){const a=f*.8+i*2.1;R(cx+Math.cos(a)*16,26+Math.sin(a)*6,2,4,'#f8f4e8');R(cx+Math.cos(a)*16,27+Math.sin(a)*6,2,1,'#c02020');}
 if(hurt){for(let i=0;i<9;i++){R(cx-18+i*4,48+(i%2)*2,3,4,'#ff6020');R(cx-17+i*4,46+(i%2)*2,1,3,'#ffd060');}R(cx-15,24,8,3,'#3a0a08');}},{sc:1.1});
defProp('charmlamp','CHARM LANTERN',99,6,miniSpr(4,26,R=>{R(1,0,2,26,'#3a2a1a');}));
defProp('paperlamp','PAPER LANTERN',99,6,miniSpr(4,22,R=>{R(1,0,2,22,'#3a2a1a');}));
DUMMYSPR.shikigami=miniSpr(9,13,(R,f)=>{R(2,0,5,4,'#f8f4e8');R(0,4,9,4,'#f8f4e8');R(2,8,2,4+f,'#f8f4e8');R(5,8,2,5-f,'#f8f4e8');R(3,1,1,1,'#14101a');R(5,1,1,1,'#14101a');R(3,5,3,1,'#c02020');},2);
ET.shikigami={n:'SHIKIGAMI',desc:'A PAPER SPIRIT BOUND TO A CHARM-LANTERN',hp:16,spd:50,pos:20,r:4,ai:'dummy',rng:0,wl:0,fly:true,atks:[]};
const HOT={lit:e=>e.lamps.filter(l=>l.lit),
 drawLamp(l,charm){pxAt(l,R=>{const on=charm?l.lit:l.lure>0,f=Math.floor(time*8)%2;R(-1,-26,2,26,'#3a2a1a');R(-5,-34,10,9,'#14101a');R(-4,-33,8,7,on?(charm?'#ffd060':'#ff9040'):'#5a5048');if(on){R(-2,-32,4,5,f?'#fff0a0':'#ffd060');}R(-3,-31,6,1,charm?'#c02020':'#14101a');R(-3,-28,6,1,charm?'#c02020':'#14101a');
   if(charm&&l.lit)for(let i=0;i<5;i++)R(-6+i*3,-40,2,2,i<5-l.hits?'#ffd040':'#3a2a20');});
  if((charm&&l.lit)||l.lure>0){ctx.globalAlpha=.1;wdisc(l.x,l.y,30,'#ffd060');ctx.globalAlpha=1;}return false;},
 spirit(e,l){const m=bMin(e,'shikigami',l.x,l.y-6);m.t=Object.assign({},ET.shikigami);m.lamp=l;m.oa=Math.random()*TAU;l.spirit=m;return m;}};
BKIT['LADY HOTARU']={director:bossDirector,pref:95,gap:.8,halfName:'ROBES ABLAZE',
 style:{c:'#ff8030',t:['LANTERN WARD','PAPER STORM','BURNING SUTRA'],ph:[[],[],[]]},
 guide:['SKILL: BREAKING SHIELDS','A GOLD BARRIER HOLDS WHILE ANY CHARM-LANTERN BURNS','SNUFF THEM: 5 SHOTS EACH. SHE RELIGHTS ONE EVERY 25S','SHOOT A PLAIN LANTERN TO LURE HER SPIRITS TO IT'],
 init(e){const A=arenaOf(e);e.t.fly=true;e.lamps=[];for(let i=0;i<5;i++){const a=i/5*TAU-Math.PI/2,k=A.R*.6;
   const l=bProp(e,'charmlamp',A.cx+Math.cos(a)*k,A.cy+Math.sin(a)*k,{lit:1,hits:0,onHurt:l=>{if(!l.lit)return false;l.hits++;spark(l.x,l.y-30,'#ffd060',4,40);if(l.hits>=5)HOT.snuff(e,l);return false;}});l.drawFn=l=>HOT.drawLamp(l,1);e.lamps.push(l);HOT.spirit(e,l);}
  e.lures=[[0,0],[-.62,.62],[.62,.62]].map(([a,b])=>{const l=bProp(e,'paperlamp',A.cx+a*A.R,A.cy+b*A.R*.8,{lure:0,onHurt:l=>{if(l.lure<=0){l.lure=6;sfx('heal');txtFx(l.x,l.y-30,'LURE!','#ff9040');}return false;}});l.drawFn=l=>HOT.drawLamp(l,0);return l;});
  e.relT=25;e.houseT=18;e.onHurt=(b,dmg)=>{if(HOT.lit(b).length){spark(b.x,b.y-10,'#ffd040',3,40);if(Math.random()<.2)txtFx(b.x,b.y-18,'WARDED','#ffd040');return .06;}return 1;};},
 tick(e,dt,d,inEv){for(const l of e.lures)if(l.lure>0)l.lure-=dt;
  // paper spirits circle their lantern's lady, or drift to a lit lure
  for(const l of e.lamps){const m=l.spirit;if(!m||m.dead)continue;if(m.dash)continue;const lure=e.lures.find(x=>x.lure>0);m.oa+=dt*1.6;const cx=lure?lure.x:e.x,cy=lure?lure.y:e.y,R0=lure?18:34,tx=cx+Math.cos(m.oa)*R0,ty=cy+Math.sin(m.oa)*R0;m.x+=(tx-m.x)*Math.min(1,dt*3);m.y+=(ty-m.y)*Math.min(1,dt*3);}
  if(inEv)return;
  // she relights a lantern every 25s (20 at half health): a gold thread runs to it first
  e.relT-=dt;if(e.relT<=0){e.relT=e.half?20:25;const off=e.lamps.filter(l=>!l.lit);if(off.length){const l=pick(off);mark({k:'l',x:e.x,y:e.y,a:aimAt(e,l.x,l.y),len:dist(e,l),w:3,t:1.5,col:BC.gold,quiet:1,on:()=>{l.lit=1;l.hits=0;HOT.spirit(e,l);sfx('heal');txtFx(l.x,l.y-36,'RELIT','#ffd040');}});say(e,'RISE','#c02020',1);}}
  // the burning houses collapse, leaving lines of fire that change the square
  e.houseT-=dt;if(e.houseT<=0){e.houseT=22;const A=arenaOf(e),side=ri(0,3),o=rnd(30,70);const L=side===0?{x:A.cx-140,y:A.y0+o,a:0}:side===1?{x:A.cx-140,y:A.y1-o,a:0}:side===2?{x:A.x0+o,y:A.cy-140,a:Math.PI/2}:{x:A.x1-o,y:A.cy-140,a:Math.PI/2};
   mark({k:'l',x:L.x,y:L.y,a:L.a,len:280,w:16,t:1.6,col:'#ff6020',dmg:14*e.dm,stay:8,sdmg:9*e.dm,src:e});setToast('A HOUSE COLLAPSES','#ff8030',1.5);}},
 drawAfter(e){const n=e.lamps?HOT.lit(e).length:0;if(n&&!e.dead){ctx.globalAlpha=.4+.15*Math.sin(time*6);wcirc(e.x,e.y,e.r+8,'#ffd040');wcirc(e.x,e.y,e.r+10,'#fff0a0');ctx.globalAlpha=1;}},
 hud:e=>{const n=HOT.lit(e).length;return n?'BARRIER UP: '+n+' CHARM-LANTERNS LIT - SNUFF THEM (5 SHOTS)':'BARRIER DOWN - STRIKE!';},hudC:'#ffd040',
 onHalf(e){},
 atks:[
  // talisman spiral: two fingers raised, a chant, then two arms turning opposite ways (three at half health)
  {n:'spiral',wt:3,run(e,A,dt){if(!A.go){A.go=1;e.tele=1;tone(300,.5,'triangle',.04,60);A.a1=Math.random()*TAU;A.a2=A.a1;A.ft=0;}
    if(A.t<.5)return false;e.tele=0;const arms=e.half?3:2;A.a1+=dt*1.5;A.a2-=dt*1.5;A.ft-=dt;
    if(A.ft<=0){A.ft=.13;for(let i=0;i<arms;i++){bsh(e,e.x,e.y,A.a1+i/arms*TAU,56,8,{spr:'charm',col:BC.fix,r:3,life:4.5});bsh(e,e.x,e.y,A.a2+i/arms*TAU+.3,56,8,{spr:'charm',col:BC.fix,r:3,life:4.5});}}
    return A.t>5.5;}},
  // paper cranes: they fold, wait half a second, then home gently. Lead them in a wide curve
  {n:'cranes',wt:3,run(e,A){if(!A.go){A.go=1;sfx('tool');const n=e.half?5:3;for(let i=0;i<n;i++){const a=aimAt(e)+(i/(n-1||1)-.5)*2.4;bsh(e,e.x+Math.cos(a)*16,e.y+Math.sin(a)*16,a,0,10,{spr:'crane',st:'crane',wait:.5+i*.12,csp:72,turn:1.3,seekT:2.4,col:BC.fix,r:3,life:5});}}return A.t>1;}},
  // fire glyphs: four circles fill with light around you, then each erupts in a cross. Stand diagonal to them
  {n:'glyphs',wt:3,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=1;const o=Math.random()*TAU;for(let i=0;i<4;i++){const a=o+i/4*TAU,x=P.x+Math.cos(a)*48,y=P.y+Math.sin(a)*48;
     mark({k:'c',x,y,r:12,t:1*k,col:'#ff7030',dmg:12*e.dm,src:e});for(const la of [0,Math.PI/2])mark({k:'l',x:x-Math.cos(la)*70,y:y-Math.sin(la)*70,a:la,len:140,w:8,t:1*k,col:'#ff7030',dmg:12*e.dm,src:e,grow:false,on:m=>{for(let j=0;j<6;j++)particles.push({x:m.x+Math.cos(m.a)*j*24,y:m.y+Math.sin(m.a)*j*24,vx:0,vy:-40,t:.35,col:'#ffd060'});}});}}
    if(at(A,1*k)){e.tele=0;sfx('break');}return A.t>1.3*k;}},
  // shikigami dash: each spirit's eyes glow, then it dashes at you leaving a short fire trail
  {n:'dash',wt:2,ok:e=>e.lamps.some(l=>l.spirit&&!l.spirit.dead),run(e,A,dt){const k=1/e.spdK,sp=e.lamps.map(l=>l.spirit).filter(m=>m&&!m.dead);
    if(!A.go){A.go=1;sp.forEach((m,i)=>{m.dash={t:-(.6+i*.25)*k,a:0};mark({k:'l',x:m.x,y:m.y,a:aimAt(m),len:150,w:8,t:(.6+i*.25)*k,lock:.2,col:BC.aim,follow:mm=>{mm.x=m.x;mm.y=m.y;if(m.dash&&!m.dead)mm.a=m.dash.a=aimAt(m);}});});}
    let busy=false;for(const m of sp){if(!m.dash)continue;busy=true;m.dash.t+=dt;if(m.dash.t>0){move(m,Math.cos(m.dash.a)*260*dt,Math.sin(m.dash.a)*260*dt,m.r);if(Math.random()<dt*20)hz.push({x:m.x,y:m.y,r:7,t:1,dps:9*e.dm,col:'#ff6020'});
      if(dist(m,P)<m.r+5&&P.iv<=0&&P.dash<=0)hitPlayer(12*e.dm,m.x,m.y,{src:e});if(m.dash.t>.55)m.dash=null;}}
    return !busy&&A.t>.4;},end(e){for(const l of e.lamps)if(l.spirit)l.spirit.dash=null;}},
  // burning sutra (half health): a ring of embers hangs in the air, then flies out speeding up
  {n:'sutra',wt:3,half:1,run(e,A){if(!A.go){A.go=1;e.tele=1;for(let i=0;i<18;i++){const a=i/18*TAU,r=30;bsh(e,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,a,0,9,{spr:'ember',st:'hang',wait:.9,ha:a,csp:40,then:'accel',acc:1.4,cap:150,col:'#ff8030',r:3});}}
    if(at(A,.9)){e.tele=0;sfx('shoot');}return A.t>1.3;}},
 ],
 // EVENT 70%: paper storm. Her spirits burst into scraps that sweep across the square in walls with one gap
 event:{at:.7,dur:20,name:'PAPER STORM',hint:'SLIP THROUGH THE GAP IN EACH WAVE',
  start(e,E){E.wt=.6;E.k=0;E.home={x:arenaOf(e).cx,y:arenaOf(e).cy};for(const l of e.lamps)if(l.spirit&&!l.spirit.dead){l.spirit.hidden=1;}},
  tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*2);e.y+=(E.home.y-e.y)*Math.min(1,dt*2);E.wt-=dt;
   if(E.wt<=0){E.wt=1.45;E.k++;const A=arenaOf(e),dir=E.k%4,horiz=dir<2,sgn=dir%2?1:-1,n=22,gap=ri(4,n-6);
    for(let i=0;i<n;i++){if(i>=gap&&i<gap+3)continue;const o=(i/(n-1)-.5)*(A.x1-A.x0-30);const x=horiz?(sgn>0?A.x0+10:A.x1-10):A.cx+o,y=horiz?A.cy+o:(sgn>0?A.y0+10:A.y1-10),a=horiz?(sgn>0?0:Math.PI):(sgn>0?Math.PI/2:-Math.PI/2);
     bsh(e,x,y,a,62,8,{spr:'charm',col:BC.fix,r:3,life:9});}sfx('shoot');}}},
};
HOT.snuff=function(e,l){l.lit=0;l.hits=0;sfx('break');fxRing(l.x,l.y-30,24,'#5a5048',.4);txtFx(l.x,l.y-38,'SNUFFED','#c8c0b0');if(l.spirit&&!l.spirit.dead){l.spirit.dead=true;spark(l.spirit.x,l.spirit.y,'#f8f4e8',12,60);}l.spirit=null;
 if(!HOT.lit(e).length){setToast('THE BARRIER FALLS!','#ffd040',2.5);fxRing(e.x,e.y,50,'#ffd040',.5);e.relT=Math.max(e.relT,10);}};

// ================================================================ V. THE RONIN SEVEN - target priority
// Seven masterless samurai, one health bar in seven segments. Three fight at once, the rest wait on the inn porch.
// Whoever falls passes something on to the others, so the order you cut them down changes the fight.
// The giant's armour protects every other ronin while he stands; the leader only steps in once four have fallen.
const R7=[{id:'JUBEI',type:'samurai',c:'#f0f0f4',sig:'iaido',r:85},{id:'GONZA',type:'ashigaru',c:'#9a9aa8',sig:'thrust',r:65},{id:'HANZO',type:'archer',c:'#ff4a3a',sig:'volley',r:125},
 {id:'OKICHI',type:'assassin',c:'#70d040',sig:'chain',r:75},{id:'TETSUGORO',type:'brute',c:'#4060c0',sig:'cleave',r:55},{id:'TWINS',type:'ninja',c:'#ff9030',sig:'zig',r:95,twins:1},{id:'MURAMASA',type:'samurai',c:'#ff80c0',sig:'blossom',r:85,leader:1}];
const R7SPR={};
function r7Spr(d){return R7SPR[d.id]||(R7SPR[d.id]=Object.assign({},foeSprite(d.type,basePal(d.c,shade(d.c,-.45),'#f0e8d8',shade(d.c,-.6))),{sc:d.type==='brute'?1:1.1}));}
const R7K={
 alive:e=>e.r7.filter(m=>!m.dead),
 seg:(e,id)=>e.r7.filter(m=>m.d.id===id),
 segDead:(e,id)=>R7K.seg(e,id).every(m=>m.dead),
 fallen:e=>R7.filter(d=>R7K.segDead(e,d.id)).length,
 active:e=>e.r7.filter(m=>!m.dead&&m.fight),
 porch(e,i){const A=arenaOf(e);return {x:A.cx-120+i*40,y:A.y0+34};},
 // pick who steps down from the porch next (the leader waits for four to fall)
 rotateIn(e){const want=e.EV?99:3;let act=R7K.active(e);for(const m of e.r7){if(act.length>=want)break;if(m.dead||m.fight)continue;if(m.d.leader&&R7K.fallen(e)<4&&!e.EV)continue;
   const grp=m.d.twins?e.r7.filter(o=>o.d.twins&&!o.dead):[m];grp.forEach(o=>{o.fight=1;o.iv=0;o.cd=rnd(.8,1.6);txtFx(o.x,o.y-14,o.d.id+'!',o.d.c);});act=R7K.active(e);}},
};
BKIT['THE RONIN SEVEN']={director:r7Director,keepSpr:1,noContact:true,halfName:'BERSERK - ARMOUR THROWN OFF',
 style:{c:'#c0c8d8',t:['SEVEN BLADES','THE GATE CLOSES','BERSERK'],ph:[[],[],[]]},
 guide:['SKILL: TARGET PRIORITY. ONE BAR, SEVEN SEGMENTS','THE GIANT TETSUGORO ARMOURS THE OTHERS WHILE HE STANDS','EACH ONE THAT FALLS GIVES THE OTHERS A TRICK','THE LEADER MURAMASA FIGHTS ONLY WHEN FOUR HAVE FALLEN'],
 shape(m,r){const cx=r.x+(r.w>>1),cy=r.y+(r.h>>1);solidBlock(m,cx-1,cy-1,2,2);for(const [a,b] of [[-6,-3],[5,-3],[-6,4],[5,4]])solidBlock(m,cx+a,cy+b,1,1);},
 init(e){e.ghost=true;e.air=true;const A=arenaOf(e),per=e.maxhp/7;e.r7=[];
  R7.forEach((d,i)=>{const n=d.twins?2:1;for(let k=0;k<n;k++){const p=R7K.porch(e,i+k*.5);const m=mkEnemy(d.type,p.x,p.y,e.room,R.di);
    Object.assign(m,{hp:per/n,maxhp:per/n,maxPosture:e.maxPosture*.35,label:d.id,labelC:d.c,sprOv:r7Spr(d),bossOwned:e,awake:true,d,r:d.type==='brute'?8:6,fight:0,iv:999,cd:2,ang:Math.random()*TAU,sigs:[d.sig]});
    m.t=Object.assign({},m.t,{ai:'dummy'});m.dm*=1.2;m.onHurt=m=>(m.d.id!=='TETSUGORO'&&!R7K.segDead(e,'TETSUGORO'))?.7:1;enemies.push(m);e.r7.push(m);}});
  e.members=R7.map(d=>({ronin:d.id,labelC:d.c,get dead(){return R7K.segDead(e,d.id);}}));
  e.formT=12;e.gone={};R7K.rotateIn(e);},
 hud:e=>!R7K.segDead(e,'TETSUGORO')?'TETSUGORO ARMOURS THE OTHERS: THEY TAKE 30% LESS':R7K.fallen(e)<4?'MURAMASA WAITS ON THE PORCH UNTIL FOUR FALL':null,
 onHalf(e){for(const m of R7K.alive(e)){m.hp*=.8;m.spd*=1.2;}say(e,'',null,.1);setToast('MURAMASA DRAWS HIS BLADE','#ff80c0',2.5);},
 event:{at:.3,dur:20,name:'THE GATE CLOSES',hint:'EVERY RONIN ATTACKS AT ONCE - SURVIVE',
  start(e){for(const m of R7K.alive(e)){m.fight=1;m.cd=rnd(.5,1.5);}},
  tick(e,dt){for(const m of R7K.alive(e)){m.iv=.3;}},
  end(e){for(const m of R7K.alive(e)){m.fight=0;m.iv=999;}R7K.rotateIn(e);}},
};
function r7Director(e,dt,d){const K=BKIT[e.name];kitStart(e,K);
 for(const m of e.r7)if(!m.awake)m.awake=true;
 e.hp=e.r7.reduce((s,m)=>s+(m.dead?0:Math.max(0,m.hp)),0);
 if(e.hp<=0){killE(e);return true;}
 // someone fell: they pass something on, and the next ronin steps in
 for(const d2 of R7)if(!e.gone[d2.id]&&R7K.segDead(e,d2.id)){e.gone[d2.id]=1;R7FALL[d2.id](e);setToast(d2.id+' FALLS - '+R7FALLTXT[d2.id],d2.c,3);}
 if(phaseGate(e,K,dt)&&!e.EV)return true;
 if(!e.EV)R7K.rotateIn(e);
 const act=R7K.active(e),k=e.half?1.2:1;
 // waiting ronin stand on the porch, untouchable
 e.r7.forEach((m,i)=>{if(m.dead||m.fight)return;m.iv=999;const p=R7K.porch(e,R7.indexOf(m.d)+(m.d.twins&&m!==e.r7.find(o=>o.d.twins)?.5:0));m.x+=(p.x-m.x)*Math.min(1,dt*3);m.y+=(p.y-m.y)*Math.min(1,dt*3);});
 // formations every so often (not during the gate)
 if(!e.EV){e.formT-=dt;if(e.formT<=0&&act.length>=2&&!e.form){e.formT=14;e.form=R7FORM(e,act);}}
 if(e.form){e.form.t+=dt;if(e.form.run(e,e.form,dt)){e.form=null;for(const m of act)m.cd=rnd(.6,1.2);}return true;}
 for(const m of act){tickBarrage(m,dt);m.bt=(m.bt==null?rnd(.4,1.2):m.bt)-dt;if(m.bt<=0){m.bt=(e.EV?1.5:1.05)/k/BHK();const L=R7BAR[m.d.id];if(eShots()<220)bossBarrage(m,Object.assign({dmg:8,pd:6},L[(m.bn=(m.bn||0)+1)%L.length]));}
  if(m.A){m.A.t+=dt;if(R7SIG[m.A.n](e,m,m.A,dt)){m.A=null;m.tele=0;m.cd=rnd(1.8,2.8)/k/(e.EV?1.3:1);}continue;}
  // circle the player at this ronin's own range
  m.ang+=dt*.5*(m.d.twins&&m===e.r7.find(o=>o.d.twins)?-1:1);let tx=P.x+Math.cos(m.ang)*m.d.r,ty=P.y+Math.sin(m.ang)*m.d.r;
  if(m.d.twins){const tw=e.r7.filter(o=>o.d.twins&&!o.dead);if(tw.length===2&&m===tw[1]){tx=P.x-(tw[0].x-P.x);ty=P.y-(tw[0].y-P.y);}}
  const da=Math.atan2(ty-m.y,tx-m.x),dd=Math.hypot(tx-m.x,ty-m.y);if(dd>4)steer(m,da,Math.min(dd/dt,m.spd*1.6*k),dt);
  m.cd-=dt;if(m.cd<=0)m.A={n:pick(m.sigs),t:0};}
 return true;}
// signature attacks: (coordinator, ronin, attack state, dt) -> true when finished
const R7SIG={
 iaido(e,m,A){if(!A.go){A.go=1;m.tele=1;A.n2=A.n2||0;const a=aimAt(m);mark({k:'l',x:m.x,y:m.y,a,len:rayLen(m.x,m.y,a,420),w:12,t:.55,dmg:15*m.dm,col:BC.aim,src:m,on:mm=>{for(let i=0;i<14;i++)particles.push({x:mm.x+Math.cos(mm.a)*i*20,y:mm.y+Math.sin(mm.a)*i*20,vx:0,vy:-10,t:.3,col:'#fff'});sfx('slash');}});}
  if(A.t>.75){if(m.twice&&!A.again){A.again=1;A.go=0;A.t=0;return false;}return true;}return false;},
 thrust(e,m,A){if(!A.go){A.go=1;m.tele=1;const a=aimAt(m),px=-Math.sin(a),py=Math.cos(a);for(const o of [-16,0,16])mark({k:'l',x:m.x+px*o,y:m.y+py*o,a,len:130,w:7,t:.6,dmg:13*m.dm,stay:1.5,sdmg:8*m.dm,col:'#9a9aa8',src:m});}return A.t>.9;},
 volley(e,m,A){if(!A.go){A.go=1;m.tele=1;}for(let v=0;v<2;v++)if(at(A,.45+v*.35)){bfan(m,m.x,m.y,aimAt(m),3,.36,135,9,{spr:'arrow',col:BC.aim,r:2});}return A.t>1.1;},
 chain(e,m,A){if(!A.go){A.go=1;m.tele=1;}if(at(A,.4)){for(let i=0;i<10;i++)bsh(m,m.x,m.y,i/10*TAU,0,8,{st:'orbit',ox:m.x,oy:m.y,oa:i/10*TAU,or:8,ow:3.2,orv:55,spr:'chainlink',col:'#9a9aa8',life:1.5,r:3});
   mark({k:'c',x:P.x,y:P.y,r:14,t:.7,dmg:12*m.dm,stay:1,sdmg:7*m.dm,col:BC.haz,src:m});}return A.t>1.2;},
 cleave(e,m,A){if(!A.go){A.go=1;m.tele=2;A.a=aimAt(m);mark({k:'cone',x:m.x,y:m.y,a:A.a,r:70*(m.reach||1),arc:2.44,t:.8,dmg:19*m.dm,col:BC.aim,src:m});}
  if(at(A,.8)){bfan(m,m.x,m.y,A.a,5,2.2,42,10,{spr:'naginata',r:6,st:'big',col:'#4060c0',life:3});shake=Math.max(shake,5);}return A.t>1.1;},
 zig(e,m,A){if(!A.go){A.go=1;m.tele=1;}for(let i=0;i<6;i++)if(at(A,.35+i*.09))bsh(m,m.x,m.y,aimAt(m),95,8,{st:'zig',zT:.22,zA:.7,col:'#ff9030',r:3});
  if(m.pull&&at(A,.9))bsh(m,m.x,m.y,aimAt(m),260,9,{st:'lance',wait:.45,spr:'chainlink',col:'#9a9aa8',r:2});return A.t>1.2;},
 blossom(e,m,A,dt){if(!A.go){A.go=1;m.tele=1;A.a=Math.random()*TAU;A.ft=0;}if(A.t<.4)return false;A.a+=dt*1.7;A.ft-=dt;if(A.ft<=0){A.ft=.1;for(let i=0;i<2;i++)bsh(m,m.x,m.y,A.a+i*Math.PI,60,8,{spr:'petal',col:'#ff80c0',r:3});}return A.t>2.6;},
};
// what a fallen ronin passes on
const R7FALLTXT={JUBEI:'THE LEADER LEARNS HIS IAIDO',GONZA:"THE GIANT'S CLEAVE GROWS",HANZO:'NO MORE AIMED ARROWS',OKICHI:'THE TWINS TAKE HER CHAIN',TETSUGORO:'THE OTHERS LOSE THEIR ARMOUR',TWINS:'JUBEI NOW SLASHES TWICE',MURAMASA:'THE GANG BREAKS'};
const R7FALL={JUBEI:e=>R7K.seg(e,'MURAMASA').forEach(m=>m.sigs.push('iaido')),GONZA:e=>R7K.seg(e,'TETSUGORO').forEach(m=>m.reach=1.35),HANZO:()=>{},
 OKICHI:e=>R7K.seg(e,'TWINS').forEach(m=>m.pull=1),TETSUGORO:()=>{},TWINS:e=>R7K.seg(e,'JUBEI').forEach(m=>m.twice=1),MURAMASA:()=>{}};
// formations: circle (dash out before it shuts), firing line (flank to its end), pincer (break out through one side)
function R7FORM(e,act){const hz2=act.find(m=>m.d.id==='HANZO'),opts=['circle','pincer'];if(hz2)opts.push('line');const k=pick(opts);setToast(k==='circle'?'FORMATION: CIRCLE - DASH OUT!':k==='line'?'FORMATION: FIRING LINE - FLANK IT':'FORMATION: PINCER',e.style?'#fff':'#c0c8d8',1.8);
 if(k==='circle')return {t:0,cx:P.x,cy:P.y,run(e,F,dt){const R0=F.t<1?85:lerp(85,30,clamp((F.t-1)/1.6,0,1));act.forEach((m,i)=>{if(m.dead)return;const a=i/act.length*TAU+F.t*.6,tx=F.cx+Math.cos(a)*R0,ty=F.cy+Math.sin(a)*R0;m.x+=(tx-m.x)*Math.min(1,dt*6);m.y+=(ty-m.y)*Math.min(1,dt*6);m.tele=F.t>1?1:0;});
   if(at(F,1))mark({k:'c',x:F.cx,y:F.cy,r:40,t:1.7,dmg:20*e.dm,col:BC.aim,src:e});return F.t>2.9;}};
 if(k==='line')return {t:0,run(e,F,dt){const a=Math.atan2(arenaOf(e).cy-P.y,arenaOf(e).cx-P.x)+Math.PI,px=-Math.sin(a+Math.PI),py=Math.cos(a+Math.PI);
   act.forEach((m,i)=>{if(m.dead)return;const o=(i-(act.length-1)/2)*26,tx=P.x-Math.cos(a)*110+px*o,ty=P.y-Math.sin(a)*110+py*o;if(F.t<1){m.x+=(tx-m.x)*Math.min(1,dt*4);m.y+=(ty-m.y)*Math.min(1,dt*4);}
    for(let r=0;r<2;r++)if(at(F,1.1+r*act.length*.35+i*.35)){m.tele=1;bfan(m,m.x,m.y,aimAt(m),3,.3,120,9,{spr:'arrow',col:BC.aim,r:2});}});return F.t>1.3+2*act.length*.35;}};
 return {t:0,run(e,F,dt){const two=act.slice(0,2),a=Math.random()*0;two.forEach((m,i)=>{if(m.dead)return;const an=(F.a==null?(F.a=Math.random()*TAU):F.a)+i*Math.PI,tx=P.x+Math.cos(an)*100,ty=P.y+Math.sin(an)*100;if(F.t<.9){m.x+=(tx-m.x)*Math.min(1,dt*5);m.y+=(ty-m.y)*Math.min(1,dt*5);}});
   if(at(F,1))two.forEach(m=>{if(!m.dead)m.A={n:m.sigs[0],t:0};});let busy=false;for(const m of two)if(m.A&&!m.dead){m.A.t+=dt;if(R7SIG[m.A.n](e,m,m.A,dt))m.A=null;else busy=true;}return F.t>1.2&&!busy;}};}

// ================================================================ VI. TETSUO THE GUNSMITH - reload windows
// He stays on his tower behind two lines of matchlock gunners. The lines fire on his fan signal and then need 2.5s to
// reload: move in the reload windows. Their barrels interleave, so the gaps of one line are the lanes of the other.
// Cannons punish anyone who rushes the tower; a ballista on the south wall cracks his armour if you man it.
BART['TETSUO THE GUNSMITH']=Object.assign(p=>{const {R,E,L,b,atk}=p,hurt=ARTHURT;
 const h=bWarrior(p,{ar:hurt?'#5a3a2a':'#5a5a68',ad:hurt?'#3a2418':'#3a3a48',ac:hurt?'#7a5a3a':'#c0a040',lg:'#3a2a20',hand:'#e0b080',arm:hurt?'#e0b080':'#6a6a78',chest:hurt?'#8a2020':'#c8ccd8'});
 if(!hurt){R(h.cx-5,h.ty+1,10,1,'#ffffff');R(h.cx-1,h.ty+2,2,6,'#9aa0b0');}
 const hx=h.cx,hy=h.ty-12;bFace(p,hx,hy,'#e0b080');R(hx-1,hy+8,6,1,'#3a2418');R(hx+4,hy+7,2,2,'#3a2418');
 // a foreign morion helmet with a crest
 if(!hurt){E(hx,hy+1,8,3,'#9aa0b0');R(hx-9,hy+2,18,1,'#c8ccd8');R(hx-1,hy-5,2,5,'#c8ccd8');R(hx-4,hy-6,8,2,'#9aa0b0');}else{R(hx-6,hy-1,12,3,'#3a2418');}
 if(hurt){// twin flintlocks
  for(const [x,y] of [[h.hx,h.hy],[h.cx-14,h.ty+19]]){R(x,y,7,2,'#3a3a40');R(x,y+2,2,3,'#6a4a2a');R(x+6,y,1,1,'#ffd040');}}
 else{// a long matchlock with a glowing match
  if(atk){L(h.hx-14,h.hy+4,h.hx+14,h.hy-2,'#6a4a2a',2);L(h.hx+2,h.hy+1,h.hx+18,h.hy-3,'#3a3a40',2);R(h.hx+18,h.hy-5,2,2,'#ff8030');}
  else{R(h.hx,4,2,44,'#6a4a2a');R(h.hx,2,2,14,'#3a3a40');R(h.hx-1,20,1,1,'#ff8030');}}},{sc:1.1});
defProp('gunner','MATCHLOCK GUNNER',60,5,null);
DUMMYSPR.gunner=Object.assign({},foeSprite('sniper',basePal('#4a4a52','#2a2a32','#c0a040','#2a2a32')),{sc:1.1});
defProp('keg','POWDER KEG',14,6,miniSpr(10,11,R=>{R(1,0,8,11,'#7a4a20');R(0,2,10,7,'#8a5a28');R(0,2,10,1,'#3a3a40');R(0,8,10,1,'#3a3a40');R(3,4,4,3,'#14101a');R(4,5,2,1,'#e0e0e0');}));
defProp('cannon','CANNON',999,7,miniSpr(16,10,R=>{R(0,6,16,4,'#5a3a22');R(2,0,12,6,'#2a2a30');R(12,1,4,4,'#14101a');R(3,1,8,1,'#5a5a66');R(2,8,3,2,'#3a2a1a');R(11,8,3,2,'#3a2a1a');}));
const TET={
 lines(e){return e.glines;},
 line(e,L){const A=arenaOf(e),xs=L.k?[-100,-50,0,50,100]:[-125,-75,-25,25,75,125],y=A.cy+(L.k?-35:-80);return xs.map(x=>({x:A.cx+x,y}));},
 mkLine(e,L){L.men=TET.line(e,L).map(p=>{const g=bProp(e,'gunner',p.x,p.y,{propCol:'#c0a040'});g.prop=false;g.minion=true;g.hp=g.maxhp=g.maxhp*.8;g.t=Object.assign({},ET.gunner);return g;});
  const kx=L.k?A0(e).cx+150:A0(e).cx-170,ky=TET.line(e,L)[0].y;L.keg=bProp(e,'keg',kx,ky,{propCol:'#ff8030',onBreak:()=>TET.blow(e,L)});L.dead=0;},
 blow(e,L){const k=L.keg;impact(k.x,k.y,'#ff8030',12,true);sfx('break');fxRing(k.x,k.y,70,'#ff8030',.5);if(Math.hypot(P.x-k.x,P.y-k.y)<55)hitPlayer(18*e.dm,k.x,k.y,{peril:true});
  for(const g of L.men)if(!g.dead){g.dead=true;spark(g.x,g.y,'#ff8030',12,90);}L.dead=30;setToast('THE POWDER BLOWS - A GUN LINE IS GONE FOR 30S','#ff8030',2.5);},
};
const A0=e=>arenaOf(e);
BKIT['TETSUO THE GUNSMITH']={director:bossDirector,pref:0,gap:1.1,halfName:'ARMOUR BLOWN OFF - PISTOLS DRAWN',
 style:{c:'#c0a040',t:['VOLLEY','WALL BREACH','TWIN PISTOLS'],ph:[[],[],[]]},
 guide:['SKILL: RELOAD WINDOWS','TWO GUN LINES FIRE IN TURN, THEN RELOAD FOR 2.5S','THEIR BARRELS INTERLEAVE: MOVE IN THE RELOAD','SHOOT A POWDER KEG. STAND ON THE BALLISTA TO CRACK HIS ARMOUR'],
 init(e){const A=arenaOf(e);e.tower=freeSpot(e,A.cx,A.y0+46,e.r);e.x=e.tower.x;e.y=e.tower.y;e.hx=e.x;e.hy=e.y;
  e.glines=[{k:0,fire:0,rel:0,t:1.6},{k:1,fire:0,rel:0,t:3.2}];for(const L of e.glines)TET.mkLine(e,L);e.sig=0;
  e.cannons=[[-80,26],[80,26]].map(([a,b])=>bProp(e,'cannon',A.cx+a,A.y0+b+40,{onHurt:()=>false}));
  e.bal={x:A.cx,y:A.y1-36,hold:0,cd:0};e.crack=0;e.stunT=0;e.bolts=[];
  e.onHurt=b=>b.half||b.crack>0?1:.4;},
 tick(e,dt,d,inEv){const A=arenaOf(e);
  // the gun lines: fan raised, matches glow, a volley of parallel shots straight down the ramparts, then a long reload
  if(!inEv)for(const L of e.glines){if(L.dead>0){L.dead-=dt;if(L.dead<=0){TET.mkLine(e,L);setToast('A NEW GUN LINE TAKES ITS PLACE','#c0a040',1.5);}continue;}
   L.t-=dt*(e.half?.75:1);const men=L.men.filter(g=>!g.dead);if(!men.length){L.dead=20;if(L.keg&&!L.keg.dead)L.keg.dead=true;continue;}
   if(L.t<=.7&&!L.tell&&men.length){L.tell=1;if(!e.half&&!e.stunT)say(e,'FIRE!','#c0a040',.7);for(const g of men)mark({k:'l',x:g.x,y:g.y,a:Math.PI/2,len:rayLen(g.x,g.y,Math.PI/2,520),w:5,t:.7,col:'#e8e0d0',grow:false});}
   if(L.t<=0){L.t=3.2;L.tell=0;L.rel=2.5;for(const g of men){bsh(e,g.x,g.y+4,Math.PI/2,200,9,{col:'#e8e0d0',r:2,life:3});for(let i=0;i<4;i++)particles.push({x:g.x+rnd(-3,3),y:g.y+4,vx:rnd(-10,10),vy:rnd(5,25),t:.6,col:'#c8c8c8'});}if(men.length)sfx('shoot');}
   if(L.rel>0)L.rel-=dt;}
  // the ballista: stand on it for 2s and it looses a bolt at him
  const B=e.bal;if(B.cd>0)B.cd-=dt;else if(Math.hypot(P.x-B.x,P.y-B.y)<16&&!inEv){B.hold+=dt;if(B.hold>=2){B.hold=0;B.cd=18;e.bolts.push({x:B.x,y:B.y-6});sfx('tool');setToast('BALLISTA LOOSED!','#ffd040',1.5);}}else B.hold=Math.max(0,B.hold-dt*2);
  for(const bt of e.bolts){const a=aimAt({x:bt.x,y:bt.y},e.x,e.y);bt.x+=Math.cos(a)*320*dt;bt.y+=Math.sin(a)*320*dt;if(Math.hypot(bt.x-e.x,bt.y-e.y)<e.r+6){bt.hit=1;if(!inEv&&!(e.iv>0))TET.bolt(e);}}
  e.bolts=e.bolts.filter(b=>!b.hit);
  if(e.crack>0)e.crack-=dt;
  if(e.stunT>0){e.stunT-=dt;e.tele=0;if(Math.random()<dt*8)spark(e.x,e.y-14,'#ffd040',2,30);return true;}},
 move(e,dt,d,a){if(!e.half){const tx=e.tower.x+Math.sin(time*.6)*30;e.x+=(tx-e.x)*Math.min(1,dt*2);e.y+=(e.tower.y-e.y)*Math.min(1,dt*2);return;}
  // on foot he keeps a pistol's distance and rolls away if you close in
  defaultMove(e,dt,d,a,{pref:95});},
 floor(e){const A=arenaOf(e);ctx.save();worldXf();ctx.globalAlpha=.85;ctx.fillStyle='#4a4a54';ctx.fillRect(e.tower.x-40,e.tower.y-22,80,40);ctx.fillStyle='#6a6a78';for(let x=-40;x<40;x+=12)ctx.fillRect(e.tower.x+x,e.tower.y+16,7,4);
  const B=e.bal;ctx.globalAlpha=1;ctx.fillStyle='#5a3a22';ctx.fillRect(B.x-12,B.y-4,24,8);ctx.fillStyle='#3a2a1a';ctx.fillRect(B.x-2,B.y-14,4,20);ctx.fillStyle=B.cd>0?'#5a5a66':'#e8eef6';ctx.fillRect(B.x-1,B.y-18,2,6);ctx.restore();ctx.globalAlpha=1;
  if(B.hold>0){ctx.save();worldXf();ctx.strokeStyle='#ffd040';ctx.lineWidth=2;ctx.beginPath();ctx.arc(B.x,B.y,16,-Math.PI/2,-Math.PI/2+TAU*B.hold/2);ctx.stroke();ctx.restore();}
  // reloading lines show their smouldering matches
  for(const L of e.glines)if(L.rel>0&&!L.dead)for(const g of L.men)if(!g.dead&&Math.random()<.2)particles.push({x:g.x+rnd(-2,2),y:g.y-6,vx:0,vy:-12,t:.5,col:'#9a9a9a'});},
 drawAfter(e){for(const bt of e.bolts){const X=sx(bt.x,bt.y),Y=sy(bt.x,bt.y)-10;ctx.fillStyle='#e8eef6';ctx.fillRect(X-1,Y-3,2,7);ctx.fillStyle='#ffd040';ctx.fillRect(X-1,Y-4,2,2);}
  if(e.stunT>0)txt('STUNNED',sx(e.x,e.y)-15,sy(e.x,e.y)-48,'#ffd040');if(e.crack>0&&!e.half)txt('ARMOUR CRACKED',sx(e.x,e.y)-28,sy(e.x,e.y)-56,'#ffd040');},
 hud:e=>e.half?null:e.crack>0?'ARMOUR CRACKED - FULL DAMAGE!':e.bal.cd>0?'HIS ARMOUR TURNS 60% OF YOUR DAMAGE. BALLISTA READY IN '+Math.ceil(e.bal.cd):'HIS ARMOUR TURNS 60% OF YOUR DAMAGE - STAND ON THE BALLISTA (SOUTH)',
 onHalf(e){e.y=Math.min(arenaOf(e).cy-20,e.y+60);impact(e.x,e.y,'#ffd040',8,true);},
 atks:[
  // cannonball: a cannon recoils with a boom; a heavy ball skips along and bounces off the walls twice
  {n:'cannon',wt:3,run(e,A){if(!A.go){A.go=1;A.c=pick(e.cannons.filter(c=>!c.dead))||e;A.c.flash=.4;mark({k:'l',x:A.c.x,y:A.c.y,a:aimAt(A.c),len:120,w:14,t:.6,col:BC.aim,grow:false});}
    if(at(A,.6)){const q=bsh(e,A.c.x,A.c.y,aimAt(A.c),78,12,{spr:'ball',r:7,st:'bounce',bn:2,col:'#14101a',life:7});impact(A.c.x,A.c.y,'#c8c8c8',4);sfx('break');}return A.t>.9;}},
  // grapeshot: when you rush the tower, a cannon is lowered to point blank: a cone of pellets, fast then slowing
  {n:'grape',wt:5,ok:(e,d)=>d<150&&!e.half,run(e,A){if(!A.go){A.go=1;A.c=e.cannons.reduce((a,b)=>dist(a,P)<dist(b,P)?a:b);A.a=aimAt(A.c);mark({k:'cone',x:A.c.x,y:A.c.y,a:A.a,r:130,arc:1.1,t:.7,col:BC.aim,dmg:0});}
    if(at(A,.7)){for(let i=0;i<20;i++)bsh(e,A.c.x,A.c.y,A.a+rnd(-.5,.5),rnd(120,190),7,{col:'#c8c8d0',r:2,st:'decel',dec:1.6,minSp:30,life:2});impact(A.c.x,A.c.y,'#c8c8c8',5);sfx('break');}return A.t>1;}},
  // fire arrows: archers light their arrows; the landing spots burn for 4s
  {n:'fire',wt:2,run(e,A){if(!A.go){A.go=1;say(e,'LIGHT!','#ff8030',.7);for(let i=0;i<5;i++){const a=Math.random()*TAU,r=i?rnd(25,75):0;mark({k:'c',x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,r:15,t:1+i*.12,dmg:11*e.dm,col:'#ff7030',src:e,on:m=>hz.push({x:m.x,y:m.y,r:13,t:4,dps:9*e.dm,col:'#ff6020'})});}}return A.t>1.6;}},
  // twin pistols (half health): fast alternating aimed shots
  {n:'pistols',wt:4,half:1,run(e,A){if(!A.go){A.go=1;e.tele=1;}for(let i=0;i<8;i++)if(at(A,.35+i*.16)){const s=i%2?1:-1,a=aimAt(e);bsh(e,e.x-Math.sin(a)*4*s,e.y+Math.cos(a)*4*s,a+rnd(-.05,.05),170,9,{col:BC.aim,r:2});sfx('shoot');}return A.t>1.8;}},
  // rolling dodge (half health): when you get close he rolls away, and fires as he comes up
  {n:'roll',wt:6,half:1,ok:(e,d)=>d<70,run(e,A,dt){if(!A.go){A.go=1;A.a=aimAt(e)+Math.PI+rnd(-.6,.6);e.iv=.5;sfx('dash');}if(A.t<.4){move(e,Math.cos(A.a)*220*dt,Math.sin(A.a)*220*dt,e.r);return false;}
    if(at(A,.45))bfan(e,e.x,e.y,aimAt(e),5,.8,120,9,{col:BC.aim,r:2});return A.t>.7;}},
  {n:'cannon2',wt:1,half:1,run(e,A){if(!A.go){A.go=1;A.c=pick(e.cannons);}if(at(A,.5)){bsh(e,A.c.x,A.c.y,aimAt(A.c),78,12,{spr:'ball',r:7,st:'bounce',bn:2,col:'#14101a',life:7});sfx('break');}return A.t>.7;}},
 ],
 // EVENT 70%: wall breach. Siege ladders go up both walls and climbers pour over while the cannons keep firing
 event:{at:.7,dur:20,name:'WALL BREACH',hint:'HOLD THE WALL - SURVIVE',
  start(e,E){E.st=.5;E.ct=2;E.lad=[{x:arenaOf(e).x0+20,y:arenaOf(e).cy+30},{x:arenaOf(e).x1-20,y:arenaOf(e).cy+30}];},
  tick(e,dt,E){E.st-=dt;if(E.st<=0){E.st=2.6;for(const l of E.lad)if(enemies.filter(m=>m.bossOwned===e&&m.minion&&!m.dead).length<10)bMin(e,pick(['ashigaru','bandit','ashigaru']),l.x,l.y);}
   E.ct-=dt;if(E.ct<=0){E.ct=2.2;const c=pick(e.cannons);bsh(e,c.x,c.y,aimAt(c),80,12,{spr:'ball',r:7,st:'bounce',bn:2,col:'#14101a',life:7});impact(c.x,c.y,'#c8c8c8',4);sfx('break');}
   for(const l of E.lad)if(Math.random()<dt*6)particles.push({x:l.x+rnd(-6,6),y:l.y+rnd(-20,20),vx:0,vy:-6,t:.4,col:'#8a6a40'});}},
};
TET.bolt=function(e){const dm=e.maxhp*.08;e.hp-=dm;txtFx(e.x,e.y-10,Math.round(dm),'#ffd040');impact(e.x,e.y,'#ffd040',10,true);sfx('break');e.crack=6;cancelAtk(e);if(!e.half)e.stunT=3;setToast('DIRECT HIT - ARMOUR CRACKED!','#ffd040',2);if(e.hp<=0)killE(e);};

// ================================================================ VII. THE THOUSAND-BELL ABBOT - rhythm and counters
// Everything happens on a 90 bpm beat. He teleports between the eight bells on the first beat of each bar and his attacks
// land on the beats after it; the bell he stands under swings on the off-beat as the tell. Ring a bell yourself
// (3 shots) to send a gold silencing ring that wipes out his shots and stuns him if it reaches him.
defProp('bbell','BRONZE BELL',999,7,miniSpr(14,24,R=>{R(6,0,2,6,'#3a2a1a');R(3,6,8,2,'#b08a30');R(2,8,10,10,'#a07a28');R(1,16,12,3,'#b08a30');R(3,9,2,8,'#d0aa50');R(6,19,2,3,'#6a4a18');}));
const BEAT=60/90;
BKIT['THE THOUSAND-BELL ABBOT']={director:abbotDirector,keepSpr:0,halfName:'HIS BELL CRACKS - OFF THE BEAT',
 style:{c:'#d8b040',t:['THE BEAT','THE GREAT BELL','OFF THE BEAT'],ph:[[],[],[]]},
 guide:['SKILL: RHYTHM AND COUNTERS. EVERY ATTACK LANDS ON THE BEAT','HE MOVES BELL TO BELL ON THE FIRST BEAT OF EACH BAR','SHOOT A BELL 3 TIMES: ITS GOLD RING CANCELS SHOTS AND STUNS HIM','EACH CHANTING MONK CUTS HIS DAMAGE TAKEN. 8 HITS SEND ONE FLEEING'],
 init(e){const A=arenaOf(e);e.bells=[];for(let i=0;i<8;i++){const a=i/8*TAU-Math.PI/2,k=A.R*.74;const b=bProp(e,'bbell',A.cx+Math.cos(a)*k,A.cy+Math.sin(a)*k,{hits:0,cd:0,glow:0,
   onHurt:b=>{if(b.cd>0)return false;b.hits++;spark(b.x,b.y-16,'#ffd040',4,40);if(b.hits>=3){b.hits=0;b.cd=8;e.sil.push({x:b.x,y:b.y,r:6});tone(880,.6,'triangle',.07,-200);fxRing(b.x,b.y,30,'#ffd040',.4);}return false;},
   drawAfter:b=>{if(b.glow>0){ctx.globalAlpha=b.glow;wdisc(b.x,b.y,16,'#ffd040');ctx.globalAlpha=1;}pxAt(b,R=>{for(let i=0;i<3;i++)R(-5+i*4,-34,3,2,b.cd>0?'#3a2a20':i<b.hits?'#ffd040':'#6a5a40');});}});b.bi=i;e.bells.push(b);}
  e.monks=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b2])=>{const m=bMin(e,'monk',A.cx+a*A.R*.42,A.cy+b2*A.R*.42);m.t=Object.assign({},ET.monk,{ai:'dummy'});m.hp=m.maxhp=9999;m.hits=0;
   m.onHurt=m=>{m.hits++;if(m.hits>=8){m.dead=true;spark(m.x,m.y,'#d8b040',14,80);txtFx(m.x,m.y-12,'FLEES!','#d8b040');}return 0;};return m;});
  e.sil=[];e.bt=BEAT;e.bn=0;e.at=e.bells[0];e.x=e.at.x;e.y=e.at.y+14;
  e.onHurt=b=>1-.15*b.monks.filter(m=>!m.dead).length;},
 hud:e=>{const n=e.monks.filter(m=>!m.dead).length;return n?n+' MONKS CHANT: HE TAKES '+(n*15)+'% LESS - 8 HITS SEND ONE FLEEING':'SHOOT A BELL 3X: ITS GOLD RING STUNS HIM';},
 hudExtra(e){// the beat: four pips, the current one lit
  for(let i=0;i<4;i++){const on=(e.bn%4)===i,x=Math.round(W/2-14+i*8);ctx.fillStyle=on?'#ffd040':'#4a3a20';ctx.fillRect(x,H-48,6,on?4:3);}},
 drawAfter(e){if(e.downT>0)txt('STUNNED',sx(e.x,e.y)-15,sy(e.x,e.y)-50,'#ffd040');},
 overlay(e){for(const s of e.sil){ctx.save();worldXf();ctx.strokeStyle='#ffd040';ctx.lineWidth=3;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.stroke();ctx.restore();ctx.globalAlpha=1;}},
 event:{at:.3,dur:16,name:'THE GREAT BELL FALLS',hint:'GET OUT FROM UNDER IT - DASH THROUGH THE WAVE',
  start(e,E){const A=arenaOf(e);e.x=A.cx;e.y=A.y0+40;E.k=0;E.nt=0;},
  tick(e,dt,E){E.nt-=dt;if(E.nt<=0&&E.t+4<e.EVdef.dur){E.nt=5.2;const A=arenaOf(e),x=E.k?P.x:A.cx,y=E.k?P.y:A.cy;E.k++;tone(60,1,'sine',.08,-10);
    mark({k:'c',x,y,r:62,t:4,dmg:30*e.dm,col:'#5a4010',src:e,shake:12,on:m=>{impact(m.x,m.y,'#d8b040',12,true);sfx('break');bring(e,m.x,m.y,52,64,10,{col:'#d8b040',r:4,life:5},0);}});}}},
};
function abbotDirector(e,dt,d){const K=BKIT[e.name];kitStart(e,K);
 if(e.say){e.say.t-=dt;if(e.say.t<=0)e.say=null;}
 for(const b of e.bells){if(b.cd>0)b.cd-=dt;b.glow=Math.max(0,b.glow-dt*3);}
 // silencing rings: they wipe enemy shots they pass over and stun him if they reach him
 for(const s of e.sil){s.r+=dt*170;for(const q of projs)if(q.from==='e'&&!q.peril&&Math.abs(Math.hypot(q.x-s.x,q.y-s.y)-s.r)<8){q.dead=true;spark(q.x,q.y,'#ffd040',2,30);}
  if(!s.hit&&Math.abs(Math.hypot(e.x-s.x,e.y-s.y)-s.r)<10&&!e.EV){s.hit=1;e.downT=2.2;e.A=null;txtFx(e.x,e.y-20,'SILENCED!','#ffd040',2);sfx('break');}}
 e.sil=e.sil.filter(s=>s.r<420);
 tickBarrage(e,dt);if(phaseGate(e,K,dt))return true;
 if(e.downT>0){e.downT-=dt;if(Math.random()<dt*8)spark(e.x,e.y-14,'#ffd040',2,30);return true;}
 barrageTick(e,K,dt);
 // the beat clock. Every bar: beat 0 he moves, beats 1-3 he strikes. At half health the strikes drift off the beat
 e.bt-=dt;if(e.bt<=0){e.bt+=BEAT;e.bn++;const bb=e.bn%4;tone(bb===0?220:330,.06,'square',.03,-60);
  if(bb===0)ABB.newBar(e);else if(e.A){const j=e.half?rnd(-.3,.3)*BEAT:0;e.A.q.push({t:Math.max(0,BEAT*.0+j),b:bb});}}
 // off-beat tell: his bell swings half a beat before each strike
 if(e.bt<BEAT*.5&&e.bt>BEAT*.5-dt&&e.A&&(e.bn+1)%4!==0&&e.at)e.at.glow=.7;
 if(e.A){for(const q of e.A.q){q.t-=dt;if(q.t<=0){q.done=1;ABB[e.A.n](e,e.A,q.b);}}e.A.q=e.A.q.filter(q=>!q.done);}
 return true;}
const ABB={
 newBar(e){const prev=e.at;let nb;do{nb=pick(e.bells);}while(nb===prev);const opts=['toll','toll','beads','staff','strike'];if(e.half)opts.push('cracked','cracked');const n=pick(opts.filter(o=>o!==(e.A&&e.A.n)));
  e.A={n,q:[],t:0};if(n==='strike'){e.A.b2=e.bells.filter(b=>b!==nb).reduce((a,b)=>dist(a,nb)<dist(b,nb)?a:b);nb.glow=1;e.A.b2.glow=1;}
  spark(e.x,e.y,'#d8b040',12,70);e.at=nb;e.x=nb.x;e.y=nb.y+14;spark(e.x,e.y,'#d8b040',12,70);fxRing(e.x,e.y,24,'#d8b040',.3);sfx('dash');},
 // toll rings: one per beat from his bell; thin ones (dash through) and thick ones with a gap
 toll(e,A,b){const thick=b===2;if(thick)bring(e,e.x,e.y,40,62,9,{col:'#c89030',r:4,life:4.5},b*.1,aimAt(e)+rnd(-.5,.5),.38);else bring(e,e.x,e.y,44,70,8,{col:'#e8d8a0',r:2,life:4.5},b*.07);tone(440,.25,'triangle',.05,-100);},
 // prayer beads: a string of 30 beads snaking across in a wave
 beads(e,A,b){if(b!==1)return;const a=aimAt(e);for(let i=0;i<30;i++)bsh(e,e.x,e.y,a,0,7,{spr:'bead',st:'hang',wait:i*.05,ha:a,csp:78,then:'wave',wa:60,wf:5,col:'#7a4a20',r:2,life:7});},
 // staff spin: a ring of twelve short bursts, then twelve more turned between them
 staff(e,A,b){const o=b===2?TAU/24:0;for(let i=0;i<12;i++)for(let j=0;j<3;j++)bsh(e,e.x,e.y,o+i/12*TAU,50+j*14,8,{col:'#c08040',r:3,life:5});tone(160,.3,'square',.05,-40);},
 // teleport strike: two bells glow; he strikes both, ring sets from each
 strike(e,A,b){if(b===2)return;for(const s of [e.at,A.b2])bring(e,s.x,s.y,30,58,9,{col:'#c89030',r:3,life:4.5},b*.1);tone(440,.25,'triangle',.05,-100);},
 // cracked toll (half health): broken rings with random gaps, read them by sight
 cracked(e,A,b){const ga=Math.random()*TAU;bring(e,e.x,e.y,36,rnd(52,72),9,{col:'#a07a28',r:3,life:4.5},Math.random(),ga,.5);if(Math.random()<.25)bring(e,e.x,e.y,36,50,9,{col:'#a07a28',r:3,life:4.5},Math.random(),ga+Math.PI,.5);},
};

// ================================================================ VIII. ONIKUMA, THE JAILER - close-range fighting
// His kanabo swings round him on its chain all the time: one safe gap turns with it. Far away his chain lashes reach you;
// inside the orbit you are safe from the club. Molten channels shape where he walks. At half health he drops the orbit
// and grabs.
defProp('cage','HANGING CAGE',999,6,miniSpr(4,4,R=>{R(0,0,4,4,'#3a3a40');}));
const ONI={R:50,
 orbitHit(e){if(e.half||e.orbOff)return false;const d=dist(e,P);if(Math.abs(d-ONI.R)>7)return false;return Math.abs(angDiff(aimAt(e),e.gap))>.55;},
 lava(x,y){return liqAt(x,y)===2;}};
BKIT['ONIKUMA, THE JAILER']={director:bossDirector,pref:60,gap:.9,halfName:'CHAIN WRAPPED - THE GRABS BEGIN',
 style:{c:'#ff8030',t:['THE ORBIT','THE JAILERS','BARE HANDS'],ph:[[],[],[]]},
 guide:['SKILL: CLOSE-RANGE FIGHTING','HIS CLUB ORBITS HIM. MOVE WITH THE GAP, OR STAY INSIDE IT','FAR AWAY, HIS CHAIN LASH REACHES YOU','SHOOT A CAGE CHAIN TO DROP IT ON HIM. LURE HIM OVER A VENT'],
 shape(m,r){const cx=r.x+(r.w>>1),cy=r.y+(r.h>>1);for(let j=r.y;j<r.y+r.h;j++)for(let i=r.x;i<r.x+r.w;i++)m.liq[j*MW+i]=0;const lv=(x0,y0,w,h)=>{for(let j=y0;j<y0+h;j++)for(let i=x0;i<x0+w;i++){const k=j*MW+i;if(m.t[k])m.liq[k]=2;}};
  lv(cx-9,cy-10,2,6);lv(cx-9,cy-2,2,4);lv(cx-9,cy+6,2,5);lv(cx+7,cy-10,2,6);lv(cx+7,cy-2,2,4);lv(cx+7,cy+6,2,5);lv(cx-7,cy,5,2);lv(cx+2,cy,5,2);},
 init(e){const A=arenaOf(e);e.gap=0;e.vents=[[0,-.45],[.45,0],[0,.45],[-.45,0]].map(([a,b],i)=>({x:A.cx+a*A.R,y:A.cy+b*A.R,i}));e.ventT=6;e.vk=0;e.stunT=0;
  e.cages=[[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]].map(([a,b])=>{const c=bProp(e,'cage',A.cx+a*A.R,A.cy+b*A.R,{hits:0,cd:0,onHurt:c=>{if(c.cd>0)return false;c.hits++;spark(c.x,c.y-30,'#9a9aa8',3,30);if(c.hits>=3){c.hits=0;c.cd=25;ONI.drop(e,c);}return false;}});
   c.drawFn=c=>{pxAt(c,R=>{const y0=c.cd>0?-60:-40;R(0,-80,1,80+y0,'#5a5a66');if(c.cd<=0){R(-6,y0,12,14,'#14101a');for(let i=0;i<4;i++)R(-5+i*3,y0+1,1,12,'#6a6a78');R(-6,y0,12,2,'#5a5a66');R(-6,y0+12,12,2,'#5a5a66');for(let i=0;i<3;i++)R(-3+i*3,y0-4,2,2,i<c.hits?'#ffd040':'#3a3a40');}});return false;};return c;});},
 tick(e,dt,d,inEv){e.gap+=dt*(e.EV?1.3:1);
  if(ONI.orbitHit(e)&&P.dash<=0&&P.iv<=0)hitPlayer(14*e.dm,e.x,e.y,{peril:true,src:e});
  for(const c of e.cages)if(c.cd>0)c.cd-=dt;
  // furnace vents erupt one after another; he can be lured over one
  e.ventT-=dt;if(e.ventT<=0){e.ventT=e.half?4:5.5;const v=e.vents[e.vk++%4];mark({k:'c',x:v.x,y:v.y,r:20,t:1.1,dmg:16*e.dm,col:'#ff6020',src:e,on:m=>{for(let i=0;i<14;i++)particles.push({x:m.x+rnd(-8,8),y:m.y,vx:rnd(-10,10),vy:-rnd(60,120),t:.6,col:pick(['#ff6020','#ffd060'])});
    if(dist(e,m)<m.r+e.r&&!e.EV){ONI.stun(e,1.6,'BURNED!');hurtE(e,e.maxhp*.025,0,{nost:true});}}});}
  if(e.stunT>0){e.stunT-=dt;e.tele=0;if(Math.random()<dt*8)spark(e.x,e.y-20,'#ffd040',2,30);return true;}},
 move(e,dt,d,a){// lumbers after you, but never steps into the molten channels
  if(d<ONI.R-12)return;const s=e.spd*dt,nx=e.x+Math.cos(a)*s,ny=e.y+Math.sin(a)*s;if(!ONI.lava(nx+Math.cos(a)*e.r,ny+Math.sin(a)*e.r))steer(e,a,e.spd,dt);else{const a2=a+Math.PI/2*e.sdir;if(!ONI.lava(e.x+Math.cos(a2)*(e.r+4),e.y+Math.sin(a2)*(e.r+4)))steer(e,a2,e.spd,dt);else e.sdir*=-1;}},
 floor(e){ctx.save();worldXf();for(const v of e.vents){ctx.fillStyle='#2a1a14';ctx.fillRect(v.x-12,v.y-12,24,24);ctx.fillStyle='#5a2a14';for(let i=-10;i<=8;i+=6)ctx.fillRect(v.x+i,v.y-10,3,20);}ctx.restore();
  if(e.half||e.orbOff)return;// the orbit: a ring of sparks with one gap, the club itself at the far side
  for(let i=0;i<40;i++){const a=e.gap+i/40*TAU;if(Math.abs(angDiff(a,e.gap))<.55)continue;const x=e.x+Math.cos(a)*ONI.R,y=e.y+Math.sin(a)*ONI.R;ctx.fillStyle=i%3?'#ff9040':'#fff0c0';ctx.fillRect(sx(x,y)-1,sy(x,y)-6,2,2);}
  const ca=e.gap+Math.PI,cx2=e.x+Math.cos(ca)*ONI.R,cy2=e.y+Math.sin(ca)*ONI.R;disc(sx(cx2,cy2),sy(cx2,cy2)-7,5,'#3a3a40');circ(sx(cx2,cy2),sy(cx2,cy2)-7,5,'#9a9aa8');sline(sx(e.x,e.y),sy(e.x,e.y)-14,sx(cx2,cy2),sy(cx2,cy2)-7,'#6a6a78');},
 drawAfter(e){if(e.stunT>0)txt('STUNNED',sx(e.x,e.y)-15,sy(e.x,e.y)-62,'#ffd040');},
 hud:e=>e.half?'DASH SIDEWAYS OUT OF HIS GRAB':'STAY IN THE GAP OR INSIDE THE ORBIT. SHOOT A CAGE 3X ABOVE HIM',
 onHalf(e){fxRing(e.x,e.y,ONI.R,'#ff8030',.5);},
 atks:[
  // chain lash: arm pulled back, then a whip line snaps to full length at you (only reaches you outside the orbit)
  {n:'lash',wt:3,half:0,ok:(e,d)=>d>ONI.R+4,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=1;A.a=aimAt(e);mark({k:'l',x:e.x,y:e.y,a:A.a,len:rayLen(e.x,e.y,A.a,240),w:9,t:.55*k,lock:.15,dmg:16*e.dm,col:BC.aim,src:e,follow:m=>{m.x=e.x;m.y=e.y;m.a=aimAt(e);m.len=rayLen(e.x,e.y,m.a,240);},on:()=>sfx('slash')});}return A.t>.85*k;}},
  // shove: stay inside the orbit too long and he stamps, sparks bursting round his feet - out through the gap
  {n:'shove',wt:5,half:0,ok:(e,d)=>d<ONI.R-6,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=2;mark({k:'c',x:e.x,y:e.y,r:ONI.R-4,t:.75*k,dmg:15*e.dm,col:BC.aim,src:e,follow:m=>{m.x=e.x;m.y=e.y;}});}if(at(A,.75*k)){shake=Math.max(shake,6);sfx('break');}return A.t>1*k;}},
  // thrown shackles: three slow spinning shackles in a wide spread; they slow you if they touch
  {n:'shackles',wt:2,run(e,A){if(!A.go){A.go=1;tone(900,.2,'square',.03,200);}if(at(A,.45)){bfan(e,e.x,e.y,aimAt(e),3,1.5,52,9,{spr:'shackle',r:5,slowP:2,col:'#5a5a66',life:5});}return A.t>.7;}},
  // forge sparks: he slams the floor; sparks arc up and fall where their circles show. Watch where they fall
  {n:'sparks',wt:2,run(e,A){const k=1/e.spdK;if(!A.go){A.go=1;e.tele=2;}if(at(A,.4*k)){e.tele=0;shake=Math.max(shake,6);sfx('break');for(let i=0;i<14;i++){const a=Math.random()*TAU,r=rnd(30,140),x=e.x+Math.cos(a)*r,y=e.y+Math.sin(a)*r;if(blocked(x,y,2))continue;
     mark({k:'c',x,y,r:10,t:(.7+Math.random()*.8)*k,dmg:11*e.dm,col:'#ff8030',src:e});}for(let i=0;i<20;i++)particles.push({x:e.x,y:e.y,vx:rnd(-80,80),vy:-rnd(60,140),t:.6,col:'#ffd060'});}return A.t>1.6*k;}},
  // grab (half health): hands open wide, a lunge; if he catches you, a crushing throw. Dash out sideways
  {n:'grab',wt:4,half:1,ok:(e,d)=>d<110,run(e,A,dt){if(!A.go){A.go=1;e.tele=2;say(e,'!','#ff4040',.5);A.a=aimAt(e);mark({k:'cone',x:e.x,y:e.y,a:A.a,r:62,arc:1.2,t:.55,col:BC.aim,follow:m=>{m.x=e.x;m.y=e.y;},lock:.55});}
    if(A.t>.55&&A.t<.85){move(e,Math.cos(A.a)*190*dt,Math.sin(A.a)*190*dt,e.r);if(!A.hit&&dist(e,P)<e.r+14&&P.dash<=0&&P.iv<=0){A.hit=1;hitPlayer(26*e.dm,e.x,e.y,{peril:true,src:e});const ta=aimAt(e);move(P,Math.cos(ta)*60,Math.sin(ta)*60,4);impact(P.x,P.y,'#ff4040',8,true);}}
    return A.t>1.05;}},
  // body slam (half health): a leap onto you and shockwave rings
  {n:'slam',wt:3,half:1,run(e,A,dt){if(!A.go){A.go=1;A.sx=e.x;A.sy=e.y;A.m=mark({k:'c',x:P.x,y:P.y,r:28,t:.85,lock:.3,dmg:20*e.dm,col:BC.aim,src:e,follow:m=>{m.x=P.x;m.y=P.y;},on:m=>{shake=Math.max(shake,9);sfx('break');bring(e,m.x,m.y,22,66,9,{col:'#ff9040',r:4},0,aimAt(e)+1,.4);bring(e,m.x,m.y,22,48,9,{col:'#ff9040',r:4},.14,aimAt(e)-1,.4);}});e.air=true;}
    const kk=clamp(A.t/.85,0,1);e.x=lerp(A.sx,A.m.x,kk);e.y=lerp(A.sy,A.m.y,kk);e.z=Math.sin(kk*Math.PI)*36;if(A.m.fired){e.air=false;e.z=0;}return A.m.fired&&A.t>1.1;},end(e){e.air=false;e.z=0;}},
 ],
 // EVENT 70%: the jailers flood in from the cells while the orbit keeps turning
 event:{at:.7,dur:20,name:'THE JAILERS',hint:'SURVIVE THE GUARDS - MIND THE ORBIT',
  start(e,E){const A=arenaOf(e);E.mins=[];for(let i=0;i<8;i++){const a=i/8*TAU;E.mins.push(bMin(e,'jailer',A.cx+Math.cos(a)*A.R*.8,A.cy+Math.sin(a)*A.R*.8));}e.ev.mins=E.mins;},
  tick(e,dt,E){const a=aimAt(e);if(dist(e,P)>ONI.R)steer(e,a,e.spd*.7,dt);if(E.mins.every(m=>m.dead)&&E.t>2)E.done=1;}},
};
ONI.stun=function(e,t,s){cancelAtk(e);e.stunT=t;txtFx(e.x,e.y-24,s,'#ffd040',2);sfx('break');};
ONI.drop=function(e,c){mark({k:'c',x:c.x,y:c.y,r:22,t:.5,col:'#9a9aa8',dmg:12*e.dm,src:e,on:m=>{impact(m.x,m.y,'#9a9aa8',7);if(dist(e,m)<m.r+e.r&&!e.EV){ONI.stun(e,3,'CAGED!');hurtE(e,e.maxhp*.03,0,{nost:true});}}});};

// ================================================================ IX. KAGE, THE SHINOBI MASTER - vision control
// Night on the castle roofs. Kage is invisible outside torchlight (and for a blink when he strikes), and he snuffs the
// torches he passes. Shoot a dark torch to relight it. Wires strung between the roofs only glint in the light.
// The wind turns every 15s and carries his shuriken and smoke with it.
BART['KAGE, THE SHINOBI MASTER']=Object.assign(p=>{const {R,E,L,b,atk,f}=p,hurt=ARTHURT;
 const h=bWarrior(p,{ar:'#1a1a26',ad:'#0a0a12',ac:'#2a2a3a',lg:'#14141e',hand:'#2a2a3a',arm:'#1a1a26',chest:'#24243a'});
 // a long red scarf streaming behind
 for(let i=0;i<12;i++)R(h.cx-6-i*1.4,h.ty+1+Math.sin(i*.8+f*1.5)*2+i*.4,2,2,i%4===3?'#801010':'#c02020');
 const hx=h.cx,hy=h.ty-12;E(hx,hy+4,7,7,'#14141e');
 if(hurt){R(hx-2,hy+3,7,4,'#d0a080');R(hx+1,hy+4,1,1,'#14101a');R(hx+4,hy+4,1,1,'#14101a');L(hx-1,hy+2,hx+5,hy+7,'#c02030');}else{R(hx-1,hy+3,7,2,'#2a2a3a');R(hx+1,hy+3,1,1,'#ff3030');R(hx+4,hy+3,1,1,'#ff3030');}
 R(hx-6,hy-2,4,3,'#14141e');R(hx-9,hy-1,3,2,'#c02020');
 // tanto in the front hand, a second blade on the back at half health
 if(atk){L(h.hx-2,h.hy+2,h.hx+12,h.hy-6,'#e8eef6',1);R(h.hx-3,h.hy+2,3,2,'#3a2a1a');}else{L(h.hx,h.hy,h.hx+2,h.hy+10,'#e8eef6',1);}
 if(hurt)L(h.cx-14,h.ty+18,h.cx-20,h.ty+28,'#e8eef6',1);},{sc:1.05});
const KAG={
 litNear(e,x,y,r){for(const t of e.torches)if(t.lit&&Math.hypot(t.x-x,t.y-y)<(r||64))return true;return false;},
 segDist(m,x,y){const c=Math.cos(m.a),s=Math.sin(m.a),dx=x-m.x,dy=y-m.y,u=clamp(dx*c+dy*s,0,m.len);return Math.hypot(dx-c*u,dy-s*u);},
 reveal(e,t){e.revealT=Math.max(e.revealT||0,t||.35);}};
defProp('ktorch','WALL TORCH',999,5,miniSpr(4,4,R=>{R(0,0,4,4,'#3a2a1a');}));
BKIT['KAGE, THE SHINOBI MASTER']={director:bossDirector,pref:105,gap:.75,halfName:'MASK CUT - NO MORE HIDING',noContact:true,
 style:{c:'#c02020',t:['TORCHLIGHT','LIGHTS OUT','BLADE BLUR'],ph:[[],[],[]]},
 guide:['SKILL: VISION CONTROL','HE IS INVISIBLE OUTSIDE TORCHLIGHT AND SNUFFS TORCHES','SHOOT A DARK TORCH TO RELIGHT IT. WIRES GLINT ONLY IN LIGHT','THE BELL ON THE WATCHTOWER LIGHTS EVERY TORCH, ONCE A PHASE'],
 init(e){const A=arenaOf(e);e.torches=[];for(let i=0;i<8;i++){const a=i/8*TAU+.2,k=A.R*(i%2?.5:.78);const t=bProp(e,'ktorch',A.cx+Math.cos(a)*k,A.cy+Math.sin(a)*k,{lit:1,onHurt:t=>{if(!t.lit){t.lit=1;sfx('heal');txtFx(t.x,t.y-20,'LIT','#ffd060');}return false;}});
   t.drawFn=t=>{pxAt(t,R=>{R(-1,-18,2,18,'#3a2a1a');R(-3,-20,6,3,'#5a3a22');if(t.lit){const f=Math.floor(time*12+t.x)%2;R(-2,-25-f,4,5,'#ff8020');R(-1,-24-f,2,3,'#ffe060');}});return false;};e.torches.push(t);}
  e.wbell=bProp(e,'bbell',A.cx,A.y0+30,{onHurt:b=>{if(e.bellUsed===e.phase)return false;e.bellUsed=e.phase;for(const t of e.torches)t.lit=1;e.allLit=5;tone(660,.8,'triangle',.07,-100);setToast('THE WATCHTOWER BELL - EVERY TORCH BLAZES','#ffd060',2);return false;}});
  e.windT=0;BX.wind={x:0,y:0};e.alpha=0;e.revealT=0;e.bellUsed=0;},
 tick(e,dt,d,inEv){e.windT-=dt;if(e.windT<=0){e.windT=15;const a=Math.floor(Math.random()*4)*Math.PI/2+Math.PI/4;BX.wind={x:Math.cos(a)*22,y:Math.sin(a)*22,a};}
  if(BX.smoke){const S=BX.smoke;S.t-=dt;S.x+=BX.wind.x*dt*1.5;S.y+=BX.wind.y*dt*1.5;if(S.t<=0)BX.smoke=null;}
  if(e.allLit>0){e.allLit-=dt;for(const t of e.torches)t.lit=1;}
  // he snuffs any torch he passes
  if(!e.half&&!(e.allLit>0))for(const t of e.torches)if(t.lit&&Math.hypot(t.x-e.x,t.y-e.y)<20){t.lit=0;spark(t.x,t.y-22,'#9a9a9a',6,30);}
  if(e.revealT>0)e.revealT-=dt;
  const vis=e.half||e.revealT>0||KAG.litNear(e,e.x,e.y);e.alpha=clamp((e.alpha||0)+(vis?dt*8:-dt*6),0,1);
  // wires hurt only you; they glint near light or when you are close
  BX.dark=inEv?.9:e.half?.42:.62;},
 move(e,dt,d,a){// flits around you in the dark, cutting through the torch circles
  e.ang=(e.ang||0)+dt*.7*e.sdir;const tx=P.x+Math.cos(e.ang)*105,ty=P.y+Math.sin(e.ang)*105,da=Math.atan2(ty-e.y,tx-e.x),dd=Math.hypot(tx-e.x,ty-e.y);if(dd>5)steer(e,da,Math.min(dd/dt,e.spd*1.6),dt);if(Math.random()<dt*.25)e.sdir*=-1;},
 overlay(e){bossDark(e);},
 hudExtra(e){if(BX.wind&&BX.wind.a!=null){const v=scrVec(Math.cos(BX.wind.a),Math.sin(BX.wind.a)),x=W-60,y=H-58;txt('WIND',x-24,y-2,'#aab');ctx.fillStyle='#e8eef6';for(let i=0;i<8;i++)ctx.fillRect(Math.round(x+v[0]*i),Math.round(y+v[1]*i),2,1);ctx.fillStyle='#c02020';ctx.fillRect(Math.round(x+v[0]*8)-1,Math.round(y+v[1]*8)-1,3,3);}},
 hud:e=>e.half?null:e.torches.filter(t=>t.lit).length+' OF 8 TORCHES LIT - SHOOT A DARK ONE TO RELIGHT IT'+(e.bellUsed!==e.phase?'. RING THE TOWER BELL':''),
 onHalf(e){e.alpha=1;},
 atks:[
  // shuriken fan: a metal whistle, five stars that curve as they fly and drift with the wind
  {n:'shuriken',wt:3,run(e,A){if(!A.go){A.go=1;tone(1800,.25,'sine',.04,-400);}if(at(A,.4)){KAG.reveal(e);const a=aimAt(e);for(let i=0;i<5;i++)bsh(e,e.x,e.y,a+(i-2)*.22,125,9,{spr:'shuriken',st:'curve',curve:(i-2)*.12,wind:1,col:BC.aim,r:3,life:3.5});}
    if(e.half&&at(A,.7)){const a=aimAt(e);for(let i=0;i<5;i++)bsh(e,e.x,e.y,a+(i-2)*.22,125,9,{spr:'shuriken',st:'curve',curve:-(i-2)*.12,wind:1,col:BC.aim,r:3,life:3.5});}return A.t>.9;}},
  // kunai mark: a red kunai lands near you and ticks for 3s, then bursts into eight blades. Leave it
  {n:'kunai',wt:3,run(e,A){if(!A.go){A.go=1;KAG.reveal(e);const n=e.half?3:2;for(let i=0;i<n;i++){const a=Math.random()*TAU,r=rnd(15,45),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(blocked(x,y,2))continue;
     mark({k:'c',x,y,r:10,t:3,col:'#ff3030',quiet:1,tick:0,on:m=>{for(let j=0;j<8;j++)bsh(e,m.x,m.y,j/8*TAU,95,9,{spr:'kunai',col:'#3a3a48',r:2,life:2.5});sfx('break');}});}sfx('tool');}return A.t>.6;}},
  // wire traps: near-invisible lines strung across the roofs for 12s; light shows them
  {n:'wires',wt:2,ok:e=>BMK.filter(m=>m.wire).length<3,run(e,A){if(!A.go){A.go=1;KAG.reveal(e,.25);const Ar=arenaOf(e);for(let i=0;i<2;i++){const a=Math.random()*Math.PI,cx=P.x+rnd(-60,60),cy=P.y+rnd(-60,60),L=260;
     mark({k:'l',x:cx-Math.cos(a)*L/2,y:cy-Math.sin(a)*L/2,a,len:L,w:4,t:.05,stay:12,sdmg:12*e.dm,col:'#e8eef6',wire:1,thin:1,hidden:1,quiet:1,src:e,reveal:m=>KAG.segDist(m,P.x,P.y)<48||e.torches.some(t=>t.lit&&KAG.segDist(m,t.x,t.y)<70)||e.half});}}return A.t>.4;}},
  // smoke bomb: a pop, and your view shrinks to a small circle for 4s (the wind carries the cloud off)
  {n:'smoke',wt:2,ok:()=>!BX.smoke,run(e,A){if(!A.go){A.go=1;sfx('break');BX.smoke={x:P.x,y:P.y,r:70,t:4};for(let i=0;i<20;i++)particles.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),vx:rnd(-20,20),vy:-10,t:.8,col:'#8a8a9a'});}return A.t>.5;}},
  // shadow step: your shadow flickers, then he is behind you with a slash. Dash forward at once
  {n:'step',wt:1,ok:e=>(R.time-(e.lastTp||-99))>7,run(e,A){const k=1/e.spdK;e.lastTp=R.time;if(!A.go){A.go=1;A.m=mark({k:'c',x:P.x,y:P.y,r:9,t:.45*k,col:'#14101a',follow:m=>{m.x=P.x;m.y=P.y;},lock:0,quiet:1});}
    if(A.m.fired&&!A.tp){A.tp=1;const ba=P.aim+Math.PI,p=freeSpot(e,P.x+Math.cos(ba)*22,P.y+Math.sin(ba)*22,e.r);e.x=p.x;e.y=p.y;KAG.reveal(e,.6);sfx('dash');mark({k:'cone',x:e.x,y:e.y,a:aimAt(e),r:40,arc:1.7,t:.3*k,dmg:17*e.dm,col:BC.aim,src:e,on:()=>sfx('slash')});}
    return A.t>.95*k;}},
  // afterimage dashes (half health): three dashes; every copy left behind throws one delayed shuriken
  {n:'afterimage',wt:2,half:1,ok:e=>(R.time-(e.lastTp||-99))>7,run(e,A,dt){if(!A.go){A.go=1;A.n=0;A.nt=0;e.lastTp=R.time;}A.nt-=dt;if(A.nt<=0&&A.n<2){A.nt=.6;A.n++;const ox=e.x,oy=e.y,a=aimAt(e)+rnd(-1.2,1.2),p=freeSpot(e,P.x+Math.cos(a+Math.PI)*90,P.y+Math.sin(a+Math.PI)*90,e.r);
     mark({k:'c',x:ox,y:oy,r:6,t:.6,col:'#c02020',quiet:1,on:m=>bsh(e,m.x,m.y,aimAt(m),160,9,{spr:'shuriken',st:'curve',curve:0,wind:1,col:BC.aim,r:3})});for(let i=0;i<6;i++)particles.push({x:lerp(ox,p.x,i/6),y:lerp(oy,p.y,i/6),vx:0,vy:0,t:.4,col:'#3a3a48'});e.x=p.x;e.y=p.y;sfx('dash');}
    return A.n>=2&&A.t>1.4;}},
 ],
 // EVENT 70%: lights out. Every torch dies for 20s: only sound shows his attacks
 event:{at:.7,dur:20,name:'LIGHTS OUT',hint:'LISTEN: WHISTLES BEFORE STARS, TICKS BEFORE KUNAI',
  start(e,E){for(const t of e.torches)t.lit=0;E.st=1.2;E.kt=3;},
  tick(e,dt,E){for(const t of e.torches)t.lit=0;e.alpha=0;e.ang=(e.ang||0)+dt*.8;e.x=P.x+Math.cos(e.ang)*125;e.y=P.y+Math.sin(e.ang)*125;
   E.st-=dt;if(E.st<=0){E.st=1.35;tone(1800,.25,'sine',.05,-400);E.q=.4;}if(E.q>0){E.q-=dt;if(E.q<=0){const a=aimAt(e);for(let i=0;i<5;i++)bsh(e,e.x,e.y,a+(i-2)*.2,115,9,{spr:'shuriken',st:'curve',curve:(i-2)*.1,wind:1,col:BC.aim,r:3,life:3.5});}}
   E.kt-=dt;if(E.kt<=0){E.kt=3.2;const x=P.x+rnd(-30,30),y=P.y+rnd(-30,30);mark({k:'c',x,y,r:10,t:3,col:'#ff3030',quiet:1,on:m=>{for(let j=0;j<8;j++)bsh(e,m.x,m.y,j/8*TAU,90,9,{spr:'kunai',col:'#3a3a48',r:2,life:2.5});sfx('break');}});}
   // the kunai tick: one click a second per live mark
   if(Math.floor(E.t)!==Math.floor(E.t-dt))for(const m of BMK)if(m.col==='#ff3030'&&!m.fired)tone(1200,.04,'square',.04);},
  end(e){for(const t of e.torches)t.lit=1;}},
 onDeath(){BX.dark=0;},
};
// the night: a dark veil with holes of light at lit torches and around you; smoke closes your circle down
let darkCv=null;
function bossDark(e){const a=BX.dark||0;if(a<=0)return;if(!darkCv||darkCv.width!==W||darkCv.height!==H){darkCv=document.createElement('canvas');darkCv.width=W;darkCv.height=H;}
 const g=darkCv.getContext('2d');g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle='rgba(6,6,20,'+a+')';g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
 const hole=(x,y,r,k)=>{const X=sx(x,y),Y=sy(x,y)-6,gr=g.createRadialGradient(X,Y,r*.3,X,Y,r);gr.addColorStop(0,'rgba(0,0,0,'+(k||1)+')');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(X-r,Y-r,r*2,r*2);};
 const inSmoke=BX.smoke&&Math.hypot(P.x-BX.smoke.x,P.y-BX.smoke.y)<BX.smoke.r;
 hole(P.x,P.y,(inSmoke?28:e.EV?46:72)*(R.inv.hood?1.6:1));for(const t of (e.torches||[]))if(t.lit)hole(t.x,t.y,78,.95);for(const l of BX.lights)hole(l.x,l.y,l.r||70,.9);
 ctx.drawImage(darkCv,0,0);
 if(BX.smoke){const S=BX.smoke;ctx.globalAlpha=.55*Math.min(1,S.t);wdisc(S.x,S.y,S.r,'#5a5a6a');ctx.globalAlpha=1;}}

// ================================================================ X. TAMAMO, THE ILLUSIONIST - real vs fake
// A court illusionist in a fox mask and a costume of nine paper tails. She fights through illusions. Her clones fire the same patterns, but their shots are hollow and harmless; only the real
// fox casts a moon-shadow. She loses a tail at every step of damage (9 down to 3), and each tail lost changes her attacks.
// Walk through a torii gate to see through every illusion for 3s.
ET.foxclone={n:'ILLUSION',hp:1,spd:0,pos:9999,r:9,ai:'dummy',rng:0,wl:0,atks:[]};
const KIT={
 tails:e=>clamp(3+Math.ceil(6*e.hp/e.maxhp),3,9),
 clones:e=>(e.clones||[]).filter(c=>!c.dead),
 // fire a pattern from the real fox (solid) and from each clone (hollow)
 both(e,fn){fn(e,true);for(const c of KIT.clones(e))fn(c,false);},
 shot(e,src,real,a,sp,dmg,o){if(real)return bsh(e,src.x,src.y,a,sp,dmg,o);return fakeShot(e,src.x,src.y,a,sp,{st:o&&o.st==='seek'?'seek':o&&o.st==='curve'?'curve':null,curve:o&&o.curve,turn:o&&o.turn,seekT:o&&o.seekT,col:'#c8a0ff',r:3,life:o&&o.life||4});},
};
BKIT['TAMAMO, THE ILLUSIONIST']={director:bossDirector,pref:110,gap:.75,halfName:'THE TAILS BURN LOW',
 style:{c:'#c080ff',t:['FOX-FIRE','MAZE OF ILLUSIONS','RAW FOX-FIRE'],ph:[[],[],[]]},
 guide:['SKILL: REAL VS FAKE. ONLY THE REAL TAMAMO CASTS A SHADOW','HOLLOW SHOTS ARE ILLUSIONS AND DO NO HARM','WALK THROUGH A TORII GATE TO SEE THROUGH ILLUSIONS FOR 3S','HER PAPER TAILS TEAR AS SHE IS HURT: AT 3 NO MORE CLONES'],
 init(e){const A=arenaOf(e);e.torii=[];for(let i=0;i<5;i++){const a=i/5*TAU+Math.PI/2,k=A.R*.62;e.torii.push({x:A.cx+Math.cos(a)*k,y:A.cy+Math.sin(a)*k,a:a+Math.PI/2,cd:0});}
  e.clones=[];e.cloudT=30;e.cloud=0;BX.reveal=0;},
 tick(e,dt,d,inEv){if(BX.reveal>0)BX.reveal-=dt;for(const g of e.torii){if(g.cd>0)g.cd-=dt;else if(Math.hypot(P.x-g.x,P.y-g.y)<13){g.cd=8;BX.reveal=3;sfx('heal');fxRing(P.x,P.y,40,'#ff4060',.4);setToast('THE TORII REVEALS THE ILLUSIONS','#ff4060',1.5);}}
  e.cloudT-=dt;if(e.cloudT<=0){e.cloudT=30;e.cloud=5;setToast('CLOUDS CROSS THE MOON - NO SHADOWS','#8a8ab0',2);}if(e.cloud>0)e.cloud-=dt;
  // the charm beam reverses your controls if it touches you
  for(const m of BMK)if(m.charm&&m.fired&&inShape(m,P.x,P.y)&&P.dash<=0&&!(P.revT>0)){P.revT=2;txtFx(P.x,P.y-12,'CHARMED!','#ff80c0');}
  if(KIT.tails(e)<=3&&KIT.clones(e).length){for(const c of KIT.clones(e)){c.dead=true;spark(c.x,c.y,'#c080ff',12,60);}}
  for(const c of KIT.clones(e)){c.x+=Math.cos(time*1.3+c.wob)*12*dt;c.y+=Math.sin(time*1.1+c.wob)*12*dt;}},
 floor(e){// moon-shadows: only real things cast one (not when clouds cover the moon)
  if(e.cloud<=0){ctx.save();worldXf();ctx.globalAlpha=.4;ctx.fillStyle='#0a0a20';ctx.beginPath();ctx.ellipse(e.x+10,e.y+14,e.r+3,e.r*1.7,.6,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=1;}
  else{ctx.globalAlpha=.25;ctx.fillStyle='#0a0a20';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  for(const g of e.torii){const X=sx(g.x,g.y),Y=sy(g.x,g.y),c=g.cd>0?'#7a3040':'#d02838';ctx.fillStyle='#14101a';ctx.fillRect(X-12,Y-30,25,4);ctx.fillStyle=c;ctx.fillRect(X-11,Y-29,23,2);ctx.fillRect(X-9,Y-24,19,2);ctx.fillRect(X-8,Y-26,2,26);ctx.fillRect(X+7,Y-26,2,26);ctx.fillStyle='#14101a';ctx.fillRect(X-8,Y,2,1);ctx.fillRect(X+7,Y,2,1);}},
 hudExtra(e){const n=KIT.tails(e),{x,y}=bossBarBox(),left=x-66;txt('TAILS',left,y,'#c080ff');for(let i=0;i<9;i++){ctx.fillStyle=i<n?'#ff9040':'#3a2a40';ctx.fillRect(left+26+i*4,y,3,5);}},
 hud:e=>revealed()?'ILLUSIONS REVEALED':KIT.clones(e).length?'ONLY THE REAL FOX CASTS A SHADOW - TORII GATES REVEAL':null,hudC:'#c080ff',
 atks:[
  // make clones: 2-4 copies, and she swaps places with one of them
  {n:'clones',wt:3,ok:e=>KIT.tails(e)>3&&KIT.clones(e).length<2,run(e,A){if(!A.go){A.go=1;const n=KIT.tails(e)>=7?2:KIT.tails(e)>=5?3:4;sfx('heal');for(let i=0;i<n;i++){const a=i/n*TAU+Math.random(),p=freeSpot(e,P.x+Math.cos(a)*110,P.y+Math.sin(a)*110,e.r);
     const c=bMin(e,'foxclone',p.x,p.y);c.hp=c.maxhp=1;c.wob=Math.random()*6;c.drawFn=c=>{drawGhostly(c,revealed()?.35:1,0,0,sprOf(e));if(revealed())wcirc(c.x,c.y,c.r+4,'#c080ff');return false;};c.onHurt=c=>{c.dead=true;spark(c.x,c.y,'#c080ff',14,70);txtFx(c.x,c.y-14,'ILLUSION','#c080ff');return false;};e.clones.push(c);}
     // the swap
     const c=pick(KIT.clones(e)),ox=e.x,oy=e.y;e.x=c.x;e.y=c.y;c.x=ox;c.y=oy;for(const q of [e,c])spark(q.x,q.y,'#ff9040',10,60);}return A.t>.7;}},
  // fox-flame orbs: wisps gather round her, brighten in turn, then launch one by one, slightly homing
  {n:'orbs',wt:3,run(e,A,dt){if(!A.go){A.go=1;const n=Math.min(8,KIT.tails(e));KIT.both(e,(src,real)=>{for(let i=0;i<n;i++){const a=i/n*TAU,x=src.x+Math.cos(a)*18,y=src.y+Math.sin(a)*18,ha=Math.atan2(P.y-y,P.x-x);
      if(real)bsh(e,x,y,ha,0,9,{spr:'wisp',st:'hang',wait:.7+i*.2,ha,csp:85,then:'seek',turn:.8,seekT:1.2,col:'#8080ff',r:3,life:5});else{const q=fakeShot(e,x,y,ha,0,{life:5});q.hold=.7+i*.2;q.ha=ha;}}});}
    for(const q of fakes)if(q.hold>0){q.hold-=dt;if(q.hold<=0){q.vx=Math.cos(q.ha)*85;q.vy=Math.sin(q.ha)*85;}}return A.t>2.4;}},
  // tail sweep: one curved flame wave per remaining tail, fanned out. Find the gap between the arcs
  {n:'tails',wt:3,run(e,A){if(!A.go){A.go=1;e.tele=1;}if(at(A,.55)){e.tele=0;const n=KIT.tails(e);KIT.both(e,(src,real)=>{const base=Math.atan2(P.y-src.y,P.x-src.x);for(let t=0;t<n;t++){const ca=base+(t-(n-1)/2)*.36;for(let j=0;j<4;j++)KIT.shot(e,src,real,ca+(j-1.5)*.05,60+j*6+(9-n)*4,9,{st:'curve',curve:(t%2?1:-1)*.3,col:'#c080ff',r:3,life:4});}});sfx('shoot');}return A.t>.9;}},
  // illusion maze: walls rise around you for 8s; some are false. A torii shows which
  {n:'maze',wt:2,ok:e=>KIT.tails(e)>=5&&!BMK.some(m=>m.maze),run(e,A){if(!A.go){A.go=1;sfx('break');const o=Math.random()*TAU,n=10,gap=ri(0,n-1);for(let i=0;i<n;i++){if(i===gap)continue;const a0=o+i/n*TAU,a1=o+(i+1)/n*TAU,R0=78,x0=P.x+Math.cos(a0)*R0,y0=P.y+Math.sin(a0)*R0,x1=P.x+Math.cos(a1)*R0,y1=P.y+Math.sin(a1)*R0;
     mark({k:'l',x:x0,y:y0,a:Math.atan2(y1-y0,x1-x0),len:Math.hypot(x1-x0,y1-y0),w:7,t:.8,stay:8,sdmg:i%3===1?0:12*e.dm,fake:i%3===1,maze:1,col:'#ff80c0',src:e});}}return A.t>.9;}},
  // charm gaze: her eyes glow, then a slow pink beam sweeps; if it touches you your controls reverse for 2s
  {n:'gaze',wt:2,run(e,A){if(!A.go){A.go=1;e.tele=2;A.a0=aimAt(e)-.9;A.m=mark({k:'l',x:e.x,y:e.y,a:A.a0,len:260,w:9,t:.7,stay:1.6,sdmg:8*e.dm,charm:1,col:'#ff80c0',src:e,follow:m=>{m.x=e.x;m.y=e.y;if(m.fired)m.a=A.a0+1.8*clamp(1-m.stay/1.6,0,1);}});A.m.lock=-99;}
    return A.t>2.4;}},
  // raw fox-fire (3 tails): no more tricks, big dense real patterns
  {n:'raw',wt:5,ok:e=>KIT.tails(e)<=4,run(e,A,dt){if(!A.go){A.go=1;e.tele=1;A.a=Math.random()*TAU;A.ft=0;}if(A.t<.4)return false;A.a+=dt*1.2;A.ft-=dt;if(A.ft<=0){A.ft=.16;for(let i=0;i<6;i++)bsh(e,e.x,e.y,A.a+i/6*TAU,55,10,{spr:'wisp',col:'#8080ff',r:4,st:'big',life:6});}
    if(at(A,1.2)||at(A,2.2))bfan(e,e.x,e.y,aimAt(e),7,1.2,90,10,{col:'#ff9040',r:4,st:'big'});return A.t>2.8;}},
 ],
 // EVENT 30%: maze of illusions. Six foxes circle you; only the one with a moon-shadow is real
 event:{at:.3,dur:22,name:'MAZE OF ILLUSIONS',hint:'ONLY THE FOX WITH A SHADOW FIRES REAL FLAMES',
  start(e,E){for(const c of KIT.clones(e))c.dead=true;e.clones=[];for(let i=0;i<5;i++){const c=bMin(e,'foxclone',e.x,e.y);c.hp=c.maxhp=1;c.wob=i;c.iv=999;c.drawFn=c=>{drawGhostly(c,revealed()?.35:1,0,0,sprOf(e));return false;};e.clones.push(c);}E.ang=0;E.st=1.2;E.mt=1;},
  tick(e,dt,E){E.ang+=dt*.45;const all=[e].concat(KIT.clones(e));all.forEach((q,i)=>{const a=E.ang+i/all.length*TAU;q.x+=(P.x+Math.cos(a)*120-q.x)*Math.min(1,dt*3);q.y+=(P.y+Math.sin(a)*120-q.y)*Math.min(1,dt*3);q.iv=999;});
   E.st-=dt;if(E.st<=0){E.st=1.1;KIT.both(e,(src,real)=>{const a=Math.atan2(P.y-src.y,P.x-src.x);for(let i=-1;i<=1;i++)KIT.shot(e,src,real,a+i*.25,62,9,{st:'seek',turn:.6,seekT:1.4,col:'#8080ff',r:3,life:5});});}
   E.mt-=dt;if(E.mt<=0){E.mt=7;BKIT['TAMAMO, THE ILLUSIONIST'].atks.find(x=>x.n==='maze').run(e,{t:0});}},
  end(e){for(const c of KIT.clones(e))c.dead=true;e.clones=[];}},
 onDeath(){BX.reveal=0;},
};

// ================================================================ XI. LORD KUROGANE, THE BLACK HORSE GENERAL - big-space positioning
// Mounted, he never stands still: long gallops round the court and lance passes straight through it. Two standard-bearers
// ride with him and while either lives he takes half damage. At half health he dismounts and Yamikaze charges alone.
BART['LORD KUROGANE']=Object.assign(p=>{const {R,E,L,f,atk}=p,b=f===1?1:0,H0='#1a1a22',H1='#2e2e3a',G='#c0a040';
 // the black warhorse in lacquered barding
 const lg=atk?[[20,8],[28,4],[52,-6],[60,-8]]:[[20,0],[28,f?2:0],[52,f?0:2],[60,0]];for(const [x,dy] of lg){R(x,40+Math.min(0,dy),4,16+Math.max(0,dy)-Math.max(0,-dy)*0,H0);R(x-1,54,6,2,'#3a3a40');}
 E(40,40+b,24,10,H1);E(40,38+b,22,8,H0);R(20,34+b,40,6,'#801818');R(20,34+b,40,1,G);R(20,40+b,40,1,G);
 for(let i=0;i<10;i++)R(14-i*.6,34+i*1.3+b,3,2,H0); // tail
 // neck and head, a gold-horned chamfron
 L(58,36+b,68,22+(atk?-6:0),H0,6);E(70,22+(atk?-6:0)+b,7,5,H0);R(72,18+(atk?-6:0)+b,6,3,'#801818');R(74,15+(atk?-6:0),2,4,G);R(73,21+(atk?-6:0)+b,2,1,'#ff3030');for(let i=0;i<5;i++)R(60+i*2,22+i*2+(atk?-4:0)+b,2,3,'#3a3a48');
 // the rider: black armour, gold crescent crest, a long yari
 const ry=12+b;R(34,ry+8,12,14,'#1e1e28');R(32,ry+6,16,4,'#3a3a48');R(33,ry+10,14,1,G);E(40,ry+2,5,5,'#c8a080');R(35,ry-1,11,4,'#1e1e28');L(34,ry-6,40,ry-2,G,1);L(46,ry-6,40,ry-2,G,1);R(41,ry+1,2,1,'#14101a');
 R(30,ry+12,4,10,'#1e1e28');for(let i=0;i<4;i++)R(28-i,ry+14+i*3,3,2,'#801818');
 if(atk){L(30,ry+18,78,ry+6,'#5a3a22',2);L(76,ry+6,86,ry+3,'#e8eef6',2);}else{L(48,ry+20,56,ry-14,'#5a3a22',2);L(56,ry-14,58,ry-22,'#e8eef6',2);}
 // a sashimono banner on his back
 R(30,ry-18,1,22,'#3a2a1a');R(24,ry-18,7,10,'#14101a');R(25,ry-16,5,6,G);},{sc:1.05,fw:92,fh:60,raw:1});
BART['KUROGANE ON FOOT']=Object.assign(p=>{const {R,E,L,b,atk}=p;const h=bWarrior(p,{ar:'#1e1e28',ad:'#0a0a12',ac:'#c0a040',lg:'#14141e',hand:'#c8a080',arm:'#2a2a38',chest:'#801818'});
 const hx=h.cx,hy=h.ty-12;bFace(p,hx,hy,'#c8a080');R(hx-5,hy+6,11,4,'#1e1e28');R(hx-7,hy-2,15,5,'#1e1e28');L(hx-8,hy-4,hx,hy,'#c0a040',2);L(hx+8,hy-4,hx,hy,'#c0a040',2);
 // a long tachi; the war fan hangs at his belt
 if(atk){L(h.hx-10,h.hy+6,h.hx+18,h.hy-10,'#e8eef6',2);}else{L(h.hx+1,h.hy,h.hx+3,h.hy-26,'#e8eef6',2);}R(h.cx-15,h.ty+18,6,4,'#c0a040');R(h.cx-14,h.ty+19,4,1,'#801818');},{sc:1.12});
const KUR={bearers:e=>(e.bearers||[]).filter(m=>!m.dead)};
BKIT['LORD KUROGANE']={director:bossDirector,pref:0,gap:.8,halfName:'DISMOUNTED - DEFEAT KUROGANE AND YAMIKAZE',keepSpr:1,
 introFocus:[.57,.525], // centre of the rider, spear and horse in the mounted idle frames
 style:{c:'#c0a040',t:['CAVALRY','CAVALRY WING','ON FOOT'],ph:[[],[],[]]},
 guide:['SKILL: BIG-SPACE POSITIONING. MOUNTED, HE NEVER STOPS','TWO STANDARD-BEARERS RIDE WITH HIM: HALF DAMAGE WHILE EITHER LIVES','STAY AHEAD OF HIS PATH: HIS ARROWS FALL BEHIND IT','ON FOOT: DODGE YAMIKAZE\'S CHARGE, THEN STRIKE AS HE RECOVERS','DEFEAT BOTH. STOP SHOOTING AT KUROGANE WHILE HIS WAR FAN IS OPEN'],
 init(e){e.mounted=1;e.loopA=0;e.bearers=[0,1].map(i=>{const m=bMin(e,'samurai',e.x,e.y);m.t=Object.assign({},ET.samurai,{ai:'dummy'});m.sprOv=Object.assign({},foeSprite('samurai',basePal('#1e1e28','#0a0a12','#c0a040','#801818')),{sc:1.1});m.label='BEARER';m.labelC='#c0a040';m.hp=m.maxhp=m.maxhp*2.2;m.slot=i;return m;});
  e.onHurt=b=>{if(b.fan>0){KUR.reflect(b);return false;}return KUR.bearers(b).length&&b.mounted?.5:1;};},
 tick(e,dt,d,inEv){if(e.riderDown)return true;if(e.fan>0)e.fan-=dt;
  // the bearers ride in his wake, firing arrows to the side
  if(e.mounted)KUR.bearers(e).forEach((m,i)=>{const lag=.3+i*.28,tx=e.trail?e.trail[Math.min(e.trail.length-1,Math.floor(lag*40))]:null;if(tx){m.x+=(tx.x-m.x)*Math.min(1,dt*8);m.y+=(tx.y-m.y)*Math.min(1,dt*8);}
   m.at=(m.at||rnd(1,2))-dt;if(m.at<=0){m.at=rnd(1.6,2.4);bfan(m,m.x,m.y,aimAt(m),3,.4,95,8,{spr:'arrow',col:BC.aim,r:2});}});
  e.trail=e.trail||[];e.trail.unshift({x:e.x,y:e.y});if(e.trail.length>60)e.trail.length=60;},
 move(e,dt,d,a){if(!e.mounted){defaultMove(e,dt,d,a,{pref:60});return;}
  // gallop a wide loop round the court; arrows loosed back over his shoulder drift behind his route
  const A=arenaOf(e),R0=A.R*.62;e.loopA+=dt*1.25*e.sdir;const tx=A.cx+Math.cos(e.loopA)*R0,ty=A.cy+Math.sin(e.loopA)*R0*.8,da=Math.atan2(ty-e.y,tx-e.x),dd=Math.hypot(tx-e.x,ty-e.y);
  const gs=e.spd*4.4*(e.slow||1)*dt;move(e,Math.cos(da)*Math.min(dd,gs),Math.sin(da)*Math.min(dd,gs),e.r);dustTrail(e,'#7a6a50'); // paddy water bogs the horse down
  e.hat=(e.hat||0)-dt;if(e.hat<=0){e.hat=.28;bsh(e,e.x,e.y,da+Math.PI+rnd(-.35,.35),36,8,{spr:'arrow',col:BC.fix,r:2,life:3.2});}
  // yari sweep as he passes close
  if(d<70&&!(e.ysw>0)){e.ysw=2.5;mark({k:'cone',x:e.x,y:e.y,a:a,r:60,arc:Math.PI,t:.35,col:BC.aim});bfan(e,e.x,e.y,a,9,Math.PI,85,9,{spr:'spear',col:'#c8ccd8',r:2});}if(e.ysw>0)e.ysw-=dt;},
 drawAfter(e){if(e.fan>0){const X=sx(e.x,e.y),Y=sy(e.x,e.y)-40;ctx.fillStyle='#c0a040';for(let i=-3;i<=3;i++)ctx.fillRect(X+i*2,Y-Math.abs(i),2,5);txt('FAN',X-6,Y-10,'#ffd040');}},
 hud:e=>e.phx?'KUROGANE DISMOUNTS':e.mounted?(KUR.bearers(e).length?'STANDARD-BEARERS RIDE WITH HIM: HE TAKES HALF DAMAGE':'THE BEARERS ARE DOWN - FULL DAMAGE'):
  e.riderDown?'KUROGANE IS DOWN - DEFEAT YAMIKAZE':e.fan>0?'WAR FAN OPEN - STOP SHOOTING!':
  e.yamikaze&&!e.yamikaze.dead?'LEAVE THE CHARGE LANE AND STRIKE DURING RECOVERY':'YAMIKAZE IS DOWN - DEFEAT KUROGANE',
 onHalf(e){
  e.mounted=0;e.r=8;e.spd=36;e.dm*=1.25;
  e.sprOv=kuroFootSpr();
  e.dismount||=kuroDismount(e);e.yamikaze=KUR.spawnHorse(e);
  e.x=e.dismount.land.x;e.y=e.dismount.land.y;e.dismount=null;
  for(const m of KUR.bearers(e))m.dead=true;
 },
 reset(e){e.riderDown=false;e.yamikaze=null;e.dismount=null;e.trail=[];},
 atks:[
  // lance pass: the horse rears, a red line across the court, then a gallop straight through leaving a wake of shards
  {n:'lance',wt:4,half:0,gap:1.8,run(e,A,dt){if(!A.go){A.go=1;A.ph=0;e.tele=2;sfx('boss');A.a=aimAt(e);A.m=mark({k:'l',x:e.x,y:e.y,a:A.a,len:rayLen(e.x,e.y,A.a,600),w:e.r*2+10,t:.85,lock:.25,col:BC.aim,follow:m=>{m.x=e.x;m.y=e.y;m.a=A.a=aimAt(e);m.len=rayLen(e.x,e.y,m.a,600);}});}
    if(A.ph===0){if(!A.m.fired)return false;A.ph=1;A.dt=0;A.px=e.x;A.py=e.y;e.tele=0;sfx('dash');}
    const s=380*(e.slow||1),ox=e.x,oy=e.y;move(e,Math.cos(A.a)*s*dt,Math.sin(A.a)*s*dt,e.r);A.dt+=dt;dustTrail(e,'#7a6a50');bossContact(e);
    if(Math.hypot(e.x-A.px,e.y-A.py)>22){A.px=e.x;A.py=e.y;for(const sd of [1,-1])bsh(e,e.x,e.y,A.a+sd*Math.PI/2+rnd(-.2,.2),34,8,{col:'#c8b890',r:2,life:2.4});}
    if(Math.hypot(e.x-ox,e.y-oy)<s*dt*.3||A.dt>1.6){// he wheels round: hoof stomp, a fast low ring - dash through it
     shake=Math.max(shake,6);sfx('break');bring(e,e.x,e.y,36,120,9,{col:'#9a7a50',r:3,life:3},Math.random());e.loopA=Math.atan2(e.y-arenaOf(e).cy,e.x-arenaOf(e).cx);return true;}return false;}},
  // tachi cross-slash (on foot): two long slashes in an X on you. Dodge diagonally
  {n:'cross',wt:3,half:1,run(e,A){if(!A.go){A.go=1;e.tele=1;const a=aimAt(e);for(const s of [1,-1]){const la=a+s*.6;mark({k:'l',x:P.x-Math.cos(la)*90,y:P.y-Math.sin(la)*90,a:la,len:180,w:13,t:.6,dmg:18*e.dm,col:'#e8eef6',src:e,on:()=>sfx('slash')});}}return A.t>.95;}},
  // war fan (on foot): it snaps open for 2s and every shot that hits him comes back at you as gold sparks
  {n:'fan',wt:2,half:1,run(e,A){if(!A.go){A.go=1;sfx('block');e.fan=2;say(e,'FAN!','#c0a040',.6);}return A.t>2.1;}},
  // commander's call (on foot): he points the fan, an arrow volley lands on a marked rectangle. Leave it
  {n:'call',wt:3,half:1,run(e,A){if(!A.go){A.go=1;say(e,'LOOSE!','#c02020',.7);const w=rnd(70,100),h=rnd(70,100);mark({k:'rect',x0:P.x-w/2,y0:P.y-h/2,x1:P.x+w/2,y1:P.y+h/2,t:1.1,dmg:17*e.dm,col:BC.aim,src:e,on:m=>{for(let i=0;i<16;i++)particles.push({x:rnd(m.x0,m.x1),y:rnd(m.y0,m.y1),vx:0,vy:70,t:.25,col:'#e8eef6'});}});}return A.t>1.3;}},
  // heavy cut (on foot): a slow, crushing three-step advance
  {n:'heavy',wt:2,half:1,ok:(e,d)=>d<90,run(e,A,dt){if(!A.go){A.go=1;A.k=0;}for(let i=0;i<3;i++)if(at(A,.15+i*.5)){const a=aimAt(e);mark({k:'cone',x:e.x,y:e.y,a,r:46,arc:1.6,t:.4,dmg:20*e.dm,col:BC.aim,src:e});A.da=a;}
    if(A.t%.5<.12)move(e,Math.cos(A.da||0)*90*dt,Math.sin(A.da||0)*90*dt,e.r);return A.t>1.8;}},
 ],
 // EVENT 70%: cavalry wing. Riders thunder across the court in lanes; each lane flashes before its rider comes
 event:{at:.7,dur:20,name:'CAVALRY WING',hint:'DODGE BETWEEN THE LANES',
  start(e,E){E.lt=.6;E.k=0;const A=arenaOf(e);E.home=freeSpot(e,A.cx,A.y0+40,e.r);},
  tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*2);e.y+=(E.home.y-e.y)*Math.min(1,dt*2);E.lt-=dt;
   if(E.lt<=0){E.lt=E.t>10?.85:1.15;E.k++;const A=arenaOf(e),n=E.t>10?2:1;for(let j=0;j<n;j++){const horiz=(E.k+j)%2===0,lane=(ri(-3,3))*30,dir=Math.random()<.5?1:-1;
     const x=horiz?(dir>0?A.x0+4:A.x1-4):(horiz?0:clamp(P.x+lane,A.x0+20,A.x1-20)),y=horiz?clamp(P.y+lane,A.y0+20,A.y1-20):(dir>0?A.y0+4:A.y1-4),a=horiz?(dir>0?0:Math.PI):(dir>0?Math.PI/2:-Math.PI/2);
     mark({k:'l',x,y,a,len:520,w:22,t:.9,col:BC.aim,grow:false,on:()=>{bsh(e,x,y,a,280,14,{spr:'rider',r:9,col:'#3a3a48',life:2.4});sfx('dash');}});}}}},
};
KUR.reflect=function(e){const a=aimAt(e);bsh(e,e.x,e.y,a+rnd(-.3,.3),150,9,{col:BC.gold,r:2,life:2});spark(e.x,e.y-10,'#ffd040',4,50);};

// ================================================================ XII. THE CORRUPT EMPEROR - everything
// Phase 1 (100-70%): seated and shielded while four corrupted ronin guard him; the guards ARE his health down to 70%.
// Phase 2 (70-35%): he descends and casts echoes of every guardian you beat, faster and purple; two at a time below half.
// Phase 3 (35-0%): the crown shatters and his true form fills the head of the hall. At 15%: the last stand.
// All fight long his shots leave corruption pools that drain you; stand on a corner shrine for 2s to purify a wide circle.
const EMPR={
 pools:()=>hz.filter(h=>h.cor),
 pool(x,y,r){if(EMPR.pools().length>46)return;hz.push({x,y,r:r||11,t:22,dps:6,col:'#6a20a0',cor:1});},
 guards:e=>(e.guards||[]).filter(m=>!m.dead),
};
BKIT['THE CORRUPT EMPEROR']={director:empDirector,noTicks:0,halfName:'HIS ROBES SPLIT - TWO ECHOES AT ONCE',
 style:{c:'#b040ff',t:['THE THRONE','THE ECHOES','TRUE FORM'],ph:[[],[],[]]},
 guide:['SKILL: EVERYTHING YOU HAVE LEARNED','PHASE 1: HIS GUARDS ARE HIS SHIELD. PHASE 2: ECHOES OF EVERY GUARDIAN','PHASE 3: HIS TRUE FORM. CORRUPTION POOLS DRAIN YOU','STAND ON A CORNER SHRINE FOR 2S TO PURIFY THE FLOOR'],
 init(e){const A=arenaOf(e);e.throne=freeSpot(e,A.cx,A.y0+40,e.r);e.x=e.throne.x;e.y=e.throne.y;e.ph=1;e.iv=999;
  e.shrines=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b],i)=>({x:A.cx+a*A.R*.66,y:A.cy+b*A.R*.66,hold:0,cd:0,i}));
  // corrupted guards: four of the ronin, purple, their health is the first 30% of his bar
  const per=e.maxhp*.3/4;e.guards=['JUBEI','GONZA','HANZO','TETSUGORO'].map((id,i)=>{const d=Object.assign({},R7.find(x=>x.id===id),{c:'#b040ff'});const m=bMin(e,d.type,A.cx-90+i*60,A.cy-40);
   Object.assign(m,{hp:per,maxhp:per,label:id,labelC:'#e080ff',sprOv:Object.assign({},foeSprite(d.type,basePal('#4a1a6a','#2a0a3a','#e080ff','#1a0a2a')),{sc:d.type==='brute'?1:1.1}),d,sigs:[d.sig],cd:rnd(1,2),ang:i*1.6,fight:1});m.t=Object.assign({},m.t,{ai:'dummy'});return m;});
  e.echoT=1;e.E=[];e.lastStand=null;},
 hud:e=>e.ph===1?'HIS GUARD SHIELDS HIM: '+EMPR.guards(e).length+' LEFT':'CORRUPTION DRAINS YOU - STAND ON A SHRINE 2S TO PURIFY',hudC:'#e080ff',
 floor(e){ctx.save();worldXf();for(const s of e.shrines){const on=s.cd<=0||e.lastStand&&!s.done;ctx.globalAlpha=.9;ctx.fillStyle=on?'#e8e0c8':'#5a5060';ctx.fillRect(s.x-11,s.y-11,22,22);ctx.fillStyle=on?'#ffd040':'#3a3040';ctx.fillRect(s.x-6,s.y-6,12,12);
   if(s.hold>0){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,16,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,s.hold/(e.lastStand?1.2:2)));ctx.stroke();}}
  ctx.globalAlpha=1;ctx.restore();
  if(e.lastStand){e.shrines.forEach(s=>{if(!s.done)txt(String(e.lastStand.order.indexOf(s.i)+1),sx(s.x,s.y)-2,sy(s.x,s.y)-20,e.lastStand.order[e.lastStand.k]===s.i?'#ffd040':'#888');});}
  for(const s of e.shrines)if(s.cd>0&&!e.lastStand)txt(String(Math.ceil(s.cd)),sx(s.x,s.y)-4,sy(s.x,s.y)-18,'#888');},
 overlay(e){if(BX.dark>0)bossDark(e);},
 event:{at:.15,dur:25,name:'THE LAST STAND',hint:'PURIFY THE FOUR SHRINES IN ORDER',
  start(e,E){const o=[0,1,2,3].sort(()=>Math.random()-.5);e.lastStand={order:o,k:0};for(const s of e.shrines){s.done=0;s.cd=0;s.hold=0;}E.ft=1;},
  tick(e,dt,E){E.ft-=dt;if(E.ft<=0){E.ft=1.5;pick([EMPATK.fans,EMPATK.crown,EMPATK.souls])(e,{t:0,quick:1});}if(e.lastStand.k>=4){E.done=1;}},
  end(e,E){const won=e.lastStand.k>=4;e.lastStand=null;for(const s of e.shrines){s.done=0;s.cd=0;}if(won){e.downT=6;setToast('THE SHRINES BURN BRIGHT - HE IS EXPOSED!','#ffd040',3);impact(e.x,e.y,'#ffd040',12,true);}}},
};
function empDirector(e,dt,d){const K=BKIT[e.name];kitStart(e,K);if(e.say){e.say.t-=dt;if(e.say.t<=0)e.say=null;}
 // the shrines: stand on one for 2s to purify the corruption in a wide circle
 for(const s of e.shrines){if(s.cd>0){s.cd-=dt;continue;}const on=Math.hypot(P.x-s.x,P.y-s.y)<13;
  if(e.lastStand){if(s.done)continue;if(on&&e.lastStand.order[e.lastStand.k]===s.i){s.hold+=dt;if(s.hold>=1.2){s.done=1;s.hold=0;e.lastStand.k++;fxRing(s.x,s.y,60,'#ffd040',.5);sfx('heal');}}else s.hold=Math.max(0,s.hold-dt*2);continue;}
  if(on){s.hold+=dt;if(s.hold>=2){s.hold=0;s.cd=40;for(const h of EMPR.pools())if(Math.hypot(h.x-s.x,h.y-s.y)<120)h.t=0;fxRing(s.x,s.y,120,'#ffd040',.6);sfx('heal');setToast('PURIFIED','#ffd040',1.2);}}else s.hold=Math.max(0,s.hold-dt*2);}
 // his corrupt shots leave pools where they end; souls that cross a shrine are freed
 for(const q of projs)if(q.from==='e'&&q.own===e&&q.corP&&q.life<dt*1.5&&!q.pooled){q.pooled=1;EMPR.pool(q.x,q.y);}
 for(const q of projs)if(q.soul&&!q.dead)for(const s of e.shrines)if(s.cd<=0&&Math.hypot(q.x-s.x,q.y-s.y)<16){q.dead=true;spark(q.x,q.y,'#a8d8ff',8,50);}
 // phase 1: the guards are his health; he cannot be touched until they fall
 tickBarrage(e,dt);if(!e.EV&&!(e.downT>0))barrageTick(e,K,dt);
 if(e.ph===1){const G=EMPR.guards(e);e.hp=e.maxhp*.7+G.reduce((s,m)=>s+Math.max(0,m.hp),0);e.iv=999;
  for(const m of G){if(m.A){m.A.t+=dt;if(R7SIG[m.A.n](e,m,m.A,dt)){m.A=null;m.cd=rnd(2,3);}continue;}m.ang+=dt*.5;const tx=P.x+Math.cos(m.ang)*m.d.r,ty=P.y+Math.sin(m.ang)*m.d.r;steer(m,Math.atan2(ty-m.y,tx-m.x),Math.min(Math.hypot(tx-m.x,ty-m.y)/dt,m.spd*1.5),dt);m.cd-=dt;if(m.cd<=0)m.A={n:m.sigs[0],t:0};}
  e.gapT-=dt;if(!e.A&&e.gapT<=0){e.A={t:0,n:pick(['spiral','edict'])};}
  if(e.A){e.A.t+=dt;if(EMPATK[e.A.n](e,e.A,dt)){e.A=null;e.gapT=1.4;}}
  if(!G.length){e.ph=2;e.phase=2;e.iv=1.5;e.A=null;clearEnemyShots(true,1);const A=arenaOf(e);e.home=freeSpot(e,A.cx,A.cy-60,e.r);sfx('break');impact(e.x,e.y,'#b040ff',10,true);txtFx(e.x,e.y-20,'HE RISES','#e080ff',2);setToast('THE GUARD FALLS - THE EMPEROR RISES','#e080ff',3);}
  return true;}
 if(e.downT>0){e.downT-=dt;e.iv=0;if(Math.random()<dt*8)spark(e.x,e.y-20,'#ffd040',2,30);return true;}
 // crown shatters at 35%: the true form
 if(e.ph===2&&e.hp<e.maxhp*.35&&!e.EV){e.ph=3;e.phase=3;e.E=[];e.A=null;clearEnemyShots(true,1);BX.dark=0;for(const c of (e.clones||[]))c.dead=true;e.iv=2;const A=arenaOf(e);e.home=freeSpot(e,A.cx,A.y0+44,e.r);e.sprOv=EMPR.trueSpr||(EMPR.trueSpr=EMPR.mkTrue(e));e.r=16;
  impact(e.x,e.y,'#b040ff',14,true);sfx('boss');sfx('break');txtFx(e.x,e.y-30,'THE CROWN SHATTERS','#e080ff',2);setToast('THE EMPEROR\'S TRUE FORM','#e080ff',3);return true;}
 if(phaseGate(e,K,dt))return true;
 if(e.home){e.x+=(e.home.x-e.x)*Math.min(1,dt*1.5);e.y+=(e.home.y-e.y)*Math.min(1,dt*1.5);}
 if(e.ph===2){// echoes of the guardians: each for 12s, two at a time below half health
  const want=e.half?2:1;e.echoT-=dt;if(e.echoT<=0||e.E.length<want){if(e.echoT<=0){e.E=[];e.echoT=12;}while(e.E.length<want){const n=pick(Object.keys(ECHO).filter(k=>!e.E.some(x=>x.n===k)&&k!==e.lastEcho));e.lastEcho=n;e.E.push({n,t:0,rt:0});txtFx(e.x,e.y-20-e.E.length*8,'ECHO: '+n,'#e080ff',1.5);setToast('ECHO OF '+ECHO[n].from+': '+n,'#e080ff',2);}}
  BX.dark=e.E.some(x=>x.n==='LIGHTS OUT')?.7:0;BX.lights=BX.dark?e.shrines.map(s=>({x:s.x,y:s.y,r:70})):[];
  for(const x of e.E){x.t+=dt;x.rt-=dt;ECHO[x.n].tick(e,x,dt);}return true;}
 // phase 3: the true form
 e.gapT-=dt;if(!e.A&&e.gapT<=0)e.A={t:0,n:pick(['fans','crown','beam','souls'].filter(n=>n!==e.lastA))};
 if(e.A){e.A.t+=dt;if(EMPATK[e.A.n](e,e.A,dt)){e.lastA=e.A.n;e.A=null;e.gapT=.7;}}
 return true;}
const COR={col:BC.cor,r:3,corP:1};
const EMPATK={
 // imperial spiral: four arms of gold petals with purple hearts, from the throne
 spiral(e,A,dt){if(!A.go){A.go=1;e.tele=1;A.a=Math.random()*TAU;A.ft=0;}if(A.t<.5)return false;A.a+=dt*1.1;A.ft-=dt;if(A.ft<=0){A.ft=.14;for(let i=0;i<4;i++)bsh(e,e.x,e.y,A.a+i/4*TAU,55,8,Object.assign({spr:'petal',col:'#ffd040'},i%2?{}:{corP:1},{life:5}));}return A.t>4;},
 // edict: a scroll unrolls a line of purple kanji across the hall; it erupts. Cross it before it does
 edict(e,A){if(!A.go){A.go=1;say(e,'DECREE','#b040ff',.8);const Ar=arenaOf(e),horiz=Math.random()<.5;mark(horiz?{k:'l',x:Ar.x0,y:P.y,a:0,len:Ar.x1-Ar.x0,w:16,t:1,dmg:16*e.dm,col:BC.cor,src:e,on:m=>{for(let x=m.x;x<m.x+m.len;x+=40)EMPR.pool(x,m.y,9);}}:{k:'l',x:P.x,y:Ar.y0,a:Math.PI/2,len:Ar.y1-Ar.y0,w:16,t:1,dmg:16*e.dm,col:BC.cor,src:e,on:m=>{for(let y=m.y;y<m.y+m.len;y+=40)EMPR.pool(m.x,y,9);}});}return A.t>1.3;},
 // dragon-scale fans: screen-wide fans of scales, alternating left and right. Weave toward the side that just fired
 fans(e,A){if(!A.go){A.go=1;e.tele=1;}const n=A.quick?2:4;for(let i=0;i<n;i++)if(at(A,.5+i*.55)){const side=i%2?1:-1,ox=e.x+side*40;bfan(e,ox,e.y,aimAt(e,P.x,P.y)+side*.25,15,1.6,62,9,Object.assign({spr:'scale',r:3,life:6},COR,{col:'#a040e0'}));sfx('shoot');}return A.t>.6+n*.55;},
 // crown-shard rings: two rings around you turning opposite ways and closing in. Slip through where the gaps line up
 crown(e,A){if(!A.go){A.go=1;const cx=P.x,cy=P.y,g=Math.random()*TAU;for(const dir of [1,-1])for(let i=0;i<24;i++){const a=i/24*TAU;if(Math.abs(angDiff(a,g+(dir>0?0:Math.PI)))<.32)continue;bsh(e,cx+Math.cos(a)*170,cy+Math.sin(a)*170,a,0,9,{st:'orbit',ox:cx,oy:cy,oa:a,or:170,ow:.55*dir,orv:-48,spr:'scale',col:'#ffd040',r:3,life:3.4});}}return A.t>(A.quick?.4:1.6);},
 // sweeping beam: his mouth glows for a second, then a wide beam sweeps the floor. Dash through its edge
 beam(e,A){if(!A.go){A.go=1;e.tele=2;A.a0=aimAt(e)-1;A.m=mark({k:'l',x:e.x,y:e.y,a:A.a0,len:480,w:22,t:1,stay:2.2,sdmg:14*e.dm,col:BC.cor2,src:e,follow:m=>{m.x=e.x;m.y=e.y;if(m.fired)m.a=A.a0+2*clamp(1-m.stay/2.2,0,1);}});A.m.lock=-99;}return A.t>3.4;},
 // soul release: pale wisps stream out and home slowly; lead them over a lit shrine to free them
 souls(e,A){if(!A.go){A.go=1;tone(110,1,'sine',.06,-10);const n=A.quick?4:8;for(let i=0;i<n;i++){const a=i/n*TAU;const q=bsh(e,e.x,e.y,a,0,9,{spr:'wisp',st:'hang',wait:.4+i*.15,ha:a,csp:55,then:'seek',turn:1.1,seekT:4,col:'#a8d8ff',r:3,life:7});q.soul=1;}}return A.t>(A.quick?.3:1.6);},
};
// the echoes: one signature of every guardian, recoloured and turned against you
const ECHO={
 'OX CHARGE':{from:'AKAGANE',tick(e,x,dt){if(x.rt>0)return;x.rt=3;const a=aimAt(e);mark({k:'l',x:e.x,y:e.y,a,len:rayLen(e.x,e.y,a,520),w:22,t:.8,col:BC.cor,on:m=>{bsh(e,m.x,m.y,m.a,300,14,{spr:'rider',r:9,col:'#4a1a6a',st:'bounce',bn:2,life:4});}});}},
 'CLAW X':{from:'KUSAKARI, THE REED HUNTER',tick(e,x){if(x.rt>0)return;x.rt=2.4;const pl=EMPR.pools(),src=pl.length?pick(pl):{x:e.x,y:e.y},a=Math.atan2(P.y-src.y,P.x-src.x);for(const s of [1,-1]){const la=a+s*Math.PI/4;mark({k:'l',x:P.x-Math.cos(la)*80,y:P.y-Math.sin(la)*80,a:la,len:160,w:13,t:.6,dmg:15*e.dm,col:BC.cor,src:e});}}},
 'SILK WALLS':{from:'TSUCHIGUMO',tick(e,x){if(x.rt>0)return;x.rt=3;const n=5,o=Math.random()*TAU;for(let i=0;i<n;i++)for(let j=0;j<5;j++)bsh(e,e.x,e.y,o+i/n*TAU,60+j*10,8,Object.assign({spr:'silk',st:'stick',sd:60+j*20,life:5},COR));}},
 'TALISMAN SPIRAL':{from:'LADY HOTARU',tick(e,x,dt){x.a=(x.a||0)+dt*1.5;x.ft=(x.ft||0)-dt;if(x.ft<=0){x.ft=.2;for(let i=0;i<3;i++){bsh(e,e.x,e.y,x.a+i/3*TAU,55,8,{spr:'charm',col:BC.cor2,r:3,life:5});bsh(e,e.x,e.y,-x.a+i/3*TAU+.4,55,8,{spr:'charm',col:BC.cor2,r:3,life:5});}}}},
 'LANCE PASS':{from:'LORD KUROGANE',tick(e,x){if(x.rt>0)return;x.rt=2.2;const A=arenaOf(e),dir=Math.random()<.5?1:-1,y=P.y;mark({k:'l',x:dir>0?A.x0+4:A.x1-4,y,a:dir>0?0:Math.PI,len:520,w:22,t:.9,col:BC.cor,grow:false,on:m=>bsh(e,m.x,m.y,m.a,290,14,{spr:'rider',r:9,col:'#4a1a6a',life:2.4})});}},
 'TOLL RINGS':{from:'THE ABBOT',tick(e,x){if(x.rt>0)return;x.rt=.5;x.k=(x.k||0)+1;if(x.k%2)bring(e,e.x,e.y,44,72,8,{col:BC.cor2,r:2,life:6},x.k*.07);else bring(e,e.x,e.y,36,62,9,{col:BC.cor,r:4,life:6},x.k*.1,aimAt(e)+rnd(-.5,.5),.38);tone(330,.06,'square',.03);}},
 'MATCHLOCK VOLLEY':{from:'TETSUO',tick(e,x){if(x.rt>0)return;x.rt=1.6;x.k=(x.k||0)+1;const A=arenaOf(e),west=x.k%2;for(let i=0;i<9;i++){const y=A.y0+30+i*50+(x.k%4>1?25:0),sx0=west?A.x0+6:A.x1-6;mark({k:'l',x:sx0,y,a:west?0:Math.PI,len:500,w:4,t:.7,col:BC.cor2,grow:false,quiet:1,on:m=>bsh(e,m.x,m.y,m.a,200,9,{col:BC.cor2,r:2,life:3})});}}},
 'CLUB ORBIT':{from:'ONIKUMA',tick(e,x,dt){if(!x.c){x.c={x:P.x,y:P.y};x.g=Math.random()*TAU;}x.g+=dt*1.1;const Rr=Math.max(22,80-x.t*7),d=Math.hypot(P.x-x.c.x,P.y-x.c.y);
   if(Math.abs(d-Rr)<6&&Math.abs(angDiff(Math.atan2(P.y-x.c.y,P.x-x.c.x),x.g))>.6&&P.dash<=0&&P.iv<=0)hitPlayer(13*e.dm,x.c.x,x.c.y,{peril:true,src:e});
   for(let i=0;i<36;i++){const a=x.g+i/36*TAU;if(Math.abs(angDiff(a,x.g))<.6)continue;particles.push({x:x.c.x+Math.cos(a)*Rr,y:x.c.y+Math.sin(a)*Rr,vx:0,vy:0,t:dt*1.5,col:i%3?'#b040ff':'#e080ff'});}
   if(x.t>9){x.c=null;x.t=0;}}},
 'LIGHTS OUT':{from:'KAGE',tick(e,x){if(x.rt>0)return;x.rt=1.5;tone(1800,.25,'sine',.04,-400);const a=Math.random()*TAU,sx2=P.x+Math.cos(a)*120,sy2=P.y+Math.sin(a)*120,aa=Math.atan2(P.y-sy2,P.x-sx2);for(let i=0;i<5;i++)bsh(e,sx2,sy2,aa+(i-2)*.2,110,9,{spr:'shuriken',st:'curve',curve:(i-2)*.1,col:BC.cor2,r:3,life:3.5});}},
 'CLONE FIRE':{from:'THE KITSUNE',tick(e,x){if(!x.cl){x.cl=[];for(let i=0;i<2;i++){const p=freeSpot(e,e.x+(i?60:-60),e.y+20,e.r);const c=bMin(e,'foxclone',p.x,p.y);c.hp=c.maxhp=1;c.drawFn=c=>{drawGhostly(c,1,0,0,sprOf(e));return false;};c.onHurt=c=>{c.dead=true;spark(c.x,c.y,'#c080ff',12,60);return false;};x.cl.push(c);}e.clones=x.cl;}
   if(x.rt>0)return;x.rt=1.3;const src=[e].concat(x.cl.filter(c=>!c.dead));for(const s of src){const a=Math.atan2(P.y-s.y,P.x-s.x);for(let i=-2;i<=2;i++){if(s===e)bsh(e,s.x,s.y,a+i*.22,70,9,Object.assign({spr:'wisp'},COR,{col:'#8060ff'}));else fakeShot(e,s.x,s.y,a+i*.22,70,{});}}
   if(x.t>11.5)for(const c of x.cl)c.dead=true;}},
};
// the true form: his sprite twice over, swallowed by corruption, a dragon's horns through the shattered crown
EMPR.mkTrue=function(e){const s=bossSheet(e.di),c=mk(s.c.width,s.c.height,g=>{g.drawImage(s.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(90,10,140,.55)';g.fillRect(0,0,s.c.width,s.c.height);});
 const g=c.getContext('2d');for(let f=0;f<3;f++){const x0=f*s.fw+s.fw/2;g.fillStyle='#14101a';g.fillRect(x0-12,2,4,10);g.fillRect(x0+8,2,4,10);g.fillStyle='#ffd040';g.fillRect(x0-11,3,2,8);g.fillRect(x0+9,3,2,8);g.fillStyle='#ff40ff';g.fillRect(x0-3,18,2,2);g.fillRect(x0+2,18,2,2);}
 return Object.assign({},s,{c,wc:whiteOf(c),sc:(s.sc||1)*1.9});};

// ================================================================ REDRAWN SPRITES
// filled polygon helper for the art functions (scanline even-odd fill)
function artPoly(R,pts,col){let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
 for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
  xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const xa=Math.round(xs[i]),xb=Math.round(xs[i+1]);if(xb>xa)R(xa,y,xb-xa,1,col);}}}

// TSUCHIGUMO: a hulking earth spider. Banded jointed legs arched high over the body, a bristled abdomen carrying an oni
// face, a cluster of red eyes and venom-wet fangs. Frames: idle, legs shifting, rearing to strike. At half health two legs
// are gone and an eye is put out.
BART['TSUCHIGUMO, EARTH SPIDER']=Object.assign(p=>{const {R,E,L,f,atk}=p,b=f===1?1:0,hurt=ARTHURT;
 const C0='#1a110c',C1='#33221a',C2='#523822',C3='#7a5530',C4='#a8743c',OB='#c89040',OB2='#f0c870';
 const leg=(hx,hy,kx,ky,fx,fy,near,stub)=>{const c=near?C2:C1,cd=near?C1:C0,cl=near?C3:C2;
  L(hx,hy,kx,ky,cd,4);L(hx,hy-1,kx,ky-1,c,2);L(hx,hy-2,kx,ky-2,cl,1);
  if(stub){E(kx,ky,2,2,'#5a0a08');R(kx-1,ky-1,1,1,'#a02018');return;}
  L(kx,ky,fx,fy,cd,3);L(kx,ky-1,fx-1,fy-1,near?C3:C2,1);
  // banded joints: knee and mid-shin
  E(kx,ky,2,2,near?OB:C3);R(kx-1,ky-2,2,1,near?OB2:C4);const mx=Math.round(kx+(fx-kx)*.45),my=Math.round(ky+(fy-ky)*.45);R(mx-1,my-1,3,2,near?OB:C3);
  // bristles along the upper segment, claw tip
  for(let i=1;i<4;i++){const x=hx+(kx-hx)*i/4,y=hy+(ky-hy)*i/4;R(x,y-3,1,1,cl);}R(fx-1,fy,3,1,cd);R(fx,fy-1,1,2,'#e8dcc0');};
 const raise=atk?1:0,sw=k=>(f===1?(k%2?1:-1):0);
 // far legs (behind the body)
 leg(70,30,84-raise*2,10-raise*6+sw(0),94+raise*1,44-raise*26,0);leg(66,29,73,5+sw(1),81,50,0,hurt);leg(61,29,49,5+sw(2),45,50,0);leg(57,30,34,9+sw(3),21,48,0);
 // abdomen: a great bristled sac with an oni face
 E(32,30+b,23,17,C0);E(32,29+b,22,16,C1);E(31,26+b,19,12,C2);E(28,22+b,11,6,C3);E(26,20+b,4,2,C4);
 for(let i=0;i<14;i++){const a=Math.PI*(1.05+i/13*.95),x=32+Math.cos(a)*22,y=29+b+Math.sin(a)*16;R(x,y-1,1,2,C4);}
 for(const s of [-1,1]){artPoly(R,[[32+s*3,26+b],[32+s*13,22+b],[32+s*12,27+b],[32+s*4,30+b]],'#d8c8a0');R(32+s*8-1,24+b,3,2,'#c02018');R(32+s*8,24+b,1,1,'#ffe080');L(32+s*3,21+b,32+s*13,18+b,'#d8c8a0',1);}
 artPoly(R,[[24,33+b],[40,33+b],[37,40+b],[27,40+b]],'#d8c8a0');R(26,35+b,12,3,'#5a0a08');for(let i=0;i<5;i++){R(26+i*2.5,35+b,1,2,'#f8f0e0');R(27+i*2.5,37+b,1,1,'#f8f0e0');}R(31,28+b,2,4,'#d8c8a0');
 // waist and the armoured cephalothorax
 E(51,33,5,4,C1);E(63,35,13,10,C0);E(63,34,12,9,C2);E(61,31,8,5,C3);R(57,29,5,1,C4);for(let i=0;i<4;i++)R(56+i*4,37,2,1,OB);
 // near legs (in front of the body)
 leg(68,43,90-raise*2,28-raise*20-sw(0),95,61-raise*34,1,hurt);leg(66,43,77,17-sw(1),83,62,1);leg(61,43,46,17-sw(2),40,62,1);leg(57,42,29,21-sw(3),12,60,1);
 // head: eight eyes (two great ones), pedipalps, fangs that spread and drip when it strikes
 E(78,37,10,8,C0);E(78,36,9,7,C1);E(77,33,6,3,C2);R(74,31,6,1,C3);
 const eye=(x,y,r,out)=>{if(out){R(x-r,y,r*2+1,1,'#5a0a08');R(x,y-r,1,r*2+1,'#5a0a08');return;}E(x,y,r,r,'#7a0a08');E(x,y,Math.max(0,r-1),Math.max(0,r-1),atk?'#ff5030':'#e02018');R(x-1,y-1,1,1,'#ffd0a0');};
 eye(80,35,3,0);eye(86,36,2,hurt);eye(76,33,1,0);eye(81,31,1,0);eye(85,32,1,0);eye(74,36,1,0);eye(88,33,1,0);
 L(84,41,91,45-raise*4,C1,2);L(89,45-raise*4,91,48-raise*4,C3,1);
 const fs=atk?3:0;L(78,42,76-fs,51,C0,4);L(78,42,76-fs,50,C3,1);R(75-fs,51,2,4,'#f0e8d8');L(83,42,85+fs,51,C0,4);L(83,42,85+fs,50,C3,1);R(84+fs,51,2,4,'#f0e8d8');
 if(atk){R(75-fs,55,1,2,'#90e050');R(85+fs,55,1,3,'#90e050');}
},{sc:1.1,fw:96,fh:64,raw:1});

// THE MOTH QUEEN: a court lady with the wings of a great atlas moth - rust and ochre wings with eye-spots and pale crescents,
// a fur ruff, feathered antennae. Frames: wings raised, wings beating down, wings flung wide as she scatters her dust.
BART['THE MOTH QUEEN']=Object.assign(p=>{const {R,E,L,f,atk}=p,b=f===1?1:0,hurt=ARTHURT,cx=40;
 const WD='#3a1418',W1='#7a2a20',W2='#b85a2a',W3='#e0a048',WC='#f4ecd8';
 const dn=atk?-3:f===1?4:0;
 for(const s of [-1,1]){const X=x=>cx+s*x;
  // hindwings with long trailing tails
  artPoly(R,[[X(4),30],[X(26),30+dn*.3],[X(30),40+dn*.3],[X(20),50],[X(14),58],[X(10),48],[X(4),40]],WD);
  artPoly(R,[[X(5),31],[X(24),31+dn*.3],[X(27),39+dn*.3],[X(19),48],[X(14),55],[X(10),46],[X(5),39]],W1);
  artPoly(R,[[X(8),35],[X(21),34],[X(22),40],[X(15),45],[X(9),40]],W2);E(X(15),39,3,3,WD);E(X(15),39,2,2,W3);
  // forewings: big, hooked tips, a pale band, a window crescent and an eye-spot
  const ty=3+dn,tx=atk?38:34;
  artPoly(R,[[X(4),26],[X(10),14+dn*.5],[X(22),6+dn*.8],[X(tx),ty],[X(tx+2),ty+5],[X(30),20+dn*.4],[X(26),30],[X(14),32],[X(4),30]],WD);
  artPoly(R,[[X(5),26],[X(11),15+dn*.5],[X(22),8+dn*.8],[X(tx-1),ty+2],[X(tx),ty+5],[X(29),19+dn*.4],[X(25),29],[X(14),30],[X(5),29]],W1);
  artPoly(R,[[X(9),24],[X(14),16+dn*.5],[X(24),11+dn*.7],[X(27),17+dn*.5],[X(22),26],[X(12),27]],W2);
  L(X(8),26,X(28),12+dn*.6,W3,1);L(X(6),29,X(25),27,WC,1);
  E(X(18),20+dn*.5,3,2,WC);R(X(18),20+dn*.5,1,1,WD);
  E(X(tx-3),ty+3,3,2,'#e8d8c0');R(X(tx-3),ty+3,1,1,'#3a1418');
  if(hurt){E(X(18),20+dn*.5,4,3,'#ffe080');R(X(18),20+dn*.5,1,1,'#ff4020');E(X(15),39,3,3,'#ffe080');for(let i=0;i<4;i++)R(X(10+i*6),28+((i+f)%2)*2,1,1,'#fff8c0');}}
 // body: a plum kimono with a gold obi, a white fur ruff
 for(let y=28;y<=57;y++){const w=Math.round(3+(y-28)*.33);R(cx-w,y,w*2,1,y>52?'#2a1438':'#4a2a5a');R(cx-w,y,1,1,'#2a1438');}
 R(cx-1,30,2,26,'#6a3a7a');R(cx-6,36,12,3,'#d8a840');R(cx-6,37,12,1,'#a07020');
 for(let i=0;i<7;i++)E(cx-6+i*2,27+(i%2),2,2,i%2?'#f0ecf4':'#ffffff');
 // arms: one raised scattering glittering dust when she attacks
 if(atk){L(cx+5,30,cx+12,20,'#4a2a5a',2);E(cx+13,19,1,1,'#f0e0e8');for(let i=0;i<6;i++)R(cx+13+Math.cos(i*1.1)*4,18+Math.sin(i*1.1)*3,1,1,i%2?'#ffe080':'#ffffff');}
 else{L(cx+5,30,cx+7,40,'#4a2a5a',2);R(cx+6,41,2,2,'#f0e0e8');}L(cx-5,30,cx-7,40,'#4a2a5a',2);R(cx-8,41,2,2,'#f0e0e8');
 // head: a pale face with great dark eyes, a white bob, gold feathered antennae
 E(cx,22+b,4,5,'#f4ecf0');R(cx-3,21+b,2,2,'#14101a');R(cx+2,21+b,2,2,'#14101a');R(cx-2,21+b,1,1,'#8060a0');R(cx+3,21+b,1,1,'#8060a0');R(cx,25+b,1,1,'#c04060');
 E(cx,18+b,6,4,'#2a1438');R(cx-6,18+b,2,8,'#2a1438');R(cx+5,18+b,2,8,'#2a1438');R(cx-3,15+b,5,1,'#5a3a7a');R(cx-5,19+b,10,1,'#2a1438');R(cx+4,14+b,4,1,'#e0b040');R(cx+7,13+b,1,3,'#ff6080');
 for(const s of [-1,1]){L(cx+s*2,15+b,cx+s*9,4+b,'#c09040',1);for(let i=1;i<6;i++){const x=cx+s*(2+i*1.4),y=15+b-i*2.2;R(x-s*2,y,2,1,'#e0b860');R(x,y-1,1,1,'#e0b860');}}
},{sc:1.05,fw:80,fh:60,raw:1});

// ================================================================ SECOND FORMS (half health)
// AKAGANE: phase 2 he throws off the horned helmet and the banner, ties a headband over wild hair and grips the naginata
// two-handed, always levelled forward.
BART['AKAGANE, THE RED OX']=Object.assign(p=>{const {R,E,L,b,atk}=p,two=ARTHURT;
 if(!two){R(8,2,1,38,'#3a2a1a');R(2,3,7,14,'#c02820');R(3,6,5,3,'#e0b040');R(4,10,3,1,'#e0b040');}
 const h=bWarrior(two?Object.assign({},p,{atk:true}):p,{ar:'#a02818',ad:'#5a1008',ac:'#e0b040',lg:'#3a1a10',hand:'#5a3420',arm:two?'#d8a878':'#6a3a24',chest:'#c03020'});
 const hx=h.cx,hy=h.ty-12;bFace(p,hx,hy,'#d8a878');
 if(!two){R(hx-5,hy+6,11,5,'#5a1008');R(hx-4,hy+8,9,1,'#e0b040');R(hx-3,hy+10,1,1,'#f0e8d8');R(hx+3,hy+10,1,1,'#f0e8d8');
  R(hx-7,hy-2,15,5,'#a02818');R(hx-6,hy-2,13,1,'#c03020');R(hx-8,hy+2,3,6,'#7a1810');R(hx+6,hy+2,3,6,'#7a1810');R(hx-1,hy-3,3,2,'#e0b040');
  L(hx-6,hy,hx-12,hy-4,'#f0e8d8',2);L(hx-12,hy-4,hx-11,hy-10,'#f0e8d8',2);L(hx+6,hy,hx+12,hy-4,'#f0e8d8',2);L(hx+12,hy-4,hx+11,hy-10,'#f0e8d8',2);R(hx-11,hy-11,2,2,'#c8c0b0');R(hx+11,hy-11,2,2,'#c8c0b0');}
 else{// wild black hair, a red hachimaki with trailing ends, a snarl
  E(hx,hy+1,7,4,'#14101a');for(let i=0;i<6;i++)R(hx-7+i*2.5,hy-4+(i%2),2,4,'#14101a');R(hx-7,hy+2,2,7,'#14101a');
  R(hx-6,hy+1,13,2,'#e02818');L(hx-6,hy+2,hx-12,hy+6+b,'#e02818',2);L(hx-6,hy+2,hx-11,hy+9,'#c01810',1);
  R(hx+1,hy+4,2,1,'#14101a');R(hx+3,hy+4,1,1,'#ff3020');R(hx-1,hy+8,5,1,'#5a1008');R(hx,hy+8,1,1,'#fff');R(hx+3,hy+8,1,1,'#fff');}
 if(atk||two){L(h.hx-14,h.hy+8,h.hx+16,h.hy-6,'#5a3a22',2);L(h.hx+14,h.hy-6,h.hx+22,h.hy-12,'#e8eef6',2);R(h.hx+20,h.hy-14,3,3,'#ffffff');if(two)R(h.cx-13,h.ty+10,4,4,'#d8a878');}
 else{R(h.hx+1,2,2,50,'#5a3a22');L(h.hx+2,2,h.hx+6,-6,'#e8eef6',2);R(h.hx,8,4,2,'#e0b040');}},{sc:1.1});

// THE THOUSAND-BELL ABBOT: a towering warrior-monk under a wide straw hat, a great bronze bell on his back, a ringed staff.
// Phase 2 his bell cracks: the hat is gone, the upper robe hangs at his waist showing a sutra-tattooed torso, beads round his fist.
BART['THE THOUSAND-BELL ABBOT']=Object.assign(p=>{const {R,E,L,b,atk,f}=p,two=ARTHURT,cx=24,SK='#c89060',SK2='#a06a40',RB='#e8dcc0',RB2='#c0a878',SF='#e09030',GD='#d8b040';
 // the bell on his back (cracked in phase 2)
 if(!two){E(cx-3,18+b,12,11,'#6a4a18');E(cx-3,17+b,11,10,'#8a6a28');R(cx-15,24+b,24,4,'#a07a30');for(let x=cx-11;x<cx+5;x+=4)for(let y=10;y<20;y+=3)R(x,y+b,1,1,'#c8a048');R(cx-5,5+b,4,3,'#5a3a10');}
 else{// the cracked bell lies at his feet, split in two
  E(cx-17,50,6,5,'#6a4a18');E(cx-17,49,5,4,'#8a6a28');R(cx-23,53,12,2,'#a07a30');L(cx-17,45,cx-15,54,'#14101a',1);E(cx-9,53,3,2,'#8a6a28');}
 // robe: saffron skirt to the floor, white kesa sash
 for(let y=34;y<=54;y++){const w=Math.round(9+(y-34)*.3);R(cx-w,y,w*2,1,SF);R(cx-w,y,1,1,'#a06020');}R(cx-10,34,20,2,GD);R(cx-9,53,18,2,'#a06020');
 if(!two){for(let y=22;y<34;y++){const w=10;R(cx-w,y,w*2,1,RB);}L(cx-9,22,cx+8,34,SF,3);L(cx-9,22,cx+8,34,GD,1);R(cx-14,23,6,13,RB);R(cx+8,23,6,13,RB);R(cx-14,35,5,3,SK);}
 else{// bare torso with sutra tattoos; the robe top hangs at the waist
  E(cx,28+b,10,7,SK);R(cx-10,22+b,20,10,SK);R(cx-1,23+b,1,9,SK2);R(cx-6,26+b,4,1,SK2);R(cx+2,26+b,4,1,SK2);
  for(const [x,y] of [[cx-8,24],[cx-8,28],[cx+5,24],[cx+5,29],[cx-3,31]])R(x,y+b,3,1,'#2a1a10');R(cx-12,33,24,3,RB);R(cx-12,35,24,1,RB2);
  R(cx-15,22+b,5,12,SK);R(cx+10,22+b,5,12,SK);E(cx-13,35+b,3,3,SK);for(let i=0;i<6;i++)E(cx-16+i*1.4,33+b+(i%2)*2,1,1,'#7a4a20');}
 // prayer beads round the neck
 if(!two)for(let i=0;i<9;i++)E(cx-8+i*2,22+Math.round(Math.sin(i/8*3.14)*4)+b,1,1,'#5a3a18');
 // ringed shakujo staff
 const sx=atk?cx+16:cx+12;R(sx,atk?6:10,2,atk?42:44,'#6a4a28');E(sx+1,atk?4:8,4,4,GD);for(let i=0;i<6;i++)E(sx+1+Math.cos(i*1.05)*5,(atk?4:8)+Math.sin(i*1.05)*4,1,1,'#f0d060');R(sx-1,36,4,3,SK);
 // head: under the hat only burning eyes; phase 2 a bald scarred head and a furious face
 if(!two){E(cx,17+b,5,5,SK2);R(cx-3,17+b,2,1,'#ffd040');R(cx+1,17+b,2,1,'#ffd040');artPoly(R,[[cx-15,15+b],[cx,6+b],[cx+15,15+b],[cx+12,16+b],[cx-12,16+b]],'#c8a050');L(cx-13,15+b,cx,7+b,'#a07a30',1);L(cx+13,15+b,cx,7+b,'#e0c070',1);}
 else{E(cx,15+b,5,6,SK);R(cx-4,11+b,8,2,'#d8a070');R(cx-3,15+b,2,1,'#14101a');R(cx+1,15+b,2,1,'#14101a');R(cx-3,14+b,2,1,'#5a2a10');R(cx+1,14+b,2,1,'#5a2a10');L(cx-2,11+b,cx+2,17+b,'#8a3020',1);R(cx-2,19+b,4,1,'#5a2a10');for(let i=0;i<3;i++)R(cx-2+i*2,9+b,1,1,'#14101a');}},{sc:1.12});

// ONIKUMA, THE JAILER: a giant warden in black iron lamellar under a bear's-head hood, an iron kanabo chained to his wrist.
// Phase 2 the hood, helmet and plates come off: a scarred ex-sumo brawler, chain wrapped round both fists.
BART['ONIKUMA, THE JAILER']=Object.assign(p=>{const {R,E,L,b,atk,f}=p,two=ARTHURT,cx=24,SK='#c89070',SK2='#9a6a48',IR='#4a4a56',IR2='#7a7a88',FUR='#5a3a22',FUR2='#3a2414';
 // legs and a heavy skirt
 R(cx-11,40,8,13,'#2a2a32');R(cx+3,40,8,13,'#2a2a32');R(cx-12,52,10,4,'#1a1418');R(cx+2,52,10,4,'#1a1418');for(let j=0;j<8;j++)R(cx-13+j%2,36+j,26-(j%2)*2,1,j%2?'#3a2a20':'#5a4030');
 if(!two){// pelt cloak behind, iron lamellar torso
  for(let j=0;j<26;j++)R(cx-16-(j>>3),14+j,32+(j>>2),1,j%3?FUR:FUR2);
  R(cx-12,18+b,24,18,IR);for(let y=20;y<34;y+=3)for(let x=cx-11;x<cx+11;x+=4)R(x,y+b,3,2,IR2);R(cx-12,34,24,2,'#c8a040');
  R(cx-18,17+b,7,9,IR2);R(cx+11,17+b,7,9,IR2);R(cx-18,25+b,6,10,IR);R(cx+12,25+b,6,10,IR);E(cx-15,37+b,3,3,SK);E(cx+15,37+b,3,3,SK);
  // bear-head hood over an iron mask
  E(cx,10+b,9,8,FUR);R(cx-9,3+b,4,4,FUR);R(cx+5,3+b,4,4,FUR);R(cx-8,4+b,2,2,'#7a5a40');R(cx+6,4+b,2,2,'#7a5a40');E(cx,8+b,6,3,FUR2);R(cx-3,7+b,2,1,'#ffd040');R(cx+2,7+b,2,1,'#ffd040');
  R(cx-5,11+b,10,6,IR);R(cx-4,13+b,8,1,'#14101a');R(cx-2,15+b,1,1,IR2);R(cx+1,15+b,1,1,IR2);
  // kanabo: studded iron club, chained to the wrist
  const kx=atk?cx+18:cx+16,top=atk?0:6;R(kx,top,5,32,'#2a2a32');R(kx+1,top,3,32,'#4a4a56');for(let y=top+2;y<top+28;y+=4){R(kx-1,y,1,1,'#9a9aa8');R(kx+5,y+2,1,1,'#9a9aa8');}
  for(let i=0;i<4;i++)R(cx+15+i,38+i*2,2,2,'#7a7a88');}
 else{// bare scarred torso, rope belt, wild hair and beard, chain-wrapped fists
  E(cx,26+b,13,10,SK);R(cx-13,20+b,26,12,SK);R(cx-1,21+b,1,12,SK2);E(cx-5,23+b,4,2,SK2);E(cx+5,23+b,4,2,SK2);L(cx-8,20+b,cx+2,30+b,'#c06050',1);L(cx+6,22+b,cx+9,31+b,'#c06050',1);
  R(cx-13,33,26,3,'#e8dcc0');R(cx-2,33,4,6,'#e8dcc0');
  const ra=atk?-6:0;R(cx-19,20+b,7,11,SK);R(cx+12,20+b+ra,7,11,SK);
  for(const [x,y] of [[cx-16,34+b],[cx+16,34+b+ra]]){E(x,y,5,4,SK);for(let i=0;i<4;i++)R(x-5,y-3+i*2,10,1,i%2?'#9a9aa8':'#5a5a66');}L(cx-16,37+b,cx-22,52,'#7a7a88',1);
  E(cx,12+b,7,7,SK);for(let i=0;i<7;i++)R(cx-8+i*2.5,4+b+(i%2),2,5,'#2a1a10');E(cx,17+b,6,4,'#2a1a10');R(cx-3,11+b,2,1,'#14101a');R(cx+1,11+b,2,1,'#14101a');R(cx-3,10+b,2,1,'#4a2a10');R(cx+1,10+b,2,1,'#4a2a10');R(cx-2,15+b,4,1,'#5a1a10');}},{sc:1.3});

// THE NINE-TAILED KITSUNE: an elegant fox spirit in shrine robes - silver hair, fox ears, a fan, nine golden tails tipped
// with blue fox-fire. Phase 2 she drops the human guise: a crouched feral fox with burning tails and bared fangs.
BART['THE NINE-TAILED KITSUNE']=Object.assign(p=>{const {R,E,L,b,atk,f}=p,two=ARTHURT,cx=36;
 const tails=two?5:9;for(let i=0;i<tails;i++){const a=-2.95+(i+(9-tails)/2)*.36+(f===1?.05:0),tx=cx+Math.cos(a)*30,ty=42+Math.sin(a)*24,c=i%2?'#d07a28':'#e8a040';
  L(cx,42,tx,ty,'#14101a',6);L(cx,42,tx,ty,c,4);L(cx,41,(cx+tx)/2,(41+ty)/2,shade(c,.25),1);E(tx,ty,3,3,two?'#80c0ff':'#fff4dc');
  if(two){for(let k=0;k<3;k++)R(tx-1+k-1,ty-5-k*2-(f+k)%2,2,3,k%2?'#c0f0ff':'#4080ff');}else R(tx-1,ty-4,2,2,'#80e0ff');}
 if(!two){// shrine robes: white kosode over red hakama
  for(let y=30;y<=55;y++){const w=Math.round(6+(y-30)*.3);R(cx-w,y,w*2,1,y>39?'#c02030':'#f8f4ec');R(cx-w,y,1,1,y>39?'#801020':'#c8c0b8');}R(cx-7,38,14,2,'#e0b040');
  R(cx-11,30,5,10,'#f8f4ec');R(cx+6,30,5,10,'#f8f4ec');R(cx-11,39,4,2,'#f0d8c0');
  // a folding fan, flicked open to cast
  if(atk){for(let i=0;i<7;i++)L(cx+9,32,cx+14+i*1.5,22+i*.8,i%2?'#f8f4ec':'#c02030',1);}else R(cx+7,39,3,3,'#f8f4ec');
  // face, long silver hair, fox ears, red eye-liner
  R(cx-7,16+b,14,18,'#e8e8f4');E(cx,20+b,5,6,'#f8ecdc');R(cx-2,20+b,2,1,'#14101a');R(cx+2,20+b,2,1,'#14101a');R(cx-3,19+b,2,1,'#c02030');R(cx+3,19+b,2,1,'#c02030');R(cx,23+b,1,1,'#c02030');
  E(cx,15+b,6,3,'#e8e8f4');L(cx-5,14+b,cx-7,6+b,'#f0a850',3);L(cx+5,14+b,cx+7,6+b,'#f0a850',3);R(cx-7,8+b,1,3,'#3a1a10');R(cx+7,8+b,1,3,'#3a1a10');R(cx-1,13+b,3,1,'#e0b040');}
 else{// the feral fox: low crouch, ruff of fur, long muzzle, fangs, blazing eyes
  E(cx,44+b,14,8,'#e8a040');E(cx,42+b,12,6,'#f0b860');E(cx+3,46+b,7,4,'#fff4dc');
  for(const x of [cx-10,cx-4,cx+6,cx+11])R(x,48,3,8,'#d07a28');for(const x of [cx-10,cx-4,cx+6,cx+11])R(x-1,55,5,1,'#3a1a10');
  E(cx+12,32+b,8,7,'#f0a850');for(let i=0;i<5;i++)R(cx+5+i*3,37+b+(i%2),2,3,'#fff4dc');
  L(cx+8,28+b,cx+6,18+b,'#f0a850',3);L(cx+15,27+b,cx+17,17+b,'#f0a850',3);R(cx+6,20+b,1,3,'#3a1a10');R(cx+17,19+b,1,3,'#3a1a10');
  artPoly(R,[[cx+16,30+b],[cx+28,33+b],[cx+16,37+b]],'#f0a850');R(cx+26,32+b,2,2,'#14101a');
  R(cx+11,30+b,3,1,'#80e0ff');R(cx+13,29+b,1,1,'#ffffff');R(cx+9,28+b,3,1,'#c03030');
  R(cx+18,35+b,9,2,atk?'#5a0a10':'#14101a');R(cx+19,34+b,1,2,'#fff');R(cx+24,34+b,1,2,'#fff');R(cx+21,37+b,1,1,'#fff');}},{sc:1.05,fw:72,fh:60,raw:1});

// THE CORRUPT EMPEROR, phase 2: his robes split down the front and the corruption shows through - a violet rift from collar
// to hem, veins across his face, eyes blazing and the crown knocked askew.
{const old=BART['THE CORRUPT EMPEROR'];BART['THE CORRUPT EMPEROR']=Object.assign(p=>{old(p);if(!ARTHURT)return;const {R,E,L,b,f}=p;
 for(let y=27;y<=54;y++){const w=Math.round(1+(y-27)*.13+Math.sin(y*.9)*1);R(24-w-1,y,w*2+2,1,'#14101a');R(24-w,y,w*2,1,'#6a20a0');if(w>1)R(24-w+1,y,w*2-2,1,(y+f)%3?'#b040ff':'#e080ff');}
 for(const [x0,y0,x1,y1] of [[20,30,14,36],[28,32,34,40],[22,44,16,50],[27,46,32,52]])L(x0,y0,x1,y1,'#b040ff',1);
 const hy=12+b;R(20,hy+5,1,3,'#b040ff');R(28,hy+6,1,3,'#b040ff');L(19,hy+9,22,hy+11,'#b040ff',1);R(21,hy+4,3,2,'#ff60ff');R(26,hy+4,3,2,'#ff60ff');R(22,hy+4,1,1,'#fff');R(27,hy+4,1,1,'#fff');
 for(let i=0;i<10;i++){const a=i*.7+f*.6;R(24+Math.cos(a)*18,26+Math.sin(a)*16-f*2,2,2,i%2?'#e080ff':'#6a20a0');}},old);}

// ================================================================ THE BULLET-HELL LAYER, BOSS BY BOSS
// Every guardian keeps firing its own signature barrages between and through its attacks (BKIT.barrage), and gets the
// classic SURVIVAL storm as a second event (BKIT.storm) at whichever of 70% / 30% its own event does not use.
// Colours follow the shared language: red aimed, pale fixed, green leaves a hazard, purple the Emperor.
{const set=(n,b,st)=>{const K=BKIT[n];K.barrage=b;if(st)K.storm=st;K._evs=null;};
 set('ITOHIME, THE WIRE WEAVER',{rate:[.62,.46],during:'all',not:['climb'],
  ph1:[{pat:'web',cnt:10,rings:3,sp:55,col:BC.fix},{pat:'spiral',arms:5,spin:.32,sp:56,col:'#e8e8f0',burst:7,gap:.1},{cnt:5,spread:1,sp:55,st:'big',r:4,spr:'venom',col:BC.haz,pool:{r:10,t:2.5,dps:8,col:'#4a9a20'}},{pat:'flower',cnt:20,sp:50,st:'split',splitT:.9,col:'#c89040'},{cnt:7,spread:.6,sp:90,col:BC.aim,burst:2,gap:.18}],
  half:[{pat:'web',cnt:12,rings:3,sp:58,col:BC.fix,burst:2,gap:.4},{pat:'spiral',arms:7,spin:.36,sp:60,col:'#e8e8f0',burst:9,gap:.08},{cnt:7,spread:1.4,sp:58,st:'big',r:4,spr:'venom',col:BC.haz,pool:{r:10,t:2.5,dps:8,col:'#4a9a20'}},{pat:'flower',cnt:24,sp:52,st:'split',splitT:.9,col:'#c89040'},{pat:'gapring',cnt:30,gw:.4,sp:56,col:'#c89040',burst:2,gap:.3}]},
  {at:.3,dur:9,name:'HUNGERING DARK',rate:.38});
 set('LADY HOTARU',{rate:[.66,.48],during:'all',not:['spiral'],
  ph1:[{pat:'spiral',arms:5,spin:.3,sp:56,spr:'charm',col:BC.fix,burst:7,gap:.1},{cnt:5,spread:1,sp:55,st:'seek',turn:1.2,seekT:1.5,spr:'ember',col:'#ff8030'},{pat:'flower',cnt:20,sp:52,spr:'ember',col:'#ff6020'},{pat:'gapring',cnt:26,gw:.42,sp:54,spr:'charm',col:BC.fix,burst:2,gap:.35}],
  half:[{pat:'spiral',arms:7,spin:.34,sp:60,spr:'charm',col:BC.fix,burst:9,gap:.09},{cnt:7,spread:1.4,sp:57,st:'seek',turn:1.3,seekT:1.6,spr:'ember',col:'#ff8030'},{pat:'flower',cnt:24,sp:55,spr:'ember',col:'#ff6020',burst:2,gap:.3},{pat:'gapring',cnt:32,gw:.38,sp:58,spr:'charm',col:BC.fix,burst:3,gap:.3}]},
  {at:.3,dur:9,name:'INFERNO WALTZ',rate:.38});
 set('TETSUO THE GUNSMITH',{rate:[.5,.38],during:'all',
  ph1:[{pat:'stream',cnt:6,sp:120,st:'accel',col:BC.aim,burst:2,gap:.25},{cnt:11,spread:1.2,sp:95,st:'decel',col:'#c8c8d0'},{pat:'curtain',cnt:9,sp:85,col:BC.aim2},{pat:'mines',cnt:5,st:'mine',col:'#ff8030'},{pat:'wall',cnt:13,sp:80,col:BC.aim}],
  half:[{cnt:4,spread:.25,sp:150,col:BC.aim,burst:4,gap:.12},{pat:'stream',cnt:8,sp:130,st:'accel',col:BC.aim,burst:2,gap:.2},{cnt:13,spread:1.4,sp:100,st:'decel',col:'#c8c8d0'},{pat:'mines',cnt:7,st:'mine',col:'#ff8030'},{pat:'cross',dirs:6,cnt:4,sp:80,col:BC.aim2,rot:.25}]},
  {at:.3,dur:9,name:'FULL BARRAGE',rate:.38});
 set('THE THOUSAND-BELL ABBOT',{rate:[.75,.55],
  ph1:[{pat:'gapring',cnt:24,gw:.45,sp:48,st:'curve',curve:.6,col:'#e8e0ff'},{pat:'spiral',arms:4,spin:.35,sp:55,spr:'bead',col:'#7a4a20',burst:7,gap:.11},{pat:'flower',cnt:20,sp:50,st:'split',splitT:1.1,col:'#d8b040'},{cnt:5,spread:.5,sp:90,col:BC.aim,burst:2,gap:.2}],
  half:[{pat:'gapring',cnt:28,gw:.4,sp:52,st:'curve',curve:-.7,col:'#e8e0ff',burst:2,gap:.35},{pat:'spiral',arms:6,spin:.3,sp:58,spr:'bead',col:'#7a4a20',burst:10,gap:.09},{pat:'flower',cnt:24,sp:54,st:'split',splitT:1,col:'#d8b040'},{pat:'wall',cnt:15,sp:70,col:'#d8b040'}]},
  {at:.7,dur:9,name:'THOUSAND HANDS',rate:.4});
 set('ONIKUMA, THE JAILER',{rate:[.66,.48],during:'all',not:['grab'],
  ph1:[{pat:'flower',cnt:16,sp:46,st:'big',col:'#ff9040'},{pat:'gapring',cnt:24,gw:.45,sp:50,st:'big',col:'#c8c8d0'},{pat:'mines',cnt:5,st:'mine',col:'#ff8030'},{cnt:5,spread:.6,sp:90,col:BC.aim,burst:2,gap:.2},{pat:'stream',cnt:5,sp:75,st:'split',splitT:.8,col:'#ff9040'}],
  half:[{pat:'flower',cnt:20,sp:50,st:'split',splitT:1,col:'#ff9040'},{pat:'gapring',cnt:30,gw:.4,sp:55,st:'big',col:'#c8c8d0',burst:2,gap:.35},{pat:'mines',cnt:8,st:'mine',col:'#ff8030'},{pat:'cross',dirs:8,cnt:3,sp:70,st:'big',col:'#c8c8d0',rot:.2},{cnt:7,spread:.8,sp:100,col:BC.aim,burst:3,gap:.15}]},
  {at:.3,dur:9,name:'FORGE FIRE',rate:.38});
 set('KAGE, THE SHINOBI MASTER',{rate:[.48,.38],during:'all',
  ph1:[{cnt:5,spread:.6,sp:105,st:'boom',bT:1.5,col:BC.aim,burst:2,gap:.18},{pat:'lance',cnt:5,spread:.8,sp:240,col:'#e8eef6'},{pat:'stream',cnt:6,sp:115,st:'zig',col:BC.aim2},{pat:'gapring',cnt:24,gw:.4,sp:55,col:'#8a8aa0',burst:2,gap:.3},{pat:'curtain',cnt:9,sp:90,col:BC.aim}],
  half:[{cnt:7,spread:.8,sp:115,st:'boom',bT:1.4,col:BC.aim,burst:3,gap:.14},{pat:'lance',cnt:7,spread:1,sp:260,col:'#e8eef6'},{pat:'spiral',arms:6,spin:.45,sp:66,col:'#8a8aa0',burst:8,gap:.08},{pat:'cross',dirs:8,cnt:3,sp:80,st:'boom',bT:1.3,col:BC.aim2,rot:.3},{pat:'stream',cnt:8,sp:125,st:'zig',col:BC.aim2,burst:2,gap:.2}]},
  {at:.3,dur:9,name:'SHADOW STORM',rate:.36});
 set('TAMAMO, THE ILLUSIONIST',{rate:[.5,.4],during:'all',not:['clones'],
  ph1:[{pat:'orbitring',cnt:10,ow:3,orv:32,col:'#8080ff'},{cnt:5,spread:1,sp:60,st:'seek',turn:1.4,seekT:1.6,spr:'wisp',col:'#8080ff'},{pat:'spiral',arms:6,spin:.4,sp:60,st:'wave',col:'#c080ff',burst:7,gap:.1},{pat:'gapring',cnt:26,gw:.42,sp:55,col:'#ff9040',burst:2,gap:.35}],
  half:[{pat:'orbitring',cnt:12,ow:-3.2,orv:36,col:'#8080ff'},{cnt:7,spread:1.4,sp:64,st:'seek',turn:1.6,seekT:1.8,spr:'wisp',col:'#8080ff'},{pat:'spiral',arms:9,spin:.45,sp:64,st:'wave',col:'#c080ff',burst:9,gap:.09},{pat:'lance',cnt:5,spread:.6,sp:230,col:'#ffd060'},{pat:'gapring',cnt:32,gw:.38,sp:60,col:'#ff9040',burst:3,gap:.3}]},
  {at:.7,dur:9,name:'FOX-FIRE STORM',rate:.38});
 set('LORD KUROGANE',{rate:[.66,.64],during:'all',
  ph1:[{pat:'wall',cnt:13,sp:75,col:BC.aim},{cnt:5,spread:.5,sp:110,col:BC.aim,burst:3,gap:.15},{pat:'flower',cnt:20,sp:52,col:'#c8b890'},{pat:'gapring',cnt:24,gw:.42,sp:56,col:'#c0a040',burst:2,gap:.35}],
  half:[{pat:'wall',cnt:15,sp:82,col:BC.aim,burst:2,gap:.4},{pat:'lance',cnt:5,spread:.9,sp:240,spr:'spear',col:'#e8eef6'},{pat:'cross',dirs:6,cnt:4,sp:74,col:'#c0a040',rot:.25},{pat:'gapring',cnt:30,gw:.38,sp:60,col:'#c0a040',burst:3,gap:.3},{pat:'curtain',cnt:11,sp:88,col:BC.aim2}]},
  {at:.3,dur:9,name:'THE GENERAL\'S FURY',rate:.38});
 set('THE CORRUPT EMPEROR',{rate:[.6,.45,.7],during:'all',pick:e=>{const B=BKIT['THE CORRUPT EMPEROR'].barrage;return e.ph===3?B.ph3:e.half?B.half:B.ph1;},
  ph1:[{pat:'spiral',arms:4,spin:.3,sp:52,spr:'petal',col:'#ffd040',burst:6,gap:.12},{pat:'gapring',cnt:24,gw:.42,sp:52,col:BC.cor,burst:2,gap:.35},{cnt:5,spread:.6,sp:95,col:BC.aim,burst:2,gap:.2}],
  half:[{pat:'gapring',cnt:30,gw:.38,sp:56,col:BC.cor,burst:2,gap:.3},{pat:'spiral',arms:6,spin:.35,sp:58,spr:'petal',col:'#ffd040',burst:8,gap:.09},{pat:'flower',cnt:24,sp:52,st:'split',splitT:1,col:BC.cor2},{cnt:7,spread:.8,sp:100,col:BC.aim,burst:3,gap:.15}],
  ph3:[{pat:'gapring',cnt:30,gw:.38,sp:58,spr:'scale',col:BC.cor},{pat:'spiral',arms:6,spin:.4,sp:62,col:BC.cor2,burst:7,gap:.09},{pat:'cross',dirs:8,cnt:3,sp:74,st:'boom',bT:1.4,col:'#ffd040',rot:.25},{pat:'flower',cnt:24,sp:55,col:BC.cor}]});
}
// the Ronin Seven each throw their own small barrage while they fight
const R7BAR={JUBEI:[{pat:'gapring',cnt:14,gw:.5,sp:55,col:'#f0f0f4'},{cnt:3,spread:.3,sp:120,col:BC.aim,burst:2,gap:.15}],GONZA:[{pat:'wall',cnt:9,sp:70,col:'#9a9aa8'},{pat:'stream',cnt:4,sp:110,st:'accel',col:BC.aim}],
 HANZO:[{cnt:5,spread:.5,sp:120,spr:'arrow',col:BC.aim,burst:2,gap:.18},{pat:'curtain',cnt:7,sp:90,col:BC.aim2}],OKICHI:[{pat:'orbitring',cnt:8,ow:3,orv:34,col:BC.haz},{pat:'flower',cnt:12,sp:50,col:BC.haz}],
 TETSUGORO:[{pat:'flower',cnt:14,sp:44,st:'big',col:'#4060c0'},{pat:'gapring',cnt:16,gw:.5,sp:48,st:'big',col:'#4060c0'}],TWINS:[{pat:'stream',cnt:5,sp:100,st:'zig',col:'#ff9030'},{cnt:3,spread:.4,sp:100,col:'#ff9030'}],
 MURAMASA:[{pat:'spiral',arms:4,spin:.4,sp:58,spr:'petal',col:'#ff80c0',burst:6,gap:.1},{pat:'gapring',cnt:20,gw:.42,sp:55,spr:'petal',col:'#ff80c0'}]};

// Keep objective clocks at their existing lengths. Timed survival phases use twice
// the previous live duration (the original design durations were compressed before).
const OBJECTIVE_EVENTS=new Set(['ASHIGARU SQUAD','THE LAST STAND']);
for(const K of Object.values(BKIT)){
 if(!K.director)continue;
 if(K.event){
  const base=Math.max(10,Math.round(K.event.dur*.65)),survival=!OBJECTIVE_EVENTS.has(K.event.name);
  K.event.dur=base*(survival?2:1);K.event.survival=survival;
 }
 if(K.storm)K.storm.dur=14;
 K._evs=null;
}
// The Emperor's shrine objective keeps its timer. His new phase-three storm is a separate survival phase.
BKIT['THE CORRUPT EMPEROR'].storm={at:.27,dur:14,name:'THE IMPERIAL DELUGE',rate:.52,patterns:BKIT['THE CORRUPT EMPEROR'].barrage.ph3};
