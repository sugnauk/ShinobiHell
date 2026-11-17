'use strict';
// ===== SCENERY: a story for every stage, and the stage dressed to match it and its boss =====
// - not every stage is a dungeon: forests are walled by bamboo, marshes by reeds, caves by rock, gardens by hedges...
// - back walls (with floor in front of them) stand tall; front walls are cut low so they never hide you
// - the ground beyond the walls is real terrain with its own scenery, fading into the dark, instead of a black void
// - every boss arena carries that boss's own seal instead of the old star
const SCN=[
 {short:'AKAGANE\'S WARBAND HAS CAMPED IN THE BAMBOO',tale:'THE MARCH BEGINS. AKAGANE, THE RED OX, HAS CAMPED HIS WARBAND IN THE BAMBOO AND BURNS THE VILLAGES THAT CANNOT PAY THE EMPEROR\'S TAX. BREAK HIM AND THE ROAD OPENS.',
  wall:'bamboo',gr:['#232c19','#27301c'],out:'forest',seal:'ox'},
 {short:'SOMEONE HUNTS IN THE FLOODED PADDIES',tale:'THE RICE MARSH GUARDS THE CASTLE FLANK. THE FARMERS FLED AND LEFT THEIR LANTERNS LIT TO KEEP THE REED HUNTER AWAY. HE STILL HUNTS IN THE REEDS.',
  wall:'reeds',gr:['#1c3634','#203b38'],out:'paddy',seal:'tiger'},
 {short:'THE SPIDER CLAN STRINGS ITS WIRES THROUGH THE SMUGGLERS\' TUNNELS',tale:'SMUGGLERS DUG THESE TUNNELS UNDER THE HILLS TO SNEAK RICE PAST THE EMPEROR\'S TAX MEN. NOW ITOHIME OF THE SPIDER CLAN HOLDS THEM, AND THE EARTH SPIDER SHE KEEPS SLEEPS BEHIND A LOCKED DOOR.',
  wall:'rock',gr:['#1a1324','#1e1628'],out:'cave',seal:'spider'},
 {short:'LADY HOTARU\'S LANTERNS BURN IN THE ASHES',tale:'LADY HOTARU SET THE TOWN AT THE CASTLE\'S FEET ALIGHT SO NO ONE COULD FLEE TO WARN US. HER FIREFLY LANTERNS STILL BURN AMONG THE ASHES.',
  wall:'ruin',gr:['#261612','#2a1914'],out:'ashes',seal:'lantern'},
 {short:'THE RONIN SEVEN HOLD THE PASS WAYSTATION',tale:'THE ONLY ROAD TO THE GATES CROSSES FROSTPEAK PASS. SEVEN MASTERLESS SWORDS HOLD ITS WAYSTATION FOR THE EMPEROR\'S GOLD. THEY FIGHT AS ONE.',
  wall:'snowrock',gr:['#b4c2d6','#bccade'],out:'snow',seal:'seven'},
 {short:'TETSUO\'S GUNS LINE THE RAMPARTS',tale:'THE OUTER WALLS BRISTLE WITH TETSUO THE GUNSMITH\'S CANNONS AND BALLISTAE. CROSS THE KILLING FIELD AND BREACH THE RAMPARTS WHILE THEY RELOAD.',
  wall:'rampart',gr:['#2e2c24','#322f27'],out:'field',seal:'gear'},
 {short:'A THOUSAND BELLS TOLL TO HIDE THE ABBOT\'S CURSES',tale:'THE ABBOT SOLD THE CASTLE SHRINE TO THE EMPEROR. A THOUSAND BELLS NOW TOLL TO DROWN OUT HIS CURSES. SILENCE THEM.',
  wall:'lacquer',gr:['#7e7666','#867e6e'],out:'gravel',seal:'bell'},
 {short:'ONIKUMA HOLDS THE KEYS TO THE CELLARS',tale:'THE EMPEROR\'S ENEMIES ROT IN THE IRON CELLARS UNDER THE KEEP. ONIKUMA, THE JAILER, HOLDS EVERY KEY. TAKE THEM.',
  wall:'brick',gr:['#121216','#15151a'],out:'pit',seal:'chain'},
 {short:'KAGE WAITS ON THE ROOFS OF THE KEEP',tale:'THE HALLS OF CRANE CASTLE ARE DARK. KAGE, MASTER OF THE SHINOBI, WAITS ON THE ROOFS ABOVE. KEEP THE TORCHES LIT.',
  wall:'shoji',gr:['#343b47','#39414e'],out:'roofs',seal:'shuriken'},
 {short:'A MASKED ILLUSIONIST HAUNTS THE CHERRY TREES',tale:'THE EMPEROR\'S PRIVATE GARDENS BLOOM OUT OF SEASON. TAMAMO, HIS COURT ILLUSIONIST, WEAVES TRICKS AMONG THE CHERRY TREES. TRUST NOTHING.',
  wall:'hedge',gr:['#33502a','#37552c'],out:'garden',seal:'tails'},
 {short:'THE BLACK HORSE GENERAL GUARDS THE LAST COURT',tale:'THE JADE PALACE. LORD KUROGANE, THE BLACK HORSE GENERAL, GUARDS THE LAST COURT BEFORE THE THRONE WITH HIS STANDARD-BEARERS.',
  wall:'palace',gr:['#6a7a7a','#728282'],out:'court',seal:'tomoe'},
 {short:'THE EMPEROR AWAITS. END THIS',tale:'THE THRONE ROOM. THE CORRUPT EMPEROR SITS AMONG HIS LAST GUARDS. EVERYTHING YOU HAVE LEARNED HAS LED HERE. END THIS.',
  wall:'throne',gr:['#170a0e','#1c0c11'],out:'hall',seal:'chrys'}];
