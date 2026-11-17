'use strict';
// ===== THE HUMAN GUARDIANS, redrawn to the standard of Akagane =====
// Every story boss is a person. They share one toolkit (outlined limbs, shaded robes and armour, hands, faces) and each is
// a posed figure like Akagane: frames idle0 / idle1 (breathing) / atk, ready for per-attack animation frames later.
// Canvas 72x76, centre x 36, feet on y 73. ARTHURT = drawing the second form.
const OUTC='#0e0c12';
function HUM(p,Q){const {R:R_,E:E_,L:L_}=p,ox=Q.dx||0,oy=Q.dy||0,by=Q.b||0;
 const R=(x,y,w,h,c)=>R_(x+ox,y+oy,w,h,c),E=(x,y,rx,ry,c)=>E_(x+ox,y+oy,rx,ry,c),L=(a,b,c2,d,c,t)=>L_(a+ox,b+oy,c2+ox,d+oy,c,t);
 const lt=c=>shade(c,.28),dk=c=>shade(c,-.32),dd=c=>shade(c,-.55);
 // an outlined limb segment with a lit upper edge
 const seg=(x0,y0,x1,y1,w,c)=>{L(x0,y0,x1,y1,OUTC,w+2);L(x0,y0,x1,y1,c,w);if(w>2)L(x0-1,y0-1,x1-1,y1-1,lt(c),1);};
 // a shaded trapezoid (robe, skirt, coat): lit left edge, shadowed right, outlined
 const trap=(cx,y0,y1,w0,w1,c,o={})=>{const W2=y=>Math.round(w0+(w1-w0)*(y-y0)/Math.max(1,y1-y0));
  for(let y=y0-1;y<=y1+1;y++){const w=W2(clamp(y,y0,y1))+1;R(cx-w,y,w*2+1,1,OUTC);}
  for(let y=y0;y<=y1;y++){const w=W2(y);R(cx-w,y,w*2+1,1,c);R(cx-w,y,Math.max(1,Math.round(w*.35)),1,lt(c));R(cx+w-Math.max(1,Math.round(w*.4))+1,y,Math.max(1,Math.round(w*.4)),1,dk(c));}
  if(o.pleats)for(let k=-o.pleats;k<=o.pleats;k++){if(!k)continue;const xx=cx+Math.round(k*w1/(o.pleats+1));L(cx+Math.round(k*w0/(o.pleats+1)),y0+1,xx,y1,dk(c),1);}
  if(o.hem)R(cx-w1,y1-1,w1*2+1,2,o.hem);};
 const hand=(x,y,c)=>{E(x,y,2,2,OUTC);R(x-1,y-1,3,3,c);R(x-1,y-1,2,1,lt(c));};
 // arm: [[shoulder],[elbow],[hand]], sleeve colour, forearm colour, hand colour, width
 const arm=(A,sc,fc,hc,w)=>{if(!A)return;w=w||4;const [[a,b],[c,d],[e,f]]=A;seg(a,b+by,c,d+by,w,sc);seg(c,d+by,e,f+by,w-1,fc||sc);hand(e,f+by,hc);};
 // wide kimono sleeve hanging from the arm
 const sleeve=(A,c,len)=>{if(!A)return;const [[a,b],[c2,d]]=A;const x=Math.min(a,c2)-1,y=Math.min(b,d)+by;trap(Math.round((a+c2)/2),y,y+len,3,5,c);};
 const leg=(hx,hy,kx,ky,fx,fy,c,sc,fc,w)=>{w=w||5;seg(hx,hy+by,kx,ky,w,c);seg(kx,ky,fx,fy-2,w-1,sc||c);R(fx-4,fy-1,8,2,OUTC);R(fx-3,fy-1,7,1,fc||dk(sc||c));};
 // a face looking at you: skin, two eyes, a mouth line
 const face=(hx,hy,skin,o={})=>{E(hx,hy,6,7,OUTC);E(hx,hy,5,6,skin);E(hx-1,hy-1,3,4,lt(skin));R(hx+3,hy-1,2,5,dk(skin));
  const ey=hy+(o.ey||0);R(hx-3,ey,2,o.eh||1,o.eye||OUTC);R(hx+2,ey,2,o.eh||1,o.eye||OUTC);if(o.brow){R(hx-4,ey-2,3,1,o.brow);R(hx+2,ey-2,3,1,o.brow);}
  if(o.mouth!==false)R(hx-1,hy+4,3,1,o.mouth||dd(skin));};
 return {R,E,L,R_,E_,L_,seg,trap,hand,arm,sleeve,leg,face,lt,dk,dd,by,ox,oy};}
// register a posed human boss
function humBoss(name,draw,poses,o){BART[name]=Object.assign(p=>draw(p,poses[p.f===2?'atk':p.f===1?'idle1':'idle0']),Object.assign({fw:72,fh:76,raw:1,sc:1.05},o||{},{posed:{draw,poses,anim:(o&&o.anim)||{},roar:'atk'}}));}

// ---------------------------------------------------------------- III. ITOHIME, THE WIRE WEAVER
// Matriarch of the spider clan: a dark shinobi suit under a violet haori printed with white webs, a high black ponytail
// tied with red cord, a steel half-mask with fangs, clawed gauntlets, and a harness of four jointed steel limbs on her
// back. Wires run from her fingers. Second form: two harness limbs snapped, hair loose, the mask cracked, red eyes.
function itoDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const V='#5a2a7a',V2='#7a3a9a',BK='#24202e',ST='#6a6478',ST2='#a8a2b8',RD='#c02030',SK='#e8c8b0',HAIR='#141018',WIRE='#d8e0f0';
 // harness limbs behind her: shoulder joint, knee, hooked tip
 const limbs=[[[30,28],[14,12],[6,28]],[[31,32],[10,30],[6,46]],[[42,28],[58,12],[66,28]],[[41,32],[62,30],[66,46]]];
 limbs.forEach((l,i)=>{const [[a,b],[c,d],[e,f]]=l,broke=two&&(i===2||i===1);const A=Q.lift?-6:0;
  seg(a,b+by,c,d+A+by,3,BK);if(broke){seg(c,d+A+by,(c+e)/2,(d+f)/2+A+by,2,ST);R((c+e)/2-1,(d+f)/2+A+by-1,3,3,'#ffd040');}else{seg(c,d+A+by,e,f+A+by,2,ST);L(e,f+A+by,e+(e<cx?-2:2),f+A+by+3,ST2,1);}
  E(c,d+A+by,2,2,OUTC);E(c,d+A+by,1,1,RD);});
 // long haori behind the legs
 trap(cx,27+by,62,9,15,V);for(const [x0,y0,x1,y1] of [[26,40,34,58],[46,40,38,58],[30,50,42,50]])L(x0,y0+by,x1,y1,'#c8c0d8',1);
 // legs: slim, dark, wrapped shins, split-toe boots
 const lg=Q.legs||'stand';
 if(lg==='stand'){leg(33,50,31,61,30,73,BK,'#2a2634','#3a3644',4);leg(39,50,42,61,43,73,BK,'#2a2634','#3a3644',4);}
 else{leg(33,50,27,60,24,73,BK,'#2a2634','#3a3644',4);leg(39,50,46,59,49,73,BK,'#2a2634','#3a3644',4);}
 for(const x of [30,42])for(let y=63;y<71;y+=3)R(x-1,y,4,1,'#5a5466');
 // torso: fitted dark suit, the haori fronts, a red obi with a cord
 trap(cx,27+by,49+by,6,7,BK);trap(cx-6,27+by,48+by,2,3,V2);trap(cx+6,27+by,48+by,2,3,V);
 R(cx-7,43+by,15,4,RD);R(cx-7,43+by,15,1,'#ff5060');L(cx+3,47+by,cx+5,53+by,RD,1);
 for(const [x,y] of [[cx-6,32],[cx+5,35],[cx-5,38]])R(x,y+by,1,1,'#c8c0d8');
 // arms with clawed gauntlets
 const far=Q.far||[[29,30],[25,40],[24,49]],near=Q.near||[[43,30],[47,40],[48,49]];
 arm(far,BK,ST,'#8a8498',4);arm(near,BK,ST,'#8a8498',4);
 for(const H of [far[2],near[2]])for(let k=-1;k<=1;k++)L(H[0]+k,H[1]+by+1,H[0]+k*2,H[1]+by+4,ST2,1);
 // wires from her fingers: slack when idle, taut and fanned out to strike
 const wires=Q.wires||'slack';
 for(const H of [far,near]){const [hx2,hy2]=H[2],s=hx2<cx?-1:1;
  if(wires==='taut')for(let k=0;k<4;k++)L(hx2,hy2+by,hx2+s*(30-k*3),hy2+by-18+k*12,WIRE,1);
  else{L(hx2,hy2+by+1,hx2+s*4,hy2+by+5,WIRE,1);R(hx2+s*4,hy2+by+5,1,1,'#ffffff');}}
 // shoulders
 for(const s of [-1,1]){E(cx+s*7,28+by,4,3,OUTC);E(cx+s*7,28+by,3,2,V2);}
 // head: ponytail behind, face, half-mask
 const hx=cx,hy=17+by;
 if(!two){L(hx,hy-6,hx-10,hy-2,HAIR,5);L(hx-10,hy-2,hx-14,hy+14,HAIR,4);L(hx-14,hy+14,hx-12,hy+24,HAIR,3);R(hx-4,hy-8,4,3,RD);}
 else{for(const [a,b] of [[-14,8],[-16,18],[-11,24],[12,10],[15,19],[10,24]])L(hx,hy-4,hx+a,hy+b,HAIR,3);}
 face(hx,hy,SK,{eye:two?'#ff3030':'#4a1a5a',ey:-1,brow:HAIR,mouth:false});
 E(hx,hy-5,7,4,OUTC);E(hx,hy-5,6,3,HAIR);R(hx-6,hy-3,2,6,HAIR);R(hx+5,hy-3,2,6,HAIR);R(hx-3,hy-7,4,1,'#3a2a44');
 // steel mask over mouth and jaw, with fangs (cracked in the second form)
 R(hx-5,hy+2,11,5,OUTC);R(hx-4,hy+2,9,4,ST);R(hx-4,hy+2,9,1,ST2);R(hx-2,hy+5,1,2,'#f0f0f8');R(hx+2,hy+5,1,2,'#f0f0f8');
 if(two){R(hx+1,hy+2,4,4,SK);L(hx,hy+2,hx+2,hy+6,OUTC,1);}
 // little spider crest on the forehead
 R(hx-1,hy-4,3,2,RD);}
