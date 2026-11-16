'use strict';
// HELL OF THE EMPEROR - boss sprites (part of the former game.js; files load in numeric order, see index.html)
// ---------- boss sprites: code-drawn 40x50 figures, frames 0-1 idle (breathing), 2 attack ----------
// each boss is dressed in its dungeon's colours (grass, stone, castle wood, embers, swamp, autumn temple, snow, marble, crystal cave, blood)
const BLOOK=[
 {bw:7,skin:'#e0b080',ar:'#4a6a2a',ad:'#2a3a1a',ac:'#c8a040',lg:'#2a2a18',head:'kabuto',wpn:'spear',back:'banner',bn:'#3e7a2a'},
 {bw:11,skin:'#6a4a30',ar:'#5a3a24',ad:'#3a2416',ac:'#a07a50',lg:'#4a3020',head:'bald',wpn:'club',back:'chains',big:1},
 {bw:7,skin:'#e0b080',ar:'#7a3a20',ad:'#4a2010',ac:'#e0c070',lg:'#2a1a10',head:'hair',wpn:'bow',back:'cape',cape:'#4a2414'},
 {bw:6,skin:'#e8d8f0',ar:'#5a3a7a',ad:'#2a1840',ac:'#e0d0ff',lg:'#2a1830',head:'bun',wpn:'daggers',back:'wings',w1:'#c8b0e0',w2:'#f0e0ff'},
 {bw:11,skin:'#f0e8d8',ar:'#e88030',ad:'#2a1a10',ac:'#ffffff',lg:'#c86020',head:'ape',wpn:'fists',back:null,big:1,fur:'#f0a040'},
 {bw:7,skin:'#d8d0c0',ar:'#e8d8b0',ad:'#b8a070',ac:'#c03020',lg:'#c8bca0',head:'veil',wpn:'naginata',back:'cape',cape:'#c04020'},
 {bw:9,skin:'#a8c8a0',ar:'#3e6a5a',ad:'#24403a',ac:'#d0e8c0',lg:'#2a4a3a',head:'helm',wpn:'greatsword',back:'cape',cape:'#1a3a2e'},
 {bw:7,skin:'#a0c080',ar:'#2e7a4a',ad:'#184a2a',ac:'#d0e060',lg:'#1e4a2e',head:'owl',wpn:'blades',back:'feathers',f1:'#3e9a5a',f2:'#1e5a3a'},
 {bw:11,skin:'#2a1040',ar:'#3a1a5a',ad:'#1a0830',ac:'#d080ff',lg:'#20103a',head:'demon',wpn:'claws',back:'flames',big:1,fl1:'#c060ff',fl2:'#ff80e0'},
 {bw:7,skin:'#e0b890',ar:'#3a0a14',ad:'#1a0408',ac:'#e04050',lg:'#1e0a10',head:'long',wpn:'katana',back:'spear'}];function bossSheet(i){{const art=BOSS[i]&&bossArt(BOSS[i].name);if(art)return art;}const o=BLOOK[i],FW=44,FH=52,N=3,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const fr=mk(FW,FH,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
  const cx=22,bw=o.bw,br=f===1?1:0,big=o.big,ty=(big?20:18)+br,atk=f===2,ar=o.ar,ad=o.ad,ac=o.ac;
  // back pieces
  if(o.back==='banner'){R(cx-bw-2,2,1,ty+12,'#3a2a1a');R(cx-bw-8,3,6,12,o.bn||'#c02820');R(cx-bw-7,6,4,3,'#e0b040');}
  if(o.back==='wings'){g.globalAlpha=.75;for(const s of [-1,1]){for(let j=0;j<12;j++){const w=Math.round(10*Math.sin(j/11*Math.PI));R(s<0?cx-6-w:cx+6,ty-4+j,w,1,j%3?(o.w1||'#c060e0'):(o.w2||'#f0a0e0'));}}g.globalAlpha=1;}
  if(o.back==='feathers'){for(let j=0;j<20;j++){const w=bw+3+(j>>2);R(cx-w,ty+j,w*2,1,j%4===0?(o.f1||'#6a7a6a'):(o.f2||'#3e4a3e'));}}
  if(o.back==='flames'){const fl=f*2;for(let k=0;k<7;k++){const h=8+((k*5+fl)%7);R(cx-12+k*4,ty-h+2,3,h,k%2?(o.fl1||'#ff6020'):(o.fl2||'#ffb030'));}}
  if(o.back==='spear'){for(let j=0;j<40;j++)R(cx+bw-2-j*.4,2+j,1,1,'#5a3a22');R(cx+bw-3,1,2,4,'#c8c8d0');}
  if(o.back==='cape'){for(let j=0;j<22;j++)R(cx-bw-1-(j>>3),ty+2+j,bw*2+2+(j>>2),1,o.cape);}
  if(o.back==='chains'){for(let j=0;j<6;j++){R(cx-bw-4+j,ty+14+j*2,2,1,'#8a8a96');R(cx+bw+2-j,ty+14+j*2,2,1,'#8a8a96');}}
  // legs and skirt
  const ly=ty+(big?16:14);R(cx-bw+1,ly+6,bw-1,FH-ly-8,o.lg);R(cx+1,ly+6,bw-1,FH-ly-8,o.lg);R(cx-bw,FH-3,bw,3,'#1a1418');R(cx+1,FH-3,bw,3,'#1a1418');
  for(let j=0;j<8;j++){const w=bw+1+(j>>1);R(cx-w,ly+j,w*2,1,j%3===2?ad:ar);}R(cx-1,ly,2,8,ad);
  // torso and belt
  R(cx-bw,ty,bw*2,ly-ty,ar);R(cx-bw,ty,2,ly-ty,shade(ar,.2));R(cx+bw-2,ty,2,ly-ty,ad);R(cx-bw,ly-2,bw*2,2,ac);
  if(!big){R(cx-2,ty+2,4,ly-ty-5,ad);R(cx-1,ty+3,2,2,ac);}else{R(cx-bw+2,ty+3,bw*2-4,3,shade(ar,.12));R(cx-bw+3,ty+8,bw*2-6,2,ad);}
  // shoulders
  R(cx-bw-3,ty-1,5,5,ac);R(cx+bw-2,ty-1,5,5,ac);R(cx-bw-3,ty+3,5,1,ad);R(cx+bw-2,ty+3,5,1,ad);
  // arms: left hangs, right holds weapon
  R(cx-bw-3,ty+4,3,10,big?o.skin:ar);R(cx-bw-3,ty+13,3,3,o.skin);
  const hx=atk?cx+bw+5:cx+bw+1,hy=atk?ty+4:ty+12;R(cx+bw,ty+4,3,atk?4:9,big?o.skin:ar);R(hx,hy,3,3,o.skin);if(atk)R(cx+bw+2,ty+4,4,3,big?o.skin:ar);
  // weapon
  const W=o.wpn;
  if(W==='spear'||W==='naginata'){if(atk){for(let j=0;j<22;j++)R(hx-6+j,hy+2-j*.35,1,1,'#5a3a22');R(hx+15,hy-7,6,2,'#d8dce4');if(W==='naginata')R(hx+18,hy-9,3,2,'#d8dce4');}else{R(hx+1,4,1,FH-8,'#5a3a22');R(hx,0,3,5,'#d8dce4');if(W==='naginata')R(hx+2,0,2,3,'#fff');}}
  else if(W==='club'){if(atk){for(let j=0;j<14;j++)R(hx+j,hy-j*.5,3,3,'#6a4a2a');R(hx+12,hy-9,5,5,'#4a3220');}else{R(hx,hy-14,4,16,'#6a4a2a');R(hx-1,hy-17,6,5,'#4a3220');}}
  else if(W==='bow'){const bx=atk?hx+3:hx+1;for(let j=-11;j<=11;j++)R(bx+Math.round(3*Math.cos(j/11*1.4)),hy+j,1,1,'#5a3a22');R(bx,hy-11,1,22,'#e8e8f0');if(atk)R(hx-6,hy,9,1,'#c8c8d0');}
  else if(W==='daggers'||W==='blades'){if(atk){R(hx+3,hy-1,8,1,'#e8eef6');R(cx-bw-6,ty+12,6,1,'#e8eef6');}else{R(hx+1,hy-6,1,6,'#e8eef6');R(cx-bw-2,ty+16,1,6,'#e8eef6');}}
  else if(W==='fists'){R(hx-1,hy-1,5,5,o.skin);if(atk)R(hx+3,hy,2,3,shade(o.skin,.3));}
  else if(W==='greatsword'){if(atk){for(let j=0;j<20;j++)R(hx+j,hy-j*.25,2,3,'#c8d0d8');R(hx-2,hy-1,2,5,'#3a3a42');}else{R(hx+1,hy-24,3,24,'#c8d0d8');R(hx+2,hy-24,1,24,'#fff');R(hx-1,hy,7,2,'#3a3a42');}}
  else if(W==='claws'){for(let k=0;k<3;k++)R(hx+3+(atk?3:0),hy-1+k*2,atk?5:3,1,'#ffb030');}
  else if(W==='katana'){if(atk){for(let j=0;j<18;j++)R(hx+j,hy+1-j*.6,1,1,j<3?'#3a3a42':'#f0f4ff');}else{for(let j=0;j<16;j++)R(hx+1+j*.15,hy-15+j,1,1,'#f0f4ff');R(hx,hy,3,2,'#3a3a42');}}
  // head
  const hx0=cx-4,hy0=ty-(big?8:10);
  if(o.head==='ape'){R(cx-6,hy0-1,12,10,o.fur||'#d8c8b0');R(cx-4,hy0+2,8,6,o.skin);R(cx-3,hy0+3,2,1,'#ffd040');R(cx+1,hy0+3,2,1,'#ffd040');R(cx-2,hy0+6,4,1,'#2a1a14');}
  else if(o.head==='demon'){R(cx-5,hy0,10,9,o.skin);R(cx-3,hy0+3,2,2,'#ff6020');R(cx+1,hy0+3,2,2,'#ff6020');R(cx-7,hy0-4,2,6,'#d8d0c0');R(cx+5,hy0-4,2,6,'#d8d0c0');R(cx-8,hy0-6,2,3,'#d8d0c0');R(cx+6,hy0-6,2,3,'#d8d0c0');R(cx-2,hy0+7,4,1,'#ffb030');}
  else{R(hx0,hy0+2,8,8,o.skin);R(hx0+2,hy0+5,1,1,'#14101a');R(hx0+5,hy0+5,1,1,'#14101a');
   if(o.head==='kabuto'){R(hx0-2,hy0,12,4,ad);R(hx0-1,hy0+1,10,1,ar);R(hx0+1,hy0-4,1,4,ac);R(hx0+6,hy0-4,1,4,ac);R(hx0,hy0-5,2,1,ac);R(hx0+6,hy0-5,2,1,ac);R(hx0+2,hy0+8,4,2,'#2a1a14');}
   else if(o.head==='bald'){R(hx0,hy0+1,8,3,o.skin);R(hx0+1,hy0+8,6,2,'#3a3a40');}
   else if(o.head==='hair'){R(hx0-1,hy0,10,4,'#1a1418');R(hx0+3,hy0-3,3,3,'#1a1418');R(hx0-1,hy0+4,2,4,'#1a1418');}
   else if(o.head==='bun'){R(hx0-1,hy0,10,4,'#d8d8e0');R(hx0+2,hy0-3,4,3,'#d8d8e0');R(hx0+5,hy0-3,3,1,'#c060e0');}
   else if(o.head==='veil'){R(hx0-1,hy0,10,11,'#f0ece0');R(hx0+1,hy0+3,6,3,'#d0b890');R(hx0+2,hy0+4,1,1,'#14101a');R(hx0+5,hy0+4,1,1,'#14101a');R(hx0-2,hy0-1,12,2,'#d0a030');}
   else if(o.head==='helm'){R(hx0-1,hy0,10,10,'#8a929c');R(hx0+1,hy0+4,6,1,'#14101a');R(hx0+3,hy0+2,2,6,'#6a727c');R(hx0+3,hy0-5,2,5,'#a02028');}
   else if(o.head==='owl'){R(hx0-2,hy0-1,12,11,o.f2||'#6a6a5a');R(hx0,hy0+2,8,6,'#d8d0b0');R(hx0+1,hy0+3,2,2,'#ffd040');R(hx0+5,hy0+3,2,2,'#ffd040');R(hx0+3,hy0+5,2,2,'#c89040');R(hx0-2,hy0-3,3,3,'#6a6a5a');R(hx0+7,hy0-3,3,3,'#6a6a5a');}
   else if(o.head==='long'){R(hx0-1,hy0,10,3,'#f0f0f8');R(hx0-2,hy0+2,2,14,'#f0f0f8');R(hx0+8,hy0+2,2,10,'#e0e0e8');R(hx0+1,hy0+8,6,4,'#f0f0f8');R(hx0+3,hy0-2,2,2,'#f0f0f8');}}
 });
 sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:o.big?1.3:1.1,ok:true,bossSpr:1};}
