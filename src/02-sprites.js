'use strict';
// HELL OF THE EMPEROR - code-drawn sprites, PNG overrides, decorations (part of the former game.js; files load in numeric order, see index.html)
// ---------- sprites (code-drawn, optional PNG override from assets/) ----------
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'));return c;}
function whiteOf(c){return mk(c.width,c.height,g=>{g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);});}
const HATS={kasa:['..oooooo..','.ohhhhhho.','ohhhhhhhho'],hair:['...oooo...','..ohhhho..','.ohhhhhho.'],hood:['..oooooo..','.ohhhhhho.','.ohhhhhho.'],bald:['..oooooo..','.osssssso.','.osssssso.']};
const FACE=['.osssssso.','.osksskso.','..oooooo..'],FACEH=['.ohhhhhho.','.ohehheho.','..oooooo..'];
const BODY=['.occaacco.','occcccccco','ocdccccdco','ocdccccdco','oaaaaaaaao','.occddcco.','.ocd..dco.','.ooo..ooo.'];
function humanoid(p,hat,horns,sc){
 const face=hat==='hood'?FACEH:FACE,rows=[...HATS[hat],...face,...BODY];
 const c=mk(10,16,g=>{rows.forEach((r,y)=>{for(let x=0;x<10;x++){const ch=r[x];if(!ch||ch==='.'||!p[ch])continue;g.fillStyle=p[ch];g.fillRect(x,y+2,1,1);}});
  if(horns){g.fillStyle=p.a;g.fillRect(1,0,1,3);g.fillRect(8,0,1,3);g.fillRect(2,1,1,1);g.fillRect(7,1,1,1);}});
 return {c,wc:whiteOf(c),fw:10,fh:16,frames:1,sc:sc||1};
}
const SKIN='#e0b080';
const basePal=(c,d,a,h,s)=>({o:'#14101a',k:'#14101a',e:'#e04040',s:s||SKIN,c,d,a,h});
const OV={};
function loadOverride(key,file,fw,fh){const im=new Image();im.onload=()=>{OV[key]={c:im,wc:whiteOf(im),fw,fh,frames:Math.max(1,Math.floor(im.width/fw)),sc:1,ok:true};};im.onerror=()=>{};im.src='assets/'+file;}
// ---- the wizard: a small 20x24 code-drawn sheet with an animation per action ----
// frames: 0-1 idle, 2-5 walk, 6 attack wind-up, 7 attack release, 8-9 casting, 10 ultimate, 11 dash
// 12-14: the class's own 3-step attack (wind-up, strike, follow-through); 15: an idle flourish
const WIZ={idle:[0,1],walk:[2,3,4,5],atk:[12,13,14],cast:[8,9],ult:[10,10],dash:[11,11]};
// per-class poses for the cast frames (8,9) and the new frames (12-15): hand position, weapon angle, arm pose,
// body lean, crouch, and an effect drawn into the frame (slash arc, drawn string, thrown kunai, flying charm...)
const HPOSE={
 sam:{8:{hand:[10,6],ang:-1.57,arm:'up2'},9:{hand:[10,5],ang:-1.57,arm:'up2',fx:'gleam'},
  12:{hand:[7,8],ang:-2.2,arm:'up2',lean:-1},13:{hand:[17,15],ang:.3,arm:'fwd',lean:1,fx:'slash'},14:{hand:[15,19],ang:1.1,arm:'low',lean:1},15:{hand:[12,17],ang:2.7,arm:'hilt'}},
 arc:{8:{hand:[16,14],ang:0,arm:'draw',fx:'pull'},9:{hand:[16,14],ang:0,arm:'fwd',fx:'loose'},
  12:{hand:[16,14],ang:0,arm:'draw',fx:'pull'},13:{hand:[16,14],ang:0,arm:'fwd',fx:'loose'},14:{hand:[15,15],ang:0,arm:'fwd'},15:{hand:[15,15],ang:0,arm:'rest',fx:'nock'}},
 nin:{8:{hand:[10,13],ang:-1.57,arm:'seal'},9:{hand:[10,13],ang:-1.57,arm:'seal',fx:'smoke'},
  12:{hand:[4,11],ang:-2.6,arm:'back',lean:-1},13:{hand:[17,13],ang:-.15,arm:'fwd',lean:2,fx:'throw'},14:{hand:[16,16],ang:.7,arm:'fwd',lean:1,crouch:1},15:{hand:[13,16],ang:-1.2,arm:'rest',crouch:1}},
 onm:{8:{hand:[14,7],ang:-1.8,arm:'up1',fx:'float'},9:{hand:[14,6],ang:-1.6,arm:'up1',fx:'charm'},
  12:{hand:[13,6],ang:-1.9,arm:'up1'},13:{hand:[17,13],ang:-.5,arm:'fwd',fx:'charm'},14:{hand:[15,16],ang:.4,arm:'low'},15:{hand:[14,9],ang:-1.4,arm:'up1',fx:'float'}},
 wiz:{12:6,13:7,14:0,15:9}};
// evolution stages: 0 apprentice (hood, stick), 1 adept (cap, small orb), 2 mage (pointed hat, short beard), 3 master (the full wizard)
const WIZEVO=[{n:'APPRENTICE',hat:'pilgrim',beard:0,orb:1,C:{hat:'#253955',hatL:'#507284',band:'#dfa55e',robe:'#456579',robeS:'#25394f',trim:'#e0c48b',orb:'#42d8d2',orbL:'#baffee',boot:'#272a3a'}},
 {n:'NOVICE',hat:'hood',beard:0,orb:0,C:{hat:'#3e4260',hatL:'#5a5e80',band:'#3e4260',robe:'#5a5e7a',robeS:'#3e4260',trim:'#8a8ea8',orb:'#60c8ff',orbL:'#e0f6ff'}},
 {n:'INITIATE',hat:'cap',beard:0,orb:1,C:{hat:'#1e5a5a',hatL:'#3a8a80',band:'#a0d0c8',robe:'#2e7a70',robeS:'#1e5a5a',trim:'#a0d0c8',orb:'#60f0d0',orbL:'#e0fff6'}},
 {n:'ADEPT',hat:'cap',beard:0,orb:1,C:{hat:'#1e3e70',hatL:'#3a5a9a',band:'#c8c8d0',robe:'#2e5a9a',robeS:'#1e3e70',trim:'#c8c8d0',orb:'#60c8ff',orbL:'#e0f6ff'}},
 {n:'CONJURER',hat:'pointed',beard:0,orb:1,C:{hat:'#6a1a2a',hatL:'#9a3a4a',band:'#e8c050',robe:'#8a2a3a',robeS:'#5a1a24',trim:'#e8c050'}},
 {n:'MAGE',hat:'pointed',beard:1,orb:1,C:{hat:'#3a1e60',hatL:'#5a3a8a',beard:'#6a4a30',beardS:'#4a3220'}},
 {n:'SORCERER',hat:'pointed',beard:1,orb:1,C:{hat:'#14303a',hatL:'#2a5060',band:'#e8c050',robe:'#1e3e48',robeS:'#122830',beard:'#8a8a90',beardS:'#6a6a70',orb:'#c060ff',orbL:'#f0d0ff'}},
 {n:'ARCHMAGE',hat:'pointed',beard:2,orb:1,C:{hat:'#1a2a6a',hatL:'#34489a',robe:'#24348a',robeS:'#16205a',beard:'#a8a8b4',beardS:'#80808c'}},
 {n:'ELDER',hat:'pointed',beard:2,orb:1,C:{hat:'#3a1a5a',hatL:'#5a3a8a',robe:'#4a2a7a',robeS:'#30184e'}},
 {n:'MASTER WIZARD',hat:'pointed',beard:2,orb:1,C:{}}];
function buildWiz(stage,back=false){return buildHero({...WIZEVO[stage],detail:'wizard'},stage>=9,back);}
function drawSumoFrame(R,frame,back,stage){
 const crest=stage>=6,final=stage>=9;
 const walk=frame>=2&&frame<=5;
 const bob=walk&&frame%2===1?1:0;
 const y=12+bob;
 const lean=frame===11?1:0;
 const raised=(frame>=8&&frame<=10)||frame===12;
 // A broad torso and rope belt keep the silhouette distinct at world scale.
 R(5,y,10,2,'skin');R(4,y+2,12,5,'skin');
 R(4,y+4,2,3,'boot');R(14,y+4,2,3,'boot');
 R(5,y+6,10,2,'robe');R(4,y+6,12,1,'band');R(5,y+7,10,1,'trim');
 R(7,y+8,6,2,'robeS');R(8,y+8,4,1,'robe');
 if(!back){R(9,y+4,1,1,'boot');R(8,y+7,4,1,'band');if(crest)R(9,y+8,2,2,'trim');}
 const stride=walk?[0,1,2,1][frame-2]:0;
 R(5+stride,21,4,2,'skin');R(11+stride,22-(stride%2),4,1,'boot');
 const striking=frame===7||frame===13;
 const leftY=raised?10:y+3,rightX=striking||frame===11?16:14,rightY=raised?9:striking?y+1:y+3;
 R(2,leftY,4,3,'skin');R(2,leftY,2,3,'band');
 R(rightX,rightY,3,3,'skin');R(rightX+1,rightY,2,3,'band');
 R(7+lean,8+bob,6,5,back?'hat':'skin');
 R(7+lean,7+bob,6,2,'hat');R(8+lean,5+bob,4,2,'hat');
 R(9+lean,5+bob,2,1,'hatL');
 if(back)R(8+lean,11+bob,4,1,'hatL');
 else{R(11+lean,10+bob,1,1,'o');R(10+lean,12+bob,2,1,'boot');}
 if(crest){
  const plate=final?'#a22d34':'#384f75',gold='#efbc65';
  for(const x of [3,13]){R(x,y-1,4,3,plate);R(x+1,y-2,3,1,gold);R(x,y+1,4,1,gold);}
  R(6,y+7,8,2,plate);R(7,y+8,6,1,gold);
 }
 if(final){
  R(3,y+5,14,2,'band');for(let i=5;i<16;i+=3)R(i,y+5,1,2,'#b89e6d');
  if(!back){R(8,y+7,1,3,'band');R(11,y+7,1,3,'band');}
  R(7+lean,7+bob,6,2,'#a22d34');
  R(6+lean,5+bob,1,3,'#ffe5a3');R(13+lean,5+bob,1,3,'#ffe5a3');
  R(9+lean,4+bob,2,3,'#efbc65');
 }
}
function drawRosterDetail(R,kind,final,bob,back){
 const y=13+bob;
 if(kind==='marionettist'){
  R(5,y,1,7,'hatL');R(14,y,1,7,'hatL');
  R(3,y+3,2,2,'band');R(15,y+3,2,2,'band');
 }else if(kind==='tengu'){
  for(const [x,sign] of [[5,-1],[14,1]])for(let i=0;i<4;i++)R(x+i*sign,y+i,2,1,i%2?'trim':'hatL');
  if(!back)R(12,11+bob,3,1,'hatL');
 }else if(kind==='kagura'){
  R(4,y+1,3,3,'hatL');R(3,y,3,2,'trim');
  R(14,y+2,3,2,'hatL');R(16,y,3,2,'trim');
 }else if(kind==='bloodoracle'){
  R(5,y+2,2,6,'hatL');R(12,y+1,2,7,'band');
  R(9,y+2,2,2,'orbL');
 }else if(kind==='bellwarden'){
  R(13,y+2,5,5,'staff');R(14,y+2,3,2,'trim');
  R(12,y+6,7,1,'hatL');R(15,y+7,1,1,'band');
 }
 if(final){
  R(6,6+bob,1,3,'trim');R(13,6+bob,1,3,'trim');
  R(4,y,3,3,'band');R(13,y,3,3,'band');
  R(4,y+1,2,1,'trim');R(14,y+1,2,1,'trim');
  R(5,y+5,2,4,'band');R(13,y+5,2,4,'band');
 }
}