humBoss('ITOHIME, THE WIRE WEAVER',itoDraw,{
 idle0:{},idle1:{b:1},
 atk:{lift:1,wires:'taut',legs:'wide',far:[[29,30],[18,26],[10,24]],near:[[43,30],[54,26],[62,24]]}});

// ---------------------------------------------------------------- IV. LADY HOTARU, THE LANTERN ONMYOJI
// A court sorceress in a white hunting robe over red hakama, a tall black eboshi cap, long black hair, a fan of paper
// charms in one hand and a firefly lantern on a pole in the other. Second form (robes ablaze): the cap gone, hair loose,
// the robe scorched, the lantern torn open with blue fire.
function hotDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,sleeve,by}=K,two=ARTHURT,cx=36;
 const WH='#e8e4dc',WH2='#bcb6aa',RED='#b02028',SK='#f0d4bc',HAIR='#141018',PAPER='#f4ecd0',LAN='#f0c060',FIRE=two?'#60c0ff':'#ffd060';
 // hair down her back
 trap(cx,14+by,46+by,6,8,HAIR);
 // the lantern pole in the far hand (behind her)
 const lp=Q.lan||[22,6];L(lp[0],lp[1]+10+by,lp[0]+2,70,'#5a3a20',2);L(lp[0]-1,lp[1]+10+by,lp[0]+1,70,'#8a6030',1);
 L(lp[0],lp[1]+by,lp[0],lp[1]+4+by,OUTC,1);E(lp[0],lp[1]+10+by,6,7,OUTC);E(lp[0],lp[1]+10+by,5,6,two?'#4a5a8a':LAN);R(lp[0]-5,lp[1]+5+by,11,1,'#3a2a1a');R(lp[0]-5,lp[1]+15+by,11,1,'#3a2a1a');
 E(lp[0]-1,lp[1]+9+by,2,3,FIRE);if(two){R(lp[0]+1,lp[1]+7+by,3,5,OUTC);L(lp[0],lp[1]+3+by,lp[0]+2,lp[1]-3+by,FIRE,2);}
 else for(let i=0;i<3;i++)R(lp[0]-3+i*3,lp[1]+8+by+(i%2)*3,1,1,'#fff0a0');
 // red hakama, wide
 trap(cx,46+by,72,9,14,RED,{pleats:2});R(cx-14,72,29,1,OUTC);
 // white robe: body and the long skirt panels
 trap(cx,26+by,52+by,8,11,WH,{});trap(cx,26+by,34+by,3,4,'#d8d0c4');L(cx,26+by,cx-4,40+by,WH2,1);L(cx,26+by,cx+4,40+by,WH2,1);
 R(cx-9,42+by,19,3,'#8a1820');
 if(two){for(const [x,y] of [[cx-9,48],[cx+6,50],[cx-3,51],[cx+9,44]]){R(x,y+by,3,2,'#3a2418');R(x+1,y+by-1,1,1,'#ff8030');}}
 // arms in wide sleeves
 const far=Q.far||[[29,28],[24,38],[22,44]],near=Q.near||[[43,28],[48,38],[47,46]];
 arm(far,WH,WH,SK,4);arm(near,WH,WH,SK,4);
 for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,d+by-2,d+by+10,3,6,WH);}
 // the charm fan in the near hand
 const [hx2,hy2]=near[2],fan=Q.fan||0;for(let i=-2;i<=2;i++){const a=-1.57+i*.32+fan;L(hx2,hy2+by,hx2+Math.cos(a)*9,hy2+by+Math.sin(a)*9,OUTC,3);}
 for(let i=-2;i<=2;i++){const a=-1.57+i*.32+fan,x=hx2+Math.cos(a)*9,y=hy2+by+Math.sin(a)*9;L(hx2,hy2+by,x,y,PAPER,1);R(x-1,y-1,3,3,PAPER);R(x,y,1,1,RED);}
 K.hand(hx2,hy2+by,SK);
 // head: hair framing the face, the eboshi cap
 const hx=cx,hy=17+by;E(hx,hy+1,8,9,HAIR);face(hx,hy+1,SK,{eye:'#2a1a2a',ey:0,mouth:'#c04050'});R(hx-6,hy-3,12,3,HAIR);R(hx-7,hy-2,2,12,HAIR);R(hx+6,hy-2,2,12,HAIR);
 R(hx-4,hy+3,1,1,'#e08090');R(hx+4,hy+3,1,1,'#e08090');
 if(!two){R(hx-4,hy-14,9,11,OUTC);R(hx-3,hy-13,7,10,'#1e1a24');R(hx-3,hy-13,2,10,'#3a3444');R(hx-5,hy-4,11,2,'#1e1a24');R(hx+1,hy-9,3,1,'#5a5466');}
 else{for(const [a,b] of [[-10,-6],[10,-7],[-12,4],[12,3],[0,-10]])L(hx,hy-4,hx+a,hy+b,HAIR,3);R(hx-3,hy+1,2,1,'#60c0ff');R(hx+2,hy+1,2,1,'#60c0ff');}
 // fireflies
 for(const [x,y] of (Q.flies||[[12,40],[58,22],[62,50]])){R(x,y+by,1,1,two?'#80d0ff':'#fff0a0');R(x-1,y+by,1,1,two?'#3060a0':'#a08020');}}
humBoss('LADY HOTARU',hotDraw,{
 idle0:{},idle1:{b:1,flies:[[13,42],[57,20],[61,52]]},
 atk:{near:[[43,28],[52,26],[58,18]],fan:.3,lan:[18,2],far:[[29,28],[22,34],[18,40]],flies:[[10,30],[50,10],[64,40],[40,6]]}});

