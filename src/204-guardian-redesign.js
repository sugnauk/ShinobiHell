'use strict';
// SHINOBIDUNGEONS - three guardians redrawn from scratch, and the two prologue guardians given new stories.
//  PROLOGUE I   GENJURO, THE HIRED BLADE  (was Goro the bandit captain) a ronin the tax men hired: a battered straw
//               hat with a notch cut from the brim, a cloth mask over his lower face, a patched dark kimono with the
//               sleeves tied back in red cord, scavenged armour (a dented breastplate and a single shoulder plate) and a long nodachi
//               with its scabbard slung across his back. Second form: the hat sliced away, the mask torn down, his long
//               hair tied back in a tail, his eyes red and the blade chipped.
//  PROLOGUE II  TATSUMA, THE BARGE MASTER (was Kurobe the river pirate) master of the Emperor's tithe barges: a heavy
//               indigo quilted coat with white sashiko stitching, a shaggy straw rain cape, a twisted headband, a full
//               black beard, wrapped shins, and an iron-shod barge pole with a gaff hook. Second form: the rain cape
//               smouldering, the headband gone, his hair loose, and a lit fire-jar in his free hand.
//  CHAPTER II   SAZANAMI, FERRYMAN OF THE HOLLOW - a gaunt old ferryman: a deep, weathered straw hat, glowing eyes in
//               its shadow, a long white beard, a straw cape over a dark kimono, a string of coins for the dead, a long
//               pole with a paper lantern and two spirit flames drifting about him. Second form: the lanterns go red;
//               the hat brim is torn and the cape tattered.
// Drawn the way the sprite guide asks: each frame is painted at twice the size, then reduced (2x2 blocks to one pixel,
// most common colour, darker on a tie so outlines survive) and outlined as usual.

// ---------------------------------------------------------------- the high-resolution painter
const HI={W:144,H:152,ow:.5};   // ow: the painted outline (at 2x); the sheet adds its own 1px edge after
function hiArt(paint){return function(p,Q){Q=Q||{};const c=document.createElement('canvas');c.width=HI.W;c.height=HI.H;const g=c.getContext('2d');
 const ox=(Q.dx||0)*2,oy=(Q.dy||0)*2,by=(Q.b||0)*2;g.translate(ox,oy);
 const out=OUTC;
 const path=pts=>{g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();};
 const H={g,by,two:ARTHURT,f:p.f||0,Q,
  poly(pts,c,ow=HI.ow){path(pts);if(ow){g.lineJoin='round';g.strokeStyle=out;g.lineWidth=ow*2;g.stroke();}g.fillStyle=c;g.fill();},
  fill(pts,c){path(pts);g.fillStyle=c;g.fill();},
  ell(x,y,rx,ry,c,ow=HI.ow,rot=0){g.beginPath();g.ellipse(x,y,Math.max(.5,rx),Math.max(.5,ry),rot,0,TAU);if(ow){g.strokeStyle=out;g.lineWidth=ow*2;g.stroke();}g.fillStyle=c;g.fill();},
  ln(x0,y0,x1,y1,w,c,cap='round'){g.lineCap=cap;g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();},
  // a thick limb along points with an outline and a lit top edge
  limb(pts,w,c,lit){g.lineJoin='round';g.lineCap='round';for(const [W,C] of [[w+HI.ow*2,out],[w,c]]){g.strokeStyle=C;g.lineWidth=W;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(const q of pts.slice(1))g.lineTo(q[0],q[1]);g.stroke();}
   if(lit){g.strokeStyle=lit;g.lineWidth=2;g.beginPath();g.moveTo(pts[0][0]-w*.25,pts[0][1]-w*.3);for(const q of pts.slice(1))g.lineTo(q[0]-w*.25,q[1]-w*.3);g.stroke();}},
  rect(x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));},
  // the pose's 1x points in 2x space
  pt:a=>[a[0]*2,a[1]*2+by],
  lt:c=>shade(c,.28),dk:c=>shade(c,-.32),dd:c=>shade(c,-.55)};
 paint(H,Q);
 // reduce: each 2x2 block becomes one pixel: drawn if at least two of its four are, in the most common colour (ties go
 // to the darkest, so 2-pixel outlines and creases hold)
 const d=g.getImageData(0,0,HI.W,HI.H).data,w=HI.W/2,h=HI.H/2;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const cnt=new Map();let n=0;
  for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]]){const i=((y*2+b)*HI.W+(x*2+a))*4;if(d[i+3]<128)continue;n++;const k=(d[i]<<16)|(d[i+1]<<8)|d[i+2];cnt.set(k,(cnt.get(k)||0)+1);}
  if(n<2)continue;let best=-1,bc=0,bl=1e9;for(const [k,v] of cnt){const l=((k>>16)&255)*.3+((k>>8)&255)*.59+(k&255)*.11;if(v>bc||(v===bc&&l<bl)){best=k;bc=v;bl=l;}}
  p.R(x,y,1,1,'#'+best.toString(16).padStart(6,'0'));}};}
