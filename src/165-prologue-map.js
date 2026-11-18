'use strict';
// SHINOBIDUNGEONS - simpler paths in the prologue. A normal stage grows as a tree of rooms with side branches, so a new
// player walks into dead ends and has to double back. In the prologue the layout is picked for flow: the stage is
// built as one winding road (MAPCHAIN in the map generator: every room grows off the previous one and is joined only to
// it, no loops), and of a few such layouts the one with no detours is kept: every room is on the way to the guardian.
function mapDeadEnds(m){const n=m.rooms.length,adj=m.rooms.map(()=>new Set()),seen=new Uint8Array(MW*MH),t=m.t,ro=m.roomOf;
 // rooms that touch directly
 for(let i=0;i<MW*MH;i++){if(!t[i]||ro[i]<0)continue;for(const d of [1,MW]){const j=i+d;if(t[j]&&ro[j]>=0&&ro[j]!==ro[i]){adj[ro[i]].add(ro[j]);adj[ro[j]].add(ro[i]);}}}
 // rooms joined by a passage
 for(let i=0;i<MW*MH;i++){if(!t[i]||ro[i]>=0||seen[i])continue;const touch=new Set(),q=[i];seen[i]=1;
  while(q.length){const k=q.pop();for(const d of [1,-1,MW,-MW]){const j=k+d;if(!t[j])continue;if(ro[j]>=0){touch.add(ro[j]);continue;}if(!seen[j]){seen[j]=1;q.push(j);}}}
  for(const a of touch)for(const b of touch)if(a!==b)adj[a].add(b);}
 let dead=0;m.rooms.forEach((r,i)=>{if(r.k==='room'&&adj[i].size<=1)dead++;});
 // rooms off the road: not on the shortest way from the start to the guardian (detours you have to come back from)
 const si=m.rooms.findIndex(r=>r.k==='start'),bi=m.rooms.findIndex(r=>r.k==='boss'),prev=new Array(n).fill(-2);prev[si]=-1;const q=[si];
 while(q.length){const a=q.shift();for(const b of adj[a])if(prev[b]===-2){prev[b]=a;q.push(b);}}
 const on=new Set();for(let c=bi;c>=0;c=prev[c])on.add(c);let off=0;m.rooms.forEach((r,i)=>{if(r.k==='room'&&!on.has(i))off++;});
 let edges=0;adj.forEach(a=>edges+=a.size);edges/=2;
 const nr=m.rooms.filter(r=>r.k==='room').length; // and long enough to hold its fights as well as the trader, shrine and altar
 m.offRoad=off;m.dead=dead;return off*10+dead*10+Math.max(0,edges-(n-1))+Math.max(0,6-nr)*4;}
{const _gm=genMap;genMap=function(di){if(!(typeof PRO_ON!=='undefined'&&PRO_ON))return _gm.apply(this,arguments);
 let best=null,bd=1e9;for(let k=0;k<12;k++){MAPCHAIN=true;let m;try{m=_gm.apply(this,arguments);}finally{MAPCHAIN=false;}let d=99;try{d=mapDeadEnds(m);}catch(_){}if(d<bd){bd=d;best=m;}if(d===0)break;}
 best.score=bd;return best;};}