// ---------------------------------------------------------------- X. TAMAMO, THE ILLUSIONIST
// The Emperor's court illusionist: layered white, red and gold robes, a white fox mask with red markings pushed to the
// side of her head, long silver-white hair, a folding fan, and a costume of nine long paper tails fanned behind her.
// Second form: the mask cracked over her face, the paper tails burning at the tips with violet fire.
function tamDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const W1='#f4f0ea',RD='#c02838',GD='#e0b040',PU='#8a4ac0',SK='#f4dcc8',HAIR='#e8e4f0',PAPER='#f8f2e0';
 // long silver hair falling behind her
 trap(cx,12+by,44+by,7,9,HAIR);
 // nine paper tails fanned behind her
 const spread=Q.spread||1;for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.32*spread,x0=cx,y0=46+by,x1=x0+Math.cos(a)*30,y1=y0+Math.sin(a)*26,mx=x0+Math.cos(a)*16+Math.cos(a+1.57)*3,my=y0+Math.sin(a)*14;
  L(x0,y0,mx,my,OUTC,6);L(mx,my,x1,y1,OUTC,5);L(x0,y0,mx,my,PAPER,4);L(mx,my,x1,y1,PAPER,3);L(x0-1,y0,mx-1,my,'#ffffff',1);
  R(mx-1,my,3,1,RD);if(two){E(x1,y1,3,3,'#3a1a5a');E(x1,y1-1,2,2,PU);R(x1,y1-3,1,2,'#e0a0ff');}else{E(x1,y1,2,2,GD);}}
 // layered robes to the floor
 trap(cx,26+by,72,8,15,W1,{pleats:1});trap(cx,44+by,72,6,11,RD);trap(cx,56+by,72,4,7,GD);R(cx-15,72,31,1,OUTC);
 L(cx-1,26+by,cx-6,44+by,RD,1);L(cx+1,26+by,cx+6,44+by,RD,1);R(cx-8,40+by,17,3,GD);R(cx-1,40+by,3,3,RD);
 // arms in long sleeves, the fan
 const far=Q.far||[[29,28],[25,37],[29,44]],near=Q.near||[[43,28],[48,37],[44,44]];
 arm(far,W1,W1,SK,4);arm(near,W1,W1,SK,4);for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,d+by-1,d+by+12,3,6,W1);R(c-6,d+by+11,13,1,RD);}
 const [hx2,hy2]=near[2],fo=Q.fanOpen;
 if(fo){for(let i=0;i<7;i++){const a=-2.4+i*.22;L(hx2,hy2+by,hx2+Math.cos(a)*11,hy2+by+Math.sin(a)*11,i%2?RD:GD,2);}L(hx2+Math.cos(-2.4)*11,hy2+by+Math.sin(-2.4)*11,hx2+Math.cos(-1.08)*11,hy2+by+Math.sin(-1.08)*11,OUTC,1);}
 else{L(hx2,hy2+by,hx2+2,hy2+by-9,OUTC,3);L(hx2,hy2+by,hx2+2,hy2+by-9,RD,1);}
 K.hand(hx2,hy2+by,SK);
 // head: long silver hair, the face, the fox mask
 const hx=cx,hy=17+by;E(hx,hy-1,8,8,OUTC);E(hx,hy-1,7,7,HAIR);face(hx,hy+1,SK,{eye:two?'#c060ff':'#7a2a3a',mouth:'#c04050'});R(hx-6,hy-4,12,3,HAIR);R(hx-7,hy-3,2,12,HAIR);R(hx+6,hy-3,2,10,HAIR);
 const mask=(mx,my)=>{E(mx,my,5,5,OUTC);E(mx,my,4,4,'#ffffff');L(mx-4,my-4,mx-6,my-9,OUTC,3);L(mx+4,my-4,mx+6,my-9,OUTC,3);L(mx-4,my-4,mx-6,my-8,'#ffffff',1);L(mx+4,my-4,mx+6,my-8,'#ffffff',1);
  R(mx-3,my-1,2,1,RD);R(mx+2,my-1,2,1,RD);R(mx-1,my-3,3,1,RD);R(mx,my+2,1,2,OUTC);};
 if(!two){mask(hx+8,hy-5);}else{mask(hx,hy+1);L(hx-1,hy-3,hx+2,hy+6,OUTC,1);R(hx+1,hy,3,3,SK);R(hx+2,hy+1,1,1,'#c060ff');}
 R(hx-2,hy-7,5,2,GD);R(hx-1,hy-8,3,1,RD);}
humBoss('TAMAMO, THE ILLUSIONIST',tamDraw,{
 idle0:{},idle1:{b:1,spread:1.04},
 atk:{fanOpen:1,spread:1.15,near:[[43,28],[52,24],[56,16]],far:[[29,28],[20,32],[14,30]]}});

// ---------------------------------------------------------------- VI. TETSUO THE GUNSMITH
// A stocky gun-captain: a black lacquered jingasa hat with a gold crest, a moustache, dark blue armour under a scorched
// leather apron, a bandolier of powder flasks, and a long matchlock with a smouldering match cord. Second form: the hat
// blown off, soot on his face, the apron burning, and a short hand cannon braced at the hip.
function tetDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const NV='#2a3a5a',NV2='#3a4e74',LE='#7a5030',LE2='#a07048',SK='#d8a878',IR='#3a3a44',WD='#6a4422',GD='#e0b040';
 // legs: armoured shins, sandals
 leg(31,52,29,62,28,73,NV,IR,'#2a2018',6);leg(41,52,44,62,45,73,NV,IR,'#2a2018',6);
 // thigh guards and the leather apron
 trap(cx,46+by,58,10,13,NV,{pleats:2});trap(cx,40+by,62,6,8,LE);for(let y=44;y<62;y+=5)R(cx-6,y+by*(y<50?1:0),13,1,'#5a3820');
 if(two)for(const [x,y] of [[cx-5,56],[cx+3,52],[cx,60]]){R(x,y,3,2,'#ff8030');R(x+1,y-2,1,2,'#ffd040');}
 // body: armour plates, bandolier with flasks
 trap(cx,26+by,46+by,10,10,NV);for(let y=30;y<46;y+=4)R(cx-10,y+by,21,1,'#1a2440');
 L(cx-9,27+by,cx+9,45+by,LE,3);for(let i=0;i<4;i++){const x=cx-6+i*5,y=30+i*4+by;R(x-1,y,3,4,OUTC);R(x,y,2,3,'#c8a060');}
 R(cx-10,44+by,21,3,'#5a1a18');
 // the matchlock: long, held across the body (levelled to fire in the attack)
 const far0=Q.far||[[27,29],[23,39],[25,49]],near0=Q.near||[[45,29],[50,37],[46,40]];
 // the gun always runs through both hands: stock behind the back hand, muzzle past the front one
 const g=(()=>{const [fx,fy]=far0[2],[nx,ny]=near0[2],dx=nx-fx,dy=ny-fy,l=Math.hypot(dx,dy);if(l<6)return Q.gun||[[18,58],[56,22]];const ux=dx/l,uy=dy/l;return [[Math.round(fx-ux*10),Math.round(fy-uy*10)],[Math.round(nx+ux*14),Math.round(ny+uy*14)]];})();if(!two){const [[x0,y0],[x1,y1]]=g;L(x0,y0+by,x1,y1+by,OUTC,4);L(x0,y0+by,x1,y1+by,WD,2);const t=.3;L(x0+(x1-x0)*t,y0+(y1-y0)*t+by,x1,y1+by,IR,2);
  L(x0+(x1-x0)*.28,y0+(y1-y0)*.28+by,x0+(x1-x0)*.28-2,y0+(y1-y0)*.28+by+3,GD,1);
  const mx=x0+(x1-x0)*.26,my=y0+(y1-y0)*.26+by;R(mx-1,my-3,1,1,'#ff6020');R(mx-2,my-5,1,1,'#a09890');R(mx-1,my-7,1,1,'#7a7470');
  if(Q.flash){E(x1+3,y1+by,4,3,'#ffd040');E(x1+3,y1+by,2,2,'#ffffff');R(x1+6,y1+by-1,4,1,'#ff8030');}}
 // arms
 const far=Q.far||[[27,29],[23,39],[25,49]],near=Q.near||[[45,29],[50,37],[46,40]];
 arm(far,NV2,IR,SK,5);arm(near,NV2,IR,SK,5);
 if(two){// the hand cannon at the hip
  const [hx2,hy2]=near[2];R(hx2-6,hy2+by-3,16,7,OUTC);R(hx2-5,hy2+by-2,14,5,'#4a4a56');R(hx2-5,hy2+by-2,14,1,'#7a7a88');R(hx2+8,hy2+by-3,3,7,'#2a2a34');R(hx2-3,hy2+by-2,2,5,GD);
  if(Q.flash){E(hx2+14,hy2+by,5,4,'#ffd040');E(hx2+14,hy2+by,3,2,'#ffffff');}K.hand(hx2,hy2+by,SK);}
 // shoulders
 for(const s of [-1,1]){trap(cx+s*10,26+by,32+by,4,5,NV2);}
 // head
 const hx=cx,hy=18+by;face(hx,hy,two?'#8a6a50':SK,{eye:OUTC,brow:'#2a1a10',mouth:false});R(hx-4,hy+3,9,2,'#2a1a10');R(hx-5,hy+4,2,2,'#2a1a10');R(hx+4,hy+4,2,2,'#2a1a10');
 if(!two){E(hx,hy-5,15,4,OUTC);E(hx,hy-5,14,3,'#1e1e28');E(hx-3,hy-6,7,1,'#3a3a48');E(hx,hy-8,5,2,'#1e1e28');R(hx-1,hy-8,3,2,GD);}
 else{R(hx-5,hy-6,11,3,'#2a1a10');for(const [a,b] of [[-6,-2],[6,-3],[0,-5]])L(hx,hy-6,hx+a,hy-6+b,'#2a1a10',2);R(hx-3,hy-1,2,1,'#ff8030');for(const [x,y] of [[hx-4,hy+1],[hx+3,hy-2]])R(x,y,2,1,'#3a3030');
  for(let i=0;i<3;i++)E(hx-8+i*8,hy-14-i*2,2+i%2,2,'#5a5460');}}
