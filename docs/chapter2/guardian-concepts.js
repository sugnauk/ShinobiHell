// concept paintings for the XVI-XX guardians: two directions each. Runs inside the game page (uses hiArt, HIP).
window.CONCEPTS=[];
const CP=(g,dir,title,desc,two,paint)=>CONCEPTS.push({g,dir,title,desc,two,draw:hiArt(paint)});
const near0=[[47,30],[53,39],[52,47]].map(a=>a),far0=[[25,30],[20,40],[22,49]];
const ARMS=(H,Q,f,n)=>[(Q.far||f||far0).map(H.pt),(Q.near||n||near0).map(H.pt)];
const head=(H,hx,hy,sk,o={})=>{H.ell(hx,hy,o.rx||12,o.ry||14,sk);H.ell(hx-3,hy-3,5,6,H.lt(sk),0);H.fill([[hx+6,hy-8],[hx+12,hy-2],[hx+11,hy+8],[hx+6,hy+4]],H.dk(sk));
 if(o.eyes!==false){H.rect(hx-8,hy-2,4,3,o.eye||'#14101a');H.rect(hx+3,hy-2,4,3,o.eye||'#14101a');}};
const robe=(H,cx,y0,y1,w0,w1,c,by)=>{H.poly([[cx-w0,y0+by],[cx+w0,y0+by],[cx+w1,y1],[cx-w1,y1]],c);H.fill([[cx-w0+1,y0+2+by],[cx-w0+9,y0+2+by],[cx-w1+12,y1-2],[cx-w1+2,y1-2]],H.lt(c));H.fill([[cx+w0-8,y0+2+by],[cx+w0-1,y0+2+by],[cx+w1-2,y1-2],[cx+w1-12,y1-2]],H.dk(c));};

// ============ NEBARI (XVI, the silt cellars) ============
CP('NEBARI','A','THE MIRE WARDEN','A HULKING LAKE-DREDGER IN A TAR-SOAKED HOODED OILCLOTH CAPE. HUGE TAR LADLE, AMBER EYES IN THE HOOD. II: THE TAR SETS INTO STONE PLATES WITH MOLTEN CRACKS.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q);
 const TAR='#1e1a18',TAR2='#3a3430',MUD='#7a6440',AMB='#ffb040',ST='#6a6660',ST2='#8a8680';
 HIP.legs(H,Q,cx,104,([hp,kn,ft])=>{H.limb([hp,kn],18,MUD,H.lt(MUD));H.limb([kn,[ft[0],ft[1]-6]],14,TAR,TAR2);H.poly([[ft[0]-12,ft[1]-8],[ft[0]+13,ft[1]-8],[ft[0]+14,ft[1]],[ft[0]-12,ft[1]]],TAR);});
 // the ladle: long pole, a deep bowl of glowing tar
 {const [x,y]=near[2];H.limb([[x-4,y+40],[x+18,y-70]],6,'#5a4028','#7a5a38');H.ell(x+20,y-76,13,8,TAR);H.ell(x+20,y-79,10,4,two?'#ff7030':'#3a2010',0);for(const d of [-4,3])H.rect(x+20+d,y-80,2,2,AMB);}
 // the cape: wide, dripping
 H.poly([[cx-24,48+by],[cx+24,48+by],[cx+44,124],[cx-44,124]],TAR);H.fill([[cx-22,52+by],[cx-12,52+by],[cx-24,122],[cx-40,122]],TAR2);
 for(let x=-40;x<=40;x+=8)H.limb([[cx+x,122],[cx+x+1,128+(x%3+3)*2]],3,TAR);
 if(two){for(const [x,y,w,h] of [[-30,70,22,18],[6,64,24,20],[-20,96,26,18],[12,92,24,22]]){H.poly([[cx+x,y+by],[cx+x+w,y+by+2],[cx+x+w-2,y+by+h],[cx+x+2,y+by+h-2]],ST);H.ln(cx+x+3,y+by+3,cx+x+w-3,y+by+3,2,ST2);}
  for(const [x0,y0,x1,y1] of [[-8,70,-2,90],[4,88,14,104],[-26,92,-14,96]])H.ln(cx+x0,y0+by,cx+x1,y1+by,2,'#ff7030');}
 // cork-float necklace, a lantern at the belt
 for(let i=0;i<7;i++)H.ell(cx-18+i*6,58+by+Math.abs(i-3)*2,3,2,'#c8a060',1);H.rect(cx-16,98+by,8,10,'#2a2018');H.rect(cx-14,100+by,4,6,AMB);
 H.limb(far,14,TAR,TAR2);HIP.hand(H,far[2][0],far[2][1],'#5a4a3a');H.limb(near,14,TAR,TAR2);HIP.hand(H,near[2][0],near[2][1],'#5a4a3a');
 // the hood: deep shadow, two amber eyes
 const hy=34+by;H.poly([[cx-18,hy+16],[cx-16,hy-10],[cx,hy-20],[cx+16,hy-10],[cx+18,hy+16]],TAR);H.ell(cx,hy+2,11,12,'#0a0808',0);H.rect(cx-7,hy,4,2,AMB);H.rect(cx+3,hy,4,2,AMB);
 if(two)H.poly([[cx-18,hy-4],[cx-4,hy-16],[cx+10,hy-12],[cx+18,hy+4],[cx+6,hy-2]],ST);});
