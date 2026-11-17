'use strict';
// SHINOBIDUNGEONS - five new foes from folklore, each with a four-frame sprite, its own attacks and its own projectile.
//  KAPPA       river imp with a water dish on its head and a shell on its back (II marsh, V pass)      bouncing bubbles + a grab
//  TENGU       long-nosed crow warrior with black wings and a feather fan (IX keep, X gardens)        fans of feathers + a swoop
//  KASA-OBAKE  a one-eyed paper umbrella hopping on one geta (VI ramparts, VIII cellars)               spinning rings of jewels
//  GAIKOTSU    a skeleton soldier in a rusted helmet (VIII cellars, XII throne)                        thrown bones + a slash
//  YAMABUSHI   a mountain hermit-monk with a ringed staff and conch (V pass, VII temple)               talisman walls + a slam

// a 4-frame sheet, facing right: f 0 stand, 1 step, 2 stand, 3 other step
function defMob(k,w,h,fn){const N=4,sheet=mk((w+2)*N,h+2,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R,f,f===1?1:f===3?-1:0);});sg.drawImage(outlined(fr),f*(w+2),0);}
 ANIM[k]={c:sheet,wc:whiteOf(sheet),fw:w+2,fh:h+2,frames:N,sc:1,ok:true,animal:1};}

defMob('kappa',17,17,(R,f,s)=>{const b=s?1:0;
 // shell on the back
 R(1,6+b,6,8,'#6a4a2a');R(2,7+b,4,6,'#8a6a3a');R(3,8+b,2,1,'#5a3a1a');R(3,11+b,2,1,'#5a3a1a');R(1,6+b,6,1,'#a88a5a');
 // body and belly
 R(5,6+b,8,8,'#4a8a4a');R(8,8+b,5,6,'#c8d890');R(5,6+b,8,1,'#6aaa6a');
 // head: hair fringe, the water dish, eye and beak
 R(6,0+b,8,6,'#4a8a4a');R(5,1+b,10,1,'#2a4a2a');R(7,-1+b,6,2,'#a0c0d0');R(8,-1+b,4,1,'#e0f4ff');R(11,2+b,2,2,'#fff');R(12,3+b,1,1,'#14101a');R(13,4+b,4,2,'#e0b030');R(13,5+b,4,1,'#a07018');
 // arms and webbed hands
 R(12,8+b,4,2,'#4a8a4a');R(15,8+b,2,3,'#6aaa6a');R(4,9+b,2,3,'#4a8a4a');
 // legs
 R(6,14,2,3-(s>0?1:0),'#3a6a3a');R(10,14,2,3-(s<0?1:0),'#3a6a3a');R(5,16-(s>0?1:0),4,1,'#6aaa6a');R(10,16-(s<0?1:0),4,1,'#6aaa6a');});
defMob('tengu',20,22,(R,f,s)=>{const b=s?1:0,flap=f%2;
 // wings behind
 if(flap){R(0,2,6,3,'#1e1a24');R(1,1,4,1,'#3a3444');R(0,5,4,4,'#1e1a24');}else{R(0,7,5,8,'#1e1a24');R(1,8,3,6,'#3a3444');R(0,15,3,2,'#1e1a24');}
 // white robe with a checkered vest
 R(6,9+b,8,9,'#e8e4dc');R(6,9+b,8,1,'#fff');R(7,10+b,6,4,'#2a6a8a');R(8,11+b,1,1,'#e8e4dc');R(10,11+b,1,1,'#e8e4dc');R(9,12+b,1,1,'#e8e4dc');R(11,12+b,1,1,'#e8e4dc');R(6,14+b,8,1,'#c03020');
 // head: red face, the long nose, a black tokin cap, white brows
 R(7,2+b,7,7,'#d03a2a');R(7,2+b,7,1,'#f06a4a');R(13,5+b,5,2,'#d03a2a');R(17,5+b,1,1,'#f06a4a');R(10,0+b,3,3,'#14101a');R(9,2+b,5,1,'#14101a');R(11,4+b,2,1,'#fff');R(12,5+b,1,1,'#14101a');R(10,3+b,4,1,'#f0f0f0');
 // the feather fan in the front hand
 R(14,10+b,2,3,'#d03a2a');R(16,6+b,4,5,'#2a8a4a');R(17,5+b,2,1,'#4aaa6a');R(16,11+b,1,2,'#6a4a2a');
 // legs on tall geta
 R(8,18,2,3-(s>0?1:0),'#e8e4dc');R(11,18,2,3-(s<0?1:0),'#e8e4dc');R(7,21-(s>0?1:0),4,1,'#6a4a2a');R(11,21-(s<0?1:0),4,1,'#6a4a2a');});
