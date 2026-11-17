'use strict';
// ===== BOSS ART, redrawn to the standard of the Earth Spider =====
// Bigger canvases, five-tone palettes per material, volume from layered shapes, rim light and small details.
// Frames: 0 idle, 1 breathing (b=1), 2 attacking (atk). ARTHURT = drawing the second form.

// AKAGANE, THE RED OX: a towering warlord in red-lacquered laced armour, ox-horned helmet and oni mask, a war banner
// with his ox crest on his back and a great naginata. Second form: the helmet is off - a wild mane and red headband,
// cracked chest plates, one shoulder guard torn away, the banner ripped, eyes blazing.
// ---- the posed figure: every frame (idle, breathing, each attack's animation) is one call with a pose
// pose: dx/dy body offset, hd head drop (lowers the horns), legs ('stand','run1','run2','crouch','lift','stomp'),
// far/near arms [shoulder,elbow,hand], nag [x0,y0,x1,y1] shaft (blade continues past x1,y1), front (naginata over the armour),
// fan (a war fan in the near hand), shout, fx ('arc','follow','dust','speed','crack')
function akaDraw(p,Q){const {R:R_,E:E_,L:L_}=p,two=ARTHURT,ox=Q.dx||0,oy=Q.dy||0;
 const R=(x,y,w,h,c)=>R_(x+ox,y+oy,w,h,c),E=(x,y,rx,ry,c)=>E_(x+ox,y+oy,rx,ry,c),L=(a,b2,c2,d,c,t)=>L_(a+ox,b2+oy,c2+ox,d+oy,c,t);
 const R0='#2a0806',R1='#5a1008',R2='#8a1a10',R3='#b8281a',R4='#e04a30',G0='#5a3a10',G1='#a07020',G2='#e0b040',G3='#fff0a0',
  K0='#0e0c12',K1='#1e1a24',K2='#3a3440',K3='#5a5466',S1='#8a5a3a',S2='#c08860',S3='#e8b088',H1='#a89880',H2='#e8dcc0',H3='#fff8e8',GL='#6a4a2a',GL2='#9a7048';
 const cx=34,by=Q.b||0,hd=Q.hd||0;
 const lam=(x,y,w,h,rows,base,dark,lite)=>{R(x,y,w,h,dark);for(let r=0;r<rows;r++){const yy=y+Math.round(r*h/rows);R(x,yy,w,Math.max(1,Math.round(h/rows)-1),base);R(x,yy,w,1,lite);for(let k=x+1;k<x+w-1;k+=3)R(k,yy+1,1,1,G1);}};
 const seg=(x0,y0,x1,y1,w,c,lite)=>{L(x0,y0,x1,y1,K0,w+2);L(x0,y0,x1,y1,c,w);L(x0-1,y0-1,x1-1,y1-1,lite,1);};
 const glove=(gx,gy)=>{E(gx,gy,3,3,K0);E(gx,gy,2,2,GL);R(gx-1,gy-2,2,1,GL2);};
 const arm=(A)=>{if(!A)return;const [[sx,sy],[ex,ey],[hx2,hy2]]=A;seg(sx,sy+by,ex,ey+by,4,R2,R4);seg(ex,ey+by,hx2,hy2,3,'#4a4454','#8a8498');
  const mx=(ex+hx2)/2,my=(ey+by+hy2)/2;R(mx-2,my-1,4,2,G1);E(ex,ey+by,2,2,K0);E(ex,ey+by,1,1,G2);glove(hx2,hy2);};
 const nag=(n)=>{if(!n)return;const [x0,y0,x1,y1]=n;L(x0,y0,x1,y1,K1,3);L(x0,y0-1,x1,y1-1,'#6a4a2a',1);const a=Math.atan2(y1-y0,x1-x0),bx=x1+Math.cos(a)*14,by2=y1+Math.sin(a)*14;
  L(x1,y1,bx,by2,'#9aa4b4',3);L(x1,y1-1,bx,by2-1,'#e8eef6',1);L(bx,by2,bx+Math.cos(a+1.2)*4,by2+Math.sin(a+1.2)*4,'#e8eef6',2);R(x1-2,y1-2,5,4,G1);R(x1-1,y1-2,3,1,G2);};
 // banner on his back
 R(52,2,2,44,K1);R(52,2,1,44,K2);R(50,4,6,2,G1);
 if(!two){R(54,6,14,26,R2);R(54,6,14,1,R4);R(54,6,1,26,R3);R(55,31,13,1,R1);E(61,17,4,4,G1);E(61,17,3,3,G2);R(57,13,2,3,H2);R(64,13,2,3,H2);R(60,19,3,1,R1);R(59,27,5,2,G2);}
 else{R(54,6,9,13,R2);R(54,6,9,1,R4);for(let i=0;i<5;i++)R(55+i*2,19+(i%2)*3,2,3+(i%3),R2);R(63,8,3,6,R1);}
 // legs
 const leg=(lx,top,kneeX,kneeY,fx,fy,dir)=>{seg(lx,top,kneeX,kneeY,6,'#2a1a14','#3a2a20');seg(kneeX,kneeY,fx,fy-2,5,K1,K3);for(let k=1;k<4;k++){const yy=kneeY+(fy-kneeY)*k/4,xx=kneeX+(fx-kneeX)*k/4;R(xx-2,yy,4,1,G1);}
  R(fx-6+dir,fy-1,12,3,K0);R(fx-5+dir,fy-1,10,1,K2);};
 const lg=Q.legs||'stand';
 if(lg==='stand'||lg==='stomp'){leg(24,57+by,24,64,23,73,-1);leg(43,57+by,43,64,44,73,1);}
 else if(lg==='run1'){leg(24,57,18,63,12,72,-1);leg(43,57,49,61,52,70,1);}
 else if(lg==='run2'){leg(24,57,28,62,30,72,-1);leg(43,57,40,64,36,72,1);}
 else if(lg==='crouch'){leg(24,59,17,64,18,73,-1);leg(43,59,51,63,50,73,1);}
 else if(lg==='lift'){leg(24,57,24,64,23,73,-1);leg(44,56,58,60,60,67,1);}
 if(lg==='stomp'||Q.fx==='crack'){for(const [x,dir2] of [[44,1],[44,-1]]){L_(x+ox,74,x+ox+dir2*10,71,K0,1);L_(x+ox+dir2*10,71,x+ox+dir2*16,74,K0,1);}}
 // skirt and chest
 lam(18,46+by,32,13,4,R3,R0,R4);R(18,46+by,1,13,R1);R(49,46+by,1,13,R1);for(let x=22;x<48;x+=8)R(x,46+by,1,13,R1);
 E(cx,37+by,15,11,R0);E(cx,36+by,14,10,R2);lam(21,30+by,27,15,5,R3,R1,R4);E(cx-4,33+by,6,4,R4);R(cx-6,31+by,3,1,'#ff8060');
 R(19,44+by,31,3,K1);R(19,44+by,31,1,K3);R(cx-2,44+by,5,3,G2);
 if(!two){E(cx,37+by,3,3,G1);E(cx,37+by,2,2,G2);R(cx-3,34+by,1,2,H2);R(cx+3,34+by,1,2,H2);R(cx,36+by,1,1,G3);}
 else{L(cx-6,31+by,cx+2,40+by,K0,1);L(cx+2,40+by,cx-2,45+by,K0,1);L(cx+5,32+by,cx+8,38+by,K0,1);R(cx-4,35+by,6,4,S2);R(cx-3,35+by,4,1,S3);R(cx-2,37+by,2,1,S1);}
 // naginata behind, arms, shoulder guards
 if(!Q.front)nag(Q.nag);
 arm(Q.far);arm(Q.near);
 const sode=(x,lean)=>{for(let r=0;r<3;r++){const yy=24+by+r*3;R(x+lean*r,yy,11,3,r%2?R3:R2);R(x+lean*r,yy,11,1,R4);R(x+lean*r+2,yy+1,1,1,G1);R(x+lean*r+6,yy+1,1,1,G1);R(x+lean*r+10,yy,1,3,R1);}R(x,23+by,11,1,G2);};
 sode(12,-1);if(!two)sode(45,1);else{R(46,25+by,5,4,K1);R(47,26+by,3,1,K3);}
 // head (drops forward for the charge)
 const hx=cx+Math.round(hd*.6),hy=12+by+hd;
 if(!two){
  for(let r=0;r<4;r++)R(hx-11-r,hy+6+r*3,23+r*2,3,r%2?R2:R3),R(hx-11-r,hy+6+r*3,23+r*2,1,R4);
  for(const s2 of [-1,1]){L(hx+s2*7,hy+2,hx+s2*17,hy-2,H1,4);L(hx+s2*17,hy-2,hx+s2*21,hy-10,H1,3);L(hx+s2*21,hy-10,hx+s2*19,hy-16,H2,2);
   L(hx+s2*8,hy+1,hx+s2*17,hy-3,H2,2);L(hx+s2*17,hy-3,hx+s2*20,hy-10,H3,1);R(hx+s2*19-1,hy-17,2,2,H3);}
  E(hx,hy,9,7,K0);E(hx,hy-1,8,6,K1);E(hx-2,hy-3,4,3,K2);for(let i=-6;i<=6;i+=3)R(hx+i,hy+1,1,1,G2);
  L(hx-5,hy-7,hx-2,hy-10,G2,2);L(hx+5,hy-7,hx+2,hy-10,G2,2);R(hx-2,hy-11,5,2,G1);R(hx-1,hy-12,3,1,G3);
  R(hx-11,hy+2,4,4,R3);R(hx+8,hy+2,4,4,R3);R(hx-11,hy+2,4,1,R4);R(hx+8,hy+2,4,1,R4);
  E(hx,hy+7,6,5,R2);E(hx,hy+6,5,4,R3);const eye=Q.atk||Q.shout?'#ffffff':'#ffd040';R(hx-4,hy+4,3,1,K0);R(hx+2,hy+4,3,1,K0);R(hx-3,hy+4,1,1,eye);R(hx+3,hy+4,1,1,eye);
  if(Q.shout){R(hx-3,hy+8,7,4,K0);R(hx-2,hy+11,5,1,'#5a0a08');R(hx-3,hy+8,1,2,H3);R(hx+3,hy+8,1,2,H3);}
  else{R(hx-3,hy+9,7,2,K0);R(hx-3,hy+9,1,2,H3);R(hx+3,hy+9,1,2,H3);R(hx-1,hy+10,1,1,H2);R(hx+1,hy+10,1,1,H2);}R(hx-1,hy+6,3,1,R1);
  R(hx-4,hy+12,9,3,K1);for(let i=-3;i<=3;i+=2)R(hx+i,hy+12,1,3,K2);
 }else{
  E(hx,hy+1,9,6,K0);const sp=[[-9,-2,-14,-4],[-7,-4,-10,-10],[-4,-5,-5,-12],[0,-6,1,-11],[4,-5,7,-11],[7,-3,12,-8],[9,0,15,-1],[-10,2,-15,5],[9,4,13,9]];for(const [a1,b1,a2,b2] of sp)L(hx+a1,hy+b1,hx+a2,hy+b2,K0,2);E(hx-2,hy-2,4,2,K1);
  E(hx,hy+6,6,7,S2);E(hx-1,hy+5,5,5,S3);R(hx-6,hy+6,1,5,S1);
  R(hx-8,hy+1,17,3,'#e02818');R(hx-8,hy+1,17,1,'#ff6040');L(hx-8,hy+2,hx-16,hy+8+by,'#e02818',2);L(hx-8,hy+3,hx-14,hy+12,'#a01810',1);
  R(hx-4,hy+6,3,1,K0);R(hx+2,hy+6,3,1,K0);R(hx-3,hy+6,1,1,'#ff3020');R(hx+3,hy+6,1,1,'#ff3020');
  L(hx+2,hy+3,hx+5,hy+9,R1,1);
  if(Q.shout){R(hx-3,hy+10,7,4,R0);R(hx-3,hy+10,7,1,H3);R(hx-2,hy+13,5,1,H3);}else{R(hx-3,hy+10,7,2,R0);R(hx-3,hy+10,7,1,H3);R(hx-2,hy+11,1,1,H3);R(hx+2,hy+11,1,1,H3);}
  E(hx,hy+13,4,2,K0);
 }
 // war fan in the near hand (giving orders)
 if(Q.fan){const [fx2,fy2]=Q.fan;for(let i=-3;i<=3;i++)L(fx2,fy2,fx2+i*2,fy2-7,i%2?G2:R3,1);L(fx2-6,fy2-6,fx2+6,fy2-6,G1,1);R(fx2-1,fy2-1,2,2,G3);}
 // the naginata in front (when swinging), with the gloves on the shaft
 if(Q.front){nag(Q.nag);for(const g of (Q.grip||[]))glove(g[0],g[1]);}
 // effects drawn into the frame
 if(Q.fx==='arc'){for(let a=-1.1;a<=.9;a+=.05){const r=30;R_(34+ox+Math.cos(a)*r,36+oy+Math.sin(a)*r*.8,2,1,a>.5?'#ffffff':'#e8eef6');R_(34+ox+Math.cos(a)*(r-3),36+oy+Math.sin(a)*(r-3)*.8,1,1,'#9aa4b4');}}
 if(Q.fx==='follow'){for(let a=-.2;a<=1.2;a+=.07)R_(40+ox+Math.cos(a)*24,44+oy+Math.sin(a)*20,1,1,'#c8d0dc');}
 if(Q.fx==='speed'){for(let i=0;i<5;i++)R_(0+ox,30+i*7+oy,8+((i*5)%9),1,'#e8dcc0');}
 if(Q.fx==='dust'||lg==='stomp'){for(const [dx2,r] of [[-8,3],[0,4],[8,3],[14,2],[-14,2]])E_(Q.dustX+dx2+ox,72,r,Math.max(1,r-2),'#8a7a5a');}
}
// the poses: [name, pose]
const AKA_POSES={
 idle0:{nag:[46,70,50,8],far:[[19,29],[11,39],[13,50]],near:[[49,29],[57,38],[48,47]]},
 idle1:{b:1,nag:[46,70,50,8],far:[[19,29],[11,39],[13,50]],near:[[49,29],[57,38],[48,47]]},
 atk:{atk:1,front:1,nag:[4,60,50,14],grip:[[22,43],[39,25]],far:[[19,29],[12,38],[22,43]],near:[[49,29],[55,20],[39,25]]},
 // crescent cut: wind up over the shoulder, sweep across, follow through low
 cr1:{dx:-2,front:1,nag:[58,46,18,10],grip:[[44,34],[33,25]],far:[[19,29],[26,36],[33,25]],near:[[49,29],[52,38],[44,34]],shout:1},
 cr2:{dx:2,atk:1,front:1,nag:[6,40,50,34],grip:[[24,38],[40,35]],far:[[19,29],[16,38],[24,38]],near:[[49,29],[50,38],[40,35]],fx:'arc'},
 cr3:{dx:3,dy:1,front:1,nag:[20,26,52,54],grip:[[30,35],[42,45]],far:[[19,29],[22,38],[30,35]],near:[[49,29],[52,40],[42,45]],fx:'follow'},
 // arrow rain: raise the war fan and shout the order, then point it at you
 rn1:{shout:1,nag:[16,70,14,10],far:[[19,29],[12,38],[15,44]],near:[[49,29],[56,20],[58,10]],fan:[58,9]},
 rn2:{shout:1,dx:1,nag:[16,70,14,10],far:[[19,29],[12,38],[15,44]],near:[[49,29],[58,28],[66,27]],fan:[67,27]},
 // ox charge: horns lowered, naginata levelled like a lance, running
 ch1:{dx:3,hd:4,legs:'run1',front:1,nag:[12,46,52,40],grip:[[28,44],[42,42]],far:[[19,30],[20,40],[28,44]],near:[[49,30],[50,40],[42,42]]},
 ch2:{dx:3,hd:4,dy:-1,legs:'run2',front:1,nag:[12,46,52,40],grip:[[28,44],[42,42]],far:[[19,30],[20,40],[28,44]],near:[[49,30],[50,40],[42,42]]},
 // spear wall: lift the naginata, plant it in the ground, brace
 sw1:{dy:-1,front:1,nag:[50,56,50,14],grip:[[50,36],[50,28]],far:[[19,29],[34,30],[50,36]],near:[[49,29],[56,24],[50,28]],shout:1},
 sw2:{dy:1,front:1,nag:[52,74,52,28],grip:[[52,44],[52,36]],far:[[19,29],[36,38],[52,44]],near:[[49,29],[58,34],[52,36]],fx:'dust',dustX:52},
 sw3:{front:1,nag:[52,74,52,28],grip:[[52,44],[52,36]],far:[[19,29],[36,38],[52,44]],near:[[49,29],[58,34],[52,36]]},
 // rush: crouch, then lunge with a thrust
 ru1:{dx:-3,dy:2,legs:'crouch',nag:[58,52,16,40],far:[[19,30],[16,40],[26,44]],near:[[49,30],[52,40],[44,47]]},
 ru2:{dx:5,legs:'run1',atk:1,front:1,nag:[6,38,52,35],grip:[[24,37],[40,36]],far:[[19,29],[18,38],[24,37]],near:[[49,29],[50,38],[40,36]],fx:'speed'},
 // war stomp: knee up, then down with cracks and a dust ring
 st1:{dy:-2,legs:'lift',shout:1,nag:[16,70,14,10],far:[[19,29],[10,36],[15,44]],near:[[49,29],[60,32],[64,40]]},
 st2:{dy:1,legs:'stomp',atk:1,nag:[16,70,14,10],far:[[19,29],[10,36],[15,44]],near:[[49,29],[60,36],[62,46]],fx:'dust',dustX:44}};
