'use strict';
// ===== PAUSE, SETTINGS AND THE GUIDE, redesigned =====
// Pause: a menu on the left (resume, settings, guide, controls, save and quit) and a summary of your run on the right.
// Settings: four categories (gameplay, audio, display, controls) with sliders, switches, selectors and key caps.
// Guide: an icon list on the left, a detail card on the right, and how much of each tab you have discovered.
// All three work with the mouse as well as the keyboard.

// ---------- shared widgets ----------
function m2Box(x,y,w,h,acc,a){ctx.fillStyle='rgba(14,9,20,'+(a||.94)+')';ctx.fillRect(x,y,w,h);ctx.fillStyle='#2e2440';ctx.fillRect(x,y+h-1,w,1);ctx.fillRect(x,y,1,h);ctx.fillRect(x+w-1,y,1,h);ctx.fillStyle=acc||'#d02030';ctx.fillRect(x,y,w,1);}
function m2Key(x,y,label,on,blink){const w=Math.max(11,txtW(label)+6);ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,w+2,11);ctx.fillStyle=on?'#e8e0d0':'#9a92a8';ctx.fillRect(x,y,w,9);ctx.fillStyle=on?'#c8c0b0':'#6a627a';ctx.fillRect(x,y+7,w,2);
 if(!blink||Math.floor(time*4)%2)txt(label,x+3,y+1,'#14101a');return w;}
function m2Toggle(x,y,on,sel){x-=6;ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,26,9);ctx.fillStyle=on?'#2a8a3a':'#3a2e44';ctx.fillRect(x,y,24,7);ctx.fillStyle=sel?'#fff':'#ddd';ctx.fillRect(on?x+17:x+1,y+1,6,5);txt(on?'ON':'OFF',on?x+4:x+9,y+1,on?'#bff0c0':'#888');}
function m2Slider(x,y,v,mx,col,sel){for(let i=0;i<mx;i++){ctx.fillStyle=i<v?col:'#2a2030';ctx.fillRect(x+i*6,y+1,5,5);if(i<v){ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x+i*6,y+1,5,1);}}const s=String(v);txt(s,x+mx*6+3,y+1,sel?'#fff':'#aaa');}
function m2Pill(x,y,w,h,col,on){ctx.fillStyle=on?col:'#1e1628';ctx.fillRect(x+1,y,w-2,h);ctx.fillRect(x,y+1,w,h-2);}
function m2Prog(x,y,w,f,col){ctx.fillStyle='#2a2030';ctx.fillRect(x,y,w,3);ctx.fillStyle=col;ctx.fillRect(x,y,Math.round(w*clamp(f,0,1)),3);}
const m2In=(x,y,w,h)=>mouse.x>=x&&mouse.x<x+w&&mouse.y>=y&&mouse.y<y+h;
let m2MX=-1,m2MY=-1;const m2Moved=()=>{const m=mouse.x!==m2MX||mouse.y!==m2MY;m2MX=mouse.x;m2MY=mouse.y;return m;};

// =============== PAUSE ===============
let pauseSel=0;
const PAUSEITEMS=()=>[{n:'RESUME',f:()=>{paused=false;}},{n:'SETTINGS',f:()=>openOptions('play')},{n:'GUIDE',f:()=>openGuide('play')},{n:'CONTROLS',ctl:1},
 R&&R.training?{n:'END TRAINING',f:()=>{paused=false;finishTraining();}}:{n:'SAVE AND QUIT',f:()=>{saveRun();R=null;mode='title';paused=false;setToast('','#fff',0);}}];
const PIY=i=>58+i*15;
function pauseKey(c){const it=PAUSEITEMS();
 if(c==='ArrowUp'||c==='KeyW'){pauseSel=(pauseSel+it.length-1)%it.length;sfx('coin');}
 else if(c==='ArrowDown'||c==='KeyS'){pauseSel=(pauseSel+1)%it.length;sfx('coin');}
 else if(c==='Enter'||c==='Space'){const x=it[pauseSel];if(x.f){x.f();sfx('tool');}}
 else if(c==='KeyK')openGuide('play');else if(c==='KeyO')openOptions('play');else if(c==='KeyQ'&&!R.training){it[4].f();}}