// ================= BOSS ART: each guardian drawn as its creature, 48x56, frames: idle, breathe, attack =================
// keyed by name so the story reorder can never hand a boss the wrong body. Faces right; flipped toward you.
const BART={};
// each boss may set its own canvas (fw x fh): art drawn for the base 48x56 box is centred and bottom-aligned in it,
// unless the boss is drawn raw in its own coordinates (the elephant)
function bossArt(name){const D=BART[name];if(!D)return null;const FW=D.fw||48,FH=D.fh||56,N=3,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const fr=mk(FW,FH,g=>{if(!D.raw)g.translate(Math.floor((FW-48)/2),FH-56);
   const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
   const E=(cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y/ry)**2)));R(cx-w,cy+y,w*2+1,1,c);}};
   const L=(x0,y0,x1,y1,c,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,t||1,t||1,c);};
   D({R,E,L,f,b:f===1?1:0,atk:f===2,sh:(c,k)=>shade(c,k==null?-.3:k)});});
  sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:D.sc||1.05,ok:true,bossSpr:1};}
// a human face (3/4 view, looking right) at head-centre hx, top hy
function bFace({R,E},hx,hy,sk){E(hx,hy+5,5,6,sk);R(hx-5,hy+4,1,3,shade(sk,-.25));R(hx-1,hy+4,2,1,'#14101a');R(hx+3,hy+4,2,1,'#14101a');R(hx+5,hy+5,1,2,sk);R(hx+1,hy+8,2,1,shade(sk,-.3));}
// an armoured warrior torso + legs shared by the human bosses
function bWarrior({R,E,L,b,atk,sh},o){const cx=24,ty=22+b,ly=36;
 // legs, hakama skirt and boots
 R(cx-8,ly+4,6,13,o.lg);R(cx+2,ly+4,6,13,o.lg);R(cx-8,ly+4,2,13,sh(o.lg));R(cx-9,52,8,4,o.ft||'#1a1418');R(cx+1,52,8,4,o.ft||'#1a1418');
 for(let j=0;j<9;j++){const w=10+(j>>1);R(cx-w,ly+j,w*2,1,j%3===2?o.ad:o.ar);}R(cx-1,ly,2,9,o.ad);
 // torso, chest plate, belt
 R(cx-9,ty,18,ly-ty,o.ar);R(cx-9,ty,2,ly-ty,sh(o.ar,.2));R(cx+7,ty,2,ly-ty,o.ad);for(let y=ty+3;y<ly-2;y+=3)R(cx-7,y,14,1,o.ad);R(cx-9,ly-2,18,2,o.ac);
 if(o.chest)R(cx-6,ty+1,12,7,o.chest);
 // great shoulder plates
 R(cx-14,ty-2,7,8,o.ac);R(cx+7,ty-2,7,8,o.ac);R(cx-14,ty+2,7,1,o.ad);R(cx+7,ty+2,7,1,o.ad);R(cx-14,ty+5,7,1,o.ad);R(cx+7,ty+5,7,1,o.ad);
 // arms: back arm hangs, front arm raised when attacking
 R(cx-13,ty+6,4,12,o.arm||o.ar);R(cx-13,ty+17,4,4,o.hand);
 if(atk){R(cx+9,ty+2,8,4,o.arm||o.ar);R(cx+16,ty,4,5,o.hand);}else{R(cx+9,ty+6,4,12,o.arm||o.ar);R(cx+9,ty+17,4,4,o.hand);}
 return {hx:atk?cx+18:cx+11,hy:atk?ty+2:ty+19,ty,cx};}
