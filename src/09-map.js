'use strict';
// HELL OF THE EMPEROR - map generation and rendering (part of the former game.js; files load in numeric order, see index.html)
// ---------- map generation ----------
function genMap(di){
 const t=new Uint8Array(MW*MH),rooms=[];
 const carve=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>0&&j>0&&i<MW-1&&j<MH-1)t[j*MW+i]=1;};
 const hit=(a,b,m)=>a.x-m<b.x+b.w&&a.x+a.w+m>b.x&&a.y-m<b.y+b.h&&a.y+a.h+m>b.y;
 // big arenas: rooms are ~1.5x the old size, the boss arena 32x32
 // rooms grow as a winding chain from the start: each new room sits just 3-6 tiles from the one it grows off,
 // so hallways stay short while the rooms themselves are big arenas. The east strip is kept for the boss.
 rooms.push({x:3,y:ri(30,MH-44),w:14,h:14,k:'start'});
 const want=7+Math.floor(di*.4)+ri(0,2);
 const free=(r,boss)=>r.x>=2&&r.y>=2&&r.y+r.h<=MH-2&&r.x+r.w<=(boss?MW-2:MW-40)&&!rooms.some(o=>hit(r,o,2));
 for(let tr=0;tr<5000&&rooms.length<want+1;tr++){
  const par=rooms[Math.max(0,rooms.length-1-ri(0,2))]; // mostly grow off the newest rooms (a chain with short side branches)
  const big=Math.random()<.4,w=big?ri(25,32):ri(17,24),h=big?ri(22,29):ri(16,22),gap=ri(3,6),d=wpick([{d:0,wt:5},{d:1,wt:2},{d:2,wt:2},{d:3,wt:.5}]).d;
  let x,y;if(d===0||d===3){x=d===0?par.x+par.w+gap:par.x-gap-w;y=par.y+ri(-Math.floor(h/2),Math.floor(par.h/2));}
  else{x=par.x+ri(-Math.floor(w/2),Math.floor(par.w/2));y=d===1?par.y-gap-h:par.y+par.h+gap;}
  const r={x,y,w,h,k:'room'};if(free(r))rooms.push(r);}
 {const last=rooms.reduce((a,b)=>b.x+b.w>a.x+a.w?b:a);let placed=false;
  for(let tr=0;tr<300&&!placed;tr++){const r={x:MW-35,y:clamp(Math.round(last.y+last.h/2-16)+ri(-6,6),2,MH-34),w:32,h:32,k:'boss'};if(free(r,true)){rooms.push(r);placed=true;}}
  if(!placed)rooms.push({x:MW-35,y:clamp(Math.round(last.y+last.h/2-16),2,MH-34),w:32,h:32,k:'boss'});}
 // assign room types (shuffled so specials land in different places every run)
 const mids=rooms.filter(r=>r.k==='room');for(let i=mids.length-1;i>0;i--){const j=ri(0,i);[mids[i],mids[j]]=[mids[j],mids[i]];}
 mids.forEach((r,i)=>r.type=ROOMORDER[i]||'combat');
 // the trader only sets up shop every other stage (II, IV, VI...): on the others that room is a fight
 if(di%2===0)for(const r of mids)if(r.type==='shop')r.type='combat';
 // the shop sits in one of the last rooms before the boss: swap it into a room among the closest to the boss room
 {const br=rooms.find(r=>r.k==='boss'),bd=r=>Math.hypot(r.x+r.w/2-br.x-br.w/2,r.y+r.h/2-br.y-br.h/2),sh=mids.find(r=>r.type==='shop');
  if(sh){const near=[...mids].sort((a,b)=>bd(a)-bd(b)).slice(0,2),tg=pick(near);if(tg!==sh){const t=tg.type;tg.type='shop';sh.type=t;}}}
 const set=(i,j,v)=>{if(i>0&&j>0&&i<MW-1&&j<MH-1)t[j*MW+i]=v;};
 // room shapes: specials stay simple with an open centre, fights get varied arenas
 const SHAPES=['rect','round','round','cross','cave','cave','cave','hall','ring','octa'];
 for(const r of rooms){
  r.shape=r.k==='start'?'octa':r.k==='boss'?'arena':['combat','elite','trap'].includes(r.type)?pick(r.type==='elite'?['round','cross','cave','hall','octa']:SHAPES):pick(['rect','round','octa']);
  const w=r.w,h=r.h,mx=r.x+(w-1)/2,my=r.y+(h-1)/2;
  for(let j=r.y;j<r.y+h;j++)for(let i=r.x;i<r.x+w;i++){
   const nx=(i-mx)/(w/2),ny=(j-my)/(h/2);let ok=true;
   switch(r.shape){
    case 'round':ok=nx*nx+ny*ny<=1.08;break;
    case 'cave':{const a=Math.atan2(ny,nx),rr=.82+.22*Math.sin(a*3+r.x)+.12*Math.sin(a*5+r.y)+.1*(hash(i,j)-.5);ok=Math.hypot(nx,ny)<=rr;break;}
    case 'cross':ok=Math.abs(nx)<=.42||Math.abs(ny)<=.42;break;
    case 'octa':case 'arena':ok=Math.abs(nx)+Math.abs(ny)<=1.45;break;
   }
   if(ok)set(i,j,1);
  }
  if(r.shape==='ring'&&w>=12&&h>=12)for(let j=r.y+5;j<r.y+h-5;j++)for(let i=r.x+5;i<r.x+w-5;i++)set(i,j,0);
  if(r.shape==='hall'){for(let i=r.x+2;i<r.x+w-2;i+=3){set(i,r.y+2,0);set(i,r.y+h-3,0);}}
  if(r.shape==='cross'||r.shape==='cave'){set(Math.round(mx),Math.round(my),1);}
  if(r.shape==='rect'&&['combat','trap'].includes(r.type)&&w>=9&&h>=9){const np=ri(1,3);for(let k=0;k<np;k++){const px=ri(r.x+2,r.x+w-4),py=ri(r.y+2,r.y+h-4);if(Math.abs(px-(r.x+(w>>1)))<2&&Math.abs(py-(r.y+(h>>1)))<2)continue;for(let jj=0;jj<2;jj++)for(let ii=0;ii<2;ii++)set(px+ii,py+jj,0);}}
  if(r.k==='boss'){const c=[[6,6],[w-8,6],[6,h-8],[w-8,h-8]];for(const [px,py] of c)for(let jj=0;jj<2;jj++)for(let ii=0;ii<2;ii++)set(r.x+px+ii,r.y+py+jj,0);}
  // organic outlines: round alcoves and bulges around the edge so rooms are not perfect boxes (the boss arena stays clean)
  if(r.k!=='boss'){const nb=Math.round((w+h)/5);for(let k=0;k<nb;k++){const side=ri(0,3),f=Math.random();
   const ex=side<2?r.x+f*w:(side===2?r.x:r.x+w-1),ey=side<2?(side===0?r.y:r.y+h-1):r.y+f*h,rad=rnd(1.6,3.2);
   for(let jj=Math.floor(ey-rad);jj<=ey+rad;jj++)for(let ii=Math.floor(ex-rad);ii<=ex+rad;ii++)if((ii-ex)**2+(jj-ey)**2<=rad*rad)set(ii,jj,1);}}
 }
 rooms.sort((a,b)=>(a.x+a.w/2)-(b.x+b.w/2));
 const cx=r=>r.x+(r.w>>1),cy=r=>r.y+(r.h>>1),rd=(a,b)=>Math.hypot(cx(a)-cx(b),cy(a)-cy(b));
 // corridors: L-shaped with a random bend order and width, with a jog in the middle of long runs
 const seg=(x0,y0,x1,y1,wd)=>{const o=wd>>1;if(y0===y1)carve(Math.min(x0,x1)-o,y0-o,Math.abs(x1-x0)+wd,wd);else carve(x0-o,Math.min(y0,y1)-o,wd,Math.abs(y1-y0)+wd);};
 // winding passages: a round brush walks toward the target room, swaying side to side as it goes (wide enough to keep dodging)
 const brush=(x,y,wd)=>{const rr=wd/2;for(let j=Math.floor(y-rr);j<=y+rr;j++)for(let i=Math.floor(x-rr);i<=x+rr;i++)if((i-x)**2+(j-y)**2<=rr*rr+.5)set(i,j,1);};
 const link=(a,b)=>{let x=cx(a),y=cy(a),n=0,drift=0;const bx=cx(b),by=cy(b),wd=Math.random()<.5?4:3;
  while((x!==bx||y!==by)&&n<900){n++;if(Math.random()<.12)drift=ri(-1,1);
   const ddx=bx-x,ddy=by-y;
   if(ddx&&(!ddy||Math.abs(ddx)>Math.abs(ddy)*(.5+Math.random()))){x+=Math.sign(ddx);if(drift&&ddy&&Math.random()<.35)y+=drift;}
   else{y+=Math.sign(ddy);if(drift&&ddx&&Math.random()<.35)x+=drift;}
   x=clamp(x,2,MW-3);y=clamp(y,2,MH-3);brush(x,y,wd);}
  brush(bx,by,wd);};
 // tree: each room links to its nearest room further left; the boss room gets exactly one way in
 const links=new Set();
 for(let i=1;i<rooms.length;i++){let best=0,bd=1e9;for(let j=0;j<i;j++){const d=rd(rooms[i],rooms[j]);if(d<bd){bd=d;best=j;}}link(rooms[best],rooms[i]);links.add(best+'-'+i);}
 // a few loops so the dungeon is not a single line
 const nb=rooms.length-1;let loops=ri(2,3);for(let tr=0;tr<60&&loops>0;tr++){const i=ri(1,nb-1),j=ri(1,nb-1);if(i===j||links.has(Math.min(i,j)+'-'+Math.max(i,j))||rd(rooms[i],rooms[j])>44)continue;links.add(Math.min(i,j)+'-'+Math.max(i,j));link(rooms[i],rooms[j]);loops--;}
 // smoothing: fill sharp inside corners so rooms and passages flow into each other
 for(let pass=0;pass<2;pass++){const c=t.slice();for(let j=2;j<MH-2;j++)for(let i=2;i<MW-2;i++){if(c[j*MW+i])continue;let nn=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if((a||b)&&c[(j+b)*MW+i+a])nn++;if(nn>=5)t[j*MW+i]=1;}}
 // at least one monster room before any treasure: every room linked to the start is a fight, so specials sit deeper in
 // (checked on the real floor: walk out from the start and every room you can enter first must be a fight)
 {const inR=(r,x,y)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h,s=rooms.find(r=>r.k==='start'),seen=new Uint8Array(MW*MH),first=new Set();
  const st=(s.y+(s.h>>1))*MW+s.x+(s.w>>1),q=[st];seen[st]=1;
  while(q.length){const i=q.pop(),x=i%MW,y=(i/MW)|0,r=rooms.find(o=>o!==s&&inR(o,x,y));if(r){first.add(r);continue;}
   for(const d of [1,-1,MW,-MW]){const j=i+d;if(t[j]&&!seen[j]){seen[j]=1;q.push(j);}}}
  const isFight=k=>['combat','elite','ambush','trap'].includes(k);
  for(const r of first){if(r.k!=='room'||isFight(r.type))continue;
   const sw=rooms.find(o=>o.k==='room'&&!first.has(o)&&o.type==='combat');if(sw){const k=r.type;r.type='combat';sw.type=k;}else r.type='combat';}}
 // reopen room centres that corridors or shapes may have closed
 for(const r of rooms)if(r.shape!=='ring')set(cx(r),cy(r),1);
 // liquid pools (water, lava, poison...) inside rooms, kept away from room centres
 const env=ENV[di],liq=new Uint8Array(MW*MH);
 if(env.liq)for(const r of rooms){if(r.k==='start')continue;const n=Math.round(r.w*r.h*env.amt/6)+(Math.random()<env.amt*4?1:0);
  for(let b=0;b<n;b++){const bx=ri(r.x+1,r.x+r.w-2),by=ri(r.y+1,r.y+r.h-2),rx=rnd(1.2,r.k==='boss'?2.2:3.4),ry=rnd(1.2,r.k==='boss'?2.2:3.4);
   for(let j=Math.floor(by-ry);j<=by+ry;j++)for(let i=Math.floor(bx-rx);i<=bx+rx;i++){if(i<1||j<1||i>=MW-1||j>=MH-1||!t[j*MW+i])continue;const d=((i-bx)/rx)**2+((j-by)/ry)**2;if(d>1+.3*(hash(i,j)-.5))continue;if(Math.abs(i-cx(r))<=2&&Math.abs(j-cy(r))<=2)continue;liq[j*MW+i]=env.liq;}}}
 // swamps also flood parts of corridors
 if(env.k==='swamp')for(let j=1;j<MH-1;j++)for(let i=1;i<MW-1;i++)if(t[j*MW+i]&&!rooms.some(r=>i>=r.x&&i<r.x+r.w&&j>=r.y&&j<r.y+r.h)&&Math.sin(i*.35)+Math.cos(j*.4)>1.1)liq[j*MW+i]=1;
 // which room each tile belongs to (special rooms get their own floors and props)
 const roomOf=new Int8Array(MW*MH).fill(-1);rooms.forEach((r,ri2)=>{for(let j=r.y;j<r.y+r.h;j++)for(let i=r.x;i<r.x+r.w;i++)if(t[j*MW+i])roomOf[j*MW+i]=ri2;});
 const vis=new Uint8Array(MW*MH);
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(t[i])continue;let near=false;for(let j=-1;j<=1&&!near;j++)for(let k=-1;k<=1;k++){const xx=x+k,yy=y+j;if(xx>=0&&yy>=0&&xx<MW&&yy<MH&&t[yy*MW+xx]){near=true;break;}}if(near)vis[i]=(y+1<MH&&t[i+MW])?2:1;}
 const liqList=[];for(let i=0;i<MW*MH;i++)if(liq[i])liqList.push(i);
 return {t,vis,rooms,liq,liqList,env,roomOf,expl:new Uint8Array(MW*MH),startRoom:rooms.find(r=>r.k==='start'),bossRoom:rooms.find(r=>r.k==='boss')};
}
// ---- environment texturing (baked into the floor canvas) ----
const P1=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w||1,h||1);};
function isoLn(g,c,x,y,n,dx){g.fillStyle=c;for(let i=0;i<n;i++)g.fillRect(x+i*2*dx,y+Math.round(i*2*ISOK),2,1);} // a line along an iso axis (follows the camera pitch)
function drawLiquidTile(g,X,Y,x0,y0,lq,h,tu,tv){
 // neighbour checks run in the rotated grid so banks sit on the correct screen edges at every camera angle
 const L=map.env.lc,at=(i,j)=>{const [a,b]=tileW(i,j);return a>=0&&b>=0&&a<MW&&b<MH&&map.liq[b*MW+a];},x=tu,y=tv;
 // flat liquid fill so neighbouring tiles merge into one pool, with soft wave bands
 for(let j=0;j<TILEH;j++){const half=dHalf(j);P1(g,L[1],X-half,Y+j,half*2,1);}
 for(let k=0;k<3;k++){const wy=Y+3+k*4+((h*5)|0)%2,wx=X-8+((hash(x+k,y)*12)|0);P1(g,L[0],wx,wy,6+k*2,1);}
 if(h>.3&&h<.5){P1(g,L[2],X-2+((h*30)|0)%6,Y+5,3,1);P1(g,L[2],X-1+((h*30)|0)%6,Y+6,1,1);}
 // banks where the pool meets ground
 const bank=lq===2?'#3a1a10':lq===4?'#c8e0f0':'#2a2418';
 if(!at(x-1,y)){isoLn(g,bank,X-2,Y,8,-1);isoLn(g,bank,X-2,Y+1,8,-1);}
 if(!at(x,y-1)){isoLn(g,bank,X,Y,8,1);isoLn(g,bank,X,Y+1,8,1);}
 if(!at(x+1,y))isoLn(g,L[2],X+14,Y+HY,8,-1);
 if(!at(x,y+1))isoLn(g,L[2],X-16,Y+HY,8,1);
 if(lq===1||lq===5){if(h>.55&&h<.62)P1(g,L[2],X-4,Y+6,4,1);if(h<.12)P1(g,L[2],X+3,Y+9,3,1);}
 if(lq===2){if(h<.4)P1(g,'#ffd060',X-3+((h*40)|0)%6,Y+7,2,1);if(h>.85)P1(g,'#ff8020',X-6,Y+5,5,2);}
 if(lq===3&&h>.8){P1(g,L[2],X-2,Y+6,2,2);}
 if(lq===4){isoLn(g,'#ffffff',X-6,Y+5,3,1);if(h>.6)isoLn(g,'#e0f0ff',X+2,Y+8,3,-1);}
 // lily pads in the swamp
 if(map.env.k==='swamp'&&lq===1&&h>.78){const ox=((h*91)|0)%10-5;P1(g,'#14101a',X+ox-3,Y+6,7,4);P1(g,'#4a8a3a',X+ox-2,Y+7,5,2);P1(g,'#6aaa4a',X+ox-1,Y+7,2,1);if(h>.95)P1(g,'#f8a0c0',X+ox,Y+6,2,1);}
}
function floorDeco(g,X,Y,x,y,h,th){
 const k=map.env.k,h2=hash(x+57,y+13),cx=X-6+((h*997)|0)%12,cy=Y+5+((h*571)|0)%6;
 const nearLiq=map.liq[(y)*MW+x+1]||map.liq[(y+1)*MW+x]||map.liq[y*MW+x-1]||map.liq[(y-1)*MW+x];
 const tuft=(c,c2)=>{P1(g,c,cx,cy,1,2);P1(g,c,cx+2,cy-1,1,3);P1(g,c2||c,cx+4,cy,1,2);};
 const reeds=()=>{for(let i=0;i<3;i++){const rx=X-5+i*4+((h2*7)|0)%3,hh=4+((h*13+i*5)|0)%4;P1(g,'#5a7a2a',rx,Y+10-hh,1,hh);P1(g,'#7a4a20',rx,Y+9-hh,1,2);}};
 switch(k){
  case 'grass':
   if(h<.5)tuft('#5a7a34','#6a8a40');if(h>.93)P1(g,pick(['#f0e070','#f0f0f0','#e05050','#c080f0']),cx,cy,2,1);
   if(h2<.06){P1(g,'#14101a',X-3,Y+6,7,4);P1(g,'#7a7a6a',X-2,Y+6,5,3);P1(g,'#9a9a88',X-1,Y+6,2,1);}
   if(nearLiq&&h2>.5)reeds();break;
  case 'swamp':
   if(h<.35)P1(g,'#2a3420',cx-2,cy,6,2);if(h>.4&&h<.7)tuft('#4a6a2a','#5a7a30');
   if(nearLiq&&h2>.35)reeds();if(h2<.05){P1(g,'#3a2a1a',X-4,Y+7,8,2);P1(g,'#5a4a30',X-3,Y+7,6,1);}
   if(h>.96){P1(g,'#d8d0a0',cx,cy-2,1,2);P1(g,'#c84040',cx-1,cy-3,3,1);}break;
  case 'stone':
   isoLn(g,shade(th.fl[0],-.25),X-8,Y+4,8,1);if(h<.25)isoLn(g,shade(th.fl[0],-.25),X+6,Y+5,4,-1);
   if(h>.9)P1(g,'#14101a',cx,cy,3,1),P1(g,'#14101a',cx+2,cy+1,2,1);
   if(h2<.1)P1(g,'#3a4a2a',cx-1,cy,4,1);break;
  case 'temple': // raked gravel garden (karesansui), the odd fallen maple leaf and a few garden stones
   for(let i=1;i<4;i++)isoLn(g,shade(th.fl[0],-.14),X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);
   if(h2<.25)P1(g,pick(['#e07020','#c03020','#f0a030']),cx,cy,2,1);
   if(h>.97){P1(g,'#14101a',X-4,Y+5,9,5);P1(g,'#5a5a62',X-3,Y+5,7,4);P1(g,'#7a7a82',X-2,Y+5,3,1);P1(g,'#3e6a32',X-3,Y+8,3,1);}break;
  case 'planks': // tatami: straw weave inside dark cloth borders, mats two tiles long
   for(let i=1;i<4;i++)isoLn(g,shade(th.fl[0],.07),X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);
   isoLn(g,'#2e3a1e',X-16,Y+HY,8,1);if(x%2===0)isoLn(g,'#2e3a1e',X,Y,8,1);
   if(h>.96)P1(g,'#5a5a30',cx,cy,2,1);break;
  case 'ember':
   if(h<.35)P1(g,'#2a1410',cx-2,cy,6,2);if(h>.9){isoLn(g,'#f06020',cx-4,cy,3,1);P1(g,'#ffc040',cx,cy+1,1,1);}
   if(h2<.04){P1(g,'#14101a',X-4,Y+6,8,3);P1(g,'#3a2418',X-3,Y+6,6,2);}break;
  case 'snow':
   if(h<.4)P1(g,'#ffffff',cx,cy,2,1);if(h2<.15)P1(g,'#b8c8e0',cx-3,cy+2,3,1);
   if(h2>.96){P1(g,'#14101a',X-3,Y+6,7,4);P1(g,'#6a7a90',X-2,Y+6,5,3);P1(g,'#ffffff',X-2,Y+5,5,1);}break;
  case 'marble': // jade tiles with a gold lattice every other tile, sakura petals
   if(x%2===0)isoLn(g,'#c8a040',X-16,Y+HY,8,1);if(y%2===0)isoLn(g,'#c8a040',X,Y,8,1);
   if(h<.2)isoLn(g,shade(th.fl[0],.2),cx-4,cy,3,1);if(h2<.14)P1(g,'#f8b8d0',cx,cy,2,1);break;
  case 'cave':
   if(h<.4)P1(g,th.sp,cx,cy,2,1);
   if(h2>.94){const c=pick(['#c040e0','#e04060','#40c0a0']);P1(g,'#14101a',cx-2,cy-3,5,5);P1(g,'#d8d0c0',cx,cy-1,1,3);P1(g,c,cx-1,cy-2,3,1);P1(g,shade(c,.4),cx,cy-2,1,1);}break;
  case 'blood':
   if(h<.3)P1(g,'#3a0a10',cx-2,cy,5,2);if(h2>.95){P1(g,'#e8e0d0',cx,cy,4,1);P1(g,'#e8e0d0',cx,cy-1,1,1);P1(g,'#e8e0d0',cx+3,cy+1,1,1);}break;
 }
}
// ---- special-room floors: each event room is tiled in its own style ----
function diaIn(g,X,Y,ins,col){g.fillStyle=col;for(let j=ins;j<TILEH-ins;j++){const half=dHalf(j)-ins*2;if(half>0)g.fillRect(X-half,Y+j,half*2,1);}}
const SPECFLOOR={
 rest:{fl:['#34503a','#3a5840'],deco:(g,X,Y,x,y,h,r)=>{const d=Math.hypot(x-(r.x+(r.w>>1)),y-(r.y+(r.h>>1)));
  if(Math.abs(d-5.5)<.7){diaIn(g,X,Y,3,'#5a5a52');diaIn(g,X,Y,5,'#7a7a72');P1(g,'#9a9a90',X-2,Y+5,3,1);}
  else{if(h<.3)P1(g,'#c8c8b8',X-3+((h*40)|0)%6,Y+7,2,1);if(h>.82){P1(g,'#5a8a3a',X-4,Y+8,1,2);P1(g,'#6aa046',X-2,Y+7,1,3);P1(g,'#5a8a3a',X,Y+8,1,2);}}}},
 shop:{fl:['#6e4a2c','#77512f'],deco:(g,X,Y,x,y,h,r)=>{for(let i=1;i<4;i++)isoLn(g,'#5a3a20',X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);
  if(Math.abs(x-(r.x+(r.w>>1)))<=1&&Math.abs(y-(r.y+(r.h>>1)))<=Math.floor(r.h/2)-2){diaIn(g,X,Y,1,'#e0b040');diaIn(g,X,Y,2,'#8a1a20');if(h>.5)P1(g,'#b03030',X-2,Y+7,4,1);}}},
 shrine:{fl:['#2e2440','#352a4a'],deco:(g,X,Y,x,y,h,r)=>{const d=Math.hypot(x-(r.x+(r.w>>1)),y-(r.y+(r.h>>1)));
  if(Math.abs(d-4.5)<.7){P1(g,'#c6f',X-3,Y+6,1,3);P1(g,'#c6f',X-3,Y+6,4,1);P1(g,'#c6f',X+1,Y+8,1,2);P1(g,'#e8c8ff',X-1,Y+7,1,1);}
  else if(h>.9)P1(g,'#8a6ab0',X+((h*30)|0)%8-4,Y+6,1,1);isoLn(g,'#241a34',X-8,Y+4,8,1);}},
 altar:{fl:['#3a1418','#43181d'],deco:(g,X,Y,x,y,h,r)=>{const d=Math.hypot(x-(r.x+(r.w>>1)),y-(r.y+(r.h>>1)));
  if(Math.abs(d-4)<.6){P1(g,'#f33',X-4,Y+7,8,1);P1(g,'#ff8080',X-1,Y+7,2,1);}
  if(h<.3){isoLn(g,'#1a0608',X-6,Y+5,4,1);isoLn(g,'#1a0608',X+2,Y+7,3,-1);}if(h>.93)P1(g,'#6a0a14',X-2,Y+6,4,2);}},
 treasure:{fl:['#5a4a2a','#65532f'],deco:(g,X,Y,x,y,h)=>{if(x%2===0)isoLn(g,'#c8a040',X-16,Y+HY,8,1);if(y%2===0)isoLn(g,'#c8a040',X,Y,8,1);if(h>.9){P1(g,'#ffe080',X-1,Y+6,2,1);P1(g,'#fff',X-1,Y+6,1,1);}}}};
