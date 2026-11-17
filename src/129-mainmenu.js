'use strict';
// HELL OF THE EMPEROR - the front end, in the same style as the pause and settings screens.
// The old "Hall of Lanterns" hub between character select and the game is gone: the title is now a main menu
// (continue, new run, training, boss rush, temple skill tree, guide, settings) with a detail panel on the right,
// character select is a roster list on the left with the hero and their kit in a panel on the right, and
// choosing a hero starts the run straight away.

// ---------- shared: the left column and the right panel, as on the pause screen ----------
const MM={X:12,LW:124,PX:146,IY:62,STEP:15};
function mmPanel(acc){const X=MM.PX,Y=8,Wd=W-X-6,Hd=H-16;m2Box(X,Y,Wd,Hd,acc);return {X,Y,Wd,Hd};}
function mmItem(i,y,label,sel,dim,right){m2Pill(MM.X,y-3,MM.LW,13,'#d02030',sel);if(sel){ctx.fillStyle='#ff6070';ctx.fillRect(MM.X,y-3,2,13);}
 txt(label,sel?MM.X+8:MM.X+4,y,dim?'#555':sel?'#fff':'#999');if(right)txt(right,MM.X+MM.LW-4-txtW(right),y,sel?'#ffd8a0':'#666');}
function mmSect(s,x,y,c){txt(s,x,y,c||'#d02030');}

// ---------- the main menu ----------
let mmSel=0;
function mmItems(){const L=[];const sv=savedRun();
 if(sv)L.push({k:'cont',n:'CONTINUE',r:ROMAN[sv.R.di]});
 L.push({k:'new',n:'NEW RUN'},{k:'train',n:'TRAINING'},{k:'rush',n:'BOSS RUSH',lock:!rushOpen()},{k:'tree',n:'SKILL TREE'},{k:'guide',n:'GUIDE'},{k:'set',n:'SETTINGS'});return L;}
function mmDo(it){if(!it)return;sfx('tool');
 if(it.k==='cont')continueRun();else if(it.k==='new')openSelect('menu');else if(it.k==='train'){trainNext=true;startRun(0);}
 else if(it.k==='rush'){if(it.lock){sfx('block');return;}startRush();}else if(it.k==='tree')openTree('menu');else if(it.k==='guide')openGuide('menu');else if(it.k==='set')openOptions('menu');}
const mmY=i=>MM.IY+i*MM.STEP;
const mmHit=()=>{const L=mmItems();for(let i=0;i<L.length;i++)if(m2In(MM.X,mmY(i)-3,MM.LW,13))return i;return -1;};
function titleKey(c){const L=mmItems();mmSel=clamp(mmSel,0,L.length-1);const it=L[mmSel];
 if(c==='ArrowUp'||c==='KeyW'){mmSel=(mmSel+L.length-1)%L.length;sfx('coin');}
 else if(c==='ArrowDown'||c==='KeyS'){mmSel=(mmSel+1)%L.length;sfx('coin');}
 else if((c==='ArrowLeft'||c==='KeyA'||c==='KeyQ'||c==='ArrowRight'||c==='KeyD'||c==='KeyE')&&it.k==='new'&&meta.ascMax){meta.asc=clamp((meta.asc||0)+((c==='ArrowRight'||c==='KeyD'||c==='KeyE')?1:-1),0,meta.ascMax);saveMeta();sfx('coin');}
 else if(c==='Enter'||c==='Space'){if(mouse.down){const h=mmHit();if(h<0)return;mmSel=h;}mmDo(L[mmSel]);}
 else if(c==='KeyC'&&savedRun())continueRun();else if(c==='KeyO')openOptions('menu');else if(c==='KeyK')openGuide('menu');
 else if(c==='KeyY'){trainNext=true;startRun(0);}else if(c==='KeyB'&&rushOpen())startRush();}
