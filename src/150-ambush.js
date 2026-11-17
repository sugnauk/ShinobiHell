'use strict';
// SHINOBIDUNGEONS - ambush rooms seal with real walls. Before, an ambush drew a red rectangle around the room's whole
// bounding box and clamped you inside it: the box was bigger than the room (so foes outside got pulled into the fight),
// and the spirit lanterns were put in the box's corners, which could be cut off behind cover where nothing could reach
// or hit them. Now:
//  - a wooden palisade bound with paper wards rises out of the ground across every doorway of the room itself, so the
//    arena is exactly the room you are standing in; the walls are solid to you, to foes and to bullets
//  - every wave spawns only on floor you can actually reach, and the lanterns go to open, reachable spots near the corners
//  - foes outside the walls can't be woken by the fight
//  - if a foe still ends up somewhere you can't reach, it is moved back into the arena after a few seconds
//  - when the last wave falls, the walls sink back into the ground
const AMBX={r:null,reach:null,walls:[],list:[]};
// the arena: the room's floor within a 14x14-tile square at its centre (smaller than the room)
const AMB_HALF=7;
function ambIn(r,i){const idx=map.rooms.indexOf(r),x=i%MW,y=(i/MW)|0,cx=r.x+r.w/2,cy=r.y+r.h/2;return map.t[i]&&map.roomOf[i]===idx&&Math.abs(x+.5-cx)<=AMB_HALF&&Math.abs(y+.5-cy)<=AMB_HALF;}
function ambReach(r){const seen=new Uint8Array(MW*MH),out=[],st=(P.y/T|0)*MW+(P.x/T|0);if(!ambIn(r,st))return out;
 const q=[st];seen[st]=1;while(q.length){const i=q.pop();out.push(i);for(const d of [1,-1,MW,-MW]){const j=i+d;if(seen[j]||!ambIn(r,j))continue;seen[j]=1;q.push(j);}}
 AMBX.reachSet=seen;return out;}
// the nearest open arena tile to a point
function ambNearest(r,x,y){let best=null,bd=1e9;const cx=r.x+r.w/2,cy=r.y+r.h/2;for(let ty=Math.floor(cy-AMB_HALF);ty<=cy+AMB_HALF;ty++)for(let tx=Math.floor(cx-AMB_HALF);tx<=cx+AMB_HALF;tx++){const i=ty*MW+tx;if(!ambIn(r,i))continue;
 const wx=tx*T+8,wy=ty*T+8;if(blocked(wx,wy,5))continue;const d=Math.hypot(wx-x,wy-y);if(d<bd){bd=d;best={x:wx,y:wy};}}return best;}
function ambSeal(r){if(AMBX.r===r)return;AMBX.r=r;
 // you are pulled inside the square if you are not already in it
 if(!ambIn(r,(P.y/T|0)*MW+(P.x/T|0))){const s=ambNearest(r,P.x,P.y);if(s){P.x=s.x;P.y=s.y;}}
 // walls: every floor tile touching the square from outside
 const walls=new Set(),cx=r.x+r.w/2,cy=r.y+r.h/2;
 for(let ty=Math.floor(cy-AMB_HALF)-1;ty<=cy+AMB_HALF+1;ty++)for(let tx=Math.floor(cx-AMB_HALF)-1;tx<=cx+AMB_HALF+1;tx++){const i=ty*MW+tx;if(!ambIn(r,i))continue;
  for(const d of [1,-1,MW,-MW]){const j=i+d;if(map.t[j]&&!ambIn(r,j))walls.add(j);}}
 AMBX.walls=[...walls];for(const j of AMBX.walls){map.t[j]=0;const x=(j%MW)*T+8,y=((j/MW)|0)*T+8;props.push({k:'gatewall',x,y,used:true,room:r,t0:time,j});}
 AMBX.reach=ambReach(r);
 // foes of this room that were outside the square come in with you
 for(const e of enemies){if(e.dead||e.room!==r)continue;const i=(e.y/T|0)*MW+(e.x/T|0);if(!AMBX.reachSet[i]){const s=ambNearest(r,e.x,e.y);if(s){e.x=s.x;e.y=s.y;}}}
 sfx('block');shake=Math.max(shake,6);}
function ambOpen(){if(!AMBX.r)return;for(const j of AMBX.walls)map.t[j]=1;for(const p of props)if(p.k==='gatewall'&&p.room===AMBX.r){p.down=time;}
 setTimeout(()=>{props=props.filter(p=>!(p.k==='gatewall'&&p.down));},700);AMBX.r=null;AMBX.walls=[];AMBX.reach=null;AMBX.reachSet=null;sfx('break');}
const ambSpot=(min)=>{const R2=AMBX.reach;if(!R2||!R2.length)return null;for(let t=0;t<40;t++){const i=pick(R2),x=(i%MW)*T+8,y=((i/MW)|0)*T+8;if(Math.hypot(x-P.x,y-P.y)<(min||40))continue;
 if(blocked(x,y,6))continue;return {x,y};}return null;};
// waves: on reachable floor only
{const _rs=roomSpawn;roomSpawn=function(r,n){if(!(r.ev&&r.ev.k==='ambush'))return _rs.apply(this,arguments);ambSeal(r);
 for(let i=0;i<n;i++){const s=ambSpot(40);if(!s)continue;const e=mkEnemy(pick(DUN[R.di].pool),s.x,s.y,r,R.di);e.awake=true;enemies.push(e);spark(s.x,s.y,'#f55',10,70);fxRing(s.x,s.y,12,'#f55',.3);}};}
