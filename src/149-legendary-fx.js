'use strict';
// SHINOBIDUNGEONS - every legendary leaves its mark on how you fight. Each of the 28 named legendaries has a signature
// visual tied to one attack: weapons change your LMB (its projectiles leave a trail, it bursts at your hand and where it
// lands), armours and rings dress one ability, your dash, or your kills - always in that legendary's own colours.
const LEGFX={
 // weapons: the LMB
 'FLAMEHEART STAFF':{on:'m',st:'embers',c:['#ff8a30','#ffd040']},
 "RAIJIN'S SPEAR":{on:'m',st:'sparks',c:['#80e0ff','#ffffff']},
 'HOWLING TANEGASHIMA':{on:'m',st:'smoke',c:['#ff6040','#c8c0b8']},
 'SEVEN STARS BOW':{on:'m',st:'stars',c:['#ffe080','#ffffff']},
 'GHOSTLIGHT KUNAI':{on:'m',st:'wisps',c:['#80ffd0','#d8e0ff']},
 'DEMON-EATER ODACHI':{on:'m',st:'blood',c:['#ff2040','#5a0a10']},
 'CRIMSON MOON KATANA':{on:'m',st:'moon',c:['#d02838','#ffd0d0']},
 'THUNDERCLAP NAGINATA':{on:'m',st:'sparks',c:['#ffff60','#ffffff']},
 'PLAGUE LOTUS STAFF':{on:'m',st:'bubbles',c:['#80d040','#c060ff']},
 'MOONLIT WAND':{on:'m',st:'moon',c:['#d8e0ff','#88ccff']},
 'KESTREL ROD':{on:'m',st:'feathers',c:['#ffffff','#c0c8d4']},
 'VOIDGLASS STAFF':{on:'m',st:'void',c:['#ff2040','#2a1030']},
 // armours: an ability or the dash
 'PHOENIX MANTLE':{on:'dash',st:'embers',c:['#ff6020','#ffd040'],also:'e'},
 'GLACIER LAMELLAR':{on:'f',st:'shards',c:['#a8d8ff','#ffffff']},
 'SPIRIT SHROUD':{on:'w',st:'wisps',c:['#a0a0ff','#ffffff']},
 'THORNED HAORI':{on:'w',st:'thorns',c:['#a0ff40','#3a6a2a']},
 'SHINOBI GARB':{on:'dash',st:'smoke',c:['#3a3444','#8a8494']},
 'CRANE CASTLE ARMOUR':{on:'w',st:'feathers',c:['#ffffff','#e0b040']},
 'HIGH PRIEST VESTMENT':{on:'q',st:'sutra',c:['#ffd040','#fff6c0']},
 'BLOOD ROBE':{on:'h',st:'blood',c:['#c01020','#ff6070']},
 // rings: an ability, or your kills
 'RING OF NINE MOONS':{on:'e',st:'moon',c:['#ffe080','#d8e0ff']},
 'MIRROR OF YATA':{on:'h',st:'stars',c:['#ffffff','#e0b040']},
 'BLOODMOON RING':{on:'e',st:'blood',c:['#ff2040','#801020']},
 'THUNDER EYE':{on:'q',st:'sparks',c:['#80e0ff','#ffffff']},
 'RING OF ECHOES':{on:'f',st:'echo',c:['#c080ff','#ffffff']},
 'FROSTBOUND BAND':{on:'q',st:'shards',c:['#a8d8ff','#ffffff']},
 'STORM SIGNET':{on:'f',st:'sparks',c:['#ffff60','#80e0ff']},
 'RING OF GREED':{on:'kill',st:'coins',c:['#ffd040','#fff6c0']}};
