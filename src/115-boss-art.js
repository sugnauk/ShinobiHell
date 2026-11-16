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


// KAMAKIRI, THE REED MANTIS: a giant praying mantis, reed-green and straw-gold, that hunts the flooded paddies.
// Three-quarter view, facing right. The triangular head with two great compound eyes and long antennae, a long upright
// neck, the raptorial forelegs folded in prayer (spined femurs, hooked tibiae), four thin walking legs, folded leaf wings
// over a segmented abdomen. Second form (wings spread): the wings flare open in a threat display with eye-spots, the
// eyes turn red and the scythes edge in red.
// pose: dx/dy, b (breath), lean (neck tilt forward), head [x,y], arms 'fold' | 'raise' | 'reach', legs 'stand' | 'step1' |
// 'step2' | 'leap', wings 'fold' | 'buzz' (half open, in flight)
function manDraw(p,Q){const {R:R_,E:E_,L:L_}=p,two=ARTHURT,ox=Q.dx||0,oy=Q.dy||0,by=Q.b||0;
 const R=(x,y,w,h,c)=>R_(x+ox,y+oy,w,h,c),E=(x,y,rx,ry,c)=>E_(x+ox,y+oy,rx,ry,c),L=(a,b2,c2,d,c,t)=>L_(a+ox,b2+oy,c2+ox,d+oy,c,t);
 const G0='#14240f',G1='#2e4a1e',G2='#4e7a2a',G3='#7eaa3a',G4='#b8d860',G5='#e8f8a0',ST='#c8a850',ST2='#e8d080',
  SP=two?'#ff6050':'#f0e8b0',EYE=two?'#e03020':'#e0a030',EYE2=two?'#ff8060':'#ffe080';
 const seg=(x0,y0,x1,y1,w,dim)=>{L(x0,y0,x1,y1,G0,w+2);L(x0,y0,x1,y1,dim?G1:G2,w);if(w>2)L(x0,y0-1,x1,y1-1,dim?G2:G3,Math.max(1,w-2));if(!dim&&w>2)L(x0-1,y0-1,x1-1,y1-1,G4,1);};
 const dot=(x,y,c)=>R(x,y,1,1,c);
 const lg=Q.legs||'stand',arms=Q.arms||'fold',lean=Q.lean||0;
 // where the body sits for each stance
 const low=lg==='step1'||lg==='step2'?5:lg==='leap'?-2:0,th=[40,46+low+by],nk=[50+lean,24+low+by+Math.round(lean*.5)],hd=Q.head||[nk[0]+5+lean*.3,nk[1]-7];
 // ---- open wings (second form threat display, or buzzing in a leap) behind everything
 const wingOpen=two||Q.wings==='buzz';
 if(wingOpen){const fan=(ang0,ang1,r,col1,col2,spot)=>{for(let a=ang0;a<=ang1;a+=.04){const x=th[0]-2+Math.cos(a)*r,y=th[1]-4+Math.sin(a)*r;L(th[0]-2,th[1]-4,x,y,G0,3);}
    for(let a=ang0+.03;a<=ang1-.03;a+=.04){const x=th[0]-2+Math.cos(a)*(r-1),y=th[1]-4+Math.sin(a)*(r-1);L(th[0]-2,th[1]-4,x,y,Math.round(a*12)%3?col1:col2,1);}
    if(spot){const a=(ang0+ang1)/2,sx2=th[0]-2+Math.cos(a)*r*.62,sy2=th[1]-4+Math.sin(a)*r*.62;E(sx2,sy2,4,4,G0);E(sx2,sy2,3,3,'#f0d040');E(sx2,sy2,2,2,'#401018');R(sx2-1,sy2-2,1,1,'#ffffff');}};
  if(Q.wings==='buzz'&&!two){fan(-2.9,-2.1,26,'#a8c890','#d8f0c0',0);fan(-2.4,-1.7,24,'#c8e0b0','#e8f8d8',0);}
  else{fan(-3.05,-2.0,32,'#5a3a5a','#8a4a6a',1);fan(-2.35,-1.45,30,'#6a4a3a','#b06a50',1);}}
 // ---- far walking legs
 const legsFar={stand:[[[38,48],[30,42],[24,70]],[[44,48],[52,44],[58,70]]],step1:[[[38,50],[28,46],[20,70]],[[44,50],[54,47],[62,70]]],step2:[[[38,50],[31,45],[27,70]],[[44,50],[51,46],[54,70]]],leap:[[[38,44],[26,50],[16,58]],[[44,44],[38,54],[30,62]]]}[lg];
 const legsNear={stand:[[[36,50],[26,44],[18,70]],[[46,50],[56,46],[64,70]]],step1:[[[36,52],[27,47],[24,70]],[[46,52],[55,48],[58,70]]],step2:[[[36,52],[24,48],[16,70]],[[46,52],[57,49],[66,70]]],leap:[[[36,46],[22,52],[10,60]],[[46,46],[36,56],[26,64]]]}[lg];
 const walk=([[a,b],[c,d],[e,f]],dim)=>{const yb=lg==='leap'?0:low+by;seg(a,b+yb,c,d+yb,2,dim);seg(c,d+yb,e,f,1,dim);R(e-1,f,3,1,G0);};
 for(const l of legsFar)walk(l,1);
 // ---- abdomen: segmented, sloping down and back
 const ab=lg==='leap'?[[38,44],[30,44],[22,45],[15,46],[10,47]]:[[38,46+low],[31,49+low],[24,52+low],[18,55+low],[13,57+low]];
 ab.forEach(([x,y],i)=>{const r=7-i;E(x,y+by,r+3,r+1,G0);});
 ab.forEach(([x,y],i)=>{const r=7-i;E(x,y+by,r+2,r,G2);E(x,y+by-1,r+1,r-1,G3);R(x-r,y+by+r-1,r*2,1,G1);if(i)R(x+r+1,y+by-r+1,1,r*2-1,G1);});
 // folded leaf wings along the back (first form, standing or stalking)
 if(!wingOpen){const [x0,y0]=[th[0]+2,th[1]-6],[x1,y1]=[ab[4][0]-4,ab[4][1]-2+by];for(let k=-3;k<=3;k++)L(x0,y0+k*.4,x1,y1+k,G0,1);
  for(let k=-2;k<=2;k++)L(x0,y0+k*.4,x1,y1+k,k<0?G4:k?G3:G5,1);L(x0-2,y0+1,x1+2,y1+3,G2,1);for(let i=1;i<5;i++){const t=i/5;dot(x0+(x1-x0)*t,y0+(y1-y0)*t+1,G2);}
  R(x0-6,y0,3,2,'#e8e8a0');}
 // ---- thorax and the long neck
 E(th[0]+2,th[1]-3+(lg==='leap'?-2:0),6,5,G0);E(th[0]+2,th[1]-3+(lg==='leap'?-2:0),5,4,G2);E(th[0]+1,th[1]-5+(lg==='leap'?-2:0),3,2,G3);
 seg(th[0]+4,th[1]-6,nk[0],nk[1],4);R(nk[0]-1,nk[1]+2,3,1,G4);
 for(const l of legsNear)walk(l,0);
 // ---- the far raptorial foreleg (behind the head)
 const fore=(dim,off)=>{const o=off||0,[sx2,sy2]=[nk[0]+1+o,nk[1]+3];let cxk,cyk,fx,fy,tx,ty;
  if(arms==='fold'){cxk=sx2+8;cyk=sy2+11;fx=sx2+13;fy=sy2-3;tx=sx2+10;ty=sy2+9;}
  else if(arms==='raise'){cxk=sx2+6;cyk=sy2+7;fx=sx2+11;fy=sy2-14;tx=sx2+22;ty=sy2-6;}
  else{cxk=sx2+6;cyk=sy2+4;fx=sx2+18;fy=sy2+1;tx=sx2+30;ty=sy2+6;}
  cxk+=o;fx+=o;tx+=o;
  seg(sx2,sy2,cxk,cyk,3,dim);                                 // coxa
  seg(cxk,cyk,fx,fy,5,dim);                                   // femur, spined on the inner edge
  const n=6;for(let i=1;i<n;i++){const t=i/n,x=cxk+(fx-cxk)*t,y=cyk+(fy-cyk)*t,a=Math.atan2(fy-cyk,fx-cxk)+(arms==='fold'?-1.57:1.57);L(x,y,x+Math.cos(a)*3,y+Math.sin(a)*3,SP,1);}
  seg(fx,fy,tx,ty,2,dim);                                     // tibia
  const a=Math.atan2(ty-fy,tx-fx);L(tx,ty,tx+Math.cos(a+1.4)*4,ty+Math.sin(a+1.4)*4,ST2,1);dot(tx,ty,ST2);  // the hook
  if(two)L(cxk,cyk,fx,fy,'#c03028',1);
  if(!dim)R(cxk-1,cyk-1,2,2,G4);};
 fore(1,-3);
 // ---- head: a wide triangle, two great compound eyes, antennae sweeping back, mandibles
 const [hx,hy]=hd;
 L(hx-3,hy-4,hx-14,hy-18,G0,2);L(hx-3,hy-4,hx-13,hy-18,ST,1);L(hx+2,hy-5,hx-6,hy-22,G0,2);L(hx+2,hy-5,hx-5,hy-22,ST2,1);
 E(hx,hy,7,4,G0);E(hx,hy,6,3,G3);L(hx-5,hy+1,hx,hy+8,G0,3);L(hx+5,hy+1,hx,hy+8,G0,3);L(hx-4,hy+1,hx,hy+7,G3,1);L(hx+4,hy+1,hx,hy+7,G2,1);R(hx-3,hy+1,7,3,G3);R(hx-2,hy+4,5,2,G2);
 for(const s of [-1,1]){const ex=hx+s*6,ey=hy-1;E(ex,ey,4,4,G0);E(ex,ey,3,3,EYE);E(ex-1,ey-1,2,2,EYE2);R(ex+(s>0?0:-1),ey,1,2,two?'#300808':'#2a1a08');R(ex-2,ey-2,1,1,'#ffffff');}
 R(hx-1,hy-4,3,2,G4);dot(hx,hy-2,G5);
 R(hx-1,hy+7,3,2,G1);if(Q.open){R(hx-2,hy+8,1,2,ST2);R(hx+2,hy+8,1,2,ST2);R(hx-1,hy+9,3,1,'#401010');}
 // ---- the near raptorial foreleg in front
 fore(0,0);
}
const MAN_POSES={
 idle0:{},
 idle1:{b:1,head:[56,16]},
 atk:{arms:'raise',lean:-2,open:1,dy:-1},
 pr1:{legs:'step1',lean:5},
 pr2:{legs:'step2',lean:5,b:1},
 pounce:{legs:'leap',arms:'reach',lean:8,wings:'buzz',open:1,dy:-4}};
BART['KAMAKIRI, THE REED MANTIS']=Object.assign(p=>manDraw(p,MAN_POSES[p.f===2?'atk':p.f===1?'idle1':'idle0']),{fw:84,fh:74,raw:1,sc:1.05,posed:{draw:manDraw,poses:MAN_POSES,anim:{},roar:'atk',
  // praying when still, low and stalking while it moves, scythes raised as it winds up, reaching out in the leap
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