DUN.forEach((d,i)=>{const s=SCN[i];if(s){d.story=s.short;d.tale=s.tale;d.scn=s;}});
const scn=()=>(map&&!map.train&&DUN[R?R.di:0]&&DUN[R.di].scn)||null;

// ---------- small pixel painters (g = a 2d context) ----------
const SP=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x|0,y|0,w||1,h||1);};
function sEll(g,cx,cy,rx,ry,c,cl,cd){ // a lit ellipse: light upper-left, dark lower edge
 for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y/(ry+.5))**2)));if(w<=0)continue;SP(g,c,cx-w,cy+y,w*2+1,1);
  if(cd&&y>ry*.35)SP(g,cd,cx-w,cy+y,w*2+1,1);if(cl&&y<-ry*.3)SP(g,cl,cx-w+1,cy+y,Math.max(1,w),1);}}
function sBamboo(g,x,gy,h,h0){ // one stalk, nodes and a leaf spray at the top
 const L='#7aa84a',D='#4e7a2a';SP(g,D,x,gy-h,2,h);SP(g,L,x,gy-h,1,h);
 for(let y=gy-4-((h0*5)|0);y>gy-h;y-=6)SP(g,'#2e4a1e',x,y,2,1);
 const lv=['#3e6a2a','#5a8a3a','#2e5220'];for(let i=0;i<4;i++){const ly=gy-h+2+i*3,d=i%2?1:-1;for(let k=1;k<5;k++)SP(g,lv[(i+k)%3],x+d*k,ly+(k>>1),1,1);}}
function sClump(g,gx,gy,n,hmax,seed){for(let i=0;i<n;i++){const r=hash(seed*31+i,i*7+5);sBamboo(g,gx-7+((i*14/n)|0)+((r*3)|0),gy+((r*3)|0)-1,Math.round(hmax*(.55+.45*r)),r);}}
function sRock(g,gx,gy,w,h,base,cap){const B=shade(base,0),L=shade(base,.25),D=shade(base,-.35);
 sEll(g,gx,gy-h/2,w,h/2,B,L,D);SP(g,shade(base,-.55),gx-w+1,gy,w*2-1,1);if(cap)sEll(g,gx,gy-h+1,Math.max(2,w-2),Math.max(1,h/4|0),cap,'#ffffff');}
function sBush(g,gx,gy,r,c){const L=shade(c,.22),D=shade(c,-.3);sEll(g,gx-r*.6|0,gy-r*.7|0,r*.7|0,r*.6|0,c,L,D);sEll(g,gx+r*.5|0,gy-r*.6|0,r*.6|0,r*.55|0,c,L,D);sEll(g,gx,gy-r|0,r*.7|0,r*.6|0,c,L,D);}
function sPine(g,gx,gy,h,c,snow){SP(g,'#3a2418',gx,gy-3,2,3);for(let i=0;i<3;i++){const y0=gy-3-i*(h/3.4),w=Math.round((3-i)*h/7);for(let k=0;k<h/3;k++){const ww=Math.round(w*k/(h/3));SP(g,k<2?shade(c,.2):c,gx+1-ww,y0-h/3+k,ww*2,1);}
  if(snow)SP(g,'#eef4fb',gx+1-w/2,y0-h/3+1,w,1);}}
function sTree(g,gx,gy,h,c,trunk){SP(g,trunk||'#4a2e1e',gx-1,gy-h*.45,3,h*.45);SP(g,shade(trunk||'#4a2e1e',.2),gx-1,gy-h*.45,1,h*.45);sBush(g,gx,gy-h*.42,h*.38,c);
 for(let i=0;i<5;i++)SP(g,shade(c,.35),gx-4+((hash(gx+i,gy)*9)|0),gy-h*.8+((hash(gy,gx+i)*8)|0),1,1);}
function sReeds(g,gx,gy,n,h,seed){for(let i=0;i<n;i++){const r=hash(seed+i*3,i),x=gx-6+((i*12/n)|0)+((r*2)|0),hh=Math.round(h*(.6+.4*r));SP(g,i%2?'#6a8a3a':'#5a7a2a',x,gy-hh,1,hh);if(r>.5){SP(g,'#6a3a1a',x,gy-hh-2,1,3);}else SP(g,'#8aa84a',x+1,gy-hh+1,1,1);}}
function sCrystal(g,gx,gy,h,c){const L=shade(c,.45);for(let k=0;k<h;k++){const w=Math.max(0,Math.round(2.4*(1-Math.abs(k-h*.35)/(h*.65))));SP(g,c,gx-w,gy-k,w*2+1,1);if(w>0)SP(g,L,gx-w,gy-k,1,1);}}
function sStalag(g,gx,gy,h,c){for(let k=0;k<h;k++){const w=Math.round(4*(1-k/h));SP(g,k<h*.3?shade(c,-.25):c,gx-w,gy-k,w*2+1,1);SP(g,shade(c,.2),gx-w,gy-k,1,1);}}
function sToro(g,gx,gy){const s='#8a8a82',d='#5a5a54';SP(g,d,gx-3,gy-2,7,2);SP(g,s,gx-1,gy-8,3,6);SP(g,s,gx-3,gy-11,7,3);SP(g,'#ffd070',gx-1,gy-10,3,1);SP(g,d,gx-4,gy-13,9,2);SP(g,s,gx-1,gy-15,3,2);}
function sPost(g,x,gy,h,c){SP(g,c,x,gy-h,2,h);SP(g,shade(c,.25),x,gy-h,1,h);}
function sBanner(g,gx,gy,c){sPost(g,gx,gy,16,'#3a2418');SP(g,c,gx+2,gy-15,4,9);SP(g,shade(c,-.3),gx+2,gy-7,4,1);SP(g,'#e0b040',gx+3,gy-12,2,2);}
function sEmber(g,x,y){SP(g,'#ff6020',x,y,1,1);if(hash(x,y)>.6)SP(g,'#ffc040',x,y-1,1,1);}
function sPillar(g,gx,gy,h,c,trim){SP(g,shade(c,-.3),gx-3,gy-h,6,h);SP(g,c,gx-3,gy-h,4,h);SP(g,shade(c,.25),gx-2,gy-h,1,h);SP(g,trim,gx-4,gy-h-1,8,2);SP(g,trim,gx-4,gy-2,8,2);}

