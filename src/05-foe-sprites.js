'use strict';
// HELL OF THE EMPEROR - foe sprites (part of the former game.js; files load in numeric order, see index.html)
// ================= FOE SPRITES: 18x24, 2 frames, facing right (flipped toward you) =================
// a shared body (legs, torso, arms, head) plus per-type headgear, outfit, weapon and extras, so every foe reads
// at a glance: the spearman's jingasa and yari, the archer's quiver, the samurai's crested helm, the monk's beads...
// palette keys: c cloth, d dark cloth, a accent, h hat/hair, s skin, plus literal colours.
const FOESC={jailer:1.4,guardian:1.4,brute:1.5};
function foeSprite(type,p){const FW=18,FH=24,N=2,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d'),D=FOESPR[type];
 for(let f=0;f<N;f++){const fr=mk(FW,FH,g=>{const C=k=>p[k]||k,R=(x,y,w,h,c)=>{g.fillStyle=C(c);g.fillRect(x,y,w,h);};
   const b=f,U=(x,y,w,h,c)=>R(x,y+b,w,h,c); // U: upper body, bobs 1px on frame 1
   const ctx2={R,U,b,f,p,C,sh:k=>shade(C(k),-.3),hi:k=>shade(C(k),.3)};
   if(D.body!==false)foeBody(ctx2,D);D.draw(ctx2);});
  sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:FOESC[type]||1,ok:true,animal:true};}
// the shared body: o.robe lengthens the torso over the legs, o.bulk widens it, o.arms:false skips arms
function foeBody({R,U,b,f,sh,hi},o){
 const lg=o.leg||'d',ft=o.foot||'#2a2026';
 if(!o.robe){ // legs: a walking step on frame 1
  R(6,19,2,4-(f?1:0),lg);R(10,19+(f?0:0),2,4,lg);R(5,22-(f?1:0),3,2,ft);R(10,22,3,2,ft);R(6,19,1,3,sh(lg));}
 else{R(5,22,3,2,ft);R(10,22-(f?1:0),3,2,ft);}
 const bw=o.bulk?10:8,bx=9-bw/2,top=12,bot=o.robe?21:18;
 for(let y=top;y<=bot;y++){const flare=o.robe&&y>17?Math.min(2,y-17):0;U(bx-flare,y,bw+flare*2,1,o.torso||'c');U(bx-flare,y,1,1,sh(o.torso||'c'));}
 if(o.belt!==false)U(bx,16,bw,1,o.belt||'a');
 if(o.arms!==false){U(bx-2,13,2,5,o.sleeve||o.torso||'c');U(bx-2,13,1,5,sh(o.sleeve||o.torso||'c'));U(bx-2,18,2,1,o.hand||'s');
  U(bx+bw,13,2,4,o.sleeve||o.torso||'c');U(bx+bw,17,2,1,o.hand||'s');}
 if(o.head!==false){U(6,6,6,6,o.face||'s');U(11,8,1,1,o.eye||'#14101a');U(9,8,1,1,o.eye2||o.eye||'#14101a');U(6,10,1,2,sh(o.face||'s'));U(10,10,2,1,o.mouth||sh(o.face||'s'));}}
