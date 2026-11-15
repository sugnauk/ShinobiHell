'use strict';
// HELL OF THE EMPEROR - player and frame update (part of the former game.js; files load in numeric order, see index.html)
// ---------- update ----------
function updPlayer(dt){
 const p=P;{const d=screenToWorldDelta(mouse.x,mouse.y);p.aim=Math.atan2(d.y,d.x);p.face=mouse.x<W/2?-1:1;}
 for(const k of ['atkCd','dashCd','iv','flash','mik','ward','hurtIv','lockT'])p[k]=Math.max(0,(p[k]||0)-dt);
 for(const k of ['q','rmb','e','h','f'])p.ab[k]=Math.max(0,p.ab[k]-dt);
 p.pdelay-=dt;if(p.pdelay<=0)p.pos=Math.max(0,p.pos-S.maxpos*.25*dt);
 if(p.stag>0){p.stag-=dt;if(p.stag<=0)p.pos=Math.min(p.pos,S.maxpos*.3);}
 if(p.animT>0)p.animT-=dt;
 const lq=liqAt(p.x,p.y);
 const shf=!!(keys[KB.focus]||keys.ShiftRight),cmb=inCombat();if(p.combatT>0)p.combatT-=dt;p.focus=shf&&cmb;if(cmb&&p.oocRun){p.oocRun=false;}const [mx,my]=moveVec();p.sprintK=clamp((p.sprintK||0)+(p.oocRun?dt*4:-dt*8),0,1);if(p.sprintK>.5&&(mx||my)&&Math.random()<dt*14)particles.push({x:p.x-(mx||0)*4+rnd(-2,2),y:p.y-(my||0)*4+rnd(-2,2),vx:-(mx||0)*20,vy:-(my||0)*20,t:.35,col:'#9a9488'});const spd=S.spd*(p.focus?.45:1)*(1+.75*p.sprintK)*(p.haste>0?1.3:1)*(lq===1||lq===5?.72:lq===3?.85:1)*(P.webT>0?.55:1);p.mv=!!(mx||my);p.mvx=mx;p.mvy=my;
 if(p.mv&&(lq===1||lq===5)&&Math.random()<dt*8)particles.push({x:p.x+rnd(-3,3),y:p.y+rnd(-3,3),vx:0,vy:0,t:.3,col:map.env.lc[2]});
 if(p.dash>0){p.dash-=dt;move(p,p.dx*185*dt,p.dy*185*dt,4);}
 else if(p.stag<=0){move(p,mx*spd*dt,my*spd*dt,4);if(mouse.down&&p.atkCd<=0&&!hoverSlot())castBolt();if(mouse.rdown&&p.ab.h<=0&&(p.hCh>0||!(p.lockT>0))){p.hCh=(p.hCh||0)+dt;}else if(!mouse.rdown&&p.hCh>0){p.hFull=p.hCh>=HCHARGE;castHeavy();p.hCh=0;p.hFull=false;}}
}
function updPickups(dt){
 for(const k of pickups){
  k.t+=dt;if(k.vx||k.vy){const nx=k.x+k.vx*dt,ny=k.y+k.vy*dt;if(!solid(nx,ny)){k.x=nx;k.y=ny;}const f=Math.exp(-6*dt);k.vx*=f;k.vy*=f;if(Math.abs(k.vx)<1)k.vx=0;if(Math.abs(k.vy)<1)k.vy=0;}
  const d=dist(k,P),mag=(k.k!=='item'&&k.k!=='bag');
  if(k.k==='bag'){if(k.vz!==undefined&&(k.vz||k.z>0)){k.vz-=420*dt;k.z+=k.vz*dt;if(k.z<=0){k.z=0;if(k.vz<-60){k.vz=-k.vz*.35;if(!k.landed){k.landed=true;bagLand(k);}}else k.vz=0;}}
   if(k.pop>0)k.pop-=dt;if(k.z>0)continue;
   if(d<12&&k.t>.3&&!k.seen){k.seen=true;lootBag(k);}else if(d>16)k.seen=false;continue;}
  if(mag&&k.t>.35&&d<S.magnet){const a=angTo(k,P),s=140;k.x+=Math.cos(a)*s*dt;k.y+=Math.sin(a)*s*dt;}
  if(d<9&&k.t>.2){
   if(k.k==='sen'){R.sen+=k.v;sfx('coin');}
   else if(k.k==='heart'){P.hp=Math.min(S.maxhp,P.hp+k.v);txtFx(P.x,P.y,'+'+k.v,'#6f6');sfx('pickup');}
   else if(k.k==='pot'){if(R.pots<POTMAX){R.pots++;txtFx(P.x,P.y,'+HP POTION','#50e060');}else{P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.15);txtFx(P.x,P.y,'+HP','#50e060');}sfx('pickup');}
   else if(k.k==='gourd'){R.pots=Math.min(POTMAX,R.pots+1);sfx('pickup');}
   else if(k.k==='item'){applyItem(k.id);sfx('pickup');}
   k.dead=true;
  }
 }
 pickups=pickups.filter(k=>!k.dead);
}
// near miss: brushing past an enemy shot shaves ability cooldowns and pays a little sen
// dashing just as a shot is about to hit: slow-motion, dash refund, nearby shots shatter, next attack empowered
// out of combat = nothing awake nearby, no enemy shots close, no recent hits or casts, no room event running
const DASHROW=3; // dashes in a row needed to trigger the out-of-combat speed boost
function frontierNear(){const px=P.x/T|0,py=P.y/T|0;for(let j=-12;j<=12;j++)for(let i=-12;i<=12;i++){const x=px+i,y=py+j;if(x<0||y<0||x>=MW||y>=MH||i*i+j*j>144)continue;const k=y*MW+x;if(map.t[k]&&!map.expl[k])return true;}return false;}
function inCombat(){if(!P)return false;if(P.combatT>0)return true;if(boss&&boss.awake&&!boss.dead)return true;
 for(const e of enemies)if(!e.dead&&e.awake&&Math.abs(e.x-P.x)+Math.abs(e.y-P.y)<260)return true;
 for(const q of projs)if(q.from==='e'&&Math.abs(q.x-P.x)+Math.abs(q.y-P.y)<200)return true;
 return map.rooms.some(r=>r.ev&&r.ev.state===1);}