// ---------- the ground beyond the walls ----------
function paintOutside(F,th,S){
 const g=F.getContext('2d'),dist=new Uint8Array(MW*MH).fill(255),q=[];
 for(let i=0;i<MW*MH;i++)if(map.t[i]){dist[i]=0;q.push(i);}
 for(let h=0;h<q.length;h++){const i=q[h],d=dist[i];if(d>=12)continue;const x=i%MW,y=(i/MW)|0;
  for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const xx=x+k,yy=y+j;if(xx<0||yy<0||xx>=MW||yy>=MH)continue;const n=yy*MW+xx;if(dist[n]>d+1){dist[n]=d+1;q.push(n);}}}
 const L=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(map.t[i]||dist[i]>12)continue;const [tu,tv]=tileR(x,y);L.push([tu+tv,tu,tv,x,y,dist[i]]);}
 L.sort((a,b)=>a[0]-b[0]);
 // a tile is "in front" if floor lies just behind it on screen: only low scenery there, so nothing hides the play area
 const front=(tu,tv)=>{for(let a=0;a<=5;a++)for(let b=0;b<=5;b++)if((a||b)&&floorAtR(tu-a,tv-b))return true;return false;};
 for(const [,tu,tv,x,y,d] of L){
  const X=(tu-tv+RMH)*16,Y=(tu+tv)*HY,ci=(x+y)&1,h=hash(x*7+3,y*11+5),h2=hash(x+91,y+17);
  for(let j=0;j<TILEH;j++){const half=dHalf(j);SP(g,S.gr[ci],X-half,Y+j,half*2,1);}
  const gx=X+((h*9)|0)-4,gy=Y+HY+((h2*5)|0)-2,fr=d<=1||front(tu,tv),far=d>1;
  outsideDeco(g,S.out,X,Y,gx,gy,h,h2,fr,far,x,y);
  // fade into the dark the farther it is from the play area
  const f=Math.min(.92,Math.max(0,(d-2)/9));if(f>0){g.fillStyle='rgba(7,6,10,'+f.toFixed(2)+')';for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillRect(X-half,Y+j,half*2,1);}}
 }
}
function outsideDeco(g,k,X,Y,gx,gy,h,h2,fr,far,x,y){
 const tall=!fr&&far;
 switch(k){
  case 'forest': // bamboo groves behind, ferns, stones and fallen leaves in front, a war-camp banner here and there
   if(h<.4)SP(g,'#3a4a24',gx-2,gy,5,1);if(h2>.85)SP(g,pick(['#a07020','#806020','#c09030']),gx+3,gy-2,2,1);
   if(tall){if(h<.55)sClump(g,X,Y+HY+3,3+((h2*3)|0),18+((h*14)|0),x*13+y);else if(h<.62)sBanner(g,gx,gy,'#a02020');else if(h<.75)sRock(g,gx,gy,5,5,'#5a5a4a');}
   else if(h<.25)sBush(g,gx,gy,4,'#2e5220');else if(h<.32)sRock(g,gx,gy,4,3,'#5a5a4a');break;
  case 'paddy': // flooded rice paddies: water, rows of seedlings, earth dikes, reeds
   {SP(g,'#24484a',X-8,Y+8,16,1);if((x+y)%3===0)for(let i=0;i<4;i++)SP(g,'#5a8a3a',X-6+i*4,Y+6+((i*3)%5),1,2);
    if(x%6===0){for(let j=0;j<TILEH;j+=2)SP(g,'#3a3424',X-1,Y+j,3,1);}
    if(tall&&h<.4)sReeds(g,gx,gy,5,10+((h2*8)|0),x*7+y);else if(tall&&h<.47)sTree(g,gx,gy,18,'#3e5e2a','#3a2a1a');else if(h<.15)sReeds(g,gx,gy,3,6,x+y);}break;
  case 'cave':
   if(h<.3)SP(g,'#2a2036',gx-3,gy,6,1);
   if(tall){if(h<.35)sStalag(g,gx,gy,10+((h2*12)|0),'#3a2a4a');else if(h<.5)sCrystal(g,gx,gy,7+((h2*7)|0),'#b060e0');else if(h<.55)sCrystal(g,gx,gy,5,'#60c0e0');}
   else if(h<.18)sRock(g,gx,gy,3,3,'#3a2a4a');else if(h<.24)sCrystal(g,gx,gy,4,'#a050d0');break;
  case 'ashes': // the burnt town: charred frames, rubble, embers, a lantern still glowing
   if(h<.4)SP(g,'#1a0e0a',gx-3,gy,7,2);if(h2<.25)sEmber(g,gx+2,gy-1);
   if(tall){if(h<.3){sPost(g,gx-5,gy,14+((h2*6)|0),'#2a1a12');sPost(g,gx+4,gy,10+((h2*8)|0),'#2a1a12');SP(g,'#2a1a12',gx-6,gy-14,12,2);sEmber(g,gx-4,gy-15);sEmber(g,gx+3,gy-9);}
    else if(h<.42)sRock(g,gx,gy,5,4,'#3a2a22');else if(h<.46){SP(g,'#3a2418',gx,gy-8,1,8);SP(g,'#e04020',gx-2,gy-12,5,5);SP(g,'#ffc060',gx-1,gy-11,3,3);}}
   else if(h<.2)sRock(g,gx,gy,3,2,'#3a2a22');break;
  case 'snow':
   if(h<.3)SP(g,'#e8f0fa',gx-2,gy,4,1);if(h2<.2)SP(g,'#9aaac0',gx,gy+1,3,1);
   if(tall){if(h<.4)sPine(g,gx,gy,14+((h2*12)|0),'#2a4a3a',true);else if(h<.55)sRock(g,gx,gy,5,5,'#6a7a8a','#eef4fb');}
   else if(h<.2)sRock(g,gx,gy,4,3,'#6a7a8a','#eef4fb');break;
  case 'field': // the killing field before the ramparts: mud, stakes, spent arrows, broken carts
   if(h<.3)SP(g,'#24221c',gx-3,gy,6,1);if(h2<.12){SP(g,'#8a7a5a',gx,gy-4,1,4);SP(g,'#d0d0c0',gx,gy-5,1,1);}
   if(tall){if(h<.3){for(let i=0;i<3;i++){const sx2=gx-5+i*4;for(let k=0;k<6;k++)SP(g,'#5a3e24',sx2+(k>>1),gy-k,1,1);}SP(g,'#3a2a18',gx-6,gy-2,13,1);}
    else if(h<.36)sBanner(g,gx,gy,'#303038');else if(h<.48)sRock(g,gx,gy,5,4,'#4a4840');}
   else if(h<.15)sRock(g,gx,gy,3,2,'#4a4840');break;
  case 'gravel': // raked gravel, moss stones, maples and stone lanterns
   for(let i=1;i<4;i++)isoLn(g,'#6e6656',X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);if(h2<.2)SP(g,pick(['#e07020','#c03020']),gx,gy,2,1);
   if(tall){if(h<.25)sTree(g,gx,gy,22+((h2*8)|0),pick(['#c03020','#e05a20','#d04020']));else if(h<.33)sToro(g,gx,gy);else if(h<.42)sRock(g,gx,gy,5,4,'#6a6a62','#4a6a3a');}
   else if(h<.12)sRock(g,gx,gy,4,3,'#6a6a62','#4a6a3a');break;
  case 'pit': // the cellars: bare stone, puddles, bones, rusted chains
   if(h<.3)SP(g,'#0a0a0e',gx-3,gy,7,2);if(h2<.08){SP(g,'#c8c0b0',gx-2,gy,4,1);SP(g,'#c8c0b0',gx-1,gy-1,1,1);}
   if(tall){if(h<.25)sPillar(g,gx,gy,16,'#3a3a44','#24242a');else if(h<.33){for(let k=0;k<12;k+=2)SP(g,'#5a5048',gx,gy-14+k,2,1);}}break;
  case 'roofs': // the castle roofs: rows of grey tiles, ridges, a gold shachihoko on the ridge ends
   {for(let i=0;i<5;i++)isoLn(g,'#262c36',X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);if(h2<.1)SP(g,'#5a6474',gx,gy,2,1);
    if(tall&&h<.12){SP(g,'#1e242c',gx-6,gy-3,13,3);SP(g,'#e0b040',gx-6,gy-6,2,3);SP(g,'#e0b040',gx+5,gy-6,2,3);}}break;
  case 'garden': // flowers, stepping stones, cherry trees and lanterns
   if(h<.35)SP(g,'#2a4422',gx-2,gy,4,1);if(h2<.15)SP(g,pick(['#f0a0c0','#ffffff','#f0d060']),gx,gy,1,1);
   if(tall){if(h<.3)sTree(g,gx,gy,22+((h2*8)|0),pick(['#f0a0c0','#f8c0d8','#e890b0']),'#5a3a2e');else if(h<.36)sToro(g,gx,gy);else if(h<.44)sBush(g,gx,gy,5,'#2e5a2a');}
   else if(h<.14)sBush(g,gx,gy,3,'#2e5a2a');else if(h<.2)SP(g,'#8a8a82',gx-2,gy,5,2);break;
  case 'court': // palace courtyard: pavers, bonsai pines, red pillars
   isoLn(g,'#5a6a6a',X-16,Y+HY,8,1);if(h2<.1)SP(g,'#e0b040',gx,gy,1,1);
   if(tall){if(h<.2)sPillar(g,gx,gy,22,'#a02018','#e0b040');else if(h<.32)sPine(g,gx,gy,12,'#2a5a3a');}
   else if(h<.12){SP(g,'#5a5a54',gx-3,gy-2,7,2);sPine(g,gx-1,gy-2,7,'#2a5a3a');}break;
  case 'hall': // the throne hall: black lacquer, gold inlay, red pillars and braziers
   if((x+y)%4===0)isoLn(g,'#3a2a10',X-16,Y+HY,8,1);if(h2<.06)SP(g,'#e0b040',gx,gy,2,1);
   if(tall){if(h<.22)sPillar(g,gx,gy,26,'#7a1018','#e0b040');else if(h<.27){SP(g,'#3a3a3a',gx-3,gy-6,7,6);SP(g,'#e04020',gx-2,gy-9,5,3);SP(g,'#ffc060',gx-1,gy-10,3,2);}}break;
 }
}