// lanterns: the reachable spot nearest each corner, with room to walk round it
spawnLanterns=function(r){ambSeal(r);const pats=[{pat:'dspiral',arms:2,spin:.28,sp:48},{pat:'rose',cnt:10,petals:3,sp:46},{pat:'aimedring',cnt:10,sp:50}],P0=pick(pats),di=R.di||0,used=[];
 for(const [cx,cy] of [[r.x,r.y],[r.x+r.w,r.y],[r.x,r.y+r.h],[r.x+r.w,r.y+r.h]]){let best=null,bd=1e9;
  for(const i of AMBX.reach||[]){const x=(i%MW)*T+8,y=((i/MW)|0)*T+8;if(blocked(x,y,8)||used.some(u=>Math.hypot(u.x-x,u.y-y)<40)||Math.hypot(x-P.x,y-P.y)<50)continue;const d=Math.hypot(x-cx*T,y-cy*T);if(d<bd){bd=d;best={x,y};}}
  if(!best)continue;used.push(best);const e=mkEnemy('turret',best.x,best.y,r,di);
  Object.assign(e,{awake:true,hp:40+di*14,maxhp:40+di*14,lantern:1,tRate:1.1-Math.min(.4,di*.04),tt:.8+used.length*.15,tPat:Object.assign({dmg:7+di,pd:6,col:'#ffd070'},P0)});enemies.push(e);fxRing(best.x,best.y,14,'#ffd070',.4);spark(best.x,best.y,'#ffd070',12,60);}
 setToast('SPIRIT LANTERNS! BREAK THEM','#ffd070',2.2);};
// the fight stays inside: nobody outside the walls is woken by it
{const _wk=wake;wake=function(e){if(AMBX.r&&e&&e.room!==AMBX.r)return;return _wk.apply(this,arguments);};}
// open the walls when the ambush ends; rescue anything stuck where you can't reach it
{let chk=0;const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!AMBX.r)return;const ev=AMBX.r.ev;
 if(!ev||ev.state>=2){ambOpen();return;}
 if((chk-=dt)<=0){chk=2;const S2=AMBX.reachSet;if(S2)for(const e of enemies){if(e.dead||e.room!==AMBX.r||e.fly)continue;const i=(e.y/T|0)*MW+(e.x/T|0);
  if(!S2[i]){e._stuck=(e._stuck||0)+2;if(e._stuck>=4){const s=ambSpot(30);if(s){fxRing(e.x,e.y,12,'#c8a0ff',.3);e.x=s.x;e.y=s.y;e._stuck=0;spark(s.x,s.y,'#c8a0ff',10,60);}}}else e._stuck=0;}}};}
// leaving a stage mid-ambush (death, quitting) must not leave walls behind
{const _ld=loadDungeon;loadDungeon=function(){AMBX.r=null;AMBX.walls=[];AMBX.reach=null;AMBX.reachSet=null;return _ld.apply(this,arguments);};}
// no more red rectangle: the walls are the seal
{const _dre=drawRoomEvents;drawRoomEvents=function(){const act=[];for(const r of map.rooms){if(r.ev&&r.ev.k==='ambush'&&r.ev.state===1){act.push(r);r.ev.state=-1;}}try{_dre.apply(this,arguments);}finally{for(const r of act)r.ev.state=1;}};}
// the palisade: stakes rising out of the ground, a rope with paper wards, glowing seals
{const _dp=drawProp;drawProp=function(p){if(p.k!=='gatewall')return _dp.apply(this,arguments);
 const up=p.down?Math.max(0,1-(time-p.down)/.5):Math.min(1,(time-p.t0)/.3),h=Math.round(22*up*(up<1&&!p.down?1+Math.sin(up*Math.PI)*.15:1));if(h<=0)return;
 const tx=(p.j%MW)*T,ty=((p.j/MW)|0)*T,c=[[tx,ty],[tx+T,ty],[tx+T,ty+T],[tx,ty+T]].map(([x,y])=>[sx(x,y),sy(x,y)]),X=sx(p.x,p.y),Y=sy(p.x,p.y);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();c.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.fill();
 // stakes across the tile's diagonal
 for(let k=0;k<5;k++){const f=(k+.5)/5,x=Math.round(c[3][0]+(c[1][0]-c[3][0])*f),y=Math.round(c[3][1]+(c[1][1]-c[3][1])*f)+Math.round(Math.sin(f*Math.PI)*0);const sh=h-(k%2)*3;
  ctx.fillStyle='#14101a';ctx.fillRect(x-2,y-sh-1,5,sh+1);ctx.fillStyle=k%2?'#6a4428':'#7e5432';ctx.fillRect(x-1,y-sh,3,sh);ctx.fillStyle='#a0744a';ctx.fillRect(x-1,y-sh,1,sh);ctx.fillStyle='#4a2e1a';ctx.fillRect(x,y-sh-2,1,2);}
 if(h>10){const ry=Y-Math.round(h*.55);ctx.fillStyle='#c8a868';ctx.fillRect(Math.min(c[3][0],c[1][0]),ry,Math.abs(c[1][0]-c[3][0]),1);
  const gl=Math.floor(time*4+p.j)%2;ctx.fillStyle='#14101a';ctx.fillRect(X-2,ry,5,8);ctx.fillStyle='#f4ecd0';ctx.fillRect(X-1,ry+1,3,6);ctx.fillStyle=gl?'#ff3030':'#c01010';ctx.fillRect(X,ry+2,1,3);}
 if(up<1&&!p.down&&Math.random()<.3)particles.push({x:p.x+rnd(-6,6),y:p.y+rnd(-6,6),vx:rnd(-20,20),vy:rnd(-10,0),t:.4,col:'#8a7058'});};}