// generic hero sheet: robe body + a hat style + a weapon. Used by every character class and evolution stage.
// back=true draws the same pose seen from behind (walking away from the camera): no face, back of the head/hood
function buildHero(EV,star,back){const stage=star?9:0;
 const FW=20,FH=24,N=16,C=Object.assign({o:'#14101a',hat:'#2e3a8a',hatL:'#4656b4',band:'#e8c050',skin:'#e0b080',beard:'#eceef6',beardS:'#b8bccc',robe:'#5a2e9a',robeS:'#3e1e70',trim:'#e8c050',staff:'#8a5a2a',staffL:'#b07a40',orb:'#ff8a30',orbL:'#ffe080',boot:'#2a2236'},EV.C);
 const sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 const CK={staff:'wiz',katana:'sam',bokken:'sam',bow:'arc',kunai:'nin',gohei:'onm',gun:'arc',spear:'sam'}[EV.wpn||'staff']||'wiz';
 for(let f0=0;f0<N;f0++){
  // a class pose (cz) replaces the arms + weapon for this frame; for the wizard the new frames reuse his own poses
  let cz=HPOSE[CK][f0],f=f0;if(typeof cz==='number'){f=cz;cz=null;}
  const fr=mk(FW,FH,g=>{
   const R=(x,y,w,h,c)=>{g.fillStyle=C[c]||c;g.fillRect(x,y,w,h);};
   if(EV.wpn==='palms'){drawSumoFrame(R,f0,back,EV.sumoStage);return;}
   const walk=f>=2&&f<=5,bob=cz?(cz.crouch?1:0):(f===1||f===3||f===5)?1:0,lean=cz?(cz.lean||0):f===11?2:0,up=!cz&&(f===8||f===9||f===10);
   // staff placement per pose
   let sx=15,sy=5,horiz=false;if(f===6){sx=4;sy=7;}if(f===7){sx=17;sy=5;}if(up){sx=15;sy=1;}if(f===10){sx=10;sy=0;}if(f===11)horiz=true;
   // boots
   if(walk){const o=[[6,13],[7,12],[8,11],[7,12]][f-2];R(o[0],22,3,2,'boot');R(o[1]-1,22,3,2,'boot');}
   else if(f===11){R(4,21,3,2,'boot');R(9,22,3,2,'boot');}
   else{R(7,22,3,2,'boot');R(11,22,3,2,'boot');}
   // robe: a flared cone with gold hem
   for(let y=13;y<=21;y++){const hw=Math.round(3+(y-13)*.45),x0=10-hw-lean*(y>17?1:0);R(x0,y+bob*(y<18?1:0),hw*2+(lean&&y>17?1:0),1,'robe');R(x0,y+bob*(y<18?1:0),1,1,'robeS');}
   R(6,21,9,1,'trim');if(!back){R(10,14+bob,1,7,'robeS');R(8,13+bob,5,1,'trim');}else{R(8,13+bob,5,1,'robeS');R(7,16+bob,7,1,'robeS');}
   if(f===11){R(2,18,3,2,'robe');R(1,20,3,1,'robeS');} // trailing robe while dashing
   // Class-specific clothing survives every evolution and every pose.
   const waist=16+bob,hem=20-(f===11?1:0),detail=EV.detail;
   if(detail==='wizard'){
    R(7,13+bob,6,2,'trim');R(8,14+bob,5,1,'band');R(8,16+bob,1,4,'trim');
    if(back){R(9,16+bob,3,4,'hat');R(10,17+bob,1,2,'orb');}
    else{R(9,waist,2,1,'robeS');R(11,waist-1,1,3,'band');}
   }else if(detail==='samurai'){
    for(let j=0;j<3;j++){R(6,13+bob+j*2,8,1,'robeS');R(7,13+bob+j*2,6,1,'trim');}
    R(4,13+bob,3,3,'hat');R(4,13+bob,3,1,'hatL');
   }else if(detail==='archer'){
    for(let j=0;j<6;j++)R(5+(back?Math.floor(j/2):0),12+bob+j,2,1,'robeS');
    R(5,12+bob,1,4,'trim');R(4,11+bob,2,1,'#cfad76');R(5,10+bob,1,2,'#e4d6a1');
    if(back)R(6,15+bob,3,4,'robeS');
   }else if(detail==='shinobi'){
    R(6,waist,8,1,'band');R(7,waist+1,3,1,'band');R(9,hem,2,2,'o');
    R(5,hem,3,1,'hatL');R(12,hem,3,1,'hatL');
   }else if(detail==='onmyoji'){
    R(7,14+bob,2,6,'#f1e5d2');R(11,14+bob,2,6,'#f1e5d2');
    R(7,waist,6,1,'trim');R(9,18+bob,3,2,'robeS');R(10,18+bob,1,1,'#f1e5d2');
   }else if(detail==='gunner'){
    R(5,13+bob,4,2,'hat');R(5,13+bob,4,1,'hatL');
    for(let j=0;j<5;j++)R(7+j,13+bob+j,1,1,'#a86b44');
    R(6,waist+1,3,3,'#68412e');R(6,waist+1,3,1,'#db985d');R(12,hem-1,3,1,'hat');
   }else if(detail==='lancer'){
    R(5,13+bob,3,3,'hat');R(5,13+bob,2,1,'hatL');R(7,waist,6,1,'trim');
    R(9,18+bob,3,3,'band');R(9,18+bob,3,1,'hatL');
   }
   // staff
   const WP=EV.wpn||'staff';
   if(WP!=='staff'){ // weapons drawn as a line from the hand at a per-pose angle
    const hand=cz?[cz.hand[0]+lean,cz.hand[1]+bob]:f===6?[5,14]:f===7?[16,15]:up?[15,9]:f===11?[15,14]:[sx,16],ang=cz?cz.ang:f===6?-2.4:f===7?-.15:up?-1.57:f===11?0:-1.1,L=(x,y,len,a,c)=>{for(let i=0;i<len;i++)R(Math.round(x+Math.cos(a)*i),Math.round(y+Math.sin(a)*i),1,1,c);};
    const [hx0,hy0]=hand,fx=cz&&cz.fx;
    if(WP==='katana'||WP==='bokken'){
     if(fx==='slash'){for(let i=0;i<9;i++){const a=-1.9+i*.32;R(Math.round(9+Math.cos(a)*10),Math.round(14+Math.sin(a)*9),2,1,i>6?'#a0c8ff':'#ffffff');}} // the cut's crescent
     if(cz&&cz.arm==='hilt'){L(hx0,hy0,9,ang,'#3a2a2a');R(hx0,hy0,1,1,EV.C.trim||'#e0b040');} // still sheathed, hand on the hilt
     else{L(hx0,hy0,3,ang+Math.PI,'#3a2a2a');L(hx0,hy0,11,ang,WP==='bokken'?'#a07a48':'#e8eef6');R(hx0,hy0,1,1,EV.C.trim||'#e0b040');if(WP==='katana')L(hx0+Math.round(Math.cos(ang+1.57)),hy0+Math.round(Math.sin(ang+1.57)),9,ang,'#a8b0c0');}
     if(fx==='gleam'){R(hx0,hy0-11,1,1,'#ffffff');R(hx0-1,hy0-10,3,1,'#fff6c0');}}
    else if(WP==='bow'){const ba=f===7||fx==='loose'?0:-.2;for(let j=-6;j<=6;j++)R(Math.round(hx0+1+Math.cos(ba)*2*Math.cos(j/6*1.3)),hy0+j,1,1,'#7a4a22');
     if(fx==='pull'){L(hx0,hy0-6,7,2.4,'#e8e8f0');L(hx0,hy0+6,7,-2.4,'#e8e8f0');L(hx0-5,hy0,8,0,'#d8c8a0');R(hx0+3,hy0,1,1,'#e8eef6');R(hx0-6,hy0-1,1,3,'#c02030');} // string drawn back to the chest
     else{R(hx0,hy0-6,1,13,'#e8e8f0');if(fx==='loose'){L(hx0+3,hy0,4,0,'#d8c8a0');R(hx0+7,hy0,1,1,'#e8eef6');R(hx0-2,hy0-2,1,1,'#ffffff');R(hx0-2,hy0+2,1,1,'#ffffff');}
      else if(fx==='nock'){L(hx0-4,hy0+1,6,0,'#d8c8a0');}else if(f===7||f===6)L(hx0-5,hy0,7,0,'#d8c8a0');}}
    else if(WP==='spear'){L(hx0,hy0,6,ang+Math.PI,'#5a3a22');L(hx0,hy0,15,ang,'#7a5a3a');const tx=Math.round(hx0+Math.cos(ang)*15),ty=Math.round(hy0+Math.sin(ang)*15);L(tx,ty,4,ang,'#e8eef6');R(tx,ty,1,1,EV.C.trim||'#c02020');}
    else if(WP==='gun'){const ga=fx==='loose'||f===7?0:ang;L(hx0,hy0,4,ga+Math.PI,'#6a4a2a');L(hx0,hy0,11,ga,'#464858');L(hx0,hy0-1,9,ga,'#9eabae');L(hx0-2,hy0+1,6,ga,'#8c5035');L(hx0+Math.round(Math.cos(ga+1.57)),hy0+Math.round(Math.sin(ga+1.57)),5,ga,'#6a4a2a');if(fx==='loose'){const tx=Math.round(hx0+Math.cos(ga)*12),ty=Math.round(hy0+Math.sin(ga)*12);R(tx,ty-1,2,2,'#ffd060');R(tx+1,ty,1,1,'#fff');}else R(hx0+1,hy0-1,1,1,'#ff8030');}
    else if(WP==='kunai'){
     if(fx==='throw'){R(hx0+3,hy0-1,4,1,'#d0d8e0');R(hx0+6,hy0-1,1,1,'#ffffff');R(hx0+1,hy0-1,1,1,'#c02030');for(let i=0;i<3;i++)R(hx0-2-i*2,hy0+1+i,1,1,'#9aa');} // the kunai leaves the hand
     else if(fx==='smoke'){for(const [x,y] of [[3,18],[15,17],[5,11],[14,10],[9,8]])R(x,y,2,2,'#c8c8d0');}
     else{L(hx0,hy0,4,ang,'#d0d8e0');R(hx0,hy0,1,1,'#c02030');}
     if(!cz||cz.arm!=='seal')R(4,15+bob,2,1,'#d0d8e0');}
    else if(WP==='gohei'){L(hx0,hy0,9,ang,'#c8a060');const tx=Math.round(hx0+Math.cos(ang)*8),ty=Math.round(hy0+Math.sin(ang)*8);R(tx,ty,1,1,'#fff');R(tx-1,ty+1,2,1,'#fff');R(tx,ty+2,2,1,'#fff');R(tx-1,ty+3,2,1,'#fff');R(tx+1,ty+1,1,1,'#e03040');
     if(fx==='charm'){R(17,9,3,4,'#f8f4e8');R(18,10,1,2,'#d02030');R(16,10,1,1,'#f8f4e8');} // a paper charm flung forward
     if(fx==='float'){R(hx0-1,hy0-6,3,4,'#f8f4e8');R(hx0,hy0-5,1,2,'#d02030');R(hx0-2,hy0-7,1,1,'#c8a0ff');R(hx0+2,hy0-3,1,1,'#c8a0ff');}}}
   else if(horiz){R(3,15,15,1,'staff');R(3,14,1,1,'staffL');R(17,13,3,3,'orb');R(17,13,1,1,'orbL');}
   else{R(sx,sy+3,1,22-sy-3,'staff');R(sx,sy+3,1,2,'staffL');if(EV.orb){R(sx-1,sy,3,3,'orb');R(sx-1,sy,1,1,'orbL');}else{R(sx,sy+1,1,2,'orb');}if(EV.orb&&(f===7||up)){R(sx-2,sy+1,1,1,'orbL');R(sx+2,sy+1,1,1,'orbL');R(sx,sy-2,1,1,'orbL');}}
   // sleeves / hands
   const by=bob;
   if(cz){const A=cz.arm,hx1=cz.hand[0]+lean,hy1=cz.hand[1]+bob;
    if(A==='up2'){R(6+lean,9+by,3,5,'robe');R(12+lean,9+by,3,5,'robe');R(hx1-1,hy1,3,2,'skin');R(6+lean,13+by,3,1,'trim');R(12+lean,13+by,3,1,'trim');}
    else if(A==='up1'){R(6,14+by,2,5,'robeS');R(13,9+by,3,5,'robe');R(hx1,hy1,2,2,'skin');R(13,13+by,3,1,'trim');}
    else if(A==='fwd'){R(12+lean,14+by,5,3,'robe');R(hx1-1,hy1,2,2,'skin');R(12+lean,16+by,5,1,'trim');R(6,14+by,2,5,'robeS');}
    else if(A==='back'){R(5+lean,13+by,4,3,'robe');R(hx1,hy1,2,2,'skin');R(13,14+by,2,4,'robe');}
    else if(A==='low'){R(12+lean,15+by,4,4,'robe');R(hx1-1,hy1-1,2,2,'skin');R(6,14+by,2,5,'robeS');}
    else if(A==='draw'){R(12,14+by,5,2,'robe');R(hx1,hy1,1,2,'skin');R(10,14+by,2,2,'skin');R(8,14+by,3,3,'robe');}
    else if(A==='seal'){R(8,14+by,5,3,'robe');R(10,13+by,2,2,'skin');R(8,16+by,5,1,'trim');}
    else if(A==='hilt'){R(12,14+by,3,4,'robe');R(hx1-1,hy1,2,2,'skin');R(6,14+by,2,5,'robeS');}
    else{R(12,14+by,3,4,'robe');R(hx1-1,16+by,2,2,'skin');R(12,17+by,3,1,'trim');R(6,14+by,2,5,'robeS');}}
   else if(up){R(5,9+by,3,4,'robe');R(5,8+by,2,1,'skin');R(13,9+by,3,4,'robe');R(14,8+by,2,1,'skin');R(5,12+by,3,1,'trim');R(13,12+by,3,1,'trim');}
   else if(f===7){R(12,14+by,5,3,'robe');R(16,14+by,1,2,'skin');R(12,16+by,5,1,'trim');}
   else if(f===6){R(11,15+by,3,4,'robe');R(12,15+by,1,2,'skin');}
   else if(f===11){R(12,14,4,2,'robe');R(15,14,1,1,'skin');}
   else{R(12,14+by,3,4,'robe');R(sx-1,16+by,2,2,'skin');R(12,17+by,3,1,'trim');R(6,14+by,2,5,'robeS');}
   // head: face, eye and a long white beard
   const hy=bob+(f===11?1:0),hx=lean;
   if(back){ // back of the head: hair (white for the old masters), or the cloth of a hood/mask
    const hc=EV.hat==='hood'||EV.hat==='mask'?'hat':EV.beard?'beard':'#2a2228';R(8+hx,10+hy,5,4,hc);R(8+hx,13+hy,5,1,EV.hat==='hood'||EV.hat==='mask'?'hatL':'#3a3038');
    if(EV.beard===2){R(9+hx,14+hy,3,2,'beard');}}
   else{R(8+hx,10+hy,5,EV.beard?3:4,'skin');R(11+hx,11+hy,1,1,'o');if(!EV.beard)R(10+hx,13+hy,2,1,'#c08060');}
   if(!back&&EV.beard===1){R(8+hx,12+hy,5,2,'beard');R(9+hx,14+hy,3,1,'beard');R(8+hx,13+hy,1,1,'beardS');}
   if(!back&&EV.beard===2){R(8+hx,12+hy,5,2,'beard');R(9+hx,14+hy,4,2,'beard');R(10+hx,16+hy,2,1,'beard');R(8+hx,13+hy,1,1,'beardS');}
   // pointed hat with a bent tip, gold band and star
   const tx=f===11?-3:f===10?1:0;
   if(EV.hat==='hood'){R(7+hx,8+hy,7,2,'hat');R(6+hx,9+hy,2,6,'hat');R(13+hx,9+hy,1,4,'hat');R(5+hx-(tx<0?2:0),10+hy,2,3,'hat');R(8+hx,8+hy,3,1,'hatL');}
   else if(EV.hat==='pilgrim'){
    R(5+hx,9+hy,10,2,'hat');R(7+hx,7+hy,7,2,'hat');R(8+hx,5+hy,4,2,'hat');R(8+hx,5+hy,2,1,'hatL');
    R(7+hx,8+hy,5,1,'hatL');R(7+hx,10+hy,6,1,'band');
    R(5+hx,10+hy,2,4,'hat');if(!back)R(11+hx,11+hy,2,1,'o');
   }
   else if(EV.hat==='teppo'){
    R(4+hx,9+hy,13,2,'hat');R(6+hx,7+hy,9,2,'hat');R(8+hx,6+hy,4,1,'hatL');
    R(6+hx,8+hy,7,1,'hatL');R(5+hx,9+hy,10,1,'band');R(7+hx,11+hy,2,3,'hat');R(12+hx,12+hy,2,2,'hat');
   }
   else if(EV.hat==='kasa'){R(3+hx,9+hy,15,1,'hat');R(5+hx,8+hy,11,1,'hat');R(7+hx,7+hy,7,1,'hatL');R(9+hx,6+hy,3,1,'hatL');R(4+hx,9+hy,2,1,'hatL');}
   else if(EV.hat==='kabuto'){R(6+hx,7+hy,9,3,'hat');R(5+hx,9+hy,2,4,'hat');R(14+hx,9+hy,1,4,'hat');R(7+hx,6+hy,7,1,'hatL');R(7+hx,9+hy,7,1,'band');if(EV.crest){R(8+hx,3+hy,1,4,'band');R(12+hx,3+hy,1,4,'band');R(9+hx,5+hy,3,1,'band');}}
   else if(EV.hat==='mask'){R(7+hx,8+hy,7,3,'hat');R(6+hx,9+hy,2,6,'hat');R(13+hx,9+hy,1,5,'hat');R(8+hx,12+hy,5,2,'hat');R(8+hx,8+hy,4,1,'hatL');
    if(back){R(8+hx,11+hy,5,1,'hat');R(9+hx,11+hy,3,1,'band');}
    else{R(8+hx,11+hy,5,1,'skin');R(9+hx,11+hy,1,1,'o');R(11+hx,11+hy,1,1,'o');R(9+hx,12+hy,4,1,'band');}R(4+hx-(f===11?3:0),11+hy+(f===11?0:1),3,1,'band');R(3+hx-(f===11?4:0),12+hy+(f===11?0:1),2,1,'band');}
   else if(EV.hat==='eboshi'){R(8+hx,3+hy,5,7,'hat');R(9+hx,1+hy,4,2,'hat');R(8+hx,4+hy,1,5,'hatL');R(7+hx,9+hy,7,1,'band');}
   else if(EV.hat==='cap'){R(6+hx,9+hy,9,1,'hat');R(7+hx,8+hy,7,1,'band');R(7+hx,6+hy,7,2,'hat');R(8+hx,5+hy,5,1,'hat');R(10+hx+Math.round(tx/2),4+hy,3,1,'hatL');R(8+hx,6+hy,1,2,'hatL');}
   else{R(5+hx,9+hy,11,1,'hat');R(6+hx,8+hy,9,1,'hat');R(7+hx,7+hy,7,1,'band');
   R(7+hx,5+hy,6,2,'hat');R(8+hx,3+hy,4,2,'hat');R(9+hx+Math.round(tx/3),2+hy,3,1,'hat');R(10+hx+Math.round(tx/2),1+hy,2,1,'hat');R(12+hx+tx,0+hy,2,1,'hatL');
   R(8+hx,5+hy,1,2,'hatL');R(9+hx,3+hy,1,2,'hatL');if(stage>=9)R(11+hx,5+hy,1,1,'band');}
   if(EV.rosterDetail||EV.rosterFinal||star)drawRosterDetail(R,EV.rosterDetail,EV.rosterFinal||star,bob,back);
  });
  // 1px dark outline around everything
  const d=fr.getContext('2d').getImageData(0,0,FW,FH),o=mk(FW,FH,()=>{}),og=o.getContext('2d');og.fillStyle=C.o;
  for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){if(d.data[(y*FW+x)*4+3])continue;let n=false;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<FW&&Y<FH&&d.data[(Y*FW+X)*4+3]){n=true;break;}}if(n)og.fillRect(x,y,1,1);}
  sg.drawImage(o,f0*FW,0);sg.drawImage(fr,f0*FW,0);
 }
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:1,ok:true};
}
const WIZSPR=WIZEVO.map((_,i)=>buildWiz(i));
// power from everything you've picked up this run; the wizard evolves at each threshold
// one evolution after every boss
function evolve(){const st=Math.min(WIZEVO.length-1,(P.evo||0)+1);if(st===(P.evo||0))return;P.evo=st;P.evoT=1.2;P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.25);
 impact(P.x,P.y,'#ffe060',8,true);fxRing(P.x,P.y,40,'#ffe060',.6);fxRing(P.x,P.y,24,'#fff',.4);spark(P.x,P.y,'#fff',30,120);sfx('rare');txtFx(P.x,P.y-6,'EVOLVED: '+WIZEVO[st].n,'#ffe060',2);}