function pauseClick(){const it=PAUSEITEMS();for(let i=0;i<it.length;i++)if(m2In(12,PIY(i)-3,96,13)){pauseSel=i;if(it[i].f){it[i].f();sfx('tool');}return;}}
function drawPause(){
 ctx.fillStyle='rgba(6,3,10,.8)';ctx.fillRect(0,0,W,H);
 const it=PAUSEITEMS();if(m2Moved())for(let i=0;i<it.length;i++)if(m2In(12,PIY(i)-3,96,13)&&pauseSel!==i){pauseSel=i;sfx('coin');}
 pauseSel=clamp(pauseSel,0,it.length-1);
 // left: title, where you are, the menu
 txt('PAUSED',12,12,'#fff',2);ctx.fillStyle='#d02030';ctx.fillRect(12,27,96,1);
 {const nm=R.training?'TRAINING GROUNDS':ROMAN[R.di]+'. '+DUN[R.di].name;wrapTxt(nm,24).slice(0,2).forEach((l,i)=>txt(l,12,31+i*7,'#bbb'));
  const t=Math.floor(R.time||0);txt(Math.floor(t/60)+'M '+String(t%60).padStart(2,'0')+'S  -  '+(R.kills||0)+' SLAIN',12,46,'#777');}
 it.forEach((x,i)=>{const y=PIY(i),sel=i===pauseSel;m2Pill(12,y-3,96,13,'#d02030',sel);if(sel){ctx.fillStyle='#ff6070';ctx.fillRect(12,y-3,2,13);}txt(x.n,sel?20:16,y,sel?'#fff':'#999');});
 txt('M MUTE   ESC RESUME',12,H-10,'#666');
 // right: the run summary, or the controls
 const X=118,Y=8,Wd=W-X-6,Hd=H-16;m2Box(X,Y,Wd,Hd,CLS().col);
 if(it[pauseSel].ctl){drawControlsCard(X,Y,Wd);return;}
 // hero, form, trophy and health
 const C=CLS(),st=P.evo||0,sp=heroSpr(C.k,st);ctx.fillStyle='#1e1628';ctx.fillRect(X+6,Y+6,30,34);ctx.drawImage(sp.c,WIZ.idle[Math.floor(time*2.5)%2]*sp.fw,0,sp.fw,sp.fh,X+11,Y+10,sp.fw,sp.fh);
 txt(C.n,X+42,Y+7,C.col);txt('FORM '+(st+1)+'/10: '+heroEV(C.k,st).n,X+42,Y+15,'#ffe060');
 txt(st&&typeof EVOGEAR!=='undefined'?'TROPHY: '+EVOGEAR[st]:'BEAT A BOSS TO EARN A TROPHY',X+42,Y+23,'#aa9');
 bar(X+42,Y+31,90,6,P.hp/S.maxhp,'#c22','#3a1010');txt(Math.ceil(P.hp)+'/'+S.maxhp,X+45,Y+32,'#fff');
 {hudCoin(X+Wd-48,Y+7);txt(String(R.sen),X+Wd-39,Y+8,'#fc4');hudRevive(X+Wd-48,Y+17);txt('X'+P.rez,X+Wd-39,Y+18,'#bfe8ff');txt('SCORE '+(R.score||0),X+Wd-txtW('SCORE '+(R.score||0))-6,Y+30,'#fff8c0');}
 // stats
 txt('STATS',X+6,Y+46,'#d02030');
 const SS=[['POWER',Math.round(S.atk)],['MAX HP',S.maxhp],['DEFENCE',S.def],['CRIT',Math.round(S.crit*100)+'%'],['COOLDOWNS','-'+Math.round((1-S.cdr)*100)+'%'],['DODGE',Math.round((S.dodge||0)*100)+'%'],['CAST SPEED',Math.round(S.aspd*100)+'%'],['MOVE SPEED',Math.round(S.spd||0)]];
 SS.forEach(([n,v],i)=>{const x=X+6+(i%2)*92,y=Y+55+((i/2)|0)*8;txt(n,x,y,'#888');const s=String(v);txt(s,x+86-txtW(s),y,'#ddd');});
 {let x=X+6;STATS.forEach(s=>{const b=meta.stats[s.k]||0,r=(S.st[s.k]||0)-b,t=s.n.slice(0,3)+' '+b+(r?'+'+r:'');txt(t,x,Y+89,s.c);x+=txtW(t)+6;});}
 // gear and relics
 txt('GEAR',X+6,Y+100,'#d02030');['wpn','arm','ring'].forEach((s,i)=>{const g=R.eq[s],y=Y+108+i*14;drawItemIcon(g,X+6,y);txt(g?g.name.slice(0,22):'NO '+SLOTNAME[s],X+24,y+1,g?itemCol(g):'#555');if(g)txt(gearLines(g)[1]?gearLines(g)[1].slice(0,22):'',X+24,y+7,'#777');});
 txt('RELICS',X+110,Y+100,'#d02030');{const ids=Object.keys(R.inv);if(!ids.length)txt('NONE YET',X+110,Y+109,'#555');ids.slice(0,24).forEach((id,i)=>{const x=X+110+(i%6)*13,y=Y+108+((i/6)|0)*13;relicBox(x,y,id,11);if(R.inv[id]>1)txt(R.inv[id],x+7,y+7,'#fff');});
  if(ids.length>24)txt('+'+(ids.length-24),X+110,Y+160,'#aaa');}
 // set bonuses and curses at the bottom
 {let y=Y+152;for(const l of setLines().slice(0,1)){txt(l.s.slice(0,46),X+6,y,l.c);y+=8;}
  if(curseCount()){const cn={};for(const k of (R.cnames||[]))cn[k]=(cn[k]||0)+1;let x=X+6;txt('CURSES',x,y,'#c6f');x+=30;for(const k in cn){const C=CURSES[k];if(!C)continue;const t=C.n.split(' ').pop()+(cn[k]>1?' X'+cn[k]:'');txt(t,x,y,C.c);x+=txtW(t)+6;}}}
}
function drawControlsCard(X,Y,Wd){txt('CONTROLS',X+6,Y+6,'#d02030');txt('CHANGE THEM IN SETTINGS',X+Wd-6-txtW('CHANGE THEM IN SETTINGS'),Y+6,'#666');
 const L=[['MOVE',[KB.up,KB.left,KB.down,KB.right].map(keyName)],['AIM',['MOUSE']],['ATTACK / HEAVY',['LMB','RMB']],['ABILITIES',[KB.q,KB.w,KB.f].map(keyName)],['ULTIMATE',[keyName(KB.e)]],['DASH',[keyName(KB.dash)]],
  ['FOCUS (HOLD)',[keyName(KB.focus)]],['POTION',[keyName(KB.heal)]],['INTERACT',[keyName(KB.use)]],['TAKE FROM BAG',['1-6']],['BACKPACK',[keyName(KB.pack)]],['SWAP WEAPON',[keyName(KB.swap)]],['ROTATE CAMERA',[',','.']],['GUIDE / SETTINGS',['K','O']]];
 L.forEach(([n,ks],i)=>{const col=i%2,row=(i/2)|0,x=X+6+col*96,y=Y+18+row*21;txt(n,x,y,'#999');let kx=x;for(const k of ks)kx+=m2Key(kx,y+8,k,true)+3;});}

