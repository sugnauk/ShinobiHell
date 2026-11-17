'use strict';
// ===== SECOND PASS on five guardians: bigger silhouettes, stronger contrast, more detail =====
// Overrides the 117 versions of Itohime, Onikuma, Kage, Lord Kurogane (mounted and on foot) and the Emperor.

// ---------------------------------------------------------------- III. ITOHIME, THE WIRE WEAVER
// A spider-clan matriarch in a wide violet furisode printed with a white web, a red obi, a high black bun stuck with
// eight spider-leg hairpins, and a harness of four great arched steel legs rising behind her shoulders like a spider's.
// Wires run between her fingers in a cat's cradle. Second form: two legs snapped, the bun fallen loose, the kimono torn,
// eyes burning red.
function ito2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,hand,face,by}=K,two=ARTHURT,cx=36;
 const V='#4a2a6e',V2='#6a3c92',V3='#9468c0',WEB='#e0d4f4',RD='#b81e30',RD2='#ff5060',GD='#e0b040',S1='#4a4458',S2='#8a8498',S3='#d0ccdc',SK='#f2e0d6',HR='#141018';
 // the four harness legs, arched high behind her
 const lift=Q.lift?-5:0,legs=[[-1,[24,4],[8,34]],[-1,[18,14],[4,58]],[1,[48,4],[64,34]],[1,[54,14],[68,58]]];
 legs.forEach(([s,[kx,ky],[tx,ty]],i)=>{const bx=cx+s*5,byy=26+by,broke=two&&(i===0||i===3);ky+=lift+by;
  seg(bx,byy,kx,ky,4,S1);L(bx-1,byy-1,kx-1,ky-1,S2,1);E(kx,ky,3,3,OUTC);E(kx,ky,2,2,GD);
  if(broke){const mx=(kx+tx)/2,my=(ky+ty)/2;seg(kx,ky,mx,my-4,3,S2);R(mx-1,my-6,3,3,RD2);L(mx,my-4,mx+s*2,my+4,S1,1);}
  else{seg(kx,ky,tx,ty+lift,3,S2);L(kx-1,ky,tx-1,ty+lift,S3,1);L(tx,ty+lift,tx+s*1,ty+lift+5,S3,1);R(tx-1,ty+lift-1,2,2,OUTC);}});
 // the furisode: a wide bell to the floor, web printed
 trap(cx,26+by,73,9,19,V,{});R(cx-19,72,39,1,OUTC);
 {const wx=cx-8,wy=66;for(let i=0;i<7;i++){const a=-Math.PI+i/6*Math.PI;L(wx,wy,wx+Math.cos(a)*16,wy+Math.sin(a)*14,WEB,1);}
  for(const r of [5,10,15])for(let i=0;i<6;i++){const a0=-Math.PI+i/6*Math.PI,a1=a0+Math.PI/6;L(wx+Math.cos(a0)*r,wy+Math.sin(a0)*r*.9,wx+Math.cos(a1)*r,wy+Math.sin(a1)*r*.9,WEB,1);}
  for(const [x,y] of [[cx+10,48],[cx+12,60],[cx+5,54]]){R(x,y+(y<50?by:0),1,1,WEB);}}
 if(two)for(const [x,w] of [[-17,4],[-6,3],[7,5],[14,3]]){R(cx+x,68,w,5,'#1e1428');R(cx+x,68,w,1,V3);}
 // the white under-collar crossing, the obi with its gold cord and a red tassel
 L(cx,26+by,cx-5,40+by,'#f4f0f8',2);L(cx,26+by,cx+5,40+by,'#f4f0f8',2);
 R(cx-10,39+by,21,7,OUTC);R(cx-9,40+by,19,5,RD);R(cx-9,40+by,19,1,RD2);R(cx-9,42+by,19,1,GD);R(cx-2,40+by,5,5,'#7a1020');R(cx-1,41+by,3,3,GD);L(cx+3,46+by,cx+6,56+by,RD,2);R(cx+5,56+by,3,3,RD2);
 // long sleeves hanging from the arms
 const far=Q.far||[[28,29],[25,38],[32,42]],near=Q.near||[[44,29],[47,38],[40,42]];
 const sl=(A)=>{const [[a,b],[c,d]]=A;trap(c,d+by-3,d+by+18,4,7,V2);R(c-7,d+by+18,15,1,V3);for(let k=0;k<3;k++)R(c-4+k*3,d+by+6+k*4,2,1,WEB);};
 sl(far);K.arm(far,V2,V2,SK,4);sl(near);K.arm(near,V2,V2,SK,4);
 // the wires: a cat's cradle between her hands, or fanned out taut to strike
 const [f0,f1]=far[2],[n0,n1]=near[2];
 if(Q.wires==='taut'){for(const [hx,hy,s] of [[f0,f1,-1],[n0,n1,1]])for(let k=0;k<5;k++){L(hx,hy+by,hx+s*(26-k*2),hy+by-16+k*9,'#f0f4ff',1);R(hx+s*(26-k*2),hy+by-16+k*9,1,1,'#ffffff');}}
 else{for(const [a,b] of [[-2,-3],[0,0],[2,3],[-1,4],[1,-4]])L(f0,f1+by+a,n0,n1+by+b,'#f0f4ff',1);R(Math.round((f0+n0)/2),Math.round((f1+n1)/2)+by,1,1,'#ffffff');}
 // head: the face with red eye-lines, the bun with spider-leg pins
 const hx=cx,hy=17+by;
 if(!two){E(hx,hy-8,7,5,OUTC);E(hx,hy-8,6,4,HR);E(hx-2,hy-10,2,1,'#3a2a48');for(const s of [-1,1])for(let k=0;k<4;k++){const a=-1.57+s*(.5+k*.32);L(hx+Math.cos(a)*4,hy-8+Math.sin(a)*3,hx+Math.cos(a)*12,hy-8+Math.sin(a)*9-(k<2?2:0),GD,1);}R(hx-1,hy-14,3,2,RD);}
 else{for(const [a,b] of [[-13,8],[-15,18],[-10,26],[13,9],[15,19],[10,26],[-6,-8],[6,-8]])L(hx,hy-6,hx+a,hy+b,HR,3);}
 E(hx,hy+1,7,8,OUTC);E(hx,hy+1,6,7,HR);
 face(hx,hy+2,SK,{eye:two?'#ff3030':OUTC,mouth:'#c02040',brow:HR});R(hx-4,hy+2,1,1,RD);R(hx+5,hy+2,1,1,RD);R(hx-6,hy-3,13,3,HR);R(hx-6,hy-2,2,9,HR);R(hx+5,hy-2,2,9,HR);
 if(two){R(hx-3,hy+1,2,1,'#ff8080');R(hx+2,hy+1,2,1,'#ff8080');}}
