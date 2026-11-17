'use strict';
// ===== BULLET PATTERN LIBRARY: classic danmaku shapes for bosses, stage foes, elites and ambush waves =====
// Built on the three angle types (fixed, aimed, random) and the classic structures (rings, fans, stacks), so every
// pattern tests one dodging skill and always leaves a way through:
//   STREAMING  - aimed fire you step away from in small moves (stack, sniper)
//   MICRO      - dense but slow fields you thread through (layered, rose, dspiral)
//   MACRO      - big shapes you read and run across to the gap (lattice, sweep, encircle)
//   NO CAMPING - an aimed ring always has a bullet on your line, so standing still is never safe (aimedring)
// Fast bullets are small, slow bullets are big, and anything that appears around you waits (and shows) before it moves.
const NPAT={
 // three aimed columns of five, each faster than the last: step aside and keep stepping
 stack:(e,a,pa,fire)=>{const cols=a.cols||3,per=a.per||5,sp=a.spread||.32;for(let c=0;c<cols;c++){const an=pa+(cols>1?(c/(cols-1)-.5)*sp*2:0);for(let i=0;i<per;i++)fire(an,a.sp*(.62+i*.12),{r:2});}},
 // two spirals turning opposite ways: they weave a moving lattice you thread through
 dspiral:(e,a,pa,fire)=>{e._ds=(e._ds||Math.random()*TAU)+(a.spin||.24);const arms=a.arms||4;for(let i=0;i<arms;i++){fire(e._ds+i*TAU/arms,a.sp);fire(-e._ds+(i+.5)*TAU/arms,a.sp*.82,{col:a.col2||a.col});}},
 // two crossing walls, each with a gap: find where the gaps line up
 lattice:(e,a,pa,fire)=>{const n=a.cnt||9,gap=1+Math.floor(Math.random()*(n-3)),sp2=a.space||12;for(const tilt of [-.55,.55]){const d=pa+tilt,px=-Math.sin(d),py=Math.cos(d);
   for(let i=0;i<n;i++){if(i===gap||i===gap+1)continue;const off=(i-(n-1)/2)*sp2;fire(d,a.sp,{r:3},e.x+px*off,e.y+py*off);}}},
 // a rose curve: the ring's speed swells and shrinks with the petals, so slow lanes open between them
 rose:(e,a,pa,fire)=>{const n=a.cnt||24,k=a.petals||5,off=(e._rep||0)*.19;for(let i=0;i<n;i++){const th=off+i/n*TAU;fire(th,a.sp*(.45+.55*Math.abs(Math.sin(k*th/2))),{r:3});}},
 // a ring with one bullet aimed straight at you
 aimedring:(e,a,pa,fire)=>{const n=a.cnt||16;for(let i=0;i<n;i++)fire(pa+i/n*TAU,a.sp,{r:i===0?2:3});},
 // a ring appears around you, holds, then closes in. One arc is left open: run for it
 encircle:(e,a,pa,fire)=>{const n=a.cnt||22,R0=a.rad||84,gA=Math.random()*TAU,gw=a.gw||1;for(let i=0;i<n;i++){const t=i/n*TAU;if(Math.abs(angDiff(t,gA))<gw/2)continue;
   const x=P.x+Math.cos(t)*R0,y=P.y+Math.sin(t)*R0;if(solid(x,y))continue;fire(t+Math.PI,a.sp,{st:'lance',wait:a.wait||.75,r:3},x,y);}},
 // a wide sweeping wall that wobbles as it comes: the gap moves from side to side each time
 sweep:(e,a,pa,fire)=>{const n=a.cnt||13,px=-Math.sin(pa),py=Math.cos(pa),gap=Math.floor(n/2)+((e._rep||0)%3-1)*3;for(let i=0;i<n;i++){if(Math.abs(i-gap)<=1)continue;const off=(i-(n-1)/2)*(a.space||10);
   fire(pa,a.sp,{st:'wave',wa:a.wa||36,wf:a.wf||4,wt:0,r:3},e.x+px*off,e.y+py*off);}},
 // a fast aimed shot with two flankers and two trailers: tap aside, don't run
 sniper:(e,a,pa,fire)=>{fire(pa,a.sp*1.6,{r:2});for(const s of [-1,1])fire(pa+s*(a.spread||.22),a.sp,{r:2});for(let i=1;i<=2;i++)fire(pa,a.sp*(1.6-i*.3),{r:2});},
 // three nested rings, each offset by half a step: slow, dense, and fair
 layered:(e,a,pa,fire)=>{const n=a.cnt||12,off=Math.random()*TAU;for(let L=0;L<3;L++)for(let i=0;i<n;i++)fire(off+(i+(L%2)*.5)/n*TAU,a.sp*(1-L*.17),{r:L?3:4});}};
{const _es=enemyShoot;enemyShoot=function(e,a,ang){if(!a||!NPAT[a.pat])return _es.apply(this,arguments);if(e.blind>0)return;
 const dm=(a.dmg||9)*(e.dm||1),base=Object.assign({own:e,col:a.col,pd:a.pd,spr:a.spr,pool:a.pool},styleOf(a));
 const fire=(an,sp,o,x,y)=>{const q=mkProj('e',x==null?e.x:x,y==null?e.y:y,an,sp==null?a.sp:sp,dm,Object.assign({r:a.r||3},base,o||{}));
  if(q.st==='orbit'){q.ox=q.x;q.oy=q.y;q.oa=an;q.or=6;}if(q.st==='lance'){q.lvx=q.vx;q.lvy=q.vy;q.vx=q.vy=0;}projs.push(q);return q;};
 const pa=Math.atan2(P.y-e.y,P.x-e.x);e._rep=(e._rep||0)+1;NPAT[a.pat](e,a,pa,fire);sfx('shoot');};}

