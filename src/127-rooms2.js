'use strict';
// HELL OF THE EMPEROR - room and presentation fixes: enemy dots on the minimap, guarded treasure rooms,
// shop entrances at every opening, no attacking while a boss changes phase, a proper letterbox for boss intros,
// and the guardians' portraits in the guide.

// ---------- minimap: every foe you have seen the ground of is a small red dot ----------
{const _dm=drawMinimap;drawMinimap=function(){_dm.apply(this,arguments);if(R.fog===R.di||!P)return;
 const k=64/(MW+MH),mw=Math.round((MW+MH)*k),ox=W-mw-3,oy=3,mp=(x,y)=>{const [u,v]=tileR(x,y);return [ox+Math.round((u-v+RMH)*k),oy+Math.round((u+v)*k)];};
 ctx.fillStyle='#ff3030';
 for(const e of enemies){if(e.dead||e.boss||e.type==='dummy'||e.type==='turret')continue;const tx=e.x/T|0,ty=e.y/T|0;if(tx<0||ty<0||tx>=MW||ty>=MH||!map.expl[ty*MW+tx])continue;const q=mp(tx,ty);ctx.fillRect(q[0],q[1],1,1);if(e.elite)ctx.fillRect(q[0]+1,q[1],1,1);}
 const q=mp(P.x/T|0,P.y/T|0);ctx.fillStyle='#fff';ctx.fillRect(q[0]-1,q[1]-1,3,3);};} // you stay on top

// ---------- treasure rooms: a crowd guards the chest, and it stays sealed until the room is clear ----------
function chestLocked(p){return !!(p&&p.k==='chest'&&!p.used&&p.room&&p.room.type==='treasure'&&enemies.some(e=>!e.dead&&e.room===p.room));}
{const _pr=populateRoom;populateRoom=function(r,di){_pr.apply(this,arguments);if(r.type!=='treasure')return;
 const pool=DUN[di].pool,n=6+Math.floor(di/2)+(r.w*r.h>250?2:0);
 for(let k=0;k<n;k++){const s=spotIn(r);enemies.push(mkEnemy(pick(pool),s.x,s.y,r,di));}
 if(di>=2){const s=spotIn(r);enemies.push(mkElite(pick(pool.filter(t=>t!=='wisp')),s.x,s.y,r,di));}};}
{const _in=interact;interact=function(){const p=nearProp();if(chestLocked(p)&&!(nearBag()&&nearBag().items.length)){sfx('block');setToast('THE CHEST IS SEALED. DEFEAT EVERY FOE IN THE ROOM','#e0b040',2.5);return;}return _in.apply(this,arguments);};}
// the seal: a red paper ward and a chain across the lid while guards remain; it burns away when the last one falls
{const _dp=drawProp;drawProp=function(p){_dp.apply(this,arguments);if(p.k!=='chest'||p.used)return;const L=chestLocked(p),X=Math.round(sx(p.x,p.y)),Y=Math.round(sy(p.x,p.y));
 if(L){p.wasL=1;ctx.fillStyle='#4a4652';ctx.fillRect(X-9,Y-7,18,2);ctx.fillStyle='#8a8494';for(let i=-9;i<9;i+=3)ctx.fillRect(X+i,Y-7,2,1);
  ctx.fillStyle='#14101a';ctx.fillRect(X-3,Y-12,6,10);ctx.fillStyle='#e8d8b0';ctx.fillRect(X-2,Y-11,4,8);ctx.fillStyle='#c02020';ctx.fillRect(X-1,Y-10,2,1);ctx.fillRect(X-1,Y-8,2,3);
  const n=enemies.filter(e=>!e.dead&&e.room===p.room).length,s=n+' LEFT';if(dist(p,P)<90)txt(s,X-Math.round(txtW(s)/2),Y-22,'#ff7060');}
 else if(p.wasL){p.wasL=0;sfx('rare');fxRing(p.x,p.y,26,'#ffd040',.5);spark(p.x,p.y-6,'#ffb040',14,70);setToast('THE SEAL BREAKS - THE CHEST IS OPEN','#ffd040',2);}};}

