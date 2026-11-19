'use strict';
// HELL OF THE EMPEROR - TEST MODE. Press T on the title screen or in the hub.
// Pick any stage, any character (locked or not), where to start (stage start, boss arena, boss at half health, the boss's
// event, the Moth Queen), god mode, gear, power, difficulty and New Game+. In a test run press ` (backquote) to open the test
// panel; while it is open the number keys are test commands. Test runs never save and never change your gold, unlocks,
// ranks, trails or the New Game+ unlock.
const TEST={stage:0,cls:0,start:1,god:1,gear:0,power:0,ngp:0,sel:0,panel:false,applied:false};
const TSTARTS=['STAGE START','BOSS ARENA','BOSS AT HALF HEALTH','BOSS EVENT','BOSS LAST PHASE','MOTH QUEEN (STAGE IV)'];
const TGEAR=['STARTER','RARE','EPIC','LEGENDARY'];
const TROWS=[
 {n:'STAGE',v:()=>ROMAN[TEST.stage]+'. '+DUN[TEST.stage].name,ch:d=>{TEST.stage=(TEST.stage+d+DUN.length)%DUN.length;}},
 {n:'BOSS',v:()=>BOSS[TEST.stage].name,c:()=>'#f77'},
 {n:'CHARACTER',v:()=>CLASSES[TEST.cls].n,c:()=>CLASSES[TEST.cls].col,ch:d=>{TEST.cls=(TEST.cls+d+CLASSES.length)%CLASSES.length;}},
 {n:'START AT',v:()=>TSTARTS[TEST.start],ch:d=>{TEST.start=(TEST.start+d+TSTARTS.length)%TSTARTS.length;if(TEST.start===5)TEST.stage=3;}},
 {n:'GOD MODE',v:()=>TEST.god?'ON':'OFF',c:()=>TEST.god?'#6f6':'#ddd',ch:()=>{TEST.god^=1;}},
 {n:'GEAR',v:()=>TGEAR[TEST.gear],c:()=>QUAL[[0,2,3,4][TEST.gear]].c,ch:d=>{TEST.gear=(TEST.gear+d+4)%4;}},
 {n:'POWER',v:()=>TEST.power?'+'+TEST.power+' RELICS, FORM '+(Math.min(9,TEST.power)+1):'AS A NEW RUN AT THIS STAGE',ch:d=>{TEST.power=clamp(TEST.power+d*2,0,20);}},
 {n:'DIFFICULTY',v:()=>DF().n,c:()=>DF().c,ch:d=>{OPT().diff=clamp(OPT().diff+d,0,2);}},
 {n:'NEW GAME+',v:()=>TEST.ngp?'ON':'OFF',c:()=>TEST.ngp?'#ff60ff':'#ddd',ch:()=>{TEST.ngp^=1;}},
 {n:'START TEST',v:()=>'',act:()=>testStart()}];
function openTest(){mode='testmenu';TEST.sel=TROWS.length-1;sfx('tool');}
function renderTestMenu(){bg();ctx.fillStyle='rgba(8,4,12,.86)';ctx.fillRect(0,0,W,H);ctxt('TEST MODE',6,'#ffd040',2);ctxt('NOTHING HERE SAVES OR CHANGES YOUR PROGRESS',22,'#888');
 TROWS.forEach((r,i)=>{const y=34+i*12,sel=i===TEST.sel;if(sel){ctx.fillStyle='rgba(208,32,48,.35)';ctx.fillRect(10,y-2,W-20,10);}txt(r.n,16,y,sel?'#fff':'#aaa');const v=r.v();if(v){const s=(r.ch?'< ':'')+v+(r.ch?' >':'');txt(s.slice(0,44),W-16-txtW(s.slice(0,44)),y,r.c?r.c():'#ddd');}else if(r.act)txt('ENTER',W-16-txtW('ENTER'),y,Math.floor(time*3)%2?'#ffd040':'#a08020');});
 ctxt('W/S ROW   A/D CHANGE   ENTER START   ESC BACK',H-18,'#888');ctxt('IN A TEST RUN: ` OPENS THE TEST PANEL',H-9,'#666');}