// shared pieces
const HIP={
 // a leg: thigh, shin, foot; c thigh colour, s shin colour, ft foot colour; w thickness (2x px)
 leg(H,hip,knee,foot,c,s,ft,w=12){H.limb([hip,knee],w,c,H.lt(c));H.limb([knee,[foot[0],foot[1]-4]],w-2,s,H.lt(s));H.poly([[foot[0]-9,foot[1]-5],[foot[0]+10,foot[1]-5],[foot[0]+12,foot[1]],[foot[0]-10,foot[1]]],ft);},
 legs(H,Q,cx,hipY,fn){const st=Q.stride||0,lunge=Q.legs==='lunge';
  const L=lunge?[[cx-9,hipY],[cx-22,hipY+20],[cx-32,145]]:[[cx-9,hipY],[cx-14+st*-4,hipY+22],[cx-18+st*-8,146-(st<0?4:0)]];
  const R=lunge?[[cx+9,hipY],[cx+26,hipY+20],[cx+36,146]]:[[cx+9,hipY],[cx+16+st*4,hipY+22],[cx+20+st*8,146-(st>0?4:0)]];fn(L);fn(R);},
 // a gloved or bare hand
 hand(H,x,y,c){H.ell(x,y,5,5,c);H.ell(x-1.5,y-2,2,1.5,H.lt(c),0);},
 // a pole along an angle from a hand: back length, front length, width, colour
 pole(H,x,y,a,back,front,w,c){const ca=Math.cos(a),sa=Math.sin(a);H.limb([[x-ca*back,y-sa*back],[x+ca*front,y+sa*front]],w,c,H.lt(c));return [x+ca*front,y+sa*front];}};
// the extra poses (walk, wind-up, follow-through, cast, flinch) come from these resting arms (133-boss-poses.js)
function hiPoses(name,arms){GARMS[name]=arms;try{const P=BART[name].posed;delete P.pick;guardianPoses(name);}catch(err){console.warn('poses',name,err);}}