humBoss('ITOHIME, THE WIRE WEAVER',ito2,{idle0:{},idle1:{b:1},
 atk:{lift:1,wires:'taut',far:[[28,29],[18,30],[12,26]],near:[[44,29],[54,30],[60,26]]}});

// ---------------------------------------------------------------- VIII. ONIKUMA, THE JAILER
// A giant warden: a whole bear's pelt worn as a hood and cape - the snout over his brow, the fangs hanging past his
// shadowed face, the forepaws knotted on his chest - over black iron lamellar laced in red, a ring of jail keys, and a
// studded iron kanabo resting on his shoulder on its chain. Second form: an old sumo wrestler - topknot, a vast scarred
// belly, a dark mawashi with hanging tassels, shackles and chain wound round both fists.
function oni2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,leg,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const I1='#26262e',I2='#3e3e4a',I3='#62627a',LC='#a0202a',LC2='#d04040',F1='#3e2616',F2='#5e3c22',F3='#86603a',F4='#b08a5a',SK='#c88a68',SK2='#e0a882',SK3='#9a6448',CH='#9a9aa8',CH2='#d0d0dc',GD='#c0a040';
 const lam=(x,y,w,h,rows)=>{R(x-1,y-1,w+2,h+2,OUTC);for(let r=0;r<rows;r++){const yy=y+Math.round(r*h/rows),hh=Math.max(1,Math.round(h/rows)-1);R(x,yy,w,hh,I2);R(x,yy,w,1,I3);R(x+w-3,yy,3,hh,I1);for(let k=x+2;k<x+w-2;k+=4)R(k,yy+hh-1,2,1,LC);}};
 if(!two){
  // the bear's back and the pelt cape
  trap(cx,14+by,58,14,20,F1);for(let i=0;i<9;i++)L(cx-18+i*4.5,50,cx-19+i*4.5,58,F2,2);
  // legs: iron greaves, straw sandals
  leg(30,54,28,63,27,73,I1,I2,'#3a2a1a',8);leg(42,54,45,63,46,73,I1,I2,'#3a2a1a',8);for(const x of [27,46])for(let y=60;y<70;y+=3)R(x-3,y,7,1,I3);
  // lamellar skirt and cuirass, red laced
  lam(cx-15,44+by,31,14,4);lam(cx-13,24+by,27,20,6);R(cx-14,42+by,29,3,'#5a1a18');R(cx-14,42+by,29,1,LC2);
  // keys at the belt
  E(cx-9,48+by,4,4,OUTC);E(cx-9,48+by,3,3,GD);E(cx-9,48+by,2,2,I1);for(let i=0;i<3;i++){R(cx-12+i*3,51+by,1,6,'#e0c050');R(cx-12+i*3,56+by,2,1,'#e0c050');}
  // the forepaws knotted across the chest, claws hanging
  L(cx-12,26+by,cx,34+by,F2,5);L(cx+12,26+by,cx,34+by,F2,5);E(cx,34+by,4,3,F3);for(const s of [-1,1])for(let k=0;k<3;k++)L(cx+s*(2+k*2),36+by,cx+s*(2+k*2),40+by,'#e8e0d0',1);
  // arms: armoured, huge
  const far=Q.far||[[20,28],[16,40],[19,50]],near=Q.near||[[52,28],[57,38],[54,46]];
  K.arm(far,I2,I1,SK,7);K.arm(near,I2,I1,SK,7);for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;for(let t=.3;t<.9;t+=.25)R(c+(e-c)*t-3,d+by+(f-d)*t,7,1,I3);}
  // shoulder plates
  for(const s of [-1,1]){const x=cx+s*16;R(x-6,24+by,13,10,OUTC);for(let r=0;r<3;r++){R(x-5,25+r*3+by,11,2,I2);R(x-5,25+r*3+by,11,1,I3);R(x-4+(s>0?0:6),26+r*3+by,4,1,LC);}}
  // the kanabo: on the shoulder, or raised high
  const [hx2,hy2]=near[2],kb=Q.club||[[hx2,hy2],[40,-2]];const [[k0,k1],[k2,k3]]=kb;
  L(k0,k1+by,k2,k3+by,OUTC,8);L(k0,k1+by,k2,k3+by,I2,6);L(k0-1,k1+by-1,k2-1,k3+by-1,I3,2);for(let i=1;i<8;i++){const t=.25+i*.1,x=k0+(k2-k0)*t,y=k1+by+(k3-k1)*t;R(x-3,y-1,2,2,CH2);R(x+2,y,2,2,CH2);}
  R(k0-2,k1+by-2,5,5,'#5a3a20');for(let i=0;i<6;i++){const t=i/6;R(hx2-4+Math.round((far[2][0]-hx2+4)*0)+i*0,0,0,0,CH);}
  for(let i=0;i<7;i++)R(k0-2+i,k1+by+3+Math.round(Math.sin(i*.9)*2),2,2,i%2?CH:CH2);
  // the bear's head as a hood: ears, snout, fangs; his face in its shadow
  const hx=cx,hy=14+by;E(hx,hy,15,12,OUTC);E(hx,hy,14,11,F2);E(hx-4,hy-4,8,5,F3);E(hx-6,hy-6,3,2,F4);
  for(const s of [-1,1]){E(hx+s*12,hy-9,4,4,OUTC);E(hx+s*12,hy-9,3,3,F2);R(hx+s*12-1,hy-9,2,2,F1);}
  E(hx,hy+4,9,7,OUTC);E(hx,hy+4,8,6,'#1a1210');R(hx-4,hy+2,2,1,'#ffd040');R(hx+3,hy+2,2,1,'#ffd040');R(hx-4,hy+1,2,1,'#806020');R(hx+3,hy+1,2,1,'#806020');
  for(let i=-3;i<=3;i+=2)L(hx+i,hy+6,hx+i,hy+10,'#3a2a20',1);
  E(hx,hy-2,7,4,OUTC);E(hx,hy-2,6,3,F3);E(hx,hy+1,4,2,F2);R(hx-2,hy-2,5,2,OUTC);R(hx-1,hy-3,2,1,'#5a5a64');
  for(const s of [-1,1]){L(hx+s*3,hy+1,hx+s*3,hy+6,'#f0e8d8',2);R(hx+s*3,hy+6,1,1,'#ffffff');}
  for(let i=0;i<10;i++){const a=Math.PI*.1+i/9*Math.PI*.8;R(hx+Math.cos(a)*14,hy-2+Math.sin(a)*-1-8,1,2,F3);}}
 else{
  // shackled legs, the mawashi and its tassels
  leg(29,54,27,63,26,73,SK,SK,'#3a2a1a',9);leg(43,54,46,63,47,73,SK,SK,'#3a2a1a',9);for(const x of [26,47]){R(x-4,64,9,3,OUTC);R(x-3,64,7,2,I2);R(x-3,64,7,1,I3);}
  // the body: a huge belly with real shading
  E(cx,40+by,17,15,OUTC);E(cx,40+by,16,14,SK);E(cx-5,35+by,9,8,SK2);E(cx+7,44+by,8,9,SK3);E(cx,46+by,11,6,SK);E(cx-3,44+by,5,3,SK2);R(cx,44+by,1,1,SK3);
  E(cx-6,30+by,6,4,SK2);E(cx+6,30+by,6,4,SK);R(cx-1,27+by,2,8,SK3);
  for(const [a,b,c,d] of [[-10,32,-3,38],[6,36,11,30],[-8,46,-1,50]])L(cx+a,b+by,cx+c,d+by,'#8a3a2a',1);
  R(cx-15,50+by,31,7,OUTC);R(cx-14,51+by,29,5,'#2a2a44');R(cx-14,51+by,29,1,'#4a4a6a');R(cx-3,51+by,7,10,'#2a2a44');
  for(let i=0;i<7;i++){const x=cx-12+i*4;R(x,56+by,2,7,'#3a3a5a');R(x,62+by,2,1,'#6a6a8a');}
  // arms: thick, chains round the fists
  const far=Q.far||[[21,30],[15,42],[18,52]],near=Q.near||[[51,30],[57,42],[54,52]];
  K.arm(far,SK,SK,SK2,8);K.arm(near,SK,SK,SK2,8);
  for(const A of [far,near]){const [x,y]=A[2];for(let i=0;i<4;i++)R(x-4,y+by-6+i*2+(i%2),9,1,i%2?CH:CH2);E(x,y+by,4,3,OUTC);E(x,y+by,3,2,SK2);}
  // head: oiled topknot, heavy brow, a scar, a snarl
  const hx=cx,hy=16+by;face(hx,hy,SK,{eye:OUTC,brow:'#1a1010',mouth:'#5a1a10',ey:0});E(hx-1,hy-1,3,3,SK2);R(hx-3,hy,2,1,'#ff4030');
  R(hx-5,hy-6,11,3,'#1a1010');R(hx-2,hy-10,5,4,'#1a1010');R(hx-1,hy-12,3,2,'#2a2028');R(hx+2,hy-9,1,1,'#5a5a6a');L(hx+2,hy-4,hx+5,hy+5,'#8a3a2a',1);
  R(hx-6,hy-1,1,4,SK3);R(hx+6,hy-1,1,4,SK3);}}
