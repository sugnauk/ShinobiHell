'use strict';
// SHINOBIDUNGEONS - DRAGON SPIRIT (the onmyoji's ultimate) is a dragon. A spirit dragon's head - antlers, glowing eye,
// snapping jaws and trailing whiskers, shedding motes behind it - bursts from the onmyoji and swims along the aim line,
// weaving as it goes, right over the blasts it calls down, then fades away.
// It is drawn under the bullets, so it never hides a shot.
const DRAGONS=[];
const DRG={len:170,dur:1.05,segs:22,gap:6.5,col:'#6cf',lite:'#c8f4ff',dark:'#1e5a8a',ink:'#0c1a2a',gold:'#ffd060'};
{const _cs=castShow;castShow=function(k){const r=_cs.apply(this,arguments);try{if(k==='e'&&P&&SPELLS.e[P.lo.e]&&SPELLS.e[P.lo.e].n==='DRAGON SPIRIT'){
 let len=DRG.len;for(let s=10;s<=DRG.len;s+=4){const x=P.x+Math.cos(P.aim)*s,y=P.y+Math.sin(P.aim)*s;if(solid(x,y)){len=s;break;}}
 DRAGONS.push({x0:P.x,y0:P.y,a:P.aim,len:Math.max(60,len),t0:time});}}catch(_){}return r;};}
// a point on the dragon's path: d along the aim line, weaving side to side, flying above the ground
function drgAt(D,d,ph){const ca=Math.cos(D.a),sa=Math.sin(D.a),w=Math.sin(d*.07-ph)*7*Math.min(1,d/30);
 const x=D.x0+ca*d-sa*w,y=D.y0+sa*d+ca*w;return {x:sx(x,y),y:sy(x,y)-14-Math.sin(d*.05)*3,wx:x,wy:y};}
function drawDragon(D){const k=(time-D.t0)/DRG.dur;if(k>1.35)return false;
 const head=Math.min(1,k)*D.len,fade=k>1?1-(k-1)/.35:1,ph=time*9;ctx.globalAlpha=.9*fade;
 // head, facing along the path
 const h=drgAt(D,head,ph),hb=drgAt(D,Math.max(0,head-6),ph),fx=Math.sign(h.x-hb.x)||(Math.cos(D.a)>=0?1:-1),X=Math.round(h.x),Y=Math.round(h.y);
 const Z=1.5,R=(x,y,w,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(fx>0?X+x*Z:X-(x+w)*Z),Math.round(Y+y*Z),Math.ceil(w*Z),Math.ceil(hh*Z));};
 R(-5,-6,14,11,DRG.ink);R(-4,-5,12,9,DRG.col);R(-4,-5,12,3,DRG.lite);           // skull
 R(6,-2,6,6,DRG.ink);R(6,-1,5,2,DRG.lite);R(6,2,5,2,DRG.col);                      // snout and lower jaw (open)
 const jaw=Math.floor(time*10)%2;R(7,1,4,jaw?2:1,'#ff5060');                       // mouth
 R(2,-3,2,2,'#fff');R(3,-3,1,1,DRG.gold);                                          // eye
 R(-4,-9,2,4,DRG.gold);R(-6,-11,2,3,DRG.gold);R(0,-9,2,4,DRG.gold);R(-1,-11,2,2,DRG.gold); // antlers
 // whiskers trailing back
 ctx.strokeStyle=DRG.lite;ctx.lineWidth=1;ctx.beginPath();for(const s of [-1,1]){const sx0=fx>0?X+15:X-15,sy0=Y+(s<0?-2:4);ctx.moveTo(sx0,sy0);
  ctx.quadraticCurveTo(sx0-fx*8,sy0+s*4+Math.sin(ph)*2,sx0-fx*16,sy0+s*2+Math.sin(ph+1)*3);}ctx.stroke();
 // a few motes shed from the body
 if(k<1&&Math.random()<.7)particles.push({x:h.wx,y:h.wy,vx:rnd(-12,12),vy:rnd(-20,-6),t:.45,col:Math.random()<.5?DRG.col:DRG.lite});
 ctx.globalAlpha=1;return true;}
// drawn after the sprites and before the bullets
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);for(let i=DRAGONS.length-1;i>=0;i--)if(!drawDragon(DRAGONS[i]))DRAGONS.splice(i,1);};}
{const _ld=loadDungeon;loadDungeon=function(){DRAGONS.length=0;return _ld.apply(this,arguments);};}