CP('NEBARI','B','THE LACQUER MASTER','A TALL, LEAN MASTER OF THE PALACE LACQUER WORKS: STAINED APRON, CLOTH OVER HIS NOSE AND MOUTH AGAINST THE FUMES, A SPATULA-GLAIVE DRIPPING RED LACQUER. II: THE LACQUER SETS INTO A GLOSSY RED-BLACK SHELL FLECKED WITH GOLD.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q);
 const KI='#3a3638',LQ='#6a1a12',LQ2='#9a2a1a',BK='#1a1012',GD='#e0b048',SK='#c89a70';
 HIP.legs(H,Q,cx,100,([hp,kn,ft])=>{H.limb([hp,kn],12,'#2a2628');H.limb([kn,[ft[0],ft[1]-6]],10,'#2a2628');H.poly([[ft[0]-8,ft[1]-5],[ft[0]+9,ft[1]-5],[ft[0]+10,ft[1]],[ft[0]-9,ft[1]]],'#e8e0d0');});
 {const [x,y]=near[2];H.limb([[x-2,y+44],[x+6,y-60]],5,'#4a3020','#6a4a30');H.poly([[x+2,y-60],[x+12,y-60],[x+16,y-86],[x+4,y-90]],'#c8ccd6');H.fill([[x+3,y-62],[x+10,y-62],[x+9,y-74],[x+4,y-74]],LQ2);H.limb([[x+8,y-62],[x+8,y-50]],2,LQ2);}
 robe(H,cx,48,100,16,18,two?BK:KI,by);
 H.poly([[cx-14,58+by],[cx+14,58+by],[cx+16,112],[cx-16,112]],two?LQ:LQ);for(let y=64;y<110;y+=10)H.ln(cx-12,y+by,cx-6,y+by+4,2,LQ2);
 if(two){for(const [x,y] of [[-10,62],[8,74],[-4,90],[10,100]])H.rect(cx+x,y+by,3,2,GD);H.poly([[cx-24,48+by],[cx-8,46+by],[cx-6,60+by],[cx-24,62+by]],BK);H.poly([[cx+24,48+by],[cx+8,46+by],[cx+6,60+by],[cx+24,62+by]],BK);}
 H.limb(far,10,KI);HIP.hand(H,far[2][0],far[2][1],two?BK:SK);H.limb(near,10,KI);HIP.hand(H,near[2][0],near[2][1],two?BK:SK);
 const hy=32+by;head(H,cx,hy,SK);H.poly([[cx-12,hy+2],[cx+12,hy+2],[cx+10,hy+12],[cx-10,hy+12]],'#d8d0c0');H.ln(cx-12,hy-8,cx+12,hy-8,4,LQ);
 if(two)H.poly([[cx-13,hy-12],[cx+13,hy-12],[cx+13,hy+2],[cx-13,hy+2]],BK);});

