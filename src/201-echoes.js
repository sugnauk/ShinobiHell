'use strict';
// SHINOBIDUNGEONS - GUARDIAN ECHOES. A guardian you have beaten (in any run) can return in later dungeons as an echo:
// a mini-boss among ordinary enemies, drawn as the little portrait from the boss rush page (the full boss art reduced,
// which reads beautifully at this size). It fights with a shadow of its old self:
//  - its own bullet patterns (phase one of its fight, then phase two once it is down to half and its second form shows)
//  - its own way of moving: circling, dashing along a warned line, or blinking about the room
//  - health and damage set by the stage you are on, not the stage it came from, so it is a fair fight anywhere
//  - it drops one piece of gear, with 4% legendary and 12% epic overall
// One echo at most per dungeon, in about 3 runs of 5 once you have beaten a guardian; never in its own stage, in a
// prologue, in training or in the boss rush. The room glows violet and its name shows as you come near.
ET.echo={n:'GUARDIAN ECHO',desc:'A REMNANT OF A GUARDIAN YOU HAVE BEATEN. IT FIGHTS ALONGSIDE OTHER FOES AND DROPS ONE PIECE OF GEAR',hp:400,spd:42,pos:600,r:9,ai:'dummy',rng:0,wl:0,atks:[]};
const GECHO={chance:.6,hpMul:13,tall:30,e:null,force:null,
 // the reduced portrait: the boss's full sheet scaled down whole (nearest pixel), every frame, built once
 mini:{},sprite(i,half){const b=BOSS[i],key=i+'|'+(b&&b.name)+'|'+(half?1:0);if(GECHO.mini[key])return GECHO.mini[key];
  let s;try{s=half?bossHurtSpr(i):bossSheet(i);}catch(_){s=null;}if(!s||!s.c)return null;
  const n=s.frames||Math.max(1,Math.round(s.c.width/s.fw)),sc=Math.min(1,GECHO.tall/s.fh,GECHO.tall/s.fw),fw=Math.max(1,Math.round(s.fw*sc)),fh=Math.max(1,Math.round(s.fh*sc));
  const c=mk(fw*n,fh,g=>{g.imageSmoothingEnabled=false;for(let f=0;f<n;f++)g.drawImage(s.c,f*s.fw,0,s.fw,s.fh,f*fw,0,fw,fh);});
  return GECHO.mini[key]={c,wc:whiteOf(c),fw,fh,frames:n,sc:1};},
 beaten(){
  const cleared=guardianClears(),top=Math.min(R.di,CAMPAIGN_END+1+LATE.length),result=[];
  for(let i=0;i<top;i++)if(BOSS[i]&&cleared[i+':'+BOSS[i].name])result.push(i);
  return result;
 },
 pickRoom(){
  const avoid=MOTH.e?.room;
  return pick(map.rooms.filter(r=>r.k==='room'&&r!==avoid&&['combat','elite'].includes(r.type)
   &&r.w>=9&&r.h>=9&&enemies.some(e=>e.room===r&&!e.dead&&!e.prop&&!e.boss)));
 },
 spawn(i){
  const r=GECHO.pickRoom();if(!r)return null;
  let spot;for(let n=0;n<12;n++){const p=spotIn(r);if(!blocked(p.x,p.y,9)){spot=p;break;}}
  if(!spot)return null;
  const {x,y}=spot,ref=mkEnemy('samurai',x,y,r,R.di),e=mkEnemy('echo',x,y,r,R.di);if(!e)return null;
  const hp=Math.round((ref?ref.hp:400)*GECHO.hpMul*(R.ngp?1.25:1)),spr=GECHO.sprite(i,0);
  Object.assign(e,{hp,maxhp:hp,echo:{i,name:BOSS[i].name,modes:(BMODES[i]||['circle']).slice(),st:BSTYLE[i]||BSTYLE[0],k:0,bt:1.2,mt:2.5,met:0,half:0,ang:Math.random()*TAU},sprOv:spr,elite:null,label:null,r:9,awake:false});
  enemies.push(e);GECHO.e=e;return e;},
 inRoom(e){const r=e.room;return P.x>r.x*T&&P.x<(r.x+r.w)*T&&P.y>r.y*T&&P.y<(r.y+r.h)*T;},
 short:n=>n.split(',')[0]};
// Stage I used to share its record with the prologues. Route variants also used to share stage numbers.
function guardianClears(){
 if(meta.guardianClears)return meta.guardianClears;
 const cleared=meta.guardianClears={};
 for(let i=1;i<=CAMPAIGN_END;i++)if(meta.ranks?.[i]!=null&&BOSS[i])cleared[i+':'+BOSS[i].name]=1;
 saveMeta();return cleared;
}
{const base=onBossDead;onBossDead=function(e){
 const result=base.apply(this,arguments);
 if(!e.pro&&R&&!R.pro&&!prologueLoot()&&!R.training&&!R.test&&!R.rush&&e.di<=CAMPAIGN_END+LATE.length){
  const cleared=guardianClears();cleared[e.di+':'+e.name]=1;saveMeta();
 }
 return result;
};}
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld.apply(this,arguments);GECHO.e=null;
 if(R&&!R.training&&!R.rush&&!R.test&&!R.pro&&!prologueLoot()&&map&&map.rooms){const L=GECHO.beaten();
  if(L.length&&(GECHO.force!=null||Math.random()<GECHO.chance)){const i=GECHO.force!=null&&L.includes(GECHO.force)?GECHO.force:L[Math.floor(Math.random()*L.length)];GECHO.spawn(i);}}
 return r;};}
