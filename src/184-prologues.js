'use strict';
// SHINOBIDUNGEONS - PROLOGUES II and III. The road from the burning village to the bamboo, three short stages before
// stage I, each a little harder than the last and each guardian teaching one thing:
//  I    THE BURNING VILLAGE   Goro, the bandit captain      big telegraphed swings and charges, slow fans
//  II   THE FLOODED FIELDS    Kurobe, the river pirate      bullet patterns: water rings off his oar, spray spirals,
//                                                           floating jars that burst, and his river rats
//  III  THE HILL WATCHTOWER   Kageyama, the tower captain   aimed shots: volleys at you, sniper arrows on a warning
//                                                           line, an arrow rain; dash through them
// The campfire after each leads on to the next, and after III to stage I. Only Kageyama makes you grow, so you reach
// stage I one form up, as before. Like the first, II and III are gentler than the stages (fewer, weaker foes), and a
// fall in them sends you back to the start of that prologue with everything you carry.
const PRO2={n:2,dress:1,col:'#60b0e0',
 dun:{name:'THE FLOODED FIELDS',fl:['#3a4a2a','#42523a'],sp:'#2a3a1e',wt:'#0a120a',wf:'#4a5a34',we:'#60b0e0',cloth:'#2a4a6a',dark:'#2a321a',acc:'#60b0e0',
  pool:['bandit','bandit','frog','toad','archer','crab'],story:'RIVER PIRATES HAUL THE STOLEN RICE THROUGH THE FLOODED FIELDS',
  tale:'THE VILLAGE\'S RICE WENT DOWNRIVER ON A PIRATE BARGE. KUROBE AND HIS RIVER RATS RUN THE FLOODED PADDIES FOR THE EMPEROR\'S TAX MEN, AND KEEP A SHARE FOR THEMSELVES.'},
 boss:{name:'KUROBE, THE RIVER PIRATE',hp:380,hat:'kasa',pal:null,pref:40,spd:32,r:10},
 style:{c:'#60b0e0',t:['THE OAR','RIVER RATS','FIRE ON THE WATER'],ph:[
  [{pat:'gapring',cnt:12,gw:1.1,sp:42,col:'#80d0f8'},{pat:'flower',cnt:10,sp:40,col:'#60b0e0'}],
  [{pat:'spiral',arms:3,spin:.26,sp:44,col:'#80d0f8',burst:8,gap:.12},{pat:'gapring',cnt:14,gw:1,sp:44,col:'#c8f0ff'},{pat:'mines',cnt:3,col:'#c08850',st:'mine',fuse:1.5}],
  [{pat:'spiral',arms:4,spin:.28,sp:46,col:'#80d0f8',burst:10,gap:.11},{pat:'flower',cnt:14,sp:46,col:'#c8f0ff'},{pat:'mines',cnt:4,col:'#ff8040',st:'mine',fuse:1.4}]]},
 modes:['chase','chase','dashes'],
 motif:[0,4,2,4,7,null,4,2,0,2,4,null,2,0,-1,null],
 master:'THE RICE GOES HOME ON KUROBE\'S OWN BARGE. HIS CHARTS MARK THE WATCHTOWER ON THE HILL ROAD - THE EMPEROR\'S EYES, SIGNALLING THE WARBANDS. IT MUST FALL BEFORE WE CAN PASS.'};