humBoss('ONIKUMA, THE JAILER',oni2,{idle0:{},idle1:{b:1},
 atk:{dy:-1,near:[[52,28],[56,16],[52,6]],club:[[52,6],[26,-4]],far:[[20,28],[13,36],[11,46]]}},{sc:1.15});

// ---------------------------------------------------------------- IX. KAGE, THE SHINOBI MASTER
// The crow of the castle roofs: a black-feathered cape over charcoal-blue shinobi garb, a lacquered karasu-tengu crow
// mask with a long beak and red rims, a red scarf, a ninjato hilt over his shoulder, shuriken at his belt. Second form:
// the beak snapped off to show a scarred face and red eyes, the cape torn, both blades drawn.
function kag2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,leg,lt,dk,by}=K,two=ARTHURT,cx=36;
 const C1='#1c2030',C2='#2e3448',C3='#4a5474',C4='#6a7aa4',FE='#121218',FE2='#26283a',FE3='#3e4462',FE4='#6878a8',RD='#c02030',RD2='#ff5060',ST='#c8d0e0',GD='#e0b040';
 const fl=Q.flare||0;
 // the feather cape, jagged, flaring out behind
 const capeW=y=>Math.round(10+(y-24)*.45+fl*(y-24)*.12);
 for(let y=23;y<=58;y++){const w=capeW(y)+1;R(cx-w,y+(y<40?by:0),w*2+1,1,OUTC);}
 for(let y=24;y<=57;y++){const w=capeW(y);R(cx-w,y+(y<40?by:0),w*2+1,1,FE);R(cx-w,y+(y<40?by:0),Math.round(w*.4),1,FE2);}
 for(let r=0;r<6;r++){const y=28+r*5;const w=capeW(y);for(let x=-w;x<=w;x+=3){const xx=cx+x,yy=y+(y<40?by:0)+((x/3)%2?1:0);R(xx,yy,2,3,r%2?FE2:FE3);R(xx,yy,1,1,FE4);}}
 {const w=capeW(58);for(let x=-w;x<=w;x+=3){const h=2+((x*7)%5+5)%5;R(cx+x,58,2,h,OUTC);R(cx+x,58,1,h-1,FE2);}}
 if(two)for(const [x,y] of [[-14,46],[10,38],[-6,54],[15,52]]){R(cx+x,y,4,3,'#00000000'===0?0:'#2a2030');}
 // legs
 const lg=Q.legs||'stand';
 if(lg==='stand'){leg(32,48,30,60,28,72,C1,C2,'#14141e',5);leg(40,48,43,60,45,72,C1,C2,'#14141e',5);}
 else{leg(32,48,24,57,19,70,C1,C2,'#14141e',5);leg(40,48,48,58,53,72,C1,C2,'#14141e',5);}
 for(const [x,y0] of (lg==='stand'?[[29,61],[44,61]]:[[22,61],[50,61]]))for(let y=y0;y<70;y+=3)R(x-2,y,5,1,C3);
 // body: wrapped jacket, a belt of shuriken
 trap(cx,24+by,48+by,7,8,C2);L(cx-6,25+by,cx+4,40+by,C3,2);L(cx-5,25+by,cx+5,40+by,C4,1);
 R(cx-8,41+by,17,4,OUTC);R(cx-7,42+by,15,2,'#3a3040');for(let i=0;i<3;i++){const x=cx-5+i*5,y=43+by;R(x-1,y,3,1,ST);R(x,y-1,1,3,ST);}
 // the ninjato hilt over his right shoulder
 if(!two){L(cx+5,24+by,cx+14,10+by,OUTC,4);L(cx+5,24+by,cx+14,10+by,'#3a2a20',2);for(let i=0;i<4;i++)R(cx+7+i*2,20-i*3+by,2,1,RD);R(cx+3,25+by,5,2,GD);}
 // arms
 const far=Q.far||[[29,27],[25,37],[28,44]],near=Q.near||[[43,27],[48,36],[45,44]];
 K.arm(far,C2,C1,FE2,4);K.arm(near,C2,C1,FE2,4);for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;for(let k=1;k<3;k++){const t=k/3;R(c+(e-c)*t-2,d+by+(f-d)*t,4,1,C3);}}
 const bl=(h,a,len)=>{const [x,y]=h;L(x,y+by,x+Math.cos(a)*len,y+by+Math.sin(a)*len,OUTC,3);L(x,y+by,x+Math.cos(a)*len,y+by+Math.sin(a)*len,ST,1);R(x-1,y+by-1,3,3,'#2a2a34');};
 if(two){bl(near[2],Q.ba!=null?Q.ba:.5,22);bl(far[2],Q.bb!=null?Q.bb:2.6,20);}
 if(Q.star){for(const [x,y] of Q.star){for(const a of [.4,1.97])L(x-Math.cos(a)*3,y-Math.sin(a)*3+by,x+Math.cos(a)*3,y+Math.sin(a)*3+by,ST,1);R(x,y+by,1,1,OUTC);}}
 // the red scarf
 for(let i=0;i<(two?8:16);i+=2){const x=cx-5-i,y=24+by+Math.sin(i*.35+(Q.wind||0))*2+i*.25;R(x-1,y-1,4,4,OUTC);R(x,y,3,2,i%4?RD:RD2);}
 E(cx,24+by,5,2,OUTC);E(cx,24+by,4,1,RD);
 // head: the hood and the crow mask
 const hx=cx,hy=16+by;E(hx,hy,7,8,OUTC);E(hx,hy,6,7,C2);E(hx-2,hy-3,3,3,C3);
 if(!two){R(hx-5,hy-2,11,6,OUTC);R(hx-4,hy-1,9,4,'#1a1418');R(hx-4,hy-1,9,1,'#3a2a34');R(hx-4,hy,3,2,RD);R(hx+2,hy,3,2,RD);R(hx-3,hy,1,1,GD);R(hx+3,hy,1,1,GD);
  // the beak, pointing down and forward
  for(let i=0;i<8;i++){const w=Math.max(1,4-Math.floor(i/2));R(hx-1+i*.6,hy+3+i,w+1,1,OUTC);}for(let i=0;i<7;i++){const w=Math.max(1,3-Math.floor(i/2));R(hx-1+i*.6,hy+3+i,w,1,i<2?'#3a2a34':'#1a1418');}R(hx-1,hy+3,1,4,'#5a4a54');}
 else{R(hx-5,hy-1,11,7,OUTC);R(hx-4,hy,9,5,'#d8b090');R(hx-3,hy+1,2,1,'#ff3030');R(hx+2,hy+1,2,1,'#ff3030');L(hx-3,hy-1,hx+2,hy+5,'#8a3a2a',1);R(hx-1,hy+4,3,1,'#5a2a20');R(hx+3,hy-1,3,3,'#1a1418');R(hx+5,hy+1,2,2,'#1a1418');}
 // feathers of the hood crest
 for(let k=0;k<4;k++)L(hx-2+k*2,hy-6,hx-6+k,hy-12-k%2*2,FE3,1);}