function perfectDodge(){let hit=false;for(const q of projs){if(q.from!=='e'||q.dead)continue;const dx=P.x-q.x,dy=P.y-q.y,d=Math.hypot(dx,dy);if(d<q.r+16&&(q.vx*dx+q.vy*dy>0||d<q.r+7)){hit=true;break;}}
 if(!hit)return;trainEv('dodge');trainEv('perfect');
 if(upLv('flow')){P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.03*upLv('flow'));txtFx(P.x,P.y-8,'+HP','#50e060');} // PERFECT FORM (skill tree)P.dashCd=0;P.iv=Math.max(P.iv,.45);P.mik=1.5;R.pdodge=(R.pdodge||0)+1;
 for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-P.x,q.y-P.y)<30){q.dead=true;spark(q.x,q.y,'#cef',3,40);}
 for(const k of ['q','f','rmb'])if(P.ab[k]>0)P.ab[k]=Math.max(0,P.ab[k]-.6);
 txtFx(P.x,P.y,'PERFECT DODGE','#cef');fxRing(P.x,P.y,30,'#cef',.35);flashT=Math.max(flashT,.08);flashCol='#cef';sfx('deflect');}
function graze(q){R.grazes=(R.grazes||0)+1;for(const k of ['q','f','e','rmb'])if(P.ab[k]>0)P.ab[k]=Math.max(0,P.ab[k]-.15);if(R.grazes%5===0)R.sen+=1;
 particles.push({x:(q.x+P.x)/2,y:(q.y+P.y)/2,vx:0,vy:-20,t:.3,col:'#fff'});if(grazeCd<=0){grazeCd=.08;sfx('graze');}if(R.grazes%25===0)txtFx(P.x,P.y,'GRAZE X'+R.grazes,'#cef');}