defMob('kasa',15,21,(R,f,s)=>{const hop=f===1?2:f===3?1:0,y0=-hop;
 // the umbrella canopy: red and white panels
 for(let i=0;i<7;i++){const w=3+i*1.6|0,x=7-(w>>1);R(x,y0+1+i,w,1,i%2?'#d02030':'#f0e8d8');}
 R(1,y0+8,13,2,'#d02030');R(1,y0+8,13,1,'#f06070');for(const x of [2,5,8,11])R(x,y0+8,1,2,'#6a2a20');R(7,y0,1,2,'#3a2a1a');
 // the single great eye and the tongue
 R(5,y0+3,5,4,'#fff');R(6,y0+4,3,2,'#14101a');R(7,y0+4,1,1,'#ff4040');R(6,y0+7,3,4,'#e05080');R(7,y0+10,1,2,'#c03060');
 // the handle and one leg on a geta
 R(7,y0+10,1,6,'#8a6a3a');R(6,y0+15,3,3,'#e0b890');R(5,18,5,1,'#6a4a2a');R(5,19,1,2,'#6a4a2a');R(9,19,1,2,'#6a4a2a');});
defMob('gaikotsu',17,22,(R,f,s)=>{const b=s?1:0,BN='#e8e0cc',BD='#a89c84';
 // rusted helmet and skull
 R(4,0+b,9,3,'#6a4a3a');R(3,2+b,11,1,'#8a6040');R(5,3+b,7,5,BN);R(6,4+b,2,2,'#14101a');R(9,4+b,2,2,'#14101a');R(6,4+b,1,1,'#ff5030');R(7,7+b,4,1,BD);for(const x of [7,9])R(x,7+b,1,1,'#14101a');
 // ribcage and spine
 R(8,8+b,1,8,BD);for(let y=9;y<14;y+=2)R(5,y+b,7,1,BN);R(5,9+b,1,5,BD);R(11,9+b,1,5,BD);R(6,15+b,5,2,'#5a4a3a');
 // arms: a rusted sword in front, a bone in the back hand
 R(3,9+b,2,5,BN);R(2,13+b,2,2,BD);R(12,9+b,2,4,BN);R(13,12+b,2,2,BD);R(15,4+b,1,9,'#8a8a94');R(16,4+b,1,8,'#c8c8d0');R(14,12+b,3,1,'#6a4a2a');
 // legs
 R(6,17,1,4-(s>0?1:0),BN);R(10,17,1,4-(s<0?1:0),BN);R(5,21-(s>0?1:0),3,1,BD);R(10,21-(s<0?1:0),3,1,BD);});
defMob('yamabushi',19,23,(R,f,s)=>{const b=s?1:0;
 // ringed staff behind
 R(16,0+b,1,22,'#6a4a2a');R(15,0+b,3,3,'#c8a040');R(15,1+b,1,1,'#14101a');R(17,1+b,1,1,'#14101a');
 // robe: white with green pom-pom sash, checkered pants
 R(4,9+b,10,8,'#ece6d8');R(4,9+b,10,1,'#fff');R(4,9+b,2,8,'#c8c0b0');for(const x of [6,9,12])R(x,11+b,2,2,'#2a8a4a');R(4,14+b,10,1,'#8a6a3a');
 R(5,17,8,3,'#3a4a6a');for(let x=5;x<13;x+=2)R(x,18,1,1,'#ece6d8');
 // head: beard, the small black tokin, eyes
 R(6,2+b,7,7,'#e0b080');R(6,6+b,7,3,'#c8c0b8');R(8,0+b,4,3,'#14101a');R(7,2+b,6,1,'#14101a');R(10,4+b,1,1,'#14101a');R(12,4+b,1,1,'#14101a');
 // arms: the conch at the hip, hand on the staff
 R(13,10+b,3,2,'#ece6d8');R(15,10+b,2,2,'#e0b080');R(2,12+b,3,3,'#f0d0b0');R(1,13+b,2,2,'#e8b0a0');
 // legs on straw sandals
 R(6,20,2,3-(s>0?1:0),'#3a4a6a');R(10,20,2,3-(s<0?1:0),'#3a4a6a');R(5,22-(s>0?1:0),4,1,'#c8a060');R(10,22-(s<0?1:0),4,1,'#c8a060');});