humBoss('KAGE, THE SHINOBI MASTER',kag2,{idle0:{},idle1:{b:1,wind:1.5},
 atk:{legs:'lunge',flare:1,wind:3,near:[[43,27],[55,22],[63,16]],far:[[29,27],[22,33],[16,38]],ba:-.7,bb:2.7,star:[[67,10],[60,4]]}});

// ---------------------------------------------------------------- XI. LORD KUROGANE, THE BLACK HORSE GENERAL
// Yamikaze, a black warhorse with a silver mane and tail, red lacquered plates on chest and rump and a horned gold
// chamfron; on his back the general in black armour with broad shoulder guards, a great gold crescent crest, a red mask,
// a long yari, and a red horo - the balloon cape of a messenger-general - billowing behind him.
const KG2={H1:'#1e1e2a',H2:'#323246',H3:'#4c4c68',H4:'#7a7aa0',MN:'#c8ccdc',MN2:'#8a90a8',BK:'#18181e',BK2:'#2c2c38',BK3:'#4a4a5c',RD:'#a01818',RD2:'#d03028',RD3:'#ff6050',GD:'#d0a840',GD2:'#f4d870',SK:'#c8a080'};
function kur2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,by}=K,{H1,H2,H3,H4,MN,MN2,BK,BK2,BK3,RD,RD2,RD3,GD,GD2,SK}=KG2,g=Q.gallop;
 // the tail, flowing silver
 const tl=g?[[22,34],[14,32],[7,35],[2,41]]:[[21,34],[16,40],[14,50],[14,60]];for(let i=0;i<tl.length-1;i++){L(tl[i][0],tl[i][1]+by,tl[i+1][0],tl[i+1][1]+by,OUTC,5);}
 for(let i=0;i<tl.length-1;i++){L(tl[i][0],tl[i][1]+by,tl[i+1][0],tl[i+1][1]+by,MN2,3);L(tl[i][0]-1,tl[i][1]+by,tl[i+1][0]-1,tl[i+1][1]+by,MN,1);}
 // legs: [top, knee, fetlock, hoof]; far pair first
 const leg=(a,b2,c,d,dim)=>{seg(a[0],a[1]+by,b2[0],b2[1],4,dim?H1:H2);seg(b2[0],b2[1],c[0],c[1],3,dim?H1:H2);seg(c[0],c[1],d[0],d[1]-1,2,dim?H1:H2);R(d[0]-2,d[1]-2,5,3,OUTC);R(d[0]-1,d[1]-2,3,2,'#5a5a64');if(!dim)L(b2[0]-1,b2[1],c[0]-1,c[1],H3,1);};
 const LG=g?{fh:[[32,42],[22,50],[14,56],[10,60]],ff:[[60,44],[70,46],[76,52],[80,52]],nh:[[34,42],[30,54],[24,60],[22,66]],nf:[[62,44],[66,54],[74,58],[78,58]]}
          :{fh:[[35,46],[38,54],[33,62],[34,70]],ff:[[59,48],[60,58],[60,65],[61,70]],nh:[[29,46],[33,55],[27,62],[28,70]],nf:[[64,48],[65,58],[66,65],[67,70]]};
 leg(...LG.fh,1);leg(...LG.ff,1);
 // barrel
 E(46,40+by,22,11,OUTC);E(46,40+by,21,10,H2);E(43,35+by,16,4,H3);E(40,32+by,9,1,H4);E(46,46+by,17,3,H1);E(30,38+by,12,11,OUTC);E(30,38+by,11,10,H2);E(27,34+by,6,4,H3);E(25,32+by,3,1,H4);E(63,40+by,9,9,H2);E(62,36+by,4,3,H3);
 // rump and chest plates of red lacquer
 const plate=(x,y,w,h)=>{R(x-1,y-1,w+2,h+2,OUTC);for(let r=0;r<h;r+=3){R(x,y+r,w,2,(r/3)%2?RD:RD2);R(x,y+r,w,1,RD3);}R(x,y+h-1,w,1,GD);};
 plate(24,40+by,13,8);plate(60,42+by,9,8);
 // saddle, stirrup
 R(40,30+by,14,4,OUTC);R(41,30+by,12,3,'#5a1818');R(41,30+by,12,1,GD);L(47,34+by,47,46+by,'#3a2a1a',1);R(45,46+by,4,2,GD);
 leg(...LG.nh,0);leg(...LG.nf,0);
 // neck, mane and head with the chamfron
 const hd=g?-3:0;
 seg(60,38+by,72,20+hd+by,10,H2);L(61,34+by,71,18+hd+by,H3,2);
 for(let i=0;i<7;i++){const t=i/6,x=60+t*12,y=33+by-t*16+hd;L(x,y,x-5,y+3+(i%2),OUTC,3);L(x,y,x-4,y+3+(i%2),i%2?MN:MN2,1);}
 const hx=74,hy=18+hd+by;seg(hx,hy,hx+12,hy+9,7,H2);E(hx,hy,5,5,OUTC);E(hx,hy,4,4,H2);E(hx+12,hy+9,3,3,OUTC);E(hx+12,hy+9,2,2,H1);
 R(hx-1,hy-7,2,4,OUTC);R(hx-1,hy-7,1,3,H3);
 seg(hx+1,hy+1,hx+10,hy+7,3,RD2);R(hx+2,hy,3,2,GD);L(hx+3,hy-1,hx+7,hy-8,GD2,1);L(hx+4,hy-1,hx+8,hy-8,GD,1);R(hx+3,hy+3,2,1,'#ff3030');R(hx+13,hy+9,1,1,'#ffffff');
 // the horo: a great red balloon cape billowing behind
 const rx=47,ry=16+by,hw=Q.horo||0;
 E(rx-13-hw,ry+2,11+hw,10,OUTC);E(rx-13-hw,ry+2,10+hw,9,RD);E(rx-16-hw,ry-2,6,5,RD2);E(rx-18-hw,ry-4,2,2,RD3);for(const a of [-.6,0,.6])L(rx-4,ry-4,rx-13-hw+Math.cos(a+3.14)*9,ry+2+Math.sin(a+3.14)*8,'#600c0c',1);
 L(rx-4,ry-6,rx-4,ry+10,'#3a2a1a',1);
 // the rider: legs astride, armour, shoulder guards
 seg(rx-2,ry+12,rx+3,ry+20,5,BK2);seg(rx+3,ry+20,rx+1,ry+28,4,BK);R(rx-1,ry+28,5,2,GD);
 trap(rx,ry,ry+14,6,8,BK);for(let y=ry+3;y<ry+14;y+=3)R(rx-7,y,15,1,BK3);R(rx-7,ry+10,15,2,RD);R(rx-2,ry+3,5,4,GD);
 for(const s of [-1,1]){const x=rx+s*9;R(x-4,ry-1,9,9,OUTC);for(let r=0;r<3;r++){R(x-3,ry+r*3,7,2,BK2);R(x-3,ry+r*3,7,1,BK3);}R(x-3,ry+8,7,1,GD);}
 // the yari
 if(Q.couch){L(rx-18,ry+14,rx+44,ry+4,OUTC,3);L(rx-18,ry+14,rx+44,ry+4,'#5a3a22',1);L(rx+40,ry+5,rx+50,ry+3,'#e8eef6',2);L(rx+40,ry+5,rx+43,ry+2,'#ffffff',1);seg(rx+5,ry+4,rx+12,ry+9,3,BK2);K.hand(rx+12,ry+9,SK);}
 else{L(rx+12,ry+28,rx+20,ry-22,OUTC,3);L(rx+12,ry+28,rx+20,ry-22,'#5a3a22',1);L(rx+20,ry-22,rx+21,ry-30,'#e8eef6',2);R(rx+18,ry-21,4,2,RD);seg(rx+5,ry+4,rx+14,ry+8,3,BK2);K.hand(rx+14,ry+8,SK);}
 // the helmet: black bowl, flared neck guard, gold crescent, red mask
 const hx2=rx,hy2=ry-6;E(hx2,hy2+3,5,4,OUTC);E(hx2,hy2+3,4,3,'#8a1818');R(hx2-2,hy2+2,1,1,'#ffd040');R(hx2+2,hy2+2,1,1,'#ffd040');R(hx2-2,hy2+5,5,1,'#f0e8d8');
 E(hx2,hy2-1,7,4,OUTC);E(hx2,hy2-1,6,3,BK);E(hx2-2,hy2-2,3,1,BK3);R(hx2-8,hy2+1,17,3,OUTC);R(hx2-7,hy2+1,15,2,BK2);
 for(const s of [-1,1]){L(hx2+s*1,hy2-4,hx2+s*10,hy2-13,OUTC,3);L(hx2+s*1,hy2-4,hx2+s*10,hy2-13,GD,1);R(hx2+s*10-1,hy2-14,2,2,GD2);}R(hx2-1,hy2-6,3,3,GD2);}