function testMenuKey(c){const r=TROWS[TEST.sel];
 if(c==='ArrowUp'||c==='KeyW')TEST.sel=(TEST.sel+TROWS.length-1)%TROWS.length;else if(c==='ArrowDown'||c==='KeyS')TEST.sel=(TEST.sel+1)%TROWS.length;
 else if((c==='ArrowLeft'||c==='KeyA')&&r.ch){r.ch(-1);sfx('coin');}else if((c==='ArrowRight'||c==='KeyD')&&r.ch){r.ch(1);sfx('coin');}
 else if(c==='Enter'||c==='Space'){if(r.act)r.act();else if(r.ch){r.ch(1);sfx('coin');}}else if(c==='Escape'){mode='title';sfx('coin');}}
// a test run: the chosen character and stage, skipping training, and the extras asked for
function resetTestInvulnerability(){TEST.combatT=0;TEST.invT=0;}
function testStart(){resetTestInvulnerability();const keep={cls:meta.cls,trained:meta.trained,ngp:OPT().ngp,unlocked:meta.unlocked,ngU:meta.ngUnlocked};
 meta.cls=TEST.cls;meta.trained=true;meta.ngUnlocked=true;OPT().ngp=TEST.ngp;
 startRun(TEST.stage);R.test=true;R.testCls=TEST.cls;R.god=!!TEST.god;R.ngp=!!TEST.ngp;
 Object.assign(meta,{cls:keep.cls,trained:keep.trained,ngUnlocked:keep.ngU});OPT().ngp=keep.ngp;S=calcStats();
 if(TEST.power){for(let i=0;i<TEST.power;i++){const it=randItem(['rez']);R.inv[it.id]=(R.inv[it.id]||0)+1;}P.evo=Math.min(9,TEST.power);}
 if(TEST.gear){const q=[0,2,3,4][TEST.gear];for(const s of ['wpn','arm','ring']){const g=q===4?mkGear(s,tierFor(TEST.stage,1),true):mkGear(s,tierFor(TEST.stage,1),false,q);if(s==='wpn'&&!g.rare){g.wt=WSIG[CLASSES[TEST.cls].k];g.name=(g.q>=2?QUAL[g.q].n+' ':'')+GEARN.wpn[g.tier]+' '+g.wt;}R.eq[s]=g;}syncLMB();}
 S=calcStats();P.hp=S.maxhp;TEST.applied=false;TEST.panel=false;
 if(TEST.start===5){const e=MOTH.e;if(e){P.x=e.x-70;P.y=e.y;}}else if(TEST.start>=1)testToBoss();
 setToast('TEST: '+ROMAN[TEST.stage]+'. '+DUN[TEST.stage].name+' - PRESS ` FOR THE TEST PANEL','#ffd040',4);}
function testToBoss(){const r=map.bossRoom;if(!r)return;for(let y=r.y-2;y<r.y+r.h+2;y++)for(let x=r.x-2;x<r.x+r.w+2;x++)if(x>=0&&y>=0&&x<MW&&y<MH)map.expl[y*MW+x]=1;
 const s=freeSpot({room:r},(r.x+r.w/2-8)*T,(r.y+r.h/2)*T,4);P.x=s.x;P.y=s.y;P.iv=1;}
// set a boss's health (squads and the Emperor's guards are scaled through their members)
function testBossHp(f){const b=boss;if(!b||b.dead)return;if(b.r7){const c=b.hp/b.maxhp||1;for(const m of b.r7)if(!m.dead)m.hp*=f/c;return;}
 if(b.guards&&b.ph===1){for(const m of b.guards)if(!m.dead)killE(m);if(f>=.7)return;}b.hp=Math.max(1,b.maxhp*f);}
function testNextEvent(){const b=boss;if(!b||b.dead)return;const K=BKIT[b.name];if(!K)return;const f=b.hp/b.maxhp,L=bossEvents(K).filter((ev,i)=>!(b.evSeen&&b.evSeen[i])&&ev.at<f+.001);
 const next=Math.max(...L.map(ev=>ev.at),!b.half?.5:-1);if(next>0)testBossHp(next-.01);else setToast('NO EVENTS LEFT','#aaa',1.5);}