// =============== SETTINGS ===============
const OCATS=[{n:'GAMEPLAY',c:'#ffd040'},{n:'AUDIO',c:'#40c0ff'},{n:'DISPLAY',c:'#c080ff'},{n:'CONTROLS',c:'#50e060'}];
const OCATOF={'DIFFICULTY':0,'AUTO FIRE':0,'DAMAGE NUMBERS':0,'SPIRIT TRAIL':0,'NEW GAME+':0,'MUSIC VOLUME':1,'SOUND EFFECTS':1,'SCREEN SHAKE':2,'BULLET CONTRAST':2,'SCREEN FLASHES':2,'DEBUG OVERLAY':2};
const ORows=()=>{const r=OPTROWS();r.forEach(x=>x.cat=x.key||x.act?3:(OCATOF[x.n]!=null?OCATOF[x.n]:0));return [0,1,2,3].flatMap(c=>r.filter(x=>x.cat===c));};
const OROWH=13,OVIS=9,OX=92,OY=34;
let optTop=0;
optionsKey=function(c){
 const rows=ORows();optSel=clamp(optSel,0,rows.length-1);
 if(optWait){if(c!=='Escape'){for(const [k] of KBACTS)if(k!==optWait&&OPT().kb[k]===c)OPT().kb[k]=OPT().kb[optWait];OPT().kb[optWait]=c;syncKeyLabels();sfx('pickup');}optWait=null;saveMeta();return;}
 if(c==='Escape'||c==='KeyO'){closeOptions();return;}
 if(c==='ArrowUp'||c==='KeyW'){optSel=(optSel+rows.length-1)%rows.length;sfx('coin');}
 else if(c==='ArrowDown'||c==='KeyS'){optSel=(optSel+1)%rows.length;sfx('coin');}
 else if(c==='Tab'||c==='KeyE'||c==='KeyQ'){const cur=rows[optSel].cat,d=c==='KeyQ'?3:1,nc=(cur+d)%4;optSel=rows.findIndex(r=>r.cat===nc);sfx('coin');}
 else{const r=rows[optSel];if(c==='ArrowLeft'||c==='ArrowRight'||c==='KeyA'||c==='KeyD'){if(r.ch){r.ch(c==='ArrowLeft'||c==='KeyA'?-1:1);sfx('coin');}}
  else if(c==='Enter'||c==='Space'){if(r.key){optWait=r.key;sfx('tool');}else if(r.act)r.act();else if(r.ch){r.ch(1);sfx('coin');}}}
 saveMeta();};