// the title card stays as it was; ENTER (or a click) opens the main menu
{const _ok=onKey;onKey=function(c){if(mode==='hub')mode='menu';
 if(mode==='title'&&(c==='Enter'||c==='Space')){mode='menu';mmSel=0;sfx('pickup');return;}
 if(mode==='menu'&&c!=='KeyM'){if(c==='KeyT'){openTest();return;}if(c==='Escape'){mode='title';sfx('coin');return;}titleKey(c);return;}return _ok.apply(this,arguments);};}
cv.addEventListener('mousedown',e=>{if(e.button===0&&mode==='menu'){mouse.down=true;titleKey('Enter');}});
{const _r=render;render=function(){if(mode==='menu'){setView(true);ctx.imageSmoothingEnabled=false;renderMenu();drawCursor();return;}return _r();};}

function renderMenu(){
 bg();ctx.fillStyle='rgba(6,3,10,.62)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(6,3,10,.5)';ctx.fillRect(0,0,MM.PX-6,H);
 const L=mmItems();if(m2Moved()){const h=mmHit();if(h>=0&&h!==mmSel){mmSel=h;sfx('coin');}}mmSel=clamp(mmSel,0,L.length-1);
 // the logo, small, at the top of the column
 txt('SHINOBI',MM.X,10,'#e0b040');{const fl=Math.floor(time*8)%9===0;txt('DUNGEONS',MM.X,19,fl?'#ff6040':'#e02838',3);}
 ctx.fillStyle='#d02030';ctx.fillRect(MM.X,41,MM.LW,1);txt('TWELVE STAGES. ONE EMPEROR.',MM.X,45,'#999');
 L.forEach((it,i)=>mmItem(i,mmY(i),it.n,i===mmSel,it.lock,it.r));
 txt('W/S MOVE  ENTER SELECT  ESC TITLE',MM.X,H-18,'#666');txt('T TEST MODE   V'+GAME_VERSION,MM.X,H-10,'#555');
 // the panel: what the highlighted entry does
 const it=L[mmSel],acc={cont:'#8cf',new:'#d02030',train:'#80ff90',rush:'#f84',tree:JADEC,guide:'#8cf',set:'#e0b040'}[it.k];
 const {X,Y,Wd}=mmPanel(acc),x=X+8;let y=Y+8;
 const para=(s,c,w)=>{for(const l of wrapTxt(s,w||Math.floor((Wd-16)/4.6))){txt(l,x,y,c||'#bbb');y+=8;}};
 const heroAt=(k,st,hx,hy,sc)=>{const sp=heroSpr(k,st);ctx.drawImage(sp.c,WIZ.idle[Math.floor(time*2.5)%2]*sp.fw,0,sp.fw,sp.fh,hx,hy,sp.fw*(sc||1),sp.fh*(sc||1));};
 if(it.k==='cont'){const s=savedRun(),C=CLASSES[s.cls]||CLS();txt('CONTINUE YOUR RUN',x,y,'#fff',2);y+=18;
  ctx.fillStyle='#1e1628';ctx.fillRect(x,y,46,52);heroAt(C.k,(s.P&&s.P.evo)||0,x+3,y+2,2);
  const tx=x+56;txt(C.n,tx,y+2,C.col);txt('STAGE '+ROMAN[s.R.di]+'. '+DUN[s.R.di].name,tx,y+12,'#ffe060');
  {const t=Math.floor(s.R.time||0);txt('TIME '+Math.floor(t/60)+'M '+String(t%60).padStart(2,'0')+'S',tx,y+22,'#aaa');}if(s.R.sen!=null){hudCoin(tx,y+31);txt(String(s.R.sen),tx+10,y+32,'#fc4');}
  y+=60;para(DUN[s.R.di].tale||'','#aa9');}
 else if(it.k==='new'){txt('A NEW RUN',x,y,'#fff',2);y+=18;para('TWELVE STAGES STAND BETWEEN YOU AND THE CORRUPT EMPEROR. CHOOSE YOUR WARRIOR NEXT.','#ddd');y+=4;
  mmSect('THE FIRST STAGE',x,y);y+=9;txt(ROMAN[0]+'. '+DUN[0].name,x,y,'#ffe060');y+=9;para(DUN[0].tale||'','#aa9');y+=4;
  mmSect('ASCENSION',x,y);y+=9;
  if(meta.ascMax){const a=meta.asc||0;txt('< '+a+' / '+meta.ascMax+' >',x,y,a?'#f5a':'#ddd');txt('A/D TO CHANGE',x+70,y,'#666');y+=9;
   txt(a?'FOES +'+a*15+'% HEALTH, FASTER SHOTS. +'+a*20+'% GOLD':'THE GAME AS DESIGNED',x,y,'#999');y+=10;}
  else{txt('WIN A RUN TO UNLOCK',x,y,'#666');y+=10;}
  y+=2;mmSect('RECORD',x,y);y+=9;txt('RUNS '+meta.runs+'   WINS '+meta.wins+'   FURTHEST '+(ROMAN[(meta.reached||0)]||ROMAN[0]),x,y,'#ccc');
  hudJade(x,y+10);txt('JADE '+meta.sen,x+10,y+11,JADEC);}
 else if(it.k==='train'){txt('MASTER KAITO\'S TRIALS',x,y,'#fff',2);y+=18;para('TEN SHORT TRIALS IN THE TRAINING YARD: EVERY ABILITY, DODGING, HEALING, LOOT AND A SPAR. CLEAR THEM ALL FOR A STAR RATING'+(meta.trialsReward?'.':' AND 50 JADE.'),'#ddd');y+=6;
  mmSect('THE TRIALS',x,y);y+=10;LESSONS.forEach((l,i)=>{txt((i+1)+'. '+l.t,x+(i%2)*Math.floor((Wd-16)/2),y+((i/2)|0)*9,'#bbb');});y+=Math.ceil(LESSONS.length/2)*9+6;
  txt('PLAYS AS '+CLS().n,x,y,CLS().col);}
 else if(it.k==='rush'){txt('BOSS RUSH',x,y,'#fff',2);y+=18;para('ALL TWELVE GUARDIANS, BACK TO BACK, IN ONE SITTING. NO SHOPS, NO SAVING.','#ddd');y+=6;
  if(it.lock){txt('LOCKED',x,y,'#e0c070',2);y+=16;para('BEAT 2 GUARDIANS IN A RUN TO OPEN IT.','#999');}
  else{txt(rushPool().length+' GUARDIANS IN THE GAUNTLET',x,y,'#ffd8a0');y+=10;if(meta.rushBest)txt('BEST: '+meta.rushBest.n+' BEATEN',x,y,'#fd4');
   let gx=x;y+=14;rushPool().slice(0,12).forEach(i=>{const s=bossSheet(i);if(!s||!s.c)return;const sc=Math.min(1,26/s.fh,26/s.fw);ctx.drawImage(s.c,0,0,s.fw,s.fh,gx,y,Math.round(s.fw*sc),Math.round(s.fh*sc));gx+=Math.round(s.fw*sc)+3;});}}
 else if(it.k==='tree'){txt('TEMPLE SKILL TREE',x,y,'#fff',2);y+=18;para('SPEND JADE ON PERMANENT UPGRADES FOR EVERY RUN. EIGHT BRANCHES, SMALL NODES AND BIG KEYSTONES.','#ddd');y+=4;
  hudJade(x,y);txt('JADE '+meta.sen,x+10,y+1,JADEC);const av=SKT.nodes.filter(n=>stOpen(n)&&stLv(n.k)<n.max&&meta.sen>=stCost(n)).length;txt(av?av+' NODE'+(av>1?'S':'')+' AFFORDABLE':'NOTHING AFFORDABLE YET',x+80,y+1,av?'#ffd040':'#777');y+=14;
  const bw=Math.floor((Wd-16)/4);STB.forEach((B,b)=>{const bx=x+(b%4)*bw,by=y+((b/4)|0)*28,ns=SKT.nodes.filter(n=>n.b===b),own=ns.filter(n=>stLv(n.k)>0).length;txt(B.n,bx,by,B.c);m2Prog(bx,by+9,bw-10,own/ns.length,B.c);txt(own+'/'+ns.length,bx,by+14,'#888');});y+=58;
  const ks=SKT.nodes.filter(n=>n.big&&!n.free&&stLv(n.k)>0);txt(ks.length+' / '+stKeystones.flat().length+' KEYSTONES LEARNED',x,y,'#aaa');}
 else if(it.k==='guide'){txt('THE GUIDE',x,y,'#fff',2);y+=18;para('EVERYTHING YOU HAVE MET: FOES, GUARDIANS, RELICS, GEAR, POWERS AND TERMS. FIGHT AND FIND THINGS TO FILL IT IN.','#ddd');y+=6;
  GTABS.forEach((t,i)=>{const E=guideEntries(i),g=E.filter(e=>e.u).length,c=(typeof GTABC!=='undefined'&&GTABC[i])||'#8cf';txt(t,x,y,c);m2Prog(x+60,y+2,110,g/Math.max(1,E.length),c);txt(g+'/'+E.length,x+176,y,'#aaa');y+=10;});}
 else if(it.k==='set'){txt('SETTINGS',x,y,'#fff',2);y+=18;
  [['GAMEPLAY','DIFFICULTY, AUTO FIRE, DAMAGE NUMBERS'],['AUDIO','MUSIC AND SOUND VOLUME'],['DISPLAY','SCREEN SHAKE, EFFECTS, SCALING'],['CONTROLS','EVERY KEY CAN BE REBOUND']].forEach(([a,b])=>{txt(a,x,y,'#e0b040');txt(b,x+60,y,'#aaa');y+=11;});
  y+=4;para('M MUTES THE GAME AT ANY TIME.','#777');}
};
// the hub is retired: anything that still sends you there lands on the main menu
renderHub=function(){mode='menu';renderMenu();};