// ---- the travelling merchant: 26x32, 2 frames (breathing, lantern sway) ----
const MERCH=(()=>{const FW=28,FH=34,sheet=mk(FW*2,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<2;f++){const fr=mk(FW,FH,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};const b=f;
  // backpack frame stacked with goods
  R(2,6,8,22,'#6a4a2a');R(2,6,8,1,'#8a6a3a');R(3,8,6,5,'#c8a060');R(4,9,4,1,'#8a6a3a');R(3,14,3,4,'#3a6aa0');R(6,14,3,4,'#a03030');R(3,19,6,3,'#e8dcc0');R(4,20,4,1,'#a08060');R(2,23,8,1,'#5a3a1a');R(5,3,2,4,'#c8a060');R(4,2,4,1,'#e04030');
  // body: apron over a green kimono
  R(9,15+b,12,13,'#3e6a4a');R(9,15+b,2,13,'#2e5038');R(11,18+b,8,10,'#d8ccb0');R(11,18+b,8,1,'#b8a888');R(14,21+b,2,2,'#e0b040');
  R(10,28,4,4,'#2a2a30');R(16,28,4,4,'#2a2a30');R(9,31,5,2,'#14101a');R(16,31,5,2,'#14101a');
  // arms; one holds a lantern that sways
  R(20,17+b,3,6,'#3e6a4a');R(20,22+b,3,2,'#e0b080');const lx=22+(f?1:0);R(lx,24+b,1,2,'#3a3a3a');R(lx-2,26+b,5,5,'#c02818');R(lx-1,27+b,3,3,'#ffd060');R(lx-2,26+b,5,1,'#3a3a3a');R(lx-2,30+b,5,1,'#3a3a3a');
  R(8,17+b,2,6,'#3e6a4a');R(8,22+b,2,2,'#e0b080');
  // head: round face, moustache, little smile
  R(11,8+b,8,8,'#e0b080');R(12,11+b,1,1,'#14101a');R(17,11+b,1,1,'#14101a');R(12,13+b,6,1,'#5a3a22');R(11,13+b,1,2,'#5a3a22');R(18,13+b,1,2,'#5a3a22');R(14,14+b,2,1,'#c06050');R(10,11+b,1,2,'#e0b080');R(19,11+b,1,2,'#e0b080');
  // big straw hat
  for(let i=0;i<5;i++)R(15-2-i*2,4+i+b,5+i*4,1,i%2?'#c8a050':'#d8b860');R(5,9+b,20,1,'#a88438');R(13,3+b,4,1,'#e0c070');R(9,8+b,12,1,'#8a2a20');
 });sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:2,sc:1,ok:true};})();
