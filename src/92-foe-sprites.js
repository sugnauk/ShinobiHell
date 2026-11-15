'use strict';
// HELL OF THE EMPEROR - redrawn stage foes. A larger, more detailed template (22x28, 2 walk frames, facing right) for
// the eight humanoids you meet most. They keep each stage's palette: c cloth, d dark, a accent, h hat, s skin.
// Any foe without a FOE2 entry still uses the original 18x24 art in 05-foe-sprites.js.
const FOE2={};
function foe2Sprite(type,p){const D=FOE2[type],BW=D.w||22,BH=D.h||28,FW=BW+8,FH=BH+5,N=2,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 // drawn in the base box (BW x BH) with room around it for spear tips, horns and blades
 for(let f=0;f<N;f++){const fr=mk(FW,FH,g=>{g.translate(2,5);const C=k=>p[k]||k,R=(x,y,w,h,c)=>{g.fillStyle=C(c);g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
   const L=(x0,y0,x1,y1,c)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,1,1,c);};
   const sh=(k,a)=>shade(C(k),a==null?-.3:a);D.draw({R,L,f,b:f,p,C,sh,cx:Math.floor(BW/2)});});
  sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:D.sc||1,ok:true,animal:true};}
{const _fs=foeSprite;foeSprite=function(type,p){return FOE2[type]?foe2Sprite(type,p):_fs(type,p);};}
// shared parts: legs with a walking step, a shaded torso, arms, a face looking right
function f2legs(A,o){const {R,f,sh,cx}=A,lg=o.leg||'d',ft=o.foot||'#2a2026',st=f?1:0;
 R(cx-4,20,3,6-st,lg);R(cx+1,20+st,3,6-st,lg);R(cx-4,20,1,6-st,sh(lg));R(cx+1,20+st,1,5-st,sh(lg,-.15));R(cx-5,26-st,4,2,ft);R(cx+1,26,4,2,ft);R(cx-5,26-st,4,1,shade(A.C(ft),.25));}
function f2torso(A,o){const {R,b,sh,cx,C}=A,tw=o.w||10,tx=cx-Math.floor(tw/2),c=o.torso||'c';
 for(let y=12;y<=20;y++)R(tx,y+b,tw,1,c);R(tx,12+b,2,9,sh(c));R(tx+tw-2,12+b,1,9,shade(C(c),.25));
 if(o.plates)for(let y=13;y<20;y+=2)R(tx+1,y+b,tw-2,1,sh(c,-.45));
 if(o.belt!==false)R(tx,18+b,tw,2,o.belt||'a'),R(tx,18+b,tw,1,shade(C(o.belt||'a'),.25));}
function f2arms(A,o){const {R,b,sh,cx}=A,tw=o.w||10,tx=cx-Math.floor(tw/2),sl=o.sleeve||o.torso||'c',hd=o.hand||'s';
 R(tx-3,13+b,3,6,sl);R(tx-3,13+b,1,6,sh(sl));R(tx-3,19+b,3,2,hd);
 if(o.front!==false){const fx=tx+tw;if(o.raise){R(fx,12+b,4,3,sl);R(fx+3,11+b,3,3,hd);}else{R(fx,13+b,3,5,sl);R(fx+2,13+b,1,5,sh(sl,.2));R(fx,18+b,3,2,hd);}}}
function f2face(A,o){const {R,b,sh,cx}=A,y=4+b,s=o.face||'s';R(cx-3,y+1,7,7,s);R(cx-3,y+1,1,7,sh(s,-.25));R(cx-2,y+7,5,1,sh(s,-.15));
 R(cx+1,y+4,2,1,'#f0e8e0');R(cx+2,y+4,1,1,o.eye||'#14101a');R(cx+1,y+3,3,1,o.brow||'#2a1a14');R(cx+3,y+5,1,1,sh(s,-.2));R(cx+1,y+7,2,1,o.mouth||sh(s,-.45));}
const yari=(A,x,y,len,tip)=>{const {R,b}=A;R(x,y+b,1,len,'#6a4a2a');R(x,y+b,1,len,'#7a5a3a');R(x-1,y-4+b,3,1,'#c8ccd8');R(x,y-6+b,1,6,tip||'#e8eef6');R(x,y-1+b,1,1,'#a02020');};

// ASHIGARU: foot soldier. Wide jingasa, lamellar plates, a sashimono flag on his back, a long yari
FOE2.ashigaru={draw:A=>{const {R,b,cx,sh,C}=A;
 R(cx-7,0+b,2,12,'#5a3a22');R(cx-9,0+b,3,6,'a');R(cx-9,0+b,3,1,shade(C('a'),.3));R(cx-8,2+b,1,2,'#f0e8d0');
 f2legs(A,{leg:'d'});f2torso(A,{torso:'c',plates:1,belt:'a'});f2arms(A,{sleeve:'d'});f2face(A,{});
 R(cx-7,4+b,15,2,'h');R(cx-5,3+b,11,1,'h');R(cx-3,2+b,7,1,'h');R(cx-1,1+b,3,1,'a');R(cx-7,5+b,15,1,sh('h'));R(cx-3,2+b,3,1,shade(C('h'),.3));
 yari(A,cx+7,2,24);}};