// ---------- character select: roster on the left, the hero and their kit on the right ----------
const SR={X:12,LW:124,IY:34,STEP:13};
const srY=i=>SR.IY+i*SR.STEP;
const SRAB={x:-99,y:-99},srAbAt=(x,y)=>{for(let i=0;i<6;i++)if(x>=SRAB.x+i*22-1&&x<SRAB.x+i*22+14&&y>=SRAB.y-1&&y<SRAB.y+14)return i;return -1;};
selCardAt=function(x,y){for(let i=0;i<CLASSES.length;i++){if(x>=SR.X&&x<SR.X+SR.LW&&y>=srY(i)-3&&y<srY(i)+10)return i;}return -1;};
// choosing a hero starts the run (training first if you have never done it)
selConfirm=function(){if(selLock)return;if(isLocked(selIdx)){sfx('block');return;}selLock=true;selT=time;meta.cls=selIdx;saveMeta();sfx('pickup');
 setTimeout(()=>{if(mode==='select'){selLock=false;startRun(0);}},650);};
{const _sk=selectKey;selectKey=function(c){if(selLock)return;if(selTab===0){
  if(c==='ArrowUp'||c==='KeyW'){selIdx=(selIdx+CLASSES.length-1)%CLASSES.length;sfx('coin');return;}
  if(c==='ArrowDown'||c==='KeyS'){selIdx=(selIdx+1)%CLASSES.length;sfx('coin');return;}
  if(c==='ArrowLeft'||c==='KeyA'){selAb=(selAb+5)%6;selAbT=time+6;sfx('coin');return;}
  if(c==='ArrowRight'||c==='KeyD'){selAb=(selAb+1)%6;selAbT=time+6;sfx('coin');return;}
  if(c==='Escape'){mode='menu';sfx('coin');return;}}
 return _sk(c);};}