// ---- loot bags: 0 burlap sack, 1 velvet pouch, 2 royal gold bag (bigger, jewelled) ----
const BAGSPR=(()=>{
 const PAL=[
  {w:12,h:13,b:'#a0763e',l:'#c8995a',d:'#6e4e26',t:'#e0c890',t2:'#8a6a3a'},
  {w:12,h:13,b:'#3e8a3a',l:'#6aba5a',d:'#24561e',t:'#a07a48',t2:'#5a3a1a'},
  {w:12,h:14,b:'#2e6ac8',l:'#6aa8f0',d:'#1a3e80',t:'#d8dce4',t2:'#8a92a0'},
  {w:12,h:14,b:'#7a34c0',l:'#a668ea',d:'#4a1c80',t:'#f0c848',t2:'#a07820'},
  {w:16,h:18,b:'#f0b828',l:'#fff0a0',d:'#b07810',t:'#d02838',t2:'#801020'},
  // new good bags: enchanter pouch (teal), scholar case (crimson), war chest (silver)
  {w:13,h:14,b:'#1a9a8a',l:'#5ad8c8',d:'#0e5a52',t:'#e0f0ff',t2:'#80a0b0'},
  {w:13,h:14,b:'#a82030',l:'#e05060',d:'#601018',t:'#f0e0b0',t2:'#c89a50'},
  {w:14,h:15,b:'#9aa4b4',l:'#e0e8f4',d:'#5a6474',t:'#ffd040',t2:'#a07820'},
  // more good bags: shogun trophy (boss, red-gold), jade casket (green), monk's bundle (saffron), assassin kit (violet)
  {w:15,h:16,b:'#a82020',l:'#e05040',d:'#601010',t:'#ffd040',t2:'#a07820'},
  {w:12,h:13,b:'#2e8a5a',l:'#6ad89a',d:'#185a38',t:'#e0f0e0',t2:'#80a090'},
  {w:12,h:13,b:'#d89030',l:'#f8c060',d:'#8a5a18',t:'#a02020',t2:'#601010'},
  {w:12,h:13,b:'#3a2a5a',l:'#6a4a9a',d:'#1a1030',t:'#c02040',t2:'#601020'}];
 const out=PAL.map((p,tier)=>{
  const W2=p.w+2,H2=p.h+2,fr=mk(W2,H2,g=>{
   const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,w,h);};
   const cx=p.w/2,top=4,bt=p.h-1,ry=(bt-top)/2,cy=top+ry,rx=p.w/2-.8;
   // body: an ellipse that sags wider toward the bottom, flat base
   for(let y=top;y<=bt;y++){const dy=(y+.5-cy)/ry,k=dy>0?dy*.55:dy,hw=Math.max(2,Math.round(rx*Math.sqrt(Math.max(0,1-k*k)))),x0=Math.round(cx-hw);
    R(x0,y,hw*2,1,p.b);R(x0,y,1,1,p.l);R(x0+hw*2-2,y,2,1,p.d);if(y===bt)R(x0,y,hw*2,1,p.d);}
   R(Math.round(cx-rx*.55),top+2,2,3,p.l);R(Math.round(cx-rx*.55)+2,top+2,1,1,p.l);
   // gathered neck, ruffled top and the tie
   R(cx-2,2,4,2,p.b);R(cx+1,2,1,2,p.d);R(cx-3,0,6,2,p.b);R(cx-3,0,1,1,p.l);R(cx-1,0,1,1,p.d);R(cx+1,0,1,1,p.d);R(cx+2,1,1,1,p.d);
   R(cx-3,3,6,1,p.t);R(cx-3,3,1,1,p.t2);R(cx+2,4,1,2,p.t);R(cx+3,5,1,1,p.t2);
   const dk=[0,0,1,1,2,1,1,2,2,1,0,1][tier];
   if(dk===0){ // stitched patch and coarse weave
    R(cx+1,bt-5,3,3,p.t2);R(cx+1,bt-5,1,1,p.l);R(cx+3,bt-3,1,1,p.l);
    for(let i=0;i<7;i++)R(Math.round(cx-3+((i*5)%7)),top+3+((i*3)%(bt-top-3)),1,1,p.d);}
   else if(dk===1){ // star clasp and stitching
    R(cx-1,cy,3,1,p.t);R(cx,cy-1,1,3,p.t);R(cx,cy,1,1,'#fff');
    for(let x=Math.round(cx-rx)+2;x<cx+rx-2;x+=2)R(x,bt-2,1,1,'#d0c8e8');}
   else{ // crimson cord with tassels, embroidered hem, ruby centre and side gems
    R(cx+3,4,1,4,p.t);R(cx+3,8,1,1,p.t2);R(cx-4,4,1,3,p.t);R(cx-4,7,1,1,p.t2);
    R(2,bt-3,p.w-4,1,p.t);R(2,bt-2,p.w-4,1,p.d);for(let x=3;x<p.w-3;x+=2)R(x,bt-3,1,1,p.l);
    R(cx-1,cy-2,2,1,p.t);R(cx-2,cy-1,4,2,p.t);R(cx-1,cy+1,2,1,p.t2);R(cx-1,cy-1,1,1,'#ffd0d8');R(cx+1,cy,1,1,p.t2);
    R(cx-3,cy-3,1,1,p.l);R(cx+2,cy-3,1,1,p.l);R(cx-4,cy,1,1,p.l);R(cx+3,cy,1,1,p.l);R(cx-3,cy+3,1,1,p.l);R(cx+2,cy+3,1,1,p.l);
    R(3,cy,2,2,'#3a8cf0');R(3,cy,1,1,'#bfe6ff');R(p.w-5,cy,2,2,'#30c060');R(p.w-5,cy,1,1,'#c0ffd0');}
  });
  const d=fr.getContext('2d').getImageData(0,0,W2,H2),c=mk(W2,H2,g=>{g.fillStyle='#14101a';
   for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){if(d.data[(y*W2+x)*4+3])continue;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<W2&&Y<H2&&d.data[(Y*W2+X)*4+3]){g.fillRect(x,y,1,1);break;}}}
   g.drawImage(fr,0,0);});
  return {c,wc:whiteOf(c),w:W2,h:H2};
 });
 // the royal (legendary) bag is hand-pixelled: clean gold sack, red drawstring, one red gem
 const ROW=['......LGGD......','.....LGGGGD.....','......DGGD......','.....RRRRRr.....','......DGGD.Rr...','.....LGGGGD.R...','....LGGGGGGD.r..','...LGGGGGGGGD...',
  '..LGGGGRGGGGGD..','..LGGGWRRGGGGD..','.LGGGRRRRrGGGGD.','.LGGGGRRrGGGGGD.','.LGGGGGrGGGGGGD.','.LGGGGGGGGGGGGD.','.LLGGGGGGGGGGDD.','..DGGGGGGGGGDD..','...DDDDDDDDDD...','................'];
 // white silk with golden-yellow cord and gem
 const RC={G:'#f4f0e6',L:'#ffffff',D:'#c8c0ae',R:'#ffd040',r:'#c8901c',W:'#fffbe0'};
 const fr=mk(18,20,g=>ROW.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=RC[row[x]];if(c){g.fillStyle=c;g.fillRect(x+1,y+1,1,1);}}})),oc=outlined(fr);
 out[4]={c:oc,wc:whiteOf(oc),w:18,h:20};
 return out;
})();
// ---- set dressing: code-drawn plants and props per environment, depth-sorted with everything else ----
function outlined(fr){const W2=fr.width,H2=fr.height,d=fr.getContext('2d').getImageData(0,0,W2,H2);return mk(W2,H2,g=>{g.fillStyle='#14101a';
 for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){if(d.data[(y*W2+x)*4+3])continue;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<W2&&Y<H2&&d.data[(Y*W2+X)*4+3]){g.fillRect(x,y,1,1);break;}}}g.drawImage(fr,0,0);});}