// ---------------------------------------------------------------- PROLOGUE I: GENJURO, THE HIRED BLADE
const GENJURO='GENJURO, THE HIRED BLADE';
const genjuroArt=hiArt((H,Q)=>{const {by,two}=H,cx=72;
 const KI='#3a3430',KI2='#4e4640',KI3='#2a2420',PT='#5e5444',PT2='#6e6250',HK='#34302e',HK2='#48423e',IR='#5a5e66',IR2='#8a909a',IR3='#3a3e46',LE='#6a4a2a',ST='#c8ccd6',ST2='#f0f4f8',SK='#c08a62',SK2='#8e5e3e',HR='#16120e',MK='#4a4a50',MK2='#5e5e66',STR='#b8a060',STR2='#d8c080',STR3='#7a6838',TS='#e8e0d0',TSR='#a82828';
 const far=(Q.far||[[25,30],[20,40],[23,49]]).map(H.pt),near=(Q.near||[[47,30],[52,39],[51,47]]).map(H.pt);
 // the nodachi: a very long blade, a dark iron guard, a long hilt wrapped in black diamonds
 const sword=()=>{const [x,y]=near[2],a=Q.wa!=null?Q.wa:1.02,len=(Q.wl||31)*2,ca=Math.cos(a),sa=Math.sin(a),nx=-sa,ny=ca;
  H.limb([[x-ca*16,y-sa*16],[x+ca*4,y+sa*4]],6,'#1a1418');for(let k=-14;k<4;k+=4){H.ln(x+ca*k-nx*3,y+sa*k-ny*3,x+ca*(k+2)+nx*3,y+sa*(k+2)+ny*3,1.5,'#e8e0d0');}
  H.ell(x+ca*6,y+sa*6,6,6,IR3,1);H.ell(x+ca*6-1,y+sa*6-1,2,2,IR2,0);
  const P0=[x+ca*9,y+sa*9],P1=[x+ca*len,y+sa*len];H.poly([[P0[0]+nx*4,P0[1]+ny*4],[P1[0]+nx*3,P1[1]+ny*3],[P1[0]+ca*8,P1[1]+sa*8],[P1[0]-nx*2,P1[1]-ny*2],[P0[0]-nx*3,P0[1]-ny*3]],ST);
  H.ln(P0[0]+nx*2,P0[1]+ny*2,P1[0]+nx*2,P1[1]+ny*2,1.5,ST2);H.ln(P0[0]-nx*2,P0[1]-ny*2,P1[0]-nx*1,P1[1]-ny*1,1.5,'#8a909a');
  if(two)for(const k of [.45,.7])H.rect(x+ca*len*k+nx*3-1,y+sa*len*k+ny*3-1,3,2,'#14101a');};
 // the scabbard slung across the back
 H.limb([[cx-30,40+by],[cx+26,96+by]],7,'#1e1a22',H.lt('#1e1a22'));H.ln(cx-24,46+by,cx-20,50+by,3,'#a88850');H.ln(cx+18,88+by,cx+22,92+by,3,'#a88850');
 // legs: worn hakama, ragged at the hem, shins wrapped in cloth, straw sandals
 HIP.legs(H,Q,cx,96,([hp,kn,ft])=>{const mx=(kn[0]+ft[0])/2,my=(kn[1]+ft[1])/2;
  H.poly([[hp[0]-9,hp[1]],[hp[0]+9,hp[1]],[mx+10,my+2],[mx+5,my+5],[mx,my+2],[mx-5,my+5],[mx-10,my+2]],HK);H.fill([[hp[0]-8,hp[1]+2],[hp[0]-3,hp[1]+2],[mx-5,my+2],[mx-9,my+2]],HK2);
  H.limb([[mx,my+3],[ft[0],ft[1]-6]],8,'#8a8070');for(let t=.2;t<1;t+=.3){const xx=mx+(ft[0]-mx)*t,yy=my+3+(ft[1]-6-my-3)*t;H.ln(xx-4,yy-1,xx+4,yy+1,1.5,'#5a5448');}
  H.poly([[ft[0]-9,ft[1]-5],[ft[0]+10,ft[1]-5],[ft[0]+12,ft[1]],[ft[0]-10,ft[1]]],STR);H.ln(ft[0]-8,ft[1]-1,ft[0]+10,ft[1]-1,1.5,STR3);});
 // far arm: the sleeve tied back, a bare wrapped forearm, the lone shoulder plate
 H.limb([far[0],far[1]],12,KI,KI2);H.limb([far[1],far[2]],8,SK,H.lt(SK));for(const t of [.4,.7]){const xx=far[1][0]+(far[2][0]-far[1][0])*t,yy=far[1][1]+(far[2][1]-far[1][1])*t;H.ln(xx-4,yy,xx+4,yy,2,TS);}HIP.hand(H,far[2][0],far[2][1],SK);
 {const [x,y]=far[0];H.poly([[x-10,y-6],[x+6,y-6],[x+4,y+14],[x-12,y+14]],IR);for(let r=0;r<3;r++){H.ln(x-11,y-1+r*6,x+5,y-1+r*6,1.5,IR3);H.ln(x-10,y+1+r*6,x+4,y+1+r*6,1.5,TSR);}H.ln(x-9,y-5,x+5,y-5,1.5,IR2);}
 // the patched kimono, the dented breastplate strapped over it, a dark obi, the tasuki cord crossing the chest
 H.poly([[cx-19,52+by],[cx+19,52+by],[cx+18,96+by],[cx-18,96+by]],KI);H.fill([[cx-18,54+by],[cx-10,54+by],[cx-10,94+by],[cx-17,94+by]],KI2);H.fill([[cx+11,54+by],[cx+18,54+by],[cx+17,94+by],[cx+11,94+by]],KI3);
 for(const [x,y,w,h] of [[-15,80,8,7],[8,58,7,6]]){H.rect(cx+x,y+by,w,h,PT);H.rect(cx+x,y+by,w,1,PT2);for(let i=1;i<w;i+=2)H.rect(cx+x+i,y+by+h-1,1,1,'#2a2420');}
 H.poly([[cx-14,60+by],[cx+14,60+by],[cx+12,82+by],[cx-12,82+by]],'#45494f');H.fill([[cx-13,62+by],[cx-7,62+by],[cx-7,80+by],[cx-11,80+by]],IR);H.ln(cx-12,61+by,cx+12,61+by,1.5,IR2);
 H.ln(cx-11,71+by,cx+11,71+by,1.5,IR3);H.fill([[cx+4,64+by],[cx+9,66+by],[cx+6,70+by]],IR3);H.rect(cx+4,64+by,2,1,IR2);for(const [x,y] of [[-9,64],[9,64],[-9,78],[9,78]])H.rect(cx+x,y+by,2,2,IR2);
 for(const y of [64,78]){H.ln(cx-17,y+by,cx-13,y+by,3,LE);H.ln(cx+13,y+by,cx+17,y+by,3,LE);}
 H.poly([[cx-8,52+by],[cx+8,52+by],[cx,62+by]],'#d8d0c0',.5);
 for(const s of [-1,1])H.ln(cx+s*19,53+by,cx+s*13,58+by,2,TSR);
 H.rect(cx-19,84+by,38,8,'#14101a');H.rect(cx-18,85+by,36,5,'#5a2a24');H.limb([[cx+8,90+by],[cx+12,100+by]],3,'#5a2a24');
 // near arm, sleeve tied back, the sword in hand
 sword();H.limb([near[0],near[1]],12,KI,KI2);H.limb([near[1],near[2]],8,SK,H.lt(SK));for(const t of [.4,.7]){const xx=near[1][0]+(near[2][0]-near[1][0])*t,yy=near[1][1]+(near[2][1]-near[1][1])*t;H.ln(xx-4,yy,xx+4,yy,2,TS);}HIP.hand(H,near[2][0],near[2][1],SK);
 // the head
 const hx=cx,hy=34+by;
 // second form: long dark hair tied back in a tail that swings behind
 if(two){H.limb([[hx-6,hy-8],[hx-14,hy+2],[hx-18,hy+18]],6,HR);H.ell(hx,hy-6,13,10,HR);}
 H.ell(hx,hy,12,14,SK);H.ell(hx-3,hy-3,5,6,H.lt(SK),0);H.fill([[hx+6,hy-8],[hx+12,hy-2],[hx+11,hy+8],[hx+6,hy+4]],SK2);
 if(two){H.poly([[hx-12,hy-6],[hx-6,hy-12],[hx+6,hy-12],[hx+12,hy-6],[hx+10,hy-4],[hx-10,hy-4]],HR,0);}
 H.ln(hx-10,hy-4,hx-2,hy-2,3,HR);H.ln(hx+2,hy-2,hx+10,hy-4,3,HR);H.rect(hx-8,hy-1,4,3,'#14101a');H.rect(hx+3,hy-1,4,3,'#14101a');
 if(two){H.rect(hx-7,hy-1,2,2,'#ff3030');H.rect(hx+4,hy-1,2,2,'#ff3030');}else{H.rect(hx-7,hy,1,1,'#e8e0d0');H.rect(hx+4,hy,1,1,'#e8e0d0');}
 H.ln(hx+5,hy-9,hx+9,hy+3,1.5,'#a85040');
 if(!two){
  // the cloth mask over his lower face, tied behind with trailing ends
  H.poly([[hx-13,hy+3],[hx+13,hy+3],[hx+12,hy+12],[hx,hy+16],[hx-12,hy+12]],MK);H.fill([[hx-12,hy+4],[hx-4,hy+4],[hx-5,hy+12],[hx-11,hy+11]],MK2);H.ln(hx-12,hy+3,hx+12,hy+3,1.5,'#2a2a30');
  H.limb([[hx-13,hy+5],[hx-20,hy+9],[hx-24,hy+16]],3,MK);H.limb([[hx-13,hy+7],[hx-18,hy+14],[hx-19,hy+22]],3,MK2);
  // the battered straw hat, a notch cut out of its brim
  H.poly([[hx-30,hy-6],[hx-6,hy-20],[hx+6,hy-20],[hx+30,hy-6],[hx+26,hy-3],[hx+14,hy-4],[hx+10,hy-8],[hx+6,hy-4],[hx-26,hy-3]],STR);
  for(let i=-5;i<=5;i++)H.ln(hx+i*1.2,hy-19,hx+i*5,hy-5,1.5,i%2?STR3:STR2);H.ln(hx-28,hy-4,hx+28,hy-4,1.5,STR3);H.ell(hx,hy-19,4,2,STR3,.5);
  H.ln(hx-9,hy-4,hx-9,hy+4,1.5,'#6a5a40');H.ln(hx+9,hy-4,hx+9,hy+4,1.5,'#6a5a40');}
 else{
  // the mask torn down round his neck: a stubbled jaw and a hard mouth
  for(let x=-9;x<=9;x+=3)H.rect(hx+x,hy+6+Math.abs(x)*.2,1.5,1.5,'#5a4030');H.rect(hx-4,hy+8,8,2,'#6a2a1a');
  H.poly([[hx-13,hy+13],[hx+13,hy+13],[hx+11,hy+20],[hx-11,hy+20]],MK,.5);H.limb([[hx+12,hy+16],[hx+18,hy+24]],3,MK);}});