PRO2.boss.pal=basePal('#2a4a6a','#4a3a2a','#60b0e0','#18120e');
PRO2.boss.k1=[SL({hits:1,w:1,dmg:10,wt:3,range:36,arc:150}),SH({w:.7,cnt:5,spread:.9,sp:48,dmg:9,col:'#80d0f8',wt:2})];
PRO2.boss.k2=[SL({hits:2,w:.9,w2:.4,dmg:11,wt:3,range:36,arc:160}),SH({w:.65,cnt:7,spread:1.1,sp:50,dmg:9,col:'#80d0f8',wt:2}),SU({cnt:2,types:['bandit'],wt:1})];
const PRO3={n:3,dress:5,col:'#4ab0a0',
 dun:{name:'THE HILL WATCHTOWER',fl:['#4a3a2a','#524232'],sp:'#3a2a1a',wt:'#120c08',wf:'#5a4430',we:'#4ab0a0',cloth:'#1e4a4a',dark:'#3a2418',acc:'#4ab0a0',
  pool:['ashigaru','ashigaru','archer','archer','bandit','shielder'],story:'THE EMPEROR\'S WATCHTOWER GUARDS THE ROAD TO THE BAMBOO',
  tale:'A WOODEN WATCHTOWER ON THE HILL ROAD SIGNALS THE WARBANDS WHENEVER TROUBLE COMES. ITS CAPTAIN, KAGEYAMA, IS SAID NEVER TO MISS.'},
 boss:{name:'KAGEYAMA, THE TOWER CAPTAIN',hp:460,hat:'kasa',pal:null,pref:90,spd:34,r:9},
 style:{c:'#4ab0a0',t:['AIMED VOLLEYS','THE SNIPER\'S LINE','ARROW RAIN'],ph:[
  [{pat:'aimedring',cnt:10,sp:50,col:'#4ab0a0'},{pat:'stream',cnt:5,sp:80,col:'#e8d0a0',burst:2,gap:.3}],
  [{pat:'sniper',sp:70,col:'#e8d0a0'},{pat:'aimedring',cnt:12,sp:52,col:'#4ab0a0'},{pat:'stream',cnt:6,sp:84,col:'#e8d0a0',burst:2,gap:.28}],
  [{pat:'sniper',sp:74,col:'#e8d0a0'},{pat:'aimedring',cnt:14,sp:54,col:'#4ab0a0'},{pat:'rain',cnt:4,rad:18,col:'#4ab0a0',dmg:9,sp:0}]]},
 modes:['circle','circle','dashes'],
 motif:[0,2,3,5,7,null,5,3,2,0,-2,null,0,2,0,null],
 master:'THE TOWER IS DOWN AND THE ROAD IS OPEN. AHEAD, AKAGANE\'S WARBAND HAS CAMPED IN THE BAMBOO. THIS IS WHERE THE MARCH ON THE CASTLE TRULY BEGINS.'};
PRO3.boss.pal=basePal('#1e4a4a','#1a1a22','#4ab0a0','#16120e');
PRO3.boss.k1=[SH({w:.75,cnt:3,spread:.3,sp:70,dmg:9,col:'#e8d0a0',arrow:true,wt:3}),SH({w:.85,cnt:1,sp:110,dmg:10,col:'#e8d0a0',arrow:true,reps:3,gap:.25,wt:2})];
PRO3.boss.k2=[SH({w:.7,cnt:5,spread:.5,sp:72,dmg:9,col:'#e8d0a0',arrow:true,wt:3}),SH({w:.8,cnt:1,sp:120,dmg:10,col:'#e8d0a0',arrow:true,reps:4,gap:.22,wt:2}),SU({cnt:2,types:['ashigaru'],wt:1})];
PROS.push(PRO2,PRO3);