// ============ KANE (XIX, the bell foundry) ============
CP('KANE','A','THE BELL FOUNDER','A MASSIVE FOUNDRY MASTER: LEATHER APRON OVER A QUILTED JACKET, A BRONZE TEMPLE BELL CHAINED ON HIS BACK, A HUGE IRON-BANDED CASTING MALLET. II: THE BELL GLOWS MOLTEN, THE APRON SMOULDERS.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q,[[23,30],[17,41],[19,50]],[[49,30],[56,39],[55,47]]);
 const BR='#a8743a',VG='#4a8a78',LE='#6a4426',JK='#2e2a32',SK='#b07850';
 // the bell behind his shoulders
 H.poly([[cx-26,20+by],[cx+26,20+by],[cx+34,76+by],[cx-34,76+by]],two?'#ff9040':BR);H.ln(cx-32,70+by,cx+32,70+by,4,two?'#ffd060':VG);H.ln(cx-28,34+by,cx+28,34+by,3,two?'#ffd060':VG);H.rect(cx-6,10+by,12,12,BR);
 HIP.legs(H,Q,cx,104,([hp,kn,ft])=>{H.limb([hp,kn],18,JK,H.lt(JK));H.limb([kn,[ft[0],ft[1]-6]],14,'#4a3a2a');H.poly([[ft[0]-12,ft[1]-7],[ft[0]+13,ft[1]-7],[ft[0]+14,ft[1]],[ft[0]-12,ft[1]]],'#2a2018');});
 robe(H,cx,50,104,28,28,JK,by);H.poly([[cx-20,58+by],[cx+20,58+by],[cx+22,118],[cx-22,118]],LE);for(let y=64;y<116;y+=8)H.ln(cx-18,y+by,cx+18,y+by,1,H.dk(LE));
 if(two)for(let i=0;i<8;i++)H.rect(cx-20+i*6,114-(i%3)*4,3,3,i%2?'#ff8030':'#ffd060');
 // chains over the shoulders
 for(let i=0;i<6;i++){H.ell(cx-22+i*3,50+by+i*4,2,2,'#8a8a92',1);H.ell(cx+22-i*3,50+by+i*4,2,2,'#8a8a92',1);}
 // the mallet
 {const [x,y]=near[2];H.limb([[x,y+20],[x+10,y-40]],6,'#6a4a2a');H.poly([[x-6,y-62],[x+28,y-56],[x+26,y-36],[x-8,y-42]],'#7a5a38');H.ln(x-4,y-56,x+26,y-50,3,'#4a4e58');H.ln(x-6,y-44,x+24,y-38,3,'#4a4e58');}
 H.limb(far,18,JK);H.limb([far[1],far[2]],14,SK);HIP.hand(H,far[2][0],far[2][1],SK);H.limb(near,18,JK);H.limb([near[1],near[2]],14,SK);HIP.hand(H,near[2][0],near[2][1],SK);
 const hy=34+by;head(H,cx,hy,SK,{rx:13,ry:14});H.poly([[cx-13,hy+3],[cx+13,hy+3],[cx+10,hy+20],[cx,hy+24],[cx-10,hy+20]],'#2a1e16');H.ln(cx-10,hy-6,cx-2,hy-3,3,'#2a1e16');H.ln(cx+2,hy-3,cx+10,hy-6,3,'#2a1e16');for(const d of [-8,-2,5])H.rect(cx+d,hy-11,2,2,'#4a4040');});
