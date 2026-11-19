'use strict';
// SHINOBIDUNGEONS - the layered attack director and the fairness check for the late game.
// FAIRNESS: before any batch of new bullets appears, the next ~1.6s are simulated on a small grid around the player:
// existing bullets, the new batch, lasers and pending hazard circles are swept forward, and a flood fill asks whether
// the player can still reach a cell nobody threatens at every step, moving at their real speed WITHOUT dashing. If not,
// the new bullets nearest the player are removed one by one until a way through opens (or the batch is dropped).
// So no layering of patterns can ever close every gap, and no pattern needs a dash or invulnerability to survive.
// DIRECTOR: picks and layers compatible patterns. Every pattern has tags (field, radial, aimed, wall, arena, zone) and
// a complexity cost; a layer joins only if the tags get along (one arena-control pattern at a time, one wall, two
// fields, one aimed volley - two in the deepest tiers) and the total cost stays inside the tier's budget. It never
// picks the same family twice running, and it scales sophistication (narrower gaps, faster rotation, interlocking and
// reversing spirals, predictive aim, more layers) with the tier rather than piling on bullets.
const FAIR={VG:27,VC:7,TS:[.15,.3,.45,.6,.8,1.05,1.3,1.6],base:null,occ:null,reach:null,nxt:null,key:-1,stats:{checks:0,thinned:0,dropped:0,removed:0}};
FAIR.base=new Uint8Array(FAIR.VG*FAIR.VG*FAIR.TS.length);FAIR.occ=new Uint8Array(FAIR.base.length);FAIR.reach=new Uint8Array(FAIR.VG*FAIR.VG);FAIR.nxt=new Uint8Array(FAIR.VG*FAIR.VG);
function fairMark(occ,cx0,cy0,x,y,rad,si){const VG=FAIR.VG,VC=FAIR.VC,h=(VG-1)/2,gx=(x-cx0)/VC+h,gy=(y-cy0)/VC+h,rc=rad/VC;
 const x0=Math.max(0,Math.floor(gx-rc)),x1=Math.min(VG-1,Math.ceil(gx+rc)),y0=Math.max(0,Math.floor(gy-rc)),y1=Math.min(VG-1,Math.ceil(gy+rc));if(x0>x1||y0>y1)return;
 const off=si*VG*VG,r2=(rc+.5)*(rc+.5);for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++){const dx=i-gx,dy=j-gy;if(dx*dx+dy*dy<=r2)occ[off+j*VG+i]=1;}}
// a bullet's footprint on the grid over the next steps (straight-line forecast; hanging/orbiting shots stay put)
function fairBullet(occ,cx0,cy0,q){const rad=(q.r||3)+2,still=q.bst==='orbitrel'&&!q.rel||q.hung;
 for(let s=0;s<FAIR.TS.length;s++){const t=FAIR.TS[s];if(q.life!=null&&q.life<t)break;const x=still?q.x:q.x+q.vx*t,y=still?q.y:q.y+q.vy*t;fairMark(occ,cx0,cy0,x,y,rad,s);}}
function fairField(cx0,cy0){const occ=FAIR.base;occ.fill(0);const reach=FAIR.VG*FAIR.VC*.5+140;
 for(const q of projs){if(q.from!=='e'||q.dead)continue;if(Math.abs(q.x-cx0)>reach||Math.abs(q.y-cy0)>reach)continue;fairBullet(occ,cx0,cy0,q);}
 // lasers that are firing (or will be) during the window
 for(const L of LZ){for(let s=0;s<FAIR.TS.length;s++){const t=L.t+FAIR.TS[s];if(t<L.tele||t>L.tele+L.stay)continue;const a=L.a+(t>L.tele?L.om*(t-Math.max(L.tele,L.t)):0),c=Math.cos(a),sn=Math.sin(a);
  for(let d=0;d<L.len;d+=FAIR.VC*.8)fairMark(occ,cx0,cy0,L.x+c*d,L.y+sn*d,L.w/2+3,s);}}
 // hazard circles about to erupt
 if(typeof BMK!=='undefined')for(const m of BMK){if(m.k!=='c'||!m.dmg||m.fired)continue;for(let s=0;s<FAIR.TS.length;s++)if(Math.abs(m.t-FAIR.TS[s])<.2)fairMark(occ,cx0,cy0,m.x,m.y,m.r+3,s);}}
