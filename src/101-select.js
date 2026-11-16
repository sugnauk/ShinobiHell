'use strict';
// ===== CHARACTER SELECT, redesigned =====
// Left: the hero on a lit pedestal (big, animated, strikes a pose now and then). Right: role, difficulty, stats with values,
// the six abilities (hover or W/S to read one, otherwise they cycle), the evolution path and your record with them.
// Bottom: the roster as portrait tiles. Locked heroes show as silhouettes with an unlock progress bar.
const CLSINFO={
 wizard:{role:'CASTER - AREA',diff:1,lore:'MASTER KAITO\'S STUDENT. BOLTS AND STORMS.'},
 archer:{role:'RANGED - MOBILITY',diff:2,lore:'A HUNTER OF THE HILLS. NEVER STANDS STILL.'},
 samurai:{role:'MELEE - BRUISER',diff:2,lore:'A MASTERLESS SWORD. CUTS BULLETS IN TWO.'},
 shinobi:{role:'MELEE - ASSASSIN',diff:3,lore:'IN, KILL, OUT. FRAGILE BUT DEADLY.'},
 onmyoji:{role:'SUMMONER - CONTROL',diff:3,lore:'BINDS SPIRITS TO FIGHT AND SHIELD.'},
 gunner:{role:'RANGED - ARTILLERY',diff:2,lore:'A MATCHLOCK, A TURRET, A LOT OF POWDER.'},
 lancer:{role:'MELEE - REACH',diff:2,lore:'THE LONGEST REACH. HOLDS THE LINE.'}};
// the final form: always previewed in a box at the top-left of the showcase; F or a click swaps it onto the pedestal
let selFinal=false;const FINBOX={x:6,y:18,w:42,h:66};
let selChgT=0,selPrev=-1,selAb=0,selAbT=0,selAbHover=false;
// your record with each hero
meta.cst=meta.cst||{};
{const _fr=finishRun;finishRun=function(win){try{if(R&&!R.training&&!R.test){const k=CLS().k,c=meta.cst[k]||(meta.cst[k]={runs:0,wins:0,best:0});c.runs++;if(win)c.wins++;c.best=Math.max(c.best,(R.di||0)+1);}}catch(e){}return _fr.apply(this,arguments);};}
// layout
const RST={y:150,w:22,h:22,gap:3};
const rstX=i=>Math.round(W/2-(CLASSES.length*(RST.w+RST.gap)-RST.gap)/2+i*(RST.w+RST.gap));
const ABX=i=>138+i*20,ABY=83;
selCardAt=function(x,y){for(let i=0;i<CLASSES.length;i++){const rx=rstX(i);if(x>=rx&&x<rx+RST.w&&y>=RST.y-3&&y<RST.y+RST.h)return i;}
 if(x>=8&&x<128&&y>=20&&y<150)return selIdx; // the showcase itself
 return -1;};
const abAt=(x,y)=>{for(let i=0;i<6;i++)if(x>=ABX(i)-1&&x<ABX(i)+14&&y>=ABY-1&&y<ABY+14)return i;return -1;};
{const _sk=selectKey;selectKey=function(c){if(!selLock&&selTab===0&&!isLocked(selIdx)){if(c==='KeyF'){selFinal=!selFinal;selChgT=time;sfx(selFinal?'rare':'coin');return;}if(c==='ArrowUp'||c==='KeyW'){selAb=(selAb+5)%6;selAbT=time+6;sfx('coin');return;}if(c==='ArrowDown'||c==='KeyS'){selAb=(selAb+1)%6;selAbT=time+6;sfx('coin');return;}}return _sk(c);};}
{const _sc=selConfirm;selConfirm=function(){const was=selLock;_sc();if(selLock&&!was){selT=time;}};}
{const _sl=selClick;selClick=function(){if(selTab===0&&!selLock&&mouse.x>=FINBOX.x&&mouse.x<FINBOX.x+FINBOX.w&&mouse.y>=FINBOX.y&&mouse.y<FINBOX.y+FINBOX.h){if(!isLocked(selIdx)){selFinal=!selFinal;selChgT=time;sfx(selFinal?'rare':'coin');}return;}if(selTab===0&&!selLock&&abAt(mouse.x,mouse.y)>=0)return;return _sl();};}