CP('KANE','B','THE BELL WARDEN OF THE DEEP TEMPLE','A TEMPLE GUARD IN VERDIGRIS BRONZE SCALE ARMOUR WITH A BELL-SHAPED HELM AND MASK, SWINGING THE TEMPLE BELL-RAM (A CHAINED LOG). II: THE HELM CRACKS OPEN, RINGS OF SOUND POUR FROM IT.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q);
 const VG='#3e7a68',VG2='#5aa088',BR='#9a6a34',CL='#e8e4d8',DK='#1e2a28';
 HIP.legs(H,Q,cx,100,([hp,kn,ft])=>{H.limb([hp,kn],14,'#e8e4d8');H.limb([kn,[ft[0],ft[1]-6]],12,VG,VG2);H.poly([[ft[0]-9,ft[1]-6],[ft[0]+10,ft[1]-6],[ft[0]+11,ft[1]],[ft[0]-9,ft[1]]],DK);});
 robe(H,cx,48,102,22,24,VG,by);for(let y=56;y<100;y+=7)for(let x=-18;x<=18;x+=6)H.ell(cx+x+(y%14?3:0),y+by,3,2,VG2,0);H.rect(cx-22,88+by,44,6,CL);
 // the bell-ram: a log on chains held across the body
 H.limb([[far[2][0]-14,far[2][1]+2],[near[2][0]+30,near[2][1]-6]],12,'#7a5a38','#9a7a50');H.ln(near[2][0]+30,near[2][1]-12,near[2][0]+30,near[2][1],3,BR);
 H.limb(far,12,VG,VG2);HIP.hand(H,far[2][0],far[2][1],DK);H.limb(near,12,VG,VG2);HIP.hand(H,near[2][0],near[2][1],DK);
 const hy=30+by;H.poly([[cx-16,hy+14],[cx-14,hy-10],[cx,hy-18],[cx+14,hy-10],[cx+16,hy+14]],BR);H.ln(cx-16,hy+12,cx+16,hy+12,3,VG2);H.rect(cx-2,hy-24,4,6,BR);H.poly([[cx-10,hy-2],[cx+10,hy-2],[cx+8,hy+8],[cx-8,hy+8]],DK);H.rect(cx-7,hy+1,4,2,'#ffe080');H.rect(cx+3,hy+1,4,2,'#ffe080');
 if(two){H.ln(cx-4,hy-16,cx+2,hy+6,2,'#14101a');for(const r of [24,32])H.ell(cx,hy,r,r*.6,'rgba(0,0,0,0)',.5);H.g.strokeStyle='#e8f0d0';H.g.lineWidth=2;for(const r of [26,36]){H.g.beginPath();H.g.ellipse(cx,hy,r,r*.7,0,0,TAU);H.g.stroke();}}});

