'use strict';
// SHINOBIDUNGEONS - tougher, more varied foes:
//  - every regular foe has 30% more health
//  - health also follows the body: big, slow foes (brutes, jailers, guardians, beetles) are much tougher; small, quick
//    ones (rats, hornets, imps, bats) are frailer. size = collision radius x sprite scale; slower = more health.
//  - more elites: from stage I a fight room may hold one (the chance grows with every stage), elite rooms gain a second
//  - four new elite powers: GIANT (huge, slow, very tough), BERSERK (faster and stronger below half health),
//    SPLITTER (bursts into two smaller copies when it dies) and VAMPIRIC (heals when it hurts you)

// ---------- health ----------
function bodyHpMul(t){if(!t)return 1;const size=(t.r||5)*(t.sc||(typeof FOESC!=='undefined'&&FOESC[t.n])||1),spd=t.spd||40;
 const sizeF=Math.pow(clamp(size/5,.6,2.4),.8),speedF=Math.pow(clamp(45/spd,.5,2.2),.55);return clamp(sizeF*speedF,.6,2);}
{const _mk=mkEnemy;mkEnemy=function(type,x,y,room,di){const e=_mk.apply(this,arguments);if(!e||!e.t)return e;
 if(!DUN.some(d=>d.pool.includes(type))||e.t.prop||(R&&R.training))return e; // stage foes only (not lair bosses, minibosses or boss helpers)
 const f=1.3*bodyHpMul(Object.assign({},e.t,{sc:e.t.sc||(typeof FOESC!=='undefined'?FOESC[type]:1)}));e.hp*=f;e.maxhp*=f;e.bodyF=f;return e;};}

// ---------- new elite powers ----------
Object.assign(ELMOD,{giant:{n:'GIANT',c:'#ff9a50'},berserk:{n:'BERSERK',c:'#ff4040'},splitter:{n:'SPLITTER',c:'#80ff90'},vampiric:{n:'VAMPIRIC',c:'#d02040'}});
{const _me=mkElite;mkElite=function(type,x,y,room,di){const e=_me.apply(this,arguments);if(!e)return e;
 if(e.elite==='giant'){e.hp=e.maxhp=e.maxhp*1.8;e.spd*=.75;e.r=Math.round(e.r*1.4);e.dm*=1.15;e.maxPosture*=1.5;e.giant=1;}
 return e;};}
// a giant is drawn half again as big
{const _so=sprOf;sprOf=function(e){const s=_so.apply(this,arguments);if(e&&e.giant&&s&&!e.boss){if(!s._giant)s._giant=Object.assign({},s,{sc:(s.sc||1)*1.5,_av:null});return s._giant;}return s;};}
// berserk: below half health it speeds up and hits harder, glowing red
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play')return;for(const e of enemies){if(e.dead||e.elite!=='berserk')continue;
 if(!e.rage&&e.hp<e.maxhp*.5){e.rage=1;e.spd*=1.45;e.dm*=1.3;txtFx(e.x,e.y,'BERSERK!','#ff4040');sfx('boss');fxRing(e.x,e.y,20,'#ff4040',.4);}
 if(e.rage&&Math.random()<.3)particles.push({x:e.x+rnd(-5,5),y:e.y+rnd(-3,3),vx:0,vy:-25,t:.35,col:'#ff4040'});}};}
// splitter: two smaller copies when it dies
{const _ke=killE;killE=function(e){const was=e&&!e.dead&&e.elite==='splitter'&&!e.split;const r=_ke.apply(this,arguments);
 if(was&&e.dead&&!(R&&R.training))for(let i=0;i<2;i++){const a=i*Math.PI+rnd(-.5,.5),x=e.x+Math.cos(a)*14,y=e.y+Math.sin(a)*14;if(blocked(x,y,4))continue;
  const m=mkEnemy(e.type,x,y,e.room,e.di);m.hp=m.maxhp=e.maxhp/2.6*.45;m.awake=true;m.split=1;m.small=1;m.r=Math.max(3,Math.round(m.r*.75));enemies.push(m);spark(x,y,'#80ff90',10,60);}
 return r;};}
{const _so2=sprOf;sprOf=function(e){const s=_so2.apply(this,arguments);if(e&&e.small&&s){if(!s._small)s._small=Object.assign({},s,{sc:(s.sc||1)*.72,_av:null});return s._small;}return s;};}
// vampiric: heals a share of the damage it deals you
{const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){const hp0=P?P.hp:0;const r=_hp.apply(this,arguments);try{const src=o&&o.src;if(src&&src.elite==='vampiric'&&!src.dead&&P&&P.hp<hp0){const h=(hp0-P.hp)*3;src.hp=Math.min(src.maxhp,src.hp+h);txtFx(src.x,src.y,'+'+Math.round(h),'#d02040');}}catch(_){}return r;};}

// ---------- more elites ----------
{const _pr=populateRoom;populateRoom=function(r,di){_pr.apply(this,arguments);if(!map||map.train)return;const pool=DUN[di].pool.filter(t=>t!=='wisp');if(!pool.length)return;
 const add=()=>{const s=spotIn(r);enemies.push(mkElite(pick(pool),s.x,s.y,r,di));};
 if(r.type==='combat'&&Math.random()<.22+.04*di)add();
 if(r.type==='elite')add();};}