function optRowKind(r){if(r.key)return 'key';if(r.act)return 'btn';if(/VOLUME|SOUND/.test(r.n))return 'slider';const v=r.v();if(v==='ON'||v==='OFF')return 'toggle';return 'sel';}
function optVisible(rows){const cur=rows[optSel].cat,list=rows.map((r,i)=>[r,i]).filter(([r])=>r.cat===cur),pos=list.findIndex(([,i])=>i===optSel);
 optTop=clamp(optTop,Math.max(0,pos-OVIS+1),pos);optTop=clamp(optTop,0,Math.max(0,list.length-OVIS));return {cur,list:list.slice(optTop,optTop+OVIS),all:list.length};}
function optClick(){if(optWait)return;const rows=ORows();
 for(let i=0;i<4;i++)if(m2In(10,OY+i*20-4,74,16)){optSel=rows.findIndex(r=>r.cat===i);optTop=0;sfx('coin');return;}
 const V=optVisible(rows);V.list.forEach(([r,i],j)=>{const y=OY+j*OROWH;if(!m2In(OX,y-3,W-OX-10,OROWH))return;optSel=i;const k=optRowKind(r);
  if(k==='key'){optWait=r.key;sfx('tool');}else if(k==='btn')r.act();else if(k==='toggle'){r.ch(1);sfx('coin');}else if(r.ch){r.ch(mouse.x<W-70?-1:1);sfx('coin');}saveMeta();});}