// ---------- the shop: lanterns wide apart at every opening into it, and the sign beside one of them ----------
dressShopEntrance=function(r){
 const index=map.rooms.indexOf(r),seen=new Set(),groups=[];
 const isExit=(x,y,dx,dy)=>{const i=y*MW+x;if(!map.t[i]||map.liq[i]||map.roomOf[i]!==index)return false;const nx=x+dx,ny=y+dy,v=ny*MW+nx;return nx>0&&ny>0&&nx<MW-1&&ny<MH-1&&map.t[v]&&!map.liq[v]&&map.roomOf[v]<0;};
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const key=x+','+y+','+dx+','+dy;if(seen.has(key)||!isExit(x,y,dx,dy))continue;
  // one opening: the run of exit tiles along the wall
  const g=[],st=[[x,y]];seen.add(key);while(st.length){const [cx,cy]=st.pop();g.push([cx,cy]);for(const [ax,ay] of [[dy,dx],[-dy,-dx]]){const nx=cx+ax,ny=cy+ay,k2=nx+','+ny+','+dx+','+dy;if(!seen.has(k2)&&isExit(nx,ny,dx,dy)){seen.add(k2);st.push([nx,ny]);}}}
  groups.push({g,dx,dy});}
 groups.forEach(({g,dx,dy},gi)=>{
  // along = the axis running beside the opening
  const ax=Math.abs(dy),ay=Math.abs(dx),along=g.map(([x,y])=>x*ax+y*ay),lo=Math.min(...along),hi=Math.max(...along),fx=g[0][0],fy=g[0][1];
  const at=a=>({x:(ax?a:fx)*T+8-dx*4,y:(ay?a:fy)*T+8-dy*4});
  const posts=[];for(const [a0,step] of [[lo,-1],[hi,1]]){let put=null;for(const off of [2,1.5,1]){const a=a0+step*off,q=at(a);if(!solid(q.x,q.y)){put=q;break;}}if(put){posts.push(put);props.push({k:'doorpost',x:put.x,y:put.y,used:true,room:r,gate:'shop'});}}
  // the sign hangs just inside, beside the far lantern, so it never sits in the doorway
  if(posts.length){const pp=posts[posts.length-1],sx2=pp.x-dx*14+ax*8,sy2=pp.y-dy*14+ay*8;props.push({k:'entrancePlaque',x:solid(sx2,sy2)?pp.x-dx*14:sx2,y:solid(sx2,sy2)?pp.y-dy*14:sy2,used:true,room:r,gate:'shop'});}});};

// ---------- boss phase changes: your hands are still while the guardian transforms ----------
{const busy=()=>!!(boss&&boss.phx&&!boss.dead),gate=f=>function(){if(busy())return;return f.apply(this,arguments);};
 castBolt=gate(castBolt);castHeavy=gate(castHeavy);castChain=gate(castChain);castWard=gate(castWard);castF=gate(castF);castUlt=gate(castUlt);}

// ---------- boss intro: a real letterbox, drawn over the HUD so it frames the whole screen ----------
{const _rp=renderPlay;let hold=0;renderPlay=function(){_rp.apply(this,arguments);
 const live=introT>0&&introE&&!introE.camOnly;if(live)hold=Math.min(1,(INTRO-introT)/.3,introT/.3);else hold=0;if(hold<=0)return;
 const bar=Math.round(H*.12*hold);ctx.fillStyle='#000';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
 const el=INTRO-introT;if(el>.4&&introT>.3){const a=Math.min(1,(el-.4)/.3,(introT-.3)/.3);ctx.globalAlpha=a;const nm=introE.name||'',sc=txtW(nm,2)>W-20?1:2;
  txt(nm,Math.round((W-txtW(nm,sc))/2),H-bar+Math.round((bar-7*sc)/2)-2,'#f55',sc);
  const sub=ROMAN[R.di]+'. '+DUN[R.di].name+' - GUARDIAN';txt(sub,Math.round((W-txtW(sub))/2),Math.round(bar/2)-3,'#ccc');ctx.globalAlpha=1;}};}
{const _di=drawIntro;drawIntro=function(){};} // the old bars and card are replaced by the letterbox above

// ---------- the guide: each guardian's portrait beside its tale ----------
// the portrait takes the art slot at the left of the card (first two frames, scaled to fit), and the stage's tale sits beside it
const GPORT={};
function guidePortrait(i){if(GPORT[i])return GPORT[i];let s;try{s=bossSheet(i);}catch(_){return null;}if(!s||!s.c)return null;
 const sc=Math.min(1,64/s.fh,64/s.fw),fw=Math.round(s.fw*sc),fh=Math.round(s.fh*sc),c=mk(fw*2,fh,()=>{}),g=c.getContext('2d');g.imageSmoothingEnabled=false;
 for(let f=0;f<2;f++)g.drawImage(s.c,f*s.fw,0,s.fw,s.fh,f*fw,0,fw,fh);return GPORT[i]={c,fw,fh,frames:2};}
{const _ge=guideEntries;guideEntries=function(tab){const L=_ge(tab);if(tab===1)L.forEach((e,i)=>{if(!e.u||!BOSS[i])return;const P2=guidePortrait(i);if(!P2)return;e.spr=()=>P2;const tale=(DUN[i]&&DUN[i].tale)||'';if(tale)e.L=[tale,...e.L];});return L;};}