// ======================= the guardians =======================
// (Goro's first drawing lives in 157-prologue.js; this one replaces it)
// ---------- GORO, THE BANDIT CAPTAIN (refined) ----------
// Broad, scarred and loud: a stitched leather vest with a fur collar over a bare, scarred chest, wrapped forearms,
// baggy trousers with straw-bound shins and sandals, a red sash and a sake gourd on a rope belt, a notched machete with
// a cloth-wrapped hilt. Red headband with long tails, an eyepatch, a stubbled jaw, a topknot. Second form: the
// headband gone, his hair loose and wild, a fresh cut across the eye, the vest torn.
function gorDraw2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const VS='#6a4428',VS2='#8a5c34',FUR='#b8a080',PN='#4a3c2c',PN2='#5c4c38',SH='#b03020',SK='#d89a68',SK2='#a86e44',SKL='#f0c090',HB='#c82020',HR='#1a120e',ST='#b0b0bc',ST2='#ececf4',STR='#c8a868';
 const lg=Q.legs||'stand';
 // legs: baggy trousers flaring at the knee, straw wraps on the shins, straw sandals
 const legW=(hx,hy,kx,ky,fx,fy)=>{seg(hx,hy+by,kx,ky,8,PN);seg(kx,ky,fx,fy-2,6,PN2);L(kx-2,ky-6,kx+1,ky+2,dk(PN),1);for(let y=ky+3;y<fy-3;y+=2){const t=(y-ky)/(fy-ky);R(Math.round(kx+(fx-kx)*t)-3,y,7,1,y%4?STR:'#a8885a');}R(fx-5,fy-1,10,2,OUTC);R(fx-4,fy-1,9,1,STR);};
 if(lg==='stand'){legW(31,50,27,61,25,73);legW(41,50,46,61,48,73);}else{legW(31,50,22,59,17,71);legW(41,50,50,60,55,73);}
 // torso: a broad bare chest, pecs and belly shaded, a long scar
 trap(cx,25+by,48+by,12,10,SK);E(cx-4,30+by,4,3,SKL);E(cx+4,30+by,4,3,lt(SK));L(cx-8,33+by,cx,34+by,SK2,1);L(cx,34+by,cx+8,33+by,SK2,1);L(cx,35+by,cx,45+by,SK2,1);
 for(const y of [38,42])L(cx-3,y+by,cx+3,y+by,SK2,1);L(cx-7,28+by,cx+5,42+by,'#c87060',1);
 // the vest: open, stitched edges, a fur collar; torn in the second form
 for(const s of [-1,1]){const x0=cx+s*7;trap(x0+s*2,25+by,47+by,4,5,VS);for(let y=27;y<46;y+=3)R(x0+s*(1),y+by,1,1,VS2);}
 if(two){R(cx+9,36+by,4,6,SK);L(cx+9,36+by,cx+12,41+by,OUTC,1);}
 E(cx-8,25+by,5,3,FUR);E(cx+8,25+by,5,3,FUR);for(let i=-11;i<=11;i+=2)R(cx+i,24+by+(Math.abs(i)%3),1,2,'#e0d0b0');
 // sash and rope belt with the sake gourd
 R(cx-12,45+by,25,5,OUTC);R(cx-11,46+by,23,3,SH);R(cx-11,46+by,23,1,'#e04838');R(cx+6,49+by,4,8,OUTC);R(cx+7,49+by,2,7,SH);R(cx+9,50+by,2,5,'#801a10');
 L(cx-12,49+by,cx+12,49+by,STR,1);E(cx-9,53+by,3,4,OUTC);E(cx-9,53+by,2,3,'#c89048');R(cx-9,48+by,1,2,'#6a4428');
 // arms: thick, muscled, wrapped forearms, leather bracers
 const far=Q.far||[[25,29],[19,38],[21,47]],near=Q.near||[[47,29],[53,37],[53,46]];
 arm(far,SK,SK,SK2,6);arm(near,SK,SK,SK2,6);
 for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;R(a-2,b+by-2,3,2,lt(SK));for(const t of [.45,.65]){R(Math.round(c+(e-c)*t)-3,Math.round(d+(f-d)*t)+by-1,6,2,t<.5?'#e8e0d0':'#5a3a22');}}
 // the machete: broad, notched, a cloth-wrapped hilt with a trailing tail
 {const [x,y]=near[2],a=Q.ba!=null?Q.ba:-1.05,len=Q.bl||27,ca=Math.cos(a),sa=Math.sin(a);
  L(x-ca*7,y+by-sa*7,x,y+by,OUTC,5);L(x-ca*7,y+by-sa*7,x,y+by,'#e8e0d0',3);for(let k=1;k<6;k+=2)R(Math.round(x-ca*k),Math.round(y+by-sa*k),1,1,'#a89880');L(x-ca*7,y+by-sa*7,x-ca*10+3,y+by-sa*10+4,'#e8e0d0',1);
  L(x,y+by,x+ca*len,y+by+sa*len,OUTC,8);L(x,y+by,x+ca*len,y+by+sa*len,ST,6);L(x-sa*2,y+by+ca*2,x+ca*len-sa*2,y+by+sa*len+ca*2,dk(ST),1);L(x+sa*2,y+by-ca*2,x+ca*(len-2)+sa*2,y+by+sa*(len-2)-ca*2,ST2,1);
  for(const k of [.4,.62,.8])R(Math.round(x+ca*len*k+sa*3),Math.round(y+by+sa*len*k-ca*3),2,2,OUTC);R(x-2,y+by-2,5,5,'#3a2414');}
 // head: a heavy jaw with stubble, an eyepatch; topknot and headband with flowing tails (wild hair in the second form)
 const hx=cx,hy=16+by;
 if(two){for(let i=-8;i<=8;i+=2)L(hx+i,hy-7,hx+i*1.4,hy+4+Math.abs(i)%4,HR,2);}
 face(hx,hy,SK,{eye:OUTC,brow:HR,mouth:'#6a2a1a'});R(hx-5,hy+3,11,4,'#4a3428');for(let x=-4;x<6;x+=2)R(hx+x,hy+4,1,1,'#2a1a14');R(hx-1,hy+4,3,1,'#7a2a1a');
 R(hx+1,hy-2,5,3,OUTC);R(hx+2,hy-1,3,1,'#2a2420');L(hx-6,hy-3,hx+6,hy-2,OUTC,1);
 if(two){R(hx-3,hy-1,2,1,'#ff3030');L(hx-6,hy-5,hx-1,hy+3,'#c03020',1);E(hx,hy-7,7,3,HR);}
 else{E(hx,hy-7,6,3,HR);R(hx-1,hy-13,3,6,HR);E(hx,hy-14,3,2,HR);R(hx,hy-14,1,1,'#4a3a30');
  R(hx-7,hy-5,15,3,OUTC);R(hx-6,hy-5,13,2,HB);R(hx-6,hy-5,13,1,'#f05050');const fl=Math.sin((p.f||0)*1.7+1)*2;L(hx-7,hy-4,hx-14,hy-1+fl,OUTC,3);L(hx-7,hy-4,hx-14,hy-1+fl,HB,1);L(hx-7,hy-3,hx-12,hy+4+fl,OUTC,3);L(hx-7,hy-3,hx-12,hy+4+fl,HB,1);}}