humBoss('TETSUO THE GUNSMITH',tetDraw,{
 idle0:{},idle1:{b:1},
 atk:{flash:1,gun:[[24,40],[66,30]],far:[[27,29],[30,38],[34,38]],near:[[45,29],[48,36],[52,34]]}});

// ---------------------------------------------------------------- VII. THE THOUSAND-BELL ABBOT
// A towering warrior-monk: a wide straw hat, grey robes under a dark kesa stole, a great bronze temple bell slung on his
// back, a ringed shakujo staff, prayer beads. Second form: the bell cracked, the hat gone, the upper robe dropped to his
// waist showing a torso tattooed with sutras, beads wound round his fist.
function abbDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const GR='#8a8478',GR2='#b0aa9c',KS='#3a2a4a',KS2='#5a4268',SK='#c89060',BZ='#a07028',BZ2='#d0a040',BZ3='#f0d070',ST='#4a3a28';
 // the bell on his back
 const bx=cx+9,bt=12+by;trap(bx,bt+4,bt+26,7,12,BZ);R(bx-13,bt+26,27,3,OUTC);R(bx-12,bt+26,25,2,BZ2);E(bx,bt+3,5,3,OUTC);E(bx,bt+3,4,2,BZ);R(bx-2,bt-2,5,3,BZ2);
 for(const y of [bt+10,bt+18])R(bx-10,y,21,1,'#6a4a18');for(let i=0;i<3;i++)for(let j=0;j<2;j++)R(bx-6+i*5,bt+12+j*3,2,2,BZ3);
 if(two){L(bx+2,bt+4,bx-1,bt+14,OUTC,1);L(bx-1,bt+14,bx+3,bt+22,OUTC,1);L(bx+3,bt+22,bx+1,bt+28,OUTC,1);}
 // legs, robe skirt
 leg(31,54,30,63,29,73,GR,'#e0dccc','#6a4a2a',6);leg(41,54,43,63,44,73,GR,'#e0dccc','#6a4a2a',6);
 trap(cx,40+by,64,11,15,GR,{pleats:2});
 // torso: robe and stole, or the bare tattooed chest
 if(!two){trap(cx,24+by,44+by,11,12,GR);L(cx-10,25+by,cx+8,44+by,KS,5);L(cx-10,24+by,cx+8,43+by,KS2,1);for(let i=0;i<5;i++)R(cx-8+i*4,27+i*4+by,2,2,'#c8a040');}
 else{trap(cx,24+by,44+by,11,11,SK);E(cx-4,30+by,4,3,K.lt(SK));E(cx+4,30+by,4,3,K.dk(SK));R(cx,26+by,1,16,K.dk(SK));
  for(let r=0;r<6;r++)for(let c=0;c<4;c++)if((r+c)%2===0)R(cx-8+c*5,27+r*3+by,2,1,'#2a2a5a');R(cx-11,42+by,23,3,KS);}
 R(cx-11,43+by,23,2,'#5a3a20');
 // the staff with its rings, held upright (struck down in the attack)
 const sf=Q.staff||[[56,72],[56,4]];const [[s0,s1],[s2,s3]]=sf;L(s0,s1,s2,s3+by,OUTC,4);L(s0,s1,s2,s3+by,ST,2);L(s0-1,s1,s2-1,s3+by,'#7a6040',1);
 E(s2,s3+by+1,4,5,OUTC);E(s2,s3+by+1,3,4,BZ);E(s2,s3+by+1,1,2,OUTC);for(const k of [-1,1]){E(s2+k*4,s3+by+5,2,2,OUTC);E(s2+k*4,s3+by+5,1,1,BZ3);}
 // arms
 const far=Q.far||[[26,27],[21,38],[22,48]],near=Q.near||[[46,27],[52,36],[56,40]];
 const sl=two?SK:GR;arm(far,sl,SK,SK,6);arm(near,sl,SK,SK,6);
 if(!two)for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,d+by-1,d+by+8,4,6,GR);}
 // beads
 {const [x,y]=far[2];for(let i=0;i<6;i++){const a=i/6*TAU;R(x+Math.cos(a)*3-1,y+by+Math.sin(a)*3+(two?0:4),2,2,two?'#e0c080':'#6a2a1a');}}
 // head
 const hx=cx,hy=16+by;face(hx,hy,SK,{eye:OUTC,brow:'#3a2a1a',mouth:'#7a4020',ey:0});R(hx-1,hy+1,3,2,K.dk(SK));
 if(!two){E(hx,hy-4,18,4,OUTC);E(hx,hy-4,17,3,'#c8a860');E(hx-4,hy-5,8,1,'#e8d090');E(hx,hy-7,7,2,'#b89448');R(hx-16,hy-3,33,1,'#8a6a34');R(hx-6,hy+6,13,3,'#e8e4d8');}
 else{E(hx,hy-3,6,4,K.lt(SK));R(hx-3,hy-6,1,1,'#ffffff');for(const [x,y] of [[-2,-6],[1,-6],[-3,-4],[2,-4],[-1,-5]])R(hx+x,hy+y,1,1,'#2a2a5a');R(hx-3,hy+1,2,1,'#ffd040');R(hx+2,hy+1,2,1,'#ffd040');}}
humBoss('THE THOUSAND-BELL ABBOT',abbDraw,{
 idle0:{},idle1:{b:1},
 atk:{dy:-1,staff:[[50,26],[66,72]],near:[[46,27],[54,30],[58,40]],far:[[26,27],[34,32],[52,34]]}});