renderOptions=function(){
 bg();ctx.fillStyle='rgba(6,3,10,.85)';ctx.fillRect(0,0,W,H);
 const rows=ORows();optSel=clamp(optSel,0,rows.length-1);
 if(!optWait&&m2Moved()){const V=optVisible(rows);V.list.forEach(([r,i],j)=>{if(m2In(OX,OY+j*OROWH-3,W-OX-10,OROWH))optSel=i;});}
 const V=optVisible(rows),cat=OCATS[V.cur];
 txt('SETTINGS',10,8,'#fff',2);{const s=optFrom==='play'?'GAME PAUSED':'';txt(s,W-10-txtW(s),12,'#777');}ctx.fillStyle=cat.c;ctx.fillRect(10,23,W-20,1);
 // sidebar categories
 OCATS.forEach((C,i)=>{const y=OY+i*20-4,on=i===V.cur;m2Pill(10,y,74,16,shade(C.c,-.55),on);if(on){ctx.fillStyle=C.c;ctx.fillRect(10,y,2,16);}
  // a small glyph per category
  const gx=17,gy=y+5;ctx.fillStyle=on?C.c:'#666';
  if(i===0){ctx.fillRect(gx,gy+1,5,4);ctx.fillRect(gx+1,gy,3,6);ctx.fillStyle='#14101a';ctx.fillRect(gx+2,gy+2,1,2);}
  else if(i===1){ctx.fillRect(gx+3,gy,1,5);ctx.fillRect(gx+4,gy,2,1);ctx.fillRect(gx+1,gy+4,3,2);}
  else if(i===2){ctx.fillRect(gx,gy+2,6,2);ctx.fillRect(gx+1,gy+1,4,4);ctx.fillStyle='#14101a';ctx.fillRect(gx+2,gy+2,2,2);}
  else{ctx.fillRect(gx,gy+1,7,5);ctx.fillStyle='#14101a';ctx.fillRect(gx+1,gy+2,1,1);ctx.fillRect(gx+3,gy+2,1,1);ctx.fillRect(gx+5,gy+2,1,1);ctx.fillRect(gx+2,gy+4,3,1);}
  txt(C.n,27,y+6,on?'#fff':'#888');});
 // rows of the current category
 V.list.forEach(([r,i],j)=>{const y=OY+j*OROWH,sel=i===optSel,k=optRowKind(r);
  if(sel){ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(OX,y-3,W-OX-10,OROWH-1);ctx.fillStyle=cat.c;ctx.fillRect(OX,y-3,2,OROWH-1);}
  txt(r.n,OX+6,y,sel?'#fff':k==='key'?'#9ab':'#bbb');const rx=W-14;
  if(k==='slider'){const v=r.n==='MUSIC VOLUME'?OPT().mus:OPT().sfx;m2Slider(rx-72,y-1,v,10,cat.c,sel);}
  else if(k==='toggle')m2Toggle(rx-18,y-1,r.v()==='ON',sel);
  else if(k==='key'){const lab=optWait===r.key?'PRESS A KEY':keyName(KB[r.key]);const w=Math.max(11,txtW(lab)+6);m2Key(rx-w,y-2,lab,optWait!==r.key,optWait===r.key);}
  else if(k==='btn'){const s='RESET';const w=txtW(s)+8;m2Pill(rx-w,y-3,w,11,'#802020',sel);txt(s,rx-w+4,y,'#fff');}
  else{const v=r.v(),s=sel?'< '+v+' >':v;txt(s,rx-txtW(s),y,r.c?r.c():sel?'#fff':'#aaa');}});
 if(optTop>0)txt('^',W-12,OY-10,'#888');if(optTop+OVIS<V.all)txt('V',W-12,OY+OVIS*OROWH-4,'#888');
 // description and hints
 const r=rows[optSel];m2Box(OX,H-38,W-OX-10,18,cat.c,.9);
 const info=optWait?'PRESS THE NEW KEY (ESC CANCELS). A KEY ALREADY IN USE SWAPS OVER.':r.info?r.info():r.key?'ENTER OR CLICK, THEN PRESS THE NEW KEY':optRowKind(r)==='slider'?'A/D OR LEFT/RIGHT TO CHANGE':optRowKind(r)==='toggle'?'ENTER OR CLICK TO SWITCH':r.act?'PUTS EVERY KEY BACK TO DEFAULT':'A/D OR LEFT/RIGHT TO CHANGE';
 wrapTxt(info,54).slice(0,2).forEach((l,i)=>txt(l,OX+4,H-34+i*7,'#8cf'));
 txt('W/S MOVE   A/D CHANGE   Q/E OR TAB CATEGORY   ENTER SELECT   ESC BACK',10,H-9,'#666');};