// ============ SUMI (XVIII, the ink archive) ============
CP('SUMI','A','THE ARCHIVIST','AN OLD, TALL CALLIGRAPHER IN A SCHOLAR\'S CAP, INK STAINING HIS ROBE FROM THE HEM UP, A SCROLL MANTLE TRAILING BEHIND, A GREAT BRUSH AS HIS SPEAR. II: THE INK RISES TO HIS COLLAR, HIS EYES TURN WHITE, THE BRUSH SPLITS IN TWO.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q);
 const WH='#e4e0d4',INK='#141218',GR='#6a6670',SK='#d4ae88',RD='#b02828';
 // the scroll mantle trailing behind
 H.poly([[cx-20,44+by],[cx+20,44+by],[cx+40,130],[cx+20,140],[cx-38,128]],'#e8dcc0');for(let i=0;i<5;i++)H.ln(cx-24+i*12,70+by+i*6,cx-20+i*12,96+by+i*6,3,INK);H.rect(cx+22,120,8,8,RD);
 HIP.legs(H,Q,cx,108,([hp,kn,ft])=>{H.poly([[ft[0]-8,ft[1]-5],[ft[0]+9,ft[1]-5],[ft[0]+10,ft[1]],[ft[0]-9,ft[1]]],INK);});
 robe(H,cx,48,140,18,30,WH,by);
 // ink rising from the hem
 const ih=two?56:110;H.fill([[cx-30,140],[cx+30,140],[cx+30-(140-ih)*.13,ih+by],[cx+10,ih+by+6],[cx-6,ih+by-4],[cx-30+(140-ih)*.13,ih+by]],INK);
 H.poly([[cx-18,48+by],[cx-6,48+by],[cx-8,96+by],[cx-20,96+by]],GR);H.poly([[cx+18,48+by],[cx+6,48+by],[cx+8,96+by],[cx+20,96+by]],GR);
 // the great brush (two in the second form)
 const brush=(x,y,dx)=>{H.limb([[x-dx*2,y+30],[x+dx,y-74]],5,'#8a6a40','#b08a58');H.poly([[x+dx-6,y-74],[x+dx+6,y-74],[x+dx+3,y-96],[x+dx,y-102],[x+dx-3,y-96]],INK);H.ln(x+dx-4,y-76,x+dx+4,y-76,3,RD);};
 brush(near[2][0],near[2][1],6);if(two)brush(far[2][0],far[2][1],-6);
 H.limb(far,12,WH);HIP.hand(H,far[2][0],far[2][1],two?INK:SK);H.limb(near,12,WH);HIP.hand(H,near[2][0],near[2][1],two?INK:SK);
 const hy=32+by;head(H,cx,hy,SK,{eye:two?'#ffffff':'#14101a'});H.limb([[cx-6,hy+6],[cx-12,hy+18]],2,'#e8e8e8');H.limb([[cx+6,hy+6],[cx+12,hy+18]],2,'#e8e8e8');H.poly([[cx-11,hy-8],[cx+11,hy-8],[cx+8,hy-24],[cx-8,hy-24]],INK);});
CP('SUMI','B','THE INK SHADOW','A LEAN SCRIBE-ASSASSIN WRAPPED IN LONG INK-BLACK SCARVES, A RED SEAL STAMPED ON HIS MASK, TWIN BRUSHES HELD LIKE KNIVES. II: HIS BODY RUNS HALF TO INK, THE SCARVES BECOME TENDRILS.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q,[[26,30],[18,38],[14,44]],[[46,30],[54,38],[58,44]]);
 const BK='#18161c',BK2='#2e2a34',RD='#c02828',SK='#c8a080',PP='#e8dcc0';
 for(const s of [-1,1])H.limb([[cx+s*6,50+by],[cx+s*28,70+by],[cx+s*40,96+by+(two?14:0)],[cx+s*46,120]],two?7:5,BK,BK2);
 HIP.legs(H,Q,cx,98,([hp,kn,ft])=>{H.limb([hp,kn],11,BK,BK2);H.limb([kn,[ft[0],ft[1]-6]],9,BK);H.poly([[ft[0]-8,ft[1]-5],[ft[0]+9,ft[1]-5],[ft[0]+10,ft[1]],[ft[0]-9,ft[1]]],BK);for(let t=.2;t<.95;t+=.25)H.ln(kn[0]+(ft[0]-kn[0])*t-4,kn[1]+(ft[1]-kn[1])*t,kn[0]+(ft[0]-kn[0])*t+4,kn[1]+(ft[1]-kn[1])*t,1.5,PP);});
 robe(H,cx,48,100,14,14,BK,by);H.ln(cx-14,64+by,cx+14,80+by,4,PP);H.ln(cx-14,90+by,cx+14,90+by,4,RD);
 if(two)for(const [x,y] of [[-12,100],[6,104],[14,96],[-4,110]])H.limb([[cx+x,y+by],[cx+x+1,y+by+16]],4,BK);
 const br=(A)=>{const [x,y]=A[2];H.limb([[x,y],[x+(A===near?14:-14),y-8]],3,'#8a6a40');H.ell(x+(A===near?17:-17),y-9,3,3,BK,1);};
 H.limb(far,10,BK,BK2);HIP.hand(H,far[2][0],far[2][1],BK2);br(far);H.limb(near,10,BK,BK2);HIP.hand(H,near[2][0],near[2][1],BK2);br(near);
 const hy=32+by;H.ell(cx,hy,12,14,BK);H.poly([[cx-11,hy-2],[cx+11,hy-2],[cx+9,hy+10],[cx-9,hy+10]],PP);H.rect(cx-5,hy+2,10,7,RD);H.rect(cx-3,hy+4,6,3,PP);H.rect(cx-8,hy-6,5,2,'#ffffff');H.rect(cx+3,hy-6,5,2,'#ffffff');
 if(two){H.poly([[cx,hy-14],[cx+12,hy-6],[cx+12,hy+12],[cx,hy+12]],BK);H.rect(cx+3,hy-6,5,2,RD);}});