// ---------------------------------------------------------------- VIII. ONIKUMA, THE JAILER
// A giant warden in black iron lamellar under a bear's-head hood (snout over his brow, fangs framing his face), a ring
// of jail keys at his belt, and an iron kanabo chained to his wrist. Second form: hood and plates gone, a scarred
// ex-sumo brawler in a mawashi, chains wound round both fists.
function oniDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const IR='#2a2a34',IR2='#4a4a58',IR3='#6a6a7a',FUR='#5a3a22',FUR2='#7a5232',FUR3='#a07850',SK='#c89070',CH='#8a8a98';
 // legs: thick, armoured or bare
 leg(29,54,27,63,26,73,two?SK:IR,two?SK:IR2,'#2a1a10',8);leg(43,54,46,63,47,73,two?SK:IR,two?SK:IR2,'#2a1a10',8);
 // body
 if(!two){trap(cx,44+by,62,13,16,IR,{pleats:3});for(let y=47;y<62;y+=4)R(cx-15,y,31,1,IR3);
  trap(cx,24+by,46+by,14,14,IR);for(let y=27;y<46;y+=3){R(cx-14,y+by,29,1,IR3);for(let x=-12;x<14;x+=4)R(cx+x,y+by+1,1,1,'#1a1a22');}
  // the fur cape of the hood over the shoulders
  trap(cx,20+by,32+by,10,17,FUR);for(let x=-15;x<16;x+=3)R(cx+x,32+by,2,2,FUR);
  // keys
  E(cx-9,49+by,4,4,OUTC);E(cx-9,49+by,3,3,'#b08a30');E(cx-9,49+by,2,2,IR);for(let i=0;i<3;i++)R(cx-12+i*3,52+by,1,5,'#d0a840');}
 else{trap(cx,44+by,58,12,13,'#e8e0d0');R(cx-13,44+by,27,5,'#3a2a5a');R(cx-2,44+by,5,12,'#3a2a5a');
  E(cx,34+by,15,13,OUTC);E(cx,34+by,14,12,SK);E(cx-4,30+by,7,6,K.lt(SK));E(cx+6,37+by,6,7,shade(SK,-.12));R(cx-5,38+by,3,1,shade(SK,-.2));R(cx+3,38+by,3,1,shade(SK,-.2));R(cx,24+by,1,18,K.dk(SK));
  for(const [x0,y0,x1,y1] of [[-8,28,-2,36],[4,30,9,26],[-6,40,2,42]])L(cx+x0,y0+by,cx+x1,y1+by,'#8a4a3a',1);}
 // arms: huge, the kanabo on a chain
 const far=Q.far||[[22,28],[16,40],[18,51]],near=Q.near||[[50,28],[56,40],[54,51]];
 arm(far,two?SK:IR2,two?SK:IR,SK,7);arm(near,two?SK:IR2,two?SK:IR,SK,7);
 for(const A of (two?[far,near]:[near])){const [x,y]=A[2];for(let i=0;i<3;i++)R(x-3,y+by-4+i*2,7,1,CH);}
 const kb=Q.club||[[54,51],[64,70]];if(!two){const [[k0,k1],[k2,k3]]=kb;L(k0,k1+by,k2,k3,OUTC,7);L(k0,k1+by,k2,k3,'#3a3a44',5);L(k0-1,k1+by,k2-1,k3,'#6a6a78',1);
  for(let i=1;i<6;i++){const t=i/6;R(k0+(k2-k0)*t-1+(i%2?2:-2),k1+by+(k3-k1-by)*t-1,2,2,'#a8a8b8');}
  for(let i=0;i<5;i++){const t=i/5;R(k0+(18-k0)*0+ (far[2][0]-k0)*t,k1+by+(far[2][1]-k1)*t*0+Math.sin(t*3.1)*4,2,1,CH);}}
 // shoulder plates or bare shoulders
 for(const s of [-1,1]){if(!two){trap(cx+s*15,26+by,33+by,5,6,IR2);R(cx+s*15-5,33+by,11,1,IR3);}}
 // head: bear-head hood, or a scarred bald brawler with a topknot
 const hx=cx,hy=16+by;
 if(!two){E(hx,hy-2,13,11,OUTC);E(hx,hy-2,12,10,FUR);E(hx-3,hy-5,6,4,FUR2);for(const s of [-1,1]){E(hx+s*10,hy-11,4,4,OUTC);E(hx+s*10,hy-11,3,3,FUR);R(hx+s*10-1,hy-11,2,2,'#3a2414');}
  E(hx,hy-6,6,4,FUR3);R(hx-2,hy-5,5,2,OUTC);R(hx-1,hy-8,3,1,'#2a1a10');R(hx-5,hy-4,2,1,'#ffd040');R(hx+4,hy-4,2,1,'#ffd040');
  face(hx,hy+3,SK,{eye:'#ffffff',eh:1,brow:'#2a1a10',mouth:false});R(hx-3,hy+3,1,1,OUTC);R(hx+3,hy+3,1,1,OUTC);for(const s of [-1,1]){L(hx+s*6,hy-1,hx+s*5,hy+5,'#f0e8d8',2);}R(hx-3,hy+7,7,2,'#2a1a10');}
 else{face(hx,hy+2,SK,{eye:OUTC,brow:'#1a1010',mouth:'#5a2010'});R(hx-2,hy-9,5,4,'#1a1010');R(hx-1,hy-11,3,2,'#1a1010');L(hx+2,hy-3,hx+5,hy+5,'#8a3a2a',1);R(hx-3,hy+2,2,1,'#ff4030');}}
humBoss('ONIKUMA, THE JAILER',oniDraw,{
 idle0:{},idle1:{b:1},
 atk:{dy:-1,near:[[50,28],[58,20],[56,8]],club:[[56,8],[40,-8]],far:[[22,28],[14,36],[12,46]]}},{sc:1.15});

// ---------------------------------------------------------------- IX. KAGE, THE SHINOBI MASTER
// The master of the castle roofs: deep indigo garb, hood and mask with only the eyes showing, a long red scarf
// streaming behind, a ninjato across his back, shuriken at his belt. Second form: the mask torn to show a scarred jaw,
// the scarf ripped short, red eyes, both blades drawn.
function kagDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const IN='#1e2238',IN2='#2e3456',IN3='#465080',RD='#c02030',RD2='#ff4050',ST='#a8b0c8',SK='#d8b090';
 // the scarf streaming behind
 const sl=two?12:30,sw=Q.wind||0;for(let i=0;i<sl;i+=2){const x=cx-4-i,y=24+by+Math.sin(i*.25+sw)*3+i*.2;R(x-1,y-1,4,5,OUTC);}
 for(let i=0;i<sl;i+=2){const x=cx-4-i,y=24+by+Math.sin(i*.25+sw)*3+i*.2;R(x,y,3,3,i%4?RD:RD2);}
 // sword across the back
 if(!two){L(cx-10,14+by,cx+12,42+by,OUTC,4);L(cx-10,14+by,cx+12,42+by,'#2a2a34',2);R(cx-12,11+by,4,4,'#c0a040');}
 // legs
 const lg=Q.legs||'stand';
 if(lg==='stand'){leg(32,50,29,61,27,73,IN,IN2,'#14141e',5);leg(40,50,44,61,46,73,IN,IN2,'#14141e',5);}
 else{leg(32,50,24,58,20,70,IN,IN2,'#14141e',5);leg(40,50,48,60,52,73,IN,IN2,'#14141e',5);}
 for(const [x,y0] of [[28,62],[45,62]])for(let y=y0;y<71;y+=3)R(x-2,y,5,1,IN3);
 // body
 trap(cx,26+by,50+by,8,9,IN);L(cx-7,27+by,cx+5,42+by,IN2,2);R(cx-9,44+by,19,3,'#3a3040');for(let i=0;i<3;i++){const x=cx-5+i*5,y=45+by;R(x,y-1,1,3,ST);R(x-1,y,3,1,ST);}
 // arms
 const far=Q.far||[[29,29],[25,39],[27,47]],near=Q.near||[[43,29],[48,38],[46,47]];
 arm(far,IN2,IN,'#2a2a3a',4);arm(near,IN2,IN,'#2a2a3a',4);
 for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;for(let k=1;k<3;k++){const t=k/3;R(c+(e-c)*t-2,d+by+(f-d)*t,4,1,IN3);}}
 // blades: a kunai in hand, or both swords drawn in the second form
 const bl=(h,a,len)=>{const [x,y]=h;L(x,y+by,x+Math.cos(a)*len,y+by+Math.sin(a)*len,OUTC,3);L(x,y+by,x+Math.cos(a)*len,y+by+Math.sin(a)*len,ST,1);R(x-1,y+by-1,3,3,'#2a2a34');};
 if(two){bl(near[2],Q.ba||.6,20);bl(far[2],Q.bb||2.4,18);}else bl(near[2],Q.ba||1.2,7);
 if(Q.star){const [x,y]=Q.star;for(const a of [0,1.57])L(x-Math.cos(a)*3,y-Math.sin(a)*3+by,x+Math.cos(a)*3,y+Math.sin(a)*3+by,ST,1);R(x,y+by,1,1,OUTC);}
 // head: hood and mask
 const hx=cx,hy=17+by;E(hx,hy,7,8,OUTC);E(hx,hy,6,7,IN);E(hx-2,hy-3,3,3,IN2);R(hx-5,hy-2,11,4,two?SK:IN);R(hx-5,hy-1,11,3,two?SK:'#d8b090');
 R(hx-3,hy,2,1,two?'#ff3030':'#ffffff');R(hx+2,hy,2,1,two?'#ff3030':'#ffffff');R(hx-4,hy-2,9,1,IN);
 if(two){R(hx-4,hy+2,9,5,SK);L(hx-3,hy+3,hx+2,hy+6,'#8a4a3a',1);R(hx-1,hy+5,3,1,'#5a2a20');R(hx-5,hy+6,11,2,IN);}
 R(hx+6,hy-2,3,2,RD);}