// a thrown bone, for the gaikotsu
PSPR.bone=(X,Y,ux,uy,q)=>{const a=time*12+(q.x||0),c=Math.cos(a),s=Math.sin(a);const P=(x,y,col,w,h)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),w||1,h||1);};
 for(let i=-3;i<=3;i++)P(X+c*i-1,Y+s*i-1,'#14101a',3,3);for(let i=-3;i<=3;i++)P(X+c*i,Y+s*i,'#e8e0cc');for(const k of [-1,1])P(X+c*k*4-1,Y+s*k*4-1,'#e8e0cc',2,2);};
Object.assign(FOESHOT,{kappa:'bubble',tengu:'feather',kasa:'magatama',gaikotsu:'bone',yamabushi:'ofuda'});

{const P2=o=>SH(Object.assign({w:.55,sp:62,dmg:9,pd:8,rec:.5,cnt:1},o));
 Object.assign(ET,{
  kappa:{animal:1,n:'KAPPA',hp:56,spd:40,pos:44,r:5,ai:'ranged',keep:70,rng:120,wl:8,cdMin:.9,cdMax:1.5,desc:'A RIVER IMP. BLOWS BUBBLES THAT BOUNCE OFF WALLS, THEN LUNGES TO GRAB YOU',
   atks:[P2({cnt:4,spread:.7,sp:62,col:'#80c0ff',st:'bounce',bn:1}),TH({w:.4,dist:70,sp:220,dmg:14,pd:12})]},
  tengu:{animal:1,n:'TENGU',hp:62,spd:58,pos:40,r:5,ai:'dasher',rng:120,wl:8,fly:1,cdMin:.8,cdMax:1.4,desc:'A CROW WARRIOR. FANS WALLS OF FEATHERS, THEN SWOOPS',
   atks:[P2({pat:'wall',cnt:9,sp:70,col:'#e8eef6',reps:2,gap:.35}),CH({w:.5,sp:250,dur:.5,dmg:18,dmin:30})]},
  kasa:{animal:1,n:'KASA-OBAKE',hp:40,spd:44,pos:30,r:5,ai:'ranged',keep:80,rng:130,wl:6,cdMin:.9,cdMax:1.5,desc:'A HAUNTED UMBRELLA. HOPS ABOUT AND SPINS RINGS OF JEWELS WITH A GAP',
   atks:[P2({pat:'gapring',cnt:16,reps:2,gap:.4,gw:.5,sp:56,col:'#e05080'}),P2({pat:'spiral',arms:2,spin:.35,reps:8,gap:.1,sp:64,col:'#f0e8d8'})]},
  gaikotsu:{animal:1,n:'GAIKOTSU',hp:50,spd:42,pos:40,r:5,ai:'melee',rng:36,wl:10,cdMin:.8,cdMax:1.4,desc:'A SKELETON SOLDIER. SLASHES UP CLOSE AND THROWS SPINNING BONES',
   atks:[SL({w:.5,range:30,arc:120,dmg:16,rec:.5}),P2({cnt:3,spread:.5,sp:80,col:'#e8e0cc',reps:2,gap:.25})]},
  yamabushi:{animal:1,n:'YAMABUSHI',hp:70,spd:30,pos:56,r:6,ai:'ranged',keep:90,rng:150,wl:10,cdMin:1,cdMax:1.7,desc:'A MOUNTAIN HERMIT. BLOWS HIS CONCH FOR WALLS OF TALISMANS, SLAMS HIS STAFF IF YOU GET CLOSE',
   atks:[P2({pat:'wall',cnt:11,sp:58,col:'#fd4',reps:2,gap:.5}),SM({w:.7,rad:30,dmg:20,rec:.6})]}});
 [['kappa',1],['kappa',4],['tengu',8],['tengu',9],['kasa',5],['kasa',7],['gaikotsu',7],['gaikotsu',11],['yamabushi',4],['yamabushi',6]].forEach(([t,i])=>DUN[i].pool.push(t,t));}