humBoss(GENJURO,genjuroArt,{idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[47,28],[55,20],[56,11]],wa:-2.3,wl:30,far:[[25,29],[17,36],[13,44]]}},{sc:1.1});
hiPoses(GENJURO,[[[25,30],[20,40],[23,49]],[[47,30],[52,39],[51,47]]]);

// ---------------------------------------------------------------- PROLOGUE II: TATSUMA, THE BARGE MASTER
const TATSUMA='TATSUMA, THE BARGE MASTER';
const tatsumaArt=hiArt((H,Q)=>{const {by,two}=H,cx=72;
 const IN='#25345a',IN2='#33477a',IN3='#1a2440',ST='#d8dce8',STR='#a8945a',STR2='#c8b47a',STR3='#6a5a34',SK='#b8784a',SK2='#8a5434',BE='#16100c',TR='#2a2a34',WR='#5a6a7a',WD='#7a5a32',WD2='#a8844a',IR='#5a5e68';
 const far=(Q.far||[[24,30],[19,40],[22,48]]).map(H.pt),near=(Q.near||[[48,30],[54,39],[54,47]]).map(H.pt);
 // the barge pole: a long shaft with an iron shoe and a gaff hook at the head
 const pole=()=>{const [x,y]=near[2],a=Q.pa!=null?Q.pa:-1.62,ca=Math.cos(a),sa=Math.sin(a),back=(Q.pb||30)*2,front=(Q.pf||40)*2;
  const tip=HIP.pole(H,x,y,a,back,front,6,WD);const tx=tip[0],ty=tip[1],nx=-sa,ny=ca;
  H.limb([[tx-ca*12,ty-sa*12],[tx+ca*4,ty+sa*4]],7,IR,'#9aa0ac');H.limb([[tx-ca*6,ty-sa*6],[tx-ca*6+nx*10,ty-sa*6+ny*10],[tx-ca*14+nx*14,ty-sa*14+ny*14]],4,IR,'#9aa0ac');
  const bx=x-ca*back,byy=y-sa*back;H.limb([[bx,byy],[bx+ca*8,byy+sa*8]],7,IR);
  for(const k of [-8,0,8])H.ln(x+ca*k-nx*4,y+sa*k-ny*4,x+ca*k+nx*4,y+sa*k+ny*4,2,'#c8b898');};
 // legs: dark trousers, blue-grey shin wraps with ties, split-toe work boots
 HIP.legs(H,Q,cx,100,([hp,kn,ft])=>{H.limb([hp,kn],15,TR,H.lt(TR));H.limb([kn,[ft[0],ft[1]-6]],11,WR,H.lt(WR));
  for(let t=.15;t<.95;t+=.2){const x=kn[0]+(ft[0]-kn[0])*t,y=kn[1]+(ft[1]-6-kn[1])*t;H.ln(x-5,y-2,x+5,y+2,2,H.dk(WR));}
  H.poly([[ft[0]-10,ft[1]-8],[ft[0]+11,ft[1]-7],[ft[0]+13,ft[1]],[ft[0]-11,ft[1]]],'#1e1e28');H.ln(ft[0]+3,ft[1]-7,ft[0]+3,ft[1],1.5,'#3a3a48');});
 // far arm behind (a lit fire-jar in its hand in the second form)
 H.limb(far,13,IN,IN2);H.limb([far[1],far[2]],9,IN,IN2);HIP.hand(H,far[2][0],far[2][1],'#6a4a2a');
 if(two){const [x,y]=far[2];H.ell(x,y-6,7,7,'#a86a3a');H.ell(x-2,y-8,2,2,'#d89860',0);H.rect(x-3,y-15,6,4,'#e8e0d0');const fl=H.f%2;H.ell(x,y-22+fl,5,7,'#ff7030',0);H.ell(x,y-21+fl,2,4,'#ffe080',0);}
 // the coat: a heavy indigo quilted hanten to the knee, white sashiko stitching in a grid
 H.poly([[cx-24,54+by],[cx+24,54+by],[cx+28,112+by],[cx-28,112+by]],IN);
 H.fill([[cx-23,56+by],[cx-12,56+by],[cx-14,110+by],[cx-26,110+by]],IN2);H.fill([[cx+14,56+by],[cx+23,56+by],[cx+27,110+by],[cx+16,110+by]],IN3);
 for(let y=60;y<110;y+=8)for(let x=-22;x<=22;x+=8){if(Math.abs(x)<5)continue;H.ln(cx+x-2,y+by,cx+x+2,y+by,1.5,ST);H.ln(cx+x,y+by-2,cx+x,y+by+2,1.5,ST);}
 // the closed front: a dark collar band running down, tied with a thick rope sash
 H.poly([[cx-6,54+by],[cx+6,54+by],[cx+4,112+by],[cx-4,112+by]],'#14182a',1);H.ln(cx,56+by,cx,110+by,1.5,'#3a4a6a');
 H.rect(cx-25,86+by,50,7,'#14101a');for(let x=-24;x<24;x+=4)H.rect(cx+x,87+by,3,5,(x/4)%2?STR:STR2);
 H.limb([[cx+8,92+by],[cx+12,104+by]],3,STR);H.limb([[cx+12,92+by],[cx+18,102+by]],3,STR2);
 // a manifest scroll and an iron hook at the sash
 H.poly([[cx-20,90+by],[cx-12,90+by],[cx-12,104+by],[cx-20,104+by]],'#e8dcc0',1);H.ln(cx-19,95+by,cx-13,95+by,1,'#6a5a40');H.ln(cx-19,99+by,cx-14,99+by,1,'#6a5a40');
 // the straw rain cape over the shoulders: layered tufts with a shaggy hem; smouldering in the second form
 const capeY=50+by,hem=78+by;H.poly([[cx-14,capeY-4],[cx+14,capeY-4],[cx+32,hem-6],[cx+26,hem],[cx-26,hem],[cx-32,hem-6]],STR);
 for(let x=-30;x<=30;x+=4){const yy=hem+((x/4)%2?2:5);H.fill([[cx+x-3,hem-3],[cx+x+3,hem-3],[cx+x,yy+(x%3)]],(x/4)%2?STR:STR3);}
 for(let i=0;i<14;i++){const x=cx-26+i*4,y0=capeY+Math.abs(i-6.5)*1.2;H.ln(x,y0,x+(i<7?-2:2),hem-4,1.5,i%3?STR3:STR2);}
 H.fill([[cx-12,capeY-3],[cx-2,capeY-3],[cx-14,hem-8],[cx-26,hem-6]],STR2);
 if(two){for(let i=0;i<9;i++){const x=cx-26+i*6.5,y=hem-((i*5+H.f*3)%7);H.rect(x,y,3,3,i%2?'#ff8030':'#ffd060');H.rect(x+1,y-6-(i%3)*2,2,2,'#ff6020');}H.ln(cx-28,hem,cx+28,hem,2,'#3a1a10');}
 // the near arm in its quilted sleeve, leather hand guard, the pole
 pole();H.limb([near[0],near[1]],13,IN,IN2);H.limb([near[1],near[2]],9,IN,IN2);H.ln(near[1][0]-3,near[1][1]+2,near[1][0]+4,near[1][1]-1,1.5,ST);
 HIP.hand(H,near[2][0],near[2][1],'#6a4a2a');H.rect(near[2][0]-4,near[2][1]-6,8,3,'#4a3020');
 // the head: a broad weathered face, heavy brows, a full black beard; a twisted headband (wild loose hair later)
 const hx=cx,hy=32+by;
 if(two)for(let i=-12;i<=12;i+=3)H.limb([[hx+i*.6,hy-12],[hx+i*1.3,hy+2+Math.abs(i)%5]],3,BE);
 H.ell(hx,hy,12,14,SK);H.ell(hx-3,hy-4,5,5,H.lt(SK),0);H.fill([[hx+6,hy-8],[hx+12,hy-2],[hx+11,hy+6],[hx+6,hy+2]],SK2);
 H.ln(hx-10,hy-5,hx-2,hy-3,3,BE);H.ln(hx+2,hy-3,hx+10,hy-5,3,BE);H.rect(hx-8,hy-2,4,3,'#14101a');H.rect(hx+3,hy-2,4,3,'#14101a');
 if(two){H.rect(hx-7,hy-2,2,2,'#ff3030');H.rect(hx+4,hy-2,2,2,'#ff3030');}
 H.poly([[hx-13,hy+1],[hx-8,hy+4],[hx,hy+5],[hx+8,hy+4],[hx+13,hy+1],[hx+12,hy+14],[hx+5,hy+22],[hx,hy+24],[hx-5,hy+22],[hx-12,hy+14]],BE,1);
 for(let x=-9;x<=9;x+=3)H.ln(hx+x,hy+9,hx+x*1.1,hy+19-Math.abs(x)*.4,1,'#3a2a20');H.rect(hx-4,hy+7,8,2,'#6a2a1a');
 if(!two){H.ell(hx,hy-9,12,6,BE,1);H.rect(hx-1,hy-18,4,6,BE);
  H.limb([[hx-13,hy-6],[hx+13,hy-6]],5,'#e8ecf4');for(let x=-11;x<12;x+=4)H.ln(hx+x,hy-8,hx+x+3,hy-4,2,'#5a7aa8');
  H.limb([[hx-12,hy-6],[hx-18,hy-10],[hx-20,hy-4]],3,'#e8ecf4');}});