// what you are wearing that has a signature
function legOn(where){const out=[];if(!R||!R.eq)return out;for(const s of ['wpn','arm','ring']){const g=R.eq[s];if(!g||!g.rare)continue;const L=LEGFX[g.name];if(L&&(L.on===where||L.also===where))out.push(L);}return out;}
// one particle in a style (world coords; particles are drawn as single pixels, so styles differ by colour and motion)
function legPart(L,x,y,spd){const c=L.c,r=Math.random,a=r()*TAU,s=(spd||30)*(.4+r()*.8);let o={x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.4+r()*.3,col:r()<.7?c[0]:c[1]};
 switch(L.st){case 'embers':o.vy=-20-r()*30;o.vx*=.4;o.t=.5+r()*.4;break;case 'smoke':o.vx*=.3;o.vy=-10-r()*10;o.t=.7;o.col=r()<.6?c[1]:c[0];break;
  case 'stars':o.vx*=.2;o.vy*=.2;o.t=.6+r()*.4;o.col=r()<.5?'#ffffff':c[0];break;case 'wisps':o.vx*=.3;o.vy=-14-r()*8;o.t=.8;break;
  case 'blood':o.vy=10+r()*30;o.vx*=.5;break;case 'bubbles':o.vx*=.25;o.vy=-12-r()*10;o.t=.7;break;case 'moon':o.vx*=.5;o.vy*=.5;o.t=.5;break;
  case 'feathers':o.vx*=.4;o.vy=6+r()*10;o.t=.9;break;case 'void':o.vx*=-.3;o.vy*=-.3;o.t=.4;o.col=r()<.5?c[1]:c[0];break;case 'shards':o.vy=20+r()*30;o.t=.5;break;
  case 'thorns':o.t=.35;break;case 'sutra':o.vx*=.3;o.vy=-16;o.t=.6;break;case 'echo':o.t=.5;break;case 'coins':o.vy=-40-r()*40;o.vx*=1.2;o.t=.6;break;}
 o.st=L.st;o.t0=o.t;LEGP.push(o);if(LEGP.length>400)LEGP.shift();}
// legendary particles are bigger than the game's 1px ones: 2px motes, with a little cross for stars, sparks and coins
const LEGP=[];let legLast=0;
function drawLegP(){const dt=Math.min(.05,Math.max(0,time-legLast));legLast=time;
 for(let i=LEGP.length-1;i>=0;i--){const q=LEGP[i];q.t-=dt;if(q.t<=0){LEGP.splice(i,1);continue;}q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.96;q.vy*=.96;
  const X=sx(q.x,q.y),Y=sy(q.x,q.y)-8,a=Math.min(1,q.t/q.t0*1.5);ctx.globalAlpha=a;ctx.fillStyle=q.col;
  if(q.st==='stars'||q.st==='sparks'||q.st==='coins'){const tw=Math.floor(time*12+q.x)%2;ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);if(tw){ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);}}
  else ctx.fillRect(X,Y,2,2);}ctx.globalAlpha=1;}
{const _dpo=drawPortal;drawPortal=function(){drawLegP();return _dpo.apply(this,arguments);};}
function legBurst(L,x,y,n,ring){for(let i=0;i<n;i++)legPart(L,x+rnd(-3,3),y+rnd(-3,3),45);
 if(ring&&typeof juice==='function'){juice({k:'ring',x,y,r0:2,r:ring,dur:.25,col:L.c[0],white:L.st==='stars'||L.st==='moon'});
  if(L.st==='sparks'||L.st==='stars')juice({k:'rays',x,y,n:6,len:ring+8,dur:.18,col:L.c[1]});
  if(L.st==='moon'||L.st==='echo'||L.st==='sutra')juice({k:'seal',x,y,r:ring,dur:.5,col:L.c[0]});}}