function fairReach(occ){const VG=FAIR.VG,N=VG*VG,R0=FAIR.reach,NX=FAIR.nxt,h=(VG-1)/2;R0.fill(0);R0[h*VG+h]=1;let prev=0;
 const spd=(S&&S.spd?S.spd:78)*.85,W=FAIR.wall||(FAIR.wall=new Uint8Array(N));
 // walls of the room block movement too
 for(let j=0;j<VG;j++)for(let i=0;i<VG;i++)W[j*VG+i]=solid(P.x+(i-h)*FAIR.VC,P.y+(j-h)*FAIR.VC)?1:0;
 for(let s=0;s<FAIR.TS.length;s++){const dtS=FAIR.TS[s]-prev;prev=FAIR.TS[s];const m=Math.max(1,Math.floor(spd*dtS/FAIR.VC)),off=s*N,offp=s>0?(s-1)*N:-1;
  // grow one cell at a time, only through cells clear now AND at the previous step, so you cannot hop through a line of shots
  const ok=c=>!W[c]&&!occ[off+c]&&(offp<0||!occ[offp+c]);
  for(let c=0;c<N;c++)if(R0[c]&&!ok(c))R0[c]=0;
  for(let it=0;it<m;it++){NX.set(R0);let grew=0;
   for(let j=0;j<VG;j++)for(let i=0;i<VG;i++){const c=j*VG+i;if(!R0[c])continue;
    for(let dj=-1;dj<=1;dj++){const y=j+dj;if(y<0||y>=VG)continue;for(let di=-1;di<=1;di++){const x=i+di;if(x<0||x>=VG)continue;const n=y*VG+x;if(NX[n]||!ok(n))continue;NX[n]=1;grew=1;}}}
   R0.set(NX);if(!grew)break;}
  // the cells still standing must be clear at this step
  let any=0;for(let c=0;c<N;c++)if(R0[c]){if(occ[off+c])R0[c]=0;else any=1;}
  if(!any)return false;}
 return true;}
// check a staged batch; thin it until the player has a way through
function bhFair(B,I){if(!P||!B.length)return;FAIR.stats.checks++;const cx0=P.x,cy0=P.y;
 if(FAIR.key!==R.time){FAIR.key=R.time;fairField(cx0,cy0);}
 const test=()=>{FAIR.occ.set(FAIR.base);for(const q of B)if(!q.dead)fairBullet(FAIR.occ,cx0,cy0,q);return fairReach(FAIR.occ);};
 if(test())return;
 // already boxed in before this batch (the field alone leaves no way through): add nothing to it
 FAIR.occ.set(FAIR.base);if(!fairReach(FAIR.occ)){for(const q of B)q.dead=true;FAIR.stats.boxed=(FAIR.stats.boxed||0)+1;return;}
 // carve one opening: find where the batch is thinnest around you (its widest angular gap) and remove the shots
 // nearest that bearing first, so a ring gets a doorway rather than a moth-eaten look
 const L=B.filter(q=>!q.dead).map(q=>{let d=1e9,bx=q.x,by=q.y;for(const t of FAIR.TS){const x=q.x+q.vx*t,y=q.y+q.vy*t,dd=Math.hypot(x-cx0,y-cy0);if(dd<d){d=dd;bx=x;by=y;}}return [Math.atan2(by-cy0,bx-cx0),d,q];});
 const angs=L.map(l=>l[0]).sort((a,b)=>a-b);let gi=0,gw=-1;for(let i=0;i<angs.length;i++){const a=angs[i],b=i+1<angs.length?angs[i+1]:angs[0]+TAU;if(b-a>gw){gw=b-a;gi=a+(b-a)/2;}}
 L.sort((a,b)=>Math.abs(angDiff(a[0],gi))-Math.abs(angDiff(b[0],gi))||a[1]-b[1]);
 let n=0;const cap=Math.min(L.length,24);for(const [,,q] of L){q.dead=true;n++;FAIR.stats.removed++;if(n%2===0||n===L.length){if(test()){FAIR.stats.thinned++;return;}}if(n>=cap)break;}
 for(const q of B)q.dead=true;FAIR.stats.dropped++;}