// ARCHER: kasa hat, a quiver of fletched arrows on the back, a tall yumi bow held out front
FOE2.archer={draw:A=>{const {R,L,b,cx,sh,C,f}=A;
 for(let i=0;i<3;i++){R(cx-7+i,4+b,1,9,'#6a4a2a');R(cx-8+i,2+b+i%2,2,2,i%2?'#f0e8d0':'#d02030');}R(cx-8,8+b,4,9,'#5a3a22');
 f2legs(A,{leg:'d'});f2torso(A,{torso:'c',belt:'a'});f2arms(A,{sleeve:'c',raise:1});f2face(A,{});
 R(cx-6,4+b,13,2,'h');R(cx-4,3+b,9,1,'h');R(cx-1,2+b,3,1,'h');R(cx-6,5+b,13,1,sh('h'));
 const bx=cx+8;for(let y=1;y<=24;y++){const k=(y-12.5)/11.5,x=bx+Math.round((1-k*k)*2);R(x,y+b,1,1,'#7a4a20');}L(bx,1+b,bx,24+b,'#e8e0c8');R(bx+2,11+b,1,3,'#3a2a1a');}};
// SAMURAI: horned kabuto with a gold crescent, a dark menpo mask, broad sode shoulder plates, katana drawn forward
FOE2.samurai={draw:A=>{const {R,L,b,cx,sh,C}=A;
 f2legs(A,{leg:'#2a2a34'});for(let j=0;j<5;j++)R(cx-6-(j>>1),17+j+b*(j<2?1:0),12+(j>>1)*2,1,j%2?sh('c',-.2):'c');
 f2torso(A,{torso:'c',plates:1,belt:'#e0b040',w:12});f2arms(A,{sleeve:'#2a2a34',w:12,raise:1});
 R(cx-9,12+b,5,5,sh('c',-.1));R(cx+5,12+b,4,4,sh('c',-.1));for(const y of [13,15])R(cx-9,y+b,5,1,'#e0b040');
 f2face(A,{eye:'#ff3020'});R(cx-1,8+b,5,3,'#1a1a22');R(cx,9+b,3,1,'#e0e0e8');
 R(cx-4,2+b,9,4,'#1a1a22');R(cx-5,4+b,2,5,'#1a1a22');R(cx-3,2+b,7,1,'#3a3a48');R(cx-4,5+b,9,1,'#e0b040');
 L(cx-3,2+b,cx-6,-1+b,'#e0b040');L(cx+3,2+b,cx+6,-1+b,'#e0b040');R(cx,3+b,1,1,'#d02030');
 L(cx+9,13+b,cx+16,5+b,'#e8eef6');L(cx+9,14+b,cx+16,6+b,'#b8c0cc');R(cx+7,13+b,3,2,'#3a2a1a');}};
// NINJA: dark hood and mask with a red-eyed slit, a long scarf tail, crouched low, a reverse-grip tanto
FOE2.ninja={draw:A=>{const {R,L,b,cx,sh,f}=A;
 for(let i=0;i<8;i++)R(cx-5-i,8+b+Math.round(Math.sin(i*.9+f*2)*1)+(i>>2),2,2,i%3===2?sh('a'):'a');
 f2legs(A,{leg:'#1a1a26'});f2torso(A,{torso:'#2a2a3a',belt:'a'});f2arms(A,{sleeve:'#2a2a3a',hand:'#2a2a3a'});
 R(cx-3,4+b,7,8,'#1a1a26');R(cx-3,4+b,1,8,'#0a0a12');R(cx,7+b,4,2,'#3a3a4a');R(cx+1,7+b,1,1,'#ff3030');R(cx+3,7+b,1,1,'#ff3030');R(cx-3,3+b,6,1,'#1a1a26');
 L(cx+6,19+b,cx+11,16+b,'#e8eef6');R(cx+5,18+b,2,2,'#3a2a1a');}};
// MONK (sohei): white head-cowl, saffron robe with a dark kesa sash, prayer beads, a naginata
FOE2.monk={draw:A=>{const {R,L,b,cx,sh,C}=A;
 f2legs(A,{leg:'c'});for(let j=0;j<6;j++)R(cx-5-(j>>1),17+j,10+(j>>1)*2,1,j%2?sh('c',-.15):'c');
 f2torso(A,{torso:'c',belt:false});L(cx-4,12+b,cx+4,19+b,'d');L(cx-3,12+b,cx+5,19+b,'d');f2arms(A,{sleeve:'c'});
 for(let i=0;i<6;i++)R(cx-3+i,11+b+Math.round(Math.sin(i/5*3.14)*2),1,1,'#5a3a18');
 f2face(A,{});R(cx-4,3+b,8,3,'#f0ece4');R(cx-4,3+b,2,10,'#f0ece4');R(cx-2,9+b,6,3,'#f0ece4');R(cx-4,3+b,8,1,'#c8c0b0');
 R(cx+7,1+b,1,25,'#6a4a2a');L(cx+7,1+b,cx+10,-4+b,'#e8eef6');L(cx+8,1+b,cx+10,-3+b,'#b8c0cc');R(cx+6,3+b,3,1,'#e0b040');}};
