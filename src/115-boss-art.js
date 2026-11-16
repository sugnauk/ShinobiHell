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


// THE WHITE TIGER: a sacred temple beast seen three ways over the fight.
//  SEATED  when still: upright like a shrine guardian, tail curled round the front paws, facing you.
//  PROWL   while he stalks: side on, long and low, shoulders up, head down, tail held low.
//  LUNGE   when he strikes or pounces: three-quarter on, coming at the camera, paws reaching, jaws open.
// White fur shaded to ice-blue, bold ink stripes, the forehead mark, a shimenawa rope with paper streamers and a bronze
// bell. Second form (seal broken): the rope snapped, red eyes, ruff bristling and ice-blue spirit flames.
function tigDraw(p,Q){const {R:R_,E:E_,L:L_}=p,two=ARTHURT,ox=Q.dx||0,oy=Q.dy||0,by=Q.b||0;
 const R=(x,y,w,h,c)=>R_(x+ox,y+oy,w,h,c),E=(x,y,rx,ry,c)=>E_(x+ox,y+oy,rx,ry,c),L=(a,b2,c2,d,c,t)=>L_(a+ox,b2+oy,c2+ox,d+oy,c,t);
 const F0='#1a1e2c',F1='#566a84',F2='#93a9c0',F3='#cad8e2',F4='#eef3f2',F5='#ffffff',INK='#161824',
  RP='#c8a458',RP2='#8a6a2c',RP3='#f0d890',PAPER='#f4f0e4',BR='#a06a28',BR2='#e0a848',PINK='#d88898',EYE=two?'#ff4a30':'#8ae8ff';
 // shaded masses, limbs and paws (light from the upper left)
 const blob=(x,y,rx,ry,dim)=>{E(x,y,rx+1,ry+1,F0);E(x,y,rx,ry,dim?F1:F2);E(x-1,y-1,rx-2,ry-2,dim?F2:F3);E(x-Math.round(rx*.3),y-Math.round(ry*.35),Math.max(1,Math.round(rx*.45)),Math.max(1,Math.round(ry*.4)),dim?F3:F4);};
 const limb=(x0,y0,x1,y1,w,dim)=>{L(x0,y0,x1,y1,F0,w+2);L(x0,y0,x1,y1,dim?F1:F2,w);L(x0-1,y0,x1-1,y1,dim?F2:F3,Math.max(1,w-3));if(!dim)L(x0-Math.floor(w/2),y0,x1-Math.floor(w/2),y1,F4,1);};
 const band=(x0,y0,x1,y1,t,w)=>{const x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;R(x-Math.floor(w/2),y,w,1,INK);R(x-Math.floor(w/2)+1,y+1,w-2,1,INK);};
 const paw=(x,y,dim)=>{E(x,y,5,3,F0);E(x,y-1,4,2,dim?F2:F4);R(x-2,y,1,1,F1);R(x+1,y,1,1,F1);R(x+3,y-1,1,1,F1);};
 const claws=(x,y,up)=>{for(const k of [-3,-1,1,3]){L(x+k,y,x+k+Math.sign(k),y+(up?-4:4),F0,2);L(x+k,y+(up?-1:1),x+k+Math.sign(k),y+(up?-4:4),F5,1);}};
 const tailDraw=(pts)=>{for(let i=0;i<pts.length-1;i++){const [a,b]=pts[i],[c,d]=pts[i+1];L(a,b,c,d,F0,5);}
  for(let i=0;i<pts.length-1;i++){const [a,b]=pts[i],[c,d]=pts[i+1],tip=i>=pts.length-2;L(a,b,c,d,tip?INK:F3,3);if(!tip){L(a,b-1,c,d-1,F4,1);if(i%2)R((a+c)/2-1,(b+d)/2-1,3,3,INK);}}};
 const flame=(x,y,h)=>{for(let i=0;i<h;i++){const w=Math.max(1,Math.round((h-i)/h*4)),xx=x+Math.round(Math.sin(i*.7+x)*1.2);R(xx-Math.floor(w/2),y-i,w,1,i<h*.4?'#4ab0f0':i<h*.75?'#8ad8ff':'#e0f8ff');}};
 const shide=(x,y)=>{R(x,y,3,2,PAPER);R(x+1,y+2,3,2,PAPER);R(x,y+4,3,2,PAPER);R(x+1,y+6,2,1,PAPER);R(x+1,y+2,1,1,'#c8c0a8');};
 const rope=(x0,y0,x1,y1,sag)=>{const n=12,pt=t=>[x0+(x1-x0)*t,y0+(y1-y0)*t+Math.sin(t*Math.PI)*sag];for(let i=0;i<=n;i++){const [x,y]=pt(i/n);R(x-1,y-1,3,4,F0);}for(let i=0;i<=n;i++){const [x,y]=pt(i/n);R(x-1,y,3,2,i%2?RP2:RP);R(x,y,1,1,RP3);}};
 const bell=(x,y)=>{E(x,y,3,3,F0);E(x,y,2,2,BR);R(x-1,y-1,2,1,BR2);R(x,y+2,1,1,F0);};
 // a face seen from the front (turn 0) or three-quarter on (turn 1, looking down-right)
 const face=(hx,hy,turn,m)=>{const k=s=>s<0?1-.45*turn:1+.05*turn,X=(s,d)=>Math.round(hx+s*d*k(s)+turn*3),mx=hx+Math.round(turn*5);
  for(const s of [-1,1]){if(s<0&&turn>.5)continue;for(let i=0;i<4;i++){const y=hy+i*3-1,len=(two?15:13);L(X(s,8),y,X(s,len),y+3,F0,5);L(X(s,8),y,X(s,len-1),y+3,i%2?F3:F4,3);}
   if(two)R(X(s,15)-1,hy+3,2,1,F5);}
  for(const s of [-1,1]){const ex=X(s,9),ey=hy-9;E(ex,ey,s<0?3:4,4,F0);E(ex,ey,s<0?2:3,3,INK);E(ex,ey+1,s<0?1:2,2,F4);R(ex,ey+1,1,1,PINK);}
  E(hx+turn*2,hy,12-turn,10,F0);E(hx+turn*2,hy,11-turn,9,F3);E(hx+turn*2-1,hy-2,9-turn,6,F4);R(hx-4+turn*2,hy-8,8,1,F5);
  R(mx-2,hy-7,5,1,INK);R(mx-2,hy-5,5,1,INK);R(mx,hy-7,1,4,INK);
  for(const s of [-1,1]){L(X(s,4),hy-6,X(s,8),hy-4,INK,1);L(X(s,8),hy+1,X(s,11),hy+2,INK,2);}
  for(const s of [-1,1]){const ex=X(s,5)-(s<0?3:0),w=s<0&&turn>.5?3:4;R(ex,hy-1,w,3,INK);R(ex+(s<0?1:0),hy-1,w-1,2,EYE);R(ex+(s<0?w-2:1),hy-1,1,2,INK);R(ex+(s<0?1:2),hy-1,1,1,F5);R(ex-1,hy-2,w+2,1,F1);}
  E(mx,hy+5,6,4,F0);E(mx-3,hy+5,3,3,F5);E(mx+3,hy+5,3,3,F4);R(mx-2,hy+2,5,2,PINK);R(mx-1,hy+4,3,1,PINK);R(mx,hy+5,1,2,INK);
  for(const s of [-1,1])L(mx+s*6,hy+5,mx+s*9,hy+5,F5,1);
  if(m){const jy=m===2?5:3;R(mx-4,hy+7,9,jy,INK);R(mx-3,hy+8,7,jy-1,'#6a1820');R(mx-3,hy+7,1,2,F5);R(mx+3,hy+7,1,2,F5);if(m===2){R(mx-3,hy+6+jy,1,2,F5);R(mx+3,hy+6+jy,1,2,F5);}E(mx,hy+9+jy,4,2,F0);E(mx,hy+9+jy,3,1,F4);}
  else{R(mx-3,hy+8,3,1,INK);R(mx+1,hy+8,3,1,INK);E(mx,hy+10,4,2,F4);}};
 // a face in profile, looking right
 const profile=(hx,hy,m)=>{E(hx-6,hy+3,7,7,F0);E(hx-6,hy+3,6,6,F2);for(let i=0;i<3;i++){L(hx-8,hy+i*3,hx-14,hy+2+i*3,F0,4);L(hx-8,hy+i*3,hx-13,hy+2+i*3,F3,2);}
  E(hx-4,hy-7,3,3,F0);E(hx-4,hy-7,2,2,INK);R(hx-4,hy-7,1,1,F5);
  E(hx,hy,10,8,F0);E(hx,hy,9,7,F3);E(hx+1,hy-2,7,5,F4);R(hx-3,hy-6,6,1,F5);R(hx-1,hy-5,4,1,INK);R(hx-1,hy-3,4,1,INK);
  L(hx-6,hy,hx-2,hy+1,INK,1);L(hx-5,hy+3,hx-2,hy+4,INK,1);
  R(hx+2,hy-1,5,2,INK);R(hx+3,hy-1,3,1,EYE);R(hx+5,hy-1,1,1,INK);R(hx+2,hy-2,5,1,F1);
  E(hx+8,hy+3,5,3,F0);E(hx+8,hy+3,4,2,F4);R(hx+6,hy+1,4,1,F5);R(hx+11,hy,3,2,PINK);
  if(m){const jy=m===2?4:2;R(hx+4,hy+5,9,2+jy,INK);R(hx+5,hy+6,7,jy,'#6a1820');R(hx+10,hy+5,1,2,F5);R(hx+5,hy+5,1,2,F5);E(hx+7,hy+8+jy,4,2,F0);E(hx+7,hy+8+jy,3,1,F3);}
  else{L(hx+6,hy+5,hx+11,hy+4,INK,1);E(hx+6,hy+7,3,1,F3);}};
 const v=Q.view||'sit';
 if(v==='sit'){const cx=42;
  // tail curled round the front paws
  tailDraw([[58,52],[63,57],[60,61],[50,62],[38,62],[29,61],[25,58]]);
  // haunches and hind paws
  for(const s of [-1,1]){blob(cx+s*14,49+by,9,10,s>0);for(const a of [-.9,-.2,.5])L(cx+s*14+Math.cos(a)*s*5,49+by+Math.sin(a)*6,cx+s*14+Math.cos(a)*s*9,49+by+Math.sin(a)*9,INK,1);paw(cx+s*20,60,s>0);}
  // upright chest and shoulders
  blob(cx,40+by,12,15);E(cx,42+by,7,10,F4);E(cx-2,38+by,3,5,F5);for(let i=0;i<3;i++){R(cx-4+i*3,51+by+i%2,2,2,F3);}
  for(const s of [-1,1]){L(cx+s*9,30+by,cx+s*12,34+by,INK,1);L(cx+s*10,36+by,cx+s*13,39+by,INK,1);}
  // straight front legs
  for(const s of [-1,1]){const x=cx+s*7;limb(x,38+by,x,58,5,s>0);band(x,38+by,x,58,.45,5);band(x,38+by,x,58,.72,5);paw(x,60,s>0);}
  // rope, streamers and bell
  if(!two){rope(cx-12,27+by,cx+12,27+by,5);shide(cx-9,31+by);shide(cx+7,31+by);bell(cx,34+by);}
  else{rope(cx-12,27+by,cx-2,32+by,1);L(cx-2,33+by,cx,39+by,RP2,2);shide(cx-9,31+by);R(cx+10,28+by,3,2,RP);R(cx+12,30+by,2,3,RP2);}
  face(cx,16+by,0,Q.mouth||0);
  if(two){flame(cx-17,40+by,8);flame(cx+17,40+by,9);flame(cx+21,58,6);}}
 else if(v==='prowl'){const st=Q.step||0,hip=[22,42+by],sh=[52,38+by],lerp=(a2,b3,t)=>a2+(b3-a2)*t;
  // low tail behind, nearly level
  tailDraw([[16,40],[10,42],[5,45],[2,49],[1,53]].map(([x,y])=>[x,y+by]));
  // far legs
  limb(26,44,23+st*3,60,4,1);paw(23+st*3,61,1);limb(55,42,59-st*3,60,4,1);paw(60-st*3,61,1);
  // body: one shaded capsule, shoulders high, haunch lower
  const cap=(sh2,offy,c)=>{for(let i=0;i<=12;i++){const t=i/12,x=lerp(hip[0],sh[0],t),y=lerp(hip[1],sh[1],t)-Math.sin(t*Math.PI)*1.5,r=lerp(8,9,t)-sh2;if(r>0)E(x,y+offy,r+3,r*.85,c);}};
  cap(-1,0,F0);cap(0,0,F1);cap(1.2,-1,F2);cap(3,-2,F3);cap(5.5,-3,F4);
  for(let i=1;i<12;i++){const t=i/12,x=lerp(hip[0],sh[0],t),y=lerp(hip[1],sh[1],t)-Math.sin(t*Math.PI)*1.5-Math.round(lerp(8,9,t)*.85)+1;R(x-2,y,4,1,F5);}
  // stripes: tapered wedges over the back
  for(const [t,len,lean] of [[.1,10,-3],[.25,12,-3],[.4,9,-2],[.55,12,-2],[.7,9,-1],[.85,7,0]]){const x=Math.round(lerp(hip[0],sh[0],t)),y=Math.round(lerp(hip[1],sh[1],t)-Math.sin(t*Math.PI)*1.5-lerp(8,9,t)*.85)+1;
   for(let k=0;k<len;k++){const q=k/len;R(x+Math.round(lean*q*q),y+k,q<.5?2:1,1,INK);}}
  for(let i=0;i<5;i++)R(27+i*5,47+by,3,1,F3);
  // near legs, stepping
  limb(23,45+by,19-st*3,60,5);band(23,45,19-st*3,60,.55,5);paw(19-st*3,61);
  limb(51,42+by,55+st*4,60,5);band(51,42,55+st*4,60,.45,5);band(51,42,55+st*4,60,.72,5);paw(56+st*4,61);
  // neck and head, carried low
  E(60,40+by,7,7,F0);E(60,40+by,6,6,F2);E(59,38+by,4,3,F3);
  if(!two){rope(57,32+by,61,46+by,0);shide(54,38+by);bell(62,48+by);}else{rope(57,32+by,59,39+by,0);L(59,40+by,56,45+by,RP2,2);}
  profile(69,41+by+(Q.hdy||0),Q.mouth||0);
  if(two){flame(48,29+by,8);flame(1,52+by,6);}}
 else{ // lunge: three-quarter on, coming at you
  const pp=Q.paws||[[47,60],[66,60]],air=Q.air;
  tailDraw([[24,16],[16,12],[10,6],[8,1]].map(([x,y])=>[x,y+by]));
  // haunches receding up-left, hind leg
  blob(26,20+by,9,8,1);limb(22,24,air?12:18,air?30:36,4,1);paw(air?12:18,air?31:37,1);
  // body coming toward the camera
  for(let i=0;i<=8;i++){const t=i/8,x=28+t*20,y=22+t*10+by;E(x,y,9,8,F0);}
  for(let i=0;i<=8;i++){const t=i/8,x=28+t*20,y=22+t*10+by;E(x,y,8,7,F2);E(x-2,y-2,6,4,F3);R(x-3,y-7,5,1,F4);}
  for(const [x,y] of [[30,16],[36,19],[42,22]]){L(x,y+by,x-2,y+8+by,INK,2);}
  blob(46,32+by,10,10);
  // front legs reaching, from under the chin
  const [[ax,ay],[bx,by2]]=pp;limb(42,38+by,ax,ay-2,6,1);band(42,38,ax,ay-2,.6,6);
  limb(56,40+by,bx,by2-2,6);band(56,40,bx,by2-2,.75,6);
  if(!two){rope(40,30+by,58,40+by,3);shide(46,36+by);}else{rope(40,30+by,48,36+by,1);L(48,37+by,46,42+by,RP2,2);}
  face(58,31+by,1,Q.mouth||2);
  paw(ax,ay,1);claws(ax,ay+(air?-2:1),air);paw(bx,by2);claws(bx,by2+(air?-2:1),air);
  if(two){flame(36,14+by,8);flame(8,4+by,6);}}
}
const TIG_POSES={
 idle0:{view:'sit'},
 idle1:{view:'sit',b:1},
 atk:{view:'lunge',mouth:2},
 pr1:{view:'prowl',step:0},
 pr2:{view:'prowl',step:1,b:1},
 pounce:{view:'lunge',air:1,dy:-2,mouth:2,paws:[[40,40],[78,38]]}};
BART['THE WHITE TIGER']=Object.assign(p=>tigDraw(p,TIG_POSES[p.f===2?'atk':p.f===1?'idle1':'idle0']),{fw:84,fh:64,raw:1,sc:1.05,posed:{draw:tigDraw,poses:TIG_POSES,anim:{},roar:'atk',
  // seated when still, prowling while he stalks, three-quarter lunge as he winds up, paws out in the air
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