humBoss(TATSUMA,tatsumaArt,{idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[48,28],[56,22],[60,15]],pa:-2.75,pb:22,pf:30,far:[[24,29],[16,35],[13,43]]}},{sc:1.1});
hiPoses(TATSUMA,[[[24,30],[19,40],[22,48]],[[48,30],[54,39],[54,47]]]);

// ---------------------------------------------------------------- CHAPTER II: SAZANAMI, FERRYMAN OF THE HOLLOW
const sazArt=hiArt((H,Q)=>{const {by,two}=H,cx=72;
 const KI='#28443f',KI2='#36605a',KI3='#18302c',MI='#7a8460',MI2='#a4a878',MI3='#4a5238',SK='#a8b0a0',SK2='#788070',BEARD='#e8ece4',HAT='#9a8e64',HAT2='#c4b680',HAT3='#5a5238',
  GLOW=two?'#ff5a40':(typeof FERRY!=='undefined'?FERRY.jade:'#8ce4d3'),GLOW2=two?'#ffd0a0':'#e8fff8',CORD='#c8b080';
 const far=(Q.far||[[26,30],[19,41],[21,50]]).map(H.pt),near=(Q.near||[[46,31],[51,42],[48,48]]).map(H.pt);
 // two spirit flames drifting about him
 const wisp=(x,y,s)=>{H.ell(x,y,4*s,5*s,GLOW,1);H.ell(x,y+1,2*s,2.5*s,GLOW2,0);H.fill([[x-3*s,y-2*s],[x,y-11*s],[x+3*s,y-2*s]],GLOW);};
 const ph=H.f*1.9;wisp(cx-38+Math.sin(ph)*3,58+Math.cos(ph)*4,1);
 // the long robe to the ankles, straw sandals just showing
 for(const s of [-1,1]){const fx=cx+s*12;H.poly([[fx-9,140],[fx+10,140],[fx+12,146],[fx-10,146]],'#c8bc90');H.ln(fx-8,144,fx+10,144,1.5,'#8a7a50');}
 H.poly([[cx-22,60+by],[cx+22,60+by],[cx+30,141],[cx-30,141]],KI);
 H.fill([[cx-21,62+by],[cx-10,62+by],[cx-14,139],[cx-28,139]],KI2);H.fill([[cx+12,62+by],[cx+21,62+by],[cx+28,139],[cx+16,139]],KI3);
 for(const x of [-8,4,16])H.ln(cx+x,100+by,cx+x*1.4,139,1.5,KI3);
 // the hem: tattered in the second form
 if(two)for(let x=-28;x<=28;x+=5)H.fill([[cx+x-2,139],[cx+x+3,139],[cx+x+1,144+(x%3)]],KI);
 // the far arm in a wide sleeve, a bony hand
 H.limb(far,14,KI,KI2);HIP.hand(H,far[2][0],far[2][1],SK);
 // the white under-collar, the obi, a string of coins for the dead
 H.poly([[cx-8,58+by],[cx+8,58+by],[cx,86+by]],'#e8e4d4',1);H.rect(cx-24,94+by,48,8,'#14101a');H.rect(cx-23,95+by,46,4,'#3a2a2a');
 for(let i=0;i<6;i++){const x=cx-12+i*5,y=104+by+Math.sin(i*1.1)*2;H.ln(x,y-3,x+5,y-2,1,CORD);H.ell(x,y,2.5,2.5,'#d8a838',1);H.rect(x-.5,y-.5,1,1,'#14101a');}
 // the straw cape over the shoulders: long layered tufts
 const hem=two?92+by:96+by;H.poly([[cx-14,50+by],[cx+14,50+by],[cx+30,hem-6],[cx+24,hem],[cx-24,hem],[cx-30,hem-6]],MI);
 for(let x=-28;x<=28;x+=4){const yy=hem+((x/4)%2?2:6)+(two&&x%3===0?6:0);H.fill([[cx+x-3,hem-3],[cx+x+3,hem-3],[cx+x,yy]],(x/4)%2?MI:MI3);}
 for(let i=0;i<14;i++){const x=cx-26+i*4,y0=54+by+Math.abs(i-6.5);H.ln(x,y0,x+(i<7?-2:2),hem-3,1.5,i%3?MI3:MI2);}
 H.fill([[cx-12,52+by],[cx-2,52+by],[cx-14,hem-8],[cx-26,hem-6]],MI2);
 // the pole and its lantern hanging from a cord at the head
 const [hx0,hy0]=near[2],pa=Q.pa!=null?Q.pa:-1.42,pf=Math.min((Q.pf||44)*2,(hy0-6)/Math.max(.2,-Math.sin(pa)),(HI.W-20-hx0)/Math.max(.1,Math.cos(pa))),top=HIP.pole(H,hx0,hy0,pa,(Q.pb||34)*2,pf,5,'#3a2e28');
 const lx=top[0]+10,ly=top[1]+18;H.ln(top[0],top[1],top[0]+12,top[1]+2,1.5,CORD);H.ln(top[0]+12,top[1]+2,lx,ly-10,1.5,CORD);
 H.ell(lx,ly,8,10,'#e8e0c8');H.ell(lx,ly,6,8,GLOW,0);H.ell(lx-1,ly-1,3,5,GLOW2,0);for(const y of [-5,0,5])H.ln(lx-7,ly+y,lx+7,ly+y,1,shade(GLOW,-.35));
 H.rect(lx-6,ly-11,12,3,'#14101a');H.rect(lx-6,ly+9,12,3,'#14101a');H.ln(lx,ly+12,lx,ly+18,1.5,'#c03030');
 // the near arm in its sleeve, a bony hand on the pole
 H.limb([near[0],near[1]],14,KI,KI2);H.limb([near[1],near[2]],11,KI,KI2);HIP.hand(H,near[2][0],near[2][1],SK);
 // the head: a gaunt face in the hat's shadow, glowing eyes, a long white beard down the chest
 const hx=cx,hy=40+by;H.ell(hx,hy,11,13,SK);H.fill([[hx+5,hy-6],[hx+11,hy],[hx+9,hy+8],[hx+4,hy+4]],SK2);H.fill([[hx-9,hy+2],[hx-5,hy+3],[hx-6,hy+8]],SK2);
 H.rect(hx-11,hy-13,22,8,'#0e1614');H.rect(hx-7,hy-4,4,2,GLOW);H.rect(hx+3,hy-4,4,2,GLOW);H.rect(hx-6,hy-4,2,1,GLOW2);H.rect(hx+4,hy-4,2,1,GLOW2);
 H.poly([[hx-10,hy+3],[hx-4,hy+6],[hx+4,hy+6],[hx+10,hy+3],[hx+8,hy+16],[hx+4,hy+34],[hx,hy+42],[hx-4,hy+32],[hx-8,hy+16]],BEARD,1);
 for(const x of [-4,0,4])H.ln(hx+x,hy+10,hx+x*.6,hy+30,1,'#b8bcb4');H.ell(hx-6,hy+4,4,2,BEARD,0);H.ell(hx+6,hy+4,4,2,BEARD,0);H.rect(hx-3,hy+6,6,1,'#5a6058');
 // the hat: a deep, wide straw kasa; weathered strands; a cord to the chin; the brim torn in the second form
 const brim=two?[[hx-34,hy-10],[hx-20,hy-30],[hx,hy-36],[hx+20,hy-30],[hx+34,hy-10],[hx+24,hy-12],[hx+20,hy-6],[hx+12,hy-9],[hx-14,hy-9],[hx-30,hy-7]]
  :[[hx-36,hy-8],[hx-20,hy-30],[hx,hy-36],[hx+20,hy-30],[hx+36,hy-8],[hx+30,hy-5],[hx-30,hy-5]];
 H.poly(brim,HAT);for(let i=-6;i<=6;i++){H.ln(hx+i*1.2,hy-34,hx+i*5.4,hy-8,1.5,i%2?HAT3:HAT2);}H.ln(hx-34,hy-7,hx+34,hy-7,2,HAT3);
 H.fill([[hx-30,hy-9],[hx-18,hy-28],[hx-12,hy-28],[hx-22,hy-9]],HAT2);H.ell(hx,hy-35,3,2,HAT3,1);
 H.ln(hx-10,hy-7,hx-9,hy+4,1.5,CORD);H.ln(hx+10,hy-7,hx+9,hy+4,1.5,CORD);
 // the second spirit flame in front
 wisp(cx+30+Math.cos(ph)*3,80-Math.sin(ph)*4,.85);});