function kf2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,leg,by}=K,{BK,BK2,BK3,RD,RD2,RD3,GD,GD2,SK}=KG2,cx=36;
 // the torn horo behind
 E(cx-4,30+by,14,14,OUTC);E(cx-4,30+by,13,13,RD);E(cx-8,25+by,7,6,RD2);for(const [x,y,w,h] of [[-14,38,4,6],[-4,40,5,5],[6,36,4,7]])R(cx+x,y+by,w,h,'#3a0606');
 leg(31,52,28,62,27,73,BK,BK2,'#14141e',6);leg(41,52,45,62,46,73,BK,BK2,'#14141e',6);
 {const lam=(x,y,w,h,rows)=>{R(x-1,y-1,w+2,h+2,OUTC);for(let r=0;r<rows;r++){const yy=y+Math.round(r*h/rows),hh=Math.max(1,Math.round(h/rows)-1);R(x,yy,w,hh,BK2);R(x,yy,w,1,BK3);for(let k=x+2;k<x+w-1;k+=4)R(k,yy+hh-1,2,1,RD);}};
  lam(cx-12,44+by,25,14,4);lam(cx-10,26+by,21,17,5);}
 R(cx-11,42+by,23,3,'#5a1818');R(cx-2,30+by,5,5,GD);
 for(const s of [-1,1]){const x=cx+s*13;R(x-5,25+by,11,10,OUTC);for(let r=0;r<3;r++){R(x-4,26+r*3+by,9,2,BK2);R(x-4,26+r*3+by,9,1,BK3);}R(x-4,34+by,9,1,GD);}
 const sw=Q.sw||[[30,46],[58,4]];const [[a,b],[c,d]]=sw;L(a,b+by,c,d+by,OUTC,4);L(a,b+by,c,d+by,'#c8d0dc',2);L(a,b+by-1,c,d+by-1,'#ffffff',1);R(a-2,b+by-1,5,3,GD);L(a,b+by,a-(c-a)*.17,b+by-(d-b)*.17,'#2a1a10',3);
 const far=Q.far||[[25,29],[24,40],[a-1,b]],near=Q.near||[[47,29],[44,40],[a+2,b-3]];K.arm(far,BK2,BK,SK,5);K.arm(near,BK2,BK,SK,5);
 const hx=cx,hy=17+by;E(hx,hy+2,6,6,OUTC);E(hx,hy+2,5,5,'#8a1818');R(hx-3,hy+1,2,1,'#ffd040');R(hx+2,hy+1,2,1,'#ffd040');R(hx-3,hy+5,7,1,'#f0e8d8');
 E(hx,hy-3,9,5,OUTC);E(hx,hy-3,8,4,BK);E(hx-3,hy-5,3,1,BK3);R(hx-10,hy,21,3,OUTC);R(hx-9,hy,19,2,BK2);
 for(const s of [-1,1]){L(hx+s*1,hy-7,hx+s*13,hy-18,OUTC,3);L(hx+s*1,hy-7,hx+s*13,hy-18,GD,1);R(hx+s*13-1,hy-19,2,2,GD2);}R(hx-1,hy-9,3,3,GD2);}