// ---------- the walls ----------
const WSPR={};
const isWallR=(tu,tv)=>{const [x,y]=tileW(tu,tv);return x>=0&&y>=0&&x<MW&&y<MH&&!map.t[y*MW+x]&&map.vis[y*MW+x];};
const SBY=52,SW2=48,SH2=SBY+TILEH+2; // sprite: the tile's ground diamond starts at row SBY, centred on column 24
function wallSprite(st,faces,tall,v){const key=st+faces+'_'+tall+'_'+v;if(WSPR[key])return WSPR[key];
 return WSPR[key]=mk(SW2,SH2,g=>paintWall(g,st,faces,tall,v));}
function block(g,faces,h,top,fl,fr,fn){ // a raised block: top diamond lifted by h, faces where nothing stands in front
 const by=SBY-h,faceY=x=>HY+Math.floor((x<16?x:31-x)*ISOK);
 for(let x=0;x<32;x++){const left=x<16;if(!(left?faces&1:faces&2))continue;const j=faceY(x);for(let k=1;k<=h;k++)SP(g,(left?fl:fr)(x,k,h),8+x,by+j+k,1,1);}
 for(let j=0;j<TILEH;j++){const half=dHalf(j);for(let x=16-half;x<16+half;x++)SP(g,top(x,j),8+x,by+j,1,1);}
 if(fn)fn(by,faceY);}
