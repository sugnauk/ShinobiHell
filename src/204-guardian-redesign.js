'use strict';
// SHINOBIDUNGEONS - three guardians redrawn from scratch, and the two prologue guardians given new stories.
//  PROLOGUE I   GONDO, THE TAX ENFORCER   (was Goro the bandit captain) the Emperor's tax officer in black-lacquered
//               armour laced in red, a war hat with the Emperor's coin crest, a snarling iron half-mask and a studded
//               iron club. Second form: the hat and half the mask knocked off (a shaven head, topknot, black beard and a
//               scar), one shoulder plate gone, and the club glowing red-hot from the burning village.
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
const HI={W:144,H:152,ow:1};   // ow: the painted outline (at 2x); the sheet adds its own 1px edge after
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

// ---------------------------------------------------------------- PROLOGUE I: GONDO, THE TAX ENFORCER
const GONDO='GONDO, THE TAX ENFORCER';
const gondoArt=hiArt((H,Q)=>{const {by,two}=H,cx=72;
 const LQ='#24202a',LQ2='#3a3644',LQ3='#56526a',RD='#b02828',RD2='#e04840',GD='#d8a838',GD2='#ffe080',HK='#2e2a34',IR='#5a5e68',IR2='#9aa0ac',SK='#c89068',SK2='#9a6440',TB='#e8e0d0';
 const far=(Q.far||[[25,30],[20,40],[22,49]]).map(H.pt),near=(Q.near||[[47,30],[53,39],[52,47]]).map(H.pt);
 // the club: a long octagonal iron club studded with rivets, the grip bound in cloth; red-hot in the second form
 const club=()=>{const [x,y]=near[2],a=Q.wa!=null?Q.wa:-1.2,len=(Q.wl||36)*2,ca=Math.cos(a),sa=Math.sin(a),nx=-sa,ny=ca;
  // the grip
  H.limb([[x-ca*10,y-sa*10],[x+ca*14,y+sa*14]],8,'#6a4a2a');for(let k=-8;k<14;k+=4)H.ln(x+ca*k-nx*4,y+sa*k-ny*4,x+ca*k+nx*4,y+sa*k+ny*4,2,TB);
  // the head: widening toward the end
  const s0=14,w0=6,w1=11,P0=[x+ca*s0,y+sa*s0],P1=[x+ca*len,y+sa*len];
  H.poly([[P0[0]+nx*w0,P0[1]+ny*w0],[P1[0]+nx*w1,P1[1]+ny*w1],[P1[0]+ca*4+nx*6,P1[1]+sa*4+ny*6],[P1[0]+ca*4-nx*6,P1[1]+sa*4-ny*6],[P1[0]-nx*w1,P1[1]-ny*w1],[P0[0]-nx*w0,P0[1]-ny*w0]],IR);
  const hot=two?'#ff7038':IR2;H.fill([[P0[0]+nx*(w0-2),P0[1]+ny*(w0-2)],[P1[0]+nx*(w1-2),P1[1]+ny*(w1-2)],[P1[0]+nx*(w1-5),P1[1]+ny*(w1-5)],[P0[0]+nx*(w0-3),P0[1]+ny*(w0-3)]],hot);
  H.fill([[P0[0]-nx*(w0-1),P0[1]-ny*(w0-1)],[P1[0]-nx*(w1-1),P1[1]-ny*(w1-1)],[P1[0]-nx*(w1-4),P1[1]-ny*(w1-4)],[P0[0]-nx*(w0-3),P0[1]-ny*(w0-3)]],H.dk(IR));
  for(let k=s0+6;k<len;k+=7){const t=(k-s0)/(len-s0),ww=w0+(w1-w0)*t;for(const s of [-.55,0,.55]){const px=x+ca*k+nx*ww*s,py=y+sa*k+ny*ww*s;H.rect(px-1.5,py-1.5,3,3,two?'#ffd060':'#c8ccd6');}}
  if(two)for(let i=0;i<5;i++){const k=s0+((H.f*7+i*13)%(len-s0)),px=x+ca*k+nx*(w1+4),py=y+sa*k+ny*(w1+4)-i*3;H.rect(px,py,2,2,i%2?'#ffb040':'#ff6020');}};
 // legs: dark hakama to the knee, iron shin guards, straw sandals over tabi
 HIP.legs(H,Q,cx,100,([hp,kn,ft])=>{H.limb([hp,kn],16,HK,H.lt(HK));H.limb([kn,[ft[0],ft[1]-6]],11,IR,IR2);
  for(let t=.2;t<.95;t+=.25){const x=kn[0]+(ft[0]-kn[0])*t,y=kn[1]+(ft[1]-6-kn[1])*t;H.ln(x-5,y,x+5,y,2,H.dk(IR));}
  H.poly([[ft[0]-10,ft[1]-6],[ft[0]+11,ft[1]-6],[ft[0]+13,ft[1]],[ft[0]-11,ft[1]]],'#e8e4dc');H.ln(ft[0]-10,ft[1]-1,ft[0]+12,ft[1]-1,2,'#a88850');});
 // the far shoulder plate and arm behind the body
 const sode=(sx,sy,s,torn)=>{if(torn)return;const pts=[[sx-12,sy-4],[sx+12,sy-4],[sx+14+s*4,sy+26],[sx-10+s*4,sy+26]];H.poly(pts,LQ);
  for(let r=0;r<4;r++){const y=sy+2+r*6;H.ln(sx-11+s*r,y,sx+12+s*r,y,2,LQ3);H.ln(sx-10+s*r,y+3,sx+11+s*r,y+3,2,RD);}H.ln(sx-11,sy-3,sx+12,sy-3,2,GD);};
 H.limb(far,13,HK,H.lt(HK));H.limb([far[1],far[2]],10,IR,IR2);HIP.hand(H,far[2][0],far[2][1],'#3a3028');sode(far[0][0]-4,far[0][1]-2,-1,false);
 // the plated skirt (kusazuri): five lacquered tassets laced in red
 for(let i=-2;i<=2;i++){const x=cx+i*11,y0=94+by,pts=[[x-6,y0],[x+6,y0],[x+7+i,y0+20],[x-7+i,y0+20]];H.poly(pts,LQ);for(let r=0;r<3;r++){const y=y0+4+r*6;H.ln(x-6+i*r*.3,y,x+6+i*r*.3,y,2,LQ3);H.ln(x-5+i*r*.3,y+3,x+5+i*r*.3,y+3,2,RD);}}
 // the cuirass: a broad lacquered barrel with lacing rows, the Emperor's coin crest on the chest
 H.poly([[cx-24,52+by],[cx+24,52+by],[cx+22,74+by],[cx+17,96+by],[cx-17,96+by],[cx-22,74+by]],LQ);
 H.fill([[cx-22,54+by],[cx-12,54+by],[cx-10,94+by],[cx-16,94+by],[cx-20,74+by]],LQ2);H.fill([[cx+14,54+by],[cx+22,54+by],[cx+20,74+by],[cx+15,94+by],[cx+10,94+by]],H.dd(LQ));
 for(let y=72;y<94;y+=7){const w=21-(y-72)*.18;H.ln(cx-w,y+by,cx+w,y+by,2,LQ3);H.ln(cx-w+1,y+by+3,cx+w-1,y+by+3,2,RD);for(const x of [-10,0,10])H.rect(cx+x-1,y+by+2,3,3,RD2);}
 H.ln(cx-22,66+by,cx+22,66+by,3,GD);H.ell(cx,58+by,6,6,GD);H.rect(cx-2,56+by,4,4,LQ);H.ell(cx-2,56+by,1.5,1.5,GD2,0);
 // the obi under the cuirass edge, a tax ledger tucked into it
 H.rect(cx-20,92+by,40,5,'#14101a');H.rect(cx-19,93+by,38,2,RD);H.poly([[cx+10,86+by],[cx+18,86+by],[cx+18,98+by],[cx+10,98+by]],'#e8dcc0',1);H.ln(cx+11,90+by,cx+17,90+by,1,'#6a5a40');H.ln(cx+11,93+by,cx+16,93+by,1,'#6a5a40');
 // the near arm in its armoured sleeve, the near shoulder plate (torn away in the second form), the club
 club();H.limb([near[0],near[1]],13,HK,H.lt(HK));H.limb([near[1],near[2]],10,IR,IR2);
 for(const t of [.3,.65]){const x=near[1][0]+(near[2][0]-near[1][0])*t,y=near[1][1]+(near[2][1]-near[1][1])*t;H.ln(x-4,y-1,x+4,y+1,2,H.dk(IR));}
 HIP.hand(H,near[2][0],near[2][1],'#3a3028');sode(near[0][0]+4,near[0][1]-2,1,two);if(two){H.ln(near[0][0]-2,near[0][1]-4,near[0][0]+8,near[0][1]+4,2,RD);}
 // the throat guard and head
 const hx=cx,hy=32+by;H.poly([[hx-12,hy+12],[hx+12,hy+12],[hx+14,hy+22],[hx-14,hy+22]],LQ);H.ln(hx-12,hy+16,hx+12,hy+16,2,RD);
 H.ell(hx,hy,13,15,SK);H.ell(hx-3,hy-3,5,6,H.lt(SK),0);H.fill([[hx+6,hy-8],[hx+13,hy-2],[hx+12,hy+8],[hx+6,hy+4]],SK2);
 // eyes under heavy brows
 H.rect(hx-8,hy-3,5,3,'#14101a');H.rect(hx+3,hy-3,5,3,'#14101a');if(two){H.rect(hx-7,hy-3,2,2,'#ff3030');H.rect(hx+4,hy-3,2,2,'#ff3030');}else{H.rect(hx-7,hy-2,2,1,'#e8e0d0');H.rect(hx+4,hy-2,2,1,'#e8e0d0');}
 H.ln(hx-10,hy-6,hx-2,hy-4,3,'#14101a');H.ln(hx+2,hy-4,hx+10,hy-6,3,'#14101a');
 if(!two){
  // the iron half-mask: a snarling mouth with teeth and a bristling white moustache
  H.poly([[hx-13,hy+1],[hx+13,hy+1],[hx+11,hy+13],[hx,hy+17],[hx-11,hy+13]],'#3e424c');H.fill([[hx-11,hy+2],[hx-3,hy+2],[hx-4,hy+12],[hx-10,hy+11]],'#6a707c');H.fill([[hx+6,hy+2],[hx+12,hy+2],[hx+10,hy+12],[hx+6,hy+13]],'#2a2c34');H.ln(hx-2,hy+1,hx+1,hy+6,3,'#2a2c34');
  H.rect(hx-6,hy+8,12,3,'#14101a');for(let x=-5;x<6;x+=3)H.rect(hx+x,hy+8,2,2,'#f0ece0');
  for(let x=-11;x<=11;x+=2){H.ln(hx+x*.5,hy+5,hx+x,hy+8+Math.abs(x)*.2,1.5,'#f0ece0');}
  // the war hat: a black lacquered jingasa, gold rim and the Emperor's coin crest
  H.poly([[hx-26,hy-10],[hx,hy-22],[hx+26,hy-10],[hx+22,hy-6],[hx-22,hy-6]],LQ);H.ln(hx-24,hy-8,hx+24,hy-8,2,GD);H.fill([[hx-22,hy-11],[hx-2,hy-20],[hx-2,hy-17],[hx-18,hy-10]],LQ3);
  H.ell(hx,hy-15,4,3,GD,1);H.rect(hx-1,hy-16,2,2,LQ);H.ln(hx-10,hy-6,hx-9,hy+3,1.5,'#6a5a40');H.ln(hx+10,hy-6,hx+9,hy+3,1.5,'#6a5a40');}
 else{
  // bare: a shaven pate with a topknot, a thick black beard where the mask broke away, a fresh scar
  H.ell(hx,hy-8,11,6,shade(SK,.1),0);H.limb([[hx,hy-14],[hx+2,hy-22],[hx+8,hy-24]],4,'#14101a');
  H.poly([[hx-12,hy+2],[hx-6,hy+2],[hx,hy+5],[hx+6,hy+2],[hx+12,hy+2],[hx+10,hy+14],[hx,hy+18],[hx-10,hy+14]],'#1e1814',1);H.rect(hx-3,hy+8,6,2,'#6a2a1a');
  H.poly([[hx+2,hy+1],[hx+12,hy+1],[hx+10,hy+12],[hx+3,hy+12]],'#7a2020',1);H.ln(hx+4,hy+3,hx+9,hy+10,1,'#14101a');
  H.ln(hx-9,hy-10,hx-2,hy+2,2,'#c03030');}});
