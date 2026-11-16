'use strict';
// HELL OF THE EMPEROR - enemy AI (part of the former game.js; files load in numeric order, see index.html)
// ---------- enemy AI ----------
function steer(e,ang,sp,dt){sp*=(e.slow||1);const offs=[0,.7*e.sdir,-.7*e.sdir,1.4*e.sdir,-1.4*e.sdir];for(const o of offs){const a=ang+o,nx=Math.cos(a)*sp*dt,ny=Math.sin(a)*sp*dt;if(!blocked(e.x+nx,e.y+ny,e.r)){e.x+=nx;e.y+=ny;return true;}}e.sdir*=-1;return false;}
function startAct(e,a){e.act=Object.assign({},a,{t:0,ph:0,hit:0,ang:angTo(e,P),did:false,moved:0});}
function endAct(e){e.act=null;e.tele=0;e.cd=e.boss?rnd(e.t.cdMin||.6,e.t.cdMax||1.2):rnd(e.t.cdMin||.7,e.t.cdMax||1.5)*.5;}
function stepAct(e,dt){
 const a=e.act;a.t+=dt;
 switch(a.n){
  case 'slash':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t<a.w*.75)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;a.hit++;e.tele=0;
     move(e,Math.cos(a.ang)*6,Math.sin(a.ang)*6,e.r);
     fx.push({k:'slash',x:e.x,y:e.y,a:a.ang,arc:a.arc*Math.PI/180,r:a.range,t:.15,dur:.15,col:a.peril?'#f44':'#fb8'});
     if(dist(e,P)<a.range+5&&Math.abs(angDiff(angTo(e,P),a.ang))<a.arc*Math.PI/360)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});}}
   else if(a.ph===1){if(a.hit<a.hits){if(a.t>=(a.w2||.3)*.6){a.ph=0;a.t=0;a.w=a.w2||.3;}}else if(a.t>=a.rec)endAct(e);}
   break;
  case 'thrust':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t<a.w*.75)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;}}
   else if(a.ph===1){const mv=a.sp*dt*(e.slow||1),ox=e.x,oy=e.y;move(e,Math.cos(a.ang)*mv,Math.sin(a.ang)*mv,e.r);a.moved+=mv;
     if(!a.did&&dist(e,P)<e.r+6){a.did=true;hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});}
     if(a.moved>=a.dist||(Math.abs(e.x-ox)<.01&&Math.abs(e.y-oy)<.01)){a.ph=2;a.t=0;}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'slam':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;fxRing(e.x,e.y,a.rad,a.peril?'#f44':'#fb8',.3);shake=Math.max(shake,4);spark(e.x,e.y,'#a98',10,80);
     if(dist(e,P)<a.rad)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});
     if(a.rocks)for(let i=0;i<a.rocks;i++)projs.push(mkProj('e',e.x,e.y,i/a.rocks*TAU+rnd(0,.3),65,a.dmg*.45*e.dm,{own:e,col:'#a98',pd:10,r:3}));
     if(a.sd)killE(e);}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'shoot':
   if(a.ph===0){e.tele=1;if(a.line&&a.t<a.w*.75)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;a.rep=1;e.tele=0;enemyShoot(e,a,a.line?a.ang:angTo(e,P));}}
   else if(a.rep<a.reps){if(a.t>=a.gap){a.t=0;a.rep++;enemyShoot(e,a,angTo(e,P));}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'charge':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t<a.w*.8)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;}}
   else if(a.ph===1){const mv=a.sp*dt*(e.slow||1),ox=e.x,oy=e.y;move(e,Math.cos(a.ang)*mv,Math.sin(a.ang)*mv,e.r);
     if(a.trail){a.tr=(a.tr||0)+mv;if(a.tr>=12){a.tr=0;hz.push({x:e.x,y:e.y,r:9,t:3.5,dps:12*e.dm,col:a.trail});}}
     if(!a.did&&dist(e,P)<e.r+7){a.did=true;hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});}
     const stuck=Math.abs(e.x-ox)<.01&&Math.abs(e.y-oy)<.01;
     if(a.t>=a.dur||stuck){if(stuck){e.posture+=20;shake=Math.max(shake,4);spark(e.x,e.y,'#aaa',8,60);}a.ph=2;a.t=0;}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'leap':
   if(a.ph===0){e.tele=1;if(a.t<a.w*.6){a.tx=P.x;a.ty=P.y;}if(a.t>=a.w){a.ph=1;a.t=0;a.sx=e.x;a.sy=e.y;e.air=true;e.tele=0;if(a.tx===undefined){a.tx=P.x;a.ty=P.y;}}}
   else if(a.ph===1){const k=Math.min(1,a.t/a.air),nx=a.sx+(a.tx-a.sx)*k,ny=a.sy+(a.ty-a.sy)*k;if(!blocked(nx,ny,e.r)){e.x=nx;e.y=ny;}e.z=Math.sin(k*Math.PI)*26;
     if(k>=1){e.air=false;e.z=0;fxRing(e.x,e.y,a.rad,a.peril?'#f44':'#fb8',.3);shake=Math.max(shake,6);spark(e.x,e.y,'#a98',12,90);if(dist(e,P)<a.rad)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd||0});a.ph=2;a.t=0;}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'summon':
   if(a.ph===0){e.tele=1;if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;const alive=enemies.filter(o=>!o.dead&&!o.boss).length;if(alive<8){for(let i=0;i<a.cnt;i++){const ty=a.types[i%a.types.length],an=i/a.cnt*TAU,x=e.x+Math.cos(an)*26,y=e.y+Math.sin(an)*26;if(blocked(x,y,5))continue;const m=mkEnemy(ty,x,y,e.room,R.di);m.awake=true;enemies.push(m);spark(x,y,'#c8f',8,60);}}sfx('boss');}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'storm': // delayed ground strikes around the player
   if(a.ph===0){e.tele=1;if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;for(let i=0;i<a.cnt;i++){const an=Math.random()*TAU,r=i===0?0:rnd(15,a.spread),dl=a.delay+i*.08;dh.push({x:P.x+Math.cos(an)*r,y:P.y+Math.sin(an)*r,r:a.rad,t:dl,dur:dl,dmg:a.dmg*e.dm,col:a.col});}sfx('tool');}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'blink': // teleport behind the player, short pause, then slash
   if(a.ph===0){e.tele=1;if(a.t>=a.w){e.tele=0;const an=angTo(P,e)+Math.PI+rnd(-.6,.6),nx=P.x+Math.cos(an)*16,ny=P.y+Math.sin(an)*16;if(!blocked(nx,ny,e.r)){spark(e.x,e.y,'#c8f',8,60);e.x=nx;e.y=ny;spark(nx,ny,'#c8f',8,60);}a.ang=angTo(e,P);a.ph=1;a.t=0;}}
   else if(a.ph===1){if(a.t>=.2){a.ph=2;a.t=0;fx.push({k:'slash',x:e.x,y:e.y,a:a.ang,arc:a.arc*Math.PI/180,r:a.range,t:.15,dur:.15,col:'#c8f'});if(dist(e,P)<a.range+5)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,pd:a.pd});}}
   else if(a.t>=a.rec)endAct(e);
   break;
 }
}
function pickAtk(e,d){const list=e.boss?e.kit:e.t.atks;const ok=list.filter(k=>d>=(k.dmin||0)&&d<=(k.dmax||999));return wpick(ok.length?ok:list);}
function updEnemy(e,dt){
 e.flash=Math.max(0,e.flash-dt);e.iv=Math.max(0,e.iv-dt);if(e.kick)e.kick.t-=dt;if(e.blind>0)e.blind-=dt;e.rcd=Math.max(0,(e.rcd||0)-dt);
 if(e.st){const st=e.st;let dps=0;
  if(st.burn>0){st.burn-=dt;dps+=st.bdps*(st.poison>0?1.5:1);if(Math.random()<dt*12)particles.push({x:e.x+rnd(-3,3),y:e.y+rnd(-3,3),vx:0,vy:-25,t:.3,col:'#f80'});}else st.bdps=0;
  if(st.poison>0){st.poison-=dt;dps+=st.pdps*(st.burn>0?1.5:1);if(Math.random()<dt*8)particles.push({x:e.x+rnd(-3,3),y:e.y+rnd(-3,3),vx:0,vy:-15,t:.4,col:'#8c4'});}else st.pdps=0;
  if(st.shock>0){st.shock-=dt;if(Math.random()<dt*6)particles.push({x:e.x+rnd(-4,4),y:e.y+rnd(-4,4),vx:rnd(-30,30),vy:rnd(-30,30),t:.15,col:'#ff4'});}
  if(st.chillT>0){st.chillT-=dt;if(st.chillT<=0)st.chillS=0;}
  if(dps>0){e.hp-=dps*dt;if(e.hp<=0){killE(e);return;}}
  if(st.frozen>0){st.frozen-=dt;return;}
 }
 e.slow=Math.min(e.zs||1,(e.st&&e.st.chillT>0)?.85-.15*e.st.chillS:1);e.zs=1;{const lq=liqAt(e.x,e.y);if(lq===1||lq===5)e.slow*=.78;}
 if(e.kx||e.ky){move(e,e.kx*dt,e.ky*dt,e.r);const f=Math.exp(-9*dt);e.kx*=f;e.ky*=f;if(Math.abs(e.kx)<2)e.kx=0;if(Math.abs(e.ky)<2)e.ky=0;}
 if(e.stag>0){e.stag-=dt;if(e.stag<=0){e.posture=0;}return;}
 if(e.stun>0){e.stun-=dt;return;}
 e.pdelay-=dt;if(e.pdelay<=0)e.posture=Math.max(0,e.posture-e.maxPosture*.22*dt);
 const d=dist(e,P);
 if(!e.awake){if(e.boss){const r=e.room;if(P.x>r.x*T&&P.x<(r.x+r.w)*T&&P.y>r.y*T&&P.y<(r.y+r.h)*T){e.awake=true;sfx('boss');introT=INTRO;introE=e;}}else if(d<110)wake(e);if(!e.awake)return;}
 if(e.boss){
  // leave the arena for 1.5s and the boss disengages: it returns to its post fully healed and the fight starts over
  {const r=e.room,m=8,inR=P.x>r.x*T-m&&P.x<(r.x+r.w)*T+m&&P.y>r.y*T-m&&P.y<(r.y+r.h)*T+m;
   if(!inR&&!e.dying){e.outT=(e.outT||0)+dt;if(e.outT>1.5){bossReset(e);return;}}else e.outT=0;}
  // scripted bosses run their own phases, events (survival / minion waves / both) and arena mechanics
  if(BKIT[e.name]&&bossKitTick(e,dt,d))return;
  const f=e.hp/e.maxhp;
  // three phases for every boss (2 at 60% HP, 3 at 30%), each named and with its own barrage set
  const BT=bsty(e).t,bc=bsty(e).c;
  if(e.phase===1&&f<.6){e.phase=2;e.kit=e.b.k2;e.act=null;e.tele=0;e.iv=.9;e.posture=0;txtFx(e.x,e.y,BT[1],bc,2);fxRing(e.x,e.y,70,bc,.5);shake=8;sfx('boss');}
  else if(e.phase===2&&f<.3){e.phase=3;e.kit=e.b.k3||e.b.k2;e.act=null;e.tele=0;e.iv=.9;e.posture=0;txtFx(e.x,e.y,BT[2],bc,2);fxRing(e.x,e.y,80,bc,.5);shake=10;sfx('boss');}
  // each new phase: a shielded storm of the boss's own patterns, then faster attacks
  // each new phase opens with a SURVIVAL phase: the boss is invulnerable and stationary at the arena centre,
  // unleashing its whole barrage set plus telegraphed rain for 8s (phase 2) / 10s (phase 3). Just stay alive.
  if(e.phase!==e.lastPh){if(e.lastPh){e.t=Object.assign({},e.t,e.phase===2?{cdMin:.45,cdMax:.95}:{cdMin:.32,cdMax:.7});
   {const sv=e.phase===2?16:20;e.storm=sv;e.stormMax=sv;e.iv=sv;e.stT=.6;e.rainT=1.2;
    for(const q of projs)if(q.from==='e')q.dead=true;setToast('SURVIVE! '+BT[e.phase-1],bc,3);}}e.lastPh=e.phase;}
  if(e.storm>0){e.storm-=dt;e.stT-=dt;e.rainT-=dt;e.act=null;e.tele=0;e.kx=e.ky=0;e.iv=Math.max(e.iv,.1);tickBarrage(e,dt);
   e.x+=(e.hx-e.x)*Math.min(1,dt*3);e.y+=(e.hy-e.y)*Math.min(1,dt*3);
   if(e.stT<=0){e.stT=e.phase>=3?.4:.5;const L=bsty(e).ph[Math.min(2,e.phase-1)];bossBarrage(e,L[(e.stN=(e.stN||0)+1)%L.length]);}
   if(e.rainT<=0){e.rainT=e.phase>=3?1.3:1.7;enemyShoot(e,{pat:'rain',cnt:3+e.phase,rad:18,col:bc,dmg:10,sp:0,cnt0:1},0);}
   if(e.storm<=0){e.iv=0;setToast(BT[e.phase-1]+' - STRIKE NOW!',bc,2);}
   if(Math.random()<dt*20)spark(e.x,e.y,bc,2,40);return;}
  // enrage after two and a half minutes
  e.fightT=(e.fightT||0)+dt;if(e.fightT>150&&!e.enraged){e.enraged=true;e.dm*=1.3;e.t=Object.assign({},e.t,{cdMin:e.t.cdMin*.7,cdMax:e.t.cdMax*.7});setToast(e.name+' IS ENRAGED','#f33',3);}
 }
 e.cd-=dt;
 if(e.shield)e.fa=angTo(e,P);
 if(e.elite==='regen')e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.025*dt);
 if(e.elite==='summoner'){e.sumT-=dt;if(e.sumT<=0&&!e.act){e.sumT=6;if(enemies.filter(o=>!o.dead).length<40)for(let i=0;i<2;i++){const an=rnd(0,TAU),x=e.x+Math.cos(an)*22,y=e.y+Math.sin(an)*22;if(blocked(x,y,4))continue;const m=mkEnemy('wisp',x,y,e.room,R.di);m.awake=true;enemies.push(m);spark(x,y,'#c8f',8,60);}}}
 if(e.act){stepAct(e,dt);return;}
 const a=angTo(e,P),t=e.t;
 if(t.ai==='dummy'){e.kx=e.ky=0;return;}
 if(t.ai==='turret'){e.kx=e.ky=0;e.tt=(e.tt==null?1:e.tt)-dt;if(e.tt<=0&&e.tPat){e.tt=e.tRate||1;enemyShoot(e,Object.assign({},e.tPat),a);}return;}
 if(e.boss){
  if(bossModes(e,dt,d,a))return;
  if(e.cd<=0){startAct(e,pickAtk(e,d));return;}
  const pref=Math.max(e.pref,bossGap(e));
  if(d>pref)steer(e,a,e.spd,dt);else if(d<pref*.75)steer(e,a+Math.PI,e.spd*.7,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.6,dt);
  return;
 }
 if(t.volley&&!e.boss){e.vcd=(e.vcd==null?rnd(.2,1):e.vcd)-dt;if(e.cd<=0&&e.vcd<=0&&d>t.rng*.5&&d<175){e.vcd=rnd(.75,1.4);startAct(e,t.volley);return;}}
 if(!e.boss&&!t.volley&&t.ai!=='bomber'){e.pcd=(e.pcd==null?rnd(.3,1.2):e.pcd)-dt;if(e.pcd<=0&&d<170){e.pcd=rnd(1.6,2.6);const k=(e.pk=(e.pk||0)+1)%3;enemyShoot(e,k===0?{pat:'gapring',cnt:12+e.di,gw:.5,sp:55,dmg:8,pd:6,col:'#f9a'}:k===1?{cnt:3,spread:.3,sp:90,dmg:8,pd:6,col:'#fc8'}:{pat:'spiral',arms:3,spin:.5,sp:60,dmg:8,pd:6,col:'#c9f'},a);}}
 if(t.ai==='melee'){if(e.cd<=0&&d<=t.rng){startAct(e,pickAtk(e,d));return;}if(d>t.rng*.7)steer(e,a,e.spd,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.5,dt);}
 else if(t.ai==='ranged'){if(e.cd<=0&&d<t.rng){startAct(e,pickAtk(e,d));return;}if(d<t.keep-15)steer(e,a+Math.PI,e.spd,dt);else if(d>t.keep+25)steer(e,a,e.spd,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.6,dt);}
 else if(t.ai==='bomber'){if(e.cd<=0&&d<=t.rng){startAct(e,pickAtk(e,d));return;}steer(e,a+Math.sin(time*7+e.wob)*.4,e.spd,dt);}
 else{if(e.cd<=0&&d<t.rng){startAct(e,pickAtk(e,d));return;}steer(e,a+Math.sin(time*5+e.wob)*.6,e.spd,dt);}
}
