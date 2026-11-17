'use strict';
// ===== LORD KUROGANE, THE BLACK HORSE GENERAL: the general himself (the horse comes later) =====
// Black lacquered armour laced in deep blue and trimmed in gold; a white jinbaori (a commander's sleeveless surcoat)
// flaring from his shoulders; a ridged black helmet with a flared neck guard and a great thin gold crescent; a black iron
// mask with a silver moustache and eyes glowing in its shadow; fur boots; a cross-bladed jumonji yari with a black tassel.
// Second form: the crescent snapped, the mask cracked half away from a scarred face, the surcoat torn and bloodied,
// the spear broken and a katana drawn.
// Canvas 80x100, centre x 40, feet on y 97.
function kgDraw(p,Q){const {R:R_,E:E_,L:L_}=p,two=ARTHURT,ox=Q.dx||0,oy=(Q.dy||0)+10,by=Q.b||0;
 const R=(x,y,w,h,c)=>R_(x+ox,y+oy,w,h,c),E=(x,y,rx,ry,c)=>E_(x+ox,y+oy,rx,ry,c),L=(a,b,c,d,col,t)=>L_(a+ox,b+oy,c+ox,d+oy,col,t);
 const O=OUTC,K1='#1a1a24',K2='#2c2c3c',K3='#4a4a62',K4='#70708c',BL='#24357a',BL2='#4a6ad0',G1='#9a7420',G2='#d8b040',G3='#fff0a0',
  W1='#7a766e',W2='#b8b4ac',W3='#e6e2da',W4='#ffffff',FU='#5a3a20',FU2='#8a6038',SK='#c8a080',ST='#c8d0dc',BLD='#8a1018';
 const cx=42;
 const seg=(x0,y0,x1,y1,w,c,lite)=>{L(x0,y0,x1,y1,O,w+2);L(x0,y0,x1,y1,c,w);if(lite)L(x0-1,y0-1,x1-1,y1-1,lite,1);};
 // laced plates: rows of black lacquer with blue lacing and a lit top edge
 const lam=(x,y,w,h,rows,dark)=>{R(x-1,y-1,w+2,h+2,O);for(let r=0;r<rows;r++){const yy=y+Math.round(r*h/rows),hh=Math.max(2,Math.round(h/rows)-1);
  R(x,yy,w,hh,dark?K1:K2);R(x,yy,w,1,K4);R(x+w-Math.max(2,Math.round(w*.25)),yy+1,Math.max(2,Math.round(w*.25)),hh-1,K1);
  for(let k=x+1;k<x+w-1;k+=3){R(k,yy+1,1,hh-1,BL);R(k,yy+1,1,1,BL2);}}R(x,y+h-1,w,1,G1);};
 const hand=(x,y)=>{E(x,y,3,3,O);E(x,y,2,2,K2);R(x-1,y-2,2,1,K4);};
 // ---- the jinbaori: flaring behind him, or streaming back over the horse's rump when mounted
 if(Q.mounted){const st=Q.stream||0,PT=[[cx-14,31+by],[cx+13,31+by],[cx+12,60],[cx-8,66],[cx-26-st*2,64+st],[cx-34-st*4,58+st*2],[cx-30-st*3,48+st]];
  artPoly(R,PT.map(([x,y])=>[x-1,y-1]),O);artPoly(R,PT.map(([x,y])=>[x+1,y+1]),O);artPoly(R,PT,W2);artPoly(R,[[cx-14,32+by],[cx-2,32+by],[cx-6,60],[cx-26-st*2,62+st],[cx-32-st*3,50+st]],W3);
  L(cx-8,66,cx-26-st*2,64+st,G2,2);L(cx-26-st*2,64+st,cx-34-st*4,58+st*2,G2,2);for(const a of [[cx-6,40,cx-26,60],[cx-10,36,cx-32,52]])L(a[0],a[1]+by,a[2],a[3],W1,1);
  if(two)for(const [x,y] of [[cx-24,58],[cx-14,62]]){R(x,y,3,2,BLD);R(x+1,y+2,1,2,BLD);}}
 else {const y0=31+by,y1=84,wt=18,wb=24+(Q.flare||0);for(let y=y0-1;y<=y1+1;y++){const w=Math.round(wt+(wb-wt)*(y-y0)/(y1-y0))+1;R(cx-w,y,w*2+1,1,O);}
  for(let y=y0;y<=y1;y++){const w=Math.round(wt+(wb-wt)*(y-y0)/(y1-y0));R(cx-w,y,w*2+1,1,W2);R(cx-w,y,Math.round(w*.35),1,W3);R(cx+w-Math.round(w*.3),y,Math.round(w*.3)+1,1,W1);}
  R(cx-wb,y1-1,wb*2+1,2,G2);R(cx-wb,y1-2,wb*2+1,1,G1);
  if(two){for(const [x,w,h] of [[-20,4,9],[-9,3,6],[6,5,10],[16,3,7]]){R(cx+x,y1-h+1,w,h+1,'#2a2430');R(cx+x,y1-h,w,1,W1);}for(const [x,y] of [[-14,62],[12,70],[-6,76]]){R(cx+x,y,3,2,BLD);R(cx+x+1,y+2,1,2,BLD);}}}
 // ---- the spear (behind the body, in the near hand) or, in the second form, the broken shaft on his back
 const near=Q.near||[[56,40],[62,50],[64,60]],far=Q.far||[[28,40],[23,51],[27,60]];
 if(!two&&!Q.thrust){const sx=near[2][0],sy=near[2][1]+by,sb=Q.mounted?sy+30:96;L(sx-2,sb,sx+3,6,O,4);L(sx-2,sb,sx+3,6,'#4a2a18',2);L(sx-3,sb,sx+2,6,'#7a5030',1);
  // jumonji head: a straight blade with a cross blade, the tassel below
  L(sx+3,6,sx+4,-6,O,4);L(sx+3,6,sx+4,-6,ST,2);L(sx+3,5,sx+4,-5,'#ffffff',1);L(sx-4,6,sx+10,4,O,3);L(sx-4,6,sx+10,4,ST,1);R(sx+1,6,5,3,G2);
  for(let k=0;k<5;k++)L(sx+2,10,sx-2+k*1.5,18+(k%2)*2,O,1);for(let k=0;k<4;k++)L(sx+2,10,sx-1+k*1.5,17+(k%2)*2,'#2a2a34',1);}
 if(two){L(cx+14,30+by,cx-12,60+by,O,4);L(cx+14,30+by,cx-12,60+by,'#4a2a18',2);R(cx+13,28+by,3,3,'#e0d0b0');}
 // a katana at his left hip
 if(!two){L(cx-6,60+by,cx-24,70+by,O,4);L(cx-6,60+by,cx-24,70+by,'#1a1a24',2);L(cx-6,59+by,cx-24,69+by,K3,1);L(cx-6,60+by,cx+2,56+by,O,4);L(cx-6,60+by,cx+2,56+by,'#3a2a20',2);R(cx-7,58+by,3,4,G2);}
 // ---- legs: plated thigh guards, shin guards, fur boots
 if(Q.mounted){// seated: the near leg along the horse's side, the boot in a gold stirrup
  seg(cx+2,64+by,cx+14,72,8,K2,K3);seg(cx+14,72,cx+12,88,6,K1,K3);E(cx+14,72,3,3,O);E(cx+14,72,2,2,G2);for(let t=.25;t<.9;t+=.25)R(cx+14-2*t-3,72+16*t,7,1,K4);
  E(cx+13,90,5,3,O);E(cx+13,90,4,2,FU);R(cx+10,89,3,1,FU2);R(cx+8,92,11,2,O);R(cx+9,92,9,1,G2);lam(cx+1,62+by,12,9,3);}
 const lg=Q.legs||'stand';const legPts=Q.mounted?[]:lg==='stand'?[[34,74,32,84,31,95],[46,74,48,84,49,95]]:[[34,74,27,83,22,95],[46,74,54,82,58,95]];
 for(const [hx,hy,kx,ky,fx,fy] of legPts){seg(hx,hy,kx,ky,7,K2,K3);seg(kx,ky,fx,fy-3,6,K1,K3);E(kx,ky,3,3,O);E(kx,ky,2,2,G2);
  for(let t=.25;t<.9;t+=.25){const x=kx+(fx-kx)*t,y=ky+(fy-3-ky)*t;R(x-3,y,7,1,K4);}
  E(fx,fy-1,5,3,O);E(fx,fy-1,4,2,FU);R(fx-3,fy-2,3,1,FU2);R(fx-1,fy-1,1,1,FU2);}
 // thigh aprons
 if(!Q.mounted){lam(cx-12,64+by,11,11,3);lam(cx+1,64+by,11,11,3);}
 // ---- skirt of plates
 lam(cx-15,56+by,31,10,3,1);
 // ---- the cuirass: smooth black lacquer, gold rims, the black-horse crest in a gold ring
 R(cx-13,35+by,27,23,O);for(let y=36;y<57;y++){const w=y<40?10+(y-36):13;R(cx-w,y+by,w*2+1,1,K2);R(cx-w,y+by,4,1,K3);R(cx+w-4,y+by,5,1,K1);}
 for(const y of [40,46,52])R(cx-12,y+by,25,1,K1);for(const y of [41,47,53])R(cx-12,y+by,25,1,K4);
 R(cx-12,55+by,25,2,G1);R(cx-12,55+by,25,1,G2);
 E(cx,44+by,5,5,O);E(cx,44+by,4,4,G2);E(cx,44+by,3,3,K1);R(cx-2,43+by,4,2,G3);R(cx+1,42+by,1,1,G3);R(cx-2,45+by,1,2,G3);R(cx+1,45+by,1,2,G3);
 // ---- the jinbaori's front edges over the shoulders
 for(const s of [-1,1]){L(cx+s*10,34+by,cx+s*14,58+by,O,5);L(cx+s*10,34+by,cx+s*14,58+by,s<0?W3:W2,3);L(cx+s*9,34+by,cx+s*13,58+by,G2,1);}
 // ---- arms: armoured sleeves of mail and plate, gauntlets
 const arm=(A)=>{const [[a,b],[c,d],[e,f]]=A;seg(a,b+by,c,d+by,6,K2,K3);seg(c,d+by,e,f+by,5,K1,K3);for(let t=.3;t<.9;t+=.3){const x=c+(e-c)*t,y=d+by+(f-d)*t;R(x-2,y,5,1,K4);R(x-1,y+1,3,1,BL);}E(c,d+by,3,2,O);E(c,d+by,2,1,G2);hand(e,f+by);};
 arm(far);arm(near);
 // ---- shoulder guards: broad, five laced rows
 for(const s of [-1,1]){const x0=cx+s*15;for(let r=0;r<4;r++){const x=x0+s*r-6,y=33+r*3+by;R(x-1,y-1,14,5,O);R(x,y,12,3,K2);R(x,y,12,1,K4);for(let k=x+1;k<x+11;k+=3){R(k,y+1,1,2,BL);R(k,y+1,1,1,BL2);}}R(x0-6,33+by,12,1,G2);R(x0+s*3-6,45+by,12,1,G1);}
 // ---- weapon in hand for the second form / the thrust
 if(two){const [hx2,hy2]=near[2],a=Q.ka!=null?Q.ka:-1.25,len=26;L(hx2,hy2+by,hx2+Math.cos(a)*len,hy2+by+Math.sin(a)*len,O,4);L(hx2,hy2+by,hx2+Math.cos(a)*len,hy2+by+Math.sin(a)*len,ST,2);L(hx2-1,hy2+by,hx2+Math.cos(a)*len-1,hy2+by+Math.sin(a)*len,'#ffffff',1);
  E(hx2,hy2+by,3,2,O);E(hx2,hy2+by,2,1,G2);hand(hx2,hy2+by);}
 if(!two&&Q.thrust){const [[a,b],[c,d]]=Q.thrust;L(a,b+by,c,d+by,O,4);L(a,b+by,c,d+by,'#4a2a18',2);const an=Math.atan2(d-b,c-a),tx=c+Math.cos(an)*12,ty=d+by+Math.sin(an)*12;L(c,d+by,tx,ty,O,4);L(c,d+by,tx,ty,ST,2);
  const pa=an+Math.PI/2;L(c+Math.cos(pa)*6,d+by+Math.sin(pa)*6,c-Math.cos(pa)*6,d+by-Math.sin(pa)*6,O,3);L(c+Math.cos(pa)*6,d+by+Math.sin(pa)*6,c-Math.cos(pa)*6,d+by-Math.sin(pa)*6,ST,1);
  hand(near[2][0],near[2][1]+by);hand(far[2][0],far[2][1]+by);}
 // ---- head: neck guard, mask, helmet bowl, crescent
 const hx=cx,hy=24+by;
 // the neck guard: three flared tiers with gold edges, turnbacks at the sides with a gold crest
 for(let r=0;r<3;r++){const w=10+r*2,y=hy-1+r*3;R(hx-w-1,y,w*2+3,4,O);R(hx-w,y,w*2+1,2,K2);R(hx-w,y,w*2+1,1,K4);R(hx-w,y+2,w*2+1,1,G1);for(let k=hx-w+1;k<hx+w;k+=3)R(k,y+1,1,1,BL);}
 for(const s of [-1,1]){R(hx+s*10-(s<0?4:0),hy-5,5,7,O);R(hx+s*10-(s<0?3:1),hy-4,3,5,K2);E(hx+s*11-(s<0?1:-1)*0,hy-2,1,1,G2);}
 // the mask: black iron, silver moustache, glowing eyes in shadow (cracked away in the second form)
 E(hx,hy+2,7,7,O);E(hx,hy+2,6,6,'#0e0e14');
 if(!two){E(hx,hy+4,5,4,K2);E(hx-1,hy+3,2,2,K3);R(hx-3,hy+5,7,1,W3);R(hx-4,hy+6,2,2,W3);R(hx+3,hy+6,2,2,W3);R(hx-1,hy+7,3,1,G2);R(hx-3,hy+1,2,1,G3);R(hx+2,hy+1,2,1,G3);}
 else{E(hx-2,hy+3,4,4,SK);E(hx-3,hy+2,2,2,'#e0b890');R(hx-4,hy+1,2,1,O);L(hx-5,hy-1,hx-1,hy+6,'#8a3a2a',1);R(hx-3,hy+6,3,1,'#5a2a20');
  E(hx+3,hy+4,3,3,K2);R(hx+2,hy+1,2,1,'#ff4030');L(hx,hy-1,hx+1,hy+7,O,1);}
 // the helmet bowl: ridged black, gold rivets at the brim
 E(hx,hy-6,9,6,O);E(hx,hy-6,8,5,K1);for(let k=-6;k<=6;k+=2)L(hx+k,hy-10,hx+k*1.1,hy-2,K3,1);E(hx-3,hy-9,3,1,K4);R(hx-9,hy-2,19,2,O);R(hx-8,hy-2,17,1,G2);for(let k=-7;k<=7;k+=3)R(hx+k,hy-1,1,1,G3);
 // the crescent: a long thin gold arc sweeping out to both sides (snapped in the second form)
 R(hx-2,hy-12,5,4,O);R(hx-1,hy-11,3,2,G2);R(hx,hy-11,1,1,G3);
 for(const s of [-1,1]){if(two&&s>0){L(hx+1,hy-11,hx+7,hy-15,O,4);L(hx+1,hy-11,hx+7,hy-15,G2,2);R(hx+7,hy-16,2,2,G3);continue;}
  const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push([hx+s*(2+t*27),hy-11-Math.sin(t*Math.PI*.5)*10-t*t*6]);}
  for(let i=0;i<pts.length-1;i++){const w=Math.max(1,3-Math.floor(i/5));L(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],O,w+2);}
  for(let i=0;i<pts.length-1;i++){const w=Math.max(1,3-Math.floor(i/5));L(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],G2,w);L(pts[i][0],pts[i][1]-1,pts[i+1][0],pts[i+1][1]-1,G3,1);}}}