// the panel
const TCMDS=[['1','GOD MODE',()=>{R.god=!R.god;setToast('GOD MODE '+(R.god?'ON':'OFF'),'#6f6',1.5);}],['2','TELEPORT TO BOSS',()=>testToBoss()],['3','BOSS TO HALF HEALTH',()=>testBossHp(.49)],
 ['4','BOSS TO ITS NEXT EVENT',()=>testNextEvent()],['5','KILL THE BOSS',()=>{if(boss&&!boss.dead){if(boss.r7){for(const m of boss.r7)if(!m.dead)killE(m);}else{if(boss.guards)for(const m of boss.guards)if(!m.dead)killE(m);boss.EV=null;boss.iv=0;boss.hp=1;killE(boss);}}}],
 ['6','NEXT STAGE',()=>{if(R.di<DUN.length-1){loadDungeon(R.di+1);testToBoss();}}],['7','A LEGENDARY',()=>{dropBag(P.x+12,P.y+12,GOLDBAG,true);}],
 ['8','HEAL, POTIONS, COOLDOWNS',()=>{P.hp=S.maxhp;R.pots=POTMAX;for(const k in P.ab)P.ab[k]=0;P.dashCd=0;}],['9','+1000 GOLD, A RELIC',()=>{R.sen+=1000;applyItem(randItem().id);}],['0','REVEAL THE MAP',()=>{map.expl.fill(1);}]];
{const _ok=onKey;onKey=function(c){
  if(mode==='testmenu'){testMenuKey(c);return;}
  if((mode==='title'||mode==='hub')&&c==='KeyT'){openTest();return;}
  if(mode==='play'&&R&&R.test&&!paused&&!invOpen){if(c==='Backquote'){TEST.panel=!TEST.panel;sfx('tool');return;}
   if(c==='KeyJ'){resetTestInvulnerability();setToast('INVULNERABILITY METER RESET','#ffd040',1);return;}
   if(TEST.panel){const m=/^Digit(\d)$/.exec(c);if(m){const cmd=TCMDS.find(t=>t[0]===m[1]);if(cmd){cmd[2]();sfx('pickup');}return;}}}
  return _ok(c);};}
{const _r=render;render=function(){if(mode==='testmenu'){setView(false);ctx.imageSmoothingEnabled=false;renderTestMenu();return;}return _r();};}
// (the title screen now draws its own test-mode hint: see 200-tips-title.js)
{const _rh=renderHub;renderHub=function(){_rh();txt('T: TEST',W-4-txtW('T: TEST'),4,'#555');};}
{const _h=drawHUD;drawHUD=function(){_h();if(!R||!R.test)return;txt('TEST'+(R.god?' GOD':''),6,52,'#ffd040');
  const pct=TEST.combatT?Math.round(100*TEST.invT/TEST.combatT)+'%':'--';
  txt('COMBAT I-FRAMES '+pct+" [J RESET]",6,61,'#ffd040');
  if(TEST.panel){const x=6,y=70,w=150;ctx.fillStyle='rgba(8,4,12,.9)';ctx.fillRect(x,y,w,12+TCMDS.length*9);ctx.fillStyle='#ffd040';ctx.fillRect(x,y,w,1);txt('TEST PANEL  ` CLOSES',x+4,y+3,'#ffd040');
   TCMDS.forEach((t,i)=>{txt(t[0],x+4,y+13+i*9,'#ffd040');txt(t[1],x+14,y+13+i*9,'#ddd');});}};}
// Only count simulated combat ticks. Pauses, introductions and hitstop never enter updPlay.
{const _up=updPlay;updPlay=function(dt){const during=R?.test&&inCombat(),safe=during?Math.min(dt,Math.max(P.iv||0,P.dash||0)):0;
 if(during){TEST.combatT+=dt;TEST.invT+=safe;}return _up.apply(this,arguments);};}
// god mode, and the start point once the boss is awake
{const _uw=updWorld;updWorld=function(dt){_uw(dt);if(!R||!R.test||!P)return;if(R.god){P.hp=S.maxhp;P.stag=0;}
  if(!TEST.applied&&boss&&boss.awake&&boss.kitOn){TEST.applied=true;if(TEST.start===2)testBossHp(.49);else if(TEST.start===3)testNextEvent();else if(TEST.start===4)testBossHp(.2);}};}
// test runs never save, and finishing one goes back to the test menu with nothing recorded
{const _sv=saveRun;saveRun=function(){if(R&&R.test)return;return _sv();};}
{const _fr=finishRun;finishRun=function(win){if(R&&R.test){setToast(win?'TEST RUN COMPLETE':'TEST RUN OVER','#ffd040',2.5);R=null;mode='testmenu';return;}return _fr(win);};}