humBoss('GORO, THE BANDIT CAPTAIN',gorDraw2,{idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[47,28],[55,20],[57,10]],ba:-2.3,bl:29,far:[[25,29],[17,36],[13,44]]}},{sc:1.1});

// ---------- KAGEYAMA, THE TOWER CAPTAIN ----------
// The watchtower's archer captain, nothing like the red-armoured warlords: lean, in archery dress - a white kimono with
// the drawing arm slipped out of its sleeve, a dark teal jacket over it, wide black hakama flaring to the ankles - a
// straw jingasa with a white band, a tall signal flag on his back bearing the white tower crest, a conch horn at his
// belt to signal the warbands, a quiver of white-fletched arrows at his hip, and a great yumi bound in rattan and
// gripped below its middle. Second form: the hat gone, his long hair loose in a tail, the signal flag torn.
function kagDraw2(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const TL='#1e4a4a',TL2='#2e6a66',WH='#ece8de',WH2='#c8c2b4',HK='#1a1a22',HK2='#2e2e3a',SK='#d8a878',SK2='#a87850',ST2='#c8a868',BW='#7a4a20',BW2='#c08a4a',RT='#2a1a10',STR='#ece0c0',FL='#e8e4d8',HR='#16120e';
 const lg=Q.legs||'stand';
 // the signal flag on its pole behind him: a tall white banner with the tower crest (torn in the second form)
 {const px=44,top=-2+by;R(px-1,top,3,40,OUTC);R(px,top+1,1,38,'#6a4a2a');const fh=two?12:20;R(px+1,top+2,12,fh+2,OUTC);R(px+2,top+3,10,fh,FL);R(px+2,top+3,10,2,TL2);
  if(two){for(let x=0;x<10;x+=3)R(px+2+x,top+3+fh,2,2+(x%2),FL);}else{R(px+5,top+8,4,9,TL);R(px+4,top+8,6,2,TL);R(px+6,top+6,2,2,TL);R(px+4,top+16,6,1,TL);}}
 // wide black hakama flaring to the ankles
 const lgHk=(hx,hy,kx,ky,fx,fy)=>{seg(hx,hy+by,kx,ky,8,HK);seg(kx,ky,fx,fy-3,9,HK);L(kx,ky,fx-2,fy-4,HK2,1);R(fx-6,fy-3,12,2,OUTC);R(fx-5,fy-3,10,1,HK2);R(fx-3,fy-1,6,2,OUTC);R(fx-2,fy-1,5,1,ST2);};
 if(lg==='stand'){const s=Q.stride||0;lgHk(32,49,29-s*2,60-(s>0?1:0),27-s*4,73-(s>0?2:0));lgHk(40,49,43+s*2,60-(s<0?1:0),45+s*4,73-(s<0?2:0));}else{lgHk(32,49,25,59,20,72);lgHk(40,49,47,59,51,73);}
 // the quiver at the hip, white fletchings up
 R(cx-15,38+by,6,16,OUTC);R(cx-14,39+by,4,14,'#5a3a1e');R(cx-14,39+by,4,2,'#8a5a2a');for(let i=0;i<(two?1:3);i++){R(cx-14+i,34+by-(i%2),1,5,'#d8c8a8');R(cx-15+i,32+by-(i%2),3,3,'#f4f4f8');}
 // torso: a white kimono, the drawing arm bare out of its sleeve, a dark teal jacket over it, a black sash
 trap(cx,25+by,47+by,8,9,WH);L(cx-3,25+by,cx+2,35+by,WH2,1);L(cx+3,25+by,cx-1,33+by,WH2,1);
 trap(cx-6,25+by,47+by,3,4,TL);R(cx-9,25+by,2,22,TL2);R(cx+5,26+by,4,20,TL);R(cx+8,26+by,1,20,TL2);
 R(cx-9,43+by,19,4,OUTC);R(cx-8,44+by,17,2,HK);R(cx-8,44+by,17,1,HK2);
 // the conch horn hanging at his belt
 E(cx+7,50+by,4,3,OUTC);E(cx+7,50+by,3,2,'#f0e0d0');R(cx+5,49+by,2,1,'#c89878');R(cx+10,50+by,2,1,'#d8a888');L(cx+4,45+by,cx+6,48+by,'#8a5a2a',1);
 // arms: the bow arm in its teal sleeve; the drawing arm bare, with an archery glove
 const draw=!!Q.drawn,far=Q.far||[[27,29],[21,38],[19,46]],near=Q.near||[[45,29],[50,38],[49,46]];
 arm(far,TL,TL,SK,4);arm(near,SK,SK,'#6a4a2a',4);{const [[a,b]]=near;R(a-2,b+by-1,4,3,lt(SK));}
 {const [x,y]=far[2],top=y+by-34,bot=y+by+20;L(x,top,x-4,y+by-6,OUTC,4);L(x-4,y+by-6,x,bot,OUTC,4);L(x,top,x-4,y+by-6,BW,2);L(x-4,y+by-6,x,bot,BW,2);
  for(const k of [.15,.32,.75,.9]){const yy=Math.round(top+(bot-top)*k);R(x-4+Math.round(Math.abs(.62-k)*3),yy,3,1,RT);}R(x-1,top,1,5,BW2);R(x-2,y+by-1,4,4,RT);
  const sx2=draw?near[2][0]:x+1,sy2=draw?near[2][1]+by:y+by;L(x,top,sx2,sy2,STR,1);L(sx2,sy2,x,bot,STR,1);
  if(draw){L(x-10,y+by-1,sx2,sy2,'#d8c8a8',1);R(x-12,y+by-2,3,3,'#f4f4f8');R(sx2-1,sy2-1,3,2,'#f4f4f8');}}
 // head: a calm, narrow face, a thin moustache; a straw jingasa with a white band (long loose hair in the second form)
 const hx=cx,hy=17+by;face(hx,hy,SK,{eye:OUTC,brow:HR,mouth:'#7a3a2a'});R(hx-3,hy+3,2,1,HR);R(hx+2,hy+3,2,1,HR);
 if(two){E(hx,hy-6,6,3,HR);L(hx-5,hy-4,hx-9,hy+12,HR,3);L(hx-4,hy-4,hx-7,hy+14,HR,2);R(hx+2,hy-1,2,1,'#ff3030');L(hx+3,hy-4,hx+5,hy+2,'#a02020',1);}
 else{E(hx,hy-6,6,3,HR);for(let i=0;i<7;i++){const w=4+i*4;R(hx-Math.round(w/2),hy-12+i,w,1,i===0?OUTC:i%2?'#c8a860':'#e0c478');}R(hx-15,hy-5,31,2,OUTC);R(hx-14,hy-5,29,1,'#b89850');R(hx-8,hy-8,17,1,WH);for(let i=-12;i<=12;i+=4)R(hx+i,hy-6,1,1,'#9a7a40');}}
