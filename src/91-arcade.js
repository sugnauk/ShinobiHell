'use strict';
// HELL OF THE EMPEROR - arcade layer: score and boss ranks, the bullets-cleared reward, a visible dash dodge,
// boss relics, no-hit spirit trails and New Game+. Loaded after the bosses.

// ---------------------------------------------------------------- score
// grazes, kills, cleared bullets and boss ranks all score. Shown under your gold; best run kept in meta.
const SCORE={graze:10,kill:25,elite:150,clear:10,boss:5000};
function addScore(n,x,y,col){if(!R||R.training)return;R.score=(R.score||0)+Math.round(n);if(x!=null&&n>=100)txtFx(x,y-10,'+'+Math.round(n),col||'#ffd040');}
{const _ld=loadDungeon;loadDungeon=function(di){if(R){if(R.score==null)R.score=0;if(R.ngp==null)R.ngp=!!(meta.ngUnlocked&&OPT().ngp);}return _ld(di);};}
{const _g=graze;graze=function(q){_g(q);addScore(SCORE.graze);};}
{const _k=killE;killE=function(e){const was=!e.dead;_k(e);if(was&&e.dead&&!e.prop)addScore(e.boss?0:e.elite?SCORE.elite:SCORE.kill);};}
{const _h=drawHUD;drawHUD=function(){_h();if(!R||R.training||!P)return;{const sc='SCORE '+(R.score||0);txt(sc,W-6-txtW(sc),56,'#fff8c0');}
  // the boss fight clock and hits taken, so a no-hit run is visible while it lasts
  const b=boss;if(b&&b.awake&&!b.dead&&b.fight0!=null){const s=(b.hitsT?b.hitsT+' HITS':'NO HIT')+'  '+Math.floor(R.time-b.fight0)+'S';txt(s,W-6-txtW(s),H-48,b.hitsT?'#aaa':'#ffd040');}
  if(BX.warn)for(const w of BX.warn){ctx.globalAlpha=Math.min(1,w.t*2);ctx.fillStyle=Math.floor(time*10)%2?'#ff4040':'#ffd040';ctx.fillRect(w.sx-3,w.sy-3,7,7);ctx.fillStyle='#14101a';ctx.fillRect(w.sx-1,w.sy-2,2,4);ctx.globalAlpha=1;}};}

// ---------------------------------------------------------------- bullets cleared = reward
// when a boss changes phase, starts or ends an event, or dies, its bullets on screen turn into score and gold
// that stream toward you
function cashOut(keepPeril){if(!P||!R||R.training)return;let n=0;
 for(const q of projs){if(q.from!=='e'||q.dead||(keepPeril&&q.peril))continue;n++;if(n%3===0){const a=Math.atan2(P.y-q.y,P.x-q.x),d=Math.hypot(P.x-q.x,P.y-q.y);particles.push({x:q.x,y:q.y,vx:Math.cos(a)*d*2.2,vy:Math.sin(a)*d*2.2,t:.45,col:n%2?'#ffd040':'#fff8c0'});}}
 if(n<4)return;addScore(n*SCORE.clear);const g=Math.floor(n/6);R.sen+=g;sfx('coin');txtFx(P.x,P.y-16,n+' BULLETS CLEARED  +'+g+' GOLD','#ffd040');}