// which frames play during each attack, and when: [pose names, progress points in seconds | 'run' (cycle) | 'ph' (the attack's phase)]
const AKA_ANIM={crescent:[['cr1','cr2','cr3'],[0,.55,.75]],rain:[['rn1','rn2'],[0,.5]],charge:[['ch1','ch2'],'run'],spearwall:[['sw1','sw2','sw3'],[0,.45,.7]],
 rush:[['ru1','ru2'],'ph'],stomp:[['st1','st2'],[0,.75]]};
BART['AKAGANE, THE RED OX']=Object.assign(p=>akaDraw(p,AKA_POSES[p.f===2?'atk':p.f===1?'idle1':'idle0']),{fw:72,fh:76,raw:1,sc:1.1,posed:{draw:akaDraw,poses:AKA_POSES,anim:AKA_ANIM}});


// KUSAKARI, THE REED HUNTER: a masked marsh hunter who stalks the flooded paddies. A wide sedge hat shading a dark cloth
// mask with two glowing eyes, a shaggy straw raincoat (mino) in three tiers, indigo leggings with white wraps and straw
// sandals, and a kusarigama: a sickle in one hand, its chain hanging to an iron weight in the other.
// Second form (hat cut): a wedge cut out of the hat, the eyes burning red, the coat torn, blood on the blade, the chain
// wound round his forearm.
// pose: dx/dy, b (breath), cr (crouch: bends the knees, lowers the body), legs 'stand' | 'walk1' | 'walk2' | 'leap',
// near/far arms [shoulder,elbow,hand], sk [angle] the sickle in the near hand, chain 'hang' | 'whirl' | 'trail',
// tilt (hat dips forward), flare (the coat swings out)
function hunDraw(p,Q){const {R:R_,E:E_,L:L_}=p,two=ARTHURT,ox=Q.dx||0,oy=Q.dy||0,by=Q.b||0,cr=Q.cr||0;
 const R=(x,y,w,h,c)=>R_(x+ox,y+oy,w,h,c),E=(x,y,rx,ry,c)=>E_(x+ox,y+oy,rx,ry,c),L=(a,b2,c2,d,c,t)=>L_(a+ox,b2+oy,c2+ox,d+oy,c,t);
 const S0='#2a2010',S1='#5a4422',S2='#8a6a34',S3='#b89448',S4='#e0c070',I0='#12141e',I1='#1e2234',I2='#2e3450',I3='#4a5478',
  WR='#d8d0bc',WR2='#a8a090',M1='#7a8494',M2='#c0c8d4',M3='#f0f4fa',WD='#6a4a2a',WD2='#9a7048',CH='#6a6a78',CH2='#a8a8b8',EYE=two?'#ff4030':'#ffd860';
 const cx=36,Y=v=>v+cr+by; // body parts above the hips move down with the crouch
 const seg=(x0,y0,x1,y1,w,c,lite)=>{L(x0,y0,x1,y1,I0,w+2);L(x0,y0,x1,y1,c,w);if(lite)L(x0-1,y0-1,x1-1,y1-1,lite,1);};
 const hand=(x,y)=>{E(x,y,2,2,I0);R(x-1,y-1,3,2,WR);R(x-1,y-1,2,1,'#f4ecd8');};
 // ---- legs: indigo leggings, white shin wraps, straw sandals
 const lg=Q.legs||'stand';
 const leg=(hx,hy,kx,ky,fx,fy,dir)=>{seg(hx,hy,kx,ky,5,I2,I3);seg(kx,ky,fx,fy-2,4,WR2,WR);for(let k=1;k<4;k++){const t=k/4;R(kx+(fx-kx)*t-2,ky+(fy-2-ky)*t,4,1,WR2);}
  R(fx-4+dir,fy-1,9,2,S1);R(fx-4+dir,fy-1,9,1,S3);};
 const hipY=Y(52);
 if(lg==='stand'){leg(31,hipY,27,63+cr*.5,25,73,-1);leg(41,hipY,46,63+cr*.5,48,73,1);}
 else if(lg==='walk1'){leg(31,hipY,24,64,20,73,-1);leg(41,hipY,46,62,50,73,1);}
 else if(lg==='walk2'){leg(31,hipY,30,63,28,73,-1);leg(41,hipY,42,64,40,73,1);}
 else {leg(31,hipY,24,hipY+6,30,hipY+14,-1);leg(41,hipY,50,hipY+4,46,hipY+13,1);}
 // ---- the chain and weight (behind the coat when hanging)
 const chainPts=[];
 const link=(pts)=>{for(let i=0;i<pts.length-1;i++){const [a,b]=pts[i],[c,d]=pts[i+1],n=Math.max(1,Math.round(Math.hypot(c-a,d-b)/2));for(let k=0;k<n;k++){const x=a+(c-a)*k/n,y=b+(d-b)*k/n;R(x-1,y-1,3,3,I0);}}
  let j=0;for(let i=0;i<pts.length-1;i++){const [a,b]=pts[i],[c,d]=pts[i+1],n=Math.max(1,Math.round(Math.hypot(c-a,d-b)/2));for(let k=0;k<n;k++,j++){const x=a+(c-a)*k/n,y=b+(d-b)*k/n;R(x,y,j%2?1:2,j%2?2:1,j%2?CH:CH2);}}};
 const weight=(x,y)=>{E(x,y,3,3,I0);E(x,y,2,2,CH);R(x-1,y-1,1,1,CH2);};
 // ---- straw raincoat: three shaggy tiers
 const fl=Q.flare||0;
 const tier=(y0,h,w0,w1,seed,dark)=>{for(let x=-w1;x<=w1;x++){const t=(x+w1)/(2*w1),wTop=w0,xx=cx+x,inTop=Math.abs(x)<=wTop+ (w1-wTop)*0;const top=Y(y0)+Math.round(Math.abs(x)>wTop?(Math.abs(x)-wTop)*h/(w1-wTop+1)*.8:0);
   const ragged=((x*7+seed*13)%5+5)%5,hole=two&&((x*11+seed*5)%9===0),bot=Y(y0)+h+ragged-(hole?4:0);if(bot<=top)continue;
   R(xx,top-1,1,bot-top+2,S0);const c=((x+seed)%3===0)?S1:((x+seed)%3===1)?(dark?S2:S3):(dark?S1:S2);R(xx,top,1,bot-top,c);if((x+seed)%4===0)R(xx,top,1,Math.max(1,Math.round((bot-top)*.4)),dark?S3:S4);}};
 tier(42,15,10,18+fl,3,1);            // bottom tier, to the knees
 tier(33,13,9,15+fl,7,0);             // middle tier
 // ---- far arm (behind the shoulder cape)
 const arm=(A,c)=>{if(!A)return;const [[sx2,sy2],[ex,ey],[hx2,hy2]]=A;seg(sx2,Y(sy2),ex,Y(ey),4,c,I3);seg(ex,Y(ey),hx2,Y(hy2),3,c,I3);R((ex+hx2)/2-1,Y((ey+hy2)/2),3,1,WR);hand(hx2,Y(hy2));};
 const ch=Q.chain||'hang',far=Q.far||[[26,30],[20,40],[22,48]],near=Q.near||[[46,30],[52,40],[50,48]];
 arm(far,I1);
 // the chain: from the far hand down and up to the sickle's butt, or whirled overhead
 const fh=[far[2][0],Y(far[2][1])],nh=[near[2][0],Y(near[2][1])];
 if(ch==='hang'){link([fh,[fh[0]-1,fh[1]+8],[fh[0]+6,fh[1]+14],[cx+6,Y(60)],[nh[0]+1,nh[1]+6],nh]);weight(fh[0]-2,fh[1]+10);}
 // shoulder cape (top tier) over the arms' roots
 tier(25,11,7,13+fl,11,0);
 // ---- head: cloth mask, hood
 const tilt=Q.tilt||0,hx=cx+tilt,hy=Y(20)+Math.abs(tilt);
 E(hx,hy+1,6,6,I0);E(hx,hy+1,5,5,I1);R(hx-4,hy+3,9,3,I2);for(let i=-3;i<=3;i+=2)R(hx+i,hy+4,1,2,I1);
 R(hx-3,hy,2,1,EYE);R(hx+2,hy,2,1,EYE);if(two){R(hx-4,hy-1,1,1,'#ff9060');R(hx+4,hy-1,1,1,'#ff9060');}
 // ---- the sedge hat: a wide shallow cone, woven rings, a dark band
 const hb=hy-3,ap=[hx+tilt,hb-11];
 for(let r=0;r<=11;r++){const y=hb-r,w=Math.round(19*(1-r/11.5)),lft=hx-w+Math.round(tilt*r/11),rt=hx+w+Math.round(tilt*r/11);if(w<1)continue;
  R(lft-1,y,rt-lft+3,1,S0);}
 for(let r=0;r<=10;r++){const y=hb-r,w=Math.round(18*(1-r/11.5)),off=Math.round(tilt*r/11);if(w<1)continue;
  for(let x=-w;x<=w;x++){const c=(r%3===0)?S2:(x<-w*.2?S4:x<w*.4?S3:S2);R(hx+x+off,y,1,1,c);}}
 R(hx-19,hb+1,39,1,S0);R(hx-18,hb,37,1,S1);
 for(let r=2;r<=9;r+=3){const w=Math.round(18*(1-r/11.5));R(hx-w+Math.round(tilt*r/11),hb-r,w*2,1,S1);}
 R(ap[0]-1,ap[1]-1,3,2,S1);R(ap[0],ap[1]-1,1,1,S4);
 if(two){// a wedge cut out of the brim, the cut edges frayed
  for(let i=0;i<=8;i++){const w=Math.max(1,Math.round((8-i)*.7));R(hx+6+i-Math.floor(w/2),hb-i,w+1,1,I0);}
  for(let i=0;i<5;i++)R(hx+16+i,hb+1-i%2,1,2,S4);R(hx+9,hb-2,2,1,'#ff4030');}
 // ---- near arm with the sickle
 arm(near,I2);
 const sk=Q.sk!=null?Q.sk:-1.4,[shx,shy]=nh,hl=11,tx=shx+Math.cos(sk)*hl,ty=shy+Math.sin(sk)*hl;
 seg(shx-Math.cos(sk)*2,shy-Math.sin(sk)*2,tx,ty,2,WD,WD2);
 // the blade: a hooked crescent at right angles to the handle
 const ba=sk+Math.PI/2*(Q.flip?-1:1);for(let k=0;k<=9;k++){const t=k/9,bend=Math.sin(t*Math.PI*.9)*3,x=tx+Math.cos(ba)*k*1.1+Math.cos(sk)*(bend-1),y=ty+Math.sin(ba)*k*1.1+Math.sin(sk)*(bend-1);
  R(x-1,y-1,3,3,I0);}
 for(let k=0;k<=9;k++){const t=k/9,bend=Math.sin(t*Math.PI*.9)*3,x=tx+Math.cos(ba)*k*1.1+Math.cos(sk)*(bend-1),y=ty+Math.sin(ba)*k*1.1+Math.sin(sk)*(bend-1);
  R(x,y,2,1,k>6?M3:M2);R(x,y+1,1,1,two&&k>3?'#c02020':M1);}
 hand(shx,shy);
 // whirling chain overhead, or trailing behind in a leap
 if(ch==='whirl'){const wx=fh[0]-4,wy=fh[1]-6,pts=[];for(let i=0;i<=14;i++){const a=i/14*TAU*.85-1;pts.push([wx+Math.cos(a)*13,wy+Math.sin(a)*5]);}link([fh,...pts]);const a=TAU*.85-1;weight(wx+Math.cos(a)*13,wy+Math.sin(a)*5);
  for(let i=0;i<6;i++){const a2=-1-i*.25;R(wx+Math.cos(a2)*15,wy+Math.sin(a2)*6,2,1,'#d8dce8');}}
 if(ch==='trail'){link([fh,[fh[0]-8,fh[1]+4],[fh[0]-15,fh[1]+2],[fh[0]-22,fh[1]+6]]);weight(fh[0]-23,fh[1]+7);}
 if(two&&ch!=='whirl'){for(let i=0;i<3;i++)R(far[1][0]-2+i,Y(far[1][1])+2+i*2,3,1,CH2);}
}
const HUN_POSES={
 idle0:{cr:2},
 idle1:{cr:3,b:0},
 atk:{chain:'whirl',far:[[26,30],[16,24],[18,16]],near:[[46,30],[54,36],[58,30]],sk:-.6,tilt:1},
 pr1:{cr:7,legs:'walk1',tilt:3,near:[[46,32],[54,42],[56,50]],sk:.4,far:[[26,32],[22,42],[26,50]]},
 pr2:{cr:6,legs:'walk2',tilt:3,b:1,near:[[46,32],[54,42],[56,50]],sk:.4,far:[[26,32],[22,42],[26,50]]},
 pounce:{dy:-4,legs:'leap',flare:4,chain:'trail',near:[[46,30],[52,18],[46,8]],sk:-2.2,far:[[26,30],[16,32],[12,38]],tilt:2}};