humBoss('KAGEYAMA, THE TOWER CAPTAIN',kagDraw2,{idle0:{},idle1:{b:1},
 atk:{dy:0,legs:'lunge',drawn:1,far:[[25,30],[15,32],[9,33]],near:[[47,30],[39,29],[43,26]]}},{sc:1.1});

// ---------- KUROBE, THE RIVER PIRATE (Prologue II) ----------
// A burly river pirate: a sea-blue headscarf knotted at the side, a bushy black beard, a short indigo happi coat with a
// white wave pattern at the hem worn open over a broad chest, tattooed forearms (blue waves), a rope coiled over one
// shoulder, clay jars on his belt, short trousers and bound shins. He fights with a long boat oar. Second form: the
// headscarf gone, his hair wild and wet, a red eye, the oar swapped for a lit fire-jar in his free hand.
function kurDraw(p,Q){const K=HUM(p,Q),{R,E,L,seg,trap,arm,leg,face,lt,dk,by}=K,two=ARTHURT,cx=36;
 const IN='#24406a',IN2='#33598c',WV='#e8f0f8',SK='#c88a5a',SK2='#9a6440',SKL='#e0a878',TT='#2a5a9a',HS='#3a8ac8',HS2='#5aaee8',BE='#16100c',PN='#5a4a3a',PN2='#6e5c48',RP='#c8a868',CL='#a86a3a',WD='#8a5a2a',WD2='#b8844a';
 const lg=Q.legs||'stand';
 // legs: short trousers, bare bound shins, straw sandals
 const legP=(hx,hy,kx,ky,fx,fy)=>{seg(hx,hy+by,kx,ky,8,PN);seg(kx,ky,fx,fy-2,5,SK);for(let y=ky+2;y<fy-3;y+=2){const t=(y-ky)/(fy-ky);R(Math.round(kx+(fx-kx)*t)-3,y,6,1,'#e8e0d0');}R(fx-5,fy-1,10,2,OUTC);R(fx-4,fy-1,9,1,RP);};
 if(lg==='stand'){legP(31,50,28,61,26,73);legP(41,50,45,61,47,73);}else{legP(31,50,23,59,18,71);legP(41,50,49,60,54,73);}
 // the oar behind him (first form): a long shaft with a broad blade, held across the body
 const far=Q.far||[[24,29],[18,38],[20,47]],near=Q.near||[[48,29],[54,38],[53,46]];
 if(!two){const [x,y]=near[2],a=Q.oa!=null?Q.oa:-1.25,ca=Math.cos(a),sa=Math.sin(a),l1=34,l0=16;
  L(x-ca*l0,y+by-sa*l0,x+ca*l1,y+by+sa*l1,OUTC,4);L(x-ca*l0,y+by-sa*l0,x+ca*l1,y+by+sa*l1,WD,2);
  const bx=x+ca*l1,byy=y+by+sa*l1;for(let k=0;k<12;k++){const px=bx+ca*k,py=byy+sa*k;E(Math.round(px),Math.round(py),3,2,OUTC);}for(let k=0;k<12;k++){const px=bx+ca*k,py=byy+sa*k;E(Math.round(px),Math.round(py),2,1,k<3?WD2:WD);}}
 // torso: a broad chest under the open happi coat, a wave pattern at the hem
 trap(cx,25+by,48+by,12,11,SK);E(cx-4,30+by,4,3,SKL);E(cx+4,30+by,4,3,lt(SK));L(cx-7,33+by,cx+7,33+by,SK2,1);L(cx,34+by,cx,45+by,SK2,1);for(let y=27;y<34;y+=2)R(cx-1+(y%3),y+by,1,1,'#3a2a20');
 for(const s of [-1,1]){const x0=cx+s*8;trap(x0+s*2,25+by,48+by,4,6,IN);R(x0+s*2-1,25+by,2,23,IN2);}
 for(let x=-14;x<=14;x+=4){E(cx+x,47+by,2,1,WV);R(cx+x-1,46+by,1,1,IN);}
 // the rope over the shoulder, the belt with clay jars
 for(let i=0;i<12;i++){const t=i/11;R(Math.round(cx-10+t*20)-1,Math.round(24+t*20)+by,3,2,i%2?RP:'#a8884a');}
 R(cx-12,46+by,25,3,OUTC);R(cx-11,46+by,23,2,'#5a3a22');
 for(const [x,c] of [[cx-9,CL],[cx+8,two?'#ff8040':CL]]){E(x,52+by,3,4,OUTC);E(x,52+by,2,3,c);R(x-1,47+by,3,2,'#e8e0d0');}
 // arms: thick, with blue wave tattoos on the forearms
 arm(far,SK,SK,SK2,6);arm(near,SK,SK,SK2,6);
 for(const A of [far,near]){const [[a,b],[c,d],[e,f]]=A;R(a-2,b+by-2,3,2,lt(SK));for(const t of [.3,.55,.8]){const x=Math.round(c+(e-c)*t),y=Math.round(d+(f-d)*t)+by;R(x-2,y,2,1,TT);R(x,y+1,2,1,TT);}}
 // second form: a lit fire-jar held up in the free hand
 if(two){const [x,y]=near[2];E(x,y+by-2,4,4,OUTC);E(x,y+by-2,3,3,CL);R(x-1,y+by-7,3,3,'#e8e0d0');E(x,y+by-10,3,4,'#ff7030');E(x,y+by-11,1,2,'#ffe080');}
 // head: a broad face, a bushy beard, a knotted sea-blue headscarf (wild wet hair in the second form)
 const hx=cx,hy=16+by;
 if(two){for(let i=-8;i<=8;i+=2)L(hx+i,hy-7,hx+i*1.3,hy+3+Math.abs(i)%3,BE,2);}
 face(hx,hy,SK,{eye:OUTC,brow:BE,mouth:false});
 E(hx,hy+5,7,5,OUTC);E(hx,hy+5,6,4,BE);for(let x=-5;x<6;x+=2)R(hx+x,hy+8,1,1,'#3a2a20');R(hx-2,hy+3,5,1,'#7a3a2a');R(hx-6,hy+1,3,2,BE);R(hx+4,hy+1,3,2,BE);
 if(two){R(hx-3,hy-1,2,1,'#ff3030');E(hx,hy-7,7,3,BE);}
 else{E(hx,hy-6,8,4,OUTC);E(hx,hy-6,7,3,HS);R(hx-6,hy-8,6,2,HS2);for(let x=-5;x<6;x+=3)R(hx+x,hy-5,1,1,'#e8f0f8');R(hx+6,hy-5,4,3,OUTC);R(hx+7,hy-4,2,1,HS);L(hx+8,hy-3,hx+12,hy+2,HS,1);L(hx+8,hy-3,hx+10,hy+4,HS2,1);}}
humBoss('KUROBE, THE RIVER PIRATE',kurDraw,{idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[48,28],[56,22],[60,14]],oa:-2.6,far:[[24,29],[16,35],[13,43]]}},{sc:1.1});