// ============ MUKURO (XX, the Hollow Throne) ============
CP('MUKURO','A','THE HOLLOW EMPEROR','WHAT SITS ON THE TRUE THRONE: AN EMPTY SKULL UNDER THE TALL IMPERIAL CROWN, FADED GOLD-AND-VIOLET ROBES, A BONE SCEPTRE, ABYSS LIGHT IN THE EYES. II: THE ROBES FALL AWAY TO A HOLLOW CAGE OF LACQUERED ARMOUR WITH THE ABYSS GLOWING INSIDE.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q,[[23,31],[16,42],[18,52]],[[49,31],[56,40],[54,48]]);
 const RO='#4a3060',RO2='#6a4880',GD='#b89848',GD2='#e8d080',BN='#e8e0c8',BN2='#b8b098',AB='#c070ff',BK='#14101a';
 HIP.legs(H,Q,cx,108,([hp,kn,ft])=>{H.poly([[ft[0]-9,ft[1]-5],[ft[0]+10,ft[1]-5],[ft[0]+11,ft[1]],[ft[0]-9,ft[1]]],BK);});
 if(!two){robe(H,cx,48,142,24,40,RO,by);H.ln(cx-40,140,cx+40,140,4,GD);for(const s of [-1,1])H.ln(cx+s*6,50+by,cx+s*10,140,3,GD);for(const [x,y] of [[-24,90],[18,110],[-8,120]])H.ell(cx+x,y+by,4,4,GD,1);}
 else{H.poly([[cx-24,50+by],[cx+24,50+by],[cx+20,110+by],[cx-20,110+by]],'#2a1e30');H.ell(cx,80+by,12,16,AB,0);H.ell(cx,80+by,6,9,'#ffffff',0);
  for(let i=0;i<5;i++){const y=58+by+i*10;H.ln(cx-24+i,y,cx-6,y+4,4,GD);H.ln(cx+24-i,y,cx+6,y+4,4,GD);}H.poly([[cx-34,112+by],[cx+34,112+by],[cx+40,142],[cx-40,142]],RO);H.fill([[cx-34,124],[cx+34,124],[cx+38,142],[cx-38,142]],'#2a1e30');}
 // the bone sceptre
 {const [x,y]=near[2];H.limb([[x,y+10],[x+6,y-46]],5,BN,BN2);H.ell(x+6,y-50,5,5,BN);H.rect(x+5,y-51,2,2,AB);}
 H.limb(far,16,two?'#2a1e30':RO,RO2);HIP.hand(H,far[2][0],far[2][1],BN);H.limb(near,16,two?'#2a1e30':RO,RO2);HIP.hand(H,near[2][0],near[2][1],BN);
 // the skull and crown
 const hy=34+by;H.ell(cx,hy,12,13,BN);H.fill([[cx+5,hy-8],[cx+11,hy-2],[cx+10,hy+8],[cx+5,hy+4]],BN2);H.ell(cx-5,hy,3,3,BK,0);H.ell(cx+5,hy,3,3,BK,0);H.rect(cx-5,hy-1,2,2,AB);H.rect(cx+4,hy-1,2,2,AB);
 H.rect(cx-1,hy+4,2,3,BK);for(let x=-6;x<=6;x+=3)H.rect(cx+x,hy+9,2,3,BN2);
 H.poly([[cx-12,hy-8],[cx+12,hy-8],[cx+8,hy-30],[cx-8,hy-30]],BK);H.ln(cx-12,hy-9,cx+12,hy-9,3,GD);H.limb([[cx+6,hy-28],[cx+18,hy-40],[cx+26,hy-38]],3,BK);
 if(two)H.ln(cx-4,hy-28,cx+2,hy-12,2,GD2);});