// ---------- bosses: each guardian gets new patterns that fit who they are ----------
const BOSSPAT={
 'AKAGANE, THE RED OX':[{pat:'stack',cols:3,per:4,sp:90,spread:.3},{pat:'lattice',cnt:11,sp:62},{pat:'encircle',cnt:20,sp:70,half:1}],
 'KUSAKARI, THE REED HUNTER':[{pat:'sweep',cnt:15,sp:64},{pat:'sniper',sp:150},{pat:'rose',cnt:26,petals:4,sp:66,half:1}],
 'ITOHIME, THE WIRE WEAVER':[{pat:'lattice',cnt:11,sp:58},{pat:'layered',cnt:12,sp:56},{pat:'encircle',cnt:24,sp:62,half:1}],
 'LADY HOTARU':[{pat:'rose',cnt:28,petals:6,sp:60},{pat:'dspiral',arms:4,sp:58,burst:6,gap:.12},{pat:'aimedring',cnt:18,sp:62,half:1}],
 'THE RONIN SEVEN':[{pat:'sniper',sp:160},{pat:'stack',cols:5,per:4,sp:95,spread:.5},{pat:'sweep',cnt:15,sp:70,half:1}],
 'TETSUO THE GUNSMITH':[{pat:'stack',cols:3,per:6,sp:105,spread:.28},{pat:'sniper',sp:170},{pat:'lattice',cnt:13,sp:66,half:1}],
 'THE THOUSAND-BELL ABBOT':[{pat:'layered',cnt:14,sp:54},{pat:'aimedring',cnt:20,sp:60},{pat:'rose',cnt:30,petals:7,sp:58,half:1}],
 'ONIKUMA, THE JAILER':[{pat:'encircle',cnt:24,sp:66},{pat:'lattice',cnt:13,sp:62},{pat:'stack',cols:3,per:5,sp:96,half:1}],
 'KAGE, THE SHINOBI MASTER':[{pat:'sniper',sp:175},{pat:'dspiral',arms:5,sp:64,burst:6,gap:.1},{pat:'encircle',cnt:22,sp:78,half:1}],
 'TAMAMO, THE ILLUSIONIST':[{pat:'rose',cnt:27,petals:9,sp:62},{pat:'dspiral',arms:3,sp:60,burst:8,gap:.1},{pat:'aimedring',cnt:18,sp:66,half:1}],
 'LORD KUROGANE':[{pat:'sweep',cnt:17,sp:76},{pat:'stack',cols:4,per:5,sp:100,spread:.4},{pat:'lattice',cnt:13,sp:70,half:1}],
 'THE CORRUPT EMPEROR':[{pat:'dspiral',arms:6,sp:62,burst:8,gap:.09},{pat:'rose',cnt:32,petals:8,sp:62},{pat:'encircle',cnt:26,sp:72},{pat:'lattice',cnt:15,sp:68,half:1},{pat:'layered',cnt:16,sp:58,half:1}]};