// ---------------- the director ----------------
const TAGS=I=>{const t=I.def.tags;return typeof t==='function'?t(I.p):t;};
const COST=I=>{const c=I.def.cost;return typeof c==='function'?c(I.p):c;};
// the tier's limits: complexity budget, layers at once, the pause between new layers
const TIERCAP=t=>({budget:t<=3?5.5:t===4?7.5:Math.min(11,8.5+.4*(t-5)),layers:t<=3?2:t===4?3:Math.min(4,3+Math.floor((t-5)/3)),gap:Math.max(.45,.95-.12*(t-3))});
function ldirCompatible(D,cand){const L=D.layers.filter(I=>!I.dead),tg=[...TAGS(cand)],cnt={};for(const I of L)for(const t of TAGS(I))cnt[t]=(cnt[t]||0)+1;for(const t of tg)cnt[t]=(cnt[t]||0)+1;
 const tier=D.tier,lim={arena:1,wall:1,field:2,aimed:tier>=5?2:1,zone:1,radial:2};for(const k in lim)if((cnt[k]||0)>lim[k])return false;
 if(cnt.arena&&cnt.wall&&tier<4)return false;
 const cost=L.reduce((s,I)=>s+COST(I),0)+COST(cand);return cost<=TIERCAP(tier).budget;}
// a director: {own, tier, pool:[{n (pattern), p:(tier,k)=>params, w, sig (signature)}], layers, hist, cd}
function ldirNew(own,tier,pool,o){return Object.assign({own,tier,pool,layers:[],hist:[],cd:.6,k:0},o||{});}
function ldirTick(D,dt){D.layers=D.layers.filter(I=>!I.dead);D.cd-=dt;const cap=TIERCAP(D.tier);if(D.cd>0||D.layers.length>=(D.maxLayers||cap.layers))return;
 // candidates: build each entry's instance description, keep the compatible ones, never the same family twice running
 const recent=D.hist.slice(-2),C=[];
 for(const E of D.pool){if(E.ok&&!E.ok(D))continue;const p=E.p?E.p(D.tier,D.k):{};const def=BHP[E.n];if(!def)continue;const cand={def,p:Object.assign({},def.def||{},p)};
  if(!ldirCompatible(D,cand))continue;const fam=E.n+(p.mode||'');let w=E.w||1;if(recent.includes(fam))w*=.08;if(D.layers.some(I=>I.name===E.n&&(I.p.mode||'')===(p.mode||'')))continue;C.push([w,E,p,fam]);}
 if(!C.length){D.cd=.4;return;}let r=Math.random()*C.reduce((s,c)=>s+c[0],0);let pick=C[0];for(const c of C){if((r-=c[0])<0){pick=c;break;}}
 const [,E,p,fam]=pick;const I=bhStart(D.own,E.n,p);if(!I){D.cd=.4;return;}D.layers.push(I);D.hist.push(fam);if(D.hist.length>8)D.hist.shift();D.k++;D.cd=(E.gap||cap.gap)*(D.gapK||1);D.last=E;}