// ---------------------------------------------------------------- a dash you can see
// for as long as a dash makes you untouchable you glow white and leave afterimages; bullets you slip through say so
{const _td=tryDash;tryDash=function(){const was=P.dash>0;_td();if(!was&&P.dash>0){P.dashT=time;P.dashIvT=S.dashIv||.25;P.trail=[];
  if(R.inv.templebell&&!(P.bellCd>0)){P.bellCd=4;let n=0;for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-P.x,q.y-P.y)<36){q.dead=true;n++;}fxRing(P.x,P.y,36,'#ffd040',.3);if(n)tone(880,.3,'triangle',.05,-200);}}};}
{const _dp=drawPlayer;drawPlayer=function(){const p=P,live=p&&p.dashT!=null&&time-p.dashT<(p.dashIvT||.25);
  if(live)for(let i=0;i<p.trail.length;i++){const t=p.trail[i];ctx.globalAlpha=.15+.1*i;ctx.fillStyle='#e8f4ff';const X=sx(t.x,t.y),Y=sy(t.x,t.y);ctx.fillRect(X-3,Y-14,6,13);}
  ctx.globalAlpha=1;_dp();
  if(live){const X=sx(p.x,p.y),Y=sy(p.x,p.y)-8,k=1-(time-p.dashT)/(p.dashIvT||.25);ctx.globalAlpha=.5+.4*k;circ(X,Y,9+Math.round((1-k)*4),'#ffffff');ctx.globalAlpha=1;}
  // spirit trail: a cosmetic won by beating a boss without being hit
  const tc=OPT().trail;if(tc!=null&&tc>=0&&meta.cos&&meta.cos[tc]&&p.mv&&Math.random()<.7)particles.push({x:p.x+rnd(-3,3),y:p.y+rnd(-2,2),vx:0,vy:-10,t:.5,col:Math.random()<.5?TRAILS[tc].c:TRAILS[tc].c2});};}
{const _uw=updWorld;updWorld=function(dt){_uw(dt);const p=P;if(!p)return;if(p.bellCd>0)p.bellCd-=dt;
  if(p.dashT!=null&&time-p.dashT<(p.dashIvT||.25)){p.trail.push({x:p.x,y:p.y});if(p.trail.length>5)p.trail.shift();
   for(const q of projs)if(q.from==='e'&&!q.evaded&&scrDist(q)<q.r+HITR+2){q.evaded=1;p.evN=(p.evN||0)+1;if(p.evN%4===1){txtFx(p.x,p.y-12,'EVADE','#e8f4ff');}addScore(25);}}
  // boss fight bookkeeping: the clock starts when it wakes
  if(boss&&boss.awake&&!boss.dead&&boss.fight0==null){boss.fight0=R.time;boss.hitsT=0;}
  // relics that act every frame
  if(R.inv.shackle){p.slowT=0;p.webT=0;}
  if(R.inv.silkspool)for(const q of projs)if(q.from==='p'&&!q.dead&&!q.spoolUsed)for(const o of projs)if(o.from==='e'&&!o.dead&&!o.peril&&Math.hypot(o.x-q.x,o.y-q.y)<o.r+4){o.dead=true;q.spoolUsed=1;spark(o.x,o.y,'#e8e8f0',3,30);break;}
  if(BX.warn){for(const w of BX.warn)w.t-=dt;BX.warn=BX.warn.filter(w=>w.t>0);}};}
// hits taken during a boss fight count against its rank
{const _hp=hitPlayer;hitPlayer=function(raw,sx2,sy2,o){const r=_hp(raw,sx2,sy2,o);if(r==='hit'&&boss&&boss.awake&&!boss.dead)boss.hitsT=(boss.hitsT||0)+1;return r;};}

// ---------------------------------------------------------------- boss ranks, relics, spirit trails
const RANKS=[{r:'S',c:'#ffd040',m:3},{r:'A',c:'#ff8040',m:2},{r:'B',c:'#80d0ff',m:1.5},{r:'C',c:'#aaaaaa',m:1}];
function bossRank(hits){return hits===0?0:hits<=2?1:hits<=5?2:3;}
// relics: one per guardian, tied to the skill its fight teaches
const BOSSRELIC=[
 {id:'wardrum',name:'WAR DRUM',d:'A DRUM WARNS OF STRIKES OFF SCREEN',g:'D',fx:'control',mo:'bell'},
 {id:'whisker',name:"HUNTER'S EYE",d:'HIDDEN FOES SHOW A FAINT OUTLINE NEARBY',g:'W',fx:'control',mo:'shards'},
 {id:'silkspool',name:'SILK SPOOL',d:'EACH OF YOUR SHOTS CANCELS ONE ENEMY BULLET',g:'S',fx:'guard',mo:'vortex'},
 {id:'spiritlantern',name:'SPIRIT LANTERN',d:'SHIELDS AND ARMOUR BLOCK HALF AS MUCH OF YOUR DAMAGE',g:'L',fx:'dmg',mo:'flame'},
 {id:'roninCrest',name:'RONIN CREST',d:'+25% DAMAGE TO A BOSS\'S MINIONS AND SQUADS',g:'R',fx:'dmg',mo:'sword'},
 {id:'powderhorn',name:'POWDER HORN',d:'FOES YOU KILL MAY EXPLODE, HURTING THOSE NEAR',g:'P',fx:'fire',mo:'meteor'},
 {id:'templebell',name:'TEMPLE BELL',d:'YOUR DASH RINGS: CLEARS NEARBY BULLETS (4S)',g:'B',fx:'guard',mo:'bell'},
 {id:'shackle',name:'BROKEN SHACKLE',d:'NOTHING CAN SLOW YOU',g:'K',fx:'speed',mo:'dash'},
 {id:'hood',name:'SHINOBI HOOD',d:'YOU SEE FARTHER IN DARKNESS AND SMOKE',g:'H',fx:'control',mo:'smoke'},
 {id:'foxmask',name:'FOX MASK',d:'ILLUSIONS AND FAKE WALLS ALWAYS SHIMMER',g:'F',fx:'control',mo:'mirror'},
 {id:'stirrup',name:'BLACK STIRRUP',d:'+15% MOVE SPEED',g:'T',fx:'speed',mo:'dash'}];
