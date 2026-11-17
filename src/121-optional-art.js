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

// the lair caches its sprites; clear them so the new art is used
if(typeof LAIRSPR!=='undefined')for(const k in LAIRSPR)delete LAIRSPR[k];if(typeof MOTH!=='undefined'){delete MOTH.n;delete MOTH.h;}