function roofCap(g,by,a,b,ridge){ // glazed roof tiles on top, a dark eave and a ridge line
 for(let j=0;j<TILEH;j++){const half=dHalf(j);for(let x=16-half;x<16+half;x++)SP(g,((x>>1)+j)%3===0?a:b,8+x,by+j,1,1);SP(g,shade(b,-.4),8+16-half,by+j,1,1);SP(g,shade(b,-.4),8+16+half-1,by+j,1,1);}
 SP(g,ridge,8+12,by+HY-1,8,2);}
function paintWall(g,st,faces,tall,v){
 const GY=SBY+HY; // ground point (tile centre)
 const r=k=>hash(v*13+k,k*7+v);
 switch(st){
  case 'bamboo':if(tall){sBush(g,24,GY+2,7,'#2a4a1e');sClump(g,24,GY+3,4+(v%2),22+((r(1)*10)|0),v*17);if(v===3)sRock(g,30,GY+4,5,5,'#5a5a4a','#3e6a2a');}
   else{sBush(g,22,GY+3,6,'#2e5220');sBush(g,28,GY+4,4,'#3a6228');if(v%2)sRock(g,18,GY+5,4,3,'#5a5a4a');}break;
  case 'reeds':sEll(g,24,GY+3,13,4,'#3a3424','#4a4430','#2a2418');if(tall){sReeds(g,24,GY+2,9,14+((r(2)*8)|0),v*5);if(v===2)sTree(g,26,GY+2,26,'#3e5e2a','#3a2a1a');}
   else sReeds(g,24,GY+3,6,7,v*5);break;
  case 'rock':{const hh=tall?14+((r(3)*8)|0):7;sRock(g,24,GY+4,12,hh,'#3a2a4a');sRock(g,18+v*3,GY+5,6,hh*.6|0,'#44325a');
   if(tall&&v%2===0)sCrystal(g,20+v*3,GY-hh+6,7,'#b060e0');if(tall&&v===1){for(let i=0;i<7;i++)SP(g,'#d8d0e0',18+i*2,GY-hh+3+(i%2),1,1);}}break;
  case 'snowrock':{const hh=tall?12+((r(3)*6)|0):6;sRock(g,24,GY+4,12,hh,'#6a7a8a','#eef4fb');if(tall&&v===2)sPine(g,30,GY+2,22,'#2a4a3a',true);
   if(!tall)sEll(g,24,GY+3,12,3,'#eef4fb','#ffffff','#c8d8ea');}break;
  case 'hedge':block(g,faces,tall?12:6,(x,j)=>hash(x*3+v,j*5)<.7?'#3a6a2e':'#4a7a34',(x,k)=>hash(x+v,k)<.6?'#2e5a26':'#264e20',(x,k)=>hash(x+v,k)<.6?'#22441c':'#1c3a18',
   (by)=>{for(let i=0;i<8;i++){const fx=10+((hash(v*5+i,i)*26)|0),fy=by+4+((hash(i,v*3)*14)|0);SP(g,i%3?'#f0a0c0':'#ffffff',fx,fy,1,1);}});break;
  case 'ruin':{const h=tall?16:5;block(g,faces,h,(x,j)=>hash(x+v*3,j)<.2?'#3a2418':'#2a1a12',(x,k,H)=>(x%8===0)?'#1a0e0a':k<H*.5?'#8a7a64':'#5a3e2a',(x,k,H)=>(x%8===0)?'#140a08':k<H*.5?'#6a5a48':'#44301e',
   (by,fy)=>{if(tall){for(let x=0;x<32;x+=3){const cut=(hash(x>>2,v)*6)|0;SP(g,'#07060a',8+x,by-1,3,cut);}for(let i=0;i<3;i++)sEmber(g,10+((hash(i,v)*28)|0),by+((hash(v,i)*8)|0));}});}break;
  case 'rampart':{const h=tall?18:6;block(g,faces,h,(x,j)=>((x>>2)+(j>>1))%2?'#6a6a72':'#5e5e66',(x,k,H)=>((k%5===0)||((x+(((k/5)|0)%2)*4)%8===0))?'#3a3a42':'#7a7a84',(x,k,H)=>((k%5===0)||((x+(((k/5)|0)%2)*4)%8===0))?'#2a2a30':'#55555e',
   (by,fy)=>{if(tall)for(let x=0;x<32;x+=8){const j=fy(x+2);SP(g,'#7a7a84',8+x,by+j-4,4,4);SP(g,'#9a9aa6',8+x,by+j-4,4,1);}});}break;
  case 'brick':{const h=tall?18:6;block(g,faces,h,(x,j)=>'#24242a',(x,k)=>((k%4===0)||((x+(((k/4)|0)%2)*3)%6===0))?'#1a1a1e':'#3e3a40',(x,k)=>((k%4===0)||((x+(((k/4)|0)%2)*3)%6===0))?'#121216':'#2c2a30',
   (by,fy)=>{if(tall&&v===1)for(let x=4;x<14;x+=3){const j=fy(x);SP(g,'#6a6058',8+x,by+j+4,1,h-6);}if(tall&&v===2){for(let k=0;k<10;k+=2)SP(g,'#5a5048',8+24,by+fy(24)+3+k,2,1);}});}break;
  case 'lacquer':{const h=tall?16:5;block(g,faces,h,()=>'#3a4a40',(x,k,H)=>k<=2?'#e8e0c8':x%8===0?'#2a1010':'#a01c18',(x,k,H)=>k<=2?'#c4bca4':x%8===0?'#1a0a0a':'#701210',
   (by)=>roofCap(g,by,'#2e4a40','#4a6a5a','#1e2e28'));}break;
  case 'shoji':{const h=tall?16:5;block(g,faces,h,()=>'#4a5260',(x,k,H)=>(x%5===0||k===1||k===(H>>1))?'#3a2418':'#e8e0c8',(x,k,H)=>(x%5===0||k===1||k===(H>>1))?'#2a1810':'#c4bca4',
   (by)=>roofCap(g,by,'#2a3038','#4a5260','#1a1e24'));}break;
  case 'palace':{const h=tall?16:5;block(g,faces,h,()=>'#b08a34',(x,k,H)=>x%8===0?'#a02018':k<=2?'#b02018':'#e8e4dc',(x,k,H)=>x%8===0?'#701210':k<=2?'#801810':'#b8b4ac',
   (by)=>roofCap(g,by,'#8a6420','#b08a34','#e0b040'));}break;
  case 'throne':{const h=tall?18:5;block(g,faces,h,()=>'#1a1014',(x,k,H)=>x%8===0?'#e0b040':k===2||k===H-1?'#c09030':'#1e1216',(x,k,H)=>x%8===0?'#a07020':k===2||k===H-1?'#806020':'#140a0e',
   (by,fy)=>{roofCap(g,by,'#1a1418','#3a2a2e','#e0b040');if(tall&&v===2)for(let x=18;x<26;x++){const j=fy(x);SP(g,'#8a1018',8+x,by+j+3,1,h-5);}});}break;
  default:block(g,faces,tall?12:5,()=>'#555',()=>'#444',()=>'#333');
 }}
{const _rm=renderMap;renderMap=function(th){const M=_rm.apply(this,arguments);const S=scn();if(!S)return M;for(const k in WSPR)delete WSPR[k];try{paintOutside(M.floor,th,S);}catch(e){console.error(e);}return M;};}
// walls: the renderer draws a prebuilt list (sceneTiles); here each entry gets this stage's sprite, placed so the default
// drawWall (which draws at x-16, y-WH) puts it right
{const _st=sceneTiles;sceneTiles=function(M){if(M.scene)return M.scene;const sc=_st(M),S=scn();if(!S)return sc;const walls=[];
 for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const i=ty*MW+tx;if(map.t[i]||!map.vis[i])continue;
  const [tu,tv]=tileR(tx,ty),row=tu+tv,faces=(isWallR(tu,tv+1)?0:1)|(isWallR(tu+1,tv)?0:2),
   tall=(map.cover&&map.cover[i])||!(floorAtR(tu-1,tv)||floorAtR(tu,tv-1)||floorAtR(tu-1,tv-1))?1:0, // cover in a room always stands at full height
   v=(hash(tx*3+1,ty*5+2)*4)|0,X=(tu-tv+RMH)*T,Y=row*HY;
  (walls[row]??=[]).push({wall:true,d:(row+1)*T,x:X-24+16,y:Y-SBY+WH,sprite:wallSprite(S.wall,faces,tall,v)});}
 return M.scene={walls,liquids:sc.liquids};};}