for(const b of BOSSRELIC){ITEMS.push({id:b.id,name:b.name,d:b.d,g:b.g,r:3,bossRelic:1});ITEMBY[b.id]=ITEMS[ITEMS.length-1];FXK[b.id]=b.fx;RELICMO[b.id]=b.mo;}
// boss relics only come from their boss, never from chests, shops or bags
{const _ri=randItem;randItem=function(excl,minR){return _ri((excl||[]).concat(BOSSRELIC.filter(Boolean).map(b=>b.id)),minR);};}
{const _cs=calcStats;calcStats=function(){const s=_cs();if(R&&R.inv&&R.inv.stirrup)s.spd*=1.15;return s;};}
// spirit trails: one per guardian, won by beating it without being hit
const TRAILS=[['CRIMSON BANNER','#e04030','#ffd040'],['WHITE STALKER','#e8f4ff','#a8d8ff'],['SILK THREAD','#e8e8f0','#c89040'],['LANTERN FIRE','#ff8030','#ffe080'],
 ['SEVEN BLADES','#c0c8d8','#ff80c0'],['GUN SMOKE','#9a9a9a','#ffd040'],['BRONZE BELL','#d8b040','#e8e0ff'],['FORGE SPARK','#ff9040','#fff0c0'],['NIGHT SHADE','#3a3a48','#c02020'],
 ['FOX-FIRE','#8080ff','#ff9040'],['BLACK HORSE','#1e1e28','#c0a040'],['IMPERIAL','#b040ff','#ffd040']].map(([n,c,c2])=>({n,c,c2}));
const trailOwned=()=>TRAILS.map((t,i)=>i).filter(i=>meta.cos&&meta.cos[i]);
const trailName=()=>{const t=OPT().trail;return t!=null&&t>=0&&meta.cos&&meta.cos[t]?TRAILS[t].n:trailOwned().length?'NONE':'LOCKED';};
const trailCol=()=>{const t=OPT().trail;return t!=null&&t>=0&&meta.cos&&meta.cos[t]?TRAILS[t].c:'#888';};
const trailInfo=()=>trailOwned().length+'/12 WON - BEAT A BOSS WITHOUT BEING HIT TO WIN ITS TRAIL';
function cycleTrail(d){const own=[-1].concat(trailOwned());if(own.length<2)return;const i=own.indexOf(OPT().trail==null?-1:OPT().trail);OPT().trail=own[(i+d+own.length*2)%own.length];sfx('coin');}

// a boss falls: rank the fight, award score, its relic and (on a no-hit) its spirit trail
{const _od=onBossDead;onBossDead=function(e){const res=_od(e);if(R&&!R.training&&!R.test){const di=e.di,hits=e.hitsT||0,ri=bossRank(hits),Rk=RANKS[ri],secs=e.fight0!=null?R.time-e.fight0:0;
   const pts=SCORE.boss*Rk.m*(1+di*.25)+Math.max(0,180-secs)*20;addScore(pts);
   meta.ranks=meta.ranks||{};if(meta.ranks[di]==null||ri<meta.ranks[di])meta.ranks[di]=ri;
   let msg='RANK '+Rk.r+'  +'+Math.round(pts);if(hits===0){meta.cos=meta.cos||{};if(!meta.cos[di]){meta.cos[di]=1;msg+='  NO HIT! TRAIL WON: '+TRAILS[di].n;}else msg+='  NO HIT!';}
   saveMeta();setToast(msg,Rk.c,4);bossRankFx={r:Rk.r,c:Rk.c,t:2.5,hits,secs};
   const rel=BOSSRELIC[di];if(rel&&!R.inv[rel.id])dropPickup(e.x-22,e.y+8,'item',0,rel.id);}return res;};}