function splitShot(q){for(let i=0;i<6;i++){const a=i/6*TAU+Math.random()*.5;projs.push(mkProj('e',q.x,q.y,a,62,q.dmg*.6,{own:q.own,col:q.col,r:2,pd:6,st:'star'}));}spark(q.x,q.y,q.col,6,50);}
function stepStyle(q,dt){
 switch(q.st){
  case 'wave':{q.wt+=dt;const sp=Math.hypot(q.vx,q.vy)||1,ux=q.vx/sp,uy=q.vy/sp,w=Math.cos(q.wt*q.wf)*q.wa*dt*q.wf*.25;q.x+=-uy*w;q.y+=ux*w;break;}
  case 'accel':{const sp=Math.hypot(q.vx,q.vy);if(sp<q.cap){const k=1+q.acc*dt;q.vx*=k;q.vy*=k;}break;}
  case 'curve':{const c=Math.cos(q.curve*dt),s=Math.sin(q.curve*dt),vx=q.vx*c-q.vy*s;q.vy=q.vx*s+q.vy*c;q.vx=vx;break;}
  case 'boom':{q.bt+=dt;const f=Math.cos(Math.PI*Math.min(1,q.bt/q.bT));q.vx=Math.cos(q.bd)*q.bs*f;q.vy=Math.sin(q.bd)*q.bs*f;break;}
  case 'split':{q.splitT-=dt;if(q.splitT<=0){splitShot(q);q.dead=true;}break;}
  case 'mine':{q.fuse-=dt;if(q.fuse<=0){for(let i=0;i<8;i++)projs.push(mkProj('e',q.x,q.y,i/8*TAU+.2,58,q.dmg,{own:q.own,col:q.col,r:3,pd:8}));spark(q.x,q.y,q.col,10,70);q.dead=true;}break;}
  // newer behaviours
  case 'seek':{if(q.seekT>0&&P){q.seekT-=dt;const cur=Math.atan2(q.vy,q.vx),df=clamp(angDiff(Math.atan2(P.y-q.y,P.x-q.x),cur),-q.turn*dt,q.turn*dt),sp=Math.hypot(q.vx,q.vy);q.vx=Math.cos(cur+df)*sp;q.vy=Math.sin(cur+df)*sp;}break;}
  case 'orbit':{q.oa+=q.ow*dt;q.or+=q.orv*dt;q.x=q.ox+Math.cos(q.oa)*q.or;q.y=q.oy+Math.sin(q.oa)*q.or;q.vx=q.vy=0;break;}
  case 'zig':{q.zt+=dt;if(q.zt>=q.zT){q.zt=0;q.zs=-q.zs;const a=q.zA*q.zs*(q.zfirst?1:2),c=Math.cos(a),s=Math.sin(a),vx=q.vx*c-q.vy*s;q.vy=q.vx*s+q.vy*c;q.vx=vx;q.zfirst=0;}break;}
  case 'lance':{if(q.wait>0){q.wait-=dt;q.vx=q.vy=0;if(q.wait<=0){q.vx=q.lvx;q.vy=q.lvy;}}break;}
  // stick: flies a set distance then hangs in the air (spider silk strands that wall you in for a few seconds)
  case 'stick':{if(q.sd>0){q.sd-=Math.hypot(q.vx,q.vy)*dt;if(q.sd<=0){q.vx=q.vy=0;q.stuck=1;}}break;}
 }}