humBoss('KAGE, THE SHINOBI MASTER',kagDraw,{
 idle0:{},idle1:{b:1,wind:1},
 atk:{legs:'lunge',wind:2,near:[[43,29],[54,26],[62,20]],far:[[29,29],[22,36],[18,44]],ba:-.6,bb:2.8,star:[66,14]}});

// ---------------------------------------------------------------- XI. LORD KUROGANE, THE BLACK HORSE GENERAL
// Mounted on Yamikaze, a black warhorse in red lacquered barding with a horned gold chamfron: the general in black
// armour with a great gold crescent crest, a long yari and a sashimono banner. At half health the horse falls and he
// fights on foot (KUROGANE ON FOOT): his cape torn, a nodachi in both hands.
const KG={BK:'#1a1a22',BK2:'#2e2e3a',BK3:'#4a4a5a',RD:'#9a1a1a',RD2:'#c83028',GD:'#d0a840',GD2:'#f0d070',SK:'#c8a080'};
function kurDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,by}=K,{BK,BK2,BK3,RD,RD2,GD,GD2,SK}=KG,g=Q.gallop,HB='#2c2c3c',HB2='#44445a',HB3='#62627c';
 // the horse: tail, far legs, barrel, near legs, neck and head
 for(let i=0;i<12;i++){const t=i/11,x=22-t*(g?16:8),y=34+t*20-(g?t*8:0);R(x-2,y+by,4,3,OUTC);}for(let i=0;i<12;i++){const t=i/11,x=22-t*(g?16:8),y=34+t*20-(g?t*8:0);R(x-1,y+by,2,2,i%3?'#14141c':HB);}
 const hl=(x0,y0,kx,ky,fx,fy,dim)=>{seg(x0,y0,kx,ky,5,dim?HB:HB2);seg(kx,ky,fx,fy-2,3,dim?HB:HB2);R(fx-3,fy-2,6,3,OUTC);R(fx-2,fy-2,4,2,'#5a5a64');};
 const legs=g?[[30,48,24,56,16,62],[62,46,72,52,80,56],[34,48,40,58,38,69],[66,46,64,57,70,68]]:[[29,48,27,58,28,69],[63,46,64,57,64,69],[34,48,35,58,35,69],[68,46,69,57,70,69]];
 hl(...legs[0],1);hl(...legs[1],1);
 E(46,40+by,24,11,OUTC);E(46,40+by,23,10,HB);E(42,35+by,18,4,HB2);E(38,33+by,10,1,HB3);E(26,38+by,10,9,HB2);E(66,40+by,9,9,HB2);
 // barding: red lacquered plates edged in gold
 for(let r=0;r<3;r++){const y=40+r*4+by;R(28,y,38,4,OUTC);R(29,y,36,3,r%2?RD:RD2);R(29,y,36,1,GD);for(let x=31;x<64;x+=4)R(x,y+1,1,2,'#5a0a0a');}
 R(28,52+by,38,1,GD);
 hl(...legs[2],0);hl(...legs[3],0);
 // neck and head with the chamfron
 const hdy=g?-4:0;seg(64,38+by,76,20+hdy+by,9,HB);seg(76,20+hdy+by,88,28+hdy+by,6,HB);E(77,21+hdy+by,5,5,HB2);
 for(let i=0;i<6;i++)L(64+i*2,32-i*2+by,61+i*2,28-i*2+by,'#14141c',2);
 R(78,16+hdy+by,2,4,OUTC);R(78,16+hdy+by,1,3,BK2);
 seg(78,20+hdy+by,86,26+hdy+by,3,RD);R(80,18+hdy+by,3,2,GD);L(81,17+hdy+by,84,10+hdy+by,GD2,1);R(80,22+hdy+by,2,1,'#ff3030');
 R(87,28+hdy+by,2,2,'#2a2a34');
 // the rider
 const rx=46,ry=16+by;
 // banner on his back
 L(rx-8,ry-14,rx-8,ry+18,'#3a2a1a',1);R(rx-15,ry-14,7,12,OUTC);R(rx-14,ry-13,5,10,BK);R(rx-13,ry-11,3,4,GD);
 // legs astride
 seg(rx-2,ry+20,rx+4,ry+30,4,BK2);seg(rx+4,ry+30,rx+2,ry+38,3,BK);
 trap(rx,ry+6,ry+22,6,8,BK);for(let y=ry+9;y<ry+22;y+=3)R(rx-7,y,15,1,BK3);R(rx-7,ry+18,15,2,RD);
 for(const s of [-1,1]){trap(rx+s*8,ry+6,ry+11,3,4,BK2);R(rx+s*8-3,ry+11,7,1,GD);}
 // the yari: upright, or couched forward in the charge
 if(Q.couch){L(rx-14,ry+20,rx+48,ry+8,OUTC,3);L(rx-14,ry+20,rx+48,ry+8,'#5a3a22',1);L(rx+44,ry+9,rx+54,ry+7,'#e8eef6',2);seg(rx+6,ry+9,rx+12,ry+16,3,BK2);K.hand(rx+12,ry+16,SK);}
 else{L(rx+10,ry+30,rx+24,ry-8,OUTC,3);L(rx+10,ry+30,rx+24,ry-8,'#5a3a22',1);L(rx+24,ry-8,rx+27,ry-15,'#e8eef6',2);seg(rx+6,ry+9,rx+12,ry+14,3,BK2);K.hand(rx+12,ry+14,SK);}
 // head: black kabuto with the gold crescent, a red menpo
 const hx=rx,hy=ry;E(hx,hy+1,5,5,OUTC);E(hx,hy+1,4,4,'#8a1818');R(hx-2,hy,1,1,'#ffd040');R(hx+2,hy,1,1,'#ffd040');
 E(hx,hy-3,7,4,OUTC);E(hx,hy-3,6,3,BK);R(hx-7,hy-1,15,2,BK2);
 L(hx-1,hy-6,hx-9,hy-14,GD,2);L(hx+1,hy-6,hx+9,hy-14,GD,2);L(hx-1,hy-7,hx-8,hy-14,GD2,1);R(hx-1,hy-7,3,2,GD2);}
function kfDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,by}=K,{BK,BK2,BK3,RD,RD2,GD,GD2,SK}=KG,cx=36;
 // torn cape
 trap(cx,26+by,64,10,16,'#5a0a0a');for(const [x,h] of [[-14,6],[-6,9],[4,5],[12,8]])R(cx+x,64-h,3,h+1,'#00000000'===0?0:'#3a0606');
 leg(31,52,28,62,27,73,BK,BK2,'#14141e',6);leg(41,52,45,62,46,73,BK,BK2,'#14141e',6);
 trap(cx,44+by,60,10,13,BK,{pleats:2});for(let y=48;y<60;y+=4)R(cx-12,y,25,1,BK3);
 trap(cx,26+by,46+by,10,10,BK);for(let y=29;y<46;y+=3)R(cx-10,y+by,21,1,BK3);R(cx-10,42+by,21,3,RD);R(cx-2,32+by,5,5,GD);
 for(const s of [-1,1]){trap(cx+s*12,26+by,34+by,5,6,BK2);R(cx+s*12-6,34+by,13,1,GD);}
 // the nodachi in both hands
 const sw=Q.sw||[[30,48],[56,6]];const [[a,b],[c,d]]=sw;L(a,b+by,c,d+by,OUTC,4);L(a,b+by,c,d+by,'#c8d0dc',2);L(a,b+by-1,c,d+by-1,'#ffffff',1);R(a-2,b+by-1,5,3,GD);L(a,b+by,a-(c-a)*.15,b+by-(d-b)*.15,'#2a1a10',2);
 const far=Q.far||[[27,29],[24,40],[a-1,b]],near=Q.near||[[45,29],[44,40],[a+2,b-3]];arm(far,BK2,BK,SK,5);arm(near,BK2,BK,SK,5);
 const hx=cx,hy=17+by;E(hx,hy+1,6,6,OUTC);E(hx,hy+1,5,5,'#8a1818');R(hx-3,hy,2,1,'#ffd040');R(hx+2,hy,2,1,'#ffd040');R(hx-3,hy+4,7,1,'#f0e8d8');
 E(hx,hy-4,9,5,OUTC);E(hx,hy-4,8,4,BK);R(hx-9,hy-1,19,2,BK2);L(hx-1,hy-8,hx-12,hy-18,GD,2);L(hx+1,hy-8,hx+12,hy-18,GD,2);R(hx-1,hy-9,3,2,GD2);}
BART['LORD KUROGANE']=Object.assign(p=>kurDraw(p,[{},{b:1},{gallop:1,couch:1}][p.f]||{}),{fw:96,fh:72,raw:1,sc:1.05});
humBoss('KUROGANE ON FOOT',kfDraw,{idle0:{},idle1:{b:1},atk:{sw:[[42,30],[70,58]],far:[[27,29],[34,34],[41,30]],near:[[45,29],[48,34],[44,31]]}});

// ---------------------------------------------------------------- XII. THE CORRUPT EMPEROR
// The Emperor in court regalia: a vast black-violet outer robe with gold cloud embroidery and a long train, red
// under-robes, a tall black court cap with its upright tail behind a gold diadem, a sceptre crowned with a black orb.
// Second form: the robe splits down the front over a violet rift, veins across his face, eyes blazing, the cap askew.
function empDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,face,by}=K,two=ARTHURT,cx=36;
 const VI='#2a1238',VI2='#44205a',GD='#e0b040',GD2='#fff0a0',RD='#9a1a2a',SK='#e8d4c4',RT='#b040ff',RT2='#e080ff';
 // the train and outer robe, wide to the floor
 trap(cx,22+by,73,12,22,VI);for(const [x,y] of [[-16,60],[-8,52],[10,58],[16,66],[-2,66],[6,44],[-12,40]]){R(cx+x,y,4,1,GD);R(cx+x+1,y-1,2,1,GD);R(cx+x+1,y+1,2,1,'#a07020');}
 R(cx-22,72,45,1,GD);
 // red under-robe in the opening
 trap(cx,30+by,73,3,7,RD);
 if(two){for(let y=26;y<=72;y++){const w=Math.round(1+(y-26)*.1+Math.sin(y*.8+(Q.ph||0))*1);R(cx-w-1,y+(y<50?by:0),w*2+3,1,OUTC);R(cx-w,y+(y<50?by:0),w*2+1,1,'#6a20a0');if(w>1)R(cx-w+1,y+(y<50?by:0),w*2-1,1,y%3?RT:RT2);}
  for(const [x0,y0,x1,y1] of [[-4,32,-12,40],[4,36,12,44],[-4,52,-12,58],[4,56,12,64]])L(cx+x0,y0,cx+x1,y1,RT,1);}
 // the gold sash and the jewelled belt
 R(cx-12,40+by,25,3,GD);for(let i=0;i<5;i++)R(cx-10+i*5,40+by,2,2,i%2?'#c02040':'#40a0c0');
 // arms in huge sleeves
 const far=Q.far||[[26,26],[21,37],[25,46]],near=Q.near||[[46,26],[52,36],[50,44]];
 arm(far,VI2,VI2,SK,5);arm(near,VI2,VI2,SK,5);
 for(const A of [far,near]){const [[a,b],[c,d]]=A;trap(c,d+by-2,d+by+12,4,8,VI2);R(c-8,d+by+12,17,1,GD);}
 // the sceptre and its black orb
 const sp=Q.sc||[[50,44],[54,8]];const [[s0,s1],[s2,s3]]=sp;L(s0,s1+by,s2,s3+by,OUTC,3);L(s0,s1+by,s2,s3+by,GD,1);E(s2,s3+by-2,4,4,OUTC);E(s2,s3+by-2,3,3,'#14101a');R(s2-1,s3+by-3,1,1,RT2);
 if(Q.glow){for(let i=0;i<8;i++){const a=i/8*TAU;R(s2+Math.cos(a)*7,s3+by-2+Math.sin(a)*7,2,2,i%2?RT:RT2);}}
 // collar
 trap(cx,22+by,28+by,6,9,GD);R(cx-3,22+by,7,6,'#f4ecd8');
 // head: the face, a thin moustache, the court cap and diadem
 const hx=cx,hy=15+by;face(hx,hy,two?'#d0b8c8':SK,{eye:two?RT2:OUTC,brow:'#1a1018',mouth:false});R(hx-3,hy+3,7,1,'#1a1018');R(hx-4,hy+4,1,2,'#1a1018');R(hx+4,hy+4,1,2,'#1a1018');
 if(two){L(hx-5,hy-1,hx-2,hy+5,RT,1);L(hx+5,hy,hx+3,hy+5,RT,1);R(hx-3,hy,2,1,'#ffffff');R(hx+2,hy,2,1,'#ffffff');}
 const tilt=two?2:0;R(hx-5+tilt,hy-10,11,6,OUTC);R(hx-4+tilt,hy-9,9,5,'#14101a');R(hx-6+tilt,hy-5,13,2,GD);for(let i=0;i<4;i++)R(hx-5+tilt+i*3,hy-7,1,2,GD2);
 L(hx+tilt,hy-10,hx-6+tilt,hy-22,OUTC,3);L(hx+tilt,hy-10,hx-6+tilt,hy-22,'#14101a',1);
 for(let i=0;i<5;i++)L(hx-5+i*2.5+tilt,hy-3,hx-5+i*2.5+tilt,hy+(i%2?2:0),'#e8e0c0',1);}
humBoss('THE CORRUPT EMPEROR',empDraw,{
 idle0:{},idle1:{b:1,ph:1},
 atk:{glow:1,near:[[46,26],[54,20],[56,10]],sc:[[56,12],[60,-4]].map(([x,y])=>[x,y+12])}},{sc:1.1});
