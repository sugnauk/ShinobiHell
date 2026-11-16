'use strict';
// HELL OF THE EMPEROR - character select, skill tree, campfire, guide, options, saving, tutorial (part of the former game.js; files load in numeric order, see index.html)
// ---------- character select ----------
// Opens after the title screen and from the temple's CHARACTER row.
let selIdx=0,selFrom='title',selLock=false,selT=0,selMX=-1,selMY=-1;
const SELCARD={w:56,h:64,gap:4,x0:12,y:24};
function openSelect(from){selFrom=from;selIdx=(meta.cls||0)%CLASSES.length;selLock=false;selTab=0;selMX=mouse.x;selMY=mouse.y;mode='select';sfx('pickup');}
// second tab on the select screen: spend sen on permanent temple upgrades between runs
let selTab=0,selUp=0;
const upRowY=i=>36+i*20;
function upRowAt(x,y){for(let i=0;i<UPG.length;i++){const ry=upRowY(i);if(x>=16&&x<=W-16&&y>=ry-3&&y<ry+16)return i;}return -1;}
// ================= TEMPLE SKILL TREE: four branches, each node unlocks the next =================
// the six original upgrades are nodes here (same keys in meta.up, so bought ranks carry over)
const TREE=[
 {n:'WAR',c:'#ff5050',nodes:[
  {k:'atk',n:'MIGHT',d:'+2 SPELL POWER PER RANK',base:40,max:10},
  {k:'crit',n:'KEEN EDGE',d:'+3% CRIT CHANCE PER RANK',base:60,max:5,req:['atk',3]},
  {k:'bossd',n:'SLAYER',d:'+8% DAMAGE TO BOSSES AND ELITES PER RANK',base:120,max:3,req:['crit',2]},
  {k:'wrath',n:'WRATH',d:'+10% POWER PER RANK',base:350,max:2,req:['bossd',3]}]},
 {n:'BODY',c:'#50e060',nodes:[
  {k:'vit',n:'VITALITY',d:'+12 MAX HP PER RANK',base:30,max:10},
  {k:'pos',n:'RESOLVE',d:'+10 STUN RESIST PER RANK',base:30,max:10,req:['vit',2]},
  {k:'iron',n:'IRON SKIN',d:'+1 DEFENCE PER RANK',base:70,max:5,req:['pos',3]},
  {k:'res',n:'SECOND WIND',d:'+1 RESURRECTION PER RANK',base:300,max:2,req:['iron',2]}]},
 {n:'SPIRIT',c:'#40c0ff',nodes:[
  {k:'emb',n:'FOCUS',d:'-4% COOLDOWNS PER RANK',base:35,max:8},
  {k:'swift',n:'SWIFT FEET',d:'+3% MOVE SPEED PER RANK',base:50,max:5,req:['emb',2]},
  {k:'dashm',n:'DASH MASTERY',d:'-8% DASH COOLDOWN PER RANK',base:110,max:3,req:['swift',2]},
  {k:'flow',n:'PERFECT FORM',d:'PERFECT DODGES HEAL 3% HP PER RANK',base:280,max:2,req:['dashm',2]}]},
 {n:'FORTUNE',c:'#ffd040',nodes:[
  {k:'sen',n:'GREED',d:'+10% GOLD PER RANK',base:50,max:8},
  {k:'purse',n:'WAR CHEST',d:'START EACH RUN WITH +40 GOLD PER RANK',base:80,max:3,req:['sen',2]},
  {k:'belt',n:'POTION BELT',d:'START EACH RUN WITH +1 HP POTION PER RANK',base:200,max:2,req:['purse',2]},
  {k:'heir',n:'HEIRLOOM',d:'START EACH RUN WITH A RANDOM RELIC PER RANK',base:400,max:2,req:['belt',1]}]}];
const TNODE={};TREE.forEach((b,bi)=>b.nodes.forEach((n,ti)=>{TNODE[n.k]=Object.assign(n,{bi,ti});}));
const upLv=k=>(meta.up&&meta.up[k])||0,tCost=n=>n.base*(upLv(n.k)+1),tOpen=n=>!n.req||upLv(n.req[0])>=n.req[1];
let treeB=0,treeT=0,treeFrom='select';
function tBuy(n){const lv=upLv(n.k);if(lv>=n.max){sfx('block');return;}if(!tOpen(n)){sfx('block');setToast('LOCKED: NEEDS '+TNODE[n.req[0]].n+' '+n.req[1],'#c55',2);return;}
 const c=tCost(n);if(meta.sen<c){sfx('block');return;}meta.sen-=c;meta.up[n.k]=lv+1;saveMeta();sfx('pickup');}
const tNodeXY=(bi,ti)=>[10+bi*76,30+ti*27];
function tNodeAt(x,y){for(let bi=0;bi<4;bi++)for(let ti=0;ti<4;ti++){const [nx,ny]=tNodeXY(bi,ti);if(x>=nx&&x<nx+70&&y>=ny&&y<ny+20)return [bi,ti];}return null;}
function renderUpgrades(){
 ctxt('TEMPLE SKILL TREE',4,'#d02030',2);{const s='GOLD '+meta.sen;txt(s,W-8-txtW(s),8,'#fc4');}
 if(mouse.x!==selMX||mouse.y!==selMY){const h=tNodeAt(mouse.x,mouse.y);if(h){treeB=h[0];treeT=h[1];}selMX=mouse.x;selMY=mouse.y;}
 TREE.forEach((b,bi)=>{const [bx]=tNodeXY(bi,0);txt(b.n,bx+35-Math.round(txtW(b.n)/2),22,b.c);
  b.nodes.forEach((n,ti)=>{const [x,y]=tNodeXY(bi,ti),lv=upLv(n.k),open=tOpen(n),mx=lv>=n.max,sel=bi===treeB&&ti===treeT,can=open&&!mx&&meta.sen>=tCost(n);
   if(ti>0){ctx.fillStyle=open?b.c:'#3a2e44';ctx.fillRect(x+34,y-7,2,7);}
   ctx.fillStyle=sel?'rgba(60,40,70,.95)':'rgba(20,12,26,.92)';ctx.fillRect(x,y,70,20);
   ctx.fillStyle=!open?'#3a2e44':mx?'#ffd040':lv?b.c:shade(b.c,-.5);ctx.fillRect(x,y,70,1);ctx.fillRect(x,y+19,70,1);ctx.fillRect(x,y,1,20);ctx.fillRect(x+69,y,1,20);
   if(sel){ctx.fillStyle='#fff';ctx.fillRect(x-1,y-1,72,1);ctx.fillRect(x-1,y+20,72,1);ctx.fillRect(x-1,y-1,1,22);ctx.fillRect(x+70,y-1,1,22);}
   txt(n.n,x+4,y+4,!open?'#555':lv?'#fff':'#bbb');
   for(let p=0;p<n.max;p++){ctx.fillStyle=p<lv?b.c:'#3a2e44';ctx.fillRect(x+4+p*(n.max>6?6:8),y+12,n.max>6?4:6,3);}
   if(!open)padlock(x+59,y+5,'#555');else if(can&&!mx){ctx.fillStyle=Math.floor(time*3)%2?'#ffd040':'#a08020';ctx.fillRect(x+63,y+4,3,3);}});});
 const n=TREE[treeB].nodes[treeT],lv=upLv(n.k),mx=lv>=n.max,open=tOpen(n),b=TREE[treeB];
 ctx.fillStyle='rgba(20,12,26,.95)';ctx.fillRect(10,140,W-20,28);ctx.fillStyle=b.c;ctx.fillRect(10,140,2,28);
 txt(n.n+'  '+lv+'/'+n.max,16,144,b.c);txt(n.d,16,153,'#ddd');
 const s=mx?'MAXED':!open?'NEEDS '+TNODE[n.req[0]].n+' '+n.req[1]:tCost(n)+' GOLD';txt(s,W-16-txtW(s),144,mx?'#6f6':!open?'#c55':meta.sen>=tCost(n)?'#fc4':'#666');
 txt(mx?'':open?'ENTER OR CLICK TO BUY THE NEXT RANK':'BUY THE NODE ABOVE TO UNLOCK',16,161,'#888');
 ctxt('ARROWS MOVE   ENTER BUY   '+(treeFrom==='hub'?'ESC BACK':'TAB CHARACTERS   ESC BACK'),H-7,'#666');}