const hexA=(c,a)=>{let h=c.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')';};
function segBar(x,y,f,col,n){n=n||10;const k=Math.round(clamp(f,0,1)*n);for(let i=0;i<n;i++){ctx.fillStyle=i<k?col:'#2a2030';ctx.fillRect(x+i*6,y,5,4);if(i<k){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x+i*6,y,5,1);}}}
function glowDisc(x,y,r,col,a){for(let i=r;i>0;i-=2){ctx.globalAlpha=a*(1-i/r)*.35;disc(x,y,i,col);}ctx.globalAlpha=1;}
function heroPose(i,t){ // idle, with a strike every 4 seconds
 const ph=(t+i*.7)%4;if(ph>3.2){const a=WIZ.atk||WIZ.idle;return a[Math.min(a.length-1,Math.floor((ph-3.2)/.12))];}if(ph>2.9)return (WIZ.cast||WIZ.idle)[Math.floor(t*14)%2];return WIZ.idle[Math.floor(t*2.5)%2];}

renderSelect=function(){
 bg();ctx.fillStyle='rgba(8,4,12,.72)';ctx.fillRect(0,0,W,H);
 if(selTab===1){renderUpgrades();return;}
 if(!selLock&&(mouse.x!==selMX||mouse.y!==selMY)){const h=selCardAt(mouse.x,mouse.y);if(h>=0&&h!==selIdx){selIdx=h;sfx('coin');}const a=abAt(mouse.x,mouse.y);selAbHover=a>=0;if(a>=0)selAb=a;selMX=mouse.x;selMY=mouse.y;}
 if(selIdx!==selPrev){selPrev=selIdx;selChgT=time;selAbT=time+2.5;selFinal=false;}
 const C=CLASSES[selIdx],I=CLSINFO[C.k]||{role:'',diff:2,lore:''},lk=isLocked(selIdx),col=lk?'#6a6074':C.col,e=clamp((time-selChgT)/.22,0,1),ease=1-(1-e)*(1-e);
 if(!selAbHover&&time>selAbT){selAb=(selAb+1)%6;selAbT=time+2.5;}
 // ---- header ----
 txt('CHOOSE YOUR WARRIOR',8,5,'#d02030',1);ctx.fillStyle='#d02030';ctx.fillRect(8,13,txtW('CHOOSE YOUR WARRIOR'),1);
 {const s=Math.min(meta.unlocked||2,CLASSES.length)+'/'+CLASSES.length+' UNLOCKED';txt(s,W-8-txtW(s),5,'#777');}
 // ---- showcase: beam, glow, pedestal, the hero ----
 const cx=68,fy=120;
 {const g=ctx.createLinearGradient(0,18,0,fy);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,hexA(col,.25));ctx.fillStyle=g;ctx.fillRect(cx-26,18,52,fy-18);}
 glowDisc(cx,fy-36,46,col,lk?.4:1);
 for(let i=0;i<14;i++){const ph=(time*.25+i/14)%1,px=cx-30+((i*37)%60),py=fy-4-ph*90;ctx.globalAlpha=(1-ph)*(lk?.25:.7);ctx.fillStyle=i%3?col:'#fff';ctx.fillRect(px+Math.round(Math.sin(time+i)*2),Math.round(py),1,1);}ctx.globalAlpha=1;
 // pedestal: a stone dais with a glowing rune ring
 ctx.fillStyle='#1a1220';for(let y=0;y<9;y++){const w=Math.round(38*Math.sqrt(1-((y-4)/4.6)**2));ctx.fillRect(cx-w,fy-4+y,w*2,1);}
 ctx.fillStyle='#2e2438';for(let y=0;y<5;y++){const w=Math.round(34*Math.sqrt(1-((y-2)/2.6)**2));ctx.fillRect(cx-w,fy-4+y,w*2,1);}
 for(let i=0;i<24;i++){const a=i/24*TAU+time*.6;ctx.fillStyle=i%2?col:shade(col,-.4);ctx.fillRect(Math.round(cx+Math.cos(a)*30),Math.round(fy-2+Math.sin(a)*3),1,1);}
 const fin=selFinal&&!lk;if(fin)glowDisc(cx,fy-40,52,'#ffd040',.9);
 const sp=heroSpr(C.k,fin?9:0),SC=4,slide=Math.round((1-ease)*14),fr=selLock?(WIZ.atk||WIZ.idle)[Math.min((WIZ.atk||[0]).length-1,Math.floor((time-selT)/.1))]:heroPose(selIdx,time);
 const dx=Math.round(cx-sp.fw*SC/2)+slide,dy=fy-sp.fh*SC+2;
 ctx.globalAlpha=.35*ease;ctx.fillStyle='#000';for(let y=0;y<4;y++){const w=Math.round(22*Math.sqrt(1-((y-1.5)/2.2)**2));ctx.fillRect(cx-w,fy-2+y,w*2,1);}ctx.globalAlpha=ease;
 if(lk){ctx.globalAlpha=.5*ease;for(const o of [[-1,0],[1,0],[0,-1]])ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx+o[0],dy+o[1],sp.fw*SC,sp.fh*SC);ctx.globalAlpha=ease;ctx.drawImage(silOf(sp,C.k),fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*SC,sp.fh*SC);padlock(cx-3,fy-54,'#e0c070');}
 else{ctx.drawImage(sp.c,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*SC,sp.fh*SC);if(selLock){const fl=clamp(1-(time-selT)/.4,0,1);if(fl>0){ctx.globalAlpha=fl;ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*SC,sp.fh*SC);}}}
 ctx.globalAlpha=1;
 // name plate
 {const nm=lk?'? ? ?':fin?heroEV(C.k,9).n:C.n;{const sz=txtW(nm,2)>124?1:2;txt(nm,cx-Math.round(txtW(nm,sz)/2),fy+(sz===2?7:10),col,sz);}const r=fin?'FINAL FORM OF THE '+C.n:I.role;txt(r,cx-Math.round(txtW(r)/2),fy+20,lk?'#666':'#bbb');}
 // ---- the final form preview (or the starting form while the final one is on the pedestal) ----
 {const B=FINBOX,hov=mouse.x>=B.x&&mouse.x<B.x+B.w&&mouse.y>=B.y&&mouse.y<B.y+B.h&&!lk,st=fin?0:9,sp2=heroSpr(C.k,st),gold='#ffd040';
  ctx.fillStyle='rgba(14,9,20,.92)';ctx.fillRect(B.x,B.y,B.w,B.h);ctx.fillStyle=lk?'#3a2e44':hov?'#fff':fin?col:gold;ctx.fillRect(B.x,B.y,B.w,1);ctx.fillRect(B.x,B.y+B.h-1,B.w,1);ctx.fillRect(B.x,B.y,1,B.h);ctx.fillRect(B.x+B.w-1,B.y,1,B.h);
  if(!lk&&!fin)glowDisc(B.x+B.w/2,B.y+28,22,gold,.6);
  const f2=WIZ.idle[Math.floor(time*2.5)%2],dx2=B.x+Math.round(B.w/2-sp2.fw),dy2=B.y+4;
  if(lk){ctx.globalAlpha=.6;ctx.drawImage(silOf(sp2,C.k+'f'),f2*sp2.fw,0,sp2.fw,sp2.fh,dx2,dy2,sp2.fw*2,sp2.fh*2);ctx.globalAlpha=1;txt('?',B.x+B.w/2-2,B.y+22,'#777');}
  else ctx.drawImage(sp2.c,f2*sp2.fw,0,sp2.fw,sp2.fh,dx2,dy2,sp2.fw*2,sp2.fh*2);
  const lab=fin?'START':'FINAL',ls=lk?'#666':fin?'#bbb':gold;txt(lab,B.x+Math.round((B.w-txtW(lab))/2),B.y+B.h-14,ls);
  if(!lk){const k='F';txt(k,B.x+Math.round((B.w-txtW(k))/2),B.y+B.h-7,hov?'#fff':'#777');}}
 // ---- right panel ----
 const px=134,pw=W-px-6;ctx.fillStyle='rgba(16,10,22,.9)';ctx.fillRect(px-4,20,pw+4,127);ctx.fillStyle=col;ctx.fillRect(px-4,20,pw+4,1);ctx.fillRect(px-4,20,1,127);
 ctx.globalAlpha=ease;
 {txt('DIFFICULTY',px,25,'#888');for(let i=0;i<3;i++){const on=i<I.diff;ctx.fillStyle=on?(I.diff===1?'#6f6':I.diff===2?'#fd4':'#f64'):'#2a2030';ctx.fillRect(px+44+i*7,25,5,5);}
  const s=['','EASY','MEDIUM','HARD'][I.diff];txt(s,px+68,25,I.diff===1?'#6f6':I.diff===2?'#fd4':'#f64');}
 if(lk){
  const n=runsToUnlock(selIdx),need=Math.max(1,selIdx-1),done=Math.max(0,need-n);
  txt('LOCKED',px,38,'#e0c070',2);txt('A NEW WARRIOR JOINS AFTER EVERY RUN,',px,56,'#ccc');txt('WIN OR LOSE. TRAINING DOES NOT COUNT.',px,64,'#888');
  txt('UNLOCKS IN '+n+' MORE RUN'+(n>1?'S':''),px,80,'#ddd');segBar(px,90,done/need,'#e0c070',Math.min(10,need));
  for(let i=0;i<6;i++){ctx.fillStyle='#14101a';ctx.fillRect(ABX(i),112,13,13);ctx.fillStyle='#2a2030';ctx.fillRect(ABX(i)+1,113,11,11);txt('?',ABX(i)+5,116,'#555');}
  txt('ITS ABILITIES ARE A MYSTERY',px,130,'#666');
 }else{
  for(const l of wrapTxt(I.lore,44).slice(0,1))txt(l,px,34,'#ddd');for(const l of wrapTxt(C.d,44).slice(0,1))txt(l,px,42,'#999');
  const ST=[['HEALTH',Math.round(100*C.hp)+' HP',(C.hp-.7)/.7],['SPEED',Math.round(100*C.spd)+'%',(C.spd-.85)/.35],['DASH',(C.dash<=1?'FAST':'SLOW')+' '+Math.round(100/C.dash)+'%',(1.3-C.dash)/.7],['DEFENCE','+'+(C.def||0),((C.def||0)+.5)/4],['POWER',Math.round(100*(C.pw||1))+'%',((C.pw||1)-.8)/.5]];
  ST.forEach(([n,v,f],i)=>{const y=51+i*6;txt(n,px,y,'#999');segBar(px+40,y,f,C.col);txt(v,px+pw-txtW(v),y,'#ddd');});
  // abilities: icon row, the focused one explained below
  [...SLOTS].forEach((k,i)=>{const s=SPELLS[k][C.kit[k]],x=ABX(i),f=i===selAb;spellBox(x,ABY,s,true);if(f){ctx.fillStyle=C.col;ctx.fillRect(x-2,ABY-2,17,1);ctx.fillRect(x-2,ABY+14,17,1);ctx.fillRect(x-2,ABY-2,1,17);ctx.fillRect(x+14,ABY-2,1,17);}
   txt(SLOTKEY[k],x+6-Math.round(txtW(SLOTKEY[k])/2),ABY+16,f?'#fff':'#666');});
  {const k=SLOTS[selAb],s=SPELLS[k][C.kit[k]];txt(s.n,px,ABY+24,s.c);const tag=k==='m'?'BASIC - '+WSIG[C.k]:k==='h'?'HEAVY (HOLD)':k==='e'?'ULTIMATE':'ABILITY';txt(tag,px+pw-txtW(tag),ABY+24,'#777');
   wrapTxt(s.d||'',46).slice(0,2).forEach((l,i)=>txt(l,px,ABY+32+i*7,'#bbb'));}
 }
 ctx.globalAlpha=1;
 // evolution path + your record (bottom of the panel)
 if(!lk){const y=125;[0,3,6,9].forEach((st,i)=>{const sp2=heroSpr(C.k,st),x=px+i*20;ctx.drawImage(sp2.c,WIZ.idle[Math.floor(time*2.5+i)%2]*sp2.fw,0,sp2.fw,sp2.fh,x-2,y-2,sp2.fw,sp2.fh);if(i<3){ctx.fillStyle='#555';ctx.fillRect(x+17,y+10,2,1);}});
  const r=(meta.cst&&meta.cst[C.k])||{runs:0,wins:0,best:0},ex=px+84;
  txt('MASTERS INTO',ex,y+1,'#777');txt(heroEV(C.k,9).n,ex,y+8,C.col);
  const rs=r.runs?('RUNS '+r.runs+'  BEST '+(ROMAN[r.best-1]||'-')+'  WINS '+r.wins):'NOT PLAYED YET';txt(rs,ex,y+15,r.wins?'#fd4':'#999');}
 // ---- roster strip ----
 CLASSES.forEach((K,i)=>{const x=rstX(i),sel=i===selIdx,L=isLocked(i),y=RST.y-(sel?3:0),s=heroSpr(K.k,0);
  ctx.fillStyle=sel?'#2a1a30':'#120c16';ctx.fillRect(x,y,RST.w,RST.h);
  if(sel){ctx.fillStyle=L?'#6a6074':K.col;ctx.globalAlpha=.25;ctx.fillRect(x+1,y+1,RST.w-2,RST.h-2);ctx.globalAlpha=1;}
  ctx.fillStyle=sel?(L?'#8a8094':K.col):'#3a2e44';ctx.fillRect(x,y,RST.w,1);ctx.fillRect(x,y+RST.h-1,RST.w,1);ctx.fillRect(x,y,1,RST.h);ctx.fillRect(x+RST.w-1,y,1,RST.h);
  const fr2=sel&&!L?WIZ.idle[Math.floor(time*2.5)%2]:0;
  if(L){ctx.drawImage(silOf(s,K.k),fr2*s.fw,0,s.fw,s.fh,x+1,y-1,s.fw,s.fh);padlock(x+8,y+7,sel?'#e0c070':'#6a5a40');}
  else{if(!sel)ctx.globalAlpha=.6;ctx.drawImage(s.c,fr2*s.fw,0,s.fw,s.fh,x+1,y-1,s.fw,s.fh);ctx.globalAlpha=1;}
  txt(String(i+1),x+2,y+2,sel?'#fff':'#555');});
 {const l=rstX(0)-8,r=rstX(CLASSES.length-1)+RST.w+4,b=Math.floor(time*3)%2;txt('<',l-(b?1:0),RST.y+7,'#888');txt('>',r+(b?1:0),RST.y+7,'#888');}
 // ---- footer: key hints ----
 {const hint=selLock?'':lk?'A/D CHOOSE   ESC BACK':'A/D HERO   W/S SKILL   F FINAL FORM   ENTER START   TAB TREE   K GUIDE';txt(hint,Math.round((W-txtW(hint))/2),H-6,'#777');}
 // ---- confirm: a READY banner sweeps across with a burst ----
 if(selLock){const t=time-selT,k=clamp(t/.25,0,1),bw=Math.round(W*k);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,64,bw,26);ctx.fillStyle=C.col;ctx.fillRect(0,64,bw,1);ctx.fillRect(0,89,bw,1);
  if(k>=1){const s=C.n+' - READY';txt(s,Math.round((W-txtW(s,2))/2),71,'#fff',2);}
  for(let i=0;i<3;i++){const r=(t*120+i*14)%80;ctx.globalAlpha=Math.max(0,1-r/80);ctx.strokeStyle=C.col;ctx.beginPath();ctx.ellipse(cx,fy-30,r,r*.6,0,0,TAU);ctx.stroke();}ctx.globalAlpha=1;}
};
