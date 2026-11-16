'use strict';
// ===== FLOORS: every fight room gets a centrepiece painted into its floor, in its stage's own style =====
// I trampled clearings and ash, II plank boardwalks, III dark moss, IV cobbled patches, V a packed-snow path with
// footprints, VI muddy cart ruts, VII a stone mosaic, VIII drain grates and stains, IX red rugs, X raked sand and stepping
// stones, XI jade and gold inlay, XII a red carpet runner. Painted once into the floor image, so it costs nothing per frame.
function floorTiles(r,fn){for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const i=y*MW+x;if(!map.t[i]||map.liq[i])continue;const [tu,tv]=tileR(x,y);fn(x,y,(tu-tv+RMH)*16,(tu+tv)*HY);}}
function fDia(g,X,Y,c,a,ins){ins=ins||0;g.globalAlpha=a==null?1:a;g.fillStyle=c;for(let j=ins;j<TILEH-ins;j++){const half=dHalf(j)-ins*2;if(half>0)g.fillRect(X-half,Y+j,half*2,1);}g.globalAlpha=1;}
const FLOORART=[
 // I: a trampled clearing: an oval of dirt with ash at its heart
 (g,r,cx,cy,x,y,X,Y)=>{const d=Math.hypot((x-cx)/(r.w*.32),(y-cy)/(r.h*.32));if(d<1){fDia(g,X,Y,'#4a3e28',.55*(1-d*d));if(d<.3)fDia(g,X,Y,'#2a2620',.5,3);if(hash(x,y)<.12)g.fillStyle='#6a5a3a',g.fillRect(X-3,Y+9,2,1);}},
 // II: two plank boardwalks crossing the room
 (g,r,cx,cy,x,y,X,Y)=>{if(Math.abs(x-cx)<1||Math.abs(y-cy)<1){fDia(g,X,Y,'#6a5a3a',.9,1);g.fillStyle='#4a3e28';for(let k=-12;k<12;k+=4)g.fillRect(X+k,Y+HY-1,2,1);g.fillStyle='#8a7a52';g.fillRect(X-8,Y+5,16,1);}},
 // III: dark moss and the odd glowing spore
 (g,r,cx,cy,x,y,X,Y)=>{const h=hash(x*3,y*5);if(h<.3){fDia(g,X,Y,'#1a2a1e',.45,2);if(h<.05){g.fillStyle='#a060e0';g.fillRect(X,Y+10,1,1);}}},
 // IV: cobbled patches where the street survived the fire
 (g,r,cx,cy,x,y,X,Y)=>{const d=Math.hypot((x-cx)/(r.w*.4),(y-cy)/(r.h*.25));if(d<1&&hash(x,y*7)>.25){fDia(g,X,Y,'#4a3a32',.7,1);g.fillStyle='#2a1e18';for(let k=0;k<3;k++)g.fillRect(X-8+k*6,Y+6+(k%2)*5,4,1);}},
 // V: a packed-snow path with footprints, crossing the room
 (g,r,cx,cy,x,y,X,Y)=>{if(Math.abs((x-cx)-(y-cy)*.6)<1.2){fDia(g,X,Y,'#a8b8cc',.55,2);if((x+y)%2){g.fillStyle='#8898ac';g.fillRect(X-3,Y+8,2,1);g.fillRect(X+2,Y+12,2,1);}}},
 // VI: muddy cart ruts
 (g,r,cx,cy,x,y,X,Y)=>{if(Math.abs(y-cy)<=1){fDia(g,X,Y,'#2e2a22',.6,1);g.fillStyle='#1e1a14';isoLn(g,'#1e1a14',X-14,Y+HY-3,7,1);isoLn(g,'#1e1a14',X-12,Y+HY+3,6,1);}},
 // VII: a square stone mosaic in the middle of the room
 (g,r,cx,cy,x,y,X,Y)=>{const dx=Math.abs(x-cx),dy=Math.abs(y-cy);if(dx<=3&&dy<=3){fDia(g,X,Y,(dx+dy)%2?'#9a9282':'#b0a894',.85,1);if(dx===3||dy===3)fDia(g,X,Y,'#7a2a1e',.6,4);}},
 // VIII: drain grates and dark stains
 (g,r,cx,cy,x,y,X,Y)=>{const h=hash(x*7,y*3);if(h<.18)fDia(g,X,Y,'#0a0a0e',.35,2);if(x===Math.round(cx)&&y===Math.round(cy)){fDia(g,X,Y,'#1a1a20',1,3);g.fillStyle='#4a4a54';for(let k=-6;k<=6;k+=3)g.fillRect(X+k,Y+5,1,12);}},
 // IX: red rugs with gold borders
 (g,r,cx,cy,x,y,X,Y)=>{const dx=Math.abs(x-cx),dy=Math.abs(y-cy);if(dx<=2&&dy<=4){fDia(g,X,Y,'#8a1a1a',.95,1);if(dx===2||dy===4)fDia(g,X,Y,'#c09030',.8,6);}},
 // X: raked sand circle and stepping stones
 (g,r,cx,cy,x,y,X,Y)=>{const d=Math.hypot(x-cx,y-cy);if(d<3.2){fDia(g,X,Y,'#d8ccb0',.9,1);isoLn(g,'#b8ac90',X-12,Y+HY,6,1);}else if(Math.abs(x-cx)<1&&hash(x,y)<.7){g.fillStyle='#8a8a82';g.fillRect(X-4,Y+8,8,4);g.fillStyle='#a8a8a0';g.fillRect(X-4,Y+8,8,1);}},
 // XI: jade and gold inlay in a ring
 (g,r,cx,cy,x,y,X,Y)=>{const d=Math.hypot(x-cx,y-cy);if(d>2.4&&d<3.6)fDia(g,X,Y,'#3e9a6a',.7,2);else if(d<1.2)fDia(g,X,Y,'#e0b040',.8,3);},
 // XII: a red carpet runner with gold trim, the length of the room
 (g,r,cx,cy,x,y,X,Y)=>{const dx=Math.abs(x-cx);if(dx<=1){fDia(g,X,Y,'#6a0a14',1,0);if(dx===1)fDia(g,X,Y,'#c09030',.9,7);}}];
{const _rm=renderMap;renderMap=function(th){const M=_rm.apply(this,arguments);if(!map||map.train||!R)return M;const art=FLOORART[R.di];if(!art)return M;const g=M.floor.getContext('2d');
 for(const r of map.rooms){if(r.k!=='room'||!['combat','elite','ambush','challenge'].includes(r.type)||r.w<9||r.h<9)continue;const cx=r.x+r.w/2-.5,cy=r.y+r.h/2-.5;
  floorTiles(r,(x,y,X,Y)=>art(g,r,cx,cy,x,y,X,Y));}
 return M;};}

