'use strict';
// SHINOBIDUNGEONS - PROLOGUES II and III. The road from the burning village to the bamboo, three short stages before
// stage I, each a little harder than the last and each guardian teaching one thing:
//  I    THE BURNING VILLAGE   Goro, the bandit captain      big telegraphed swings and charges, slow fans
//  II   THE FLOODED FIELDS    Zenigata, the tax collector   bullet patterns: rings of coins, spirals, bursting bags,
//                                                           and bandit guards he pays to fight for him
//  III  THE HILL WATCHTOWER   Kageyama, the tower captain   aimed shots: volleys at you, sniper arrows on a warning
//                                                           line, an arrow rain; dash through them
// The campfire after each leads on to the next, and after III to stage I. Only Kageyama makes you grow, so you reach
// stage I one form up, as before. Like the first, II and III are gentler than the stages (fewer, weaker foes), and a
// fall in them sends you back to the start of that prologue with everything you carry.
const PRO2={n:2,dress:1,col:'#e0c050',
 dun:{name:'THE FLOODED FIELDS',fl:['#3a4a2a','#42523a'],sp:'#2a3a1e',wt:'#0a120a',wf:'#4a5a34',we:'#c0b050',cloth:'#5a5a2a',dark:'#2a321a',acc:'#e0c050',
  pool:['bandit','bandit','frog','toad','archer','crab'],story:'THE TAX COLLECTOR COUNTS THE STOLEN RICE IN THE FLOODED FIELDS',
  tale:'THE EMPEROR\'S TAX TOOK THE VILLAGE\'S RICE. ZENIGATA, HIS COLLECTOR, GUARDS THE STOLEN HARVEST IN THE FLOODED PADDIES WITH BANDITS HE PAYS IN SILVER.'},
 boss:{name:'ZENIGATA, THE TAX COLLECTOR',hp:380,hat:'kasa',pal:null,pref:40,spd:30,r:9},
 style:{c:'#e0c050',t:['COUNTING COINS','PAID GUARDS','THE LEDGER BURNS'],ph:[
  [{pat:'gapring',cnt:12,gw:1.1,sp:42,col:'#e0c050'},{pat:'flower',cnt:10,sp:40,col:'#e0c050'}],
  [{pat:'spiral',arms:3,spin:.26,sp:44,col:'#e0c050',burst:8,gap:.12},{pat:'gapring',cnt:14,gw:1,sp:44,col:'#fff0a0'},{pat:'mines',cnt:3,col:'#e0c050',st:'mine',fuse:1.5}],
  [{pat:'spiral',arms:4,spin:.28,sp:46,col:'#e0c050',burst:10,gap:.11},{pat:'flower',cnt:14,sp:46,col:'#fff0a0'},{pat:'mines',cnt:4,col:'#e0c050',st:'mine',fuse:1.4}]]},
 modes:['chase','chase','dashes'],
 motif:[0,4,2,4,7,null,4,2,0,2,4,null,2,0,-1,null],
 master:'THE RICE GOES HOME. ZENIGATA\'S LEDGER NAMES THE WATCHTOWER ON THE HILL ROAD - THE EMPEROR\'S EYES, SIGNALLING THE WARBANDS. IT MUST FALL BEFORE WE CAN PASS.'};
PRO2.boss.pal=basePal('#2a2430','#5a5a64','#e0c050','#18141c');
PRO2.boss.k1=[SH({w:.7,cnt:5,spread:.9,sp:48,dmg:9,col:'#e0c050',wt:3}),SL({hits:1,w:1,dmg:9,wt:1,range:28})];
PRO2.boss.k2=[SH({w:.65,cnt:7,spread:1.1,sp:50,dmg:9,col:'#e0c050',wt:3}),SU({cnt:2,types:['bandit'],wt:1}),SL({hits:2,w:.9,w2:.4,dmg:10,wt:1,range:28})];
const PRO3={n:3,dress:5,col:'#c06040',
 dun:{name:'THE HILL WATCHTOWER',fl:['#4a3a2a','#524232'],sp:'#3a2a1a',wt:'#120c08',wf:'#5a4430',we:'#c06040',cloth:'#6a3a2a',dark:'#3a2418',acc:'#c06040',
  pool:['ashigaru','ashigaru','archer','archer','bandit','shielder'],story:'THE EMPEROR\'S WATCHTOWER GUARDS THE ROAD TO THE BAMBOO',
  tale:'A WOODEN WATCHTOWER ON THE HILL ROAD SIGNALS THE WARBANDS WHENEVER TROUBLE COMES. ITS CAPTAIN, KAGEYAMA, IS SAID NEVER TO MISS.'},
 boss:{name:'KAGEYAMA, THE TOWER CAPTAIN',hp:460,hat:'kasa',pal:null,pref:90,spd:34,r:9},
 style:{c:'#c06040',t:['AIMED VOLLEYS','THE SNIPER\'S LINE','ARROW RAIN'],ph:[
  [{pat:'aimedring',cnt:10,sp:50,col:'#c06040'},{pat:'stream',cnt:5,sp:80,col:'#e8d0a0',burst:2,gap:.3}],
  [{pat:'sniper',sp:70,col:'#e8d0a0'},{pat:'aimedring',cnt:12,sp:52,col:'#c06040'},{pat:'stream',cnt:6,sp:84,col:'#e8d0a0',burst:2,gap:.28}],
  [{pat:'sniper',sp:74,col:'#e8d0a0'},{pat:'aimedring',cnt:14,sp:54,col:'#c06040'},{pat:'rain',cnt:4,rad:18,col:'#c06040',dmg:9,sp:0}]]},
 modes:['circle','circle','dashes'],
 motif:[0,2,3,5,7,null,5,3,2,0,-2,null,0,2,0,null],
 master:'THE TOWER IS DOWN AND THE ROAD IS OPEN. AHEAD, AKAGANE\'S WARBAND HAS CAMPED IN THE BAMBOO. THIS IS WHERE THE MARCH ON THE CASTLE TRULY BEGINS.'};