const DECOSPR={};
function defDeco(k,w,h,fn,o){const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R,w,h);});DECOSPR[k]=Object.assign({c:outlined(fr),w:w+2,h:h+2},o||{});}
(()=>{
 const blob=(R,cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const hw=Math.round(rx*Math.sqrt(1-(y/ry)**2));R(cx-hw,cy+y,hw*2+1,1,c);}};
 defDeco('bush',14,9,(R)=>{blob(R,7,5,6,4,'#2e6a2a');blob(R,6,4,4,3,'#3e8a36');R(3,3,2,1,'#5aaa4a');R(9,2,2,1,'#5aaa4a');R(4,6,1,1,'#f4d040');R(10,5,1,1,'#f06080');R(7,7,1,1,'#f4d040');},{big:0});
 defDeco('tallgrass',9,10,(R)=>{const c=['#3a7a2a','#4e9a3a','#2e5a22'];for(let i=0;i<5;i++){const x=1+i*2,h=5+((i*7)%5);R(x,10-h,1,h,c[i%3]);R(x+(i%2?1:-1),10-h-1,1,1,c[(i+1)%3]);}},{big:0});
 defDeco('bamboo',7,30,(R)=>{for(const [x,h,c] of [[1,30,'#5a9a3a'],[4,24,'#4a8a2e']]){R(x,30-h,2,h,c);R(x,30-h,1,h,'#7aba5a');for(let y=30-h+3;y<30;y+=6)R(x,y,2,1,'#2e5a1a');}R(0,4,3,1,'#6aaa4a');R(5,9,2,1,'#6aaa4a');R(3,2,2,1,'#6aaa4a');},{big:1});
 defDeco('lantern',9,16,(R)=>{R(1,14,7,2,'#6a6a72');R(3,8,3,6,'#7a7a84');R(0,6,9,2,'#5a5a64');R(2,3,5,3,'#7a7a84');R(3,4,3,2,'#ffd070');R(1,1,7,2,'#5a5a64');R(4,0,1,1,'#5a5a64');},{big:1,glow:{c:'#ffb040',y:-11,r:7}});
 defDeco('rock',10,6,(R)=>{blob(R,5,3,4,2,'#6a6a70');R(2,2,3,1,'#8a8a92');R(6,4,3,1,'#4a4a52');},{big:0});
 defDeco('pine',17,28,(R)=>{R(7,24,3,4,'#5a3a22');for(let t=0;t<3;t++){const y=4+t*7,hw=3+t*2;for(let j=0;j<8;j++){const w2=Math.round(hw*(j/7));R(8-w2,y+j,w2*2+1,1,'#1e4a32');}R(8-hw,y+7,hw*2+1,1,'#f0f6ff');R(8-Math.round(hw*.5),y+3,3,1,'#e0ecf8');}R(7,0,3,5,'#1e4a32');R(7,0,3,1,'#fff');},{big:1});
 defDeco('maple',21,26,(R)=>{R(9,16,3,10,'#5a3420');R(7,23,2,3,'#5a3420');R(12,22,2,4,'#4a2a18');blob(R,10,9,9,7,'#b02818');blob(R,7,7,5,4,'#d84020');blob(R,14,10,5,4,'#e86030');R(5,5,2,1,'#f8a050');R(13,6,2,1,'#f8a050');R(9,12,1,1,'#f8c060');},{big:1});
 defDeco('deadtree',16,26,(R)=>{R(7,6,3,20,'#4a3e34');R(7,6,1,20,'#6a5a4a');R(3,10,4,1,'#4a3e34');R(2,8,1,3,'#4a3e34');R(10,4,4,1,'#4a3e34');R(13,1,1,4,'#4a3e34');R(9,14,5,1,'#4a3e34');R(14,12,1,3,'#4a3e34');R(7,2,1,4,'#4a3e34');R(5,24,7,2,'#3a2e24');},{big:1});
 defDeco('reeds',11,15,(R)=>{for(let i=0;i<5;i++){const x=1+i*2,h=9+((i*5)%5);R(x,15-h,1,h,'#5a7a3a');if(i%2===0){R(x,15-h-3,1,3,'#6a3a1a');R(x,15-h-4,1,1,'#8a5a2a');}}R(0,13,3,1,'#4a6a2a');R(8,12,3,1,'#4a6a2a');},{big:0});
 defDeco('mushroom',13,14,(R)=>{R(5,7,3,7,'#e0d0b8');R(5,7,1,7,'#fff');blob(R,6,5,6,4,'#8a2ab0');R(1,6,11,1,'#5a1a7a');R(3,3,2,1,'#f0c0ff');R(8,2,2,2,'#f0c0ff');R(5,5,1,1,'#f0c0ff');},{big:0,glow:{c:'#c060ff',y:-8,r:6,dim:1}});
 defDeco('crystal',11,15,(R)=>{const sh=(x,h,w,c,l)=>{for(let j=0;j<h;j++){const ww=Math.max(1,Math.round(w*Math.min(1,(j+1)/3)));R(x-(ww>>1),15-h+j,ww,1,c);}R(x,15-h+1,1,h-2,l);};sh(5,14,3,'#6a3aa8','#d0a0ff');sh(2,8,2,'#4a2a88','#a080e0');sh(8,10,2,'#5a30a0','#c090ff');},{big:0,glow:{c:'#b070ff',y:-8,r:9}});
 defDeco('stalag',9,14,(R)=>{for(let j=0;j<14;j++){const w=Math.max(1,Math.round(j*.55));R(4-(w>>1),j,w,1,j%4===0?'#4a4048':'#5e5460');}R(3,4,1,6,'#7a7080');},{big:1});
 defDeco('pillar',11,22,(R)=>{R(0,19,11,3,'#5a5a64');R(1,4,9,15,'#7a7a86');R(1,4,2,15,'#9a9aa6');R(8,4,2,15,'#5e5e6a');R(1,3,3,1,'#7a7a86');R(5,2,2,2,'#7a7a86');R(8,4,2,1,'#14101a');R(4,8,1,6,'#5e5e6a');},{big:1});
 defDeco('column',11,32,(R)=>{R(0,29,11,3,'#c8d0dc');R(0,0,11,3,'#c8d0dc');R(1,3,9,26,'#e8eef6');for(let x=2;x<9;x+=2)R(x,4,1,24,'#b8c2d0');R(0,2,11,1,'#a0aab8');R(0,29,11,1,'#a0aab8');},{big:1});
 defDeco('urn',9,13,(R)=>{blob(R,4,9,4,3,'#c8d0dc');R(2,6,5,1,'#a0aab8');R(3,5,3,1,'#c8d0dc');blob(R,4,3,3,2,'#3e8a36');R(2,1,1,1,'#f06080');R(6,2,1,1,'#f4d040');},{big:0});
 defDeco('statue',11,22,(R)=>{R(1,18,9,4,'#a0aab8');R(2,9,7,9,'#c8d0dc');R(3,4,5,5,'#c8d0dc');R(2,2,2,3,'#c8d0dc');R(7,2,2,3,'#c8d0dc');R(4,6,1,1,'#5a6a80');R(6,6,1,1,'#5a6a80');R(8,10,3,3,'#c8d0dc');R(2,9,1,9,'#e8eef6');},{big:1});
 defDeco('barrel',8,10,(R)=>{R(0,1,8,9,'#8a5a2a');R(0,1,2,9,'#a8743a');R(0,3,8,1,'#4a4a52');R(0,7,8,1,'#4a4a52');R(1,0,6,1,'#6a4220');},{big:0});
 defDeco('crate',10,9,(R)=>{R(0,0,10,9,'#a07038');R(0,0,10,1,'#c8904a');R(0,0,1,9,'#6a4820');R(9,0,1,9,'#6a4820');R(0,8,10,1,'#6a4820');R(1,1,1,1,'#6a4820');R(2,2,1,1,'#6a4820');R(3,3,4,3,'#8a5e2e');R(7,6,1,1,'#6a4820');R(8,7,1,1,'#6a4820');},{big:0});
 defDeco('plantern',7,22,(R)=>{R(3,0,1,22,'#3a2a1a');R(1,1,5,1,'#3a2a1a');R(0,3,7,8,'#d02a20');R(0,3,7,1,'#1a1010');R(0,10,7,1,'#1a1010');R(1,5,1,4,'#f06040');R(3,4,1,6,'#a01a10');},{big:1,glow:{c:'#ff5030',y:-15,r:8}});
 defDeco('brazier',11,12,(R)=>{R(4,6,3,6,'#3a3a42');R(2,11,7,1,'#3a3a42');R(0,3,11,3,'#5a5a64');R(1,6,9,1,'#3a3a42');R(1,2,9,1,'#ff8a30');},{big:0,fire:{y:-11,s:3},glow:{c:'#ff8a30',y:-12,r:10}});
 defDeco('torch',5,15,(R)=>{R(2,4,1,11,'#5a3a22');R(1,3,3,2,'#3a3a42');},{big:0,fire:{y:-15,s:2},glow:{c:'#ffa040',y:-15,r:8}});
 defDeco('charred',16,24,(R)=>{R(7,6,3,18,'#2a2220');R(7,6,1,18,'#4a3a30');R(3,10,4,1,'#2a2220');R(2,8,1,3,'#2a2220');R(10,4,4,1,'#2a2220');R(13,1,1,4,'#2a2220');R(8,12,1,1,'#ff8a30');R(9,18,1,1,'#ff6020');R(3,9,1,1,'#ff6020');},{big:1});
 defDeco('vent',12,4,(R)=>{R(0,1,12,3,'#2a1a14');R(2,2,8,1,'#ff6020');R(4,1,3,1,'#ffb040');},{big:0,flat:1,smoke:'#ff8a30',glow:{c:'#ff5010',y:-2,r:7}});
 defDeco('bones',12,6,(R)=>{R(0,4,8,1,'#d8d0c0');R(0,3,1,3,'#d8d0c0');R(7,3,1,3,'#d8d0c0');R(5,0,5,4,'#e8e0d0');R(6,1,1,1,'#14101a');R(8,1,1,1,'#14101a');R(6,3,3,1,'#14101a');R(9,5,3,1,'#c8c0b0');},{big:0});
 defDeco('spikes',11,8,(R)=>{R(0,7,11,1,'#3a3a42');for(let i=0;i<4;i++){const x=1+i*3;R(x,1,1,6,'#8a8a96');R(x,0,1,1,'#e8e8f0');R(x,4,1,3,'#8a1020');}},{big:0});
 defDeco('banner',8,26,(R)=>{R(1,0,1,26,'#3a2a1a');R(0,1,8,1,'#3a2a1a');R(2,2,6,14,'#8a1020');R(2,2,6,1,'#e0b040');R(4,6,2,4,'#e0b040');R(2,16,2,2,'#8a1020');R(6,16,2,2,'#8a1020');},{big:1});
 defDeco('candles',9,8,(R)=>{R(0,4,2,4,'#a01020');R(3,2,2,6,'#c01828');R(6,5,2,3,'#a01020');R(0,7,9,1,'#5a0a14');},{big:0,flames:[[1,-9],[4,-11],[7,-8]],glow:{c:'#ff6040',y:-8,r:7}});
 defDeco('iceshard',9,13,(R)=>{const sh=(x,h,w)=>{for(let j=0;j<h;j++){const ww=Math.max(1,Math.round(w*Math.min(1,(j+1)/3)));R(x-(ww>>1),13-h+j,ww,1,'#a8d0f0');}R(x,13-h+1,1,h-2,'#ffffff');};sh(4,12,3);sh(1,6,2);sh(7,8,2);},{big:0,glow:{c:'#bfe6ff',y:-6,r:5,dim:1}});
 defDeco('lily',10,4,(R)=>{blob(R,5,2,4,1,'#3e8a36');R(4,1,2,1,'#f0a0c0');R(5,0,1,1,'#fff');},{big:0,flat:1});
 // ---- East Asian set pieces ----
 defDeco('sakura',21,26,(R)=>{R(9,16,3,10,'#4a2a20');R(9,16,1,10,'#6a4030');R(7,23,2,3,'#4a2a20');R(12,21,2,5,'#3a2018');R(6,14,3,1,'#4a2a20');R(12,13,4,1,'#4a2a20');
  blob(R,10,9,9,7,'#e888aa');blob(R,7,7,5,4,'#f8b0c8');blob(R,14,10,5,4,'#f4a0c0');blob(R,11,5,4,3,'#fcc8d8');
  for(const [x,y] of [[4,6],[8,3],[13,4],[16,8],[6,11],[11,12],[15,13],[3,10]])R(x,y,1,1,'#fde8f0');for(const [x,y] of [[5,12],[12,14],[17,11],[9,8]])R(x,y,1,1,'#c06088');},{big:1});
 defDeco('torii',24,26,(R)=>{for(const x of [4,17]){R(x,6,3,18,'#c02818');R(x,6,1,18,'#e85038');R(x-1,23,5,3,'#1a1414');}
  R(1,1,22,2,'#1a1414');R(0,0,2,2,'#1a1414');R(22,0,2,2,'#1a1414');R(2,3,20,1,'#c02818');R(2,8,20,2,'#c02818');R(2,8,20,1,'#e85038');R(11,3,2,5,'#1a1414');R(11,4,2,2,'#e0b040');},{big:1});
 defDeco('pagoda',19,36,(R)=>{R(2,33,15,3,'#5a5a62');R(2,33,15,1,'#7a7a82');R(9,0,1,7,'#e0b040');R(8,2,3,1,'#e0b040');R(8,4,3,1,'#e0b040');
  [[6,2],[13,3],[20,4],[27,5]].forEach(([y,hw])=>{const wl=Math.max(1,hw-1);R(9-wl,y+1,wl*2+1,6,'#a02418');R(9-wl,y+1,1,6,'#c84030');R(9,y+3,1,2,'#ffd070');
   R(9-hw-2,y,hw*2+5,2,'#2a3238');R(9-hw-1,y,hw*2+3,1,'#4a5a62');R(9-hw-3,y-1,1,1,'#2a3238');R(9+hw+3,y-1,1,1,'#2a3238');});},{big:1,glow:{c:'#ffc060',y:-14,r:6,dim:1}});
 defDeco('jizo',9,13,(R)=>{R(1,10,7,3,'#5a5a62');R(2,5,5,6,'#8a8a92');R(2,5,1,6,'#a2a2aa');R(3,1,3,4,'#9a9aa2');R(3,1,1,4,'#b4b4bc');R(2,5,5,3,'#c02818');R(3,8,3,1,'#c02818');R(2,5,5,1,'#e04030');R(3,3,1,1,'#5a5a62');R(5,3,1,1,'#5a5a62');R(4,11,1,1,'#3e8a36');},{big:0});
 defDeco('komainu',11,14,(R)=>{R(0,11,11,3,'#6a6a72');R(0,11,11,1,'#8a8a92');R(2,6,6,5,'#a8a8b0');R(2,6,1,5,'#c4c4cc');R(5,1,5,6,'#b8b8c0');R(4,1,2,6,'#7e7e86');R(4,2,1,4,'#6a6a72');R(7,3,1,1,'#2a2a32');R(8,5,2,1,'#2a2a32');R(1,4,2,2,'#7e7e86');R(0,3,1,1,'#7e7e86');R(9,6,1,1,'#3e8a5a');},{big:0});
 defDeco('rpillar',9,30,(R)=>{R(0,27,9,3,'#2a2a30');R(1,3,7,24,'#b02018');R(1,3,2,24,'#d84030');R(6,3,2,24,'#801410');R(1,6,7,1,'#e0b040');R(1,24,7,1,'#e0b040');R(0,0,9,3,'#2a2a30');R(0,2,9,1,'#e0b040');},{big:1});
 defDeco('taru',10,11,(R)=>{R(1,0,8,2,'#8a5a2a');R(0,2,10,9,'#c8b088');R(0,2,2,9,'#e0c8a0');R(8,2,2,9,'#a89068');R(0,3,10,1,'#6a4a2a');R(0,9,10,1,'#6a4a2a');R(3,5,4,3,'#c02818');R(4,6,2,1,'#fff');},{big:0});
 defDeco('ricebale',12,8,(R)=>{blob(R,6,4,5,3,'#c8b070');blob(R,5,3,3,2,'#e0c888');R(3,1,1,7,'#7a5a2a');R(8,1,1,7,'#7a5a2a');R(0,4,1,1,'#a89050');R(11,4,1,1,'#a89050');},{big:0});
 defDeco('taiko',12,12,(R)=>{R(2,9,1,3,'#3a2a1a');R(9,9,1,3,'#3a2a1a');R(1,11,10,1,'#3a2a1a');blob(R,6,5,5,5,'#8a3a1a');blob(R,6,5,4,4,'#e8d8b0');R(4,3,2,2,'#c02818');R(6,5,2,2,'#c02818');R(4,6,2,1,'#c02818');for(const [x,y] of [[1,5],[11,5],[6,0],[6,10]])R(x,y,1,1,'#e0b040');},{big:0});
 defDeco('incense',11,12,(R)=>{R(2,10,1,2,'#5a4020');R(8,10,1,2,'#5a4020');R(2,6,7,4,'#7a5a2a');R(2,6,2,4,'#9a7a3a');R(1,5,9,1,'#b08a40');R(3,3,5,2,'#a07a3a');R(5,1,1,2,'#a07a3a');R(4,2,1,1,'#ff8040');R(6,2,1,1,'#ff8040');},{big:0,smoke:'#c8c0d8',glow:{c:'#ff9040',y:-9,r:4,dim:1}});
 defDeco('bell',13,24,(R)=>{R(0,2,2,22,'#5a3a20');R(11,2,2,22,'#5a3a20');R(0,2,1,22,'#7a5a30');R(0,0,13,2,'#2a2a30');R(0,0,13,1,'#4a4a52');R(6,2,1,2,'#3a3a42');
  R(4,4,5,2,'#4a7a5a');R(3,6,7,8,'#3e6a4e');R(3,6,2,8,'#6a9a7a');R(2,14,9,1,'#2e5a3e');R(5,9,3,2,'#2e5a3e');},{big:1});
 defDeco('bonsai',13,14,(R)=>{R(3,11,7,3,'#2e3a5a');R(3,11,7,1,'#4a5a7a');R(6,6,1,5,'#5a3a22');R(4,7,2,1,'#5a3a22');R(7,5,2,1,'#5a3a22');blob(R,3,5,3,2,'#2e6a32');blob(R,9,4,3,2,'#2e6a32');blob(R,6,2,3,2,'#3e8a3e');R(5,1,2,1,'#5aaa4a');R(8,3,2,1,'#5aaa4a');},{big:0});
 // ---- special-room set pieces ----
 defDeco('stall',28,26,(R)=>{R(0,2,28,3,'#2a3038');R(1,1,26,1,'#4a5260');R(0,5,28,1,'#14101a');R(2,6,2,20,'#5a3a20');R(24,6,2,20,'#5a3a20');
  for(let i=0;i<3;i++){R(5+i*6,6,5,8,'#2a3a7a');R(5+i*6,6,5,1,'#1a2450');R(7+i*6,9,1,2,'#fff');}
  R(3,18,22,3,'#8a5a2a');R(3,18,22,1,'#a87a40');R(3,21,22,5,'#6a4220');R(5,16,3,2,'#c02818');R(10,15,4,3,'#e0c890');R(17,16,2,2,'#3e8a3e');R(21,16,2,2,'#e0b040');
  R(0,6,2,3,'#d02a20');R(26,6,2,3,'#d02a20');},{big:1,glow:{c:'#ffb040',y:-18,r:10,dim:1}});
 defDeco('shishi',14,12,(R)=>{R(1,8,12,4,'#6a6a72');R(2,8,10,1,'#8a8a92');R(3,9,8,2,'#2e6a8a');R(4,9,3,1,'#9ad0f0');R(9,2,2,7,'#5a9a3a');R(9,2,1,7,'#7aba5a');R(5,3,5,2,'#5a9a3a');R(5,3,5,1,'#7aba5a');R(6,5,1,3,'#9ad0f0');},{big:0});
 defDeco('coins',10,6,(R)=>{blob(R,5,4,4,2,'#c8a040');blob(R,4,3,2,1,'#e0c050');R(3,2,2,1,'#fff0a0');R(6,4,1,1,'#fff0a0');R(8,4,1,1,'#a07820');},{big:0,glow:{c:'#ffd040',y:-3,r:5,dim:1}});
 defDeco('skullpile',12,8,(R)=>{R(1,5,10,3,'#c8c0b0');R(2,2,4,4,'#e8e0d0');R(6,1,4,4,'#e8e0d0');R(3,3,1,1,'#14101a');R(5,3,1,1,'#14101a');R(7,2,1,1,'#14101a');R(9,2,1,1,'#14101a');R(4,5,1,1,'#14101a');R(8,4,1,1,'#14101a');},{big:0});
 defDeco('blacktorii',24,26,(R)=>{for(const x of [4,17]){R(x,6,3,18,'#2a1a1e');R(x,6,1,18,'#4a2a30');R(x-1,23,5,3,'#14101a');}
  R(1,1,22,2,'#14101a');R(0,0,2,2,'#14101a');R(22,0,2,2,'#14101a');R(2,3,20,1,'#6a0a14');R(2,8,20,2,'#2a1a1e');R(2,8,20,1,'#6a0a14');R(11,3,2,5,'#14101a');R(11,4,2,2,'#f33');},{big:1,glow:{c:'#f33',y:-20,r:6,dim:1}});
 defDeco('koi',10,5,(R)=>{R(1,2,6,2,'#f07020');R(2,1,4,1,'#f07020');R(3,2,2,1,'#ffffff');R(5,1,1,1,'#ffffff');R(7,2,1,1,'#f07020');R(8,1,2,1,'#f8a040');R(8,4,2,1,'#f8a040');R(1,2,1,1,'#14101a');},{big:0,flat:1,swim:1});
})();
const ENVDECO={grass:[['bush',3],['tallgrass',4],['bamboo',4],['lantern',2],['sakura',2],['jizo',1],['rock',1]],stone:[['pillar',2],['torch',2],['bones',2],['rock',2],['jizo',1]],
 planks:[['taru',3],['ricebale',3],['plantern',2],['banner',1],['bonsai',1],['taiko',1]],ember:[['brazier',2],['charred',3],['vent',3],['rock',1],['plantern',1]],
 swamp:[['reeds',5],['deadtree',2],['mushroom',1],['tallgrass',2],['jizo',1],['lantern',1]],
 temple:[['maple',3],['lantern',3],['incense',2],['jizo',2],['bell',1],['pagoda',1],['candles',1]],snow:[['pine',4],['iceshard',2],['rock',2],['lantern',1],['torii',1],['jizo',1]],
 marble:[['rpillar',3],['sakura',2],['bonsai',2],['komainu',1],['plantern',1],['urn',1]],
 cave:[['crystal',4],['mushroom',3],['stalag',3],['jizo',1]],blood:[['bones',3],['spikes',2],['banner',2],['candles',2],['rpillar',1],['torii',1]]};
