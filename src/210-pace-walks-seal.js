'use strict';
// SHINOBIDUNGEONS 0.8.17 - pace, walks and sealed arenas.
//  1. PACE: every hero moves 12% faster (after every class, relic, tree and daily modifier). Foes keep their speed,
//     so dodging is snappier without the fights getting harder. Dash is unchanged.
//  2. WALKS: a hero's walk cycle advances with the ground actually covered (feet no longer slide at the new pace, when
//     slowed or hasted); the guardians that had no walk cycle now step (Akagane, Kageyama, the two Ruri wardens), glide
//     (Kurogane on foot, Hoshiyomi, Getsurei, the Emperor) or hover (the Moth Queen, the Hitobashira) as they move.
//  3. SEALED ARENAS: when a guardian wakes, a gate of iron bars rises across the arena's mouth and stays shut until it
//     falls (or the fight resets). Nothing walks, blinks or shoots through it.

// ---------------------------------------------------------------- 1. pace
const HERO_PACE=1.12;
{const _cs=calcStats;calcStats=function(){const s=_cs.apply(this,arguments);if(s&&s.spd)s.spd*=HERO_PACE;return s;};}
// the walk cycle steps with the distance covered: 10 frames per 87px (the base pace), whatever the speed
{const _up=updPlayer;updPlayer=function(dt){const p=P,x=p?p.x:0,y=p?p.y:0;const r=_up.apply(this,arguments);
 if(p){const d=Math.hypot(p.x-x,p.y-y);if(p.mv&&d>0&&d<20)p._wph=((p._wph||0)+d*10/87)%40;}return r;};}

// ---------------------------------------------------------------- 2. guardian walks
// addWalk(name, arms, step1, step2): two walking poses built on the resting pose (arms swing opposite to the step), and
// a picker that shows them while the guardian moves - never during an attack, an event, a phase change or a flinch,
// where its own picker or attack animation stays in charge.
const WALKED=[];
function addWalk(name,arms,s1,s2){const D=BART[name];if(!D||!D.posed)return;const PS=D.posed,P0=PS.poses,base=P0.idle0||{};
 const P2=(a,dx,dy)=>[a[0]+dx,a[1]+dy],sw=(A,k)=>A?[A[0],P2(A[1],2*k,0),P2(A[2],3*k,-k)]:undefined;
 const mk=(k,s)=>{const q=Object.assign({},base,s);if(arms){if(arms[0])q.far=sw(arms[0],k);if(arms[1])q.near=sw(arms[1],-k);}return q;};
 P0.walk1=mk(1,s1);P0.walk2=mk(-1,s2);
 const old=PS.pick;PS.pick=(e,idx)=>{const busy=e.phx||e.A||e.EV||e.storm>0||(time-(e._hitT||-9)<.12&&idx.hurt!=null);
  if(!busy&&(e._spd||0)>8&&idx.walk1!=null)return Math.floor((e._wf||0)*2)%2?idx.walk1:idx.walk2;
  return old?old(e,idx):null;};
 WALKED.push(name);}