// a straight weapon shaft from (x,y) in direction a, length n
const shaft=(R,x,y,a,n,c)=>{for(let i=0;i<n;i++)R(Math.round(x+Math.cos(a)*i),Math.round(y+Math.sin(a)*i),1,1,c);};
const FOESPR={
 ashigaru:{draw:({R,U,b})=>{ // conical jingasa, lamellar plates, a long yari
  U(4,5,10,1,'h');U(5,4,8,1,'h');U(7,3,4,1,'h');U(8,2,2,1,'a');U(4,5,2,1,'#14101a');
  U(5,13,8,1,'d');U(5,15,8,1,'d');U(7,12,4,1,'a');
  R(15,1+b,1,21,'#7a5a3a');R(15,0+b,1,1,'#e8eef6');R(14,1+b,3,2,'#c8d0dc');R(15,3+b,1,1,'#d02030');}},
 archer:{draw:({R,U,b})=>{ // straw kasa, quiver of arrows on the back, a curved yumi
  U(3,5,12,1,'#c8a050');U(4,4,10,1,'#d8b860');U(6,3,6,1,'#e0c070');U(8,2,2,1,'#c8a050');
  U(2,10,2,8,'#6a4428');U(2,9,1,2,'#e8e0d0');U(3,8,1,2,'#d03030');U(2,12,2,1,'a');
  for(let j=-8;j<=8;j++)R(15+Math.round(2*Math.cos(j/8*1.4)),14+j+b,1,1,'#7a4a22');R(15,6+b,1,17,'#e8e8f0');R(14,14+b,1,1,'s');}},
 samurai:{body:true,bulk:1,draw:({R,U,b})=>{ // horned kabuto with a gold crescent, broad shoulder plates, drawn katana
  U(5,4,8,3,'#1a1a22');U(4,6,2,3,'#1a1a22');U(12,6,1,3,'#1a1a22');U(6,3,6,1,'#2a2a34');U(5,6,8,1,'#e0b040');
  U(6,1,1,3,'#e0b040');U(11,1,1,3,'#e0b040');U(7,2,4,1,'#e0b040');
  U(3,12,3,3,'d');U(12,12,3,3,'d');U(3,12,3,1,'a');U(12,12,3,1,'a');U(4,14,10,1,'#c02030');
  shaft(R,15,17+b,-1.1,9,'#e8eef6');shaft(R,16,17+b,-1.1,8,'#a8b0c0');R(14,17+b,2,2,'#3a2a2a');R(15,16+b,1,1,'#e0b040');}},
 ninja:{draw:({R,U,b,f})=>{ // full hood with an eye slit, a red scarf trailing behind, kunai
  U(5,5,8,7,'#22222e');U(6,8,6,1,'s');U(10,8,1,1,'#14101a');U(8,8,1,1,'#14101a');U(6,4,6,1,'#2e2e3c');
  U(2,11,4,1,'#c02030');U(1,12-(f?1:0),3,1,'#c02030');U(0,13-(f?1:0),2,1,'#901828');
  shaft(R,14,17+b,-.6,4,'#d0d8e0');R(14,17+b,1,1,'#c02030');R(4,15+b,2,1,'#d0d8e0');},torso:'#2a2a3a',sleeve:'#22222e',belt:'#c02030',leg:'#22222e'},
 monk:{robe:1,draw:({R,U,b})=>{ // shaven head, long saffron robe, big prayer beads, ringed shakujo staff
  U(6,5,6,2,'s');U(7,4,4,1,'s');U(7,5,2,1,'#f0d0a0');
  for(const [x,y] of [[6,12],[7,13],[8,14],[9,14],[10,13],[11,12],[9,15]])U(x,y,1,1,'#5a2a14');U(9,16,1,1,'#e0b040');
  R(15,4+b,1,19,'#8a6a3a');R(14,2+b,3,1,'#c8c8d0');R(13,3+b,1,2,'#c8c8d0');R(17,3+b,1,2,'#c8c8d0');R(15,1+b,1,1,'#e0e0e8');R(14,5+b,3,1,'#c8c8d0');},belt:'#7a3010'},
 shielder:{bulk:1,draw:({R,U,b})=>{ // iron kasa, a great tower shield with a clan crest, spear point over the top
  U(4,5,10,1,'#5a5a68');U(5,4,8,1,'#6a6a78');U(7,3,4,1,'#7a7a88');
  R(15,0+b,1,10,'#7a5a3a');R(15,0+b,1,2,'#e8eef6');
  R(11,9+b,6,13,'#6a5a48');R(11,9+b,6,1,'#9a8a70');R(11,9+b,1,13,'#4a3e30');R(16,9+b,1,13,'#4a3e30');R(11,21+b,6,1,'#4a3e30');
  R(12,13+b,4,4,'#c8c8d0');R(13,14+b,2,2,'#c02030');R(13,10+b,2,1,'#c8c8d0');R(13,19+b,2,1,'#c8c8d0');}},
 shaman:{robe:1,draw:({R,U,b,f})=>{ // deep hood, a white spirit mask with red markings, staff topped by a glowing orb
  U(5,4,8,3,'h');U(4,6,2,7,'h');U(12,6,2,5,'h');U(6,6,6,5,'#f0ece0');U(7,8,1,1,'#14101a');U(10,8,1,1,'#14101a');U(8,6,2,1,'#c02030');U(7,10,4,1,'#c02030');
  R(15,6+b,1,17,'#5a3a2a');R(14,2+b,3,3,'a');R(14,2+b,1,1,'#fff');R(13+(f?0:4),1+b,1,1,'a');
  U(5,13,8,1,'a');U(5,19,8,1,'a');},head:false},
 sniper:{draw:({R,U,b})=>{ // tied-back hair with a red headband, a tall longbow taller than the archer's
  U(6,4,6,2,'#1a1418');U(5,5,2,4,'#1a1418');U(3,5,3,1,'#1a1418');U(2,6,2,3,'#1a1418');U(6,6,6,1,'#d03030');U(4,6,1,2,'#d03030');
  for(let j=-10;j<=10;j++)R(15+Math.round(2*Math.cos(j/10*1.4)),12+j+b,1,1,'#5a3418');R(15,2+b,1,21,'#e8e8f0');R(14,12+b,1,1,'s');
  U(5,12,8,1,'#d03030');}},
 assassin:{draw:({R,U,b,f})=>{ // pointed cowl and veil, twin curved blades reversed in both hands
  U(5,5,8,7,'h');U(7,3,4,2,'h');U(8,2,2,1,'h');U(6,8,6,1,'s');U(10,8,1,1,'a');U(8,8,1,1,'a');U(6,9,6,3,'#2a1a2a');
  U(2,12,3,1,'a');U(1,13-(f?1:0),2,1,'a');
  shaft(R,15,17+b,-2.2,6,'#d8dce4');shaft(R,3,18+b,-1,6,'#d8dce4');R(15,17+b,1,1,'a');R(3,18+b,1,1,'a');},head:true,torso:'c',sleeve:'d'},
 bandit:{draw:({R,U,b})=>{ // spiky hair and a headband, open vest over bare arms, a hand crossbow
  U(6,4,6,2,'#2a1a10');U(5,3,1,2,'#2a1a10');U(8,3,1,1,'#2a1a10');U(11,3,1,2,'#2a1a10');U(6,6,6,1,'a');U(4,6,2,1,'a');U(3,7,1,1,'a');
  U(7,12,4,4,'#e0b080');U(8,13,1,1,'#c08060');U(10,14,1,1,'#c08060');
  R(13,16+b,5,1,'#6a4428');R(17,14+b,1,5,'#5a3418');R(16,13+b,1,1,'#5a3418');R(16,19+b,1,1,'#5a3418');R(13,15+b,1,1,'#d8dce4');},sleeve:'s'},
 bomber:{draw:({R,U,b,f})=>{ // padded hood with smoked goggles, a bandolier of bombs, a lit bomb in hand
  U(5,4,8,4,'h');U(4,6,2,6,'h');U(6,7,6,2,'#3a3a40');U(7,7,2,1,'#ff8a30');U(10,7,2,1,'#ff8a30');U(6,9,6,3,'h');
  for(const [x,y] of [[6,13],[8,14],[10,15]]){U(x,y,2,2,'#2a2a30');U(x,y,1,1,'#6a6a70');}
  R(14,15+b,4,4,'#2a2a30');R(14,15+b,1,1,'#7a7a80');R(16,13+b,1,2,'#8a6a3a');R(16+(f?1:0),12+b,1,1,f?'#ffe060':'#ff6020');R(17-(f?0:1),11+b,1,1,'#fff');},head:false,eye:'#ff8a30'},
 jailer:{bulk:1,draw:({R,U,b,f})=>{ // iron helm with a face guard, a ring of keys, chain wrapped round the arm, spiked kanabo
  U(5,4,8,4,'#4a4a54');U(4,7,10,1,'#3a3a44');U(6,8,6,3,'#5a5a64');U(7,9,1,1,'#ff3030');U(10,9,1,1,'#ff3030');U(6,10,6,1,'#3a3a44');
  for(let y=12;y<19;y+=2)U(3,y,2,1,'#9a9aa6');U(9,17,2,2,'#e0b040');U(10,16,1,1,'#e0b040');
  shaft(R,15,19+b,-1.35,14,'#3a2a20');shaft(R,16,19+b,-1.35,12,'#4a3a28');for(let i=3;i<13;i+=3){const x=Math.round(15+Math.cos(-1.35)*i),y=Math.round(19+b+Math.sin(-1.35)*i);R(x-1,y,1,1,'#c8c8d0');R(x+2,y,1,1,'#c8c8d0');}},head:false},
 imp:{body:false,draw:({R,U,b,f})=>{ // a little fire oni: red skin, horns, fanged grin, loincloth, flaming club
  R(6,19,2,3-(f?1:0),'c');R(10,19,2,3,'c');R(5,21-(f?1:0),3,2,'d');R(10,21,3,2,'d');
  U(5,12,8,7,'c');U(5,12,1,7,'d');U(6,16,6,3,'#2a1a10');U(7,16,4,1,'a');U(3,13,2,4,'c');U(13,13,2,4,'c');
  U(5,5,8,7,'c');U(5,5,1,7,'d');U(6,3,1,3,'a');U(11,3,1,3,'a');U(5,2,1,2,'a');U(12,2,1,2,'a');U(4,7,1,2,'c');U(13,7,1,2,'c');
  U(7,7,1,1,'#ffe060');U(10,7,1,1,'#ffe060');U(7,10,4,1,'#2a0a08');U(7,10,1,1,'#fff');U(10,10,1,1,'#fff');
  shaft(R,14,16+b,-1.2,6,'#5a3418');R(15,8+b,2,3,f?'#ffe060':'#ff8a30');R(15,7+b,1,1,'#ff4020');}},
 frog:{body:false,draw:({R,U,b,f})=>{ // a squat frog-man: wide head, bulging eyes on top, pale belly, webbed feet, a reed spear
  R(4,21,4,2,'d');R(10,21-(f?1:0),4,2,'d');R(3,22,2,1,'s');R(13,22-(f?1:0),2,1,'s');R(5,18,3,3,'c');R(10,18,3,3,'c');
  U(4,12,10,7,'c');U(6,13,6,5,'s');U(4,12,1,7,'d');U(2,13,2,4,'c');U(14,13,2,4,'c');
  U(3,7,12,5,'c');U(3,7,12,1,'h');U(3,11,12,1,'d');U(4,10,10,1,'#1a3a12');
  U(4,4,4,4,'c');U(10,4,4,4,'c');U(5,5,2,2,'#f0e060');U(11,5,2,2,'#f0e060');U(6,5,1,2,'#14101a');U(12,5,1,2,'#14101a');
  shaft(R,16,21+b,-1.57,18,'#8a7a3a');R(15,2+b,3,2,'#c8d0a0');}},
 priest:{robe:1,draw:({R,U,b})=>{ // a tall black eboshi, white robe with gold trim, a gohei wand of zigzag paper
  U(7,0,4,6,'#1a1a1e');U(8,0,3,1,'#2e2e34');U(6,5,6,1,'#1a1a1e');U(7,1,1,4,'#3a3a40');
  U(5,12,8,1,'a');U(8,13,2,8,'a');U(5,20,8,1,'a');
  R(15,6+b,1,17,'#c8a060');R(16,6+b,2,1,'#fff');R(15,7+b,2,1,'#fff');R(16,8+b,2,1,'#fff');R(15,9+b,2,1,'#fff');R(16,10+b,2,1,'#fff');R(15,5+b,1,1,'#e03040');},torso:'#f0ece0',sleeve:'#f0ece0',belt:false},
 wraith:{body:false,draw:({R,U,b,f})=>{ // a yurei: no legs, a white burial kimono fading to mist, long black hair over the face, limp hands
  for(let y=12;y<=22;y++){const w=y<18?8:Math.max(2,8-(y-17)*1.4|0),x=9-w/2+(y>18?(f?1:-1):0);R(Math.round(x),y+b,w,1,y>19?'d':'c');}
  U(5,13,8,1,'#d8d0c0');U(8,13,1,4,'#d8d0c0');U(2,13,3,3,'c');U(13,13,3,3,'c');U(1,15,2,2,'s');U(15,15,2,2,'s');U(1,17,1,1,'s');U(16,17,1,1,'s');
  U(5,4,8,9,'#14101a');U(6,3,6,1,'#14101a');U(7,7,4,4,'s');U(7,7,1,4,'#14101a');U(9,9,1,1,'#ff4040');U(4,6,1,8,'#14101a');U(13,6,1,6,'#14101a');
  U(6,2,6,1,'#f0f0f0');U(7,1,4,1,'#f0f0f0');}},
 shroom:{body:false,draw:({R,U,b,f})=>{ // a sporeling: a broad spotted cap, a pale stalk body with a sleepy face, stubby feet
  R(6,21-(f?1:0),3,2,'h');R(10,21,3,2,'h');
  U(6,12,7,9,'s');U(6,12,1,9,'#c8b8a8');U(8,15,1,1,'#14101a');U(11,15,1,1,'#14101a');U(9,17,2,1,'#a08070');U(4,15,2,1,'s');U(13,14,2,1,'s');
  for(let y=0;y<7;y++){const w=y<2?6+y*4:Math.min(16,14+(y>4?2:0)),x=9-w/2;U(Math.round(x),3+y,w,1,y===6?'d':'c');}
  U(5,5,3,2,'a');U(11,4,2,2,'a');U(14,7,2,1,'a');U(2,8,2,1,'a');U(8,7,2,1,'a');U(4,9,10,1,'d');
  if(f){R(3,1,1,1,'a');R(15,2,1,1,'a');}}},
 blood:{robe:1,draw:({R,U,b,f})=>{ // a blood monk: shaven head, glowing red eyes, bone prayer beads, crimson-dripping hands
  U(6,5,6,2,'s');U(7,4,4,1,'s');U(11,8,1,1,'a');U(9,8,1,1,'a');U(6,9,6,1,'#3a0810');
  for(const [x,y] of [[6,12],[7,13],[8,14],[9,14],[10,13],[11,12]])U(x,y,1,1,'#e8e0d0');U(9,15,1,1,'a');
  U(3,18,2,1,'a');U(13,17,2,1,'a');R(3,19+(f?1:0)+b,1,1,'a');R(14,18+(f?0:1)+b,1,1,'a');},belt:'#2a0408',eye:'a',hand:'#c02030'},
 guardian:{bulk:1,draw:({R,U,b})=>{ // a marble temple guardian: crested stone helm, blue gem, round shield and a stone sword
  U(5,3,8,4,'c');U(4,6,10,1,'d');U(8,1,2,2,'a');U(6,7,6,4,'#e8ecf0');U(7,8,1,1,'a');U(10,8,1,1,'a');U(6,4,1,2,'#f8fafc');
  U(4,12,10,1,'#f8fafc');U(8,13,2,2,'a');
  shaft(R,4,18+b,-1.9,9,'#e8ecf0');R(2,17+b,4,1,'d');
  R(12,11+b,6,8,'c');R(13,10+b,4,10,'c');R(12,11+b,1,8,'d');R(14,13+b,2,4,'a');R(14,13+b,1,1,'#bfe6ff');},head:false,face:'c'},
 brute:{bulk:1,draw:({R,U,b,f})=>{ // an ogre brute: horned and hulking, a rope belt, bare chest, an iron-studded kanabo on the shoulder
  U(5,5,8,7,'s');U(5,5,1,7,shade(SKIN,-.3));U(6,3,1,3,'#e8e0d0');U(11,3,1,3,'#e8e0d0');U(5,2,1,2,'#e8e0d0');U(12,2,1,2,'#e8e0d0');
  U(7,8,1,1,'#ffe060');U(10,8,1,1,'#ffe060');U(6,7,2,1,'#3a2a1a');U(9,7,3,1,'#3a2a1a');U(7,10,4,1,'#3a1a10');U(7,11,1,1,'#fff');U(10,11,1,1,'#fff');
  U(5,12,8,4,'s');U(6,13,2,1,shade(SKIN,-.2));U(10,13,2,1,shade(SKIN,-.2));
  shaft(R,15,16+b,-2.0,14,'#3a2a20');shaft(R,16,16+b,-2.0,13,'#5a4030');for(let i=5;i<14;i+=3){const x=Math.round(15+Math.cos(-2)*i),y=Math.round(16+b+Math.sin(-2)*i);R(x-1,y,1,1,'#c8c8d0');}},head:false,torso:'c',sleeve:'s',belt:'#c8a050'},
};
// the per-type body options live alongside draw(); unspecified ones use the defaults in foeBody
for(const k in FOESPR){const D=FOESPR[k];if(D.body===true)delete D.body;}