// ---------- mood: a soft vignette in each stage's own light, drawn under the HUD ----------
const MOOD=[['#0a1a08',.38],['#08201c',.38],['#0a0614',.6],['#3a0800',.42],['#c8dcf0',.22],['#0a0a10',.34],['#1a0a04',.26],['#000000',.62],['#0a0a14',.32],['#2a0a1a',.2],['#06140e',.26],['#200006',.5]];
const MOODC={};
function moodCanvas(di){const key=di+":"+W+"x"+H;if(MOODC[key])return MOODC[key];const [c,a]=MOOD[di]||['#000',.3];return MOODC[key]=mk(W,H,g=>{const gr=g.createRadialGradient(W/2,H/2+6,Math.min(W,H)*.32,W/2,H/2+6,Math.max(W,H)*.66);
 const h=c.slice(1),n=parseInt(h,16),rgb=(n>>16)+','+((n>>8)&255)+','+(n&255);gr.addColorStop(0,'rgba('+rgb+',0)');gr.addColorStop(1,'rgba('+rgb+','+a+')');g.fillStyle=gr;g.fillRect(0,0,W,H);});}
{const _dre=drawRoomEvents;drawRoomEvents=function(){_dre.apply(this,arguments);if(map&&!map.train&&R&&MOOD[R.di])ctx.drawImage(moodCanvas(R.di),0,0);};}