// ---------- the boss's seal on the arena floor ----------
function wl(x1,y1,x2,y2,c){sline(sx(x1,y1),sy(x1,y1),sx(x2,y2),sy(x2,y2),c);}
function wArc(cx,cy,r,a0,a1,c){const n=Math.max(6,Math.abs(a1-a0)*r*1.5|0);for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,b=a0+(a1-a0)*(i+1)/n;wl(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(b)*r,cy+Math.sin(b)*r,c);}}
function drawSeal(k,cx,cy,R0,c,t){
 const P2=(a,r)=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];
 switch(k){
  case 'ox': // a horned crest over crossed spears
   wArc(cx,cy-R0*.05,R0*.5,Math.PI*1.05,Math.PI*1.45,c);wArc(cx,cy-R0*.05,R0*.5,-Math.PI*.45,-Math.PI*.05,c);
   wcirc(cx,cy,R0*.28,c);wl(...P2(Math.PI*.75,R0*.8),...P2(-Math.PI*.25,R0*.8),c);wl(...P2(Math.PI*.25,R0*.8),...P2(Math.PI*1.25,R0*.8),c);break;
  case 'tiger': // three sickle slashes
   for(let i=-1;i<=1;i++){const o=i*R0*.22;wl(cx-R0*.55+o,cy-R0*.6,cx+R0*.45+o,cy+R0*.6,c);wl(cx-R0*.5+o,cy-R0*.6,cx+R0*.5+o,cy+R0*.6,c);}wcirc(cx,cy,R0*.85,c);break;
  case 'spider': // a web: eight spokes and three rings of threads
   for(let i=0;i<8;i++)wl(cx,cy,...P2(i/8*TAU,R0*.9),c);for(const f of [.3,.55,.8])for(let i=0;i<8;i++)wl(...P2(i/8*TAU,R0*f),...P2((i+1)/8*TAU,R0*f*.92),c);break;
  case 'lantern': // a ring of firefly lanterns around a flame
   for(let i=0;i<8;i++){const [x,y]=P2(i/8*TAU+t*.2,R0*.7);wcirc(x,y,R0*.09,c);}wArc(cx,cy,R0*.25,Math.PI*.1,Math.PI*.9,c);wl(cx-R0*.25,cy,cx,cy-R0*.45,c);wl(cx+R0*.25,cy,cx,cy-R0*.45,c);break;
  case 'seven': // seven swords pointing in
   for(let i=0;i<7;i++){const a=i/7*TAU+t*.1;wl(...P2(a,R0*.9),...P2(a,R0*.3),c);wl(...P2(a-.08,R0*.78),...P2(a+.08,R0*.78),c);}wcirc(cx,cy,R0*.22,c);break;
  case 'gear': // a cog and a gunsight
   for(let i=0;i<12;i++){const a=i/12*TAU+t*.1;wl(...P2(a-.1,R0*.62),...P2(a-.1,R0*.75),c);wl(...P2(a-.1,R0*.75),...P2(a+.1,R0*.75),c);wl(...P2(a+.1,R0*.75),...P2(a+.1,R0*.62),c);}
   wcirc(cx,cy,R0*.62,c);wl(cx-R0*.4,cy,cx+R0*.4,cy,c);wl(cx,cy-R0*.4,cx,cy+R0*.4,c);wcirc(cx,cy,R0*.18,c);break;
  case 'bell': // a temple bell inside rings of sound
   wArc(cx,cy-R0*.1,R0*.22,Math.PI,TAU,c);wl(cx-R0*.22,cy-R0*.1,cx-R0*.3,cy+R0*.3,c);wl(cx+R0*.22,cy-R0*.1,cx+R0*.3,cy+R0*.3,c);wl(cx-R0*.34,cy+R0*.3,cx+R0*.34,cy+R0*.3,c);
   for(const f of [.5,.65,.8])wcirc(cx,cy,R0*(f+.04*Math.sin(t*2+f*9)),c);break;
  case 'chain': // a ring of chain links around prison bars
   for(let i=0;i<14;i++){const [x,y]=P2(i/14*TAU-t*.15,R0*.82);wcirc(x,y,R0*.07,c);}for(let i=-2;i<=2;i++)wl(cx+i*R0*.15,cy-R0*.45,cx+i*R0*.15,cy+R0*.45,c);wl(cx-R0*.35,cy-R0*.45,cx+R0*.35,cy-R0*.45,c);wl(cx-R0*.35,cy+R0*.45,cx+R0*.35,cy+R0*.45,c);break;
  case 'shuriken': // a four-point star blade
   for(let i=0;i<4;i++){const a=i/4*TAU+t*.4;wl(...P2(a,R0*.75),...P2(a+TAU/8,R0*.2),c);wl(...P2(a,R0*.75),...P2(a-TAU/8,R0*.2),c);}wcirc(cx,cy,R0*.12,c);break;
  case 'tails': // nine swirling tails
   for(let i=0;i<9;i++){const a=i/9*TAU+t*.2;for(let s=0;s<6;s++){const r1=R0*(.2+s*.11),r2=R0*(.2+(s+1)*.11);wl(...P2(a+s*.14,r1),...P2(a+(s+1)*.14,r2),c);}}break;
  case 'tomoe': // three commas, the war crest of the black horse general
   for(let i=0;i<3;i++){const a=i/3*TAU+t*.3,[hx,hy]=P2(a,R0*.3);wcirc(hx,hy,R0*.14,c);wArc(cx,cy,R0*.44,a,a+TAU/3*.9,c);}wcirc(cx,cy,R0*.62,c);break;
  case 'chrys': // the sixteen-petal chrysanthemum of the throne
   for(let i=0;i<16;i++){const a=i/16*TAU,b=(i+1)/16*TAU;wl(...P2(a,R0*.18),...P2(a+.05,R0*.7),c);wArc(cx,cy,R0*.7,a+.05,b-.0,c);}wcirc(cx,cy,R0*.18,c);break;
 }}
{const _da=drawArena;drawArena=function(){const S=scn();if(!S||!map.bossRoom)return _da();
 const br=map.bossRoom,cx=(br.x+br.w/2)*T,cy=(br.y+br.h/2)*T,X=sx(cx,cy),Y=sy(cx,cy);if(X<-220||X>W+220||Y<-140||Y>H+140)return;
 const live=boss&&boss.awake&&!boss.dead,c=live?'#ff4040':map.env.lc[2],R0=br.w*T*.36;
 ctx.globalAlpha=live?.55:.3;wcirc(cx,cy,R0,c);wcirc(cx,cy,R0-4,c);
 for(let i=0;i<12;i++){const a=i/12*TAU+time*.15,rr=R0-2,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;ctx.fillStyle=c;ctx.fillRect(sx(x,y)-1,sy(x,y)-1,3,3);}
 drawSeal(S.seal,cx,cy,R0-6,c,time);ctx.globalAlpha=1;};}