// leaving the skill tree goes back to wherever it was opened from
{const _uk=upgradesKey;upgradesKey=function(c){if((c==='Escape'||c==='Tab')&&treeFrom==='menu'){mode='menu';selTab=0;sfx('coin');return;}return _uk(c);};}
{const _ok=onKey;onKey=function(c){if(mode==='select'&&selTab===1&&treeFrom==='menu'&&(c==='Escape')){mode='menu';selTab=0;sfx('coin');return;}return _ok.apply(this,arguments);};}
// the menus and the select screen use the wide view, like the pause screen
{const _sv=setView;setView=function(w){if(mode==='menu'||mode==='select')w=true;return _sv(w);};}

{const _rs=renderSelect;renderSelect=function(){if(selTab===1)return _rs.apply(this,arguments);
 bg();ctx.fillStyle='rgba(6,3,10,.8)';ctx.fillRect(0,0,W,H);
 if(!selLock&&(mouse.x!==selMX||mouse.y!==selMY)){const h=selCardAt(mouse.x,mouse.y);if(h>=0&&h!==selIdx){selIdx=h;sfx('coin');}const a=srAbAt(mouse.x,mouse.y);selAbHover=a>=0;if(a>=0)selAb=a;selMX=mouse.x;selMY=mouse.y;}
 if(selIdx!==selPrev){selPrev=selIdx;selChgT=time;selAbT=time+2.5;}
 if(!selAbHover&&time>selAbT){selAb=(selAb+1)%6;selAbT=time+2.5;}
 const C=CLASSES[selIdx],I=CLSINFO[C.k]||{role:'',diff:2,lore:''},lk=isLocked(selIdx),col=lk?'#6a6074':C.col,e=clamp((time-selChgT)/.22,0,1),ease=1-(1-e)*(1-e);
 // ---- left: title and the roster ----
 txt('WARRIORS',SR.X,10,'#fff',2);ctx.fillStyle='#d02030';ctx.fillRect(SR.X,25,SR.LW,1);
 {const s=Math.min(meta.unlocked||2,CLASSES.length)+'/'+CLASSES.length+' UNLOCKED';txt(s,SR.X,28-0,'#777');}
 CLASSES.forEach((K,i)=>{const y=srY(i)+6,sel=i===selIdx,L=isLocked(i);m2Pill(SR.X,y-3,SR.LW,12,L?'#4a4054':'#d02030',sel);if(sel){ctx.fillStyle=L?'#8a8094':K.col;ctx.fillRect(SR.X,y-3,2,12);}
  const s=heroSpr(K.k,0);ctx.save();ctx.beginPath();ctx.rect(SR.X+4,y-3,12,12);ctx.clip();if(L)ctx.drawImage(silOf(s,K.k),0,0,s.fw,s.fh,SR.X+4,y-4,s.fw*.6,s.fh*.6);else ctx.drawImage(s.c,(sel?WIZ.idle[Math.floor(time*2.5)%2]:0)*s.fw,0,s.fw,s.fh,SR.X+4,y-4,s.fw*.6,s.fh*.6);ctx.restore();
  txt(L?'? ? ?':K.n,SR.X+20,y,L?'#555':sel?'#fff':K.col);if(L)padlock(SR.X+SR.LW-11,y-2,sel?'#e0c070':'#6a5a40');else{const d=(CLSINFO[K.k]||{}).diff||2;for(let j=0;j<d;j++){ctx.fillStyle=d===1?'#6f6':d===2?'#fd4':'#f64';ctx.fillRect(SR.X+SR.LW-6-j*4,y+2,3,3);}}});
 // the skill tree, as a menu entry under the roster
 {const y=srY(CLASSES.length)+12,hov=m2In(SR.X,y-3,SR.LW,12);m2Pill(SR.X,y-3,SR.LW,12,'#3a3420',hov);hudJade(SR.X+4,y-1);txt('SKILL TREE',SR.X+16,y,hov?'#fff':'#c8b890');txt('TAB',SR.X+SR.LW-4-txtW('TAB'),y,'#777');SELTREE.x=SR.X;SELTREE.y=y-3;SELTREE.w=SR.LW;SELTREE.h=12;}
 {const hint=selLock?'':lk?'W/S CHOOSE   ESC BACK':'W/S HERO   A/D SKILL';txt(hint,SR.X,H-18,'#666');if(!selLock&&!lk)txt('ENTER START   ESC BACK',SR.X,H-10,'#666');}
 // ---- right: the panel ----
 const X=MM.PX,Y=8,Wd=W-X-6,Hd=H-16;m2Box(X,Y,Wd,Hd,col);
 // the hero on a lit pedestal
 const cx=X+52,fy=Y+128;
 glowDisc(cx,fy-36,44,col,lk?.4:1);
 for(let i=0;i<12;i++){const ph=(time*.25+i/12)%1,px2=cx-28+((i*37)%56),py=fy-4-ph*86;ctx.globalAlpha=(1-ph)*(lk?.25:.6);ctx.fillStyle=i%3?col:'#fff';ctx.fillRect(px2+Math.round(Math.sin(time+i)*2),Math.round(py),1,1);}ctx.globalAlpha=1;
 ctx.fillStyle='#1a1220';for(let y=0;y<9;y++){const w=Math.round(36*Math.sqrt(1-((y-4)/4.6)**2));ctx.fillRect(cx-w,fy-4+y,w*2,1);}
 ctx.fillStyle='#2e2438';for(let y=0;y<5;y++){const w=Math.round(32*Math.sqrt(1-((y-2)/2.6)**2));ctx.fillRect(cx-w,fy-4+y,w*2,1);}
 for(let i=0;i<24;i++){const a=i/24*TAU+time*.6;ctx.fillStyle=i%2?col:shade(col,-.4);ctx.fillRect(Math.round(cx+Math.cos(a)*28),Math.round(fy-2+Math.sin(a)*3),1,1);}
 const sp=heroSpr(C.k,lk?0:9),SC=4,slide=Math.round((1-ease)*14),fr=selLock?(WIZ.atk||WIZ.idle)[Math.min((WIZ.atk||[0]).length-1,Math.floor((time-selT)/.1))]:heroPose(selIdx,time);
 const dx=Math.round(cx-sp.fw*SC/2)+slide,dy=fy-sp.fh*SC+2;ctx.globalAlpha=ease;
 if(lk){ctx.drawImage(silOf(sp,C.k),fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*SC,sp.fh*SC);padlock(cx-3,fy-54,'#e0c070');}
 else{ctx.drawImage(sp.c,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*SC,sp.fh*SC);if(selLock){const fl=clamp(1-(time-selT)/.4,0,1);if(fl>0){ctx.globalAlpha=fl;ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*SC,sp.fh*SC);}}}
 ctx.globalAlpha=1;
 {const nm=lk?'? ? ?':C.n,sz=txtW(nm,2)>96?1:2;txt(nm,cx-Math.round(txtW(nm,sz)/2),fy+8,col,sz);txt(I.role,cx-Math.round(txtW(I.role)/2),fy+(sz===2?24:18),lk?'#666':'#bbb');}
 // the details
 const px=X+110,pw=X+Wd-8-px;let y=Y+8;ctx.globalAlpha=ease;
 {txt('DIFFICULTY',px,y,'#888');for(let i=0;i<3;i++){const on=i<I.diff;ctx.fillStyle=on?(I.diff===1?'#6f6':I.diff===2?'#fd4':'#f64'):'#2a2030';ctx.fillRect(px+46+i*7,y,5,5);}
  const s=['','EASY','MEDIUM','HARD'][I.diff];txt(s,px+70,y,I.diff===1?'#6f6':I.diff===2?'#fd4':'#f64');}
 y+=12;
 if(lk){const n=runsToUnlock(selIdx),need=Math.max(1,selIdx-1),done=Math.max(0,need-n);
  txt('LOCKED',px,y,'#e0c070',2);y+=18;for(const l of wrapTxt('A NEW WARRIOR JOINS AFTER EVERY RUN, WIN OR LOSE. TRAINING DOES NOT COUNT.',Math.floor(pw/4.6))){txt(l,px,y,'#aaa');y+=8;}
  y+=6;txt('UNLOCKS IN '+n+' MORE RUN'+(n>1?'S':''),px,y,'#ddd');segBar(px,y+10,done/need,'#e0c070',Math.min(10,need));}
 else{
  for(const l of wrapTxt(I.lore+' '+C.d,Math.floor(pw/4.6)).slice(0,3)){txt(l,px,y,'#ddd');y+=8;}y+=3;
  mmSect('STATS',px,y);y+=9;
  const ST=[['HEALTH',Math.round(100*C.hp)+' HP',(C.hp-.7)/.7],['SPEED',Math.round(100*C.spd)+'%',(C.spd-.85)/.35],['DASH',(C.dash<=1?'FAST':'SLOW')+' '+Math.round(100/C.dash)+'%',(1.3-C.dash)/.7],['DEFENCE','+'+(C.def||0),((C.def||0)+.5)/4],['POWER',Math.round(100*(C.pw||1))+'%',((C.pw||1)-.8)/.5]];
  ST.forEach(([n,v,f])=>{txt(n,px,y,'#999');segBar(px+44,y+1,f,C.col);txt(v,px+pw-txtW(v),y,'#ddd');y+=8;});y+=4;
  mmSect('ABILITIES',px,y);y+=10;
  const ay=y;SRAB.x=px;SRAB.y=ay;[...SLOTS].forEach((k,i)=>{const s=SPELLS[k][C.kit[k]],x=px+i*22,f=i===selAb;spellBox(x,ay,s,true);if(f){ctx.fillStyle=C.col;ctx.fillRect(x-2,ay-2,17,1);ctx.fillRect(x-2,ay+14,17,1);ctx.fillRect(x-2,ay-2,1,17);ctx.fillRect(x+14,ay-2,1,17);}
   txt(SLOTKEY[k],x+6-Math.round(txtW(SLOTKEY[k])/2),ay+17,f?'#fff':'#666');});
  y+=27;{const k=SLOTS[selAb],s=SPELLS[k][C.kit[k]];txt(s.n,px,y,s.c);const tag=k==='m'?'BASIC - '+WSIG[C.k]:k==='h'?'HEAVY (HOLD)':k==='e'?'ULTIMATE':'ABILITY';txt(tag,px+pw-txtW(tag),y,'#777');y+=9;
   for(const l of wrapTxt(s.d||'',Math.floor(pw/4.6)).slice(0,2)){txt(l,px,y,'#bbb');y+=8;}}
  y=Math.max(y+4,Y+Hd-34);mmSect('EVOLUTION',px,y);
  {const r=(meta.cst&&meta.cst[C.k])||{runs:0,wins:0,best:0},rs=r.runs?('RUNS '+r.runs+'  BEST '+(ROMAN[r.best-1]||'-')+'  WINS '+r.wins):'NOT PLAYED YET';txt(rs,px+pw-txtW(rs),y,r.wins?'#fd4':'#777');}
  y+=8;[0,3,6,9].forEach((st,i)=>{const sp2=heroSpr(C.k,st),x=px+i*22;ctx.drawImage(sp2.c,WIZ.idle[Math.floor(time*2.5+i)%2]*sp2.fw,0,sp2.fw,sp2.fh,x-2,y-2,sp2.fw,sp2.fh);if(i<3){ctx.fillStyle='#555';ctx.fillRect(x+18,y+10,3,1);}});
  txt('MASTERS INTO',px+92,y+4,'#777');txt(heroEV(C.k,9).n,px+92,y+12,C.col);}
 ctx.globalAlpha=1;
 // the confirm sweep, then the run begins
 if(selLock){const t=time-selT,k=clamp(t/.25,0,1),bw=Math.round(W*k),by=Math.round(H/2-13);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(0,by,bw,26);ctx.fillStyle=C.col;ctx.fillRect(0,by,bw,1);ctx.fillRect(0,by+25,bw,1);
  if(k>=1){const s=C.n+' - TO BATTLE';txt(s,Math.round((W-txtW(s,2))/2),by+7,'#fff',2);}}
};}