BART['LORD KUROGANE']=Object.assign(p=>kur2(p,[{},{b:1,horo:1},{gallop:1,couch:1,horo:3}][p.f]||{}),{fw:96,fh:72,raw:1,sc:1.12});
humBoss('KUROGANE ON FOOT',kf2,{idle0:{},idle1:{b:1},atk:{sw:[[42,28],[70,60]],far:[[25,29],[34,33],[41,28]],near:[[47,29],[48,34],[44,29]]}});
if(typeof KUR!=='undefined')KUR.foot=null;

// ---------------------------------------------------------------- XII. THE CORRUPT EMPEROR
// The Son of Heaven in full court dress: a vast stiff black outer robe (ho) worked with gold cloud roundels, layered white
// and red collars, a long train sweeping behind, the black court crown with its tall standing tail, a long grey beard,
// and the ivory shaku baton held before him. A gold sun disc burns behind his head. Second form: the robe splits over a
// violet rift, the sun disc cracks and turns violet, veins of corruption across his face, his eyes blaze.
function emp2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const B1='#141018',B2='#2a2030',B3='#4a3a56',B4='#6a5a7a',GD='#e0b040',GD2='#fff0a0',GD3='#a07020',WH='#f4f0e8',RD='#a01828',RT='#b040ff',RT2='#e080ff',RT3='#6a20a0',SK='#ecd8c8',BE='#c8c4cc';
 // the sun disc behind him
 const sun=two?[RT3,RT,RT2]:[GD3,GD,GD2];E(cx,13+by,15,15,OUTC);E(cx,13+by,14,14,sun[0]);E(cx,13+by,12,12,sun[1]);E(cx-3,10+by,6,6,sun[2]);
 for(let i=0;i<16;i++){const a=i/16*TAU;L(cx+Math.cos(a)*15,13+by+Math.sin(a)*15,cx+Math.cos(a)*19,13+by+Math.sin(a)*19,i%2?sun[1]:sun[2],1);}
 if(two){L(cx-6,0+by,cx-1,12+by,OUTC,1);L(cx-1,12+by,cx-8,24+by,OUTC,1);L(cx+4,2+by,cx+9,10+by,OUTC,1);}
 // the train, sweeping out behind to the left
 trap(cx-14,52,73,4,12,B2);R(cx-27,72,24,1,OUTC);
 // the outer robe: a stiff wide bell, gold roundels
 trap(cx,24+by,73,11,21,B2,{});R(cx-21,72,43,1,OUTC);
 for(const [x,y] of [[-13,64],[-4,58],[8,64],[14,52],[-11,46],[4,46]]){const yy=y+(y<50?by:0);E(cx+x,yy,3,2,GD3);E(cx+x,yy,2,1,GD);R(cx+x,yy,1,1,GD2);}
 R(cx-21,70,43,2,GD3);R(cx-21,70,43,1,GD);
 // white and red under-robes at the hem and collar
 trap(cx,62,73,6,9,WH);trap(cx,64,73,4,6,RD);
 if(two){for(let y=26;y<=72;y++){const w=Math.round(1+(y-26)*.09+Math.sin(y*.8+(Q.ph||0))*1),yy=y+(y<50?by:0);R(cx-w-1,yy,w*2+3,1,OUTC);R(cx-w,yy,w*2+1,1,RT3);if(w>1)R(cx-w+1,yy,w*2-1,1,y%3?RT:RT2);}
  for(const [x0,y0,x1,y1] of [[-3,32,-12,38],[3,36,13,42],[-3,52,-14,58],[3,56,12,64],[-2,44,-8,48]])L(cx+x0,y0+(y0<50?by:0),cx+x1,y1+(y1<50?by:0),RT,1);}
 // the belt: a stone-studded leather band
 R(cx-12,39+by,25,4,OUTC);R(cx-11,40+by,23,2,'#2a1810');for(let i=0;i<5;i++){R(cx-9+i*5,40+by,2,2,i%2?'#e8e8f0':'#40a0c0');}
 // the great sleeves, square and stiff, falling past his knees
 for(const s of [-1,1]){const x0=cx+s*10,x1=cx+s*20;for(let y=26;y<=56;y++){const w=y<34?Math.round((y-26)*.9):7,xa=s<0?x0-w*2-1:x0,xx=xa;R(xx-1,y+by,w*2+3,1,OUTC);}
  for(let y=27;y<=55;y++){const w=y<34?Math.round((y-27)*.9):7,xa=s<0?x0-w*2:x0+1;R(xa,y+by,w*2,1,B2);R(xa,y+by,s<0?2:1,1,B3);R(xa+w*2-2,y+by,2,1,B1);}
  R(s<0?x0-14:x0+1,55+by,14,1,GD);R(s<0?x0-14:x0+1,54+by,14,1,GD3);for(const y of [38,46])L(s<0?x0-3:x0+3,y+by,s<0?x0-12:x0+12,y+3+by,B1,1);E(s<0?x0-7:x0+7,46+by,2,2,GD3);R(s<0?x0-7:x0+7,46+by,1,1,GD);}
 // the shaku held before him in both hands (raised to command in the attack)
 const sk=Q.shaku||[[cx,48],[cx,34]];const [[a,b],[c,d]]=sk;L(a,b+by,c,d+by,OUTC,4);L(a,b+by,c,d+by,BE,2);L(a-1,b+by,c-1,d+by,'#ffffff',1);
 for(const s of [-1,1]){E(a+s*3,b+by,3,2,OUTC);E(a+s*3,b+by,2,1,SK);}
 if(Q.glow){for(let i=0;i<10;i++){const an=i/10*TAU;R(c+Math.cos(an)*6,d+by+Math.sin(an)*6,2,2,i%2?(two?RT:GD):(two?RT2:GD2));}E(c,d+by-1,2,2,two?RT2:GD2);}
 // layered collars
 trap(cx,22+by,28+by,5,8,B2);L(cx,23+by,cx-5,30+by,WH,2);L(cx,23+by,cx+5,30+by,WH,2);L(cx,24+by,cx-4,30+by,RD,1);L(cx,24+by,cx+4,30+by,RD,1);
 // head: the face, heavy brows, long moustache and beard
 const hx=cx,hy=14+by,sk2=two?'#d4bcc8':SK;face(hx,hy,sk2,{eye:two?RT2:OUTC,brow:'#4a4248',mouth:false,ey:0});R(hx-4,hy-2,3,1,'#6a6268');R(hx+2,hy-2,3,1,'#6a6268');
 L(hx-1,hy+3,hx-6,hy+6,BE,1);L(hx+1,hy+3,hx+6,hy+6,BE,1);for(let i=0;i<6;i++){const w=Math.max(1,3-Math.floor(i/2));R(hx-w,hy+4+i,w*2+1,1,i<1?'#a8a4ac':BE);}R(hx,hy+5,1,4,'#8a868e');
 if(two){L(hx-5,hy-2,hx-2,hy+4,RT,1);L(hx+5,hy-1,hx+3,hy+4,RT,1);R(hx-3,hy,2,1,'#ffffff');R(hx+2,hy,2,1,'#ffffff');}
 // the crown: a black cap, a gold band, the tall standing tail behind
 const tilt=two?2:0;L(hx+tilt+1,hy-9,hx+tilt+3,hy-26,OUTC,4);L(hx+tilt+1,hy-9,hx+tilt+3,hy-26,B1,2);L(hx+tilt+1,hy-10,hx+tilt+2,hy-24,B3,1);
 R(hx-6+tilt,hy-11,13,6,OUTC);R(hx-5+tilt,hy-10,11,5,B1);R(hx-5+tilt,hy-10,11,1,B4);R(hx-6+tilt,hy-6,13,2,GD);R(hx-1+tilt,hy-7,3,2,GD2);}
humBoss('THE CORRUPT EMPEROR',emp2,{idle0:{},idle1:{b:1,ph:1},
 atk:{glow:1,shaku:[[46,36],[56,16]]}},{sc:1.12});
EMPR.mkTrue=function(e){let s;ARTHURT=true;try{s=bossArt('THE CORRUPT EMPEROR');}finally{ARTHURT=false;}
 const c=mk(s.c.width,s.c.height,g=>{g.drawImage(s.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(90,10,140,.4)';g.fillRect(0,0,s.c.width,s.c.height);});
 const g=c.getContext('2d');for(let f=0;f<s.frames;f++){const x0=f*s.fw+36;for(const k of [-1,1]){g.fillStyle='#14101a';for(let i=0;i<10;i++)g.fillRect(x0+k*(7+i)-1,5-i*.7,3,4);g.fillStyle='#ffd040';for(let i=0;i<10;i++)g.fillRect(x0+k*(7+i),6-i*.7,1,2);}}
 return Object.assign({},s,{c,wc:whiteOf(c),sc:(s.sc||1)*1.6});};