// ---------- range: nothing you fire reaches past the screen, and long-range shots fly 15% less far ----------
const PRANGE=170; // world units: about the edge of the visible screen around you
{const _mp=mkProj;mkProj=function(from,x,y,a,sp,dmg,o){const p=_mp.apply(this,arguments);
 if(from==='p'&&sp>=40&&!p.orbit&&!p.orb){p.life*=.85;p.life=Math.min(p.life,PRANGE/sp);}return p;};}
{const _lh=lineHit;lineHit=function(x,y,a,len,wid,fn){return _lh.call(this,x,y,a,Math.min(len,PRANGE),wid,fn);};}

// ---------- the trader buys: a hint when you walk into a shop ----------
// fallbacks in case an older cached src/12-loot.js loaded without the selling helpers
if(typeof window.inShop!=='function')window.inShop=function(){if(!map||!map.roomOf||!P)return false;const ri=map.roomOf[(P.y/T|0)*MW+(P.x/T|0)];return ri>=0&&!!map.rooms[ri]&&map.rooms[ri].type==='shop';};
{const _up=updPlay;updPlay=function(dt){_up.apply(this,arguments);if(!P||!map||map.train)return;const s=inShop();if(s&&!R._inShop)setToast('TRADER: OPEN YOUR INVENTORY (TAB) AND RMB AN ITEM TO SELL IT','#ffd040',3);R._inShop=s;};}