PRO3.boss.pal=basePal('#6a2a1e','#3a2a20','#c06040','#18100c');
PRO3.boss.k1=[SH({w:.75,cnt:3,spread:.3,sp:70,dmg:9,col:'#e8d0a0',arrow:true,wt:3}),SH({w:.85,cnt:1,sp:110,dmg:10,col:'#e8d0a0',arrow:true,reps:3,gap:.25,wt:2})];
PRO3.boss.k2=[SH({w:.7,cnt:5,spread:.5,sp:72,dmg:9,col:'#e8d0a0',arrow:true,wt:3}),SH({w:.8,cnt:1,sp:120,dmg:10,col:'#e8d0a0',arrow:true,reps:4,gap:.22,wt:2}),SU({cnt:2,types:['ashigaru'],wt:1})];
PROS.push(PRO2,PRO3);

// ---------- ZENIGATA, THE TAX COLLECTOR ----------
// A portly official in a black haori over a grey kimono, a tall black lacquered cap, a thin moustache, a big wooden
// abacus in one hand and a string of square-holed coins in the other. Second form: the cap knocked off, the ledger
// burning in his fist.
function zenDraw(p,Q){const K=HUM(p,Q),{R,E,L,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const HA='#22202a',HA2='#3a3644',KI='#6a6a74',KI2='#8a8a94',SK='#e0b890',SK2='#b88a64',GD='#e0c050',WD='#7a5030',WD2='#a87040';
 const lg=Q.legs||'stand';
 if(lg==='stand'){leg(32,52,30,62,29,73,KI,KI2,'#1a1418',6);leg(40,52,42,62,43,73,KI,KI2,'#1a1418',6);}else{leg(32,52,26,61,23,72,KI,KI2,'#1a1418',6);leg(40,52,46,61,50,73,KI,KI2,'#1a1418',6);}
 // a round belly under a grey kimono, the black haori open over it, a gold-trimmed sash
 trap(cx,27+by,53+by,12,15,HA);E(cx,40+by,10,11,OUTC);E(cx,40+by,9,10,KI);E(cx-3,37+by,4,5,KI2);R(cx-10,44+by,21,3,GD);R(cx-10,44+by,21,1,'#fff0a0');
 for(const s of [-1,1])L(cx+s*9,28+by,cx+s*12,52+by,HA2,1);R(cx-1,28+by,3,4,'#e8e8f0');
 // arms: the abacus in the far hand, the coin string in the near hand
 const far=Q.far||[[25,30],[20,40],[22,47]],near=Q.near||[[47,30],[52,39],[51,47]];
 arm(far,HA,HA,SK,5);arm(near,HA,HA,SK,5);
 {const [x,y]=far[2];R(x-8,y+by-6,16,11,OUTC);R(x-7,y+by-5,14,9,WD);R(x-7,y+by-5,14,1,WD2);for(let i=0;i<3;i++)R(x-7,y+by-3+i*3,14,1,'#3a2414');for(let c=0;c<5;c++)for(let r=0;r<3;r++)R(x-6+c*3,y+by-4+r*3,2,2,(c+r)%2?'#c8a868':'#f0d898');}
 {const [x,y]=near[2];if(two){E(x,y+by-6,4,6,'#ff8030');E(x,y+by-7,2,4,'#ffe080');R(x-3,y+by-1,6,4,'#f0e8d0');}
  else for(let i=0;i<6;i++){const cy=y+by+3+i*3;R(x-2,cy-1,5,4,OUTC);R(x-1,cy,3,2,GD);R(x,cy,1,1,OUTC);}}
 // head: a heavy face, small eyes, a thin moustache; a tall lacquered cap (knocked off in the second form)
 const hx=cx,hy=17+by;face(hx,hy,SK,{eye:OUTC,brow:'#2a2024',mouth:'#7a3a2a'});R(hx-4,hy+3,3,1,'#2a2024');R(hx+2,hy+3,3,1,'#2a2024');R(hx-5,hy+4,1,1,'#2a2024');R(hx+5,hy+4,1,1,'#2a2024');E(hx-5,hy+2,1,1,SK2);
 if(two){R(hx-6,hy-7,13,2,'#2a2024');R(hx-3,hy-9,7,2,'#2a2024');R(hx+2,hy-1,2,1,'#ff3030');}
 else{R(hx-5,hy-16,11,11,OUTC);R(hx-4,hy-15,9,10,HA);R(hx-4,hy-15,2,10,HA2);R(hx-6,hy-6,13,2,OUTC);R(hx-5,hy-6,11,1,GD);R(hx-1,hy-13,3,3,GD);}}
humBoss('ZENIGATA, THE TAX COLLECTOR',zenDraw,{idle0:{},idle1:{b:1},
 atk:{dy:-1,legs:'lunge',near:[[47,29],[55,20],[58,11]],far:[[25,30],[18,37],[16,45]]}},{sc:1.1});
// ---------- KAGEYAMA, THE TOWER CAPTAIN ----------
// A lean archer captain in dark red lamellar armour and a flat conical jingasa helmet, a full quiver on his back and
// a great yumi bow taller than he is; in the attack frame he draws it to the ear. Second form: the helmet gone, a
// bloodied headband, the last arrows in his quiver.
function kagDraw(p,Q){const K=HUM(p,Q),{R,E,L,trap,arm,leg,face,by}=K,two=ARTHURT,cx=36;
 const AR='#7a2a1e',AR2='#a03a28',LC='#d8c090',PN='#2a2a30',PN2='#3a3a44',SK='#d8a878',BW='#8a5a2a',BW2='#c08a4a',ST='#e8d0a0';
 const lg=Q.legs||'stand';
 if(lg==='stand'){leg(32,50,29,61,27,73,PN,PN2,'#14100c',5);leg(40,50,43,61,45,73,PN,PN2,'#14100c',5);}else{leg(32,50,25,60,21,72,PN,PN2,'#14100c',5);leg(40,50,45,60,49,73,PN,PN2,'#14100c',5);}
 // the quiver on his back, arrows standing out over the shoulder
 R(39,14+by,6,22,OUTC);R(40,15+by,4,20,'#5a3a1e');for(let i=0;i<(two?2:4);i++){R(40+i,9+by-i,1,7,'#d8c8a8');R(39+i,8+by-i,3,2,'#e8e8f0');}
 // lamellar armour: rows of laced plates over a dark under-robe, shoulder guards
 trap(cx,26+by,50+by,9,11,AR);for(let y=28;y<49;y+=3){R(cx-9,y+by,19,1,AR2);for(let x=-8;x<9;x+=3)R(cx+x,y+1+by,1,1,LC);}
 for(const s of [-1,1]){R(cx+s*10-3,26+by,7,6,OUTC);R(cx+s*10-2,27+by,5,4,AR2);R(cx+s*10-2,30+by,5,1,LC);}
 // arms and the great bow: held upright, or drawn to the ear when he looses
 const draw=!!Q.drawn,far=Q.far||[[26,30],[20,38],[19,46]],near=Q.near||[[46,30],[50,39],[48,46]];
 arm(far,AR,PN,SK,4);arm(near,AR,PN,SK,4);
 {const [x,y]=far[2],top=y+by-30,bot=y+by+24;L(x,top,x-3,y+by,OUTC,4);L(x-3,y+by,x,bot,OUTC,4);L(x,top,x-3,y+by,BW,2);L(x-3,y+by,x,bot,BW,2);R(x-1,top,1,4,BW2);
  const sx=draw?near[2][0]:x+1,sy=draw?near[2][1]+by:y+by;L(x,top,sx,sy,ST,1);L(sx,sy,x,bot,ST,1);
  if(draw){L(x-8,y+by-1,sx,sy,'#d8c8a8',1);R(x-10,y+by-2,3,3,'#e8e8f0');}}
 // head: a stern face; the flat jingasa helmet (a headband in the second form)
 const hx=cx,hy=17+by;face(hx,hy,SK,{eye:OUTC,brow:'#2a1a14',mouth:'#6a2a1a'});R(hx-3,hy+3,7,2,'#3a2a20');
 if(two){R(hx-6,hy-5,13,2,'#c03020');L(hx-6,hy-4,hx-11,hy+1,'#c03020',1);E(hx,hy-6,6,3,'#1a1410');R(hx+2,hy+1,1,3,'#a02020');}
 else{for(let i=0;i<7;i++)R(hx-3-i*2,hy-7+i,7+i*4,1,i===0?OUTC:i%2?'#3a3a40':'#4a4a52');R(hx-16,hy,33,1,OUTC);R(hx-1,hy-9,3,2,'#c0a050');R(hx-1,hy-6,3,1,'#c0a050');}}
humBoss('KAGEYAMA, THE TOWER CAPTAIN',kagDraw,{idle0:{},idle1:{b:1},
 atk:{dy:0,legs:'lunge',drawn:1,far:[[26,30],[16,32],[10,33]],near:[[46,30],[38,30],[42,27]]}},{sc:1.1});