humBoss(GONDO,gondoArt,{idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[47,28],[55,20],[56,11]],wa:-2.25,wl:30,far:[[25,29],[17,36],[13,44]]}},{sc:1.1});
hiPoses(GONDO,[[[25,30],[20,40],[22,49]],[[47,30],[53,39],[52,47]]]);

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

// ---------------------------------------------------------------- the new prologue stories
// Prologue I: the Emperor's own tax enforcer, not a bandit; Prologue II: the master of the tithe barges, not a pirate.
Object.assign(PRO.dun,{story:'THE EMPEROR\'S TAX ENFORCERS BURN THE VILLAGE',
 tale:'THE VILLAGES THAT COULD NOT PAY THE EMPEROR\'S RICE TAX ARE BURNING. GONDO, HIS TAX ENFORCER, RIDES WITH A BAND OF HIRED BLADES AND A LEDGER OF EVERY DEBT. YOURS IS NEXT. THIS IS WHERE THE MARCH BEGINS.'});
PRO.boss.name=GONDO;PRO.style.t=['THE IRON CLUB','TORCHES','THE LAST LEDGER'];
PRO.master='THE VILLAGE IS SAFE, BUT ITS RICE IS GONE. GONDO\'S LEDGER SAYS IT WENT DOWNRIVER ON THE EMPEROR\'S TITHE BARGES, AND THAT TATSUMA, THE BARGE MASTER, HOLDS THE FLOODED FIELDS.';
Object.assign(PRO2.dun,{story:'THE TITHE BARGES CARRY THE STOLEN RICE THROUGH THE FLOODED FIELDS',
 tale:'THE VILLAGE\'S RICE WENT DOWNRIVER ON THE EMPEROR\'S TITHE BARGES. TATSUMA, MASTER OF THE BARGE GUILD, HOLDS THE FLOODED PADDIES WITH HIS POLEMEN, AND SKIMS A SHARE OF EVERY LOAD FOR HIMSELF.'});
PRO2.boss.name=TATSUMA;PRO2.style.t=['THE BARGE POLE','HIS POLEMEN','FIRE ON THE WATER'];
PRO2.master='THE RICE GOES HOME ON TATSUMA\'S OWN BARGE. HIS MANIFESTS NAME THE WATCHTOWER ON THE HILL ROAD: THE EMPEROR\'S EYES, SIGNALLING THE WARBANDS. IT MUST FALL BEFORE WE CAN PASS.';
// the old names have no art any more; anything still asking for them gets the new guardians
BART['GORO, THE BANDIT CAPTAIN']=BART[GONDO];BART['KUROBE, THE RIVER PIRATE']=BART[TATSUMA];