// BRUTE: a hulking oni enforcer - horns, wild hair, bare scarred chest, a spiked iron club
FOE2.brute={w:28,h:30,draw:A=>{const {R,L,b,cx,sh,C}=A;
 const lg='d';R(cx-6,22,5,6-(A.f?1:0),lg);R(cx+1,22+(A.f?1:0),5,6-(A.f?1:0),lg);R(cx-7,27,6,2,'#2a2026');R(cx+1,27,6,2,'#2a2026');
 for(let j=0;j<5;j++)R(cx-8,19+j,16,1,j%2?'#5a4030':'#7a5a40');
 for(let y=11;y<=19;y++){const w=14+(y<15?2:0);R(cx-w/2,y+b,w,1,'s');}R(cx-8,11+b,2,9,sh('s'));R(cx-2,13+b,4,1,sh('s',-.2));R(cx-1,15+b,2,3,sh('s',-.15));L(cx-5,12+b,cx+1,18+b,'#a04030');
 R(cx-11,11+b,4,9,'s');R(cx+7,11+b,4,8,'s');R(cx-11,19+b,4,3,sh('s'));R(cx+7,18+b,4,3,sh('s'));
 R(cx-4,2+b,9,9,'s');R(cx-4,2+b,1,9,sh('s'));R(cx+1,5+b,2,1,'#ffe060');R(cx+3,5+b,1,1,'#14101a');R(cx,4+b,4,1,'#2a1a14');R(cx,8+b,4,2,'#5a0a10');R(cx+1,8+b,1,1,'#fff');R(cx+3,8+b,1,1,'#fff');
 for(let i=0;i<5;i++)R(cx-5+i*2,0+b+(i%2),2,3,'h');L(cx-3,2+b,cx-6,-2+b,'#f0e8d0');L(cx+3,2+b,cx+5,-2+b,'#f0e8d0');
 R(cx+11,2+b,4,18,'#3a3a44');R(cx+12,2+b,2,18,'#5a5a66');for(let y=4;y<18;y+=4){R(cx+10,y+b,1,1,'#c8c8d0');R(cx+15,y+2+b,1,1,'#c8c8d0');}R(cx+9,17+b,4,3,'s');}};
// SHIELDER: a big wooden tate shield with a painted crest held in front, iron helmet, a short spear over the top
FOE2.shielder={draw:A=>{const {R,b,cx,sh,C}=A;
 f2legs(A,{leg:'d'});f2torso(A,{torso:'c',plates:1,belt:'a'});f2arms(A,{sleeve:'d',front:false});f2face(A,{});
 R(cx-4,2+b,9,4,'#5a5a66');R(cx-5,5+b,11,1,'#3a3a44');R(cx-3,2+b,6,1,'#8a8a96');R(cx,0+b,1,2,'#8a8a96');
 yari(A,cx+5,0,14);
 R(cx+3,8+b,8,19,'#7a5a3a');R(cx+3,8+b,1,19,'#5a3a22');R(cx+10,8+b,1,19,'#9a7a50');for(const y of [11,23])R(cx+3,y+b,8,1,'#3a2a1a');
 R(cx+5,14+b,4,4,'a');R(cx+6,15+b,2,2,'#f0e8d0');}};
// BANDIT: a knotted headband, scruffy hair, an open vest over a bare chest, a heavy kama
FOE2.bandit={draw:A=>{const {R,L,b,cx,sh,C,f}=A;
 f2legs(A,{leg:'#5a4a3a'});f2torso(A,{torso:'s',belt:'#3a2a1a'});R(cx-5,12+b,3,8,'c');R(cx+3,12+b,3,8,'c');R(cx-5,12+b,1,8,sh('c'));L(cx-1,13+b,cx+1,17+b,'#a04030');
 f2arms(A,{sleeve:'s',raise:1});f2face(A,{brow:'#14101a'});
 for(let i=0;i<5;i++)R(cx-4+i*2,2+b+(i%2),2,3,'#2a1a10');R(cx-4,5+b,8,1,'a');L(cx-4,5+b,cx-8,8+b+f,'a');R(cx-2,10+b,4,1,'#3a2a1a');
 R(cx+9,5+b,1,8,'#6a4a2a');L(cx+9,5+b,cx+13,4+b,'#e8eef6');L(cx+13,4+b,cx+13,7+b,'#e8eef6');}};
