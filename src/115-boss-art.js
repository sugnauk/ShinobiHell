'use strict';
// ===== BOSS ART, redrawn to the standard of the Earth Spider =====
// Bigger canvases, five-tone palettes per material, volume from layered shapes, rim light and small details.
// Frames: 0 idle, 1 breathing (b=1), 2 attacking (atk). ARTHURT = drawing the second form.

// AKAGANE, THE RED OX: a towering warlord in red-lacquered laced armour, ox-horned helmet and oni mask, a war banner
// with his ox crest on his back and a great naginata. Second form: the helmet is off - a wild mane and red headband,
// cracked chest plates, one shoulder guard torn away, the banner ripped, eyes blazing.
BART['AKAGANE, THE RED OX']=Object.assign(p=>{const {R,E,L,b,atk}=p,two=ARTHURT;
 const R0='#2a0806',R1='#5a1008',R2='#8a1a10',R3='#b8281a',R4='#e04a30',G0='#5a3a10',G1='#a07020',G2='#e0b040',G3='#fff0a0',
  K0='#0e0c12',K1='#1e1a24',K2='#3a3440',K3='#5a5466',S1='#8a5a3a',S2='#c08860',S3='#e8b088',H1='#a89880',H2='#e8dcc0',H3='#fff8e8';
 const cx=34,ft=74,by=b; // body bobs by 1px on the breathing frame
 // laced plates: a band of lamellar rows with gold lacing
 const lam=(x,y,w,h,rows,base,dark,lite)=>{R(x,y,w,h,dark);for(let r=0;r<rows;r++){const yy=y+Math.round(r*h/rows);R(x,yy,w,Math.max(1,Math.round(h/rows)-1),base);R(x,yy,w,1,lite);for(let k=x+1;k<x+w-1;k+=3)R(k,yy+1,1,1,G1);}};
 // ---- the war banner on his back (torn in the second form)
 R(52,2,2,44,K1);R(52,2,1,44,K2);R(50,4,6,2,G1);
 if(!two){R(54,6,14,26,R2);R(54,6,14,1,R4);R(54,6,1,26,R3);R(55,31,13,1,R1);E(61,17,4,4,G1);E(61,17,3,3,G2);R(57,13,2,3,H2);R(64,13,2,3,H2);R(60,19,3,1,R1);R(59,27,5,2,G2);}
 else{R(54,6,9,13,R2);R(54,6,9,1,R4);for(let i=0;i<5;i++)R(55+i*2,19+(i%2)*3,2,3+(i%3),R2);R(63,8,3,6,R1);}
 // ---- legs: iron greaves over dark hakama, wide stance
 for(const [lx,dir] of [[24,-1],[42,1]]){R(lx-4,58+by,9,8,'#2a1a14');R(lx-4,58+by,9,1,'#3a2a20');
  R(lx-4,64,9,8,K1);R(lx-4,64,2,8,K2);R(lx-3,65,1,6,K3);for(let y=65;y<71;y+=2)R(lx-1,y,5,1,G1);
  R(lx-6+dir,71,12,3,K0);R(lx-5+dir,71,10,1,K2);}
 // ---- kusazuri: the plated skirt
 lam(18,46+by,32,13,4,R3,R0,R4);R(18,46+by,1,13,R1);R(49,46+by,1,13,R1);for(let x=22;x<48;x+=8)R(x,46+by,1,13,R1);
 // ---- the do: a broad chest of laced plates with the ox crest
 E(cx,37+by,15,11,R0);E(cx,36+by,14,10,R2);lam(21,30+by,27,15,5,R3,R1,R4);E(cx-4,33+by,6,4,R4);R(cx-6,31+by,3,1,'#ff8060');
 R(19,44+by,31,3,K1);R(19,44+by,31,1,K3);R(cx-2,44+by,5,3,G2); // obi and buckle
 if(!two){E(cx,37+by,3,3,G1);E(cx,37+by,2,2,G2);R(cx-3,34+by,1,2,H2);R(cx+3,34+by,1,2,H2);R(cx,36+by,1,1,G3);}
 else{L(cx-6,31+by,cx+2,40+by,K0,1);L(cx+2,40+by,cx-2,45+by,K0,1);L(cx+5,32+by,cx+8,38+by,K0,1);R(cx-4,35+by,6,4,S2);R(cx-3,35+by,4,1,S3);R(cx-2,37+by,2,1,S1);}
 // ---- arms in black mail with gold-edged plates, big gauntleted fists
 const arm=(sx,hx,hy)=>{L(sx,29+by,hx,hy,R0,7);L(sx,29+by,hx,hy,R2,5);L(sx-1,28+by,hx-1,hy-1,R4,1);const mx=(sx+hx)/2,my=(29+by+hy)/2;R(mx-3,my,6,2,G1);E(hx,hy,3,3,K0);E(hx,hy-1,2,2,K2);R(hx-3,hy-3,6,1,G2);};
 // ---- the great naginata (behind the near arm when held, swung across when attacking)
 const nag=(x0,y0,x1,y1)=>{L(x0,y0,x1,y1,K1,3);L(x0,y0-1,x1,y1-1,'#6a4a2a',1);const a=Math.atan2(y1-y0,x1-x0),bx=x1+Math.cos(a)*14,by2=y1+Math.sin(a)*14;
  L(x1,y1,bx,by2,'#9aa4b4',3);L(x1,y1-1,bx,by2-1,'#e8eef6',1);L(bx,by2,bx+Math.cos(a+1.2)*4,by2+Math.sin(a+1.2)*4,'#e8eef6',2);R(x1-2,y1-2,5,4,G1);R(x1-1,y1-2,3,1,G2);};
 if(atk)nag(4,60,50,14);else nag(46,70,50,8);
 // ---- sode: the great shoulder guards (the near one is torn off in the second form)
 const sode=(x,lean)=>{for(let r=0;r<5;r++){const yy=24+by+r*3;R(x+lean*r,yy,11,3,r%2?R3:R2);R(x+lean*r,yy,11,1,R4);R(x+lean*r+2,yy+1,1,1,G1);R(x+lean*r+6,yy+1,1,1,G1);R(x+lean*r+10,yy,1,3,R1);}R(x,23+by,11,1,G2);};
 sode(12,-1);if(!two)sode(45,1);else{R(46,25+by,5,4,K1);R(47,26+by,3,1,K3);}
 if(atk){arm(22,20,46);arm(46,40,26);}else{arm(21,17,47);arm(47,50,42);}
 // ---- head
 const hx=cx,hy=12+by;
 if(!two){
  // shikoro (neck guard) flaring behind
  for(let r=0;r<4;r++)R(hx-11-r,hy+6+r*3,23+r*2,3,r%2?R2:R3),R(hx-11-r,hy+6+r*3,23+r*2,1,R4);
  // the great ox horns, sweeping out and up
  for(const s of [-1,1]){L(hx+s*7,hy+2,hx+s*17,hy-2,H1,4);L(hx+s*17,hy-2,hx+s*21,hy-10,H1,3);L(hx+s*21,hy-10,hx+s*19,hy-16,H2,2);
   L(hx+s*8,hy+1,hx+s*17,hy-3,H2,2);L(hx+s*17,hy-3,hx+s*20,hy-10,H3,1);R(hx+s*19-1,hy-17,2,2,H3);}
  // iron bowl with gold rivets and a gold crescent crest
  E(hx,hy,9,7,K0);E(hx,hy-1,8,6,K1);E(hx-2,hy-3,4,3,K2);for(let i=-6;i<=6;i+=3)R(hx+i,hy+1,1,1,G2);
  L(hx-5,hy-7,hx-2,hy-10,G2,2);L(hx+5,hy-7,hx+2,hy-10,G2,2);R(hx-2,hy-11,5,2,G1);R(hx-1,hy-12,3,1,G3);
  // fukigaeshi turn-backs and the oni mask
  R(hx-11,hy+2,4,4,R3);R(hx+8,hy+2,4,4,R3);R(hx-11,hy+2,4,1,R4);R(hx+8,hy+2,4,1,R4);
  E(hx,hy+7,6,5,R2);E(hx,hy+6,5,4,R3);R(hx-4,hy+4,3,1,K0);R(hx+2,hy+4,3,1,K0);R(hx-3,hy+4,1,1,atk?'#ffffff':'#ffd040');R(hx+3,hy+4,1,1,atk?'#ffffff':'#ffd040');
  R(hx-3,hy+9,7,2,K0);R(hx-3,hy+9,1,2,H3);R(hx+3,hy+9,1,2,H3);R(hx-1,hy+10,1,1,H2);R(hx+1,hy+10,1,1,H2);R(hx-1,hy+6,3,1,R1);
  R(hx-4,hy+12,9,3,K1);for(let i=-3;i<=3;i+=2)R(hx+i,hy+12,1,3,K2); // throat guard
 }else{
  // a wild black mane, red headband with trailing tails, scarred face, blazing eyes, bared teeth
  E(hx,hy+1,9,6,K0);const sp=[[-9,-2,-14,-4],[-7,-4,-10,-10],[-4,-5,-5,-12],[0,-6,1,-11],[4,-5,7,-11],[7,-3,12,-8],[9,0,15,-1],[-10,2,-15,5],[9,4,13,9]];for(const [a1,b1,a2,b2] of sp)L(hx+a1,hy+b1,hx+a2,hy+b2,K0,2);E(hx-2,hy-2,4,2,K1);
  E(hx,hy+6,6,7,S2);E(hx-1,hy+5,5,5,S3);R(hx-6,hy+6,1,5,S1);
  R(hx-8,hy+1,17,3,'#e02818');R(hx-8,hy+1,17,1,'#ff6040');L(hx-8,hy+2,hx-16,hy+8+b,'#e02818',2);L(hx-8,hy+3,hx-14,hy+12,'#a01810',1);
  R(hx-4,hy+6,3,1,K0);R(hx+2,hy+6,3,1,K0);R(hx-3,hy+6,1,1,'#ff3020');R(hx+3,hy+6,1,1,'#ff3020');E(hx-3,hy+6,2,1,'rgba(255,60,30,.35)');
  L(hx+2,hy+3,hx+5,hy+9,R1,1); // the scar
  R(hx-3,hy+10,7,2,R0);R(hx-3,hy+10,7,1,H3);R(hx-2,hy+11,1,1,H3);R(hx+2,hy+11,1,1,H3);
  E(hx,hy+13,4,2,K0); // beard
 }
},{fw:72,fh:76,raw:1,sc:1.1});
