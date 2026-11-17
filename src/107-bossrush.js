'use strict';
// ===== BOSS RUSH: all twelve guardians, back to back =====
// Unlocks once you have beaten two guardians (press B in the temple). You start in the first boss arena with your chosen
// hero and a little starting gear; each boss gives the usual relic pick, then the portal takes you straight to the next
// arena with a 30% heal. Your best rush (guardians beaten, then time) is kept, and all gold you carry turns into jade.
// every guardian is in the gauntlet; it opens once you have beaten two of them
const rushBeaten=()=>BOSS.map((b,i)=>i).filter(i=>meta.guide&&meta.guide.e&&meta.guide.e['boss'+i]);
const rushPool=()=>BOSS.map((b,i)=>i);
const rushOpen=()=>rushBeaten().length>=2;
function startRush(){const pool=rushPool();if(!rushOpen()){sfx('block');setToast('BEAT TWO GUARDIANS TO OPEN THE BOSS RUSH','#c55',2.5);return;}
 startRun(pool[0]);R.rush={pool,i:0,t0:0};
 // a little help so the rush isn't a stage I hero against stage XII guardians: gear and relics grow with the first boss
 rushArena();setToast('BOSS RUSH: '+pool.length+' GUARDIANS','#ff6070',3);}
function rushArena(){const r=map.bossRoom;if(!r)return;
 // only the boss and its own props remain; the path to it is cleared away
 enemies=enemies.filter(e=>e.boss||e.room===r);props=props.filter(p=>p.room===r||p.k==='doorpost'||p.k==='entrancePlaque');pickups=[];
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)map.expl[y*MW+x]=1;
 const s=freeSpot({room:r},(r.x+r.w/2-8)*T,(r.y+r.h/2)*T,4);P.x=s.x;P.y=s.y;P.iv=1.5;
 // gear for the rush: tier follows the stage you're fighting at
 // each arena brings your gear up to that stage's tier (keeping anything better you found) and your form along with it
 if(R.rush){for(const sl of ['wpn','arm','ring']){const g=R.eq[sl],tt=tierFor(R.di,sl==='wpn'?1:0);if(!g||(g.tier||0)<tt)R.eq[sl]=mkGear(sl,tt,false,2);}
  if(R.rush.i===0)for(let k=0;k<Math.floor(R.di*1.5);k++){const it=randItem(['rez']);applyItem(it.id);}
  P.evo=Math.max(P.evo||0,Math.min(9,R.di));const full=R.rush.i===0;S=calcStats();if(full)P.hp=S.maxhp;}}
// the portal leads to the next guardian instead of the master
{const _ui=interact;interact=function(){if(R&&R.rush&&portal&&!portal.pending&&dist(portal,P)<20&&!(nearBag()&&nearBag().items.length)){const rs=R.rush;rs.i++;
   if(rs.i>=rs.pool.length){rushDone(true);return;}
   const keepHp=P.hp;loadDungeon(rs.pool[rs.i]);P.hp=Math.min(S.maxhp,keepHp+S.maxhp*.3);rushArena();setToast('GUARDIAN '+(rs.i+1)+'/'+rs.pool.length,'#ff6070',2.5);return;}
  return _ui.apply(this,arguments);};}
function rushDone(win){const rs=R.rush,beaten=rs.i,t=Math.round(R.time||0),b=meta.rushBest||{n:0,t:0};
 if(beaten>b.n||(beaten===b.n&&t<b.t)){meta.rushBest={n:beaten,t};setToast('NEW BEST RUSH: '+beaten+' GUARDIANS','#ffd040',4);}saveMeta();finishRun(win);}
// dying in a rush records how far you got
{const _fr=finishRun;finishRun=function(win){if(R&&R.rush&&!R.rush.done){R.rush.done=1;const rs=R.rush,beaten=rs.i,t=Math.round(R.time||0),b=meta.rushBest||{n:0,t:0};
  if(beaten>b.n||(beaten===b.n&&t<b.t&&beaten>0))meta.rushBest={n:beaten,t};}return _fr.apply(this,arguments);};}
// a rush never saves mid-way: it is one sitting (it still counts as a run)
{const _sr=saveRun;saveRun=function(){if(R&&R.rush)return;return _sr.apply(this,arguments);};}
// the temple: B starts the rush, and the hub shows it
{const _hk=hubKey;hubKey=function(c){if(c==='KeyB'){startRush();return;}return _hk(c);};}
{const _rh=renderHub;renderHub=function(){_rh.apply(this,arguments);const s=rushOpen()?'B: BOSS RUSH ('+rushPool().length+')'+(meta.rushBest?'  BEST '+meta.rushBest.n:''):'BOSS RUSH: BEAT 2 GUARDIANS';
 txt(s,W-6-txtW(s),H-17,rushOpen()?'#ff8090':'#555');};}