let bossRankFx=null;
{const _rp=renderPlay;renderPlay=function(){_rp();if(bossRankFx&&mode==='play'){const f=bossRankFx;f.t-=RDT;if(f.t<=0){bossRankFx=null;return;}ctx.globalAlpha=Math.min(1,f.t*2);txt(f.r,Math.round(W/2-txtW(f.r,6)/2),46,f.c,6);ctxt(f.hits?f.hits+' HITS - '+Math.floor(f.secs)+'S':'NO HIT - '+Math.floor(f.secs)+'S',86,'#fff');ctx.globalAlpha=1;}};}

// ---------------------------------------------------------------- relic effects that hook combat
{const _he=hurtE;hurtE=function(e,dmg,pd,o){if(e&&R&&R.inv){if(R.inv.roninCrest&&!e.boss&&(e.bossOwned||e.minion||e.member))dmg*=1.25;
}return _he(e,dmg,pd,o);};}
{const _k2=killE;killE=function(e){const was=!e.dead;_k2(e);if(was&&e.dead&&!e.prop&&!e.boss&&R&&R.inv&&R.inv.powderhorn&&Math.random()<.3){impact(e.x,e.y,'#ff8030',5);fxRing(e.x,e.y,40,'#ff8030',.3);
  for(const o of enemies)if(!o.dead&&o!==e&&!o.air&&Math.hypot(o.x-e.x,o.y-e.y)<40+o.r)hurtE(o,S.atk*2,20,{nost:true});}};}
// war drum: a strike that starts off screen beats a drum and flashes an arrow at the screen edge
{const _mk=mark;mark=function(o){const m=_mk(o);if(R&&R.inv&&R.inv.wardrum&&(m.dmg||m.sdmg)&&m.x!=null){const X=sx(m.x,m.y),Y=sy(m.x,m.y);if(X<0||X>W||Y<0||Y>H){BX.warn=BX.warn||[];BX.warn.push({sx:clamp(X,8,W-8),sy:clamp(Y,8,H-8),t:Math.max(.6,m.t)});tone(90,.12,'sine',.08,-20);}}return m;};}
// hunter's eye: hidden bosses never fade below a faint outline when close
{const _de=drawEnemy;drawEnemy=function(e){if(R&&R.inv&&R.inv.whisker&&e.alpha!=null&&e.alpha<.3&&P&&Math.hypot(e.x-P.x,e.y-P.y)<120){const a=e.alpha;e.alpha=.3;_de(e);e.alpha=a;return;}return _de(e);};}

// ---------------------------------------------------------------- New Game+
// beat the Emperor once to unlock it (Options). Every boss then starts in its second form and foes are tougher.
{const _fr=finishRun;finishRun=function(win){if(win&&!meta.ngUnlocked){meta.ngUnlocked=true;saveMeta();setTimeout(()=>setToast("THE EMPEROR'S SEAL: NEW GAME+ UNLOCKED (OPTIONS)",'#ff60ff',5),50);}return _fr(win);};}
{const _ks=kitStart;kitStart=function(e,K){const first=!e.kitOn;_ks(e,K);if(first&&R&&R.ngp&&!K.noHalf&&!e.half&&e.boss&&BKIT[e.name]){e.half=1;e.phase=Math.max(e.phase||1,2);e.spdK=K.spdK||1.2;if(!K.keepSpr)e.sprOv=bossHurtSpr(e.di);if(K.onHalf)K.onHalf(e);}};}
{const _mb=mkBoss;mkBoss=function(di,x,y,room){const b=_mb(di,x,y,room);if(R&&R.ngp){b.hp*=1.25;b.maxhp*=1.25;}return b;};}
{const _me=mkEnemy;mkEnemy=function(type,x,y,room,di){const e=_me(type,x,y,room,di);if(R&&R.ngp&&e){e.hp*=1.25;e.maxhp*=1.25;}return e;};}