try{
 // stepping
 addWalk('AKAGANE, THE RED OX',null,{legs:'run1'},{legs:'run2',b:1});
 GARMS['KAGEYAMA, THE TOWER CAPTAIN']=[[[27,29],[21,38],[19,46]],[[45,29],[50,38],[49,46]]];guardianPoses('KAGEYAMA, THE TOWER CAPTAIN');WALKED.push('KAGEYAMA');
 if(typeof GLASS!=='undefined')addWalk(GLASS.name,null,{step:1,b:1},{step:-1,b:0});
 if(typeof KILN!=='undefined')addWalk(KILN.name,null,{step:1,b:1},{step:-1,b:0});
 // gliding: the robe sways, the body bobs, the arms swing
 addWalk('KUROGANE ON FOOT',[[[28,40],[23,51],[27,60]],[[56,40],[62,50],[64,60]]],{flare:2,dx:1},{flare:0,dx:-1,b:1});
 addWalk('HOSHIYOMI, THE STAR READER',[[[27,28],[21,36],[22,44]],null],{dx:1},{dx:-1,b:1});
 addWalk('GETSUREI, THE ECLIPSE PRIESTESS',[[[28,28],[24,37],[27,44]],[[44,28],[49,36],[47,44]]],{dx:1,spin:.3},{dx:-1,b:1,spin:.6});
 {const E=BART['THE CORRUPT EMPEROR'];if(E&&E.posed){const P0=E.posed.poses;P0.walk1=Object.assign({},P0.idle0||{},{dx:1,b:0});P0.walk2=Object.assign({},P0.idle0||{},{dx:-1,b:1});WALKED.push('EMPEROR');}}
 // hovering: a slow drift up and down
 addWalk('THE MOTH QUEEN',[[[41,29],[37,38],[42,44]],[[55,29],[60,38],[54,44]]],{dy:-2},{dy:0,b:1});
 addWalk('THE HITOBASHIRA',[[[29,29],[25,34],[27,38]],[[43,29],[48,34],[50,38]]],{dy:-2},{dy:0,b:1});
}catch(err){console.warn('walks',err);}
// sheets built before this file (if any) are rebuilt with the new poses
try{if(typeof BOSSSPR!=='undefined')BOSSSPR.fill&&BOSSSPR.fill(null);if(typeof HURTSPR!=='undefined')for(const k in HURTSPR)delete HURTSPR[k];if(typeof BSHEETC!=='undefined')for(const k in BSHEETC)delete BSHEETC[k];}catch(_){}

// ---------------------------------------------------------------- 3. the sealed arena
const BSEAL={on:false,tiles:[],room:null,col:'#ff5050'};
const bsInRect=(r,tx,ty)=>tx>=r.x&&tx<r.x+r.w&&ty>=r.y&&ty<r.y+r.h;
// the nearest open spot inside the arena, a tile in from its edge
function bsInside(r,x,y){let best=null,bd=1e9;for(let ty=r.y+1;ty<r.y+r.h-1;ty++)for(let tx=r.x+1;tx<r.x+r.w-1;tx++){if(!map.t[ty*MW+tx])continue;const wx=tx*T+8,wy=ty*T+8;if(blocked(wx,wy,5))continue;
 const d=Math.hypot(wx-x,wy-y);if(d<bd){bd=d;best={x:wx,y:wy};}}return best;}
function bossSeal(){const r=map&&map.bossRoom;if(!r||BSEAL.on)return;const tiles=new Set();
 // every open tile outside the arena touching one inside it: the mouth from the approach
 for(let ty=r.y;ty<r.y+r.h;ty++)for(let tx=r.x;tx<r.x+r.w;tx++){if(tx>r.x&&tx<r.x+r.w-1&&ty>r.y&&ty<r.y+r.h-1)continue;const i=ty*MW+tx;if(!map.t[i])continue;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=tx+dx,ny=ty+dy;if(bsInRect(r,nx,ny))continue;const j=ny*MW+nx;if(map.t[j])tiles.add(j);}}
 if(!tiles.size)return;BSEAL.on=true;BSEAL.room=r;BSEAL.tiles=[...tiles];BSEAL.col=(typeof bsty==='function'&&boss&&bsty(boss).c)||'#ff5050';
 for(const j of BSEAL.tiles){map.t[j]=0;props.push({k:'bossgate',x:(j%MW)*T+8,y:((j/MW)|0)*T+8,j,used:true,room:r,t0:time,col:BSEAL.col});}
 // anyone caught in the doorway is pulled inside
 if(blocked(P.x,P.y,4)||!bsInRect(r,P.x/T|0,P.y/T|0)){const s=bsInside(r,P.x,P.y);if(s){P.x=s.x;P.y=s.y;}}
 for(const e of enemies){if(e.dead||e.room!==r)continue;if(blocked(e.x,e.y,Math.min(6,e.r||6))){const s=bsInside(r,e.x,e.y);if(s){e.x=s.x;e.y=s.y;}}}
 sfx('block');shake=Math.max(shake,5);setToast('THE GATE SEALS BEHIND YOU',BSEAL.col,2.5);}