function ldirStop(D){for(const I of D.layers)I.dead=1;D.layers.length=0;}
// ---------------- tier-scaled pattern pools (used by late stages, survival phases and late foes) ----------------
// Sophistication grows with the tier: 3 = advanced, 4 = endgame, 5+ = the endless depths.
const TSC=t=>Math.max(0,t-3); // 0,1,2,...
const LPOOL={
 field:t=>[
  {n:'spiral',w:2,p:(t)=>({arms:3+Math.min(2,TSC(t)),spin:.2+.03*TSC(t),rate:.12,sp:40+3*TSC(t),interlock:t>=4?1:0,rev:t>=4?2.4:0,swav:t>=5?.25:0,breathe:t>=6?.3:0,dur:5})},
  {n:'multispiral',w:t>=4?1.2:.6,p:(t)=>({n:2+Math.min(2,TSC(t)),spin:.28+.03*TSC(t),rate:.16,sp:38+2*TSC(t),dur:5})},
  {n:'dyn',w:1,p:(t)=>({mode:'curve',n:5+Math.min(2,TSC(t)),sp:52,curve:.8+.15*TSC(t),iv:.6,dur:4})},
  {n:'dyn',w:t>=4?1:.5,p:(t)=>({mode:'accel',n:5,sp:54+4*TSC(t),iv:.7,dur:4})}],
 radial:t=>[
  {n:'ring',w:2,p:(t)=>({cnt:18+2*TSC(t),sp:40+3*TSC(t),waves:3+Math.min(3,TSC(t)),wgap:.75-.05*TSC(t),gapW:Math.max(.5,.8-.06*TSC(t)),gapRot:.45+.1*TSC(t),stagger:1,conc:t>=4?[1,.78]:[1]})},
  {n:'dyn',w:1,p:(t)=>({mode:'split',n:6+TSC(t),sp:56,iv:.9-.06*TSC(t),dur:4})},
  {n:'dyn',w:t>=4?1:.4,p:(t)=>({mode:'orbit',n:5+Math.min(4,TSC(t)),sp:50+4*TSC(t),orad:20,ow:2.4,to:1.3,raim:t>=5,dur:3.4})},
  {n:'radialaim',w:t>=4?1:.5,p:(t)=>({cnt:16+2*TSC(t),sp:40,fan:5,fsp:78+6*TSC(t),iv:.8-.05*TSC(t),dur:4})}],
 aimed:t=>[
  {n:'aimed',w:1.5,p:(t)=>({mode:t>=4?'predict':'direct',n:3,sp:92+6*TSC(t),iv:.6,vol:4,dur:3})},
  {n:'aimed',w:1,p:(t)=>({mode:'successive',n:2,sp:88,iv:.45,vol:5,dur:3})},
  {n:'aimed',w:1,p:(t)=>({mode:'fan',n:3,sp:84,spread:.12,iv:.7,vol:3,dur:3})},
  {n:'aimed',w:t>=4?1:.4,p:(t)=>({mode:'trap',iv:1.1-.08*TSC(t),delay:.9,dur:4})},
  {n:'dyn',w:t>=4?1:.4,p:(t)=>({mode:'turn',n:3+Math.min(2,TSC(t)),sp:70,iv:1,dur:3.5})}],
 wall:t=>[
  {n:'cross',w:1,p:(t)=>({mode:'diag',sp:58+3*TSC(t),iv:.34,dur:4})},
  {n:'cross',w:1,p:(t)=>({mode:t>=4?'walls':'hv',sp:52+3*TSC(t),iv:1.1-.08*TSC(t),gap:Math.max(22,32-2*TSC(t)),dur:4.5})},
  {n:'arena',w:t>=4?1:.5,p:(t)=>({mode:'boundary',sp:56+3*TSC(t),iv:.55-.03*TSC(t),dur:4})}],
 arena:t=>[
  {n:'arena',w:1,p:(t)=>({mode:'laser',sweep:1.4+.15*TSC(t),tele:.9,stay:2,w:7,dur:3.6})},
  {n:'arena',w:t>=4?1:.5,p:(t)=>({mode:'rotlasers',n:2+Math.min(2,TSC(t)),om:.45+.08*TSC(t),dir:Math.random()<.5?1:-1,tele:1,stay:2.6,w:6,dur:4})},
  {n:'arena',w:t>=4?.8:.3,p:(t)=>({mode:'wall',sp:80,iv:.45,dur:3})},
  {n:'arena',w:t>=4?.8:.3,p:(t)=>({mode:'sequence',iv:.5,dur:4})}]};
const lpoolAll=t=>[].concat(LPOOL.field(t),LPOOL.radial(t),LPOOL.aimed(t),LPOOL.wall(t),LPOOL.arena(t));
// the survival phase of a late guardian: three movements (an opening, a build-up, and a climax), each a director of its
// own with a growing budget; the climax always ends on the arena closing in (a narrowing ring with a turning gap) or a
// laser wheel, plus aimed shots, so standing still at the edge or in a corner never works
function lateSurvival(o){const dur=o.dur||14;return {at:o.at,dur,name:o.name,hint:o.hint||'SURVIVE - KEEP MOVING',survival:true,storm:1,
 start(e,E){const A=arenaOf(e);E.home=freeSpot(e,A.cx,A.cy,e.r);E.m=-1;E.D=null;if(o.start)o.start(e,E);},
 tick(e,dt,E){e.x+=(E.home.x-e.x)*Math.min(1,dt*3);e.y+=(E.home.y-e.y)*Math.min(1,dt*3);const f=E.t/dur,m=f<.33?0:f<.72?1:2;
  if(m!==E.m){E.m=m;if(E.D)ldirStop(E.D);const t=(o.tier||e.lateTier||3)+m;const pool=m===2?(o.climax?o.climax(t):[].concat(LPOOL.arena(t).slice(0,2),LPOOL.aimed(t).slice(0,1),LPOOL.radial(t).slice(0,1),[{n:'arena',w:1.2,p:()=>({mode:'narrow',sp:48,iv:.45,dur:dur*.3})}])):(o.pool?o.pool(t,m):lpoolAll(t));
   E.D=ldirNew(e,t,pool,{maxLayers:m===2?TIERCAP(t).layers+1:undefined});if(m)txtFx(e.x,e.y-20,m===1?'THE STORM GROWS':'LAST LIGHT',bsty(e).c,1.5);}
  ldirTick(E.D,dt);if(o.tick)o.tick(e,dt,E);},
 end(e,E){if(E.D)ldirStop(E.D);bhStop(e);}};}