CP('MUKURO','B','THE BONE GENERAL','A TOWERING SKELETAL WARLORD IN GREAT ARMOUR BUILT FROM BONES AND BLACK LACQUER, ANTLERED SKULL HELM, A HUGE BONE-HAFTED NAGINATA. II: THE RIBCAGE SPLITS AND ABYSS FIRE POURS OUT, THE JAW HANGS OPEN.',0,(H,Q)=>{const {by,two}=H,cx=72,[far,near]=ARMS(H,Q);
 const BN='#e0d8c0',BN2='#a8a088',BK='#1a1418',RD='#9a2020',AB='#b060ff';
 HIP.legs(H,Q,cx,102,([hp,kn,ft])=>{H.limb([hp,kn],8,BN,BN2);H.limb([kn,[ft[0],ft[1]-6]],6,BN,BN2);H.poly([[ft[0]-9,ft[1]-5],[ft[0]+10,ft[1]-5],[ft[0]+11,ft[1]],[ft[0]-9,ft[1]]],BK);});
 for(let i=-2;i<=2;i++){const x=cx+i*11;H.poly([[x-6,96+by],[x+6,96+by],[x+7+i,118+by],[x-7+i,118+by]],BK);H.ln(x-5,104+by,x+5,104+by,2,RD);H.ln(x-5,110+by,x+5,110+by,2,BN2);}
 H.poly([[cx-22,52+by],[cx+22,52+by],[cx+18,96+by],[cx-18,96+by]],BK);
 for(let i=0;i<5;i++){const y=58+by+i*7;H.ln(cx-16,y,cx-2,y+2,3,BN);H.ln(cx+16,y,cx+2,y+2,3,BN);}H.ln(cx,56+by,cx,92+by,3,BN2);
 if(two){H.ell(cx,74+by,8,14,AB,0);H.ell(cx,74+by,3,7,'#ffffff',0);for(const s of [-1,1])H.ln(cx+s*4,58+by,cx+s*14,48+by,2,AB);}
 for(const s of [-1,1]){const x=cx+s*26;H.poly([[x-10,46+by],[x+10,46+by],[x+12+s*4,72+by],[x-8+s*4,72+by]],BN);H.ln(x-9,56+by,x+11,56+by,2,BN2);H.ln(x-9,64+by,x+11,64+by,2,RD);}
 {const [x,y]=near[2];H.limb([[x-8,y+44],[x+14,y-60]],5,BN,BN2);H.poly([[x+12,y-58],[x+20,y-60],[x+34,y-96],[x+24,y-90]],'#c8ccd6');H.ln(x+12,y-58,x+20,y-60,3,RD);}
 H.limb(far,7,BN,BN2);HIP.hand(H,far[2][0],far[2][1],BN);H.limb(near,7,BN,BN2);HIP.hand(H,near[2][0],near[2][1],BN);
 const hy=32+by;H.ell(cx,hy,11,12,BN);H.ell(cx-5,hy,3,3,BK,0);H.ell(cx+5,hy,3,3,BK,0);H.rect(cx-5,hy-1,2,2,AB);H.rect(cx+4,hy-1,2,2,AB);for(let x=-5;x<=5;x+=3)H.rect(cx+x,hy+(two?12:8),2,3,BN2);
 H.poly([[cx-14,hy-4],[cx-12,hy-14],[cx+12,hy-14],[cx+14,hy-4]],BK);for(const s of [-1,1])H.limb([[cx+s*8,hy-14],[cx+s*20,hy-30],[cx+s*16,hy-44]],3,'#c8a048');});