// the true form (phase 3): his second-form sprite, swallowed by corruption, a dragon's horns through the crown
EMPR.mkTrue=function(e){let s;ARTHURT=true;try{s=bossArt('THE CORRUPT EMPEROR');}finally{ARTHURT=false;}
 const c=mk(s.c.width,s.c.height,g=>{g.drawImage(s.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(90,10,140,.45)';g.fillRect(0,0,s.c.width,s.c.height);});
 const g=c.getContext('2d');for(let f=0;f<s.frames;f++){const x0=f*s.fw+36;for(const k of [-1,1]){g.fillStyle='#14101a';for(let i=0;i<9;i++)g.fillRect(x0+k*(6+i)-1,8-i*.6,3,4);g.fillStyle='#ffd040';for(let i=0;i<9;i++)g.fillRect(x0+k*(6+i),9-i*.6,1,2);}
  g.fillStyle='#ff40ff';g.fillRect(x0-4,15,2,1);g.fillRect(x0+3,15,2,1);}
 return Object.assign({},s,{c,wc:whiteOf(c),sc:(s.sc||1)*1.6});};

// ---------------------------------------------------------------- V. THE RONIN SEVEN
// Seven masterless samurai, each their own silhouette at about one and a half times a normal foe: Jubei the white iaido
// swordsman, Gonza the spearman, Hanzo the archer, Okichi with her chain-sickle, Tetsugoro the giant with his axe, the
// Twins in orange with kunai, and Muramasa the leader in blossom-pink armour with a horned helmet.
function r7Draw(p,d,f){const Q={b:f};const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,by}=K,cx=26,c=d.c,c2=shade(c,-.35),c3=shade(c,-.6),SK='#d8b090',HR='#1a1418',ST='#c8d0dc',WD='#6a4422';
 const big=d.type==='brute';
 const head=(hy,o={})=>{face(cx,hy,SK,{eye:OUTC,brow:HR,mouth:false});if(o.top!==false){E(cx,hy-4,6,3,OUTC);E(cx,hy-4,5,2,HR);R(cx-6,hy-3,2,5,HR);R(cx+5,hy-3,2,5,HR);}};
 if(d.id==='JUBEI'){leg(23,40,22,48,21,58,c3,'#3a3a44',null,4);leg(29,40,31,48,32,58,c3,'#3a3a44',null,4);trap(cx,32+by,52,7,10,c2,{pleats:1});trap(cx,18+by,36+by,7,8,c);R(cx-7,33+by,15,2,'#3a3a44');
  L(cx-12,40+by,cx+4,34+by,OUTC,3);L(cx-12,40+by,cx+4,34+by,'#2a2a34',1);arm([[20,20],[17,28],[cx-6,36]],c,c,SK,3);arm([[32,20],[34,28],[cx+2,34]],c,c,SK,3);head(12+by);R(cx-1,4+by,3,3,HR);}
 else if(d.id==='GONZA'){L(40,58,42,-2+by,OUTC,3);L(40,58,42,-2+by,WD,1);L(42,-2+by,43,-8+by,ST,2);leg(23,40,22,48,21,58,c2,c3,null,4);leg(29,40,31,48,32,58,c2,c3,null,4);trap(cx,32+by,46,8,9,c2,{pleats:1});trap(cx,18+by,34+by,8,8,c);for(let y=21;y<34;y+=3)R(cx-8,y+by,17,1,c3);
  arm([[19,20],[16,28],[18,35]],c2,c2,SK,3);arm([[33,20],[38,26],[41,30]],c2,c2,SK,3);head(12+by,{top:false});E(cx,8+by,11,3,OUTC);E(cx,8+by,10,2,'#2a2a34');E(cx,6+by,4,2,'#2a2a34');R(cx-1,6+by,3,1,'#c0a040');}
 else if(d.id==='HANZO'){L(12,6+by,10,30+by,OUTC,3);L(10,30+by,12,54,OUTC,3);L(12,6+by,10,30+by,WD,1);L(10,30+by,12,54,WD,1);L(12,6+by,12,54,'#e8e0c8',1);
  R(30,10+by,5,18,OUTC);R(31,11+by,3,16,'#6a3a20');for(let i=0;i<3;i++)R(30+i*2,7+by,1,4,'#f0f0f0');
  leg(23,40,22,48,21,58,c3,'#3a3a44',null,4);leg(29,40,31,48,32,58,c3,'#3a3a44',null,4);trap(cx,30+by,46,6,8,c2);trap(cx,18+by,34+by,7,7,c);arm([[20,20],[15,26],[11,30]],c,c,SK,3);arm([[32,20],[28,26],[22,28]],c,c,SK,3);head(12+by);R(cx-6,9+by,13,2,'#f0f0f0');}
 else if(d.id==='OKICHI'){trap(cx,24+by,52,6,9,c,{});R(cx-7,30+by,15,3,'#2a2a34');trap(cx,18+by,30+by,6,7,c);
  arm([[20,20],[16,28],[18,35]],c,c,SK,3);arm([[32,20],[36,27],[38,33]],c,c,SK,3);L(38,33+by,40,26+by,WD,2);L(40,26+by,44,27+by,ST,1);for(let i=0;i<6;i++)R(18+i*3,37+by+Math.sin(i)*2,2,1,'#8a8a98');
  head(12+by);E(cx,6+by,5,4,OUTC);E(cx,6+by,4,3,HR);L(cx+3,4+by,cx+8,1+by,'#e0b040',1);R(cx+7,0+by,2,2,'#ff4060');}
 else if(d.id==='TETSUGORO'){leg(21,40,19,48,18,58,c2,c3,null,6);leg(31,40,34,48,35,58,c2,c3,null,6);trap(cx,30+by,46,11,12,c3,{pleats:2});
  E(cx,26+by,13,11,OUTC);E(cx,26+by,12,10,SK);E(cx-3,23+by,5,4,K.lt(SK));L(cx-10,19+by,cx+9,32+by,c,4);
  arm([[16,20],[10,30],[12,38]],SK,SK,SK,6);arm([[36,20],[44,14],[46,4]],SK,SK,SK,6);
  L(46,8+by,40,-2+by,OUTC,3);E(47,2+by,6,5,OUTC);E(47,2+by,5,4,'#8a8a98');R(44,0+by,4,4,'#c8c8d4');L(46,30+by,46,-6+by,WD,2);
  face(cx,10+by,SK,{eye:OUTC,brow:HR,mouth:'#6a2a1a'});R(cx-1,3+by,3,2,HR);}
 else if(d.id==='TWINS'){leg(23,40,20,48,18,58,c2,c3,null,4);leg(29,40,33,48,35,58,c2,c3,null,4);trap(cx,20+by,40+by,6,7,c2);trap(cx,32+by,44,6,8,c2);L(cx-6,22+by,cx+4,36+by,c,2);
  arm([[20,22],[14,26],[10,24]],c2,c2,'#2a2a34',3);arm([[32,22],[38,26],[42,22]],c2,c2,'#2a2a34',3);for(const x of [10,42]){L(x,23+by,x+(x<cx?-3:3),18+by,ST,1);}
  E(cx,12+by,6,7,OUTC);E(cx,12+by,5,6,c2);R(cx-5,11+by,11,3,SK);R(cx-3,12+by,2,1,OUTC);R(cx+2,12+by,2,1,OUTC);R(cx+5,9+by,4,2,c);}
 else{// MURAMASA, the leader
  L(14,4+by,14,30+by,'#3a2a1a',1);R(8,4+by,6,10,OUTC);R(9,5+by,4,8,c);R(10,7+by,2,2,'#ffffff');
  leg(23,40,21,48,20,58,c3,'#3a3a44',null,4);leg(29,40,32,48,33,58,c3,'#3a3a44',null,4);trap(cx,32+by,48,9,11,c2,{pleats:2});trap(cx,18+by,36+by,8,9,c);
  for(let y=21;y<34;y+=3)R(cx-8,y+by,17,1,c2);for(const [x,y] of [[-5,24],[3,28],[-2,31]]){R(cx+x,y+by,2,2,'#ffffff');R(cx+x,y+by,1,1,'#ff4080');}
  for(const s of [-1,1]){trap(cx+s*9,18+by,24+by,3,4,c2);}
  L(cx+8,40+by,cx+20,4+by,OUTC,3);L(cx+8,40+by,cx+20,4+by,ST,1);arm([[18,20],[15,30],[20,36]],c,c,SK,3);arm([[34,20],[38,30],[cx+10,36]],c,c,SK,3);
  face(cx,12+by,SK,{eye:OUTC,brow:HR,mouth:false});E(cx,8+by,6,3,OUTC);E(cx,8+by,5,2,'#2a2a34');L(cx-2,6+by,cx-8,-2+by,'#e0b040',2);L(cx+2,6+by,cx+8,-2+by,'#e0b040',2);R(cx-1,5+by,3,2,'#ff4080');}}
r7Spr=function(d){if(R7SPR[d.id])return R7SPR[d.id];const FW=52,FH=60,N=2,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const fr=mk(FW,FH,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
   const E=(cx2,cy2,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y/ry)**2)));R(cx2-w,cy2+y,w*2+1,1,c);}};
   const L=(x0,y0,x1,y1,c,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,t||1,t||1,c);};
   r7Draw({R,E,L},d,f);});sg.drawImage(outlined(fr),f*FW,0);}
 return R7SPR[d.id]={c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:d.type==='brute'?.78:.66,ok:true,animal:true};};
