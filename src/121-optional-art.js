'use strict';
// ===== THE OPTIONAL BOSSES, redrawn to match the guardians =====
// Same toolkit as the story bosses (HUM): outlined shapes, three-tone shading, faces with eyes and mouths, posed frames.
// a tube along nodes [x,y,width]: used for tails, wings veins and anything soft and curved
function tubePoly(R,N,grow){const Lp=[],Rp=[];N.forEach((n,i)=>{const a=N[Math.max(0,i-1)],b=N[Math.min(N.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=n[2]/2+(grow||0);
  Lp.push([n[0]+nx*w,n[1]+ny*w]);Rp.push([n[0]-nx*w,n[1]-ny*w]);});return [...Lp,...Rp.reverse()];}

// ---------------------------------------------------------------- THE MOTH QUEEN (mini-boss, stage IV)
// A court lady with the wings of a great atlas moth: rust and ochre wings banded in cream, clear triangular windows, the
// snake-head tips of the upper wings; layered court robes in violet and plum over cream and rust collars; long black hair;
// feathery gold antennae and a moth-wing hair ornament. Second form: the wings blaze at their edges, the hem smoulders,
// her eyes burn orange, the hair lifts loose.
function mothDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,face,lt,dk,by}=K,two=ARTHURT,cx=48;
 const W0='#3a1608',W1='#6a2a10',W2='#9a4418',W3='#c8783a',W4='#e8b070',CR='#f4e4c0',PK='#e8a080',VI='#3e1e5a',VI2='#5e3486',VI3='#8a5ab4',PL='#5a1e3a',SK='#f4e0d4',HR='#14101a',GD='#e0b040',GD2='#fff0a0',FI='#ff8a20',FI2='#ffd040';
 const fl=Q.flap||0;
 // ---- wings: upper pair sweeping up and out, lower pair below; drawn far side first (both are behind her)
 const wing=(s,up)=>{const ox=cx,oy=up?32+by:44+by,tipX=ox+s*(up?44:34),tipY=up?6-fl*3:70+fl,
   pts=up?[[ox,oy-4],[ox+s*16,oy-20-fl],[tipX-s*6,tipY],[tipX,tipY+6],[ox+s*42,oy+2],[ox+s*30,oy+10],[ox,oy+6]]
         :[[ox,oy-2],[ox+s*26,oy-4],[ox+s*36,oy+10],[tipX,tipY-8],[ox+s*24,tipY],[ox+s*8,oy+16],[ox,oy+10]];
   artPoly(R,pts.map(([x,y])=>[x+(x>ox?1:x<ox?-1:0),y+(y>oy?1:-1)]),OUTC);artPoly(R,pts,W2);
   // inner band and the darker base
   const inner=pts.map(([x,y])=>[ox+(x-ox)*.62,oy+(y-oy)*.62]);artPoly(R,inner,W3);artPoly(R,pts.map(([x,y])=>[ox+(x-ox)*.3,oy+(y-oy)*.3]),W1);
   // the cream band between the zones and the dark wing edge
   for(let i=0;i<pts.length-1;i++){const [a,b]=pts[i],[c,d]=pts[i+1];L(ox+(a-ox)*.64,oy+(b-oy)*.64,ox+(c-ox)*.64,oy+(d-oy)*.64,CR,1);L(a,b,c,d,two?FI:W0,2);}
   // veins
   for(const k of [1,2,3,4,5])if(pts[k])L(ox+s*3,oy,pts[k][0]*.85+ox*.15,pts[k][1]*.85+oy*.15,W1,1);
   // the clear window: a pale triangle in the middle of each wing
   const wx=ox+s*(up?22:18),wy=up?oy-6:oy+12;artPoly(R,[[wx,wy-3],[wx+s*5,wy+1],[wx-s*1,wy+3]],OUTC);artPoly(R,[[wx,wy-2],[wx+s*4,wy+1],[wx,wy+2]],two?FI2:'#fff6e0');
   // the snake-head tip of the upper wing: pink-ochre with a dark eye
   if(up){E(tipX-s*3,tipY+4,5,4,OUTC);E(tipX-s*3,tipY+4,4,3,PK);E(tipX-s*4,tipY+3,2,1,'#ffd0b0');R(tipX-s*1-1,tipY+3,2,2,OUTC);}
   if(two)for(let i=0;i<5;i++){const [a,b]=pts[(i+2)%pts.length];R(a-1,b-2-i%2,2,2,i%2?FI2:FI);}};
 wing(-1,0);wing(1,0);wing(-1,1);wing(1,1);
 // ---- long black hair down her back
 trap(cx,14+by,52+by,7,10,HR);
 // ---- court robes: a long bell of violet over plum, cream and rust collars layered at the neck and hem
 trap(cx,26+by,73,9,15,VI);trap(cx,44+by,73,5,9,PL);R(cx-15,72,31,1,OUTC);
 for(const [x,y] of [[-10,58],[8,52],[-4,66],[10,66],[-12,46]]){const yy=y+(y<50?by:0);R(cx+x,yy,3,1,GD);R(cx+x+1,yy-1,1,3,GD);}
 L(cx,26+by,cx-6,42+by,CR,2);L(cx,26+by,cx+6,42+by,CR,2);L(cx,27+by,cx-5,42+by,W2,1);L(cx,27+by,cx+5,42+by,W2,1);
 R(cx-9,40+by,19,4,OUTC);R(cx-8,41+by,17,2,GD);R(cx-1,41+by,3,2,W2);
 if(two)for(const [x,w] of [[-14,5],[-4,4],[6,6]]){R(cx+x,69,w,3,'#2a1010');R(cx+x+1,67,1,2,FI);R(cx+x+w-2,68,1,2,FI2);}
 // ---- arms in long sleeves; the near hand scatters glowing dust in the attack
 const far=Q.far||[[41,29],[37,38],[42,44]],near=Q.near||[[55,29],[60,38],[54,44]];
 for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,d+by-2,d+by+12,3,6,VI2);R(c-6,d+by+12,13,1,GD);}
 K.arm(far,VI2,VI2,SK,4);K.arm(near,VI2,VI2,SK,4);
 if(Q.dust){const [hx,hy]=near[2];for(let i=0;i<14;i++){const a=-1.2+i*.18,r=4+(i*5)%11;R(hx+Math.cos(a)*r,hy+by+Math.sin(a)*r,1,1,i%3?FI2:'#ffffff');}}
 // ---- head: hair framing a pale face, red lips, the antennae and a moth ornament
 const hx=cx,hy=17+by;E(hx,hy,8,9,OUTC);E(hx,hy,7,8,HR);face(hx,hy+1,SK,{eye:two?FI:OUTC,mouth:'#c02840',brow:HR});R(hx-6,hy-4,12,3,HR);R(hx-7,hy-3,2,13,HR);R(hx+6,hy-3,2,13,HR);
 if(two){R(hx-3,hy+1,2,1,FI2);R(hx+2,hy+1,2,1,FI2);for(const [a,b] of [[-11,-6],[11,-7],[-13,4],[13,3]])L(hx,hy-4,hx+a,hy+b,HR,2);}
 for(const s of [-1,1]){const pts=[[hx+s*2,hy-7],[hx+s*6,hy-14],[hx+s*12,hy-18]];L(pts[0][0],pts[0][1],pts[1][0],pts[1][1],OUTC,3);L(pts[1][0],pts[1][1],pts[2][0],pts[2][1],OUTC,3);
  L(pts[0][0],pts[0][1],pts[1][0],pts[1][1],GD,1);L(pts[1][0],pts[1][1],pts[2][0],pts[2][1],GD,1);for(let k=0;k<4;k++){const t=.3+k*.2,x=pts[0][0]+(pts[2][0]-pts[0][0])*t,y=pts[0][1]+(pts[2][1]-pts[0][1])*t;L(x,y,x+s*2,y+2,GD2,1);L(x,y,x-s*1,y-2,GD2,1);}}
 E(hx+5,hy-6,3,2,OUTC);E(hx+5,hy-6,2,1,W3);R(hx+4,hy-6,1,1,CR);}