// ---------- trophies: every boss you beat adds one piece of gear you can see (any class), and says what it is ----------
const EVOGEAR=['','RED SCARF','WAR BANNER','SPIRIT WISP','GOLD PAULDRONS','HALO','BANNER CREST','SHADOW CAPE','WISP TRIO','GOLDEN AURA'];
function evoBack(st,X,Y,f,c){
 if(st>=7){const sw=Math.round(Math.sin(time*3)*1);ctx.fillStyle='#7a1020';ctx.fillRect(X-4-f*2+sw,Y-17,8,13);ctx.fillStyle='#a02030';ctx.fillRect(X-4-f*2+sw,Y-17,2,13);ctx.fillStyle='#e0b040';ctx.fillRect(X-4-f*2+sw,Y-5,8,1);}
 if(st>=2){const bx=X-f*5,big=st>=6;ctx.fillStyle='#3a2418';ctx.fillRect(bx,Y-(big?33:30),1,big?20:17);
  const wv=Math.round(Math.sin(time*4)),fw=big?7:5,fh=big?9:7;ctx.fillStyle=c;ctx.fillRect(bx-(f>0?fw:-1),Y-(big?33:30)+wv*0,fw,fh);ctx.fillStyle='#14101a';ctx.fillRect(bx-(f>0?fw:-1),Y-(big?33:30)+fh-1,fw,1);
  if(big){ctx.fillStyle='#e0b040';ctx.fillRect(bx-(f>0?fw:-1)+2,Y-30,3,3);ctx.fillStyle='#fff0a0';ctx.fillRect(bx-(f>0?fw:-1)+3,Y-29,1,1);}}
 if(st>=1){const L=6;for(let i=0;i<L;i++){const wx=X-f*(3+i*1.6),wy=Y-15+i*.6+Math.sin(time*7-i*.8)*1.2;ctx.fillStyle=i===L-1&&st>=6?'#e0b040':i%2?'#c01820':'#e02830';ctx.fillRect(Math.round(wx),Math.round(wy),2,2);}}}
function evoFront(st,X,Y,f){
 if(st>=4){ctx.fillStyle='#a07020';ctx.fillRect(X-6,Y-15,3,2);ctx.fillRect(X+3,Y-15,3,2);ctx.fillStyle='#ffd050';ctx.fillRect(X-6,Y-15,3,1);ctx.fillRect(X+3,Y-15,3,1);}
 if(st>=5){const gold=st>=9,y=Y-27+Math.round(Math.sin(time*2));ctx.fillStyle=gold?'#ffd040':'#d8f0ff';ctx.fillRect(X-3,y,7,1);ctx.fillRect(X-4,y+1,1,1);ctx.fillRect(X+4,y+1,1,1);ctx.fillRect(X-3,y+2,7,1);
  if(gold){ctx.fillRect(X-2,y-2,1,2);ctx.fillRect(X,y-3,1,3);ctx.fillRect(X+2,y-2,1,2);}}
 const nw=st>=8?3:st>=3?1:0;for(let i=0;i<nw;i++){const a=time*2.2+i*TAU/3,wx=X+Math.round(Math.cos(a)*11),wy=Y-12+Math.round(Math.sin(a)*4);ctx.globalAlpha=.35;ctx.fillStyle='#8cf';ctx.fillRect(wx-1,wy-1,3,3);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.fillRect(wx,wy,1,1);}
 if(st>=9)for(let i=0;i<6;i++){const ph=(time*1.5+i/6)%1,ax=X-7+((i*37)%15),ay=Y-2-ph*16;ctx.globalAlpha=1-ph;ctx.fillStyle=i%2?'#ffd040':'#ff9020';ctx.fillRect(ax,Math.round(ay),1,2);}ctx.globalAlpha=1;}
// The trophies are no longer drawn on the player: in a bullet hell nothing should crowd the hitbox. Your form still
// changes with each boss (the hero sprites themselves evolve). evoBack/evoFront are kept for menus that may show them.