let decos=[],ambient=[];
function genDecos(di){const env=map.env,L=ENVDECO[env.k]||[],tot=L.reduce((a,b)=>a+b[1],0),out=[];if(!L.length)return out;
 // special rooms use their own prop sets instead of the dungeon's
 const SPECDECO={rest:[['lantern',3],['bamboo',3],['bush',2],['shishi',1]],shop:[['taru',3],['ricebale',2],['plantern',2],['banner',1]],
  shrine:[['incense',2],['jizo',3],['candles',2],['lantern',1]],altar:[['bones',3],['candles',3],['skullpile',2],['deadtree',1]],treasure:[['coins',4],['urn',1],['plantern',1]]};
 const pickD=(big,LL)=>{LL=LL||L;const tt=LL.reduce((a,b)=>a+b[1],0);for(let t=0;t<8;t++){let r=Math.random()*tt;for(const [k,w] of LL){if((r-=w)<0){if(big==null||!!DECOSPR[k].big===big)return k;break;}}}return LL[0][0];};
 const wallN=(x,y)=>!map.t[y*MW+x+1]||!map.t[y*MW+x-1]||!map.t[(y+1)*MW+x]||!map.t[(y-1)*MW+x];
 for(const r of map.rooms){const n=Math.round(r.w*r.h/(r.k==='boss'?40:16)),cx=r.x+(r.w>>1),cy=r.y+(r.h>>1),LL=SPECDECO[r.type];
  for(let i=0,tr=0;i<n&&tr<n*6;tr++){const x=ri(r.x+1,r.x+r.w-2),y=ri(r.y+1,r.y+r.h-2),j=y*MW+x;if(!map.t[j]||map.liq[j])continue;if(Math.abs(x-cx)<(LL?7:3)&&Math.abs(y-cy)<(LL?7:3))continue;
   const edge=wallN(x,y);if(r.k==='boss'&&!edge)continue;const k=pickD(edge?null:false,LL),wx=x*T+rnd(3,13),wy=y*T+rnd(3,13);
   if(props.some(p=>Math.hypot(p.x-wx,p.y-wy)<24)||out.some(o=>Math.hypot(o.x-wx,o.y-wy)<10))continue;out.push({k,x:wx,y:wy,f:Math.random()<.5,ph:Math.random()*6});i++;}}
 // fixed set pieces that give each special room its identity
 for(const r of map.rooms){if(!SPECDECO[r.type])continue;const c=roomCenter(r),put=(k,dx,dy,f)=>{const x=c.x+dx,y=c.y+dy;if(!solid(x,y))out.push({k,x,y,f:!!f,ph:Math.random()*6});};
  if(r.type==='shop')put('stall',0,-40);
  else if(r.type==='shrine'){put('torii',0,-46);put('jizo',-30,-12);put('jizo',30,-12,1);put('incense',-16,22);put('incense',16,22);}
  else if(r.type==='altar'){put('blacktorii',0,-46);put('skullpile',-24,16);put('skullpile',24,16,1);put('candles',-34,-8);put('candles',34,-8);}
  else if(r.type==='treasure'){put('komainu',-32,-4);put('komainu',32,-4,1);put('coins',-16,18);put('coins',16,18);put('coins',0,-22);}
  else if(r.type==='rest'){for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;put('lantern',Math.cos(a)*108,Math.sin(a)*108);}put('shishi',44,-34);}}
 // hallways: lanterns/torches along the walls so the passages between arenas read as places too
 {const HL={grass:'lantern',stone:'torch',planks:'plantern',ember:'brazier',swamp:'lantern',temple:'lantern',snow:'lantern',marble:'plantern',cave:'crystal',blood:'candles'}[env.k]||'torch';
  const inRoom=(x,y)=>map.rooms.some(r=>x>=r.x-1&&x<r.x+r.w+1&&y>=r.y-1&&y<r.y+r.h+1);
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){const j=y*MW+x;if(!map.t[j]||map.liq[j]||!wallN(x,y)||inRoom(x,y)||hash(x*7,y*3)>.08)continue;
   const wx=x*T+8,wy=y*T+8;if(out.some(o=>Math.hypot(o.x-wx,o.y-wy)<40))continue;out.push({k:HL,x:wx,y:wy,f:hash(x,y)<.5,ph:Math.random()*6});}}
 // themed boss arena: a ring of the environment's signature props around the fight
 {const AR={grass:['bamboo','sakura'],stone:['pillar','torch'],planks:['banner','plantern'],ember:['brazier','charred'],swamp:['deadtree','lantern'],temple:['maple','lantern'],snow:['pine','lantern'],marble:['rpillar','komainu'],cave:['crystal','stalag'],blood:['rpillar','candles']}[env.k];
  const br=map.bossRoom;if(AR&&br&&!map.train){const cx=(br.x+br.w/2)*T,cy=(br.y+br.h/2)*T,rr=br.w*T*.44;for(let i=0;i<16;i++){const a=i/16*TAU,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;if(solid(x,y)||map.liq[((y/T)|0)*MW+((x/T)|0)])continue;out.push({k:AR[i%2],x,y,f:Math.cos(a)<0,ph:Math.random()*6});}}}
 if(env.k==='swamp'||env.k==='grass')for(const i of map.liqList)if(Math.random()<.08){const x=i%MW,y=(i/MW)|0;out.push({k:'lily',x:x*T+8,y:y*T+8,f:false,ph:Math.random()*6,onliq:1});}
 // koi drifting in the garden ponds
 if(env.k==='grass'||env.k==='temple'||env.k==='marble')for(const i of map.liqList)if(Math.random()<.06){const x=i%MW,y=(i/MW)|0;out.push({k:'koi',x:x*T+8,y:y*T+8,f:Math.random()<.5,ph:Math.random()*6,onliq:1});}
 return out;}