humBoss('SAZANAMI, FERRYMAN OF THE HOLLOW',sazArt,{idle0:{},idle1:{b:1},atk:{near:[[46,31],[52,26],[48,23]],dy:-1,pa:-1.0,pb:26,pf:24}},{sc:1.13});
hiPoses('SAZANAMI, FERRYMAN OF THE HOLLOW',[[[26,30],[19,41],[21,50]],[[46,31],[51,42],[48,48]]]);
{const posed=BART[FERRY.name].posed,base=posed.pick;
 posed.pick=(e,ix)=>{
  const crossing=e.EV||e.A;
  if(!e.phx&&crossing?.rows){
   if(crossing.recover)return ix.follow;
   if(crossing.t-crossing.release<.22)return ix.atk;
   if(crossing.cue||crossing.cut)return ix.wind;
   return ix.idle0;
  }
  return base(e,ix);
 };}

// ---------------------------------------------------------------- the new prologue stories
// Prologue I: the Emperor's own tax enforcer, not a bandit; Prologue II: the master of the tithe barges, not a pirate.
Object.assign(PRO.dun,{story:'HIRED BLADES BURN THE VILLAGE FOR THE EMPEROR\'S TAX',
 tale:'THE EMPEROR\'S TAX MEN DO NOT DIRTY THEIR OWN HANDS. THEY HIRED GENJURO, A RONIN WITH NO LORD AND NO MERCY, TO COLLECT FROM THE VILLAGES THAT COULD NOT PAY. HIS BLADES ARE BURNING YOURS. THIS IS WHERE THE MARCH BEGINS.'});