// Door sills feather the event-room material into the adjoining walkable floor.
const ROOM_SILLS={shop:['#b08c53','#715338'],shrine:['#9983bb','#4b3d63'],altar:['#c26d65','#5c343b']};
function floorRoom(x,y){
 const i=map.roomOf?.[y*MW+x];
 return i>=0?map.rooms[i]:null;
}
function drawRoomSill(g,X,Y,x,y,room,fl,neighbors){
 const own=room?.type,materials=[];
 for(const n of neighbors){
  const nx=x+n.dx,ny=y+n.dy;
  if(nx<0||ny<0||nx>=MW||ny>=MH||!map.t[ny*MW+nx]||map.liq[ny*MW+nx])continue;
  const other=floorRoom(nx,ny)?.type,inside=ROOM_SILLS[own],outside=ROOM_SILLS[other];
  if(own===other||(!inside&&!outside))continue;
  materials.push({u:n.u,v:n.v,sill:inside||outside,color:SPECFLOOR[inside?own:other].fl[(x+y)&1],inside:!!inside});
 }
 if(!materials.length)return;
 for(let py=1;py<TILEH-1;py++){
  const hw=dHalf(py);
  for(let px=1-hw;px<hw-1;px++){
   const u=(py/HY+(px+.5)/16)/2,v=(py/HY-(px+.5)/16)/2;
   for(const m of materials){
    const d=m.u?(m.u<0?u:1-u):(m.v<0?v:1-v);
    const noise=hash(x*31+px,y*29+py),width=m.inside?.24:.31;
    if(d>=width*(.7+noise*.58)||d<0)continue;
    const along=m.u?v:u,metal=d<.075&&along>.13&&along<.87;
    g.fillStyle=metal?m.sill[noise>.26?0:1]:noise>.52?m.color:shade(fl,-.16);
    g.fillRect(X+px,Y+py,1,1);break;
   }
  }
 }
}
// Pre-renders the floor as 32x16 diamonds into one big canvas, and builds wall-cube sprites (drawn depth-sorted at runtime).
function renderMap(th){
 const FW=(MW+MH)*16,FH=(MW+MH)*HY+TILEH+WH,edges=th.fl.map(c=>shade(c,-.14));
 const [ox,oy]=tileR(0,0);
 const neighbors=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>{
  const [u,v]=tileR(dx,dy);return {dx,dy,u:u-ox,v:v-oy};
 });
 const floor=mk(FW,FH,g=>{
  g.fillStyle='#07060a';g.fillRect(0,0,FW,FH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
   if(!map.t[y*MW+x])continue;
   // place the tile by its position in the rotated grid (the camera angle)
   const [tu,tv]=tileR(x,y),X=(tu-tv+RMH)*16,Y=(tu+tv)*HY,ci=(x+y)&1,h=hash(x,y),lq=map.liq[y*MW+x];
   if(lq){drawLiquidTile(g,X,Y,x,y,lq,h,tu,tv);continue;}
   const rm=floorRoom(x,y),SF=rm&&SPECFLOOR[rm.type];
   const fl=SF?SF.fl:th.fl,ed=SF?SF.fl.map(c=>shade(c,-.18)):edges;
   for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillStyle=ed[ci];g.fillRect(X-half,Y+j,half*2,1);if(j>0&&j<TILEH-1&&half>2){g.fillStyle=fl[ci];g.fillRect(X-half+2,Y+j,half*2-4,1);}}
   if(SF)SF.deco(g,X,Y,x,y,h,rm);else floorDeco(g,X,Y,x,y,h,th);
   drawRoomSill(g,X,Y,x,y,rm,fl[ci],neighbors);
   g.fillStyle='rgba(0,0,0,.3)';
   if(!floorAtR(tu-1,tv))for(let j=0;j<HY;j++)g.fillRect(X-Math.round((j+1)/ISOK),Y+j,6,2);
   if(!floorAtR(tu,tv-1))for(let j=0;j<HY;j++)g.fillRect(X+Math.round((j+1)/ISOK)-6,Y+j,6,2);
  }
 });
 const top=shade(th.wf,.12),lf=th.wf,rf=shade(th.wf,-.32),ln=shade(th.wf,-.5),ed=th.we,hw=Math.floor(WH/2),walls=[];
 // faceY(x): the screen row where the top diamond's lower edge meets the wall face, at column x
 const faceY=x=>HY+Math.floor((x<16?x:31-x)*ISOK);
 for(let mask=0;mask<4;mask++)for(let v=0;v<2;v++)walls.push(mk(32,TILEH+WH,g=>{
  for(let x=0;x<32;x++){
   const j=faceY(x),left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;
   g.fillStyle=left?lf:rf;g.fillRect(x,j+1,1,WH);
   g.fillStyle=ln;g.fillRect(x,j+1+hw,1,1);g.fillRect(x,j+WH,1,1);
   if((x+(v?4:0))%8===0)g.fillRect(x,j+2,1,hw-1);
   if((x+(v?0:4))%8===0)g.fillRect(x,j+2+hw,1,hw-2);
  }
  for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillStyle=top;g.fillRect(16-half,j,half*2,1);g.fillStyle=ed;g.fillRect(16-half,j,1,1);g.fillRect(16+half-1,j,1,1);}
  g.fillStyle=ed;g.fillRect(14,0,4,1);
  if(v){g.fillStyle='rgba(255,255,255,.07)';g.fillRect(10,6,5,2);g.fillRect(18,9,3,1);}
  const wd=map.env.wall;
  if(wd==='hedge'){ // leafy tops and vines down the faces
   const lv=['#2e4a22','#3e5e2a','#56782f'];
   for(let j=1;j<TILEH-1;j++){const half=dHalf(j);for(let x=16-half+1;x<16+half-1;x++){const hh=hash(x*3+v*7,j*5+mask);if(hh<.55){g.fillStyle=lv[hh<.2?0:hh<.42?1:2];g.fillRect(x,j,1,1);}}}
   for(let x=0;x<32;x+=3){const left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;const j=faceY(x),len=2+((hash(x,v+mask)*6)|0);g.fillStyle=lv[1];g.fillRect(x,j+1,1,len);g.fillStyle=lv[2];g.fillRect(x,j+1,1,1);}
  }else if(wd==='snow'){
   for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillStyle=j===0||j===TILEH-1?'#c8d8ea':'#eef4fb';g.fillRect(16-half+1,j,half*2-2,1);}
   for(let x=1;x<31;x+=2){const left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;const j=faceY(x);g.fillStyle='#eef4fb';g.fillRect(x,j+1,1,1+((hash(x,mask+v)*3)|0));}
   g.fillStyle='#fff';g.fillRect(12,5,6,2);
  }else if(wd){
   // helpers: every visible face column (x, its top row j, which face), and every inner pixel of the top diamond
   const face=fn=>{for(let x=0;x<32;x++){const left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;fn(x,faceY(x),left);}};
   const topD=fn=>{for(let j=1;j<TILEH-1;j++){const half=dHalf(j);for(let x=16-half+1;x<16+half-1;x++)fn(x,j);}};
   const px=(c,x,y,h)=>{g.fillStyle=c;g.fillRect(x,y,1,h||1);};
   const roof=(a,b)=>{topD((x,j)=>px(((x>>1)+j+v)%3===0?a:b,x,j));px(a,14,0);px(a,15,0);px(a,16,0);px(a,17,0);};
   if(wd==='bamboo'){ // bamboo fence: green poles with dark nodes, leafy tops
    face((x,j,left)=>{const pole=(x>>1)%2,c=left?(pole?'#5a8a30':'#4e7a2a'):(pole?'#3e6222':'#34561e');px(c,x,j+1,WH);if(x%2===0)px(left?'#7aa84a':'#4a7230',x,j+1,WH);
     px('#22381a',x,j+3+((x>>1)%3));px('#22381a',x,j+7+((x>>1)%2));});
    topD((x,j)=>{const hh=hash(x*3+v*7,j*5+mask);px(hh<.5?'#24401c':hh<.85?'#2e4a22':hh<.97?'#3e6a2a':'#7aa04a',x,j);});
   }else if(wd==='shoji'){ // castle: paper screens in dark wooden frames under a grey tiled roof
    face((x,j,left)=>{px(left?'#e8e0c8':'#c4bca4',x,j+1,WH);if(x%5===0)px('#3a2418',x,j+1,WH);px('#3a2418',x,j+1);px('#3a2418',x,j+1+hw);px('#2a1810',x,j+WH);});
    roof('#2a3038','#4a5260');
   }else if(wd==='lacquer'){ // shrine walls: red lacquer, gold trim, posts, glazed roof tiles
    const rf=map.env.roof||['#2a3038','#4a5260'];
    face((x,j,left)=>{px(left?'#a01c18':'#701210',x,j+1,WH);px('#e0b040',x,j+1);px('#1a0a0a',x,j+WH);if(x%8===0)px('#2a1010',x,j+2,WH-2);});
    roof(rf[0],rf[1]);
   }else if(wd==='palace'){ // palace: white plaster, red band, golden roof tiles
    face((x,j,left)=>{px(left?'#e8e4dc':'#b8b4ac',x,j+1,WH);px('#b02018',x,j+1,2);px('#e0b040',x,j+3);if(x%8===0)px('#8a1010',x,j+4,WH-4);});
    roof('#8a6420','#b08a34');
   }
  }
 }));
 return {floor,walls,FW,FH};
}
const solid=(x,y)=>{if(x<0||y<0)return true;const tx=(x/T)|0,ty=(y/T)|0;if(tx>=MW||ty>=MH)return true;return !map.t[ty*MW+tx];};
const blocked=(x,y,r)=>solid(x-r,y-r)||solid(x+r,y-r)||solid(x-r,y+r)||solid(x+r,y+r);
function move(e,dx,dy,r){if(!blocked(e.x+dx,e.y,r))e.x+=dx;if(!blocked(e.x,e.y+dy,r))e.y+=dy;}