function drawDeco(o){const s=DECOSPR[o.k],X=sx(o.x,o.y),Y=sy(o.x,o.y);if(X<-30||X>W+30||Y<-10||Y>H+40)return;
 if(o.onliq){const sw=s.swim?Math.round(Math.sin(time*.5+o.ph)*6):0;
  if(s.swim&&(Math.cos(time*.5+o.ph)<0)!==o.f){ctx.save();ctx.translate(X+sw,0);ctx.scale(-1,1);ctx.drawImage(s.c,Math.round(-s.w/2),Math.round(Y-s.h/2));ctx.restore();return;}
  ctx.drawImage(s.c,Math.round(X-s.w/2+sw),Math.round(Y-s.h/2+(s.swim?0:Math.sin(time*1.5+o.ph))));return;}
 if(!s.flat){ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(X-Math.round(s.w/3),Y-1,Math.round(s.w/1.5),2);}
 const sway=s.big&&(o.k==='bamboo'||o.k==='maple'||o.k==='reeds')?0:0;
 if(o.f){ctx.save();ctx.translate(X,0);ctx.scale(-1,1);ctx.drawImage(s.c,Math.round(-s.w/2),Math.round(Y-s.h+1+(s.flat?s.h/2:0)));ctx.restore();}else ctx.drawImage(s.c,Math.round(X-s.w/2+sway),Math.round(Y-s.h+1+(s.flat?s.h/2:0)));
 if(s.glow){const p=s.glow.dim?.15:.22;ctx.globalAlpha=p+.08*Math.sin(time*3+o.ph);disc(X,Y+s.glow.y,s.glow.r,s.glow.c);ctx.globalAlpha=1;}
 const fl=(fx,fy,sz)=>{const f=Math.floor(time*10+o.ph)%3;ctx.fillStyle='#ff6020';ctx.fillRect(fx-sz+1,fy-sz-f%2,sz*2-1,sz+1);ctx.fillStyle='#ffd040';ctx.fillRect(fx-sz+2,fy-sz+1-f%2,Math.max(1,sz*2-3),sz-1);ctx.fillStyle='#fff';ctx.fillRect(fx,fy-1,1,1);};
 if(s.fire)fl(X,Y+s.fire.y,s.fire.s);if(s.flames)for(const [fx,fy] of s.flames)fl(X-s.w/2+fx+1,Y+fy,1);
 if(s.smoke&&Math.random()<.08)particles.push({x:o.x+rnd(-3,3),y:o.y+rnd(-3,3),vx:rnd(-4,4),vy:rnd(-4,4),t:.6,col:s.smoke});}