PRO.boss.name=GENJURO;PRO.style.t=['THE LONG BLADE','TORCHES','A RONIN\'S LAST STAND'];
PRO.master='THE VILLAGE IS SAFE, BUT ITS RICE IS GONE. GENJURO WAS PAID FROM THE EMPEROR\'S TITHE BARGES, AND THE RICE WENT DOWNRIVER ON THEM. TATSUMA, THE BARGE MASTER, HOLDS THE FLOODED FIELDS.';
Object.assign(PRO2.dun,{story:'THE TITHE BARGES CARRY THE STOLEN RICE THROUGH THE FLOODED FIELDS',
 tale:'THE VILLAGE\'S RICE WENT DOWNRIVER ON THE EMPEROR\'S TITHE BARGES. TATSUMA, MASTER OF THE BARGE GUILD, HOLDS THE FLOODED PADDIES WITH HIS POLEMEN, AND SKIMS A SHARE OF EVERY LOAD FOR HIMSELF.'});
PRO2.boss.name=TATSUMA;PRO2.style.t=['THE BARGE POLE','HIS POLEMEN','FIRE ON THE WATER'];
PRO2.master='THE RICE GOES HOME ON TATSUMA\'S OWN BARGE. HIS MANIFESTS NAME THE WATCHTOWER ON THE HILL ROAD: THE EMPEROR\'S EYES, SIGNALLING THE WARBANDS. IT MUST FALL BEFORE WE CAN PASS.';
// the old names have no art any more; anything still asking for them gets the new guardians
BART['GORO, THE BANDIT CAPTAIN']=BART[GENJURO];BART['KUROBE, THE RIVER PIRATE']=BART[TATSUMA];