const KG_POSES={idle0:{},idle1:{b:1,flare:1},
 atk:{legs:'lunge',flare:3,dx:-2,near:[[52,40],[60,46],[64,50]],far:[[28,40],[36,48],[46,52]],thrust:[[30,58],[70,36]],ka:-.4}};
humBoss('KUROGANE ON FOOT',kgDraw,KG_POSES,{fw:84,fh:110,sc:.95});
if(typeof KUR!=='undefined')KUR.foot=null;

// ---------------------------------------------------------------- MOUNTED: Yamikaze, his black warhorse
// A tall black horse in side view: one shaded silhouette (croup, back, withers, arched neck, fine head), muscle lights on
// shoulder and hip, a flowing silver mane and tail, jointed legs with pale fetlock feathering and dark hooves. Barding in
// his colours: black lacquered plates laced blue and edged gold on chest and rump, a black chamfron with a small gold
// crescent, blue bridle with gold studs, a black-and-gold saddle over a blue saddle cloth. The general rides in the saddle.
// the horse is drawn 1.2x the rider's scale: X/Y map horse space (ground y 144) onto a 176x166 canvas
const KGM={HS:1.2,X:x=>(x-80)*1.2+98,Y:y=>(y-144)*1.2+172};
function kgMount(p,Q){const {R:R_,E:E_,L:L_}=p,ox=Q.dx||0,oy=Q.dy||0,by=Q.b||0,g=Q.gallop,two=ARTHURT,HS=KGM.HS;
 const R=(x,y,w,h,c)=>{const x0=KGM.X(x)+ox,y0=KGM.Y(y)+oy;R_(Math.floor(x0),Math.floor(y0),Math.ceil(x0+w*HS)-Math.floor(x0),Math.ceil(y0+h*HS)-Math.floor(y0),c);},
  E=(x,y,rx,ry,c)=>E_(Math.round(KGM.X(x)+ox),Math.round(KGM.Y(y)+oy),Math.round(rx*HS),Math.max(1,Math.round(ry*HS)),c),
  L=(a,b,c,d,col,t)=>L_(Math.round(KGM.X(a)+ox),Math.round(KGM.Y(b)+oy),Math.round(KGM.X(c)+ox),Math.round(KGM.Y(d)+oy),col,Math.max(1,Math.round((t||1)*HS)));
 const O=OUTC,H0='#0e0e14',H1='#1a1a26',H2='#2a2a3c',H3='#424260',H4='#6a6a92',MN='#e0e4ee',MN2='#a8aec4',MN3='#6e7490',
  K1='#1a1a24',K2='#2c2c3c',K4='#70708c',BL='#24357a',BL2='#4a6ad0',G1='#9a7420',G2='#d8b040',G3='#fff0a0';
 const seg=(x0,y0,x1,y1,w,c,lite)=>{L(x0,y0,x1,y1,O,w+2);L(x0,y0,x1,y1,c,w);if(lite)L(x0-1,y0-1,x1-1,y1-1,lite,1);};
 // ---- tail
 const tl=g?[[32,76],[22,74],[12,78],[4,86],[0,94]]:[[32,76],[26,84],[22,98],[22,112],[24,124]];
 for(let i=0;i<tl.length-1;i++)L(tl[i][0],tl[i][1],tl[i+1][0],tl[i+1][1],O,9-i);
 for(let i=0;i<tl.length-1;i++){L(tl[i][0],tl[i][1],tl[i+1][0],tl[i+1][1],MN2,7-i);L(tl[i][0]-1,tl[i][1],tl[i+1][0]-1,tl[i+1][1],MN,Math.max(1,4-i));L(tl[i][0]+2,tl[i][1]+1,tl[i+1][0]+2,tl[i+1][1]+1,MN3,1);}
 // ---- legs: [top, joint, fetlock, hoof]
 const leg=(P4,dim,hind)=>{const [a,b,c,d]=P4,c1=dim?H1:H2,c2=dim?H2:H3;seg(a[0],a[1],b[0],b[1],hind?9:8,c1,c2);seg(b[0],b[1],c[0],c[1],5,c1,c2);seg(c[0],c[1],d[0],d[1]-3,4,c1);
  E(b[0],b[1],4,3,c1);for(let k=0;k<4;k++)L(c[0]-3+k*2,c[1]-1,c[0]-4+k*2,c[1]+4,dim?MN3:MN2,1);R(d[0]-5,d[1]-4,10,5,O);R(d[0]-4,d[1]-4,8,4,'#2a2a30');R(d[0]-4,d[1]-4,8,1,'#5a5a66');};
 const LG=g?{fh:[[60,98],[46,114],[34,124],[28,128]],nh:[[52,98],[44,116],[30,128],[24,134]],ff:[[96,96],[110,104],[122,108],[130,106]],nf:[[102,98],[112,112],[124,118],[132,118]]}
          :{fh:[[60,98],[56,118],[58,132],[59,144]],nh:[[50,98],[46,118],[48,132],[49,144]],ff:[[96,98],[95,118],[95,132],[96,144]],nf:[[104,98],[105,118],[106,132],[107,144]]};
 leg(LG.fh,1,1);leg(LG.ff,1,0);
 // ---- the body silhouette
 const hy=g?4:0,BODY=[[30,80],[36,72],[46,68],[60,72],[74,74],[88,70],[98,64],[106,54+hy],[112,44+hy],[118,36+hy],[124,32+hy],[128,30+hy],[132,34+hy],[138,46+hy],[142,56+hy],[140,62+hy],[132,60+hy],[124,56+hy],[118,60+hy],[112,74],[108,90],[102,100],[90,104],[72,106],[54,104],[42,100],[32,92]];
 const body=BODY.map(([x,y])=>[x,y+(x<112?by:0)]);artPoly(R,body,H2);
 // light along the back and neck, shadow along the belly, muscle masses
 artPoly(R,[[34,76],[46,70],[60,74],[74,76],[88,72],[98,66],[106,56+hy],[112,46+hy],[120,38+hy],[126,34+hy],[128,38+hy],[118,46+hy],[110,60+hy],[100,74],[88,78],[72,82],[56,80],[40,80]].map(([x,y])=>[x,y+(x<112?by:0)]),H3);
 artPoly(R,[[40,98],[54,102],[72,104],[90,102],[102,98],[98,104],[72,108],[50,106]].map(([x,y])=>[x,y+by]),H1);
 E(46,84+by,10,9,H3);E(43,80+by,5,4,H4);E(100,82+by,8,10,H3);E(98,77+by,3,4,H4);L(90,74+by,96,98+by,H1,1);L(58,80+by,54,100+by,H1,1);L(70,80+by,70,100+by,H1,1);
 // ---- the head: eye, nostril, mouth, cheek; chamfron with a gold crescent; bridle
 E(128,44+hy,5,4,H3);R(127,40+hy,3,2,O);R(128,40+hy,1,1,'#c0c8ff');R(139,55+hy,2,2,H0);L(134,60+hy,141,61+hy,H1,1);
 artPoly(R,[[125,31+hy],[131,33+hy],[139,48+hy],[136,52+hy],[129,40+hy]],O);artPoly(R,[[126,32+hy],[130,34+hy],[137,47+hy],[135,50+hy],[129,40+hy]],K2);L(126,32+hy,135,50+hy,G2,1);
 for(const s2 of [-1,1]){L(129,34+hy,129+s2*5,28+hy,O,3);L(129,34+hy,129+s2*5,28+hy,G2,1);}R(128,33+hy,3,2,G3);
 L(124,38+hy,134,56+hy,BL,1);L(122,52+hy,136,58+hy,BL,1);for(const [x,y] of [[124,38],[134,56],[122,52]])R(x-1,y+hy-1,2,2,G2);
 // ears
 L(124,30+hy,122,22+hy,O,4);L(124,30+hy,122,23+hy,H2,2);
 // ---- mane and forelock, silver, falling over the near side of the neck
 {const st=(t,i)=>{const x=98+t*26,y=64-t*32+hy*t+by*(1-t),len=18-t*8+(i%4)*2;return [x,y,x-7+(i%2),y+len];};
  for(let i=0;i<22;i++){const [a,b,c,d]=st(i/21,i);L(a,b,c,d,O,3);}for(let i=0;i<22;i++){const [a,b,c,d]=st(i/21,i);L(a,b,c,d,[MN3,MN2,MN3,MN][i%4],1);}for(let i=0;i<22;i+=3){const [a,b,c,d]=st(i/21,i);L(a,b,(a+c)/2,(b+d)/2,MN,1);}}
 L(127,31+hy,132,38+hy,MN,2);
 // ---- barding: laced plates on chest and rump
 const plate=(pts,rows)=>{for(let r=0;r<rows;r++){const [x,y,w]=pts(r);R(x-1,y-1,w+2,5,O);R(x,y,w,3,K2);R(x,y,w,1,K4);for(let k=x+1;k<x+w-1;k+=3){R(k,y+1,1,2,BL);R(k,y+1,1,1,BL2);}R(x,y+3,w,1,G1);}};
 plate(r=>[34+r,74+r*4+by,20-r*2],3);for(let k=0;k<4;k++){R(37+k*4,86+by,1,4,G2);R(36+k*4,90+by,3,2,BL2);}
 plate(r=>[101-r,72+r*4+by,9],4);for(let k=0;k<2;k++){R(102+k*4,88+by,1,4,G2);R(101+k*4,92+by,3,2,BL2);}
 // breast strap and girth
 L(98,72+by,74,92+by,BL,2);L(98,71+by,74,91+by,BL2,1);
 // ---- saddle cloth and saddle
 R(64,72+by,22,13,O);R(65,73+by,20,11,BL);R(65,73+by,20,1,BL2);for(let k=66;k<85;k+=3){R(k,83+by,1,2,G2);}R(65,82+by,20,1,G2);
 R(64,66+by,24,8,O);R(65,67+by,22,6,K1);R(65,67+by,22,1,G2);R(66,72+by,20,1,G1);
 leg(LG.nh,0,1);leg(LG.nf,0,0);
 // ---- the general in the saddle (his own sprite, seated)
 kgDraw(p,Object.assign({},Q.rider||{},{mounted:1,dx:ox+49,dy:oy+4+(Q.rdy||0),b:by,stream:g?3:Q.b?1:0}));
 // ---- reins from the bit to his far hand
 L(138,58+hy,96,66+by,BL,1);}
humBoss('LORD KUROGANE',kgMount,{idle0:{},idle1:{b:1},
 atk:{gallop:1,rdy:2,rider:{near:[[56,40],[62,46],[66,50]],far:[[28,40],[36,48],[46,52]],thrust:[[20,58],[86,44]]}}},{fw:176,fh:176,sc:.9});
