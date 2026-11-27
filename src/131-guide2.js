'use strict';
// SHINOBIDUNGEONS - the guide, wide like the pause screen. Every foe and guardian has its sprite: a small icon in the list
// and big, animated art in the detail card. Ones you haven't met yet show as dark silhouettes, so you know what to hunt.

const GSIL={};
function silhouette(c,key){if(GSIL[key])return GSIL[key];return GSIL[key]=mk(c.width,c.height,g=>{g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#2a2236';g.fillRect(0,0,c.width,c.height);});}
// every beast and guardian entry knows its art, discovered or not
{const _ge=guideEntries;guideEntries=function(tab){const L=_ge(tab);
 if(tab===0){const ks=Object.keys(ET).filter(t=>!['dummy','turret'].includes(t));L.forEach((e,i)=>{const t=ks[i];if(t&&!e.art){e.art=()=>{try{return getSpr(t,0);}catch(_){return null;}};e.akey='e_'+t;}});}
 if(tab===1)L.forEach((e,i)=>{if(!e.art){e.art=()=>guidePortrait(i);e.akey='b_'+i;e.stage=i;}});
 return L;};}
const GG={LX:6,LY:32,LW:152,RH:14};
const gRows=()=>Math.floor((H-GG.LY-16)/GG.RH);
const gTabC=i=>GTABC[i]||'#8cf';
function gArt(e){const s=e.art?e.art():e.spr?e.spr():null;return s&&s.c?s:null;}
function gFrame(s,anim){const n=Math.max(1,Math.min(s.frames||1,Math.floor((s.c.width||s.fw)/s.fw)));return anim?Math.floor(time*3)%n:0;}
// draw a sprite's frame scaled to fit a box, integer scale where it can, centred on the box's floor
function gDraw(s,e,bx,by,bw,bh,anim,known){const sc0=Math.min(bw/s.fw,bh/s.fh),sc=sc0>=1?Math.min(3,Math.floor(sc0)):sc0,w=Math.round(s.fw*sc),h=Math.round(s.fh*sc),x=Math.round(bx+(bw-w)/2),y=Math.round(by+bh-h);
 const detail=known&&finishWorldSprite(s).hd,density=detail?2:1;
 const src=known?detail||s.c:silhouette(s.c,e.akey||e.n),fw=s.fw*density,fh=s.fh*density;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(src,gFrame(s,anim)*fw,0,fw,fh,x,y,w,h);return {x,y,w,h};}

guideClick=function(){for(let i=0;i<GTABS.length;i++){const x=guideTabX(i),w=txtW(GTABS[i])+8;if(m2In(x,4,w,11)){guideTab=i;guideSel=0;guideTop=0;sfx('coin');return;}}
 const L=guideEntries(guideTab);for(let j=0;j<gRows();j++){const i=guideTop+j;if(i>=L.length)break;if(m2In(GG.LX,GG.LY+4+j*GG.RH,GG.LW,GG.RH)){guideSel=i;sfx('coin');}}};

renderGuide=function(){
 bg();ctx.fillStyle='rgba(6,3,10,.86)';ctx.fillRect(0,0,W,H);
 GTABS.forEach((t,i)=>{const x=guideTabX(i),w=txtW(t)+8,on=i===guideTab;m2Pill(x,4,w,11,shade(gTabC(i),-.6),on);if(on){ctx.fillStyle=gTabC(i);ctx.fillRect(x,14,w,1);}txt(t,x+4,7,on?'#fff':'#888');});
 const L=guideEntries(guideTab),got=L.filter(e=>e.u).length,tc=gTabC(guideTab),rows=gRows();
 {txt('DISCOVERED',6,20,'#777');m2Prog(52,21,70,got/Math.max(1,L.length),tc);txt(got+'/'+L.length,126,20,'#ddd');
  const all=GTABS.reduce((a,_,i)=>{const E=guideEntries(i);return [a[0]+E.filter(e=>e.u).length,a[1]+E.length];},[0,0]),s2='TOTAL '+Math.round(all[0]/Math.max(1,all[1])*100)+'%';txt(s2,W-6-txtW(s2),20,'#777');}
 guideSel=clamp(guideSel,0,L.length-1);
 if(m2Moved())for(let j=0;j<rows;j++){const i=guideTop+j;if(i<L.length&&m2In(GG.LX,GG.LY+4+j*GG.RH,GG.LW,GG.RH))guideSel=i;}
 guideTop=clamp(guideTop,Math.max(0,guideSel-rows+1),guideSel);guideTop=clamp(guideTop,0,Math.max(0,L.length-rows));
 // the list: an icon (sprite, relic or swatch) and the name
 m2Box(GG.LX-2,GG.LY,GG.LW+4,rows*GG.RH+8,tc,.9);
 for(let j=0;j<rows;j++){const i=guideTop+j;if(i>=L.length)break;const e=L[i],y=GG.LY+4+j*GG.RH,sel=i===guideSel;
  if(sel){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(GG.LX,y,GG.LW,GG.RH-1);ctx.fillStyle=tc;ctx.fillRect(GG.LX,y,2,GG.RH-1);}
  const s=gArt(e);ctx.fillStyle='#120c18';ctx.fillRect(GG.LX+4,y+1,12,12);
  if(s){ctx.save();ctx.beginPath();ctx.rect(GG.LX+4,y+1,12,12);ctx.clip();gDraw(s,e,GG.LX+2,y-1,16,14,false,e.u);ctx.restore();}
  else if(e.relic&&e.u)relicBox(GG.LX+5,y+2,e.relic,10);
  else if(e.u){ctx.fillStyle=e.col&&e.col!=='#ddd'?e.col:tc;ctx.fillRect(GG.LX+6,y+3,8,8);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(GG.LX+6,y+3,8,1);}
  else txt('?',GG.LX+8,y+4,'#555');
  const nm=e.u?e.n:(e.stage!=null?'GUARDIAN OF '+ROMAN[e.stage]:'? ? ?');txt(nm.slice(0,30),GG.LX+20,y+4,e.u?(sel?'#fff':shade(e.col||'#ddd',-.05)):'#555');}
 if(guideTop>0)txt('^',GG.LX+GG.LW-6,GG.LY+2,'#888');if(guideTop+rows<L.length)txt('V',GG.LX+GG.LW-6,GG.LY+rows*GG.RH+1,'#888');
 // the detail card
 const e=L[guideSel],X=GG.LX+GG.LW+8,Y=GG.LY,Wd=W-X-6,Hd=rows*GG.RH+8;m2Box(X,Y,Wd,Hd,e.u?(e.col||tc):'#3a2e44');
 const sub=guideTab===1?'GUARDIAN OF '+ROMAN[guideSel]:GTSUB[guideTab]||'';
 txt(e.u?e.n.slice(0,40):'? ? ?',X+8,Y+6,e.u?(e.col||tc):'#777');txt(sub,X+Wd-8-txtW(sub),Y+6,'#777');ctx.fillStyle='#2e2440';ctx.fillRect(X+6,Y+14,Wd-12,1);
 let ly=Y+20;const s=gArt(e);
 if(s){const AW=Math.min(110,Math.round(Wd*.42)),AH=Math.min(96,Hd-40);glowDisc2(X+8+AW/2,ly+AH*.6,AW*.5,e.u?(e.col||tc):'#3a2e44');
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(X+8+AW*.25,ly+AH-2,AW*.5,3);gDraw(s,e,X+8,ly,AW,AH,true,e.u);
  if(!e.u)txt('?',X+8+AW/2-3,ly+AH/2-6,'#8a7a9a',2);
  // beside the art: the first line (the tale for guardians, the description for beasts)
  const tx=X+16+AW,tw=Math.floor((X+Wd-8-tx)/4.6);let ty=ly;
  const first=e.u?(e.L[0]||''):(guideTab===1?'GUARDIAN OF '+ROMAN[guideSel]+'. '+DUN[guideSel].name+'. DEFEAT IT TO LEARN ITS WAYS.':'NOT YET MET. DEFEAT ONE TO LEARN ABOUT IT.');
  for(const w of wrapTxt(first,tw)){if(ty>ly+AH)break;txt(w,tx,ty,e.u?'#ddd':'#888');ty+=8;}
  ly=Math.max(ly+AH+6,ty+4);
  if(e.u){for(const l of e.L.slice(1)){if(!l)continue;const m=/^([A-Z0-9 ']{3,18}): (.*)$/.exec(l),lines=wrapTxt(l,Math.floor((Wd-16)/4.6));
   for(let k=0;k<lines.length;k++){if(ly>Y+Hd-8)break;if(k===0&&m){txt(m[1]+':',X+8,ly,e.col||tc);txt(lines[0].slice(m[1].length+1),X+8+txtW(m[1]+':'),ly,'#ddd');}else txt(lines[k],X+8,ly,'#ccc');ly+=8;}ly+=1;}}}
 else if(!e.u){txt('UNDISCOVERED '+(GTSUB[guideTab]||''),X+8,ly,'#666');ly+=12;for(const l of wrapTxt(e.L[0]||'',Math.floor((Wd-16)/4.6))){txt(l,X+8,ly,'#888');ly+=8;}}
 else{if(e.relic){relicBox(X+8,ly,e.relic,24);ly+=30;}else if(e.bag!=null){const b=BAGSPR[e.bag];ctx.drawImage(b.c,X+8,ly,b.c.width*2,b.c.height*2);ly+=b.c.height*2+6;}
  for(const l of e.L){if(!l)continue;const m=/^([A-Z0-9 ']{3,18}): (.*)$/.exec(l),lines=wrapTxt(l,Math.floor((Wd-16)/4.6));
   for(let k=0;k<lines.length;k++){if(ly>Y+Hd-8)break;if(k===0&&m){txt(m[1]+':',X+8,ly,e.col||tc);txt(lines[0].slice(m[1].length+1),X+8+txtW(m[1]+':'),ly,'#ddd');}else txt(lines[k],X+8,ly,'#ccc');ly+=8;}ly+=1;}}
 txt('A/D TABS   W/S BROWSE   CLICK OR WHEEL   K OR ESC CLOSE',6,H-9,'#666');};
{const _sv=setView;setView=function(w,scale){if(mode==='guide')w=true;return _sv(w,scale);};}