humBoss('THE MOTH QUEEN',mothDraw,{idle0:{},idle1:{b:1,flap:1},atk:{flap:2,dust:1,near:[[55,29],[62,26],[66,18]]}},{fw:100,fh:78,sc:1});

// ---------------------------------------------------------------- THE NINE-TAILED KITSUNE (optional lair, stage X)
// The fox spirit itself, the one Tamamo imitates: a tall silver-haired woman in crimson and white shrine robes with gold
// trim, tall fox ears tipped black, golden eyes, and nine thick furred tails (gold to cream, white tips) fanned behind.
// Second form: the fox shows through - red markings on her cheeks, slit eyes, clawed hands, blue foxfire on every tail tip.
function kitDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,face,by}=K,two=ARTHURT,cx=40;
 const T1='#8a4410',T2='#d87a26',T3='#f0b050',T4='#fff4e0',RD='#a81828',RD2='#d83040',WH='#f4f0ea',WH2='#c8c0b8',GD='#e0b040',SK='#f6e4d8',HR='#e8e6f0',HR2='#b8b4c8',BF='#4ab0ff',BF2='#c8f0ff';
 // ---- nine tails, thick and furred, fanned behind her
 const sp=Q.spread||1;for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.3*sp,c=Math.cos(a),s=Math.sin(a),bx=cx,byy=48+by,curl=(i-4)*.08;
  const N=[];for(let k=0;k<=7;k++){const t=k/7,r=4+t*30,an=a+curl*t*t*4;N.push([bx+Math.cos(an)*r,byy+Math.sin(an)*r*.9,[4,7,9,10,10,9,6,2][k]]);}
  artPoly(R,tubePoly(R,N,1),OUTC);artPoly(R,tubePoly(R,N),T2);
  artPoly(R,tubePoly(R,N.map(([x,y,w])=>[x-c*0+(-s)*1.2,y+c*1.2,w*.3])),T3);
  for(let k=6;k<=7;k++){const [x,y,w]=N[k];E(x,y,Math.max(1,Math.round(w/2.6)),Math.max(1,Math.round(w/2.6)),T4);}
  for(let k=1;k<6;k++){const [x,y]=N[k];L(x,y,x+Math.cos(a+.6)*3,y+Math.sin(a+.6)*3,T1,1);}
  if(two){const [x,y]=N[7];E(x,y-2,3,4,BF);E(x,y-3,1,2,BF2);R(x,y-8,1,3,BF2);}}
 // ---- hair down her back
 trap(cx,14+by,48+by,7,10,HR);for(let k=-6;k<=6;k+=3)L(cx+k,20+by,cx+k*1.3,46+by,HR2,1);
 // ---- robes: white kimono, crimson hakama with gold trim
 trap(cx,26+by,46+by,8,9,WH);trap(cx,44+by,73,9,15,RD,{pleats:2});R(cx-15,72,31,1,OUTC);R(cx-15,70,31,1,GD);
 L(cx,26+by,cx-5,40+by,RD2,1);L(cx,26+by,cx+5,40+by,RD2,1);R(cx-9,42+by,19,3,GD);R(cx-1,42+by,3,3,RD2);
 // ---- arms in wide white sleeves with red cords
 const far=Q.far||[[33,29],[28,38],[31,45]],near=Q.near||[[47,29],[52,38],[49,45]];
 for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,d+by-2,d+by+11,3,6,WH);R(c-6,d+by+11,13,1,RD2);}
 K.arm(far,WH,WH,SK,4);K.arm(near,WH,WH,SK,4);
 if(two)for(const A of [far,near]){const [x,y]=A[2];for(let k=-1;k<=1;k++)L(x+k,y+by+1,x+k*2,y+by+4,'#f8f8ff',1);}
 // foxfire in the near hand when she attacks
 if(Q.fire){const [x,y]=near[2];E(x+2,y+by-6,4,5,BF);E(x+2,y+by-7,2,3,BF2);R(x+2,y+by-14,1,4,BF2);}
 // ---- head: silver hair, golden eyes, tall fox ears
 const hx=cx,hy=17+by;
 for(const s of [-1,1]){const ex=hx+s*6;artPoly(R,[[ex-3,hy-6],[ex+3,hy-6],[ex+s*2,hy-17]],OUTC);artPoly(R,[[ex-2,hy-6],[ex+2,hy-6],[ex+s*2,hy-15]],HR);artPoly(R,[[ex-1,hy-7],[ex+1,hy-7],[ex+s*2,hy-12]],'#f0a0b0');R(ex+s*2-1,hy-16,2,2,'#2a2030');}
 E(hx,hy,8,9,OUTC);E(hx,hy,7,8,HR);face(hx,hy+1,SK,{eye:two?'#ffd040':'#d0901a',mouth:'#c02840',brow:HR2});R(hx-6,hy-4,12,3,HR);R(hx-7,hy-3,2,12,HR);R(hx+6,hy-3,2,12,HR);
 R(hx-3,hy+1,1,1,OUTC);R(hx+3,hy+1,1,1,OUTC);
 if(two){for(const s of [-1,1]){L(hx+s*2,hy+3,hx+s*4,hy+4,RD2,1);L(hx+s*2,hy+4,hx+s*4,hy+5,RD2,1);}R(hx-3,hy+1,2,1,'#ffd040');R(hx+2,hy+1,2,1,'#ffd040');R(hx-2,hy+1,1,1,OUTC);R(hx+2,hy+1,1,1,OUTC);}
 // a red-and-gold ornament
 R(hx-2,hy-7,5,2,RD2);R(hx-1,hy-8,3,1,GD);}
humBoss('THE NINE-TAILED KITSUNE',kitDraw,{idle0:{},idle1:{b:1,spread:1.04},atk:{fire:1,spread:1.12,near:[[47,29],[55,24],[60,18]]}},{fw:84,fh:80,sc:1.05});
// the lair caches its sprites; clear them so the new art is used
if(typeof LAIRSPR!=='undefined')for(const k in LAIRSPR)delete LAIRSPR[k];if(typeof MOTH!=='undefined'){delete MOTH.n;delete MOTH.h;}