function bossUnseal(quiet){if(!BSEAL.on)return;if(map&&BSEAL.room===map.bossRoom)for(const j of BSEAL.tiles)map.t[j]=1;for(const p of props)if(p.k==='bossgate'&&!p.down)p.down=time;
 BSEAL.on=false;BSEAL.tiles=[];BSEAL.room=null;if(!quiet)sfx('break');}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(mode!=='play'||!R||!map||!P)return r;
 if(R.training)return r;
 if(!BSEAL.on){if(boss&&boss.awake&&!boss.dead&&map.bossRoom&&boss.room===map.bossRoom&&!(P.dying>0))bossSeal();}
 else{if(!boss||boss.dead||!boss.awake)bossUnseal();
  // a blink or a leap that lands outside the sealed arena is brought back in
  else{const a=BSEAL.room;if(!bsInRect(a,P.x/T|0,P.y/T|0)){const s=bsInside(a,P.x,P.y);if(s){P.x=s.x;P.y=s.y;spark(P.x,P.y,BSEAL.col,6,40);}}}}
 // the sunk gate props go once their animation is done
 if(props.some(p=>p.k==='bossgate'&&p.down&&time-p.down>.7))props=props.filter(p=>!(p.k==='bossgate'&&p.down&&time-p.down>.7));
 return r;};}
{const _ob=onBossDead;onBossDead=function(){bossUnseal();return _ob.apply(this,arguments);};}
{const _br=bossReset;bossReset=function(){bossUnseal(true);return _br.apply(this,arguments);};}
{const _ld=loadDungeon;loadDungeon=function(){BSEAL.on=false;BSEAL.tiles=[];BSEAL.room=null;return _ld.apply(this,arguments);};}
{const _fr=finishRun;finishRun=function(){bossUnseal(true);return _fr.apply(this,arguments);};}
// the gate: heavy iron bars rising across the doorway, banded, with a glowing ward in the guardian's colour
{const _dp=drawProp;drawProp=function(p){if(p.k!=='bossgate')return _dp.apply(this,arguments);
 const up=p.down?Math.max(0,1-(time-p.down)/.6):Math.min(1,(time-p.t0)/.45),h=Math.round(30*up*(up<1&&!p.down?1+Math.sin(up*Math.PI)*.12:1));if(h<=0)return;
 const tx=(p.j%MW)*T,ty=((p.j/MW)|0)*T,c=[[tx,ty],[tx+T,ty],[tx+T,ty+T],[tx,ty+T]].map(([x,y])=>[sx(x,y),sy(x,y)]),X=sx(p.x,p.y),Y=sy(p.x,p.y);
 ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();c.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.fill();
 const A=c[3],B=c[1];
 for(let k=0;k<6;k++){const f=(k+.5)/6,x=Math.round(A[0]+(B[0]-A[0])*f),y=Math.round(A[1]+(B[1]-A[1])*f);
  ctx.fillStyle='#0c0a10';ctx.fillRect(x-2,y-h-1,4,h+1);ctx.fillStyle='#4a4e58';ctx.fillRect(x-1,y-h,2,h);ctx.fillStyle='#8a90a0';ctx.fillRect(x-1,y-h,1,h);ctx.fillStyle='#c8ccd6';ctx.fillRect(x-1,y-h-2,2,2);}
 if(h>12){for(const fy of [.3,.72]){const yy=Y-Math.round(h*fy);ctx.fillStyle='#0c0a10';ctx.fillRect(Math.min(A[0],B[0])-1,yy-1,Math.abs(B[0]-A[0])+2,3);ctx.fillStyle='#6a6e78';ctx.fillRect(Math.min(A[0],B[0]),yy,Math.abs(B[0]-A[0]),1);}
  // the ward: a paper seal glowing in the guardian's colour
  const wy=Y-Math.round(h*.55),gl=.6+.4*Math.sin(time*5+p.j);ctx.fillStyle='#0c0a10';ctx.fillRect(X-3,wy-1,7,10);ctx.fillStyle='#f4ecd0';ctx.fillRect(X-2,wy,5,8);
  ctx.globalAlpha=gl;ctx.fillStyle=p.col||'#ff5050';ctx.fillRect(X-1,wy+1,3,5);ctx.globalAlpha=.25*gl;ctx.beginPath();ctx.arc(X,wy+4,8,0,TAU);ctx.fill();ctx.globalAlpha=1;}
 if(up<1&&Math.random()<.35)particles.push({x:p.x+rnd(-6,6),y:p.y+rnd(-6,6),vx:rnd(-20,20),vy:rnd(-12,0),t:.4,col:'#6a6458'});};}