function upgradesKey(c){
 if(c==='ArrowUp'||c==='KeyW')treeT=(treeT+3)%4;
 else if(c==='ArrowDown'||c==='KeyS')treeT=(treeT+1)%4;
 else if(c==='ArrowLeft'||c==='KeyA')treeB=(treeB+3)%4;
 else if(c==='ArrowRight'||c==='KeyD')treeB=(treeB+1)%4;
 else if(c==='Enter'||c==='Space')tBuy(TREE[treeB].nodes[treeT]);
 else if(c==='Escape'||c==='Tab'){if(treeFrom==='hub'){mode='hub';selTab=0;}else selTab=0;sfx('coin');}}
function openTree(from){openSelect(from);selTab=1;treeFrom=from;}
function selCardAt(x,y){const c=SELCARD;for(let i=0;i<CLASSES.length;i++){const cx=c.x0+i*(c.w+c.gap);if(x>=cx&&x<cx+c.w&&y>=c.y-3&&y<c.y+c.h)return i;}return -1;}
const isLocked=i=>i>=(meta.unlocked||2);
const runsToUnlock=i=>i-(meta.unlocked||2)+1;
// dark silhouette of a sprite sheet, for characters you have not unlocked yet
const SILC={};
function silOf(sp,k){return SILC[k]||(SILC[k]=mk(sp.c.width,sp.c.height,g=>{g.drawImage(sp.c,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#07040a';g.fillRect(0,0,sp.c.width,sp.c.height);}));}
function padlock(x,y,col){ctx.fillStyle='#14101a';ctx.fillRect(x-1,y-1,9,11);ctx.fillStyle=col;ctx.fillRect(x+1,y,5,1);ctx.fillRect(x+1,y,1,4);ctx.fillRect(x+5,y,1,4);ctx.fillRect(x,y+4,7,5);ctx.fillStyle='#14101a';ctx.fillRect(x+3,y+5,1,2);}
function selConfirm(){if(selLock)return;if(isLocked(selIdx)){sfx('block');return;}selLock=true;selT=time;meta.cls=selIdx;saveMeta();sfx('pickup');
 setTimeout(()=>{if(mode==='select'){mode='hub';hubSel=0;selLock=false;}},600);}
function selectKey(c){
 if(selLock)return;
 if(selTab===1){upgradesKey(c);return;}
 if(c==='Tab'){selTab=1;treeFrom='select';sfx('coin');return;}
 if(c==='ArrowLeft'||c==='KeyA'){selIdx=(selIdx+CLASSES.length-1)%CLASSES.length;sfx('coin');}
 else if(c==='ArrowRight'||c==='KeyD'){selIdx=(selIdx+1)%CLASSES.length;sfx('coin');}
 else if(/^Digit[1-9]$/.test(c)){const i=+c.slice(5)-1;if(i<CLASSES.length&&i!==selIdx){selIdx=i;sfx('coin');}}
 else if(c==='Enter'||c==='Space')selConfirm();
 else if(c==='Escape')mode=selFrom==='hub'?'hub':'title';
}
function selClick(){if(selTab===1){stClick();return;} // the temple skill tree (src/98-skilltree.js)
 const h=selCardAt(mouse.x,mouse.y);if(h<0)return;if(h!==selIdx){selIdx=h;sfx('coin');}selConfirm();}
function renderSelect(){
 bg();ctx.fillStyle='rgba(8,4,12,.78)';ctx.fillRect(0,0,W,H);
 if(selTab===1){renderUpgrades();return;}
 // hovering a card selects it (only when the mouse actually moves, so keys still win)
 if(!selLock&&(mouse.x!==selMX||mouse.y!==selMY)){const h=selCardAt(mouse.x,mouse.y);if(h>=0&&h!==selIdx){selIdx=h;sfx('coin');}selMX=mouse.x;selMY=mouse.y;}
 ctxt('CHOOSE YOUR CHARACTER',6,'#d02030',2);
 {const s=Math.min(meta.unlocked||2,CLASSES.length)+'/'+CLASSES.length;txt(s,312-txtW(s),10,'#666');}
 const c=SELCARD,flash=selLock?clamp(1-(time-selT)/.45,0,1):0;
 CLASSES.forEach((C,i)=>{
  const sel=i===selIdx,lk=isLocked(i),col=lk?'#5a5064':C.col,x=c.x0+i*(c.w+c.gap),y=c.y-(sel?3:0),sp=heroSpr(C.k,0);
  ctx.fillStyle=sel?(lk?'#1c1622':'#2a1a30'):(lk?'#0c080e':'#140c18');ctx.fillRect(x,y,c.w,c.h);
  if(sel&&!lk){ctx.fillStyle=C.col;for(let k=0;k<4;k++){ctx.globalAlpha=.05+k*.04;ctx.fillRect(x+1,y+c.h-1-(4-k)*8,c.w-2,8);}ctx.globalAlpha=1;}
  ctx.fillStyle=sel?col:'#3a2e44';ctx.fillRect(x,y,c.w,1);ctx.fillRect(x,y+c.h-1,c.w,1);ctx.fillRect(x,y,1,c.h);ctx.fillRect(x+c.w-1,y,1,c.h);
  if(sel){ctx.fillRect(x,y,c.w,3);if(Math.floor(time*3)%2===0){txt('>',x-5,y+28,col);txt('<',x+c.w+2,y+28,col);}}
  txt(String(i+1),x+3,y+5,sel?'#fff':'#555');
  shadow(x+c.w/2,y+52,sel?20:16);
  const fr=sel&&!lk?WIZ.walk[Math.floor(time*8)%4]:WIZ.idle[Math.floor(time*2.5+i)%2];
  const dx=Math.round(x+c.w/2-sp.fw),dy=y+6;
  if(lk){
   // locked: a dark silhouette with a rim of light and a padlock
   ctx.globalAlpha=sel?.55:.3;ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx-1,dy,sp.fw*2,sp.fh*2);ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx+1,dy,sp.fw*2,sp.fh*2);
   ctx.globalAlpha=1;ctx.drawImage(silOf(sp,C.k),fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*2,sp.fh*2);
   padlock(x+c.w/2-3,y+24,sel?'#e0c070':'#8a7a50');
   ctxt2('???',x,c.w,y+c.h-9,sel?'#aaa':'#555');
  }else{
   if(!sel)ctx.globalAlpha=.5;
   ctx.drawImage(sp.c,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*2,sp.fh*2);
   if(sel&&flash>0){ctx.globalAlpha=flash;ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*2,sp.fh*2);}
   ctx.globalAlpha=1;
   ctxt2(C.n,x,c.w,y+c.h-9,sel?C.col:'#777');
  }
 });
 // detail panel for the highlighted character
 const C=CLASSES[selIdx],py=96;
 ctx.fillStyle='rgba(20,12,26,.92)';ctx.fillRect(8,py-5,304,78);
 if(isLocked(selIdx)){
  ctx.fillStyle='#5a5064';ctx.fillRect(8,py-5,304,1);
  padlock(16,py+1,'#e0c070');txt('LOCKED',28,py,'#aaa',2);
  const n=runsToUnlock(selIdx);
  txt('FINISH '+n+' MORE RUN'+(n>1?'S':'')+' TO UNLOCK THIS CHARACTER.',16,py+18,'#ddd');
  txt('A NEW CHARACTER JOINS AFTER EVERY RUN, WIN OR LOSE.',16,py+30,'#888');
  txt('TRAINING DOES NOT COUNT.',16,py+40,'#666');
  ctx.globalAlpha=.6;const m=heroSpr(C.k,9);ctx.drawImage(silOf(m,C.k+'9'),WIZ.idle[Math.floor(time*2.5)%2]*m.fw,0,m.fw,m.fh,252,py+20,m.fw*2,m.fh*2);ctx.globalAlpha=1;
  ctxt('THIS CHARACTER IS LOCKED',H-7,'#a66');
  return;
 }
 ctx.fillStyle=C.col;ctx.fillRect(8,py-5,304,1);
 txt(C.n,16,py,C.col,2);
 {const s='MASTERS INTO '+heroEV(C.k,9).n;txt(s,304-txtW(s),py+3,'#888');}
 txt(C.d,16,py+14,'#ddd');
 const ST=[['HEALTH',(C.hp-.7)/.7],['SPEED',(C.spd-.9)/.3],['DASH',(1.3-C.dash)/.7],['DEFENSE',(C.def+.5)/4],['POWER',((C.pw||1)-.8)/.5]];
 ST.forEach(([n,f],i)=>{const y=py+26+i*9;txt(n,16,y,'#aaa');bar(56,y,62,4,f,C.col,'#2a2030');});
 txt('STARTS WITH T0 '+WSIG[C.k]+'  SIGNATURE: +25% LMB',16,py+70,'#e0b040');
 txt('STARTING KIT',132,py+24,'#d02030');
 [...SLOTS].forEach((k,i)=>{const s=SPELLS[k][C.kit[k]],y=py+33+i*7;txt(SLOTKEY[k],132,y,'#777');txt(s.n,150,y,s.c);});
 // the fully evolved form, so you can see where the class ends up
 const m=heroSpr(C.k,9);shadow(272,py+66,18);
 ctx.drawImage(m.c,WIZ.idle[Math.floor(time*2.5)%2]*m.fw,0,m.fw,m.fh,252,py+20,m.fw*2,m.fh*2);
 ctxt(selLock?'READY':'A/D CHOOSE  ENTER CONFIRM  TAB UPGRADES ('+meta.sen+' GOLD)  K GUIDE',H-7,selLock?'#fff':'#888');
}
// ===== BETWEEN STAGES: a campfire with your master. He briefs you, and this is where you evolve =====
const MASTER='MASTER KAITO';
const MASTER_LINES=['THE FOREST GUARDIAN HAS FALLEN. THE MARSHES GUARD THE CASTLE FLANK - KEEP LOW AND KEEP MOVING.',
 'GOOD. BENEATH THE HILLS RUN THE SMUGGLERS TUNNELS. THEY COME OUT IN THE CASTLE TOWN.',
 'THE TUNNELS ARE CLEAR. THE TOWN BURNS - THE EMPEROR TORCHED IT TO SLOW YOU DOWN.',
 'THE TOWN IS AVENGED. NOW THE MOUNTAIN PASS. THE COLD WILL TEST YOU MORE THAN STEEL.',
 'THE GATES ARE IN SIGHT. THE OUTER WALLS HAVE NEVER FALLEN. MAKE HISTORY.',
 'THE WALLS ARE BREACHED. THE TEMPLE BELLS RING FOR THE EMPEROR - SILENCE THEM.',
 'THE ABBOT IS FREE OF HIS OATH. BENEATH THE KEEP LIE THE IRON CELLARS.',
 'YOU WALK INSIDE THE CASTLE NOW. THE KEEP HALLS ARE FULL OF HIS GUARD.',
 'THE KEEP IS OURS. ONLY THE ROYAL GARDENS STAND BEFORE THE PALACE.',
 'THE JADE PALACE. HIS LAST AND MOST LOYAL SERVANT WAITS INSIDE.',
 'THE THRONE ROOM IS NEXT. THE CORRUPT EMPEROR. END THIS, MY STUDENT.'];
let CS=null;
function openMaster(){CS={step:0,t0:time,next:R.di+1,line:MASTER_LINES[R.di]||'ONWARD.'};mode='master';sfx('pickup');}
function masterKey(c){if(!CS||!['Enter','Space','KeyG','KeyE'].includes(c))return;const t=time-CS.t0;
 if(CS.step===0){if(t<.6)return;if(R.evoPending){CS.step=1;CS.t1=time;CS.from=P.evo||0;evolve();R.evoPending=false;}else{CS.step=2;CS.t2=time;}sfx('pickup');}
 else if(CS.step===1){if(time-CS.t1<1.8)return;CS.step=2;CS.t2=time;sfx('pickup');}
 else{const n=CS.next;CS=null;mode='play';loadDungeon(n);sfx('pickup');}}
function renderMaster(){const t=time-CS.t0;
 // a night camp on the hillside, the emperor's palace on the horizon
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0818');g.addColorStop(1,'#1e1430');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 for(let i=0;i<46;i++){ctx.fillStyle=(i*7+Math.floor(time*2))%13===0?'#fff':'#7a7aa0';ctx.fillRect((i*53+7)%W,(i*29)%76,1,1);}
 disc(262,30,12,'#f0e0b0');disc(267,26,11,'#0f0c1e');
 ctx.fillStyle='#160f22';for(let x=0;x<W;x++){const h=Math.floor(18+10*Math.sin(x*.03)+6*Math.sin(x*.09+2));ctx.fillRect(x,96-h,1,h+40);}
 // the castle: walls, keep and a glowing throne-room window
 ctx.fillStyle='#0c0814';ctx.fillRect(196,62,60,24);ctx.fillRect(212,48,28,16);ctx.fillRect(208,46,36,3);ctx.fillRect(218,36,16,12);ctx.fillRect(214,34,24,3);ctx.fillRect(223,28,6,7);
 for(let i=0;i<6;i++)ctx.fillRect(196+i*10,58,5,4);ctx.fillStyle=Math.floor(time*2)%2?'#ff4030':'#c02010';ctx.fillRect(225,40,2,3);
 // bamboo at the edges, the ground
 for(const bx of [6,14,24,292,302,312]){ctx.fillStyle='#0e1a10';ctx.fillRect(bx,0,3,H);for(let y=10;y<H;y+=14)ctx.fillRect(bx-1,y,5,1);}
 ctx.fillStyle='#120e18';ctx.fillRect(0,124,W,56);ctx.fillStyle='#1a1422';ctx.fillRect(0,124,W,2);
 // campfire with warm glow
 const fx=160,fy=126;ctx.globalAlpha=.16+.05*Math.sin(time*7);disc(fx,fy-4,34,'#ff8a30');ctx.globalAlpha=.1;disc(fx,fy-4,56,'#ff6020');ctx.globalAlpha=1;
 ctx.fillStyle='#3a2414';ctx.fillRect(fx-9,fy,18,3);ctx.fillRect(fx-6,fy-1,12,2);
 for(let i=0;i<4;i++){const h=8+((Math.sin(time*9+i*1.7)+1)*3|0);ctx.fillStyle=i%2?'#ff6020':'#ffb040';ctx.fillRect(fx-5+i*3,fy-h,2,h);}ctx.fillStyle='#fff6c0';ctx.fillRect(fx-1,fy-6,2,3);
 // master (left) and you (right, facing him), drawn twice size
 const ms=heroSpr('wizard',9),ps=heroSpr(CLS().k,P.evo||0),fr=WIZ.idle[Math.floor(time*2.5)%2];
 ctx.drawImage(ms.c,fr*ms.fw,0,ms.fw,ms.fh,96,fy-46,ms.fw*2,ms.fh*2);
 ctx.save();ctx.translate(222+ps.fw*2,0);ctx.scale(-1,1);ctx.drawImage(ps.c,fr*ps.fw,0,ps.fw,ps.fh,0,fy-46,ps.fw*2,ps.fh*2);
 // evolution: white flash on you, then your new form
 if(CS.step===1){const e=time-CS.t1;if(e<1.2){ctx.globalAlpha=.5+.5*Math.sin(e*20);ctx.drawImage(ps.wc,fr*ps.fw,0,ps.fw,ps.fh,0,fy-46,ps.fw*2,ps.fh*2);ctx.globalAlpha=1;}}
 ctx.restore();
 if(CS.step===1){const e=time-CS.t1;for(let i=0;i<14;i++){const a=i/14*TAU+e*2,r=10+e*30;ctx.fillStyle=i%2?'#ffe060':'#fff';ctx.fillRect(Math.round(242+Math.cos(a)*r),Math.round(fy-24+Math.sin(a)*r*.6-e*10),1,2);}}
 // dialogue
 ctx.fillStyle='rgba(10,6,16,.94)';ctx.fillRect(10,138,W-20,38);ctx.fillStyle='#e0b040';ctx.fillRect(10,138,W-20,1);
 let who=MASTER,lines=[],col='#ddd';
 if(CS.step===0){const s=CS.line.slice(0,Math.floor(t*45));lines=wrapTxt(s,72);}
 else if(CS.step===1){const e=time-CS.t1;lines=e<1.2?['STAND STILL. LET THE LESSON SETTLE INTO YOU...']:['YOU HAVE GROWN. YOU ARE NOW: '+evoName(P.evo||0)];col=e<1.2?'#ddd':'#ffe060';}
 else{who='NEXT';const d=DUN[CS.next];lines=[ROMAN[CS.next]+'. '+d.name,d.story||''];col='#fff';}
 txt(who,16,141,'#e0b040');lines.slice(0,3).forEach((l,i)=>txt(l,16,151+i*8,col));
 if(Math.floor(time*2)%2)txt('ENTER',W-36,168,'#888');}
// ===== THE GUIDE: everything you have encountered, unlocked by defeating / finding / opening it =====
function G(c,k){if(!meta||!R||R.training)return;meta.guide=meta.guide||{};const g=meta.guide[c]||(meta.guide[c]={});if(g[k])return;g[k]=1;saveMeta();if(P)txtFx(P.x,P.y-22,'NEW GUIDE ENTRY (K)','#8cf');}
let guideTab=0,guideSel=0,guideFrom='hub';
const GTABS=['BEASTS','BOSSES','RELICS','GEAR','POWERS','STATS','TERMS'];
const PATW={gapring:'A RING WITH A GAP',spiral:'A SPINNING SPIRAL',wall:'A WALL WITH A HOLE',flower:'A FLOWER BURST',stream:'A STREAM OF SHOTS',cross:'A ROTATING CROSS',mines:'MINES THAT BURST',
 curtain:'A CURVING CURTAIN',web:'A SPIDER WEB',rain:'TELEGRAPHED RAIN',lance:'AIMED LANCES',orbitring:'AN ORBITING RING'};
const STW={wave:'WAVY',accel:'SPEEDING UP',curve:'CURVING',boom:'BOOMERANG',split:'SPLITTING',mine:'TIMED MINE',big:'HEAVY',bounce:'BOUNCING',seek:'HOMING',orbit:'ORBITING',zig:'ZIGZAG',lance:'LANCE'};
const AIW={melee:'CLOSES IN TO STRIKE',ranged:'KEEPS ITS DISTANCE AND SHOOTS',dasher:'DARTS AND DASHES AROUND',bomber:'RUSHES IN AND EXPLODES',turret:'STAYS PUT AND SHOOTS'};
function atkWords(a){if(a.n==='shoot')return 'SHOOTS '+(a.pat?PATW[a.pat]||a.pat.toUpperCase():(a.cnt>1?a.cnt+' SHOTS':'A SHOT'))+(a.st&&STW[a.st]?' ('+STW[a.st]+')':'');
 return {slash:'SLASHES',thrust:'LUNGES',slam:'SLAMS THE GROUND (RED CIRCLE: MOVE!)',charge:'CHARGES IN A LINE',leap:'LEAPS ONTO YOU',summon:'SUMMONS HELP',blink:'BLINKS BEHIND YOU'}[a.n]||String(a.n).toUpperCase();}
const BAGDESC=['A COMMON ITEM OR TWO','A DECENT PIECE OF GEAR','GEAR, MAYBE AN ELIXIR','BETTER (OFTEN EPIC) GEAR AND EXTRAS','SUPER RARE. ALWAYS HOLDS A LEGENDARY','TWO DIFFERENT ENCHANTS',
 'A LEGENDARY SCROLL AND AN ELIXIR','TWO EPIC PIECES, ONE A WEAPON','THE USUAL BOSS BAG: EPICS, MAYBE A SCROLL','AN EPIC RING AND ELIXIRS','ONE OR TWO RELICS','AN EPIC WEAPON OF ANY TYPE AND AN ENCHANT'];
const TERMS=[['FOCUS (SHIFT)','HOLD SHIFT TO MOVE SLOWLY. YOUR HITBOX SHRINKS','AND SHOWS AS A DOT. USE IT TO THREAD TIGHT BULLETS'],
 ['HITBOX','ONLY THE SMALL DOT AT YOUR CHEST CAN BE HIT.','YOUR HAT, WEAPON AND ROBE NEVER COUNT'],
 ['DASH (SPACE)','A QUICK SIDESTEP. YOU CANNOT BE HIT WHILE','DASHING. IT RECHARGES IN UNDER A SECOND'],
 ['PERFECT DODGE','DASH THROUGH A SHOT JUST AS IT HITS: NEARBY','BULLETS SHATTER AND YOUR NEXT ATTACK IS EMPOWERED'],
 ['GRAZE','BULLETS THAT BRUSH PAST YOU CUT YOUR COOLDOWNS'],
 ['STUN','THE YELLOW BAR UNDER A FOE. HITS FILL IT. A FULL','BAR STUNS THEM: STUNNED FOES TAKE +50% DAMAGE'],
 ['DEATHBLOW','WITH THE EXECUTIONER MARK RELIC, HITTING A','STUNNED FOE KILLS IT (BOSSES LOSE 3% HP)'],
 ['COMBO','HITS IN A ROW WITHIN 2 SECONDS. MILESTONES AT 25'],
 ['SURVIVAL PHASE','WHEN A BOSS CHANGES PHASE IT TURNS INVULNERABLE,','HOLDS STILL AND FIRES EVERYTHING. JUST SURVIVE'],
 ['RED CIRCLES','TELEGRAPHED STRIKES. THEY CANNOT BE WARDED.','GET OUT BEFORE THEY BURST'],
 ['CURSE','TAKE +25% DAMAGE, DEAL +30%, PER CURSE, ALL RUN.','YOUR NEXT KILL DROPS A RARE BAG'],
 ['EMPOWERED','+60% POWER AND -30% COOLDOWN FOR ONE SLOT'],
 ['SIGNATURE WEAPON','YOUR CLASS WEAPON TYPE: +25% LMB DAMAGE'],
 ['EFFECT COLOURS','RED DAMAGE, GREEN HEAL, ORANGE FIRE, ICE FROST,','YELLOW STORM, LIME POISON, CYAN SPEED, STEEL GUARD'],
 ['STRENGTH I - IV','I IS A CHANCE OR SMALL. IV IS HUGE'],
 ['CAMERA',', AND . ROTATE THE VIEW 90 DEGREES']];
function guideEntries(tab){const g=meta.guide||{},has=(c,k)=>!!(g[c]&&g[c][k]);
 if(tab===0)return Object.keys(ET).filter(t=>!['dummy','turret'].includes(t)).map(t=>{const T=ET[t],u=has('e',t);return {n:T.n||t.toUpperCase(),u,col:'#ddd',spr:()=>getSpr(t,0),
  L:u?[T.desc||AIW[T.ai]||'',...(T.atks||[]).map(atkWords),T.volley?'WHEN HURT: '+atkWords(T.volley):'','HEALTH '+T.hp+'   SPEED '+T.spd+(T.fly?'   FLIES':'')].filter(Boolean):['DEFEAT ONE TO LEARN ABOUT IT']};});
 if(tab===1)return BOSS.map((b,i)=>{const u=has('e','boss'+i),S2=BSTYLE[i]||BSTYLE[0];const K=BKIT[b.name];if(K&&K.guide)return {n:b.name,u,col:(K.style&&K.style.c)||S2.c,L:u?['GUARDIAN OF '+ROMAN[i]+'. '+DUN[i].name].concat(K.guide):['DEFEAT THIS GUARDIAN TO LEARN ABOUT IT']}; // the scripted fights (bosses.js) describe themselves
  return {n:b.name,u,col:S2.c,L:u?['GUARDIAN OF '+ROMAN[i]+'. '+DUN[i].name,'PHASES: '+S2.t.join(' > '),'EACH NEW PHASE OPENS WITH A SURVIVAL PHASE','ATTACKS: '+[...new Set((b.k1||[]).concat(b.k2||[]).map(atkWords))].slice(0,4).join(', ')]:['DEFEAT THIS GUARDIAN TO LEARN ABOUT IT']};});
 if(tab===2)return ITEMS.map(it=>{const u=has('r',it.id);return {n:it.name,u,col:fxCol(it.id),relic:it.id,L:u?[FXNAME[fxStyle(it.id)]+' RELIC, STRENGTH '+ROM[it.r],it.d,'RELICS ARE RULES FOR THE WHOLE RUN']:['FIND THIS RELIC TO LEARN ABOUT IT']};});
 if(tab===3)return [...Object.keys(WTYPES).map(w=>{const u=has('w',w),sp=SPELLS.m[WTYPES[w]],sig=Object.keys(WSIG).filter(c=>WSIG[c]===w).join(', ');return {n:w,u,col:'#e8eef6',L:u?['WEAPON. YOUR LMB BECOMES: '+sp.n,sp.d,'SIGNATURE FOR: '+(sig||'NO CLASS')]:['WIELD ONE TO LEARN ABOUT IT']};}),
  ...BAGN.map((nm,t)=>{const u=has('b',t);return {n:nm,u,col:BAGCOL[t],bag:t,L:u?[BAGDESC[t]||'']:['OPEN ONE TO LEARN WHAT IT HOLDS']};})];
 if(tab===4)return [...ENCH.map(E=>{const u=has('n',E.k);return {n:'ENCHANT '+E.n,u,col:E.c,L:u?[E.d,'A CHANCE ON EVERY ABILITY HIT (RMB Q E F R)','BOUND TO YOUR WEAPON: SWAP WEAPONS AND THEY STAY','ON THE OLD ONE. STACKS (II, III...), UP TO 5']:['FIND THIS ENCHANT TO LEARN ABOUT IT']};}),
  {n:'LEGENDARY SCROLL',u:has('s','scroll'),col:'#ffe060',L:has('s','scroll')?['PICK 1 OF 3: REPLACE AN ABILITY, OR ADD A','GUARANTEED EFFECT TO IT. EVERY PICK ALSO EMPOWERS','THAT SLOT (+60% POWER, -30% COOLDOWN)']:['FIND A SCROLL TO LEARN ABOUT IT']},
  ...Object.keys(CURSES).map(k=>{const C=CURSES[k],u=has('c',k);return {n:'CURSE: '+C.n,u,col:C.c,L:u?C.L.map(l=>l.s).concat(['STACKS. LASTS THE RUN. A CRANE SHRINE CAN LIFT IT']):['ACCEPT THIS CURSE AT A CURSED ALTAR TO LEARN IT']};}),
  ...Object.keys(GODS).map(k=>{const D=GODS[k],u=has('g',k);return {n:D.n,u,col:D.c,L:u?[D.sub].concat(D.O.map(o=>o.t+': '+o.d)):['VISIT THIS SHRINE TO LEARN ITS OFFERINGS']};})];
 if(tab===5)return STATS.map(s=>{const u=has('t',s.k);return {n:s.n,u,col:s.c,L:u?[s.d+' PER POINT','RAISED BY ELIXIRS (PERMANENT, MAX 20) AND RINGS']:['FIND AN ELIXIR OR RING OF THIS STAT']};});
 return TERMS.map(t=>({n:t[0],u:true,col:'#8cf',L:t.slice(1)}));}
function openGuide(from){guideFrom=from;guideSel=0;mode='guide';sfx('pickup');}
function guideKey(c){const n=guideEntries(guideTab).length;
 if(c==='ArrowLeft'||c==='KeyA'){guideTab=(guideTab+GTABS.length-1)%GTABS.length;guideSel=0;sfx('coin');}
 else if(c==='ArrowRight'||c==='KeyD'||c==='Tab'){guideTab=(guideTab+1)%GTABS.length;guideSel=0;sfx('coin');}
 else if(c==='ArrowUp'||c==='KeyW')guideSel=(guideSel+n-1)%n;else if(c==='ArrowDown'||c==='KeyS')guideSel=(guideSel+1)%n;
 else if(c==='KeyK'||c==='Escape'||c==='Enter')mode=guideFrom;}
function renderGuide(){
 bg();ctx.fillStyle='rgba(8,4,12,.92)';ctx.fillRect(0,0,W,H);
 let x=6;GTABS.forEach((t,i)=>{const w=txtW(t)+6,sel=i===guideTab;ctx.fillStyle=sel?'#3a2440':'#1a1020';ctx.fillRect(x,4,w,10);if(sel){ctx.fillStyle='#d02030';ctx.fillRect(x,13,w,1);}txt(t,x+3,6,sel?'#fff':'#999');x+=w+2;});
 const L=guideEntries(guideTab),got=L.filter(e=>e.u).length;{const s=got+'/'+L.length;txt(s,W-6-txtW(s),6,'#8cf');}
 guideSel=clamp(guideSel,0,L.length-1);const rows=14,top=clamp(guideSel-6,0,Math.max(0,L.length-rows));
 for(let i=0;i<rows&&top+i<L.length;i++){const e=L[top+i],y=20+i*10,sel=top+i===guideSel;if(sel){ctx.fillStyle='rgba(208,32,48,.35)';ctx.fillRect(6,y-2,120,9);}txt(e.u?e.n.slice(0,29):'? ? ?',9,y,e.u?(sel?'#fff':e.col):'#555');}
 const e=L[guideSel];ctx.fillStyle='rgba(20,12,26,.95)';ctx.fillRect(130,18,184,148);ctx.fillStyle=e.u?e.col:'#555';ctx.fillRect(130,18,184,1);
 txt(e.u?e.n:'? ? ?',136,23,e.u?e.col:'#777');let ly=34;
 if(e.u){if(e.spr){const s=e.spr(),sc=s.fh>40?1:2;ctx.drawImage(s.c,Math.floor(time*3)%Math.max(1,s.frames||1)*s.fw,0,s.fw,s.fh,136,34,s.fw*sc,s.fh*sc);ly=38+s.fh*sc;}
  else if(e.relic){relicBox(136,34,e.relic);ly=52;}else if(e.bag!=null){const b=BAGSPR[e.bag];ctx.drawImage(b.c,136,34);ly=38+b.h;}}
 let li=0;for(const l of e.L)for(const w of wrapTxt(l,44)){if(ly+li*9<160)txt(w,136,ly+li*9,'#ddd');li++;}
 ctxt('A/D TABS   W/S BROWSE   K OR ESC CLOSE',H-8,'#888');}
// ---- codex: every rare spell scroll and rare gear piece you have ever found ----
let codexOpen=false;
function drawCodex(){ctx.fillStyle='#06040a';ctx.fillRect(14,6,292,172);ctxt('CODEX',10,'#c9a',2);
 txt('RARE SPELLS',22,30,'#d02030');[...SLOTS].forEach((k,i)=>{const sp=SPELLS[k][3],f=meta.codex.sp[k];txt((SLOTKEY[k]+'   ').slice(0,4)+(f?sp.n:'? ? ?'),22,40+i*8,f?sp.c:'#555');if(f)txt(sp.d.slice(0,34),150,40+i*8,'#999');});
 txt('RARE GEAR',22,94,'#d02030');RARE.forEach((r,i)=>{const f=meta.codex.gear[r.n],st=Object.keys(SETS).find(k=>SETS[k].items.includes(r.n));const x=22+(i%2)*142,y=103+((i/2)|0)*10;if(f)ctx.drawImage(itemIcon({t:'gear',slot:r.slot,tier:10,q:4,rare:true,name:r.n}),x,y-3);txt(f?r.n:'? ? ?',x+14,y,f?SETS[st].c:'#555');});
 ctxt('SETS: 2 PIECES = BONUS, 3 = BIG BONUS.  K CLOSE',168,'#888');}
function codexAdd(kind,key){if(!meta.codex[kind][key]){meta.codex[kind][key]=1;saveMeta();if(P)txtFx(P.x,P.y-10,'NEW CODEX ENTRY','#c9a');}}
function renderEnd(){
 bg();ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,0,W,H);const d=deadInfo,C=d.cls||CLS();
 const box=(x,y,w,h,c)=>{ctx.fillStyle='rgba(20,12,26,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle=c;ctx.fillRect(x,y,w,1);};
 const K=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?Math.round(n/1e3)+'K':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
 ctxt(d.win?'VICTORY':'DEATH',4,d.win?'#fd4':'#c01020',3);
 ctxt(C.n+' ('+heroEV(C.k,d.evo||0).n+')  -  '+(d.win?'THE CORRUPT EMPEROR IS DEAD':'FELL IN '+ROMAN[d.di]+'. '+DUN[d.di].name),23,'#aaa');
 // run stats
 box(6,32,110,82,'#d02030');txt('RUN',10,35,'#d02030');
 [['GOLD GAINED',d.sen,'#fc4'],['ENEMIES SLAIN',d.kills,'#ddd'],['DEATHBLOWS',d.db,'#ddd'],['PERFECT DODGES',d.pf,'#8cf'],['BEST COMBO',d.combo||0,'#f84'],['TIME',Math.floor(d.time/60)+'M '+Math.floor(d.time%60)+'S','#ddd']]
  .forEach(([n,v,c],i)=>{const y=46+i*10;txt(n,10,y,'#999');const s=String(v);txt(s,112-txtW(s),y,c);});
 // damage dealt by each ability
 const DM=d.dmg||{},keys=['m','h','q','w','f','e','x'],tot=keys.reduce((a,k)=>a+(DM[k]||0),0)||1,mx=Math.max(1,...keys.map(k=>DM[k]||0));
 box(120,32,W-126,82,C.col);txt('DAMAGE BY ABILITY',124,35,C.col);{const s='TOTAL '+K(tot);txt(s,W-10-txtW(s),35,'#fff');}
 keys.forEach((k,i)=>{const y=46+i*9,v=DM[k]||0,sp=k==='x'?null:SPELLS[k][(d.lo||{})[k]]||null,nm=k==='x'?'RELICS + EFFECTS':sp?sp.n:'-',col=k==='x'?'#c6f':sp?sp.c:'#777';
  txt(k==='x'?'*':SLOTKEY[k],124,y,'#777');txt(nm.slice(0,16),142,y,v?col:'#555');
  const bw=Math.round(56*v/mx);ctx.fillStyle='#2a2030';ctx.fillRect(210,y,56,5);ctx.fillStyle=col;ctx.fillRect(210,y,bw,5);
  const s=K(v)+' '+Math.round(v/tot*100)+'%';txt(s,W-10-txtW(s),y,v?'#ddd':'#555');});
 // loadout at the end: gear, enchants, relics and scroll add-ons
 box(6,118,W-12,38,'#888');txt('LOADOUT',10,121,'#aaa');
 let x=10;for(const s of ['wpn','arm','ring']){drawItemIcon(d.eq&&d.eq[s],x,130);x+=18;}
 x+=4;for(const k of d.ench||[]){ctx.drawImage(itemIcon({t:'ench',k}),x,131);x+=14;}
 x+=4;for(const id in d.inv||{}){const it=ITEMBY[id];if(!it||x>W-24)continue;relicBox(x,131,id,11);if(d.inv[id]>1)txt('X'+d.inv[id],x+1,143,'#fff');x+=13;}
 {const A=[];for(const k in d.addon||{})for(const a of ADDONS)if(d.addon[k][a.k])A.push(SLOTKEY[k]+' '+fxLabel(a.n,a.tier));
  if(A.length)txt(('SCROLLS: '+A.join(', ')).slice(0,Math.floor((W-60)/4)),60,121,'#ffe060');}
 if(d.unlock)ctxt('NEW CHARACTER UNLOCKED: '+d.unlock.n,160,Math.floor(time*4)%2?d.unlock.col:'#fff');
 if(Math.floor(time*2)%2===0)ctxt('PRESS ENTER: CHARACTER SELECT',171,'#fff');
}
function renderChoose(){
 renderPlay();ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,0,W,H);
 ctxt('BOSS DEFEATED',12,'#fd4',2);ctxt('CHOOSE A REWARD  (CLICK OR PRESS 1 2 3)',32,'#ccc');
 // the evolution you just earned stays on screen while you pick
 if(R.evoPending)ctxt('YOUR MASTER WAITS BEYOND THE PORTAL - YOU ARE READY TO GROW',H-22,Math.floor(time*3)%2?'#ffe060':'#fff');
 const cw=92,gap=8,x0=Math.round((W-(3*cw+2*gap))/2);
 chooseOpts.forEach((it,i)=>{const x=x0+i*(cw+gap),y=44,h=92,hov=mouse.x>=x&&mouse.x<=x+cw&&mouse.y>=y&&mouse.y<=y+h;
  ctx.fillStyle=hov?'#2a1a30':'#160e1a';ctx.fillRect(x,y,cw,h);ctx.fillStyle=RCOL[it.r];ctx.fillRect(x,y,cw,1);ctx.fillRect(x,y+h-1,cw,1);ctx.fillRect(x,y,1,h);ctx.fillRect(x+cw-1,y,1,h);
  ctx.save();ctx.translate(x+cw/2-13,y+12);ctx.scale(2,2);relicBox(0,0,it.id);ctx.restore();
  txt('['+(i+1)+']',x+cw/2-6,y+4,'#aaa');
  const nm=fxLabel(it.name,it.r+1);ctxt2(nm.length>22?nm.slice(0,22):nm,x,cw,y+44,fxCol(it.id));wrapTxt(it.d,22).slice(0,2).forEach((l,j)=>ctxt2(l,x,cw,y+56+j*8,'#ddd'));ctxt2(FXNAME[fxStyle(it.id)]+' RELIC',x,cw,y+74,fxCol(it.id));ctxt2(['COMMON','UNCOMMON','RARE','LEGENDARY'][it.r],x,cw,y+82,'#777');});
}
function ctxt2(s,x,w,y,c){txt(s,Math.round(x+(w-txtW(s))/2),y,c);}
function render(){
 setView(mode==='play'||mode==='choose'||mode==='scroll'||mode==='event');
 ctx.imageSmoothingEnabled=false;
 if(mode==='title')renderTitle();else if(mode==='options')renderOptions();else if(mode==='guide')renderGuide();else if(mode==='master')renderMaster();else if(mode==='select')renderSelect();else if(mode==='tut')renderTut();else if(mode==='hub')renderHub();else if(mode==='play')renderPlay();else if(mode==='choose')renderChoose();else if(mode==='scroll')renderScroll();else if(mode==='event')renderEvent();else renderEnd();
 drawDbg();drawCursor();
}
// one cursor for every screen: crosshair while fighting, an arrow on menus, pause and the backpack
function drawCursor(){const mx=Math.round(mouse.x),my=Math.round(mouse.y);
 if(mode==='play'&&!paused&&!invOpen){ctx.fillStyle='#14101a';ctx.fillRect(mx-4,my-1,9,3);ctx.fillRect(mx-1,my-4,3,9);ctx.fillStyle='#fff';ctx.fillRect(mx-3,my,2,1);ctx.fillRect(mx+2,my,2,1);ctx.fillRect(mx,my-3,1,2);ctx.fillRect(mx,my+2,1,2);return;}
 const A=['1','11','1w1','1ww1','1www1','1wwww1','1www11','1w1w1','11.1w1','....11'];A.forEach((r,y)=>{for(let x=0;x<r.length;x++){const c=r[x];if(c==='.')continue;ctx.fillStyle=c==='1'?'#14101a':'#fff';ctx.fillRect(mx+x,my+y,1,1);}});}

// ---------- options: volume, difficulty, toggles, key rebinding, debug overlay ----------
const KBACTS=[['up','MOVE UP','KeyW'],['down','MOVE DOWN','KeyS'],['left','MOVE LEFT','KeyA'],['right','MOVE RIGHT','KeyD'],['dash','DASH','Space'],['focus','FOCUS (HOLD)','ShiftLeft'],
 ['q','ABILITY Q','KeyQ'],['w','ABILITY E','KeyE'],['f','ABILITY F','KeyF'],['e','ULTIMATE','KeyR'],['heal','DRINK POTION','KeyC'],['use','INTERACT','KeyG'],['swap','SWAP WEAPON','KeyX'],['pack','BACKPACK','Tab']];
const DIFFS=[{n:'STORY',d:'55% DAMAGE, 75% HP, FEWER BOSS BULLETS',dmg:.55,hp:.75,bh:.65,c:'#6c6'},{n:'NORMAL',d:'THE GAME AS DESIGNED',dmg:1,hp:1,bh:1,c:'#ddd'},{n:'HARD',d:'130% DAMAGE, 125% HP, MORE BOSS BULLETS',dmg:1.3,hp:1.25,bh:1.35,c:'#f55'}];
(function initOpt(){const d={mus:6,sfx:7,diff:1,shake:1,flash:1,dmgNum:1,dbg:0,kb:{}};meta.opt=Object.assign(d,meta.opt||{});for(const [k,,c] of KBACTS)if(!meta.opt.kb[k])meta.opt.kb[k]=c;})();
const OPT=()=>meta.opt,KB=new Proxy({},{get:(_,k)=>meta.opt.kb[k]}),DF=()=>DIFFS[meta.opt.diff]||DIFFS[1];
const keyName=c=>!c?'-':c.startsWith('Key')?c.slice(3):c.startsWith('Digit')?c.slice(5):({Space:'SPACE',ShiftLeft:'SHIFT',ShiftRight:'RSHIFT',ControlLeft:'CTRL',AltLeft:'ALT',Tab:'TAB',CapsLock:'CAPS',ArrowUp:'UP',ArrowDown:'DOWN',ArrowLeft:'LEFT',ArrowRight:'RIGHT',Backquote:'`',Semicolon:';',Quote:"'",Slash:'/',Backslash:'\\',BracketLeft:'[',BracketRight:']',Minus:'-',Equal:'='})[c]||c.toUpperCase().slice(0,6);
function syncKeyLabels(){for(const k of ['q','w','f','e'])SLOTKEY[k]=keyName(KB[k]);}
syncKeyLabels();
const sfxVol=()=>OPT().sfx/7,musVol=()=>OPT().mus/6*.55;
let optSel=0,optFrom='title',optWait=null;
// rows: settings first, then every rebindable key, then reset
const OPTROWS=()=>[
 {n:'MUSIC VOLUME',v:()=>OPT().mus+'/10',ch:d=>{OPT().mus=clamp(OPT().mus+d,0,10);if(mus.gain)mus.gain.gain.value=musVol();}},
 {n:'SOUND EFFECTS',v:()=>OPT().sfx+'/10',ch:d=>{OPT().sfx=clamp(OPT().sfx+d,0,10);sfx('coin');}},
 {n:'DIFFICULTY',v:()=>DF().n,c:()=>DF().c,info:()=>DF().d+(mode==='options'&&optFrom==='play'?' (FROM NEXT STAGE)':''),ch:d=>{OPT().diff=clamp(OPT().diff+d,0,2);}},
 {n:'AUTO FIRE',v:()=>['OFF (HOLD LMB)','LMB TOGGLE','IN COMBAT'][OPT().autoFire|0],info:()=>['HOLD LEFT MOUSE TO FIRE','CLICK LEFT MOUSE ONCE TO START FIRING, AGAIN TO STOP','FIRES AT THE CURSOR BY ITSELF WHILE YOU ARE IN A FIGHT'][OPT().autoFire|0],ch:d=>{OPT().autoFire=(((OPT().autoFire|0)+(d||1))%3+3)%3;fireOn=false;}},
 {n:'SCREEN SHAKE',v:()=>OPT().shake?'ON':'OFF',ch:()=>{OPT().shake^=1;}},
 {n:'SCREEN FLASHES',v:()=>OPT().flash?'ON':'OFF',ch:()=>{OPT().flash^=1;}},
 {n:'DAMAGE NUMBERS',v:()=>OPT().dmgNum?'ON':'OFF',ch:()=>{OPT().dmgNum^=1;}},
 {n:'DEBUG OVERLAY',v:()=>OPT().dbg?'ON':'OFF',info:()=>'FPS, FOES, BULLETS, YOUR DAMAGE PER SECOND',ch:()=>{OPT().dbg^=1;}},
 // arcade extras (src/91-arcade.js): spirit trails won by no-hit boss clears, New Game+ won by beating the Emperor
 {n:'SPIRIT TRAIL',v:()=>trailName(),c:()=>trailCol(),info:()=>trailInfo(),ch:d=>cycleTrail(d)},
 {n:'NEW GAME+',v:()=>!meta.ngUnlocked?'LOCKED':OPT().ngp?'ON':'OFF',c:()=>meta.ngUnlocked?(OPT().ngp?'#ff60ff':'#ddd'):'#666',info:()=>meta.ngUnlocked?'EVERY BOSS STARTS IN ITS SECOND FORM. FOES HAVE +25% HP':'BEAT THE CORRUPT EMPEROR TO UNLOCK',ch:()=>{if(meta.ngUnlocked)OPT().ngp^=1;}},
 ...KBACTS.map(([k,n])=>({n,key:k,v:()=>optWait===k?'PRESS A KEY...':keyName(KB[k])})),
 {n:'RESET KEYS TO DEFAULT',v:()=>'',act:()=>{for(const [k,,c] of KBACTS)OPT().kb[k]=c;syncKeyLabels();sfx('pickup');}}];
function openOptions(from){optFrom=from;optSel=0;optWait=null;mode='options';sfx('tool');}
function closeOptions(){saveMeta();mode=optFrom==='play'?'play':optFrom;if(optFrom==='play')paused=true;sfx('tool');}
function optionsKey(c){
 const rows=OPTROWS();
 if(optWait){if(c!=='Escape'){for(const [k] of KBACTS)if(k!==optWait&&OPT().kb[k]===c)OPT().kb[k]=OPT().kb[optWait]; // swap if the key was already used
   OPT().kb[optWait]=c;syncKeyLabels();sfx('pickup');}optWait=null;saveMeta();return;}
 if(c==='Escape'||c==='KeyO'){closeOptions();return;}
 if(c==='ArrowUp')optSel=(optSel+rows.length-1)%rows.length;
 else if(c==='ArrowDown')optSel=(optSel+1)%rows.length;
 else{const r=rows[optSel];if(c==='ArrowLeft'||c==='ArrowRight'){if(r.ch){r.ch(c==='ArrowLeft'?-1:1);sfx('coin');}}
  else if(c==='Enter'||c==='Space'){if(r.key){optWait=r.key;sfx('tool');}else if(r.act)r.act();else if(r.ch){r.ch(1);sfx('coin');}}}
 saveMeta();}
function renderOptions(){
 bg();ctx.fillStyle='rgba(8,4,12,.88)';ctx.fillRect(12,4,296,172);ctx.fillStyle='#d02030';ctx.fillRect(12,4,296,1);ctx.fillRect(12,175,296,1);
 ctxt('OPTIONS',8,'#d02030',2);
 const rows=OPTROWS(),vis=14,top=clamp(optSel-6,0,Math.max(0,rows.length-vis));
 rows.slice(top,top+vis).forEach((r,j)=>{const i=top+j,y=26+j*9,sel=i===optSel;
  if(sel){ctx.fillStyle='rgba(208,32,48,.35)';ctx.fillRect(16,y-2,288,9);}
  txt((sel?'> ':'  ')+r.n,18,y,r.key?'#9ab':'#ddd');const v=r.v();if(v){const s=r.ch&&sel?'< '+v+' >':v;txt(s,302-txtW(s),y,r.c?r.c():sel?'#fff':'#aaa');}});
 if(top>0)txt('^',304,26,'#666');if(top+vis<rows.length)txt('V',304,26+(vis-1)*9,'#666');
 const r=rows[optSel];sep(16,154,288);
 ctxt(r.info?r.info():r.key?'ENTER, THEN PRESS THE NEW KEY (ESC CANCELS)':'LEFT / RIGHT TO CHANGE',158,'#8cf');
 ctxt('UP/DOWN SELECT   ESC BACK',167,'#666');}
// debug / balance overlay: frame rate, live counts and your damage per second over the last 5 seconds
const DBG={fps:60,hist:[]};
function updDbg(dt){DBG.fps=DBG.fps*.95+(dt>0?1/dt:60)*.05;if(!R||!R.dmg)return;const tot=Object.values(R.dmg).reduce((a,b)=>a+b,0);DBG.hist.push([R.time,tot]);while(DBG.hist.length&&DBG.hist[0][0]<R.time-5)DBG.hist.shift();}
function drawDbg(){if(!OPT().dbg||mode!=='play'||!P)return;const h=DBG.hist,dps=h.length>1?(h[h.length-1][1]-h[0][1])/Math.max(.5,h[h.length-1][0]-h[0][0]):0;
 const L=['FPS '+Math.round(DBG.fps),'FOES '+enemies.filter(e=>!e.dead).length+'  SHOTS '+projs.filter(q=>q.from==='e').length,'DPS '+Math.round(dps)+'  POWER '+Math.round(S.atk),'STAGE '+(R.di+1)+'  '+DF().n+(R.asc?' ASC '+R.asc:''),boss&&!boss.dead?'BOSS '+Math.round(boss.hp)+'/'+Math.round(boss.maxhp)+' PH'+boss.phase:'ROOMS DONE '+map.rooms.filter(r=>r.done).length+'/'+map.rooms.length];
 ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(2,H-74,112,L.length*8+3);L.forEach((s,i)=>txt(s,4,H-72+i*8,'#9f9'));}

// ---------- save and continue: the run is checkpointed at the start of every stage ----------
const RUNKEY='shinobiDungeonsRun';
const PKEEP=['hp','rez','evo','lo','emp','gourd','aegis'];
function saveRun(){if(!R||R.training)return;try{const r=JSON.parse(JSON.stringify(R,(k,v)=>k==='lastKill'||k==='training'||k==='_rc'?undefined:v));const p={};for(const k of PKEEP)p[k]=P[k];
 localStorage.setItem(RUNKEY,JSON.stringify({v:1,cls:meta.cls||0,R:r,P:p,when:Date.now()}));}catch(e){console.warn('save failed',e);}}
function savedRun(){try{const s=JSON.parse(localStorage.getItem(RUNKEY));return s&&s.v===1&&s.R&&DUN[s.R.di]?s:null;}catch(e){return null;}}
function clearRun(){try{localStorage.removeItem(RUNKEY);}catch(e){}}
function continueRun(){const s=savedRun();if(!s)return false;meta.cls=s.cls;startRun(s.R.start||0,true);R=Object.assign(R,s.R);S=calcStats();Object.assign(P,s.P);
 syncLMB();Object.assign(P.emp,s.P.emp||{});S=calcStats();R.resumed=true;const hp=P.hp;loadDungeon(R.di);P.hp=Math.min(S.maxhp,hp);mode='play';paused=false;setToast('RUN RESUMED - '+ROMAN[R.di]+'. '+DUN[R.di].name,'#8cf',3);return true;}

// ---------- tutorial ----------
const TUT=[
 {t:'MOVE AND DASH',c:'#8cf',l:['WASD  MOVE    , .  ROTATE THE CAMERA','MOUSE  AIMS EVERY SPELL AT THE CURSOR','','SPACE  DASH: A QUICK SIDESTEP','YOU CANNOT BE HIT WHILE DASHING','IT RECHARGES IN UNDER A SECOND','','RED ! ATTACKS AND RED CIRCLES ARE PERILOUS.','THEY CANNOT BE WARDED. DASH OUT!']},
 {t:'SIX SPELL SLOTS',c:'#fd4',l:['LMB RMB  BASIC ATTACKS - HOLD TO REPEAT','Q E F    ABILITIES ON COOLDOWNS','R        ULTIMATE - KILLS CHARGE IT','HOVER THE SPELL BAR FOR DAMAGE NUMBERS','','EACH SLOT HAS 3 SPELLS. PICK AT THE TEMPLE.','SPELLS RANK UP WITH EVERY DUNGEON','','C  DRINK A POTION (RARE!)   G  INTERACT']},
 {t:'LOOT BAGS',c:'#b070f0',l:['ENEMIES DROP BAGS WHEN THEY DIE','STAND ON A BAG TO SEE WHAT IS INSIDE','1-6 TAKE/EQUIP AN ITEM   G TAKE ALL TO PACK','GEAR: 15 TIERS, COMMON TO LEGENDARY','RARER GEAR DROPS DEEPER IN THE DUNGEONS','COLOURED BAGS HOLD EPICS, ENCHANTS, SCROLLS','WHITE ROYAL BAG: SUPER RARE, ALWAYS LEGENDARY','STAT ELIXIRS ARE PERMANENT, MAX 20 EACH','TAB BACKPACK (8)  X SWAP WEAPON','G AT THE PORTAL TO ENTER IT']},
 {t:'EFFECT COLOURS',c:'#ff5050',l:[{s:'RED      DAMAGE - CRIT, POWER, PIERCE, BLAST',c:'#ff5050'},{s:'GREEN    HEAL - LEECH, LIFESTEAL, REVIVES',c:'#50e060'},{s:'ORANGE   FIRE - BURNS',c:'#ff8a30'},
  {s:'ICE      FROST - CHILLS, 3 CHILLS FREEZE',c:'#80d0ff'},{s:'YELLOW   STORM - SHOCKS AND ARCS',c:'#ffe040'},{s:'LIME     POISON',c:'#a0ff40'},{s:'CYAN     SPEED - COOLDOWNS, DASH, MOVE',c:'#40e0e0'},
  {s:'STEEL    GUARD - DEFENCE, DODGE, STUN RESIST',c:'#b0b8d0'},{s:'I - IV   STRENGTH: I IS A CHANCE, IV IS HUGE',c:'#fff'}]},
 {t:'FIVE KINDS OF POWER',c:'#ffe060',l:['WEAPON   SETS HOW YOUR LMB ATTACKS','         (SWEEP, BEAM, VOLLEY, BELL...)','GEAR     ARMOUR AND RINGS: NUMBERS ONLY','ENCHANT  ON-HIT EFFECT FOR EVERY ABILITY','         (RMB Q E F R) - A CHANCE, MAX 3','SCROLL   REWRITES ONE ABILITY: REPLACE IT,','         OR A GUARANTEED ADD-ON','RELIC    A RULE FOR THE WHOLE RUN','         (BOSS REWARDS, SHOPS, SHRINES)']},{t:'DODGING',c:'#8cf',l:['EVERY PATTERN HAS A GAP - FIND IT','SHIFT IN COMBAT: FOCUS - SLOW, TINY HITBOX','DASH 3 TIMES IN A ROW OUT OF COMBAT: SPEED BOOST','DASH THROUGH A SHOT AS IT HITS:','  PERFECT DODGE - NEARBY BULLETS SHATTER','  DASH RESETS, NEXT ATTACK EMPOWERED','GRAZING SHOTS CUTS COOLDOWNS','MINES BLINK BEFORE THEY BURST','SPIRALS AND RINGS ROTATE - MOVE WITH THEM']},
 {t:'STUN',c:'#fd4',l:['EVERY HIT FILLS THE YELLOW STUN BAR','A FULL BAR STUNS THE ENEMY','','STUNNED ENEMIES TAKE +50% DAMAGE','THE EXECUTIONER MARK RELIC TURNS HITS','INTO DEATHBLOWS (BOSSES LOSE 3% HP)','','SHIELD BEARERS BLOCK SHOTS FROM THE FRONT.','STUN THEM, FLANK THEM OR USE LIGHTNING']},
 {t:'ELEMENTS',c:'#f80',l:['BURN, POISON, CHILL AND SHOCK STACK ON FOES','','BURN + SHOCK = OVERLOAD: AN EXPLOSION','BURN + POISON = BOTH DEAL 50% MORE','3 CHILLS = FROZEN. HIT A FROZEN FOE TO','SHATTER IT FOR 50% BONUS DAMAGE','','FLAME WAVE BURNS. CHAIN LIGHTNING SHOCKS.','ITEMS CAN ADD ELEMENTS TO EVERY SPELL']},
 {t:'ROOMS AND EVENTS',c:'#c6f',l:['GOLD    TREASURE CHEST (BEWARE AMBUSHES)','BLUE    SHOP - RELICS AND A PRICEY POTION','PURPLE  SHRINE - RISKY OFFERINGS','GREEN   SPRING - A RARE CHANCE TO HEAL','ORANGE  ELITE - A TOUGH FOE WITH A MODIFIER','RED     SPIKE TRAPS - WATCH THE FLOOR','','ROOMS APPEAR ON THE MINIMAP ONCE SEEN']},
 {t:'THE RUN',c:'#6c6',l:['STORM THE PALACE, END THE CORRUPT EMPEROR','12 STAGES FROM THE FOREST TO THE THRONE ROOM','EACH ENDS IN A GUARDIAN. BEAT IT, TAKE A REWARD','DIE AND YOU KEEP YOUR GOLD','YOUR MASTER EVOLVES YOU BETWEEN STAGES','GOLD LEGENDARIES CAN CHANGE A WHOLE RUN','','ESC PAUSES.  M MUTES.  GOOD LUCK!']},
];
function tutKey(c){
 if(c==='Escape'){tutDone();return;}
 if(c==='Enter'||c==='Space'||c==='ArrowRight'||c==='KeyD'){if(++tutPage>=TUT.length)tutDone();else sfx('pickup');}
 else if(c==='ArrowLeft'||c==='KeyA')tutPage=Math.max(0,tutPage-1);
}
function tutDone(){meta.tut3=true;saveMeta();if(tutPending!==null){const s=tutPending;tutPending=null;startRun(s);}else mode='hub';}
function renderTut(){
 bg();ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(10,8,300,164);
 const p=TUT[tutPage];ctxt('TUTORIAL '+(tutPage+1)+'/'+TUT.length,14,'#888');ctxt(p.t,26,p.c,2);
 p.l.forEach((s,i)=>typeof s==='object'?txt(s.s,24,52+i*11,s.c):txt(s,24,52+i*11,s.startsWith(' ')?'#aaa':'#ddd'));
 ctxt(tutPage<TUT.length-1?'ENTER NEXT  -  ESC SKIP':'ENTER TO BEGIN',158,'#fff');
}