// its fight
{const _ue=updEnemy;updEnemy=function(e,dt){_ue(e,dt);const X=e.echo;if(!X||e.dead)return;
 // it sleeps until you walk into its room
 if(!X.met){if(!GECHO.inRoom(e)){e.awake=false;return;}X.met=1;e.awake=true;sfx('boss');setToast('THE ECHO OF '+GECHO.short(X.name)+' STIRS','#c8a0ff',3);fxRing(e.x,e.y,50,'#c8a0ff',.5);}
 if(e.stag>0||e.stun>0||(e.st&&e.st.frozen>0))return;tickBarrage(e,dt);
 if(!X.half&&e.hp<e.maxhp*.5){X.half=1;e.phase=2;const s2=GECHO.sprite(X.i,1);if(s2)e.sprOv=s2;for(const q of projs)if(q.from==='e'&&q.own===e)q.dead=true;e.iv=.8;sfx('break');txtFx(e.x,e.y-20,'THE ECHO FLARES','#c8a0ff',2);fxRing(e.x,e.y,40,'#c8a0ff',.4);}
 // move the way the guardian moved
 const mode=X.modes[Math.floor(X.k/2)%X.modes.length],a=aimAt(e),d=Math.hypot(P.x-e.x,P.y-e.y);X.mt-=dt;
 if(X.dash){X.dash.t-=dt;if(X.dash.t<=0){const s=300*dt;move(e,Math.cos(X.dash.a)*s,Math.sin(X.dash.a)*s,e.r);X.dash.go-=s;if(X.dash.go<=0)X.dash=null;}return;}
 if(mode==='blink'&&X.mt<=0){X.mt=X.half?3.4:4.5;const an=Math.random()*TAU,rr=rnd(70,110),s=freeSpot(e,P.x+Math.cos(an)*rr,P.y+Math.sin(an)*rr,e.r);fxRing(e.x,e.y,14,'#c8a0ff',.25);e.x=s.x;e.y=s.y;fxRing(e.x,e.y,14,'#c8a0ff',.25);}
 else if((mode==='dashes'||mode==='chase')&&X.mt<=0&&d<170){X.mt=X.half?3:4;const len=Math.min(130,d+30);mark({k:'l',x:e.x,y:e.y,a,len,w:16,t:.6,dmg:12*e.dm,col:'#c8a0ff',src:e});X.dash={a,t:.6,go:len};return;}
 else{X.ang+=dt*.7*(mode==='circle'?1:.4);const want=mode==='chase'?70:95,tx=P.x+Math.cos(X.ang)*want,ty=P.y+Math.sin(X.ang)*want,p=freeSpot(e,tx,ty,e.r),da=Math.atan2(p.y-e.y,p.x-e.x),dd=Math.hypot(p.x-e.x,p.y-e.y);if(dd>4)steer(e,da,Math.min(dd/dt,e.spd*(X.half?1.3:1)),dt);}
 // its patterns, a shadow of the full fight
 X.bt-=dt;if(X.bt<=0){X.bt=(X.half?1.1:1.3)/(DF().bh||1);const L=(X.st.ph&&X.st.ph[X.half?1:0])||[{pat:'gapring',cnt:18,gw:.5,col:'#c8a0ff'}];X.k++;if(eShots()<110)bossBarrage(e,Object.assign({dmg:8},L[X.k%L.length]));}
 if(Math.random()<dt*8)particles.push({x:e.x+rnd(-8,8),y:e.y+rnd(-4,4),vx:rnd(-6,6),vy:-18,t:.6,col:X.half?'#e8a0ff':'#9a7aff'});};}
// drawn as a spirit: a violet glow under it, a soft flicker, and its name as you come near
{const _de=drawEnemy;drawEnemy=function(e){if(!e.echo||e.dead)return _de.apply(this,arguments);const X=sx(e.x,e.y),Y=sy(e.x,e.y);
 ctx.globalAlpha=.25+.08*Math.sin(time*4);ctx.fillStyle='#8a5ad0';ctx.beginPath();ctx.ellipse(X,Y,14,6,0,0,TAU);ctx.fill();
 ctx.globalAlpha=e.echo.met?.9+.1*Math.sin(time*9):.55;const r=_de.apply(this,arguments);ctx.globalAlpha=1;
 if(!e.echo.met&&Math.hypot(P.x-e.x,P.y-e.y)<220){const s='ECHO OF '+GECHO.short(e.echo.name);txt(s,Math.round(X-txtW(s)/2),Math.round(Y-GECHO.tall-12),'#c8a0ff');}return r;};}
// its health bar while you fight it
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);const e=GECHO.e;if(!e||e.dead||!e.echo||!e.echo.met||!GECHO.inRoom(e)||(boss&&boss.awake))return;const w=120,x=Math.round((W-w)/2),s='ECHO OF '+GECHO.short(e.echo.name);
 txt(s,x+Math.round((w-txtW(s))/2),14,'#c8a0ff');bar(x,21,w,4,e.hp/e.maxhp,'#9a6ad0','#20102a');};}
// its end: stage-scaled loot, score, and a record of the win
{const _k=killE;killE=function(e){const was=e&&e.echo&&!e.dead;_k.apply(this,arguments);if(was&&e.dead){const X=e.echo;for(const q of projs)if(q.own===e)q.dead=true;
  dropBag(e.x+10,e.y+10,ECHO_CACHE,false);addScore(1800,e.x,e.y,'#c8a0ff');
  setToast('THE ECHO OF '+GECHO.short(X.name)+' FADES','#c8a0ff',3);fxRing(e.x,e.y,50,'#c8a0ff',.6);meta.echoes=(meta.echoes||0)+1;saveMeta();GECHO.e=null;}};}