BART['KUSAKARI, THE REED HUNTER']=Object.assign(p=>hunDraw(p,HUN_POSES[p.f===2?'atk':p.f===1?'idle1':'idle0']),{fw:72,fh:78,raw:1,sc:1.1,posed:{draw:hunDraw,poses:HUN_POSES,anim:{},roar:'atk',
  // ready stance when still, a low creep while he stalks, the chain whirled overhead as he winds up, the sickle high in the leap
  pick:(e,ix)=>e.phx?ix.atk:e.air?ix.pounce:(e.A?.wind||e.EV?.strike?.wind)?ix.atk:e.moving?(Math.floor(time*5)%2?ix.pr2:ix.pr1):(Math.floor(time*1.5)%2?ix.idle1:ix.idle0)}});

// ---- the posed sheet: idle, breathing and attack frames first (so everything that reads frames 0-2 still works),
// then every pose, and a picker that plays the right frames for the attack under way
{const _ba=bossArt;bossArt=function(name){const D=BART[name];if(!D||!D.posed)return _ba.apply(this,arguments);
 const PS=D.posed,names=['idle0','idle1','atk',...Object.keys(PS.poses).filter(k=>!['idle0','idle1','atk'].includes(k))],FW=D.fw,FH=D.fh,N=names.length;
 const sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d'),idx={};
 names.forEach((nm,f)=>{idx[nm]=f;const fr=mk(FW,FH,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
   const E=(cx2,cy2,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y/ry)**2)));R(cx2-w,cy2+y,w*2+1,1,c);}};
   const L=(x0,y0,x1,y1,c,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,t||1,t||1,c);};
   PS.draw({R,E,L,f,b:0,atk:false,sh:(c,k)=>shade(c,k==null?-.3:k)},PS.poses[nm]);});sg.drawImage(outlined(fr),f*FW,0);});
 const pick=e=>{if(PS.pick){const r=PS.pick(e,idx);if(r!=null)return r;}const A=e.A,an=A&&PS.anim[A.nm||A.n];
  if(e.phx){const r=idx[PS.roar||'rn1'];return r!=null?r:2;} // roaring through the transformation
  if(an){const [fr,tm]=an,t=A.t||0;if(tm==='run')return idx[fr[Math.floor(t*8)%fr.length]];if(tm==='ph')return idx[fr[Math.min(fr.length-1,A.ph||0)]];let k=0;for(let i=0;i<tm.length;i++)if(t>=tm[i]*(1/(e.spdK||1)))k=i;return idx[fr[k]];}
  if(e.act||e.storm>0)return 2;return Math.floor(time*2.5)%2;};
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:D.sc||1.05,ok:true,bossSpr:1,pick};};}