// =============== THE GUIDE ===============
const GTABC=['#e08060','#ff5050','#c080ff','#e8eef6','#ffd040','#50e060','#40c0ff'];
const GTSUB=['BEAST','GUARDIAN','RELIC','GEAR','POWER','STAT','TERM'];
const GLX=6,GLY=36,GLW=118,GLH=11,GROWS=11;
let guideTop=0;
function guideTabX(i){let x=6;for(let j=0;j<i;j++)x+=txtW(GTABS[j])+10;return x;}
function guideClick(){for(let i=0;i<GTABS.length;i++){const x=guideTabX(i),w=txtW(GTABS[i])+8;if(m2In(x,4,w,11)){guideTab=i;guideSel=0;guideTop=0;sfx('coin');return;}}
 const L=guideEntries(guideTab);for(let j=0;j<GROWS;j++){const i=guideTop+j;if(i>=L.length)break;if(m2In(GLX,GLY+j*GLH-2,GLW,GLH)){guideSel=i;sfx('coin');}}}
renderGuide=function(){
 bg();ctx.fillStyle='rgba(6,3,10,.86)';ctx.fillRect(0,0,W,H);
 // tabs
 GTABS.forEach((t,i)=>{const x=guideTabX(i),w=txtW(t)+8,on=i===guideTab;m2Pill(x,4,w,11,shade(GTABC[i],-.6),on);if(on){ctx.fillStyle=GTABC[i];ctx.fillRect(x,14,w,1);}txt(t,x+4,7,on?'#fff':'#888');});
 const L=guideEntries(guideTab),got=L.filter(e=>e.u).length,tc=GTABC[guideTab];
 // discovery progress for this tab
 {txt('DISCOVERED',6,21,'#777');m2Prog(52,22,72,got/Math.max(1,L.length),tc);const s=got+'/'+L.length;txt(s,128,21,'#ddd');
  const all=GTABS.reduce((a,_,i)=>{const E=guideEntries(i);return [a[0]+E.filter(e=>e.u).length,a[1]+E.length];},[0,0]),s2='TOTAL '+Math.round(all[0]/Math.max(1,all[1])*100)+'%';txt(s2,W-6-txtW(s2),21,'#777');}
 guideSel=clamp(guideSel,0,L.length-1);
 if(m2Moved())for(let j=0;j<GROWS;j++){const i=guideTop+j;if(i<L.length&&m2In(GLX,GLY+j*GLH-2,GLW,GLH))guideSel=i;}
 guideTop=clamp(guideTop,Math.max(0,guideSel-GROWS+1),guideSel);guideTop=clamp(guideTop,0,Math.max(0,L.length-GROWS));
 // list
 m2Box(GLX-2,GLY-5,GLW+4,GROWS*GLH+6,tc,.9);
 for(let j=0;j<GROWS;j++){const i=guideTop+j;if(i>=L.length)break;const e=L[i],y=GLY+j*GLH,sel=i===guideSel;
  if(sel){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(GLX,y-2,GLW,GLH-1);ctx.fillStyle=tc;ctx.fillRect(GLX,y-2,2,GLH-1);}
  // icon
  if(!e.u){ctx.fillStyle='#1e1628';ctx.fillRect(GLX+4,y-1,8,8);txt('?',GLX+6,y,'#555');}
  else if(e.relic)relicBox(GLX+4,y-1,e.relic,8);
  else{ctx.fillStyle='#000';ctx.fillRect(GLX+4,y-1,8,8);ctx.fillStyle=e.col&&e.col!=='#ddd'?e.col:tc;ctx.fillRect(GLX+5,y,6,6);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(GLX+5,y,6,1);}
  txt(e.u?e.n.slice(0,24):'? ? ?',GLX+15,y,e.u?(sel?'#fff':shade(e.col||'#ddd',-.1)):'#555');}
 if(guideTop>0)txt('^',GLX+GLW-6,GLY-4,'#888');if(guideTop+GROWS<L.length)txt('V',GLX+GLW-6,GLY+GROWS*GLH-6,'#888');
 // detail card
 let e=L[guideSel];const X=130,Y=31,Wd=W-X-6,Hd=H-Y-14;m2Box(X,Y,Wd,Hd,e.u?(e.col||tc):'#3a2e44');
 if(!e.u){txt('? ? ?',X+8,Y+8,'#777',2);txt('UNDISCOVERED '+GTSUB[guideTab],X+8,Y+24,'#666');ctx.fillStyle='#1e1628';ctx.fillRect(X+Wd/2-14,Y+44,28,32);txt('?',X+Wd/2-2,Y+56,'#555',2);
  wrapTxt(e.L[0]||'',44).forEach((l,i)=>txt(l,X+8,Y+90+i*8,'#888'));}
 else{
  txt(e.n.slice(0,30),X+8,Y+6,e.col||tc);{const sub=guideTab===1?'GUARDIAN OF '+ROMAN[guideSel]:GTSUB[guideTab];txt(sub,X+Wd-8-txtW(sub),Y+6,'#777');}
  ctx.fillStyle='#2e2440';ctx.fillRect(X+6,Y+14,Wd-12,1);
  let ly=Y+19;
  // art: the creature, the relic, the bag, or the guardian's numeral
  if(e.spr){const s=e.spr(),sc=s.fh>40?1:2,aw=s.fw*sc,ah=s.fh*sc;glowDisc2(X+8+aw/2,ly+ah/2,Math.max(aw,ah)*.6,tc);ctx.drawImage(s.c,Math.floor(time*3)%Math.max(1,s.frames||1)*s.fw,0,s.fw,s.fh,X+8,ly,aw,ah);
   const tx=X+14+aw;let ty=ly;for(const l of e.L.slice(0,1))for(const w2 of wrapTxt(l,Math.floor((Wd-aw-20)/4.5))){txt(w2,tx,ty,'#ddd');ty+=8;}ly=Math.max(ly+ah+4,ty+2);
   e={...e,L:e.L.slice(1)};}
  else if(e.relic){relicBox(X+8,ly,e.relic,20);ly+=26;}
  else if(e.bag!=null){const b=BAGSPR[e.bag];ctx.drawImage(b.c,X+8,ly);ly+=b.h+4;}
  else if(guideTab===1){ctx.fillStyle=shade(e.col||tc,-.6);ctx.fillRect(X+8,ly,26,22);ctx.fillStyle=e.col||tc;ctx.fillRect(X+8,ly,26,1);const r=ROMAN[guideSel];txt(r,X+21-Math.round(txtW(r,2)/2),ly+5,'#fff',2);
   const tale=(DUN[guideSel]&&DUN[guideSel].tale)||'';let ty=ly;for(const w2 of wrapTxt(tale,34).slice(0,7)){txt(w2,X+40,ty,'#aa9');ty+=7;}ly=Math.max(ly+26,ty+3);}
  // the entry's lines: "LABEL: TEXT" lines get a coloured label
  for(const l of e.L){if(!l)continue;const m=/^([A-Z0-9 ']{3,18}): (.*)$/.exec(l);const lines=wrapTxt(l,44);
   for(let k=0;k<lines.length;k++){if(ly>Y+Hd-8)break;if(k===0&&m){txt(m[1]+':',X+8,ly,e.col||tc);txt(lines[0].slice(m[1].length+1),X+8+txtW(m[1]+':'),ly,'#ddd');}else txt(lines[k],X+8,ly,'#ccc');ly+=8;}ly+=1;}}
 txt('A/D TABS   W/S BROWSE   CLICK OR WHEEL   K OR ESC CLOSE',6,H-9,'#666');};
function glowDisc2(x,y,r,col){for(let i=r;i>0;i-=3){ctx.globalAlpha=.05;disc(x,y,i,col);}ctx.globalAlpha=1;}
{const _gk=guideKey;guideKey=function(c){if(c==='KeyA'||c==='ArrowLeft'||c==='KeyD'||c==='ArrowRight'||c==='Tab')guideTop=0;return _gk(c);};}

// ---------- mouse: clicks and the wheel on these screens ----------
cv.addEventListener('mousedown',e=>{if(e.button!==0)return;if(mode==='options')optClick();else if(mode==='guide')guideClick();else if(mode==='play'&&paused&&!invOpen)pauseClick();});
cv.addEventListener('wheel',e=>{const d=e.deltaY>0?1:-1;if(mode==='guide'){const n=guideEntries(guideTab).length;guideSel=clamp(guideSel+d,0,n-1);e.preventDefault();}
 else if(mode==='options'){optionsKey(d>0?'ArrowDown':'ArrowUp');e.preventDefault();}},{passive:false});