Object.assign(BART,{
 'AKAGANE, THE RED BULL':Object.assign(p=>{const {R,E,L,b,atk}=p;
  // war banner on the back
  R(8,2,1,38,'#3a2a1a');R(2,3,7,14,'#c02820');R(3,6,5,3,'#e0b040');R(4,10,3,1,'#e0b040');
  const h=bWarrior(p,{ar:'#a02818',ad:'#5a1008',ac:'#e0b040',lg:'#3a1a10',hand:'#5a3420',arm:'#6a3a24',chest:'#c03020'});
  // a red-lacquered general: a war helm with great bull horns over a snarling iron face mask
  const hx=h.cx,hy=h.ty-12;bFace(p,hx,hy,'#d8a878');R(hx-5,hy+6,11,5,'#5a1008');R(hx-4,hy+8,9,1,'#e0b040');R(hx-3,hy+10,1,1,'#f0e8d8');R(hx+3,hy+10,1,1,'#f0e8d8');
  R(hx-7,hy-2,15,5,'#a02818');R(hx-6,hy-2,13,1,'#c03020');R(hx-8,hy+2,3,6,'#7a1810');R(hx+6,hy+2,3,6,'#7a1810');R(hx-1,hy-3,3,2,'#e0b040');
  L(hx-6,hy,hx-12,hy-4,'#f0e8d8',2);L(hx-12,hy-4,hx-11,hy-10,'#f0e8d8',2);L(hx+6,hy,hx+12,hy-4,'#f0e8d8',2);L(hx+12,hy-4,hx+11,hy-10,'#f0e8d8',2);R(hx-11,hy-11,2,2,'#c8c0b0');R(hx+11,hy-11,2,2,'#c8c0b0');
  // a great naginata
  if(atk){L(h.hx-14,h.hy+8,h.hx+16,h.hy-6,'#5a3a22',2);L(h.hx+14,h.hy-6,h.hx+22,h.hy-12,'#e8eef6',2);R(h.hx+20,h.hy-14,3,3,'#ffffff');}
  else{R(h.hx+1,2,2,50,'#5a3a22');L(h.hx+2,2,h.hx+6,-6,'#e8eef6',2);R(h.hx,8,4,2,'#e0b040');}},{sc:1.1}),
 'KAMAKIRI, THE REED MANTIS':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // a lean duelist wearing a white tiger's pelt: the head as a hood, the paws knotted at the chest, the tail behind
  const h=bWarrior(p,{ar:'#1e2a50',ad:'#121a34',ac:'#f0f0f4',lg:'#1e2a50',hand:'#e0b080',arm:'#2a3a6a',chest:'#2a3a6a'});
  for(let i=0;i<14;i++)R(4+i*.6,40-Math.sin(i/13*3)*8+b,2,2,i%3?'#f0f0f4':'#14101a');
  R(h.cx-14,h.ty-2,7,8,'#f0f0f4');R(h.cx+7,h.ty-2,7,8,'#f0f0f4');for(const x of [h.cx-13,h.cx-10,h.cx+8,h.cx+11])R(x,h.ty-1,1,6,'#14101a');R(h.cx-3,h.ty+1,6,3,'#f0f0f4');R(h.cx-2,h.ty+2,4,1,'#14101a');
  const hx=h.cx,hy=h.ty-12;bFace(p,hx,hy+2,'#e0b080');R(hx-2,hy+8,5,1,'#8a5030');
  // the tiger-head hood: ears, stripes and glass-blue eyes above the man's face
  E(hx,hy+1,8,5,'#f0f0f4');R(hx-8,hy-4,4,4,'#f0f0f4');R(hx+5,hy-4,4,4,'#f0f0f4');R(hx-7,hy-3,2,2,'#e8a0b0');R(hx+6,hy-3,2,2,'#e8a0b0');
  R(hx-1,hy-3,2,4,'#14101a');R(hx-5,hy-2,1,3,'#14101a');R(hx+4,hy-2,1,3,'#14101a');R(hx-4,hy+1,2,1,'#60c8ff');R(hx+3,hy+1,2,1,'#60c8ff');R(hx-8,hy+2,2,7,'#f0f0f4');R(hx+7,hy+2,2,7,'#f0f0f4');
  // a pair of tekko claw gauntlets
  for(let k=0;k<3;k++){R(h.hx+3+(atk?2:0),h.hy-1+k*2,atk?6:3,1,'#e0f0ff');R(h.cx-15,h.ty+18+k*2,3,1,'#e0f0ff');}},{sc:1.05}),
 'TSUCHIGUMO, EARTH SPIDER':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // eight jointed legs, the front pair raised to strike
  const legs=[[-1,0],[-1,1],[-1,2],[-1,3],[1,0],[1,1],[1,2],[1,3]];
  // a wide, low spread: the legs reach far past the body (its canvas is 80 wide)
  for(const [s,i] of legs){const bx=24+s*4,by=30+i*2,kx=24+s*(20+i*4),ky=14+i*3-(atk&&i===0?8:0)+(f===1&&i%2?1:0),fx=24+s*(26+i*3.5),fy=54-(atk&&i===0?16:0);
   L(bx,by,kx,ky,'#3a2a1a',2);L(kx,ky,fx,fy,'#3a2a1a',2);R(kx,ky,2,2,'#c89040');}
  // abdomen with ochre markings, then the head with its oni face
  E(24,24+b,13,11,'#4a3420');E(24,22+b,10,8,'#5a4028');R(19,16+b,10,2,'#c89040');R(22,20+b,4,6,'#c89040');R(17,26+b,3,2,'#c89040');R(28,26+b,3,2,'#c89040');
  E(24,38,9,7,'#3a2416');E(24,37,8,5,'#d8b890');R(19,35,10,1,'#3a2416');
  for(const [x,y] of [[20,36],[27,36],[22,34],[25,34],[21,38],[26,38]])R(x,y,2,1,'#ff3020');R(23,33,2,1,'#ff3020');
  R(20,41,8,2,'#2a0a08');R(20,43,2,3,'#f0e8d8');R(26,43,2,3,'#f0e8d8');if(atk){R(21,41,6,4,'#5a0a08');}}, {sc:1.1,fw:80,fh:56}),
 'THE MOTH QUEEN':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // great patterned wings with eye-spots, beating between frames
  const wy=f===1?2:0;for(const s of [-1,1]){E(24+s*13,16+wy,11,10,'#7a5aa0');E(24+s*13,16+wy,9,8,'#c8b0e0');E(24+s*12,15+wy,4,4,'#3a1a5a');E(24+s*12,15+wy,2,2,'#ffe080');E(24+s*11,32-wy,8,6,'#7a5aa0');E(24+s*11,32-wy,6,4,'#e0d0f0');R(24+s*17,10+wy,2,2,'#fff');}
  // slender body in a layered kimono
  for(let y=28;y<=53;y++){const w=Math.round(4+(y-28)*.28);R(24-w,y,w*2,1,y%5===0?'#c8a0f0':'#4a2a6a');}R(23,28,2,25,'#2a1840');R(19,34,10,2,'#e0c050');
  R(18,24,12,6,'#5a3a7a');R(16,25,3,8,'#5a3a7a');R(29,25,3,8,'#5a3a7a');R(16,33,3,2,'#e8d8f0');
  // fan held out when attacking
  if(atk){for(let i=0;i<6;i++)L(31,28,36+i,20+i*1.5,'#f0e0ff');R(31,27,2,2,'#e8d8f0');}else{R(29,33,3,2,'#e8d8f0');}
  // face, white hair piled high, feathered antennae
  E(24,19+b,4,5,'#f0e8f8');R(22,19+b,1,1,'#3a1a5a');R(25,19+b,1,1,'#3a1a5a');R(23,22+b,2,1,'#c060a0');
  E(24,14+b,6,4,'#f0f0f8');R(21,10+b,6,3,'#f0f0f8');L(22,10+b,17,1+b,'#e0d0ff');L(26,10+b,31,1+b,'#e0d0ff');for(let i=0;i<4;i++){R(18+i,3+i*2+b,2,1,'#c8b0e0');R(29-i,3+i*2+b,2,1,'#c8b0e0');}},{sc:1.05}),
 'THE FROST TORTOISE':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // an ancient frost hermit carrying a great ice-rimmed tortoise shell as a shield on his back
  E(16,30+b,14,15,'#2e5a6a');E(16,29+b,12,13,'#4a8aa0');for(const [x,y] of [[16,22],[10,28],[22,28],[13,35],[20,35]]){E(x,y+b,3,2,'#6ab0c8');R(x-1,y-1+b,2,1,'#c0f0ff');}
  for(const [x,h] of [[10,6],[16,9],[22,5]]){R(x,15-h+b,2,h,'#c0f0ff');R(x,15-h+b,1,h,'#ffffff');}
  // heavy layered robes of grey-blue, snow on the shoulders
  for(let y=24;y<=54;y++){const w=Math.round(7+(y-24)*.3);R(26-w,y,w*2,1,y%6===0?'#8aa8c0':'#5a7890');}R(25,24,2,30,'#c0f0ff');R(17,22+b,18,3,'#ffffff');
  R(16,26+b,5,12,'#5a7890');R(31,26+b,5,12,'#5a7890');R(16,37+b,4,3,'#c8b8a0');
  // an ice staff: raised and flaring when he attacks
  const sx=atk?40:36;R(sx,atk?4:8,2,atk?46:46,'#7a5a3a');E(sx+1,atk?4:8,3,4,'#80e0ff');R(sx,atk?2:6,2,2,'#ffffff');R(32,37+b,4,3,'#c8b8a0');if(atk){R(sx-3,1,1,3,'#c0f0ff');R(sx+5,2,1,3,'#c0f0ff');}
  // a bald old head with a long white beard and frosted brows
  E(26,17+b,5,6,'#c8b8a0');R(23,15+b,3,1,'#ffffff');R(27,15+b,3,1,'#ffffff');R(24,16+b,1,1,'#14101a');R(28,16+b,1,1,'#14101a');
  R(22,20+b,9,5,'#f0f4f8');R(23,25+b,7,4,'#f0f4f8');R(25,29+b,3,3,'#e0e8f0');R(25,21+b,3,1,'#a08870');},{sc:1.1}),
 'THE WAR ELEPHANT':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // an armoured siege elephant, drawn raw on an 84x60 canvas: pillar legs, red war caparison with gold fringe,
  // a little wooden war tower on its back, iron head plate, iron-capped tusks; the trunk rears up to trumpet
  const gy='#7a7a84',gd='#55555e',gl='#9a9aa4',red='#a01818',gold='#e0b040';
  // tail
  L(6,24+b,2,36+b,gd);R(1,36+b,3,3,'#3a3a44');
  // legs (back pair darker), toenails
  for(const [x,c] of [[14,gd],[30,gd],[44,gy],[58,gy]]){R(x,40,10,17,c);R(x,40,2,17,shade(c,.15));for(let k=0;k<3;k++)R(x+1+k*3,55,2,2,'#d8d0c0');}
  // body
  E(38,30+b,28,17,gy);E(38,36+b,24,9,gd);R(12,22+b,10,10,gy);
  // caparison: red cloth with gold fringe and a gold medallion, iron plates at the shoulder
  R(16,17+b,42,17,red);R(16,17+b,42,2,'#c02828');for(let x=16;x<58;x+=3){R(x,34+b,2,3,gold);}R(16,33+b,42,1,gold);E(37,25+b,5,5,gold);E(37,25+b,3,3,red);R(36,24+b,2,2,gold);
  R(48,18+b,10,14,'#6a6a76');R(48,18+b,10,1,'#9a9aa6');for(let y=21;y<32;y+=3)R(48,y+b,10,1,'#4a4a54');
  // war tower on its back with a pennant
  R(24,4+b,24,13,'#6a4a2a');R(24,4+b,24,2,'#8a6a3a');for(let x=25;x<47;x+=5)R(x,1+b,3,4,'#6a4a2a');R(28,8+b,4,5,'#2a1a10');R(38,8+b,4,5,'#2a1a10');R(24,15+b,24,2,gold);
  R(35,-0+b,1,2,'#3a2a1a');
  // head, ear and eye
  E(66,24+b,12,13,gy);E(57,24+b,8,12,gd);E(57,24+b,6,10,'#b88a90');R(61,13+b,14,6,'#6a6a76');R(61,13+b,14,1,'#9a9aa6');for(const x of [63,68,73])R(x,10+b,2,3,'#c8c8d0');
  R(69,21+b,3,2,'#14101a');R(70,21+b,1,1,'#ff4020');
  // tusks
  L(70,31+b,80,33+b,'#f0e8d8',2);L(80,33+b,82,27+b,'#f0e8d8',2);R(81,25+b,2,3,'#9a9aa6');
  // trunk: hanging and swaying, or raised high to trumpet when attacking
  if(atk){L(74,28,78,14,gy,4);L(78,14,80,4,gy,3);R(79,1,4,3,gd);for(let i=0;i<3;i++)R(76+i*3,-1+(i%2),1,1,'#ffffff');}
  else{const sw=f===1?1:0;L(74,30+b,76+sw,42+b,gy,4);L(76+sw,42+b,73+sw,51,gy,3);R(71+sw,50,4,3,gd);}},{fw:84,fh:58,raw:true,sc:1.1}),
 'THE STONE KOMAINU':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // a temple lion-dog of grey stone: four sturdy legs, one paw on a carved ball
  const st='#9a9aa2',sd='#6a6a74',sl='#c8c8d0';
  for(const x of [10,16,30,36])R(x,40,6,14,st);for(const x of [10,16,30,36]){R(x,52,7,3,sd);R(x,41,1,11,sl);}
  E(24,36+b,17,9,st);R(8,34+b,32,2,sl);R(10,42+b,28,1,sd);
  E(40,50,5,5,'#7a7a84');R(38,47,2,2,sl);if(!atk)R(36,44,6,4,st);
  // curled tail flames of stone
  for(let i=0;i<4;i++)E(6-i,26+i*3+b,3,2,i%2?st:sl);
  // big maned head with an open roaring mouth
  const hx=atk?36:34,hy=atk?18:20;for(let i=0;i<8;i++){const a=i/8*6.28;E(hx+Math.cos(a)*9,hy+Math.sin(a)*8+b,4,4,i%2?sd:st);}
  E(hx,hy+b,8,8,st);R(hx-4,hy-3+b,3,2,'#14101a');R(hx+2,hy-3+b,3,2,'#14101a');R(hx-3,hy-3+b,1,1,'#40c0ff');R(hx+3,hy-3+b,1,1,'#40c0ff');
  E(hx+1,hy+3+b,4,2,sl);R(hx-3,hy+5+b,8,atk?5:3,'#2a2028');R(hx-3,hy+5+b,1,2,'#fff');R(hx+4,hy+5+b,1,2,'#fff');R(hx-1,hy-8+b,3,3,'#40c0ff');},{sc:1.15}),
 'THE THOUSAND-BELL ABBOT':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // the great temple bell floats behind him
  E(24,14+b,13,12,'#8a6a28');R(11,14+b,27,12,'#8a6a28');R(10,25+b,29,3,'#a07a30');for(let x=13;x<36;x+=4)for(let y=6;y<14;y+=3)R(x,y+b,1,1,'#c8a048');R(22,0+b,5,3,'#6a4a18');R(14,17+b,21,1,'#6a4a18');R(14,21+b,21,1,'#6a4a18');
  // long gold-trimmed robe
  for(let y=26;y<=54;y++){const w=Math.round(6+(y-26)*.32);R(24-w,y,w*2,1,'#e8dcc0');R(24-w,y,1,1,'#b8a888');}R(23,26,2,28,'#c8a040');R(14,52,21,2,'#c8a040');R(17,32,15,2,'#c03020');
  R(13,28,6,12,'#e8dcc0');R(30,28,6,12,'#e8dcc0');R(13,39,4,3,'#e0c098');
  // ringed shakujo staff with a cluster of bells
  const sx=atk?38:33;R(sx,atk?6:10,2,atk?40:44,'#6a4a28');for(let i=0;i<5;i++){E(sx+1+Math.cos(i*1.3)*4,(atk?4:8)+Math.sin(i*1.3)*3,1,2,'#e0c050');}E(sx+1,atk?4:8,4,4,'#c8a040');R(sx,atk?3:7,2,2,'#fff8c0');R(31,38,4,3,'#e0c098');
  // a veiled face under a wide hood
  E(24,22+b,6,6,'#e8dcc0');R(20,21+b,8,6,'#d8c098');R(21,23+b,2,1,'#14101a');R(25,23+b,2,1,'#14101a');R(18,17+b,13,3,'#c8a040');},{sc:1.05}),
 'THE IRON BEAR':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  const fur='#4a3020',fd='#2e1c12',ir='#6a6a76',il='#9a9aa6';
  // a giant warlord in black iron, a bear's pelt for a cloak, swinging a huge iron kanabo
  for(let j=0;j<30;j++)R(8-(j>>3),18+j,32+(j>>2),1,j%3?fur:fd);E(24,17+b,13,5,fur);R(12,14+b,4,4,fur);R(32,14+b,4,4,fur);
  const h=bWarrior(p,{ar:ir,ad:'#3a3a44',ac:il,lg:'#2a2a32',hand:'#c89870',arm:'#3a3a44',chest:'#5a5a66'});
  R(h.cx-9,h.ty+9,18,2,'#c8a040');
  // a bearded face under an iron helm with a bear's-ear crest
  const hx=h.cx,hy=h.ty-12;bFace(p,hx,hy,'#c89870');R(hx-5,hy+6,11,6,'#2a1a10');R(hx-4,hy+11,9,2,'#2a1a10');R(hx-2,hy+7,5,1,'#4a2a18');
  R(hx-7,hy-3,15,6,ir);R(hx-7,hy-3,15,1,il);R(hx-8,hy+2,3,5,ir);R(hx+6,hy+2,3,5,ir);R(hx-7,hy-6,4,4,fur);R(hx+4,hy-6,4,4,fur);R(hx-6,hy-5,2,2,'#7a5a40');R(hx+5,hy-5,2,2,'#7a5a40');
  // iron kanabo studded with spikes
  if(atk){for(let j=0;j<20;j++)R(h.hx+j*.8,h.hy-j*.9,3,3,'#3a3a44');for(let j=6;j<20;j+=4){R(h.hx+j*.8+3,h.hy-j*.9,1,1,il);R(h.hx+j*.8-1,h.hy-j*.9+2,1,1,il);}}
  else{R(h.hx,h.hy-26,4,28,'#3a3a44');R(h.hx-1,h.hy-28,6,10,'#3a3a44');for(let y=h.hy-26;y<h.hy-8;y+=4){R(h.hx-2,y,1,1,il);R(h.hx+5,y+2,1,1,il);}}},{sc:1.15}),
 'HERON GENERAL SORA':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // long legs in slate greaves under a split armour skirt
  R(17,38,5,15,'#2e3a52');R(26,38,5,15,'#2e3a52');R(17,38,1,15,'#4a5a7a');R(16,52,7,3,'#1a1418');R(25,52,7,3,'#1a1418');for(let j=0;j<6;j++)R(14-(j>>1),37+j,20+(j>>1)*2,1,j%2?'#4a5a7a':'#8a9ab0');
  // slate-blue armour over a white feathered body, feather cape behind
  for(let j=0;j<16;j++)R(10-(j>>3),20+j+b,8,1,j%3?'#8a9ab0':'#c8d0e0');
  R(15,18+b,18,20,'#4a5a7a');R(15,18+b,2,20,'#6a7a9a');for(let y=21+b;y<36;y+=3)R(17,y,14,1,'#2e3a52');R(15,36+b,18,2,'#e0e0e8');
  R(11,16+b,7,7,'#e0e0e8');R(30,16+b,7,7,'#e0e0e8');R(12,18+b,5,1,'#8a9ab0');R(31,18+b,5,1,'#8a9ab0');R(12,23+b,4,10,'#e0e0e8');R(12,32+b,4,3,'#2a2a2a');
  // great bow
  const bx=atk?40:36;for(let j=-14;j<=14;j++)R(bx+Math.round(4*Math.cos(j/14*1.4)),28+j+b,1,1,'#5a3418');R(bx,14+b,1,29,'#e8e8f0');R(32,27+b,4,3,'#e0e0e8');if(atk)L(26,28+b,bx,28+b,'#c8c8d0');
  // the general's face under a white helm crested with long black heron plumes and a gilded beak-shaped brow
  bFace(p,24,10+b,'#e0b080');R(17,7+b,15,4,'#f0f0f4');R(18,7+b,13,1,'#ffffff');R(16,10+b,3,6,'#f0f0f4');R(30,10+b,3,5,'#f0f0f4');L(30,9+b,atk?40:37,10+b,'#e0b030',2);
  L(20,7+b,12,2+b,'#14101a');L(21,7+b,11,6+b,'#14101a');L(22,7+b,14,-1+b,'#14101a');},{sc:1.05}),
 'THE NINE-TAILED KITSUNE':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // nine tails fanned out behind, tipped with foxfire
  for(let i=0;i<9;i++){const a=-2.95+i*.36+(f===1?.05:0),tx=24+Math.cos(a)*30,ty=40+Math.sin(a)*24,c=i%2?'#d07a28':'#e8a040';L(24,40,tx,ty,c,4);L(24,40,tx,ty,shade(c,-.25),1);E(tx,ty,3,3,'#fff4dc');R(tx-1,ty-4,2,2,i%2?'#80e0ff':'#c0f0ff');}
  // shrine robes: white over red hakama
  for(let y=30;y<=54;y++){const w=Math.round(6+(y-30)*.25);R(24-w,y,w*2,1,y>38?'#c02030':'#f8f4ec');}R(17,38,15,2,'#e0b040');R(14,31,5,9,'#f8f4ec');R(30,31,5,9,'#f8f4ec');R(14,39,4,2,'#f0d8a0');
  // a foxfire orb in the hand
  const ox=atk?40:34,oy=atk?28:40;E(ox,oy,3,3,'#40c0ff');E(ox,oy,1,1,'#ffffff');if(atk){R(ox+4,oy-1,3,1,'#c0f0ff');R(ox+3,oy-4,1,2,'#c0f0ff');}
  // fox head: tall ears, red eye markings, pointed muzzle
  E(24,22+b,6,6,'#f0a850');L(19,18+b,17,9+b,'#f0a850',3);L(29,18+b,31,9+b,'#f0a850',3);R(18,12+b,2,4,'#3a1a10');R(29,12+b,2,4,'#3a1a10');E(24,25+b,4,3,'#fff4dc');
  E(28,25+b,4,2,'#fff4dc');R(31,24+b,2,1,'#14101a');R(21,20+b,3,1,'#c03030');R(26,20+b,3,1,'#c03030');R(22,21+b,2,1,'#14101a');R(27,21+b,2,1,'#14101a');R(22,16+b,5,1,'#c03030');},{sc:1.05,fw:72,fh:60}),
 'THE JADE SERPENT':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // coils piled on the ground
  E(24,49,20,6,'#1e6a4a');E(24,47,17,4,'#3aa070');E(22,42,14,5,'#1e6a4a');E(22,41,12,3,'#3aa070');for(let x=8;x<42;x+=4)R(x,47,2,1,'#a0f0c0');
  // the rearing body with its pale belly scales
  const sway=f===1?1:0,top=atk?-10:-5; /* rears far higher than anyone else (its canvas is 72 tall) */for(let y=top+10;y<40;y++){const x=24+Math.sin(y/7)*3+sway;R(x-5,y,10,1,'#2a8a5a');R(x-2,y,4,1,y%2?'#e0f0b0':'#c8e0a0');}
  // cobra hood with a gold crown and burning eyes
  const hx=24+Math.sin((top+8)/7)*3+sway+(atk?6:0),hy=top+6;E(hx,hy+4,10,8,'#1e6a4a');E(hx,hy+4,7,6,'#3aa070');R(hx-6,hy+2,2,4,'#e0b040');R(hx+5,hy+2,2,4,'#e0b040');
  E(hx,hy,5,4,'#2a8a5a');R(hx-3,hy-1,2,1,'#ffd040');R(hx+2,hy-1,2,1,'#ffd040');R(hx-1,hy+2,2,1,'#14101a');R(hx-4,hy-6,9,2,'#e0b040');R(hx-4,hy-8,1,2,'#e0b040');R(hx,hy-9,1,3,'#e0b040');R(hx+4,hy-8,1,2,'#e0b040');R(hx,hy-7,1,1,'#40ff90');
  if(atk){R(hx-1,hy+4,2,4,'#c02040');R(hx-2,hy+7,1,2,'#c02040');R(hx+1,hy+7,1,2,'#c02040');}},{sc:1.1,fh:72}),
 'THE CORRUPT EMPEROR':Object.assign(p=>{const {R,E,L,b,atk,f}=p;
  // the corrupt emperor: imperial regalia rotting from within. A vast cloak lined with spotted ermine,
  // robes of deep violet and gold, a jewelled crown cracked and weeping darkness, a sceptre crowned by a black orb.
  const cv='#3a1450',cvd='#200a30',gold='#e0b040',gl='#fff0a0',erm='#f0ecf4',rot='#a040ff';
  for(let j=0;j<34;j++){const w=32+(j>>1);R(24-w/2,20+j,w,1,j%5?'#6a0a20':'#4a0614');}
  for(let j=0;j<34;j+=2){R(24-(32+(j>>1))/2,20+j,2,2,erm);R(24+(32+(j>>1))/2-2,20+j,2,2,erm);if(j%6===0){R(24-(32+(j>>1))/2,20+j,1,1,'#14101a');R(24+(32+(j>>1))/2-1,20+j,1,1,'#14101a');}}
  // floor-length robe
  for(let y=26;y<=54;y++){const w=Math.round(8+(y-26)*.3);R(24-w,y,w*2,1,cv);R(24-w,y,2,1,cvd);}R(23,26,3,29,gold);R(20,30,9,1,gold);R(15,52,19,2,gold);
  // ermine collar and a heavy gold chain of office
  E(24,25+b,11,3,erm);for(const x of [16,20,25,29,32])R(x,24+b,1,1,'#14101a');for(let i=0;i<9;i++)R(17+i*2,28+b+Math.round(Math.sin(i/8*3.14)*3),2,1,gold);E(24,32+b,2,2,'#c02040');
  // arms: the orb held low, the sceptre raised to strike
  R(13,27+b,5,12,cv);R(13,38+b,4,3,'#b8a8c0');E(15,43+b,3,3,'#14101a');R(14,42+b,1,1,rot);R(14,40+b,3,1,gold);
  if(atk){R(30,24,8,4,cv);R(37,22,4,4,'#b8a8c0');L(39,24,47,6,gold,2);E(46,5,3,3,'#14101a');R(45,4,1,1,rot);R(43,8,1,1,rot);R(48,3,1,1,rot);}
  else{R(31,27+b,5,12,cv);R(31,38+b,4,3,'#b8a8c0');R(33,12+b,2,30,gold);E(34,10+b,3,3,'#14101a');R(33,9+b,1,1,rot);R(32,13+b,4,1,gold);}
  // a gaunt, grey-violet face with burning eyes and dark veins
  const hx=24,hy=12+b;E(hx,hy+5,5,6,'#b8a8c0');R(hx-5,hy+4,1,3,'#8a7a98');R(hx-2,hy+4,2,1,rot);R(hx+2,hy+4,2,1,rot);R(hx-1,hy+4,1,1,'#fff');R(hx+3,hy+4,1,1,'#fff');
  R(hx-1,hy+8,3,1,'#5a3a6a');R(hx-4,hy+6,1,3,'#6a3a8a');R(hx+4,hy+7,1,2,'#6a3a8a');R(hx-6,hy+2,2,10,'#d8d8e0');R(hx+5,hy+2,2,8,'#c8c8d0');
  // the imperial crown: gold arches, a jewelled band, a cross-orb finial, a crack leaking corruption
  R(hx-6,hy-1,13,3,gold);R(hx-6,hy-1,13,1,gl);for(const x of [hx-5,hx-1,hx+3])R(x,hy,2,1,'#c02040');R(hx+1,hy,1,1,'#40a0ff');
  for(const x of [hx-6,hx-3,hx,hx+3,hx+6]){R(x,hy-4,1,3,gold);}L(hx-6,hy-4,hx,hy-7,gold);L(hx+6,hy-4,hx,hy-7,gold);R(hx,hy-10,1,3,gold);R(hx-1,hy-9,3,1,gold);E(hx,hy-6,1,1,'#c02040');
  R(hx+2,hy-3,1,3,'#14101a');R(hx+2,hy+1,1,1,rot);
  // corruption drifting off him
  for(let i=0;i<6;i++){const a=i*1.1+f*.5;R(24+Math.cos(a)*16,24+Math.sin(a)*14-f,1,2,i%2?rot:'#6a20a0');}},{sc:1.1})});