(function addBossPatterns(){for(const name in BOSSPAT){const K=BKIT[name];if(!K||!K.barrage)continue;const B=K.barrage,col=(B.ph1&&B.ph1[0]&&B.ph1[0].col)||'#ff8040',col2=(B.ph1&&B.ph1[1]&&B.ph1[1].col)||col;
  for(const p0 of BOSSPAT[name]){const p=Object.assign({col,col2},p0);delete p.half;if(!p0.half&&B.ph1)B.ph1.push(p);if(B.half)B.half.push(Object.assign({},p,{sp:p.sp*1.08}));if(B.storm&&p0.half)B.storm.push(p);}}})();

// ---------- stage foes: several volleys become classic patterns ----------
(function remapFoes(){const set=(type,i,o)=>{const t=ET[type];if(!t||!t.atks)return;const s=t.atks.filter(a=>a.n==='shoot')[i];if(s)Object.assign(s,o,{ring:false});};
 set('archer',0,{pat:'stack',cols:3,per:3,spread:.3});
 set('sniper',0,{pat:'sniper',spread:.2,sp:190});
 set('priest',0,{pat:'aimedring',cnt:12});
 set('monk',1,{pat:'dspiral',arms:2,spin:.3,st:null});
 set('crane',0,{pat:'sweep',cnt:9,st:null});
 set('shaman',0,{pat:'rose',cnt:12,petals:3,sp:62});
 set('toad',0,{pat:'layered',cnt:8,st:null,sp:50});})();

// ---------- elites: a signature volley that grows with the stage ----------
const ELITEPAT=[{pat:'stack',cols:3,per:4,sp:85,spread:.3},{pat:'aimedring',cnt:12,sp:56},{pat:'rose',cnt:16,petals:4,sp:58},{pat:'lattice',cnt:9,sp:56},{pat:'dspiral',arms:3,sp:56},{pat:'sweep',cnt:11,sp:60},{pat:'encircle',cnt:16,sp:60,rad:78}];
{const _me=mkElite;mkElite=function(type,x,y,room,di){const e=_me.apply(this,arguments);const pool=ELITEPAT.slice(0,Math.min(ELITEPAT.length,3+Math.floor((di||0)/2)));
 const p=Object.assign({n:'shoot',wt:1.4,w:.75,reps:1,gap:.2,rec:.7,dmg:9+(di||0),pd:12,col:(ELMOD[e.elite]&&ELMOD[e.elite].c)||'#f84',spread:0},pick(pool));
 e.t=Object.assign({},e.t,{atks:(e.t.atks||[]).concat([p])});return e;};}