function updProjs(dt){
 for(const q of projs){
  if(q.from==='e'&&freezeT>0)continue;
  if(q.cut){for(const o of projs)if(o.from==='e'&&!o.peril&&!o.dead&&Math.hypot(o.x-q.x,o.y-q.y)<q.r+o.r+3){o.dead=true;spark(o.x,o.y,q.col,3,40);}}
  if(q.rare&&Math.random()<dt*40)particles.push({x:q.x,y:q.y,vx:rnd(-10,10),vy:rnd(-10,10),t:.25,col:q.col});
  if(q.home){let tg=null,bd=q.rare?150:110;for(const e of enemies){if(e.dead||e.air)continue;const d=dist(e,q);if(d<bd){bd=d;tg=e;}}if(tg){const cur=Math.atan2(q.vy,q.vx),df=clamp(angDiff(angTo(q,tg),cur),-5*dt,5*dt),sp=Math.hypot(q.vx,q.vy);q.vx=Math.cos(cur+df)*sp;q.vy=Math.sin(cur+df)*sp;}}
  if(q.st)stepStyle(q,dt);if(q.dead)continue;
  q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;
  if(q.life<=0){if(q.st==='split')splitShot(q);if(q.pool)hz.push({x:q.x,y:q.y,r:q.pool.r||12,t:q.pool.t||3.5,dps:q.pool.dps||10,col:q.pool.col||q.col});q.dead=true;continue;}
  if(solid(q.x,q.y)){
   // bouncing shots ricochet off walls a couple of times
   if(q.st==='bounce'&&q.bn>0){q.bn--;q.x-=q.vx*dt;q.y-=q.vy*dt;const hx=solid(q.x+q.vx*dt,q.y),hy=solid(q.x,q.y+q.vy*dt);if(hx)q.vx*=-1;if(hy)q.vy*=-1;if(!hx&&!hy){q.vx*=-1;q.vy*=-1;}spark(q.x,q.y,q.col,2,30);continue;}
   q.dead=true;spark(q.x,q.y,q.col,3,30);continue;}
  if(q.from==='e'){
   // bullets test against a small round core measured on SCREEN, exactly where the core dot is drawn,
   // so hats, staffs and bows never count and what you see is what hits you
   const sd=scrDist(q),hr=P.focus?HITR_FOCUS:HITR;
   if(!q.grazed&&sd<q.r+(P.focus?12:10)&&sd>=q.r+hr&&P.iv<=0&&P.dash<=0){q.grazed=true;graze(q);}
   if(sd<q.r+hr){const res=hitPlayer(q.dmg*ESHOT_DMG,q.x,q.y,{src:q.own,pd:q.pd,peril:q.peril,bullet:true});
    if(res==='perfect'&&(P.wardRef=(P.wardRef||0)+1)>6){q.dead=true;}else if(res==='perfect'){q.from='p';const o=q.own;const a=o&&!o.dead?angTo(q,o):Math.atan2(-q.vy,-q.vx);const sp=Math.hypot(q.vx,q.vy)*1.5;q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp;q.dmg=q.dmg*.6+S.atk*.8;q.pd=30;q.pierce=0;q.hit=new Set();q.life=2;q.col='#fff';}
    else if(res!=='dodge')q.dead=true;}
  }else{
   for(const e of enemies){if(e.dead||e.air||q.hit.has(e))continue;if(dist(q,e)<q.r+e.r){q.hit.add(e);let dm=q.dmg,pd=q.pd;if(e.shield&&e.stag<=0&&Math.abs(angDiff(angTo(e,q),e.fa||0))<1.1){dm*=.15;pd*=1.5;spark(q.x,q.y,'#aaf',4,50);}hurtE(e,dm,pd,{slash:!!q.main,kb:Math.atan2(q.vy,q.vx),el:q.el,src:q.src||null});if(--q.pierce<0){q.dead=true;break;}}}
  }
 }
 projs=projs.filter(q=>!q.dead);
}
function updPlay(dt){
 R.time+=dt;if(R.training)updTraining(dt);if(P.evoT>0)P.evoT-=dt;updPlayer(dt);updWorld(dt);updRoomEvents(dt);updAmbient(dt);
 if(freezeT<=0)for(const e of enemies){if(e.dead)continue;if(!e.boss&&dist(e,P)>300)continue;updEnemy(e,dt);}
 for(let i=0;i<enemies.length;i++){const a=enemies[i];if(a.dead||!a.awake||a.air)continue;for(let j=i+1;j<enemies.length;j++){const b=enemies[j];if(b.dead||!b.awake||b.air)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;if(d>0&&d<m){const push=(m-d)*.5;if(!a.act){move(a,-dx/d*push,-dy/d*push,a.r);}if(!b.act){move(b,dx/d*push,dy/d*push,b.r);}}}}
 enemies=enemies.filter(e=>!e.dead);
 updProjs(dt);updPickups(dt);
 if(flashT>0)flashT-=dt;if(P.aegis>0)P.aegis-=dt;
 for(const f of fx){if(f.wait>0){f.wait-=dt;continue;}f.t-=dt;castSrc=f.src||null;if(f.k==='ult'&&f.t<=0&&!f.done){f.done=true;ultBlast(f);}if(f.k==='strike'&&!f.done){f.done=true;smite(f);}}castSrc=null;fx=fx.filter(f=>f.t>0||f.wait>0);
 for(const q of particles){q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;const f=Math.exp(-5*dt);q.vx*=f;q.vy*=f;}particles=particles.filter(q=>q.t>0);
 for(const t of texts)t.t-=dt;texts=texts.filter(t=>t.t>0);
 toast.t-=dt;
 if(portal)portal.t+=dt;
 // revealing new floor counts as exploring: the out-of-combat speed boost only works on ground you've already seen
 {const px=P.x/T|0,py=P.y/T|0;let nw=0;for(let j=-11;j<=11;j++)for(let i=-11;i<=11;i++){const x=px+i,y=py+j;if(x>=0&&y>=0&&x<MW&&y<MH&&i*i+j*j<=121){const k=y*MW+x;if(!map.expl[k]){map.expl[k]=1;if(map.t[k])nw++;}}}if(nw>0&&P.oocRun&&R.time>.5){P.oocRun=false;txtFx(P.x,P.y,'EXPLORING','#aaa');}}
 shake=Math.max(0,shake-dt*20);
 if(hurtT>0)hurtT-=dt;if(P.hp<S.maxhp*.25&&P.hp>0){beatT-=dt;if(beatT<=0){beatT=.85;sfx('beat');lowPulse=.3;}}if(lowPulse>0)lowPulse-=dt;
 if(grazeCd>0)grazeCd-=dt;
}
let slowT=0,hurtT=0,beatT=0,lowPulse=0,introT=0,introE=null,grazeCd=0;const INTRO=2.6;
function update(dt){
 time+=dt;musicTick();if(meta.opt.dbg&&mode==='play'&&!paused)updDbg(dt);
 if(mode==='play'){if(P&&P.dying>0){updDeath(dt);return;}if(paused||invOpen)return;if(introT>0){introT-=dt;return;}if(slowT>0){slowT-=dt;dt*=.35;}if(hitstop>0){hitstop-=dt;return;}updPlay(dt);}
 else if(mode==='choose'){for(const t of texts){t.t-=dt;}}
}