const BOSSSPR=[];
// ---- boss movement phases: chase you down, orbit and pepper you, dash across the room, blink around ----
const BMODES=[['chase','dashes'],['chase','circle'],['circle','blink'],['blink','dashes'],['chase','dashes'],['circle','blink'],['chase','dashes'],['blink','dashes','circle'],['chase','circle','dashes'],['dashes','blink','circle','chase']];
// ---- every boss has its own bullet language: a colour, signature bullet styles, and a named barrage set per phase ----
// burst:n,gap:s repeats a pattern n times (spirals); damage climbs each phase
const BSTYLE=[
 {c:'#e04030',t:['WAR DRUMS','CAVALRY CHARGE','LAST STAND'],ph:[
  [{pat:'wall',cnt:11,sp:80,arrow:true,col:'#d0a040'},{pat:'gapring',cnt:18,gw:.5,col:'#e04030'}],
  [{pat:'wall',cnt:13,sp:90,arrow:true,col:'#d0a040'},{pat:'stream',cnt:6,sp:110,st:'accel',arrow:true,col:'#ffd060'},{pat:'gapring',cnt:22,gw:.45,col:'#e04030'}],
  [{pat:'cross',dirs:6,cnt:3,sp:70,st:'boom',bT:1.4,col:'#ff6040',rot:.2},{pat:'wall',cnt:15,sp:95,arrow:true,col:'#d0a040'},{pat:'curtain',cnt:9,sp:85,col:'#ffd060'}]]},
 {c:'#a0a0a8',t:['CHAIN SWING','BOULDER HAIL','UNCHAINED'],ph:[
  [{pat:'flower',cnt:12,sp:45,st:'big',col:'#a0a0a8'},{pat:'mines',cnt:4,st:'mine',fuse:1.2,col:'#c8b8a0'}],
  [{pat:'gapring',cnt:16,gw:.5,sp:50,st:'big',col:'#a0a0a8'},{pat:'stream',cnt:4,sp:70,st:'split',splitT:.8,col:'#c8b8a0'},{pat:'mines',cnt:6,st:'mine',col:'#c8b8a0'}],
  [{pat:'flower',cnt:16,sp:50,st:'split',splitT:1,col:'#c8b8a0'},{pat:'gapring',cnt:20,gw:.45,sp:55,st:'big',col:'#a0a0a8'},{pat:'mines',cnt:8,st:'mine',col:'#c8b8a0'}]]},
 {c:'#cde',t:['ARROW VOLLEY','LIGHTNING','STORM GENERAL'],ph:[
  [{pat:'stream',cnt:5,sp:120,arrow:true,col:'#cde'},{pat:'curtain',cnt:9,sp:90,arrow:true,col:'#cde',curve:.8}],
  [{pat:'cross',dirs:4,cnt:4,sp:90,st:'accel',col:'#ff6'},{pat:'curtain',cnt:11,sp:95,arrow:true,col:'#cde'},{pat:'stream',cnt:6,sp:130,arrow:true,col:'#cde'}],
  [{pat:'cross',dirs:8,cnt:3,sp:95,st:'accel',col:'#ff6',rot:.25},{pat:'wall',cnt:15,sp:110,arrow:true,col:'#cde'},{pat:'gapring',cnt:26,gw:.4,sp:75,col:'#ff6'}]]},
 {c:'#f0a0e0',t:['DANCING WINGS','PHANTOM SWARM','ILLUSION'],ph:[
  [{pat:'flower',cnt:14,sp:55,st:'wave',wa:50,wf:6,col:'#f0a0e0'},{pat:'curtain',cnt:9,sp:70,col:'#c8f',curve:1.2}],
  [{pat:'spiral',arms:5,spin:.5,sp:60,st:'wave',col:'#f0a0e0',burst:6,gap:.12},{pat:'flower',cnt:18,sp:55,st:'wave',col:'#c8f'},{pat:'curtain',cnt:11,sp:75,col:'#f0a0e0',curve:1.4}],
  [{pat:'flower',cnt:16,sp:60,st:'split',splitT:.9,col:'#f0a0e0'},{pat:'spiral',arms:6,spin:.55,sp:65,st:'wave',col:'#c8f',burst:8,gap:.1},{pat:'gapring',cnt:24,gw:.45,sp:60,col:'#fff0ff'}]]},
 {c:'#a98',t:['CLAW STORM','STALKING FURY','WHITE RAGE'],ph:[
  [{pat:'stream',cnt:3,sp:80,st:'boom',bT:1.6,r:5,col:'#a98'},{pat:'gapring',cnt:16,gw:.5,sp:55,st:'big',col:'#a98'}],
  [{pat:'mines',cnt:6,st:'mine',col:'#8f4'},{pat:'cross',dirs:4,cnt:3,sp:75,st:'boom',bT:1.5,col:'#a98'},{pat:'flower',cnt:16,sp:55,col:'#8f4'}],
  [{pat:'spiral',arms:4,spin:.45,sp:70,st:'boom',bT:1.4,col:'#c8c0b0',burst:6,gap:.12},{pat:'mines',cnt:8,st:'mine',col:'#8f4'},{pat:'gapring',cnt:22,gw:.42,sp:65,st:'big',col:'#a98'}]]},
 {c:'#d8b040',t:['PRAYER BEADS','THOUSAND HANDS','NIRVANA'],ph:[
  [{pat:'gapring',cnt:20,gw:.5,sp:45,st:'curve',curve:.6,col:'#e8e0ff'},{pat:'spiral',arms:4,spin:.35,sp:55,col:'#d8b040',burst:6,gap:.12}],
  [{pat:'flower',cnt:18,sp:50,st:'split',splitT:1.1,col:'#d8b040'},{pat:'gapring',cnt:24,gw:.45,sp:50,st:'curve',curve:-.7,col:'#e8e0ff'},{pat:'spiral',arms:5,spin:.4,sp:60,col:'#d8b040',burst:8,gap:.1}],
  [{pat:'spiral',arms:6,spin:.3,sp:60,col:'#e8e0ff',burst:10,gap:.09},{pat:'wall',cnt:15,sp:70,col:'#d8b040'},{pat:'flower',cnt:20,sp:55,st:'split',col:'#e8e0ff'}]]},
 {c:'#b0b8c0',t:['IRON WALL','SIEGE','UNBREAKABLE'],ph:[
  [{pat:'wall',cnt:9,sp:55,st:'big',col:'#b0b8c0'},{pat:'stream',cnt:5,sp:70,st:'accel',cap:260,col:'#e0e8f0'}],
  [{pat:'wall',cnt:11,sp:60,st:'big',col:'#b0b8c0'},{pat:'cross',dirs:4,cnt:4,sp:70,st:'accel',col:'#e0e8f0'},{pat:'stream',cnt:6,sp:75,st:'accel',cap:280,col:'#ffd060'}],
  [{pat:'cross',dirs:8,cnt:3,sp:70,st:'big',col:'#b0b8c0',rot:.2},{pat:'wall',cnt:13,sp:70,st:'big',col:'#b0b8c0'},{pat:'gapring',cnt:22,gw:.42,sp:65,st:'accel',col:'#ffd060'}]]},
 {c:'#9f9',t:['VENOM FANGS','SHED SKIN','SERPENT COIL'],ph:[
  [{pat:'stream',cnt:4,sp:150,arrow:true,col:'#9f9'},{pat:'mines',cnt:5,st:'mine',col:'#9f9'}],
  [{pat:'curtain',cnt:11,sp:110,arrow:true,col:'#9f9',curve:1},{pat:'mines',cnt:7,st:'mine',col:'#9f9'},{pat:'stream',cnt:6,sp:160,arrow:true,col:'#cfc'}],
  [{pat:'spiral',arms:4,spin:.6,sp:120,arrow:true,col:'#9f9',burst:8,gap:.08},{pat:'mines',cnt:10,st:'mine',col:'#9f9'},{pat:'wall',cnt:13,sp:120,arrow:true,col:'#cfc'}]]},
 {c:'#c060e0',t:['WEB OF SPIRITS','BROOD SWARM','HUNGERING DARK'],ph:[
  [{pat:'web',cnt:8,rings:2,sp:48,col:'#e0c0ff'},{pat:'stream',cnt:4,sp:70,st:'split',splitT:.8,col:'#8a3ac8'}],
  [{pat:'flower',cnt:20,sp:50,st:'accel',col:'#c060e0'},{pat:'mines',cnt:7,st:'mine',col:'#8a3ac8'},{pat:'web',cnt:10,rings:3,sp:52,col:'#e0c0ff'}],
  [{pat:'spiral',arms:6,spin:.4,sp:65,st:'accel',col:'#c060e0',burst:10,gap:.09},{pat:'flower',cnt:18,sp:55,st:'split',col:'#8a3ac8'},{pat:'web',cnt:12,rings:3,sp:56,col:'#e0c0ff'}]]},
 {c:'#ffe',t:['WIND BLADE','SPEAR OF HEAVEN','PHOENIX REBORN'],ph:[
  [{pat:'curtain',cnt:9,sp:110,arrow:true,col:'#fff',curve:.7},{pat:'gapring',cnt:22,gw:.42,sp:70,st:'wave',col:'#ffe'}],
  [{pat:'cross',dirs:6,cnt:4,sp:100,arrow:true,col:'#ffe',rot:.3},{pat:'wall',cnt:15,sp:100,arrow:true,col:'#fff'},{pat:'spiral',arms:5,spin:.5,sp:80,col:'#d0a030',burst:8,gap:.09}],
  [{pat:'spiral',arms:7,spin:.45,sp:85,col:'#ffe',burst:12,gap:.08},{pat:'gapring',cnt:28,gw:.38,sp:80,st:'accel',col:'#d0a030'},{pat:'curtain',cnt:13,sp:120,arrow:true,col:'#fff',curve:1}]]}];
const bsty=e=>(BKIT[e.name]&&BKIT[e.name].style)||BSTYLE[e.di]||BSTYLE[0];