// ---- weapons: the LMB bursts at your hand, its shots leave a trail, and it marks where it lands
for(const nm of ['castBolt']){const f=globalThis[nm];if(typeof f!=='function')continue;globalThis[nm]=function(){const before=P?P.atkCd:0;const r=f.apply(this,arguments);
 try{if(P&&P.atkCd>before+.01){const Ls=legOn('m');if(Ls.length){const a=P.aim||0,hx=P.x+Math.cos(a)*9,hy=P.y+Math.sin(a)*9;for(const L of Ls)legBurst(L,hx,hy,4,8);}}}catch(_){}return r;};}
{const _dp=drawProj;drawProj=function(q){_dp.apply(this,arguments);if(q.from!=='p'||!q.main||q.dead)return;const Ls=legOn('m');if(!Ls.length)return;
 if(((q._lt=(q._lt||0)+1)%2)===0)for(const L of Ls)legPart(L,q.x,q.y,8);
 // a glint at the shot itself so it reads as yours
 const L=Ls[0],X=sx(q.x,q.y),Y=sy(q.x,q.y)-7;ctx.fillStyle=L.c[1];ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);};}
{let fr=-1,n=0;const _h=hurtE;hurtE=function(e,dmg,pd,o){const r=_h.apply(this,arguments);try{const src=(o&&o.src!==undefined)?o.src:castSrc;if(src==='m'&&e){const Ls=legOn('m');if(Ls.length){const f=Math.floor(time*60);if(f!==fr){fr=f;n=0;}if(n++<3)for(const L of Ls)legBurst(L,e.x,e.y,5,10);}}}catch(_){}return r;};}

// ---- abilities: the cast gets the legendary's mark on top of its own show
{const _cs=castShow;castShow=function(k){_cs.apply(this,arguments);try{for(const L of legOn(k)){const p=P,big=k==='e'?60:k==='f'?50:k==='w'?30:20;
  legBurst(L,p.x,p.y,k==='e'?36:20,big);
  if(k==='e'&&L.st==='moon'){for(let i=0;i<9;i++){const a=i/9*TAU;juice({k:'ring',x:p.x+Math.cos(a)*40,y:p.y+Math.sin(a)*40,r0:1,r:5,dur:.8,col:L.c[i%2],delay:i*.04});}}
  if(k==='e'&&L.st==='blood'){flashT=Math.max(flashT,.2);flashCol=L.c[1];}
  if(k==='e'&&L.st==='embers'){for(const s of [-1,1])juice({k:'rays',x:p.x,y:p.y,n:5,len:70,dur:.6,col:L.c[0],cone:1.2,a0:s>0?0:Math.PI});} // phoenix wings
  if(L.st==='thorns'){for(let i=0;i<12;i++){const a=i/12*TAU;juice({k:'rays',x:p.x+Math.cos(a)*24,y:p.y+Math.sin(a)*24,n:3,len:8,dur:.4,col:L.c[0],cone:.6,a0:a});}}
  if(L.st==='echo')juice({k:'ring',x:p.x,y:p.y,r0:4,r:big+20,dur:.5,col:L.c[0],delay:.18});}}catch(_){}};}

// ---- the dash and your kills
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!P||!(P.dash>0))return;for(const L of legOn('dash'))for(let i=0;i<2;i++)legPart(L,P.x+rnd(-3,3),P.y+rnd(-3,3),12);};}
{const _ke=killE;killE=function(e){const was=e&&!e.dead;const r=_ke.apply(this,arguments);try{if(was&&e.dead&&!e.prop)for(const L of legOn('kill'))legBurst(L,e.x,e.y,10,12);}catch(_){}return r;};}

// ---- the item card says what it changes
{const _gl=gearLines;gearLines=function(g){const L=_gl.apply(this,arguments);try{const F=g&&g.rare&&LEGFX[g.name];if(F){const what={m:'YOUR LMB',q:'YOUR Q',w:'YOUR '+keyName(KB.w),f:'YOUR '+keyName(KB.f),e:'YOUR ULTIMATE',h:'YOUR RMB',dash:'YOUR DASH',kill:'YOUR KILLS'}[F.on];
 L.push('LOOK: '+what+(F.also==='e'?' AND ULTIMATE':'')+' GAINS '+{embers:'EMBERS',sparks:'LIGHTNING SPARKS',smoke:'SMOKE',stars:'STARS',wisps:'SPIRIT WISPS',blood:'BLOOD',moon:'MOONLIGHT',bubbles:'POISON BUBBLES',feathers:'FEATHERS',void:'VOID SHARDS',shards:'ICE SHARDS',thorns:'THORNS',sutra:'SUTRA GLYPHS',echo:'ECHOES',coins:'BURSTING COINS'}[F.st]);}}catch(_){}return L;};}