// ---------- ambush waves: three waves, the middle one with spirit lanterns firing in formation ----------
// Lanterns sit in the room's corners and fire turning patterns in step with each other; they can be broken (and each one
// broken drops gold). The last wave brings an elite.
function spawnLanterns(r){const pats=[{pat:'dspiral',arms:2,spin:.28,sp:48},{pat:'rose',cnt:10,petals:3,sp:46},{pat:'aimedring',cnt:10,sp:50}],P0=pick(pats),di=R.di||0;
 const pts=[[2.5,2.5],[r.w-2.5,2.5],[2.5,r.h-2.5],[r.w-2.5,r.h-2.5]];
 pts.forEach(([gx,gy],i)=>{const x=(r.x+gx)*T,y=(r.y+gy)*T;if(solid(x,y))return;const e=mkEnemy('turret',x,y,r,di);
  Object.assign(e,{awake:true,hp:40+di*14,maxhp:40+di*14,lantern:1,tRate:1.1-Math.min(.4,di*.04),tt:.8+i*.15,tPat:Object.assign({dmg:7+di,pd:6,col:'#ffd070'},P0)});enemies.push(e);fxRing(x,y,14,'#ffd070',.4);spark(x,y,'#ffd070',12,60);});
 setToast('SPIRIT LANTERNS! BREAK THEM','#ffd070',2.2);}
{const _ur=updRoomEvents;updRoomEvents=function(dt){
 // ambushes grow from 2 waves to 3: foes, then foes with lanterns, then foes with an elite. Lanterns count as foes in the
 // room, so the original wave logic simply waits for them; it ends the ambush after the third wave.
 if(map&&!map.train)for(const r of map.rooms){const ev=r.ev;if(!ev||ev.k!=='ambush'||ev.state!==1)continue;const alive=enemies.filter(e=>!e.dead&&e.room===r).length;if(alive)continue;
  if(ev.wave===0&&!ev.lant){ev.lant=1;ev.wave=1;setToast('WAVE 2/3','#f55',1.5);spawnLanterns(r);roomSpawn(r,3+Math.floor(R.di/2));}
  else if(ev.wave===1&&ev.lant===1){ev.lant=2;setToast('WAVE 3/3 - AN ELITE','#f55',1.8);const s=spotIn(r),el=mkElite(pick(DUN[R.di].pool),s.x,s.y,r,R.di);el.awake=true;enemies.push(el);roomSpawn(r,2+Math.floor(R.di/2));}}
 return _ur.apply(this,arguments);};}
// broken lanterns pay out
{const _ke=killE;if(typeof _ke==='function')killE=function(e){if(e&&e.lantern&&!e.dead){R.sen+=4+(R.di||0);txtFx(e.x,e.y,'+'+(4+(R.di||0))+' GOLD','#ffd040');}return _ke.apply(this,arguments);};}

// ---------- formation squads: some fight rooms hold a line of ranged foes that fire in a rolling rhythm ----------
// A third of combat rooms (from stage II on) add a squad of three to five of one ranged type, standing in a line across the
// room. Their attack timers are staggered, so their volleys ripple down the line like a shmup formation.
const FORMTYPES=['archer','monk','priest','shaman','sniper','crane','raven','salamander','viper','kitsune','owl','toad','wraith','bat'];
{const _pr=populateRoom;populateRoom=function(r,di){_pr.apply(this,arguments);if(r.type!=='combat'||di<1||Math.random()>.33)return;
 const pool=DUN[di].pool.filter(t=>FORMTYPES.includes(t));if(!pool.length)return;const type=pick(pool),n=3+Math.min(2,Math.floor(di/4)),c=roomCenter(r);
 const horiz=r.w>=r.h,len=(horiz?r.w:r.h)*T*.6;
 for(let i=0;i<n;i++){const f=n>1?i/(n-1)-.5:0,x=horiz?c.x+f*len:c.x-r.w*T*.25,y=horiz?c.y-r.h*T*.25:c.y+f*len;if(solid(x,y))continue;
  const e=mkEnemy(type,x,y,r,di);e.squad=1;e.cd=1+i*.35;e.spd*=.5;enemies.push(e);}
 r.squad=type;};}
// squad members show a small banner so you can tell them apart
{const _de=drawEnemy;drawEnemy=function(e){_de.apply(this,arguments);if(e.squad&&!e.dead){const X=sx(e.x,e.y),Y=sy(e.x,e.y)-e.r*2-12;ctx.fillStyle='#3a2418';ctx.fillRect(X+5,Y,1,8);ctx.fillStyle='#d02030';ctx.fillRect(X+6,Y,3,4);}};}
