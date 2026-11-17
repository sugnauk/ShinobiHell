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

// ---------------------------------------------------------------- THE HITOBASHIRA, MAIDEN OF THE WALL (optional lair, stage VI)
// A maiden walled up alive in the castle foundations so the walls would hold, risen as a yurei. A cracked wooden pillar
// stands behind her with a straw rope still binding her to it; white burial kimono crossed left over right; the white
// triangle on her brow; black hair so long it hides half her face and falls past her waist; arms raised with the hands
// hanging limp; no feet - her robe thins into drifting mist. Ghost-fires circle her. Second form: the pillar shatters and
// the rope snaps, her hair parts to show both eyes burning, cracks of ghost-light run through her skin, the hem is dark
// with the earth of the foundations.
function hitoDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,face,by}=K,two=ARTHURT,cx=36,fl=Q.float||0;
 const WD='#4a3a2a',WD2='#6a5640',WD3='#8a7458',RP='#a89058',RP2='#d0b878',W1='#9aa8a8',W2='#d4dcd8',W3='#f2f6f2',SK='#d8e8e4',SK2='#b0c8c4',HR='#0e0c12',HR2='#24202c',GF='#7af0d0',GF2='#d0fff4',MU='#5a4a3a';
 const Y=y=>y+by-fl;
 // ---- the pillar behind her (broken in the second form)
 if(!two){R(cx-6,4,13,70,OUTC);R(cx-5,5,11,69,WD);R(cx-5,5,3,69,WD3);R(cx+3,5,3,69,'#3a2c20');for(const y of [14,30,52,66])L(cx-4,y,cx+1,y+5,'#2a1e14',1);L(cx+2,8,cx-1,24,'#2a1e14',1);}
 else{artPoly(R,[[cx-6,74],[cx-6,44],[cx-2,40],[cx+1,46],[cx+4,38],[cx+7,44],[cx+7,74]],OUTC);artPoly(R,[[cx-5,73],[cx-5,45],[cx-2,42],[cx+1,47],[cx+4,40],[cx+6,45],[cx+6,73]],WD);R(cx-5,45,3,28,WD3);
  for(const [x,y] of [[cx-14,20],[cx+12,14],[cx+16,30]]){R(x-1,y-1,5,4,OUTC);R(x,y,3,2,WD2);}}
 // ---- long hair down her back
 trap(cx,Y(14),Y(54),7,10,HR);for(let k=-7;k<=7;k+=3)L(cx+k,Y(22),cx+k*1.4,Y(54),HR2,1);
 // ---- the kimono, thinning into mist below the knees
 trap(cx,Y(26),Y(56),8,12,W2,{pleats:1});
 for(let i=0;i<5;i++){const x0=cx-10+i*5,N=[[x0,Y(56),5],[x0-2+(i%2)*3,Y(62),4],[x0+((i*3)%5)-2,Y(68),3],[x0+((i*5)%7)-3,Y(73)+((i%2)*2),1]];artPoly(R,tubePoly(R,N,1),OUTC);artPoly(R,tubePoly(R,N),i%2?W1:W2);}
 if(two)for(const [x,w] of [[-11,5],[-3,4],[5,6]]){R(cx+x,Y(53),w,3,MU);R(cx+x+1,Y(55),Math.max(1,w-2),2,MU);}
 // crossed collar, left over right, and the straw rope binding her to the pillar
 L(cx+1,Y(26),cx-5,Y(40),W1,2);L(cx-1,Y(26),cx+5,Y(36),W1,1);R(cx-9,Y(40),19,3,OUTC);R(cx-8,Y(40),17,2,W1);
 if(!two){for(let i=0;i<9;i++){const x=cx-10+i*2.5;R(x,Y(43)+(i%2),3,2,i%2?RP:RP2);}L(cx-10,Y(44),cx-7,Y(36),RP,2);L(cx+10,Y(44),cx+7,Y(36),RP,2);}
 else{for(let i=0;i<4;i++){const x=cx-10+i*2.5;R(x,Y(43)+(i%2),3,2,i%2?RP:RP2);}L(cx-1,Y(44),cx+2,Y(50),RP,1);L(cx+2,Y(50),cx+1,Y(53),RP2,1);}
 // ---- arms raised forward, hands hanging limp at the wrists, long sleeves drooping
 const far=Q.far||[[29,29],[25,34],[27,38]],near=Q.near||[[43,29],[48,34],[50,38]];
 for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,Y(d)-2,Y(d)+10,3,5,W2);R(c-5,Y(d)+10,11,1,W1);}
 for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;seg(a,Y(b),c,Y(d),4,W2);seg(c,Y(d),e,Y(f),3,W3);const s2=e>cx?1:-1;seg(e,Y(f),e+s2,Y(f)+4,2,SK);for(let k=0;k<3;k++)L(e+s2+k-1,Y(f)+4,e+s2+k-1,Y(f)+7,SK2,1);}
 // ---- head: hair parted to one side hiding half her face, the white triangle on her brow
 const hx=cx,hy=Y(17);E(hx,hy,8,9,OUTC);E(hx,hy,7,8,HR);
 face(hx,hy+1,SK,{eye:two?GF:OUTC,mouth:Q.wail?OUTC:'#5a6a6a',brow:false});if(Q.wail){R(hx-1,hy+4,3,3,OUTC);R(hx,hy+5,1,1,'#2a3a3a');}
 if(!two){artPoly(R,[[hx-8,hy-6],[hx+3,hy-7],[hx+1,hy+4],[hx-2,hy+12],[hx-8,hy+16]],HR);R(hx+2,hy,2,1,GF);}
 else{R(hx-7,hy-5,3,14,HR);R(hx+5,hy-5,3,14,HR);R(hx-3,hy+1,2,1,GF2);R(hx+2,hy+1,2,1,GF2);for(const [a,b,c2,d] of [[-4,3,-2,8],[3,-1,5,4],[-1,6,1,9]])L(hx+a,hy+b,hx+c2,hy+d,GF,1);}
 R(hx-6,hy-5,12,2,HR);artPoly(R,[[hx-3,hy-6],[hx+3,hy-6],[hx,hy-2]],'#f8fcf8');
 for(const [a,b] of [[-10,-2],[-11,8],[10,-3],[11,7]])L(hx+a*.7,hy+b*.6,hx+a,hy+b+12,HR,2);
 // ---- ghost-fires circling her
 const fires=Q.fires||[[10,30],[62,24],[60,56]];for(const [x,y] of (two?fires.concat([[12,58],[58,8]]):fires)){E(x,Y(y),3,4,OUTC);E(x,Y(y),2,3,GF);E(x,Y(y)-1,1,1,GF2);R(x,Y(y)-6,1,2,GF2);}}
humBoss('THE HITOBASHIRA',hitoDraw,{idle0:{},idle1:{b:0,float:2,fires:[[11,28],[61,26],[59,54]]},
 atk:{wail:1,float:3,far:[[29,29],[20,26],[14,22]],near:[[43,29],[52,26],[58,22]],fires:[[6,20],[66,16],[64,50],[8,52]]}},{fw:72,fh:78,sc:1.05});
// the lair caches its sprites; clear them so the new art is used
if(typeof LAIRSPR!=='undefined')for(const k in LAIRSPR)delete LAIRSPR[k];if(typeof MOTH!=='undefined'){delete MOTH.n;delete MOTH.h;}