// ambient weather/life particles per environment
const AMB={grass:{k:'leaf',n:16,c:'#f8b8d0',c2:'#fde0ea'},swamp:{k:'fly',n:22,c:'#b0ff70'},ember:{k:'rise',n:30,c:'#ff8a30'},snow:{k:'fall',n:60,c:'#ffffff'},temple:{k:'leaf',n:18,c:'#e05a20'},
 cave:{k:'rise',n:20,c:'#c080ff'},blood:{k:'fall',n:30,c:'#6a5a5a'},stone:{k:'mote',n:14,c:'#a0a0b0'},planks:{k:'mote',n:14,c:'#d8c090'},marble:{k:'leaf',n:20,c:'#f8b8d0',c2:'#fde0ea'}};
function updAmbient(dt){const A=AMB[map.env.k];if(!A)return;while(ambient.length<A.n)ambient.push({x:P.x+rnd(-180,180),y:P.y+rnd(-180,180),h:A.k==='fall'||A.k==='leaf'?rnd(0,90):rnd(0,30),t:rnd(2,6),ph:Math.random()*6});
 for(const a of ambient){a.t-=dt;if(A.k==='fly'){a.x+=Math.sin(time*.9+a.ph)*10*dt;a.y+=Math.cos(time*.7+a.ph*1.3)*10*dt;a.h=8+Math.sin(time*1.3+a.ph)*5;}
  else if(A.k==='rise'){a.h+=14*dt;a.x+=Math.sin(time*2+a.ph)*6*dt;}else if(A.k==='fall'){a.h-=18*dt;a.x+=Math.sin(time+a.ph)*8*dt;}else if(A.k==='leaf'){a.h-=12*dt;a.x+=Math.sin(time*2+a.ph)*16*dt;}else{a.h+=Math.sin(time+a.ph)*2*dt;a.x+=3*dt;}
  if(a.h<0||a.h>110||Math.hypot(a.x-P.x,a.y-P.y)>230)a.t=0;}
 ambient=ambient.filter(a=>a.t>0);}
function drawAmbient(){const A=AMB[map.env.k];if(!A)return;for(const a of ambient){const X=sx(a.x,a.y),Y=sy(a.x,a.y)-a.h|0;if(X<0||X>W||Y<0||Y>H)continue;ctx.globalAlpha=Math.min(1,a.t);
  if(A.k==='fly'){const on=Math.sin(time*3+a.ph*2)>.2;if(on){ctx.globalAlpha=.25;disc(X,Y,2,A.c);ctx.globalAlpha=1;ctx.fillStyle=A.c;ctx.fillRect(X,Y,1,1);}}
  else if(A.k==='leaf'){ctx.fillStyle=Math.floor(a.ph*3)%2?A.c:(A.c2||'#f0a040');ctx.fillRect(X,Y,2,1);ctx.fillRect(X+(Math.sin(time*4+a.ph)>0?1:0),Y+1,1,1);}
  else{ctx.fillStyle=A.c;ctx.fillRect(X,Y,1,A.k==='fall'&&map.env.k==='snow'?1:1);}ctx.globalAlpha=1;}}
// PNG overrides from assets/ only for foes without a hand-designed code sprite (the old placeholder PNGs are superseded)
const CODEFOES=['ashigaru','archer','samurai','ninja','monk','shielder','shaman','sniper','assassin','bandit','bomber','jailer','imp','frog','priest','wraith','shroom','blood','guardian','brute'];
const ovIf=(t,f,w,h)=>{if(!CODEFOES.includes(t))loadOverride(t,f,w,h);};
['ashigaru','archer','samurai','ninja','monk'].forEach(t=>ovIf(t,'e_'+t+'.png',32,32));
ovIf('brute','e_brute.png',48,48);
// boss PNG overrides retired: bosses use the code-drawn sheets in bossSheet()
